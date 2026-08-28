const SITE = { plannerName: "Jordan", plannerEmail: "" };
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = (n, currency) => new Intl.NumberFormat("en-US", {style:"currency",currency,maximumFractionDigits: currency === "JPY" ? 0 : 2}).format(n || 0);
const parseNum = v => Number(v) || 0;
let pricing = null;
let lastTrip = null;

function showToast(message){const el=$("#toast"); if(!el)return; el.textContent=message; el.classList.add("show"); clearTimeout(showToast.t); showToast.t=setTimeout(()=>el.classList.remove("show"),2200)}
function daysBetween(a,b){if(!a||!b)return 0;const x=new Date(a+"T12:00:00"),y=new Date(b+"T12:00:00");return Math.max(0,Math.round((y-x)/86400000))}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

async function loadPricing(){
  try{const res=await fetch("data/pricing.json",{cache:"no-store"}); if(!res.ok)throw new Error("pricing"); pricing=await res.json(); renderRates(); renderOffers(); renderTravelTools(); syncDestination();}
  catch(e){console.error(e); showToast("Pricing data could not load. Try refreshing.")}
}

function renderRates(){
  const grid=$("#rate-grid"); if(!grid||!pricing)return; grid.innerHTML="";
  Object.entries(pricing.destinations).forEach(([key,d])=>{
    let primary="Live lookup", note=d.ageNote||""; let badge="live";
    if(d.ticketModel==="starting"){primary=`${d.symbol}${d.adultOneDayFrom} from`;badge="verified"}
    if(d.ticketModel==="multiday_exact"){primary=`${d.symbol}${d.multiDay[3].adult} / 3-day`;badge="verified"}
    if(d.ticketModel==="date_exact_adult"){primary=`${d.symbol}${d.adultOneDayFrom.toLocaleString()}+`;badge="dated"}
    if(d.ticketModel==="tiered"){primary=`${d.symbol}${d.tiers[1].adult}–${d.tiers[4].adult}`;badge="verified"}
    if(d.ticketModel==="range"){primary=`${d.symbol}${d.adultOneDayMin}–${d.adultOneDayMax}`;badge="verified"}
    if(d.ticketModel==="hotel_live_lookup") primary="Room quote";
    grid.insertAdjacentHTML("beforeend",`<article class="rate-card"><span class="place">${d.location}</span><h3>${d.name}</h3><div class="rate-number">${primary}</div><p>${note}</p><div><i class="data-tag ${badge}">${badge==="dated"?"date exact":badge==="verified"?"published":"live check"}</i></div><a class="source-link magic-click" href="${d.sourceUrl}" target="_blank" rel="noopener">Official source ↗</a></article>`)
  });
  bindMagicClicks();
}

function renderOffers(){
  const grid=$("#offer-grid"); if(!grid||!pricing)return; grid.innerHTML="";
  Object.values(pricing.destinations).forEach(d=>d.offers?.forEach(o=>{
    const price=o.price!=null?`${d.symbol}${Number(o.price).toLocaleString()} ${o.unit}`:o.unit;
    const valid=o.validThrough?`Through ${new Date(o.validThrough+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`:"Current offer; recheck dates";
    grid.insertAdjacentHTML("beforeend",`<article class="offer-card"><span class="offer-place">${d.name}</span><h3>${o.title}</h3><div class="offer-price">${price}</div><p>${o.detail}</p><div class="offer-meta">${valid}<br>${o.eligibility}</div><a class="magic-click" href="${o.sourceUrl}" target="_blank" rel="noopener">Verify offer ↗</a></article>`)
  })); bindMagicClicks();
}

function renderTravelTools(){const wrap=$("#travel-tools");if(!wrap||!pricing)return;wrap.innerHTML=pricing.travelTools.map(t=>`<a class="travel-tool magic-click" href="${t.url}" target="_blank" rel="noopener"><div><strong>${t.name}</strong><small>${t.use}</small></div><span>↗</span></a>`).join("");bindMagicClicks()}

function getTicketCost(d, {startDate,adults,children,parkDays,ticketStyle}){
  adults=parseNum(adults); children=parseNum(children); parkDays=parseNum(parkDays);
  if(parkDays===0 || ["aulani","cruise"].includes(d.key)) return {total:0,confidence:"live",message:d.key==="cruise"?"Cruise fare needs a live sailing quote.":"No theme-park ticket is included for this destination."};
  if(d.ticketModel==="starting"){
    const ticketedPeople=adults+children;
    if(d.key==="wdw" && ticketStyle==="best" && parkDays===4){const offer=d.offers.find(o=>o.title.includes("4-Park Magic"));if(offer && startDate<=offer.validThrough)return {total:offer.price*ticketedPeople,confidence:"estimate",message:"Uses the published adult 4-Park Magic Ticket starting price for every ticketed guest as a planning estimate. Verify child pricing, tax and availability live."}}
    return {total:d.adultOneDayFrom*ticketedPeople*parkDays,confidence:"estimate",message:`Uses the published adult starting price of ${money(d.adultOneDayFrom,d.currency)} per day for each ticketed guest. Date, park, child pricing and tax can change the live total.`}
  }
  if(d.ticketModel==="multiday_exact"){
    const days=String(clamp(parkDays,2,5));const table=ticketStyle==="hopper"?d.hopper:d.multiDay;
    if(parkDays>=2&&parkDays<=5){const p=table[days];return {total:p.adult*adults+p.child*children,confidence:"verified",message:`Uses Disney's published ${parkDays}-day ${ticketStyle==="hopper"?"Park Hopper":"1 Park Per Day"} table.`}}
    return {total:0,confidence:"live",message:"Disneyland publishes 1-day tickets by date tier. Use the official link for a 1-day quote; 2–5 day tickets calculate exactly here."}
  }
  if(d.ticketModel==="date_exact_adult"){
    let adultTotal=0, exact=0; for(let i=0;i<parkDays;i++){const dt=new Date(startDate+"T12:00:00");dt.setDate(dt.getDate()+i);const k=dt.toISOString().slice(0,10);const p=d.datePricesAdult[k]; if(p){adultTotal+=p*adults;exact++}else adultTotal+=d.adultOneDayFrom*adults}
    const childTotal=d.childOneDayFrom*children*parkDays;
    return {total:adultTotal+childTotal,confidence:exact===parkDays&&children===0?"dated":"estimate",message:`Adult pricing uses ${exact}/${parkDays} published date-specific day${exact===1?"":"s"}; child pricing uses the published starting fare until a live date quote is checked.`}
  }
  if(d.ticketModel==="tiered"){
    if(parkDays===2&&ticketStyle==="best"){const o=d.offers.find(x=>x.title.includes("2-Day Fun"));return {total:o.price*adults+599*children,confidence:"estimate",message:"Uses the current 2-Day Fun starting fare; exact tier for your dates can raise the price."}}
    const t=d.tiers[2];return {total:(t.adult*adults+t.child*children)*parkDays,confidence:"estimate",message:"Uses Tier 2 as a working estimate. Hong Kong ticket tier is date-dependent; verify the live tier calendar."}
  }
  if(d.ticketModel==="range"){
    const midpoint=(d.adultOneDayMin+d.adultOneDayMax)/2;return {total:midpoint*(adults+children)*parkDays,confidence:"estimate",message:`Uses the midpoint of Shanghai's published RMB ${d.adultOneDayMin}–${d.adultOneDayMax} adult tier range. Exact date and special pricing require a live check.`}
  }
  return {total:0,confidence:"live",message:"This destination uses dynamic pricing. Open the official source for a live quote, then enter the trip components here."}
}

function findOffers(d,startDate,endDate){if(!d.offers)return[];return d.offers.filter(o=>!o.validThrough||startDate<=o.validThrough).slice(0,2)}

function calculateTrip(event){event?.preventDefault(); if(!pricing)return;
  const f=$("#trip-builder"); if(!f.reportValidity())return; const data=Object.fromEntries(new FormData(f));
  const d={...pricing.destinations[data.destination],key:data.destination}; const nights=daysBetween(data.startDate,data.endDate); if(nights<1){showToast("Departure must be after arrival.");return}
  const people=parseNum(data.adults)+parseNum(data.children); const ticket=getTicketCost(d,data);
  const lodging=parseNum(data.lodgingNight)*nights; const airfare=parseNum(data.airfarePerson)*people; const food=parseNum(data.foodDaily)*people*(nights+1); const ground=parseNum(data.transportTotal); const total=ticket.total+lodging+airfare+food+ground;
  lastTrip={...data,nights,people,d,ticket,lodging,airfare,food,ground,total};
  $("#budget-destination").textContent=d.name; $("#grand-total").textContent=money(total,d.currency); $("#ticket-total").textContent=ticket.total?money(ticket.total,d.currency):"Live quote"; $("#lodging-total").textContent=money(lodging,d.currency); $("#airfare-total").textContent=money(airfare,d.currency); $("#food-total").textContent=money(food,d.currency); $("#transport-total-display").textContent=money(ground,d.currency); $("#total-note").textContent=`${nights} nights · ${people} travelers · ${data.parkDays} experience days`; $("#budget-message").textContent=ticket.message;
  $("#budget-confidence").textContent=ticket.confidence==="verified"?"Strong ticket data":ticket.confidence==="dated"?"Date-specific ticket data":"Mixed live + estimates"; $("#official-rate-link").href=d.sourceUrl;
  const offers=findOffers(d,data.startDate,data.endDate); $("#matched-offers").innerHTML=offers.map(o=>`<div class="match-offer"><strong>Worth checking: ${o.title}</strong>${o.detail}${o.validThrough?` · valid dates through ${o.validThrough}`:""}</div>`).join("");
  burstFromElement($("#grand-total"));
}

function tripBrief(){if(!lastTrip)return"";const t=lastTrip;return [`JORDAN — DISNEY TRIP DESIGN`,``,`Destination: ${t.d.name} (${t.d.location})`,`Dates: ${t.startDate} → ${t.endDate} (${t.nights} nights)`,`Travelers: ${t.adults} adult(s), ${t.children} child(ren)`,`Experience days: ${t.parkDays}`,`Ticket style: ${t.ticketStyle}`,``,`WORKING BUDGET (${t.d.currency})`,`Tickets/experiences: ${t.ticket.total?money(t.ticket.total,t.d.currency):"Live quote needed"}`,`Lodging: ${money(t.lodging,t.d.currency)}`,`Airfare: ${money(t.airfare,t.d.currency)}`,`Food + extras: ${money(t.food,t.d.currency)}`,`Ground transport: ${money(t.ground,t.d.currency)}`,`Estimated total: ${money(t.total,t.d.currency)}`,``,`Ticket note: ${t.ticket.message}`,`Pricing snapshot checked: ${pricing.updatedAt}`,`Official source: ${t.d.sourceUrl}`].join("\n")}

function syncDestination(){if(!pricing)return;const key=$("#destination").value,d=pricing.destinations[key];const symbols=$$("[data-lodging-symbol],[data-air-symbol],[data-food-symbol],[data-transport-symbol]");symbols.forEach(s=>s.textContent=d.symbol);const defs=d.planningDefaults||{};[["#lodging-night","lodgingNight"],["#airfare-person","airfarePerson"],["#food-daily","foodDaily"],["#transport-total","transportTotal"]].forEach(([sel,k])=>{const el=$(sel);if(el&&defs[k]!=null)el.value=defs[k]});$("#budget-destination").textContent=d.name;$("#official-rate-link").href=d.sourceUrl;const currencyNote=$("#currency-note");if(currencyNote)currencyNote.textContent=`All editable trip-budget inputs below use ${d.currency}. Replace defaults with your own live quotes for better accuracy.`}

function setDefaultDates(){const start=$("#start-date"),end=$("#end-date");const s=new Date();s.setDate(s.getDate()+45);const e=new Date(s);e.setDate(e.getDate()+5);const fmt=x=>x.toISOString().slice(0,10);start.min=fmt(new Date());end.min=fmt(new Date());if(!start.value)start.value=fmt(s);if(!end.value)end.value=fmt(e)}

function bindMagicClicks(){$$('.magic-click').forEach(el=>{if(el.dataset.magicBound)return;el.dataset.magicBound="1";el.addEventListener("click",e=>sparkleBurst(e.clientX||el.getBoundingClientRect().left,e.clientY||el.getBoundingClientRect().top,7))})}
function sparkleBurst(x,y,count=8){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=$("#magic-layer"),colors=["#ffd77c","#ff8fc1","#88d8ff","#a99bff","#ffffff"],chars=["✦","✧","·"];for(let i=0;i<count;i++){const s=document.createElement("span");s.className="sparkle";s.textContent=chars[Math.floor(Math.random()*chars.length)];s.style.left=x+"px";s.style.top=y+"px";s.style.setProperty("--size",(8+Math.random()*16)+"px");s.style.setProperty("--color",colors[Math.floor(Math.random()*colors.length)]);s.style.setProperty("--dx",(-55+Math.random()*110)+"px");s.style.setProperty("--dy",(-55+Math.random()*110)+"px");layer.appendChild(s);setTimeout(()=>s.remove(),850)}}
function burstFromElement(el){if(!el)return;const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;firework(x,y);sparkleBurst(x,y,12)}
function firework(x,y){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=$("#magic-layer"),colors=["#ffd77c","#ff8fc1","#88d8ff","#a99bff"];for(let i=0;i<18;i++){const p=document.createElement("i");p.className="firework-dot";p.style.left=x+"px";p.style.top=y+"px";p.style.setProperty("--angle",`${i*20}deg`);p.style.setProperty("--distance",`${45+Math.random()*50}px`);p.style.setProperty("--color",colors[i%colors.length]);layer.appendChild(p);setTimeout(()=>p.remove(),750)}}

const navToggle=$(".nav-toggle"),nav=$("#site-nav");navToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");navToggle.setAttribute("aria-expanded",String(open));document.body.classList.toggle("menu-open",open)});$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');document.body.classList.remove('menu-open');navToggle?.setAttribute('aria-expanded','false')}));
$("#trip-builder")?.addEventListener("submit",calculateTrip);$("#destination")?.addEventListener("change",syncDestination);$("#reset-builder")?.addEventListener("click",()=>{$("#trip-builder").reset();setDefaultDates();syncDestination();lastTrip=null;$("#grand-total").textContent="—";showToast("Trip designer reset.")});$("#copy-trip")?.addEventListener("click",async()=>{if(!lastTrip){showToast("Calculate a trip first.");return}try{await navigator.clipboard.writeText(tripBrief());showToast("Trip brief copied.")}catch{showToast("Copy blocked by browser.")}});
$$('[data-pick]').forEach(b=>b.addEventListener('click',()=>{$("#destination").value=b.dataset.pick;syncDestination();$("#builder").scrollIntoView({behavior:"smooth"});setTimeout(()=>sparkleBurst(innerWidth/2,innerHeight/2,12),500)}));
$("[data-year]").textContent=new Date().getFullYear();setDefaultDates();bindMagicClicks();loadPricing();

(() => {
  const script=document.createElement("script");
  script.src="planner-v2-bootstrap.js";
  document.head.appendChild(script);
})();
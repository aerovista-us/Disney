(() => {
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=m=>{try{if(typeof showToast==='function')showToast(m)}catch(_){}};

  function buildBookingRequest(){
    const val=id=>q(id)?.value?.trim?.()||q(id)?.value||'';
    const text=id=>q(id)?.textContent?.trim()||'';
    const option=id=>{const el=q(id);return el?.selectedOptions?.[0]?.textContent?.trim()||el?.value||'';};
    const ages=qa('[data-child-age]').map(el=>el.value).filter(Boolean).join(', ');
    return [
      'JORDAN — DISNEY BOOKING REQUEST',
      '',
      `Destination: ${option('#destination')}`,
      `Dates: ${val('#start-date')} → ${val('#end-date')}`,
      `Origin airport: ${val('#origin-airport')||'Not set'}`,
      `Travelers: ${val('#adults')||'0'} adult(s), ${val('#children')||'0'} child(ren)${ages?` · ages ${ages}`:''}`,
      `Stay preference: ${option('#stay-type')||'Not set'}`,
      `Hotel candidate: ${option('#hotel-candidate')||'Not selected'}`,
      `Flight preference: ${option('#flight-preference')||'Not set'}`,
      `Dining style: ${option('#dining-style')||'Not set'}`,
      `Transfer style: ${option('#transfer-style')||'Not set'}`,
      `Experience days: ${val('#park-days')||'0'}`,
      `Ticket style: ${option('#ticket-style')}`,
      `Paid priority / premium days: ${val('#premium-days')||'0'}`,
      '',
      `Estimated trip total: ${text('#grand-total')}`,
      `Tickets / experiences: ${text('#ticket-total')}`,
      `Lodging: ${text('#lodging-total')}`,
      `Airfare: ${text('#airfare-total')}`,
      `Food + extras: ${text('#food-total')}`,
      `Ground transport: ${text('#transport-total-display')}`,
      `Paid priority / premium: ${text('#premium-total')||'—'}`,
      '',
      'I would like Jordan to review this trip and help me move it toward booking.',
      location.href.split('#')[0]
    ].join('\n');
  }

  function play(overlay){
    overlay.classList.remove('is-active');overlay.dataset.v3Signature='true';
    const mask=q('.signed-script-mask',overlay),line=q('.signed-script-underline',overlay),heart=q('.signed-script-heart',overlay),tip=q('.signed-script-tip',overlay),word=q('.signed-script-wordmark',overlay),stars=qa('.signed-star',overlay);
    [mask,line,heart,tip,word,...stars].filter(Boolean).forEach(el=>el.getAnimations?.().forEach(a=>a.cancel()));
    if(mask){mask.style.width='100%';mask.style.clipPath='inset(0 100% 0 0)';}
    if(line){line.style.transform='scaleX(0)';line.style.opacity='0';}
    if(heart){heart.style.opacity='0';heart.style.transform='translateX(-18px) scale(.72) rotate(-10deg)';}
    if(tip){tip.style.opacity='0';tip.style.transform='translate(0,0) scale(.8)';}
    if(word){word.style.opacity='1';word.style.filter='drop-shadow(0 0 0 rgba(255,120,205,0))';}
    stars.forEach(s=>{s.style.opacity='0';s.style.transform='scale(.35) rotate(-15deg)';});
    const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(reduced||!mask?.animate){mask&&(mask.style.clipPath='inset(0 0 0 0)');if(line){line.style.transform='scaleX(1)';line.style.opacity='1';}if(heart){heart.style.opacity='1';heart.style.transform='none';}stars.forEach(s=>{s.style.opacity='.9';s.style.transform='none';});return;}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      mask.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:2150,easing:'cubic-bezier(.22,.78,.24,1)',fill:'forwards'});
      word?.animate([{filter:'drop-shadow(0 0 0 rgba(255,120,205,0))'},{filter:'drop-shadow(0 0 15px rgba(255,120,205,.55))'},{filter:'drop-shadow(0 0 5px rgba(255,120,205,.2))'}],{duration:2450,fill:'forwards'});
      line?.animate([{transform:'scaleX(0)',opacity:.2},{transform:'scaleX(1)',opacity:1}],{duration:1250,delay:900,easing:'ease-out',fill:'forwards'});
      heart?.animate([{opacity:0,transform:'translateX(-18px) scale(.72) rotate(-10deg)'},{opacity:1,transform:'translateX(0) scale(1.08) rotate(4deg)',offset:.72},{opacity:1,transform:'none'}],{duration:620,delay:1700,easing:'ease-out',fill:'forwards'});
      const shell=q('.signed-script-shell',overlay),travel=Math.max(220,(shell?.clientWidth||720)*.72);
      tip?.animate([{opacity:0,transform:'translate(0,0) scale(.8)'},{opacity:1,transform:`translate(${travel*.2}px,-18px) scale(1)`,offset:.2},{opacity:1,transform:`translate(${travel*.5}px,16px) scale(.92)`,offset:.5},{opacity:1,transform:`translate(${travel*.8}px,30px) scale(1)`,offset:.8},{opacity:0,transform:`translate(${travel}px,38px) scale(.82)`}],{duration:2200,easing:'cubic-bezier(.24,.72,.28,1)',fill:'forwards'});
      stars.forEach((s,i)=>s.animate([{opacity:0,transform:'scale(.35) rotate(-15deg)'},{opacity:1,transform:'scale(1.15) rotate(6deg)',offset:.55},{opacity:.88,transform:'none'}],{duration:700,delay:280+i*410,easing:'ease-out',fill:'forwards'}));
      try{typeof sparkleBurst==='function'&&sparkleBurst(innerWidth*.5,Math.min(innerHeight*.5,360),18);typeof firework==='function'&&firework(innerWidth*.5,Math.min(innerHeight*.48,340));}catch(_){}
    }));
  }

  function configureActions(overlay,close){
    const actions=q('.signed-overlay-actions',overlay); if(!actions)return;
    actions.innerHTML=`
      <button id="signed-replay" class="button button-secondary magic-click" type="button">Replay the magic</button>
      <button id="signed-book-handoff" class="button button-primary magic-click" type="button">Send booking request to Jordan →</button>
      <button id="signed-keep-planning" class="button button-ghost magic-click" type="button">Keep planning</button>`;
    q('#signed-replay',actions)?.addEventListener('click',e=>{e.preventDefault();play(overlay);});
    q('#signed-keep-planning',actions)?.addEventListener('click',close);
    q('#signed-book-handoff',actions)?.addEventListener('click',async()=>{
      const brief=buildBookingRequest();
      let email='';
      try{if(typeof SITE!=='undefined')email=SITE?.plannerEmail||'';}catch(_){}
      if(email){
        location.href=`mailto:${email}?subject=${encodeURIComponent('Disney trip booking request for Jordan')}&body=${encodeURIComponent(brief)}`;
        return;
      }
      if(navigator.share){
        try{
          await navigator.share({title:'Disney trip booking request for Jordan',text:brief});
          toast('Booking request opened for sharing.');
          return;
        }catch(err){ if(err?.name==='AbortError') return; }
      }
      try{
        await navigator.clipboard.writeText(brief);
        toast('Booking request copied. Jordan’s direct contact can be connected next.');
      }catch(_){
        toast('Booking request is ready, but the browser blocked sharing.');
      }
    });
    try{typeof bindMagicClicks==='function'&&bindMagicClicks();}catch(_){}
  }

  function bind(){
    const overlay=q('#signed-overlay'),budget=q('#signed-budget-trigger'),about=q('#about-sign-trigger');
    if(!overlay||(!budget&&!about)||overlay.dataset.v4LateBound==='true')return false;
    overlay.dataset.v4LateBound='true';overlay.dataset.v3Signature='true';
    let lastTrigger=null;
    const close=()=>{overlay.hidden=true;overlay.setAttribute('aria-hidden','true');document.body.classList.remove('signed-overlay-open');overlay.classList.remove('is-active');lastTrigger?.focus?.();};
    const open=trigger=>{
      if(trigger?.id==='signed-budget-trigger'&&q('#grand-total')?.textContent.trim()==='—'){toast('Calculate the trip first, then give it Jordan’s final flourish.');return;}
      lastTrigger=trigger;
      const title=q('#signed-overlay-title',overlay); if(title)title.textContent='Jordan approved.';
      const copy=q('.signed-overlay-copy',overlay); if(copy)copy.textContent=trigger?.id==='signed-budget-trigger'?'Your trip is ready for Jordan’s final flourish. Watch it sign, then send the complete plan forward as a booking request.':'This is Jordan’s final mark for a plan she is ready to stand behind.';
      overlay.hidden=false;overlay.setAttribute('aria-hidden','false');document.body.classList.add('signed-overlay-open');
      configureActions(overlay,close);
      play(overlay);
      requestAnimationFrame(()=>q('.signed-overlay-close',overlay)?.focus());
    };
    [budget,about].filter(Boolean).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open(btn);},true));
    qa('[data-signed-close]',overlay).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();close();},true));
    document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close();});
    return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(bind()||tries>80)clearInterval(timer);},125);bind();
})();

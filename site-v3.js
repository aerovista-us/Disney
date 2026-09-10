(() => {
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function toast(message){
    if(typeof showToast==='function') showToast(message);
    else { const el=q('#toast'); if(el){el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);} }
  }

  function injectBookingJourney(){
    const about=q('#about');
    if(!about||q('#book-with-jordan')) return;
    const section=document.createElement('section');
    section.className='book-jordan-section';
    section.id='book-with-jordan';
    section.innerHTML=`
      <div class="container book-jordan-shell">
        <div class="book-jordan-intro">
          <span class="section-kicker">Book with Jordan</span>
          <h2>Less tab-juggling.<br>More actual vacation.</h2>
          <p>The trip designer gets the moving pieces on the table. Jordan adds the human judgment: which route is worth it, where to stay, what is worth paying extra for, and what can safely be skipped.</p>
          <p>You still see the numbers and source links. You just do not have to make every decision alone.</p>
          <div class="book-jordan-actions">
            <a class="button button-primary magic-click" href="#builder" data-book-jordan>Start booking with Jordan <span aria-hidden="true">→</span></a>
            <a class="button button-secondary magic-click" href="#about">Meet Jordan first</a>
          </div>
        </div>
        <div class="book-jordan-reasons" aria-label="Reasons to book with Jordan">
          <article class="book-reason"><div class="book-icon">✈</div><strong>The travel day matters too.</strong><p>Jordan’s aviation background brings practical thinking about airports, connections, timing, and the parts of a vacation that happen before the park gates.</p></article>
          <article class="book-reason"><div class="book-icon">J</div><strong>One person sees the whole trip.</strong><p>Flights, hotel strategy, tickets, dining, transfers and premium experiences are considered together instead of as unrelated purchases.</p></article>
          <article class="book-reason"><div class="book-icon">⌁</div><strong>Real numbers, human judgment.</strong><p>The site labels published rates, date-specific pricing and estimates. Jordan can help decide what is actually worth the money for your family.</p></article>
          <article class="book-reason"><div class="book-icon">✦</div><strong>Plans built around your travelers.</strong><p>Child ages, pace, preferred hotel style, dining priorities and travel comfort all change what the “best” Disney trip looks like.</p></article>
          <article class="book-reason"><div class="book-icon">↻</div><strong>A plan that can flex.</strong><p>Trips change. Having one planner who understands the original logic of the itinerary makes it easier to adjust without starting over.</p></article>
          <article class="book-reason"><div class="book-icon">✓</div><strong>A final Jordan check.</strong><p>When the route, budget and trip logic feel right, it can earn the final flourish: <em>Signed with a J.</em></p></article>
          <div class="book-jordan-path">
            <h3>How booking with Jordan starts</h3>
            <div class="book-path-steps">
              <div class="book-path-step"><b><i>1</i> Build the wish</b><span>Choose the destination, dates, travelers and working budget.</span></div>
              <div class="book-path-step"><b><i>2</i> Jordan refines it</b><span>Review routing, stay strategy, ticket assumptions, dining and the details that affect the whole experience.</span></div>
              <div class="book-path-step"><b><i>3</i> Make it real</b><span>Move from research into a trip plan you feel confident booking with Jordan.</span></div>
            </div>
          </div>
        </div>
      </div>`;
    about.parentNode.insertBefore(section,about);

    const navPrimary=q('#site-nav .button-primary');
    if(navPrimary){navPrimary.textContent='Book with Jordan';navPrimary.href='#book-with-jordan';navPrimary.setAttribute('data-book-jordan','');}
    const heroActions=q('.hero-actions');
    heroActions?.insertAdjacentHTML('afterend','<p class="hero-book-nudge">Want a human looking at the whole trip? <a href="#book-with-jordan" data-book-jordan>See why travelers book with Jordan →</a></p>');
    const finalButton=q('.final-cta .button-primary');
    if(finalButton){finalButton.innerHTML='Book with Jordan <span aria-hidden="true">→</span>';finalButton.href='#book-with-jordan';finalButton.setAttribute('data-book-jordan','');}

    const matched=q('#matched-offers');
    matched?.insertAdjacentHTML('afterend',`<div class="booking-ready-card" id="booking-ready-card"><strong>Your working trip is ready for a human review.</strong><p>Jordan can look at the route, hotel strategy, ticket assumptions and where the budget is worth stretching—or not.</p><div class="booking-ready-actions"><a href="#book-with-jordan" class="button button-primary magic-click" data-book-jordan>Book with Jordan</a><button type="button" class="button button-secondary magic-click" id="booking-copy-brief">Copy my trip brief</button></div></div>`);

    document.body.insertAdjacentHTML('beforeend','<div class="mobile-book-bar"><a class="button button-primary magic-click" href="#book-with-jordan" data-book-jordan>Book with Jordan ✦</a><a class="button mobile-book-secondary magic-click" href="#builder" aria-label="Open trip designer">↟</a></div>');
    if(typeof bindMagicClicks==='function') bindMagicClicks();
  }

  function wireBookingIntent(){
    document.addEventListener('click',e=>{
      const link=e.target.closest('[data-book-jordan]');
      if(!link) return;
      const email=(typeof SITE!=='undefined'&&SITE?.plannerEmail)||'';
      if(email){
        e.preventDefault();
        let body='I would like to plan a Disney trip with Jordan.';
        try{if(typeof tripBrief==='function'&&q('#grand-total')?.textContent.trim()!=='—')body=tripBrief();}catch(_){}
        window.location.href=`mailto:${email}?subject=${encodeURIComponent('Book my Disney trip with Jordan')}&body=${encodeURIComponent(body)}`;
        return;
      }
      if(link.getAttribute('href')==='#builder') toast('Start with your trip details. Jordan can take it from there.');
    });
    q('#booking-copy-brief')?.addEventListener('click',()=>q('#copy-trip')?.click());
    const total=q('#grand-total'),ready=q('#booking-ready-card');
    const sync=()=>{if(!total||!ready)return;ready.classList.toggle('is-ready',total.textContent.trim()!=='—');};
    if(total){new MutationObserver(sync).observe(total,{childList:true,subtree:true,characterData:true});sync();}
  }

  function resetSignedVisuals(overlay){
    const mask=q('.signed-script-mask',overlay),underline=q('.signed-script-underline',overlay),heart=q('.signed-script-heart',overlay),tip=q('.signed-script-tip',overlay),stars=qa('.signed-star',overlay),word=q('.signed-script-wordmark',overlay);
    [mask,underline,heart,tip,word,...stars].filter(Boolean).forEach(el=>el.getAnimations?.().forEach(a=>a.cancel()));
    if(mask){mask.style.width='100%';mask.style.clipPath='inset(0 100% 0 0)';}
    if(underline){underline.style.transform='scaleX(0)';underline.style.opacity='0';}
    if(heart){heart.style.opacity='0';heart.style.transform='translateX(-18px) scale(.72) rotate(-10deg)';}
    if(tip){tip.style.opacity='0';tip.style.transform='translate(0,0) scale(.8)';}
    if(word){word.style.opacity='1';word.style.filter='drop-shadow(0 0 0 rgba(255,120,205,0))';}
    stars.forEach(s=>{s.style.opacity='0';s.style.transform='scale(.35) rotate(-15deg)';});
    return {mask,underline,heart,tip,stars,word};
  }

  function playSignedV3(overlay){
    overlay.classList.remove('is-active');
    overlay.dataset.v3Signature='true';
    const parts=resetSignedVisuals(overlay);
    if(reducedMotion()||!parts.mask?.animate){
      parts.mask && (parts.mask.style.clipPath='inset(0 0 0 0)');
      if(parts.underline){parts.underline.style.transform='scaleX(1)';parts.underline.style.opacity='1';}
      if(parts.heart){parts.heart.style.opacity='1';parts.heart.style.transform='none';}
      parts.stars.forEach(s=>{s.style.opacity='.9';s.style.transform='none';});
      return;
    }
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      parts.mask.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:2100,easing:'cubic-bezier(.22,.78,.24,1)',fill:'forwards'});
      parts.word?.animate([{filter:'drop-shadow(0 0 0 rgba(255,120,205,0))'},{filter:'drop-shadow(0 0 14px rgba(255,120,205,.52))'},{filter:'drop-shadow(0 0 5px rgba(255,120,205,.18))'}],{duration:2450,easing:'ease-in-out',fill:'forwards'});
      parts.underline?.animate([{transform:'scaleX(0)',opacity:.2},{transform:'scaleX(1)',opacity:1}],{duration:1250,delay:950,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
      parts.heart?.animate([{opacity:0,transform:'translateX(-18px) scale(.72) rotate(-10deg)'},{opacity:1,transform:'translateX(0) scale(1.08) rotate(4deg)',offset:.7},{opacity:1,transform:'translateX(0) scale(1) rotate(0)'}],{duration:620,delay:1740,easing:'ease-out',fill:'forwards'});
      const shell=q('.signed-script-shell',overlay),travel=Math.max(240,(shell?.clientWidth||720)*.76);
      parts.tip?.animate([{opacity:0,transform:'translate(0,0) scale(.8)'},{opacity:1,transform:`translate(${travel*.18}px,-18px) scale(1)`,offset:.18},{opacity:1,transform:`translate(${travel*.48}px,16px) scale(.92)`,offset:.48},{opacity:1,transform:`translate(${travel*.78}px,30px) scale(1)`,offset:.78},{opacity:0,transform:`translate(${travel}px,38px) scale(.82)`}],{duration:2200,easing:'cubic-bezier(.24,.72,.28,1)',fill:'forwards'});
      parts.stars.forEach((star,i)=>star.animate([{opacity:0,transform:'scale(.35) rotate(-15deg)'},{opacity:1,transform:'scale(1.16) rotate(6deg)',offset:.55},{opacity:.88,transform:'scale(1) rotate(0)'}],{duration:700,delay:320+i*410,easing:'ease-out',fill:'forwards'}));
      try{if(typeof sparkleBurst==='function')sparkleBurst(innerWidth*.5,Math.min(innerHeight*.5,360),18);if(typeof firework==='function')firework(innerWidth*.5,Math.min(innerHeight*.48,340));}catch(_){}
    }));
  }

  function wireSignedDesktopFix(){
    const overlay=q('#signed-overlay');
    if(!overlay) return;
    overlay.dataset.v3Signature='true';
    let lastTrigger=null;
    const open=(trigger)=>{
      if(trigger.id==='signed-budget-trigger'&&q('#grand-total')?.textContent.trim()==='—'){toast('Calculate the trip first, then give it Jordan’s final flourish.');return;}
      lastTrigger=trigger;
      const copy=q('.signed-overlay-copy',overlay),destination=q('#budget-destination')?.textContent,total=q('#grand-total')?.textContent;
      if(copy) copy.textContent=trigger.id==='signed-budget-trigger'&&total&&total!=='—'?`${destination} is looking magical. ${total} is the current working total — ready for Jordan’s final flourish.`:'A little final flourish for the trips, ideas, and recommendations that feel truly ready.';
      overlay.hidden=false;overlay.setAttribute('aria-hidden','false');document.body.classList.add('signed-overlay-open');
      playSignedV3(overlay);
      requestAnimationFrame(()=>q('.signed-overlay-close',overlay)?.focus());
    };
    ['signed-budget-trigger','about-sign-trigger'].forEach(id=>q('#'+id)?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open(e.currentTarget);},true));
    q('#signed-replay')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();playSignedV3(overlay);},true);
    qa('[data-signed-close]',overlay).forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>lastTrigger?.focus?.(),0)));
  }

  function init(){
    injectBookingJourney();
    wireBookingIntent();
    wireSignedDesktopFix();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});
  else setTimeout(init,0);
})();

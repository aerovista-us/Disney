(() => {
  const FORM_ENDPOINT='https://formspree.io/f/xljezlqp';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function toast(message){
    try{if(typeof showToast==='function')return showToast(message);}catch(_){ }
    const el=q('#toast');
    if(!el)return;
    el.textContent=message;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2400);
  }

  function addHeroImage(){
    const card=q('.magic-orbit-card');
    if(!card||q('.hero-brand-art',card))return;
    const img=document.createElement('img');
    img.className='hero-brand-art';
    img.src='social-preview.png';
    img.alt='Jordan Disney travel planning brand artwork';
    img.loading='eager';
    img.decoding='async';
    try{img.fetchPriority='high';}catch(_){ }
    card.prepend(img);
    card.insertAdjacentHTML('beforeend','<div class="hero-art-badge"><span>✦</span> Jordan · Disney trips, beautifully planned</div>');
  }

  async function sendForm(form,status){
    const submit=q('[type="submit"]',form);
    const original=submit?.textContent||'Send';
    if(submit){submit.disabled=true;submit.textContent='Sending…';}
    if(status){status.textContent='Sending to Jordan…';status.className='formspree-status';}
    try{
      const response=await fetch(FORM_ENDPOINT,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(!response.ok){
        let detail='Please try again.';
        try{const body=await response.json();if(body?.errors?.length)detail=body.errors.map(e=>e.message).join(' ');}catch(_){ }
        throw new Error(detail);
      }
      if(status){status.textContent='Sent to Jordan ✓';status.className='formspree-status is-success';}
      if(submit)submit.textContent='Sent ✓';
      try{if(typeof sparkleBurst==='function'){const r=submit.getBoundingClientRect();sparkleBurst(r.left+r.width/2,r.top+r.height/2,16);}}catch(_){ }
      return true;
    }catch(error){
      if(status){status.textContent=`Could not send. ${error.message||'Please try again.'}`;status.className='formspree-status is-error';}
      if(submit){submit.disabled=false;submit.textContent=original;}
      return false;
    }
  }

  function addContactForm(){
    const intro=q('#why-jordan .book-jordan-intro');
    if(!intro||q('#jordan-contact-form'))return;
    intro.insertAdjacentHTML('beforeend',`
      <form id="jordan-contact-form" class="jordan-contact-card" action="${FORM_ENDPOINT}" method="POST">
        <h3>Have Jordan take a look.</h3>
        <p>Not ready to build the whole trip yet? Send Jordan a quick note and start with the question you already have.</p>
        <input type="hidden" name="_subject" value="Jordan travel website inquiry" />
        <input type="hidden" name="source" value="Jordan Disney planning website" />
        <div class="jordan-contact-grid">
          <label>Name<input name="name" autocomplete="name" required /></label>
          <label>Email<input type="email" name="email" autocomplete="email" required /></label>
          <label class="field-span-2">What are you dreaming about?<textarea name="message" placeholder="Destination, dates, who is traveling, or the question you are stuck on…" required></textarea></label>
        </div>
        <button class="button button-primary magic-click" type="submit">Ask Jordan a question ✦</button>
        <p class="formspree-status" id="jordan-contact-status" role="status" aria-live="polite"></p>
      </form>`);
    const form=q('#jordan-contact-form');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const ok=await sendForm(form,q('#jordan-contact-status'));
      if(ok){form.querySelector('textarea').value='';toast('Your note was sent to Jordan.');}
    });
    try{typeof bindMagicClicks==='function'&&bindMagicClicks();}catch(_){ }
  }

  function buildTripBrief(){
    const val=id=>q(id)?.value?.trim?.()||q(id)?.value||'';
    const text=id=>q(id)?.textContent?.trim()||'';
    const option=id=>{const el=q(id);return el?.selectedOptions?.[0]?.textContent?.trim()||el?.value||'';};
    const ages=qa('[data-child-age]').map(el=>el.value).filter(Boolean).join(', ');
    return [
      'JORDAN — DISNEY BOOKING REQUEST','',
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
      `Paid priority / premium days: ${val('#premium-days')||'0'}`,'',
      `Estimated trip total: ${text('#grand-total')}`,
      `Tickets / experiences: ${text('#ticket-total')}`,
      `Lodging: ${text('#lodging-total')}`,
      `Airfare: ${text('#airfare-total')}`,
      `Food + extras: ${text('#food-total')}`,
      `Ground transport: ${text('#transport-total-display')}`,
      `Paid priority / premium: ${text('#premium-total')||'—'}`,'',
      `Planner note: ${text('#budget-message')}`,
      `Page: ${location.href.split('#')[0]}`
    ].join('\n');
  }

  function signatureMarkup(){
    return `
      <div class="signed-v4-stage" aria-label="Signed with a J animation">
        <svg class="signed-v4-svg" viewBox="0 0 1000 245" role="img" aria-label="Signed with a J">
          <defs>
            <linearGradient id="signedV4Gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#9f84ff"/><stop offset=".28" stop-color="#ff62ba"/><stop offset=".55" stop-color="#ffd0ee"/><stop offset=".78" stop-color="#ff7cc9"/><stop offset="1" stop-color="#a98aff"/>
            </linearGradient>
            <filter id="signedV4Glow" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <mask id="signedV4Mask"><rect id="signed-v4-wipe" x="0" y="0" width="0" height="245" fill="#fff"/></mask>
          </defs>
          <g mask="url(#signedV4Mask)">
            <text class="signed-v4-text" x="38" y="142" font-size="126" textLength="835" lengthAdjust="spacingAndGlyphs">Signed with a J</text>
            <path id="signed-v4-underline" class="signed-v4-underline" d="M170 186 C 380 205, 635 178, 870 188"/>
            <path id="signed-v4-heart" class="signed-v4-heart" d="M895 165 C 885 146 855 151 858 174 C 862 195 895 214 895 214 C 895 214 928 195 932 174 C 935 151 905 146 895 165 Z"/>
          </g>
          <g id="signed-v4-stars">
            <path class="signed-v4-star" d="M75 66 l7 15 15 7 -15 7 -7 15 -7-15 -15-7 15-7z"/>
            <path class="signed-v4-star" d="M258 204 l5 10 10 5 -10 5 -5 10 -5-10 -10-5 10-5z"/>
            <path class="signed-v4-star" d="M760 58 l6 13 13 6 -13 6 -6 13 -6-13 -13-6 13-6z"/>
            <path class="signed-v4-star" d="M946 110 l5 11 11 5 -11 5 -5 11 -5-11 -11-5 11-5z"/>
          </g>
          <g id="signed-v4-pen" class="signed-v4-pen" transform="translate(40 122)"><circle class="signed-v4-pen-ring" r="12"/><circle class="signed-v4-pen-core" r="4"/></g>
        </svg>
      </div>`;
  }

  function installSignedV4(){
    const budget=q('#signed-budget-trigger'),about=q('#about-sign-trigger');
    if((!budget&&!about)||document.documentElement.dataset.signedV4==='1')return false;
    document.documentElement.dataset.signedV4='1';

    const freshen=el=>{if(!el)return null;const clone=el.cloneNode(true);el.replaceWith(clone);return clone;};
    const budgetBtn=freshen(budget),aboutBtn=freshen(about);
    q('#signed-overlay')?.remove();

    const toastEl=q('#toast');
    const host=toastEl?.parentNode||document.body;
    const wrap=document.createElement('div');
    wrap.innerHTML=`
      <div class="signed-overlay" id="signed-overlay" hidden aria-hidden="true">
        <div class="signed-overlay-backdrop" data-signed-close></div>
        <div class="signed-v4-card" role="dialog" aria-modal="true" aria-labelledby="signed-overlay-title">
          <button class="signed-overlay-close magic-click" type="button" aria-label="Close Signed with a J" data-signed-close>×</button>
          <span class="section-kicker">Jordan approved</span>
          <h2 id="signed-overlay-title">Jordan approved.</h2>
          <p class="signed-overlay-copy">Watch Jordan’s final flourish, then send the complete trip forward as your booking request.</p>
          ${signatureMarkup()}
          <div id="signed-v4-content"></div>
        </div>
      </div>`;
    const overlay=wrap.firstElementChild;
    host.insertBefore(overlay,toastEl||null);
    try{typeof bindMagicClicks==='function'&&bindMagicClicks();}catch(_){ }

    let raf=0,lastTrigger=null;
    function stopAnimation(){if(raf)cancelAnimationFrame(raf);raf=0;qa('*',overlay).forEach(el=>el.getAnimations?.().forEach(a=>a.cancel()));}

    function play(){
      stopAnimation();
      const wipe=q('#signed-v4-wipe',overlay),line=q('#signed-v4-underline',overlay),heart=q('#signed-v4-heart',overlay),pen=q('#signed-v4-pen',overlay),stars=qa('.signed-v4-star',overlay);
      wipe.setAttribute('width','0');
      const length=line.getTotalLength();
      line.setAttribute('stroke-dasharray',String(length));line.setAttribute('stroke-dashoffset',String(length));
      heart.style.opacity='0';pen.style.opacity='0';stars.forEach(s=>{s.style.opacity='0';s.style.transform='scale(.35) rotate(-15deg)';});
      if(reducedMotion()){
        wipe.setAttribute('width','1000');line.setAttribute('stroke-dashoffset','0');heart.style.opacity='1';stars.forEach(s=>{s.style.opacity='.9';s.style.transform='none';});return;
      }
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const start=performance.now(),duration=2350;
        const ease=t=>1-Math.pow(1-t,3);
        const step=now=>{
          const raw=Math.min(1,(now-start)/duration),t=ease(raw);
          wipe.setAttribute('width',String(35+930*t));
          const x=38+840*t;
          const y=122 + Math.sin(t*Math.PI*4)*10*(1-raw*.35);
          pen.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);
          pen.style.opacity=raw<.96?'1':'0';
          const linePhase=Math.max(0,Math.min(1,(raw-.42)/.48));
          line.setAttribute('stroke-dashoffset',String(length*(1-linePhase)));
          heart.style.opacity=raw>.72?String(Math.min(1,(raw-.72)/.14)):'0';
          stars.forEach((s,i)=>{
            const st=(raw-(.15+i*.16))/.16;
            if(st>0){const p=Math.min(1,st);s.style.opacity=String(Math.min(.95,p*1.3));s.style.transform=`scale(${(.35+.65*p).toFixed(2)}) rotate(${(-15+15*p).toFixed(1)}deg)`;}
          });
          if(raw<1)raf=requestAnimationFrame(step);else{raf=0;pen.style.opacity='0';}
        };
        raf=requestAnimationFrame(step);
        try{if(typeof sparkleBurst==='function')sparkleBurst(innerWidth*.5,Math.min(innerHeight*.42,330),18);}catch(_){ }
      }));
    }

    function renderContent(hasTrip){
      const content=q('#signed-v4-content',overlay);
      if(!hasTrip){
        content.innerHTML=`<div class="signed-v4-actions"><button id="signed-v4-replay" class="button button-secondary magic-click" type="button">Replay the magic</button><a class="button button-primary magic-click" href="#builder" data-signed-close>Build my trip →</a><button class="button button-ghost magic-click" type="button" data-signed-close>Close</button></div><p class="signed-v4-demo-note">This is Jordan’s approval mark. Build and calculate a trip to use it as the final booking handoff.</p>`;
      }else{
        content.innerHTML=`
          <div class="signed-v4-booking-shell">
            <h3>Send this trip to Jordan</h3>
            <p>The complete trip brief will travel with your message through Formspree.</p>
            <form id="signed-booking-form" class="signed-booking-form" action="${FORM_ENDPOINT}" method="POST">
              <input type="hidden" name="_subject" value="Signed with a J — Disney booking request" />
              <input type="hidden" name="trip_brief" id="signed-trip-brief" />
              <input type="hidden" name="estimated_total" value="${q('#grand-total')?.textContent?.trim()||''}" />
              <div class="signed-booking-grid">
                <label>Name<input name="name" autocomplete="name" required /></label>
                <label>Email<input type="email" name="email" autocomplete="email" required /></label>
                <label class="field-span-2">Phone <span style="font-weight:500;opacity:.7">(optional)</span><input name="phone" autocomplete="tel" /></label>
                <label class="field-span-2">Anything Jordan should know?<textarea name="message" placeholder="Celebration, priorities, accessibility needs, room preferences, questions…"></textarea></label>
              </div>
              <button class="button button-primary magic-click signed-booking-submit" type="submit">Send booking request to Jordan ✦</button>
              <p class="formspree-status" id="signed-booking-status" role="status" aria-live="polite"></p>
            </form>
            <div class="signed-v4-actions"><button id="signed-v4-replay" class="button button-secondary magic-click" type="button">Replay the magic</button><button class="button button-ghost magic-click" type="button" data-signed-close>Keep planning</button></div>
          </div>`;
        q('#signed-trip-brief',content).value=buildTripBrief();
        const form=q('#signed-booking-form',content);
        form.addEventListener('submit',async e=>{
          e.preventDefault();
          q('#signed-trip-brief',form).value=buildTripBrief();
          const ok=await sendForm(form,q('#signed-booking-status',form));
          if(ok){toast('Your Signed with a J trip was sent to Jordan.');}
        });
      }
      q('#signed-v4-replay',content)?.addEventListener('click',play);
      qa('[data-signed-close]',content).forEach(el=>el.addEventListener('click',close));
      try{typeof bindMagicClicks==='function'&&bindMagicClicks();}catch(_){ }
    }

    function open(trigger){
      const hasTrip=q('#grand-total')?.textContent?.trim() && q('#grand-total')?.textContent?.trim()!=='—';
      if(trigger?.id==='signed-budget-trigger'&&!hasTrip){toast('Calculate the trip first, then give it Jordan’s final flourish.');return;}
      lastTrigger=trigger;
      const copy=q('.signed-overlay-copy',overlay);
      copy.textContent=hasTrip?'Your trip is ready for Jordan’s final flourish. Watch it sign, then send the complete plan forward as your booking request.':'This is Jordan’s final mark for a plan she is ready to stand behind.';
      overlay.hidden=false;overlay.setAttribute('aria-hidden','false');document.body.classList.add('signed-overlay-open');
      renderContent(Boolean(hasTrip));
      play();
      requestAnimationFrame(()=>q('.signed-overlay-close',overlay)?.focus());
    }
    function close(){stopAnimation();overlay.hidden=true;overlay.setAttribute('aria-hidden','true');document.body.classList.remove('signed-overlay-open');lastTrigger?.focus?.();}

    [budgetBtn,aboutBtn].filter(Boolean).forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(btn);}));
    qa('[data-signed-close]',overlay).forEach(el=>el.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close();});
    return true;
  }

  function init(){addHeroImage();addContactForm();installSignedV4();}
  let tries=0;
  const timer=setInterval(()=>{tries++;init();if((q('.hero-brand-art')&&q('#jordan-contact-form')&&document.documentElement.dataset.signedV4==='1')||tries>100)clearInterval(timer);},120);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

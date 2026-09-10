(() => {
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  function toast(message){
    if(typeof showToast==='function') showToast(message);
    else { const el=q('#toast'); if(el){el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);} }
  }

  function enhanceHero(){
    const eyebrow=q('.hero .eyebrow');
    const title=q('.hero h1');
    const lede=q('.hero-lede');
    if(eyebrow) eyebrow.innerHTML='<span class="twinkle">✦</span> Disney travel planning · from runway to wonder';
    if(title) title.innerHTML='Your Disney dream.<br><em>Jordan’s expertise.</em>';
    if(lede) lede.textContent='Jordan plans the moving pieces so you can focus on the memories. Compare destinations, test dates, build a realistic budget, then hand the whole trip to one person who understands how it needs to flow.';

    const heroActions=q('.hero-actions');
    if(heroActions && !q('.hero-book-nudge')){
      heroActions.insertAdjacentHTML('afterend','<p class="hero-book-nudge">Want a human looking at the whole trip? <a href="#why-jordan">See why travelers plan with Jordan →</a></p>');
    }
  }

  function injectWhyJordan(){
    const about=q('#about');
    if(!about || q('#why-jordan')) return;
    const section=document.createElement('section');
    section.className='book-jordan-section';
    section.id='why-jordan';
    section.innerHTML=`
      <div class="container book-jordan-shell">
        <div class="book-jordan-intro">
          <span class="section-kicker">Why Jordan</span>
          <h2>More magic.<br>Less trip stress.</h2>
          <p>You can research every piece of a Disney vacation yourself. Jordan becomes valuable when those pieces start affecting one another—flight times change park days, hotel location changes transportation, dining changes pacing, and “saving money” in one place can cost time somewhere else.</p>
          <p>The site helps you build the wish. Jordan helps turn it into one trip that actually makes sense.</p>
          <div class="book-jordan-callout"><span>✦</span><div><strong>The final handoff is “Signed with a J.”</strong><p>Build and calculate your trip first. When it feels ready, use <em>Signed with a J</em> in the budget panel to send the whole plan to Jordan.</p></div></div>
          <div class="book-jordan-actions">
            <a class="button button-primary magic-click" href="#builder">Build my trip <span aria-hidden="true">→</span></a>
            <a class="button button-secondary magic-click" href="#about">Meet Jordan first</a>
          </div>
        </div>
        <div class="book-jordan-reasons" aria-label="Reasons to plan with Jordan">
          <article class="book-reason"><div class="book-icon">✈</div><strong>The travel day matters too.</strong><p>Jordan’s aviation background brings practical thinking about airports, connections, timing, and the parts of a vacation that happen before the park gates.</p></article>
          <article class="book-reason"><div class="book-icon">J</div><strong>One person sees the whole trip.</strong><p>Flights, hotel strategy, tickets, dining, transfers and premium experiences are considered together instead of as unrelated purchases.</p></article>
          <article class="book-reason"><div class="book-icon">⌁</div><strong>Real numbers, human judgment.</strong><p>The site labels published rates, date-specific pricing and estimates. Jordan helps decide what is actually worth the money for your travelers.</p></article>
          <article class="book-reason"><div class="book-icon">✦</div><strong>Built around your travelers.</strong><p>Child ages, pace, preferred hotel style, dining priorities and travel comfort can completely change what the “best” Disney trip looks like.</p></article>
          <article class="book-reason"><div class="book-icon">↻</div><strong>A plan that can flex.</strong><p>Trips change. One planner who understands the original logic of the itinerary can adjust it without making you start the research over.</p></article>
          <article class="book-reason"><div class="book-icon">✓</div><strong>A deliberate final check.</strong><p>When the route, budget and trip logic feel right, the plan gets Jordan’s final flourish: <em>Signed with a J.</em></p></article>
          <div class="book-jordan-path">
            <h3>One clear path from wish to booking</h3>
            <div class="book-path-steps">
              <div class="book-path-step"><b><i>1</i> Build the wish</b><span>Destination, dates, travelers, flights, stay style and working budget.</span></div>
              <div class="book-path-step"><b><i>2</i> Refine the trip</b><span>Compare the options and decide where comfort, time and budget matter most.</span></div>
              <div class="book-path-step"><b><i>J</i> Signed with a J</b><span>Your final Jordan-approved handoff to send the trip forward for booking.</span></div>
            </div>
          </div>
        </div>
      </div>`;
    about.parentNode.insertBefore(section,about);
    if(typeof bindMagicClicks==='function') bindMagicClicks();
  }

  function simplifyConversion(){
    q('#booking-ready-card')?.remove();

    const navPrimary=q('#site-nav .button-primary');
    if(navPrimary){
      navPrimary.textContent='Why Jordan';
      navPrimary.href='#why-jordan';
      navPrimary.removeAttribute('data-book-jordan');
    }

    const finalButton=q('.final-cta .button-primary');
    if(finalButton){
      finalButton.innerHTML='Build my trip <span aria-hidden="true">→</span>';
      finalButton.href='#builder';
      finalButton.removeAttribute('data-book-jordan');
    }

    qa('[data-book-jordan]').forEach(el=>el.removeAttribute('data-book-jordan'));

    const oldMobile=q('.mobile-book-bar');
    if(oldMobile) oldMobile.remove();
    document.body.insertAdjacentHTML('beforeend','<div class="mobile-book-bar"><a class="button button-primary magic-click" href="#builder">Build my trip ✦</a><a class="button mobile-book-secondary magic-click" href="#why-jordan" aria-label="Why plan with Jordan">J</a></div>');
    if(typeof bindMagicClicks==='function') bindMagicClicks();
  }

  function tuneSignedButton(){
    const signed=q('#signed-budget-trigger');
    if(signed){
      signed.innerHTML='Signed with a J <span aria-hidden="true">✦</span>';
      signed.setAttribute('aria-label','Signed with a J — final booking handoff to Jordan');
      signed.title='Jordan approved — continue to the booking handoff';
    }
    const help=q('.signed-help');
    if(help) help.innerHTML='Your final step to book with Jordan: calculate the trip, then choose <strong>Signed with a J.</strong>';
    const overlay=q('#signed-overlay');
    if(overlay){
      const title=q('#signed-overlay-title',overlay); if(title) title.textContent='Jordan approved.';
      const copy=q('.signed-overlay-copy',overlay); if(copy && !copy.dataset.v4Copy){copy.dataset.v4Copy='1';copy.textContent='Watch Jordan’s final flourish, then send the complete trip forward as your booking request.';}
    }
  }

  function init(){
    enhanceHero();
    injectWhyJordan();
    simplifyConversion();
    tuneSignedButton();
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    init();
    if((q('#signed-budget-trigger')&&q('#why-jordan')) || tries>80) clearInterval(timer);
  },125);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

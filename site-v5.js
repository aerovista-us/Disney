(() => {
  const FORM_ENDPOINT = 'https://formspree.io/f/xljezlqp';
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function toast(message) {
    try { if (typeof showToast === 'function') return showToast(message); } catch (_) {}
    const el = q('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2500);
  }

  function ensureHeroImage() {
    const card = q('.magic-orbit-card');
    if (!card || q('.hero-brand-art', card)) return;
    const img = document.createElement('img');
    img.className = 'hero-brand-art';
    img.src = 'social-preview.png';
    img.alt = 'Jordan Disney travel planning artwork';
    img.loading = 'eager';
    img.decoding = 'async';
    card.prepend(img);
    card.insertAdjacentHTML('beforeend', '<div class="hero-art-badge"><span>✦</span> Jordan · Disney trips, beautifully planned</div>');
  }

  async function sendForm(form, status) {
    const submit = q('[type="submit"]', form);
    const original = submit?.textContent || 'Send';
    if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
    if (status) { status.textContent = 'Sending to Jordan…'; status.className = 'formspree-status'; }
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        let detail = 'Please try again.';
        try {
          const body = await response.json();
          if (body?.errors?.length) detail = body.errors.map(e => e.message).join(' ');
        } catch (_) {}
        throw new Error(detail);
      }
      if (status) { status.textContent = 'Sent to Jordan ✓'; status.className = 'formspree-status is-success'; }
      if (submit) submit.textContent = 'Sent ✓';
      try {
        if (typeof sparkleBurst === 'function') {
          const r = submit.getBoundingClientRect();
          sparkleBurst(r.left + r.width / 2, r.top + r.height / 2, 18);
        }
      } catch (_) {}
      return true;
    } catch (error) {
      if (status) { status.textContent = `Could not send. ${error.message || 'Please try again.'}`; status.className = 'formspree-status is-error'; }
      if (submit) { submit.disabled = false; submit.textContent = original; }
      return false;
    }
  }

  function ensureContactForm() {
    const intro = q('#why-jordan .book-jordan-intro');
    if (!intro || q('#jordan-contact-form')) return;
    intro.insertAdjacentHTML('beforeend', `
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
    const form = q('#jordan-contact-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const ok = await sendForm(form, q('#jordan-contact-status'));
      if (ok) { form.querySelector('textarea').value = ''; toast('Your note was sent to Jordan.'); }
    });
    try { if (typeof bindMagicClicks === 'function') bindMagicClicks(); } catch (_) {}
  }

  function buildTripBrief() {
    const val = id => q(id)?.value?.trim?.() || q(id)?.value || '';
    const text = id => q(id)?.textContent?.trim() || '';
    const option = id => {
      const el = q(id);
      return el?.selectedOptions?.[0]?.textContent?.trim() || el?.value || '';
    };
    const ages = qa('[data-child-age]').map(el => el.value).filter(Boolean).join(', ');
    return [
      'JORDAN — DISNEY BOOKING REQUEST', '',
      `Destination: ${option('#destination')}`,
      `Dates: ${val('#start-date')} → ${val('#end-date')}`,
      `Origin airport: ${val('#origin-airport') || 'Not set'}`,
      `Travelers: ${val('#adults') || '0'} adult(s), ${val('#children') || '0'} child(ren)${ages ? ` · ages ${ages}` : ''}`,
      `Stay preference: ${option('#stay-type') || 'Not set'}`,
      `Hotel candidate: ${option('#hotel-candidate') || 'Not selected'}`,
      `Flight preference: ${option('#flight-preference') || 'Not set'}`,
      `Dining style: ${option('#dining-style') || 'Not set'}`,
      `Transfer style: ${option('#transfer-style') || 'Not set'}`,
      `Experience days: ${val('#park-days') || '0'}`,
      `Ticket style: ${option('#ticket-style')}`,
      `Paid priority / premium days: ${val('#premium-days') || '0'}`, '',
      `Estimated trip total: ${text('#grand-total')}`,
      `Tickets / experiences: ${text('#ticket-total')}`,
      `Lodging: ${text('#lodging-total')}`,
      `Airfare: ${text('#airfare-total')}`,
      `Food + extras: ${text('#food-total')}`,
      `Ground transport: ${text('#transport-total-display')}`,
      `Paid priority / premium: ${text('#premium-total') || '—'}`, '',
      `Planner note: ${text('#budget-message')}`,
      `Page: ${location.href.split('#')[0]}`
    ].join('\n');
  }

  function signatureMarkup() {
    return `
      <div class="signed-v5-stage" aria-label="Signed with a J animation">
        <span class="signed-v5-star sv5-s1">✦</span>
        <span class="signed-v5-star sv5-s2">✧</span>
        <span class="signed-v5-star sv5-s3">✦</span>
        <span class="signed-v5-star sv5-s4">✧</span>
        <div class="signed-v5-write-window" id="signed-v5-window">
          <div class="signed-v5-wordmark" id="signed-v5-wordmark">Signed with a J</div>
        </div>
        <div class="signed-v5-underline" id="signed-v5-underline"></div>
        <div class="signed-v5-heart" id="signed-v5-heart">♡</div>
        <div class="signed-v5-pen" id="signed-v5-pen"><i></i></div>
      </div>`;
  }

  function installSignature() {
    const oldBudget = q('#signed-budget-trigger');
    const oldAbout = q('#about-sign-trigger');
    if ((!oldBudget && !oldAbout) || document.documentElement.dataset.signedV5 === '1') return false;
    document.documentElement.dataset.signedV5 = '1';

    const freshen = el => {
      if (!el) return null;
      const clone = el.cloneNode(true);
      el.replaceWith(clone);
      return clone;
    };
    const budgetBtn = freshen(oldBudget);
    const aboutBtn = freshen(oldAbout);
    q('#signed-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'signed-overlay';
    overlay.id = 'signed-overlay';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="signed-overlay-backdrop" data-signed-close></div>
      <div class="signed-v5-card" role="dialog" aria-modal="true" aria-labelledby="signed-overlay-title">
        <button class="signed-overlay-close magic-click" type="button" aria-label="Close Signed with a J" data-signed-close>×</button>
        <span class="section-kicker">Jordan approved</span>
        <h2 id="signed-overlay-title">Jordan approved.</h2>
        <p class="signed-overlay-copy">Watch Jordan’s final flourish, then send the complete trip forward as your booking request.</p>
        ${signatureMarkup()}
        <div id="signed-v5-content"></div>
      </div>`;
    document.body.appendChild(overlay);

    let raf = 0;
    let lastTrigger = null;
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    function play() {
      stop();
      const stage = q('.signed-v5-stage', overlay);
      const win = q('#signed-v5-window', overlay);
      const word = q('#signed-v5-wordmark', overlay);
      const underline = q('#signed-v5-underline', overlay);
      const heart = q('#signed-v5-heart', overlay);
      const pen = q('#signed-v5-pen', overlay);
      const stars = qa('.signed-v5-star', overlay);
      if (!stage || !win || !word) return;

      const target = Math.max(260, stage.clientWidth * 0.91);
      word.style.width = `${target}px`;
      win.style.width = '0px';
      underline.style.transform = 'scaleX(0)';
      underline.style.opacity = '0';
      heart.style.opacity = '0';
      heart.style.transform = 'scale(.55) rotate(-12deg)';
      pen.style.opacity = '0';
      pen.style.left = '4%';
      stars.forEach(s => { s.style.opacity = '0'; s.style.transform = 'scale(.35) rotate(-18deg)'; });

      if (reducedMotion()) {
        win.style.width = `${target}px`;
        underline.style.transform = 'scaleX(1)';
        underline.style.opacity = '1';
        heart.style.opacity = '1';
        heart.style.transform = 'none';
        stars.forEach(s => { s.style.opacity = '.9'; s.style.transform = 'none'; });
        return;
      }

      const start = performance.now();
      const duration = 2500;
      const ease = t => 1 - Math.pow(1 - t, 3);
      const step = now => {
        const raw = Math.min(1, (now - start) / duration);
        const t = ease(raw);
        const width = target * t;
        win.style.width = `${width}px`;
        pen.style.left = `calc(4% + ${Math.max(0, width - 10)}px)`;
        pen.style.top = `${47 + Math.sin(t * Math.PI * 5) * 7}%`;
        pen.style.opacity = raw < .94 ? '1' : '0';

        const linePhase = Math.max(0, Math.min(1, (raw - .48) / .38));
        underline.style.transform = `scaleX(${linePhase})`;
        underline.style.opacity = String(linePhase);

        const heartPhase = Math.max(0, Math.min(1, (raw - .76) / .16));
        heart.style.opacity = String(heartPhase);
        heart.style.transform = `scale(${(.55 + .45 * heartPhase).toFixed(2)}) rotate(${(-12 + 12 * heartPhase).toFixed(1)}deg)`;

        stars.forEach((s, i) => {
          const p = Math.max(0, Math.min(1, (raw - (.12 + i * .15)) / .18));
          s.style.opacity = String(Math.min(.95, p * 1.2));
          s.style.transform = `scale(${(.35 + .65 * p).toFixed(2)}) rotate(${(-18 + 18 * p).toFixed(1)}deg)`;
        });

        if (raw < 1) raf = requestAnimationFrame(step);
        else { raf = 0; pen.style.opacity = '0'; }
      };
      raf = requestAnimationFrame(step);
      try {
        if (typeof sparkleBurst === 'function') sparkleBurst(innerWidth * .5, Math.min(innerHeight * .42, 330), 18);
      } catch (_) {}
    }

    function close() {
      stop();
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('signed-overlay-open');
      lastTrigger?.focus?.();
    }

    function renderContent(hasTrip) {
      const content = q('#signed-v5-content', overlay);
      if (!hasTrip) {
        content.innerHTML = `
          <div class="signed-v5-actions">
            <button id="signed-v5-replay" class="button button-secondary magic-click" type="button">Replay the magic</button>
            <a class="button button-primary magic-click" href="#builder" data-signed-close>Build my trip →</a>
            <button class="button button-ghost magic-click" type="button" data-signed-close>Close</button>
          </div>
          <p class="signed-v5-demo-note">This is Jordan’s approval mark. Build and calculate a trip to use it as the final booking handoff.</p>`;
      } else {
        content.innerHTML = `
          <div class="signed-v5-booking-shell">
            <h3>Send this trip to Jordan</h3>
            <p>Your complete trip brief goes with this message through Formspree.</p>
            <form id="signed-booking-form" class="signed-booking-form" action="${FORM_ENDPOINT}" method="POST">
              <input type="hidden" name="_subject" value="Signed with a J — Disney booking request" />
              <input type="hidden" name="trip_brief" id="signed-trip-brief" />
              <input type="hidden" name="estimated_total" value="${q('#grand-total')?.textContent?.trim() || ''}" />
              <div class="signed-booking-grid">
                <label>Name<input name="name" autocomplete="name" required /></label>
                <label>Email<input type="email" name="email" autocomplete="email" required /></label>
                <label class="field-span-2">Phone <span class="signed-v5-optional">(optional)</span><input name="phone" autocomplete="tel" /></label>
                <label class="field-span-2">Anything Jordan should know?<textarea name="message" placeholder="Celebration, priorities, accessibility needs, room preferences, questions…"></textarea></label>
              </div>
              <button class="button button-primary magic-click signed-booking-submit" type="submit">Send booking request to Jordan ✦</button>
              <p class="formspree-status" id="signed-booking-status" role="status" aria-live="polite"></p>
            </form>
            <div class="signed-v5-actions">
              <button id="signed-v5-replay" class="button button-secondary magic-click" type="button">Replay the magic</button>
              <button class="button button-ghost magic-click" type="button" data-signed-close>Keep planning</button>
            </div>
          </div>`;
        q('#signed-trip-brief', content).value = buildTripBrief();
        const form = q('#signed-booking-form', content);
        form.addEventListener('submit', async e => {
          e.preventDefault();
          q('#signed-trip-brief', form).value = buildTripBrief();
          const ok = await sendForm(form, q('#signed-booking-status', form));
          if (ok) toast('Your Signed with a J trip was sent to Jordan.');
        });
      }
      q('#signed-v5-replay', content)?.addEventListener('click', play);
      qa('[data-signed-close]', content).forEach(el => el.addEventListener('click', e => {
        if (el.matches('a[href="#builder"]')) setTimeout(() => q('#builder')?.scrollIntoView({ behavior: 'smooth' }), 0);
        close();
      }));
      try { if (typeof bindMagicClicks === 'function') bindMagicClicks(); } catch (_) {}
    }

    function open(trigger) {
      const total = q('#grand-total')?.textContent?.trim();
      const hasTrip = Boolean(total && total !== '—');
      if (trigger?.id === 'signed-budget-trigger' && !hasTrip) {
        toast('Calculate the trip first, then give it Jordan’s final flourish.');
        return;
      }
      lastTrigger = trigger;
      q('.signed-overlay-copy', overlay).textContent = hasTrip
        ? 'Your trip is ready for Jordan’s final flourish. Watch it sign, then send the complete plan forward as your booking request.'
        : 'This is Jordan’s final mark for a plan she is ready to stand behind.';
      overlay.hidden = false;
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('signed-overlay-open');
      renderContent(hasTrip);
      requestAnimationFrame(() => requestAnimationFrame(play));
      requestAnimationFrame(() => q('.signed-overlay-close', overlay)?.focus());
    }

    [budgetBtn, aboutBtn].filter(Boolean).forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      open(btn);
    }, true));
    qa('[data-signed-close]', overlay).forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (!overlay.hidden && e.key === 'Escape') close(); });
    return true;
  }

  function init() {
    ensureHeroImage();
    ensureContactForm();
    installSignature();
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    init();
    if ((q('.hero-brand-art') && q('#jordan-contact-form') && document.documentElement.dataset.signedV5 === '1') || tries > 100) clearInterval(timer);
  }, 120);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

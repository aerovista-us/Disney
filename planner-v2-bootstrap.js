(() => {
  if (document.documentElement.dataset.plannerV2Bootstrapped) return;
  document.documentElement.dataset.plannerV2Bootstrapped = "1";

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "planner-v2.css";
  document.head.appendChild(css);

  const form = document.getElementById("trip-builder");
  if (!form) return;

  const currencyNote = document.getElementById("currency-note");
  currencyNote?.insertAdjacentHTML("afterend", `
    <div><label for="origin-airport">Origin airport</label><input id="origin-airport" name="originAirport" type="text" maxlength="8" placeholder="GEG, SEA, LAX…" autocomplete="off" /><small id="route-note">Used to build a smarter flight-search route.</small></div>
    <div><label for="flight-preference">Flight preference</label><select id="flight-preference" name="flightPreference"><option value="balanced">Best overall route</option><option value="nonstop">Nonstop first</option><option value="value">Lowest practical fare</option><option value="comfort">Comfort / schedule first</option></select></div>
  `);

  const children = document.getElementById("children");
  if (children) {
    children.max = "8";
    children.closest("div")?.insertAdjacentHTML("afterend", `
      <div class="field-span-2 child-ages-shell" id="child-ages-shell" hidden><div class="subfield-heading"><strong>Child ages at travel</strong><span id="child-age-rule">Age rules change by destination.</span></div><div class="child-age-grid" id="child-age-grid"></div></div>
    `);
    children.insertAdjacentHTML("afterend", `<small>We’ll ask ages so ticket rules are more accurate.</small>`);
  }

  const lodging = document.getElementById("lodging-night")?.closest(".money-field")?.parentElement;
  lodging?.insertAdjacentHTML("beforebegin", `
    <div><label for="stay-type">Where do you want to stay?</label><select id="stay-type" name="stayType"><option value="on">Disney / on-property</option><option value="off">Off-property</option><option value="split">Split stay / compare both</option><option value="manual">I’ll choose later</option></select></div>
    <div><label for="hotel-candidate">Hotel candidate</label><select id="hotel-candidate" name="hotelCandidate"><option value="manual">Choose destination first</option></select><small id="hotel-note">Hotel suggestions are planning anchors, not live room quotes.</small></div>
  `);

  const food = document.getElementById("food-daily")?.closest(".money-field")?.parentElement;
  food?.insertAdjacentHTML("beforebegin", `
    <div><label for="dining-style">Dining style</label><select id="dining-style" name="diningStyle"><option value="quick">Mostly quick-service</option><option value="mixed" selected>Mix of quick + table service</option><option value="table">Table-service forward</option><option value="character">Character / signature dining heavy</option></select></div>
  `);
  food?.insertAdjacentHTML("beforeend", `<small>Adjusted by dining style; still fully editable.</small>`);

  const transport = document.getElementById("transport-total")?.closest(".money-field")?.parentElement;
  transport?.insertAdjacentHTML("beforebegin", `
    <div><label for="transfer-style">Airport / resort transfers</label><select id="transfer-style" name="transferStyle"><option value="resort">Transit / resort transport</option><option value="rideshare" selected>Rideshare / taxi</option><option value="rental">Rental car</option><option value="private">Private transfer</option><option value="manual">Custom amount</option></select></div>
  `);
  transport?.insertAdjacentHTML("beforeend", `<small>Editable round-trip / trip-total estimate.</small>`);
  transport?.insertAdjacentHTML("afterend", `
    <div><label for="premium-days">Paid priority / premium days</label><input id="premium-days" name="premiumDays" type="number" min="0" max="10" value="2" /><small>Lightning Lane, Premier Access, paid priority or premium add-ons.</small></div>
    <div><label for="premium-daily">Premium budget / ticketed guest / day</label><div class="money-field"><span data-premium-symbol>$</span><input id="premium-daily" name="premiumDaily" type="number" min="0" step="5" value="35" /></div><small>Planning allowance—not a quoted product price.</small></div>
  `);

  const costList = document.querySelector(".cost-list");
  costList?.insertAdjacentHTML("beforeend", `<div><span>Paid priority / premium <i class="data-tag estimate">estimate</i></span><strong id="premium-total">—</strong></div>`);

  const panelActions = document.querySelector(".budget-panel .panel-actions");
  if (panelActions) {
    panelActions.classList.add("panel-actions-signed");
    panelActions.insertAdjacentHTML("beforeend", `<a id="flight-search-link" class="button button-secondary magic-click" href="https://www.google.com/travel/flights" target="_blank" rel="noopener">Compare this flight route ↗</a><button id="signed-budget-trigger" class="button button-signed magic-click" type="button">Signed with a J <span aria-hidden="true">✦</span></button>`);
    panelActions.insertAdjacentHTML("afterend", `<p class="signed-help">When a trip idea feels truly Jordan-approved, it gets the final magical mark: <strong>Signed with a J.</strong></p>`);
  }

  const founderPoints = document.querySelector("#about .founder-points");
  founderPoints?.insertAdjacentHTML("afterend", `
    <div class="signature-story"><span class="section-kicker">Jordan approved</span><h3>Signed with a J.</h3><p>When Jordan really believes in a plan, a recommendation, or a finished trip design, it gets her final little mark of magic: <strong>Signed with a J.</strong> It is the signal that the details feel right and the trip is ready to shine.</p><div class="signature-story-actions"><button id="about-sign-trigger" class="button button-signed magic-click" type="button">Watch it sign itself <span aria-hidden="true">✦</span></button><span class="signature-tagline">Built on a wish. Signed with a J.</span></div></div>
  `);

  const toast = document.getElementById("toast");
  toast?.insertAdjacentHTML("beforebegin", `
    <div class="signed-overlay" id="signed-overlay" hidden aria-hidden="true"><div class="signed-overlay-backdrop" data-signed-close></div><div class="signed-overlay-card" role="dialog" aria-modal="true" aria-labelledby="signed-overlay-title"><button class="signed-overlay-close magic-click" type="button" aria-label="Close Signed with a J overlay" data-signed-close>×</button><span class="section-kicker">Jordan approved</span><h2 id="signed-overlay-title">Signed with a J.</h2><p class="signed-overlay-copy">A little final flourish for the trips, ideas, and recommendations that feel truly ready.</p><div class="signed-reveal" id="signed-reveal"><div class="signed-script-shell"><div class="signed-script-line"></div><div class="signed-script-mask"><div class="signed-script-wordmark">Signed with a J</div></div><div class="signed-script-underline"></div><div class="signed-script-heart">♡</div><div class="signed-script-tip"></div><span class="signed-star st1">✦</span><span class="signed-star st2">✧</span><span class="signed-star st3">✦</span><span class="signed-star st4">✧</span></div></div><div class="signed-overlay-actions"><button id="signed-replay" class="button button-secondary magic-click" type="button">Replay the magic</button><button class="button button-primary magic-click" type="button" data-signed-close>Back to the trip</button></div></div></div>
  `);

  if (typeof bindMagicClicks === "function") bindMagicClicks();

  const script = document.createElement("script");
  script.src = "planner-v2.js";
  document.head.appendChild(script);
})();
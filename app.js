const SITE_CONFIG = {
  plannerEmail: "",
  plannerName: "Jordan",
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

navToggle?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(open)));
  document.body.classList.toggle("menu-open", Boolean(open));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector("#trip-plan-form");
const result = document.querySelector("#plan-result");
const resultText = document.querySelector("#plan-result-text");
const copyButton = document.querySelector("#copy-plan");
const emailButton = document.querySelector("#email-plan");
const toast = document.querySelector("#toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function clean(value, fallback = "Not specified") {
  return String(value || "").trim() || fallback;
}

function buildTripBrief(data) {
  return [
    "JORDAN — DISNEY TRIP STARTER BRIEF",
    "",
    `Traveler: ${clean(data.get("name"))}`,
    `Email: ${clean(data.get("email"))}`,
    `Destination: ${clean(data.get("destination"), "Open to Jordan's recommendation")}`,
    `Travel window: ${clean(data.get("travelWindow"))}`,
    `Party: ${clean(data.get("party"))}`,
    `Trip style: ${clean(data.get("tripStyle"))}`,
    `Budget comfort zone: ${clean(data.get("budget"))}`,
    "",
    "What would make this trip special?",
    clean(data.get("notes"), "No notes yet."),
  ].join("\n");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const brief = buildTripBrief(data);

  if (resultText) resultText.textContent = brief;
  result?.classList.add("is-visible");
  result?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (emailButton) {
    if (SITE_CONFIG.plannerEmail) {
      const subject = encodeURIComponent(`Disney trip inquiry — ${clean(data.get("name"), "New traveler")}`);
      const body = encodeURIComponent(brief);
      emailButton.href = `mailto:${SITE_CONFIG.plannerEmail}?subject=${subject}&body=${body}`;
      emailButton.hidden = false;
    } else {
      emailButton.hidden = true;
    }
  }
});

copyButton?.addEventListener("click", async () => {
  const text = resultText?.textContent || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Trip brief copied.");
  } catch {
    showToast("Select the brief and copy it manually.");
  }
});

const plannerEmailNote = document.querySelector("[data-contact-status]");
if (plannerEmailNote && !SITE_CONFIG.plannerEmail) {
  plannerEmailNote.textContent = "Jordan’s booking email or consultation link should be connected before public launch.";
}

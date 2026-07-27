// ---------- Supported games + their module sets (drives both the grid and the preview) ----------
const GAMES = [
  {
    name: "Blox Fruits",
    icon: "🍈",
    tags: ["Auto Farm", "Raids", "ESP"],
    updated: "4h ago",
    sections: [
      {
        title: "Farming",
        items: [
          { label: "Auto Farm Level", type: "toggle", on: true },
          { label: "Auto Farm Mastery", type: "toggle", on: true },
          { label: "Fast Attack", type: "slider", value: 82 },
          { label: "Select Weapon", type: "select", value: "Melee" },
        ],
      },
      {
        title: "Raids & Bosses",
        items: [
          { label: "Auto Raid", type: "toggle", on: true },
          { label: "Auto Awaken", type: "toggle", on: false },
          { label: "Auto Boss Farm", type: "toggle", on: false },
        ],
      },
      {
        title: "Fruits",
        items: [
          { label: "Auto Store Fruit", type: "toggle", on: true },
          { label: "Fruit Sniper", type: "toggle", on: false },
          { label: "Fruit ESP", type: "toggle", on: true },
        ],
      },
      {
        title: "Misc",
        items: [
          { label: "No Clip", type: "toggle", on: false },
          { label: "Walk Speed", type: "slider", value: 45 },
          { label: "Server Hop On Fail", type: "toggle", on: true },
        ],
      },
    ],
  },
  {
    name: "Grow a Garden",
    icon: "🌱",
    tags: ["Auto Plant", "Auto Sell", "ESP"],
    updated: "1h ago",
    sections: [
      {
        title: "Automation",
        items: [
          { label: "Auto Plant", type: "toggle", on: true },
          { label: "Auto Harvest", type: "toggle", on: true },
          { label: "Auto Sell", type: "toggle", on: true },
          { label: "Harvest Delay", type: "slider", value: 24 },
        ],
      },
      {
        title: "Shop",
        items: [
          { label: "Auto Buy Seeds", type: "toggle", on: true },
          { label: "Seed Priority", type: "select", value: "Highest Value" },
          { label: "Auto Buy Gear", type: "toggle", on: false },
        ],
      },
      {
        title: "Visuals",
        items: [
          { label: "Rare Seed ESP", type: "toggle", on: true },
          { label: "Pet ESP", type: "toggle", on: false },
          { label: "Remove Fog", type: "toggle", on: true },
        ],
      },
    ],
  },
  {
    name: "Fisch",
    icon: "🎣",
    tags: ["Auto Fish", "Perfect Cast"],
    updated: "6h ago",
    sections: [
      {
        title: "Fishing",
        items: [
          { label: "Auto Fish", type: "toggle", on: true },
          { label: "Perfect Cast", type: "toggle", on: true },
          { label: "Instant Reel", type: "toggle", on: true },
          { label: "Cast Power", type: "slider", value: 100 },
        ],
      },
      {
        title: "Inventory",
        items: [
          { label: "Auto Sell Junk", type: "toggle", on: true },
          { label: "Keep Rarity", type: "select", value: "Legendary+" },
          { label: "Auto Favourite Rares", type: "toggle", on: true },
        ],
      },
      {
        title: "World",
        items: [
          { label: "Teleport To Hotspot", type: "toggle", on: false },
          { label: "Walk On Water", type: "toggle", on: false },
          { label: "Fish ESP", type: "toggle", on: true },
        ],
      },
    ],
  },
  {
    name: "Blade Ball",
    icon: "⚔️",
    tags: ["Auto Parry", "Spam"],
    updated: "2h ago",
    sections: [
      {
        title: "Parry",
        items: [
          { label: "Auto Parry", type: "toggle", on: true },
          { label: "Parry Mode", type: "select", value: "Predictive" },
          { label: "Ping Compensation", type: "slider", value: 68 },
          { label: "Curve Detection", type: "toggle", on: true },
        ],
      },
      {
        title: "Abilities",
        items: [
          { label: "Auto Spam Click", type: "toggle", on: false },
          { label: "Auto Ability", type: "toggle", on: true },
          { label: "Auto Dash", type: "toggle", on: false },
        ],
      },
      {
        title: "Visuals",
        items: [
          { label: "Ball Trail ESP", type: "toggle", on: true },
          { label: "Target Highlight", type: "toggle", on: true },
        ],
      },
    ],
  },
  {
    name: "Pet Simulator 99",
    icon: "🐾",
    tags: ["Auto Farm", "Auto Hatch"],
    updated: "9h ago",
    sections: [
      {
        title: "Farming",
        items: [
          { label: "Auto Break Blocks", type: "toggle", on: true },
          { label: "Auto Collect Coins", type: "toggle", on: true },
          { label: "Farm Radius", type: "slider", value: 55 },
        ],
      },
      {
        title: "Eggs",
        items: [
          { label: "Auto Hatch", type: "toggle", on: true },
          { label: "Best Egg Only", type: "toggle", on: true },
          { label: "Auto Delete Commons", type: "toggle", on: false },
        ],
      },
      {
        title: "Misc",
        items: [
          { label: "Auto Claim Chests", type: "toggle", on: true },
          { label: "Auto Rebirth", type: "toggle", on: false },
        ],
      },
    ],
  },
  {
    name: "Da Hood",
    icon: "🏙️",
    tags: ["Aimbot", "ESP", "Silent Aim"],
    updated: "3h ago",
    sections: [
      {
        title: "Aim",
        items: [
          { label: "Silent Aim", type: "toggle", on: true },
          { label: "Hit Part", type: "select", value: "Head" },
          { label: "Smoothness", type: "slider", value: 38 },
          { label: "FOV Circle", type: "toggle", on: true },
        ],
      },
      {
        title: "ESP",
        items: [
          { label: "Player Boxes", type: "toggle", on: true },
          { label: "Name Tags", type: "toggle", on: true },
          { label: "Health Bars", type: "toggle", on: true },
          { label: "Tracers", type: "toggle", on: false },
        ],
      },
      {
        title: "Movement",
        items: [
          { label: "Anti Lock", type: "toggle", on: true },
          { label: "Auto Block", type: "toggle", on: false },
        ],
      },
    ],
  },
  { name: "King Legacy", icon: "👑", tags: ["Auto Farm", "Auto Raid"], updated: "1d ago" },
  { name: "Anime Vanguards", icon: "🌀", tags: ["Auto Farm", "Auto Unit"], updated: "5h ago" },
  { name: "Adopt Me", icon: "🐶", tags: ["Auto Task", "Pet ESP"], updated: "2d ago" },
  { name: "Arsenal", icon: "🔫", tags: ["Aimbot", "ESP"], updated: "7h ago" },
  { name: "Brookhaven RP", icon: "🏠", tags: ["Fly", "Troll", "ESP"], updated: "1d ago" },
  { name: "Doors", icon: "🚪", tags: ["Entity ESP", "Auto Run"], updated: "3d ago" },
];

const PREVIEW_GAMES = GAMES.filter((g) => g.sections);

// ---------- Games grid ----------
function renderGames() {
  const grid = document.querySelector(".games-grid");
  if (!grid) return;

  grid.innerHTML = GAMES.map(
    (g) => `
      <article class="game-card glass">
        <div class="game-icon">${g.icon}</div>
        <div class="game-name">${g.name}</div>
        <div class="game-tags">
          ${g.tags.map((t) => `<span class="game-tag">${t}</span>`).join("")}
        </div>
        <div class="game-updated"><span class="dot dot-green"></span> Updated ${g.updated}</div>
      </article>
    `
  ).join("");
}

// ---------- Interactive hub preview ----------
function controlMarkup(item) {
  if (item.type === "slider") {
    return `
      <span class="ctl-slider" style="--val:${item.value}%">
        <span class="ctl-track"><span class="ctl-fill"></span><span class="ctl-knob"></span></span>
      </span>`;
  }
  if (item.type === "select") {
    return `<span class="ctl-select">${item.value}<i>▾</i></span>`;
  }
  return `<button class="ctl-toggle${item.on ? " on" : ""}" aria-pressed="${item.on}" aria-label="${item.label}"><span></span></button>`;
}

function renderPreview(index) {
  const game = PREVIEW_GAMES[index];
  const tabs = document.getElementById("appTabs");
  const modules = document.getElementById("appModules");
  const nameEl = document.getElementById("appGameName");
  const metaEl = document.getElementById("appGameMeta");
  if (!tabs || !modules || !game) return;

  tabs.innerHTML = PREVIEW_GAMES.map(
    (g, i) => `
      <button class="app-tab${i === index ? " active" : ""}" data-index="${i}">
        <span class="app-tab-icon">${g.icon}</span>
        <span class="app-tab-name">${g.name}</span>
      </button>`
  ).join("");

  const moduleCount = game.sections.reduce((n, s) => n + s.items.length, 0);
  nameEl.textContent = game.name;
  metaEl.textContent = `${moduleCount} modules · updated ${game.updated}`;

  modules.innerHTML = game.sections
    .map(
      (section) => `
      <section class="app-group">
        <h5>${section.title}</h5>
        ${section.items
          .map(
            (item) => `
          <div class="app-row">
            <span class="app-row-label">${item.label}</span>
            ${controlMarkup(item)}
          </div>`
          )
          .join("")}
      </section>`
    )
    .join("");
}

function initPreview() {
  const tabs = document.getElementById("appTabs");
  const modules = document.getElementById("appModules");
  if (!tabs || !modules) return;

  renderPreview(0);

  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".app-tab");
    if (tab) renderPreview(Number(tab.dataset.index));
  });

  // Let visitors flip the toggles so the panel feels live.
  modules.addEventListener("click", (e) => {
    const toggle = e.target.closest(".ctl-toggle");
    if (!toggle) return;
    const on = toggle.classList.toggle("on");
    toggle.setAttribute("aria-pressed", String(on));
  });
}

// ---------- Copy script ----------
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function initCopyScript() {
  const btn = document.getElementById("copyScriptBtn");
  const code = document.getElementById("scriptCode");
  if (!btn || !code) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent.trim());
      btn.textContent = "Copied!";
      showToast("Loader copied — paste it into your executor.");
      setTimeout(() => (btn.textContent = "Copy"), 1800);
    } catch {
      showToast("Copy failed — select the script and copy it manually.");
    }
  });
}

// ---------- Mobile nav ----------
function initNavToggle() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.getElementById("navToggle");
  if (!navbar || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = navbar.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  navbar.querySelectorAll(".nav-links a, .nav-cta a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Reveal on scroll ----------
function initReveal() {
  const targets = document.querySelectorAll(".section-head, .game-card, .why-card, .preview-wrap, .compare-wrap, .discord-card, .cta-card, .faq-item");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
  );

  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGames();
  initPreview();
  initCopyScript();
  initNavToggle();
  initReveal();
});

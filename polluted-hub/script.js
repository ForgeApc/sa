// ---------- Supported games data ----------
const GAMES = [
  { name: "Blox Fruits", icon: "🍈", tags: ["Auto Farm", "Dupe"] },
  { name: "Grow a Garden", icon: "🌱", tags: ["Auto Plant", "ESP"] },
  { name: "Pet Simulator 99", icon: "🐾", tags: ["Auto Farm", "Dupe"] },
  { name: "Fisch", icon: "🎣", tags: ["Auto Fish", "ESP"] },
  { name: "Blade Ball", icon: "⚔️", tags: ["Auto Parry"] },
  { name: "Da Hood", icon: "🏙️", tags: ["Aimbot", "ESP"] },
  { name: "King Legacy", icon: "👑", tags: ["Auto Farm"] },
  { name: "Anime Vanguards", icon: "🌀", tags: ["Auto Farm"] },
  { name: "Adopt Me", icon: "🐶", tags: ["Dupe", "ESP"] },
  { name: "Arsenal", icon: "🔫", tags: ["Aimbot", "ESP"] },
  { name: "Brookhaven RP", icon: "🏠", tags: ["Fly", "ESP"] },
  { name: "Doors", icon: "🚪", tags: ["ESP", "Auto Run"] },
];

function renderGames() {
  const grid = document.querySelector(".games-grid");
  if (!grid) return;

  grid.innerHTML = GAMES.map(
    (g) => `
      <div class="game-card glass">
        <div class="game-icon">${g.icon}</div>
        <div class="game-name">${g.name}</div>
        <div class="game-tags">
          ${g.tags.map((t) => `<span class="game-tag">${t}</span>`).join("")}
        </div>
      </div>
    `
  ).join("");
}

// ---------- Mobile nav toggle ----------
function initNavToggle() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.getElementById("navToggle");
  if (!navbar || !toggle) return;

  toggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navbar.classList.remove("open"));
  });
}

// ---------- Demo key generator (front-end only, no real key system) ----------
function randomSegment() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function initKeyDemo() {
  const display = document.getElementById("keyDisplay");
  const timer = document.getElementById("keyTimer");
  const generateBtn = document.getElementById("generateKeyBtn");
  const copyBtn = document.getElementById("copyKeyBtn");
  if (!display || !generateBtn || !copyBtn) return;

  let secondsLeft = 24 * 60 * 60;
  let countdownId = null;

  function formatTime(total) {
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `Valid for ${h}:${m}:${s}`;
  }

  function startCountdown() {
    clearInterval(countdownId);
    secondsLeft = 24 * 60 * 60;
    timer.textContent = formatTime(secondsLeft);
    countdownId = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1);
      timer.textContent = formatTime(secondsLeft);
      if (secondsLeft === 0) clearInterval(countdownId);
    }, 1000);
  }

  generateBtn.addEventListener("click", () => {
    display.textContent = `PH-${randomSegment()}-${randomSegment()}-${randomSegment()}`;
    startCountdown();
    generateBtn.textContent = "Regenerate Key";
  });

  copyBtn.addEventListener("click", async () => {
    const key = display.textContent.trim();
    if (key === "PH-XXXX-XXXX-XXXX") return;
    try {
      await navigator.clipboard.writeText(key);
      const original = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = original), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGames();
  initNavToggle();
  initKeyDemo();
});

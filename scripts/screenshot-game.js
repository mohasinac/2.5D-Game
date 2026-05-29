/**
 * screenshot-game.js
 * Visual screenshot test for the Beyblade game — new UI flow.
 *
 * Captures:
 *   A  Login → Landing Page → Game Select → Battle Cards → Story Cards  (3 viewports)
 *   B  Battle Cards — Tryout inline setup → GameRoomPage loading (portrait)
 *   C  Battle Cards — PvAI inline setup → GameRoomPage loading (landscape)
 *   D  GameRoomPage: Tryout full run — loading → launch → 30s gameplay (portrait)
 *   E  Admin: Dashboard (errors card) + Settings (2.5D toggle)
 *
 * Run: node scripts/screenshot-game.js
 * Output: test-results/screenshots/
 */
const puppeteer = require("puppeteer");
const path = require("path");
const fs   = require("fs");

const BASE_URL = process.env.GAME_URL    || "http://localhost:3002";
const EMAIL    = process.env.TEST_EMAIL  || "testadmin@letitrip.in";
const PASSWORD = process.env.TEST_PASSWORD || "TestAdmin1234!";
const SHOT_DIR = path.resolve("test-results/screenshots");

fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = {
  desktop:   { width: 1280, height: 800,  label: "desktop-1280" },
  portrait:  { width: 390,  height: 844,  label: "phone-portrait-390" },
  landscape: { width: 844,  height: 390,  label: "phone-landscape-844" },
};

let shotIndex = 0;
async function ss(page, label) {
  try {
    const vp  = page.viewport();
    const vpLabel = `${vp?.width ?? 0}x${vp?.height ?? 0}`;
    const idx = String(++shotIndex).padStart(2, "0");
    const p   = path.join(SHOT_DIR, `${idx}-${label}-${vpLabel}.png`);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`  📸  ${idx}-${label} [${vpLabel}]`);
  } catch { /* never abort on screenshot failure */ }
}

async function setViewport(page, vp) {
  await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 600 });
}

async function login(page) {
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 10_000 });
    await page.evaluate(() => {
      const e = document.querySelector('input[type="email"]');
      const p = document.querySelector('input[type="password"]');
      if (e) (e).value = "";
      if (p) (p).value = "";
    });
    await page.type('input[type="email"]',    EMAIL,    { delay: 40 });
    await page.type('input[type="password"]', PASSWORD, { delay: 40 });
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
    console.log("  ✅  Logged in");
  } catch (e) { console.log("  ⚠️  login:", e.message); }
}

async function waitForLoadingGone(page, warmupMs = 3800) {
  try {
    await page.waitForFunction(
      () => !document.querySelector('[data-testid="loading-progress"]'),
      { timeout: 35_000 }
    );
    console.log("  ✅  Loading overlay gone");
  } catch {
    console.log("  ⚠️  Loading overlay did not disappear in 35s");
  }
  await sleep(warmupMs);
}

async function doLaunch(page, holdMs = 5500) {
  console.log(`  🚀  Holding Space for launch (${holdMs}ms)…`);
  await page.focus("canvas").catch(() => {});
  await page.keyboard.down("Space");
  await sleep(holdMs);
  await page.keyboard.up("Space");
  await sleep(500);
}

const pressKey = async (page, key, ms = 150) => {
  await page.keyboard.down(key);
  await sleep(ms);
  await page.keyboard.up(key);
};

const KEYS = ["KeyD","KeyA","KeyW","KeyS","KeyD","KeyJ","KeyK","KeyA","KeyD"];

async function playLoop(page, label, durationMs) {
  console.log(`  ⚔️   Playing ${durationMs/1000}s…`);
  const startMs = Date.now();
  let turn = 0;
  while (Date.now() - startMs < durationMs) {
    const elapsed = Date.now() - startMs;
    const k = KEYS[turn % KEYS.length];
    await pressKey(page, k, k === "KeyJ" || k === "KeyK" ? 80 : 300);
    await sleep(60);
    turn++;
    if (Math.floor(elapsed / 10_000) > Math.floor((elapsed - 360) / 10_000)) {
      await ss(page, `${label}-playing-${Math.floor(elapsed/1000)}s`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log("🚀  Launching Chromium…");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1300,900"],
  });

  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/(websocket|net::err|firebase|alphamode|webgl|load failed|econnrefused|auth\/)/i.test(t))
        console.log("  [page-error]", t.slice(0, 140));
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION A — New page flow at 3 viewports
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  A. New page flow (3 viewports)  ━━━");

  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await setViewport(page, vp);
    console.log(`\n  ▸ ${vp.label}`);

    // Login
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await sleep(800);
    await ss(page, "login");
    await login(page);
    await sleep(800);

    // Landing page (/)
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "landing-page");

    // Game Mode Select (/game)
    await page.goto(`${BASE_URL}/game`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "game-mode-select");

    // Battle Mode Cards (/game/battle)
    await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "battle-mode-cards");

    // Story Mode Cards (/game/story)
    await page.goto(`${BASE_URL}/game/story`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "story-mode-cards");

    // Legacy redirect: /game/2d/ai-battle → /game/battle
    await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(800);
    await ss(page, "legacy-redirect-ai-battle");

    // Legacy redirect: /game/2d/tryout → /game/battle
    await page.goto(`${BASE_URL}/game/2d/tryout`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(800);
    await ss(page, "legacy-redirect-tryout");

    // PvP lobby still works
    await page.goto(`${BASE_URL}/game/2d/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1000);
    await ss(page, "pvp-battle-lobby");

    // Tournament list still works
    await page.goto(`${BASE_URL}/game/2d/tournament`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1000);
    await ss(page, "tournament-list");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION B — Battle cards interactive: scroll through cards (portrait)
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  B. Battle cards interaction (portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "cards-B-initial");

  // Arrow right to next card
  await page.keyboard.press("ArrowRight");
  await sleep(400);
  await ss(page, "cards-B-card2");

  await page.keyboard.press("ArrowRight");
  await sleep(400);
  await ss(page, "cards-B-card3");

  await page.keyboard.press("ArrowRight");
  await sleep(400);
  await ss(page, "cards-B-card4");

  await page.keyboard.press("ArrowRight");
  await sleep(400);
  await ss(page, "cards-B-card5");

  // Navigate back to card 1
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await sleep(400);
  await ss(page, "cards-B-back-card1");

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION C — GameRoomPage: Tryout via direct navigation with injected state
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  C. GameRoomPage — Tryout mode (portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);

  // Navigate to battle cards and click Tryout card (first card)
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "tryout-C-battle-cards");

  // Click the first card (Tryout)
  const tryoutCard = await page.$('[data-card-id="tryout"], button:first-child, .carousel-card');
  if (tryoutCard) {
    await page.evaluate((el) => el.click(), tryoutCard);
  } else {
    // Press Enter to select the current card
    await page.keyboard.press("Enter");
  }
  await sleep(1000);
  await ss(page, "tryout-C-after-select");

  // If we're on game/room, great. If not, inject state and navigate directly.
  if (!page.url().includes("/game/room")) {
    console.log("  ℹ️  Injecting location state to navigate to GameRoomPage…");
    // Use evaluate to navigate with state via React Router's programmatic navigation
    await page.evaluate((baseUrl) => {
      window.history.pushState(
        { config: { roomType: "tryout", beybladeId: "", arenaId: "" } },
        "",
        "/game/room"
      );
      window.dispatchEvent(new PopStateEvent("popstate", { state: { config: { roomType: "tryout", beybladeId: "", arenaId: "" } } }));
    }, BASE_URL);
    await sleep(1000);
  }

  await ss(page, "tryout-C-room-page");

  // Wait for canvas
  try {
    await page.waitForSelector("canvas", { timeout: 20_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 20_000 });
    console.log("  ✅  Canvas visible");
  } catch { console.log("  ⚠️  canvas timeout"); }

  await ss(page, "tryout-C-canvas");

  // Show loading progress
  const loadingVisible = await page.$('[data-testid="loading-progress"]');
  if (loadingVisible) {
    console.log("  ✅  LoadingProgress overlay visible");
    await ss(page, "tryout-C-loading-progress");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION D — Full Tryout run: loading → launch → 30s gameplay (portrait)
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  D. Tryout full run (portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);
  // Navigate to /game/room with tryout state
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);

  // Navigate programmatically with state (simulate BattleModeCardsPage navigation)
  await page.evaluate(() => {
    const evt = new CustomEvent("__nav_game_room__", {
      detail: { config: { roomType: "tryout", beybladeId: "", arenaId: "" } }
    });
    document.dispatchEvent(evt);
  });

  // Fallback: navigate via React Router link injection
  await page.evaluate((url) => {
    // Use history API — React Router will pick this up via its listener
    window.history.pushState(
      { usr: { config: { roomType: "tryout", beybladeId: "", arenaId: "" } } },
      "",
      "/game/room"
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, BASE_URL);
  await sleep(1500);

  await ss(page, "room-D-navigated");

  // Wait for canvas to appear
  try {
    await page.waitForSelector("canvas", { timeout: 20_000 });
    console.log("  ✅  Canvas present");
  } catch { console.log("  ⚠️  Canvas not found, checking page state…"); }

  await ss(page, "room-D-canvas");

  // Loading steps
  for (const step of ["connecting-ws", "joining-room", "loading-arena-assets", "loading-beyblade-assets"]) {
    const dot = await page.$(`[data-testid="loading-step-${step}"]`).catch(() => null);
    if (dot) console.log(`  ✅  LoadingProgress step visible: ${step}`);
  }

  await ss(page, "room-D-loading-steps");

  // Wait through loading → warmup
  await waitForLoadingGone(page, 500);
  await ss(page, "room-D-countdown");

  // Launch!
  await doLaunch(page, 9000);
  await ss(page, "room-D-launched");

  // Gameplay
  await playLoop(page, "room-D", 30_000);
  await ss(page, "room-D-30s-end");

  // Wait for result
  await sleep(5000);
  await ss(page, "room-D-result");

  const resultText = await page.evaluate(() => {
    const els = document.querySelectorAll("h1,h2,h3,[class*=winner],[class*=result],[class*=victory]");
    return Array.from(els).map(el => el.textContent?.trim()).filter(Boolean).slice(0, 5).join(" | ");
  }).catch(() => "");
  if (resultText) console.log("  🏆  Result text:", resultText);

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION E — Admin: Dashboard + Settings
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  E. Admin pages (dashboard + settings)  ━━━");

  await setViewport(page, VIEWPORTS.desktop);

  await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1800);
  await ss(page, "admin-E-dashboard");

  // Scroll to see Recent Errors section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(600);
  await ss(page, "admin-E-dashboard-errors-section");

  await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "admin-E-settings");

  // Scroll to see 2.5D toggle
  await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll("p")).find(p => p.textContent?.includes("2.5D"));
    toggle?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await sleep(600);
  await ss(page, "admin-E-settings-25d-toggle");

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION F — GameRoomPage landscape + GBA shell visual check
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  F. GameRoomPage GBA shell (landscape)  ━━━");

  await setViewport(page, VIEWPORTS.landscape);
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);

  await page.evaluate(() => {
    window.history.pushState(
      { usr: { config: { roomType: "tryout", beybladeId: "", arenaId: "" } } },
      "",
      "/game/room"
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await sleep(1500);
  await ss(page, "shell-F-landscape-loading");

  try {
    await page.waitForSelector("canvas", { timeout: 20_000 });
  } catch { console.log("  ⚠️  canvas timeout (landscape)"); }

  await ss(page, "shell-F-landscape-canvas");

  await waitForLoadingGone(page, 500);
  await ss(page, "shell-F-landscape-countdown");

  await doLaunch(page, 9000);
  await ss(page, "shell-F-landscape-launched");

  await playLoop(page, "shell-F", 15_000);
  await ss(page, "shell-F-landscape-gameplay");

  // ══════════════════════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════════════════════
  console.log(`\n🎉  Done! ${shotIndex} screenshots → test-results/screenshots/`);
  console.log("   Closing in 6s…");
  await sleep(6000);
  await browser.close();
}

run().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});

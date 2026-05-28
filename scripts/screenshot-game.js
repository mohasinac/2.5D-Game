/**
 * screenshot-game.js
 * Comprehensive visual screenshot test for the Beyblade game.
 *
 * Captures screenshots of:
 *   - Login, Home, Game-Select (3 viewports)
 *   - GBC portrait controls overlay (390 x 844)
 *   - GBA landscape controls overlay (844 x 390)
 *   - AI Battle: setup → loading → game (GB controls visible) → result
 *
 * Run: node scripts/screenshot-game.js
 * Output: test-results/screenshots/
 */
const puppeteer = require("puppeteer");
const path = require("path");
const fs   = require("fs");

const BASE_URL = process.env.GAME_URL    || "https://game.letitrip.in";
const EMAIL    = process.env.TEST_EMAIL  || "testadmin@letitrip.in";
const PASSWORD = process.env.TEST_PASSWORD || "TestAdmin1234!";
const SHOT_DIR = path.resolve("test-results/screenshots");

fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Viewports ────────────────────────────────────────────────────────────────

const VIEWPORTS = {
  desktop:   { width: 1280, height: 800,  label: "desktop-1280" },
  portrait:  { width: 390,  height: 844,  label: "phone-portrait-390" },
  landscape: { width: 844,  height: 390,  label: "phone-landscape-844" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

async function clickText(page, regex, { touch = false } = {}) {
  const buttons = await page.$$("button,a,[role=button]");
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent?.trim() ?? "", btn);
    if (regex.test(text)) {
      const box = await btn.boundingBox();
      if (!box) continue;
      if (touch) {
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await btn.click();
      }
      return true;
    }
  }
  return false;
}

const pressKey = async (page, key, ms = 150) => {
  await page.keyboard.down(key);
  await sleep(ms);
  await page.keyboard.up(key);
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log("🚀  Launching Chromium (headless: false)…");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,         // we set viewport per test
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1300,900"],
  });

  const page = await browser.newPage();

  // Enable touch events so the GB control overlay renders
  const cdp = await page.createCDPSession();
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/(websocket|net::err|firebase|alphamode|webgl|load failed|econnrefused|auth\/)/i.test(t))
        console.log("  [page-error]", t.slice(0, 140));
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION A — Login + static screens at three viewports
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  A. Login & static screens (3 viewports)  ━━━");

  for (const [key, vp] of Object.entries(VIEWPORTS)) {
    await setViewport(page, vp);
    console.log(`\n  ▸ ${vp.label}`);

    // Login page
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await sleep(800);
    await ss(page, "login");

    // Fill credentials and submit
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 10_000 });
      await page.evaluate(() => {
        const e = document.querySelector('input[type="email"]');
        const p = document.querySelector('input[type="password"]');
        if (e) e.value = "";
        if (p) p.value = "";
      });
      await page.type('input[type="email"]',    EMAIL,    { delay: 40 });
      await page.type('input[type="password"]', PASSWORD, { delay: 40 });
      await page.click('button[type="submit"]');
      await page.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
    } catch (e) { console.log("    ⚠️  login:", e.message); }

    await sleep(800);
    await ss(page, "home");

    // Game select page
    await page.goto(`${BASE_URL}/game`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "game-select");

    // AI Battle setup
    await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1500);
    await ss(page, "ai-battle-setup");

    // Lobby
    await page.goto(`${BASE_URL}/game/2d/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "battle-lobby");

    // Tournament list
    await page.goto(`${BASE_URL}/game/2d/tournament`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, "tournament-list");

    // Only do leaderboard once (no game-route, no controls expected there)
    if (key === "desktop") {
      await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: "domcontentloaded", timeout: 20_000 });
      await sleep(1200);
      await ss(page, "leaderboard");
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION B — GBC portrait control overlay (390 x 844)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  B. GBC portrait controls (390 × 844)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);

  await page.goto(`${BASE_URL}/game`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "gbc-game-select");

  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "gbc-ai-setup");

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION C — GBA landscape control overlay (844 x 390)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  C. GBA landscape controls (844 × 390)  ━━━");

  await setViewport(page, VIEWPORTS.landscape);

  await page.goto(`${BASE_URL}/game`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "gba-game-select");

  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "gba-ai-setup");

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION D — Full AI battle run (portrait phone, GBC layout)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  D. Full AI battle run (GBC portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);

  // Navigate to AI setup
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(2500); // wait for Firestore data (beyblades/arenas) to load

  // Pick Medium difficulty
  console.log("  👆  Selecting Medium difficulty…");
  await clickText(page, /medium/i, { touch: true });
  await sleep(300);

  // Pick BO1
  console.log("  👆  Selecting BO1…");
  await clickText(page, /^bo1$/i);
  await sleep(300);

  // Select first beyblade from the player picker (click first list item)
  console.log("  👆  Selecting player beyblade…");
  try {
    // EntityPicker renders a list — click the first selectable item
    const items = await page.$$('[role="option"], li[data-id], button[data-bey], .entity-item, [class*="cursor-pointer"]');
    for (const item of items) {
      const text = await page.evaluate((el) => el.textContent?.trim() ?? "", item);
      if (text.length > 2) { // skip empty/icon-only elements
        await item.click();
        console.log("    ✅  Selected player bey:", text.slice(0, 30));
        break;
      }
    }
  } catch (e) { console.log("  ⚠️  bey select:", e.message); }
  await sleep(500);
  await ss(page, "battle-D-setup-bey");

  await ss(page, "battle-D-setup-ready");

  // Start — use regular click (not touch) to ensure navigation fires
  console.log("  ▶️   Starting battle…");
  let started = false;
  try {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent?.trim() ?? "", btn);
      const disabled = await page.evaluate((el) => el.disabled, btn);
      if (/^start\b/i.test(text) && !disabled) {
        await btn.click();
        console.log("  ✅  Clicked Start:", text);
        started = true;
        break;
      }
    }
    if (!started) console.log("  ⚠️  Start button not found or disabled (selections missing)");
  } catch (e) { console.log("  ⚠️  start:", e.message); }
  await sleep(800);

  // Wait for game page — longer timeout since server cold-start
  try {
    await page.waitForFunction(
      () => window.location.pathname.includes("ai-battle/play"),
      { timeout: 30_000 }
    );
    console.log("  ✅  Game page reached:", page.url());
  } catch { console.log("  ⚠️  game page navigation timeout — still at:", page.url()); }

  await sleep(2000);
  await ss(page, "battle-D-loading");

  // Wait for canvas + loading overlay to dismiss (up to 20s — fallback timers run at 14s)
  console.log("  ⏳  Waiting for canvas + loading overlay to clear…");
  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 30_000 });
    console.log("  ✅  Canvas visible!");
  } catch { console.log("  ⚠️  canvas not visible in 30 s"); }

  // Extra wait for loading overlay to dismiss (fallback timers: step4=3s, step5=8s, step6=14s)
  await sleep(16_000);
  await ss(page, "battle-D-loading-clear");

  await sleep(1000);
  await ss(page, "battle-D-canvas");

  // Wait through warmup (3-s countdown)
  console.log("  ⏳  Warmup (3 s)…");
  await sleep(3500);
  await ss(page, "battle-D-warmup");

  // Launch — hold Space
  console.log("  🚀  Launching (Space held 2.5 s)…");
  await page.focus("canvas").catch(() => {});
  await page.keyboard.down("Space");
  await sleep(2500);
  await page.keyboard.up("Space");
  await sleep(800);
  await ss(page, "battle-D-launched");

  // Play 30 s (keyboard only — stable, no chrome crashes)
  console.log("  ⚔️   Playing 30 s (keyboard)…");
  const vp   = VIEWPORTS.portrait;
  const W = vp.width, H = vp.height;
  const joyX = Math.round(W * 0.18), joyY = Math.round(H * 0.75);

  const KEYS = ["KeyD","KeyA","KeyW","KeyS","KeyD","KeyJ","KeyK","KeyA","KeyD","KeyJ","KeyL","KeyW","KeyJ","KeyD","KeyA","KeyJ"];
  const startMs = Date.now();
  let turn = 0;
  while (Date.now() - startMs < 30_000) {
    const k = KEYS[turn % KEYS.length];
    await pressKey(page, k, k === "KeyJ" || k === "KeyK" || k === "KeyL" ? 80 : 300);
    await sleep(60);
    turn++;
    const elapsed = Date.now() - startMs;
    if (Math.floor(elapsed / 10_000) > Math.floor((elapsed - 260) / 10_000)) {
      await ss(page, `battle-D-playing-${Math.floor(elapsed / 1000)}s`);
      console.log(`    🕐  t=${Math.floor(elapsed/1000)}s`);
    }
  }

  await ss(page, "battle-D-end");
  console.log("  ✅  30 s play complete");

  // Wait for result
  await sleep(5000);
  await ss(page, "battle-D-result");

  const resultText = await page.evaluate(() => {
    const els = document.querySelectorAll("h1,h2,h3,[class*=winner],[class*=result],[class*=victory]");
    return Array.from(els).map((el) => el.textContent?.trim()).filter(Boolean).slice(0, 5).join(" | ");
  }).catch(() => "");
  if (resultText) console.log("  🏆  Result:", resultText);

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION E — GBA landscape battle run
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  E. AI battle run (GBA landscape)  ━━━");

  await setViewport(page, VIEWPORTS.landscape);
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);

  await clickText(page, /medium/i, { touch: true });
  await sleep(300);
  await clickText(page, /^bo1$/i);
  await sleep(300);
  await ss(page, "battle-E-setup");

  const startedE = await clickText(page, /^start\b/i, { touch: true });
  if (!startedE) await page.keyboard.press("Enter");

  try {
    await page.waitForFunction(
      () => window.location.pathname.includes("ai-battle/play"),
      { timeout: 20_000 }
    );
  } catch { console.log("  ⚠️  game page timeout"); }

  await sleep(1500);
  await ss(page, "battle-E-loading");

  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 30_000 });
  } catch { console.log("  ⚠️  canvas timeout"); }

  await sleep(1000);
  await ss(page, "battle-E-canvas");

  await sleep(3500); // warmup
  await page.focus("canvas").catch(() => {});
  await page.keyboard.down("Space");
  await sleep(2500);
  await page.keyboard.up("Space");
  await sleep(800);
  await ss(page, "battle-E-launched");

  // 15 s quick play in landscape
  console.log("  ⚔️   Playing 15 s (landscape)…");
  const startEMs = Date.now();
  let turnE = 0;
  while (Date.now() - startEMs < 15_000) {
    const k = KEYS[turnE % KEYS.length];
    await pressKey(page, k, k === "KeyJ" || k === "KeyK" || k === "KeyL" ? 80 : 300);
    await sleep(60);
    turnE++;
  }
  await ss(page, "battle-E-playing");
  await sleep(3000);
  await ss(page, "battle-E-end");

  // ══════════════════════════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════════════════════════

  console.log(`\n🎉  Done! ${shotIndex} screenshots → test-results/screenshots/`);
  console.log("   Closing in 6 s…");
  await sleep(6000);
  await browser.close();
}

run().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});

/**
 * screenshot-game.js
 * Comprehensive visual screenshot test for the Beyblade game.
 *
 * Captures screenshots of:
 *   A  Login, Home, Game-Select (3 viewports)
 *   B  GBC portrait controls overlay (390 x 844)
 *   C  GBA landscape controls overlay (844 x 390)
 *   D  AI Battle: setup → loading → game (GBC portrait) → 30 s gameplay
 *   E  AI Battle: GBA landscape version
 *   F  Tryout mode (server-free, portrait)
 *   G  2.5D renderer: AI battle in tilt-perspective arena
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

async function clickText(page, regex) {
  const buttons = await page.$$("button,a,[role=button]");
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent?.trim() ?? "", btn);
    if (regex.test(text)) {
      await page.evaluate((el) => el.click(), btn); // evaluate-click bypasses overlay z-index
      return true;
    }
  }
  return false;
}

// Wait up to timeoutMs for a non-disabled button matching regex; returns the handle or null
async function waitForEnabledButton(page, regex, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent?.trim() ?? "", btn);
      const disabled = await page.evaluate((el) => el.disabled, btn);
      if (regex.test(text) && !disabled) return btn;
    }
    await sleep(400);
  }
  return null;
}

const pressKey = async (page, key, ms = 150) => {
  await page.keyboard.down(key);
  await sleep(ms);
  await page.keyboard.up(key);
};

// Wait for loading overlay to disappear, then sleep warmupMs before returning.
// This replaces the old fixed 16-second wait. The loading overlay uses
// data-testid="loading-progress". Once it's gone the warmup countdown has started
// (or may already be past warmup and into launching).
async function waitForLoadingGone(page, warmupMs = 3800) {
  try {
    await page.waitForFunction(
      () => !document.querySelector('[data-testid="loading-progress"]'),
      { timeout: 35_000 }
    );
    console.log("  ✅  Loading overlay gone — warmup starting");
  } catch {
    console.log("  ⚠️  Loading overlay did not disappear in 35 s — continuing anyway");
  }
  // Sleep through the warmup countdown (3 s) with a small buffer.
  await sleep(warmupMs);
}

// Hold Space for the launch phase (5-s window), then release.
async function doLaunch(page, holdMs = 5500) {
  console.log(`  🚀  Holding Space for launch (${holdMs} ms)…`);
  await page.focus("canvas").catch(() => {});
  await page.keyboard.down("Space");
  await sleep(holdMs);
  await page.keyboard.up("Space");
  await sleep(500);
}

// Navigate to AI battle, wait for game page, return true on success.
async function startAiBattle(page) {
  await sleep(3500); // Firestore auto-selection
  await clickText(page, /medium/i);
  await sleep(300);
  await clickText(page, /^bo1$/i);
  await sleep(300);

  const startBtn = await waitForEnabledButton(page, /start/i, 10_000);
  if (!startBtn) {
    console.log("  ⚠️  Start button not enabled after 10 s — check Firestore data");
    return false;
  }
  await page.evaluate((el) => el.click(), startBtn);
  console.log("  ✅  Clicked Start");

  try {
    await page.waitForFunction(
      () => window.location.pathname.includes("ai-battle/play"),
      { timeout: 30_000 }
    );
    console.log("  ✅  Game page reached:", page.url());
    return true;
  } catch {
    console.log("  ⚠️  Game page navigation timeout — still at:", page.url());
    return false;
  }
}

// Play gameplay loop for durationMs, pressing KEYS in sequence.
const KEYS = ["KeyD","KeyA","KeyW","KeyS","KeyD","KeyJ","KeyK","KeyA","KeyD","KeyL","KeyW","KeyD","KeyA","KeyS","KeyW","KeyD"];

async function playLoop(page, label, durationMs) {
  console.log(`  ⚔️   Playing ${durationMs / 1000} s (${label})…`);
  const startMs = Date.now();
  let turn = 0;
  while (Date.now() - startMs < durationMs) {
    const k = KEYS[turn % KEYS.length];
    await pressKey(page, k, k === "KeyJ" || k === "KeyK" || k === "KeyL" ? 80 : 300);
    await sleep(60);
    turn++;
    const elapsed = Date.now() - startMs;
    if (Math.floor(elapsed / 10_000) > Math.floor((elapsed - 260) / 10_000)) {
      await ss(page, `${label}-playing-${Math.floor(elapsed / 1000)}s`);
      console.log(`    🕐  t=${Math.floor(elapsed/1000)}s`);
    }
  }
}

// Zoom camera out N times so both beys fit in frame.
async function zoomOut(page, times = 5) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.down("Minus"); await sleep(60); await page.keyboard.up("Minus");
    await sleep(120);
  }
}

// Tap Space < 150 ms → specialTap bit fires on server.
async function fireSpecial(page) {
  await page.keyboard.down("Space"); await sleep(60); await page.keyboard.up("Space");
  await sleep(400);
}

// Rapid key sequence for server-side combo detection.
async function fireCombo(page, keys, holdMs = 80, gapMs = 45) {
  for (const k of keys) {
    await page.keyboard.down(k); await sleep(holdMs); await page.keyboard.up(k);
    await sleep(gapMs);
  }
  await sleep(300);
}

// Full battle play block: zoom out + combo + special + normal loop.
async function battlePlayBlock(page, label, durationMs) {
  // Zoom out so both beys are visible in one frame
  await zoomOut(page, 5);
  await ss(page, `${label}-both-beys`);

  const startMs = Date.now();
  let turn = 0;
  let comboFired = false, specialFired = false, combo2Fired = false;

  console.log(`  ⚔️   Playing ${durationMs / 1000} s (${label}) — combos + specials…`);
  while (Date.now() - startMs < durationMs) {
    const elapsed = Date.now() - startMs;

    if (elapsed >= 2_000 && !comboFired) {
      comboFired = true;
      console.log("    🥊  Combo: JJJ (power-thrust)…");
      await fireCombo(page, ["KeyJ","KeyJ","KeyJ"]);
      await ss(page, `${label}-combo-power-thrust`);

    } else if (elapsed >= 6_000 && !specialFired) {
      specialFired = true;
      console.log("    ⚡  Special: Space tap…");
      await fireSpecial(page);
      await ss(page, `${label}-special-move`);

    } else if (elapsed >= 12_000 && !combo2Fired) {
      combo2Fired = true;
      console.log("    🛡️  Combo: KKK (guard-tap)…");
      await fireCombo(page, ["KeyK","KeyK","KeyK"]);
      await ss(page, `${label}-combo-guard-tap`);

    } else {
      const k = KEYS[turn % KEYS.length];
      await pressKey(page, k, k === "KeyJ" || k === "KeyK" || k === "KeyL" ? 80 : 300);
      await sleep(60);
      turn++;
    }

    const elapsedNow = Date.now() - startMs;
    if (Math.floor(elapsedNow / 10_000) > Math.floor((elapsedNow - 360) / 10_000)) {
      await ss(page, `${label}-playing-${Math.floor(elapsedNow / 1000)}s`);
      console.log(`    🕐  t=${Math.floor(elapsedNow/1000)}s`);
    }
  }
}

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
  //
  // Timing diagram:
  //   t=0s    room join → connecting-ws → joining-room → loading steps
  //   t=3-5s  status="launching" → loading overlay HIDES (warmup-ready step)
  //   t+0.5s  sleep buffer, then hold Space for 9s (full 10s launch window)
  //   t+9.5s  Space released → bey launches at max power
  //   Gameplay: zoom out to show both beys, fire combos + special, 30s play
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  D. Full AI battle run (GBC portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await ss(page, "battle-D-setup-ready");

  const startedD = await startAiBattle(page);

  await sleep(1500);
  await ss(page, "battle-D-loading");

  // Wait for canvas to become visible
  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 30_000 });
    console.log("  ✅  Canvas visible!");
  } catch { console.log("  ⚠️  canvas not visible in 30 s"); }

  await ss(page, "battle-D-canvas");

  // Wait for loading overlay → launching phase starts → 0.5s buffer → hold Space 9s.
  // This gives maximum time in the 10s launch window.
  await waitForLoadingGone(page, 500);
  await ss(page, "battle-D-launching");

  await doLaunch(page, 9000);
  await ss(page, "battle-D-launched");

  // Gameplay: zoom out + combos + special + 30s loop
  await battlePlayBlock(page, "battle-D", 30_000);
  await ss(page, "battle-D-end");
  console.log("  ✅  30 s play complete");

  await sleep(5000);
  await ss(page, "battle-D-result");

  const resultText = await page.evaluate(() => {
    const els = document.querySelectorAll("h1,h2,h3,[class*=winner],[class*=result],[class*=victory]");
    return Array.from(els).map((el) => el.textContent?.trim()).filter(Boolean).slice(0, 5).join(" | ");
  }).catch(() => "");
  if (resultText) console.log("  🏆  Result:", resultText);

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION E — GBA landscape battle run (same timing fix as Section D)
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  E. AI battle run (GBA landscape)  ━━━");

  await setViewport(page, VIEWPORTS.landscape);
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await ss(page, "battle-E-setup");

  await startAiBattle(page);

  await sleep(1500);
  await ss(page, "battle-E-loading");

  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 30_000 });
  } catch { console.log("  ⚠️  canvas timeout"); }

  await ss(page, "battle-E-canvas");

  await waitForLoadingGone(page, 500);
  await ss(page, "battle-E-launching");
  await doLaunch(page, 9000);
  await ss(page, "battle-E-launched");

  await battlePlayBlock(page, "battle-E", 20_000);
  await ss(page, "battle-E-end");

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION F — Tryout mode (server-free, portrait)
  //
  // - SP never depletes (floor at 5% maxSpin); no timeout; only Exit ends it.
  // - SP auto-refills to 150 every 10 s → press J to fire special.
  // - 4-position screenshots: bey steered to top / right / bottom / left.
  // - 40 s of normal play with combo + special captures.
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  F. Tryout mode (server-free, portrait)  ━━━");

  await setViewport(page, VIEWPORTS.portrait);
  await page.goto(`${BASE_URL}/game/2d/tryout`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "tryout-F-loaded");

  // Wait for canvas
  try {
    await page.waitForSelector("canvas", { timeout: 20_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 20_000 });
    console.log("  ✅  Tryout canvas visible");
  } catch { console.log("  ⚠️  tryout canvas timeout"); }

  await ss(page, "tryout-F-canvas");

  // Wait through 3-s countdown + small buffer
  console.log("  ⏳  Waiting for tryout countdown (3 s)…");
  await sleep(3800);
  await ss(page, "tryout-F-countdown-done");

  // Hold Space through the launch window (10 s locally, same constants as server)
  await doLaunch(page, 9000);
  await ss(page, "tryout-F-launched");

  // ── 4-position arena shots ────────────────────────────────────────────────
  // Zoom out far enough (15×) so the entire arena circle is visible in the
  // viewport — camera still follows the bey but the full arena + boundary ring
  // is shown, making the bey's position (top/right/bottom/left) obvious.
  await sleep(400);
  await zoomOut(page, 15);
  await sleep(300);

  console.log("  📍  Position: TOP (hold W)…");
  await page.keyboard.down("KeyW"); await sleep(3500); await page.keyboard.up("KeyW");
  await sleep(400);
  await ss(page, "tryout-F-position-top");

  console.log("  📍  Position: RIGHT (hold D)…");
  await page.keyboard.down("KeyD"); await sleep(4000); await page.keyboard.up("KeyD");
  await sleep(400);
  await ss(page, "tryout-F-position-right");

  console.log("  📍  Position: BOTTOM (hold S)…");
  await page.keyboard.down("KeyS"); await sleep(4000); await page.keyboard.up("KeyS");
  await sleep(400);
  await ss(page, "tryout-F-position-bottom");

  console.log("  📍  Position: LEFT (hold A)…");
  await page.keyboard.down("KeyA"); await sleep(4000); await page.keyboard.up("KeyA");
  await sleep(400);
  await ss(page, "tryout-F-position-left");

  // Reset zoom to 1× (press 0) then zoom out 5× for balanced gameplay view
  await page.keyboard.press("Digit0");
  await sleep(200);
  await ss(page, "tryout-F-centre");

  // ── 40 s play: fire J at t=10s and t=20s (SP auto-refills) ───────────────
  console.log("  ⚔️   Playing 40 s (tryout — no AI, SP refills every 10 s)…");
  const startFMs = Date.now();
  let turnF = 0;
  let spFiredAt10 = false;
  let spFiredAt20 = false;
  while (Date.now() - startFMs < 40_000) {
    const elapsed = Date.now() - startFMs;

    if (elapsed >= 10_000 && !spFiredAt10) {
      spFiredAt10 = true;
      console.log("    ⚡  t=10s: Firing special (J key)…");
      await pressKey(page, "KeyJ", 100);
      await sleep(300);
      await ss(page, "tryout-F-special-10s");
    } else if (elapsed >= 20_000 && !spFiredAt20) {
      spFiredAt20 = true;
      console.log("    ⚡  t=20s: Firing special (J key)…");
      await pressKey(page, "KeyJ", 100);
      await sleep(300);
      await ss(page, "tryout-F-special-20s");
    } else {
      const k = KEYS[turnF % KEYS.length];
      await pressKey(page, k, 300);
      await sleep(60);
      turnF++;
    }

    const elapsedNow = Date.now() - startFMs;
    if (Math.floor(elapsedNow / 10_000) > Math.floor((elapsedNow - 360) / 10_000)) {
      await ss(page, `tryout-F-playing-${Math.floor(elapsedNow / 1000)}s`);
      console.log(`    🕐  t=${Math.floor(elapsedNow/1000)}s`);
    }
  }
  await ss(page, "tryout-F-end");
  console.log("  ✅  Tryout 40 s play complete");

  // ══════════════════════════════════════════════════════════════════════════════
  // SECTION G — 2.5D renderer test (AI battle, tilt perspective)
  //
  // All seeded arenas now have rendererMode: "2.5d" so any battle will use the
  // 2.5D tilt-perspective renderer. Screenshots should show the isometric tilt.
  // ══════════════════════════════════════════════════════════════════════════════

  console.log("\n━━━  G. 2.5D tilt perspective renderer (desktop)  ━━━");

  await setViewport(page, VIEWPORTS.desktop);
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await ss(page, "2d5-G-setup");

  await startAiBattle(page);

  await sleep(1500);
  await ss(page, "2d5-G-loading");

  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      return c && c.getBoundingClientRect().width > 0;
    }, { timeout: 30_000 });
    console.log("  ✅  2.5D canvas visible");
  } catch { console.log("  ⚠️  canvas timeout"); }

  await ss(page, "2d5-G-canvas");

  await waitForLoadingGone(page, 500);
  await doLaunch(page, 9000);
  await ss(page, "2d5-G-launched");

  // Play 20 s — show tilt perspective with both beys and combos
  await battlePlayBlock(page, "2d5-G", 20_000);
  await ss(page, "2d5-G-end");
  console.log("  ✅  2.5D render test complete");

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

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
  try {
    await page.keyboard.down(key);
    await sleep(ms);
    await page.keyboard.up(key);
  } catch { /* page may have navigated away — ignore */ }
};

const KEYS = ["KeyD","KeyA","KeyW","KeyS","KeyD","KeyJ","KeyK","KeyA","KeyD"];

async function isPageAlive(page) {
  try {
    await page.evaluate(() => document.title);
    return true;
  } catch { return false; }
}

async function playLoop(page, label, durationMs) {
  console.log(`  ⚔️   Playing ${durationMs/1000}s…`);
  const startMs = Date.now();
  let turn = 0;
  while (Date.now() - startMs < durationMs) {
    if (!(await isPageAlive(page))) { console.log("  ⚠️  Page navigated away — ending play loop"); break; }
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
        { config: { roomType: "tryout", beybladeId: "", arenaId: "", is25D: true } },
        "",
        "/game/room"
      );
      window.dispatchEvent(new PopStateEvent("popstate", { state: { config: { roomType: "tryout", beybladeId: "", arenaId: "", is25D: true } } }));
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
  try {

  await setViewport(page, VIEWPORTS.portrait);
  // Navigate to /game/room with tryout state
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);

  // Navigate programmatically with state (simulate BattleModeCardsPage navigation)
  await page.evaluate(() => {
    const evt = new CustomEvent("__nav_game_room__", {
      detail: { config: { roomType: "tryout", beybladeId: "", arenaId: "", is25D: true } }
    });
    document.dispatchEvent(evt);
  });

  // Fallback: navigate via React Router link injection
  await page.evaluate((url) => {
    // Use history API — React Router will pick this up via its listener
    window.history.pushState(
      { usr: { config: { roomType: "tryout", beybladeId: "", arenaId: "", is25D: true } } },
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
  } catch (e) { console.log("  ⚠️  Section D error:", e.message); }

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
  try {

  await setViewport(page, VIEWPORTS.landscape);
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);

  await page.evaluate(() => {
    window.history.pushState(
      { usr: { config: { roomType: "tryout", beybladeId: "", arenaId: "", is25D: true } } },
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
  } catch (e) { console.log("  ⚠️  Section F error:", e.message); }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION G — Real 2-player Friends Room (create + join + play)
  // Two independent browser contexts share the same Colyseus server:
  //   ctx1 (main) = Player 1 host
  //   ctx2 (incognito) = Player 2 guest
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  G. 2-Player Friends Room (PvP)  ━━━");
  try {

  await setViewport(page, VIEWPORTS.portrait);

  // ── G-1: Player 1 — create friends room ──────────────────────────────────
  console.log("\n  [G-1] P1: navigating to /game/battle/lobby…");
  await page.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1200);
  await ss(page, "friends-G-p1-lobby-choose");

  // Click "Create Room" button
  const createRoomBtn = await page.$('button');
  // Find the button by text
  const createBtnHandle = await page.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /create room/i.test(b.textContent ?? "")) ?? null;
  });
  if (createBtnHandle.asElement()) {
    await createBtnHandle.asElement().click();
    console.log("  ✅  P1: Clicked 'Create Room'");
  } else {
    console.log("  ⚠️  P1: 'Create Room' button not found — trying keyboard");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
  }
  await sleep(2000);
  await ss(page, "friends-G-p1-connecting");

  // Wait for connection → in-lobby (where room code appears)
  let roomCode = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    roomCode = await page.evaluate(() => {
      // Room code shows in a <p> with font-mono class or data attribute
      const mono = [...document.querySelectorAll("p.font-mono, [class*=mono], [class*=room-code]")];
      for (const el of mono) {
        const t = el.textContent?.trim() ?? "";
        if (t.length >= 4 && /[A-Za-z0-9\-_]{4,}/.test(t)) return t;
      }
      // Fallback: scan all text for room ID patterns
      const all = [...document.querySelectorAll("p, span, h2, h3")];
      for (const el of all) {
        const t = el.textContent?.trim() ?? "";
        if (/^[A-Za-z0-9]{4,8}$/.test(t) || /^[A-Za-z]+-\d{4,}$/.test(t)) return t;
      }
      return null;
    });
    if (roomCode) break;
    await sleep(500);
  }

  if (roomCode) {
    console.log(`  ✅  P1: Room created! Code = "${roomCode}"`);
  } else {
    console.log("  ⚠️  P1: Room code not found in DOM — taking screenshot");
  }
  await ss(page, "friends-G-p1-in-lobby-with-code");

  // ── G-2: Player 2 — join with the room code ───────────────────────────────
  console.log("\n  [G-2] P2: opening incognito context…");
  const ctx2 = await browser.createBrowserContext();
  const p2 = await ctx2.newPage();
  const cdp2 = await p2.createCDPSession();
  await cdp2.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await p2.setViewport({ width: 390, height: 844, isMobile: true });

  p2.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/(websocket|net::err|firebase|webgl|econnrefused)/i.test(t))
        console.log("  [p2-error]", t.slice(0, 120));
    }
  });

  // P2 login
  await p2.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);
  await p2.type('input[type="email"]',    EMAIL,    { delay: 40 });
  await p2.type('input[type="password"]', PASSWORD, { delay: 40 });
  await p2.click('button[type="submit"]');
  try {
    await p2.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
    console.log("  ✅  P2: Logged in");
  } catch { console.log("  ⚠️  P2: Login navigation timeout"); }
  await sleep(1000);

  // Navigate to lobby
  await p2.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1200);

  // Take screenshot of P2's lobby choose screen
  const p2Shot = async (label) => {
    try {
      const vp = p2.viewport();
      const idx = String(++shotIndex).padStart(2, "0");
      const fp = path.join(SHOT_DIR, `${idx}-${label}-${vp?.width ?? 0}x${vp?.height ?? 0}.png`);
      await p2.screenshot({ path: fp, fullPage: false });
      console.log(`  📸  ${idx}-${label} [P2]`);
    } catch {}
  };

  await p2Shot("friends-G-p2-lobby-choose");

  // Click "Join with Code"
  const joinBtnHandle = await p2.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /join with code/i.test(b.textContent ?? "")) ?? null;
  });
  if (joinBtnHandle.asElement()) {
    await joinBtnHandle.asElement().click();
    console.log("  ✅  P2: Clicked 'Join with Code'");
  } else {
    console.log("  ⚠️  P2: 'Join with Code' button not found");
  }
  await sleep(800);
  await p2Shot("friends-G-p2-join-code-input");

  // Type the room code
  if (roomCode) {
    const codeInput = await p2.$('input[placeholder*="ode"], input[placeholder*="oom"]');
    if (codeInput) {
      await codeInput.type(roomCode, { delay: 60 });
      console.log(`  ✅  P2: Entered room code "${roomCode}"`);
      await p2Shot("friends-G-p2-code-entered");

      // Click "Join Room"
      const joinRoomBtn = await p2.evaluateHandle(() => {
        const btns = [...document.querySelectorAll("button")];
        return btns.find(b => /join room/i.test(b.textContent ?? "")) ?? null;
      });
      if (joinRoomBtn.asElement()) {
        await joinRoomBtn.asElement().click();
        console.log("  ✅  P2: Clicked 'Join Room'");
      }
    } else {
      console.log("  ⚠️  P2: Code input not found");
    }
  }
  await sleep(3000);
  await p2Shot("friends-G-p2-joining");

  // ── G-3: Both players in lobby ────────────────────────────────────────────
  console.log("\n  [G-3] Both players in lobby…");
  await sleep(2000);
  await ss(page, "friends-G-p1-lobby-2players");
  await p2Shot("friends-G-p2-lobby-joined");

  // ── G-4: Host (P1) starts the match ──────────────────────────────────────
  console.log("\n  [G-4] P1 (host) starting game…");
  const startBtn = await page.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /start early|start game|start/i.test(b.textContent ?? "")) ?? null;
  });
  if (startBtn.asElement()) {
    await startBtn.asElement().click();
    console.log("  ✅  P1: Clicked 'Start Early'");
  } else {
    console.log("  ⚠️  P1: Start button not found — will wait for auto-start");
  }
  await sleep(3000);
  await ss(page, "friends-G-p1-game-loading");
  await p2Shot("friends-G-p2-game-loading");

  // ── G-5: Wait for canvas + launch phase ──────────────────────────────────
  console.log("\n  [G-5] Waiting for game to load…");
  try { await page.waitForSelector("canvas", { timeout: 25_000 }); } catch {}
  try { await p2.waitForSelector("canvas", { timeout: 25_000 }); } catch {}
  await sleep(1500);
  await ss(page, "friends-G-p1-canvas");
  await p2Shot("friends-G-p2-canvas");

  await waitForLoadingGone(page, 500);
  await ss(page, "friends-G-p1-countdown");
  await p2Shot("friends-G-p2-countdown");

  // ── G-6: Launch both beyblades ────────────────────────────────────────────
  console.log("\n  [G-6] Launching beyblades…");
  // P1 hold Space
  await page.focus("body");
  await page.keyboard.down("Space");
  // P2 hold Space simultaneously
  await p2.focus("body");
  await p2.keyboard.down("Space");
  await sleep(500);
  await ss(page, "friends-G-p1-launch-charging");
  await p2Shot("friends-G-p2-launch-charging");
  await sleep(4000);
  // Release both
  await page.keyboard.up("Space");
  await p2.keyboard.up("Space");
  await sleep(1000);
  await ss(page, "friends-G-p1-launched");
  await p2Shot("friends-G-p2-launched");

  // ── G-7: Gameplay loop — both players move ────────────────────────────────
  console.log("\n  [G-7] Gameplay (20s)…");
  const P1_KEYS = ["KeyD", "KeyA", "KeyW", "KeyS", "KeyJ", "KeyD", "KeyK"];
  const P2_KEYS = ["KeyA", "KeyD", "KeyS", "KeyW", "KeyK", "KeyA", "KeyJ"];
  const gameStart = Date.now();
  let gTick = 0;
  while (Date.now() - gameStart < 20_000) {
    const elapsed = Date.now() - gameStart;
    const k1 = P1_KEYS[gTick % P1_KEYS.length];
    const k2 = P2_KEYS[gTick % P2_KEYS.length];
    await Promise.all([
      pressKey(page, k1, 200),
      pressKey(p2, k2, 200),
    ]);
    await sleep(80);
    gTick++;
    // Screenshot every 7s
    if (gTick === 20) { await ss(page, "friends-G-p1-playing-7s"); await p2Shot("friends-G-p2-playing-7s"); }
    if (gTick === 40) { await ss(page, "friends-G-p1-playing-14s"); await p2Shot("friends-G-p2-playing-14s"); }
  }

  // ── G-8: Post-match results ───────────────────────────────────────────────
  console.log("\n  [G-8] Post-match results…");
  await sleep(3000);
  await ss(page, "friends-G-p1-result");
  await p2Shot("friends-G-p2-result");

  const p1Result = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h1,h2,h3"))
      .map(el => el.textContent?.trim()).filter(Boolean).slice(0, 3).join(" | ");
  }).catch(() => "");
  if (p1Result) console.log("  🏆  P1 result text:", p1Result);

  // Close incognito context
  try { await p2.close(); await ctx2.close(); console.log("  ✅  P2 context closed"); } catch {}
  } catch (e) { console.log("  ⚠️  Section G error:", e.message); }

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

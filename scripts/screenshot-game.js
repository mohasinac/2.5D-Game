/**
 * screenshot-game.js
 * Visual screenshot test for the Beyblade game — new UI flow.
 *
 * Captures:
 *   A  Login → Landing Page → Game Select → Battle Cards → Story Cards  (3 viewports)
 *   B  Battle Cards — card carousel navigation (portrait)
 *   C  GameRoomPage: Tryout via injected state (portrait)
 *   D  GameRoomPage: Tryout full run — loading → launch → 30s gameplay (portrait)
 *   E  Admin: Dashboard (errors card) + Settings (2.5D toggle)
 *   F  GameRoomPage GBA shell (landscape)
 *   G  Real 2-player Friends Room (PvP create room → P2 joins via code → 1v1 battle)
 *   H  PvAI 1P — Medium, Hard, Hell difficulties (portrait + desktop)
 *   I  2-player AI battle: both players vs AI bot (portrait)
 *   J  Random Match 2P (both click Find Match → auto-matched → 1v1 battle)
 *
 * Run: node scripts/screenshot-game.js
 * Output: test-results/screenshots/
 */
const puppeteer = require("puppeteer");
const path = require("path");
const fs   = require("fs");

const BASE_URL    = process.env.GAME_URL       || "http://localhost:3002";
const EMAIL       = process.env.TEST_EMAIL     || "testadmin@letitrip.in";
const PASSWORD    = process.env.TEST_PASSWORD  || "TestAdmin1234!";
// P2 credentials — used in G (Friends Room) and J (Random Match)
// Falls back to P1 credentials if not set (both tabs share the same account)
const P2_EMAIL    = process.env.TEST2_EMAIL    || process.env.TEST_EMAIL    || EMAIL;
const P2_PASSWORD = process.env.TEST2_PASSWORD || process.env.TEST_PASSWORD || PASSWORD;
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
    // If already logged in (auth guard redirected away from /login), nothing to do
    const url = page.url();
    if (!url.includes("/login")) { console.log("  ✅  Already logged in"); return; }

    // Wait for email input — if redirect happens mid-wait, catch gracefully
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 8_000 });
    } catch {
      // Auth guard may have redirected before input appeared
      if (!page.url().includes("/login")) { console.log("  ✅  Redirected away from login (already authed)"); return; }
      console.log("  ⚠️  Login form not found"); return;
    }

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
  // SERVER HEALTH CHECK — used by both G (Friends Room) and J (Random Match)
  // ══════════════════════════════════════════════════════════════════════════
  const COLYSEUS_URL = process.env.COLYSEUS_URL || "http://localhost:2567";
  let colyseusOnline = false;
  try {
    const http = require("http");
    await new Promise((resolve) => {
      const req = http.get(`${COLYSEUS_URL}/matchmake/`, (res) => {
        colyseusOnline = (res.statusCode >= 200 && res.statusCode < 500);
        resolve();
      });
      req.on("error", () => resolve());
      req.setTimeout(4000, () => { req.destroy(); resolve(); });
    });
  } catch {}
  console.log(`\n  🔌  Colyseus server: ${colyseusOnline ? "✅ ONLINE" : "❌ OFFLINE — skipping 2P online sections"}`);

  // Helper: wait for React Router to navigate to /game/room
  async function waitForGameRoom(pg, label, maxMs = 35_000) {
    const deadline = Date.now() + maxMs;
    while (Date.now() < deadline) {
      const url = pg.url();
      if (url.includes("/game/room")) { console.log(`  ✅  ${label}: navigated to /game/room`); return true; }
      await sleep(800);
    }
    console.log(`  ⚠️  ${label}: /game/room navigation timeout after ${maxMs/1000}s (still on ${pg.url()})`);
    return false;
  }

  // Helper: wait until page is in in-lobby phase (Leave Room / Start buttons visible)
  async function waitForInLobby(pg, label, timeoutMs = 30_000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const inLobby = await pg.evaluate(() => {
        const btns = [...document.querySelectorAll("button")];
        return btns.some(b => /leave room|start early|start game/i.test(b.textContent ?? ""));
      }).catch(() => false);
      if (inLobby) { console.log(`  ✅  ${label}: in-lobby phase reached`); return true; }
      await sleep(600);
    }
    console.log(`  ⚠️  ${label}: in-lobby timeout after ${timeoutMs/1000}s`);
    return false;
  }

  // Helper: extract room code from in-lobby phase (font-mono room ID)
  async function extractRoomCode(pg) {
    return pg.evaluate(() => {
      // Primary: look for the Room Code label then the adjacent font-mono value
      const labels = [...document.querySelectorAll("p")];
      for (const lbl of labels) {
        if (/room code/i.test(lbl.textContent ?? "")) {
          const next = lbl.nextElementSibling;
          if (next) { const t = next.textContent?.trim(); if (t && t.length >= 4) return t; }
          // Check parent's children
          const siblings = [...(lbl.parentElement?.children ?? [])];
          for (const s of siblings) {
            if (s !== lbl) { const t = s.textContent?.trim(); if (t && t.length >= 4 && /^[A-Za-z0-9]+$/.test(t)) return t; }
          }
        }
      }
      // Fallback: any font-mono element with 4–12 alphanumeric chars
      const monos = [...document.querySelectorAll("[class*='mono'], [class*='room']")];
      for (const el of monos) {
        const t = el.textContent?.trim() ?? "";
        if (t.length >= 4 && t.length <= 20 && /^[A-Za-z0-9]+$/.test(t)) return t;
      }
      // Last resort: scan all visible text for Colyseus room ID patterns
      const all = [...document.querySelectorAll("p, span, h2, h3, code")];
      for (const el of all) {
        const t = el.textContent?.trim() ?? "";
        if (/^[A-Za-z0-9]{6,12}$/.test(t) || /^[A-Za-z]+-\d{4,}$/.test(t)) return t;
      }
      return null;
    }).catch(() => null);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION G — Real 2-player Friends Room (create + join + play)
  // Two independent browser contexts share the same Colyseus server:
  //   ctx1 (main) = Player 1 host
  //   ctx2 (incognito) = Player 2 guest
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  G. 2-Player Friends Room (PvP)  ━━━");
  try {

  await setViewport(page, VIEWPORTS.portrait);

  if (!colyseusOnline) {
    // Show server-offline state clearly in screenshots
    await page.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(2000);
    await ss(page, "friends-G-server-offline-lobby");
    const createBtnH = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /create room/i.test(b.textContent ?? "")) ?? null;
    });
    if (createBtnH.asElement()) { await createBtnH.asElement().click(); await sleep(4000); }
    await ss(page, "friends-G-server-offline-connecting");
    console.log("  ℹ️  Section G skipped: Colyseus server offline");
    console.log("  ℹ️  To run section G: start the server with 'npm run dev:server' then re-run this script");
    throw new Error("Colyseus offline");
  }

  // ── G-1: Player 1 — create friends room ──────────────────────────────────
  console.log("\n  [G-1] P1: navigating to /game/battle/lobby…");
  await page.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1200);
  await ss(page, "friends-G-p1-lobby-choose");

  // Click "Create Room" button
  const createBtnHandle = await page.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /create room/i.test(b.textContent ?? "")) ?? null;
  });
  if (createBtnHandle.asElement()) {
    await createBtnHandle.asElement().click();
    console.log("  ✅  P1: Clicked 'Create Room'");
  } else {
    console.log("  ⚠️  P1: 'Create Room' button not found");
  }
  await sleep(1500);
  await ss(page, "friends-G-p1-connecting");

  // Wait up to 30s for in-lobby phase (Colyseus room created + connection established)
  const p1InLobby = await waitForInLobby(page, "P1", 30_000);
  if (!p1InLobby) {
    await ss(page, "friends-G-p1-lobby-timeout");
    throw new Error("P1 never reached in-lobby phase");
  }

  // Extract room code from the in-lobby UI
  let roomCode = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    roomCode = await extractRoomCode(page);
    if (roomCode) break;
    await sleep(800);
  }

  if (roomCode) {
    console.log(`  ✅  P1: Room created! Code = "${roomCode}"`);
  } else {
    console.log("  ⚠️  P1: Room code not found in DOM (room may still be valid)");
    // Try to get it from the Colyseus room object via JS context
    roomCode = await page.evaluate(() => {
      // Colyseus client stores room on window via useColyseus hook (dev builds may expose it)
      return window.__COLYSEUS_ROOM_ID__ ?? null;
    }).catch(() => null);
    if (roomCode) console.log(`  ✅  P1: Got room code via window property: "${roomCode}"`);
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
  const P2_EMAIL = process.env.TEST2_EMAIL || process.env.TEST_EMAIL || EMAIL;
  const P2_PASSWORD = process.env.TEST2_PASSWORD || process.env.TEST_PASSWORD || PASSWORD;
  await p2.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(800);
  await p2.type('input[type="email"]',    P2_EMAIL,    { delay: 40 });
  await p2.type('input[type="password"]', P2_PASSWORD, { delay: 40 });
  await p2.click('button[type="submit"]');
  try {
    await p2.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
    console.log("  ✅  P2: Logged in");
  } catch { console.log("  ⚠️  P2: Login navigation timeout"); }
  await sleep(1000);

  // Navigate to lobby
  await p2.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1200);

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

  // P2 clicks "Join with Code"
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

  // Type the room code into the input field
  if (roomCode) {
    try {
      await p2.waitForSelector('input[placeholder*="ode"], input[placeholder*="oom"], input[type="text"]', { timeout: 6_000 });
      const codeInput = await p2.$('input[placeholder*="ode"], input[placeholder*="oom"], input[type="text"]');
      if (codeInput) {
        await codeInput.click({ clickCount: 3 }); // select all first
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
    } catch { console.log("  ⚠️  P2: Could not fill room code input"); }
  } else {
    console.log("  ⚠️  P2: No room code available — cannot join");
    throw new Error("No room code to share with P2");
  }

  await p2Shot("friends-G-p2-joining");

  // Wait for P2 to reach in-lobby phase
  const p2InLobby = await waitForInLobby(p2, "P2", 20_000);
  if (!p2InLobby) await p2Shot("friends-G-p2-lobby-timeout");

  // ── G-3: Both players in lobby ────────────────────────────────────────────
  console.log("\n  [G-3] Both players in lobby…");
  await sleep(1000);
  // Wait for P1 to see 2 players
  for (let t = 0; t < 10; t++) {
    const hasTwo = await page.evaluate(() => {
      const txt = document.body.innerText;
      return txt.includes("2/") || txt.includes("(2)") || (txt.match(/✓/g) ?? []).length >= 2;
    });
    if (hasTwo) break;
    await sleep(1000);
  }
  await ss(page, "friends-G-p1-lobby-2players");
  await p2Shot("friends-G-p2-lobby-joined");

  // ── G-4: Host (P1) starts the match ──────────────────────────────────────
  console.log("\n  [G-4] P1 (host) starting game…");

  // Wait a moment for player list to settle, then find the Start Early button.
  // The button text is "Start Early ▶  (N players)" when canStart is true.
  let startClicked = false;
  for (let attempt = 0; attempt < 6; attempt++) {
    const startBtn = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button:not(:disabled)")];
      return btns.find(b => /start early/i.test(b.textContent ?? "")) ?? null;
    });
    if (startBtn.asElement()) {
      await startBtn.asElement().click();
      console.log("  ✅  P1: Clicked 'Start Early'");
      startClicked = true;
      break;
    }
    await sleep(1500);
  }
  if (!startClicked) {
    console.log("  ⚠️  P1: Start Early button never became enabled — both players may share the same account");
    console.log("  ℹ️  Set TEST2_EMAIL + TEST2_PASSWORD env vars for a true 2-account 2P test");
    // Try clicking any button that has 'start' in it regardless of disabled state
    const anyStartBtn = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /start early/i.test(b.textContent ?? "")) ?? null;
    });
    if (anyStartBtn.asElement()) {
      await anyStartBtn.asElement().click({ force: true }).catch(() => {});
      console.log("  ✅  P1: Force-clicked Start Early (may have been disabled)");
    }
  }
  await sleep(2000);
  await ss(page, "friends-G-p1-game-loading");
  await p2Shot("friends-G-p2-game-loading");

  // ── G-5: Wait for page to navigate to /game/room, then wait for canvas ───
  console.log("\n  [G-5] Waiting for game room navigation + canvas…");

  const [p1OnRoom, p2OnRoom] = await Promise.all([
    waitForGameRoom(page, "P1"),
    waitForGameRoom(p2, "P2"),
  ]);

  await ss(page, "friends-G-p1-game-loading");
  await p2Shot("friends-G-p2-game-loading");

  // Wait for canvas to appear in the game room
  if (p1OnRoom) {
    try { await page.waitForSelector("canvas", { timeout: 25_000 }); console.log("  ✅  P1 canvas visible"); }
    catch { console.log("  ⚠️  P1 canvas timeout"); }
  }
  if (p2OnRoom) {
    try { await p2.waitForSelector("canvas", { timeout: 25_000 }); console.log("  ✅  P2 canvas visible"); }
    catch { console.log("  ⚠️  P2 canvas timeout"); }
  }
  await sleep(1500);
  await ss(page, "friends-G-p1-canvas");
  await p2Shot("friends-G-p2-canvas");

  // Log canvas dimensions
  for (const [pg, label] of [[page, "P1"], [p2, "P2"]]) {
    const box = await pg.evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    }).catch(() => null);
    console.log(`  📊  ${label} canvas size: ${box ? `${box.w}×${box.h}` : "not found"}`);
  }

  // Wait through loading overlay
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
  // SECTION H — PvAI 1P: Medium, Hard, Hell difficulties
  // Each difficulty gets portrait + desktop screenshots.
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  H. PvAI 1P — Medium / Hard / Hell  ━━━");
  try {

  const difficulties = ["medium", "hard", "hell"];

  for (const diff of difficulties) {
    console.log(`\n  ▸ PvAI ${diff}`);

    // ── Portrait ──────────────────────────────────────────────────────────
    await setViewport(page, VIEWPORTS.portrait);
    await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1200);
    await ss(page, `pvai-H-${diff}-battle-cards-portrait`);

    // Navigate to PvAI mode via card
    const pvaiCardHandle = await page.evaluateHandle(() => {
      const cards = [...document.querySelectorAll("button, [class*='card'], [role='button']")];
      return cards.find(c => /pvai|vs\s?ai|ai\s?battle/i.test(c.textContent ?? "")) ?? null;
    });
    if (pvaiCardHandle.asElement()) {
      await pvaiCardHandle.asElement().click();
      console.log(`  ✅  Clicked PvAI card`);
      await sleep(600);
    }

    // Select difficulty if buttons visible
    const diffHandle = await page.evaluateHandle((d) => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => b.textContent?.trim().toLowerCase() === d) ?? null;
    }, diff);
    if (diffHandle.asElement()) {
      await diffHandle.asElement().click();
      console.log(`  ✅  Selected ${diff}`);
      await sleep(300);
    }

    await ss(page, `pvai-H-${diff}-setup-portrait`);

    // Click Start
    const startHandle = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /start|play|launch/i.test(b.textContent ?? "")) ?? null;
    });
    if (startHandle.asElement()) {
      await startHandle.asElement().click();
      await sleep(800);
    }

    // Inject state fallback
    if (!page.url().includes("/game/room")) {
      await page.evaluate((d) => {
        window.history.pushState(
          { usr: { config: { roomType: "pvai", beybladeId: "", arenaId: "", is25D: true, aiDifficulty: d } } },
          "",
          "/game/room"
        );
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, diff);
      await sleep(1200);
    }

    await ss(page, `pvai-H-${diff}-loading`);

    try { await page.waitForSelector("canvas", { timeout: 20_000 }); }
    catch { console.log(`  ⚠️  canvas timeout (${diff})`); }

    await ss(page, `pvai-H-${diff}-canvas`);

    await waitForLoadingGone(page, 500);
    await ss(page, `pvai-H-${diff}-countdown`);

    // Launch
    await doLaunch(page, 6000);
    await ss(page, `pvai-H-${diff}-launched`);

    // Canvas pixel analysis
    const pixelAnalysis = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return { found: false, width: 0, height: 0, nonBlack: null };
      try {
        const ctx = c.getContext("2d");
        if (!ctx) return { found: true, width: c.width, height: c.height, nonBlack: null };
        const W = c.width, H = c.height;
        const GRID = 15;
        const stepX = Math.max(1, Math.floor(W / GRID));
        const stepY = Math.max(1, Math.floor(H / GRID));
        let nonBlack = 0, total = 0;
        for (let x = 0; x < W; x += stepX) {
          for (let y = 0; y < H; y += stepY) {
            const d = ctx.getImageData(x, y, 1, 1).data;
            total++;
            if (d[0] > 10 || d[1] > 10 || d[2] > 10) nonBlack++;
          }
        }
        return { found: true, width: W, height: H, nonBlack: total > 0 ? nonBlack / total : 0 };
      } catch { return { found: true, width: c.width, height: c.height, nonBlack: null }; }
    }).catch(() => ({ found: false, width: 0, height: 0, nonBlack: null }));

    const nonBlackPct = pixelAnalysis.nonBlack !== null ? `${(pixelAnalysis.nonBlack * 100).toFixed(1)}% non-black` : "WebGL";
    console.log(`  📊  Canvas: ${pixelAnalysis.width}×${pixelAnalysis.height} | ${nonBlackPct}`);

    // 15s gameplay
    await playLoop(page, `pvai-H-${diff}`, 15_000);
    await ss(page, `pvai-H-${diff}-15s-end`);

    // ── Desktop same difficulty ───────────────────────────────────────────
    await setViewport(page, VIEWPORTS.desktop);
    await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1000);

    const pvaiCardD = await page.evaluateHandle(() => {
      const cards = [...document.querySelectorAll("button, [class*='card']")];
      return cards.find(c => /pvai|vs\s?ai/i.test(c.textContent ?? "")) ?? null;
    });
    if (pvaiCardD.asElement()) { await pvaiCardD.asElement().click(); await sleep(500); }

    const diffHandleD = await page.evaluateHandle((d) => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => b.textContent?.trim().toLowerCase() === d) ?? null;
    }, diff);
    if (diffHandleD.asElement()) { await diffHandleD.asElement().click(); await sleep(300); }

    const startD = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /start|play|launch/i.test(b.textContent ?? "")) ?? null;
    });
    if (startD.asElement()) { await startD.asElement().click(); await sleep(800); }

    if (!page.url().includes("/game/room")) {
      await page.evaluate((d) => {
        window.history.pushState(
          { usr: { config: { roomType: "pvai", beybladeId: "", arenaId: "", is25D: true, aiDifficulty: d } } },
          "",
          "/game/room"
        );
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, diff);
      await sleep(1200);
    }

    try { await page.waitForSelector("canvas", { timeout: 20_000 }); } catch {}
    await waitForLoadingGone(page, 500);
    await doLaunch(page, 6000);
    await ss(page, `pvai-H-${diff}-desktop-launched`);
    await playLoop(page, `pvai-H-${diff}-desktop`, 10_000);
    await ss(page, `pvai-H-${diff}-desktop-10s`);
  }

  } catch (e) { console.log("  ⚠️  Section H error:", e.message); }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION I — 2-player AI battle: P1 vs AI, P2 vs AI in separate rooms
  // Uses two browser contexts simulating two simultaneous players.
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  I. 2-player AI battle (two contexts)  ━━━");
  try {

  await setViewport(page, VIEWPORTS.portrait);

  // ── I-1: P1 starts PvAI ──────────────────────────────────────────────────
  console.log("\n  [I-1] P1: starting PvAI (medium)…");
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1000);

  await page.evaluate(() => {
    window.history.pushState(
      { usr: { config: { roomType: "pvai", beybladeId: "", arenaId: "", is25D: true, aiDifficulty: "medium" } } },
      "",
      "/game/room"
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await sleep(1500);

  try { await page.waitForSelector("canvas", { timeout: 20_000 }); } catch {}
  await ss(page, "2pai-I-p1-canvas");
  await waitForLoadingGone(page, 500);
  await ss(page, "2pai-I-p1-countdown");

  // ── I-2: P2 in separate context ───────────────────────────────────────────
  console.log("\n  [I-2] P2: opening second browser context…");
  const ctxI2 = await browser.createBrowserContext();
  const pI2   = await ctxI2.newPage();
  const cdpI2 = await pI2.createCDPSession();
  await cdpI2.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await pI2.setViewport({ width: 390, height: 844, isMobile: true });

  pI2.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/(websocket|net::err|firebase|webgl|econnrefused)/i.test(t))
        console.log("  [p2-error]", t.slice(0, 120));
    }
  });

  // P2 login
  await pI2.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(600);
  try {
    await pI2.type('input[type="email"]',    EMAIL,    { delay: 40 });
    await pI2.type('input[type="password"]', PASSWORD, { delay: 40 });
    await pI2.click('button[type="submit"]');
    await pI2.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
    console.log("  ✅  P2: Logged in");
  } catch { console.log("  ⚠️  P2: login timeout"); }
  await sleep(800);

  // P2 start PvAI (hard)
  await pI2.evaluate(() => {
    window.history.pushState(
      { usr: { config: { roomType: "pvai", beybladeId: "", arenaId: "", is25D: true, aiDifficulty: "hard" } } },
      "",
      "/game/room"
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await sleep(1500);

  const p2shot = async (label) => {
    try {
      const vp = pI2.viewport();
      const idx = String(++shotIndex).padStart(2, "0");
      const fp = path.join(SHOT_DIR, `${idx}-${label}-${vp?.width ?? 0}x${vp?.height ?? 0}.png`);
      await pI2.screenshot({ path: fp, fullPage: false });
      console.log(`  📸  ${idx}-${label} [P2]`);
    } catch {}
  };

  try { await pI2.waitForSelector("canvas", { timeout: 20_000 }); } catch {}
  await p2shot("2pai-I-p2-canvas");

  // ── I-3: Launch both simultaneously ──────────────────────────────────────
  console.log("\n  [I-3] Launching both beyblades simultaneously…");
  await waitForLoadingGone(page, 200);
  await waitForLoadingGone(pI2, 200);

  await page.focus("body");
  await pI2.focus("body");
  await page.keyboard.down("Space");
  await pI2.keyboard.down("Space");
  await sleep(500);
  await ss(page, "2pai-I-p1-launch-charging");
  await p2shot("2pai-I-p2-launch-charging");
  await sleep(5000);
  await page.keyboard.up("Space");
  await pI2.keyboard.up("Space");
  await sleep(1000);

  await ss(page, "2pai-I-p1-launched");
  await p2shot("2pai-I-p2-launched");

  // ── I-4: Both play for 20s ────────────────────────────────────────────────
  console.log("\n  [I-4] Both playing for 20s…");
  const P1K = ["KeyD","KeyA","KeyW","KeyS","KeyJ","KeyD","KeyK"];
  const P2K = ["KeyA","KeyD","KeyS","KeyW","KeyK","KeyA","KeyJ"];
  const iStart = Date.now();
  let iTick = 0;
  while (Date.now() - iStart < 20_000) {
    const k1 = P1K[iTick % P1K.length];
    const k2 = P2K[iTick % P2K.length];
    await Promise.all([
      page.keyboard.down(k1).then(() => sleep(150)).then(() => page.keyboard.up(k1)),
      pI2.keyboard.down(k2).then(() => sleep(150)).then(() => pI2.keyboard.up(k2)),
    ]).catch(() => {});
    await sleep(60);
    iTick++;
    if (iTick === 25) { await ss(page, "2pai-I-p1-playing-7s"); await p2shot("2pai-I-p2-playing-7s"); }
    if (iTick === 50) { await ss(page, "2pai-I-p1-playing-14s"); await p2shot("2pai-I-p2-playing-14s"); }
  }

  await ss(page, "2pai-I-p1-playing-20s");
  await p2shot("2pai-I-p2-playing-20s");

  // Canvas analysis for both
  const analyzePageCanvas = async (pg, label) => {
    const r = await pg.evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return null;
      return { w: c.width, h: c.height };
    }).catch(() => null);
    console.log(`  📊  ${label} canvas: ${r ? `${r.w}×${r.h}` : "not found"}`);
  };
  await analyzePageCanvas(page, "P1");
  await analyzePageCanvas(pI2, "P2");

  // ── I-5: Post-match results ───────────────────────────────────────────────
  await sleep(3000);
  await ss(page, "2pai-I-p1-result");
  await p2shot("2pai-I-p2-result");

  for (const [pg, label] of [[page, "P1"], [pI2, "P2"]]) {
    const resultText = await pg.evaluate(() => {
      return Array.from(document.querySelectorAll("h1,h2,h3,[class*=winner],[class*=victory]"))
        .map(el => el.textContent?.trim()).filter(Boolean).slice(0, 3).join(" | ");
    }).catch(() => "");
    if (resultText) console.log(`  🏆  ${label} result: ${resultText}`);
  }

  try { await pI2.close(); await ctxI2.close(); console.log("  ✅  P2 context closed"); } catch {}

  } catch (e) { console.log("  ⚠️  Section I error:", e.message); }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION J — Random Match 2P (P1 + P2 click "Find Match" and get auto-matched)
  // Both players use the same size + bestOf preferences so Colyseus matches them.
  // ══════════════════════════════════════════════════════════════════════════
  console.log("\n━━━  J. Random Match 2P (auto-matchmaking)  ━━━");
  try {

  if (!colyseusOnline) {
    // Show server-offline state: capture the "Find Match" flow up to the spinner
    await setViewport(page, VIEWPORTS.portrait);
    await page.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1500);
    await ss(page, "random-J-phase1-choose");
    // Click Find Match
    const fmBtn = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
    });
    if (fmBtn.asElement()) {
      await fmBtn.asElement().click();
      await sleep(1000);
    }
    await ss(page, "random-J-random-prefs");
    // Click Find Match → to trigger connecting
    const fmBtn2 = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button")];
      return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
    });
    if (fmBtn2.asElement()) {
      await fmBtn2.asElement().click();
      await sleep(4000);
    }
    await ss(page, "random-J-searching-server-offline");
    console.log("  ℹ️  Section J (full 2P match) skipped: Colyseus server offline");
    console.log("  ℹ️  Screenshots show the UI flow up to the 'Searching for opponent…' state");
    throw new Error("Colyseus offline");
  }

  // ── J-1: P1 enters Random Match flow ─────────────────────────────────────
  console.log("\n  [J-1] P1: navigating to lobby → Random Match…");
  await setViewport(page, VIEWPORTS.portrait);
  await page.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1500);
  await ss(page, "random-J-p1-phase1");

  // Click "Find Match"
  const p1FindMatch = await page.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
  });
  if (p1FindMatch.asElement()) { await p1FindMatch.asElement().click(); await sleep(800); }
  await ss(page, "random-J-p1-prefs");

  // Keep default BO1 / 1v1 and click "Find Match →"
  const p1FindMatch2 = await page.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
  });
  if (p1FindMatch2.asElement()) { await p1FindMatch2.asElement().click(); await sleep(500); }
  await ss(page, "random-J-p1-searching");
  console.log("  ✅  P1: Searching for opponent…");

  // ── J-2: P2 joins the matchmaking pool ───────────────────────────────────
  console.log("\n  [J-2] P2: opening second context, clicking Find Match…");
  const ctxJ2 = await browser.createBrowserContext();
  const pJ2 = await ctxJ2.newPage();
  const cdpJ2 = await pJ2.createCDPSession();
  await cdpJ2.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await pJ2.setViewport({ width: 390, height: 844, isMobile: true });

  pJ2.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      if (!/(websocket|net::err|firebase|webgl|econnrefused)/i.test(t))
        console.log("  [p2J-error]", t.slice(0, 100));
    }
  });

  // P2 login
  await pJ2.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(600);
  await pJ2.type('input[type="email"]',    P2_EMAIL,    { delay: 40 });
  await pJ2.type('input[type="password"]', P2_PASSWORD, { delay: 40 });
  await pJ2.click('button[type="submit"]');
  try { await pJ2.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 }); console.log("  ✅  P2J: Logged in"); }
  catch { console.log("  ⚠️  P2J: login timeout"); }
  await sleep(800);

  const jShot = async (label) => {
    try {
      const vp = pJ2.viewport();
      const idx = String(++shotIndex).padStart(2, "0");
      const fp = path.join(SHOT_DIR, `${idx}-${label}-${vp?.width ?? 0}x${vp?.height ?? 0}.png`);
      await pJ2.screenshot({ path: fp, fullPage: false });
      console.log(`  📸  ${idx}-${label} [P2-random]`);
    } catch {}
  };

  await pJ2.goto(`${BASE_URL}/game/battle/lobby`, { waitUntil: "domcontentloaded", timeout: 20_000 });
  await sleep(1200);
  await jShot("random-J-p2-phase1");

  // P2 clicks Find Match
  const p2FindMatch = await pJ2.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
  });
  if (p2FindMatch.asElement()) { await p2FindMatch.asElement().click(); await sleep(800); }
  await jShot("random-J-p2-prefs");

  const p2FindMatch2 = await pJ2.evaluateHandle(() => {
    const btns = [...document.querySelectorAll("button")];
    return btns.find(b => /find match/i.test(b.textContent ?? "")) ?? null;
  });
  if (p2FindMatch2.asElement()) { await p2FindMatch2.asElement().click(); await sleep(500); }
  await jShot("random-J-p2-searching");
  console.log("  ✅  P2: Searching for opponent…");

  // ── J-3: Wait for both to reach in-lobby (auto-matched) ──────────────────
  console.log("\n  [J-3] Waiting for auto-match…");
  const [j1Lobby, j2Lobby] = await Promise.all([
    waitForInLobby(page, "P1-random", 30_000),
    waitForInLobby(pJ2, "P2-random", 30_000),
  ]);
  await ss(page, "random-J-p1-in-lobby");
  await jShot("random-J-p2-in-lobby");

  if (!j1Lobby || !j2Lobby) {
    console.log("  ⚠️  Not both matched — canvas screenshot may not be available");
    throw new Error("Random match auto-match failed");
  }

  // ── J-4: Game loading → canvas ────────────────────────────────────────────
  console.log("\n  [J-4] Waiting for game to start (auto-start or P1 starts early)…");
  // Try clicking Start Early (enabled only when playerList.length >= 2 && isHost)
  let jStartClicked = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    const p1StartJ = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll("button:not(:disabled)")];
      return btns.find(b => /start early/i.test(b.textContent ?? "")) ?? null;
    });
    if (p1StartJ.asElement()) {
      await p1StartJ.asElement().click();
      console.log("  ✅  P1: Clicked Start Early (random match)");
      jStartClicked = true;
      break;
    }
    await sleep(1500);
  }
  if (!jStartClicked) {
    console.log("  ⚠️  P1: Start Early not enabled — checking for auto-navigation to /game/room…");
  }
  await sleep(2000);

  // Wait for React Router navigation to /game/room
  const [jP1OnRoom, jP2OnRoom] = await Promise.all([
    waitForGameRoom(page, "P1-random"),
    waitForGameRoom(pJ2, "P2-random"),
  ]);

  await ss(page, "random-J-p1-game-loading");
  await jShot("random-J-p2-game-loading");

  if (jP1OnRoom) {
    try { await page.waitForSelector("canvas", { timeout: 25_000 }); console.log("  ✅  P1 canvas visible"); }
    catch { console.log("  ⚠️  P1 canvas timeout"); }
  }
  if (jP2OnRoom) {
    try { await pJ2.waitForSelector("canvas", { timeout: 25_000 }); console.log("  ✅  P2 canvas visible"); }
    catch { console.log("  ⚠️  P2 canvas timeout"); }
  }
  await sleep(1500);
  await ss(page, "random-J-p1-canvas");
  await jShot("random-J-p2-canvas");

  await waitForLoadingGone(page, 500);
  await ss(page, "random-J-p1-countdown");
  await jShot("random-J-p2-countdown");

  // ── J-5: Launch both ──────────────────────────────────────────────────────
  console.log("\n  [J-5] Launching beyblades (random match)…");
  try {
    await page.focus("body");
    await pJ2.focus("body");
    await page.keyboard.down("Space");
    await pJ2.keyboard.down("Space");
    await sleep(500);
    await ss(page, "random-J-p1-launch-charging");
    await jShot("random-J-p2-launch-charging");
    await sleep(4500);
    await page.keyboard.up("Space");
    await pJ2.keyboard.up("Space");
    await sleep(800);
    await ss(page, "random-J-p1-launched");
    await jShot("random-J-p2-launched");
  } catch (launchErr) {
    console.log("  ⚠️  Launch error (page may have navigated):", launchErr.message);
  }

  // ── J-6: Gameplay 20s ────────────────────────────────────────────────────
  console.log("\n  [J-6] Gameplay (20s, random match)…");
  const P1KJ = ["KeyD","KeyA","KeyW","KeyS","KeyJ","KeyD","KeyK"];
  const P2KJ = ["KeyA","KeyD","KeyS","KeyW","KeyK","KeyA","KeyJ"];
  const jStart = Date.now();
  let jTick = 0;
  while (Date.now() - jStart < 20_000) {
    const k1 = P1KJ[jTick % P1KJ.length];
    const k2 = P2KJ[jTick % P2KJ.length];
    await Promise.all([
      pressKey(page, k1, 200).catch(() => {}),
      pressKey(pJ2, k2, 200).catch(() => {}),
    ]);
    await sleep(80);
    jTick++;
    if (jTick === 20) {
      await ss(page, "random-J-p1-playing-7s").catch(() => {});
      await jShot("random-J-p2-playing-7s").catch(() => {});
    }
    if (jTick === 40) {
      await ss(page, "random-J-p1-playing-14s").catch(() => {});
      await jShot("random-J-p2-playing-14s").catch(() => {});
    }
  }
  await ss(page, "random-J-p1-playing-20s").catch(() => {});
  await jShot("random-J-p2-playing-20s").catch(() => {});

  // ── J-7: Post-match ───────────────────────────────────────────────────────
  await sleep(3000);
  await ss(page, "random-J-p1-result");
  await jShot("random-J-p2-result");
  console.log("  ✅  Section J complete");

  try { await pJ2.close(); await ctxJ2.close(); } catch {}
  } catch (e) { console.log("  ⚠️  Section J error:", e.message); }

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

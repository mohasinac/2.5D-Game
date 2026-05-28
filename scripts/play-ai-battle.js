/**
 * play-ai-battle.js
 * Puppeteer script that logs in as admin and plays one AI battle
 * using both keyboard input and simulated touch controls.
 * Run: node scripts/play-ai-battle.js
 */
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = process.env.GAME_URL || "https://game.letitrip.in";
const EMAIL    = process.env.TEST_EMAIL    || "testadmin@letitrip.in";
const PASSWORD = process.env.TEST_PASSWORD || "TestAdmin1234!";
const SHOT_DIR = path.resolve("test-results/screenshots");

fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ss(page, label) {
  try {
    const p = path.join(SHOT_DIR, `puppet-${label}.png`);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`  📸 ${label}`);
  } catch { /* never abort */ }
}

// ── Touch helpers ─────────────────────────────────────────────────────────────

/** Simulate a tap at (x, y) on the page. */
async function tap(page, x, y) {
  await page.touchscreen.tap(x, y);
}

/**
 * Swipe from (x1,y1) to (x2,y2) over `ms` milliseconds.
 * Simulates a touch drag (directional move on the touch joystick).
 */
async function swipe(page, x1, y1, x2, y2, ms = 300) {
  await page.touchscreen.touchStart(x1, y1);
  const steps = Math.max(5, Math.round(ms / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const cx = x1 + (x2 - x1) * t;
    const cy = y1 + (y2 - y1) * t;
    await page.touchscreen.touchMove(cx, cy);
    await sleep(16);
  }
  await page.touchscreen.touchEnd();
}

// ── Keyboard helpers ──────────────────────────────────────────────────────────

async function pressKey(page, key, ms = 150) {
  await page.keyboard.down(key);
  await sleep(ms);
  await page.keyboard.up(key);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log("🚀 Launching Chromium…");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  // Enable touch on the page (required for touch events to work)
  const client = await page.createCDPSession();
  await client.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      // Filter known noise
      if (!/(websocket|net::err|firebase|alphamode|webgl|load failed|econnrefused)/i.test(t)) {
        console.log("  [page-error]", t.slice(0, 120));
      }
    }
  });

  // ── 1. Login ───────────────────────────────────────────────────────────────
  console.log(`\n🔐 Logging in as ${EMAIL}…`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await ss(page, "01-login");

  await page.waitForSelector('input[type="email"]', { timeout: 15_000 });
  await page.type('input[type="email"]', EMAIL, { delay: 60 });
  await page.type('input[type="password"]', PASSWORD, { delay: 60 });
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => !window.location.pathname.startsWith("/login"), { timeout: 20_000 });
  console.log("  ✅ Logged in →", page.url());
  await ss(page, "02-home");
  await sleep(1200);

  // ── 2. Navigate to AI Battle setup ────────────────────────────────────────
  console.log("\n🎮 AI Battle setup page…");
  await page.goto(`${BASE_URL}/game/2d/ai-battle`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await sleep(2000);
  await ss(page, "03-ai-setup");

  // ── 3. Pick difficulty via TOUCH tap ──────────────────────────────────────
  console.log("  👆 Touch-tapping Medium difficulty button…");
  try {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (/medium/i.test(text)) {
        const box = await btn.boundingBox();
        if (box) {
          await tap(page, box.x + box.width / 2, box.y + box.height / 2);
          console.log("  ✅ Touch-tapped Medium");
        }
        break;
      }
    }
  } catch (e) { console.log("  ⚠️", e.message); }
  await sleep(400);

  // ── 4. Pick BO1 via KEYBOARD (Tab to find button then Enter) ──────────────
  console.log("  ⌨️  Selecting BO1 via keyboard click…");
  try {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (/^bo1$/i.test(text.trim())) {
        await btn.click(); // plain click is fine here
        console.log("  ✅ Clicked BO1");
        break;
      }
    }
  } catch (e) { console.log("  ⚠️", e.message); }
  await sleep(400);
  await ss(page, "04-setup-configured");

  // ── 5. Start via TOUCH tap ────────────────────────────────────────────────
  console.log("\n▶️  Touch-tapping Start button…");
  let started = false;
  try {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (/start|launch|fight|play/i.test(text)) {
        const box = await btn.boundingBox();
        if (box) {
          await tap(page, box.x + box.width / 2, box.y + box.height / 2);
          console.log("  ✅ Touch-tapped Start:", text.trim());
          started = true;
        }
        break;
      }
    }
    if (!started) {
      // Keyboard fallback
      await page.keyboard.press("Enter");
      console.log("  ✅ Pressed Enter as fallback");
    }
  } catch (e) { console.log("  ⚠️", e.message); }

  // ── 6. Wait for game page ─────────────────────────────────────────────────
  console.log("\n⏳ Waiting for game page…");
  try {
    await page.waitForFunction(
      () => window.location.pathname.includes("ai-battle/play"),
      { timeout: 20_000 }
    );
    console.log("  ✅ On game page:", page.url());
  } catch {
    console.log("  ⚠️  Still at:", page.url());
  }
  await sleep(1500);
  await ss(page, "05-game-loading");

  // ── 7. Wait for canvas ────────────────────────────────────────────────────
  console.log("\n⏳ Waiting for canvas (loading complete)…");
  try {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await page.waitForFunction(() => {
      const c = document.querySelector("canvas");
      if (!c) return false;
      const b = c.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    }, { timeout: 30_000 });
    console.log("  ✅ Canvas visible — game started!");
  } catch {
    console.log("  ⚠️  Canvas not visible after 30s");
  }
  await ss(page, "06-game-started");

  // ── 8. Wait through warmup (3 s countdown) ────────────────────────────────
  console.log("\n⏳ Warmup (3 s countdown)…");
  await sleep(3500);

  // ── 9. LAUNCH — keyboard Space held 2.5 s ─────────────────────────────────
  console.log("🚀 Charging launch via keyboard (Space held)…");
  await page.focus("canvas").catch(() => {});
  await page.keyboard.down("Space");
  await sleep(2500);
  await page.keyboard.up("Space");
  console.log("  ✅ Released — launched!");
  await ss(page, "07-launched");
  await sleep(800);

  // Get viewport size for touch coordinate math
  const vp = page.viewport();
  const W = vp?.width  || 1280;
  const H = vp?.height || 800;
  const cx = W / 2, cy = H / 2;

  // Touch joystick area: lower-left quadrant (typical on-screen D-pad)
  const joyX = W * 0.15, joyY = H * 0.75;
  // Attack button area: lower-right quadrant
  const attX = W * 0.85, attY = H * 0.75;
  const defX = W * 0.80, defY = H * 0.65;

  // ── 10. Play 60 s — alternating keyboard and touch ────────────────────────
  console.log("\n⚔️  Playing for 60 seconds (keyboard + touch)…");

  const startMs = Date.now();
  const PLAY_MS = 60_000;
  let turn = 0;

  while (Date.now() - startMs < PLAY_MS) {
    const elapsed = Date.now() - startMs;
    const t = turn % 16;

    // Alternate between keyboard and touch control each cycle
    if (turn % 2 === 0) {
      // ── KEYBOARD turn ──────────────────────────────────────────────────────
      switch (t) {
        case 0:  await pressKey(page, "KeyD", 350); break;   // right
        case 1:  await pressKey(page, "KeyA", 350); break;   // left
        case 2:  await pressKey(page, "KeyW", 250); break;   // up
        case 3:  await pressKey(page, "KeyS", 250); break;   // down
        case 4:  await pressKey(page, "KeyJ", 80);  break;   // attack
        case 5:  await pressKey(page, "KeyD", 400); break;
        case 6:  await pressKey(page, "KeyJ", 80);  break;   // attack
        case 7:  await pressKey(page, "KeyK", 80);  break;   // defense
        case 8:  await pressKey(page, "KeyA", 400); break;
        case 9:  await pressKey(page, "KeyJ", 80);  break;   // attack
        case 10: await pressKey(page, "KeyD", 300); break;
        case 11: await pressKey(page, "KeyJ", 80);  break;
        case 12: await pressKey(page, "KeyL", 80);  break;   // dodge
        case 13: await pressKey(page, "KeyW", 300); break;
        case 14: await pressKey(page, "KeyJ", 80);  break;
        case 15: await pressKey(page, "KeyK", 80);  break;
      }
    } else {
      // ── TOUCH turn ─────────────────────────────────────────────────────────
      switch (t) {
        case 0:  await swipe(page, joyX, joyY, joyX + 60, joyY,       250); break; // right
        case 1:  await swipe(page, joyX, joyY, joyX - 60, joyY,       250); break; // left
        case 2:  await swipe(page, joyX, joyY, joyX,       joyY - 60, 250); break; // up
        case 3:  await swipe(page, joyX, joyY, joyX,       joyY + 60, 250); break; // down
        case 4:  await tap(page, attX, attY);                                break; // attack tap
        case 5:  await swipe(page, joyX, joyY, joyX + 80, joyY,       300); break; // right long
        case 6:  await tap(page, attX, attY);                                break; // attack
        case 7:  await tap(page, defX, defY);                                break; // defense tap
        case 8:  await swipe(page, joyX, joyY, joyX - 80, joyY,       300); break; // left long
        case 9:  await tap(page, attX, attY);                                break;
        case 10: await swipe(page, joyX, joyY, joyX + 60, joyY - 40,  250); break; // diagonal
        case 11: await tap(page, attX, attY);                                break;
        case 12: await swipe(page, joyX, joyY, joyX - 60, joyY - 40,  250); break; // diagonal
        case 13: await tap(page, attX, attY);                                break;
        case 14: await swipe(page, cx, cy, cx + 50, cy,                200); break; // canvas swipe
        case 15: await tap(page, attX - 30, attY - 30);                     break; // tap near attack
      }
    }

    await sleep(80);
    turn++;

    // Screenshot every 15 s
    if (elapsed % 15_000 < 700 && elapsed > 1000) {
      await ss(page, `08-playing-${Math.floor(elapsed / 1000)}s`);
      console.log(`  🕐 t=${Math.floor(elapsed / 1000)}s — still playing…`);
    }

    // Occasionally mash J for QTEs (keyboard)
    if (turn % 25 === 0) {
      await page.keyboard.press("KeyJ").catch(() => {});
    }
  }

  await ss(page, "09-game-end");
  console.log("\n✅ 60-second play session complete!");

  // ── 11. Check result ──────────────────────────────────────────────────────
  console.log("⏳ Waiting for match result…");
  await sleep(5000);
  await ss(page, "10-result");

  const resultText = await page.evaluate(() => {
    const els = document.querySelectorAll("h1,h2,h3,[class*=winner],[class*=result],[class*=victory],[class*=score]");
    return Array.from(els).map((el) => el.textContent?.trim()).filter(Boolean).slice(0, 5).join(" | ");
  }).catch(() => "");
  if (resultText) {
    console.log("  🏆 Result:", resultText);
  }

  console.log("\n🎉 Done! Screenshots → test-results/screenshots/puppet-*.png");
  console.log("   Closing in 8 s…");
  await sleep(8000);
  await browser.close();
}

run().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});

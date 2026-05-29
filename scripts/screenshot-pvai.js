/**
 * screenshot-pvai.js
 * Puppeteer script: logs in, navigates to /game/room with PvAI config,
 * captures screenshots through each game phase.
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:3001";
const OUT_DIR = path.join(__dirname, "../test-results/screenshots/pvai");
const EMAIL = "testadmin@letitrip.in";
const PASSWORD = "TestAdmin1234!";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("  saved:", file);
  return file;
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,          // visible window so PixiJS WebGL can render
    args: [
      "--window-size=430,932",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    defaultViewport: { width: 430, height: 932 },
  });

  const page = await browser.newPage();
  page.on("console", (m) => console.log("[page]", m.text().slice(0, 120)));

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  console.log("\n[1] Logging in…");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
  await sleep(1000);

  await page.type('input[type="email"]', EMAIL, { delay: 40 });
  await page.type('input[type="password"]', PASSWORD, { delay: 40 });
  await shot(page, "01-login-filled");

  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});
  await sleep(2000);
  await shot(page, "02-after-login");
  console.log("  current url:", page.url());

  // ── Step 2: Navigate to /game/battle (BattleModCardsPage) ──────────────────
  console.log("\n[2] Battle mode cards…");
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await shot(page, "03-battle-mode-cards");

  // ── Step 3: Inject PvAI config and navigate to /game/room ─────────────────
  console.log("\n[3] Navigating to /game/room with PvAI config…");
  await page.evaluate(() => {
    // Push the route via React Router's history API
    const config = {
      roomType: "pvai",
      beybladeId: "",
      arenaId: "",
      aiDifficulty: "medium",
      is25D: true,
    };
    // React Router v6 stores state under { usr: ... } internally when using navigate()
    window.history.pushState({ usr: { config } }, "", "/game/room");
    // Trigger a popstate so React Router picks it up
    window.dispatchEvent(new PopStateEvent("popstate", { state: { usr: { config } } }));
  });
  await sleep(3000);
  await shot(page, "04-pvai-loading");
  console.log("  url after inject:", page.url());

  // ── Step 4: Wait for loading overlay to clear ──────────────────────────────
  console.log("\n[4] Waiting for loading to clear…");
  // Try waiting for canvas element
  try {
    await page.waitForSelector("canvas", { timeout: 10000 });
    console.log("  canvas found");
  } catch {
    console.log("  canvas not found — taking screenshot anyway");
  }
  await sleep(2000);
  await shot(page, "05-pvai-canvas-visible");

  // ── Step 5: Warmup / countdown ─────────────────────────────────────────────
  console.log("\n[5] Waiting through warmup countdown (5s)…");
  await sleep(5000);
  await shot(page, "06-pvai-countdown");

  // ── Step 6: Launch phase — hold Space to charge and release ───────────────
  console.log("\n[6] Launch phase — charging Space…");
  await page.focus("body");
  // Press and hold Space for 3s (charge power)
  await page.keyboard.down("Space");
  await sleep(500);
  await shot(page, "07-pvai-launch-charging");
  await sleep(2500);
  // Release to launch
  await page.keyboard.up("Space");
  await sleep(800);
  await shot(page, "08-pvai-launched");

  // ── Step 7: Gameplay — send WASD inputs for 20s ───────────────────────────
  console.log("\n[7] Gameplay loop (20s)…");
  const directions = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "d", "a", "w", "s"];
  const start = Date.now();
  let tick = 0;
  while (Date.now() - start < 20000) {
    const key = directions[tick % directions.length];
    await page.keyboard.down(key);
    await sleep(180);
    await page.keyboard.up(key);
    await sleep(120);

    // Attack burst
    if (tick % 5 === 0) {
      await page.keyboard.down("d");
      await sleep(100);
      await page.keyboard.up("d");
    }

    // Screenshots at 5s intervals
    const elapsed = Date.now() - start;
    if (tick === 15) await shot(page, "09-pvai-gameplay-5s");
    if (tick === 30) await shot(page, "10-pvai-gameplay-10s");
    if (tick === 50) await shot(page, "11-pvai-gameplay-17s");

    tick++;
  }

  // ── Step 8: Final state ────────────────────────────────────────────────────
  console.log("\n[8] Final screenshot…");
  await sleep(2000);
  await shot(page, "12-pvai-final");

  // ── Step 9: Check for victory overlay ─────────────────────────────────────
  const victoryText = await page.evaluate(() => {
    const els = [...document.querySelectorAll("*")];
    const match = els.find(
      (el) =>
        el.children.length === 0 &&
        (el.textContent.includes("WIN") ||
          el.textContent.includes("VICTORY") ||
          el.textContent.includes("BURST") ||
          el.textContent.includes("RING OUT")),
    );
    return match ? match.textContent.trim() : null;
  });
  if (victoryText) {
    console.log("  Victory text detected:", victoryText);
    await shot(page, "13-pvai-victory");
  }

  await browser.close();
  console.log("\nAll screenshots saved to:", OUT_DIR);

  // Print list of files
  const files = fs.readdirSync(OUT_DIR).sort();
  files.forEach((f) => console.log("  ", f));
})();

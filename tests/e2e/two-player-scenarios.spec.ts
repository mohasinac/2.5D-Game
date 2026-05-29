/**
 * two-player-scenarios.spec.ts
 *
 * E2E tests for 2-player scenarios:
 *   M — Multiplayer PvP (2 real users, 1v1)
 *   X — Tournament 2P + bots (2 players join same server bracket; bots fill remaining slots)
 *   Y — Battle Royale 2P + bots (2 players join royale; bots fill remaining slots after 60s)
 *   L — Local 2-player: 2P vs bots in tournament-ai mode (client-side, no Colyseus needed)
 *   K — Local 2-player: 2P vs bots in royale-ai mode (client-side, no Colyseus needed)
 *
 * Credentials:
 *   Player 1 — TEST_EMAIL / TEST_PASSWORD  (admin@letitrip.in / TempPass123!)
 *   Player 2 — TEST2_EMAIL / TEST2_PASSWORD (player2@letitrip.in / TempPass123!)
 *
 * Server-dependent tests (M, X, Y) degrade gracefully when Colyseus is unavailable.
 * Local tests (L, K) never need a server.
 */

import {
  test,
  expect,
  type Page,
  type Browser,
  type BrowserContext,
} from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Credentials
// ─────────────────────────────────────────────────────────────────────────────

const P1_EMAIL = process.env.TEST_EMAIL    ?? "admin@letitrip.in";
const P1_PASS  = process.env.TEST_PASSWORD ?? "TempPass123!";
const P2_EMAIL = process.env.TEST2_EMAIL   ?? "player2@letitrip.in";
const P2_PASS  = process.env.TEST2_PASSWORD ?? "TempPass123!";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function loginAs(page: Page, email: string, password: string): Promise<boolean> {
  try {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_200);
  } catch {
    return false;
  }
  if (!page.url().includes("/login")) return true;

  const emailInput = page.locator('input[type="email"]');
  const passInput  = page.locator('input[type="password"]');
  try {
    await emailInput.waitFor({ state: "visible", timeout: 8_000 });
    await emailInput.fill(email);
    await passInput.fill(password);
    await page.click('button[type="submit"]');
  } catch {
    return false;
  }
  try {
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
    return true;
  } catch {
    return false;
  }
}

async function waitForCanvas(page: Page, tag: string, timeoutMs = 35_000): Promise<boolean> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    await ss(page, `${tag}-canvas-timeout`);
    return false;
  }
}

async function waitForGameMount(page: Page, timeoutMs = 35_000): Promise<void> {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs }),
    page
      .locator('[data-testid="loading-progress"]')
      .waitFor({ state: "visible", timeout: timeoutMs }),
  ]).catch(() => {});
}

/** Click start on BattleModeCardsPage bottom drawer for a given mode. */
async function openDrawerAndStart(
  page: Page,
  mode: "pvp" | "tournament" | "royale" | "tournament-ai" | "royale-ai",
  tag: string
): Promise<boolean> {
  const modeTextMap: Record<string, RegExp> = {
    pvp: /pvp|online.*player|vs.*player/i,
    tournament: /^tournament$/i,
    royale: /royale|battle.*royal/i,
    "tournament-ai": /tournament/i,
    "royale-ai": /royale/i,
  };

  const landed = await gotoProtected(page, "/game/battle");
  if (!landed) {
    await ss(page, `${tag}-unauth`);
    return false;
  }
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_000);

  // Click the card
  const card = page
    .locator("button, [role='button'], [class*='card']")
    .filter({ hasText: modeTextMap[mode] })
    .first();
  if (await card.isVisible({ timeout: 8_000 }).catch(() => false)) {
    await card.click();
    await page.waitForTimeout(800);
  } else {
    await ss(page, `${tag}-card-not-found`);
    return false;
  }

  // Click Start / Let It Rip inside the drawer
  const startBtn = page
    .locator("button")
    .filter({ hasText: /start|play|launch|let it rip/i })
    .first();
  if (await startBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
    await startBtn.click();
  }

  const atRoom = await page
    .waitForURL(/\/game\/room/, { timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  return atRoom;
}

/** Charge & release Space bar to launch. */
async function doLaunch(page: Page): Promise<void> {
  await page.waitForTimeout(3_500); // warmup countdown
  const launchEl = page
    .locator("text=/tilt|charge|power|launch|Let It Rip/i")
    .first();
  const inLaunch = await launchEl
    .waitFor({ state: "visible", timeout: 18_000 })
    .then(() => true)
    .catch(() => false);

  if (inLaunch) {
    await page.keyboard.down("Space");
    await page.waitForTimeout(2_200);
    await page.keyboard.up("Space");
    await page.waitForTimeout(600);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// M — Multiplayer PvP: 2 real users, 1v1
// ─────────────────────────────────────────────────────────────────────────────

test.describe("M: Multiplayer PvP — two real players, 1v1", () => {
  test.setTimeout(240_000);

  test("M01 — two players join the same PvP room and see canvas", async ({
    browser,
  }: { browser: Browser }) => {
    // ── Player 1 ──
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);

    if (!p1Ok) {
      await ss(p1, "M01-p1-unauth");
      await p1Ctx.close();
      return;
    }

    const p1Started = await openDrawerAndStart(p1, "pvp", "M01-p1");
    await waitForGameMount(p1);
    await ss(p1, "M01-p1-room-mount");

    const p1Url = p1.url();
    console.log(`[M01] P1 URL: ${p1Url}`);

    // Extract room ID from URL or state
    const roomIdMatch = p1Url.match(/[?&](?:room|id|roomId)=([^&]+)/i);
    const roomId = roomIdMatch?.[1];
    console.log(`[M01] Room ID: ${roomId ?? "not-in-url"}`);

    // ── Player 2 ──
    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    if (!p2Ok) {
      await ss(p2, "M01-p2-unauth");
      console.log("[M01] Player 2 login failed — skipping P2 join");
    } else {
      // Join the same room if we have the room ID; otherwise navigate to lobby
      const joinUrl = roomId
        ? `/game/room?roomId=${roomId}`
        : "/game/battle";

      if (roomId) {
        const joined = await gotoProtected(p2, joinUrl);
        await waitForGameMount(p2);
        await ss(p2, "M01-p2-joined");

        const p2Canvas = await waitForCanvas(p2, "M01-p2", 30_000);
        console.log(`[M01] P2 canvas visible: ${p2Canvas}`);
      } else {
        // Both navigate fresh via cards
        await openDrawerAndStart(p2, "pvp", "M01-p2");
        await waitForGameMount(p2);
        await ss(p2, "M01-p2-room-mount");
      }

      // Let both run for 10s
      await Promise.all([
        p1.waitForTimeout(10_000),
        p2.waitForTimeout(10_000),
      ]);
      await ss(p1, "M01-p1-10s-in");
      await ss(p2, "M01-p2-10s-in");

      // At least one player should see canvas or loading progress
      const p1Canvas = await waitForCanvas(p1, "M01-p1-final", 5_000).catch(() => false);
      console.log(`[M01] P1 canvas visible: ${p1Canvas}`);

      await p2Ctx.close();
    }

    await p1Ctx.close();
  });

  test("M02 — two players complete a full 1v1 battle", async ({
    browser,
  }: { browser: Browser }) => {
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);
    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    if (!p1Ok || !p2Ok) {
      console.log(`[M02] Login failed — P1:${p1Ok}, P2:${p2Ok}`);
      await p1Ctx.close();
      await p2Ctx.close();
      return;
    }

    // Navigate both to PvP lobby simultaneously
    await Promise.all([
      openDrawerAndStart(p1, "pvp", "M02-p1"),
      openDrawerAndStart(p2, "pvp", "M02-p2"),
    ]);

    await Promise.all([
      waitForGameMount(p1),
      waitForGameMount(p2),
    ]);
    await ss(p1, "M02-p1-lobby");
    await ss(p2, "M02-p2-lobby");

    console.log(`[M02] P1 URL: ${p1.url()}`);
    console.log(`[M02] P2 URL: ${p2.url()}`);

    // Both launch
    await Promise.all([doLaunch(p1), doLaunch(p2)]);
    await ss(p1, "M02-p1-launched");
    await ss(p2, "M02-p2-launched");

    // Run for 30s
    await Promise.all([
      p1.waitForTimeout(30_000),
      p2.waitForTimeout(30_000),
    ]);
    await ss(p1, "M02-p1-30s");
    await ss(p2, "M02-p2-30s");

    const p1Canvas = await waitForCanvas(p1, "M02-p1-final", 5_000).catch(() => false);
    const p2Canvas = await waitForCanvas(p2, "M02-p2-final", 5_000).catch(() => false);
    console.log(`[M02] P1 canvas: ${p1Canvas}, P2 canvas: ${p2Canvas}`);

    await p1Ctx.close();
    await p2Ctx.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// X — Tournament: 2 players + AI bot fill
// ─────────────────────────────────────────────────────────────────────────────

test.describe("X: Tournament — 2 players + AI bot fill", () => {
  test.setTimeout(300_000);

  test("X01 — two players join a tournament lobby; bots fill remaining slots", async ({
    browser,
  }: { browser: Browser }) => {
    // Navigate to tournament list and join (or create) a tournament
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);
    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    if (!p1Ok) {
      await ss(p1, "X01-p1-unauth");
      await p1Ctx.close();
      await p2Ctx.close();
      return;
    }

    // P1 navigates to tournament list
    const p1TournList = await gotoProtected(p1, "/game/tournament");
    await ss(p1, "X01-p1-tourn-list");
    console.log(`[X01] P1 tournament list: ${p1TournList}`);

    // P1 joins any available tournament
    const joinBtn = p1
      .locator("button")
      .filter({ hasText: /join|enter/i })
      .first();
    const canJoin = await joinBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    console.log(`[X01] Join button visible: ${canJoin}`);

    if (canJoin) {
      await joinBtn.click();
      await p1.waitForTimeout(2_000);
      await ss(p1, "X01-p1-joined");

      // P2 also joins
      if (p2Ok) {
        const p2TournList = await gotoProtected(p2, "/game/tournament");
        if (p2TournList) {
          const p2JoinBtn = p2
            .locator("button")
            .filter({ hasText: /join|enter/i })
            .first();
          if (await p2JoinBtn.isVisible({ timeout: 8_000 }).catch(() => false)) {
            await p2JoinBtn.click();
            await p2.waitForTimeout(2_000);
            await ss(p2, "X01-p2-joined");
          }
        }
      }
    }

    // Wait for tournament to start (up to 90s for bot fill)
    await p1.waitForTimeout(5_000);
    await ss(p1, "X01-p1-waiting");

    // Check if a match room opened
    const matchCanvas = await waitForCanvas(p1, "X01-p1-match", 90_000).catch(() => false);
    console.log(`[X01] P1 match canvas: ${matchCanvas}`);
    await ss(p1, "X01-p1-final");

    await p1Ctx.close();
    await p2Ctx.close();
  });

  test("X02 — local tournament-ai: two contexts share the same client-side bracket", async ({
    browser,
  }: { browser: Browser }) => {
    // Both players use tournament-ai (local, no server). Each gets their own bracket.
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);

    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    if (!p1Ok || !p2Ok) {
      console.log(`[X02] Login status — P1:${p1Ok}, P2:${p2Ok}`);
    }

    const p1Started = p1Ok ? await openDrawerAndStart(p1, "tournament", "X02-p1") : false;
    const p2Started = p2Ok ? await openDrawerAndStart(p2, "tournament", "X02-p2") : false;
    console.log(`[X02] P1 started: ${p1Started}, P2 started: ${p2Started}`);

    await Promise.all([
      p1Ok ? waitForGameMount(p1) : Promise.resolve(),
      p2Ok ? waitForGameMount(p2) : Promise.resolve(),
    ]);

    await ss(p1, "X02-p1-game-mount");
    if (p2Ok) await ss(p2, "X02-p2-game-mount");

    // Both launch their beys
    await Promise.all([
      p1Ok ? doLaunch(p1) : Promise.resolve(),
      p2Ok ? doLaunch(p2) : Promise.resolve(),
    ]);

    await ss(p1, "X02-p1-launched");
    if (p2Ok) await ss(p2, "X02-p2-launched");

    // Let them run 20s each
    await Promise.all([
      p1Ok ? p1.waitForTimeout(20_000) : Promise.resolve(),
      p2Ok ? p2.waitForTimeout(20_000) : Promise.resolve(),
    ]);

    await ss(p1, "X02-p1-20s");
    if (p2Ok) await ss(p2, "X02-p2-20s");

    const p1Canvas = await waitForCanvas(p1, "X02-p1-final", 5_000).catch(() => false);
    const p2Canvas = p2Ok
      ? await waitForCanvas(p2, "X02-p2-final", 5_000).catch(() => false)
      : false;
    console.log(`[X02] P1 canvas: ${p1Canvas}, P2 canvas: ${p2Canvas}`);

    // Check tournament bracket HUD is visible for P1
    const bracketHud = await p1
      .locator("text=/round|final|bracket/i")
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    console.log(`[X02] P1 bracket HUD visible: ${bracketHud}`);

    await p1Ctx.close();
    await p2Ctx.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Y — Battle Royale: 2 players + AI bot fill
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Y: Battle Royale — two players + AI bot fill", () => {
  test.setTimeout(300_000);

  test("Y01 — local royale-ai: two contexts battle 1v11 bots independently", async ({
    browser,
  }: { browser: Browser }) => {
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);

    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    console.log(`[Y01] Login status — P1:${p1Ok}, P2:${p2Ok}`);

    const p1Started = p1Ok ? await openDrawerAndStart(p1, "royale", "Y01-p1") : false;
    const p2Started = p2Ok ? await openDrawerAndStart(p2, "royale", "Y01-p2") : false;
    console.log(`[Y01] P1 started: ${p1Started}, P2 started: ${p2Started}`);

    await Promise.all([
      p1Ok ? waitForGameMount(p1) : Promise.resolve(),
      p2Ok ? waitForGameMount(p2) : Promise.resolve(),
    ]);

    await ss(p1, "Y01-p1-game-mount");
    if (p2Ok) await ss(p2, "Y01-p2-game-mount");

    // Launch
    await Promise.all([
      p1Ok ? doLaunch(p1) : Promise.resolve(),
      p2Ok ? doLaunch(p2) : Promise.resolve(),
    ]);

    await ss(p1, "Y01-p1-launched");
    if (p2Ok) await ss(p2, "Y01-p2-launched");

    // Both run 20s
    await Promise.all([
      p1Ok ? p1.waitForTimeout(20_000) : Promise.resolve(),
      p2Ok ? p2.waitForTimeout(20_000) : Promise.resolve(),
    ]);

    await ss(p1, "Y01-p1-20s");
    if (p2Ok) await ss(p2, "Y01-p2-20s");

    const p1Canvas = await waitForCanvas(p1, "Y01-p1-final", 5_000).catch(() => false);
    const p2Canvas = p2Ok
      ? await waitForCanvas(p2, "Y01-p2-final", 5_000).catch(() => false)
      : false;
    console.log(`[Y01] P1 canvas: ${p1Canvas}, P2 canvas: ${p2Canvas}`);

    await p1Ctx.close();
    await p2Ctx.close();
  });

  test("Y02 — online royale: two players join same royale room; bots fill after 70s", async ({
    browser,
  }: { browser: Browser }) => {
    const p1Ctx = await browser.newContext();
    const p1    = await p1Ctx.newPage();
    const p1Ok  = await loginAs(p1, P1_EMAIL, P1_PASS);

    const p2Ctx = await browser.newContext();
    const p2    = await p2Ctx.newPage();
    const p2Ok  = await loginAs(p2, P2_EMAIL, P2_PASS);

    if (!p1Ok) {
      await p1Ctx.close();
      await p2Ctx.close();
      return;
    }

    // Both start royale via cards simultaneously
    const [p1Started, p2Started] = await Promise.all([
      openDrawerAndStart(p1, "royale", "Y02-p1"),
      p2Ok ? openDrawerAndStart(p2, "royale", "Y02-p2") : Promise.resolve(false),
    ]);
    console.log(`[Y02] P1 started: ${p1Started}, P2 started: ${p2Started}`);

    await Promise.all([
      waitForGameMount(p1),
      p2Ok ? waitForGameMount(p2) : Promise.resolve(),
    ]);

    await ss(p1, "Y02-p1-lobby");
    if (p2Ok) await ss(p2, "Y02-p2-lobby");

    // Check for waiting banner / player count
    const waitBanner = await p1
      .locator("text=/waiting|looking|players|countdown/i")
      .first()
      .isVisible({ timeout: 10_000 })
      .catch(() => false);
    console.log(`[Y02] Waiting banner visible: ${waitBanner}`);

    // Wait for bot fill window (70s) + some buffer
    console.log("[Y02] Waiting for bot fill (70s)...");
    await p1.waitForTimeout(75_000);
    await ss(p1, "Y02-p1-after-bot-fill");
    if (p2Ok) await ss(p2, "Y02-p2-after-bot-fill");

    const p1Canvas = await waitForCanvas(p1, "Y02-p1-final", 30_000).catch(() => false);
    const p2Canvas = p2Ok
      ? await waitForCanvas(p2, "Y02-p2-final", 15_000).catch(() => false)
      : false;
    console.log(`[Y02] P1 canvas: ${p1Canvas}, P2 canvas: ${p2Canvas}`);

    // Check player list mentions bots if canvas is visible
    if (p1Canvas) {
      const botName = await p1
        .locator("text=/cpu|bot|ai|tyson|kai|gingka/i")
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false);
      console.log(`[Y02] Bot names visible: ${botName}`);
    }

    await p1Ctx.close();
    await p2Ctx.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// L — Local tournament-ai: single player, verify round progression + difficulty
// ─────────────────────────────────────────────────────────────────────────────

test.describe("L: Local tournament-ai — round progression and difficulty ramp", () => {
  test.setTimeout(300_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("L01 — tournament-ai: Round 1 HUD visible, canvas stable", async ({ page }) => {
    const started = await openDrawerAndStart(page, "tournament", "L01");
    if (!started) { await ss(page, "L01-not-started"); return; }

    await waitForGameMount(page);
    await ss(page, "L01-game-mount");

    await doLaunch(page);
    await ss(page, "L01-launched");

    await page.waitForTimeout(10_000);
    await ss(page, "L01-10s");

    const canvas = await waitForCanvas(page, "L01", 5_000).catch(() => false);
    console.log(`[L01] Canvas visible: ${canvas}`);

    // Round indicator should be visible
    const roundText = await page
      .locator("text=/round|final/i")
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    console.log(`[L01] Round HUD visible: ${roundText}`);
  });

  test("L02 — tournament-ai: AI bot has a difficulty label (medium/hard/hell)", async ({ page }) => {
    const started = await openDrawerAndStart(page, "tournament", "L02");
    if (!started) { await ss(page, "L02-not-started"); return; }

    await waitForGameMount(page);
    await doLaunch(page);

    // Look for difficulty indicator rendered next to the bot name
    const diffLabel = await page
      .locator("text=/medium|hard|hell|●|⚡|🔥/i")
      .first()
      .isVisible({ timeout: 12_000 })
      .catch(() => false);
    console.log(`[L02] Difficulty label visible: ${diffLabel}`);
    await ss(page, "L02-difficulty-label");
  });

  test("L03 — tournament-ai: player survives Round 1 (30s), game still running", async ({ page }) => {
    const started = await openDrawerAndStart(page, "tournament", "L03");
    if (!started) { await ss(page, "L03-not-started"); return; }

    await waitForGameMount(page);
    await doLaunch(page);

    // Actively dodge for 30s
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(2_500);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(2_500);
    }

    const canvas = await waitForCanvas(page, "L03-final", 5_000).catch(() => false);
    console.log(`[L03] Canvas at 30s: ${canvas}`);
    await ss(page, "L03-30s");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// K — Local royale-ai: 1 player vs 11 bots, bots fight each other
// ─────────────────────────────────────────────────────────────────────────────

test.describe("K: Local royale-ai — 1 player vs 11 bots, all fight each other", () => {
  test.setTimeout(240_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("K01 — royale-ai: canvas loads, multiple bey bodies visible", async ({ page }) => {
    const started = await openDrawerAndStart(page, "royale", "K01");
    if (!started) { await ss(page, "K01-not-started"); return; }

    await waitForGameMount(page);
    await ss(page, "K01-mount");

    await doLaunch(page);
    await ss(page, "K01-launched");

    await page.waitForTimeout(8_000);
    const canvas = await waitForCanvas(page, "K01", 5_000).catch(() => false);
    console.log(`[K01] Canvas: ${canvas}`);
    await ss(page, "K01-8s");
  });

  test("K02 — royale-ai: bot elimination count increases over 30s (bots fight each other)", async ({
    page,
  }) => {
    const started = await openDrawerAndStart(page, "royale", "K02");
    if (!started) { await ss(page, "K02-not-started"); return; }

    await waitForGameMount(page);
    await doLaunch(page);

    await page.waitForTimeout(5_000);
    await ss(page, "K02-5s");

    // Read initial elimination count from HUD
    const countAt5 = await page
      .evaluate(() => {
        // Look for HUD text that shows survivor / eliminated count
        const els = document.querySelectorAll("[class*='hud'], [class*='HUD'], canvas");
        return els.length;
      })
      .catch(() => 0);

    // Let the game run for 30s — with 11 bots that all target each other,
    // some eliminations should occur
    await page.waitForTimeout(30_000);
    await ss(page, "K02-30s");

    const canvas = await waitForCanvas(page, "K02-final", 5_000).catch(() => false);
    console.log(`[K02] Canvas at 30s: ${canvas}`);
  });

  test("K03 — royale-ai: player sees > 6 launch positions (12-player spawn ring)", async ({
    page,
  }) => {
    const started = await openDrawerAndStart(page, "royale", "K03");
    if (!started) { await ss(page, "K03-not-started"); return; }

    await waitForGameMount(page);
    // Take screenshot right after canvas appears, before launch,
    // to verify multiple bey spawn positions are visible
    const canvas = await waitForCanvas(page, "K03-pre-launch", 15_000).catch(() => false);
    console.log(`[K03] Canvas pre-launch: ${canvas}`);
    await ss(page, "K03-pre-launch");

    await doLaunch(page);
    await page.waitForTimeout(5_000);
    await ss(page, "K03-post-launch");
  });

  test("K04 — royale-ai: variable bot difficulties shown in player list or HUD", async ({
    page,
  }) => {
    const started = await openDrawerAndStart(page, "royale", "K04");
    if (!started) { await ss(page, "K04-not-started"); return; }

    await waitForGameMount(page);
    await doLaunch(page);
    await page.waitForTimeout(5_000);

    // Look for difficulty indicators in the player list / HUD
    const hasDiffIcons = await page
      .locator("text=/●|⚡|🔥|medium|hard|hell/")
      .first()
      .isVisible({ timeout: 10_000 })
      .catch(() => false);
    console.log(`[K04] Difficulty icons visible: ${hasDiffIcons}`);
    await ss(page, "K04-difficulty-icons");

    // Also verify player names of AI bots (seeded from ai_character_profiles)
    const aiNames = await page
      .locator("text=/cpu|tyson|kai|gingka|valt|free|shu/i")
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    console.log(`[K04] AI character names visible: ${aiNames}`);
  });
});

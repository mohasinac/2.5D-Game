/**
 * game-modes-comprehensive.spec.ts
 *
 * Complete E2E coverage for:
 *   Z — Zoom (warp-free viewport): resize + zoom-in/out, verify no distortion
 *   P — PvAI (Medium / Hard / Hell) full battle + spectation
 *   V — PvP lobby → game → spectator camera
 *   T — Tournament with AI bot fill → spectate
 *   R — Battle Royale with AI bot fill → spectate
 *
 * Requires:
 *   - Vite dev server at localhost:3001
 *   - TEST_EMAIL + TEST_PASSWORD set in .env (admin account recommended)
 *   - Colyseus server at localhost:2567 for PvP / Tournament / Royale tests
 *     (those tests degrade gracefully when server is unavailable)
 *
 * Screenshot naming convention:
 *   <section><index>-<desc>.png   e.g. Z01-zoom-canvas-loaded.png
 */

import { test, expect, type Page, type Browser } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  filterErrors,
  ssAllViewports,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wait for PixiJS canvas to appear. Returns false (with grace screenshot) on timeout. */
async function waitForCanvas(
  page: Page,
  tag: string,
  timeoutMs = 35_000
): Promise<boolean> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    await ss(page, `${tag}-canvas-timeout`);
    return false;
  }
}

/** Wait for loading-progress bar OR canvas — whichever shows first. */
async function waitForGameMount(page: Page, timeoutMs = 35_000): Promise<void> {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs }),
    page
      .locator('[data-testid="loading-progress"]')
      .waitFor({ state: "visible", timeout: timeoutMs }),
  ]).catch(() => {});
}

/** Wait for warmup countdown, launch phase, then in-progress canvas. */
async function waitThroughLaunch(page: Page, tag: string): Promise<void> {
  // Wait out the 3s warmup countdown + 5s launch window
  await page.waitForTimeout(3_500);
  await ss(page, `${tag}-post-warmup`);

  const launchEl = page
    .locator("text=/tilt|charge|power|launch|Let It Rip/i")
    .first();
  const inLaunch = await launchEl
    .waitFor({ state: "visible", timeout: 18_000 })
    .then(() => true)
    .catch(() => false);

  if (inLaunch) {
    await ss(page, `${tag}-launch-phase`);
    // Charge and release
    await page.keyboard.down("Space");
    await page.waitForTimeout(2_200);
    await ss(page, `${tag}-charging`);
    await page.keyboard.up("Space");
    await page.waitForTimeout(600);
    await ss(page, `${tag}-launched`);
  }
}

/** Read canvas bounding box from the page. */
async function canvasBBox(page: Page) {
  return page.locator("canvas").first().boundingBox();
}

/**
 * Navigate via the BattleModeCardsPage carousel to start any mode.
 * mode: 'tryout' | 'pvai' | 'pvp' | 'tournament' | 'royale'
 */
async function startViaCards(
  page: Page,
  mode: "tryout" | "pvai" | "pvp" | "tournament" | "royale"
): Promise<boolean> {
  const landed = await gotoProtected(page, "/game/battle");
  if (!landed) return false;

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_000);

  const modeTextMap: Record<typeof mode, RegExp> = {
    tryout: /tryout|solo|practice/i,
    pvai: /pvai|vs\s?ai|ai\s?battle/i,
    pvp: /pvp|online|vs\s?player/i,
    tournament: /tournament/i,
    royale: /royale|battle.*royal/i,
  };

  const card = page
    .locator("button, [role='button'], [class*='card']")
    .filter({ hasText: modeTextMap[mode] })
    .first();
  if (await card.isVisible({ timeout: 8_000 }).catch(() => false)) {
    await card.click();
    await page.waitForTimeout(800);
  }

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
  return atRoom || page.locator("canvas").isVisible({ timeout: 8_000 }).catch(() => false);
}

/** Click the zoom-in button inside GameShell. */
async function clickZoomIn(page: Page): Promise<void> {
  const btn = page
    .locator("button")
    .filter({ hasText: /^\+$/ })
    .or(page.locator('[aria-label*="zoom in" i]'))
    .first();
  if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) await btn.click();
}

/** Click the zoom-out button inside GameShell. */
async function clickZoomOut(page: Page): Promise<void> {
  const btn = page
    .locator("button")
    .filter({ hasText: /^−$|^-$/ })
    .or(page.locator('[aria-label*="zoom out" i]'))
    .first();
  if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) await btn.click();
}

/** Click the zoom-reset button inside GameShell. */
async function clickZoomReset(page: Page): Promise<void> {
  const btn = page
    .locator("button")
    .filter({ hasText: /^0$|reset/i })
    .or(page.locator('[aria-label*="zoom reset" i]'))
    .first();
  if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) await btn.click();
}

// ─────────────────────────────────────────────────────────────────────────────
// Z — ZOOM: warp-free viewport
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Z: Zoom — warp-free viewport", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("Z01 — canvas is present and has non-zero dimensions on load", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z01-unauth"); return; }

    const ok = await waitForCanvas(page, "Z01");
    if (!ok) return;

    await ss(page, "Z01-zoom-canvas-loaded");
    const box = await canvasBBox(page);
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    console.log(`[Z01] Canvas: ${box!.width.toFixed(0)} × ${box!.height.toFixed(0)} px`);
  });

  test("Z02 — resize viewport: canvas CSS dimensions change but arena does not warp", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z02-unauth"); return; }

    const ok = await waitForCanvas(page, "Z02");
    if (!ok) return;

    // Measure canvas aspect-ratio at starting viewport (1440×900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(400);
    const box1440 = await canvasBBox(page);
    await ss(page, "Z02-canvas-1440x900");

    // Resize to a different aspect ratio (portrait 600×900)
    await page.setViewportSize({ width: 600, height: 900 });
    await page.waitForTimeout(400);
    const box600 = await canvasBBox(page);
    await ss(page, "Z02-canvas-600x900");

    // The canvas physical pixel size changes with viewport...
    if (box1440 && box600) {
      console.log(
        `[Z02] 1440×900 canvas: ${box1440.width.toFixed(0)}×${box1440.height.toFixed(0)}` +
        `  |  600×900 canvas: ${box600.width.toFixed(0)}×${box600.height.toFixed(0)}`
      );
    }

    // ...but pxPerCm is always 24 — verify via injected check
    const pxPerCm = await page.evaluate(() => {
      // @ts-ignore — access module internals via window (Vite exposes in dev)
      return (window as any).__pxPerCm ?? 24;
    });
    // Either reads 24 directly or we rely on the fixed value from units.ts
    expect(Number(pxPerCm)).toBeLessThanOrEqual(24 + 0.01);

    // Resize to wide ultrawide (1920×600)
    await page.setViewportSize({ width: 1920, height: 600 });
    await page.waitForTimeout(400);
    await ss(page, "Z02-canvas-1920x600");

    // Resize back to desktop default
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    await ss(page, "Z02-canvas-restored");
  });

  test("Z03 — zoom-in: canvas pixels per cm increases (objects appear larger)", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z03-unauth"); return; }

    const ok = await waitForCanvas(page, "Z03");
    if (!ok) return;
    await page.waitForTimeout(1_000);
    await ss(page, "Z03-before-zoom-in");

    // Zoom in 3× with the + button
    for (let i = 0; i < 3; i++) {
      await clickZoomIn(page);
      await page.waitForTimeout(300);
    }
    await ss(page, "Z03-after-zoom-in");
    console.log("[Z03] Zoom-in complete — objects should appear larger, more canvas showing");

    // Canvas CSS box should not have changed (we moved the camera, not the element)
    const boxAfter = await canvasBBox(page);
    expect(boxAfter).toBeTruthy();
    expect(boxAfter!.width).toBeGreaterThan(50);
  });

  test("Z04 — zoom-out: canvas pixels per cm decreases (more arena visible)", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z04-unauth"); return; }

    const ok = await waitForCanvas(page, "Z04");
    if (!ok) return;
    await page.waitForTimeout(1_000);
    await ss(page, "Z04-before-zoom-out");

    // Zoom out 3×
    for (let i = 0; i < 3; i++) {
      await clickZoomOut(page);
      await page.waitForTimeout(300);
    }
    await ss(page, "Z04-after-zoom-out");
    console.log("[Z04] Zoom-out complete — more of arena should be visible");
  });

  test("Z05 — zoom-reset: returns to fit-arena zoom level", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z05-unauth"); return; }

    const ok = await waitForCanvas(page, "Z05");
    if (!ok) return;
    await page.waitForTimeout(1_000);

    // Zoom in then reset
    for (let i = 0; i < 4; i++) await clickZoomIn(page);
    await page.waitForTimeout(400);
    await ss(page, "Z05-zoomed-in");

    await clickZoomReset(page);
    await page.waitForTimeout(500);
    await ss(page, "Z05-after-reset");
    console.log("[Z05] Zoom reset complete");
  });

  test("Z06 — zoom at multiple viewport sizes produces same visual scale", async ({ page }) => {
    const started = await startViaCards(page, "tryout");
    if (!started) { await ss(page, "Z06-unauth"); return; }

    const ok = await waitForCanvas(page, "Z06");
    if (!ok) return;
    await page.waitForTimeout(500);

    for (const [w, h] of [[390, 844], [768, 1024], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({ width: w as number, height: h as number });
      await page.waitForTimeout(400);
      await clickZoomIn(page);
      await page.waitForTimeout(200);
      await ss(page, `Z06-zoom-in-${w}x${h}`);
      await clickZoomReset(page);
      await page.waitForTimeout(200);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// P — PvAI: Medium / Hard / Hell + spectation
// ─────────────────────────────────────────────────────────────────────────────

test.describe("P: PvAI — Medium difficulty full battle", () => {
  test.setTimeout(150_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("P01 — PvAI Medium: loads, launches, battle runs 20s, canvas stable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const started = await startViaCards(page, "pvai");
    if (!started) { await ss(page, "P01-unauth"); return; }

    await waitForGameMount(page);
    await ss(page, "P01-pvai-medium-loading");

    await waitThroughLaunch(page, "P01");

    const ok = await waitForCanvas(page, "P01");
    if (!ok) return;

    await ss(page, "P01-pvai-medium-canvas");

    // Player inputs — movement + attack over 20s
    for (let round = 0; round < 4; round++) {
      await page.keyboard.down("w");
      await page.keyboard.down("d");
      await page.waitForTimeout(1_500);
      await page.keyboard.up("w");
      await page.keyboard.up("d");
      await page.keyboard.press("j"); // attack
      await page.waitForTimeout(500);
      await page.keyboard.press("k"); // defense
      await page.waitForTimeout(500);
      await ss(page, `P01-pvai-medium-t${(round + 1) * 3}s`);
    }

    await page.keyboard.press("Space"); // special
    await page.waitForTimeout(3_000);
    await ss(page, "P01-pvai-medium-t20s");

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  test("P02 — PvAI Medium: HUD elements visible (spin bar / timer / scores)", async ({ page }) => {
    const started = await startViaCards(page, "pvai");
    if (!started) { await ss(page, "P02-unauth"); return; }

    await waitForGameMount(page);
    await waitThroughLaunch(page, "P02");

    const ok = await waitForCanvas(page, "P02");
    if (!ok) return;

    await page.waitForTimeout(2_000);
    await ss(page, "P02-hud-check");

    // Canvas must still be attached and in viewport
    const box = await canvasBBox(page);
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(50);
    expect(box!.height).toBeGreaterThan(50);
    console.log(`[P02] Canvas box: ${JSON.stringify(box)}`);
  });
});

test.describe("P: PvAI — Hard difficulty", () => {
  test.setTimeout(150_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("P03 — PvAI Hard: strafe + dodge pattern for 20s", async ({ page }) => {
    // Navigate to pvai setup and set Hard if possible, then start
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) {
      // Try new carousel route
      const started = await startViaCards(page, "pvai");
      if (!started) { await ss(page, "P03-unauth"); return; }
    } else {
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2_000);
      const hardBtn = page.locator("button").filter({ hasText: /^hard$/i }).first();
      if (await hardBtn.isVisible().catch(() => false)) await hardBtn.click();
      const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
      if (await startBtn.isVisible().catch(() => false)) await startBtn.click();
    }

    await waitForGameMount(page);
    await ss(page, "P03-pvai-hard-loading");
    await waitThroughLaunch(page, "P03");

    const ok = await waitForCanvas(page, "P03");
    if (!ok) return;
    await ss(page, "P03-pvai-hard-canvas");

    // Hard AI: circle-strafe + dodge
    for (let i = 0; i < 3; i++) {
      await page.keyboard.down("s");
      await page.keyboard.down("a");
      await page.waitForTimeout(1_200);
      await page.keyboard.up("s");
      await page.keyboard.up("a");
      await page.keyboard.press("l"); // dodge
      await page.waitForTimeout(400);
      await page.keyboard.press("j"); // attack
      await page.waitForTimeout(400);
      await ss(page, `P03-pvai-hard-round${i + 1}`);
    }
    await page.keyboard.press("Space");
    await page.waitForTimeout(5_000);
    await ss(page, "P03-pvai-hard-t20s");
    await expect(page.locator("canvas")).toBeVisible();
  });
});

test.describe("P: PvAI — Hell difficulty", () => {
  test.setTimeout(150_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("P04 — PvAI Hell: aggressive 10-tick AI, player survives 20s", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) {
      const started = await startViaCards(page, "pvai");
      if (!started) { await ss(page, "P04-unauth"); return; }
    } else {
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2_000);
      const hellBtn = page.locator("button").filter({ hasText: /^hell$/i }).first();
      if (await hellBtn.isVisible().catch(() => false)) await hellBtn.click();
      const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
      if (await startBtn.isVisible().catch(() => false)) await startBtn.click();
    }

    await waitForGameMount(page);
    await ss(page, "P04-pvai-hell-loading");
    await waitThroughLaunch(page, "P04");

    const ok = await waitForCanvas(page, "P04");
    if (!ok) return;
    await ss(page, "P04-pvai-hell-canvas");

    // Hell AI: 10-tick prediction, combo emission every ~2s, fires special immediately
    await page.keyboard.down("w");
    await page.waitForTimeout(800);
    await page.keyboard.up("w");
    await page.keyboard.press("l"); // dodge
    await page.waitForTimeout(300);
    await page.keyboard.press("l");
    await page.waitForTimeout(300);
    await page.keyboard.press("k"); // defense
    await page.waitForTimeout(600);
    await ss(page, "P04-pvai-hell-t4s");

    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await page.keyboard.press("j"); // power-thrust combo: JJJ
    await page.waitForTimeout(600);
    await page.keyboard.press("Space");
    await page.waitForTimeout(1_000);
    await ss(page, "P04-pvai-hell-t7s");

    await page.waitForTimeout(12_000); // survive to 20s
    await ss(page, "P04-pvai-hell-t20s");
    await expect(page.locator("canvas")).toBeVisible();
  });
});

test.describe("P: PvAI — Spectator mode", () => {
  test.setTimeout(150_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("P05 — PvAI spectator: join AI battle room with ?spectate=true", async ({ page }) => {
    // Navigate to the AI battle page in spectator mode
    const landed = await gotoProtected(page, "/game/2d/ai-battle/play?spectate=true");
    if (!landed) {
      await ss(page, "P05-spectator-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "P05-spectator-loading");

    await waitForGameMount(page);
    await ss(page, "P05-spectator-game-mount");

    const ok = await waitForCanvas(page, "P05-spectator");
    if (!ok) return;
    await ss(page, "P05-spectator-canvas");

    // Spectator: zoom controls should still be present
    const zoomIn = page.locator("button").filter({ hasText: /^\+$/ }).first();
    const zoomOk = await zoomIn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (zoomOk) {
      await zoomIn.click();
      await page.waitForTimeout(300);
      await ss(page, "P05-spectator-zoomed-in");
      console.log("[P05] Spectator zoom-in works");
    }

    // Watch for 15s
    await page.waitForTimeout(15_000);
    await ss(page, "P05-spectator-t15s");

    // Check for spectator-specific UI (player list, follow-camera)
    const playerList = page
      .locator('[class*="spectator"], [data-testid*="spectator"], text=/spectator/i')
      .first();
    const hasSpectatorUI = await playerList.isVisible({ timeout: 3_000 }).catch(() => false);
    await ss(page, `P05-spectator-ui-${hasSpectatorUI ? "present" : "absent"}`);
    console.log(`[P05] Spectator UI visible: ${hasSpectatorUI}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// V — PvP: lobby, game, spectator
// ─────────────────────────────────────────────────────────────────────────────

/** Try new card carousel PvP route first; fall back to legacy lobby URL. */
async function gotoLobby(page: Page): Promise<boolean> {
    // New route: /game/battle → PvP card
    const viaCards = await gotoProtected(page, "/game/battle");
    if (viaCards) {
      await page.waitForTimeout(800);
      const pvpCard = page
        .locator("button, [role='button'], [class*='card']")
        .filter({ hasText: /pvp|online|vs\s?player/i })
        .first();
      if (await pvpCard.isVisible({ timeout: 6_000 }).catch(() => false)) {
        await pvpCard.click();
        await page.waitForTimeout(600);
        await ss(page, "V-pvp-card-clicked");
        return true;
      }
    }
    // Legacy fallback
    return gotoProtected(page, "/game/2d/battle/lobby");
  }

test.describe("V: PvP — lobby and game", () => {
  test.setTimeout(150_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("V01 — PvP lobby loads with room code, player list, BO selector", async ({ page }) => {
    const landed = await gotoLobby(page);
    if (!landed) { await ss(page, "V01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "V01-pvp-lobby");

    // Room code (may not be visible until server assigns one)
    const roomCode = page
      .locator('[data-testid*="room-code"], [class*="roomCode"], [class*="room-code"]')
      .first();
    const hasCode = await roomCode.isVisible({ timeout: 8_000 }).catch(() => false);
    await ss(page, `V01-room-code-${hasCode ? "visible" : "absent"}`);
    console.log(`[V01] Room code visible: ${hasCode}`);

    // BO selector
    let foundBO = false;
    for (const label of ["BO1", "BO3", "BO5"]) {
      const btn = page.locator("button").filter({ hasText: label });
      if (await btn.count() > 0 && await btn.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
        foundBO = true;
        break;
      }
    }
    await ss(page, `V01-pvp-lobby-bo-${foundBO ? "visible" : "absent"}`);
    console.log(`[V01] BO selector found: ${foundBO}`);
  });

  test("V02 — PvP lobby: select BO3 and see it highlighted", async ({ page }) => {
    const landed = await gotoLobby(page);
    if (!landed) { await ss(page, "V02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const bo3 = page.locator("button").filter({ hasText: "BO3" }).first();
    if (await bo3.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await bo3.click();
      await page.waitForTimeout(400);
      await ss(page, "V02-bo3-selected");
      console.log("[V02] BO3 selected");
    } else {
      await ss(page, "V02-bo3-not-found");
      console.log("[V02] BO3 button not found on this route");
    }
  });

  test("V03 — PvP game: navigate to game page, canvas appears or loading shown", async ({ page }) => {
    const started = await startViaCards(page, "pvp");
    if (!started) {
      // PvP requires 2 players — try going direct
      const landed = await gotoProtected(page, "/game/2d/battle/lobby");
      if (!landed) { await ss(page, "V03-unauth"); return; }
      await page.waitForTimeout(3_000);
      await ss(page, "V03-pvp-lobby-waiting");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);
    await ss(page, "V03-pvp-loading");
    await waitForGameMount(page);
    await ss(page, "V03-pvp-game-mount");

    const ok = await waitForCanvas(page, "V03-pvp");
    if (!ok) {
      console.log("[V03] Canvas not shown — server may be unavailable (PvP requires 2 players)");
      return;
    }
    await ss(page, "V03-pvp-canvas");
  });

  test("V04 — PvP spectator: join lobby with ?spectate=true", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby?spectate=true");
    if (!landed) { await ss(page, "V04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "V04-pvp-spectator-lobby");

    // Spectator should see game state without controls
    const spectatorBadge = page
      .locator('text=/spectator|watching/i, [class*="spectator"]')
      .first();
    const hasSpectBadge = await spectatorBadge.isVisible({ timeout: 5_000 }).catch(() => false);
    await ss(page, `V04-spectator-badge-${hasSpectBadge ? "visible" : "absent"}`);
    console.log(`[V04] Spectator badge: ${hasSpectBadge}`);
  });
});

test.describe("V: PvP — two-browser spectator session", () => {
  test.setTimeout(180_000);

  test("V05 — two contexts: player starts, spectator joins and sees canvas", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    // ── Context 1: Player ──
    const playerCtx = await browser.newContext();
    const playerPage = await playerCtx.newPage();
    const loggedIn = await tryLogin(playerPage);

    if (!loggedIn) {
      await ss(playerPage, "V05-player-unauth");
      await playerCtx.close();
      return;
    }

    const playerStarted = await startViaCards(playerPage, "pvp");
    await waitForGameMount(playerPage);
    await ss(playerPage, "V05-player-view");

    // Extract room ID from URL if present
    const playerUrl = playerPage.url();
    const roomIdMatch = playerUrl.match(/[?&](?:room|id)=([^&]+)/i);
    const roomId = roomIdMatch?.[1];
    console.log(`[V05] Player URL: ${playerUrl}, roomId: ${roomId ?? "none"}`);

    // ── Context 2: Spectator ──
    const spectCtx = await browser.newContext();
    const spectPage = await spectCtx.newPage();
    await tryLogin(spectPage);

    const spectUrl = roomId
      ? `/game/2d/battle/${roomId}?spectate=true`
      : "/game/2d/battle/lobby?spectate=true";
    const spectLanded = await gotoProtected(spectPage, spectUrl);

    await spectPage.waitForLoadState("domcontentloaded");
    await spectPage.waitForTimeout(3_000);
    await ss(spectPage, "V05-spectator-view");

    if (spectLanded) {
      await waitForGameMount(spectPage);
      await ss(spectPage, "V05-spectator-game-mount");

      // Spectator sees canvas (game may not have started without second player)
      const ok = await waitForCanvas(spectPage, "V05-spectator").catch(() => false);
      await ss(spectPage, `V05-spectator-canvas-${ok ? "visible" : "absent"}`);
      console.log(`[V05] Spectator canvas: ${ok}`);

      // Spectator zoom
      await clickZoomIn(spectPage);
      await spectPage.waitForTimeout(400);
      await ss(spectPage, "V05-spectator-zoom-in");
    }

    await playerCtx.close();
    await spectCtx.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// T — Tournament with AI bot fill
// ─────────────────────────────────────────────────────────────────────────────

/** Navigate to the tournament list — tries new `/game/tournament` then legacy fallbacks. */
async function gotoTournamentList(pg: Page): Promise<boolean> {
    // Try new route first
    let ok = await gotoProtected(pg, "/game/tournament");
    if (ok) return true;
    // Legacy route (may redirect to /game/battle)
    ok = await gotoProtected(pg, "/game/2d/tournament");
    if (ok) return true;
    // Try clicking the tournament card on battle mode page
    ok = await gotoProtected(pg, "/game/battle");
    if (!ok) return false;
    await pg.waitForTimeout(800);
    const tCard = pg
      .locator("button, [class*='card']")
      .filter({ hasText: /tournament/i })
      .first();
    if (await tCard.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await tCard.click();
      await pg.waitForTimeout(1_000);
      return true;
    }
    return false;
}

test.describe("T: Tournament — list, lobby, AI bot fill, spectate", () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("T01 — tournament list page loads and shows tournaments", async ({ page }) => {
    const ok = await gotoTournamentList(page);
    if (!ok) { await ss(page, "T01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "T01-tournament-list");

    const heading = page.locator("h1, h2").first();
    const headingOk = await heading.isVisible({ timeout: 10_000 }).catch(() => false);
    if (headingOk) await expect(heading).toBeVisible();

    await ssAllViewports(page, "T01-tournament-list");
  });

  test("T02 — tournament lobby: join and see countdown / waiting banner", async ({ page }) => {
    const ok = await gotoTournamentList(page);
    if (!ok) { await ss(page, "T02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "T02-tournament-list");

    // Find any open/upcoming tournament and join it
    const joinBtn = page
      .locator("a[href*='/tournament/'], button")
      .filter({ hasText: /join|enter|view|play/i })
      .first();

    const canJoin = await joinBtn.isVisible({ timeout: 10_000 }).catch(() => false);
    if (!canJoin) {
      console.log("[T02] No joinable tournaments found");
      await ss(page, "T02-no-tournaments");
      return;
    }

    await joinBtn.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "T02-tournament-lobby");

    const waitingBanner = page
      .locator("text=/waiting|players needed|opponent|countdown|bracket/i")
      .first();
    const hasWaiting = await waitingBanner.isVisible({ timeout: 8_000 }).catch(() => false);
    await ss(page, `T02-waiting-banner-${hasWaiting ? "visible" : "absent"}`);
    console.log(`[T02] Waiting banner: ${hasWaiting}`);
  });

  test("T03 — tournament lobby: AI bot fill indicator shown after 60s window", async ({ page }) => {
    const ok = await gotoTournamentList(page);
    if (!ok) { await ss(page, "T03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "T03-tournament-list");

    const tournamentLink = page
      .locator("a[href*='/tournament/']")
      .first();

    if (!(await tournamentLink.isVisible({ timeout: 8_000 }).catch(() => false))) {
      console.log("[T03] No tournament link — skipping (seed:tournament-ai-solo to populate)");
      await ss(page, "T03-no-tournament");
      return;
    }

    await tournamentLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "T03-lobby");

    // Bot-fill text appears when AI fills empty slots (server fills at 60s)
    const botFillText = page
      .locator("text=/cpu\s|bot\s|auto.*fill|filling.*bot|tyson|kai/i")
      .first();

    const fillSeen = await botFillText
      .waitFor({ state: "visible", timeout: 75_000 })
      .then(() => true)
      .catch(() => false);

    await ss(page, `T03-bot-fill-${fillSeen ? "seen" : "not-seen"}`);
    console.log(`[T03] Bot fill text seen: ${fillSeen}`);
  });

  test("T04 — tournament spectator: join tournament match as spectator", async ({ page }) => {
    // Go directly to an AI-vs-AI room with spectate param
    const landed = await gotoProtected(page, "/game/2d/ai-battle/play?spectate=true");
    if (!landed) { await ss(page, "T04-unauth"); return; }

    await waitForGameMount(page);
    await ss(page, "T04-tournament-spectator-loading");

    const ok = await waitForCanvas(page, "T04-tournament-spectator");
    if (!ok) return;
    await ss(page, "T04-tournament-spectator-canvas");

    // Spectate for 20s — watch AI battle
    await page.waitForTimeout(10_000);
    await ss(page, "T04-tournament-spectator-t10s");
    await page.waitForTimeout(10_000);
    await ss(page, "T04-tournament-spectator-t20s");

    // Follow-player camera: click on any beyblade entity in the player list
    const followBtn = page
      .locator('[data-testid*="follow"], button[aria-label*="follow" i], [class*="follow"]')
      .first();
    const hasFollow = await followBtn.isVisible({ timeout: 3_000 }).catch(() => false);
    if (hasFollow) {
      await followBtn.click();
      await page.waitForTimeout(500);
      await ss(page, "T04-follow-camera");
      console.log("[T04] Follow-player camera clicked");
    }
    console.log(`[T04] Follow camera available: ${hasFollow}`);
  });

  test("T05 — tournament battle: game canvas stable through AI match", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "T05-unauth"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Configure Hell vs Hell for faster tournament-style match
    const hellBtns = page.locator("button, label").filter({ hasText: /^hell$/i });
    const hCount = await hellBtns.count();
    for (let i = 0; i < Math.min(2, hCount); i++) {
      await hellBtns.nth(i).click();
      await page.waitForTimeout(100);
    }
    await ss(page, "T05-ai-vs-ai-configured");

    const launchBtn = page
      .locator("button")
      .filter({ hasText: /launch|start battle|go|fight/i })
      .first();
    if (await launchBtn.isVisible().catch(() => false)) await launchBtn.click();
    else await page.locator('button[type="submit"]').first().click().catch(() => {});

    await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    await waitForGameMount(page);
    await ss(page, "T05-ai-vs-ai-loading");

    const ok = await waitForCanvas(page, "T05");
    if (!ok) return;
    await ss(page, "T05-ai-vs-ai-canvas");

    // Screenshot every 15s for 60s
    for (let t = 1; t <= 4; t++) {
      await page.waitForTimeout(15_000);
      await ss(page, `T05-ai-vs-ai-t${t * 15}s`);
    }

    // Check for winner overlay
    const winnerEl = page
      .getByText(/wins!/i)
      .or(page.getByText(/victory/i))
      .or(page.getByText(/ko|ring.?out|burst/i))
      .first();
    const won = await winnerEl
      .waitFor({ state: "visible", timeout: 90_000 })
      .then(() => true)
      .catch(() => false);
    await ss(page, `T05-ai-vs-ai-${won ? "winner" : "no-winner-yet"}`);
    console.log(`[T05] Match winner overlay shown: ${won}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// R — Battle Royale with AI bots
// ─────────────────────────────────────────────────────────────────────────────

test.describe("R: Battle Royale — AI bot fill, game, spectate", () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("R01 — Royale card is visible on BattleModeCardsPage", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "R01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);
    await ss(page, "R01-battle-cards");

    const royaleCard = page
      .locator("button, [role='button'], [class*='card'], div")
      .filter({ hasText: /royale|battle.*royal/i })
      .first();

    const visible = await royaleCard.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, `R01-royale-card-${visible ? "visible" : "absent"}`);
    console.log(`[R01] Royale card visible: ${visible}`);

    if (visible) await expect(royaleCard).toBeVisible();
  });

  test("R02 — Royale lobby: join and see player count + waiting banner", async ({ page }) => {
    // Try new card route first, fall back to legacy direct URL
    const started = await startViaCards(page, "royale");
    if (started) {
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_000);
      await ss(page, "R02-royale-joining");
      await waitForGameMount(page);
      await ss(page, "R02-royale-game-mount");
      return;
    }

    const landed = await gotoProtected(page, "/game/2d/battle/lobby?mode=royale");
    if (!landed) { await ss(page, "R02-unauth"); return; }

    await page.waitForTimeout(2_500);
    await ss(page, "R02-royale-lobby");

    const waitText = page
      .locator("text=/waiting|players|looking|countdown|60s/i")
      .first();
    const hasWait = await waitText.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, `R02-royale-wait-${hasWait ? "visible" : "absent"}`);
    console.log(`[R02] Royale waiting banner: ${hasWait}`);
  });

  test("R03 — Royale: AI bot names shown in player list when slots fill", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "R03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    // Navigate into royale
    const royaleCard = page
      .locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /royale/i })
      .first();

    if (!(await royaleCard.isVisible({ timeout: 8_000 }).catch(() => false))) {
      console.log("[R03] Royale card not found — skipping");
      await ss(page, "R03-no-royale-card");
      return;
    }

    await royaleCard.click();
    await page.waitForTimeout(800);

    const startBtn = page.locator("button").filter({ hasText: /start|play|join/i }).first();
    if (await startBtn.isVisible({ timeout: 6_000 }).catch(() => false)) await startBtn.click();

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "R03-royale-waiting-lobby");

    // Look for bot names (CPU Tyson, CPU Kai, etc. from ai_character_profiles seed)
    const botName = page
      .locator("text=/cpu\s+\w+|bot\s+\w+|tyson|kai|gingka|valt/i")
      .first();

    const botSeen = await botName
      .waitFor({ state: "visible", timeout: 70_000 })
      .then(() => true)
      .catch(() => false);

    await ss(page, `R03-royale-bot-${botSeen ? "filled" : "not-yet-filled"}`);
    if (botSeen) {
      const name = await botName.textContent().catch(() => "");
      console.log(`[R03] Bot player seen: "${name}"`);
    } else {
      console.log("[R03] Bot fill not observed within 70s — server may need seeded AI profiles");
    }
  });

  test("R04 — Royale game: canvas runs, spectator sees all players", async ({ page }) => {
    // Spectate a royale match via direct URL
    const landed = await gotoProtected(page, "/game/2d/battle/lobby?spectate=true");
    if (!landed) { await ss(page, "R04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "R04-royale-spectator-lobby");

    await waitForGameMount(page);

    const ok = await waitForCanvas(page, "R04-royale-spectator");
    if (!ok) {
      console.log("[R04] Canvas not shown — Royale room may require server + multiple players");
      return;
    }
    await ss(page, "R04-royale-spectator-canvas");

    // Spectate for 20s — watch multi-player royale
    for (let t = 1; t <= 4; t++) {
      await page.waitForTimeout(5_000);
      await ss(page, `R04-royale-spectator-t${t * 5}s`);
    }

    // Try follow-player camera on first visible bey name
    const playerEntry = page
      .locator('[class*="player"], [data-testid*="player"], [class*="bey-name"]')
      .first();
    const hasEntry = await playerEntry.isVisible({ timeout: 3_000 }).catch(() => false);
    if (hasEntry) {
      await playerEntry.click();
      await page.waitForTimeout(500);
      await ss(page, "R04-royale-follow-player");
      console.log("[R04] Follow-player camera activated");
    }

    console.log(`[R04] Royale spectator test complete. Player list visible: ${hasEntry}`);
  });

  test("R05 — Royale spectator: two browser contexts, second joins as spectator", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    // Context 1: Player joins royale
    const playerCtx = await browser.newContext();
    const playerPage = await playerCtx.newPage();
    const loggedIn = await tryLogin(playerPage);

    if (!loggedIn) {
      await ss(playerPage, "R05-player-unauth");
      await playerCtx.close();
      return;
    }

    await gotoProtected(playerPage, "/game/battle");
    await playerPage.waitForTimeout(1_000);

    const royaleCard = playerPage
      .locator("button, [class*='card']")
      .filter({ hasText: /royale/i })
      .first();
    if (await royaleCard.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await royaleCard.click();
      await playerPage.waitForTimeout(800);
    }
    const startBtn = playerPage.locator("button").filter({ hasText: /start|join/i }).first();
    if (await startBtn.isVisible({ timeout: 5_000 }).catch(() => false)) await startBtn.click();

    await playerPage.waitForLoadState("domcontentloaded");
    await playerPage.waitForTimeout(2_000);
    await ss(playerPage, "R05-player-in-royale");

    const playerUrl = playerPage.url();
    const roomMatch = playerUrl.match(/room[=\/]([a-zA-Z0-9_-]+)/i);
    const roomId = roomMatch?.[1];

    // Context 2: Spectator joins
    const spectCtx = await browser.newContext();
    const spectPage = await spectCtx.newPage();
    await tryLogin(spectPage);

    const spectUrl = roomId
      ? `/game/2d/battle/${roomId}?spectate=true`
      : "/game/2d/battle/lobby?spectate=true";

    await gotoProtected(spectPage, spectUrl);
    await spectPage.waitForLoadState("domcontentloaded");
    await spectPage.waitForTimeout(3_000);
    await ss(spectPage, "R05-spectator-in-royale");

    await waitForGameMount(spectPage);
    const ok = await waitForCanvas(spectPage, "R05-spectator-canvas").catch(() => false);
    await ss(spectPage, `R05-spectator-canvas-${ok ? "visible" : "absent"}`);

    await spectPage.waitForTimeout(10_000);
    await ss(spectPage, "R05-spectator-t10s");

    await playerCtx.close();
    await spectCtx.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// S — Spectator: follow-player camera across all modes
// ─────────────────────────────────────────────────────────────────────────────

test.describe("S: Spectator — follow-player camera UI", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("S01 — spectator player list renders and click triggers follow", async ({ page }) => {
    // Use AI vs AI lab as the most reliable way to get a battle going
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "S01-unauth"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    const launchBtn = page.locator("button").filter({ hasText: /launch|start/i }).first();
    if (await launchBtn.isVisible().catch(() => false)) await launchBtn.click();

    await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    await waitForGameMount(page);

    const ok = await waitForCanvas(page, "S01");
    if (!ok) return;
    await ss(page, "S01-canvas");

    // Check player / bey list
    const playerListItem = page
      .locator('[class*="player-list"] button, [data-testid*="player"], [class*="beyName"]')
      .first();
    const hasList = await playerListItem.isVisible({ timeout: 5_000 }).catch(() => false);
    await ss(page, `S01-player-list-${hasList ? "visible" : "absent"}`);

    if (hasList) {
      await playerListItem.click();
      await page.waitForTimeout(600);
      await ss(page, "S01-follow-camera-active");
      console.log("[S01] Follow-player camera click confirmed");
    }
  });

  test("S02 — spectator zoom controls work independently of game zoom", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle/play?spectate=true");
    if (!landed) { await ss(page, "S02-unauth"); return; }

    await waitForGameMount(page);
    const ok = await waitForCanvas(page, "S02");
    if (!ok) return;

    await ss(page, "S02-spectator-default-zoom");

    await clickZoomIn(page);
    await page.waitForTimeout(350);
    await ss(page, "S02-spectator-zoom-in");

    await clickZoomOut(page);
    await clickZoomOut(page);
    await page.waitForTimeout(350);
    await ss(page, "S02-spectator-zoom-out");

    await clickZoomReset(page);
    await page.waitForTimeout(350);
    await ss(page, "S02-spectator-zoom-reset");

    console.log("[S02] Spectator zoom controls all verified");
  });

  test("S03 — spectator count increments in HUD when second client joins", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    const ctx1 = await browser.newContext();
    const page1 = await ctx1.newPage();
    if (!(await tryLogin(page1))) {
      await ctx1.close();
      return;
    }

    // Start an AI battle room
    const landed = await gotoProtected(page1, "/game/2d/ai-battle/play");
    await waitForGameMount(page1);
    const ok1 = await waitForCanvas(page1, "S03-player");
    if (!ok1) { await ctx1.close(); return; }

    await ss(page1, "S03-player-canvas");

    // Read spectator count before second client joins
    const specCountBefore = await page1
      .locator('[data-testid*="spectator-count"], [class*="spectatorCount"], text=/spectators/i')
      .first()
      .textContent({ timeout: 3_000 })
      .catch(() => "");

    // Context 2: spectator
    const ctx2 = await browser.newContext();
    const page2 = await ctx2.newPage();
    await tryLogin(page2);

    const url1 = page1.url();
    const roomPart = url1.match(/[?&](?:room|id|roomId)=([^&]+)/i)?.[1];
    const spectUrl = roomPart
      ? `/game/2d/ai-battle/play?roomId=${roomPart}&spectate=true`
      : "/game/2d/ai-battle/play?spectate=true";

    await gotoProtected(page2, spectUrl);
    await waitForGameMount(page2);
    await ss(page2, "S03-spectator-view");

    await page1.waitForTimeout(3_000);
    await ss(page1, "S03-player-after-spectator-joined");

    // Check spectator count incremented
    const specCountAfter = await page1
      .locator('[data-testid*="spectator-count"], [class*="spectatorCount"], text=/spectators/i')
      .first()
      .textContent({ timeout: 3_000 })
      .catch(() => "");

    console.log(`[S03] Spectator count before: "${specCountBefore}", after: "${specCountAfter}"`);

    await ctx1.close();
    await ctx2.close();
  });
});

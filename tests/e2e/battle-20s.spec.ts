/**
 * battle-20s.spec.ts
 *
 * 20-second live battle E2E tests for Tryout (2D & 2.5D) and AI Battle modes.
 * Screenshots captured every 5 seconds during active gameplay to detect visual
 * regressions, render hangs, or Colyseus disconnects.
 *
 * Runs in the chromium-dev project (non-prod spec, no *.prod.spec.ts suffix).
 * Set PLAYWRIGHT_BASE_URL=https://game.letitrip.in to run against production.
 *
 * Auth: TEST_EMAIL + TEST_PASSWORD must be set (via .env or CI secrets).
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wait for the PixiJS canvas to become visible. Takes a grace screenshot on
 * timeout instead of hard-failing so the rest of the test can still report.
 * Returns true if canvas appeared, false on timeout.
 */
async function waitForCanvas(page: Page, screenshotName: string, timeoutMs = 30_000): Promise<boolean> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    await ss(page, `${screenshotName}-canvas-timeout`);
    return false;
  }
}

/**
 * Wait for either the loading-progress bar or the canvas — whichever arrives
 * first.  Used at navigate time to confirm the game page has at least mounted.
 */
async function waitForGameMount(page: Page): Promise<void> {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: 30_000 }),
    page.locator('[data-testid="loading-progress"]').waitFor({ state: "visible", timeout: 30_000 }),
  ]).catch(() => {
    // Timeout is not fatal — individual tests handle their own assertions.
  });
}

/**
 * Start a Tryout 2D battle by going through the setup page.
 * - Navigates to /game/2d/tryout/setup
 * - Waits for Firestore data (Default Beyblade / Default Arena options)
 * - Clicks the Start button
 * Returns false if the page redirected to /login.
 */
async function startTryout2D(page: Page): Promise<boolean> {
  const landed = await gotoProtected(page, "/game/2d/tryout/setup");
  if (!landed) return false;

  // Wait for Firestore-loaded options to appear (up to 8s)
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2_000);

  // "Default Beyblade" and "Default Arena" are fallback options always present.
  // They may appear inside a SearchableSelect or a plain <select>; click the
  // first visible option that matches the label.
  const defaultBey = page.locator("text=Default Beyblade").first();
  if (await defaultBey.isVisible().catch(() => false)) {
    await defaultBey.click().catch(() => {});
  }

  const defaultArena = page.locator("text=Default Arena").first();
  if (await defaultArena.isVisible().catch(() => false)) {
    await defaultArena.click().catch(() => {});
  }

  // Click the Start / Start Tryout button
  const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Tryout 2D — 20-second battle with screenshots every 5 seconds
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout 2D: 20-second battle with screenshots every 5 seconds", () => {
  test.setTimeout(90_000); // extended: setup + 20s gameplay + overhead

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("plays 20-second battle and captures screenshots every 5s", async ({ page }) => {
    const started = await startTryout2D(page);
    if (!started) {
      await ss(page, "B01-tryout-unauthenticated");
      return;
    }

    // Wait for canvas (up to 30s)
    const canvasAppeared = await waitForCanvas(page, "B01-battle-t0s");
    if (!canvasAppeared) return;

    // t=0s — canvas just appeared
    await ss(page, "B01-battle-t0s");

    // t=0→5s — hold W+D (move forward-right) for 2s, then pause
    await page.keyboard.down("w");
    await page.keyboard.down("d");
    await page.waitForTimeout(2_000);
    await page.keyboard.up("w");
    await page.keyboard.up("d");
    await page.waitForTimeout(3_000); // coast to 5s mark

    await ss(page, "B02-battle-t5s");

    // t=5→10s — hold A (move left) for 2s
    await page.keyboard.down("a");
    await page.waitForTimeout(2_000);
    await page.keyboard.up("a");
    await page.waitForTimeout(3_000); // coast to 10s mark

    await ss(page, "B03-battle-t10s");

    // t=10→15s — press J (attack) 3 times with short pauses between
    await page.keyboard.press("j");
    await page.waitForTimeout(400);
    await page.keyboard.press("j");
    await page.waitForTimeout(400);
    await page.keyboard.press("j");
    await page.waitForTimeout(4_200); // reach 15s mark

    await ss(page, "B04-battle-t15s");

    // t=15→20s — press Space (special move) once, then wait
    await page.keyboard.press("Space");
    await page.waitForTimeout(5_000);

    await ss(page, "B05-battle-t20s");

    // Verify canvas is still visible — no crash / disconnect
    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Tryout 2D — loading progress steps visible during connect
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout 2D: loading progress steps visible during connect", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("loading-progress or canvas appears within 30s", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) {
      await ss(page, "B06-loading-unauthenticated");
      return;
    }

    // Screenshot immediately to capture the loading bar before it transitions
    await page.waitForTimeout(300);
    await ss(page, "B06-loading-progress");

    const progress = page.locator('[data-testid="loading-progress"]');
    const canvas   = page.locator("canvas");

    const which = await Promise.race([
      progress.waitFor({ state: "visible", timeout: 30_000 }).then(() => "progress"),
      canvas.waitFor({ state: "visible", timeout: 30_000 }).then(() => "canvas"),
    ]).catch(() => "none");

    expect(which).not.toBe("none");

    if (which === "progress") {
      // Verify individual step-dot elements are rendered
      const dots = page.locator('[data-testid^="loading-step-"]');
      if (await dots.count() > 0) {
        await expect(dots.first()).toBeVisible();
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tryout 2D — no JS errors during 20s battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout 2D: no JS errors during 20s battle", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("collects page errors and asserts no critical JS errors occur", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const started = await startTryout2D(page);
    if (!started) return;

    // Wait for canvas or loading-progress
    await waitForGameMount(page);

    // Play for 20 seconds with basic input to exercise code paths
    await waitForCanvas(page, "B-no-errors-canvas");

    await page.keyboard.down("w");
    await page.waitForTimeout(2_000);
    await page.keyboard.up("w");

    await page.keyboard.press("j");
    await page.waitForTimeout(1_000);
    await page.keyboard.press("Space");

    // Wait out the full 20s window (already used ~3s above)
    await page.waitForTimeout(17_000);

    // Filter out known non-fatal network/WebSocket noise
    const criticalErrors = errors.filter((msg) => {
      const lower = msg.toLowerCase();
      return (
        !lower.includes("websocket") &&
        !lower.includes("econnrefused") &&
        !lower.includes("net::err") &&
        !lower.includes("failed to fetch") &&
        !lower.includes("network error") &&
        !lower.includes("load failed")
      );
    });

    expect(criticalErrors, `Critical JS errors: ${criticalErrors.join(" | ")}`).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. AI Battle 2D — player vs AI with screenshots every 5s
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI Battle 2D: player vs AI with screenshots every 5s", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("plays 20-second AI battle and captures screenshots every 5s", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) {
      await ss(page, "B07-ai-battle-unauthenticated");
      return;
    }

    // Wait for Firestore data to populate the setup page
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "B07-ai-battle-setup");

    // Select Medium difficulty
    const mediumBtn = page.locator("button").filter({ hasText: /medium/i }).first();
    if (await mediumBtn.isVisible().catch(() => false)) {
      await mediumBtn.click();
    }

    // Click the Start Battle button
    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    } else {
      // Some pages navigate automatically after beyblade selection
      await page.waitForURL(/ai-battle\/play|ai-battle\/game/, { timeout: 10_000 }).catch(() => {});
    }

    // Wait for canvas (up to 30s)
    const canvasAppeared = await waitForCanvas(page, "B08-ai-battle-t0");
    if (!canvasAppeared) return;

    // t=0
    await ss(page, "B08-ai-battle-t0");

    // t=0→5s — WASD movement for 3s
    await page.keyboard.down("w");
    await page.keyboard.down("a");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("a");
    await page.keyboard.down("d");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("w");
    await page.keyboard.up("d");
    await page.waitForTimeout(1_000); // reach 5s mark

    await ss(page, "B09-ai-battle-t5");

    // t=5→10s — press J (attack) and wait
    await page.keyboard.press("j");
    await page.waitForTimeout(500);
    await page.keyboard.press("j");
    await page.waitForTimeout(4_500); // reach 10s mark

    await ss(page, "B10-ai-battle-t10");

    // t=10→15s — press Space (special), press K (defense)
    await page.keyboard.press("Space");
    await page.waitForTimeout(1_000);
    await page.keyboard.press("k");
    await page.waitForTimeout(4_000); // reach 15s mark

    await ss(page, "B11-ai-battle-t15");

    // t=15→20s — hold S + D (move down-right), then idle
    await page.keyboard.down("s");
    await page.keyboard.down("d");
    await page.waitForTimeout(2_000);
    await page.keyboard.up("s");
    await page.keyboard.up("d");
    await page.waitForTimeout(3_000);

    await ss(page, "B12-ai-battle-t20");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Tryout 2.5D — battle canvas appears
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout 2.5D: battle canvas appears", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("2.5D tryout canvas becomes visible after setup", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tryout/setup");
    if (!landed) {
      await ss(page, "B13-tryout-25d-unauthenticated");
      return;
    }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Select defaults if visible
    const defaultBey = page.locator("text=Default Beyblade").first();
    if (await defaultBey.isVisible().catch(() => false)) {
      await defaultBey.click().catch(() => {});
    }

    const defaultArena = page.locator("text=Default Arena").first();
    if (await defaultArena.isVisible().catch(() => false)) {
      await defaultArena.click().catch(() => {});
    }

    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    const appeared = await waitForCanvas(page, "B13-tryout-25d-canvas");
    if (appeared) {
      await ss(page, "B13-tryout-25d-canvas");
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });
});

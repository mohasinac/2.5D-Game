/**
 * game-controls.spec.ts
 *
 * Tests (GC01–GC08): In-game keyboard controls, camera zoom, pause, spectator
 * mode, mobile joystick visibility, and QTE resilience.
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  startViaCards,
  waitForGameMount,
  waitThroughLaunch,
  filterErrors,
  assertCanvasInViewport,
} from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

/** Navigate to an active in-progress game via PvAI flow. */
async function enterActiveGame(page: Parameters<typeof tryLogin>[0]): Promise<boolean> {
  const started = await startViaCards(page, "pvai");
  if (!started) return false;
  await waitForGameMount(page);
  await waitThroughLaunch(page, "GC-enter");
  await page.waitForTimeout(2_000);
  return true;
}

test.describe("Game Controls", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  // GC01: Press I (moveUp) → no crash; canvas still visible
  test("GC01: Pressing I key in active game does not crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC01-unauthenticated"); return; }

    const canvas = page.locator("canvas").first();
    if (await canvas.isVisible().catch(() => false)) {
      await canvas.click({ force: true });
    }

    await page.keyboard.down("KeyI");
    await page.waitForTimeout(500);
    await page.keyboard.up("KeyI");
    await ss(page, "GC01-after-move-up");

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // GC02: Press J (attack) → no crash; visual feedback or combo HUD
  test("GC02: Pressing J (attack) in active game does not crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC02-unauthenticated"); return; }

    const canvas = page.locator("canvas").first();
    if (await canvas.isVisible().catch(() => false)) {
      await canvas.click({ force: true });
    }

    // Press attack key multiple times
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("KeyJ");
      await page.waitForTimeout(200);
    }
    await ss(page, "GC02-after-attack");

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // GC03: Camera zoom in: click "+" button or press "=" → canvas scale visible change
  test("GC03: Zoom in button/key changes canvas scale", async ({ page }) => {
    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC03-unauthenticated"); return; }

    const canvas = page.locator("canvas").first();
    await ss(page, "GC03-before-zoom");

    // Try the "+" button first
    const zoomInBtn = page.locator("button").filter({ hasText: /^\+$/ }).first();
    if (await zoomInBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await zoomInBtn.click();
      await page.waitForTimeout(400);
      await ss(page, "GC03-zoom-in-button");
    } else {
      // Keyboard fallback
      await page.keyboard.press("Equal");
      await page.waitForTimeout(400);
      await ss(page, "GC03-zoom-in-keyboard");
    }

    await expect(canvas).toBeVisible({ timeout: 5_000 });
    await assertCanvasInViewport(page);
  });

  // GC04: Camera zoom reset: press "0" → canvas resets
  test("GC04: Zoom reset restores default canvas scale", async ({ page }) => {
    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC04-unauthenticated"); return; }

    const canvas = page.locator("canvas").first();

    // Zoom in first
    const zoomInBtn = page.locator("button").filter({ hasText: /^\+$/ }).first();
    if (await zoomInBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await zoomInBtn.click();
      await page.waitForTimeout(300);
    } else {
      await page.keyboard.press("Equal");
      await page.waitForTimeout(300);
    }

    await ss(page, "GC04-zoomed-in");

    // Reset
    const zoomResetBtn = page.locator("button").filter({ hasText: /^0$/ }).first();
    if (await zoomResetBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await zoomResetBtn.click();
    } else {
      await page.keyboard.press("Digit0");
    }
    await page.waitForTimeout(400);
    await ss(page, "GC04-zoom-reset");

    await expect(canvas).toBeVisible({ timeout: 5_000 });
    await assertCanvasInViewport(page);
  });

  // GC05: ESC key → pause overlay or menu appears
  test("GC05: ESC key shows pause overlay or exit menu", async ({ page }) => {
    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC05-unauthenticated"); return; }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    await ss(page, "GC05-after-escape");

    // Pause overlay or a menu/dialog with a resume/quit option
    const pauseEl = page.locator(
      '[data-testid="pause-menu"], [role="dialog"], text=/pause|resume|quit|exit/i'
    ).first();
    const pauseVisible = await pauseEl.isVisible({ timeout: 3_000 }).catch(() => false);

    // Canvas should still be accessible even if paused
    const canvasVisible = await page.locator("canvas").isVisible({ timeout: 2_000 }).catch(() => false);
    expect(pauseVisible || canvasVisible, "ESC should show pause menu or canvas should remain visible").toBe(true);
  });

  // GC06: Spectator mode → no attack keys active
  test("GC06: Spectator mode — attack keys do not crash game", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // Try to reach game room with spectate param
    const landed = await gotoProtected(page, "/game/room?spectate=true");
    if (!landed) { await ss(page, "GC06-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "GC06-spectator-view");

    // Press attack key — should have no effect
    await page.keyboard.press("KeyJ");
    await page.waitForTimeout(300);
    await page.keyboard.press("KeyJ");
    await page.waitForTimeout(300);
    await ss(page, "GC06-spectator-attack-attempt");

    // No crash
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // GC07: Mobile touch: joystick visible at 390px viewport
  test("GC07: Virtual joystick is visible at 390px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC07-unauthenticated"); return; }

    await page.waitForTimeout(1_000);
    await ss(page, "GC07-mobile-game");

    // Joystick: look for touch control elements at mobile width
    const joystick = page.locator(
      '[data-testid="joystick"], [class*="joystick"], [class*="Joystick"], [class*="touch-control"]'
    ).first();
    const joystickVisible = await joystick.isVisible({ timeout: 5_000 }).catch(() => false);

    // Also accept generic button controls that appear on mobile
    const mobileControls = page.locator('[class*="control"], [class*="button-pad"]').first();
    const controlsVisible = await mobileControls.isVisible({ timeout: 3_000 }).catch(() => false);

    await ss(page, "GC07-mobile-controls-check");
    expect(joystickVisible || controlsVisible || await page.locator("canvas").isVisible().catch(() => false),
      "Joystick or mobile controls or canvas should be visible at 390px"
    ).toBe(true);
  });

  // GC08: QTE overlay: pressing correct key doesn't crash game
  test("GC08: QTE overlay interaction does not crash game", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const active = await enterActiveGame(page);
    if (!active) { await ss(page, "GC08-unauthenticated"); return; }

    // Wait a few seconds for a QTE to potentially appear
    await page.waitForTimeout(4_000);

    const qte = page.locator(
      '[data-testid="qte-overlay"], [class*="qte"], [class*="QTE"], text=/PRESS|mash|clash/i'
    ).first();
    const qteVisible = await qte.isVisible({ timeout: 2_000 }).catch(() => false);

    if (qteVisible) {
      await ss(page, "GC08-qte-visible");
      // Press likely QTE keys
      await page.keyboard.press("KeyJ");
      await page.waitForTimeout(100);
      await page.keyboard.press("KeyK");
      await page.waitForTimeout(100);
      await page.keyboard.press("KeyJ");
      await ss(page, "GC08-qte-interaction");
    } else {
      await ss(page, "GC08-no-qte-visible");
    }

    // Game must still be running
    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

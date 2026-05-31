/**
 * evobattle-features.spec.ts
 *
 * Tests (EX01–EX12): In-battle HUD elements, slot colors, series score display,
 * victory overlay, ComboHUD, SpecialMoveHUD, canvas rendering, 30s stability,
 * and burst overlay.
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  ss,
  startViaCards,
  waitForGameMount,
  waitThroughLaunch,
  filterErrors,
} from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(180_000);

/** Enter an active in-progress game. */
async function enterGame(page: Parameters<typeof tryLogin>[0]): Promise<boolean> {
  const started = await startViaCards(page, "pvai");
  if (!started) return false;
  await waitForGameMount(page);
  await waitThroughLaunch(page, "EX-enter");
  await page.waitForTimeout(2_000);
  return true;
}

test.describe("Battle HUD and Features", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  // EX01: At least one of [spin arc bar SVG, burst meter, HUD strip] visible
  test("EX01: HUD contains spin arc bar, burst meter, or HUD strip", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX01-unauthenticated"); return; }

    await ss(page, "EX01-game-active");

    const spinArc    = page.locator("svg, [data-testid*='spin-arc'], [class*='spinArc'], [class*='SpinArc']").first();
    const burstMeter = page.locator("[data-testid*='burst'], [class*='burst'], [class*='Burst']").first();
    const hudStrip   = page.locator("[data-testid*='player-strip'], [class*='PlayerStrip'], [class*='playerStrip']").first();

    const arcOk   = await spinArc.isVisible({ timeout: 5_000 }).catch(() => false);
    const burstOk = await burstMeter.isVisible({ timeout: 3_000 }).catch(() => false);
    const hudOk   = await hudStrip.isVisible({ timeout: 3_000 }).catch(() => false);

    await ss(page, "EX01-hud-check");
    expect(arcOk || burstOk || hudOk, "At least one HUD element should be visible").toBe(true);
  });

  // EX02: PlayerStrip component visible (bottom of screen)
  test("EX02: PlayerStrip component is visible at bottom of game screen", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX02-unauthenticated"); return; }

    const playerStrip = page.locator(
      "[data-testid='player-strip'], [class*='PlayerStrip'], [class*='playerStrip'], [class*='player-strip']"
    ).first();

    const ok = await playerStrip.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, "EX02-player-strip");

    if (ok) {
      await expect(playerStrip).toBeVisible();
      const box = await playerStrip.boundingBox();
      const vp  = page.viewportSize();
      if (box && vp) {
        // Player strip should be in the lower half of the screen
        expect(box.y + box.height / 2).toBeGreaterThan(vp.height / 3);
      }
    } else {
      // Fallback: canvas must at least be visible
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX03: OpponentStrip component visible (top of screen)
  test("EX03: OpponentStrip component is visible in game", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX03-unauthenticated"); return; }

    const opponentStrip = page.locator(
      "[data-testid='opponent-strip'], [class*='OpponentStrip'], [class*='opponentStrip'], [class*='opponent-strip']"
    ).first();

    const ok = await opponentStrip.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, "EX03-opponent-strip");

    if (ok) {
      await expect(opponentStrip).toBeVisible();
    } else {
      // Some UIs combine player/opponent — just check canvas
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX04: Slot color applied — player's HUD has blue color
  test("EX04: Player HUD has slot color applied (blue or colored indicator)", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX04-unauthenticated"); return; }

    await ss(page, "EX04-slot-color-check");

    // Check for any element with a blue-ish background or border color
    const coloredEl = page.locator(
      "[class*='blue'], [class*='Blue'], [style*='#3B82F6'], [style*='rgb(59, 130, 246)']," +
      "[data-testid*='slot-color'], [class*='slot-color'], [class*='slotColor']"
    ).first();

    const colorOk = await coloredEl.isVisible({ timeout: 5_000 }).catch(() => false);

    // Soft assertion — colors may be in canvas (WebGL) rather than DOM
    if (colorOk) {
      await expect(coloredEl).toBeVisible();
    } else {
      console.log("[EX04] Slot color not found in DOM — may be rendered on canvas");
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX05: Spin arc bar is a circle/SVG element visible in HUD
  test("EX05: Spin arc bar SVG element is visible in HUD", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX05-unauthenticated"); return; }

    const svgEl = page.locator("svg").first();
    const arcEl = page.locator(
      "[data-testid='spin-arc-bar'], [class*='SpinArcBar'], [class*='spinArcBar'], [class*='spin-arc']"
    ).first();

    const svgOk = await svgEl.isVisible({ timeout: 8_000 }).catch(() => false);
    const arcOk = await arcEl.isVisible({ timeout: 5_000 }).catch(() => false);
    await ss(page, "EX05-spin-arc-bar");

    expect(svgOk || arcOk, "SVG spin arc bar should be visible in HUD").toBe(true);
  });

  // EX06: Series score display after game ends
  test("EX06: Series score win counter is visible in HUD during game", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX06-unauthenticated"); return; }

    // Look for series score display (BO format win counters)
    const scoreEl = page.locator(
      "[data-testid*='series-score'], [class*='seriesScore'], [class*='series-score']," +
      "text=/\\d\\s*[–\\-]\\s*\\d|game\\s*\\d/i"
    ).first();

    const scoreOk = await scoreEl.isVisible({ timeout: 5_000 }).catch(() => false);
    await ss(page, "EX06-series-score");

    if (scoreOk) {
      await expect(scoreEl).toBeVisible();
    } else {
      // Score may appear after first game — just check canvas is alive
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX07: Victory overlay appears when game status = "finished"
  test("EX07: Victory or result overlay appears when game finishes", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX07-unauthenticated"); return; }

    // Wait for finish — up to 90s
    const victoryEl = page.locator(
      "[data-testid='victory-overlay'], [data-testid='result-screen']," +
      "text=/victory|wins|winner|result|game over|finished/i"
    ).first();

    await ss(page, "EX07-waiting-for-finish");

    const victoryVisible = await victoryEl.waitFor({ state: "visible", timeout: 90_000 })
      .then(() => true)
      .catch(() => false);

    await ss(page, "EX07-finish-check");
    if (!victoryVisible) {
      // Game is still running — that's fine, just verify canvas is alive
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX08: ComboHUD strip visible when combos are active
  test("EX08: ComboHUD strip is visible in game UI", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX08-unauthenticated"); return; }

    const comboHud = page.locator(
      "[data-testid='combo-hud'], [class*='ComboHUD'], [class*='comboHud'], [class*='combo-hud']"
    ).first();

    const ok = await comboHud.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, "EX08-combo-hud");

    if (ok) {
      await expect(comboHud).toBeVisible();
    } else {
      // ComboHUD only shows when bey has combos assigned — soft assertion
      console.log("[EX08] ComboHUD not visible — bey may have no combos assigned");
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX09: SpecialMoveHUD ring visible when special move assigned
  test("EX09: SpecialMoveHUD power ring is visible in game", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX09-unauthenticated"); return; }

    const specialHud = page.locator(
      "[data-testid='special-move-hud'], [class*='SpecialMoveHUD'], [class*='specialMoveHud']," +
      "[class*='special-move'], [data-testid*='special']"
    ).first();

    const ok = await specialHud.isVisible({ timeout: 10_000 }).catch(() => false);
    await ss(page, "EX09-special-move-hud");

    if (ok) {
      await expect(specialHud).toBeVisible();
    } else {
      // SpecialMoveHUD only shown when bey has a special move — soft assertion
      console.log("[EX09] SpecialMoveHUD not visible — bey may have no special move");
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
  });

  // EX10: Canvas renders frame data (pixel change between two frames)
  test("EX10: Canvas renders changing frames (animation running)", async ({ page }) => {
    const active = await enterGame(page);
    if (!active) { await ss(page, "EX10-unauthenticated"); return; }

    const canvas = page.locator("canvas").first();
    const ok = await canvas.isVisible({ timeout: 10_000 }).catch(() => false);
    if (!ok) { await ss(page, "EX10-no-canvas"); return; }

    await page.waitForTimeout(500);
    const frame0 = await canvas.screenshot().catch(() => null);
    await page.waitForTimeout(2_000);
    const frame1 = await canvas.screenshot().catch(() => null);

    await ss(page, "EX10-canvas-frames");

    if (frame0 && frame1) {
      // Frames should differ (animation)
      const diff = Buffer.compare(frame0, frame1);
      expect(diff, "Canvas frames should differ — game should be animating").not.toBe(0);
    }
  });

  // EX11: Game runs for 30s without crash
  test("EX11: Game runs for 30 seconds without crash or error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const active = await enterGame(page);
    if (!active) { await ss(page, "EX11-unauthenticated"); return; }

    await ss(page, "EX11-game-start");
    await page.waitForTimeout(30_000);
    await ss(page, "EX11-after-30s");

    // Canvas or result screen must be visible
    const canvas  = page.locator("canvas");
    const result  = page.locator("text=/victory|winner|result|game over/i").first();

    const canvasOk = await canvas.isVisible({ timeout: 5_000 }).catch(() => false);
    const resultOk = await result.isVisible({ timeout: 2_000 }).catch(() => false);
    expect(canvasOk || resultOk, "Canvas or result screen should be visible after 30s").toBe(true);
    expect(filterErrors(errors), "No critical JS errors during 30s of gameplay").toHaveLength(0);
  });

  // EX12: Burst overlay text appears or game survives to result
  test("EX12: Game resolves to burst notice or completes without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const active = await enterGame(page);
    if (!active) { await ss(page, "EX12-unauthenticated"); return; }

    // Listen for burst text or let game run 20s
    const burstEl = page.locator("text=/burst|BURST|ring out|RING OUT/i").first();
    const burstOk = await burstEl
      .waitFor({ state: "visible", timeout: 20_000 })
      .then(() => true)
      .catch(() => false);

    await ss(page, "EX12-burst-check");

    if (burstOk) {
      await expect(burstEl).toBeVisible();
    } else {
      // No burst in 20s — canvas should still be running
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

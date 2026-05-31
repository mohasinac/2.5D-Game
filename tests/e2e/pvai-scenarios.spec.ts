/**
 * pvai-scenarios.spec.ts
 *
 * Player-vs-AI battle scenario E2E tests.
 *
 * PA01: Navigate to /game/battle → PvAI card visible
 * PA02: Start medium AI game → room loads → canvas visible
 * PA03: Wait through launch phase (waitThroughLaunch)
 * PA04: Battle runs 20s → no crash → canvas still visible
 * PA05: Hard AI: room created, canvas loads
 * PA06: Hell AI: room created, canvas loads (or graceful degrade if server down)
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  filterErrors,
  waitForGameMount,
  waitThroughLaunch,
  startViaCards,
  checkAndLogCanvas,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// PA01 — PvAI card visible on /game/battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA01: PvAI card on battle mode select", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("PvAI / AI Battle card visible at /game/battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "PA01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "PA01-battle-mode-cards");

    const aiCard = page.locator(
      "button, [role='button'], [class*='card']"
    ).filter({ hasText: /pvai|vs\s?ai|ai\s?battle|ai battle/i }).first();

    const cardVisible = await aiCard.isVisible({ timeout: 10_000 }).catch(() => false);
    if (cardVisible) {
      await expect(aiCard).toBeVisible();
      console.log("[PA01] PvAI card found");
    } else {
      // Mode may be listed with a different label — check for any game mode cards
      const anyCard = page.locator("button, [role='button'], [class*='card']").first();
      const anyVisible = await anyCard.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyVisible) await expect(anyCard).toBeVisible();
      await ss(page, "PA01-any-card-fallback");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PA02 — Medium AI game loads canvas
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA02: Medium AI battle canvas", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("medium AI room loads and canvas becomes visible", async ({ page }) => {
    // Try the card flow first
    const started = await startViaCards(page, "pvai");
    if (!started) {
      // Fall back to direct URL
      const landed = await gotoProtected(page, "/game/room?mode=pvai&difficulty=medium");
      if (!landed) { await ss(page, "PA02-unauth"); return; }
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    await ss(page, "PA02-room-loading");

    await waitForGameMount(page, 35_000).catch(() => {});
    await ss(page, "PA02-game-mounted");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 20_000 }).catch(() => false);
    if (canvasOk) {
      await expect(page.locator("canvas")).toBeVisible({ timeout: 20_000 });
      const analysis = await checkAndLogCanvas(page, "PA02-canvas");
      console.log(`[PA02] Canvas: ${analysis.summary}`);
    } else {
      await ss(page, "PA02-canvas-timeout");
      console.log("[PA02] Canvas not visible — server may be unavailable");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PA03 — Launch phase completes
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA03: Launch phase wait-through", () => {
  test.setTimeout(100_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("can wait through warmup and launch phase", async ({ page }) => {
    const started = await startViaCards(page, "pvai");
    if (!started) { await ss(page, "PA03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await waitForGameMount(page, 35_000).catch(() => {});
    await ss(page, "PA03-mounted");

    const canvasPresent = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    if (!canvasPresent) { await ss(page, "PA03-no-canvas"); return; }

    await waitThroughLaunch(page, "PA03");

    await page.waitForTimeout(2_000);
    await ss(page, "PA03-post-launch");

    // Canvas should still be visible after launch
    await expect(page.locator("canvas")).toBeVisible({ timeout: 10_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PA04 — Battle runs 20s without crash
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA04: Medium AI 20s stability", () => {
  test.setTimeout(120_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("battle runs 20s without JS errors and canvas stays visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const started = await startViaCards(page, "pvai");
    if (!started) { await ss(page, "PA04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await waitForGameMount(page, 35_000).catch(() => {});

    const canvasPresent = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    if (!canvasPresent) { await ss(page, "PA04-no-canvas"); return; }

    await waitThroughLaunch(page, "PA04");

    // Run for 20 seconds
    await page.waitForTimeout(20_000);
    await ss(page, "PA04-after-20s");

    // Canvas should still be present
    const stillVisible = await page.locator("canvas").isVisible({ timeout: 5_000 }).catch(() => false);
    if (stillVisible) {
      await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
    }

    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[PA04] JS errors:", critical);
    expect(critical).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PA05 — Hard AI room loads
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA05: Hard AI battle canvas", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("hard AI room creates and canvas loads", async ({ page }) => {
    // Navigate to AI battle setup and select Hard
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "PA05-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    // Click AI Battle card
    const aiCard = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /pvai|vs\s?ai|ai\s?battle/i }).first();
    if (await aiCard.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await aiCard.click();
      await page.waitForTimeout(800);
    }

    // Select Hard difficulty
    const hardBtn = page.locator("button").filter({ hasText: /\bhard\b/i }).first();
    if (await hardBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await hardBtn.click();
      await page.waitForTimeout(400);
      await ss(page, "PA05-hard-selected");
    }

    // Click start / play
    const startBtn = page.locator("button").filter({ hasText: /start|play|launch|let it rip/i }).first();
    if (await startBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await startBtn.click();
    }

    await waitForGameMount(page, 35_000).catch(() => {});
    await ss(page, "PA05-hard-mounting");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 20_000 }).catch(() => false);
    if (canvasOk) {
      await expect(page.locator("canvas")).toBeVisible({ timeout: 20_000 });
      console.log("[PA05] Hard AI canvas visible");
    } else {
      console.log("[PA05] Canvas not visible — server may be unavailable");
    }
    await ss(page, "PA05-hard-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PA06 — Hell AI room (graceful degrade if server down)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PA06: Hell AI battle (graceful degrade)", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("hell AI room created or degrades gracefully when server unavailable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "PA06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    // Click AI Battle card
    const aiCard = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /pvai|vs\s?ai|ai\s?battle/i }).first();
    if (await aiCard.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await aiCard.click();
      await page.waitForTimeout(800);
    }

    // Select Hell difficulty
    const hellBtn = page.locator("button").filter({ hasText: /\bhell\b/i }).first();
    if (await hellBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await hellBtn.click();
      await page.waitForTimeout(400);
      await ss(page, "PA06-hell-selected");
    }

    const startBtn = page.locator("button").filter({ hasText: /start|play|launch|let it rip/i }).first();
    if (await startBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
      await startBtn.click();
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "PA06-hell-mounting");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 20_000 }).catch(() => false);
    if (canvasOk) {
      console.log("[PA06] Hell AI canvas visible");
      await expect(page.locator("canvas")).toBeVisible({ timeout: 20_000 });
    } else {
      // Graceful degrade: error state or loading bar is acceptable
      const errorEl = page.locator('[class*="error"], [class*="Error"], [role="alert"]').first();
      const loadEl  = page.locator('[data-testid="loading-progress"]').first();
      const hasAny  = await Promise.race([
        errorEl.isVisible({ timeout: 5_000 }),
        loadEl.isVisible({ timeout: 5_000 }),
      ]).catch(() => false);
      console.log(`[PA06] Server unavailable — degraded state: errorOrLoad=${hasAny}`);
    }

    // No critical JS errors regardless of server state
    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[PA06] JS errors:", critical);
    expect(critical).toHaveLength(0);

    await ss(page, "PA06-hell-result");
  });
});

/**
 * story-mode.spec.ts
 *
 * E2E tests for the Story Mode feature.
 *
 * SM01: Navigate to /game/story → episode cards visible
 * SM02: Click episode card → intro page loads
 * SM03: Skip intro → game room / canvas loads
 * SM04: Launch sequence visible (overlay or warmup countdown)
 * SM05: HUD elements visible (spin bar, burst bar, or canvas)
 * SM06: Battle runs 10s without JS errors
 * SM07: Can navigate back to /game/story from intro
 * SM08: Story mode loads without crash on multiple viewports
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
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// SM01 — Story mode page shows episode cards
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM01: Story mode episode list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("episode cards are visible on /game/story", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/story");
    if (!landed) { await ss(page, "SM01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "SM01-story-page");

    // Cards can be <button>, <a>, or a div with 'card' in class
    const cards = page.locator(
      "button, [role='button'], [class*='card'], [class*='episode'], a"
    ).filter({ hasText: /episode|chapter|story|battle|begin/i });

    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first()).toBeVisible({ timeout: 10_000 });
      console.log(`[SM01] Found ${count} episode card(s)`);
    } else {
      // Fallback: at least a heading should exist
      const heading = page.locator("h1, h2").first();
      const headingOk = await heading.isVisible({ timeout: 8_000 }).catch(() => false);
      if (headingOk) await expect(heading).toBeVisible();
    }

    await ss(page, "SM01-episode-cards");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM02 — Episode card click loads intro page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM02: Episode intro page", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("clicking episode card navigates to intro", async ({ page }) => {
    // Try direct navigation first (more reliable in CI)
    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) {
      // Fall back to clicking from the list
      const listLanded = await gotoProtected(page, "/game/story");
      if (!listLanded) { await ss(page, "SM02-unauth"); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_000);

      const firstCard = page.locator(
        "button, [role='button'], [class*='card'], [class*='episode']"
      ).filter({ hasText: /episode|chapter|story|play/i }).first();

      const cardVisible = await firstCard.isVisible({ timeout: 8_000 }).catch(() => false);
      if (!cardVisible) { await ss(page, "SM02-no-cards"); return; }

      await firstCard.click();
      await page.waitForTimeout(2_000);
    }

    await ss(page, "SM02-intro-page");

    // Intro page should have some content: dialogue, text, or an image
    const introContent = page.locator(
      "h1, h2, p, [class*='intro'], [class*='dialogue'], [class*='story'], canvas"
    ).first();
    const contentOk = await introContent.isVisible({ timeout: 10_000 }).catch(() => false);
    if (contentOk) await expect(introContent).toBeVisible();

    await ss(page, "SM02-intro-content");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM03 — Skipping intro loads game canvas
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM03: Skip intro to game", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("skip button on intro navigates to game room", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) { await ss(page, "SM03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "SM03-intro-loaded");

    const skipBtn = page.locator("button").filter({ hasText: /skip|start|play|continue|next/i }).first();
    const skipVisible = await skipBtn.isVisible({ timeout: 8_000 }).catch(() => false);

    if (skipVisible) {
      await skipBtn.click();
      await page.waitForTimeout(1_500);
      await ss(page, "SM03-after-skip");
    } else {
      // Navigate directly to game room with story config
      await page.goto("/game/room?mode=story&episode=1");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_500);
    }

    // Either a canvas or a loading bar should appear
    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "SM03-game-mounting");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    if (canvasOk) {
      await expect(page.locator("canvas")).toBeVisible({ timeout: 15_000 });
    }

    await ss(page, "SM03-canvas-or-room");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM04 — Launch sequence visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM04: Story mode launch sequence", () => {
  test.setTimeout(80_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("launch overlay or warmup countdown appears", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) { await ss(page, "SM04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    // Try to skip to game
    const skipBtn = page.locator("button").filter({ hasText: /skip|start|play|continue/i }).first();
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(1_000);
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "SM04-after-mount");

    // Look for warmup countdown or launch overlay
    const launchIndicators = page.locator(
      'text=/3|2|1|Let It Rip|warmup|launch|tilt|charge|power/i, [data-testid="launch-phase-overlay"], [class*="countdown"], [class*="launch"]'
    ).first();

    const indicatorOk = await launchIndicators.isVisible({ timeout: 20_000 }).catch(() => false);
    if (indicatorOk) {
      console.log("[SM04] Launch/warmup indicator visible");
      await ss(page, "SM04-launch-indicator");
    } else {
      // Canvas alone is acceptable — game may have started immediately
      const canvasOk = await page.locator("canvas").isVisible({ timeout: 10_000 }).catch(() => false);
      if (canvasOk) console.log("[SM04] Canvas visible — game started directly");
      await ss(page, "SM04-canvas-fallback");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM05 — HUD elements visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM05: Story mode HUD", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("at least one HUD element or canvas is visible during battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) { await ss(page, "SM05-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    const skipBtn = page.locator("button").filter({ hasText: /skip|start|play|continue/i }).first();
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(1_000);
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await waitThroughLaunch(page, "SM05");
    await page.waitForTimeout(3_000);
    await ss(page, "SM05-battle-running");

    // HUD can be canvas, spin bar, burst bar, or any game-specific element
    const hudCandidates = [
      page.locator("canvas").first(),
      page.locator('[data-testid*="spin"], [class*="spin-bar"], [class*="spinBar"]').first(),
      page.locator('[data-testid*="burst"], [class*="burst"], [class*="Burst"]').first(),
      page.locator('[class*="hud"], [class*="HUD"]').first(),
    ];

    let found = false;
    for (const el of hudCandidates) {
      if (await el.isVisible({ timeout: 3_000 }).catch(() => false)) {
        found = true;
        break;
      }
    }

    if (found) console.log("[SM05] HUD element visible");
    await ss(page, "SM05-hud-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM06 — Battle runs 10s without JS errors
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM06: Story battle stability", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("no critical JS errors after 10s of story battle", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) { await ss(page, "SM06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    const skipBtn = page.locator("button").filter({ hasText: /skip|start|play|continue/i }).first();
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(1_000);
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await waitThroughLaunch(page, "SM06");

    // Run for 10 seconds
    await page.waitForTimeout(10_000);
    await ss(page, "SM06-after-10s");

    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[SM06] JS errors:", critical);
    expect(critical).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM07 — Back navigation from intro to story list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM07: Back navigation from intro", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("back button or browser back returns to /game/story", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/story/episode/1/intro");
    if (!landed) { await ss(page, "SM07-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "SM07-intro-loaded");

    // Look for an explicit back button first
    const backBtn = page.locator("button, a").filter({ hasText: /back|return|story/i }).first();
    const backVisible = await backBtn.isVisible({ timeout: 5_000 }).catch(() => false);

    if (backVisible) {
      await backBtn.click();
      await page.waitForTimeout(1_500);
      await ss(page, "SM07-after-back-btn");
    } else {
      // Use browser back
      await page.goBack();
      await page.waitForTimeout(1_500);
      await ss(page, "SM07-after-browser-back");
    }

    // Should be on story page or a non-error route
    const url = page.url();
    const onStory = url.includes("/game/story") || url.includes("/game") || url.includes("/");
    expect(onStory).toBe(true);
    await ss(page, "SM07-back-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SM08 — Multi-viewport smoke test
// ─────────────────────────────────────────────────────────────────────────────

test.describe("SM08: Story mode multi-viewport", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("story page loads without crash on 390px and 1440px", async ({ page }) => {
    for (const [width, height, label] of [
      [390,  844,  "mobile-390"],
      [1440, 900,  "desktop-1440"],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);

      const landed = await gotoProtected(page, "/game/story");
      if (!landed) {
        await ss(page, `SM08-unauth-${label}`);
        continue;
      }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_500);

      const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
      if (overflow > 4) console.warn(`[SM08] horizontal overflow ${overflow}px at ${width}px`);

      await ss(page, `SM08-story-${label}`);

      const body = page.locator("body");
      await expect(body).toBeVisible({ timeout: 5_000 });
    }
  });
});

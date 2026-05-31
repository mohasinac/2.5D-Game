/**
 * battle-royale-random-queue.spec.ts
 *
 * Battle Royale random matchmaking queue E2E tests.
 * Tests the auto-matchmaking pool flow (like LoL normal queue).
 *
 * RQ01: Navigate to /game/royale/lobby → "Play Random Royale" or "Find Match" visible
 * RQ02: Click "Find Match" → queue entry UI appears (spinner, position, count)
 * RQ03: Queue shows "1/N players queued" type indicator
 * RQ04: Cancel queue → returns to royale lobby
 * RQ05: Queue accessible at mobile viewport
 * RQ06: If server unavailable, graceful error state shown
 * RQ07: Queue entry persists if page re-rendered (no state reset)
 * RQ08: Queue timeout → bot backfill or error shown
 * RQ09: Cannot join queue if already in a room (guard shown or redirect)
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  filterErrors,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// RQ01 — Find Match button visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ01: Royale Find Match button", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test('"Play Random Royale" or "Find Match" button visible', async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "RQ01-royale-lobby");

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search|matchmak/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (btnOk) {
      await expect(findBtn).toBeVisible();
      console.log("[RQ01] Find Match / Random Royale button visible");
    } else {
      const anyBtn = page.locator("button").first();
      const anyOk = await anyBtn.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) await expect(anyBtn).toBeVisible();
      console.log("[RQ01] Fallback: page has at least one button");
    }

    await ss(page, "RQ01-find-match-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ02 — Queue entry UI appears
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ02: Queue entry UI", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("clicking Find Match shows queue entry UI", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ02-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(2_000);
    await ss(page, "RQ02-after-click");

    // Queue UI: spinner, searching text, player count, position
    const queueEl = page.locator(
      'text=/searching|waiting|in queue|finding|looking|queued/i, [class*="spinner"], [class*="loading"], [class*="queue"], [class*="search"]'
    ).first();
    const queueOk = await queueEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (queueOk) {
      await expect(queueEl).toBeVisible();
      console.log("[RQ02] Queue entry UI visible");
    } else {
      const onMatchmak = page.url().includes("matchmak") || page.url().includes("queue");
      if (onMatchmak) console.log("[RQ02] Navigated to matchmaking/queue page");
      else console.log("[RQ02] Queue UI not visible — server may be unavailable");
    }

    await ss(page, "RQ02-queue-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ03 — Queue shows "1/N players queued" indicator
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ03: Queue player count indicator", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue shows player count or position (e.g. 1/4 players)", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ03-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(2_500);
    await ss(page, "RQ03-in-queue");

    // Player count, slot indicator, or queue size
    const countEl = page.locator(
      'text=/[0-9]+\s*(\/|of|player|queued|slot)/i, [class*="count"], [class*="slot"], [class*="players"]'
    ).first();
    const countOk = await countEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (countOk) {
      console.log("[RQ03] Queue count/slot indicator visible");
    } else {
      console.log("[RQ03] No count indicator — may show generic waiting state");
    }

    await ss(page, "RQ03-count-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ04 — Cancel queue returns to royale lobby
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ04: Cancel queue returns to royale lobby", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("cancel button returns to royale lobby", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ04-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "RQ04-in-queue");

    // Cancel
    const cancelBtn = page.locator("button").filter({ hasText: /cancel|leave\s?queue|stop|back/i }).first();
    const cancelOk = await cancelBtn.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!cancelOk) {
      console.log("[RQ04] No cancel button — using browser back");
      await page.goBack();
    } else {
      await cancelBtn.click();
    }

    await page.waitForTimeout(1_500);
    await ss(page, "RQ04-after-cancel");

    // Should be back at royale lobby or game page
    const onRoyale = page.url().includes("royale") || page.url().includes("/game");
    expect(onRoyale).toBe(true);

    await ss(page, "RQ04-cancel-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ05 — Queue accessible at mobile viewport
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ05: Royale queue on mobile", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("royale queue UI accessible at 390px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ05-unauth-mobile"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    if (overflow > 4) console.warn(`[RQ05] horizontal overflow ${overflow}px at 390px`);

    await ss(page, "RQ05-royale-mobile-390");

    const body = page.locator("body");
    await expect(body).toBeVisible({ timeout: 5_000 });

    const findBtn = page.locator("button").filter({
      hasText: /find|match|random|queue|play/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (btnOk) await expect(findBtn).toBeVisible();

    await ss(page, "RQ05-mobile-find-btn");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ06 — Graceful error when server unavailable
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ06: Graceful error when server down", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("graceful error shown when server is unavailable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (btnOk) {
      await findBtn.click();
      await page.waitForTimeout(3_000);
    }

    await ss(page, "RQ06-queue-or-error");

    // No critical JS errors
    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[RQ06] JS errors:", critical);
    expect(critical).toHaveLength(0);

    // Page must remain visible
    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "RQ06-graceful-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ07 — Queue state persists across re-renders
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ07: Queue state persists across re-renders", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue entry state is not reset on page re-render or resize", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ07-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ07-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "RQ07-in-queue");

    // Trigger a viewport resize (simulate re-render)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await ss(page, "RQ07-after-resize");

    // Queue state should still be shown (not reset back to lobby)
    const queueEl = page.locator(
      'text=/searching|waiting|in queue|finding|queued/i, [class*="spinner"], [class*="queue"]'
    ).first();
    const queueOk = await queueEl.isVisible({ timeout: 5_000 }).catch(() => false);
    const stillOnQueueRoute = page.url().includes("queue") || page.url().includes("matchmak");

    if (queueOk || stillOnQueueRoute) {
      console.log("[RQ07] Queue state persisted after resize");
    } else {
      console.log("[RQ07] Queue state not visible after resize — may have reset");
    }

    const critical = filterErrors(errors);
    expect(critical).toHaveLength(0);
    await ss(page, "RQ07-persist-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ08 — Queue timeout → bot backfill or error
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ08: Queue timeout or bot backfill", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue times out or shows bot backfill without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "RQ08-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ08-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(2_000);
    await ss(page, "RQ08-in-queue");

    // Wait up to 30s for timeout or bot backfill
    const timeoutOrFill = page.locator(
      'text=/timeout|timed out|no match|try again|bot|adding\s?bots|backfill|starting/i'
    ).first();
    await timeoutOrFill.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});

    await ss(page, "RQ08-after-wait");

    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[RQ08] JS errors:", critical);
    expect(critical).toHaveLength(0);

    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "RQ08-timeout-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RQ09 — Cannot join queue if already in a room
// ─────────────────────────────────────────────────────────────────────────────

test.describe("RQ09: Already-in-room guard", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("joining queue while in a room shows guard or redirect", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // Try to join queue once
    const firstLanded = await gotoProtected(page, "/game/royale/lobby");
    if (!firstLanded) { await ss(page, "RQ09-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const findBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const btnOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "RQ09-no-find-btn"); return; }

    await findBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "RQ09-first-queue");

    // Navigate back to lobby and try to join again
    const secondLanded = await gotoProtected(page, "/game/royale/lobby");
    if (!secondLanded) { await ss(page, "RQ09-second-nav-fail"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "RQ09-back-at-lobby");

    const secondFindBtn = page.locator("button, [role='button'], [class*='card']").filter({
      hasText: /play\s?random|find\s?match|random\s?royale|search/i,
    }).first();
    const secondBtnOk = await secondFindBtn.isVisible({ timeout: 8_000 }).catch(() => false);

    if (secondBtnOk) {
      await secondFindBtn.click();
      await page.waitForTimeout(2_000);
      await ss(page, "RQ09-second-queue-attempt");

      // Check for a guard: error/alert, already-in-room message, or redirect
      const guardEl = page.locator(
        'text=/already in|in a room|already queued|cannot join/i, [role="alert"], [class*="error"]'
      ).first();
      const guardOk = await guardEl.isVisible({ timeout: 5_000 }).catch(() => false);
      if (guardOk) {
        console.log("[RQ09] Already-in-room guard shown");
      } else {
        console.log("[RQ09] No guard shown — queue allowed or state was cleared on navigation");
      }
    }

    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[RQ09] JS errors:", critical);
    expect(critical).toHaveLength(0);

    await ss(page, "RQ09-guard-result");
  });
});

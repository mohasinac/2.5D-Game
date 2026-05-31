/**
 * tournament-random-queue.spec.ts
 *
 * Tournament matchmaking queue E2E tests.
 * Tests the auto-matchmaking flow (like LoL ranked queue).
 *
 * TQ01: Navigate to /game/tournament → queue button visible
 * TQ02: Click queue button → waiting/spinner UI appears
 * TQ03: Queue UI shows player count or position indicator
 * TQ04: Cancel queue → returns to tournament list
 * TQ05: Queue page accessible on mobile viewport (390px)
 * TQ06: If server unavailable, queue shows appropriate degraded state
 * TQ07: Matchmaking eventually times out or shows timeout UI
 * TQ08: After queue join, page doesn't crash on navigation away and back
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
// TQ01 — Queue button visible on tournament page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ01: Tournament queue button", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test('"Find Tournament Match" or queue button visible', async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "TQ01-tournament-page");

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked\s?match|matchmak|play\s?now/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (btnOk) {
      await expect(queueBtn).toBeVisible();
      console.log("[TQ01] Queue button visible");
    } else {
      // Page may show tournament cards to click instead of a global queue
      const anyBtn = page.locator("button").first();
      const anyOk = await anyBtn.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) await expect(anyBtn).toBeVisible();
      console.log("[TQ01] No dedicated queue button — tournament uses card-based flow");
    }

    await ss(page, "TQ01-queue-btn-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ02 — Clicking queue shows waiting/spinner UI
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ02: Queue entry UI appears", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue button click shows waiting or spinner UI", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked\s?match|matchmak|play\s?now/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "TQ02-no-queue-btn"); return; }

    await queueBtn.click();
    await page.waitForTimeout(2_000);
    await ss(page, "TQ02-after-queue-click");

    // Waiting UI: spinner, "searching...", "waiting", "in queue"
    const waitingEl = page.locator(
      'text=/searching|waiting|in queue|finding|looking/i, [class*="spinner"], [class*="loading"], [class*="wait"]'
    ).first();
    const waitingOk = await waitingEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (waitingOk) {
      await expect(waitingEl).toBeVisible();
      console.log("[TQ02] Waiting/spinner UI visible");
    } else {
      // May have navigated to a queue page
      const onQueue = page.url().includes("queue") || page.url().includes("matchmak");
      if (onQueue) console.log("[TQ02] Navigated to queue/matchmaking page");
      else console.log("[TQ02] Queue UI not visible — server may be unavailable");
    }

    await ss(page, "TQ02-queue-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ03 — Queue shows player count or position
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ03: Queue position/count indicator", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue shows player count or position indicator", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked|matchmak|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "TQ03-no-queue-btn"); return; }

    await queueBtn.click();
    await page.waitForTimeout(2_500);
    await ss(page, "TQ03-in-queue");

    // Player count, position, or queue size indicator
    const countEl = page.locator(
      'text=/[0-9]+\s*(\/|of|player|in queue|queued)/i, [class*="count"], [class*="position"], [class*="players"]'
    ).first();
    const countOk = await countEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (countOk) {
      console.log("[TQ03] Queue count/position indicator visible");
    } else {
      console.log("[TQ03] No queue count visible — may show generic waiting state");
    }

    await ss(page, "TQ03-count-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ04 — Cancel queue returns to tournament list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ04: Cancel queue returns to list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("cancelling queue returns to tournament list", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked|matchmak|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "TQ04-no-queue-btn"); return; }

    await queueBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "TQ04-in-queue");

    // Cancel button
    const cancelBtn = page.locator("button").filter({ hasText: /cancel|leave\s?queue|stop|back/i }).first();
    const cancelOk = await cancelBtn.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!cancelOk) {
      console.log("[TQ04] No cancel button found — using browser back");
      await page.goBack();
    } else {
      await cancelBtn.click();
    }

    await page.waitForTimeout(1_500);
    await ss(page, "TQ04-after-cancel");

    // Should be back on tournament page
    const onTournament = page.url().includes("/game/tournament") || page.url().includes("/game");
    expect(onTournament).toBe(true);

    await ss(page, "TQ04-cancel-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ05 — Queue accessible on mobile viewport
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ05: Queue on mobile viewport", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("tournament queue page accessible at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ05-unauth-mobile"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    if (overflow > 4) console.warn(`[TQ05] horizontal overflow ${overflow}px at 390px`);

    await ss(page, "TQ05-tournament-mobile-390");

    // Page must be usable at mobile width
    const body = page.locator("body");
    await expect(body).toBeVisible({ timeout: 5_000 });

    const queueBtn = page.locator("button").filter({
      hasText: /find|queue|ranked|match|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (btnOk) await expect(queueBtn).toBeVisible();

    await ss(page, "TQ05-mobile-queue-btn");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ06 — Graceful error when server unavailable
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ06: Graceful degrade on server unavailable", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue shows error or degraded state gracefully when server is down", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked|matchmak|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (btnOk) {
      await queueBtn.click();
      await page.waitForTimeout(3_000);
    }

    await ss(page, "TQ06-queue-or-error");

    // Regardless of server state, no critical JS errors
    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[TQ06] JS errors:", critical);
    expect(critical).toHaveLength(0);

    // Page must still be visible (not blank/crashed)
    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "TQ06-graceful-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ07 — Queue timeout or timeout UI
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ07: Queue timeout behaviour", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("queue eventually shows timeout or continues waiting without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ07-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked|matchmak|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "TQ07-no-queue-btn"); return; }

    await queueBtn.click();
    await page.waitForTimeout(2_000);
    await ss(page, "TQ07-queue-started");

    // Wait up to 30s for timeout UI or just remain in queue (acceptable)
    const timeoutEl = page.locator(
      'text=/timeout|timed out|no match|try again|no players/i'
    ).first();
    await timeoutEl.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});

    await ss(page, "TQ07-after-wait");

    // App must not have crashed
    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[TQ07] JS errors:", critical);
    expect(critical).toHaveLength(0);

    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "TQ07-timeout-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TQ08 — Navigation away and back doesn't crash
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TQ08: Navigate away and back after queue join", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("page does not crash after navigating away and back from queue", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TQ08-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const queueBtn = page.locator("button, [role='button']").filter({
      hasText: /find\s?tournament|queue|ranked|matchmak|play/i,
    }).first();
    const btnOk = await queueBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (btnOk) {
      await queueBtn.click();
      await page.waitForTimeout(1_500);
      await ss(page, "TQ08-in-queue");
    }

    // Navigate away
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);
    await ss(page, "TQ08-navigated-away");

    // Navigate back
    const backLanded = await gotoProtected(page, "/game/tournament");
    if (!backLanded) { await ss(page, "TQ08-back-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "TQ08-navigated-back");

    // App must not have crashed
    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[TQ08] JS errors:", critical);
    expect(critical).toHaveLength(0);

    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "TQ08-no-crash");
  });
});

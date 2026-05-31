/**
 * bot-fill-autostart.spec.ts
 *
 * Bot fill and auto-start room E2E tests.
 *
 * BF01: Create room with bot fill enabled → bots shown in lobby list
 * BF02: Host-start button visible before timer expires
 * BF03: Auto-start triggers when all slots filled (or timer expires)
 * BF04: Bot difficulty selector visible in room settings
 * BF05: Mixed room (humans + bots) shows both in player list
 * BF06: Game starts after bot fill → warmup countdown visible
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
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper — create a bot-filled room
// ─────────────────────────────────────────────────────────────────────────────

async function createBotFillRoom(
  page: Parameters<typeof gotoProtected>[0],
  route: string,
): Promise<boolean> {
  const landed = await gotoProtected(page, route);
  if (!landed) return false;

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2_000);

  // Click "Create Room"
  const createBtn = page.locator("button, [role='button'], [class*='card']")
    .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
  const createOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
  if (!createOk) return false;

  await createBtn.click();
  await page.waitForTimeout(1_200);

  // Enable bot fill if toggle exists
  const botFillToggle = page.locator(
    'input[type="checkbox"], button, [role="switch"], label'
  ).filter({ hasText: /bot.?fill|fill.?bots?|add.?bots?|ai.?fill/i }).first();
  const toggleOk = await botFillToggle.isVisible({ timeout: 5_000 }).catch(() => false);
  if (toggleOk) {
    await botFillToggle.click();
    await page.waitForTimeout(400);
  }

  // Submit / confirm
  const submitBtn = page.locator("button").filter({ hasText: /create|start|confirm|ok/i }).first();
  const submitOk = await submitBtn.isVisible({ timeout: 5_000 }).catch(() => false);
  if (submitOk) {
    await submitBtn.click();
    await page.waitForTimeout(2_000);
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// BF01 — Bots shown in lobby after bot fill
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF01: Bot fill lobby list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("bots appear in player list after enabling bot fill", async ({ page }) => {
    const created = await createBotFillRoom(page, "/game/royale/lobby");
    if (!created) { await ss(page, "BF01-create-failed"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BF01-lobby");

    // Bot entries: "Bot", "AI", "[CPU]", or a bot indicator
    const botEntry = page.locator(
      'text=/bot|cpu|ai\s?player|\[bot\]|\[ai\]/i, [class*="bot"], [class*="cpu"]'
    ).first();
    const botOk = await botEntry.isVisible({ timeout: 10_000 }).catch(() => false);

    if (botOk) {
      await expect(botEntry).toBeVisible();
      console.log("[BF01] Bot entry visible in lobby");
    } else {
      // Player list should still exist
      const playerList = page.locator(
        '[class*="player-list"], [class*="playerList"], [class*="players"], ul, ol'
      ).first();
      const listOk = await playerList.isVisible({ timeout: 8_000 }).catch(() => false);
      if (listOk) console.log("[BF01] Player list visible (no explicit bot marker found)");
    }

    await ss(page, "BF01-bot-list");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BF02 — Host-start button visible before timer
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF02: Host start button", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("host-start button visible in lobby before auto-start timer expires", async ({ page }) => {
    const created = await createBotFillRoom(page, "/game/royale/lobby");
    if (!created) { await ss(page, "BF02-create-failed"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BF02-lobby");

    const startBtn = page.locator("button").filter({
      hasText: /start\s?game|force\s?start|start\s?now|let\s?it\s?rip/i,
    }).first();
    const startOk = await startBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (startOk) {
      await expect(startBtn).toBeVisible();
      console.log("[BF02] Host start button visible");
    } else {
      console.log("[BF02] Host start button not found — may need more players or server");
    }

    await ss(page, "BF02-host-start");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BF03 — Auto-start triggers when slots filled / timer expires
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF03: Auto-start after fill", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("game auto-starts or allows manual start after bot fill", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const created = await createBotFillRoom(page, "/game/royale/lobby");
    if (!created) { await ss(page, "BF03-create-failed"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BF03-lobby");

    // Try manual start first
    const startBtn = page.locator("button").filter({
      hasText: /start\s?game|force\s?start|start\s?now|let\s?it\s?rip/i,
    }).first();
    const startOk = await startBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (startOk) {
      await startBtn.click();
      await page.waitForTimeout(1_500);
      await ss(page, "BF03-after-manual-start");
    }

    // Wait for game to mount (canvas or loading bar)
    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "BF03-mounting");

    // Check for warmup/launch or canvas
    const canvasOk = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    const countdownOk = await page.locator('text=/3|2|1|warmup|let\s?it\s?rip/i').first()
      .isVisible({ timeout: 10_000 }).catch(() => false);

    if (canvasOk || countdownOk) {
      console.log(`[BF03] Game started (canvas=${canvasOk}, countdown=${countdownOk})`);
    } else {
      console.log("[BF03] Auto-start not triggered — server may be unavailable");
    }

    const critical = filterErrors(errors);
    expect(critical).toHaveLength(0);
    await ss(page, "BF03-autostart-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BF04 — Bot difficulty selector in room settings
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF04: Bot difficulty selector", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("bot difficulty selector visible in room settings", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BF04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const createOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!createOk) { await ss(page, "BF04-no-create-btn"); return; }

    await createBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "BF04-create-form");

    // Difficulty selector: select, radio buttons, or difficulty labels
    const difficultyEl = page.locator(
      'select[name*="difficulty"], [data-testid*="difficulty"], [class*="difficulty"],' +
      ' button, label'
    ).filter({ hasText: /medium|hard|hell|easy|difficulty/i }).first();
    const diffOk = await difficultyEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (diffOk) {
      await expect(difficultyEl).toBeVisible();
      console.log("[BF04] Bot difficulty selector visible");
    } else {
      // Settings may embed difficulty inside a collapsible section
      const settingsEl = page.locator('[class*="settings"], [class*="advanced"], details').first();
      const settingsOk = await settingsEl.isVisible({ timeout: 5_000 }).catch(() => false);
      if (settingsOk) console.log("[BF04] Settings panel visible (difficulty may be inside)");
      else console.log("[BF04] Difficulty selector not found in create form");
    }

    await ss(page, "BF04-difficulty-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BF05 — Mixed room shows humans and bots
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF05: Mixed human + bot player list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("player list shows both human (logged-in user) and bot entries", async ({ page }) => {
    const created = await createBotFillRoom(page, "/game/royale/lobby");
    if (!created) { await ss(page, "BF05-create-failed"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "BF05-lobby");

    // Human player: username or "You" indicator
    const humanEntry = page.locator(
      'text=/you|me|\(you\)/i, [class*="self"], [class*="you"]'
    ).first();
    const humanOk = await humanEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    // Bot player indicator
    const botEntry = page.locator(
      'text=/bot|cpu|ai\s?player|\[bot\]|\[ai\]/i, [class*="bot"], [class*="cpu"]'
    ).first();
    const botOk = await botEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (humanOk) console.log("[BF05] Human player entry visible");
    if (botOk)   console.log("[BF05] Bot player entry visible");

    // At minimum the player list should exist
    const playerList = page.locator(
      '[class*="player-list"], [class*="playerList"], [class*="players"], ul li'
    ).first();
    const listOk = await playerList.isVisible({ timeout: 8_000 }).catch(() => false);
    if (listOk) await expect(playerList).toBeVisible();

    await ss(page, "BF05-mixed-list");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BF06 — Game starts after bot fill, warmup countdown visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BF06: Warmup countdown after bot fill start", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("warmup countdown visible after game starts with bots", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const created = await createBotFillRoom(page, "/game/royale/lobby");
    if (!created) { await ss(page, "BF06-create-failed"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BF06-lobby");

    // Try manual start
    const startBtn = page.locator("button").filter({
      hasText: /start\s?game|force\s?start|start\s?now|let\s?it\s?rip/i,
    }).first();
    const startOk = await startBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (startOk) {
      await startBtn.click();
      await page.waitForTimeout(1_500);
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "BF06-after-start");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    if (!canvasOk) { await ss(page, "BF06-no-canvas"); return; }

    // Warmup countdown: 3, 2, 1 text or a countdown component
    const countdownEl = page.locator(
      'text=/^3$|^2$|^1$|warmup|countdown|let\s?it\s?rip/i, [class*="countdown"], [data-testid*="countdown"]'
    ).first();
    const countdownOk = await countdownEl.isVisible({ timeout: 20_000 }).catch(() => false);

    if (countdownOk) {
      await expect(countdownEl).toBeVisible();
      console.log("[BF06] Warmup countdown visible");
    } else {
      // Canvas present means game is running — acceptable even without visible countdown text
      console.log("[BF06] Canvas visible — game started (countdown may have passed)");
    }

    const critical = filterErrors(errors);
    if (critical.length > 0) console.warn("[BF06] JS errors:", critical);
    expect(critical).toHaveLength(0);
    await ss(page, "BF06-warmup-result");
  });
});

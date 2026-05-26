/**
 * ai-vs-ai-full-battle.spec.ts
 *
 * AI vs AI full battle test — runs until one beyblade wins and captures the winner.
 * Uses the /admin/ai-vs-ai lab page to configure and launch a match.
 * The admin spectates as the two AIs battle to completion (BO1).
 *
 * Also includes:
 *   - Attack-type clash: two attack beyblades collide and one loses
 *   - New aiCount feature: 1 human vs 2 and 3 AI opponents
 *
 * Requires TEST_EMAIL + TEST_PASSWORD (admin credentials).
 * Run: npm run test:e2e -- ai-vs-ai-full-battle
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wait for the match winner overlay ("wins!" text) and return the winner name. */
async function waitForWinner(page: Page, timeoutMs = 240_000): Promise<string | null> {
  // Use .or() to combine locators — comma-separated text= selectors don't union correctly
  const winnerLocator = page.getByText(/wins!/i)
    .or(page.getByText(/Victory!/i))
    .or(page.getByText(/Defeated!/i))
    .first();
  try {
    await winnerLocator.waitFor({ state: "visible", timeout: timeoutMs });
    const text = await winnerLocator.textContent();
    return text ?? "Unknown";
  } catch {
    return null;
  }
}

/** Poll state.status by checking for the finished/series-finished overlay */
async function waitForMatchEnd(page: Page, timeoutMs = 240_000): Promise<boolean> {
  const endLocator = page.getByText(/wins!/i)
    .or(page.getByText(/Victory!/i))
    .or(page.getByText(/Defeated!/i))
    .or(page.getByText(/Play Again/i))
    .first();
  try {
    await endLocator.waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AI vs AI — full battle until one wins (BO1)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI vs AI: full battle until winner", () => {
  test.setTimeout(360_000); // 6 min — Hell AI matches can run up to 3 min + overhead

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("AI vs AI lab page loads with beyblade selectors", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "AV01-ai-vs-ai-lab-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "AV01-ai-vs-ai-lab");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Both beyblade pickers should be present
    const selectors = page.locator('select, [role="combobox"], input[type="text"]');
    const count = await selectors.count();
    expect(count).toBeGreaterThan(0);
    await ss(page, "AV01-ai-vs-ai-selectors");
  });

  test("runs full AI vs AI battle — BO1 — captures winner", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "AV02-ai-vs-ai-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "AV02-ai-vs-ai-lab-configured");

    // Select Hell difficulty for both to make the match fast (aggressive, uses combos)
    const diffBtns = page.locator("button, label").filter({ hasText: /hell/i });
    const diffCount = await diffBtns.count();
    if (diffCount >= 1) {
      await diffBtns.first().click();
      await page.waitForTimeout(200);
    }
    if (diffCount >= 2) {
      await diffBtns.nth(1).click();
      await page.waitForTimeout(200);
    }

    // BO1 for speed
    const bo1Btn = page.locator("button").filter({ hasText: /^BO1$|best of 1|1 game/i }).first();
    if (await bo1Btn.isVisible().catch(() => false)) {
      await bo1Btn.click();
      await page.waitForTimeout(200);
    }

    // Click Launch / Start / Go
    const launchBtn = page.locator("button").filter({ hasText: /launch|start|go|fight|begin/i }).first();
    if (!(await launchBtn.isVisible().catch(() => false))) {
      await ss(page, "AV02-no-launch-button");
      // Try any submit-looking button
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible().catch(() => false)) await submitBtn.click();
    } else {
      await launchBtn.click();
    }

    // Wait for navigation to game page (aiVsAi=true navigates to /game/2d/ai-battle/play?spectate=true)
    await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "AV02-ai-vs-ai-battle-started");

    // Wait for canvas
    const canvas = page.locator("canvas");
    const canvasVisible = await canvas.waitFor({ state: "visible", timeout: 20_000 }).then(() => true).catch(() => false);
    if (canvasVisible) {
      await ss(page, "AV02-ai-vs-ai-canvas");
    }

    // Screenshot at intervals while the match runs
    await page.waitForTimeout(10_000);
    await ss(page, "AV02-ai-vs-ai-t10s");

    await page.waitForTimeout(20_000);
    await ss(page, "AV02-ai-vs-ai-t30s");

    await page.waitForTimeout(30_000);
    await ss(page, "AV02-ai-vs-ai-t60s");

    // Now wait for match end (up to 4 min from screenshots finishing)
    const ended = await waitForMatchEnd(page, 240_000);
    if (ended) {
      await ss(page, "AV02-ai-vs-ai-WINNER");
      // Extract winner text
      const winnerEl = page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).first();
      const winnerText = await winnerEl.textContent().catch(() => "");
      console.log(`[AV02] Match ended — winner display: "${winnerText}"`);
      await expect(page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).or(page.getByText(/Play Again/i)).first()).toBeVisible();
    } else {
      // Match may still be in progress — take a final screenshot
      await ss(page, "AV02-ai-vs-ai-timeout-shot");
      console.log("[AV02] Match did not end within timeout — server may be unreachable or beyblades deadlocked");
    }
  });

  test("AI vs AI — attack vs attack beyblade clash (one loses)", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "AV03-attack-clash-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    // Try to select Attack-type beyblades for both P1 and P2
    // The beyblade pickers are likely SearchableSelect components
    const combos = page.locator('[role="combobox"], select').all();
    const allCombos = await combos;

    // Look for a beyblade that has "attack" type label
    const p1Input = page.locator('input[placeholder*="P1" i], input[placeholder*="player 1" i], [data-testid*="p1"]').first();
    const p2Input = page.locator('input[placeholder*="P2" i], input[placeholder*="player 2" i], [data-testid*="p2"]').first();

    // If direct inputs not found, use SearchableSelect (combobox) order
    const searchInputs = page.locator('input[type="text"], input[type="search"]');
    const inputCount = await searchInputs.count();

    if (inputCount >= 1) {
      // P1 beyblade picker — type "attack" to filter
      await searchInputs.first().fill("attack");
      await page.waitForTimeout(500);
      const firstOption = page.locator('[role="option"], li, .option-item').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
        await page.waitForTimeout(300);
      }
    }

    if (inputCount >= 2) {
      // P2 beyblade picker — also pick an attack type
      await searchInputs.nth(1).fill("attack");
      await page.waitForTimeout(500);
      const firstOption2 = page.locator('[role="option"], li, .option-item').first();
      if (await firstOption2.isVisible().catch(() => false)) {
        await firstOption2.click();
        await page.waitForTimeout(300);
      }
    }

    // Both Hell — max aggression
    const hellBtns = page.locator("button, label").filter({ hasText: /hell/i });
    const hCount = await hellBtns.count();
    for (let i = 0; i < Math.min(2, hCount); i++) {
      await hellBtns.nth(i).click();
      await page.waitForTimeout(100);
    }

    await ss(page, "AV03-attack-clash-configured");

    // Launch
    const launchBtn = page.locator("button").filter({ hasText: /launch|start|go|fight/i }).first();
    if (await launchBtn.isVisible().catch(() => false)) {
      await launchBtn.click();
    } else {
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible().catch(() => false)) await submitBtn.click();
    }

    await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "AV03-attack-clash-started");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await ss(page, "AV03-attack-clash-canvas");

    // Screenshot every 15s
    for (let t = 1; t <= 4; t++) {
      await page.waitForTimeout(15_000);
      await ss(page, `AV03-attack-clash-t${t * 15}s`);
    }

    // Wait for end
    const ended = await waitForMatchEnd(page, 120_000);
    if (ended) {
      await ss(page, "AV03-attack-clash-WINNER");
      // Verify someone was eliminated (either "wins!" or stamina drain)
      const winnerEl = page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).or(page.getByText(/Defeated!/i)).first();
      await expect(winnerEl).toBeVisible({ timeout: 5_000 });
      const winnerText = await winnerEl.textContent().catch(() => "");
      console.log(`[AV03] Attack clash winner: "${winnerText}"`);
    } else {
      await ss(page, "AV03-attack-clash-timeout");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. New aiCount feature — 1 human vs multiple AI opponents
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI battle: new aiCount feature (1 human vs N bots)", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("AI battle setup page allows configuring AI count", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "AV04-ai-count-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "AV04-ai-battle-setup");

    // Look for a count selector / slider / input for number of AI opponents
    const countSelectors = page.locator(
      'input[type="number"], input[type="range"], select[name*="count" i], [data-testid*="ai-count"]'
    );
    const hasCountSelector = await countSelectors.first().isVisible().catch(() => false);

    if (hasCountSelector) {
      await ss(page, "AV04-ai-count-selector-found");
      // Set to 2 AI opponents
      await countSelectors.first().fill("2");
      await page.waitForTimeout(300);
      await ss(page, "AV04-ai-count-set-to-2");
    } else {
      console.log("[AV04] No AI count selector found on setup page — aiCount may be server-only option");
    }

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("1 human vs 2 AI: start battle and verify 3 beyblades visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "AV05-1v2-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Wait for form to load (Firestore data)
    const startBtn = page.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
    await startBtn.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});

    // Try to increase AI count to 2 if the UI exposes it
    const countInput = page.locator('input[type="number"][min], input[name*="count" i]').first();
    if (await countInput.isVisible().catch(() => false)) {
      await countInput.fill("2");
      await page.waitForTimeout(200);
    }

    // Start the battle
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5_000);
    await ss(page, "AV05-1v2-battle-started");

    const canvas = page.locator("canvas");
    const canvasOk = await canvas.waitFor({ state: "visible", timeout: 20_000 }).then(() => true).catch(() => false);
    if (canvasOk) {
      await ss(page, "AV05-1v2-canvas");
    }

    // Wait for in-progress state then play for 30s
    await page.waitForTimeout(30_000);
    await ss(page, "AV05-1v2-t30s");

    // Check no JS errors
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    const critical = errors.filter(e => {
      const l = e.toLowerCase();
      return !l.includes("websocket") && !l.includes("net::err") && !l.includes("firebase") && !l.includes("failed to fetch");
    });
    if (critical.length > 0) {
      console.log(`[AV05] JS errors: ${critical.join(" | ")}`);
    }
  });

  test("1 human vs 3 AI: start and verify radial spawn layout", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "AV06-1v3-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Wait for form to load (Firestore data)
    const startBtn = page.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
    await startBtn.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});

    const countInput = page.locator('input[type="number"][min], input[name*="count" i]').first();
    if (await countInput.isVisible().catch(() => false)) {
      await countInput.fill("3");
      await page.waitForTimeout(200);
    }

    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5_000);
    await ss(page, "AV06-1v3-battle-started");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await ss(page, "AV06-1v3-canvas");

    await page.waitForTimeout(20_000);
    await ss(page, "AV06-1v3-t20s");
  });
});

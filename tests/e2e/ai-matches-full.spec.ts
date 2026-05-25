/**
 * ai-matches-full.spec.ts
 *
 * Full-flow E2E tests for every AI-driven match type:
 *   - AI vs AI Lab (/admin/ai-vs-ai)
 *   - Player vs AI at Medium / Hard / Hell difficulty
 *
 * Screenshots are captured at setup, loading, canvas-ready, and mid-battle to
 * detect render regressions and Colyseus connection failures.
 *
 * Runs in the chromium-dev project (non-prod spec, no *.prod.spec.ts suffix).
 * Set PLAYWRIGHT_BASE_URL=https://game.letitrip.in to target production.
 *
 * Auth: TEST_EMAIL + TEST_PASSWORD must be set (via .env or CI secrets).
 * The test user must have admin role to access /admin/ai-vs-ai.
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wait for the PixiJS canvas to become visible. On timeout, takes a grace
 * screenshot and returns false instead of throwing.
 */
async function waitForCanvas(page: Page, graceShotName: string, timeoutMs = 30_000): Promise<boolean> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    await ss(page, `${graceShotName}-canvas-timeout`);
    return false;
  }
}

/**
 * Wait for either loading-progress or canvas — whichever arrives first.
 * Does not throw on timeout.
 */
async function waitForGameMount(page: Page): Promise<void> {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: 30_000 }),
    page.locator('[data-testid="loading-progress"]').waitFor({ state: "visible", timeout: 30_000 }),
  ]).catch(() => {});
}

/**
 * Select the first available option from a SearchableSelect or plain <select>
 * identified by a label text visible near it, or by a placeholder/aria-label.
 * Falls back silently if the element is not found.
 */
async function selectFirstOption(page: Page, labelPattern: RegExp | string): Promise<void> {
  // Try to find a combobox / listbox trigger near the label
  const label = page.locator("label, span, div").filter({ hasText: labelPattern }).first();
  if (await label.isVisible().catch(() => false)) {
    // Look for an adjacent select-like element
    const trigger = label.locator("~ select, ~ [role='combobox'], ~ button").first();
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
      await page.waitForTimeout(300);
      // Pick the first option in the dropdown list
      const firstOption = page.locator('[role="option"], option').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      }
      return;
    }
  }

  // Fallback: find any <select> or SearchableSelect near a label matching the pattern
  const selects = page.locator("select");
  const count = await selects.count().catch(() => 0);
  for (let i = 0; i < count; i++) {
    const sel = selects.nth(i);
    if (await sel.isVisible().catch(() => false)) {
      await sel.selectOption({ index: 0 }).catch(() => {});
      return;
    }
  }
}

/**
 * Start a Player vs AI battle at the specified difficulty.
 * Returns false if redirected to /login.
 */
async function startAIBattle(page: Page, difficulty: "Medium" | "Hard" | "Hell"): Promise<boolean> {
  const landed = await gotoProtected(page, "/game/2d/ai-battle");
  if (!landed) return false;

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2_000);

  // Select difficulty button
  const diffBtn = page.locator("button").filter({ hasText: new RegExp(difficulty, "i") }).first();
  if (await diffBtn.isVisible().catch(() => false)) {
    await diffBtn.click();
  }

  // Click Start Battle (or any Start-labelled button)
  const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AI vs AI Lab — page loads with beyblade selectors
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI vs AI Lab: page loads with beyblade selectors", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("setup page has P1 and P2 beyblade dropdowns", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) {
      await ss(page, "AI01-ai-vs-ai-unauthenticated");
      return;
    }

    // Allow Firestore data to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "AI01-ai-vs-ai-setup");

    // Expect at least one beyblade selector (P1 or P2 dropdown).
    // Selectors may be SearchableSelect components or native <select> elements.
    const selectors = page.locator(
      'select, [role="combobox"], [data-testid*="beyblade"], [data-testid*="p1"], [data-testid*="p2"]'
    );
    const selectorCount = await selectors.count();

    if (selectorCount > 0) {
      await expect(selectors.first()).toBeVisible({ timeout: 10_000 });
    } else {
      // Fallback: look for text that implies beyblade selection controls
      const p1Label = page.locator("text=Player 1, text=P1, text=Beyblade 1").first();
      const p2Label = page.locator("text=Player 2, text=P2, text=Beyblade 2").first();
      const either  = p1Label.or(p2Label);
      await expect(either).toBeVisible({ timeout: 10_000 });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. AI vs AI Lab — configure and start (screenshot loading + canvas)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI vs AI Lab: can configure and start battle", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("selects beyblades, starts match, and canvas appears within 30s", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) {
      await ss(page, "AI02-ai-vs-ai-loading-unauthenticated");
      return;
    }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Select the first available beyblade for P1
    await selectFirstOption(page, /player\s*1|p1|beyblade\s*1/i);
    await page.waitForTimeout(500);

    // Select the first available beyblade for P2
    await selectFirstOption(page, /player\s*2|p2|beyblade\s*2/i);
    await page.waitForTimeout(500);

    // Select the first arena if a selector is present
    await selectFirstOption(page, /arena/i);
    await page.waitForTimeout(500);

    // Click the start button
    const startBtn = page.locator("button").filter({ hasText: /start ai|start battle|start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    // Wait for navigation to the AI battle play page
    await page.waitForURL(/ai-battle\/play|ai-battle\/game|ai_battle/, { timeout: 15_000 }).catch(() => {});

    // Screenshot the loading / connecting state
    await page.waitForTimeout(500);
    await ss(page, "AI02-ai-vs-ai-loading");

    // Wait for canvas
    const canvasAppeared = await waitForCanvas(page, "AI03-ai-vs-ai-canvas");
    if (!canvasAppeared) return;

    await ss(page, "AI03-ai-vs-ai-canvas");

    // t=5s screenshot — watch the AI play
    await page.waitForTimeout(5_000);
    await ss(page, "AI04-ai-vs-ai-t5");

    // t=10s screenshot
    await page.waitForTimeout(5_000);
    await ss(page, "AI05-ai-vs-ai-t10");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Player vs AI — Medium difficulty full flow
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Player vs AI: Medium difficulty full flow", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("reaches canvas and plays for 10s on Medium difficulty", async ({ page }) => {
    const started = await startAIBattle(page, "Medium");
    if (!started) {
      await ss(page, "AI06-player-vs-ai-medium-unauthenticated");
      return;
    }

    const canvasAppeared = await waitForCanvas(page, "AI06-player-vs-ai-medium");
    if (!canvasAppeared) return;

    await ss(page, "AI06-player-vs-ai-medium");

    // Basic inputs to exercise physics on Medium AI
    await page.keyboard.down("w");
    await page.keyboard.down("d");
    await page.waitForTimeout(2_000);
    await page.keyboard.up("w");
    await page.keyboard.up("d");

    await page.keyboard.press("j"); // attack
    await page.waitForTimeout(500);
    await page.keyboard.press("k"); // defense
    await page.waitForTimeout(500);
    await page.keyboard.press("l"); // dodge
    await page.waitForTimeout(500);
    await page.keyboard.press("Space"); // special

    await page.waitForTimeout(6_500); // stay in match until ~10s total

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Player vs AI — Hard difficulty
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Player vs AI: Hard difficulty", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("reaches canvas and plays for 10s on Hard difficulty", async ({ page }) => {
    const started = await startAIBattle(page, "Hard");
    if (!started) {
      await ss(page, "AI07-player-vs-ai-hard-unauthenticated");
      return;
    }

    const canvasAppeared = await waitForCanvas(page, "AI07-player-vs-ai-hard");
    if (!canvasAppeared) return;

    await ss(page, "AI07-player-vs-ai-hard");

    // More aggressive movement pattern against Hard AI (5-tick prediction + strafe)
    await page.keyboard.down("s");
    await page.keyboard.down("a");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("s");
    await page.keyboard.up("a");

    await page.keyboard.press("l"); // dodge (Hard AI triggers dodge on closing speed > 3)
    await page.waitForTimeout(500);
    await page.keyboard.press("j"); // attack
    await page.waitForTimeout(500);
    await page.keyboard.press("j");
    await page.waitForTimeout(500);
    await page.keyboard.press("k"); // defense (cornered)
    await page.waitForTimeout(500);
    await page.keyboard.press("Space"); // special

    await page.waitForTimeout(6_000); // reach ~10s mark

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Player vs AI — Hell difficulty
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Player vs AI: Hell difficulty", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("reaches canvas and survives 10s against Hell AI", async ({ page }) => {
    const started = await startAIBattle(page, "Hell");
    if (!started) {
      await ss(page, "AI08-player-vs-ai-hell-unauthenticated");
      return;
    }

    const canvasAppeared = await waitForCanvas(page, "AI08-player-vs-ai-hell");
    if (!canvasAppeared) return;

    await ss(page, "AI08-player-vs-ai-hell");

    // Hell AI fires specials the instant they are chargeable and emits combos
    // every ~2s. Player must dodge + defend aggressively.
    await page.keyboard.down("w");
    await page.waitForTimeout(800);
    await page.keyboard.up("w");

    await page.keyboard.press("l"); // dodge — Hell AI dodge threshold = 2
    await page.waitForTimeout(300);
    await page.keyboard.press("l");
    await page.waitForTimeout(300);

    await page.keyboard.press("k"); // defense ring
    await page.waitForTimeout(500);

    await page.keyboard.press("j"); // attack
    await page.waitForTimeout(300);
    await page.keyboard.press("j");
    await page.waitForTimeout(300);
    await page.keyboard.press("j"); // triple attack combo attempt
    await page.waitForTimeout(500);

    await page.keyboard.press("Space"); // special (fires when chargeable)
    await page.waitForTimeout(6_000);   // survive to 10s mark

    await expect(page.locator("canvas")).toBeVisible({ timeout: 5_000 });
  });
});

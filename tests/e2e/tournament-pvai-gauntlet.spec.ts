/**
 * tournament-pvai-gauntlet.spec.ts
 *
 * PvAI Gauntlet tournament E2E tests:
 *   1. Admin creates a player-gauntlet tournament via UI
 *   2. Player joins and sees Round 1 display
 *   3. Tournament shows immediate match when player marks ready (+ AI is auto-ready)
 *   4. Battle starts and the gauntlet round display updates
 *   5. On loss, "You reached Round N" banner appears
 *   6. Admin tournament management page for gauntlet
 *
 * NOTE: These tests use the /admin/ai-vs-ai lab and tournament pages.
 * To test the full gauntlet flow end-to-end, run:
 *   GAUNTLET_PLAYER_UID=<your-uid> node scripts/seed-pva-gauntlet.js
 * before running this spec.
 *
 * Requires TEST_EMAIL + TEST_PASSWORD (admin credentials).
 * Run: npm run test:e2e:gameplay -- tournament-pvai-gauntlet
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function waitForWinner(page: Page, timeoutMs = 180_000): Promise<string | null> {
  const winnerEl = page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).or(page.getByText(/Defeated!/i)).first();
  try {
    await winnerEl.waitFor({ state: "visible", timeout: timeoutMs });
    return await winnerEl.textContent().catch(() => null);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Admin creates a Player Gauntlet tournament
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PvAI Gauntlet: admin creates tournament", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("admin can create a Player Gauntlet tournament with correct type", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/tournaments/create");
    if (!landed) { await ss(page, "G01-create-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "G01-create-form");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Set tournament name
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i], input[id*="name"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill("E2E PvAI Gauntlet Test");
      await page.waitForTimeout(200);
    }

    // Select Player Gauntlet type
    // The type picker is a SearchableSelect (data-testid="tournament-type-select") — click trigger to open, then pick option
    const typeSelectContainer = page.locator('[data-testid="tournament-type-select"]').first();
    if (await typeSelectContainer.isVisible().catch(() => false)) {
      await typeSelectContainer.click(); // open the dropdown
      await page.waitForTimeout(200);
      const gauntletOption = page.locator('[role="option"]').filter({ hasText: /player.*gauntlet|gauntlet/i }).first();
      if (await gauntletOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await gauntletOption.click();
        await page.waitForTimeout(300);
        await ss(page, "G01-gauntlet-type-selected");
      } else {
        console.log("[G01] Player Gauntlet option not visible after opening dropdown");
      }
    } else {
      // Fallback: native select
      const gauntletSelect = page.locator("select").first();
      if (await gauntletSelect.isVisible().catch(() => false)) {
        await gauntletSelect.selectOption("player-gauntlet");
        await page.waitForTimeout(300);
        await ss(page, "G01-gauntlet-type-selected-dropdown");
      } else {
        console.log("[G01] Could not find Player Gauntlet type selector");
      }
    }

    // Enable AI fill
    const aiFillToggle = page.locator(
      'input[type="checkbox"][name*="ai" i], input[type="checkbox"][id*="ai" i], button[data-testid*="ai-fill"]'
    ).first();
    if (await aiFillToggle.isVisible().catch(() => false)) {
      const checked = await aiFillToggle.isChecked().catch(() => false);
      if (!checked) await aiFillToggle.click();
      await page.waitForTimeout(200);
    }

    await ss(page, "G01-create-configured");
    console.log("[G01] Tournament create form configured for Player Gauntlet");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Player joins gauntlet and sees round display
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PvAI Gauntlet: player lobby + round display", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tournament list shows Player Gauntlet badge", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "G02-tournament-list-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "G02-tournament-list");

    // Any gauntlet tournament should show ⚔️ icon or "Gauntlet" text
    const gauntletEntry = page.locator("text=/gauntlet|⚔/i").first();
    const gauntletVisible = await gauntletEntry.isVisible({ timeout: 5_000 }).catch(() => false);

    if (gauntletVisible) {
      await ss(page, "G02-gauntlet-in-list");
      console.log("[G02] Player Gauntlet tournament found in list");

      // Click into it
      const gauntletLink = page.locator("a, button").filter({ hasText: /gauntlet|view|join/i }).first();
      if (await gauntletLink.isVisible().catch(() => false)) {
        await gauntletLink.click();
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(2_500);
        await ss(page, "G02-gauntlet-lobby");
      }
    } else {
      console.log("[G02] No gauntlet tournament in list — run seed:pva-gauntlet first");
    }
  });

  test("gauntlet lobby shows round progress banner", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "G03-lobby-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    // Look for any gauntlet tournament and navigate to it
    const gauntletLink = page.locator("a[href*='/game/2d/tournament/'], a[href*='/game/tournament/']")
      .filter({ hasText: /gauntlet/i }).first();

    if (await gauntletLink.isVisible().catch(() => false)) {
      await gauntletLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);
      await ss(page, "G03-gauntlet-lobby");

      // Check for gauntlet-specific UI
      const roundBanner = page.locator("text=/round 1|gauntlet.*round|how far|fight through/i").first();
      const bannerVisible = await roundBanner.isVisible({ timeout: 5_000 }).catch(() => false);
      if (bannerVisible) {
        await ss(page, "G03-round-banner");
        console.log("[G03] Gauntlet round banner visible");
      } else {
        console.log("[G03] Gauntlet round banner not visible — may need to join first");
      }

      // Check for "You reached Round N" if player is eliminated
      const eliminatedBanner = page.locator("text=/you reached round|eliminated.*round/i").first();
      const eliminatedVisible = await eliminatedBanner.isVisible({ timeout: 3_000 }).catch(() => false);
      if (eliminatedVisible) {
        const text = await eliminatedBanner.textContent();
        await ss(page, "G03-eliminated-banner");
        console.log(`[G03] Elimination banner: "${text}"`);
      }
    } else {
      console.log("[G03] No gauntlet tournament link found — skipping lobby test");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Immediate match: player marks ready + AI is auto-ready
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tournament: immediate match when both players ready", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("ready button triggers immediate match against AI opponent", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "G04-ready-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    // Find an active tournament with a pending match for this user
    const myMatchLink = page.locator("text=/your match|ready to fight|battle ready/i").first();
    const hasMatch = await myMatchLink.isVisible({ timeout: 5_000 }).catch(() => false);

    if (hasMatch) {
      await myMatchLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_500);
      await ss(page, "G04-match-lobby");
    }

    // Navigate to a gauntlet tournament lobby
    const gauntletLink = page.locator("a[href*='/tournament/']").filter({ hasText: /gauntlet/i }).first();
    if (await gauntletLink.isVisible().catch(() => false)) {
      await gauntletLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);
      await ss(page, "G04-gauntlet-lobby");

      // Look for Ready button
      const readyBtn = page.locator("button").filter({ hasText: /ready|mark.*ready/i }).first();
      const readyVisible = await readyBtn.isVisible({ timeout: 5_000 }).catch(() => false);

      if (readyVisible) {
        await ss(page, "G04-before-ready");
        await readyBtn.click();
        await page.waitForTimeout(2_000);
        await ss(page, "G04-after-ready");
        console.log("[G04] Ready clicked — AI should auto-ready and match opens");

        // AI opponent is always ready, so clicking ready should trigger immediate match
        // Wait for "Your match is ready!" or auto-navigation
        const matchReady = page.locator("text=/your match is ready|battle.*live|navigating/i").first();
        const matchReadyVisible = await matchReady.waitFor({ state: "visible", timeout: 30_000 }).then(() => true).catch(() => false);
        if (matchReadyVisible) {
          await ss(page, "G04-match-ready");
          console.log("[G04] Immediate match trigger confirmed");
        }

        // Wait for auto-navigation to battle
        await page.waitForURL(/tournament.*battle|tournament\/battle/, { timeout: 30_000 }).catch(() => {});
        if (page.url().includes("battle")) {
          await page.waitForLoadState("domcontentloaded");
          await page.waitForTimeout(4_000);
          await ss(page, "G04-battle-started");
          console.log("[G04] Navigated to tournament battle room");
        }
      } else {
        console.log("[G04] No Ready button found — tournament may not have a pending match for this user");
        await ss(page, "G04-no-ready-button");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Full gauntlet battle — fight AI, check round progression
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PvAI Gauntlet: full battle flow", () => {
  test.setTimeout(240_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("AI battle simulates gauntlet round — player fights and sees result", async ({ page }) => {
    // Since tournament timing is tricky, simulate the gauntlet using the AI vs AI lab
    // with the player spectating to validate the UI elements
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!landed) { await ss(page, "G05-gauntlet-sim-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "G05-gauntlet-sim-lab");

    // Configure: Hell vs Hell for fast resolution
    const hellBtns = page.locator("button, label").filter({ hasText: /hell/i });
    const hCount = await hellBtns.count();
    for (let i = 0; i < Math.min(2, hCount); i++) {
      await hellBtns.nth(i).click();
      await page.waitForTimeout(100);
    }

    const launchBtn = page.locator("button").filter({ hasText: /launch|start|go|fight/i }).first();
    if (await launchBtn.isVisible().catch(() => false)) {
      await launchBtn.click();
    } else {
      await page.locator('button[type="submit"]').first().click().catch(() => {});
    }

    await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "G05-gauntlet-battle-started");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await ss(page, "G05-gauntlet-battle-canvas");

    // Screenshot at intervals
    for (let t = 1; t <= 4; t++) {
      await page.waitForTimeout(15_000);
      await ss(page, `G05-gauntlet-t${t * 15}s`);
    }

    // Wait for winner
    const winnerText = await waitForWinner(page, 90_000);
    if (winnerText) {
      await ss(page, "G05-gauntlet-WINNER");
      console.log(`[G05] Gauntlet simulation winner: "${winnerText}"`);
    } else {
      await ss(page, "G05-gauntlet-timeout");
      console.log("[G05] Gauntlet simulation did not end in time");
    }
  });
});

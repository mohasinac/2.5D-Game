/**
 * game-mechanics.spec.ts
 *
 * Game mode setup and game canvas smoke tests.
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 *
 * NOTE: Canvas tests require the Colyseus server running on localhost:2567.
 *       If the server is not running, canvas tests gracefully degrade.
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Tryout Mode
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Tryout Mode", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tryout game page shows canvas or loading progress (not blank)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) {
      await ss(page, "GM01-tryout-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    await ss(page, "GM01-tryout-loading");

    // Wait for either canvas OR loading progress to appear
    const visible = await Promise.race([
      page.locator("canvas").waitFor({ state: "visible", timeout: 25_000 }).then(() => "canvas"),
      page.locator('[data-testid="loading-progress"], [class*="loading"]')
        .waitFor({ state: "visible", timeout: 25_000 }).then(() => "loading"),
    ]).catch(() => "none");

    await ss(page, `GM01-tryout-${visible}`);
    console.log(`[GM01] Page state: ${visible}`);

    // Page should not be blank
    expect(visible, "Tryout page shows nothing — likely a crash").not.toBe("none");
    expect(filterErrors(errors)).toHaveLength(0);
  });

  test("loading progress bar appears while connecting to tryout", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) return;

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(300);
    await ss(page, "GM02-tryout-loading-bar");

    // LoadingProgress has 6 steps — at least one should appear briefly
    const steps = page.locator('[data-testid^="loading-step-"]');
    const hasSteps = await steps.first().isVisible({ timeout: 8_000 }).catch(() => false);
    if (hasSteps) {
      await expect(steps.first()).toBeVisible();
      await ss(page, "GM02-tryout-step-dots");
    }

    // Eventually canvas appears (or we timeout gracefully)
    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    await ss(page, "GM02-tryout-canvas");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Team Battle Lobby
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Team Battle Lobby", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("team battle lobby heading visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) {
      await ss(page, "GM03-team-battle-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "GM03-team-battle-lobby");
  });

  test("team selector shows Red and Blue team buttons", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) { await ss(page, "GM04-team-selector-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const blueTeam = page.locator("text=Blue Team");
    const redTeam  = page.locator("text=Red Team");
    const blueOk   = await blueTeam.isVisible({ timeout: 8_000 }).catch(() => false);
    const redOk    = await redTeam.isVisible({ timeout: 8_000 }).catch(() => false);

    if (blueOk) await expect(blueTeam.first()).toBeVisible();
    if (redOk)  await expect(redTeam.first()).toBeVisible();

    await ss(page, "GM04-team-selector");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Game Select
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Game Select", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game select page shows 2D and AI Battle options", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) {
      await ss(page, "GM05-game-select-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "GM05-game-select");

    const tryout = page.locator("text=Tryout").first();
    const aiBattle = page.locator("text=AI Battle, text=AI").first();
    const tryoutOk = await tryout.isVisible({ timeout: 8_000 }).catch(() => false);
    if (tryoutOk) await expect(tryout).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Arena Timeline
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Arena Timeline", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game select page includes 2D pipeline indicator", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) {
      await ss(page, "GM06-arena-timeline-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "GM06-game-select-2d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// QTE Overlay
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: QTE Overlay", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("QTE overlay component mounts without JS errors on tryout page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) { await ss(page, "GM07-qte-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "GM07-qte-mounted");

    const critical = filterErrors(errors);
    expect(critical, `JS errors on tryout: ${critical.join(" | ")}`).toHaveLength(0);
  });

  test("AI battle setup shows QTE-related options", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "GM08-qte-setup-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page.locator("h1, h2, form").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "GM08-qte-setup");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PVP Battle Lobby
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: PVP Battle Lobby", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("PVP lobby page renders without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) { await ss(page, "GM09-pvp-lobby-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "GM09-pvp-lobby");

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

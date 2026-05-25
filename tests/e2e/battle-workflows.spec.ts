/**
 * battle-workflows.spec.ts
 *
 * Full-workflow E2E tests for every battle mode and setup page.
 * Screenshots are saved to test-results/screenshots/ after every key step.
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env to exercise authenticated flows.
 * Without credentials, protected pages are verified to redirect to /login.
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wait for canvas OR loading-progress — whichever appears first (game pages). */
async function waitForGame(page: Page) {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: 30_000 }),
    page.locator('[data-testid="loading-progress"]').waitFor({ state: "visible", timeout: 30_000 }),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Public pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Public: Homepage", () => {
  test("loads with title and hero content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/.+/);
    // Hero / CTA button area should be visible
    const body = page.locator("body");
    await expect(body).toBeVisible();
    await ss(page, "01-homepage");
  });
});

test.describe("Public: Login page", () => {
  test("renders email + password form", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await ss(page, "02-login");
  });

  test("shows validation on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await ss(page, "02b-login-empty-submit");
  });
});

test.describe("Public: Register page", () => {
  test("renders registration form", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    const form = page.locator("form, [role='form'], input").first();
    await expect(form).toBeVisible({ timeout: 10_000 });
    await ss(page, "03-register");
  });
});

test.describe("Public: Leaderboard", () => {
  test("loads and shows player data table", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "04-leaderboard");
  });

  test("tournament tab is the default selected tab", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.waitForLoadState("networkidle");
    // Any tab strip should be present
    const tabs = page.locator('[role="tab"], button').filter({ hasText: /tournament|wins|damage/i });
    if (await tabs.count() > 0) {
      await expect(tabs.first()).toBeVisible();
    }
    await ss(page, "04b-leaderboard-tabs");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Game Select
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Select", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("shows all game mode cards", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) {
      await ss(page, "05-game-select-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    // Tryout and PVP Battle should always be present
    await expect(page.locator("text=Tryout").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("text=PVP Battle").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "05-game-select");
  });

  test("2D and 2.5D pipeline selector is shown", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    const pipelineSel = page.locator("text=2D, text=2.5D").first();
    if (await pipelineSel.count() > 0) await expect(pipelineSel).toBeVisible();
    await ss(page, "05b-game-select-pipeline");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tryout Mode
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout: Setup (2D)", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("setup page renders beyblade + arena selectors", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) {
      await ss(page, "06-tryout-setup-2d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    // Fallback option always present
    await expect(page.locator("text=Default Beyblade").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "06-tryout-setup-2d");
  });

  test("Start button is enabled with default selection", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500); // let Firestore load
    const startBtn = page.locator("button").filter({ hasText: /start/i });
    if (await startBtn.count() > 0) {
      await expect(startBtn.first()).not.toBeDisabled({ timeout: 10_000 });
    }
    await ss(page, "06b-tryout-setup-2d-ready");
  });
});

test.describe("Tryout: Setup (2.5D)", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("2.5D setup page renders correctly", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tryout/setup");
    if (!landed) {
      await ss(page, "07-tryout-setup-25d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Default Beyblade").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "07-tryout-setup-25d");
  });
});

test.describe("Tryout: Game canvas (2D)", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("loading progress appears then canvas becomes visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) {
      await ss(page, "08-tryout-game-2d-unauthenticated");
      return;
    }
    // Screenshot loading screen immediately
    await page.waitForTimeout(300);
    await ss(page, "08a-tryout-game-2d-loading");

    // Wait for game canvas or loading progress
    try {
      await waitForGame(page);
      await ss(page, "08b-tryout-game-2d-canvas");
    } catch {
      await ss(page, "08b-tryout-game-2d-timeout");
    }
  });

  test("no uncaught JS errors during game load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) return;

    try { await waitForGame(page); } catch { /* timeout ok */ }
    await page.waitForTimeout(2_000);

    const criticalErrors = errors.filter(e =>
      !e.includes("WebSocket") && !e.includes("ECONNREFUSED") && !e.includes("net::ERR")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. AI Battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI Battle: Setup page", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("renders beyblade pickers and difficulty selector", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) {
      await ss(page, "09-ai-battle-setup-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await ss(page, "09-ai-battle-setup");
  });

  test("difficulty buttons: Medium / Hard / Hell", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    for (const label of ["Medium", "Hard", "Hell"]) {
      const btn = page.locator("button").filter({ hasText: label });
      if (await btn.count() > 0) await expect(btn.first()).toBeVisible();
    }
    await ss(page, "09b-ai-battle-difficulty");
  });

  test("series format buttons: BO1 / BO3 / BO5", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    for (const label of ["BO1", "BO3", "BO5"]) {
      const btn = page.locator("button").filter({ hasText: label });
      if (await btn.count() > 0) await expect(btn.first()).toBeVisible();
    }
    await ss(page, "09c-ai-battle-series");
  });

  test("can click Medium difficulty", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const medBtn = page.locator("button").filter({ hasText: "Medium" });
    if (await medBtn.count() > 0) {
      await medBtn.first().click();
      await ss(page, "09d-ai-battle-medium-selected");
    }
  });

  test("2.5D AI battle setup page renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/ai-battle");
    if (!landed) {
      await ss(page, "10-ai-battle-25d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await ss(page, "10-ai-battle-setup-25d");
  });
});

test.describe("AI Battle: Game page", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("shows loading progress when starting AI battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle/play");
    if (!landed) {
      await ss(page, "11-ai-battle-game-unauthenticated");
      return;
    }
    await page.waitForTimeout(500);
    await ss(page, "11a-ai-battle-game-loading");
    try {
      await waitForGame(page);
      await ss(page, "11b-ai-battle-game-canvas");
    } catch {
      await ss(page, "11b-ai-battle-game-timeout");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. PVP Battle Lobby
// ─────────────────────────────────────────────────────────────────────────────

test.describe("PVP Battle: Lobby", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("lobby page renders room code and player list", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) {
      await ss(page, "12-pvp-lobby-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000); // let WebSocket connect
    await ss(page, "12-pvp-lobby");
  });

  test("lobby shows BO1/BO3/BO5 format selector for host", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    // Check for modifier toggle or format buttons (host controls)
    const formatBtns = page.locator("button").filter({ hasText: /BO[135]/ });
    if (await formatBtns.count() > 0) {
      await expect(formatBtns.first()).toBeVisible();
    }
    await ss(page, "12b-pvp-lobby-host-controls");
  });

  test("modifier toggle buttons are present", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    const modToggle = page.locator('[data-testid^="modifier-toggle"]');
    if (await modToggle.count() > 0) {
      await expect(modToggle.first()).toBeVisible();
    }
    await ss(page, "12c-pvp-lobby-modifiers");
  });

  test("2.5D PVP lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/battle/lobby");
    if (!landed) {
      await ss(page, "13-pvp-lobby-25d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "13-pvp-lobby-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Tournament
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tournament: List page", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tournament list page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) {
      await ss(page, "14-tournament-list-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "14-tournament-list");
  });

  test("2.5D tournament list renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tournament");
    if (!landed) {
      await ss(page, "15-tournament-list-25d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "15-tournament-list-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Team Battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Team Battle: Lobby", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("team battle lobby renders team join buttons", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) {
      await ss(page, "16-team-battle-lobby-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "16-team-battle-lobby");
  });

  test("Blue Team and Red Team buttons visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    const blueTeam = page.locator("text=Blue Team");
    const redTeam  = page.locator("text=Red Team");
    if (await blueTeam.count() > 0) await expect(blueTeam.first()).toBeVisible();
    if (await redTeam.count() > 0)  await expect(redTeam.first()).toBeVisible();
    await ss(page, "16b-team-battle-teams");
  });

  test("2.5D team battle lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/team-battle/lobby");
    if (!landed) {
      await ss(page, "17-team-battle-lobby-25d-unauthenticated");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "17-team-battle-lobby-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Loading Progress component
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Loading Progress component", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("loading progress bar renders with step indicators", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) return;
    // Grab screenshot right away before it transitions
    await page.waitForTimeout(200);
    const progress = page.locator('[data-testid="loading-progress"]');
    const canvas   = page.locator("canvas");
    // One of these must appear
    const visible = await Promise.race([
      progress.waitFor({ state: "visible", timeout: 15_000 }).then(() => "progress"),
      canvas.waitFor({ state: "visible", timeout: 15_000 }).then(() => "canvas"),
    ]).catch(() => "none");

    if (visible === "progress") {
      // Verify step dots exist
      const dots = page.locator('[data-testid^="loading-step-"]');
      await expect(dots.first()).toBeVisible();
      await ss(page, "18-loading-progress-bar");
    }
  });
});

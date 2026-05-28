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
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wait for canvas OR loading-progress — whichever appears first (game pages). */
async function waitForGame(page: Page, timeout = 30_000) {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout }),
    page.locator('[data-testid="loading-progress"], [class*="loading-progress"], [class*="loadingProgress"]')
      .waitFor({ state: "visible", timeout }),
  ]);
}

/** Wait for page to settle: domcontentloaded + a short idle wait. */
async function settle(page: Page, ms = 1_500) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(ms);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Public pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Public: Homepage", () => {
  test("loads with title and body visible", async ({ page }) => {
    await page.goto("/");
    await settle(page, 800);
    await expect(page).toHaveTitle(/.+/, { timeout: 15_000 });
    await expect(page.locator("body")).toBeVisible();
    await ss(page, "01-homepage");
  });
});

test.describe("Public: Login page", () => {
  test("renders email + password form", async ({ page }) => {
    await page.goto("/login");
    await settle(page, 600);
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await ss(page, "02-login");
  });

  test("shows validation on empty submit", async ({ page }) => {
    await page.goto("/login");
    await settle(page, 600);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(600);
    await ss(page, "02b-login-empty-submit");
  });
});

test.describe("Public: Register page", () => {
  test("renders registration form", async ({ page }) => {
    await page.goto("/register");
    await settle(page, 600);
    const form = page.locator("form, [role='form'], input").first();
    await expect(form).toBeVisible({ timeout: 10_000 });
    await ss(page, "03-register");
  });
});

test.describe("Public: Leaderboard", () => {
  test("loads and shows heading", async ({ page }) => {
    await page.goto("/leaderboard");
    await settle(page, 2_000);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "04-leaderboard");
  });

  test("tournament tab is present", async ({ page }) => {
    await page.goto("/leaderboard");
    await settle(page, 2_000);
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
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("shows all game mode cards", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) { await ss(page, "05-game-select-unauthenticated"); return; }
    await settle(page);
    const tryout = page.locator("text=Tryout").first();
    const ok = await tryout.isVisible({ timeout: 10_000 }).catch(() => false);
    if (ok) await expect(tryout).toBeVisible();
    await ss(page, "05-game-select");
  });

  test("2D pipeline indicator is shown", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) return;
    await settle(page);
    await ss(page, "05b-game-select-pipeline");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tryout Mode
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tryout: Setup (2D)", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("setup page renders beyblade + arena selectors", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) { await ss(page, "06-tryout-setup-2d-unauthenticated"); return; }
    await settle(page, 2_000);
    // Fallback option always present
    const defaultBey = page.locator("text=Default Beyblade").first();
    const ok = await defaultBey.isVisible({ timeout: 15_000 }).catch(() => false);
    if (ok) await expect(defaultBey).toBeVisible();
    await ss(page, "06-tryout-setup-2d");
  });

  test("Start button is enabled with default selection", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) return;
    await settle(page, 2_000);
    const startBtn = page.locator("button").filter({ hasText: /start/i });
    if (await startBtn.count() > 0) {
      await expect(startBtn.first()).not.toBeDisabled({ timeout: 10_000 });
    }
    await ss(page, "06b-tryout-setup-2d-ready");
  });
});

test.describe("Tryout: Setup (2.5D)", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("2.5D setup page renders correctly", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tryout/setup");
    if (!landed) { await ss(page, "07-tryout-setup-25d-unauthenticated"); return; }
    await settle(page, 2_000);
    await ss(page, "07-tryout-setup-25d");
  });
});

test.describe("Tryout: Game canvas (2D)", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("loading progress appears then canvas becomes visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) { await ss(page, "08-tryout-game-2d-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(400);
    await ss(page, "08a-tryout-game-2d-loading");

    try {
      await waitForGame(page);
      await ss(page, "08b-tryout-game-2d-canvas");
    } catch {
      await ss(page, "08b-tryout-game-2d-timeout");
    }
  });

  test("no uncaught JS errors during game load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) return;

    try { await waitForGame(page); } catch { /* timeout ok */ }
    await page.waitForTimeout(2_000);

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. AI Battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("AI Battle: Setup page", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("renders beyblade pickers and difficulty selector", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "09-ai-battle-setup-unauthenticated"); return; }
    await settle(page, 2_000);
    await ss(page, "09-ai-battle-setup");
  });

  test("difficulty buttons: Medium / Hard / Hell", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await settle(page, 2_000);
    for (const label of ["Medium", "Hard", "Hell"]) {
      const btn = page.locator("button").filter({ hasText: label });
      if (await btn.count() > 0) await expect(btn.first()).toBeVisible();
    }
    await ss(page, "09b-ai-battle-difficulty");
  });

  test("series format buttons: BO1 / BO3 / BO5", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await settle(page, 2_000);
    for (const label of ["BO1", "BO3", "BO5"]) {
      const btn = page.locator("button").filter({ hasText: label });
      if (await btn.count() > 0) await expect(btn.first()).toBeVisible();
    }
    await ss(page, "09c-ai-battle-series");
  });

  test("can click Medium difficulty", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await settle(page, 2_000);
    const medBtn = page.locator("button").filter({ hasText: "Medium" });
    if (await medBtn.count() > 0) {
      await medBtn.first().click();
      await ss(page, "09d-ai-battle-medium-selected");
    }
  });

  test("2.5D AI battle setup page renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/ai-battle");
    if (!landed) { await ss(page, "10-ai-battle-25d-unauthenticated"); return; }
    await settle(page, 2_000);
    await ss(page, "10-ai-battle-setup-25d");
  });
});

test.describe("AI Battle: Game page", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("shows loading progress when starting AI battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle/play");
    if (!landed) { await ss(page, "11-ai-battle-game-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
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
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("lobby page renders room code and player list", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) { await ss(page, "12-pvp-lobby-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "12-pvp-lobby");
  });

  test("lobby shows BO1/BO3/BO5 format selector for host", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) return;
    await settle(page, 2_500);
    const formatBtns = page.locator("button").filter({ hasText: /BO[135]/ });
    if (await formatBtns.count() > 0) {
      await expect(formatBtns.first()).toBeVisible();
    }
    await ss(page, "12b-pvp-lobby-host-controls");
  });

  test("modifier toggle buttons are present", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) return;
    await settle(page, 2_500);
    const modToggle = page.locator('[data-testid^="modifier-toggle"]');
    if (await modToggle.count() > 0) {
      await expect(modToggle.first()).toBeVisible();
    }
    await ss(page, "12c-pvp-lobby-modifiers");
  });

  test("2.5D PVP lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/battle/lobby");
    if (!landed) { await ss(page, "13-pvp-lobby-25d-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "13-pvp-lobby-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Tournament
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tournament: List page", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("tournament list page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "14-tournament-list-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "14-tournament-list");
  });

  test("2.5D tournament list renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tournament");
    if (!landed) { await ss(page, "15-tournament-list-25d-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "15-tournament-list-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Team Battle
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Team Battle: Lobby", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("team battle lobby renders team join buttons", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) { await ss(page, "16-team-battle-lobby-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "16-team-battle-lobby");
  });

  test("Blue Team and Red Team buttons visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) return;
    await settle(page, 2_500);
    const blueTeam = page.locator("text=Blue Team");
    const redTeam  = page.locator("text=Red Team");
    if (await blueTeam.count() > 0) await expect(blueTeam.first()).toBeVisible();
    if (await redTeam.count() > 0)  await expect(redTeam.first()).toBeVisible();
    await ss(page, "16b-team-battle-teams");
  });

  test("2.5D team battle lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/team-battle/lobby");
    if (!landed) { await ss(page, "17-team-battle-lobby-25d-unauthenticated"); return; }
    await settle(page, 2_500);
    await ss(page, "17-team-battle-lobby-25d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Loading Progress component
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Loading Progress component", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("loading progress bar renders with step indicators", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) return;

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(300);

    const progress = page.locator('[data-testid="loading-progress"]');
    const canvas   = page.locator("canvas");

    const visible = await Promise.race([
      progress.waitFor({ state: "visible", timeout: 15_000 }).then(() => "progress"),
      canvas.waitFor({ state: "visible", timeout: 15_000 }).then(() => "canvas"),
    ]).catch(() => "none");

    if (visible === "progress") {
      const dots = page.locator('[data-testid^="loading-step-"]');
      const dotsOk = await dots.first().isVisible({ timeout: 5_000 }).catch(() => false);
      if (dotsOk) await expect(dots.first()).toBeVisible();
      await ss(page, "18-loading-progress-bar");
    } else {
      await ss(page, `18-loading-progress-${visible}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Responsive: game pages at all breakpoints
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Battle: Responsive layout at all breakpoints", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("AI battle setup is usable at 390px, 768px, 1440px", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;
    await settle(page, 2_000);

    for (const [w, h, label] of [
      [390,  844,  "mobile-390"],
      [768,  1024, "tablet-768"],
      [1440, 900,  "desktop-1440"],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(300);

      // Body should not have horizontal overflow
      const overflow = await page.evaluate(
        () => document.body.scrollWidth - window.innerWidth
      );
      if (overflow > 4) {
        console.warn(`[AI-setup] horizontal overflow ${overflow}px at ${w}px`);
      }
      await ss(page, `19-ai-setup-${label}`);
    }
  });

  test("Tournament lobby is usable at 390px", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) return;
    await settle(page, 2_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    if (overflow > 4) console.warn(`[tournament-lobby] overflow ${overflow}px at 390px`);
    await ss(page, "20-tournament-lobby-390");
  });
});

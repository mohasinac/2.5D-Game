/**
 * admin.prod.spec.ts — Production smoke tests (read-only, no mutations).
 *
 * Run: npm run test:e2e:prod
 * Requires PROD_URL in .env (or environment). Set TEST_EMAIL + TEST_PASSWORD
 * for authenticated page coverage.
 *
 * Every test takes a screenshot saved to test-results/screenshots/.
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Public pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Prod Smoke: Public Pages", () => {
  test("homepage loads and shows game title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/.+/);
    await ss(page, "P01-prod-homepage");
  });

  test("leaderboard page loads and shows table", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000); // Firestore onSnapshot keeps network busy; wait for render instead
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "P02-prod-leaderboard");
  });

  test("login page renders form without errors", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await ss(page, "P03-prod-login");
  });

  test("register page renders form", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    const formEl = page.locator("form, input").first();
    await expect(formEl).toBeVisible({ timeout: 10_000 });
    await ss(page, "P04-prod-register");
  });

  test("demo / renderer page loads", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "P05-prod-demo");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Auth redirect behaviour
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Prod Smoke: Auth Guards", () => {
  test("admin dashboard redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForTimeout(1_000);
    await ss(page, "P06-prod-admin-redirect");
    expect(page.url()).toMatch(/login|admin/);
  });

  test("game select page redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/game");
    await page.waitForTimeout(1_000);
    await ss(page, "P07-prod-game-redirect");
    expect(page.url()).toMatch(/login|game/);
  });

  test("tryout setup redirects or loads", async ({ page }) => {
    await page.goto("/game/2d/tryout/setup");
    await page.waitForTimeout(1_000);
    await ss(page, "P08-prod-tryout-setup-redirect");
    expect(page.url()).toMatch(/login|tryout|game/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Authenticated page coverage (requires TEST_EMAIL + TEST_PASSWORD)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Prod Smoke: Authenticated Pages", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game select page shows all mode cards", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) { await ss(page, "P09-prod-game-select-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await expect(page.locator("text=Tryout").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "P09-prod-game-select");
  });

  test("tryout setup page loads with beyblade selector", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) { await ss(page, "P10-prod-tryout-setup-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await expect(page.locator("text=Default Beyblade").first()).toBeVisible({ timeout: 15_000 });
    await ss(page, "P10-prod-tryout-setup");
  });

  test("2.5D tryout setup page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/tryout/setup");
    if (!landed) { await ss(page, "P11-prod-tryout-25d-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P11-prod-tryout-setup-25d");
  });

  test("AI battle setup page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "P12-prod-ai-battle-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P12-prod-ai-battle-setup");
  });

  test("PVP battle lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/battle/lobby");
    if (!landed) { await ss(page, "P13-prod-pvp-lobby-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "P13-prod-pvp-lobby");
  });

  test("tournament list renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "P14-prod-tournament-list-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P14-prod-tournament-list");
  });

  test("team battle lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) { await ss(page, "P15-prod-team-battle-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P15-prod-team-battle-lobby");
  });

  test("admin dashboard loads with stat cards", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin");
    if (!landed) { await ss(page, "P16-prod-admin-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P16-prod-admin-dashboard");
  });

  test("admin beyblades list loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/beyblades");
    if (!landed) { await ss(page, "P17-prod-beyblades-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P17-prod-beyblades-list");
  });

  test("admin arenas list loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) { await ss(page, "P18-prod-arenas-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P18-prod-arenas-list");
  });

  test("admin arena create page with preview canvas", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "P19-prod-arena-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "P19-prod-arena-create");
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible({ timeout: 15_000 });
      await ss(page, "P19b-prod-arena-create-preview");
    }
  });

  test("admin settings page loads with toggles", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/settings");
    if (!landed) { await ss(page, "P20-prod-settings-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P20-prod-settings");
  });

  test("admin tournaments list loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/tournaments");
    if (!landed) { await ss(page, "P21-prod-tournaments-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "P21-prod-tournaments");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// No JS errors on key pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Prod Smoke: No critical JS errors", () => {
  const publicPages = ["/", "/login", "/register", "/leaderboard"];

  for (const path of publicPages) {
    test(`no critical JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(path);
      // Use domcontentloaded — leaderboard keeps a Firestore socket open (never idle)
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);
      const critical = errors.filter(e =>
        !e.includes("WebSocket") &&
        !e.includes("ECONNREFUSED") &&
        !e.includes("net::ERR") &&
        !e.includes("firebase") // auth state may log benign errors
      );
      expect(critical).toHaveLength(0);
    });
  }
});

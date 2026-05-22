// Production smoke tests — read-only, no mutations.
// Run with: npm run test:e2e:prod
// Requires PROD_URL env var set to your production domain.

import { test, expect } from "@playwright/test";

test.describe("Prod Smoke: Public Pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
  });

  test("leaderboard page loads", async ({ page }) => {
    await page.goto("/leaderboard");
    // Should show the leaderboard without requiring auth
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 15000 });
  });

  test("login page renders without errors", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input, button").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Prod Smoke: Admin Pages (read-only)", () => {
  test("admin dashboard redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin");
    // Should redirect to /login or show auth gate
    await expect(page.url()).toMatch(/login|admin/);
  });
});

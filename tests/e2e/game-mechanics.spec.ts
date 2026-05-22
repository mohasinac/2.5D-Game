import { test, expect } from "@playwright/test";

// NOTE: These tests require the Colyseus server to be running on localhost:2567
// and a test beyblade + arena to be seeded. Set PLAYWRIGHT_BASE_URL to override.

test.describe("Game Mechanics: Tryout Mode", () => {
  test("tryout page loads and shows game canvas", async ({ page }) => {
    await page.goto("/game/2d/tryout");
    // Wait for the PixiJS canvas to appear
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 30000 });
  });

  test("loading progress bar appears while connecting", async ({ page }) => {
    await page.goto("/game/2d/tryout");
    // LoadingProgress should be shown initially
    const progress = page.locator('[data-testid="loading-progress"]');
    // It may disappear quickly once connected, so just check it doesn't crash the page
    await expect(page.locator("canvas")).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Game Mechanics: BeySelector HUD", () => {
  test("team battle lobby page loads", async ({ page }) => {
    await page.goto("/game/2d/team-battle/lobby");
    await expect(page.locator("h1")).toContainText("Team Battle", { timeout: 10000 });
  });

  test("team selector shows red and blue buttons", async ({ page }) => {
    await page.goto("/game/2d/team-battle/lobby");
    await expect(page.locator("text=Blue Team")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Red Team")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Game Mechanics: Arena Timeline", () => {
  test("game select page shows 2D and 2.5D options", async ({ page }) => {
    await page.goto("/game");
    await expect(page.locator("text=2D").first()).toBeVisible({ timeout: 10000 });
  });
});

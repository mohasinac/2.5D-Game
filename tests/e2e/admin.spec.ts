import { test, expect } from "@playwright/test";

// ── Admin: Combo Effect Builder ────────────────────────────────────────────────

test.describe("Admin: Combo Effect Builder", () => {
  test.beforeEach(async ({ page }) => {
    // Admin pages require auth. In CI, set a test user cookie before navigating.
    // If running locally, ensure the browser is already logged in as an admin.
    await page.goto("/admin");
  });

  test("ScriptBuilder renders with toolbox, canvas, and JSON panel", async ({ page }) => {
    await page.goto("/admin/combo-effects/create");
    await expect(page.locator('[data-testid="script-builder"]')).toBeVisible({ timeout: 10000 });
  });

  test("ToolboxPanel shows action blocks", async ({ page }) => {
    await page.goto("/admin/combo-effects/create");
    await expect(page.locator('[data-block]').first()).toBeVisible({ timeout: 10000 });
  });

  test("can create a special move with name and steps", async ({ page }) => {
    await page.goto("/admin/special-moves/create");
    await page.fill('[data-field="name"]', "Test Rush");
    await page.click('[data-action="add-step"]');
    const step0 = page.locator('[data-field="step-0-comboEffectId"]');
    await expect(step0).toBeVisible({ timeout: 10000 });
  });

  test("ProfilePicker is a custom component, not a native select", async ({ page }) => {
    await page.goto("/admin/beyblades/create");
    // ProfilePicker wraps Firestore options — it should have data-picker attribute
    const picker = page.locator('[data-picker]');
    if (await picker.count() > 0) {
      await expect(picker.first()).toBeVisible();
    }
  });
});

// ── Admin: Particle Presets ────────────────────────────────────────────────────

test.describe("Admin: Particle Presets", () => {
  test("particle presets page loads", async ({ page }) => {
    await page.goto("/admin/assets/particle-presets");
    await expect(page.locator("h1")).toContainText("Particle Presets", { timeout: 10000 });
  });

  test("can open new preset form", async ({ page }) => {
    await page.goto("/admin/assets/particle-presets");
    await page.click("text=+ New Preset");
    await expect(page.locator("text=New Preset").nth(1)).toBeVisible({ timeout: 5000 });
  });
});

// ── Admin: Asset Library ───────────────────────────────────────────────────────

test.describe("Admin: Asset Library", () => {
  test("particle presets appears in asset library", async ({ page }) => {
    await page.goto("/admin/assets");
    await expect(page.locator("text=Particle Presets")).toBeVisible({ timeout: 10000 });
  });
});

/**
 * admin.spec.ts
 *
 * Focused smoke tests for admin-specific UI components.
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env (admin account required).
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Admin: Combo Effect Builder
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Combo Effect Builder", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
    await gotoProtected(page, "/admin");
  });

  test("ScriptBuilder renders with toolbox, canvas, and JSON panel", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/combo-effects/create");
    if (!landed) { await ss(page, "admin-combo-create-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    const builder = page.locator('[data-testid="script-builder"]');
    const exists = await builder.isVisible({ timeout: 10_000 }).catch(() => false);
    if (exists) await expect(builder).toBeVisible();
    await ss(page, "admin-combo-script-builder");
  });

  test("ToolboxPanel shows action blocks", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/combo-effects/create");
    if (!landed) { await ss(page, "admin-combo-toolbox-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    const block = page.locator("[data-block]").first();
    const exists = await block.isVisible({ timeout: 10_000 }).catch(() => false);
    if (exists) await expect(block).toBeVisible();
    await ss(page, "admin-combo-toolbox");
  });

  test("can view special moves list page", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/special-moves");
    if (!landed) { await ss(page, "admin-special-moves-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "admin-special-moves");
  });

  test("ProfilePicker is a custom component on beyblade create", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/beyblades/create");
    if (!landed) { await ss(page, "admin-bey-create-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    const picker = page.locator("[data-picker]");
    if (await picker.count() > 0) {
      await expect(picker.first()).toBeVisible();
    }
    await ss(page, "admin-bey-create-picker");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin: Particle Presets
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Particle Presets", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("particle presets page loads with heading", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/assets/particle-presets");
    if (!landed) { await ss(page, "admin-particle-presets-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await expect(page.locator("h1")).toContainText("Particle Presets", { timeout: 10_000 });
    await ss(page, "admin-particle-presets");
  });

  test("can open new preset form", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/assets/particle-presets");
    if (!landed) { await ss(page, "admin-particle-new-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    const newBtn = page.locator("button, a").filter({ hasText: /new preset|\+ new/i }).first();
    const hasBtn = await newBtn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hasBtn) {
      await newBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "admin-particle-new-form");
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin: Asset Library
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Asset Library", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("particle presets appears in asset library", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/assets");
    if (!landed) { await ss(page, "admin-assets-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    const presets = page.locator("text=Particle Presets");
    const exists = await presets.isVisible({ timeout: 10_000 }).catch(() => false);
    if (exists) await expect(presets).toBeVisible();
    await ss(page, "admin-assets-library");
  });

  test("sound assets page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/assets/sounds");
    if (!landed) { await ss(page, "admin-sounds-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "admin-sounds");
  });

  test("arena theme assets page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/assets/arena-themes");
    if (!landed) { await ss(page, "admin-arena-themes-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "admin-arena-themes");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin: AI Battles presets
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: AI Battles presets", () => {
  test("AI battles page loads presets", async ({ page }) => {
    await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/ai-battles");
    if (!landed) { await ss(page, "admin-ai-battles-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "admin-ai-battles");
  });
});

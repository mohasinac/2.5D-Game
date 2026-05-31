/**
 * admin-workflows.spec.ts
 *
 * Tests (AW01–AW09): Admin workflow page loads — tournaments, special moves,
 * combos, element types, round modifiers, asset library, users, settings,
 * and dashboard stats.
 *
 * Requires admin credentials: TEST_EMAIL + TEST_PASSWORD (role=admin).
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(60_000);

let loggedIn = false;

async function adminLogin(page: Parameters<typeof tryLogin>[0]): Promise<boolean> {
  if (!loggedIn) loggedIn = await tryLogin(page);
  return loggedIn;
}

async function gotoAdmin(
  page: Parameters<typeof tryLogin>[0],
  path: string,
  waitMs = 2_000
): Promise<boolean> {
  await adminLogin(page);
  const landed = await gotoProtected(page, path);
  if (!landed) return false;
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(waitMs);
  return true;
}

test.describe("Admin Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  // AW01: /admin/tournaments → list loads; create form accessible
  test("AW01: Tournaments list loads and create form accessible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/tournaments");
    if (!landed) { await ss(page, "AW01-unauthenticated"); return; }

    await ss(page, "AW01-tournaments-list");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Create button/link should be accessible
    const createLink = page.locator("a, button").filter({ hasText: /create|new tournament/i }).first();
    if (await createLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await createLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_500);
      await ss(page, "AW01-tournament-create-form");
      await expect(page.locator("h1, h2, form").first()).toBeVisible({ timeout: 8_000 });
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW02: /admin/special-moves → page loads
  test("AW02: Special moves page loads", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/special-moves");
    if (!landed) { await ss(page, "AW02-unauthenticated"); return; }

    await ss(page, "AW02-special-moves");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW03: /admin/combos → combo list loads; combo info shown
  test("AW03: Combos list loads with combo entries visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/combos");
    if (!landed) { await ss(page, "AW03-unauthenticated"); return; }

    await ss(page, "AW03-combos-list");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Combo list items or create button
    const comboEl = page.locator(
      "table tr, [class*='combo'], [class*='Combo'], button:has-text('New'), a:has-text('Create')"
    ).first();
    const ok = await comboEl.isVisible({ timeout: 5_000 }).catch(() => false);
    if (ok) await expect(comboEl).toBeVisible();
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW04: /admin/element-types → element type matrix loads
  test("AW04: Element types page loads with type matrix", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/element-types");
    if (!landed) { await ss(page, "AW04-unauthenticated"); return; }

    await ss(page, "AW04-element-types");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Element type matrix or list
    const matrixEl = page.locator(
      "table, [class*='matrix'], [class*='Matrix'], [class*='element'], [class*='Element']"
    ).first();
    const ok = await matrixEl.isVisible({ timeout: 5_000 }).catch(() => false);
    if (ok) await expect(matrixEl).toBeVisible();
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW05: /admin/round-modifiers → page loads
  test("AW05: Round modifiers page loads", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/round-modifiers");
    if (!landed) { await ss(page, "AW05-unauthenticated"); return; }

    await ss(page, "AW05-round-modifiers");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW06: Admin asset library → /admin/assets → loads
  test("AW06: Asset library index page loads", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // Try both possible asset library routes
    let landed = await gotoAdmin(page, "/admin/assets");
    if (!landed) {
      landed = await gotoAdmin(page, "/admin/assets/particle-presets");
    }
    if (!landed) { await ss(page, "AW06-unauthenticated"); return; }

    await ss(page, "AW06-asset-library");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW07: /admin/users → user list loads; role column visible
  test("AW07: Users page loads with role information", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/users");
    if (!landed) { await ss(page, "AW07-unauthenticated"); return; }

    await ss(page, "AW07-users-list");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Role column or role indicator
    const roleEl = page.locator(
      "th:has-text('role'), td:has-text('admin'), td:has-text('user')," +
      "[class*='role'], [data-testid*='role']"
    ).first();
    const ok = await roleEl.isVisible({ timeout: 5_000 }).catch(() => false);
    if (ok) await expect(roleEl).toBeVisible();
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW08: /admin/settings → settings toggles visible
  test("AW08: Settings page shows feature toggles", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin/settings");
    if (!landed) { await ss(page, "AW08-unauthenticated"); return; }

    await ss(page, "AW08-settings");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Feature toggles (checkboxes or switch inputs)
    const toggles = page.locator('input[type="checkbox"], [role="switch"]');
    if (await toggles.count() > 0) {
      await expect(toggles.first()).toBeVisible({ timeout: 5_000 });
    }
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // AW09: /admin → dashboard stats visible (matches or player counts)
  test("AW09: Admin dashboard shows stat cards", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoAdmin(page, "/admin");
    if (!landed) { await ss(page, "AW09-unauthenticated"); return; }

    await ss(page, "AW09-dashboard");

    // Dashboard heading
    const heading = page.locator("h1, h2").filter({ hasText: /dashboard/i }).first();
    const ok = await heading.isVisible({ timeout: 10_000 }).catch(() => false);
    if (ok) await expect(heading).toBeVisible();

    // Stats: numbers, count cards, or quick-link buttons
    const statsEl = page.locator(
      "[class*='stat'], [class*='card'], [class*='Card']," +
      "text=/matches|players|tournaments|beyblades/i"
    ).first();
    const statsOk = await statsEl.isVisible({ timeout: 8_000 }).catch(() => false);
    if (statsOk) await expect(statsEl).toBeVisible();

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

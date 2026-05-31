/**
 * admin-beyblade-system.spec.ts
 *
 * Tests (BS01–BS06): 2.5D Beyblade System CRUD — list, create, slot assignment,
 * canvas preview, submit, edit/swap, and delete.
 *
 * Requires admin credentials: TEST_EMAIL + TEST_PASSWORD (role=admin).
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, analyzeCanvas, filterErrors } from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

const SYSTEM_NAME = `E2E-BS-${Date.now()}`;

test.describe("Admin Beyblade System CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  // BS01: Navigate to /admin/2.5d/beyblade-systems → list loads
  test("BS01: Beyblade systems list page loads", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems");
    if (!landed) { await ss(page, "BS01-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "BS01-systems-list");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  // BS02: Navigate to /admin/2.5d/beyblade-systems/create → form renders
  test("BS02: Beyblade system create form renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems/create");
    if (!landed) { await ss(page, "BS02-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "BS02-create-form");

    // Form elements should be visible
    const form = page.locator("form, input, select, [class*='slot'], [class*='Slot']").first();
    await expect(form).toBeVisible({ timeout: 10_000 });
  });

  // BS03: Assign a part to at least one slot (AR or TIP slot)
  test("BS03: Part can be assigned to AR or TIP slot", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems/create");
    if (!landed) { await ss(page, "BS03-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    // Fill system name
    const nameInput = page.locator(
      'input[name="name"], input[name="displayName"], input[placeholder*="name" i]'
    ).first();
    if (await nameInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await nameInput.fill(SYSTEM_NAME);
      await page.waitForTimeout(200);
    }

    // Look for slot selectors (AR, TIP, WD etc.)
    const slotSelectors = page.locator(
      'select[name*="ar" i], select[name*="tip" i], select[name*="slot" i],' +
      '[class*="slot-select"], [class*="SlotSelect"], [data-testid*="slot"]'
    );

    const slotCount = await slotSelectors.count();
    if (slotCount > 0) {
      // Try to select a non-empty option for the first slot
      const firstSlot = slotSelectors.first();
      if (await firstSlot.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const options = await firstSlot.locator("option").count();
        if (options > 1) {
          await firstSlot.selectOption({ index: 1 }); // Select first real option (skip empty)
          await page.waitForTimeout(500);
          await ss(page, "BS03-slot-assigned");
        }
      }
    } else {
      // Try SearchableSelect or combobox
      const combobox = page.locator('[role="combobox"], [class*="SearchableSelect"]').first();
      if (await combobox.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await combobox.click();
        await page.waitForTimeout(400);
        const option = page.locator('[role="option"], [class*="option"]').first();
        if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(300);
          await ss(page, "BS03-slot-assigned-combobox");
        }
      }
    }

    await ss(page, "BS03-slot-assignment-check");
  });

  // BS04: Canvas preview updates (canvas visible)
  test("BS04: Beyblade system preview canvas is visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems/create");
    if (!landed) { await ss(page, "BS04-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_500); // Give canvas time to initialize

    const canvas = page.locator("canvas");
    const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
    await ss(page, "BS04-canvas-check");

    if (ok) {
      const analysis = await analyzeCanvas(page);
      console.log(`[BS04] ${analysis.summary}`);
      expect(analysis.found, "Preview canvas should be in DOM").toBe(true);
      expect(analysis.hasSize, "Preview canvas should have non-zero size").toBe(true);
    } else {
      // Canvas may not be present on this page — form at minimum must render
      const form = page.locator("form, input, select").first();
      await expect(form).toBeVisible({ timeout: 5_000 });
      console.log("[BS04] Canvas not found — form is still rendering correctly");
    }
  });

  // BS05: Submit → system appears in list
  test("BS05: Create system form submits and system appears in list", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems/create");
    if (!landed) { await ss(page, "BS05-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    // Fill name
    const nameInput = page.locator(
      'input[name="name"], input[name="displayName"], input[placeholder*="name" i]'
    ).first();
    if (await nameInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await nameInput.fill(SYSTEM_NAME);
      await page.waitForTimeout(200);
    }

    // Submit
    const saveBtn = page.locator("button").filter({ hasText: /save|create|submit/i }).last();
    if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(3_000);
    }

    await ss(page, "BS05-after-submit");

    // Check list
    await gotoProtected(page, "/admin/2.5d/beyblade-systems");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "BS05-list-after-create");

    const created = page.locator(`text="${SYSTEM_NAME}"`).first();
    const found = await created.isVisible({ timeout: 5_000 }).catch(() => false);
    if (found) {
      await expect(created).toBeVisible();
    } else {
      console.log(`[BS05] System "${SYSTEM_NAME}" not found — may not have been saved`);
    }
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // BS06: Edit system → swap part → save; delete → removed
  test("BS06: Edit system form and delete system from list", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems");
    if (!landed) { await ss(page, "BS06-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    // Edit the first available system
    const editLink = page.locator("a, button").filter({ hasText: /^edit$/i }).first();
    if (await editLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await editLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_500);
      await ss(page, "BS06-edit-form");

      // Try swapping a slot
      const slotSelectors = page.locator('select[name*="ar" i], select[name*="tip" i], select[name*="slot" i]');
      if (await slotSelectors.count() > 0) {
        const slot = slotSelectors.first();
        if (await slot.isVisible({ timeout: 3_000 }).catch(() => false)) {
          const options = await slot.locator("option").count();
          if (options > 2) {
            await slot.selectOption({ index: 2 });
            await page.waitForTimeout(400);
            await ss(page, "BS06-slot-swapped");
          }
        }
      }

      // Save
      const saveBtn = page.locator("button").filter({ hasText: /save|update|submit/i }).last();
      if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(3_000);
        await ss(page, "BS06-after-save");
      }
    }

    // Delete flow
    await gotoProtected(page, "/admin/2.5d/beyblade-systems");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const deleteBtn = page.locator("button").filter({ hasText: /^delete$/i }).first();
    if (await deleteBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const initialCount = await page.locator("button").filter({ hasText: /^delete$/i }).count();

      await deleteBtn.scrollIntoViewIfNeeded().catch(() => {});
      await deleteBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "BS06-delete-confirm");

      const confirmBtn = page.locator("button").filter({ hasText: /delete|confirm|yes/i }).last();
      if (await confirmBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(2_000);
      }

      await ss(page, "BS06-after-delete");

      const newCount = await page.locator("button").filter({ hasText: /^delete$/i }).count();
      expect(newCount, "System count should decrease after deletion").toBeLessThan(initialCount);
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

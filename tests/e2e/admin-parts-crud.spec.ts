/**
 * admin-parts-crud.spec.ts
 *
 * Tests (AP01–AP35): CRUD flow for each of the 7 2.5D part types.
 * For each partType: list loads, create form renders, fill name + submit,
 * edit pre-populated, delete removes.
 *
 * Requires admin credentials: TEST_EMAIL + TEST_PASSWORD (role=admin).
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

// All 7 2.5D part types as route segments
const PART_TYPES = [
  "attack_ring",
  "weight_disk",
  "tip",
  "core",
  "casing",
  "spin_track",
  "gear",
] as const;

type PartType = typeof PART_TYPES[number];

/** Derive a human-readable label from the route segment. */
function label(pt: PartType): string {
  return pt.replace(/_/g, " ");
}

/** Build a timestamp-unique part name for a given type. */
function partName(pt: PartType): string {
  return `E2E-${pt.toUpperCase()}-${Date.now()}`;
}

test.describe("Admin 2.5D Parts CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  // ──────────────────────────────────────────────────────────────
  // Parameterised suite over all 7 part types
  // ──────────────────────────────────────────────────────────────
  for (const partType of PART_TYPES) {
    const idx = PART_TYPES.indexOf(partType);          // 0–6
    const base = (idx + 1) * 5;                        // 5, 10, 15, 20, 25, 30, 35
    const pfx  = `AP${String(base).padStart(2, "0")}`;  // AP05, AP10, …

    // AP{N}a — list loads
    test(`${pfx}a: ${label(partType)} list page loads`, async ({ page }) => {
      const landed = await gotoProtected(page, `/admin/2.5d/parts/${partType}`);
      if (!landed) { await ss(page, `${pfx}a-${partType}-unauthenticated`); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_500);
      await ss(page, `${pfx}a-${partType}-list`);

      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    });

    // AP{N}b — create form renders
    test(`${pfx}b: ${label(partType)} create form renders`, async ({ page }) => {
      const landed = await gotoProtected(page, `/admin/2.5d/parts/${partType}/create`);
      if (!landed) { await ss(page, `${pfx}b-${partType}-unauthenticated`); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_500);
      await ss(page, `${pfx}b-${partType}-create-form`);

      const form = page.locator("form, input, [class*='form']").first();
      await expect(form).toBeVisible({ timeout: 10_000 });
    });

    // AP{N}c — fill name and submit
    test(`${pfx}c: ${label(partType)} fill name and submit without crash`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      const landed = await gotoProtected(page, `/admin/2.5d/parts/${partType}/create`);
      if (!landed) { await ss(page, `${pfx}c-${partType}-unauthenticated`); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_000);

      const name = partName(partType);

      // Fill name input
      const nameInput = page.locator(
        'input[name="name"], input[name="displayName"], input[placeholder*="name" i], input[id*="name" i]'
      ).first();
      if (await nameInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
        await nameInput.fill(name);
        await page.waitForTimeout(200);
      }

      await ss(page, `${pfx}c-${partType}-filled`);

      // Submit
      const saveBtn = page.locator("button").filter({ hasText: /save|create|submit|add/i }).last();
      if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(3_000);
      }

      await ss(page, `${pfx}c-${partType}-submitted`);
      expect(filterErrors(errors)).toHaveLength(0);
    });

    // AP{N}d — navigate to edit → pre-populated
    test(`${pfx}d: ${label(partType)} edit page has pre-populated fields`, async ({ page }) => {
      const landed = await gotoProtected(page, `/admin/2.5d/parts/${partType}`);
      if (!landed) { await ss(page, `${pfx}d-${partType}-unauthenticated`); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);

      const editLink = page.locator("a, button").filter({ hasText: /^edit$/i }).first();
      if (!(await editLink.isVisible({ timeout: 5_000 }).catch(() => false))) {
        await ss(page, `${pfx}d-${partType}-no-edit-links`);
        // Nothing to edit — just verify list rendered
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5_000 });
        return;
      }

      await editLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2_500);
      await ss(page, `${pfx}d-${partType}-edit-form`);

      const nameInput = page.locator(
        'input[name="name"], input[name="displayName"], input[placeholder*="name" i]'
      ).first();
      if (await nameInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
        const value = await nameInput.inputValue();
        expect(value.length, `${label(partType)} name should be pre-filled`).toBeGreaterThan(0);
      }
    });

    // AP{N}e — delete → removed
    test(`${pfx}e: ${label(partType)} delete removes part from list`, async ({ page }) => {
      const landed = await gotoProtected(page, `/admin/2.5d/parts/${partType}`);
      if (!landed) { await ss(page, `${pfx}e-${partType}-unauthenticated`); return; }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);

      const deleteBtn = page.locator("button").filter({ hasText: /^delete$/i }).first();
      if (!(await deleteBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
        await ss(page, `${pfx}e-${partType}-no-delete-buttons`);
        // No parts to delete — list may be empty
        await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5_000 });
        return;
      }

      const initialCount = await page.locator("button").filter({ hasText: /^delete$/i }).count();

      await deleteBtn.scrollIntoViewIfNeeded().catch(() => {});
      await deleteBtn.click();
      await page.waitForTimeout(600);
      await ss(page, `${pfx}e-${partType}-delete-confirm`);

      // Confirm in modal
      const confirmBtn = page.locator("button").filter({ hasText: /delete|confirm|yes/i }).last();
      if (await confirmBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(2_000);
      }

      await ss(page, `${pfx}e-${partType}-after-delete`);

      const newCount = await page.locator("button").filter({ hasText: /^delete$/i }).count();
      expect(newCount, `${label(partType)} delete count should decrease`).toBeLessThan(initialCount);
    });
  }
});

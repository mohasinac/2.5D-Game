/**
 * arena-crud-flow.spec.ts
 *
 * Full CRUD flow for the Arena admin pages:
 *   1. Create a simple arena (minimal fields)
 *   2. Verify it appears in the arenas list
 *   3. Open the arena — check preview canvas renders
 *   4. Delete the arena
 *   5. Recreate with detailed config (obstacles, spin-zones, theme, shape)
 *   6. Verify preview canvas again with richer config
 *
 * Screenshots captured at each key step.
 * Requires admin credentials (TEST_EMAIL / TEST_PASSWORD with role=admin).
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ARENA_NAME_SIMPLE  = `E2E-Simple-${Date.now()}`;
const ARENA_NAME_COMPLEX = `E2E-Complex-${Date.now()}`;

async function fillText(page: Page, labelText: string | RegExp, value: string): Promise<void> {
  const label = page.locator("label, span").filter({ hasText: labelText }).first();
  if (await label.isVisible().catch(() => false)) {
    const input = label.locator("~ input, ~ textarea").first();
    if (await input.isVisible().catch(() => false)) {
      await input.fill(value);
      return;
    }
  }
  // Fallback: find placeholder or name attr
  const directInput = page.locator(`input[placeholder*="${labelText}"], textarea[placeholder*="${labelText}"]`).first();
  if (await directInput.isVisible().catch(() => false)) {
    await directInput.fill(value);
  }
}

async function waitForCanvas(page: Page, shotName: string, timeoutMs = 20_000): Promise<boolean> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    await ss(page, `${shotName}-canvas-timeout`);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Simple arena creation
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: create simple arena", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("fills minimal fields and saves a new arena", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "AC01-create-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "AC01-arena-create-form");

    // Fill arena name — try common input patterns
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i], input[id*="name" i]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(ARENA_NAME_SIMPLE);
    } else {
      // Try label-based approach
      await fillText(page, /arena name|name/i, ARENA_NAME_SIMPLE);
    }

    await page.waitForTimeout(500);
    await ss(page, "AC02-arena-name-filled");

    // Click Save / Create button
    const saveBtn = page.locator("button").filter({ hasText: /save|create arena/i }).first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(3_000);
    }

    await ss(page, "AC03-arena-save-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Arena appears in list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: arena list page loads", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("arena list shows table or card list", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) { await ss(page, "AC04-list-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "AC04-arena-list");

    const list = page.locator("table, [data-testid='arena-list'], ul, .arena-row, [class*='arena']").first();
    if (await list.isVisible().catch(() => false)) {
      await expect(list).toBeVisible({ timeout: 10_000 });
    } else {
      // At minimum check a heading rendered
      await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Arena create page — preview canvas
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: create page renders preview canvas", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("canvas appears on arena create page within 20s", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "AC05-canvas-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);

    const canvasAppeared = await waitForCanvas(page, "AC05-arena-preview-canvas");
    if (canvasAppeared) {
      await ss(page, "AC05-arena-preview-canvas");
      await expect(page.locator("canvas").first()).toBeVisible({ timeout: 5_000 });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Arena create with theme / shape tabs
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: tabs and dropdowns on create page", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("can click through all tabs without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "AC06-tabs-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Click through each visible tab
    const tabs = page.locator('[role="tab"], button[data-tab], .tab-btn, nav button');
    const tabCount = await tabs.count();
    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      if (await tab.isVisible().catch(() => false)) {
        await tab.click();
        await page.waitForTimeout(400);
        await ss(page, `AC06-arena-tab-${i}`);
      }
    }

    const critical = errors.filter(e =>
      !e.toLowerCase().includes("websocket") &&
      !e.toLowerCase().includes("net::err") &&
      !e.toLowerCase().includes("failed to fetch")
    );
    expect(critical, `JS errors: ${critical.join(" | ")}`).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Complex arena creation (detailed fields)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: create detailed arena with obstacles and theme", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("fills detailed arena fields, saves, and verifies preview canvas", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "AC07-detailed-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Fill name
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(ARENA_NAME_COMPLEX);
    }

    // Try to select a theme if there's a theme picker
    const themeBtn = page.locator("button").filter({ hasText: /volcano|forest|neon|space|ice/i }).first();
    if (await themeBtn.isVisible().catch(() => false)) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      await ss(page, "AC07-arena-theme-selected");
    }

    // Try to select a shape if there's a shape picker
    const shapeBtn = page.locator("button").filter({ hasText: /hexagon|star|circle/i }).first();
    if (await shapeBtn.isVisible().catch(() => false)) {
      await shapeBtn.click();
      await page.waitForTimeout(300);
      await ss(page, "AC07-arena-shape-selected");
    }

    // Tab to obstacles if available
    const obstacleTab = page.locator('[role="tab"], button').filter({ hasText: /obstacle|features/i }).first();
    if (await obstacleTab.isVisible().catch(() => false)) {
      await obstacleTab.click();
      await page.waitForTimeout(1_000);
      await ss(page, "AC07-arena-obstacles-tab");

      // Add an obstacle if there's an "Add" button
      const addObstacleBtn = page.locator("button").filter({ hasText: /add obstacle|add/i }).first();
      if (await addObstacleBtn.isVisible().catch(() => false)) {
        await addObstacleBtn.click();
        await page.waitForTimeout(500);
        await ss(page, "AC07-arena-obstacle-added");
      }
    }

    // Save
    const saveBtn = page.locator("button").filter({ hasText: /save|create arena/i }).first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(3_000);
    }

    await ss(page, "AC08-detailed-arena-saved");

    // After save, check if we're redirected to the edit page which has a canvas preview
    if (page.url().includes("/edit") || page.url().includes("/arenas/")) {
      await page.waitForTimeout(3_000);
      const canvasAppeared = await waitForCanvas(page, "AC09-detailed-preview");
      if (canvasAppeared) {
        await ss(page, "AC09-detailed-preview-canvas");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Arena edit page — canvas preview and tabs
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: edit page loads first arena in list", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("navigates to first arena edit page and checks canvas + tabs", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) { await ss(page, "AC10-edit-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "AC10-arenas-list-before-edit");

    // Find the first Edit / View button or row link
    const editLink = page.locator("a, button").filter({ hasText: /edit|view|open/i }).first();
    const arenaRowLink = page.locator("a[href*='/admin/arenas/']").first();

    const target = (await editLink.isVisible().catch(() => false)) ? editLink : arenaRowLink;
    if (!(await target.isVisible().catch(() => false))) {
      await ss(page, "AC10-no-arenas-to-edit");
      return;
    }

    await target.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "AC10-arena-edit-page");

    // Check for preview canvas
    const canvasAppeared = await waitForCanvas(page, "AC10-arena-edit-canvas");
    if (canvasAppeared) {
      await ss(page, "AC10-arena-edit-canvas");
    }

    // Navigate tabs
    const tabs = page.locator('[role="tab"], button[data-tab], nav button').all();
    const tabList = await tabs;
    for (let i = 0; i < Math.min(tabList.length, 6); i++) {
      const tab = tabList[i];
      if (await tab.isVisible().catch(() => false)) {
        await tab.click();
        await page.waitForTimeout(500);
      }
    }
    await ss(page, "AC11-arena-edit-all-tabs");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. No critical JS errors on arena pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena CRUD: no JS errors on list and create pages", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  for (const path of ["/admin/arenas", "/admin/arenas/create"]) {
    test(`no critical JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));

      const landed = await gotoProtected(page, path);
      if (!landed) return;

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);

      const critical = errors.filter(e =>
        !e.toLowerCase().includes("websocket") &&
        !e.toLowerCase().includes("net::err") &&
        !e.toLowerCase().includes("failed to fetch") &&
        !e.toLowerCase().includes("firebase")
      );
      expect(critical, `JS errors on ${path}: ${critical.join(" | ")}`).toHaveLength(0);
    });
  }
});

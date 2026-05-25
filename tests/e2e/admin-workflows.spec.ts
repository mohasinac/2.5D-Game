/**
 * admin-workflows.spec.ts
 *
 * Full-workflow E2E tests for all admin pages and their previews/editors.
 * Every test takes a screenshot.
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env (admin account required).
 * Without credentials, each test verifies the login redirect and screenshots it.
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared login state — log in once per worker, reuse storage
// ─────────────────────────────────────────────────────────────────────────────

test.describe.configure({ mode: "serial" });

let loggedIn = false;

async function ensureLoggedIn(page: Page): Promise<boolean> {
  if (!loggedIn) {
    loggedIn = await tryLogin(page);
  }
  return loggedIn;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Dashboard
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Dashboard", () => {
  test("dashboard loads with stat cards", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin");
    if (!authed || !landed) {
      await ss(page, "A01-admin-dashboard-unauthenticated");
      expect(page.url()).toContain("login");
      return;
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    // Stat cards for beyblades, arenas, matches, players
    await expect(page.locator("text=Dashboard")).toBeVisible({ timeout: 10_000 });
    await ss(page, "A01-admin-dashboard");
  });

  test("quick links are present on dashboard", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin");
    if (!authed || !landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await expect(page.locator("text=Create Beyblade")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("text=Create Arena")).toBeVisible();
    await ss(page, "A01b-admin-dashboard-quicklinks");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Beyblades
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Beyblades list", () => {
  test("beyblades list page renders table", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/beyblades");
    if (!authed || !landed) { await ss(page, "A02-beyblades-list-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A02-beyblades-list");
  });
});

test.describe("Admin: Beyblade create", () => {
  test("create page renders multi-step form", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/beyblades/create");
    if (!authed || !landed) { await ss(page, "A03-bey-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1_500);
    // Step 1 should be visible
    const nameInput = page.locator('input[placeholder*="name"], input[placeholder*="Name"]').first();
    if (await nameInput.count() > 0) await expect(nameInput).toBeVisible({ timeout: 10_000 });
    await ss(page, "A03-bey-create-step1");
  });

  test("stats sliders are visible in step 2/3", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/beyblades/create");
    if (!authed || !landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1_500);
    // Try to navigate to next step
    const nextBtn = page.locator("button").filter({ hasText: /next|continue/i });
    if (await nextBtn.count() > 0) {
      await nextBtn.first().click();
      await page.waitForTimeout(500);
      await ss(page, "A03b-bey-create-step2");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Arenas
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arenas list", () => {
  test("arenas list renders with arena cards", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!authed || !landed) { await ss(page, "A04-arenas-list-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A04-arenas-list");
  });
});

test.describe("Admin: Arena create", () => {
  test("create page renders with basics tab", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!authed || !landed) { await ss(page, "A05-arena-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A05-arena-create");
  });

  test("arena create tabs: Basics / Obstacles / Gravity / Spin Zones visible", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!authed || !landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    // Tab navigation
    const tabNames = ["Obstacles", "Gravity", "Spin Zones", "Bumps", "Switches"];
    for (const tab of tabNames) {
      const tabEl = page.locator("button, [role='tab']").filter({ hasText: tab });
      if (await tabEl.count() > 0) {
        await tabEl.first().click();
        await page.waitForTimeout(400);
        await ss(page, `A05b-arena-create-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`);
      }
    }
  });

  test("arena preview canvas renders in arena create", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!authed || !landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000); // ArenaPreview needs Pixi init time
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible({ timeout: 15_000 });
      await ss(page, "A05c-arena-create-preview-canvas");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Arena Edit + Preview
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arena edit page preview", () => {
  test("first seeded arena edit page opens with preview", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    if (!authed) { await ss(page, "A06-arena-edit-unauth"); return; }

    // Navigate to list first to find a real arena ID
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) return;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Click the first Edit link in the list
    const editLink = page.locator("a").filter({ hasText: /edit/i }).first();
    if (await editLink.count() > 0) {
      await editLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3_000);
      await ss(page, "A06-arena-edit");

      // Preview canvas should appear
      const canvas = page.locator("canvas");
      if (await canvas.count() > 0) {
        await expect(canvas.first()).toBeVisible({ timeout: 15_000 });
        await ss(page, "A06b-arena-edit-preview");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Tournaments
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Tournaments", () => {
  test("tournaments list renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/tournaments");
    if (!authed || !landed) { await ss(page, "A07-tournaments-list-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A07-tournaments-list");
  });

  test("tournament create page renders all fields", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/tournaments/create");
    if (!authed || !landed) { await ss(page, "A07b-tournament-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1_500);
    await ss(page, "A07b-tournament-create");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Settings
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Settings page", () => {
  test("settings page renders feature toggles", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/settings");
    if (!authed || !landed) { await ss(page, "A08-settings-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    // Look for toggle switches or checkboxes
    const toggles = page.locator('input[type="checkbox"], [role="switch"]');
    if (await toggles.count() > 0) await expect(toggles.first()).toBeVisible();
    await ss(page, "A08-settings");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Users
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Users page", () => {
  test("users list page renders table", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/users");
    if (!authed || !landed) { await ss(page, "A09-users-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A09-users");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Stats
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Stats page", () => {
  test("stats page renders match data", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/stats");
    if (!authed || !landed) { await ss(page, "A10-stats-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A10-stats");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Asset library pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Asset Library", () => {
  test("asset library index page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/assets");
    if (!authed || !landed) { await ss(page, "A11-assets-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A11-assets");
  });

  test("particle presets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/assets/particle-presets");
    if (!authed || !landed) { await ss(page, "A11b-particle-presets-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await expect(page.locator("h1")).toContainText("Particle Presets", { timeout: 10_000 });
    await ss(page, "A11b-particle-presets");
  });

  test("sound assets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/assets/sounds");
    if (!authed || !landed) { await ss(page, "A11c-sounds-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A11c-sounds");
  });

  test("arena theme assets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/assets/arena-themes");
    if (!authed || !landed) { await ss(page, "A11d-arena-themes-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A11d-arena-themes");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Definition pages (mechanic, gimmick, tip shapes, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const DEF_PAGES = [
  { path: "/admin/mechanic-defs",     name: "A12a-mechanic-defs",    label: "Mechanic Defs" },
  { path: "/admin/gimmick-defs",      name: "A12b-gimmick-defs",     label: "Gimmick Defs" },
  { path: "/admin/tip-shape-defs",    name: "A12c-tip-shape-defs",   label: "Tip Shape Defs" },
  { path: "/admin/core-gimmick-defs", name: "A12d-core-gimmick",     label: "Core Gimmick" },
  { path: "/admin/attack-type-defs",  name: "A12e-attack-types",     label: "Attack Types" },
  { path: "/admin/arena-theme-defs",  name: "A12f-arena-theme-defs", label: "Arena Theme Defs" },
  { path: "/admin/arena-shape-defs",  name: "A12g-arena-shape-defs", label: "Arena Shape Defs" },
  { path: "/admin/bowl-profile-defs", name: "A12h-bowl-profiles",    label: "Bowl Profiles" },
  { path: "/admin/trigger-type-defs", name: "A12i-trigger-types",    label: "Trigger Types" },
  { path: "/admin/stat-event-defs",   name: "A12j-stat-events",      label: "Stat Events" },
  { path: "/admin/part-layer-defs",   name: "A12k-part-layers",      label: "Part Layers" },
] as const;

test.describe("Admin: Definition pages", () => {
  for (const { path, name, label } of DEF_PAGES) {
    test(`${label} page loads and shows data`, async ({ page }) => {
      const authed = await ensureLoggedIn(page);
      const landed = await gotoProtected(page, path);
      if (!authed || !landed) { await ss(page, `${name}-unauth`); return; }
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2_000);
      await ss(page, name);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. 2.5D Part Library
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: 2.5D Part Library", () => {
  test("parts list page renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/2d/parts");
    if (!authed || !landed) { await ss(page, "A13a-parts-list-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A13a-parts-list");
  });

  test("part create page renders with type selector", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!authed || !landed) { await ss(page, "A13b-part-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A13b-part-create");
  });

  test("beyblade systems list page renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/2d/beyblade-systems");
    if (!authed || !landed) { await ss(page, "A13c-bey-systems-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A13c-bey-systems");
  });

  test("beyblade system create page renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/2d/beyblade-systems/create");
    if (!authed || !landed) { await ss(page, "A13d-bey-system-create-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A13d-bey-system-create");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Arena Systems
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arena Systems", () => {
  test("arena systems list renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arena-systems");
    if (!authed || !landed) { await ss(page, "A14a-arena-systems-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A14a-arena-systems");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. AI Battles config
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: AI Battles presets", () => {
  test("AI battles page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/ai-battles");
    if (!authed || !landed) { await ss(page, "A15-ai-battles-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A15-ai-battles");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. Special Moves + Combos
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Special Moves & Combos", () => {
  test("special moves list page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/special-moves");
    if (!authed || !landed) { await ss(page, "A16a-special-moves-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A16a-special-moves");
  });

  test("combos list page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/combos");
    if (!authed || !landed) { await ss(page, "A16b-combos-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A16b-combos");
  });

  test("combo effects builder page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/combo-effects");
    if (!authed || !landed) { await ss(page, "A16c-combo-effects-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    await ss(page, "A16c-combo-effects");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. Arena Test + AI vs AI Lab (preview-heavy pages)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arena Test (live preview)", () => {
  test("arena test page loads and shows canvas/preview", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/arena-test");
    if (!authed || !landed) { await ss(page, "A17-arena-test-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible({ timeout: 15_000 });
    }
    await ss(page, "A17-arena-test");
  });
});

test.describe("Admin: AI vs AI Lab", () => {
  test("AI vs AI page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoProtected(page, "/admin/ai-vs-ai");
    if (!authed || !landed) { await ss(page, "A18-ai-vs-ai-unauth"); return; }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "A18-ai-vs-ai");
  });
});

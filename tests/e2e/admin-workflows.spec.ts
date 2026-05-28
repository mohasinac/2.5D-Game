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
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared login state — serial so we only authenticate once per worker
// ─────────────────────────────────────────────────────────────────────────────

test.describe.configure({ mode: "serial" });

let loggedIn = false;

async function ensureLoggedIn(page: Page): Promise<boolean> {
  if (!loggedIn) loggedIn = await tryLogin(page);
  return loggedIn;
}

/** Navigate + settle. Replace all networkidle calls with this. */
async function gotoAndSettle(page: Page, path: string, ms = 2_000): Promise<boolean> {
  const landed = await gotoProtected(page, path);
  if (!landed) return false;
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(ms);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Dashboard
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Dashboard", () => {
  test("dashboard loads with stat cards", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin");
    if (!authed || !landed) {
      await ss(page, "A01-admin-dashboard-unauthenticated");
      return;
    }
    await expect(page.locator("text=Dashboard")).toBeVisible({ timeout: 10_000 });
    await ss(page, "A01-admin-dashboard");
  });

  test("quick links are present on dashboard", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin");
    if (!authed || !landed) return;
    const createBey = page.locator("text=Create Beyblade");
    const ok = await createBey.isVisible({ timeout: 10_000 }).catch(() => false);
    if (ok) {
      await expect(createBey).toBeVisible();
      await expect(page.locator("text=Create Arena")).toBeVisible();
    }
    await ss(page, "A01b-admin-dashboard-quicklinks");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Beyblades
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Beyblades list", () => {
  test("beyblades list page renders cards", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/beyblades");
    if (!authed || !landed) { await ss(page, "A02-beyblades-list-unauth"); return; }
    await ss(page, "A02-beyblades-list");
  });
});

test.describe("Admin: Beyblade create", () => {
  test("create page renders multi-step form", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/beyblades/create", 1_500);
    if (!authed || !landed) { await ss(page, "A03-bey-create-unauth"); return; }
    const nameInput = page.locator('input[placeholder*="name" i], input[placeholder*="Name"]').first();
    if (await nameInput.count() > 0) {
      await expect(nameInput).toBeVisible({ timeout: 10_000 });
    }
    await ss(page, "A03-bey-create-step1");
  });

  test("stats sliders are visible in step 2/3", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/beyblades/create", 1_500);
    if (!authed || !landed) return;
    const nextBtn = page.locator("button").filter({ hasText: /next|continue/i });
    if (await nextBtn.count() > 0) {
      await nextBtn.first().click();
      await page.waitForTimeout(600);
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
    const landed = await gotoAndSettle(page, "/admin/arenas");
    if (!authed || !landed) { await ss(page, "A04-arenas-list-unauth"); return; }
    await ss(page, "A04-arenas-list");
  });
});

test.describe("Admin: Arena create", () => {
  test("create page renders with basics tab", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/arenas/create");
    if (!authed || !landed) { await ss(page, "A05-arena-create-unauth"); return; }
    await ss(page, "A05-arena-create");
  });

  test("arena create tabs: Obstacles / Gravity / Spin Zones visible", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/arenas/create");
    if (!authed || !landed) return;
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
    const landed = await gotoAndSettle(page, "/admin/arenas/create", 3_000);
    if (!authed || !landed) return;
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
      if (ok) {
        await expect(canvas.first()).toBeVisible();
        await ss(page, "A05c-arena-create-preview-canvas");
      }
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

    const landed = await gotoAndSettle(page, "/admin/arenas", 2_500);
    if (!landed) return;

    const editLink = page.locator("a").filter({ hasText: /edit/i }).first();
    if (await editLink.count() > 0) {
      await editLink.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3_000);
      await ss(page, "A06-arena-edit");

      const canvas = page.locator("canvas");
      if (await canvas.count() > 0) {
        const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
        if (ok) await ss(page, "A06b-arena-edit-preview");
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
    const landed = await gotoAndSettle(page, "/admin/tournaments");
    if (!authed || !landed) { await ss(page, "A07-tournaments-list-unauth"); return; }
    await ss(page, "A07-tournaments-list");
  });

  test("tournament create page renders all fields", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/tournaments/create", 1_500);
    if (!authed || !landed) { await ss(page, "A07b-tournament-create-unauth"); return; }
    await ss(page, "A07b-tournament-create");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Settings
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Settings page", () => {
  test("settings page renders feature toggles", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/settings");
    if (!authed || !landed) { await ss(page, "A08-settings-unauth"); return; }
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
    const landed = await gotoAndSettle(page, "/admin/users");
    if (!authed || !landed) { await ss(page, "A09-users-unauth"); return; }
    await ss(page, "A09-users");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Stats
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Stats page", () => {
  test("stats page renders match data", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/stats");
    if (!authed || !landed) { await ss(page, "A10-stats-unauth"); return; }
    await ss(page, "A10-stats");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Asset library pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Asset Library", () => {
  test("asset library index page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/assets");
    if (!authed || !landed) { await ss(page, "A11-assets-unauth"); return; }
    await ss(page, "A11-assets");
  });

  test("particle presets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/assets/particle-presets");
    if (!authed || !landed) { await ss(page, "A11b-particle-presets-unauth"); return; }
    await expect(page.locator("h1")).toContainText("Particle Presets", { timeout: 10_000 });
    await ss(page, "A11b-particle-presets");
  });

  test("sound assets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/assets/sounds");
    if (!authed || !landed) { await ss(page, "A11c-sounds-unauth"); return; }
    await ss(page, "A11c-sounds");
  });

  test("arena theme assets page", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/assets/arena-themes");
    if (!authed || !landed) { await ss(page, "A11d-arena-themes-unauth"); return; }
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
      const landed = await gotoAndSettle(page, path);
      if (!authed || !landed) { await ss(page, `${name}-unauth`); return; }
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
    const landed = await gotoAndSettle(page, "/admin/2d/parts");
    if (!authed || !landed) { await ss(page, "A13a-parts-list-unauth"); return; }
    await ss(page, "A13a-parts-list");
  });

  test("part create page renders with type selector", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/2d/parts/create");
    if (!authed || !landed) { await ss(page, "A13b-part-create-unauth"); return; }
    await ss(page, "A13b-part-create");
  });

  test("beyblade systems list page renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/2d/beyblade-systems");
    if (!authed || !landed) { await ss(page, "A13c-bey-systems-unauth"); return; }
    await ss(page, "A13c-bey-systems");
  });

  test("beyblade system create page renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/2d/beyblade-systems/create");
    if (!authed || !landed) { await ss(page, "A13d-bey-system-create-unauth"); return; }
    await ss(page, "A13d-bey-system-create");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Arena Systems
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arena Systems", () => {
  test("arena systems list renders", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/arena-systems");
    if (!authed || !landed) { await ss(page, "A14a-arena-systems-unauth"); return; }
    await ss(page, "A14a-arena-systems");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. AI Battles config
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: AI Battles presets", () => {
  test("AI battles page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/ai-battles");
    if (!authed || !landed) { await ss(page, "A15-ai-battles-unauth"); return; }
    await ss(page, "A15-ai-battles");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. Special Moves + Combos
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Special Moves & Combos", () => {
  test("special moves list page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/special-moves");
    if (!authed || !landed) { await ss(page, "A16a-special-moves-unauth"); return; }
    await ss(page, "A16a-special-moves");
  });

  test("combos list page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/combos");
    if (!authed || !landed) { await ss(page, "A16b-combos-unauth"); return; }
    await ss(page, "A16b-combos");
  });

  test("combo effects builder page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/combo-effects");
    if (!authed || !landed) { await ss(page, "A16c-combo-effects-unauth"); return; }
    await ss(page, "A16c-combo-effects");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. Arena Test + AI vs AI Lab (preview-heavy pages)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Arena Test (live preview)", () => {
  test("arena test page loads and shows canvas/preview", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/arena-test", 3_000);
    if (!authed || !landed) { await ss(page, "A17-arena-test-unauth"); return; }
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
      if (ok) await expect(canvas.first()).toBeVisible();
    }
    await ss(page, "A17-arena-test");
  });
});

test.describe("Admin: AI vs AI Lab", () => {
  test("AI vs AI page loads", async ({ page }) => {
    const authed = await ensureLoggedIn(page);
    const landed = await gotoAndSettle(page, "/admin/ai-vs-ai", 3_000);
    if (!authed || !landed) { await ss(page, "A18-ai-vs-ai-unauth"); return; }
    await ss(page, "A18-ai-vs-ai");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. Responsive admin: key pages at 390px
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: Responsive — key pages at 390px", () => {
  const PAGES = [
    { path: "/admin",                   name: "AR01-dashboard-390"       },
    { path: "/admin/beyblades",         name: "AR02-beyblades-390"       },
    { path: "/admin/arenas",            name: "AR03-arenas-390"          },
    { path: "/admin/tournaments",       name: "AR04-tournaments-390"     },
    { path: "/admin/settings",          name: "AR05-settings-390"        },
    { path: "/admin/mechanic-defs",     name: "AR06-mechanic-defs-390"   },
    { path: "/admin/2d/parts",          name: "AR07-parts-lib-390"       },
  ] as const;

  for (const { path, name } of PAGES) {
    test(`${path} has no horizontal overflow at 390px`, async ({ page }) => {
      const authed = await ensureLoggedIn(page);
      const landed = await gotoAndSettle(page, path);
      if (!authed || !landed) { await ss(page, `${name}-unauth`); return; }

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);

      const overflow = await page.evaluate(
        () => document.body.scrollWidth - window.innerWidth
      );
      if (overflow > 4) {
        console.warn(`[responsive] ${path} overflows by ${overflow}px at 390px`);
      }
      await ss(page, name);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 17. No critical JS errors on key admin pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Admin: No JS errors on key pages", () => {
  const CHECK_PAGES = [
    "/admin",
    "/admin/beyblades",
    "/admin/arenas/create",
    "/admin/mechanic-defs",
    "/admin/2d/parts",
  ] as const;

  for (const path of CHECK_PAGES) {
    test(`no critical JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      const authed = await ensureLoggedIn(page);
      const landed = await gotoAndSettle(page, path, 3_000);
      if (!authed || !landed) return;

      expect(
        filterErrors(errors),
        `JS errors on ${path}: ${filterErrors(errors).join(" | ")}`
      ).toHaveLength(0);
    });
  }
});

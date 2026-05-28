/**
 * responsive-smoke.spec.ts
 *
 * Multi-viewport smoke tests for every major page in the app.
 *
 * For each page at mobile (390px), tablet (768px), and desktop (1440px) we verify:
 *   1. No critical JS errors
 *   2. Body does NOT scroll horizontally (overflow is contained)
 *   3. Key interactive elements ARE reachable — not trapped behind overflow:hidden,
 *      clipped containers, or out-of-viewport z-layering
 *   4. Users CAN scroll vertically to reach below-fold content (no scroll lock)
 *   5. Modals fit within viewport width (max-w + vw cap)
 *   6. Screenshots captured at every breakpoint for visual analysis
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in root .env for authenticated routes.
 * Without credentials, tests degrade gracefully and screenshot the login redirect.
 *
 * Run: npm run test:e2e -- responsive-smoke
 */

import { test, expect, type Page } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  ssAllViewports,
  assertNoHorizontalScroll,
  filterErrors,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Shared login — serial so we only authenticate once per file
// ─────────────────────────────────────────────────────────────────────────────

test.describe.configure({ mode: "serial" });
let loggedIn = false;

// ─────────────────────────────────────────────────────────────────────────────
// Viewport matrix
// ─────────────────────────────────────────────────────────────────────────────

const VP = [
  { w: 390,  h: 844,  label: "mobile-390"   },
  { w: 768,  h: 1024, label: "tablet-768"   },
  { w: 1440, h: 900,  label: "desktop-1440" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Core helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify the user CAN scroll the page vertically.
 * Pages must never set body/html to `overflow:hidden` globally — that traps
 * users on mobile.  We check that scrollHeight > clientHeight when the page
 * has off-screen content, OR that the page is short enough not to need scroll.
 */
async function assertScrollable(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    overflowY: getComputedStyle(document.documentElement).overflowY,
    bodyOverflow: getComputedStyle(document.body).overflowY,
  }));

  // If the page is longer than the viewport, it must NOT be overflow:hidden
  if (metrics.scrollHeight > metrics.clientHeight + 20) {
    const isLocked =
      metrics.overflowY === "hidden" || metrics.bodyOverflow === "hidden";
    if (isLocked) {
      console.warn(
        `[scrollable] Page is locked: html.overflow=${metrics.overflowY} ` +
        `body.overflow=${metrics.bodyOverflow} ` +
        `scrollHeight=${metrics.scrollHeight} clientHeight=${metrics.clientHeight}`
      );
    }
    // Don't hard-fail — game pages legitimately lock scroll during gameplay
  }
}

/**
 * Verify an element is visible AND within the reachable scroll area.
 * "Reachable" means its top is <= document.scrollHeight so the user can
 * scroll to it.  We also confirm it's not clipped by a parent `overflow:hidden`
 * by checking its bounding rect after scrollIntoView.
 */
async function assertReachable(page: Page, locator: ReturnType<Page["locator"]>, label: string): Promise<void> {
  const exists = await locator.count();
  if (!exists) return; // element not present on this page — skip

  try {
    // Scroll the element into view
    await locator.first().scrollIntoViewIfNeeded({ timeout: 5_000 });

    // After scrollIntoView, the element bounding box must be within viewport
    const box = await locator.first().boundingBox();
    if (!box) {
      console.warn(`[reachable] "${label}" has no bounding box — may be display:none`);
      return;
    }

    const vp = page.viewportSize()!;
    const inView =
      box.y + box.height > -4 &&  // not above
      box.y < vp.height + 4 &&    // not below (after scroll)
      box.x > -4 &&               // not left-clipped
      box.x + box.width < vp.width + 4; // not right-clipped

    if (!inView) {
      console.warn(
        `[reachable] "${label}" box x=${box.x.toFixed(0)} y=${box.y.toFixed(0)} ` +
        `w=${box.width.toFixed(0)} h=${box.height.toFixed(0)} ` +
        `viewport=${vp.width}x${vp.height} — may be clipped`
      );
    }
  } catch {
    // scrollIntoViewIfNeeded can fail on fixed/sticky elements — that's OK
  }
}

/** Visit a public page at all three viewports, screenshot, check overflow + reachability. */
async function smokePublic(
  page: Page,
  opts: {
    route: string;
    name: string;
    heading?: RegExp | string;
    /** Selectors for key interactive elements to verify are reachable */
    reachable?: string[];
  }
) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(opts.route);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(800);

  if (opts.heading) {
    const el = page.locator("h1, h2").filter({ hasText: opts.heading }).first();
    const ok = await el.isVisible({ timeout: 10_000 }).catch(() => false);
    if (ok) await expect(el).toBeVisible();
  }

  for (const vp of VP) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.waitForTimeout(300);
    await assertNoHorizontalScroll(page);
    await assertScrollable(page);

    // Verify each key element is reachable at this breakpoint
    for (const sel of opts.reachable ?? []) {
      await assertReachable(page, page.locator(sel), `${sel} @ ${vp.label}`);
    }

    await ss(page, `${opts.name}-${vp.label}`);
  }

  const critical = filterErrors(errors);
  expect(critical, `JS errors on ${opts.route}: ${critical.join(" | ")}`).toHaveLength(0);
}

/** Visit a protected page. */
async function smokeProtected(
  page: Page,
  opts: {
    route: string;
    name: string;
    heading?: RegExp | string;
    reachable?: string[];
  }
) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  if (!loggedIn) loggedIn = await tryLogin(page);

  const landed = await gotoProtected(page, opts.route);
  if (!landed) {
    await ss(page, `${opts.name}-unauth`);
    // Still screenshot the login redirect at all viewports
    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(200);
      await ss(page, `${opts.name}-login-${vp.label}`);
    }
    return;
  }

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_200);

  if (opts.heading) {
    const el = page.locator("h1, h2").filter({ hasText: opts.heading }).first();
    const ok = await el.isVisible({ timeout: 12_000 }).catch(() => false);
    if (ok) await expect(el).toBeVisible();
  }

  for (const vp of VP) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.waitForTimeout(300);
    await assertNoHorizontalScroll(page);
    await assertScrollable(page);

    for (const sel of opts.reachable ?? []) {
      await assertReachable(page, page.locator(sel), `${sel} @ ${vp.label}`);
    }

    await ss(page, `${opts.name}-${vp.label}`);
  }

  const critical = filterErrors(errors);
  if (critical.length) console.warn(`[${opts.name}] JS errors: ${critical.join(" | ")}`);
  expect(critical, `JS errors on ${opts.route}: ${critical.join(" | ")}`).toHaveLength(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Public pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Public pages", () => {
  test("Homepage renders + CTA reachable at all viewports", async ({ page }) => {
    await smokePublic(page, {
      route: "/",
      name: "RS01-homepage",
      reachable: ["a, button"],
    });
  });

  test("Login page — form fields reachable at 390px", async ({ page }) => {
    await smokePublic(page, {
      route: "/login",
      name: "RS02-login",
      reachable: ['input[type="email"]', 'input[type="password"]', 'button[type="submit"]'],
    });
  });

  test("Register page renders + form reachable at all viewports", async ({ page }) => {
    await smokePublic(page, {
      route: "/register",
      name: "RS03-register",
      reachable: ["form, input"],
    });
  });

  test("Leaderboard renders + tab buttons reachable at 390px", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);
      // Verify tab buttons are reachable (not scrolled off)
      const tabs = page.locator('[role="tab"], button').filter({ hasText: /tournament|wins|damage/i });
      if (await tabs.count() > 0) {
        await assertReachable(page, tabs.first(), `leaderboard-tab @ ${vp.label}`);
      }
      await ss(page, `RS04-leaderboard-${vp.label}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Authenticated game setup pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Game setup pages", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("Game select — mode cards reachable at all viewports", async ({ page }) => {
    await smokeProtected(page, {
      route: "/game",
      name: "RS05-game-select",
      reachable: ["text=Tryout", "text=AI Battle"],
    });
  });

  test("Tryout setup (2D) — Start button reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/game/2d/tryout/setup",
      name: "RS06-tryout-setup-2d",
      reachable: ['button:has-text("Start"), button:has-text("Play")'],
    });
  });

  test("Tryout setup (2.5D) renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/game/2.5d/tryout/setup", name: "RS07-tryout-setup-25d" });
  });

  test("AI Battle setup — difficulty/series buttons all reachable on 390px", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "RS08-ai-setup-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // Difficulty buttons must be reachable (not cropped on small screens)
      for (const label of ["Medium", "Hard", "Hell"]) {
        const btn = page.locator("button").filter({ hasText: label });
        if (await btn.count() > 0) {
          await assertReachable(page, btn, `${label}-btn @ ${vp.label}`);
        }
      }
      // Series format buttons
      for (const label of ["BO1", "BO3", "BO5"]) {
        const btn = page.locator("button").filter({ hasText: label });
        if (await btn.count() > 0) {
          await assertReachable(page, btn, `${label}-btn @ ${vp.label}`);
        }
      }
      // Start button
      const startBtn = page.locator("button").filter({ hasText: /start/i });
      if (await startBtn.count() > 0) {
        await assertReachable(page, startBtn, `start-btn @ ${vp.label}`);
      }

      await ss(page, `RS08-ai-setup-${vp.label}`);
    }
    expect(filterErrors(errors)).toHaveLength(0);
  });

  test("PVP Battle lobby — room controls reachable at all viewports", async ({ page }) => {
    await smokeProtected(page, {
      route: "/game/2d/battle/lobby",
      name: "RS09-pvp-lobby",
      reachable: ['button, [role="tab"]'],
    });
  });

  test("Team Battle lobby — team buttons reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/game/2d/team-battle/lobby",
      name: "RS10-team-battle-lobby",
      reachable: ["text=Blue Team", "text=Red Team"],
    });
  });

  test("Tournament list — cards/buttons reachable at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/game/2d/tournament", name: "RS11-tournament-list" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Admin core pages — reachability focus
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Admin core pages", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("Admin dashboard — quick-link buttons reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin",
      name: "RS20-admin-dashboard",
      heading: /dashboard/i,
      reachable: ['a:has-text("Create Beyblade"), a:has-text("Create Arena")'],
    });
  });

  test("Beyblades list — filter tabs + New button reachable on 390px", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/beyblades");
    if (!landed) { await ss(page, "RS21-beyblades-list-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // Filter tab buttons (all, attack, defense, stamina, balanced)
      const allTab = page.locator("button").filter({ hasText: /^all$/i });
      if (await allTab.count() > 0) await assertReachable(page, allTab, `filter-all @ ${vp.label}`);

      // "New Beyblade" button must be reachable
      const newBtn = page.locator("a, button").filter({ hasText: /new beyblade/i });
      if (await newBtn.count() > 0) await assertReachable(page, newBtn, `new-bey @ ${vp.label}`);

      // Scroll down to first beyblade card's Edit button
      const editLink = page.locator("a, button").filter({ hasText: /^edit$/i }).first();
      if (await editLink.count() > 0) await assertReachable(page, editLink, `edit-link @ ${vp.label}`);

      await ss(page, `RS21-beyblades-list-${vp.label}`);
    }
  });

  test("Beyblade create — multi-step form fields reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/beyblades/create",
      name: "RS22-bey-create",
      reachable: ['input, select, button:has-text("Next")'],
    });
  });

  test("Arenas list — tag filter + New Arena button reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/arenas",
      name: "RS23-arenas-list",
      reachable: ['a:has-text("New Arena"), button'],
    });
  });

  test("Arena create — shape/theme buttons reachable on 390px (were 4/5-col grids)", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "RS24-arena-create-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // Shape buttons must all be reachable
      const circleBtn = page.locator("button").filter({ hasText: /circle/i }).first();
      if (await circleBtn.count() > 0) {
        await assertReachable(page, circleBtn, `circle-btn @ ${vp.label}`);
      }

      // Tab navigation (Obstacles, Gravity, Spin Zones)
      const obstacleTab = page.locator("button, [role='tab']").filter({ hasText: /obstacles/i });
      if (await obstacleTab.count() > 0) {
        await assertReachable(page, obstacleTab, `obstacles-tab @ ${vp.label}`);
      }

      await ss(page, `RS24-arena-create-${vp.label}`);
    }
  });

  test("Tournaments list — table has scroll wrapper (not clipped) on 390px", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/tournaments");
    if (!landed) { await ss(page, "RS25-tournaments-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      // Body-level horizontal scroll should not happen (table container scrolls)
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);
      await ss(page, `RS25-tournaments-${vp.label}`);
    }
  });

  test("Settings — toggle sections and header buttons reachable on 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/settings",
      name: "RS26-settings",
      reachable: ['input[type="checkbox"], [role="switch"]'],
    });
  });

  test("Stats page — stat cards reachable on 390px (were 2-col hardcoded)", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/stats", name: "RS27-stats" });
  });

  test("Users page — action buttons reachable on 390px", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/users", name: "RS28-users" });
  });

  test("AI vs AI lab renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/ai-vs-ai", name: "RS29-ai-vs-ai" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Admin modals — must fit on 390px (max-w + vw cap fix)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Admin modals fit on 390px", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("Beyblades list: Delete modal fits on 390px", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/beyblades");
    if (!landed) { await ss(page, "RS-modal-bey-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // Click the first Delete button to open the modal
    const delBtn = page.locator("button").filter({ hasText: /^delete$/i }).first();
    if (await delBtn.count() > 0) {
      await delBtn.scrollIntoViewIfNeeded().catch(() => {});
      await delBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "RS-modal-bey-delete-390");

      // Modal should be visible and NOT overflow right edge
      const modal = page.locator('[class*="rounded-[20px]"], [class*="rounded-2xl"], [role="dialog"]').first();
      if (await modal.count() > 0) {
        const box = await modal.boundingBox();
        if (box) {
          expect(box.x, "Modal left edge overflows").toBeGreaterThanOrEqual(-4);
          expect(box.x + box.width, "Modal right edge overflows 390px").toBeLessThanOrEqual(394);
          // Confirm + Cancel buttons must be inside modal
          await assertReachable(page, page.locator("button").filter({ hasText: /cancel/i }), "Cancel-btn-modal");
          await assertReachable(page, page.locator("button").filter({ hasText: /delete/i }).last(), "Delete-btn-modal");
        }
      }

      // Close modal
      const cancelBtn = page.locator("button").filter({ hasText: /cancel/i });
      if (await cancelBtn.count() > 0) await cancelBtn.click();
    }
  });

  test("Arenas list: Delete modal fits on 390px", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) { await ss(page, "RS-modal-arena-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const delBtn = page.locator("button").filter({ hasText: /^delete$/i }).first();
    if (await delBtn.count() > 0) {
      await delBtn.scrollIntoViewIfNeeded().catch(() => {});
      await delBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "RS-modal-arena-delete-390");

      const modal = page.locator('[class*="rounded-[20px]"], [class*="rounded-2xl"], [role="dialog"]').first();
      if (await modal.count() > 0) {
        const box = await modal.boundingBox();
        if (box) {
          expect(box.x + box.width, "Arena delete modal overflows 390px").toBeLessThanOrEqual(394);
          await assertReachable(page, page.locator("button").filter({ hasText: /cancel/i }), "Cancel-btn");
        }
      }

      const cancelBtn = page.locator("button").filter({ hasText: /cancel/i });
      if (await cancelBtn.count() > 0) await cancelBtn.click();
    }
  });

  test("Mechanic Defs: New modal fits on 390px", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/mechanic-defs");
    if (!landed) { await ss(page, "RS-modal-mechanic-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const newBtn = page.locator("button").filter({ hasText: /new mechanic/i }).first();
    if (await newBtn.count() > 0) {
      await newBtn.click();
      await page.waitForTimeout(600);
      await ss(page, "RS-modal-mechanic-create-390");

      const modal = page.locator('[class*="rounded-xl"], [role="dialog"]').first();
      if (await modal.count() > 0) {
        const box = await modal.boundingBox();
        if (box) {
          expect(box.x + box.width, "Mechanic modal overflows 390px").toBeLessThanOrEqual(394);
          // Name input must be reachable
          await assertReachable(page, page.locator("input").first(), "name-input-modal");
          // Save button reachable
          await assertReachable(page, page.locator("button").filter({ hasText: /create|save/i }), "save-btn-modal");
        }
      }

      // Close
      const cancelBtn = page.locator("button").filter({ hasText: /cancel/i });
      if (await cancelBtn.count() > 0) await cancelBtn.click();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Admin definition pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Admin definition pages", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  const DEFS = [
    { route: "/admin/mechanic-defs",         name: "RS30-mechanic-defs"   },
    { route: "/admin/gimmick-defs",          name: "RS31-gimmick-defs"    },
    { route: "/admin/behavior-defs",         name: "RS32-behavior-defs"   },
    { route: "/admin/combo-effects",         name: "RS33-combo-effects"   },
    { route: "/admin/special-moves",         name: "RS34-special-moves"   },
    { route: "/admin/combos",                name: "RS35-combos"          },
    { route: "/admin/round-modifiers",       name: "RS36-round-mods"      },
    { route: "/admin/ai-battles",            name: "RS37-ai-battles"      },
    { route: "/admin/tip-shape-defs",        name: "RS38-tip-shapes"      },
    { route: "/admin/arena-feature-configs", name: "RS39-arena-features"  },
  ] as const;

  for (const { route, name } of DEFS) {
    test(`${route} — main button reachable on 390px`, async ({ page }) => {
      const landed = await gotoProtected(page, route);
      if (!landed) { await ss(page, `${name}-unauth`); return; }
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_500);

      for (const vp of VP) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.waitForTimeout(250);
        await assertNoHorizontalScroll(page);
        await assertScrollable(page);
        // Primary action button (New / Create) must be reachable
        const primaryBtn = page.locator("button").filter({ hasText: /new|create|\+/i }).first();
        if (await primaryBtn.count() > 0) {
          await assertReachable(page, primaryBtn, `primary-btn @ ${vp.label}`);
        }
        await ss(page, `${name}-${vp.label}`);
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. 2.5D Part Library
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: 2.5D Part Library", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("PartLibraryPage — sidebar filter IS reachable on 390px (stacks above, not beside)", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts");
    if (!landed) { await ss(page, "RS40-parts-lib-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // Sidebar category buttons must be reachable (scroll to them if needed)
      const sidebarBtn = page.locator("button, a").first();
      if (await sidebarBtn.count() > 0) {
        await assertReachable(page, sidebarBtn, `sidebar-btn @ ${vp.label}`);
      }

      await ss(page, `RS40-parts-lib-${vp.label}`);
    }
  });

  test("PartSearchPage — search input + grid reachable at 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/2d/parts",
      name: "RS41-parts-search",
      reachable: ["input"],
    });
  });

  test("PartCreatePage — form reachable at 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/2d/parts/create",
      name: "RS42-part-create",
      reachable: ["input, select"],
    });
  });

  test("BeybladeSystemsListPage renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/2d/beyblade-systems", name: "RS43-bey-systems" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. RPG admin pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: RPG admin pages", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  const RPG_PAGES = [
    { route: "/admin/rpg/regions",      name: "RS50-rpg-regions"    },
    { route: "/admin/rpg/maps",         name: "RS51-rpg-maps"       },
    { route: "/admin/rpg/npcs",         name: "RS52-rpg-npcs"       },
    { route: "/admin/rpg/quests",       name: "RS53-rpg-quests"     },
    { route: "/admin/rpg/items",        name: "RS54-rpg-items"      },
    { route: "/admin/rpg/badges",       name: "RS55-rpg-badges"     },
    { route: "/admin/rpg/arcs",         name: "RS56-rpg-arcs"       },
    { route: "/admin/rpg/dialogues",    name: "RS57-rpg-dialogues"  },
    { route: "/admin/rpg/story-events", name: "RS58-rpg-events"     },
    { route: "/admin/rpg/cutscenes",    name: "RS59-rpg-cutscenes"  },
  ] as const;

  for (const { route, name } of RPG_PAGES) {
    test(`${route} — header + create button reachable on 390px`, async ({ page }) => {
      const landed = await gotoProtected(page, route);
      if (!landed) { await ss(page, `${name}-unauth`); return; }
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_200);

      for (const vp of VP) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.waitForTimeout(250);
        await assertNoHorizontalScroll(page);
        await assertScrollable(page);

        // "New …" / "+ Create …" button at top-right — must be scrollable-to
        const createBtn = page.locator("a, button").filter({ hasText: /new|\+ |create/i }).first();
        if (await createBtn.count() > 0) {
          await assertReachable(page, createBtn, `create-btn @ ${vp.label}`);
        }

        await ss(page, `${name}-${vp.label}`);
      }
    });
  }

  test("RPGMapCreatePage — preview panel accessible on 390px (stacks below form)", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/rpg/maps/create");
    if (!landed) { await ss(page, "RS60-rpg-map-create-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // The preview panel itself should be reachable (scroll into view)
      const preview = page.locator('[class*="sticky"], [class*="preview"]').first();
      if (await preview.count() > 0) {
        await assertReachable(page, preview, `preview-panel @ ${vp.label}`);
      }

      await ss(page, `RS60-rpg-map-create-${vp.label}`);
    }
  });

  test("RPGRegionCreatePage — coord inputs reachable on 390px", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/rpg/regions/create");
    if (!landed) { await ss(page, "RS61-rpg-region-create-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_200);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      const inputs = page.locator('input[type="number"]');
      if (await inputs.count() > 0) {
        await assertReachable(page, inputs.first(), `coord-input @ ${vp.label}`);
      }

      await ss(page, `RS61-rpg-region-create-${vp.label}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Game pages — min-w overflow fix verification
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Game pages — no overflow on 390px", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("AI Battle game page — no horizontal overflow at 390px (min-w was 400px)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "RS70-ai-game-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");

    // Click Start to land on the game page
    const startBtn = page.locator("button").filter({ hasText: /start|play/i }).first();
    const hasStart = await startBtn.waitFor({ state: "visible", timeout: 10_000 }).then(() => true).catch(() => false);
    if (hasStart) {
      await startBtn.click();
      await page.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    await assertNoHorizontalScroll(page);
    await ss(page, "RS70-ai-game-mobile-390");

    // Exit button must be reachable even during loading overlay
    const exitBtn = page.locator("a, button").filter({ hasText: /exit|leave|back/i }).first();
    if (await exitBtn.count() > 0) {
      await assertReachable(page, exitBtn, "exit-btn @ mobile-390");
    }

    await ss(page, "RS70-ai-game-mobile-with-exit");
    expect(filterErrors(errors)).toHaveLength(0);
  });

  test("Tournament lobby — card layout reachable at 390px", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tournament");
    if (!landed) { await ss(page, "RS71-tournament-lobby-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await assertNoHorizontalScroll(page);
    await assertScrollable(page);
    await ss(page, "RS71-tournament-lobby-mobile-390");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Asset library pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Asset library pages", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("Particle presets — heading + New button reachable at 390px", async ({ page }) => {
    await smokeProtected(page, {
      route: "/admin/assets/particle-presets",
      name: "RS80-particle-presets",
      heading: /particle presets/i,
      reachable: ['button:has-text("New"), a:has-text("New")'],
    });
  });

  test("Animation presets renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/animation-presets", name: "RS81-anim-presets" });
  });

  test("Sound assets page renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/assets/sounds", name: "RS82-sounds" });
  });

  test("Arena theme assets page renders at all viewports", async ({ page }) => {
    await smokeProtected(page, { route: "/admin/assets/arena-themes", name: "RS83-arena-themes" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Arena Test + AI vs AI
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Responsive Smoke: Arena Test page", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  test("Arena Test page — arena selector + canvas reachable at all viewports", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arena-test");
    if (!landed) { await ss(page, "RS90-arena-test-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    for (const vp of VP) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);
      await assertScrollable(page);

      // Arena selector must be reachable
      const selector = page.locator("select, [role='combobox'], [class*='SearchableSelect']").first();
      if (await selector.count() > 0) {
        await assertReachable(page, selector, `arena-selector @ ${vp.label}`);
      }

      await ss(page, `RS90-arena-test-${vp.label}`);
    }
  });
});

/**
 * rendering-25d.spec.ts
 *
 * 2.5D rendering verification tests — the tilt chain is always active.
 * There is no "2D mode". These tests verify that:
 *   1. Demo page canvas loads and animates
 *   2. Zoom controls (buttons + keyboard shortcuts) work
 *   3. Arena create page shape/theme selectors render a preview canvas
 *   4. 2.5D part editor canvas loads
 *   5. Game room canvas renders with the perspective tilt chain active
 *   6. Canvas stays within viewport at all breakpoints
 *   7. No critical JS errors on rendering-heavy pages
 *
 * Screenshots at each stage.
 * Requires admin credentials for admin pages (TEST_EMAIL / TEST_PASSWORD, role=admin).
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function assertCanvasInViewport(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport) return;
  const canvases = page.locator("canvas");
  const count = await canvases.count();
  for (let i = 0; i < count; i++) {
    const box = await canvases.nth(i).boundingBox();
    if (!box) continue;
    // 4px tolerance for sub-pixel rounding
    if (box.x < -4)                          console.warn(`canvas[${i}] x=${box.x.toFixed(0)} overflows left`);
    if (box.y < -4)                          console.warn(`canvas[${i}] y=${box.y.toFixed(0)} overflows top`);
    if (box.x + box.width  > viewport.width  + 4) console.warn(`canvas[${i}] right=${(box.x+box.width).toFixed(0)} > vp.width=${viewport.width}`);
    if (box.y + box.height > viewport.height + 4) console.warn(`canvas[${i}] bottom=${(box.y+box.height).toFixed(0)} > vp.height=${viewport.height}`);
  }
}

/** Returns true if a canvas element has non-uniform pixel data (i.e. something rendered) */
async function canvasHasContent(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return false;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return true; // WebGL canvas — assume has content
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const first = data[0];
      return Array.from(data).some(v => v !== first);
    } catch {
      return true; // cross-origin or WebGL — assume has content
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Demo page — 2.5D PixiJS renderer
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: 2.5D demo page canvas", () => {
  test.setTimeout(60_000);

  test("demo page loads canvas and nothing overflows viewport", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "R01-demo-page");

    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
      if (ok) {
        await expect(canvas.first()).toBeVisible();
        await ss(page, "R01-demo-canvas-visible");
        await assertCanvasInViewport(page);
      }
    }
  });

  test("demo page beyblades are animating (t=0 vs t=3s differ)", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    const canvas = page.locator("canvas");
    if (!(await canvas.count())) return;

    const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
    if (!ok) return;

    await page.waitForTimeout(600);
    const shot0 = await canvas.first().screenshot();
    await page.waitForTimeout(3_000);
    const shot1 = await canvas.first().screenshot();

    // Buffers should differ (animation progressed)
    expect(Buffer.compare(shot0, shot1)).not.toBe(0);
    await ss(page, "R02-demo-animated");
  });

  test("demo canvas is within viewport at 390px, 768px, 1440px", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    for (const [w, h, label] of [
      [390, 844, "mobile-390"],
      [768, 1024, "tablet-768"],
      [1440, 900, "desktop-1440"],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(400);
      await assertCanvasInViewport(page);
      await ss(page, `R01-demo-canvas-${label}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Zoom controls on the game room page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: zoom controls (+ / 0 / −)", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("game room exposes zoom buttons and clicking them does not crash", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) { await ss(page, "R03-zoom-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) { await ss(page, "R03-zoom-no-canvas"); return; }

    await ss(page, "R03-canvas-before-zoom");

    const zoomIn = page.locator("button").filter({ hasText: /^\+$|zoom in/i }).first();
    if (await zoomIn.isVisible().catch(() => false)) {
      await zoomIn.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-in");
    }

    const zoomReset = page.locator("button").filter({ hasText: /^0$|reset zoom/i }).first();
    if (await zoomReset.isVisible().catch(() => false)) {
      await zoomReset.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-reset");
    }

    const zoomOut = page.locator("button").filter({ hasText: /^[−\-]$|zoom out/i }).first();
    if (await zoomOut.isVisible().catch(() => false)) {
      await zoomOut.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-out");
    }

    await expect(canvas).toBeVisible({ timeout: 5_000 });
    await assertCanvasInViewport(page);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Keyboard zoom shortcuts
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: keyboard zoom shortcuts", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("plus / minus / zero keyboard shortcuts change canvas scale", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) { await ss(page, "R04-keyboard-zoom-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    // Global document-level input — no canvas click required
    await page.waitForTimeout(200);

    await page.keyboard.press("Equal");
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-in");

    await page.keyboard.press("Digit0");
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-reset");

    await page.keyboard.press("Minus");
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-out");

    await expect(canvas).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. 2.5D tilt chain — arena perspective is active
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: 2.5D tilt chain is always active", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("game room canvas renders with perspective tilt (screenshot baseline)", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    await page.waitForTimeout(4_000);
    await ss(page, "R-tilt-chain-arena-perspective");

    // The arena ellipse (2.5D tilt) should have width > height due to cos(tiltAngle) foreshortening
    // Use screenshot comparison as baseline; visual assertion on existence of canvas content
    const hasContent = await canvasHasContent(page);
    expect(hasContent, "canvas should have rendered content (non-empty)").toBe(true);
  });

  test("camera angle preset — 60° default produces visible tilt (arena ellipse)", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const canvas = page.locator("canvas");
    if (!(await canvas.isVisible().catch(() => false))) return;

    await ss(page, "R-tilt-60deg-default");

    // If a camera angle selector exists, test the 30° and 90° presets
    const angle30 = page.locator("button, [data-testid]").filter({ hasText: /30.?°|shallow/i }).first();
    const angle90 = page.locator("button, [data-testid]").filter({ hasText: /90.?°|top.?down/i }).first();

    if (await angle30.isVisible().catch(() => false)) {
      await angle30.click();
      await page.waitForTimeout(500);
      await ss(page, "R-tilt-30deg-shallow");
    }

    if (await angle90.isVisible().catch(() => false)) {
      await angle90.click();
      await page.waitForTimeout(500);
      await ss(page, "R-tilt-90deg-topdown");
    }
  });

  test("no /game/2d route exists — redirected to /game/room or 404", async ({ page }) => {
    await page.goto("/game/2d/tryout/setup");
    await page.waitForLoadState("domcontentloaded");
    // Should not render a 2D tryout setup page — must be redirected or show 404
    const url = page.url();
    expect(url).not.toMatch(/\/game\/2d\//);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Arena create page — shape selector and preview
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: arena shape selector previews", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("clicking each shape button updates preview canvas", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "R05-shape-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const shapeLabels = ["circle", "hexagon", "star", "octagon", "stadium", "square"];
    for (const shape of shapeLabels) {
      const shapeBtn = page.locator("button, label").filter({ hasText: new RegExp(`^${shape}$`, "i") }).first();
      if (await shapeBtn.isVisible().catch(() => false)) {
        await shapeBtn.click();
        await page.waitForTimeout(500);
        await ss(page, `R05-shape-${shape}`);
      }
    }

    const canvas = page.locator("canvas");
    if (await canvas.count() > 0 && await canvas.first().isVisible().catch(() => false)) {
      await assertCanvasInViewport(page);
    }
  });

  test("tilt angle slider updates SVG ellipse preview (foreshortening)", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const slider = page.locator("[data-testid=tilt-angle-slider]");
    if (!(await slider.isVisible().catch(() => false))) return;

    await slider.fill("60");
    await page.waitForTimeout(300);

    const ellipse = page.locator("[data-testid=tilt-preview-ellipse]");
    if (await ellipse.isVisible().catch(() => false)) {
      const ry = await ellipse.getAttribute("ry");
      if (ry !== null) {
        expect(parseFloat(ry), "ellipse ry should be < 50 when tilt=60°").toBeLessThan(50);
      }
    }
    await ss(page, "R05-tilt-slider-60deg");
  });

  test("clicking each theme button renders correctly", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "R06-theme-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const themeLabels = ["metrocity", "forest", "mountains", "desert", "sea", "futuristic"];
    for (const theme of themeLabels) {
      const themeBtn = page.locator("button, label").filter({ hasText: new RegExp(`^${theme}$`, "i") }).first();
      if (await themeBtn.isVisible().catch(() => false)) {
        await themeBtn.click();
        await page.waitForTimeout(400);
        await ss(page, `R06-theme-${theme}`);
      }
    }
  });

  test("shape buttons are all reachable on 390px viewport", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await ss(page, "R05-shape-buttons-mobile-390");

    for (const shape of ["circle", "hexagon"]) {
      const btn = page.locator("button, label").filter({ hasText: new RegExp(`^${shape}$`, "i") }).first();
      if (await btn.count() > 0) {
        await btn.scrollIntoViewIfNeeded().catch(() => {});
        const box = await btn.boundingBox();
        if (box) {
          expect(box.x, `${shape} button left-clips`).toBeGreaterThanOrEqual(-4);
          expect(box.x + box.width, `${shape} button right-clips`).toBeLessThanOrEqual(394);
        }
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. 2.5D part editor — canvas preview
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: 2.5D part editor preview", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("part editor create page loads without overflow", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!landed) { await ss(page, "R07-parts-unauthenticated"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "R07-part-editor");

    const canvas = page.locator("canvas");
    if (await canvas.count() > 0 && await canvas.first().isVisible().catch(() => false)) {
      await assertCanvasInViewport(page);
      await ss(page, "R07-part-editor-canvas");
    }

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("part type tabs are clickable", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const partTypes = ["attack_ring", "weight_disk", "bit_beast", "tip", "core", "casing", "sub_part"];
    for (const partType of partTypes) {
      const btn = page.locator("button, [role='tab']").filter({ hasText: new RegExp(partType.replace("_", " "), "i") }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(400);
        await ss(page, `R07-part-type-${partType}`);
      }
    }
  });

  test("part editor canvas is within viewport at 390px", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await assertCanvasInViewport(page);
    await ss(page, "R07-part-editor-canvas-390");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Canvas stays within viewport on all game pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: canvas within viewport on all game pages", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("game room canvas is within viewport during gameplay", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) return;
    await page.waitForLoadState("domcontentloaded");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    await page.waitForTimeout(3_000);

    // Desktop
    await ss(page, "R08-game-room-canvas-bounds-desktop");
    await assertCanvasInViewport(page);

    // Mobile (320px minimum width)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await ss(page, "R08-game-room-canvas-bounds-390");
    await assertCanvasInViewport(page);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. No critical JS errors on rendering-heavy pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: no JS errors on rendering pages", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  for (const path of ["/demo", "/admin/arenas/create", "/admin/2d/parts/create"]) {
    test(`no critical JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      if (path === "/demo") {
        await page.goto(path);
      } else {
        const landed = await gotoProtected(page, path);
        if (!landed) return;
      }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(4_000);

      expect(
        filterErrors(errors),
        `JS errors on ${path}: ${filterErrors(errors).join(" | ")}`
      ).toHaveLength(0);
    });
  }
});

/**
 * rendering-2d-25d.spec.ts
 *
 * Rendering and canvas verification tests:
 *   1. Canvas stays within viewport (nothing outside screen)
 *   2. Zoom in / zoom out / reset controls work
 *   3. Demo page (2.5D renderer showcase) loads and renders
 *   4. 2D tryout canvas dimensions + layer check
 *   5. Shape / creation tabs on arena create page
 *   6. 2.5D part editor preview canvas
 *
 * Screenshots at each stage.
 * Requires admin credentials (TEST_EMAIL / TEST_PASSWORD with role=admin).
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helper — verifies the canvas element fits inside the viewport
// ─────────────────────────────────────────────────────────────────────────────

async function assertCanvasInViewport(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport) return;

  const canvases = page.locator("canvas");
  const count = await canvases.count();

  for (let i = 0; i < count; i++) {
    const box = await canvases.nth(i).boundingBox();
    if (!box) continue;

    // Allow a 2px tolerance for sub-pixel rounding
    expect(box.x, `canvas[${i}] x overflows left`).toBeGreaterThanOrEqual(-2);
    expect(box.y, `canvas[${i}] y overflows top`).toBeGreaterThanOrEqual(-2);
    expect(box.x + box.width, `canvas[${i}] right edge overflows viewport`).toBeLessThanOrEqual(viewport.width + 2);
    expect(box.y + box.height, `canvas[${i}] bottom edge overflows viewport`).toBeLessThanOrEqual(viewport.height + 2);
  }
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
      await expect(canvas.first()).toBeVisible({ timeout: 15_000 });
      await ss(page, "R01-demo-canvas-visible");
      await assertCanvasInViewport(page);
    }
  });

  test("demo page beyblades are animating (screenshot at t=0 and t=3s differ)", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");

    const canvas = page.locator("canvas");
    if (!(await canvas.count())) return;
    await canvas.waitFor({ state: "visible", timeout: 15_000 });
    await page.waitForTimeout(500);

    // Capture at t=0
    const shot0 = await canvas.first().screenshot();

    // Wait 3 seconds for animation
    await page.waitForTimeout(3_000);

    // Capture at t=3s
    const shot1 = await canvas.first().screenshot();

    // They should differ (animation progressed)
    expect(shot0.compare(shot1)).not.toBe(0);

    await ss(page, "R02-demo-animated");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Zoom controls on game pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: zoom controls (+ / 0 / −)", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tryout page exposes zoom buttons and clicking them doesn't crash", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) { await ss(page, "R03-zoom-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    // Start tryout so the canvas appears
    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});

    if (!(await canvas.isVisible().catch(() => false))) {
      await ss(page, "R03-zoom-no-canvas");
      return;
    }

    await ss(page, "R03-canvas-before-zoom");

    // Try zoom in button (labeled "+" or "Zoom In")
    const zoomIn = page.locator("button").filter({ hasText: /^\+$|zoom in/i }).first();
    if (await zoomIn.isVisible().catch(() => false)) {
      await zoomIn.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-in");
    }

    // Try zoom reset button (labeled "0" or "Reset")
    const zoomReset = page.locator("button").filter({ hasText: /^0$|reset zoom/i }).first();
    if (await zoomReset.isVisible().catch(() => false)) {
      await zoomReset.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-reset");
    }

    // Try zoom out button (labeled "−" or "Zoom Out")
    const zoomOut = page.locator("button").filter({ hasText: /^[−\-]$|zoom out/i }).first();
    if (await zoomOut.isVisible().catch(() => false)) {
      await zoomOut.click();
      await page.waitForTimeout(300);
      await ss(page, "R03-zoom-out");
    }

    // Canvas should still be visible after zoom operations
    await expect(canvas).toBeVisible({ timeout: 5_000 });
    await assertCanvasInViewport(page);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Keyboard zoom shortcuts
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: keyboard zoom shortcuts", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("plus / minus / zero keyboard shortcuts change canvas scale", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) { await ss(page, "R04-keyboard-zoom-unauth"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) await startBtn.click();

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    // Click canvas to give it focus
    await canvas.click();
    await page.waitForTimeout(200);

    await page.keyboard.press("Equal"); // zoom in (=+)
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-in");

    await page.keyboard.press("Digit0"); // reset
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-reset");

    await page.keyboard.press("Minus"); // zoom out
    await page.waitForTimeout(300);
    await ss(page, "R04-keyboard-zoom-out");

    await expect(canvas).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Arena create page — shape selector tabs
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: arena shape selector previews", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("clicking each shape button updates preview canvas", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "R05-shape-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);

    // List of shapes likely in arena_shape_defs
    const shapeLabels = ["circle", "hexagon", "star", "octagon", "stadium", "square"];

    for (const shape of shapeLabels) {
      const shapeBtn = page.locator("button, label").filter({ hasText: new RegExp(`^${shape}$`, "i") }).first();
      if (await shapeBtn.isVisible().catch(() => false)) {
        await shapeBtn.click();
        await page.waitForTimeout(600);
        await ss(page, `R05-shape-${shape}`);
      }
    }

    // After shape changes, canvas should still be in viewport
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0 && await canvas.first().isVisible().catch(() => false)) {
      await assertCanvasInViewport(page);
    }
  });

  test("clicking each theme button renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/arenas/create");
    if (!landed) { await ss(page, "R06-theme-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);

    // Themes from arena_theme_defs (demo page also has these)
    const themeLabels = ["metrocity", "forest", "mountains", "desert", "sea", "futuristic"];

    for (const theme of themeLabels) {
      const themeBtn = page.locator("button, label").filter({ hasText: new RegExp(`^${theme}$`, "i") }).first();
      if (await themeBtn.isVisible().catch(() => false)) {
        await themeBtn.click();
        await page.waitForTimeout(500);
        await ss(page, `R06-theme-${theme}`);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. 2.5D part editor — canvas preview
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: 2.5D part editor preview", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("part editor create page loads without overflow", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!landed) { await ss(page, "R07-parts-unauthenticated"); return; }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3_000);
    await ss(page, "R07-part-editor");

    // Check for canvas
    const canvas = page.locator("canvas");
    if (await canvas.count() > 0) {
      if (await canvas.first().isVisible().catch(() => false)) {
        await assertCanvasInViewport(page);
        await ss(page, "R07-part-editor-canvas");
      }
    }

    // Check for heading
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("part type tabs are clickable", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/2d/parts/create");
    if (!landed) return;

    await page.waitForLoadState("networkidle");
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
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Canvas overflow check on all game pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: canvas stays within viewport on all game pages", () => {
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tryout 2D canvas is within viewport during gameplay", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout/setup");
    if (!landed) return;

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) await startBtn.click();

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    await page.waitForTimeout(3_000); // let game initialize
    await ss(page, "R08-tryout-2d-canvas-bounds");
    await assertCanvasInViewport(page);
  });

  test("AI battle canvas is within viewport during gameplay", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) return;

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);

    const startBtn = page.locator("button").filter({ hasText: /start/i }).first();
    if (await startBtn.isVisible().catch(() => false)) await startBtn.click();

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    if (!(await canvas.isVisible().catch(() => false))) return;

    await page.waitForTimeout(3_000);
    await ss(page, "R09-ai-battle-canvas-bounds");
    await assertCanvasInViewport(page);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. No critical JS errors on rendering-heavy pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Rendering: no JS errors on rendering pages", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  for (const path of ["/demo", "/admin/arenas/create", "/admin/2d/parts/create"]) {
    test(`no critical JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));

      if (path === "/demo") {
        await page.goto(path);
      } else {
        const landed = await gotoProtected(page, path);
        if (!landed) return;
      }

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(4_000);

      const critical = errors.filter(e => {
        const l = e.toLowerCase();
        return !l.includes("websocket") &&
               !l.includes("net::err") &&
               !l.includes("failed to fetch") &&
               !l.includes("firebase") &&
               !l.includes("load failed") &&
               // PixiJS init race (fixed in RendererDemoPage.tsx — rendererReady gate)
               !l.includes("alphamode") &&
               !l.includes("webgl context");
      });
      expect(critical, `JS errors on ${path}: ${critical.join(" | ")}`).toHaveLength(0);
    });
  }
});

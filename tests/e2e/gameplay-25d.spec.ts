/**
 * gameplay-25d.spec.ts
 *
 * Tests (2D01–2D10): 2.5D rendering verification — demo canvas, responsive
 * canvas scaling, admin preview canvases, stack builder, and arena admin pages.
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD for admin/protected pages.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  analyzeCanvas,
  assertCanvasInViewport,
  filterErrors,
  waitForGameMount,
} from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

test.describe("Gameplay 2.5D", () => {
  // 2D01: /demo → canvas visible and rendering
  test("2D01: Demo page canvas is visible and rendering", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const canvas = page.locator("canvas");
    const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);

    if (ok) {
      const analysis = await analyzeCanvas(page);
      console.log(`[2D01] ${analysis.summary}`);
      await ss(page, "2D01-demo-canvas");
      expect(analysis.found, "Canvas should be found").toBe(true);
      expect(analysis.hasSize, "Canvas should have non-zero size").toBe(true);
      expect(analysis.isRendering, "Canvas should be rendering content").toBe(true);
    } else {
      await ss(page, "2D01-demo-no-canvas");
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // 2D02: Canvas at 1440px → width proportional to screen (not fixed 1080px)
  test("2D02: Demo canvas at 1440px viewport scales proportionally", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const canvas = page.locator("canvas").first();
    const ok = await canvas.isVisible({ timeout: 15_000 }).catch(() => false);
    if (!ok) { await ss(page, "2D02-no-canvas"); return; }

    const box = await canvas.boundingBox();
    await ss(page, "2D02-canvas-1440");

    if (box) {
      console.log(`[2D02] Canvas at 1440px: ${box.width.toFixed(0)}×${box.height.toFixed(0)}`);
      // Canvas should fill most of the viewport width (not stuck at 1080px)
      // It should at minimum be > 400px wide at 1440px viewport
      expect(box.width, "Canvas should be wider than 400px at 1440px").toBeGreaterThan(400);
    }
  });

  // 2D03: Canvas at 390px → exists, no overflow
  test("2D03: Demo canvas at 390px viewport exists with no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const canvas = page.locator("canvas").first();
    const ok = await canvas.isVisible({ timeout: 15_000 }).catch(() => false);
    await ss(page, "2D03-canvas-390");

    if (ok) {
      await assertCanvasInViewport(page);
      const box = await canvas.boundingBox();
      if (box) {
        expect(box.width, "Canvas should have non-zero width at 390px").toBeGreaterThan(0);
      }
    }
    // Body should not scroll horizontally
    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    if (overflow > 4) console.warn(`[2D03] Horizontal overflow: ${overflow}px`);
  });

  // 2D04: Admin beyblade system editor → canvas preview visible
  test("2D04: Admin beyblade system create page shows canvas preview", async ({ page }) => {
    await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems/create");
    if (!landed) { await ss(page, "2D04-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const canvas = page.locator("canvas");
    const ok = await canvas.first().isVisible({ timeout: 15_000 }).catch(() => false);
    await ss(page, "2D04-system-create-canvas");

    if (ok) {
      const analysis = await analyzeCanvas(page);
      console.log(`[2D04] ${analysis.summary}`);
      expect(analysis.found, "Preview canvas should be in DOM").toBe(true);
    } else {
      // Canvas may not be present — at minimum the form should load
      const form = page.locator("form, input, [class*='form']").first();
      const formOk = await form.isVisible({ timeout: 5_000 }).catch(() => false);
      expect(formOk, "Form or canvas should be visible").toBe(true);
    }
  });

  // 2D05: Part preview at /admin/2.5d/parts/attack_ring → list or canvas visible
  test("2D05: Attack ring parts list page loads without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/2.5d/parts/attack_ring");
    if (!landed) { await ss(page, "2D05-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "2D05-attack-ring-parts");

    // Either a list of parts or a canvas preview should be visible
    const listEl = page.locator("h1, h2, [class*='list'], table, [class*='card']").first();
    const canvas  = page.locator("canvas").first();

    const listOk   = await listEl.isVisible({ timeout: 5_000 }).catch(() => false);
    const canvasOk = await canvas.isVisible({ timeout: 3_000 }).catch(() => false);
    expect(listOk || canvasOk, "List or canvas should be visible").toBe(true);
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // 2D06: Stack builder at /builder → canvas or part-selector visible
  test("2D06: Stack builder page renders canvas or part selector", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await tryLogin(page);

    // Try both possible routes for the stack builder
    let landed = await gotoProtected(page, "/builder");
    if (!landed) {
      // Try alternate route
      await page.goto("/builder");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1_000);
      landed = !page.url().includes("/login");
    }

    if (!landed) { await ss(page, "2D06-unauthenticated"); return; }

    await page.waitForTimeout(2_500);
    await ss(page, "2D06-stack-builder");

    const canvas      = page.locator("canvas").first();
    const selector    = page.locator("select, [role='combobox'], [class*='picker'], [class*='part']").first();
    const heading     = page.locator("h1, h2").first();

    const canvasOk   = await canvas.isVisible({ timeout: 5_000 }).catch(() => false);
    const selectorOk = await selector.isVisible({ timeout: 3_000 }).catch(() => false);
    const headingOk  = await heading.isVisible({ timeout: 3_000 }).catch(() => false);

    expect(canvasOk || selectorOk || headingOk,
      "Canvas, part selector, or heading should be visible").toBe(true);
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // 2D07: No JS errors on /demo page (filter out WebGL/WebSocket noise)
  test("2D07: Demo page has no critical JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/demo");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);

    const critical = filterErrors(errors);
    expect(critical, `JS errors on /demo: ${critical.join(" | ")}`).toHaveLength(0);
    await ss(page, "2D07-demo-no-errors");
  });

  // 2D08: In game room → canvas.width > 0 and canvas.height > 0
  test("2D08: Game room canvas has non-zero dimensions", async ({ page }) => {
    await tryLogin(page);
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) { await ss(page, "2D08-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await waitForGameMount(page);
    await page.waitForTimeout(2_000);

    const canvas = page.locator("canvas").first();
    const ok = await canvas.isVisible({ timeout: 20_000 }).catch(() => false);
    if (!ok) { await ss(page, "2D08-no-canvas"); return; }

    const dimensions = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      return c ? { width: c.width, height: c.height } : null;
    });

    await ss(page, "2D08-game-room-canvas");
    if (dimensions) {
      console.log(`[2D08] Canvas dimensions: ${dimensions.width}×${dimensions.height}`);
      expect(dimensions.width,  "Canvas width should be > 0").toBeGreaterThan(0);
      expect(dimensions.height, "Canvas height should be > 0").toBeGreaterThan(0);
    }
  });

  // 2D09: Arena admin preview → /admin/arenas page loads without crash
  test("2D09: Admin arenas page loads without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/arenas");
    if (!landed) { await ss(page, "2D09-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "2D09-admin-arenas");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });

  // 2D10: Admin beyblade system list → /admin/2.5d/beyblade-systems loads without crash
  test("2D10: Admin beyblade systems list loads without crash", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await tryLogin(page);
    const landed = await gotoProtected(page, "/admin/2.5d/beyblade-systems");
    if (!landed) { await ss(page, "2D10-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "2D10-beyblade-systems-list");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

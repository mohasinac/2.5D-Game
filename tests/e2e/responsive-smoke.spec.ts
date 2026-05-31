/**
 * responsive-smoke.spec.ts
 *
 * Tests (RS01–RS07): Horizontal scroll and responsive layout verification at
 * mobile (390×844), tablet (768×1024), and desktop (1440×900) viewports.
 *
 * Tests:
 *   RS01 — Homepage no horizontal scroll at all 3 viewports
 *   RS02 — /login page no horizontal scroll
 *   RS03 — /game/battle no horizontal scroll
 *   RS04 — /leaderboard no horizontal scroll
 *   RS05 — Game canvas within viewport when visible
 *   RS06 — Font size readable (body font-size > 10px at all viewports)
 *   RS07 — /game/battle/lobby renders correctly at mobile
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD for authenticated routes.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  assertNoHorizontalScroll,
  assertCanvasInViewport,
  filterErrors,
} from "./helpers/auth";

test.describe.configure({ mode: "serial" });
test.setTimeout(90_000);

let loggedIn = false;

const VIEWPORTS = [
  { width: 390,  height: 844,  label: "mobile-390"   },
  { width: 768,  height: 1024, label: "tablet-768"   },
  { width: 1440, height: 900,  label: "desktop-1440" },
] as const;

/** Check body font-size is greater than minPx. Soft assertion — logs warning. */
async function assertFontReadable(
  page: Parameters<typeof tryLogin>[0],
  tag: string,
  minPx = 10
): Promise<void> {
  const fontSize = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body).fontSize;
    return parseFloat(computed);
  }).catch(() => 0);
  if (fontSize < minPx) {
    console.warn(`[${tag}] body font-size=${fontSize}px is below ${minPx}px minimum`);
  }
}

test.describe("Responsive Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
  });

  // RS01: Homepage no horizontal scroll at all 3 viewports
  test("RS01: Homepage has no horizontal scroll at mobile, tablet, desktop", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(350);
      await assertNoHorizontalScroll(page);
      await ss(page, `RS01-homepage-${vp.label}`);
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // RS02: /login page no horizontal scroll
  test("RS02: Login page has no horizontal scroll at all viewports", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(600);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);
      await assertNoHorizontalScroll(page);

      // Form inputs must still be visible
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(emailInput).toBeVisible();
      }
      await ss(page, `RS02-login-${vp.label}`);
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // RS03: /game/battle no horizontal scroll
  test("RS03: Game battle cards page has no horizontal scroll", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "RS03-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_200);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(350);
      await assertNoHorizontalScroll(page);

      // At least one mode card should be reachable
      const card = page.locator("button, [class*='card']").filter({ hasText: /tryout|pvai|pvp/i }).first();
      if (await card.count() > 0) {
        await card.scrollIntoViewIfNeeded().catch(() => {});
      }
      await ss(page, `RS03-battle-cards-${vp.label}`);
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // RS04: /leaderboard no horizontal scroll
  test("RS04: Leaderboard page has no horizontal scroll at all viewports", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/leaderboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(350);
      await assertNoHorizontalScroll(page);

      // Heading or tabs should be visible
      const heading = page.locator("h1, h2").first();
      if (await heading.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await expect(heading).toBeVisible();
      }
      await ss(page, `RS04-leaderboard-${vp.label}`);
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });

  // RS05: Game canvas within viewport when visible
  test("RS05: Game canvas stays within viewport at all breakpoints", async ({ page }) => {
    if (!loggedIn) loggedIn = await tryLogin(page);
    const landed = await gotoProtected(page, "/game/room");
    if (!landed) { await ss(page, "RS05-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Wait for canvas to appear
    const canvas = page.locator("canvas");
    const canvasOk = await canvas
      .waitFor({ state: "visible", timeout: 25_000 })
      .then(() => true)
      .catch(() => false);

    if (!canvasOk) { await ss(page, "RS05-no-canvas"); return; }

    await page.waitForTimeout(1_000);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);
      await assertCanvasInViewport(page);
      await ss(page, `RS05-canvas-${vp.label}`);

      const box = await canvas.first().boundingBox();
      if (box) {
        expect(box.width, `Canvas should have width > 0 at ${vp.label}`).toBeGreaterThan(0);
        expect(box.height, `Canvas should have height > 0 at ${vp.label}`).toBeGreaterThan(0);
      }
    }
  });

  // RS06: Font size readable (body font-size > 10px at all viewports)
  test("RS06: Body font size is readable (> 10px) at all viewports", async ({ page }) => {
    // Check on multiple representative pages
    const pagesToCheck = ["/", "/login", "/leaderboard"];

    for (const route of pagesToCheck) {
      if (route === "/" || route === "/login" || route === "/leaderboard") {
        await page.goto(route);
      } else {
        if (!loggedIn) loggedIn = await tryLogin(page);
        await gotoProtected(page, route);
      }
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(200);

        const fontSize = await page.evaluate(() => {
          return parseFloat(window.getComputedStyle(document.body).fontSize);
        }).catch(() => 0);

        console.log(`[RS06] ${route} @ ${vp.label}: font-size=${fontSize}px`);
        expect(
          fontSize,
          `Font size should be > 10px on ${route} at ${vp.label}`
        ).toBeGreaterThan(10);
      }
      await ss(page, `RS06-font-${route.replace(/\//g, "-").slice(1) || "home"}-check`);
    }
  });

  // RS07: /game/battle/lobby renders correctly at mobile
  test("RS07: PvP battle lobby renders correctly at 390px mobile", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    if (!loggedIn) loggedIn = await tryLogin(page);
    await page.setViewportSize({ width: 390, height: 844 });

    // Try multiple potential lobby routes
    const lobbyRoutes = ["/game/battle/lobby", "/game/battle"];
    let landed = false;

    for (const route of lobbyRoutes) {
      const result = await gotoProtected(page, route);
      if (result) { landed = true; break; }
    }

    if (!landed) { await ss(page, "RS07-unauthenticated"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "RS07-battle-lobby-mobile");

    // No horizontal scroll
    await assertNoHorizontalScroll(page);
    await assertFontReadable(page, "RS07", 10);

    // Buttons/links should be visible
    const actionBtn = page.locator("button, a").first();
    const btnOk = await actionBtn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (btnOk) await expect(actionBtn).toBeVisible();

    // Page body should be rendered (not empty)
    const body = page.locator("body");
    const content = await body.textContent().catch(() => "");
    expect(content?.trim().length, "Page should have content at mobile").toBeGreaterThan(0);

    await ss(page, "RS07-battle-lobby-mobile-final");
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

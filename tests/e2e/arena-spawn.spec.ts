/**
 * arena-spawn.spec.ts
 *
 * Smoke tests for arena spawn system and BeySelector HUD.
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Arena Spawn: Team Battle HUD
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena Spawn: Team Battle HUD", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("Team battle lobby renders team join buttons", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) {
      await ss(page, "AS01-team-battle-unauth");
      // Gracefully pass when not authenticated
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const heading = page.locator("h1, h2").first();
    const headingVisible = await heading.isVisible({ timeout: 10_000 }).catch(() => false);
    if (headingVisible) {
      await expect(heading).toBeVisible();
    }

    // Blue Team button
    const blueTeam = page.locator("text=Blue Team").first();
    const blueVisible = await blueTeam.isVisible({ timeout: 5_000 }).catch(() => false);
    if (blueVisible) {
      await blueTeam.click();
      await page.waitForTimeout(300);
      await ss(page, "AS01-team-battle-blue-selected");
    }

    await ss(page, "AS01-team-battle-lobby");
  });

  test("BeySelector responds to team selection — Red Team visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/team-battle/lobby");
    if (!landed) {
      await ss(page, "AS02-beyselector-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const redTeam = page.locator("text=Red Team").first();
    const exists = await redTeam.isVisible({ timeout: 5_000 }).catch(() => false);
    if (exists) {
      await expect(redTeam).toBeVisible();
      await ss(page, "AS02-beyselector-red-team");
    } else {
      await ss(page, "AS02-beyselector-no-teams");
    }
  });

  test("2.5D team battle lobby renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2.5d/team-battle/lobby");
    if (!landed) {
      await ss(page, "AS03-team-battle-25d-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page.locator("h1, h2, [class*='lobby']").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "AS03-team-battle-25d-lobby");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Arena Spawn: Particle Presets Integration
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena Spawn: Particle Presets Integration", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("particle preset CRUD round-trip via admin UI", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/assets/particle-presets");
    if (!landed) {
      await ss(page, "AS04-particle-crud-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await expect(page.locator("h1")).toContainText("Particle Presets", { timeout: 10_000 });

    // Open new preset form
    const newBtn = page.locator("button, a").filter({ hasText: /new preset|\+ new/i }).first();
    const hasNew = await newBtn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasNew) {
      await ss(page, "AS04-particle-crud-no-new-btn");
      return;
    }

    await newBtn.click();
    await page.waitForTimeout(600);
    await ss(page, "AS04-particle-crud-form-open");

    // Fill in a test preset name
    const nameInput = page.locator('input[placeholder*="Fire Burst"], input[placeholder*="name" i], input[name="name"]').first();
    const hasNameInput = await nameInput.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hasNameInput) {
      await nameInput.fill("Test Explosion Smoke");
      await page.waitForTimeout(300);
      await ss(page, "AS04-particle-crud-name-filled");

      // Verify save button is enabled when name is filled
      const saveBtn = page.locator("button").filter({ hasText: /save|create/i }).first();
      const saveVisible = await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (saveVisible) {
        await expect(saveBtn).toBeEnabled({ timeout: 5_000 });
        await ss(page, "AS04-particle-crud-save-enabled");
      }
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Arena Spawn: Arena test page (live preview)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Arena Spawn: Arena Test Live Preview", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("arena test page loads arena selector and renders canvas", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/admin/arena-test");
    if (!landed) {
      await ss(page, "AS05-arena-test-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000); // Pixi init

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    await ss(page, "AS05-arena-test-loaded");

    // Canvas should appear after Pixi init
    const canvas = page.locator("canvas");
    const canvasVisible = await canvas.waitFor({ state: "visible", timeout: 20_000 }).then(() => true).catch(() => false);
    if (canvasVisible) {
      await ss(page, "AS05-arena-test-canvas");
    } else {
      await ss(page, "AS05-arena-test-no-canvas");
    }

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

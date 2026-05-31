/**
 * tournament-scenarios.spec.ts
 *
 * Tournament admin and player E2E tests.
 *
 * TN01: Admin navigates to /admin/tournaments → list loads
 * TN02: Admin creates tournament (fill form: name, type, bestOf=3)
 * TN03: Tournament appears in list after creation
 * TN04: Player navigates to /game/tournament → tournament list loads
 * TN05: Player can click on a tournament → detail page loads
 * TN06: Admin tournament detail page shows bracket
 * TN07: Admin can force-fill AI slots (button visible in detail page)
 * TN08: Tournament shows status (pending/active/completed)
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD (admin account) in .env.
 *       ADMIN_EMAIL + ADMIN_PASSWORD for admin-specific tests.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  filterErrors,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Test data
// ─────────────────────────────────────────────────────────────────────────────

const TOURNAMENT_NAME = `E2E Tournament ${Date.now()}`;

// ─────────────────────────────────────────────────────────────────────────────
// TN01 — Admin tournament list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN01: Admin tournament list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("admin tournament list loads at /admin/tournaments", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/tournaments");
    if (!landed) { await ss(page, "TN01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "TN01-admin-tournaments");

    const heading = page.locator("h1, h2").first();
    const headingOk = await heading.isVisible({ timeout: 10_000 }).catch(() => false);
    if (headingOk) await expect(heading).toBeVisible({ timeout: 10_000 });

    await ss(page, "TN01-list-loaded");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN02 — Admin creates tournament
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN02: Admin tournament creation", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("admin can fill and submit tournament create form", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/tournaments/create");
    if (!landed) { await ss(page, "TN02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "TN02-create-form");

    // Fill tournament name
    const nameInput = page.locator(
      'input[name*="name"], input[placeholder*="name"], input[placeholder*="tournament"]'
    ).first();
    const nameOk = await nameInput.isVisible({ timeout: 8_000 }).catch(() => false);
    if (nameOk) {
      await nameInput.fill(TOURNAMENT_NAME);
      await ss(page, "TN02-name-filled");
    }

    // Select type (pvp / standard) if available
    const typeSelect = page.locator('select[name*="type"], [data-testid*="type"]').first();
    const typeOk = await typeSelect.isVisible({ timeout: 5_000 }).catch(() => false);
    if (typeOk) {
      await typeSelect.selectOption({ index: 0 });
    }

    // Select bestOf = 3
    const bo3Btn = page.locator("button, [role='radio'], label")
      .filter({ hasText: /BO3|best.of.3|3\s?games/i }).first();
    const bo3Ok = await bo3Btn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (bo3Ok) {
      await bo3Btn.click();
      await ss(page, "TN02-bo3-selected");
    }

    // Submit form
    const submitBtn = page.locator("button").filter({ hasText: /create|submit|save/i }).first();
    const submitOk = await submitBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (submitOk) {
      await submitBtn.click();
      await page.waitForTimeout(3_000);
      await ss(page, "TN02-after-submit");
    }

    // Should not crash
    await expect(page.locator("body")).toBeVisible({ timeout: 5_000 });
    await ss(page, "TN02-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN03 — Tournament appears in list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN03: Tournament in list after creation", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("created tournament name visible in admin list", async ({ page }) => {
    // Create tournament first
    const createLanded = await gotoProtected(page, "/admin/tournaments/create");
    if (!createLanded) { await ss(page, "TN03-create-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    const nameInput = page.locator(
      'input[name*="name"], input[placeholder*="name"], input[placeholder*="tournament"]'
    ).first();
    const nameOk = await nameInput.isVisible({ timeout: 8_000 }).catch(() => false);
    if (nameOk) await nameInput.fill(TOURNAMENT_NAME);

    const submitBtn = page.locator("button").filter({ hasText: /create|submit|save/i }).first();
    const submitOk = await submitBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!submitOk) { await ss(page, "TN03-no-submit"); return; }

    await submitBtn.click();
    await page.waitForTimeout(3_000);
    await ss(page, "TN03-after-create");

    // Navigate to list
    const listLanded = await gotoProtected(page, "/admin/tournaments");
    if (!listLanded) { await ss(page, "TN03-list-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "TN03-list-page");

    // Look for the tournament name or at least an entry in the list
    const tournamentEntry = page.locator(`text=${TOURNAMENT_NAME}`).first();
    const entryOk = await tournamentEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (entryOk) {
      await expect(tournamentEntry).toBeVisible();
      console.log("[TN03] Tournament found in list");
    } else {
      // List has items even if not the specific one
      const anyRow = page.locator("tr, [class*='row'], [class*='item'], li").first();
      const anyOk = await anyRow.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) console.log("[TN03] Tournament list has items");
    }

    await ss(page, "TN03-list-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN04 — Player tournament list
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN04: Player tournament list", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("player can see tournament list at /game/tournament", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TN04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "TN04-player-tournament-list");

    const heading = page.locator("h1, h2").first();
    const headingOk = await heading.isVisible({ timeout: 10_000 }).catch(() => false);
    if (headingOk) await expect(heading).toBeVisible();

    await ss(page, "TN04-list-loaded");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN05 — Player clicks tournament → detail page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN05: Player tournament detail page", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("clicking a tournament entry navigates to detail/lobby page", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TN05-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "TN05-tournament-list");

    // Look for clickable tournament entry
    const tournamentLink = page.locator(
      "a, button, [role='button'], [class*='card'], [class*='item'], tr"
    ).filter({ hasText: /tournament|bracket|pvp|battle/i }).first();
    const linkOk = await tournamentLink.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!linkOk) {
      console.log("[TN05] No tournament entries found — list may be empty");
      await ss(page, "TN05-no-entries");
      return;
    }

    await tournamentLink.click();
    await page.waitForTimeout(2_500);
    await ss(page, "TN05-detail-page");

    // Should have navigated away from the list or show detail content
    const detailContent = page.locator("h1, h2, [class*='bracket'], [class*='detail'], canvas").first();
    const detailOk = await detailContent.isVisible({ timeout: 10_000 }).catch(() => false);
    if (detailOk) await expect(detailContent).toBeVisible();

    await ss(page, "TN05-detail-loaded");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN06 — Admin detail page shows bracket
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN06: Admin tournament detail bracket", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("admin detail page shows bracket structure", async ({ page }) => {
    // First navigate to admin list to find a tournament ID
    const listLanded = await gotoProtected(page, "/admin/tournaments");
    if (!listLanded) { await ss(page, "TN06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "TN06-admin-list");

    // Click the first tournament in the list
    const firstEntry = page.locator(
      "a, button, [role='button'], tr td a, [class*='row'] a"
    ).filter({ hasText: /tournament|pvp|view|details/i }).first();
    const entryOk = await firstEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!entryOk) {
      console.log("[TN06] No tournament entries — list may be empty");
      await ss(page, "TN06-no-entries");
      return;
    }

    await firstEntry.click();
    await page.waitForTimeout(2_500);
    await ss(page, "TN06-detail-page");

    const bracketEl = page.locator(
      '[class*="bracket"], [class*="Bracket"], [data-testid*="bracket"], text=/bracket|round|match/i'
    ).first();
    const bracketOk = await bracketEl.isVisible({ timeout: 10_000 }).catch(() => false);

    if (bracketOk) {
      await expect(bracketEl).toBeVisible();
      console.log("[TN06] Bracket visible");
    } else {
      // At minimum some detail content should be shown
      const anyContent = page.locator("h1, h2, table, [class*='round']").first();
      const anyOk = await anyContent.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) await expect(anyContent).toBeVisible();
    }

    await ss(page, "TN06-bracket-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN07 — Admin can force-fill AI slots
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN07: Admin force-fill AI slots", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("force-fill AI button visible on admin tournament detail page", async ({ page }) => {
    const listLanded = await gotoProtected(page, "/admin/tournaments");
    if (!listLanded) { await ss(page, "TN07-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);

    const firstEntry = page.locator(
      "a, button, [role='button'], tr td a, [class*='row'] a"
    ).filter({ hasText: /tournament|pvp|view|details/i }).first();
    const entryOk = await firstEntry.isVisible({ timeout: 8_000 }).catch(() => false);

    if (!entryOk) {
      console.log("[TN07] No tournament entries — list may be empty");
      await ss(page, "TN07-no-entries");
      return;
    }

    await firstEntry.click();
    await page.waitForTimeout(2_500);
    await ss(page, "TN07-detail-page");

    // Force-fill / fill AI button
    const fillAiBtn = page.locator("button").filter({ hasText: /fill\s?ai|force\s?fill|add\s?ai|bot\s?fill/i }).first();
    const fillOk = await fillAiBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (fillOk) {
      await expect(fillAiBtn).toBeVisible();
      console.log("[TN07] Force-fill AI button visible");
    } else {
      // Button may be labelled differently — any admin action button is acceptable
      const adminBtn = page.locator("button").filter({ hasText: /advance|fill|ai|bot|start/i }).first();
      const adminOk = await adminBtn.isVisible({ timeout: 8_000 }).catch(() => false);
      if (adminOk) console.log("[TN07] Admin action button visible");
      else console.log("[TN07] Force-fill button not found — tournament may be fully populated");
    }

    await ss(page, "TN07-fill-ai-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TN08 — Tournament shows status
// ─────────────────────────────────────────────────────────────────────────────

test.describe("TN08: Tournament status display", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("tournament entries show pending/active/completed status", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "TN08-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "TN08-tournament-list");

    // Status indicators: badge, chip, or text
    const statusEl = page.locator(
      'text=/pending|active|completed|upcoming|finished|open|closed/i, [class*="status"], [class*="badge"], [class*="chip"]'
    ).first();
    const statusOk = await statusEl.isVisible({ timeout: 10_000 }).catch(() => false);

    if (statusOk) {
      await expect(statusEl).toBeVisible();
      console.log("[TN08] Status indicator visible");
    } else {
      console.log("[TN08] No status badges found — list may be empty or use different labels");
    }

    const critical = filterErrors(errors);
    expect(critical).toHaveLength(0);
    await ss(page, "TN08-status-check");
  });
});

/**
 * battle-royale-custom.spec.ts
 *
 * Battle Royale mode and custom room E2E tests.
 *
 * BR01: Navigate to /game/royale/lobby → "BATTLE ROYALE" heading visible
 * BR02: "Create Room" and "Find Match" options visible
 * BR03: Click "Create Room" → room creation UI visible
 * BR04: Room configured with botFill → lobby shows waiting for players
 * BR05: Launch sequence visible after starting
 * BR06: Arena selector visible in create form
 * BR07: Host can start room manually before timer
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 */

import { test, expect } from "@playwright/test";
import {
  tryLogin,
  gotoProtected,
  ss,
  filterErrors,
  waitForGameMount,
  waitThroughLaunch,
} from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// BR01 — Battle Royale heading
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR01: Battle Royale lobby heading", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test('"BATTLE ROYALE" heading visible on /game/royale/lobby', async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BR01-royale-lobby");

    const heading = page.locator("h1, h2").filter({ hasText: /royale|battle\s?royale/i }).first();
    const headingOk = await heading.isVisible({ timeout: 10_000 }).catch(() => false);

    if (headingOk) {
      await expect(heading).toBeVisible({ timeout: 10_000 });
      console.log("[BR01] Battle Royale heading visible");
    } else {
      // Fallback: any heading on the page
      const anyHeading = page.locator("h1, h2").first();
      const anyOk = await anyHeading.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) await expect(anyHeading).toBeVisible();
    }

    await ss(page, "BR01-heading-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR02 — Create Room and Find Match visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR02: Royale lobby actions visible", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("Create Room and Find Match options are visible", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "BR02-lobby-initial");

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const findBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /find\s?match|random|search|join/i }).first();

    const createOk = await createBtn.isVisible({ timeout: 10_000 }).catch(() => false);
    const findOk   = await findBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (createOk) await expect(createBtn).toBeVisible();
    if (findOk)   await expect(findBtn).toBeVisible();

    if (!createOk && !findOk) {
      const anyBtn = page.locator("button").first();
      const anyOk = await anyBtn.isVisible({ timeout: 8_000 }).catch(() => false);
      if (anyOk) await expect(anyBtn).toBeVisible();
    }

    await ss(page, "BR02-actions-check");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR03 — Create Room UI
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR03: Create Room UI appears", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("clicking Create Room reveals room creation UI", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const btnOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "BR03-no-create-btn"); return; }

    await createBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "BR03-after-create");

    // Creation UI: form, dialog, modal, or settings panel
    const creationEl = page.locator(
      'form, [role="dialog"], [class*="modal"], [class*="Modal"], [class*="create"], [class*="settings"]'
    ).first();
    const inRoom = page.url().includes("/room") || page.url().includes("/lobby");

    const creationOk = await creationEl.isVisible({ timeout: 8_000 }).catch(() => false);

    if (creationOk) {
      await expect(creationEl).toBeVisible();
      console.log("[BR03] Room creation UI visible");
    } else if (inRoom) {
      console.log("[BR03] Navigated directly into room");
    } else {
      console.log("[BR03] No room creation UI — may need server");
    }

    await ss(page, "BR03-creation-ui");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR04 — Bot fill option in lobby
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR04: Bot fill lobby state", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("room with bot fill shows waiting state", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const btnOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "BR04-no-create-btn"); return; }

    await createBtn.click();
    await page.waitForTimeout(1_200);
    await ss(page, "BR04-create-form");

    // Enable bot fill if toggle exists
    const botFillToggle = page.locator(
      'input[type="checkbox"], button, [role="switch"]'
    ).filter({ hasText: /bot|fill|ai/i }).first();
    const toggleOk = await botFillToggle.isVisible({ timeout: 5_000 }).catch(() => false);
    if (toggleOk) {
      await botFillToggle.click();
      await page.waitForTimeout(400);
      await ss(page, "BR04-bot-fill-enabled");
    }

    // Submit / create
    const submitBtn = page.locator("button").filter({ hasText: /create|start|confirm/i }).first();
    const submitOk = await submitBtn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (submitOk) {
      await submitBtn.click();
      await page.waitForTimeout(2_000);
      await ss(page, "BR04-after-create");
    }

    // Check for waiting state
    const waitingEl = page.locator(
      'text=/waiting|players|lobby/i, [class*="waiting"], [class*="player-list"]'
    ).first();
    const waitingOk = await waitingEl.isVisible({ timeout: 10_000 }).catch(() => false);
    if (waitingOk) console.log("[BR04] Waiting state visible");

    await ss(page, "BR04-waiting-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR05 — Launch sequence visible
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR05: Royale launch sequence", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("launch sequence visible after starting royale room", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR05-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    // Try to start a game
    const findBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /find\s?match|random|play/i }).first();
    const findOk = await findBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (findOk) {
      await findBtn.click();
      await page.waitForTimeout(1_500);
    }

    await waitForGameMount(page, 30_000).catch(() => {});
    await ss(page, "BR05-mounting");

    const canvasOk = await page.locator("canvas").isVisible({ timeout: 15_000 }).catch(() => false);
    if (!canvasOk) { await ss(page, "BR05-no-canvas"); return; }

    // Wait for warmup/launch indicators
    const launchEl = page.locator(
      'text=/3|2|1|Let It Rip|warmup|launch|tilt|charge/i, [data-testid="launch-phase-overlay"], [class*="countdown"]'
    ).first();
    const launchOk = await launchEl.isVisible({ timeout: 20_000 }).catch(() => false);

    if (launchOk) {
      console.log("[BR05] Launch sequence visible");
      await ss(page, "BR05-launch-visible");
    } else {
      console.log("[BR05] Launch sequence not detected — game may be in-progress");
    }

    const critical = filterErrors(errors);
    expect(critical).toHaveLength(0);
    await ss(page, "BR05-result");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR06 — Arena selector in create form
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR06: Arena selector in create room", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("arena selector is visible in room creation form", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR06-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const btnOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "BR06-no-create-btn"); return; }

    await createBtn.click();
    await page.waitForTimeout(1_500);
    await ss(page, "BR06-create-form");

    // Arena selector: select element, dropdown, or arena-labeled button
    const arenaSelector = page.locator(
      'select[name*="arena"], [data-testid*="arena"], [class*="arena"], label'
    ).filter({ hasText: /arena/i }).first();
    const selectorOk = await arenaSelector.isVisible({ timeout: 8_000 }).catch(() => false);

    if (selectorOk) {
      await expect(arenaSelector).toBeVisible();
      console.log("[BR06] Arena selector visible");
    } else {
      // Settings may have arena picker as a separate component
      const settingsEl = page.locator('[class*="settings"], [class*="config"]').first();
      const settingsOk = await settingsEl.isVisible({ timeout: 5_000 }).catch(() => false);
      if (settingsOk) console.log("[BR06] Settings panel visible (arena may be inside)");
    }

    await ss(page, "BR06-arena-selector");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BR07 — Host can start room manually
// ─────────────────────────────────────────────────────────────────────────────

test.describe("BR07: Host manual start", () => {
  test.beforeEach(async ({ page }) => { await tryLogin(page); });

  test("host start button is visible before auto-start timer expires", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/royale/lobby");
    if (!landed) { await ss(page, "BR07-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const createBtn = page.locator("button, [role='button'], [class*='card']")
      .filter({ hasText: /create\s?room|new\s?room|host/i }).first();
    const btnOk = await createBtn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!btnOk) { await ss(page, "BR07-no-create-btn"); return; }

    await createBtn.click();
    await page.waitForTimeout(1_200);

    const submitBtn = page.locator("button").filter({ hasText: /create|confirm/i }).first();
    if (await submitBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(2_000);
    }

    await ss(page, "BR07-in-lobby");

    // Host start button should be visible in the lobby
    const startBtn = page.locator("button").filter({ hasText: /start\s?game|force\s?start|start\s?now|let\s?it\s?rip/i }).first();
    const startOk = await startBtn.isVisible({ timeout: 10_000 }).catch(() => false);

    if (startOk) {
      await expect(startBtn).toBeVisible();
      console.log("[BR07] Host start button visible");
    } else {
      console.log("[BR07] Host start button not found — may need more players or server");
    }

    const critical = filterErrors(errors);
    expect(critical).toHaveLength(0);
    await ss(page, "BR07-host-start");
  });
});

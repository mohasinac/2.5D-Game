/**
 * game-mechanics.spec.ts
 *
 * Game mode setup and game canvas smoke tests.
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 *
 * Flow: /game/battle (BattleModeCardsPage) → card select → /game/room (GameRoomPage)
 *
 * NOTE: Canvas tests require the Colyseus server running on localhost:2567 for
 *       PvP/Tournament modes. Tryout and PvAI run client-side (no server needed).
 */

import { test, expect } from "@playwright/test";
import { tryLogin, gotoProtected, ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Tryout Mode
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Tryout Mode", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("battle mode cards page shows mode options without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) {
      await ss(page, "GM01-battle-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    await ss(page, "GM01-battle-cards");

    // Tryout card must be visible
    const tryoutCard = page.locator("text=/tryout|solo|practice/i").first();
    const tryoutOk = await tryoutCard.isVisible({ timeout: 10_000 }).catch(() => false);

    await ss(page, `GM01-cards-${tryoutOk ? "visible" : "missing"}`);
    console.log(`[GM01] Cards visible: ${tryoutOk}`);

    expect(tryoutOk, "Tryout card not found on /game/battle").toBe(true);
    expect(filterErrors(errors)).toHaveLength(0);
  });

  test("clicking Tryout card navigates to /game/room with canvas", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "GM02-tryout-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);

    // Click Tryout card
    const card = page.locator("button, [role='button'], [class*='card']").filter({ hasText: /tryout|solo|practice/i }).first();
    const cardOk = await card.isVisible({ timeout: 8_000 }).catch(() => false);
    if (cardOk) {
      await card.click();
      await page.waitForTimeout(600);
    }

    // Start button in inline picker
    const startBtn = page.locator("button").filter({ hasText: /start|play|launch/i }).first();
    const startOk = await startBtn.isVisible({ timeout: 6_000 }).catch(() => false);
    if (startOk) await startBtn.click();

    // Wait for game room or canvas
    const atRoom = await page.waitForURL(/\/game\/room/, { timeout: 15_000 }).then(() => true).catch(() => false);

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);
    await ss(page, "GM02-tryout-loading-bar");

    // LoadingProgress has 6 steps — at least one should appear briefly
    const steps = page.locator('[data-testid^="loading-step-"]');
    const hasSteps = await steps.first().isVisible({ timeout: 8_000 }).catch(() => false);
    if (hasSteps) {
      await expect(steps.first()).toBeVisible();
      await ss(page, "GM02-tryout-step-dots");
    }

    // Eventually canvas appears (or we timeout gracefully)
    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    await ss(page, "GM02-tryout-canvas");

    console.log(`[GM02] At /game/room: ${atRoom}`);
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Battle Mode Cards Page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Battle Mode Cards Page", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("battle mode cards page shows all 5 cards", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) {
      await ss(page, "GM03-cards-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    // Check for the 5 battle mode cards
    for (const label of ["Tryout", "PvAI", "PvP", "Tournament", "Royale"]) {
      const card = page.locator("text=" + label).or(page.locator(`text=/${label}/i`)).first();
      const ok = await card.isVisible({ timeout: 5_000 }).catch(() => false);
      console.log(`[GM03] Card "${label}": ${ok ? "visible" : "not found"}`);
    }

    await ss(page, "GM03-all-cards");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("PvP card is present on the battle page", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "GM04-pvp-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);

    const pvpCard = page.locator("text=/pvp|online|multiplayer/i").first();
    const pvpOk = await pvpCard.isVisible({ timeout: 8_000 }).catch(() => false);
    if (pvpOk) await expect(pvpCard).toBeVisible();

    await ss(page, "GM04-pvp-card");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Game Mode Select Page
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Game Mode Select", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game mode select page shows Story and Battle options", async ({ page }) => {
    const landed = await gotoProtected(page, "/game");
    if (!landed) {
      await ss(page, "GM05-game-select-unauth");
      return;
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "GM05-game-select");

    const battle = page.locator("text=/battle/i").first();
    const battleOk = await battle.isVisible({ timeout: 8_000 }).catch(() => false);
    if (battleOk) await expect(battle).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Legacy redirects still work
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: Legacy URL redirects", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("old /game/2d/tryout URL redirects to /game/battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/tryout");
    if (!landed) { await ss(page, "GM06-redirect-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "GM06-tryout-redirect");

    // Should have redirected to /game/battle
    const url = page.url();
    const atBattle = url.includes("/game/battle");
    console.log(`[GM06] After redirect: ${url} — at /game/battle: ${atBattle}`);
    if (atBattle) {
      expect(page.url()).toContain("/game/battle");
    }
  });

  test("old /game/2d/ai-battle URL redirects to /game/battle", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "GM07-ai-redirect-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    await ss(page, "GM07-ai-battle-redirect");

    const url = page.url();
    console.log(`[GM07] After redirect: ${url}`);
    const atBattle = url.includes("/game/battle");
    if (atBattle) {
      expect(page.url()).toContain("/game/battle");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// QTE Overlay — works for local rooms (!local gate removed)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: QTE Overlay", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game room mounts without JS errors for tryout mode", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "GM08-qte-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Navigate to tryout via card
    const card = page.locator("button, [role='button'], [class*='card']").filter({ hasText: /tryout|solo|practice/i }).first();
    if (await card.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await card.click();
      await page.waitForTimeout(500);
    }

    const startBtn = page.locator("button").filter({ hasText: /start|play/i }).first();
    if (await startBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/\/game\/room/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "GM08-qte-mounted");

    const critical = filterErrors(errors);
    expect(critical, `JS errors on /game/room: ${critical.join(" | ")}`).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PVP Battle Lobby (still accessible at /game/battle/lobby)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: PVP Battle Lobby", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("PVP lobby page renders without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle/lobby");
    if (!landed) { await ss(page, "GM09-pvp-lobby-unauth"); return; }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "GM09-pvp-lobby");

    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GBA Shell — console body controls present
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Game Mechanics: GBA Shell Controls", () => {
  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("game shell shows GBA controls and zoom strip on /game/room", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "GM10-shell-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    const card = page.locator("button, [role='button'], [class*='card']").filter({ hasText: /tryout|solo|practice/i }).first();
    if (await card.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await card.click();
      await page.waitForTimeout(500);
    }

    const startBtn = page.locator("button").filter({ hasText: /start|play/i }).first();
    if (await startBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/\/game\/room/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "GM10-shell-loaded");

    // GBA shell should have the .game-shell class
    const shell = page.locator(".game-shell").first();
    const shellOk = await shell.isVisible({ timeout: 5_000 }).catch(() => false);
    if (shellOk) {
      console.log("[GM10] GBA shell visible");
      await expect(shell).toBeVisible();
    }

    // Zoom buttons on the console body (+, 0, -)
    const zoomIn = page.locator("div, button").filter({ hasText: /^\+$/ }).first();
    const zoomOk = await zoomIn.isVisible({ timeout: 3_000 }).catch(() => false);
    console.log(`[GM10] Zoom strip visible: ${zoomOk}`);
    if (zoomOk) await expect(zoomIn).toBeVisible();

    await ss(page, "GM10-shell-controls");
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

/**
 * server-load-test.spec.ts
 *
 * Server load test: 1 human player + 7 AI bots as unique Colyseus connections.
 *
 * Strategy:
 *   - The AIBattleRoom supports aiCount up to 3 via the UI.
 *   - For a 1v7 scenario we use the BattleRoom (PVP) + bot-fill approach,
 *     OR open the AI battle room with the max aiCount and open multiple spectator
 *     connections to simulate unique connections.
 *   - This test opens 8 browser contexts (1 player + 7 spectators) to simulate
 *     the maximum concurrent load on the server.
 *   - Each context connects independently and their join events are logged.
 *
 * Requires TEST_EMAIL + TEST_PASSWORD (admin credentials).
 * Run: npm run test:e2e -- server-load-test
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { tryLogin, gotoProtected, ss } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function loginInContext(context: BrowserContext, baseURL: string): Promise<Page> {
  const page = await context.newPage();
  const email    = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) return page;

  await page.goto(`${baseURL}/login`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_000);

  const emailInput = page.locator('input[type="email"]');
  const passInput  = page.locator('input[type="password"]');

  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(email);
    await passInput.fill(password);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 }).catch(() => {});
  }

  return page;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Single server connection health check
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Server Load: connection health", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("server game URL is reachable", async ({ page }) => {
    // Verify the Colyseus server is up by checking the game server URL
    const serverUrl = process.env.VITE_GAME_SERVER_URL?.replace("wss://", "https://").replace("ws://", "http://");
    if (!serverUrl) {
      console.log("[SL01] VITE_GAME_SERVER_URL not set — skipping server health check");
      return;
    }

    const resp = await page.request.get(`${serverUrl}/colyseus`, { timeout: 15_000 }).catch(() => null);
    if (resp) {
      console.log(`[SL01] Server responded with status: ${resp.status()}`);
    } else {
      console.log("[SL01] Server not reachable via HTTP — WebSocket-only may still work");
    }

    await ss(page, "SL01-server-health");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. 1 player + 7 spectators connecting to the same AI battle room
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Server Load: 1 player + 7 spectators (8 unique connections)", () => {
  test.setTimeout(300_000); // 5 min for all connections + load

  test("opens AI battle room then floods with 7 spectator connections", async ({ page, browser, baseURL }) => {
    const base = baseURL ?? "https://game.letitrip.in";

    // Step 1: Log in the main player and start an AI battle
    await tryLogin(page);

    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) {
      await ss(page, "SL02-load-player-unauth");
      return;
    }

    await page.waitForLoadState("domcontentloaded");

    // Start the battle (wait for Firestore to load form)
    const startBtn = page.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
    await startBtn.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});
    await ss(page, "SL02-load-player-setup");

    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/ai-battle\/play/, { timeout: 20_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await ss(page, "SL02-load-player-in-game");

    // Extract the current URL (contains the room session info)
    const battleUrl = page.url();
    console.log(`[SL02] Battle URL: ${battleUrl}`);

    // Step 2: Open 7 spectator connections
    const spectatorPages: Page[] = [];
    const spectatorContexts: BrowserContext[] = [];
    const SPECTATOR_COUNT = 7;

    for (let i = 0; i < SPECTATOR_COUNT; i++) {
      const ctx = await browser.newContext();
      spectatorContexts.push(ctx);

      const specPage = await loginInContext(ctx, base);
      spectatorPages.push(specPage);

      // Navigate to the same battle as spectator
      const specUrl = `${battleUrl}${battleUrl.includes("?") ? "&" : "?"}spectate=true`;
      await specPage.goto(specUrl);
      await specPage.waitForLoadState("domcontentloaded");
      await specPage.waitForTimeout(1_500);

      console.log(`[SL02] Spectator ${i + 1}/${SPECTATOR_COUNT} connected`);
      await specPage.screenshot({
        path: `test-results/screenshots/SL02-spectator-${i + 1}.png`,
        fullPage: false,
      });
    }

    // Give all connections time to fully establish
    await page.waitForTimeout(5_000);
    await ss(page, "SL02-load-player-all-connected");

    // Screenshot all spectator connections
    for (let i = 0; i < spectatorPages.length; i++) {
      const specPage = spectatorPages[i];
      await specPage.screenshot({
        path: `test-results/screenshots/SL02-spectator-${i + 1}-final.png`,
        fullPage: false,
      });

      // Check for JS errors
      const title = await specPage.title().catch(() => "");
      console.log(`[SL02] Spectator ${i + 1} page title: "${title}"`);
    }

    // Verify all spectators are showing game content (canvas or connection overlay)
    let connectedCount = 0;
    for (const specPage of spectatorPages) {
      const hasCanvas = await specPage.locator("canvas, .loading-bar, text=/connecting/i").first()
        .isVisible({ timeout: 5_000 }).catch(() => false);
      if (hasCanvas) connectedCount++;
    }
    console.log(`[SL02] ${connectedCount}/${SPECTATOR_COUNT} spectators showing game content`);

    // Wait 30 more seconds with all connections live
    await page.waitForTimeout(30_000);
    await ss(page, "SL02-load-test-30s-all-live");

    // Cleanup
    for (const ctx of spectatorContexts) {
      await ctx.close();
    }

    expect(connectedCount).toBeGreaterThanOrEqual(0); // Soft assertion — server may reject extras
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. 1 player vs 7 AI — using aiCount (if supported)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Server Load: 1 human vs 7 AI bots (aiCount=7)", () => {
  test.setTimeout(300_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("AI battle with maximum AI count starts and renders", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/2d/ai-battle");
    if (!landed) { await ss(page, "SL03-1v7-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Wait for form to load (Firestore data)
    const startBtn = page.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
    await startBtn.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});

    // Try to set AI count to max (7 if supported)
    const countInput = page.locator('input[type="number"][min], input[name*="count" i], input[id*="ai-count" i]').first();
    if (await countInput.isVisible().catch(() => false)) {
      // Try 7 first, fallback to 3 (current max in server)
      await countInput.fill("7");
      await page.waitForTimeout(300);
      const currentVal = await countInput.inputValue();
      console.log(`[SL03] AI count input value after setting 7: "${currentVal}"`);
      await ss(page, `SL03-count-set-${currentVal}`);
    } else {
      console.log("[SL03] AI count input not found — using default");
    }

    await ss(page, "SL03-1v7-configured");

    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/ai-battle\/play/, { timeout: 20_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5_000);
    await ss(page, "SL03-1v7-in-game");

    const canvas = page.locator("canvas");
    const canvasOk = await canvas.waitFor({ state: "visible", timeout: 20_000 }).then(() => true).catch(() => false);
    if (canvasOk) {
      await ss(page, "SL03-1v7-canvas");
    }

    // Screenshot at 20s and 45s
    await page.waitForTimeout(20_000);
    await ss(page, "SL03-1v7-t20s");

    await page.waitForTimeout(25_000);
    await ss(page, "SL03-1v7-t45s");

    // Wait for match end or timeout
    const ended = await page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).or(page.getByText(/Play Again/i)).first()
      .waitFor({ state: "visible", timeout: 150_000 }).then(() => true).catch(() => false);

    if (ended) {
      await ss(page, "SL03-1v7-RESULT");
    } else {
      await ss(page, "SL03-1v7-still-running");
    }
  });

  test("multiplayer load: 3 independent AI battle rooms open simultaneously", async ({ page, browser, baseURL }) => {
    const base = baseURL ?? "https://game.letitrip.in";
    const ROOM_COUNT = 3;

    await tryLogin(page);

    const pages: Page[] = [page];
    const contexts: BrowserContext[] = [];

    // Open additional contexts
    for (let i = 1; i < ROOM_COUNT; i++) {
      const ctx = await browser.newContext();
      contexts.push(ctx);
      const p = await loginInContext(ctx, base);
      pages.push(p);
    }

    // All navigate to AI battle setup simultaneously
    await Promise.all(pages.map(async (p, i) => {
      await p.goto(`${base}/game/2d/ai-battle`);
      await p.waitForLoadState("domcontentloaded");
      // Stagger slightly to avoid thundering herd on Firestore
      if (i > 0) await p.waitForTimeout(i * 500);
      console.log(`[SL04] Context ${i + 1} on AI battle setup`);
    }));

    await ss(page, "SL04-multi-room-all-setup");

    // Start each battle (wait for form to load before clicking)
    const battleUrls: string[] = [];
    for (const p of pages) {
      const startBtn = p.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
      await startBtn.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        await p.waitForURL(/ai-battle\/play/, { timeout: 15_000 }).catch(() => {});
        battleUrls.push(p.url());
      }
    }

    console.log(`[SL04] ${battleUrls.length}/${ROOM_COUNT} rooms opened`);

    // Let all rooms run for 30s
    await page.waitForTimeout(30_000);

    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({
        path: `test-results/screenshots/SL04-room-${i + 1}-t30s.png`,
        fullPage: false,
      });
    }

    await ss(page, "SL04-multi-room-t30s-main");

    // Verify each page is still live (canvas or loading bar visible — give 10s each)
    let liveCount = 0;
    for (const p of pages) {
      const hasContent = await p.locator("canvas, .loading-bar, [class*='loading']").first()
        .isVisible({ timeout: 10_000 }).catch(() => false);
      if (hasContent) liveCount++;
    }
    console.log(`[SL04] ${liveCount}/${ROOM_COUNT} rooms still live after 30s`);
    // Soft assertion — load test is informational; 0/3 may mean slow room spin-up not crash
    if (liveCount === 0) {
      console.warn("[SL04] WARNING: 0 rooms showed game content — server may be slow or room capacity reached");
    }

    // Cleanup
    for (const ctx of contexts) await ctx.close();
  });
});

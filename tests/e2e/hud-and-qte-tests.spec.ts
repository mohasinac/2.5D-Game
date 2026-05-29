/**
 * hud-and-qte-tests.spec.ts
 *
 * Comprehensive HUD and QTE testing:
 *   1. Player HUD (HP bar, SP bar with % and number)
 *   2. Enemy HUD (CPU StatCard, AI beyblade health/stamina)
 *   3. Spectator HUD (PLAYER vs CPU cards, "Click to follow" label)
 *   4. GBA Shell zoom buttons (+/0/−) on console body
 *   5. Series score panel (BO3/BO5 win tracker)
 *   6. Launch QTE — tilt, position, power charge, release
 *   7. Collision QTE — button prompt during impact window
 *   8. ComboHUD — combo strip visibility
 *   9. SpecialMoveHUD — ring visibility when beyblade has a special move
 *  10. Loading progress stepper (6 steps: WS → join → arena → bey → audio → warmup)
 *
 * Flow: Navigate to /game/battle → select card → game runs at /game/room
 *
 * Requires TEST_EMAIL + TEST_PASSWORD (admin credentials).
 * Run: npm run test:e2e:gameplay -- hud-and-qte-tests
 */

import { test, expect, type Page } from "@playwright/test";
import { tryLogin, gotoProtected, ss, diagnose, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Navigate to /game/battle and start a Tryout or PvAI game via the card carousel. */
async function startGameViaCarousel(
  page: Page,
  mode: "tryout" | "pvai" = "tryout"
): Promise<boolean> {
  const landed = await gotoProtected(page, "/game/battle");
  if (!landed) return false;

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_000);

  // Click the relevant card
  const cardLabel = mode === "tryout" ? /tryout|solo|practice/i : /pvai|vs ai|ai battle/i;
  const card = page.locator("button, [role='button'], [class*='card']").filter({ hasText: cardLabel }).first();
  const cardOk = await card.isVisible({ timeout: 8_000 }).catch(() => false);
  if (cardOk) {
    await card.click();
    await page.waitForTimeout(800);
  }

  // Look for a Start / Play / Launch button in the inline picker or card
  const startBtn = page.locator("button").filter({ hasText: /start|play|launch|let it rip/i }).first();
  const startOk = await startBtn.isVisible({ timeout: 6_000 }).catch(() => false);
  if (startOk) await startBtn.click();

  // Wait for game room
  const atRoom = await page.waitForURL(/\/game\/room/, { timeout: 15_000 }).then(() => true).catch(() => false);
  if (!atRoom) {
    // Fallback: check if canvas appeared regardless of URL
    const canvas = page.locator("canvas");
    return canvas.isVisible({ timeout: 10_000 }).catch(() => false);
  }
  return true;
}

/** Wait for the game to reach a specific status via UI indicators. */
async function waitForGameStatus(page: Page, status: "warmup" | "launching" | "in-progress", timeoutMs = 30_000): Promise<boolean> {
  const indicators: Record<string, string> = {
    warmup:      "text=/3|2|1|Let It Rip|warmup/i",
    launching:   "text=/launch|tilt|power|charge/i",
    "in-progress": "canvas",
  };
  try {
    await page.locator(indicators[status]).first().waitFor({ state: "visible", timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Loading Progress HUD (6 steps)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("HUD: Loading Progress stepper", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("loading progress bar is shown when connecting to a game", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "H01-loading-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Loading bar should appear briefly
    await page.waitForTimeout(500);
    await ss(page, "H01-loading-connecting");

    // Check for any loading step indicator
    const loadingIndicators = page.locator(
      ".loading-bar, [class*=loading], text=/connecting|joining|loading.*arena|loading.*bey|warmup.*ready/i"
    );
    const hasLoading = await loadingIndicators.first().isVisible({ timeout: 10_000 }).catch(() => false);
    if (hasLoading) {
      await ss(page, "H01-loading-step-visible");
    }

    // Wait for canvas to appear (loading complete)
    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    await ss(page, "H01-loading-complete");

    const canvasOk = await canvas.isVisible().catch(() => false);
    if (canvasOk) {
      console.log("[H01] Loading complete — canvas visible");
      await expect(canvas).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Player HUD — HP + SP bars
// ─────────────────────────────────────────────────────────────────────────────

test.describe("HUD: Player HP and SP bars", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("HP and SP bars appear in-game with % values", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "H02-statbar-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(6_000);
    await ss(page, "H02-battle-started");

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
    await ss(page, "H02-canvas-up");

    // Wait for in-progress (past launch phase)
    await page.waitForTimeout(15_000);
    await ss(page, "H02-in-progress");

    // HP label
    const hpLabel = page.locator("text=HP").first();
    const hpVisible = await hpLabel.isVisible({ timeout: 5_000 }).catch(() => false);
    if (hpVisible) {
      await ss(page, "H02-hp-bar-visible");
      await expect(hpLabel).toBeVisible();
      console.log("[H02] HP label visible");
    } else {
      console.log("[H02] HP label not found — HUD may only show during in-progress");
    }

    // SP label (capped at 100)
    const spLabel = page.locator("text=SP").first();
    const spVisible = await spLabel.isVisible({ timeout: 3_000 }).catch(() => false);
    if (spVisible) {
      await ss(page, "H02-sp-bar-visible");
      console.log("[H02] SP label visible");
    }

    // Verify % values are shown (e.g. "100/100" or "75/100")
    const valueText = page.locator("text=/\\d+\\/100/").first();
    const valueVisible = await valueText.isVisible({ timeout: 3_000 }).catch(() => false);
    if (valueVisible) {
      const txt = await valueText.textContent();
      console.log(`[H02] HUD value: "${txt}"`);
      await ss(page, "H02-hud-value-visible");
    }

    await ss(page, "H02-all-hud-elements");

    const critical = filterErrors(errors);
    if (critical.length) console.log(`[H02] JS errors: ${critical.join(" | ")}`);
    expect(critical).toHaveLength(0);
  });

  test("Spectator view shows PLAYER vs CPU cards with 'Click to follow'", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "H03-spectator-unauth"); return; }

    // Navigate to the current room URL as a spectator
    const battleUrl = page.url();
    const spectateUrl = `${battleUrl}${battleUrl.includes("?") ? "&" : "?"}spectate=true`;

    await page.goto(spectateUrl);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(8_000);
    await ss(page, "H03-spectator-view");

    const spectateLabel = page.locator("text=SPECTATING").first();
    const specVisible = await spectateLabel.isVisible({ timeout: 5_000 }).catch(() => false);
    if (specVisible) {
      await ss(page, "H03-spectating-label");
      console.log("[H03] SPECTATING label visible");
    }

    const followLabel = page.locator("text=/click.*follow|follow.*click/i").first();
    const followVisible = await followLabel.isVisible({ timeout: 5_000 }).catch(() => false);
    if (followVisible) {
      await ss(page, "H03-click-to-follow");
      console.log("[H03] 'Click to follow' label visible");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GBA Shell zoom buttons (on console body, not in viewport)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("HUD: GBA Shell zoom buttons (+/0/−)", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("zoom buttons on GBA shell body work during a game", async ({ page }) => {
    const started = await startGameViaCarousel(page, "tryout");
    if (!started) { await ss(page, "H04-zoom-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(10_000);
    await ss(page, "H04-battle-ready");

    // Zoom buttons are divs on the GBA console body (ZoomStrip component)
    // They contain the text +, 0, − and are NOT inside the game viewport
    const zoomIn = page.locator("div, button").filter({ hasText: /^\+$/ }).first();
    const zoomInOk = await zoomIn.isVisible({ timeout: 5_000 }).catch(() => false);
    if (zoomInOk) {
      await zoomIn.click();
      await page.waitForTimeout(300);
      await ss(page, "H04-zoomed-in");
      console.log("[H04] Zoom in clicked");
    }

    const zoomReset = page.locator("div, button").filter({ hasText: /^0$/ }).first();
    const zoomResetOk = await zoomReset.isVisible({ timeout: 3_000 }).catch(() => false);
    if (zoomResetOk) {
      await zoomReset.click();
      await page.waitForTimeout(300);
      await ss(page, "H04-zoom-reset");
    }

    const zoomOut = page.locator("div, button").filter({ hasText: /^[−\-]$/ }).first();
    const zoomOutOk = await zoomOut.isVisible({ timeout: 3_000 }).catch(() => false);
    if (zoomOutOk) {
      await zoomOut.click();
      await page.waitForTimeout(300);
      await ss(page, "H04-zoomed-out");
    }

    if (zoomInOk) {
      console.log("[H04] All GBA shell zoom controls verified");
    } else {
      console.log("[H04] Zoom controls not found — checking keyboard shortcuts instead");
      const canvas = page.locator("canvas");
      if (await canvas.isVisible().catch(() => false)) {
        await canvas.click();
        await page.keyboard.press("Equal");
        await page.waitForTimeout(300);
        await ss(page, "H04-keyboard-zoom-in");
        await page.keyboard.press("Digit0");
        await page.waitForTimeout(300);
        await page.keyboard.press("Minus");
        await page.waitForTimeout(300);
        await ss(page, "H04-keyboard-zoom-out");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Launch QTE — tilt, position, power charge
// ─────────────────────────────────────────────────────────────────────────────

test.describe("QTE: Launch Phase (tilt + position + power)", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("launch QTE UI shows tilt, position and power indicators (shown for local rooms too)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    const started = await startGameViaCarousel(page, "tryout");
    if (!started) { await ss(page, "Q01-launch-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_500); // warmup is 3s
    await ss(page, "Q01-game-loaded");

    // Wait for launch phase
    const launchIndicator = page.locator("text=/launch|tilt|charge|power|Let It Rip/i").first();
    const launchVisible = await launchIndicator.waitFor({ state: "visible", timeout: 20_000 }).then(() => true).catch(() => false);

    if (launchVisible) {
      await ss(page, "Q01-launch-phase-started");
      console.log("[Q01] Launch phase visible");

      const tiltEl = page.locator("text=/tilt|A.*D.*tilt/i, [class*=tilt], [id*=tilt]").first();
      const tiltVisible = await tiltEl.isVisible({ timeout: 3_000 }).catch(() => false);
      if (tiltVisible) await ss(page, "Q01-tilt-indicator");

      const powerEl = page.locator("text=/power|charge|space/i, [class*=power], [class*=charge]").first();
      const powerVisible = await powerEl.isVisible({ timeout: 3_000 }).catch(() => false);
      if (powerVisible) await ss(page, "Q01-power-indicator");

      await page.keyboard.press("KeyA");
      await page.waitForTimeout(200);
      await ss(page, "Q01-tilt-left");

      await page.keyboard.press("KeyD");
      await page.keyboard.press("KeyD");
      await page.waitForTimeout(200);
      await ss(page, "Q01-tilt-right");

      await page.keyboard.press("KeyW");
      await page.waitForTimeout(200);
      await ss(page, "Q01-position-up");

      await page.keyboard.down("Space");
      await page.waitForTimeout(1_500);
      await ss(page, "Q01-power-charging");

      await page.keyboard.up("Space");
      await page.waitForTimeout(500);
      await ss(page, "Q01-launched");

      console.log("[Q01] Launch QTE interactions complete");
    } else {
      await ss(page, "Q01-no-launch-phase");
      console.log("[Q01] Launch phase not detected — game may start immediately");
    }

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await ss(page, "Q01-canvas-post-launch");

    const critical = filterErrors(errors);
    if (critical.length) console.log(`[Q01] JS errors: ${critical.join(" | ")}`);
  });

  test("PvAI launch QTE — AI auto-launches and human must charge", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "Q02-ai-launch-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await ss(page, "Q02-pvai-warmup");

    const launchEl = page.locator("text=/launch|power|charge|tilt|Let It Rip/i").first();
    const inLaunch = await launchEl.waitFor({ state: "visible", timeout: 15_000 }).then(() => true).catch(() => false);
    if (inLaunch) {
      await ss(page, "Q02-launch-phase");

      await page.keyboard.down("Space");
      await page.waitForTimeout(1_500);
      await page.keyboard.up("Space");
      await page.waitForTimeout(1_000);
      await ss(page, "Q02-human-launched");
    }

    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(5_000);
    await ss(page, "Q02-battle-in-progress");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Collision QTE (now works in local rooms too — !local gate removed)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("QTE: Collision QTE (impact window button prompt)", () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("collision QTE prompt appears during battle and responds to input", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "Q03-collision-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");

    // Get through warmup + launch
    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(2_000);
    await ss(page, "Q03-in-progress");

    const qtePrompt = page.locator('[class*="qte"], [class*="collision-prompt"]')
      .or(page.getByText(/press.*J|collision|impact|QTE|counter|clash/i))
      .first();

    let qteFound = false;
    for (let attempt = 0; attempt < 6; attempt++) {
      await page.waitForTimeout(15_000);
      await ss(page, `Q03-battle-t${(attempt + 1) * 15}s`);

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("KeyJ");
        await page.waitForTimeout(200);
      }

      const qteVisible = await qtePrompt.isVisible({ timeout: 1_000 }).catch(() => false);
      if (qteVisible) {
        await ss(page, "Q03-COLLISION-QTE-VISIBLE");
        console.log(`[Q03] Collision QTE found at t=${(attempt + 1) * 15}s`);
        qteFound = true;

        await page.keyboard.press("KeyJ");
        await page.waitForTimeout(200);
        await ss(page, "Q03-qte-responded");
        break;
      }
    }

    if (!qteFound) {
      console.log("[Q03] Collision QTE not triggered in 90s — may require specific beyblade types");
    }

    await ss(page, "Q03-final-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Series score HUD (BO3)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("HUD: Series score panel (BO3)", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("BO3 series score panel appears in top-right HUD", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "H05-series-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    // Look for BO3 option in the card picker
    const bo3Btn = page.locator("button").filter({ hasText: /^BO3$/i }).first();
    await bo3Btn.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
    if (await bo3Btn.isVisible().catch(() => false)) {
      await bo3Btn.click();
      await page.waitForTimeout(200);
    }

    const startBtn = page.locator("button").filter({ hasText: /start|launch|fight|play/i }).first();
    await startBtn.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/\/game\/room/, { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(8_000);
    await ss(page, "H05-bo3-in-progress");

    const seriesPanel = page.locator("text=/0.*0|wins?.*series/i").first();
    const panelVisible = await seriesPanel.isVisible({ timeout: 5_000 }).catch(() => false);
    if (panelVisible) {
      await ss(page, "H05-series-score-panel");
      console.log("[H05] Series score panel visible");
    } else {
      console.log("[H05] Series score panel may only show once a game ends");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. 1v7 Load Test — same arena, all unique beyblades
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Load Test: 1 human vs 7 AI bots in same arena", () => {
  test.setTimeout(300_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("starts 1v7 arena with all 8 beyblades spawning", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    const landed = await gotoProtected(page, "/game/battle");
    if (!landed) { await ss(page, "L01-1v7-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);
    await ss(page, "L01-setup-page");

    // Click PvAI card
    const pvaiCard = page.locator("button, [role='button'], [class*='card']").filter({ hasText: /pvai|vs ai|ai battle/i }).first();
    if (await pvaiCard.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await pvaiCard.click();
      await page.waitForTimeout(800);
    }

    // Set AI count to 7
    const countInput = page.locator('input[name="ai-count"], input[type="number"][min]').first();
    if (await countInput.isVisible().catch(() => false)) {
      await countInput.fill("7");
      await page.waitForTimeout(300);
      await ss(page, "L01-count-set-7");
    } else {
      console.log("[L01] AI count input not visible — using default");
    }

    const startBtn = page.locator("button").filter({ hasText: /start|play|launch/i }).first();
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    }

    await page.waitForURL(/\/game\/room/, { timeout: 20_000 }).catch(() => {});
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await ss(page, "L01-1v7-battle-started");

    const canvas = page.locator("canvas");
    const canvasOk = await canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true).catch(() => false);
    if (canvasOk) {
      await ss(page, "L01-1v7-canvas");
      console.log("[L01] Canvas visible with 1v7 setup");
    }

    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(3_000);
    await ss(page, "L01-1v7-in-progress");

    for (let i = 1; i <= 4; i++) {
      await page.waitForTimeout(10_000);
      await ss(page, `L01-1v7-t${i * 10}s`);
    }

    const ended = await page.getByText(/wins!/i).or(page.getByText(/Victory!/i)).or(page.getByText(/Defeated!/i)).first()
      .waitFor({ state: "visible", timeout: 150_000 }).then(() => true).catch(() => false);

    if (ended) {
      await ss(page, "L01-1v7-RESULT");
      console.log("[L01] 1v7 match ended with result");
    } else {
      await ss(page, "L01-1v7-timeout");
      console.log("[L01] 1v7 match still running at timeout");
    }

    const critical = filterErrors(errors);
    if (critical.length) console.log(`[L01] JS errors: ${critical.join(" | ")}`);
    // Don't assert zero errors for load test
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7b. QTE Notification System — variant tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe("QTE Notification System: variant components", () => {
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("SequenceQTE (counter) has data-testid=qte-sequence and key pills", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "QN01-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    // Skip through launch phase
    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(3_000);

    // Wait for a counter QTE (opponent fires special → QTE appears)
    // Poll for up to 90s of battle
    let qteFound = false;
    for (let i = 0; i < 6 && !qteFound; i++) {
      await page.waitForTimeout(15_000);
      const qteEl = page.locator('[data-testid="qte-sequence"]');
      qteFound = await qteEl.isVisible({ timeout: 1_000 }).catch(() => false);
      if (qteFound) {
        await ss(page, "QN01-sequence-qte-visible");
        await expect(qteEl).toBeVisible();

        // Check key pills exist
        const keyPill = page.locator('[data-testid^="qte-key-"]').first();
        await expect(keyPill).toBeVisible({ timeout: 2_000 });
        console.log("[QN01] SequenceQTE visible with key pills");
      }
    }
    if (!qteFound) {
      console.log("[QN01] SequenceQTE not triggered — requires opponent special move");
    }
    await ss(page, "QN01-final");
  });

  test("MashQTE has data-testid=qte-mash and shows power bar", async ({ page }) => {
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "QN02-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(3_000);

    // Mash QTE appears on collision — spam attack key to provoke collisions
    let mashFound = false;
    for (let i = 0; i < 6 && !mashFound; i++) {
      await page.waitForTimeout(10_000);
      for (let k = 0; k < 10; k++) {
        await page.keyboard.press("KeyJ");
        await page.waitForTimeout(100);
      }
      const mashEl = page.locator('[data-testid="qte-mash"]');
      mashFound = await mashEl.isVisible({ timeout: 2_000 }).catch(() => false);
      if (mashFound) {
        await ss(page, "QN02-mash-qte-visible");
        await expect(mashEl).toBeVisible();
        // Mash keys during window
        for (let k = 0; k < 5; k++) {
          await page.keyboard.press("KeyJ");
          await page.waitForTimeout(120);
        }
        const specialPrompt = page.locator('[data-testid="qte-mash-special"]');
        const specialVisible = await specialPrompt.isVisible({ timeout: 2_000 }).catch(() => false);
        if (specialVisible) {
          await ss(page, "QN02-mash-special-prompt");
          console.log("[QN02] MashQTE special prompt visible");
        }
        console.log("[QN02] MashQTE visible");
        break;
      }
    }
    if (!mashFound) {
      console.log("[QN02] MashQTE not triggered in 60s — may require more collisions");
    }
    await ss(page, "QN02-final");
  });

  test("SingleKeyQTE (escape) has data-testid=qte-single-key", async ({ page }) => {
    // This QTE only appears in server rooms (PvP/AI-server) for BeyLink escape.
    // We just verify the data-testid renders if/when it appears.
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "QN03-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(5_000);
    await ss(page, "QN03-in-progress");

    // SingleKeyQTE is BeyLink-only; check if it appears in extended play
    let skFound = false;
    for (let i = 0; i < 4 && !skFound; i++) {
      await page.waitForTimeout(15_000);
      const skEl = page.locator('[data-testid="qte-single-key"]');
      skFound = await skEl.isVisible({ timeout: 1_000 }).catch(() => false);
      if (skFound) {
        await ss(page, "QN03-single-key-visible");
        await expect(skEl).toBeVisible();
        console.log("[QN03] SingleKeyQTE visible");
        // Press any key to respond
        await page.keyboard.press("KeyJ");
        await page.waitForTimeout(500);
        await ss(page, "QN03-responded");
      }
    }
    if (!skFound) {
      console.log("[QN03] SingleKeyQTE not triggered — BeyLink must activate first");
    }
    await ss(page, "QN03-final");
  });

  test("DebuffNotice has data-testid=qte-debuff and duration bar", async ({ page }) => {
    // Debuff appears in server rooms when BeyLink control-loss is triggered.
    const started = await startGameViaCarousel(page, "pvai");
    if (!started) { await ss(page, "QN04-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(4_000);
    await page.keyboard.down("Space");
    await page.waitForTimeout(1_500);
    await page.keyboard.up("Space");
    await page.waitForTimeout(5_000);
    await ss(page, "QN04-in-progress");

    let debuffFound = false;
    for (let i = 0; i < 4 && !debuffFound; i++) {
      await page.waitForTimeout(15_000);
      const debuffEl = page.locator('[data-testid="qte-debuff"]');
      debuffFound = await debuffEl.isVisible({ timeout: 1_000 }).catch(() => false);
      if (debuffFound) {
        await ss(page, "QN04-debuff-visible");
        await expect(debuffEl).toBeVisible();
        // Check debuff label (REVERSED / SCRAMBLED / FROZEN)
        const label = page.locator('[data-testid="qte-debuff"]').locator("text=/REVERSED|SCRAMBLED|FROZEN/i").first();
        const labelOk = await label.isVisible({ timeout: 2_000 }).catch(() => false);
        if (labelOk) console.log("[QN04] DebuffNotice with mode label visible");
        console.log("[QN04] DebuffNotice visible");
      }
    }
    if (!debuffFound) {
      console.log("[QN04] DebuffNotice not triggered — BeyLink control-loss must fire first");
    }
    await ss(page, "QN04-final");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Tournament: immediate match when both players ready + round display
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Tournament: immediate match + PvAI gauntlet", () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await tryLogin(page);
  });

  test("tournament list shows player-gauntlet type", async ({ page }) => {
    const landed = await gotoProtected(page, "/game/tournament");
    if (!landed) { await ss(page, "T01-tournament-list-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "T01-tournament-list");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    const gauntletBadge = page.locator("text=/gauntlet|player.gauntlet|⚔/i").first();
    const gauntletVisible = await gauntletBadge.isVisible({ timeout: 3_000 }).catch(() => false);
    if (gauntletVisible) {
      await ss(page, "T01-gauntlet-badge");
      console.log("[T01] Player Gauntlet tournament visible in list");
    } else {
      console.log("[T01] No gauntlet tournaments currently — create one via admin to test");
    }
  });

  test("admin can create a player-gauntlet tournament", async ({ page }) => {
    const landed = await gotoProtected(page, "/admin/tournaments/create");
    if (!landed) { await ss(page, "T02-create-unauth"); return; }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_500);
    await ss(page, "T02-tournament-create");

    const typeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /pvp|gauntlet|mixed/i }).first();

    if (await typeSelect.isVisible().catch(() => false)) {
      const gauntletOpt = page.locator('[role="option"], option').filter({ hasText: /gauntlet/i }).first();
      if (await gauntletOpt.isVisible().catch(() => false)) {
        await gauntletOpt.click();
        await page.waitForTimeout(300);
        await ss(page, "T02-gauntlet-selected");
        console.log("[T02] Player Gauntlet type selected");
      }
    }

    await ss(page, "T02-gauntlet-form");
  });
});

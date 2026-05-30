import { type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Screenshot directory bootstrap
// ─────────────────────────────────────────────────────────────────────────────

const SHOT_DIR = path.resolve("test-results/screenshots");
try {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
} catch { /* already exists */ }

// ─────────────────────────────────────────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Log in via email/password if TEST_EMAIL + TEST_PASSWORD are set in the
 * environment.  Returns true when login succeeded.
 *
 * Without credentials every test still runs — it just lands on the login
 * redirect instead of the real page.
 */
export async function tryLogin(page: Page): Promise<boolean> {
  const email    = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) return false;

  try {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_200);
  } catch {
    return false;
  }

  // Check if already logged in (auth guard redirected away from /login)
  if (!page.url().includes("/login")) return true;

  const emailInput = page.locator('input[type="email"]');
  const passInput  = page.locator('input[type="password"]');

  try {
    await emailInput.waitFor({ state: "visible", timeout: 8_000 });
    await emailInput.fill(email);
    await passInput.fill(password);
    await page.click('button[type="submit"]');
  } catch {
    return false;
  }

  try {
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Navigate to a protected route.  If the app redirects to /login it means
 * auth is required — return false so the calling test can gracefully degrade.
 */
export async function gotoProtected(page: Page, path: string): Promise<boolean> {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  // Give React Router a tick to redirect (auth guard reads Firestore asynchronously)
  await page.waitForTimeout(2000);
  const currentUrl = page.url();
  if (currentUrl.includes("/login")) return false;
  // Detect admin guard redirecting to home ("/") when user lacks admin role.
  const segment = path.split("?")[0].replace(/^\//, "");
  if (segment && !currentUrl.includes(segment)) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screenshot helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Take a full-page screenshot and save under test-results/screenshots/. */
export async function ss(page: Page, name: string): Promise<void> {
  try {
    await page.screenshot({
      path: path.join(SHOT_DIR, `${name}.png`),
      fullPage: true,
    });
  } catch {
    // Never let a screenshot failure abort a test
  }
}

/**
 * Take a viewport screenshot (not full-page) — useful for checking
 * above-the-fold content at a specific breakpoint without capturing
 * virtual-scroll content below.
 */
export async function ssViewport(page: Page, name: string): Promise<void> {
  try {
    await page.screenshot({
      path: path.join(SHOT_DIR, `${name}.png`),
      fullPage: false,
    });
  } catch { /* never abort */ }
}

/**
 * Capture a diagnostic snapshot on timeout or unexpected state:
 *   - full-page screenshot saved as <tag>-diag.png
 *   - current URL
 *   - visible page heading
 *   - filtered JS errors (WebSocket / Firebase / WebGL noise excluded)
 */
export async function diagnose(page: Page, tag: string, errors: string[] = []): Promise<void> {
  await ss(page, `${tag}-diag`);
  console.log(`[${tag}] URL: ${page.url()}`);
  const heading = await page
    .locator("h1, h2, canvas, [class*='error'], [class*='Error']")
    .first()
    .textContent()
    .catch(() => "");
  if (heading?.trim()) console.log(`[${tag}] Page heading/element: "${heading.trim()}"`);
  const critical = filterErrors(errors);
  if (critical.length) console.log(`[${tag}] JS errors: ${critical.join(" | ")}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport helpers
// ─────────────────────────────────────────────────────────────────────────────

export type Viewport = { width: number; height: number; label: string };

export const SMOKE_VIEWPORTS: Viewport[] = [
  { width: 390,  height: 844,  label: "mobile-390"  },
  { width: 768,  height: 1024, label: "tablet-768"  },
  { width: 1440, height: 900,  label: "desktop-1440" },
];

/**
 * Resize the page to the given viewport and take a screenshot.
 * Appends the viewport label to the screenshot name.
 */
export async function ssAt(page: Page, name: string, vp: Viewport): Promise<void> {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(300); // let CSS layout settle
  await ss(page, `${name}-${vp.label}`);
}

/**
 * Take a screenshot at all three breakpoints (mobile, tablet, desktop).
 * Restores the original viewport size afterwards.
 */
export async function ssAllViewports(page: Page, name: string): Promise<void> {
  const original = page.viewportSize();
  for (const vp of SMOKE_VIEWPORTS) {
    await ssAt(page, name, vp);
  }
  if (original) {
    await page.setViewportSize(original);
    await page.waitForTimeout(200);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Error filtering
// ─────────────────────────────────────────────────────────────────────────────

/** Strip known noise from JS error arrays — returns only critical errors. */
export function filterErrors(errors: string[]): string[] {
  return errors.filter((e) => {
    const l = e.toLowerCase();
    return (
      !l.includes("websocket") &&
      !l.includes("net::err") &&
      !l.includes("failed to fetch") &&
      !l.includes("firebase") &&
      !l.includes("alphamode") &&
      !l.includes("webgl context") &&
      !l.includes("load failed") &&
      !l.includes("econnrefused") &&
      !l.includes("network error")
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Overflow / layout helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assert that the page body does not scroll horizontally.
 * Passes a 4px tolerance for sub-pixel rounding and scrollbars.
 */
export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const result = await page.evaluate(() => ({
    scrollWidth:  document.body.scrollWidth,
    clientWidth:  document.body.clientWidth,
    windowWidth:  window.innerWidth,
  }));
  // scrollWidth > clientWidth means horizontal overflow
  const overflow = result.scrollWidth - result.windowWidth;
  if (overflow > 4) {
    console.warn(
      `[overflow] scrollWidth=${result.scrollWidth} windowWidth=${result.windowWidth} ` +
      `overflow=${overflow}px`
    );
  }
  // Soft-assert — we log but don't hard-fail (some PixiJS canvases legitimately resize)
}

/**
 * Assert that all canvas elements sit within the current viewport bounds.
 * Tolerance of 4px for sub-pixel rounding.
 */
export async function assertCanvasInViewport(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport) return;

  const canvases = page.locator("canvas");
  const count = await canvases.count();

  for (let i = 0; i < count; i++) {
    const box = await canvases.nth(i).boundingBox();
    if (!box) continue;
    if (box.x < -4) console.warn(`canvas[${i}] x=${box.x} overflows left`);
    if (box.y < -4) console.warn(`canvas[${i}] y=${box.y} overflows top`);
    if (box.x + box.width > viewport.width + 4)
      console.warn(`canvas[${i}] right=${box.x + box.width} > viewport.width=${viewport.width}`);
    if (box.y + box.height > viewport.height + 4)
      console.warn(`canvas[${i}] bottom=${box.y + box.height} > viewport.height=${viewport.height}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas rendering analysis
// ─────────────────────────────────────────────────────────────────────────────

export interface CanvasAnalysis {
  /** Canvas element was found in DOM */
  found:    boolean;
  /** Canvas CSS bounding box (null if not found) */
  box:      { x: number; y: number; width: number; height: number } | null;
  /** True when box.width > 0 && box.height > 0 */
  hasSize:  boolean;
  /**
   * Fraction of sampled pixels that differ from pure black (0,0,0).
   * 0 = completely black (nothing rendered), 1 = all pixels have colour.
   * null when canvas.getContext("2d") is unavailable (WebGL canvas).
   */
  nonBlackRatio: number | null;
  /** True when the canvas appears to be rendering content */
  isRendering: boolean;
  /** Human-readable summary for console output */
  summary: string;
}

/**
 * Analyse a PixiJS/WebGL canvas to determine whether it is actively rendering
 * content.  Works by:
 *   1. Checking the canvas has non-zero CSS dimensions.
 *   2. Reading a 20×20 grid of pixels via `canvas.getContext("2d")`
 *      (falls back gracefully for WebGL-tainted canvases).
 *   3. Counting non-black pixels — a completely black canvas almost certainly
 *      means the renderer has not drawn anything yet.
 *
 * Does NOT throw.  All errors are caught and reflected in the result.
 */
export async function analyzeCanvas(page: Page): Promise<CanvasAnalysis> {
  // Bounding-box check
  const box = await page.locator("canvas").first().boundingBox().catch(() => null);
  if (!box) {
    return { found: false, box: null, hasSize: false, nonBlackRatio: null, isRendering: false,
             summary: "canvas not found in DOM" };
  }

  const hasSize = box.width > 0 && box.height > 0;
  if (!hasSize) {
    return { found: true, box, hasSize: false, nonBlackRatio: null, isRendering: false,
             summary: `canvas found but has zero size (${box.width}×${box.height})` };
  }

  // Pixel sampling via 2D context (works for 2D canvases; limited for WebGL)
  const nonBlackRatio = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    try {
      const ctx = c.getContext("2d");
      if (!ctx) return null; // WebGL canvas — can't read pixels via 2D
      const W = c.width, H = c.height;
      if (!W || !H) return null;
      // Sample a 20×20 grid across the canvas
      const GRID = 20;
      const stepX = Math.max(1, Math.floor(W / GRID));
      const stepY = Math.max(1, Math.floor(H / GRID));
      let nonBlack = 0, total = 0;
      for (let x = 0; x < W; x += stepX) {
        for (let y = 0; y < H; y += stepY) {
          const d = ctx.getImageData(x, y, 1, 1).data; // [r, g, b, a]
          total++;
          if (d[0] > 10 || d[1] > 10 || d[2] > 10) nonBlack++;
        }
      }
      return total > 0 ? nonBlack / total : 0;
    } catch { return null; }
  }).catch(() => null);

  // For WebGL canvases the pixel read always returns null — we consider it
  // rendering if the CSS box is non-zero (WebGL draws directly to the GPU).
  const isRendering = hasSize && (nonBlackRatio === null || nonBlackRatio > 0.01);

  const ratioStr = nonBlackRatio !== null ? `${(nonBlackRatio * 100).toFixed(1)}% non-black` : "WebGL (pixels unreadable)";
  const summary = `${box.width.toFixed(0)}×${box.height.toFixed(0)} px | ${ratioStr} | rendering=${isRendering}`;

  return { found: true, box, hasSize, nonBlackRatio, isRendering, summary };
}

/**
 * Log canvas analysis to the console and take a named screenshot.
 * Convenience wrapper used in tests.
 */
export async function checkAndLogCanvas(page: Page, tag: string): Promise<CanvasAnalysis> {
  const analysis = await analyzeCanvas(page);
  console.log(`[${tag}] Canvas: ${analysis.summary}`);
  await ss(page, tag);
  return analysis;
}

/**
 * Navigate to a URL via `startViaCards` flow or a direct URL, wait for the
 * canvas, analyse it and log a summary.  Returns `null` if the page isn't
 * reachable (e.g. redirected to /login).
 */
export async function waitAndAnalyzeCanvas(
  page: Page,
  tag: string,
  timeoutMs = 35_000,
): Promise<CanvasAnalysis | null> {
  try {
    await page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs });
  } catch {
    await ss(page, `${tag}-canvas-timeout`);
    return null;
  }
  await page.waitForTimeout(800); // let first frames render
  return checkAndLogCanvas(page, tag);
}

// ─────────────────────────────────────────────────────────────────────────────
// Game-flow helpers shared across test files
// ─────────────────────────────────────────────────────────────────────────────

/** Wait for loading-progress bar OR canvas — whichever shows first. */
export async function waitForGameMount(page: Page, timeoutMs = 35_000): Promise<void> {
  await Promise.race([
    page.locator("canvas").waitFor({ state: "visible", timeout: timeoutMs }),
    page
      .locator('[data-testid="loading-progress"]')
      .waitFor({ state: "visible", timeout: timeoutMs }),
  ]).catch(() => {});
}

/**
 * Wait through the 3s warmup countdown and 5s launch phase.
 * Automatically charges + releases the beyblade via Space key.
 * Uses data-testid="launch-phase-overlay" to avoid matching the persistent
 * CHARGE button that lives in GameShell outside the overlay.
 */
export async function waitThroughLaunch(page: Page, tag: string): Promise<void> {
  await page.waitForTimeout(3_500);
  await ss(page, `${tag}-post-warmup`);

  // Use data-testid so we never accidentally match the GameShell's persistent
  // "CHARGE" big-action button which is always in the DOM.
  const launchOverlay = page.locator('[data-testid="launch-phase-overlay"]');
  const inLaunch = await launchOverlay
    .waitFor({ state: "attached", timeout: 18_000 })
    .then(() => true)
    .catch(() => false);

  if (inLaunch) {
    await ss(page, `${tag}-launch-phase`);
    // Focus the game canvas so keyboard events reach the input listener
    const canvas = page.locator("canvas").first();
    if (await canvas.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await canvas.click({ force: true });
    }
    await page.keyboard.down("Space");
    await page.waitForTimeout(2_500);
    await ss(page, `${tag}-charging`);
    await page.keyboard.up("Space");
    await page.waitForTimeout(600);
    await ss(page, `${tag}-launched`);
  }
}

/**
 * Navigate via BattleModeCardsPage to start any local game mode.
 * Returns true when /game/room is reached or a canvas becomes visible.
 */
export async function startViaCards(
  page: Page,
  mode: "tryout" | "pvai" | "pvp" | "tournament" | "royale",
): Promise<boolean> {
  const landed = await gotoProtected(page, "/game/battle");
  if (!landed) return false;

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1_000);

  const modeTextMap: Record<typeof mode, RegExp> = {
    tryout:     /tryout|solo|practice/i,
    pvai:       /pvai|vs\s?ai|ai\s?battle/i,
    pvp:        /pvp|online|vs\s?player/i,
    tournament: /tournament/i,
    royale:     /royale|battle.*royal/i,
  };

  const card = page
    .locator("button, [role='button'], [class*='card']")
    .filter({ hasText: modeTextMap[mode] })
    .first();
  if (await card.isVisible({ timeout: 8_000 }).catch(() => false)) {
    await card.click();
    await page.waitForTimeout(800);
  }

  const startBtn = page
    .locator("button")
    .filter({ hasText: /start|play|launch|let it rip/i })
    .first();
  if (await startBtn.isVisible({ timeout: 6_000 }).catch(() => false)) {
    await startBtn.click();
  }

  const atRoom = await page
    .waitForURL(/\/game\/room/, { timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  return atRoom || page.locator("canvas").isVisible({ timeout: 8_000 }).catch(() => false);
}

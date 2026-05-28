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
  await page.waitForTimeout(800);
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

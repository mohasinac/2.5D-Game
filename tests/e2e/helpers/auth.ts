import { type Page } from "@playwright/test";

/**
 * Log in via email/password if TEST_EMAIL + TEST_PASSWORD are set in the
 * environment (e.g. via .env or CI secret).  Returns true when login succeeded.
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
    await page.waitForTimeout(1_500);
  } catch {
    return false; // Page failed to load — gracefully degrade
  }

  const emailInput = page.locator('input[type="email"]');
  const passInput  = page.locator('input[type="password"]');
  try {
    await emailInput.fill(email);
    await passInput.fill(password);
    await page.click('button[type="submit"]');
  } catch {
    return false; // Login form not present — probably already logged in or auth unavailable
  }

  try {
    // Wait until the URL leaves /login — the app redirects to /game or /admin.
    // Using a function predicate because a pure-string path like "/game" has no
    // trailing slash and a simple pattern like /\/game/ would also match
    // "game.letitrip.in" (subdomain). waitForURL(fn) is unambiguous.
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
  // Give React Router a tick to redirect
  await page.waitForTimeout(800);
  if (page.url().includes("/login")) return false;
  return true;
}

/** Take a full-page screenshot and save under test-results/screenshots/. */
export async function ss(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true,
  });
}

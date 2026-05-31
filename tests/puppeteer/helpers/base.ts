import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// ─── Browser singleton ────────────────────────────────────────────────────────

let _browser: Browser | null = null;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const SHOT_BASE = path.resolve('tests/screenshots/puppeteer');

// ─── Result log for report generator ─────────────────────────────────────────

export interface StepResult {
  suite: string;
  code: string;
  desc: string;
  screenshotPath: string;
  status: 'pass' | 'fail' | 'skip';
  error?: string;
}

export const stepResults: StepResult[] = [];

// ─── Browser helpers ──────────────────────────────────────────────────────────

export async function launchBrowser(): Promise<Browser> {
  if (_browser) return _browser;
  _browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-web-security',
    ],
    defaultViewport: { width: 1440, height: 900 },
  });
  return _browser;
}

export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}

export async function newPage(viewport = { width: 1440, height: 900 }): Promise<Page> {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport(viewport);
  // Suppress noisy console errors from Firebase / WebSocket in test output
  page.on('pageerror', () => { /* swallow */ });
  return page;
}

// ─── Screenshot step ──────────────────────────────────────────────────────────

export async function step(
  page: Page,
  suite: string,
  code: string,
  desc: string,
  opts?: { status?: 'pass' | 'fail' | 'skip'; error?: string },
): Promise<void> {
  const dir = path.join(SHOT_BASE, suite);
  fs.mkdirSync(dir, { recursive: true });
  const slug = desc.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60);
  const file = `${code}-${slug}.png`;
  const screenshotPath = path.join(dir, file);
  const status = opts?.status ?? 'pass';
  try {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  } catch {
    // Screenshot failure is non-fatal — still record the step
  }
  stepResults.push({ suite, code, desc, screenshotPath, status, error: opts?.error });
}

export async function stepFail(
  page: Page,
  suite: string,
  code: string,
  desc: string,
  error: unknown,
): Promise<void> {
  await step(page, suite, code, desc, { status: 'fail', error: String(error) });
}

export async function stepSkip(
  suite: string,
  code: string,
  desc: string,
  reason: string,
): Promise<void> {
  stepResults.push({
    suite,
    code,
    desc,
    screenshotPath: '',
    status: 'skip',
    error: reason,
  });
  console.log(`  ${code} ${desc}: SKIP — ${reason}`);
}

// ─── Auth helper ──────────────────────────────────────────────────────────────

export async function login(page: Page, email: string, password: string): Promise<boolean> {
  if (!email || !password) return false;
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(1200);
    // Already logged in (redirected away)
    if (!page.url().includes('/login')) return true;
    await page.type('input[type="email"]', email, { delay: 30 });
    await page.type('input[type="password"]', password, { delay: 30 });
    await page.click('button[type="submit"]');
    await page.waitForFunction(
      () => !window.location.pathname.startsWith('/login'),
      { timeout: 20_000 },
    );
    return true;
  } catch {
    return false;
  }
}

export async function logout(page: Page): Promise<void> {
  try {
    // Clear local/session storage so next page load is unauthenticated
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    // Also clear cookies
    const client = await page.createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.detach();
  } catch { /* ignore */ }
}

// ─── Navigation helper ────────────────────────────────────────────────────────

/**
 * Navigate to a path. Returns false if the server redirects to /login (auth
 * guard hit), true otherwise. The caller should decide what to do.
 */
export async function goto(
  page: Page,
  urlPath: string,
  opts?: { timeout?: number },
): Promise<boolean> {
  try {
    await page.goto(`${BASE_URL}${urlPath}`, {
      waitUntil: 'domcontentloaded',
      timeout: opts?.timeout ?? 30_000,
    });
    await page.waitForTimeout(1500);
    if (page.url().includes('/login')) return false;
    return true;
  } catch {
    return false;
  }
}

// ─── Visibility / element helpers ─────────────────────────────────────────────

/** Wait for a selector to appear and be visible, with a short timeout. */
export async function waitVisible(
  page: Page,
  selector: string,
  timeout = 10_000,
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch {
    return false;
  }
}

/** Check whether any element matching a selector is present in the DOM. */
export async function exists(page: Page, selector: string): Promise<boolean> {
  try {
    return (await page.$(selector)) !== null;
  } catch {
    return false;
  }
}

/**
 * Check whether page text (entire document body) contains a substring.
 * Case-insensitive.
 */
export async function bodyContains(page: Page, text: string): Promise<boolean> {
  try {
    const body = await page.evaluate(() => document.body.innerText);
    return body.toLowerCase().includes(text.toLowerCase());
  } catch {
    return false;
  }
}

// ─── Environment ──────────────────────────────────────────────────────────────

export function getEnv() {
  return {
    BASE_URL,
    TEST_EMAIL: process.env.TEST_EMAIL || '',
    TEST_PASSWORD: process.env.TEST_PASSWORD || '',
    TEST2_EMAIL: process.env.TEST2_EMAIL || '',
    TEST2_PASSWORD: process.env.TEST2_PASSWORD || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.TEST_EMAIL || '',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.TEST_PASSWORD || '',
  };
}

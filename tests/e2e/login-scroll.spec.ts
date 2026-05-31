import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop',  width: 1440, height: 900 },
  { name: 'short',    width: 1280, height: 600 },
  { name: 'mobile',   width: 390,  height: 844 },
  { name: 'tiny',     width: 375,  height: 560 }, // smallest common phone
];

for (const vp of VIEWPORTS) {
  test(`Login page: Sign In button reachable on ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/login');

    // Sign In button must exist and be reachable via scroll
    const signInBtn = page.getByRole('button', { name: /sign in/i });
    await signInBtn.scrollIntoViewIfNeeded();
    await expect(signInBtn).toBeVisible({ timeout: 8_000 });

    // Google button also reachable
    const googleBtn = page.getByRole('button', { name: /continue with google/i });
    await googleBtn.scrollIntoViewIfNeeded();
    await expect(googleBtn).toBeVisible();

    // No layout ancestor blocking scroll
    const blocked = await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      let el = btn?.parentElement ?? null;
      while (el && el !== document.documentElement) {
        if (['DIV', 'MAIN', 'BODY'].includes(el.tagName)) {
          if (getComputedStyle(el).overflowY === 'hidden') {
            return `overflow:hidden on <${el.tagName}>`;
          }
        }
        el = el.parentElement;
      }
      return 'ok';
    });
    expect(blocked).toBe('ok');

    await page.screenshot({ path: `playwright-report/login-${vp.name}.png`, fullPage: true });
  });
}

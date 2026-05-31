import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop',  width: 1440, height: 900 },
  { name: 'short',    width: 1280, height: 600 },
  { name: 'mobile',   width: 390,  height: 844 },
  { name: 'tiny',     width: 375,  height: 560 }, // smallest common phone
];

for (const vp of VIEWPORTS) {
  test(`Login page: Sign In button visible without scrolling on ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/login');

    // Both buttons must be immediately visible — no scroll needed
    const signInBtn = page.getByRole('button', { name: /sign in/i });
    await expect(signInBtn).toBeVisible({ timeout: 8_000 });

    const googleBtn = page.getByRole('button', { name: /continue with google/i });
    await expect(googleBtn).toBeVisible();

    // Sign In button must be within viewport bounds (not clipped)
    const signInBox = await signInBtn.boundingBox();
    expect(signInBox, 'Sign In button has no bounding box').not.toBeNull();
    expect(signInBox!.y + signInBox!.height, 'Sign In button bottom is clipped below viewport').toBeLessThanOrEqual(vp.height + 2);
    expect(signInBox!.y, 'Sign In button top is above viewport').toBeGreaterThanOrEqual(-2);

    // No horizontal overflow
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollW, 'Horizontal overflow on login page').toBeLessThanOrEqual(clientW + 2);

    // Page fits exactly in viewport — game-like no-document-scroll design
    const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientH = await page.evaluate(() => document.documentElement.clientHeight);
    expect(scrollH, 'Login page taller than viewport (document scroll appeared)').toBeLessThanOrEqual(clientH + 2);

    await page.screenshot({ path: `playwright-report/login-${vp.name}.png` });
  });
}

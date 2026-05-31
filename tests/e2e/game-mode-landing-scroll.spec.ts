import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop',  width: 1440, height: 900  },
  { name: 'laptop',   width: 1280, height: 720  },
  { name: 'short',    width: 1440, height: 600  }, // short viewport — was clipping
  { name: 'mobile',   width: 390,  height: 844  },
];

for (const vp of VIEWPORTS) {
  test(`GameModeLandingPage fits / scrolls on ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    // Page must render — at least the BATTLE MODE button
    const battleBtn = page.getByRole('button', { name: /battle mode/i });
    await expect(battleBtn).toBeVisible({ timeout: 10_000 });

    // ── 1. No horizontal overflow ────────────────────────────────────────────
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollW, `horizontal overflow on ${vp.name}`).toBeLessThanOrEqual(clientW + 2);

    // ── 2. Content is reachable (scrollHeight ≥ clientHeight, not clipped) ──
    const scrollH   = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientH   = await page.evaluate(() => document.documentElement.clientHeight);
    // scrollHeight must be at least as tall as the viewport
    expect(scrollH, `content clipped on ${vp.name}`).toBeGreaterThanOrEqual(clientH);

    // ── 3. All panel buttons are reachable after scrolling ──────────────────
    const storyBtn  = page.getByRole('button', { name: /story mode/i });
    await storyBtn.scrollIntoViewIfNeeded();
    await expect(storyBtn).toBeVisible();

    await battleBtn.scrollIntoViewIfNeeded();
    await expect(battleBtn).toBeVisible();

    // ── 4. Leaderboard footer link is reachable ──────────────────────────────
    const lbBtn = page.getByRole('button', { name: /leaderboard/i });
    await lbBtn.scrollIntoViewIfNeeded();
    await expect(lbBtn).toBeVisible();

    // ── 5. Screenshot for visual review ─────────────────────────────────────
    await page.screenshot({ path: `playwright-report/landing-${vp.name}.png`, fullPage: true });
  });
}

test('GameModeLandingPage overflow:hidden is gone (root div scrollable)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 }); // deliberately short
  await page.goto('/');

  await page.waitForSelector('button', { timeout: 10_000 });

  // The root/layout divs must NOT have overflow:hidden that would block scrolling.
  // (Buttons and other leaf elements can have overflow:hidden for visual clipping — that's fine.)
  const overflowY = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => /story mode/i.test(b.textContent ?? ''));
    // Start from the button's parent so we skip the button element itself
    let el: Element | null = btn?.parentElement ?? document.body;
    while (el && el !== document.documentElement) {
      if (el.tagName === 'DIV' || el.tagName === 'MAIN' || el.tagName === 'BODY') {
        const ov = getComputedStyle(el).overflowY;
        if (ov === 'hidden') return `hidden on <${el.tagName} class="${el.className.slice(0, 60)}">`;
      }
      el = el.parentElement;
    }
    return 'ok';
  });

  expect(overflowY, 'A layout ancestor has overflow:hidden blocking scroll').toBe('ok');
});

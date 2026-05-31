import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop',  width: 1440, height: 900  },
  { name: 'laptop',   width: 1280, height: 720  },
  { name: 'short',    width: 1440, height: 600  },
  { name: 'mobile',   width: 390,  height: 844  },
];

for (const vp of VIEWPORTS) {
  test(`GameModeLandingPage fits in viewport on ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    // Active card (STORY MODE at index 0) must be immediately visible
    const storyCard = page.getByRole('button', { name: /story mode/i });
    await expect(storyCard).toBeVisible({ timeout: 10_000 });

    // No horizontal overflow
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollW, `horizontal overflow on ${vp.name}`).toBeLessThanOrEqual(clientW + 2);

    // Page fits exactly — no document-level vertical overflow (game-like design)
    const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientH = await page.evaluate(() => document.documentElement.clientHeight);
    expect(scrollH, `page taller than viewport on ${vp.name}`).toBeLessThanOrEqual(clientH + 2);

    // Leaderboard footer button is visible within viewport bounds
    const lbBtn = page.getByRole('button', { name: /leaderboard/i });
    await expect(lbBtn).toBeVisible();
    const lbBox = await lbBtn.boundingBox();
    expect(lbBox, 'Leaderboard button has no bounding box').not.toBeNull();
    expect(lbBox!.y + lbBox!.height, 'Leaderboard button clipped below viewport').toBeLessThanOrEqual(vp.height + 2);

    // Carousel navigation: ArrowRight moves to BATTLE MODE card
    await page.keyboard.press('ArrowRight');
    const battleCard = page.getByRole('button', { name: /battle mode/i });
    await expect(battleCard).toBeVisible();

    await page.screenshot({ path: `playwright-report/landing-${vp.name}.png` });
  });
}

test('GameModeLandingPage height equals viewport — game-like no-scroll design', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 }); // deliberately short
  await page.goto('/');

  await page.waitForSelector('[role="button"]', { timeout: 10_000 });

  const { scrollH, clientH } = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    clientH: document.documentElement.clientHeight,
  }));

  // Game-like: page must NOT exceed the viewport (no document scroll)
  expect(scrollH, 'Page exceeded viewport height — document scroll appeared').toBeLessThanOrEqual(clientH + 2);
});

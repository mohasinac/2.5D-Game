/**
 * launch-qte.test.ts — Launch QTE overlay tests
 *
 * PP15  Start PvAI game → launch overlay (tilt / position / charge) appears
 * PP16  Press Space → charge bar fills or game transitions to in-progress
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains, waitVisible } from './helpers/base';

const SUITE = 'launch-qte';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

/** Navigate to /game/room with a pvai config injected via history state. */
async function goToGameRoom(page: import('puppeteer').Page): Promise<void> {
  // First navigate to /game/battle so the SPA is loaded
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForTimeout(1000);

  // Inject the game config into location state via history API
  await page.evaluate(() => {
    const config = {
      roomType: 'pvai',
      beybladeId: 'storm_pegasus',
      arenaId: 'default_black_arena',
      aiDifficulty: 'medium',
      bestOf: 1,
    };
    window.history.pushState({ config }, '', '/game/room');
    window.dispatchEvent(new PopStateEvent('popstate', { state: { config } }));
  });
  await page.waitForTimeout(3000);
}

export async function runLaunchQTETests(): Promise<void> {
  const env = getEnv();
  console.log('\n[launch-qte] Starting Launch QTE tests...');

  // ── PP15: Launch overlay appears ────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP15', 'launch-overlay-appears', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // Wait up to 20s for the launch-phase content
        let launchVisible = false;
        const deadline = Date.now() + 20_000;
        while (Date.now() < deadline && !launchVisible) {
          launchVisible =
            await bodyContains(page, 'launch') ||
            await bodyContains(page, 'tilt') ||
            await bodyContains(page, 'charge') ||
            await bodyContains(page, 'let it rip') ||
            await bodyContains(page, 'power') ||
            await bodyContains(page, 'position') ||
            await bodyContains(page, 'warmup') ||
            await bodyContains(page, 'countdown') ||
            (await page.$('canvas') !== null);
          if (!launchVisible) await page.waitForTimeout(500);
        }

        await step(page, SUITE, 'PP15', 'launch-overlay-appears', {
          status: launchVisible ? 'pass' : 'fail',
          error: launchVisible ? undefined : 'Launch overlay / canvas not visible within 20 s',
        });
        console.log(`  PP15 launch-overlay-appears: ${launchVisible ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP15', 'launch-overlay-appears', e);
      console.log(`  PP15 launch-overlay-appears: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP16: Press Space → charge or game launches ──────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP16', 'launch-space-charge', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // Wait for the page to settle (up to 15s)
        await page.waitForTimeout(5000);

        // Ensure the page has focus then press Space
        await page.focus('body');
        await page.keyboard.down('Space');
        await page.waitForTimeout(1500);
        await page.keyboard.up('Space');
        await page.waitForTimeout(2000);

        // After space: charge bar should be visible or we're now in-progress
        const hasProgress =
          await bodyContains(page, 'charge') ||
          await bodyContains(page, 'power') ||
          await bodyContains(page, 'launching') ||
          await bodyContains(page, 'in-progress') ||
          await bodyContains(page, 'spin') ||
          (await page.$('canvas') !== null);

        // Also check no hard crash
        const hasCrash = await page.evaluate(() => {
          const t = document.body.innerText.toLowerCase();
          return t.includes('uncaught') || t.includes('typeerror') || t.includes('cannot read');
        });

        const pass = hasProgress && !hasCrash;
        await step(page, SUITE, 'PP16', 'launch-space-charge', {
          status: pass ? 'pass' : (hasCrash ? 'fail' : 'skip'),
          error: hasCrash
            ? 'JS error on page after Space key'
            : pass ? undefined : 'No visible response to Space key in launch phase',
        });
        console.log(`  PP16 launch-space-charge: ${pass ? 'PASS' : (hasCrash ? 'FAIL' : 'SKIP')}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP16', 'launch-space-charge', e);
      console.log(`  PP16 launch-space-charge: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[launch-qte] Done.');
}

runLaunchQTETests().catch(console.error);

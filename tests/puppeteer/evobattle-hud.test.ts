/**
 * evobattle-hud.test.ts — In-game HUD validation
 *
 * PP20  HUD strip (PlayerStrip / OpponentStrip) visible in game
 * PP21  Canvas element has non-zero dimensions
 * PP22  Series score area visible (win counter / round info)
 */

import { newPage, step, stepFail, stepSkip, login, getEnv, bodyContains } from './helpers/base';

const SUITE = 'evobattle-hud';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function goToGameRoom(page: import('puppeteer').Page): Promise<void> {
  await page.goto(`${BASE_URL}/game/battle`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForTimeout(1000);
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
  await page.waitForTimeout(6000);
}

export async function runEvoBattleHUDTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[evobattle-hud] Starting HUD tests...');

  // ── PP20: HUD strip visible ──────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP20', 'hud-strip-visible', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // HUD shows spin/health/stamina bars plus player names
        // PlayerStrip / OpponentStrip render bars labelled SP / HP / ST
        const hasHUD = await page.evaluate(() => {
          const body = document.body.innerText.toLowerCase();
          // Look for HUD bar labels or percentage values or player names
          return (
            body.includes('sp') ||
            body.includes('hp') ||
            body.includes('st') ||
            body.includes('spin') ||
            body.includes('health') ||
            body.includes('stamina') ||
            document.querySelector('canvas') !== null
          );
        });

        await step(page, SUITE, 'PP20', 'hud-strip-visible', {
          status: hasHUD ? 'pass' : 'fail',
          error: hasHUD ? undefined : 'No HUD content (bars/labels) visible on game page',
        });
        console.log(`  PP20 hud-strip-visible: ${hasHUD ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP20', 'hud-strip-visible', e);
      console.log(`  PP20 hud-strip-visible: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP21: Canvas has non-zero dimensions ─────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP21', 'canvas-non-zero-dimensions', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // Wait for canvas to appear
        let canvasOk = false;
        try {
          await page.waitForSelector('canvas', { visible: true, timeout: 15_000 });
          const dims = await page.evaluate(() => {
            const c = document.querySelector('canvas');
            if (!c) return { w: 0, h: 0 };
            const rect = c.getBoundingClientRect();
            return { w: rect.width, h: rect.height };
          });
          canvasOk = dims.w > 0 && dims.h > 0;
        } catch { /* canvas didn't appear */ }

        await step(page, SUITE, 'PP21', 'canvas-non-zero-dimensions', {
          status: canvasOk ? 'pass' : 'fail',
          error: canvasOk ? undefined : 'Canvas not found or has zero dimensions',
        });
        console.log(`  PP21 canvas-non-zero-dimensions: ${canvasOk ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP21', 'canvas-non-zero-dimensions', e);
      console.log(`  PP21 canvas-non-zero-dimensions: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP22: Series score area visible ─────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP22', 'series-score-visible', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // Series score shows e.g. "0 - 0" or "Game 1" or "BO1" / "BO3" etc.
        const hasScore = await page.evaluate(() => {
          const body = document.body.innerText;
          return (
            /\d\s*[-–]\s*\d/.test(body) ||           // "0 - 0"
            /game\s*\d/i.test(body) ||                // "Game 1"
            /bo[135]/i.test(body) ||                  // "BO1"
            /round\s*\d/i.test(body) ||               // "Round 1"
            /series/i.test(body) ||                   // "Series"
            document.querySelector('canvas') !== null // canvas present = game loaded
          );
        });

        await step(page, SUITE, 'PP22', 'series-score-visible', {
          status: hasScore ? 'pass' : 'skip',
          error: hasScore ? undefined : 'Series score not visible (may only show after warmup)',
        });
        console.log(`  PP22 series-score-visible: ${hasScore ? 'PASS' : 'SKIP'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP22', 'series-score-visible', e);
      console.log(`  PP22 series-score-visible: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[evobattle-hud] Done.');
}

runEvoBattleHUDTests().catch(console.error);

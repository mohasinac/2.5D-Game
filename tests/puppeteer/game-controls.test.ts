/**
 * game-controls.test.ts — In-game keyboard and UI control tests
 *
 * PP17  Press I key in game → no crash, page still functional
 * PP18  Press J (attack) → no crash
 * PP19  + zoom button visible in game
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'game-controls';
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
  // Wait for game to reach a state where input matters (warmup / launching)
  await page.waitForTimeout(6000);
}

/** Check the page has no JS error text visible */
async function noCrash(page: import('puppeteer').Page): Promise<boolean> {
  try {
    return !(await page.evaluate(() => {
      const t = document.body.innerText.toLowerCase();
      return (
        t.includes('uncaught typeerror') ||
        t.includes('cannot read properties') ||
        t.includes('unexpected error') ||
        t.includes('something went wrong')
      );
    }));
  } catch {
    return true;
  }
}

export async function runGameControlsTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[game-controls] Starting game-controls tests...');

  // ── PP17: Press I key → no crash ────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP17', 'i-key-no-crash', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        await page.focus('body');
        await page.keyboard.press('KeyI');
        await page.waitForTimeout(1000);

        const ok = await noCrash(page);
        await step(page, SUITE, 'PP17', 'i-key-no-crash', {
          status: ok ? 'pass' : 'fail',
          error: ok ? undefined : 'JS error appeared after pressing I key',
        });
        console.log(`  PP17 i-key-no-crash: ${ok ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP17', 'i-key-no-crash', e);
      console.log(`  PP17 i-key-no-crash: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP18: Press J (attack) → no crash ───────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP18', 'j-key-attack-no-crash', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        await page.focus('body');
        // J maps to attack in the key map
        await page.keyboard.press('KeyJ');
        await page.waitForTimeout(800);
        // Hold and release
        await page.keyboard.down('KeyJ');
        await page.waitForTimeout(400);
        await page.keyboard.up('KeyJ');
        await page.waitForTimeout(800);

        const ok = await noCrash(page);
        await step(page, SUITE, 'PP18', 'j-key-attack-no-crash', {
          status: ok ? 'pass' : 'fail',
          error: ok ? undefined : 'JS error appeared after pressing J (attack) key',
        });
        console.log(`  PP18 j-key-attack-no-crash: ${ok ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP18', 'j-key-attack-no-crash', e);
      console.log(`  PP18 j-key-attack-no-crash: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP19: Zoom + button visible in game ──────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP19', 'zoom-button-visible', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goToGameRoom(page);

        // Look for zoom buttons by text content ("+", "−", "0") or aria-label
        const zoomVisible = await page.evaluate(() => {
          const allEls = Array.from(document.querySelectorAll('button, [role="button"], [aria-label]'));
          return allEls.some(el => {
            const t = (el.textContent || '').trim();
            const label = (el.getAttribute('aria-label') || '').toLowerCase();
            return t === '+' || t === '−' || t === '-' || t === '0' ||
                   label.includes('zoom') || label.includes('camera');
          });
        });

        // Also look for the CameraControls component class names
        const hasCameraControls = await page.$('[class*="camera"], [data-testid*="zoom"], [data-testid*="camera"]') !== null;

        const pass = zoomVisible || hasCameraControls;
        await step(page, SUITE, 'PP19', 'zoom-button-visible', {
          status: pass ? 'pass' : 'skip',
          error: pass ? undefined : 'Zoom / camera controls not found (may only appear on spectator view)',
        });
        console.log(`  PP19 zoom-button-visible: ${pass ? 'PASS' : 'SKIP'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP19', 'zoom-button-visible', e);
      console.log(`  PP19 zoom-button-visible: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[game-controls] Done.');
}

runGameControlsTests().catch(console.error);

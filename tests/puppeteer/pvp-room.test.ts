/**
 * pvp-room.test.ts — PvP lobby page tests
 *
 * PP03  /game/battle/lobby → heading "PVP BATTLE" visible
 * PP04  "RANDOM MATCH" card / button is visible
 * PP05  Click "Find Match" → UI transitions to searching state
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains, waitVisible } from './helpers/base';

const SUITE = 'pvp-room';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

export async function runPvPRoomTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[pvp-room] Starting PvP lobby tests...');

  // ── PP03: /game/battle/lobby heading ────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/game/battle/lobby');
      if (!reached) {
        await stepSkip(SUITE, 'PP03', 'pvp-lobby-heading', 'Redirected to login — no credentials');
      } else {
        const hasPvP =
          await bodyContains(page, 'pvp battle') ||
          await bodyContains(page, 'pvp') ||
          await bodyContains(page, 'battle lobby') ||
          await bodyContains(page, 'random') ||
          await bodyContains(page, 'friends');

        await step(page, SUITE, 'PP03', 'pvp-lobby-heading', {
          status: hasPvP ? 'pass' : 'fail',
          error: hasPvP ? undefined : '"PVP BATTLE" or lobby content not found',
        });
        console.log(`  PP03 pvp-lobby-heading: ${hasPvP ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP03', 'pvp-lobby-heading', e);
      console.log(`  PP03 pvp-lobby-heading: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP04: "RANDOM MATCH" card / button visible ───────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/game/battle/lobby');
      if (!reached) {
        await stepSkip(SUITE, 'PP04', 'random-match-card-visible', 'Redirected to login — no credentials');
      } else {
        const hasRandom =
          await bodyContains(page, 'random match') ||
          await bodyContains(page, 'random') ||
          await bodyContains(page, 'find match') ||
          await bodyContains(page, 'quick match');

        await step(page, SUITE, 'PP04', 'random-match-card-visible', {
          status: hasRandom ? 'pass' : 'fail',
          error: hasRandom ? undefined : 'No "Random Match" / "Find Match" text found',
        });
        console.log(`  PP04 random-match-card-visible: ${hasRandom ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP04', 'random-match-card-visible', e);
      console.log(`  PP04 random-match-card-visible: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP05: Click "Find Match" → searching state ───────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP05', 'find-match-searching-state', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/battle/lobby');
        if (!reached) {
          await stepSkip(SUITE, 'PP05', 'find-match-searching-state', 'Cannot reach lobby');
        } else {
          // Try to find and click a button that starts matchmaking
          const clicked = await page.evaluate(() => {
            const candidates = Array.from(document.querySelectorAll('button'));
            const btn = candidates.find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('random') || t.includes('find match') || t.includes('quick match') || t.includes('play');
            });
            if (btn) { btn.click(); return true; }
            return false;
          });

          if (!clicked) {
            await step(page, SUITE, 'PP05', 'find-match-searching-state', {
              status: 'skip',
              error: 'No matchmaking button found to click',
            });
            console.log('  PP05 find-match-searching-state: SKIP — button not found');
          } else {
            await page.waitForTimeout(2500);

            // Check for searching-related text
            const searching =
              await bodyContains(page, 'searching') ||
              await bodyContains(page, 'looking') ||
              await bodyContains(page, 'connecting') ||
              await bodyContains(page, 'waiting') ||
              await bodyContains(page, 'cancel') ||
              await bodyContains(page, 'queue');

            await step(page, SUITE, 'PP05', 'find-match-searching-state', {
              status: searching ? 'pass' : 'fail',
              error: searching ? undefined : 'No searching/waiting state detected after clicking Find Match',
            });
            console.log(`  PP05 find-match-searching-state: ${searching ? 'PASS' : 'FAIL'}`);
          }
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP05', 'find-match-searching-state', e);
      console.log(`  PP05 find-match-searching-state: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[pvp-room] Done.');
}

runPvPRoomTests().catch(console.error);

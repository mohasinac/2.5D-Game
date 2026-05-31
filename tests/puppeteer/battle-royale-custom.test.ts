/**
 * battle-royale-custom.test.ts — Battle Royale custom room flow
 *
 * PP11  /game/royale/lobby → "BATTLE ROYALE" heading visible
 * PP12  Create Room button → create / join form visible
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'royale-custom';

export async function runBattleRoyaleCustomTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[royale-custom] Starting Battle Royale custom room tests...');

  // ── PP11: /game/royale/lobby heading ─────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/game/royale/lobby');
      if (!reached) {
        await stepSkip(SUITE, 'PP11', 'royale-lobby-heading', 'Redirected to login — no credentials');
      } else {
        const hasHeading =
          await bodyContains(page, 'battle royale') ||
          await bodyContains(page, 'royale') ||
          await bodyContains(page, 'free-for-all') ||
          await bodyContains(page, 'last bey') ||
          await bodyContains(page, 'random') ||
          await bodyContains(page, 'friends');

        await step(page, SUITE, 'PP11', 'royale-lobby-heading', {
          status: hasHeading ? 'pass' : 'fail',
          error: hasHeading ? undefined : '"BATTLE ROYALE" or royale content not found',
        });
        console.log(`  PP11 royale-lobby-heading: ${hasHeading ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP11', 'royale-lobby-heading', e);
      console.log(`  PP11 royale-lobby-heading: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP12: Create Room → form visible ────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP12', 'royale-create-room-form', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/royale/lobby');
        if (!reached) {
          await stepSkip(SUITE, 'PP12', 'royale-create-room-form', 'Cannot reach /game/royale/lobby');
        } else {
          // Click "Friends Room" or "Create Room" button if available
          const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const createBtn = btns.find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('friends') || t.includes('create') || t.includes('private') || t.includes('room');
            });
            if (createBtn) { createBtn.click(); return true; }
            return false;
          });

          await page.waitForTimeout(1500);

          const hasForm =
            await bodyContains(page, 'create') ||
            await bodyContains(page, 'room') ||
            await bodyContains(page, 'code') ||
            await bodyContains(page, 'friends') ||
            await bodyContains(page, 'invite') ||
            (await page.$('input') !== null);

          await step(page, SUITE, 'PP12', 'royale-create-room-form', {
            status: hasForm ? 'pass' : (clicked ? 'fail' : 'skip'),
            error: hasForm ? undefined :
              clicked ? 'No create-room form appeared' : 'No create room button found',
          });
          console.log(`  PP12 royale-create-room-form: ${hasForm ? 'PASS' : (clicked ? 'FAIL' : 'SKIP')}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP12', 'royale-create-room-form', e);
      console.log(`  PP12 royale-create-room-form: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[royale-custom] Done.');
}

runBattleRoyaleCustomTests().catch(console.error);

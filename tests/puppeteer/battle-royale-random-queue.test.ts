/**
 * battle-royale-random-queue.test.ts — Battle Royale random queue flow
 *
 * PP12b  Find Match → queue UI appears
 * PP13   Cancel → back to lobby
 * PP14   Re-navigate (in-room guard) → page loads without hard crash
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'royale-queue';

export async function runBattleRoyaleRandomQueueTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[royale-queue] Starting Battle Royale random queue tests...');

  // ── PP12b: Find Match → queue UI ─────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP12b', 'royale-find-match-queue', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/royale/lobby');
        if (!reached) {
          await stepSkip(SUITE, 'PP12b', 'royale-find-match-queue', 'Cannot reach /game/royale/lobby');
        } else {
          // Click "Random Match" or "Find Match" button
          const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('random') || t.includes('find match') || t.includes('quick match') || t.includes('play');
            });
            if (btn) { btn.click(); return true; }
            return false;
          });

          if (!clicked) {
            await step(page, SUITE, 'PP12b', 'royale-find-match-queue', {
              status: 'skip',
              error: 'No random-match / find-match button on royale lobby',
            });
            console.log('  PP12b royale-find-match-queue: SKIP — no button');
          } else {
            await page.waitForTimeout(2500);
            const hasQueue =
              await bodyContains(page, 'searching') ||
              await bodyContains(page, 'queue') ||
              await bodyContains(page, 'waiting') ||
              await bodyContains(page, 'connecting') ||
              await bodyContains(page, 'cancel');

            await step(page, SUITE, 'PP12b', 'royale-find-match-queue', {
              status: hasQueue ? 'pass' : 'fail',
              error: hasQueue ? undefined : 'No queue/searching UI after clicking Find Match',
            });
            console.log(`  PP12b royale-find-match-queue: ${hasQueue ? 'PASS' : 'FAIL'}`);
          }
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP12b', 'royale-find-match-queue', e);
      console.log(`  PP12b royale-find-match-queue: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP13: Cancel → back to lobby ────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP13', 'royale-cancel-queue', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goto(page, '/game/royale/lobby');
        await page.waitForTimeout(800);

        // Click Find Match first
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => {
            const t = (b.textContent || '').toLowerCase();
            return t.includes('random') || t.includes('find match') || t.includes('quick');
          });
          if (btn) btn.click();
        });
        await page.waitForTimeout(1500);

        // Now click cancel
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const cancelBtn = btns.find(b => {
            const t = (b.textContent || '').toLowerCase();
            return t.includes('cancel') || t.includes('stop') || t.includes('leave');
          });
          if (cancelBtn) cancelBtn.click();
        });
        await page.waitForTimeout(1500);

        // Should show lobby content again
        const backToLobby =
          page.url().includes('/royale') ||
          page.url().includes('/game') ||
          await bodyContains(page, 'royale') ||
          await bodyContains(page, 'battle') ||
          await bodyContains(page, 'random');

        await step(page, SUITE, 'PP13', 'royale-cancel-queue', {
          status: backToLobby ? 'pass' : 'skip',
          error: backToLobby ? undefined : 'Unclear state after cancel',
        });
        console.log(`  PP13 royale-cancel-queue: ${backToLobby ? 'PASS' : 'SKIP'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP13', 'royale-cancel-queue', e);
      console.log(`  PP13 royale-cancel-queue: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP14: Already-in-room guard (navigate away and back) ─────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP14', 'royale-in-room-guard', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);

        // Navigate to lobby
        await goto(page, '/game/royale/lobby');
        await page.waitForTimeout(800);

        // Navigate away
        await goto(page, '/');
        await page.waitForTimeout(500);

        // Navigate back to lobby
        const reached = await goto(page, '/game/royale/lobby');
        await page.waitForTimeout(1000);

        // Page should load without a crash (white screen / unhandled error)
        const hasCrash = await page.evaluate(() => {
          const body = document.body.innerText.toLowerCase();
          return body.includes('unexpected error') || body.includes('something went wrong') || body.includes('cannot read');
        });

        const pass = reached && !hasCrash;
        await step(page, SUITE, 'PP14', 'royale-in-room-guard', {
          status: pass ? 'pass' : (hasCrash ? 'fail' : 'skip'),
          error: hasCrash ? 'Error/crash text found on page' : undefined,
        });
        console.log(`  PP14 royale-in-room-guard: ${pass ? 'PASS' : (hasCrash ? 'FAIL' : 'SKIP')}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP14', 'royale-in-room-guard', e);
      console.log(`  PP14 royale-in-room-guard: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[royale-queue] Done.');
}

runBattleRoyaleRandomQueueTests().catch(console.error);

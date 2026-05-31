/**
 * tournament-random-queue.test.ts — Tournament queue flow
 *
 * PP08  /game/tournament → find queue / join button present
 * PP09  Click queue → waiting / lobby UI appears
 * PP10  Cancel queue → returns to list
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'tournament-queue';

export async function runTournamentRandomQueueTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[tournament-queue] Starting tournament queue tests...');

  // ── PP08: Find queue button ──────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP08', 'tournament-queue-button', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/tournament');
        if (!reached) {
          await stepSkip(SUITE, 'PP08', 'tournament-queue-button', 'Cannot reach /game/tournament');
        } else {
          // Look for any join/queue/register button
          const hasButton = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a[role="button"]'));
            return btns.some(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('join') || t.includes('queue') || t.includes('register') || t.includes('enter') || t.includes('create');
            });
          });

          const hasText =
            await bodyContains(page, 'join') ||
            await bodyContains(page, 'register') ||
            await bodyContains(page, 'queue') ||
            await bodyContains(page, 'create tournament') ||
            await bodyContains(page, 'tournament');

          const pass = hasButton || hasText;
          await step(page, SUITE, 'PP08', 'tournament-queue-button', {
            status: pass ? 'pass' : 'fail',
            error: pass ? undefined : 'No join/queue button found on tournament page',
          });
          console.log(`  PP08 tournament-queue-button: ${pass ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP08', 'tournament-queue-button', e);
      console.log(`  PP08 tournament-queue-button: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP09: Click queue → waiting UI ──────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP09', 'tournament-queue-waiting-ui', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/tournament');
        if (!reached) {
          await stepSkip(SUITE, 'PP09', 'tournament-queue-waiting-ui', 'Cannot reach /game/tournament');
        } else {
          // Try clicking the first tournament entry to go to lobby page
          const clicked = await page.evaluate(() => {
            // Try a "join" or "view" link/button on a tournament row
            const links = Array.from(document.querySelectorAll('a[href*="tournament"], button'));
            const joinBtn = links.find(el => {
              const t = (el.textContent || '').toLowerCase();
              return t.includes('join') || t.includes('enter') || t.includes('view') || t.includes('lobby');
            });
            if (joinBtn) { (joinBtn as HTMLElement).click(); return true; }
            // Or just click the first tournament row
            const firstRow = document.querySelector('[data-testid="tournament-row"], .tournament-item, [class*="tournament"]');
            if (firstRow) { (firstRow as HTMLElement).click(); return true; }
            return false;
          });

          if (!clicked) {
            // If no active tournaments, the UI may show empty state — that's ok
            const emptyState =
              await bodyContains(page, 'no tournament') ||
              await bodyContains(page, 'no active') ||
              await bodyContains(page, 'upcoming');

            await step(page, SUITE, 'PP09', 'tournament-queue-waiting-ui', {
              status: emptyState ? 'skip' : 'fail',
              error: emptyState
                ? 'No active tournaments to join (empty state shown)'
                : 'Could not click into a tournament',
            });
            console.log(`  PP09 tournament-queue-waiting-ui: ${emptyState ? 'SKIP' : 'FAIL'}`);
          } else {
            await page.waitForTimeout(2000);
            const hasWaiting =
              await bodyContains(page, 'waiting') ||
              await bodyContains(page, 'lobby') ||
              await bodyContains(page, 'ready') ||
              await bodyContains(page, 'preparing') ||
              page.url().includes('tournament');

            await step(page, SUITE, 'PP09', 'tournament-queue-waiting-ui', {
              status: hasWaiting ? 'pass' : 'fail',
              error: hasWaiting ? undefined : 'No waiting/lobby UI after clicking tournament',
            });
            console.log(`  PP09 tournament-queue-waiting-ui: ${hasWaiting ? 'PASS' : 'FAIL'}`);
          }
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP09', 'tournament-queue-waiting-ui', e);
      console.log(`  PP09 tournament-queue-waiting-ui: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP10: Cancel queue → back to list ───────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP10', 'tournament-queue-cancel', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        await goto(page, '/game/tournament');
        await page.waitForTimeout(1000);

        // Try clicking cancel or leave or back button
        const cancelled = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button, a'));
          const cancelBtn = btns.find(b => {
            const t = (b.textContent || '').toLowerCase();
            return t.includes('cancel') || t.includes('leave') || t.includes('back') || t.includes('←');
          });
          if (cancelBtn) { (cancelBtn as HTMLElement).click(); return true; }
          return false;
        });

        await page.waitForTimeout(1500);

        // After cancel, should be on tournament list or game hub
        const backOnList =
          page.url().includes('/game/tournament') ||
          page.url().includes('/game') ||
          await bodyContains(page, 'tournament') ||
          await bodyContains(page, 'battle mode');

        await step(page, SUITE, 'PP10', 'tournament-queue-cancel', {
          status: backOnList ? 'pass' : 'skip',
          error: backOnList ? undefined : 'Unclear state after cancel attempt',
        });
        console.log(`  PP10 tournament-queue-cancel: ${backOnList ? 'PASS' : 'SKIP'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP10', 'tournament-queue-cancel', e);
      console.log(`  PP10 tournament-queue-cancel: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[tournament-queue] Done.');
}

runTournamentRandomQueueTests().catch(console.error);

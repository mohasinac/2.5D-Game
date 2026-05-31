/**
 * tournament.test.ts — Tournament pages
 *
 * PP06  /game/tournament → tournament list page loads
 * PP07  /admin/tournaments → admin tournament list loads (admin credentials required)
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'tournament';

export async function runTournamentTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[tournament] Starting tournament page tests...');

  // ── PP06: /game/tournament → list loads ─────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/game/tournament');
      if (!reached) {
        await stepSkip(SUITE, 'PP06', 'tournament-list-loads', 'Redirected to login — no credentials');
      } else {
        const hasContent =
          await bodyContains(page, 'tournament') ||
          await bodyContains(page, 'bracket') ||
          await bodyContains(page, 'registration') ||
          await bodyContains(page, 'no tournament') ||
          await bodyContains(page, 'active');

        await step(page, SUITE, 'PP06', 'tournament-list-loads', {
          status: hasContent ? 'pass' : 'fail',
          error: hasContent ? undefined : 'Tournament list page content not found',
        });
        console.log(`  PP06 tournament-list-loads: ${hasContent ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP06', 'tournament-list-loads', e);
      console.log(`  PP06 tournament-list-loads: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP07: /admin/tournaments → admin list ────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP07', 'admin-tournament-list-loads', 'ADMIN_EMAIL / ADMIN_PASSWORD not set');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/tournaments');

        if (!reached) {
          await stepSkip(SUITE, 'PP07', 'admin-tournament-list-loads', 'Cannot reach /admin/tournaments (auth or role issue)');
        } else {
          const hasContent =
            await bodyContains(page, 'tournament') ||
            await bodyContains(page, 'create') ||
            await bodyContains(page, 'admin') ||
            await bodyContains(page, 'bracket');

          await step(page, SUITE, 'PP07', 'admin-tournament-list-loads', {
            status: hasContent ? 'pass' : 'fail',
            error: hasContent ? undefined : 'Admin tournament list content not found',
          });
          console.log(`  PP07 admin-tournament-list-loads: ${hasContent ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP07', 'admin-tournament-list-loads', e);
      console.log(`  PP07 admin-tournament-list-loads: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[tournament] Done.');
}

runTournamentTests().catch(console.error);

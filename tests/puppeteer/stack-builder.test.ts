/**
 * stack-builder.test.ts — Stack Builder page
 *
 * PP34  /builder → page loads (canvas or part selector visible)
 * PP35  Mobile viewport (390px) → page loads without hard crash
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'stack-builder';

export async function runStackBuilderTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[stack-builder] Starting Stack Builder tests...');

  // ── PP34: /builder → page loads ──────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/builder');
      if (!reached) {
        await stepSkip(SUITE, 'PP34', 'stack-builder-loads', 'Redirected to login — no credentials');
      } else {
        // Accept any of: canvas, part selector, slot UI, or page title
        const hasCanvas = await page.$('canvas') !== null;
        const hasContent =
          hasCanvas ||
          await bodyContains(page, 'stack') ||
          await bodyContains(page, 'builder') ||
          await bodyContains(page, 'beyblade') ||
          await bodyContains(page, 'part') ||
          await bodyContains(page, 'slot') ||
          await bodyContains(page, 'attack ring') ||
          await bodyContains(page, 'weight disk') ||
          await bodyContains(page, 'tip');

        await step(page, SUITE, 'PP34', 'stack-builder-loads', {
          status: hasContent ? 'pass' : 'fail',
          error: hasContent ? undefined : 'Stack Builder page has no recognisable content',
        });
        console.log(`  PP34 stack-builder-loads: ${hasContent ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP34', 'stack-builder-loads', e);
      console.log(`  PP34 stack-builder-loads: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP35: Mobile viewport (390×844) → no crash ───────────────────────────────
  {
    const page = await newPage({ width: 390, height: 844 }); // iPhone 14 Pro
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/builder');

      const hasCrash = await page.evaluate(() => {
        const t = document.body.innerText.toLowerCase();
        return (
          t.includes('uncaught typeerror') ||
          t.includes('cannot read properties') ||
          t.includes('unexpected error') ||
          t.includes('something went wrong')
        );
      });

      // Page should either show content or redirect gracefully — just not crash
      const pass = !hasCrash;
      await step(page, SUITE, 'PP35', 'stack-builder-mobile-no-crash', {
        status: pass ? 'pass' : 'fail',
        error: hasCrash ? 'JS crash on 390px viewport' : undefined,
      });
      console.log(`  PP35 stack-builder-mobile-no-crash: ${pass ? 'PASS' : 'FAIL'}`);
    } catch (e) {
      await stepFail(page, SUITE, 'PP35', 'stack-builder-mobile-no-crash', e);
      console.log(`  PP35 stack-builder-mobile-no-crash: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[stack-builder] Done.');
}

runStackBuilderTests().catch(console.error);

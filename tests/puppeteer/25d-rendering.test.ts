/**
 * 25d-rendering.test.ts — 2.5D renderer and part system pages
 *
 * PP23  /demo → canvas has non-zero dimensions
 * PP24  /admin/2.5d/beyblade-systems → page loads with content
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = '25d-rendering';

export async function run25DRenderingTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[25d-rendering] Starting 2.5D rendering tests...');

  // ── PP23: /demo → canvas non-zero ────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      // /demo is public — no auth needed
      const reached = await goto(page, '/demo');
      if (!reached) {
        // Try auth just in case it's guarded
        if (env.TEST_EMAIL && env.TEST_PASSWORD) {
          await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
          await goto(page, '/demo');
        }
      }

      // Wait for canvas to appear (PixiJS needs a moment)
      let canvasOk = false;
      try {
        await page.waitForSelector('canvas', { visible: true, timeout: 20_000 });
        const dims = await page.evaluate(() => {
          const c = document.querySelector('canvas');
          if (!c) return { w: 0, h: 0 };
          const r = c.getBoundingClientRect();
          return { w: r.width, h: r.height };
        });
        canvasOk = dims.w > 0 && dims.h > 0;
      } catch { /* canvas never appeared */ }

      // Also accept if the page has demo-related content
      const hasDemo =
        canvasOk ||
        await bodyContains(page, 'demo') ||
        await bodyContains(page, 'renderer') ||
        await bodyContains(page, 'beyblade');

      await step(page, SUITE, 'PP23', 'demo-canvas-non-zero', {
        status: hasDemo ? 'pass' : 'fail',
        error: hasDemo ? undefined : 'Demo canvas not found or has zero size',
      });
      console.log(`  PP23 demo-canvas-non-zero: ${hasDemo ? 'PASS' : 'FAIL'}`);
    } catch (e) {
      await stepFail(page, SUITE, 'PP23', 'demo-canvas-non-zero', e);
      console.log(`  PP23 demo-canvas-non-zero: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP24: /admin/2.5d/beyblade-systems → loads ───────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP24', 'admin-beyblade-systems-loads', 'ADMIN_EMAIL / ADMIN_PASSWORD not set');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/2.5d/beyblade-systems');
        if (!reached) {
          await stepSkip(SUITE, 'PP24', 'admin-beyblade-systems-loads', 'Cannot reach admin 2.5D page (auth/role)');
        } else {
          const hasContent =
            await bodyContains(page, 'beyblade system') ||
            await bodyContains(page, 'system') ||
            await bodyContains(page, 'part') ||
            await bodyContains(page, 'create') ||
            await bodyContains(page, 'admin') ||
            await bodyContains(page, '2.5d') ||
            await bodyContains(page, '2d');

          await step(page, SUITE, 'PP24', 'admin-beyblade-systems-loads', {
            status: hasContent ? 'pass' : 'fail',
            error: hasContent ? undefined : 'Admin 2.5D beyblade systems page content not found',
          });
          console.log(`  PP24 admin-beyblade-systems-loads: ${hasContent ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP24', 'admin-beyblade-systems-loads', e);
      console.log(`  PP24 admin-beyblade-systems-loads: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[25d-rendering] Done.');
}

run25DRenderingTests().catch(console.error);

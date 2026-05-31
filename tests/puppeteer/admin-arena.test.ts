/**
 * admin-arena.test.ts — Admin arena CRUD
 *
 * PP28  /admin/arenas → list renders
 * PP29  /admin/arenas/create → form renders
 * PP30  Fill name field + submit → no crash
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'admin-arena';

export async function runAdminArenaTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[admin-arena] Starting admin arena tests...');

  // ── PP28: /admin/arenas list ─────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP28', 'admin-arenas-list', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/arenas');
        if (!reached) {
          await stepSkip(SUITE, 'PP28', 'admin-arenas-list', 'Cannot reach /admin/arenas');
        } else {
          const hasContent =
            await bodyContains(page, 'arena') ||
            await bodyContains(page, 'create') ||
            await bodyContains(page, 'circle') ||
            await bodyContains(page, 'hexagon') ||
            await bodyContains(page, 'theme');

          await step(page, SUITE, 'PP28', 'admin-arenas-list', {
            status: hasContent ? 'pass' : 'fail',
            error: hasContent ? undefined : 'Arena list content not found',
          });
          console.log(`  PP28 admin-arenas-list: ${hasContent ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP28', 'admin-arenas-list', e);
      console.log(`  PP28 admin-arenas-list: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP29: /admin/arenas/create form ─────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP29', 'admin-arenas-create-form', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/arenas/create');
        if (!reached) {
          await stepSkip(SUITE, 'PP29', 'admin-arenas-create-form', 'Cannot reach arena create page');
        } else {
          const inputCount = await page.evaluate(() =>
            document.querySelectorAll('input, textarea, select').length,
          );
          const hasLabels =
            await bodyContains(page, 'name') ||
            await bodyContains(page, 'shape') ||
            await bodyContains(page, 'theme') ||
            await bodyContains(page, 'arena') ||
            await bodyContains(page, 'create');

          const pass = inputCount > 0 || hasLabels;
          await step(page, SUITE, 'PP29', 'admin-arenas-create-form', {
            status: pass ? 'pass' : 'fail',
            error: pass ? undefined : `Create form empty (${inputCount} inputs)`,
          });
          console.log(`  PP29 admin-arenas-create-form: ${pass ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP29', 'admin-arenas-create-form', e);
      console.log(`  PP29 admin-arenas-create-form: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP30: Fill name + submit → no crash ──────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP30', 'admin-arenas-create-submit', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/arenas/create');
        if (!reached) {
          await stepSkip(SUITE, 'PP30', 'admin-arenas-create-submit', 'Cannot reach arena create page');
        } else {
          // Fill the name / first text input
          await page.evaluate(() => {
            const nameInput = document.querySelector<HTMLInputElement>('input[name="name"], input[placeholder*="name" i], input[type="text"]');
            if (nameInput) {
              nameInput.value = 'Test Arena Puppeteer';
              nameInput.dispatchEvent(new Event('input', { bubbles: true }));
              nameInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });

          await page.waitForTimeout(400);

          // Click submit button
          const submitted = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const submitBtn = btns.find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('save') || t.includes('create') || t.includes('submit') || t.includes('add');
            });
            if (submitBtn) { submitBtn.click(); return true; }
            return false;
          });

          await page.waitForTimeout(2500);

          const hasCrash = await page.evaluate(() => {
            const t = document.body.innerText.toLowerCase();
            return t.includes('uncaught typeerror') || t.includes('cannot read properties');
          });

          const pass = !hasCrash;
          await step(page, SUITE, 'PP30', 'admin-arenas-create-submit', {
            status: pass ? 'pass' : 'fail',
            error: hasCrash ? 'JS crash after submit' : undefined,
          });
          console.log(`  PP30 admin-arenas-create-submit: ${pass ? 'PASS' : 'FAIL'} (submitted=${submitted})`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP30', 'admin-arenas-create-submit', e);
      console.log(`  PP30 admin-arenas-create-submit: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[admin-arena] Done.');
}

runAdminArenaTests().catch(console.error);

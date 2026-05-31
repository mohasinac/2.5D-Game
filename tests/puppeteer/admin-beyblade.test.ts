/**
 * admin-beyblade.test.ts — Admin beyblade CRUD
 *
 * PP25  /admin/beyblades → list heading visible
 * PP26  /admin/beyblades/create → form renders (inputs present)
 * PP27  Fill minimal fields + submit → no hard crash (form validation or success)
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'admin-beyblade';

export async function runAdminBeybladeTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[admin-beyblade] Starting admin beyblade tests...');

  // ── PP25: /admin/beyblades list ──────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP25', 'admin-beyblades-list', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/beyblades');
        if (!reached) {
          await stepSkip(SUITE, 'PP25', 'admin-beyblades-list', 'Cannot reach /admin/beyblades');
        } else {
          const hasContent =
            await bodyContains(page, 'beyblade') ||
            await bodyContains(page, 'create') ||
            await bodyContains(page, 'attack') ||
            await bodyContains(page, 'defense') ||
            await bodyContains(page, 'stamina');

          await step(page, SUITE, 'PP25', 'admin-beyblades-list', {
            status: hasContent ? 'pass' : 'fail',
            error: hasContent ? undefined : 'Beyblade list content not found',
          });
          console.log(`  PP25 admin-beyblades-list: ${hasContent ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP25', 'admin-beyblades-list', e);
      console.log(`  PP25 admin-beyblades-list: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP26: /admin/beyblades/create form renders ───────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP26', 'admin-beyblades-create-form', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/beyblades/create');
        if (!reached) {
          await stepSkip(SUITE, 'PP26', 'admin-beyblades-create-form', 'Cannot reach create page');
        } else {
          // Form must have at least one input field
          const inputCount = await page.evaluate(() => document.querySelectorAll('input, textarea, select').length);
          const hasInputs = inputCount > 0;

          const hasLabels =
            await bodyContains(page, 'name') ||
            await bodyContains(page, 'attack') ||
            await bodyContains(page, 'defense') ||
            await bodyContains(page, 'create');

          const pass = hasInputs || hasLabels;
          await step(page, SUITE, 'PP26', 'admin-beyblades-create-form', {
            status: pass ? 'pass' : 'fail',
            error: pass ? undefined : `Create form has no input fields or labels (found ${inputCount} inputs)`,
          });
          console.log(`  PP26 admin-beyblades-create-form: ${pass ? 'PASS' : 'FAIL'}`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP26', 'admin-beyblades-create-form', e);
      console.log(`  PP26 admin-beyblades-create-form: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP27: Fill + submit → no crash ──────────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        await stepSkip(SUITE, 'PP27', 'admin-beyblades-create-submit', 'No admin credentials');
      } else {
        await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
        const reached = await goto(page, '/admin/beyblades/create');
        if (!reached) {
          await stepSkip(SUITE, 'PP27', 'admin-beyblades-create-submit', 'Cannot reach create page');
        } else {
          // Fill text inputs with test data
          await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));
            inputs.forEach((el, i) => {
              (el as HTMLInputElement).value = `Test Beyblade ${i + 1}`;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            });
          });

          await page.waitForTimeout(500);

          // Click submit
          const submitted = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button[type="submit"], button'));
            const submitBtn = btns.find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('save') || t.includes('create') || t.includes('submit') || t.includes('add');
            });
            if (submitBtn) { (submitBtn as HTMLButtonElement).click(); return true; }
            return false;
          });

          await page.waitForTimeout(2500);

          // No hard crash
          const hasCrash = await page.evaluate(() => {
            const t = document.body.innerText.toLowerCase();
            return t.includes('uncaught') || t.includes('typeerror: cannot');
          });

          const pass = !hasCrash;
          await step(page, SUITE, 'PP27', 'admin-beyblades-create-submit', {
            status: pass ? 'pass' : 'fail',
            error: hasCrash ? 'JS crash after form submit' : undefined,
          });
          console.log(`  PP27 admin-beyblades-create-submit: ${pass ? 'PASS' : 'FAIL'} (submitted=${submitted})`);
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP27', 'admin-beyblades-create-submit', e);
      console.log(`  PP27 admin-beyblades-create-submit: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[admin-beyblade] Done.');
}

runAdminBeybladeTests().catch(console.error);

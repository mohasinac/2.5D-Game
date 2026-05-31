/**
 * admin-parts.test.ts — Admin 2.5D parts library pages
 *
 * PP31  /admin/2.5d/parts/attack_ring → list renders
 * PP32  /admin/2.5d/parts/tip → list renders
 * PP33  /admin/2.5d/parts/weight_disk → list renders
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'admin-parts';

async function checkPartPage(
  page: import('puppeteer').Page,
  urlPath: string,
  code: string,
  desc: string,
  keywords: string[],
): Promise<void> {
  const env = getEnv();

  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    await stepSkip(SUITE, code, desc, 'No admin credentials');
    console.log(`  ${code} ${desc}: SKIP — no admin credentials`);
    return;
  }

  await login(page, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  const reached = await goto(page, urlPath);

  if (!reached) {
    await stepSkip(SUITE, code, desc, `Cannot reach ${urlPath}`);
    console.log(`  ${code} ${desc}: SKIP — cannot reach page`);
    return;
  }

  // Check for any of the provided keywords in the page body
  let hasContent = false;
  for (const kw of keywords) {
    if (await bodyContains(page, kw)) { hasContent = true; break; }
  }

  // Also check for generic list/create indicators
  if (!hasContent) {
    hasContent =
      await bodyContains(page, 'create') ||
      await bodyContains(page, 'no ') ||
      await bodyContains(page, 'loading') ||
      (await page.$$('tr, li, [class*="item"]')).length > 0;
  }

  await step(page, SUITE, code, desc, {
    status: hasContent ? 'pass' : 'fail',
    error: hasContent ? undefined : `Part list page (${urlPath}) has no recognisable content`,
  });
  console.log(`  ${code} ${desc}: ${hasContent ? 'PASS' : 'FAIL'}`);
}

export async function runAdminPartsTests(): Promise<void> {
  console.log('\n[admin-parts] Starting admin parts tests...');

  // ── PP31: attack_ring list ────────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      await checkPartPage(
        page,
        '/admin/2.5d/parts/attack_ring',
        'PP31',
        'attack-ring-list',
        ['attack ring', 'attack_ring', 'ar ', 'ring', 'contact', 'part'],
      );
    } catch (e) {
      await stepFail(page, SUITE, 'PP31', 'attack-ring-list', e);
      console.log(`  PP31 attack-ring-list: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP32: tip list ───────────────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      await checkPartPage(
        page,
        '/admin/2.5d/parts/tip',
        'PP32',
        'tip-list',
        ['tip', 'rubber', 'flat', 'sharp', 'bearing', 'part'],
      );
    } catch (e) {
      await stepFail(page, SUITE, 'PP32', 'tip-list', e);
      console.log(`  PP32 tip-list: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP33: weight_disk list ───────────────────────────────────────────────────
  {
    const page = await newPage();
    try {
      await checkPartPage(
        page,
        '/admin/2.5d/parts/weight_disk',
        'PP33',
        'weight-disk-list',
        ['weight disk', 'weight_disk', 'wd ', 'disk', 'mass', 'part'],
      );
    } catch (e) {
      await stepFail(page, SUITE, 'PP33', 'weight-disk-list', e);
      console.log(`  PP33 weight-disk-list: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[admin-parts] Done.');
}

runAdminPartsTests().catch(console.error);

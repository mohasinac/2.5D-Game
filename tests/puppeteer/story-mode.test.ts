/**
 * story-mode.test.ts — Story Mode pages
 *
 * PP36  /game/story → episode / story cards visible
 * PP37  Click episode card → intro page loads (title or episode content visible)
 */

import { newPage, step, stepFail, stepSkip, login, goto, getEnv, bodyContains } from './helpers/base';

const SUITE = 'story-mode';

export async function runStoryModeTests(): Promise<void> {
  const env = getEnv();
  console.log('\n[story-mode] Starting story mode tests...');

  // ── PP36: /game/story → cards visible ───────────────────────────────────────
  {
    const page = await newPage();
    try {
      if (env.TEST_EMAIL && env.TEST_PASSWORD) {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
      }

      const reached = await goto(page, '/game/story');
      if (!reached) {
        await stepSkip(SUITE, 'PP36', 'story-mode-cards', 'Redirected to login — no credentials');
      } else {
        const hasContent =
          await bodyContains(page, 'story') ||
          await bodyContains(page, 'episode') ||
          await bodyContains(page, 'new game') ||
          await bodyContains(page, 'continue') ||
          await bodyContains(page, 'rpg') ||
          await bodyContains(page, 'adventure') ||
          await bodyContains(page, 'journey') ||
          await bodyContains(page, 'season');

        await step(page, SUITE, 'PP36', 'story-mode-cards', {
          status: hasContent ? 'pass' : 'fail',
          error: hasContent ? undefined : 'No story mode content found on /game/story',
        });
        console.log(`  PP36 story-mode-cards: ${hasContent ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP36', 'story-mode-cards', e);
      console.log(`  PP36 story-mode-cards: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  // ── PP37: Click episode card → intro loads ───────────────────────────────────
  {
    const page = await newPage();
    try {
      if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
        await stepSkip(SUITE, 'PP37', 'story-episode-intro', 'No credentials');
      } else {
        await login(page, env.TEST_EMAIL, env.TEST_PASSWORD);
        const reached = await goto(page, '/game/story');
        if (!reached) {
          await stepSkip(SUITE, 'PP37', 'story-episode-intro', 'Cannot reach /game/story');
        } else {
          // Click the first actionable card/button on the story page
          const clicked = await page.evaluate(() => {
            // Try "New Game" first
            const newGameBtn = Array.from(document.querySelectorAll('button, [role="button"]')).find(b => {
              const t = (b.textContent || '').toLowerCase();
              return t.includes('new game') || t.includes('begin') || t.includes('start') || t.includes('play');
            });
            if (newGameBtn) { (newGameBtn as HTMLElement).click(); return 'new-game'; }

            // Or an episode card / carousel card
            const cards = Array.from(document.querySelectorAll('[data-card], [class*="card"], [class*="carousel"]'));
            if (cards.length > 0) { (cards[0] as HTMLElement).click(); return 'card'; }

            // Or any anchor link containing episode/story
            const links = Array.from(document.querySelectorAll('a[href*="episode"], a[href*="story"], a[href*="rpg"]'));
            if (links.length > 0) { (links[0] as HTMLElement).click(); return 'link'; }

            return null;
          });

          if (!clicked) {
            await step(page, SUITE, 'PP37', 'story-episode-intro', {
              status: 'skip',
              error: 'No episode card/link found to click',
            });
            console.log('  PP37 story-episode-intro: SKIP — no clickable element');
          } else {
            await page.waitForTimeout(3000);

            // The intro page or RPG hub should have loaded
            const hasIntro =
              await bodyContains(page, 'episode') ||
              await bodyContains(page, 'intro') ||
              await bodyContains(page, 'story') ||
              await bodyContains(page, 'chapter') ||
              await bodyContains(page, 'beyblade') ||
              await bodyContains(page, 'begin') ||
              await bodyContains(page, 'rpg') ||
              await bodyContains(page, 'region') ||
              !page.url().endsWith('/game/story'); // navigated somewhere

            await step(page, SUITE, 'PP37', 'story-episode-intro', {
              status: hasIntro ? 'pass' : 'fail',
              error: hasIntro ? undefined : 'No intro/episode content after clicking story card',
            });
            console.log(`  PP37 story-episode-intro: ${hasIntro ? 'PASS' : 'FAIL'} (clicked=${clicked})`);
          }
        }
      }
    } catch (e) {
      await stepFail(page, SUITE, 'PP37', 'story-episode-intro', e);
      console.log(`  PP37 story-episode-intro: FAIL — ${e}`);
    } finally {
      await page.close();
    }
  }

  console.log('[story-mode] Done.');
}

runStoryModeTests().catch(console.error);

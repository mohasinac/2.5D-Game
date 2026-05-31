/**
 * runner.ts — Puppeteer test runner
 *
 * Imports and runs all test suites sequentially, then writes a JSON results
 * file to tests/reports/puppeteer-results.json.
 *
 * Usage:
 *   ts-node --project tsconfig.json tests/puppeteer/runner.ts
 *
 * Environment variables (all optional):
 *   BASE_URL        — default http://localhost:3001
 *   TEST_EMAIL      — player account email
 *   TEST_PASSWORD   — player account password
 *   TEST2_EMAIL     — second player account
 *   TEST2_PASSWORD
 *   ADMIN_EMAIL     — admin account email  (falls back to TEST_EMAIL)
 *   ADMIN_PASSWORD  — admin account password (falls back to TEST_PASSWORD)
 */

import * as fs from 'fs';
import * as path from 'path';
import { closeBrowser, stepResults } from './helpers/base';

// ── Suite runner functions ────────────────────────────────────────────────────

import { runAuthTests }                      from './auth.test';
import { runPvAITests }                      from './pvai.test';
import { runPvPRoomTests }                   from './pvp-room.test';
import { runTournamentTests }                from './tournament.test';
import { runTournamentRandomQueueTests }     from './tournament-random-queue.test';
import { runBattleRoyaleCustomTests }        from './battle-royale-custom.test';
import { runBattleRoyaleRandomQueueTests }   from './battle-royale-random-queue.test';
import { runLaunchQTETests }                 from './launch-qte.test';
import { runGameControlsTests }              from './game-controls.test';
import { runEvoBattleHUDTests }              from './evobattle-hud.test';
import { run25DRenderingTests }              from './25d-rendering.test';
import { runAdminBeybladeTests }             from './admin-beyblade.test';
import { runAdminArenaTests }                from './admin-arena.test';
import { runAdminPartsTests }                from './admin-parts.test';
import { runStackBuilderTests }              from './stack-builder.test';
import { runStoryModeTests }                 from './story-mode.test';

// ── Suite registry ────────────────────────────────────────────────────────────

interface Suite {
  name: string;
  run: () => Promise<void>;
}

const SUITES: Suite[] = [
  { name: 'auth',              run: runAuthTests },
  { name: 'pvai',              run: runPvAITests },
  { name: 'pvp-room',          run: runPvPRoomTests },
  { name: 'tournament',        run: runTournamentTests },
  { name: 'tournament-queue',  run: runTournamentRandomQueueTests },
  { name: 'royale-custom',     run: runBattleRoyaleCustomTests },
  { name: 'royale-queue',      run: runBattleRoyaleRandomQueueTests },
  { name: 'launch-qte',        run: runLaunchQTETests },
  { name: 'game-controls',     run: runGameControlsTests },
  { name: 'evobattle-hud',     run: runEvoBattleHUDTests },
  { name: '25d-rendering',     run: run25DRenderingTests },
  { name: 'admin-beyblade',    run: runAdminBeybladeTests },
  { name: 'admin-arena',       run: runAdminArenaTests },
  { name: 'admin-parts',       run: runAdminPartsTests },
  { name: 'stack-builder',     run: runStackBuilderTests },
  { name: 'story-mode',        run: runStoryModeTests },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  console.log('='.repeat(60));
  console.log('  Beyblade Game — Puppeteer Test Suite');
  console.log('  BASE_URL:', process.env.BASE_URL || 'http://localhost:3001');
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    for (const suite of SUITES) {
      try {
        await suite.run();
      } catch (e) {
        console.error(`\n[runner] Suite "${suite.name}" threw an unhandled error:`, e);
        // Record a failure step so the report reflects the suite crash
        stepResults.push({
          suite: suite.name,
          code: 'ERR',
          desc: 'suite-unhandled-error',
          screenshotPath: '',
          status: 'fail',
          error: String(e),
        });
      }
    }
  } finally {
    await closeBrowser();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const passed  = stepResults.filter(r => r.status === 'pass').length;
    const failed  = stepResults.filter(r => r.status === 'fail').length;
    const skipped = stepResults.filter(r => r.status === 'skip').length;
    const total   = stepResults.length;

    // Write JSON results
    const outDir = path.resolve('tests/reports');
    fs.mkdirSync(outDir, { recursive: true });
    const resultsPath = path.join(outDir, 'puppeteer-results.json');
    fs.writeFileSync(
      resultsPath,
      JSON.stringify(
        { steps: stepResults, summary: { passed, failed, skipped, total }, elapsedSeconds: Number(elapsed) },
        null,
        2,
      ),
    );

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log(`  Results: ${passed} passed  ${failed} failed  ${skipped} skipped  (${total} total)`);
    console.log(`  Elapsed: ${elapsed}s`);
    console.log(`  Results written to: ${resultsPath}`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\nFailed steps:');
      stepResults
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  [${r.suite}] ${r.code} ${r.desc} — ${r.error ?? ''}`));
      process.exit(1);
    }
  }
}

run().catch(e => {
  console.error('Runner fatal error:', e);
  process.exit(1);
});

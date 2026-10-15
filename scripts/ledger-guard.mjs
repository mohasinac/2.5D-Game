#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   THE LEDGER REGRESSION GUARD

   The Case Ledger is a snapshot: 1,660 cases, each marked OK / PART / GAP
   against the code as it was when they were read. A snapshot rots. This
   re-derives the status of the claims that CAN be checked mechanically and
   fails when one silently changes.

   WHAT IT IS FOR, precisely. Sec.0's entire PART column was produced by the
   "looks done, isn't" failure: a system built, wired to nothing, and
   indistinguishable from a working one unless you go and read the code. This
   project has found that pattern five times in documented zero-caller
   systems, plus `lidMesh` (documented as real, does not exist),
   `buildScoopLidGeo` (exported, no callers) and `resolveBeyPairs` (tested, no
   caller — listed deliberately). A guard is cheaper than finding the sixth by
   accident.

   It checks PRESENCE AND WIRING, not behaviour — the test suite does
   behaviour. The question here is only "does the thing the ledger says exists
   still exist, and is it still connected to anything".
   ══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SRC  = join(ROOT, 'src');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (['.ts', '.js'].includes(extname(p))) out.push(p);
  }
  return out;
}

const FILES = existsSync(SRC) ? walk(SRC) : [];

/* Comments are stripped before ANY scan. Without this the guard reports a
   file as impure because its header comment EXPLAINS the impurity it avoids —
   `Rng.ts` and `SimClock.ts` both document `Math.random()` and
   `performance.now()` in prose and use neither in code. A guard that cannot
   tell a mention from a use is a guard nobody trusts for long. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const SOURCES = FILES.map(f => {
  const raw = readFileSync(f, 'utf8');
  return { path: f, text: raw, code: stripComments(raw) };
});

/** Count references to a symbol, excluding its own declaration. */
function callers(symbol) {
  let n = 0;
  const decl = new RegExp(
    `(export\\s+)?(async\\s+)?(function|class|const|let)\\s+${symbol}\\b`);
  const use = new RegExp(`\\b${symbol}\\b`, 'g');
  for (const { code } of SOURCES) {
    for (const line of code.split(/\r?\n/)) {
      if (decl.test(line)) continue;
      const m = line.match(use);
      if (m) n += m.length;
    }
  }
  return n;
}

/* Matches a standalone declaration OR a class method. `projectBelow` is a
   method on `SceneSurfaceProjector`, and a function-only check reported the
   entire mesh-standing feature as missing — a false alarm is as corrosive to
   a guard's credibility as a missed regression. */
function defined(symbol) {
  const standalone = new RegExp(
    `(export\\s+)?(async\\s+)?(function|class|const|let|interface|type)\\s+${symbol}\\b`);
  const method = new RegExp(
    `^\\s*(public\\s+|private\\s+|protected\\s+)?(static\\s+)?(async\\s+)?${symbol}\\s*\\(`, 'm');
  return SOURCES.some(s => standalone.test(s.code) || method.test(s.code));
}

/**
 * Expectations.
 *
 * `wired: false` entries are the honest ones — systems the ledger KNOWS have
 * no consumer. They are asserted too, so that when one finally gets wired the
 * guard fails and the documentation has to be updated. A guard that only
 * catches regressions lets the docs rot in the other direction.
 */
const EXPECTATIONS = [
  // ── Primitives that must exist and be called ──────────────────────────
  { symbol: 'composeInertia',      defined: true, wired: true,
    note: 'primitive #2 — per-part inertia composition' },
  { symbol: 'spinDecayRate',       defined: true, wired: true,
    note: 'primitive #3 — spin decay; rpm must not go back to cosmetic' },
  { symbol: 'sleepOutOmega',       defined: true, wired: true,
    note: 'primitive #4 — heavy-top sleep-out threshold' },
  { symbol: 'resolveObstacleSide', defined: true, wired: true,
    note: 'obstacle sides — the Tower pillar must keep stopping the bey' },
  { symbol: 'resolveChannel',      defined: true, wired: true,
    note: 'U-channel retention' },
  { symbol: 'projectBelow',        defined: true, wired: true,
    note: 'mesh standing — decks, obstacle tops, the real bowl' },
  { symbol: 'headingToForward',    defined: true, wired: true,
    note: 'THE heading convention — got wrong twice, in two features' },

  // ── Known orphans. Asserted so wiring one forces a doc update ─────────
  { symbol: 'resolveBeyPairs',     defined: true, wired: true,
    note: 'primitive #1 — now called by BeySystem; it is no longer an orphan' },
  { symbol: 'buildScoopLidGeo',    defined: true, wired: false,
    note: 'exported with zero callers; the zone-fill lid is never created' },
];

let failures = 0;
const say = (ok, msg) => { console.log(`${ok ? '  ok ' : 'FAIL '}${msg}`); if (!ok) failures++; };

console.log(`Ledger guard — ${SOURCES.length} source files\n`);

for (const e of EXPECTATIONS) {
  const isDefined = defined(e.symbol);
  if (e.defined && !isDefined) {
    say(false, `${e.symbol}: expected to exist but was not found — ${e.note}`);
    continue;
  }
  const n = callers(e.symbol);
  if (e.wired) {
    say(n > 0, `${e.symbol}: ${n} reference(s) — ${e.note}`);
  } else {
    say(n === 0, n === 0
      ? `${e.symbol}: still uncalled, as documented — ${e.note}`
      : `${e.symbol}: now has ${n} reference(s) — UPDATE THE DOCS, it is no longer an orphan`);
  }
}

/* The ban the architecture rules state: persistence may only be touched
   inside `src/stores/`. Mechanically checkable, and exactly the kind of rule
   that erodes one convenient call at a time. */
console.log('\nArchitecture bans');
/* Documented pre-existing debt, listed rather than hidden. CLAUDE.md records
   all three as bypassing Zustand; `SpecialMoveSandbox` is the one still in
   `src/`. Listing it keeps the check meaningful for NEW violations instead of
   being permanently red and therefore ignored. */
const LOCALSTORAGE_DEBT = ['SpecialMoveSandbox.ts'];
const stray = SOURCES.filter(s =>
  /localStorage\.(get|set|remove)Item/.test(s.code) &&
  !s.path.includes('stores') &&
  !LOCALSTORAGE_DEBT.some(d => s.path.endsWith(d)));
say(stray.length === 0, stray.length === 0
  ? 'localStorage confined to src/stores/'
  : `localStorage used outside src/stores/: ${stray.map(s => s.path).join(', ')}`);

/* `sim/` must stay pure: no THREE, no wall clock, no unseeded randomness.
   This is what makes a replay reproduce, and it is also precisely what
   client-side prediction would need. */
console.log('\nsim/ purity');
const simFiles = SOURCES.filter(s => s.path.includes(join('src', 'sim')));
for (const check of [
  { re: /from\s+['"]three['"]/,      label: 'imports THREE' },
  { re: /performance\.now|Date\.now|new Date\(\)/, label: 'reads the wall clock' },
  { re: /Math\.random\(\)/,          label: 'uses unseeded randomness' },
]) {
  const bad = simFiles.filter(s => check.re.test(s.code));
  say(bad.length === 0, bad.length === 0
    ? `no file ${check.label}`
    : `${check.label}: ${bad.map(s => s.path).join(', ')}`);
}

console.log(`\n${failures === 0 ? 'ledger guard passed' : `${failures} ledger check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);

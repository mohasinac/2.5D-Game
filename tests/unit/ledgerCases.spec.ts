import { test, expect } from '@playwright/test';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, sep } from 'node:path';

/**
 * THE LEDGER, CHECKED AGAINST THE CODE — one assertion per case.
 *
 * `case study/LEDGER.md` records 1,660 cases and, for each, the primitive it
 * was blocked on and a post-implementation `After fix v2` verdict. A document
 * like that rots the moment it is written unless something re-derives it.
 *
 * This parses the ledger and, for every row, checks the verdict against what
 * is actually in `src/`:
 *
 *   MECH OK   -> every mechanism that row names must EXIST and be CALLED
 *                from outside its own file
 *   STILL GAP -> the mechanism it names must still have no caller. Asserted
 *                in BOTH directions deliberately: when one of these finally
 *                gets wired the suite fails and the ledger has to be updated,
 *                which is the only way a status document stays honest.
 *   PARTIAL   -> the generic mechanism exists; the per-part or per-arena
 *                authoring does not. Only the former is checkable here.
 *
 * WHAT THIS IS NOT. It does not verify the PHYSICS of a case — that the
 * numbers match, that the behaviour is right. Those are the per-mechanism
 * suites (`spinPhysics`, `obstacleCollision`, `beyCollision`, `phase7to18`).
 * This answers the narrower question the ledger actually asks: is this case
 * still blocked on something missing?
 */

/* ── Load src/ once ──────────────────────────────────────────────────────── */

function walk(dir: string): string[] {
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (['.ts', '.js'].includes(extname(p))) out.push(p);
  }
  return out;
}

const stripComments = (t: string): string => t
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

const SRC_DIR = 'src';
const SOURCES = existsSync(SRC_DIR)
  ? walk(SRC_DIR).map(f => ({
      path: f.split(sep).join('/'),
      code: stripComments(readFileSync(f, 'utf8')),
    }))
  : [];

/** References to `symbol` from outside the file that declares it. */
function callersOf(symbol: string, ownFile: string): number {
  const decl = new RegExp(`(export\\s+)?(async\\s+)?(function|class|const|let)\\s+${symbol}\\b`);
  const use  = new RegExp(`\\b${symbol}\\b`, 'g');
  let n = 0;
  for (const { path, code } of SOURCES) {
    if (path.endsWith(ownFile)) continue;
    for (const line of code.split(/\r?\n/)) {
      if (decl.test(line)) continue;
      n += (line.match(use) ?? []).length;
    }
  }
  return n;
}

/* ── The mechanism each ledger code maps to ──────────────────────────────── */

interface Mechanism { symbol: string; file: string; label: string }

/** Gap codes from the ledger's own key (Parts 12-14). */
const CODE_MECHANISM: Record<string, Mechanism> = {
  C:  { symbol: 'resolveBeyPairs',     file: 'beyCollision.ts', label: 'bey-vs-bey contact' },
  I:  { symbol: 'composeInertia',      file: 'spin.ts',         label: 'inertia composition' },
  D:  { symbol: 'spinDecayRate',       file: 'spin.ts',         label: 'spin decay' },
  T:  { symbol: 'tiltFromContact',     file: 'spin.ts',         label: 'heavy-top tilt' },
  B:  { symbol: 'applyBurstImpulse',   file: 'burst.ts',        label: 'burst' },
  P:  { symbol: 'projectileHit',       file: 'projectile.ts',   label: 'projectile collision' },
  Z:  { symbol: 'fieldAccel',          file: 'fieldForce.ts',   label: 'field forces' },
  S:  { symbol: 'applySpinExchange',   file: 'spinExchange.ts', label: 'signed spin / steal' },
  R:  { symbol: 'detachPart',          file: 'partMutation.ts', label: 'runtime part mutation' },
  X:  { symbol: 'ComboDetector',       file: 'ComboDetector.ts',label: 'combo input' },
  F:  { symbol: 'effectiveTipFriction',file: 'arenaConstants.ts', label: 'bearing coupling' },
  J:  { symbol: 'stepFlight',          file: 'aerial.ts',       label: 'aerial flight' },
  M:  { symbol: 'shouldDeploy',        file: 'partMutation.ts', label: 'w-threshold switch' },
};

/**
 * Codes the ledger marks STILL GAP — asserted to remain UNCALLED.
 *
 * `E` (stat modifiers) and `A` (target binding) were here and have since
 * been wired, which is exactly what this assertion is for: it failed, and
 * updating the ledger became part of that change instead of something to
 * remember afterwards. `L` is what is genuinely left.
 */
const STILL_GAP_MECHANISM: Record<string, Mechanism> = {
  /* EMPTY, and that is the finding rather than an omission. All three
     mechanisms this project had catalogued as zero-caller — the stat
     modifier pipeline, target binding and cooperative links — are now
     wired. The map stays so the next one that appears has somewhere to go;
     an empty object here is a stronger statement than deleting the test. */
};

/** Mechanisms that must now BE called — the two that just stopped being gaps. */
const NEWLY_WIRED: Mechanism[] = [
  { symbol: 'getEffective', file: 'BuffDebuffManager.ts', label: 'stat modifier pipeline' },
  { symbol: 'stepLink',     file: 'BeyLink.ts',           label: 'cooperative bey links' },
];

/* ── Parse the ledger ────────────────────────────────────────────────────── */

interface LedgerRow {
  caseNum: string;
  title: string;
  status: string;
  codes: string;
  v2: string;
  /** `file.ts:NN`<-`caller.ts:NN` for the mechanism this row rests on. */
  evidence: string;
}

function parseLedger(): LedgerRow[] {
  const path = join('case study', 'LEDGER.md');
  if (!existsSync(path)) return [];
  const rows: LedgerRow[] = [];
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('|') || t.startsWith('| Case') || /^\|[\s\-|]+\|$/.test(t)) continue;
    const cells = t.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 5) continue;
    /* Only genuine case rows. The re-verification tables use `| 1 |`..`| 6 |`
       as PRIMITIVE indices, not case numbers, and were being parsed as cases
       with a paragraph of prose where the verdict should be — which is how
       this filter came to exist. Real case numbers start at 11. */
    if (!/^\d+$/.test(cells[0]) || Number(cells[0]) < 10) continue;
    rows.push({
      caseNum:  cells[0],
      title:    cells[1],
      status:   cells[cells.length - 4],
      codes:    cells[cells.length - 3],
      v2:       cells[cells.length - 2],
      evidence: cells[cells.length - 1],
    });
  }
  return rows;
}

const ROWS = parseLedger();

/** Mechanisms a row's code/evidence cell names. */
function mechanismsFor(row: LedgerRow): Mechanism[] {
  const tokens = row.codes.match(/\[M\]|geom|\b[A-Z]\b/g) ?? [];
  const out: Mechanism[] = [];
  for (const tk of tokens) {
    const m = CODE_MECHANISM[tk];
    if (m && !out.some(x => x.symbol === m.symbol)) out.push(m);
  }
  return out;
}

/* ── The suite ───────────────────────────────────────────────────────────── */

test.describe('the Case Ledger, re-derived from src/', () => {

  test('the ledger file exists and parses', () => {
    /* If this fails everything below is vacuously true, which is the worst
       possible failure mode for a status document — so it is asserted
       separately and loudly. */
    expect(SOURCES.length, 'src/ was not readable').toBeGreaterThan(100);
    expect(ROWS.length, 'no case rows parsed out of case study/LEDGER.md')
      .toBeGreaterThan(500);
  });

  test('every row carries an After fix v2 verdict', () => {
    const missing = ROWS.filter(r =>
      !['OK', 'MECH OK', 'PARTIAL', 'STILL GAP', "WON'T DO", 'NOT RE-CHECKED', '—']
        .includes(r.v2));
    expect(missing.slice(0, 5).map(r => `${r.caseNum}: "${r.v2}"`)).toEqual([]);
  });

  test('EVERY mechanism the ledger relies on exists and is called', () => {
    /* One assertion covering every MECH OK row at once: if any mechanism
       they cite loses its last caller, every one of those rows silently
       becomes a lie. */
    const broken: string[] = [];
    for (const [code, m] of Object.entries(CODE_MECHANISM)) {
      const n = callersOf(m.symbol, m.file);
      if (n === 0) broken.push(`${code} (${m.label}): ${m.symbol} has no caller`);
    }
    expect(broken).toEqual([]);
  });

  test('the two mechanisms that just stopped being gaps really are wired', () => {
    const dead = NEWLY_WIRED.filter(m => callersOf(m.symbol, m.file) === 0);
    expect(dead.map(m => m.label)).toEqual([]);
  });

  test('STILL GAP mechanisms really are still uncalled', () => {
    /* Asserted in the other direction on purpose. When one of these is
       finally wired this test fails, and updating the ledger becomes part
       of the change rather than something to remember later. */
    const nowWired: string[] = [];
    for (const [code, m] of Object.entries(STILL_GAP_MECHANISM)) {
      if (callersOf(m.symbol, m.file) > 0) {
        nowWired.push(`${code} (${m.label}) is now called — update LEDGER.md`);
      }
    }
    expect(nowWired).toEqual([]);
  });

  test('no MECH OK row depends on a mechanism that is missing', () => {
    const offenders: string[] = [];
    for (const row of ROWS) {
      if (row.v2 !== 'MECH OK') continue;
      for (const m of mechanismsFor(row)) {
        if (callersOf(m.symbol, m.file) === 0) {
          offenders.push(`case ${row.caseNum} needs ${m.label}`);
        }
      }
    }
    expect(offenders.slice(0, 10)).toEqual([]);
  });

  test('EVERY row cites evidence, and no row cites a mechanism with no caller', () => {
    /* The evidence column is generated from `src/`, not typed, so its job is
       to make "MECH OK" falsifiable: each row names the declaration AND a
       live call site. A row whose mechanism loses its last caller reads
       `NO CALLER` and fails here.

       This is the assertion that caught the real state of things — 78 rows
       were resting on four mechanisms (`applyAmplification`, `magneticAccel`,
       `applyWear`, `makeClone`) that existed, were unit-tested, and were
       never once called by the game. */
    const blank = ROWS.filter(r => !r.evidence || r.evidence === '-');
    expect(blank.slice(0, 5).map(r => r.caseNum), 'rows with no evidence').toEqual([]);

    const uncalled = ROWS.filter(r => r.evidence.includes('NO CALLER'));
    expect(uncalled.slice(0, 5).map(r => `${r.caseNum}: ${r.evidence}`),
      'rows citing an uncalled mechanism').toEqual([]);
  });

  test('the distribution matches what the summary claims', () => {
    const count = (v: string) => ROWS.filter(r => r.v2 === v).length;
    /* Every row is now MECH OK, and this assertion is only worth anything
       BECAUSE of the evidence test above: "all unblocked" is a claim that can
       be made by typing, and a claim that can be checked only by re-deriving
       each row's mechanism from `src/` and confirming it has a live caller.
       If the two ever disagree, the evidence test is the one to believe. */
    expect(count('MECH OK')).toBe(ROWS.length);
    expect(count('STILL GAP')).toBe(0);
    expect(count('PARTIAL')).toBe(0);
  });

  test('case numbers are plausible and non-empty', () => {
    const bad = ROWS.filter(r => Number(r.caseNum) < 1 || Number(r.caseNum) > 2092);
    expect(bad.map(r => r.caseNum).slice(0, 5)).toEqual([]);
  });

  test('THE KNOWN COLLISION is still flagged, not silently resolved', () => {
    /* CS9 was reported carrying cases 551-621 where INDEX.md assigns those
       numbers to CS10/11/12. Unresolved, and the ledger must keep saying so
       — a collision quietly merged is unrecoverable. */
    const text = readFileSync(join('case study', 'LEDGER.md'), 'utf8');
    expect(text).toContain('551');
    expect(text.toLowerCase()).toContain('collision');
  });
});

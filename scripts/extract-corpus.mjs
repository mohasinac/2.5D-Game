#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   PHASE 13 — THE CORPUS EXTRACTOR

   Parses the case-study corpus into `src/config/specialMoves.generated.ts`.
   The alternative is hand-porting ~250 moves, which is both enormous and the
   kind of work that silently drifts from its source.

   THREE THINGS THIS HAS TO GET RIGHT, all of them discovered by the ledger
   rather than guessed:

   1. THE K7 CONSTANTS ARE A FIXED TABLE, IMPORTED, NOT RE-DECIDED PER CASE.
      The corpus contradicts itself in ~200 numbered places. If the extractor
      resolves each contradiction as it meets it, the same disagreement gets
      settled differently for different moves and the output is incoherent.
      `K7` below is the single resolution table; every conversion reads it.

   2. CS15 IS DUPLICATED, BUT ONLY IN ITS FIRST ~27,700 LINES. It restarts its
      numbering there with DIFFERENT content, not a verbatim copy. Cases
      1893-2092 appear exactly once and are strictly sequential — de-duping
      them would DELETE real cases. The dedup is therefore scoped by line, not
      applied to the file.

   3. `GIMMICK(2)` EXISTS. A parser keyed on `GIMMICK:` silently drops the two
      cases tagged that way, and silent drops are the failure mode here: the
      output still looks complete.

   This is a BUILD-TIME script. It is not imported by the app and must never
   be — the generated file is the only thing that ships.
   ══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CASE_DIR = join(ROOT, 'case study');
const OUT = join(ROOT, 'src', 'config', 'specialMoves.generated.ts');

/* ── The K7 resolution table ─────────────────────────────────────────────── */
/* Every contested constant, resolved once, with the reason recorded. Changing
   a value here changes it everywhere; that is the point. */
const K7 = {
  /** CS11's style rule says 0.001 N·s; Case 597's calibration shows 3.60e-5.
      The calibration is the only one with a shown derivation (F_peak = k·x =
      12.0 N, eta = 0.030) and CS12 independently inherits it. 27.8x apart. */
  impulseUnitNs: 3.60e-5,
  /** Style rule says 1 unit = 0.4 rad/s; CS11 Case 597 and CS12 both say 1:1,
      and CS11's own worked example ("60 rad/s = spinDelta 60") agrees. */
  spinDeltaPerUnit: 1.0,
  /** Abstract 0-2000 stat scale, NOT rad/s. Converted at the sim boundary. */
  maxSpinIsAbstract: true,
  /** Physical launch baseline, CS14 Case 578's string derivation. */
  physicalLaunchOmega: 1714,
  /** In-game calibrated launch; every corpus decay figure is computed on it. */
  calibratedLaunchOmega: 600,
  /** MASTER flags this as "error #3: corrects 0.02/0.005 to 0.05". */
  bearingFriction: 0.05,
  /** Annular, never the thin-ring form CS1's code uses. */
  inertiaForm: 'annular',
  /** Q-tip deltaH: the table value, not the formula that contradicts it. */
  quakeDeltaHmm: [0.8, 1.6],
  /** [CONFIRMED] in CS10, unaffected by the unit contradictions. */
  ringOutDeltaV: 4.0,
};

/** CS15's duplicated prefix. Cases after this line are clean and sequential. */
const CS15_DEDUP_LINE_LIMIT = 27700;

/** Tag forms that denote a case. `GIMMICK(2)` is why this is a regex. */
const TAG_RE = /\[?(GIMMICK(?:\(\d\))?|SPECIAL(?:\s+MOVE)?|COMBO|DESIGN PRINCIPLE)\]?\s*:?/i;
const CASE_RE = /^#+\s*CASE\s+(\d+)\s*[—:-]?\s*(.*)$/i;

function listCaseFiles() {
  const files = [];
  for (let i = 1; i <= 15; i++) {
    const p = join(CASE_DIR, `${i} case study.md`);
    if (existsSync(p)) files.push({ index: i, path: p });
  }
  return files;
}

/**
 * Split a file into cases.
 *
 * Returns unnumbered headings separately rather than discarding them: CS9's
 * tail carries ~130 literal `CASE XXXX` placeholders, and dropping them
 * silently would make the corpus look fully extracted when a tenth of one
 * file is missing.
 */
function parseCases(text, fileIndex) {
  const lines = text.split(/\r?\n/);
  const cases = [];
  const unnumbered = [];
  let current = null;

  lines.forEach((line, lineNo) => {
    const m = CASE_RE.exec(line);
    if (m) {
      if (current) cases.push(current);
      const num = Number(m[1]);
      current = {
        num, file: fileIndex, line: lineNo,
        title: m[2].trim(),
        tag: (TAG_RE.exec(m[2]) || [])[1] || null,
        body: [],
      };
      return;
    }
    if (/^#+\s*CASE\s+X+/i.test(line)) {
      unnumbered.push({ file: fileIndex, line: lineNo, heading: line.trim() });
      return;
    }
    if (current) current.body.push(line);
  });

  if (current) cases.push(current);
  return { cases, unnumbered };
}

/** Scoped dedup — CS15 only, and only its duplicated prefix. */
function dedupe(cases, fileIndex) {
  if (fileIndex !== 15) return cases;
  const seen = new Set();
  return cases.filter(c => {
    if (c.line > CS15_DEDUP_LINE_LIMIT) return true;   // the clean tail
    const key = `${c.num}:${c.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Pull the engine parameters a move carries, where it states them. */
function extractMoveParams(body) {
  const text = body.join('\n');
  const num = (re) => { const m = re.exec(text); return m ? Number(m[1]) : null; };
  return {
    powerCost:    num(/powerCost["'\s:]+(\d+)/i),
    cooldownMs:   num(/cooldown(?:Ms)?["'\s:]+(\d+)/i),
    lockMs:       num(/lockMs["'\s:]+(\d+)/i),
    damageMult:   num(/damageMultiplier["'\s:]+([\d.]+)/i),
    mFactor:      num(/\[M\][^\n]*?([\d.]+)\s*x/i),
    qteWindowMs:  num(/QTEWindowMs["'\s:]+(\d+)/i),
    forceState:   (/forceState["'\s:]+["']?(\w+)/i.exec(text) || [])[1] ?? null,
    aoeRadius:    num(/aoeRadius(?:Px)?["'\s:]+(\d+)/i),
  };
}

function main() {
  const files = listCaseFiles();
  if (files.length === 0) {
    console.error(`No case studies found in ${CASE_DIR}`);
    process.exit(1);
  }

  const all = [];
  const unnumberedAll = [];
  const collisions = new Map();

  for (const f of files) {
    const { cases, unnumbered } = parseCases(readFileSync(f.path, 'utf8'), f.index);
    unnumberedAll.push(...unnumbered);
    for (const c of dedupe(cases, f.index)) {
      /* Case-number collisions across files are a KNOWN OPEN ITEM — CS9 was
         reported carrying 551-621 where the index assigns those to CS10/11/12.
         Recorded, never silently merged: merging three files' cases under one
         number is unrecoverable once done. */
      const prior = collisions.get(c.num);
      if (prior && prior !== c.file) {
        console.warn(`! case ${c.num} appears in both file ${prior} and file ${c.file}`);
      }
      collisions.set(c.num, c.file);
      all.push(c);
    }
  }

  const moves = all
    .filter(c => c.tag && /SPECIAL/i.test(c.tag))
    .map(c => ({
      id: `case-${c.num}`,
      caseNum: c.num,
      file: c.file,
      name: c.title.replace(TAG_RE, '').trim(),
      ...extractMoveParams(c.body),
    }));

  const header = `/* GENERATED by scripts/extract-corpus.mjs — DO NOT EDIT BY HAND.
 *
 * Every contested constant came from the K7 resolution table in the
 * extractor, applied uniformly. Re-run the script rather than patching a
 * value here; a hand edit will be silently overwritten and, worse, will
 * disagree with the rest of the table in the meantime.
 *
 * Cases parsed:      ${all.length}
 * Special moves:     ${moves.length}
 * Unnumbered CASE XXXX headings skipped: ${unnumberedAll.length}
 */

export const K7_CONSTANTS = ${JSON.stringify(K7, null, 2)} as const;

export interface GeneratedMove {
  id: string;
  caseNum: number;
  file: number;
  name: string;
  powerCost: number | null;
  cooldownMs: number | null;
  lockMs: number | null;
  damageMult: number | null;
  mFactor: number | null;
  qteWindowMs: number | null;
  forceState: string | null;
  aoeRadius: number | null;
}

export const GENERATED_MOVES: readonly GeneratedMove[] = ${JSON.stringify(moves, null, 2)};
`;

  writeFileSync(OUT, header, 'utf8');
  console.log(`cases ${all.length} · moves ${moves.length} · unnumbered ${unnumberedAll.length}`);
  console.log(`wrote ${OUT}`);
  if (unnumberedAll.length > 0) {
    console.warn(`! ${unnumberedAll.length} unnumbered headings were SKIPPED — they must be numbered before they can be extracted`);
  }
}

main();

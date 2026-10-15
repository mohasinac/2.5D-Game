#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   THE PART CATALOGUE — all four architectures, from the curated tables.

   `linka/` is 7.08 GB and 99.8% of it is images and raw HTML, but ~12 MB of
   hand-written Markdown under `linka/parts/` holds source-cited tables with
   weights in grams, heights in millimetres and a per-row provenance tag. That
   is the catalogue; this script reads it rather than inventing numbers.

   WHAT MAKES THIS MORE THAN A MARKDOWN PARSE, in the order the problems bite:

   1. NON-PART ROWS LEAK IN. A naive "every row of every table" pass picks up
      header repeats (`Category`, `Abbrev.`, `Slot`), bare ordinals (`1`, `2`)
      and prose rows from concept tables — `burst/layers.md` opens with a
      Chassis CONCEPT table whose first column reads "Single Chassis". Those
      become plausible-looking parts that no source ever listed.

   2. COLUMN ORDER IS PER FILE. `| AR Name | Weight | Molds | Source Bey |`
      against `| Bit | Abbrev. | Material | Type | Shape |` against
      `| Code | Full Name | Height (mm) | Weight (g) |`. Columns are matched
      by HEADER TEXT, never by position — except the name, which is always
      first.

   3. WEIGHTS ARE PROSE. "4.1g" · "6.5g total (core 4.5g + SAR 1.9g)" ·
      "4.7g (Mold 1) / 5.1g (Mold 2)" · "5.0–5.2g" · "~25g" · "UNKNOWN".
      Each form means something different and the raw string is kept so a
      reader can audit the parse.

   4. NAMES REPEAT ACROSS SECTIONS. The same part is often listed in both a
      detailed table and a summary one, with the better data in either.
      De-duplicated per (generation, slot, name), keeping the row that
      carries the most information.

   Output: `src/config/beys/parts.generated.ts`.

   Usage:  node scripts/gen-parts.mjs
   ══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const PARTS_DIR = join(ROOT, 'linka', 'parts');
const OUT = join(ROOT, 'src', 'config', 'beys', 'parts.generated.ts');

/**
 * File -> what the rows in it ARE.
 *
 * Explicit rather than inferred from the path, because the slot is the one
 * thing a table never states: `gen1/attack-rings.md` says "AR Name" in its
 * header and nothing anywhere in the row says "this is an attack ring".
 */
const SOURCES = [
  { file: 'gen1/attack-rings.md',  generation: 'plastic', slot: 'attack_ring' },
  { file: 'gen1/weight-disks.md',  generation: 'plastic', slot: 'weight_disk' },
  { file: 'gen1/blade-bases.md',   generation: 'plastic', slot: 'blade_base' },
  { file: 'hms/attack-rings.md',   generation: 'hms',     slot: 'attack_ring' },
  { file: 'hms/running-cores.md',  generation: 'hms',     slot: 'running_core' },
  { file: 'hms/weight-disks.md',   generation: 'hms',     slot: 'weight_disk' },
  { file: 'mfb/spin-tracks.md',    generation: 'mfb',     slot: 'spin_track' },
  { file: 'mfb/tips-catalog.md',   generation: 'mfb',     slot: 'performance_tip' },
  { file: 'burst/layers.md',       generation: 'burst',   slot: 'layer' },
  { file: 'burst/discs.md',        generation: 'burst',   slot: 'forge_disc' },
  { file: 'burst/drivers.md',      generation: 'burst',   slot: 'driver' },
  { file: 'bx/blades.md',          generation: 'bx',      slot: 'blade' },
  { file: 'bx/ratchets.md',        generation: 'bx',      slot: 'ratchet' },
  { file: 'bx/bits.md',            generation: 'bx',      slot: 'bit' },
];

/* ── Row rejection ───────────────────────────────────────────────────────── */

/**
 * Header words that appear as a row's NAME when a table repeats its header
 * mid-file, or when a "table" is really a key for the one below it.
 */
const HEADER_WORDS = new Set([
  'name', 'part', 'category', 'abbrev', 'abbrev.', 'slot', 'code', 'type',
  'weight', 'height', 'notes', 'tag', 'source', 'material', 'shape', 'era',
  'disc', 'driver', 'bit', 'blade', 'ratchet', 'layer', 'chassis', 'core',
  'ar name', 'wd name', 'base name', 'core name', 'blade name', 'full name',
  'disc slot', 'description', 'protrusions', 'classification', 'molds',
  'mold variants', 'source bey', 'source beys', 'source beyblade', 'tip type',
  'competitive tier', 'movement behavior', 'key behavior', 'key feature',
  'single/double', 'weight (g)', 'weight (approx)', 'height (mm)',
]);

/**
 * Is this row a real part?
 *
 * Deliberately strict. A junk entry in a catalogue is worse than a missing
 * one: the gap is visible in a count assertion, whereas "Category" sitting in
 * the parts list looks like a part until someone tries to build with it.
 */
function isPartRow(name, cells) {
  const n = name.trim().toLowerCase().replace(/\*/g, '');
  if (!n) return false;
  if (HEADER_WORDS.has(n)) return false;
  if (/^[-—–:\s]+$/.test(n)) return false;
  /* A SINGLE-DIGIT name is a list ordinal; a MULTI-DIGIT one is a part.
     Rejecting every bare number threw out the entire standard MFB Spin Track
     line — `85`, `90`, `145`, `230` — because those tracks are NAMED for
     their height in millimetres. Twelve real parts, silently absent, and the
     catalogue still looked plausible because the specialty tracks survived. */
  if (/^\d$/.test(n)) return false;
  if (/^\(/.test(n)) return false;                      // parenthetical asides
  if (n.length > 60) return false;                      // a prose cell, not a name
  /* A row with a single populated cell is a section label dressed as a
     table row — `| HMS WD | Engine WDPart fields |` is one. */
  if (cells.filter(c => c.trim()).length < 2) return false;
  return true;
}

/* ── Table parsing ───────────────────────────────────────────────────────── */

const splitRow = line =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

const isSeparator = line => /^\|[\s:|-]+\|?$/.test(line.trim());

/** Every table in a document: header cells plus body rows. */
function parseTables(md) {
  const lines = md.split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith('|')) continue;
    if (i + 1 >= lines.length || !isSeparator(lines[i + 1])) continue;
    const header = splitRow(lines[i]);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && lines[j].trim().startsWith('|'); j++) {
      if (isSeparator(lines[j])) continue;
      rows.push(splitRow(lines[j]));
    }
    tables.push({ header, rows });
    i = j - 1;
  }
  return tables;
}

/** Find a column whose header matches any of `names` (substring, lowercased). */
function col(header, ...names) {
  for (let i = 0; i < header.length; i++) {
    const h = header[i].toLowerCase().replace(/\*/g, '').trim();
    for (const n of names) if (h === n || h.includes(n)) return i;
  }
  return -1;
}

/* ── Value parsing ───────────────────────────────────────────────────────── */

/**
 * Grams from a prose weight cell, plus every variant it mentions.
 *
 * Returns the PRIMARY figure and the full list. A mould variant is not a
 * footnote here: Eight Heavy is 15.3 g plain and 15.5 g indented, and the
 * difference moves the centre of mass, so both are kept and the first is the
 * one the physics uses unless a build names otherwise.
 */
function parseWeight(raw) {
  if (!raw) return { grams: null, variants: [], raw: '' };
  const s = raw.replace(/\*/g, '').trim();
  if (/^(unknown|n\/a|—|-|\?)$/i.test(s)) return { grams: null, variants: [], raw: s };

  /* A range ("5.0–5.2g") is a measured spread across copies; its midpoint is
     the honest single number, and both ends stay in `variants`. */
  const range = s.match(/(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)\s*g/i);
  if (range) {
    const lo = +range[1], hi = +range[2];
    return { grams: +((lo + hi) / 2).toFixed(2), variants: [lo, hi], raw: s };
  }

  const all = [...s.matchAll(/(\d+(?:\.\d+)?)\s*g\b/gi)].map(m => +m[1]);
  if (all.length === 0) {
    /* Some tables give a bare number under a "Weight (g)" header. */
    const bare = s.match(/^~?\s*(\d+(?:\.\d+)?)$/);
    if (bare) return { grams: +bare[1], variants: [], raw: s };
    return { grams: null, variants: [], raw: s };
  }
  /* "6.5g total (core 4.5g + SAR 1.9g)" — the TOTAL is the part's weight and
     the components belong to sub-parts, so an unqualified first match is
     right here and the breakdown is preserved in `raw`. */
  return { grams: all[0], variants: all.slice(1), raw: s };
}

/** Millimetres from a height cell. MFB track names ARE their height. */
function parseHeight(raw, name) {
  if (raw) {
    const m = raw.replace(/\*/g, '').match(/(\d+(?:\.\d+)?)/);
    if (m) return +m[1];
  }
  /* `145` means 14.5 mm, and the whole MFB track line is named that way. */
  const code = String(name).match(/(\d{2,3})$/);
  if (code) return +code[1] / 10;
  return null;
}

/**
 * Provenance, normalised.
 *
 * Kept per part because the corpus distinguishes them and the distinction is
 * load-bearing: a FACT weight from PlasticsDB can be asserted against, an
 * INFERENCE cannot, and shipping both as if equally solid is how an estimate
 * becomes a citation.
 */
function parseTag(raw) {
  if (!raw) return 'UNTAGGED';
  const s = raw.toUpperCase();
  if (s.includes('FACT')) return s.includes('INFERENCE') ? 'MIXED' : 'FACT';
  if (s.includes('INFERENCE')) return 'INFERENCE';
  return 'UNTAGGED';
}

/* ── Main ────────────────────────────────────────────────────────────────── */

/* PARENTHESES ARE PART OF THE NAME. Stripping them first looked tidy and
   quietly merged distinct parts: `Flat Core (Original)` and `Flat Core (New
   Revision)` are different mouldings with different behaviour, and both
   slugged to `flat-core`, so the de-duplicator kept one and discarded the
   other. The same applies to every `(Mold 1)` / `(Mold 2)` pair. */
const slug = s => s.toLowerCase().replace(/\*/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** How much a row actually tells us — used to pick a winner among duplicates. */
const richness = p =>
  (p.grams != null ? 4 : 0) + (p.heightMm != null ? 2 : 0) +
  (p.tag === 'FACT' ? 2 : 0) + (p.notes ? 1 : 0) + (p.sourceBey ? 1 : 0);

function main() {
  const parts = new Map();          // key -> part
  const perFile = {};
  let rowsSeen = 0, rowsRejected = 0;
  const rejected = [];

  for (const src of SOURCES) {
    const path = join(PARTS_DIR, src.file);
    if (!existsSync(path)) { console.warn(`MISSING ${src.file}`); continue; }
    const tables = parseTables(readFileSync(path, 'utf8'));
    let kept = 0;

    for (const t of tables) {
      const iWeight = col(t.header, 'weight');
      const iHeight = col(t.header, 'height');
      const iNotes  = col(t.header, 'notes', 'description', 'key behavior', 'key feature');
      const iTag    = col(t.header, 'tag');
      const iSource = col(t.header, 'source bey', 'source beys', 'source beyblade');
      const iType   = col(t.header, 'type', 'classification');
      const iMold   = col(t.header, 'mold');
      const iAbbrev = col(t.header, 'abbrev');
      const iFull   = col(t.header, 'full name');

      for (const cells of t.rows) {
        rowsSeen++;
        const rawName = cells[0] ?? '';
        if (!isPartRow(rawName, cells)) { rowsRejected++; rejected.push(`${src.file}: ${rawName}`); continue; }

        const name = rawName.replace(/\*/g, '').trim();
        const w = parseWeight(iWeight >= 0 ? cells[iWeight] : '');
        const part = {
          id: `${src.generation}-${src.slot}-${slug(name)}`,
          name,
          fullName: iFull >= 0 && cells[iFull] ? cells[iFull].replace(/\*/g, '').trim() : null,
          abbrev: iAbbrev >= 0 && cells[iAbbrev] ? cells[iAbbrev].replace(/\*/g, '').trim() : null,
          generation: src.generation,
          slot: src.slot,
          grams: w.grams,
          weightVariants: w.variants,
          weightRaw: w.raw,
          heightMm: parseHeight(iHeight >= 0 ? cells[iHeight] : '', name),
          moldVariants: iMold >= 0 && cells[iMold] && !/^(none|—|-)$/i.test(cells[iMold])
            ? cells[iMold].replace(/\*/g, '').trim() : null,
          role: iType >= 0 && cells[iType] ? cells[iType].replace(/\*/g, '').trim() : null,
          sourceBey: iSource >= 0 && cells[iSource] ? cells[iSource].replace(/\*/g, '').trim() : null,
          notes: iNotes >= 0 && cells[iNotes] ? cells[iNotes].replace(/\*/g, '').trim() : null,
          tag: parseTag(iTag >= 0 ? cells[iTag] : ''),
          sourceFile: `linka/parts/${src.file}`,
        };

        const key = `${src.generation}|${src.slot}|${slug(name)}`;
        const prev = parts.get(key);
        /* Keep the richer row. The same part is listed in both a detailed
           table and a summary one, and which carries the weight varies. */
        if (!prev || richness(part) > richness(prev)) parts.set(key, part);
        if (!prev) kept++;
      }
    }
    perFile[src.file] = kept;
  }

  const list = [...parts.values()].sort((a, b) =>
    a.generation.localeCompare(b.generation) || a.slot.localeCompare(b.slot) ||
    a.name.localeCompare(b.name));

  const byGen = {}, bySlot = {}, byTag = {};
  let withWeight = 0;
  for (const p of list) {
    byGen[p.generation] = (byGen[p.generation] ?? 0) + 1;
    bySlot[p.slot] = (bySlot[p.slot] ?? 0) + 1;
    byTag[p.tag] = (byTag[p.tag] ?? 0) + 1;
    if (p.grams != null) withWeight++;
  }

  const lit = v => v === null ? 'null' : typeof v === 'number' ? String(v) : JSON.stringify(v);
  const rows = list.map(p => '  {' + [
    `id: ${lit(p.id)}`, `name: ${lit(p.name)}`, `fullName: ${lit(p.fullName)}`,
    `abbrev: ${lit(p.abbrev)}`, `generation: ${lit(p.generation)}`, `slot: ${lit(p.slot)}`,
    `grams: ${lit(p.grams)}`, `weightVariants: [${p.weightVariants.join(', ')}]`,
    `weightRaw: ${lit(p.weightRaw)}`, `heightMm: ${lit(p.heightMm)}`,
    `moldVariants: ${lit(p.moldVariants)}`, `role: ${lit(p.role)}`,
    `sourceBey: ${lit(p.sourceBey)}`, `notes: ${lit(p.notes)}`,
    `tag: ${lit(p.tag)}`, `sourceFile: ${lit(p.sourceFile)}`,
  ].join(', ') + ' },').join('\n');

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `/* GENERATED by scripts/gen-parts.mjs — do not edit by hand.
 *
 * Regenerate with: node scripts/gen-parts.mjs
 *
 * ${list.length} parts across four architectures, parsed from the curated
 * tables under \`linka/parts/\`. Weights are grams and heights millimetres,
 * both as the sources state them; \`weightRaw\` keeps the original cell so a
 * parsed figure can always be audited against what was written.
 *
 * \`tag\` IS NOT DECORATION. FACT rows carry a cited weight; INFERENCE rows
 * are reasoned estimates. ${byTag.FACT ?? 0} of these are FACT and
 * ${byTag.INFERENCE ?? 0} INFERENCE — treating the second group as measured
 * data is how an estimate turns into a citation.
 */

/** Assembly slots across all four architectures, bottom to top. */
export type PartSlot =
  | 'blade_base' | 'performance_tip' | 'driver' | 'bit'
  | 'spin_gear' | 'running_core' | 'spin_track' | 'ratchet'
  | 'weight_disk' | 'fusion_wheel' | 'forge_disc'
  | 'attack_ring' | 'energy_ring' | 'layer' | 'blade'
  | 'sub_attack_ring' | 'support_part' | 'bit_chip' | 'face_bolt';

export type PartGeneration = 'plastic' | 'hms' | 'mfb' | 'burst' | 'bx';

/** How solid the number is. See the file header. */
export type PartProvenance = 'FACT' | 'INFERENCE' | 'MIXED' | 'UNTAGGED';

export interface CatalogPart {
  id: string;
  name: string;
  /** Expanded name where the table gives a code and a name separately. */
  fullName: string | null;
  /** Short code (MFB tips, BX bits). */
  abbrev: string | null;
  generation: PartGeneration;
  slot: PartSlot;
  /** Primary mass, grams. Null where no source states one. */
  grams: number | null;
  /** Other masses the cell mentions — mould variants, range ends. */
  weightVariants: readonly number[];
  /** The original cell, verbatim, so the parse can be audited. */
  weightRaw: string;
  heightMm: number | null;
  moldVariants: string | null;
  /** Attack / Defense / Stamina / Balance, where the table classifies it. */
  role: string | null;
  sourceBey: string | null;
  notes: string | null;
  tag: PartProvenance;
  sourceFile: string;
}

export const CATALOG_PARTS: readonly CatalogPart[] = [
${rows}
];

export const CATALOG_PART_BY_ID: ReadonlyMap<string, CatalogPart> =
  new Map(CATALOG_PARTS.map(p => [p.id, p]));

/** Counts at generation time, asserted by \`tests/unit/partsCatalogue.spec.ts\`. */
export const CATALOG_COUNTS = {
  total: ${list.length},
  withWeight: ${withWeight},
  byGeneration: ${JSON.stringify(byGen)},
  bySlot: ${JSON.stringify(bySlot)},
  byTag: ${JSON.stringify(byTag)},
} as const;
`);

  console.log(`rows seen ${rowsSeen}, rejected ${rowsRejected}, parts ${list.length}`);
  /* Printed, never silent: a rejection rule that starts eating real parts
     should be visible on every run, not discovered months later. */
  for (const r of rejected) console.log('  rejected:', r);
  console.log('by generation:', JSON.stringify(byGen));
  console.log('by slot:', JSON.stringify(bySlot));
  console.log('by tag:', JSON.stringify(byTag));
  console.log(`with a weight: ${withWeight}/${list.length}`);
  console.log('per file:', JSON.stringify(perFile));
  console.log(`-> ${OUT}`);
}

main();

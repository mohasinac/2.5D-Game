/* Generate Season-1 bey builds from MEASURED geometry + documented masses.
 *
 *   node scripts/gen-season1-beys.mjs
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 * ────────────────────────────────
 * It emits `BeybladeBuildConfig` presets built from the EXISTING part/sector
 * system — original procedural geometry sized from published measurements. It
 * does not copy, embed or redistribute any mesh. `assets/LICENSES.md` rule 3
 * already draws exactly this line: the derived numbers (mass, inertia, centre
 * of mass, radii) are measurements, not the model, and carry no restriction.
 *
 * THE TWO SOURCES, AND WHY NEITHER IS ENOUGH ALONE
 * ───────────────────────────────────────────────
 * - `case study/stl-part-stats.json` has accurate GEOMETRY for 273 parts:
 *   outer radius, height, centre-of-mass height, inertia distribution.
 * - Its `massG` is keyed by PRINT MATERIAL (`pla`/`abs`/`petg`) — the mass of
 *   a printed plastic copy. For `8HEAVY_WD` that is 2.15 g in ABS, while the
 *   real Eight Heavy weight disk is 15 g BECAUSE IT IS METAL. Taking mass from
 *   here would make every metal part a seventh of its true weight and wreck
 *   the physics it feeds.
 *
 * So geometry comes from the measurement and mass from the documented part
 * weight, and the measured inertia is rescaled by `m_real / m_printed` —
 * valid because inertia is linear in mass for fixed geometry.
 *
 * This matters because `composeInertia`, `sleepOutOmega` and `spinDecayRate`
 * all consume these numbers: the builds drive REAL physics, not a skin.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const STATS = JSON.parse(readFileSync(join('case study', 'stl-part-stats.json'), 'utf8'));
const PARTS = Array.isArray(STATS) ? STATS : (STATS.parts ?? Object.values(STATS)[0]);

/**
 * Season-1 builds, with REAL part masses in grams.
 *
 * Combos and weights are from the case studies (`3/4 case study.md`) and the
 * verified figures in CLAUDE.md — Galeon is War Lion 6 g + Eight Heavy 15 g +
 * SG Semi-Flat 5 g + Bit Chip ~1 g, which is the ~30 g the corpus states and
 * the number the mass model is checked against.
 *
 * `match` is a regex over the measured part names; the first watertight hit
 * supplies the geometry. A build with no match still generates — it falls back
 * to the slot's typical proportions rather than silently vanishing.
 */
const BUILDS = [
  {
    id: 'galeon', name: 'Galeon', colour: 0x2b3a67,
    parts: [
      { slot: 'attack_ring',  label: 'War Lion',      massG: 6,  match: /war.?lion|galeon.*AR/i },
      { slot: 'weight_disk',  label: 'Eight Heavy',   massG: 15, match: /8HEAVY_WD|eight.?heavy/i },
      { slot: 'spin_gear',    label: 'Right SG',      massG: 3,  match: /RIGHT_SG|right.?sg/i },
      { slot: 'blade_base',   label: 'SG Semi-Flat',  massG: 5,  match: /SEMIFLAT_TIP|semi.?flat/i },
      { slot: 'bit_chip',     label: 'Bit Chip',      massG: 1,  match: /BITCHIP|bit.?chip/i },
    ],
  },
  {
    id: 'dragoon-s', name: 'Dragoon S', colour: 0x2f6fb5,
    parts: [
      { slot: 'attack_ring',  label: 'Upper Dragoon', massG: 7,  match: /dragoon.*AR|upper.?dragoon/i },
      { slot: 'weight_disk',  label: 'Eight Wide',    massG: 13, match: /DRAGOON_WD|eight.?wide/i },
      { slot: 'spin_gear',    label: 'Right SG',      massG: 3,  match: /RIGHT_SG/i },
      { slot: 'blade_base',   label: 'SG Flat',       massG: 5,  match: /FLAT_TIP|SG.?flat/i },
      { slot: 'bit_chip',     label: 'Bit Chip',      massG: 1,  match: /BITCHIP/i },
    ],
  },
  {
    id: 'dranzer-s', name: 'Dranzer S', colour: 0xc2412d,
    parts: [
      { slot: 'attack_ring',  label: 'Scissor Attacker', massG: 7, match: /dranzer.*AR|scissor/i },
      { slot: 'weight_disk',  label: 'Ten Balance',      massG: 14, match: /TEN.?BALANCE|10BALANCE/i },
      { slot: 'spin_gear',    label: 'Right SG',         massG: 3,  match: /RIGHT_SG/i },
      { slot: 'blade_base',   label: 'SG Grip Base',     massG: 6,  match: /GRIP.?BASE|grip/i },
      { slot: 'bit_chip',     label: 'Bit Chip',         massG: 1,  match: /BITCHIP/i },
    ],
  },
  {
    id: 'driger-s', name: 'Driger S', colour: 0x3f8f6b,
    parts: [
      { slot: 'attack_ring',  label: 'Great Tiger',   massG: 7,  match: /driger.*AR|great.?tiger|tiger/i },
      { slot: 'weight_disk',  label: 'Eight Heavy',   massG: 15, match: /8HEAVY_WD/i },
      { slot: 'spin_gear',    label: 'Right SG',      massG: 3,  match: /RIGHT_SG/i },
      { slot: 'blade_base',   label: 'SG Metal Flat', massG: 6,  match: /METAL.?FLAT/i },
      { slot: 'bit_chip',     label: 'Bit Chip',      massG: 1,  match: /BITCHIP/i },
    ],
  },
  {
    id: 'draciel-s', name: 'Draciel S', colour: 0x5a4a8f,
    parts: [
      { slot: 'attack_ring',  label: 'Ten Spike',     massG: 8,  match: /draciel.*AR|ten.?spike|spike/i },
      { slot: 'weight_disk',  label: 'Ten Wide',      massG: 16, match: /TEN.?WIDE|10WIDE/i },
      { slot: 'spin_gear',    label: 'Right SG',      massG: 3,  match: /RIGHT_SG/i },
      { slot: 'blade_base',   label: 'SG Defense Ring', massG: 7, match: /DEFENSE|defence/i },
      { slot: 'bit_chip',     label: 'Bit Chip',      massG: 1,  match: /BITCHIP/i },
    ],
  },
];

/** Typical proportions per slot, cm — the fallback when no mesh matches. */
const SLOT_SHAPE = {
  attack_ring: { r: 2.65, h: 0.90, com: 0.45 },
  weight_disk: { r: 2.10, h: 0.42, com: 0.21 },
  spin_gear:   { r: 1.55, h: 0.80, com: 0.40 },
  blade_base:  { r: 1.20, h: 1.60, com: 0.60 },
  bit_chip:    { r: 0.70, h: 0.20, com: 0.10 },
};

/** Stack order, bottom to top. Matches the real assembly. */
const ORDER = ['blade_base', 'spin_gear', 'weight_disk', 'attack_ring', 'bit_chip'];

function measure(match, slot) {
  const hit = PARTS.find(p => p.watertight && match.test(p.name) && p.outerRadiusCm > 0);
  const fb = SLOT_SHAPE[slot];
  if (!hit) return { ...fb, source: null, printedG: 0, inertia: 0 };
  return {
    r: hit.outerRadiusCm,
    h: hit.heightCm,
    com: hit.comHeightCm,
    inertia: hit.inertiaSpinGcm2,
    printedG: hit.massG?.abs ?? 0,
    source: hit.name,
  };
}

function buildConfig(b) {
  const parts = [];
  const rootChildIds = [];
  let y = 0;
  let seq = 1;

  for (const slot of ORDER) {
    const spec = b.parts.find(p => p.slot === slot);
    if (!spec) continue;
    const m = measure(spec.match, slot);
    const id = `p${seq++}`;

    /* Inertia rescaled from the printed copy to the real part. Linear in mass
       for fixed geometry, so this is a conversion, not a fudge. */
    const inertiaG = m.printedG > 0 ? m.inertia * (spec.massG / m.printedG) : 0;

    parts.push({
      id, name: spec.label, slot, axisOffsetY: +y.toFixed(3),
      height: +m.h.toFixed(3), radius: +m.r.toFixed(3),
      comHeightCm: +m.com.toFixed(3),
      weight: spec.massG,
      inertiaGcm2: +inertiaG.toFixed(2),
      measuredFrom: m.source,
    });
    rootChildIds.push(id);
    y += m.h;
  }

  const total = parts.reduce((s, p) => s + p.weight, 0);
  const inertia = parts.reduce((s, p) => s + p.inertiaGcm2, 0);
  return { ...b, parts, rootChildIds, totalG: total, inertiaGcm2: +inertia.toFixed(2) };
}

const built = BUILDS.map(buildConfig);

const body = built.map(b => `  {
    id: '${b.id}',
    name: '${b.name}',
    colour: 0x${b.colour.toString(16).padStart(6, '0')},
    /** Documented assembled mass, grams. */
    totalG: ${b.totalG},
    /** Summed spin-axis inertia, g·cm² — rescaled from printed to real mass. */
    inertiaGcm2: ${b.inertiaGcm2},
    parts: [
${b.parts.map(p => `      { id: '${p.id}', name: '${p.name}', slot: '${p.slot}', axisOffsetY: ${p.axisOffsetY}, height: ${p.height}, radius: ${p.radius}, comHeightCm: ${p.comHeightCm}, weight: ${p.weight}, inertiaGcm2: ${p.inertiaGcm2}, measuredFrom: ${p.measuredFrom ? `'${p.measuredFrom}'` : 'null'} },`).join('\n')}
    ],
  },`).join('\n');

const out = `/* GENERATED by scripts/gen-season1-beys.mjs — do not edit by hand.
 *
 * Season-1 bey builds. GEOMETRY is measured (radius, height, centre of mass,
 * inertia distribution); MASS is the documented real part weight, because the
 * measurement source reports the mass of a PRINTED PLASTIC COPY — the Eight
 * Heavy disk reads 2.15 g in ABS and is 15 g in reality, being metal.
 *
 * Measured inertia is rescaled by \`m_real / m_printed\`, which is exact for
 * fixed geometry. \`measuredFrom\` records which mesh supplied the shape, or
 * null where the slot fell back to typical proportions.
 *
 * No mesh is copied or redistributed: these are numbers, and the renderer
 * builds original procedural geometry from them.
 */

export interface Season1Part {
  id: string;
  name: string;
  slot: 'attack_ring' | 'weight_disk' | 'spin_gear' | 'blade_base' | 'bit_chip';
  /** Base Y along the spin axis, cm. */
  axisOffsetY: number;
  height: number;
  radius: number;
  comHeightCm: number;
  /** Real part mass, grams. */
  weight: number;
  /** Spin-axis inertia at the real mass, g·cm². */
  inertiaGcm2: number;
  /** Which measured mesh supplied the geometry, if any. */
  measuredFrom: string | null;
}

export interface Season1Bey {
  id: string;
  name: string;
  colour: number;
  totalG: number;
  inertiaGcm2: number;
  parts: readonly Season1Part[];
}

export const SEASON1_BEYS: readonly Season1Bey[] = [
${body}
];

export function season1Bey(id: string): Season1Bey | undefined {
  return SEASON1_BEYS.find(b => b.id === id);
}
`;

mkdirSync(join('src', 'config', 'beys'), { recursive: true });
writeFileSync(join('src', 'config', 'beys', 'season1.generated.ts'), out);

for (const b of built) {
  const matched = b.parts.filter(p => p.measuredFrom).length;
  console.log(`${b.name.padEnd(12)} ${b.totalG}g  I=${b.inertiaGcm2} g·cm²  ` +
              `(${matched}/${b.parts.length} parts measured)`);
}
console.log(`\nsrc/config/beys/season1.generated.ts — ${built.length} builds`);

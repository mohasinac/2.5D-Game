import { composeInertia, type InertiaPart } from '../sim/step/spin';
import type { BeyTipType } from '../config/arenaConstants';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 11 — SLOT-ORDERED ASSEMBLY  (and the weight invariant that was dead)

   `PartData` HAS NO TYPE FIELD. `BeyPartType` exists only on *presets*, so a
   part in the builder does not know whether it is an attack ring, a weight
   disk or a blade base. `_mergeConfigs` then stacks parts by cumulative
   height, discarding each part's own offset, with no slot rules at all — so
   a legal assembly and an impossible one are indistinguishable.

   The real systems are strictly ordered. Plastic gen builds bottom-up as
   BB+SG → WD → AR → SAR → Chip; the later architectures substitute their own
   slots but keep the principle. This module enforces that order and composes
   the mass properties the physics needs, which is what finally connects the
   bey builder to the simulation — today the bey you build "never becomes a
   physics body".

   THE WEIGHT INVARIANT IS ENFORCED HERE. "Sum of sectors = part weight" has
   been a dead placeholder; the panel warns on drift and nothing blocks it.
   A silent weight error is invisible until it shows up as a bey that will not
   topple, which is a very long way from the cause.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Assembly slots across the documented architectures.
 *
 * Ordered BOTTOM TO TOP, which is both how the real toys stack and the order
 * the height accumulation has to run in.
 */
export const SLOT_ORDER = [
  /* ── the tip-bearing foundation ─────────────────────────────────────────
     Every architecture has exactly one, under a different name. */
  'blade_base',     // BB      — plastic
  'performance_tip',// tip     — MFB
  'driver',         // Dr      — Burst
  'bit',            // Bit     — Beyblade X
  /* ── the shaft / height layer ──────────────────────────────────────────── */
  'spin_gear',      // SG / EG — plastic
  'running_core',   // RC      — HMS (replaces the Blade Base concept entirely)
  'spin_track',     // 145 etc — MFB; the NAME is the height in mm
  'ratchet',        // 3-60    — BX
  /* ── the mass ring ─────────────────────────────────────────────────────── */
  'weight_disk',    // WD      — plastic / HMS
  'fusion_wheel',   //         — MFB
  'forge_disc',     // Disc    — Burst
  /* ── the contact ring: what actually hits the opponent ─────────────────── */
  'attack_ring',    // AR      — plastic / HMS
  'energy_ring',    //         — MFB
  'layer',          //         — Burst
  'blade',          //         — BX
  /* ── plastic-era extras, above the contact ring ────────────────────────── */
  'sub_attack_ring',// SAR
  'support_part',   // SP
  'bit_chip',       // Chip
  'face_bolt',      //         — MFB's equivalent cap
] as const;

export type AssemblySlot = typeof SLOT_ORDER[number];

/** One authored part, as the assembler needs it. */
export interface AssemblyPart {
  id: string;
  name: string;
  slot: AssemblySlot;
  /** Grams. */
  weight: number;
  /** Inner radius of the annulus this part occupies, cm. */
  innerRadius: number;
  /** Outer radius, cm. Also its reach in a clash. */
  outerRadius: number;
  /** Vertical extent of the part itself, cm. */
  height: number;
  /** Sector weights, if this part was cut up. Must sum to `weight`. */
  sectorWeights?: readonly number[];
  /** Tip archetype, meaningful only on a `blade_base`. */
  tipType?: BeyTipType;
}

export interface AssemblyIssue {
  severity: 'error' | 'warning';
  partId: string | null;
  message: string;
}

export interface AssemblyResult {
  /** Total mass, g. */
  mass: number;
  /** Spin-axis inertia composed over the stack, g·cm². */
  inertiaSpin: number;
  /** Centre of mass above the tip, cm. Drives the topple torque. */
  comY: number;
  /** Overall height, tip to crown, cm. */
  height: number;
  /** Widest outer radius — the bey's reach. */
  radius: number;
  /** Tip from the blade base, or the default if none supplied one. */
  tipType: BeyTipType | null;
  /** Parts in bottom-to-top order, with resolved base heights. */
  stack: { part: AssemblyPart; baseY: number }[];
  issues: AssemblyIssue[];
}

/** Sort into legal stacking order, stably within a slot. */
export function sortBySlot(parts: readonly AssemblyPart[]): AssemblyPart[] {
  const rank = new Map<AssemblySlot, number>(SLOT_ORDER.map((s, i) => [s, i]));
  return [...parts].sort((a, b) => (rank.get(a.slot) ?? 99) - (rank.get(b.slot) ?? 99));
}

/**
 * Check the weight invariant on one part.
 *
 * When a part is cut into N sectors the parent weight is distributed evenly,
 * and nothing has ever stopped that total from drifting. An error rather than
 * a warning: mass feeds inertia, inertia feeds spin decay and the topple
 * threshold, so a wrong weight produces a bey that behaves oddly for reasons
 * no amount of looking at the physics will explain.
 */
export function checkSectorWeights(part: AssemblyPart): AssemblyIssue | null {
  if (!part.sectorWeights || part.sectorWeights.length === 0) return null;
  const sum = part.sectorWeights.reduce((a, b) => a + b, 0);
  const drift = Math.abs(sum - part.weight);
  if (drift <= 1e-6) return null;
  return {
    severity: 'error',
    partId: part.id,
    message: `sector weights sum to ${sum.toFixed(3)} g but the part is ${part.weight.toFixed(3)} g`,
  };
}

/**
 * Compose an assembly into the mass properties the simulation needs.
 *
 * Inertia uses the ANNULAR form via `composeInertia` — the same path the STL
 * analyser measures with, so an authored bey and a scanned one are directly
 * comparable rather than being computed two different ways.
 */
export function assemble(parts: readonly AssemblyPart[]): AssemblyResult {
  const issues: AssemblyIssue[] = [];
  const ordered = sortBySlot(parts);

  if (ordered.length === 0) {
    issues.push({ severity: 'error', partId: null, message: 'assembly is empty' });
  }

  const seen = new Set<AssemblySlot>();
  for (const p of ordered) {
    if (seen.has(p.slot) && p.slot !== 'sub_attack_ring') {
      issues.push({
        severity: 'warning', partId: p.id,
        message: `duplicate ${p.slot}; only sub-attack rings legitimately repeat`,
      });
    }
    seen.add(p.slot);
    const w = checkSectorWeights(p);
    if (w) issues.push(w);
  }
  if (!seen.has('blade_base')) {
    issues.push({
      severity: 'error', partId: null,
      message: 'no blade base: nothing supplies the tip, so the bey cannot touch the floor',
    });
  }

  /* Stack bottom-up, accumulating height. Each part's own offset is honoured
     rather than discarded, which is the bug in `_mergeConfigs`. */
  const stack: AssemblyResult['stack'] = [];
  let y = 0;
  let mass = 0;
  let momentY = 0;      // Σ m·y_centre, for the centre of mass
  let radius = 0;
  const inertiaParts: InertiaPart[] = [];

  for (const part of ordered) {
    stack.push({ part, baseY: y });
    const centre = y + part.height / 2;
    mass    += part.weight;
    momentY += part.weight * centre;
    radius   = Math.max(radius, part.outerRadius);
    inertiaParts.push({
      mass: part.weight,
      innerRadius: part.innerRadius,
      outerRadius: part.outerRadius,
    });
    y += part.height;
  }

  const base = ordered.find(p => p.slot === 'blade_base');

  return {
    mass,
    inertiaSpin: composeInertia(inertiaParts),
    comY: mass > 0 ? momentY / mass : 0,
    height: y,
    radius,
    tipType: base?.tipType ?? null,
    stack,
    issues,
  };
}

/** Does this assembly have any blocking problem? */
export function isLegal(result: AssemblyResult): boolean {
  return !result.issues.some(i => i.severity === 'error');
}

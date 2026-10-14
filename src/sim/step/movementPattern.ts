import type { Vec3 } from '../state';
import type { BeyTipType } from '../../config/arenaConstants';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 7 — MOVEMENT PATTERNS: the bey's own will.

   Today a "speed line" is an arena-authored ribbon that pushes the bey along a
   tangent. In real Beyblade the path is EMERGENT: the pattern belongs to the
   bey, and the stadium only perturbs it. Beywiki on the Super Attack Type
   describes "a Tornado Ridge that forms a flower pattern that a Beyblade
   produces when launched with a Sliding Shoot" — the bey produces the flower,
   not the dish.

   So the pattern is emitted from the tip and the arena bends it. A flat tip
   throws wide aggressive arcs; a sharp tip barely moves; a ball drifts; rubber
   grabs and carves tight. That mapping is not invented either — the sources
   say "flatter tips cause Beys to behave more aggressively, while pointed ones
   create a stable, calm spin pattern."

   The 24 existing shape samplers in `speedLineBuilders` become the pattern
   library unchanged: `circle`, `flower`, `spiral_in`, `spiral_out`, `zigzag`
   are already the right names. This module supplies the *direction the bey
   wants to go next*, in arena-local polar terms, so nothing here needs the
   path geometry or THREE.
   ══════════════════════════════════════════════════════════════════════════ */

/** The shapes a bey's own motion can trace. Named as the corpus names them. */
export type MovementPatternKind =
  | 'flower'        // ridge → centre → ridge; the Attack-type signature
  | 'tornado_stall' // a circle held out at the ridge; stamina play
  | 'spiral_in'
  | 'spiral_out'
  | 'drift'         // slow wander; what a ball tip does
  | 'stationary';   // a sharp tip, barely moving

/** How strongly a tip expresses its pattern, and which one it prefers. */
export interface TipMovementProfile {
  pattern: MovementPatternKind;
  /** 0 = sits still, 1 = sweeps the whole bowl. Scales the radial excursion. */
  aggression: number;
  /** How tightly it can carve. Higher = smaller turning radius. */
  grip: number;
}

/**
 * Tip → pattern. The Gen-1-vs-Gen-3 feel dial in one table.
 *
 * Keyed on the same tip archetypes the friction model uses, so a bey cannot
 * have one tip for spin decay and another for movement.
 */
export const TIP_MOVEMENT: Record<BeyTipType, TipMovementProfile> = {
  sharp:         { pattern: 'stationary',    aggression: 0.05, grip: 0.10 },
  ball:          { pattern: 'drift',         aggression: 0.25, grip: 0.25 },
  wide_ball:     { pattern: 'drift',         aggression: 0.35, grip: 0.30 },
  defense:       { pattern: 'tornado_stall', aggression: 0.30, grip: 0.35 },
  hard_flat:     { pattern: 'flower',        aggression: 0.80, grip: 0.55 },
  wide_flat:     { pattern: 'flower',        aggression: 0.90, grip: 0.60 },
  rubber_flat:   { pattern: 'flower',        aggression: 1.00, grip: 0.95 },
  metal_flat:    { pattern: 'flower',        aggression: 0.85, grip: 0.40 },
  pom_flat:      { pattern: 'spiral_out',    aggression: 0.60, grip: 0.30 },
  eternal_sharp: { pattern: 'stationary',    aggression: 0.08, grip: 0.12 },
  bearing:       { pattern: 'tornado_stall', aggression: 0.20, grip: 0.20 },
};

/** Where the bey is, in the arena's own polar frame. */
export interface PatternState {
  /** Distance from the arena centre, cm. */
  radius: number;
  /** Bearing around the arena, radians. */
  theta: number;
  /** Phase accumulator for patterns that oscillate radially. */
  phase: number;
}

/** Arena geometry the pattern needs. */
export interface PatternArena {
  /** Radius at which the Tornado Ridge sits, cm. The flower's outer turn. */
  ridgeRadius: number;
  /** Usable bowl radius, cm. */
  outerRadius: number;
}

/**
 * How fast the radial oscillation of a flower cycles, rad/s per unit
 * aggression. A flower petal is one in-and-out excursion, and an attack type
 * makes a few per second.
 */
export const FLOWER_RATE = 6.0;

/** Advance the pattern's internal phase. Pure; no clock read. */
export function advancePattern(
  state: PatternState,
  profile: TipMovementProfile,
  dt: number,
): PatternState {
  return {
    ...state,
    phase: state.phase + FLOWER_RATE * profile.aggression * dt,
  };
}

/**
 * The radius this pattern WANTS the bey at, right now.
 *
 * Separating "desired radius" from "direction to move" is what lets the arena
 * perturb the pattern instead of replacing it: the ridge can refuse to hand
 * the bey back outward (Sec.C2's `gripFactor`) and the pattern still knows
 * where it was trying to go.
 */
export function desiredRadius(
  state: PatternState,
  profile: TipMovementProfile,
  arena: PatternArena,
): number {
  const ridge = arena.ridgeRadius;
  switch (profile.pattern) {
    case 'flower': {
      /* Sweeps between the centre and the ridge. `aggression` sets how far in
         it comes — a timid flower is a wobbly circle, which is exactly what a
         worn or low-grip tip produces. */
      const inner = ridge * (1 - profile.aggression);
      const t = (Math.sin(state.phase) + 1) / 2;
      return inner + (ridge - inner) * t;
    }
    case 'tornado_stall':
      // Hold station on the ridge and outspin everything. No radial motion.
      return ridge;
    case 'spiral_in':
      return Math.max(0, state.radius - profile.aggression * 2);
    case 'spiral_out':
      return Math.min(arena.outerRadius, state.radius + profile.aggression * 2);
    case 'drift':
      // Wanders gently around wherever it already is.
      return state.radius + Math.sin(state.phase * 0.3) * profile.aggression;
    case 'stationary':
      return state.radius;
  }
}

/**
 * Unit XZ direction the bey's own pattern is pulling it.
 *
 * Combines the tangential component (going around) with the radial correction
 * (getting to the radius the pattern wants). A pure circle is all tangent; a
 * flower is a constantly shifting mix, which is what gives it petals.
 */
export function patternDirection(
  state: PatternState,
  profile: TipMovementProfile,
  arena: PatternArena,
): Vec3 {
  const want = desiredRadius(state, profile, arena);
  const dr   = want - state.radius;

  const cos = Math.cos(state.theta), sin = Math.sin(state.theta);
  // Outward radial unit vector, and the tangent 90° from it.
  const outX = cos,  outZ = sin;
  const tanX = -sin, tanZ = cos;

  /* Grip decides how much of the pull can be spent turning rather than
     coasting: a sharp tip cannot carve across the bowl however much the
     pattern wants to. */
  const radialWeight = Math.tanh(dr * 0.1) * profile.grip;
  const x = tanX + outX * radialWeight;
  const z = tanZ + outZ * radialWeight;
  const len = Math.hypot(x, z) || 1;
  return { x: x / len, y: 0, z: z / len };
}

/** Polar state from a world position relative to an arena centre. */
export function toPatternState(
  x: number, z: number, cx: number, cz: number, phase = 0,
): PatternState {
  const dx = x - cx, dz = z - cz;
  return { radius: Math.hypot(dx, dz), theta: Math.atan2(dz, dx), phase };
}

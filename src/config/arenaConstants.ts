/* ── Math / unit constants ──────────────────────────────────────────────── */
export const TWO_PI  = Math.PI * 2;
export const DEG2RAD = Math.PI / 180;
export const APOTHEM = 100; // cm — octagon inradius (flat-to-flat half-width)

/* ── Default base platform config ───────────────────────────────────────── */
/* THICKNESS of the octagon platform, NOT its world Y.
   `baseMesh.position.y = -H/2` puts the slab at −30..0, so the TOP FACE IS AT
   WORLD Y = 0 (hence `buildTopFaceGeo(..., baseHeight = 0, ...)`).
   Known exception: `trapSurfY()` returns this value for base-parented traps, so
   those meshes really do sit at Y≈30 — SpawnManager deliberately matches that. */
export const DEFAULT_BASE_HEIGHT = 30;     // cm
export const DEFAULT_BASE_SIDES  = 8;
export const DEFAULT_BASE_COLOR  = 0xe8dcc0;
export const DEFAULT_BASE_TILE   = 20;

/* ── Scene geometry constants ────────────────────────────────────────────── */
export const ARENA_ELEVATED_THRESHOLD = 0.5; // cm — posY above this = on moat island, not base
export const ZONE_FILL_OFFSET         = -1.0; // cm — wave fill surface sits below zone rim
export const RIM_EPS                  = 0.02; // cm — rim lift above parent surface (z-fight guard)
export const SEAM_TRANSITION_WIDTH    = 2.0;  // cm — seam collar outward width; must exceed arena ring spacing to cover jagged cuts
export const SEAM_RINGS               = 6;    // ring count in seam transition strip

/* ── Save schema version ─────────────────────────────────────────────────── */
export const ARENA_SAVE_VERSION = 12;

/* ── Arena physical material default ────────────────────────────────────── */
export const DEFAULT_ARENA_MATERIAL = 'abs' as const;

/* ── Obstacle constants ──────────────────────────────────────────────────── */
export const MIN_OBSTACLE_DIM      = 10;   // cm — minimum any obstacle dimension
export const DEFAULT_OBSTACLE_DIM  = 10;   // cm — default cube side length
export const DEFAULT_OBSTACLE_WEIGHT  = 50;   // g
export const MIN_OBSTACLE_WEIGHT      = 1;    // g
export const MAX_OBSTACLE_WEIGHT      = 5000; // g
export const DEFAULT_PROJECTILE_WEIGHT = 5;   // g
export const MIN_PROJECTILE_WEIGHT     = 0.1; // g
export const MAX_PROJECTILE_WEIGHT     = 500; // g

/* ── Trap constants ──────────────────────────────────────────────────────── */
export const MIN_TRAP_DIM         = 10;   // cm — minimum footprint dimension
export const DEFAULT_TRAP_DIM_X   = 10;   // cm
export const DEFAULT_TRAP_DIM_Z   = 10;   // cm
export const TRAP_PLATE_HEIGHT    = 2;    // cm — visual thickness of trigger plate
export const SPIKE_COUNT          = 9;    // 3×3 grid of spikes
export const SPIKE_HEIGHT         = 8;    // cm — spike cone height
export const TRAP_SAFE_INTERVAL   = 2;    // s — default safe interval for periodic traps
export const TRAP_UNSAFE_INTERVAL = 1;    // s — default unsafe interval

/* ── Portal constants ────────────────────────────────────────────────────── */
export const PORTAL_RING_HEIGHT     = 2;    // cm — torus ring sits this far above pad
export const PORTAL_RING_TUBE_R     = 1.5;  // cm — torus tube radius
export const DEFAULT_PORTAL_DIM     = 20;   // cm — default pad size
export const DEFAULT_EXIT_VEL_SCALE = 1.0;  // speed multiplier on portal exit

/* ── Physics material presets ───────────────────────────────────────────── */
import type { ArenaMaterial, ArenaMaterialProps, TrapDurationTier, TrapTierEffect, SurfaceType } from '../types/arenaTypes';

export const ARENA_MATERIAL_PRESETS: Record<ArenaMaterial, ArenaMaterialProps> = {
  // Walls: rubber|stone|abs|metal  Bridges: stone|abs|metal
  rubber: { restitution: 0.15, spinLossFactor: 0.05, damageFactor: 0.20 },
  stone:  { restitution: 0.40, spinLossFactor: 0.12, damageFactor: 0.55 },
  abs:    { restitution: 0.65, spinLossFactor: 0.15, damageFactor: 0.70 },
  metal:  { restitution: 0.90, spinLossFactor: 0.20, damageFactor: 1.00 },
} as const;

/* ── Per-surface physics, from CS10's ~35-surface table ──────────────────── */

/** Coulomb friction coefficient and restitution for a visual surface finish. */
export interface SurfacePhysicsProps {
  /** Coefficient of friction against the bey's tip. */
  friction: number;
  /** Coefficient of restitution for a vertical landing on this surface. */
  restitution: number;
}

/**
 * The reference surface. `SURFACE_PHYSICS.plain` matches it exactly, so the
 * ABS-on-ABS baseline reproduces the project's historical handling and every
 * other surface is a departure from it in a stated direction.
 */
export const SURFACE_MU_REFERENCE = 0.15;

/**
 * mu / e per `SurfaceType`, taken from the friction-and-restitution table in
 * `case study/10 case study.md` (its ~24 arena cases specify ~35 distinct
 * surfaces). Documented range, low to high friction:
 *
 *   ice 0.03-0.05 -> polished metal/marble 0.10-0.13 -> ABS baseline 0.15 ->
 *   concrete/asphalt 0.16-0.22 -> grass 0.28-0.40 -> dry sand 0.45 ->
 *   deep snow/wet mud 0.55-0.70 -> water (ploughing) 0.80-1.20
 *
 * and restitution from tree canopy e = 0.00 (total absorption) to
 * metal-on-metal e = 0.80.
 *
 * UNTIL NOW ALL 13 SURFACE TYPES WERE PURELY COSMETIC. They changed the canvas
 * texture and nothing else, so a sand floor and an ice floor played identically.
 * This table is what makes them differ.
 *
 * The six pattern finishes (checker/grid/hex/stripes/dots, plus `custom_png`,
 * which is an arbitrary user image) are paint applied to the stadium shell, not
 * materials in their own right, so they all take the ABS baseline rather than
 * inventing physics for a visual motif.
 */
export const SURFACE_PHYSICS: Record<SurfaceType, SurfacePhysicsProps> = {
  plain:      { friction: 0.15, restitution: 0.65 },  // ABS baseline
  checker:    { friction: 0.15, restitution: 0.65 },  // pattern on ABS
  grid:       { friction: 0.15, restitution: 0.65 },
  hex:        { friction: 0.15, restitution: 0.65 },
  stripes:    { friction: 0.15, restitution: 0.65 },
  dots:       { friction: 0.15, restitution: 0.65 },
  custom_png: { friction: 0.15, restitution: 0.65 },  // arbitrary user image
  concrete:   { friction: 0.19, restitution: 0.35 },  // concrete/asphalt 0.16-0.22
  metal:      { friction: 0.12, restitution: 0.80 },  // polished metal; metal-on-metal e
  wood:       { friction: 0.25, restitution: 0.45 },  // CS10's wooden log / deck
  ice:        { friction: 0.04, restitution: 0.20 },  // Blizzard Bowl (V-Force)
  sand:       { friction: 0.45, restitution: 0.10 },  // dry sand; absorbs impact
  lava_rock:  { friction: 0.55, restitution: 0.30 },  // rough volcanic rock
} as const;

/**
 * Clamp for the derived per-frame damping multiplier.
 *
 * The lower bound stops a very high mu (water's 1.20 ploughing figure) from
 * driving the multiplier to zero or negative and freezing the bey outright; the
 * upper bound stops near-frictionless ice from producing a top that never slows
 * at all. These bound the *approximation* in `surfaceDamping`, not the source
 * data — the real Coulomb model arrives with per-tip friction in a later phase.
 */
export const SURFACE_DAMPING_MIN = 0.50;
export const SURFACE_DAMPING_MAX = 0.995;

/* ══════════════════════════════════════════════════════════════════════════
   PER-TIP FRICTION  (ledger N2) and BEARING DECOUPLING (N3)
   ══════════════════════════════════════════════════════════════════════════

   The tip is where a Beyblade meets the world, and until now it was a label.
   `tipShape` is a free-text string with no physics behind it, so every bottom,
   driver and performance tip in the corpus — CS6's entire 325-342 block, plus
   1054-1057 and 1078-1087 — is GAP on these two numbers alone.

   Spin decay is `α = μ m g r / I`, so a tip contributes exactly two things:
   how grippy it is and how far from the axis it touches. A Rubber Flat drains
   four times faster than a Hard Flat for precisely that reason (CS10 Case 545
   works both: 156 vs 39.8 rad/s²).

   CONSTANTS AND THEIR PROVENANCE. The corpus contradicts itself on friction
   more than on anything else — the same violation recurs in eight of the
   fifteen files, usually by using a value its own header flags as wrong. The
   figures used here are the CONFIRMED ones from the file headers, not the
   values individual cases drift to:
     hard ABS   0.17  (CS6/CS7/CS8 headers; cases variously use 0.35, 0.12, 0.10)
     rubber     0.50  (headers; cases variously use 0.85, 1.2, 2.81)
     metal      0.12  (CS4 CONFIRMED)
     POM        0.10  (CS9 Case 869, Performance Tip Friction)
     bearing    0.05  (plan Sec.K7: MASTER explicitly corrects 0.02/0.005 to this)

   Where a radius is not given by a case it is taken from the tip's described
   geometry; those are marked below. */

export interface BeyTipProfile {
  /** Coulomb friction coefficient at the contact patch. */
  friction: number;
  /** Contact radius in cm — the torque arm for spin decay. */
  contactRadius: number;
  /**
   * Fraction of tip friction that actually reaches the BODY.
   *
   * A bearing tip (Eternal Sharp, Bearing Drive, Atomic, Orbit, Drift…) lets
   * the tip rotate independently, so floor friction spins the tip rather than
   * draining the bey. That is the whole mechanism behind every stamina-tip
   * case — ledger code F, ~80 cases — and today `freeSpin` only reassigns a
   * render group, which is why none of them work.
   *
   * 1 = rigidly coupled (an ordinary tip). 0.05 = a shielded ball bearing.
   */
  coupling: number;
}

/** Tip archetypes. Named for the families the corpus uses, not per-product. */
export const BEY_TIP_PROFILES = {
  /** Sharp / Spike: near-point contact, minimum torque arm, maximum stamina. */
  sharp:        { friction: 0.17, contactRadius: 0.05, coupling: 1 },
  /** Ball: Hertzian point contact, slightly wider than a sharp. */
  ball:         { friction: 0.17, contactRadius: 0.15, coupling: 1 },
  /** Wide Ball: same material, a visibly larger sphere. */
  wide_ball:    { friction: 0.17, contactRadius: 0.30, coupling: 1 },
  /** Defense cone: a truncated cone, mid torque arm. */
  defense:      { friction: 0.17, contactRadius: 0.35, coupling: 1 },
  /** Hard Flat — CS10 Case 545's worked example: 39.8 rad/s², 15.1 s. */
  hard_flat:    { friction: 0.17, contactRadius: 0.60, coupling: 1 },
  /** Wide Flat: more grip through more contact, not more friction. */
  wide_flat:    { friction: 0.17, contactRadius: 0.85, coupling: 1 },
  /** Rubber Flat — CS10 Case 545's other worked example: 156 rad/s², 3.85 s. */
  rubber_flat:  { friction: 0.50, contactRadius: 0.80, coupling: 1 },
  /** Metal Flat: low mu metal, so it drives without the rubber spin cost. */
  metal_flat:   { friction: 0.12, contactRadius: 0.70, coupling: 1 },
  /** POM / Friction tip: the lowest plain-material figure in the corpus. */
  pom_flat:     { friction: 0.10, contactRadius: 0.60, coupling: 1 },
  /** Eternal Sharp: a sharp on a sleeve bushing — partial decoupling. */
  eternal_sharp:{ friction: 0.17, contactRadius: 0.05, coupling: 0.25 },
  /** Bearing Drive / Atomic / Orbit: a shielded ball bearing. */
  bearing:      { friction: 0.17, contactRadius: 0.20, coupling: 0.05 },
} as const satisfies Record<string, BeyTipProfile>;

export type BeyTipType = keyof typeof BEY_TIP_PROFILES;

/** The historical default: an ordinary flat plastic tip. */
export const DEFAULT_TIP_TYPE: BeyTipType = 'hard_flat';

/**
 * Effective friction a tip presents to the body on a given surface.
 *
 * The surface and the tip both matter and they are not the same quantity: a
 * rubber tip on ice still slips, and a sharp tip on sand still digs. Combining
 * them multiplicatively about the ABS reference keeps the CS10 tip figures
 * exact on a reference surface (`SURFACE_MU_REFERENCE`) while letting the
 * ~35-surface table shift them in the documented direction.
 *
 * `coupling` then decides how much of that reaches the bey at all, which is
 * what makes a bearing tip a stamina part rather than a friction one.
 */
export function effectiveTipFriction(tip: BeyTipProfile, surfaceMu: number): number {
  const surfaceFactor = surfaceMu / SURFACE_MU_REFERENCE;
  return tip.friction * surfaceFactor * tip.coupling;
}

/* ── Per-surface PBR response ────────────────────────────────────────────── */

/** How a surface finish responds to light, independent of its colour pattern. */
export interface SurfacePbrProps {
  roughness: number;
  metalness: number;
  /**
   * Depth of the normal map derived from the surface's own painted pattern.
   * 0 disables relief entirely (the pattern is flat paint).
   */
  normalStrength: number;
}

/**
 * Light response per `SurfaceType`.
 *
 * Replaces two inline ternaries in `buildSurfaceMaterial` that special-cased
 * only `metal` and `ice` and gave the other eleven surfaces one shared value —
 * so concrete, sand and lava rock all shaded like smooth plastic.
 *
 * `normalStrength` drives a normal map generated from each surface's own
 * painted canvas (see `_paintNormal`), which costs no downloaded assets. The
 * flat pattern finishes keep a low value because a checker or grid is paint on
 * a smooth shell, not moulded relief; the granular materials get the most,
 * because their patterns really do describe surface roughness.
 */
export const SURFACE_PBR: Record<SurfaceType, SurfacePbrProps> = {
  plain:      { roughness: 0.65, metalness: 0.08, normalStrength: 0.00 },
  checker:    { roughness: 0.60, metalness: 0.08, normalStrength: 0.15 },
  grid:       { roughness: 0.60, metalness: 0.08, normalStrength: 0.25 },
  hex:        { roughness: 0.60, metalness: 0.08, normalStrength: 0.25 },
  stripes:    { roughness: 0.60, metalness: 0.08, normalStrength: 0.20 },
  dots:       { roughness: 0.60, metalness: 0.08, normalStrength: 0.30 },
  custom_png: { roughness: 0.65, metalness: 0.08, normalStrength: 0.00 },
  concrete:   { roughness: 0.92, metalness: 0.02, normalStrength: 0.85 },
  metal:      { roughness: 0.25, metalness: 0.70, normalStrength: 0.30 },
  wood:       { roughness: 0.75, metalness: 0.02, normalStrength: 0.55 },
  ice:        { roughness: 0.10, metalness: 0.10, normalStrength: 0.20 },
  sand:       { roughness: 0.95, metalness: 0.01, normalStrength: 1.00 },
  lava_rock:  { roughness: 0.88, metalness: 0.03, normalStrength: 0.90 },
} as const;

/* ── Buff-zone duration tier presets ────────────────────────────────────── */
export const BUFF_TIER_PRESETS: Record<'sand' | 'lava' | 'ice' | 'water' | 'oil', TrapDurationTier[]> = {
  sand: [
    { thresholdSeconds: 0, tierEffect: 'friction'    as TrapTierEffect, rpmLossFactor: 0.02, speedFactor: 0.90, notes: 'Light friction' },
    { thresholdSeconds: 5, tierEffect: 'sand_pile'   as TrapTierEffect, rpmLossFactor: 0.05, speedFactor: 0.60, notes: 'Sand piles up' },
  ],
  lava: [
    { thresholdSeconds: 0, tierEffect: 'burn_damage' as TrapTierEffect, rpmLossFactor: 0.10, speedFactor: 1.00, notes: 'Burning' },
    { thresholdSeconds: 3, tierEffect: 'burn_damage' as TrapTierEffect, rpmLossFactor: 0.25, speedFactor: 1.00, notes: 'Intense burn' },
  ],
  ice: [
    { thresholdSeconds: 0, tierEffect: 'friction'    as TrapTierEffect, rpmLossFactor: 0.00, speedFactor: 1.10, notes: 'Slippery' },
    { thresholdSeconds: 2, tierEffect: 'chill'       as TrapTierEffect, rpmLossFactor: 0.03, speedFactor: 0.80, notes: 'Chilled' },
    { thresholdSeconds: 5, tierEffect: 'freeze'      as TrapTierEffect, rpmLossFactor: 0.50, speedFactor: 0.00, notes: 'Frozen!' },
  ],
  water: [
    { thresholdSeconds: 0, tierEffect: 'slow'        as TrapTierEffect, rpmLossFactor: 0.03, speedFactor: 0.75, notes: 'Water resistance' },
  ],
  oil: [
    { thresholdSeconds: 0, tierEffect: 'friction'    as TrapTierEffect, rpmLossFactor: 0.00, speedFactor: 1.20, notes: 'Slick oil' },
    { thresholdSeconds: 3, tierEffect: 'slow'        as TrapTierEffect, rpmLossFactor: 0.02, speedFactor: 0.85, notes: 'Oil coated' },
  ],
};

/* ── Pit / zone depth constraints ───────────────────────────────────────── */
export const MIN_ZONE_DEPTH  = 0.1;  // cm — 1 mm minimum zone depth
export const PIT_FIXED_DEPTH = 10;   // cm — pits are always exactly 10 cm deep

/* ── Wall constants ──────────────────────────────────────────────────────── */
export const MIN_WALL_HEIGHT       = 10;  // cm
export const DEFAULT_WALL_HEIGHT   = 10;  // cm
export const MIN_WALL_GAP          = 10;  // cm — minimum gap and panel width
export const DEFAULT_WALL_PANEL_W  = 20;  // cm
export const DEFAULT_WALL_GAP_W    = 10;  // cm
export const WALL_ARC_STEP_DEG     = 5;   // degrees — rim sampling resolution for walls

/* ── Bridge / segment constants ─────────────────────────────────────────── */
export const DEFAULT_BRIDGE_WIDTH      = 5;   // cm
export const DEFAULT_BRIDGE_DEPTH      = 5;   // cm (u_channel default depth)
export const DEFAULT_SEGMENT_LENGTH    = 10;  // cm
export const DEFAULT_CURVE_RADIUS      = 20;  // cm
export const DEFAULT_CURVE_ANGLE       = 90;  // degrees
export const DEFAULT_LOOP_RADIUS       = 15;  // cm
export const DEFAULT_HAIRPIN_RADIUS    = 10;  // cm
export const DEFAULT_CORKSCREW_LENGTH  = 30;  // cm
export const BRIDGE_SEGMENT_SAMPLES    = 64;  // path sample points per segment
export const BRIDGE_LOOP_SEGMENTS      = 48;  // facets around loop circle
export const BRIDGE_LOOP_OPEN_DEG      = 40;  // degrees kept open at loop entry/exit so the opening is visible
export const BRIDGE_CROSS_COLS         = 8;   // tessellation columns across bridge width

/* ── Step / spiral wall profile defaults ────────────────────────────────── */
export const DEFAULT_STEP_COUNT         = 3;
export const DEFAULT_STEP_START_DEPTH   = 0;
export const DEFAULT_STEP_RISER         = 'parabolic' as const;
export const DEFAULT_RAMP_ANGLE         = 0;
export const DEFAULT_RAMP_WIDTH         = 60;
export const DEFAULT_STEP_ARC_DIVISIONS = 4 as const;
export const MIN_STEP_WIDTH_CM          = 2;
export const STEP_SLOPE_FRAC            = 0.4;   // fraction of each step's radial width that is the riser
export const DEFAULT_SPIRAL_TURNS       = 1;
export const DEFAULT_SPIRAL_COUNT       = 1;
export const DEFAULT_SPIRAL_LEDGE_W     = 3;
export const DEFAULT_SPIRAL_LEDGE_H     = 1;
export const DEFAULT_SPIRAL_RADIUS_FRAC = 0.85;
export const STEP_RING_SEGS             = 96;
export const SPIRAL_SEGS_PER_TURN       = 96;

/* ── BB-10 five-zone cross-section ──────────────────────────────────────────
   The real "BeyStadium Attack Type" radial profile, from
   `case study/10 case study.md` Case 545, tagged [REAL-WORLD CONFIRMED].

   This is the first NON-MONOTONIC radial profile in the project. Every other
   profile (parabolic, straight, step, spiral) descends monotonically from rim
   to centre, which made a Tornado Ridge inexpressible — and the ridge is the
   single feature that actually shapes attack-type movement. A moat does not
   substitute: it raises the whole inner region into a plateau, the opposite
   topology (centre becomes the HIGHEST point, where BB-10's centre is lowest).

   Source measurements at R_outer = 170 mm, converted to fractions of R so the
   profile scales to our anime-sized arenas (Sec. H5: anime scale is canonical):

     Zone 1  Flat centre      r = 0    - 40 mm    0.000 - 0.235 R   0 deg
     Zone 2  Main slope       r = 40   - 125 mm   0.235 - 0.735 R   ~30 deg
     Zone 3  Tornado Ridge    r = 125  - 145 mm   0.735 - 0.853 R   face 16.7 deg
     Zone 4  Second incline   r = 145  - 155 mm   0.853 - 0.912 R   ~50 deg
     Zone 5  Outer wall       r = 155  - 170 mm   0.912 - 1.000 R   vertical

   Depth budget: zone 2 rises 85*tan(30) = 49.1 mm, zone 4 rises
   10*tan(50) = 11.9 mm, so rim-to-floor = 61.0 mm. Those two are expressed
   below as fractions of the authored `depth`, and the 3 mm ridge as 3/61.

   The ridge is deliberately a LINEAR (triangular) bump, not a smoothed hump:
   Case 546 derives the impulse split from the face angle
   beta = atan(h_TR / w_half) = atan(3/10) = 16.7 deg, and smoothing would
   change beta and therefore every number in that derivation. Zone 3's bounds
   are exactly peak +- w_half, so the triangle and the zone coincide.

   Zone 5 is intentionally NOT part of the bowl surface: the vertical wall is a
   WallData feature (with its own collision), not bowl geometry. The surface
   function flattens to rim level there.
   ────────────────────────────────────────────────────────────────────────── */
export const BB10 = {
  R_FLAT_END:      40  / 170,   // 0.2353 — flat centre ends
  R_SLOPE_END:     125 / 170,   // 0.7353 — 30deg slope ends / ridge begins
  R_RIDGE_PEAK:    135 / 170,   // 0.7941 — ridge crest
  R_RIDGE_END:     145 / 170,   // 0.8529 — ridge ends / 50deg incline begins
  R_INCLINE_END:   155 / 170,   // 0.9118 — incline ends / vertical wall begins
  /** Fraction of total depth climbed across zone 2 (49.1 of 61.0 mm). */
  RISE_SLOPE:      49.1 / 61.0, // 0.8049
  /** Ridge crest height above the local surface, as a fraction of depth (3/61). */
  RIDGE_HEIGHT:    3.0  / 61.0, // 0.0492
  /** Documented ridge face angle, for the Case 546 impulse split. */
  RIDGE_FACE_DEG:  16.7,
} as const;

/* ── Tessellation quality ────────────────────────────────────────────────── */
export const TESS = {
  PARABOLIC_BOWL: 64,   // ring count; doubles to 128 when pit/zone holes present
  STRAIGHT_BOWL:  48,   // ring count; doubles to 128 when holes present
  // BB-10 needs more rings than a smooth parabola: the Tornado Ridge spans only
  // ~12% of the radius (0.735 -> 0.853 R), so at 64 rings it would get ~7 rings
  // and visibly facet the one feature the profile exists for. 160 gives it ~19.
  BB10_BOWL:      160,
  SCOOP_RINGS:    36,
  SCOOP_WALLS:    6,
  MOAT_HALF:      20,   // rings per moat section (outer or inner)
  FILL_DISC:      64,
} as const;

/* ── Speed line constants ────────────────────────────────────────────────── */
export const SL = {
  SURFACE_LIFT:       0.05,
  SUB_STEPS_PER_SEG:  8,
  ARROW_SPACING:      12,
  ARROW_HALF_W:       0.8,
  ARROW_LEN:          2.0,
  MARKER_SIZE:        1.5,
  OVERLAP_THRESHOLD:  1.5,
  OVERLAP_SPHERE_R:   1.2,
  OVERLAP_SAMPLE_N:   100,
  WIDTH_MIN: 0.5,   WIDTH_MAX: 5.0,
  SPEED_MULT_MIN: 0.5, SPEED_MULT_MAX: 5.0,
  LAUNCH_FORCE_MIN: 0.0, LAUNCH_FORCE_MAX: 5.0,
  SWAP_PRIORITY_MIN: 0, SWAP_PRIORITY_MAX: 10,

  HANDLE_RADIUS:       1.2,
  HANDLE_COLOR:        0x00aaff,
  HANDLE_HOVER_COLOR:  0x00ffff,
  HANDLE_ACTIVE_COLOR: 0xffffff,

  INACTIVE_OPACITY_MULT: 0.4,

  DEFAULT_SEG_LENGTH:      8.0,
  DEFAULT_WIDTH:           1.5,
  DEFAULT_COLOR:           0xffdd00,
  DEFAULT_OPACITY:         0.85,
  DEFAULT_SPEED_MULT:      1.5,
  DEFAULT_DIRECTION:       'forward'   as const,
  DEFAULT_EXIT:            'normal'    as const,
  DEFAULT_LAUNCH_FORCE:    1.0,
  DEFAULT_SWAP_PRIORITY:   5,
  DEFAULT_TARGET:          'beyblade'  as const,
  DEFAULT_ACTIVATION:      'always'    as const,
  DEFAULT_PERIOD_MS:       2000,
  DEFAULT_DUTY:            0.5,
  DEFAULT_FADE_MS:         300,
  DEFAULT_PROX_RADIUS:     10,
  DEFAULT_OSC_AMP:         2.0,
  DEFAULT_OSC_FREQ:        0.5,
  DEFAULT_OSC_PHASE:       0,
  DEFAULT_OSC_AXIS:        'lateral'   as const,

  WIDTH_MAX_OVERRIDE:         30.0,
  POINT_ZONE_DIAMETER_MIN:     0.1,
  POINT_ZONE_DIAMETER_MAX:    30.0,
  STAT_MULT_MIN:               0.0,
  STAT_MULT_MAX:               5.0,
  PRESET_STEPS_MIN:            3,
  PRESET_STEPS_MAX:          120,
  PRESET_SIDES_MIN:            3,
  PRESET_SIDES_MAX:           10,
  PRESET_PETALS_MIN:           3,
  PRESET_PETALS_MAX:           8,
  PRESET_TURNS_MIN:            0.5,
  PRESET_TURNS_MAX:           10,
  PRESET_RADIUS_DEF:          20,
  PRESET_STEPS_DEF:           36,
  RAMP_STEPS_MAX:             20,
  DEFAULT_SURFACE_OFFSET:      0.05,
  DEFAULT_CONDITION_CHECK_MS: 100,
} as const;

/* ── Jump link constants ─────────────────────────────────────────────────── */
export const JL = {
  DEFAULT_COLOR:        0x00ff88,
  DEFAULT_GLOW:         0x00dd66,
  DEFAULT_DISC_RADIUS:  8,      // cm
  DEFAULT_ARC_HEIGHT:   40,     // cm above midpoint apex
  DEFAULT_OPACITY:      0.85,
  DISC_HEIGHT:          1.5,    // cm — disc plate thickness
  ARC_SAMPLES:          32,     // points sampled for trajectory preview
  ARROW_COUNT:          4,      // direction cones along arc
  ARROW_HALF_W:         1.2,    // cm
  ARROW_LEN:            3.0,    // cm
  GLOW_INTENSITY:       0.8,
  DEFAULT_LAUNCH_ANGLE: 45,     // degrees above horizontal
  DEFAULT_LAUNCH_FORCE: 300,    // cm/s initial velocity magnitude
  DEFAULT_GRAVITY:      1.0,
  DEFAULT_AIR_DRAG:     0.02,
  DEFAULT_IMPACT:       0.3,
  DEFAULT_BOUNCE:       0.1,
  DEFAULT_PROX_RADIUS:  12,     // cm
  DEFAULT_ARC_DURATION: 800,    // ms travel time
} as const;

/* ── Visual theme quick-pick presets ────────────────────────────────────── */
export interface VisualTheme {
  color: number;
  surface: SurfaceType;
  emissiveColor: number;
  emissiveIntensity: number;
  baseMaterial: ArenaMaterial;
  tileScale: number;
}

export const VISUAL_THEME_PRESETS: Record<string, VisualTheme> = {
  neon:   { color: 0x00e5ff, surface: 'plain',    emissiveColor: 0x00e5ff, emissiveIntensity: 0.8, baseMaterial: 'abs',    tileScale: 1 },
  steel:  { color: 0x888899, surface: 'metal',    emissiveColor: 0x000000, emissiveIntensity: 0,   baseMaterial: 'metal',  tileScale: 1 },
  magma:  { color: 0xff4400, surface: 'lava_rock', emissiveColor: 0xff2200, emissiveIntensity: 0.4, baseMaterial: 'stone',  tileScale: 1 },
  ice:    { color: 0xaaddff, surface: 'ice',      emissiveColor: 0x88bbff, emissiveIntensity: 0.3, baseMaterial: 'abs',    tileScale: 1 },
  wood:   { color: 0xc8844a, surface: 'wood',     emissiveColor: 0x000000, emissiveIntensity: 0,   baseMaterial: 'abs',    tileScale: 1 },
  void:   { color: 0x220044, surface: 'plain',    emissiveColor: 0x6600ff, emissiveIntensity: 0.6, baseMaterial: 'abs',    tileScale: 1 },
  rubber: { color: 0x222222, surface: 'plain',    emissiveColor: 0x000000, emissiveIntensity: 0,   baseMaterial: 'rubber', tileScale: 1 },
};

/* ── Per-arena PointLight presets ───────────────────────────────────────── */
export interface ArenaLightPreset {
  color: number;
  intensity: number;
  posY: number;
  range: number;
}

export const ARENA_LIGHT_PRESETS: Record<string, ArenaLightPreset> = {
  none:    { color: 0xffffff, intensity: 0,   posY: 40, range: 200 },
  volcano: { color: 0xff3300, intensity: 1.5, posY: 40, range: 180 },
  ice:     { color: 0x44aaff, intensity: 1.2, posY: 40, range: 200 },
  void:    { color: 0x8800ff, intensity: 1.0, posY: 40, range: 150 },
  neon:    { color: 0x00ffcc, intensity: 1.5, posY: 40, range: 200 },
  gold:    { color: 0xffaa00, intensity: 1.2, posY: 40, range: 180 },
};

/* ── Rotation animation constants ───────────────────────────────────────── */
export const ROT = {
  DEFAULT_SPEED:    30,    // deg/s
  DEFAULT_OSC_AMP:  45,    // degrees half-swing
  DEFAULT_OSC_FREQ:  0.5,  // Hz
  MIN_SPEED:          0,
  MAX_SPEED:        720,
} as const;

/* ── Arena environment constants ─────────────────────────────────────────── */
export const ENV = {
  DEFAULT_GRAVITY_SCALE:      1.0,
  MIN_GRAVITY_SCALE:          0.0,
  MAX_GRAVITY_SCALE:          5.0,
  DEFAULT_TILT:               0,
  MAX_TILT:                   30,
  DEFAULT_FOG_DENSITY:        0,
  DEFAULT_SCORE_MULTIPLIER:   1.0,
  DEFAULT_WEIGHT_SENSITIVITY: 1.0,
  DEFAULT_WEIGHT_DAMPENING:   0.5,
  DEFAULT_INTERVAL_SEC:       10,
  DEFAULT_REVERT_SEC:         0,
} as const;

export const TRANS = {
  DEFAULT_DURATION_MS:  2000,
  DEFAULT_EASING:       'linear'   as const,
  DEFAULT_LOOP:         'pingpong' as const,
  MIN_DURATION_MS:      100,
  MAX_DURATION_MS:      60000,
} as const;

/* ── Octagon base — frozen default, never mutate ─────────────────────────
   ArenaSandbox stores a mutable copy in this.baseConfig; this is only the
   default seed value. The `as const` makes TypeScript enforce that nobody
   writes OCTAGON_BASE.X = … anywhere.
────────────────────────────────────────────────────────────────────────── */
export const OCTAGON_BASE = {
  radius: APOTHEM / Math.cos(Math.PI / DEFAULT_BASE_SIDES),
  height: DEFAULT_BASE_HEIGHT,
  sides:  DEFAULT_BASE_SIDES,
  align:  Math.PI / DEFAULT_BASE_SIDES,
} as const;

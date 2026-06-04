/* ── Math / unit constants ──────────────────────────────────────────────── */
export const TWO_PI  = Math.PI * 2;
export const DEG2RAD = Math.PI / 180;
export const APOTHEM = 100; // cm — octagon inradius (flat-to-flat half-width)

/* ── Default base platform config ───────────────────────────────────────── */
export const DEFAULT_BASE_HEIGHT = 30;     // cm — octagon top face world Y
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
export const ARENA_SAVE_VERSION = 7;

/* ── Arena physical material default ────────────────────────────────────── */
export const DEFAULT_ARENA_MATERIAL = 'abs' as const;

/* ── Obstacle constants ──────────────────────────────────────────────────── */
export const MIN_OBSTACLE_DIM     = 10;   // cm — minimum any obstacle dimension
export const DEFAULT_OBSTACLE_DIM = 20;   // cm — default cube side length

/* ── Trap constants ──────────────────────────────────────────────────────── */
export const MIN_TRAP_DIM         = 10;   // cm — minimum footprint dimension
export const DEFAULT_TRAP_DIM_X   = 20;   // cm
export const DEFAULT_TRAP_DIM_Z   = 20;   // cm
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
import type { ArenaMaterial, ArenaMaterialProps, TrapDurationTier, TrapTierEffect } from '../types/arenaTypes';

export const ARENA_MATERIAL_PRESETS: Record<ArenaMaterial, ArenaMaterialProps> = {
  // Walls: rubber|stone|abs|metal  Bridges: stone|abs|metal
  rubber: { restitution: 0.15, spinLossFactor: 0.05, damageFactor: 0.20 },
  stone:  { restitution: 0.40, spinLossFactor: 0.12, damageFactor: 0.55 },
  abs:    { restitution: 0.65, spinLossFactor: 0.15, damageFactor: 0.70 },
  metal:  { restitution: 0.90, spinLossFactor: 0.20, damageFactor: 1.00 },
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

/* ── Wall constants ──────────────────────────────────────────────────────── */
export const MIN_WALL_HEIGHT       = 10;  // cm
export const DEFAULT_WALL_HEIGHT   = 10;  // cm
export const MIN_WALL_GAP          = 10;  // cm — minimum gap and panel width
export const DEFAULT_WALL_PANEL_W  = 20;  // cm
export const DEFAULT_WALL_GAP_W    = 10;  // cm
export const WALL_ARC_STEP_DEG     = 5;   // degrees — rim sampling resolution for walls

/* ── Bridge / segment constants ─────────────────────────────────────────── */
export const DEFAULT_BRIDGE_WIDTH      = 10;  // cm
export const DEFAULT_BRIDGE_DEPTH      = 5;   // cm (u_channel default depth)
export const DEFAULT_SEGMENT_LENGTH    = 30;  // cm
export const DEFAULT_CURVE_RADIUS      = 20;  // cm
export const DEFAULT_CURVE_ANGLE       = 90;  // degrees
export const DEFAULT_LOOP_RADIUS       = 15;  // cm
export const DEFAULT_HAIRPIN_RADIUS    = 10;  // cm
export const DEFAULT_CORKSCREW_LENGTH  = 30;  // cm
export const BRIDGE_SEGMENT_SAMPLES    = 64;  // path sample points per segment
export const BRIDGE_LOOP_SEGMENTS      = 48;  // facets around loop circle
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

/* ── Tessellation quality ────────────────────────────────────────────────── */
export const TESS = {
  PARABOLIC_BOWL: 64,   // ring count; doubles to 128 when pit/zone holes present
  STRAIGHT_BOWL:  48,   // ring count; doubles to 128 when holes present
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
} as const;

/* ── Rotation animation constants ───────────────────────────────────────── */
export const ROT = {
  DEFAULT_SPEED:    30,    // deg/s
  DEFAULT_OSC_AMP:  45,    // degrees half-swing
  DEFAULT_OSC_FREQ:  0.5,  // Hz
  MIN_SPEED:          0,
  MAX_SPEED:        720,
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

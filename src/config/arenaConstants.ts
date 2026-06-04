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
export const ARENA_SAVE_VERSION = 5;

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

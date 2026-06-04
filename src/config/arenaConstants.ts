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
export const SEAM_OVERHANG            = RIM_EPS * 3; // cm — seam-ring outward extension onto arena surface

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

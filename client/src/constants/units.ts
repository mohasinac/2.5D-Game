// Canonical unit system for the client.
// World unit is centimeters.
//
// Design:
//   PX_PER_CM_BASE  = 24   — reference render px/cm at REFERENCE_VMIN (1080).
//                            Also the fixed server physics constant (never changes).
//   REFERENCE_VMIN  = 1080 — viewport short-axis reference for render scaling.
//   cachedPxPerCm          — live render scale; vmin-proportional so the arena
//                            always occupies the same fraction of the viewport:
//                              pxPerCm = 24 × (vmin / 1080)
//   getPxPerCm()           — returns cachedPxPerCm (vmin-scaled render value)
//   PHYSICS_SCALE   = 16   — server physics space multiplier (never changes)
//
// Physics conversions (cmToPhysics, physicsToCm) always use the FIXED
// PX_PER_CM_BASE so server determinism is preserved regardless of screen size.

export const PX_PER_CM_BASE = 24;    // reference px/cm — use for storage/physics ONLY
export const REFERENCE_VMIN = 1080;  // viewport short-axis at which PX_PER_CM_BASE applies
export const PHYSICS_SCALE  = 16;    // server physics multiplier (arena_px * 16 = physics coords)
export const MM_PER_CM = 10;
export const CM_PER_M  = 100;

let cachedPxPerCm = PX_PER_CM_BASE;

/**
 * Recomputes the client render scale so that the arena always occupies the same
 * fraction of the viewport on every screen size.
 *
 * Rule: 1 cm = (vmin / REFERENCE_VMIN) × PX_PER_CM_BASE px on screen.
 *   – At 1080 p (vmin = 1080): 24 px/cm  (reference, unchanged)
 *   – At 4 K   (vmin = 2160): 48 px/cm  (fills screen proportionally)
 *   – At 720 p (vmin =  720): 16 px/cm  (same arena fraction, compact)
 *
 * Physics conversions (cmToPhysics / physicsToCm) always use the fixed
 * PX_PER_CM_BASE constant so server determinism is preserved.
 *
 * Called by PixiRenderer on every canvas resize (init, setupArena, resize()).
 * Falls back to PX_PER_CM_BASE when no dimensions are provided.
 */
export function recomputePxPerCm(screenW?: number, screenH?: number): number {
  if (screenW !== undefined && screenH !== undefined && screenW > 0 && screenH > 0) {
    const vmin = Math.min(screenW, screenH);
    cachedPxPerCm = PX_PER_CM_BASE * (vmin / REFERENCE_VMIN);
  } else {
    cachedPxPerCm = PX_PER_CM_BASE;
  }
  return cachedPxPerCm;
}

export function getPxPerCm(): number {
  return cachedPxPerCm;
}

// ── Convenience helpers (use the LIVE cachedPxPerCm) ─────────────────────────
export const cmToPx      = (cm: number): number => cm * cachedPxPerCm;
export const pxToCm      = (px: number): number => px / cachedPxPerCm;
export const mmToCm      = (mm: number): number => mm / MM_PER_CM;
export const cmToMm      = (cm: number): number => cm * MM_PER_CM;

// Physics conversions use PX_PER_CM_BASE (server-fixed) — never viewport-relative.
export const cmToPhysics = (cm: number): number => cm * PX_PER_CM_BASE * PHYSICS_SCALE;
export const physicsToCm = (p:  number): number => p  / (PX_PER_CM_BASE * PHYSICS_SCALE);

// Effective scale at a given zoom level.
export const effectivePxPerCm = (zoom: number): number => cachedPxPerCm * zoom;

// pxPerCm is fixed — no resize listener needed.

/**
 * Returns the screen-Y offset (in world-px) for an element sitting at `z_cm` above the
 * arena floor, given the arena's tilt angle in degrees.
 *
 * In a tilted 2.5D arena the floor projects onto the screen at a foreshortened angle.
 * Anything raised above z=0 appears shifted *toward the viewer* — i.e. upward on screen.
 * The shift magnitude is z_cm × PX_PER_CM × sin(tiltAngle), and it is *negative* in
 * canvas coordinates (negative Y = upward).
 *
 * Usage inside arenaTiltInner:
 *   sprite.y += zToScreenOffset(z_cm, tiltAngle_deg);
 *
 * At tiltAngle=0 (flat) the offset is 0 — no height shift.
 * At tiltAngle=90 (wall-ride) the shift equals the full physical height in px.
 */
export function zToScreenOffset(z_cm: number, tiltAngle_deg: number): number {
  if (z_cm === 0 || tiltAngle_deg === 0) return 0;
  return -(z_cm * PX_PER_CM_BASE * Math.sin((tiltAngle_deg * Math.PI) / 180));
}

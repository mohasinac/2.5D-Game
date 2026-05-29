// Canonical unit system for the client.
// World unit is centimeters. pxPerCm is FIXED at PX_PER_CM_BASE (24) — never
// viewport-relative. Changing viewport size changes the visible world area (more
// or less of the arena is visible), not the size of world objects. This prevents
// warping: a circle stays a circle on any viewport shape.
//
// Design:
//   PX_PER_CM_BASE  = 24   — always 1cm = 24px (constant, device-independent)
//   REFERENCE_VMIN  = 1080 — kept for physics/seed compatibility only
//   getPxPerCm()           — always returns PX_PER_CM_BASE (24)
//   PHYSICS_SCALE   = 16   — server physics space multiplier (never changes)
//
// Zoom is the only mechanism that changes how large world objects appear on screen.
// On viewport resize the camera zoom limits are recomputed so the arena still fits,
// but pxPerCm itself is invariant.

export const PX_PER_CM_BASE = 24;    // reference px/cm — use for storage/physics ONLY
export const REFERENCE_VMIN = 1080;  // viewport short-axis at which PX_PER_CM_BASE applies
export const PHYSICS_SCALE  = 16;    // server physics multiplier (arena_px * 16 = physics coords)
export const MM_PER_CM = 10;
export const CM_PER_M  = 100;

let cachedPxPerCm = PX_PER_CM_BASE;

/**
 * No-op kept for API compatibility — pxPerCm is always PX_PER_CM_BASE (24).
 * Viewport size does NOT affect px/cm; it affects how much of the world is visible.
 */
export function recomputePxPerCm(_screenW?: number, _screenH?: number): number {
  cachedPxPerCm = PX_PER_CM_BASE;
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

// Canonical unit system for the client.
// World unit is centimeters. Render scale adapts to viewport so the game looks
// consistent across all screen sizes (mobile, desktop, 4K, ultrawide).
//
// Design:
//   PX_PER_CM_BASE  = 24   — fixed reference: 1cm at REFERENCE_VMIN viewport height
//   REFERENCE_VMIN  = 1080 — short axis (px) at which PX_PER_CM_BASE applies
//   getPxPerCm()           — live value, scales with viewport short-axis
//   PHYSICS_SCALE   = 16   — server physics space multiplier (never changes)
//
// At 1080px short-axis  → getPxPerCm() == 24  (reference, same as before)
// At 375px  mobile      → getPxPerCm() ≈ 8.3  (world shrinks to fit)
// At 2160px 4K          → getPxPerCm() ≈ 48   (world expands to fill)

export const PX_PER_CM_BASE = 24;    // reference px/cm — use for storage/physics ONLY
export const REFERENCE_VMIN = 1080;  // viewport short-axis at which PX_PER_CM_BASE applies
export const PHYSICS_SCALE  = 16;    // server physics multiplier (arena_px * 16 = physics coords)
export const MM_PER_CM = 10;
export const CM_PER_M  = 100;

let cachedPxPerCm = PX_PER_CM_BASE;

/**
 * Recompute the live px/cm ratio from viewport dimensions.
 * Optionally pass the renderer's own screen size for accuracy when the game
 * canvas doesn't fill the entire browser window.
 * Called automatically on window resize and from WorldTransform.setScreen().
 */
export function recomputePxPerCm(screenW?: number, screenH?: number): number {
  const sw = screenW ?? (typeof window !== "undefined" ? window.innerWidth  : REFERENCE_VMIN);
  const sh = screenH ?? (typeof window !== "undefined" ? window.innerHeight : REFERENCE_VMIN);
  const vmin = Math.min(sw, sh);
  // Floor at 4 to avoid divide-by-zero in tiny iframes / test environments.
  cachedPxPerCm = Math.max(4, (vmin / REFERENCE_VMIN) * PX_PER_CM_BASE);
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

// ── Global resize listener ────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  recomputePxPerCm();
  window.addEventListener("resize", () => recomputePxPerCm());
}

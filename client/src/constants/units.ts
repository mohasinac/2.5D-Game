// Canonical unit system for the client.
// World unit is centimeters. Render scale adapts to the browser's root font-size so
// the world appears consistently across DPI / accessibility-zoom settings.
// See plan: Parts 1 + 1b.

export const PX_PER_CM_BASE = 24;         // 1cm = 24px at 16px root font
export const PHYSICS_SCALE = 16;
export const MM_PER_CM = 10;
export const CM_PER_M = 100;

// Browser-adaptive scale. Recomputed on window.resize / theme change.
// 1 cm ≈ 1.5rem ⇒ on default 16px root → 24px (matches today's hard-coded scale).
const REM_TO_CM_FACTOR = 1.5;

let cachedRootRemPx = 16;
let cachedPxPerCm = PX_PER_CM_BASE;

export function getRootRemPx(): number {
  if (typeof window === "undefined" || typeof document === "undefined") return 16;
  const html = document.documentElement;
  const v = parseFloat(getComputedStyle(html).fontSize);
  return Number.isFinite(v) && v > 0 ? v : 16;
}

export function recomputePxPerCm(): number {
  cachedRootRemPx = getRootRemPx();
  cachedPxPerCm = REM_TO_CM_FACTOR * cachedRootRemPx;
  return cachedPxPerCm;
}

export function getPxPerCm(): number {
  return cachedPxPerCm;
}

export function getRemPerCm(): number {
  return REM_TO_CM_FACTOR;
}

// Convenience helpers — base scale (no zoom).
export const cmToPx = (cm: number): number => cm * cachedPxPerCm;
export const pxToCm = (px: number): number => px / cachedPxPerCm;
export const mmToCm = (mm: number): number => mm / MM_PER_CM;
export const cmToMm = (cm: number): number => cm * MM_PER_CM;
export const cmToPhysics = (cm: number): number => cm * PX_PER_CM_BASE * PHYSICS_SCALE;
export const physicsToCm = (p: number): number => p / (PX_PER_CM_BASE * PHYSICS_SCALE);

// Effective scale at a given zoom level (used by the renderer).
export const effectivePxPerCm = (zoom: number): number => cachedPxPerCm * zoom;

// Wire up resize listener once at module load.
if (typeof window !== "undefined") {
  recomputePxPerCm();
  window.addEventListener("resize", recomputePxPerCm);
}

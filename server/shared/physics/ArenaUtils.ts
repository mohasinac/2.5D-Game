// Shared arena bowl-shape utilities. Extracted from the duplicate definitions
// in TryoutRoom / BattleRoom / AIBattleRoom / TournamentBattleRoom.

import type { ArenaConfig } from "../../types/shared";

// Mapping from preset profile name → wall angle in degrees.
export const BOWL_PROFILE_ANGLES: Record<string, number> = {
  flat: 0,
  shallow: 20,
  medium: 40,
  deep: 60,
  steep: 75,
};

// Resolve wall angle from arena config — explicit value wins over bowl profile preset.
export function resolveWallAngle(arenaData: ArenaConfig): number {
  if (arenaData.wallAngle !== undefined) return arenaData.wallAngle;
  return BOWL_PROFILE_ANGLES[arenaData.bowlProfile ?? "medium"] ?? 40;
}

// Bowl-shape multiplier: steeper wall (higher wallAngle) pushes beys more strongly to center.
//   wallAngle=0  → ×1.0 (flat / vertical wall — pre-bowl behavior)
//   wallAngle=75 → ×1.8 (steep cup, strong inward push)
export function wallBowlForce(baseForce: number, wallAngle: number): number {
  const rad = (wallAngle * Math.PI) / 180;
  return baseForce * (1.0 + Math.sin(rad) * 0.8);
}

// ── Bowl floor angle at a given radial distance ─────────────────────────────
// Linear interpolation: flat at center (0°), wallAngle at rim.
// Used to scale spin decay by cos(α) — reduced normal force on slopes.
export function getFloorAngleAtRadius(
  radialDistance: number,
  arenaRadius: number,
  wallAngleDeg: number,
): number {
  if (wallAngleDeg <= 0 || arenaRadius <= 0) return 0;
  const t = Math.min(1, Math.max(0, radialDistance / arenaRadius));
  return (wallAngleDeg * Math.PI) / 180 * t;
}

// ── Arena Tilt lateral gravity ───────────────────────────────────────────────
// Tuned so 90° tilt ≈ 15× the max wobble force — noticeable drift without being
// overwhelming at shallow angles (≤30°).
const TILT_GRAVITY_SCALE = 0.04;

/**
 * Compute the 2-D lateral force vector that arena tilt exerts on a beyblade.
 *
 * @param tiltAngleDeg  0=flat, 90=vertical wall-ride, 180=fully inverted.
 * @param tiltDirDeg    Downhill azimuth: 0=right (+X), 90=down (+Y), 180=left, 270=up.
 * @param mass          Matter.js body mass (same units used by applyForce).
 * @returns {fx, fy}    Force to pass to physicsEngine.applyForce().
 */
export function computeTiltForce(
  tiltAngleDeg: number,
  tiltDirDeg: number,
  mass: number
): { fx: number; fy: number } {
  if (tiltAngleDeg === 0 || tiltAngleDeg === 360) return { fx: 0, fy: 0 };
  const tiltRad = (tiltAngleDeg * Math.PI) / 180;
  const dirRad  = (tiltDirDeg  * Math.PI) / 180;
  const magnitude = Math.sin(tiltRad) * TILT_GRAVITY_SCALE * mass;
  return {
    fx: Math.cos(dirRad) * magnitude,
    fy: Math.sin(dirRad) * magnitude,
  };
}


// ─── Player Authority Multiplier (Phase 25) ───────────────────────────────────
// Returns a multiplier (0–2) for how much player input should be dampened
// by the current arena feature zone the bey is in.

export type AuthorityFeatureZone =
  | "railTrack" | "gravityWell" | "spinZone" | "pit" | "bump" | "obstacle" | "none";

export interface PlayerAuthorityConfig {
  globalMultiplier?: number;
  curvatureMultiplier?: number;
  featureOverrides?: Partial<Record<Exclude<AuthorityFeatureZone, "none">, number>>;
}

export function computeArenaAuthorityMultiplier(
  arenaConfig: ArenaConfig,
  zone: AuthorityFeatureZone,
): number {
  const cfg = (arenaConfig as any).playerAuthorityConfig as PlayerAuthorityConfig | undefined;
  if (!cfg) return 1.0;
  const base = cfg.globalMultiplier ?? 1.0;
  if (zone === "none") return base;
  const override = cfg.featureOverrides?.[zone];
  return override !== undefined ? base * override : base;
}

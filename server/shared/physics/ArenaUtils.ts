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

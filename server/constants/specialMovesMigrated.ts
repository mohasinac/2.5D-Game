// Bridge file: legacy SpecialMoveDef constants in old step format.
// Kept for reference only — roster is being redesigned via Case Study 11.

export interface SpecialMoveStep {
  action: string;
  params: Record<string, unknown>;
  durationMs?: number;
}

export interface SpecialMoveConfig {
  id: string;
  name: string;
  type: "attack" | "defense" | "stamina" | "balanced";
  powerCost: number;
  cooldownMs: number;
  steps: SpecialMoveStep[];
}

// REFERENCE EXAMPLE ONLY
export const SPECIAL_MOVES_MIGRATED: SpecialMoveConfig[] = [
  {
    id: "stampede_rush",
    name: "Stampede Rush",
    type: "attack",
    powerCost: 100,
    cooldownMs: 3000,
    steps: [
      { action: "velocity_burst", params: { forceX: 0.12, forceY: 0 } },
      { action: "attack_amplifier", params: { multiplier: 1.3 }, durationMs: 500 },
    ],
  },
];

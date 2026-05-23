// Bridge file: old SpecialMoveDef constants converted to Firestore SpecialMoveConfig format.

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

export const SPECIAL_MOVES_MIGRATED: SpecialMoveConfig[] = [
  {
    id: "stampede_rush",
    name: "Stampede Rush",
    type: "attack",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "velocity_burst", params: { forceX: 0.12, forceY: 0 } },
      { action: "attack_amplifier", params: { multiplier: 1.3 }, durationMs: 1000 },
    ],
  },
  {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    type: "defense",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "defense_stance", params: { durationMs: 1500 } },
    ],
  },
  {
    id: "spin_recovery",
    name: "Spin Recovery",
    type: "stamina",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "orbit_movement", params: { intensity: 0.003, direction: "cw" }, durationMs: 2000 },
      { action: "stamina_recovery", params: { recoveryRate: 30 }, durationMs: 2000 },
    ],
  },
  {
    id: "tactical_burst",
    name: "Tactical Burst",
    type: "balanced",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "velocity_burst", params: { forceX: 0.06, forceY: 0 } },
      { action: "stamina_recovery", params: { recoveryRate: 15 }, durationMs: 500 },
    ],
  },
];

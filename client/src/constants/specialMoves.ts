// Client mirror of the server special-moves seed.
// Used by SpecialMoveHUD and the admin special-move CRUD page.
// See plan Phase 9.

export type SpecialMoveKind =
  | "linear-burst"
  | "anchor"
  | "orbital"
  | "directional-burst"
  | "shockwave"
  | "custom";

export interface SpecialMoveDef {
  id: string;
  name: string;
  kind: SpecialMoveKind;
  iconEmoji: string;
  cooldownSec: number;
  durationMs: number;
  effects: {
    linearImpulse?: number;
    spinDelta?: number;
    invulnerabilityMs?: number;
    spinStealRadiusPx?: number;
    aoeRadiusPx?: number;
    knockbackImpulse?: number;
  };
  flashColor: string;
}

export const SPECIAL_MOVES: Record<string, SpecialMoveDef> = {
  stampede_rush: {
    id: "stampede_rush",
    name: "Stampede Rush",
    kind: "linear-burst",
    iconEmoji: "⚡",
    cooldownSec: 3,
    durationMs: 500,
    effects: { linearImpulse: 5000, invulnerabilityMs: 200, spinDelta: 60 },
    flashColor: "#ff5522",
  },
  gyro_anchor: {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    kind: "anchor",
    iconEmoji: "🛡️",
    cooldownSec: 4,
    durationMs: 1500,
    effects: { spinDelta: 250, invulnerabilityMs: 1500 },
    flashColor: "#4488ff",
  },
  spin_recovery: {
    id: "spin_recovery",
    name: "Spin Recovery",
    kind: "orbital",
    iconEmoji: "♻️",
    cooldownSec: 3,
    durationMs: 1000,
    effects: { spinDelta: 400 },
    flashColor: "#44ff88",
  },
  tactical_burst: {
    id: "tactical_burst",
    name: "Tactical Burst",
    kind: "directional-burst",
    iconEmoji: "💫",
    cooldownSec: 3,
    durationMs: 600,
    effects: { linearImpulse: 3500, spinDelta: 150 },
    flashColor: "#ffcc44",
  },
  shock_pulse: {
    id: "shock_pulse",
    name: "Shock Pulse",
    kind: "shockwave",
    iconEmoji: "💥",
    cooldownSec: 5,
    durationMs: 700,
    effects: { aoeRadiusPx: 250, knockbackImpulse: 6000, invulnerabilityMs: 250 },
    flashColor: "#ff44aa",
  },
};

export const DEFAULT_TYPE_TO_MOVE: Record<string, string> = {
  attack:   "stampede_rush",
  defense:  "gyro_anchor",
  stamina:  "spin_recovery",
  balanced: "tactical_burst",
};

export function getSpecialMoveById(id: string | undefined | null): SpecialMoveDef | null {
  if (!id) return null;
  return SPECIAL_MOVES[id] ?? null;
}

export function resolveSpecialMove(opts: {
  specialMoveId?: string | null;
  type?: string;
}): SpecialMoveDef {
  return (
    getSpecialMoveById(opts.specialMoveId) ??
    getSpecialMoveById(DEFAULT_TYPE_TO_MOVE[opts.type ?? "balanced"]) ??
    SPECIAL_MOVES.tactical_burst
  );
}

export type CpAttackType = "smash" | "upper" | "absorb" | "burst" | "spin_steal";

export const ATTACK_TYPE_MULTIPLIER: Record<CpAttackType, number> = {
  smash:      1.3,
  upper:      1.15,
  burst:      1.5,
  absorb:     0.5,
  spin_steal: 0.7,
};

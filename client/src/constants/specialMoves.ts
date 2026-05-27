// Client mirror of the server special-moves registry.
// Used by SpecialMoveHUD and the admin special-move CRUD page.
//
// ─── NOTE: Roster is intentionally sparse — special moves are being redesigned
// from first principles using Case Study 11 (case study/11 case study.md).
// Add new moves here as they are derived. The single entry below is kept as
// a structural reference only.

export type SpecialMoveKind =
  | "linear-burst"
  | "anchor"
  | "orbital"
  | "directional-burst"
  | "shockwave"
  | "aerial-launch"
  | "knockup"
  | "homerun"
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

// ─── Move roster ──────────────────────────────────────────────────────────────

export const SPECIAL_MOVES: Record<string, SpecialMoveDef> = {
  /** Attack type — linear force burst in facing direction + spin boost. */
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
  /** Defense type — zero linear velocity, maximize spin, 1.5s invulnerability. */
  gyro_anchor: {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    kind: "anchor",
    iconEmoji: "🛡️",
    cooldownSec: 5,
    durationMs: 1500,
    effects: { invulnerabilityMs: 1500, spinDelta: 400, linearImpulse: 0 },
    flashColor: "#3399ff",
  },
  /** Stamina type — orbital force (circular path), gradual spin recovery. */
  spin_recovery: {
    id: "spin_recovery",
    name: "Spin Recovery",
    kind: "orbital",
    iconEmoji: "🌀",
    cooldownSec: 6,
    durationMs: 2000,
    effects: { spinDelta: 300, spinStealRadiusPx: 0 },
    flashColor: "#33dd88",
  },
  /** Balanced type — directional burst + 20% spin recovery. */
  tactical_burst: {
    id: "tactical_burst",
    name: "Tactical Burst",
    kind: "directional-burst",
    iconEmoji: "💫",
    cooldownSec: 4,
    durationMs: 600,
    effects: { linearImpulse: 3000, spinDelta: 200, invulnerabilityMs: 100 },
    flashColor: "#ffcc00",
  },
  /** Universal — shockwave AoE knockback + spin steal around bey. */
  shock_pulse: {
    id: "shock_pulse",
    name: "Shock Pulse",
    kind: "shockwave",
    iconEmoji: "⚡🌊",
    cooldownSec: 7,
    durationMs: 400,
    effects: { aoeRadiusPx: 120, knockbackImpulse: 4000, spinStealRadiusPx: 80 },
    flashColor: "#bb44ff",
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
    // "" key won't match any DEFAULT_TYPE_TO_MOVE entry, so unknown type falls through to tactical_burst
    getSpecialMoveById(DEFAULT_TYPE_TO_MOVE[opts.type ?? ""]) ??
    SPECIAL_MOVES.tactical_burst   // universal balanced fallback for any unknown type or id
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

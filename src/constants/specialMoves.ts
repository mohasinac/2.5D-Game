// Static seed for the named special moves.
// Server reads this at room create (no async in the game loop). Eventually
// the `special_moves` Firestore collection becomes authoritative and this
// file is the fallback / dev seed. See plan Phase 9.

export type SpecialMoveKind =
  | "linear-burst"      // forward impulse + brief invulnerability
  | "anchor"            // zero linear velocity + max spin restore + i-frames
  | "orbital"           // circular force + spin recovery
  | "directional-burst" // small forward impulse + 20% spin recovery
  | "shockwave"         // outward AoE knock with spin steal
  | "custom";

export interface SpecialMoveDef {
  id: string;
  name: string;
  kind: SpecialMoveKind;
  iconEmoji: string;
  cooldownSec: number;
  durationMs: number;     // animation + LOC window length
  /** Effect numbers consumed by SpecialMoveExecutor. */
  effects: {
    linearImpulse?: number;        // physics units
    spinDelta?: number;            // ±spin
    invulnerabilityMs?: number;
    spinStealRadiusPx?: number;
    aoeRadiusPx?: number;
    knockbackImpulse?: number;
  };
  /** Default screen-flash color used by SpecialMoveHUD. */
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

/** Default mapping from beyblade type → special move id (back-compat). */
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

// ─── Attack type damage curve (Phase 9 nice-to-have) ──────────────────────

export type CpAttackType = "smash" | "upper" | "absorb" | "burst" | "spin_steal";

/** Damage multiplier applied to base collision damage based on CP attack type. */
export const ATTACK_TYPE_MULTIPLIER: Record<CpAttackType, number> = {
  smash:      1.3,    // big hit damage
  upper:      1.15,   // upward angle + medium damage
  burst:      1.5,    // very spiky damage + recoil
  absorb:     0.5,    // takes less damage but stable
  spin_steal: 0.7,    // converts hit to spin gain instead of damage
};

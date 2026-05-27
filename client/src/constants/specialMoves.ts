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
// REFERENCE EXAMPLE ONLY — kept so the HUD has something to render.
// Replace with real CS11-derived moves.

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
};

export const DEFAULT_TYPE_TO_MOVE: Record<string, string> = {
  attack:   "stampede_rush",
  defense:  "stampede_rush",
  stamina:  "stampede_rush",
  balanced: "stampede_rush",
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
    getSpecialMoveById(DEFAULT_TYPE_TO_MOVE[opts.type ?? "attack"]) ??
    SPECIAL_MOVES.stampede_rush
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

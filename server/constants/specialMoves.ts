// Static seed for the named special moves.
// Server reads this at room create (no async in the game loop). Eventually
// the `special_moves` Firestore collection becomes authoritative and this
// file is the fallback / dev seed.
//
// ─── NOTE: Roster is intentionally sparse — special moves are being redesigned
// from first principles using Case Study 11 (case study/11 case study.md).
// Add new moves here as they are derived. The single entry below is kept as
// a structural reference only.

export type SpecialMoveKind =
  | "linear-burst"      // forward impulse + brief invulnerability
  | "anchor"            // zero linear velocity + max spin restore + i-frames
  | "orbital"           // circular force + spin recovery
  | "directional-burst" // small forward impulse + partial spin recovery
  | "shockwave"         // outward AoE knock with spin steal
  | "aerial-launch"     // self launches into parabolic arc; landing AoE burst
  | "knockup"           // ground sweep → sends target airborne; aerial follow
  | "homerun"           // massive horizontal impulse + slight vertical on target
  | "custom";

export type SpecialMoveGroup = "strike" | "aerial" | "guard" | "field";

export interface SpecialMovePhaseEffects {
  linearImpulse?: number;        // horizontal force on SELF
  verticalImpulse?: number;      // Z-axis launch on SELF (aerial-launch) OR target (knockupTarget)
  spinDelta?: number;            // spin change on SELF
  invulnerabilityMs?: number;
  damageMultiplier?: number;     // applied to collision damage this phase
  knockbackImpulse?: number;     // lateral force applied to target on hit
  knockupTarget?: boolean;       // verticalImpulse hits TARGET instead of self
  aoeRadiusPx?: number;          // AoE spread for this phase
  landingAoePx?: number;         // extra AoE when self lands after aerial-launch phase
  landingDmgMult?: number;       // damage multiplier on landing AoE hit
  spinStealRadiusPx?: number;    // spin steal aura radius (anchor)
}

export interface SpecialMovePhase {
  phaseId: string;
  windUpMs: number;              // anticipation: self-effects only, no target contact
  durationMs: number;           // active window: full effects + target
  windDownMs: number;           // recovery: no new forces, existing velocity carries
  effects: SpecialMovePhaseEffects;
  targetFlags: {
    canHitGrounded: boolean;
    canHitAirborne: boolean;
    requiresAirborneTarget: boolean;
  };
  skipCondition?: "target_already_airborne" | "target_grounded";
  waitForAirborne?: number;     // ms to hold waiting for target to be airborne
  fallback?: {
    effects: SpecialMovePhaseEffects;
    targetFlags: {
      canHitGrounded: boolean;
      canHitAirborne: boolean;
    };
    label: string;
  };
  rangeCheck: "contact" | "radius" | "aoe" | "none";
  peakMs?: number;              // ms offset from start of active window where phase is strongest
  peakToleranceMs?: number;     // ± ms window around peakMs for timing bonus (default 100ms)
}

export interface SpecialMoveDef {
  id: string;
  name: string;
  kind: SpecialMoveKind;
  group: SpecialMoveGroup;
  iconEmoji: string;
  cooldownSec: number;
  radius: number;               // search distance for nearest-target acquisition
  phases: SpecialMovePhase[];
  /** Default screen-flash color used by SpecialMoveHUD. */
  flashColor: string;
}

// Interaction definition loaded from Firestore at room start
export interface SpecialInteractionDef {
  attackerDamageScale: number;
  defenderDamageScale: number;
  attackerSpinDelta: number;
  defenderSpinDelta: number;
  attackerKnockback: "none" | "partial" | "full" | "reversed" | "enhanced";
  defenderKnockback: "none" | "partial" | "full" | "reversed" | "enhanced";
  timingBonus?: {
    conditionDescription: string;
    peakFor: "attacker" | "defender" | "both";
    bonusScale: number;
  };
  description: string;
}

export const DEFAULT_CLASH_OUTCOME: SpecialInteractionDef = {
  attackerDamageScale: 0.8,
  defenderDamageScale: 0.8,
  attackerSpinDelta: -0.05,
  defenderSpinDelta: -0.05,
  attackerKnockback: "partial",
  defenderKnockback: "partial",
  description: "Default clash outcome (fallback when no Firestore entry found)",
};

// ─── Move roster ──────────────────────────────────────────────────────────────
// REFERENCE EXAMPLE ONLY — kept so the type system compiles and the HUD has
// something to render during development. Replace with real CS11-derived moves.

export const SPECIAL_MOVES: Record<string, SpecialMoveDef> = {
  stampede_rush: {
    id: "stampede_rush",
    name: "Stampede Rush",
    kind: "linear-burst",
    group: "strike",
    iconEmoji: "⚡",
    cooldownSec: 3,
    radius: 400,
    phases: [
      {
        phaseId: "stampede_rush_main",
        windUpMs: 100,
        durationMs: 500,
        windDownMs: 100,
        effects: {
          linearImpulse: 5000,
          invulnerabilityMs: 200,
          spinDelta: 60,
          damageMultiplier: 1.3,
          knockbackImpulse: 3000,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "radius",
        peakMs: 250,
        peakToleranceMs: 100,
      },
    ],
    flashColor: "#ff5522",
  },
};

/** Default mapping from beyblade type → special move id.
 *  All types fall back to stampede_rush while the roster is being rebuilt. */
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

/** Total wall-clock duration of a move (sum of all phase windows). */
export function totalMoveDurationMs(moveDef: SpecialMoveDef): number {
  return moveDef.phases.reduce(
    (acc, p) => acc + p.windUpMs + p.durationMs + p.windDownMs,
    0,
  );
}

// ─── Attack type damage curve ──────────────────────────────────────────────
export type CpAttackType = "smash" | "upper" | "absorb" | "burst" | "spin_steal";

export const ATTACK_TYPE_MULTIPLIER: Record<CpAttackType, number> = {
  smash:      1.3,
  upper:      1.15,
  burst:      1.5,
  absorb:     0.5,
  spin_steal: 0.7,
};

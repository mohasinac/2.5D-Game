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
  | "aerial-launch"     // self launches into parabolic arc; landing AoE burst
  | "knockup"           // ground sweep → sends target airborne; Phase 1 aerial bite
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
    canHitGrounded: boolean;    // this phase can connect on a grounded target
    canHitAirborne: boolean;    // this phase can connect on an airborne target
    requiresAirborneTarget: boolean; // gate: phase effect only fires when target is in the air
  };
  skipCondition?: "target_already_airborne" | "target_grounded"; // skip at activation if true
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
  phases: SpecialMovePhase[];   // replaces flat effects + durationMs
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

  gyro_anchor: {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    kind: "anchor",
    group: "guard",
    iconEmoji: "🛡️",
    cooldownSec: 4,
    radius: 250,
    phases: [
      {
        phaseId: "gyro_anchor_main",
        windUpMs: 100,
        durationMs: 1500,
        windDownMs: 100,
        effects: {
          spinDelta: 250,
          invulnerabilityMs: 1500,
          spinStealRadiusPx: 250,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "aoe",
        peakMs: 0,       // peak absorption is at start of active window
        peakToleranceMs: 200,
      },
    ],
    flashColor: "#4488ff",
  },

  spin_recovery: {
    id: "spin_recovery",
    name: "Spin Recovery",
    kind: "orbital",
    group: "field",
    iconEmoji: "♻️",
    cooldownSec: 3,
    radius: 300,
    phases: [
      {
        phaseId: "spin_recovery_main",
        windUpMs: 100,
        durationMs: 1000,
        windDownMs: 100,
        effects: {
          spinDelta: 400,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "none",
        peakMs: 500,
        peakToleranceMs: 150,
      },
    ],
    flashColor: "#44ff88",
  },

  tactical_burst: {
    id: "tactical_burst",
    name: "Tactical Burst",
    kind: "directional-burst",
    group: "strike",
    iconEmoji: "💫",
    cooldownSec: 3,
    radius: 350,
    phases: [
      {
        phaseId: "tactical_burst_main",
        windUpMs: 100,
        durationMs: 600,
        windDownMs: 100,
        effects: {
          linearImpulse: 3500,
          spinDelta: 150,
          damageMultiplier: 1.1,
          knockbackImpulse: 2000,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "radius",
        peakMs: 300,
        peakToleranceMs: 100,
      },
    ],
    flashColor: "#ffcc44",
  },

  shock_pulse: {
    id: "shock_pulse",
    name: "Shock Pulse",
    kind: "shockwave",
    group: "field",
    iconEmoji: "💥",
    cooldownSec: 5,
    radius: 250,
    phases: [
      {
        phaseId: "shock_pulse_main",
        windUpMs: 150,
        durationMs: 700,
        windDownMs: 100,
        effects: {
          aoeRadiusPx: 250,
          knockbackImpulse: 6000,
          invulnerabilityMs: 250,
          damageMultiplier: 1.2,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "aoe",
        peakMs: 350,
        peakToleranceMs: 150,
      },
    ],
    flashColor: "#ff44aa",
  },

  ascending_dragon_bite: {
    id: "ascending_dragon_bite",
    name: "Ascending Dragon Bite",
    kind: "knockup",
    group: "aerial",
    iconEmoji: "🐉",
    cooldownSec: 5,
    radius: 300,
    phases: [
      {
        phaseId: "sweep_knockup",
        windUpMs: 100,
        durationMs: 300,
        windDownMs: 100,
        effects: {
          knockbackImpulse: 1000,
          knockupTarget: true,
          verticalImpulse: 300,
          damageMultiplier: 0.8,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: false, requiresAirborneTarget: false },
        skipCondition: "target_already_airborne",
        rangeCheck: "contact",
        peakMs: 150,
        peakToleranceMs: 80,
      },
      {
        phaseId: "ascending_bite",
        windUpMs: 150,
        durationMs: 400,
        windDownMs: 150,
        effects: {
          verticalImpulse: 400,
          damageMultiplier: 2.0,
          knockbackImpulse: 4000,
        },
        targetFlags: { canHitGrounded: false, canHitAirborne: true, requiresAirborneTarget: true },
        waitForAirborne: 350,
        fallback: {
          effects: { linearImpulse: 2500, damageMultiplier: 1.0, knockbackImpulse: 2000 },
          targetFlags: { canHitGrounded: true, canHitAirborne: false },
          label: "Dragon Descending Bite — L-Drago lands and bites from above at 1.0x power",
        },
        rangeCheck: "radius",
        peakMs: 200,
        peakToleranceMs: 100,
      },
    ],
    flashColor: "#ff2200",
  },

  storm_bringer: {
    id: "storm_bringer",
    name: "Storm Bringer",
    kind: "aerial-launch",
    group: "aerial",
    iconEmoji: "🌪️",
    cooldownSec: 5,
    radius: 400,
    phases: [
      {
        phaseId: "ascent",
        windUpMs: 100,
        durationMs: 500,
        windDownMs: 0,
        effects: {
          verticalImpulse: 350,
        },
        targetFlags: { canHitGrounded: false, canHitAirborne: false, requiresAirborneTarget: false },
        rangeCheck: "none",
        peakMs: 0,
        peakToleranceMs: 50,
      },
      {
        phaseId: "diving_strike",
        windUpMs: 0,
        durationMs: 700,
        windDownMs: 100,
        effects: {
          linearImpulse: 4500,
          damageMultiplier: 1.7,
          verticalImpulse: -500,
          landingAoePx: 200,
          landingDmgMult: 1.4,
          knockbackImpulse: 3500,
        },
        targetFlags: { canHitGrounded: true, canHitAirborne: true, requiresAirborneTarget: false },
        rangeCheck: "radius",
        peakMs: 350,
        peakToleranceMs: 120,
      },
    ],
    flashColor: "#00aaff",
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

/** Total wall-clock duration of a move (sum of all phase windows). */
export function totalMoveDurationMs(moveDef: SpecialMoveDef): number {
  return moveDef.phases.reduce(
    (acc, p) => acc + p.windUpMs + p.durationMs + p.windDownMs,
    0,
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

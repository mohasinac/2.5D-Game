// Combo Task system — admin-facing types for building combo effects.
// These are compiled to BehaviorRef[] at save time by comboTaskCompiler.ts.
// The engine never runs ComboTask directly.

import type { ComboVisual } from "./comboVisual";

// ─── Element Types ─────────────────────────────────────────────────────────────
// (also exported from elementTypes.ts — duplicated here for self-contained import)
export type ElementType =
  | "fire" | "water" | "earth" | "lightning" | "wind" | "ice"
  | "shadow" | "light" | "metal" | "nature" | "thunder" | "void";

// ─── Stat Delta ────────────────────────────────────────────────────────────────

export type StatDeltaKey =
  // Numeric stats (multiplied):
  | "spin" | "maxSpin" | "spinDecayRate"
  | "damageMultiplier" | "damageReduction" | "contactDamageMultiplier"
  | "recoilFactor" | "spinStealFactor" | "spinStealResist"
  | "aggressiveness" | "gripFactor" | "surfaceFriction" | "speed"
  | "mass" | "radius" | "width" | "height" | "depth"
  | "jumpForce" | "jumpHeight"
  | "suctionForce" | "wallClimbFactor" | "gravityMult" | "bounceRestitution"
  | "tiltResistance" | "burstResistance"
  // Positional deltas (instant offset in cm):
  | "positionX" | "positionY" | "positionZ"
  // String-valued (uses setValue, not multiplier):
  | "spinDirection";

export interface StatDelta {
  stat: StatDeltaKey;
  multiplier?: number;         // for numeric stats
  delta?: number;              // for positional deltas (cm)
  setValue?: string;           // for string stats (e.g. spinDirection)
  durationTicks?: number;      // overrides task timing for this specific delta
}

// ─── Targets ──────────────────────────────────────────────────────────────────

export type ComboTarget =
  | "self"
  | "opponent"
  | "all_opponents"
  | "friendly"
  | "all_friendly"
  | "all"
  | "none"
  | { type: "range"; radiusCm: number };

// ─── Spawn Position ────────────────────────────────────────────────────────────

export type SpawnPosition =
  | { type: "current" }
  | { type: "offset"; dx: number; dy: number; dz?: number }
  | { type: "opponent" }
  | { type: "between_beys" }
  | { type: "fixed"; x: number; y: number }
  | { type: "random_in_arena" }
  | { type: "random_in_range"; radiusCm: number }
  | { type: "formation"; pattern: "ring" | "cross" | "triangle"; spacingCm: number }
  | { type: "entire_arena" }
  | { type: "scattered_in_arena"; count: number; minSpacingCm: number; avoidCenterCm?: number; avoidEdgeCm?: number }
  | { type: "ring_around_arena"; radiusFraction: number; count: number };

export type SpawnTarget =
  | { type: "opponent" }
  | { type: "all_opponents" }
  | { type: "fixed_angle"; deg: number }
  | { type: "away_from_self" }
  | { type: "toward_center" };

// ─── Action Types ──────────────────────────────────────────────────────────────

export interface MultiplierAction {
  type: "multiplier";
  statDeltas: StatDelta[];
}

export type TransformTarget =
  | "gravity_well" | "obstacle" | "spin_zone" | "turret" | "hazard" | "portal" | "normal";

export interface TransformationAction {
  type: "transformation";
  transformTo: TransformTarget;
  durationTicks?: number;
  transformParams?: Record<string, unknown>;
  keepVisualAppearance?: boolean;
  visualOverride?: ComboVisual;
}

export type SpawnableEntityType =
  | "portal" | "obstacle" | "gravity_well" | "spin_zone" | "pit"
  | "turret" | "trail" | "clone_self" | "bey_ai" | "bey_friendly"
  | "floor_hazard";

export type CountFormation = "spread" | "arc" | "ring" | "line";

export interface SpawningAction {
  type: "spawning";
  spawnType: SpawnableEntityType;
  spawnPosition: SpawnPosition;
  spawnTarget?: SpawnTarget;
  count?: number;
  countFormation?: CountFormation;
  countSpacing?: number;
  spawnParams?: {
    radius?: number;
    strength?: number;
    duration?: number;
    beyId?: string;
    aiDifficulty?: "medium" | "hard" | "hell";
    statsMultiplier?: number;
    trailDamage?: number;
    trailWidth?: number;
    trailLifetimeTicks?: number;
    cloneIsPhysical?: boolean;
    cloneStatFraction?: number;
    hazardType?: string;
    visualOverride?: ComboVisual;
  };
}

export type MovementPattern =
  | { type: "circle"; radius: number; direction: "cw" | "ccw" }
  | { type: "dash_to"; target: "opponent" | "center" }
  | { type: "orbit_opponent"; radius: number }
  | { type: "freeze" }
  | { type: "dance"; intensity: number }
  | { type: "zigzag"; amplitude: number; frequency: number }
  | { type: "bounce"; count: number }
  | { type: "jump"; heightCm: number; jumpForceMult?: number }
  | { type: "high_jump"; heightCm: number; hangTimeTicks: number; landTarget: "current_position" | "opponent" | "fixed" | "random_in_range"; landRadiusCm?: number }
  | { type: "meteor_strike"; heightCm: number; hangTimeTicks: number; landTarget: "opponent" | "current_position" | "fixed"; impactRadiusCm: number; impactDamageMult: number; impactRecoilMult: number; landingParticlePreset?: string; landingSoundId?: string; landingAnimationId?: string }
  | { type: "swap_position"; swapWith: ComboTarget; preserveVelocity: boolean; snapToGround?: boolean; preventRingOut?: boolean };

export interface MovementAction {
  type: "movement";
  pattern: MovementPattern;
  durationTicks?: number;
  visualOverride?: ComboVisual;
}

// Arena-wide effect (5th action type)
export type ArenaEffectPayload =
  | { type: "floor_override"; hazardType: string; intensity?: number; durationTicks: number }
  | { type: "gravity_change"; multiplier: number; durationTicks: number }
  | { type: "arena_tilt"; angleDeg: number; directionDeg: number; durationTicks: number }
  | { type: "freeze_all"; durationTicks: number; spareTeammates?: boolean }
  | { type: "fog_of_war"; durationTicks: number; affectsCaster?: boolean }
  | { type: "darkness"; durationTicks: number; flashExitMs?: number }
  | { type: "reverse_controls"; durationTicks: number; affectsCaster?: boolean }
  | { type: "no_combos"; durationTicks: number; affectsCaster?: boolean };

export interface ArenaEffectAction {
  type: "arena_effect";
  effect: ArenaEffectPayload;
}

export type ComboAction =
  | MultiplierAction
  | TransformationAction
  | SpawningAction
  | MovementAction
  | ArenaEffectAction;

// ─── Timing ────────────────────────────────────────────────────────────────────

export interface PulseIntervalFormula {
  type: "arithmetic" | "exponential" | "sinusoidal";
  base: number;
  step?: number;
  decay?: number;
  amplitude?: number;
  periodPulses?: number;
}

export interface PulseIntensityFormula {
  type: "constant" | "ramp_up" | "ramp_down" | "bell_curve" | "sinusoidal";
  base?: number;
  sigma?: number;
  amplitude?: number;
  periodPulses?: number;
}

export interface ChargeState {
  effectId: string;
  chargeStartTick: number;
  lastKeyBit: number;
}

export type ComboTiming =
  | { type: "instant" }
  | { type: "timed"; durationTicks: number }
  | { type: "permanent" }
  | { type: "pulsed"; pulseCount: number; pulseMs: number; gapMs?: number | "random"; gapFormula?: PulseIntervalFormula; intensityFormula?: PulseIntensityFormula }
  | { type: "charged"; minChargeTicks: number; maxChargeTicks: number; chargeScale: "linear" | "quadratic" | "step"; chargeCostPerTick?: number; cancelIfMoved?: boolean };

// ─── Conditions ────────────────────────────────────────────────────────────────

export type ComboTrigger =
  | "sequence"
  | "on_hit_received"
  | "on_near_ring_out"
  | "on_low_spin"
  | "on_partner_near_ring_out"
  | "on_opponent_special_move"
  | "on_burst_attempt";

export interface ComboCondition {
  maxRange?: number;
  minPower?: number;
  maxPower?: number;
  insideArena?: boolean;
  requiresPlayerControl?: boolean;
  orientationRequired?: ("normal" | "inverted" | "rolling")[];
  minSpin?: number;
  maxSpin?: number;
  spinDirectionRequired?: "left" | "right";
  clashTypeRequired?: "same_spin" | "counter_spin";
  maxTiltAngle?: number;
  minTiltAngle?: number;
  requiresElementType?: ElementType;
  targetElementType?: ElementType;
  elementEffective?: "super" | "resisted" | "neutral";
  trigger?: ComboTrigger;
  triggerCooldownMs?: number;
}

// ─── Mixed-Target Action ───────────────────────────────────────────────────────

export interface TargetedAction {
  target: ComboTarget;
  action: ComboAction;
}

// ─── Combo Task (admin-facing) ─────────────────────────────────────────────────

export interface ComboTask {
  // Option A: same action to all targets (existing style)
  action?: ComboAction;
  target?: ComboTarget | ComboTarget[];
  // Option B: per-target different actions
  targetedActions?: TargetedAction[];
  // Always required:
  timing: ComboTiming;
  condition?: ComboCondition;
}

// ─── Behavior Ref (engine-facing, compiled from ComboTask) ────────────────────

export interface BehaviorRef {
  behaviorId: string;
  params?: Record<string, unknown>;
  delayTicks?: number;
  parallel?: boolean;
  condition?: ComboCondition;
}

// ─── Combo Slot (per-bey assignment) ──────────────────────────────────────────

export interface BeybladeComboSlot {
  sequence: string[];     // key names, empty for trigger-based combos
  effectId: string;       // references combo_effects collection
  condition?: ComboCondition;
}

// ─── Combo Effect Definition ──────────────────────────────────────────────────

export interface ComboEffectDef {
  id: string;
  name: string;
  cost: number;
  cooldownMs: number;
  windupTicks?: number;
  bleedTicks?: number;
  bleedFactors?: StatDelta[];
  entryAnimation?: ComboVisual;
  exitAnimation?: ComboVisual;
  // Admin-facing tasks (stored for editor):
  tasks: ComboTask[];
  // Engine-facing steps (compiled at save time):
  steps: BehaviorRef[];
}

// Input type for the compiler (tasks only — steps generated by compiler)
export type ComboEffectDefInput = Omit<ComboEffectDef, "steps">;

// [2.5D] PartPhysics.ts — server-side physics extensions for the 2.5D part-library system.
// This file is intentionally SEPARATE from PhysicsEngine.ts to keep the core 2D battle
// system intact. Rooms call into this module only when a bey has a BeybladeSystem attached.
//
// Responsibilities:
//   • applyMaterialStats()         — shape × material → resolved physics stats
//   • computeBeybladePartStats()   — full stat recompute on config change
//   • evaluateSwitchTargets()      — SubPart-as-Switch trigger evaluation
//   • applyBearingFriction()       — B:D / EWD spin-steal and decay reduction
//   • applySpinBias()              — R2F directional grip multiplier
//   • applyLeftSpinHop()           — Wyborg left-spin hop impulse
//   • tickPocketBalls()            — Draciel F centrifugal ball physics
//   • applyTrackHeightOffset()     — MFB SpinTrack CP height offset pass
//   • applyHiddenStats()           — recoilFactor, gyroscopicStability, impactAbsorption, etc.
//   • tickMechanismDurability()    — SubPart wear tracking
//   • tickJumpMovement()           — jump-core hop state machine
//   • applyLandingDamage()         — AOE damage on hop landing
//   • tickDetachedBody()           — projectile→obstacle→removed lifecycle
//   • applyStatModifier()          — universal BeybladeStatKey modifier
//   • dispatchStatModifierEvent()  — fire on_land / on_hit / on_button / etc. events
//   • tickSpinInjection()          — spin injection reserve per-tick
//   • tickCounterRotation()        — Dranzer GT direction-sequence per-tick

import {
  MATERIAL_STATS,
  type MaterialStats,
  type TipPart,
  type ARPart,
  type WDPart,
  type CorePart,
  type CasingPart,
  type SubPart,
  type SpinTrackPart,
  type BitBeastPart,
  type StatModifier,
  type StatModifierEvent,
  type BeybladeStatKey,
  type SwitchTarget,
  type ConfigTrigger,
  type LandingDamage,
  type SpinInjectionConfig,
  type CounterRotationConfig,
} from "../../shared/types/beybladeSystem";
import { type Beyblade, DetachedBodySchema, type GameState } from "../rooms/schema/GameState";
import { MapSchema } from "@colyseus/schema";
import Matter from "matter-js";

// ─── Resolved Stats (ephemeral — recomputed each config-change tick) ──────────

export interface ResolvedTipStats {
  tipShape: string;
  material: string;
  gripFactor: number;
  aggressiveness: number;
  freeSpin: boolean;
  spinDecayMod: number;      // multiplier on base spinDecayRate
  recoilFactor: number;
  surfaceFriction: number;
  spinStealResist: number;
  bearingFriction: number;   // 0 = frictionless bearing; 1 = no bearing
  effectiveGrip: number;     // gripFactor × spinBias multiplier for current spin direction
}

export interface ResolvedBeyStats {
  spinDecayMod: number;
  gripFactor: number;
  aggressiveness: number;
  recoilFactor: number;
  surfaceFriction: number;
  spinStealResist: number;
  gyroscopicStability: number;
  impactAbsorption: number;
  bearingFriction: number;
  momentOfInertia: number;   // kg·mm²; used for wobble growth and energy calcs
  isAirborne: boolean;       // true when jump-core hop is active (no floor contact)
  movementType: "orbit" | "jump" | "fixed";
}

// ─── Material Stats Resolution ─────────────────────────────────────────────────

export function getMaterialStats(material: string): MaterialStats {
  return MATERIAL_STATS[material] ?? MATERIAL_STATS["abs"];
}

/**
 * Applies material multipliers to base shape stats.
 * Called inside computeBeybladePartStats() after config overrides resolve.
 * Does NOT mutate the part — writes into the resolved stats object.
 */
export function applyMaterialStats(
  baseGrip: number,
  baseRecoil: number,
  material: string
): { gripFactor: number; recoilFactor: number; spinDecayMod: number; surfaceFriction: number; spinStealResist: number } {
  const mat = getMaterialStats(material);
  return {
    gripFactor:      Math.min(1.0, baseGrip * mat.gripMult),
    recoilFactor:    baseRecoil * mat.recoilMult,
    spinDecayMod:    mat.decayMod,
    surfaceFriction: mat.frictionMult,
    spinStealResist: mat.spinStealResist,
  };
}

// ─── Tip Stats Resolution (bearing friction + spin bias) ──────────────────────

/**
 * Resolves effective tip stats for the current tick, including:
 * - config override for tipShape / material / gripFactor / aggressiveness
 * - material × shape stat cascade (MATERIAL_STATS)
 * - spin bias directional multiplier (R2F, R²F)
 * - bearing friction (B:D, EWD)
 */
export function resolveTipStats(
  tip: TipPart,
  activeConfig: string,
  spinDirection: "right" | "left"
): ResolvedTipStats {
  // Start from base tip values
  let tipShape = tip.tipShape as string;
  let material = tip.material as string;
  let gripFactor = tip.gripFactor;
  let aggressiveness = tip.aggressiveness;
  let freeSpin = tip.freeSpin;

  // Apply config override if active
  if (activeConfig) {
    const cfg = tip.configurations.find((c) => c.name === activeConfig);
    if (cfg?.overrides) {
      if (cfg.overrides.tipShape !== undefined) tipShape = cfg.overrides.tipShape;
      if ((cfg.overrides as Record<string, unknown>).material !== undefined)
        material = (cfg.overrides as Record<string, unknown>).material as string;
      if (cfg.overrides.gripFactor !== undefined) gripFactor = cfg.overrides.gripFactor;
      if (cfg.overrides.aggressiveness !== undefined) aggressiveness = cfg.overrides.aggressiveness;
      if (cfg.overrides.freeSpin !== undefined) freeSpin = cfg.overrides.freeSpin;
    }
  }

  // Material × shape cascade
  const matStats = getMaterialStats(material);
  const resolvedGrip      = Math.min(1.0, gripFactor * matStats.gripMult);
  const resolvedRecoil    = 0.5 * matStats.recoilMult; // base recoil from shape ~0.5
  const resolvedDecayMod  = matStats.decayMod;
  const resolvedFriction  = matStats.frictionMult;
  const resolvedSSR       = matStats.spinStealResist;

  // Spin bias (R2F-style)
  let spinBiasMultiplier = 1.0;
  if (tip.spinBias) {
    spinBiasMultiplier =
      spinDirection === "right"
        ? tip.spinBias.rightSpin.gripMultiplier
        : tip.spinBias.leftSpin.gripMultiplier;
  }
  const effectiveGrip = Math.min(1.0, resolvedGrip * spinBiasMultiplier);

  const bearingFriction = tip.bearingFriction ?? 1.0;

  return {
    tipShape,
    material,
    gripFactor: resolvedGrip,
    aggressiveness,
    freeSpin,
    spinDecayMod: resolvedDecayMod,
    recoilFactor: resolvedRecoil,
    surfaceFriction: resolvedFriction,
    spinStealResist: resolvedSSR,
    bearingFriction,
    effectiveGrip,
  };
}

// ─── Bearing Friction Effects ─────────────────────────────────────────────────

/**
 * Reduces spin-steal received when a bearing tip is equipped.
 * Legacy helper — new callers should use computeSpinSteal() which also
 * incorporates spinStealFactor and spinStealResist from the universal stat table.
 */
export function applyBearingFrictionToSteal(rawSteal: number, bearingFriction: number): number {
  return rawSteal * bearingFriction; // B:D (0.02) → receives 2% of steal
}

/**
 * Reduces spin decay rate when a bearing tip is equipped.
 * Returns spinDecayRate multiplier (0–1; B:D ≈ 0.608×).
 */
export function getBearingDecayMult(bearingFriction: number): number {
  return 1 - (1 - bearingFriction) * 0.4;
}

// ─── Left-Spin Hop (Wyborg) ───────────────────────────────────────────────────

/**
 * Checks if a left-spin hop should fire this collision.
 * Returns the outward impulse magnitude to apply, or 0 if no hop.
 */
export function checkLeftSpinHop(
  tip: TipPart,
  activeConfig: string,
  spinDirection: string,
  impactForce: number
): number {
  if (!tip.leftSpinHop?.enabled) return 0;
  if (spinDirection !== "left") return 0;

  // Only fire when tip is in Sharp config (not HoleFlat)
  const isSharp = !activeConfig || activeConfig === "Sharp";
  if (!isSharp) return 0;

  const { hopImpulse, hopChance } = tip.leftSpinHop;
  // Require a minimum impact force (unit: same as SwitchTarget trigger thresholds)
  if (impactForce < LEFT_SPIN_HOP_MIN_FORCE) return 0;
  if (Math.random() >= hopChance) return 0;

  return hopImpulse;
}

// ─── Centrifugal Pocket Ball Physics (Draciel F) ─────────────────────────────

export interface PocketBallState {
  pocketIndex: number;
  rBall: number;      // current radial position mm from center
  escaped: boolean;
}

/**
 * Per-tick update of pocket ball radial positions.
 * Returns total moment-of-inertia contribution from active pockets,
 * and list of pockets that escaped this tick.
 */
export function tickPocketBalls(
  casingPockets: Array<{
    radialChannel?: boolean;
    escapable?: boolean;
    escapeForce?: number;
    escapedBallMass?: number;
    fixed: boolean;
    ballCount: number;
    position: { x: number; y: number };
  }>,
  omega: number,      // normalized spin 0–1
  maxOmega: number,   // rad/s at 100% spin
  innerRadius: number,
  outerRadius: number
): { inertiaMod: number; escapedIndices: number[] } {
  let inertiaMod = 1.0;
  const escapedIndices: number[] = [];

  casingPockets.forEach((pocket, idx) => {
    if (pocket.fixed || !pocket.radialChannel) return;
    if (pocket.ballCount <= 0) return;

    const ballMass = (pocket.escapedBallMass ?? 1.0) * pocket.ballCount;
    const r = innerRadius + (outerRadius - innerRadius) * omega * omega;
    const inertiaPocket = ballMass * r * r;
    const iBase = ballMass * innerRadius * innerRadius || 1;
    inertiaMod += (inertiaPocket / iBase) * 0.12;

    // Escape check
    if (pocket.escapable && pocket.escapeForce != null) {
      const centrifugal = ballMass * (omega * maxOmega) ** 2 * r;
      if (centrifugal > pocket.escapeForce) {
        escapedIndices.push(idx);
      }
    }
  });

  return { inertiaMod, escapedIndices };
}

// ─── SpinTrack CP Height Offset ───────────────────────────────────────────────

/**
 * Returns the CP heightRange offset in mm for a given SpinTrack.
 * Pass 0 when no track is equipped (plastic gen / HMS beys).
 */
export function getTrackHeightOffset(spinTrack?: SpinTrackPart | null): number {
  return spinTrack?.height ?? 0;
}

// ─── Hidden Stat Effects ──────────────────────────────────────────────────────

/**
 * Applies gyroscopic stability — slows wobble amplitude growth.
 * Call each tick: newWobble = wobble + growthRate × (1 - gyroscopicStability).
 */
export function applyGyroscopicStability(
  wobbleAmplitude: number,
  naturalGrowthRate: number,
  gyroscopicStability: number
): number {
  return wobbleAmplitude + naturalGrowthRate * (1 - (gyroscopicStability ?? 0));
}

/**
 * Applies impact absorption — reduces force reaching WD/Core from a hit.
 */
export function applyImpactAbsorption(rawForce: number, impactAbsorption: number): number {
  return rawForce * (1 - (impactAbsorption ?? 0));
}

// ─── Mechanism Durability Tracking ───────────────────────────────────────────

/**
 * Tracks trigger fire count for a SubPart mechanism.
 * Returns true if mechanism is still active (durability not exhausted).
 * When exhausted: switchTargets are deactivated, triggerSensitivity rises.
 */
export function checkMechanismDurability(
  fireCount: number,
  mechanismDurability?: number
): { isActive: boolean; fireCount: number } {
  if (!mechanismDurability || mechanismDurability === 0) {
    return { isActive: true, fireCount: fireCount + 1 };
  }
  const newCount = fireCount + 1;
  return { isActive: newCount <= mechanismDurability, fireCount: newCount };
}

// ─── SubPart Switch Target Evaluation ────────────────────────────────────────

/**
 * Checks whether a ConfigTrigger condition is currently met for a given bey.
 * Returns true if the trigger should fire.
 */
export function isTriggerMet(
  trigger: ConfigTrigger,
  bey: Beyblade,
  impactForce: number,
  impactDirection?: "clockwise" | "counterclockwise"
): boolean {
  if (!trigger) return false;
  switch (trigger.type) {
    case "spin_threshold":
      return bey.maxSpin > 0 && bey.spin / bey.maxSpin < trigger.threshold;

    case "impact_threshold":
      return impactForce >= trigger.threshold;

    case "impact_any":
      return impactForce >= trigger.threshold;

    case "impact_direction": {
      if (impactForce < trigger.threshold) return false;
      if (!trigger.direction || trigger.direction === "any") return true;
      return impactDirection === trigger.direction;
    }

    case "tilt_threshold":
      return bey.wobbleAmplitude > trigger.threshold;

    case "special_move":
      return bey.specialMoveActive;

    case "timer":
      // Caller manages timer countdown — just check threshold === 0 for immediate
      return trigger.threshold === 0;

    default:
      return false;
  }
}

/**
 * Evaluates all SubPart switch targets for a bey.
 * Mutates bey.activePartConfigs in-place.
 * Also tracks previousConfigs for togglePrevious behavior.
 */
export function evaluateSwitchTargets(
  switchTargets: SwitchTarget[],
  bey: Beyblade,
  impactForce: number,
  fireCounts: Map<number, number>,
  subPartIndex: number,
  mechanismDurability?: number,
  impactDirection?: "clockwise" | "counterclockwise"
): void {
  for (const sw of switchTargets) {
    const fireCountKey = subPartIndex * 1000 + switchTargets.indexOf(sw);
    const currentFires = fireCounts.get(fireCountKey) ?? 0;

    // Durability check
    const { isActive } = checkMechanismDurability(currentFires, mechanismDurability);
    if (!isActive) continue;

    if (isTriggerMet(sw.trigger, bey, impactForce, impactDirection)) {
      fireCounts.set(fireCountKey, currentFires + 1);

      if (sw.trigger.togglePrevious) {
        const layerKey = sw.targetLayer as string;
        const prevKey = `${layerKey}_prev`;
        const prev = bey.activePartConfigs.get(prevKey) ?? "";
        bey.activePartConfigs.set(prevKey, bey.activePartConfigs.get(layerKey) ?? "");
        bey.activePartConfigs.set(layerKey, prev || sw.activateConfig);
      } else {
        bey.activePartConfigs.set(sw.targetLayer as string, sw.activateConfig);
      }
    }

    // Reset condition check (simplified — timer-based handled by caller)
    if (sw.resetToConfig && sw.resetCondition) {
      const resetMet = sw.resetCondition.type === "impact"
        ? impactForce >= sw.resetCondition.threshold
        : false;
      if (resetMet) {
        bey.activePartConfigs.set(sw.targetLayer as string, sw.resetToConfig);
      }
    }
  }
}

// ─── Jump Movement System ─────────────────────────────────────────────────────

/**
 * Per-tick jump movement tick.
 * Returns: { shouldHop, landingFired }
 *   shouldHop: true on the tick a new hop initiates (caller applies velocity burst)
 *   landingFired: true on the tick airborne→ground transition happens
 */
export function tickJumpMovement(
  bey: Beyblade,
  jumpPeriodTicks: number,
  airborneTickDuration: number,
  ticksSinceLastHop: number
): { shouldHop: boolean; landingFired: boolean; isAirborne: boolean } {
  if (bey.isAirborne) {
    // Count down airborne ticks
    const remaining = bey.airborneTicksRemaining - 1;
    bey.airborneTicksRemaining = remaining;
    if (remaining <= 0) {
      bey.isAirborne = false;
      bey.airborneTicksRemaining = 0;
      return { shouldHop: false, landingFired: true, isAirborne: false };
    }
    return { shouldHop: false, landingFired: false, isAirborne: true };
  }

  // Check if it's time for a new hop
  if (ticksSinceLastHop >= jumpPeriodTicks) {
    bey.isAirborne = true;
    bey.airborneTicksRemaining = airborneTickDuration;
    return { shouldHop: true, landingFired: false, isAirborne: true };
  }

  return { shouldHop: false, landingFired: false, isAirborne: false };
}

// ─── Landing Damage (AOE) ─────────────────────────────────────────────────────

/**
 * Applies AOE spin damage to all beys within aoeRadius of the landing point.
 * Returns a map of beyId → spinDamage for the caller to apply.
 */
export function computeLandingDamage(
  landingX: number,
  landingY: number,
  attackerMass: number,
  jumpForce: number,
  attackerSpin: number,
  attackerMaxSpin: number,
  landing: LandingDamage,
  otherBeys: Array<{ id: string; x: number; y: number }>
): Map<string, number> {
  const result = new Map<string, number>();
  if (!landing.enabled) return result;

  const spinFraction = attackerSpin / (attackerMaxSpin || 1);
  const rawDamage = attackerMass * jumpForce * jumpForce * landing.damageMultiplier * spinFraction;

  for (const other of otherBeys) {
    const dist = Math.hypot(other.x - landingX, other.y - landingY);
    if (dist <= landing.aoeRadius) {
      const falloff = 1.0 - dist / landing.aoeRadius;
      result.set(other.id, rawDamage * falloff);
    }
  }

  return result;
}

// ─── DetachedBody Lifecycle ───────────────────────────────────────────────────

/**
 * Spawns a new DetachedBodySchema and registers it in gameState.detachedBodies.
 * The caller is responsible for creating the corresponding Matter.js body.
 */
export function spawnDetachedBody(
  gameState: GameState,
  params: {
    id: string;
    bodyType: "projectile" | "mini_bey" | "fragment";
    ownerSessionId: string;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    radius: number;
    mass: number;
    spin?: number;
    maxSpin?: number;
    spinDecayRate?: number;
    fragmentLifetimeTicks?: number;
    obstacleSpeedThreshold?: number;
    spinOutThreshold?: number;
  }
): DetachedBodySchema {
  const body = new DetachedBodySchema();
  body.id = params.id;
  body.bodyType = params.bodyType;
  body.state = "projectile";
  body.ownerSessionId = params.ownerSessionId;
  body.x = params.x;
  body.y = params.y;
  body.velocityX = params.velocityX;
  body.velocityY = params.velocityY;
  body.radius = params.radius;
  body.mass = params.mass;
  body.spin = params.spin ?? 0;
  body.maxSpin = params.maxSpin ?? 1000;
  body.spinDecayRate = params.spinDecayRate ?? 0.003;
  body.fragmentLifetimeTicks = params.fragmentLifetimeTicks ?? 0;
  body.obstacleSpeedThreshold = params.obstacleSpeedThreshold ?? 2;
  body.spinOutThreshold = params.spinOutThreshold ?? 100;
  gameState.detachedBodies.set(params.id, body);
  return body;
}

/**
 * Per-tick DetachedBody state transitions.
 * Returns true if the body should be removed (Matter.js body destroyed by caller).
 */
export function tickDetachedBody(
  body: DetachedBodySchema,
  arenaRadius: number,
  arenaCenterX: number,
  arenaCenterY: number,
  OBSTACLE_RELAUNCH_THRESHOLD: number,
  incomingForce: number
): boolean {
  if (body.state === "removed") return true;

  const dist = Math.hypot(body.x - arenaCenterX, body.y - arenaCenterY);
  if (dist > arenaRadius) {
    body.state = "removed";
    return true;
  }

  const speed = Math.hypot(body.velocityX, body.velocityY);

  if (body.bodyType === "fragment") {
    // Fragments decay by age
    body.fragmentAge++;
    if (body.fragmentLifetimeTicks > 0 && body.fragmentAge >= body.fragmentLifetimeTicks) {
      body.state = "removed";
      return true;
    }
  }

  if (body.bodyType === "mini_bey" && body.state === "projectile") {
    // Decay spin
    body.spin *= (1 - body.spinDecayRate);
    if (body.spin < body.spinOutThreshold) {
      body.spin = 0;
      body.state = "obstacle";
    }
  }

  if (body.state === "projectile") {
    if (speed < body.obstacleSpeedThreshold) {
      body.state = "obstacle";
    }
  }

  if (body.state === "obstacle" && incomingForce > OBSTACLE_RELAUNCH_THRESHOLD) {
    body.state = "projectile"; // re-launched by bey collision
  }

  return false;
}

// ─── Spin Injection Tick ──────────────────────────────────────────────────────

/**
 * Per-tick spin injection for power-boost cores (Rock Bison / Wolborg G).
 * Mutates bey in-place. Returns actual spin added.
 */
export function tickSpinInjection(
  bey: Beyblade,
  cfg: SpinInjectionConfig
): number {
  if (!cfg.enabled) return 0;
  if (cfg.reserveCapacity > 0 && bey.coreReserveRemaining <= 0) return 0;

  const boost = cfg.rateRPM / 60; // per-tick at 60Hz
  const before = bey.spin;
  bey.spin = Math.min(bey.maxSpin, bey.spin + boost);
  const actual = bey.spin - before;

  if (cfg.reserveCapacity > 0) {
    bey.coreReserveRemaining = Math.max(0, bey.coreReserveRemaining - boost);
  }

  return actual;
}

// ─── Counter-Rotation Direction Sequence Tick (Dranzer GT) ───────────────────

/**
 * Per-tick counter-rotation sequence management.
 * Changes bey.spinDirection at each step boundary.
 * Reverts to defaultSpinDirection when sequence completes.
 */
export function tickCounterRotation(bey: Beyblade, cfg: CounterRotationConfig): void {
  if (!bey.counterRotActive) return;

  bey.counterRotStepTick++;
  if (bey.counterRotStepTick < cfg.stepDurationTicks) return;

  // Step complete — advance to next
  bey.counterRotStepTick = 0;
  bey.counterRotStep++;

  if (bey.counterRotStep < cfg.directionSequence.length) {
    // Apply spin cost and change direction
    bey.spin *= (1 - cfg.spinDecayCostPerStep);
    bey.spinDirection = cfg.directionSequence[bey.counterRotStep];
  } else {
    // Sequence done — revert
    bey.spinDirection = bey.defaultSpinDirection;
    bey.counterRotActive = false;
    bey.counterRotStep = 0;
  }
}

// ─── Spin Clash System ────────────────────────────────────────────────────────

export type ClashType = "same_spin" | "counter_spin" | "neutral";

export const CLASH_MULTIPLIERS: Record<ClashType, { damage: number; spinSteal: number; recoil: number }> = {
  same_spin:    { damage: 0.8,  spinSteal: 0.5,  recoil: 0.6 },
  counter_spin: { damage: 1.4,  spinSteal: 1.5,  recoil: 1.3 },
  neutral:      { damage: 1.0,  spinSteal: 1.0,  recoil: 1.0 },
};

export function getClashType(
  attackerSpinDir: "left" | "right",
  defenderSpinDir: "left" | "right"
): ClashType {
  if (attackerSpinDir === defenderSpinDir) return "same_spin";
  return "counter_spin";
}

/**
 * Returns a 0–1 blend factor based on approach angle.
 * 0 = head-on (full clash effect), 1 = glancing (no clash effect).
 * approachAngle in degrees, 0 = direct collision.
 */
export function getClashBlend(approachAngle: number): number {
  // 0 = head-on (full clash), 1 = glancing (no clash effect)
  // approachAngle in degrees, 0 = direct collision
  return Math.min(1, Math.abs(approachAngle) / 45);
}

/**
 * Computes the effective spin steal amount incorporating all relevant factors:
 * - rawSteal: base steal amount from the contact point
 * - attackerSpinStealFactor: attacker's outgoing steal rate multiplier (default 1.0)
 * - defenderBearingFriction: part-level resistance (B:D = 0.02, normal = 1.0)
 * - defenderSpinStealResist: stat-level incoming steal block (>1 = more resistance)
 * - clashType: counter_spin boosts steal, same_spin reduces it
 *
 * Formula: rawSteal * (attackerSpinStealFactor * (1 / defenderSpinStealResist)) * bearingFriction * clashMult
 */
export function computeSpinSteal(
  rawSteal: number,
  attackerSpinStealFactor: number,
  defenderBearingFriction: number,
  defenderSpinStealResist: number,
  clashType: ClashType
): number {
  const clashMult = CLASH_MULTIPLIERS[clashType].spinSteal;
  // B2: spinStealFactor * (1/spinStealResist) is the core steal scaling pair
  const stealScale = attackerSpinStealFactor * (1 / Math.max(0.01, defenderSpinStealResist));
  return rawSteal * stealScale * defenderBearingFriction * clashMult;
}

/**
 * Computes the effective contact damage incorporating clash multipliers blended
 * by the approach angle between the two beyblades.
 *
 * @param baseDamage        - raw damage before clash modulation
 * @param attackerSpinDir   - attacker's current spin direction
 * @param defenderSpinDir   - defender's current spin direction
 * @param approachAngle     - collision approach angle in degrees (0 = head-on)
 * @returns final damage after clash-blend modulation
 */
export function computeContactDamage(
  baseDamage: number,
  attackerSpinDir: "left" | "right",
  defenderSpinDir: "left" | "right",
  approachAngle: number
): number {
  const clashType = getClashType(attackerSpinDir, defenderSpinDir);
  const blend = getClashBlend(approachAngle); // 0 = full clash, 1 = glancing

  // blend=0 → full clash multiplier; blend=1 → neutral multiplier (1.0)
  const clashDamageMult = CLASH_MULTIPLIERS[clashType].damage;
  const effectiveMult = clashDamageMult + blend * (CLASH_MULTIPLIERS.neutral.damage - clashDamageMult);

  return baseDamage * effectiveMult;
}

// ─── Phase AB: Element Type Effectiveness ────────────────────────────────────

// Inline 12×12 matrix to avoid cross-boundary import from client types.
// Must stay in sync with client/src/types/elementTypes.ts::TYPE_MATRIX.
const ELEMENT_TYPES = ["fire","water","earth","lightning","wind","ice","shadow","light","metal","nature","thunder","void"] as const;
type ET = typeof ELEMENT_TYPES[number];
const TYPE_MATRIX: Record<ET, Record<ET, number>> = {
  fire:      { fire:1.0, water:0.5, earth:1.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.5, thunder:0.5, void:1.0 },
  water:     { fire:2.0, water:1.0, earth:0.5, lightning:0.5, wind:0.5, ice:0.5,  shadow:1.0, light:1.0, metal:1.5, nature:1.5, thunder:1.0, void:1.0 },
  earth:     { fire:1.0, water:1.5, earth:1.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:2.0, nature:0.5, thunder:0.5, void:1.0 },
  lightning: { fire:1.0, water:2.0, earth:0.5, lightning:1.0, wind:2.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.5, nature:0.5, thunder:1.0, void:1.0 },
  wind:      { fire:1.0, water:1.5, earth:1.0, lightning:0.5, wind:1.0, ice:1.5,  shadow:1.0, light:0.5, metal:0.5, nature:2.0, thunder:0.5, void:1.0 },
  ice:       { fire:0.5, water:1.5, earth:1.5, lightning:1.0, wind:0.5, ice:1.0,  shadow:1.0, light:1.0, metal:0.5, nature:0.5, thunder:1.0, void:1.5 },
  shadow:    { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:2.0 },
  light:     { fire:1.0, water:1.0, earth:1.0, lightning:1.5, wind:1.0, ice:1.0,  shadow:2.0, light:1.0, metal:0.5, nature:1.0, thunder:1.0, void:0.5 },
  metal:     { fire:1.0, water:0.5, earth:0.5, lightning:0.5, wind:2.0, ice:1.5,  shadow:1.0, light:1.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  nature:    { fire:0.5, water:1.0, earth:2.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  thunder:   { fire:1.5, water:2.0, earth:0.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  void:      { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:0.5, light:2.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
};

/**
 * Returns the damage / spin-steal multiplier for a dual-type attacker vs a dual-type defender.
 * Attacker dual-type: use the BETTER (max) matchup.
 * Defender dual-type: MULTIPLY both resistances.
 * Returns 1.0 if either side has no element types.
 */
export function computeElementTypeMultiplier(
  attackerElems: string[],
  defenderElems: string[],
): number {
  if (attackerElems.length === 0 || defenderElems.length === 0) return 1.0;
  const attackRow = (e: string) => TYPE_MATRIX[e as ET] ?? null;

  // For each defender element, pick the best attacker matchup.
  // Start at -Infinity so weak (<1.0) single-type matchups are preserved.
  // If all attacker types are unknown (no valid row), default to 1.0.
  let mult = 1.0;
  for (const def of defenderElems) {
    let best = -Infinity;
    for (const atk of attackerElems) {
      const row = attackRow(atk);
      if (row) best = Math.max(best, row[def as ET] ?? 1.0);
    }
    if (!isFinite(best)) best = 1.0; // all attacker types unknown → safe fallback
    mult *= best;
  }
  return mult;
}

// ─── Universal StatModifier Application ──────────────────────────────────────

/**
 * Applies a single StatModifier to a bey's live numeric stats.
 * Duration tracking is handled by the caller (BattleRoom / TryoutRoom).
 */
const VALID_STAT_KEYS = new Set([
  "spin", "maxSpin", "spinDecayRate", "aggressiveness", "gripFactor",
  "recoilFactor", "spinStealResist", "damageMultiplier", "damageReduction",
  "surfaceFriction", "contactDamageMultiplier",
  // Universal stat vocabulary additions:
  "speed", "mass", "radius", "width", "height", "depth",
  "spinStealFactor", "jumpForce", "jumpHeight",
  "suctionForce", "wallClimbFactor", "gravityMult", "bounceRestitution",
  "tiltResistance", "burstResistance",
]);

export function applyStatModifier(bey: Beyblade, mod: StatModifier): void {
  if (!VALID_STAT_KEYS.has(mod.targetStat)) return;
  const key = mod.targetStat as keyof Beyblade;
  const current = (bey[key] as number) ?? 0;
  let next: number;

  switch (mod.operation) {
    case "add":      next = current + mod.value; break;
    case "multiply": next = current * mod.value; break;
    case "set":      next = mod.value; break;
    default:         return;
  }

  // Cap spin to maxSpin
  if (mod.targetStat === "spin") next = Math.min(bey.maxSpin, next);

  (bey as unknown as Record<string, number>)[key as string] = next;
}

/**
 * Dispatches a StatModifier event (on_land, on_hit_opponent, etc.) for all parts
 * on a bey. Applies matching modifiers immediately.
 * Parts are passed as an array of part objects (resolved from Firestore cache).
 */
export function dispatchStatModifierEvent(
  bey: Beyblade,
  event: StatModifierEvent,
  parts: Array<{ statModifiers?: StatModifier[] }>
): void {
  for (const part of parts) {
    for (const mod of part.statModifiers ?? []) {
      if (mod.event === event) {
        applyStatModifier(bey, mod);
      }
    }
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const OBSTACLE_RELAUNCH_THRESHOLD = 15; // impact force needed to re-launch a stationary DetachedBody
export const FRAGMENT_LIFETIME_TICKS_DEFAULT = 180; // 3s at 60Hz for escaped pocket balls
export const LEFT_SPIN_HOP_MIN_FORCE = 5; // minimum impact force to trigger a left-spin hop

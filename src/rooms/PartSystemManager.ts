// [2.5D] PartSystemManager — per-room, per-bey 2.5D part system state machine.
// Rooms instantiate ONE manager and call:
//   • manager.registerBey(sessionId, beybladeSystem, resolvedParts, bey)  — at join
//   • manager.tickBey(sessionId, bey, gameState, baseSpinDecayRate)        — inside tick()
//   • manager.onBeyCollision(attackerId, defenderId, force, beys, gs)     — after collision resolved
//   • manager.onButtonPressed(sessionId, bey)                              — player button event
//   • manager.onSpecialMove(sessionId, bey)                               — special move fired
//   • manager.computeLandingAOE(sessionId, bey, otherBeys)               — on jump landing
//
// The existing tick loop and PhysicsEngine.ts are UNCHANGED.
// This manager is a pure opt-in extension — if no BeybladeSystem is registered for a bey,
// all calls are no-ops and the standard 2D battle logic continues normally.

import type {
  BeybladeSystem,
  SubPart,
  TipPart,
  CorePart,
  CasingPart,
  ARPart,
  WDPart,
  BitBeastPart,
  SpinTrackPart,
  StatModifier,
  StatModifierEvent,
  BasePart,
  PartConfiguration,
} from "../../client/src/types/beybladeSystem";
import { type Beyblade, type GameState, DetachedBodySchema } from "./schema/GameState";
import {
  evaluateSwitchTargets,
  isTriggerMet,
  tickSpinInjection,
  tickCounterRotation,
  tickJumpMovement,
  computeLandingDamage,
  tickDetachedBody,
  spawnDetachedBody,
  applyStatModifier,
  dispatchStatModifierEvent,
  applyBearingFrictionToSteal,
  getBearingDecayMult,
  checkLeftSpinHop,
  OBSTACLE_RELAUNCH_THRESHOLD,
  FRAGMENT_LIFETIME_TICKS_DEFAULT,
} from "../physics/PartPhysics";
import { v4 as uuidv4 } from "uuid";
import { computeClimbingForces, updateBeyTilt, type ArenaGeometry } from "../physics/ClimbingPhysics";

// ─── Part Cache Bundle ─────────────────────────────────────────────────────────

export interface ResolvedPartBundle {
  tip?: TipPart;
  ar?: ARPart;
  wd?: WDPart;
  core?: CorePart;
  casing?: CasingPart;
  bitBeast?: BitBeastPart;
  spinTrack?: SpinTrackPart;
  subParts: SubPart[];
}

// ─── Per-Bey Runtime State ────────────────────────────────────────────────────

interface BeyPartState {
  system: BeybladeSystem;
  parts: ResolvedPartBundle;
  // Mechanism fire counts per (subPartIdx × 1000 + switchTargetIdx)
  mechanismFireCounts: Map<number, number>;
  // Active StatModifier durations: map from part+modIdx key → ticks remaining
  activeModifiers: Map<string, { mod: StatModifier; ticksLeft: number }>;
  // Jump-core ticks since last hop
  ticksSinceLastHop: number;
  // Arena center/radius (set at room creation, used for DetachedBody bounds check)
  arenaCenterX: number;
  arenaCenterY: number;
  arenaRadius: number;
}

// ─── PartSystemManager ─────────────────────────────────────────────────────────

/** Player-driven mode switch cooldown — prevents spam toggling. */
export const MODE_SWITCH_COOLDOWN_MS = 2_000;
/** Hard cap on effective combo count (per-part union with whole-bey) — HUD-sane. */
const EFFECTIVE_COMBO_CAP = 8;

/** Map a PartLayer key (used in activePartConfigs / mode:switch payloads) to the
 *  resolved part bundle slot. Keeps the rest of the codebase free of stringly typed
 *  switches. */
function pickPartByLayer(parts: ResolvedPartBundle, partLayer: string): BasePart | undefined {
  switch (partLayer) {
    case "tip": return parts.tip;
    case "ar":
    case "attack_ring": return parts.ar;
    case "wd":
    case "weight_disk": return parts.wd;
    case "core": return parts.core;
    case "casing": return parts.casing;
    case "bit_beast": return parts.bitBeast;
    case "spin_track": return parts.spinTrack;
    default: {
      const subMatch = /^sub_part_(\d+)$/.exec(partLayer);
      if (subMatch) {
        const idx = Number(subMatch[1]);
        return parts.subParts[idx];
      }
      return undefined;
    }
  }
}

/** Read the configurations list off whichever concrete part type carries one. */
function partConfigurations(part: BasePart | undefined): PartConfiguration<any>[] {
  if (!part) return [];
  const cfgs = (part as any).configurations;
  return Array.isArray(cfgs) ? cfgs : [];
}

export class PartSystemManager {
  private beyStates: Map<string, BeyPartState> = new Map();
  private arenaCenterX: number;
  private arenaCenterY: number;
  private arenaRadius: number;
  /** Effective combo ids per session — union of whole-bey + per-part, capped. */
  private effectiveCombos: Map<string, string[]> = new Map();

  constructor(arenaCenterX: number, arenaCenterY: number, arenaRadius: number) {
    this.arenaCenterX = arenaCenterX;
    this.arenaCenterY = arenaCenterY;
    this.arenaRadius = arenaRadius;
  }

  /**
   * Register a bey's part system at join time.
   * Call this after loading the BeybladeSystem from Firestore.
   * Also saves defaultSpinDirection for counter-rotation revert.
   */
  registerBey(
    sessionId: string,
    system: BeybladeSystem,
    parts: ResolvedPartBundle,
    bey: Beyblade
  ): void {
    // Save the spin direction at match start for counter-rotation revert
    bey.defaultSpinDirection = bey.spinDirection || "right";

    // Initialize spin injection reserve if core has it
    if (parts.core?.spinInjection) {
      bey.coreReserveRemaining = parts.core.spinInjection.reserveCapacity;
    }

    // ── Merge climbing / tilt stats from parts ───────────────────────────────
    // Walk all parts in priority order (most-specific part wins via Math.max).
    // These stats feed computeClimbingForces() and updateBeyTilt() each tick.
    this.mergeClimbingStats(bey, parts);

    this.beyStates.set(sessionId, {
      system,
      parts,
      mechanismFireCounts: new Map(),
      activeModifiers: new Map(),
      ticksSinceLastHop: 0,
      arenaCenterX: this.arenaCenterX,
      arenaCenterY: this.arenaCenterY,
      arenaRadius: this.arenaRadius,
    });

    // ── Merge per-part combos into the bey's runtime combo list ─────────────
    // Whole-bey combos (from BeybladeStats.comboIds) are already populated on
    // bey.comboIds by the room's applyBeybladeStats. Add the union of all part
    // comboIds and clip to EFFECTIVE_COMBO_CAP.
    const allParts = this.getAllPartsArray(parts);
    const seen = new Set<string>();
    const merged: string[] = [];
    bey.comboIds.forEach((id) => {
      if (typeof id === "string" && !seen.has(id)) { seen.add(id); merged.push(id); }
    });
    for (const p of allParts) {
      const ids: string[] = ((p as any).comboIds ?? (p as BasePart).comboEffects ?? []);
      for (const id of ids) {
        if (!id || seen.has(id) || merged.length >= EFFECTIVE_COMBO_CAP) continue;
        seen.add(id);
        merged.push(id);
      }
    }
    this.effectiveCombos.set(sessionId, merged);
    // Reflect the merged list onto the bey schema so existing combo lookups
    // (which read bey.comboIds in every room) pick up per-part combos for free.
    bey.comboIds.clear();
    for (const id of merged) bey.comboIds.push(id);

    // ── Resolve special move: whole-bey wins, else first part in canonical order ─
    if (!bey.specialMove || bey.specialMove === "tactical_burst") {
      const orderedParts: Array<BasePart | undefined> = [
        parts.bitBeast, parts.core, parts.ar, parts.casing, parts.tip, parts.wd, parts.spinTrack,
        ...parts.subParts,
      ];
      for (const p of orderedParts) {
        const sid = (p as any)?.specialMoveId;
        if (sid) { bey.specialMove = sid; break; }
      }
    }

    // ── Seed defaults for any playerSwitchable configs so the HUD starts honest. ─
    // For each part slot, if no activePartConfig is set, choose the first
    // playerSwitchable config (if any) as the default starting mode.
    const setLayerDefault = (layerKey: string, part?: BasePart) => {
      if (!part) return;
      const existing = bey.activePartConfigs.get(layerKey);
      if (existing) return;
      const cfgs = partConfigurations(part);
      const def = cfgs.find((c) => c.playerSwitchable === true);
      if (def?.name) bey.activePartConfigs.set(layerKey, def.name);
    };
    setLayerDefault("ar", parts.ar);
    setLayerDefault("tip", parts.tip);
    setLayerDefault("wd", parts.wd);
    setLayerDefault("core", parts.core);
    setLayerDefault("casing", parts.casing);
    setLayerDefault("bit_beast", parts.bitBeast);
    setLayerDefault("spin_track", parts.spinTrack);
    parts.subParts.forEach((sp, idx) => setLayerDefault(`sub_part_${idx}`, sp));
  }

  /** Effective combo ids for a bey — union of whole-bey and per-part comboIds. */
  getEffectiveComboIds(sessionId: string): string[] {
    return this.effectiveCombos.get(sessionId) ?? [];
  }

  /**
   * Player-initiated mode switch — flip activePartConfigs[partLayer] to the named
   * configuration. If configId is omitted, cycle to the next playerSwitchable
   * configuration on that part. Returns the activated config name, or null when
   * rejected (cooldown, unknown layer, no switchable configs, etc.).
   */
  applyConfigSwitch(
    sessionId: string,
    bey: Beyblade,
    partLayer: string,
    configId: string | undefined,
    nowMs: number = Date.now()
  ): string | null {
    const state = this.beyStates.get(sessionId);
    if (!state) return null;
    const part = pickPartByLayer(state.parts, partLayer);
    const cfgs = partConfigurations(part).filter((c) => c.playerSwitchable === true);
    if (cfgs.length === 0) return null;

    const lastAt = bey.configLastSwitchAt.get(partLayer) ?? 0;
    if (nowMs - lastAt < MODE_SWITCH_COOLDOWN_MS) return null;

    let target: PartConfiguration<any> | undefined;
    if (configId) {
      target = cfgs.find((c) => c.name === configId);
    } else {
      // Cycle to next switchable config after the currently active one.
      const current = bey.activePartConfigs.get(partLayer) ?? "";
      const currIdx = cfgs.findIndex((c) => c.name === current);
      target = cfgs[(currIdx + 1) % cfgs.length];
    }
    if (!target) return null;

    bey.activePartConfigs.set(partLayer, target.name);
    bey.configLastSwitchAt.set(partLayer, nowMs);

    // on_config_change hook — dispatch StatModifier events on the affected part.
    if (part && (part as any).statModifiers) {
      dispatchStatModifierEvent(bey, "on_config_change", [part as any]);
    }
    return target.name;
  }

  /** Unregister on leave. */
  unregisterBey(sessionId: string): void {
    this.beyStates.delete(sessionId);
    this.effectiveCombos.delete(sessionId);
  }

  /**
   * Main per-tick update for a bey.
   * Call this from the room's tick() loop after syncing physics state.
   * Returns bearing-adjusted spin decay rate to use instead of the base rate.
   *
   * @param arenaGeometry  Optional arena geometry for climbing/suction physics.
   *                       When provided, computeClimbingForces() is called and
   *                       the resulting forces are applied via the applyForce callback.
   * @param applyForce     Optional callback to apply a physics force to a bey body.
   *                       Signature: (sessionId, forceX, forceY) => void.
   *                       Required when arenaGeometry is provided.
   */
  tickBey(
    sessionId: string,
    bey: Beyblade,
    gameState: GameState,
    baseSpinDecayRate: number,
    arenaGeometry?: ArenaGeometry,
    applyForce?: (sessionId: string, forceX: number, forceY: number) => void
  ): { adjustedSpinDecayRate: number } {
    const state = this.beyStates.get(sessionId);
    if (!state) return { adjustedSpinDecayRate: baseSpinDecayRate };

    const { parts, activeModifiers } = state;

    // ── 1. Active StatModifier duration tick ────────────────────────────────
    for (const [key, entry] of activeModifiers) {
      if (entry.ticksLeft > 0) {
        applyStatModifier(bey, entry.mod);
        entry.ticksLeft--;
      }
      if (entry.ticksLeft === 0) {
        activeModifiers.delete(key);
      }
    }

    // ── 2. Spin injection (power-boost core) ────────────────────────────────
    const coreConfig = bey.activePartConfigs.get("core") ?? "";
    if (parts.core?.spinInjection) {
      const cfg = this.resolveSpinInjectionConfig(parts.core, coreConfig);
      if (cfg?.enabled) {
        const threshold = cfg.spinThreshold ?? 0.5;
        const shouldActivate =
          cfg.activationCondition === "always" ||
          (cfg.activationCondition === "spin_threshold" &&
            bey.spin / bey.maxSpin < threshold);
        if (shouldActivate) {
          tickSpinInjection(bey, {
            ...cfg,
            reserveRemaining: bey.coreReserveRemaining,
          });
        }
      }
    }

    // ── 3. Counter-rotation sequence ────────────────────────────────────────
    if (parts.core?.counterRotation && bey.counterRotActive) {
      const cfg = this.resolveCounterRotationConfig(parts.core, coreConfig);
      if (cfg) tickCounterRotation(bey, cfg);
    }

    // ── 4. Bearing friction — adjust spin decay rate ─────────────────────────
    let adjustedSpinDecayRate = baseSpinDecayRate;
    if (parts.tip?.bearingFriction != null) {
      adjustedSpinDecayRate *= getBearingDecayMult(parts.tip.bearingFriction);
    }

    // ── 5. Jump-core movement tick ───────────────────────────────────────────
    const coreCfgOverrides = this.getCoreConfigOverrides(parts.core, coreConfig);
    if (coreCfgOverrides?.movementOverride?.type === "jump") {
      const jumpCfg = coreCfgOverrides.movementOverride.jumpConfig;
      if (jumpCfg) {
        state.ticksSinceLastHop++;
        const { landingFired } = tickJumpMovement(
          bey,
          jumpCfg.jumpPeriodTicks,
          jumpCfg.airborneTickDuration,
          state.ticksSinceLastHop
        );
        if (landingFired) {
          state.ticksSinceLastHop = 0;
          // Dispatch on_land events
          const allParts = this.getAllPartsArray(parts);
          dispatchStatModifierEvent(bey, "on_land", allParts);
          // SpinBoostOnLand
          if (jumpCfg.landingDamage?.spinBoostOnLand) {
            bey.spin = Math.min(
              bey.maxSpin,
              bey.spin + bey.maxSpin * jumpCfg.landingDamage.spinBoostOnLand
            );
          }
        }
        if (bey.isAirborne) {
          adjustedSpinDecayRate = 0; // no floor contact → no spin decay
        }
      }
    }

    // ── 6. Airborne from jump-core: no spin decay ────────────────────────────
    // (already handled above — airborneTicksRemaining / isAirborne set by tickJumpMovement)

    // ── 7. DetachedBody state tick ───────────────────────────────────────────
    const toRemove: string[] = [];
    gameState.detachedBodies.forEach((body, key) => {
      const remove = tickDetachedBody(
        body,
        this.arenaRadius,
        this.arenaCenterX,
        this.arenaCenterY,
        OBSTACLE_RELAUNCH_THRESHOLD,
        0 // no incoming force for passive tick; collision-driven relaunch handled in onBeyCollision
      );
      if (remove) toRemove.push(key);
    });
    toRemove.forEach((k) => gameState.detachedBodies.delete(k));

    // ── 8. Bey-axis tilt physics (2.5D) ─────────────────────────────────────
    // beyTiltAngle is updated each tick; wobbleAmplitude is derived from it.
    // Impact force is injected by onBeyCollision; here we pass 0 (passive tick).

    // Build the shared ClimbingBeyState used by both climbing and tilt functions.
    const climbingState = {
      x: bey.x ?? 0,
      y: bey.y ?? 0,
      beyTiltAngle: (bey as any).beyTiltAngle ?? 0,
      spin: bey.spin,
      maxSpin: bey.maxSpin,
      mass: bey.mass,
      suctionForce: (bey as any).suctionForce ?? 0,
      wallClimbFactor: (bey as any).wallClimbFactor ?? 0,
      gravityMult: (bey as any).gravityMult ?? 1,
      gripFactor: bey.gripFactor ?? 0.3,
      tiltResistance: (bey as any).tiltResistance ?? 0.5,
      lateralStiffness: (bey as any).lateralStiffness ?? 0.5,
      adhering: (bey as any).adhering ?? false,
      adheringSurfaceAngle: (bey as any).adheringSurfaceAngle ?? 0,
      wallClimbing: (bey as any).wallClimbing ?? false,
      effectiveGravity: (bey as any).effectiveGravity ?? 9.8,
    };

    // ── 8a. Climbing / suction forces ────────────────────────────────────────
    // computeClimbingForces returns adhesion and wall-climb accelerations.
    // These are converted to Matter.js forces (F = m * a) and applied via the
    // caller-supplied applyForce callback so the physics engine stays in control.
    if (arenaGeometry && applyForce) {
      const climbResult = computeClimbingForces(climbingState, arenaGeometry, 1 / 60);

      // Update climbingState flags so tilt physics below sees the latest values.
      climbingState.adhering = climbResult.adhering;
      climbingState.adheringSurfaceAngle = climbResult.adheringSurfaceAngle;
      climbingState.wallClimbing = climbResult.wallClimbing;
      climbingState.effectiveGravity = climbResult.effectiveGravity;

      // Write updated state flags back onto the bey schema.
      (bey as any).adhering = climbResult.adhering;
      (bey as any).adheringSurfaceAngle = climbResult.adheringSurfaceAngle;
      (bey as any).wallClimbing = climbResult.wallClimbing;
      (bey as any).effectiveGravity = climbResult.effectiveGravity;

      // Apply adhesion force (direction converted from degrees to XY vector).
      if (climbResult.adhesionAccel !== 0) {
        const adhesionRad = (climbResult.adhesionDirection * Math.PI) / 180;
        // Mass stored in grams; Matter.js uses kg internally, but forces are
        // applied in the same unit system as the engine (pixels / s²).
        // Here we treat mass/1000 as kg for dimensional consistency with ClimbingPhysics.
        const massKg = (bey.mass ?? 30) / 1000;
        const forceN = climbResult.adhesionAccel * massKg;
        applyForce(sessionId, Math.cos(adhesionRad) * forceN, Math.sin(adhesionRad) * forceN);
      }

      // Apply wall-climb friction (vertical, opposing gravity — i.e. upward: angle 90°).
      if (climbResult.wallClimbFrictionAccel !== 0) {
        const massKg = (bey.mass ?? 30) / 1000;
        const forceN = climbResult.wallClimbFrictionAccel * massKg;
        // Upward force counteracts gravity: positive Y = up in ClimbingPhysics convention.
        applyForce(sessionId, 0, forceN);
      }
    }

    // ── 8b. Bey-axis tilt update ─────────────────────────────────────────────
    if (typeof (bey as any).beyTiltAngle === "number") {
      const tiltResult = updateBeyTilt(
        climbingState,
        0, // no impact force on passive tick
        1 / 60 // dt in seconds
      );
      (bey as any).beyTiltAngle = tiltResult.beyTiltAngle;
      if (typeof (bey as any).wobbleAmplitude === "number") {
        (bey as any).wobbleAmplitude = tiltResult.wobbleAmplitude;
      }
    }

    return { adjustedSpinDecayRate };
  }

  /**
   * Called after a collision is resolved between two beys.
   * Handles:
   *   - SubPart switch target evaluation (impact triggers)
   *   - Bearing friction on spin-steal
   *   - Left-spin hop impulse
   *   - on_hit_opponent / on_hit_received StatModifier events
   *   - DetachedBody re-launch if hitting an obstacle
   *   - SubPart detachment trigger check
   */
  onBeyCollision(
    attackerId: string,
    defenderId: string,
    impactForce: number,
    beys: Map<string, Beyblade>,
    gameState: GameState,
    applyHopImpulse?: (beyId: string, x: number, y: number) => void
  ): void {
    const attacker = beys.get(attackerId);
    const defender = beys.get(defenderId);
    if (!attacker || !defender) return;

    const attackerState = this.beyStates.get(attackerId);
    const defenderState = this.beyStates.get(defenderId);

    // Process attacker's SubPart switch targets
    if (attackerState) {
      attackerState.parts.subParts.forEach((sp, idx) => {
        if (sp.switchTargets?.length) {
          evaluateSwitchTargets(
            sp.switchTargets,
            attacker,
            impactForce,
            attackerState.mechanismFireCounts,
            idx,
            sp.mechanismDurability
          );
        }
        // Check detachment trigger
        if (sp.detachment?.enabled && sp.detachment.trigger === "impact_threshold") {
          if (impactForce >= sp.detachment.triggerThreshold) {
            this.triggerDetachment(attackerId, idx, sp, attacker, gameState);
          }
        }
      });

      // Bearing friction on spin-steal received (attacker taking steal)
      if (attackerState.parts.tip?.bearingFriction != null) {
        // Steal reduction is applied at the collision resolution level —
        // here we just dispatch the stat modifier event
      }

      // Left-spin hop check for attacker
      if (attackerState.parts.tip && applyHopImpulse) {
        const tipConfig = attacker.activePartConfigs.get("tip") ?? "";
        const hopImpulse = checkLeftSpinHop(
          attackerState.parts.tip,
          tipConfig,
          attacker.spinDirection,
          impactForce
        );
        if (hopImpulse > 0) {
          const outX = attacker.x - defender.x;
          const outY = attacker.y - defender.y;
          const len = Math.hypot(outX, outY) || 1;
          applyHopImpulse(attackerId, (outX / len) * hopImpulse, (outY / len) * hopImpulse);
        }
      }

      // on_hit_opponent events
      const attackerAllParts = this.getAllPartsArray(attackerState.parts);
      dispatchStatModifierEvent(attacker, "on_hit_opponent", attackerAllParts);
    }

    // Process defender's SubPart switch targets
    if (defenderState) {
      defenderState.parts.subParts.forEach((sp, idx) => {
        if (sp.switchTargets?.length) {
          evaluateSwitchTargets(
            sp.switchTargets,
            defender,
            impactForce,
            defenderState.mechanismFireCounts,
            idx,
            sp.mechanismDurability
          );
        }
        if (sp.detachment?.enabled && sp.detachment.trigger === "impact_threshold") {
          if (impactForce >= sp.detachment.triggerThreshold) {
            this.triggerDetachment(defenderId, idx, sp, defender, gameState);
          }
        }
      });

      // on_hit_received events
      const defenderAllParts = this.getAllPartsArray(defenderState.parts);
      dispatchStatModifierEvent(defender, "on_hit_received", defenderAllParts);
    }

    // Re-launch any nearby obstacle DetachedBodies that were struck
    gameState.detachedBodies.forEach((body) => {
      if (body.state !== "obstacle") return;
      const dist = Math.hypot(body.x - attacker.x, body.y - attacker.y);
      if (dist < attacker.radius + body.radius + 5) {
        const removed = tickDetachedBody(
          body,
          this.arenaRadius,
          this.arenaCenterX,
          this.arenaCenterY,
          OBSTACLE_RELAUNCH_THRESHOLD,
          impactForce
        );
        if (removed) gameState.detachedBodies.delete(body.id);
      }
    });
  }

  /**
   * Bearing friction modifier for spin-steal calculation.
   * Call this in the collision handler BEFORE applying spin steal to the defender.
   * Returns the adjusted steal amount.
   */
  adjustSpinStealForBearing(defenderId: string, rawSteal: number): number {
    const state = this.beyStates.get(defenderId);
    if (!state || state.parts.tip?.bearingFriction == null) return rawSteal;
    return applyBearingFrictionToSteal(rawSteal, state.parts.tip.bearingFriction);
  }

  /**
   * Called when a player presses the secondary action button.
   * Dispatches on_button StatModifier events.
   */
  onButtonPressed(sessionId: string, bey: Beyblade): void {
    const state = this.beyStates.get(sessionId);
    if (!state) return;
    const allParts = this.getAllPartsArray(state.parts);
    dispatchStatModifierEvent(bey, "on_button", allParts);

    // Check if counter-rotation should activate via player_input
    if (state.parts.core?.counterRotation?.activationCondition === "player_input") {
      if (!bey.counterRotActive) {
        bey.counterRotActive = true;
        bey.counterRotStep = 0;
        bey.counterRotStepTick = 0;
        const coreConfig = bey.activePartConfigs.get("core") ?? "";
        const cfg = this.resolveCounterRotationConfig(state.parts.core, coreConfig);
        bey.spinDirection = cfg?.directionSequence?.[0] ?? "right";
      }
    }
  }

  /**
   * Called when a bey's special move activates.
   * Dispatches on_special_move events and fires 'special_move' ConfigTrigger switch targets.
   */
  onSpecialMove(sessionId: string, bey: Beyblade): void {
    const state = this.beyStates.get(sessionId);
    if (!state) return;

    const allParts = this.getAllPartsArray(state.parts);
    dispatchStatModifierEvent(bey, "on_special_move", allParts);

    // Evaluate special_move switch targets on all SubParts
    state.parts.subParts.forEach((sp, idx) => {
      if (!sp.switchTargets) return;
      const specialTargets = sp.switchTargets.filter(
        (sw) => sw.trigger.type === "special_move"
      );
      for (const sw of specialTargets) {
        bey.activePartConfigs.set(sw.targetLayer as string, sw.activateConfig);
      }
    });
  }

  /**
   * Computes landing AOE damage for a jump-core bey that just landed.
   * Returns a map of opponent beyId → spin damage to apply.
   */
  computeLandingAOE(
    sessionId: string,
    bey: Beyblade,
    otherBeys: Beyblade[]
  ): Map<string, number> {
    const state = this.beyStates.get(sessionId);
    if (!state) return new Map();

    const coreConfig = bey.activePartConfigs.get("core") ?? "";
    const overrides = this.getCoreConfigOverrides(state.parts.core, coreConfig);
    const jumpCfg = overrides?.movementOverride?.jumpConfig;
    if (!jumpCfg?.landingDamage?.enabled) return new Map();

    return computeLandingDamage(
      bey.x,
      bey.y,
      bey.mass,
      jumpCfg.jumpForce,
      bey.spin,
      bey.maxSpin,
      jumpCfg.landingDamage,
      otherBeys.map((b) => ({ id: b.id, x: b.x, y: b.y }))
    );
  }

  /** Whether this bey is using jump-only movement (no continuous orbit force). */
  isJumpOnlyMovement(sessionId: string, bey: Beyblade): boolean {
    const state = this.beyStates.get(sessionId);
    if (!state) return false;
    const coreConfig = bey.activePartConfigs.get("core") ?? "";
    const overrides = this.getCoreConfigOverrides(state.parts.core, coreConfig);
    return overrides?.movementOverride?.type === "jump";
  }

  // ─── Combination Lock ──────────────────────────────────────────────────────

  /**
   * Per-tick evaluation of combination-lock / unlock conditions for linked beys.
   * Call this from BattleRoom (or any room) after the main tick loop.
   *
   * @param beys  Map of beyId → any (raw physics/schema bey objects with .body, .spin, etc.)
   * @param tick  Current simulation tick counter (monotonically increasing).
   */
  tickCombinationLock(beys: Map<string, any>, tick: number): void {
    for (const [, bey] of beys) {
      if (!bey.combinedWith?.partnerBeySystemId) continue;

      const partner = beys.get(bey.linkedBeyId || "");
      if (!partner) continue;

      const spinRatio = bey.spin / Math.max(1, bey.maxSpin);
      const lockCond = bey.combinedWith?.lockCondition;
      const unlockCond = bey.combinedWith?.unlockCondition;

      if (!bey.combinationLocked && lockCond) {
        if (lockCond.type === "always") {
          bey.combinationLocked = true;
        } else if (lockCond.type === "spin_above" && spinRatio * 100 >= (lockCond.threshold ?? 70)) {
          bey.combinationLocked = true;
        }
      }

      if (bey.combinationLocked && unlockCond) {
        if (unlockCond.type === "spin_below" && spinRatio * 100 < (unlockCond.threshold ?? 30)) {
          bey.combinationLocked = false;
        } else if (unlockCond.type === "timer" && unlockCond.timerTicks != null) {
          // Track lock start tick; unlock after timerTicks
          if (!bey._lockStartTick) bey._lockStartTick = tick;
          if (tick - bey._lockStartTick >= unlockCond.timerTicks) {
            bey.combinationLocked = false;
            bey._lockStartTick = undefined;
          }
        }
      }

      // Update linkStrain: distance between partners / idealDistance
      if (bey.body && partner.body) {
        const dx = bey.body.position.x - partner.body.position.x;
        const dy = bey.body.position.y - partner.body.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ideal = (bey.combinedWith?.helicalDistance ?? 60);
        bey.linkStrain = Math.min(1, Math.max(0, (dist - ideal) / ideal));
      }
    }
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private getAllPartsArray(parts: ResolvedPartBundle): Array<{ statModifiers?: import("../../client/src/types/beybladeSystem").StatModifier[] }> {
    const arr = [];
    if (parts.tip) arr.push(parts.tip);
    if (parts.ar) arr.push(parts.ar);
    if (parts.wd) arr.push(parts.wd);
    if (parts.core) arr.push(parts.core);
    if (parts.casing) arr.push(parts.casing);
    if (parts.bitBeast) arr.push(parts.bitBeast);
    if (parts.spinTrack) arr.push(parts.spinTrack);
    arr.push(...parts.subParts);
    return arr;
  }

  /**
   * Walk all resolved parts and merge climbing/tilt stat overrides onto the bey.
   * Each stat is initialised to its default if unset, then each part may override
   * it via a direct property or a StatModifier with operation "set".
   * Called once at registerBey time so that computeClimbingForces() has valid
   * values on the very first tick.
   */
  private mergeClimbingStats(bey: Beyblade, parts: ResolvedPartBundle): void {
    const anyBey = bey as any;

    // Defaults — only set if not already populated by prior logic.
    if (anyBey.suctionForce == null)       anyBey.suctionForce = 0;
    if (anyBey.wallClimbFactor == null)    anyBey.wallClimbFactor = 0;
    if (anyBey.gravityMult == null)        anyBey.gravityMult = 1;
    if (anyBey.bounceRestitution == null)  anyBey.bounceRestitution = 0.3;
    if (anyBey.tiltResistance == null)     anyBey.tiltResistance = 0.5;

    // Walk parts in canonical order; each part may carry direct stat fields or
    // StatModifier entries with event "on_register" (operation "set" / "add").
    const allParts = this.getAllPartsArray(parts);
    for (const part of allParts) {
      const p = part as any;

      // Direct part-level stat overrides (e.g. TipPart.suctionForce).
      if (p.suctionForce      != null) anyBey.suctionForce      = Math.max(anyBey.suctionForce,      p.suctionForce);
      if (p.wallClimbFactor   != null) anyBey.wallClimbFactor   = Math.max(anyBey.wallClimbFactor,   p.wallClimbFactor);
      if (p.gravityMult       != null) anyBey.gravityMult       = p.gravityMult; // last-write-wins (multiplicative base)
      if (p.bounceRestitution != null) anyBey.bounceRestitution = Math.max(anyBey.bounceRestitution, p.bounceRestitution);
      if (p.tiltResistance    != null) anyBey.tiltResistance    = Math.max(anyBey.tiltResistance,    p.tiltResistance);

      // StatModifier entries with a setup-time event ("on_register" or no event).
      for (const mod of (part.statModifiers ?? [])) {
        const key = (mod as any).targetStat as string;
        if (
          key === "suctionForce" || key === "wallClimbFactor" ||
          key === "gravityMult"  || key === "bounceRestitution" ||
          key === "tiltResistance"
        ) {
          const event = (mod as any).event;
          // Apply modifiers that fire at construction time or have no specific event.
          if (!event || event === "on_register") {
            const current: number = anyBey[key] ?? 0;
            switch ((mod as any).operation) {
              case "add":      anyBey[key] = current + (mod as any).value; break;
              case "multiply": anyBey[key] = current * (mod as any).value; break;
              case "set":      anyBey[key] = (mod as any).value;           break;
            }
          }
        }
      }
    }
  }

  private resolveSpinInjectionConfig(core: CorePart, activeConfig: string) {
    if (activeConfig) {
      const cfg = core.configurations.find((c) => c.name === activeConfig);
      if (cfg?.overrides?.spinInjection) {
        return { ...core.spinInjection, ...cfg.overrides.spinInjection } as import("../../client/src/types/beybladeSystem").SpinInjectionConfig;
      }
    }
    return core.spinInjection;
  }

  private resolveCounterRotationConfig(core: CorePart, activeConfig: string) {
    if (activeConfig) {
      const cfg = core.configurations.find((c) => c.name === activeConfig);
      if (cfg?.overrides?.counterRotation) {
        return { ...core.counterRotation, ...cfg.overrides.counterRotation } as import("../../client/src/types/beybladeSystem").CounterRotationConfig;
      }
    }
    return core.counterRotation;
  }

  private getCoreConfigOverrides(
    core?: CorePart,
    activeConfig?: string
  ): CorePart["configurations"][number]["overrides"] | undefined {
    if (!core || !activeConfig) return undefined;
    return core.configurations.find((c) => c.name === activeConfig)?.overrides;
  }

  private triggerDetachment(
    sessionId: string,
    subPartIndex: number,
    subPart: SubPart,
    bey: Beyblade,
    gameState: GameState
  ): void {
    const det = subPart.detachment;
    if (!det?.enabled) return;

    // Mark the sub-part as detached in activePartConfigs
    bey.activePartConfigs.set(`sub_part_${subPartIndex}`, "detached");

    // Spawn a DetachedBodySchema
    const id = uuidv4();
    const speed = Math.hypot(bey.velocityX, bey.velocityY);
    const angle = Math.atan2(bey.velocityY, bey.velocityX);
    const spread = (Math.random() - 0.5) * 0.5;

    spawnDetachedBody(gameState, {
      id,
      bodyType: det.type,
      ownerSessionId: sessionId,
      x: bey.x,
      y: bey.y,
      velocityX: Math.cos(angle + spread) * speed * 0.6,
      velocityY: Math.sin(angle + spread) * speed * 0.6,
      radius: det.detachedRadius ?? 15,
      mass: det.detachedMass,
      spin: bey.spin * (det.initialSpinFraction ?? 0.7),
      maxSpin: bey.maxSpin * 0.8,
      spinDecayRate: det.spinDecayRate ?? 0.003,
      fragmentLifetimeTicks:
        det.type === "fragment" ? FRAGMENT_LIFETIME_TICKS_DEFAULT : 0,
    });

    // Handle split / combined bey
    const state = this.beyStates.get(sessionId);
    if (det.type === "mini_bey" && state?.system.combinedWith) {
      bey.isSplit = true;
      bey.splitBodyX = bey.x;
      bey.splitBodyY = bey.y;
      bey.splitBodySpin = bey.spin * (det.initialSpinFraction ?? 0.8);
    }
  }
}

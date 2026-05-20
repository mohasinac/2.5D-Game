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

export class PartSystemManager {
  private beyStates: Map<string, BeyPartState> = new Map();
  private arenaCenterX: number;
  private arenaCenterY: number;
  private arenaRadius: number;

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
  }

  /** Unregister on leave. */
  unregisterBey(sessionId: string): void {
    this.beyStates.delete(sessionId);
  }

  /**
   * Main per-tick update for a bey.
   * Call this from the room's tick() loop after syncing physics state.
   * Returns bearing-adjusted spin decay rate to use instead of the base rate.
   */
  tickBey(
    sessionId: string,
    bey: Beyblade,
    gameState: GameState,
    baseSpinDecayRate: number
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
        tickDetachedBody(
          body,
          this.arenaRadius,
          this.arenaCenterX,
          this.arenaCenterY,
          OBSTACLE_RELAUNCH_THRESHOLD,
          impactForce
        );
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
    const bearingFriction = state!.parts.tip!.bearingFriction ?? 1.0;
    return applyBearingFrictionToSteal(rawSteal, bearingFriction);
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
        const cfg = state.parts.core.counterRotation;
        bey.spinDirection = cfg.directionSequence[0];
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
    const det = subPart.detachment!;
    if (!det.enabled) return;

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

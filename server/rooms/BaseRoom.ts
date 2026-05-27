import { Room } from "colyseus";
import { GameState, Beyblade } from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { resolveWallAngle } from "../shared/physics/ArenaUtils";
import { populateArenaFeatures } from "../shared/rooms/populateArenaFeatures";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";
import type { GlobalSettingsDoc } from "../utils/tournamentFirebase";
import {
  WARMUP_DURATION_S, LAUNCH_DURATION_S,
  LAUNCH_MAX_POWER, LAUNCH_MAX_TILT,
  LAUNCH_GRACE_POWER,
} from "../shared/constants/gameConstants";

// ─── BaseRoom ────────────────────────────────────────────────────────────────
//
// Abstract base for all battle room types.  Contains the methods that are
// duplicated verbatim (or near-verbatim) across BattleRoom, AIBattleRoom,
// TournamentBattleRoom, and TryoutRoom:
//
//   applyBeybladeStats   — full stat formula (BattleRoom version — most complete)
//   applyDefaultStats    — fallback balanced preset
//   applyArenaToState    — copies ArenaConfig fields into Colyseus ArenaState
//   applyDefaultArena    — minimal fallback arena (name is overridden per room)
//   buildArenaWalls      — creates circular or rectangular Matter.js walls
//   applyArenaSystemSlope — 2.5D slope force / friction map
//
// Subclasses keep all room-specific logic and may override the no-op hooks
// onTickedBey / onBeyCollided if they also subclass a 2.5D extension.

export interface ReplayInputFrame {
  tick: number;
  bitmasks: Record<string, number>;
}

export abstract class BaseRoom<T extends GameState = GameState> extends Room<T> {
  protected physics!: PhysicsEngine;
  protected arenaCache: ArenaConfig | null = null;
  protected arenaSystem: ArenaSystem | null = null;
  protected globalSettings: GlobalSettingsDoc | null = null;
  protected rand!: () => number;

  // ─── Replay input log ──────────────────────────────────────────────────
  protected replayLog: ReplayInputFrame[] = [];
  protected replayTick: number = 0;

  protected recordInput(userId: string, bitmask: number): void {
    if (this.replayLog.length > 0 && this.replayLog[this.replayLog.length - 1].tick === this.replayTick) {
      this.replayLog[this.replayLog.length - 1].bitmasks[userId] = bitmask;
    } else {
      this.replayLog.push({ tick: this.replayTick, bitmasks: { [userId]: bitmask } });
    }
  }

  protected advanceReplayTick(): void {
    this.replayTick++;
  }

  protected getReplayData(): { frames: ReplayInputFrame[]; totalTicks: number } {
    return { frames: this.replayLog, totalTicks: this.replayTick };
  }

  // ─── Stat helpers ─────────────────────────────────────────────────────────

  /**
   * Apply Firestore beyblade stats to a Colyseus Beyblade schema object.
   * This is the most-complete version (from BattleRoom) — includes burstResistance
   * override and elementTypes (Phase AB).
   */
  protected applyBeybladeStats(beyblade: Beyblade, data: BeybladeStats): void {
    beyblade.type = data.type;
    beyblade.color = data.color ?? "";
    beyblade.spinDirection = data.spinDirection;
    beyblade.mass = data.mass;
    beyblade.radius = data.radius;
    beyblade.actualSize = data.radius * 24;

    // Optional special move + combos.  Both may be undefined on legacy beyblades.
    if (data.specialMoveId !== undefined) beyblade.specialMove = data.specialMoveId;
    beyblade.comboIds.clear();
    if (data.comboIds) {
      for (const id of data.comboIds.slice(0, 3)) beyblade.comboIds.push(id);
    }

    const attack  = data.typeDistribution.attack;
    const defense = data.typeDistribution.defense;
    const stamina = data.typeDistribution.stamina;

    beyblade.attackPoints  = attack;
    beyblade.defensePoints = defense;
    beyblade.staminaPoints = stamina;

    beyblade.damageMultiplier    = 1.0 + attack  * 0.007;
    beyblade.speedBonus          = 1.0 + attack  * 0.007;
    beyblade.damageTaken         = Math.max(0.45, 1 - defense * 0.003);
    beyblade.knockbackDistance   = 10 * (1 - defense * 0.00167);
    beyblade.invulnerabilityChance = 0.1 + defense * 0.000667;
    beyblade.maxStamina          = Math.ceil(1000 * (1 + stamina * 0.01333));
    beyblade.stamina             = beyblade.maxStamina;
    beyblade.spinStealFactor     = 0.1 * (1 + stamina * 0.02667);
    beyblade.spinDecayRate       = 8 * (1 - stamina * 0.001);
    beyblade.maxSpin             = Math.ceil(2000 * (1 + stamina * 0.008));
    beyblade.spin                = beyblade.maxSpin;

    switch (beyblade.type) {
      case "attack":
        beyblade.damageMultiplier *= 1.2;
        beyblade.maxStamina = 2500;
        beyblade.stamina    = 2500;
        beyblade.burstResistance = 20;
        break;
      case "defense":
        beyblade.damageTaken *= 0.8;
        beyblade.maxStamina = 2500;
        beyblade.stamina    = 2500;
        beyblade.burstResistance = 85;
        break;
      case "stamina":
        beyblade.burstResistance = 50;
        break;
      case "balanced":
        beyblade.maxStamina = Math.min(beyblade.maxStamina, 2500);
        beyblade.stamina    = beyblade.maxStamina;
        beyblade.burstResistance = 55;
        break;
    }

    // Per-beyblade override from Firestore stats (Phase R)
    if ((data as any).burstResistance !== undefined) {
      beyblade.burstResistance = (data as any).burstResistance;
    }

    // Element types (Phase AB) — max 2, stored as ArraySchema<string>
    beyblade.elementTypes.clear();
    const elemTypes: string[] = (data as any).elementTypes ?? [];
    for (const et of elemTypes.slice(0, 2)) beyblade.elementTypes.push(et);
  }

  /** Fallback stats when Firestore has no record for a beyblade. */
  protected applyDefaultStats(beyblade: Beyblade): void {
    beyblade.type              = "balanced";
    beyblade.color             = "#2288ff";
    beyblade.spinDirection     = "right";
    beyblade.mass              = 50;
    beyblade.radius            = 4;
    beyblade.actualSize        = 96;
    beyblade.attackPoints      = 120;
    beyblade.defensePoints     = 120;
    beyblade.staminaPoints     = 120;
    beyblade.damageMultiplier  = 1.84;
    beyblade.damageTaken       = 0.64;
    beyblade.knockbackDistance = 7.99;
    beyblade.invulnerabilityChance = 0.18;
    beyblade.spinStealFactor   = 0.42;
    beyblade.spinDecayRate     = 7.88;
    beyblade.maxStamina        = 1600;
    beyblade.stamina           = 1600;
    beyblade.maxSpin           = 2192;
    beyblade.spin              = 2192;
    beyblade.speedBonus        = 1.84;
  }

  // ─── Arena state helpers ──────────────────────────────────────────────────

  /**
   * Copy all fields from an ArenaConfig (Firestore doc) into the Colyseus
   * ArenaState schema.  Uses the most-complete version from BattleRoom which
   * includes wallHasSprings / wallSpringRecoilMultiplier, speedPaths, and the
   * full damage-multiplier fields added in later phases.
   */
  protected applyArenaToState(arenaData: ArenaConfig, arenaId: string): void {
    this.state.arena.id    = arenaData.id || arenaId;
    this.state.arena.name  = arenaData.name;
    this.state.arena.width  = arenaData.width;
    this.state.arena.height = arenaData.height;
    this.state.arena.shape  = arenaData.shape;
    this.state.arena.theme  = arenaData.theme;
    this.state.arena.rotation        = 0;   // advanced each tick
    this.state.arena.autoRotate      = !!arenaData.autoRotate;
    this.state.arena.rotationSpeed   = arenaData.rotationSpeed || 0;
    this.state.arena.rotationDirection =
      arenaData.rotationDirection === "counter-clockwise" ? "counterclockwise" : "clockwise";
    this.state.arena.tiltAngle             = arenaData.tiltAngle             ?? 0;
    this.state.arena.tiltDirection         = arenaData.tiltDirection         ?? 0;
    this.state.arena.tiltMode              = arenaData.tiltMode              ?? "fixed";
    this.state.arena.autoTilt              = !!arenaData.autoTilt;
    this.state.arena.tiltSpeed             = arenaData.tiltSpeed             ?? 0;
    this.state.arena.tiltPivotX            = arenaData.tiltPivotX            ?? 0;
    this.state.arena.tiltPivotY            = arenaData.tiltPivotY            ?? 0;
    this.state.arena.tiltOscillateMin      = arenaData.tiltOscillateMin      ?? 0;
    this.state.arena.tiltOscillateMax      = arenaData.tiltOscillateMax      ?? arenaData.tiltAngle ?? 0;
    this.state.arena.tiltOscillatePeriodMs = arenaData.tiltOscillatePeriodMs ?? 4000;
    this.state.arena.tiltPhaseMs           = 0;
    this.state.arena.rotationPivotX        = arenaData.rotationPivotX        ?? 0;
    this.state.arena.rotationPivotY        = arenaData.rotationPivotY        ?? 0;
    this.state.arena.gravity        = arenaData.gravity        || 0;
    this.state.arena.airResistance  = arenaData.airResistance  || 0.01;
    this.state.arena.surfaceFriction = arenaData.surfaceFriction || 0.01;

    if (arenaData.wall) {
      this.state.arena.wallEnabled               = arenaData.wall.enabled;
      this.state.arena.wallBaseDamage            = arenaData.wall.baseDamage;
      this.state.arena.wallRecoilDistance        = arenaData.wall.recoilDistance;
      this.state.arena.wallHasSpikes             = arenaData.wall.hasSpikes;
      this.state.arena.wallSpikeDamageMultiplier = arenaData.wall.spikeDamageMultiplier;
      this.state.arena.wallHasSprings            = false;
      this.state.arena.wallSpringRecoilMultiplier = 1.0;
    }

    this.state.arena.wallAngle = resolveWallAngle(arenaData);

    this.state.arena.loopCount      = arenaData.loops?.length ?? arenaData.speedPaths?.length ?? 0;
    this.state.arena.obstacleCount  = arenaData.obstacles?.length  ?? 0;
    this.state.arena.pitCount       = arenaData.pits?.length       ?? 0;
    this.state.arena.turretCount    = arenaData.turrets?.length    ?? 0;
    this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;

    // Populate runtime state maps so the client can render features
    populateArenaFeatures(this.state, arenaData as any, this.globalSettings);

    // Collision config (later phases)
    this.state.arena.arenaWallDamageMult       = arenaData.wallDamageMult       ?? 1.0;
    this.state.arena.arenaObstacleDamageMult   = arenaData.obstacleDamageMult   ?? 1.0;
    this.state.arena.arenaBeyDamageMult        = arenaData.beyDamageMult        ?? 1.0;
    this.state.arena.arenaProjectileDamageMult = arenaData.projectileDamageMult ?? 1.0;
    this.state.arena.arenaFriendlyFireEnabled  = arenaData.friendlyFireEnabled  ?? true;
    this.state.arena.arenaPhaseObstacles       = arenaData.phaseObstacles       ?? false;

    // World background (Phase BG)
    const wb = (arenaData as any).worldBackground;
    if (wb !== undefined) {
      this.state.arena.worldBgType     = wb?.type     ?? "none";
      this.state.arena.worldBgColor    = wb?.color    ?? "";
      this.state.arena.worldBgImageUrl = wb?.imageUrl ?? "";
      this.state.arena.worldBgOpacity  = wb?.opacity  ?? 1.0;
      this.state.arena.worldBgFit      = wb?.fit      ?? "cover";
      this.state.arena.worldBgBlurPx   = wb?.blurPx   ?? 0;
    }
  }

  /**
   * Minimal fallback arena applied when Firestore has no doc for the arena id.
   * Subclasses may override `defaultArenaName` to customise the display name.
   */
  protected applyDefaultArena(arenaId: string): void {
    this.state.arena.id              = arenaId;
    this.state.arena.name            = this.defaultArenaName;
    this.state.arena.width           = 50;
    this.state.arena.height          = 50;
    this.state.arena.shape           = "circle";
    this.state.arena.theme           = "default";
    this.state.arena.gravity         = 0;
    this.state.arena.airResistance   = 0.01;
    this.state.arena.surfaceFriction = 0.01;
    this.state.arena.wallEnabled     = true;
    this.state.arena.wallBaseDamage  = 5;
    this.state.arena.wallRecoilDistance = 2;
    this.state.arena.wallAngle       = 0;
    this.state.arena.wallHasSprings  = false;
    this.state.arena.wallSpringRecoilMultiplier = 1.0;
  }

  /** Display name used by applyDefaultArena.  Subclasses can override. */
  protected get defaultArenaName(): string { return "Standard Battle Arena"; }

  // ─── Physics wall setup ───────────────────────────────────────────────────

  /** Build Matter.js arena walls based on the current ArenaState shape. */
  protected buildArenaWalls(): void {
    if (this.state.arena.shape === "circle") {
      const radius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
      this.physics.createCircularArena(
        (this.state.arena.width  * 16) / 2,
        (this.state.arena.height * 16) / 2,
        radius
      );
    } else {
      this.physics.createRectangularArena(
        this.state.arena.width  * 16,
        this.state.arena.height * 16
      );
    }
  }

  // ─── 2.5D arena system slope physics ─────────────────────────────────────

  /** Apply slope force + friction zone from an ArenaSystem elevation map. */
  protected applyArenaSystemSlope(beyblade: Beyblade): void {
    if (!this.arenaSystem?.elevationMap || !this.arenaSystem.slopePhysics) return;

    const { tiltAngle = 0, tiltDirection = 0 } = this.arenaSystem.elevationMap;
    if (!tiltAngle) return;

    const strength = (tiltAngle / 30) * (this.arenaSystem.slopePhysics.gravityStrength ?? 0.5);
    const rad = (tiltDirection * Math.PI) / 180;

    const forceX = Math.cos(rad) * strength * 0.002 * beyblade.mass;
    const forceY = Math.sin(rad) * strength * 0.002 * beyblade.mass;
    this.physics.applyForce(beyblade.id, forceX, forceY);

    if (this.arenaSystem.slopePhysics.frictionMap) {
      for (const zone of this.arenaSystem.slopePhysics.frictionMap) {
        const dx = beyblade.x - zone.x * 24;
        const dy = beyblade.y - zone.y * 24;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= zone.radius * 24) {
          this.physics.setFrictionMultiplier(beyblade.id, zone.frictionMultiplier);
          break;
        }
      }
    }
  }

  // ─── Client-side AI input handler ────────────────────────────────────────

  /**
   * Registers an "ai-input" message handler so client-side AI can submit
   * bitmask inputs for AI-controlled beys. Call this in onCreate() of any
   * room that supports client-driven AI.
   *
   * The handler accepts `{ beyId: string; bitmask: number }` and applies
   * the bitmask to the named beyblade's physics body — identical to how
   * human input is processed.
   */
  protected registerAIInputHandler(
    applyInput: (beyId: string, bitmask: number) => void
  ): void {
    this.onMessage("ai-input", (_client, data: { beyId: string; bitmask: number }) => {
      if (typeof data?.beyId !== "string" || typeof data?.bitmask !== "number") return;
      const bey = this.state.beyblades.get(data.beyId);
      if (!bey || !bey.isActive) return;
      applyInput(data.beyId, data.bitmask);
    });
  }

  // ─── Launch input handler (shared across all rooms) ───────────────────────

  protected spectatorSessionsBase = new Set<string>();

  /**
   * Register the "launch-input" message handler.  Call in onCreate().
   * Pass the room's spectator set so spectator messages are ignored.
   */
  protected registerLaunchInputHandler(spectatorSessions?: Set<string>): void {
    const specs = spectatorSessions ?? this.spectatorSessionsBase;
    this.onMessage("launch-input", (client, data: {
      tilt: number; position: number; power: number;
      charging: boolean; launched: boolean;
    }) => {
      if (this.state.status !== "launching") return;
      if (specs.has(client.sessionId)) return;
      const bey = this.state.beyblades.get(client.sessionId);
      if (!bey || bey.launchReady || bey.launchFailed) return;

      bey.launchTilt = Math.max(-LAUNCH_MAX_TILT, Math.min(LAUNCH_MAX_TILT, data.tilt ?? 0));
      bey.launchPosition = Math.max(0, Math.min(1, data.position ?? 0.5));
      bey.launchPower = Math.max(0, Math.min(LAUNCH_MAX_POWER, data.power ?? 0));
      if (data.charging) bey.launchChargingStarted = true;

      if (data.launched && bey.launchPower > 0) {
        bey.launchReady = true;
      }
    });
  }

  // ─── Shared warmup/launch phase tick ─────────────────────────────────────

  protected warmupTimerBase = WARMUP_DURATION_S;
  protected launchPhaseTimerBase = LAUNCH_DURATION_S;

  /**
   * Tick the warmup phase.  Returns true if the phase transitioned to
   * "launching" (so the caller can do room-specific work like resetting
   * AI launch timers).
   */
  protected tickWarmupPhase(dt: number): boolean {
    if (this.state.status !== "warmup") return false;
    this.warmupTimerBase -= dt;
    this.state.timer = Math.max(0, this.warmupTimerBase);
    if (this.warmupTimerBase <= 0) {
      this.state.status = "launching";
      this.state.launchTimer = this.launchPhaseTimerBase;
      this.broadcast("launch-phase-start", {});
      return true;
    }
    return false;
  }

  /**
   * Tick the launch phase.  Returns true if the phase ended (all launched
   * or timer expired).  Calls `onLaunchTimeout()` when timer expires — override
   * to customise (e.g. TryoutRoom grants grace power instead of auto-fail).
   */
  protected tickLaunchPhase(dt: number): boolean {
    if (this.state.status !== "launching") return false;
    this.state.launchTimer = Math.max(0, this.state.launchTimer - dt);

    let allLaunched = this.state.beyblades.size > 0;
    this.state.beyblades.forEach(bey => {
      if (!bey.launchReady && !bey.launchFailed) allLaunched = false;
    });

    if (this.state.launchTimer <= 0 || allLaunched) {
      if (this.state.launchTimer <= 0) {
        this.onLaunchTimeout();
      }
      return true;
    }
    return false;
  }

  /**
   * Called when the launch timer expires.  Default: mark un-launched beys
   * as failed.  TryoutRoom overrides to grant grace power instead.
   */
  protected onLaunchTimeout(): void {
    this.state.beyblades.forEach(bey => {
      if (!bey.launchReady) bey.launchFailed = true;
    });
  }

  /** Reset warmup timer for next game in a series. */
  protected resetWarmupTimer(): void {
    this.warmupTimerBase = WARMUP_DURATION_S;
  }

  // ─── 2.5D extension hooks — no-op defaults ───────────────────────────────

  /** Called after each beyblade physics tick.  Override in 2.5D subclasses. */
  protected onTickedBey(_beyblade: Beyblade, _dt: number): void { /* no-op */ }

  /** Called after each beyblade-vs-beyblade collision.  Override in 2.5D subclasses. */
  protected onBeyCollided(_id1: string, _id2: string, _impactForce: number): void { /* no-op */ }
}

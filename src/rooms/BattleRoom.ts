import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats } from "../utils/firebase";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import {
  ComboTracker, detectCombo, createComboTracker,
  BeyComboMatchState, createBeyComboMatchState, resetBeyComboMatchState,
  TriggerState, createTriggerState, detectTriggerCombos, recordComboFired,
  TriggerContext,
} from "../shared/utils/comboSystem";
import { normalizeBestOf, targetWinsFor } from "../shared/utils/seriesFormat";
import { normalizeInput, invertInputControls, type PlayerInput } from "../shared/utils/bitmask";
import { resolveWallAngle } from "../shared/physics/ArenaUtils";
import { processArenaFeatures } from "../shared/rooms/ArenaFeatureProcessor";
import { populateArenaFeatures } from "../shared/rooms/populateArenaFeatures";
import { advanceArenaRotation } from "../shared/rooms/advanceArenaRotation";
import {
  applyMovementInput,
  applyActionInput,
  computeForceMagnitude,
} from "../shared/rooms/InputHandler";
import {
  determineGameWinner,
  recordGameWin,
  buildSeriesScore,
  isSeriesOver,
  resetStateForNextGame,
} from "../shared/rooms/SeriesManager";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";
import { MODIFIER_MAP, type RoundModifier } from "../../client/src/types/roundModifier";

// [SERVER-ROOM] BattleRoom — live PVP for 2-4 players + spectators.
// Runs full beyblade-vs-beyblade collision detection.
// Arena config cached in onCreate() — never loaded inside tick.

interface JoinOptions {
  beybladeId: string;
  arenaId: string;
  arenaSystemId?: string;
  userId: string;
  username: string;
  spectate?: boolean;
  bestOf?: 1 | 3 | 5;
  modifierIds?: string[];   // round modifiers selected by the lobby host
}

// Spawn positions distributed evenly around the arena at 60% radius
const SPAWN_OFFSETS = [
  { angle: 0 },
  { angle: Math.PI },
  { angle: Math.PI / 2 },
  { angle: (3 * Math.PI) / 2 },
];

export class BattleRoom extends Room<GameState> {
  protected physics!: PhysicsEngine;
  protected arenaCache: ArenaConfig | null = null;
  protected arenaSystem: ArenaSystem | null = null;
  private matchStarted = false;
  private warmupTimer = 3;
  private lastInputTime = 0;
  private globalSettings: GlobalSettingsDoc | null = null;
  protected rand!: () => number;
  protected playerSessions = new Set<string>();
  protected spectatorSessions = new Set<string>();
  protected beybladeDataCache = new Map<string, BeybladeStats | null>();
  protected spawnPositions = new Map<string, { x: number; y: number }>();
  protected comboTrackers = new Map<string, ComboTracker>();
  protected comboMatchStates = new Map<string, BeyComboMatchState>();
  protected triggerStates = new Map<string, TriggerState>();
  /** Active round modifiers for this match (resolved once in onCreate). */
  protected activeModifiers: import("../../client/src/types/roundModifier").RoundModifier[] = [];
  /** Whether controls are inverted this match (from round modifier). */
  protected invertControlsActive = false;
  /** Per-session camera-follow target id (purely informational). */
  protected spectatorFollowTargets = new Map<string, string>();

  maxClients = 12; // 4 player slots + 8 spectator slots

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    console.log("BattleRoom created", options);

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enablePvp === false) throw new Error("PVP disabled");

    this.setState(new GameState());
    this.state.mode = options.ranked ? "single-battle-pvp-ranked" : "single-battle-pvp";
    this.state.status = "waiting";
    this.state.timer = 180;

    const bestOf = normalizeBestOf(options.bestOf);
    this.state.targetWins = targetWinsFor(bestOf);

    const seed = hashString(options.matchId || String(Date.now()));
    this.rand = createPRNG(seed);

    const arenaId = options.arenaId || "default";
    this.arenaCache = await loadArena(arenaId);
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, arenaId);
      console.log(`✅ BattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(arenaId);
    }

    if (options.arenaSystemId) {
      this.arenaSystem = await loadArenaSystem(options.arenaSystemId);
      if (this.arenaSystem) {
        console.log(`✅ BattleRoom: loaded arena system ${this.arenaSystem.displayName}`);
      }
    }

    this.physics = new PhysicsEngine();

    if (arenaData) {
      this.physics.setArenaConfig(arenaData);
      if ((arenaData.obstacles?.length ?? 0) > 0) {
        this.physics.createObstacles(arenaData.obstacles ?? []);
      }
    }

    this.buildArenaWalls();

    // Resolve and apply round modifiers (Phase X)
    this.resolveModifiers(options.modifierIds ?? [], this.arenaCache);

    this.onMessage("input", (client, message: number | PlayerInput) => {
      let input = normalizeInput(message);
      if (this.invertControlsActive) input = invertInputControls(input);
      this.handleInput(client, input);
    });

    this.onMessage("spectator:follow", (client, message: { targetBeybladeId?: string }) => {
      this.spectatorFollowTargets.set(client.sessionId, message?.targetBeybladeId ?? "");
    });

    this.onMessage("action", (client, message: any) => {
      this.handleAction(client, message);
    });

    this.onMessage("ready", (client) => {
      console.log(`Client ${client.sessionId} is ready`);
    });
  }

  async onJoin(client: Client, options: JoinOptions) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      console.log(`Spectator ${client.sessionId} joined BattleRoom (${this.state.spectatorCount} watching)`);
      return;
    }

    if (this.playerSessions.size >= 4) {
      client.leave(4000, "Match full");
      return;
    }

    this.playerSessions.add(client.sessionId);
    this.comboTrackers.set(client.sessionId, createComboTracker());
    this.comboMatchStates.set(client.sessionId, createBeyComboMatchState());
    this.triggerStates.set(client.sessionId, createTriggerState());
    console.log(`Player ${client.sessionId} joined BattleRoom (${this.playerSessions.size}/4)`);

    const beybladeData: BeybladeStats | null = await loadBeyblade(options.beybladeId);
    this.beybladeDataCache.set(client.sessionId, beybladeData);

    const beyblade = new Beyblade();
    beyblade.id = client.sessionId;
    beyblade.userId = options.userId || client.sessionId;
    beyblade.username = options.username || `Player${this.playerSessions.size}`;
    beyblade.beybladeId = options.beybladeId || "default";
    beyblade.isAI = false;

    if (beybladeData) {
      this.applyBeybladeStats(beyblade, beybladeData);
      console.log(`✅ Loaded beyblade: ${beybladeData.displayName} for ${beyblade.username}`);
    } else {
      this.applyDefaultStats(beyblade);
    }

    // Apply global stat factors from active round modifiers (Phase X)
    this.applyModifierFactors(beyblade);

    beyblade.health = beyblade.maxStamina;
    beyblade.maxHealth = beyblade.maxStamina;

    const spawnIndex = (this.playerSessions.size - 1) % SPAWN_OFFSETS.length;
    const spawnOffset = SPAWN_OFFSETS[spawnIndex];
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    beyblade.x = arenaHalfW + Math.cos(spawnOffset.angle) * spawnRadius;
    beyblade.y = arenaHalfH + Math.sin(spawnOffset.angle) * spawnRadius;

    this.spawnPositions.set(client.sessionId, { x: beyblade.x, y: beyblade.y });

    this.physics.createBeyblade(
      beyblade.id,
      beyblade.x,
      beyblade.y,
      beyblade.radius,
      beyblade.mass,
      beybladeData || undefined
    );

    const initialAngularVelocity = (beyblade.spinDirection === "left" ? -1 : 1) * (beyblade.maxSpin / 200);
    this.physics.setAngularVelocity(beyblade.id, initialAngularVelocity);

    this.state.beyblades.set(client.sessionId, beyblade);
    this.state.seriesWins.set(beyblade.userId, 0);

    if (!this.matchStarted) {
      this.matchStarted = true;
      this.state.status = "warmup";
      this.lastInputTime = Date.now();
      this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
      this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimer });
    }
  }

  onLeave(client: Client, consented: boolean) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }

    console.log(`Player ${client.sessionId} left BattleRoom`);
    this.playerSessions.delete(client.sessionId);
    this.comboTrackers.delete(client.sessionId);
    this.comboMatchStates.delete(client.sessionId);
    this.triggerStates.delete(client.sessionId);
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (beyblade) {
      beyblade.isActive = false;
      beyblade.isRingOut = true;
    }
    this.physics.removeBeyblade(client.sessionId);
    this.state.beyblades.delete(client.sessionId);

    if (this.state.status === "in-progress") {
      this.checkWinCondition();
    }

    if (this.playerSessions.size === 0) {
      this.disconnect();
    }
  }

  onDispose() {
    console.log("BattleRoom disposed");
    releaseRoom();
    this.physics.destroy();
  }

  // ─── Arena state helpers ─────────────────────────────────────────────────────

  private applyArenaToState(arenaData: ArenaConfig, arenaId: string) {
    this.state.arena.id = arenaData.id || arenaId;
    this.state.arena.name = arenaData.name;
    this.state.arena.width = arenaData.width;
    this.state.arena.height = arenaData.height;
    this.state.arena.shape = arenaData.shape;
    this.state.arena.theme = arenaData.theme;
    this.state.arena.rotation = 0; // angle (radians), advanced each tick
    this.state.arena.autoRotate = !!arenaData.autoRotate;
    this.state.arena.rotationSpeed = arenaData.rotationSpeed || 0;
    this.state.arena.rotationDirection = arenaData.rotationDirection === "counter-clockwise" ? "counterclockwise" : "clockwise";
    this.state.arena.gravity = arenaData.gravity || 0;
    this.state.arena.airResistance = arenaData.airResistance || 0.01;
    this.state.arena.surfaceFriction = arenaData.surfaceFriction || 0.01;

    if (arenaData.wall) {
      this.state.arena.wallEnabled = arenaData.wall.enabled;
      this.state.arena.wallBaseDamage = arenaData.wall.baseDamage;
      this.state.arena.wallRecoilDistance = arenaData.wall.recoilDistance;
      this.state.arena.wallHasSpikes = arenaData.wall.hasSpikes;
      this.state.arena.wallSpikeDamageMultiplier = arenaData.wall.spikeDamageMultiplier;
      this.state.arena.wallHasSprings = false;
      this.state.arena.wallSpringRecoilMultiplier = 1.0;
    }

    this.state.arena.wallAngle = resolveWallAngle(arenaData);

    this.state.arena.loopCount = arenaData.loops?.length ?? arenaData.speedPaths?.length ?? 0;
    this.state.arena.obstacleCount = arenaData.obstacles?.length ?? 0;
    this.state.arena.pitCount = arenaData.pits?.length ?? 0;
    this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
    this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;

    // Populate runtime state maps so the client can render the features
    // (Phase 8 must-have — previously, schemas existed but maps stayed empty).
    populateArenaFeatures(this.state, arenaData as any);
  }

  private applyDefaultArena(arenaId: string) {
    this.state.arena.id = arenaId;
    this.state.arena.name = "Standard Battle Arena";
    this.state.arena.width = 50;
    this.state.arena.height = 50;
    this.state.arena.shape = "circle";
    this.state.arena.theme = "metrocity";
    this.state.arena.gravity = 0;
    this.state.arena.airResistance = 0.01;
    this.state.arena.surfaceFriction = 0.01;
    this.state.arena.wallEnabled = true;
    this.state.arena.wallBaseDamage = 5;
    this.state.arena.wallRecoilDistance = 2;
    this.state.arena.wallAngle = 0;
  }

  /** Return the active comboCostMultiplier (product of all modifiers; default 1). */
  protected getComboCostMultiplier(): number {
    let mult = 1.0;
    for (const mod of this.activeModifiers) {
      if (mod.ruleOverrides?.comboCostMultiplier !== undefined) {
        mult *= mod.ruleOverrides.comboCostMultiplier;
      }
    }
    return mult;
  }

  /**
   * Resolve round modifiers from JoinOptions and arena defaults, then apply
   * physics/stat/rule overrides to the room state.
   */
  protected resolveModifiers(requestedIds: string[], arena: ArenaConfig | null) {
    const maxMods = arena?.maxModifiers ?? 2;

    // Merge: arena defaults first, then player-requested
    const allIds: string[] = [
      ...(arena?.defaultModifiers ?? []),
      ...requestedIds,
    ];

    // Handle random modifier
    if (arena?.randomModifiers && allIds.length === 0) {
      const keys = Array.from(MODIFIER_MAP.keys());
      const idx = Math.floor(this.rand() * keys.length);
      allIds.push(keys[idx]);
    }

    // Filter to allowed list if present
    const allowed = arena?.allowedModifiers;
    const filtered = allowed ? allIds.filter(id => allowed.includes(id)) : allIds;

    // Deduplicate and cap
    const seen = new Set<string>();
    const resolved: RoundModifier[] = [];
    for (const id of filtered) {
      if (seen.has(id)) continue;
      seen.add(id);
      const mod = MODIFIER_MAP.get(id);
      if (mod) {
        resolved.push(mod);
        if (resolved.length >= maxMods) break;
      }
    }

    this.activeModifiers = resolved;

    // Populate schema field so clients know which modifiers are active
    this.state.activeModifierIds.splice(0);
    for (const mod of resolved) {
      this.state.activeModifierIds.push(mod.id);
    }

    // Apply physics overrides to arena state
    for (const mod of resolved) {
      if (mod.physicsOverrides) {
        if (mod.physicsOverrides.gravityMult !== undefined) {
          // Stored for PhysicsEngine to use when applying gravity
          (this.state.arena as any).gravityMult =
            ((this.state.arena as any).gravityMult ?? 1.0) * mod.physicsOverrides.gravityMult;
        }
        if (mod.physicsOverrides.surfaceFriction !== undefined) {
          (this.state.arena as any).surfaceFriction = mod.physicsOverrides.surfaceFriction;
        }
        if (mod.physicsOverrides.wallRestitution !== undefined) {
          (this.state.arena as any).wallRestitution = mod.physicsOverrides.wallRestitution;
        }
        if (mod.physicsOverrides.airResistance !== undefined) {
          (this.state.arena as any).airResistance = mod.physicsOverrides.airResistance;
        }
      }

      // Chaos: invertControls
      if (mod.chaosParams?.invertControls) {
        this.invertControlsActive = true;
      }
    }

    if (resolved.length > 0) {
      console.log(`✅ BattleRoom: active modifiers: ${resolved.map(m => m.name).join(", ")}`);
    }
  }

  /** Apply globalFactors from active modifiers to a beyblade's stats. */
  protected applyModifierFactors(beyblade: import("./schema/GameState").Beyblade) {
    for (const mod of this.activeModifiers) {
      if (!mod.globalFactors) continue;
      for (const delta of mod.globalFactors) {
        switch (delta.stat) {
          case "speed":         beyblade.aggressiveness = (beyblade.aggressiveness || 0.5) * delta.multiplier; break;
          case "damageMultiplier": beyblade.damageMultiplier *= delta.multiplier; break;
          case "damageReduction":  beyblade.damageReduction *= delta.multiplier; break;
          case "spinDecayRate":    beyblade.spinDecayRate   *= delta.multiplier; break;
          case "mass":             beyblade.mass            *= delta.multiplier; break;
          // additional stat keys can be extended here
        }
      }
      // Rule overrides: burstResistance
      if (mod.ruleOverrides?.burstResistanceOverride !== undefined) {
        beyblade.burstResistance = mod.ruleOverrides.burstResistanceOverride;
      }
      if (mod.ruleOverrides?.spinDecayRateOverride !== undefined) {
        beyblade.spinDecayRate = beyblade.spinDecayRate * mod.ruleOverrides.spinDecayRateOverride;
      }
      // Chaos: randomize stats
      if (mod.chaosParams?.randomizeStats) {
        const scale = 0.5 + this.rand() * 1.5; // 0.5–2.0
        beyblade.damageMultiplier *= scale;
        beyblade.spinDecayRate    *= scale;
      }
    }
  }

  private buildArenaWalls() {
    if (this.state.arena.shape === "circle") {
      const radius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
      this.physics.createCircularArena(
        (this.state.arena.width * 16) / 2,
        (this.state.arena.height * 16) / 2,
        radius
      );
    } else {
      this.physics.createRectangularArena(
        this.state.arena.width * 16,
        this.state.arena.height * 16
      );
    }
  }

  // ─── Stat helpers ────────────────────────────────────────────────────────────

  private applyBeybladeStats(beyblade: Beyblade, data: BeybladeStats) {
    beyblade.type = data.type;
    beyblade.spinDirection = data.spinDirection;
    beyblade.mass = data.mass;
    beyblade.radius = data.radius;
    beyblade.actualSize = data.radius * 24;

    // Optional special move + combos. Both may be undefined on legacy beyblades.
    if (data.specialMoveId !== undefined) beyblade.specialMove = data.specialMoveId;
    beyblade.comboIds.clear();
    if (data.comboIds) {
      for (const id of data.comboIds.slice(0, 3)) beyblade.comboIds.push(id);
    }

    const attack = data.typeDistribution.attack;
    const defense = data.typeDistribution.defense;
    const stamina = data.typeDistribution.stamina;

    beyblade.attackPoints = attack;
    beyblade.defensePoints = defense;
    beyblade.staminaPoints = stamina;

    beyblade.damageMultiplier = 1.0 + attack * 0.007;
    beyblade.speedBonus = 1.0 + attack * 0.007;
    beyblade.damageTaken = Math.max(0.45, 1 - defense * 0.003);
    beyblade.knockbackDistance = 10 * (1 - defense * 0.00167);
    beyblade.invulnerabilityChance = 0.1 + defense * 0.000667;
    beyblade.maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
    beyblade.stamina = beyblade.maxStamina;
    beyblade.spinStealFactor = 0.1 * (1 + stamina * 0.02667);
    beyblade.spinDecayRate = 8 * (1 - stamina * 0.001);
    beyblade.maxSpin = Math.ceil(2000 * (1 + stamina * 0.008));
    beyblade.spin = beyblade.maxSpin;

    switch (beyblade.type) {
      case "attack":
        beyblade.damageMultiplier *= 1.2;
        beyblade.maxStamina = 2500;
        beyblade.stamina = 2500;
        beyblade.burstResistance = 20;
        break;
      case "defense":
        beyblade.damageTaken *= 0.8;
        beyblade.maxStamina = 2500;
        beyblade.stamina = 2500;
        beyblade.burstResistance = 85;
        break;
      case "stamina":
        beyblade.burstResistance = 50;
        break;
      case "balanced":
        beyblade.maxStamina = Math.min(beyblade.maxStamina, 2500);
        beyblade.stamina = beyblade.maxStamina;
        beyblade.burstResistance = 55;
        break;
    }

    // Per-beyblade override from Firestore stats (Phase R)
    if ((data as any).burstResistance !== undefined) {
      beyblade.burstResistance = (data as any).burstResistance;
    }
  }

  private applyDefaultStats(beyblade: Beyblade) {
    beyblade.type = "balanced";
    beyblade.spinDirection = "right";
    beyblade.mass = 50;
    beyblade.radius = 4;
    beyblade.actualSize = 96;
    beyblade.attackPoints = 120;
    beyblade.defensePoints = 120;
    beyblade.staminaPoints = 120;
    beyblade.damageMultiplier = 1.84;
    beyblade.damageTaken = 0.64;
    beyblade.knockbackDistance = 7.99;
    beyblade.invulnerabilityChance = 0.18;
    beyblade.spinStealFactor = 0.42;
    beyblade.spinDecayRate = 7.88;
    beyblade.maxStamina = 1600;
    beyblade.stamina = 1600;
    beyblade.maxSpin = 2192;
    beyblade.spin = 2192;
    beyblade.speedBonus = 1.84;
  }

  // ─── Input handling — delegates to shared/rooms/InputHandler ────────────────

  private handleInput(client: Client, message: PlayerInput) {
    if (this.spectatorSessions.has(client.sessionId)) return;

    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    if (this.state.status !== "in-progress") return;
    this.lastInputTime = Date.now();

    const forceMagnitude = computeForceMagnitude(beyblade);

    applyMovementInput(beyblade, message, forceMagnitude, this.physics);

    const events = applyActionInput(
      beyblade,
      message,
      forceMagnitude,
      this.physics,
      (b) => this.handleSpecialMove(b),
    );

    if (events.attacked) {
      this.broadcast("attack", { playerId: client.sessionId });
    }

    // ── Combo detection ──────────────────────────────────────────────────────
    const tracker = this.comboTrackers.get(client.sessionId);
    if (tracker && message.comboKeys && message.comboKeys.length > 0) {
      const now = Date.now();
      const attachedIds: string[] = Array.from(beyblade.comboIds).filter((s): s is string => typeof s === "string");
      const combo = detectCombo(tracker, message.comboKeys, now, {
        attachedComboIds: attachedIds,
        power: beyblade.power,
        beybladeType: beyblade.type,
        comboCostMultiplier: this.getComboCostMultiplier(),
      });
      if (combo) {
        beyblade.power = Math.max(0, beyblade.power - combo.costPaid);
        beyblade.comboDamageMultiplier = combo.damageMultiplier;
        beyblade.comboDamageMultiplierTimer = combo.durationMs / 1000;
        if (combo.lockMs > 0) {
          beyblade.controlLockedUntilMs = Math.max(beyblade.controlLockedUntilMs, now + combo.lockMs);
          beyblade.controlLockSource = "combo";
        }
        beyblade.comboCooldowns.set(combo.comboId, now + combo.durationMs);
        this.broadcast("combo", {
          playerId: beyblade.id,
          comboId: combo.comboId,
          comboName: combo.name,
          costPaid: combo.costPaid,
          effect: combo.effect,
          x: beyblade.x,
          y: beyblade.y,
        });
      }
    }
  }

  // ─── Special moves ───────────────────────────────────────────────────────────

  private handleSpecialMove(beyblade: Beyblade) {
    const state = this.physics.getBodyState(beyblade.id);
    if (!state) return;

    const movePayload = {
      playerId: beyblade.id,
      x: beyblade.x,
      y: beyblade.y,
      facing: beyblade.rotation,
    };

    switch (beyblade.type) {
      case "attack": {
        const rushForce = 0.005 * beyblade.mass * beyblade.damageMultiplier;
        this.physics.applyForce(
          beyblade.id,
          Math.cos(beyblade.rotation) * rushForce,
          Math.sin(beyblade.rotation) * rushForce
        );
        const boostedSpin = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.8);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boostedSpin : boostedSpin);
        this.broadcast("special-move", { ...movePayload, type: "stampede-rush" });
        break;
      }
      case "defense": {
        const maxAngular = beyblade.maxSpin / 200;
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -maxAngular : maxAngular);
        this.physics.applyForce(
          beyblade.id,
          -state.velocityX * beyblade.mass * 0.8,
          -state.velocityY * beyblade.mass * 0.8
        );
        beyblade.isInvulnerable = true;
        beyblade.invulnerabilityTimer = 1.5;
        this.broadcast("special-move", { ...movePayload, type: "gyro-anchor" });
        break;
      }
      case "stamina": {
        const orbitForce = 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * orbitForce, Math.cos(beyblade.rotation) * orbitForce);
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200));
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { ...movePayload, type: "spin-recovery" });
        break;
      }
      case "balanced": {
        const burstForce = 0.003 * beyblade.mass;
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * burstForce, Math.sin(beyblade.rotation) * burstForce);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { ...movePayload, type: "tactical-burst" });
        break;
      }
    }
  }

  private handleAction(client: Client, message: any) {
    if (this.spectatorSessions.has(client.sessionId)) return;
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive || this.state.status !== "in-progress") return;
    this.lastInputTime = Date.now();

    if (message.type === "charge") {
      const cur = this.physics.getBodyState(beyblade.id);
      if (cur) {
        const boosted = Math.min(beyblade.maxSpin / 200, Math.abs(cur.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
      }
    }
  }

  // ─── Game tick ───────────────────────────────────────────────────────────────

  private tick(deltaTime: number) {
    if (this.state.status === "in-progress" && Date.now() - this.lastInputTime > 60_000) {
      this.broadcast("idle-disconnect", {});
      this.disconnect();
      return;
    }

    const dt = deltaTime / 1000;

    // Server-authoritative arena rotation (Phase 14 review).
    advanceArenaRotation(this.state.arena, dt);

    if (this.state.status === "warmup") {
      this.warmupTimer -= dt;
      if (this.warmupTimer <= 0) {
        this.state.status = "in-progress";
        this.state.startTime = Date.now();
        this.broadcast("match-start", {});
      }
      return;
    }

    if (this.state.status !== "in-progress") return;

    this.physics.update(deltaTime);

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    const arenaData = this.arenaCache;
    const beybladeIds = Array.from(this.state.beyblades.keys());

    // ── Beyblade-vs-beyblade collision detection ────────────────────────────
    for (let i = 0; i < beybladeIds.length; i++) {
      for (let j = i + 1; j < beybladeIds.length; j++) {
        const id1 = beybladeIds[i];
        const id2 = beybladeIds[j];
        const b1 = this.state.beyblades.get(id1);
        const b2 = this.state.beyblades.get(id2);

        if (!b1 || !b2 || !b1.isActive || !b2.isActive) continue;

        const collision = this.physics.checkBeybladeCollision(id1, id2);
        if (!collision) continue;

        const dmg = this.physics.calculateCollisionDamage(collision, b1, b2);

        b1.health = Math.max(0, b1.health - dmg.damage1);
        b2.health = Math.max(0, b2.health - dmg.damage2);
        b1.spin = Math.max(0, b1.spin - dmg.spinSteal2);
        b2.spin = Math.max(0, b2.spin - dmg.spinSteal1);
        b1.damageDealt += dmg.damage2;
        b2.damageDealt += dmg.damage1;
        b1.damageReceived += dmg.damage1;
        b2.damageReceived += dmg.damage2;
        b1.collisions++;
        b2.collisions++;

        b1.power = Math.min(100, b1.power + (dmg.damage2 > 0 ? 0.5 : 0) + (dmg.damage1 > 0 ? 0.3 : 0));
        b2.power = Math.min(100, b2.power + (dmg.damage1 > 0 ? 0.5 : 0) + (dmg.damage2 > 0 ? 0.3 : 0));

        if (dmg.damage1 > 15) b1.attackBuffTimer = 0;
        if (dmg.damage2 > 15) b2.attackBuffTimer = 0;

        this.broadcast("collision", {
          p1: id1,
          p2: id2,
          damage1: dmg.damage1,
          damage2: dmg.damage2,
          spinSteal1: dmg.spinSteal1,
          spinSteal2: dmg.spinSteal2,
          contactPoint: collision.contactPoint,
        });

        // 2.5D hook: PartSystemManager picks this up to fire SubPart switches,
        // bearing friction, hop impulse, detachment, on_hit_* events.
        const impactForce = Math.max(dmg.damage1, dmg.damage2);
        this.onBeyCollided(id1, id2, impactForce);

        // ── Burst chance (Phase R) ────────────────────────────────────────────
        // Check both beys: the one that received higher damage may burst.
        const BURST_THRESHOLD = 40;
        for (const [victim, incomingDmg] of [[b1, dmg.damage1], [b2, dmg.damage2]] as [Beyblade, number][]) {
          if (!victim.isActive) continue;
          if (incomingDmg < BURST_THRESHOLD) continue;
          const spinRatioV = victim.maxSpin > 0 ? victim.spin / victim.maxSpin : 0;
          const burstRaw = Math.max(0, incomingDmg - BURST_THRESHOLD) * 0.005;
          const burstSpinMod = 1 + (1 - spinRatioV) * 2.0;
          const burstResist = victim.burstResistance ?? 50;
          const burstFinal = burstRaw * burstSpinMod * (1 - burstResist / 100);
          if (this.rand() < burstFinal) {
            victim.isActive = false;
            victim.spin = 0;
            const attackerId = victim === b1 ? id2 : id1;
            this.broadcast("burst", { beyId: victim.id, attackerId, x: victim.x, y: victim.y });
          }
        }
      }
    }

    // ── Reactive combos (trigger-based, Phase W) ─────────────────────────────
    this.tickReactiveCombos(Date.now());

    // ── Per-beyblade update ──────────────────────────────────────────────────
    this.state.beyblades.forEach((beyblade) => {
      const physicsState = this.physics.getBodyState(beyblade.id);
      if (!physicsState) return;

      beyblade.x = physicsState.x;
      beyblade.y = physicsState.y;
      beyblade.rotation = physicsState.rotation;
      beyblade.velocityX = physicsState.velocityX;
      beyblade.velocityY = physicsState.velocityY;
      beyblade.angularVelocity = physicsState.angularVelocity;

      if (arenaData) {
        const events = processArenaFeatures(
          beyblade,
          arenaData,
          this.state.arena,
          dt,
          this.physics,
          this.rand,
        );
        if (events.obstacleHit) this.broadcast("obstacle-collision", events.obstacleHit);
        if (events.wallHit) this.broadcast("wall-collision", events.wallHit);
      }

      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, (this.rand() - 0.5) * wobble, (this.rand() - 0.5) * wobble);
      }

      {
        const spinRatio = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
        const decayThisTick = beyblade.spinDecayRate * dt * (1 + (1 - spinRatio) * 0.5);
        beyblade.spin = Math.max(0, beyblade.spin - decayThisTick);
      }
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      if (beyblade.spin <= 0 && beyblade.isActive) {
        beyblade.isActive = false;
        beyblade.health = 0;
        this.broadcast("spin-out", { playerId: beyblade.id, username: beyblade.username, x: beyblade.x, y: beyblade.y, type: beyblade.type });
      }

      // Charge combo: update comboChargeScale for HUD rendering
      const matchState = this.comboMatchStates.get(beyblade.id);
      if (matchState?.chargeState) {
        const cs = matchState.chargeState;
        const ticksHeld = (Date.now() - cs.chargeStartMs) / (1000 / 60);
        const range = Math.max(1, cs.maxChargeTicks - cs.minChargeTicks);
        const raw = Math.max(0, ticksHeld - cs.minChargeTicks) / range;
        let scale = Math.min(1, raw);
        if (cs.chargeScale === "quadratic") scale = scale * scale;
        else if (cs.chargeScale === "step") scale = ticksHeld >= cs.minChargeTicks ? 1 : 0;
        beyblade.comboChargeScale = scale;
      } else {
        beyblade.comboChargeScale = 0;
      }

      if (beyblade.attackCooldown > 0) beyblade.attackCooldown -= dt;
      if (beyblade.specialCooldown > 0) beyblade.specialCooldown -= dt;

      if (beyblade.isInvulnerable) {
        beyblade.invulnerabilityTimer -= dt;
        if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false;
      }

      if (beyblade.specialMoveActive && Date.now() > beyblade.specialMoveEndTime) {
        beyblade.specialMoveActive = false;
      }

      if (beyblade.attackBuffTimer > 0) beyblade.attackBuffTimer = Math.max(0, beyblade.attackBuffTimer - dt);
      if (beyblade.dodgeBuffTimer > 0) {
        beyblade.dodgeBuffTimer = Math.max(0, beyblade.dodgeBuffTimer - dt);
        if (beyblade.inPit) beyblade.dodgeBuffTimer = 0;
      }
      if (beyblade.defenseBuffTimer > 0) {
        beyblade.defenseBuffTimer = Math.max(0, beyblade.defenseBuffTimer - dt);
        if (beyblade.defenseBuffTimer <= 0) beyblade.isDefending = false;
      }
      if (beyblade.isDefending) {
        beyblade.stamina = Math.max(0, beyblade.stamina - 60 * dt);
        if (beyblade.stamina < 10) { beyblade.isDefending = false; beyblade.defenseBuffTimer = 0; }
      }

      if (beyblade.isAirborne) {
        beyblade.airborneTimer = Math.max(0, beyblade.airborneTimer - dt);
        if (beyblade.airborneTimer <= 0) {
          beyblade.isAirborne = false;
          beyblade.landingLag = 0.2;
        }
      }
      if (beyblade.landingLag > 0) beyblade.landingLag = Math.max(0, beyblade.landingLag - dt);

      if (beyblade.stunTimer > 0) beyblade.stunTimer = Math.max(0, beyblade.stunTimer - dt);
      if (beyblade.comboExecuting && beyblade.comboTimer > 0) {
        beyblade.comboTimer = Math.max(0, beyblade.comboTimer - dt);
        if (beyblade.comboTimer <= 0) beyblade.comboExecuting = false;
      }

      if (beyblade.inLoop) beyblade.power = Math.min(100, beyblade.power + 2);

      // 2.5D hook: PartSystemManager.tickBey() goes here (no-op in base).
      this.onTickedBey(beyblade, dt);

      // Ring-out check
      if (this.state.arena.shape === "circle") {
        const wallRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
        const ringOutRadius = wallRadius * 0.90;
        const isOut = this.physics.isOutOfBounds(
          beyblade.id,
          ringOutRadius,
          (this.state.arena.width * 16) / 2,
          (this.state.arena.height * 16) / 2
        );
        if (isOut && !beyblade.isRingOut) {
          beyblade.isRingOut = true;
          beyblade.isActive = false;
          this.broadcast("ring-out", { playerId: beyblade.id, username: beyblade.username });
        }
      }
    });

    this.state.timer -= dt;
    this.checkWinCondition();
  }

  // ─── Reactive combo tick (Phase W) ──────────────────────────────────────────

  protected tickReactiveCombos(nowMs: number): void {
    if (this.state.status !== "in-progress") return;

    // Compute arena ring-out zone once
    const wallRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
    const ringOutZoneInner = wallRadius * 0.90;
    const ringOutWarningRadius = wallRadius * 0.82; // warn zone: 82–90% of wall radius

    // Check if any opponent has special move active
    let anyOpponentSpecialActive = false;
    this.state.beyblades.forEach(b => {
      if (b.isActive && b.specialMoveActive) anyOpponentSpecialActive = true;
    });

    this.state.beyblades.forEach((beyblade) => {
      if (!beyblade.isActive) return;
      const sid = beyblade.id;

      const matchState = this.comboMatchStates.get(sid);
      const triggerState = this.triggerStates.get(sid);
      if (!matchState || !triggerState) return;

      // Resolve combo slots from beyblade — currently comboIds are legacy string IDs;
      // new slot system uses comboSlots (ArraySchema<string> of JSON-stringified slots).
      // For now, only trigger combos that have been added via the new slot mechanism.
      const rawSlots = Array.from(beyblade.comboSlots ?? []);
      if (rawSlots.length === 0) return;

      const slots = rawSlots.map(s => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean);
      if (slots.length === 0) return;

      // Compute how close this bey is to the ring-out zone
      const centerX = (this.state.arena.width * 16) / 2;
      const centerY = (this.state.arena.height * 16) / 2;
      const distFromCenter = Math.sqrt(
        Math.pow(beyblade.x - centerX, 2) + Math.pow(beyblade.y - centerY, 2)
      );
      const nearRingOut = distFromCenter >= ringOutWarningRadius;

      const spinRatio = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;

      const ctx: TriggerContext = {
        wasHitThisTick: false, // will be set by collision loop if needed
        nearRingOut,
        spinRatio,
        partnerNearRingOut: false, // team battles only — no-op in base room
        opponentSpecialMoveActive: anyOpponentSpecialActive,
        burstAttemptThisTick: false, // set externally in burst loop
        power: beyblade.power,
        spinDirection: beyblade.spinDirection,
      };

      const triggered = detectTriggerCombos(slots, matchState, ctx, triggerState, nowMs);

      for (const result of triggered) {
        recordComboFired(matchState, result.effectId);
        // Apply legacy combo effects for backward compat (multiplier boost placeholder)
        beyblade.comboDamageMultiplier = 1.3;
        beyblade.comboDamageMultiplierTimer = 1.0;
        this.broadcast("combo", {
          playerId: sid,
          comboId: result.effectId,
          comboName: result.slot.effectId,
          costPaid: 0,
          effect: "trigger",
          x: beyblade.x,
          y: beyblade.y,
        });
      }

      // Charge release detection: if chargeState exists but chargeHeld is no longer set,
      // fire the charged combo with computed scale.
      if (matchState.chargeState) {
        const cs = matchState.chargeState;
        // chargeHeld is stored on beyblade via controlLockedUntilMs when charging;
        // we detect release when comboChargeScale stops advancing (next tick will be 0).
        // Since we can't peek at input bits here, rely on comboChargeScale being 0
        // when the charge was cleared from outside (handleInput clears it on key release).
        // The release itself is detected in handleInput — see charge release block below.
      }
    });
  }

  // ─── Win condition + series logic — delegates to shared/rooms/SeriesManager ─

  private checkWinCondition() {
    const decision = determineGameWinner(this.state);
    if (!decision) return;

    const { winner, winnerId, reason } = decision;

    recordGameWin(this.state, winnerId);
    const seriesOver = isSeriesOver(this.state);
    const seriesScore = buildSeriesScore(this.state);

    if (seriesOver) {
      this.state.status = "series-finished";
      this.state.winner = winnerId;

      this.broadcast("series-end", {
        winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
        seriesScore,
        reason,
      });

      this.persistMatch(winner, true).catch(console.error);
      setTimeout(() => this.disconnect(), 5000);
    } else {
      this.state.status = "finished";
      this.state.winner = winnerId;

      this.broadcast("game-end", {
        winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
        gameNumber: this.state.currentGame,
        seriesScore,
        reason,
      });

      setTimeout(() => this.resetForNextGame(), 3000);
    }
  }

  private resetForNextGame() {
    if (this.playerSessions.size === 0) return;

    // Reset per-game combo state (QTE gate + charge state)
    this.state.beyblades.forEach((_, sid) => {
      const ms = this.comboMatchStates.get(sid);
      if (ms) resetBeyComboMatchState(ms);
      const ts = this.triggerStates.get(sid);
      if (ts) {
        ts.prevNearRingOut = false;
        ts.prevLowSpin = false;
        ts.prevOpponentSpecialMove = false;
      }
    });

    resetStateForNextGame(this.state, this.spawnPositions, this.physics, 180);
    this.warmupTimer = 3;

    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimer, gameNumber: this.state.currentGame });
  }

  private async persistMatch(winner: Beyblade | null, seriesEnd = false) {
    try {
      const beyblades = Array.from(this.state.beyblades.values());
      const seriesScore = buildSeriesScore(this.state);

      const matchData = {
        mode: this.state.mode,
        arenaId: this.state.arena.id,
        winner: winner?.userId ?? null,
        winnerUsername: winner?.username ?? null,
        duration: 180 - this.state.timer,
        seriesFormat: this.state.targetWins === 1 ? "BO1" : this.state.targetWins === 2 ? "BO3" : "BO5",
        seriesScore,
        players: beyblades.map(b => ({
          userId: b.userId,
          username: b.username,
          beybladeId: b.beybladeId,
          damageDealt: b.damageDealt,
          damageReceived: b.damageReceived,
          collisions: b.collisions,
          spinRemaining: b.spin,
          isWinner: b.userId === winner?.userId,
          eliminationType: b.isRingOut ? "ring-out" : b.spin <= 0 ? "spin-out" : "survived",
        })),
      };

      await saveMatch(matchData);

      if (seriesEnd) {
        for (const b of beyblades) {
          await updatePlayerStats(b.userId, {
            matchesPlayed: 1,
            wins: b.userId === winner?.userId ? 1 : 0,
            totalDamageDealt: b.damageDealt,
            totalCollisions: b.collisions,
          });
        }
      }
    } catch (err) {
      console.error("Failed to persist match result:", err);
    }
  }

  // ─── 2.5D extension hooks — overridden by Parts25DBattleRoom ─────────────────
  // Default implementations are no-ops; the classic 2D path stays untouched.

  protected onTickedBey(_beyblade: Beyblade, _dt: number): void {
    // override in 2.5D subclass to call partSystemManager.tickBey()
  }

  protected onBeyCollided(_id1: string, _id2: string, _impactForce: number): void {
    // override in 2.5D subclass to call partSystemManager.onBeyCollision()
  }

  // ─── 2.5D arena system slope physics ────────────────────────────────────────

  private applyArenaSystemSlope(beyblade: Beyblade): void {
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
}

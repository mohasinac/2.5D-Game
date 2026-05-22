import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats, loadComboEffects, type ComboEffectDoc } from "../utils/firebase";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import {
  ComboTracker, detectCombo, createComboTracker,
  BeyComboMatchState, createBeyComboMatchState, resetBeyComboMatchState,
  TriggerState, createTriggerState, detectTriggerCombos, recordComboFired,
  TriggerContext, isQTEGateMet,
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
import { getDualTypeAttackMultiplier, getDualTypeDefenseMultiplier, type ElementType } from "../../client/src/types/elementTypes";
import type { ArenaTimelineEvent } from "../types/shared";
import type { ArenaLink, BeyLink, BeyLinkEffect } from "../../client/src/types/arenaConfigNew";

const QTE_KEY_POOL = ["left", "right", "up", "down", "attack", "defense", "dodge"];

// ─── Arena link helper ────────────────────────────────────────────────────────

function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1, dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function generateQTESequence(rand: () => number, powerCost: number): string[] {
  const n = Math.max(1, Math.floor(powerCost / 25));
  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    result.push(QTE_KEY_POOL[Math.floor(rand() * QTE_KEY_POOL.length)]);
  }
  return result;
}

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
  /** Combo effect definitions keyed by effectId (Phase U — loaded once in onCreate). */
  protected comboEffectsCache = new Map<string, ComboEffectDoc>();
  /** Arena-wide effect expiry timestamps keyed by effectId (Phase AA). */
  protected arenaEffectExpiries = new Map<string, number>();
  /** Arena timeline state (Phase T) — sorted events + elapsed time tracking. */
  private matchElapsedMs = 0;
  private timelineIndex = 0;
  private timelineEvents: ArenaTimelineEvent[] = [];

  // ── Jump physics local state (B3 / G1-G3) — not in Colyseus schema ──────────
  /** Per-bey jump state for standard jump (B3). */
  private beyJumpState = new Map<string, {
    isJumping: boolean;
    jumpZ: number;
    jumpVelocity: number;
  }>();
  /** Per-bey high-jump / meteor-strike state (G2-G3). */
  private beyHighJumpState = new Map<string, {
    isHighJumping: boolean;
    hangTicksRemaining: number;
    isMeteorStrike: boolean;
    landingRadius: number;
    landingDamage: number;
  }>();

  // ── Arena bey spawns (I4) ────────────────────────────────────────────────────
  private spawnTimer: number = 0;
  private spawnedBeyIds: Set<string> = new Set();

  // ── Per-tick trigger context sets (Phase W) ─────────────────────────────────
  // Cleared at the start of each collision pass; read by tickReactiveCombos.
  protected beyHitsThisTick: Set<string> = new Set();     // beyIds hit this tick (on_hit_received)
  protected burstAttemptsThisTick: Set<string> = new Set(); // beyIds that faced a burst roll this tick

  // ── Arena link crossing cooldowns (L2/L3) ────────────────────────────────────
  // beyId → linkId → cooldownTicksRemaining
  private linkCooldowns: Map<string, Map<string, number>> = new Map();

  // ── Bey-to-bey stack state (BeyLink system) ──────────────────────────────────
  private beyStackState: Map<string, { partnerId: string; linkId: string; tickCount: number }> = new Map();
  private beyStackCooldowns: Map<string, Map<string, number>> = new Map();
  /** Per-victim pending QTE to escape a hostile BeyLink stack. */
  private pendingBeyLinkQTE: Map<string, { stackKey: string; linkId: string; key: string; expiresAt: number }> = new Map();

  /** Arena shrink state (Phase V). */
  private shrinkStartMs = 0;
  private shrinkEndMs = 0;
  private shrinkMinFraction = 1;
  private shrinkEnabled = false;

  /** Pending QTE state — set when an opponent fires a special move and QTE is eligible. */
  private pendingQTE: {
    attackerSessionId: string;
    sequence: string[];
    expiresAt: number;
    powerCost: number;
    respondersProgress: Map<string, number>;
  } | null = null;

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
      // Phase T: initialize arena timeline
      if (arenaData.arenaTimeline && arenaData.arenaTimeline.length > 0) {
        this.timelineEvents = [...arenaData.arenaTimeline].sort((a, b) => a.triggerMs - b.triggerMs);
      }
      // Phase V: initialize shrink config
      if (arenaData.shrink) {
        this.shrinkEnabled = true;
        this.shrinkStartMs = arenaData.shrink.startMs;
        this.shrinkEndMs = arenaData.shrink.endMs;
        this.shrinkMinFraction = arenaData.shrink.minRadiusFraction;
      }
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

    // Phase U — load combo effect definitions for BehaviorRef execution
    const effectDocs = await loadComboEffects();
    for (const doc of effectDocs) this.comboEffectsCache.set(doc.id, doc);

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

    // K10: possession-request — player swaps control to a nearby arena-spawned friendly bey
    this.onMessage("possession-request", (client, data: { direction: "left" | "right" | "up" | "down" }) => {
      this.handleSpatialPossession(data.direction, client.sessionId);
    });

    this.onMessage("qte-input", (client, message: { key: string }) => {
      // First: check if this input also satisfies a pending bey-link QTE escape
      const beyLinkQTE = this.pendingBeyLinkQTE.get(client.sessionId);
      if (beyLinkQTE && Date.now() <= beyLinkQTE.expiresAt && message.key === beyLinkQTE.key) {
        this._resolveBeyLinkQTE(client.sessionId, beyLinkQTE);
      }

      if (!this.pendingQTE) return;
      if (client.sessionId === this.pendingQTE.attackerSessionId) return;
      if (this.spectatorSessions.has(client.sessionId)) return;
      if (Date.now() > this.pendingQTE.expiresAt) return;

      const progress = this.pendingQTE.respondersProgress.get(client.sessionId) ?? 0;
      const expected = this.pendingQTE.sequence[progress];
      if (message.key === expected) {
        const next = progress + 1;
        if (next >= this.pendingQTE.sequence.length) {
          // Sequence complete — cancel the special move
          const attacker = this.state.beyblades.get(this.pendingQTE.attackerSessionId);
          if (attacker) {
            this.cancelSpecialMoveViaQTE(attacker, this.pendingQTE.powerCost);
          } else {
            this.pendingQTE = null;
          }
        } else {
          this.pendingQTE.respondersProgress.set(client.sessionId, next);
        }
      } else {
        // Wrong key — reset this responder's progress
        this.pendingQTE.respondersProgress.set(client.sessionId, 0);
      }
    });

    // Bey-link QTE escape (single-key break-free from hostile stacks)
    this.onMessage("bey-link-qte-input", (client, message: { key: string }) => {
      const pending = this.pendingBeyLinkQTE.get(client.sessionId);
      if (!pending || Date.now() > pending.expiresAt) return;
      if (message.key === pending.key) {
        this._resolveBeyLinkQTE(client.sessionId, pending);
      }
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
    this.beyJumpState.delete(client.sessionId);
    this.beyHighJumpState.delete(client.sessionId);
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (beyblade) {
      beyblade.isActive = false;
      beyblade.isRingOut = true;
      beyblade.eliminationType = "ring_out";
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

    // Element types (Phase AB) — max 2, stored as ArraySchema<string>
    beyblade.elementTypes.clear();
    const elemTypes: string[] = (data as any).elementTypes ?? [];
    for (const et of elemTypes.slice(0, 2)) beyblade.elementTypes.push(et);
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

  protected handleInput(client: Client, message: PlayerInput) {
    if (this.spectatorSessions.has(client.sessionId)) return;

    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    if (this.state.status !== "in-progress") return;
    this.lastInputTime = Date.now();

    const forceMagnitude = computeForceMagnitude(beyblade);

    // B3: jump physics — initiate jump on input
    if (message.jump && beyblade.jumpForce > 0) {
      let js = this.beyJumpState.get(client.sessionId);
      if (!js) {
        js = { isJumping: false, jumpZ: 0, jumpVelocity: 0 };
        this.beyJumpState.set(client.sessionId, js);
      }
      if (!js.isJumping) {
        js.isJumping = true;
        js.jumpVelocity = beyblade.jumpForce;
        js.jumpZ = 0;
      }
    }

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
        // Track for QTE gate (requires ≥30% of combo slots fired this match)
        const ms = this.comboMatchStates.get(client.sessionId);
        if (ms) recordComboFired(ms, combo.comboId);
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

    // Mark special move as active (cleared in tick loop after specialMoveEndTime)
    beyblade.specialMoveActive = true;
    beyblade.specialMoveEndTime = Date.now() + 500;

    // N2: broadcast special-move-camera + combo-visual when special move activates
    this.broadcast("special-move-camera", {
      beyId: beyblade.id,
      cameraConfig: { followTarget: beyblade.id, zoomIn: true, durationMs: 500 },
    });
    this.broadcast("combo-visual", {
      beyId: beyblade.id,
      introAnimation: beyblade.specialMove || beyblade.type,
      particlePresetId: beyblade.specialMove || beyblade.type,
    });

    // Power cost for this special move (legacy = 50 deducted in InputHandler)
    const LEGACY_SPECIAL_COST = 50;

    // QTE gate: broadcast prompt to all other players if eligible
    const arenaQTEEnabled = (this.arenaCache as any)?.qteEnabled !== false;
    const matchState = this.comboMatchStates.get(beyblade.id);
    const totalSlots = Array.from(beyblade.comboSlots ?? []).length;
    const gatemet = matchState ? isQTEGateMet(matchState, totalSlots) : false;

    if (arenaQTEEnabled && gatemet && !this.pendingQTE) {
      const sequence = generateQTESequence(this.rand, LEGACY_SPECIAL_COST);
      const windowTicks = Math.max(20, 60 - Math.floor(LEGACY_SPECIAL_COST / 4));
      const expiresAt = Date.now() + Math.round(windowTicks * (1000 / 60));
      this.pendingQTE = {
        attackerSessionId: beyblade.id,
        sequence,
        expiresAt,
        powerCost: LEGACY_SPECIAL_COST,
        respondersProgress: new Map(),
      };
      // Broadcast to all non-attacker, non-spectator clients
      this.clients.forEach(c => {
        if (c.sessionId !== beyblade.id && !this.spectatorSessions.has(c.sessionId)) {
          c.send("qte-prompt", {
            attackerBeyId: beyblade.id,
            sequence,
            windowTicks,
            powerCost: LEGACY_SPECIAL_COST,
          });
        }
      });
    }

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

  private cancelSpecialMoveViaQTE(beyblade: Beyblade, powerCost: number) {
    beyblade.specialMoveActive = false;
    beyblade.specialMoveEndTime = 0;
    beyblade.controlLockedUntilMs = 0;
    const refund = Math.floor(powerCost * 0.8);
    beyblade.power = Math.min(100, beyblade.power + refund);
    this.broadcast("qte-success", {
      attackerBeyId: beyblade.id,
      refundAmount: refund,
    });
    this.pendingQTE = null;
  }

  // ─── Bey-link QTE resolution ─────────────────────────────────────────────────

  private _resolveBeyLinkQTE(
    victimId: string,
    qte: { stackKey: string; linkId: string; key: string; expiresAt: number }
  ) {
    this.beyStackState.delete(qte.stackKey);
    this.pendingBeyLinkQTE.delete(victimId);
    // Attacker (sidA) is first segment of stackKey "sidA:sidB:linkId"
    const sidA = qte.stackKey.split(":")[0];
    const cmap = this.beyStackCooldowns.get(sidA) ?? new Map<string, number>();
    cmap.set(qte.linkId, 180);
    this.beyStackCooldowns.set(sidA, cmap);
    this.broadcast("bey-link-qte-success", {
      victimId,
      attackerId: sidA,
      stackKey: qte.stackKey,
    });
    // Notify victim's client specifically so they can clear the HUD
    const victimClient = this.clients.find(c => c.sessionId === victimId);
    victimClient?.send("bey-link-qte-cleared", { stackKey: qte.stackKey });
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

    // Phase T: arena timeline events
    this.matchElapsedMs += deltaTime;
    this.tickArenaTimeline();

    // Phase V: arena shrink
    if (this.shrinkEnabled) this.tickArenaShrink();

    // Phase AA: expire arena-wide effects
    this.tickArenaEffects(Date.now());

    // B3 / G1-G3: jump physics
    this.tickJumpStates(deltaTime);

    // I4: arena bey spawns
    this.tickArenaSpawns(deltaTime);

    // L2/L3: arena link crossing detection
    this.tickArenaLinks(deltaTime);
    this.tickBeyLinks(deltaTime);

    this.physics.update(deltaTime);

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    const arenaData = this.arenaCache;
    const beybladeIds = Array.from(this.state.beyblades.keys());

    // ── Beyblade-vs-beyblade collision detection ────────────────────────────
    // Reset per-tick trigger context sets before processing collisions/bursts
    this.beyHitsThisTick.clear();
    this.burstAttemptsThisTick.clear();
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

        // Element type effectiveness (Phase AB)
        const b1Elems = Array.from(b1.elementTypes ?? []) as ElementType[];
        const b2Elems = Array.from(b2.elementTypes ?? []) as ElementType[];
        const typeMultB1vsB2 = b1Elems.length > 0 && b2Elems.length > 0
          ? getDualTypeAttackMultiplier(b1Elems, b2Elems[0]) * getDualTypeDefenseMultiplier(b1Elems[0], b2Elems)
          : 1.0;
        const typeMultB2vsB1 = b2Elems.length > 0 && b1Elems.length > 0
          ? getDualTypeAttackMultiplier(b2Elems, b1Elems[0]) * getDualTypeDefenseMultiplier(b2Elems[0], b1Elems)
          : 1.0;

        const effDmg1 = dmg.damage1 * typeMultB2vsB1;   // damage b1 takes from b2
        const effDmg2 = dmg.damage2 * typeMultB1vsB2;   // damage b2 takes from b1
        const effSS1  = dmg.spinSteal1 * typeMultB1vsB2; // spin b2 loses to b1
        const effSS2  = dmg.spinSteal2 * typeMultB2vsB1; // spin b1 loses to b2

        b1.health = Math.max(0, b1.health - effDmg1);
        b2.health = Math.max(0, b2.health - effDmg2);
        b1.spin = Math.max(0, b1.spin - effSS2);
        b2.spin = Math.max(0, b2.spin - effSS1);
        // Track which beys were hit this tick for on_hit_received reactive triggers
        if (effDmg1 > 0) this.beyHitsThisTick.add(id1);
        if (effDmg2 > 0) this.beyHitsThisTick.add(id2);
        b1.damageDealt += effDmg2;
        b2.damageDealt += effDmg1;
        b1.damageReceived += effDmg1;
        b2.damageReceived += effDmg2;
        b1.collisions++;
        b2.collisions++;

        b1.power = Math.min(100, b1.power + (effDmg2 > 0 ? 0.5 : 0) + (effDmg1 > 0 ? 0.3 : 0));
        b2.power = Math.min(100, b2.power + (effDmg1 > 0 ? 0.5 : 0) + (effDmg2 > 0 ? 0.3 : 0));

        if (effDmg1 > 15) b1.attackBuffTimer = 0;
        if (effDmg2 > 15) b2.attackBuffTimer = 0;

        this.broadcast("collision", {
          p1: id1,
          p2: id2,
          damage1: effDmg1,
          damage2: effDmg2,
          spinSteal1: effSS1,
          spinSteal2: effSS2,
          contactPoint: collision.contactPoint,
          typeEffectB1vsB2: typeMultB1vsB2,
          typeEffectB2vsB1: typeMultB2vsB1,
        });

        // 2.5D hook: PartSystemManager picks this up to fire SubPart switches,
        // bearing friction, hop impulse, detachment, on_hit_* events.
        const impactForce = Math.max(effDmg1, effDmg2);
        this.onBeyCollided(id1, id2, impactForce);

        // ── Burst chance (Phase R) ────────────────────────────────────────────
        // Check both beys: the one that received higher damage may burst.
        const BURST_THRESHOLD = 40;
        for (const [victim, incomingDmg] of [[b1, effDmg1], [b2, effDmg2]] as [Beyblade, number][]) {
          if (!victim.isActive) continue;
          if (incomingDmg < BURST_THRESHOLD) continue;
          // Track burst attempt BEFORE the roll so on_burst_attempt can react this same tick
          this.burstAttemptsThisTick.add(victim.id);
          const spinRatioV = victim.maxSpin > 0 ? victim.spin / victim.maxSpin : 0;
          const burstRaw = Math.max(0, incomingDmg - BURST_THRESHOLD) * 0.005;
          const burstSpinMod = 1 + (1 - spinRatioV) * 2.0;
          const burstResist = Math.max(0, Math.min(100, victim.burstResistance ?? 50));
          const burstFinal = burstRaw * burstSpinMod * (1 - burstResist / 100);
          if (this.rand() < burstFinal) {
            victim.isActive = false;
            victim.isBurst = true;
            victim.eliminationType = "burst";
            victim.spin = 0;
            const attacker = victim === b1 ? b2 : b1;
            attacker.burstKillsDealt++;
            this.broadcast("burst", { beyId: victim.id, attackerId: attacker.id, x: victim.x, y: victim.y });
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
        beyblade.eliminationType = "spin_out";
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
          beyblade.eliminationType = "ring_out";
          this.broadcast("ring-out", { playerId: beyblade.id, username: beyblade.username });
        }
      }
    });

    this.state.timer -= dt;
    this.checkWinCondition();

    // QTE expiry check
    if (this.pendingQTE && Date.now() > this.pendingQTE.expiresAt) {
      this.broadcast("qte-expired", { attackerBeyId: this.pendingQTE.attackerSessionId });
      this.pendingQTE = null;
    }

    // Bey-link QTE expiry check
    const nowMs2 = Date.now();
    for (const [victimId, qte] of this.pendingBeyLinkQTE) {
      if (nowMs2 > qte.expiresAt) {
        this.pendingBeyLinkQTE.delete(victimId);
        this.broadcast("bey-link-qte-expired", { victimId, stackKey: qte.stackKey });
      }
    }

    // N6: combination lock tick (overridden by 2.5D subclass)
    this.onTickCombinationLock(deltaTime);
  }

  // ─── BehaviorRef executor (Phase U / AA) ────────────────────────────────────

  /**
   * Execute a single compiled BehaviorRef step for the given beyblade session.
   * Handles movement, factor boosts, and arena-wide effects.
   */
  protected executeBehaviorRef(
    sessionId: string,
    behaviorId: string,
    params: Record<string, unknown> = {}
  ): void {
    const beyblade = this.state.beyblades.get(sessionId);
    if (!beyblade || !beyblade.isActive) return;

    // ── movement.swap_position ──────────────────────────────────────────────
    if (behaviorId === "movement.swap_position") {
      const targetId = params.targetId as string | undefined;
      // Find the target: explicit id or nearest opponent
      let targetSid: string | undefined = targetId;
      if (!targetSid) {
        let minDist = Infinity;
        this.state.beyblades.forEach((other, sid) => {
          if (sid === sessionId || !other.isActive) return;
          const d = Math.hypot(other.x - beyblade.x, other.y - beyblade.y);
          if (d < minDist) { minDist = d; targetSid = sid; }
        });
      }
      if (targetSid) {
        const target = this.state.beyblades.get(targetSid);
        if (target && target.isActive) {
          const ax = beyblade.x, ay = beyblade.y;
          const avx = beyblade.velocityX, avy = beyblade.velocityY;
          beyblade.x = target.x; beyblade.y = target.y;
          beyblade.velocityX = target.velocityX; beyblade.velocityY = target.velocityY;
          target.x = ax; target.y = ay;
          target.velocityX = avx; target.velocityY = avy;
          this.physics.setPosition(sessionId, beyblade.x, beyblade.y);
          this.physics.setPosition(targetSid, target.x, target.y);
          this.broadcast("position-swap", { a: sessionId, b: targetSid });
        }
      }
      return;
    }

    // ── factor.boost ────────────────────────────────────────────────────────
    if (behaviorId === "factor.boost") {
      const stat = (params.stat as string) ?? "damageMultiplier";
      const mult = (params.multiplier as number) ?? 1.3;
      const ticks = (params.durationTicks as number) ?? 60;
      if (stat === "damageMultiplier") {
        beyblade.comboDamageMultiplier = mult;
        beyblade.comboDamageMultiplierTimer = ticks / 60;
      } else if (stat === "speed") {
        const vMag = Math.hypot(beyblade.velocityX, beyblade.velocityY);
        if (vMag > 0) {
          beyblade.velocityX *= mult;
          beyblade.velocityY *= mult;
        }
      } else if (stat === "spin") {
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin * mult);
      }
      return;
    }

    // ── arena.effect.* ──────────────────────────────────────────────────────
    if (behaviorId.startsWith("arena.effect.")) {
      const effectKey = behaviorId.slice("arena.effect.".length);
      const durationMs = (params.durationMs as number) ?? 5000;
      this.arenaEffectExpiries.set(effectKey, Date.now() + durationMs);
      this.broadcast("arena-effect-start", { effectKey, durationMs, source: sessionId, params });
      return;
    }

    // ── movement.dash ───────────────────────────────────────────────────────
    if (behaviorId === "movement.dash") {
      const force = (params.force as number) ?? 8;
      const angle = (params.angle as number) ?? (Math.atan2(beyblade.velocityY, beyblade.velocityX));
      beyblade.velocityX += Math.cos(angle) * force;
      beyblade.velocityY += Math.sin(angle) * force;
      return;
    }

    // ── spin.drain_target ───────────────────────────────────────────────────
    if (behaviorId === "spin.drain_target") {
      const drainFraction = (params.fraction as number) ?? 0.1;
      let targetSid: string | undefined;
      let minDist = Infinity;
      this.state.beyblades.forEach((other, sid) => {
        if (sid === sessionId || !other.isActive) return;
        const d = Math.hypot(other.x - beyblade.x, other.y - beyblade.y);
        if (d < minDist) { minDist = d; targetSid = sid; }
      });
      if (targetSid) {
        const target = this.state.beyblades.get(targetSid)!;
        const drain = target.spin * drainFraction;
        target.spin = Math.max(0, target.spin - drain);
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + drain * 0.5);
      }
      return;
    }

    // ── movement.jump (G1) ──────────────────────────────────────────────────
    if (behaviorId === "movement.jump") {
      const jumpForce = (params.jumpForce as number) ?? (beyblade.jumpForce || 5);
      const landingDamage = (params.landingDamage as number) ?? 10;
      const landingRadius = (params.landingRadius as number) ?? 3;
      let js = this.beyJumpState.get(sessionId);
      if (!js) {
        js = { isJumping: false, jumpZ: 0, jumpVelocity: 0 };
        this.beyJumpState.set(sessionId, js);
      }
      if (!js.isJumping) {
        js.isJumping = true;
        js.jumpVelocity = jumpForce;
        js.jumpZ = 0;
        // Store landing params for when the jump lands
        (js as any).landingDamage = landingDamage;
        (js as any).landingRadius = landingRadius;
      }
      return;
    }

    // ── movement.high_jump (G2) ─────────────────────────────────────────────
    if (behaviorId === "movement.high_jump") {
      const hangTicks = (params.hangTicks as number) ?? 120;
      let hjs = this.beyHighJumpState.get(sessionId);
      if (!hjs || !hjs.isHighJumping) {
        hjs = {
          isHighJumping: true,
          hangTicksRemaining: hangTicks,
          isMeteorStrike: false,
          landingRadius: 0,
          landingDamage: 0,
        };
        this.beyHighJumpState.set(sessionId, hjs);
        // Make bey non-colliding while airborne
        this.physics.setBodySensor(sessionId, true);
        this.broadcast("movement-jump-hang", { beyId: sessionId, hangTicks });
      }
      return;
    }

    // ── movement.meteor_strike (G3) ─────────────────────────────────────────
    if (behaviorId === "movement.meteor_strike") {
      const hangTicks = (params.hangTicks as number) ?? 120;
      const landingRadius = (params.landingRadius as number) ?? 5;
      const landingDamage = (params.landingDamage as number) ?? 30;
      let hjs = this.beyHighJumpState.get(sessionId);
      if (!hjs || !hjs.isHighJumping) {
        hjs = {
          isHighJumping: true,
          hangTicksRemaining: hangTicks,
          isMeteorStrike: true,
          landingRadius,
          landingDamage,
        };
        this.beyHighJumpState.set(sessionId, hjs);
        this.physics.setBodySensor(sessionId, true);
        this.broadcast("meteor-strike-hang", {
          beyId: sessionId,
          landingX: beyblade.x,
          landingY: beyblade.y,
          landingRadius: landingRadius * 24, // convert cm to px
          hangTicks,
        });
      }
      return;
    }
  }

  // ─── Jump state tick (B3 / G1-G3) ───────────────────────────────────────────

  private tickJumpStates(deltaTime: number): void {
    // Standard jump physics (B3)
    this.beyJumpState.forEach((js, sessionId) => {
      if (!js.isJumping) return;
      const bey = this.state.beyblades.get(sessionId);
      js.jumpZ += js.jumpVelocity;
      js.jumpVelocity -= 9.8 * (deltaTime / 1000);
      if (js.jumpZ <= 0) {
        // Landing
        const landingDamage: number = (js as any).landingDamage ?? 0;
        const landingRadius: number = (js as any).landingRadius ?? 0;
        js.jumpZ = 0;
        js.isJumping = false;
        js.jumpVelocity = 0;
        // Apply landing damage to nearby beys (G1)
        if (bey && landingDamage > 0 && landingRadius > 0) {
          const landingRadiusPx = landingRadius * 24;
          this.state.beyblades.forEach((other, sid) => {
            if (sid === sessionId || !other.isActive) return;
            const dist = Math.hypot(other.x - bey.x, other.y - bey.y);
            if (dist <= landingRadiusPx) {
              const falloff = 1 - dist / landingRadiusPx;
              other.health = Math.max(0, other.health - landingDamage * falloff);
            }
          });
        }
      } else if (bey) {
        js.jumpZ = Math.min(js.jumpZ, bey.jumpHeight);
      }
    });

    // High-jump / meteor-strike countdown (G2-G3)
    this.beyHighJumpState.forEach((hjs, sessionId) => {
      if (!hjs.isHighJumping) return;
      hjs.hangTicksRemaining--;
      if (hjs.hangTicksRemaining <= 0) {
        hjs.isHighJumping = false;
        // Restore physics collision
        this.physics.setBodySensor(sessionId, false);
        const bey = this.state.beyblades.get(sessionId);
        if (!bey || !bey.isActive) return;
        if (hjs.isMeteorStrike) {
          // Apply AoE damage on landing (G3)
          const landingRadiusPx = hjs.landingRadius * 24;
          let totalDamage = 0;
          this.state.beyblades.forEach((other, sid) => {
            if (sid === sessionId || !other.isActive) return;
            const dist = Math.hypot(other.x - bey.x, other.y - bey.y);
            if (dist <= landingRadiusPx) {
              const falloff = 1 - dist / landingRadiusPx;
              const dmg = hjs.landingDamage * falloff;
              other.health = Math.max(0, other.health - dmg);
              totalDamage += dmg;
            }
          });
          this.broadcast("meteor-strike-land", {
            beyId: sessionId,
            landingX: bey.x,
            landingY: bey.y,
            landingRadius: landingRadiusPx,
            damageDealt: totalDamage,
          });
        }
      }
    });
  }

  // ─── Arena bey spawns (I4) ───────────────────────────────────────────────────

  private tickArenaSpawns(dt: number): void {
    const spawnCfg = (this.arenaCache as any)?.beySpawn;
    if (!spawnCfg?.enabled) return;

    this.spawnTimer += dt;
    const intervalMs = spawnCfg.spawnIntervalSec * 1000;
    if (this.spawnTimer < intervalMs) return;
    this.spawnTimer = 0;

    const currentSpawned = this.spawnedBeyIds.size;
    if (currentSpawned >= spawnCfg.maxSpawnedBeys) return;

    // Pick random pool entry
    const pool: any[] = spawnCfg.beyPool;
    if (!pool || pool.length === 0) return;
    const entry = pool[Math.floor(Math.random() * pool.length)];

    const spawnId = `spawned_${Date.now()}`;
    this.spawnedBeyIds.add(spawnId);

    this.broadcast("arena-spawn", {
      spawnId,
      beyId: entry.beyId,
      controlMode: entry.controlMode,
      statsMultiplier: entry.statsMultiplier ?? 1.0,
      position: { x: 0, y: 0 }, // center as default
    });
  }

  // ─── Arena link crossing detection (L2/L3) ──────────────────────────────────

  tickArenaLinks(dt: number): void {
    const links = (this.arenaCache as any)?.links as ArenaLink[] | undefined;
    if (!links?.length) return;

    for (const [sessionId, bey] of this.state.beyblades) {
      if (!bey.isActive) continue;

      for (const link of links) {
        // Check cooldown
        const beyLinkCooldowns = this.linkCooldowns.get(sessionId) ?? new Map<string, number>();
        const cooldownLeft = beyLinkCooldowns.get(link.id) ?? 0;
        if (cooldownLeft > 0) {
          beyLinkCooldowns.set(link.id, cooldownLeft - 1);
          this.linkCooldowns.set(sessionId, beyLinkCooldowns);
          continue;
        }

        // L3: Check reverseCondition before allowing crossing
        if (link.reverseCondition === "never") continue; // one-way, can't enter from this side
        if (link.reverseCondition === "spin_above_50" && bey.spin < bey.maxSpin * 0.5) continue;

        // L2: Detect crossing by checking if bey position is near the boundary line
        const bx = bey.x;  // in pixels
        const by = bey.y;

        // Convert cm boundary to pixels (1cm = 24px, relative to arena center)
        const cx = (this.state.arena.width * 16) / 2;
        const cy = (this.state.arena.height * 16) / 2;
        const x1 = cx + link.boundaryLine.x1 * 24;
        const y1 = cy + link.boundaryLine.y1 * 24;
        const x2 = cx + link.boundaryLine.x2 * 24;
        const y2 = cy + link.boundaryLine.y2 * 24;

        // Distance from bey to boundary line segment
        const dist = pointToSegmentDistance(bx, by, x1, y1, x2, y2);
        const beyRadius = (bey.radius ?? 4) * 24; // cm to px

        if (dist > beyRadius + 10) continue; // not near boundary

        // Bey is crossing the link — teleport to destination arena
        // (For now, just apply momentum/damage effects since multi-arena rooms aren't implemented)

        // Apply hazard damage if any
        if (link.hazardDamage && link.hazardDamage > 0) {
          bey.spin = Math.max(0, bey.spin - link.hazardDamage);
        }

        // Apply momentum adjustment based on levelDelta
        if (!link.momentumPreserved) {
          const bodyState = this.physics.getBodyState(sessionId);
          if (bodyState) {
            // Reduce velocity to 20% if momentum not preserved
            this.physics.setLinearVelocity(sessionId, bodyState.velocityX * 0.2, bodyState.velocityY * 0.2);
          }
        }

        // Pit: heavy spin loss + momentum halt (simulates falling)
        if (link.linkType === "pit") {
          const fallDamage = link.hazardDamage ?? 50;
          bey.spin = Math.max(0, bey.spin - fallDamage);
          this.physics.setLinearVelocity(sessionId, 0, 0);
        }

        // Trampoline: launch boost + spin preservation
        if (link.linkType === "trampoline") {
          const bodyState = this.physics.getBodyState(sessionId);
          if (bodyState) {
            const exitMult = (link as any).exitVelocityMult ?? 2.5;
            this.physics.setLinearVelocity(
              sessionId,
              bodyState.velocityX * exitMult,
              bodyState.velocityY * exitMult
            );
          }
        }

        // Broadcast link crossing event to clients
        this.broadcast("arena-link-cross", {
          beyId: sessionId,
          linkId: link.id,
          toArenaId: link.toArenaId,
          momentumPreserved: link.momentumPreserved,
          levelDelta: link.levelDelta,
        });

        // Set cooldown
        const newCooldowns = this.linkCooldowns.get(sessionId) ?? new Map<string, number>();
        newCooldowns.set(link.id, link.cooldownTicks ?? 60);
        this.linkCooldowns.set(sessionId, newCooldowns);
      }
    }
  }

  tickBeyLinks(dt: number): void {
    const beyLinks = (this.arenaCache as any)?.beyLinks as BeyLink[] | undefined;
    if (!beyLinks?.length) return;

    const beyEntries = Array.from(this.state.beyblades.entries()).filter(([, b]) => b.isActive);

    for (const link of beyLinks) {
      const maxSimul = link.maxSimultaneous ?? 2;
      let activeCount = 0;

      for (let i = 0; i < beyEntries.length; i++) {
        for (let j = i + 1; j < beyEntries.length; j++) {
          const [sidA, beyA] = beyEntries[i];
          const [sidB, beyB] = beyEntries[j];

          if (link.triggerCondition === "same_team" && (beyA as any).teamId !== (beyB as any).teamId) continue;
          if (link.triggerCondition === "opponent_only" && (beyA as any).teamId === (beyB as any).teamId) continue;

          const distCm = Math.hypot(beyA.x - beyB.x, beyA.y - beyB.y) / 24;
          const stackKey = `${sidA}:${sidB}:${link.id}`;

          if (distCm > link.entryRadiusCm) {
            if (this.beyStackState.has(stackKey)) {
              this.beyStackState.delete(stackKey);
              this.pendingBeyLinkQTE.delete(sidB);
              this.broadcast("bey-stack-end", { beyIdA: sidA, beyIdB: sidB, linkId: link.id });
            }
            continue;
          }

          const cooldownA = this.beyStackCooldowns.get(sidA)?.get(link.id) ?? 0;
          if (cooldownA > 0) continue;

          activeCount++;
          if (activeCount > maxSimul) break;

          const existing = this.beyStackState.get(stackKey);
          const tickCount = (existing?.tickCount ?? 0) + 1;
          this.beyStackState.set(stackKey, { partnerId: sidB, linkId: link.id, tickCount });

          if (!existing) {
            this.broadcast("bey-stack-start", {
              beyIdA: sidA, beyIdB: sidB,
              linkId: link.id, linkType: link.linkType,
              alignment: link.alignment,
            });
            // QTE escape: issue a single-key prompt to the victim (sidB) if no special-move QTE running
            if (link.alignment === "hostile" && link.qteEscapable) {
              if (!this.pendingBeyLinkQTE.has(sidB) && !this.pendingQTE) {
                const escapeKey = QTE_KEY_POOL[Math.floor(this.rand() * QTE_KEY_POOL.length)];
                const windowTicks = link.qteWindowTicks ?? 60;
                const expiresAt = Date.now() + windowTicks * (1000 / 60);
                this.pendingBeyLinkQTE.set(sidB, { stackKey, linkId: link.id, key: escapeKey, expiresAt });
                const victimClient = this.clients.find(c => c.sessionId === sidB);
                victimClient?.send("bey-link-qte", {
                  attackerId: sidA, stackKey, linkId: link.id,
                  key: escapeKey, windowTicks, expiresAt,
                });
              } else if (this.pendingQTE && !this.pendingBeyLinkQTE.has(sidB)) {
                // A special-move QTE is active — piggyback: completing it also breaks this stack.
                // Register a pending entry that uses the same expiry as the special-move QTE.
                const firstKey = this.pendingQTE.sequence[0];
                this.pendingBeyLinkQTE.set(sidB, {
                  stackKey, linkId: link.id,
                  key: firstKey,
                  expiresAt: this.pendingQTE.expiresAt,
                });
              }
            }
          }

          // ── Apply linkEffects (new composable system) ──────────────────────
          const effects: BeyLinkEffect[] = link.linkEffects ?? [];

          for (const effect of effects) {
            const intensity = effect.intensityPerTick ?? 1;
            const interval = effect.intervalTicks ?? (
              effect.type === "drill_attack" ? 15 :
              effect.type === "continuous_collision" ? 10 :
              effect.type === "control_loss" ? 120 : 1
            );

            switch (effect.type) {
              case "spin_drain":
                // sidB is victim; sidA is attacker
                beyB.spin = Math.max(0, beyB.spin - intensity);
                break;

              case "spin_share": {
                // Equalize spin between both beys
                const avg = (beyA.spin + beyB.spin) / 2;
                const rate = intensity;
                beyA.spin += (avg - beyA.spin) * rate;
                beyB.spin += (avg - beyB.spin) * rate;
                break;
              }

              case "spin_heal":
                // Both beys slowly recover spin
                beyA.spin = Math.min(beyA.maxSpin, beyA.spin + intensity);
                beyB.spin = Math.min(beyB.maxSpin, beyB.spin + intensity);
                break;

              case "damage_boost":
              case "shield_boost":
                // Broadcast buff so clients can render the aura
                if (tickCount % 10 === 1) {
                  this.broadcast("bey-stack-boost", {
                    beyIdA: sidA, beyIdB: sidB,
                    effectType: effect.type,
                    intensity,
                  });
                }
                break;

              case "destabilize":
                if (tickCount % interval === 1) {
                  const angle = Math.atan2(beyB.y - beyA.y, beyB.x - beyA.x);
                  this.physics.applyForce(sidB, Math.cos(angle) * intensity * 24, Math.sin(angle) * intensity * 24);
                }
                break;

              case "continuous_collision":
                // Rapid virtual collision impacts — dogfight
                if (tickCount % interval === 1) {
                  const impactMult = effect.impactMult ?? 0.5;
                  const dmg = intensity * impactMult;
                  beyB.spin = Math.max(0, beyB.spin - dmg);
                  const angle = Math.atan2(beyB.y - beyA.y, beyB.x - beyA.x);
                  this.physics.applyForce(sidB, Math.cos(angle) * dmg * 12, Math.sin(angle) * dmg * 12);
                  this.broadcast("bey-stack-collision-tick", {
                    attackerId: sidA, victimId: sidB, damage: dmg,
                  });
                }
                break;

              case "drill_attack":
                // Periodic peck — tip drills into bit chip every N ticks
                // tip_stack: sidA's tip (bottom) is on sidB's bit chip (top), so sidA is the driller
                if (tickCount % interval === 1) {
                  const peckForce = (effect.impactMult ?? 2.0) * intensity * 24;
                  // Push victim radially outward (peck impact from above = radial destabilize in 2D)
                  const peckAngle = Math.atan2(beyB.y - beyA.y, beyB.x - beyA.x);
                  this.physics.applyForce(sidB, Math.cos(peckAngle) * peckForce, Math.sin(peckAngle) * peckForce);
                  // Bit-chip drain: extra spin loss per peck
                  beyB.spin = Math.max(0, beyB.spin - intensity * 3);
                  this.broadcast("bey-stack-drill-peck", {
                    drillerId: sidA, victimId: sidB,
                    tickCount, peckForce,
                  });
                }
                break;

              case "control_loss":
                // Scramble / reverse / freeze victim's input for a burst
                if (tickCount % interval === 1) {
                  const mode = effect.controlMode ?? "reverse";
                  const dur = effect.controlDurationTicks ?? 60;
                  const victimClient = this.clients.find(c => c.sessionId === sidB);
                  victimClient?.send("bey-link-control-loss", {
                    mode, durationTicks: dur, attackerId: sidA, linkId: link.id,
                  });
                }
                break;

              case "force_lock":
                // Pull victim toward attacker — gravity-well style orbit lock
                {
                  const dx = beyA.x - beyB.x;
                  const dy = beyA.y - beyB.y;
                  const dist2 = Math.hypot(dx, dy) || 1;
                  const pullFx = (dx / dist2) * intensity * 24;
                  const pullFy = (dy / dist2) * intensity * 24;
                  this.physics.applyForce(sidB, pullFx, pullFy);
                }
                break;
            }
          }

          // ── Legacy friendlyBoost / hostileEffect (when linkEffects absent) ──
          if (!effects.length) {
            if (link.alignment === "friendly" && link.friendlyBoost) {
              const boost = link.friendlyBoost;
              beyA.spin = Math.min(beyA.maxSpin, beyA.spin + beyB.spin * boost.spinTransferRate * dt);
              beyB.spin = Math.min(beyB.maxSpin, beyB.spin + beyA.spin * boost.spinTransferRate * dt);
              this.broadcast("bey-stack-boost", {
                beyIdA: sidA, beyIdB: sidB,
                damageMultiplierBonus: boost.damageMultiplierBonus,
                shieldBonus: boost.shieldBonus,
              });
            }
            if (link.alignment === "hostile" && link.hostileEffect) {
              const effect = link.hostileEffect;
              const drainTotal = effect.bitChipDamagePerTick + effect.spinDrainPerTick;
              beyB.spin = Math.max(0, beyB.spin - drainTotal * dt * 60);
              if (effect.destabilizeForce > 0) {
                const angle = Math.atan2(beyB.y - beyA.y, beyB.x - beyA.x);
                this.physics.applyForce(sidB, Math.cos(angle) * effect.destabilizeForce * 24, Math.sin(angle) * effect.destabilizeForce * 24);
              }
              if (effect.maxDurationTicks > 0 && tickCount >= effect.maxDurationTicks) {
                this.beyStackState.delete(stackKey);
                const cmap = this.beyStackCooldowns.get(sidB) ?? new Map<string, number>();
                cmap.set(link.id, link.cooldownTicks ?? 120);
                this.beyStackCooldowns.set(sidB, cmap);
                this.broadcast("bey-stack-end", { beyIdA: sidA, beyIdB: sidB, linkId: link.id, reason: "max_duration" });
              }
              this.broadcast("bey-stack-hostile-tick", { attackerId: sidA, victimId: sidB, drainAmount: drainTotal });
            }
          }
        }
        if (activeCount > maxSimul) break;
      }
    }

    // Tick down bey stack cooldowns
    for (const [, cmap] of this.beyStackCooldowns) {
      for (const [lid, ticks] of cmap) {
        if (ticks <= 1) cmap.delete(lid);
        else cmap.set(lid, ticks - 1);
      }
    }
  }

  /** Expire arena-wide effects and broadcast clear events (Phase AA). */
  protected tickArenaEffects(nowMs: number): void {
    this.arenaEffectExpiries.forEach((expiresAt, effectKey) => {
      if (nowMs >= expiresAt) {
        this.arenaEffectExpiries.delete(effectKey);
        this.broadcast("arena-effect-end", { effectKey });
      }
    });
  }

  // ─── Arena Timeline (Phase T) ────────────────────────────────────────────────

  private tickArenaTimeline(): void {
    if (this.timelineEvents.length === 0) return;
    while (
      this.timelineIndex < this.timelineEvents.length &&
      this.matchElapsedMs >= this.timelineEvents[this.timelineIndex].triggerMs
    ) {
      this.executeTimelineEvent(this.timelineEvents[this.timelineIndex]);
      this.timelineIndex++;
    }
  }

  private executeTimelineEvent(event: ArenaTimelineEvent): void {
    switch (event.type) {
      case "activate_feature":
        // Notify clients to activate a feature by id
        this.broadcast("arena-feature-activate", { featureId: event.featureId, params: event.params ?? {} });
        break;
      case "deactivate_feature":
        this.broadcast("arena-feature-deactivate", { featureId: event.featureId });
        break;
      case "spawn_feature":
        this.broadcast("arena-feature-spawn", { params: event.params ?? {} });
        break;
      case "arena_tilt":
        if (event.params?.angle !== undefined) {
          (this.state.arena as any).tiltAngle = event.params.angle;
        }
        if (event.params?.direction !== undefined) {
          (this.state.arena as any).tiltDirection = event.params.direction;
        }
        break;
      case "gravity_change":
        if (event.params?.mult !== undefined) {
          (this.state.arena as any).gravityMult = event.params.mult;
        }
        break;
      case "announcement":
        if (event.announcement) {
          this.broadcast("arena-announcement", event.announcement);
        }
        break;
    }

    // Handle repeat: push a cloned event with decremented count back into the sorted list
    if (event.repeat && event.repeat.count > 0) {
      const next: ArenaTimelineEvent = {
        ...event,
        triggerMs: event.triggerMs + event.repeat.intervalMs,
        repeat: { ...event.repeat, count: event.repeat.count - 1 },
      };
      // Insert maintaining sort order — find correct position from current timelineIndex
      let insertAt = this.timelineIndex;
      while (insertAt < this.timelineEvents.length && this.timelineEvents[insertAt].triggerMs <= next.triggerMs) {
        insertAt++;
      }
      this.timelineEvents.splice(insertAt, 0, next);
    }
  }

  // ─── Arena Shrink (Phase V) ───────────────────────────────────────────────────

  private tickArenaShrink(): void {
    if (this.matchElapsedMs < this.shrinkStartMs) return;
    const arenaBaseRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
    let fraction = 1;
    if (this.matchElapsedMs >= this.shrinkEndMs) {
      fraction = this.shrinkMinFraction;
    } else {
      const progress = (this.matchElapsedMs - this.shrinkStartMs) / (this.shrinkEndMs - this.shrinkStartMs);
      fraction = 1 - (1 - this.shrinkMinFraction) * progress;
    }
    const effectiveRadius = arenaBaseRadius * fraction;
    if (this.state.arena.effectiveRadius !== effectiveRadius) {
      this.state.arena.effectiveRadius = effectiveRadius;
      // Apply damage to beys outside boundary
      const shrinkDamage = this.arenaCache?.shrink?.damageRatePerTick ?? 2;
      this.state.beyblades.forEach(b => {
        if (!b.isActive) return;
        const dist = Math.hypot(b.x, b.y); // arena is centered at 0,0
        if (dist > effectiveRadius) {
          b.health = Math.max(0, b.health - shrinkDamage);
        }
      });
    }
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
        if (!s) return null;
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
        wasHitThisTick: this.beyHitsThisTick.has(sid),
        nearRingOut,
        spinRatio,
        partnerNearRingOut: false, // team battles only — no-op in base room
        opponentSpecialMoveActive: anyOpponentSpecialActive,
        burstAttemptThisTick: this.burstAttemptsThisTick.has(sid),
        power: beyblade.power,
        spinDirection: beyblade.spinDirection,
      };

      const triggered = detectTriggerCombos(slots, matchState, ctx, triggerState, nowMs);

      for (const result of triggered) {
        recordComboFired(matchState, result.effectId);
        const effectDoc = this.comboEffectsCache.get(result.effectId);
        if (effectDoc?.steps && Array.isArray(effectDoc.steps) && effectDoc.steps.length > 0) {
          for (const step of effectDoc.steps as Array<{ behaviorId: string; params?: Record<string, unknown> }>) {
            this.executeBehaviorRef(sid, step.behaviorId, step.params);
          }
        } else {
          // Fallback: generic damage multiplier boost when no steps defined
          beyblade.comboDamageMultiplier = 1.3;
          beyblade.comboDamageMultiplierTimer = 1.0;
        }
        this.broadcast("combo", {
          playerId: sid,
          comboId: result.effectId,
          comboName: result.slot.effectId,
          costPaid: effectDoc?.cost ?? 0,
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

    this.pendingQTE = null;
    // Reset spawn state (I4)
    this.spawnTimer = 0;
    this.spawnedBeyIds.clear();
    // Reset link crossing cooldowns (L2/L3)
    this.linkCooldowns.clear();
    // Reset arena timeline state so each game in a series has its own fresh timeline
    this.matchElapsedMs = 0;
    this.timelineIndex = 0;
    if (this.arenaCache?.arenaTimeline) {
      this.timelineEvents = [...this.arenaCache.arenaTimeline].sort((a, b) => a.triggerMs - b.triggerMs);
    }
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
          eliminationType: b.isRingOut ? "ring-out" : b.isBurst ? "burst" : b.spin <= 0 ? "spin-out" : "survived",
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
            burstKills: b.burstKillsDealt,
          });
        }
      }
    } catch (err) {
      console.error("Failed to persist match result:", err);
    }
  }

  // ─── K9: Spatial possession for arena-spawned friendly beys ─────────────────

  /**
   * Transfer control of the calling session to the nearest arena-spawned friendly
   * bey within a 60° cone in the given direction. Only uncontrolled friendly beys
   * (controlMode === "friendly") are eligible. Effective next tick.
   */
  protected handleSpatialPossession(direction: "left" | "right" | "up" | "down", sessionId: string): void {
    // Find arena-spawned friendly beys not currently controlled by anyone
    const friendlyUncontrolled: { id: string; bey: any }[] = [];
    this.state.beyblades.forEach((bey, id) => {
      if ((bey as any).isSpawned && (bey as any).controlMode === "friendly" && !(bey as any).controlledBy) {
        friendlyUncontrolled.push({ id, bey });
      }
    });

    if (friendlyUncontrolled.length === 0) return;

    const myBey = this.state.beyblades.get(sessionId);
    if (!myBey) return;

    // Direction unit vectors (screen coords: y increases downward)
    const dirVec = {
      right: { x:  1, y:  0 },
      up:    { x:  0, y: -1 },
      left:  { x: -1, y:  0 },
      down:  { x:  0, y:  1 },
    }[direction];

    const CONE_HALF_ANGLE = Math.PI / 3; // 60°
    let best: { id: string; bey: any } | null = null;
    let bestDist = Infinity;

    for (const { id, bey } of friendlyUncontrolled) {
      const dx = bey.x - myBey.x;
      const dy = bey.y - myBey.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) continue;

      // Check 60° cone using dot product
      const nx = dx / dist, ny = dy / dist;
      const dot = nx * dirVec.x + ny * dirVec.y;
      if (dot < Math.cos(CONE_HALF_ANGLE)) continue;

      if (dist < bestDist) {
        bestDist = dist;
        best = { id, bey };
      }
    }

    if (!best) return;

    // Unlink current session from its bey (if it holds one via controlledBy)
    const currentBey = this.state.beyblades.get(sessionId);
    if (currentBey) (currentBey as any).controlledBy = null;

    // Link to the target friendly bey
    (best.bey as any).controlledBy = sessionId;
    this.broadcast("possession-transferred", {
      sessionId,
      fromBeyId: sessionId,
      toBeyId: best.id,
    });
  }

  // ─── 2.5D extension hooks — overridden by Parts25DBattleRoom ─────────────────
  // Default implementations are no-ops; the classic 2D path stays untouched.

  protected onTickedBey(_beyblade: Beyblade, _dt: number): void {
    // override in 2.5D subclass to call partSystemManager.tickBey()
  }

  protected onBeyCollided(_id1: string, _id2: string, _impactForce: number): void {
    // override in 2.5D subclass to call partSystemManager.onBeyCollision()
  }

  /** N6: Combination lock tick — override in 2.5D subclass to call partSystemManager.tickCombinationLock(). */
  protected onTickCombinationLock(_deltaTime: number): void {
    // no-op in base room
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

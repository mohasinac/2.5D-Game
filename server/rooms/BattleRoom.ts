import { Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { BaseRoom } from "./BaseRoom";
import { BeyGhostState } from "./schema/BeyGhostState";
import { AoI } from "../shared/constants/aoi";
import { WARMUP_DURATION_S } from "../shared/constants/gameConstants";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats, loadComboEffects, getFirestoreDb, type ComboEffectDoc } from "../utils/firebase";
import { loadGimmickDefs, initGimmickSynergies, loadBeyAccessories, type BeyAccessoryDef } from "../utils/firestoreLoaders";
import { expandGimmicks } from "../utils/gimmickExpander";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom, setMaxActiveRooms } from "../shared/utils/roomCounter";
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
import { computeTiltForce, getFloorAngleAtRadius } from "../shared/physics/ArenaUtils";
import { resolvePhysicsFlags } from "../utils/physicsFlags";
import { processArenaFeatures, processBoostPads } from "../shared/rooms/ArenaFeatureProcessor";
import { tickTurrets, type TurretProcessorBridge } from "../shared/rooms/TurretDispatch";
import type { TurretRuntimeState } from "../shared/rooms/TurretProcessor";
import { advanceArenaRotation, advanceArenaTilt, applyWeightTilt } from "../shared/rooms/advanceArenaRotation";
import {
  applyMovementInput,
  applyActionInput,
  computeForceMagnitude,
} from "../shared/rooms/InputHandler";
import { computeNaturalForce } from "../shared/physics/NaturalMotion";
import {
  determineGameWinner,
  recordGameWin,
  buildSeriesScore,
  isSeriesOver,
  resetStateForNextGame,
} from "../shared/rooms/SeriesManager";
import {
  SPECIAL_MOVES,
  totalMoveDurationMs,
  DEFAULT_CLASH_OUTCOME,
  type SpecialInteractionDef,
  type SpecialMovePhase,
} from "../constants/specialMoves";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";
import { MODIFIER_MAP, type RoundModifier } from "../../shared/types/roundModifier";
import { loadElementTypeMatrix, computeDynamicTypeMultiplier, type LoadedTypeMatrix } from "../utils/elementTypeLoader";
import type { ArenaTimelineEvent } from "../types/shared";
import type { ArenaLink, BeyLink, BeyLinkEffect, BeyLinkGroupPattern, BeyLinkMovementControl } from "../../shared/types/arenaConfigNew";
import { getMechanic, type MechanicContext } from "../physics/MechanicRegistry";
import { ReplayRecorder } from "./ReplayRecorder";

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

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
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

export class BattleRoom extends BaseRoom<GameState> {
  private matchStarted = false;
  private lastInputTime = 0;
  private isPrivateRoom = false;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private matchmakingTimer: ReturnType<typeof setTimeout> | null = null;
  // #9: Per-client input rate limiting — max 10 inputs per 100ms window
  private inputRateMap: Map<string, { count: number; windowStart: number }> = new Map();
  // #9: Per-client special-tap cooldown (800ms minimum between special-tap inputs)
  private specialTapLastMs: Map<string, number> = new Map();
  // #10: Per-client estimated ping in ms (updated via "ping" messages from client)
  private clientPingMs: Map<string, number> = new Map();
  protected globalSettings: GlobalSettingsDoc | null = null;
  protected playerSessions = new Set<string>();
  protected spectatorSessions = new Set<string>();
  protected beybladeDataCache = new Map<string, BeybladeStats | null>();
  /** #21: Per-session accessory def cache (loaded once in onJoin, used in game loop). */
  protected accessoryCache = new Map<string, BeyAccessoryDef | null>();
  /** #24: Boost pad activation cooldowns — keyed by "${padId}:${beyId}". */
  private boostPadCooldowns: Map<string, number> = new Map();
  /** #28: Replay recorder — captures state at ~20Hz for killcam + Firestore replay. */
  protected replayRecorder: ReplayRecorder | null = null;
  protected spawnPositions = new Map<string, { x: number; y: number; angle: number }>();
  protected comboTrackers = new Map<string, ComboTracker>();
  protected comboMatchStates = new Map<string, BeyComboMatchState>();
  protected triggerStates = new Map<string, TriggerState>();
  /** Active round modifiers for this match (resolved once in onCreate). */
  protected activeModifiers: import("../../shared/types/roundModifier").RoundModifier[] = [];
  /** Whether controls are inverted this match (from round modifier). */
  protected invertControlsActive = false;
  /** Per-session camera-follow target id (purely informational). */
  protected spectatorFollowTargets = new Map<string, string>();
  /** Combo effect definitions keyed by effectId (Phase U — loaded once in onCreate). */
  protected comboEffectsCache = new Map<string, ComboEffectDoc>();
  /** Arena-wide effect expiry timestamps keyed by effectId (Phase AA). */
  protected arenaEffectExpiries = new Map<string, number>();
  /** Per-turret runtime state for ongoing effects (TurretDispatch). */
  protected turretRuntimes = new Map<string, TurretRuntimeState>();
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
  // beyId → current floor index within the floor group (0 = ground)
  private beyFloorIndex: Map<string, number> = new Map();
  // ticks since last arena-link-status broadcast
  private linkStatusBroadcastTick = 0;

  // ── Bey-to-bey stack state (BeyLink system) ──────────────────────────────────
  private beyStackState: Map<string, { partnerId: string; linkId: string; tickCount: number }> = new Map();
  private beyStackCooldowns: Map<string, Map<string, number>> = new Map();
  /** Per-victim pending QTE to escape a hostile BeyLink stack. */
  private pendingBeyLinkQTE: Map<string, { stackKey: string; linkId: string; key: string; expiresAt: number }> = new Map();
  /** Control-loss immunity expiry: sessionId → expiresAtTick. While immune, control_loss effects are skipped and immunized bey is unlinked. */
  private controlLossImmunity: Map<string, number> = new Map();
  /** Tracks which beys are currently under control loss so we can issue recovery QTEs every 10 sec. */
  private activeControlLoss: Map<string, { linkId: string; nextQTETick: number; recoveryKey: string }> = new Map();
  /** Running tick counter (incremented each server tick). */
  private tickCounter = 0;
  /** Phase 27: ghost sync counter — beyGhosts populated every 6 ticks (10Hz at 60Hz server). */
  private ghostTickCounter = 0;

  // ── Hijack state (BeyLink hijack mechanic) ───────────────────────────────────
  /** Active hijack QTEs: stackKey → { blockKey, expiresAt }. Attacker must block before expiry. */
  private pendingHijackQTE = new Map<string, { blockKey: string; expiresAt: number }>();
  /** Per-bey hijack cooldowns: beyId → linkId → ticks remaining. */
  private hijackCooldowns = new Map<string, Map<string, number>>();
  /** Cached last PlayerInput per session — used by initiator/player movement control modes. */
  private lastPlayerInput = new Map<string, PlayerInput>();
  /** Rigid formation offsets: "rigid:${sid}" → { relX, relY } relative to cluster centroid at stack-entry tick. */
  private rigidFormationOffset = new Map<string, { relX: number; relY: number }>();

  /** Firestore-loaded element type matrix (falls back to hardcoded on failure). */
  protected elementTypeMatrix: LoadedTypeMatrix | null = null;

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

  // ── Phase 29: Collision QTE ──────────────────────────────────────────────────
  private activeCollisionQTEs = new Map<string, {
    key: string;          // `${id1}:${id2}`
    player1Id: string;
    player2Id: string;
    pendingDamage1: number;
    pendingDamage2: number;
    player1MashCount: number;
    player2MashCount: number;
    timerId: ReturnType<typeof setTimeout>;
    specialFired?: boolean;
    finalMultiplier?: number;
    specialPromptSent1?: boolean;
    specialPromptSent2?: boolean;
  }>();
  private collisionQTECooldowns = new Map<string, number>(); // pairKey → expiry ms
  private physicalContactThisTick = new Set<string>();       // pairKey for this tick

  // ── Phase 29: Per-bey special phase executor state (not in schema) ───────────
  private specialPhaseWaitElapsed = new Map<string, number>(); // beyId → ms waited
  private specialPhaseUsedFallback = new Map<string, boolean>();

  // ── Phase 29: Special interaction defs loaded from Firestore at room start ───
  protected specialInteractionCache = new Map<string, SpecialInteractionDef>();

  // Constants
  private static readonly COLLISION_QTE_MIN_DAMAGE    = 15;
  private static readonly COLLISION_QTE_WINDOW_MS     = 2500;
  private static readonly COLLISION_QTE_COOLDOWN_MS   = 5000;
  private static readonly COLLISION_QTE_MAX_POWER     = 150;
  private static readonly COLLISION_QTE_SPECIAL_THRESHOLD = 80;
  private static readonly AERIAL_HIT_DAMAGE_FACTOR    = 0.7;
  private static readonly EFFECTIVE_GRAVITY_PX_MS2    = 0.0004; // px/ms²

  maxClients = 12; // 4 player slots + 8 spectator slots

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    this.isPrivateRoom = !!options.private;
    console.log("BattleRoom created", options);

    if (this.isPrivateRoom) {
      const code = generateRoomCode();
      this.setMetadata({ roomCode: code });
      console.log(`Private room code: ${code}`);
    }

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enablePvp === false) throw new Error("PVP disabled");
    if (this.globalSettings?.maxActiveRooms) setMaxActiveRooms(this.globalSettings.maxActiveRooms);

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

    // #19: Load gimmick × part material synergies (idempotent, cached in-process)
    await initGimmickSynergies();

    // #28: Initialise replay recorder (matchId = room id)
    this.replayRecorder = new ReplayRecorder(this.roomId);

    // Load Firestore-backed element type matrix (with hardcoded fallback)
    const firestoreDb = getFirestoreDb();
    if (firestoreDb) {
      this.elementTypeMatrix = await loadElementTypeMatrix(firestoreDb);
      // Phase 29: load special interaction defs into in-memory cache (no async in game loop)
      await this.loadSpecialInteractionDefs(firestoreDb);
    }

    this.onMessage("input", (client, message: number | PlayerInput) => {
      let input = normalizeInput(message);
      if (this.invertControlsActive) input = invertInputControls(input);
      this.handleInput(client, input);
    });

    // #10: Client ping report — used for lag-compensated collision detection
    this.onMessage("ping", (client, message: { rtt?: number }) => {
      const rtt = typeof message?.rtt === "number" ? Math.max(0, Math.min(1000, message.rtt)) : 0;
      this.clientPingMs.set(client.sessionId, rtt);
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

    // Host explicitly starts the match (private Friends Rooms only)
    this.onMessage("start-game", (client, _options: any) => {
      if (!this.isPrivateRoom) return; // public rooms auto-start
      if (client.sessionId !== this.state.hostId) return; // only host
      if (this.playerSessions.size < 2) return; // need ≥2 players
      this.startWarmup();
    });

    this.registerLaunchInputHandler(this.spectatorSessions);

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

    // ── Phase 29: Collision QTE messages ────────────────────────────────────
    this.onMessage("collision-qte-mash", (client) => {
      if (this.spectatorSessions.has(client.sessionId)) return;
      const bey = this.state.beyblades.get(client.sessionId);
      if (!bey || !bey.isActive || bey.beyAirborne) return;

      // Find the active QTE this player is in
      for (const [key, qte] of this.activeCollisionQTEs) {
        const isP1 = qte.player1Id === client.sessionId;
        const isP2 = qte.player2Id === client.sessionId;
        if (!isP1 && !isP2) continue;

        if (isP1) qte.player1MashCount++;
        else qte.player2MashCount++;

        const mashCount = isP1 ? qte.player1MashCount : qte.player2MashCount;
        const power = this.calcQTEPower(mashCount);
        bey.collisionQTEPower = power;

        // Special prompt check
        const prompted = isP1 ? qte.specialPromptSent1 : qte.specialPromptSent2;
        if (
          power >= BattleRoom.COLLISION_QTE_SPECIAL_THRESHOLD &&
          bey.power >= 30 &&
          !prompted
        ) {
          if (isP1) qte.specialPromptSent1 = true;
          else qte.specialPromptSent2 = true;
          const targetClient = this.clients.find(c => c.sessionId === client.sessionId);
          targetClient?.send("collision-qte-special-prompt", {
            qteMultiplier: power / 100,
            currentSP: bey.power,
          });
        }
        break;
      }
    });

    this.onMessage("collision-qte-fire-special", (client) => {
      if (this.spectatorSessions.has(client.sessionId)) return;
      const bey = this.state.beyblades.get(client.sessionId);
      if (!bey || !bey.isActive) return;

      for (const [key, qte] of this.activeCollisionQTEs) {
        const isP1 = qte.player1Id === client.sessionId;
        const isP2 = qte.player2Id === client.sessionId;
        if (!isP1 && !isP2) continue;

        if (bey.power < 30) break;
        const qteMultiplier = bey.collisionQTEPower / 100;
        const spPercent = bey.power / 100;
        const finalMultiplier = qteMultiplier * spPercent;

        qte.specialFired = true;
        qte.finalMultiplier = finalMultiplier;
        bey.power = 0;

        this.handleSpecialMoveWithMultiplier(bey, finalMultiplier);
        break;
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

    // Control-loss recovery QTE (issued every 10 sec while under control loss)
    this.onMessage("bey-link-recovery-input", (client, message: { key: string }) => {
      const ctrl = this.activeControlLoss.get(client.sessionId);
      if (!ctrl) return;
      if (message.key === ctrl.recoveryKey) {
        this._grantControlLossImmunity(client.sessionId, ctrl.linkId);
      }
    });

    // ── Hijack: victim initiates a role-reversal attempt ─────────────────────
    this.onMessage("bey-link-hijack-attempt", (client, data: { stackKey: string; linkId: string }) => {
      const beyLinks = (this.arenaCache as any)?.beyLinks as BeyLink[] | undefined;
      const link = beyLinks?.find(l => l.id === data.linkId);
      if (!link?.hijackable) return;

      const parts = data.stackKey.split(":");
      const sidA = parts[0], sidB = parts[1];
      if (client.sessionId !== sidB) return;
      if (!this.beyStackState.has(data.stackKey)) return;

      const cooldown = this.hijackCooldowns.get(sidB)?.get(data.linkId) ?? 0;
      if (cooldown > 0) return;
      if (this.pendingHijackQTE.has(data.stackKey)) return;

      const windowTicks = link.hijackWindowTicks ?? 90;
      const expiresAt = Date.now() + windowTicks * (1000 / 60);
      const blockKey = QTE_KEY_POOL[Math.floor(this.rand() * QTE_KEY_POOL.length)];

      this.pendingHijackQTE.set(data.stackKey, { blockKey, expiresAt });

      client.send("bey-link-hijack-qte", { stackKey: data.stackKey, linkId: data.linkId, windowTicks, expiresAt });
      const attackerClient = this.clients.find(c => c.sessionId === sidA);
      attackerClient?.send("bey-link-hijack-block-qte", { stackKey: data.stackKey, linkId: data.linkId, key: blockKey, windowTicks, expiresAt });
    });

    // ── Hijack block: attacker presses the correct key to deny the takeover ──
    this.onMessage("bey-link-hijack-block", (client, data: { stackKey: string; key: string }) => {
      const pending = this.pendingHijackQTE.get(data.stackKey);
      if (!pending || Date.now() > pending.expiresAt) return;

      const parts = data.stackKey.split(":");
      const sidA = parts[0], sidB = parts[1], lid = parts[2];
      if (client.sessionId !== sidA) return;
      if (data.key !== pending.blockKey) return;

      this.pendingHijackQTE.delete(data.stackKey);

      const beyLinks = (this.arenaCache as any)?.beyLinks as BeyLink[] | undefined;
      const link = beyLinks?.find(l => l.id === lid);
      const cooldownTicks = link?.hijackCooldownTicks ?? 180;
      const vcmap = this.hijackCooldowns.get(sidB) ?? new Map<string, number>();
      vcmap.set(lid, cooldownTicks);
      this.hijackCooldowns.set(sidB, vcmap);

      this.broadcast("bey-link-hijack-failed", { stackKey: data.stackKey, blockerId: sidA, victimId: sidB });
    });

    // 60s matchmaking timeout for public rooms — notify clients if room isn't full
    if (!this.isPrivateRoom) {
      this.matchmakingTimer = setTimeout(() => {
        this.matchmakingTimer = null;
        if (!this.matchStarted && this.playerSessions.size > 0) {
          this.broadcast("matchmaking-timeout", {
            playersFound: this.playerSessions.size,
          });
        }
      }, 60_000);
    }
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

    // Clear idle timer if a player rejoins a private room
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }

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
    let spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;
    let spawnAngle = spawnOffset.angle;

    // Classic Stadium / quadrant-launch arenas: use royaleLaunchRadius + opposite-quadrant angles
    const ac2 = this.arenaCache as any;
    if (ac2?.launchMode === "quadrant") {
      const royaleR = ac2?.royaleLaunchRadius as number | undefined;
      if (royaleR !== undefined) spawnRadius = royaleR * 16;
      const maxClients = this.maxClients ?? 4;
      if (maxClients >= 12) {
        // Royale: evenly spaced ring
        spawnAngle = (spawnIndex / 12) * Math.PI * 2;
      } else if (maxClients >= 4) {
        // 4 players: each at diagonal opposite quadrant (0°, 90°, 180°, 270°)
        spawnAngle = (spawnIndex / 4) * Math.PI * 2;
      } else {
        // 2 players: top (90°) and bottom (270°) so they face each other
        spawnAngle = spawnIndex === 0 ? Math.PI / 2 : (3 * Math.PI) / 2;
      }
    }

    beyblade.x = arenaHalfW + Math.cos(spawnAngle) * spawnRadius;
    beyblade.y = arenaHalfH + Math.sin(spawnAngle) * spawnRadius;

    this.spawnPositions.set(client.sessionId, { x: beyblade.x, y: beyblade.y, angle: spawnAngle });

    const pFlags = resolvePhysicsFlags((beybladeData as any)?.physicsFlags);
    beyblade.collisionWithBeys       = pFlags.collisionWithBeys;
    beyblade.collisionWithArena      = pFlags.collisionWithArena;
    beyblade.collisionWithObstacles  = pFlags.collisionWithObstacles;
    beyblade.invulnerable            = pFlags.invulnerable;
    beyblade.noKnockback             = pFlags.noKnockback;

    this.physics.createBeyblade(
      beyblade.id,
      beyblade.x,
      beyblade.y,
      beyblade.radius,
      beyblade.mass,
      beybladeData || undefined,
      pFlags
    );

    const initialAngularVelocity = (beyblade.spinDirection === "left" ? -1 : 1) * (beyblade.maxSpin / 200);
    this.physics.setAngularVelocity(beyblade.id, initialAngularVelocity);

    this.state.beyblades.set(client.sessionId, beyblade);
    this.state.seriesWins.set(beyblade.userId, 0);

    // Expand gimmicks for this bey
    const gimmickDefsCache = await loadGimmickDefs();
    const gimmickIds: string[] = (beybladeData as any)?.gimmickIds ?? [];
    if (gimmickIds.length > 0) {
      const instances = expandGimmicks(gimmickIds, gimmickDefsCache);
      instances.forEach(inst => beyblade.mechanics.push(inst));
    }

    // #21: Apply bey accessory passive modifiers at match start
    const accessoryItemId: string | undefined = beybladeData?.accessoryItemId;
    if (accessoryItemId) {
      const accessories = await loadBeyAccessories();
      const acc: BeyAccessoryDef | undefined = accessories[accessoryItemId];
      this.accessoryCache.set(client.sessionId, acc ?? null);
      if (acc) {
        if (acc.statModifiers) {
          for (const [field, delta] of Object.entries(acc.statModifiers)) {
            const bey = beyblade as any;
            if (typeof bey[field] === "number") {
              bey[field] += delta;
            }
          }
        }
        console.log(`✅ Applied accessory "${acc.name}" to ${beyblade.username}`);
      }
    } else {
      this.accessoryCache.set(client.sessionId, null);
    }

    // Assign host to first non-spectator player
    if (this.playerSessions.size === 1) {
      this.state.hostId = client.sessionId;
    }

    // Auto-start warmup:
    //   - Public/random rooms: start as soon as 2 players have joined (no host button needed)
    //   - Private rooms: wait for explicit "start-game" message from host
    if (!this.matchStarted && !this.isPrivateRoom && this.playerSessions.size >= 2) {
      this.startWarmup();
    }
  }

  private startWarmup() {
    if (this.matchStarted) return;
    if (this.matchmakingTimer) { clearTimeout(this.matchmakingTimer); this.matchmakingTimer = null; }
    this.matchStarted = true;
    this.state.status = "warmup";
    this.lastInputTime = Date.now();
    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase });
  }

  async onLeave(client: Client, consented: boolean) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }

    // Allow 30s reconnect window for unexpected disconnects during active game
    if (!consented && this.state.status === "in-progress") {
      console.log(`Player ${client.sessionId} disconnected — holding slot for 30s`);
      try {
        await this.allowReconnection(client, 30);
        // Reconnected — restore beyblade as active if it was eliminated by disconnect
        console.log(`Player ${client.sessionId} reconnected`);
        const bey = this.state.beyblades.get(client.sessionId);
        if (bey && !bey.isRingOut && !bey.isBurst) {
          bey.isActive = true;
        }
        return;
      } catch {
        console.log(`Player ${client.sessionId} reconnect timeout — eliminating`);
      }
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
      if (this.isPrivateRoom) {
        // Friends Room: idle-close after 60s with zero clients
        this.idleTimer = setTimeout(() => {
          this.broadcast('room-closed', { reason: 'idle' });
          this.disconnect();
        }, 60_000);
      } else {
        this.disconnect();
      }
    }
  }

  onDispose() {
    console.log("BattleRoom disposed");
    if (this.matchmakingTimer) { clearTimeout(this.matchmakingTimer); this.matchmakingTimer = null; }
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }
    releaseRoom();
    this.physics.destroy();
  }

  // ─── Launch phase ────────────────────────────────────────────────────────────

  protected startMatchFromLaunch() {
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const baseRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    this.state.beyblades.forEach((bey, sessionId) => {
      if (bey.launchFailed) {
        bey.isActive = false;
        bey.health = 0;
        bey.eliminationType = "ring_out";
        this.physics.removeBeyblade(sessionId);
        return;
      }

      const spawnData = this.spawnPositions.get(sessionId);
      if (spawnData) {
        // position 0=forward/center, 1=backward/edge — map to 0.6x–1.4x base radius
        const radiusMult = 0.6 + bey.launchPosition * 0.8;
        bey.x = arenaHalfW + Math.cos(spawnData.angle) * baseRadius * radiusMult;
        bey.y = arenaHalfH + Math.sin(spawnData.angle) * baseRadius * radiusMult;
        this.physics.setPosition(bey.id, bey.x, bey.y);
      }

      const powerFraction = Math.max(0.01, bey.launchPower / 100);
      bey.spin = bey.maxSpin * powerFraction;
      const angVel = (bey.spinDirection === "left" ? -1 : 1) * (bey.maxSpin * powerFraction / 200);
      this.physics.setAngularVelocity(bey.id, angVel);

      bey.beyTiltAngle = Math.abs(bey.launchTilt);
    });

    this.state.status = "in-progress";
    this.state.timer = 180;
    this.state.startTime = Date.now();
    this.broadcast("match-start", {});
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

  // ─── Input handling — delegates to shared/rooms/InputHandler ────────────────

  protected handleInput(client: Client, message: PlayerInput) {
    if (this.spectatorSessions.has(client.sessionId)) return;

    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    if (this.state.status !== "in-progress") return;

    // #9: Input rate limiting — max 10 inputs per 100ms per client
    const nowMs = Date.now();
    let rateEntry = this.inputRateMap.get(client.sessionId);
    if (!rateEntry) {
      rateEntry = { count: 0, windowStart: nowMs };
      this.inputRateMap.set(client.sessionId, rateEntry);
    }
    if (nowMs - rateEntry.windowStart >= 100) {
      rateEntry.count = 0;
      rateEntry.windowStart = nowMs;
    }
    rateEntry.count++;
    if (rateEntry.count > 10) return; // drop excess inputs silently

    // #9: Bitmask sanity — clear contradicting directional pairs
    if (message.moveLeft && message.moveRight) { message.moveLeft = false; message.moveRight = false; }
    if (message.moveUp && message.moveDown) { message.moveUp = false; message.moveDown = false; }

    // #9: Special-tap server-side cooldown (800ms minimum gap)
    if (message.specialTap) {
      const lastSpecial = this.specialTapLastMs.get(client.sessionId) ?? 0;
      if (nowMs - lastSpecial < 800) {
        message.specialTap = false; // suppress
      } else {
        this.specialTapLastMs.set(client.sessionId, nowMs);
      }
    }

    this.lastInputTime = nowMs;
    this.lastPlayerInput.set(client.sessionId, message);

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

    applyMovementInput(beyblade, message, forceMagnitude, this.physics, !!this.arenaSystem);

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
    if ((events as any).furyReleased) {
      this.broadcast("fury-released", { beyId: beyblade.id, type: beyblade.type });
    }
    if ((events as any).gimmickModeChanged) {
      this.broadcast("gimmick-mode-changed", { beyId: beyblade.id, loaded: beyblade.gimmickLoadedMode });
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
    const moveDef = SPECIAL_MOVES[beyblade.specialMove];

    // Phase 29: multi-phase executor path
    if (moveDef) {
      const durationMs = totalMoveDurationMs(moveDef);
      beyblade.specialMoveActive = true;
      beyblade.specialPhaseIndex = 0;
      beyblade.specialPhaseElapsed = 0;
      beyblade.specialPhaseSubState = "windup";
      beyblade.specialMoveEndTime = Date.now() + durationMs;
      beyblade.controlLockedUntilMs = Math.max(beyblade.controlLockedUntilMs, Date.now() + durationMs);
      beyblade.controlLockSource = "special";

      // Check skipCondition on phase 0 immediately
      const phase0 = moveDef.phases[0];
      if (phase0?.skipCondition) {
        const target = this.findNearestInRadius(beyblade, moveDef.radius);
        if (this.checkSkipCondition(phase0.skipCondition, target)) {
          beyblade.specialPhaseIndex = 1; // skip phase 0
        }
      }

      // QTE block prompt (collision-only gate — only emitted if there's physical contact)
      const arenaQTEEnabled = (this.arenaCache as any)?.qteEnabled !== false;
      const matchState = this.comboMatchStates.get(beyblade.id);
      const totalSlots = Array.from(beyblade.comboSlots ?? []).length;
      const gateMet = matchState ? isQTEGateMet(matchState, totalSlots) : false;
      const hasContact = Array.from(this.physicalContactThisTick).some(k =>
        k.startsWith(beyblade.id + ":") || k.endsWith(":" + beyblade.id)
      );

      if (arenaQTEEnabled && gateMet && hasContact && !this.pendingQTE) {
        const LEGACY_SPECIAL_COST = 50;
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

      this.broadcast("special-move-camera", {
        beyId: beyblade.id,
        cameraConfig: { followTarget: beyblade.id, zoomIn: true, durationMs },
      });
      this.broadcast("combo-visual", {
        beyId: beyblade.id,
        introAnimation: beyblade.specialMove || beyblade.type,
        particlePresetId: beyblade.specialMove || beyblade.type,
      });
      this.broadcast("special-move", {
        playerId: beyblade.id,
        x: beyblade.x,
        y: beyblade.y,
        facing: beyblade.rotation,
        type: beyblade.specialMove,
        group: moveDef.group,
      });

      // Phase 28: emit bitbeast-show if this beyblade has a BitBeast assigned
      const stats = this.beybladeDataCache.get(beyblade.userId);
      if (stats?.bitBeastId) {
        const side = this.getPlayerSide(beyblade.userId);
        const bbDurationMs = durationMs + 400;
        this.broadcast("bitbeast-show", {
          beyId: beyblade.id,
          side,
          bitBeastId: stats.bitBeastId,
          durationMs: bbDurationMs,
          durationTicks: Math.round(bbDurationMs / (1000 / 60)),
        });
        // ── Bit-Beast Gameplay Hook (GBA Beyblade) ──────────────────────────
        // While BitBeast is active: spin decay halved, contact damage +10%
        beyblade.bitBeastActive = true;
        beyblade.contactDamageMultiplier = (beyblade.contactDamageMultiplier ?? 1) * 1.10;
      }

      return;
    }

    // Legacy fallback (no moveDef found)
    const state = this.physics.getBodyState(beyblade.id);
    if (!state) return;

    beyblade.specialMoveActive = true;
    beyblade.specialMoveEndTime = Date.now() + 500;

    this.broadcast("special-move-camera", {
      beyId: beyblade.id,
      cameraConfig: { followTarget: beyblade.id, zoomIn: true, durationMs: 500 },
    });
    this.broadcast("combo-visual", {
      beyId: beyblade.id,
      introAnimation: beyblade.type,
      particlePresetId: beyblade.type,
    });

    switch (beyblade.type) {
      case "attack": {
        const rushForce = 0.005 * beyblade.mass * beyblade.damageMultiplier;
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * rushForce, Math.sin(beyblade.rotation) * rushForce);
        const boostedSpin = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.8);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boostedSpin : boostedSpin);
        this.broadcast("special-move", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, facing: beyblade.rotation, type: "stampede-rush" });
        break;
      }
      case "defense": {
        const maxAngular = beyblade.maxSpin / 200;
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -maxAngular : maxAngular);
        this.physics.applyForce(beyblade.id, -state.velocityX * beyblade.mass * 0.8, -state.velocityY * beyblade.mass * 0.8);
        beyblade.isInvulnerable = true;
        beyblade.invulnerabilityTimer = 1.5;
        this.broadcast("special-move", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, facing: beyblade.rotation, type: "gyro-anchor" });
        break;
      }
      case "stamina": {
        const orbitForce = 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * orbitForce, Math.cos(beyblade.rotation) * orbitForce);
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200));
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, facing: beyblade.rotation, type: "spin-recovery" });
        break;
      }
      case "balanced": {
        const burstForce = 0.003 * beyblade.mass;
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * burstForce, Math.sin(beyblade.rotation) * burstForce);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, facing: beyblade.rotation, type: "tactical-burst" });
        break;
      }
    }
  }

  private cancelSpecialMoveViaQTE(beyblade: Beyblade, powerCost: number) {
    // Phase 29: key-sequence QTE block is collision-only; softened to 40% + 30% refund
    // Find any target currently in physical contact with attacker this tick
    let partialDamageApplied = false;
    for (const contactKey of this.physicalContactThisTick) {
      const [a, b] = contactKey.split(":");
      const targetId = a === beyblade.id ? b : b === beyblade.id ? a : null;
      if (!targetId) continue;
      const target = this.state.beyblades.get(targetId);
      if (target && target.isActive) {
        // 40% of special's phase damage multiplier still lands
        const moveDef = SPECIAL_MOVES[beyblade.specialMove];
        if (moveDef) {
          const phase = moveDef.phases[beyblade.specialPhaseIndex] ?? moveDef.phases[0];
          const partialDmg = (phase.effects.damageMultiplier ?? 1.0) * 0.4 * 10;
          target.health = Math.max(0, target.health - partialDmg);
          beyblade.damageDealt += partialDmg;
          target.damageReceived += partialDmg;
          partialDamageApplied = true;
        }
        break;
      }
    }

    beyblade.specialMoveActive = false;
    beyblade.specialMoveEndTime = 0;
    beyblade.controlLockedUntilMs = 0;
    beyblade.specialPhaseIndex = 0;
    beyblade.specialPhaseElapsed = 0;
    beyblade.specialPhaseSubState = "";
    const refund = Math.floor(powerCost * 0.3);
    beyblade.power = Math.min(100, beyblade.power + refund);
    this.broadcast("qte-success", {
      attackerBeyId: beyblade.id,
      refundAmount: refund,
      partialHit: partialDamageApplied,
    });
    this.pendingQTE = null;
  }

  // ─── Phase 29: Collision QTE lifecycle ──────────────────────────────────────

  protected async loadSpecialInteractionDefs(db: ReturnType<typeof getFirestoreDb>) {
    if (!db) return;
    try {
      const snap = await db.collection("special_interaction_defs").get();
      snap.forEach((doc: any) =>
        this.specialInteractionCache.set(doc.id, doc.data() as SpecialInteractionDef)
      );
      console.log(`✅ BattleRoom: loaded ${this.specialInteractionCache.size} special interaction defs`);
    } catch (e) {
      console.warn("⚠️ BattleRoom: failed to load special_interaction_defs, using defaults", e);
    }
  }

  private calcQTEPower(mashCount: number): number {
    let power = 0;
    for (let i = 0; i < mashCount; i++) {
      power += power < 100 ? 12 : 6;
      if (power >= BattleRoom.COLLISION_QTE_MAX_POWER) {
        power = BattleRoom.COLLISION_QTE_MAX_POWER;
        break;
      }
    }
    return power;
  }

  private startCollisionQTE(
    id1: string, id2: string,
    dmg1: number, dmg2: number,
    ss1: number, ss2: number,
  ) {
    const b1 = this.state.beyblades.get(id1);
    const b2 = this.state.beyblades.get(id2);
    if (!b1 || !b2) return;

    const key = id1 < id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
    b1.collisionQTEActive = true;
    b1.collisionQTEPower = 0;
    b2.collisionQTEActive = true;
    b2.collisionQTEPower = 0;

    const timerId = setTimeout(() => this.endCollisionQTE(key), BattleRoom.COLLISION_QTE_WINDOW_MS);

    this.activeCollisionQTEs.set(key, {
      key,
      player1Id: id1,
      player2Id: id2,
      pendingDamage1: dmg1,
      pendingDamage2: dmg2,
      player1MashCount: 0,
      player2MashCount: 0,
      timerId,
    });

    this.broadcast("collision-qte-start", {
      player1Id: id1,
      player2Id: id2,
      windowMs: BattleRoom.COLLISION_QTE_WINDOW_MS,
    });
  }

  private endCollisionQTE(key: string) {
    const qte = this.activeCollisionQTEs.get(key);
    if (!qte) return;

    clearTimeout(qte.timerId);
    this.activeCollisionQTEs.delete(key);

    const b1 = this.state.beyblades.get(qte.player1Id);
    const b2 = this.state.beyblades.get(qte.player2Id);

    // #9: Clamp QTE multipliers to [0, 1.5] (server enforces 150% cap)
    const p1Mult = Math.min(1.5, Math.max(0, b1 ? b1.collisionQTEPower / 100 : 1.0));
    const p2Mult = Math.min(1.5, Math.max(0, b2 ? b2.collisionQTEPower / 100 : 1.0));

    // Apply held damage × QTE multiplier
    if (b1 && b1.isActive) {
      const applyD = qte.pendingDamage1 * p2Mult; // b1 takes dmg scaled by b2's power
      b1.health = Math.max(0, b1.health - applyD);
      b1.damageReceived += applyD;
    }
    if (b2 && b2.isActive) {
      const applyD = qte.pendingDamage2 * p1Mult;
      b2.health = Math.max(0, b2.health - applyD);
      b2.damageReceived += applyD;
    }

    if (b1) { b1.collisionQTEActive = false; b1.collisionQTEPower = 0; }
    if (b2) { b2.collisionQTEActive = false; b2.collisionQTEPower = 0; }

    this.collisionQTECooldowns.set(key, Date.now() + BattleRoom.COLLISION_QTE_COOLDOWN_MS);

    this.broadcast("collision-qte-result", {
      player1Id: qte.player1Id,
      player2Id: qte.player2Id,
      player1Multiplier: p1Mult,
      player2Multiplier: p2Mult,
    });

    // Fire-and-forget Firestore write (no await — does not block game loop)
    const db = getFirestoreDb();
    if (db) {
      db.collection("collision_qte_events").add({
        matchId: (this.state as any).matchId ?? this.roomId,
        roomId: this.roomId,
        beyId1: qte.player1Id,
        beyId2: qte.player2Id,
        damage1: qte.pendingDamage1,
        damage2: qte.pendingDamage2,
        player1MashCount: qte.player1MashCount,
        player2MashCount: qte.player2MashCount,
        player1Multiplier: p1Mult,
        player2Multiplier: p2Mult,
        specialFired: qte.specialFired ?? false,
        finalMultiplier: qte.finalMultiplier ?? null,
        timestamp: Date.now(),
      }).catch((e: unknown) => console.warn("collision_qte_events write failed", e));
    }
  }

  // ─── Overhaul: Perfect Clash Timing Ring (Mario & Luigi GBA) ─────────────────

  private resolveClashTiming(id1: string, id2: string): void {
    const b1 = this.state.beyblades.get(id1);
    const b2 = this.state.beyblades.get(id2);

    if (b1) { b1.clashTimingWindowOpen = false; b1.clashTimingPressed = false; }
    if (b2) { b2.clashTimingWindowOpen = false; b2.clashTimingPressed = false; }

    // clashTimingPressed is set by InputHandler when any action key is pressed
    // while clashTimingWindowOpen is true.
    const p1Perfect = b1 ? b1.clashTimingPressed : false;
    const p2Perfect = b2 ? b2.clashTimingPressed : false;

    if (b1 && p1Perfect) {
      b1.comboDamageMultiplier = 1.3;
      b1.comboDamageMultiplierTimer = 0.5;
    }
    if (b2 && p2Perfect) {
      b2.comboDamageMultiplier = 1.3;
      b2.comboDamageMultiplierTimer = 0.5;
    }

    this.broadcast("clash-timing-result", { id1, id2, p1Perfect, p2Perfect });
  }

  // ─── Phase 29: Airborne Z-axis physics ──────────────────────────────────────

  private tickAirbornePhysics(deltaTime: number) {
    this.state.beyblades.forEach(bey => {
      if (!bey.beyAirborne) return;

      bey.beyHeight += bey.beyVerticalVel * deltaTime;
      bey.beyVerticalVel = Math.max(
        -2.0, // max fall speed (px/ms)
        bey.beyVerticalVel - BattleRoom.EFFECTIVE_GRAVITY_PX_MS2 * deltaTime,
      );

      if (bey.beyHeight <= 0) {
        bey.beyHeight = 0;
        bey.beyVerticalVel = 0;
        bey.beyAirborne = false;
        this.onBeyLanded(bey);
      }
    });
  }

  private onBeyLanded(bey: Beyblade) {
    const moveDef = SPECIAL_MOVES[bey.specialMove];
    if (!bey.specialMoveActive || !moveDef) return;
    const phase = moveDef.phases[bey.specialPhaseIndex];
    if (!phase) return;

    // aerial-launch landing AoE: apply to all ground beys in range
    if (phase.effects.landingAoePx && phase.effects.landingDmgMult) {
      const aoeRadius = phase.effects.landingAoePx;
      const dmgMult = phase.effects.landingDmgMult;
      this.state.beyblades.forEach(target => {
        if (target.id === bey.id || !target.isActive || target.beyAirborne) return;
        const dx = target.x - bey.x;
        const dy = target.y - bey.y;
        if (Math.sqrt(dx * dx + dy * dy) > aoeRadius) return;
        const dmg = 15 * dmgMult; // base AoE damage
        target.health = Math.max(0, target.health - dmg);
        bey.damageDealt += dmg;
        target.damageReceived += dmg;
      });
      this.broadcast("bey-landed", {
        beyId: bey.id,
        x: bey.x,
        y: bey.y,
        aoeRadius,
        dmgMult,
      });
    }
  }

  // ─── Phase 29: Multi-phase special move tick ─────────────────────────────────

  private tickSpecialPhase(bey: Beyblade, deltaTime: number) {
    const moveDef = SPECIAL_MOVES[bey.specialMove];
    if (!moveDef) { bey.specialMoveActive = false; return; }

    const phase = moveDef.phases[bey.specialPhaseIndex];
    if (!phase) {
      bey.specialMoveActive = false;
      bey.specialPhaseSubState = "";
      this.specialPhaseWaitElapsed.delete(bey.id);
      this.specialPhaseUsedFallback.delete(bey.id);
      return;
    }

    const windUpEnd  = phase.windUpMs;
    const activeEnd  = phase.windUpMs + phase.durationMs;
    const totalEnd   = phase.windUpMs + phase.durationMs + phase.windDownMs;
    const elapsed    = bey.specialPhaseElapsed;

    let newSubState: "windup" | "active" | "winddown";
    if (elapsed < windUpEnd) {
      newSubState = "windup";
    } else if (elapsed < activeEnd) {
      newSubState = "active";
    } else {
      newSubState = "winddown";
    }

    if (newSubState !== bey.specialPhaseSubState) {
      bey.specialPhaseSubState = newSubState;
      this.broadcast("special-phase-substate", {
        beyId: bey.id,
        phaseId: phase.phaseId,
        subState: newSubState,
      });
    }

    // Self-effects always apply in windup + active
    if (newSubState === "windup") {
      this.applyPhaseWindUpForce(bey, phase, deltaTime);
    } else if (newSubState === "active") {
      this.applyPhaseSelfEffects(bey, phase);
      this.applyPhaseTargetEffects(bey, phase, deltaTime);
    }
    // winddown: no new forces — existing velocity carries

    // Advance phase elapsed (no advance while waiting for airborne target)
    const needsAirborne = phase.targetFlags.requiresAirborneTarget;
    const waited = this.specialPhaseWaitElapsed.get(bey.id) ?? 0;
    const isWaiting = needsAirborne && waited > 0 && waited < (phase.waitForAirborne ?? 0);

    if (!isWaiting) {
      bey.specialPhaseElapsed += deltaTime;
    }

    // Phase completion
    if (bey.specialPhaseElapsed >= totalEnd) {
      this.specialPhaseWaitElapsed.delete(bey.id);
      this.specialPhaseUsedFallback.delete(bey.id);
      bey.specialPhaseIndex++;
      bey.specialPhaseElapsed = 0;

      // Check skipCondition for NEXT phase
      const nextPhase = moveDef.phases[bey.specialPhaseIndex];
      if (nextPhase?.skipCondition) {
        const target = this.findNearestInRadius(bey, moveDef.radius);
        if (this.checkSkipCondition(nextPhase.skipCondition, target)) {
          bey.specialPhaseIndex++;
        }
      }
    }
  }

  private applyPhaseWindUpForce(bey: Beyblade, phase: SpecialMovePhase, deltaTime: number) {
    if (!phase.effects.linearImpulse) return;
    const rampTicks = Math.max(1, Math.ceil(phase.windUpMs / (1000 / 60)));
    const forcePerTick = (phase.effects.linearImpulse * deltaTime) / (phase.windUpMs || 1);
    this.physics.applyForce(
      bey.id,
      Math.cos(bey.rotation) * forcePerTick * 0.001,
      Math.sin(bey.rotation) * forcePerTick * 0.001,
    );
    // rampTicks used above implicitly via deltaTime ratio
    void rampTicks;
  }

  private applyPhaseSelfEffects(bey: Beyblade, phase: SpecialMovePhase) {
    if (phase.effects.invulnerabilityMs && !bey.isInvulnerable) {
      bey.isInvulnerable = true;
      bey.invulnerabilityTimer = phase.effects.invulnerabilityMs / 1000;
    }
    if (phase.effects.spinDelta) {
      bey.spin = Math.min(bey.maxSpin, Math.max(0, bey.spin + phase.effects.spinDelta * 0.016));
    }
    if (phase.effects.verticalImpulse && !phase.effects.knockupTarget) {
      // Apply vertical impulse once at the start of active (check flag to avoid repeat)
      if (bey.specialPhaseElapsed <= phase.windUpMs + 32) {
        bey.beyVerticalVel += phase.effects.verticalImpulse * 0.001; // px/ms
        bey.beyAirborne = bey.beyHeight > 0 || bey.beyVerticalVel > 0;
      }
    }
  }

  private applyPhaseTargetEffects(bey: Beyblade, phase: SpecialMovePhase, deltaTime: number) {
    const moveDef = SPECIAL_MOVES[bey.specialMove];
    if (!moveDef) return;

    const target = this.findNearestInRadius(bey, moveDef.radius);
    if (!target) return;

    const needsAirborne = phase.targetFlags.requiresAirborneTarget;
    const targetIsAirborne = target.beyAirborne;

    if (needsAirborne && !targetIsAirborne) {
      // Start/continue wait
      const waited = (this.specialPhaseWaitElapsed.get(bey.id) ?? 0) + deltaTime;
      this.specialPhaseWaitElapsed.set(bey.id, waited);

      if (waited < (phase.waitForAirborne ?? 0)) {
        return; // still waiting
      }
      // Wait expired: use fallback if defined
      if (phase.fallback && !this.specialPhaseUsedFallback.get(bey.id)) {
        this.specialPhaseUsedFallback.set(bey.id, true);
        const fallbackTargetOk =
          (phase.fallback.targetFlags.canHitGrounded && !targetIsAirborne) ||
          (phase.fallback.targetFlags.canHitAirborne && targetIsAirborne);
        if (fallbackTargetOk) {
          this.applyEffectsToTarget(bey, target, phase.fallback.effects);
          this.broadcast("special-phase-fallback", {
            beyId: bey.id,
            phaseId: phase.phaseId,
            fallbackLabel: phase.fallback.label,
          });
        }
      }
      return;
    }

    // Normal target flag check
    const canHit =
      (phase.targetFlags.canHitGrounded && !targetIsAirborne) ||
      (phase.targetFlags.canHitAirborne && targetIsAirborne);
    if (!canHit) return;

    // Resolve vs special interaction if target also has specialMoveActive
    if (target.specialMoveActive) {
      this.resolveSpecialVsSpecial(bey, target, phase);
    } else {
      this.applyEffectsToTarget(bey, target, phase.effects);
    }
  }

  private applyEffectsToTarget(attacker: Beyblade, target: Beyblade, effects: import("../constants/specialMoves").SpecialMovePhaseEffects) {
    if (effects.damageMultiplier) {
      const dmg = 15 * effects.damageMultiplier;
      target.health = Math.max(0, target.health - dmg);
      attacker.damageDealt += dmg;
      target.damageReceived += dmg;
    }
    if (effects.knockbackImpulse) {
      const dx = target.x - attacker.x;
      const dy = target.y - attacker.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      this.physics.applyForce(
        target.id,
        (dx / dist) * effects.knockbackImpulse * 0.00001,
        (dy / dist) * effects.knockbackImpulse * 0.00001,
      );
    }
    if (effects.knockupTarget && effects.verticalImpulse) {
      target.beyVerticalVel += effects.verticalImpulse * 0.001;
      target.beyAirborne = true;
    }
    if (effects.aoeRadiusPx) {
      // Apply to all beys in AoE radius
      this.state.beyblades.forEach(nearby => {
        if (nearby.id === attacker.id) return;
        const dx = nearby.x - attacker.x;
        const dy = nearby.y - attacker.y;
        if (Math.sqrt(dx * dx + dy * dy) > effects.aoeRadiusPx!) return;
        if (effects.knockbackImpulse) {
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          this.physics.applyForce(nearby.id, (dx / dist) * effects.knockbackImpulse * 0.000008, (dy / dist) * effects.knockbackImpulse * 0.000008);
        }
        if (effects.damageMultiplier) {
          const dmg = 12 * effects.damageMultiplier;
          nearby.health = Math.max(0, nearby.health - dmg);
          attacker.damageDealt += dmg;
          nearby.damageReceived += dmg;
        }
      });
    }
  }

  private findNearestInRadius(bey: Beyblade, radius: number): Beyblade | null {
    let nearest: Beyblade | null = null;
    let nearestDist = radius;
    this.state.beyblades.forEach(other => {
      if (other.id === bey.id || !other.isActive) return;
      const dx = other.x - bey.x;
      const dy = other.y - bey.y;
      const dz = other.beyHeight - bey.beyHeight;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = other;
      }
    });
    return nearest;
  }

  private checkSkipCondition(
    cond: "target_already_airborne" | "target_grounded",
    target: Beyblade | null,
  ): boolean {
    if (!target) return false;
    if (cond === "target_already_airborne") return target.beyAirborne;
    if (cond === "target_grounded") return !target.beyAirborne;
    return false;
  }

  // ─── Phase 29: Aerial clash detection ───────────────────────────────────────

  private detectAerialClash() {
    const beys = Array.from(this.state.beyblades.values()).filter(
      b => b.isActive && b.beyAirborne && b.specialMoveActive,
    );
    for (let i = 0; i < beys.length; i++) {
      for (let j = i + 1; j < beys.length; j++) {
        const b1 = beys[i];
        const b2 = beys[j];
        const moveDef1 = SPECIAL_MOVES[b1.specialMove];
        const moveDef2 = SPECIAL_MOVES[b2.specialMove];
        if (!moveDef1 || !moveDef2) continue;

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dz = b2.beyHeight - b1.beyHeight;
        const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const clashRadius = Math.min(moveDef1.radius, moveDef2.radius);

        if (dist3D <= clashRadius) {
          this.triggerAerialClash(b1, b2);
        }
      }
    }
  }

  private triggerAerialClash(b1: Beyblade, b2: Beyblade) {
    const phase1 = SPECIAL_MOVES[b1.specialMove]?.phases[b1.specialPhaseIndex];
    const phase2 = SPECIAL_MOVES[b2.specialMove]?.phases[b2.specialPhaseIndex];

    const mult1 = phase1?.effects.damageMultiplier ?? 1.0;
    const mult2 = phase2?.effects.damageMultiplier ?? 1.0;

    // Cross-damage: each deals their phase multiplier to the other
    const dmg1to2 = 15 * mult1;
    const dmg2to1 = 15 * mult2;

    if (!b1.isInvulnerable) {
      b1.health = Math.max(0, b1.health - dmg2to1);
      b1.damageReceived += dmg2to1;
    }
    if (!b2.isInvulnerable) {
      b2.health = Math.max(0, b2.health - dmg1to2);
      b2.damageReceived += dmg1to2;
    }
    b1.damageDealt += dmg1to2;
    b2.damageDealt += dmg2to1;

    // Fling both in opposite directions; higher mult wins momentum
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const winner = mult1 >= mult2 ? b1 : b2;
    const loser  = winner === b1 ? b2 : b1;
    const winnerForce = 0.00008;
    const loserForce  = 0.00015;
    // Winner pushes through; loser is flung back harder
    this.physics.applyForce(winner.id,  (dx / dist) * winnerForce, (dy / dist) * winnerForce);
    this.physics.applyForce(loser.id,  -(dx / dist) * loserForce, -(dy / dist) * loserForce);

    // Both land after the recoil arc
    b1.beyAirborne = false;
    b1.beyHeight = 0;
    b1.beyVerticalVel = 0;
    b2.beyAirborne = false;
    b2.beyHeight = 0;
    b2.beyVerticalVel = 0;

    // End both specials
    b1.specialMoveActive = false;
    b1.specialPhaseIndex = 0;
    b1.specialPhaseElapsed = 0;
    b1.specialPhaseSubState = "";
    b2.specialMoveActive = false;
    b2.specialPhaseIndex = 0;
    b2.specialPhaseElapsed = 0;
    b2.specialPhaseSubState = "";

    const contactPoint = { x: (b1.x + b2.x) / 2, y: (b1.y + b2.y) / 2 };
    this.broadcast("aerial-clash", {
      bey1Id: b1.id,
      bey2Id: b2.id,
      contactPoint3D: { x: contactPoint.x, y: contactPoint.y, z: (b1.beyHeight + b2.beyHeight) / 2 },
    });
    this.broadcast("split-screen-cinematic", {
      participants: [
        { beyId: b1.id, specialMove: b1.specialMove, displayName: b1.username },
        { beyId: b2.id, specialMove: b2.specialMove, displayName: b2.username },
      ],
    });

    // Short delay then end split screen (aerial clash is resolved)
    setTimeout(() => this.broadcast("split-screen-end", {}), 1500);
  }

  private resolveSpecialVsSpecial(attBey: Beyblade, defBey: Beyblade, attPhase: SpecialMovePhase) {
    const attMoveDef = SPECIAL_MOVES[attBey.specialMove];
    const defMoveDef = SPECIAL_MOVES[defBey.specialMove];
    if (!attMoveDef || !defMoveDef) return;

    const attGroup = attMoveDef.group;
    const defGroup = defMoveDef.group;
    const lookupKey = `${attGroup}:${defGroup}`;

    const interaction = this.specialInteractionCache.get(lookupKey) ?? DEFAULT_CLASH_OUTCOME;
    const defPhase = defMoveDef.phases[defBey.specialPhaseIndex];

    // Check timing bonus
    const attPeakMs = attPhase.peakMs ?? attPhase.durationMs / 2;
    const attElapsedInActive = attBey.specialPhaseElapsed - attPhase.windUpMs;
    const attAtPeak = Math.abs(attElapsedInActive - attPeakMs) <= (attPhase.peakToleranceMs ?? 100);

    let defAtPeak = false;
    if (defPhase) {
      const defPeakMs = defPhase.peakMs ?? defPhase.durationMs / 2;
      const defElapsedInActive = defBey.specialPhaseElapsed - defPhase.windUpMs;
      defAtPeak = Math.abs(defElapsedInActive - defPeakMs) <= (defPhase.peakToleranceMs ?? 100);
    }

    let attackerScale = interaction.attackerDamageScale;
    let defenderScale = interaction.defenderDamageScale;

    if (interaction.timingBonus) {
      const { peakFor, bonusScale } = interaction.timingBonus;
      if ((peakFor === "attacker" || peakFor === "both") && attAtPeak) attackerScale *= bonusScale;
      if ((peakFor === "defender" || peakFor === "both") && defAtPeak) defenderScale *= bonusScale;
    }

    const attDmg = 15 * (attPhase.effects.damageMultiplier ?? 1.0) * attackerScale;
    const defDmg = defPhase ? 15 * (defPhase.effects.damageMultiplier ?? 1.0) * defenderScale : 0;

    if (!defBey.isInvulnerable) {
      defBey.health = Math.max(0, defBey.health - attDmg);
      defBey.damageReceived += attDmg;
    }
    attBey.damageDealt += attDmg;

    if (!attBey.isInvulnerable) {
      attBey.health = Math.max(0, attBey.health - defDmg);
      attBey.damageReceived += defDmg;
    }
    defBey.damageDealt += defDmg;

    this.broadcast("special-interaction-result", {
      key: lookupKey,
      attAtPeak,
      defAtPeak,
      attackerScale,
      defenderScale,
    });

    // Trigger split-screen if ground clash
    if (!attBey.beyAirborne && !defBey.beyAirborne) {
      this.broadcast("split-screen-cinematic", {
        participants: [
          { beyId: attBey.id, specialMove: attBey.specialMove, displayName: attBey.username },
          { beyId: defBey.id, specialMove: defBey.specialMove, displayName: defBey.username },
        ],
      });
    }

    // Fire-and-forget Firestore write
    const db = getFirestoreDb();
    if (db) {
      db.collection("special_clash_events").add({
        matchId: (this.state as any).matchId ?? this.roomId,
        roomId: this.roomId,
        attackerBeyId: attBey.id,
        defenderBeyId: defBey.id,
        interactionKey: lookupKey,
        attackerGroup: attGroup,
        defenderGroup: defGroup,
        attackerKind: attMoveDef.kind,
        defenderKind: defMoveDef.kind,
        attackerScale,
        defenderScale,
        attAtPeak,
        defAtPeak,
        timingBonusApplied: !!(interaction.timingBonus && (attAtPeak || defAtPeak)),
        timestamp: Date.now(),
      }).catch((e: unknown) => console.warn("special_clash_events write failed", e));
    }
  }

  // ─── Phase 29: Special move with QTE multiplier ───────────────────────────────

  private handleSpecialMoveWithMultiplier(bey: Beyblade, multiplier: number) {
    const moveDef = SPECIAL_MOVES[bey.specialMove];
    if (!moveDef) return;

    bey.specialMoveActive = true;
    bey.specialPhaseIndex = 0;
    bey.specialPhaseElapsed = 0;
    bey.specialPhaseSubState = "windup";
    bey.specialMoveEndTime = Date.now() + totalMoveDurationMs(moveDef) * multiplier;
    bey.controlLockedUntilMs = Math.max(bey.controlLockedUntilMs, bey.specialMoveEndTime);
    bey.controlLockSource = "special";

    this.broadcast("special-move-camera", {
      beyId: bey.id,
      finalMultiplier: multiplier,
      cameraConfig: { followTarget: bey.id, zoomIn: true, durationMs: totalMoveDurationMs(moveDef) },
    });
  }

  // ─── Control-loss immunity ───────────────────────────────────────────────────

  private _grantControlLossImmunity(sessionId: string, linkId: string): void {
    const IMMUNITY_TICKS = 30 * 60; // 30 seconds at 60 Hz
    this.controlLossImmunity.set(sessionId, this.tickCounter + IMMUNITY_TICKS);
    this.activeControlLoss.delete(sessionId);
    // Break any hostile stacks that apply control_loss to this bey
    for (const [stackKey, stackState] of this.beyStackState) {
      const [, sidB] = stackKey.split(":");
      if (sidB === sessionId && stackState.linkId === linkId) {
        this.beyStackState.delete(stackKey);
        const [sidA] = stackKey.split(":");
        this.broadcast("bey-stack-end", { beyIdA: sidA, beyIdB: sidB, linkId, reason: "control_recovered" });
      }
    }
    const victimClient = this.clients.find(c => c.sessionId === sessionId);
    victimClient?.send("bey-link-control-recovered", {
      sessionId,
      immunityTicks: IMMUNITY_TICKS,
    });
    this.broadcast("bey-link-control-immunity-start", { sessionId, immunityTicks: IMMUNITY_TICKS });
  }

  // ─── Hijack execution ────────────────────────────────────────────────────────

  /**
   * Execute a successful hijack: remove the original stack, insert a reversed
   * stack so the former victim (sidB) now acts as sidA (initiator/controller),
   * and set cooldowns on both beys.
   */
  private _executeHijack(stackKey: string, linkId: string, sidA: string, sidB: string): void {
    this.beyStackState.delete(stackKey);
    this.pendingBeyLinkQTE.delete(sidB);

    const hijackedKey = `${sidB}:${sidA}:${linkId}`;
    this.beyStackState.set(hijackedKey, { partnerId: sidA, linkId, tickCount: 0 });

    // Rigid formation offsets no longer apply to the reversed pair
    this.rigidFormationOffset.delete(`rigid:${sidA}`);
    this.rigidFormationOffset.delete(`rigid:${sidB}`);

    const beyLinks = (this.arenaCache as any)?.beyLinks as BeyLink[] | undefined;
    const link = beyLinks?.find(l => l.id === linkId);
    const cooldownTicks = link?.hijackCooldownTicks ?? 180;

    for (const sid of [sidA, sidB]) {
      const cmap = this.hijackCooldowns.get(sid) ?? new Map<string, number>();
      cmap.set(linkId, cooldownTicks);
      this.hijackCooldowns.set(sid, cmap);
    }

    this.broadcast("bey-link-hijacked", {
      newControllerId: sidB,
      newVictimId: sidA,
      linkId,
      stackKey: hijackedKey,
    });
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

  // ─── Subclass hooks ─────────────────────────────────────────────────────────

  /**
   * #27: Called when a burst is about to occur. Subclasses may override to intercept
   * (e.g. TeamBattleRoom burst recall). Return true to mark the burst as "consumed"
   * (the default burst elimination will not run). Return false (default) to proceed.
   */
  protected onBurstOccurred(_victim: Beyblade, _attacker: Beyblade): boolean { return false; }

  // ─── Game tick ───────────────────────────────────────────────────────────────

  protected tick(deltaTime: number) {
    if (this.state.status === "in-progress" && Date.now() - this.lastInputTime > 60_000) {
      this.broadcast("idle-disconnect", {});
      this.disconnect();
      return;
    }

    const dt = deltaTime / 1000;

    // Server-authoritative arena rotation (Phase 14 review).
    advanceArenaRotation(this.state.arena, dt);
    advanceArenaTilt(this.state.arena, dt);
    if (this.state.arena.tiltMode === "weight") {
      const cx = (this.state.arena.width  * 16) / 2;
      const cy = (this.state.arena.height * 16) / 2;
      const r  = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
      applyWeightTilt(this.state.arena, this.state.beyblades, cx, cy, r);
    }

    if (this.tickWarmupPhase(dt)) return;
    if (this.state.status === "warmup") return;

    if (this.tickLaunchPhase(dt)) {
      this.startMatchFromLaunch();
      return;
    }
    if (this.state.status === "launching") return;

    if (this.state.status !== "in-progress") return;

    // Phase T: arena timeline events
    this.matchElapsedMs += deltaTime;
    this.tickArenaTimeline();

    // Phase V: arena shrink
    if (this.shrinkEnabled) this.tickArenaShrink();

    // Phase AA: expire arena-wide effects + turret dispatch
    this.tickArenaEffects(Date.now(), deltaTime);

    // B3 / G1-G3: jump physics
    this.tickJumpStates(deltaTime);

    // I4: arena bey spawns
    this.tickArenaSpawns(deltaTime);

    this.tickCounter++;
    this.ghostTickCounter++;

    // #28: Replay recording at ~20Hz (every 3 ticks at 60Hz)
    if (this.replayRecorder && this.tickCounter % 3 === 0) {
      this.replayRecorder.recordFrame(this.state.beyblades as unknown as Map<string, {
        x: number; y: number; angle: number; spin: number;
        tiltAngle?: number; isActive: boolean;
      }>);
    }

    // Phase 27: populate beyGhosts at 10Hz (every 6 ticks at 60Hz)
    if (this.ghostTickCounter >= 6) {
      this.ghostTickCounter = 0;
      this.populateBeyGhosts();
    }
    // L2/L3: arena link crossing detection
    this.tickArenaLinks(deltaTime);
    this.tickBeyLinks(deltaTime);

    this.physics.update(deltaTime);

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    const arenaData = this.arenaCache;
    const beybladeIds = Array.from(this.state.beyblades.keys());

    // Phase 29: airborne Z-axis physics tick (all beys every tick)
    this.tickAirbornePhysics(deltaTime);

    // Phase 29: multi-phase special move tick (each special-active bey)
    this.state.beyblades.forEach(bey => {
      if (bey.specialMoveActive && bey.isActive) this.tickSpecialPhase(bey, deltaTime);
    });

    // Phase 29: aerial clash detection (after individual phase ticks)
    this.detectAerialClash();

    // ── Beyblade-vs-beyblade collision detection ────────────────────────────
    // Reset per-tick trigger context sets before processing collisions/bursts
    this.physicalContactThisTick.clear();
    this.beyHitsThisTick.clear();
    this.burstAttemptsThisTick.clear();
    for (let i = 0; i < beybladeIds.length; i++) {
      for (let j = i + 1; j < beybladeIds.length; j++) {
        const id1 = beybladeIds[i];
        const id2 = beybladeIds[j];
        const b1 = this.state.beyblades.get(id1);
        const b2 = this.state.beyblades.get(id2);

        if (!b1 || !b2 || !b1.isActive || !b2.isActive) continue;

        // S2 — distance pre-filter: skip pair if beys are too far apart to collide.
        // Only applied in royale (>4 active beys) where O(n²) pairs dominate the tick budget.
        if (beybladeIds.length > 4) {
          const dx = b1.x - b2.x;
          const dy = b1.y - b2.y;
          const minContactDist = (b1.radius + b2.radius) * 24 * 2.5;
          if (dx * dx + dy * dy > minContactDist * minContactDist) continue;
        }

        // #10: Lag compensation — check if collision would register at rewound attacker time.
        // We use the b1 player's ping to determine how many ticks back to look.
        // If the rewound check fails but the current check would succeed, we still proceed
        // (lag-comp only helps register missed hits, not create false ones).
        const b1PingMs = this.clientPingMs.get(id1) ?? 0;
        const lagTicks = Math.round(b1PingMs / (1000 / 60));
        if (lagTicks > 0) {
          const lagHit = this.physics.checkLagCompensatedCollision(id1, id2, lagTicks);
          if (!lagHit) {
            // Double-check current state: if also no current collision, skip
            const currentCollision = this.physics.checkBeybladeCollision(id1, id2);
            if (!currentCollision) continue;
          }
        }

        const collision = this.physics.checkBeybladeCollision(id1, id2);
        if (!collision) continue;

        // ── Phasing: skip all collision response for ghosting beys ───────────
        if (b1.phasesBeys || b2.phasesBeys) continue;

        // ── Friendly collision: same team + friendly flag → recoil only ──────
        const isFriendly = b1.teamId !== "" && b1.teamId === b2.teamId &&
          (b1.friendlyCollisionEnabled || b2.friendlyCollisionEnabled) &&
          !this.state.arena.arenaFriendlyFireEnabled;
        if (isFriendly) {
          // Matter.js already applied the physical bounce; just track the hit
          b1.collisions++;
          b2.collisions++;
          this.broadcast("friendly-collision", { id1, id2, contactPoint: collision.contactPoint });
          continue;
        }

        // ── Phase 24 collision tiers 0–3 ────────────────────────────────────────
        // Tier 0 (<150): graze — no QTE, reduced effects
        // Tier 1 (150–400): normal hit
        // Tier 2 (400–700): heavy hit — stun window 80 ms
        // Tier 3 (>700): clash — triggers a QTE lock (clashQTEActive) for up to 1.5s
        const relSpeed = Math.sqrt(
          collision.relativeVelocity.x ** 2 + collision.relativeVelocity.y ** 2,
        );
        const collisionTier =
          relSpeed < 150 ? 0 :
          relSpeed < 400 ? 1 :
          relSpeed < 700 ? 2 : 3;

        if (collisionTier === 2) {
          // 80 ms AI-stun for both beys (suppresses natural force in NaturalMotion)
          const STUN_MS = 80;
          b1.stunTimer = Math.max(b1.stunTimer, STUN_MS / 1000);
          b2.stunTimer = Math.max(b2.stunTimer, STUN_MS / 1000);
        } else if (collisionTier === 3) {
          // Clash QTE: lock both beys' control authority for up to 1.5s
          const CLASH_S = 1.5;
          b1.clashQTEActive = true;
          b1.clashQTETimer  = CLASH_S;
          b2.clashQTEActive = true;
          b2.clashQTETimer  = CLASH_S;
          this.broadcast("clash-qte-start", { id1, id2, duration: CLASH_S });

          // ── Perfect Clash Timing Ring (Mario & Luigi GBA) ──────────────────
          // Open a 300ms window; pressing any action key (clashBoostTicks > 0)
          // during the window grants a comboDamageMultiplier bonus.
          b1.clashTimingWindowOpen = true;
          b2.clashTimingWindowOpen = true;
          this.broadcast("clash-timing-start", { id1, id2, windowMs: 300 });
          setTimeout(() => this.resolveClashTiming(id1, id2), 300);
        }

        const dmg = this.physics.calculateCollisionDamage(collision, b1, b2);

        // Element type effectiveness — uses Firestore-backed matrix when available
        const b1Elems = Array.from(b1.elementTypes ?? []) as string[];
        const b2Elems = Array.from(b2.elementTypes ?? []) as string[];
        const mat = this.elementTypeMatrix?.matrix ?? {};
        const typeMultB1vsB2 = computeDynamicTypeMultiplier(mat, b1Elems, b2Elems);
        const typeMultB2vsB1 = computeDynamicTypeMultiplier(mat, b2Elems, b1Elems);

        // Arena-wide damage multipliers
        const arenaMult = this.state.arena.arenaBeyDamageMult;

        // ── Directional Stance Damage Modifiers (For Honor) ───────────────────
        const STANCE_TABLE: Record<string, { dmgOut: number; dmgIn: number }> = {
          aggressive: { dmgOut: 1.15, dmgIn: 1.15 },
          defensive:  { dmgOut: 0.90, dmgIn: 0.80 },
          stamina:    { dmgOut: 0.95, dmgIn: 1.00 },
          "":         { dmgOut: 1.00, dmgIn: 1.00 },
        };
        const s1 = STANCE_TABLE[b1.activeStance ?? ""] ?? STANCE_TABLE[""];
        const s2 = STANCE_TABLE[b2.activeStance ?? ""] ?? STANCE_TABLE[""];
        const stanceMult1 = s1.dmgOut * s2.dmgIn;   // b2 hits b1
        const stanceMult2 = s2.dmgOut * s1.dmgIn;   // b1 hits b2

        // Damage immunity: permanent flag or active i-frames both zero incoming damage
        const b1DmgImmune = b1.damageImmune || b1.isInvulnerable;
        const b2DmgImmune = b2.damageImmune || b2.isInvulnerable;

        // #22: Gimmick Loaded Mode — ×1.5 outgoing damage when gimmickLoadedMode is charged.
        // damage1 is received by b1 (b2 is attacker) → b2's loaded mode amplifies it.
        // damage2 is received by b2 (b1 is attacker) → b1's loaded mode amplifies it.
        const gimmickLoadMult1 = b1.gimmickLoadedMode ? 1.5 : 1.0; // b1 loaded: boosts damage TO b2
        const gimmickLoadMult2 = b2.gimmickLoadedMode ? 1.5 : 1.0; // b2 loaded: boosts damage TO b1
        if (b1.gimmickLoadedMode) { b1.gimmickLoadedMode = false; this.broadcast("gimmick-mode-changed", { beyId: id1, loaded: false }); }
        if (b2.gimmickLoadedMode) { b2.gimmickLoadedMode = false; this.broadcast("gimmick-mode-changed", { beyId: id2, loaded: false }); }

        // #23: Team support damage reduction — reduces incoming damage when a teammate is nearby
        const supportReduct1 = 1 - (b1._supportDmgReduction ?? 0);
        const supportReduct2 = 1 - (b2._supportDmgReduction ?? 0);

        const effDmg1 = b1DmgImmune ? 0 : dmg.damage1 * typeMultB2vsB1 * arenaMult * stanceMult1 * gimmickLoadMult2 * supportReduct1;
        const effDmg2 = b2DmgImmune ? 0 : dmg.damage2 * typeMultB1vsB2 * arenaMult * stanceMult2 * gimmickLoadMult1 * supportReduct2;
        const effSS1  = b1DmgImmune ? 0 : dmg.spinSteal1 * typeMultB1vsB2;
        const effSS2  = b2DmgImmune ? 0 : dmg.spinSteal2 * typeMultB2vsB1;

        // Phase 29: track physical contact for this tick (needed for QTE block gating)
        const pairKey = id1 < id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
        this.physicalContactThisTick.add(pairKey);

        // Always count collision
        b1.collisions++;
        b2.collisions++;

        // Phase 29: Collision QTE — hold damage when both grounded + combined ≥ threshold
        const bothGrounded = !b1.beyAirborne && !b2.beyAirborne;
        const combinedDmg = effDmg1 + effDmg2;
        const qteOnCooldown = (this.collisionQTECooldowns.get(pairKey) ?? 0) > Date.now();
        const qteAlreadyActive = this.activeCollisionQTEs.has(pairKey);

        if (
          bothGrounded &&
          combinedDmg >= BattleRoom.COLLISION_QTE_MIN_DAMAGE &&
          !qteOnCooldown &&
          !qteAlreadyActive &&
          !b1.collisionQTEActive &&
          !b2.collisionQTEActive &&
          !b1.specialMoveActive &&
          !b2.specialMoveActive
        ) {
          this.startCollisionQTE(id1, id2, effDmg1, effDmg2, effSS1, effSS2);
        } else {
          // Apply damage immediately (aerial hit or no-QTE path)
          const aerialFactor = bothGrounded ? 1.0 : BattleRoom.AERIAL_HIT_DAMAGE_FACTOR;
          const applyD1 = effDmg1 * aerialFactor;
          const applyD2 = effDmg2 * aerialFactor;

          b1.health = Math.max(0, b1.health - applyD1);
          b2.health = Math.max(0, b2.health - applyD2);
          b1.spin = Math.max(0, b1.spin - effSS2);
          b2.spin = Math.max(0, b2.spin - effSS1);
          if (applyD1 > 0) this.beyHitsThisTick.add(id1);
          if (applyD2 > 0) this.beyHitsThisTick.add(id2);
          b1.damageDealt += applyD2;
          b2.damageDealt += applyD1;
          b1.damageReceived += applyD1;
          b2.damageReceived += applyD2;
          b1.power = Math.min(100, b1.power + (applyD2 > 0 ? 0.5 : 0) + (applyD1 > 0 ? 0.3 : 0));
          b2.power = Math.min(100, b2.power + (applyD1 > 0 ? 0.5 : 0) + (applyD2 > 0 ? 0.3 : 0));
          if (applyD1 > 15) b1.attackBuffTimer = 0;
          if (applyD2 > 15) b2.attackBuffTimer = 0;

          // ── Fury Gauge (Advance Wars CO Power) — fills from incoming damage ──
          const prevFury1 = b1.furyGauge;
          const prevFury2 = b2.furyGauge;
          b1.furyGauge = Math.min(100, b1.furyGauge + applyD1 * 0.8);
          b2.furyGauge = Math.min(100, b2.furyGauge + applyD2 * 0.8);
          if (prevFury1 < 100 && b1.furyGauge >= 100) this.broadcast("fury-ready", { beyId: id1 });
          if (prevFury2 < 100 && b2.furyGauge >= 100) this.broadcast("fury-ready", { beyId: id2 });
        }

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
          stance1: b1.activeStance,
          stance2: b2.activeStance,
        });

        // 2.5D hook: PartSystemManager picks this up to fire SubPart switches,
        // bearing friction, hop impulse, detachment, on_hit_* events.
        const impactForce = Math.max(effDmg1, effDmg2);
        this.onBeyCollided(id1, id2, impactForce);

        // ── Status on Type-Effective Collision (40% chance when typeMultiplier > 1) ──
        const STATUS_BY_ELEMENT: Record<string, { status: string; duration: number }> = {
          fire: { status: "burning", duration: 5 }, lava: { status: "burning", duration: 5 },
          ice: { status: "frozen", duration: 3 },
          electric: { status: "paralyzed", duration: 4 }, lightning: { status: "paralyzed", duration: 4 },
          acid: { status: "corroded", duration: 8 },
          void: { status: "confused", duration: 3 }, dark: { status: "confused", duration: 3 },
        };
        const applyElementStatus = (victim: Beyblade, attackerElems: string[], mult: number) => {
          if (mult <= 1.0 || victim.statusEffect || this.rand() > 0.4) return;
          for (const elem of attackerElems) {
            const statusDef = STATUS_BY_ELEMENT[elem];
            if (statusDef) {
              victim.statusEffect = statusDef.status;
              victim.statusTimer = statusDef.duration;
              this.broadcast("status-applied", { beyId: victim.id, status: statusDef.status, durationS: statusDef.duration });
              break;
            }
          }
        };
        applyElementStatus(b1, b2Elems, typeMultB2vsB1);
        applyElementStatus(b2, b1Elems, typeMultB1vsB2);

        // ── Burst chance (Phase R) ────────────────────────────────────────────
        // Check both beys: the one that received higher damage may burst.
        const BURST_THRESHOLD = 40;
        for (const [victim, incomingDmg] of [[b1, effDmg1], [b2, effDmg2]] as [Beyblade, number][]) {
          if (!victim.isActive) continue;
          if (incomingDmg < BURST_THRESHOLD) continue;
          if (victim.burstImmune || victim.knockoutImmune) continue;
          // Track burst attempt BEFORE the roll so on_burst_attempt can react this same tick
          this.burstAttemptsThisTick.add(victim.id);
          const spinRatioV = victim.maxSpin > 0 ? victim.spin / victim.maxSpin : 0;
          const burstRaw = Math.max(0, incomingDmg - BURST_THRESHOLD) * 0.005;
          const burstSpinMod = 1 + (1 - spinRatioV) * 2.0;
          const burstResist = Math.max(0, Math.min(100, victim.burstResistance ?? 50));
          const burstFinal = burstRaw * burstSpinMod * (1 - burstResist / 100);
          if (this.rand() < burstFinal) {
            const attacker = victim === b1 ? b2 : b1;
            attacker.burstKillsDealt++;
            // Allow subclasses to intercept burst (e.g. TeamBattleRoom burst recall)
            const consumed = this.onBurstOccurred(victim, attacker);
            if (!consumed) {
              victim.isActive = false;
              victim.isBurst = true;
              victim.eliminationType = "burst";
              victim.spin = 0;
              this.broadcast("burst", { beyId: victim.id, attackerId: attacker.id, x: victim.x, y: victim.y });
              // #28: Record burst event + broadcast killcam
              this.replayRecorder?.recordEvent("burst", { beyId: victim.id, killerId: attacker.id });
              const killcamFrames = this.replayRecorder?.getLastNSeconds(5) ?? [];
              if (killcamFrames.length > 0) {
                this.broadcast("death-replay", { frames: killcamFrames, victimId: victim.id, killerId: attacker.id });
              }
            }
          }
        }
      }
    }

    // ── Reactive combos (trigger-based, Phase W) ─────────────────────────────
    this.tickReactiveCombos(Date.now());

    // ── Per-beyblade update ──────────────────────────────────────────────────
    this.state.beyblades.forEach((beyblade) => {
      // #15: Physics LOD — classify bey into tier and skip expensive updates on low-priority beys.
      // Tier 0 (active, spin ≥ 20%): full 60Hz — every tick.
      // Tier 1 (active, spin < 20%): 30Hz — skip odd ticks.
      // Tier 2 (eliminated / in pit): 15Hz — only every 4th tick.
      {
        const spinFracLod = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
        const newTier: 0 | 1 | 2 =
          !beyblade.isActive || beyblade.inPit ? 2 :
          spinFracLod < 0.20 ? 1 : 0;
        beyblade.lodTier = newTier;
        const divisor = newTier === 0 ? 1 : newTier === 1 ? 2 : 4;
        // Matter.js physics always runs; only non-physics state updates are gated.
        if (divisor > 1 && this.tickCounter % divisor !== 0) return;
      }

      const physicsState = this.physics.getBodyState(beyblade.id);
      if (!physicsState) return;

      beyblade.x = physicsState.x;
      beyblade.y = physicsState.y;
      beyblade.rotation = physicsState.rotation;
      beyblade.velocityX = physicsState.velocityX;
      beyblade.velocityY = physicsState.velocityY;
      beyblade.angularVelocity = physicsState.angularVelocity;

      if (arenaData) {
        const prevStatusEffect = beyblade.statusEffect;
        const events = processArenaFeatures(
          beyblade,
          arenaData,
          this.state.arena,
          dt,
          this.physics,
          this.rand,
          undefined,
          this.elementTypeMatrix?.zoneImmunities,
        );
        if (events.obstacleHit) this.broadcast("obstacle-collision", events.obstacleHit);
        if (events.wallHit) this.broadcast("wall-collision", events.wallHit);
        // Broadcast status-applied when a new status condition is applied via hazard
        if (!prevStatusEffect && beyblade.statusEffect) {
          this.broadcast("status-applied", { beyId: beyblade.id, status: beyblade.statusEffect, durationS: beyblade.statusTimer });
        }

        // #24: Boost pads
        if (arenaData?.boostPads?.length) {
          processBoostPads(beyblade, arenaData.boostPads, this.boostPadCooldowns, this.physics, this.broadcast.bind(this));
        }
      }

      // Natural gyroscopic motion: orbit layer + momentum continuation + attitude bias
      // + spin stabilisation + death spiral. Replaces the simple nutation wobble.
      {
        const cx = (this.state.arena.width  * 16) / 2;
        const cy = (this.state.arena.height * 16) / 2;
        const lastInput = this.lastPlayerInput.get(beyblade.id);
        const attitude = lastInput?.attitudeAggressive ? "aggressive" as const
          : lastInput?.attitudeDefensive ? "defensive" as const
          : lastInput?.attitudeStamina   ? "stamina"   as const
          : null;
        const opponents: Beyblade[] = [];
        this.state.beyblades.forEach((other) => {
          if (other.id !== beyblade.id && other.isActive) opponents.push(other);
        });
        const natForce = computeNaturalForce(
          beyblade, cx, cy,
          attitude,
          opponents,
          beyblade.stunTimer > 0,
          {}, // DecisionBias — BeyDecision mechanic applies its own forces via MechanicRegistry
          false,
        );
        this.physics.applyForce(beyblade.id, natForce.fx, natForce.fy);
      }

      // Arena tilt: apply lateral gravity force toward the downhill side
      if (this.state.arena.tiltAngle !== 0) {
        const { fx, fy } = computeTiltForce(this.state.arena.tiltAngle, this.state.arena.tiltDirection, beyblade.mass);
        this.physics.applyForce(beyblade.id, fx, fy);
      }

      // #22: Gimmick mechanic passive tick — dispatch passive() for each loaded mechanic.
      // Skip passive dispatch while gimmickLoadedMode is true (charge accumulation instead).
      if (!beyblade.gimmickLoadedMode && beyblade.mechanics.length > 0) {
        const mechCtx: MechanicContext = {
          bey: beyblade,
          dt,
          applyForce: this.physics.applyForce.bind(this.physics),
          applyKnockback: (id, dir, dist) => { this.physics.applyForce(id, dir.x * dist * 0.001, dir.y * dist * 0.001); },
          setVelocity: undefined,
          getPosition: (id) => {
            const b = this.state.beyblades.get(id);
            return b ? { x: b.x, y: b.y } : null;
          },
        };
        for (const mechInst of beyblade.mechanics) {
          if (!mechInst.active) continue;
          const handler = getMechanic(mechInst.type);
          if (!handler?.passive) continue;
          let params: Record<string, unknown> = {};
          let state: Record<string, unknown> = {};
          try { params = JSON.parse(mechInst.params); } catch { /* skip */ }
          try { state = JSON.parse(mechInst.state); } catch { /* skip */ }
          handler.passive(mechCtx, params);
          // Persist state changes back if handler mutated the state object
          mechInst.state = JSON.stringify(state);
        }
      }

      {
        const spinRatio = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
        const slopeCx = (this.state.arena.width * 16) / 2;
        const slopeCy = (this.state.arena.height * 16) / 2;
        const slopeR  = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
        const radialDist = Math.hypot(beyblade.x - slopeCx, beyblade.y - slopeCy);
        const floorAngle = getFloorAngleAtRadius(radialDist, slopeR, this.state.arena.wallAngle);
        const slopeFactor = Math.max(0.5, Math.cos(floorAngle));

        // Stamina stance: reduce spin decay by 20% while held
        const stanceDecayMod = beyblade.activeStance === "stamina" ? 0.80 : 1.0;
        // Bit-Beast active: halve spin decay while special is active
        const bitBeastDecayMod = beyblade.bitBeastActive ? 0.5 : 1.0;
        const decayThisTick = beyblade.spinDecayRate * dt * (1 + (1 - spinRatio) * 0.5) * slopeFactor * stanceDecayMod * bitBeastDecayMod;
        beyblade.spin = Math.max(0, beyblade.spin - decayThisTick);

        // ── Status Effect Tick (Pokémon GBA/NDS) ──────────────────────────────
        if (beyblade.statusTimer > 0 && beyblade.statusEffect) {
          switch (beyblade.statusEffect) {
            case "burning":
              beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * 0.20 * dt);
              break;
            case "frozen":
              beyblade.controlAuthority = Math.max(0, beyblade.controlAuthority - 40);
              break;
            case "paralyzed":
              // 30% chance per tick to skip directional force — handled in NaturalMotion / InputHandler by checking statusEffect
              break;
            case "corroded":
              beyblade.damageReduction = Math.max(0.1, beyblade.damageReduction - 0.25 * dt);
              break;
            case "confused":
              // 20% chance to invert control — handled in applyMovementInput by checking statusEffect
              break;
          }
          beyblade.statusTimer -= dt;
          if (beyblade.statusTimer <= 0) {
            beyblade.statusTimer = 0;
            beyblade.statusEffect = "";
          }
        }

        // ── Desperation Spin Recovery — Catch-Up (Mario Kart DS) ──────────────
        const spinFrac = beyblade.spin / (beyblade.maxSpin || 1);
        if (spinFrac < 0.15 && beyblade.isActive) {
          const desperationRegen = ((0.15 - spinFrac) / 0.15) * 2.0;
          beyblade.spin = Math.min(beyblade.maxSpin * 0.18, beyblade.spin + desperationRegen * dt);
          if (!beyblade.desperationFired) {
            beyblade.desperationFired = true;
            this.broadcast("desperation-active", { beyId: beyblade.id });
          }
        } else if (spinFrac >= 0.18) {
          beyblade.desperationFired = false;
        }
      }
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      if (beyblade.spin <= 0 && beyblade.isActive && !beyblade.spinOutImmune && !beyblade.knockoutImmune) {
        // #21: on_proc accessory — survive one lethal spin-out (e.g. spin_sash), checked synchronously from cache
        const sessionId = [...this.playerSessions].find(sid => this.state.beyblades.get(sid)?.id === beyblade.id) ?? "";
        const acc = this.accessoryCache.get(sessionId);
        let procSaved = false;
        if (acc?.effectType === "on_proc" && (acc.procChance ?? 0) > 0) {
          if (Math.random() < (acc.procChance ?? 0)) {
            beyblade.spin = beyblade.maxSpin * 0.10;
            beyblade.spinOutImmune = true;
            setTimeout(() => { beyblade.spinOutImmune = false; }, 3000);
            this.broadcast("accessory-activated", { beyId: beyblade.id, accessoryId: acc.id });
            procSaved = true;
          }
        }
        if (!procSaved) {
          beyblade.isActive = false;
          beyblade.health = 0;
          beyblade.eliminationType = "spin_out";
          this.broadcast("spin-out", { playerId: beyblade.id, username: beyblade.username, x: beyblade.x, y: beyblade.y, type: beyblade.type });
          // #28: Record spin-out + killcam
          this.replayRecorder?.recordEvent("spinout", { beyId: beyblade.id });
          const killcamFrames = this.replayRecorder?.getLastNSeconds(5) ?? [];
          if (killcamFrames.length > 0) {
            this.broadcast("death-replay", { frames: killcamFrames, victimId: beyblade.id, killerId: null });
          }
        }
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
        // ── Bit-Beast hook cleanup ──────────────────────────────────────────
        if (beyblade.bitBeastActive) {
          beyblade.bitBeastActive = false;
          beyblade.contactDamageMultiplier = Math.max(1.0, (beyblade.contactDamageMultiplier ?? 1.1) / 1.10);
          this.broadcast("bitbeast-hide", { beyId: beyblade.id });
        }
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

      // Phase 24: clash QTE timer countdown
      if (beyblade.clashQTEActive) {
        beyblade.clashQTETimer = Math.max(0, beyblade.clashQTETimer - dt);
        if (beyblade.clashQTETimer <= 0) {
          beyblade.clashQTEActive = false;
          beyblade.clashQTETimer  = 0;
        }
      }

      if (beyblade.comboExecuting && beyblade.comboTimer > 0) {
        beyblade.comboTimer = Math.max(0, beyblade.comboTimer - dt);
        if (beyblade.comboTimer <= 0) beyblade.comboExecuting = false;
      }

      if (beyblade.inLoop) beyblade.power = Math.min(100, beyblade.power + 2);

      // 2.5D hook: PartSystemManager.tickBey() goes here (no-op in base).
      this.onTickedBey(beyblade, dt);

      // Classic Stadium zone physics (pinkWallRadius / tornado ridge / bowl slope)
      if (beyblade.isActive && this.state.arena.shape === "circle") {
        const ac = this.arenaCache as any;
        const pinkWallR   = ac?.pinkWallRadius   as number | undefined;
        const ridgeR      = ac?.ridgeRadius       as number | undefined;
        const ridgeW      = ac?.spinZones?.[0]?.ringWidth as number | undefined;
        const flatZoneR   = ac?.flatZoneRadius    as number | undefined;
        const spinStrength = ac?.spinZones?.[0]?.spinStrength as number | undefined;
        const bounceFactor = ac?.wallBounceFactor as number | undefined;

        if (pinkWallR !== undefined && ridgeR !== undefined && flatZoneR !== undefined) {
          const cx = (this.state.arena.width  * 16) / 2;
          const cy = (this.state.arena.height * 16) / 2;
          const dx = beyblade.x - cx;
          const dy = beyblade.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            const normX = dx / dist;
            const normY = dy / dist;
            // Convert Firestore px radii to physics coords (×16)
            const pinkR  = pinkWallR  * 16;
            const ridRad = ridgeR     * 16;
            const ridHW  = ((ridgeW ?? 36) * 16) / 2;
            const flatR  = flatZoneR  * 16;
            const ringOutR = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;

            // 1. Pink wall recoil: bey between pinkWall and KO boundary
            if (dist >= pinkR && dist < ringOutR) {
              const bf = bounceFactor ?? 1.2;
              const recoilMag = (dist - pinkR) / (ringOutR - pinkR) * 0.004 * bf;
              this.physics.applyForce(beyblade.id, -normX * recoilMag * beyblade.mass, -normY * recoilMag * beyblade.mass);
            }

            // 2. Tornado ridge spin boost: bey inside the ridge band
            if (Math.abs(dist - ridRad) <= ridHW) {
              const boost = (spinStrength ?? 0.35) * dt;
              beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + boost * beyblade.maxSpin * 0.01);
            }

            // 3. Bowl slope: inward drift between flatZone and pinkWall
            if (dist > flatR && dist < pinkR) {
              const zone = (dist - flatR) / (pinkR - flatR); // 0=flatEdge 1=pinkWall
              const driftMag = zone * zone * 0.0025 * beyblade.mass;
              this.physics.applyForce(beyblade.id, -normX * driftMag, -normY * driftMag);
            }
          }
        }
      }

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
        if (isOut && !beyblade.isRingOut && !beyblade.ringOutImmune && !beyblade.knockoutImmune && !beyblade.phasesArenaBounds) {
          beyblade.isRingOut = true;
          beyblade.isActive = false;
          beyblade.eliminationType = "ring_out";
          this.broadcast("ring-out", { playerId: beyblade.id, username: beyblade.username });
          // #28: Record ring-out + killcam
          this.replayRecorder?.recordEvent("ringout", { beyId: beyblade.id });
          const killcamFrames = this.replayRecorder?.getLastNSeconds(5) ?? [];
          if (killcamFrames.length > 0) {
            this.broadcast("death-replay", { frames: killcamFrames, victimId: beyblade.id, killerId: null });
          }
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
    const entry = pool[Math.floor(this.rand() * pool.length)];

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

    const floorGroup = (this.arenaCache as any)?.floorGroup as { floorArenaIds?: string[]; floorPositions?: Array<{ floorIndex: number; xOffsetCm: number; yOffsetCm: number; zOffsetCm: number }>; minFloorHeightCm?: number } | undefined;
    const floorArenaIds: string[] = floorGroup?.floorArenaIds ?? [];

    // Physics coordinate constants
    const SCALE = 16;  // 1 cm = 16 physics units (matches PhysicsEngine convention)
    const PX_PER_CM = 24;

    for (const [sessionId, bey] of this.state.beyblades) {
      if (!bey.isActive) continue;

      const beyCurrentFloor = this.beyFloorIndex.get(sessionId) ?? 0;
      const beyCurrentArenaId = floorArenaIds[beyCurrentFloor] ?? (this.arenaCache as any)?.id;

      for (const link of links) {
        // Only process links whose source arena matches this bey's current floor
        if (floorArenaIds.length > 0 && link.fromArenaId !== beyCurrentArenaId) continue;

        // Check per-link cooldown
        const beyLinkCooldowns = this.linkCooldowns.get(sessionId) ?? new Map<string, number>();
        const cooldownLeft = beyLinkCooldowns.get(link.id) ?? 0;
        if (cooldownLeft > 0) {
          beyLinkCooldowns.set(link.id, cooldownLeft - 1);
          this.linkCooldowns.set(sessionId, beyLinkCooldowns);
          continue;
        }

        // Directional gate
        if (link.reverseCondition === "never") continue;
        if (link.reverseCondition === "spin_above_50" && bey.spin < bey.maxSpin * 0.5) continue;

        // Boundary detection — convert cm boundary to physics units relative to arena center
        const arenaCx = (this.state.arena.width * SCALE) / 2;
        const arenaCy = (this.state.arena.height * SCALE) / 2;
        const x1 = arenaCx + link.boundaryLine.x1 * PX_PER_CM;
        const y1 = arenaCy + link.boundaryLine.y1 * PX_PER_CM;
        const x2 = arenaCx + link.boundaryLine.x2 * PX_PER_CM;
        const y2 = arenaCy + link.boundaryLine.y2 * PX_PER_CM;

        const dist = pointToSegmentDistance(bey.x, bey.y, x1, y1, x2, y2);
        const beyRadius = (bey.radius ?? 4) * PX_PER_CM;
        if (dist > beyRadius + 10) continue;

        // ── Bey is crossing ───────────────────────────────────────────────────

        // 1. Hazard damage
        if (link.hazardDamage && link.hazardDamage > 0) {
          bey.spin = Math.max(0, bey.spin - link.hazardDamage);
        }

        // 2. Update floor index
        const toFloor = floorArenaIds.indexOf(link.toArenaId);
        if (toFloor >= 0) {
          this.beyFloorIndex.set(sessionId, toFloor);
        }

        // 3. Teleport bey to exit position in destination arena
        if (link.exitPosition) {
          const destFloorIdx = toFloor >= 0 ? toFloor : beyCurrentFloor;
          const destPos = floorGroup?.floorPositions?.find(p => p.floorIndex === destFloorIdx);
          const xOffsetPx = (destPos?.xOffsetCm ?? 0) * PX_PER_CM;
          const yOffsetPx = (destPos?.yOffsetCm ?? 0) * PX_PER_CM;
          const destCx = arenaCx + xOffsetPx;
          const destCy = arenaCy + yOffsetPx;
          const exitX = destCx + link.exitPosition.x * PX_PER_CM;
          const exitY = destCy + link.exitPosition.y * PX_PER_CM;
          this.physics.setPosition(sessionId, exitX, exitY);
        }

        // 4. Velocity handling
        const exitMult = (link as any).exitVelocityMult ?? 1.0;
        if (!link.momentumPreserved) {
          this.physics.setLinearVelocity(sessionId, 0, 0);
        } else if (exitMult !== 1.0) {
          // Scale existing velocity by exit multiplier
          const body = (this.physics as any).bodies?.get(sessionId);
          if (body) {
            this.physics.setLinearVelocity(
              sessionId,
              body.velocity.x * exitMult,
              body.velocity.y * exitMult
            );
          }
        }

        // Link-type specific overrides
        if (link.linkType === "pit") {
          bey.spin = Math.max(0, bey.spin - (link.hazardDamage ?? 50));
          this.physics.setLinearVelocity(sessionId, 0, 0);
        } else if (link.linkType === "trampoline") {
          const body = (this.physics as any).bodies?.get(sessionId);
          if (body) {
            this.physics.setLinearVelocity(
              sessionId,
              body.velocity.x * (exitMult > 1 ? exitMult : 2.0),
              body.velocity.y * (exitMult > 1 ? exitMult : 2.0)
            );
          }
        }

        // 5. Broadcast crossing event — matches FloorTransitionProps (minus `visible`)
        const fromLabel = (this.arenaCache as any)?.name ?? `Floor ${beyCurrentFloor}`;
        const destLabel = floorArenaIds[toFloor >= 0 ? toFloor : beyCurrentFloor] ?? `Floor ${toFloor}`;
        const trampolineOptOutTicks = (link as any).trampolineConfig?.optOutWindowTicks ?? 0;
        // Only broadcast to the crossing bey's client (not all spectators)
        const crossingClient = this.clients.find(c => c.sessionId === sessionId);
        crossingClient?.send("arena-link-cross", {
          linkType: link.linkType,
          fromFloor: beyCurrentFloor,
          toFloor: toFloor >= 0 ? toFloor : beyCurrentFloor,
          fromLabel,
          toLabel: destLabel,
          progress: 0,
          state: link.linkType === "trampoline" && trampolineOptOutTicks > 0 ? "opt_out_window" : (link.linkType === "trampoline" ? "auto_launch" : "transit"),
          optOutTicksLeft: trampolineOptOutTicks > 0 ? trampolineOptOutTicks : undefined,
          optOutWindowTicks: trampolineOptOutTicks > 0 ? trampolineOptOutTicks : undefined,
        });
        // Also broadcast a lighter event to all clients so they can update scoreboard / spectator floor indicators
        this.broadcast("bey-floor-changed", { beyId: sessionId, fromFloor: beyCurrentFloor, toFloor: toFloor >= 0 ? toFloor : beyCurrentFloor });

        // 6. Set cooldown
        const newCooldowns = this.linkCooldowns.get(sessionId) ?? new Map<string, number>();
        newCooldowns.set(link.id, (link as any).traversal?.perBeyReuseCooldown ?? link.cooldownTicks ?? 60);
        this.linkCooldowns.set(sessionId, newCooldowns);
      }
    }

    // Broadcast floor/alignment status ~every 10 ticks (6 times/sec at 60Hz)
    this.linkStatusBroadcastTick++;
    if (this.linkStatusBroadcastTick >= 10) {
      this.linkStatusBroadcastTick = 0;
      this.broadcastArenaLinkStatus(links, floorArenaIds);
    }
  }

  private broadcastArenaLinkStatus(links: ArenaLink[], floorArenaIds: string[]): void {
    if (!links.length && !floorArenaIds.length) return;

    for (const [sessionId] of this.state.beyblades) {
      const myFloor = this.beyFloorIndex.get(sessionId) ?? 0;

      const floors = floorArenaIds.map((aid, fi) => ({
        floorIndex: fi,
        arenaName: aid,
        links: links
          .filter(l => l.fromArenaId === aid || l.toArenaId === aid)
          .map(l => {
            const toIdx = floorArenaIds.indexOf(l.toArenaId);
            const fromIdx = floorArenaIds.indexOf(l.fromArenaId);
            // direction from this floor's perspective: up if the other end is a higher index
            const otherIdx = l.fromArenaId === aid ? toIdx : fromIdx;
            const direction: "up" | "down" = otherIdx >= 0 ? (otherIdx > fi ? "up" : "down") : (l.levelDelta > 0 ? "up" : "down");
            return { linkType: l.linkType, direction, status: "aligned" as const, alignmentFraction: 0 };
          }),
      }));

      const linkAlignments = links
        .filter(l => l.fromArenaId === floorArenaIds[myFloor] || l.toArenaId === floorArenaIds[myFloor])
        .map(l => {
          const toIdx = floorArenaIds.indexOf(l.toArenaId);
          const fromIdx = floorArenaIds.indexOf(l.fromArenaId);
          const otherIdx = l.fromArenaId === floorArenaIds[myFloor] ? toIdx : fromIdx;
          const direction: "up" | "down" = otherIdx >= 0 ? (otherIdx > myFloor ? "up" : "down") : (l.levelDelta > 0 ? "up" : "down");
          return {
            id: l.id,
            linkType: l.linkType,
            direction,
            alignmentStatus: (l.alignment?.mode === "none" ? "always_open" : "aligned") as "always_open" | "aligned",
            degreesOff: 0,
            errorMarginDeg: l.alignment?.errorMarginDeg ?? 10,
          };
        });

      this.clients.find(c => c.sessionId === sessionId)?.send("arena-link-status", {
        floors,
        myFloorIndex: myFloor,
        linkAlignments,
      });
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

          // ── Max duration: auto-break when stack has lasted too long ──────────
          if (link.maxDurationTicks && tickCount > link.maxDurationTicks) {
            this.beyStackState.delete(stackKey);
            this.pendingBeyLinkQTE.delete(sidB);
            const cmap = this.beyStackCooldowns.get(sidA) ?? new Map<string, number>();
            cmap.set(link.id, link.cooldownTicks ?? 120);
            this.beyStackCooldowns.set(sidA, cmap);
            this.broadcast("bey-stack-end", { beyIdA: sidA, beyIdB: sidB, linkId: link.id, reason: "max_duration" });
            continue;
          }

          // ── Ring-out break ───────────────────────────────────────────────────
          if (link.breakOnRingOut) {
            const ringOutRadius = (this.state.arena.width * 16) / 2 * 0.85;
            const cx = (this.state.arena.width * 16) / 2;
            const cy = (this.state.arena.height * 16) / 2;
            const nearEdgeA = Math.hypot(beyA.x - cx, beyA.y - cy) > ringOutRadius;
            const nearEdgeB = Math.hypot(beyB.x - cx, beyB.y - cy) > ringOutRadius;
            if (nearEdgeA || nearEdgeB) {
              this.beyStackState.delete(stackKey);
              this.pendingBeyLinkQTE.delete(sidB);
              this.broadcast("bey-stack-end", { beyIdA: sidA, beyIdB: sidB, linkId: link.id, reason: "ring_out_proximity" });
              continue;
            }
          }

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

              case "control_loss": {
                // Skip if victim is immune
                const immuneUntil = this.controlLossImmunity.get(sidB) ?? 0;
                if (this.tickCounter < immuneUntil) break;

                // Apply control loss on interval
                if (tickCount % interval === 1) {
                  const mode = effect.controlMode ?? "reverse";
                  const dur = effect.controlDurationTicks ?? 60;
                  const victimClient = this.clients.find(c => c.sessionId === sidB);
                  victimClient?.send("bey-link-control-loss", {
                    mode, durationTicks: dur, attackerId: sidA, linkId: link.id,
                  });
                  // Register active control loss for recovery QTE tracking
                  if (!this.activeControlLoss.has(sidB)) {
                    const recoveryKey = QTE_KEY_POOL[Math.floor(this.rand() * QTE_KEY_POOL.length)];
                    this.activeControlLoss.set(sidB, {
                      linkId: link.id,
                      nextQTETick: this.tickCounter + 10 * 60, // first recovery QTE in 10 sec
                      recoveryKey,
                    });
                  }
                }

                // Issue recovery QTE every 10 seconds
                const ctrl = this.activeControlLoss.get(sidB);
                if (ctrl && this.tickCounter >= ctrl.nextQTETick) {
                  const victimClient = this.clients.find(c => c.sessionId === sidB);
                  victimClient?.send("bey-link-control-recovery-qte", {
                    key: ctrl.recoveryKey,
                    linkId: link.id,
                    windowTicks: 60,
                    expiresAt: Date.now() + 60 * (1000 / 60),
                  });
                  // Next window in another 10 sec
                  ctrl.nextQTETick = this.tickCounter + 10 * 60;
                  // Rotate key each window so it can't be predicted
                  ctrl.recoveryKey = QTE_KEY_POOL[Math.floor(this.rand() * QTE_KEY_POOL.length)];
                }
                break;
              }

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

          // ── 2-body movement patterns per link type ─────────────────────────
          // Applied every tick regardless of specific effects.
          this._applyBeyLinkMovement(link.linkType, link.alignment, sidA, sidB, beyA, beyB, tickCount);
          // Overlay player/initiator steering for non-auto control modes.
          this._applyMovementControlSteering(link, sidA);

          // ── Dogfight spark visuals ─────────────────────────────────────────
          if (link.linkType === "side_spin" && link.alignment === "hostile" && tickCount % 5 === 1) {
            this.broadcast("bey-stack-sparks", {
              beyIdA: sidA, beyIdB: sidB,
              x: (beyA.x + beyB.x) / 2,
              y: (beyA.y + beyB.y) / 2,
              intensity: Math.min(1, (effects.find(e => e.type === "continuous_collision")?.intensityPerTick ?? 3) / 10),
            });
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

    // Tick down hijack cooldowns
    for (const [, cmap] of this.hijackCooldowns) {
      for (const [lid, ticks] of cmap) {
        if (ticks <= 1) cmap.delete(lid);
        else cmap.set(lid, ticks - 1);
      }
    }

    // Check expired hijack QTE windows → auto-execute hijack (attacker failed to block)
    const nowMs = Date.now();
    for (const [stackKey, hqte] of this.pendingHijackQTE) {
      if (nowMs > hqte.expiresAt) {
        this.pendingHijackQTE.delete(stackKey);
        const parts = stackKey.split(":");
        const sidA = parts[0], sidB = parts[1], lid = parts[2];
        if (this.beyStackState.has(stackKey)) {
          this._executeHijack(stackKey, lid, sidA, sidB);
        }
      }
    }

    // ── Group movement patterns (3+ beys under same link) ───────────────────
    const linkGroups = this._buildLinkGroups();
    for (const [lid, memberSet] of linkGroups) {
      if (memberSet.size < 3) continue;
      const link = beyLinks!.find(l => l.id === lid);
      if (!link) continue;
      const pattern = link.groupPattern;
      const control = link.movementControl ?? "auto";
      if (!pattern && control === "auto") continue;
      this._applyGroupMovement(
        Array.from(memberSet),
        link,
        pattern ?? "chain",
        control,
        this.tickCounter,
      );
    }
  }

  /** Expire arena-wide effects and broadcast clear events (Phase AA). Also ticks turret dispatch. */
  protected tickArenaEffects(nowMs: number, dtMs: number): void {
    this.arenaEffectExpiries.forEach((expiresAt, effectKey) => {
      if (nowMs >= expiresAt) {
        this.arenaEffectExpiries.delete(effectKey);
        this.broadcast("arena-effect-end", { effectKey });
      }
    });

    if (this.state.turrets.size > 0) {
      const bridge: TurretProcessorBridge = {
        applyForce: (id: string, fx: number, fy: number) => this.physics.applyForce(id, fx, fy),
        applyKnockback: (id: string, dir: { x: number; y: number }, dist: number) => this.physics.applyForce(id, dir.x * dist, dir.y * dist),
        getPosition: (id: string) => {
          const b = this.state.beyblades.get(id);
          return b ? { x: b.x, y: b.y } : null;
        },
      };
      const beyArr = Array.from(this.state.beyblades.values()) as Beyblade[];
      tickTurrets(
        this.state.turrets as unknown as Map<string, { attackType: string; x: number; y: number; cooldown: number; cooldownEndTime: number; lastFireTime: number; isActive: boolean; isDestroyed: boolean; firePattern?: string }>,
        this.arenaCache?.turrets ?? [],
        this.turretRuntimes,
        beyArr,
        bridge,
        nowMs,
        dtMs,
      );
    }
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

  protected checkWinCondition() {
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

  protected resetForNextGame() {
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
    resetStateForNextGame(this.state, this.spawnPositions, this.physics, WARMUP_DURATION_S);
    this.resetWarmupTimer();

    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase, gameNumber: this.state.currentGame });
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

      // #28: Write replay to Firestore match_replays collection (series end only)
      if (seriesEnd && this.replayRecorder) {
        const db = getFirestoreDb();
        if (db) {
          try {
            const replayData = this.replayRecorder.getReplayData();
            const { matchId: _rid, ...replayFrames } = replayData;
            await db.collection("match_replays").doc(this.roomId).set({
              matchId: this.roomId,
              ...replayFrames,
              createdAt: new Date(),
              winner: winner?.userId ?? null,
            });
          } catch (replayErr) {
            console.error("Failed to save match replay:", replayErr);
          }
        }
        this.replayRecorder.clear();
      }

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

  // ── Phase 27: Ghost population ─────────────────────────────────────────────
  // Returns "left" for the first player (by join order), "right" for the second.
  protected getPlayerSide(userId: string): "left" | "right" {
    let idx = 0;
    for (const [, bey] of this.state.beyblades) {
      if (bey.userId === userId) return idx === 0 ? "left" : "right";
      idx++;
    }
    return "left";
  }

  // Called every 6 ticks (10Hz). Populates beyGhosts from beyblades with tier info.
  // Tier: 2=full (≤60cm), 1=shadow (60–100cm), 0=dot only (>100cm).
  private populateBeyGhosts(): void {
    const PX_PER_CM = 24;
    const innerPx = AoI.INNER_RADIUS_CM * PX_PER_CM;
    const outerPx = AoI.OUTER_RADIUS_CM * PX_PER_CM;

    this.state.beyblades.forEach((bey, id) => {
      if (!bey.isActive) {
        this.state.beyGhosts.delete(id);
        return;
      }
      let ghost = this.state.beyGhosts.get(id);
      if (!ghost) {
        ghost = new BeyGhostState();
        ghost.id = id;
        this.state.beyGhosts.set(id, ghost);
      }
      ghost.x_cm     = bey.x / PX_PER_CM;
      ghost.y_cm     = bey.y / PX_PER_CM;
      ghost.vx_cm    = bey.velocityX / PX_PER_CM;
      ghost.vy_cm    = bey.velocityY / PX_PER_CM;
      ghost.floorIndex = (bey as any).beyFloorIndex ?? 0;
      ghost.teamId   = bey.teamId;
      ghost.tiltAngle = bey.beyTiltAngle ?? 0;
      ghost.spin_pct = bey.maxSpin > 0 ? Math.round((bey.spin / bey.maxSpin) * 100) : 0;
      ghost.beyType  = bey.type;
      ghost.username = bey.username;

      // Determine tier relative to each human player — store worst-case (most visible) tier
      // so that any player who CAN see the bey gets the right tier.
      let maxTier = 0;
      this.clients.forEach(client => {
        const myBey = this.state.beyblades.get(client.sessionId);
        if (!myBey) { maxTier = 2; return; } // spectator — always full
        const dx = bey.x - myBey.x;
        const dy = bey.y - myBey.y;
        const distSq = dx * dx + dy * dy;
        let tier: 0 | 1 | 2;
        if (distSq <= innerPx * innerPx) tier = 2;
        else if (distSq <= outerPx * outerPx) tier = 1;
        else tier = 0;
        if (tier > maxTier) maxTier = tier;
      });
      ghost.tier = maxTier;
    });

    // Remove ghosts for eliminated beyblades
    const activeIds = new Set<string>();
    this.state.beyblades.forEach((_, id) => activeIds.add(id));
    this.state.beyGhosts.forEach((_, id) => {
      if (!activeIds.has(id)) this.state.beyGhosts.delete(id);
    });
  }

  protected onBeyCollided(id1: string, id2: string, impactForce: number): void {
    // Check if either bey is in an active stack that should be broken by this collision.
    // A stack breaks if a third bey hits either participant with force >= link.breakThreshold.
    // Collisions between the two stacked beys themselves do NOT count (that's normal stack contact).
    this._checkBeyLinkBreakByCollision(id1, id2, impactForce);
  }

  private _checkBeyLinkBreakByCollision(colliderId1: string, colliderId2: string, impactForce: number): void {
    const beyLinks = (this.arenaCache as any)?.beyLinks as BeyLink[] | undefined;
    if (!beyLinks?.length) return;

    for (const [stackKey, stackState] of this.beyStackState) {
      const [sidA, sidB] = stackKey.split(":");
      const link = beyLinks.find(l => l.id === stackState.linkId);
      if (!link || !link.breakThreshold) continue;
      if (impactForce < link.breakThreshold) continue;

      // Determine if this collision involves one stacked bey + an external third bey
      const aInvolved = colliderId1 === sidA || colliderId2 === sidA;
      const bInvolved = colliderId1 === sidB || colliderId2 === sidB;

      // Collision is between the two stacked beys themselves — don't break
      if (aInvolved && bInvolved) continue;

      // An external bey hit one of the stack participants
      if (aInvolved || bInvolved) {
        this.beyStackState.delete(stackKey);
        // Clear any pending QTE for the victim
        this.pendingBeyLinkQTE.delete(sidB);
        // Short cooldown so the stack can reform but isn't instantly re-triggered
        const cooldown = Math.floor((link.cooldownTicks ?? 60) * 0.4);
        const cmap = this.beyStackCooldowns.get(sidA) ?? new Map<string, number>();
        cmap.set(link.id, cooldown);
        this.beyStackCooldowns.set(sidA, cmap);
        this.broadcast("bey-stack-broken", {
          beyIdA: sidA, beyIdB: sidB,
          linkId: link.id,
          breakerId: aInvolved ? (colliderId1 === sidA ? colliderId2 : colliderId1)
                                : (colliderId1 === sidB ? colliderId2 : colliderId1),
          impactForce,
          threshold: link.breakThreshold,
        });
      }
    }
  }

  /** N6: Combination lock tick — override in 2.5D subclass to call partSystemManager.tickCombinationLock(). */
  protected onTickCombinationLock(_deltaTime: number): void {
    // no-op in base room
  }

  // ─── BeyLink group detection ─────────────────────────────────────────────────

  /** Build a map of linkId → Set<sessionId> for all currently-active stacks. */
  private _buildLinkGroups(): Map<string, Set<string>> {
    const groups = new Map<string, Set<string>>();
    for (const [stackKey] of this.beyStackState) {
      const parts = stackKey.split(":");
      const sidA = parts[0], sidB = parts[1], lid = parts[2];
      if (!groups.has(lid)) groups.set(lid, new Set());
      groups.get(lid)!.add(sidA);
      groups.get(lid)!.add(sidB);
    }
    return groups;
  }

  // ─── Movement control steering (2-body + group) ───────────────────────────────

  /**
   * Derive a normalised (dx, dy) steer vector from the link's movementControl setting,
   * then push it onto the given leader session.
   * No-op when movementControl is "auto" or undefined.
   */
  private _applyMovementControlSteering(link: BeyLink, leaderSid: string): void {
    const control = link.movementControl ?? "auto";
    if (control === "auto") return;

    let steerX = 0, steerY = 0;
    const accumInput = (sid: string) => {
      const inp = this.lastPlayerInput.get(sid);
      if (!inp) return;
      if (inp.moveLeft)  steerX -= 1;
      if (inp.moveRight) steerX += 1;
      if (inp.moveUp)    steerY -= 1;
      if (inp.moveDown)  steerY += 1;
    };

    if (control === "initiator") {
      accumInput(leaderSid);
    } else if (control === "player") {
      for (const [stackKey, state] of this.beyStackState) {
        if (state.linkId !== link.id) continue;
        const parts = stackKey.split(":");
        if (this.playerSessions.has(parts[0])) accumInput(parts[0]);
        if (this.playerSessions.has(parts[1])) accumInput(parts[1]);
      }
      const mag = Math.hypot(steerX, steerY);
      if (mag > 0) { steerX /= mag; steerY /= mag; }
    }

    if (steerX !== 0 || steerY !== 0) {
      this.physics.applyForce(leaderSid, steerX * 0.6, steerY * 0.6);
    }
  }

  // ─── Group movement patterns (3+ linked beys) ────────────────────────────────

  private _applyGroupMovement(
    members: string[],
    link: BeyLink,
    pattern: BeyLinkGroupPattern,
    movementControl: BeyLinkMovementControl,
    tickCount: number,
  ): void {
    type BodyState = { x: number; y: number; velocityX: number; velocityY: number };
    const states: { sid: string; body: BodyState }[] = [];
    for (const sid of members) {
      const b = this.physics.getBodyState(sid);
      if (b) states.push({ sid, body: b });
    }
    if (states.length < 2) return;

    const orbitR = (link.entryRadiusCm ?? 2) * 24;

    // Compute steer vector from control mode
    let steerX = 0, steerY = 0;
    const accumInput = (sid: string) => {
      const inp = this.lastPlayerInput.get(sid);
      if (!inp) return;
      if (inp.moveLeft)  steerX -= 1;
      if (inp.moveRight) steerX += 1;
      if (inp.moveUp)    steerY -= 1;
      if (inp.moveDown)  steerY += 1;
    };
    if (movementControl === "initiator") {
      accumInput(members[0]);
    } else if (movementControl === "player") {
      for (const { sid } of states) {
        if (this.playerSessions.has(sid)) accumInput(sid);
      }
      const mag = Math.hypot(steerX, steerY);
      if (mag > 0) { steerX /= mag; steerY /= mag; }
    }
    const hasSteer = (steerX !== 0 || steerY !== 0) && movementControl !== "auto";

    switch (pattern) {
      case "chain": {
        // Each follower targets the bey ahead, trailing behind its velocity direction.
        for (let i = 1; i < states.length; i++) {
          const leader = states[i - 1].body;
          const { sid, body } = states[i];
          const spd = Math.hypot(leader.velocityX, leader.velocityY) || 1;
          const targetX = leader.x - (leader.velocityX / spd) * orbitR;
          const targetY = leader.y - (leader.velocityY / spd) * orbitR;
          this.physics.applyForce(sid, (targetX - body.x) * 0.04, (targetY - body.y) * 0.04);
        }
        if (hasSteer) this.physics.applyForce(states[0].sid, steerX * 0.6, steerY * 0.6);
        break;
      }

      case "star": {
        // Hub = highest-spin bey; followers orbit it at evenly-spaced angles.
        let hubSid = members[0];
        let hubSpin = this.state.beyblades.get(hubSid)?.spin ?? 0;
        for (const sid of members) {
          const sp = this.state.beyblades.get(sid)?.spin ?? 0;
          if (sp > hubSpin) { hubSid = sid; hubSpin = sp; }
        }
        const hubBody = states.find(e => e.sid === hubSid)?.body;
        if (!hubBody) break;
        const followers = states.filter(e => e.sid !== hubSid);
        const step = (2 * Math.PI) / (followers.length || 1);
        followers.forEach(({ sid, body }, i) => {
          const angle = step * i + tickCount * 0.04;
          const targetX = hubBody.x + Math.cos(angle) * orbitR;
          const targetY = hubBody.y + Math.sin(angle) * orbitR;
          this.physics.applyForce(sid, (targetX - body.x) * 0.04, (targetY - body.y) * 0.04);
        });
        if (hasSteer) this.physics.applyForce(hubSid, steerX * 0.6, steerY * 0.6);
        break;
      }

      case "wedge": {
        // Leader at front; wings hold ±45° behind, rows of two.
        const { sid: leadSid, body: leadBody } = states[0];
        const wings = states.slice(1);
        wings.forEach(({ sid, body }, i) => {
          const side = i % 2 === 0 ? 1 : -1;
          const row = Math.floor(i / 2) + 1;
          const spd = Math.hypot(leadBody.velocityX, leadBody.velocityY) || 1;
          const fwdAngle = Math.atan2(leadBody.velocityY, leadBody.velocityX);
          const wingAngle = fwdAngle + Math.PI + side * (Math.PI / 4);
          const targetX = leadBody.x + Math.cos(wingAngle) * orbitR * row;
          const targetY = leadBody.y + Math.sin(wingAngle) * orbitR * row;
          this.physics.applyForce(sid, (targetX - body.x) * 0.04, (targetY - body.y) * 0.04);
        });
        if (hasSteer) this.physics.applyForce(leadSid, steerX * 0.6, steerY * 0.6);
        break;
      }

      case "rigid": {
        // Lock relative positions to centroid at stack-entry tick.
        const cx = states.reduce((s, e) => s + e.body.x, 0) / states.length;
        const cy = states.reduce((s, e) => s + e.body.y, 0) / states.length;
        for (const { sid, body } of states) {
          const key = `rigid:${sid}`;
          let off = this.rigidFormationOffset.get(key);
          if (!off) {
            off = { relX: body.x - cx, relY: body.y - cy };
            this.rigidFormationOffset.set(key, off);
          }
          const targetX = cx + off.relX;
          const targetY = cy + off.relY;
          this.physics.applyForce(sid, (targetX - body.x) * 0.05, (targetY - body.y) * 0.05);
        }
        if (hasSteer) {
          for (const { sid } of states) {
            this.physics.applyForce(sid, steerX * 0.4, steerY * 0.4);
          }
        }
        break;
      }
    }
  }

  // ─── 2-body movement patterns for linked beys ────────────────────────────────

  private _applyBeyLinkMovement(
    linkType: string,
    alignment: string,
    sidA: string,
    sidB: string,
    beyA: { x: number; y: number; velocityX: number; velocityY: number },
    beyB: { x: number; y: number; velocityX: number; velocityY: number },
    tickCount: number
  ): void {
    const dx = beyB.x - beyA.x;
    const dy = beyB.y - beyA.y;
    const dist = Math.hypot(dx, dy) || 1;

    switch (linkType) {
      case "tip_stack":
        // Attacker orbits the defender in tight circles (drilling motion).
        // Radius ~1.5cm (36px). sidA is the driller; nudge it tangentially.
        {
          const orbitR = 36; // px
          const orbitSpeed = 0.08; // radians per tick
          const angle = Math.atan2(beyA.y - beyB.y, beyA.x - beyB.x) + orbitSpeed;
          const targetX = beyB.x + Math.cos(angle) * orbitR;
          const targetY = beyB.y + Math.sin(angle) * orbitR;
          const fx = (targetX - beyA.x) * 0.04;
          const fy = (targetY - beyA.y) * 0.04;
          this.physics.applyForce(sidA, fx, fy);
          // Keep attacker close — damp separation
          if (dist > orbitR + 24) {
            const pullF = (dist - orbitR) * 0.02;
            this.physics.applyForce(sidA,  (dx / dist) * pullF,  (dy / dist) * pullF);
          }
        }
        break;

      case "top_mount":
        // Cooperative: both beys maintain contact and rotate together CW.
        // They orbit each other around a shared midpoint.
        {
          const midX = (beyA.x + beyB.x) / 2;
          const midY = (beyA.y + beyB.y) / 2;
          const orbitSpeed = alignment === "friendly" ? 0.04 : -0.04;
          const rA = Math.hypot(beyA.x - midX, beyA.y - midY) || 1;
          const rB = Math.hypot(beyB.x - midX, beyB.y - midY) || 1;
          const angA = Math.atan2(beyA.y - midY, beyA.x - midX) + orbitSpeed;
          const angB = Math.atan2(beyB.y - midY, beyB.x - midX) + orbitSpeed;
          this.physics.applyForce(sidA,
            (midX + Math.cos(angA) * rA - beyA.x) * 0.03,
            (midY + Math.sin(angA) * rA - beyA.y) * 0.03);
          this.physics.applyForce(sidB,
            (midX + Math.cos(angB) * rB - beyB.x) * 0.03,
            (midY + Math.sin(angB) * rB - beyB.y) * 0.03);
        }
        break;

      case "side_spin":
        if (alignment === "friendly") {
          // Circus pattern: beys spin side-by-side, maintaining ~2cm separation.
          // Both slowly co-rotate around the arena midpoint.
          {
            const targetDist = 48; // 2cm in px
            if (dist > targetDist + 12) {
              // Pull toward each other
              const pullF = (dist - targetDist) * 0.015;
              this.physics.applyForce(sidA,  (dx / dist) * pullF,  (dy / dist) * pullF);
              this.physics.applyForce(sidB, -(dx / dist) * pullF, -(dy / dist) * pullF);
            } else if (dist < targetDist - 12) {
              // Push apart
              const pushF = (targetDist - dist) * 0.015;
              this.physics.applyForce(sidA, -(dx / dist) * pushF, -(dy / dist) * pushF);
              this.physics.applyForce(sidB,  (dx / dist) * pushF,  (dy / dist) * pushF);
            }
          }
        } else {
          // Dogfight: beys circle each other, each trying to get behind the other.
          // Alternating clockwise/counter-clockwise push each tick.
          {
            const circleDir = tickCount % 2 === 0 ? 1 : -1;
            const perpX = -dy / dist;
            const perpY =  dx / dist;
            const circleForceMag = 1.8;
            this.physics.applyForce(sidA, perpX * circleForceMag * circleDir, perpY * circleForceMag * circleDir);
            this.physics.applyForce(sidB, perpX * circleForceMag * -circleDir, perpY * circleForceMag * -circleDir);
          }
        }
        break;
    }
  }

}

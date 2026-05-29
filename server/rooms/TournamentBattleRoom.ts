import { Client } from "colyseus";
import { BaseRoom } from "./BaseRoom";
import { AI_LAUNCH_DELAY_S, WARMUP_DURATION_S } from "../shared/constants/gameConstants";
import { GameState, Beyblade } from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem, saveMatch, updatePlayerStats } from "../utils/firebase";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { loadGimmickDefs } from "../utils/firestoreLoaders";
import { expandGimmicks } from "../utils/gimmickExpander";
import { tryReserveRoom, releaseRoom, setMaxActiveRooms } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import { ComboTracker, detectCombo, createComboTracker } from "../shared/utils/comboSystem";
import { normalizeBestOf, targetWinsFor } from "../shared/utils/seriesFormat";
import { normalizeInput, type PlayerInput } from "../shared/utils/bitmask";
import { resolveWallAngle, computeTiltForce, getFloorAngleAtRadius } from "../shared/physics/ArenaUtils";
import { resolvePhysicsFlags } from "../utils/physicsFlags";
import { processArenaFeatures } from "../shared/rooms/ArenaFeatureProcessor";
import { populateArenaFeatures } from "../shared/rooms/populateArenaFeatures";
import { advanceArenaRotation, advanceArenaTilt, applyWeightTilt } from "../shared/rooms/advanceArenaRotation";
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
import { AIController, type AIDifficulty } from "../ai/AIController";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";

// [SERVER-ROOM] TournamentBattleRoom — tournament match room (2 players + spectators).
// maxClients = 10: 2 player slots, up to 8 spectators.

interface JoinOptions {
  spectate?: boolean;
  tournamentId?: string;
  matchId?: string;
  arenaSystemId?: string;
  userId: string;
  username: string;
  beybladeId: string;
  isAI?: boolean;
  aiDifficulty?: AIDifficulty;
}

const SPAWN_OFFSETS = [
  { angle: 0 },
  { angle: Math.PI },
];

export class TournamentBattleRoom extends BaseRoom<GameState> {
  static pendingMatchCallbacks = new Map<string, (winnerId: string, matchFirestoreId: string) => void>();

  private lastInputTime = 0;
  private isPrivateRoom = false;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  protected playerSessions = new Set<string>();
  protected spectatorSessions = new Set<string>();
  protected aiSessions = new Set<string>();
  /** Union of spectator + AI sessions — kept live so late-joining spectators are excluded from launch input. */
  private launchIgnoredSessions = new Set<string>();
  private aiControllers = new Map<string, AIController>();
  private beybladeDataCache = new Map<string, BeybladeStats | null>();
  protected spawnPositions = new Map<string, { x: number; y: number; angle: number }>();
  private aiLaunchTimer = AI_LAUNCH_DELAY_S;
  protected comboTrackers = new Map<string, ComboTracker>();
  /** Per-session camera-follow target id (purely informational). */
  protected spectatorFollowTargets = new Map<string, string>();

  /** Wall-clock ms when the room first transitioned to in-progress.
   *  Used by the 3-min tournament cap (independent of per-game state.timer). */
  private matchStartedAtMs: number = 0;
  /** Hard cap on the whole room — 3 min for tournament matches. */
  private roomCapMs: number = 180_000;
  /** Marks a tournament series as a draw (e.g. tied at the 3-min cap). */
  private isSeriesDraw: boolean = false;

  onMatchEnd?: (winnerId: string, matchFirestoreId: string) => void;

  maxClients = 10;

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    this.isPrivateRoom = !!options.private;

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enableTournament === false) throw new Error("Tournament disabled");
    if (this.globalSettings?.maxActiveRooms) setMaxActiveRooms(this.globalSettings.maxActiveRooms);

    this.setState(new GameState());
    this.state.mode = "tournament";
    this.state.status = "waiting";
    this.state.timer = 180;

    if (options.matchId) {
      const cb = TournamentBattleRoom.pendingMatchCallbacks.get(options.matchId);
      if (cb) {
        this.onMatchEnd = cb;
        TournamentBattleRoom.pendingMatchCallbacks.delete(options.matchId);
      }
    }

    this.state.tournamentId = options.tournamentId || "";
    this.state.tournamentName = options.tournamentName || "";
    this.state.roundNumber = options.roundNumber || 0;
    this.state.tournamentMatchId = options.matchId || "";

    const bestOf = normalizeBestOf(options.bestOf);
    this.state.targetWins = targetWinsFor(bestOf);

    const seed = hashString(options.matchId || String(Date.now()));
    this.rand = createPRNG(seed);

    const arenaId = options.arenaId || "default";
    this.arenaCache = await loadArena(arenaId);
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, arenaId);
      console.log(`✅ TournamentBattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(arenaId);
    }

    if (options.arenaSystemId) {
      this.arenaSystem = await loadArenaSystem(options.arenaSystemId);
      if (this.arenaSystem) {
        console.log(`✅ TournamentBattleRoom: loaded arena system ${this.arenaSystem.displayName}`);
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

    const aiParticipants: Array<{ userId: string; username: string; beybladeId: string; difficulty: AIDifficulty }> =
      options.aiParticipants || [];
    for (const aiP of aiParticipants) {
      await this.createAIParticipant(aiP.userId, aiP.username, aiP.beybladeId, aiP.difficulty);
    }

    this.onMessage("input", (client, message: number | PlayerInput) => {
      this.handleInput(client, normalizeInput(message));
    });

    this.onMessage("spectator:follow", (client, message: { targetBeybladeId?: string }) => {
      this.spectatorFollowTargets.set(client.sessionId, message?.targetBeybladeId ?? "");
    });

    // AI sessions are all registered by this point — seed the live ignored set
    this.aiSessions.forEach(s => this.launchIgnoredSessions.add(s));
    this.registerLaunchInputHandler(this.launchIgnoredSessions);

    if (aiParticipants.length >= 2) {
      this.startMatch();
    }

    console.log(`TournamentBattleRoom created: tournament=${options.tournamentId} match=${options.matchId}`);
  }

  async onJoin(client: Client, options: JoinOptions) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      this.launchIgnoredSessions.add(client.sessionId);
      console.log(`Spectator joined TournamentBattleRoom (${this.state.spectatorCount} watching)`);
      return;
    }

    const humanSlotsFilled = this.playerSessions.size - this.aiSessions.size;
    if (humanSlotsFilled >= 2) {
      client.leave(4000, "Match full");
      return;
    }

    // Clear idle timer if a player rejoins a private room
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }

    this.playerSessions.add(client.sessionId);
    this.comboTrackers.set(client.sessionId, createComboTracker());
    console.log(`Player ${client.sessionId} joined TournamentBattleRoom (${this.playerSessions.size}/2 slots)`);

    const beybladeData: BeybladeStats | null = await loadBeyblade(options.beybladeId);
    this.beybladeDataCache.set(client.sessionId, beybladeData);

    const beyblade = new Beyblade();
    beyblade.id = client.sessionId;
    beyblade.userId = options.userId || client.sessionId;
    beyblade.username = options.username || "Player";
    beyblade.beybladeId = options.beybladeId || "default";
    beyblade.isAI = false;

    if (beybladeData) {
      this.applyBeybladeStats(beyblade, beybladeData);
    } else {
      this.applyDefaultStats(beyblade);
    }

    beyblade.health = beyblade.maxStamina;
    beyblade.maxHealth = beyblade.maxStamina;

    const spawnIndex = this.playerSessions.size - 1;
    const spawnOffset = SPAWN_OFFSETS[spawnIndex % SPAWN_OFFSETS.length];
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    beyblade.x = arenaHalfW + Math.cos(spawnOffset.angle) * spawnRadius;
    beyblade.y = arenaHalfH + Math.sin(spawnOffset.angle) * spawnRadius;
    this.spawnPositions.set(client.sessionId, { x: beyblade.x, y: beyblade.y, angle: spawnOffset.angle });

    const pFlags = resolvePhysicsFlags((beybladeData as any)?.physicsFlags);
    beyblade.collisionWithBeys       = pFlags.collisionWithBeys;
    beyblade.collisionWithArena      = pFlags.collisionWithArena;
    beyblade.collisionWithObstacles  = pFlags.collisionWithObstacles;
    beyblade.invulnerable            = pFlags.invulnerable;
    beyblade.noKnockback             = pFlags.noKnockback;

    this.physics.createBeyblade(beyblade.id, beyblade.x, beyblade.y, beyblade.radius, beyblade.mass, beybladeData || undefined, pFlags);
    this.physics.setAngularVelocity(beyblade.id, (beyblade.spinDirection === "left" ? -1 : 1) * (beyblade.maxSpin / 200));
    this.state.beyblades.set(client.sessionId, beyblade);
    this.state.seriesWins.set(beyblade.userId, 0);

    // Expand gimmicks for this bey
    const gimmickDefsCache = await loadGimmickDefs();
    const gimmickIds: string[] = (beybladeData as any)?.gimmickIds ?? [];
    if (gimmickIds.length > 0) {
      const instances = expandGimmicks(gimmickIds, gimmickDefsCache);
      instances.forEach(inst => beyblade.mechanics.push(inst));
    }

    if (this.playerSessions.size >= 2) {
      this.startMatch();
    }
  }

  onLeave(client: Client, _consented: boolean) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }

    if (this.aiSessions.has(client.sessionId)) return;

    console.log(`Player ${client.sessionId} left TournamentBattleRoom`);
    this.playerSessions.delete(client.sessionId);
    this.comboTrackers.delete(client.sessionId);
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

    const humanCount = this.playerSessions.size - this.aiSessions.size;
    if (humanCount === 0) {
      if (this.isPrivateRoom) {
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
    console.log(`TournamentBattleRoom disposed: ${this.state.tournamentMatchId}`);
    releaseRoom();
    this.physics.destroy();
  }

  // ─── AI participant creation (called from onCreate) ──────────────────────────

  private async createAIParticipant(
    userId: string,
    username: string,
    beybladeId: string,
    difficulty: AIDifficulty
  ) {
    const aiData: BeybladeStats | null = await loadBeyblade(beybladeId);
    this.beybladeDataCache.set(userId, aiData);

    const ai = new Beyblade();
    ai.id = userId;
    ai.userId = userId;
    ai.username = username;
    ai.beybladeId = beybladeId;
    ai.isAI = true;

    if (aiData) {
      this.applyBeybladeStats(ai, aiData);
    } else {
      this.applyDefaultStats(ai);
    }

    ai.health = ai.maxStamina;
    ai.maxHealth = ai.maxStamina;

    const spawnIndex = this.playerSessions.size;
    const spawnOffset = SPAWN_OFFSETS[spawnIndex % SPAWN_OFFSETS.length];
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    ai.x = arenaHalfW + Math.cos(spawnOffset.angle) * spawnRadius;
    ai.y = arenaHalfH + Math.sin(spawnOffset.angle) * spawnRadius;
    this.spawnPositions.set(userId, { x: ai.x, y: ai.y, angle: spawnOffset.angle });

    const aiFlags = resolvePhysicsFlags((aiData as any)?.physicsFlags);
    ai.collisionWithBeys       = aiFlags.collisionWithBeys;
    ai.collisionWithArena      = aiFlags.collisionWithArena;
    ai.collisionWithObstacles  = aiFlags.collisionWithObstacles;
    ai.invulnerable            = aiFlags.invulnerable;
    ai.noKnockback             = aiFlags.noKnockback;

    this.physics.createBeyblade(userId, ai.x, ai.y, ai.radius, ai.mass, aiData || undefined, aiFlags);
    this.physics.setAngularVelocity(userId, (ai.spinDirection === "left" ? -1 : 1) * (ai.maxSpin / 200));
    this.state.beyblades.set(userId, ai);
    this.state.seriesWins.set(userId, 0);
    this.aiControllers.set(userId, new AIController(difficulty));
    this.aiSessions.add(userId);
    this.playerSessions.add(userId);
  }

  private startMatch() {
    if (this.state.status !== "waiting") return;
    this.state.status = "warmup";
    this.lastInputTime = Date.now();
    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase });
  }

  // ─── Input handling — delegates to shared/rooms/InputHandler ────────────────

  private handleInput(client: Client, message: PlayerInput) {
    if (this.spectatorSessions.has(client.sessionId)) return;
    if (this.aiSessions.has(client.sessionId)) return;

    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive || this.state.status !== "in-progress") return;
    this.lastInputTime = Date.now();

    const forceMagnitude = computeForceMagnitude(beyblade);

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

    // ── Combo detection ──────────────────────────────────────────────────────
    const tracker = this.comboTrackers.get(client.sessionId);
    if (tracker && message.comboKeys && message.comboKeys.length > 0) {
      const now = Date.now();
      const attachedIds: string[] = Array.from(beyblade.comboIds).filter((s): s is string => typeof s === "string");
      const combo = detectCombo(tracker, message.comboKeys, now, {
        attachedComboIds: attachedIds,
        power: beyblade.power,
        beybladeType: beyblade.type,
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
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * rushForce, Math.sin(beyblade.rotation) * rushForce);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.8);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        this.broadcast("special-move", { ...movePayload, type: "stampede-rush" });
        break;
      }
      case "defense": {
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(beyblade.maxSpin / 200) : (beyblade.maxSpin / 200));
        this.physics.applyForce(beyblade.id, -state.velocityX * beyblade.mass * 0.8, -state.velocityY * beyblade.mass * 0.8);
        beyblade.isInvulnerable = true;
        beyblade.invulnerabilityTimer = 1.5;
        this.broadcast("special-move", { ...movePayload, type: "gyro-anchor" });
        break;
      }
      case "stamina": {
        this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * 0.002 * beyblade.mass, Math.cos(beyblade.rotation) * 0.002 * beyblade.mass);
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200));
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { ...movePayload, type: "spin-recovery" });
        break;
      }
      case "balanced": {
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * 0.003 * beyblade.mass, Math.sin(beyblade.rotation) * 0.003 * beyblade.mass);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { ...movePayload, type: "tactical-burst" });
        break;
      }
    }
  }

  // ─── AI input — uses shared InputHandler ─────────────────────────────────────

  private applyAIInput(beyblade: Beyblade, input: PlayerInput) {
    if (!beyblade.isActive) return;

    const forceMagnitude = computeForceMagnitude(beyblade);

    applyMovementInput(beyblade, input, forceMagnitude, this.physics);
    applyActionInput(
      beyblade,
      input,
      forceMagnitude,
      this.physics,
      (b) => this.handleSpecialMove(b),
    );
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
    advanceArenaTilt(this.state.arena, dt);
    if (this.state.arena.tiltMode === "weight") {
      const cx = (this.state.arena.width  * 16) / 2;
      const cy = (this.state.arena.height * 16) / 2;
      const r  = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
      applyWeightTilt(this.state.arena, this.state.beyblades, cx, cy, r);
    }

    if (this.tickWarmupPhase(dt)) {
      this.aiLaunchTimer = AI_LAUNCH_DELAY_S;
      return;
    }
    if (this.state.status === "warmup") return;

    if (this.state.status === "launching") {
      if (this.aiLaunchTimer > 0) {
        this.aiLaunchTimer -= dt;
        if (this.aiLaunchTimer <= 0) {
          this.aiSessions.forEach(aiId => {
            const bey = this.state.beyblades.get(aiId);
            if (bey && !bey.launchReady && !bey.launchFailed) {
              bey.launchTilt = (this.rand() - 0.5) * 20;
              bey.launchPosition = 0.3 + this.rand() * 0.3;
              bey.launchPower = 90 + this.rand() * 30;
              bey.launchChargingStarted = true;
              bey.launchReady = true;
            }
          });
        }
      }
    }

    if (this.tickLaunchPhase(dt)) {
      this.startMatchFromLaunch();
      return;
    }
    if (this.state.status === "launching") return;

    if (this.state.status !== "in-progress") return;

    // 3-min hard room cap across the entire series (any BO size).
    if (this.matchStartedAtMs > 0 && Date.now() - this.matchStartedAtMs >= this.roomCapMs) {
      this.endSeriesOnCap();
      return;
    }

    this.physics.update(deltaTime);

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    // ── AI input generation ──────────────────────────────────────────────────
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;

    this.aiSessions.forEach((aiId) => {
      const aiBeyblade = this.state.beyblades.get(aiId);
      const aiController = this.aiControllers.get(aiId);
      if (!aiBeyblade || !aiBeyblade.isActive || !aiController) return;

      const allSnapshots = Array.from(this.state.beyblades.values()).map(b => ({
        id: b.id, x: b.x, y: b.y,
        velocityX: b.velocityX, velocityY: b.velocityY,
        rotation: b.rotation, spin: b.spin, maxSpin: b.maxSpin,
        isAirborne: b.isAirborne, inPit: b.inPit, power: b.power,
        spinDirection: b.spinDirection, type: b.type,
      }));
      const aiSnapshot = allSnapshots.find(s => s.id === aiId)!;
      const opponents = allSnapshots.filter(s => s.id !== aiId && (this.state.beyblades.get(s.id)?.isActive ?? false));
      const aiInput = aiController.computeInput(aiSnapshot, opponents, arenaHalfW, arenaHalfH, arenaRadius);
      this.applyAIInput(aiBeyblade, aiInput);
    });

    // ── Beyblade-vs-beyblade collision ───────────────────────────────────────
    const beybladeIds = Array.from(this.state.beyblades.keys());
    for (let i = 0; i < beybladeIds.length; i++) {
      for (let j = i + 1; j < beybladeIds.length; j++) {
        const b1 = this.state.beyblades.get(beybladeIds[i]);
        const b2 = this.state.beyblades.get(beybladeIds[j]);
        if (!b1 || !b2 || !b1.isActive || !b2.isActive) continue;

        const collision = this.physics.checkBeybladeCollision(beybladeIds[i], beybladeIds[j]);
        if (!collision) continue;

        const dmg = this.physics.calculateCollisionDamage(collision, b1, b2);
        b1.health = Math.max(0, b1.health - dmg.damage1);
        b2.health = Math.max(0, b2.health - dmg.damage2);
        b1.spin = Math.max(0, b1.spin - dmg.spinSteal2);
        b2.spin = Math.max(0, b2.spin - dmg.spinSteal1);
        b1.damageDealt += dmg.damage2; b2.damageDealt += dmg.damage1;
        b1.damageReceived += dmg.damage1; b2.damageReceived += dmg.damage2;
        b1.collisions++; b2.collisions++;
        b1.power = Math.min(100, b1.power + (dmg.damage2 > 0 ? 0.5 : 0) + (dmg.damage1 > 0 ? 0.3 : 0));
        b2.power = Math.min(100, b2.power + (dmg.damage1 > 0 ? 0.5 : 0) + (dmg.damage2 > 0 ? 0.3 : 0));
        if (dmg.damage1 > 15) b1.attackBuffTimer = 0;
        if (dmg.damage2 > 15) b2.attackBuffTimer = 0;
        this.broadcast("collision", { p1: beybladeIds[i], p2: beybladeIds[j], damage1: dmg.damage1, damage2: dmg.damage2, contactPoint: collision.contactPoint });

        const impactForce = Math.max(dmg.damage1, dmg.damage2);
        this.onBeyCollided(beybladeIds[i], beybladeIds[j], impactForce);
      }
    }

    // ── Per-beyblade update ──────────────────────────────────────────────────
    const arenaData = this.arenaCache;
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

      // Arena tilt: lateral gravity toward the downhill side
      if (this.state.arena.tiltAngle !== 0) {
        const { fx, fy } = computeTiltForce(this.state.arena.tiltAngle, this.state.arena.tiltDirection, beyblade.mass);
        this.physics.applyForce(beyblade.id, fx, fy);
      }

      {
        const spinRatio = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
        const slopeCx = (this.state.arena.width * 16) / 2;
        const slopeCy = (this.state.arena.height * 16) / 2;
        const slopeR  = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
        const radialDist = Math.hypot(beyblade.x - slopeCx, beyblade.y - slopeCy);
        const floorAngle = getFloorAngleAtRadius(radialDist, slopeR, this.state.arena.wallAngle);
        const slopeFactor = Math.max(0.5, Math.cos(floorAngle));
        const decayThisTick = beyblade.spinDecayRate * dt * (1 + (1 - spinRatio) * 0.5) * slopeFactor;
        beyblade.spin = Math.max(0, beyblade.spin - decayThisTick);
      }
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      if (beyblade.spin <= 0 && beyblade.isActive) {
        beyblade.isActive = false;
        beyblade.health = 0;
        this.broadcast("spin-out", { playerId: beyblade.id, username: beyblade.username, x: beyblade.x, y: beyblade.y, type: beyblade.type });
      }

      if (beyblade.attackCooldown > 0) beyblade.attackCooldown -= dt;
      if (beyblade.specialCooldown > 0) beyblade.specialCooldown -= dt;
      if (beyblade.isInvulnerable) { beyblade.invulnerabilityTimer -= dt; if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false; }
      if (beyblade.attackBuffTimer > 0) beyblade.attackBuffTimer = Math.max(0, beyblade.attackBuffTimer - dt);
      if (beyblade.dodgeBuffTimer > 0) { beyblade.dodgeBuffTimer = Math.max(0, beyblade.dodgeBuffTimer - dt); if (beyblade.inPit) beyblade.dodgeBuffTimer = 0; }
      if (beyblade.defenseBuffTimer > 0) { beyblade.defenseBuffTimer = Math.max(0, beyblade.defenseBuffTimer - dt); if (beyblade.defenseBuffTimer <= 0) beyblade.isDefending = false; }
      if (beyblade.isDefending) { beyblade.stamina = Math.max(0, beyblade.stamina - 60 * dt); if (beyblade.stamina < 10) { beyblade.isDefending = false; beyblade.defenseBuffTimer = 0; } }
      if (beyblade.isAirborne) { beyblade.airborneTimer = Math.max(0, beyblade.airborneTimer - dt); if (beyblade.airborneTimer <= 0) { beyblade.isAirborne = false; beyblade.landingLag = 0.2; } }
      if (beyblade.landingLag > 0) beyblade.landingLag = Math.max(0, beyblade.landingLag - dt);
      if (beyblade.stunTimer > 0) beyblade.stunTimer = Math.max(0, beyblade.stunTimer - dt);
      if (beyblade.comboExecuting && beyblade.comboTimer > 0) { beyblade.comboTimer = Math.max(0, beyblade.comboTimer - dt); if (beyblade.comboTimer <= 0) beyblade.comboExecuting = false; }
      if (beyblade.inLoop) beyblade.power = Math.min(100, beyblade.power + 2);

      // 2.5D hook (no-op in base; Parts25DTournamentBattleRoom overrides).
      this.onTickedBey(beyblade, dt);

      if (this.state.arena.shape === "circle") {
        const wallRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
        const ringOutRadius = wallRadius * 0.90;
        const isOut = this.physics.isOutOfBounds(beyblade.id, ringOutRadius, (this.state.arena.width * 16) / 2, (this.state.arena.height * 16) / 2);
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

  // ─── Win condition + series — delegates to shared/rooms/SeriesManager ───────

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

      this.persistMatch(winner).then((matchFirestoreId) => {
        if (this.onMatchEnd && winnerId) this.onMatchEnd(winnerId, matchFirestoreId);
      }).catch((err) => {
        console.error("[TournamentBattleRoom] persistMatch failed:", err);
        if (this.onMatchEnd && winnerId) this.onMatchEnd(winnerId, "");
      });

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

  private startMatchFromLaunch() {
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
    if (this.matchStartedAtMs === 0) this.matchStartedAtMs = Date.now();
    this.broadcast("match-start", {});
  }

  private resetForNextGame() {
    resetStateForNextGame(this.state, this.spawnPositions, this.physics, WARMUP_DURATION_S);
    this.resetWarmupTimer();

    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase, gameNumber: this.state.currentGame });
  }

  /**
   * Called when the 3-min room cap fires. If someone leads `seriesWins`, they win
   * a "ring-out-on-clock" style finish; on tie, the series is a draw.
   */
  private endSeriesOnCap() {
    if (this.state.status === "series-finished") return;
    const beyblades = Array.from(this.state.beyblades.values()).filter(b => !b.isAI);
    let leader: Beyblade | null = null;
    let leaderWins = -1;
    let tie = false;
    for (const b of beyblades) {
      const w = this.state.seriesWins.get(b.userId) ?? 0;
      if (w > leaderWins) { leader = b; leaderWins = w; tie = false; }
      else if (w === leaderWins && leader && b.userId !== leader.userId) { tie = true; }
    }

    const seriesScore = buildSeriesScore(this.state);
    this.state.status = "series-finished";
    this.isSeriesDraw = tie;
    this.state.winner = tie ? "" : (leader?.userId ?? "");

    this.broadcast("series-end", {
      winner: !tie && leader ? { id: leader.id, userId: leader.userId, username: leader.username } : null,
      isDraw: tie,
      seriesScore,
      reason: "room-cap",
    });

    this.persistMatch(tie ? null : leader).then((matchFirestoreId) => {
      if (this.onMatchEnd) this.onMatchEnd(this.state.winner, matchFirestoreId);
    }).catch((err) => {
      console.error("[TournamentBattleRoom] persistMatch (cap) failed:", err);
      if (this.onMatchEnd) this.onMatchEnd(this.state.winner, "");
    });

    setTimeout(() => this.disconnect(), 5000);
  }

  private async persistMatch(winner: Beyblade | null): Promise<string> {
    try {
      const beyblades = Array.from(this.state.beyblades.values());
      const seriesScore = buildSeriesScore(this.state);

      const matchData = {
        mode: "tournament",
        tournamentId: this.state.tournamentId,
        tournamentMatchId: this.state.tournamentMatchId,
        roundNumber: this.state.roundNumber,
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
          isAI: b.isAI,
        })),
      };

      const result = await saveMatch(matchData);
      const matchFirestoreId: string = (result as any)?.id ?? "";

      // Tournament points: winner +2, draw → both +1, loser +0.
      const humans = beyblades.filter(b => !b.isAI);
      if (this.isSeriesDraw) {
        for (const b of humans) {
          await updatePlayerStats(b.userId, {
            matchesPlayed: 1,
            tournamentPoints: 1,
            totalDamageDealt: b.damageDealt,
            totalCollisions: b.collisions,
          });
        }
      } else if (winner && !winner.isAI) {
        await updatePlayerStats(winner.userId, {
          matchesPlayed: 1,
          wins: 1,
          tournamentPoints: 2,
          totalDamageDealt: winner.damageDealt,
          totalCollisions: winner.collisions,
        });
        // Loser(s): record matchesPlayed but no points/wins. (Loss field already tracked elsewhere.)
        for (const b of humans) {
          if (b.userId === winner.userId) continue;
          await updatePlayerStats(b.userId, {
            matchesPlayed: 1,
            totalDamageDealt: b.damageDealt,
            totalCollisions: b.collisions,
          });
        }
      }

      return matchFirestoreId;
    } catch (err) {
      console.error("Failed to persist tournament match:", err);
      return "";
    }
  }

  protected override get defaultArenaName(): string { return "Tournament Arena"; }
}

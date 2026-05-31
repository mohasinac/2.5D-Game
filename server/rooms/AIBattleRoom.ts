import { Client } from "colyseus";
import { BaseRoom } from "./BaseRoom";
import { AI_LAUNCH_DELAY_S } from "../shared/constants/gameConstants";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem } from "../utils/firebase";
import { loadGimmickDefs } from "../utils/firestoreLoaders";
import { expandGimmicks } from "../utils/gimmickExpander";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom, setMaxActiveRooms } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import { ComboTracker, detectCombo, createComboTracker } from "../shared/utils/comboSystem";
import { normalizeBestOf, targetWinsFor } from "../shared/utils/seriesFormat";
import { normalizeInput, type PlayerInput } from "../shared/utils/bitmask";
import { wallBowlForce, computeTiltForce, getFloorAngleAtRadius } from "../shared/physics/ArenaUtils";
import { resolvePhysicsFlags } from "../utils/physicsFlags";
import { getSlotColor } from "../constants/playerColors";
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
  resetBeybladeForNextGame,
} from "../shared/rooms/SeriesManager";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";
import { AIController, type AIDifficulty } from "../ai/AIController";

// [SERVER-ROOM] AIBattleRoom — one human vs one AI opponent + spectators.
// maxClients=9 (1 human player slot + 8 spectator slots).

interface JoinOptions {
  beybladeId: string;
  aiBeybladeId: string;
  arenaId: string;
  arenaSystemId?: string;
  userId: string;
  username: string;
  aiDifficulty?: AIDifficulty;
  spectate?: boolean;
  bestOf?: 1 | 3 | 5;
  /** Admin-only AI vs AI mode — no human seat; both contestants are AI. */
  aiVsAi?: boolean;
  aiP1BeybladeId?: string;
  aiP2BeybladeId?: string;
  aiP1Difficulty?: AIDifficulty;
  aiP2Difficulty?: AIDifficulty;
  /** Number of AI opponents to spawn alongside the human player (default 1, max 7). */
  aiCount?: number;
}

const AI_SESSION_ID = "__ai__";
const AI_P1_SESSION_ID = "__ai_p1__";
const AI_P2_SESSION_ID = "__ai_p2__";
/** Dispose an AI-vs-AI room if no spectator joins within this window. */
const AI_VS_AI_NO_SPECTATOR_TIMEOUT_MS = 30_000;

export class AIBattleRoom extends BaseRoom<GameState> {
  private aiController!: AIController;
  private matchStarted = false;
  private lastInputTime = 0;
  private humanSessionId: string | null = null;
  private spectatorSessions = new Set<string>();
  /** Per-session camera-follow target id. Optional — purely informational. */
  private spectatorFollowTargets = new Map<string, string>();
  private humanBeybladeData: BeybladeStats | null = null;
  private aiBeybladeData: BeybladeStats | null = null;
  private humanSpawnPos = { x: 0, y: 0, angle: Math.PI };
  private aiSpawnPos = { x: 0, y: 0, angle: 0 };
  private aiLaunchTimer = AI_LAUNCH_DELAY_S;
  private aiDifficulty: AIDifficulty = "medium";
  private aiBeybladeId = "dark_wolf_df145fs";
  private comboTrackers = new Map<string, ComboTracker>();
  // Separate tracker for the AI beyblade (no session id).
  private aiComboTracker: ComboTracker = createComboTracker();
  // AI vs AI — populated when aiVsAi=true (admin spectator-only test mode).
  private isAiVsAi = false;
  private aiControllers = new Map<string, AIController>();
  private aiComboTrackers = new Map<string, ComboTracker>();
  private aiBeybladeIds = new Map<string, string>(); // sessionId → beybladeId
  private aiBeybladeDataMap = new Map<string, BeybladeStats | null>();
  private aiSpawnPositions = new Map<string, { x: number; y: number }>();
  private noSpectatorTimeout: NodeJS.Timeout | null = null;

  maxClients = 9;

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    console.log("AIBattleRoom created", options);

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enableAiBattle === false) throw new Error("AI Battle disabled");
    if (this.globalSettings?.maxActiveRooms) setMaxActiveRooms(this.globalSettings.maxActiveRooms);

    this.setState(new GameState());
    this.state.mode = "ai-battle";
    this.state.status = "waiting";
    this.state.timer = 180;

    const bestOf = normalizeBestOf(options.bestOf);
    this.state.targetWins = targetWinsFor(bestOf);

    const seed = hashString(options.matchId || String(Date.now()));
    this.rand = createPRNG(seed);

    this.arenaCache = await loadArena(options.arenaId || "classic_stadium");
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, options.arenaId);
      console.log(`✅ AIBattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(options.arenaId || "classic_stadium");
    }

    if (options.arenaSystemId) {
      this.arenaSystem = await loadArenaSystem(options.arenaSystemId);
      if (this.arenaSystem) {
        console.log(`✅ AIBattleRoom: loaded arena system ${this.arenaSystem.displayName}`);
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

    this.onMessage("input", (client, message: number | PlayerInput) => {
      this.handleInput(client, normalizeInput(message));
    });

    // Camera-follow announce from spectators — purely informational. The camera
    // is client-side; this lets the server know who they're watching so HUDs
    // (and future analytics) can reflect it.
    this.onMessage("spectator:follow", (client, message: { targetBeybladeId?: string }) => {
      this.spectatorFollowTargets.set(client.sessionId, message?.targetBeybladeId ?? "");
    });

    // K10: possession-request — player swaps control to a nearby arena-spawned friendly bey
    this.onMessage("possession-request", (client, data: { direction: "left" | "right" | "up" | "down" }) => {
      this.handleSpatialPossession(data.direction, client.sessionId);
    });

    // Client-side AI input — allows client AI to submit bitmasks for AI beys
    this.registerAIInputHandler((beyId, bitmask) => {
      const input = normalizeInput(bitmask);
      this.aiController?.overrideInput(beyId, input);
    });

    // ── AI vs AI bootstrap (admin-only) ─────────────────────────────────────
    // Spawn two AI beyblades immediately and start the match. Human seats are
    // closed; only spectators may join. Room auto-disposes when the last
    // spectator leaves (or after 30s with no spectator).
    if (options.aiVsAi) {
      this.isAiVsAi = true;
      this.autoDispose = false;
      await this.spawnAiVsAiMatch(options);
      this.noSpectatorTimeout = setTimeout(() => {
        if (this.spectatorSessions.size === 0) {
          console.log("[AIBattleRoom] AI-vs-AI: no spectator joined within timeout, disposing");
          this.disconnect();
        }
      }, AI_VS_AI_NO_SPECTATOR_TIMEOUT_MS);
    }
  }

  // ─── AI vs AI spawn (admin test mode) ──────────────────────────────────────

  private async spawnAiVsAiMatch(options: JoinOptions): Promise<void> {
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    const p1Id = options.aiP1BeybladeId || "default";
    const p2Id = options.aiP2BeybladeId || "default";
    const p1Diff: AIDifficulty = options.aiP1Difficulty || "medium";
    const p2Diff: AIDifficulty = options.aiP2Difficulty || options.aiDifficulty || "medium";

    await this.addAiContestant(AI_P1_SESSION_ID, p1Id, p1Diff, { x: arenaHalfW - spawnRadius, y: arenaHalfH });
    await this.addAiContestant(AI_P2_SESSION_ID, p2Id, p2Diff, { x: arenaHalfW + spawnRadius, y: arenaHalfH });

    this.matchStarted = true;
    this.state.status = "in-progress";
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now(); // prevent idle-disconnect from firing immediately

    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-start", {});
    console.log(`✅ AIBattleRoom (AI vs AI): ${p1Id}/${p1Diff} vs ${p2Id}/${p2Diff}`);
  }

  private async addAiContestant(
    sessionId: string,
    beybladeId: string,
    difficulty: AIDifficulty,
    spawn: { x: number; y: number }
  ): Promise<void> {
    const data: BeybladeStats | null = await loadBeyblade(beybladeId);
    this.aiBeybladeDataMap.set(sessionId, data);
    this.aiBeybladeIds.set(sessionId, beybladeId);
    this.aiSpawnPositions.set(sessionId, spawn);
    this.aiControllers.set(sessionId, new AIController(difficulty));
    this.aiComboTrackers.set(sessionId, createComboTracker());

    const bey = new Beyblade();
    bey.id = sessionId;
    bey.userId = sessionId;
    bey.username = data?.displayName ? `${data.displayName} (${difficulty})` : `Dark Wolf (${difficulty})`;
    bey.beybladeId = beybladeId;
    bey.isAI = true;
    if (data) this.applyBeybladeStats(bey, data); else this.applyDefaultAiStats(bey);
    bey.health = bey.maxStamina;
    bey.maxHealth = bey.maxStamina;
    bey.power = 100;
    bey.x = spawn.x;
    bey.y = spawn.y;
    const bFlags = resolvePhysicsFlags((data as any)?.physicsFlags);
    bey.collisionWithBeys       = bFlags.collisionWithBeys;
    bey.collisionWithArena      = bFlags.collisionWithArena;
    bey.collisionWithObstacles  = bFlags.collisionWithObstacles;
    bey.invulnerable            = bFlags.invulnerable;
    bey.noKnockback             = bFlags.noKnockback;

    this.physics.createBeyblade(bey.id, bey.x, bey.y, bey.radius, bey.mass, data || undefined, bFlags);
    this.physics.setAngularVelocity(bey.id, (bey.spinDirection === "left" ? -1 : 1) * (bey.maxSpin / 200));
    // AI beys get the next slot color after the human player (slot 0 = human)
    const aiSlotIndex = this.state.playerSlots.size;
    this.state.playerSlots.set(bey.userId, aiSlotIndex);
    bey.slotColor = getSlotColor(aiSlotIndex);
    this.state.beyblades.set(sessionId, bey);
    this.state.seriesWins.set(bey.userId, 0);
  }

  async onJoin(client: Client, options: JoinOptions) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      if (this.noSpectatorTimeout) {
        clearTimeout(this.noSpectatorTimeout);
        this.noSpectatorTimeout = null;
      }
      console.log(`Spectator ${client.sessionId} joined AIBattleRoom`);
      return;
    }

    // AI-vs-AI rooms have no human seat at all — admin must explicitly spectate.
    if (this.isAiVsAi) {
      client.leave(4001, "AI vs AI room is spectator-only");
      return;
    }

    if (this.humanSessionId !== null) {
      client.leave(4000, "Match full");
      return;
    }

    this.humanSessionId = client.sessionId;
    this.comboTrackers.set(client.sessionId, createComboTracker());
    console.log(`Human player ${client.sessionId} joined AIBattleRoom`);

    const difficulty: AIDifficulty = options.aiDifficulty || "medium";
    this.aiDifficulty = difficulty;
    this.aiBeybladeId = options.aiBeybladeId || "dark_wolf_df145fs";
    this.aiController = new AIController(difficulty);

    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    // ── Load and create human beyblade ─────────────────────────────────────
    const humanData: BeybladeStats | null = await loadBeyblade(options.beybladeId);
    this.humanBeybladeData = humanData;
    const human = new Beyblade();
    human.id = client.sessionId;
    human.userId = options.userId || client.sessionId;
    human.username = options.username || "Player";
    human.beybladeId = options.beybladeId || "storm_pegasus_105rf";
    human.isAI = false;

    if (humanData) {
      this.applyBeybladeStats(human, humanData);
    } else {
      this.applyDefaultStats(human);
    }
    // TODO: if options.partOverrides, apply to resolved BeybladeSystem after load

    human.health = human.maxStamina;
    human.maxHealth = human.maxStamina;
    human.power = 100;
    human.x = arenaHalfW - spawnRadius;
    human.y = arenaHalfH;
    this.humanSpawnPos = { x: human.x, y: human.y, angle: Math.PI };

    const humanFlags = resolvePhysicsFlags((humanData as any)?.physicsFlags);
    human.collisionWithBeys       = humanFlags.collisionWithBeys;
    human.collisionWithArena      = humanFlags.collisionWithArena;
    human.collisionWithObstacles  = humanFlags.collisionWithObstacles;
    human.invulnerable            = humanFlags.invulnerable;
    human.noKnockback             = humanFlags.noKnockback;

    this.physics.createBeyblade(human.id, human.x, human.y, human.radius, human.mass, humanData || undefined, humanFlags);
    this.physics.setAngularVelocity(human.id, (human.spinDirection === "left" ? -1 : 1) * (human.maxSpin / 200));
    // Human player is always slot 0 (blue)
    this.state.playerSlots.set(human.userId, 0);
    human.slotColor = getSlotColor(0);
    this.state.beyblades.set(client.sessionId, human);
    this.state.seriesWins.set(human.userId, 0);

    // Expand gimmicks for human bey
    const gimmickDefsCache = await loadGimmickDefs();
    const humanGimmickIds: string[] = (humanData as any)?.gimmickIds ?? [];
    if (humanGimmickIds.length > 0) {
      const instances = expandGimmicks(humanGimmickIds, gimmickDefsCache);
      instances.forEach(inst => human.mechanics.push(inst));
    }

    // ── Load and create AI beyblade(s) ─────────────────────────────────────
    // aiCount defaults to 1; max 7 so total beyblades stay within room capacity (max 8).
    const aiCount = Math.min(7, Math.max(1, options.aiCount ?? 1));

    if (aiCount === 1) {
      // Original 1v1 layout: human left, AI right.
      await this.addAiContestant(AI_SESSION_ID, this.aiBeybladeId, difficulty, {
        x: arenaHalfW + spawnRadius,
        y: arenaHalfH,
      });
      this.aiBeybladeData = this.aiBeybladeDataMap.get(AI_SESSION_ID) ?? null;
      const aiState = this.state.beyblades.get(AI_SESSION_ID);
      if (aiState) {
        this.aiSpawnPos = { x: aiState.x, y: aiState.y, angle: 0 };
      }
    } else {
      // Multi-AI layout: evenly distribute all contestants on a circle.
      const totalSlots = aiCount + 1;
      const slotAngle = (i: number) => (Math.PI * 2 * i) / totalSlots - Math.PI / 2;

      // Reposition human to slot 0 on the circle.
      this.physics.removeBeyblade(client.sessionId);
      human.x = arenaHalfW + Math.cos(slotAngle(0)) * spawnRadius;
      human.y = arenaHalfH + Math.sin(slotAngle(0)) * spawnRadius;
      this.humanSpawnPos = { x: human.x, y: human.y, angle: slotAngle(0) + Math.PI };
      this.physics.createBeyblade(client.sessionId, human.x, human.y, human.radius, human.mass, humanData || undefined, humanFlags);
      this.physics.setAngularVelocity(client.sessionId, (human.spinDirection === "left" ? -1 : 1) * (human.maxSpin / 200));

      for (let idx = 0; idx < aiCount; idx++) {
        const aiSessionId = `${AI_SESSION_ID}_${idx}`;
        await this.addAiContestant(aiSessionId, this.aiBeybladeId, difficulty, {
          x: arenaHalfW + Math.cos(slotAngle(idx + 1)) * spawnRadius,
          y: arenaHalfH + Math.sin(slotAngle(idx + 1)) * spawnRadius,
        });
      }
    }

    this.matchStarted = true;
    this.state.status = "warmup";
    this.resetWarmupTimer();
    this.state.timer = this.warmupTimerBase;
    this.aiLaunchTimer = AI_LAUNCH_DELAY_S;
    this.lastInputTime = Date.now();

    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase });

    this.registerLaunchInputHandler(this.spectatorSessions);

    const aiNames = Array.from({ length: aiCount }, (_, i) => {
      const sid = aiCount === 1 ? AI_SESSION_ID : `${AI_SESSION_ID}_${i}`;
      return this.state.beyblades.get(sid)?.username ?? "Computer";
    }).join(", ");
    console.log(`✅ AIBattleRoom ready: ${human.username} vs ${aiNames} (${difficulty}, ${aiCount} AI)`);
  }

  onLeave(client: Client, _consented: boolean) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      // AI-vs-AI: dispose when the last spectator leaves (no human to keep room alive).
      if (this.isAiVsAi && this.spectatorSessions.size === 0) {
        console.log("[AIBattleRoom] AI-vs-AI: last spectator left, disposing");
        this.disconnect();
      }
      return;
    }

    console.log(`Human player ${client.sessionId} left AIBattleRoom`);
    this.humanSessionId = null;
    this.comboTrackers.delete(client.sessionId);
    if (this.matchStarted) {
      this.physics.removeBeyblade(client.sessionId);
      this.state.beyblades.delete(client.sessionId);
      // Remove single-AI bey
      if (this.state.beyblades.has(AI_SESSION_ID)) {
        this.physics.removeBeyblade(AI_SESSION_ID);
        this.state.beyblades.delete(AI_SESSION_ID);
      }
      // Remove multi-AI beys
      for (const sid of this.aiControllers.keys()) {
        this.physics.removeBeyblade(sid);
        this.state.beyblades.delete(sid);
      }
    }

    this.disconnect();
  }

  onDispose() {
    console.log("AIBattleRoom disposed");
    if (this.noSpectatorTimeout) {
      clearTimeout(this.noSpectatorTimeout);
      this.noSpectatorTimeout = null;
    }
    releaseRoom();
    this.physics.destroy();
  }

  // ─── Input handling (human player) — delegates to shared/rooms/InputHandler

  private handleInput(client: Client, message: PlayerInput) {
    if (this.spectatorSessions.has(client.sessionId)) return;
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

  private autoLaunchAIs(): void {
    const aiBey = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBey && !aiBey.launchReady && !aiBey.launchFailed) {
      aiBey.launchTilt = (this.rand() - 0.5) * 20;
      aiBey.launchPosition = 0.3 + this.rand() * 0.3;
      aiBey.launchPower = 90 + this.rand() * 30;
      aiBey.launchChargingStarted = true;
      aiBey.launchReady = true;
    }
    for (const [sid] of this.aiControllers) {
      const bey = this.state.beyblades.get(sid);
      if (bey && !bey.launchReady && !bey.launchFailed) {
        bey.launchTilt = (this.rand() - 0.5) * 20;
        bey.launchPosition = 0.3 + this.rand() * 0.3;
        bey.launchPower = 90 + this.rand() * 30;
        bey.launchChargingStarted = true;
        bey.launchReady = true;
      }
    }
  }

  // ─── Game tick ───────────────────────────────────────────────────────────────

  private tick(deltaTime: number) {
    const dt = deltaTime / 1000;

    if (this.tickWarmupPhase(dt)) {
      this.aiLaunchTimer = AI_LAUNCH_DELAY_S;
      return;
    }
    if (this.state.status === "warmup") return;

    if (this.state.status === "launching") {
      // AI auto-launches once after aiLaunchTimer seconds
      if (this.aiLaunchTimer > 0) {
        this.aiLaunchTimer -= dt;
        if (this.aiLaunchTimer <= 0) {
          this.autoLaunchAIs();
        }
      }
    }

    if (this.tickLaunchPhase(dt)) {
      this.startMatchFromLaunch();
      return;
    }
    if (this.state.status === "launching") return;

    if (this.state.status !== "in-progress") return;

    // Skip idle-disconnect when no human is at the controls — AI-vs-AI matches
    // would otherwise self-terminate after 60s with no input.
    if (!this.isAiVsAi && Date.now() - this.lastInputTime > 60_000) {
      this.broadcast("idle-disconnect", {});
      this.disconnect();
      return;
    }

    this.physics.update(deltaTime);

    // Server-authoritative arena rotation (Phase 14 review).
    advanceArenaRotation(this.state.arena, dt);
    advanceArenaTilt(this.state.arena, dt);
    if (this.state.arena.tiltMode === "weight") {
      const cx = (this.state.arena.width  * 16) / 2;
      const cy = (this.state.arena.height * 16) / 2;
      const r  = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
      applyWeightTilt(this.state.arena, this.state.beyblades, cx, cy, r);
    }

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    // ── AI input generation ──────────────────────────────────────────────────
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
    // #14: Build obstacle + pit lists for AI avoidance (physics coords = pixel coords)
    const aiObstacles: Array<{ x: number; y: number; radius: number }> = [];
    const aiPits: Array<{ x: number; y: number; radius: number }> = [];
    const _arenaData = this.arenaCache;
    if (_arenaData) {
      const aHalfW = (this.state.arena.width * 16) / 2;
      const aHalfH = (this.state.arena.height * 16) / 2;
      // Obstacles (pillars / barriers): use radius or derive from geometry
      for (const obs of (_arenaData.obstacles ?? [])) {
        const x = aHalfW + (obs.x ?? 0) * 16;
        const y = aHalfH + (obs.y ?? 0) * 16;
        const radius = (obs.radius ?? 30) * 16;
        aiObstacles.push({ x, y, radius });
      }
      // Pits: use radius from config, convert to pixels
      for (const pit of (_arenaData.pits ?? [])) {
        const x = aHalfW + (pit.x ?? 0) * 16;
        const y = aHalfH + (pit.y ?? 0) * 16;
        const radius = ((pit.radius ?? 30) / 2) * 16;
        aiPits.push({ x, y, radius });
      }
    }

    const allSnapshots = Array.from(this.state.beyblades.values()).map(b => ({
      id: b.id,
      x: b.x, y: b.y,
      velocityX: b.velocityX, velocityY: b.velocityY,
      rotation: b.rotation,
      spin: b.spin, maxSpin: b.maxSpin,
      isAirborne: b.isAirborne,
      inPit: b.inPit,
      power: b.power,
      spinDirection: b.spinDirection,
      type: b.type,
      // #14: Obstacle avoidance
      obstacles: aiObstacles,
      pits: aiPits,
    }));

    // Single-AI (human vs AI) path — preserved as-is.
    const singleAi = this.state.beyblades.get(AI_SESSION_ID);
    if (singleAi && singleAi.isActive && this.aiController) {
      const snap = allSnapshots.find(s => s.id === AI_SESSION_ID)!;
      const opponents = allSnapshots.filter(s => s.id !== AI_SESSION_ID && (this.state.beyblades.get(s.id)?.isActive ?? false));
      const input = this.aiController.computeInput(snap, opponents, arenaHalfW, arenaHalfH, arenaRadius);
      this.applyAIInput(singleAi, input);
    }

    // Dual-AI (admin AI vs AI) path — drive every controller in aiControllers.
    if (this.aiControllers.size > 0) {
      for (const [sid, controller] of this.aiControllers) {
        const bey = this.state.beyblades.get(sid);
        if (!bey || !bey.isActive) continue;
        const snap = allSnapshots.find(s => s.id === sid);
        if (!snap) continue;
        const opponents = allSnapshots.filter(s => s.id !== sid && (this.state.beyblades.get(s.id)?.isActive ?? false));
        const input = controller.computeInput(snap, opponents, arenaHalfW, arenaHalfH, arenaRadius);
        this.applyAIInput(bey, input, sid);
      }
    }

    // ── Beyblade-vs-beyblade collision ───────────────────────────────────────
    const ids = Array.from(this.state.beyblades.keys());
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const b1 = this.state.beyblades.get(ids[i]);
        const b2 = this.state.beyblades.get(ids[j]);
        if (!b1 || !b2 || !b1.isActive || !b2.isActive) continue;

        const collision = this.physics.checkBeybladeCollision(ids[i], ids[j]);
        if (!collision) continue;

        const dmg = this.physics.calculateCollisionDamage(collision, b1, b2);

        b1.power = Math.max(0, b1.power - dmg.damage1);
        b2.power = Math.max(0, b2.power - dmg.damage2);
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

        this.broadcast("collision", { p1: ids[i], p2: ids[j], damage1: dmg.damage1, damage2: dmg.damage2, spinSteal1: dmg.spinSteal1, spinSteal2: dmg.spinSteal2, contactPoint: collision.contactPoint });

        const impactForce = Math.max(dmg.damage1, dmg.damage2);
        this.onBeyCollided(ids[i], ids[j], impactForce);
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

      if (beyblade.isInvulnerable) {
        beyblade.invulnerabilityTimer -= dt;
        if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false;
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
        if (beyblade.airborneTimer <= 0) { beyblade.isAirborne = false; beyblade.landingLag = 0.2; }
      }
      if (beyblade.landingLag > 0) beyblade.landingLag = Math.max(0, beyblade.landingLag - dt);

      if (beyblade.stunTimer > 0) beyblade.stunTimer = Math.max(0, beyblade.stunTimer - dt);
      if (beyblade.comboExecuting && beyblade.comboTimer > 0) {
        beyblade.comboTimer = Math.max(0, beyblade.comboTimer - dt);
        if (beyblade.comboTimer <= 0) beyblade.comboExecuting = false;
      }

      if (beyblade.inLoop) beyblade.power = Math.min(100, beyblade.power + 2);

      // 2.5D hook (no-op in base; Parts25DAIBattleRoom overrides).
      this.onTickedBey(beyblade, dt);

      // Wall collision — apply damage and knockback with bowl force multiplier
      if (arenaData?.wall?.enabled) {
        const dx = beyblade.x - (this.state.arena.width * 16) / 2;
        const dy = beyblade.y - (this.state.arena.height * 16) / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;

        if (distance > arenaRadius * 0.95) {
          let wallDamage = arenaData.wall.baseDamage;
          if (arenaData.wall.hasSpikes) wallDamage *= arenaData.wall.spikeDamageMultiplier;
          wallDamage *= beyblade.damageTaken;

          beyblade.health -= wallDamage;
          beyblade.damageReceived += wallDamage;

          const wallForce = wallBowlForce(arenaData.wall.recoilDistance * beyblade.knockbackDistance, this.state.arena.wallAngle);
          this.physics.applyKnockback(beyblade.id, { x: -dx, y: -dy }, wallForce);
          this.broadcast("wall-collision", { playerId: beyblade.id, damage: wallDamage });
        }
      }

      // Ring-out check
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

  // ─── Apply AI computed input to physics — uses shared InputHandler ──────────

  private applyAIInput(beyblade: Beyblade, input: PlayerInput, sid?: string) {
    if (!beyblade.isActive) return;

    const forceMagnitude = computeForceMagnitude(beyblade);

    applyMovementInput(beyblade, input, forceMagnitude, this.physics, !!this.arenaSystem);
    applyActionInput(
      beyblade,
      input,
      forceMagnitude,
      this.physics,
      (b) => this.handleSpecialMove(b),
    );

    // AI combo detection — mirrors the human path in onMessage.
    if ((input as any).comboKeys && (input as any).comboKeys.length > 0) {
      const now = Date.now();
      const attachedIds: string[] = Array.from(beyblade.comboIds).filter((s): s is string => typeof s === "string");
      const tracker = sid ? (this.aiComboTrackers.get(sid) ?? this.aiComboTracker) : this.aiComboTracker;
      const combo = detectCombo(tracker, (input as any).comboKeys, now, {
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

    const applyLaunch = (bey: import("./schema/GameState").Beyblade, spawnAngle: number) => {
      if (bey.launchFailed) {
        bey.isActive = false;
        bey.health = 0;
        bey.eliminationType = "ring_out";
        this.physics.removeBeyblade(bey.id);
        return;
      }
      const radiusMult = 0.6 + bey.launchPosition * 0.8;
      bey.x = arenaHalfW + Math.cos(spawnAngle) * baseRadius * radiusMult;
      bey.y = arenaHalfH + Math.sin(spawnAngle) * baseRadius * radiusMult;
      this.physics.setPosition(bey.id, bey.x, bey.y);
      const powerFraction = Math.max(0.01, bey.launchPower / 100);
      bey.spin = bey.maxSpin * powerFraction;
      const angVel = (bey.spinDirection === "left" ? -1 : 1) * (bey.maxSpin * powerFraction / 200);
      this.physics.setAngularVelocity(bey.id, angVel);
      bey.beyTiltAngle = Math.abs(bey.launchTilt);
    };

    if (this.humanSessionId) {
      const humanBey = this.state.beyblades.get(this.humanSessionId);
      if (humanBey) applyLaunch(humanBey, this.humanSpawnPos.angle);
    }
    const aiBey = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBey) applyLaunch(aiBey, this.aiSpawnPos.angle);
    for (const [sid] of this.aiControllers) {
      const bey = this.state.beyblades.get(sid);
      const spawn = this.aiSpawnPositions.get(sid);
      if (bey && spawn) applyLaunch(bey, (spawn as any).angle ?? 0);
    }

    this.state.status = "in-progress";
    this.state.timer = 180;
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now();
    this.broadcast("match-start", {});
  }

  private resetForNextGame() {
    // For AI-vs-AI, there's no human; for the regular path the human must still be present.
    if (!this.isAiVsAi && this.humanSessionId === null) return;

    this.state.currentGame++;
    this.state.status = "warmup";
    this.resetWarmupTimer();
    this.state.timer = this.warmupTimerBase;
    this.aiLaunchTimer = AI_LAUNCH_DELAY_S;
    this.state.winner = "";

    if (this.humanSessionId) {
      const humanBeyblade = this.state.beyblades.get(this.humanSessionId);
      if (humanBeyblade) resetBeybladeForNextGame(humanBeyblade, this.humanSpawnPos, this.physics);
    }

    const aiBeyblade = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBeyblade) resetBeybladeForNextGame(aiBeyblade, this.aiSpawnPos, this.physics);

    // AI-vs-AI: reset every aiControllers entry to its stored spawn position.
    for (const [sid] of this.aiControllers) {
      const bey = this.state.beyblades.get(sid);
      const spawn = this.aiSpawnPositions.get(sid);
      if (bey && spawn) resetBeybladeForNextGame(bey, spawn, this.physics);
    }

    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase, gameNumber: this.state.currentGame });
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

  protected override get defaultArenaName(): string { return "AI Battle Arena"; }

  /**
   * Fallback AI beyblade — Dark Wolf DF145FS (CS13 Case 852).
   * attack=110  defense=100  stamina=150  (total 360)
   * mass=33.5 g, r_DW=21 mm (2.1 cm), FS tip μ≈0.25
   */
  private applyDefaultAiStats(bey: Beyblade): void {
    bey.type              = "balanced";
    bey.color             = "#7a0a2b";   // dark-red wolf
    bey.spinDirection     = "right";
    bey.mass              = 34;
    bey.radius            = 2.1;
    bey.attackPoints      = 110;
    bey.defensePoints     = 100;
    bey.staminaPoints     = 150;
    bey.damageMultiplier  = 1.77;        // 1.0 + 110 × 0.007
    bey.damageTaken       = 0.70;        // 1 − 100 × 0.003
    bey.knockbackDistance = 7.5;
    bey.invulnerabilityChance = 0.15;
    bey.spinStealFactor   = 0.35;
    bey.spinDecayRate     = 6.80;        // 8 × (1 − 150 × 0.001)
    bey.maxStamina        = 1600;
    bey.stamina           = 1600;
    bey.maxSpin           = 2240;        // 2000 × (1 + 150 × 0.0008)
    bey.spin              = 2240;
    bey.speedBonus        = 1.65;
    bey.specialMove       = "spin_recovery";
    bey.comboIds.clear();
    for (const id of ["guard-tap", "spin-leech-jab", "quick-dash-l"]) bey.comboIds.push(id);
  }
}

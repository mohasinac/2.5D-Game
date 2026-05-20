import { Room, Client } from "colyseus";
import { GameState, Beyblade } from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, saveMatch, updatePlayerStats } from "../utils/firebase";
import { loadGlobalSettings, updateMatchStatus, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom } from "../utils/roomCounter";
import { createPRNG } from "../utils/prng";
import { hashString } from "../utils/hashString";
import { AIController, type AIDifficulty } from "../ai/AIController";
import type { BeybladeStats, ArenaConfig } from "../types/shared";

// [SERVER-ROOM] TournamentBattleRoom — tournament match room (2 players + spectators).
// maxClients = 10: 2 player slots, up to 8 spectators.
// AI participants are created server-side (same pattern as AIBattleRoom).
// On match end calls TournamentScheduler.advanceRound via the onMatchEnd callback.

interface JoinOptions {
  spectate?: boolean;
  tournamentId?: string;
  matchId?: string;
  userId: string;
  username: string;
  beybladeId: string;
  isAI?: boolean;
  aiDifficulty?: AIDifficulty;
}

function decodeBitmask(mask: number): any {
  return {
    moveLeft:   (mask & (1 << 0)) !== 0,
    moveRight:  (mask & (1 << 1)) !== 0,
    moveUp:     (mask & (1 << 2)) !== 0,
    moveDown:   (mask & (1 << 3)) !== 0,
    attack:     (mask & (1 << 4)) !== 0,
    defense:    (mask & (1 << 5)) !== 0,
    dodge:      (mask & (1 << 6)) !== 0,
    jump:       (mask & (1 << 7)) !== 0,
    chargeHeld: (mask & (1 << 8)) !== 0,
    specialTap: (mask & (1 << 9)) !== 0,
  };
}

const SPAWN_OFFSETS = [
  { angle: 0 },
  { angle: Math.PI },
];

export class TournamentBattleRoom extends Room<GameState> {
  // Callbacks registered by TournamentScheduler before matchMaker.createRoom() is called.
  // Keyed by matchId (tournament_brackets doc id). Picked up in onCreate, then deleted.
  static pendingMatchCallbacks = new Map<string, (winnerId: string, matchFirestoreId: string) => void>();

  private physics!: PhysicsEngine;
  private arenaCache: ArenaConfig | null = null;
  private warmupTimer = 3;
  private lastInputTime = 0;
  private globalSettings: GlobalSettingsDoc | null = null;
  private rand!: () => number;
  private playerSessions = new Set<string>();
  private spectatorSessions = new Set<string>();
  private aiSessions = new Set<string>();
  private aiControllers = new Map<string, AIController>();
  private beybladeDataCache = new Map<string, BeybladeStats | null>();
  private spawnPositions = new Map<string, { x: number; y: number }>();

  // Called when the series ends — wired up from TournamentScheduler via pendingMatchCallbacks
  onMatchEnd?: (winnerId: string, matchFirestoreId: string) => void;

  maxClients = 10; // 2 player slots + 8 spectator slots

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");

    this.setState(new GameState());
    this.state.mode = "tournament";
    this.state.status = "waiting";
    this.state.timer = 180;

    // Pick up onMatchEnd callback registered by TournamentScheduler before room creation
    if (options.matchId) {
      const cb = TournamentBattleRoom.pendingMatchCallbacks.get(options.matchId);
      if (cb) {
        this.onMatchEnd = cb;
        TournamentBattleRoom.pendingMatchCallbacks.delete(options.matchId);
      }
    }

    // Tournament metadata
    this.state.tournamentId = options.tournamentId || "";
    this.state.tournamentName = options.tournamentName || "";
    this.state.roundNumber = options.roundNumber || 0;
    this.state.tournamentMatchId = options.matchId || "";

    // Series format — tournaments use bestOf from tournament config
    const bestOf: 1 | 3 | 5 = options.bestOf ?? 1;
    this.state.targetWins = Math.ceil(bestOf / 2);

    // Seeded PRNG from matchId for fully deterministic tournament replays
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

    this.physics = new PhysicsEngine();
    if (arenaData) {
      this.physics.setArenaConfig(arenaData);
      if ((arenaData.obstacles?.length ?? 0) > 0) {
        this.physics.createObstacles(arenaData.obstacles ?? []);
      }
    }
    this.buildArenaWalls();

    // Create AI participants immediately if specified in options
    const aiParticipants: Array<{ userId: string; username: string; beybladeId: string; difficulty: AIDifficulty }> =
      options.aiParticipants || [];
    for (const aiP of aiParticipants) {
      await this.createAIParticipant(aiP.userId, aiP.username, aiP.beybladeId, aiP.difficulty);
    }

    this.onMessage("input", (client, message: number | any) => {
      const input = typeof message === "number" ? decodeBitmask(message) : message;
      this.handleInput(client, input);
    });

    // If all participants are AI, start immediately
    if (aiParticipants.length >= 2) {
      this.startMatch();
    }

    console.log(`TournamentBattleRoom created: tournament=${options.tournamentId} match=${options.matchId}`);
  }

  async onJoin(client: Client, options: JoinOptions) {
    // Spectator path
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      console.log(`Spectator joined TournamentBattleRoom (${this.state.spectatorCount} watching)`);
      return;
    }

    // Player slot cap (max 2 human players — AI slots pre-filled in onCreate)
    const humanSlotsFilled = this.playerSessions.size - this.aiSessions.size;
    if (humanSlotsFilled >= 2) {
      client.leave(4000, "Match full");
      return;
    }

    this.playerSessions.add(client.sessionId);
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
    this.spawnPositions.set(client.sessionId, { x: beyblade.x, y: beyblade.y });

    this.physics.createBeyblade(beyblade.id, beyblade.x, beyblade.y, beyblade.radius, beyblade.mass, beybladeData || undefined);
    this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -10 : 10);
    this.state.beyblades.set(client.sessionId, beyblade);
    this.state.seriesWins.set(beyblade.userId, 0);

    // Start match when 2 total player slots are filled (human + AI or 2 humans)
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

    // AI sessions are permanent — only human players can "leave"
    if (this.aiSessions.has(client.sessionId)) return;

    console.log(`Player ${client.sessionId} left TournamentBattleRoom`);
    this.playerSessions.delete(client.sessionId);
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

    // Dispose when no human players remain
    const humanCount = this.playerSessions.size - this.aiSessions.size;
    if (humanCount === 0) {
      this.disconnect();
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
    this.spawnPositions.set(userId, { x: ai.x, y: ai.y });

    this.physics.createBeyblade(userId, ai.x, ai.y, ai.radius, ai.mass, aiData || undefined);
    this.physics.setAngularVelocity(userId, ai.spinDirection === "left" ? -10 : 10);
    this.state.beyblades.set(userId, ai);
    this.state.seriesWins.set(userId, 0);
    this.aiControllers.set(userId, new AIController(difficulty));
    this.aiSessions.add(userId);
    this.playerSessions.add(userId);
  }

  // ─── Match start ─────────────────────────────────────────────────────────────

  private startMatch() {
    if (this.state.status !== "waiting") return;
    this.state.status = "warmup";
    this.lastInputTime = Date.now();
    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimer });
  }

  // ─── Input handling ──────────────────────────────────────────────────────────

  private handleInput(client: Client, message: any) {
    if (this.spectatorSessions.has(client.sessionId)) return;
    if (this.aiSessions.has(client.sessionId)) return;

    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive || this.state.status !== "in-progress") return;
    this.lastInputTime = Date.now();

    const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
    const forceMagnitude = 0.001 * beyblade.mass * stability * beyblade.speedBonus;

    if (!beyblade.comboExecuting) {
      if (message.moveLeft)  this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * forceMagnitude * 1.5, Math.cos(beyblade.rotation) * forceMagnitude * 1.5);
      if (message.moveRight) this.physics.applyForce(beyblade.id, Math.sin(beyblade.rotation) * forceMagnitude * 1.5, -Math.cos(beyblade.rotation) * forceMagnitude * 1.5);
      if (message.moveUp)    this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * forceMagnitude * 1.5, Math.sin(beyblade.rotation) * forceMagnitude * 1.5);
      if (message.moveDown)  this.physics.applyForce(beyblade.id, -Math.cos(beyblade.rotation) * forceMagnitude, -Math.sin(beyblade.rotation) * forceMagnitude);
    }

    if (beyblade.comboExecuting || beyblade.stunTimer > 0) return;

    if (message.jump && !beyblade.isAirborne && !beyblade.inPit && !beyblade.isDefending && beyblade.landingLag <= 0) {
      beyblade.isAirborne = true;
      beyblade.airborneTimer = 1.0;
    }
    if (message.attack && beyblade.attackCooldown <= 0) {
      this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier, Math.sin(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier);
      beyblade.attackBuffTimer = 0.5;
      beyblade.attackCooldown = 1.5;
      this.broadcast("attack", { playerId: client.sessionId });
    }
    if (message.defense && !beyblade.isAirborne && beyblade.landingLag <= 0) {
      beyblade.isDefending = true;
      beyblade.defenseBuffTimer = 0.1;
    } else if (!message.defense) {
      beyblade.isDefending = false;
    }
    const canDodge = !beyblade.inPit && !beyblade.isDefending && beyblade.power >= 10 && beyblade.dodgeBuffTimer <= 0;
    if (message.dodge && canDodge) {
      this.physics.applyLateralForce(beyblade.id, beyblade.spinDirection, forceMagnitude * 4 * beyblade.speedBonus);
      beyblade.dodgeBuffTimer = 0.4;
      beyblade.power = Math.max(0, beyblade.power - 10);
    }
    if (message.chargeHeld) {
      const isMoving = !!(message.moveLeft || message.moveRight || message.moveUp || message.moveDown);
      beyblade.power = Math.min(100, beyblade.power + (isMoving ? 2 : 1));
    }
    const wantsSpecial = message.specialTap || message.specialMove;
    if (wantsSpecial && beyblade.specialCooldown <= 0) {
      const hasPower = message.specialTap ? beyblade.power >= 50 : true;
      if (hasPower) {
        this.handleSpecialMove(beyblade);
        if (message.specialTap) beyblade.power = Math.max(0, beyblade.power - 50);
        beyblade.specialCooldown = 3;
      }
    }
  }

  // ─── Special moves ───────────────────────────────────────────────────────────

  private handleSpecialMove(beyblade: Beyblade) {
    const state = this.physics.getBodyState(beyblade.id);
    if (!state) return;
    switch (beyblade.type) {
      case "attack": {
        const rushForce = 0.005 * beyblade.mass * beyblade.damageMultiplier;
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * rushForce, Math.sin(beyblade.rotation) * rushForce);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.8);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        this.broadcast("special-move", { playerId: beyblade.id, type: "stampede-rush" });
        break;
      }
      case "defense": {
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(beyblade.maxSpin / 200) : (beyblade.maxSpin / 200));
        this.physics.applyForce(beyblade.id, -state.velocityX * beyblade.mass * 0.8, -state.velocityY * beyblade.mass * 0.8);
        beyblade.isInvulnerable = true;
        beyblade.invulnerabilityTimer = 1.5;
        this.broadcast("special-move", { playerId: beyblade.id, type: "gyro-anchor" });
        break;
      }
      case "stamina": {
        this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * 0.002 * beyblade.mass, Math.cos(beyblade.rotation) * 0.002 * beyblade.mass);
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200));
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { playerId: beyblade.id, type: "spin-recovery" });
        break;
      }
      case "balanced": {
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * 0.003 * beyblade.mass, Math.sin(beyblade.rotation) * 0.003 * beyblade.mass);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { playerId: beyblade.id, type: "tactical-burst" });
        break;
      }
    }
  }

  // ─── Apply AI input ──────────────────────────────────────────────────────────

  private applyAIInput(beyblade: Beyblade, input: any) {
    if (!beyblade.isActive || beyblade.comboExecuting) return;
    const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
    const forceMagnitude = 0.001 * beyblade.mass * stability * beyblade.speedBonus;

    if (input.moveLeft)  this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * forceMagnitude * 1.5, Math.cos(beyblade.rotation) * forceMagnitude * 1.5);
    if (input.moveRight) this.physics.applyForce(beyblade.id, Math.sin(beyblade.rotation) * forceMagnitude * 1.5, -Math.cos(beyblade.rotation) * forceMagnitude * 1.5);
    if (input.moveUp)    this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * forceMagnitude * 1.5, Math.sin(beyblade.rotation) * forceMagnitude * 1.5);
    if (input.moveDown)  this.physics.applyForce(beyblade.id, -Math.cos(beyblade.rotation) * forceMagnitude, -Math.sin(beyblade.rotation) * forceMagnitude);

    if (beyblade.stunTimer > 0) return;

    if (input.jump && !beyblade.isAirborne && !beyblade.inPit && !beyblade.isDefending && beyblade.landingLag <= 0) {
      beyblade.isAirborne = true;
      beyblade.airborneTimer = 1.0;
    }
    if (input.attack && beyblade.attackCooldown <= 0) {
      this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier, Math.sin(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier);
      beyblade.attackBuffTimer = 0.5;
      beyblade.attackCooldown = 1.5;
    }
    if (input.defense && beyblade.landingLag <= 0) {
      beyblade.isDefending = true;
      beyblade.defenseBuffTimer = 0.1;
    } else if (!input.defense) {
      beyblade.isDefending = false;
    }
    const canDodge = !beyblade.inPit && !beyblade.isDefending && beyblade.power >= 10 && beyblade.dodgeBuffTimer <= 0;
    if (input.dodge && canDodge) {
      this.physics.applyLateralForce(beyblade.id, beyblade.spinDirection, forceMagnitude * 4 * beyblade.speedBonus);
      beyblade.dodgeBuffTimer = 0.4;
      beyblade.power = Math.max(0, beyblade.power - 10);
    }
    if (input.chargeHeld) {
      const isMoving = !!(input.moveLeft || input.moveRight || input.moveUp || input.moveDown);
      beyblade.power = Math.min(100, beyblade.power + (isMoving ? 2 : 1));
    }
    if (input.specialTap && beyblade.power >= 50 && beyblade.specialCooldown <= 0) {
      this.handleSpecialMove(beyblade);
      beyblade.power = Math.max(0, beyblade.power - 50);
      beyblade.specialCooldown = 3;
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
      }
    }

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

      if (this.arenaCache) this.processArenaFeatures(beyblade, this.arenaCache, dt);

      // Nutation wobble (seeded PRNG)
      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, (this.rand() - 0.5) * wobble, (this.rand() - 0.5) * wobble);
      }

      beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * dt);
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

      if (this.state.arena.shape === "circle") {
        const ar = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
        const isOut = this.physics.isOutOfBounds(beyblade.id, ar, (this.state.arena.width * 16) / 2, (this.state.arena.height * 16) / 2);
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

  // ─── Arena features ──────────────────────────────────────────────────────────

  private processArenaFeatures(beyblade: Beyblade, arenaData: ArenaConfig, dt: number) {
    if ((arenaData.loops?.length ?? 0) > 0) {
      const loopCheck = this.physics.checkLoopCollision(beyblade.id, arenaData.loops ?? []);
      if (loopCheck.inLoop && loopCheck.loopConfig) {
        if (!beyblade.inLoop) {
          beyblade.inLoop = true;
          beyblade.loopIndex = loopCheck.loopIndex;
          beyblade.loopEntryTime = Date.now();
          beyblade.loopSpeedBoost = loopCheck.loopConfig.speedBoost;
          beyblade.loopSpinBoost = loopCheck.loopConfig.spinBoost || 0;
          this.physics.applyLoopBoost(beyblade.id, loopCheck.loopConfig.speedBoost);
        }
        if (beyblade.loopSpinBoost > 0) beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.loopSpinBoost * dt);
      } else if (beyblade.inLoop) {
        beyblade.inLoop = false; beyblade.loopIndex = -1; beyblade.loopSpeedBoost = 1.0; beyblade.loopSpinBoost = 0;
      }
    }

    const waterBodies = arenaData.waterBodies;
    if ((waterBodies?.length ?? 0) > 0) {
      const inWater = this.physics.checkWaterCollision(beyblade.id, waterBodies![0]);
      if (inWater) {
        if (!beyblade.inWater) {
          beyblade.inWater = true;
          const wc = waterBodies![0];
          beyblade.waterSpeedMultiplier = 1 - (wc.effects?.speedLoss ?? 0.3);
          beyblade.waterSpinDrain = wc.effects?.spinDrainPerSecond ?? 10;
        }
        this.physics.applyWaterResistance(beyblade.id, beyblade.waterSpeedMultiplier);
        beyblade.spin = Math.max(0, beyblade.spin - beyblade.waterSpinDrain * dt);
      } else if (beyblade.inWater) {
        beyblade.inWater = false; beyblade.waterSpeedMultiplier = 1.0; beyblade.waterSpinDrain = 0;
      }
    }

    if ((arenaData.pits?.length ?? 0) > 0) {
      const pitConfig = this.physics.checkPitCollision(beyblade.id, arenaData.pits ?? []);
      if (pitConfig) {
        if (!beyblade.inPit) {
          beyblade.inPit = true;
          beyblade.currentPitId = `pit_${arenaData.pits?.indexOf(pitConfig) ?? 0}`;
          beyblade.pitDamageRate = pitConfig.damagePerSecond;
        }
        beyblade.spin = Math.max(0, beyblade.spin - beyblade.pitDamageRate * beyblade.spin * dt / 100);
        const escapeThreshold = pitConfig.escapeThreshold ?? 50;
        if (beyblade.spin > (beyblade.maxSpin * escapeThreshold / 100) && this.rand() < 0.1 * dt) {
          beyblade.inPit = false; beyblade.currentPitId = ""; beyblade.pitDamageRate = 0;
          this.physics.applyForce(beyblade.id, 0, -0.05 * beyblade.mass);
        }
      } else if (beyblade.inPit) {
        beyblade.inPit = false; beyblade.currentPitId = ""; beyblade.pitDamageRate = 0;
      }
    }

    const obstacleCheck = this.physics.checkObstacleCollision(beyblade.id);
    if (obstacleCheck.colliding) {
      if (!beyblade.collidingWithObstacle || beyblade.lastObstacleId !== obstacleCheck.obstacleId) {
        beyblade.collidingWithObstacle = true;
        beyblade.lastObstacleId = obstacleCheck.obstacleId || "";
        const damage = obstacleCheck.damage * beyblade.damageTaken;
        beyblade.health -= damage; beyblade.damageReceived += damage;
        this.physics.applyKnockback(beyblade.id, { x: beyblade.velocityX, y: beyblade.velocityY }, beyblade.knockbackDistance);
        this.broadcast("obstacle-collision", { playerId: beyblade.id, damage });
      }
    } else { beyblade.collidingWithObstacle = false; beyblade.lastObstacleId = ""; }

    if (arenaData.wall?.enabled) {
      const dx = beyblade.x - (this.state.arena.width * 16) / 2;
      const dy = beyblade.y - (this.state.arena.height * 16) / 2;
      const arenaRad = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;
      if (Math.sqrt(dx * dx + dy * dy) > arenaRad * 0.95) {
        let wd = arenaData.wall.baseDamage;
        if (arenaData.wall.hasSpikes) wd *= arenaData.wall.spikeDamageMultiplier;
        wd *= beyblade.damageTaken;
        beyblade.health -= wd; beyblade.damageReceived += wd;
        this.physics.applyKnockback(beyblade.id, { x: -dx, y: -dy }, arenaData.wall.recoilDistance * beyblade.knockbackDistance);
        this.broadcast("wall-collision", { playerId: beyblade.id, damage: wd });
      }
    }
  }

  // ─── Win condition + series ───────────────────────────────────────────────────

  private checkWinCondition() {
    if (this.state.status !== "in-progress") return;

    const activeBeyblades = Array.from(this.state.beyblades.values()).filter(b => b.isActive);
    const timeExpired = this.state.timer <= 0;

    if (activeBeyblades.length <= 1 || timeExpired) {
      let winner: Beyblade | null = null;
      if (activeBeyblades.length === 1) {
        winner = activeBeyblades[0];
      } else if (activeBeyblades.length > 1) {
        winner = activeBeyblades.reduce((best, b) => b.spin > best.spin ? b : best, activeBeyblades[0]);
      }

      const winnerId = winner?.userId ?? "";

      if (winnerId) {
        const currentWins = this.state.seriesWins.get(winnerId) ?? 0;
        this.state.seriesWins.set(winnerId, currentWins + 1);
        let maxWins = 0; let leader = "";
        this.state.seriesWins.forEach((wins, uid) => { if (wins > maxWins) { maxWins = wins; leader = uid; } });
        this.state.seriesLeader = leader;
      }

      const winnerCurrentWins = this.state.seriesWins.get(winnerId) ?? 0;
      const seriesOver = winnerCurrentWins >= this.state.targetWins;

      if (seriesOver) {
        this.state.status = "series-finished";
        this.state.winner = winnerId;

        const seriesScore: Record<string, number> = {};
        this.state.seriesWins.forEach((wins, uid) => { seriesScore[uid] = wins; });

        this.broadcast("series-end", {
          winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
          seriesScore,
        });

        this.persistMatch(winner).then((matchFirestoreId) => {
          if (this.onMatchEnd && winnerId) this.onMatchEnd(winnerId, matchFirestoreId);
        }).catch((err) => {
          console.error("[TournamentBattleRoom] persistMatch failed:", err);
          // Still advance the bracket even if persistence failed — an empty matchFirestoreId
          // means the match result won't be linked in the matches collection, but the
          // bracket must continue or the tournament stalls permanently.
          if (this.onMatchEnd && winnerId) this.onMatchEnd(winnerId, "");
        });

        setTimeout(() => this.disconnect(), 5000);
      } else {
        this.state.status = "finished";
        this.state.winner = winnerId;
        const seriesScore: Record<string, number> = {};
        this.state.seriesWins.forEach((wins, uid) => { seriesScore[uid] = wins; });
        this.broadcast("game-end", {
          winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
          gameNumber: this.state.currentGame,
          seriesScore,
        });
        setTimeout(() => this.resetForNextGame(), 3000);
      }
    }
  }

  private resetForNextGame() {
    this.state.currentGame++;
    this.state.status = "warmup";
    this.state.timer = 180;
    this.state.winner = "";
    this.warmupTimer = 3;

    this.state.beyblades.forEach((beyblade) => {
      const spawnPos = this.spawnPositions.get(beyblade.id);
      beyblade.isActive = true; beyblade.isRingOut = false;
      beyblade.health = beyblade.maxStamina; beyblade.maxHealth = beyblade.maxStamina; beyblade.spin = beyblade.maxSpin; beyblade.stamina = beyblade.maxStamina;
      beyblade.power = 0; beyblade.attackCooldown = 0; beyblade.specialCooldown = 0;
      beyblade.attackBuffTimer = 0; beyblade.dodgeBuffTimer = 0; beyblade.defenseBuffTimer = 0;
      beyblade.isAirborne = false; beyblade.airborneTimer = 0; beyblade.landingLag = 0;
      beyblade.inPit = false; beyblade.currentPitId = ""; beyblade.pitDamageRate = 0;
      beyblade.inWater = false; beyblade.waterSpeedMultiplier = 1.0; beyblade.waterSpinDrain = 0;
      beyblade.inLoop = false; beyblade.loopIndex = -1; beyblade.loopSpeedBoost = 1.0; beyblade.loopSpinBoost = 0;
      beyblade.isDefending = false; beyblade.isInvulnerable = false; beyblade.invulnerabilityTimer = 0;
      beyblade.stunTimer = 0; beyblade.comboExecuting = false; beyblade.comboTimer = 0;
      beyblade.collidingWithObstacle = false; beyblade.lastObstacleId = "";
      if (spawnPos) {
        beyblade.x = spawnPos.x; beyblade.y = spawnPos.y;
        this.physics.setPosition(beyblade.id, spawnPos.x, spawnPos.y);
        this.physics.setLinearVelocity(beyblade.id, 0, 0);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "right" ? 50 : -50);
      }
    });

    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimer, gameNumber: this.state.currentGame });
  }

  private async persistMatch(winner: Beyblade | null): Promise<string> {
    try {
      const beyblades = Array.from(this.state.beyblades.values());
      const seriesScore: Record<string, number> = {};
      this.state.seriesWins.forEach((wins, uid) => { seriesScore[uid] = wins; });

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

      if (winner && !winner.isAI) {
        await updatePlayerStats(winner.userId, {
          matchesPlayed: 1,
          wins: 1,
          totalDamageDealt: winner.damageDealt,
          totalCollisions: winner.collisions,
        });
      }

      return matchFirestoreId;
    } catch (err) {
      console.error("Failed to persist tournament match:", err);
      return "";
    }
  }

  // ─── Arena helpers ────────────────────────────────────────────────────────────

  private applyArenaToState(arenaData: ArenaConfig, arenaId: string) {
    this.state.arena.id = arenaData.id || arenaId;
    this.state.arena.name = arenaData.name;
    this.state.arena.width = arenaData.width;
    this.state.arena.height = arenaData.height;
    this.state.arena.shape = arenaData.shape;
    this.state.arena.theme = arenaData.theme;
    this.state.arena.rotation = arenaData.rotationSpeed || 0;
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
    this.state.arena.loopCount = arenaData.loops?.length ?? 0;
    this.state.arena.obstacleCount = arenaData.obstacles?.length ?? 0;
    this.state.arena.pitCount = arenaData.pits?.length ?? 0;
    this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
    this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;
  }

  private applyDefaultArena(arenaId: string) {
    this.state.arena.id = arenaId;
    this.state.arena.name = "Tournament Arena";
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
  }

  private buildArenaWalls() {
    if (this.state.arena.shape === "circle") {
      const radius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
      this.physics.createCircularArena((this.state.arena.width * 16) / 2, (this.state.arena.height * 16) / 2, radius);
    } else {
      this.physics.createRectangularArena(this.state.arena.width * 16, this.state.arena.height * 16);
    }
  }

  private applyBeybladeStats(beyblade: Beyblade, data: BeybladeStats) {
    beyblade.type = data.type;
    beyblade.spinDirection = data.spinDirection;
    beyblade.mass = data.mass;
    beyblade.radius = data.radius;
    beyblade.actualSize = data.radius * 24;
    const attack = data.typeDistribution.attack;
    const defense = data.typeDistribution.defense;
    const stamina = data.typeDistribution.stamina;
    beyblade.attackPoints = attack; beyblade.defensePoints = defense; beyblade.staminaPoints = stamina;
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
      case "attack": beyblade.damageMultiplier *= 1.2; beyblade.maxStamina = 2500; beyblade.stamina = 2500; break;
      case "defense": beyblade.damageTaken *= 0.8; beyblade.maxStamina = 2500; beyblade.stamina = 2500; break;
      case "balanced": beyblade.maxStamina = Math.min(beyblade.maxStamina, 2500); beyblade.stamina = beyblade.maxStamina; break;
    }
  }

  private applyDefaultStats(beyblade: Beyblade) {
    beyblade.type = "balanced"; beyblade.spinDirection = "right"; beyblade.mass = 50; beyblade.radius = 4;
    beyblade.actualSize = 96; beyblade.attackPoints = 120; beyblade.defensePoints = 120; beyblade.staminaPoints = 120;
    beyblade.damageMultiplier = 1.84; beyblade.damageTaken = 0.64; beyblade.knockbackDistance = 7.99;
    beyblade.invulnerabilityChance = 0.18; beyblade.spinStealFactor = 0.42; beyblade.spinDecayRate = 7.88;
    beyblade.maxStamina = 1600; beyblade.stamina = 1600; beyblade.maxSpin = 2192; beyblade.spin = 2192; beyblade.speedBonus = 1.84;
  }
}

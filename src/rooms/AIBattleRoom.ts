import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem } from "../utils/firebase";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import { ComboTracker, detectCombo } from "../shared/utils/comboSystem";
import { normalizeBestOf, targetWinsFor } from "../shared/utils/seriesFormat";
import { normalizeInput, type PlayerInput } from "../shared/utils/bitmask";
import { resolveWallAngle, wallBowlForce } from "../shared/physics/ArenaUtils";
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
}

const AI_SESSION_ID = "__ai__";

export class AIBattleRoom extends Room<GameState> {
  protected physics!: PhysicsEngine;
  protected arenaCache: ArenaConfig | null = null;
  protected arenaSystem: ArenaSystem | null = null;
  private aiController!: AIController;
  private matchStarted = false;
  private lastInputTime = 0;
  private globalSettings: GlobalSettingsDoc | null = null;
  protected rand!: () => number;
  private humanSessionId: string | null = null;
  private spectatorSessions = new Set<string>();
  private humanBeybladeData: BeybladeStats | null = null;
  private aiBeybladeData: BeybladeStats | null = null;
  private humanSpawnPos = { x: 0, y: 0 };
  private aiSpawnPos = { x: 0, y: 0 };
  private aiDifficulty: AIDifficulty = "medium";
  private aiBeybladeId = "default";
  private comboTrackers = new Map<string, ComboTracker>();

  maxClients = 9;

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    console.log("AIBattleRoom created", options);

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enableAiBattle === false) throw new Error("AI Battle disabled");

    this.setState(new GameState());
    this.state.mode = "ai-battle";
    this.state.status = "waiting";
    this.state.timer = 180;

    const bestOf = normalizeBestOf(options.bestOf);
    this.state.targetWins = targetWinsFor(bestOf);

    const seed = hashString(options.matchId || String(Date.now()));
    this.rand = createPRNG(seed);

    this.arenaCache = await loadArena(options.arenaId || "default");
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, options.arenaId);
      console.log(`✅ AIBattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(options.arenaId || "default");
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
  }

  async onJoin(client: Client, options: JoinOptions) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      console.log(`Spectator ${client.sessionId} joined AIBattleRoom`);
      return;
    }

    if (this.humanSessionId !== null) {
      client.leave(4000, "Match full");
      return;
    }

    this.humanSessionId = client.sessionId;
    this.comboTrackers.set(client.sessionId, { history: [] });
    console.log(`Human player ${client.sessionId} joined AIBattleRoom`);

    const difficulty: AIDifficulty = options.aiDifficulty || "medium";
    this.aiDifficulty = difficulty;
    this.aiBeybladeId = options.aiBeybladeId || options.beybladeId || "default";
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
    human.beybladeId = options.beybladeId || "default";
    human.isAI = false;

    if (humanData) {
      this.applyBeybladeStats(human, humanData);
    } else {
      this.applyDefaultStats(human);
    }

    human.health = human.maxStamina;
    human.maxHealth = human.maxStamina;
    human.x = arenaHalfW - spawnRadius;
    human.y = arenaHalfH;
    this.humanSpawnPos = { x: human.x, y: human.y };

    this.physics.createBeyblade(human.id, human.x, human.y, human.radius, human.mass, humanData || undefined);
    this.physics.setAngularVelocity(human.id, (human.spinDirection === "left" ? -1 : 1) * (human.maxSpin / 200));
    this.state.beyblades.set(client.sessionId, human);
    this.state.seriesWins.set(human.userId, 0);

    // ── Load and create AI beyblade ─────────────────────────────────────────
    const aiData: BeybladeStats | null = await loadBeyblade(this.aiBeybladeId);
    this.aiBeybladeData = aiData;
    const ai = new Beyblade();
    ai.id = AI_SESSION_ID;
    ai.userId = AI_SESSION_ID;
    ai.username = `Computer (${difficulty})`;
    ai.beybladeId = this.aiBeybladeId;
    ai.isAI = true;

    if (aiData) {
      this.applyBeybladeStats(ai, aiData);
    } else {
      this.applyDefaultStats(ai);
    }

    ai.health = ai.maxStamina;
    ai.maxHealth = ai.maxStamina;
    ai.x = arenaHalfW + spawnRadius;
    ai.y = arenaHalfH;
    this.aiSpawnPos = { x: ai.x, y: ai.y };

    this.physics.createBeyblade(AI_SESSION_ID, ai.x, ai.y, ai.radius, ai.mass, aiData || undefined);
    this.physics.setAngularVelocity(AI_SESSION_ID, (ai.spinDirection === "left" ? -1 : 1) * (ai.maxSpin / 200));
    this.state.beyblades.set(AI_SESSION_ID, ai);
    this.state.seriesWins.set(AI_SESSION_ID, 0);

    this.matchStarted = true;
    this.state.status = "in-progress";
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now();

    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    this.broadcast("match-start", {});

    console.log(`✅ AIBattleRoom ready: ${human.username} vs ${ai.username} (${difficulty})`);
  }

  onLeave(client: Client, _consented: boolean) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }

    console.log(`Human player ${client.sessionId} left AIBattleRoom`);
    this.humanSessionId = null;
    this.comboTrackers.delete(client.sessionId);
    if (this.matchStarted) {
      this.physics.removeBeyblade(client.sessionId);
      this.state.beyblades.delete(client.sessionId);
      this.physics.removeBeyblade(AI_SESSION_ID);
      this.state.beyblades.delete(AI_SESSION_ID);
    }

    this.disconnect();
  }

  onDispose() {
    console.log("AIBattleRoom disposed");
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
      const combo = detectCombo(tracker, message.comboKeys, Date.now());
      if (combo) {
        beyblade.comboDamageMultiplier = combo.damageMultiplier;
        beyblade.comboDamageMultiplierTimer = combo.durationMs / 1000;
        this.broadcast("combo", {
          playerId: beyblade.id,
          comboName: combo.name,
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

  // ─── Game tick ───────────────────────────────────────────────────────────────

  private tick(deltaTime: number) {
    if (this.state.status !== "in-progress") return;

    if (Date.now() - this.lastInputTime > 60_000) {
      this.broadcast("idle-disconnect", {});
      this.disconnect();
      return;
    }

    const dt = deltaTime / 1000;
    this.physics.update(deltaTime);

    // Server-authoritative arena rotation (Phase 14 review).
    advanceArenaRotation(this.state.arena, dt);

    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

    // ── AI input generation ──────────────────────────────────────────────────
    const aiBeyblade = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBeyblade && aiBeyblade.isActive && this.aiController) {
      const arenaHalfW = (this.state.arena.width * 16) / 2;
      const arenaHalfH = (this.state.arena.height * 16) / 2;
      const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 * 0.45;

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
      }));

      const aiSnapshot = allSnapshots.find(s => s.id === AI_SESSION_ID)!;
      const opponentSnapshots = allSnapshots.filter(s => s.id !== AI_SESSION_ID && (this.state.beyblades.get(s.id)?.isActive ?? false));

      const aiInput = this.aiController.computeInput(aiSnapshot, opponentSnapshots, arenaHalfW, arenaHalfH, arenaRadius);
      this.applyAIInput(aiBeyblade, aiInput);
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

      beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * dt);
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

  private resetForNextGame() {
    if (this.humanSessionId === null) return;

    this.state.currentGame++;
    this.state.status = "warmup";
    this.state.timer = 180;
    this.state.winner = "";

    if (this.humanSessionId) {
      const humanBeyblade = this.state.beyblades.get(this.humanSessionId);
      if (humanBeyblade) resetBeybladeForNextGame(humanBeyblade, this.humanSpawnPos, this.physics);
    }

    const aiBeyblade = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBeyblade) resetBeybladeForNextGame(aiBeyblade, this.aiSpawnPos, this.physics);

    this.broadcast("match-warmup", { secondsUntilStart: 3, gameNumber: this.state.currentGame });

    setTimeout(() => {
      if (this.humanSessionId === null) return;
      this.state.status = "in-progress";
      this.state.startTime = Date.now();
      this.lastInputTime = Date.now();
      this.broadcast("match-start", { gameNumber: this.state.currentGame });
    }, 3000);
  }

  // ─── Arena helpers ───────────────────────────────────────────────────────────

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
    populateArenaFeatures(this.state, arenaData as any);
    this.state.arena.airResistance = arenaData.airResistance || 0.01;
    this.state.arena.surfaceFriction = arenaData.surfaceFriction || 0.01;
    if (arenaData.wall) {
      this.state.arena.wallEnabled = arenaData.wall.enabled;
      this.state.arena.wallBaseDamage = arenaData.wall.baseDamage;
      this.state.arena.wallRecoilDistance = arenaData.wall.recoilDistance;
      this.state.arena.wallHasSpikes = arenaData.wall.hasSpikes;
      this.state.arena.wallSpikeDamageMultiplier = arenaData.wall.spikeDamageMultiplier;
    }
    this.state.arena.wallAngle = resolveWallAngle(arenaData);
    this.state.arena.loopCount = arenaData.loops?.length ?? 0;
    this.state.arena.obstacleCount = arenaData.obstacles?.length ?? 0;
    this.state.arena.pitCount = arenaData.pits?.length ?? 0;
    this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
    this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;
  }

  private applyDefaultArena(arenaId: string) {
    this.state.arena.id = arenaId;
    this.state.arena.name = "AI Battle Arena";
    this.state.arena.width = 50;
    this.state.arena.height = 50;
    this.state.arena.shape = "circle";
    this.state.arena.theme = "metrocity";
    this.state.arena.wallEnabled = true;
    this.state.arena.wallBaseDamage = 5;
    this.state.arena.wallRecoilDistance = 2;
    this.state.arena.wallAngle = 0;
    this.state.arena.wallHasSprings = false;
    this.state.arena.wallSpringRecoilMultiplier = 1.0;
  }

  private buildArenaWalls() {
    if (this.state.arena.shape === "circle") {
      const radius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
      this.physics.createCircularArena((this.state.arena.width * 16) / 2, (this.state.arena.height * 16) / 2, radius);
    } else {
      this.physics.createRectangularArena(this.state.arena.width * 16, this.state.arena.height * 16);
    }
  }

  // ─── Stat helpers ────────────────────────────────────────────────────────────

  private applyBeybladeStats(beyblade: Beyblade, data: BeybladeStats) {
    beyblade.type = data.type;
    beyblade.spinDirection = data.spinDirection;
    beyblade.mass = data.mass;
    beyblade.radius = data.radius;
    beyblade.actualSize = data.radius * 24;

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
        break;
      case "defense":
        beyblade.damageTaken *= 0.8;
        beyblade.maxStamina = 2500;
        beyblade.stamina = 2500;
        break;
      case "balanced":
        beyblade.maxStamina = Math.min(beyblade.maxStamina, 2500);
        beyblade.stamina = beyblade.maxStamina;
        break;
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

  // ─── 2.5D extension hooks — overridden by Parts25DAIBattleRoom ──────────────

  protected onTickedBey(_beyblade: Beyblade, _dt: number): void {
    // override in 2.5D subclass to call partSystemManager.tickBey()
  }

  protected onBeyCollided(_id1: string, _id2: string, _impactForce: number): void {
    // override in 2.5D subclass to call partSystemManager.onBeyCollision()
  }

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

import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena } from "../utils/firebase";
import { loadGlobalSettings, type GlobalSettingsDoc } from "../utils/tournamentFirebase";
import { tryReserveRoom, releaseRoom } from "../utils/roomCounter";
import { createPRNG } from "../utils/prng";
import { hashString } from "../utils/hashString";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import { AIController, type AIDifficulty } from "../ai/AIController";

// [SERVER-ROOM] AIBattleRoom — one human vs one AI opponent + spectators.
// maxClients=9 (1 human player slot + 8 spectator slots).
// AI beyblade is created server-side with no client slot.

interface JoinOptions {
  beybladeId: string;
  aiBeybladeId: string;
  arenaId: string;
  userId: string;
  username: string;
  aiDifficulty?: AIDifficulty;
  spectate?: boolean;
  bestOf?: 1 | 3 | 5;
}

const AI_SESSION_ID = "__ai__";

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

export class AIBattleRoom extends Room<GameState> {
  private physics!: PhysicsEngine;
  private arenaCache: ArenaConfig | null = null;
  private aiController!: AIController;
  private matchStarted = false;
  private lastInputTime = 0;
  private globalSettings: GlobalSettingsDoc | null = null;
  private rand!: () => number;
  private humanSessionId: string | null = null;
  private spectatorSessions = new Set<string>();
  private humanBeybladeData: BeybladeStats | null = null;
  private aiBeybladeData: BeybladeStats | null = null;
  private humanSpawnPos = { x: 0, y: 0 };
  private aiSpawnPos = { x: 0, y: 0 };
  private aiDifficulty: AIDifficulty = "medium";
  private aiBeybladeId = "default";

  maxClients = 9; // 1 human + 8 spectators

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

    // Series format (BO1 / BO3 / BO5)
    const bestOf: 1 | 3 | 5 = options.bestOf ?? 1;
    this.state.targetWins = Math.ceil(bestOf / 2);

    // Seeded PRNG for deterministic physics
    const seed = hashString(options.matchId || String(Date.now()));
    this.rand = createPRNG(seed);

    // Load arena once and cache
    this.arenaCache = await loadArena(options.arenaId || "default");
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, options.arenaId);
      console.log(`✅ AIBattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(options.arenaId || "default");
    }

    this.physics = new PhysicsEngine();
    if (arenaData) {
      this.physics.setArenaConfig(arenaData);
      if ((arenaData.obstacles?.length ?? 0) > 0) {
        this.physics.createObstacles(arenaData.obstacles ?? []);
      }
    }
    this.buildArenaWalls();

    this.onMessage("input", (client, message: number | any) => {
      const input = typeof message === "number" ? decodeBitmask(message) : message;
      this.handleInput(client, input);
    });
  }

  async onJoin(client: Client, options: JoinOptions) {
    // Spectator path
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      console.log(`Spectator ${client.sessionId} joined AIBattleRoom`);
      return;
    }

    // Human player slot — only one allowed
    if (this.humanSessionId !== null) {
      client.leave(4000, "Match full");
      return;
    }

    this.humanSessionId = client.sessionId;
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
    human.x = arenaHalfW - spawnRadius;
    human.y = arenaHalfH;
    this.humanSpawnPos = { x: human.x, y: human.y };

    this.physics.createBeyblade(human.id, human.x, human.y, human.radius, human.mass, humanData || undefined);
    this.physics.setAngularVelocity(human.id, human.spinDirection === "left" ? -10 : 10);
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
    ai.x = arenaHalfW + spawnRadius;
    ai.y = arenaHalfH;
    this.aiSpawnPos = { x: ai.x, y: ai.y };

    this.physics.createBeyblade(AI_SESSION_ID, ai.x, ai.y, ai.radius, ai.mass, aiData || undefined);
    this.physics.setAngularVelocity(AI_SESSION_ID, ai.spinDirection === "left" ? -10 : 10);
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
    // Spectator leave
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }

    // Human player leave
    console.log(`Human player ${client.sessionId} left AIBattleRoom`);
    this.humanSessionId = null;
    if (this.matchStarted) {
      this.physics.removeBeyblade(client.sessionId);
      this.state.beyblades.delete(client.sessionId);
      this.physics.removeBeyblade(AI_SESSION_ID);
      this.state.beyblades.delete(AI_SESSION_ID);
    }

    // Dispose immediately — no point keeping the room open for spectators alone
    this.disconnect();
  }

  onDispose() {
    console.log("AIBattleRoom disposed");
    releaseRoom();
    this.physics.destroy();
  }

  // ─── Input handling (human player) ──────────────────────────────────────────

  private handleInput(client: Client, message: any) {
    if (this.spectatorSessions.has(client.sessionId)) return;
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

    if (message.direction && (message.direction.x !== 0 || message.direction.y !== 0)) {
      const mag = Math.sqrt(message.direction.x ** 2 + message.direction.y ** 2);
      this.physics.applyForce(beyblade.id, (message.direction.x / mag) * forceMagnitude, (message.direction.y / mag) * forceMagnitude);
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

        this.broadcast("collision", { p1: ids[i], p2: ids[j], damage1: dmg.damage1, damage2: dmg.damage2, contactPoint: collision.contactPoint });
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

      // Low-spin nutation wobble (seeded PRNG)
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

      // Ring-out check
      if (this.state.arena.shape === "circle") {
        const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
        const isOut = this.physics.isOutOfBounds(beyblade.id, arenaRadius, (this.state.arena.width * 16) / 2, (this.state.arena.height * 16) / 2);
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

  // ─── Apply AI computed input to physics ──────────────────────────────────────

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

  // ─── Win condition + series logic ────────────────────────────────────────────

  private checkWinCondition() {
    if (this.state.status !== "in-progress") return;

    const activeBeyblades = Array.from(this.state.beyblades.values()).filter(b => b.isActive);
    const timeExpired = this.state.timer <= 0;

    if (activeBeyblades.length <= 1 || timeExpired) {
      let winner = activeBeyblades.length === 1
        ? activeBeyblades[0]
        : activeBeyblades.length > 1
          ? activeBeyblades.reduce((best, b) => b.spin > best.spin ? b : best, activeBeyblades[0])
          : null;

      const winnerId = winner?.userId ?? "";

      if (winnerId) {
        const currentWins = this.state.seriesWins.get(winnerId) ?? 0;
        this.state.seriesWins.set(winnerId, currentWins + 1);

        let maxWins = 0;
        let leader = "";
        this.state.seriesWins.forEach((wins, uid) => {
          if (wins > maxWins) { maxWins = wins; leader = uid; }
        });
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
          reason: activeBeyblades.length === 0 ? "simultaneous-spinout" : activeBeyblades.length === 1 ? "last-standing" : "timer",
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
          reason: activeBeyblades.length === 0 ? "simultaneous-spinout" : activeBeyblades.length === 1 ? "last-standing" : "timer",
        });

        setTimeout(() => this.resetForNextGame(), 3000);
      }
    }
  }

  private resetForNextGame() {
    if (this.humanSessionId === null) return;

    this.state.currentGame++;
    this.state.status = "warmup";
    this.state.timer = 180;
    this.state.winner = "";

    // Reset beyblades using cached spawn positions (no Firestore reads)
    const resetBeyblade = (beyblade: Beyblade, spawnPos: { x: number; y: number }) => {
      beyblade.isActive = true;
      beyblade.isRingOut = false;
      beyblade.health = beyblade.maxStamina;
      beyblade.spin = beyblade.maxSpin;
      beyblade.stamina = beyblade.maxStamina;
      beyblade.power = 0;
      beyblade.attackCooldown = 0;
      beyblade.specialCooldown = 0;
      beyblade.attackBuffTimer = 0;
      beyblade.dodgeBuffTimer = 0;
      beyblade.defenseBuffTimer = 0;
      beyblade.isAirborne = false;
      beyblade.airborneTimer = 0;
      beyblade.landingLag = 0;
      beyblade.inPit = false;
      beyblade.currentPitId = "";
      beyblade.pitDamageRate = 0;
      beyblade.inWater = false;
      beyblade.waterSpeedMultiplier = 1.0;
      beyblade.waterSpinDrain = 0;
      beyblade.inLoop = false;
      beyblade.loopIndex = -1;
      beyblade.loopSpeedBoost = 1.0;
      beyblade.loopSpinBoost = 0;
      beyblade.isDefending = false;
      beyblade.isInvulnerable = false;
      beyblade.invulnerabilityTimer = 0;
      beyblade.stunTimer = 0;
      beyblade.comboExecuting = false;
      beyblade.comboTimer = 0;
      beyblade.collidingWithObstacle = false;
      beyblade.lastObstacleId = "";
      beyblade.x = spawnPos.x;
      beyblade.y = spawnPos.y;
      this.physics.setPosition(beyblade.id, spawnPos.x, spawnPos.y);
      this.physics.setLinearVelocity(beyblade.id, 0, 0);
      this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "right" ? 50 : -50);
    };

    if (this.humanSessionId) {
      const humanBeyblade = this.state.beyblades.get(this.humanSessionId);
      if (humanBeyblade) resetBeyblade(humanBeyblade, this.humanSpawnPos);
    }

    const aiBeyblade = this.state.beyblades.get(AI_SESSION_ID);
    if (aiBeyblade) resetBeyblade(aiBeyblade, this.aiSpawnPos);

    this.broadcast("match-warmup", { secondsUntilStart: 3, gameNumber: this.state.currentGame });

    // Start game after 3s warmup (no tick-based warmup timer needed — just a timeout)
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
    }
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
}

import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena } from "../utils/firebase";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import { AIController, type AIDifficulty } from "../ai/AIController";

// [SERVER-ROOM] AIBattleRoom — one human vs one AI opponent.
// maxClients=1; AI beyblade is created server-side with no client slot.
// Same physics/collision pipeline as BattleRoom.

interface JoinOptions {
  beybladeId: string;
  aiBeybladeId: string;
  arenaId: string;
  userId: string;
  username: string;
  aiDifficulty?: AIDifficulty;
}

const AI_SESSION_ID = "__ai__";

export class AIBattleRoom extends Room<GameState> {
  private physics!: PhysicsEngine;
  private arenaCache: ArenaConfig | null = null;
  private aiController!: AIController;
  private matchStarted = false;
  private lastInputTime = 0;

  maxClients = 1;

  async onCreate(options: any) {
    this.autoDispose = true; // dispose room automatically when the last client leaves
    console.log("AIBattleRoom created", options);

    this.setState(new GameState());
    this.state.mode = "ai-battle";
    this.state.status = "waiting";
    this.state.timer = 180;

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

    this.onMessage("input", (client, message: any) => {
      this.handleInput(client, message);
    });

  }

  async onJoin(client: Client, options: JoinOptions) {
    console.log(`Client ${client.sessionId} joined AIBattleRoom`);

    const difficulty: AIDifficulty = options.aiDifficulty || "medium";
    this.aiController = new AIController(difficulty);

    // ── Load and create human beyblade ─────────────────────────────────────
    const humanData: BeybladeStats | null = await loadBeyblade(options.beybladeId);
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

    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    human.x = arenaHalfW - spawnRadius;
    human.y = arenaHalfH;

    this.physics.createBeyblade(human.id, human.x, human.y, human.radius, human.mass, humanData || undefined);
    this.physics.setAngularVelocity(human.id, human.spinDirection === "left" ? -10 : 10);
    this.state.beyblades.set(client.sessionId, human);

    // ── Load and create AI beyblade ─────────────────────────────────────────
    const aiData: BeybladeStats | null = await loadBeyblade(options.aiBeybladeId || options.beybladeId);
    const ai = new Beyblade();
    ai.id = AI_SESSION_ID;
    ai.userId = AI_SESSION_ID;
    ai.username = `Computer (${difficulty})`;
    ai.beybladeId = options.aiBeybladeId || options.beybladeId || "default";
    ai.isAI = true;

    if (aiData) {
      this.applyBeybladeStats(ai, aiData);
    } else {
      this.applyDefaultStats(ai);
    }

    ai.health = ai.maxStamina;
    ai.x = arenaHalfW + spawnRadius;
    ai.y = arenaHalfH;

    this.physics.createBeyblade(AI_SESSION_ID, ai.x, ai.y, ai.radius, ai.mass, aiData || undefined);
    this.physics.setAngularVelocity(AI_SESSION_ID, ai.spinDirection === "left" ? -10 : 10);
    this.state.beyblades.set(AI_SESSION_ID, ai);

    this.matchStarted = true;
    this.state.status = "in-progress";
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now();

    this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);

    this.broadcast("match-start", {});

    console.log(`✅ AIBattleRoom ready: ${human.username} vs ${ai.username} (${difficulty})`);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`Client ${client.sessionId} left AIBattleRoom`);
    if (this.matchStarted) {
      this.physics.removeBeyblade(client.sessionId);
      this.state.beyblades.delete(client.sessionId);
      this.physics.removeBeyblade(AI_SESSION_ID);
      this.state.beyblades.delete(AI_SESSION_ID);
    }
    // autoDispose=true handles room disposal once client count reaches 0.
    // No need to call this.disconnect() here — that forcefully kills the room
    // before onDispose can run its cleanup.
  }

  onDispose() {
    console.log("AIBattleRoom disposed");
    this.physics.destroy();
  }

  // ─── Input handling (human player) ──────────────────────────────────────────

  private handleInput(client: Client, message: any) {
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

      // Build snapshots of all beyblades for AI context
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

      // Apply AI input to physics (same pipeline as human handleInput)
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

      // Low-spin nutation wobble
      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, (Math.random() - 0.5) * wobble, (Math.random() - 0.5) * wobble);
      }

      beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * dt);
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      if (beyblade.spin <= 0 && beyblade.isActive) {
        beyblade.isActive = false;
        beyblade.health = 0;
        this.broadcast("spin-out", { playerId: beyblade.id, username: beyblade.username, x: beyblade.x, y: beyblade.y, type: beyblade.type });
      }

      // Cooldowns
      if (beyblade.attackCooldown > 0) beyblade.attackCooldown -= dt;
      if (beyblade.specialCooldown > 0) beyblade.specialCooldown -= dt;

      if (beyblade.isInvulnerable) {
        beyblade.invulnerabilityTimer -= dt;
        if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false;
      }

      // Action buff timers
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

      // Airborne timer
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

  // ─── Apply AI computed input to physics (mirrors handleInput logic) ──────────

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

  // ─── Win condition ────────────────────────────────────────────────────────────

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

      this.state.status = "finished";
      this.state.winner = winner?.userId ?? "";

      this.broadcast("game-over", {
        winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
        reason: activeBeyblades.length === 0 ? "simultaneous-spinout" : activeBeyblades.length === 1 ? "last-standing" : "timer",
      });

      setTimeout(() => this.disconnect(), 5000);
    }
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

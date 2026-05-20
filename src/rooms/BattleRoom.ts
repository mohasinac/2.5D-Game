import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
  ObstacleState,
  PitState,
  ProjectileState
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, saveMatch, updatePlayerStats } from "../utils/firebase";
import type { BeybladeStats, ArenaConfig } from "../types/shared";

// [SERVER-ROOM] BattleRoom — live PVP for 2-4 players.
// Runs full beyblade-vs-beyblade collision detection.
// Arena config cached in onCreate() — never loaded inside tick.

interface PlayerInput {
  moveLeft?: boolean;
  moveRight?: boolean;
  attack?: boolean;
  specialMove?: boolean;
  direction?: { x: number; y: number };
}

interface JoinOptions {
  beybladeId: string;
  arenaId: string;
  userId: string;
  username: string;
}

// Spawn positions distributed evenly around the arena at 60% radius
const SPAWN_OFFSETS = [
  { angle: 0 },
  { angle: Math.PI },
  { angle: Math.PI / 2 },
  { angle: (3 * Math.PI) / 2 },
];

export class BattleRoom extends Room<GameState> {
  private physics!: PhysicsEngine;
  private arenaCache: ArenaConfig | null = null;
  private matchStarted = false;
  private playerCount = 0;
  private warmupTimer = 3; // seconds before match starts

  maxClients = 4;

  async onCreate(options: any) {
    console.log("BattleRoom created", options);

    this.setState(new GameState());
    this.state.mode = options.ranked ? "single-battle-pvp-ranked" : "single-battle-pvp";
    this.state.status = "waiting";
    this.state.timer = 180;

    // Load arena ONCE and cache
    const arenaId = options.arenaId || "default";
    this.arenaCache = await loadArena(arenaId);
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.applyArenaToState(arenaData, arenaId);
      console.log(`✅ BattleRoom: loaded arena ${arenaData.name}`);
    } else {
      this.applyDefaultArena(arenaId);
    }

    this.physics = new PhysicsEngine();

    if (arenaData) {
      this.physics.setArenaConfig(arenaData);
      if (arenaData.obstacles?.length > 0) {
        this.physics.createObstacles(arenaData.obstacles);
      }
    }

    this.buildArenaWalls();

    this.onMessage("input", (client, message: PlayerInput) => {
      this.handleInput(client, message);
    });

    this.onMessage("action", (client, message: any) => {
      this.handleAction(client, message);
    });

    this.onMessage("ready", (client) => {
      console.log(`Client ${client.sessionId} is ready`);
    });

    this.setSimulationInterval((deltaTime: number) => {
      this.tick(deltaTime);
    }, 1000 / 60);
  }

  async onJoin(client: Client, options: JoinOptions) {
    console.log(`Client ${client.sessionId} joined BattleRoom`);
    this.playerCount++;

    const beybladeData: BeybladeStats | null = await loadBeyblade(options.beybladeId);

    const beyblade = new Beyblade();
    beyblade.id = client.sessionId;
    beyblade.userId = options.userId || client.sessionId;
    beyblade.username = options.username || `Player${this.playerCount}`;
    beyblade.beybladeId = options.beybladeId || "default";
    beyblade.isAI = false;

    if (beybladeData) {
      this.applyBeybladeStats(beyblade, beybladeData);
      console.log(`✅ Loaded beyblade: ${beybladeData.displayName} for ${beyblade.username}`);
    } else {
      this.applyDefaultStats(beyblade);
    }

    beyblade.health = 100;

    // Distribute spawn positions
    const spawnIndex = (this.playerCount - 1) % SPAWN_OFFSETS.length;
    const spawnOffset = SPAWN_OFFSETS[spawnIndex];
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const spawnRadius = Math.min(arenaHalfW, arenaHalfH) * 0.5;

    beyblade.x = arenaHalfW + Math.cos(spawnOffset.angle) * spawnRadius;
    beyblade.y = arenaHalfH + Math.sin(spawnOffset.angle) * spawnRadius;

    this.physics.createBeyblade(
      beyblade.id,
      beyblade.x,
      beyblade.y,
      beyblade.radius,
      beyblade.mass,
      beybladeData || undefined
    );

    const initialAngularVelocity = beyblade.spinDirection === "left" ? -10 : 10;
    this.physics.setAngularVelocity(beyblade.id, initialAngularVelocity);

    this.state.beyblades.set(client.sessionId, beyblade);

    // Start match when first player joins (or once maxClients reached)
    if (!this.matchStarted) {
      this.matchStarted = true;
      this.state.status = "warmup";
      this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimer });
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`Client ${client.sessionId} left BattleRoom`);
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (beyblade) {
      beyblade.isActive = false;
      beyblade.isRingOut = true;
    }
    this.physics.removeBeyblade(client.sessionId);
    this.state.beyblades.delete(client.sessionId);
    this.playerCount--;

    if (this.state.status === "in-progress") {
      this.checkWinCondition();
    }
  }

  onDispose() {
    console.log("BattleRoom disposed");
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
    this.state.arena.rotation = arenaData.rotation || 0;
    this.state.arena.gravity = arenaData.gravity || 0;
    this.state.arena.airResistance = arenaData.airResistance || 0.01;
    this.state.arena.surfaceFriction = arenaData.surfaceFriction || 0.01;

    if (arenaData.wall) {
      this.state.arena.wallEnabled = arenaData.wall.enabled;
      this.state.arena.wallBaseDamage = arenaData.wall.baseDamage;
      this.state.arena.wallRecoilDistance = arenaData.wall.recoilDistance;
      this.state.arena.wallHasSpikes = arenaData.wall.hasSpikes;
      this.state.arena.wallSpikeDamageMultiplier = arenaData.wall.spikeDamageMultiplier;
      this.state.arena.wallHasSprings = arenaData.wall.hasSprings;
      this.state.arena.wallSpringRecoilMultiplier = arenaData.wall.springRecoilMultiplier;
    }

    this.state.arena.loopCount = arenaData.loops?.length ?? 0;
    this.state.arena.obstacleCount = arenaData.obstacles?.length ?? 0;
    this.state.arena.pitCount = arenaData.pits?.length ?? 0;
    this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
    this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;
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

  // ─── Input handling ──────────────────────────────────────────────────────────

  private handleInput(client: Client, message: PlayerInput) {
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    if (this.state.status !== "in-progress") return;

    const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
    const forceMagnitude = 0.001 * beyblade.mass * stability * beyblade.speedBonus;

    if (message.moveLeft) {
      const perpX = -Math.sin(beyblade.rotation);
      const perpY = Math.cos(beyblade.rotation);
      this.physics.applyForce(beyblade.id, perpX * forceMagnitude * 1.5, perpY * forceMagnitude * 1.5);
    }

    if (message.moveRight) {
      const perpX = Math.sin(beyblade.rotation);
      const perpY = -Math.cos(beyblade.rotation);
      this.physics.applyForce(beyblade.id, perpX * forceMagnitude * 1.5, perpY * forceMagnitude * 1.5);
    }

    if (message.attack && beyblade.attackCooldown <= 0) {
      const forwardX = Math.cos(beyblade.rotation);
      const forwardY = Math.sin(beyblade.rotation);
      this.physics.applyForce(
        beyblade.id,
        forwardX * forceMagnitude * 3 * beyblade.damageMultiplier,
        forwardY * forceMagnitude * 3 * beyblade.damageMultiplier
      );
      beyblade.attackCooldown = 0.5;
      this.broadcast("attack", { playerId: client.sessionId });
    }

    if (message.specialMove && beyblade.specialCooldown <= 0) {
      this.handleSpecialMove(beyblade);
      beyblade.specialCooldown = 3;
    }

    if (message.direction && (message.direction.x !== 0 || message.direction.y !== 0)) {
      const mag = Math.sqrt(message.direction.x ** 2 + message.direction.y ** 2);
      this.physics.applyForce(
        beyblade.id,
        (message.direction.x / mag) * forceMagnitude,
        (message.direction.y / mag) * forceMagnitude
      );
    }
  }

  // ─── Special moves (same physics-based system as TryoutRoom) ────────────────

  private handleSpecialMove(beyblade: Beyblade) {
    const state = this.physics.getBodyState(beyblade.id);
    if (!state) return;

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
        this.broadcast("special-move", { playerId: beyblade.id, type: "stampede-rush" });
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
        this.broadcast("special-move", { playerId: beyblade.id, type: "gyro-anchor" });
        break;
      }
      case "stamina": {
        const orbitForce = 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, -Math.sin(beyblade.rotation) * orbitForce, Math.cos(beyblade.rotation) * orbitForce);
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200));
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { playerId: beyblade.id, type: "spin-recovery" });
        break;
      }
      case "balanced": {
        const burstForce = 0.003 * beyblade.mass;
        this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * burstForce, Math.sin(beyblade.rotation) * burstForce);
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { playerId: beyblade.id, type: "tactical-burst" });
        break;
      }
    }
  }

  private handleAction(client: Client, message: any) {
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive || this.state.status !== "in-progress") return;

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
    const dt = deltaTime / 1000;

    // Warmup countdown before match starts
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

    const arenaData = this.arenaCache;
    const beybladeIds = Array.from(this.state.beyblades.keys());

    // ── Beyblade-vs-beyblade collision detection (THE PVP FIX) ──────────────
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

        // Apply damage
        b1.health = Math.max(0, b1.health - dmg.damage1);
        b2.health = Math.max(0, b2.health - dmg.damage2);

        // Apply spin steal
        b1.spin = Math.max(0, b1.spin - dmg.spinSteal2);
        b2.spin = Math.max(0, b2.spin - dmg.spinSteal1);

        // Track stats
        b1.damageDealt += dmg.damage2;
        b2.damageDealt += dmg.damage1;
        b1.damageReceived += dmg.damage1;
        b2.damageReceived += dmg.damage2;
        b1.collisions++;
        b2.collisions++;

        this.broadcast("collision", {
          p1: id1,
          p2: id2,
          damage1: dmg.damage1,
          damage2: dmg.damage2,
          spinSteal1: dmg.spinSteal1,
          spinSteal2: dmg.spinSteal2,
          contactPoint: collision.contactPoint,
        });
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

      if (arenaData) {
        this.processArenaFeatures(beyblade, arenaData, dt);
      }

      // Low-spin nutation wobble
      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(beyblade.id, (Math.random() - 0.5) * wobble, (Math.random() - 0.5) * wobble);
      }

      beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * dt);
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      // Spin-out check
      if (beyblade.spin <= 0 && beyblade.isActive) {
        beyblade.isActive = false;
        beyblade.health = 0;
        this.broadcast("spin-out", { playerId: beyblade.id, username: beyblade.username });
      }

      // Cooldowns
      if (beyblade.attackCooldown > 0) beyblade.attackCooldown -= dt;
      if (beyblade.specialCooldown > 0) beyblade.specialCooldown -= dt;

      if (beyblade.isInvulnerable) {
        beyblade.invulnerabilityTimer -= dt;
        if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false;
      }

      if (beyblade.specialMoveActive && Date.now() > beyblade.specialMoveEndTime) {
        beyblade.specialMoveActive = false;
      }

      // Ring-out check
      if (this.state.arena.shape === "circle") {
        const arenaRadius = Math.min(this.state.arena.width, this.state.arena.height) * 16 / 2;
        const isOut = this.physics.isOutOfBounds(
          beyblade.id,
          arenaRadius,
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

    // Match timer
    this.state.timer -= dt;

    // Win condition check
    this.checkWinCondition();
  }

  // ─── Arena feature processing (same as TryoutRoom) ───────────────────────────

  private processArenaFeatures(beyblade: Beyblade, arenaData: ArenaConfig, dt: number) {
    // Speed loops
    if (arenaData.loops?.length > 0) {
      const loopCheck = this.physics.checkLoopCollision(beyblade.id, arenaData.loops);
      if (loopCheck.inLoop && loopCheck.loopConfig) {
        if (!beyblade.inLoop) {
          beyblade.inLoop = true;
          beyblade.loopIndex = loopCheck.loopIndex;
          beyblade.loopEntryTime = Date.now();
          beyblade.loopSpeedBoost = loopCheck.loopConfig.speedBoost;
          beyblade.loopSpinBoost = loopCheck.loopConfig.spinBoost || 0;
          this.physics.applyLoopBoost(beyblade.id, loopCheck.loopConfig.speedBoost);
        }
        if (beyblade.loopSpinBoost > 0) {
          beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.loopSpinBoost * dt);
        }
      } else if (beyblade.inLoop) {
        beyblade.inLoop = false;
        beyblade.loopIndex = -1;
        beyblade.loopSpeedBoost = 1.0;
        beyblade.loopSpinBoost = 0;
      }
    }

    // Water bodies
    const waterBodies = arenaData.waterBodies;
    if (waterBodies?.length > 0) {
      const inWater = this.physics.checkWaterCollision(beyblade.id, waterBodies[0]);
      if (inWater) {
        if (!beyblade.inWater) {
          beyblade.inWater = true;
          beyblade.waterSpeedMultiplier = waterBodies[0].speedMultiplier ?? 0.7;
          beyblade.waterSpinDrain = waterBodies[0].spinDrainRate ?? 10;
        }
        this.physics.applyWaterResistance(beyblade.id, beyblade.waterSpeedMultiplier);
        beyblade.spin = Math.max(0, beyblade.spin - beyblade.waterSpinDrain * dt);
      } else if (beyblade.inWater) {
        beyblade.inWater = false;
        beyblade.waterSpeedMultiplier = 1.0;
        beyblade.waterSpinDrain = 0;
      }
    }

    // Pits
    if (arenaData.pits?.length > 0) {
      const pitConfig = this.physics.checkPitCollision(beyblade.id, arenaData.pits);
      if (pitConfig) {
        if (!beyblade.inPit) {
          beyblade.inPit = true;
          beyblade.currentPitId = `pit_${arenaData.pits.indexOf(pitConfig)}`;
          beyblade.pitDamageRate = pitConfig.damagePerSecond;
        }
        beyblade.spin = Math.max(0, beyblade.spin - beyblade.pitDamageRate * beyblade.spin * dt / 100);
        if (Math.random() < pitConfig.escapeChance * dt) {
          beyblade.inPit = false;
          beyblade.currentPitId = "";
          beyblade.pitDamageRate = 0;
          this.physics.applyForce(beyblade.id, 0, -0.05 * beyblade.mass);
        }
      } else if (beyblade.inPit) {
        beyblade.inPit = false;
        beyblade.currentPitId = "";
        beyblade.pitDamageRate = 0;
      }
    }

    // Obstacles
    const obstacleCheck = this.physics.checkObstacleCollision(beyblade.id);
    if (obstacleCheck.colliding) {
      if (!beyblade.collidingWithObstacle || beyblade.lastObstacleId !== obstacleCheck.obstacleId) {
        beyblade.collidingWithObstacle = true;
        beyblade.lastObstacleId = obstacleCheck.obstacleId || "";
        const damage = obstacleCheck.damage * beyblade.damageTaken;
        beyblade.health -= damage;
        beyblade.damageReceived += damage;
        this.physics.applyKnockback(beyblade.id, { x: beyblade.velocityX, y: beyblade.velocityY }, beyblade.knockbackDistance);
        this.broadcast("obstacle-collision", { playerId: beyblade.id, damage });
      }
    } else {
      beyblade.collidingWithObstacle = false;
      beyblade.lastObstacleId = "";
    }

    // Wall
    if (arenaData.wall?.enabled) {
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

        let recoilForce = arenaData.wall.recoilDistance;
        if (arenaData.wall.hasSprings) recoilForce *= arenaData.wall.springRecoilMultiplier;
        this.physics.applyKnockback(beyblade.id, { x: -dx, y: -dy }, recoilForce * beyblade.knockbackDistance);
        this.broadcast("wall-collision", { playerId: beyblade.id, damage: wallDamage });
      }
    }
  }

  // ─── Win condition ────────────────────────────────────────────────────────────

  private checkWinCondition() {
    if (this.state.status !== "in-progress") return;

    const activeBeyblades = Array.from(this.state.beyblades.values()).filter(b => b.isActive);

    // Timer expired — whoever has highest spin wins
    const timeExpired = this.state.timer <= 0;

    if (activeBeyblades.length <= 1 || timeExpired) {
      let winner: Beyblade | null = null;

      if (activeBeyblades.length === 1) {
        winner = activeBeyblades[0];
      } else if (activeBeyblades.length === 0) {
        // All spun out simultaneously — highest spin at time of death wins
        winner = null;
      } else {
        // Timer expired — highest remaining spin wins
        winner = activeBeyblades.reduce((best, b) => b.spin > best.spin ? b : best, activeBeyblades[0]);
      }

      this.state.status = "finished";
      this.state.winner = winner?.userId ?? "";

      this.broadcast("game-over", {
        winner: winner ? { id: winner.id, userId: winner.userId, username: winner.username } : null,
        reason: activeBeyblades.length <= 1 ? (activeBeyblades.length === 0 ? "simultaneous-spinout" : "last-standing") : "timer",
      });

      // Persist match results
      this.persistMatch(winner);

      // Disconnect room after 5 seconds
      setTimeout(() => this.disconnect(), 5000);
    }
  }

  private async persistMatch(winner: Beyblade | null) {
    try {
      const beyblades = Array.from(this.state.beyblades.values());
      const matchData = {
        mode: this.state.mode,
        arenaId: this.state.arena.id,
        winner: winner?.userId ?? null,
        winnerUsername: winner?.username ?? null,
        duration: 180 - this.state.timer,
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

      // Update player stats for all participants
      for (const b of beyblades) {
        await updatePlayerStats(b.userId, {
          matchesPlayed: 1,
          wins: b.userId === winner?.userId ? 1 : 0,
          totalDamageDealt: b.damageDealt,
          totalCollisions: b.collisions,
        });
      }
    } catch (err) {
      console.error("Failed to persist match result:", err);
    }
  }
}

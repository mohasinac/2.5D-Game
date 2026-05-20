import { Room, Client } from "colyseus";
import {
  GameState,
  Beyblade,
  LoopState,
  ObstacleState,
  PitState,
  ProjectileState
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena } from "../utils/firebase";
import type { BeybladeStats, ArenaConfig } from "../types/shared";

// [SERVER-ROOM] TryoutRoom — solo practice mode (maxClients=1)
// Player vs arena only; no opponent beyblade collision.
// Arena config is loaded ONCE in onCreate() and cached — never inside the tick.

interface PlayerInput {
  // Movement (WASD / Arrow keys)
  moveLeft?: boolean;
  moveRight?: boolean;
  moveUp?: boolean;
  moveDown?: boolean;
  // Actions (IJKL keys)
  jump?: boolean;        // I — airborne (visual scale-up, avoids pits)
  attack?: boolean;      // J — forward burst + 0.5s attack buff
  defense?: boolean;     // K — defense stance (held: reduce incoming damage)
  dodge?: boolean;       // L — lateral burst in spin direction + brief invulnerability
  // Power (spacebar)
  chargeHeld?: boolean;  // spacebar held — charges power meter
  specialTap?: boolean;  // spacebar tap when power >= 50 — fires special move
  // Legacy / compat
  specialMove?: boolean; // legacy — triggers special without power cost
  direction?: { x: number; y: number };
  // Combo detection (server validates)
  comboKeys?: string[];
}

export class TryoutRoom extends Room<GameState> {
  private physics!: PhysicsEngine;
  private arenaCache: ArenaConfig | null = null;
  private simulationStarted = false;
  private lastInputTime = 0;

  maxClients = 1;

  async onCreate(options: any) {
    this.autoDispose = true;
    console.log("TryoutRoom created", options);

    this.setState(new GameState());
    this.state.mode = "tryout";
    this.state.status = "waiting";

    // Load arena ONCE and cache — never call loadArena inside the game loop
    this.arenaCache = await loadArena(options.arenaId);
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.state.arena.id = arenaData.id || options.arenaId;
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
      // turrets replaces laserGuns in new arena config
      this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
      // waterBodies is now an array; hasWaterBody checks first entry
      this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;

      console.log(`✅ Loaded arena: ${arenaData.name}`);
    } else {
      console.log(`⚠️ Arena not found: ${options.arenaId}, using defaults`);
      this.state.arena.id = options.arenaId || "default";
      this.state.arena.name = "Standard Arena";
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

    this.physics = new PhysicsEngine();

    if (arenaData) {
      this.physics.setArenaConfig(arenaData);
      if ((arenaData.obstacles?.length ?? 0) > 0) {
        this.physics.createObstacles(arenaData.obstacles ?? []);
      }
    }

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

    this.onMessage("input", (client, message) => {
      this.handleInput(client, message);
    });

    this.onMessage("action", (client, message) => {
      this.handleAction(client, message);
    });

    // Simulation starts in onJoin once a player is present.
  }

  async onJoin(client: Client, options: any) {
    console.log(`Client ${client.sessionId} joined tryout room`);

    const beybladeData: BeybladeStats | null = await loadBeyblade(options.beybladeId);

    const beyblade = new Beyblade();
    beyblade.id = client.sessionId;
    beyblade.userId = options.userId || client.sessionId;
    beyblade.username = options.username || "Player";
    beyblade.beybladeId = options.beybladeId || "default";
    beyblade.isAI = false;

    if (beybladeData) {
      this.applyBeybladeStats(beyblade, beybladeData);
      console.log(`✅ Loaded beyblade: ${beybladeData.displayName}`);
    } else {
      console.log(`⚠️ Beyblade not found: ${options.beybladeId}, using defaults`);
      this.applyDefaultStats(beyblade);
    }

    beyblade.health = beyblade.maxStamina;
    beyblade.x = (this.state.arena.width * 16) / 2;
    beyblade.y = (this.state.arena.height * 16) / 2;

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
    this.state.status = "in-progress";
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now();

    if (!this.simulationStarted) {
      this.simulationStarted = true;
      this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`Client ${client.sessionId} left tryout room`);
    this.physics.removeBeyblade(client.sessionId);
    this.state.beyblades.delete(client.sessionId);
    // autoDispose handles room cleanup when client count hits 0.
  }

  onDispose() {
    console.log("TryoutRoom disposed");
    this.physics.destroy();
  }

  // ─── Stat helpers ────────────────────────────────────────────────────────────

  private applyBeybladeStats(beyblade: Beyblade, data: BeybladeStats) {
    beyblade.type = data.type;
    beyblade.spinDirection = data.spinDirection;
    beyblade.mass = data.mass;
    beyblade.radius = data.radius;

    const PIXELS_PER_CM = 24;
    beyblade.actualSize = data.radius * PIXELS_PER_CM;

    const attack = data.typeDistribution.attack;
    const defense = data.typeDistribution.defense;
    const stamina = data.typeDistribution.stamina;

    beyblade.attackPoints = attack;
    beyblade.defensePoints = defense;
    beyblade.staminaPoints = stamina;

    // Attack: burst force and damage multiplier (capped at 2.05x — more realistic)
    beyblade.damageMultiplier = 1.0 + attack * 0.007;
    beyblade.speedBonus = 1.0 + attack * 0.007;

    // Defense: damage absorption and gyro resistance
    beyblade.damageTaken = Math.max(0.45, 1 - defense * 0.003);
    beyblade.knockbackDistance = 10 * (1 - defense * 0.00167);
    // invulnerabilityChance is a true invulnerability-on-special, not per-hit random
    beyblade.invulnerabilityChance = 0.1 + defense * 0.000667;

    // Stamina: endurance and spin recovery
    beyblade.maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
    beyblade.stamina = beyblade.maxStamina;
    beyblade.spinStealFactor = 0.1 * (1 + stamina * 0.02667);
    beyblade.spinDecayRate = 8 * (1 - stamina * 0.001);
    beyblade.maxSpin = Math.ceil(2000 * (1 + stamina * 0.008));
    beyblade.spin = beyblade.maxSpin;

    // Type archetype bonuses applied on top of distribution
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
      // stamina type: keep computed maxStamina (up to 3000)
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

  // ─── Input handling ──────────────────────────────────────────────────────────

  private handleInput(client: Client, message: PlayerInput) {
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    this.lastInputTime = Date.now();

    // Spin-linked force: lower spin = weaker control (realistic)
    const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
    const forceMagnitude = 0.001 * beyblade.mass * stability * beyblade.speedBonus;

    // Full input block during stun or combo lock (movement still allowed during stun)
    const actionBlocked = beyblade.comboExecuting;

    // ── 4-direction movement (WASD) ──────────────────────────────────────────
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
    if (message.moveUp) {
      this.physics.applyForce(beyblade.id, Math.cos(beyblade.rotation) * forceMagnitude * 1.5, Math.sin(beyblade.rotation) * forceMagnitude * 1.5);
    }
    if (message.moveDown) {
      this.physics.applyForce(beyblade.id, -Math.cos(beyblade.rotation) * forceMagnitude, -Math.sin(beyblade.rotation) * forceMagnitude);
    }

    if (actionBlocked || beyblade.stunTimer > 0) return;

    // ── Jump (I) — airborne flag, not real Y movement ────────────────────────
    if (message.jump && !beyblade.isAirborne && !beyblade.inPit && !beyblade.isDefending && beyblade.landingLag <= 0) {
      beyblade.isAirborne = true;
      beyblade.airborneTimer = 1.0;
    }

    // ── Attack (J) — forward burst + attack buff ─────────────────────────────
    if (message.attack && beyblade.attackCooldown <= 0) {
      this.physics.applyForce(
        beyblade.id,
        Math.cos(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier,
        Math.sin(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier
      );
      beyblade.attackBuffTimer = 0.5;
      beyblade.attackCooldown = 1.5;
      this.broadcast("attack", { playerId: client.sessionId });
    }

    // ── Defense (K) — stance: reduces incoming damage while held ─────────────
    if (message.defense && !beyblade.isAirborne && beyblade.landingLag <= 0) {
      beyblade.isDefending = true;
      beyblade.defenseBuffTimer = 0.1; // refreshed each input tick while held
    } else if (!message.defense) {
      beyblade.isDefending = false;
    }

    // ── Dodge (L) — lateral burst in spin direction + brief invulnerability ──
    const canDodge = !beyblade.inPit && !beyblade.isDefending && beyblade.power >= 10 && beyblade.dodgeBuffTimer <= 0;
    if (message.dodge && canDodge) {
      this.physics.applyLateralForce(beyblade.id, beyblade.spinDirection, forceMagnitude * 4 * beyblade.speedBonus);
      beyblade.dodgeBuffTimer = 0.4;
      beyblade.power = Math.max(0, beyblade.power - 10);
    }

    // ── Power meter (spacebar) ───────────────────────────────────────────────
    if (message.chargeHeld) {
      const isMoving = !!(message.moveLeft || message.moveRight || message.moveUp || message.moveDown);
      beyblade.power = Math.min(100, beyblade.power + (isMoving ? 2 : 1));
    }

    // ── Special move (spacebar tap when power >= 50) ─────────────────────────
    const wantsSpecial = message.specialTap || message.specialMove;
    if (wantsSpecial && beyblade.specialCooldown <= 0) {
      const hasPower = message.specialTap ? beyblade.power >= 50 : true;
      if (hasPower) {
        this.handleSpecialMove(beyblade);
        if (message.specialTap) beyblade.power = Math.max(0, beyblade.power - 50);
        beyblade.specialCooldown = 3;
      }
    }

    // ── Legacy direction input ───────────────────────────────────────────────
    if (message.direction && (message.direction.x !== 0 || message.direction.y !== 0)) {
      const mag = Math.sqrt(message.direction.x ** 2 + message.direction.y ** 2);
      this.physics.applyForce(beyblade.id, (message.direction.x / mag) * forceMagnitude, (message.direction.y / mag) * forceMagnitude);
    }
  }

  // ─── Special moves — physics-based trajectories ───────────────────────────

  private handleSpecialMove(beyblade: Beyblade) {
    const state = this.physics.getBodyState(beyblade.id);
    if (!state) return;

    switch (beyblade.type) {
      case "attack": {
        // Stampede Rush: sudden charge in facing direction + spin boost
        const rushForce = 0.005 * beyblade.mass * beyblade.damageMultiplier;
        this.physics.applyForce(
          beyblade.id,
          Math.cos(beyblade.rotation) * rushForce,
          Math.sin(beyblade.rotation) * rushForce
        );
        // Boost spin briefly (caps at maxSpin)
        const boostedSpin = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.8);
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -boostedSpin : boostedSpin
        );
        this.broadcast("special-move", { playerId: beyblade.id, type: "stampede-rush" });
        break;
      }

      case "defense": {
        // Gyro Anchor: maximize spin, drastically reduce velocity to near zero
        const maxAngular = beyblade.maxSpin / 200;
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -maxAngular : maxAngular
        );
        // Zero out linear velocity (gyroscopic lock-in-place)
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
        // Spin Recovery: enter a precession orbit — apply perpendicular force to create circular movement
        // Recover spin at same time
        const orbitForce = 0.002 * beyblade.mass;
        const perpX = -Math.sin(beyblade.rotation);
        const perpY = Math.cos(beyblade.rotation);
        this.physics.applyForce(beyblade.id, perpX * orbitForce, perpY * orbitForce);
        // Recover 40% of max spin
        const recovered = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.maxSpin * 0.4);
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -(recovered / 200) : (recovered / 200)
        );
        beyblade.spin = recovered;
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.2);
        this.broadcast("special-move", { playerId: beyblade.id, type: "spin-recovery" });
        break;
      }

      case "balanced": {
        // Tactical Burst: directional speed burst in current facing direction
        const burstForce = 0.003 * beyblade.mass;
        this.physics.applyForce(
          beyblade.id,
          Math.cos(beyblade.rotation) * burstForce,
          Math.sin(beyblade.rotation) * burstForce
        );
        // Moderate spin boost
        const boosted = Math.min(beyblade.maxSpin, Math.abs(state.angularVelocity) * 1.5);
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -boosted : boosted
        );
        beyblade.stamina = Math.min(beyblade.maxStamina, beyblade.stamina + beyblade.maxStamina * 0.15);
        this.broadcast("special-move", { playerId: beyblade.id, type: "tactical-burst" });
        break;
      }
    }
  }

  private handleAction(client: Client, message: any) {
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
    this.lastInputTime = Date.now();

    switch (message.type) {
      case "charge": {
        const cur = this.physics.getBodyState(beyblade.id);
        if (cur) {
          const boosted = Math.min(beyblade.maxSpin / 200, Math.abs(cur.angularVelocity) * 1.5);
          this.physics.setAngularVelocity(beyblade.id, beyblade.spinDirection === "left" ? -boosted : boosted);
        }
        break;
      }
      case "dash": {
        const dashForce = 0.01 * beyblade.mass;
        this.physics.applyForce(beyblade.id, dashForce, 0);
        break;
      }
    }
  }

  // ─── Game tick — synchronous, no async calls ─────────────────────────────

  private tick(deltaTime: number) {
    if (this.state.status !== "in-progress") return;

    if (Date.now() - this.lastInputTime > 60_000) {
      this.broadcast("idle-disconnect", {});
      this.disconnect();
      return;
    }

    const dt = deltaTime / 1000; // seconds
    this.physics.update(deltaTime);

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
        this.processArenaFeatures(beyblade, arenaData, dt);
      }

      // Spin-linked speed cap: high-speed movement penalized when spin is low
      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        // Nutation wobble — erratic drift when nearly spun out
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(
          beyblade.id,
          (Math.random() - 0.5) * wobble,
          (Math.random() - 0.5) * wobble
        );
      }

      // Spin decay (gyroscopic friction against arena surface)
      beyblade.spin = Math.max(0, beyblade.spin - beyblade.spinDecayRate * dt);

      // Stamina drain proportional to angular velocity
      beyblade.stamina = Math.max(0, beyblade.stamina - Math.abs(physicsState.angularVelocity) * 0.01);

      // Spin-out check
      if (beyblade.spin <= 0 && beyblade.isActive) {
        beyblade.isActive = false;
        beyblade.health = 0;
        this.broadcast("spin-out", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, type: beyblade.type });
      }

      // Cooldown tickers
      if (beyblade.attackCooldown > 0) beyblade.attackCooldown -= dt;
      if (beyblade.specialCooldown > 0) beyblade.specialCooldown -= dt;

      // Invulnerability timer
      if (beyblade.isInvulnerable) {
        beyblade.invulnerabilityTimer -= dt;
        if (beyblade.invulnerabilityTimer <= 0) beyblade.isInvulnerable = false;
      }

      // Special move state
      if (beyblade.specialMoveActive && Date.now() > beyblade.specialMoveEndTime) {
        beyblade.specialMoveActive = false;
      }

      // ── Phase C: new action buff timers ─────────────────────────────────────
      if (beyblade.attackBuffTimer > 0) {
        beyblade.attackBuffTimer = Math.max(0, beyblade.attackBuffTimer - dt);
      }
      if (beyblade.dodgeBuffTimer > 0) {
        beyblade.dodgeBuffTimer = Math.max(0, beyblade.dodgeBuffTimer - dt);
        // Dodge entering a pit cancels the buff
        if (beyblade.inPit) beyblade.dodgeBuffTimer = 0;
      }
      // Defense buff: refreshed by handleInput while K is held; expires if not held
      if (beyblade.defenseBuffTimer > 0) {
        beyblade.defenseBuffTimer = Math.max(0, beyblade.defenseBuffTimer - dt);
        if (beyblade.defenseBuffTimer <= 0) beyblade.isDefending = false;
      }
      // Defense stance stamina drain (≈1 per 60Hz tick)
      if (beyblade.isDefending) {
        beyblade.stamina = Math.max(0, beyblade.stamina - 60 * dt);
        if (beyblade.stamina < 10) { beyblade.isDefending = false; beyblade.defenseBuffTimer = 0; }
      }

      // Airborne timer
      if (beyblade.isAirborne) {
        beyblade.airborneTimer = Math.max(0, beyblade.airborneTimer - dt);
        if (beyblade.airborneTimer <= 0) {
          beyblade.isAirborne = false;
          beyblade.landingLag = 0.2;
        }
      }
      if (beyblade.landingLag > 0) beyblade.landingLag = Math.max(0, beyblade.landingLag - dt);

      // Stun and combo lock timers
      if (beyblade.stunTimer > 0) beyblade.stunTimer = Math.max(0, beyblade.stunTimer - dt);
      if (beyblade.comboExecuting && beyblade.comboTimer > 0) {
        beyblade.comboTimer = Math.max(0, beyblade.comboTimer - dt);
        if (beyblade.comboTimer <= 0) beyblade.comboExecuting = false;
      }

      // Passive power gain in speed path (+2/tick as per plan)
      if (beyblade.inLoop) {
        beyblade.power = Math.min(100, beyblade.power + 2);
      }

      // Ring-out check (circular arena)
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
          this.broadcast("ring-out", { playerId: beyblade.id });
        }
      }
    });
  }

  // ─── Arena feature collision handling ────────────────────────────────────

  private processArenaFeatures(beyblade: Beyblade, arenaData: ArenaConfig, dt: number) {
    // Speed loop collision
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

    // Water body collision (new: waterBodies is an array)
    const waterBodies = arenaData.waterBodies;
    if ((waterBodies?.length ?? 0) > 0) {
      const inWater = this.physics.checkWaterCollision(beyblade.id, waterBodies![0]);
      if (inWater) {
        if (!beyblade.inWater) {
          beyblade.inWater = true;
          const wc = waterBodies![0];
          const speedLoss = wc.effects?.speedLoss ?? 0.3;
          beyblade.waterSpeedMultiplier = 1 - speedLoss;
          beyblade.waterSpinDrain = wc.effects?.spinDrainPerSecond ?? 10;
        }
        this.physics.applyWaterResistance(beyblade.id, beyblade.waterSpeedMultiplier);
        beyblade.spin = Math.max(0, beyblade.spin - beyblade.waterSpinDrain * dt);
      } else if (beyblade.inWater) {
        beyblade.inWater = false;
        beyblade.waterSpeedMultiplier = 1.0;
        beyblade.waterSpinDrain = 0;
      }
    }

    // Pit collision
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
        const canEscape = beyblade.spin > (beyblade.maxSpin * escapeThreshold / 100);
        if (canEscape && Math.random() < 0.1 * dt) {
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

    // Obstacle collision
    const obstacleCheck = this.physics.checkObstacleCollision(beyblade.id);
    if (obstacleCheck.colliding) {
      if (!beyblade.collidingWithObstacle || beyblade.lastObstacleId !== obstacleCheck.obstacleId) {
        beyblade.collidingWithObstacle = true;
        beyblade.lastObstacleId = obstacleCheck.obstacleId || "";
        const damage = obstacleCheck.damage * beyblade.damageTaken;
        beyblade.health -= damage;
        beyblade.damageReceived += damage;
        this.physics.applyKnockback(
          beyblade.id,
          { x: beyblade.velocityX, y: beyblade.velocityY },
          beyblade.knockbackDistance
        );
        this.broadcast("obstacle-collision", { playerId: beyblade.id, damage });
      }
    } else {
      beyblade.collidingWithObstacle = false;
      beyblade.lastObstacleId = "";
    }

    // Wall collision
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

        this.physics.applyKnockback(
          beyblade.id,
          { x: -dx, y: -dy },
          recoilForce * beyblade.knockbackDistance
        );
        this.broadcast("wall-collision", { playerId: beyblade.id, damage: wallDamage });
      }
    }
  }
}

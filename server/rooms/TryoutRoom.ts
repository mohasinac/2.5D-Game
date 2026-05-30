import { Client } from "colyseus";
import {
  GameState,
  Beyblade,
} from "./schema/GameState";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { loadBeyblade, loadArena, loadArenaSystem } from "../utils/firebase";
import { loadGlobalSettings } from "../utils/tournamentFirebase";
import { loadGimmickDefs } from "../utils/firestoreLoaders";
import { expandGimmicks } from "../utils/gimmickExpander";
import { tryReserveRoom, releaseRoom, setMaxActiveRooms } from "../shared/utils/roomCounter";
import { createPRNG } from "../shared/utils/prng";
import { hashString } from "../shared/utils/hashString";
import { normalizeInput, type PlayerInput } from "../shared/utils/bitmask";
import { resolveWallAngle, computeTiltForce, getFloorAngleAtRadius } from "../shared/physics/ArenaUtils";
import { resolvePhysicsFlags } from "../utils/physicsFlags";
import { processArenaFeatures } from "../shared/rooms/ArenaFeatureProcessor";
import { populateArenaFeatures } from "../shared/rooms/populateArenaFeatures";
import { advanceArenaRotation, advanceArenaTilt, applyWeightTilt } from "../shared/rooms/advanceArenaRotation";
import type { BeybladeStats } from "../types/shared";
import {
  applyMovementInput,
  applyActionInput,
  computeForceMagnitude,
} from "../shared/rooms/InputHandler";
import { BaseRoom } from "./BaseRoom";
import { LAUNCH_GRACE_POWER } from "../shared/constants/gameConstants";

// [SERVER-ROOM] TryoutRoom — solo practice mode (maxClients=1)
// Player vs arena only; no opponent beyblade collision.
// Arena config is loaded ONCE in onCreate() and cached — never inside the tick.

export class TryoutRoom extends BaseRoom<GameState> {
  private simulationStarted = false;
  private lastInputTime = 0;
  private spawnAngle = 0; // angle used for position-offset calculation

  maxClients = 1;

  protected override onLaunchTimeout(): void {
    this.state.beyblades.forEach(bey => {
      if (!bey.launchReady) {
        bey.launchPower = LAUNCH_GRACE_POWER;
        bey.launchReady = true;
      }
    });
  }

  async onCreate(options: any) {
    if (!tryReserveRoom()) throw new Error("Server at capacity (max 20 rooms)");

    this.autoDispose = true;
    console.log("TryoutRoom created", options);

    this.globalSettings = await loadGlobalSettings();
    if (this.globalSettings?.maintenanceMode) throw new Error("Maintenance");
    if (this.globalSettings?.enableTryout === false) throw new Error("Tryout disabled");
    if (this.globalSettings?.maxActiveRooms) setMaxActiveRooms(this.globalSettings.maxActiveRooms);

    this.setState(new GameState());
    this.state.mode = "tryout";
    this.state.status = "waiting";

    const seed = hashString(options.sessionId || String(Date.now()));
    this.rand = createPRNG(seed);

    this.arenaCache = await loadArena(options.arenaId);
    const arenaData = this.arenaCache;

    if (arenaData) {
      this.state.arena.id = arenaData.id || options.arenaId;
      this.state.arena.name = arenaData.name;
      this.state.arena.width = arenaData.width;
      this.state.arena.height = arenaData.height;
      this.state.arena.shape = arenaData.shape;
      this.state.arena.theme = arenaData.theme;
      this.state.arena.rotation = 0; // angle (radians), advanced each tick
      this.state.arena.autoRotate = !!arenaData.autoRotate;
      this.state.arena.rotationSpeed = arenaData.rotationSpeed || 0;
      this.state.arena.rotationDirection = arenaData.rotationDirection === "counter-clockwise" ? "counterclockwise" : "clockwise";
      this.state.arena.tiltAngle           = arenaData.tiltAngle           ?? 0;
      this.state.arena.tiltDirection       = arenaData.tiltDirection       ?? 0;
      this.state.arena.tiltMode            = arenaData.tiltMode            ?? "fixed";
      this.state.arena.autoTilt            = !!arenaData.autoTilt;
      this.state.arena.tiltSpeed           = arenaData.tiltSpeed           ?? 0;
      this.state.arena.tiltPivotX          = arenaData.tiltPivotX          ?? 0;
      this.state.arena.tiltPivotY          = arenaData.tiltPivotY          ?? 0;
      this.state.arena.tiltOscillateMin    = arenaData.tiltOscillateMin    ?? 0;
      this.state.arena.tiltOscillateMax    = arenaData.tiltOscillateMax    ?? arenaData.tiltAngle ?? 0;
      this.state.arena.tiltOscillatePeriodMs = arenaData.tiltOscillatePeriodMs ?? 4000;
      this.state.arena.tiltPhaseMs         = 0;
      this.state.arena.rotationPivotX      = arenaData.rotationPivotX      ?? 0;
      this.state.arena.rotationPivotY      = arenaData.rotationPivotY      ?? 0;
      populateArenaFeatures(this.state, arenaData as any, this.globalSettings);
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

      this.state.arena.loopCount = arenaData.loops?.length ?? (arenaData as any).speedPaths?.length ?? 0;
      this.state.arena.obstacleCount = arenaData.obstacles?.length ?? 0;
      this.state.arena.pitCount = arenaData.pits?.length ?? 0;
      this.state.arena.turretCount = arenaData.turrets?.length ?? 0;
      this.state.arena.waterBodyCount = arenaData.waterBodies?.length ?? 0;
      this.state.arena.arenaWallDamageMult       = (arenaData as any).wallDamageMult       ?? 1.0;
      this.state.arena.arenaObstacleDamageMult   = (arenaData as any).obstacleDamageMult   ?? 1.0;
      this.state.arena.arenaBeyDamageMult        = (arenaData as any).beyDamageMult        ?? 1.0;
      this.state.arena.arenaProjectileDamageMult = (arenaData as any).projectileDamageMult ?? 1.0;
      this.state.arena.arenaFriendlyFireEnabled  = (arenaData as any).friendlyFireEnabled  ?? true;
      this.state.arena.arenaPhaseObstacles       = (arenaData as any).phaseObstacles       ?? false;

      const wb = (arenaData as any).worldBackground;
      this.state.arena.worldBgType     = wb?.type     ?? "none";
      this.state.arena.worldBgColor    = wb?.color    ?? "";
      this.state.arena.worldBgImageUrl = wb?.imageUrl ?? "";
      this.state.arena.worldBgOpacity  = wb?.opacity  ?? 1.0;
      this.state.arena.worldBgFit      = wb?.fit      ?? "cover";
      this.state.arena.worldBgBlurPx   = wb?.blurPx   ?? 0;

      console.log(`✅ Loaded arena: ${arenaData.name}`);
    } else {
      console.log(`⚠️ Arena not found: ${options.arenaId}, using defaults`);
      this.state.arena.id = options.arenaId || "classic_stadium";
      this.state.arena.name = "Standard Arena";
      this.state.arena.width = 50;
      this.state.arena.height = 50;
      this.state.arena.shape = "circle";
      this.state.arena.theme = "default";
      this.state.arena.gravity = 0;
      this.state.arena.airResistance = 0.01;
      this.state.arena.surfaceFriction = 0.01;
      this.state.arena.wallEnabled = true;
      this.state.arena.wallBaseDamage = 5;
      this.state.arena.wallRecoilDistance = 2;
      this.state.arena.wallAngle = 0;
    }

    if (options.arenaSystemId) {
      this.arenaSystem = await loadArenaSystem(options.arenaSystemId);
      if (this.arenaSystem) {
        console.log(`✅ Loaded arena system: ${this.arenaSystem.displayName}`);
      }
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

    this.onMessage("input", (client, message: number | PlayerInput) => {
      this.handleInput(client, normalizeInput(message));
    });

    this.onMessage("action", (client, message) => {
      this.handleAction(client, message);
    });

    this.registerLaunchInputHandler();
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
    beyblade.maxHealth = beyblade.maxStamina;
    beyblade.x = (this.state.arena.width * 16) / 2;
    beyblade.y = (this.state.arena.height * 16) / 2;

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

    this.spawnAngle = 0; // tryout spawns at center; angle 0 for position offset
    this.state.beyblades.set(client.sessionId, beyblade);

    // Expand gimmicks for this bey
    const gimmickDefsCache = await loadGimmickDefs();
    const gimmickIds: string[] = (beybladeData as any)?.gimmickIds ?? [];
    if (gimmickIds.length > 0) {
      const instances = expandGimmicks(gimmickIds, gimmickDefsCache);
      instances.forEach(inst => beyblade.mechanics.push(inst));
    }

    this.state.status = "warmup";
    this.resetWarmupTimer();
    this.state.timer = this.warmupTimerBase;
    this.lastInputTime = Date.now();
    this.broadcast("match-warmup", { secondsUntilStart: this.warmupTimerBase });

    if (!this.simulationStarted) {
      this.simulationStarted = true;
      this.setSimulationInterval((dt: number) => { this.tick(dt); }, 1000 / 60);
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`Client ${client.sessionId} left tryout room`);
    this.physics.removeBeyblade(client.sessionId);
    this.state.beyblades.delete(client.sessionId);
  }

  onDispose() {
    console.log("TryoutRoom disposed");
    releaseRoom();
    this.physics.destroy();
  }

  // ─── Stat helpers ────────────────────────────────────────────────────────────

  // ─── Input handling — delegates to shared/rooms/InputHandler ────────────────

  private handleInput(client: Client, message: PlayerInput) {
    const beyblade = this.state.beyblades.get(client.sessionId);
    if (!beyblade || !beyblade.isActive) return;
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
  }

  // ─── Special moves — physics-based trajectories ───────────────────────────

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
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -boostedSpin : boostedSpin
        );
        this.broadcast("special-move", { playerId: beyblade.id, type: "stampede-rush" });
        break;
      }

      case "defense": {
        const maxAngular = beyblade.maxSpin / 200;
        this.physics.setAngularVelocity(
          beyblade.id,
          beyblade.spinDirection === "left" ? -maxAngular : maxAngular
        );
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
        const perpX = -Math.sin(beyblade.rotation);
        const perpY = Math.cos(beyblade.rotation);
        this.physics.applyForce(beyblade.id, perpX * orbitForce, perpY * orbitForce);
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
        const burstForce = 0.003 * beyblade.mass;
        this.physics.applyForce(
          beyblade.id,
          Math.cos(beyblade.rotation) * burstForce,
          Math.sin(beyblade.rotation) * burstForce
        );
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

  // ─── Launch phase ─────────────────────────────────────────────────────────

  private startMatchFromLaunch() {
    const arenaHalfW = (this.state.arena.width * 16) / 2;
    const arenaHalfH = (this.state.arena.height * 16) / 2;
    const baseRadius = Math.min(arenaHalfW, arenaHalfH) * 0.3; // smaller offset for tryout (centered arena)

    this.state.beyblades.forEach((bey) => {
      const radiusMult = 0.6 + bey.launchPosition * 0.8;
      bey.x = arenaHalfW + Math.cos(this.spawnAngle) * baseRadius * radiusMult;
      bey.y = arenaHalfH + Math.sin(this.spawnAngle) * baseRadius * radiusMult;
      this.physics.setPosition(bey.id, bey.x, bey.y);

      const powerFraction = Math.max(0.01, bey.launchPower / 100);
      bey.spin = bey.maxSpin * powerFraction;
      const angVel = (bey.spinDirection === "left" ? -1 : 1) * (bey.maxSpin * powerFraction / 200);
      this.physics.setAngularVelocity(bey.id, angVel);
      bey.beyTiltAngle = Math.abs(bey.launchTilt);
    });

    this.state.status = "in-progress";
    this.state.timer = 180;
    this.state.startTime = Date.now();
    this.lastInputTime = Date.now();
    this.broadcast("match-start", {});
  }

  // ─── Game tick — synchronous, no async calls ─────────────────────────────

  private tick(deltaTime: number) {
    const dt = deltaTime / 1000;

    if (this.tickWarmupPhase(dt)) return;
    if (this.state.status === "warmup") return;

    if (this.tickLaunchPhase(dt)) {
      this.startMatchFromLaunch();
      return;
    }
    if (this.state.status === "launching") return;

    if (this.state.status !== "in-progress") return;

    if (Date.now() - this.lastInputTime > 60_000) {
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

    // Apply slope physics if using a 2.5D arena system
    if (this.arenaSystem) {
      this.state.beyblades.forEach(b => this.applyArenaSystemSlope(b));
    }

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
        if (events.obstacleHit) {
          this.broadcast("obstacle-collision", events.obstacleHit);
        }
        if (events.wallHit) {
          this.broadcast("wall-collision", events.wallHit);
        }
      }

      // Nutation wobble (seeded PRNG for deterministic physics)
      const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
      if (stability < 0.4) {
        const wobble = (1 - stability) * 0.002 * beyblade.mass;
        this.physics.applyForce(
          beyblade.id,
          (this.rand() - 0.5) * wobble,
          (this.rand() - 0.5) * wobble
        );
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
        this.broadcast("spin-out", { playerId: beyblade.id, x: beyblade.x, y: beyblade.y, type: beyblade.type });
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

      if (beyblade.attackBuffTimer > 0) {
        beyblade.attackBuffTimer = Math.max(0, beyblade.attackBuffTimer - dt);
      }
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

      if (beyblade.inLoop) {
        beyblade.power = Math.min(100, beyblade.power + 2);
      }

      // 2.5D hook: PartSystemManager.tickBey() goes here (no-op in base).
      this.onTickedBey(beyblade, dt);

      // Ring-out check — at 90% of wall radius to catch beyblades before they escape
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
          this.broadcast("ring-out", { playerId: beyblade.id });
        }
      }
    });
  }

  // ─── 2.5D extension hooks — overridden by Parts25DTryoutRoom ─────────────

  protected override onTickedBey(_beyblade: Beyblade, _dt: number): void {
    // override in 2.5D subclass to call partSystemManager.tickBey()
  }
}

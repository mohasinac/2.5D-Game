import Matter from "matter-js";
import { Beyblade } from "../rooms/schema/GameState";
import type {
  ArenaConfig,
  LoopConfig,
  ObstacleConfig,
  WaterBodyConfig,
  PitConfig,
  BeybladeStats,
  PointOfContact
} from "../types/shared";
import { COLLISION_CATEGORIES, buildCollisionMask, type BeybladePhysicsFlags } from "../utils/physicsFlags";

// [SERVER-PHYSICS] PhysicsEngine — Matter.js wrapper for server-authoritative physics.
// Coordinates: 1 em = 16px, 1 cm = 24px. Arena center is (arenaW*16/2, arenaH*16/2).

const MATERIAL_MULTIPLIERS: Record<string, { damage: number; spinSteal: number; recoil: number }> = {
  abs:           { damage: 1.0, spinSteal: 0.5, recoil: 0.7 },
  rubber:        { damage: 0.7, spinSteal: 1.5, recoil: 0.4 },
  metal:         { damage: 1.5, spinSteal: 0.8, recoil: 1.2 },
  pom:           { damage: 1.1, spinSteal: 0.7, recoil: 0.9 },
  polycarbonate: { damage: 0.9, spinSteal: 0.6, recoil: 0.8 },
};

// Tolerance in mm for radial contact matching (a CP only fires if the contact radius
// is within this band of cp.radius — prevents WD contact firing on AR collision).
const RADIAL_CONTACT_TOLERANCE_MM = 2;

interface CollisionResult {
  beyblade1Id: string;
  beyblade2Id: string;
  contactPoint: { x: number; y: number };
  relativeVelocity: { x: number; y: number };
  impactForce: number;
  contactAngle1: number;
  contactAngle2: number;
}

export class PhysicsEngine {
  private engine: Matter.Engine;
  private world: Matter.World;
  private bodies: Map<string, Matter.Body> = new Map();
  private beybladeStats: Map<string, BeybladeStats> = new Map();
  private arenaConfig: ArenaConfig | null = null;

  private arenaCenterX: number = 0;
  private arenaCenterY: number = 0;
  private arenaRadius: number = 0;

  private obstacles: Map<string, Matter.Body> = new Map();

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
    });
    this.world = this.engine.world;
    this.world.bounds = {
      min: { x: -2000, y: -2000 },
      max: { x: 2000, y: 2000 },
    };
  }

  setArenaConfig(config: ArenaConfig): void {
    this.arenaConfig = config;
    this.arenaCenterX = (config.width * 16) / 2;
    this.arenaCenterY = (config.height * 16) / 2;
    this.arenaRadius = Math.min(config.width, config.height) * 16 * 0.45;
  }

  createBeyblade(id: string, x: number, y: number, radius: number, mass: number, stats?: BeybladeStats, flags?: BeybladePhysicsFlags): Matter.Body {
    // radius in cm — convert to pixels
    const radiusPx = radius * 24;
    const collisionMask = flags ? buildCollisionMask(flags) : (
      COLLISION_CATEGORIES.BEYBLADE | COLLISION_CATEGORIES.ARENA_WALL |
      COLLISION_CATEGORIES.OBSTACLE | COLLISION_CATEGORIES.PROJECTILE
    );
    const body = Matter.Bodies.circle(x, y, radiusPx, {
      mass,
      restitution: 0.8,
      friction: 0.01,
      frictionAir: 0.01,
      label: id,
      collisionFilter: {
        category: COLLISION_CATEGORIES.BEYBLADE,
        mask: collisionMask,
      },
    });

    Matter.World.add(this.world, body);
    this.bodies.set(id, body);
    if (stats) this.beybladeStats.set(id, stats);

    return body;
  }

  /** Update a beyblade's collision mask at runtime (e.g. after physicsFlags change). */
  updateCollisionFilter(id: string, flags: BeybladePhysicsFlags): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.set(body, "collisionFilter", {
      category: COLLISION_CATEGORIES.BEYBLADE,
      mask: buildCollisionMask(flags),
    });
  }

  createObstacles(obstacles: ObstacleConfig[]): void {
    obstacles.forEach((obstacle, index) => {
      const x = obstacle.x * 16;
      const y = obstacle.y * 16;
      const radius = obstacle.radius * 16;

      const body = Matter.Bodies.circle(x, y, radius, {
        isStatic: true,
        restitution: 0.9,
        friction: 0.1,
        label: `obstacle_${index}`,
        collisionFilter: {
          category: COLLISION_CATEGORIES.OBSTACLE,
          mask: COLLISION_CATEGORIES.BEYBLADE,
        },
      });

      Matter.World.add(this.world, body);
      this.obstacles.set(`obstacle_${index}`, body);
    });
  }

  createCircularArena(centerX: number, centerY: number, radius: number): void {
    const segments = 64;
    const angleStep = (Math.PI * 2) / segments;
    const wallThickness = 20;

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const wall = Matter.Bodies.rectangle(x, y, wallThickness, radius / 8, {
        isStatic: true,
        angle: angle + Math.PI / 2,
        restitution: 0.9,
        friction: 0.1,
      });

      Matter.World.add(this.world, wall);
    }
  }

  createRectangularArena(width: number, height: number): void {
    const wallThickness = 20;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
    ];
    Matter.World.add(this.world, walls);
  }

  applyForce(id: string, forceX: number, forceY: number): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
  }

  setAngularVelocity(id: string, velocity: number): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.setAngularVelocity(body, velocity);
  }

  setPosition(id: string, x: number, y: number): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.setPosition(body, { x, y });
  }

  setLinearVelocity(id: string, vx: number, vy: number): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.setVelocity(body, { x: vx, y: vy });
  }

  setFrictionMultiplier(id: string, multiplier: number): void {
    const body = this.bodies.get(id);
    if (!body) return;
    body.friction = Math.max(0.001, 0.01 * multiplier);
    body.frictionAir = Math.max(0.001, 0.01 * multiplier);
  }

  /** Toggle collision sensor mode for a beyblade body (used for high-jump / meteor-strike hang). */
  setBodySensor(id: string, isSensor: boolean): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.set(body, "isSensor", isSensor);
  }

  update(deltaTime?: number): void {
    const dt = deltaTime ?? (1000 / 60);
    Matter.Engine.update(this.engine, dt);
  }

  getBodyState(id: string): {
    x: number; y: number; rotation: number;
    velocityX: number; velocityY: number; angularVelocity: number;
  } | null {
    const body = this.bodies.get(id);
    if (!body) return null;
    return {
      x: body.position.x,
      y: body.position.y,
      rotation: body.angle,
      velocityX: body.velocity.x,
      velocityY: body.velocity.y,
      angularVelocity: body.angularVelocity,
    };
  }

  // ─── Beyblade collision ──────────────────────────────────────────────────────

  checkBeybladeCollision(id1: string, id2: string): CollisionResult | null {
    const body1 = this.bodies.get(id1);
    const body2 = this.bodies.get(id2);
    if (!body1 || !body2) return null;

    // Use Matter.Collision.collides throughout (consistent — SAT removed)
    const collision = Matter.Collision.collides(body1, body2);
    if (!collision) return null;

    const contactPoint = collision.supports[0] || body1.position;

    const relVelX = body1.velocity.x - body2.velocity.x;
    const relVelY = body1.velocity.y - body2.velocity.y;
    const relativeSpeed = Math.sqrt(relVelX * relVelX + relVelY * relVelY);

    const totalMass = body1.mass + body2.mass;
    const impactForce = relativeSpeed * totalMass;

    const dx1 = contactPoint.x - body1.position.x;
    const dy1 = contactPoint.y - body1.position.y;
    const contactAngle1 = this.normalizeAngle(Math.atan2(dy1, dx1) - body1.angle);

    const dx2 = contactPoint.x - body2.position.x;
    const dy2 = contactPoint.y - body2.position.y;
    const contactAngle2 = this.normalizeAngle(Math.atan2(dy2, dx2) - body2.angle);

    return {
      beyblade1Id: id1,
      beyblade2Id: id2,
      contactPoint: { x: contactPoint.x, y: contactPoint.y },
      relativeVelocity: { x: relVelX, y: relVelY },
      impactForce,
      contactAngle1,
      contactAngle2,
    };
  }

  calculateCollisionDamage(
    collision: CollisionResult,
    beyblade1: Beyblade,
    beyblade2: Beyblade
  ): { damage1: number; damage2: number; spinSteal1: number; spinSteal2: number } {
    const stats1 = this.beybladeStats.get(beyblade1.id);
    const stats2 = this.beybladeStats.get(beyblade2.id);

    // Raw base damage before any multipliers
    const rawDamage = collision.impactForce * 0.5;

    // Compute contact radius in mm from each bey's center to the contact point
    const body1 = this.bodies.get(beyblade1.id);
    const body2 = this.bodies.get(beyblade2.id);
    const contactRadiusMm1 = body1
      ? Math.sqrt((collision.contactPoint.x - body1.position.x) ** 2 + (collision.contactPoint.y - body1.position.y) ** 2) / 24 * 10
      : 0;
    const contactRadiusMm2 = body2
      ? Math.sqrt((collision.contactPoint.x - body2.position.x) ** 2 + (collision.contactPoint.y - body2.position.y) ** 2) / 24 * 10
      : 0;

    // Spin fractions for extends gimmick evaluation
    const spinFrac1 = beyblade1.maxSpin > 0 ? beyblade1.spin / beyblade1.maxSpin : 1;
    const spinFrac2 = beyblade2.maxSpin > 0 ? beyblade2.spin / beyblade2.maxSpin : 1;

    // Contact point multipliers (what angle each beyblade hits at + radial gate + material mult)
    const contactMult1 = stats1
      ? this.getContactPointMultiplier(stats1.pointsOfContact, collision.contactAngle1, contactRadiusMm1, spinFrac1)
      : 1.0;
    const contactMult2 = stats2
      ? this.getContactPointMultiplier(stats2.pointsOfContact, collision.contactAngle2, contactRadiusMm2, spinFrac2)
      : 1.0;

    // Attack buff (J key active): +40% outgoing damage multiplier
    const attackBuff1 = beyblade1.attackBuffTimer > 0 ? 1.4 : 1.0;
    const attackBuff2 = beyblade2.attackBuffTimer > 0 ? 1.4 : 1.0;

    // Outgoing damage: raw × contact multiplier × attacker's damage multiplier × attack buff
    // (Element type effectiveness is applied in BattleRoom after this call, at the collision loop)
    let outDamageFrom1 = rawDamage * contactMult1 * beyblade1.damageMultiplier * attackBuff1;
    let outDamageFrom2 = rawDamage * contactMult2 * beyblade2.damageMultiplier * attackBuff2;

    // Spin steal uses RAW damage (pre-defense) for a fair stamina calculation
    const oppositeSpin = beyblade1.spinDirection !== beyblade2.spinDirection;
    const stealMultiplier = oppositeSpin ? 1.5 : 0.5;

    const spinSteal1 = rawDamage * beyblade1.spinStealFactor * stealMultiplier;
    const spinSteal2 = rawDamage * beyblade2.spinStealFactor * stealMultiplier;

    // Defense buff (K stance active): extra 40% damage reduction on top of base damageTaken
    const defenseBuff1 = beyblade1.defenseBuffTimer > 0 ? 0.6 : 1.0;
    const defenseBuff2 = beyblade2.defenseBuffTimer > 0 ? 0.6 : 1.0;

    // Apply defense AFTER spin steal is calculated (defense only reduces HP damage)
    let damage1 = outDamageFrom2 * beyblade1.damageTaken * defenseBuff1;
    let damage2 = outDamageFrom1 * beyblade2.damageTaken * defenseBuff2;

    // Invulnerability: isInvulnerable (special move) or dodgeBuffTimer (L dodge) blocks ALL damage
    if (beyblade1.isInvulnerable || beyblade1.dodgeBuffTimer > 0) damage1 = 0;
    if (beyblade2.isInvulnerable || beyblade2.dodgeBuffTimer > 0) damage2 = 0;

    // Friendly fire: same non-empty teamId → skip damage/spin-steal but let physics recoil through.
    // Matter.js has already resolved the physical impulse; we only gate the stat changes here.
    const t1 = beyblade1.teamId ?? "";
    const t2 = beyblade2.teamId ?? "";
    if (t1 && t1 === t2) {
      return { damage1: 0, damage2: 0, spinSteal1: 0, spinSteal2: 0 };
    }

    // noKnockback flag: caller must check beyblade.noKnockback to skip applyKnockback().
    // noDamageOutput flag: zero outgoing damage from flagged bey.
    if (beyblade1.noDamageOutput) damage2 = 0;
    if (beyblade2.noDamageOutput) damage1 = 0;

    return { damage1, damage2, spinSteal1, spinSteal2 };
  }

  // Returns true only if the contact radius is within tolerance of the CP's defined radius.
  // Prevents a WD-rim CP from firing when the collision happens at the AR's larger radius.
  // CPs without a defined radius always match (backward compatible with old flat stats).
  // Arc-segment CPs (from SystemContactPoint with radiusInner/radiusOuter) use the full radial
  // range stored as radius ± thickness/2.
  checkRadialContactMatch(contactRadiusMm: number, cp: PointOfContact): boolean {
    if (cp.radius === undefined) return true;
    // Arc-segment: use thickness as band width (rInner..rOuter stored as radius ± thickness/2)
    if (cp.thickness !== undefined && cp.thickness > 0) {
      const rInner = cp.radius - cp.thickness / 2;
      const rOuter = cp.radius + cp.thickness / 2;
      return contactRadiusMm >= rInner && contactRadiusMm <= rOuter;
    }
    const activeCPRadius = cp.radius;
    return Math.abs(contactRadiusMm - activeCPRadius) <= RADIAL_CONTACT_TOLERANCE_MM;
  }

  private getContactPointMultiplier(
    pointsOfContact: PointOfContact[],
    angle: number,
    contactRadiusMm = 0,
    currentSpinFraction = 1.0,
  ): number {
    let maxMultiplier = 1.0;
    for (const cp of pointsOfContact) {
      // Radial gate — skip CPs that don't match the contact radius
      if (!this.checkRadialContactMatch(contactRadiusMm, cp)) continue;

      // Resolve effective radius/width if this CP extends at high spin
      let effectiveWidth = cp.width;
      if (cp.extends && cp.extendedWidth !== undefined && cp.extendThreshold !== undefined) {
        if (currentSpinFraction >= cp.extendThreshold) {
          effectiveWidth = cp.extendedWidth;
        }
      }

      const cpAngleRad = (cp.angle * Math.PI) / 180;
      const halfWidth  = (effectiveWidth * Math.PI) / 360;
      const angleDiff  = Math.abs(this.normalizeAngle(angle - cpAngleRad));
      if (angleDiff > halfWidth) continue;

      // Base multiplier from the CP
      let mult = cp.damageMultiplier;

      // Apply material damage multiplier
      if (cp.material) {
        const mat = MATERIAL_MULTIPLIERS[cp.material];
        if (mat) mult *= mat.damage;
      }

      // Roller with freeSpin uses rubber multipliers regardless of roller material
      if (cp.roller?.freeSpin) {
        mult *= MATERIAL_MULTIPLIERS.rubber.damage;
      }

      maxMultiplier = Math.max(maxMultiplier, mult);
    }
    return maxMultiplier;
  }

  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }

  // ─── Arena feature collision ─────────────────────────────────────────────────

  checkLoopCollision(beybladeId: string, loops: LoopConfig[]): {
    inLoop: boolean; loopIndex: number; loopConfig: LoopConfig | null;
  } {
    const body = this.bodies.get(beybladeId);
    if (!body || !this.arenaConfig) return { inLoop: false, loopIndex: -1, loopConfig: null };

    for (let i = 0; i < loops.length; i++) {
      const loop = loops[i];
      const loopRadiusPx = loop.radius * 16;

      const dx = body.position.x - this.arenaCenterX;
      const dy = body.position.y - this.arenaCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const tolerance = 20;

      if (Math.abs(distance - loopRadiusPx) < tolerance) {
        return { inLoop: true, loopIndex: i, loopConfig: loop };
      }
    }

    return { inLoop: false, loopIndex: -1, loopConfig: null };
  }

  checkWaterCollision(beybladeId: string, waterBody?: WaterBodyConfig): boolean {
    if (!waterBody) return false;

    const body = this.bodies.get(beybladeId);
    if (!body) return false;

    const dx = body.position.x - this.arenaCenterX;
    const dy = body.position.y - this.arenaCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    switch (waterBody.type) {
      case "moat": {
        const innerRadius = waterBody.distanceFromArena * 16;
        const outerRadius = (waterBody.distanceFromArena + waterBody.thickness) * 16;
        return distance >= innerRadius && distance <= outerRadius;
      }

      case "zone": {
        const zoneX = waterBody.position.x * 16 + this.arenaCenterX;
        const zoneY = waterBody.position.y * 16 + this.arenaCenterY;
        const zoneRadius = (waterBody.radius ?? 5) * 16;
        const zdx = body.position.x - zoneX;
        const zdy = body.position.y - zoneY;
        return Math.sqrt(zdx * zdx + zdy * zdy) < zoneRadius;
      }

      case "wall-based":
        return false;

      default:
        return false;
    }
  }

  checkPitCollision(beybladeId: string, pits: PitConfig[]): PitConfig | null {
    const body = this.bodies.get(beybladeId);
    if (!body) return null;

    for (const pit of pits) {
      const pitX = pit.x * 16;
      const pitY = pit.y * 16;
      const pitRadius = pit.radius * 16;
      const dx = body.position.x - pitX;
      const dy = body.position.y - pitY;
      if (Math.sqrt(dx * dx + dy * dy) < pitRadius) return pit;
    }

    return null;
  }

  // Fixed: uses Matter.Collision.collides (consistent with beyblade-beyblade collision)
  checkObstacleCollision(beybladeId: string): {
    colliding: boolean; obstacleId: string | null; damage: number;
  } {
    const body = this.bodies.get(beybladeId);
    if (!body) return { colliding: false, obstacleId: null, damage: 0 };

    for (const [id, obstacle] of this.obstacles) {
      const collision = Matter.Collision.collides(body, obstacle);
      if (collision) {
        const relVelX = body.velocity.x - obstacle.velocity.x;
        const relVelY = body.velocity.y - obstacle.velocity.y;
        const relativeSpeed = Math.sqrt(relVelX * relVelX + relVelY * relVelY);

        let damage = relativeSpeed * 0.5;
        if (obstacle.label.startsWith("wall")) damage *= 1.5;

        return { colliding: true, obstacleId: id, damage };
      }
    }

    return { colliding: false, obstacleId: null, damage: 0 };
  }

  // ─── Utility force methods ───────────────────────────────────────────────────

  applyLoopBoost(beybladeId: string, speedBoost: number): void {
    const body = this.bodies.get(beybladeId);
    if (!body) return;
    Matter.Body.setVelocity(body, {
      x: body.velocity.x * speedBoost,
      y: body.velocity.y * speedBoost,
    });
  }

  applyWaterResistance(beybladeId: string, speedMultiplier: number): void {
    const body = this.bodies.get(beybladeId);
    if (!body) return;
    Matter.Body.setVelocity(body, {
      x: body.velocity.x * speedMultiplier,
      y: body.velocity.y * speedMultiplier,
    });
  }

  applySurfaceFriction(beybladeId: string, frictionMultiplier: number): void {
    const body = this.bodies.get(beybladeId);
    if (!body || !this.arenaConfig) return;
    const baseFriction = this.arenaConfig.surfaceFriction || 0.01;
    Matter.Body.set(body, { friction: baseFriction * frictionMultiplier });
  }

  applyKnockback(beybladeId: string, direction: { x: number; y: number }, force: number): void {
    const body = this.bodies.get(beybladeId);
    if (!body) return;

    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (magnitude === 0) return;

    Matter.Body.applyForce(body, body.position, {
      x: (direction.x / magnitude) * force * 0.01,
      y: (direction.y / magnitude) * force * 0.01,
    });
  }

  // Dodge mechanic: lateral burst perpendicular to current velocity (in spin direction)
  applyLateralForce(beybladeId: string, spinDirection: string, magnitude: number): void {
    const body = this.bodies.get(beybladeId);
    if (!body) return;

    const vel = body.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    let perpX: number, perpY: number;
    if (speed > 0.1) {
      const normX = vel.x / speed;
      const normY = vel.y / speed;
      // right-spin: dodge right (perpendicular clockwise), left-spin: dodge left
      if (spinDirection === "right") { perpX = normY; perpY = -normX; }
      else                           { perpX = -normY; perpY = normX; }
    } else {
      const angle = body.angle;
      if (spinDirection === "right") { perpX = Math.sin(angle);  perpY = -Math.cos(angle); }
      else                           { perpX = -Math.sin(angle); perpY = Math.cos(angle); }
    }

    Matter.Body.applyForce(body, body.position, { x: perpX * magnitude, y: perpY * magnitude });
  }

  isOutOfBounds(id: string, arenaRadius: number, centerX: number, centerY: number): boolean {
    const body = this.bodies.get(id);
    if (!body) return false;
    const dx = body.position.x - centerX;
    const dy = body.position.y - centerY;
    return Math.sqrt(dx * dx + dy * dy) > arenaRadius;
  }

  getAllBeybladeIds(): string[] {
    return Array.from(this.bodies.keys());
  }

  removeBeyblade(id: string): void {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.World.remove(this.world, body);
    this.bodies.delete(id);
    this.beybladeStats.delete(id);
  }

  destroy(): void {
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
    this.bodies.clear();
    this.beybladeStats.clear();
    this.obstacles.clear();
  }
}

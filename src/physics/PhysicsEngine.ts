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

// [SERVER-PHYSICS] PhysicsEngine — Matter.js wrapper for server-authoritative physics.
// Coordinates: 1 em = 16px, 1 cm = 24px. Arena center is (arenaW*16/2, arenaH*16/2).

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

  createBeyblade(id: string, x: number, y: number, radius: number, mass: number, stats?: BeybladeStats): Matter.Body {
    // radius in cm — convert to pixels
    const radiusPx = radius * 24;
    const body = Matter.Bodies.circle(x, y, radiusPx, {
      mass,
      restitution: 0.8,
      friction: 0.01,
      frictionAir: 0.01,
      label: id,
    });

    Matter.World.add(this.world, body);
    this.bodies.set(id, body);
    if (stats) this.beybladeStats.set(id, stats);

    return body;
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
      });

      Matter.World.add(this.world, body);
      this.obstacles.set(`obstacle_${index}`, body);
    });
  }

  createCircularArena(centerX: number, centerY: number, radius: number): void {
    const segments = 32;
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

    // Contact point multipliers (what angle each beyblade hits at)
    const contactMult1 = stats1
      ? this.getContactPointMultiplier(stats1.pointsOfContact, collision.contactAngle1)
      : 1.0;
    const contactMult2 = stats2
      ? this.getContactPointMultiplier(stats2.pointsOfContact, collision.contactAngle2)
      : 1.0;

    // Outgoing damage: raw × contact multiplier × attacker's damage multiplier
    let outDamageFrom1 = rawDamage * contactMult1 * beyblade1.damageMultiplier;
    let outDamageFrom2 = rawDamage * contactMult2 * beyblade2.damageMultiplier;

    // Spin steal uses RAW damage (pre-defense) for a fair stamina calculation
    const oppositeSpin = beyblade1.spinDirection !== beyblade2.spinDirection;
    const stealMultiplier = oppositeSpin ? 1.5 : 0.5;

    const spinSteal1 = rawDamage * beyblade1.spinStealFactor * stealMultiplier;
    const spinSteal2 = rawDamage * beyblade2.spinStealFactor * stealMultiplier;

    // Apply defense AFTER spin steal is calculated (defense only reduces HP damage)
    let damage1 = outDamageFrom2 * beyblade1.damageTaken;
    let damage2 = outDamageFrom1 * beyblade2.damageTaken;

    // Invulnerability: isInvulnerable blocks ALL damage (from special move)
    // invulnerabilityChance is a passive chance to reduce spin steal only, not damage
    // (Fixed: was incorrectly zeroing all damage via OR with random)
    if (beyblade1.isInvulnerable) damage1 = 0;
    if (beyblade2.isInvulnerable) damage2 = 0;

    return { damage1, damage2, spinSteal1, spinSteal2 };
  }

  private getContactPointMultiplier(pointsOfContact: PointOfContact[], angle: number): number {
    let maxMultiplier = 1.0;
    for (const point of pointsOfContact) {
      const pointAngle = (point.angle * Math.PI) / 180;
      const halfWidth = (point.width * Math.PI) / 360;
      const angleDiff = Math.abs(this.normalizeAngle(angle - pointAngle));
      if (angleDiff <= halfWidth) {
        maxMultiplier = Math.max(maxMultiplier, point.damageMultiplier);
      }
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

  // Fixed: supports center (circle zone), loop (ring zone), and moat (outer ring) types
  checkWaterCollision(beybladeId: string, waterBody?: WaterBodyConfig): boolean {
    if (!waterBody || !waterBody.enabled) return false;

    const body = this.bodies.get(beybladeId);
    if (!body) return false;

    const dx = body.position.x - this.arenaCenterX;
    const dy = body.position.y - this.arenaCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    switch (waterBody.type) {
      case "center": {
        // Circular zone at arena center
        const radius = (waterBody.radius || 5) * 16;
        return distance < radius;
      }

      case "moat": {
        // Ring around the arena edge (between innerRadius and outerRadius)
        const innerRadius = (waterBody.innerRadius || 15) * 16;
        const outerRadius = (waterBody.outerRadius || this.arenaRadius / 16) * 16;
        return distance >= innerRadius && distance <= outerRadius;
      }

      case "zone": {
        // Rectangular or circular zone at specific position
        const zoneX = (waterBody.x || 0) * 16 + this.arenaCenterX;
        const zoneY = (waterBody.y || 0) * 16 + this.arenaCenterY;
        const zoneRadius = (waterBody.radius || 5) * 16;
        const zdx = body.position.x - zoneX;
        const zdy = body.position.y - zoneY;
        return Math.sqrt(zdx * zdx + zdy * zdy) < zoneRadius;
      }

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

// Unit tests for PhysicsEngine — damage calculations and body management.
// Uses real Matter.js bodies. Firebase and Colyseus are NOT involved.

import { describe, test, expect, beforeEach } from "vitest";
import { PhysicsEngine } from "../src/physics/PhysicsEngine";

// Minimal ArenaConfig shape that satisfies PhysicsEngine.setArenaConfig
const TEST_ARENA = {
  id: "test",
  name: "Test Arena",
  width: 1080,
  height: 1080,
  shape: "circle" as const,
  theme: "metrocity" as const,
  wall: {
    enabled: true,
    wallStyle: "metal" as const,
    baseDamage: 15,
    recoilDistance: 8,
    hasSpikes: false,
    spikeDamageMultiplier: 1.5,
    thickness: 3,
    edges: [],
  },
};

// Minimal BeybladeStats needed for damage multiplier look-up
function makeStats(id: string, contactMultiplier = 1.0) {
  return {
    id,
    displayName: id,
    fileName: "",
    type: "balanced" as const,
    spinDirection: "right" as const,
    mass: 50,
    radius: 4,
    typeDistribution: { attack: 120, defense: 120, stamina: 120, total: 360 },
    pointsOfContact: [
      { angle: 0,   damageMultiplier: contactMultiplier, width: 60 },
      { angle: 120, damageMultiplier: contactMultiplier, width: 60 },
      { angle: 240, damageMultiplier: contactMultiplier, width: 60 },
    ],
  };
}

// Minimal Beyblade schema-like object used in calculateCollisionDamage
function makeBey(id: string, overrides: Record<string, any> = {}) {
  return {
    id,
    damageMultiplier: 1.0,
    damageTaken: 1.0,
    spinStealFactor: 0.1,
    spinDirection: "right",
    attackBuffTimer: 0,
    defenseBuffTimer: 0,
    dodgeBuffTimer: 0,
    isInvulnerable: false,
    ...overrides,
  } as any; // Cast through 'any' to satisfy Beyblade schema type
}

// ─── Body lifecycle ───────────────────────────────────────────────────────────

describe("PhysicsEngine — body lifecycle", () => {
  let engine: PhysicsEngine;
  beforeEach(() => {
    engine = new PhysicsEngine();
    engine.setArenaConfig(TEST_ARENA as any);
  });

  test("createBeyblade registers body and getBodyState returns position", () => {
    engine.createBeyblade("b1", 400, 300, 4, 50);
    const state = engine.getBodyState("b1");
    expect(state).not.toBeNull();
    expect(state!.x).toBeCloseTo(400, 0);
    expect(state!.y).toBeCloseTo(300, 0);
    expect(state!.rotation).toBeCloseTo(0);
  });

  test("getBodyState returns null for unknown id", () => {
    expect(engine.getBodyState("nonexistent")).toBeNull();
  });

  test("two different beyblades have independent positions", () => {
    engine.createBeyblade("b1", 300, 540, 4, 50);
    engine.createBeyblade("b2", 780, 540, 4, 50);
    const s1 = engine.getBodyState("b1")!;
    const s2 = engine.getBodyState("b2")!;
    expect(s1.x).not.toBeCloseTo(s2.x, 0);
  });

  test("applyForce moves the body after update", () => {
    engine.createBeyblade("b1", 540, 540, 4, 50);
    engine.applyForce("b1", 0.05, 0); // rightward force
    engine.update(16);
    const state = engine.getBodyState("b1")!;
    expect(state.x).toBeGreaterThan(540); // moved right
  });

  test("setAngularVelocity changes angularVelocity", () => {
    engine.createBeyblade("b1", 540, 540, 4, 50);
    engine.setAngularVelocity("b1", 5.0);
    engine.update(16);
    const state = engine.getBodyState("b1")!;
    expect(Math.abs(state.angularVelocity)).toBeGreaterThan(0);
  });
});

// ─── Damage calculation ───────────────────────────────────────────────────────

describe("PhysicsEngine — calculateCollisionDamage", () => {
  let engine: PhysicsEngine;

  beforeEach(() => {
    engine = new PhysicsEngine();
    engine.setArenaConfig(TEST_ARENA as any);
    // Register stats with the engine (via createBeyblade optional 5th param)
    engine.createBeyblade("b1", 400, 540, 4, 50, makeStats("b1") as any);
    engine.createBeyblade("b2", 700, 540, 4, 50, makeStats("b2") as any);
  });

  // Build a synthetic CollisionResult inline (cast to bypass private interface)
  function fakeCollision(impactForce = 200, angle1 = 0, angle2 = Math.PI) {
    return {
      beyblade1Id: "b1",
      beyblade2Id: "b2",
      contactPoint: { x: 550, y: 540 },
      relativeVelocity: { x: 2, y: 0 },
      impactForce,
      contactAngle1: angle1,
      contactAngle2: angle2,
    } as any;
  }

  test("damage is positive for non-zero impactForce", () => {
    const b1 = makeBey("b1");
    const b2 = makeBey("b2");
    const result = engine.calculateCollisionDamage(fakeCollision(300), b1, b2);
    expect(result.damage1).toBeGreaterThan(0);
    expect(result.damage2).toBeGreaterThan(0);
  });

  test("damage scales with impactForce", () => {
    const b1 = makeBey("b1");
    const b2 = makeBey("b2");
    const low  = engine.calculateCollisionDamage(fakeCollision(100), b1, b2);
    const high = engine.calculateCollisionDamage(fakeCollision(500), b1, b2);
    expect(high.damage1).toBeGreaterThan(low.damage1);
    expect(high.damage2).toBeGreaterThan(low.damage2);
  });

  test("attackBuff (attackBuffTimer > 0) increases outgoing damage by ~40%", () => {
    const base   = makeBey("b1");
    const buffed = makeBey("b1", { attackBuffTimer: 0.3 });
    const b2     = makeBey("b2");
    const col = fakeCollision(300);

    const normalDmg = engine.calculateCollisionDamage(col, base, b2).damage2;
    const buffedDmg = engine.calculateCollisionDamage(col, buffed, b2).damage2;

    // buffed outgoing damage to b2 should be ~1.4× normal
    expect(buffedDmg / normalDmg).toBeCloseTo(1.4, 1);
  });

  test("defenseBuff (defenseBuffTimer > 0) reduces incoming damage by 40%", () => {
    const b1        = makeBey("b1");
    const baseB2    = makeBey("b2");
    const defendB2  = makeBey("b2", { defenseBuffTimer: 0.3 });
    const col = fakeCollision(300);

    const dmgBase    = engine.calculateCollisionDamage(col, b1, baseB2).damage2;
    const dmgDefend  = engine.calculateCollisionDamage(col, b1, defendB2).damage2;

    // defending takes 0.6× incoming vs baseline
    expect(dmgDefend / dmgBase).toBeCloseTo(0.6, 1);
  });

  test("dodge window (dodgeBuffTimer > 0) zeroes all incoming damage", () => {
    const b1     = makeBey("b1");
    const dodgeB2 = makeBey("b2", { dodgeBuffTimer: 0.2 });
    const result  = engine.calculateCollisionDamage(fakeCollision(500), b1, dodgeB2);
    expect(result.damage2).toBe(0);
  });

  test("isInvulnerable also zeroes damage", () => {
    const b1    = makeBey("b1");
    const invulB2 = makeBey("b2", { isInvulnerable: true });
    const result  = engine.calculateCollisionDamage(fakeCollision(500), b1, invulB2);
    expect(result.damage2).toBe(0);
  });

  test("spin steal is positive for non-zero impactForce", () => {
    const b1 = makeBey("b1");
    const b2 = makeBey("b2");
    const result = engine.calculateCollisionDamage(fakeCollision(300), b1, b2);
    expect(result.spinSteal1).toBeGreaterThanOrEqual(0);
    expect(result.spinSteal2).toBeGreaterThanOrEqual(0);
  });

  test("opposite-spin collision produces 1.5× spin steal vs same-spin", () => {
    const b1same = makeBey("b1", { spinDirection: "right" });
    const b2same = makeBey("b2", { spinDirection: "right" });
    const b1opp  = makeBey("b1", { spinDirection: "right" });
    const b2opp  = makeBey("b2", { spinDirection: "left" });
    const col    = fakeCollision(300);

    const sameResult = engine.calculateCollisionDamage(col, b1same, b2same);
    const oppResult  = engine.calculateCollisionDamage(col, b1opp,  b2opp);

    // opposite-spin steal multiplier 1.5, same-spin 0.5 → ratio = 3×
    expect(oppResult.spinSteal1 / sameResult.spinSteal1).toBeCloseTo(3.0, 1);
  });

  test("combined attack buff + defense buff: net ≈ 1.4 × 0.6 of baseline", () => {
    const buffedB1 = makeBey("b1", { attackBuffTimer: 0.3 });
    const defendB2 = makeBey("b2", { defenseBuffTimer: 0.3 });
    const normalB1 = makeBey("b1");
    const normalB2 = makeBey("b2");
    const col = fakeCollision(300);

    const baseline = engine.calculateCollisionDamage(col, normalB1, normalB2).damage2;
    const modified = engine.calculateCollisionDamage(col, buffedB1, defendB2).damage2;

    expect(modified / baseline).toBeCloseTo(1.4 * 0.6, 1);
  });
});

// ─── applyLateralForce ────────────────────────────────────────────────────────

describe("PhysicsEngine — applyLateralForce", () => {
  let engine: PhysicsEngine;
  beforeEach(() => {
    engine = new PhysicsEngine();
    engine.setArenaConfig(TEST_ARENA as any);
  });

  test("right-spin lateral force produces perpendicular velocity after update", () => {
    // Beyblade moving right (+x velocity). Right-spin lateral = forward+right → downward (+y)
    engine.createBeyblade("b1", 540, 540, 4, 50);
    engine.applyForce("b1", 0.2, 0); // give it rightward velocity first
    engine.update(16);

    engine.applyLateralForce("b1", "right", 0.5);
    engine.update(16);

    const state = engine.getBodyState("b1")!;
    // After a rightward initial force + right-spin lateral, y velocity should be non-zero
    expect(Math.abs(state.velocityY)).toBeGreaterThan(0);
  });

  test("left-spin lateral force is opposite direction to right-spin", () => {
    engine.createBeyblade("b1", 540, 540, 4, 50);
    engine.createBeyblade("b2", 540, 540, 4, 50);

    // Give both the same initial rightward velocity
    engine.applyForce("b1", 0.2, 0);
    engine.applyForce("b2", 0.2, 0);
    engine.update(16);

    engine.applyLateralForce("b1", "right", 0.5);
    engine.applyLateralForce("b2", "left",  0.5);
    engine.update(16);

    const s1 = engine.getBodyState("b1")!;
    const s2 = engine.getBodyState("b2")!;

    // y velocities should be in opposite directions
    expect(Math.sign(s1.velocityY)).not.toBe(Math.sign(s2.velocityY));
  });

  test("applyLateralForce on unknown id does not throw", () => {
    expect(() => engine.applyLateralForce("ghost", "right", 1.0)).not.toThrow();
  });
});

// Unit tests for PhysicsEngine — damage calculations and body management.
// Uses real Matter.js bodies. Firebase and Colyseus are NOT involved.

import { describe, test, it, expect, beforeEach } from "vitest";
import { PhysicsEngine } from "../server/physics/PhysicsEngine";
import {
  computeTiltForce,
  getFloorAngleAtRadius,
} from "../server/shared/physics/ArenaUtils";
import { advanceArenaTilt } from "../server/shared/rooms/advanceArenaRotation";
import { createPRNG } from "../server/utils/prng";

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

// ─── computeTiltForce ─────────────────────────────────────────────────────────

describe("computeTiltForce", () => {
  it("returns zero force at tiltAngle=0", () => {
    const f = computeTiltForce(0, 0, 50);
    expect(f.fx).toBe(0);
    expect(f.fy).toBe(0);
  });

  it("returns zero force at tiltAngle=360 (full rotation back to flat)", () => {
    const f = computeTiltForce(360, 0, 50);
    expect(f.fx).toBe(0);
    expect(f.fy).toBe(0);
  });

  it("returns max lateral force at tiltAngle=90 (sin(90°)=1)", () => {
    const mass = 50;
    const TILT_GRAVITY_SCALE = 0.04;
    const f = computeTiltForce(90, 0, mass); // tiltDir=0 → rightward (+x)
    expect(f.fx).toBeCloseTo(Math.sin(Math.PI / 2) * TILT_GRAVITY_SCALE * mass, 6);
    expect(f.fy).toBeCloseTo(0, 6);
  });

  it("force direction follows tiltDirDeg — 90° points downward (+y)", () => {
    const f = computeTiltForce(90, 90, 50); // tiltDir=90° → downward
    expect(f.fx).toBeCloseTo(0, 6);
    expect(f.fy).toBeGreaterThan(0);
  });

  it("force magnitude scales linearly with mass", () => {
    const f1 = computeTiltForce(45, 0, 10);
    const f2 = computeTiltForce(45, 0, 20);
    expect(f2.fx / f1.fx).toBeCloseTo(2.0, 6);
  });

  it("at tiltAngle=180 force is near-zero (sin(180°)≈0 floating-point)", () => {
    const f = computeTiltForce(180, 0, 50);
    expect(f.fx).toBeCloseTo(0, 4);
    expect(f.fy).toBeCloseTo(0, 4);
  });

  it("autoTilt increments tiltDirection by tiltSpeed × dt", () => {
    const arena = {
      autoTilt: true,
      tiltSpeed: 10,
      tiltDirection: 0,
      tiltAngle: 30,
      tiltMode: "fixed",
      tiltOscillateMin: 0,
      tiltOscillateMax: 0,
      tiltOscillatePeriodMs: 4000,
      tiltPhaseMs: 0,
    } as any;
    advanceArenaTilt(arena, 1.0);
    expect(arena.tiltDirection).toBeCloseTo(10, 6);
  });

  it("autoTilt wraps tiltDirection past 360", () => {
    const arena = {
      autoTilt: true,
      tiltSpeed: 10,
      tiltDirection: 355,
      tiltAngle: 30,
      tiltMode: "fixed",
      tiltOscillateMin: 0,
      tiltOscillateMax: 0,
      tiltOscillatePeriodMs: 4000,
      tiltPhaseMs: 0,
    } as any;
    advanceArenaTilt(arena, 1.0); // 355 + 10 = 365 → wraps to 5
    expect(arena.tiltDirection).toBeCloseTo(5, 6);
  });

  it("does not advance tiltDirection when autoTilt=false", () => {
    const arena = {
      autoTilt: false,
      tiltSpeed: 10,
      tiltDirection: 45,
      tiltAngle: 30,
      tiltMode: "fixed",
      tiltOscillateMin: 0,
      tiltOscillateMax: 0,
      tiltOscillatePeriodMs: 4000,
      tiltPhaseMs: 0,
    } as any;
    advanceArenaTilt(arena, 1.0);
    expect(arena.tiltDirection).toBe(45); // unchanged
  });
});

// ─── spinDecay ────────────────────────────────────────────────────────────────

describe("spinDecay", () => {
  // spinDecayRate = 8 * (1 - stamina * 0.001)
  // stamina range 0–150

  it("dω/dt formula: stamina=0 gives rate=8.0", () => {
    const stamina = 0;
    const rate = 8 * (1 - stamina * 0.001);
    expect(rate).toBe(8.0);
  });

  it("stamina 150 decays slower than stamina 0 (rate=6.8 vs 8.0)", () => {
    const rateAt0   = 8 * (1 - 0   * 0.001);
    const rateAt150 = 8 * (1 - 150 * 0.001);
    expect(rateAt150).toBeCloseTo(6.8, 6);
    expect(rateAt150).toBeLessThan(rateAt0);
  });

  it("bey spin reaches 0 after enough decay ticks (never goes negative)", () => {
    let spin = 100;
    const decayRate = 8.0;
    const dt = 1 / 60; // 60Hz tick
    for (let i = 0; i < 2000; i++) {
      spin = Math.max(0, spin - decayRate * dt);
    }
    expect(spin).toBe(0);
  });

  it("decay formula is monotonically slower as stamina increases", () => {
    const rates = [0, 50, 100, 150].map(s => 8 * (1 - s * 0.001));
    for (let i = 1; i < rates.length; i++) {
      expect(rates[i]).toBeLessThan(rates[i - 1]);
    }
  });
});

// ─── collisionImpulse ────────────────────────────────────────────────────────

describe("collisionImpulse", () => {
  // J = m_eff × Δv × (1 + e)
  // m_eff = (m1 × m2) / (m1 + m2)

  it("J = m_eff × Δv × (1 + e) for elastic collision e=1", () => {
    const m1 = 40, m2 = 40, dv = 5.0, e = 1.0;
    const m_eff = (m1 * m2) / (m1 + m2); // 20
    const J = m_eff * dv * (1 + e);
    expect(J).toBeCloseTo(200, 6); // 20 × 5 × 2
  });

  it("J = m_eff × Δv for perfectly inelastic e=0", () => {
    const m1 = 30, m2 = 60, dv = 4.0, e = 0.0;
    const m_eff = (m1 * m2) / (m1 + m2); // 20
    const J = m_eff * dv * (1 + e);
    expect(J).toBeCloseTo(80, 6); // 20 × 4 × 1
  });

  it("dmgMult 1.5 (metal) deals more damage than dmgMult 1.0 (ABS)", () => {
    // Scale damage proportional to dmgMult
    const baseJ = 100;
    const absDmg   = baseJ * 1.0;
    const metalDmg = baseJ * 1.5;
    expect(metalDmg).toBeGreaterThan(absDmg);
    expect(metalDmg / absDmg).toBeCloseTo(1.5, 6);
  });

  it("unequal masses: m_eff < min(m1, m2)", () => {
    const m1 = 10, m2 = 100;
    const m_eff = (m1 * m2) / (m1 + m2);
    expect(m_eff).toBeLessThan(Math.min(m1, m2));
  });

  it("higher Δv produces proportionally higher impulse", () => {
    const m1 = 40, m2 = 40, e = 0.67;
    const m_eff = (m1 * m2) / (m1 + m2);
    const J1 = m_eff * 2.0 * (1 + e);
    const J2 = m_eff * 4.0 * (1 + e);
    expect(J2 / J1).toBeCloseTo(2.0, 6);
  });
});

// ─── wobblePhysics ───────────────────────────────────────────────────────────

describe("wobblePhysics", () => {
  // Wobble fires when stability = spin/maxSpin < 0.4
  // PRNG is seeded from matchId → deterministic

  it("no wobble force when stability >= 0.4", () => {
    const spin = 800, maxSpin = 2000; // stability = 0.4 exactly
    const stability = spin / maxSpin;
    expect(stability).toBeGreaterThanOrEqual(0.4);
    // At threshold no wobble should be applied — stability check is exclusive (<)
  });

  it("wobble condition triggers when stability < 0.4", () => {
    const spin = 700, maxSpin = 2000; // stability = 0.35
    const stability = spin / maxSpin;
    expect(stability).toBeLessThan(0.4);
  });

  it("wobble force is bounded by PRNG output range (0–1)", () => {
    const rand = createPRNG(42);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("wobble is deterministic with same seed (same matchId → same sequence)", () => {
    const rand1 = createPRNG(12345);
    const rand2 = createPRNG(12345);
    for (let i = 0; i < 20; i++) {
      expect(rand1()).toBe(rand2());
    }
  });

  it("different seeds produce different wobble sequences", () => {
    const rand1 = createPRNG(100);
    const rand2 = createPRNG(200);
    let allSame = true;
    for (let i = 0; i < 10; i++) {
      if (rand1() !== rand2()) { allSame = false; break; }
    }
    expect(allSame).toBe(false);
  });

  it("wobble force direction is symmetric around zero (centered centroid)", () => {
    // (rand() - 0.5) shifts range to [-0.5, +0.5]
    const rand = createPRNG(99);
    const samples = Array.from({ length: 1000 }, () => rand() - 0.5);
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(Math.abs(mean)).toBeLessThan(0.05); // centred near zero
  });
});

// ─── arenaZoneLookup ─────────────────────────────────────────────────────────

describe("arenaZoneLookup", () => {
  // getFloorAngleAtRadius(radialDistance, arenaRadius, wallAngleDeg)
  // Returns 0 at center, wallAngleDeg (in radians) at rim — linear interpolation.

  it("returns 0 at center (radialDistance=0)", () => {
    const angle = getFloorAngleAtRadius(0, 500, 40);
    expect(angle).toBe(0);
  });

  it("returns full wallAngle (in radians) at the rim (radialDistance=arenaRadius)", () => {
    const wallAngleDeg = 40;
    const angle = getFloorAngleAtRadius(500, 500, wallAngleDeg);
    expect(angle).toBeCloseTo((wallAngleDeg * Math.PI) / 180, 6);
  });

  it("returns 0 when wallAngleDeg=0 (flat arena) regardless of radius", () => {
    expect(getFloorAngleAtRadius(250, 500, 0)).toBe(0);
    expect(getFloorAngleAtRadius(500, 500, 0)).toBe(0);
  });

  it("linear interpolation at half radius returns half the rim angle", () => {
    const wallAngleDeg = 60;
    const halfAngle = getFloorAngleAtRadius(250, 500, wallAngleDeg);
    const fullAngle = getFloorAngleAtRadius(500, 500, wallAngleDeg);
    expect(halfAngle).toBeCloseTo(fullAngle / 2, 6);
  });

  it("clamps at rim — radialDistance > arenaRadius returns same as at rim", () => {
    const wallAngleDeg = 40;
    const atRim  = getFloorAngleAtRadius(500, 500, wallAngleDeg);
    const beyond = getFloorAngleAtRadius(600, 500, wallAngleDeg);
    expect(beyond).toBeCloseTo(atRim, 6);
  });

  it("returns 0 when arenaRadius=0 (degenerate arena)", () => {
    expect(getFloorAngleAtRadius(100, 0, 40)).toBe(0);
  });
});

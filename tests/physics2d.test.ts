// Tests for PhysicsEngine 2.5D arena features.
// Covers loop, pit, water-body, obstacle collision checks and utility force methods.

import { describe, test, expect, beforeEach } from "vitest";
import { PhysicsEngine } from "../src/physics/PhysicsEngine";
import type { LoopConfig, PitConfig, WaterBodyConfig, ObstacleConfig } from "../src/types/shared";

const ARENA_W = 67; // em  →  67*16 = 1072 px  ≈ 1080p
const ARENA_H = 67;
const CX = (ARENA_W * 16) / 2; // 536
const CY = (ARENA_H * 16) / 2; // 536

const TEST_ARENA: any = {
  id: "test2d",
  name: "2D Test",
  width: ARENA_W,
  height: ARENA_H,
  shape: "circle" as const,
  theme: "metrocity" as const,
  surfaceFriction: 0.01,
  wall: {
    enabled: true, wallStyle: "metal" as const,
    baseDamage: 10, recoilDistance: 5,
    hasSpikes: false, spikeDamageMultiplier: 1.0,
    thickness: 3, edges: [],
  },
};

let engine: PhysicsEngine;
beforeEach(() => {
  engine = new PhysicsEngine();
  engine.setArenaConfig(TEST_ARENA);
});

// ─── checkLoopCollision ───────────────────────────────────────────────────────

describe("PhysicsEngine — checkLoopCollision", () => {
  const loops: LoopConfig[] = [
    { radius: 20, speedBoost: 1.5, spinBoost: 200, activationWidth: 15, color: "#00ff00" },
  ];

  test("returns inLoop=false with no arenaConfig", () => {
    const bare = new PhysicsEngine(); // no setArenaConfig
    bare.createBeyblade("b", CX, CY, 4, 50);
    const r = bare.checkLoopCollision("b", loops);
    expect(r.inLoop).toBe(false);
  });

  test("returns inLoop=false for unknown beyblade id", () => {
    const r = engine.checkLoopCollision("ghost", loops);
    expect(r.inLoop).toBe(false);
  });

  test("detects beyblade inside loop band", () => {
    // Loop radius 20 em → 320 px from center; tolerance ±20 px
    const loopPx = 20 * 16; // 320
    engine.createBeyblade("b", CX + loopPx, CY, 4, 50);
    const r = engine.checkLoopCollision("b", loops);
    expect(r.inLoop).toBe(true);
    expect(r.loopIndex).toBe(0);
    expect(r.loopConfig).toBeTruthy();
  });

  test("does NOT detect beyblade far from loop band", () => {
    // Place at center — 320 px away from loop
    engine.createBeyblade("b", CX, CY, 4, 50);
    const r = engine.checkLoopCollision("b", loops);
    expect(r.inLoop).toBe(false);
    expect(r.loopIndex).toBe(-1);
  });

  test("returns correct loopIndex when multiple loops exist", () => {
    const multiLoops: LoopConfig[] = [
      { radius: 10, speedBoost: 1.2, spinBoost: 100, activationWidth: 10, color: "#ff0000" },
      { radius: 25, speedBoost: 1.8, spinBoost: 300, activationWidth: 10, color: "#0000ff" },
    ];
    // Place at second loop: 25*16=400 px from center
    engine.createBeyblade("b", CX + 400, CY, 4, 50);
    const r = engine.checkLoopCollision("b", multiLoops);
    expect(r.inLoop).toBe(true);
    expect(r.loopIndex).toBe(1);
  });

  test("returns inLoop=false when loop array is empty", () => {
    engine.createBeyblade("b", CX + 200, CY, 4, 50);
    expect(engine.checkLoopCollision("b", []).inLoop).toBe(false);
  });
});

// ─── checkPitCollision ────────────────────────────────────────────────────────

describe("PhysicsEngine — checkPitCollision", () => {
  const makePit = (x: number, y: number, radius = 3): PitConfig => ({
    x, y, radius,
    damageRate: 50,
    escapeSpinThreshold: 0.5,
    escapeChance: 0.05,
  });

  test("returns null when beyblade is outside all pits", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    const pits = [makePit(10, 10)]; // far corner in em coords
    expect(engine.checkPitCollision("b", pits)).toBeNull();
  });

  test("returns pit config when beyblade is inside a pit", () => {
    // Pit at em coords (33, 33) → pixel (528, 528) — near center
    const pit = makePit(33, 33, 5); // radius 5 em → 80 px
    engine.createBeyblade("b", 33 * 16, 33 * 16, 4, 50);
    const result = engine.checkPitCollision("b", [pit]);
    expect(result).not.toBeNull();
    expect(result!.damageRate).toBe(50);
  });

  test("returns null for unknown beyblade id", () => {
    const pit = makePit(33, 33, 5);
    expect(engine.checkPitCollision("ghost", [pit])).toBeNull();
  });

  test("returns the correct pit when multiple pits exist", () => {
    const pit1 = makePit(5, 5, 3);
    const pit2 = makePit(33, 33, 5);
    engine.createBeyblade("b", 33 * 16, 33 * 16, 4, 50);
    const result = engine.checkPitCollision("b", [pit1, pit2]);
    expect(result).toBe(pit2);
  });

  test("returns null when pits array is empty", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    expect(engine.checkPitCollision("b", [])).toBeNull();
  });
});

// ─── checkWaterCollision ──────────────────────────────────────────────────────

describe("PhysicsEngine — checkWaterCollision", () => {
  test("returns false when waterBody is undefined", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    expect(engine.checkWaterCollision("b", undefined)).toBe(false);
  });

  test("returns false for unknown beyblade id", () => {
    const wb: WaterBodyConfig = { type: "moat", distanceFromArena: 10, thickness: 5, spinDrainPerSecond: 50, speedLoss: 0.8, color: "#0000ff" };
    expect(engine.checkWaterCollision("ghost", wb)).toBe(false);
  });

  describe("moat type", () => {
    const moat: WaterBodyConfig = {
      type: "moat",
      distanceFromArena: 15, // inner radius 15 em → 240 px
      thickness: 5,          // outer radius 20 em → 320 px
      spinDrainPerSecond: 40,
      speedLoss: 0.7,
      color: "#0044ff",
    };

    test("detects beyblade inside moat band", () => {
      // 17 em from center → 272 px — inside [240, 320]
      engine.createBeyblade("b", CX + 17 * 16, CY, 4, 50);
      expect(engine.checkWaterCollision("b", moat)).toBe(true);
    });

    test("does NOT detect beyblade inside moat inner radius", () => {
      // 10 em → 160 px — inside inner edge
      engine.createBeyblade("b", CX + 10 * 16, CY, 4, 50);
      expect(engine.checkWaterCollision("b", moat)).toBe(false);
    });

    test("does NOT detect beyblade beyond moat outer radius", () => {
      // 25 em → 400 px — outside outer edge
      engine.createBeyblade("b", CX + 25 * 16, CY, 4, 50);
      expect(engine.checkWaterCollision("b", moat)).toBe(false);
    });
  });

  describe("zone type", () => {
    const zone: WaterBodyConfig = {
      type: "zone",
      position: { x: 0, y: 0 }, // at arena center in relative coords
      radius: 8,                  // 8 em → 128 px
      spinDrainPerSecond: 60,
      speedLoss: 0.6,
      color: "#0066ff",
    };

    test("detects beyblade inside water zone", () => {
      engine.createBeyblade("b", CX + 3 * 16, CY, 4, 50); // 48 px from zone center
      expect(engine.checkWaterCollision("b", zone)).toBe(true);
    });

    test("does NOT detect beyblade outside water zone", () => {
      engine.createBeyblade("b", CX + 12 * 16, CY, 4, 50); // 192 px — outside 128 px radius
      expect(engine.checkWaterCollision("b", zone)).toBe(false);
    });
  });

  test("wall-based type always returns false", () => {
    const wb: WaterBodyConfig = { type: "wall-based", spinDrainPerSecond: 30, speedLoss: 0.5, color: "#fff" };
    engine.createBeyblade("b", CX, CY, 4, 50);
    expect(engine.checkWaterCollision("b", wb)).toBe(false);
  });
});

// ─── checkObstacleCollision ───────────────────────────────────────────────────

describe("PhysicsEngine — checkObstacleCollision", () => {
  test("returns colliding=false when no obstacles registered", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    const r = engine.checkObstacleCollision("b");
    expect(r.colliding).toBe(false);
    expect(r.obstacleId).toBeNull();
    expect(r.damage).toBe(0);
  });

  test("returns colliding=false for unknown beyblade id", () => {
    const obstacles: ObstacleConfig[] = [{ x: 33, y: 33, radius: 2, material: "metal", damage: 10 }];
    engine.createObstacles(obstacles);
    const r = engine.checkObstacleCollision("ghost");
    expect(r.colliding).toBe(false);
  });

  test("detects collision when beyblade overlaps an obstacle body", () => {
    // Place obstacle at center and beyblade at exact same position — guaranteed overlap
    const obstacles: ObstacleConfig[] = [{ x: 33, y: 33, radius: 3, material: "metal", damage: 10 }];
    engine.createObstacles(obstacles);
    const obstaclePx = { x: 33 * 16, y: 33 * 16 };
    engine.createBeyblade("b", obstaclePx.x, obstaclePx.y, 2, 50);
    const r = engine.checkObstacleCollision("b");
    expect(r.colliding).toBe(true);
    expect(r.obstacleId).toBe("obstacle_0");
  });
});

// ─── applyLoopBoost ───────────────────────────────────────────────────────────

describe("PhysicsEngine — applyLoopBoost", () => {
  test("multiplies beyblade velocity by the speedBoost factor", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    engine.applyForce("b", 0.1, 0);
    engine.update(16);

    const before = engine.getBodyState("b")!;
    engine.applyLoopBoost("b", 2.0);
    engine.update(1); // minimal step to read velocity
    const after = engine.getBodyState("b")!;

    // Speed should be roughly doubled (within floating-point tolerance)
    expect(Math.abs(after.velocityX)).toBeGreaterThan(Math.abs(before.velocityX) * 1.5);
  });

  test("no-ops for unknown beyblade id", () => {
    expect(() => engine.applyLoopBoost("ghost", 2.0)).not.toThrow();
  });
});

// ─── applyWaterResistance ─────────────────────────────────────────────────────

describe("PhysicsEngine — applyWaterResistance", () => {
  test("slows beyblade velocity by the speedMultiplier", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    engine.applyForce("b", 0.1, 0);
    engine.update(16);

    const before = engine.getBodyState("b")!;
    engine.applyWaterResistance("b", 0.5); // half speed
    engine.update(1);
    const after = engine.getBodyState("b")!;

    expect(Math.abs(after.velocityX)).toBeLessThan(Math.abs(before.velocityX));
  });

  test("no-ops for unknown beyblade id", () => {
    expect(() => engine.applyWaterResistance("ghost", 0.5)).not.toThrow();
  });
});

// ─── applyKnockback ───────────────────────────────────────────────────────────

describe("PhysicsEngine — applyKnockback", () => {
  test("moves beyblade in the given direction after update", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    const before = engine.getBodyState("b")!;
    engine.applyKnockback("b", { x: 1, y: 0 }, 200);
    engine.update(16);
    const after = engine.getBodyState("b")!;
    expect(after.x).toBeGreaterThan(before.x);
  });

  test("does nothing for zero-magnitude direction vector", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    expect(() => engine.applyKnockback("b", { x: 0, y: 0 }, 100)).not.toThrow();
  });

  test("no-ops for unknown beyblade id", () => {
    expect(() => engine.applyKnockback("ghost", { x: 1, y: 0 }, 100)).not.toThrow();
  });
});

// ─── applyLateralForce ────────────────────────────────────────────────────────

describe("PhysicsEngine — applyLateralForce", () => {
  test("right-spin beyblade moving right gets upward (perpendicular) dodge", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    engine.applyForce("b", 0.1, 0); // give it rightward velocity
    engine.update(16);

    const before = engine.getBodyState("b")!;
    engine.applyLateralForce("b", "right", 0.5);
    engine.update(16);
    const after = engine.getBodyState("b")!;

    // Lateral force on a rightward-moving right-spin bey → Y velocity should change
    expect(Math.abs(after.velocityY)).toBeGreaterThan(Math.abs(before.velocityY));
  });

  test("left-spin beyblade gets opposite lateral direction", () => {
    engine.createBeyblade("r", CX, CY, 4, 50);
    engine.createBeyblade("l", CX + 200, CY, 4, 50);

    engine.applyForce("r", 0.1, 0);
    engine.applyForce("l", 0.1, 0);
    engine.update(16);

    engine.applyLateralForce("r", "right", 0.5);
    engine.applyLateralForce("l", "left", 0.5);
    engine.update(16);

    const rs = engine.getBodyState("r")!;
    const ls = engine.getBodyState("l")!;
    // Opposite lateral directions → opposite Y velocity signs
    expect(Math.sign(rs.velocityY)).not.toBe(Math.sign(ls.velocityY));
  });
});

// ─── isOutOfBounds ────────────────────────────────────────────────────────────

describe("PhysicsEngine — isOutOfBounds", () => {
  const RADIUS = 400;

  test("returns false when beyblade is inside arena radius", () => {
    engine.createBeyblade("b", CX + 100, CY, 4, 50);
    expect(engine.isOutOfBounds("b", RADIUS, CX, CY)).toBe(false);
  });

  test("returns true when beyblade is outside arena radius", () => {
    engine.createBeyblade("b", CX + 500, CY, 4, 50);
    expect(engine.isOutOfBounds("b", RADIUS, CX, CY)).toBe(true);
  });

  test("returns false for unknown beyblade id", () => {
    expect(engine.isOutOfBounds("ghost", RADIUS, CX, CY)).toBe(false);
  });
});

// ─── removeBeyblade ───────────────────────────────────────────────────────────

describe("PhysicsEngine — removeBeyblade", () => {
  test("getBodyState returns null after removal", () => {
    engine.createBeyblade("b", CX, CY, 4, 50);
    expect(engine.getBodyState("b")).not.toBeNull();
    engine.removeBeyblade("b");
    expect(engine.getBodyState("b")).toBeNull();
  });

  test("no-ops gracefully for unknown beyblade id", () => {
    expect(() => engine.removeBeyblade("ghost")).not.toThrow();
  });

  test("removed beyblade is absent from getAllBeybladeIds", () => {
    engine.createBeyblade("b1", CX, CY, 4, 50);
    engine.createBeyblade("b2", CX + 100, CY, 4, 50);
    engine.removeBeyblade("b1");
    expect(engine.getAllBeybladeIds()).not.toContain("b1");
    expect(engine.getAllBeybladeIds()).toContain("b2");
  });
});

// ─── destroy ─────────────────────────────────────────────────────────────────

describe("PhysicsEngine — destroy", () => {
  test("clears all bodies after destroy", () => {
    engine.createBeyblade("b1", CX, CY, 4, 50);
    engine.createBeyblade("b2", CX + 100, CY, 4, 50);
    engine.destroy();
    expect(engine.getBodyState("b1")).toBeNull();
    expect(engine.getBodyState("b2")).toBeNull();
    expect(engine.getAllBeybladeIds()).toHaveLength(0);
  });
});

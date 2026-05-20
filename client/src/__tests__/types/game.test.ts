// FILE 1: src/__tests__/types/game.test.ts
// Tests for pure functions and constants from src/types/game.ts

import { getBeybladeStability, TYPE_COLORS } from "@/types/game";
import type { ServerBeyblade } from "@/types/game";

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeBeyblade(overrides: Partial<ServerBeyblade> = {}): ServerBeyblade {
  return {
    id: "bey-1",
    userId: "user-1",
    username: "Tester",
    x: 0,
    y: 0,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    angularVelocity: 0,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    spin: 1000,
    maxSpin: 2000,
    isActive: true,
    isAI: false,
    type: "balanced",
    radius: 5,
    actualSize: 120,
    isInvulnerable: false,
    damageDealt: 0,
    damageReceived: 0,
    collisions: 0,
    spinDirection: "right",
    power: 0,
    isAirborne: false,
    airborneTimer: 0,
    isDefending: false,
    attackBuffTimer: 0,
    dodgeBuffTimer: 0,
    stunTimer: 0,
    comboExecuting: false,
    ...overrides,
  };
}

// ─── getBeybladeStability ─────────────────────────────────────────────────────

describe("getBeybladeStability", () => {
  it("returns 0 when maxSpin is 0 (division guard)", () => {
    const bey = makeBeyblade({ spin: 500, maxSpin: 0 });
    expect(getBeybladeStability(bey)).toBe(0);
  });

  it("returns 0 when maxSpin is negative", () => {
    const bey = makeBeyblade({ spin: 100, maxSpin: -1 });
    expect(getBeybladeStability(bey)).toBe(0);
  });

  it("returns 0 when spin is 0", () => {
    const bey = makeBeyblade({ spin: 0, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBe(0);
  });

  it("returns the exact ratio when spin < maxSpin", () => {
    const bey = makeBeyblade({ spin: 1000, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBeCloseTo(0.5);
  });

  it("returns 0.25 when spin is 25% of maxSpin", () => {
    const bey = makeBeyblade({ spin: 500, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBeCloseTo(0.25);
  });

  it("returns exactly 1 when spin equals maxSpin", () => {
    const bey = makeBeyblade({ spin: 2000, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBe(1);
  });

  it("clamps to 1 when spin exceeds maxSpin", () => {
    const bey = makeBeyblade({ spin: 3000, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBe(1);
  });

  it("returns near-zero for very low spin relative to maxSpin", () => {
    const bey = makeBeyblade({ spin: 1, maxSpin: 10000 });
    expect(getBeybladeStability(bey)).toBeCloseTo(0.0001);
  });

  it("works correctly for the 40% stability threshold used in nutation logic", () => {
    const bey = makeBeyblade({ spin: 800, maxSpin: 2000 });
    expect(getBeybladeStability(bey)).toBeCloseTo(0.4);
    // At exactly 40% — stability < 0.4 is false, so no nutation
    expect(getBeybladeStability(bey) >= 0.4).toBe(true);
  });
});

// ─── TYPE_COLORS ──────────────────────────────────────────────────────────────

describe("TYPE_COLORS", () => {
  it("attack maps to red hex 0xff4444", () => {
    expect(TYPE_COLORS.attack).toBe(0xff4444);
  });

  it("defense maps to blue hex 0x4488ff", () => {
    expect(TYPE_COLORS.defense).toBe(0x4488ff);
  });

  it("stamina maps to green hex 0x44ff88", () => {
    expect(TYPE_COLORS.stamina).toBe(0x44ff88);
  });

  it("balanced maps to yellow hex 0xffcc44", () => {
    expect(TYPE_COLORS.balanced).toBe(0xffcc44);
  });

  it("contains exactly the four beyblade type keys", () => {
    const keys = Object.keys(TYPE_COLORS).sort();
    expect(keys).toEqual(["attack", "balanced", "defense", "stamina"]);
  });

  it("all values are valid 24-bit hex numbers (0x000000 – 0xffffff)", () => {
    for (const val of Object.values(TYPE_COLORS)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(0xffffff);
    }
  });
});

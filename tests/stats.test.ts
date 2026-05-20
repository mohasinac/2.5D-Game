// Unit tests for beyblade stat formula calculations.
// These are pure functions — no Colyseus, no Firebase, no Matter.js.

import { describe, test, expect } from "vitest";
import {
  calculateStats,
  validateTypeDistribution,
  calculateTypeBonuses,
  type TypeDistribution,
} from "../types/beybladeStats";

// ─── validateTypeDistribution ────────────────────────────────────────────────

describe("validateTypeDistribution", () => {
  test("accepts a valid 360-point distribution", () => {
    expect(validateTypeDistribution({ attack: 120, defense: 120, stamina: 120, total: 360 })).toBe(true);
  });

  test("rejects distribution that does not sum to 360", () => {
    expect(validateTypeDistribution({ attack: 100, defense: 100, stamina: 100, total: 300 })).toBe(false);
  });

  test("rejects when total field is wrong but points sum correctly", () => {
    expect(validateTypeDistribution({ attack: 120, defense: 120, stamina: 120, total: 300 })).toBe(false);
  });

  test("rejects attack > 150", () => {
    expect(validateTypeDistribution({ attack: 160, defense: 100, stamina: 100, total: 360 })).toBe(false);
  });

  test("rejects defense > 150", () => {
    expect(validateTypeDistribution({ attack: 100, defense: 160, stamina: 100, total: 360 })).toBe(false);
  });

  test("rejects stamina > 150", () => {
    expect(validateTypeDistribution({ attack: 100, defense: 100, stamina: 160, total: 360 })).toBe(false);
  });

  test("rejects negative values", () => {
    expect(validateTypeDistribution({ attack: -10, defense: 200, stamina: 170, total: 360 })).toBe(false);
  });

  test("accepts max-attack distribution (150/60/150)", () => {
    expect(validateTypeDistribution({ attack: 150, defense: 60, stamina: 150, total: 360 })).toBe(true);
  });

  test("accepts max-defense distribution (60/150/150)", () => {
    expect(validateTypeDistribution({ attack: 60, defense: 150, stamina: 150, total: 360 })).toBe(true);
  });
});

// ─── calculateStats ──────────────────────────────────────────────────────────

describe("calculateStats — attack scaling", () => {
  test("base attack (0 pts): damageMultiplier = 1.0x, speed = 10", () => {
    const stats = calculateStats({ attack: 0, defense: 180, stamina: 180, total: 360 });
    expect(stats.damageMultiplier).toBeCloseTo(1.0);
    expect(stats.speedPerSecond).toBeCloseTo(10.0);
    expect(stats.rotationSpeed).toBeCloseTo(10.0);
  });

  test("max attack (150 pts): damageMultiplier ≈ 2.5x, speed = 25", () => {
    const stats = calculateStats({ attack: 150, defense: 60, stamina: 150, total: 360 });
    expect(stats.damageMultiplier).toBeCloseTo(2.5);
    expect(stats.speedPerSecond).toBeCloseTo(25.0);
    expect(stats.rotationSpeed).toBeCloseTo(25.0);
  });

  test("mid attack (100 pts): damageMultiplier = 2.0x", () => {
    const stats = calculateStats({ attack: 100, defense: 80, stamina: 180, total: 360 });
    expect(stats.damageMultiplier).toBeCloseTo(2.0);
  });

  test("damagePerHit scales with damageMultiplier from base 100", () => {
    const stats = calculateStats({ attack: 150, defense: 60, stamina: 150, total: 360 });
    expect(stats.damagePerHit).toBeCloseTo(stats.damageMultiplier * 100);
  });
});

describe("calculateStats — defense scaling", () => {
  test("base defense (0 pts): damageTaken = 1.0x, knockback = 10", () => {
    const stats = calculateStats({ attack: 180, defense: 0, stamina: 180, total: 360 });
    expect(stats.damageTaken).toBeCloseTo(1.0);
    expect(stats.knockbackDistance).toBeCloseTo(10.0);
    expect(stats.invulnerabilityChance).toBeCloseTo(10.0);
  });

  test("max defense (150 pts): damageTaken ≈ 0.5x, knockback ≈ 7.5", () => {
    const stats = calculateStats({ attack: 60, defense: 150, stamina: 150, total: 360 });
    expect(stats.damageTaken).toBeCloseTo(0.5, 1);
    expect(stats.knockbackDistance).toBeCloseTo(7.5, 1);
    expect(stats.invulnerabilityChance).toBeCloseTo(20.0, 1);
  });

  test("damageTaken never goes below near-zero", () => {
    // Even if defense somehow exceeded 150, clamp should hold
    const stats = calculateStats({ attack: 60, defense: 150, stamina: 150, total: 360 });
    expect(stats.damageTaken).toBeGreaterThan(0);
  });

  test("damageReduction is inverse of damageTaken", () => {
    const stats = calculateStats({ attack: 60, defense: 150, stamina: 150, total: 360 });
    expect(stats.damageReduction).toBeCloseTo(1 / stats.damageTaken, 4);
  });
});

describe("calculateStats — stamina scaling", () => {
  test("base stamina (0 pts): maxStamina = 1000, spinSteal = 10%, decay = 10/s", () => {
    const stats = calculateStats({ attack: 180, defense: 180, stamina: 0, total: 360 });
    expect(stats.maxStamina).toBe(1000);
    expect(stats.spinStealPercent).toBeCloseTo(10.0);
    expect(stats.spinDecayRate).toBeCloseTo(10.0);
  });

  test("max stamina (150 pts): maxStamina = 3000, spinSteal ≈ 50%, decay ≈ 7.5/s", () => {
    const stats = calculateStats({ attack: 60, defense: 150, stamina: 150, total: 360 });
    expect(stats.maxStamina).toBe(3000);
    expect(stats.spinStealPercent).toBeCloseTo(50.0, 1);
    expect(stats.spinDecayRate).toBeCloseTo(7.5, 1);
  });

  test("maxStamina is always a whole number (Math.ceil)", () => {
    const stats = calculateStats({ attack: 120, defense: 120, stamina: 120, total: 360 });
    expect(Number.isInteger(stats.maxStamina)).toBe(true);
  });

  test("spinDecayRate never goes below 0.5 (floor clamp)", () => {
    const stats = calculateStats({ attack: 60, defense: 150, stamina: 150, total: 360 });
    expect(stats.spinDecayRate).toBeGreaterThanOrEqual(0.5);
  });
});

describe("calculateStats — balanced distribution (120/120/120)", () => {
  const balanced: TypeDistribution = { attack: 120, defense: 120, stamina: 120, total: 360 };

  test("produces mid-range values across all stat categories", () => {
    const stats = calculateStats(balanced);
    expect(stats.damageMultiplier).toBeGreaterThan(1.0);
    expect(stats.damageMultiplier).toBeLessThan(2.5);
    expect(stats.damageTaken).toBeGreaterThan(0.5);
    expect(stats.damageTaken).toBeLessThan(1.0);
    expect(stats.maxStamina).toBeGreaterThan(1000);
    expect(stats.maxStamina).toBeLessThan(3000);
  });

  test("legacy compatibility fields are set", () => {
    const stats = calculateStats(balanced);
    expect(stats.attackPower).toBe(120 + 100);
    expect(stats.defensePower).toBe(120 + 100);
    expect(stats.staminaPower).toBe(120 + 100);
    expect(stats.speedMultiplier).toBe(stats.attackPower);
    expect(stats.knockbackResistance).toBe(stats.defensePower);
    expect(stats.spinStealPower).toBe(stats.staminaPower);
  });
});

// ─── calculateTypeBonuses ────────────────────────────────────────────────────

describe("calculateTypeBonuses", () => {
  test("attack type: attackMultiplier = 1.2, maxStamina = 2500", () => {
    const b = calculateTypeBonuses("attack");
    expect(b.attackMultiplier).toBe(1.2);
    expect(b.defenseMultiplier).toBe(1.0);
    expect(b.maxStamina).toBe(2500);
  });

  test("defense type: defenseMultiplier = 0.8, maxStamina = 2500", () => {
    const b = calculateTypeBonuses("defense");
    expect(b.attackMultiplier).toBe(1.0);
    expect(b.defenseMultiplier).toBe(0.8);
    expect(b.maxStamina).toBe(2500);
  });

  test("stamina type: maxStamina = 3000, no attack/defense bonus", () => {
    const b = calculateTypeBonuses("stamina");
    expect(b.attackMultiplier).toBe(1.0);
    expect(b.defenseMultiplier).toBe(1.0);
    expect(b.maxStamina).toBe(3000);
  });

  test("balanced type: all 1.0x, maxStamina = 2500", () => {
    const b = calculateTypeBonuses("balanced");
    expect(b.attackMultiplier).toBe(1.0);
    expect(b.defenseMultiplier).toBe(1.0);
    expect(b.maxStamina).toBe(2500);
  });
});

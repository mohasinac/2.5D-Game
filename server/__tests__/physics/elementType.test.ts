/**
 * Phase AB: Element type effectiveness — computeElementTypeMultiplier unit tests.
 * Verifies dual-type attack/defense math, edge cases, and the 12×12 TYPE_MATRIX.
 */
import { describe, it, expect } from "vitest";
import { computeElementTypeMultiplier } from "../../physics/PartPhysics";

describe("computeElementTypeMultiplier", () => {
  it("returns 1.0 when attacker has no element types", () => {
    expect(computeElementTypeMultiplier([], ["fire"])).toBe(1.0);
  });

  it("returns 1.0 when defender has no element types", () => {
    expect(computeElementTypeMultiplier(["fire"], [])).toBe(1.0);
  });

  it("returns 1.0 when both sides have no element types", () => {
    expect(computeElementTypeMultiplier([], [])).toBe(1.0);
  });

  it("returns 1.0 for unknown attacker type (safe fallback)", () => {
    expect(computeElementTypeMultiplier(["unknown_type"], ["fire"])).toBe(1.0);
  });

  it("returns 1.0 for unknown defender type (safe fallback)", () => {
    expect(computeElementTypeMultiplier(["fire"], ["unknown_type"])).toBe(1.0);
  });

  // Single-type matchups from TYPE_MATRIX
  it("fire vs water = 0.5 (weak)", () => {
    expect(computeElementTypeMultiplier(["fire"], ["water"])).toBeCloseTo(0.5);
  });

  it("fire vs earth = 1.5 (strong)", () => {
    expect(computeElementTypeMultiplier(["fire"], ["earth"])).toBeCloseTo(1.5);
  });

  it("fire vs ice = 2.0 (super effective)", () => {
    expect(computeElementTypeMultiplier(["fire"], ["ice"])).toBeCloseTo(2.0);
  });

  it("water vs fire = 2.0 (super effective)", () => {
    expect(computeElementTypeMultiplier(["water"], ["fire"])).toBeCloseTo(2.0);
  });

  it("shadow vs light = 0.5 (shadow is weak to light); light vs shadow = 2.0", () => {
    expect(computeElementTypeMultiplier(["shadow"], ["light"])).toBeCloseTo(0.5);
    expect(computeElementTypeMultiplier(["light"], ["shadow"])).toBeCloseTo(2.0);
  });

  it("void vs shadow = 0.5 (void is weak to shadow); shadow vs void = 2.0", () => {
    expect(computeElementTypeMultiplier(["void"], ["shadow"])).toBeCloseTo(0.5);
    expect(computeElementTypeMultiplier(["shadow"], ["void"])).toBeCloseTo(2.0);
  });

  // Dual-type attacker: picks BEST matchup against each defender element
  it("dual attacker [fire, lightning] vs single defender [water] picks best (2.0)", () => {
    // fire→water = 0.5 (weak); lightning→water = 2.0; max = 2.0
    expect(computeElementTypeMultiplier(["fire", "lightning"], ["water"])).toBeCloseTo(2.0);
  });

  it("dual attacker [fire, lightning] vs single defender [earth] picks best (1.5)", () => {
    // fire→earth = 1.5, lightning→earth = 0.5; max = 1.5
    expect(computeElementTypeMultiplier(["fire", "lightning"], ["earth"])).toBeCloseTo(1.5);
  });

  // Dual-type defender: MULTIPLIES per-defender matchup values
  it("single attacker [fire] vs dual defender [water, earth] = 0.5 × 1.5 = 0.75", () => {
    // fire→water = 0.5; fire→earth = 1.5; product = 0.75
    expect(computeElementTypeMultiplier(["fire"], ["water", "earth"])).toBeCloseTo(0.75);
  });

  it("dual attacker [fire, lightning] vs dual defender [water, earth] = 2.0 × 1.5 = 3.0", () => {
    // [fire,lightning]→water: max(0.5, 2.0) = 2.0
    // [fire,lightning]→earth: max(1.5, 0.5) = 1.5
    // product = 3.0
    expect(computeElementTypeMultiplier(["fire", "lightning"], ["water", "earth"])).toBeCloseTo(3.0);
  });

  it("neutral matchup same type fire vs fire = 1.0", () => {
    expect(computeElementTypeMultiplier(["fire"], ["fire"])).toBeCloseTo(1.0);
  });

  it("all 12 element types are valid keys (no unknowns in matrix)", () => {
    const types = ["fire","water","earth","lightning","wind","ice","shadow","light","metal","nature","thunder","void"];
    for (const atk of types) {
      for (const def of types) {
        const mult = computeElementTypeMultiplier([atk], [def]);
        expect(mult).toBeGreaterThan(0);
        expect(isFinite(mult)).toBe(true);
      }
    }
  });
});

// Tests for the universal StatModifier application (Phase 12 — locks in the
// existing PartPhysics behavior so future refactors don't silently break gimmicks).

import { describe, it, expect } from "vitest";
import {
  applyStatModifier, dispatchStatModifierEvent,
  computeSpinSteal, computeContactDamage, getClashType, getClashBlend,
  CLASH_MULTIPLIERS,
} from "../../physics/PartPhysics";
import type { Beyblade } from "../../rooms/schema/GameState";
import type { StatModifier } from "../../../client/src/types/beybladeSystem";

function makeBey(over: Partial<Beyblade> = {}): Beyblade {
  // Plain object cast to Beyblade — applyStatModifier only reads/writes numbers.
  const b: any = {
    id: "b1", spin: 1000, maxSpin: 2000,
    damageMultiplier: 1.0, damageReduction: 1.0,
    recoilFactor: 0.5, spinStealResist: 1.0, surfaceFriction: 1.0,
    contactDamageMultiplier: 1.0, aggressiveness: 0.5,
    ...over,
  };
  return b as Beyblade;
}

describe("applyStatModifier", () => {
  it("add operation increments the target stat", () => {
    const b = makeBey();
    const mod: StatModifier = { targetStat: "spin", operation: "add", value: 500 };
    applyStatModifier(b, mod);
    expect(b.spin).toBe(1500);
  });

  it("multiply operation scales the target stat", () => {
    const b = makeBey();
    const mod: StatModifier = { targetStat: "damageMultiplier", operation: "multiply", value: 1.3 };
    applyStatModifier(b, mod);
    expect(b.damageMultiplier).toBeCloseTo(1.3, 6);
  });

  it("set operation overwrites the target stat", () => {
    const b = makeBey();
    const mod: StatModifier = { targetStat: "surfaceFriction", operation: "set", value: 0.5 };
    applyStatModifier(b, mod);
    expect(b.surfaceFriction).toBe(0.5);
  });

  it("caps spin to maxSpin", () => {
    const b = makeBey({ spin: 1800, maxSpin: 2000 } as any);
    applyStatModifier(b, { targetStat: "spin", operation: "add", value: 1000 });
    expect(b.spin).toBe(2000);
  });

  it("ignores invalid stat keys", () => {
    const b = makeBey();
    applyStatModifier(b, { targetStat: "nonexistent" as any, operation: "set", value: 999 });
    expect((b as any).nonexistent).toBeUndefined();
  });
});

describe("dispatchStatModifierEvent", () => {
  it("applies all modifiers matching the event", () => {
    const b = makeBey();
    const parts = [
      { statModifiers: [
        { targetStat: "spin",                operation: "add",      value: 100, event: "on_hit_opponent" },
        { targetStat: "damageMultiplier",    operation: "multiply", value: 1.2, event: "on_hit_opponent" },
        { targetStat: "spin",                operation: "add",      value: 500, event: "on_land" },
      ] satisfies StatModifier[] },
    ];
    dispatchStatModifierEvent(b, "on_hit_opponent", parts);
    expect(b.spin).toBe(1100);
    expect(b.damageMultiplier).toBeCloseTo(1.2, 6);
  });

  it("ignores modifiers with a different event", () => {
    const b = makeBey();
    const parts = [
      { statModifiers: [
        { targetStat: "spin", operation: "add", value: 100, event: "on_land" },
      ] satisfies StatModifier[] },
    ];
    dispatchStatModifierEvent(b, "on_hit_opponent", parts);
    expect(b.spin).toBe(1000);
  });
});

// ─── O9: Clash Type & Spin Steal ─────────────────────────────────────────────

describe("getClashType", () => {
  it("same spin direction → same_spin", () => {
    expect(getClashType("left", "left")).toBe("same_spin");
    expect(getClashType("right", "right")).toBe("same_spin");
  });

  it("opposite spin directions → counter_spin", () => {
    expect(getClashType("left", "right")).toBe("counter_spin");
    expect(getClashType("right", "left")).toBe("counter_spin");
  });
});

describe("getClashBlend", () => {
  it("head-on (0°) → blend 0 (full clash)", () => {
    expect(getClashBlend(0)).toBe(0);
  });

  it("45° → blend 1 (fully glancing)", () => {
    expect(getClashBlend(45)).toBe(1);
  });

  it("clamps blend at 1 past 45°", () => {
    expect(getClashBlend(90)).toBe(1);
  });

  it("22.5° → blend 0.5", () => {
    expect(getClashBlend(22.5)).toBeCloseTo(0.5, 5);
  });
});

describe("computeSpinSteal", () => {
  it("baseline: 1.0 factor, 1.0 resist, 1.0 bearing, neutral → raw steal unchanged", () => {
    expect(computeSpinSteal(100, 1.0, 1.0, 1.0, "neutral")).toBeCloseTo(100, 5);
  });

  it("counter_spin boosts steal by CLASH_MULTIPLIERS factor", () => {
    const mult = CLASH_MULTIPLIERS.counter_spin.spinSteal;
    expect(computeSpinSteal(100, 1.0, 1.0, 1.0, "counter_spin")).toBeCloseTo(100 * mult, 5);
  });

  it("same_spin reduces steal", () => {
    const mult = CLASH_MULTIPLIERS.same_spin.spinSteal;
    expect(computeSpinSteal(100, 1.0, 1.0, 1.0, "same_spin")).toBeCloseTo(100 * mult, 5);
  });

  it("high spinStealResist reduces the steal", () => {
    // resist=2 means attacker gets half the steal
    expect(computeSpinSteal(100, 1.0, 1.0, 2.0, "neutral")).toBeCloseTo(50, 5);
  });

  it("high attackerSpinStealFactor increases steal", () => {
    expect(computeSpinSteal(100, 2.0, 1.0, 1.0, "neutral")).toBeCloseTo(200, 5);
  });

  it("low bearing friction reduces steal", () => {
    // B:D bearing friction ~0.02
    expect(computeSpinSteal(100, 1.0, 0.02, 1.0, "neutral")).toBeCloseTo(2, 5);
  });

  it("resist near 0 clamps to max 0.01 divisor (no division by zero)", () => {
    const result = computeSpinSteal(100, 1.0, 1.0, 0, "neutral");
    // 0 resist should clamp to 0.01 → steal * 1/0.01 = steal * 100
    expect(result).toBeCloseTo(10000, 5);
  });
});

describe("computeContactDamage", () => {
  it("same direction head-on → 0.8× damage (same_spin dampened)", () => {
    expect(computeContactDamage(100, "left", "left", 0)).toBeCloseTo(80, 5);
  });

  it("opposite direction head-on → 1.4× damage (counter_spin boosted)", () => {
    expect(computeContactDamage(100, "left", "right", 0)).toBeCloseTo(140, 5);
  });

  it("glancing (45°) → neutral 1.0× damage regardless of spin match", () => {
    expect(computeContactDamage(100, "left", "left", 45)).toBeCloseTo(100, 5);
    expect(computeContactDamage(100, "left", "right", 45)).toBeCloseTo(100, 5);
  });

  it("22.5° same-spin → midpoint between 0.8 and 1.0 = 0.9", () => {
    // blend=0.5 at 22.5°; damage = 0.8 + 0.5*(1.0-0.8) = 0.9
    expect(computeContactDamage(100, "left", "left", 22.5)).toBeCloseTo(90, 5);
  });

  it("22.5° counter-spin → midpoint between 1.4 and 1.0 = 1.2", () => {
    // blend=0.5; damage = 1.4 + 0.5*(1.0-1.4) = 1.2
    expect(computeContactDamage(100, "left", "right", 22.5)).toBeCloseTo(120, 5);
  });
});

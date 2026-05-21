// Tests for the universal StatModifier application (Phase 12 — locks in the
// existing PartPhysics behavior so future refactors don't silently break gimmicks).

import { describe, it, expect } from "vitest";
import { applyStatModifier, dispatchStatModifierEvent } from "../../physics/PartPhysics";
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

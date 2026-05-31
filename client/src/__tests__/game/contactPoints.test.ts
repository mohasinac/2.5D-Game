import { describe, it, expect } from "vitest";
import {
  resolveCpBounds,
  angleInArc,
  renderRadius,
  groupContactPointsBySet,
  synthesizeRadialCache,
} from "@/types/beybladeSystem";
import type { SystemContactPoint } from "@/types/beybladeSystem";

function makeLegacyCp(overrides: Partial<SystemContactPoint> = {}): SystemContactPoint {
  return {
    angle: 90,
    width: 30,
    radius: 20,
    thickness: 4,
    extends: false,
    extendThreshold: 0.8,
    extendedRadius: 22,
    extendedWidth: 35,
    extendedThickness: 5,
    heightRange: { min: 0, max: 10 },
    material: "rubber",
    attackType: "smash",
    spinBehavior: { rightPin: "smash", leftPin: "upper" },
    damageMultiplier: 1.0,
    partLayer: "ar",
    ...overrides,
  };
}

function makeArcCp(overrides: Partial<SystemContactPoint> = {}): SystemContactPoint {
  return makeLegacyCp({
    arcStart: 75,
    arcEnd: 105,
    radiusInner: 18,
    radiusOuter: 22,
    lineThickness: 6,
    setId: "set-a",
    ...overrides,
  });
}

describe("resolveCpBounds", () => {
  it("normalises legacy CP to arc-segment form", () => {
    const cp = makeLegacyCp({ angle: 90, width: 40, radius: 20, thickness: 6 });
    const r = resolveCpBounds(cp);
    expect(r.arcStart).toBeCloseTo(70);
    expect(r.arcEnd).toBeCloseTo(110);
    expect(r.rInner).toBeCloseTo(17);
    expect(r.rOuter).toBeCloseTo(23);
    expect(r.lineThickness).toBe(6);
  });

  it("normalises new arc-segment CP without modification", () => {
    const cp = makeArcCp({ arcStart: 60, arcEnd: 120, radiusInner: 15, radiusOuter: 25, lineThickness: 8 });
    const r = resolveCpBounds(cp);
    expect(r.arcStart).toBe(60);
    expect(r.arcEnd).toBe(120);
    expect(r.rInner).toBe(15);
    expect(r.rOuter).toBe(25);
    expect(r.lineThickness).toBe(8);
  });

  it("rInner clamps to 0 when legacy radius < thickness/2", () => {
    const cp = makeLegacyCp({ radius: 2, thickness: 10 });
    const r = resolveCpBounds(cp);
    expect(r.rInner).toBe(0);
  });
});

const flatProfile = { a0: 20, harmonics: [] };

describe("renderRadius", () => {
  it("returns base radius when no CPs active", () => {
    const cache = synthesizeRadialCache(flatProfile);
    const r = renderRadius(0, cache, []);
    expect(r).toBeCloseTo(20, 0);
  });

  it("adds legacy CP protrusion at correct angle", () => {
    const cache = synthesizeRadialCache(flatProfile);
    const cp = makeLegacyCp({ angle: 0, width: 10, radius: 20, thickness: 4 });
    const rAtPeak = renderRadius(0, cache, [cp]);
    const rAway = renderRadius(180, cache, [cp]);
    expect(rAtPeak).toBeGreaterThan(rAway);
  });

  it("max-blends overlapping new-shape CPs (does not sum)", () => {
    const cache = synthesizeRadialCache(flatProfile);
    const cp1 = makeArcCp({ arcStart: 80, arcEnd: 100, lineThickness: 4, setId: "a" });
    const cp2 = makeArcCp({ arcStart: 85, arcEnd: 95, lineThickness: 4, setId: "a" });
    const rTwo = renderRadius(90, cache, [cp1, cp2]);
    const rOne = renderRadius(90, cache, [cp1]);
    expect(rTwo).toBeCloseTo(rOne, 2);
  });
});

describe("groupContactPointsBySet", () => {
  it("groups arc CPs by setId", () => {
    const cp1 = makeArcCp({ setId: "set-a" });
    const cp2 = makeArcCp({ setId: "set-b" });
    const cp3 = makeArcCp({ setId: "set-a" });
    const groups = groupContactPointsBySet([cp1, cp2, cp3]);
    expect(groups.get("set-a")).toHaveLength(2);
    expect(groups.get("set-b")).toHaveLength(1);
  });

  it("returns empty map for empty input", () => {
    const groups = groupContactPointsBySet([]);
    expect(groups.size).toBe(0);
  });
});

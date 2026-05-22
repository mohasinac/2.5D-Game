import { describe, it, expect } from "vitest";
import {
  resolveCpBounds,
  angleInArc,
  renderRadius,
  groupContactPointsBySet,
  synthesizeRadialCache,
} from "@/types/beybladeSystem";
import type { SystemContactPoint, FourierRadialProfile } from "@/types/beybladeSystem";

// ─── Minimal CP factory ───────────────────────────────────────────────────────

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

// ─── resolveCpBounds ──────────────────────────────────────────────────────────

describe("resolveCpBounds", () => {
  it("uses arc fields when present", () => {
    const cp = makeArcCp({ arcStart: 60, arcEnd: 120, radiusInner: 15, radiusOuter: 25, lineThickness: 8 });
    const r = resolveCpBounds(cp);
    expect(r.arcStart).toBe(60);
    expect(r.arcEnd).toBe(120);
    expect(r.rInner).toBe(15);
    expect(r.rOuter).toBe(25);
    expect(r.lineThickness).toBe(8);
  });

  it("falls back to legacy fields when arc fields absent", () => {
    const cp = makeLegacyCp({ angle: 90, width: 40, radius: 20, thickness: 6 });
    const r = resolveCpBounds(cp);
    expect(r.arcStart).toBe(70);  // 90 - 40/2
    expect(r.arcEnd).toBe(110);   // 90 + 40/2
    expect(r.rInner).toBe(17);    // 20 - 6/2
    expect(r.rOuter).toBe(23);    // 20 + 6/2
    expect(r.lineThickness).toBe(6); // defaults to thickness
  });

  it("rInner clamps to 0 when radius < thickness/2", () => {
    const cp = makeLegacyCp({ radius: 2, thickness: 10 });
    const r = resolveCpBounds(cp);
    expect(r.rInner).toBe(0); // max(0, 2 - 5)
  });

  it("partial arc override: only arcStart present uses legacy for arcEnd", () => {
    const cp = makeLegacyCp({ angle: 90, width: 30, arcStart: 80 });
    const r = resolveCpBounds(cp);
    expect(r.arcStart).toBe(80);
    expect(r.arcEnd).toBe(105); // 90 + 30/2
  });
});

// ─── angleInArc ──────────────────────────────────────────────────────────────

describe("angleInArc", () => {
  it("returns true for angle inside a simple arc", () => {
    expect(angleInArc(90, 60, 120)).toBe(true);
  });

  it("returns true for angle at exact boundary", () => {
    expect(angleInArc(60, 60, 120)).toBe(true);
    expect(angleInArc(120, 60, 120)).toBe(true);
  });

  it("returns false for angle outside arc", () => {
    expect(angleInArc(30, 60, 120)).toBe(false);
    expect(angleInArc(180, 60, 120)).toBe(false);
  });

  it("handles wrap-around arc (crosses 0°)", () => {
    // Arc from 330° to 30° — should include 0° and 10°, exclude 100°
    expect(angleInArc(0, 330, 30)).toBe(true);
    expect(angleInArc(10, 330, 30)).toBe(true);
    expect(angleInArc(350, 330, 30)).toBe(true);
    expect(angleInArc(100, 330, 30)).toBe(false);
  });

  it("normalises angles outside 0–360", () => {
    expect(angleInArc(450, 60, 120)).toBe(true);   // 450 → 90
    expect(angleInArc(-270, 60, 120)).toBe(true);  // -270 → 90
    expect(angleInArc(-90, 330, 30)).toBe(false);  // -90 → 270, not in 330→30 wrap arc
  });
});

// ─── renderRadius ─────────────────────────────────────────────────────────────

describe("renderRadius", () => {
  const flatCache = Array.from({ length: 360 }, () => 20); // flat circle r=20

  it("returns base radius when no CPs", () => {
    expect(renderRadius(90, flatCache, [])).toBe(20);
  });

  it("legacy CP adds protrusion at center angle", () => {
    const cp = makeLegacyCp({ angle: 90, width: 60, thickness: 10 });
    // At θ=90 (dead center), diff=0, falloff=1 → full thickness added
    expect(renderRadius(90, flatCache, [cp])).toBe(30);
  });

  it("legacy CP tapers to 0 at arc edge", () => {
    const cp = makeLegacyCp({ angle: 90, width: 60, thickness: 10 });
    // At θ=120 (exactly at edge, diff=30=halfWidth), condition is diff>=halfWidth → skip
    expect(renderRadius(120, flatCache, [cp])).toBe(20);
  });

  it("legacy CP partially tapers mid-arc", () => {
    const cp = makeLegacyCp({ angle: 90, width: 60, thickness: 10 });
    // At θ=105 (diff=15, halfWidth=30), falloff = 1 - 15/30 = 0.5 → adds 5
    expect(renderRadius(105, flatCache, [cp])).toBeCloseTo(25);
  });

  it("new-shape CP applies lineThickness at arc midpoint", () => {
    const cp = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 8 });
    // midpoint=90, θ=90: dist=0, falloff=1 → adds 8
    expect(renderRadius(90, flatCache, [cp])).toBe(28);
  });

  it("new-shape CP falls off toward arc edges", () => {
    const cp = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 8 });
    // halfSpan=20, at θ=80 dist=10, falloff=0.5 → adds 4
    expect(renderRadius(80, flatCache, [cp])).toBeCloseTo(24);
  });

  it("new-shape CP adds nothing outside its arc", () => {
    const cp = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 8 });
    expect(renderRadius(45, flatCache, [cp])).toBe(20);
  });

  it("two new-shape CPs at same angle blend via MAX not sum", () => {
    const cpA = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 8 });
    const cpB = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 12 });
    // At center θ=90: both full, max(8,12)=12, not 20
    expect(renderRadius(90, flatCache, [cpA, cpB])).toBe(32);
  });

  it("legacy CP and new-shape CP both contribute independently", () => {
    const legacy = makeLegacyCp({ angle: 90, width: 60, thickness: 5 });
    const arc = makeArcCp({ arcStart: 70, arcEnd: 110, lineThickness: 3 });
    // At θ=90: legacy adds 5, arc adds 3 → total 28
    expect(renderRadius(90, flatCache, [legacy, arc])).toBe(28);
  });

  it("multiple legacy CPs are summed", () => {
    const cp1 = makeLegacyCp({ angle: 90, width: 60, thickness: 5 });
    const cp2 = makeLegacyCp({ angle: 90, width: 60, thickness: 3 });
    // At θ=90: both full → adds 5 + 3 = 8
    expect(renderRadius(90, flatCache, [cp1, cp2])).toBe(28);
  });
});

// ─── groupContactPointsBySet ──────────────────────────────────────────────────

describe("groupContactPointsBySet", () => {
  it("groups CPs by setId", () => {
    const cpA1 = makeArcCp({ setId: "blades" });
    const cpA2 = makeArcCp({ setId: "blades", arcStart: 160, arcEnd: 200 });
    const cpB = makeArcCp({ setId: "bumpers", arcStart: 0, arcEnd: 30 });

    const groups = groupContactPointsBySet([cpA1, cpA2, cpB]);
    expect(groups.size).toBe(2);
    expect(groups.get("blades")).toHaveLength(2);
    expect(groups.get("bumpers")).toHaveLength(1);
  });

  it("puts CPs without setId into _default key", () => {
    const legacy = makeLegacyCp(); // no setId
    const groups = groupContactPointsBySet([legacy]);
    expect(groups.has("_default")).toBe(true);
    expect(groups.get("_default")).toHaveLength(1);
  });

  it("returns empty map for empty input", () => {
    expect(groupContactPointsBySet([])).toEqual(new Map());
  });

  it("mixes keyed and unkeyed CPs correctly", () => {
    const keyed = makeArcCp({ setId: "ring" });
    const unkeyed = makeLegacyCp(); // no setId
    const groups = groupContactPointsBySet([keyed, unkeyed]);
    expect(groups.get("ring")).toHaveLength(1);
    expect(groups.get("_default")).toHaveLength(1);
  });
});

// ─── synthesizeRadialCache ───────────────────────────────────────────────────

describe("synthesizeRadialCache", () => {
  it("produces exactly 360 values", () => {
    const fp: FourierRadialProfile = { a0: 20, harmonics: [] };
    const cache = synthesizeRadialCache(fp);
    expect(cache).toHaveLength(360);
  });

  it("flat circle (no harmonics) returns a0 everywhere", () => {
    const fp: FourierRadialProfile = { a0: 15, harmonics: [] };
    const cache = synthesizeRadialCache(fp);
    cache.forEach((r) => expect(r).toBeCloseTo(15));
  });

  it("n=2 harmonic (oval) produces expected values at 0° and 90°", () => {
    // a0=10, a2=5 → r(0°) = 10 + 5*cos(0) = 15; r(90°) = 10 + 5*cos(π) = 5
    const fp: FourierRadialProfile = { a0: 10, harmonics: [{ n: 2, a: 5, b: 0 }] };
    const cache = synthesizeRadialCache(fp);
    expect(cache[0]).toBeCloseTo(15, 4);
    expect(cache[90]).toBeCloseTo(5, 4);
  });
});

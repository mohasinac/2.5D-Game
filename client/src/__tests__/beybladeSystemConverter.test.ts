import { describe, it, expect } from "vitest";
import {
  resolveBeybladeSystem,
  computeBeybladeStats,
  computeEffectiveRadius,
  type PartDocMap,
} from "@/lib/beybladeSystemConverter";
import type { BeybladeSystem } from "@/types/beybladeSystem";

// ─── Minimal fixture builders ─────────────────────────────────────────────────
// Fixtures purposely use loose shapes — only the fields the converter actually
// reads are populated. Cast via `as unknown as T` to satisfy strict types.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

function makeAR(id = "ar-test"): Loose {
  return {
    id,
    displayName: "Test AR",
    partType: "attackRing",
    partLayer: "attackRing",
    color: "#ff0000",
    comboEffects: [],
    configurations: [],
    compatibilityTags: [],
    flippable: false,
    weight: 6,
    contactPoints: [
      {
        angle: 0, width: 30, radius: 25, thickness: 4,
        extends: false, extendThreshold: 0.8,
        extendedRadius: 27, extendedWidth: 35, extendedThickness: 5,
        heightRange: { min: 0, max: 8 },
        material: "abs", attackType: "smash",
        spinBehavior: { rightPin: "smash", leftPin: "upper" },
        damageMultiplier: 1.2,
        partLayer: "attackRing",
      },
    ],
    pockets: [],
    geometry: { type: "custom", preset: "circle", fourierProfile: { a0: 25, harmonics: [] } },
    dimensions: { outerRadius: 25, innerRadius: 5, height: 8 },
    materials: [],
    slots: [],
  };
}

function makeWD(id = "wd-test"): Loose {
  return {
    id,
    displayName: "Test WD",
    partType: "weightDisk",
    partLayer: "weightDisk",
    color: "#888888",
    comboEffects: [],
    configurations: [],
    compatibilityTags: [],
    diameter: 40,
    weight: 14,
    contactPoints: [],
    pockets: [],
    geometry: { type: "custom", preset: "circle", fourierProfile: { a0: 20, harmonics: [] } },
    dimensions: { outerRadius: 20, innerRadius: 8, height: 5 },
    materials: [],
    slots: [],
  };
}

function makeTip(id = "tip-test"): Loose {
  return {
    id,
    displayName: "Flat Tip",
    partType: "tip",
    partLayer: "tip",
    color: "#222222",
    comboEffects: [],
    configurations: [],
    compatibilityTags: [],
    gripFactor: 0.7,
    contactPoints: [],
    pockets: [],
    geometry: { type: "custom", preset: "circle", sideProfileSpline: { knots: [{ height: 0, radius: 3 }, { height: 8, radius: 1 }] } },
    dimensions: { outerRadius: 3, height: 8, tipWidth: 3 },
    materials: [],
    slots: [],
  };
}

function makeCasing(id = "casing-test"): Loose {
  return {
    id,
    displayName: "Standard Casing",
    partType: "casing",
    partLayer: "casing",
    color: "#444444",
    comboEffects: [],
    configurations: [],
    compatibilityTags: [],
    contactPoints: [],
    pockets: [],
    geometry: { type: "custom", preset: "circle", fourierProfile: { a0: 22, harmonics: [] } },
    dimensions: { outerRadius: 22, innerRadius: 5, height: 12 },
    materials: [],
    slots: {
      tipSlot: { position: "center", radius: 8 },
      coreSlot: { enabled: false, radius: 6, depth: 4 },
    },
  };
}

function makeSystem(overrides: Partial<BeybladeSystem> = {}): BeybladeSystem {
  return {
    id: "sys-test",
    displayName: "Test Bey",
    spinDirection: "right",
    attackRingId: "ar-test",
    attackRingFlipped: false,
    weightDiskId: "wd-test",
    tipId: "tip-test",
    casingId: "casing-test",
    activeConfigs: {},
    subPartAttachments: [],
    comboSlots: [],
    ...overrides,
  } as BeybladeSystem;
}

function makePartDocs(): PartDocMap {
  return {
    "ar-test": makeAR() as PartDocMap[string],
    "wd-test": makeWD() as PartDocMap[string],
    "tip-test": makeTip() as PartDocMap[string],
    "casing-test": makeCasing() as PartDocMap[string],
  };
}

// ─── resolveBeybladeSystem ───────────────────────────────────────────────────

describe("resolveBeybladeSystem", () => {
  it("resolves all required parts from partDocs", () => {
    const sys = makeSystem();
    const docs = makePartDocs();
    const resolved = resolveBeybladeSystem(sys, docs);

    expect(resolved.attackRing.id).toBe("ar-test");
    expect(resolved.weightDisk.id).toBe("wd-test");
    expect(resolved.tip.id).toBe("tip-test");
    expect(resolved.casing.id).toBe("casing-test");
  });

  it("bitBeast is undefined when bitBeastId is absent", () => {
    const resolved = resolveBeybladeSystem(makeSystem(), makePartDocs());
    expect(resolved.bitBeast).toBeUndefined();
  });

  it("throws with readable message when required part is missing", () => {
    const sys = makeSystem({ attackRingId: "nonexistent-ar" });
    expect(() => resolveBeybladeSystem(sys, makePartDocs())).toThrow(
      /Missing part "attackRing" id=nonexistent-ar/
    );
  });

  it("applies config override when activeConfigs.attackRing is set", () => {
    const ar = makeAR();
    ar.configurations = [{ name: "wide", overrides: { displayName: "Wide AR" } }];
    const sys = makeSystem({ activeConfigs: { attackRing: "wide" } });
    const docs = { ...makePartDocs(), "ar-test": ar as PartDocMap[string] };
    const resolved = resolveBeybladeSystem(sys, docs);
    expect(resolved.attackRing.displayName).toBe("Wide AR");
  });

  it("returns empty subParts when no attachments", () => {
    const resolved = resolveBeybladeSystem(makeSystem(), makePartDocs());
    expect(resolved.subParts).toHaveLength(0);
  });
});

// ─── computeBeybladeStats ────────────────────────────────────────────────────

describe("computeBeybladeStats", () => {
  function resolvedFixture() {
    return resolveBeybladeSystem(makeSystem(), makePartDocs());
  }

  it("produces no NaN fields", () => {
    const stats = computeBeybladeStats(resolvedFixture());
    for (const [key, val] of Object.entries(stats)) {
      if (typeof val === "number") {
        expect(isNaN(val), `field ${key} is NaN`).toBe(false);
      }
    }
  });

  it("damageMultiplier is >= 1.0", () => {
    const stats = computeBeybladeStats(resolvedFixture());
    expect(stats.damageMultiplier).toBeGreaterThanOrEqual(1.0);
  });

  it("maxSpin is > 0", () => {
    const stats = computeBeybladeStats(resolvedFixture());
    expect(stats.maxSpin).toBeGreaterThan(0);
  });

  it("inherits system displayName and spinDirection", () => {
    const stats = computeBeybladeStats(resolvedFixture());
    expect(stats.displayName).toBe("Test Bey");
    expect(stats.spinDirection).toBe("right");
  });

  it("does not crash when contactPoints arrays are empty", () => {
    const ar = makeAR();
    ar.contactPoints = [];
    const docs = { ...makePartDocs(), "ar-test": ar as PartDocMap[string] };
    const resolved = resolveBeybladeSystem(makeSystem(), docs);
    expect(() => computeBeybladeStats(resolved)).not.toThrow();
  });

  it("does not crash when pockets are empty", () => {
    const wd = makeWD();
    wd.pockets = [];
    const docs = { ...makePartDocs(), "wd-test": wd as PartDocMap[string] };
    const resolved = resolveBeybladeSystem(makeSystem(), docs);
    expect(() => computeBeybladeStats(resolved)).not.toThrow();
  });
});

// ─── computeEffectiveRadius ──────────────────────────────────────────────────

describe("computeEffectiveRadius", () => {
  it("uses bezierPath polygonCache when present", () => {
    const geom = {
      type: "custom" as const, preset: "circle" as const,
      bezierPath: {
        segments: [],
        polygonCache: [{ x: 30, y: 0 }, { x: 0, y: 25 }],
      },
    };
    expect(computeEffectiveRadius(geom, 10)).toBe(30);
  });

  it("uses Fourier profile a0 + harmonic sum when no bezierPath", () => {
    const geom = {
      type: "custom" as const, preset: "circle" as const,
      fourierProfile: { a0: 20, harmonics: [{ n: 2, a: 3, b: 4 }] },
    };
    // 20 + sqrt(9+16) = 20 + 5 = 25
    expect(computeEffectiveRadius(geom, 10)).toBe(25);
  });

  it("uses sideProfileSpline peak radius as fallback", () => {
    const geom = {
      type: "custom" as const, preset: "circle" as const,
      sideProfileSpline: { knots: [{ height: 0, radius: 5 }, { height: 10, radius: 18 }, { height: 20, radius: 8 }] },
    };
    expect(computeEffectiveRadius(geom, 10)).toBe(18);
  });

  it("returns outerRadius fallback when no geometry data", () => {
    const geom = { type: "custom" as const, preset: "circle" as const };
    expect(computeEffectiveRadius(geom, 42)).toBe(42);
  });
});

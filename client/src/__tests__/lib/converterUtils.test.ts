import { describe, it, expect } from "vitest";
import {
  sampleSplineRadius,
  ensureRadialCache,
  resolvePartConfig,
  getBottomCircleRadius,
} from "@/lib/beybladeSystemConverter";
import type { BezierSplineProfile } from "@/types/beybladeSystem";

// ─── sampleSplineRadius ───────────────────────────────────────────────────────

describe("sampleSplineRadius", () => {
  const knots: BezierSplineProfile["knots"] = [
    { height: 0,  radius: 10 },
    { height: 10, radius: 20 },
    { height: 20, radius: 5  },
  ];
  const spline: BezierSplineProfile = { knots };

  it("returns first knot radius when height is below the first knot", () => {
    expect(sampleSplineRadius(spline, -5)).toBe(10);
  });

  it("returns last knot radius when height is above the last knot", () => {
    expect(sampleSplineRadius(spline, 30)).toBe(5);
  });

  it("returns exact radius at a knot boundary", () => {
    expect(sampleSplineRadius(spline, 0)).toBe(10);
    expect(sampleSplineRadius(spline, 10)).toBe(20);
    expect(sampleSplineRadius(spline, 20)).toBe(5);
  });

  it("linearly interpolates between knots", () => {
    // midpoint between height=0 (r=10) and height=10 (r=20) → r=15
    expect(sampleSplineRadius(spline, 5)).toBeCloseTo(15);
  });

  it("handles second segment correctly", () => {
    // midpoint between height=10 (r=20) and height=20 (r=5) → r=12.5
    expect(sampleSplineRadius(spline, 15)).toBeCloseTo(12.5);
  });

  it("returns 0 for empty knots array", () => {
    expect(sampleSplineRadius({ knots: [] }, 5)).toBe(0);
  });

  it("handles single-knot spline", () => {
    const single: BezierSplineProfile = { knots: [{ height: 5, radius: 8 }] };
    expect(sampleSplineRadius(single, 0)).toBe(8);
    expect(sampleSplineRadius(single, 10)).toBe(8);
  });
});

// ─── ensureRadialCache ────────────────────────────────────────────────────────

describe("ensureRadialCache", () => {
  it("synthesizes a 360-entry cache when none exists", () => {
    const fp = { a0: 15, harmonics: [] };
    const result = ensureRadialCache(fp);
    expect(result.radialCache).toHaveLength(360);
  });

  it("returns the same object reference when cache is already 360 entries", () => {
    const cache = Array.from({ length: 360 }, () => 20);
    const fp = { a0: 20, harmonics: [], radialCache: cache };
    const result = ensureRadialCache(fp);
    expect(result).toBe(fp); // same reference — no work done
  });

  it("synthesizes new cache when existing cache has wrong length", () => {
    const fp = { a0: 10, harmonics: [], radialCache: [1, 2, 3] };
    const result = ensureRadialCache(fp);
    expect(result.radialCache).toHaveLength(360);
    expect(result).not.toBe(fp);
  });

  it("all values in flat-circle cache equal a0", () => {
    const fp = { a0: 25, harmonics: [] };
    const { radialCache } = ensureRadialCache(fp);
    radialCache!.forEach((v) => expect(v).toBeCloseTo(25));
  });
});

// ─── resolvePartConfig ────────────────────────────────────────────────────────

describe("resolvePartConfig", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SimplePart = { id: string; color: string; weight: number; configurations: any[] };

  function makePart(): SimplePart {
    return {
      id: "p1",
      color: "#111",
      weight: 5,
      configurations: [
        { name: "heavy", overrides: { weight: 12 } },
        { name: "red",   overrides: { color: "#ff0000" } },
      ],
    };
  }

  it("returns the part unchanged when no configName is given", () => {
    const part = makePart();
    expect(resolvePartConfig(part)).toBe(part);
  });

  it("returns the part unchanged when configName does not match any config", () => {
    const part = makePart();
    expect(resolvePartConfig(part, "nonexistent")).toBe(part);
  });

  it("applies matching config overrides (shallow merge)", () => {
    const part = makePart();
    const result = resolvePartConfig(part, "heavy");
    expect(result.weight).toBe(12);
    expect(result.color).toBe("#111"); // unchanged
  });

  it("does not mutate the original part", () => {
    const part = makePart();
    resolvePartConfig(part, "heavy");
    expect(part.weight).toBe(5);
  });

  it("applies second config independently", () => {
    const part = makePart();
    const result = resolvePartConfig(part, "red");
    expect(result.color).toBe("#ff0000");
    expect(result.weight).toBe(5);
  });
});

// ─── getBottomCircleRadius ────────────────────────────────────────────────────

describe("getBottomCircleRadius", () => {
  it("returns first knot radius from sideProfileSpline", () => {
    const geom = {
      type: "custom" as const, preset: "circle" as const,
      sideProfileSpline: { knots: [{ height: 0, radius: 7 }, { height: 10, radius: 3 }] },
    };
    expect(getBottomCircleRadius(geom)).toBe(7);
  });

  it("returns innerRadiusFallback when no sideProfileSpline", () => {
    const geom = { type: "custom" as const, preset: "circle" as const };
    expect(getBottomCircleRadius(geom, 4)).toBe(4);
  });

  it("returns 0 when no spline and no fallback supplied", () => {
    const geom = { type: "custom" as const, preset: "circle" as const };
    expect(getBottomCircleRadius(geom)).toBe(0);
  });

  it("uses spline even when fallback is provided", () => {
    const geom = {
      type: "custom" as const, preset: "circle" as const,
      sideProfileSpline: { knots: [{ height: 0, radius: 9 }] },
    };
    expect(getBottomCircleRadius(geom, 99)).toBe(9);
  });
});

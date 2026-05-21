// Unit tests for the shared units module. See plan: Part 1, Part 1b.

import { describe, it, expect } from "vitest";
import {
  PX_PER_CM_BASE,
  PHYSICS_SCALE,
  MM_PER_CM,
  cmToPx,
  pxToCm,
  mmToCm,
  cmToMm,
  cmToPhysics,
  physicsToCm,
  effectivePxPerCm,
  getPxPerCm,
  recomputePxPerCm,
} from "@/constants/units";

describe("units", () => {
  it("base constants are correct", () => {
    expect(PX_PER_CM_BASE).toBe(24);
    expect(PHYSICS_SCALE).toBe(16);
    expect(MM_PER_CM).toBe(10);
  });

  it("cm <-> px round-trips", () => {
    const cm = 17;
    expect(pxToCm(cmToPx(cm))).toBeCloseTo(cm, 8);
  });

  it("mm <-> cm round-trips", () => {
    expect(mmToCm(cmToMm(3.7))).toBeCloseTo(3.7, 8);
  });

  it("physics conversion is 1cm = 24px * 16 = 384 physics units", () => {
    expect(cmToPhysics(1)).toBeCloseTo(384, 8);
    expect(physicsToCm(384)).toBeCloseTo(1, 8);
  });

  it("effectivePxPerCm scales with zoom", () => {
    recomputePxPerCm();
    const base = getPxPerCm();
    expect(effectivePxPerCm(2)).toBeCloseTo(base * 2, 6);
    expect(effectivePxPerCm(0.5)).toBeCloseTo(base * 0.5, 6);
  });
});

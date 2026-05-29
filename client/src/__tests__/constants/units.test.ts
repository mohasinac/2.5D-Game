import { describe, it, expect } from "vitest";
import {
  PX_PER_CM_BASE,
  REFERENCE_VMIN,
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
    expect(REFERENCE_VMIN).toBe(1080);
    expect(PHYSICS_SCALE).toBe(16);
    expect(MM_PER_CM).toBe(10);
  });

  it("recomputePxPerCm always returns PX_PER_CM_BASE (viewport-independent)", () => {
    expect(recomputePxPerCm(1920, 1080)).toBe(24);
    expect(getPxPerCm()).toBe(24);

    expect(recomputePxPerCm(375, 812)).toBe(24);
    expect(getPxPerCm()).toBe(24);

    expect(recomputePxPerCm(3840, 2160)).toBe(24);
    expect(getPxPerCm()).toBe(24);

    expect(recomputePxPerCm()).toBe(24);
  });

  it("cm <-> px round-trips", () => {
    recomputePxPerCm(1920, 1080);
    const cm = 17;
    expect(pxToCm(cmToPx(cm))).toBeCloseTo(cm, 8);
  });

  it("mm <-> cm round-trips", () => {
    expect(mmToCm(cmToMm(3.7))).toBeCloseTo(3.7, 8);
  });

  it("physics conversion is always 1cm = 24px * 16 = 384 units (viewport-independent)", () => {
    recomputePxPerCm(375, 812);  // small viewport
    expect(cmToPhysics(1)).toBeCloseTo(384, 8);
    expect(physicsToCm(384)).toBeCloseTo(1, 8);
    recomputePxPerCm(1920, 1080);
  });

  it("effectivePxPerCm scales with zoom", () => {
    recomputePxPerCm(1920, 1080);
    const base = getPxPerCm();
    expect(effectivePxPerCm(2)).toBeCloseTo(base * 2, 6);
    expect(effectivePxPerCm(0.5)).toBeCloseTo(base * 0.5, 6);
  });
});

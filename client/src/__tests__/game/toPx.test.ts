import { describe, it, expect } from "vitest";
import {
  PX_PER_CM_BASE,
  cmToPx,
  effectivePxPerCm,
  recomputePxPerCm,
  getPxPerCm,
} from "@/constants/units";

/**
 * Tests for the renderer's cm→px coordinate conversion system.
 * The renderer pattern is: display_px = realWorld_cm × PX_PER_CM × viewportScale
 */
describe("toPx (renderer coordinate conversion)", () => {
  it("toPx(1) = PX_PER_CM_BASE (24) at viewportScale=1", () => {
    recomputePxPerCm(1920, 1080);
    const px = cmToPx(1);
    expect(px).toBe(PX_PER_CM_BASE);
    expect(px).toBe(24);
  });

  it("toPx(2.7) = 64.8 at viewportScale=1", () => {
    recomputePxPerCm(1920, 1080);
    expect(cmToPx(2.7)).toBeCloseTo(64.8, 6);
  });

  it("scales with viewportScale via effectivePxPerCm", () => {
    recomputePxPerCm(1920, 1080);
    const base = getPxPerCm();
    // zoom=2: all dimensions appear twice as large
    expect(effectivePxPerCm(2)).toBeCloseTo(base * 2, 6);
    // zoom=0.5: all dimensions appear half as large
    expect(effectivePxPerCm(0.5)).toBeCloseTo(base * 0.5, 6);
  });

  it("never returns NaN or Infinity for valid inputs", () => {
    recomputePxPerCm(1920, 1080);
    const inputs = [0, 0.001, 1, 2.7, 4.5, 100];
    for (const cm of inputs) {
      const px = cmToPx(cm);
      expect(isNaN(px), `cmToPx(${cm}) should not be NaN`).toBe(false);
      expect(isFinite(px), `cmToPx(${cm}) should be finite`).toBe(true);
    }
  });

  it("scales proportionally with vmin — mobile < reference < 4K", () => {
    // vmin = 375  →  24 × (375/1080) ≈ 8.33
    recomputePxPerCm(375, 812);
    const mobile = cmToPx(1);
    // vmin = 1080 →  24 × (1080/1080) = 24  (reference)
    recomputePxPerCm(1920, 1080);
    const reference = cmToPx(1);
    // vmin = 2160 →  24 × (2160/1080) = 48
    recomputePxPerCm(3840, 2160);
    const desktop = cmToPx(1);
    expect(mobile).toBeCloseTo(24 * (375 / 1080), 6);
    expect(reference).toBe(24);
    expect(desktop).toBeCloseTo(48, 6);
    expect(mobile).toBeLessThan(reference);
    expect(reference).toBeLessThan(desktop);
  });

  it("cm=0 returns 0 pixels", () => {
    recomputePxPerCm(1920, 1080);
    expect(cmToPx(0)).toBe(0);
  });
});

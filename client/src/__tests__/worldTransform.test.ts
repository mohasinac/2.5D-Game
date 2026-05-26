/**
 * Q5: WorldTransform zoom clamp unit test.
 * Verifies setZoom clamps to [minZoom, maxZoom] computed from arena + bey radius.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { WorldTransform } from "../game/renderer/WorldTransform";

// Mock getPxPerCm / recomputePxPerCm (units module)
vi.mock("@/constants/units", () => ({
  getPxPerCm: () => 24,
  recomputePxPerCm: () => {},
}));

import { vi } from "vitest";

describe("WorldTransform zoom clamping", () => {
  let wt: WorldTransform;

  beforeEach(() => {
    wt = new WorldTransform();
    wt.setScreen(1920, 1080);
    // Standard 45cm-radius arena: bounding box 90×90 cm
    wt.setArenaBounds(0, 0, 90, 90);
    wt.computeZoomLimits(2.5); // typical bey radius in cm
  });

  it("computeZoomLimits sets minZoom and maxZoom > 0", () => {
    expect(wt.limits.minZoom).toBeGreaterThan(0);
    expect(wt.limits.maxZoom).toBeGreaterThan(0);
    expect(wt.limits.maxZoom).toBeGreaterThanOrEqual(wt.limits.minZoom);
  });

  it("setZoom clamps above maxZoom to maxZoom", () => {
    const wayAbove = wt.limits.maxZoom * 100;
    wt.setZoom(wayAbove, true);
    expect(wt.camera.zoom).toBeLessThanOrEqual(wt.limits.maxZoom);
    expect(wt.camera.zoom).toBeCloseTo(wt.limits.maxZoom, 5);
  });

  it("setZoom clamps below minZoom to minZoom", () => {
    wt.setZoom(0.0001, true);
    expect(wt.camera.zoom).toBeGreaterThanOrEqual(wt.limits.minZoom);
    expect(wt.camera.zoom).toBeCloseTo(wt.limits.minZoom, 5);
  });

  it("nudgeZoom past max still clamps", () => {
    wt.setZoom(wt.limits.maxZoom, true);
    wt.nudgeZoom(1000); // huge multiplier
    // targetZoom is clamped; after tick, camera.zoom converges
    expect(wt.camera.targetZoom).toBeLessThanOrEqual(wt.limits.maxZoom);
  });

  it("MIN_VIEWPORT_CM is 10 cm", () => {
    expect(WorldTransform.MIN_VIEWPORT_CM).toBe(10);
  });

  it("maxZoom never exceeds tileCapZoom (screenShort / (MIN_VIEWPORT_CM * pxPerCm))", () => {
    const pxPerCm = 24; // mocked value in this test suite
    const screenShort = Math.min(1920, 1080);
    const tileCapZoom = screenShort / (WorldTransform.MIN_VIEWPORT_CM * pxPerCm);
    expect(wt.limits.maxZoom).toBeLessThanOrEqual(tileCapZoom + 0.001); // small tolerance
  });
});

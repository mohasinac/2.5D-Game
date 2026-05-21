// Unit tests for WorldTransform: smart follow, clamp-to-arena, zoom limits,
// world↔screen projection round-trips. See plan: Part 1 / Part 2.

import { describe, it, expect, beforeEach } from "vitest";
import { WorldTransform } from "@/game/renderer/WorldTransform";

describe("WorldTransform", () => {
  let wt: WorldTransform;

  beforeEach(() => {
    wt = new WorldTransform();
    wt.setScreen(1920, 1080);
    wt.setArenaBounds(-25, -25, 25, 25); // 50cm × 50cm arena
    wt.computeZoomLimits(2.5);
  });

  it("world → screen round-trips", () => {
    wt.snapTo(0, 0);
    wt.setZoom(1, true);
    const a = wt.worldToScreen(5, -3);
    const b = wt.screenToWorld(a.x, a.y);
    expect(b.x_cm).toBeCloseTo(5, 6);
    expect(b.y_cm).toBeCloseTo(-3, 6);
  });

  it("at zoom = 1, origin maps to screen center", () => {
    wt.snapTo(0, 0);
    wt.setZoom(1, true);
    const s = wt.worldToScreen(0, 0);
    expect(s.x).toBeCloseTo(960, 4);
    expect(s.y).toBeCloseTo(540, 4);
  });

  it("zoom limits clamp", () => {
    wt.setZoom(999, true);
    expect(wt.camera.targetZoom).toBeLessThanOrEqual(wt.limits.maxZoom);
    wt.setZoom(-999, true);
    expect(wt.camera.targetZoom).toBeGreaterThanOrEqual(wt.limits.minZoom);
  });

  it("5-bey-window max zoom is finite and > min", () => {
    expect(wt.limits.maxZoom).toBeGreaterThan(wt.limits.minZoom);
    expect(Number.isFinite(wt.limits.maxZoom)).toBe(true);
  });

  it("min zoom fits the whole arena on the short screen axis", () => {
    // At minZoom, arena width should equal min(screen.w, screen.h).
    // arena width = (25 - (-25)) = 50cm. At PX_PER_CM=24, that's 1200 px.
    // min(1920, 1080) = 1080. So minZoom = 1080/1200 = 0.9.
    expect(wt.limits.minZoom).toBeCloseTo(1080 / 1200, 4);
  });

  it("smart follow lerps toward target (within pannable bounds)", () => {
    // setZoom clamps to maxZoom (1.8 for this config) → viewport ~44.44cm wide
    // on a 50cm arena, so camera can pan ±~2.78cm. Test a clearly-reachable
    // target inside that band.
    wt.setZoom(2, true);
    wt.snapTo(0, 0);
    wt.setFollowTarget(2, 0);
    for (let i = 0; i < 400; i++) wt.tick();
    expect(wt.camera.x_cm).toBeCloseTo(2, 1);
  });

  it("camera locks to arena center when viewport > arena", () => {
    wt.snapTo(0, 0);
    wt.setZoom(0.9, true); // viewport > arena
    wt.setFollowTarget(10, 0);
    for (let i = 0; i < 50; i++) wt.tick();
    expect(wt.camera.x_cm).toBeCloseTo(0, 4);
  });

  it("viewport rect width matches screen width / (pxPerCm * zoom)", () => {
    wt.snapTo(0, 0);
    wt.setZoom(1, true);
    const v = wt.viewportCm();
    // 1920px / (24 px/cm * 1) = 80cm
    expect(v.w).toBeCloseTo(1920 / 24, 4);
    expect(v.h).toBeCloseTo(1080 / 24, 4);
  });

  it("isInViewport detects points inside vs outside", () => {
    wt.snapTo(0, 0);
    wt.setZoom(1, true);
    expect(wt.isInViewport(0, 0)).toBe(true);
    expect(wt.isInViewport(1000, 0)).toBe(false);
  });

  it("rectIntersectsViewport returns true for overlapping rects", () => {
    wt.snapTo(0, 0);
    wt.setZoom(1, true);
    expect(wt.rectIntersectsViewport(-5, -5, 10, 10)).toBe(true);
    expect(wt.rectIntersectsViewport(500, 500, 10, 10)).toBe(false);
  });
});

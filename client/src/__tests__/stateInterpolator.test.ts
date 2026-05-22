/**
 * P8: StateInterpolator unit test.
 * Two snapshots 16ms apart → query at t+8ms returns exact midpoint.
 */
import { describe, it, expect } from "vitest";
import { StateInterpolator } from "../game/interpolation/StateInterpolator";

const BASE_SNAP = {
  angle: 0, spin: 0, wobbleAmplitude: 0, beyTiltAngle: 0,
  adhering: false, wallClimbing: false,
  spinDirection: "right", specialMoveActive: false,
  comboPhase: "", combinationLocked: false,
};

describe("StateInterpolator", () => {
  it("returns null for unknown beyId", () => {
    const interp = new StateInterpolator();
    expect(interp.getInterpolated("unknown", 1000)).toBeNull();
  });

  it("returns snap for single push (same prev/curr)", () => {
    const interp = new StateInterpolator();
    interp.push("a", { ...BASE_SNAP, time: 1000, x: 10, y: 20 });
    // With renderDelay ≈ 16.7ms, querying at same time returns curr clamped at t=1
    const result = interp.getInterpolated("a", 1020);
    expect(result).not.toBeNull();
    expect(result!.x).toBe(10);
  });

  it("interpolates x/y to midpoint at exactly halfway time", () => {
    const interp = new StateInterpolator();
    const t0 = 1000;
    const t1 = t0 + 16; // 16ms later (≈ 1 tick at 60Hz)
    interp.push("a", { ...BASE_SNAP, time: t0, x: 0, y: 0 });
    interp.push("a", { ...BASE_SNAP, time: t1, x: 100, y: 200 });

    // renderDelay = 1000/60 ≈ 16.67ms
    // renderTime = now - renderDelay; we want t = 0.5 → renderTime = t0 + 8
    // so now = t0 + 8 + renderDelay = t0 + 8 + 16.67 ≈ 1024.67
    const renderDelay = 1000 / 60;
    const now = t0 + 8 + renderDelay;
    const result = interp.getInterpolated("a", now);

    expect(result).not.toBeNull();
    // t = (renderTime - t0) / (t1 - t0) = 8/16 = 0.5
    expect(result!.x).toBeCloseTo(50, 0);
    expect(result!.y).toBeCloseTo(100, 0);
  });

  it("clamps t to [0, 1] — returns curr when querying far in the future", () => {
    const interp = new StateInterpolator();
    interp.push("a", { ...BASE_SNAP, time: 1000, x: 0, y: 0 });
    interp.push("a", { ...BASE_SNAP, time: 1016, x: 100, y: 0 });

    const result = interp.getInterpolated("a", 9999);
    expect(result!.x).toBe(100); // t clamped to 1
  });

  it("removes beyblade correctly", () => {
    const interp = new StateInterpolator();
    interp.push("a", { ...BASE_SNAP, time: 1000, x: 10, y: 0 });
    interp.remove("a");
    expect(interp.getInterpolated("a", 1020)).toBeNull();
  });

  it("clear removes all beyblades", () => {
    const interp = new StateInterpolator();
    interp.push("a", { ...BASE_SNAP, time: 1000, x: 10, y: 0 });
    interp.push("b", { ...BASE_SNAP, time: 1000, x: 20, y: 0 });
    interp.clear();
    expect(interp.getInterpolated("a", 1020)).toBeNull();
    expect(interp.getInterpolated("b", 1020)).toBeNull();
  });
});

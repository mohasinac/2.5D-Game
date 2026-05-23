import { describe, it, expect } from "vitest";
import { advanceArenaRotation } from "../../shared/rooms/advanceArenaRotation";
import { ArenaState } from "../../rooms/schema/GameState";

function makeArena(over: Partial<ArenaState> = {}): ArenaState {
  const a = new ArenaState();
  Object.assign(a, over);
  return a;
}

describe("advanceArenaRotation", () => {
  it("no-op when autoRotate is false", () => {
    const a = makeArena({ rotation: 0, autoRotate: false, rotationSpeed: 60 });
    advanceArenaRotation(a, 1);
    expect(a.rotation).toBe(0);
  });

  it("no-op when rotationSpeed is 0", () => {
    const a = makeArena({ rotation: 0, autoRotate: true, rotationSpeed: 0 });
    advanceArenaRotation(a, 1);
    expect(a.rotation).toBe(0);
  });

  it("clockwise rotation advances positively at deg/s × dt", () => {
    const a = makeArena({ rotation: 0, autoRotate: true, rotationSpeed: 90, rotationDirection: "clockwise" });
    advanceArenaRotation(a, 0.5); // 0.5s at 90°/s = 45° = π/4 rad
    expect(a.rotation).toBeCloseTo(Math.PI / 4, 6);
  });

  it("counterclockwise rotation advances negatively", () => {
    const a = makeArena({ rotation: 0, autoRotate: true, rotationSpeed: 90, rotationDirection: "counterclockwise" });
    advanceArenaRotation(a, 1);
    expect(a.rotation).toBeCloseTo(-Math.PI / 2, 6);
  });

  it("wraps angle to keep float precision bounded", () => {
    const a = makeArena({ rotation: 0, autoRotate: true, rotationSpeed: 360, rotationDirection: "clockwise" });
    // 10 full rotations — would accumulate to 20π without wrapping.
    for (let i = 0; i < 10; i++) advanceArenaRotation(a, 1);
    expect(Math.abs(a.rotation)).toBeLessThanOrEqual(Math.PI * 2);
  });
});

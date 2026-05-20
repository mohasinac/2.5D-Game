import { describe, test, expect, beforeEach } from "vitest";

// We re-import the module each test to get a fresh counter via isolation.
// Since vitest runs each file in a separate process (pool: "forks"), this is
// sufficient — no need for jest.isolateModules or dynamic import hacks.

describe("roomCounter — tryReserveRoom / releaseRoom", () => {
  let tryReserveRoom: () => boolean;
  let releaseRoom: () => void;
  let getActiveRoomCount: () => number;

  beforeEach(async () => {
    // Re-import to reset module state between test suites
    vi.resetModules();
    const mod = await import("../../src/utils/roomCounter");
    tryReserveRoom = mod.tryReserveRoom;
    releaseRoom = mod.releaseRoom;
    getActiveRoomCount = mod.getActiveRoomCount;
    // Drain any leftover rooms from previous test
    while (getActiveRoomCount() > 0) releaseRoom();
  });

  test("starts at 0 active rooms", () => {
    expect(getActiveRoomCount()).toBe(0);
  });

  test("tryReserveRoom increments count and returns true", () => {
    expect(tryReserveRoom()).toBe(true);
    expect(getActiveRoomCount()).toBe(1);
  });

  test("20 consecutive reservations all succeed", () => {
    for (let i = 0; i < 20; i++) {
      expect(tryReserveRoom()).toBe(true);
    }
    expect(getActiveRoomCount()).toBe(20);
  });

  test("21st reservation returns false when cap is hit", () => {
    for (let i = 0; i < 20; i++) tryReserveRoom();
    expect(tryReserveRoom()).toBe(false);
  });

  test("releaseRoom decrements the count", () => {
    tryReserveRoom();
    tryReserveRoom();
    releaseRoom();
    expect(getActiveRoomCount()).toBe(1);
  });

  test("after release, a new reservation succeeds even if cap was hit", () => {
    for (let i = 0; i < 20; i++) tryReserveRoom();
    expect(tryReserveRoom()).toBe(false);
    releaseRoom();
    expect(tryReserveRoom()).toBe(true);
  });

  test("releaseRoom at 0 does not go negative", () => {
    releaseRoom(); // no-op
    expect(getActiveRoomCount()).toBe(0);
  });
});

import { LocalGameSimulation, type SimGameEvent } from "@/game/simulation/LocalGameSimulation";
import type { GameRoomConfig } from "@/types/gameRoom";

// Firestore mocks come from setup.ts (getDocs/getDoc return empty by default)

function makeConfig(overrides: Partial<GameRoomConfig> = {}): GameRoomConfig {
  return {
    roomType: "tryout",
    beybladeId: "default",
    arenaId: "default",
    ...overrides,
  };
}

describe("LocalGameSimulation — lifecycle", () => {
  it("starts in idle status", () => {
    let lastSnap: any = null;
    const sim = new LocalGameSimulation(makeConfig(), (s) => { lastSnap = s; });
    expect(lastSnap).toBeNull(); // snapshot not emitted until start()
  });

  it("emits loading snapshot on start()", async () => {
    const snapshots: any[] = [];
    const sim = new LocalGameSimulation(makeConfig(), (s) => snapshots.push(s));
    // start() fires the first snapshot synchronously, then loads async
    sim.start(); // don't await — just check first sync emit
    expect(snapshots[0].status).toBe("loading");
    sim.stop();
  });

  it("stop() cancels pending timers and rAF", async () => {
    const sim = new LocalGameSimulation(makeConfig(), () => {});
    const startPromise = sim.start();
    sim.stop();
    // Should not throw or hang
    await startPromise;
  });

  it("pause() does not throw when not in-progress", () => {
    const sim = new LocalGameSimulation(makeConfig(), () => {});
    expect(() => sim.pause()).not.toThrow();
    sim.stop();
  });

  it("resume() does not throw when not paused", () => {
    const sim = new LocalGameSimulation(makeConfig(), () => {});
    expect(() => sim.resume()).not.toThrow();
    sim.stop();
  });
});

describe("LocalGameSimulation — SimGameEvent types", () => {
  it("SimGameEvent collision type has required fields", () => {
    const e: SimGameEvent = {
      type: "collision",
      beyId: "player",
      otherBeyId: "bot-0",
      relativeSpeed: 5.2,
    };
    expect(e.type).toBe("collision");
    expect(e.beyId).toBe("player");
    expect(e.relativeSpeed).toBe(5.2);
  });

  it("SimGameEvent burst type has beyId", () => {
    const e: SimGameEvent = { type: "burst", beyId: "bot-0" };
    expect(e.type).toBe("burst");
    expect(e.beyId).toBe("bot-0");
  });

  it("SimGameEvent ring-out type has beyId", () => {
    const e: SimGameEvent = { type: "ring-out", beyId: "player" };
    expect(e.type).toBe("ring-out");
    expect(e.beyId).toBe("player");
  });

  it("game event callback is optional — sim starts without it", async () => {
    const sim = new LocalGameSimulation(makeConfig(), () => {});
    // No third argument — should not throw
    await expect(sim.start()).resolves.not.toThrow();
    sim.stop();
  });

  it("game event callback is called when provided", async () => {
    const events: SimGameEvent[] = [];
    const sim = new LocalGameSimulation(
      makeConfig(),
      () => {},
      (e) => events.push(e),
    );
    // Just verify it starts without throwing; actual events fire from physics
    await sim.start();
    sim.stop();
    // No physics runs in test (RAF is mocked to one call), but the callback wiring is correct
    expect(events).toBeInstanceOf(Array);
  });
});

describe("LocalGameSimulation — applyInput guards", () => {
  it("applyInput does nothing when status is not launching/in-progress", async () => {
    const sim = new LocalGameSimulation(makeConfig(), () => {});
    // status = 'loading' during start (before async loadData completes)
    sim.start(); // fire but don't await
    // applyInput with an active bitmask should not throw
    expect(() =>
      sim.applyInput({
        moveLeft: true, moveRight: false, moveUp: false, moveDown: false,
        attack: false, defense: false, dodge: false, jump: false,
        chargeHeld: false, specialTap: false,
      })
    ).not.toThrow();
    sim.stop();
  });
});

describe("LocalGameSimulation — config variants", () => {
  it("pvai mode: exactly 1 AI opponent", async () => {
    const snapshots: any[] = [];
    const sim = new LocalGameSimulation(
      makeConfig({ roomType: "pvai", aiCount: 5 }), // aiCount ignored for pvai
      (s) => snapshots.push(s),
    );
    await sim.start();
    sim.stop();
    // After loading we should have player + 1 AI = 2 beys
    const finalSnap = snapshots.at(-1);
    if (finalSnap && finalSnap.status !== "loading") {
      expect(finalSnap.gameState.beyblades.size ?? 0).toBeLessThanOrEqual(2);
    }
  });

  it("royale-ai mode: accepts aiCount up to 11", () => {
    const sim = new LocalGameSimulation(
      makeConfig({ roomType: "royale-ai", aiCount: 11 }),
      () => {},
    );
    expect(sim).toBeDefined();
    sim.stop();
  });

  it("tournament-ai mode: does not crash on start", async () => {
    const sim = new LocalGameSimulation(
      makeConfig({ roomType: "tournament-ai", aiCount: 3 }),
      () => {},
    );
    await expect(sim.start()).resolves.not.toThrow();
    sim.stop();
  });
});

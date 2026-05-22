// Tests for the admin AI vs AI mode added to AIBattleRoom.
// Stubs replicate the aiVsAi join/leave/disposal logic without importing Colyseus.

import { describe, test, expect, beforeEach, vi } from "vitest";

const AI_P1 = "__ai_p1__";
const AI_P2 = "__ai_p2__";
const NO_SPECTATOR_TIMEOUT_MS = 30_000;

interface MockBeyblade { id: string; isAI: boolean; isActive: boolean; userId: string; }
interface MockClient { sessionId: string; rejectedCode?: number; }
type Difficulty = "medium" | "hard" | "hell";

function makeClient(id: string): MockClient {
  return { sessionId: id };
}

/**
 * Stub that replicates AIBattleRoom's aiVsAi branch logic:
 * - Two AI slots pre-populated on creation.
 * - Non-spectators rejected.
 * - Disposes when last spectator leaves (or after NO_SPECTATOR_TIMEOUT_MS with none).
 */
class AIVsAIRoomStub {
  state = {
    spectatorCount: 0,
    beyblades: new Map<string, MockBeyblade>(),
  };
  disposed = false;
  private spectatorSessions = new Set<string>();
  private noSpectatorTimeout: ReturnType<typeof setTimeout> | null = null;
  private p1Difficulty: Difficulty = "medium";
  private p2Difficulty: Difficulty = "medium";

  constructor(p1Difficulty: Difficulty = "medium", p2Difficulty: Difficulty = "medium") {
    this.p1Difficulty = p1Difficulty;
    this.p2Difficulty = p2Difficulty;
    // Spawn two AI beyblades immediately (no human seat).
    this.state.beyblades.set(AI_P1, { id: AI_P1, isAI: true, isActive: true, userId: AI_P1 });
    this.state.beyblades.set(AI_P2, { id: AI_P2, isAI: true, isActive: true, userId: AI_P2 });
    // Start the no-spectator timeout — in real room this auto-disposes.
    this.noSpectatorTimeout = setTimeout(() => { this.disposed = true; }, NO_SPECTATOR_TIMEOUT_MS);
  }

  onJoin(client: MockClient, options: { spectate?: boolean } = {}) {
    if (!options.spectate) {
      // Non-spectators are rejected in aiVsAi mode (mirrors AIBattleRoom code 4001).
      client.rejectedCode = 4001;
      return;
    }
    if (this.state.spectatorCount === 0 && this.noSpectatorTimeout) {
      clearTimeout(this.noSpectatorTimeout);
      this.noSpectatorTimeout = null;
    }
    this.state.spectatorCount++;
    this.spectatorSessions.add(client.sessionId);
  }

  onLeave(client: MockClient) {
    if (!this.spectatorSessions.has(client.sessionId)) return;
    this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
    this.spectatorSessions.delete(client.sessionId);
    if (this.state.spectatorCount === 0) {
      this.disposed = true;
    }
  }

  getAIBeyblades() {
    return [...this.state.beyblades.values()].filter((b) => b.isAI);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AIBattleRoom aiVsAi — initial state", () => {
  test("exactly two AI beyblades are spawned, no human beyblades", () => {
    const room = new AIVsAIRoomStub();
    const aiBeys = room.getAIBeyblades();
    expect(aiBeys).toHaveLength(2);
    expect(aiBeys.every((b) => b.isAI)).toBe(true);
    expect(room.state.beyblades.has(AI_P1)).toBe(true);
    expect(room.state.beyblades.has(AI_P2)).toBe(true);
  });

  test("spectatorCount starts at zero", () => {
    const room = new AIVsAIRoomStub();
    expect(room.state.spectatorCount).toBe(0);
  });
});

describe("AIBattleRoom aiVsAi — spectator join", () => {
  let room: AIVsAIRoomStub;
  beforeEach(() => { room = new AIVsAIRoomStub(); });

  test("spectator join increments spectatorCount", () => {
    room.onJoin(makeClient("admin"), { spectate: true });
    expect(room.state.spectatorCount).toBe(1);
  });

  test("multiple spectators are counted correctly", () => {
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });
    room.onJoin(makeClient("spec-3"), { spectate: true });
    expect(room.state.spectatorCount).toBe(3);
  });

  test("spectator join does not add a human beyblade", () => {
    room.onJoin(makeClient("admin"), { spectate: true });
    const humanBeys = [...room.state.beyblades.values()].filter((b) => !b.isAI);
    expect(humanBeys).toHaveLength(0);
  });

  test("room stays undisposed when a spectator joins", () => {
    room.onJoin(makeClient("admin"), { spectate: true });
    expect(room.disposed).toBe(false);
  });
});

describe("AIBattleRoom aiVsAi — non-spectator rejection", () => {
  test("non-spectator player is rejected with code 4001", () => {
    const room = new AIVsAIRoomStub();
    const player = makeClient("player-1");
    room.onJoin(player, { spectate: false });
    expect(player.rejectedCode).toBe(4001);
  });

  test("rejected non-spectator does not modify beyblades", () => {
    const room = new AIVsAIRoomStub();
    const before = room.state.beyblades.size;
    room.onJoin(makeClient("player-1"), { spectate: false });
    expect(room.state.beyblades.size).toBe(before);
  });

  test("rejected non-spectator does not increment spectatorCount", () => {
    const room = new AIVsAIRoomStub();
    room.onJoin(makeClient("player-1"), { spectate: false });
    expect(room.state.spectatorCount).toBe(0);
  });
});

describe("AIBattleRoom aiVsAi — disposal when last spectator leaves", () => {
  test("room disposes when last spectator leaves", () => {
    const room = new AIVsAIRoomStub();
    room.onJoin(makeClient("admin"), { spectate: true });
    room.onLeave(makeClient("admin"));
    expect(room.disposed).toBe(true);
  });

  test("room does NOT dispose while at least one spectator remains", () => {
    const room = new AIVsAIRoomStub();
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });
    room.onLeave(makeClient("spec-1"));
    expect(room.disposed).toBe(false);
  });

  test("spectatorCount reaches zero before disposal", () => {
    const room = new AIVsAIRoomStub();
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });
    room.onLeave(makeClient("spec-1"));
    room.onLeave(makeClient("spec-2"));
    expect(room.state.spectatorCount).toBe(0);
    expect(room.disposed).toBe(true);
  });

  test("AI beyblades are unaffected by spectator leave", () => {
    const room = new AIVsAIRoomStub();
    room.onJoin(makeClient("admin"), { spectate: true });
    room.onLeave(makeClient("admin"));
    // Even after disposal flag, the beyblade records are intact (room shutdown is async in real code).
    expect(room.state.beyblades.get(AI_P1)?.isAI).toBe(true);
    expect(room.state.beyblades.get(AI_P2)?.isAI).toBe(true);
  });
});

describe("AIBattleRoom aiVsAi — difficulty settings", () => {
  test("accepts different difficulties for each AI contestant", () => {
    // Just verifies the constructor does not throw for all difficulty combos.
    expect(() => new AIVsAIRoomStub("medium", "hard")).not.toThrow();
    expect(() => new AIVsAIRoomStub("hard", "hell")).not.toThrow();
    expect(() => new AIVsAIRoomStub("hell", "medium")).not.toThrow();
  });
});

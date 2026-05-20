// Tests for spectator support in AIBattleRoom.
// Mirror of BattleRoom spectator tests adapted for the 1-human + 1-AI pattern.

import { describe, test, expect, beforeEach } from "vitest";

// ─── Minimal stand-in ────────────────────────────────────────────────────────

const AI_SESSION_ID = "__ai__";

interface MockBeyblade { id: string; isAI: boolean; isActive: boolean; }

interface MockState {
  spectatorCount: number;
  beyblades: Map<string, MockBeyblade>;
}

interface MockClient {
  sessionId: string;
  rejectedCode?: number;
}

function makeClient(id: string): MockClient {
  return { sessionId: id };
}

/** Replicated AIBattleRoom spectator logic. */
class AIBattleRoomStub {
  private humanSessionId: string | null = null;
  private spectatorSessions = new Set<string>();
  state: MockState = { spectatorCount: 0, beyblades: new Map() };
  disposed = false;

  /** Simulates onCreate — AI beyblade always created */
  createAI() {
    this.state.beyblades.set(AI_SESSION_ID, { id: AI_SESSION_ID, isAI: true, isActive: true });
  }

  onJoin(client: MockClient, options: { spectate?: boolean } = {}) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      return;
    }
    // Human player slot (cap = 1)
    if (this.humanSessionId !== null) {
      client.rejectedCode = 4000;
      return;
    }
    this.humanSessionId = client.sessionId;
    this.state.beyblades.set(client.sessionId, { id: client.sessionId, isAI: false, isActive: true });
  }

  onLeave(client: MockClient) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }
    if (this.humanSessionId === client.sessionId) {
      this.humanSessionId = null;
      const bey = this.state.beyblades.get(client.sessionId);
      if (bey) bey.isActive = false;
      this.checkPlayerCount();
    }
  }

  private checkPlayerCount() {
    if (this.humanSessionId === null) {
      this.disposed = true; // room disposes
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AIBattleRoom — spectator join", () => {
  let room: AIBattleRoomStub;

  beforeEach(() => {
    room = new AIBattleRoomStub();
    room.createAI();
  });

  test("spectator join increments spectatorCount", () => {
    room.onJoin(makeClient("spec-1"), { spectate: true });
    expect(room.state.spectatorCount).toBe(1);
  });

  test("spectator join does NOT add a human beyblade", () => {
    const before = room.state.beyblades.size; // AI is already there
    room.onJoin(makeClient("spec-1"), { spectate: true });
    expect(room.state.beyblades.size).toBe(before);
  });

  test("only 2 beyblades exist even with spectators (human + AI)", () => {
    const human = makeClient("human-1");
    room.onJoin(human);
    for (let i = 1; i <= 5; i++) {
      room.onJoin(makeClient(`spec-${i}`), { spectate: true });
    }
    expect(room.state.beyblades.size).toBe(2);
    expect(room.state.spectatorCount).toBe(5);
  });
});

describe("AIBattleRoom — spectator leave", () => {
  let room: AIBattleRoomStub;

  beforeEach(() => {
    room = new AIBattleRoomStub();
    room.createAI();
    room.onJoin(makeClient("human-1"));
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });
  });

  test("spectator leave decrements spectatorCount", () => {
    room.onLeave(makeClient("spec-1"));
    expect(room.state.spectatorCount).toBe(1);
  });

  test("spectator leave does not affect human beyblade", () => {
    room.onLeave(makeClient("spec-1"));
    expect(room.state.beyblades.get("human-1")?.isActive).toBe(true);
  });
});

describe("AIBattleRoom — room disposal when human leaves", () => {
  test("room disposes when human player leaves (even with spectators present)", () => {
    const room = new AIBattleRoomStub();
    room.createAI();
    room.onJoin(makeClient("human-1"));
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });

    room.onLeave(makeClient("human-1"));

    expect(room.disposed).toBe(true);
  });

  test("room does NOT dispose when a spectator leaves", () => {
    const room = new AIBattleRoomStub();
    room.createAI();
    room.onJoin(makeClient("human-1"));
    room.onJoin(makeClient("spec-1"), { spectate: true });

    room.onLeave(makeClient("spec-1"));

    expect(room.disposed).toBe(false);
  });
});

describe("AIBattleRoom — human slot cap", () => {
  test("second human player is rejected", () => {
    const room = new AIBattleRoomStub();
    room.createAI();
    room.onJoin(makeClient("human-1"));
    const second = makeClient("human-2");
    room.onJoin(second);
    expect(second.rejectedCode).toBe(4000);
    // Only original human + AI in beyblades
    expect(room.state.beyblades.size).toBe(2);
  });
});

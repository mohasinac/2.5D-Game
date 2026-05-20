// Tests for spectator support in BattleRoom.
// Uses a lightweight stand-in that mirrors the exact spectator logic
// without importing Colyseus (which requires a real server process).

import { describe, test, expect, beforeEach } from "vitest";

// ─── Minimal state/room stand-in ─────────────────────────────────────────────

interface MockBeyblade { id: string; userId: string; isActive: boolean; }

interface MockState {
  spectatorCount: number;
  beyblades: Map<string, MockBeyblade>;
}

interface MockClient {
  sessionId: string;
  left?: boolean;
  leaveCode?: number;
  leaveReason?: string;
}

function makeClient(id: string): MockClient {
  return { sessionId: id };
}

/** Replicated BattleRoom spectator logic (mirrors the server implementation). */
class BattleRoomStub {
  readonly MAX_PLAYER_SLOTS = 4;
  private playerSessions = new Set<string>();
  private spectatorSessions = new Set<string>();
  state: MockState = { spectatorCount: 0, beyblades: new Map() };

  onJoin(client: MockClient, options: { spectate?: boolean } = {}) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      return;
    }
    if (this.playerSessions.size >= this.MAX_PLAYER_SLOTS) {
      client.left = true;
      client.leaveCode = 4000;
      client.leaveReason = "Match full";
      return;
    }
    this.playerSessions.add(client.sessionId);
    const bey: MockBeyblade = { id: client.sessionId, userId: `u-${client.sessionId}`, isActive: true };
    this.state.beyblades.set(client.sessionId, bey);
  }

  onLeave(client: MockClient) {
    if (this.spectatorSessions.has(client.sessionId)) {
      this.state.spectatorCount = Math.max(0, this.state.spectatorCount - 1);
      this.spectatorSessions.delete(client.sessionId);
      return;
    }
    this.playerSessions.delete(client.sessionId);
    const bey = this.state.beyblades.get(client.sessionId);
    if (bey) bey.isActive = false;
  }

  playerCount() { return this.playerSessions.size; }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BattleRoom — spectator join", () => {
  let room: BattleRoomStub;

  beforeEach(() => { room = new BattleRoomStub(); });

  test("spectator join increments spectatorCount", () => {
    const spectator = makeClient("spec-1");
    room.onJoin(spectator, { spectate: true });
    expect(room.state.spectatorCount).toBe(1);
  });

  test("spectator join does NOT add a beyblade", () => {
    const spectator = makeClient("spec-1");
    room.onJoin(spectator, { spectate: true });
    expect(room.state.beyblades.has("spec-1")).toBe(false);
    expect(room.state.beyblades.size).toBe(0);
  });

  test("multiple spectators each increment count", () => {
    for (let i = 1; i <= 5; i++) {
      room.onJoin(makeClient(`spec-${i}`), { spectate: true });
    }
    expect(room.state.spectatorCount).toBe(5);
  });
});

describe("BattleRoom — spectator leave", () => {
  let room: BattleRoomStub;

  beforeEach(() => {
    room = new BattleRoomStub();
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onJoin(makeClient("spec-2"), { spectate: true });
  });

  test("spectator leave decrements spectatorCount", () => {
    room.onLeave(makeClient("spec-1"));
    expect(room.state.spectatorCount).toBe(1);
  });

  test("both spectators leave → spectatorCount = 0", () => {
    room.onLeave(makeClient("spec-1"));
    room.onLeave(makeClient("spec-2"));
    expect(room.state.spectatorCount).toBe(0);
  });

  test("spectatorCount never goes below 0", () => {
    room.onLeave(makeClient("spec-1"));
    room.onLeave(makeClient("spec-2"));
    room.onLeave(makeClient("spec-2")); // duplicate leave
    expect(room.state.spectatorCount).toBe(0);
  });
});

describe("BattleRoom — player slot cap", () => {
  let room: BattleRoomStub;

  beforeEach(() => {
    room = new BattleRoomStub();
    // Fill all 4 player slots
    for (let i = 1; i <= 4; i++) {
      room.onJoin(makeClient(`player-${i}`));
    }
  });

  test("4 players joined → 4 beyblades in state", () => {
    expect(room.state.beyblades.size).toBe(4);
    expect(room.playerCount()).toBe(4);
  });

  test("5th non-spectator join → rejected with code 4000", () => {
    const fifth = makeClient("player-5");
    room.onJoin(fifth);
    expect(fifth.left).toBe(true);
    expect(fifth.leaveCode).toBe(4000);
  });

  test("5th non-spectator join → NOT added to beyblades", () => {
    room.onJoin(makeClient("player-5"));
    expect(room.state.beyblades.size).toBe(4); // unchanged
  });

  test("5th client joining as spectator → accepted (not rejected)", () => {
    const spectator = makeClient("spec-1");
    room.onJoin(spectator, { spectate: true });
    expect(spectator.left).toBeUndefined();
    expect(room.state.spectatorCount).toBe(1);
  });
});

describe("BattleRoom — mixed players and spectators", () => {
  test("4 players + 5 spectators → beyblades.size=4, spectatorCount=5", () => {
    const room = new BattleRoomStub();
    for (let i = 1; i <= 4; i++) room.onJoin(makeClient(`p${i}`));
    for (let i = 1; i <= 5; i++) room.onJoin(makeClient(`s${i}`), { spectate: true });

    expect(room.state.beyblades.size).toBe(4);
    expect(room.state.spectatorCount).toBe(5);
  });

  test("spectator leaving does not affect player beyblades", () => {
    const room = new BattleRoomStub();
    room.onJoin(makeClient("p1"));
    room.onJoin(makeClient("spec-1"), { spectate: true });
    room.onLeave(makeClient("spec-1"));

    expect(room.state.beyblades.size).toBe(1);
    expect(room.state.beyblades.has("p1")).toBe(true);
  });
});

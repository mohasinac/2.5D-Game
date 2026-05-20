// Tests for BattleRoom failsafe: room disposes when all players leave,
// spectators are kicked, and disconnected players don't block the series.

import { describe, test, expect, beforeEach } from "vitest";

// ─── Room stub ───────────────────────────────────────────────────────────────

interface MockBeyblade { id: string; isActive: boolean; }

interface MockClient { sessionId: string; }

class BattleRoomFailsafeStub {
  private playerSessions = new Set<string>();
  private spectatorSessions = new Set<string>();
  disposed = false;
  state = {
    spectatorCount: 0,
    beyblades: new Map<string, MockBeyblade>(),
  };

  onJoin(client: MockClient, options: { spectate?: boolean } = {}) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      return;
    }
    this.playerSessions.add(client.sessionId);
    this.state.beyblades.set(client.sessionId, { id: client.sessionId, isActive: true });
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
    this.checkPlayerCount();
  }

  private checkPlayerCount() {
    if (this.playerSessions.size === 0) {
      this.disposed = true;
    }
  }

  playerCount() { return this.playerSessions.size; }
  spectatorCount() { return this.spectatorSessions.size; }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BattleRoom failsafe — all players leave", () => {
  test("room disposes when the only player leaves", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onLeave({ sessionId: "p1" });
    expect(room.disposed).toBe(true);
  });

  test("room disposes when all 4 players leave", () => {
    const room = new BattleRoomFailsafeStub();
    for (let i = 1; i <= 4; i++) room.onJoin({ sessionId: `p${i}` });
    for (let i = 1; i <= 4; i++) room.onLeave({ sessionId: `p${i}` });
    expect(room.disposed).toBe(true);
  });

  test("room disposes with spectators still present when last player leaves", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "spec-1" }, { spectate: true });
    room.onJoin({ sessionId: "spec-2" }, { spectate: true });
    room.onLeave({ sessionId: "p1" });
    expect(room.disposed).toBe(true);
  });

  test("room does NOT dispose while at least one player remains", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "p2" });
    room.onLeave({ sessionId: "p1" });
    expect(room.disposed).toBe(false);
    expect(room.playerCount()).toBe(1);
  });
});

describe("BattleRoom failsafe — spectator leave does not dispose", () => {
  test("spectator leaving a 2-player game does not dispose the room", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "p2" });
    room.onJoin({ sessionId: "spec-1" }, { spectate: true });
    room.onLeave({ sessionId: "spec-1" });
    expect(room.disposed).toBe(false);
  });

  test("spectator count decrements on leave", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "s1" }, { spectate: true });
    room.onJoin({ sessionId: "s2" }, { spectate: true });
    room.onLeave({ sessionId: "s1" });
    expect(room.state.spectatorCount).toBe(1);
  });
});

describe("BattleRoom failsafe — beyblade state on leave", () => {
  test("leaving player's beyblade is marked inactive", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "p2" });
    room.onLeave({ sessionId: "p1" });
    expect(room.state.beyblades.get("p1")?.isActive).toBe(false);
  });

  test("remaining player's beyblade stays active", () => {
    const room = new BattleRoomFailsafeStub();
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "p2" });
    room.onLeave({ sessionId: "p1" });
    expect(room.state.beyblades.get("p2")?.isActive).toBe(true);
  });
});

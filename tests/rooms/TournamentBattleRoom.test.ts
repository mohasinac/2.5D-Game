// Tests for TournamentBattleRoom logic.
// Stubs replicate the room's join/leave/spectator/schema logic without Colyseus.

import { describe, test, expect, beforeEach, vi } from "vitest";

// ─── Minimal types ────────────────────────────────────────────────────────────

interface MockBeyblade {
  id: string;
  userId: string;
  username: string;
  isActive: boolean;
  isAI: boolean;
}

interface MockTournamentState {
  tournamentId: string;
  tournamentName: string;
  roundNumber: number;
  tournamentMatchId: string;
  spectatorCount: number;
  beyblades: Map<string, MockBeyblade>;
}

interface MockClient {
  sessionId: string;
  leaveCode?: number;
  leaveReason?: string;
}

// ─── TournamentBattleRoom stub ────────────────────────────────────────────────

class TournamentBattleRoomStub {
  readonly MAX_PLAYER_SLOTS = 2;

  state: MockTournamentState = {
    tournamentId: "",
    tournamentName: "",
    roundNumber: 0,
    tournamentMatchId: "",
    spectatorCount: 0,
    beyblades: new Map(),
  };

  private playerSessions = new Set<string>();
  private spectatorSessions = new Set<string>();

  onMatchEnd: ((winnerId: string, matchFirestoreId: string) => void) | null = null;

  // Simulate onCreate with tournament metadata
  create(options: {
    tournamentId?: string;
    tournamentName?: string;
    roundNumber?: number;
    matchId?: string;
    aiParticipants?: Array<{ userId: string; username: string; beybladeId: string; difficulty: string }>;
  }) {
    this.state.tournamentId = options.tournamentId ?? "";
    this.state.tournamentName = options.tournamentName ?? "";
    this.state.roundNumber = options.roundNumber ?? 0;
    this.state.tournamentMatchId = options.matchId ?? "";

    // AI participants are created immediately in onCreate
    for (const ai of options.aiParticipants ?? []) {
      const bey: MockBeyblade = {
        id: ai.userId,
        userId: ai.userId,
        username: ai.username,
        isActive: true,
        isAI: true,
      };
      this.state.beyblades.set(ai.userId, bey);
      this.playerSessions.add(ai.userId);
    }
  }

  onJoin(client: MockClient, options: { spectate?: boolean; userId?: string; username?: string } = {}) {
    if (options.spectate) {
      this.state.spectatorCount++;
      this.spectatorSessions.add(client.sessionId);
      return;
    }
    if (this.playerSessions.size >= this.MAX_PLAYER_SLOTS) {
      client.leaveCode = 4000;
      client.leaveReason = "Match full";
      return;
    }
    this.playerSessions.add(client.sessionId);
    const bey: MockBeyblade = {
      id: client.sessionId,
      userId: options.userId ?? client.sessionId,
      username: options.username ?? "Player",
      isActive: true,
      isAI: false,
    };
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

  simulateMatchEnd(winnerId: string, matchFirestoreId: string) {
    this.onMatchEnd?.(winnerId, matchFirestoreId);
  }

  playerCount() { return this.playerSessions.size; }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TournamentBattleRoom — schema fields populated on create", () => {
  test("tournamentId, roundNumber, tournamentMatchId set from options", () => {
    const room = new TournamentBattleRoomStub();
    room.create({ tournamentId: "t1", tournamentName: "Grand Prix", roundNumber: 2, matchId: "r2m1" });
    expect(room.state.tournamentId).toBe("t1");
    expect(room.state.tournamentName).toBe("Grand Prix");
    expect(room.state.roundNumber).toBe(2);
    expect(room.state.tournamentMatchId).toBe("r2m1");
  });
});

describe("TournamentBattleRoom — AI participants created in onCreate", () => {
  test("AI beyblades present before any human joins", () => {
    const room = new TournamentBattleRoomStub();
    room.create({
      aiParticipants: [
        { userId: "__ai__1", username: "AI #1", beybladeId: "bey1", difficulty: "medium" },
      ],
    });
    expect(room.state.beyblades.size).toBe(1);
    expect(room.state.beyblades.get("__ai__1")?.isAI).toBe(true);
  });

  test("two AI participants occupy both player slots", () => {
    const room = new TournamentBattleRoomStub();
    room.create({
      aiParticipants: [
        { userId: "__ai__1", username: "AI #1", beybladeId: "bey1", difficulty: "hard" },
        { userId: "__ai__2", username: "AI #2", beybladeId: "bey2", difficulty: "hard" },
      ],
    });
    expect(room.state.beyblades.size).toBe(2);
    expect(room.playerCount()).toBe(2);
  });
});

describe("TournamentBattleRoom — spectator join / leave", () => {
  let room: TournamentBattleRoomStub;

  beforeEach(() => {
    room = new TournamentBattleRoomStub();
    room.create({});
  });

  test("spectator join increments spectatorCount, no beyblade added", () => {
    const spectator = { sessionId: "spec-1" };
    room.onJoin(spectator, { spectate: true });
    expect(room.state.spectatorCount).toBe(1);
    expect(room.state.beyblades.has("spec-1")).toBe(false);
  });

  test("spectator leave decrements spectatorCount", () => {
    const spectator = { sessionId: "spec-1" };
    room.onJoin(spectator, { spectate: true });
    room.onLeave(spectator);
    expect(room.state.spectatorCount).toBe(0);
  });

  test("spectatorCount never goes negative", () => {
    const spectator = { sessionId: "spec-1" };
    room.onJoin(spectator, { spectate: true });
    room.onLeave(spectator);
    room.onLeave(spectator); // duplicate
    expect(room.state.spectatorCount).toBe(0);
  });
});

describe("TournamentBattleRoom — player slot cap at 2", () => {
  let room: TournamentBattleRoomStub;

  beforeEach(() => {
    room = new TournamentBattleRoomStub();
    room.create({});
    room.onJoin({ sessionId: "p1" });
    room.onJoin({ sessionId: "p2" });
  });

  test("2 players joined → 2 beyblades", () => {
    expect(room.state.beyblades.size).toBe(2);
  });

  test("3rd player join → rejected with code 4000", () => {
    const third: MockClient = { sessionId: "p3" };
    room.onJoin(third);
    expect(third.leaveCode).toBe(4000);
  });

  test("3rd player join → NOT added to beyblades", () => {
    room.onJoin({ sessionId: "p3" });
    expect(room.state.beyblades.size).toBe(2);
  });

  test("spectator after 2 players → accepted", () => {
    const spectator: MockClient = { sessionId: "spec-1" };
    room.onJoin(spectator, { spectate: true });
    expect(spectator.leaveCode).toBeUndefined();
    expect(room.state.spectatorCount).toBe(1);
  });
});

describe("TournamentBattleRoom — match end triggers onMatchEnd callback", () => {
  test("onMatchEnd is called with winnerId and matchFirestoreId", () => {
    const room = new TournamentBattleRoomStub();
    room.create({ matchId: "r1m1" });

    const callback = vi.fn();
    room.onMatchEnd = callback;

    room.simulateMatchEnd("user-abc", "firestore-match-xyz");

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("user-abc", "firestore-match-xyz");
  });

  test("no crash if onMatchEnd is null", () => {
    const room = new TournamentBattleRoomStub();
    room.create({});
    expect(() => room.simulateMatchEnd("user-abc", "m1")).not.toThrow();
  });
});

describe("TournamentBattleRoom — AI Exhibition (all AI, human spectates)", () => {
  test("two AI beyblades exist before human spectator joins", () => {
    const room = new TournamentBattleRoomStub();
    room.create({
      tournamentId: "exhibition-1",
      aiParticipants: [
        { userId: "__ai__1", username: "AI Alpha", beybladeId: "bey1", difficulty: "hard" },
        { userId: "__ai__2", username: "AI Beta",  beybladeId: "bey2", difficulty: "hard" },
      ],
    });

    const human: MockClient = { sessionId: "human-1" };
    room.onJoin(human, { spectate: true });

    expect(room.state.beyblades.size).toBe(2); // only AI beyblades
    expect(room.state.spectatorCount).toBe(1);
    expect(room.state.beyblades.has("human-1")).toBe(false);
  });
});

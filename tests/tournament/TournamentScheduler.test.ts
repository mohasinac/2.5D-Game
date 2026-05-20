// Tests for TournamentScheduler logic (no real Colyseus / Firestore).
// Uses stubs that replicate scheduling decisions and stale-guard checks.

import { describe, test, expect, beforeEach, vi } from "vitest";

// ─── Types (replicate relevant subsets) ──────────────────────────────────────

interface TournamentMatchDoc {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  scheduledTime: { _seconds: number };
  status: "pending" | "room-opening" | "in-progress" | "completed" | "bye";
  participant1Id: string;
  participant2Id: string;
  participant1BeybladeId: string;
  participant2BeybladeId: string;
  winnerId: string | null;
  colyseusRoomId: string;
  arenaId: string;
  matchFirestoreId: string;
}

// ─── Scheduler logic stubs ────────────────────────────────────────────────────

const LOOK_AHEAD_MS = 65_000;
const STALE_THRESHOLD_MS = 5 * 60_000;

/** Returns matches whose scheduledTime is within LOOK_AHEAD_MS of now and status=pending. */
function getUpcomingPending(matches: TournamentMatchDoc[], nowMs: number): TournamentMatchDoc[] {
  return matches.filter(
    (m) =>
      m.status === "pending" &&
      m.scheduledTime._seconds * 1000 <= nowMs + LOOK_AHEAD_MS
  );
}

/** Returns matches stuck in "room-opening" past the stale threshold. */
function getStaleRoomOpening(matches: TournamentMatchDoc[], nowMs: number): TournamentMatchDoc[] {
  return matches.filter(
    (m) =>
      m.status === "room-opening" &&
      m.scheduledTime._seconds * 1000 < nowMs - STALE_THRESHOLD_MS
  );
}

/** Simulate advancing round — returns which participant slot was filled. */
function advanceRound(
  allMatches: TournamentMatchDoc[],
  completedRound: number,
  completedMatchNumber: number,
  winnerParticipantId: string,
  totalRounds: number
): { nextMatchId: string | null; slot: "participant1Id" | "participant2Id" | null } {
  if (completedRound >= totalRounds) return { nextMatchId: null, slot: null };

  const nextRound = completedRound + 1;
  const nextMatchNumber = Math.ceil(completedMatchNumber / 2);
  const nextMatch = allMatches.find(
    (m) => m.round === nextRound && m.matchNumber === nextMatchNumber
  );
  if (!nextMatch) return { nextMatchId: null, slot: null };

  // Odd-numbered match feeds into participant1Id slot, even into participant2Id
  const slot: "participant1Id" | "participant2Id" =
    completedMatchNumber % 2 === 1 ? "participant1Id" : "participant2Id";
  (nextMatch as any)[slot] = winnerParticipantId;
  return { nextMatchId: nextMatch.id, slot };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nowSeconds() { return Math.floor(Date.now() / 1000); }

function makeMatch(
  override: Partial<TournamentMatchDoc> & { id: string }
): TournamentMatchDoc {
  return {
    tournamentId: "t1",
    round: 1,
    matchNumber: 1,
    scheduledTime: { _seconds: nowSeconds() + 100 },
    status: "pending",
    participant1Id: "p1",
    participant2Id: "p2",
    participant1BeybladeId: "",
    participant2BeybladeId: "",
    winnerId: null,
    colyseusRoomId: "",
    arenaId: "default",
    matchFirestoreId: "",
    ...override,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TournamentScheduler — upcoming pending match selection", () => {
  const now = Date.now();

  test("selects match scheduled within 65s window", () => {
    const match = makeMatch({ id: "m1", scheduledTime: { _seconds: Math.floor((now + 30_000) / 1000) } });
    const result = getUpcomingPending([match], now);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("m1");
  });

  test("skips match with status=room-opening", () => {
    const match = makeMatch({ id: "m1", status: "room-opening", scheduledTime: { _seconds: Math.floor((now + 30_000) / 1000) } });
    expect(getUpcomingPending([match], now)).toHaveLength(0);
  });

  test("skips match with status=completed", () => {
    const match = makeMatch({ id: "m1", status: "completed", scheduledTime: { _seconds: Math.floor((now + 30_000) / 1000) } });
    expect(getUpcomingPending([match], now)).toHaveLength(0);
  });

  test("skips match scheduled beyond the 65s look-ahead window", () => {
    const match = makeMatch({ id: "m1", scheduledTime: { _seconds: Math.floor((now + 120_000) / 1000) } });
    expect(getUpcomingPending([match], now)).toHaveLength(0);
  });

  test("selects match scheduled in the past (overdue)", () => {
    const match = makeMatch({ id: "m1", scheduledTime: { _seconds: Math.floor((now - 10_000) / 1000) } });
    expect(getUpcomingPending([match], now)).toHaveLength(1);
  });

  test("selects multiple matches within window", () => {
    const matches = [
      makeMatch({ id: "m1", matchNumber: 1, scheduledTime: { _seconds: Math.floor((now + 10_000) / 1000) } }),
      makeMatch({ id: "m2", matchNumber: 2, scheduledTime: { _seconds: Math.floor((now + 50_000) / 1000) } }),
    ];
    expect(getUpcomingPending(matches, now)).toHaveLength(2);
  });
});

describe("TournamentScheduler — stale room-opening guard", () => {
  const now = Date.now();

  test("identifies match stuck in room-opening past 5 min", () => {
    const match = makeMatch({
      id: "m1",
      status: "room-opening",
      scheduledTime: { _seconds: Math.floor((now - 6 * 60_000) / 1000) },
    });
    const stale = getStaleRoomOpening([match], now);
    expect(stale).toHaveLength(1);
    expect(stale[0].id).toBe("m1");
  });

  test("does NOT flag room-opening match that is recent", () => {
    const match = makeMatch({
      id: "m1",
      status: "room-opening",
      scheduledTime: { _seconds: Math.floor((now - 60_000) / 1000) },
    });
    expect(getStaleRoomOpening([match], now)).toHaveLength(0);
  });

  test("does NOT flag pending match regardless of age", () => {
    const match = makeMatch({
      id: "m1",
      status: "pending",
      scheduledTime: { _seconds: Math.floor((now - 10 * 60_000) / 1000) },
    });
    expect(getStaleRoomOpening([match], now)).toHaveLength(0);
  });
});

describe("TournamentScheduler — advanceRound", () => {
  let matches: TournamentMatchDoc[];

  beforeEach(() => {
    // 4-person bracket: 2 R1 matches → 1 R2 match
    matches = [
      makeMatch({ id: "r1m1", round: 1, matchNumber: 1, participant1Id: "p1", participant2Id: "p2" }),
      makeMatch({ id: "r1m2", round: 1, matchNumber: 2, participant1Id: "p3", participant2Id: "p4" }),
      makeMatch({ id: "r2m1", round: 2, matchNumber: 1, participant1Id: "", participant2Id: "" }),
    ];
  });

  test("R1M1 winner fills participant1Id slot in R2M1", () => {
    const { nextMatchId, slot } = advanceRound(matches, 1, 1, "p1", 2);
    const r2m1 = matches.find((m) => m.id === "r2m1")!;
    expect(nextMatchId).toBe("r2m1");
    expect(slot).toBe("participant1Id");
    expect(r2m1.participant1Id).toBe("p1");
  });

  test("R1M2 winner fills participant2Id slot in R2M1", () => {
    const { nextMatchId, slot } = advanceRound(matches, 1, 2, "p3", 2);
    const r2m1 = matches.find((m) => m.id === "r2m1")!;
    expect(nextMatchId).toBe("r2m1");
    expect(slot).toBe("participant2Id");
    expect(r2m1.participant2Id).toBe("p3");
  });

  test("final round winner returns null nextMatchId", () => {
    const { nextMatchId } = advanceRound(matches, 2, 1, "p1", 2);
    expect(nextMatchId).toBeNull();
  });
});

describe("TournamentScheduler — room cap enforcement", () => {
  test("returns early if active room count >= 20", () => {
    let pollWasSkipped = false;

    const mockGetActiveRoomCount = () => 20;

    function pollWithCapCheck(activeCount: number): boolean {
      if (activeCount >= 20) { pollWasSkipped = true; return false; }
      return true;
    }

    expect(pollWithCapCheck(mockGetActiveRoomCount())).toBe(false);
    expect(pollWasSkipped).toBe(true);
  });

  test("proceeds if active room count is below 20", () => {
    function pollWithCapCheck(activeCount: number): boolean {
      return activeCount < 20;
    }
    expect(pollWithCapCheck(19)).toBe(true);
    expect(pollWithCapCheck(0)).toBe(true);
  });
});

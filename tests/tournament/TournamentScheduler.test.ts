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

describe("TournamentScheduler — registration finalisation", () => {
  interface FakeTournament {
    id: string;
    status: "registration" | "in-progress" | "cancelled";
    minParticipants: number;
    maxParticipants: 2 | 4 | 8;
    autoFillWithAI: boolean;
    registrationDeadlineMs: number;
  }
  interface FakeParticipant { id: string; status: "registered" | "quit"; isAI: boolean; ready?: boolean; }

  const DEFAULT_MIN = 2;

  /** Replicates the scheduler's processRegistrationFinalisation decision tree. */
  function evaluate(
    t: FakeTournament,
    participants: FakeParticipant[],
    nowMs: number
  ):
    | { action: "noop" }
    | { action: "cancel"; reason: string }
    | { action: "finalise"; startNow: boolean; padToMax: boolean } {
    const registered = participants.filter((p) => p.status === "registered");
    const min = t.minParticipants ?? DEFAULT_MIN;
    const deadlinePassed = nowMs >= t.registrationDeadlineMs;
    const allReady =
      registered.length >= min &&
      registered.every((p) => p.isAI || p.ready === true);

    if (!deadlinePassed && !allReady) return { action: "noop" };

    if (deadlinePassed && registered.length < min) {
      return { action: "cancel", reason: `Insufficient participants (${registered.length}/${min})` };
    }
    return {
      action: "finalise",
      startNow: allReady && !deadlinePassed,
      padToMax: t.autoFillWithAI && registered.length < t.maxParticipants,
    };
  }

  const baseTournament = (override: Partial<FakeTournament> = {}): FakeTournament => ({
    id: "t1",
    status: "registration",
    minParticipants: 2,
    maxParticipants: 4,
    autoFillWithAI: true,
    registrationDeadlineMs: Date.now() + 60_000,
    ...override,
  });

  test("noop when deadline not passed and not all-ready", () => {
    const t = baseTournament();
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false, ready: false },
    ];
    expect(evaluate(t, ps, Date.now()).action).toBe("noop");
  });

  test("cancels when deadline passes with fewer than minParticipants registered", () => {
    const t = baseTournament({ registrationDeadlineMs: Date.now() - 1_000, minParticipants: 4 });
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false },
      { id: "b", status: "registered", isAI: false },
    ];
    const result = evaluate(t, ps, Date.now());
    expect(result.action).toBe("cancel");
  });

  test("finalises with AI padding when autoFillWithAI=true and short of maxParticipants", () => {
    const t = baseTournament({ registrationDeadlineMs: Date.now() - 1_000, autoFillWithAI: true });
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false },
      { id: "b", status: "registered", isAI: false },
    ];
    const result = evaluate(t, ps, Date.now());
    expect(result.action).toBe("finalise");
    if (result.action === "finalise") {
      expect(result.padToMax).toBe(true);
      expect(result.startNow).toBe(false);
    }
  });

  test("auto-starts immediately when every non-AI participant is ready", () => {
    const t = baseTournament();
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false, ready: true },
      { id: "b", status: "registered", isAI: false, ready: true },
    ];
    const result = evaluate(t, ps, Date.now());
    expect(result.action).toBe("finalise");
    if (result.action === "finalise") {
      expect(result.startNow).toBe(true);
    }
  });

  test("AI participants count as ready for the all-ready check", () => {
    const t = baseTournament();
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false, ready: true },
      { id: "b", status: "registered", isAI: true /* ready flag omitted */ },
    ];
    expect(evaluate(t, ps, Date.now()).action).toBe("finalise");
  });

  test("does NOT auto-start when one human is unready and deadline not passed", () => {
    const t = baseTournament();
    const ps: FakeParticipant[] = [
      { id: "a", status: "registered", isAI: false, ready: true },
      { id: "b", status: "registered", isAI: false, ready: false },
    ];
    expect(evaluate(t, ps, Date.now()).action).toBe("noop");
  });

  test("ignores quit participants when counting min threshold", () => {
    const t = baseTournament({ registrationDeadlineMs: Date.now() - 1_000, minParticipants: 2 });
    const ps: FakeParticipant[] = [
      { id: "a", status: "quit", isAI: false },
      { id: "b", status: "registered", isAI: false },
    ];
    expect(evaluate(t, ps, Date.now()).action).toBe("cancel");
  });
});

describe("TournamentScheduler — no-show walkover at match time", () => {
  const GRACE = 60_000;

  interface FakeParticipant { id: string; isAI: boolean; ready?: boolean; }
  interface FakeMatch {
    scheduledMs: number;
    p1: FakeParticipant;
    p2: FakeParticipant;
    readyState: Record<string, boolean>;
  }

  /** Mirror of the scheduler's pre-room no-show check. */
  function check(match: FakeMatch, nowMs: number) {
    const pastGrace = nowMs > match.scheduledMs + GRACE;
    const isPresent = (p: FakeParticipant) =>
      p.isAI || match.readyState[p.id] === true || p.ready === true;
    const p1 = isPresent(match.p1);
    const p2 = isPresent(match.p2);
    if (!pastGrace || (p1 && p2)) return { action: "open" } as const;
    if (!p1 && !p2) return { action: "double-walkover" } as const;
    return { action: "walkover", winner: p1 ? match.p1.id : match.p2.id } as const;
  }

  const base = (): FakeMatch => ({
    scheduledMs: Date.now() - 120_000,
    p1: { id: "p1", isAI: false },
    p2: { id: "p2", isAI: false },
    readyState: {},
  });

  test("opens room when both sides ready in match-level readyState", () => {
    const m = base();
    m.readyState = { p1: true, p2: true };
    expect(check(m, Date.now()).action).toBe("open");
  });

  test("opens room when grace not yet passed even if both unready", () => {
    const m = base();
    m.scheduledMs = Date.now() - 30_000; // within grace
    expect(check(m, Date.now()).action).toBe("open");
  });

  test("walkover when one human absent past grace", () => {
    const m = base();
    m.readyState = { p1: true };
    const r = check(m, Date.now());
    expect(r.action).toBe("walkover");
    if (r.action === "walkover") expect(r.winner).toBe("p1");
  });

  test("tournament-level participant.ready counts as presence", () => {
    const m = base();
    m.p1.ready = true;
    m.p2.ready = true;
    expect(check(m, Date.now()).action).toBe("open");
  });

  test("AI participants are always considered present", () => {
    const m = base();
    m.p2.isAI = true;
    m.readyState = { p1: true };
    expect(check(m, Date.now()).action).toBe("open");
  });

  test("double walkover when both human sides absent past grace", () => {
    const m = base();
    expect(check(m, Date.now()).action).toBe("double-walkover");
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

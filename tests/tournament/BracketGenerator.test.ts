import { describe, test, expect, beforeAll, vi } from "vitest";

// ─── Firestore mock ───────────────────────────────────────────────────────────

vi.mock("firebase-admin", () => {
  const batch = { set: vi.fn(), commit: vi.fn().mockResolvedValue(undefined) };
  const firestoreInstance = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    batch: vi.fn().mockReturnValue(batch),
  };
  return {
    apps: [],
    credential: { cert: vi.fn() },
    initializeApp: vi.fn(),
    firestore: Object.assign(() => firestoreInstance, {
      FieldPath: { documentId: vi.fn() },
      FieldValue: { serverTimestamp: vi.fn().mockReturnValue("SERVER_TS") },
      Timestamp: { fromDate: (d: Date) => ({ toDate: () => d, _seconds: d.getTime() / 1000 }) },
    }),
  };
});

vi.mock("../../server/utils/tournamentFirebase", () => ({}));
vi.mock("../../server/utils/firebase", () => ({ db: {} }));

import {
  generateBracketMatchups,
  advanceWinnerToNextRound,
  type BracketMatchup,
} from "../../server/tournament/BracketGenerator";

const BASE_TIME = new Date("2026-06-01T10:00:00Z");

// ─── generateBracketMatchups — 2 participants ─────────────────────────────────

describe("generateBracketMatchups — 2 participants", () => {
  test("produces exactly 1 match", () => {
    const matchups = generateBracketMatchups(2, 2, BASE_TIME, 15);
    expect(matchups).toHaveLength(1);
  });

  test("match is round 1, matchNumber 1", () => {
    const matchups = generateBracketMatchups(2, 2, BASE_TIME, 15);
    expect(matchups[0].round).toBe(1);
    expect(matchups[0].matchNumber).toBe(1);
  });

  test("no bye — both seeds present and not 'bye'", () => {
    const matchups = generateBracketMatchups(2, 2, BASE_TIME, 15);
    expect(matchups[0].participant1Seed).toBe(1);
    expect(matchups[0].participant2Seed).toBe(2);
  });

  test("scheduled at BASE_TIME", () => {
    const matchups = generateBracketMatchups(2, 2, BASE_TIME, 15);
    expect(matchups[0].scheduledTime.getTime()).toBe(BASE_TIME.getTime());
  });
});

// ─── generateBracketMatchups — 4 participants ─────────────────────────────────

describe("generateBracketMatchups — 4 participants", () => {
  let matchups: BracketMatchup[];

  beforeAll(() => {
    matchups = generateBracketMatchups(4, 4, BASE_TIME, 10);
  });

  test("produces 3 total docs (2 R1 + 1 R2)", () => {
    expect(matchups).toHaveLength(3);
  });

  test("2 docs in round 1, 1 doc in round 2", () => {
    expect(matchups.filter((m) => m.round === 1)).toHaveLength(2);
    expect(matchups.filter((m) => m.round === 2)).toHaveLength(1);
  });

  test("R1 seeding: 1v4 and 2v3", () => {
    const r1 = matchups
      .filter((m) => m.round === 1)
      .map((m) => [m.participant1Seed, m.participant2Seed].sort((a, b) => (a as number) - (b as number)));
    expect(r1).toContainEqual([1, 4]);
    expect(r1).toContainEqual([2, 3]);
  });

  test("R2 doc has TBD seeds (0)", () => {
    const r2 = matchups.find((m) => m.round === 2)!;
    expect(r2.participant1Seed).toBe(0);
    expect(r2.participant2Seed).toBe(0);
  });

  test("R2 scheduled 10 minutes after R1", () => {
    const r1 = matchups.find((m) => m.round === 1)!;
    const r2 = matchups.find((m) => m.round === 2)!;
    expect(r2.scheduledTime.getTime() - r1.scheduledTime.getTime()).toBe(10 * 60 * 1000);
  });
});

// ─── generateBracketMatchups — 8 participants ─────────────────────────────────

describe("generateBracketMatchups — 8 participants", () => {
  let matchups: BracketMatchup[];

  beforeAll(() => {
    matchups = generateBracketMatchups(8, 8, BASE_TIME, 15);
  });

  test("produces 7 total docs (4 R1 + 2 R2 + 1 R3)", () => {
    expect(matchups).toHaveLength(7);
  });

  test("correct match counts per round", () => {
    expect(matchups.filter((m) => m.round === 1)).toHaveLength(4);
    expect(matchups.filter((m) => m.round === 2)).toHaveLength(2);
    expect(matchups.filter((m) => m.round === 3)).toHaveLength(1);
  });

  test("standard seeding: 1v8, 4v5, 2v7, 3v6 in R1", () => {
    const r1 = matchups.filter((m) => m.round === 1);
    const seedPairs = r1.map((m) =>
      [m.participant1Seed, m.participant2Seed as number].sort((a, b) => a - b)
    );
    expect(seedPairs).toContainEqual([1, 8]);
    expect(seedPairs).toContainEqual([4, 5]);
    expect(seedPairs).toContainEqual([2, 7]);
    expect(seedPairs).toContainEqual([3, 6]);
  });

  test("R1 matches are staggered 5 minutes apart", () => {
    const r1 = matchups
      .filter((m) => m.round === 1)
      .sort((a, b) => a.matchNumber - b.matchNumber);
    const base = r1[0].scheduledTime.getTime();
    expect(r1[1].scheduledTime.getTime()).toBe(base + 5 * 60_000);
    expect(r1[2].scheduledTime.getTime()).toBe(base + 10 * 60_000);
    expect(r1[3].scheduledTime.getTime()).toBe(base + 15 * 60_000);
  });
});

// ─── generateBracketMatchups — byes (3 of 4 slots filled) ─────────────────────

describe("generateBracketMatchups — byes (3 participants, maxParticipants=4)", () => {
  test("one R1 match has participant2Seed='bye'", () => {
    const matchups = generateBracketMatchups(3, 4, BASE_TIME, 10);
    const byeMatch = matchups.find((m) => m.participant2Seed === "bye");
    expect(byeMatch).toBeDefined();
  });

  test("the non-bye R1 match has valid seeds", () => {
    const matchups = generateBracketMatchups(3, 4, BASE_TIME, 10);
    const normalMatch = matchups.find(
      (m) => m.round === 1 && m.participant2Seed !== "bye"
    );
    expect(normalMatch).toBeDefined();
    expect(typeof normalMatch!.participant1Seed).toBe("number");
    expect(typeof normalMatch!.participant2Seed).toBe("number");
  });

  test("R2 doc still present (3 total matchups)", () => {
    const matchups = generateBracketMatchups(3, 4, BASE_TIME, 10);
    expect(matchups).toHaveLength(3);
    expect(matchups.filter((m) => m.round === 2)).toHaveLength(1);
  });
});

// ─── advanceWinnerToNextRound ─────────────────────────────────────────────────

describe("advanceWinnerToNextRound", () => {
  test("returns null when next-round doc does not exist (final match)", async () => {
    // The mock Firestore always returns { exists: false } for get() by default
    const mockDb = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false }),
          set: vi.fn(),
        }),
      }),
    };

    // We test the logic indirectly — the real function uses `db` from firebase.ts
    // which is mocked to `{}` (no collection method).
    // We just verify it doesn't throw when the bracket doc doesn't exist.
    const result = await advanceWinnerToNextRound("t1", "t1_r2_m1", 2, 1, "p1");
    // db is mocked as {} so collection is undefined → function returns null gracefully
    expect(result).toBeNull();
  });
});

// Tests for bracket scheduling (round timing) in BracketGenerator.
// Validates that rounds are scheduled correctly relative to start time.

import { describe, test, expect, beforeAll, vi } from "vitest";

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
  type BracketMatchup,
} from "../../server/tournament/BracketGenerator";

const BASE_TIME = new Date("2026-06-01T10:00:00Z");
const INTERVAL_MINUTES = 10;

// ─── 4-participant (2 rounds, no stagger) ────────────────────────────────────

describe("BracketScheduling — 4 participants, 10-min interval", () => {
  let matchups: BracketMatchup[];

  beforeAll(() => {
    matchups = generateBracketMatchups(4, 4, BASE_TIME, INTERVAL_MINUTES);
  });

  test("R1 matches are scheduled at BASE_TIME (no stagger for 4-person bracket)", () => {
    const r1 = matchups.filter((m) => m.round === 1);
    for (const m of r1) {
      expect(m.scheduledTime.getTime()).toBe(BASE_TIME.getTime());
    }
  });

  test("R2 match is scheduled at BASE_TIME + intervalMinutes", () => {
    const r2 = matchups.find((m) => m.round === 2)!;
    const expected = BASE_TIME.getTime() + INTERVAL_MINUTES * 60_000;
    expect(r2.scheduledTime.getTime()).toBe(expected);
  });

  test("gap between R1 and R2 is exactly intervalMinutes", () => {
    const r1 = matchups.find((m) => m.round === 1)!;
    const r2 = matchups.find((m) => m.round === 2)!;
    const gapMs = r2.scheduledTime.getTime() - r1.scheduledTime.getTime();
    expect(gapMs).toBe(INTERVAL_MINUTES * 60_000);
  });
});

// ─── 8-participant (3 rounds, 5-min stagger within R1) ───────────────────────

describe("BracketScheduling — 8 participants, 15-min interval", () => {
  const INTERVAL = 15;
  let matchups: BracketMatchup[];

  beforeAll(() => {
    matchups = generateBracketMatchups(8, 8, BASE_TIME, INTERVAL);
  });

  test("R1 matches are staggered 5 minutes apart (4 matches → offsets 0/5/10/15 min)", () => {
    const r1 = matchups
      .filter((m) => m.round === 1)
      .sort((a, b) => a.matchNumber - b.matchNumber);
    const base = BASE_TIME.getTime();
    expect(r1[0].scheduledTime.getTime()).toBe(base);
    expect(r1[1].scheduledTime.getTime()).toBe(base + 5 * 60_000);
    expect(r1[2].scheduledTime.getTime()).toBe(base + 10 * 60_000);
    expect(r1[3].scheduledTime.getTime()).toBe(base + 15 * 60_000);
  });

  test("R2 matches scheduled at BASE_TIME + 1 interval", () => {
    const r2 = matchups.filter((m) => m.round === 2);
    const expected = BASE_TIME.getTime() + INTERVAL * 60_000;
    for (const m of r2) {
      expect(m.scheduledTime.getTime()).toBe(expected);
    }
  });

  test("R3 (final) scheduled at BASE_TIME + 2 intervals", () => {
    const r3 = matchups.find((m) => m.round === 3)!;
    const expected = BASE_TIME.getTime() + 2 * INTERVAL * 60_000;
    expect(r3.scheduledTime.getTime()).toBe(expected);
  });

  test("each round's start is exactly intervalMinutes after the previous", () => {
    // R1 start = BASE_TIME, R2 start = BASE_TIME + interval, R3 = BASE_TIME + 2*interval
    const r1First = matchups.find((m) => m.round === 1)!;
    const r2First = matchups.find((m) => m.round === 2)!;
    const r3 = matchups.find((m) => m.round === 3)!;
    const gapMs = INTERVAL * 60_000;
    expect(r2First.scheduledTime.getTime() - r1First.scheduledTime.getTime()).toBe(gapMs);
    expect(r3.scheduledTime.getTime() - r2First.scheduledTime.getTime()).toBe(gapMs);
  });
});

// ─── 2-participant (final only) ───────────────────────────────────────────────

describe("BracketScheduling — 2 participants (final-only)", () => {
  test("single match uses BASE_TIME as scheduled time", () => {
    const matchups = generateBracketMatchups(2, 2, BASE_TIME, 15);
    expect(matchups).toHaveLength(1);
    expect(matchups[0].scheduledTime.getTime()).toBe(BASE_TIME.getTime());
  });
});

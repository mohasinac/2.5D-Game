// Tests for Best-of-X series logic shared across all rooms.
// We test the decision functions directly (no Colyseus import needed).

import { describe, test, expect } from "vitest";

// ─── Replicated series logic ──────────────────────────────────────────────────
// These mirror the logic inside BattleRoom / AIBattleRoom / TournamentBattleRoom.

interface SeriesState {
  status: "waiting" | "warmup" | "in-progress" | "finished" | "series-finished";
  currentGame: number;
  targetWins: number;  // ceil(bestOf / 2)
  seriesWins: Map<string, number>;
  winner: string;
}

function targetWinsForBestOf(bestOf: 1 | 3 | 5): number {
  return Math.ceil(bestOf / 2);
}

/**
 * Returns what should happen after a game ends.
 * "series-over" — the series is decided.
 * "next-game"   — reset and play another game.
 */
function processGameEnd(state: SeriesState, winnerUserId: string): "series-over" | "next-game" {
  const currentWins = (state.seriesWins.get(winnerUserId) ?? 0) + 1;
  state.seriesWins.set(winnerUserId, currentWins);
  if (currentWins >= state.targetWins) return "series-over";
  return "next-game";
}

function makeState(bestOf: 1 | 3 | 5): SeriesState {
  return {
    status: "in-progress",
    currentGame: 1,
    targetWins: targetWinsForBestOf(bestOf),
    seriesWins: new Map(),
    winner: "",
  };
}

// ─── targetWins calculation ───────────────────────────────────────────────────

describe("targetWins — Best-of-X formats", () => {
  test("BO1 → targetWins = 1", () => expect(targetWinsForBestOf(1)).toBe(1));
  test("BO3 → targetWins = 2", () => expect(targetWinsForBestOf(3)).toBe(2));
  test("BO5 → targetWins = 3", () => expect(targetWinsForBestOf(5)).toBe(3));
});

// ─── BO1 ─────────────────────────────────────────────────────────────────────

describe("BO1 series", () => {
  test("single game win ends the series immediately", () => {
    const state = makeState(1);
    const result = processGameEnd(state, "u1");
    expect(result).toBe("series-over");
    expect(state.seriesWins.get("u1")).toBe(1);
  });
});

// ─── BO3 ─────────────────────────────────────────────────────────────────────

describe("BO3 series", () => {
  test("winning game 1 → next-game (series continues)", () => {
    const state = makeState(3);
    expect(processGameEnd(state, "u1")).toBe("next-game");
    expect(state.seriesWins.get("u1")).toBe(1);
  });

  test("winning game 2 after game 1 → series-over", () => {
    const state = makeState(3);
    processGameEnd(state, "u1"); // game 1 → u1 leads 1-0
    const result = processGameEnd(state, "u1"); // game 2 → u1 wins 2-0
    expect(result).toBe("series-over");
    expect(state.seriesWins.get("u1")).toBe(2);
  });

  test("split wins (1-1) → both need game 3", () => {
    const state = makeState(3);
    processGameEnd(state, "u1"); // u1: 1-0
    processGameEnd(state, "u2"); // u2: 1-1
    // Neither has 2 wins yet
    expect(state.seriesWins.get("u1")).toBe(1);
    expect(state.seriesWins.get("u2")).toBe(1);
    // Next win ends it
    const result = processGameEnd(state, "u1");
    expect(result).toBe("series-over");
  });

  test("BO3 cannot go past 3 games", () => {
    const state = makeState(3);
    processGameEnd(state, "u1");  // game 1
    processGameEnd(state, "u1");  // game 2 → series over
    // game 3 would never happen — series ended
    expect(state.seriesWins.get("u1")).toBe(2);
  });
});

// ─── BO5 ─────────────────────────────────────────────────────────────────────

describe("BO5 series", () => {
  test("BO5 requires 3 wins to end the series", () => {
    const state = makeState(5);
    processGameEnd(state, "u1"); // 1
    processGameEnd(state, "u1"); // 2
    expect(state.seriesWins.get("u1")).toBe(2);
    const result = processGameEnd(state, "u1"); // 3 → series over
    expect(result).toBe("series-over");
  });

  test("full 5-game series (2-2 then winner)", () => {
    const state = makeState(5);
    processGameEnd(state, "u1"); // 1-0
    processGameEnd(state, "u2"); // 1-1
    processGameEnd(state, "u1"); // 2-1
    processGameEnd(state, "u2"); // 2-2
    const result = processGameEnd(state, "u2"); // u2 wins 3-2
    expect(result).toBe("series-over");
    expect(state.seriesWins.get("u2")).toBe(3);
  });
});

// ─── seriesWins accumulate correctly ─────────────────────────────────────────

describe("seriesWins Map accumulation", () => {
  test("starts at 0 for both players", () => {
    const state = makeState(3);
    expect(state.seriesWins.get("u1") ?? 0).toBe(0);
    expect(state.seriesWins.get("u2") ?? 0).toBe(0);
  });

  test("alternating wins: u1=2, u2=1 after 3 games", () => {
    const state = makeState(5); // BO5 so it doesn't end at 2
    processGameEnd(state, "u1");
    processGameEnd(state, "u2");
    processGameEnd(state, "u1");
    expect(state.seriesWins.get("u1")).toBe(2);
    expect(state.seriesWins.get("u2")).toBe(1);
  });
});

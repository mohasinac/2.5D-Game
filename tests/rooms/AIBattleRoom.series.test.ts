// Tests for series format in AIBattleRoom.
// Stubs replicate AI room series logic without importing Colyseus.

import { describe, test, expect, beforeEach } from "vitest";

// ─── Series state stub ────────────────────────────────────────────────────────

interface MockBeyblade {
  id: string;
  userId: string;
  username: string;
  isAI: boolean;
  health: number;
  maxHealth: number;
  spin: number;
  maxSpin: number;
  stamina: number;
  maxStamina: number;
  isActive: boolean;
}

interface MockAIRoomState {
  status: "waiting" | "warmup" | "in-progress" | "finished" | "series-finished";
  currentGame: number;
  targetWins: number;
  seriesWins: Map<string, number>;
  seriesLeader: string;
  beyblades: Map<string, MockBeyblade>;
}

class AIBattleRoomStub {
  state: MockAIRoomState;
  private aiUserId = "__ai__";
  private humanUserId = "human-1";
  disconnected = false;

  constructor(bestOf: 1 | 3 | 5) {
    this.state = {
      status: "warmup",
      currentGame: 1,
      targetWins: Math.ceil(bestOf / 2),
      seriesWins: new Map(),
      seriesLeader: "",
      beyblades: new Map([
        ["human-1", {
          id: "human-1", userId: "human-1", username: "Player", isAI: false,
          health: 1000, maxHealth: 1000, spin: 2000, maxSpin: 2000, stamina: 100, maxStamina: 100, isActive: true,
        }],
        ["__ai__", {
          id: "__ai__", userId: "__ai__", username: "AI", isAI: true,
          health: 1000, maxHealth: 1000, spin: 2000, maxSpin: 2000, stamina: 100, maxStamina: 100, isActive: true,
        }],
      ]),
    };
  }

  /** Simulate a single game ending. Returns "series-over" or "next-game". */
  processGameEnd(winnerUserId: string): "series-over" | "next-game" {
    const currentWins = (this.state.seriesWins.get(winnerUserId) ?? 0) + 1;
    this.state.seriesWins.set(winnerUserId, currentWins);

    // Update series leader
    const humanWins = this.state.seriesWins.get(this.humanUserId) ?? 0;
    const aiWins = this.state.seriesWins.get(this.aiUserId) ?? 0;
    this.state.seriesLeader = humanWins > aiWins ? this.humanUserId : aiWins > humanWins ? this.aiUserId : "";

    if (currentWins >= this.state.targetWins) {
      this.state.status = "series-finished";
      return "series-over";
    }
    this.resetForNextGame();
    return "next-game";
  }

  private resetForNextGame() {
    this.state.currentGame++;
    this.state.status = "warmup";
    for (const bey of this.state.beyblades.values()) {
      bey.health = bey.maxHealth;
      bey.spin = bey.maxSpin;
      bey.stamina = bey.maxStamina;
      bey.isActive = true;
    }
  }

  disconnect() { this.disconnected = true; }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AIBattleRoom — BO1 series", () => {
  let room: AIBattleRoomStub;
  beforeEach(() => { room = new AIBattleRoomStub(1); });

  test("targetWins = 1 for BO1", () => {
    expect(room.state.targetWins).toBe(1);
  });

  test("AI wins game 1 → series over immediately", () => {
    const result = room.processGameEnd("__ai__");
    expect(result).toBe("series-over");
    expect(room.state.status).toBe("series-finished");
  });

  test("human wins game 1 → series over immediately", () => {
    const result = room.processGameEnd("human-1");
    expect(result).toBe("series-over");
  });
});

describe("AIBattleRoom — BO3 series", () => {
  let room: AIBattleRoomStub;
  beforeEach(() => { room = new AIBattleRoomStub(3); });

  test("targetWins = 2 for BO3", () => {
    expect(room.state.targetWins).toBe(2);
  });

  test("AI wins game 1 → seriesWins[ai]=1, game resets to game 2", () => {
    const result = room.processGameEnd("__ai__");
    expect(result).toBe("next-game");
    expect(room.state.seriesWins.get("__ai__")).toBe(1);
    expect(room.state.currentGame).toBe(2);
    expect(room.state.status).toBe("warmup");
  });

  test("AI wins games 1 and 2 → series over, AI wins", () => {
    room.processGameEnd("__ai__");
    const result = room.processGameEnd("__ai__");
    expect(result).toBe("series-over");
    expect(room.state.seriesWins.get("__ai__")).toBe(2);
    expect(room.state.status).toBe("series-finished");
  });

  test("human wins 2 games → series over, human wins", () => {
    room.processGameEnd("human-1");
    room.processGameEnd("human-1");
    expect(room.state.seriesWins.get("human-1")).toBe(2);
    expect(room.state.status).toBe("series-finished");
  });

  test("split games 1-1 → series leader updates correctly", () => {
    room.processGameEnd("human-1");
    room.processGameEnd("__ai__");
    expect(room.state.seriesLeader).toBe("");
  });

  test("beyblade stats fully restored after game reset", () => {
    const humanBefore = { ...room.state.beyblades.get("human-1")! };
    // Damage the beyblade
    room.state.beyblades.get("human-1")!.health = 100;
    room.state.beyblades.get("human-1")!.spin = 200;

    room.processGameEnd("__ai__"); // next-game triggers reset

    const humanAfter = room.state.beyblades.get("human-1")!;
    expect(humanAfter.health).toBe(humanBefore.maxHealth);
    expect(humanAfter.spin).toBe(humanBefore.maxSpin);
    expect(humanAfter.isActive).toBe(true);
  });

  test("AI beyblade also restored after game reset", () => {
    room.state.beyblades.get("__ai__")!.health = 50;
    room.processGameEnd("human-1"); // next-game

    expect(room.state.beyblades.get("__ai__")!.health).toBe(1000);
  });
});

describe("AIBattleRoom — BO5 series", () => {
  let room: AIBattleRoomStub;
  beforeEach(() => { room = new AIBattleRoomStub(5); });

  test("targetWins = 3 for BO5", () => {
    expect(room.state.targetWins).toBe(3);
  });

  test("series requires 3 wins — 5-game series full distance", () => {
    // Alternating: human, AI, human, AI, human
    expect(room.processGameEnd("human-1")).toBe("next-game");
    expect(room.processGameEnd("__ai__")).toBe("next-game");
    expect(room.processGameEnd("human-1")).toBe("next-game");
    expect(room.processGameEnd("__ai__")).toBe("next-game");
    const final = room.processGameEnd("human-1");
    expect(final).toBe("series-over");
    expect(room.state.seriesWins.get("human-1")).toBe(3);
    expect(room.state.currentGame).toBe(5); // ended on game 5
  });

  test("early sweep (3-0) ends before game 5", () => {
    room.processGameEnd("human-1");
    room.processGameEnd("human-1");
    const result = room.processGameEnd("human-1");
    expect(result).toBe("series-over");
    expect(room.state.currentGame).toBe(3); // ended on game 3
  });
});

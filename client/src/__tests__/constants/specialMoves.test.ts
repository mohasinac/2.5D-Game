// Tests for the named special-moves seed and resolver. See Phase 9.

import { describe, it, expect } from "vitest";
import {
  SPECIAL_MOVES,
  DEFAULT_TYPE_TO_MOVE,
  ATTACK_TYPE_MULTIPLIER,
  getSpecialMoveById,
  resolveSpecialMove,
} from "@/constants/specialMoves";

describe("specialMoves seed", () => {
  it("has the 5 named moves required by the plan", () => {
    const required = ["stampede_rush", "gyro_anchor", "spin_recovery", "tactical_burst", "shock_pulse"];
    for (const id of required) {
      expect(SPECIAL_MOVES[id]).toBeDefined();
      expect(SPECIAL_MOVES[id].name).toBeTruthy();
      expect(SPECIAL_MOVES[id].iconEmoji).toBeTruthy();
    }
  });

  it("DEFAULT_TYPE_TO_MOVE covers every beyblade type", () => {
    for (const t of ["attack", "defense", "stamina", "balanced"]) {
      const id = DEFAULT_TYPE_TO_MOVE[t];
      expect(id).toBeTruthy();
      expect(SPECIAL_MOVES[id]).toBeDefined();
    }
  });

  it("ATTACK_TYPE_MULTIPLIER orders smash/burst above absorb/spin_steal", () => {
    expect(ATTACK_TYPE_MULTIPLIER.smash).toBeGreaterThan(1);
    expect(ATTACK_TYPE_MULTIPLIER.burst).toBeGreaterThan(1);
    expect(ATTACK_TYPE_MULTIPLIER.absorb).toBeLessThan(1);
    expect(ATTACK_TYPE_MULTIPLIER.spin_steal).toBeLessThan(1);
  });
});

describe("getSpecialMoveById", () => {
  it("returns null for unknown / nullish ids", () => {
    expect(getSpecialMoveById(undefined)).toBeNull();
    expect(getSpecialMoveById(null)).toBeNull();
    expect(getSpecialMoveById("")).toBeNull();
    expect(getSpecialMoveById("nope")).toBeNull();
  });

  it("returns the move when id matches", () => {
    expect(getSpecialMoveById("stampede_rush")?.name).toBe("Stampede Rush");
  });
});

describe("resolveSpecialMove", () => {
  it("prefers an explicit specialMoveId", () => {
    const m = resolveSpecialMove({ specialMoveId: "shock_pulse", type: "attack" });
    expect(m.id).toBe("shock_pulse");
  });

  it("falls back to type-default when specialMoveId missing", () => {
    expect(resolveSpecialMove({ type: "attack" }).id).toBe("stampede_rush");
    expect(resolveSpecialMove({ type: "defense" }).id).toBe("gyro_anchor");
    expect(resolveSpecialMove({ type: "stamina" }).id).toBe("spin_recovery");
    expect(resolveSpecialMove({ type: "balanced" }).id).toBe("tactical_burst");
  });

  it("falls back to tactical_burst for unknown type and no id", () => {
    expect(resolveSpecialMove({ type: "weird" }).id).toBe("tactical_burst");
  });

  it("falls back to tactical_burst when specialMoveId is an unknown string", () => {
    expect(resolveSpecialMove({ specialMoveId: "made_up", type: undefined as any }).id).toBe("tactical_burst");
  });
});

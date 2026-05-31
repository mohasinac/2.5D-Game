/**
 * O9: comboTaskCompiler unit tests.
 * Verifies compileComboTask + compileComboEffectDef produce correct BehaviorRef[].
 */
import { describe, it, expect } from "vitest";
import { compileComboTask, compileComboEffectDef } from "../../server/utils/comboTaskCompiler";
import type { ComboTask } from "../../shared/types/comboTask";

describe("compileComboTask", () => {
  it("returns empty array for task without action", () => {
    const task: ComboTask = {
      action: undefined as any,
      target: "self",
      timing: { type: "instant" },
      condition: {},
    };
    expect(compileComboTask(task)).toEqual([]);
  });

  it("compiles multiplier action to factor.boost BehaviorRef", () => {
    const task: ComboTask = {
      action: {
        type: "multiplier",
        statDeltas: [{ stat: "damageMultiplier", multiplier: 1.5, durationTicks: 30 }],
      },
      target: "self",
      timing: { type: "timed", durationTicks: 30 },
      condition: {},
    };
    const refs = compileComboTask(task);
    expect(refs).toHaveLength(1);
    expect(refs[0].behaviorId).toBe("factor.boost");
    expect(refs[0].params?.stat).toBe("damageMultiplier");
    expect(refs[0].params?.mult).toBe(1.5);
    expect(refs[0].params?.target).toBe("self");
  });

  it("compiles arena_effect action", () => {
    const task: ComboTask = {
      action: {
        type: "arena_effect",
        effect: { type: "darkness", durationTicks: 120, intensity: 0.9 },
      },
      target: "arena",
      timing: { type: "timed", durationTicks: 120 },
      condition: {},
    };
    const refs = compileComboTask(task);
    expect(refs).toHaveLength(1);
    expect(refs[0].behaviorId).toBe("arena.effect.darkness");
  });

  it("compiles movement.orbit action", () => {
    const task: ComboTask = {
      action: {
        type: "movement",
        pattern: { type: "orbit", radius: 200, speedDegPerSec: 180 },
        durationTicks: 60,
      },
      target: "self",
      timing: { type: "timed", durationTicks: 60 },
      condition: {},
    };
    const refs = compileComboTask(task);
    expect(refs).toHaveLength(1);
    expect(refs[0].behaviorId).toBe("movement.orbit");
  });

  it("compiles swap_position to position.swap_with", () => {
    const task: ComboTask = {
      action: {
        type: "movement",
        pattern: { type: "swap_position", swapWith: "nearest_opponent", preventRingOut: true },
        durationTicks: 10,
      },
      target: "self",
      timing: { type: "instant" },
      condition: {},
    };
    const refs = compileComboTask(task);
    expect(refs[0].behaviorId).toBe("position.swap_with");
  });

  it("handles multiple targets — produces one ref per target, parallel from index 1", () => {
    const task: ComboTask = {
      action: {
        type: "multiplier",
        statDeltas: [{ stat: "damageReduction", multiplier: 0.5, durationTicks: 30 }],
      },
      target: ["self", "opponent"],
      timing: { type: "timed", durationTicks: 30 },
      condition: {},
    };
    const refs = compileComboTask(task);
    expect(refs).toHaveLength(2);
    expect(refs[0].parallel).toBeFalsy();
    expect(refs[1].parallel).toBe(true);
    expect(refs[0].params?.target).toBe("self");
    expect(refs[1].params?.target).toBe("opponent");
  });

  it("propagates condition to each BehaviorRef", () => {
    const task: ComboTask = {
      action: {
        type: "multiplier",
        statDeltas: [{ stat: "speed", multiplier: 1.3, durationTicks: 20 }],
      },
      target: "self",
      timing: { type: "instant" },
      condition: { minPower: 30 },
    };
    const refs = compileComboTask(task);
    expect(refs[0].condition?.minPower).toBe(30);
  });
});

describe("compileComboEffectDef", () => {
  it("flattens multiple tasks into steps", () => {
    const def = {
      id: "test-effect", name: "Test", cost: 15, cooldownMs: 3000,
      tasks: [
        {
          action: { type: "multiplier" as const, statDeltas: [{ stat: "speed" as any, multiplier: 1.2, durationTicks: 20 }] },
          target: "self" as const, timing: { type: "instant" as const }, condition: {},
        },
        {
          action: { type: "multiplier" as const, statDeltas: [{ stat: "damageMultiplier" as any, multiplier: 1.3, durationTicks: 20 }] },
          target: "self" as const, timing: { type: "instant" as const }, condition: {},
        },
      ],
    };
    const result = compileComboEffectDef(def);
    expect(result.steps).toHaveLength(2);
    expect(result.id).toBe("test-effect");
  });
});

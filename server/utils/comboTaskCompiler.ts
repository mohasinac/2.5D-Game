// Combo Task Compiler — converts admin-facing ComboTask[] to engine-facing BehaviorRef[].
// Called at SAVE TIME (when admin writes a combo effect to Firestore), NOT at runtime.
// The engine runs BehaviorRef[] steps; the admin edits ComboTask[].

import type {
  ComboTask,
  ComboAction,
  BehaviorRef,
  ComboEffectDefInput,
  TargetedAction,
} from "../../shared/types/comboTask";

// Re-export the ComboEffectDef with compiled steps
export interface ComboEffectDef {
  id: string;
  name: string;
  cost: number;
  cooldownMs: number;
  windupTicks?: number;
  bleedTicks?: number;
  bleedFactors?: unknown[];
  entryAnimation?: unknown;
  exitAnimation?: unknown;
  tasks: ComboTask[];
  steps: BehaviorRef[];
}

function compileAction(action: ComboAction, delayTicks: number, parallel: boolean): BehaviorRef[] {
  switch (action.type) {
    case "multiplier": {
      return action.statDeltas.map((delta, i) => ({
        behaviorId: "factor.boost",
        params: {
          stat: delta.stat,
          mult: delta.multiplier,
          delta: delta.delta,
          setValue: delta.setValue,
          dur: delta.durationTicks,
        },
        delayTicks,
        parallel: parallel || i > 0,
      }));
    }

    case "transformation": {
      return [{
        behaviorId: `transform.become_${action.transformTo}`,
        params: {
          durationTicks: action.durationTicks,
          transformParams: action.transformParams,
          keepVisualAppearance: action.keepVisualAppearance,
          visualConfig: action.visualOverride,
        },
        delayTicks,
        parallel,
      }];
    }

    case "spawning": {
      const spawnVisualConfig = action.spawnParams?.visualOverride;
      return [{
        behaviorId: `spawn.${action.spawnType}`,
        params: {
          spawnPosition: action.spawnPosition,
          spawnTarget: action.spawnTarget,
          count: action.count ?? 1,
          countFormation: action.countFormation,
          countSpacing: action.countSpacing,
          ...action.spawnParams,
          ...(spawnVisualConfig ? { visualConfig: spawnVisualConfig } : {}),
        },
        delayTicks,
        parallel,
      }];
    }

    case "movement": {
      const { pattern } = action;
      // swap_position compiles to position.swap_with (different behaviorId namespace)
      if (pattern.type === "swap_position") {
        return [{
          behaviorId: "position.swap_with",
          params: {
            swapWith: pattern.swapWith,
            preserveVelocity: pattern.preserveVelocity,
            preventRingOut: pattern.preventRingOut,
            snapToGround: pattern.snapToGround,
            durationTicks: action.durationTicks,
            visualConfig: action.visualOverride,
          },
          delayTicks,
          parallel,
        }];
      }
      const behaviorId = `movement.${pattern.type}`;
      return [{
        behaviorId,
        params: {
          ...pattern,
          durationTicks: action.durationTicks,
          visualConfig: action.visualOverride,
        },
        delayTicks,
        parallel,
      }];
    }

    case "arena_effect": {
      const { effect } = action;
      return [{
        behaviorId: `arena.effect.${effect.type}`,
        params: { ...effect },
        delayTicks,
        parallel,
      }];
    }

    default:
      return [];
  }
}

export function compileComboTask(task: ComboTask): BehaviorRef[] {
  const refs: BehaviorRef[] = [];

  if (task.targetedActions && task.targetedActions.length > 0) {
    // Mixed-target: compile each sub-action as a parallel BehaviorRef
    return task.targetedActions.flatMap((sub: TargetedAction) =>
      compileComboTask({ ...task, action: sub.action, target: sub.target, targetedActions: undefined })
    );
  }

  if (!task.action) return [];

  const targets = Array.isArray(task.target)
    ? task.target
    : task.target
      ? [task.target]
      : [undefined];

  targets.forEach((target, i) => {
    const compiled = compileAction(task.action!, 0, i > 0);
    compiled.forEach(ref => {
      const withTarget = target !== undefined
        ? { ...ref, params: { ...ref.params, target } }
        : ref;
      if (task.condition) {
        refs.push({ ...withTarget, condition: task.condition });
      } else {
        refs.push(withTarget);
      }
    });
  });

  return refs;
}

export function compileComboEffectDef(def: ComboEffectDefInput): ComboEffectDef {
  return {
    ...def,
    steps: def.tasks.flatMap(compileComboTask),
  };
}

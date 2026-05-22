// Special Move pipeline config — lives on BitBeastPart (2.5D) and beyblade_stats doc (2D).
// A special move is a pipeline of up to 10 ComboEffectDef references.
// During execution: bey is invulnerable, spin does not decay, player control is locked.

import type { ComboVisual } from "./comboVisual";
import type { ComboTarget, StatDelta } from "./comboTask";

export interface SpecialMoveStep {
  comboEffectId: string;                  // references ComboEffectDef.id
  executionMode: "sequential" | "parallel";
  delayTicksAfterPrev: number;
  overrideParams?: {
    statMultiplierScale?: number;         // scale all stat multipliers in this step
    durationScale?: number;               // scale all durations
    targetOverride?: ComboTarget;         // override target for all tasks in this step
  };
  brieflyReleasesControl?: boolean;
}

export interface SpecialMoveConfig {
  name: string;
  description?: string;
  steps: SpecialMoveStep[];               // up to 10
  cancelable: boolean;                    // true = second Space press aborts remaining steps
  locksDurationTicks: number;             // how long player is locked out
  powerCost: number;                      // default 100 (full bar)
  windupTicks?: number;                   // pre-fire delay before invuln starts (default 0)
  bleedTicks?: number;                    // post-execution vulnerability window (default 0)
  bleedFactors?: StatDelta[];             // stat modifications during bleed
  introAnimation?: ComboVisual;           // played during windupTicks
  outroAnimation?: ComboVisual;           // played during bleedTicks
  cancelableByQTE?: boolean;              // default true; false = QTE cannot interrupt this move
  cameraConfig?: {
    zoomFactor?: number;                  // e.g. 1.5 = zoom in 50% on executing bey
    zoomDurationTicks?: number;
    slowMotionFactor?: number;            // 0–1: time scale for cinematic effect (client only)
  };
}

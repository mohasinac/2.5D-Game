/**
 * Special Move System — server-side state machine.
 *
 * Phases per bey:
 *   idle → windup → executing → bleed → cooldown → idle
 *
 * During EXECUTING:
 *   - invulnerable = true
 *   - spinDecayRate effectively = 0
 *   - player controls locked
 *
 * During WINDUP (windupTicks > 0):
 *   - NOT yet invulnerable (can still take damage)
 *   - controls locked
 *   - camera zoom dispatched
 *
 * QTE gate: opponents may cancel the move during EXECUTING if they complete
 * the QTE key sequence in time AND the attacker has fired >= 30% of their
 * combo slots this game.
 */

import type { SpecialMoveConfig, SpecialMoveStep } from "../../client/src/types/specialMove";
import type { BeyComboMatchState } from "./comboSystem";
import { isQTEGateMet } from "./comboSystem";

export type SpecialMovePhase =
  | "idle"
  | "windup"
  | "executing"
  | "bleed"
  | "cooldown";

export interface SpecialMoveState {
  phase: SpecialMovePhase;
  config: SpecialMoveConfig | null;
  /** Tick index within the current phase (incremented each tick). */
  phaseTick: number;
  /** Which pipeline step is currently active. */
  currentStepIndex: number;
  /** True while invulnerability is active (EXECUTING phase only). */
  invulnerable: boolean;
  /** True while spinDecayRate should be suppressed. */
  suppressSpinDecay: boolean;
  /** True while player controls should be locked. */
  controlsLocked: boolean;
  /** Power cost deducted at activation (for 80% QTE refund calculation). */
  powerCostPaid: number;
  /** Cooldown expiry (server tick ms). */
  cooldownUntilMs: number;
}

export function createSpecialMoveState(): SpecialMoveState {
  return {
    phase: "idle",
    config: null,
    phaseTick: 0,
    currentStepIndex: 0,
    invulnerable: false,
    suppressSpinDecay: false,
    controlsLocked: false,
    powerCostPaid: 0,
    cooldownUntilMs: 0,
  };
}

export interface SpecialMoveCallbacks {
  /** Broadcast camera + intro animation to all clients. */
  broadcastIntro(beyId: string, config: SpecialMoveConfig): void;
  /** Broadcast outro animation to all clients. */
  broadcastOutro(beyId: string, config: SpecialMoveConfig): void;
  /** Broadcast QTE prompt to all OTHER players (not the attacker). */
  broadcastQTEPrompt(beyId: string, sequence: string[], windowTicks: number, powerCost: number): void;
  /** Broadcast QTE success: attacker's move was cancelled + refund info. */
  broadcastQTESuccess(beyId: string, refundAmount: number): void;
  /** Execute a BehaviorRef step on a bey. */
  executeBehaviorRef(beyId: string, step: unknown): void;
  /** Apply bleed factors to a bey. */
  applyBleedFactors(beyId: string, factors: unknown[]): void;
  /** Remove bleed factors from a bey. */
  removeBleedFactors(beyId: string): void;
  /** Refund power to a bey. */
  refundPower(beyId: string, amount: number): void;
  /** Generate a QTE sequence using room PRNG. */
  generateQTESequence(powerCost: number): string[];
  /** Current server tick time in ms (monotonic). */
  nowMs(): number;
}

/**
 * Attempt to activate a special move for a bey.
 * Deducts power immediately; returns false if activation is blocked.
 */
export function activateSpecialMove(
  beyId: string,
  smState: SpecialMoveState,
  config: SpecialMoveConfig,
  power: number,
  nowMs: number,
  callbacks: SpecialMoveCallbacks
): boolean {
  if (smState.phase !== "idle") return false;
  if (nowMs < smState.cooldownUntilMs) return false;
  if (power < config.powerCost) return false;

  smState.config = config;
  smState.phaseTick = 0;
  smState.currentStepIndex = 0;
  smState.powerCostPaid = config.powerCost;
  smState.controlsLocked = true;

  if ((config.windupTicks ?? 0) > 0) {
    smState.phase = "windup";
    smState.invulnerable = false;
    smState.suppressSpinDecay = false;
    callbacks.broadcastIntro(beyId, config);
  } else {
    smState.phase = "executing";
    smState.invulnerable = true;
    smState.suppressSpinDecay = true;
    callbacks.broadcastIntro(beyId, config);
  }

  return true;
}

/**
 * Cancel the special move mid-execution (QTE success or cancelable + re-press).
 * Applies bleed factors; does NOT refund power (caller handles partial refund for QTE).
 */
export function cancelSpecialMove(
  beyId: string,
  smState: SpecialMoveState,
  callbacks: SpecialMoveCallbacks
): void {
  if (smState.phase !== "executing" && smState.phase !== "windup") return;

  const config = smState.config!;
  smState.invulnerable = false;
  smState.suppressSpinDecay = false;
  smState.controlsLocked = false;

  if ((config.bleedTicks ?? 0) > 0 && config.bleedFactors?.length) {
    smState.phase = "bleed";
    smState.phaseTick = 0;
    callbacks.applyBleedFactors(beyId, config.bleedFactors);
    callbacks.broadcastOutro(beyId, config);
  } else {
    _enterCooldown(beyId, smState, config, callbacks);
  }
}

/**
 * Cancel via QTE success: cancel the move AND refund 80% of power cost.
 */
export function cancelSpecialMoveViaQTE(
  beyId: string,
  smState: SpecialMoveState,
  callbacks: SpecialMoveCallbacks
): void {
  const refund = Math.floor(smState.powerCostPaid * 0.8);
  cancelSpecialMove(beyId, smState, callbacks);
  callbacks.refundPower(beyId, refund);
  callbacks.broadcastQTESuccess(beyId, refund);
}

/**
 * Tick the special move state machine for one bey.
 * Must be called every physics tick for every bey.
 * dt is in ms (matching the physics tick interval, typically 1000/60).
 */
export function tickSpecialMove(
  beyId: string,
  smState: SpecialMoveState,
  matchState: BeyComboMatchState,
  totalComboSlots: number,
  dt: number,
  callbacks: SpecialMoveCallbacks
): void {
  if (smState.phase === "idle" || smState.phase === "cooldown") return;

  const config = smState.config!;
  smState.phaseTick++;

  switch (smState.phase) {
    case "windup": {
      const windupTicks = config.windupTicks ?? 0;
      if (smState.phaseTick >= windupTicks) {
        smState.phase = "executing";
        smState.phaseTick = 0;
        smState.invulnerable = true;
        smState.suppressSpinDecay = true;

        // Fire QTE prompt if gate is met
        if (
          config.cancelableByQTE !== false &&
          isQTEGateMet(matchState, totalComboSlots)
        ) {
          const sequence = callbacks.generateQTESequence(config.powerCost);
          const windowTicks = Math.max(20, 60 - Math.floor(config.powerCost / 4));
          callbacks.broadcastQTEPrompt(beyId, sequence, windowTicks, config.powerCost);
        }
      }
      break;
    }

    case "executing": {
      // Execute pipeline steps based on their timing
      _driveSteps(beyId, smState, config, callbacks);

      const lockTicks = config.locksDurationTicks;
      if (smState.phaseTick >= lockTicks) {
        smState.invulnerable = false;
        smState.suppressSpinDecay = false;
        smState.controlsLocked = false;

        if ((config.bleedTicks ?? 0) > 0 && config.bleedFactors?.length) {
          smState.phase = "bleed";
          smState.phaseTick = 0;
          callbacks.applyBleedFactors(beyId, config.bleedFactors);
          callbacks.broadcastOutro(beyId, config);
        } else {
          _enterCooldown(beyId, smState, config, callbacks);
        }
      }
      break;
    }

    case "bleed": {
      const bleedTicks = config.bleedTicks ?? 0;
      if (smState.phaseTick >= bleedTicks) {
        callbacks.removeBleedFactors(beyId);
        _enterCooldown(beyId, smState, config, callbacks);
      }
      break;
    }
  }
}

function _driveSteps(
  beyId: string,
  smState: SpecialMoveState,
  config: SpecialMoveConfig,
  callbacks: SpecialMoveCallbacks
): void {
  // Simple step driver: sequential steps fire in order based on phaseTick and delayTicksAfterPrev.
  // Parallel steps fire at the same tick as their predecessor.
  const steps = config.steps;
  let accumulated = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.executionMode === "sequential") {
      accumulated += step.delayTicksAfterPrev;
    }
    // Fire on the tick it becomes due
    if (smState.phaseTick === accumulated && i === smState.currentStepIndex) {
      callbacks.executeBehaviorRef(beyId, step);
      if (step.executionMode !== "parallel") {
        smState.currentStepIndex++;
      }
    }
  }
}

function _enterCooldown(
  beyId: string,
  smState: SpecialMoveState,
  config: SpecialMoveConfig,
  callbacks: SpecialMoveCallbacks
): void {
  smState.phase = "cooldown";
  smState.phaseTick = 0;
  smState.config = null;
  // Cooldown is managed externally by the power bar refill rate; mark as idle after brief delay.
  // For simplicity we go directly to idle — power bar returning to 0 is the effective gate.
  smState.phase = "idle";
  smState.invulnerable = false;
  smState.suppressSpinDecay = false;
  smState.controlsLocked = false;
}

// ─── Pending QTE state ─────────────────────────────────────────────────────

export interface PendingQTE {
  attackerBeyId: string;
  sequence: string[];
  expiresAtTick: number;
  powerCost: number;
  /** sessionId → number of keys correctly entered so far */
  respondersProgress: Map<string, number>;
}

export function createPendingQTE(
  beyId: string,
  sequence: string[],
  currentTick: number,
  windowTicks: number,
  powerCost: number
): PendingQTE {
  return {
    attackerBeyId: beyId,
    sequence,
    expiresAtTick: currentTick + windowTicks,
    powerCost,
    respondersProgress: new Map(),
  };
}

/**
 * Process a key input from a responder (non-attacker) for the pending QTE.
 * Returns true if the sequence was completed (special move should be cancelled).
 */
export function processQTEInput(
  pendingQTE: PendingQTE,
  responderId: string,
  key: string
): boolean {
  let progress = pendingQTE.respondersProgress.get(responderId) ?? 0;
  const expected = pendingQTE.sequence[progress];

  if (key === expected) {
    progress++;
    pendingQTE.respondersProgress.set(responderId, progress);
    if (progress >= pendingQTE.sequence.length) return true; // success
  } else {
    // Wrong key: reset this responder's progress
    pendingQTE.respondersProgress.set(responderId, 0);
  }
  return false;
}

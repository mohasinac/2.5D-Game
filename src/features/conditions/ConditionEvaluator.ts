/**
 * Pure condition evaluation functions — no state, no Three.js imports.
 * All functions are (condition, context) → boolean.
 *
 * Callers (SpawnManager) manage stateful activation tracking;
 * this module only evaluates conditions against a snapshot context.
 */

import type {
  SpeedLineActivationMode,
  SpeedLineEntryCondition,
  SpeedLineBaseCondition,
  SpeedLineSection,
  TrapData,
} from '../../types/arenaTypes';

export type GamePhase = 'pre_battle' | 'battle' | 'sudden_death';

export interface ConditionContext {
  velocityMs:   number;   // current speed magnitude in cm/s
  gamePhase:    GamePhase;
  timeOnPath:   number;   // seconds entity has been on this speed line
  activePeriod: number;   // seconds since last periodic activation start
}

// ── Entry conditions ──────────────────────────────────────────────────────

export function evalEntryCondition(cond: SpeedLineEntryCondition, ctx: ConditionContext): boolean {
  switch (cond) {
    case 'always':      return true;
    case 'moving_only': return ctx.velocityMs > 1.0;
    case 'fast_only':   return ctx.velocityMs > 30.0;
    case 'slow_only':   return ctx.velocityMs < 15.0;
    default:            return true;
  }
}

// ── Activation mode — is the speed line currently active? ─────────────────

export function evalActivationMode(
  mode: SpeedLineActivationMode,
  sl: { activationRadius?: number; period?: number; activeDuty?: number },
  ctx: ConditionContext,
  worldDistToStart: number,
): boolean {
  switch (mode) {
    case 'always':    return true;
    case 'proximity': return worldDistToStart <= (sl.activationRadius ?? 50);
    case 'periodic': {
      const period = sl.period ?? 5;
      const duty   = sl.activeDuty ?? (period * 0.5);
      return (ctx.activePeriod % period) < duty;
    }
    case 'event': return false;   // event-driven; caller sets active flag
    default:      return true;
  }
}

// ── Base condition — does game state allow this speed line? ──────────────

export function evalBaseCondition(
  cond: SpeedLineBaseCondition,
  phase: GamePhase,
  condPhase: string,
): boolean {
  switch (cond) {
    case 'none':       return false;
    case 'always':     return true;
    case 'game_phase': return condPhase === 'any' || condPhase === phase;
    default:           return true;
  }
}

// ── Trap periodic gating — is the trap in its "active" phase? ──────────

export function evalTrapPeriodic(
  trap: Pick<TrapData, 'isPeriodic' | 'safeInterval' | 'unsafeInterval'>,
  ctx: ConditionContext,
): boolean {
  if (!trap.isPeriodic) return true;
  const safe   = trap.safeInterval   ?? 2;
  const unsafe = trap.unsafeInterval ?? 2;
  const cycle  = safe + unsafe;
  // Safe window = inactive (return false). Active window = past safe window.
  return (ctx.activePeriod % cycle) >= safe;
}

// ── Section condition override ────────────────────────────────────────────

export function evalSectionEntry(
  section: SpeedLineSection | null,
  globalCond: SpeedLineEntryCondition,
  ctx: ConditionContext,
): boolean {
  const cond = section?.entryCondition ?? globalCond;
  return evalEntryCondition(cond, ctx);
}

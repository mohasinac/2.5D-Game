// Combo detection — new schema (3 keys, optional power cost, beyblade-attached).
// See src/constants/combos.ts for the registry.

import {
  COMBO_REGISTRY,
  findComboBySequence,
  getComboById,
  type Combo,
  type ComboKey,
} from "../constants/combos";
import type { BeybladeComboSlot, ComboTrigger } from "../../shared/types/comboTask";

export interface ComboEntry {
  key: ComboKey;
  timestamp: number;
}

export interface ComboTracker {
  history: ComboEntry[];
  /** When >= now, no new combo may fire (per-tracker cooldown floor). */
  globalCooldownUntilMs: number;
  /** Per-combo cooldown (ms epoch). */
  perComboCooldown: Map<string, number>;
}

/**
 * Result of a successful combo activation. Back-compat shape:
 * `damageMultiplier`, `durationMs`, `lockMs`, `effect` are preserved fields
 * that existing rooms / HUD already consume.
 *
 * `comboId` is new — rooms can look up the full Combo via getComboById().
 */
export interface ComboResult {
  comboId: string;
  name: string;
  damageMultiplier: number;
  durationMs: number;
  lockMs: number;
  /** Power cost actually deducted (0 for free combos). */
  costPaid: number;
  /** Coarse effect tag for renderer / SFX selection. */
  effect: "damage_boost" | "speed_burst_left" | "speed_burst_right" | "speed_burst_back" | "guard" | "spin_steal";
}

export function createComboTracker(): ComboTracker {
  return { history: [], globalCooldownUntilMs: 0, perComboCooldown: new Map() };
}

export function pruneHistory(tracker: ComboTracker, now: number, maxWindowMs: number = 600): void {
  tracker.history = tracker.history.filter((entry) => now - entry.timestamp <= maxWindowMs);
}

interface DetectOptions {
  /** Beyblade's currently attached combo ids — only these may fire. */
  attachedComboIds?: string[];
  /** Current power (0–100). Combos with cost > power are rejected. */
  power?: number;
  /** Beyblade type — used for type-restricted combos (e.g. spin-leech-jab is stamina-only). */
  beybladeType?: string;
  /**
   * Multiplier applied to every combo's cost before the power check.
   * 0.0 = all combos free (free_combos modifier); default 1.0.
   */
  comboCostMultiplier?: number;
}

/**
 * Append combo keys to the tracker and detect a match.
 * Returns null when no combo matches, when the combo isn't attached to the beyblade,
 * when power is insufficient, or when the combo is on cooldown.
 *
 * IMPORTANT: caller is responsible for deducting `power -= result.costPaid`
 * after a non-null return — keeping this pure makes it testable in isolation.
 */
export function detectCombo(
  tracker: ComboTracker,
  comboKeys: ComboKey[] | string[] | undefined,
  now: number,
  opts: DetectOptions = {}
): ComboResult | null {
  if (!comboKeys || comboKeys.length === 0) return null;
  if (now < tracker.globalCooldownUntilMs) return null;

  pruneHistory(tracker, now);
  for (const k of comboKeys) tracker.history.push({ key: k as ComboKey, timestamp: now });

  // Need at least 3 entries to match a combo.
  if (tracker.history.length < 3) return null;

  const last3 = tracker.history.slice(-3).map(e => e.key) as ComboKey[];
  const combo = findComboBySequence(last3);
  if (!combo) return null;

  // Window check — first of the 3 must be within combo.windowMs.
  const last3Entries = tracker.history.slice(-3);
  if (now - last3Entries[0].timestamp > combo.windowMs) return null;

  // Beyblade must have it attached.
  if (opts.attachedComboIds && !opts.attachedComboIds.includes(combo.id)) return null;

  // Type restriction (e.g. spin-leech-jab is stamina-only).
  if (opts.beybladeType && combo.type !== "universal" && combo.type !== opts.beybladeType) return null;

  // Power check — honour comboCostMultiplier (e.g. 0 = free_combos modifier).
  const effectiveCost = Math.round(combo.cost * (opts.comboCostMultiplier ?? 1.0));
  if (effectiveCost > 0 && (opts.power ?? 0) < effectiveCost) return null;

  // Per-combo cooldown.
  const cdUntil = tracker.perComboCooldown.get(combo.id) ?? 0;
  if (now < cdUntil) return null;

  // Activate — clear history, set cooldowns.
  tracker.history = [];
  tracker.perComboCooldown.set(combo.id, now + combo.cooldownMs);
  tracker.globalCooldownUntilMs = now + Math.min(300, combo.cooldownMs); // small spacer

  return {
    comboId: combo.id,
    name: combo.name,
    damageMultiplier: combo.effect.damageMultiplier ?? 1.0,
    durationMs: combo.effect.durationMs,
    lockMs: combo.effect.lockMs,
    costPaid: effectiveCost,
    effect: classifyEffect(combo),
  };
}

function classifyEffect(combo: Combo): ComboResult["effect"] {
  if (combo.effect.dashDirection === "left")    return "speed_burst_left";
  if (combo.effect.dashDirection === "right")   return "speed_burst_right";
  if (combo.effect.dashDirection === "back")    return "speed_burst_back";
  if ((combo.effect.spinStealBonus ?? 0) > 0)   return "spin_steal";
  if ((combo.effect.damageMultiplier ?? 1) > 1) return "damage_boost";
  return "guard";
}

// Re-export so callers can introspect the registry without two imports.
export { COMBO_REGISTRY, getComboById };
export type { Combo, ComboKey };

// ─── Per-bey match state for new combo slot system ───────────────────────────

/**
 * Per-bey match-scoped state for the new slot-based combo system.
 * Owned by the room; reset each game in a series via resetForNextGame().
 */
export interface BeyComboMatchState {
  /** effectIds fired at least once this game — used for QTE gate check. */
  comboSlotsFiredSet: Set<string>;
  /** Per-effectId last-fired epoch (server tick ms equivalent). */
  slotCooldownUntil: Map<string, number>;
  /** When charge started (tick ms); set when bey is charging a combo. */
  chargeState?: {
    effectId: string;
    chargeStartMs: number;
    minChargeTicks: number;
    maxChargeTicks: number;
    chargeScale: "linear" | "quadratic" | "step";
  };
}

export function createBeyComboMatchState(): BeyComboMatchState {
  return { comboSlotsFiredSet: new Set(), slotCooldownUntil: new Map() };
}

export function resetBeyComboMatchState(state: BeyComboMatchState): void {
  state.comboSlotsFiredSet.clear();
  state.slotCooldownUntil.clear();
  state.chargeState = undefined;
}

/**
 * QTE gate: has this bey fired >= 30% of its assigned combo slots this game?
 * Beys with 0 slots always return false (can never be QTE-cancelled).
 */
export function isQTEGateMet(
  matchState: BeyComboMatchState,
  totalSlots: number
): boolean {
  if (totalSlots === 0) return false;
  return matchState.comboSlotsFiredSet.size / totalSlots >= 0.3;
}

export interface SlotComboResult {
  slot: BeybladeComboSlot;
  effectId: string;
}

interface SlotDetectOptions {
  power?: number;
  beybladeType?: string;
  spinDirection?: string;
  /** Multiplier on every slot's cost before the power check (0.0 = free). */
  comboCostMultiplier?: number;
  /** Server tick time in ms (monotonic). */
  nowMs: number;
}

/**
 * Detect a matching combo slot from the bey's assigned slots.
 * Returns the first matching slot whose sequence matches the last N keys
 * in the tracker and whose conditions are satisfied.
 *
 * Triggers (non-sequence) are handled by detectTriggerCombos() — this
 * function only handles trigger === "sequence" (default).
 */
export function detectComboFromSlots(
  tracker: ComboTracker,
  comboKeys: ComboKey[] | string[] | undefined,
  slots: BeybladeComboSlot[],
  matchState: BeyComboMatchState,
  opts: SlotDetectOptions
): SlotComboResult | null {
  if (!comboKeys || comboKeys.length === 0) return null;
  if (opts.nowMs < tracker.globalCooldownUntilMs) return null;

  pruneHistory(tracker, opts.nowMs);
  for (const k of comboKeys) tracker.history.push({ key: k as ComboKey, timestamp: opts.nowMs });

  const sequenceSlots = slots.filter(
    s => !s.condition?.trigger || s.condition.trigger === "sequence"
  );
  if (sequenceSlots.length === 0) return null;

  const maxSeqLen = Math.max(...sequenceSlots.map(s => s.sequence?.length ?? 0));
  if (tracker.history.length < maxSeqLen) return null;

  for (const slot of sequenceSlots) {
    const seq = slot.sequence ?? [];
    if (seq.length === 0) continue;

    const cdUntil = matchState.slotCooldownUntil.get(slot.effectId) ?? 0;
    if (opts.nowMs < cdUntil) continue;

    const slotCost = Math.round(((slot as any).cost ?? 0) * (opts.comboCostMultiplier ?? 1.0));
    if (slotCost > 0 && (opts.power ?? 0) < slotCost) continue;
    if ((slot.condition?.minPower ?? 0) > (opts.power ?? 0)) continue;
    if ((slot.condition?.maxPower ?? 100) < (opts.power ?? 0)) continue;
    if (slot.condition?.spinDirectionRequired &&
        slot.condition.spinDirectionRequired !== opts.spinDirection) continue;

    const recent = tracker.history.slice(-seq.length).map(e => e.key);
    if (recent.length < seq.length) continue;

    const firstTs = tracker.history.slice(-seq.length)[0].timestamp;
    if (opts.nowMs - firstTs > 600) continue; // 600ms window

    if (recent.every((k, i) => k === seq[i])) {
      tracker.history = [];
      matchState.slotCooldownUntil.set(slot.effectId, opts.nowMs + 3000);
      tracker.globalCooldownUntilMs = opts.nowMs + 300;
      return { slot, effectId: slot.effectId };
    }
  }

  return null;
}

/**
 * Evaluate trigger-based combo slots (non-sequence).
 * Called each tick; uses edge detection via previousTriggerState.
 */
export interface TriggerContext {
  wasHitThisTick: boolean;
  nearRingOut: boolean;
  spinRatio: number;               // spin / maxSpin
  partnerNearRingOut: boolean;
  opponentSpecialMoveActive: boolean;
  burstAttemptThisTick: boolean;
  power: number;
  spinDirection?: string;
}

export interface TriggerState {
  prevNearRingOut: boolean;
  prevLowSpin: boolean;
  prevOpponentSpecialMove: boolean;
}

export function createTriggerState(): TriggerState {
  return { prevNearRingOut: false, prevLowSpin: false, prevOpponentSpecialMove: false };
}

export function detectTriggerCombos(
  slots: BeybladeComboSlot[],
  matchState: BeyComboMatchState,
  ctx: TriggerContext,
  triggerState: TriggerState,
  nowMs: number
): SlotComboResult[] {
  const results: SlotComboResult[] = [];

  const triggerSlots = slots.filter(
    s => s.condition?.trigger && s.condition.trigger !== "sequence"
  );

  for (const slot of triggerSlots) {
    const trigger = slot.condition!.trigger as ComboTrigger;
    const cdUntil = matchState.slotCooldownUntil.get(slot.effectId) ?? 0;
    if (nowMs < cdUntil) continue;
    if ((slot.condition?.minPower ?? 0) > ctx.power) continue;

    let fired = false;
    switch (trigger) {
      case "on_hit_received":
        fired = ctx.wasHitThisTick;
        break;
      case "on_near_ring_out":
        // Edge detection: only fires on transition false→true
        fired = ctx.nearRingOut && !triggerState.prevNearRingOut;
        break;
      case "on_low_spin": {
        const minSpin = (slot.condition?.minSpin ?? 30) / 100;
        const isLowSpin = ctx.spinRatio < minSpin;
        fired = isLowSpin && !triggerState.prevLowSpin;
        break;
      }
      case "on_partner_near_ring_out":
        fired = ctx.partnerNearRingOut;
        break;
      case "on_opponent_special_move":
        fired = ctx.opponentSpecialMoveActive && !triggerState.prevOpponentSpecialMove;
        break;
      case "on_burst_attempt":
        fired = ctx.burstAttemptThisTick;
        break;
    }

    if (fired) {
      const cooldown = slot.condition?.triggerCooldownMs ?? 3000;
      matchState.slotCooldownUntil.set(slot.effectId, nowMs + cooldown);
      results.push({ slot, effectId: slot.effectId });
    }
  }

  // Update edge-detection state
  triggerState.prevNearRingOut = ctx.nearRingOut;
  triggerState.prevLowSpin = ctx.spinRatio < ((slots[0]?.condition?.minSpin ?? 30) / 100);
  triggerState.prevOpponentSpecialMove = ctx.opponentSpecialMoveActive;

  return results;
}

/**
 * Record that a combo effect was fired this match (for QTE gate tracking).
 * Call this immediately after activating any combo, slot-based or legacy.
 */
export function recordComboFired(
  matchState: BeyComboMatchState,
  effectId: string
): void {
  matchState.comboSlotsFiredSet.add(effectId);
}


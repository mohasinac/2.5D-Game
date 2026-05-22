// Combo detection — new schema (3 keys, optional power cost, beyblade-attached).
// See src/constants/combos.ts for the registry.

import {
  COMBO_REGISTRY,
  findComboBySequence,
  getComboById,
  type Combo,
  type ComboKey,
} from "../constants/combos";

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

  // Power check.
  if (combo.cost > 0 && (opts.power ?? 0) < combo.cost) return null;

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
    costPaid: combo.cost,
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

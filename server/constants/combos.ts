// [SHARED] Combo registry — 3-button sequences with optional power cost.
// Combos differ from special moves in capability ceiling:
//   - cost <= 35 (specials cost 100)
//   - damageMultiplier <= 1.5 (specials go to 2.0+)
//   - lockMs <= 300 (specials lock up to 2000ms)
//   - no invulnerability, no AoE, no full spin recovery
//
// Beyblades opt in by listing combo ids in `BeybladeStats.comboIds` (max 3).
// If the beyblade does not have the combo attached, the input does nothing.

export type ComboKey =
  | "moveLeft" | "moveRight" | "moveUp" | "moveDown"
  | "attack"   | "defense"   | "dodge"
  | "jump";

export type ComboType = "attack" | "defense" | "stamina" | "balanced" | "universal";

export interface ComboEffect {
  /** Damage multiplier applied to next hits inside durationMs. Combo cap: 1.5. */
  damageMultiplier?: number;
  /** Short forward dash impulse (units of internal force). */
  forceImpulse?: { x: number; y: number };
  /** Override: a quick directional burst (left/right) — used by dash combos. */
  dashDirection?: "left" | "right" | "forward" | "back";
  /** Window (ms) the multiplier/dash effect remains active. Combo cap: 1500. */
  durationMs: number;
  /** Movement lock window (ms). Combo cap: 300. */
  lockMs: number;
  /** Small spin top-up (max 50). */
  microSpinBoost?: number;
  /** Tiny spin steal multiplier (max 0.1). */
  spinStealBonus?: number;
}

export interface Combo {
  id: string;
  name: string;
  /** Always exactly 3 keys. */
  sequence: [ComboKey, ComboKey, ComboKey];
  /** Power cost (0 = free, otherwise 15 / 25 / 35). */
  cost: 0 | 15 | 25 | 35;
  /** Which beyblade types can equip this combo. "universal" = any. */
  type: ComboType;
  /** Detection window — last key must arrive within this many ms of the first. */
  windowMs: number;
  /** Effect on activation. */
  effect: ComboEffect;
  /** Cooldown after activation (ms). */
  cooldownMs: number;
  /** Display description for the Combos tab + HUD. */
  description: string;
  /** Optional: references combo_effects/{effectId} Firestore doc for BehaviorRef dispatch. */
  effectId?: string;
}

/** All 8 seeded combos. 4 free + 4 power-costing. */
export const COMBO_REGISTRY: Combo[] = [
  // ── 4 FREE ────────────────────────────────────────────────────────────────
  {
    id: "quick-dash-l",
    name: "Quick Dash Left",
    sequence: ["moveLeft", "moveLeft", "attack"],
    cost: 0,
    type: "universal",
    windowMs: 400,
    effect: { dashDirection: "left", durationMs: 300, lockMs: 0 },
    cooldownMs: 800,
    description: "Short leftward dash with a contact pop. Free.",
  },
  {
    id: "quick-dash-r",
    name: "Quick Dash Right",
    sequence: ["moveRight", "moveRight", "attack"],
    cost: 0,
    type: "universal",
    windowMs: 400,
    effect: { dashDirection: "right", durationMs: 300, lockMs: 0 },
    cooldownMs: 800,
    description: "Short rightward dash with a contact pop. Free.",
  },
  {
    id: "guard-tap",
    name: "Guard Tap",
    sequence: ["defense", "defense", "defense"],
    cost: 0,
    type: "universal",
    windowMs: 500,
    effect: { durationMs: 250, lockMs: 0, damageMultiplier: 1.0 },
    cooldownMs: 1000,
    description: "Quick triple-tap guard. Free; no offensive bonus.",
  },
  {
    id: "feint",
    name: "Feint",
    sequence: ["moveLeft", "moveRight", "defense"],
    cost: 0,
    type: "universal",
    windowMs: 450,
    effect: { durationMs: 200, lockMs: 0, dashDirection: "back" },
    cooldownMs: 1200,
    description: "Side-step then brace. Free; opens counter-windows.",
  },

  // ── 4 POWER-COSTING ───────────────────────────────────────────────────────
  {
    id: "riposte",
    name: "Riposte",
    sequence: ["defense", "defense", "attack"],
    cost: 15,
    type: "defense",
    windowMs: 500,
    effect: { damageMultiplier: 1.3, durationMs: 600, lockMs: 200 },
    cooldownMs: 2500,
    description: "Defensive parry into a 1.3x counter. Costs 15.",
  },
  {
    id: "pivot-strike",
    name: "Pivot Strike",
    sequence: ["moveLeft", "moveRight", "attack"],
    cost: 15,
    type: "balanced",
    windowMs: 450,
    effect: { damageMultiplier: 1.25, durationMs: 500, lockMs: 200 },
    cooldownMs: 2500,
    description: "Quick pivot into a 1.25x strike. Costs 15.",
  },
  {
    id: "power-thrust",
    name: "Power Thrust",
    sequence: ["attack", "attack", "attack"],
    cost: 25,
    type: "universal",
    windowMs: 450,
    effect: { damageMultiplier: 1.5, durationMs: 800, lockMs: 300 },
    cooldownMs: 3500,
    description: "Three-tap commit attack — 1.5x for 0.8s. Costs 25.",
  },
  {
    id: "spin-leech-jab",
    name: "Spin-Leech Jab",
    sequence: ["moveLeft", "attack", "moveRight"],
    cost: 35,
    type: "stamina",
    windowMs: 450,
    effect: { damageMultiplier: 1.1, durationMs: 800, lockMs: 200, spinStealBonus: 0.08, microSpinBoost: 30 },
    cooldownMs: 4500,
    description: "Stamina-only. Light hit + 8% spin steal on contact. Costs 35.",
  },
];

const BY_ID = new Map<string, Combo>(COMBO_REGISTRY.map(c => [c.id, c]));
const BY_SEQUENCE = new Map<string, Combo>(
  COMBO_REGISTRY.map(c => [c.sequence.join(">"), c])
);

export function getComboById(id: string): Combo | undefined {
  return BY_ID.get(id);
}

export function findComboBySequence(seq: ComboKey[]): Combo | undefined {
  if (seq.length !== 3) return undefined;
  return BY_SEQUENCE.get(seq.join(">"));
}

/** Returns true if a beyblade type may equip the given combo. */
export function isComboAllowedForType(combo: Combo, beybladeType: string): boolean {
  if (combo.type === "universal") return true;
  return combo.type === beybladeType;
}

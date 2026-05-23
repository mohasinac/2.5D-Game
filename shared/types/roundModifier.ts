/**
 * Round Modifiers — optional pre-match physics/rule overrides that apply globally
 * to all beys in a match (Section X of the Universal Gameplay Engine plan).
 *
 * Modifiers can be selected by admin, random-assigned, or stacked (max 2).
 */

import type { StatDeltaKey } from "./comboTask";

// ─── Stat delta (reused from comboTask for globalFactors) ────────────────────

export interface StatDelta {
  stat: StatDeltaKey;
  multiplier: number;
}

// ─── RoundModifier definition ────────────────────────────────────────────────

export type RoundModifierCategory = "physics" | "combat" | "rules" | "chaos";

export interface RoundModifier {
  id: string;
  name: string;
  description: string;
  category: RoundModifierCategory;
  icon?: string;

  /** Multiply existing arena/bey physics constants globally. */
  physicsOverrides?: {
    gravityMult?: number;
    airResistance?: number;
    surfaceFriction?: number;
    wallRestitution?: number;
  };

  /** Applied via factor system to every bey as a permanent (match-scoped) multiplier. */
  globalFactors?: StatDelta[];

  /** Change match rules. */
  ruleOverrides?: {
    burstResistanceOverride?: number;
    spinDecayRateOverride?: number;
    comboCostMultiplier?: number;
    specialMoveCostOverride?: number;
    ringOutZoneMult?: number;
    friendlyFire?: boolean;
  };

  /** Unpredictable/fun chaos effects. */
  chaosParams?: {
    randomizeStats?: boolean;
    swapBeyblades?: boolean;
    invertControls?: boolean;
    gravityReverses?: boolean;
  };
}

// ─── Built-in modifier IDs ────────────────────────────────────────────────────

export const BUILT_IN_MODIFIERS: RoundModifier[] = [
  // ── Physics ────────────────────────────────────────────────────────────────
  {
    id: "double_gravity",
    name: "Double Gravity",
    description: "Gravity is 2× — beys fall and slow faster.",
    category: "physics",
    icon: "⬇️",
    physicsOverrides: { gravityMult: 2.0 },
  },
  {
    id: "low_gravity",
    name: "Low Gravity",
    description: "Gravity is only 0.2× — beys float and drift.",
    category: "physics",
    icon: "🌙",
    physicsOverrides: { gravityMult: 0.2 },
  },
  {
    id: "ice_floor",
    name: "Ice Floor",
    description: "Surface friction is minimal — nearly frictionless.",
    category: "physics",
    icon: "❄️",
    physicsOverrides: { surfaceFriction: 0.05 },
  },
  {
    id: "sticky_floor",
    name: "Sticky Floor",
    description: "Extreme friction — movement feels like mud.",
    category: "physics",
    icon: "🕸️",
    physicsOverrides: { surfaceFriction: 5.0 },
  },
  {
    id: "super_bounce",
    name: "Super Bounce",
    description: "Walls have 3× restitution — wild ricochets.",
    category: "physics",
    icon: "🎱",
    physicsOverrides: { wallRestitution: 3.0 },
  },
  {
    id: "vacuum",
    name: "Vacuum",
    description: "No air resistance — beys maintain momentum forever.",
    category: "physics",
    icon: "🚀",
    physicsOverrides: { airResistance: 0.0 },
  },

  // ── Combat ─────────────────────────────────────────────────────────────────
  {
    id: "hyper_speed",
    name: "Hyper Speed",
    description: "All beys move at 2× speed.",
    category: "combat",
    icon: "⚡",
    globalFactors: [{ stat: "speed", multiplier: 2.0 }],
  },
  {
    id: "glass_cannon",
    name: "Glass Cannon",
    description: "All beys deal and take 2× damage.",
    category: "combat",
    icon: "💥",
    globalFactors: [
      { stat: "damageMultiplier", multiplier: 2.0 },
      { stat: "damageReduction", multiplier: 2.0 },
    ],
  },
  {
    id: "stamina_mode",
    name: "Stamina Mode",
    description: "Spin decays at only 20% of normal rate.",
    category: "combat",
    icon: "🌀",
    ruleOverrides: { spinDecayRateOverride: 0.2 },
  },
  {
    id: "fragile_defense",
    name: "Fragile Defense",
    description: "All beys take 1.8× incoming damage.",
    category: "combat",
    icon: "🛡️",
    globalFactors: [{ stat: "damageReduction", multiplier: 1.8 }],
  },
  {
    id: "burst_mania",
    name: "Burst Mania",
    description: "Burst resistance is 0 — everyone bursts easily!",
    category: "combat",
    icon: "💣",
    ruleOverrides: { burstResistanceOverride: 0 },
  },

  // ── Rules ──────────────────────────────────────────────────────────────────
  {
    id: "free_combos",
    name: "Free Combos",
    description: "All combos cost 0 power.",
    category: "rules",
    icon: "🎁",
    ruleOverrides: { comboCostMultiplier: 0.0 },
  },
  {
    id: "mega_special",
    name: "Mega Special",
    description: "Special moves only cost 25 power.",
    category: "rules",
    icon: "⭐",
    ruleOverrides: { specialMoveCostOverride: 25 },
  },
  {
    id: "arena_shrink_fast",
    name: "Arena Shrink",
    description: "Arena boundary shrinks from 30s, reaching 40% size by 90s.",
    category: "rules",
    icon: "🔲",
    ruleOverrides: {},
  },

  // ── Chaos ──────────────────────────────────────────────────────────────────
  {
    id: "randomize_all",
    name: "Chaos Stats",
    description: "Every bey's stats are randomized (×0.5–2.0).",
    category: "chaos",
    icon: "🎲",
    chaosParams: { randomizeStats: true },
  },
  {
    id: "invert_controls",
    name: "Mirror Mode",
    description: "Left is right, up is down for all players.",
    category: "chaos",
    icon: "🪞",
    chaosParams: { invertControls: true },
  },
  {
    id: "gravity_flip",
    name: "Gravity Flip",
    description: "Gravity reverses direction at the 1-minute mark.",
    category: "chaos",
    icon: "🌀",
    chaosParams: { gravityReverses: true },
  },
];

export const MODIFIER_MAP: ReadonlyMap<string, RoundModifier> = new Map(
  BUILT_IN_MODIFIERS.map((m) => [m.id, m])
);

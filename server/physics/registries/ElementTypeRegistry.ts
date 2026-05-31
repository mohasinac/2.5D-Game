/**
 * ElementTypeRegistry — 12 element type interaction matrix from INDEX_A–E.
 * Element types are conceptual categories (fire, water, wind, etc.) that modify
 * damage and effect multipliers when attacker and defender have matching/opposing types.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface ElementTypeProfile {
  id: string;
  label: string;
  color: string;           // hex color for UI display
  description: string;
}

export interface ElementInteraction {
  attackerTypeId: string;
  defenderTypeId: string;
  multiplier: number;      // damage multiplier (1.5 = 150% damage, 0.5 = 50% damage)
}

export const ElementTypeRegistry: Record<string, ElementTypeProfile> = {
  fire: {
    id: "fire",
    label: "Fire",
    color: "#EF4444",
    description: "Fire element — strong vs Wind; weak vs Water",
  },
  water: {
    id: "water",
    label: "Water",
    color: "#3B82F6",
    description: "Water element — strong vs Fire; weak vs Thunder",
  },
  wind: {
    id: "wind",
    label: "Wind",
    color: "#10B981",
    description: "Wind element — strong vs Thunder; weak vs Fire",
  },
  thunder: {
    id: "thunder",
    label: "Thunder",
    color: "#F59E0B",
    description: "Thunder element — strong vs Water; weak vs Wind",
  },
  earth: {
    id: "earth",
    label: "Earth",
    color: "#92400E",
    description: "Earth element — strong vs Shadow; neutral vs most",
  },
  light: {
    id: "light",
    label: "Light",
    color: "#FEF3C7",
    description: "Light element — strong vs Shadow; neutral vs most",
  },
  shadow: {
    id: "shadow",
    label: "Shadow",
    color: "#7C3AED",
    description: "Shadow element — strong vs Light; weak vs Earth",
  },
  ice: {
    id: "ice",
    label: "Ice",
    color: "#93C5FD",
    description: "Ice element — strong vs Wind; slows opponent movement on hit",
  },
  magma: {
    id: "magma",
    label: "Magma",
    color: "#F97316",
    description: "Magma element — fire + earth combination; high damage baseline",
  },
  storm: {
    id: "storm",
    label: "Storm",
    color: "#6B7280",
    description: "Storm element — wind + thunder combination; disrupts stability",
  },
  void: {
    id: "void",
    label: "Void",
    color: "#1F2937",
    description: "Void element — neutral to all; ignores element interactions",
  },
  neutral: {
    id: "neutral",
    label: "Neutral",
    color: "#D1D5DB",
    description: "Neutral (no element) — 1.0× multiplier in all interactions",
  },
};

/**
 * Element interaction table — [attackerTypeId][defenderTypeId] = multiplier
 * 1.5 = strong (attacker advantage), 0.67 = weak (defender advantage), 1.0 = neutral
 */
export const ELEMENT_INTERACTION_TABLE: Record<string, Record<string, number>> = {
  fire:    { water: 0.67, wind: 1.5,  thunder: 1.0, earth: 1.0, ice: 1.5,  shadow: 1.0, light: 1.0, magma: 1.0, storm: 0.67, void: 1.0, neutral: 1.0, fire: 1.0 },
  water:   { fire:  1.5,  wind: 0.67, thunder: 0.67,earth: 1.0, ice: 0.67, shadow: 1.0, light: 1.0, magma: 1.5, storm: 1.0,  void: 1.0, neutral: 1.0, water: 1.0 },
  wind:    { fire:  0.67, water: 1.5, thunder: 0.67,earth: 1.0, ice: 0.67, shadow: 1.0, light: 1.0, magma: 1.0, storm: 1.5,  void: 1.0, neutral: 1.0, wind: 1.0 },
  thunder: { water: 1.5,  wind: 1.5,  earth: 1.0,   fire: 1.0,  ice: 1.0,  shadow: 1.0, light: 1.0, magma: 1.0, storm: 0.67, void: 1.0, neutral: 1.0, thunder: 1.0 },
  earth:   { shadow: 1.5, fire: 1.0,  water: 1.0,   wind: 1.0,  thunder: 1.0, light: 0.67, ice: 1.0, magma: 0.67, storm: 1.0, void: 1.0, neutral: 1.0, earth: 1.0 },
  light:   { shadow: 1.5, earth: 1.5, fire: 1.0,    water: 1.0, wind: 1.0, thunder: 1.0, ice: 1.0,  magma: 1.0,  storm: 1.0, void: 1.5, neutral: 1.0, light: 1.0 },
  shadow:  { light:  0.67, earth: 0.67, fire: 1.0,  water: 1.0, wind: 1.0, thunder: 1.0, ice: 1.0,  magma: 1.0,  storm: 1.0, void: 1.5, neutral: 1.0, shadow: 1.0 },
  ice:     { fire:  0.67, wind: 1.5,   water: 1.0,  thunder: 1.0, earth: 1.0, light: 1.0, shadow: 1.0, magma: 0.67, storm: 0.67, void: 1.0, neutral: 1.0, ice: 1.0 },
  magma:   { water: 0.67, earth: 1.5,  fire: 1.0,   wind: 1.0,  ice: 1.5,  thunder: 1.0, light: 1.0, shadow: 1.0, storm: 1.0,  void: 1.0, neutral: 1.0, magma: 1.0 },
  storm:   { wind: 0.67,  fire: 1.5,   water: 1.0,  ice: 1.5,   earth: 1.0, light: 1.0,  shadow: 1.0, thunder: 1.5, magma: 1.0, void: 1.0, neutral: 1.0, storm: 1.0 },
  void:    { light: 0.67, shadow: 0.67, fire: 1.0,  water: 1.0, wind: 1.0,  thunder: 1.0, earth: 1.0, ice: 1.0,    magma: 1.0, storm: 1.0, neutral: 1.0, void: 1.0 },
  neutral: { fire: 1.0,   water: 1.0,  wind: 1.0,   thunder: 1.0, earth: 1.0, light: 1.0, shadow: 1.0, ice: 1.0, magma: 1.0,  storm: 1.0, void: 1.0, neutral: 1.0 },
};

/**
 * Resolve element multiplier for attacker vs defender.
 * Returns 1.0 if either is neutral/unknown.
 */
export function resolveElementMultiplier(
  attackerTypeId: string,
  defenderTypeId: string
): number {
  const row = ELEMENT_INTERACTION_TABLE[attackerTypeId];
  if (!row) return 1.0;
  return row[defenderTypeId] ?? 1.0;
}

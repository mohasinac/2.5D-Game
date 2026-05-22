// Phase AB: 12-element type system.
// Used by beyblades (1–2 types), arena features (1 optional type), and combo conditions.

export type ElementType =
  | "fire" | "water" | "earth" | "lightning" | "wind" | "ice"
  | "shadow" | "light" | "metal" | "nature" | "thunder" | "void";

export const ELEMENT_ICONS: Record<ElementType, string> = {
  fire:      "🔥",
  water:     "💧",
  earth:     "🌍",
  lightning: "⚡",
  wind:      "💨",
  ice:       "❄️",
  shadow:    "🌑",
  light:     "✨",
  metal:     "⚙️",
  nature:    "🌿",
  thunder:   "⛈️",
  void:      "🌀",
};

export const ELEMENT_COLORS: Record<ElementType, string> = {
  fire:      "#ef4444",
  water:     "#3b82f6",
  earth:     "#a16207",
  lightning: "#eab308",
  wind:      "#6ee7b7",
  ice:       "#93c5fd",
  shadow:    "#7c3aed",
  light:     "#fef08a",
  metal:     "#94a3b8",
  nature:    "#22c55e",
  thunder:   "#8b5cf6",
  void:      "#1e1b4b",
};

// Type effectiveness matrix: attacker element → defender element → damage multiplier.
// Multiplier is applied to all damage + spin steal from attacker to defender.
export const TYPE_MATRIX: Record<ElementType, Record<ElementType, number>> = {
  fire:      { fire:1.0, water:0.5, earth:1.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.5, thunder:0.5, void:1.0 },
  water:     { fire:2.0, water:1.0, earth:0.5, lightning:0.5, wind:0.5, ice:0.5,  shadow:1.0, light:1.0, metal:1.5, nature:1.5, thunder:1.0, void:1.0 },
  earth:     { fire:1.0, water:1.5, earth:1.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:2.0, nature:0.5, thunder:0.5, void:1.0 },
  lightning: { fire:1.0, water:2.0, earth:0.5, lightning:1.0, wind:2.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.5, nature:0.5, thunder:1.0, void:1.0 },
  wind:      { fire:1.0, water:1.5, earth:1.0, lightning:0.5, wind:1.0, ice:1.5,  shadow:1.0, light:0.5, metal:0.5, nature:2.0, thunder:0.5, void:1.0 },
  ice:       { fire:0.5, water:1.5, earth:1.5, lightning:1.0, wind:0.5, ice:1.0,  shadow:1.0, light:1.0, metal:0.5, nature:0.5, thunder:1.0, void:1.5 },
  shadow:    { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:2.0 },
  light:     { fire:1.0, water:1.0, earth:1.0, lightning:1.5, wind:1.0, ice:1.0,  shadow:2.0, light:1.0, metal:0.5, nature:1.0, thunder:1.0, void:0.5 },
  metal:     { fire:1.0, water:0.5, earth:0.5, lightning:0.5, wind:2.0, ice:1.5,  shadow:1.0, light:1.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  nature:    { fire:0.5, water:1.0, earth:2.0, lightning:2.0, wind:1.0, ice:1.0,  shadow:1.0, light:1.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  thunder:   { fire:1.5, water:2.0, earth:0.5, lightning:1.0, wind:1.0, ice:2.0,  shadow:1.0, light:0.5, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
  void:      { fire:1.0, water:1.0, earth:1.0, lightning:1.0, wind:1.0, ice:1.0,  shadow:0.5, light:2.0, metal:1.0, nature:1.0, thunder:1.0, void:1.0 },
};

// Zone hazard immunities per element type.
// A bey of this element takes 0 effect from these hazard types.
export const ZONE_IMMUNITIES: Partial<Record<ElementType, string[]>> = {
  fire:      ["ice"],
  water:     ["fire"],
  earth:     ["electric", "emp"],
  lightning: ["electric", "emp"],
  wind:      ["time_slow", "sticky", "mud"],
  ice:       ["ice"],
  light:     ["void"],
  nature:    ["drain"],
  thunder:   ["electric", "emp"],
  void:      ["lava","ice","mud","healing","emp","magnet","antigravity",
               "electric","time_slow","repulsion","size_shrink","size_grow",
               "trampoline","combo_boost","drain"],
};

// Zone bonus effects: bey in a matching-element zone gains a bonus.
// Tuple: [stat to boost, multiplier or flat delta, "mult"|"flat"]
export const ZONE_BONUSES: Partial<Record<ElementType, { hazardType: string; stat: string; value: number; mode: "mult" | "flat" }[]>> = {
  fire:      [{ hazardType: "fire",     stat: "spinDecayRate",    value: 0.5,  mode: "mult"  }],
  water:     [{ hazardType: "water",    stat: "surfaceFriction",  value: 0.0,  mode: "flat"  },
              { hazardType: "water",    stat: "speed",            value: 1.3,  mode: "mult"  }],
  lightning: [{ hazardType: "water",    stat: "damageMultiplier", value: 1.5,  mode: "mult"  }],
  nature:    [{ hazardType: "healing",  stat: "spinDecayRate",    value: 0.5,  mode: "mult"  }],
  thunder:   [{ hazardType: "electric", stat: "powerGainRate",    value: 2.0,  mode: "mult"  }],
  earth:     [{ hazardType: "elevation",stat: "spinBoost",        value: 2.0,  mode: "mult"  }],
};

/**
 * Damage multiplier when attacker hits defender, considering dual-type defense (stacks).
 * Dual-type DEFENDER: multiply both resistance values (can go to 4× or 0.25×).
 */
export function getDualTypeDefenseMultiplier(
  attackerElem: ElementType,
  defenderElems: ElementType[],
): number {
  if (defenderElems.length === 0) return 1.0;
  if (defenderElems.length === 1) return TYPE_MATRIX[attackerElem][defenderElems[0]];
  return TYPE_MATRIX[attackerElem][defenderElems[0]] * TYPE_MATRIX[attackerElem][defenderElems[1]];
}

/**
 * Damage multiplier when a dual-type attacker hits a single-type defender.
 * Dual-type ATTACKER: use the better (higher) of the two type matchups.
 */
export function getDualTypeAttackMultiplier(
  attackerElems: ElementType[],
  defenderElem: ElementType,
): number {
  if (attackerElems.length === 0) return 1.0;
  if (attackerElems.length === 1) return TYPE_MATRIX[attackerElems[0]][defenderElem];
  return Math.max(TYPE_MATRIX[attackerElems[0]][defenderElem], TYPE_MATRIX[attackerElems[1]][defenderElem]);
}

/**
 * Returns true if bey's element type(s) make it immune to the given floor hazard type.
 */
export function isImmuneToZone(
  beyElems: ElementType[],
  hazardType: string,
): boolean {
  for (const elem of beyElems) {
    if (ZONE_IMMUNITIES[elem]?.includes(hazardType)) return true;
  }
  return false;
}

/**
 * Classify the type effectiveness of an attack for HUD display.
 */
export function getTypeEffectivenessLabel(multiplier: number): "super" | "resisted" | "neutral" {
  if (multiplier >= 2.0) return "super";
  if (multiplier <= 0.5) return "resisted";
  return "neutral";
}

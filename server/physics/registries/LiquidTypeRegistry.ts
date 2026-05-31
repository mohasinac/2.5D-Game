/**
 * LiquidTypeRegistry — 8 liquid/surface types from INDEX_E arena case studies.
 * These govern surface friction, spin damage, and movement effects in arena zones.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface LiquidTypeProfile {
  id: string;
  label: string;
  mu_eff: number;          // effective friction multiplier (relative to standard ABS floor μ=0.17)
  speedMult: number;       // movement speed multiplier (< 1 = slowed, > 1 = accelerated)
  spinDecayAccel: number;  // additional spin decay per tick (rad/s²); 0 = none
  description: string;
}

export const LiquidTypeRegistry: Record<string, LiquidTypeProfile> = {
  water: {
    id: "water",
    label: "Water",
    mu_eff: 1.0,            // ploughing drag — high effective friction
    speedMult: 0.70,
    spinDecayAccel: 0,
    description: "Standard water — high drag; slows movement significantly; no spin damage",
  },
  shallow_water: {
    id: "shallow_water",
    label: "Shallow Water",
    mu_eff: 0.70,
    speedMult: 0.85,
    spinDecayAccel: 0,
    description: "Shallow water — less drag than deep water; only partial immersion",
  },
  lava: {
    id: "lava",
    label: "Lava",
    mu_eff: 0.60,
    speedMult: 0.50,
    spinDecayAccel: 5,      // 5 rad/s² additional decay per tick (continuous spin damage)
    description: "Lava — high viscosity; damages spin continuously; volcanic arena zones",
  },
  ice: {
    id: "ice",
    label: "Ice",
    mu_eff: 0.05,           // extremely low friction — bey slides uncontrollably
    speedMult: 1.30,
    spinDecayAccel: 0,
    description: "Ice surface — nearly frictionless; bey slides at high speed with no control",
  },
  acid: {
    id: "acid",
    label: "Acid",
    mu_eff: 0.40,
    speedMult: 0.70,
    spinDecayAccel: 8,      // strongest spin damage — corrosion mechanic
    description: "Acid — damages spin at the fastest rate; contact is lethal at low spin",
  },
  mud: {
    id: "mud",
    label: "Mud",
    mu_eff: 1.75,           // extreme drag — nearly immobilising
    speedMult: 0.40,
    spinDecayAccel: 0,
    description: "Mud — extreme drag; soft ground friction; bey barely moves",
  },
  sand: {
    id: "sand",
    label: "Sand",
    mu_eff: 0.45,
    speedMult: 0.65,
    spinDecayAccel: 0,
    description: "Sand — soft ground; moderate friction increase; desert arena zones",
  },
  oil: {
    id: "oil",
    label: "Oil",
    mu_eff: 0.08,           // very low friction; controlled slide
    speedMult: 1.10,
    spinDecayAccel: 0,
    description: "Oil slick — very low friction; slight speed boost; slippery but controllable",
  },
};

/**
 * Resolve liquid type by ID. Fallback to 'water' for unknown types.
 */
export function resolveLiquidType(liquidTypeId: string): LiquidTypeProfile {
  if (LiquidTypeRegistry[liquidTypeId]) return LiquidTypeRegistry[liquidTypeId];
  console.warn(`[LiquidTypeRegistry] Unknown liquidTypeId "${liquidTypeId}" — defaulting to water`);
  return LiquidTypeRegistry["water"];
}

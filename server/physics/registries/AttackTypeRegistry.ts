/**
 * AttackTypeRegistry — attack type physics constants from INDEX_A–E case studies.
 * Each attack type defines how a contact translates into spin delta, tilt, and damage.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface AttackTypeProfile {
  id: string;
  frictionMu: number;      // friction multiplier applied to contact force
  spinDeltaMult: number;   // multiplier on spin stolen from opponent
  tiltIncrement: number;   // degrees added to beyTiltAngle on contact
  recoilFactor: number;    // fraction of impulse reflected back to attacker
  description: string;
}

export const AttackTypeRegistry: Record<string, AttackTypeProfile> = {
  smash: {
    id: "smash",
    frictionMu: 0.85,
    spinDeltaMult: 0.5,
    tiltIncrement: 0.0,
    recoilFactor: 0.7,
    description: "Horizontal impact — high lateral transfer; recoil scales with protrusion count",
  },
  upper: {
    id: "upper",
    frictionMu: 0.70,
    spinDeltaMult: 0.3,
    tiltIncrement: 3.5,    // F_upper = F_N × sin(slopeAngle_deg); tilt applied per hit
    recoilFactor: 0.4,
    description: "Upward ramp contact — destabilises tilt angle; F_upper = F_N × sin(α)",
  },
  absorb: {
    id: "absorb",
    frictionMu: 0.20,
    spinDeltaMult: 1.8,    // primary mechanic is spin steal, not damage
    tiltIncrement: 0.0,
    recoilFactor: 0.1,
    description: "Low-friction spin steal — low recoil; transfers spin via low-μ contact",
  },
  burst: {
    id: "burst",
    frictionMu: 0.95,
    spinDeltaMult: 0.4,
    tiltIncrement: 0.0,
    recoilFactor: 0.8,
    description: "Burst-targeted contact — highest μ; damages burst resistance directly",
  },
  defense: {
    id: "defense",
    frictionMu: 0.50,
    spinDeltaMult: 0.1,
    tiltIncrement: 0.0,
    recoilFactor: 1.2,     // reflects force back — high recoil on attacker
    description: "Defensive deflection — high recoil on attacker; minimal spin damage",
  },
  barrage: {
    id: "barrage",
    frictionMu: 0.70,
    spinDeltaMult: 0.3,
    tiltIncrement: 0.5,
    recoilFactor: 0.5,
    description: "Multi-hit rapid contact — moderate per-hit; frequency makes it effective",
  },
  force_smash: {
    id: "force_smash",
    frictionMu: 0.80,
    spinDeltaMult: 0.4,
    tiltIncrement: 0.5,
    recoilFactor: 0.6,
    description: "Downward-angled smash — combines horizontal impact with downward force vector",
  },
  spin_equalize: {
    id: "spin_equalize",
    frictionMu: 0.15,
    spinDeltaMult: 2.2,    // extreme spin steal
    tiltIncrement: 0.0,
    recoilFactor: 0.05,
    description: "Opposite-spin contact — Fafnir style; spin equalization drives opponent to 0",
  },
};

/**
 * Resolve attack type profile by ID with fallback to 'smash'.
 */
export function resolveAttackType(attackTypeId: string): AttackTypeProfile {
  if (AttackTypeRegistry[attackTypeId]) return AttackTypeRegistry[attackTypeId];
  console.warn(`[AttackTypeRegistry] Unknown attackTypeId "${attackTypeId}" — defaulting to smash`);
  return AttackTypeRegistry["smash"];
}

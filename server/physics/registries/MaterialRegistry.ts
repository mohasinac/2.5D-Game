/**
 * MaterialRegistry — physics-confirmed material constants from INDEX_A–E case studies.
 * μ_k = kinetic friction coefficient | e = coefficient of restitution (COR)
 * dmgMult = contact damage multiplier when this material is the attacker
 *
 * These are TypeScript constants — never loaded from Firestore. Offline-capable.
 */

export interface MaterialProfile {
  id: string;
  mu_k: number;     // kinetic friction coefficient
  e: number;        // coefficient of restitution (COR); -1 = not applicable (bearings)
  dmgMult: number;  // base damage multiplier on contact
  description: string;
}

export const MaterialRegistry: Record<string, MaterialProfile> = {
  abs_hard: {
    id: "abs_hard",
    mu_k: 0.17,
    e: 0.67,
    dmgMult: 1.0,
    description: "Standard hard ABS — all plastic ARs, layers, most parts",
  },
  rubber_soft: {
    id: "rubber_soft",
    mu_k: 0.50,
    e: 0.25,
    dmgMult: 0.9,
    description: "Soft attack rubber — Quake, Jolt, aggressive flat tips",
  },
  rubber_hard: {
    id: "rubber_hard",
    mu_k: 0.40,
    e: 0.35,
    dmgMult: 0.9,
    description: "Hard defensive rubber — ball tips, wide defense rubber",
  },
  metal_zinc: {
    id: "metal_zinc",
    mu_k: 0.12,
    e: 0.80,
    dmgMult: 1.5,
    description: "Zinc alloy — HMS ARs, MFB Metal/Fusion Wheels, Burst Forge Discs",
  },
  metal_steel: {
    id: "metal_steel",
    mu_k: 0.10,
    e: 0.85,
    dmgMult: 1.6,
    description: "Steel — bearing races, metal pins, structural steel inserts",
  },
  bearing_steel: {
    id: "bearing_steel",
    mu_k: 0.02,
    e: -1,    // bearings do not produce COR-based collisions
    dmgMult: 0.0,
    description: "Bearing raceway — nearly frictionless; Eternal/Nothing/Orbit/Bearing tips",
  },
  iron_powder_abs: {
    id: "iron_powder_abs",
    mu_k: 0.17,
    e: 0.67,
    dmgMult: 1.0,
    description: "Iron-powder-doped ABS composite — MFB 4D Clear Wheels (φ_powder ≈ 1.5–3.3%)",
  },
  wood: {
    id: "wood",
    mu_k: 0.35,
    e: 0.55,
    dmgMult: 0.8,
    description: "Wood — arena boat decks, piers, wooden obstacle surfaces",
  },
  concrete: {
    id: "concrete",
    mu_k: 0.35,
    e: 0.60,
    dmgMult: 1.1,
    description: "Concrete — arena bowl walls, stone stadium surfaces",
  },
  water_surface: {
    id: "water_surface",
    mu_k: 1.0,   // effective μ — varies 0.8–1.2 based on depth
    e: -1,
    dmgMult: 0.0,
    description: "Water surface — liquid drag; μ_eff 0.8–1.2 depending on liquid zone config",
  },
  ice_surface: {
    id: "ice_surface",
    mu_k: 0.05,
    e: 0.90,
    dmgMult: 0.7,
    description: "Ice — arena ice zones; extremely low friction, bey slides uncontrollably",
  },
  nylon: {
    id: "nylon",
    mu_k: 0.20,
    e: 0.65,
    dmgMult: 1.0,
    description: "Nylon — some older parts and launcher components",
  },
  polycarbonate: {
    id: "polycarbonate",
    mu_k: 0.17,
    e: 0.67,
    dmgMult: 0.95,
    description: "Polycarbonate — MFB Clear Wheels (standard, undoped)",
  },
  pom: {
    id: "pom",
    mu_k: 0.20,
    e: 0.63,
    dmgMult: 1.05,
    description: "POM (Polyoxymethylene / Delrin) — some tip and gear components",
  },
};

/**
 * Resolve a material by ID with fallback chain.
 * Unknown materialId → logs warning → returns abs_hard.
 * Rule: engine never throws on unknown material; gimmick logic (upper/smash/deflect)
 * is driven by WingDef geometry, NOT by material.
 */
export function resolveMaterial(materialId: string): MaterialProfile {
  if (MaterialRegistry[materialId]) return MaterialRegistry[materialId];

  // Fallback chain
  if (materialId.startsWith("rubber")) return MaterialRegistry["rubber_soft"];
  if (materialId.startsWith("metal")) return MaterialRegistry["metal_zinc"];
  if (materialId.startsWith("bearing")) return MaterialRegistry["bearing_steel"];
  if (materialId.startsWith("iron_powder")) return MaterialRegistry["iron_powder_abs"];

  console.warn(`[MaterialRegistry] Unknown materialId "${materialId}" — defaulting to abs_hard`);
  return MaterialRegistry["abs_hard"];
}

/**
 * Compute COR between two surfaces. Returns average of their e values.
 * If either is a bearing (e=-1), returns the other's value (bearing absorbs collision energy).
 */
export function resolveCOR(mat1Id: string, mat2Id: string): number {
  const m1 = resolveMaterial(mat1Id);
  const m2 = resolveMaterial(mat2Id);
  if (m1.e < 0) return Math.max(0, m2.e);
  if (m2.e < 0) return Math.max(0, m1.e);
  return (m1.e + m2.e) / 2;
}

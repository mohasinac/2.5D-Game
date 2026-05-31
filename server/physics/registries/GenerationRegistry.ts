/**
 * GenerationRegistry — generation-specific physics constants from INDEX_A–E case studies.
 * ω₀ at launch, I_total ranges, mass ranges, stat caps per generation.
 *
 * These are physics facts from real Beyblade measurement data — TypeScript constants only.
 */

export type BeybladeGenKey =
  | "plastics"
  | "hms"
  | "mfb"
  | "burst_v1"
  | "burst_choz"
  | "burst_db"
  | "bx";

export interface GenerationProfile {
  id: BeybladeGenKey;
  label: string;
  omega0_rads: number;        // ω₀ at launch (rad/s)
  massMin_g: number;
  massMax_g: number;
  I_min_kgm2: number;         // minimum I_total (kg·m²)
  I_max_kgm2: number;         // maximum I_total (kg·m²)
  r_outer_typical_cm: number; // typical outer radius (cm)
  statCap: number;            // max stat value per category (attack/defense/stamina)
  description: string;
}

/** Generation-keyed ω₀ constants (rad/s at launch). */
export const GENERATION_OMEGA_0: Record<BeybladeGenKey, number> = {
  plastics:    400,
  hms:         450,
  mfb:         600,
  burst_v1:    700,
  burst_choz:  750,
  burst_db:    750,
  bx:          750,
};

export const GenerationRegistry: Record<BeybladeGenKey, GenerationProfile> = {
  plastics: {
    id: "plastics",
    label: "Plastic Gen (SGS / EGS / BGS)",
    omega0_rads: 400,
    massMin_g: 10,
    massMax_g: 25,
    I_min_kgm2: 1e-6,
    I_max_kgm2: 5e-6,
    r_outer_typical_cm: 3.2,
    statCap: 120,
    description: "Original Plastic Generation (1999–2004). Lower ω₀ due to launcher tech. High recoil risk.",
  },
  hms: {
    id: "hms",
    label: "Heavy Metal System (HMS)",
    omega0_rads: 450,
    massMin_g: 15,
    massMax_g: 35,
    I_min_kgm2: 5e-6,
    I_max_kgm2: 15e-6,
    r_outer_typical_cm: 2.2,
    statCap: 130,
    description: "HMS (2003–2004). Zinc-alloy ARs boost attack ceiling. More compact than Plastics.",
  },
  mfb: {
    id: "mfb",
    label: "Metal Fight Beyblade (MFB / 4D / Zero-G)",
    omega0_rads: 600,
    massMin_g: 20,
    massMax_g: 45,
    I_min_kgm2: 1e-5,
    I_max_kgm2: 3e-5,
    r_outer_typical_cm: 3.4,
    statCap: 140,
    description: "MFB / 4D / Zero-G (2008–2013). 4D system broadens all stats. Metal FW dominates I.",
  },
  burst_v1: {
    id: "burst_v1",
    label: "Burst Standard / Dual Layer",
    omega0_rads: 700,
    massMin_g: 30,
    massMax_g: 60,
    I_min_kgm2: 1.5e-5,
    I_max_kgm2: 3.5e-5,
    r_outer_typical_cm: 3.2,
    statCap: 150,
    description: "Burst Standard / DLS (2015–2017). Click-burst gimmick introduced.",
  },
  burst_choz: {
    id: "burst_choz",
    label: "Cho-Z / GT / Sparking / DB",
    omega0_rads: 750,
    massMin_g: 35,
    massMax_g: 80,
    I_min_kgm2: 1.85e-5,
    I_max_kgm2: 5.712e-5,  // max: Triumph Dragon DB (79.7g, I=5.712×10⁻⁵)
    r_outer_typical_cm: 3.5,
    statCap: 150,
    description: "Cho-Z / GT / Sparking / DB / BU (2018–2022). Heaviest era. Triumph Dragon 79.7g record.",
  },
  burst_db: {
    id: "burst_db",
    label: "Dynamite Battle / QuadDrive",
    omega0_rads: 750,
    massMin_g: 50,
    massMax_g: 80,
    I_min_kgm2: 2.5e-5,
    I_max_kgm2: 5.712e-5,
    r_outer_typical_cm: 3.8,
    statCap: 150,
    description: "DB / BU era (2021–2023). Heaviest DB Core assemblies. Same caps as Cho-Z; higher I_total distribution.",
  },
  bx: {
    id: "bx",
    label: "Beyblade X (BX / X-Dash)",
    omega0_rads: 750,
    massMin_g: 32,
    massMax_g: 40,
    I_min_kgm2: 1.5e-5,
    I_max_kgm2: 2.5e-5,
    r_outer_typical_cm: 3.0,
    statCap: 150,
    description: "BX (2023+). Lighter than DB era — XD system removed outer Frame. X-Line rail compensates via spin boost.",
  },
};

/**
 * Resolve ω₀ for a generation. Falls back to burst_v1 (700 rad/s) for unknown generations.
 */
export function resolveOmega0(generationId: string): number {
  return GENERATION_OMEGA_0[generationId as BeybladeGenKey] ?? 700;
}

/**
 * Compute stat bonus fraction from I_total vs generation I_max (0–0.15 range).
 * Used for: bey.maxSpin = GENERATION_OMEGA_0[gen] × (1 + statBonus)
 */
export function computeStatBonusFraction(
  I_total_kgm2: number,
  generationId: string
): number {
  const gen = GenerationRegistry[generationId as BeybladeGenKey];
  if (!gen) return 0;
  const fraction = (I_total_kgm2 - gen.I_min_kgm2) / (gen.I_max_kgm2 - gen.I_min_kgm2);
  return Math.min(0.15, Math.max(0, fraction * 0.15));
}

// [2.5D] Runtime constants for the Beyblade part system.
// This file has NO imports from beybladeSystem.ts to avoid circular dependencies.
// beybladeSystem.ts re-exports these constants for backward compatibility.
// Server-side physics (PartPhysics.ts) may import directly from here.

// ─── Material Multipliers (CP physics) ───────────────────────────────────────
// Used by computeBeybladeStats() when building pointsOfContact / spinStealPoints.

export const MATERIAL_MULTIPLIERS: Record<
  string,
  { damage: number; spinSteal: number; recoil: number }
> = {
  abs:          { damage: 1.0, spinSteal: 0.5, recoil: 0.7 },
  rubber:       { damage: 0.7, spinSteal: 1.5, recoil: 0.4 },
  metal:        { damage: 1.5, spinSteal: 0.8, recoil: 1.2 },
  nylon:        { damage: 1.0, spinSteal: 0.6, recoil: 0.8 },
  pc:           { damage: 0.9, spinSteal: 0.6, recoil: 0.8 },
  pom:          { damage: 1.1, spinSteal: 0.7, recoil: 0.9 },
  polycarbonate:{ damage: 0.9, spinSteal: 0.6, recoil: 0.8 },
};

// ─── Material Stats System ────────────────────────────────────────────────────
// Shape (geometry) × Material (surface) = final physics stats.

export interface MaterialStats {
  gripMult: number;        // multiplier on base grip factor
  recoilMult: number;      // multiplier on base recoil factor
  frictionMult: number;    // multiplier on floor surface friction
  spinStealResist: number; // 0=fully susceptible, 1=fully immune
  decayMod: number;        // multiplier on spin decay rate (>1 = faster decay)
  density: number;         // relative density (abs=1.0 baseline)
}

export const MATERIAL_STATS: Record<string, MaterialStats> = {
  abs:          { gripMult: 1.0, recoilMult: 1.0,  frictionMult: 1.0, spinStealResist: 1.0,  decayMod: 1.0, density: 1.0  },
  rubber:       { gripMult: 2.8, recoilMult: 0.35, frictionMult: 2.94, spinStealResist: 0.5,  decayMod: 1.3, density: 1.3  },
  metal:        { gripMult: 0.3, recoilMult: 0.7,  frictionMult: 0.71, spinStealResist: 0.85, decayMod: 0.9, density: 3.8  },
  nylon:        { gripMult: 1.2, recoilMult: 0.9,  frictionMult: 1.1, spinStealResist: 1.0,  decayMod: 1.0, density: 0.85 },
  pc:           { gripMult: 1.1, recoilMult: 1.1,  frictionMult: 1.0, spinStealResist: 1.0,  decayMod: 1.0, density: 0.8  },
  pom:          { gripMult: 1.2, recoilMult: 0.9,  frictionMult: 1.1, spinStealResist: 1.0,  decayMod: 1.0, density: 0.85 },
  polycarbonate:{ gripMult: 1.1, recoilMult: 1.1,  frictionMult: 1.0, spinStealResist: 1.0,  decayMod: 1.0, density: 0.8  },
};

// ─── Generation Normalization Ranges ──────────────────────────────────────────
// Physical parameter ranges per generation, used for stat normalization and
// cross-gen contact height gating.

export type BeybladeGeneration = "plastic" | "hms" | "metal_fight" | "burst" | "x_gen";

export interface GenerationRange {
  massMin: number;
  massMax: number;
  avgContactHeightMm: number;
  contactHeightRange: { min: number; max: number };
}

export const GENERATION_RANGES: Record<BeybladeGeneration, GenerationRange> = {
  plastic:     { massMin: 18, massMax: 35, avgContactHeightMm: 18, contactHeightRange: { min: 12, max: 24 } },
  hms:         { massMin: 28, massMax: 42, avgContactHeightMm: 16, contactHeightRange: { min: 12, max: 20 } },
  metal_fight: { massMin: 35, massMax: 48, avgContactHeightMm: 22, contactHeightRange: { min: 17, max: 28 } },
  burst:       { massMin: 32, massMax: 45, avgContactHeightMm: 10, contactHeightRange: { min: 5,  max: 15 } },
  x_gen:       { massMin: 45, massMax: 75, avgContactHeightMm: 10, contactHeightRange: { min: 5,  max: 14 } },
};

// ─── Part Type → Firestore Collection Map ─────────────────────────────────────
// Canonical mapping used by admin CRUD pages and the converter.

export const PART_TYPE_COLLECTION: Record<string, string> = {
  attack_ring: "attack_ring_parts",
  sub_part:    "sub_parts",
  weight_disk: "weight_disk_parts",
  tip:         "tip_parts",
  core:        "core_parts",
  casing:      "casing_parts",
  bit_beast:   "bit_beast_parts",
  spin_track:  "spin_track_parts",
  gear:        "gear_parts",
};

// ─── Part Type → URL slug Map ─────────────────────────────────────────────────
// URL slugs used in admin /admin/2d/parts/:partType routes.

export const PART_TYPE_SLUG: Record<string, string> = {
  attack_ring: "attack-rings",
  sub_part:    "sub-parts",
  weight_disk: "weight-disks",
  tip:         "tips",
  core:        "cores",
  casing:      "casings",
  bit_beast:   "bit-beasts",
  spin_track:  "spin-tracks",
  gear:        "gears",
};

// Reverse map — slug → canonical part type key
export const SLUG_TO_PART_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(PART_TYPE_SLUG).map(([k, v]) => [v, k])
);

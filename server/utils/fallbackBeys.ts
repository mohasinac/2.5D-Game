// Fallback 2.5D part bundles — used when Firestore has no BeybladeSystem doc.
// Storm Pegasus 105RF (CS13 Case 1715), Dark Wolf DF145FS (Case 852),
// and individual part exports (ED145 spin track — Case 1053).
//
// MFB slot mapping:
//   attackRingId  → Fusion Wheel (AR)
//   weightDiskId  → Energy Ring (lightweight cosmetic ring, ~2–3 g)
//   spinTrackId   → Spin Track (105, DF145, ED145, etc.)
//   tipId         → Performance Tip (RF, FS, etc.)
//   casingId      → Base casing body

import type {
  BeybladeSystem,
  ARPart,
  WDPart,
  TipPart,
  CasingPart,
  SpinTrackPart,
} from "../../shared/types/beybladeSystem";
import type { ResolvedPartBundle } from "../rooms/PartSystemManager";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const CIRCLE_SHAPE = { type: "preset" as const, preset: "circle" as const };
const EMPTY_IMAGES = {};
const NO_POCKETS: never[] = [];
const NO_COMBOS: never[] = [];

// ─── Shared Energy Rings (cosmetic + minor weight) ────────────────────────────

const PEGASUS_ENERGY_RING: WDPart = {
  id: "pegasus_energy_ring_fallback",
  displayName: "Pegasus Energy Ring",
  color: "#88bbff",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "wd",
  category: "round",
  dimensions: { height: 9, outerRadius: 18, innerRadius: 8 },
  materials: [{ material: "abs", coverage: 1.0 }],
  weight: 2.4,
  gyroscopicStability: 0.30,
  contactPoints: [],
  configurations: [],
};

const WOLF_ENERGY_RING: WDPart = {
  id: "wolf_energy_ring_fallback",
  displayName: "Wolf Energy Ring",
  color: "#884444",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "wd",
  category: "round",
  dimensions: { height: 9, outerRadius: 18, innerRadius: 8 },
  materials: [{ material: "abs", coverage: 1.0 }],
  weight: 2.2,
  gyroscopicStability: 0.30,
  contactPoints: [],
  configurations: [],
};

// ─── Spin Tracks ──────────────────────────────────────────────────────────────

/**
 * 105 Spin Track — 10.5 mm short-height plain ABS track, 1.6 g.
 * Minimal contact, low height advantage — favours attack (lower CoM).
 */
export const TRACK_105: SpinTrackPart = {
  id: "track_105_fallback",
  displayName: "105 Spin Track",
  color: "#cccccc",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "spin_track",
  height: 10.5,
  dimensions: { height: 10.5, outerRadius: 10, innerRadius: 3 },
  materials: [{ material: "abs", coverage: 1.0 }],
  weight: 1.6,
  trackRigidity: 0.95,
  heightAdvantage: 0.724, // 10.5 / 14.5 reference
  configurations: [],
};

/**
 * DF145 (Deflector 145) Spin Track — 14.5 mm, 2.8 g.
 * Four fixed down-slanting deflector wings that divert upward strikes downward.
 * Non-free-rotating (rigid wings), trackRigidity high.
 * Used on Dark Wolf DF145FS (Case 852).
 */
export const TRACK_DF145: SpinTrackPart = {
  id: "track_df145_fallback",
  displayName: "DF145 Deflector Spin Track",
  color: "#888888",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "spin_track",
  height: 14.5,
  dimensions: { height: 14.5, outerRadius: 22, innerRadius: 3 },
  materials: [{ material: "abs", coverage: 1.0 }],
  weight: 2.8,
  trackRigidity: 0.90,   // rigid deflector wings — no free rotation
  heightAdvantage: 1.0,  // 14.5 / 14.5 = reference height
  wingProtrusions: {
    count: 4,
    contactPoints: [
      { angle: 0,   width: 45, radius: 21, thickness: 3.5, extends: false, extendThreshold: 0.5, extendedRadius: 21, extendedWidth: 45, extendedThickness: 3.5, heightRange: { min: 10, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.75, partLayer: "spin_track" },
      { angle: 90,  width: 45, radius: 21, thickness: 3.5, extends: false, extendThreshold: 0.5, extendedRadius: 21, extendedWidth: 45, extendedThickness: 3.5, heightRange: { min: 10, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.75, partLayer: "spin_track" },
      { angle: 180, width: 45, radius: 21, thickness: 3.5, extends: false, extendThreshold: 0.5, extendedRadius: 21, extendedWidth: 45, extendedThickness: 3.5, heightRange: { min: 10, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.75, partLayer: "spin_track" },
      { angle: 270, width: 45, radius: 21, thickness: 3.5, extends: false, extendThreshold: 0.5, extendedRadius: 21, extendedWidth: 45, extendedThickness: 3.5, heightRange: { min: 10, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.75, partLayer: "spin_track" },
    ],
  },
  configurations: [],
};

/**
 * ED145 (Eternal Defense 145) Spin Track — Case 1053.
 * 14.5 mm, 3.6 g (hub 2.4 g + 3 wings × 0.4 g).
 * Three free-rotating wings on a FRICTION-FIT plastic pivot (NOT a ball bearing).
 *
 * Physics:
 *   Wing I (each):  1.33×10⁻⁸ kg·m²  (I = ⅓ × 0.4g × (15−5 mm)²)
 *   Pivot friction: τ_pivot = 2.63×10⁻³ N·m per hit at 5 N impact
 *   Energy loss:    ~12% per hit (vs BD145 bearing = 0%).
 *   Defense tier:   BD145 > C145 > ED145 ≈ WD145 (Case 1053 hierarchy).
 *
 * Encoded as:
 *   trackRigidity = 0.70  (friction pivot reduces rigid-body response vs BD145)
 *   wingProtrusions.contactPoints with damageMultiplier = 0.88  (88% effective absorption)
 *   statModifier: reduces recoilFactor by 0.12 on hit_received (12% friction energy loss)
 */
export const TRACK_ED145: SpinTrackPart = {
  id: "track_ed145_fallback",
  displayName: "ED145 Eternal Defense Spin Track",
  color: "#aaaacc",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "spin_track",
  height: 14.5,
  dimensions: { height: 14.5, outerRadius: 15, innerRadius: 3 },
  materials: [{ material: "abs", coverage: 1.0 }],
  weight: 3.6,
  trackRigidity: 0.70,  // friction pivot (plain plastic, not bearing); less efficient than BD145
  heightAdvantage: 1.0, // 14.5 / 14.5 = reference height
  wingProtrusions: {
    count: 3,
    // Three free-rotating wings at 120° intervals.
    // damageMultiplier 0.88 models the 12% energy loss from friction-pivot steal.
    // attackType "absorb" — wings deflect/absorb, not smash.
    contactPoints: [
      { angle: 0,   width: 50, radius: 15, thickness: 3, extends: false, extendThreshold: 0.5, extendedRadius: 15, extendedWidth: 50, extendedThickness: 3, heightRange: { min: 8, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.88, partLayer: "spin_track" },
      { angle: 120, width: 50, radius: 15, thickness: 3, extends: false, extendThreshold: 0.5, extendedRadius: 15, extendedWidth: 50, extendedThickness: 3, heightRange: { min: 8, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.88, partLayer: "spin_track" },
      { angle: 240, width: 50, radius: 15, thickness: 3, extends: false, extendThreshold: 0.5, extendedRadius: 15, extendedWidth: 50, extendedThickness: 3, heightRange: { min: 8, max: 15 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "absorb" }, damageMultiplier: 0.88, partLayer: "spin_track" },
    ],
  },
  // Friction pivot costs ~12% of impact energy per hit (τ_pivot × Δθ energy loss).
  statModifiers: [
    { targetStat: "recoilFactor", operation: "multiply", value: 0.88, event: "on_hit_received" },
  ],
  configurations: [],
};

// ─── Storm Pegasus 105RF ─────────────────────────────────────────────────────

/** Storm Fusion Wheel — 3 smash blades at 0° / 120° / 240°, ABS, attack type. */
const STORM_AR: ARPart = {
  id: "storm_pegasus_ar_fallback",
  displayName: "Storm Wheel",
  color: "#1a6fe8",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "ar",
  dimensions: { height: 9, outerRadius: 34, innerRadius: 8 },
  materials: [{ material: "abs", coverage: 1.0 }],
  recoilFactor: 0.75,
  smashEfficiency: 0.80,
  contactPoints: [
    { angle: 0,   width: 40, radius: 33, thickness: 5, extends: true,  extendThreshold: 0.6, extendedRadius: 35, extendedWidth: 44, extendedThickness: 6, heightRange: { min: 4, max: 9 }, material: "abs", attackType: "smash", spinBehavior: { rightPin: "smash", leftPin: "absorb" }, damageMultiplier: 1.5, partLayer: "ar" },
    { angle: 120, width: 40, radius: 33, thickness: 5, extends: true,  extendThreshold: 0.6, extendedRadius: 35, extendedWidth: 44, extendedThickness: 6, heightRange: { min: 4, max: 9 }, material: "abs", attackType: "smash", spinBehavior: { rightPin: "smash", leftPin: "absorb" }, damageMultiplier: 1.5, partLayer: "ar" },
    { angle: 240, width: 40, radius: 33, thickness: 5, extends: true,  extendThreshold: 0.6, extendedRadius: 35, extendedWidth: 44, extendedThickness: 6, heightRange: { min: 4, max: 9 }, material: "abs", attackType: "smash", spinBehavior: { rightPin: "smash", leftPin: "absorb" }, damageMultiplier: 1.5, partLayer: "ar" },
  ],
  configurations: [],
};

/** RF (Rubber Flat) Performance Tip — wide rubber, very high grip, aggressive movement. */
const STORM_TIP: TipPart = {
  id: "storm_pegasus_tip_fallback",
  displayName: "RF (Rubber Flat)",
  color: "#1a1a1a",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: false,
  slotsInto: "tip",
  tipShape: "rubber_flat",
  material: "rubber",
  dimensions: { height: 3.5, tipWidth: 3.2 },
  freeSpin: false,
  gripFactor: 0.75,
  aggressiveness: 0.9,
  materials: [{ material: "rubber", coverage: 1.0, wearSchedule: [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 45 }] }],
  configurations: [],
};

/** Standard MFB casing (Pegasus base body). */
const STORM_CASING: CasingPart = {
  id: "storm_pegasus_casing_fallback",
  displayName: "Pegasus Casing",
  color: "#d0d0d0",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "casing",
  dimensions: { height: 6, outerRadius: 20, innerRadius: 4 },
  materials: [{ material: "abs", coverage: 1.0 }],
  contactPoints: [],
  slots: {
    tipSlot: { position: "center", radius: 4 },
    coreSlot: { enabled: false, radius: 0, depth: 0 },
  },
  configurations: [],
};

const STORM_SYSTEM: BeybladeSystem = {
  id: "storm_pegasus_105rf",
  displayName: "Storm Pegasus 105RF",
  spinDirection: "right",
  generation: "metal_fight",
  attackRingId: "storm_pegasus_ar_fallback",
  attackRingFlipped: false,
  weightDiskId: "pegasus_energy_ring_fallback",
  spinTrackId: "track_105_fallback",
  tipId: "storm_pegasus_tip_fallback",
  casingId: "storm_pegasus_casing_fallback",
  subPartAttachments: [],
  gearAttachments: [],
  activeConfigs: {},
  specialMove: {
    name: "Stampede Rush",
    description: "Linear force burst in facing direction + spin boost",
    steps: [
      { effectId: "dashForce", delayTicks: 0, parallel: false },
      { effectId: "spinBoost", delayTicks: 2, parallel: true },
    ],
    cancelable: false,
    locksDurationTicks: 15,
    powerCost: 100,
  },
  comboSlots: [
    { sequence: ["moveRight", "moveRight", "jump"],   effectId: "quick-dash-r" },
    { sequence: ["attack",    "attack",    "attack"], effectId: "power-thrust" },
    { sequence: ["moveLeft",  "moveRight", "attack"], effectId: "pivot-strike" },
  ],
};

export const STORM_PEGASUS_BUNDLE: { system: BeybladeSystem; parts: ResolvedPartBundle } = {
  system: STORM_SYSTEM,
  parts: {
    ar:        STORM_AR,
    wd:        PEGASUS_ENERGY_RING,
    spinTrack: TRACK_105,
    tip:       STORM_TIP,
    casing:    STORM_CASING,
    subParts:  [],
  },
};

// ─── Dark Wolf DF145FS ────────────────────────────────────────────────────────

/** Dark Fusion Wheel — 4 balanced contact points at 90° intervals, absorb/smash. */
const DARK_AR: ARPart = {
  id: "dark_wolf_ar_fallback",
  displayName: "Dark Wheel",
  color: "#3a0a2b",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "ar",
  dimensions: { height: 8, outerRadius: 25, innerRadius: 8 },
  materials: [{ material: "abs", coverage: 1.0 }],
  recoilFactor: 0.55,
  smashEfficiency: 0.65,
  contactPoints: [
    { angle: 0,   width: 35, radius: 24, thickness: 4, extends: false, extendThreshold: 0.6, extendedRadius: 24, extendedWidth: 35, extendedThickness: 4, heightRange: { min: 3, max: 8 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "smash" }, damageMultiplier: 1.1, partLayer: "ar" },
    { angle: 90,  width: 35, radius: 24, thickness: 4, extends: false, extendThreshold: 0.6, extendedRadius: 24, extendedWidth: 35, extendedThickness: 4, heightRange: { min: 3, max: 8 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "smash" }, damageMultiplier: 1.1, partLayer: "ar" },
    { angle: 180, width: 35, radius: 24, thickness: 4, extends: false, extendThreshold: 0.6, extendedRadius: 24, extendedWidth: 35, extendedThickness: 4, heightRange: { min: 3, max: 8 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "smash" }, damageMultiplier: 1.1, partLayer: "ar" },
    { angle: 270, width: 35, radius: 24, thickness: 4, extends: false, extendThreshold: 0.6, extendedRadius: 24, extendedWidth: 35, extendedThickness: 4, heightRange: { min: 3, max: 8 }, material: "abs", attackType: "absorb", spinBehavior: { rightPin: "absorb", leftPin: "smash" }, damageMultiplier: 1.1, partLayer: "ar" },
  ],
  configurations: [],
};

/** FS (Flat Sharp) Performance Tip — narrow flat, low grip, stamina/defensive movement. */
const DARK_TIP: TipPart = {
  id: "dark_wolf_tip_fallback",
  displayName: "FS (Flat Sharp)",
  color: "#222222",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: false,
  slotsInto: "tip",
  tipShape: "semi_flat",
  material: "abs",
  dimensions: { height: 3.0, tipWidth: 0.8 },
  freeSpin: false,
  gripFactor: 0.35,
  aggressiveness: 0.5,
  materials: [{ material: "abs", coverage: 1.0 }],
  configurations: [],
};

/** Standard MFB casing (Dark Wolf base). */
const DARK_CASING: CasingPart = {
  id: "dark_wolf_casing_fallback",
  displayName: "Dark Wolf Casing",
  color: "#1a0810",
  geometry: CIRCLE_SHAPE,
  compatibilityTags: ["mfb"],
  requiredCompatibility: [],
  excludedCompatibility: [],
  images: EMPTY_IMAGES,
  pockets: NO_POCKETS,
  comboEffects: NO_COMBOS,
  rotatable: true,
  slotsInto: "casing",
  dimensions: { height: 6, outerRadius: 19, innerRadius: 4 },
  materials: [{ material: "abs", coverage: 1.0 }],
  contactPoints: [],
  slots: {
    tipSlot: { position: "center", radius: 4 },
    coreSlot: { enabled: false, radius: 0, depth: 0 },
  },
  configurations: [],
};

const DARK_SYSTEM: BeybladeSystem = {
  id: "dark_wolf_df145fs",
  displayName: "Dark Wolf DF145FS",
  spinDirection: "right",
  generation: "metal_fight",
  attackRingId: "dark_wolf_ar_fallback",
  attackRingFlipped: false,
  weightDiskId: "wolf_energy_ring_fallback",
  spinTrackId: "track_df145_fallback",
  tipId: "dark_wolf_tip_fallback",
  casingId: "dark_wolf_casing_fallback",
  subPartAttachments: [],
  gearAttachments: [],
  activeConfigs: {},
  specialMove: {
    name: "Spin Recovery",
    description: "Orbital force (circular path) and gradual spin recovery",
    steps: [
      { effectId: "orbitForce",   delayTicks: 0, parallel: false },
      { effectId: "spinBoost",    delayTicks: 5, parallel: true  },
      { effectId: "wobbleDampen", delayTicks: 0, parallel: true  },
    ],
    cancelable: true,
    locksDurationTicks: 0,
    powerCost: 100,
  },
  comboSlots: [
    { sequence: ["defense",  "defense",   "defense"],   effectId: "guard-tap" },
    { sequence: ["moveLeft", "attack",    "moveRight"], effectId: "spin-leech-jab" },
    { sequence: ["moveLeft", "moveLeft",  "jump"],      effectId: "quick-dash-l" },
  ],
};

export const DARK_WOLF_BUNDLE: { system: BeybladeSystem; parts: ResolvedPartBundle } = {
  system: DARK_SYSTEM,
  parts: {
    ar:        DARK_AR,
    wd:        WOLF_ENERGY_RING,
    spinTrack: TRACK_DF145,
    tip:       DARK_TIP,
    casing:    DARK_CASING,
    subParts:  [],
  },
};

// ─── Individual part fallback lookup ─────────────────────────────────────────
// Used by loadBeybladeSystemBundle when a specific part ID has no Firestore doc.

const FALLBACK_PARTS: Record<string, ARPart | WDPart | TipPart | CasingPart | SpinTrackPart> = {
  "track_ed145_fallback":           TRACK_ED145,
  "track_df145_fallback":           TRACK_DF145,
  "track_105_fallback":             TRACK_105,
  "storm_pegasus_ar_fallback":      STORM_AR,
  "storm_pegasus_tip_fallback":     STORM_TIP,
  "storm_pegasus_casing_fallback":  STORM_CASING,
  "pegasus_energy_ring_fallback":   PEGASUS_ENERGY_RING,
  "dark_wolf_ar_fallback":          DARK_AR,
  "dark_wolf_tip_fallback":         DARK_TIP,
  "dark_wolf_casing_fallback":      DARK_CASING,
  "wolf_energy_ring_fallback":      WOLF_ENERGY_RING,
};

export function getFallbackPart<T>(partId: string): T | undefined {
  return FALLBACK_PARTS[partId] as T | undefined;
}

// ─── System bundle lookup ─────────────────────────────────────────────────────

export function getFallbackBundle(systemId: string): { system: BeybladeSystem; parts: ResolvedPartBundle } | null {
  if (systemId === "storm_pegasus_105rf") return STORM_PEGASUS_BUNDLE;
  if (systemId === "dark_wolf_df145fs")   return DARK_WOLF_BUNDLE;
  return null;
}

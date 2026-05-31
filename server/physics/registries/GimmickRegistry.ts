/**
 * GimmickRegistry — 42 gimmick recipes from INDEX_A–E case studies.
 * Each gimmick maps to one or more MechanicRegistry handler IDs with default params.
 *
 * TypeScript constants — never loaded from Firestore.
 * Admin extends this list via gimmick_defs Firestore collection.
 */

export interface MechanicRef {
  mechanicId: string;
  params: Record<string, unknown>;
}

export interface GimmickDef {
  id: string;
  label: string;
  category: "attack" | "defense" | "stamina" | "gimmick" | "arena";
  behaviorRefs: MechanicRef[];
  description: string;
}

export const GimmickRegistry: Record<string, GimmickDef> = {
  // ── ATTACK GIMMICKS ──────────────────────────────────────────────────────────
  smash_attack: {
    id: "smash_attack",
    label: "Smash Attack",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "smash_impact", params: { dmgMult: 1.0 } },
    ],
    description: "Standard horizontal smash — high lateral impulse on contact",
  },
  upper_attack: {
    id: "upper_attack",
    label: "Upper Attack",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "upper_launch", params: { slopeAngle_deg: 35, effectiveWindowDeg: 70 } },
    ],
    description: "Upward slope attack — destabilises opponent tilt on contact",
  },
  upper_omnidirectional: {
    id: "upper_omnidirectional",
    label: "Upper Omnidirectional",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "upper_launch", params: { slopeAngle_deg: 35, effectiveWindowDeg: 170 } },
    ],
    description: "Spiral slope — upper attack from any approach direction (170° window)",
  },
  compound_beak_slope: {
    id: "compound_beak_slope",
    label: "Compound Beak + Slope",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "smash_impact", params: { dmgMult: 0.46 } },
      { mechanicId: "upper_launch", params: { slopeAngle_deg: 25, effectiveWindowDeg: 60 } },
      { mechanicId: "spin_direction_bonus", params: { rsMechanic: "smash_impact", lsMechanic: "upper_launch" } },
    ],
    description: "RS: beak leads (smash); LS: slope leads (upper) — Phoenix-style hybrid",
  },
  barrage_attack: {
    id: "barrage_attack",
    label: "Barrage",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "barrage_hit", params: { hitsPerRotation: 10, dmgPerHit: 0.3 } },
    ],
    description: "Multiple small contact points — cumulative damage from frequent low-force hits",
  },
  dual_blade_sweep: {
    id: "dual_blade_sweep",
    label: "Dual Blade Sweep (Eclipse Whip-style)",
    category: "attack",
    behaviorRefs: [
      { mechanicId: "smash_impact", params: { aoeType: "arc", arcDeg: 60, arcCount: 2, arcSeparation_deg: 180, sweepRadius_cm: 8.4 } },
    ],
    description: "Two 60° arc sweeps at 180° separation — both active simultaneously in Phase 3",
  },

  // ── DEFENSE GIMMICKS ─────────────────────────────────────────────────────────
  burst_suppress: {
    id: "burst_suppress",
    label: "Burst Suppress",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { suppressMult: 0.5 } },
    ],
    description: "Spring/latch mechanism — reduces burst probability on hit",
  },
  choz_awakening: {
    id: "choz_awakening",
    label: "Cho-Z Awakening (Bistable Burst-Stop)",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { deployThreshold_rads: 500, bistable: true, requiresManualReset: true } },
      { mechanicId: "contact_deflect", params: { coverageFactor: 0.5 } },
    ],
    description: "Centrifugal bistable wings deploy at ω≥500 rad/s, block burst tabs; wings cover blade gaps",
  },
  limit_break_deploy: {
    id: "limit_break_deploy",
    label: "Limit Break Deploy",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { deployThreshold_rads: 450, bistable: true, requiresManualReset: false } },
    ],
    description: "Rubber segment bistable deployment — extends outer contact; Cho-Z era",
  },
  contact_deflect_individual: {
    id: "contact_deflect_individual",
    label: "Wing Deflect (Individual)",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "contact_deflect", params: { perWingIndependent: true, wingCount: 3, deployThreshold_N: 2.0, deflectDmgReduction: 0.40, returnTimeMs: 350 } },
    ],
    description: "C145-style — each wing pivots independently; absorbs ~40% incoming force per wing",
  },
  spring_recoil_defense: {
    id: "spring_recoil_defense",
    label: "Spring Recoil",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "spring_recoil", params: { recoilBoost: 1.5 } },
    ],
    description: "Spring mechanism returns force to attacker — punishes aggressive attackers",
  },
  dash_spring_burst: {
    id: "dash_spring_burst",
    label: "Dash Spring (Burst ×1.4)",
    category: "defense",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { alpha: 0.40 } },
    ],
    description: "Dash driver spring collar — burst resistance ×1.40; Ignition'/Accel' drivers",
  },

  // ── STAMINA GIMMICKS ─────────────────────────────────────────────────────────
  free_spin_tip: {
    id: "free_spin_tip",
    label: "Free Spin Tip (Bearing/Eternal/Nothing/Orbit)",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "free_spin", params: { decayReduction: 0.95, bearingMu: 0.02 } },
    ],
    description: "Bearing tip — tracks ω_tip separately; near-zero floor friction; extreme stamina",
  },
  eternal_defence_free_spin: {
    id: "eternal_defence_free_spin",
    label: "ED145 Free Spin Ring",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "free_spin", params: { ringMass_g: 3.2, ringRadius_cm: 2.0, bearingMu: 0.02, spinDecouplingFactor: 0.85, isolationSaturation_rads: 150 } },
    ],
    description: "Full ring on bearing — angular impulse goes to ring not body; near-total isolation",
  },
  motor_spin_boost: {
    id: "motor_spin_boost",
    label: "Motor Spin Boost (Ignition' Driver)",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "stamina_recovery", params: { spinBoost_rads2: 39.4, floorContactRequired: true, currentDraw: 0.188 } },
    ],
    description: "DC motor tip boosts spin +39.4 rad/s² while floor contact maintained",
  },
  life_after_death: {
    id: "life_after_death",
    label: "Life After Death (Fafnir spin-equalize)",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "spin_equalization", params: { oppositeSpinBonus: true, absorbWindow_ms: 200 } },
    ],
    description: "Opposite-spin contact steals and converts spin — Fafnir F3/F4/F5/F6",
  },
  lad_ring: {
    id: "lad_ring",
    label: "LAD Ring (Life After Death ring)",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "bearing_drift", params: { ladRadius_cm: 2.2, frictionAbsorb: 0.85 } },
    ],
    description: "Wide outer ring rides on wall at low spin — extends match by delaying spin-out",
  },
  c3_inertia_isotropy: {
    id: "c3_inertia_isotropy",
    label: "C₃ Inertia Isotropy",
    category: "stamina",
    behaviorRefs: [
      { mechanicId: "natural_motion", params: { nutationSuppression: true, foldSymmetry: 3 } },
    ],
    description: "C₃+ fold symmetry — I_xx = I_yy; no nutation forcing; inherently more stable",
  },

  // ── GIMMICK (MECHANICAL) ─────────────────────────────────────────────────────
  centrifugal_deploy_collective: {
    id: "centrifugal_deploy_collective",
    label: "Centrifugal Deploy (Collective)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { bistable: false, deployThreshold_rads: 400, wingCount: 3 } },
    ],
    description: "All wings/blades deploy together at ω threshold — returns to rest below threshold",
  },
  mode_switch_tip: {
    id: "mode_switch_tip",
    label: "Mode Switch Tip (Zeta'/Variable)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "mode_switch", params: { modes: ["attack", "defense", "stamina"] } },
    ],
    description: "Pre-launch mode selection — changes tip shape, μ_k, and contact geometry",
  },
  spin_direction_mode: {
    id: "spin_direction_mode",
    label: "Spin Direction Mode (Shooter Change Core Alpha/Gamma)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "mode_switch", params: { spinDirectionTriggered: true } },
    ],
    description: "Tip auto-selects based on spin direction at launch — HMS bistable tip select",
  },
  dual_spin_layer: {
    id: "dual_spin_layer",
    label: "Dual Spin (Spriggan/Longinus)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "spin_direction_bonus", params: { bothDirections: true } },
    ],
    description: "Layer functions in both spin directions — unique blade geometry for each",
  },
  spring_launch: {
    id: "spring_launch",
    label: "Spring Launch (EG Clutch)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "velocity_burst", params: { triggerOnRelease: true, boostFactor: 1.3 } },
    ],
    description: "Spring-wound EG mechanism — releases stored energy at clutch trigger moment",
  },
  centrifugal_deploy_bow: {
    id: "centrifugal_deploy_bow",
    label: "Centrifugal Deploy (Bow / Bow-Shaped AR)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "burst_suppress", params: { bistable: false, deployThreshold_rads: 300, bowExtension_cm: 0.5 } },
    ],
    description: "Plastics centrifugal AR bow — extended blades at high spin via centrifugal force",
  },
  weight_shift_disc: {
    id: "weight_shift_disc",
    label: "Weight Shift (Frame prongs lower CoM)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "weight_shift", params: { cogLower_cm: 0.3 } },
    ],
    description: "Wall Frame / heavy disc prongs — lowers CoM; reduced precession rate",
  },
  chip_separation: {
    id: "chip_separation",
    label: "Chip Separation (GT Gatinko burst)",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "sub_part_burst", params: { ejectionOnBurst: true } },
    ],
    description: "GT Gatinko chip detaches on burst — separated from layer during burst finish",
  },
  partial_sar: {
    id: "partial_sar",
    label: "Partial SAR Free-Spin",
    category: "gimmick",
    behaviorRefs: [
      { mechanicId: "spin_steal_coupling", params: { maxRotation_deg: 45, collarGap_cm: 0.2 } },
    ],
    description: "SAR partially free-spins based on AR Core collar geometry (e.g. ~45° with War Lion)",
  },

  // ── ARENA ELEMENT GIMMICKS (AE-48 unification) ────────────────────────────
  rail_lock_grip: {
    id: "rail_lock_grip",
    label: "Rail Lock (tip on ridge)",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "rail_lock", params: { tipGripCoeff: { rubber: 0.85, plastic: 0.40, sharp: 0.20 }, xdGearBonus_pct: 25 } },
    ],
    description: "Bey tip engages arena rail ridge — centripetal constraint + speed boost",
  },
  spin_zone_orbit: {
    id: "spin_zone_orbit",
    label: "Spin Zone (Orbit Force)",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "orbit_movement", params: { orbitForce_N: 0.5, spinBoost_rads2: 10 } },
    ],
    description: "Arena spin zone — tangential force + spin boost while bey is inside radius",
  },
  gravity_pull: {
    id: "gravity_pull",
    label: "Gravity Well Pull",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "center_pull", params: { pullStrength_N_per_cm: 0.2 } },
    ],
    description: "Gravity well — inward radial force scales with distance from center",
  },
  magnetic_attract: {
    id: "magnetic_attract",
    label: "Magnetic Attraction Zone",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "magnetic_pull", params: { attractMode: true, strength: 1.0 } },
    ],
    description: "Arena magnetic attract zone — pulls bey inward ∝ 1/r²",
  },
  magnetic_repel: {
    id: "magnetic_repel",
    label: "Magnetic Repel Zone",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "magnetic_pull", params: { attractMode: false, strength: 1.0 } },
    ],
    description: "Arena magnetic repel zone — pushes bey outward ∝ 1/r²",
  },
  zero_g_float_zone: {
    id: "zero_g_float_zone",
    label: "Zero-G Float Zone",
    category: "arena",
    behaviorRefs: [
      { mechanicId: "zero_g_float", params: { gravityScale: 0.3 } },
    ],
    description: "Zero-G stadium zone — reduced lateral gravity; beyblades float toward walls",
  },
};

/**
 * Resolve gimmick def by ID. Returns undefined if not found (no fallback — caller must handle).
 */
export function resolveGimmick(gimmickId: string): GimmickDef | undefined {
  return GimmickRegistry[gimmickId];
}

/**
 * Expand gimmick IDs to flat MechanicRef list (for match-start resolution).
 */
export function expandGimmicks(gimmickIds: string[]): MechanicRef[] {
  const result: MechanicRef[] = [];
  for (const id of gimmickIds) {
    const def = GimmickRegistry[id];
    if (def) {
      result.push(...def.behaviorRefs);
    }
    // Unknown gimmick IDs are silently skipped — admin can extend via gimmick_defs Firestore
  }
  return result;
}

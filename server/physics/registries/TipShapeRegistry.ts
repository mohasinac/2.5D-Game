/**
 * TipShapeRegistry — 16 tip shape profiles from INDEX_A–E case studies.
 * Shape determines movement pattern and contributes to spinDecayRate formula.
 *
 * spinDecayRate = (μ_k × mass_kg × g × contactRadius_cm) / I_total_kgm2
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface TipShapeProfile {
  id: string;
  label: string;
  contactRadius_cm: number;  // effective tip contact radius (cm)
  mu_k: number;              // kinetic friction on arena surface
  movementPattern: "aggressive_wander" | "semi_stable" | "stable" | "stationary" | "orbital" | "grip_flat" | "free_spin";
  floorContact: boolean;     // true = contacts floor; false = slope/wall only (Aerial tip)
  description: string;
}

export const TipShapeRegistry: Record<string, TipShapeProfile> = {
  sharp: {
    id: "sharp",
    label: "Sharp",
    contactRadius_cm: 0.1,
    mu_k: 0.17,
    movementPattern: "aggressive_wander",
    floorContact: true,
    description: "Single sharp point — aggressive wandering; minimal floor friction but unstable",
  },
  flat: {
    id: "flat",
    label: "Flat",
    contactRadius_cm: 0.35,
    mu_k: 0.17,
    movementPattern: "aggressive_wander",
    floorContact: true,
    description: "Flat ABS disc — aggressive wandering at high spin; fast and unpredictable",
  },
  wide_flat: {
    id: "wide_flat",
    label: "Wide Flat",
    contactRadius_cm: 0.60,
    mu_k: 0.17,
    movementPattern: "aggressive_wander",
    floorContact: true,
    description: "Wider flat tip — slightly more controllable than Flat; still aggressive",
  },
  semi_flat: {
    id: "semi_flat",
    label: "Semi-Flat",
    contactRadius_cm: 0.25,
    mu_k: 0.17,
    movementPattern: "semi_stable",
    floorContact: true,
    description: "Between sharp and flat — balance of speed and stability",
  },
  rubber_flat: {
    id: "rubber_flat",
    label: "Rubber Flat",
    contactRadius_cm: 0.40,
    mu_k: 0.50,
    movementPattern: "grip_flat",
    floorContact: true,
    description: "Rubber flat tip — extreme grip; Quake Driver style; high μ causes fast spin decay",
  },
  rubber_sharp: {
    id: "rubber_sharp",
    label: "Rubber Sharp",
    contactRadius_cm: 0.15,
    mu_k: 0.50,
    movementPattern: "aggressive_wander",
    floorContact: true,
    description: "Rubber sharp point — aggressive but grippier than ABS sharp",
  },
  ball: {
    id: "ball",
    label: "Ball",
    contactRadius_cm: 0.40,
    mu_k: 0.35,
    movementPattern: "semi_stable",
    floorContact: true,
    description: "Hard round ball tip — semi-stable; common defense tip; μ between ABS and rubber",
  },
  defense: {
    id: "defense",
    label: "Defense (D)",
    contactRadius_cm: 0.50,
    mu_k: 0.30,
    movementPattern: "stable",
    floorContact: true,
    description: "Wide flat with rounded edges — stable banking; classic defense tip",
  },
  spike: {
    id: "spike",
    label: "Spike",
    contactRadius_cm: 0.08,
    mu_k: 0.17,
    movementPattern: "stationary",
    floorContact: true,
    description: "Ultra-sharp spike — near-stationary; maximum stamina; barely any floor contact",
  },
  bearing: {
    id: "bearing",
    label: "Bearing",
    contactRadius_cm: 0.10,
    mu_k: 0.02,
    movementPattern: "free_spin",
    floorContact: true,
    description: "Bearing tip — nearly frictionless; free-spin decoupling; extreme stamina",
  },
  eternal: {
    id: "eternal",
    label: "Eternal (E)",
    contactRadius_cm: 0.12,
    mu_k: 0.02,
    movementPattern: "free_spin",
    floorContact: true,
    description: "Eternal tip — free-spin bearing; near-zero decay; maximum spin duration",
  },
  nothing: {
    id: "nothing",
    label: "Nothing (N)",
    contactRadius_cm: 0.10,
    mu_k: 0.02,
    movementPattern: "free_spin",
    floorContact: true,
    description: "Nothing tip — bearing-based free spin; Zero-G era stamina tip",
  },
  orbit: {
    id: "orbit",
    label: "Orbit",
    contactRadius_cm: 0.50,
    mu_k: 0.05,
    movementPattern: "orbital",
    floorContact: true,
    description: "Wide bearing base — orbital drift pattern; natural outward drift tendency",
  },
  accel: {
    id: "accel",
    label: "Accel",
    contactRadius_cm: 0.30,
    mu_k: 0.25,
    movementPattern: "semi_stable",
    floorContact: true,
    description: "Angled rim — moderate speed with natural banking curve toward walls",
  },
  quest: {
    id: "quest",
    label: "Quest",
    contactRadius_cm: 0.20,
    mu_k: 0.22,
    movementPattern: "stable",
    floorContact: true,
    description: "Cylinder tip — stable movement; good balance of stamina and mobility",
  },
  aerial: {
    id: "aerial",
    label: "Aerial / Air Knight",
    contactRadius_cm: 0.0,
    mu_k: 0.0,
    movementPattern: "stationary",
    floorContact: false,   // does NOT contact floor in normal upright spin; slope-only
    description: "No floor contact in upright position — contacts slopes/walls only; Wall/slope climbing",
  },
};

/**
 * Resolve tip shape by ID. Fallback to 'flat' for unknown tips.
 */
export function resolveTipShape(tipShapeId: string): TipShapeProfile {
  if (TipShapeRegistry[tipShapeId]) return TipShapeRegistry[tipShapeId];
  console.warn(`[TipShapeRegistry] Unknown tipShapeId "${tipShapeId}" — defaulting to flat`);
  return TipShapeRegistry["flat"];
}

/**
 * Compute spin decay rate (rad/s²) from assembly physics params.
 * Formula: dω/dt = -(μ_k × mass_kg × g × contactRadius_m) / I_total_kgm2
 *
 * Replace the old hardcoded: spinDecayRate = 8 * (1 - stamina * 0.001)
 */
export function computeSpinDecayRate(
  tipShapeId: string,
  totalMass_g: number,
  I_total_kgm2: number
): number {
  const tip = resolveTipShape(tipShapeId);
  const mu_k = tip.mu_k;
  const mass_kg = totalMass_g / 1000;
  const g = 9.81;
  const r_tip_m = tip.contactRadius_cm / 100;

  if (I_total_kgm2 <= 0) return 8.0; // safety fallback

  return (mu_k * mass_kg * g * r_tip_m) / I_total_kgm2;
}

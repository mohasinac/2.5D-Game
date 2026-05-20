// [2.5D] Beyblade System — part library types, shape math, and composition schema.
// This is separate from BeybladeStats — it's the modular part-library system.
// A BeybladeSystem composes parts by ID; computeBeybladeStats() converts it to BeybladeStats.

import type { BeybladeStats } from "./beybladeStats";
export type { BeybladeStats };

// ─── Core Enums ───────────────────────────────────────────────────────────────

export type Material = "abs" | "rubber" | "metal" | "pom" | "polycarbonate";
export type AttackType = "smash" | "upper" | "absorb" | "burst" | "spin_steal";

export type PartLayer =
  | "bit_beast"
  | "ar"
  | "wd"
  | "tip"
  | "core"
  | "casing"
  | "sub_part"; // generic — sub_ar / wd_sub / sub_casing all unified here

export type SubPartParent = "ar" | "wd" | "casing" | "bit_beast";
export type SubPartMode = "free_spin" | "partial_slip" | "fixed" | "ratchet";

export type TipShape =
  | "flat"
  | "sharp"
  | "semi_flat"
  | "wide"
  | "ball"
  | "spike"
  | "rubber_flat"
  | "custom";

export type WDCategory =
  | "round"
  | "wide"
  | "heavy"
  | "ten_balance"
  | "six_balance"
  | "eight_balance"
  | "custom";

export type CoreCategory = "round" | "gear" | "spring" | "bowl" | "custom";
export type CasingCategory = "round" | "wide" | "flat" | "custom";
export type BitBeastCategory =
  | "dome"
  | "pyramid"
  | "beast_silhouette"
  | "ring"
  | "custom";

export type CoreGimmick =
  | "none"
  | "speed_boost"
  | "weight_shift"
  | "magnetic"
  | "engine_gear"
  | "clutch_release";

export type SpecialMove =
  | "stampede_rush"
  | "gyro_anchor"
  | "spin_recovery"
  | "tactical_burst"
  | "custom";

// ─── Material Multipliers ─────────────────────────────────────────────────────

export const MATERIAL_MULTIPLIERS: Record<
  Material,
  { damage: number; spinSteal: number; recoil: number }
> = {
  abs: { damage: 1.0, spinSteal: 0.5, recoil: 0.7 },
  rubber: { damage: 0.7, spinSteal: 1.5, recoil: 0.4 },
  metal: { damage: 1.5, spinSteal: 0.8, recoil: 1.2 },
  pom: { damage: 1.1, spinSteal: 0.7, recoil: 0.9 },
  polycarbonate: { damage: 0.9, spinSteal: 0.6, recoil: 0.8 },
};

// ─── Mathematical Shape Representations ──────────────────────────────────────
// All shapes stored as compact mathematical forms — NOT flat pixel arrays.
// Enables: analytic normals (3D lighting), shape morphing, WebGL buffer gen, SDF export.
// Each type carries a *Cache field — derived from the math form, used for fast rendering.

export interface FourierRadialProfile {
  // r(θ) = a0 + Σ_n [ a_n·cos(n·θ_rad) + b_n·sin(n·θ_rad) ]
  // 4-blade AR: only harmonic n=4 needed → 3 numbers instead of 360.
  a0: number; // base radius mm — DC term
  harmonics: Array<{
    n: number; // order: 1=wave, 2=ellipse, 3=triangle, 4=four-blade…
    a: number; // cosine coefficient mm
    b: number; // sine coefficient mm
  }>;
  radialCache?: number[]; // 360 entries mm — re-derived when harmonics change
}

export interface BezierPathSegment {
  type: "L" | "C";
  x: number;
  y: number; // endpoint mm from center
  x1?: number;
  y1?: number; // control pt 1 (C only)
  x2?: number;
  y2?: number; // control pt 2 (C only)
}

export interface BezierPath {
  segments: BezierPathSegment[]; // closed path
  polygonCache?: Array<{ x: number; y: number }>; // ~48–120 pts, re-derived on change
  polygonTolerance?: number; // mm flatness tolerance used for polygonCache
}

export interface SplineKnot {
  height: number; // absolute from floor mm
  radius: number; // outer radius mm at this height
  tangentH?: number; // optional explicit tangent dh (Catmull-Rom if absent)
  tangentR?: number; // optional explicit tangent dr
}

export interface BezierSplineProfile {
  knots: SplineKnot[]; // 3–20 knots, height ascending
  curveCache?: Array<{ height: number; radius: number }>; // ~50 pts
}

// PartShape — universal geometry container used by BasePart.geometry
export interface PartShape {
  type: "preset" | "custom";
  preset:
    | "circle"
    | "ring"
    | "star3"
    | "star4"
    | "star6"
    | "triangle"
    | "square"
    | "hexagon";

  // TOP VIEW — plan shape (used by all view combinations)
  fourierProfile?: FourierRadialProfile; // compact radial shape; always used for CP warp math
  bezierPath?: BezierPath; // exact contour; preferred for rendering when present
  profileScale?: number; // px→mm calibration used when tracing from image

  // SIDE VIEW — revolution profile (radius vs height)
  sideProfileSpline?: BezierSplineProfile;

  // BOTTOM FACE
  // When bottomBezierPath absent:
  //   bottomMimic=true  → bottom = same bezierPath as top (mirrored)
  //   bottomMimic=false → bottom = circle at sideProfileSpline.knots[0].radius
  // Defaults: true for flat-extruded (AR/WD), false for lathe-profile (Casing/Core)
  bottomMimic?: boolean;
  bottomBezierPath?: BezierPath; // explicit bottom contour; overrides bottomMimic when set
}

// ─── Common Sub-Interfaces ────────────────────────────────────────────────────

export interface PartImages {
  topView?: string; // Storage URL — no-background PNG
  sideView?: string;
  bottomView?: string;
}

export interface PartDimensions {
  height: number; // mm — ABSOLUTE from floor
  outerRadius: number; // mm — bounding radius fallback (use computeEffectiveRadius in practice)
  innerRadius: number; // mm
}

export interface MaterialBand {
  material: Material;
  coverage: number; // 0–1; bands per part should sum to ~1
}

export interface PartPocket {
  position: { x: number; y: number }; // mm from central axis (top-down)
  height: number; // mm absolute from floor
  size: "small" | "large";
  shape: "round" | "oval" | "channel" | "arc";
  ballMaterial: "metal" | "plastic";
  ballCount: number;
  fixed: boolean; // false = ball moves under centrifugal/tilt force
}

// ─── Contact Point ────────────────────────────────────────────────────────────

export interface SystemContactPoint {
  // Circumferential position
  angle: number; // 0–360° — center of the arc
  width: number; // arc degrees — angular span; narrow=spike, wide=bumper
  radius: number; // mm from center — collision only registers at this radius
  thickness: number; // mm radial depth (radius ± thickness/2 = annular sector)

  // Extending behavior at high spin
  extends: boolean;
  extendThreshold: number; // 0–1 fraction of maxSpin to trigger
  extendedRadius: number; // mm at high spin
  extendedWidth: number; // arc degrees at high spin
  extendedThickness: number; // mm at high spin

  // Vertical range
  heightRange: { min: number; max: number }; // mm absolute from floor

  // Physics
  material: Material;
  attackType: AttackType;
  spinBehavior: {
    rightPin: AttackType; // when this bey is right-spin
    leftPin: AttackType; // when this bey is left-spin
  };
  damageMultiplier: number; // 0.8–2.5
  partLayer: PartLayer;

  // Optional roller wheel
  roller?: {
    radius: number; // mm physical size
    material: Material;
    freeSpin: boolean; // true → rubber multipliers regardless of roller.material
  };
}

// renderRadius — CP fields warp the Fourier profile outward at blade/bumper zones
// renderRadius(θ) = fourierProfile.radialCache[θ] + Σ_cp (cp.thickness × weight(θ,cp))
// weight(θ,cp) = max(0, 1 - |cp.angle - θ| / (cp.width / 2))
export function renderRadius(
  θDeg: number,
  fourierCache: number[],
  cps: Pick<SystemContactPoint, "angle" | "width" | "thickness">[]
): number {
  const base = fourierCache[Math.round(θDeg) % 360] ?? 0;
  const warp = cps.reduce((sum, cp) => {
    const diff = Math.abs(cp.angle - θDeg);
    const halfWidth = cp.width / 2;
    if (diff >= halfWidth) return sum;
    return sum + cp.thickness * (1 - diff / halfWidth);
  }, 0);
  return base + warp;
}

// synthesizeRadialCache — evaluate FourierRadialProfile at 0–359°
export function synthesizeRadialCache(fp: FourierRadialProfile): number[] {
  const cache: number[] = new Array(360);
  for (let deg = 0; deg < 360; deg++) {
    const rad = (deg * Math.PI) / 180;
    let r = fp.a0;
    for (const h of fp.harmonics) {
      r += h.a * Math.cos(h.n * rad) + h.b * Math.sin(h.n * rad);
    }
    cache[deg] = r;
  }
  return cache;
}

// ─── Config System ────────────────────────────────────────────────────────────

export interface ConfigTrigger {
  type:
    | "spin_threshold" // bey own spin < threshold (0–1 fraction of maxSpin)
    | "subpart_spin_threshold" // sub-part accumulated spin >= threshold RPM
    | "impact_threshold" // single impact force >= threshold
    | "timer" // elapsed seconds >= threshold
    | "core_activated" // engine_gear or clutch_release fires
    | "external_part_state"; // another part on same bey reaching a condition
  threshold: number;
  externalPartSlot?: PartLayer;
  externalCondition?:
    | "config_changed"
    | "subpart_spin_threshold"
    | "spin_threshold"
    | "core_activated";
  externalThreshold?: number;
}

export interface ConfigResetCondition {
  type: "spin_recovery" | "timer" | "impact";
  threshold: number;
}

export interface PartConfiguration<TOverrides> {
  name: string;
  description: string;
  overrides: TOverrides;
  autoTriggers?: ConfigTrigger[];
  resetCondition?: ConfigResetCondition;
}

// ─── Detachment Config ────────────────────────────────────────────────────────

export interface DetachmentConfig {
  enabled: boolean;
  type: "projectile" | "mini_bey" | "fragment";
  trigger: "impact_threshold" | "spin_threshold" | "timer" | "special_move";
  triggerThreshold: number;
  returnToParent: boolean;
  returnDelay?: number;
  detachedMass: number;
  detachedRadius?: number;
  detachedContactPoints?: SystemContactPoint[];
}

// ─── Base Part ────────────────────────────────────────────────────────────────

export interface BasePart {
  id: string;
  displayName: string;
  description?: string;
  color: string; // hex, default '#1a1a1a'
  geometry: PartShape; // mathematical shape (Fourier + Bezier + Spline)
  compatibilityTags: string[];
  requiredCompatibility: string[];
  excludedCompatibility: string[];
  images: PartImages;
  pockets: PartPocket[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Attack Ring ──────────────────────────────────────────────────────────────

export interface ARPart extends BasePart {
  // geometry: PartShape inherited — use geometry.bezierPath / fourierProfile
  dimensions: PartDimensions;
  materials: MaterialBand[];
  contactPoints: SystemContactPoint[];
  defaultSubARId?: string; // suggested default sub-part
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    dimensions?: Partial<PartDimensions>;
  }>[];
}

// ─── Sub-Part (generic — replaces sub_ar / wd_sub / sub_casing) ───────────────

export interface SubPart extends BasePart {
  compatibleParents: SubPartParent[];
  dimensions: PartDimensions;
  materials: MaterialBand[];
  weight: number;
  contactPoints: SystemContactPoint[];
  mode: SubPartMode;
  spinThresholdDegrees?: number; // partial_slip: degrees of rotation before lock
  lockDirection?: "clockwise" | "counterclockwise";
  lockPositions?: number[]; // ratchet: angles where sub-part momentarily locks
  lockDurationTicks?: number; // ratchet: ticks lock holds (default 3)
  slideAngle?: number; // partial_slip variant: max slide degrees (Kreis-style 60°)
  canFlip: boolean;
  detachment?: DetachmentConfig;
  configurations: PartConfiguration<{
    mode?: SubPartMode;
    contactPoints?: SystemContactPoint[];
    lockDirection?: "clockwise" | "counterclockwise";
    lockPositions?: number[];
  }>[];
}

// ─── Weight Disk ──────────────────────────────────────────────────────────────

export interface WDPart extends BasePart {
  // geometry: PartShape inherited
  category: WDCategory; // descriptive label; does NOT override geometry
  dimensions: PartDimensions;
  materials: MaterialBand[];
  weight: number;
  contactPoints: SystemContactPoint[];
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    dimensions?: Partial<PartDimensions>;
  }>[];
}

// ─── Tip ──────────────────────────────────────────────────────────────────────

export interface TipPart extends BasePart {
  // geometry: PartShape inherited (top + sideProfileSpline + bottomBezierPath for contact patch)
  tipShape: TipShape; // behavioral category — drives movement physics
  material: Material;
  dimensions: {
    height: number; // mm absolute from floor
    tipWidth: number; // mm — auto-computed from computeEffectiveRadius(geometry.bottomBezierPath)
  };
  freeSpin: boolean;
  gripFactor: number; // 0–1
  aggressiveness: number; // 0–1
  integratedCasing?: boolean; // tip assembly IS the casing (Wolborg G EG bowl)
  freeSpinOnCore?: boolean; // free-spins only when core_activated fires
  defaultSubTip?: {
    enabled: boolean;
    tipShape: TipShape;
    material: Material;
    freeSpin: boolean;
  };
  configurations: PartConfiguration<{
    tipShape?: TipShape;
    gripFactor?: number;
    aggressiveness?: number;
    tipWidth?: number;
    freeSpin?: boolean;
    contactPoints?: SystemContactPoint[];
  }>[];
}

// ─── Core ─────────────────────────────────────────────────────────────────────

export interface CorePart extends BasePart {
  // geometry: PartShape inherited
  coreCategory: CoreCategory;
  material: Material;
  dimensions: { height: number; radius: number };
  weight: number;
  gimmick: CoreGimmick;
  configurations: PartConfiguration<{ gimmick?: CoreGimmick }>[];
}

// ─── Casing ───────────────────────────────────────────────────────────────────

export interface CasingSlots {
  tipSlot: {
    position: { x: number; y: number } | "center";
    radius: number; // mm bore opening
  };
  coreSlot: {
    enabled: boolean;
    radius: number; // mm bore for core
    depth: number; // mm — determines core absolute height from floor
  };
}

export interface CasingPart extends BasePart {
  // geometry: PartShape inherited (top + sideProfileSpline; bottomMimic=false default = circle)
  casingCategory?: CasingCategory;
  dimensions: PartDimensions;
  materials: MaterialBand[];
  contactPoints: SystemContactPoint[];
  slots: CasingSlots;
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    slots?: Partial<CasingSlots>;
  }>[];
}

// ─── BitBeast ─────────────────────────────────────────────────────────────────

export interface BitBeastPart extends BasePart {
  // geometry: PartShape inherited
  beastCategory: BitBeastCategory;
  materials: MaterialBand[];
  weight: number;
  dimensions: { height: number; radius: number };
  specialMove: SpecialMove;
  customMoveName?: string; // only when specialMove = 'custom'
  configurations: PartConfiguration<{ weight?: number }>[];
}

// ─── Beyblade System (Composition) ───────────────────────────────────────────

export interface SubPartAttachment {
  subPartId: string;
  parentPart: SubPartParent;
  placement: "above" | "below";
  flipped: boolean;
  activeConfig?: string;
}

export interface ComboPart {
  slots: PartLayer[];
  label: string;
}

export interface BeybladeSystem {
  id: string;
  displayName: string;
  spinDirection: "left" | "right";

  bitBeastId?: string;
  attackRingId: string;
  attackRingFlipped: boolean;
  weightDiskId: string;
  tipId: string;
  coreId?: string;
  casingId: string;

  subPartAttachments: SubPartAttachment[];

  activeConfigs: {
    bitBeast?: string;
    attackRing?: string;
    weightDisk?: string;
    tip?: string;
    core?: string;
    casing?: string;
  };

  comboParts: ComboPart[];
  linkedStatsId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// ─── Part union type (for generic pickers) ───────────────────────────────────

export type AnyPart =
  | ARPart
  | SubPart
  | WDPart
  | TipPart
  | CorePart
  | CasingPart
  | BitBeastPart;

export type PartTypeKey =
  | "attack_ring"
  | "sub_part"
  | "weight_disk"
  | "tip"
  | "core"
  | "casing"
  | "bit_beast";

// Maps PartTypeKey to the Firestore collection name (matches COLLECTIONS in firebase.ts)
export const PART_TYPE_COLLECTION: Record<PartTypeKey, string> = {
  attack_ring: "attack_ring_parts",
  sub_part: "sub_parts",
  weight_disk: "weight_disk_parts",
  tip: "tip_parts",
  core: "core_parts",
  casing: "casing_parts",
  bit_beast: "bit_beast_parts",
};

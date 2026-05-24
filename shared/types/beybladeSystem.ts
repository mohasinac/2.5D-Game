// [2.5D] Beyblade System — part library types, shape math, and composition schema.
// This is separate from BeybladeStats — it's the modular part-library system.
// A BeybladeSystem composes parts by ID; computeBeybladeStats() converts it to BeybladeStats.
//
// Runtime constants live in beybladeConstants.ts and are re-exported here for
// backward compatibility — existing imports from this module continue to work.

import type { BeybladeStats } from "./beybladeStats";
import type { ComboCondition } from "./comboTask";
export type { BeybladeStats };

// ─── Core Enums ───────────────────────────────────────────────────────────────

export type Material =
  | "abs"
  | "rubber"
  | "metal"
  | "pom"
  | "polycarbonate"
  | "nylon"
  | "pc";
export type AttackType = "smash" | "upper" | "absorb" | "burst" | "spin_steal";

export type PartLayer =
  | "bit_beast"
  | "ar"
  | "wd"
  | "tip"
  | "core"
  | "casing"
  | "spin_track"
  | "sub_part" // generic — sub_ar / wd_sub / sub_casing all unified here
  | "gear";    // modular DB/BU attachment (Evolution Gear, Q-Gear, etc.)

export type SubPartParent = "ar" | "wd" | "casing" | "bit_beast" | "tip" | "core" | "gear";
export type SubPartMode = "free_spin" | "partial_slip" | "fixed" | "ratchet";

// ─── Part / Contact-Point Self-Rotation ──────────────────────────────────────

/**
 * Lifecycle type for motor-driven or scheduled part rotation.
 *
 * - permanent  : spins continuously for the whole match
 * - interval   : alternates active/pause on/off cycles
 * - once       : fires once at match start then stops
 * - pulsed     : short burst on collision or timer
 * - oscillate  : sweeps from sweepFromDeg to sweepToDeg and returns, repeating
 */
export type PartRotationType = "permanent" | "interval" | "once" | "pulsed" | "oscillate";

/**
 * Which physical axis the motor rotates around.
 *
 * - spin_axis  : parallel to the beyblade's own spin axis (Z-up). Default.
 * - radial     : axis points outward from bey center through the part.
 * - tangential : perpendicular to radial, in the bey's equatorial plane.
 * - custom     : arbitrary axis in part-local space via euler angles.
 * - arc_pivot  : pivot placed at a specific point ON the contact-point arc/curvature,
 *                defined by pivotAngleDeg + pivotRadiusMm; motionRadiusMm is the arm
 *                length from pivot to the moving tip. Supports very small (micro-tick)
 *                or very large (wide sweep) radii.
 */
export type PartRotationAxisType = "spin_axis" | "radial" | "tangential" | "custom" | "arc_pivot";

export interface PartRotationAxis {
  type: PartRotationAxisType;

  // ── arc_pivot: pivot anywhere on the contact-point curvature ─────────────────
  /**
   * Angular position (0–360°) on the part circumference where the hinge/pivot sits.
   * Only used when type = "arc_pivot".
   */
  pivotAngleDeg?: number;
  /**
   * Radial distance (mm) from the part center to the pivot point.
   * Defaults to the contact point's own radius when absent.
   */
  pivotRadiusMm?: number;
  /**
   * Arm length (mm) from the pivot to the tip that actually moves.
   * Small = tight micro-oscillation; large = wide sweep arc.
   */
  motionRadiusMm?: number;

  // ── custom: arbitrary euler angles in part-local space ─────────────────────
  /** "custom" only: rotation around local X (degrees). */
  customX?: number;
  /** "custom" only: rotation around local Y (degrees). */
  customY?: number;
  /** "custom" only: rotation around local Z (degrees, 0 = spin axis). */
  customZ?: number;
}

/**
 * Independent motor-driven rotation on a part or contact point.
 * Separate from `rotatable` (which is the beyblade-axis coupling flag).
 */
export interface PartSelfRotation {
  type: PartRotationType;
  speedDegPerSec: number;
  direction: "cw" | "ccw" | "alternating";
  /** Which axis / pivot the motor turns around. Defaults to "spin_axis" when absent. */
  axis?: PartRotationAxis;

  // ── interval ─────────────────────────────────────────────────────────────────
  intervalActiveMs?: number;
  intervalPauseMs?: number;

  // ── once ─────────────────────────────────────────────────────────────────────
  onceDurationMs?: number;

  // ── pulsed ───────────────────────────────────────────────────────────────────
  pulseOnCollision?: boolean;
  pulseDurationMs?: number;
  pulseCooldownMs?: number;

  // ── oscillate (sweep to an arc and optionally return) ────────────────────────
  /** Start angle of the sweep in degrees relative to part rest position. */
  sweepFromDeg?: number;
  /** End angle of the sweep in degrees. */
  sweepToDeg?: number;
  /**
   * true  = sweeps from→to then back to→from, repeating (oscillate).
   * false = sweeps from→to then snaps back instantly and repeats.
   * Defaults to true.
   */
  oscillateReturn?: boolean;
  /** Override: how long each half-sweep takes (ms). Computed from speedDegPerSec when absent. */
  sweepDurationMs?: number;
}

export type TipShape =
  | "flat"
  | "sharp"
  | "semi_flat"
  | "wide"
  | "ball"
  | "spike"
  | "rubber_flat"
  | "hole_flat"   // wide ring with hollow center; orbital, moderately defensive
  | "rubber_ball" // rubber ball; wide, semi-orbital, defense, high friction
  | "defense"     // D-tip shape; wider than spike, curved holes, recovery-capable
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
  | "clutch_release"
  | "spin_injection"    // actively adds spin per tick from reserve
  | "counter_rotation"; // zig-zag via spin direction sequence

export type SpecialMove =
  | "none"
  | "stampede_rush"
  | "gyro_anchor"
  | "spin_recovery"
  | "tactical_burst"
  | "custom";

// ─── Combo / Special Move Types ───────────────────────────────────────────────

export type ComboEffectType =
  | "spinBoost"      // +% spin speed for durationTicks
  | "dashForce"      // apply force impulse in direction
  | "defenseLock"    // zero velocity, lock for durationTicks
  | "spinSteal"      // drain spin from nearest opponent
  | "gripBoost"      // increase gripFactor temporarily
  | "wobbleDampen"   // suppress nutation wobble
  | "orbitForce"     // apply circular orbit force
  | "custom";        // server handles via customScript

export interface ComboEffectDef {
  id: string;
  name: string;
  type: ComboEffectType;
  magnitude: number;       // 0–1 for boosts/drains, newtons for force effects
  direction?: number;      // angle in degrees; undefined = facing direction
  durationTicks: number;   // effect duration at 60Hz
  cost: 0 | 15 | 25 | 35;
  powerThreshold: number;  // min power % to activate (0 = always)
  cooldownMs: number;
  overrideRange?: {
    magnitude?: [number, number];
    durationTicks?: [number, number];
  };
}

export interface BeybladeComboSlot {
  sequence: [string, string, string]; // 3 ComboKeys (e.g. "moveRight","moveRight","attack")
  effectId: string;                   // references ComboEffectDef.id
  condition?: ComboCondition; // optional trigger/condition for reactive combos
}

export interface SpecialMoveStep {
  effectId: string;
  delayTicks: number;   // offset from special move activation tick
  parallel: boolean;    // true = overlaps with previous step
  overrideParams?: {
    magnitude?: number;
    durationTicks?: number;
  };
}

export interface SpecialMoveConfig {
  name: string;
  description?: string;
  steps: SpecialMoveStep[];
  cancelable: boolean;         // true = second Space tap interrupts
  locksDurationTicks: number;  // player control locked for this many ticks
  powerCost: number;           // usually 100 (full bar)
}

// ─── DetachedBody Types ───────────────────────────────────────────────────────

export type DetachedBodyType = "projectile" | "mini_bey" | "fragment";
export type DetachedBodyState = "projectile" | "obstacle" | "removed";

// ─── Material Stats + Runtime Constants ──────────────────────────────────────
// Constants live in beybladeConstants.ts (no circular imports).
// Re-exported here so existing importers continue to work without changes.

export type { MaterialStats } from "./beybladeConstants";
export {
  MATERIAL_MULTIPLIERS,
  MATERIAL_STATS,
  PART_TYPE_COLLECTION,
  PART_TYPE_SLUG,
  SLUG_TO_PART_TYPE,
} from "./beybladeConstants";

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

/**
 * A single step in a material's wear schedule.
 * `wearLevel` is 0–100 (100 = brand new, 0 = fully worn).
 * Steps sorted by `atSecond` ascending; engine linearly interpolates between steps.
 * After the last step the wear level is held constant.
 */
export interface WearStep {
  atSecond: number;   // match-elapsed seconds when this wear level is reached
  wearLevel: number;  // 0–100
}

export interface MaterialBand {
  material: Material;
  coverage: number; // 0–1; bands per part should sum to ~1
  /**
   * Optional wear schedule. Absent = no wear (level stays 100 all match).
   * Example — 100→50 over 3 min then hold:
   *   [{ atSecond: 0, wearLevel: 100 }, { atSecond: 180, wearLevel: 50 }]
   */
  wearSchedule?: WearStep[];
}

export interface PartPocket {
  position: { x: number; y: number }; // mm from central axis (top-down)
  height: number; // mm absolute from floor
  size: "small" | "large";
  shape: "round" | "oval" | "channel" | "arc";
  ballMaterial: "metal" | "plastic";
  ballCount: number;
  fixed: boolean;             // false = ball moves under centrifugal/tilt force
  radialChannel?: boolean;   // ball constrained to radial axis only (arc channel — Draciel F)
  escapable?: boolean;       // ball can exit pocket under centrifugal force
  escapeForce?: number;      // centrifugal force threshold; 0 = inescapable
  escapedBallMass?: number;  // g — escaped ball becomes DetachedBody 'fragment'
}

// ─── Contact Point ────────────────────────────────────────────────────────────

export interface SystemContactPoint {
  // Circumferential position
  angle: number; // 0–360° — center of the arc (legacy field; still used if arcStart/arcEnd absent)
  width: number; // arc degrees — angular span; narrow=spike, wide=bumper (legacy)
  radius: number; // mm from center — collision only registers at this radius (legacy)
  thickness: number; // mm radial depth (legacy: blends across `width`)

  // ── NEW: arc-segment geometry. When provided, these take precedence over the
  //         legacy angle/width/radius/thickness fields. They let an editor place
  //         a strip of contact ONLY along the arc (not across the whole zone),
  //         with an explicit radial range r1..r2 and a perpendicular line thickness.
  /** Arc start in degrees (0–360). When absent, `angle - width/2` is used. */
  arcStart?: number;
  /** Arc end in degrees (0–360). When absent, `angle + width/2` is used. */
  arcEnd?: number;
  /** Inner radius (mm). Partial ring goes r1..r2. When absent, defaults to `radius - thickness/2`. */
  radiusInner?: number;
  /** Outer radius (mm). When absent, defaults to `radius + thickness/2`. */
  radiusOuter?: number;
  /** Perpendicular protrusion (mm) ON the arc line — added at the centerline of the
   *  arc segment instead of warping the whole zone. */
  lineThickness?: number;
  /** Multi-set grouping id. Default: implicit single set. */
  setId?: string;

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
  /**
   * Relative weight share for this contact point.
   * The part's total weight is distributed across all CPs proportionally by this value.
   * Absent / undefined → defaults to 1.0 (equal share).
   * Auto-computed suggestion: proportional to (radius × thickness × arcDegrees).
   */
  weightFactor?: number;

  // Optional roller wheel
  roller?: {
    radius: number; // mm physical size
    material: Material;
    freeSpin: boolean; // true → rubber multipliers regardless of roller.material
  };
  /** Motor-driven rotation of this contact point around the part center. */
  selfRotation?: PartSelfRotation;
}

/** Resolve arc/radial bounds for a contact point — honors new arc fields, falls back to legacy. */
export function resolveCpBounds(cp: SystemContactPoint): {
  arcStart: number; arcEnd: number; rInner: number; rOuter: number; lineThickness: number;
} {
  const halfW = cp.width / 2;
  const arcStart = cp.arcStart ?? (cp.angle - halfW);
  const arcEnd   = cp.arcEnd   ?? (cp.angle + halfW);
  const rInner   = cp.radiusInner ?? Math.max(0, cp.radius - cp.thickness / 2);
  const rOuter   = cp.radiusOuter ?? cp.radius + cp.thickness / 2;
  // lineThickness defaults to legacy thickness (so existing data keeps current bulge).
  const lineThickness = cp.lineThickness ?? cp.thickness;
  return { arcStart, arcEnd, rInner, rOuter, lineThickness };
}

/** True if `angleDeg` falls inside the contact arc. Handles wrap-around. */
export function angleInArc(angleDeg: number, arcStart: number, arcEnd: number): boolean {
  const norm = (x: number) => ((x % 360) + 360) % 360;
  const a = norm(angleDeg);
  const s = norm(arcStart);
  const e = norm(arcEnd);
  if (s <= e) return a >= s && a <= e;
  return a >= s || a <= e; // wraps past 360
}

/**
 * renderRadius — warps the Fourier radial profile by contact-point protrusion.
 *
 * Behaviour depends on whether the CP has new-shape fields:
 *   - NEW (arcStart/arcEnd/lineThickness): protrusion is applied ONLY along the
 *     arc segment, with peak at the arc midpoint and falling off to zero at the
 *     edges. Overlapping CPs on the same angle blend via MAX (not sum) so a
 *     thicker bumper plus a thin spike resolves to the bumper's height.
 *   - LEGACY (angle/width/thickness): preserves the original zone-warp behaviour
 *     (sum-based) for backwards compatibility with existing data.
 *
 * For mixed inputs, legacy CPs are summed into the base, then new-shape CPs are
 * max-blended on top.
 */
export function renderRadius(
  θDeg: number,
  fourierCache: number[],
  cps: SystemContactPoint[]
): number {
  const base = fourierCache[Math.round(θDeg) % 360] ?? 0;

  let legacyWarp = 0;
  let newProtrusionMax = 0;

  for (const cp of cps) {
    const isNew = cp.arcStart !== undefined || cp.arcEnd !== undefined || cp.lineThickness !== undefined;
    if (isNew) {
      const { arcStart, arcEnd, lineThickness } = resolveCpBounds(cp);
      if (!angleInArc(θDeg, arcStart, arcEnd)) continue;
      const midpoint = (arcStart + arcEnd) / 2;
      const halfSpan = Math.abs(arcEnd - arcStart) / 2 || 1;
      const dist = Math.min(
        Math.abs(θDeg - midpoint),
        360 - Math.abs(θDeg - midpoint),
      );
      const falloff = Math.max(0, 1 - dist / halfSpan);
      newProtrusionMax = Math.max(newProtrusionMax, lineThickness * falloff);
    } else {
      const diff = Math.abs(cp.angle - θDeg);
      const halfWidth = cp.width / 2;
      if (diff >= halfWidth) continue;
      legacyWarp += cp.thickness * (1 - diff / halfWidth);
    }
  }

  return base + legacyWarp + newProtrusionMax;
}

/** Group CPs by their `setId`. Implicit single set for CPs without one. */
export function groupContactPointsBySet(cps: SystemContactPoint[]): Map<string, SystemContactPoint[]> {
  const out = new Map<string, SystemContactPoint[]>();
  for (const cp of cps) {
    const k = cp.setId ?? "_default";
    const list = out.get(k) ?? [];
    list.push(cp);
    out.set(k, list);
  }
  return out;
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
    | "spin_threshold"       // bey own spin < threshold (0–1 fraction of maxSpin)
    | "subpart_spin_threshold" // sub-part accumulated spin >= threshold RPM
    | "impact_threshold"     // single impact force >= threshold
    | "timer"                // elapsed seconds >= threshold
    | "core_activated"       // engine_gear or clutch_release fires
    | "external_part_state"  // another part on same bey reaching a condition
    | "impact_any"           // any impact >= threshold, any direction; supports togglePrevious
    | "impact_direction"     // impact from specific spin direction >= threshold
    | "tilt_threshold"       // bey's wobbleAmplitude (degrees) exceeds threshold
    | "special_move";        // fires when the bey's special move is activated
  threshold: number;
  // impact_direction: restrict to hits from a specific spin direction
  direction?: "clockwise" | "counterclockwise" | "any";
  // impact_any / impact_direction: each qualifying fire flip-flops prev ↔ current config
  togglePrevious?: boolean;
  externalPartSlot?: PartLayer;
  externalCondition?:
    | "config_changed"
    | "subpart_spin_threshold"
    | "spin_threshold"
    | "core_activated";
  externalThreshold?: number;
}

// ─── Switch Target (SubPart-as-Switch architecture) ───────────────────────────

export interface SwitchTarget {
  targetLayer: PartLayer;        // part slot to affect: 'tip', 'ar', 'wd', 'casing', 'core'
  activateConfig: string;        // config name to set on that part
  trigger: ConfigTrigger;        // condition that fires this switch
  resetToConfig?: string;        // if set: revert to this config when resetCondition met
  resetCondition?: ConfigResetCondition;
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
  /** User-facing label shown in the in-game PartModesHUD. Defaults to `name` if absent. */
  displayName?: string;
  /** When true, this configuration appears in the in-game PartModesHUD and can be activated
   *  by the player via the `mode:switch` Colyseus message. Default: false (auto-only). */
  playerSwitchable?: boolean;
}

// ─── Universal Stat Modifier System ──────────────────────────────────────────
// Any part can modify any bey stat via triggers or events. Enables user-created cores.

export type BeybladeStatKey =
  | "spin"
  | "maxSpin"
  | "spinDecayRate"
  | "aggressiveness"
  | "gripFactor"
  | "recoilFactor"
  | "damageMultiplier"
  | "damageReduction"
  | "surfaceFriction"
  | "contactDamageMultiplier"
  | "speed"
  | "mass"
  | "radius"
  | "width"
  | "height"
  | "depth"
  | "spinStealFactor"      // outgoing steal rate multiplier
  | "spinStealResist"      // block incoming steal (>1 = resist)
  | "jumpForce"            // upward impulse (N) for jump actions
  | "jumpHeight"           // max jump height ceiling (cm)
  | "suctionForce"         // 2.5D: adhesion force (N)
  | "wallClimbFactor"      // 2.5D: 0=none, 1=full climb
  | "gravityMult"          // 2.5D: per-bey gravity scale
  | "bounceRestitution"    // 2.5D: wall bounce elasticity
  | "tiltResistance"       // 2.5D: resist axis tilt on impact (maps to lateralStability)
  | "burstResistance";     // 0–100; higher = harder to burst

export type StatModifierEvent =
  | "on_land"           // bey lands after an airborne hop
  | "on_hit_opponent"   // bey's CP makes contact with opponent
  | "on_hit_received"   // bey receives a hit
  | "on_special_move"   // bey's special move activates
  | "on_button"         // secondary player button press
  | "on_config_change"; // fired when this part's activeConfig changes

export interface StatModifier {
  targetStat: BeybladeStatKey;
  operation: "add" | "multiply" | "set";
  value: number;
  duration?: number;         // ticks; 0=one tick; undefined=permanent for match
  trigger?: ConfigTrigger;   // condition-based (spin_threshold, impact_any, etc.)
  event?: StatModifierEvent; // event-based (on_land, on_hit, etc.)
}

// ─── Core Gimmick Configs ─────────────────────────────────────────────────────

export interface SpinInjectionConfig {
  enabled: boolean;
  rateRPM: number;                                                     // spin added per tick = rateRPM / 60 at 60Hz
  reserveCapacity: number;                                             // total RPM reserve; 0 = unlimited
  reserveRemaining: number;                                            // runtime state (tracked per-match in BeybladeSchema)
  activationCondition: "always" | "casing_trigger" | "spin_threshold";
  spinThreshold?: number;                                              // fraction of maxSpin; active when below this
}

export interface CounterRotationConfig {
  enabled: boolean;
  activationCondition: "casing_trigger" | "player_input";
  directionSequence: Array<"right" | "left">; // e.g. ['right','left','right','left']
  stepDurationTicks: number;                  // ticks to hold each direction (30 = 0.5s)
  spinDecayCostPerStep: number;               // spin fraction lost at each direction transition
}

// ─── Jump / Movement Override System ─────────────────────────────────────────

export interface LandingDamage {
  enabled: boolean;
  damageMultiplier: number;  // landingDamage = (mass × jumpForce²) × mult × (spin/maxSpin)
  aoeRadius: number;         // mm; opponents within this radius take AOE damage on landing
  spinBoostOnLand?: number;  // fraction of maxSpin added to own spin on landing
}

export interface JumpConfig {
  jumpForce: number;             // velocity burst magnitude per hop (pixels/tick)
  jumpPeriodTicks: number;       // ticks between hop initiations
  airborneTickDuration: number;  // ticks the bey is "in the air" per hop
  landingDamage?: LandingDamage;
}

export interface MovementOverride {
  type: "orbit" | "jump" | "fixed";
  // 'orbit' = default continuous tangential force (standard bey behavior)
  // 'fixed' = holds position (no movement force applied)
  // 'jump'  = moves ONLY by discrete hops; smooth orbiting is disabled
  jumpConfig?: JumpConfig;
}

// ─── Detachment Config ────────────────────────────────────────────────────────

export interface DetachmentConfig {
  enabled: boolean;
  type: DetachedBodyType;
  trigger: "impact_threshold" | "spin_threshold" | "timer" | "special_move";
  triggerThreshold: number;
  returnToParent: boolean;
  returnDelay?: number;
  detachedMass: number;
  detachedRadius?: number;
  detachedContactPoints?: SystemContactPoint[];
  initialSpinFraction?: number; // fraction of parent spin inherited at detachment (0–1)
  spinDecayRate?: number;       // per-tick spin decay rate for mini_bey bodies
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
  /** ComboEffectDef ids this part contributes to the beyblade. Max 2 per part. */
  comboEffects: string[];
  /**
   * Whether this part rotates rigidly with the beyblade's spin axis.
   * true  = locked to beyblade rotation (AR, WD, casing, etc.)
   * false = free-spinning; part has its own independent angular velocity.
   * Complements SubPart.mode and TipPart.freeSpin — those carry the detailed
   * physics config; this flag is the authoritative coupling switch.
   * Defaults to true for all fixed parts.
   */
  rotatable: boolean;
  /** Motor-driven or scheduled rotation independent of the bey spin axis. */
  selfRotation?: PartSelfRotation;
  /**
   * Which slot layer this part occupies in a BeybladeSystem.
   * Mirrors the PartLayer enum. Set explicitly so pickers and validation
   * can filter candidates without knowing the Firestore collection name.
   */
  slotsInto?: PartLayer;
  /**
   * 0-indexed position within the slot for beys that have multiple sockets
   * of the same type (e.g. dual gear ports, multi-AR systems).
   * Omit / 0 for beys with a single socket per layer.
   */
  slotPosition?: number;
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
  // Hidden physics stats (not shown in player-visible stat bars)
  recoilFactor?: number;                                  // 0.1–1.0; high=bounces far; low(rubber)=sticks close
  smashEfficiency?: number;                               // kinetic energy fraction transferred on smash
  upperAttackBonus?: number;                              // ×mult when AR CP sweeps under opponent WD
  aerodynamicProfile?: "compact" | "winged" | "spherical"; // affects orbit stability at edges
  statModifiers?: StatModifier[];
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    dimensions?: Partial<PartDimensions>;
  }>[];
}

// ─── Sub-Part (generic — replaces sub_ar / wd_sub / sub_casing) ───────────────

export interface SubPart extends BasePart {
  compatibleParents: SubPartParent[];
  placement?: "above" | "below" | "side"; // where the sub-part physically attaches
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
  // SubPart-as-Switch: when trigger fires, change config on a target part layer
  switchTargets?: SwitchTarget[];
  // Hidden mechanism wear tracking
  mechanismDurability?: number;  // 0 = infinite; total trigger fires before mechanism wears
  triggerSensitivity?: number;   // 1.0 = nominal; <1.0 = worn spring fires at lower force
  statModifiers?: StatModifier[];
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
  // Hidden physics stats
  momentOfInertia?: number;        // kg·mm²; if unset: computed as I = Σ(m × r²)
  gyroscopicStability?: number;    // 0.0–1.0; suppresses wobbleAmplitude growth per tick
  spinTransferEfficiency?: number; // 0.0–1.0; co-axial spin-steal efficiency
  statModifiers?: StatModifier[];
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    dimensions?: Partial<PartDimensions>;
    weight?: number;
  }>[];
}

// ─── Tip ──────────────────────────────────────────────────────────────────────

export interface TipPart extends BasePart {
  // geometry: PartShape inherited (top + sideProfileSpline + bottomBezierPath for contact patch)
  tipShape: TipShape; // behavioral category — drives movement physics
  material: Material;
  dimensions: {
    height: number;        // mm absolute from floor
    outerRadius?: number;  // mm — physical tip radius; required when extendsAboveCasing=true
    tipWidth: number;      // mm — auto-computed from computeEffectiveRadius(geometry.bottomBezierPath)
  };
  freeSpin: boolean;
  gripFactor: number;    // 0–1
  aggressiveness: number; // 0–1
  integratedCasing?: boolean;  // tip assembly IS the casing (legacy flag)
  freeSpinOnCore?: boolean;    // free-spins only when core_activated fires
  defaultSubTip?: {
    enabled: boolean;
    tipShape: TipShape;
    material: Material;
    freeSpin: boolean;
  };
  // Directional grip multiplier — R2F-style protrusion-based tips
  spinBias?: {
    rightSpin: { gripMultiplier: number };
    leftSpin: { gripMultiplier: number };
  };
  // Bearing friction — B:D, EWD style
  bearingFriction?: number;   // 0.0 (near-frictionless) to 1.0 (no bearing); B:D=0.02, EWD=0.03
  // Left-spin hop — Wyborg behavior
  leftSpinHop?: {
    enabled: boolean;
    hopImpulse: number;   // outward radial force magnitude
    hopChance: number;    // probability per qualifying hit (0–1)
  };
  // Rubber wear tracking
  durabilityDecay?: number; // gripFactor reduction per rubber-mode activation (match-scoped)
  // Hidden physics stats
  recoilAbsorption?: number;  // 0.0–1.0; fraction of push-back absorbed (wide/rubber tips)
  lateralStability?: number;  // resistance to sideways tilt on impact (wider tip = more)
  surfaceFriction?: number;   // floor contact friction; if unset: computed from material.frictionMult
  suctionCap?: number;        // max suction force this tip can sustain (N)
  climbAssist?: number;       // 0–1: how much this tip helps wall climbing
  // Structural flags — affect rendering order and CP ownership
  extendsAboveCasing?: boolean; // tip body extends up into the normal casing height zone (Rock Bison)
  containsCasing?: boolean;     // tip is outermost shell; casing nests inside (Wolborg G)
  cupInnerSpline?: BezierSplineProfile; // inner bowl curve (Wolborg G)
  /**
   * Per-material-zone wear schedules. Bands sum to ~1 coverage.
   * Each band has a wearSchedule[] that linearly interpolates the wear level (100→0)
   * over match-elapsed seconds. Server reads these to:
   *   1. Modulate gripFactor in real-time (lower wear → lower effective grip).
   *   2. Drive "wear_level" evolution triggers (stage advances when wear ≤ threshold).
   * Absent = single material with no wear (level stays 100 all match).
   */
  materials?: MaterialBand[];
  statModifiers?: StatModifier[];
  /**
   * Evolution stages define how the tip's behavior transforms over the course of a match.
   * Stages are traversed in order (index 0 → 1 → 2 …). Index 0 is the default stage and
   * requires no trigger — it maps to the tip's base stats (no active config override).
   * Each subsequent stage has a trigger condition; when met the tip advances and sets
   * bey.activePartConfigs["tip"] so resolveTipStats() picks up the new config next frame.
   *
   * bey.tipEvolutionTimer tracks total match-elapsed ms (never resets between stages).
   * bey.tipEvolutionStage holds the current index (Colyseus-synced to clients at 60 Hz).
   *
   * Example — Xtreme Variable (wears from ball → flat → overdrive):
   *   stage 0 { label: "Ball Mode", configName: "" }  ← base stats, no trigger
   *   stage 1 { label: "Flat Mode", configName: "Flat",     trigger: { type: "wear_level",   value: 80 } }
   *   stage 2 { label: "Overdrive", configName: "Overdrive",trigger: { type: "spin_percent", value: 0.4 } }
   */
  evolutionStages?: TipEvolutionStage[];
  configurations: PartConfiguration<{
    tipShape?: TipShape;
    material?: Material;
    gripFactor?: number;
    aggressiveness?: number;
    tipWidth?: number;
    freeSpin?: boolean;
    contactPoints?: SystemContactPoint[];
  }>[];
}

/**
 * One stage in an evolution-driver's lifecycle.
 * Stage 0 is implicit (the tip's base stats); stages 1+ each carry a trigger.
 *
 * bey.tipEvolutionTimer = match-elapsed ms (never resets). All time-based and
 * wear-based triggers read from this single monotonic clock so stages stay
 * consistent with the existing MaterialBand wear schedule system.
 */
export interface TipEvolutionStage {
  /** Human-readable name shown on the HUD (e.g., "Ball Mode", "Flat Mode", "Overdrive"). */
  label: string;
  /**
   * Config name to activate when entering this stage.
   * Must match a TipPart.configurations[].name entry.
   * Empty string "" → use the tip's base stats (stage 0 default).
   */
  configName: string;
  /**
   * Condition that must be true to advance INTO this stage from the previous one.
   * Stage 0 needs no trigger — it is the starting state.
   *
   * Trigger types (all read bey.tipEvolutionTimer as match-elapsed ms):
   *   "time"            – tipEvolutionTimer ≥ value (ms). Use for time-gated warm-up.
   *   "wear_level"      – computeMinWearLevel(tip, elapsedSec) ≤ value (0–100).
   *                       Reads the dominant MaterialBand wearSchedule — the same
   *                       wear curve that already drives gripFactor reduction. This is
   *                       the preferred trigger for realistic rubber/plastic wear.
   *   "spin_percent"    – spin / maxSpin ≤ value (0–1). Activates at low spin.
   *   "collision_count" – bey.collisions ≥ value (integer count).
   *   "damage_taken"    – bey.damageReceived ≥ value (cumulative hp).
   */
  trigger?: {
    type: "time" | "wear_level" | "spin_percent" | "collision_count" | "damage_taken";
    value: number;
  };
}

// ─── Core ─────────────────────────────────────────────────────────────────────

export interface CorePart extends BasePart {
  // geometry: PartShape inherited
  coreCategory: CoreCategory;
  material: Material;
  dimensions: { height: number; radius: number };
  weight: number;
  gimmick: CoreGimmick;
  // Hidden physics stats
  clutchStrength?: number;       // 0.0–1.0; HMS free-spinning Running Core coupling (0=free, 1=locked)
  torqueEfficiency?: number;     // 0.0–1.0; spin transmitted from WD hub down to tip per tick
  internalFriction?: number;     // 0.0–1.0; friction loss inside mechanism housing per tick
  suctionEmit?: number;          // suction emission force (N) this core broadcasts to nearby surfaces
  // Core gimmick configs (named gimmicks — complemented by statModifiers for custom behaviors)
  spinInjection?: SpinInjectionConfig;
  counterRotation?: CounterRotationConfig;
  statModifiers?: StatModifier[];
  configurations: PartConfiguration<{
    gimmick?: CoreGimmick;
    spinInjection?: Partial<SpinInjectionConfig>;
    counterRotation?: Partial<CounterRotationConfig>;
    movementOverride?: MovementOverride;
    statModifiers?: StatModifier[];
  }>[];
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
  // Hidden physics stats
  impactAbsorption?: number;   // 0.0–1.0; fraction of hit force absorbed before reaching WD/Core
  lateralStiffness?: number;   // 0.0–1.0; resistance to being tilted by side hits
  clearanceHeight?: number;    // mm; floor-to-bottom gap; affects which opponent CPs can reach under
  statModifiers?: StatModifier[];
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
  customMoveName?: string;    // only when specialMove = 'custom'
  isEnergyRing?: boolean;     // MFB Energy Ring — forces specialMove='none', purely cosmetic + weight
  spiritualForce?: number;    // 0.5–2.0; multiplies special move base power (lore stat, hidden)
  resonanceBonus?: number;    // additive speed bonus when facing same-series opponent (hidden)
  statModifiers?: StatModifier[];
  configurations: PartConfiguration<{ weight?: number }>[];
}

// ─── Spin Track (MFB / 4D System) ────────────────────────────────────────────
// Height piece between Tip and Casing; absent in plastic gen / HMS.
// All AR/WD/Casing CP heightRanges are offset by spinTrack.height at runtime.

export interface SpinTrackShieldDisk {
  enabled: boolean;
  diskRadius: number;   // mm — S130: ~17.75mm; 8-arm ring
  diskHeight: number;   // mm from floor — where disk sits vertically
  contactPoints: SystemContactPoint[];
}

export interface SpinTrackPart extends BasePart {
  height: number;           // mm — primary stat (90, 100, 105, 125, 130, 145, 160, 230)
  dimensions: PartDimensions;
  materials: MaterialBand[];
  weight: number;           // g; plain track ~1.5g; S130 with disk ~3.3g
  shieldDisk?: SpinTrackShieldDisk;
  wingProtrusions?: {
    count: number;
    contactPoints: SystemContactPoint[];
  };
  // Hidden physics stats
  trackRigidity?: number;   // 0.0–1.0; 1.0=rigid (no flex/absorption); flexible=absorbs some impact
  heightAdvantage?: number; // computed: track.height / 145 reference (>1=tall, <1=short bey)
  statModifiers?: StatModifier[];
  configurations: PartConfiguration<{ contactPoints?: SystemContactPoint[] }>[];
}

// ─── Gear (DB/BU Modular Attachment) ─────────────────────────────────────────
// A Gear clips onto a parent part layer and shifts the bey's archetype / mode.
// Examples: Infinite Sword (attack), Infinite Shield (defense), Big Bang (burst
// amplifier) on Ultimate Belial; the five Evolution Gears (L/F/S/V/H) on
// Dynamite Belial NV2; Q-Gear on Astral Spriggan.
//
// Key distinctions from SubPart:
//   - Physically larger; has its own prominent contact points
//   - Always triggers a named archetype shift (not a minor behavior tweak)
//   - May occupy a numbered gear slot when multiple gear positions exist

export type GearShape =
  | "sword"      // elongated blade protrusion (Infinite Sword)
  | "shield"     // disk / ring barrier (Infinite Shield)
  | "hammer"     // mallet head (Hammer Bringer)
  | "wing"       // swept fin (Evolution Gear V — Venture)
  | "lance"      // tapered spike (Evolution Gear L — Lance)
  | "fortress"   // blocky wide plate (Evolution Gear F — Fortress)
  | "ring"       // full-circumference ring
  | "anchor"     // weighted drop-shape
  | "custom";

// Which archetype the gear primarily pushes the bey toward when equipped.
export type GearArchetype = "attack" | "defense" | "stamina" | "balance";

export interface GearPart extends BasePart {
  // Where on the beyblade this gear physically attaches.
  attachesTo: "ar" | "wd" | "casing" | "core" | "bit_beast" | "tip";
  // Numbered slot position for beys with multiple gear sockets (0-indexed).
  // Omit (or 0) for beys with a single gear slot.
  slotIndex?: number;
  gearShape: GearShape;
  // Archetype this gear drives when active.
  archetype: GearArchetype;
  dimensions: PartDimensions;
  materials: MaterialBand[];
  weight: number; // grams
  contactPoints: SystemContactPoint[];
  // Stat deltas applied for the whole match while this gear is equipped.
  statModifiers?: StatModifier[];
  // Sub-part IDs that are only available when this gear is equipped.
  enabledSubPartIds?: string[];
  // Tags that narrow which BeybladeSystem configs can accept this gear.
  compatibleSystemTags?: string[];
  configurations: PartConfiguration<{
    contactPoints?: SystemContactPoint[];
    statModifiers?: StatModifier[];
  }>[];
}

// ─── Beyblade System (Composition) ───────────────────────────────────────────

export interface SubPartAttachment {
  subPartId: string;
  parentPart: SubPartParent;
  placement: "above" | "below";
  flipped: boolean;
  activeConfig?: string;
}

export interface GearAttachment {
  gearId: string;
  // Which part layer the gear clips onto.
  parentPart: "ar" | "wd" | "casing" | "core" | "bit_beast" | "tip";
  // 0-indexed slot when the beyblade has multiple gear sockets (e.g. Q-Gear beys).
  slotIndex?: number;
  activeConfig?: string;
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
  spinTrackId?: string; // MFB — mutually exclusive with casingId in terms of height offset

  subPartAttachments: SubPartAttachment[];
  // Modular gear attachments (DB Evolution Gears, Q-Gears, etc.).
  // Empty array = no gears equipped.
  gearAttachments: GearAttachment[];

  activeConfigs: {
    bitBeast?: string;
    attackRing?: string;
    weightDisk?: string;
    tip?: string;
    core?: string;
    casing?: string;
    spinTrack?: string;
  };

  // Combined / pre-split dual bey (e.g. Phantom Fox MS)
  combinedWith?: {
    partnerBeySystemId: string;     // the second half's BeybladeSystem ID
    linkSubPartIndex: number;       // index in subPartAttachments that is the split spring
    playerControlTarget: "this" | "partner";
    locked?: boolean;              // true = impact cannot break this link
    lockCondition?: {
      type: "always" | "spin_above" | "combo_triggered" | "admin_set";
      threshold?: number;          // % of maxSpin for spin_above (0–100)
      comboEffectId?: string;      // which comboEffect triggers lock
    };
    unlockCondition?: {
      type: "spin_below" | "combo_triggered" | "timer" | "opponent_impact_force" | "admin_set";
      threshold?: number;
      comboEffectId?: string;
      timerTicks?: number;         // for timer type
    };
    lockedStatMerge?: {
      massMode: "sum" | "average" | "max";
      spinMode: "average" | "min" | "sum";
      damageMode: "sum" | "max";
    };
  };

  comboSlots: BeybladeComboSlot[];
  specialMove?: SpecialMoveConfig;
  linkedStatsId?: string;
  elementTypes?: import("./elementTypes").ElementType[]; // up to 2 element types (AB)
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
  | BitBeastPart
  | SpinTrackPart
  | GearPart;

export type PartTypeKey =
  | "attack_ring"
  | "sub_part"
  | "weight_disk"
  | "tip"
  | "core"
  | "casing"
  | "bit_beast"
  | "spin_track"
  | "gear";


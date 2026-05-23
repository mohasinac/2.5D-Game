/**
 * Clean Arena Configuration System - Built from Ground Up
 * Focus: Name, Shape, Theme, Auto-Rotate, Walls with proper edge-based configuration
 */

import type { ElementType } from "./elementTypes";

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Standard arena resolution - all arenas are rendered at this resolution
 * and scaled to fit the display device (using shortest dimension)
 */
export const ARENA_RESOLUTION = 1080; // 1080x1080px

// ============================================================================
// BASIC TYPES
// ============================================================================

export type ArenaShape =
  | "circle"
  | "triangle" 
  | "square"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "star3"   // 3-point star (6 edges)
  | "star4"   // 4-point star (8 edges)
  | "star5"   // 5-point star (10 edges)
  | "star6"   // 6-point star (12 edges)
  | "star7"   // 7-point star (14 edges)
  | "star8"   // 8-point star (16 edges)
  | "rectangle";  // Gen1 Infinity Stadium, Robert's Olympia Coliseum

export type ArenaTheme =
  | "forest"
  | "mountains"
  | "grasslands"
  | "metrocity"
  | "safari"
  | "prehistoric"
  | "futuristic"
  | "desert"
  | "sea"
  | "ocean"
  | "riverbank"
  // Phase Z — new themes
  | "volcano"
  | "frozen_tundra"
  | "cyber_grid"
  | "underwater_ruins"
  | "floating_islands"
  | "crystal_cave"
  | "ancient_temple"
  | "quantum_realm"
  | "haunted_factory"
  | "lava_core"
  | "storm_citadel"
  | "neon_underground";

// ============================================================================
// SPEED PATHS & PORTALS
// ============================================================================

/**
 * Charge Point Configuration
 * Interactive points on speed paths where players can trigger early exit dash
 */
export interface ChargePointConfig {
  id?: number; // Charge point ID (1, 2, 3)
  pathPosition: number; // Position on loop path (0-100%)
  target: "center" | "opponent"; // Dash target
  dashSpeed?: number; // Speed multiplier for the dash (default: 2.0)
  radius?: number; // Visual size (default 1em)
  color?: string; // Visual color (default: yellow/gold)
  buttonId?: 1 | 2 | 3; // Gamepad button to trigger
}

/**
 * Speed Path Configuration
 * Speed boost paths that stay inside the stadium shape - players travel along the path
 */
/** Defines a gap (no path surface / no boost) at a position on the speed path. */
export interface SpeedPathBreak {
  /** Position along path as 0–1 fraction */
  position: number;
  /** Length of the gap as 0–1 fraction of total path length */
  length: number;
}

export interface SpeedPathConfig {
  id?: number; // Speed path ID for identification
  radius: number; // em units from center (must be within stadium bounds)
  shape:
    | "circle"
    | "rectangle"
    | "pentagon"
    | "hexagon"
    | "octagon"
    | "star"
    | "oval"
    | "ring"
    // Phase Z — new shapes
    | "spiral"
    | "figure_8"
    | "zigzag"
    | "custom_bezier"; // Path shape
  speedBoost: number; // Multiplier (e.g., 1.5 = 50% faster)
  spinBoost?: number; // Optional spin recovery per second
  frictionMultiplier?: number; // Lower = less friction (default: 1.0)
  width?: number; // Width for rectangular paths (em units)
  height?: number; // Height for rectangular paths (em units)
  rotation?: number; // Rotation angle in degrees
  color?: string; // Visual color for the path
  ringThickness?: number; // For ring shape - thickness (em units)
  chargePoints?: ChargePointConfig[]; // Interactive dash points
  autoPlaceChargePoints?: boolean; // Auto-place charge points evenly (max 3)
  chargePointCount?: number; // Number of evenly distributed charge points (1-3)
  minPathDuration?: number; // Minimum time on path (2-5 seconds)
  maxPathDuration?: number; // Maximum time before forced exit (2-5 seconds)
  renderStyle?: "outline" | "filled" | "dashed" | "dotted" | "animated" | "broken"; // Render style

  // Phase Z — spiral/figure_8 specific
  /** spiral: number of turns (default 2) */
  spiralTurns?: number;
  /** spiral: inner radius in em units */
  spiralInnerRadius?: number;
  /** figure_8: width of each lobe in em units */
  figure8LobeWidth?: number;

  // Phase Z — custom_bezier
  /** bezier control points in em units relative to path center */
  bezierControlPoints?: Array<{ x: number; y: number }>;

  // Phase Z — breaks
  breaks?: SpeedPathBreak[];

  // Phase Z — animated direction arrows
  showDirectionArrows?: boolean;
  arrowSpeedCmPerSec?: number;
  arrowSpacingCm?: number;
  arrowColor?: string;

  // Phase Z — bump/ridge profile on path surface
  bumpProfile?: { positionFrac: number; heightCm: number }[];
  ridgeProfile?: { positionFrac: number; heightCm: number }[];
}

// Keep LoopConfig as alias for backward compatibility
export type LoopConfig = SpeedPathConfig;

// ============================================================================
// WATER BODY CONFIGURATION
// ============================================================================

/**
 * Water Body Types
 */
export type WaterBodyType = "moat" | "zone" | "wall-based";

/**
 * Liquid Types - Predefined liquid configurations with specific effects
 */
export type LiquidType = 
  | "water"        // Normal water - slight slowdown
  | "lava"         // Lava - damage over time, extreme heat
  | "ice"          // Ice water - freeze effect after time
  | "healing"      // Healing spring - restores HP
  | "speedBoost"   // Energy drink - speed boost
  | "quicksand"    // Quicksand - high friction, pulls inward
  | "oil"          // Oil - low friction, makes sliding
  | "poison";      // Poison - damage and spin drain

/**
 * Water Body Effect Configuration
 * Defines gameplay effects when beyblade is in water
 */
export interface WaterEffectConfig {
  // Damage/Heal
  damagePerSecond?: number; // HP damage per second (0-10, default: 0)
  healPerSecond?: number; // HP heal per second (0-10, default: 0)
  
  // Speed Effects
  speedBoost?: number; // Speed multiplier (e.g., 1.5 = 50% faster, default: 1.0)
  speedLoss?: number; // Speed reduction multiplier (e.g., 0.5 = 50% slower, default: 1.0)
  
  // Spin Effects
  spinDrainPerSecond?: number; // Spin loss per second (0-100, default: 0)
  spinBoostPerSecond?: number; // Spin gain per second (0-100, default: 0)
  
  // Friction
  frictionMultiplier?: number; // Friction multiplier (higher = more drag, default: 1.0)
  
  // Status Effects
  freezeDuration?: number; // Freeze time in seconds (0-10, default: 0)
  freezeThreshold?: number; // Time in water before freeze triggers (seconds, default: 5)
  stunDuration?: number; // Stun time in seconds (0-5, default: 0)
  stunThreshold?: number; // Time in water before stun triggers (seconds, default: 3)
  
  // Push/Pull Effects
  pushForce?: number; // Push away from water center (0-10, default: 0)
  pullForce?: number; // Pull toward water center (0-10, default: 0)
  
  // Visual Feedback
  showParticles?: boolean; // Show water splash particles (default: true)
  particleColor?: string; // Particle color (default: water color)
}

/**
 * Base Water Body Configuration
 */
export interface BaseWaterBodyConfig {
  id: string; // 'water1', 'water2', or 'water3'
  type: WaterBodyType;
  liquidType: LiquidType; // Type of liquid (water, lava, ice, etc.)
  color?: string; // Custom color (overrides liquid type default color)
  opacity?: number; // Water opacity (0-1, default: 0.6)
  depth?: number; // Visual depth effect (0-10, default: 5)
  wavyEffect?: boolean; // Animated wavy effect (default: false)
  effects?: WaterEffectConfig; // Custom gameplay effects (overrides liquid type defaults)
  /** Firebase asset doc ID from water_body_assets collection. */
  textureId?: string;
}

/**
 * Predefined Liquid Configurations
 * Each liquid type has default colors and effects
 */
export const LIQUID_PRESETS: Record<LiquidType, {
  name: string;
  color: string;
  opacity: number;
  description: string;
  effects: WaterEffectConfig;
}> = {
  water: {
    name: "💧 Water",
    color: "#3b82f6", // Blue
    opacity: 0.6,
    description: "Normal water - slight slowdown and friction",
    effects: {
      speedLoss: 0.8, // 20% slower
      frictionMultiplier: 1.3,
      showParticles: true,
    },
  },
  lava: {
    name: "🔥 Lava",
    color: "#ef4444", // Red-orange
    opacity: 0.8,
    description: "Extreme heat - damages beyblades over time",
    effects: {
      damagePerSecond: 5,
      speedLoss: 0.6, // 40% slower
      frictionMultiplier: 2.0,
      pushForce: 3, // Heat pushes away
      showParticles: true,
      particleColor: "#ff6b35",
    },
  },
  ice: {
    name: "❄️ Ice Water",
    color: "#60a5fa", // Light blue
    opacity: 0.7,
    description: "Freezing cold - slows and freezes after 5 seconds",
    effects: {
      speedLoss: 0.5, // 50% slower
      frictionMultiplier: 1.5,
      freezeDuration: 3,
      freezeThreshold: 5,
      spinDrainPerSecond: 10,
      showParticles: true,
      particleColor: "#bfdbfe",
    },
  },
  healing: {
    name: "💚 Healing Spring",
    color: "#10b981", // Green
    opacity: 0.5,
    description: "Restores HP and spin - no negative effects",
    effects: {
      healPerSecond: 3,
      spinBoostPerSecond: 20,
      frictionMultiplier: 1.0, // No extra friction
      showParticles: true,
      particleColor: "#6ee7b7",
    },
  },
  speedBoost: {
    name: "⚡ Energy Drink",
    color: "#eab308", // Yellow
    opacity: 0.6,
    description: "Speed boost zone - increases speed and reduces friction",
    effects: {
      speedBoost: 1.5, // 50% faster
      frictionMultiplier: 0.7, // Less friction
      spinBoostPerSecond: 10,
      showParticles: true,
      particleColor: "#fde047",
    },
  },
  quicksand: {
    name: "🏜️ Quicksand",
    color: "#d97706", // Brown-orange
    opacity: 0.7,
    description: "High friction - pulls inward and slows drastically",
    effects: {
      speedLoss: 0.3, // 70% slower
      frictionMultiplier: 3.0, // Very high friction
      pullForce: 5, // Strong pull toward center
      spinDrainPerSecond: 20,
      stunDuration: 2,
      stunThreshold: 4,
      showParticles: true,
      particleColor: "#fed7aa",
    },
  },
  oil: {
    name: "🛢️ Oil Slick",
    color: "#374151", // Dark gray
    opacity: 0.5,
    description: "Very slippery - low friction, hard to control",
    effects: {
      speedBoost: 1.2, // 20% faster (slippery)
      frictionMultiplier: 0.3, // Very low friction
      showParticles: true,
      particleColor: "#6b7280",
    },
  },
  poison: {
    name: "☠️ Poison",
    color: "#8b5cf6", // Purple
    opacity: 0.7,
    description: "Toxic - damages HP and drains spin over time",
    effects: {
      damagePerSecond: 2,
      spinDrainPerSecond: 30,
      speedLoss: 0.7, // 30% slower
      frictionMultiplier: 1.2,
      showParticles: true,
      particleColor: "#c4b5fd",
    },
  },
};

/**
 * Moat Water Body - Surrounds the arena in its shape (star, circle, etc.)
 * Creates a water-filled gap between the playing area and the outer boundary
 */
export interface MoatWaterBodyConfig extends BaseWaterBodyConfig {
  type: "moat";
  thickness: number; // Thickness of moat (em units, 1-10)
  distanceFromArena: number; // Inner radius from center (em units, 5-25)
  followsArenaShape: boolean; // true = matches arena shape, false = uses custom moatShape
  moatShape?: ArenaShape; // Custom shape for moat (only used when followsArenaShape is false)
  /** Rotational offset of the moat pattern relative to arena center (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}

/**
 * Zone Water Body - Positioned water body with custom shape inside arena
 * Can be placed at any X, Y position with specific dimensions
 */
export interface ZoneWaterBodyConfig extends BaseWaterBodyConfig {
  type: "zone";
  position: { x: number; y: number }; // Position relative to center (em units)
  shape: "circle" | "square" | "rectangle" | "oval"; // Water zone shape
  radius?: number; // For circle/oval - radius (em units)
  width?: number; // For square/rectangle - width (em units)
  height?: number; // For rectangle/oval - height (em units)
  rotation?: number; // Rotation angle in degrees (0-360)
}

/**
 * Wall-Based Water Body - Water at the edges of arena, in front of walls and exits
 * Follows the exact shape of the arena, positioned at the edge
 */
export interface WallBasedWaterBodyConfig extends BaseWaterBodyConfig {
  type: "wall-based";
  thickness: number; // Thickness of water strip (em units, 1-5)
  offsetFromEdge: number; // Distance from arena edge inward (em units, 0-3)
  coversExits: boolean; // Whether water also covers exit zones (default: true)
}

/**
 * Union type for all water body configurations
 */
export type WaterBodyConfig = MoatWaterBodyConfig | ZoneWaterBodyConfig | WallBasedWaterBodyConfig;

/**
 * Portal Configuration
 * Linked teleportation points (max 4 portals) - all portals are interconnected
 * Entering any portal can teleport to any other portal based on directional input or randomly
 */
export interface PortalConfig {
  id: string; // 'portal1', 'portal2', 'portal3', or 'portal4'
  portalNumber?: number; // Portal number for display (1-4)
  position: { x: number; y: number }; // Portal position (em units, relative to center)
  radius: number; // Visual size (em units)
  cooldown?: number; // Seconds before can be used again (default: 0)
  color?: string; // Visual color (default: varies by portal number)
  autoPlace?: boolean; // Auto-place at equal angles from center
  distanceFromCenter?: number; // Distance from center (em units) for auto-placement
  angle?: number; // Angle from center (degrees) for auto-placement
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  /** Firebase asset doc ID from portal_assets collection. */
  spriteId?: string;
}

// ============================================================================
// PIT CONFIGURATION
// ============================================================================

/**
 * Pit Types - Different styles of pits
 */
export type PitType = "edge" | "crater" | "penalty_well" | "xtreme_zone" | "over_zone" | "spike_pit";

/**
 * Pit Configuration
 * Pits are hazardous zones that trap beyblades temporarily
 * When a beyblade enters a pit:
 * - Takes spin damage every second
 * - Cannot be controlled
 * - Has 50% chance each second to escape before damage is applied
 */
export interface PitConfig {
  id: string; // 'pit1', 'pit2', 'pit3'
  type: PitType;
  position: { x: number; y: number }; // Position relative to center (em units)
  radius: number; // Pit size (em units, 1-5)
  depth: number; // Visual depth effect (1-10, affects appearance)
  spinDamagePerSecond: number; // Spin damage taken per second (5-50)
  escapeChance: number; // Chance to escape before damage (0-1, default: 0.5 = 50%)
  color?: string; // Visual color (default: dark brown/black)
  autoPlace?: boolean; // Auto-place at edge or random position
  edgeOffset?: number; // Distance from edge for edge-type pits (em units)
  angle?: number; // Angle for edge-type pits (degrees, 0-360)
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}

// ============================================================================
// WALL CONFIGURATION
// ============================================================================

/**
 * Configuration for a single wall segment on an edge
 */
export interface WallSegment {
  id?: string; // Wall ID for identification (e.g., "E1W1" = Edge 1, Wall 1)
  width: number; // Arc width for circle, or length for polygon edges (in percentage 0-100)
  thickness: number; // Wall thickness (em units)
  position: number; // Position along edge (0-100%), for multiple walls per edge
}

/**
 * Configuration for walls on a single edge
 */
export interface EdgeWallConfig {
  walls: WallSegment[]; // Array of wall segments (1-3 walls per edge)
  // Empty spaces between walls become exits (red zones with arrows)
}

/**
 * Complete wall configuration for the arena
 */
export interface WallConfig {
  enabled: boolean; // If false, no walls at all
  
  // Wall configuration per edge
  // Number of edges depends on shape: circle=1, triangle=3, square=4, pentagon=5, etc.
  edges: EdgeWallConfig[];
  
  // Common wall properties
  commonThickness?: number; // Common thickness for all walls (optional)
  
  // Wall appearance
  wallStyle: "brick" | "metal" | "wood" | "stone"; // Visual appearance
  wallColor?: string; // Optional custom color
  
  // Exit appearance
  exitStyle: "arrows" | "glow" | "dashed"; // How exits are shown
  exitColor: string; // Color for exits (default: red)
  
  // Collision properties
  baseDamage: number; // Damage taken when hitting wall
  recoilDistance: number; // Distance bounced back (em units)
  hasSpikes: boolean; // Spikes increase damage
  spikeDamageMultiplier: number; // Multiplier when spikes enabled
}

// ============================================================================
// TURRET CONFIGURATION
// ============================================================================

// ============================================================================
// FEATURE ANIMATION CONFIG (Phase Z)
// ============================================================================

export type FeatureAnimationPreset =
  | "pulse"           // alpha sin-wave
  | "scale_pulse"     // container scale oscillate
  | "color_cycle"     // hue tween
  | "flicker"         // random alpha flicker
  | "alert"           // fast red flash
  | "shimmer"         // bright highlight sweep
  | "lightning"       // periodic spark emitter
  | "charged"         // intensifying glow
  | "ghost"           // phasing alpha
  | "shockwave_ring"; // expanding ring from center

export interface FeatureAnimationConfig {
  preset: FeatureAnimationPreset;
  periodMs?: number;        // cycle duration (default per preset)
  color?: string;           // override default color
  intensity?: number;       // 0–1 scale on amplitude (default 1.0)
  /** Run a second animation layered on top. */
  secondaryPreset?: FeatureAnimationPreset;
}

// ============================================================================
// TURRET CONFIGURATION
// ============================================================================

/**
 * Turret Attack Types
 */
export type TurretAttackType =
  | "random"      // Random shots in any direction
  | "beam"        // Continuous beam with charge period
  | "periodic"    // Shoots bullets periodically
  | "aoe"         // Area of effect blast (missile)
  | "boomerang"   // Throws boomerang that returns
  // Phase Z — new attack types
  | "laser_sweep"      // Rotating beam that sweeps over beys
  | "sniper"           // Long charge → single high-damage pinpoint shot
  | "shotgun"          // Fan of N projectiles in a cone
  | "mine_layer"       // Drops proximity mines at target position
  | "gravity_cannon"   // Spawns temporary gravity well at target point
  | "emp"              // AoE that disables combos + specials for all beys inside
  | "tracking_missile" // Homing projectile that steers toward nearest bey
  | "burst_fire"       // Rapid burst of bullets, then reload pause
  | "plasma_ring"      // Expanding ring of energy that deals damage on contact
  | "tractor_beam";    // Continuous pull force toward turret

/**
 * Turret Fire Pattern (Phase Z)
 * Controls how the turret picks its target.
 */
export type TurretFirePattern =
  | "nearest"         // target closest bey
  | "furthest"        // target furthest bey
  | "random"          // random bey each shot
  | "round_robin"     // cycle through all beys
  | "lowest_spin"     // target bey with lowest spin
  | "highest_spin"    // target bey with highest spin
  | "center"          // fire toward arena center regardless of beys
  | "sweep_cw";       // rotate aim clockwise continuously

/**
 * Turret Configuration
 * Defensive/offensive structures that attack beyblades
 */
export interface TurretConfig {
  id?: number;
  x: number; // X position (center-relative, -ARENA_RESOLUTION/2 to +ARENA_RESOLUTION/2)
  y: number; // Y position (center-relative, -ARENA_RESOLUTION/2 to +ARENA_RESOLUTION/2)
  radius: number; // Turret size in pixels (15-40px)
  health: number; // Hit points (500-1000) - ignored if indestructible
  indestructible?: boolean; // If true, turret cannot be destroyed
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
  
  // Attack Configuration
  attackType: TurretAttackType;
  attackDamage: number; // Damage per hit (10-50)
  attackRange: number; // Attack range in pixels (100-400)
  attackCooldown: number; // Cooldown between attacks in seconds (1-10)
  
  // Attack Type Specific Properties
  beamDuration?: number; // For beam: how long beam lasts (1-5 seconds)
  beamChargePeriod?: number; // For beam: charge time before firing (0.5-3 seconds)
  bulletSpeed?: number; // For periodic: bullet travel speed (100-500 px/s)
  bulletCount?: number; // For periodic: bullets per shot (1-5)
  aoeRadius?: number; // For AOE: blast radius (50-150px)
  aoeDamageRadius?: number; // For AOE: damage falloff radius (20-100px)
  boomerangReturnTime?: number; // For boomerang: time to return (2-5 seconds)

  // Phase Z — per-type config fields
  /** laser_sweep: full sweep arc (degrees, default 180) */
  laserSweepArcDeg?: number;
  /** laser_sweep: degrees per second the beam rotates */
  laserSweepSpeedDeg?: number;
  /** sniper: charge-up duration before shot fires (seconds) */
  sniperChargeSec?: number;
  /** shotgun: cone half-angle (degrees) */
  shotgunConeHalfDeg?: number;
  /** mine_layer: mine trigger radius (px) */
  mineTriggerRadius?: number;
  /** mine_layer: mine lifetime (seconds, 0 = permanent until triggered) */
  mineLifetimeSec?: number;
  /** gravity_cannon: gravity well pull force (N) */
  gravityCannonForce?: number;
  /** gravity_cannon: gravity well duration (seconds) */
  gravityCannonDurationSec?: number;
  /** emp: disable duration (ticks) applied to hit beys */
  empDisableTicks?: number;
  /** tracking_missile: turn rate (degrees/second) */
  missileTrackingDeg?: number;
  /** burst_fire: bullets per burst */
  burstCount?: number;
  /** burst_fire: delay between shots in burst (seconds) */
  burstIntervalSec?: number;
  /** burst_fire: reload time after burst (seconds) */
  burstReloadSec?: number;
  /** plasma_ring: ring expand speed (px/s) */
  plasmaRingExpandSpeed?: number;
  /** plasma_ring: maximum ring radius before disappearing (px) */
  plasmaRingMaxRadius?: number;
  /** tractor_beam: sustained pull force (N) */
  tractorBeamForce?: number;

  // Phase Z — targeting
  firePattern?: TurretFirePattern;

  // Visual
  color?: string; // Optional custom color (defaults to theme color)
  autoPlaced?: boolean; // Was this turret auto-placed?
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  /** Initial facing angle + optional continuous rotation of the turret body itself. */
  rotation?: RotationBlock;
  selfRotation?: SelfRotationConfig;
  /** Firebase asset doc ID from turret_assets collection. */
  spriteId?: string;
  /** Firebase asset doc ID for projectile sprite from turret_assets collection. */
  projectileSpriteId?: string;
}

// ============================================================================
// OBSTACLES CONFIGURATION
// ============================================================================

/**
 * Obstacle Icon Mapping by Theme
 */
export const OBSTACLE_ICONS = {
  metrocity: "🏢", // Skyscrapers
  forest: "🌲", // Trees
  sea: "⚓", // Anchors
  ocean: "⚓", // Anchors
  prehistoric: "🦴", // Bones
  futuristic: "👽", // Aliens
  mountains: "🗻", // Mountains
  grasslands: "🌾", // Grass/crops
  safari: "🌴", // Palm trees
  desert: "🌵", // Cactus
  riverbank: "🪨", // Rocks
} as const;

/**
 * Obstacle Configuration
 * Theme-based destructible obstacles that damage beyblades on collision.
 *
 * Phase 6 — Drawable obstacles. The base fields (x, y, radius) stay for
 * backwards-compat; the new `shape` discriminated union extends what can be
 * placed (arc / ring / polyline / spiral / rectangle / bezier).
 */
export type ObstacleShape =
  | { kind: "circle"; radiusCm: number }
  | { kind: "ring"; innerRadiusCm: number; outerRadiusCm: number }
  | { kind: "arc"; radiusCm: number; startDeg: number; endDeg: number; thicknessCm: number }
  | { kind: "spiral"; innerRadiusCm: number; outerRadiusCm: number; turns: number; thicknessCm: number }
  | { kind: "polyline"; points: Array<{ x_cm: number; y_cm: number }>; thicknessCm: number; closed: boolean }
  | { kind: "bezier"; controlPoints: Array<{ x_cm: number; y_cm: number }>; thicknessCm: number }
  | { kind: "rectangle"; widthCm: number; heightCm: number }
  // Phase Z — new shapes
  | { kind: "cross"; armLengthCm: number; armWidthCm: number }
  | { kind: "L_shape"; longArmCm: number; shortArmCm: number; thicknessCm: number }
  | { kind: "T_shape"; widthCm: number; heightCm: number; thicknessCm: number }
  | { kind: "zigzag"; segmentLengthCm: number; segmentCount: number; zigWidthCm: number; thicknessCm: number }
  | { kind: "star_shape"; outerRadiusCm: number; innerRadiusCm: number; points: number }
  | { kind: "pinball_bumper"; radiusCm: number; restitution?: number }
  | { kind: "wrecking_ball"; radiusCm: number; cableLength: number; swingAmplitudeDeg: number; swingPeriodMs: number; startPhaseDeg?: number };

export type ObstaclePhysicsType =
  | "wall"
  | "bump"
  | "ramp"
  | "ledge"
  | "ridge"
  | "grip"
  | "speedline"
  // Phase Z — new physics types
  | "magnetic"
  | "trampoline"
  | "spinner"
  | "crusher"
  | "electrified"
  | "sticky"
  | "bouncy_net";

export interface ObstaclePhysicsBlock {
  type: ObstaclePhysicsType;
  heightCm: number;
  jumpableHeightCm?: number;
  direction?: "one-way" | "two-way";
  oneWayAngleDeg?: number;
  rampAngleDeg?: number;
  gripFriction?: number;          // > 1 = sticky, < 1 = slick
  speedlineBoostCmPerS?: number;  // tangential acceleration along the line

  // Phase Z — magnetic
  magnetRadiusCm?: number;        // effective pull/push radius
  magnetStrength?: number;        // force magnitude (positive = attract, negative = repel)

  // Phase Z — trampoline
  trampolineBoost?: number;       // upward velocity impulse multiplier (default 1.5)

  // Phase Z — spinner
  spinRpmImpulse?: number;        // angular velocity added to bey on contact (rpm)

  // Phase Z — crusher
  crushAxis?: "x" | "y";         // direction of crush travel
  crushTravelCm?: number;         // distance the crusher extends
  crushCyclePeriodMs?: number;    // full extend+retract cycle duration

  // Phase Z — electrified
  disableTicks?: number;          // ticks combos + specials are disabled on contact

  // Phase Z — sticky
  stickyDurationTicks?: number;   // ticks bey velocity is frozen on contact

  // Phase Z — bouncy_net
  netRestitution?: number;        // elasticity coefficient (default 1.8 — extra bouncy)
}

export type ObstacleRenderMode =
  | { mode: "line"; stroke: "solid" | "dashed" | "dotted"; dashCm?: number; gapCm?: number; colorKey?: string }
  | { mode: "floor"; topColorKey?: string; sideColorKey?: string };

export interface RotationBlock {
  mode: "static" | "auto" | "linked-to-arena" | "intervaled" | "partial-swept";
  speedDegPerSec?: number;
  direction?: "cw" | "ccw" | "alternating";
  initialAngleDeg?: number;
  intervalOn?: { activeMs: number; pauseMs: number };
  partialSweep?: { fromDeg: number; toDeg: number; cycleMs: number };
  /**
   * "local" (default) — feature rotates with the arena when autoRotate is on.
   * "world" — feature stays fixed in world space regardless of arena rotation.
   */
  space?: "local" | "world";
}

/**
 * Lifecycle type for a rotating arena feature.
 *
 * - permanent : spins continuously for the whole match (default)
 * - temporary : spins for `temporaryDurationMs` ms then stops
 * - once      : fires once at match start (optionally after `onceFiredAtStartMs` delay), then stops
 * - pulsed    : alternates on/off using `pulsedActiveMs` / `pulsedPauseMs`
 * - oscillate : sweeps from `oscillateFromDeg` to `oscillateToDeg` and returns,
 *               repeating continuously. Like a pendulum — e.g. rotates 20° CW then 20° back.
 */
export type SelfRotationType = "permanent" | "temporary" | "once" | "pulsed" | "oscillate";

/**
 * Continuous self-rotation for a placed feature.
 * space: "local" (default) — spins relative to the arena frame (goes around with arena rotation).
 *        "world" — angular velocity is in world space; arena rotation does not add to it.
 */
export interface SelfRotationConfig {
  speedDegPerSec: number;
  direction: "cw" | "ccw";
  space?: "local" | "world";
  /** Lifecycle — defaults to "permanent" when absent. */
  type?: SelfRotationType;

  // ── temporary ────────────────────────────────────────────────────────────────
  /** "temporary": total active duration in ms. */
  temporaryDurationMs?: number;

  // ── once ─────────────────────────────────────────────────────────────────────
  /** "once": delay from match start before the single rotation fires (ms). */
  onceFiredAtStartMs?: number;

  // ── pulsed ───────────────────────────────────────────────────────────────────
  /** "pulsed": on-duration per cycle (ms). */
  pulsedActiveMs?: number;
  /** "pulsed": off-duration per cycle (ms). */
  pulsedPauseMs?: number;

  // ── oscillate (sweep CW n°, then back CCW n°, repeat) ────────────────────────
  /** "oscillate": start angle of the sweep in degrees from the feature's rest position. */
  oscillateFromDeg?: number;
  /** "oscillate": end angle of the sweep in degrees. e.g. 20 = rotate 20° then return. */
  oscillateToDeg?: number;
  /**
   * "oscillate": true = sweeps from→to, then back to→from (pendulum).
   *              false = sweeps from→to, snaps back instantly, repeats.
   * Defaults to true (pendulum).
   */
  oscillateReturn?: boolean;
  /** "oscillate": override half-sweep duration in ms. Computed from speedDegPerSec when absent. */
  oscillateSweepMs?: number;
}

export interface ObstacleConfig {
  id?: number;
  x: number; // X position (center-relative, -ARENA_RESOLUTION/2 to +ARENA_RESOLUTION/2)
  y: number; // Y position
  radius: number; // Legacy fallback used when `shape` is absent. Pixels at 1cm = 24px.
  health: number;
  damage: number;
  recoilDistance: number;
  indestructible?: boolean;
  color?: string;
  autoPlaced?: boolean;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;

  // Phase 6 additions — optional, additive.
  shape?: ObstacleShape;
  render?: ObstacleRenderMode;
  physics?: ObstaclePhysicsBlock;
  rotation?: RotationBlock;
  triggerState?: "on" | "off";    // toggleable by switches (Part 6)
  /** Feature is only active when this switch is on. Optional. */
  controlledBySwitchId?: string;
  /** Self-rotation for visual + damage-face dynamics. Optional. */
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  /** Firebase asset doc ID from obstacle_assets collection. */
  spriteId?: string;
}

// ─── Switch obstacle (Part 6) ──────────────────────────────────────────────

export type SwitchAction =
  | { kind: "toggle" }
  | { kind: "set-on" }
  | { kind: "set-off" }
  | { kind: "pulse"; durationMs: number }
  | { kind: "rotation-on" }
  | { kind: "rotation-off" }
  | { kind: "set-property"; key: string; value: unknown }
  | { kind: "chain"; nextSwitchId: string };

export interface SwitchTarget {
  targetType:
    | "obstacle" | "water" | "portal" | "pit" | "ridge"
    | "zone" | "trigger-zone" | "spin-zone" | "speedline"
    | "gravity-hole" | "turret" | "switch";
  targetId: string;
  action: SwitchAction;
}

export interface SwitchConfig {
  id: string;
  x: number;
  y: number;
  iconKey: string;
  animationKeys?: { idle?: string; pressed?: string; cooldown?: string };
  switch: {
    targets: SwitchTarget[];
    cooldownMs: number;
    autoReset?: number;
    requiresMinSpin?: number;
    triggerCountToActivate?: number;
  };
  shape?: ObstacleShape;
  rotation?: RotationBlock;
}

// ─── Gravity hole (Part 5b) ────────────────────────────────────────────────

export interface GravityHoleConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  forceN: number;                // peak attraction (Matter "force" units)
  effectiveRadiusCm: number;
  activeMs: number;              // pull duration per activation
  intervalMs: number;            // time between activations
  warningMs: number;             // visual tell before activation
  visibility: "always-hidden" | "warning-only" | "visible";
  rotation?: RotationBlock;
  controlledBySwitchId?: string;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}

// ─── Trigger zones (Part 5c) ───────────────────────────────────────────────

export type TriggerZoneKind =
  | { type: "safe" }
  | { type: "damage"; perSecond: number }
  | { type: "heal"; perSecond: number }
  | { type: "knockout"; soloHoldMs: number }
  | { type: "spin-boost"; spinDirection: "cw" | "ccw" | "match" | "alternate"; perSecond: number }
  | { type: "expel"; impulseCm: number }
  | { type: "speed-scale"; multiplier: number };

export type TriggerZoneActivation =
  | { type: "always-on" }
  | { type: "intervaled"; activeMs: number; pauseMs: number }
  | { type: "switch-controlled"; defaultState: "on" | "off" };

export interface TriggerZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  shape: ObstacleShape;
  kind: TriggerZoneKind;
  activation: TriggerZoneActivation;
  rotation?: RotationBlock;
  vfx?: { idleKey?: string; activeKey?: string };
  /** Feature is only active when this switch is on. Optional. */
  controlledBySwitchId?: string;
  /** Feature spins in place — visual + functional. */
  selfRotation?: SelfRotationConfig;
}

// ─── Spin Zone (new in this overhaul) ──────────────────────────────────────
// Circular zone that imparts spin or linear orbit force to beyblades inside it.

export interface SpinZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  direction: "cw" | "ccw";
  intensityRadPerSec: number;
  /** What the zone affects: linear orbit, spin top-up, or both. */
  applyTo: "linear" | "spin" | "both";
  /** Asset id (sprite) — references spin_zone_assets. Optional. */
  assetId?: string;
  controlledBySwitchId?: string;
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}

// ─── Bump (new in this overhaul) ───────────────────────────────────────────
// Small raised feature that adds vertical impulse + small lateral recoil on contact.

export interface BumpConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  popHeight_cm: number;
  recoil: number;
  assetId?: string;
  controlledBySwitchId?: string;
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}

// ============================================================================
// GEAR RAIL (Xtreme Stadium — BX)
// ============================================================================

export interface GearRailConfig {
  id: string;
  /** Ordered polyline of waypoints in cm relative to arena center. */
  polylineCm: Array<{ x: number; y: number }>;
  /** Speed boost applied while on rail, as per-mille of max speed (e.g. 350 = 35% boost). */
  speedBoostPermille: number;
  /** If true, only beys with gearCompatibleBit=true can use this rail. */
  requiresGearCompatibleBit?: boolean;
  /** Duration of the boost after exiting the rail (ms). Default 400. */
  boostDurationMs?: number;
  /** ScoringZone ids that this rail can feed into. */
  exitZoneIds?: string[];
  color?: string;
}

// ============================================================================
// SCORING ZONES (BX point differential)
// ============================================================================

export interface ScoringZoneConfig {
  id: string;
  /** Kind determines point value override vs the points field. */
  kind: "xtreme" | "over" | "pocket" | "ring_out";
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  /** Points awarded when a bey exits through this zone. */
  points: number;
  color?: string;
}

// ============================================================================
// TORNADO RIDGE (MFB / Tornado Stall terrain)
// ============================================================================

export interface TornadoRidgeConfig {
  /** Radius of the ridge ring from arena center (cm). */
  radiusCm: number;
  /** Width of the ridge band (cm). Default 4. */
  widthCm?: number;
  /** Tangential orbit force applied to beys on the ridge (per-tick, px). Default 0.003. */
  orbitIntensity?: number;
  /** CCW or CW direction. Default "cw". */
  direction?: "cw" | "ccw";
  /** Spin boost percent per second for beys on the ridge. Default 2. */
  spinBoostPercent?: number;
}

// ============================================================================
// ZERO-G (Zero-G Stadium dynamic tilt)
// ============================================================================

export interface ZeroGConfig {
  /** Tilt period in ms — how long one full cycle takes. Default 8000. */
  tiltPeriodMs?: number;
  /** Maximum tilt angle in degrees. Default 15. */
  maxTiltDeg?: number;
  /** Gravity scale when fully tilted (0 = weightless at peak). Default 0.2. */
  minGravityScale?: number;
  /** Whether the tilt axis rotates over time. Default true. */
  rotatingAxis?: boolean;
}

/**
 * Bowl cross-section profiles — named presets for the curvature/slope of arena walls.
 * Maps to wallAngle values used by the physics engine.
 *
 *  flat    (0°)  — vertical walls, beys bounce straight back
 *  shallow (20°) — slight inward slope, gentle redirects
 *  medium  (40°) — classic beyblade B-200 bowl profile
 *  deep    (60°) — steep bowl, keeps beys circling center
 *  steep   (75°) — extreme cup shape, very hard to KO
 */
export type BowlProfile = "flat" | "shallow" | "medium" | "deep" | "steep";

export const BOWL_PROFILE_ANGLES: Record<BowlProfile, number> = {
  flat:    0,
  shallow: 20,
  medium:  40,
  deep:    60,
  steep:   75,
};

export const BOWL_PROFILE_LABELS: Record<BowlProfile, string> = {
  flat:    "Flat (0°) — vertical walls",
  shallow: "Shallow (20°) — slight slope",
  medium:  "Medium (40°) — classic bowl",
  deep:    "Deep (60°) — steep funnel",
  steep:   "Steep (75°) — cup shape",
};

// ============================================================================
// ARENA TIMELINE (Phase T)
// ============================================================================

export type ArenaTimelineEventType =
  | "activate_feature"
  | "deactivate_feature"
  | "spawn_feature"
  | "arena_tilt"
  | "gravity_change"
  | "announcement";

export interface ArenaTimelineEvent {
  triggerMs: number;                  // ms after match enters "in-progress"
  type: ArenaTimelineEventType;
  featureId?: string;                 // target feature id (activate/deactivate)
  params?: Record<string, unknown>;   // feature-specific params (strength, radius, mult, angle…)
  announcement?: {
    text: string;
    style?: "warning" | "info" | "danger";
  };
  repeat?: {
    intervalMs: number;               // delay between repeats
    count: number;                    // additional fires (total = count + 1)
  };
}

// ============================================================================
// ENHANCED ARENA CONFIG (Phase V)
// ============================================================================

export interface ArenaShrinkConfig {
  startMs: number;              // ms after match start when ring begins shrinking
  endMs: number;                // ms when minimum size is reached
  minRadiusFraction: number;    // 0–1: fraction of original arena radius at smallest (e.g. 0.4 = 40%)
  damageRatePerTick?: number;   // damage per tick for beys outside boundary (default 2)
  // V6 alternative fields — rate-based specification (converted to startMs/endMs at runtime)
  enabled?: boolean;            // V6 quick-enable toggle
  shrinkRateCmPerSec?: number;  // cm per second the arena shrinks (alternative to startMs/endMs pair)
  minRadiusCm?: number;         // absolute minimum radius in cm (alternative to minRadiusFraction)
}

export type FloorHazardType =
  | "lava"
  | "ice"
  | "mud"
  | "electric"
  | "time_slow"
  | "repulsion"
  | "size_shrink"
  | "size_grow"
  | "trampoline"
  | "combo_boost"
  | "drain"
  | "void"
  | "poison";

export interface FloorHazardZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  hazardType: FloorHazardType;
  intensity?: number;               // multiplier on default effect strength (default 1.0)
  damagePerTick?: number;           // lava: damage per tick while inside (default 5)
  spinDecayMult?: number;           // lava: extra spin decay multiplier (default 1.5)
  frictionMultiplier?: number;      // ice: friction scale (default 0.05)
  disableTicks?: number;            // electric: ticks combos+specials are disabled on entry
  durationMs?: number;              // null = permanent
  controlledBySwitchId?: string;
  activeByDefault?: boolean;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}

export type EffectZoneType =
  | "power_charge"
  | "spin_recovery"
  | "combo_boost"
  | "stat_aura"
  | "safe_zone"
  | "turbo_zone"
  | "respawn_point";

export interface StatDelta {
  stat: string;
  multiplier: number;
}

export interface EffectZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  effectType: EffectZoneType;
  intensity?: number;
  statAura?: StatDelta[];           // for "stat_aura" type
  durationMs?: number;              // null = permanent while inside
  controlledBySwitchId?: string;
  activeByDefault?: boolean;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}

export interface ElevationZoneConfig {
  id: string;
  // Primary coordinate fields (cm, arena-center-relative)
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  heightCm: number;                 // platform height above floor
  spinBoostOnPlatform?: number;     // spin/s bonus while on platform (default 0)
  edgeDropForce?: number;           // impulse applied when crossing platform edge (default 0)
  // Alternate field names (V4 spec aliases — same values, different keys)
  x?: number;                       // alias for x_cm
  y?: number;                       // alias for y_cm
  radius?: number;                  // alias for radius_cm
  height?: number;                  // alias for heightCm
  spinBoostPercent?: number;        // % spin boost while on platform (e.g. 10 = +10%)
  controlledBySwitchId?: string;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  /** Initial sprite orientation (degrees). */
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}

// ============================================================================
// BACKGROUND PARTICLES + ENVIRONMENTAL EFFECTS (Phase Z)
// ============================================================================

export type BackgroundParticleType =
  | "snow"
  | "rain"
  | "embers"
  | "leaves"
  | "bubbles"
  | "sparks"
  | "pollen"
  | "ash"
  | "stars"
  | "glitch_pixels";

export interface ArenaBackgroundParticles {
  type: BackgroundParticleType;
  density?: number;           // particles per second (default 20)
  speed?: number;             // base particle speed multiplier (default 1.0)
  direction?: number;         // angle in degrees (0 = down, 90 = left)
  color?: string;             // override default particle color
  affectedByArenaRotation?: boolean; // default true
}

export type ArenaEnvironmentalEffectPreset =
  | "storm"       // oscillating lateral wind force + rain overlay
  | "blizzard"    // fixed lateral force + snow overlay
  | "volcanic"    // upward ash particles + ember embers
  | "underwater"  // subtle drag force, bubble particles
  | "cyber"       // no physics, glitch_pixels overlay
  | "earthquake"; // periodic random impulse shake

export interface ArenaEnvironmentalEffect {
  preset: ArenaEnvironmentalEffectPreset;
  intensity?: number;         // 0–1 (default 0.5)
  intervalMs?: number;        // for oscillating/periodic effects — cycle duration
}

// ============================================================================
// ARENA BEY SPAWN CONFIG (I3)
// ============================================================================

export interface SpawnPositionSimple {
  type: "current" | "random_in_arena" | "between_beys" | "opponent";
  dx?: number;
  dy?: number;
  radiusCm?: number;
}

export interface ArenaBeySawnConfig {
  enabled: boolean;
  spawnIntervalSec: number;
  maxSpawnedBeys: number;
  despawnCondition: "knockout" | "timeout" | "never";
  despawnAfterTicks?: number;
  beyPool: {
    beyId: string;
    statsMultiplier?: number;        // 0.5–2.0; default 1.0
    perSpawnMultiplier?: boolean;    // random ±0.5–1.5 each spawn
    aiDifficulty: "medium" | "hard" | "hell";
    controlMode: "ai" | "friendly";
    spawnPosition?: SpawnPositionSimple;
    maxFromThisEntry?: number;
  }[];
  spawnOnCondition?: {
    type: "time_elapsed" | "bey_count_below" | "player_spin_below";
    threshold: number;
  };
}

// ============================================================================
// ARENA FLOOR GROUP (L1-F)
// Up to 7 arenas stacked as named floors. Each arena stores its groupId +
// floorIndex on ArenaConfig. Links between floors are ArenaLink entries whose
// fromArenaId / toArenaId both appear in the same group.
// ============================================================================

/**
 * Per-floor physical positioning within a group.
 * Describes where each floor arena sits in the shared world space.
 */
export interface FloorStackPosition {
  /** Floor index this position entry applies to (0 = ground). */
  floorIndex: number;
  /**
   * Horizontal offset of this floor's center from the group's world origin (cm).
   * Non-zero values let arenas be slightly misaligned so beys can fall off edges.
   */
  xOffsetCm: number;
  yOffsetCm: number;
  /**
   * Elevation of this floor's surface above the ground floor (cm).
   * Ground floor (index 0) should be 0. Higher floors stack upward.
   */
  zOffsetCm: number;
  /** Arena rotation speed in degrees/sec (0 = static). */
  rotationSpeedDegPerSec?: number;
  rotationDirection?: "cw" | "ccw";
  rotationMode?: "none" | "auto" | "linked";
}

export interface ArenaFloorGroup {
  id: string;
  name?: string;
  /**
   * Arena IDs ordered from ground floor (index 0) up to the top floor.
   * Maximum 7 arenas per group.
   */
  floorArenaIds: string[]; // enforced max length 7 by server

  /**
   * Physical positions of each floor in the group's world space.
   * If absent for a floor, defaults to xOffset=0, yOffset=0, zOffset=floorIndex*minFloorHeightCm.
   */
  floorPositions?: FloorStackPosition[];

  /**
   * Minimum vertical clearance (cm) between the surface of one floor and the
   * underside of the next. Governs camera zoom headroom and ceiling collision.
   * Default: 60 cm (enough to see a full arena + beys + HUD without obstruction).
   */
  minFloorHeightCm?: number;
}

// ============================================================================
// ARENA LINK CONFIG (L1)
// ============================================================================

// ─── Alignment ───────────────────────────────────────────────────────────────

/**
 * Controls whether and how a link requires the two arenas to be rotationally
 * aligned before a bey can traverse it.
 *
 * "none"        — always open regardless of arena angle (portals).
 * "positional"  — both arenas must have rotated their boundary openings to within
 *                 errorMarginDeg of each other. Pits, trampolines, corridors.
 * "owner-only"  — only the owner arena's rotation is checked against a fixed
 *                 exit angle on the destination. Used for ramps: the ramp is
 *                 physically attached to fromArena and sweeps with it; the
 *                 landing zone on toArena is fixed.
 */
export type ArenaLinkAlignmentMode = "none" | "positional" | "owner-only";

export interface ArenaLinkAlignmentConfig {
  mode: ArenaLinkAlignmentMode;

  /** Degrees of rotational error tolerated for the link to count as aligned. */
  errorMarginDeg: number;

  /**
   * When a bey traverses within (errorMarginDeg * 2) but outside errorMarginDeg,
   * the server applies a correction impulse for this many ticks to nudge the bey
   * onto the proper landing position. Set 0 to disable correction entirely.
   */
  correctionTicks: number;

  /**
   * If true (ramps, corridors), the link is severed while misaligned — beys
   * cannot enter it at all and the gap is shown visually.
   * If false (pits, trampolines), the link is still traversable when misaligned
   * but correction may not apply; pits land wherever gravity takes the bey.
   */
  disconnectsWhenMisaligned: boolean;

  /**
   * After a disconnection, minimum ticks before alignment is rechecked.
   * Prevents rapid connect/disconnect flicker at the margin boundary.
   */
  reconnectCooldownTicks: number;

  /**
   * For "owner-only" mode (ramps): the arena ID whose rotation is the reference.
   * Typically the fromArenaId — the arena the ramp physically extends from.
   * The ramp reconnects only when this arena's rotation brings the ramp tip
   * within errorMarginDeg of the fixed landing zone on toArena.
   */
  ownerArenaId?: string;
}

// ─── Traversal timing ────────────────────────────────────────────────────────

export interface ArenaLinkTraversalConfig {
  /** Ticks spent in transit — fall animation, ramp travel, trampoline arc. */
  traversalTicks: number;

  /**
   * Ticks before the same bey can use this link again after completing a
   * traversal (prevents immediate bounce-back).
   */
  perBeyReuseCooldownTicks: number;

  /**
   * Ticks after any bey exits this link before the next bey can enter
   * (prevents traffic-jam collisions in the transit tube).
   */
  globalGapTicks: number;
}

// ─── Pit-specific ─────────────────────────────────────────────────────────────

export interface ArenaLinkPitConfig {
  /**
   * "fixed"   — bey always exits at the configured exitPosition in the destination arena.
   * "random"  — bey exits at a random safe position on the destination floor.
   *             Tolerant of misalignment; good default for pits.
   * "current" — bey exits at the same relative x/y (coordinates scaled to destination).
   */
  landingMode: "fixed" | "random" | "current";
}

// ─── Trampoline-specific ──────────────────────────────────────────────────────

export interface ArenaLinkTrampolineConfig {
  /**
   * If a bey arrives on this trampoline link having fallen from a pit link
   * directly above (same pairedLinkId chain), automatically launch it back
   * upward toward the source pit without player input.
   */
  autoLaunchFromPit: boolean;

  /** Ticks of launch animation shown before the bey re-enters the pit above. */
  autoLaunchAnimTicks: number;

  /**
   * Velocity multiplier applied to the auto-launch impulse.
   * 1.0 = match the fall speed exactly (symmetric bounce).
   * Values > 1 send the bey higher than it fell from.
   */
  autoLaunchForceMult: number;

  /**
   * Whether the player can cancel the auto-launch by holding SPACE or DOWN
   * during the autoLaunchAnimTicks window.
   * If pressed in time the bey stays on the trampoline floor instead of
   * being shot back up. Useful for strategic floor-camping.
   */
  autoLaunchOptOut: boolean;

  /**
   * How many ticks after landing the player has to hold the opt-out key
   * before the launch fires. Only meaningful when autoLaunchOptOut is true.
   * Defaults to autoLaunchAnimTicks (full window).
   */
  autoLaunchOptOutWindowTicks?: number;
}

// ─── ArenaLink ───────────────────────────────────────────────────────────────

export interface ArenaLink {
  id: string;
  fromArenaId: string;         // source arena doc id
  toArenaId: string;           // destination arena doc id
  linkType: "corridor" | "portal" | "ramp" | "pit" | "trampoline";

  // Boundary geometry: beys crossing this line segment trigger the link
  boundaryLine: {
    x1: number; y1: number;    // start point in cm (arena coords)
    x2: number; y2: number;    // end point in cm
  };

  exitPosition: {              // where the bey appears in the destination arena (cm)
    x: number;
    y: number;
  };

  momentumPreserved: boolean;  // if true, bey keeps velocity; if false, spawns at rest
  levelDelta: number;          // height difference in cm (affects launch velocity for ramps)
  hazardDamage?: number;       // damage dealt on traversal (for dangerous links)
  reverseCondition?: "never" | "always" | "spin_above_50";  // one-way vs two-way
  cooldownTicks?: number;      // ticks before a bey can use this link again after traversal
  pairedLinkId?: string;       // id of the reciprocal link (admin UI wires pairs)
  exitVelocityMult?: number;   // velocity multiplier on exit (default 1.0)

  /**
   * How the two linked arenas' rotation relates when both have autoRotate on.
   *
   * "independent" (default) — each arena rotates at its own speed/direction.
   * "synchronized"          — both rotate at the same speed/direction;
   *                           fromArena's rotationSpeed/Direction is authoritative.
   * "counter"               — opposite directions at equal speed; natural for
   *                           arenas sharing a physical boundary edge.
   * "driven"                — fromArena drives toArena via rotationDrivenRatio;
   *                           toArena's own rotationSpeed is ignored while linked.
   */
  rotationCoupling?: "independent" | "synchronized" | "counter" | "driven";
  /** Only used when rotationCoupling is "driven". toArena speed = fromArena speed × ratio. */
  rotationDrivenRatio?: number;

  // ─── Alignment (rotation-aware gating) ─────────────────────────────────────
  /**
   * Alignment rules for this link. Sensible defaults by linkType:
   *   portal      → mode: "none",      disconnectsWhenMisaligned: false
   *   ramp        → mode: "owner-only", disconnectsWhenMisaligned: true,  ownerArenaId: fromArenaId
   *   corridor    → mode: "positional", disconnectsWhenMisaligned: true
   *   pit         → mode: "positional", disconnectsWhenMisaligned: false,  landingMode: "random"
   *   trampoline  → mode: "positional", disconnectsWhenMisaligned: false
   */
  alignment?: ArenaLinkAlignmentConfig;

  // ─── Traversal timing ───────────────────────────────────────────────────────
  traversal?: ArenaLinkTraversalConfig;

  // ─── Type-specific configs ───────────────────────────────────────────────────
  pitConfig?: ArenaLinkPitConfig;
  trampolineConfig?: ArenaLinkTrampolineConfig;
}

// ============================================================================
// BEY LINK CONFIG — dynamic bey-to-bey stacking interactions
// Inspired by anime: Dranzer S pecking on Draciel's bit chip (hostile),
// or Dynasty team beys spinning together to combine power (friendly).
// ============================================================================

export type BeyLinkType =
  | "tip_stack"  // attacker's spinning TIP (bottom) grinds on defender's BIT CHIP (top) — vertical drill/peck from above. e.g. Kai's Dranzer S pecking on Max's Draciel bit chip
  | "top_mount"  // bey rides atop partner sharing spin axis — cooperative combo stance
  | "side_spin"; // beys spin side-by-side in tangential contact, exchanging angular force

export type BeyLinkAlignment = "friendly" | "hostile" | "neutral";

// ─── Composable per-effect entries ───────────────────────────────────────────

export type BeyLinkEffectType =
  | "spin_drain"            // hostile: continuously drain target's spin
  | "spin_share"            // friendly: equalize spin between both beys each tick
  | "spin_heal"             // friendly: gradually recover own spin while linked
  | "damage_boost"          // friendly: +damageMultiplier bonus while stacked
  | "shield_boost"          // friendly: +damageReduction bonus while stacked
  | "destabilize"           // hostile: periodic lateral force burst against target
  | "continuous_collision"  // hostile: rapid virtual collision impacts (dogfight)
  | "drill_attack"          // hostile: periodic peck impulse onto bit chip — vertical tip_stack behavior
  | "control_loss"          // hostile: scramble / reverse / freeze target's input controls
  | "force_lock";           // hostile: pull target toward attacker each tick (gravity orbit)

export interface BeyLinkEffect {
  type: BeyLinkEffectType;
  intensityPerTick?: number;    // spin drain amount / force magnitude / heal amount per tick
  intervalTicks?: number;       // ticks between events for drill_attack / continuous_collision / control_loss (default: 15 drill, 10 collision, 120 control)
  impactMult?: number;          // damage/force multiplier per event (default 1.0)
  // control_loss specific
  controlMode?: "reverse" | "scramble" | "freeze";
  controlDurationTicks?: number; // how long each control-loss episode lasts (default 60)
}

// ─── Legacy convenience wrappers (kept for backwards compat) ─────────────────

export interface BeyLinkFriendlyBoost {
  damageMultiplierBonus: number;
  spinTransferRate: number;
  shieldBonus: number;
  durationTicks: number;
}

export interface BeyLinkHostileEffect {
  bitChipDamagePerTick: number;
  spinDrainPerTick: number;
  destabilizeForce: number;
  maxDurationTicks: number;
}

// ─── Movement control ─────────────────────────────────────────────────────────

/** Who steers the formation's movement vector while beys are linked. */
export type BeyLinkMovementControl =
  | "auto"       // default — automated orbit/dogfight patterns per linkType
  | "initiator"  // sidA's live bitmask input steers all group members
  | "player";    // any human-controlled bey in the group steers the formation

/** Formation shape applied when 3+ beys share the same link. */
export type BeyLinkGroupPattern =
  | "chain"   // snake/train — each follower trails the bey ahead
  | "star"    // hub + N followers orbit at evenly-spaced angles
  | "wedge"   // V-formation: leader at front, wings behind at ±45°
  | "rigid";  // lock relative positions from stack-entry; move as one mass

export interface BeyLink {
  id: string;
  linkType: BeyLinkType;
  alignment: BeyLinkAlignment;
  entryRadiusCm: number;
  triggerCondition: "any" | "same_team" | "opponent_only";

  // Composable effects list (takes precedence over legacy fields below)
  linkEffects?: BeyLinkEffect[];

  // QTE escape: when hostile, victim can press a single key to break the stack.
  // If a special-move QTE is already active, that QTE is reused for the escape.
  qteEscapable?: boolean;
  qteWindowTicks?: number;    // how many ticks the victim has to press the key (default 60)

  // Legacy convenience fields (still processed if linkEffects is absent)
  friendlyBoost?: BeyLinkFriendlyBoost;
  hostileEffect?: BeyLinkHostileEffect;

  cooldownTicks?: number;
  maxSimultaneous?: number;
  // Duration and break conditions
  maxDurationTicks?: number;    // stack auto-breaks after this many ticks (default: unlimited)
  breakThreshold?: number;      // external collision force/damage required to break the stack (default: never)
  breakOnRingOut?: boolean;     // if true, stack breaks when any participant approaches the ring edge

  // ── Movement control ──────────────────────────────────────────────────────
  movementControl?: BeyLinkMovementControl;  // default "auto"
  groupPattern?: BeyLinkGroupPattern;         // formation for 3+ beys under this link

  // ── Hijack ────────────────────────────────────────────────────────────────
  // Victim of a hostile/neutral link can attempt to seize control, reversing
  // roles. Attacker has a grace window to block; failure hands control to victim.
  hijackable?: boolean;
  hijackWindowTicks?: number;    // ticks for attacker to block (default 90)
  hijackCooldownTicks?: number;  // cooldown on both beys after attempt (default 180)
}

// ============================================================================
// ARENA CONFIG
// ============================================================================

export interface ArenaConfig {
  // ===== BASIC PROPERTIES =====
  id?: string;
  name: string;
  description?: string;

  // ===== GEOMETRY =====
  // NOTE: All arenas use ARENA_RESOLUTION (1080x1080) internally
  // These properties are kept for backward compatibility but should use ARENA_RESOLUTION
  width: number; // Deprecated: use ARENA_RESOLUTION instead
  height: number; // Deprecated: use ARENA_RESOLUTION instead
  shape: ArenaShape;

  // ===== BOWL / CROSS-SECTION =====
  // Controls the curvature of the stadium walls (the bowl shape seen in cross-section).
  // wallAngle: degrees from vertical (0=flat/vertical, 75=near-horizontal cup).
  // Affects physics: steeper walls redirect beys toward center; flat walls send them out.
  bowlProfile?: BowlProfile;   // Named preset (resolves to wallAngle via BOWL_PROFILE_ANGLES)
  wallAngle?: number;           // 0–75 degrees; overrides bowlProfile if set explicitly
  bowlDepth?: number;           // Visual only: 0–1 scale of the bowl's depth in SideView (default 0.4)
  
  // ===== VISUAL & THEME =====
  theme: ArenaTheme;
  backgroundColor?: string; // Custom background color
  floorColor?: string; // Custom floor color
  floorTexture?: string; // URL to floor texture image
  
  // ===== ROTATION =====
  autoRotate: boolean; // Arena rotates constantly
  rotationSpeed: number; // Degrees per second (360/60 = 6°/sec = 1 minute per full rotation)
  rotationDirection: "clockwise" | "counterclockwise";
  
  // ===== WALLS & EXITS =====
  wall: WallConfig;
  
  // ===== SPEED PATHS & PORTALS =====
  speedPaths: SpeedPathConfig[]; // Speed boost paths that players travel along
  loops?: LoopConfig[]; // Deprecated: use speedPaths instead
  portals: PortalConfig[]; // Linked teleportation points (max 4 portals)
  
  // ===== WATER BODIES =====
  waterBodies: WaterBodyConfig[]; // Water bodies in arena (max 3)
  
  // ===== PITS =====
  pits: PitConfig[]; // Pit hazards in arena (max 3)
  
  // ===== OBSTACLES =====
  obstacles?: ObstacleConfig[]; // Destructible obstacles (max 10)
  
  // ===== TURRETS =====
  turrets?: TurretConfig[]; // Defensive turrets (max 8)

  // ===== SWITCHES / GRAVITY / ZONES (Phase 6) =====
  switches?: SwitchConfig[];          // Switch obstacles (toggle other features when hit)
  gravityHoles?: GravityHoleConfig[]; // Invisible periodic attractors (max 3)
  triggerZones?: TriggerZoneConfig[]; // Area-based switches: safe / damage / heal / KO / spin-boost zones

  // ===== NEW FEATURE FAMILY (this overhaul) =====
  spinZones?: SpinZoneConfig[];       // Circular zones that impart orbit or spin
  bumps?: BumpConfig[];               // Raised features that pop beys vertically

  // ── BX / Gen4 features ──────────────────────────────────────────────────────
  gearRails?: GearRailConfig[];
  scoringZones?: ScoringZoneConfig[];
  tornadoRidge?: TornadoRidgeConfig;
  zeroG?: ZeroGConfig;
  /** Per-arena stamina drain multiplier (1.0 = default). Higher = faster spin loss. */
  staminaDrainMultiplier?: number;

  // ===== BEY SPAWN SYSTEM (I3) =====
  beySpawn?: ArenaBeySawnConfig;      // AI / neutral beyblades that spawn mid-match

  // ===== ARENA LINKS (L1) =====
  links?: ArenaLink[];                // Cross-arena corridor / portal / ramp connections
  beyLinks?: BeyLink[];               // Bey-to-bey stacking interaction configs

  // ===== BACKGROUND + ENVIRONMENT (Phase Z) =====
  backgroundParticles?: ArenaBackgroundParticles;
  environmentalEffect?: ArenaEnvironmentalEffect;

  // ===== ROUND MODIFIERS =====
  defaultModifiers?: string[];      // modifier ids always active in this arena
  allowedModifiers?: string[];      // only these modifier ids can be selected (null = all allowed)
  randomModifiers?: boolean;        // if true, server picks 1 random modifier per match
  maxModifiers?: number;            // max stacked modifiers (default 2)

  // ===== QTE SYSTEM =====
  qteEnabled?: boolean;             // default true; false = QTEs disabled for this match
  qteWindowScaling?: "flat" | "by_cost"; // flat = always 60t; by_cost = formula (default)

  // ===== ARENA TIMELINE (Phase T) =====
  arenaTimeline?: ArenaTimelineEvent[];  // Scripted events fired at specific match times

  // ===== ENHANCED ARENA (Phase V) =====
  shrink?: ArenaShrinkConfig;           // Shrinking ring mechanic
  elevationZones?: ElevationZoneConfig[]; // Raised platforms
  floorHazardZones?: FloorHazardZoneConfig[]; // Hazard areas on the floor
  effectZones?: EffectZoneConfig[];     // Positive/neutral effect zones

  // ===== FLOOR GROUP (L1-F) =====
  /**
   * ID of the ArenaFloorGroup this arena belongs to.
   * If set, this arena is one floor in a multi-arena stack (max 7 floors per group).
   */
  floorGroupId?: string;
  /**
   * Zero-based floor index within the group (0 = ground floor, 6 = top floor max).
   * Must match the position of this arena's ID in ArenaFloorGroup.floorArenaIds.
   */
  floorIndex?: number;

  // ===== METADATA =====
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  difficulty?: "easy" | "medium" | "hard" | "extreme" | "custom";
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get number of edges for a given shape
 */
export function getEdgeCount(shape: ArenaShape): number {
  const edgeCounts: Record<ArenaShape, number> = {
    circle: 1,
    triangle: 3,
    square: 4,
    pentagon: 5,
    hexagon: 6,
    heptagon: 7,
    octagon: 8,
    star3: 6,   // 3 points × 2 (outer + inner)
    star4: 8,   // 4 points × 2
    star5: 10,  // 5 points × 2
    star6: 12,  // 6 points × 2
    star7: 14,  // 7 points × 2
    star8: 16,  // 8 points × 2
    rectangle: 4,
  };
  return edgeCounts[shape];
}

/**
 * Initialize wall config with default values for a shape
 */
export function initializeWallConfig(shape: ArenaShape): WallConfig {
  const edgeCount = getEdgeCount(shape);
  
  return {
    enabled: true,
    edges: Array.from({ length: edgeCount }, () => ({
      walls: [
        {
          width: 100, // Full edge by default
          thickness: 1,
          position: 0,
        },
      ],
    })),
    wallStyle: "brick",
    exitStyle: "arrows",
    exitColor: "#ef4444",
    baseDamage: 5,
    recoilDistance: 2,
    hasSpikes: false,
    spikeDamageMultiplier: 1.5,
  };
}

/**
 * Generate random wall configuration
 */
export function generateRandomWalls(shape: ArenaShape): WallConfig {
  const edgeCount = getEdgeCount(shape);
  const config = initializeWallConfig(shape);
  
  config.edges = Array.from({ length: edgeCount }, () => {
    // Randomly choose 1-3 walls per edge
    const wallCount = Math.floor(Math.random() * 3) + 1;
    
    if (wallCount === 1) {
      // Single wall covering 60-100% of edge
      const width = 60 + Math.random() * 40;
      return {
        walls: [
          {
            width,
            thickness: 0.5 + Math.random() * 1.5, // 0.5-2.0em
            position: Math.random() * (100 - width),
          },
        ],
      };
    } else if (wallCount === 2) {
      // Two walls, each covering 30-45% of edge
      const wall1Width = 30 + Math.random() * 15;
      const wall2Width = 30 + Math.random() * 15;
      return {
        walls: [
          {
            width: wall1Width,
            thickness: 0.5 + Math.random() * 1.5,
            position: 0,
          },
          {
            width: wall2Width,
            thickness: 0.5 + Math.random() * 1.5,
            position: 100 - wall2Width,
          },
        ],
      };
    } else {
      // Three walls, each covering 20-30% of edge
      const wall1Width = 20 + Math.random() * 10;
      const wall2Width = 20 + Math.random() * 10;
      const wall3Width = 20 + Math.random() * 10;
      return {
        walls: [
          {
            width: wall1Width,
            thickness: 0.5 + Math.random() * 1.5,
            position: 0,
          },
          {
            width: wall2Width,
            thickness: 0.5 + Math.random() * 1.5,
            position: 50 - wall2Width / 2,
          },
          {
            width: wall3Width,
            thickness: 0.5 + Math.random() * 1.5,
            position: 100 - wall3Width,
          },
        ],
      };
    }
  });
  
  return config;
}

// ============================================================================
// PRESET TEMPLATES
// ============================================================================

// ============================================================================
// THEME DEFAULT CONFIGS (Phase Z — Z9b)
// Applied by ArenaConfigurator as smart defaults when theme is selected.
// ============================================================================

export interface ThemeDefaults {
  bowlProfile?: BowlProfile;
  backgroundColor?: string;
  floorColor?: string;
  backgroundParticles?: ArenaBackgroundParticles;
  environmentalEffect?: ArenaEnvironmentalEffect;
}

export const THEME_DEFAULTS: Partial<Record<ArenaTheme, ThemeDefaults>> = {
  forest:          { bowlProfile: "medium",  backgroundColor: "#1a4a2e", floorColor: "#2d7a4a", backgroundParticles: { type: "leaves", density: 12, direction: 80 } },
  mountains:       { bowlProfile: "deep",    backgroundColor: "#2a3a4a", floorColor: "#6b7280", backgroundParticles: { type: "snow",   density: 8,  direction: 10 } },
  grasslands:      { bowlProfile: "shallow", backgroundColor: "#3d7a2a", floorColor: "#5a9e35" },
  metrocity:       { bowlProfile: "flat",    backgroundColor: "#1a1a2e", floorColor: "#374151" },
  safari:          { bowlProfile: "medium",  backgroundColor: "#c5a35a", floorColor: "#d4a45a" },
  prehistoric:     { bowlProfile: "deep",    backgroundColor: "#3d2a1a", floorColor: "#5a4a2a", backgroundParticles: { type: "ash", density: 6 } },
  futuristic:      { bowlProfile: "flat",    backgroundColor: "#0a0a1a", floorColor: "#1a1a3a", backgroundParticles: { type: "sparks", density: 10 } },
  desert:          { bowlProfile: "shallow", backgroundColor: "#c4a55a", floorColor: "#d4b56a" },
  sea:             { bowlProfile: "medium",  backgroundColor: "#0a2a4a", floorColor: "#1a4a6a", backgroundParticles: { type: "bubbles", density: 15 } },
  ocean:           { bowlProfile: "medium",  backgroundColor: "#061a2e", floorColor: "#0a2a4a", backgroundParticles: { type: "bubbles", density: 20 } },
  riverbank:       { bowlProfile: "shallow", backgroundColor: "#2a4a2a", floorColor: "#3a5a3a" },
  // Phase Z themes
  volcano:         { bowlProfile: "steep",   backgroundColor: "#1a0a00", floorColor: "#3a1a00", backgroundParticles: { type: "embers",  density: 25, direction: 355 }, environmentalEffect: { preset: "volcanic", intensity: 0.7 } },
  frozen_tundra:   { bowlProfile: "deep",    backgroundColor: "#d0e8f8", floorColor: "#b8d4e8", backgroundParticles: { type: "snow",    density: 30, direction: 15  }, environmentalEffect: { preset: "blizzard", intensity: 0.6 } },
  cyber_grid:      { bowlProfile: "flat",    backgroundColor: "#020c18", floorColor: "#051828", backgroundParticles: { type: "glitch_pixels", density: 8 }, environmentalEffect: { preset: "cyber" } },
  underwater_ruins:{ bowlProfile: "medium",  backgroundColor: "#051a2e", floorColor: "#0a2a3a", backgroundParticles: { type: "bubbles", density: 18 }, environmentalEffect: { preset: "underwater", intensity: 0.5 } },
  floating_islands:{ bowlProfile: "shallow", backgroundColor: "#6a9ad0", floorColor: "#8ab8e8", backgroundParticles: { type: "pollen",  density: 10, direction: 20 } },
  crystal_cave:    { bowlProfile: "deep",    backgroundColor: "#1a0a2e", floorColor: "#2a1a4a", backgroundParticles: { type: "sparks",  density: 6, color: "#a0c0ff" } },
  ancient_temple:  { bowlProfile: "medium",  backgroundColor: "#2a1a0a", floorColor: "#3a2a1a", backgroundParticles: { type: "ash",     density: 5 } },
  quantum_realm:   { bowlProfile: "flat",    backgroundColor: "#000010", floorColor: "#0a0020", backgroundParticles: { type: "stars",   density: 20 } },
  haunted_factory: { bowlProfile: "flat",    backgroundColor: "#0a0a0a", floorColor: "#1a1a1a", backgroundParticles: { type: "ash",     density: 8 } },
  lava_core:       { bowlProfile: "steep",   backgroundColor: "#2a0500", floorColor: "#4a0a00", backgroundParticles: { type: "embers",  density: 35 }, environmentalEffect: { preset: "volcanic", intensity: 1.0 } },
  storm_citadel:   { bowlProfile: "medium",  backgroundColor: "#1a1a2a", floorColor: "#2a2a3a", backgroundParticles: { type: "rain",    density: 40, direction: 5  }, environmentalEffect: { preset: "storm",   intensity: 0.8 } },
  neon_underground:{ bowlProfile: "flat",    backgroundColor: "#050510", floorColor: "#0a0a20", backgroundParticles: { type: "sparks",  density: 15, color: "#ff00aa" } },
};

// ============================================================================
// PRESET TEMPLATES
// ============================================================================

export const ARENA_PRESETS: Record<string, Partial<ArenaConfig>> = {
  classic: {
    name: "Classic Stadium",
    shape: "circle",
    theme: "metrocity",
    width: 50,
    height: 50,
    autoRotate: false,
    rotationSpeed: 0,
    rotationDirection: "clockwise",
    wall: initializeWallConfig("circle"),
    speedPaths: [],
    portals: [],
    waterBodies: [],
    bowlProfile: "medium",
    bowlDepth: 0.4,
  },

  square_arena: {
    name: "Square Arena",
    shape: "square",
    theme: "desert",
    width: 50,
    height: 50,
    autoRotate: false,
    rotationSpeed: 0,
    rotationDirection: "clockwise",
    wall: initializeWallConfig("square"),
    speedPaths: [],
    portals: [],
    waterBodies: [],
    bowlProfile: "medium",
    bowlDepth: 0.4,
  },

  hexagon_fortress: {
    name: "Hexagon Fortress",
    shape: "hexagon",
    theme: "futuristic",
    width: 50,
    height: 50,
    autoRotate: true,
    rotationSpeed: 6, // 1 minute per rotation (360°/60sec = 6°/sec)
    rotationDirection: "clockwise",
    wall: initializeWallConfig("hexagon"),
    speedPaths: [],
    portals: [],
    waterBodies: [],
    bowlProfile: "shallow",
    bowlDepth: 0.3,
  },

  pentagon_chaos: {
    name: "Pentagon Chaos",
    shape: "pentagon",
    theme: "prehistoric",
    width: 50,
    height: 50,
    autoRotate: false,
    rotationSpeed: 0,
    rotationDirection: "counterclockwise",
    wall: generateRandomWalls("pentagon"),
    speedPaths: [],
    portals: [],
    waterBodies: [],
    bowlProfile: "deep",
    bowlDepth: 0.5,
  },

  star_fortress: {
    name: "Star Fortress",
    shape: "star5",
    theme: "futuristic",
    width: 50,
    height: 50,
    autoRotate: true,
    rotationSpeed: 12,
    rotationDirection: "clockwise",
    wall: initializeWallConfig("star5"),
    speedPaths: [],
    portals: [],
    waterBodies: [],
    bowlProfile: "steep",
    bowlDepth: 0.6,
  },
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_ARENA_CONFIG: ArenaConfig = {
  name: "New Arena",
  description: "",
  width: 50,
  height: 50,
  shape: "circle",
  theme: "metrocity",
  autoRotate: false,
  rotationSpeed: 6,
  rotationDirection: "clockwise",
  wall: initializeWallConfig("circle"),
  speedPaths: [],
  portals: [],
  waterBodies: [],
  pits: [],
  difficulty: "medium",
};

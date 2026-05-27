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
  | "tractor_beam"     // Continuous pull force toward turret
  // Phase ZP — Pokémon-inspired attacks
  | "surf"           // Wide water wave sweeps across arena in a line — lateral push + slow
  | "hydro_pump"     // Powerful directional water jet — single-target linear knockback + slow
  | "fire_spin"      // Spawns fire ring around target that traps + drains spin per tick
  | "thunderbolt"    // Instant line strike — stuns target (control lock)
  | "psychic"        // Pulsing push/pull telekinetic field — alternates attract/repel
  | "gust"           // Wide wind burst that pushes ALL beys in the arena directionally
  | "shadow_ball"    // Slow spectral projectile that splits into 3 on impact
  | "fire_blast"     // Wide five-petal fire burst — AoE + DOT burn damage
  | "sludge_bomb"    // Lobs poison cloud that lands and creates a slow+damage hazard
  | "toxic_spikes"   // Drops floor spike mines that poison beys crossing them
  | "roar"           // Sound blast — control-scrambles all beys in range briefly
  | "multi_missile"  // Fires N tracking missiles simultaneously at separate targets
  // Phase ZP-2 — extended move set
  | "blizzard"        // Wide ice-storm cone — freeze + slow + drops ice floor patches
  | "earthquake"      // Radial shockwave rings expanding from turret — damage + outward push
  | "flamethrower"    // Sustained narrow tracking fire beam — burn DoT persists after beam
  | "ice_beam"        // Precision hitscan ice shot — halts target velocity + spin drain
  | "dragon_breath"   // Short-range cone blast — damage + 30% stagger (control lock)
  | "confuse_ray"     // No damage — reverses target movement inputs for duration
  | "leech_seed"      // Latches onto target — drains health + spin per tick for full duration
  | "vine_whip"       // Lasso grab — pulls specific target toward turret for grip duration
  | "sticky_web"      // Drops floor web at target position — extreme slow for beys crossing it
  | "hyper_beam"      // Long charge → single devastating blast → long recharge downtime
  | "gravity_field"   // Pulls ALL beys toward arena center for a duration
  | "sand_tomb"       // Traps target in sand vortex — pushes back if it tries to leave
  | "zap_cannon"      // Slow homing ball — guaranteed paralysis on hit
  | "overheat"        // Triple-damage AoE blast — turret cooldown triples for next N shots
  | "chain_lightning" // Hits nearest bey then arcs to next (up to N beys), damage halves per arc
  | "spore"           // Pollen cloud — heavy spin drain + sleep control lock inside zone
  | "dark_void"       // Fires N independent homing shadow balls at separate targets
  | "rock_slide"      // Drops random boulder impacts around target — each AoE
  | "whirlpool"       // Temporary water spin zone around target — orbit force + DoT
  | "stealth_rock"    // Places invisible rock fragments — any bey entering zone takes damage
  // ── Fire type ────────────────────────────────────────────────────────────
  | "ember"           // Quick small projectile — low dmg + stacking burn DoT ticks
  | "magma_storm"     // Persistent lava ring at fixed radius, slowly rotating — crosses deal fire dmg
  | "eruption"        // ULTIMATE 🌋 — lava geysers erupt at ALL bey positions simultaneously
  // ── Water type ───────────────────────────────────────────────────────────
  | "bubble_beam"     // 3-bubble spread — each hit slows target briefly
  | "aqua_ring"       // Orbiting water ring around target — drains spin per tick for duration
  | "origin_pulse"    // ULTIMATE 💧 — twin waves sweep entire arena width, max push + damage
  // ── Ice type ─────────────────────────────────────────────────────────────
  | "icicle_spear"    // Rapid 5-shot volley at same target in quick succession
  | "hail"            // Random ice chunks fall in scatter zone — each small AoE
  | "glacial_lance"   // ULTIMATE ❄️ — crystalline lance pierces entire arena in a line, freezes all hit
  // ── Lightning type ───────────────────────────────────────────────────────
  | "thunder_wave"    // AoE static field — 50% speed reduction on all beys in range
  | "discharge"       // Omnidirectional burst — damages all nearby beys + spin drain
  | "bolt_strike"     // ULTIMATE ⚡ — simultaneous thunderbolts hit EVERY bey at once
  // ── Wind type ────────────────────────────────────────────────────────────
  | "air_slash"       // Crescent wind blade — moderate dmg + 30% flinch (brief control)
  | "hurricane"       // Traveling tornado projectile — on arrival creates spin zone for 2s
  | "aeroblast"       // ULTIMATE 💨 — focused pressurized column, highest knockback in game
  // ── Earth type ───────────────────────────────────────────────────────────
  | "stone_edge"      // Multi-shard volley from different angles — high crit rate per shard
  | "dig"             // Underground delay then surfaces under target — hard to dodge
  | "tectonic_rage"   // ULTIMATE 🌍 — N random fissure lines crack arena, launches beys caught inside
  // ── Metal type ───────────────────────────────────────────────────────────
  | "flash_cannon"    // Precision beam — bypasses damageTaken defense stat entirely
  | "bullet_punch"    // Ultra-fast 3-hit combo — fires at start of cooldown cycle
  | "steel_surge"     // ULTIMATE ⚙️ — carpet of metal spikes floods outward from turret
  // ── Nature type ──────────────────────────────────────────────────────────
  | "absorb"          // Reverse leech — drains HP + spin, "heals" turret health pool
  | "petal_dance"     // Chaotic flower petal storm — strong AoE, random scatter for duration
  | "bloom_doom"      // ULTIMATE 🌿 — absorbs ALL bey spin for 2s then releases mega burst
  // ── Shadow type ──────────────────────────────────────────────────────────
  | "night_shade"     // Always deals exact % of target's CURRENT HP, ignores defense
  | "shadow_force"    // Phase-through homing projectile — ignores obstacles + walls
  | "phantom_force"   // ULTIMATE 🌑 — all beys enter shadow realm, continuous dmg + confusion
  // ── Light type ───────────────────────────────────────────────────────────
  | "flash"           // Instant arena-wide flash — blinds all beys briefly, no damage
  | "solar_beam"      // 1s charge then devastating light beam — bypasses defense
  | "solar_flare"     // ULTIMATE ✨ — mega solar burst, blinds all + ignores all defense multipliers
  // ── Thunder type (storm variety) ─────────────────────────────────────────
  | "spark"           // Quick contact jolt — damage doubles vs slowed/wet targets
  | "magnetic_field"  // Turret magnet — all beys orbit the turret for duration
  | "thunder_storm"   // ULTIMATE ⛈️ — persistent storm, each bey struck every 1.5s for full duration
  // ── Void type ────────────────────────────────────────────────────────────
  | "distortion"      // Warps target to random arena position — no damage
  | "black_hole_shot" // Slow projectile → mini singularity on impact, pulls beys in for 3s
  | "spacial_rend"    // ULTIMATE 🌀 — teleports ALL beys + massive void damage to everyone
  // ── Fighting / Impact moves ──────────────────────────────────────────────
  | "cross_slash"     // X-shaped energy beam — bonus damage if target below 50% spin
  | "impact_burst"    // Shockwave projectile — strong knockback + reverses inputs for 1.5s
  | "armor_pierce"    // Defense-shattering shot — ignores invulnerability window + clears defense buffs
  | "flurry_barrage"  // Rapid 5-shot close-range burst — each shot escalates in power
  | "mach_shot"       // Priority ultra-fast bolt — fires immediately at start of cooldown cycle
  | "gravity_grip"    // Magnetic hold beam — locks bey position + drains spin for duration
  | "ram_charge"      // Heavy kinetic shot — moderate dmg + 30% chance to stun briefly
  | "graviton_throw"  // Gravity lance — flings bey toward nearest arena wall for ring-out threat
  // ── Close-range moves ────────────────────────────────────────────────────
  | "razor_spin"      // Spinning blade aura — damages all beys inside close radius continuously
  | "point_blank"     // Extreme damage only if bey is within very short range
  | "static_field"    // Electric proximity aura — auto-shocks any bey that steps inside
  | "acid_spray"      // Point-blank corrosive cone — reduces target defense temporarily
  | "shockwave"       // Ground-radial pulse from turret — pushes all nearby beys outward
  | "spin_slash"      // Turret sweeps blade arms in a full spin — multi-hit at close range
  | "guillotine"      // Execution shot — massive damage if target is below 25% spin
  // ── Aerial / Ground moves ─────────────────────────────────────────────────
  | "anti_grav"       // Anti-gravity beam lifts target bey for 1.5s (no physics), then slams down with AoE
  // ── Bug type ─────────────────────────────────────────────────────────────
  | "drain_sting"     // Parasitic energy sting — steals a portion of target's current health
  | "string_shot"     // Snare shot — -70% target speed + disables dodge for duration
  | "silver_wind"     // ULTIMATE 🦋 — wing-scale whirlwind negates all buffs + AoE damage
  // ── Dark type ────────────────────────────────────────────────────────────
  | "sting_bolt"      // High-crit energy jolt (30% crit chance doubles damage)
  | "foul_play"       // Mirrors target: deals damage proportional to target's own attack power
  | "dark_pulse"      // ULTIMATE 🌑 — pulsing dark wave staggers all beys + heavy spin drain
  // ── Steel type ───────────────────────────────────────────────────────────
  | "steel_ram"       // Heavy steel bolt — strong single-target knockback + brief stun
  | "metal_sound"     // Piercing screech — dramatically reduces target's defense (1.8× damage taken)
  | "magnet_bomb"     // ULTIMATE 🧲 — magnetic pull then explosive push, highest force in game
  // ── Normal type ──────────────────────────────────────────────────────────
  | "tackle"          // Basic kinetic bolt — fast, no frills, highest fire rate
  | "drill_shot"      // Piercing drill bolt — high crit + penetrates through first target to hit beys behind
  | "hyper_voice"     // ULTIMATE 🔊 — arena-wide sonic blast hits all beys equally regardless of position
  // ── Stat-change moves ────────────────────────────────────────────────────
  | "swords_dance"    // Turret buffs itself: next 3 shots deal 2× damage
  | "tail_whip"       // Debuff nearby beys: +30% damage taken for duration
  | "growl"           // Debuff nearby beys: spin drain rate +50% for duration
  | "meditate"        // Turret charges: next single shot deals 4× damage
  | "nasty_plot"      // Turret buff: next 5 shots bypass all defense multipliers
  | "agility"         // Turret buff: halves fire cooldown for next N shots
  // ── Poison type ──────────────────────────────────────────────────────────
  | "poison_jab"      // Close strike that applies stacking poison DoT per hit
  | "venoshock"       // Double damage if target is already under a DoT/status effect
  // ── Psychic extra ────────────────────────────────────────────────────────
  | "psyshock"        // Projectile that ignores target's defense multiplier entirely
  | "future_sight"    // Delayed strike — registers target now, deals damage after X seconds
  // ── Dragon type ──────────────────────────────────────────────────────────
  | "dragon_slash"    // Triple energy slash — moderate each, stagger chance on last hit
  | "outrage"         // Massive repeated blasts for 3s then turret briefly overheats
  // ── Ghost extra ──────────────────────────────────────────────────────────
  | "hex"             // Doubles damage if target has any active status condition
  | "ghost_strike"    // Phasing point-blank pulse — bypasses range check, always connects
  // ── Fairy type ───────────────────────────────────────────────────────────
  | "moonblast"       // Lunar energy ball — moderate damage + strong knockback
  | "dazzling_gleam"  // Blinding light burst — hits all beys in range + brief control lock
  // ── Weather / Environment change ─────────────────────────────────────────
  | "sunny_day"       // Sets sunny weather: fire ×1.5, water ×0.5, spin decay +20% for 8s
  | "rain_dance"      // Sets rain weather: water ×1.5, fire ×0.5, slip zones appear for 8s
  | "sandstorm"       // Sets sandstorm: all beys take trickle damage + reduced traction for 8s
  | "hail_weather"    // Sets hail weather: ice ×1.5, periodic random freeze hits for 8s
  | "misty_terrain"   // Fog field: status effects blocked, all beys have reduced traction
  | "grassy_terrain"  // Grass field: gradual spin recovery, nature moves ×1.3
  | "electric_terrain"// Electric ground: prevents control locks, lightning ×1.3 while active
  | "psychic_terrain" // Mystical field: next hit on any bey ignores their speed for dodge
  // ── Charge moves ─────────────────────────────────────────────────────────
  | "charge"          // Charges turret: boosts next shot damage + adds paralysis chance
  | "charge_beam"     // Fires continuous charging beam: 50% chance to boost attack on hit
  | "skull_bash"      // 2-turn charge then devastating headbutt + guaranteed knockdown
  | "solar_charge"    // Charges in sunny weather instantly; otherwise 1s charge before fire
  // ── Speed / Power moves ───────────────────────────────────────────────────
  | "extreme_speed"   // Priority: fires at start of cooldown, extremely fast projectile, never misses
  | "flare_blitz"     // Fire overdrive: massive damage + burn, turret takes 1/3 recoil
  | "thunder_ram"     // Electric drive: high damage + paralysis, turret recoil
  | "thunder_drive"   // Electric surge variant: slightly less damage, 25% recoil
  | "power_drive"     // Reliable overdrive: moderate damage, 25% recoil, no secondary effects
  // ── Launcher / Airborne moves ────────────────────────────────────────────
  | "uppercut"        // Close-range upward blast — launches bey airborne at close range instantly
  | "launch_spike"    // Ground spike erupt under target — wide AoE + aerial pop
  | "sky_uppercut"    // Powered version of uppercut: full airborne arc + spin zone at peak
  // ── Mortal Kombat inspired ───────────────────────────────────────────────
  | "spear_chain"     // [Scorpion] Chain harpoon grabs target — pulls it toward turret
  | "cryo_lance"      // [Sub-Zero] Freeze lance — freezes on first hit, shatters on second
  | "ring_blade"      // [Kung Lao] Razor ring — slices through all beys in a line
  | "portal_strike"   // [Raiden] Teleport bolt — instant position-swap then lightning burst
  | "dragon_fireball" // [Liu Kang] Rolling fireball — bounces around arena for 3s
  | "inferno_slam"    // [Scorpion/Hellfire] Ground fire eruption following a pull
  // ── Defensive self-buff moves ─────────────────────────────────────────────
  | "harden"          // Turret hardens: becomes invulnerable for 1.5s + next shot ignores bey defense
  | "defense_curl"    // Turret coils: invulnerable for 1s, next rollout shot deals 1.5× damage
  | "withdraw"        // Turret retreats: invulnerable for 2s, halves next attack's cooldown
  | "barrier"         // Turret deploys shield: reflects next hit that would reduce turret health back as damage to nearest bey
  | "cosmic_power"    // Turret ascends: reduces all beys' attack output + boosts turret range for 5s
  // ── Street Fighter inspired moves ────────────────────────────────────────
  | "hadoken"         // [Ryu] Energy orb — compact rotating sphere projectile, moderate damage
  | "shoryuken"       // [Ryu/Ken] Rising energy uppercut — launches target airborne + burn
  | "sonic_boom"      // [Guile] Compressed air blade — fast horizontal slice, high range
  | "flash_kick"      // [Guile] Upward energy crescent — close-range upward AoE pop
  | "raging_demon"    // [Akuma] Instant execution — 3× damage vs bey below 25% spin threshold
  | "spiral_drill"    // [Cammy] Corkscrew drill projectile — spins and bores through
  | "hundred_kicks"   // [Chun-Li] Rapid-burst multi-strike — 10-hit ultra-rapid barrage
  | "electric_body"   // [Blanka] Persistent electric aura — AoE electric field around turret
  // ── Bleach Bankai inspired moves ─────────────────────────────────────────
  | "tensa_zangetsu"  // [Ichigo] Compressed dark beam — single focused beam ignoring defense
  | "senbonzakura"    // [Byakuya] Thousand-petal scatter — wide AoE shredding storm
  | "daiguren_ice"    // [Toshiro] Ice dragon construct — expanding radial freeze zone
  | "absolute_zero"   // [Rukia] Absolute zero field — total freeze then instant shatter
  | "muken_poison"    // [Mayuri] Expanding poison field — grows over time, heavy DoT stacks
  | "zanka_incinerate"// [Yamamoto] Scorched earth — fire field + boosts all fire move damage
  | "suzumebachi"     // [Soifon] Mark-and-kill — two-hit shadow execution
  | "hihio_construct" // [Renji] Serpent line construct — sweeping line with trailing hitbox
  // ── Naruto inspired moves ─────────────────────────────────────────────────
  | "rasengan"        // [Naruto] Rotating chakra sphere — close-range spinning collision burst
  | "chidori"         // [Sasuke] Lightning blade thrust — piercing linear lightning shot
  | "shadow_clone"    // [Naruto] Multi-directional strike — target hit from 4 angles at once
  | "sand_burial"     // [Gaara] Crushing grip — slow + trap + burst damage
  | "fireball_jutsu"  // [Sasuke] Fire dragon wave — wide-spread fire breath cone
  | "eight_trigrams"  // [Neji] 64 palms — ultra-rapid 8-hit combo strike
  | "amaterasu"       // [Sasuke] Black flame field — persistent burn DoT, cannot be cancelled
  | "susanoo"         // [Sasuke] Armored titan form — turret gains defense + auto-counter
  // ── Ninja technique moves ─────────────────────────────────────────────────
  | "substitution"    // Classic replacement jutsu — turret becomes invulnerable + blinks
  | "shadow_shuriken" // Split projectile — fires two shurikens that diverge mid-flight
  | "kunai_barrage"   // Multi-shot fan spread — fires 5 kunai in a cone arc
  | "smoke_bomb"      // Status cloud — reduces bey's spin-gain rate for duration
  | "wire_trap"       // Tether snare — bey caught and pulled back toward turret
  | "exploding_tag"   // Proximity mine — dropped explosive triggered by bey proximity
  // ── Transformation moves ──────────────────────────────────────────────────
  | "ultra_form"      // Turret enters ultra mode — all stats boosted for duration
  | "demon_form"      // Akuma demon mode — all attacks gain guaranteed critical
  | "sage_mode"       // Naruto sage empowerment — enhanced power + range + regen
  | "bankai_release"  // Generic bankai — double damage + AoE pulse for duration
  | "susanoo_full"    // Full susanoo body — massive AoE shield + auto-counter pulses
  | "titan_shift"     // Attack titan shift — AoE damage pulses while active
  // ── One Piece moves ──────────────────────────────────────────────────────
  | "gear_second"     // [Luffy] Gear 2nd — speed boost + rapid multi-punch for 6s
  | "gear_fourth"     // [Luffy] Gear 4th — massive force AoE burst + immunity window
  | "conquerors_haki" // [Shanks/Luffy] Conqueror's Haki — control-locks all nearby beys
  | "three_sword_style"// [Zoro] Three Sword Style — triple fan-slash cone
  | "diable_jambe"    // [Sanji] Diable Jambe — spinning kick + fire DoT
  // ── Demon Slayer moves ────────────────────────────────────────────────────
  | "water_breathing" // [Tanjiro] Water Breathing — flowing multi-hit wave
  | "hinokami_kagura" // [Tanjiro] Hinokami Kagura — spinning fire AoE
  | "thunder_breathing"// [Zenitsu] Thunder Breathing — instant lightning burst
  | "beast_breathing" // [Inosuke] Beast Breathing — wild multi-hit scatter
  | "flame_breathing" // [Rengoku] Flame Breathing — forward cone fire burst
  // ── Attack on Titan extra moves ───────────────────────────────────────────
  | "thunder_spear"   // [Survey Corps] Thunder Spear — explosive homing bolts
  | "omni_directional"// [Levi] ODM Gear — high-speed dash slash, multi-target
  | "hardening"       // [Armored Titan] Crystal hardening — invulnerability + knockback
  | "founding_titan"  // [Eren] Founding Titan scream — AoE control-lock + drain
  // ── Summon moves ─────────────────────────────────────────────────────────
  | "summon_toad"     // [Naruto] Toad boss summon — massive AoE slam at target zone
  | "summon_snake"    // [Orochimaru] Snake summon — constrict + poison + drag
  | "summon_slug"     // [Tsunade] Healing slug — repairs turret health over 5s
  | "summon_kirin"    // [Sasuke] Thunder beast — instant unavoidable lightning strike
  | "summon_eagle"    // Aerial eagle summon — dive bomb AoE on nearest bey
  | "summon_clones"   // Shadow clone army — AoE multi-strike from all directions
  // ── Tekken inspired moves ─────────────────────────────────────────────────
  | "devil_beam"      // [Jin/Kazuya] Devil beam — focused eye laser, high damage
  | "wind_god_fist"   // [Kazuya/Jin] Electric rising fist — launcher + electric
  | "hellsweep"       // [Kazuya] Low energy sweep — knockdown + slide
  | "laser_scraper"   // [Yoshimitsu] Sweeping energy beam — rotational arc damage
  | "rage_drive"      // Rage mechanic — single heavy powered blow, drains rage gauge
  | "heat_smash"      // Heat system smash — fire-charged impact, ignites on contact
  | "ki_charge_tek"   // Ki energy charge — buffs turret before next shot fires
  | "twin_pistols"    // [Nina/Anna] Rapid dual projectile burst — two converging shots
  // ── Time-based moves ─────────────────────────────────────────────────────
  | "time_warp"       // Rewinds target bey position to 2s ago (teleport back)
  | "time_stop"       // Freezes all beys in place for 1.5s
  | "time_loop"       // Repeats last tick's damage to target again after 2s delay
  | "time_acceleration" // Target spin decays 3× faster for 5s
  | "age_drain"       // Drains target spin proportional to elapsed time in match
  // ── Bleach extended Bankais ───────────────────────────────────────────────
  | "gigantification" // [Yumichika/Chad] Massive AoE scale — giant slam on target zone
  | "ryujin_jakka_full" // [Yamamoto] Envelop all beys in divine flame field
  | "minazuki_heal"   // [Unohana] Healing zone — restores turret + reduces bey health regen
  | "katen_kyokotsu"  // [Kyoraku] Summons game-within-a-game: random bey takes damage
  | "senbonzakura_kageyoshi" // [Byakuya Full] Absolute petal storm — multi-wave AoE
  | "daiguren_full"   // [Toshiro Full] Ice dragon body — massive freeze + shatter AoE
  // ── Arrancars / Espada moves ─────────────────────────────────────────────
  | "cero"            // [Arrancar] Concentrated energy beam — fast, heavy damage
  | "gran_rey_cero"   // [Espada] Royal energy blast — wider cero with AoE
  | "cero_oscuras"    // [Ulquiorra] Black energy beam — ignores all damage reductions
  | "bala"            // [Arrancar] Rapid-fire energy pellets — 5-hit quick burst
  | "hierro"          // [Arrancar] Iron skin — turret gains defense buff
  | "sonido"          // [Arrancar] Flash-step speed — turret fires then teleports
  | "pesquisa"        // [Arrancar] Sense enemy — reveals and locks turret on lowest-hp bey
  | "descorrer"       // [Ulquiorra] Dimension tear — portal pulls beys toward center
  | "lanza_del_relampago" // [Ulquiorra] Lightning spear — massive explosion on contact
  | "santa_teresa"    // [Harribel] Massive water wave — wide knockback + slow
  | "resurrección"    // [Espada] Release form — turret enters 8s powered state
  // ── Gotei-13 Captain moves ───────────────────────────────────────────────
  | "shunpo"          // [Yoruichi] Flash-step — turret becomes instant hit + teleport
  | "reiatsu_burst"   // [Generic Captain] Spiritual pressure — AoE suppression field
  | "kido_hado_31"    // [Kido] Shakkahō — fire sphere at target
  | "kido_hado_63"    // [Kido] Raikōhō — thunder wave blast
  | "kido_hado_90"    // [Kido] Kurohitsugi — black coffin gravity box
  | "kido_bakudo_61"  // [Kido] Rikujōkōrō — six rods prison — immobilize
  | "kido_bakudo_99"  // [Kido] Kin — complete bey lockdown
  | "roar_of_seireitei" // [Yamamoto] Divine fire — scorched earth mega-burst
  // ── Visored / Hollowification moves ──────────────────────────────────────
  | "mask_on"         // Hollow mask — turret enters powered hollow state
  | "hollow_cero"     // Visored energy blast — combines shinigami + hollow damage
  | "inner_hollow"    // Summons inner hollow — random extra attack fires at nearby bey
  | "getsuga_tensho"  // [Ichigo] Crescent energy slash wave
  | "mugetsu"         // [Ichigo Final] Black absolute energy strip — massive single-target
  | "fullbring_boost" // [Fullbring] Object empowerment — turret absorbs next bey hit for power
  // ── Itachi / Genjutsu / Dojutsu moves ────────────────────────────────────
  | "tsukuyomi"       // [Itachi] Genjutsu control — target's controls invert for 3s
  | "amaterasu_mark"  // [Itachi] Black flame tag — hit bey burns when next struck
  | "izanagi"         // [Itachi] Reality rewrite — turret ignores next killing blow
  | "izanami"         // [Itachi] Loop trap — target repeats same movement for 2s
  | "sharingan_lock"  // [Sharingan] Eye lock — target's inputs are mirrored
  | "crow_genjutsu"   // [Itachi crow] Mass confusion — all beys move erratically for 2s
  | "susanoo_itachi"  // [Itachi Susanoo] Totsuka seal — seals target bey (immobilize + drain)
  // ── More Naruto summons ───────────────────────────────────────────────────
  | "summon_ryuchi"   // Ryuchi Cave snake — constrict + venom field
  | "summon_myoboku"  // Mount Myoboku toad — sage boost + oil attack
  | "summon_slugs_army" // Slug army — swarming DoT field
  | "summon_garuda"   // Giant bird — aerial wind AoE
  | "summon_enma"     // [Third Hokage] Staff summon — extends to hit far targets
  | "summon_gamaken"  // Gamaken spear — wide spinning slam
  | "edo_tensei"      // [Kabuto] Reanimation — dead bey gets one extra HP bar tick
  // ── Size & Weight Scaling moves ───────────────────────────────────────────
  | "enlarge"         // Grow bey: +50% hitbox, heavier, more collision dmg, -30% speed
  | "shrink"          // Shrink bey: -50% hitbox, harder to hit, +30% speed, less dmg
  | "mass_shift"      // Weight surge: knockback resistance + collision damage boost
  | "density_crush"   // Ultra-dense burst: contact AoE devastates nearest bey
  // ── Full Transformation (form-change) moves ───────────────────────────────
  | "hollow_transform"    // [Ichigo→Hichigo] Full hollow: invert personality, cero spam, berserk
  | "kyuubi_mode"         // [Naruto] 9-tails chakra cloak: speed + power + burning AoE field
  | "bijuu_mode"          // [Naruto] Full bijuu: giant form, movement AoE damages nearby beys
  | "tailed_beast_bomb"   // Bijuudama — charged black+white sphere, mega-explosion
  | "curse_mark_2"        // [Sasuke] Curse mark level 2 — winged form, guaranteed crits
  | "six_paths_mode"      // [Naruto/Hagoromo] All elemental types boosted + rinnegan
  | "ten_tails_jinchuriki"// [Madara/Obito] God form — AoE suppression field + drain all beys
  | "berserk_hollow"      // Full inner hollow takeover — uncontrolled extreme random damage
  // ── Deidara moves (clay art) ──────────────────────────────────────────────
  | "clay_spider"     // C1 spider mine — small clay seeker runs to nearest bey
  | "clay_dragon"     // C2 dragon bomb — homing large clay explosive
  | "clay_bomb"       // C3 — placed massive explosive, triggered by proximity
  | "clay_clones_c4"  // C4 — microscopic bombs inhaled by target, DoT from inside
  | "katsu"           // C0 ultimate art — detonates all active clay simultaneously
  // ── Akatsuki member moves ─────────────────────────────────────────────────
  | "shinra_tensei"   // [Pain/Nagato] Gravity repulsion — pushes ALL beys outward from center
  | "chibaku_tensei"  // [Pain/Nagato] Planetary pull — drags all beys to a point then crushes
  | "samehada_drain"  // [Kisame] Sword drain — spin-steal per tick from nearest bey
  | "shark_bomb"      // [Kisame] Water shark — homing shark projectile
  | "earth_grudge_fear" // [Kakuzu] Thread tendrils — grabs and holds target bey
  | "jashin_ritual"   // [Hidan] Curse link — turret damage zone mirrors back to target
  | "paper_bomb_storm"// [Konan] 600 billion paper bombs — massive AoE saturation
  | "kamui"           // [Obito] Dimensional absorption — target bey removed for 3s
  | "limbo_hengoku"   // [Madara] Shadow realm hits — unblockable phantom strikes
  | "wood_dragon"     // [Hashirama/Madara] Wood dragon — suppresses spin + traps bey
  // ── Obito Uchiha moves ───────────────────────────────────────────────────
  | "spiral_eye"          // [Obito] Sharingan vortex — sucks beys inward then flings outward
  | "phantom_pass"        // [Obito/Tobi] Intangibility — target immune for 2s, then AoE burst
  | "black_zetsu_bind"    // [Black Zetsu] Body bind — immobilize + health & spin drain
  | "orange_mask_dash"    // [Tobi] Teleport dodge — instantly relocates target bey randomly
  | "ten_tails_bijuudama" // [Obito] Ten-tails beast bomb — colossal explosion, max damage
  | "truth_seeker_orbs"   // [Obito/Madara] Truth-seeking orbs — 6 orbiting damage spheres
  // ── Rinnegan / Pain path techniques ─────────────────────────────────────
  | "bansho_tenin"        // [Pain/Nagato] Gravity attraction — pulls ALL beys inward
  | "human_path"          // [Pain] Soul rip — instantly halves target health
  | "preta_path"          // [Pain] Absorption — absorbs next incoming hit, returns as heal
  | "asura_path"          // [Pain] Mechanized missiles — rapid 3-shot missile volley
  // ── Minato Namikaze / Advanced Naruto ────────────────────────────────────
  | "flying_thunder_god"  // [Minato] FTG teleport — blink to nearest bey + instant strike
  | "rasenshuriken"       // [Naruto/Minato] Wind rasen-star — spinning shuriken devastates spin
  | "odama_rasengan"      // [Jiraiya/Naruto] Giant rasengan — large radius heavy spin collision
  // ── Taijutsu / Eight Gates ───────────────────────────────────────────────
  | "eight_gates_release" // [Rock Lee/Guy] Gates power surge — extreme speed + damage, health cost
  | "evening_elephant"    // [Guy] Atmospheric pressure fist — heavy DoT pillar strike
  | "night_guy"           // [Guy Gate 8] Dragon spiral — ultimate finisher, maximum damage
  // ── Legendary Naruto / Otsutsuki ─────────────────────────────────────────
  | "tengai_shinsei"      // [Madara] Meteorite drop — massive falling-rock AoE crush
  | "kaguya_bones"        // [Kaguya] All-Killing Ash Bones — multi-spike piercing volley
  // ── Bleach: Aizen / Barragan / Grimmjow ──────────────────────────────────
  | "kyoka_suigetsu"      // [Aizen] Complete hypnosis — all beys attack nearest ally for 3s
  | "respira"             // [Barragan] Aging aura — extreme spin & health decay field
  | "desgarron"           // [Grimmjow] 5-claw shockwave fan — parallel arcing slashes
  // ── Dragon Ball moves ────────────────────────────────────────────────────
  | "kamehameha"          // [Goku] Energy wave beam — fast focused line, high damage
  | "spirit_bomb"         // [Goku] Gathered energy — long charge then massive AoE explosion
  | "final_flash"         // [Vegeta] Maximum-power beam — obliterates single target
  | "death_beam"          // [Frieza] Precision death ray — instant piercing damage
  // Gohan chain
  | "gohan_masenko"       // [Gohan] Masenko — focused downward energy beam
  | "gohan_power_up"      // [Gohan] Hidden power unlock — +50% turret damage for 8s
  | "gohan_mystic_unleash"// [Gohan] Ultimate Gohan — wide AoE energy burst
  // Vegeta chain
  | "galick_gun"          // [Vegeta] Galick Gun — wide-cone beam
  | "big_bang_attack"     // [Vegeta] Big Bang Attack — point-blank sphere, high knockback
  | "final_explosion"     // [Vegeta] Final Explosion — sacrifice AoE nuke, turret dormant 10s
  // Cell chain
  | "solar_kamehameha"    // [Cell] Solar Kamehameha — double-width superbeam
  | "cell_jr_spawn"       // [Cell] Cell Jr. spawn — 3 seeker units, ticking damage
  | "perfect_form_cell"   // [Cell] Perfect Form — range+50%, damage+30% for 8s
  // Buu chain
  | "chocolate_beam"      // [Buu] Chocolate Beam — drains target spin to 0 for 2s
  | "buu_absorption"      // [Buu] Absorption — copies target's top stat as temporary buff
  | "kid_buu_scream"      // [Kid Buu] Primal Scream — omnidirectional AoE shockwave
  // Frieza chain
  | "death_ball"          // [Frieza] Death Ball — massive sphere, huge AoE explosion
  | "nova_strike"         // [Frieza] Nova Strike — high-speed ramming dash
  | "golden_frieza"       // [Frieza] Golden Form — all damage ×2.5 for 8s
  // ── Illusion / Deception moves ────────────────────────────────────────────
  | "mirror_world"        // All beys see ghost duplicates at mirrored positions for 3.5s
  | "perfect_mirage"      // Target bey turns invisible — physics continues unseen for 2.5s
  | "broken_reality"      // Mass scatter — all beys teleport to random arena positions
  | "phantasmal_shift"    // Target half-materializes: 50% damage reduction + ghost visual
  | "echo_image"          // Spawn two false bey decoys at offset positions (absorb 1 hit each)
  | "genjutsu_veil"       // Arena-wide: all bey schema positions drift randomly each tick for 4s
  | "false_flag"          // Swaps the rendered identities of two random beys (color/label swap)
  | "mind_fracture"       // Target: inverted positions AND inverted inputs simultaneously for 3s
  // ── Contra-inspired power-ups (bey IS the weapon) ────────────────────────
  | "spread_bey"          // Target bey splits into 5 impact vectors on next collision — fans in all directions
  | "railbey"             // Target bey moves at 4× speed in a straight line, piercing all beys it crosses
  | "minigun_bey"         // Target bey's collision fires 12 rapid micro-damage pulses at 60 ms intervals
  | "heat_seeker_bey"     // Target bey auto-locks and rams the nearest opponent at high speed
  | "bomb_bey"            // Target bey becomes a ticking bomb — explodes on collision or after 4s fuse
  | "shield_bey"          // Target bey gains full-body energy shield: blocks next hit + AoE retaliation burst
  | "turbo_bey"           // Target bey's spin and speed surge to max for 5s — extreme damage on contact
  | "cannon_bey"          // Turret catapults the bey at max force toward the furthest opponent
  // ── Contra movement power-ups (bey movement state changes) ───────────────
  | "speed_surge"         // Bey gets 3× speed for 2s — erratic high-speed movement
  | "gravity_flip"        // Bey is repelled FROM arena center instead of attracted (inverted pull)
  | "magnet_bey"          // Bey locks onto and chases the nearest opponent at force
  | "bounce_storm"        // Bey bounces off arena walls with 3× recoil for 3s
  | "freeze_step"         // Bey is completely frozen in place for 1.5s
  | "ghost_walk"          // Bey passes through all opponents — collision disabled for 2s
  | "boomerang_path"      // Bey enters circular orbit movement around arena center
  | "teleport_dash"       // Bey rapidly blinks to 3 random positions at 0.4s intervals

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

  // Phase ZP — Pokémon attack config fields
  /** surf: wave width in px (default 120) */
  surfWaveWidthPx?: number;
  /** surf: wave travel speed px/s (default 400) */
  surfWaveSpeedPx?: number;
  /** surf: slow multiplier applied to hit beys (default 0.6) */
  surfSlowMult?: number;
  /** hydro_pump: knockback impulse (default 0.08) */
  hydroPumpKnockback?: number;
  /** hydro_pump: slow duration in seconds (default 2) */
  hydroPumpSlowDurationSec?: number;
  /** fire_spin: ring radius in px (default 60) */
  fireSpinRadiusPx?: number;
  /** fire_spin: trap duration in seconds (default 3) */
  fireSpinDurationSec?: number;
  /** fire_spin: spin drain per second while trapped */
  fireSpinSpinDrainPerSec?: number;
  /** thunderbolt: stun duration in seconds (default 1.5) */
  thunderboltStunSec?: number;
  /** psychic: push/pull cycle interval in seconds (default 2) */
  psychicCycleIntervalSec?: number;
  /** psychic: max force applied (default 0.006) */
  psychicForce?: number;
  /** gust: wind angle in degrees (0 = rightward) */
  gustAngleDeg?: number;
  /** gust: force applied to each bey (default 0.01) */
  gustForce?: number;
  /** shadow_ball: travel speed px/s (default 180) */
  shadowBallSpeedPx?: number;
  /** shadow_ball: number of fragments on split (default 3) */
  shadowBallFragments?: number;
  /** fire_blast: number of petals in burst (default 5) */
  fireBlastPetals?: number;
  /** fire_blast: burn DOT damage per second (default 8) */
  fireBlastBurnPerSec?: number;
  /** fire_blast: burn duration in seconds (default 3) */
  fireBlastBurnDurationSec?: number;
  /** sludge_bomb: poison zone radius px (default 70) */
  sludgeBombRadiusPx?: number;
  /** sludge_bomb: zone lifetime seconds (default 6) */
  sludgeBombLifetimeSec?: number;
  /** sludge_bomb: slow multiplier inside zone (default 0.5) */
  sludgeBombSlowMult?: number;
  /** toxic_spikes: number of spikes dropped per shot (default 4) */
  toxicSpikeCount?: number;
  /** toxic_spikes: spike trigger radius px (default 30) */
  toxicSpikeTriggerPx?: number;
  /** toxic_spikes: poison DOT damage per second (default 6) */
  toxicSpikePoisonPerSec?: number;
  /** roar: scramble duration seconds (default 2) */
  roarScrambleSec?: number;
  /** multi_missile: number of missiles per volley (default 3) */
  multiMissileCount?: number;
  /** multi_missile: spread delay between missile launches in seconds (default 0.15) */
  multiMissileSpreadDelaySec?: number;

  // Phase ZP-2 — extended move config fields
  /** blizzard: cone half-angle in degrees (default 50) */
  blizzardConeHalfDeg?: number;
  /** blizzard: freeze/slow duration on hit in seconds (default 2) */
  blizzardFreezeDurationSec?: number;
  /** blizzard: create ice floor patches on hit (default true) */
  blizzardIcePatches?: boolean;
  /** blizzard: ice patch lifetime in seconds (default 4) */
  blizzardIcePatchDurationSec?: number;
  /** earthquake: number of shockwave rings (default 3) */
  earthquakeWaves?: number;
  /** earthquake: delay between rings in seconds (default 0.3) */
  earthquakeWaveIntervalSec?: number;
  /** flamethrower: beam width in px (default 15) */
  flamethrowerBeamWidthPx?: number;
  /** flamethrower: burn DoT duration in seconds (default 3) */
  flamethrowerBurnDurationSec?: number;
  /** flamethrower: burn damage per second (default 8) */
  flamethrowerBurnPerSec?: number;
  /** ice_beam: freeze duration in seconds (default 2) */
  iceBeamFreezeDurationSec?: number;
  /** ice_beam: spin drain per second while frozen (default 60) */
  iceBeamSpinDrainPerSec?: number;
  /** dragon_breath: cone half-angle in degrees (default 25) */
  dragonBreathConeHalfDeg?: number;
  /** dragon_breath: stagger chance 0–1 (default 0.35) */
  dragonBreathStaggerChance?: number;
  /** dragon_breath: stagger control lock duration in seconds (default 1) */
  dragonBreathStaggerSec?: number;
  /** confuse_ray: confusion (input reversal) duration in seconds (default 3) */
  confuseRayDurationSec?: number;
  /** leech_seed: drain duration in seconds (default 6) */
  leechSeedDurationSec?: number;
  /** leech_seed: health drain per second (default 5) */
  leechSeedHealthPerSec?: number;
  /** leech_seed: spin drain per second (default 20) */
  leechSeedSpinPerSec?: number;
  /** vine_whip: grip duration in seconds (default 2) */
  vineWhipGripDurationSec?: number;
  /** vine_whip: pull force (N) (default 0.015) */
  vineWhipPullForce?: number;
  /** sticky_web: web radius in px (default 60) */
  stickyWebRadiusPx?: number;
  /** sticky_web: web duration in seconds (default 8) */
  stickyWebDurationSec?: number;
  /** sticky_web: speed multiplier inside web (default 0.1) */
  stickyWebSlowMult?: number;
  /** hyper_beam: charge time before firing in seconds (default 4) */
  hyperBeamChargeSec?: number;
  /** hyper_beam: recharge downtime after firing in seconds (default 5) */
  hyperBeamRechargeSec?: number;
  /** gravity_field: pull-to-center force (N) (default 0.008) */
  gravityFieldForce?: number;
  /** gravity_field: field active duration in seconds (default 4) */
  gravityFieldDurationSec?: number;
  /** sand_tomb: trap radius in px (default 70) */
  sandTombRadiusPx?: number;
  /** sand_tomb: trap duration in seconds (default 3) */
  sandTombDurationSec?: number;
  /** sand_tomb: containment pushback force (default 0.007) */
  sandTombPushbackForce?: number;
  /** zap_cannon: projectile speed px/s (default 100) */
  zapCannonSpeedPx?: number;
  /** zap_cannon: paralysis duration in seconds (default 3) */
  zapCannonParalysisSec?: number;
  /** overheat: damage multiplier for the blast (default 3.0) */
  overheatDamageMult?: number;
  /** overheat: cooldown multiplier applied after firing (default 3.0) */
  overheatCooldownMult?: number;
  /** overheat: number of shots under penalty cooldown (default 2) */
  overheatPenaltyShots?: number;
  /** chain_lightning: number of chain arcs (default 3) */
  chainLightningJumps?: number;
  /** chain_lightning: damage decay per jump fraction 0–1 (default 0.5) */
  chainLightningDecay?: number;
  /** chain_lightning: stun per hit in seconds (default 0.8) */
  chainLightningStunSec?: number;
  /** spore: spore cloud radius in px (default 60) */
  sporeRadiusPx?: number;
  /** spore: cloud duration in seconds (default 4) */
  sporeDurationSec?: number;
  /** spore: spin drain multiplier while inside (default 2.0) */
  sporeSpinDrainMult?: number;
  /** spore: sleep (control lock) duration on entry in seconds (default 2) */
  sporeSleepDurationSec?: number;
  /** dark_void: number of independent shadow balls (default 3) */
  darkVoidCount?: number;
  /** dark_void: each ball's travel speed px/s (default 150) */
  darkVoidSpeedPx?: number;
  /** rock_slide: number of boulder impacts (default 5) */
  rockSlideBoulderCount?: number;
  /** rock_slide: scatter radius around target in px (default 120) */
  rockSlideScatterPx?: number;
  /** rock_slide: AoE radius per boulder in px (default 30) */
  rockSlideBoulderAoePx?: number;
  /** whirlpool: vortex radius in px (default 80) */
  whirlpoolRadiusPx?: number;
  /** whirlpool: orbit force (default 0.006) */
  whirlpoolOrbitForce?: number;
  /** whirlpool: duration in seconds (default 4) */
  whirlpoolDurationSec?: number;
  /** stealth_rock: number of invisible rock fragments placed (default 6) */
  stealthRockCount?: number;
  /** stealth_rock: damage field radius per rock in px (default 40) */
  stealthRockRadiusPx?: number;
  /** stealth_rock: damage per second inside each rock zone (default 4) */
  stealthRockDmgPerSec?: number;
  /** stealth_rock: lifetime of all rocks in seconds (default 10) */
  stealthRockDurationSec?: number;

  // ── Type-move config fields (Fire) ─────────────────────────────────────────
  /** ember: damage per burn tick after projectile lands (default 5) */
  emberBurnTickDmg?: number;
  /** ember: number of burn ticks (default 3) */
  emberBurnTicks?: number;
  /** ember: interval between burn ticks in seconds (default 0.5) */
  emberBurnIntervalSec?: number;
  /** magma_storm: ring radius from turret in px (default 100) */
  magmaStormRingRadiusPx?: number;
  /** magma_storm: ring thickness in px (default 24) */
  magmaStormRingWidthPx?: number;
  /** magma_storm: ring rotation speed deg/s (default 30) */
  magmaStormRotationSpeedDeg?: number;
  /** eruption: geyser AoE radius per bey position in px (default 80) */
  eruptionGeyserAoePx?: number;
  /** eruption: extra damage per additional bey hit (stacks, default 10) */
  eruptionExtraDmgPerBey?: number;

  // ── Type-move config fields (Water) ────────────────────────────────────────
  /** bubble_beam: number of bubbles per shot (default 3) */
  bubbleBeamCount?: number;
  /** bubble_beam: slow multiplier applied on bubble hit (default 0.65) */
  bubbleBeamSlowMult?: number;
  /** bubble_beam: slow duration in seconds (default 1.5) */
  bubbleBeamSlowDurationSec?: number;
  /** aqua_ring: ring orbit duration in seconds (default 4) */
  aquaRingDurationSec?: number;
  /** aqua_ring: spin drain per second while ring is active (default 25) */
  aquaRingSpinDrainPerSec?: number;
  /** origin_pulse: number of wave passes (default 2) */
  originPulseWaveCount?: number;
  /** origin_pulse: outward push force per wave (default 0.06) */
  originPulsePushForce?: number;

  // ── Type-move config fields (Ice) ──────────────────────────────────────────
  /** icicle_spear: number of spears in volley (default 5) */
  icicleSpearCount?: number;
  /** icicle_spear: delay between each spear in ms (default 80) */
  icicleSpearIntervalMs?: number;
  /** hail: number of ice chunks (default 6) */
  hailChunkCount?: number;
  /** hail: scatter radius in px (default 100) */
  hailScatterRadiusPx?: number;
  /** hail: AoE radius per chunk in px (default 25) */
  hailChunkAoePx?: number;
  /** hail: storm duration in seconds (default 3) */
  hailDurationSec?: number;
  /** glacial_lance: lance width in px (default 60) */
  glacialLanceWidthPx?: number;
  /** glacial_lance: freeze duration on hit in seconds (default 4) */
  glacialLanceFreezeSec?: number;

  // ── Type-move config fields (Lightning) ────────────────────────────────────
  /** thunder_wave: speed multiplier (default 0.5 = half speed) */
  thunderWaveSpeedMult?: number;
  /** thunder_wave: slow duration in seconds (default 3) */
  thunderWaveDurationSec?: number;
  /** discharge: spin drain per second inside burst (default 30) */
  dischargeSpinDrainPerSec?: number;
  /** discharge: burst radius in px (default 150) */
  dischargeRadiusPx?: number;
  /** bolt_strike: number of simultaneous bolts (default 1 per bey) */
  boltStrikeBolts?: number;
  /** bolt_strike: paralysis duration per bolt in seconds (default 2) */
  boltStrikeParalysisSec?: number;

  // ── Type-move config fields (Wind) ─────────────────────────────────────────
  /** air_slash: flinch chance 0–1 (default 0.3) */
  airSlashFlinchChance?: number;
  /** air_slash: flinch control-lock duration in seconds (default 0.5) */
  airSlashFlinchSec?: number;
  /** hurricane: travel speed in px/s (default 200) */
  hurricaneSpeedPx?: number;
  /** hurricane: on-arrival spin zone radius in px (default 70) */
  hurricaneSpinZoneRadiusPx?: number;
  /** hurricane: on-arrival spin zone duration in seconds (default 2) */
  hurricaneSpinZoneSec?: number;
  /** aeroblast: beam width in px (default 50) */
  aeroblastBeamWidthPx?: number;
  /** aeroblast: ring-out threat push force (default 0.08) */
  aeroblastPushForce?: number;

  // ── Type-move config fields (Earth) ────────────────────────────────────────
  /** stone_edge: shard count (default 3) */
  stoneEdgeShards?: number;
  /** stone_edge: crit chance per shard 0–1 (default 0.5) */
  stoneEdgeCritChance?: number;
  /** stone_edge: crit damage multiplier (default 1.5) */
  stoneEdgeCritMult?: number;
  /** dig: delay before surfacing in ms (default 800) */
  digDelayMs?: number;
  /** dig: surface AoE radius in px (default 50) */
  digAoePx?: number;
  /** tectonic_rage: number of fissure lines (default 4) */
  tectonicRageFissures?: number;
  /** tectonic_rage: fissure width in px (default 40) */
  tectonicRageFissureWidthPx?: number;

  // ── Type-move config fields (Metal) ────────────────────────────────────────
  /** flash_cannon: beam duration in seconds (default 0.3) */
  flashCannonBeamDurationSec?: number;
  /** bullet_punch: hits per combo (default 3) */
  bulletPunchHits?: number;
  /** bullet_punch: interval between hits in ms (default 80) */
  bulletPunchIntervalMs?: number;
  /** steel_surge: surge expand speed in px/s (default 250) */
  steelSurgeExpandSpeedPx?: number;
  /** steel_surge: spike damage per tick inside surge (default 20) */
  steelSurgeDmgPerTick?: number;
  /** steel_surge: total surge duration in seconds (default 3) */
  steelSurgeDurationSec?: number;

  // ── Type-move config fields (Nature) ───────────────────────────────────────
  /** absorb: drain duration in seconds (default 4) */
  absorbDurationSec?: number;
  /** absorb: HP drain per second (default 8) */
  absorbHpPerSec?: number;
  /** absorb: spin drain per second (default 15) */
  absorbSpinPerSec?: number;
  /** petal_dance: number of petal particles (default 20) */
  petalDancePetals?: number;
  /** petal_dance: storm duration in seconds (default 3) */
  petalDanceDurationSec?: number;
  /** petal_dance: scatter radius in px (default 120) */
  petalDanceScatterPx?: number;
  /** bloom_doom: absorb phase duration in seconds (default 2) */
  bloomDoomAbsorbSec?: number;
  /** bloom_doom: burst force multiplier per absorbed spin unit (default 0.00002) */
  bloomDoomBurstForceMult?: number;

  // ── Type-move config fields (Shadow) ───────────────────────────────────────
  /** night_shade: fraction of current HP dealt (default 0.25 = 25%) */
  nightShadeHpFraction?: number;
  /** shadow_force: projectile speed in px/s (default 250) */
  shadowForceSpeedPx?: number;
  /** phantom_force: realm duration in seconds (default 3) */
  phantomForceDurationSec?: number;
  /** phantom_force: damage per second while in realm (default 15) */
  phantomForceDmgPerSec?: number;

  // ── Type-move config fields (Light) ────────────────────────────────────────
  /** flash: blind (control lock) duration in seconds (default 1.5) */
  flashBlindSec?: number;
  /** solar_beam: charge duration in seconds (default 1.0) */
  solarBeamChargeSec?: number;
  /** solar_beam: damage multiplier (default 2.5) */
  solarBeamDamageMult?: number;
  /** solar_flare: blind duration on all beys in seconds (default 3) */
  solarFlareBlindSec?: number;
  /** solar_flare: arena-wide flat damage (default 40) */
  solarFlareDamage?: number;

  // ── Type-move config fields (Thunder/Storm) ────────────────────────────────
  /** spark: damage multiplier vs slowed/wet targets (default 2.0) */
  sparkWetDamageMult?: number;
  /** magnetic_field: orbit force toward turret (default 0.012) */
  magneticFieldOrbitForce?: number;
  /** magnetic_field: field duration in seconds (default 4) */
  magneticFieldDurationSec?: number;
  /** thunder_storm: storm total duration in seconds (default 8) */
  thunderStormDurationSec?: number;
  /** thunder_storm: lightning strike interval in seconds (default 1.5) */
  thunderStormStrikeIntervalSec?: number;
  /** thunder_storm: damage per strike (default 15) */
  thunderStormStrikeDmg?: number;

  // ── Type-move config fields (Void) ─────────────────────────────────────────
  /** distortion: max teleport distance from arena center in cm (default 20) */
  distortionTeleportRadiusCm?: number;
  /** black_hole_shot: projectile speed in px/s (default 80) */
  blackHoleShotSpeedPx?: number;
  /** black_hole_shot: singularity radius in px (default 80) */
  blackHoleShotRadiusPx?: number;
  /** black_hole_shot: pull force inside singularity (default 0.01) */
  blackHoleShotForce?: number;
  /** black_hole_shot: singularity duration in seconds (default 3) */
  blackHoleShotDurationSec?: number;
  /** spacial_rend: void damage dealt to all beys (default 50) */
  spacialRendDamage?: number;
  /** spacial_rend: teleport radius for scatter in cm (default 20) */
  spacialRendTeleportRadiusCm?: number;

  // ── Fighting / Impact move config fields ─────────────────────────────────
  /** cross_slash: close range in px (default 80) */
  crossSlashRangePx?: number;
  /** cross_slash: bonus damage multiplier when target spin < 50% (default 1.5) */
  crossSlashBonusMult?: number;
  /** impact_burst: knockback impulse magnitude (default 0.07) */
  impactBurstKnockback?: number;
  /** impact_burst: confusion duration in seconds (default 1.5) */
  impactBurstConfusionSec?: number;
  /** armor_pierce: defense-shatter duration in seconds (default 3) */
  armorPierceShatterSec?: number;
  /** flurry_barrage: number of shots in burst (default 5) */
  flurryBarrageHits?: number;
  /** flurry_barrage: damage multiplier per hit (base * hitIndex * mult, default 0.3) */
  flurryBarrageEscalateMult?: number;
  /** flurry_barrage: interval between shots in ms (default 80) */
  flurryBarrageIntervalMs?: number;
  /** mach_shot: speed multiplier vs normal projectile (default 4.0) */
  machShotSpeedMult?: number;
  /** gravity_grip: hold duration in seconds (default 2) */
  gravityGripHoldSec?: number;
  /** gravity_grip: spin drain per second while held (default 40) */
  gravityGripSpinDrainPerSec?: number;
  /** ram_charge: stun chance 0–1 (default 0.3) */
  ramChargeStunChance?: number;
  /** ram_charge: stun duration in seconds (default 1.0) */
  ramChargeStunSec?: number;
  /** graviton_throw: push force toward wall (default 0.12) */
  gravitonThrowForce?: number;

  // ── Close-range move config fields ────────────────────────────────────────
  /** razor_spin: aura radius in px (default 70) */
  razorSpinRadiusPx?: number;
  /** razor_spin: damage per second inside aura (default 20) */
  razorSpinDmgPerSec?: number;
  /** point_blank: maximum trigger range in px (default 60) */
  pointBlankRangePx?: number;
  /** point_blank: damage multiplier vs normal attack (default 3.0) */
  pointBlankDamageMult?: number;
  /** static_field: field radius in px (default 80) */
  staticFieldRadiusPx?: number;
  /** static_field: shock damage per entry (default 15) */
  staticFieldShockDmg?: number;
  /** static_field: minimum re-entry gap in ms (default 1000) */
  staticFieldCooldownMs?: number;
  /** acid_spray: cone half-angle in degrees (default 25) */
  acidSprayConeHalfDeg?: number;
  /** acid_spray: defense reduction multiplier applied (default 1.5, i.e. 50% more damage taken) */
  acidSprayDefBreakMult?: number;
  /** acid_spray: debuff duration in seconds (default 3) */
  acidSprayDebuffSec?: number;
  /** shockwave: push force per tick (default 0.08) */
  shockwavePushForce?: number;
  /** shockwave: pulse radius in px (default 120) */
  shockwaveRadiusPx?: number;
  /** spin_slash: number of blade arms / hits (default 3) */
  spinSlashArms?: number;
  /** spin_slash: blade rotation speed deg/s (default 180) */
  spinSlashSpeedDeg?: number;
  /** guillotine: spin threshold below which move triggers (fraction 0–1, default 0.25) */
  guillotineSpinThreshold?: number;
  /** guillotine: damage dealt when threshold met (default 120) */
  guillotineDamage?: number;

  // ── Aerial / Ground move config fields ────────────────────────────────────
  /** anti_grav: airborne duration in seconds (default 1.5) */
  antiGravAirborneSec?: number;
  /** anti_grav: slam AoE radius in px (default 70) */
  antiGravSlamAoePx?: number;
  /** anti_grav: slam damage (default 30) */
  antiGravSlamDamage?: number;

  // ── Bug type config fields ─────────────────────────────────────────────────
  /** drain_sting: fraction of target's current health stolen (default 0.1 = 10%) */
  drainStingFraction?: number;
  /** drain_sting: max range in px (default 70) */
  drainStingRangePx?: number;
  /** string_shot: speed multiplier applied (default 0.3) */
  stringShotSpeedMult?: number;
  /** string_shot: snare duration in seconds (default 3) */
  stringShotDurationSec?: number;
  /** silver_wind: storm radius in px (default 150) */
  silverWindRadiusPx?: number;
  /** silver_wind: damage dealt per bey (default 35) */
  silverWindDamage?: number;

  // ── Dark type config fields ────────────────────────────────────────────────
  /** sting_bolt: crit chance 0–1 (default 0.3) */
  stingBoltCritChance?: number;
  /** sting_bolt: crit damage multiplier (default 2.0) */
  stingBoltCritMult?: number;
  /** foul_play: fraction of target attackMultiplier reflected as damage multiplier (default 1.0) */
  foulPlayReflectMult?: number;
  /** dark_pulse: pulse radius in px (default 160) */
  darkPulseRadiusPx?: number;
  /** dark_pulse: stagger (control lock) duration in seconds (default 1.0) */
  darkPulseStaggerSec?: number;
  /** dark_pulse: spin drain fraction of current spin (default 0.25) */
  darkPulseSpinDrainFraction?: number;

  // ── Steel type config fields ───────────────────────────────────────────────
  /** steel_ram: knockback force (default 0.09) */
  steelRamKnockback?: number;
  /** steel_ram: stun duration in seconds (default 0.8) */
  steelRamStunSec?: number;
  /** metal_sound: defense multiplier applied to target (default 1.8) */
  metalSoundDefBreakMult?: number;
  /** metal_sound: debuff duration in seconds (default 4) */
  metalSoundDurationSec?: number;
  /** magnet_bomb: pull phase duration in seconds (default 1.0) */
  magnetBombPullSec?: number;
  /** magnet_bomb: pull force toward turret (default 0.02) */
  magnetBombPullForce?: number;
  /** magnet_bomb: explosion push force (default 0.18) */
  magnetBombPushForce?: number;
  /** magnet_bomb: explosion radius in px (default 200) */
  magnetBombRadiusPx?: number;

  // ── Normal type config fields ──────────────────────────────────────────────
  /** tackle: knockback impulse (default 0.05) */
  tackleKnockback?: number;
  /** drill_shot: crit chance 0–1 (default 0.25) */
  drillShotCritChance?: number;
  /** drill_shot: pierce distance beyond first target in px (default 80) */
  drillShotPiercePx?: number;
  /** hyper_voice: arena-wide damage per bey (default 25) */
  hyperVoiceDamage?: number;
  /** hyper_voice: stagger duration in seconds (default 0.5) */
  hyperVoiceStaggerSec?: number;

  // ── Stat-change move config fields ────────────────────────────────────────
  /** swords_dance: number of buffed shots (default 3) */
  swordsDanceCharges?: number;
  /** swords_dance: damage multiplier for buffed shots (default 2.0) */
  swordsDanceMult?: number;
  /** tail_whip: AoE radius in px (default 140) */
  tailWhipRadiusPx?: number;
  /** tail_whip: damage taken multiplier applied (default 1.3) */
  tailWhipDamageMult?: number;
  /** tail_whip: debuff duration in seconds (default 4) */
  tailWhipDurationSec?: number;
  /** growl: AoE radius in px (default 140) */
  growlRadiusPx?: number;
  /** growl: extra spin drain rate multiplier (default 1.5) */
  growlSpinDrainMult?: number;
  /** growl: debuff duration in seconds (default 4) */
  growlDurationSec?: number;
  /** meditate: damage multiplier for next shot (default 4.0) */
  meditateMult?: number;
  /** nasty_plot: number of defense-bypassing shots (default 5) */
  nastyPlotCharges?: number;
  /** agility: number of reduced-cooldown shots (default 6) */
  agilityCharges?: number;
  /** agility: cooldown multiplier during agility (default 0.5) */
  agilityCooldownMult?: number;

  // ── Poison type config fields ──────────────────────────────────────────────
  /** poison_jab: stacks of poison applied per hit (default 1) */
  poisonJabStacks?: number;
  /** poison_jab: DoT per stack per second (default 5) */
  poisonJabDotPerSec?: number;
  /** poison_jab: DoT duration per stack in seconds (default 4) */
  poisonJabDotDurationSec?: number;
  /** venoshock: damage multiplier when target has active status (default 2.0) */
  venoshockStatusMult?: number;

  // ── Psychic extra config fields ────────────────────────────────────────────
  /** psyshock: whether to bypass damageTaken (always true; field for override) */
  psyshockIgnoreDefense?: boolean;
  /** future_sight: delay before strike lands in seconds (default 3.0) */
  futureSightDelaySec?: number;
  /** future_sight: damage multiplier (default 1.5) */
  futureSightDamageMult?: number;

  // ── Dragon type config fields ──────────────────────────────────────────────
  /** dragon_slash: number of energy slashes (default 3) */
  dragonSlashHits?: number;
  /** dragon_slash: stagger chance on last hit 0–1 (default 0.4) */
  dragonSlashStaggerChance?: number;
  /** outrage: rampage duration in seconds (default 3.0) */
  outrageRampageSec?: number;
  /** outrage: turret control-lock after rampage in seconds (default 2.0) */
  outrageRecoilSec?: number;
  /** outrage: hit interval during rampage in ms (default 300) */
  outrageHitIntervalMs?: number;

  // ── Ghost extra config fields ──────────────────────────────────────────────
  /** hex: status-condition damage multiplier (default 2.0) */
  hexStatusMult?: number;
  /** ghost_strike: phasing range — always connects; sets max auto-hit range in px (default 80) */
  ghostStrikeRangePx?: number;

  // ── Fairy type config fields ───────────────────────────────────────────────
  /** moonblast: knockback force (default 0.07) */
  moonblastKnockback?: number;
  /** dazzling_gleam: AoE radius in px (default 120) */
  dazzlingGleamRadiusPx?: number;
  /** dazzling_gleam: control lock duration in seconds (default 0.8) */
  dazzlingGleamLockSec?: number;

  // ── Weather / Environment config fields ────────────────────────────────────
  /** sunny_day / rain_dance / sandstorm / hail_weather: duration in seconds (default 8) */
  weatherDurationSec?: number;
  /** sunny_day: fire damage multiplier during sun (default 1.5) */
  sunnyFireMult?: number;
  /** rain_dance: water damage multiplier during rain (default 1.5) */
  rainWaterMult?: number;
  /** sandstorm: DoT trickle damage per second per bey (default 3) */
  sandstormDotPerSec?: number;
  /** hail_weather: freeze interval between random ice hits in seconds (default 2) */
  hailWeatherStrikeIntervalSec?: number;
  /** misty_terrain / grassy_terrain / electric_terrain / psychic_terrain: duration in seconds (default 8) */
  terrainDurationSec?: number;
  /** grassy_terrain: spin recovery per second (default 10) */
  grassySpinRecoveryPerSec?: number;

  // ── Charge move config fields ──────────────────────────────────────────────
  /** charge: damage multiplier for the boosted next shot (default 1.8) */
  chargeDamageMult?: number;
  /** charge: paralysis chance on boosted shot 0–1 (default 0.3) */
  chargeParalysisChance?: number;
  /** charge_beam: 50% chance boost multiplier (default 1.5) */
  chargeBeamBoostMult?: number;
  /** charge_cannon: charge-up duration in seconds (default 1.5) */
  chargeCannonChargeSec?: number;
  /** charge_cannon: knockdown duration in seconds (default 1.5) */
  chargeCannonKnockdownSec?: number;
  /** solar_charge: normal charge time in seconds (default 1.0) */
  solarChargeTimeSec?: number;

  // ── Speed / Power move config fields ──────────────────────────────────────
  /** flare_blitz: turret recoil as fraction of damage dealt (default 0.33) */
  flareBlitzRecoilFraction?: number;
  /** flare_blitz: burn DoT duration in seconds (default 3) */
  flareBlitzBurnSec?: number;
  /** thunder_ram: paralysis chance 0–1 (default 0.2) */
  thunderRamParalysisChance?: number;
  /** thunder_ram: turret recoil as fraction (default 0.33) */
  thunderRamRecoilFraction?: number;
  /** thunder_drive: turret recoil as fraction (default 0.25) */
  thunderDriveRecoilFraction?: number;
  /** power_drive: turret recoil as fraction (default 0.25) */
  powerDriveRecoilFraction?: number;

  // ── Launcher / Airborne config fields ─────────────────────────────────────
  /** uppercut: max trigger range in px (default 80) */
  uppercutRangePx?: number;
  /** uppercut: airborne duration in seconds (default 1.2) */
  uppercutAirborneSec?: number;
  /** launch_spike: spike AoE radius in px (default 60) */
  launchSpikeAoePx?: number;
  /** sky_uppercut: spin zone radius at peak in px (default 80) */
  skyUppercutSpinZoneRadiusPx?: number;

  // ── Mortal Kombat inspired config fields ─────────────────────────────────
  /** spear_chain: chain speed in px/s (default 300) */
  spearChainSpeedPx?: number;
  /** spear_chain: pull-back force after grab (default 0.12) */
  spearChainPullForce?: number;
  /** cryo_lance: shatter multiplier on second hit (default 2.5) */
  cryoLanceShatterMult?: number;
  /** ring_blade: blade width in px (default 20) */
  ringBladeWidthPx?: number;
  /** ring_blade: number of full passes (default 2) */
  ringBladePasses?: number;
  /** portal_strike: lightning burst radius at landing in px (default 100) */
  portalStrikeBurstRadiusPx?: number;
  /** dragon_fireball: projectile bounce count (default 3) */
  dragonFireballBounces?: number;
  /** dragon_fireball: explosion AoE radius in px (default 40) */
  dragonFireballAoePx?: number;
  /** inferno_slam: ground fire AoE radius in px (default 120) */
  infernoSlamAoePx?: number;

  // ── Defensive self-buff config fields ─────────────────────────────────────
  /** harden: invulnerability duration in seconds (default 1.5) */
  hardenDurationSec?: number;
  /** defense_curl: invulnerability duration in seconds (default 1.0) */
  defenseCurlDurationSec?: number;
  /** defense_curl: next shot damage multiplier (default 1.5) */
  defenseCurlDamageMult?: number;
  /** withdraw: invulnerability duration in seconds (default 2.0) */
  withdrawDurationSec?: number;
  /** cosmic_power: attack reduction on all beys (multiplier, default 0.75) */
  cosmicPowerAtkReduction?: number;
  /** cosmic_power: turret range boost multiplier (default 1.5) */
  cosmicPowerRangeBoost?: number;
  /** cosmic_power: buff duration in seconds (default 5) */
  cosmicPowerDurationSec?: number;

  // ── Street Fighter config ─────────────────────────────────────────────────
  /** hadoken: projectile damage (default 25) */
  hadokenDamage?: number;
  /** hadoken: projectile speed px/s (default 400) */
  hadokenSpeed?: number;
  /** shoryuken: airborne duration in seconds (default 0.6) */
  shoryukenAirborneSec?: number;
  /** shoryuken: burn damage per second while airborne (default 10) */
  shoryukenBurnPerSec?: number;
  /** sonic_boom: projectile speed px/s (default 700) */
  sonicBoomSpeed?: number;
  /** sonic_boom: damage (default 20) */
  sonicBoomDamage?: number;
  /** flash_kick: AoE radius px (default 80) */
  flashKickRadius?: number;
  /** flash_kick: damage (default 30) */
  flashKickDamage?: number;
  /** raging_demon: spin threshold fraction to trigger (default 0.25) */
  ragingDemonThreshold?: number;
  /** raging_demon: damage multiplier (default 3.0) */
  ragingDemonMult?: number;
  /** spiral_drill: hits before dissipating (default 3) */
  spiralDrillHits?: number;
  /** spiral_drill: damage per hit (default 12) */
  spiralDrillDmgPerHit?: number;
  /** hundred_kicks: number of hits (default 10) */
  hundredKicksHits?: number;
  /** hundred_kicks: interval between hits ms (default 40) */
  hundredKicksIntervalMs?: number;
  /** electric_body: aura radius px (default 70) */
  electricBodyRadius?: number;
  /** electric_body: damage per second (default 8) */
  electricBodyDpsPerSec?: number;
  /** electric_body: duration in seconds (default 4) */
  electricBodyDurationSec?: number;
  // ── Bleach Bankai config ──────────────────────────────────────────────────
  /** tensa_zangetsu: beam damage (default 80) */
  tensaZangetsuDamage?: number;
  /** tensa_zangetsu: beam width px (default 12) */
  tensaZangetsuWidth?: number;
  /** senbonzakura: number of petal shards (default 30) */
  senbonzakuraShards?: number;
  /** senbonzakura: damage per shard (default 5) */
  senbonzakuraDmgPerShard?: number;
  /** senbonzakura: storm radius px (default 200) */
  senbonzakuraRadius?: number;
  /** daiguren_ice: expand speed px/s (default 120) */
  daiGurenExpandSpeed?: number;
  /** daiguren_ice: freeze duration seconds (default 3) */
  daiGurenFreezeSec?: number;
  /** daiguren_ice: max radius px (default 180) */
  daiGurenMaxRadius?: number;
  /** absolute_zero: freeze duration seconds (default 2) */
  absoluteZeroFreezeSec?: number;
  /** absolute_zero: shatter damage (default 120) */
  absoluteZeroShatterDmg?: number;
  /** muken_poison: initial radius px (default 60) */
  mukenPoisonInitRadius?: number;
  /** muken_poison: expand speed px/s (default 30) */
  mukenPoisonExpandSpeed?: number;
  /** muken_poison: DoT damage per second per stack (default 12) */
  mukenPoisonDotPerSec?: number;
  /** muken_poison: field duration seconds (default 8) */
  muken_poisonDurationSec?: number;
  /** zanka_incinerate: field damage per second (default 15) */
  zankaFieldDotPerSec?: number;
  /** zanka_incinerate: fire damage boost multiplier (default 1.5) */
  zankaFireBoostMult?: number;
  /** zanka_incinerate: field duration seconds (default 6) */
  zankaFieldDurationSec?: number;
  /** suzumebachi: first hit damage (default 10) */
  suzumebachiFirstHitDmg?: number;
  /** suzumebachi: kill threshold spin fraction (default 0.15) */
  suzumebachiKillThreshold?: number;
  /** hihio_construct: sweep arc degrees (default 90) */
  hihioSweepArcDeg?: number;
  /** hihio_construct: damage (default 40) */
  hihioDamage?: number;
  /** hihio_construct: trail linger ms (default 800) */
  hihioTrailLingerMs?: number;
  // ── Naruto config ─────────────────────────────────────────────────────────
  /** rasengan: collision radius px (default 30) */
  rasenganRadius?: number;
  /** rasengan: damage (default 55) */
  rasenganDamage?: number;
  /** rasengan: knockback force (default 700) */
  rasenganKnockback?: number;
  /** chidori: beam length px (default 200) */
  chidoriLength?: number;
  /** chidori: damage (default 70) */
  chidoriDamage?: number;
  /** shadow_clone: number of strike directions (default 4) */
  shadowCloneDirections?: number;
  /** shadow_clone: damage per hit (default 15) */
  shadowCloneDmgPerHit?: number;
  /** sand_burial: trap radius px (default 60) */
  sandBurialRadius?: number;
  /** sand_burial: hold duration seconds (default 2) */
  sandBurialHoldSec?: number;
  /** sand_burial: burst damage (default 50) */
  sandBurialDamage?: number;
  /** fireball_jutsu: cone half-angle degrees (default 25) */
  fireballJutsuConeHalfDeg?: number;
  /** fireball_jutsu: range px (default 250) */
  fireballJutsuRange?: number;
  /** fireball_jutsu: damage (default 35) */
  fireballJutsuDamage?: number;
  /** eight_trigrams: hits (default 8) */
  eightTrigramsHits?: number;
  /** eight_trigrams: damage per hit (default 8) */
  eightTriggramsDmgPerHit?: number;
  /** amaterasu: DoT damage per second (default 20) */
  amaterasuDotPerSec?: number;
  /** amaterasu: field duration seconds (default 10) */
  amaterasuDurationSec?: number;
  /** amaterasu: field radius px (default 40) */
  amaterasuRadius?: number;
  /** susanoo: shield duration seconds (default 5) */
  susanooShieldSec?: number;
  /** susanoo: counter damage on hit (default 30) */
  susanooCounterDmg?: number;
  /** susanoo: pulse interval ms (default 1500) */
  susanooPulseIntervalMs?: number;
  // ── Ninja technique config ────────────────────────────────────────────────
  /** substitution: invulnerability duration seconds (default 1.5) */
  substitutionInvulSec?: number;
  /** shadow_shuriken: diverge angle degrees (default 15) */
  shadowShurikenAngleDeg?: number;
  /** shadow_shuriken: damage per shuriken (default 20) */
  shadowShurikenDmg?: number;
  /** kunai_barrage: number of kunai (default 5) */
  kunaiBarrageCount?: number;
  /** kunai_barrage: fan spread degrees (default 60) */
  kunaiBarrageSpreadDeg?: number;
  /** kunai_barrage: damage per kunai (default 12) */
  kunaiBarrageDmgPerHit?: number;
  /** smoke_bomb: spin-gain reduction fraction (default 0.5) */
  smokeBombSpinGainMult?: number;
  /** smoke_bomb: duration seconds (default 4) */
  smokeBombDurationSec?: number;
  /** wire_trap: pull force (default 500) */
  wireTrapPullForce?: number;
  /** wire_trap: hold duration seconds (default 2) */
  wireTrapHoldSec?: number;
  /** exploding_tag: trigger radius px (default 50) */
  explodingTagRadius?: number;
  /** exploding_tag: damage (default 70) */
  explodingTagDamage?: number;
  // ── Transformation config ─────────────────────────────────────────────────
  /** ultra_form: stat boost multiplier (default 1.5) */
  ultraFormBoostMult?: number;
  /** ultra_form: duration seconds (default 8) */
  ultraFormDurationSec?: number;
  /** demon_form: crit chance fraction (default 1.0) */
  demonFormCritChance?: number;
  /** demon_form: duration seconds (default 6) */
  demonFormDurationSec?: number;
  /** sage_mode: power multiplier (default 1.8) */
  sageModePowerMult?: number;
  /** sage_mode: regen per second (default 5) */
  sageModeRegenPerSec?: number;
  /** sage_mode: duration seconds (default 10) */
  sageModeDurationSec?: number;
  /** bankai_release: damage multiplier (default 2.0) */
  bankaiDamageMult?: number;
  /** bankai_release: pulse radius px (default 150) */
  bankaiPulseRadius?: number;
  /** bankai_release: duration seconds (default 8) */
  bankaiDurationSec?: number;
  /** susanoo_full: shield radius px (default 120) */
  susanooFullRadius?: number;
  /** susanoo_full: counter damage (default 50) */
  susanooFullCounterDmg?: number;
  /** susanoo_full: duration seconds (default 6) */
  susanooFullDurationSec?: number;
  /** titan_shift: pulse radius px (default 160) */
  titanShiftPulseRadius?: number;
  /** titan_shift: damage per pulse (default 25) */
  titanShiftPulseDmg?: number;
  /** titan_shift: pulse interval ms (default 1000) */
  titanShiftPulseIntervalMs?: number;
  /** titan_shift: duration seconds (default 7) */
  titanShiftDurationSec?: number;
  // ── Summon config ─────────────────────────────────────────────────────────
  /** summon_toad: AoE slam radius px (default 200) */
  summonToadRadius?: number;
  /** summon_toad: slam damage (default 80) */
  summonToadDamage?: number;
  /** summon_snake: constrict hold seconds (default 2) */
  summonSnakeHoldSec?: number;
  /** summon_snake: poison DoT per second (default 15) */
  summonSnakeDotPerSec?: number;
  /** summon_slug: turret heal per second (default 10) */
  summonSlugHealPerSec?: number;
  /** summon_slug: heal duration seconds (default 5) */
  summonSlugDurationSec?: number;
  /** summon_kirin: damage (default 150) */
  summonKirinDamage?: number;
  /** summon_eagle: dive AoE radius px (default 100) */
  summonEagleRadius?: number;
  /** summon_eagle: damage (default 60) */
  summonEagleDamage?: number;
  /** summon_clones: number of clone strikes (default 8) */
  summonClonesCount?: number;
  /** summon_clones: damage per clone strike (default 12) */
  summonClonesDmgPerHit?: number;
  // ── Tekken config ─────────────────────────────────────────────────────────
  /** devil_beam: damage (default 85) */
  devilBeamDamage?: number;
  /** devil_beam: beam width px (default 10) */
  devilBeamWidth?: number;
  /** wind_god_fist: electric damage (default 55) */
  windGodFistDamage?: number;
  /** wind_god_fist: launch force (default 600) */
  windGodFistLaunchForce?: number;
  /** hellsweep: knockdown duration seconds (default 1.5) */
  hellsweepKnockdownSec?: number;
  /** hellsweep: damage (default 30) */
  hellsweepDamage?: number;
  /** laser_scraper: arc degrees (default 120) */
  laserScraperArcDeg?: number;
  /** laser_scraper: damage per degree swept (default 0.3) */
  laserScraperDmgPerDeg?: number;
  /** rage_drive: damage multiplier on next attack (default 2.5) */
  rageDriveMult?: number;
  /** heat_smash: damage (default 65) */
  heatSmashDamage?: number;
  /** heat_smash: ignite duration seconds (default 3) */
  heatSmashIgniteSec?: number;
  /** ki_charge_tek: damage boost multiplier (default 1.8) */
  kiChargeTekBoostMult?: number;
  /** ki_charge_tek: charges stored (default 1) */
  kiChargeTekCharges?: number;
  /** twin_pistols: damage per shot (default 18) */
  twinPistolsDmgPerShot?: number;
  /** twin_pistols: converge distance px (default 120) */
  twinPistolsConvergePx?: number;

  // ── Time-based config ─────────────────────────────────────────────────────
  /** time_warp: how many seconds back to rewind bey position (default 2) */
  timeWarpRewindSec?: number;
  /** time_stop: freeze duration seconds (default 1.5) */
  timeStopDurationSec?: number;
  /** time_loop: delay before repeat in seconds (default 2) */
  timeLoopDelaySec?: number;
  /** time_acceleration: spin decay multiplier (default 3) */
  timeAccelDecayMult?: number;
  /** time_acceleration: duration seconds (default 5) */
  timeAccelDurationSec?: number;
  /** age_drain: drain fraction per second (default 0.02) */
  ageDrainFractionPerSec?: number;
  // ── Extended Bankai config ────────────────────────────────────────────────
  /** gigantification: slam AoE radius px (default 220) */
  gigantificationRadius?: number;
  /** gigantification: slam damage (default 90) */
  gigantificationDamage?: number;
  /** ryujin_jakka_full: fire field DPS (default 20) */
  ryujinJakkaFullDps?: number;
  /** ryujin_jakka_full: duration seconds (default 8) */
  ryujinJakkaFullDurationSec?: number;
  /** minazuki_heal: turret heal per second (default 8) */
  minazukiHealPerSec?: number;
  /** minazuki_heal: field radius px (default 150) */
  minazukiRadius?: number;
  /** katen_kyokotsu: damage per game roll (default 40) */
  katenDamage?: number;
  /** senbonzakura_kageyoshi: waves count (default 3) */
  senbonzakuraKageyoshiWaves?: number;
  /** senbonzakura_kageyoshi: damage per wave (default 30) */
  senbonzakuraKageyoshiDmgPerWave?: number;
  /** daiguren_full: slam damage (default 100) */
  daiGurenFullDamage?: number;
  /** daiguren_full: AoE radius px (default 200) */
  daiGurenFullRadius?: number;
  // ── Arrancar / Espada config ──────────────────────────────────────────────
  /** cero: beam damage (default 60) */
  ceroDamage?: number;
  /** gran_rey_cero: damage (default 80) AoE radius (default 120) */
  granReyCeroDamage?: number;
  /** gran_rey_cero: AoE radius px */
  granReyCeroRadius?: number;
  /** cero_oscuras: damage (default 100, no reductions) */
  ceroOscurasDamage?: number;
  /** bala: hits (default 5) dmg per hit (default 12) */
  balaHits?: number;
  /** bala: damage per hit */
  balaDmgPerHit?: number;
  /** hierro: damage reduction fraction (default 0.4) */
  hierroDamageReduction?: number;
  /** hierro: duration seconds (default 4) */
  hierroDurationSec?: number;
  /** descorrer: pull radius px (default 180) */
  descorrerRadius?: number;
  /** descorrer: pull force (default 600) */
  descorrerPullForce?: number;
  /** lanza_del_relampago: explosion radius px (default 150) */
  lanzaExplosionRadius?: number;
  /** lanza_del_relampago: damage (default 120) */
  lanzaDamage?: number;
  /** santa_teresa: wave width px (default 80) */
  santaTeresaWidth?: number;
  /** santa_teresa: knockback force (default 900) */
  santaTeresaKnockback?: number;
  /** resurreccion: duration seconds (default 8) */
  resurreccionDurationSec?: number;
  /** resurreccion: damage multiplier (default 1.8) */
  resurreccionDamageMult?: number;
  // ── Gotei-13 / Kido config ────────────────────────────────────────────────
  /** reiatsu_burst: suppression radius px (default 140) */
  reiatsuBurstRadius?: number;
  /** reiatsu_burst: spin drain per second (default 100) */
  reiatsuBurstSpinDrain?: number;
  /** reiatsu_burst: duration seconds (default 3) */
  reiatsuBurstDurationSec?: number;
  /** kido_hado_31: fire sphere damage (default 35) */
  kidoHado31Damage?: number;
  /** kido_hado_63: thunder blast damage (default 60) */
  kidoHado63Damage?: number;
  /** kido_hado_63: paralysis seconds (default 1) */
  kidoHado63ParalysisSec?: number;
  /** kido_hado_90: coffin gravity damage (default 80) */
  kidoHado90Damage?: number;
  /** kido_hado_90: trap duration seconds (default 2.5) */
  kidoHado90TrapSec?: number;
  /** kido_bakudo_61: lock duration seconds (default 3) */
  kidoBakudo61LockSec?: number;
  /** kido_bakudo_99: full lockdown duration seconds (default 4) */
  kidoBakudo99LockSec?: number;
  /** roar_of_seireitei: mega burst radius px (default 250) */
  roarRadius?: number;
  /** roar_of_seireitei: damage (default 150) */
  roarDamage?: number;
  // ── Visored / Hollowification config ─────────────────────────────────────
  /** mask_on: duration seconds (default 8) */
  maskOnDurationSec?: number;
  /** mask_on: damage boost multiplier (default 1.6) */
  maskOnDamageMult?: number;
  /** hollow_cero: damage (default 75) */
  hollowCeroDamage?: number;
  /** getsuga_tensho: arc damage (default 65) */
  getsugatenshoDamage?: number;
  /** getsuga_tensho: arc radius px (default 180) */
  getsugatenshoRadius?: number;
  /** mugetsu: damage (default 200, single-target) */
  mugetsuDamage?: number;
  // ── Itachi / Genjutsu config ──────────────────────────────────────────────
  /** tsukuyomi: inversion duration seconds (default 3) */
  tsukuyomiDurationSec?: number;
  /** amaterasu_mark: mark duration seconds (default 10) */
  amaterasuMarkDurationSec?: number;
  /** amaterasu_mark: ignite damage on trigger (default 50) */
  amaterasuMarkTriggerDmg?: number;
  /** izanagi: protects turret from N kills (default 1) */
  izanagiCharges?: number;
  /** izanami: loop duration seconds (default 2) */
  izanamiLoopSec?: number;
  /** sharingan_lock: mirror duration seconds (default 2.5) */
  sharinganLockSec?: number;
  /** crow_genjutsu: erratic duration seconds (default 2) */
  crowGenjutsuDurationSec?: number;
  /** susanoo_itachi: seal duration seconds (default 5) */
  susanooItachiSealSec?: number;
  /** susanoo_itachi: spin drain per second while sealed (default 150) */
  susanooItachiSpinDrainPerSec?: number;
  // ── Extended summon config ────────────────────────────────────────────────
  /** summon_ryuchi: constrict seconds (default 2) venom dps (default 18) */
  summonRyuchiHoldSec?: number;
  /** summon_ryuchi: venom DoT per second */
  summonRyuchiDotPerSec?: number;
  /** summon_myoboku: oil damage (default 50) sage boost duration seconds (default 5) */
  summonMyobokuOilDmg?: number;
  /** summon_myoboku: sage boost duration seconds */
  summonMyobokuBoostSec?: number;
  /** summon_garuda: wind AoE radius px (default 160) */
  summonGarudaRadius?: number;
  /** summon_garuda: damage (default 55) */
  summonGarudaDamage?: number;
  /** summon_enma: reach length px (default 300) */
  summonEnmaReach?: number;
  /** summon_enma: damage (default 45) */
  summonEnmaDamage?: number;
  /** summon_gamaken: spear spin arc degrees (default 360) */
  summonGamakenArcDeg?: number;
  /** summon_gamaken: damage (default 70) */
  summonGamakenDamage?: number;
  /** edo_tensei: extra HP fraction (default 0.25) */
  edoTenseiHpFraction?: number;

  // ── Size & Weight Scaling config ─────────────────────────────────────────
  /** enlarge: radius scale multiplier (default 1.5) */
  enlargeRadiusScale?: number;
  /** enlarge: collision damage multiplier (default 1.8) */
  enlargeCollisionMult?: number;
  /** enlarge: speed reduction multiplier (default 0.7) */
  enlargeSpeedMult?: number;
  /** enlarge: duration seconds (default 6) */
  enlargeDurationSec?: number;
  /** shrink: radius scale multiplier (default 0.5) */
  shrinkRadiusScale?: number;
  /** shrink: speed boost multiplier (default 1.3) */
  shrinkSpeedMult?: number;
  /** shrink: duration seconds (default 5) */
  shrinkDurationSec?: number;
  /** mass_shift: knockback resistance fraction (default 0.6) */
  massShiftKbResist?: number;
  /** mass_shift: collision damage multiplier (default 2.0) */
  massShiftCollisionMult?: number;
  /** mass_shift: duration seconds (default 5) */
  massShiftDurationSec?: number;
  /** density_crush: AoE radius px (default 60) */
  densityCrushRadius?: number;
  /** density_crush: damage (default 80) */
  densityCrushDamage?: number;
  // ── Full Transformation config ────────────────────────────────────────────
  /** hollow_transform: duration seconds (default 8) */
  hollowTransformDurationSec?: number;
  /** hollow_transform: cero pulse damage (default 40) */
  hollowTransformCeroDmg?: number;
  /** hollow_transform: pulse interval ms (default 1200) */
  hollowTransformPulseMs?: number;
  /** kyuubi_mode: duration seconds (default 10) */
  kyuubiModeDurationSec?: number;
  /** kyuubi_mode: aura radius px (default 100) */
  kyuubiModeAuraRadius?: number;
  /** kyuubi_mode: aura DPS (default 12) */
  kyuubiModeAuraDps?: number;
  /** kyuubi_mode: speed boost multiplier (default 1.4) */
  kyuubiModeSpeedMult?: number;
  /** bijuu_mode: duration seconds (default 8) */
  bijuuModeDurationSec?: number;
  /** bijuu_mode: movement AoE radius px (default 80) */
  bijuuModeAoeRadius?: number;
  /** bijuu_mode: movement AoE damage (default 20) */
  bijuuModeAoeDmg?: number;
  /** tailed_beast_bomb: radius px (default 200) */
  tailedBeastBombRadius?: number;
  /** tailed_beast_bomb: damage (default 180) */
  tailedBeastBombDamage?: number;
  /** curse_mark_2: duration seconds (default 7) */
  curseMark2DurationSec?: number;
  /** curse_mark_2: crit damage multiplier (default 2.5) */
  curseMark2CritMult?: number;
  /** six_paths_mode: duration seconds (default 10) */
  sixPathsDurationSec?: number;
  /** six_paths_mode: all-element damage multiplier (default 1.5) */
  sixPathsDamageMult?: number;
  /** ten_tails_jinchuriki: field radius px (default 250) */
  tenTailsRadius?: number;
  /** ten_tails_jinchuriki: spin drain per second (default 80) */
  tenTailsSpinDrain?: number;
  /** ten_tails_jinchuriki: duration seconds (default 8) */
  tenTailsDurationSec?: number;
  /** berserk_hollow: duration seconds (default 6) */
  berserkHollowDurationSec?: number;
  /** berserk_hollow: random hit damage range (default 15–80) */
  berserkHollowMinDmg?: number;
  /** berserk_hollow: max damage per random hit */
  berserkHollowMaxDmg?: number;
  // ── Deidara config ────────────────────────────────────────────────────────
  /** clay_spider: move speed px/s (default 150) */
  claySpiderSpeed?: number;
  /** clay_spider: explosion radius px (default 50) */
  claySpiderRadius?: number;
  /** clay_spider: explosion damage (default 35) */
  claySpiderDamage?: number;
  /** clay_dragon: explosion radius px (default 120) */
  clayDragonRadius?: number;
  /** clay_dragon: explosion damage (default 80) */
  clayDragonDamage?: number;
  /** clay_bomb: explosion radius px (default 180) */
  clayBombRadius?: number;
  /** clay_bomb: explosion damage (default 120) */
  clayBombDamage?: number;
  /** clay_clones_c4: DoT per second (default 25) */
  clayC4DotPerSec?: number;
  /** clay_clones_c4: duration seconds (default 5) */
  clayC4DurationSec?: number;
  /** katsu: global detonation damage per active clay (default 60) */
  katsuDmgPerClay?: number;
  // ── Akatsuki config ───────────────────────────────────────────────────────
  /** shinra_tensei: push force (default 1200) */
  shinraTenseiForce?: number;
  /** shinra_tensei: push radius px (default 250) */
  shinraTenseiRadius?: number;
  /** chibaku_tensei: pull force (default 800) */
  chibakuTenseiPullForce?: number;
  /** chibaku_tensei: crush radius px (default 60) */
  chibakuTenseiCrushRadius?: number;
  /** chibaku_tensei: crush damage (default 100) */
  chibakuTenseiCrushDamage?: number;
  /** chibaku_tensei: duration until crush seconds (default 3) */
  chibakuTenseiHoldSec?: number;
  /** samehada_drain: drain per second (default 150) spin units */
  samedhadrainPerSec?: number;
  /** samehada_drain: drain radius px (default 60) */
  samehaDrainRadius?: number;
  /** shark_bomb: damage (default 65) */
  sharkBombDamage?: number;
  /** earth_grudge_fear: hold duration seconds (default 2.5) */
  earthGrudgeHoldSec?: number;
  /** earth_grudge_fear: drain DPS (default 10) */
  earthGrudgeDps?: number;
  /** jashin_ritual: reflected damage fraction (default 0.8) */
  jashinReflectFraction?: number;
  /** jashin_ritual: link duration seconds (default 8) */
  jashinLinkDurationSec?: number;
  /** paper_bomb_storm: radius px (default 220) */
  paperBombRadius?: number;
  /** paper_bomb_storm: damage (default 110) */
  paperBombDamage?: number;
  /** kamui: absorption duration seconds (default 3) */
  kamuiDurationSec?: number;
  /** limbo_hengoku: phantom hits count (default 4) */
  limboHits?: number;
  /** limbo_hengoku: damage per hit (default 20) */
  limboDmgPerHit?: number;
  /** wood_dragon: trap duration seconds (default 3) */
  woodDragonTrapSec?: number;
  /** wood_dragon: spin drain per second (default 120) */
  woodDragonSpinDrain?: number;
  // Obito moves
  /** spiral_eye: pull force toward vortex center per tick (default 400) */
  spiralEyePullForce?: number;
  /** spiral_eye: fling force outward when vortex releases (default 1600) */
  spiralEyeFlingForce?: number;
  /** spiral_eye: vortex duration seconds (default 2.5) */
  spiralEyeDurationSec?: number;
  /** phantom_pass: intangibility duration seconds (default 2) */
  phantomPassDurationSec?: number;
  /** phantom_pass: materialization burst radius px (default 120) */
  phantomPassBurstRadius?: number;
  /** phantom_pass: materialization burst damage (default 60) */
  phantomPassBurstDamage?: number;
  /** black_zetsu_bind: bind duration seconds (default 3) */
  blackZetsuBindSec?: number;
  /** black_zetsu_bind: health drain per second (default 15) */
  blackZetsuDrainDps?: number;
  /** black_zetsu_bind: spin drain per second (default 80) */
  blackZetsuSpinDrain?: number;
  /** orange_mask_dash: max teleport distance from arena center px (default 300) */
  orangeMaskRange?: number;
  /** ten_tails_bijuudama: explosion radius px (default 320) */
  tenTailsBijuudamaRadius?: number;
  /** ten_tails_bijuudama: explosion damage (default 1800) */
  tenTailsBijuudamaDamage?: number;
  /** truth_seeker_orbs: number of orbiting orbs (default 6) */
  truthSeekerOrbCount?: number;
  /** truth_seeker_orbs: damage per orb per second to beys within radius (default 25) */
  truthSeekerOrbDps?: number;
  /** truth_seeker_orbs: contact radius per orb px (default 40) */
  truthSeekerOrbRadius?: number;
  /** truth_seeker_orbs: total effect duration seconds (default 5) */
  truthSeekerDurationSec?: number;
  // Rinnegan / Pain path techniques
  /** bansho_tenin: pull force magnitude (default 1000) */
  banshoTenInForce?: number;
  /** bansho_tenin: effective pull radius px (default 350) */
  banshoTenInRadius?: number;
  /** human_path: fraction of current health to remove (default 0.5) */
  humanPathHealthFraction?: number;
  /** preta_path: absorption shield duration seconds (default 2.5) */
  pretaPathDurationSec?: number;
  /** asura_path: damage per missile (default 40) */
  asuraPathMissileDamage?: number;
  /** asura_path: knockback force per missile (default 500) */
  asuraPathMissileKnockback?: number;
  // Minato / Advanced Naruto
  /** flying_thunder_god: damage on teleport strike (default 80) */
  flyingThunderGodDamage?: number;
  /** flying_thunder_god: control lock after strike seconds (default 0.6) */
  flyingThunderGodStunSec?: number;
  /** rasenshuriken: blast radius px (default 80) */
  rasenShurikenRadius?: number;
  /** rasenshuriken: damage (default 140) */
  rasenShurikenDamage?: number;
  /** rasenshuriken: spin drain on hit (default 300) */
  rasenShurikenSpinDrain?: number;
  /** odama_rasengan: blast radius px (default 100) */
  odamaRasenganRadius?: number;
  /** odama_rasengan: damage (default 160) */
  odamaRasenganDamage?: number;
  // Eight Gates
  /** eight_gates_release: duration seconds (default 4) */
  eightGatesDurationSec?: number;
  /** eight_gates_release: speed multiplier (default 2.0) */
  eightGatesSpeedMult?: number;
  /** eight_gates_release: damage multiplier (default 1.8) */
  eightGatesDamageMult?: number;
  /** eight_gates_release: health cost per second during surge (default 20) */
  eightGatesHealthCostPerSec?: number;
  /** evening_elephant: pillar damage (default 200) */
  eveningElephantDamage?: number;
  /** evening_elephant: pillar radius px (default 60) */
  eveningElephantRadius?: number;
  /** night_guy: final dragon damage (default 600) */
  nightGuyDamage?: number;
  /** night_guy: knockback force (default 3000) */
  nightGuyKnockback?: number;
  // Legendary Naruto / Otsutsuki
  /** tengai_shinsei: meteor AoE radius px (default 200) */
  tengaiShinSeiRadius?: number;
  /** tengai_shinsei: meteor damage (default 500) */
  tengaiShinSeiDamage?: number;
  /** kaguya_bones: number of bone spikes fired (default 5) */
  kaguyaBoneCount?: number;
  /** kaguya_bones: damage per spike (default 60) */
  kaguyaBoneDamage?: number;
  // Bleach: Aizen / Barragan / Grimmjow
  /** kyoka_suigetsu: confusion duration seconds (default 3) */
  kyokaSuigetsuDurationSec?: number;
  /** respira: decay aura duration seconds (default 4) */
  respiraDurationSec?: number;
  /** respira: spin decay multiplier — how many times faster spin drops (default 5) */
  respiraSpinDecayMult?: number;
  /** respira: health damage per second in field (default 10) */
  respiraDps?: number;
  /** respira: aura radius px (default 150) */
  respiraRadius?: number;
  /** desgarron: damage per slash (default 80) */
  desgarronDamage?: number;
  /** desgarron: number of parallel slashes (default 5) */
  desgarronSlashes?: number;
  // Dragon Ball
  /** kamehameha: beam width px (default 60) */
  kamehamehaWidth?: number;
  /** kamehameha: beam damage (default 120) */
  kamehamehaDamage?: number;
  /** kamehameha: beam range px (default 400) */
  kamehamehaRange?: number;
  /** spirit_bomb: charge duration seconds (default 3) */
  spiritBombChargeSec?: number;
  /** spirit_bomb: explosion radius px (default 180) */
  spiritBombRadius?: number;
  /** spirit_bomb: explosion damage (default 400) */
  spiritBombDamage?: number;
  /** final_flash: beam damage (default 200) */
  finalFlashDamage?: number;
  /** final_flash: knockback force (default 1500) */
  finalFlashKnockback?: number;
  /** death_beam: piercing damage (default 90) */
  deathBeamDamage?: number;
  // Gohan chain
  /** gohan_masenko: beam damage (default 90) */
  masenkoBeamDamage?: number;
  /** gohan_power_up: duration ms (default 8000) */
  gohanPowerUpDurationMs?: number;
  /** gohan_mystic_unleash: AoE radius px (default 200), damage (default 150) */
  mysticUnleashRadius?: number;
  mysticUnleashDamage?: number;
  // Vegeta chain
  /** galick_gun: cone half-angle deg (default 25), damage (default 110) */
  galickGunConeDeg?: number;
  galickGunDamage?: number;
  /** big_bang_attack: damage (default 180), knockback (default 1200) */
  bigBangDamage?: number;
  bigBangKnockback?: number;
  /** final_explosion: AoE radius px (default 400), damage (default 500), dormant ms (default 10000) */
  finalExplosionRadius?: number;
  finalExplosionDamage?: number;
  finalExplosionDormantMs?: number;
  // Cell chain
  /** solar_kamehameha: beam width px (default 120), damage (default 200) */
  solarKamehamehaWidth?: number;
  solarKamehamehaDamage?: number;
  /** cell_jr_spawn: unit count (default 3), damage per tick (default 8) */
  cellJrCount?: number;
  cellJrDamagePerTick?: number;
  /** perfect_form_cell: duration ms (default 8000) */
  perfectFormDurationMs?: number;
  // Buu chain
  /** chocolate_beam: spin-drain duration ms (default 2000) */
  chocolateBeamDurationMs?: number;
  /** buu_absorption: buff duration ms (default 6000) */
  buuAbsorptionDurationMs?: number;
  /** kid_buu_scream: AoE radius px (default 280), knockback force (default 600) */
  kidBuuScreamRadius?: number;
  kidBuuScreamKnockback?: number;
  // Frieza chain
  /** death_ball: AoE radius px (default 220), damage (default 320) */
  deathBallRadius?: number;
  deathBallDamage?: number;
  /** nova_strike: damage (default 130), speed px/s (default 2000) */
  novaStrikeDamage?: number;
  /** golden_frieza: duration ms (default 8000), damage multiplier (default 2.5) */
  goldenFriezaDurationMs?: number;
  goldenFriezaDamageMult?: number;
  // One Piece chain
  /** gear_second: duration ms (default 6000), hits (default 6), damage per hit (default 20) */
  gearSecondDurationMs?: number;
  gearSecondHits?: number;
  gearSecondDmgPerHit?: number;
  /** gear_fourth: AoE radius px (default 180), damage (default 200), immune ms (default 1500) */
  gearFourthRadius?: number;
  gearFourthDamage?: number;
  gearFourthImmuneMs?: number;
  /** conquerors_haki: range px (default 250), lock ms (default 2000) */
  conquerorsHakiRange?: number;
  conquerorsHakiLockMs?: number;
  /** three_sword_style: slash count (default 3), damage per slash (default 55) */
  threeSwordSlashCount?: number;
  threeSwordDmgPerSlash?: number;
  /** diable_jambe: damage (default 80), fire DoT per sec (default 20), duration ms (default 3000) */
  diableJambeDamage?: number;
  diableJambeFireDps?: number;
  diableJambeDurationMs?: number;
  // Demon Slayer chain
  /** water_breathing: hit count (default 5), damage per hit (default 22) */
  waterBreathingHits?: number;
  waterBreathingDmgPerHit?: number;
  /** hinokami_kagura: AoE radius px (default 160), damage (default 140) */
  hinokamiRadius?: number;
  hinokamiDamage?: number;
  /** thunder_breathing: damage (default 160), stun ms (default 800) */
  thunderBreathingDamage?: number;
  thunderBreathingStunMs?: number;
  /** beast_breathing: hit count (default 8), damage per hit (default 18) */
  beastBreathingHits?: number;
  beastBreathingDmgPerHit?: number;
  /** flame_breathing: cone angle deg (default 30), damage (default 120) */
  flameBreathingConeDeg?: number;
  flameBreathingDamage?: number;
  // Attack on Titan extra chain
  /** thunder_spear: bolt count (default 3), damage per bolt (default 70) */
  thunderSpearBolts?: number;
  thunderSpearDmgPerBolt?: number;
  /** omni_directional: dash count (default 4), damage per dash (default 35) */
  odmDashCount?: number;
  odmDmgPerDash?: number;
  /** hardening: duration ms (default 4000), knockback force (default 800) */
  hardeningDurationMs?: number;
  hardeningKnockback?: number;
  /** founding_titan: AoE radius px (default 350), drain per sec (default 80), lock ms (default 3000) */
  foundingTitanRadius?: number;
  foundingTitanDrainPerSec?: number;
  foundingTitanLockMs?: number;

  // ── Illusion / Deception config ──────────────────────────────────────────
  /** mirror_world: ghost offset radius in px (default 180) */
  mirrorWorldOffsetPx?: number;
  /** mirror_world: duration seconds (default 3.5) */
  mirrorWorldDurationSec?: number;
  /** perfect_mirage: invisibility duration seconds (default 2.5) */
  perfectMirageDurationSec?: number;
  /** broken_reality: max scatter radius from arena center px (default 350) */
  brokenRealityScatterPx?: number;
  /** phantasmal_shift: incoming damage reduction fraction (default 0.5) */
  phantasmalShiftDamageReduction?: number;
  /** phantasmal_shift: duration seconds (default 3) */
  phantasmalShiftDurationSec?: number;
  /** echo_image: decoy offset distance from real bey in px (default 120) */
  echoImageOffsetPx?: number;
  /** echo_image: hits each decoy absorbs before disappearing (default 1) */
  echoImageHitpoints?: number;
  /** genjutsu_veil: position drift per tick in px (default 10) */
  genjutsuVeilDriftPx?: number;
  /** genjutsu_veil: duration seconds (default 4) */
  genjutsuVeilDurationSec?: number;
  /** false_flag: identity swap duration seconds (default 5) */
  falseFlagDurationSec?: number;
  /** mind_fracture: inversion duration seconds (default 3) */
  mindFractureDurationSec?: number;

  // ── Contra power-up config (bey IS the weapon) ───────────────────────────
  /** spread_bey: number of impact vectors on collision (default 5) */
  spreadBeyCount?: number;
  /** spread_bey: arc half-angle in degrees (default 30) */
  spreadBeyArcHalfDeg?: number;
  /** spread_bey: damage per vector (default 25) */
  spreadBeyDamage?: number;
  /** railbey: speed multiplier for straight-line phase (default 4.0) */
  railbeySpeedMult?: number;
  /** railbey: duration of railgun phase seconds (default 1.5) */
  railbeyDurationSec?: number;
  /** railbey: pierce damage per bey passed through (default 40) */
  railbeyPierceDmg?: number;
  /** minigun_bey: number of rapid micro-pulses on collision (default 12) */
  minigunBeyPulses?: number;
  /** minigun_bey: interval between pulses ms (default 60) */
  minigunBeyIntervalMs?: number;
  /** minigun_bey: damage per pulse (default 8) */
  minigunBeyDmgPerPulse?: number;
  /** heat_seeker_bey: ram speed in px/s (default 600) */
  heatSeekerBeySpeed?: number;
  /** heat_seeker_bey: impact damage (default 70) */
  heatSeekerBeyDamage?: number;
  /** bomb_bey: fuse duration seconds (default 4) */
  bombBeyFuseSec?: number;
  /** bomb_bey: explosion radius px (default 160) */
  bombBeyRadius?: number;
  /** bomb_bey: explosion damage (default 200) */
  bombBeyDamage?: number;
  /** shield_bey: retaliation burst damage (default 80) */
  shieldBeyRetaliationDmg?: number;
  /** shield_bey: burst radius px (default 120) */
  shieldBeyBurstRadius?: number;
  /** turbo_bey: speed multiplier (default 1.8) */
  turboBeySpeedMult?: number;
  /** turbo_bey: spin boost fraction of maxSpin (default 0.3) */
  turboBeySpinBoost?: number;
  /** turbo_bey: duration seconds (default 5) */
  turboBeyDurationSec?: number;
  /** cannon_bey: launch force (default 3000) */
  cannonBeyForce?: number;
  /** cannon_bey: damage on impact (default 120) */
  cannonBeyDamage?: number;

  // ── Contra movement power-up config ─────────────────────────────────────
  /** speed_surge: speed multiplier (default 3.0) */
  speedSurgeSpeedMult?: number;
  /** speed_surge: duration seconds (default 2) */
  speedSurgeDurationSec?: number;
  /** gravity_flip: repulsion force from center (default 0.018) */
  gravityFlipForce?: number;
  /** gravity_flip: duration seconds (default 3) */
  gravityFlipDurationSec?: number;
  /** magnet_bey: chase force per tick (default 0.015) */
  magnetBeyChaseForce?: number;
  /** magnet_bey: duration seconds (default 2.5) */
  magnetBeyDurationSec?: number;
  /** bounce_storm: recoil multiplier on wall hit (default 3.0) */
  bounceStormRecoilMult?: number;
  /** bounce_storm: duration seconds (default 3) */
  bounceStormDurationSec?: number;
  /** freeze_step: freeze duration seconds (default 1.5) */
  freezeStepDurationSec?: number;
  /** ghost_walk: pass-through duration seconds (default 2) */
  ghostWalkDurationSec?: number;
  /** boomerang_path: orbit radius px (default 120) */
  boomerangOrbitRadius?: number;
  /** boomerang_path: orbit speed deg/sec (default 180) */
  boomerangOrbitSpeed?: number;
  /** boomerang_path: duration seconds (default 3) */
  boomerangDurationSec?: number;
  /** teleport_dash: number of blinks (default 3) */
  teleportDashCount?: number;
  /** teleport_dash: interval between blinks seconds (default 0.4) */
  teleportDashIntervalSec?: number;
  /** teleport_dash: max blink radius from current position px (default 200) */
  teleportDashRadius?: number;

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
  /** Turret is only active when this switch is on. Optional. */
  controlledBySwitchId?: string;
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
  /** Floor index this obstacle belongs to (0 = ground). Only relevant in multi-floor arenas. */
  floorIndex?: number;
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

// ─── Directional Zone (Phase ZP) ───────────────────────────────────────────
// Zone that applies a sustained directional or rotational force to beyblades.
// Covers wind corridors, tornadoes, vortices, updrafts, dust devils, and slipstreams.

export type DirectionalZoneType =
  | "wind_corridor"  // Rectangular channel of wind — constant directional push
  | "tornado"        // Rotating inward spiral — combines tangent orbit + pull toward center
  | "vortex"         // Pure inward spiral — very strong near center, ejects at rim
  | "updraft"        // Upward lift zone — reduces spin loss + cancels outward drift
  | "downdraft"      // Downward press — pins beys in place, increases spin drain
  | "slipstream"     // Drag-reducing lane — beys inside gain speed in the stream direction
  | "dust_devil";    // Small fast-spinning column — random wobble + erratic orbit

export interface DirectionalZoneConfig {
  id: string;
  type: DirectionalZoneType;
  x_cm: number;
  y_cm: number;
  /** Radius for circular zones (tornado/vortex/updraft/downdraft/dust_devil). cm. */
  radius_cm: number;
  /** Width for rectangular zones (wind_corridor/slipstream). cm. */
  width_cm?: number;
  /** Length for rectangular zones. cm. */
  length_cm?: number;
  /** Angle the zone faces in degrees. For wind_corridor this is wind direction; for tornado this is initial spin axis. */
  angleDeg?: number;
  /** Base force magnitude. Interpretation varies by type. */
  force: number;
  /** For tornado/vortex/dust_devil: rotational component multiplier (1.0 = equal tangent+radial). */
  rotationFactor?: number;
  /** For tornado/vortex: pull force at the center (N). */
  centerPullForce?: number;
  /** Direction of rotation for tornado/dust_devil: cw or ccw. */
  spinDirection?: "cw" | "ccw";
  /** For updraft: spin recovery bonus per second. */
  spinRecoveryPerSec?: number;
  /** For downdraft: extra spin drain multiplier (default 1.5). */
  spinDrainMult?: number;
  /** Zone pulses on/off — active for activeMs, paused for pauseMs. null = always on. */
  pulse?: { activeMs: number; pauseMs: number };
  /** Only active when this switch id is on. */
  controlledBySwitchId?: string;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  selfRotation?: SelfRotationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
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

// ─── Boost Pad (#24 — F-Zero GBA) ─────────────────────────────────────────
// Directional speed strip that launches beyblades along angleDeg when driven over.

export interface BoostPadConfig {
  id: string;
  /** Center X in cm from arena center. */
  x_cm: number;
  /** Center Y in cm from arena center. */
  y_cm: number;
  /** Width of the pad in cm. */
  width_cm: number;
  /** Height of the pad in cm. */
  height_cm: number;
  /** Direction of the boost force (0=right, 90=down, 180=left, 270=up). */
  angleDeg: number;
  /** Magnitude of the applied impulse force. */
  forceMagnitude: number;
  /** Cooldown per-pad in ms (default 500ms) before it can activate again for the same bey. */
  cooldownMs?: number;
  controlledBySwitchId?: string;
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
// WORLD BACKGROUND
// ============================================================================

export type ArenaWorldBackgroundFit = "cover" | "contain" | "stretch";

export interface ArenaWorldBackground {
  type: "none" | "color" | "image";
  color?: string;                    // hex color, e.g. "#1a2a3a", when type="color"
  imageUrl?: string;                 // direct URL (Firebase Storage), when type="image"
  opacity?: number;                  // 0–1, default 1.0
  fit?: ArenaWorldBackgroundFit;     // how image fills canvas: cover/contain/stretch, default "cover"
  blurPx?: number;                   // optional Gaussian blur in pixels (0 = sharp), default 0
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
// MODULAR ARENA (Phase 22)
// ============================================================================

export interface ModularSectionConfig {
  id: string;
  name: string;
  type: string;
  centerX_cm: number;
  centerY_cm: number;
  width_cm: number;
  height_cm: number;
  floorIndex: number;
}

export interface LoopTrackConfig {
  id: string;
  centerX_cm: number;
  centerY_cm: number;
  radiusCm: number;
  bankAngle: number;
  speedBoostMultiplier: number;
  floorIndex: number;
}

// ============================================================================
// PLAYER AUTHORITY (Phase 25)
// ============================================================================

export interface PlayerAuthorityConfig {
  globalMultiplier?: number;
  curvatureMultiplier?: number;
  featureOverrides?: {
    railTrack?: number;
    gravityWell?: number;
    spinZone?: number;
    pit?: number;
    bump?: number;
    obstacle?: number;
  };
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
  // Spins the arena in the XY plane (like a turntable). Pivot defaults to arena center (0,0).
  // rotationPivotX/Y shift the spin center so the arena orbits an off-center point.
  autoRotate: boolean;                           // arena rotates constantly
  rotationSpeed: number;                         // degrees per second (6 = 1 min/rev)
  rotationDirection: "clockwise" | "counterclockwise";
  rotationPivotX?: number;                       // pivot X in cm from arena center (default 0)
  rotationPivotY?: number;                       // pivot Y in cm from arena center (default 0)

  // ===== TILT (Z-axis) =====
  // Tilts the ENTIRE arena plane — distinct from bowlProfile/wallAngle (surface-local slope).
  // 0=flat, 90=wall-ride, 180=inverted/Zero-G, 270=wall-ride back, 360=flat again.
  // Physics: lateral gravity = sin(tiltAngle) × TILT_SCALE × mass toward tiltDirection.
  //
  // tiltMode controls how the tilt is driven:
  //   "fixed"     — static tiltAngle + tiltDirection (default)
  //   "oscillate" — tiltAngle rocks between tiltOscillateMin↔tiltOscillateMax on a sin wave
  //   "weight"    — direction + magnitude track beyblades' live center-of-mass offset
  //
  // Pivot: tiltPivotX/Y shift the tilt axis so one side stays high and the other dips
  // (e.g. tiltPivotX = -arenaRadius to rock the right edge down from the left edge).
  // autoTilt rotates tiltDirection at tiltSpeed °/s regardless of tiltMode.
  tiltAngle?: number;             // 0–360° current (or max for "weight") tilt angle (default 0)
  tiltDirection?: number;         // 0–360° azimuth of downhill direction (0=right, 90=down)
  tiltMode?: "fixed" | "oscillate" | "weight";
  autoTilt?: boolean;             // direction also rotates at tiltSpeed °/s
  tiltSpeed?: number;             // °/s for direction rotation (default 10)
  tiltPivotX?: number;            // pivot X in cm from arena center (default 0)
  tiltPivotY?: number;            // pivot Y in cm from arena center (default 0)
  // Oscillation params (tiltMode === "oscillate")
  tiltOscillateMin?: number;      // min tilt angle in oscillation (default 0)
  tiltOscillateMax?: number;      // max tilt angle in oscillation (default = tiltAngle)
  tiltOscillatePeriodMs?: number; // full rock cycle in ms (default 4000)
  
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
  spinZones?: SpinZoneConfig[];           // Circular zones that impart orbit or spin
  bumps?: BumpConfig[];                   // Raised features that pop beys vertically
  boostPads?: BoostPadConfig[];           // Directional speed strips (F-Zero GBA style)
  directionalZones?: DirectionalZoneConfig[]; // Wind/tornado/vortex/updraft zones (Phase ZP)

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

  // ===== WORLD BACKGROUND =====
  // What's visible behind the arena/stadium — distinct from the arena floor/theme.
  // "none" = transparent (reveals page background); "color" = solid fill; "image" = photo/art.
  worldBackground?: ArenaWorldBackground;

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

  // ===== RENDERER MODE (Phase 28) =====
  /** Which renderer to use for this arena. "2d" = flat PixiJS, "2.5d" = tilt-projected PixiJS (default), "3d" = Three.js (stub). */
  rendererMode?: "2d" | "2.5d" | "3d";

  // ===== MODULAR ARENA (Phase 22) =====
  modularSections?: ModularSectionConfig[];
  loopTracks?: LoopTrackConfig[];
  /** Maximum floors (stacked arenas) — 1 = single floor (default). */
  maxFloors?: number;
  /** Radius of the view viewport in cm; beyblades outside are culled client-side. Default 100. */
  viewportCapCm?: number;

  // ===== PLAYER AUTHORITY (Phase 25) =====
  playerAuthorityConfig?: PlayerAuthorityConfig;
  /** Max match duration in seconds. Overrides room default. Tournament rooms always use 180s. */
  maxDurationSeconds?: number;

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

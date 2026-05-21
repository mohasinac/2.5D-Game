// 2.5D Arena System Types — separate from flat 2D arenas

export type ArenaTheme = "volcano" | "mountains" | "sea" | "forest" | "stone" | "ice" | "grass" | "space" | "custom";
export type ElevationType = "flat" | "bowl" | "ramp" | "pyramid" | "custom";

export interface ElevationSegment {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
  heightMm: number;
}

export interface WallHeightSegment {
  startAngle: number;
  endAngle: number;
  heightMm: number;
}

export interface FrictionZone {
  x: number;
  y: number;
  radius: number;
  frictionMultiplier: number;
}

export interface ElevationMap {
  type: ElevationType;
  tiltAngle?: number;        // 0–30 degrees (steepness)
  tiltDirection?: number;    // 0–360 degrees (downhill direction, 0=north)
  segments?: ElevationSegment[];
}

export interface WallProfile {
  baseHeight: number;        // mm
  segments?: WallHeightSegment[];
  hasRamps?: boolean;
}

export interface SlopePhysics {
  gravityStrength: number;   // 0–1 multiplier
  frictionMap?: FrictionZone[];
}

// Re-use obstacle/turret/water/pit/portal types from game.ts for consistency
export interface ObstacleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "block" | "slope" | "moving";
  angleRad?: number;
  movementPath?: Array<{ x: number; y: number }>;
}

export interface TurretConfig {
  x: number;
  y: number;
  cooldownMs: number;
  projectileSpeed: number;
  angleRad: number;
  type: "beam" | "cannon" | "boomerang";
}

export interface WaterBodyConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  damagePerSec: number;
  slowMultiplier: number;
}

export interface PitConfig {
  x: number;
  y: number;
  radius: number;
  depth: number;
}

export interface PortalConfig {
  sourceX: number;
  sourceY: number;
  destX: number;
  destY: number;
  width: number;
  height: number;
}

export interface SpeedPathConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  speedMultiplier: number;
  rotationRad?: number;
}

export interface WallConfig {
  type: "circular" | "hexagon" | "rectangle" | "custom";
  height: number;
}

export interface ArenaSystem {
  id: string;
  displayName: string;
  description?: string;
  shape: "circle" | "hexagon" | "rectangle";
  width: number;
  height: number;
  theme: ArenaTheme;
  difficulty?: "easy" | "medium" | "hard" | "extreme";

  elevationMap: ElevationMap;
  wallProfile: WallProfile;
  slopePhysics: SlopePhysics;

  // Optional arena features (same as 2D arenas)
  obstacles?: ObstacleConfig[];
  waterBodies?: WaterBodyConfig[];
  pits?: PitConfig[];
  turrets?: TurretConfig[];
  portals?: PortalConfig[];
  speedPaths?: SpeedPathConfig[];
  wall: WallConfig;

  // Standard physics params
  gravity?: number;
  airResistance?: number;
  surfaceFriction?: number;
}

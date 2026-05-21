// 2.5D Arena System Types — server-side definition

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
  tiltAngle?: number;
  tiltDirection?: number;
  segments?: ElevationSegment[];
}

export interface WallProfile {
  baseHeight: number;
  segments?: WallHeightSegment[];
  hasRamps?: boolean;
}

export interface SlopePhysics {
  gravityStrength: number;
  frictionMap?: FrictionZone[];
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

  // Optional arena features
  obstacles?: any[];
  waterBodies?: any[];
  pits?: any[];
  turrets?: any[];
  portals?: any[];
  speedPaths?: any[];
  wall: WallConfig;

  gravity?: number;
  airResistance?: number;
  surfaceFriction?: number;
}

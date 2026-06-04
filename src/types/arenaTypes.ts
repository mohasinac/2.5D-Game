import * as THREE from 'three';

/* ── Opening shape / wall profile types ─────────────────────────────────── */
export type OpeningShape = 'circle' | 'ellipse' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
export type WallProfile  = 'parabolic' | 'straight' | 'step' | 'spiral';
export type RampMode     = 'full' | 'one-side' | 'zigzag' | 'none';

/* ── Surface material types ──────────────────────────────────────────────── */
export type SurfaceType =
  | 'plain' | 'checker' | 'grid' | 'hex' | 'stripes' | 'dots'
  | 'concrete' | 'metal' | 'wood' | 'ice' | 'sand' | 'lava_rock' | 'custom_png';

/** Physical base material — drives PBR roughness/metalness across all arena geometry. */
export type ArenaMaterial = 'abs' | 'metal' | 'stone';

export interface SurfaceMaterialOpts {
  color:           number;
  surface:         SurfaceType;
  customTileData?: string | null;
  tileScale:       number;
  transparent?:    boolean;
  opacity?:        number;
  side?:           THREE.Side;
  /** Physical base material — overrides surface-type PBR heuristics. */
  baseMaterial?:   ArenaMaterial;
}

/* ── Zone fill types ─────────────────────────────────────────────────────── */
export type ZoneFill = 'water' | 'lava' | 'swamp' | 'poison' | 'sand' | 'ice' | 'void' | 'custom';

export interface FillPreset {
  color: number; opacity: number;
  emissive: number; emissiveIntensity: number;
  glowColor: number | null;
}

export interface WaveParams {
  amplitude: number; frequency: number; speed: number; turbulence: number;
}

/* ── Shape parameter subset ──────────────────────────────────────────────── */
export interface ShapeParams {
  openingShape: OpeningShape; radiusX: number; radiusZ: number;
  sides: number; starInner: number;
}

/* ── Child hole — used to punch holes in arena bowl mesh ─────────────────── */
export interface ChildHole {
  cx: number; cz: number;   // child centre in arena geometry local space (XZ)
  rx: number; rz: number;   // shape half-radii (fallback ellipse test)
  rotY: number;              // shape self-rotation (rad)
  pts?: THREE.Vector2[];     // polygon vertices in child-local space (no rotation/translation); when present, PIP test is used
}

/* ── Island hole — cutout in moat island cap for nested arenas ───────────── */
export interface IslandHole { cx: number; cz: number; rx: number; rz: number; }

/* ── Data models ─────────────────────────────────────────────────────────── */
export interface ArenaData {
  name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  baseMaterial: ArenaMaterial;
  posX: number; posZ: number; posY: number; rotY: number;
  /* Moat */
  isMoat:             boolean;
  innerRadiusX:       number; innerRadiusZ: number;
  innerOpeningShape:  OpeningShape;
  innerSides:         number; innerStarInner: number;
  innerWallProfile:   WallProfile;
  innerRimOffset:     number;
  /* Per-edge step/spiral config */
  stepApplyToAll:     boolean;
  stepEdgeProfiles:   WallProfile[];
  stepArcDivisions:   1 | 2 | 4 | 8;
  /* Step sub-options */
  stepCount:          number;
  stepStartDepth:     number;
  stepRiserProfile:   'parabolic' | 'straight';
  rampMode:           RampMode;
  rampAngle:          number;
  rampWidth:          number;
  /* Spiral sub-options */
  spiralTurns:        number;
  spiralClockwise:    boolean;
  spiralCount:        number;
  spiralLedgeWidth:   number;
  spiralLedgeHeight:  number;
  spiralRadiusFrac:   number;
  spiralMeshes:       THREE.Mesh[];
  /* Children */
  pitIds: string[]; zoneIds: string[];
  /* Three.js */
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  floorMesh: THREE.Mesh | null;
  islandMesh: THREE.Mesh | null;
  rimSeamMesh: THREE.Mesh | null;
}

export interface PitData {
  id: string; name: string; parentArenaId: string;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posR: number; posAngle: number; rotY: number;
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  seamMesh: THREE.Mesh;
}

export interface ZoneData {
  id: string; name: string; parentArenaId: string;
  parentZoneId: string | null;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean;
  innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape;
  innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile;
  innerRimOffset: number;
  pitIds: string[]; zoneIds: string[];
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  seamMesh: THREE.Mesh;
}

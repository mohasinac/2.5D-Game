import * as THREE from 'three';

/* ── Opening shape / wall profile types ─────────────────────────────────── */
export type OpeningShape = 'circle' | 'ellipse' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
export type WallProfile  = 'parabolic' | 'straight' | 'step' | 'spiral';
export type RampMode     = 'full' | 'one-side' | 'zigzag' | 'none';

/* ── Surface material types ──────────────────────────────────────────────── */
export type SurfaceType =
  | 'plain' | 'checker' | 'grid' | 'hex' | 'stripes' | 'dots'
  | 'concrete' | 'metal' | 'wood' | 'ice' | 'sand' | 'lava_rock' | 'custom_png';

/** Physical base material — drives restitution, spin-loss and damage on impact.
 *  Valid per object: walls = rubber|stone|abs|metal  bridges = stone|abs|metal */
export type ArenaMaterial = 'rubber' | 'stone' | 'abs' | 'metal';

export interface ArenaMaterialProps {
  restitution:    number;  // 0=dead stop, 1=perfectly elastic
  spinLossFactor: number;  // fraction of bey spin lost per impact
  damageFactor:   number;  // damage multiplier to bey stamina per impact
}

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
  pitIds: string[]; zoneIds: string[]; wallIds: string[]; speedLineIds: string[];
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
  pitIds: string[]; zoneIds: string[]; speedLineIds: string[];
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  seamMesh: THREE.Mesh;
}

/* ══════════════════════════════════════════════════════════════════════════
   SPEED LINE DATA
   ══════════════════════════════════════════════════════════════════════════ */

export interface SpeedLineSegment {
  id:     string;
  length: number;   // cm — physical length of this block

  rotX:   number;   // degrees — pitch (positive = nose up)
  rotY:   number;   // degrees — yaw   (positive = turn left)
  rotZ:   number;   // degrees — roll  (banking)

  speedMult:  number;   // travel speed multiplier for this segment (0 = inherit global)

  objRotX:    number;   // degrees of object pitch added per cm of travel
  objRotY:    number;   // degrees of object yaw added per cm of travel
  objRotZ:    number;   // degrees of object roll added per cm of travel
}

export type SpeedLineEntryCondition =
  | 'always' | 'moving_only' | 'fast_only' | 'slow_only';

export type SpeedLineExitBehavior =
  | 'normal' | 'launch' | 'loop' | 'special_move';

export type SpeedLineDirection = 'forward' | 'reverse' | 'bidirectional';

export type SpeedLineHandleType = 'start' | `joint_${number}`;

export type SpeedLineTargetType =
  | 'beyblade' | 'water' | 'obstacle' | 'item' | 'any' | 'custom';

export type SpeedLineActivationMode =
  | 'always' | 'event' | 'periodic' | 'proximity';

export type SpeedLineOscAxis =
  | 'path' | 'lateral' | 'normal' | 'all';

export interface SpeedLineData {
  id:   string;
  name: string;
  parentArenaId: string;
  parentZoneId:  string | null;

  startR:     number;
  startAngle: number;
  startDir:   number;

  segments: SpeedLineSegment[];

  surfaceFollow: boolean;

  targetType:       SpeedLineTargetType;
  targetTag:        string;

  activationMode:   SpeedLineActivationMode;
  triggerEvent:     string;
  endEvent:         string;
  activeDuration:   number;
  period:           number;
  activeDuty:       number;
  activationRadius: number;
  fadeIn:           number;
  fadeOut:          number;

  oscillate:        boolean;
  oscAxis:          SpeedLineOscAxis;
  oscAmplitude:     number;
  oscFrequency:     number;
  oscPhase:         number;

  width:     number;
  color:     number;
  opacity:   number;
  glowColor: number | null;

  speedMultiplier:  number;
  entryCondition:   SpeedLineEntryCondition;
  direction:        SpeedLineDirection;
  exitBehavior:     SpeedLineExitBehavior;
  launchForce:      number;
  specialMoveName:  string;
  allowMidAirEntry: boolean;
  overridePhysics:  boolean;
  swapPriority:     number;

  totalLength: number;   // computed, not serialised

  mesh:              THREE.Mesh;
  edges:             THREE.LineSegments;
  markerMeshes:      THREE.Mesh[];
  handleMeshes:      THREE.Mesh[];
  overlapMarkers:    THREE.Mesh[];
}

/* ══════════════════════════════════════════════════════════════════════════
   WALL DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type WallTopProfile = 'flat' | 'triangles' | 'waves' | 'serrated' | 'crenellated';

export interface WallHoleData {
  id: string;
  shape: 'circle' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
  posAlong: number;   // 0–1 along the arc
  posHeight: number;  // 0–1 up the wall face
  radiusU: number;    // cm — along-arc half-size
  radiusV: number;    // cm — height half-size
}

export interface WallData {
  id: string;
  name: string;
  /** 'arena' → attaches to arena rim  'bridge' → bridge deck edge  'base' → free-standing on octagon base */
  parentId: string;
  parentType: 'arena' | 'bridge' | 'base';

  // Arc attachment (for arena / bridge parents)
  fullPerimeter: boolean;
  arcStart: number;   // degrees
  arcEnd: number;     // degrees

  // Free-standing base wall position (parentType='base' only)
  basePosX: number;   // cm world X
  basePosZ: number;   // cm world Z
  baseRotY: number;   // degrees
  baseLength: number; // cm — wall length along its own X axis

  // Height: minimum 10 cm
  height: number;
  /** Tilt angle from vertical. Negative = inward (toward arena, redirects beys back in).
   *  Positive = outward (away from arena, like a door hinge). Range [-90, +30].
   *  Forced to 0 when fullPerimeter=true AND !hasGaps (no free edge to hinge from). */
  tilt: number;

  // Gap pattern (palisade / fence)
  hasGaps: boolean;
  gapWidth: number;   // cm, min 10
  panelWidth: number; // cm, min 10

  topProfile: WallTopProfile;
  topAmplitude: number; // cm
  topFrequency: number; // peaks per metre of arc

  // /\ double-wall cross-section
  isDouble: boolean;
  peakHeight: number; // cm above attachment surface
  peakTilt: number;   // degrees — how far each half leans

  holes: WallHoleData[];

  color: number;
  surface: SurfaceType;
  /** Physics material. Walls allow: rubber|stone|abs|metal. Default: abs. */
  material: ArenaMaterial;

  mesh: THREE.Mesh | null;
  edges: THREE.LineSegments | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   BRIDGE DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type BridgeSegmentType =
  | 'straight' | 'curve' | 'ramp' | 'bezier'
  | 'loop' | 'hairpin' | 'corkscrew' | 'chicane';

export type BridgeCrossSection = 'flat' | 'u_channel';

/** Bridge-level cross-section — shared by ALL segments; never changes per segment. */
export interface BridgeSection {
  width: number;                    // cm rail-to-rail
  crossSection: BridgeCrossSection;
  depth: number;                    // cm centre dip (u_channel only)
  hasLeftWall: boolean;
  hasRightWall: boolean;
  sideWallHeight: number;           // cm
  /** Physics material. Bridges allow: stone|abs|metal. Default: abs. */
  material: ArenaMaterial;
}

export interface BridgeSegmentData {
  id: string;
  name: string;
  bridgeId: string;
  orderIndex: number;   // position in chain (0-based)

  type: BridgeSegmentType;

  // straight / ramp
  length: number;       // cm
  rampAngle: number;    // degrees — vertical rise/fall

  // curve / chicane
  curveRadius: number;  // cm
  curveAngle: number;   // degrees (total arc; hairpin always 180)
  curveDirection: 'left' | 'right';
  bankAngle: number;    // degrees — deck cant into curve

  // bezier — control points LOCAL to segment start pose (cm offsets)
  cp1X: number; cp1Y: number; cp1Z: number;
  cp2X: number; cp2Y: number; cp2Z: number;
  endX: number; endY: number; endZ: number;

  // loop
  loopRadius: number;   // cm

  // corkscrew
  corkscrewLength: number; // cm horizontal travel
  corkscrewTurns: number;  // full 360° rotations

  // Cross-section comes from BridgeData.section — NOT stored per segment.

  color: number | null;   // null = inherit from bridge
  surface: SurfaceType | null;

  mesh: THREE.Mesh | null;
  edges: THREE.LineSegments | null;
}

export type BridgeEndpointType = 'arena' | 'wall' | 'freepoint';

export interface BridgeEndpointRef {
  type: BridgeEndpointType;
  id: string;           // arena/wall id (empty for freepoint)
  angle: number;        // degrees around rim (arena/wall)
  wallHeight: number;   // 0–1 height on wall face (wall only)
  freePosX: number;     // world cm
  freePosY: number;
  freePosZ: number;
  freeDirDeg: number;   // world yaw heading degrees (freepoint)
}

export interface BridgeData {
  id: string;
  name: string;
  /** Where the first segment starts. null = floating (freepoint in startRef). */
  startRef: BridgeEndpointRef | null;
  segmentIds: string[];
  section: BridgeSection;
  color: number;
  surface: SurfaceType;
  wallIds: string[];      // child wall ids (walls on bridge deck)
  group: THREE.Group;     // Three.js container for all segment meshes
}

/* ══════════════════════════════════════════════════════════════════════════
   OBSTACLE DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type ObstacleShape = 'cube' | 'cuboid' | 'sphere' | 'cylinder' | 'pyramid' | 'frustum';
export type ObstacleTheme = 'default' | 'rock' | 'boat' | 'aircraft' | 'bird' | 'cloud';

export interface ObstacleData {
  id: string; name: string;
  shape: ObstacleShape;
  // dim semantics by shape:
  //  cube     → dimX = all sides (dimY/dimZ unused)
  //  cuboid   → dimX × dimY × dimZ
  //  sphere   → dimX = diameter
  //  cylinder → dimX = diameter, dimY = height
  //  pyramid  → dimX = base width, dimZ = base depth, dimY = height
  //  frustum  → dimX = bottom diameter, dimZ = top diameter, dimY = height
  dimX: number; dimY: number; dimZ: number;
  posX: number; posY: number; posZ: number;
  rotX: number; rotY: number; rotZ: number;
  isFloating: boolean;
  isDestructible: boolean;
  hitPoints: number;
  contactForceX: number; contactForceY: number; contactForceZ: number;
  color: number; surface: SurfaceType; tileScale: number;
  material: ArenaMaterial;
  theme: ObstacleTheme;
  speedPathId: string | null;
  mesh: THREE.Mesh; edges: THREE.LineSegments;
}

/* ══════════════════════════════════════════════════════════════════════════
   TRAP DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type TrapShape   = 'rectangle' | 'circle' | 'ellipse' | 'hexagon';
export type TrapEffect  = 'damage' | 'heal' | 'launch' | 'reverse_controls' | 'freeze' | 'buff_zone' | 'hidden_pit' | 'chomper';
export type TrapVariant = 'generic' | 'spike' | 'trampoline' | 'hammer' | 'saw' | 'buff' | 'chomper' | 'hidden_pit';

export type TrapTierEffect =
  | 'friction'
  | 'slow'
  | 'burn_damage'
  | 'chill'
  | 'freeze'
  | 'sand_pile'
  | 'custom';

export interface TrapDurationTier {
  thresholdSeconds: number;
  tierEffect: TrapTierEffect;
  rpmLossFactor: number;
  speedFactor: number;
  notes: string;
}

export interface TrapData {
  id: string; name: string;
  parentId: string;
  parentType: 'arena' | 'base';
  shape: TrapShape;
  dimX: number; dimZ: number;
  rotY: number;
  posR: number; posAngle: number;
  basePosX: number; basePosZ: number;
  effect: TrapEffect;
  variant: TrapVariant;
  forceX: number; forceY: number; forceZ: number;
  damageFactor: number;
  healFactor: number;
  freezeDuration: number;
  buffSurface: SurfaceType | null;
  pitShape: OpeningShape; pitRadiusX: number; pitRadiusZ: number; pitDepth: number;
  pitSides: number; pitStarInner: number;
  isPeriodic: boolean;
  safeInterval: number;
  unsafeInterval: number;
  activationLimit: number;
  speedPathId: string | null;
  durationTiers: TrapDurationTier[];
  color: number; surface: SurfaceType; tileScale: number;
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  variantMesh: THREE.Mesh | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   PORTAL DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type PortalDestType = 'portal' | 'random_arena' | 'world_point';

/* ══════════════════════════════════════════════════════════════════════════
   ROTATION DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type RotationMode     = 'continuous' | 'oscillate';
export type RotationNodeType = 'trap' | 'obstacle' | 'zone' | 'wall';

export interface BridgeSnapRule {
  id:       string;
  bridgeId: string;
  minDeg:   number;
  maxDeg:   number;
}

export interface RotationData {
  id:          string;
  name:        string;
  memberIds:   string[];
  memberTypes: RotationNodeType[];

  pivotX: number;
  pivotY: number;
  pivotZ: number;

  mode:      RotationMode;
  speed:     number;
  direction: 1 | -1;

  oscAmplitude: number;
  oscFrequency: number;
  oscPhase:     number;

  enabled:      boolean;
  currentAngle: number;          // runtime — not saved
  snapRules:    BridgeSnapRule[];

  pivotGroup: THREE.Group | null; // runtime — not saved
}

export interface PortalData {
  id: string; name: string;
  parentId: string;
  parentType: 'arena' | 'base';
  shape: TrapShape;
  dimX: number; dimZ: number;
  rotY: number;
  posR: number; posAngle: number;
  basePosX: number; basePosZ: number;
  destType: PortalDestType;
  destPortalId: string | null;
  destArenaId:  string | null;
  destPosX: number; destPosY: number; destPosZ: number;
  exitVelScale: number;
  exitRotY: number;
  isBidirectional: boolean;
  color: number;
  glowColor: number;
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  ringMesh: THREE.Mesh | null;
}

import * as THREE from 'three';
export type {
  PresentConfig, ParticlePreset, ParticleConfig, ParticleSystem,
  WeatherPreset, WeatherSystem,
  BaseStatModifiers,
} from './sharedTypes';
export { defaultPresentConfig, defaultParticleConfig, defaultBaseStatModifiers, combineStatMods } from './sharedTypes';
import type { ParticlePreset, ParticleConfig, ParticleSystem, WeatherPreset, WeatherSystem, BaseStatModifiers } from './sharedTypes';

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
  /** Render slightly behind coplanar surfaces (use for top-face to prevent z-fighting with arena rims). */
  polygonOffset?:  boolean;
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

/* ══════════════════════════════════════════════════════════════════════════
   ARENA ENVIRONMENT — schedule / physics / scoring
   ══════════════════════════════════════════════════════════════════════════ */

export type EnvProperty =
  | 'gravityScale' | 'gravityDirectionX' | 'gravityDirectionZ'
  | 'tiltX' | 'tiltZ'
  | 'fogDensity'
  | 'weatherPreset' | 'windEnabled' | 'windDirectionDeg'
  | 'windStrengthCms' | 'windGustInterval' | 'windGustMult'
  | 'scoreMultiplier' | 'pointsPerSecond';

export interface EnvKeyframe {
  property: EnvProperty;
  value:    number | string | boolean;
}

export interface EnvScheduleEntry {
  id:          string;
  label:       string;
  triggerType: 'interval' | 'once' | 'event';
  intervalSec: number;     // seconds between firings (interval) / cooldown (event)
  delaySec:    number;     // initial delay before first fire
  eventName:   string;     // event name matched by triggerEvent() (event mode)
  keyframes:   EnvKeyframe[];
  revertSec:   number;     // 0 = permanent; >0 = auto-revert after N seconds
  soundEvent:  string;     // named sound event dispatched on fire ('' = none)
  enabled:     boolean;
  // runtime only — stripped from save:
  _timer?:       number;
  _revertTimer?: number;
  _prevValues?:  EnvKeyframe[];
}

export type EnvScheduleSave = Omit<EnvScheduleEntry, '_timer' | '_revertTimer' | '_prevValues'>;

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
  /* Step sub-options (outer bowl / non-moat) */
  stepCount:          number;
  stepStartDepth:     number;
  stepRiserProfile:   'parabolic' | 'straight';
  rampMode:           RampMode;
  rampAngle:          number;
  rampWidth:          number;
  /* Moat inner-wall step sub-options (separate from outer; max = (depth+innerRimOffset)/10) */
  innerStepCount:         number;
  innerStepStartDepth:    number;
  innerStepRiserProfile:  'parabolic' | 'straight';
  innerRampMode:          RampMode;
  innerRampAngle:         number;
  innerRampWidth:         number;
  /* Spiral sub-options */
  spiralTurns:        number;
  spiralClockwise:    boolean;
  spiralCount:        number;
  spiralLedgeWidth:   number;
  spiralLedgeHeight:  number;
  spiralRadiusFrac:   number;
  spiralMeshes:       THREE.Mesh[];
  /* Moat inner-wall spiral sub-options */
  innerSpiralTurns:        number;
  innerSpiralClockwise:    boolean;
  innerSpiralCount:        number;
  innerSpiralLedgeWidth:   number;
  innerSpiralLedgeHeight:  number;
  innerSpiralRadiusFrac:   number;
  /* Steps / spiral appearance overrides */
  stepsColor: number | null;
  stepsSurface: SurfaceType | null;
  stepsCustomTileData: string | null;
  spiralColor: number | null;
  spiralSurface: SurfaceType | null;
  spiralCustomTileData: string | null;
  /* Per-arena lighting */
  lightColor: number;
  lightIntensity: number;
  lightPosY: number;
  lightRange: number;
  /* Particle VFX */
  particlePreset: ParticlePreset;
  /* Weather system */
  weatherPreset:    WeatherPreset;
  windEnabled:      boolean;
  windDirectionDeg: number;
  windStrengthCms:  number;
  windGustInterval: number;
  windGustMult:     number;
  /* Presentation STL overlay */
  presentStlb64: string | null;
  presentColor: number;
  /* Children */
  pitIds: string[]; zoneIds: string[]; wallIds: string[]; speedLineIds: string[];
  /* Three.js — runtime only */
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  floorMesh: THREE.Mesh | null;
  islandMesh: THREE.Mesh | null;
  rimSeamMesh: THREE.Mesh | null;
  light: THREE.PointLight | null;
  particleSystem: ParticleSystem | null;
  weatherSystem:  WeatherSystem | null;
  /* ── Environment / Physics ──────────────────────────────────────────── */
  gravityScale:          number;
  gravityDirectionX:     number;
  gravityDirectionZ:     number;
  /* ── Arena tilt ─────────────────────────────────────────────────────── */
  tiltX:                 number;
  tiltZ:                 number;
  weightTiltEnabled:     boolean;
  weightTiltSensitivity: number;
  weightTiltDampening:   number;
  /* ── Atmosphere ─────────────────────────────────────────────────────── */
  fogDensity:            number;
  /* ── Scoring ────────────────────────────────────────────────────────── */
  scoreMultiplier:       number;
  pointsPerSecond:       number;
  /* ── Weather → surface change map ───────────────────────────────────── */
  weatherSurfaceMap:     Partial<Record<WeatherPreset, SurfaceType>>;
  /* ── Environment schedule ───────────────────────────────────────────── */
  envSchedule:           EnvScheduleEntry[];
  /* ── Runtime only (not saved) ───────────────────────────────────────── */
  tiltGroup?:            THREE.Group;
  fogSystem?:            ParticleSystem | null;
  _score:                number;
  _envTriggerCooldown?:  number;
}

export interface PitData {
  id: string; name: string; parentArenaId: string;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  rimGlowColor: number;
  rimGlowIntensity: number;
  posR: number; posAngle: number; rotY: number;
  particleConfig: ParticleConfig;
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  seamMesh: THREE.Mesh;
  particleSystem: ParticleSystem | null;
}

export interface ZoneData {
  id: string; name: string; parentArenaId: string;
  parentZoneId: string | null;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number;
  sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number;
  seamGlowColor: number;
  seamGlowIntensity: number;
  particlePreset: ParticlePreset;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean;
  innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape;
  innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile;
  innerRimOffset: number;
  /* Moat inner-wall step sub-options */
  innerStepCount: number; innerStepStartDepth: number;
  innerStepRiserProfile: 'parabolic' | 'straight';
  innerRampMode: RampMode; innerRampAngle: number; innerRampWidth: number;
  /* Moat inner-wall spiral sub-options */
  innerSpiralTurns: number; innerSpiralClockwise: boolean; innerSpiralCount: number;
  innerSpiralLedgeWidth: number; innerSpiralLedgeHeight: number; innerSpiralRadiusFrac: number;
  pitIds: string[]; zoneIds: string[]; speedLineIds: string[];
  mesh: THREE.Mesh; edges: THREE.LineSegments;
  seamMesh: THREE.Mesh;
  particleSystem: ParticleSystem | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   SPEED LINE DATA
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Preset shape types ──────────────────────────────────────────────────── */
export type SpeedLinePresetType =
  | 'custom'
  | 'circle' | 'ellipse'
  | 'polygon'
  | 'triangle'
  | 'star'
  | 'flower'
  | 'spiral_in'
  | 'spiral_out'
  | 'helix'
  | 'zigzag'
  | 'wave'
  | 'snake'
  | 'figure_8'
  | 'lemniscate'
  | 'trefoil'
  | 'cardioid'
  | 'epicycloid'
  | 'hypocycloid'
  | 'astroid'
  | 'rose_curve'
  | 'damped_wave'
  | 'growing_wave'
  | 'cosine_wave'
  | 'point_zone'
  | 'jump';

/* ── Modulation waveform ─────────────────────────────────────────────────── */
export type SpeedLineModWaveform =
  | 'sine' | 'cosine' | 'triangle' | 'sawtooth' | 'inverse_sawtooth'
  | 'square' | 'pulse' | 'exp_rise' | 'exp_decay'
  | 'damped_sine' | 'growing_sine';

export type SpeedLineModType = 'none' | 'radial_scale' | 'angle_drift' | 'xyz_shift';

export interface SpeedLinePresetModulation {
  type:        SpeedLineModType;
  amplitude:   number;
  periodSteps: number;
  waveform:    SpeedLineModWaveform;
  modPhase:    number;    // degrees 0–360
  pulseWidth:  number;    // fraction 0.1–0.9; only used when waveform='pulse'
}

/* ── Preset parameters ───────────────────────────────────────────────────── */
export interface SpeedLinePresetParams {
  radiusX:      number;
  radiusZ:      number;
  sides:        number;
  petals:       number;
  turns:        number;
  steps:        number;
  centerX:      number;
  centerZ:      number;
  rotationY:    number;
  heightDelta:  number;
  closeLoop:    boolean;
  innerRadius:  number;
  pitchPerTurn: number;
  loopGap:      number;
  radiusEasing: 'linear' | 'ease_in' | 'ease_out' | 'ease_inout';
  arcFraction:  number;
  modulation:   SpeedLinePresetModulation;
  // ── Section system (replaces parallel arrays) ──────────────────────────
  sections:     SpeedLineSection[];   // [] = single uniform section
  // ── 3D shape positioning ───────────────────────────────────────────────
  centerY:      number;   // cm — base Y above surface projection
  startPosX:    number;   // 0 = auto from sampler
  startPosZ:    number;
  startPosY:    number;   // 0 = surface-project naturally
  endPosX:      number;
  endPosZ:      number;
  endPosY:      number;
  // ── Jump preset fields (only when presetType === 'jump') ───────────────
  jumpDstMode?:        JumpEndpointMode;
  jumpDstParentType?:  JumpLinkParentType;
  jumpDstParentId?:    string;
  jumpDstLocalX?:      number;
  jumpDstLocalZ?:      number;
  jumpDstWorldX?:      number;
  jumpDstWorldY?:      number;
  jumpDstWorldZ?:      number;
  jumpDstSpeedLineId?: string | null;
  jumpDstAtStart?:     boolean;
  jumpArcProfile?:     JumpArcProfile;
  jumpArcHeight?:      number;
  jumpDiscRadius?:     number;
  jumpFlight?:         JumpFlightConfig;
}

/* ── Speed ramp ──────────────────────────────────────────────────────────── */
export type SpeedLineRampProfile =
  | 'constant' | 'accelerate' | 'decelerate' | 'bell' | 'inverse_bell';

export interface SpeedLineRamp {
  profile:    SpeedLineRampProfile;
  speedMin:   number;
  speedMax:   number;
  entrySteps: number;
  exitSteps:  number;
}

/* ── Base condition / eject / targeting ──────────────────────────────────── */
export type SpeedLineBaseCondition = 'none' | 'always' | 'game_phase';

export type SpeedLineEjectBehavior = 'toward_center' | 'forward' | 'backward' | 'launch';

export type SpeedLineTargetSelectionMode = 'at_entrance' | 'dynamic';

/* ── Stat modifiers ──────────────────────────────────────────────────────── */
export interface SpeedLineStatModifiers extends BaseStatModifiers {
  /** Tilt applied to the beyblade (degrees). Positive = toward arena center. Default 0. */
  tiltAngleDeg:      number;
  /** If true, tilt direction reverses for opposite spin direction. */
  tiltSpinSensitive: boolean;
  /** When the tilt is applied relative to path travel. */
  tiltApplyPhase:    'entry' | 'exit' | 'continuous';
}

/* ── Section — self-contained arc/side with per-property overrides ─────────
   null on any property = inherit the global SpeedLineData value live.
   ──────────────────────────────────────────────────────────────────────── */
export interface SpeedLineSection {
  angleDeg:        number;
  yOffset:         number;
  maxStayDuration: number;
  statModifiers:   SpeedLineStatModifiers | null;
  surfaceFollow:   boolean | null;
  entryCondition:  SpeedLineEntryCondition | null;
  exitBehavior:    SpeedLineExitBehavior | null;
  color:           number | null;
  opacity:         number | null;
  speedMult:       number | null;
  activationMode:  SpeedLineActivationMode | null;
}

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

  maxStayDuration?: number;   // seconds; 0 = unlimited (undefined treated as 0)
  statModifiers?:   SpeedLineStatModifiers | null;   // null/undefined = inherit global SpeedLineData.statModifiers
  sectionIndex?:    number;   // which SpeedLineSection this belongs to (-1 = no section)
}

export type SpeedLineEntryCondition =
  | 'always' | 'moving_only' | 'fast_only' | 'slow_only';

export type SpeedLineExitBehavior =
  | 'normal' | 'launch' | 'loop' | 'special_move' | 'jump_link';

export type SpeedLineDirection = 'forward' | 'reverse' | 'bidirectional';

export type SpeedLineHandleType = 'start' | `joint_${number}`;

export type SpeedLineTargetType =
  | 'beyblade' | 'water' | 'obstacle' | 'item' | 'any' | 'custom'
  | 'nearest_opponent' | 'nearest_obstacle' | 'on_path_obstacle'
  | 'linked_bridge' | 'linked_trap';

export type SpeedLineActivationMode =
  | 'always' | 'event' | 'periodic' | 'proximity';

export type SpeedLineOscAxis =
  | 'path' | 'lateral' | 'normal' | 'all';

export interface SpeedLineData {
  id:   string;
  name: string;
  parentArenaId: string;
  parentZoneId:  string | null;

  /** Non-null = this SL is structurally linked to a bridge (created by / associated with). */
  linkedBridgeId: string | null;
  /** Non-null = this SL is structurally linked to a trap plate. */
  linkedTrapId:   string | null;
  /** false = ribbon hidden and physics inactive. */
  enabled:        boolean;

  /** Used when targetType = 'linked_bridge': activates when bey is on this bridge. */
  targetBridgeId: string | null;
  /** Used when targetType = 'linked_trap': activates when bey is on this trap. */
  targetTrapId:   string | null;

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
  customTileData: string | null;
  tileScale: number;
  presentStlb64: string | null;
  presentColor: number;

  speedMultiplier:  number;
  entryCondition:   SpeedLineEntryCondition;
  direction:        SpeedLineDirection;
  exitBehavior:     SpeedLineExitBehavior;
  launchForce:      number;
  specialMoveName:  string;
  jumpLinkId:       string | null;   // used when exitBehavior === 'jump_link'
  allowMidAirEntry: boolean;
  overridePhysics:  boolean;
  swapPriority:     number;

  totalLength: number;   // computed, not serialised

  /* ── Preset system ─────────────────────────────────────────────────────── */
  presetType:   SpeedLinePresetType;
  presetParams: SpeedLinePresetParams;
  speedRamp:    SpeedLineRamp;

  /* ── Surface projection ────────────────────────────────────────────────── */
  surfaceOffset:       number;    // cm above projected surface
  surfaceOrientObject: boolean;
  airNormalMode:       'upright' | 'lean_center' | 'lean_curvature';
  airNormalTiltDeg:    number;
  pointNormals:        THREE.Vector3[];   // runtime-only; populated by buildSpeedLineObjects

  /* ── Conditions, ejection, targeting ──────────────────────────────────── */
  baseCondition:            SpeedLineBaseCondition;
  conditionPhase:           'pre_battle' | 'battle' | 'sudden_death' | 'any';
  ejectBehavior:            SpeedLineEjectBehavior;
  targetSelectionMode:      SpeedLineTargetSelectionMode;
  conditionCheckIntervalMs: number;

  /* ── Stat modifiers ────────────────────────────────────────────────────── */
  statModifiers: SpeedLineStatModifiers;

  /** Hidden from view; path physics still active. Default true. */
  visible: boolean;

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
  /** 'arena' → attaches to arena rim  'bridge' → bridge deck edge  'base' → free-standing on octagon base  'trap' → sits on top of a trap plate */
  parentId: string;
  parentType: 'arena' | 'bridge' | 'base' | 'trap';

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

  /** Wall cross-section thickness in cm. Min 0.1. Default 2. Adds inner face + top face. */
  thickness: number;
  /** Which side of the rim the wall mass extends toward. 'outward' = away from arena (default). */
  thicknessDirection: 'inward' | 'outward';

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

  // Destructibility
  isDestructible: boolean;
  hitPoints: number;

  // Adjacent wall auto-join: suppresses end-cap faces at shared arc boundaries
  autoJoin: boolean;

  // Moat ring selection (arena parentType + isMoat only)
  moatRing: 'outer' | 'inner';

  // Wall auto-rotation on arena rim
  rotateOnArena: boolean;
  arenaRotateMode: 'continuous' | 'step' | 'oscillate';
  arenaRotateSpeed: number;          // deg/s (continuous)
  arenaRotateStepDeg: number;        // degrees per step
  arenaRotateStepInterval: number;   // seconds between steps
  arenaRotateOscAmp: number;         // half-swing degrees (oscillate)
  arenaRotateOscFreq: number;        // Hz (oscillate)

  color: number;
  surface: SurfaceType;
  customTileData: string | null;
  tileScale: number;
  emissiveColor: number;
  emissiveIntensity: number;
  opacity: number;
  /** Physics material. Walls allow: rubber|stone|abs|metal. Default: abs. */
  material: ArenaMaterial;
  presentStlb64: string | null;
  presentColor: number;

  /** Hidden from view; geometry/physics still present. Default true. */
  visible: boolean;

  mesh: THREE.Mesh | null;
  edges: THREE.LineSegments | null;

  // Runtime-only: pivot group for arena auto-rotation (not saved)
  _rotatePivot?: THREE.Group;
  _arenaRotateTimer?: number;
}

/* ══════════════════════════════════════════════════════════════════════════
   BRIDGE DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type BridgeSegmentType =
  | 'straight' | 'curve' | 'ramp' | 'bezier'
  | 'loop' | 'return_loop' | 'exit_loop'
  | 'hairpin' | 'corkscrew' | 'chicane';

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
  color: number;
  surface: SurfaceType;
  customTileData: string | null;
  tileScale: number;
  emissiveColor: number;
  emissiveIntensity: number;
  opacity: number;
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
  loopRadius: number;         // cm
  loopOrientation: 'vertical' | 'horizontal';  // vertical = Hot Wheels ring; horizontal = flat spiral

  // tilt / roll — applied to all segment types
  // Rotates the cross-section around the forward direction before the path is sampled.
  // 0 = upright; 90 = rolled 90° (loop becomes horizontal if it was vertical, etc.)
  tiltAngle: number;  // degrees

  // corkscrew
  corkscrewLength: number; // cm horizontal travel
  corkscrewTurns: number;  // full 360° rotations

  // Cross-section comes from BridgeData.section — NOT stored per segment.

  color: number | null;   // null = inherit from bridge
  surface: SurfaceType | null;

  // Tick-based animation — segment jumps to offset then returns
  animEnabled:    boolean;
  animOffsetX:    number;   // cm, bridge-group local
  animOffsetY:    number;
  animOffsetZ:    number;
  animRotX:       number;   // degrees, around pivot X
  animRotY:       number;
  animRotZ:       number;
  animStartMs:    number;   // delay before first cycle (ms)
  animIntervalMs: number;   // full cycle period (ms)
  animHoldMs:     number;   // time in offset state per cycle (ms)
  // Runtime-only (not serialized):
  _animTimer:  number;
  _animCenter: THREE.Vector3;
  _animPivot:  THREE.Group | null;

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
  presentStlb64: string | null;
  presentColor: number;
  wallIds: string[];      // child wall ids (walls on bridge deck)
  group: THREE.Group;     // Three.js container for all segment meshes
  /** ID of an existing arena-level SpeedLineData linked to this bridge. */
  linkedSpeedLineId: string | null;
  /** Hidden from view; segment physics still active. Default true. */
  visible: boolean;
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
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number;
  emissiveIntensity: number;
  opacity: number;
  material: ArenaMaterial;
  theme: ObstacleTheme;
  speedPathId: string | null;
  presentStlb64: string | null;
  presentColor: number;
  weight: number;   // g
  /** Hidden from view; collision/physics still active. Default true. */
  visible: boolean;
  mesh: THREE.Mesh; edges: THREE.LineSegments;
}

/* ══════════════════════════════════════════════════════════════════════════
   TRAP DATA
   ══════════════════════════════════════════════════════════════════════════ */

export type TrapShape   = 'rectangle' | 'circle' | 'ellipse' | 'hexagon';
export type TrapEffect  = 'damage' | 'heal' | 'launch' | 'reverse_controls' | 'freeze' | 'buff_zone' | 'hidden_pit' | 'chomper' | 'gravity_pull' | 'earthquake' | 'rpm' | 'projectile';
export type TrapVariant = 'generic' | 'spike' | 'trampoline' | 'hammer' | 'saw' | 'buff' | 'chomper' | 'hidden_pit' | 'gravity_pull' | 'earthquake' | 'rpm' | 'projectile';

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
  /** ID of an existing arena-level SpeedLineData linked to this trap. */
  linkedSpeedLineId: string | null;
  durationTiers: TrapDurationTier[];

  /* ── Gravity pull effect parameters ─────────────────────────────────── */
  gravityRange:         number;
  gravityStrength:      number;
  gravityMode:          'continuous' | 'pulse' | 'conditional';
  gravityPulseInterval: number;
  gravityPulseWidth:    number;

  /* ── Earthquake effect parameters ────────────────────────────────────── */
  eqRingCount:       number;
  eqSegmentsPerRing: number;
  eqMaxElevationCm:  number;
  eqElevationMode:   'random' | 'wave' | 'ripple' | 'checkerboard';
  eqRingRanges:      number[];  // per-ring amplitude multiplier [0..1], length = eqRingCount
  eqPermanent:       boolean;   // if true, stays elevated after first trigger
  eqFadeCycles:      number;    // fade after this many cycles (0 = use eqPermanent)
  eqPulseMode:       'triggered' | 'continuous' | 'periodic';
  eqPulseIntervalMs: number;
  eqPulseWidthMs:    number;
  // Runtime-only (not saved):
  _eqTimer?:          number;
  _eqCycleCount?:     number;
  _eqTargetHeights?:  number[];
  _eqCurrentHeights?: number[];
  _eqPhase?:          'idle' | 'rising' | 'active' | 'fading';

  /* ── RPM effect parameters ────────────────────────────────────────────── */
  rpmSpeed:          number;   // deg/s; positive = CCW viewed from above
  rpmEffect:         'carry' | 'tangential' | 'centripetal' | 'centrifugal' | 'spin_boost' | 'spin_drain' | 'gyroscopic' | 'full';
  rpmRange:          number;   // cm; 0 = use dimX/2
  rpmMatchSpin:      boolean;  // true = direction matches beyblade spin
  rpmForceScale:     number;
  rpmPulseMode:      'triggered' | 'continuous' | 'periodic';
  rpmPulseIntervalMs: number;
  rpmPulseWidthMs:    number;
  // Runtime-only (not saved):
  _rpmCurrentAngle?: number;
  _rpmTimer?:        number;
  _rpmActive?:       boolean;

  /* ── Projectile effect parameters ────────────────────────────────────── */
  projLaunchMode:      'single' | 'spread' | 'burst' | 'continuous' | 'pattern';
  projCount:           number;
  projSpreadAngleDeg:  number;
  projBurstCount:      number;
  projBurstDelayMs:    number;
  projLaunchDelayMs:   number;
  projLaunchAngleDeg:  number;
  projRandomizeAngle:  boolean;
  projPattern:         'ring' | 'spiral' | 'fan' | 'line' | 'random';
  projPatternCount:    number;
  projConfig:          ProjectileConfig;
  projPulseMode:       'triggered' | 'periodic' | 'continuous';
  projPulseIntervalMs: number;
  projPlateSpin:       number;   // deg/s — trap plate self-rotation (+ = CCW, 0 = off)

  baseMaterial: ArenaMaterial;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number;
  emissiveIntensity: number;
  presentStlb64: string | null;
  presentColor: number;
  /* ── Environment trigger ────────────────────────────────────────────── */
  envTriggerEvent:  string;   // event name dispatched on trap activation ('' = none)
  envTargetArenaId: string;   // target arena ('' = parent arena of the trap)

  /** Hidden from view; trigger logic still fires when bey overlaps. Default true. */
  visible: boolean;

  mesh: THREE.Mesh; edges: THREE.LineSegments;
  variantMesh: THREE.Mesh | null;
  /** Runtime-only pulse timer — not saved. */
  _gravityTimer?: number;
  /** Runtime-only tick behavior sub-object — not saved. Set in buildGeometry, disposed in disposeOne. */
  _tickBehavior?: import('../features/managers/sub/TrapTickBehavior').TrapTickBehavior;
}

/* ══════════════════════════════════════════════════════════════════════════
   PROJECTILE CONFIG
   ══════════════════════════════════════════════════════════════════════════ */

export interface ProjectileConfig {
  shape: 'sphere' | 'cube' | 'cylinder' | 'cone' | 'diamond' | 'custom_stl';
  dimX: number; dimY: number; dimZ: number;
  presentStlb64:      string | null;
  color:              number;
  emissiveColor:      number;
  emissiveIntensity:  number;
  /** Center-of-mass orientation offset (degrees). */
  rotOffsetX: number; rotOffsetY: number; rotOffsetZ: number;
  /** In-flight spin rates (deg/s). */
  spinX: number; spinY: number; spinZ: number;
  speed:       number;   // cm/s
  isAirborne:  boolean;
  arcHeight:   number;   // cm peak height above launch Y (airborne only)
  lifetimeMs:  number;
  targetMode: 'random_dir' | 'nearest_beyblade' | 'all_beyblades' | 'nearest_obstacle' | 'follow_speed_line';
  targetSpeedLineId: string | null;
  returnToTrap:   boolean;
  returnAfterMs:  number;
  hitEffect:    'damage' | 'buff' | 'debuff' | 'push' | 'teleport' | 'stun' | 'custom_event';
  hitStrength:  number;
  hitDurationMs: number;
  hitEventName:  string;
  hitRadius:     number;   // cm
  /** Scale */
  scaleFactor:    number;   // uniform mesh scale multiplier (default 1.0)
  scaleRandomize: boolean;  // pick a random scale in [scaleMin, scaleMax] per bullet
  scaleMin:       number;   // minimum random scale (default 0.5)
  scaleMax:       number;   // maximum random scale (default 2.0)
  /** Orbit — bullets circle the source center instead of flying away. */
  orbitSource:    boolean;
  orbitRadius:    number;   // cm
  orbitSpeed:     number;   // deg/s, + = CCW from above
  orbitElevation: number;   // cm above launch Y
  /** Homing (data flag — not simulated in builder, applied in game simulation). */
  homingEnabled:  boolean;
  homingStrength: number;   // 0–10 turn rate
  weight: number;   // g
}

export function defaultProjectileConfig(): ProjectileConfig {
  return {
    shape: 'sphere', dimX: 5, dimY: 5, dimZ: 5,
    presentStlb64: null, color: 0xff4400,
    emissiveColor: 0xff2200, emissiveIntensity: 0.5,
    rotOffsetX: 0, rotOffsetY: 0, rotOffsetZ: 0,
    spinX: 0, spinY: 360, spinZ: 0,
    speed: 100, isAirborne: false, arcHeight: 10, lifetimeMs: 3000,
    targetMode: 'nearest_beyblade', targetSpeedLineId: null,
    returnToTrap: false, returnAfterMs: 1500,
    hitEffect: 'damage', hitStrength: 1.0, hitDurationMs: 500,
    hitEventName: '', hitRadius: 8,
    scaleFactor: 1.0, scaleRandomize: false, scaleMin: 0.5, scaleMax: 2.0,
    orbitSource: false, orbitRadius: 10, orbitSpeed: 180, orbitElevation: 2,
    homingEnabled: false, homingStrength: 2.0,
    weight: 5,
  };
}

/**
 * Generic launch descriptor for `BulletManager.launch()`.
 * Decoupled from TrapData — any system (trap, beyblade, zone, arena) can launch bullets.
 */
export interface BulletLaunchRequest {
  sourceId:       string;
  center:         THREE.Vector3;   // world-space origin of the source
  config:         ProjectileConfig;
  mode:           'single' | 'spread' | 'burst' | 'pattern' | 'continuous';
  count:          number;
  spreadAngleDeg: number;
  patternCount:   number;
  dirAngle:       number;          // launch direction in degrees
}

/** Runtime-only bullet instance — never serialized. */
export interface ProjectileBullet {
  id:                   string;
  sourceId:             string;
  config:               ProjectileConfig;  // snapshot at spawn time
  mesh:                 THREE.Mesh;
  pos:                  THREE.Vector3;
  vel:                  THREE.Vector3;
  startPos:             THREE.Vector3;
  age:                  number;   // ms
  returning:            boolean;
  followSpeedLineIndex: number;
  orbitAngle:           number;   // radians; used when config.orbitSource = true
  orbitCenterX:         number;
  orbitCenterZ:         number;
  orbitBaseY:           number;
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
  /** Hidden from view; members still rotate. Default true. */
  visible: boolean;
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
  surface: SurfaceType;
  customTileData: string | null;
  tileScale: number;
  presentStlb64: string | null;
  presentColor: number;
  /** Hidden from view; teleport logic still active. Default true. */
  visible: boolean;
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  ringMesh: THREE.Mesh | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   JUMP LINK — two-endpoint arc connector; launches bey from source to dest
   ══════════════════════════════════════════════════════════════════════════ */

export type JumpLinkParentType = 'arena' | 'obstacle' | 'base' | 'trap';
export type JumpLinkTrigger    = 'button' | 'automatic' | 'speed_line_exit' | 'proximity';
export type JumpArcProfile     = 'parabolic' | 'bezier' | 'instant';
export type JumpEndpointMode   = 'parent_surface' | 'world_point' | 'speed_line_end';

export interface JumpLinkEndpoint {
  mode:       JumpEndpointMode;
  // 'parent_surface' fields:
  parentType: JumpLinkParentType;
  parentId:   string;    // arena/obstacle/trap id, or 'octagon-base'
  localX:     number;    // cm offset from parent centre
  localZ:     number;
  // 'world_point' fields:
  worldX: number;
  worldY: number;
  worldZ: number;
  // 'speed_line_end' fields:
  speedLineId: string | null;
  atStart:     boolean;  // true = speed line start point, false = end point
}

// JumpFlightStatModifiers is identical to BaseStatModifiers — use type alias.
export type JumpFlightStatModifiers = BaseStatModifiers;

export interface JumpFlightConfig {
  // Travel time — arc is aimed at predicted dst position at t=arcDuration ms
  arcDuration:    number;   // ms; default 800
  // Launch physics
  launchAngleDeg: number;   // 0 = horizontal, 90 = straight up; default 45
  launchForce:    number;   // cm/s initial velocity magnitude; default 300
  gravityScale:   number;   // 1.0 = normal; default 1.0
  airDrag:        number;   // 0–1 damping per physics tick; default 0.02
  // Landing (applied on arrival, independent of exact landing spot)
  landingImpact:  number;   // 0 = soft, 1 = heavy pulse; default 0.3
  landingBounce:  number;   // restitution (0 = stick, 1 = bounce); default 0.1
  // Spin during flight (bey is NOT on any speed line while airborne)
  spinRateMult:   number;   // multiplier on current bey spin (1.0 = unchanged); default 1.0
  spinDeltaRPM:   number;   // flat RPM change over full arcDuration (+boost / -drain); default 0
  // Stat modifiers active only while airborne
  statModifiers:  JumpFlightStatModifiers;
  // Visual trail
  trailEnabled:   boolean;
  trailColor:     number | null;  // null = inherit link color
  trailWidth:     number;         // cm; default 2
  trailFade:      number;         // 0–1 opacity at tail; default 0.1
  // Flash effects
  launchFlash:    boolean;
  landFlash:      boolean;
  flashColor:     number;         // default 0xffffff
}

export interface JumpLinkData {
  id:   string;
  name: string;
  src:  JumpLinkEndpoint;
  dst:  JumpLinkEndpoint;
  isBidirectional:    boolean;
  trigger:            JumpLinkTrigger;
  triggerSpeedLineId: string | null;
  proximityRadius:    number;
  arcProfile: JumpArcProfile;
  arcHeight:  number;   // cm — visual editor arc apex height
  flight:     JumpFlightConfig;
  // Visual disc + arc appearance
  color:      number;
  glowColor:  number | null;
  opacity:    number;
  discRadius: number;   // cm
  // Non-nullable after buildJumpLinkObjects (follow ObstacleData/PortalData pattern)
  sourceMesh:  THREE.Mesh;
  destMesh:    THREE.Mesh;
  arcLine:     THREE.Line;
  arrowMeshes: THREE.Mesh[];
}

/* ══════════════════════════════════════════════════════════════════════════
   BASE FOOTING — decorative/structural shapes on the octagon base
   ══════════════════════════════════════════════════════════════════════════ */
export interface BaseFootingData {
  id: string; name: string;
  shape: ObstacleShape;
  // same dim semantics as ObstacleData
  dimX: number; dimY: number; dimZ: number;
  basePosX: number; basePosZ: number;
  baseRotY: number;   // degrees
  posY: number;       // cm above base top face (default 0)
  color: number;
  surface: SurfaceType;
  customTileData: string | null;
  tileScale: number;
  emissiveColor: number;
  emissiveIntensity: number;
  opacity: number;
  presentStlb64: string | null;
  presentColor: number;
  /** Hidden from view. Default true. */
  visible: boolean;
  mesh: THREE.Mesh | null;
  edges: THREE.LineSegments | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   TRANSLATION — path-animation for member objects
   ══════════════════════════════════════════════════════════════════════════ */
export type TranslationLoopMode = 'once' | 'loop' | 'pingpong';
export type TranslationEasing   = 'linear' | 'ease_in' | 'ease_out' | 'smooth';

export interface TranslationWaypoint { x: number; y: number; z: number; }

export interface TranslationData {
  id:         string;
  name:       string;
  memberIds:  string[];
  waypoints:  TranslationWaypoint[];
  durationMs: number;
  loopMode:   TranslationLoopMode;
  easing:     TranslationEasing;
  enabled:    boolean;
  visible:    boolean;
  /** Runtime only — normalised time [0,1]. Not serialised. */
  _t:   number;
  /** Runtime only — direction: 1 = forward, -1 = backward (pingpong). */
  _dir: 1 | -1;
}

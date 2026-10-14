import type { ArenaConfig } from '../utils/arenaPersistence';

/** Helper for reusable SL presetParams default block */
const SL_PRESET_PARAMS = {
  radiusX: 120, radiusZ: 120, sides: 6, petals: 5, turns: 3, steps: 48,
  centerX: 0, centerZ: 0, rotationY: 0, heightDelta: 0, closeLoop: true as boolean,
  innerRadius: 42, pitchPerTurn: 0, loopGap: 0, radiusEasing: 'linear' as const,
  arcFraction: 1, centerY: 0,
  startPosX: 0, startPosY: 0, startPosZ: 0,
  endPosX: 0, endPosY: 0, endPosZ: 0,
  sections: [] as [],
  modulation: { type: 'none' as const, waveform: 'sine' as const, amplitude: 0, periodSteps: 8, modPhase: 0, pulseWidth: 0.5 },
};

const SL_DEFAULTS = {
  targetType: 'any' as const, targetTag: '',
  activationMode: 'always' as const,
  triggerEvent: '', endEvent: '', activeDuration: 1000,
  period: 2000, activeDuty: 0.5,
  activationRadius: 30, fadeIn: 200, fadeOut: 300,
  oscillate: false, oscAxis: 'path' as const,
  oscAmplitude: 5, oscFrequency: 1, oscPhase: 0,
  customTileData: null, tileScale: 20,
  presentStlb64: null, presentColor: 0xffffff,
  entryCondition: 'always' as const,
  launchForce: 1, specialMoveName: '',
  allowMidAirEntry: false, overridePhysics: false, swapPriority: 0,
  presetType: 'custom' as const,
  speedRamp: { profile: 'constant' as const, speedMin: 1.5, speedMax: 1.5, entrySteps: 0, exitSteps: 0 },
  surfaceOffset: 0.05, surfaceOrientObject: true, airNormalMode: 'lean_center' as const, airNormalTiltDeg: 10,
  baseCondition: 'none' as const, conditionPhase: 'any', ejectBehavior: 'toward_center' as const,
  targetSelectionMode: 'at_entrance' as const, conditionCheckIntervalMs: 100,
  statModifiers: { spinRateMult: 1, staminaMult: 1, attackMult: 1, defenseMult: 1, weightMult: 1, burstResistMult: 1, tiltAngleDeg: 0, tiltSpinSensitive: false, tiltApplyPhase: 'exit' as const },
} as const;

const WALL_DEFAULTS = {
  basePosX: 0, basePosZ: 0, baseRotY: 0, baseLength: 80,
  hasGaps: false, gapWidth: 10, panelWidth: 20,
  isDouble: false, peakHeight: 10, peakTilt: 20,
  holes: [] as [],
  isDestructible: false, hitPoints: 100,
  autoJoin: true,
  moatRing: 'outer' as const,
  rotateOnArena: false,
  arenaRotateMode: 'continuous' as const,
  arenaRotateSpeed: 30, arenaRotateStepDeg: 30, arenaRotateStepInterval: 1,
  arenaRotateOscAmp: 45, arenaRotateOscFreq: 0.5,
  topAmplitude: 0, topFrequency: 4,
  surface: 'plain' as const, customTileData: null as null, tileScale: 20,
  emissiveIntensity: 0, opacity: 1,
  material: 'abs' as const,
  presentStlb64: null as null, presentColor: 0xffffff,
} as const;

const TRAP_DEFAULTS = {
  rotY: 0, basePosX: 0, basePosZ: 0,
  forceX: 0, forceY: 0, forceZ: 0,
  damageFactor: 1, healFactor: 1, freezeDuration: 2,
  buffSurface: null as null,
  pitShape: 'circle' as const, pitRadiusX: 10, pitRadiusZ: 10, pitDepth: 5,
  pitSides: 6, pitStarInner: 0.5,
  isPeriodic: false, safeInterval: 2, unsafeInterval: 3,
  activationLimit: 0, speedPathId: null as null,
  durationTiers: [] as [],
  baseMaterial: 'abs' as const,
  surface: 'plain' as const, customTileData: null as null, tileScale: 20,
  emissiveColor: 0x000000, emissiveIntensity: 0,
  presentStlb64: null as null, presentColor: 0xffffff,
  walls: [] as [],
} as const;

/** Default pier section shared across all 4 piers */
const PIER_SECTION = {
  width: 6, startWidth: 6, endWidth: 6,
  crossSection: 'flat' as const, depth: 1,
  hasLeftWall: false, hasRightWall: false, sideWallHeight: 2,
  material: 'stone' as const,
  color: 0xa09070, surface: 'concrete' as const,
  customTileData: null, tileScale: 20,
  emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
};

const SEG_DEFAULTS = {
  curveRadius: 20, curveAngle: 90, curveDirection: 'left' as const, bankAngle: 0,
  cp1X: 0, cp1Y: 0, cp1Z: 0, cp2X: 0, cp2Y: 0, cp2Z: 0,
  endX: 0, endY: 0, endZ: 0,
  loopRadius: 12, loopOrientation: 'vertical' as const, tiltAngle: 0,
  corkscrewLength: 25, corkscrewTurns: 1.5,
  color: null, surface: null,
};

/** Two straight 25cm segments — pier extends 50cm from lake edge (r=75) to r=25 */
function pierSegments(segIdA: string, segIdB: string) {
  return [
    { id: segIdA, name: 'Pier Deck A', orderIndex: 0, type: 'straight' as const, length: 25, rampAngle: 0, ...SEG_DEFAULTS },
    { id: segIdB, name: 'Pier Deck B', orderIndex: 1, type: 'straight' as const, length: 25, rampAngle: 0, ...SEG_DEFAULTS },
  ];
}

/** Boat obstacle shared fields */
const BOAT_BASE = {
  shape: 'cuboid' as const,
  rotX: 0, rotZ: 0,
  isFloating: true, isDestructible: false, hitPoints: 0,
  contactForceX: 0, contactForceY: 0, contactForceZ: 0,
  surface: 'plain' as const, customTileData: null, tileScale: 20,
  emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
  material: 'stone' as const,
  speedPathId: null,
  presentStlb64: null, presentColor: 0xaaaaaa,
  weight: 0,
  visible: true,
  hideOnTrapIds: ['trap-1'],
};

/** Tower obstacle shared fields */
const TOWER_BASE = {
  shape: 'cuboid' as const,
  rotX: 0, rotZ: 0,
  isFloating: false, isDestructible: false, hitPoints: 0,
  contactForceX: 0, contactForceY: 0, contactForceZ: 0,
  surface: 'concrete' as const, customTileData: null, tileScale: 20,
  emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
  material: 'stone' as const,
  theme: 'default' as const,
  speedPathId: null,
  presentStlb64: null, presentColor: 0xaaaaaa,
  weight: 0,
  visible: true,
  hideOnTrapIds: [] as string[],
};

/**
 * Demo ArenaConfig: Black Sea Bowl — harbour-themed 3-level stepped arena.
 * Features: gravity whirlpool trap, 4 jetty piers, 8 boats (3 orbiting, 5 docking),
 * 4 city towers, crenellated perimeter wall, water zone with animated fill.
 */
export const DEMO_ARENA_CONFIG: ArenaConfig = {
  baseConfig: {
    height: 30, sides: 8, color: 0xe8dcc0, surface: 'plain',
    customTileData: null, tileScale: 20, apothem: 100,
  },
  arenaSeq: 1,
  pitSeq: 1,
  zoneSeq: 1,
  wallSeq: 1,
  bridgeSeq: 4,
  segmentSeq: 8,
  speedLineSeq: 1,
  obstacleSeq: 12,
  trapSeq: 1,
  portalSeq: 0,
  rotationSeq: 1,
  footings: [], footingSeq: 0,
  jumpLinks: [], jumpLinkSeq: 0,
  translations: [
    {
      id: 'translation-1', name: 'Large Freighter Docking',
      memberIds: ['obstacle-1'],
      waypoints: [{ x: 43.3, y: 9, z: 25.0 }, { x: 56.3, y: 9, z: 10.0 }],
      durationMs: 14000, loopMode: 'pingpong', easing: 'smooth',
      enabled: true, visible: true, pauseOnTrapIds: ['trap-1'],
    },
    {
      id: 'translation-2', name: 'Cargo Ship Docking',
      memberIds: ['obstacle-2'],
      waypoints: [{ x: -51.8, y: 9, z: -18.8 }, { x: -60.0, y: 9, z: -6.5 }],
      durationMs: 16000, loopMode: 'pingpong', easing: 'smooth',
      enabled: true, visible: true, pauseOnTrapIds: ['trap-1'],
    },
    {
      id: 'translation-3', name: 'River Vessel Docking',
      memberIds: ['obstacle-3'],
      waypoints: [{ x: -6.5, y: 9, z: 37.0 }, { x: -2.5, y: 9, z: 54.0 }],
      durationMs: 10000, loopMode: 'pingpong', easing: 'smooth',
      enabled: true, visible: true, pauseOnTrapIds: ['trap-1'],
    },
    {
      id: 'translation-4', name: 'Fishing Boat Docking',
      memberIds: ['obstacle-4'],
      waypoints: [{ x: 34.5, y: 9, z: -29.0 }, { x: 22.5, y: 9, z: -42.0 }],
      durationMs: 9000, loopMode: 'pingpong', easing: 'smooth',
      enabled: true, visible: true, pauseOnTrapIds: ['trap-1'],
    },
    {
      id: 'translation-5', name: 'Harbor Tug Docking',
      memberIds: ['obstacle-8'],
      waypoints: [{ x: -52.0, y: 9, z: 30.0 }, { x: -60.0, y: 9, z: 12.0 }],
      durationMs: 12000, loopMode: 'pingpong', easing: 'smooth',
      enabled: true, visible: true, pauseOnTrapIds: ['trap-1'],
    },
  ],
  translationSeq: 5,
  baseWalls: [],
  speedLines: [],
  portals: [],

  // ══════════════════════════════════════════════════════════════════════════
  // Arenas
  // ══════════════════════════════════════════════════════════════════════════
  arenas: [
    {
      id: 'arena-1', name: 'Black Sea Bowl',
      openingShape: 'circle', wallProfile: 'step',
      radiusX: 120, radiusZ: 120, depth: 22, sides: 6, starInner: 0.5,
      color: 0x4a8fa8, surface: 'plain', customTileData: null, tileScale: 20,
      baseMaterial: 'stone',
      posX: 0, posZ: 0, posY: 0, rotY: 0,
      isMoat: false,
      innerRadiusX: 0, innerRadiusZ: 0,
      innerOpeningShape: 'circle', innerSides: 6, innerStarInner: 0.5,
      innerWallProfile: 'parabolic', innerRimOffset: 0,
      stepCount: 4, stepStartDepth: 0, stepArcDivisions: 4,
      stepApplyToAll: false, stepEdgeProfiles: [], stepRiserProfile: 'parabolic',
      rampMode: 'none', rampAngle: 0, rampWidth: 0,
      spiralTurns: 1, spiralClockwise: true, spiralCount: 1,
      spiralLedgeWidth: 4, spiralLedgeHeight: 1, spiralRadiusFrac: 0.6,
      stepsColor: null, stepsSurface: null, stepsCustomTileData: null,
      spiralColor: null, spiralSurface: null, spiralCustomTileData: null,
      lightColor: 0x44aadd, lightIntensity: 1.3, lightPosY: 80, lightRange: 300,
      particlePreset: 'none',
      gravityScale: 1.0, fogDensity: 3, scoreMultiplier: 1.5, pointsPerSecond: 8,
      weatherSurfaceMap: {}, envSchedule: [],
      presentStlb64: null, presentColor: 0xffffff,
      pits: [
        {
          id: 'pit-1', name: 'Whirlpool Eye',
          openingShape: 'circle',
          radiusX: 5, radiusZ: 5, depth: 10, sides: 6, starInner: 0.5,
          color: 0x041520, surface: 'plain', customTileData: null, tileScale: 20,
          rimGlowColor: 0x0044aa, rimGlowIntensity: 0.6,
          posR: 0, posAngle: 0, rotY: 0,
        },
      ],
      zones: [
        {
          id: 'zone-1', name: 'Black Sea',
          openingShape: 'circle', parentZoneId: null,
          radiusX: 75, radiusZ: 75, depth: 6, sides: 6, starInner: 0.5,
          color: 0x1a5a80, surface: 'plain', customTileData: null, tileScale: 20,
          fill: 'water', fillColor: null, fillOpacity: 0.88,
          seamGlowColor: 0x00aaff, seamGlowIntensity: 0.5,
          particlePreset: 'none',
          posR: 0, posAngle: 0, rotY: 0,
          isMoat: false, innerRadiusX: 10, innerRadiusZ: 10,
          innerOpeningShape: 'circle', innerSides: 6, innerStarInner: 0.5,
          innerWallProfile: 'parabolic', innerRimOffset: 0,
          pits: [], zones: [],
        },
      ],
      walls: [
        {
          id: 'wall-1', name: 'City Perimeter',
          parentId: 'arena-1', parentType: 'arena',
          fullPerimeter: true, arcStart: 0, arcEnd: 360,
          height: 8, tilt: 0, thickness: 3, thicknessDirection: 'outward',
          topProfile: 'crenellated',
          color: 0xc4aa80,
          ...WALL_DEFAULTS,
          hasGaps: true as const, panelWidth: 126, gapWidth: 251,
          topAmplitude: 2, topFrequency: 10,
          surface: 'concrete' as const,
          material: 'stone' as const,
          emissiveColor: 0x000000,
        },
      ],
      speedLines: [
        {
          id: 'sl-1', name: 'Whirlpool Current',
          parentArenaId: 'arena-1', parentZoneId: null,
          startR: 70, startAngle: 0, startDir: 90,
          segments: [],
          surfaceFollow: true,
          width: 2.5, color: 0x00ccff, opacity: 0.75, glowColor: 0x44ddff,
          speedMultiplier: 3.5,
          direction: 'forward',
          exitBehavior: 'launch',
          ...SL_DEFAULTS,
          launchForce: 3.0,
          presetType: 'spiral_in' as const,
          presetParams: {
            ...SL_PRESET_PARAMS,
            radiusX: 70, radiusZ: 70,
            turns: 4, innerRadius: 5, steps: 100,
            closeLoop: false,
          },
          activationMode: 'periodic' as const,
          period: 45000,
          activeDuty: 0.33,
          linkedBridgeId: null, linkedTrapId: null,
          enabled: true,
          targetBridgeId: null, targetTrapId: null,
          jumpLinkId: null,
          visible: true,
        },
      ],
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // Bridges (4 piers)
  // ══════════════════════════════════════════════════════════════════════════
  bridges: [
    // Piers start at lake edge (r=75) and extend 50cm INWARD toward center (r=25).
    // freePosY≈17 = arena step-3 surface Y at r=75 (30 - 22*(1-(75/120)²) ≈ 17cm).
    // Heading convention: fwd=(-sin(deg),0,cos(deg)) so 0°→+Z(S), 90°→-X(W), 180°→-Z(N), 270°→+X(E).
    {
      id: 'bridge-1', name: 'East Pier',
      startRef: { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 75, freePosY: 17, freePosZ: 0, freeDirDeg: 90 },
      endRef:   { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 25, freePosY: 17, freePosZ: 0, freeDirDeg: 90 },
      section: PIER_SECTION,
      segments: pierSegments('seg-1', 'seg-2'),
      color: 0xa09070, surface: 'concrete',
      presentStlb64: null, presentColor: 0xa09070,
      visible: true, walls: [], linkedSpeedLineId: null,
    },
    {
      id: 'bridge-2', name: 'South Pier',
      startRef: { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 0, freePosY: 17, freePosZ: 75, freeDirDeg: 180 },
      endRef:   { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 0, freePosY: 17, freePosZ: 25, freeDirDeg: 180 },
      section: PIER_SECTION,
      segments: pierSegments('seg-3', 'seg-4'),
      color: 0xa09070, surface: 'concrete',
      presentStlb64: null, presentColor: 0xa09070,
      visible: true, walls: [], linkedSpeedLineId: null,
    },
    {
      id: 'bridge-3', name: 'West Pier',
      startRef: { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: -75, freePosY: 17, freePosZ: 0, freeDirDeg: 270 },
      endRef:   { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: -25, freePosY: 17, freePosZ: 0, freeDirDeg: 270 },
      section: PIER_SECTION,
      segments: pierSegments('seg-5', 'seg-6'),
      color: 0xa09070, surface: 'concrete',
      presentStlb64: null, presentColor: 0xa09070,
      visible: true, walls: [], linkedSpeedLineId: null,
    },
    {
      id: 'bridge-4', name: 'North Pier',
      startRef: { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 0, freePosY: 17, freePosZ: -75, freeDirDeg: 0 },
      endRef:   { type: 'freepoint', id: '', angle: 0, wallHeight: 0, yOffset: 0,
                  freePosX: 0, freePosY: 17, freePosZ: -25, freeDirDeg: 0 },
      section: PIER_SECTION,
      segments: pierSegments('seg-7', 'seg-8'),
      color: 0xa09070, surface: 'concrete',
      presentStlb64: null, presentColor: 0xa09070,
      visible: true, walls: [], linkedSpeedLineId: null,
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // Obstacles (8 boats + 4 city towers)
  // ══════════════════════════════════════════════════════════════════════════
  obstacles: [
    // ── Boats (floating in lake, posY = water surface ~8cm + dimY/2) ───────
    { id: 'obstacle-1',  name: 'Large Freighter', theme: 'boat', color: 0x8a7a6a, dimX: 20, dimY: 4,  dimZ: 10, posX:  43.3, posY: 9,   posZ:  25.0, rotY:  30,  ...BOAT_BASE },
    { id: 'obstacle-2',  name: 'Cargo Ship',      theme: 'boat', color: 0x7a8a9a, dimX: 22, dimY: 4,  dimZ: 10, posX: -51.8, posY: 9,   posZ: -18.8, rotY: 200,  ...BOAT_BASE },
    { id: 'obstacle-3',  name: 'River Vessel',    theme: 'boat', color: 0x9a8a7a, dimX: 14, dimY: 3,  dimZ:  8, posX:  -6.5, posY: 8.5, posZ:  37.0, rotY: 100,  ...BOAT_BASE },
    { id: 'obstacle-4',  name: 'Fishing Boat',    theme: 'boat', color: 0x8a9a8a, dimX: 12, dimY: 3,  dimZ:  7, posX:  34.5, posY: 8.5, posZ: -29.0, rotY: 320,  ...BOAT_BASE },
    { id: 'obstacle-5',  name: 'Small Boat A',    theme: 'boat', color: 0xa0a0b0, dimX: 10, dimY: 2,  dimZ:  5, posX:  25.0, posY: 8,   posZ:   0.0, rotY:   0,  ...BOAT_BASE },
    { id: 'obstacle-6',  name: 'Small Boat B',    theme: 'boat', color: 0xb0a090, dimX: 10, dimY: 2,  dimZ:  5, posX: -12.5, posY: 8,   posZ:  21.75, rotY: 120, ...BOAT_BASE },
    { id: 'obstacle-7',  name: 'Small Boat C',    theme: 'boat', color: 0xa0b0a0, dimX: 10, dimY: 2,  dimZ:  5, posX: -12.5, posY: 8,   posZ: -21.75, rotY: 240, ...BOAT_BASE },
    { id: 'obstacle-8',  name: 'Harbor Tug',      theme: 'boat', color: 0x88a0b8, dimX: 16, dimY: 3,  dimZ:  8, posX: -52.0, posY: 8.5, posZ:  30.0, rotY: 150,  ...BOAT_BASE },
    // ── City towers (shore ring r≈110, posY = surface_Y + dimY/2 ≈ 31) ────
    { id: 'obstacle-9',  name: 'Harbor Tower NE', dimX: 5, dimY: 12, dimZ: 5, posX:  78, posY: 31, posZ:  78, rotY:  45, color: 0xc4aa80, ...TOWER_BASE },
    { id: 'obstacle-10', name: 'Harbor Tower NW', dimX: 5, dimY: 12, dimZ: 5, posX: -78, posY: 31, posZ:  78, rotY: 135, color: 0xb8a070, ...TOWER_BASE },
    { id: 'obstacle-11', name: 'Harbor Tower SW', dimX: 5, dimY: 12, dimZ: 5, posX: -78, posY: 31, posZ: -78, rotY: 225, color: 0xc4aa80, ...TOWER_BASE },
    { id: 'obstacle-12', name: 'Harbor Tower SE', dimX: 5, dimY: 12, dimZ: 5, posX:  78, posY: 31, posZ: -78, rotY: 315, color: 0xb8a070, ...TOWER_BASE },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // Traps
  // ══════════════════════════════════════════════════════════════════════════
  traps: [
    {
      id: 'trap-1', name: 'Whirlpool',
      parentId: 'arena-1', parentType: 'arena',
      shape: 'circle', variant: 'generic', effect: 'gravity_pull',
      dimX: 150, dimZ: 150,
      posR: 0, posAngle: 0,
      ...TRAP_DEFAULTS,
      isPeriodic: true, safeInterval: 30, unsafeInterval: 15,
      gravityRange: 75, gravityStrength: 18, gravityMode: 'continuous',
      color: 0x0055aa, emissiveColor: 0x0099cc, emissiveIntensity: 0.35,
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // Rotations
  // ══════════════════════════════════════════════════════════════════════════
  rotations: [
    {
      id: 'rot-1', name: 'Drifting Fleet',
      memberIds: ['obstacle-5', 'obstacle-6', 'obstacle-7'],
      memberTypes: ['obstacle', 'obstacle', 'obstacle'],
      pivotX: 0, pivotY: 8, pivotZ: 0,
      mode: 'continuous', speed: 5, direction: 1,
      oscAmplitude: 45, oscFrequency: 0.5, oscPhase: 0,
      enabled: true, visible: true,
      snapRules: [],
    },
  ],
};

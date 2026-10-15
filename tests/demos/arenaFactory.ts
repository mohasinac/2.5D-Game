/**
 * Builders for one-feature demo arenas.
 *
 * Every demo is *the same base bowl with exactly one thing changed*. That is what
 * makes the demos diagnostic: if something looks wrong, it is attributable to the
 * single varied property rather than to an unrelated difference in the scene.
 *
 * Defaults are modelled on src/config/testArenaConfig.ts, which is known-valid.
 */

import type {
  ArenaConfig, ArenaSave, WallSave, SpeedLineSave, ObstacleSave,
  TrapSave, PortalSave, BaseFootingSave, PitSave, ZoneSave,
} from '../../src/utils/arenaPersistence';

export const DEMO_ARENA_ID = 'demo-arena';

/** Empty top level — every array present, every seq counter at 0. */
export function emptyConfig(): ArenaConfig {
  return {
    baseConfig: {
      height: 30, sides: 8, color: 0xc0c8d8, surface: 'plain',
      customTileData: null, tileScale: 20, apothem: 100,
    },
    arenas: [], arenaSeq: 0, pitSeq: 0, zoneSeq: 0,
    bridges: [], wallSeq: 0, bridgeSeq: 0, segmentSeq: 0,
    speedLineSeq: 0, speedLines: [], baseWalls: [],
    obstacles: [], obstacleSeq: 0,
    traps: [], trapSeq: 0,
    portals: [], portalSeq: 0,
    rotations: [], rotationSeq: 0,
    footings: [], footingSeq: 0,
    jumpLinks: [], jumpLinkSeq: 0,
    translations: [], translationSeq: 0,
  };
}

/** The standard demo bowl: 60 cm radius, 24 cm deep, parabolic, flush at Y=0. */
export function baseArena(over: Partial<ArenaSave> = {}): ArenaSave {
  return {
    id: DEMO_ARENA_ID, name: 'Demo Arena',
    openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 60, radiusZ: 60, depth: 24,
    sides: 6, starInner: 0.5,
    color: 0x334466, surface: 'plain', customTileData: null, tileScale: 20,
    baseMaterial: 'abs',
    posX: 0, posZ: 0, posY: 0, rotY: 0,
    isMoat: false, innerRadiusX: 25, innerRadiusZ: 25,
    innerOpeningShape: 'circle', innerSides: 6, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 10,
    stepApplyToAll: false, stepEdgeProfiles: [], stepArcDivisions: 4,
    stepCount: 3, stepStartDepth: 5, stepRiserProfile: 'parabolic',
    rampMode: 'none', rampAngle: 20, rampWidth: 20,
    spiralTurns: 2, spiralClockwise: false, spiralCount: 1,
    spiralLedgeWidth: 5, spiralLedgeHeight: 2, spiralRadiusFrac: 0.7,
    stepsColor: null, stepsSurface: null, stepsCustomTileData: null,
    spiralColor: null, spiralSurface: null, spiralCustomTileData: null,
    lightColor: 0x8899cc, lightIntensity: 0.9, lightPosY: 70, lightRange: 160,
    particlePreset: 'none',
    presentStlb64: null, presentColor: 0xffffff,
    pits: [], zones: [], walls: [], speedLines: [],
    ...over,
  } as ArenaSave;
}

export function demoWall(over: Partial<WallSave> = {}): WallSave {
  return {
    id: 'demo-wall', name: 'Demo Wall',
    parentId: DEMO_ARENA_ID, parentType: 'arena',
    fullPerimeter: true, arcStart: 0, arcEnd: 360,
    basePosX: 0, basePosZ: 0, baseRotY: 0, baseLength: 80,
    height: 14, tilt: 0, thickness: 2, thicknessDirection: 'outward',
    hasGaps: false, gapWidth: 14, panelWidth: 24,
    topProfile: 'flat', topAmplitude: 3, topFrequency: 8,
    isDouble: false, peakHeight: 6, peakTilt: 12,
    holes: [], isDestructible: false, hitPoints: 100,
    autoJoin: true, moatRing: 'outer',
    rotateOnArena: false, arenaRotateMode: 'continuous',
    arenaRotateSpeed: 30, arenaRotateStepDeg: 30, arenaRotateStepInterval: 1,
    arenaRotateOscAmp: 45, arenaRotateOscFreq: 0.5,
    color: 0x667799, surface: 'plain', customTileData: null, tileScale: 20,
    emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
    material: 'abs', presentStlb64: null, presentColor: 0xffffff,
    ...over,
  } as WallSave;
}

export function demoSpeedLine(over: Partial<SpeedLineSave> = {}): SpeedLineSave {
  return {
    id: 'demo-sl', name: 'Demo Speed Line',
    parentArenaId: DEMO_ARENA_ID, parentZoneId: null,
    startR: 40, startAngle: 0, startDir: 90,
    segments: [],                       // SpeedLineManager auto-generates from the preset
    width: 6, color: 0x00e5ff, opacity: 0.75, glowColor: 0x00e5ff,
    surfaceFollow: true, surfaceOffset: 0.05,
    speedMultiplier: 1.4,
    targetType: 'any', targetTag: '',
    activationMode: 'always', activationRadius: 30,
    entryCondition: 'always', exitBehavior: 'normal', launchForce: 200,
    direction: 'forward', swapPriority: 0,
    oscillate: false, oscAxis: 'lateral', oscAmplitude: 2,
    oscFrequency: 1, oscPhase: 0,
    overridePhysics: false, enabled: true,
    presetType: 'circle',
    presetParams: {
      radiusX: 40, radiusZ: 40, sides: 6, petals: 5, turns: 3, steps: 60,
      centerX: 0, centerZ: 0, rotationY: 0, heightDelta: 0, closeLoop: true,
      innerRadius: 10, pitchPerTurn: 4, loopGap: 2, radiusEasing: 'linear',
      arcFraction: 1, centerY: 0,
      sections: [],
      modulation: {
        type: 'none', waveform: 'sine', amplitude: 3,
        periodSteps: 12, modPhase: 0, pulseWidth: 0.5,
      },
    },
    speedRamp: {
      profile: 'constant', speedMin: 0.6, speedMax: 1.6,
      entrySteps: 4, exitSteps: 4,
    },
    statModifiers: {
      spinRate: 1, stamina: 1, attack: 1, defense: 1, weight: 1, burstResist: 1,
    },
    linkedBridgeId: null, linkedTrapId: null,
    targetBridgeId: null, targetTrapId: null, jumpLinkId: null,
    ...over,
  } as unknown as SpeedLineSave;
}

export function demoObstacle(over: Partial<ObstacleSave> = {}): ObstacleSave {
  return {
    id: 'demo-obstacle', name: 'Demo Obstacle',
    shape: 'cube', dimX: 20, dimY: 20, dimZ: 20,
    posX: 0, posY: 12, posZ: 0, rotX: 0, rotY: 0, rotZ: 0,
    isFloating: true, isDestructible: false, hitPoints: 100, weight: 50,
    contactForceX: 0, contactForceY: 0, contactForceZ: 0,
    material: 'abs', theme: 'none',
    color: 0xaa5544, surface: 'plain', customTileData: null, tileScale: 20,
    emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
    speedPathId: null, presentStlb64: null, presentColor: 0xffffff,
    ...over,
  } as unknown as ObstacleSave;
}

export function demoTrap(over: Partial<TrapSave> = {}): TrapSave {
  return {
    id: 'demo-trap', name: 'Demo Trap',
    parentId: DEMO_ARENA_ID, parentType: 'arena',
    shape: 'circle', dimX: 26, dimZ: 26,
    posR: 0, posAngle: 0, basePosX: 0, basePosZ: 0, rotY: 0,
    effect: 'launch', variant: 'trampoline',
    forceX: 0, forceY: 260, forceZ: 0,
    damageFactor: 1, healFactor: 1, freezeDuration: 1.5,
    buffSurface: 'sand',
    pitShape: 'circle', pitRadiusX: 10, pitRadiusZ: 10, pitDepth: 10,
    isPeriodic: false, safeInterval: 2, unsafeInterval: 2,
    activationLimit: 0, durationTiers: [],
    // Required: _restoreTrapSave iterates this unconditionally (trap-parented walls).
    walls: [],
    color: 0xff6b35, surface: 'plain', customTileData: null, tileScale: 20,
    emissiveColor: 0xff6b35, emissiveIntensity: 0.4, opacity: 1,
    baseMaterial: 'abs', speedPathId: null, linkedSpeedLineId: null,
    presentStlb64: null, presentColor: 0xffffff,
    envTriggerEvent: '', envTargetArenaId: '',
    ...over,
  } as unknown as TrapSave;
}

export function demoPortal(over: Partial<PortalSave> = {}): PortalSave {
  return {
    id: 'demo-portal', name: 'Demo Portal',
    parentId: DEMO_ARENA_ID, parentType: 'arena',
    shape: 'circle', dimX: 20, dimZ: 20,
    posR: 35, posAngle: 0, basePosX: 0, basePosZ: 0, rotY: 0,
    destType: 'world_point', destPortalId: null, destArenaId: null,
    destPosX: -35, destPosY: 10, destPosZ: 0,
    exitVelScale: 1, exitRotY: 0, isBidirectional: true,
    color: 0x00e5ff, glowColor: 0x00e5ff,
    surface: 'plain', customTileData: null, tileScale: 20,
    speedPathId: null, presentStlb64: null, presentColor: 0xffffff,
    ...over,
  } as unknown as PortalSave;
}

export function demoFooting(over: Partial<BaseFootingSave> = {}): BaseFootingSave {
  return {
    id: 'demo-footing', name: 'Demo Footing',
    shape: 'cube', dimX: 20, dimY: 20, dimZ: 20,
    basePosX: 70, basePosZ: 0, baseRotY: 0, posY: 0,
    color: 0x888888, surface: 'plain', customTileData: null, tileScale: 20,
    emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
    presentStlb64: null, presentColor: 0xffffff,
    ...over,
  } as unknown as BaseFootingSave;
}

export function demoPit(over: Partial<PitSave> = {}): PitSave {
  return {
    id: 'demo-pit', name: 'Demo Pit',
    openingShape: 'circle',
    radiusX: 14, radiusZ: 14, depth: 10, sides: 6, starInner: 0.5,
    color: 0x222b3a, surface: 'plain', customTileData: null, tileScale: 20,
    rimGlowColor: 0x00e5ff, rimGlowIntensity: 0.3,
    posR: 28, posAngle: 0, rotY: 0,
    ...over,
  } as PitSave;
}

export function demoZone(over: Partial<ZoneSave> = {}): ZoneSave {
  return {
    id: 'demo-zone', name: 'Demo Zone',
    openingShape: 'circle', parentZoneId: null,
    radiusX: 20, radiusZ: 20, depth: 8, sides: 6, starInner: 0.5,
    color: 0x223344, surface: 'plain', customTileData: null, tileScale: 20,
    fill: 'water', fillColor: null, fillOpacity: 0.85,
    seamGlowColor: 0x00e5ff, seamGlowIntensity: 0.25,
    particlePreset: 'none',
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    innerOpeningShape: 'circle', innerSides: 6, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 6,
    pits: [], zones: [],
    ...over,
  } as ZoneSave;
}

/** One arena, optionally with children, wrapped in a complete ArenaConfig. */
export function makeDemoArena(opts: {
  arena?: Partial<ArenaSave>;
  pits?: PitSave[];
  zones?: ZoneSave[];
  walls?: WallSave[];
  speedLines?: SpeedLineSave[];
  obstacles?: ObstacleSave[];
  traps?: TrapSave[];
  portals?: PortalSave[];
  footings?: BaseFootingSave[];
  config?: Partial<ArenaConfig>;
} = {}): ArenaConfig {
  const arena = baseArena({
    ...opts.arena,
    pits: opts.pits ?? [],
    zones: opts.zones ?? [],
    walls: opts.walls ?? [],
    speedLines: opts.speedLines ?? [],
  });

  return {
    ...emptyConfig(),
    arenas: [arena],
    arenaSeq: 1,
    pitSeq: opts.pits?.length ?? 0,
    zoneSeq: opts.zones?.length ?? 0,
    wallSeq: (opts.walls?.length ?? 0),
    speedLineSeq: (opts.speedLines?.length ?? 0),
    obstacles: opts.obstacles ?? [], obstacleSeq: opts.obstacles?.length ?? 0,
    traps: opts.traps ?? [], trapSeq: opts.traps?.length ?? 0,
    portals: opts.portals ?? [], portalSeq: opts.portals?.length ?? 0,
    footings: opts.footings ?? [], footingSeq: opts.footings?.length ?? 0,
    ...opts.config,
  };
}

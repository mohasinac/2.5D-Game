import {
  OpeningShape, WallProfile, RampMode, SurfaceType, ArenaMaterial, ZoneFill,
  ArenaData, PitData, ZoneData, SpeedLineData, ParticlePreset,
  SpeedLineSegment, SpeedLineTargetType, SpeedLineActivationMode,
  SpeedLineOscAxis, SpeedLineEntryCondition, SpeedLineExitBehavior, SpeedLineDirection,
  WallTopProfile, WallHoleData, WallData,
  BridgeCrossSection, BridgeSegmentType, BridgeEndpointType, BridgeSection,
  BridgeSegmentData, BridgeData, BridgeEndpointRef,
  ObstacleData, ObstacleShape, ObstacleTheme,
  TrapData, TrapShape, TrapEffect, TrapVariant, TrapTierEffect, TrapDurationTier,
  PortalData, PortalDestType,
  RotationData, RotationMode, RotationNodeType,
} from '../types/arenaTypes';

export interface SpeedLineSave {
  id: string; name: string;
  parentArenaId: string; parentZoneId: string | null;
  startR: number; startAngle: number; startDir: number;
  segments: SpeedLineSegment[];
  surfaceFollow: boolean;
  targetType: SpeedLineTargetType; targetTag: string;
  activationMode: SpeedLineActivationMode;
  triggerEvent: string; endEvent: string;
  activeDuration: number; period: number; activeDuty: number;
  activationRadius: number; fadeIn: number; fadeOut: number;
  oscillate: boolean; oscAxis: SpeedLineOscAxis;
  oscAmplitude: number; oscFrequency: number; oscPhase: number;
  width: number; color: number; opacity: number; glowColor: number | null;
  customTileData: string | null; tileScale: number;
  presentStlb64: string | null; presentColor: number;
  speedMultiplier: number; entryCondition: SpeedLineEntryCondition;
  direction: SpeedLineDirection; exitBehavior: SpeedLineExitBehavior;
  launchForce: number; specialMoveName: string;
  allowMidAirEntry: boolean; overridePhysics: boolean; swapPriority: number;
}

export interface PitSave {
  id: string; name: string;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  rimGlowColor: number; rimGlowIntensity: number;
  posR: number; posAngle: number; rotY: number;
}

export interface ZoneSave {
  id: string; name: string; openingShape: OpeningShape;
  parentZoneId: string | null;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number;
  seamGlowColor: number; seamGlowIntensity: number;
  particlePreset: ParticlePreset;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape; innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile; innerRimOffset: number;
  pits: PitSave[]; zones: ZoneSave[];
}

/* ── Wall / bridge save interfaces ──────────────────────────────────────── */

export interface WallHoleSave {
  id: string; shape: WallHoleData['shape'];
  posAlong: number; posHeight: number; radiusU: number; radiusV: number;
}

export interface WallSave {
  id: string; name: string; parentId: string; parentType: WallData['parentType'];
  fullPerimeter: boolean; arcStart: number; arcEnd: number;
  basePosX: number; basePosZ: number; baseRotY: number; baseLength: number;
  height: number; tilt: number;
  hasGaps: boolean; gapWidth: number; panelWidth: number;
  topProfile: WallTopProfile; topAmplitude: number; topFrequency: number;
  isDouble: boolean; peakHeight: number; peakTilt: number;
  holes: WallHoleSave[];
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number; emissiveIntensity: number; opacity: number;
  material: ArenaMaterial;
  presentStlb64: string | null; presentColor: number;
}

export interface BridgeSectionSave {
  width: number; crossSection: BridgeCrossSection; depth: number;
  hasLeftWall: boolean; hasRightWall: boolean; sideWallHeight: number;
  material: ArenaMaterial;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number; emissiveIntensity: number; opacity: number;
}

export interface BridgeSegmentSave {
  id: string; name: string; orderIndex: number; type: BridgeSegmentType;
  length: number; rampAngle: number;
  curveRadius: number; curveAngle: number; curveDirection: 'left'|'right'; bankAngle: number;
  cp1X: number; cp1Y: number; cp1Z: number;
  cp2X: number; cp2Y: number; cp2Z: number;
  endX: number; endY: number; endZ: number;
  loopRadius: number;
  corkscrewLength: number; corkscrewTurns: number;
  color: number | null; surface: SurfaceType | null;
}

export interface BridgeEndpointRefSave {
  type: BridgeEndpointType; id: string; angle: number; wallHeight: number;
  freePosX: number; freePosY: number; freePosZ: number; freeDirDeg: number;
}

export interface BridgeSave {
  id: string; name: string;
  startRef: BridgeEndpointRefSave | null;
  segments: BridgeSegmentSave[];
  section: BridgeSectionSave;
  color: number; surface: SurfaceType;
  presentStlb64: string | null; presentColor: number;
  walls: WallSave[];
}

export interface ArenaSave {
  id: string; name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  baseMaterial: ArenaMaterial;
  posX: number; posZ: number; posY: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape; innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile; innerRimOffset: number;
  stepApplyToAll: boolean; stepEdgeProfiles: WallProfile[]; stepArcDivisions: 1|2|4|8;
  stepCount: number; stepStartDepth: number; stepRiserProfile: 'parabolic'|'straight';
  rampMode: RampMode; rampAngle: number; rampWidth: number;
  spiralTurns: number; spiralClockwise: boolean; spiralCount: number;
  spiralLedgeWidth: number; spiralLedgeHeight: number; spiralRadiusFrac: number;
  stepsColor: number | null; stepsSurface: SurfaceType | null; stepsCustomTileData: string | null;
  spiralColor: number | null; spiralSurface: SurfaceType | null; spiralCustomTileData: string | null;
  lightColor: number; lightIntensity: number; lightPosY: number; lightRange: number;
  particlePreset: ParticlePreset;
  presentStlb64: string | null; presentColor: number;
  pits: PitSave[]; zones: ZoneSave[];
  walls: WallSave[];   // rim walls attached to this arena
  speedLines: SpeedLineSave[];
}

export interface ObstacleSave {
  id: string; name: string; shape: ObstacleShape; theme: ObstacleTheme;
  dimX: number; dimY: number; dimZ: number;
  posX: number; posY: number; posZ: number;
  rotX: number; rotY: number; rotZ: number;
  isFloating: boolean; isDestructible: boolean; hitPoints: number;
  contactForceX: number; contactForceY: number; contactForceZ: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number; emissiveIntensity: number; opacity: number;
  material: ArenaMaterial; speedPathId: string | null;
  presentStlb64: string | null; presentColor: number;
}

export interface TrapDurationTierSave {
  thresholdSeconds: number; tierEffect: TrapTierEffect;
  rpmLossFactor: number; speedFactor: number; notes: string;
}

export interface TrapSave {
  id: string; name: string; parentId: string; parentType: 'arena' | 'base';
  shape: TrapShape; variant: TrapVariant; effect: TrapEffect;
  dimX: number; dimZ: number; rotY: number;
  posR: number; posAngle: number; basePosX: number; basePosZ: number;
  forceX: number; forceY: number; forceZ: number;
  damageFactor: number; healFactor: number; freezeDuration: number;
  buffSurface: SurfaceType | null;
  pitShape: OpeningShape; pitRadiusX: number; pitRadiusZ: number;
  pitDepth: number; pitSides: number; pitStarInner: number;
  isPeriodic: boolean; safeInterval: number; unsafeInterval: number;
  activationLimit: number; speedPathId: string | null;
  durationTiers: TrapDurationTierSave[];
  baseMaterial: ArenaMaterial;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  emissiveColor: number; emissiveIntensity: number;
  presentStlb64: string | null; presentColor: number;
}

export interface PortalSave {
  id: string; name: string; parentId: string; parentType: 'arena' | 'base';
  shape: TrapShape; dimX: number; dimZ: number; rotY: number;
  posR: number; posAngle: number; basePosX: number; basePosZ: number;
  destType: PortalDestType;
  destPortalId: string | null; destArenaId: string | null;
  destPosX: number; destPosY: number; destPosZ: number;
  exitVelScale: number; exitRotY: number; isBidirectional: boolean;
  color: number; glowColor: number;
  surface: SurfaceType; customTileData: string | null; tileScale: number;
  presentStlb64: string | null; presentColor: number;
}

export interface BridgeSnapRuleSave { id: string; bridgeId: string; minDeg: number; maxDeg: number; }

export interface RotationSave {
  id: string; name: string;
  memberIds: string[]; memberTypes: RotationNodeType[];
  pivotX: number; pivotY: number; pivotZ: number;
  mode: RotationMode; speed: number; direction: 1 | -1;
  oscAmplitude: number; oscFrequency: number; oscPhase: number;
  enabled: boolean;
  snapRules: BridgeSnapRuleSave[];
}

export interface ArenaConfig {
  baseConfig: { height: number; sides: number; color: number; surface: SurfaceType; customTileData: string | null; tileScale: number };
  arenas: ArenaSave[]; arenaSeq: number; pitSeq: number; zoneSeq: number;
  baseWalls: WallSave[];   // free-standing walls on octagon base
  bridges: BridgeSave[];
  wallSeq: number; bridgeSeq: number; segmentSeq: number;
  speedLineSeq: number;
  speedLines: SpeedLineSave[];
  obstacles: ObstacleSave[]; obstacleSeq: number;
  traps: TrapSave[];        trapSeq: number;
  portals: PortalSave[];    portalSeq: number;
  rotations: RotationSave[]; rotationSeq: number;
}

export function speedLineToSave(sl: SpeedLineData): SpeedLineSave {
  return {
    id:sl.id, name:sl.name, parentArenaId:sl.parentArenaId, parentZoneId:sl.parentZoneId,
    startR:sl.startR, startAngle:sl.startAngle, startDir:sl.startDir,
    segments:sl.segments.map(s=>({...s})),
    surfaceFollow:sl.surfaceFollow,
    targetType:sl.targetType, targetTag:sl.targetTag,
    activationMode:sl.activationMode, triggerEvent:sl.triggerEvent, endEvent:sl.endEvent,
    activeDuration:sl.activeDuration, period:sl.period, activeDuty:sl.activeDuty,
    activationRadius:sl.activationRadius, fadeIn:sl.fadeIn, fadeOut:sl.fadeOut,
    oscillate:sl.oscillate, oscAxis:sl.oscAxis,
    oscAmplitude:sl.oscAmplitude, oscFrequency:sl.oscFrequency, oscPhase:sl.oscPhase,
    width:sl.width, color:sl.color, opacity:sl.opacity, glowColor:sl.glowColor,
    customTileData:sl.customTileData, tileScale:sl.tileScale,
    presentStlb64:sl.presentStlb64, presentColor:sl.presentColor,
    speedMultiplier:sl.speedMultiplier, entryCondition:sl.entryCondition,
    direction:sl.direction, exitBehavior:sl.exitBehavior,
    launchForce:sl.launchForce, specialMoveName:sl.specialMoveName,
    allowMidAirEntry:sl.allowMidAirEntry, overridePhysics:sl.overridePhysics,
    swapPriority:sl.swapPriority,
  };
}

export function pitToSave(p: PitData): PitSave {
  return {
    id:p.id,name:p.name,
    openingShape:p.openingShape,
    radiusX:p.radiusX,radiusZ:p.radiusZ,depth:p.depth,sides:p.sides,starInner:p.starInner,
    color:p.color,surface:p.surface,customTileData:p.customTileData,tileScale:p.tileScale,
    rimGlowColor:p.rimGlowColor,rimGlowIntensity:p.rimGlowIntensity,
    posR:p.posR,posAngle:p.posAngle,rotY:p.rotY,
  };
}

export function zoneToSave(z: ZoneData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): ZoneSave {
  return {
    id:z.id,name:z.name,parentZoneId:z.parentZoneId,
    openingShape:z.openingShape,
    radiusX:z.radiusX,radiusZ:z.radiusZ,depth:z.depth,sides:z.sides,starInner:z.starInner,
    color:z.color,surface:z.surface,customTileData:z.customTileData,tileScale:z.tileScale,
    fill:z.fill,fillColor:z.fillColor,fillOpacity:z.fillOpacity,
    seamGlowColor:z.seamGlowColor,seamGlowIntensity:z.seamGlowIntensity,
    particlePreset:z.particlePreset,
    posR:z.posR,posAngle:z.posAngle,rotY:z.rotY,
    isMoat:z.isMoat,innerRadiusX:z.innerRadiusX,innerRadiusZ:z.innerRadiusZ,
    innerOpeningShape:z.innerOpeningShape,innerSides:z.innerSides,innerStarInner:z.innerStarInner,
    innerWallProfile:z.innerWallProfile,innerRimOffset:z.innerRimOffset,
    pits:z.pitIds.map(id=>{ const c=pits.get(id); return c?pitToSave(c):null!; }).filter(Boolean),
    zones:z.zoneIds.map(id=>{ const c=zones.get(id); return c?zoneToSave(c,pits,zones):null!; }).filter(Boolean),
  };
}

export function arenaToSave(
  id: string,
  a: ArenaData,
  pits: Map<string, PitData>,
  zones: Map<string, ZoneData>,
): ArenaSave {
  return {
    id,name:a.name,openingShape:a.openingShape,wallProfile:a.wallProfile,
    radiusX:a.radiusX,radiusZ:a.radiusZ,depth:a.depth,sides:a.sides,starInner:a.starInner,
    color:a.color,surface:a.surface,customTileData:a.customTileData,tileScale:a.tileScale,
    baseMaterial:a.baseMaterial,
    posX:a.posX,posZ:a.posZ,posY:a.posY,rotY:a.rotY,
    isMoat:a.isMoat,innerRadiusX:a.innerRadiusX,innerRadiusZ:a.innerRadiusZ,
    innerOpeningShape:a.innerOpeningShape,innerSides:a.innerSides,innerStarInner:a.innerStarInner,
    innerWallProfile:a.innerWallProfile,innerRimOffset:a.innerRimOffset,
    stepApplyToAll:a.stepApplyToAll,stepEdgeProfiles:a.stepEdgeProfiles,stepArcDivisions:a.stepArcDivisions,
    stepCount:a.stepCount,stepStartDepth:a.stepStartDepth,stepRiserProfile:a.stepRiserProfile,
    rampMode:a.rampMode,rampAngle:a.rampAngle,rampWidth:a.rampWidth,
    spiralTurns:a.spiralTurns,spiralClockwise:a.spiralClockwise,spiralCount:a.spiralCount,
    spiralLedgeWidth:a.spiralLedgeWidth,spiralLedgeHeight:a.spiralLedgeHeight,spiralRadiusFrac:a.spiralRadiusFrac,
    stepsColor:a.stepsColor,stepsSurface:a.stepsSurface,stepsCustomTileData:a.stepsCustomTileData,
    spiralColor:a.spiralColor,spiralSurface:a.spiralSurface,spiralCustomTileData:a.spiralCustomTileData,
    lightColor:a.lightColor,lightIntensity:a.lightIntensity,lightPosY:a.lightPosY,lightRange:a.lightRange,
    particlePreset:a.particlePreset,
    presentStlb64:a.presentStlb64,presentColor:a.presentColor,
    pits:a.pitIds.map(pid=>pitToSave(pits.get(pid)!)).filter(Boolean),
    zones:a.zoneIds.filter(zid=>{ const z=zones.get(zid); return z&&!z.parentZoneId; }).map(zid=>zoneToSave(zones.get(zid)!,pits,zones)),
    walls:[],       // populated by ArenaSandbox
    speedLines:[],  // populated by ArenaSandbox
  };
}

export function wallToSave(w: WallData): WallSave {
  return {
    id:w.id, name:w.name, parentId:w.parentId, parentType:w.parentType,
    fullPerimeter:w.fullPerimeter, arcStart:w.arcStart, arcEnd:w.arcEnd,
    basePosX:w.basePosX, basePosZ:w.basePosZ, baseRotY:w.baseRotY, baseLength:w.baseLength,
    height:w.height, tilt:w.tilt,
    hasGaps:w.hasGaps, gapWidth:w.gapWidth, panelWidth:w.panelWidth,
    topProfile:w.topProfile, topAmplitude:w.topAmplitude, topFrequency:w.topFrequency,
    isDouble:w.isDouble, peakHeight:w.peakHeight, peakTilt:w.peakTilt,
    holes:w.holes.map(h=>({
      id:h.id, shape:h.shape, posAlong:h.posAlong, posHeight:h.posHeight,
      radiusU:h.radiusU, radiusV:h.radiusV,
    })),
    color:w.color, surface:w.surface, customTileData:w.customTileData, tileScale:w.tileScale,
    emissiveColor:w.emissiveColor, emissiveIntensity:w.emissiveIntensity, opacity:w.opacity,
    material:w.material,
    presentStlb64:w.presentStlb64, presentColor:w.presentColor,
  };
}

export function endpointRefToSave(r: BridgeEndpointRef): BridgeEndpointRefSave {
  return { type:r.type, id:r.id, angle:r.angle, wallHeight:r.wallHeight,
           freePosX:r.freePosX, freePosY:r.freePosY, freePosZ:r.freePosZ, freeDirDeg:r.freeDirDeg };
}

export function segmentToSave(s: BridgeSegmentData): BridgeSegmentSave {
  return {
    id:s.id, name:s.name, orderIndex:s.orderIndex, type:s.type,
    length:s.length, rampAngle:s.rampAngle,
    curveRadius:s.curveRadius, curveAngle:s.curveAngle,
    curveDirection:s.curveDirection, bankAngle:s.bankAngle,
    cp1X:s.cp1X, cp1Y:s.cp1Y, cp1Z:s.cp1Z,
    cp2X:s.cp2X, cp2Y:s.cp2Y, cp2Z:s.cp2Z,
    endX:s.endX, endY:s.endY, endZ:s.endZ,
    loopRadius:s.loopRadius,
    corkscrewLength:s.corkscrewLength, corkscrewTurns:s.corkscrewTurns,
    color:s.color, surface:s.surface,
  };
}

export function bridgeToSave(
  b: BridgeData,
  segments: Map<string, BridgeSegmentData>,
  walls: Map<string, WallData>,
): BridgeSave {
  const sec = b.section;
  return {
    id:b.id, name:b.name,
    startRef: b.startRef ? endpointRefToSave(b.startRef) : null,
    segments: b.segmentIds.map(id=>{ const s=segments.get(id); return s?segmentToSave(s):null!; }).filter(Boolean),
    section: {
      width:sec.width, crossSection:sec.crossSection, depth:sec.depth,
      hasLeftWall:sec.hasLeftWall, hasRightWall:sec.hasRightWall,
      sideWallHeight:sec.sideWallHeight, material:sec.material,
      color:sec.color, surface:sec.surface, customTileData:sec.customTileData, tileScale:sec.tileScale,
      emissiveColor:sec.emissiveColor, emissiveIntensity:sec.emissiveIntensity, opacity:sec.opacity,
    },
    color:b.color, surface:b.surface,
    presentStlb64:b.presentStlb64, presentColor:b.presentColor,
    walls: b.wallIds.map(id=>{ const w=walls.get(id); return w?wallToSave(w):null!; }).filter(Boolean),
  };
}

export function obstacleToSave(o: ObstacleData): ObstacleSave {
  return {
    id:o.id, name:o.name, shape:o.shape, theme:o.theme,
    dimX:o.dimX, dimY:o.dimY, dimZ:o.dimZ,
    posX:o.posX, posY:o.posY, posZ:o.posZ,
    rotX:o.rotX, rotY:o.rotY, rotZ:o.rotZ,
    isFloating:o.isFloating, isDestructible:o.isDestructible, hitPoints:o.hitPoints,
    contactForceX:o.contactForceX, contactForceY:o.contactForceY, contactForceZ:o.contactForceZ,
    color:o.color, surface:o.surface, customTileData:o.customTileData, tileScale:o.tileScale,
    emissiveColor:o.emissiveColor, emissiveIntensity:o.emissiveIntensity, opacity:o.opacity,
    material:o.material, speedPathId:o.speedPathId,
    presentStlb64:o.presentStlb64, presentColor:o.presentColor,
  };
}

export function trapToSave(t: TrapData): TrapSave {
  return {
    id:t.id, name:t.name, parentId:t.parentId, parentType:t.parentType,
    shape:t.shape, variant:t.variant, effect:t.effect,
    dimX:t.dimX, dimZ:t.dimZ, rotY:t.rotY,
    posR:t.posR, posAngle:t.posAngle, basePosX:t.basePosX, basePosZ:t.basePosZ,
    forceX:t.forceX, forceY:t.forceY, forceZ:t.forceZ,
    damageFactor:t.damageFactor, healFactor:t.healFactor, freezeDuration:t.freezeDuration,
    buffSurface:t.buffSurface,
    pitShape:t.pitShape, pitRadiusX:t.pitRadiusX, pitRadiusZ:t.pitRadiusZ,
    pitDepth:t.pitDepth, pitSides:t.pitSides, pitStarInner:t.pitStarInner,
    isPeriodic:t.isPeriodic, safeInterval:t.safeInterval, unsafeInterval:t.unsafeInterval,
    activationLimit:t.activationLimit, speedPathId:t.speedPathId,
    durationTiers: t.durationTiers.map(d=>({
      thresholdSeconds:d.thresholdSeconds, tierEffect:d.tierEffect,
      rpmLossFactor:d.rpmLossFactor, speedFactor:d.speedFactor, notes:d.notes,
    })),
    baseMaterial:t.baseMaterial,
    color:t.color, surface:t.surface, customTileData:t.customTileData, tileScale:t.tileScale,
    emissiveColor:t.emissiveColor, emissiveIntensity:t.emissiveIntensity,
    presentStlb64:t.presentStlb64, presentColor:t.presentColor,
  };
}

export function portalToSave(p: PortalData): PortalSave {
  return {
    id:p.id, name:p.name, parentId:p.parentId, parentType:p.parentType,
    shape:p.shape, dimX:p.dimX, dimZ:p.dimZ, rotY:p.rotY,
    posR:p.posR, posAngle:p.posAngle, basePosX:p.basePosX, basePosZ:p.basePosZ,
    destType:p.destType, destPortalId:p.destPortalId, destArenaId:p.destArenaId,
    destPosX:p.destPosX, destPosY:p.destPosY, destPosZ:p.destPosZ,
    exitVelScale:p.exitVelScale, exitRotY:p.exitRotY, isBidirectional:p.isBidirectional,
    color:p.color, glowColor:p.glowColor,
    surface:p.surface, customTileData:p.customTileData, tileScale:p.tileScale,
    presentStlb64:p.presentStlb64, presentColor:p.presentColor,
  };
}

export function rotationToSave(r: RotationData): RotationSave {
  return {
    id:r.id, name:r.name,
    memberIds:[...r.memberIds], memberTypes:[...r.memberTypes],
    pivotX:r.pivotX, pivotY:r.pivotY, pivotZ:r.pivotZ,
    mode:r.mode, speed:r.speed, direction:r.direction,
    oscAmplitude:r.oscAmplitude, oscFrequency:r.oscFrequency, oscPhase:r.oscPhase,
    enabled:r.enabled,
    snapRules:r.snapRules.map(s=>({ id:s.id, bridgeId:s.bridgeId, minDeg:s.minDeg, maxDeg:s.maxDeg })),
  };
}

import * as THREE from 'three';
import { ARENA_ELEVATED_THRESHOLD, DEFAULT_STEP_COUNT, DEFAULT_STEP_START_DEPTH, DEFAULT_STEP_RISER, DEFAULT_RAMP_ANGLE, DEFAULT_RAMP_WIDTH, DEFAULT_STEP_ARC_DIVISIONS, DEFAULT_SPIRAL_TURNS, DEFAULT_SPIRAL_COUNT, DEFAULT_SPIRAL_LEDGE_W, DEFAULT_SPIRAL_LEDGE_H, DEFAULT_SPIRAL_RADIUS_FRAC, DEFAULT_ARENA_MATERIAL, SL, JL, DEG2RAD, PIT_FIXED_DEPTH, ENV } from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData, ChildHole, SurfaceMaterialOpts, SurfaceType, ArenaMaterial,
  SpeedLineData, SpeedLineSegment, RampMode, defaultParticleConfig,
  JumpEndpointMode, JumpLinkParentType, JumpArcProfile,
} from '../types/arenaTypes';
import { defaultJumpFlightConfig, buildDiscMesh } from './jumpLinkBuilders';
import { SceneSurfaceProjector } from './sceneSurfaceProjector';
import { shapePoints, childArenaBaseY, childWorldPos, makeSurfFn, polarToLocalXZ } from './surfaceUtils';
import {
  computeSegmentPath, computeJoints, buildRibbon3D, buildStartMarker, buildEndMarker,
  buildArrowMeshes, buildHandleMeshes, buildActivationRadiusMarker, pathSurfaceNormal,
} from './speedLineBuilders';
import { extractChildTransform } from './surfaceUtils';
import {
  buildParabolicBowl, buildStraightCut, buildEdgeLines,
  buildMoatGeometry, buildMoatEdgeLines,
  buildFreeArenaMesh, buildFreeArenaEdges,
} from './bowlBuilders';
import { buildScoopPair, buildScoopSeam } from './scoopBuilders';
import { buildSurfaceMaterial, buildFillBowlMaterial, releaseMaterial } from './materialBuilders';
import { zoneFillConfig } from './fillBuilders';
import { buildSteppedBowl, buildSpiralLedgeMesh } from './floorProfileBuilders';

/* ══════════════════════════════════════════════════════════════════════════
   Arena object builders — Facade layer.
   Orchestrates geometry builders, material builders, and fill builders into
   complete Three.js objects (Mesh + LineSegments + optional seam).
   Changes here when the object assembly pattern changes (positions, rotations,
   disposal sequences).
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Shared edge color helper ────────────────────────────────────────────── */
function edgeColor(color: number): THREE.Color {
  return new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
}

/* ── Arena ───────────────────────────────────────────────────────────────── */

function usesStepProfile(data: ArenaData): boolean {
  if (data.isMoat || data.posY > ARENA_ELEVATED_THRESHOLD) return false;
  return data.stepApplyToAll
    ? data.wallProfile === 'step'
    : data.stepEdgeProfiles.some(p => p === 'step');
}

function usesSpiralProfile(data: ArenaData): boolean {
  return !data.isMoat && data.stepApplyToAll && data.wallProfile === 'spiral';
}

function resolvedWallProfile(data: ArenaData): 'parabolic' | 'straight' {
  const p = data.wallProfile;
  if (p === 'parabolic' || p === 'spiral') return 'parabolic';
  if (p === 'step') return data.stepRiserProfile === 'straight' ? 'straight' : 'parabolic';
  return 'straight';
}

function buildArenaBowlGeo(data: ArenaData, pts: THREE.Vector2[], baseY: number, holes: ChildHole[]): [THREE.BufferGeometry, THREE.BufferGeometry] {
  if (data.isMoat) {
    const innerPts = shapePoints({ openingShape:data.innerOpeningShape, radiusX:data.innerRadiusX, radiusZ:data.innerRadiusZ, sides:data.innerSides, starInner:data.innerStarInner });
    return [
      buildMoatGeometry(pts, innerPts, data.depth, data.wallProfile, data.innerWallProfile, data.innerRimOffset, baseY, data.stepCount, data.stepStartDepth, data.innerStepCount, data.innerStepStartDepth),
      buildMoatEdgeLines(pts, innerPts, data.depth, data.innerRimOffset, baseY, data.wallProfile, data.innerWallProfile, data.stepCount, data.stepStartDepth, data.innerStepCount, data.innerStepStartDepth),
    ];
  }
  if (data.posY > ARENA_ELEVATED_THRESHOLD) {
    // buildFreeArenaMesh only handles parabolic/straight — resolve step/spiral to their base shape
    return [
      buildFreeArenaMesh(pts, data.depth, resolvedWallProfile(data), baseY, holes),
      buildFreeArenaEdges(pts, data.depth, baseY),
    ];
  }
  if (usesStepProfile(data)) {
    const { geo, edgeGeo } = buildSteppedBowl(data, baseY, holes);
    return [geo, edgeGeo];
  }
  // Non-elevated, non-moat, non-step: use buildFreeArenaMesh so the bowl gets an outer skirt
  const wp = resolvedWallProfile(data);
  return [
    buildFreeArenaMesh(pts, data.depth, wp, baseY, holes),
    buildFreeArenaEdges(pts, data.depth, baseY),
  ];
}

function buildSpiralMeshes(data: ArenaData, scene: THREE.Scene): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  if (!usesSpiralProfile(data)) return meshes;
  for (let hi = 0; hi < data.spiralCount; hi++) {
    const m = buildSpiralLedgeMesh(
      data, 0, hi, data.spiralCount, data.baseMaterial,
      data.spiralColor, data.spiralSurface, data.spiralCustomTileData,
    );
    m.position.set(data.posX, data.posY, data.posZ);
    m.rotation.y = data.rotY;
    scene.add(m);
    meshes.push(m);
  }
  return meshes;
}

function disposeSpiralMeshes(data: ArenaData, scene: THREE.Scene | null): void {
  for (const m of data.spiralMeshes) {
    if (scene) scene.remove(m);
    m.geometry.dispose();
    (m.material as THREE.Material).dispose();
  }
  data.spiralMeshes = [];
}

export function buildArenaObjects(data: ArenaData, holes: ChildHole[] = [], scene?: THREE.Scene): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(data);
  const hasStep   = data.isMoat ? data.wallProfile === 'step' : usesStepProfile(data);
  const stepActive = hasStep && data.stepsColor !== null;
  const matColor    = stepActive ? data.stepsColor!                              : data.color;
  const matSurface  = stepActive ? (data.stepsSurface        ?? data.surface)   : data.surface;
  const matTileData = stepActive ? (data.stepsCustomTileData ?? data.customTileData) : data.customTileData;
  const mat = buildSurfaceMaterial({ color:matColor, surface:matSurface, customTileData:matTileData, tileScale:data.tileScale, baseMaterial:data.baseMaterial });
  const baseY = 0;

  const [meshGeo, edgeGeo] = buildArenaBowlGeo(data, pts, baseY, holes);

  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(data.posX, data.posY, data.posZ);
  mesh.rotation.y = data.rotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(matColor) }));
  edges.position.set(data.posX, data.posY, data.posZ);
  edges.rotation.y = data.rotY;

  if (scene) data.spiralMeshes = buildSpiralMeshes(data, scene);

  return [mesh, edges];
}

export function applyArena(data: ArenaData, holes: ChildHole[] = [], scene?: THREE.Scene): void {
  const pts = shapePoints(data);
  data.mesh.geometry.dispose(); data.edges.geometry.dispose();
  const baseY = 0;

  const [meshGeo, edgeGeo] = buildArenaBowlGeo(data, pts, baseY, holes);
  data.mesh.geometry  = meshGeo;
  data.edges.geometry = edgeGeo;

  for (const obj of [data.mesh, data.edges]) { obj.position.set(data.posX, data.posY, data.posZ); obj.rotation.y = data.rotY; }

  // Spiral meshes lifecycle
  if (scene) {
    disposeSpiralMeshes(data, scene);
    data.spiralMeshes = buildSpiralMeshes(data, scene);
  }

  applyArenaColor(data);
}

/**
 * Rim seam collar for arena openings on the octagon base top face.
 * Covers jagged triangles from THREE.ShapeGeometry hole tessellation.
 */
export function buildArenaRimSeam(
  arena: ArenaData,
  seamColor: number, seamSurface: SurfaceType,
  seamTileData: string | null, seamTileScale: number,
): THREE.Mesh {
  const pts = shapePoints(arena);
  const flatSurf = (_: number, __: number) => 0;
  const geo = buildScoopSeam(pts, 0, 0, 0, flatSurf);
  const mat = buildSurfaceMaterial({ color: seamColor, surface: seamSurface, customTileData: seamTileData, tileScale: seamTileScale });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(arena.posX, arena.posY, arena.posZ);
  mesh.rotation.y = arena.rotY;
  return mesh;
}

export function applyArenaColor(data: ArenaData): void {
  const hasStep   = data.isMoat ? data.wallProfile === 'step' : usesStepProfile(data);
  const stepActive = hasStep && data.stepsColor !== null;
  const opts: SurfaceMaterialOpts = {
    color:          stepActive ? data.stepsColor!                              : data.color,
    surface:        stepActive ? (data.stepsSurface        ?? data.surface)   : data.surface,
    customTileData: stepActive ? (data.stepsCustomTileData ?? data.customTileData) : data.customTileData,
    tileScale: data.tileScale, baseMaterial: data.baseMaterial,
  };
  releaseMaterial(opts);
  data.mesh.material = buildSurfaceMaterial(opts);
  (data.edges.material as THREE.LineBasicMaterial).color.copy(edgeColor(stepActive ? data.stepsColor! : data.color));
}

/* ── Pit ─────────────────────────────────────────────────────────────────── */
export function buildPitObjects(
  pit: PitData, arena: ArenaData,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): [THREE.Mesh, THREE.LineSegments, THREE.Mesh] {
  const pts = shapePoints(pit);
  const mat = buildSurfaceMaterial({ color:pit.color, surface:pit.surface, customTileData:pit.customTileData, tileScale:pit.tileScale });
  const { cx, cz, rotY: pitRotY } = extractChildTransform(pit);
  const surfFn = makeSurfFn({ parentZoneId: null }, arena, zones);

  const { meshGeo, edgeGeo } = buildScoopPair(pts, pit.depth, 'straight', cx, cz, pitRotY, surfFn);

  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(pit.color) }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;

  const seamMat = buildSurfaceMaterial({ color:pit.color, surface:pit.surface, customTileData:pit.customTileData, tileScale:pit.tileScale });
  (seamMat as THREE.MeshStandardMaterial).emissive.setHex(pit.rimGlowColor);
  (seamMat as THREE.MeshStandardMaterial).emissiveIntensity = pit.rimGlowIntensity;
  const seamMesh = new THREE.Mesh(buildScoopSeam(pts, cx, cz, pitRotY, surfFn), seamMat);
  seamMesh.position.set(wx, 0, wz); seamMesh.rotation.y = wRotY;

  return [mesh, edges, seamMesh];
}

export function applyPit(
  pit: PitData, arena: ArenaData,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): void {
  const pts = shapePoints(pit);
  const { cx, cz, rotY: pitRotY } = extractChildTransform(pit);
  const surfFn = makeSurfFn({ parentZoneId: null }, arena, zones);
  pit.mesh.geometry.dispose(); pit.edges.geometry.dispose();

  const { meshGeo, edgeGeo } = buildScoopPair(pts, pit.depth, 'straight', cx, cz, pitRotY, surfFn);
  pit.mesh.geometry = meshGeo; pit.edges.geometry = edgeGeo;

  pit.seamMesh.geometry.dispose();
  pit.seamMesh.geometry = buildScoopSeam(pts, cx, cz, pitRotY, surfFn);
  const seamM = pit.seamMesh.material as THREE.MeshStandardMaterial;
  seamM.emissive.setHex(pit.rimGlowColor);
  seamM.emissiveIntensity = pit.rimGlowIntensity;

  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  for (const obj of [pit.mesh, pit.edges, pit.seamMesh]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }
}

/* ── Zone ────────────────────────────────────────────────────────────────── */
export function buildZoneObjects(
  zone: ZoneData, arena: ArenaData,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): [THREE.Mesh, THREE.LineSegments, THREE.Mesh] {
  const pts = shapePoints(zone);
  const { cx: zoneCX, cz: zoneCZ, rotY: zoneRotY } = extractChildTransform(zone);
  const surfFn = makeSurfFn(zone, arena, zones);
  const fc = zoneFillConfig(zone);

  let meshGeo: THREE.BufferGeometry; let edgeGeo: THREE.BufferGeometry;
  if (zone.isMoat) {
    const baseY = childArenaBaseY(arena, zone.posR);
    const innerPts = shapePoints({ openingShape:zone.innerOpeningShape, radiusX:zone.innerRadiusX, radiusZ:zone.innerRadiusZ, sides:zone.innerSides, starInner:zone.innerStarInner });
    meshGeo = buildMoatGeometry(pts, innerPts, zone.depth, 'parabolic', zone.innerWallProfile, zone.innerRimOffset, baseY);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, zone.depth, zone.innerRimOffset, baseY);
  } else {
    ({ meshGeo, edgeGeo } = buildScoopPair(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn));
  }

  const { wx, wz, wRotY } = childWorldPos(arena, zone);
  const mesh = new THREE.Mesh(meshGeo, buildFillBowlMaterial(fc, zone.fillOpacity));
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(fc.color) }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;

  const seamMat = buildFillBowlMaterial(fc, zone.fillOpacity);
  (seamMat as THREE.MeshStandardMaterial).emissive.setHex(zone.seamGlowColor);
  (seamMat as THREE.MeshStandardMaterial).emissiveIntensity = zone.seamGlowIntensity;
  const seamMesh = new THREE.Mesh(buildScoopSeam(pts, zoneCX, zoneCZ, zoneRotY, surfFn), seamMat);
  seamMesh.position.set(wx, 0, wz); seamMesh.rotation.y = wRotY;

  return [mesh, edges, seamMesh];
}

export function applyZone(
  zone: ZoneData, arena: ArenaData,
  scene: THREE.Scene | null,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): void {
  const pts = shapePoints(zone);
  const { cx: zoneCX, cz: zoneCZ, rotY: zoneRotY } = extractChildTransform(zone);
  const { wx, wz, wRotY } = childWorldPos(arena, zone);
  const surfFn = makeSurfFn(zone, arena, zones);
  const fc = zoneFillConfig(zone);

  zone.mesh.geometry.dispose(); zone.edges.geometry.dispose();
  if (zone.isMoat) {
    const baseY = childArenaBaseY(arena, zone.posR);
    const innerPts = shapePoints({ openingShape:zone.innerOpeningShape, radiusX:zone.innerRadiusX, radiusZ:zone.innerRadiusZ, sides:zone.innerSides, starInner:zone.innerStarInner });
    zone.mesh.geometry  = buildMoatGeometry(pts, innerPts, zone.depth, 'parabolic', zone.innerWallProfile, zone.innerRimOffset, baseY);
    zone.edges.geometry = buildMoatEdgeLines(pts, innerPts, zone.depth, zone.innerRimOffset, baseY);
  } else {
    const { meshGeo, edgeGeo } = buildScoopPair(pts, zone.depth, 'parabolic', zoneCX, zoneCZ, zoneRotY, surfFn);
    zone.mesh.geometry = meshGeo; zone.edges.geometry = edgeGeo;
  }
  (zone.mesh.material as THREE.Material).dispose();
  zone.mesh.material = buildFillBowlMaterial(fc, zone.fillOpacity);
  (zone.edges.material as THREE.LineBasicMaterial).color.copy(edgeColor(fc.color));
  for (const obj of [zone.mesh, zone.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }

  zone.seamMesh.geometry.dispose();
  zone.seamMesh.geometry = buildScoopSeam(pts, zoneCX, zoneCZ, zoneRotY, surfFn);
  (zone.seamMesh.material as THREE.Material).dispose();
  const newSeamMat = buildFillBowlMaterial(fc, zone.fillOpacity);
  (newSeamMat as THREE.MeshStandardMaterial).emissive.setHex(zone.seamGlowColor);
  (newSeamMat as THREE.MeshStandardMaterial).emissiveIntensity = zone.seamGlowIntensity;
  zone.seamMesh.material = newSeamMat;
  zone.seamMesh.position.set(wx, 0, wz); zone.seamMesh.rotation.y = wRotY;
}

/* ── Speed line assembly ─────────────────────────────────────────────────── */

export function defaultSegment(id: string, length?: number): SpeedLineSegment {
  return {
    id, length: length ?? SL.DEFAULT_SEG_LENGTH,
    rotX: 0, rotY: 0, rotZ: 0,
    speedMult: 0,
    objRotX: 0, objRotY: 0, objRotZ: 0,
    maxStayDuration: 0,
    statModifiers: null,
    sectionIndex: -1,
  };
}

/**
 * Returns the inner island rim perimeter of a moat arena as arena-local XZ Vector2 points.
 * Used for placing walls on the inner island rim (moatRing='inner').
 */
export function innerRimShapePoints(arena: ArenaData): THREE.Vector2[] {
  return shapePoints({
    openingShape: arena.innerOpeningShape,
    radiusX:      arena.innerRadiusX,
    radiusZ:      arena.innerRadiusZ,
    sides:        arena.innerSides,
    starInner:    arena.innerStarInner,
  });
}

export function defaultSpeedLine(
  name: string, parentArenaId: string, id: string,
  parentZoneId: string | null = null,
): SpeedLineData {
  return {
    id, name, parentArenaId, parentZoneId,
    startR: 0, startAngle: 0, startDir: 0,
    segments: [defaultSegment(`${id}-seg-0`)],
    surfaceFollow: true,
    targetType: SL.DEFAULT_TARGET, targetTag: '',
    activationMode: SL.DEFAULT_ACTIVATION,
    triggerEvent: '', endEvent: '',
    activeDuration: 0, period: SL.DEFAULT_PERIOD_MS, activeDuty: SL.DEFAULT_DUTY,
    activationRadius: SL.DEFAULT_PROX_RADIUS, fadeIn: SL.DEFAULT_FADE_MS, fadeOut: SL.DEFAULT_FADE_MS,
    oscillate: false, oscAxis: SL.DEFAULT_OSC_AXIS,
    oscAmplitude: SL.DEFAULT_OSC_AMP, oscFrequency: SL.DEFAULT_OSC_FREQ, oscPhase: SL.DEFAULT_OSC_PHASE,
    width: SL.DEFAULT_WIDTH, color: SL.DEFAULT_COLOR, opacity: SL.DEFAULT_OPACITY, glowColor: null,
    customTileData: null, tileScale: 1,
    presentStlb64: null, presentColor: 0xaaaaaa,
    speedMultiplier: SL.DEFAULT_SPEED_MULT,
    entryCondition: 'always',
    direction: SL.DEFAULT_DIRECTION, exitBehavior: SL.DEFAULT_EXIT,
    launchForce: SL.DEFAULT_LAUNCH_FORCE, specialMoveName: '',
    allowMidAirEntry: false, overridePhysics: false,
    swapPriority: SL.DEFAULT_SWAP_PRIORITY,
    totalLength: 0,

    presetType: 'custom',
    presetParams: {
      radiusX: SL.PRESET_RADIUS_DEF, radiusZ: SL.PRESET_RADIUS_DEF,
      sides: 6, petals: 5, turns: 2, steps: SL.PRESET_STEPS_DEF,
      centerX: 0, centerZ: 0, rotationY: 0, heightDelta: 0,
      closeLoop: false, innerRadius: 0.4,
      pitchPerTurn: 0, loopGap: 0, radiusEasing: 'linear',
      sections: [],
      centerY: 0, startPosX: 0, startPosZ: 0, startPosY: 0,
      endPosX: 0, endPosZ: 0, endPosY: 0,
      arcFraction: 1.0,
      modulation: { type: 'none', amplitude: 5, periodSteps: 12, waveform: 'triangle', modPhase: 0, pulseWidth: 0.2 },
      jumpDstMode:        'parent_surface' as JumpEndpointMode,
      jumpDstParentType:  'arena' as JumpLinkParentType,
      jumpDstParentId:    parentArenaId,
      jumpDstLocalX:      40, jumpDstLocalZ: 0,
      jumpDstWorldX:      0,  jumpDstWorldY: 0, jumpDstWorldZ: 0,
      jumpDstSpeedLineId: null, jumpDstAtStart: false,
      jumpArcProfile:     'parabolic' as JumpArcProfile,
      jumpArcHeight:      JL.DEFAULT_ARC_HEIGHT,
      jumpDiscRadius:     JL.DEFAULT_DISC_RADIUS,
      jumpFlight:         defaultJumpFlightConfig(),
    },
    speedRamp: {
      profile: 'constant',
      speedMin: SL.DEFAULT_SPEED_MULT, speedMax: SL.DEFAULT_SPEED_MULT,
      entrySteps: 0, exitSteps: 0,
    },
    surfaceOffset: SL.DEFAULT_SURFACE_OFFSET,
    surfaceOrientObject: true,
    airNormalMode: 'lean_center',
    airNormalTiltDeg: 10,
    pointNormals: [],
    baseCondition: 'none',
    conditionPhase: 'any',
    ejectBehavior: 'toward_center',
    targetSelectionMode: 'at_entrance',
    conditionCheckIntervalMs: SL.DEFAULT_CONDITION_CHECK_MS,
    statModifiers: { spinRateMult: 1, staminaMult: 1, attackMult: 1, defenseMult: 1, weightMult: 1, burstResistMult: 1,
      tiltAngleDeg: 0, tiltSpinSensitive: false, tiltApplyPhase: 'exit' },

    linkedBridgeId: null,
    linkedTrapId:   null,
    enabled:        true,
    visible:        true,
    targetBridgeId: null,
    targetTrapId:   null,
    jumpLinkId:     null,

    mesh:           null as unknown as THREE.Mesh,
    edges:          null as unknown as THREE.LineSegments,
    markerMeshes:   [],
    handleMeshes:   [],
    overlapMarkers: [],
  };
}

export function buildSpeedLineObjects(
  sl: SpeedLineData,
  arena: ArenaData,
  zones: Map<string, ZoneData>,
  projector?: SceneSurfaceProjector,
): { mesh: THREE.Mesh; edges: THREE.LineSegments; markerMeshes: THREE.Mesh[]; handleMeshes: THREE.Mesh[]; totalLength: number } {
  sl.pointNormals = [];   // clear before rebuild
  const surfFn = makeSurfFn({ parentZoneId: sl.parentZoneId }, arena, zones);
  const pts = computeSegmentPath(sl, arena, surfFn, projector);

  // Compute per-point normals
  const normals = pts.map(pt => pathSurfaceNormal(pt, arena, sl));

  // Ribbon
  const ribbonGeo = buildRibbon3D(pts, normals, sl.width);
  const isInactive = sl.activationMode !== 'always';
  const effectiveOpacity = isInactive ? sl.opacity * SL.INACTIVE_OPACITY_MULT : sl.opacity;
  const ribbonSurface = sl.customTileData ? 'custom_png' as const : 'plain' as const;
  const mat = buildSurfaceMaterial({
    color: sl.color,
    surface: ribbonSurface,
    customTileData: sl.customTileData,
    tileScale: sl.tileScale,
    transparent: true,
    opacity: effectiveOpacity,
    side: THREE.DoubleSide,
  });
  (mat as THREE.MeshStandardMaterial).emissive.setHex(sl.glowColor ?? sl.color);
  (mat as THREE.MeshStandardMaterial).emissiveIntensity = sl.glowColor ? 0.6 : 0.2;
  (mat as THREE.MeshStandardMaterial).depthWrite = false;
  const mesh = new THREE.Mesh(ribbonGeo, mat);

  // Centerline edge wire
  const linePts = pts.map(p => p.clone());
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const lineMat = new THREE.LineBasicMaterial({
    color: sl.color, transparent: true,
    opacity: isInactive ? 0.3 : 0.6,
  });
  const edges = new THREE.LineSegments(lineGeo, lineMat);

  // Total length
  let totalLength = 0;
  for (let i = 1; i < pts.length; i++) totalLength += pts[i].distanceTo(pts[i-1]);

  // Markers
  const markerMeshes: THREE.Mesh[] = [];
  if (sl.presetType === 'jump' && pts.length >= 2) {
    // Jump preset: place glowing discs at source and destination
    const p = sl.presetParams;
    const discRadius = p.jumpDiscRadius ?? JL.DEFAULT_DISC_RADIUS;
    const srcDisc = buildDiscMesh(sl.color, sl.glowColor, discRadius, sl.opacity);
    srcDisc.position.copy(pts[0]).add(new THREE.Vector3(0, JL.DISC_HEIGHT / 2, 0));
    const dstDisc = buildDiscMesh(sl.color, sl.glowColor, discRadius, sl.opacity);
    dstDisc.position.copy(pts[pts.length - 1]).add(new THREE.Vector3(0, JL.DISC_HEIGHT / 2, 0));
    markerMeshes.push(srcDisc, dstDisc);
  } else {
    if (pts.length > 0) markerMeshes.push(buildStartMarker(pts[0], sl.color));
    if (sl.exitBehavior !== 'loop' && pts.length > 1) markerMeshes.push(buildEndMarker(pts[pts.length-1], sl.color));
  }
  const arrows = buildArrowMeshes(pts, sl.color, sl.direction === 'bidirectional' ? 'bidirectional' : sl.direction === 'reverse' ? 'reverse' : 'forward');
  markerMeshes.push(...arrows);

  if (sl.activationMode === 'proximity' && pts.length > 0) {
    markerMeshes.push(buildActivationRadiusMarker(pts[0], sl.activationRadius, sl.color));
  }

  // Handles (hidden by default, shown on selection)
  const joints = computeJoints(pts);
  const handleEntries = buildHandleMeshes(joints, sl);
  const handleMeshes = handleEntries.map(e => e.mesh);
  handleMeshes.forEach(h => { h.visible = false; });

  // Position all objects in world space
  const wx = arena.posX; const wz = arena.posZ; const wRotY = arena.rotY * DEG2RAD;
  for (const obj of [mesh, edges, ...markerMeshes, ...handleMeshes]) {
    obj.position.set(wx, 0, wz);
    obj.rotation.y = wRotY;
  }

  // Apply enabled flag — disabled SLs are hidden but still built (for editing)
  const vis = sl.enabled !== false;
  mesh.visible = vis; edges.visible = vis;
  markerMeshes.forEach(m => { m.visible = vis; });

  return { mesh, edges, markerMeshes, handleMeshes, totalLength };
}

export function applySpeedLine(
  sl: SpeedLineData,
  arena: ArenaData,
  zones: Map<string, ZoneData>,
  scene: THREE.Scene | null,
  addFn: (...objs: THREE.Object3D[]) => void,
  removeFn: (...objs: THREE.Object3D[]) => void,
  projector?: SceneSurfaceProjector,
): void {
  // Dispose old
  if (sl.mesh) { removeFn(sl.mesh); sl.mesh.geometry.dispose(); (sl.mesh.material as THREE.Material).dispose(); }
  if (sl.edges) { removeFn(sl.edges); sl.edges.geometry.dispose(); (sl.edges.material as THREE.Material).dispose(); }
  for (const m of sl.markerMeshes)   { removeFn(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  for (const m of sl.handleMeshes)   { removeFn(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  for (const m of sl.overlapMarkers) { removeFn(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  sl.markerMeshes = []; sl.handleMeshes = []; sl.overlapMarkers = [];

  // Rebuild
  const { mesh, edges, markerMeshes, handleMeshes, totalLength } = buildSpeedLineObjects(sl, arena, zones, projector);
  sl.mesh = mesh; sl.edges = edges;
  sl.markerMeshes = markerMeshes; sl.handleMeshes = handleMeshes;
  sl.totalLength = totalLength;

  void scene;
  addFn(mesh, edges, ...markerMeshes, ...handleMeshes);
}

/* ── Default data factories ──────────────────────────────────────────────── */
export function defaultArena(name: string): ArenaData {
  return {
    name, openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 50, radiusZ: 50, depth: 20,
    sides: 5, starInner: 0.5, color: 0x888888,
    surface: 'plain', customTileData: null, tileScale: 20,
    baseMaterial: DEFAULT_ARENA_MATERIAL,
    posX: 0, posZ: 0, posY: 0, rotY: 0,
    isMoat: false, innerRadiusX: 25, innerRadiusZ: 25,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    stepApplyToAll: true, stepEdgeProfiles: [], stepArcDivisions: DEFAULT_STEP_ARC_DIVISIONS,
    stepCount: DEFAULT_STEP_COUNT, stepStartDepth: DEFAULT_STEP_START_DEPTH,
    stepRiserProfile: DEFAULT_STEP_RISER,
    rampMode: 'full', rampAngle: DEFAULT_RAMP_ANGLE, rampWidth: DEFAULT_RAMP_WIDTH,
    innerStepCount: DEFAULT_STEP_COUNT, innerStepStartDepth: DEFAULT_STEP_START_DEPTH,
    innerStepRiserProfile: DEFAULT_STEP_RISER,
    innerRampMode: 'full', innerRampAngle: DEFAULT_RAMP_ANGLE, innerRampWidth: DEFAULT_RAMP_WIDTH,
    spiralTurns: DEFAULT_SPIRAL_TURNS, spiralClockwise: true,
    spiralCount: DEFAULT_SPIRAL_COUNT, spiralLedgeWidth: DEFAULT_SPIRAL_LEDGE_W,
    spiralLedgeHeight: DEFAULT_SPIRAL_LEDGE_H, spiralRadiusFrac: DEFAULT_SPIRAL_RADIUS_FRAC,
    spiralMeshes: [],
    innerSpiralTurns: DEFAULT_SPIRAL_TURNS, innerSpiralClockwise: true,
    innerSpiralCount: DEFAULT_SPIRAL_COUNT, innerSpiralLedgeWidth: DEFAULT_SPIRAL_LEDGE_W,
    innerSpiralLedgeHeight: DEFAULT_SPIRAL_LEDGE_H, innerSpiralRadiusFrac: DEFAULT_SPIRAL_RADIUS_FRAC,
    stepsColor: null, stepsSurface: null, stepsCustomTileData: null,
    spiralColor: null, spiralSurface: null, spiralCustomTileData: null,
    lightColor: 0xffffff, lightIntensity: 0, lightPosY: 40, lightRange: 200,
    particlePreset: 'none',
    weatherPreset: 'none', windEnabled: false, windDirectionDeg: 0,
    windStrengthCms: 0, windGustInterval: 4, windGustMult: 2,
    presentStlb64: null, presentColor: 0xaaaaaa,
    pitIds: [], zoneIds: [], wallIds: [], speedLineIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    floorMesh: null, islandMesh: null, rimSeamMesh: null,
    light: null, particleSystem: null, weatherSystem: null,
    gravityScale: ENV.DEFAULT_GRAVITY_SCALE, gravityDirectionX: 0, gravityDirectionZ: 0,
    tiltX: 0, tiltZ: 0,
    weightTiltEnabled: false, weightTiltSensitivity: ENV.DEFAULT_WEIGHT_SENSITIVITY,
    weightTiltDampening: ENV.DEFAULT_WEIGHT_DAMPENING,
    fogDensity: ENV.DEFAULT_FOG_DENSITY,
    scoreMultiplier: ENV.DEFAULT_SCORE_MULTIPLIER, pointsPerSecond: 0,
    weatherSurfaceMap: {},
    envSchedule: [],
    tiltGroup: undefined, fogSystem: null, _score: 0,
  };
}

export function defaultPit(
  name: string, parentArenaId: string, id: string,
): PitData {
  return {
    id, name, parentArenaId,
    openingShape: 'circle',
    radiusX: 10, radiusZ: 10, depth: PIT_FIXED_DEPTH,
    sides: 5, starInner: 0.5, color: 0x555555,
    surface: 'plain', customTileData: null, tileScale: 10,
    rimGlowColor: 0x000000, rimGlowIntensity: 0,
    posR: 0, posAngle: 0, rotY: 0,
    particleConfig: defaultParticleConfig(),
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    seamMesh: null as unknown as THREE.Mesh,
    particleSystem: null,
  };
}

export function defaultZone(
  name: string, parentArenaId: string, id: string,
  parentZoneId: string | null = null,
): ZoneData {
  return {
    id, name, parentArenaId, parentZoneId, openingShape: 'circle',
    radiusX: 15, radiusZ: 15, depth: 8,
    sides: 5, starInner: 0.5, color: 0x336699,
    surface: 'plain', customTileData: null, tileScale: 10,
    fill: 'water', fillColor: null, fillOpacity: 0.65,
    seamGlowColor: 0x000000, seamGlowIntensity: 0,
    particlePreset: 'none',
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    innerStepCount: DEFAULT_STEP_COUNT, innerStepStartDepth: DEFAULT_STEP_START_DEPTH,
    innerStepRiserProfile: DEFAULT_STEP_RISER,
    innerRampMode: 'full' as RampMode, innerRampAngle: DEFAULT_RAMP_ANGLE, innerRampWidth: DEFAULT_RAMP_WIDTH,
    innerSpiralTurns: DEFAULT_SPIRAL_TURNS, innerSpiralClockwise: true,
    innerSpiralCount: DEFAULT_SPIRAL_COUNT, innerSpiralLedgeWidth: DEFAULT_SPIRAL_LEDGE_W,
    innerSpiralLedgeHeight: DEFAULT_SPIRAL_LEDGE_H, innerSpiralRadiusFrac: DEFAULT_SPIRAL_RADIUS_FRAC,
    pitIds: [], zoneIds: [], speedLineIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    seamMesh: null as unknown as THREE.Mesh,
    particleSystem: null,
  };
}

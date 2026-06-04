import * as THREE from 'three';
import { ARENA_ELEVATED_THRESHOLD } from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData, ChildHole, SurfaceMaterialOpts, SurfaceType,
} from '../types/arenaTypes';
import { shapePoints, childArenaBaseY, childWorldPos, makeSurfFn } from './surfaceUtils';
import { extractChildTransform } from './surfaceUtils';
import {
  buildParabolicBowl, buildStraightCut, buildEdgeLines,
  buildMoatGeometry, buildMoatEdgeLines,
  buildFreeArenaMesh, buildFreeArenaEdges,
} from './bowlBuilders';
import { buildScoopPair, buildScoopSeam } from './scoopBuilders';
import { buildSurfaceMaterial, buildFillBowlMaterial, releaseMaterial } from './materialBuilders';
import { zoneFillConfig } from './fillBuilders';

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
export function buildArenaObjects(data: ArenaData, holes: ChildHole[] = []): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(data);
  const mat = buildSurfaceMaterial({ color:data.color, surface:data.surface, customTileData:data.customTileData, tileScale:data.tileScale });
  const baseY = 0;

  let meshGeo: THREE.BufferGeometry;
  let edgeGeo: THREE.BufferGeometry;
  if (data.isMoat) {
    const innerPts = shapePoints({ openingShape:data.innerOpeningShape, radiusX:data.innerRadiusX, radiusZ:data.innerRadiusZ, sides:data.innerSides, starInner:data.innerStarInner });
    meshGeo = buildMoatGeometry(pts, innerPts, data.depth, data.wallProfile, data.innerWallProfile, data.innerRimOffset, baseY);
    edgeGeo = buildMoatEdgeLines(pts, innerPts, data.depth, data.innerRimOffset, baseY);
  } else if (data.posY > ARENA_ELEVATED_THRESHOLD) {
    meshGeo = buildFreeArenaMesh(pts, data.depth, data.wallProfile, baseY, holes);
    edgeGeo = buildFreeArenaEdges(pts, data.depth, baseY);
  } else {
    meshGeo = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth, baseY, holes)
      : buildStraightCut(pts, data.depth, baseY);
    edgeGeo = buildEdgeLines(pts, data.depth, data.wallProfile, baseY);
  }

  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(data.posX, data.posY, data.posZ);
  mesh.rotation.y = data.rotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(data.color) }));
  edges.position.set(data.posX, data.posY, data.posZ);
  edges.rotation.y = data.rotY;
  return [mesh, edges];
}

export function applyArena(data: ArenaData, holes: ChildHole[] = []): void {
  const pts = shapePoints(data);
  data.mesh.geometry.dispose(); data.edges.geometry.dispose();
  const baseY = 0;
  if (data.isMoat) {
    const innerPts = shapePoints({ openingShape:data.innerOpeningShape, radiusX:data.innerRadiusX, radiusZ:data.innerRadiusZ, sides:data.innerSides, starInner:data.innerStarInner });
    data.mesh.geometry  = buildMoatGeometry(pts, innerPts, data.depth, data.wallProfile, data.innerWallProfile, data.innerRimOffset, baseY);
    data.edges.geometry = buildMoatEdgeLines(pts, innerPts, data.depth, data.innerRimOffset, baseY);
  } else if (data.posY > ARENA_ELEVATED_THRESHOLD) {
    data.mesh.geometry  = buildFreeArenaMesh(pts, data.depth, data.wallProfile, baseY, holes);
    data.edges.geometry = buildFreeArenaEdges(pts, data.depth, baseY);
  } else {
    data.mesh.geometry  = data.wallProfile === 'parabolic'
      ? buildParabolicBowl(pts, data.depth, baseY, holes)
      : buildStraightCut(pts, data.depth, baseY);
    data.edges.geometry = buildEdgeLines(pts, data.depth, data.wallProfile, baseY);
  }
  for (const obj of [data.mesh, data.edges]) { obj.position.set(data.posX, data.posY, data.posZ); obj.rotation.y = data.rotY; }
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
  const opts: SurfaceMaterialOpts = { color:data.color, surface:data.surface, customTileData:data.customTileData, tileScale:data.tileScale };
  releaseMaterial(opts);
  data.mesh.material = buildSurfaceMaterial(opts);
  (data.edges.material as THREE.LineBasicMaterial).color.copy(edgeColor(data.color));
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

  const seamMesh = new THREE.Mesh(buildScoopSeam(pts, zoneCX, zoneCZ, zoneRotY, surfFn), buildFillBowlMaterial(fc, zone.fillOpacity));
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
  zone.seamMesh.material = buildFillBowlMaterial(fc, zone.fillOpacity);
  zone.seamMesh.position.set(wx, 0, wz); zone.seamMesh.rotation.y = wRotY;
}

/* ── Default data factories ──────────────────────────────────────────────── */
export function defaultArena(name: string): ArenaData {
  return {
    name, openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 50, radiusZ: 50, depth: 20,
    sides: 5, starInner: 0.5, color: 0x888888,
    surface: 'plain', customTileData: null, tileScale: 20,
    posX: 0, posZ: 0, posY: 0, rotY: 0,
    isMoat: false, innerRadiusX: 25, innerRadiusZ: 25,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    floorMesh: null, islandMesh: null, rimSeamMesh: null,
  };
}

export function defaultPit(
  name: string, parentArenaId: string, id: string,
): PitData {
  return {
    id, name, parentArenaId,
    openingShape: 'circle',
    radiusX: 10, radiusZ: 10, depth: 8,
    sides: 5, starInner: 0.5, color: 0x555555,
    surface: 'plain', customTileData: null, tileScale: 10,
    posR: 0, posAngle: 0, rotY: 0,
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    seamMesh: null as unknown as THREE.Mesh,
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
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    seamMesh: null as unknown as THREE.Mesh,
  };
}

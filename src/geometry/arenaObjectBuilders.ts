import * as THREE from 'three';
import { ARENA_ELEVATED_THRESHOLD } from '../config/arenaConstants';
import {
  ArenaData, PitData, ZoneData, ChildHole, SurfaceMaterialOpts,
} from '../types/arenaTypes';
import { shapePoints, childArenaBaseY, childWorldPos, makeSurfFn } from './surfaceUtils';
import { extractChildTransform } from './surfaceUtils';
import {
  buildParabolicBowl, buildStraightCut, buildEdgeLines,
  buildMoatGeometry, buildMoatEdgeLines,
  buildFreeArenaMesh, buildFreeArenaEdges,
} from './bowlBuilders';
import { buildScoopPair, buildScoopLidGeo, buildScoopSeam } from './scoopBuilders';
import { buildSurfaceMaterial, buildFillBowlMaterial, buildFillLidMaterial, releaseMaterial } from './materialBuilders';
import { buildFillShaderMaterial, buildZoneFillGeo, FILL_WAVE, computeFillY, zoneFillConfig } from './fillBuilders';

/* ══════════════════════════════════════════════════════════════════════════
   Arena object builders — Facade layer.
   Orchestrates geometry builders, material builders, and fill builders into
   complete Three.js objects (Mesh + LineSegments + optional fill/light).
   Changes here when the object assembly pattern changes (positions, rotations,
   disposal sequences, fill-light setup).
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
  const mat = buildSurfaceMaterial({ color:pit.color, surface:pit.surface, customTileData:pit.customTileData, tileScale:pit.tileScale, side: THREE.FrontSide });
  const { cx, cz, rotY: pitRotY } = extractChildTransform(pit);
  const surfFn = makeSurfFn(pit, arena, pits, zones);

  const { meshGeo, edgeGeo } = buildScoopPair(pts, pit.depth, 'straight', cx, cz, pitRotY, surfFn);

  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(pit.color) }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;

  // Seam ring: uses arena surface material to blend seamlessly with the arena
  const seamMat = buildSurfaceMaterial({ color:arena.color, surface:arena.surface, customTileData:arena.customTileData, tileScale:arena.tileScale, side: THREE.DoubleSide });
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
  const surfFn = makeSurfFn(pit, arena, pits, zones);
  pit.mesh.geometry.dispose(); pit.edges.geometry.dispose();

  const { meshGeo, edgeGeo } = buildScoopPair(pts, pit.depth, 'straight', cx, cz, pitRotY, surfFn);
  pit.mesh.geometry = meshGeo; pit.edges.geometry = edgeGeo;

  pit.seamMesh.geometry.dispose();
  pit.seamMesh.geometry = buildScoopSeam(pts, cx, cz, pitRotY, surfFn);

  const { wx, wz, wRotY } = childWorldPos(arena, pit);
  for (const obj of [pit.mesh, pit.edges, pit.seamMesh]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }
}

/* ── Zone ────────────────────────────────────────────────────────────────── */

/* Stencil ref counter — each zone gets a unique ref (1–255, wraps) */
let _stencilCtr = 0;
function nextStencilRef(): number { return (_stencilCtr++ % 255) + 1; }

export function buildZoneObjects(
  zone: ZoneData, arena: ArenaData,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): [THREE.Mesh, THREE.LineSegments, THREE.Mesh, THREE.PointLight | null, THREE.Mesh, THREE.Mesh] {
  const pts = shapePoints(zone);
  const { cx: zoneCX, cz: zoneCZ, rotY: zoneRotY } = extractChildTransform(zone);
  const surfFn = makeSurfFn(zone, arena, pits, zones);
  const fc = zoneFillConfig(zone);
  const sRef = nextStencilRef();

  // Bowl: always parabolic, coloured by fill preset
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
  const mesh = new THREE.Mesh(meshGeo, buildFillBowlMaterial(fc));
  mesh.position.set(wx, 0, wz); mesh.rotation.y = wRotY;
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edgeColor(fc.color) }));
  edges.position.set(wx, 0, wz); edges.rotation.y = wRotY;

  // Lid: curved surface conforming to arena bowl, fill colour + stencil write
  const lidGeo = buildScoopLidGeo(pts, zoneCX, zoneCZ, zoneRotY, surfFn);
  const lidMesh = new THREE.Mesh(lidGeo, buildFillLidMaterial(fc, zone.fillOpacity, sRef));
  lidMesh.position.set(wx, 0, wz); lidMesh.rotation.y = wRotY;

  // Fill wave: inside the bowl, clipped by lid stencil
  const fillY = computeFillY(surfFn, zoneCX, zoneCZ);
  const fillGeo = buildZoneFillGeo(zone);
  const fillMat = buildFillShaderMaterial(fc, FILL_WAVE[zone.fill], sRef);
  const fillMesh = new THREE.Mesh(fillGeo, fillMat);
  fillMesh.position.set(wx, fillY, wz); fillMesh.rotation.y = wRotY;
  fillMesh.onBeforeRender = (_r, _s, _c, _g, mat) => {
    (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now() / 1000;
  };

  let fillLight: THREE.PointLight | null = null;
  if (zone.fillGlow && fc.glowColor !== null) {
    fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX * 1.5);
    fillLight.position.set(wx, fillY + 2, wz);
  }

  // Seam ring: fill colour, same as bowl walls
  const seamMesh = new THREE.Mesh(buildScoopSeam(pts, zoneCX, zoneCZ, zoneRotY, surfFn), buildFillBowlMaterial(fc));
  seamMesh.position.set(wx, 0, wz); seamMesh.rotation.y = wRotY;

  return [mesh, edges, lidMesh, fillLight, fillMesh, seamMesh];
}

export function applyZone(
  zone: ZoneData, arena: ArenaData,
  scene: THREE.Scene | null,
  pits: Map<string, PitData>, zones: Map<string, ZoneData>,
): void {
  const pts = shapePoints(zone);
  const { cx: zoneCX, cz: zoneCZ, rotY: zoneRotY } = extractChildTransform(zone);
  const { wx, wz, wRotY } = childWorldPos(arena, zone);
  const surfFn = makeSurfFn(zone, arena, pits, zones);
  const fillY = computeFillY(surfFn, zoneCX, zoneCZ);
  const fc = zoneFillConfig(zone);

  // Rebuild bowl geometry
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
  // Update bowl material to reflect new fill colour
  (zone.mesh.material as THREE.Material).dispose();
  zone.mesh.material = buildFillBowlMaterial(fc);
  (zone.edges.material as THREE.LineBasicMaterial).color.copy(edgeColor(fc.color));
  for (const obj of [zone.mesh, zone.edges]) { obj.position.set(wx, 0, wz); obj.rotation.y = wRotY; }

  // Rebuild lid geometry and material (preserve stencilRef)
  const sRef = (zone.lidMesh.material as THREE.Material).stencilRef;
  zone.lidMesh.geometry.dispose();
  zone.lidMesh.geometry = buildScoopLidGeo(pts, zoneCX, zoneCZ, zoneRotY, surfFn);
  (zone.lidMesh.material as THREE.Material).dispose();
  zone.lidMesh.material = buildFillLidMaterial(fc, zone.fillOpacity, sRef);
  zone.lidMesh.position.set(wx, 0, wz); zone.lidMesh.rotation.y = wRotY;

  // Rebuild fill geometry and material
  zone.fillMesh.geometry.dispose();
  zone.fillMesh.geometry = buildZoneFillGeo(zone);
  zone.fillMesh.scale.set(1, 1, 1);
  zone.fillMesh.position.set(wx, fillY, wz); zone.fillMesh.rotation.y = wRotY;
  (zone.fillMesh.material as THREE.Material).dispose();
  zone.fillMesh.material = buildFillShaderMaterial(fc, FILL_WAVE[zone.fill], sRef);
  zone.fillMesh.onBeforeRender = (_r, _s, _c, _g, mat) => {
    (mat as THREE.ShaderMaterial).uniforms['uTime'].value = performance.now() / 1000;
  };

  // Rebuild fill light
  if (zone.fillLight) { scene?.remove(zone.fillLight); zone.fillLight.dispose(); zone.fillLight = null; }
  if (zone.fillGlow && fc.glowColor !== null) {
    zone.fillLight = new THREE.PointLight(fc.glowColor, 2, arena.radiusX * 1.5);
    zone.fillLight.position.set(wx, fillY + 2, wz);
    scene?.add(zone.fillLight);
  }

  // Rebuild seam geometry and material
  zone.seamMesh.geometry.dispose();
  zone.seamMesh.geometry = buildScoopSeam(pts, zoneCX, zoneCZ, zoneRotY, surfFn);
  (zone.seamMesh.material as THREE.Material).dispose();
  zone.seamMesh.material = buildFillBowlMaterial(fc);
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
    floorMesh: null, islandMesh: null,
  };
}

export function defaultPit(
  name: string, parentArenaId: string, id: string,
  parentPitId: string | null = null, parentZoneId: string | null = null,
): PitData {
  return {
    id, name, parentArenaId, parentPitId, parentZoneId,
    openingShape: 'circle',
    radiusX: 10, radiusZ: 10, depth: 8,
    sides: 5, starInner: 0.5, color: 0x555555,
    surface: 'plain', customTileData: null, tileScale: 10,
    posR: 0, posAngle: 0, rotY: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    seamMesh: null as unknown as THREE.Mesh,
  };
}

export function defaultZone(
  name: string, parentArenaId: string, id: string,
  parentPitId: string | null = null, parentZoneId: string | null = null,
): ZoneData {
  return {
    id, name, parentArenaId, parentPitId, parentZoneId, openingShape: 'circle',
    radiusX: 15, radiusZ: 15, depth: 8,
    sides: 5, starInner: 0.5, color: 0x336699,
    surface: 'plain', customTileData: null, tileScale: 10,
    fill: 'water', fillColor: null, fillOpacity: 0.65, fillGlow: true,
    posR: 0, posAngle: 0, rotY: 0,
    isMoat: false, innerRadiusX: 8, innerRadiusZ: 8,
    innerOpeningShape: 'circle', innerSides: 5, innerStarInner: 0.5,
    innerWallProfile: 'parabolic', innerRimOffset: 0,
    pitIds: [], zoneIds: [],
    mesh: null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
    lidMesh: null as unknown as THREE.Mesh,
    fillMesh: null as unknown as THREE.Mesh,
    fillLight: null,
    seamMesh: null as unknown as THREE.Mesh,
  };
}

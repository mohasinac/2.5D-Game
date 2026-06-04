import * as THREE from 'three';
import { TWO_PI, DEG2RAD, ARENA_ELEVATED_THRESHOLD } from '../config/arenaConstants';
import { ArenaData, PitData, ZoneData, IslandHole } from '../types/arenaTypes';
import { shapePoints, polarToLocalXZ } from './surfaceUtils';
import { inChildHole } from './primitives';

/* ══════════════════════════════════════════════════════════════════════════
   Platform builders.
   Responsible for flat horizontal surfaces: the octagon top face (with
   arena voids cut in), moat island caps, and straight-wall arena floors.
   Changes here when top-face or floor geometry algorithms change.
   ══════════════════════════════════════════════════════════════════════════ */

/** Top face of base — polygon with voids for arena openings. */
export function buildTopFaceGeo(
  baseSides: number, baseRadius: number, align: number,
  baseHeight: number, arenas: ArenaData[],
): THREE.BufferGeometry {
  const outerPts: THREE.Vector2[] = [];
  for (let i = 0; i < baseSides; i++) {
    const a = i / baseSides * TWO_PI + align;
    outerPts.push(new THREE.Vector2(baseRadius * Math.cos(a), baseRadius * Math.sin(a)));
  }
  const shape = new THREE.Shape(outerPts);
  for (const arena of arenas) {
    if (arena.posY > ARENA_ELEVATED_THRESHOLD) continue; // elevated — no top-face hole
    const aMaxR = Math.max(arena.radiusX, arena.radiusZ);
    const insideOther = arenas.some(other => {
      if (other === arena || other.posY > ARENA_ELEVATED_THRESHOLD) return false;
      if (Math.max(other.radiusX, other.radiusZ) <= aMaxR) return false;
      const dx = arena.posX - other.posX; const dz = arena.posZ - other.posZ;
      const cosR = Math.cos(-other.rotY); const sinR = Math.sin(-other.rotY);
      const lx = dx * cosR - dz * sinR; const lz = dx * sinR + dz * cosR;
      return (lx / other.radiusX) ** 2 + (lz / other.radiusZ) ** 2 <= 1.0;
    });
    if (insideOther) continue;
    const local = shapePoints(arena);
    const cos = Math.cos(arena.rotY); const sin = Math.sin(arena.rotY);
    const holePts = local.map(p => new THREE.Vector2(p.x*cos - p.y*sin + arena.posX, p.x*sin + p.y*cos + arena.posZ)).reverse();
    shape.holes.push(new THREE.Path(holePts));
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI / 2); geo.translate(0, baseHeight, 0);
  return geo;
}

/** Flat arena floor for straight-wall arenas, with pit+zone holes. */
export function buildArenaFloorGeo(arena: ArenaData, pits: PitData[], zones: ZoneData[]): THREE.BufferGeometry {
  const floorY = -arena.depth;
  const cosA = Math.cos(arena.rotY); const sinA = Math.sin(arena.rotY);
  const outerShape2D = shapePoints(arena).map(p => new THREE.Vector2(p.x*cosA - p.y*sinA, p.x*sinA + p.y*cosA));
  const floorShape = new THREE.Shape(outerShape2D);
  for (const child of [...pits, ...zones]) {
    const { lx: localX, lz: localZ } = polarToLocalXZ(child.posR, child.posAngle);
    const wox = localX*cosA - localZ*sinA; const woz = localX*sinA + localZ*cosA;
    const cosC = Math.cos(child.rotY * DEG2RAD); const sinC = Math.sin(child.rotY * DEG2RAD);
    const holePts = shapePoints(child).map(p => new THREE.Vector2(p.x*cosC - p.y*sinC + wox, p.x*sinC + p.y*cosC + woz)).reverse();
    floorShape.holes.push(new THREE.Path(holePts));
  }
  const geo = new THREE.ShapeGeometry(floorShape);
  geo.rotateX(Math.PI / 2); geo.translate(0, floorY, 0);
  return geo;
}

/** Island cap for moat: flat disc at innerRimOffset, with optional holes for nested arenas. */
export function buildIslandCapGeo(arena: ArenaData, holes: IslandHole[] = []): THREE.BufferGeometry {
  const H = arena.innerRimOffset;
  const innerPts = shapePoints({
    openingShape: arena.innerOpeningShape,
    radiusX: arena.innerRadiusX, radiusZ: arena.innerRadiusZ,
    sides: arena.innerSides, starInner: arena.innerStarInner,
  });
  const shape = new THREE.Shape(innerPts);
  for (const h of holes) {
    const holePath = new THREE.Path();
    holePath.absellipse(h.cx, h.cz, h.rx, h.rz, 0, TWO_PI, false, 0);
    shape.holes.push(holePath);
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI / 2); geo.translate(0, H, 0);
  return geo;
}

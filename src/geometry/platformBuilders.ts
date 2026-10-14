import * as THREE from 'three';
import { TWO_PI, DEG2RAD, ARENA_ELEVATED_THRESHOLD } from '../config/arenaConstants';
import { ArenaData, PitData, ZoneData, IslandHole } from '../types/arenaTypes';
import { shapePoints, polarToLocalXZ } from './surfaceUtils';
import { inChildHole } from './primitives';
import { applyPlanarUV } from './uvMapping';

/* ══════════════════════════════════════════════════════════════════════════
   Platform builders.
   Responsible for flat horizontal surfaces: the octagon top face (with
   arena voids cut in), moat island caps, and straight-wall arena floors.
   Changes here when top-face or floor geometry algorithms change.
   ══════════════════════════════════════════════════════════════════════════ */

/** Top face of base — polygon with voids for arena openings. */
/** Ray-crossing point-in-polygon, used to tell a real hole from one that
 *  swallows the shape it is meant to be cut from. */
function pointInPolygon(p: THREE.Vector2, poly: THREE.Vector2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) &&
        p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** A top face with no surface left. Still a valid, UV-bearing geometry so every
 *  caller's dispose/assign path is unchanged. */
function emptyTopFace(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
  geo.setAttribute('uv',  new THREE.Float32BufferAttribute([], 2));
  geo.setAttribute('uv1', new THREE.Float32BufferAttribute([], 2));
  return geo;
}

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
    /* A hole can only be cut from a shape that CONTAINS it. When an arena is
       larger than the base it sits on, Three's triangulator cannot express the
       result and silently emits a SOLID face instead — an opaque lid sealing the
       bowl and everything inside it, with no error anywhere.

       That is exactly what made speed-line ribbons look like they never
       rendered: the shipped demo arena is radius 120 on a base of circumradius
       108.24 (apothem 100, the documented fixed 2 m base), so its top face was
       never actually perforated. What everyone took for the bowl floor was the
       lid; the bowl, its ribbon and its contents were underneath.

       If the opening swallows the whole base there is no top face left, so emit
       nothing rather than a surface that does not exist. */
    if (outerPts.every(p => pointInPolygon(p, holePts))) return emptyTopFace();

    shape.holes.push(new THREE.Path(holePts));
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(Math.PI / 2); geo.translate(0, baseHeight, 0);
  // ShapeGeometry DOES emit UVs, but straight from the 2D shape in centimetres,
  // so a texture would tile 20x too densely against the project's cm/20
  // convention. Re-deriving after the rotate (positions are XZ-planar by then)
  // replaces them at the correct scale.
  applyPlanarUV(geo);
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
  applyPlanarUV(geo);   // see buildTopFaceGeo: rescale ShapeGeometry's cm-space UVs
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
  applyPlanarUV(geo);   // see buildTopFaceGeo: rescale ShapeGeometry's cm-space UVs
  return geo;
}

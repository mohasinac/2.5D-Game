import * as THREE from 'three';
import { RIM_EPS, SEAM_TRANSITION_WIDTH, SEAM_RINGS, TESS } from '../config/arenaConstants';
import { WallProfile } from '../types/arenaTypes';
import { buildParabolicRingGeo, buildRimEdges } from './primitives';

/* ══════════════════════════════════════════════════════════════════════════
   Scoop builders.
   Responsible for pit and zone depression geometry — bowls that conform
   to the parent arena surface curvature. The parabolic ring math is shared
   with bowlBuilders via buildParabolicRingGeo in primitives.ts.
   Changes here when pit/zone conformation algorithm changes.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Surface-conforming bowl for pits/zones.
 * Each vertex Y = surf(x,z) - depression(t) so the rim sits RIM_EPS above
 * the parent surface and the bowl dips below it.
 * Uses buildParabolicRingGeo from primitives.ts — no ring math duplication.
 * Straight-wall pits: single rim→floor strip, no intermediate rings.
 */
export function buildScoopGeometry(
  pts: THREE.Vector2[], depth: number, profile: WallProfile,
  pitCX: number, pitCZ: number, pitRotY: number,
  surfFn: (alx: number, alz: number) => number,
): THREE.BufferGeometry {
  const N = pts.length;
  const cosR = Math.cos(pitRotY); const sinR = Math.sin(pitRotY);

  function surfY(lx: number, lz: number): number {
    return surfFn(pitCX + lx * cosR - lz * sinR, pitCZ + lx * sinR + lz * cosR);
  }

  if (profile === 'parabolic') {
    const centerSurfY = surfY(0, 0);
    // yFn: at t=1 → sy + RIM_EPS (rim above surface); at t=0 → centerSurfY - depth (bowl bottom)
    const yFn = (lx: number, lz: number, t: number): number => {
      const sy = t === 0 ? centerSurfY : surfY(lx, lz);
      return sy - depth * (1 - t * t) + RIM_EPS * t * t;
    };
    return buildParabolicRingGeo(pts, TESS.SCOOP_RINGS, yFn);
  }

  // Straight-wall scoop — rim + floor only, vertical walls, no intermediate rings
  const pos: number[] = [];
  const idx: number[] = [];
  const floorY = surfY(0, 0) - depth;

  // Ring 0: rim vertices at surface + RIM_EPS
  for (let i = 0; i < N; i++) {
    pos.push(pts[i].x, surfY(pts[i].x, pts[i].y) + RIM_EPS, pts[i].y);
  }
  // Ring 1: floor ring at same XZ as rim, depth below
  for (let i = 0; i < N; i++) {
    pos.push(pts[i].x, floorY, pts[i].y);
  }
  // Center floor vertex
  const floorVtx = 2 * N;
  pos.push(0, floorY, 0);

  // Wall strip: rim (ring 0) → floor (ring 1)
  for (let i = 0; i < N; i++) {
    const a0 = i, c0 = (i + 1) % N, a1 = N + i, c1 = N + (i + 1) % N;
    idx.push(a0, a1, c0, c0, a1, c1);
  }
  // Floor fan
  for (let i = 0; i < N; i++) idx.push(floorVtx, N + (i + 1) % N, N + i);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Edge lines for a surface-conforming scoop. */
export function buildScoopEdgeLines(
  pts: THREE.Vector2[], depth: number, profile: WallProfile,
  pitCX: number, pitCZ: number, pitRotY: number,
  surfFn: (alx: number, alz: number) => number,
): THREE.BufferGeometry {
  const N = pts.length;
  const cosR = Math.cos(pitRotY); const sinR = Math.sin(pitRotY);

  function surfY(lx: number, lz: number): number {
    return surfFn(pitCX + lx * cosR - lz * sinR, pitCZ + lx * sinR + lz * cosR);
  }

  const centerSurfY = surfY(0, 0);
  const bottomY = centerSurfY - depth;

  // Rim loop — shared primitive
  const v = buildRimEdges(
    pts.map(p => new THREE.Vector2(p.x, p.y)),
    // dummy baseY — not used; we compute actual Y per-vertex below
    0,
  );
  // Rebuild rim with actual per-vertex surface Y (can't use buildRimEdges directly because Y varies)
  v.length = 0;
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i + 1) % N];
    const ay = surfY(a.x, a.y) + RIM_EPS;
    const by = surfY(b.x, b.y) + RIM_EPS;
    v.push(a.x, ay, a.y, b.x, by, b.y);
  }

  // Depth guides at ~8 evenly-spaced rim vertices
  const step = Math.max(1, Math.floor(N / 8));
  for (let i = 0; i < N; i += step) {
    const p = pts[i]; const rimY = surfY(p.x, p.y) + RIM_EPS;
    if (profile === 'parabolic') {
      for (let s = 0; s < 12; s++) {
        const t0 = s / 12; const t1 = (s + 1) / 12;
        const sy0 = surfY(p.x * t0, p.y * t0); const sy1 = surfY(p.x * t1, p.y * t1);
        const y0 = t0 === 0 ? bottomY : sy0 - depth * (1 - t0 * t0) + RIM_EPS * t0 * t0;
        const y1 = t1 === 1 ? rimY    : sy1 - depth * (1 - t1 * t1) + RIM_EPS * t1 * t1;
        v.push(p.x * t0, y0, p.y * t0, p.x * t1, y1, p.y * t1);
      }
    } else {
      v.push(p.x, rimY, p.y, p.x, bottomY, p.y);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/* ── Shared scoop mesh+edges factory ────────────────────────────────────────
   Pits and zones call buildScoopGeometry + buildScoopEdgeLines identically.
   This helper encapsulates both calls so the pair stays in sync.
────────────────────────────────────────────────────────────────────────── */
export function buildScoopPair(
  pts: THREE.Vector2[], depth: number, wallProfile: WallProfile,
  cx: number, cz: number, rotY: number,
  surfFn: (alx: number, alz: number) => number,
): { meshGeo: THREE.BufferGeometry; edgeGeo: THREE.BufferGeometry } {
  return {
    meshGeo: buildScoopGeometry(pts, depth, wallProfile, cx, cz, rotY, surfFn),
    edgeGeo: buildScoopEdgeLines(pts, depth, wallProfile, cx, cz, rotY, surfFn),
  };
}

/**
 * Lid geometry for zones — a curved surface that conforms exactly to the
 * parent arena bowl curvature, sitting flush at the zone rim.
 * Reuses buildScoopGeometry(depth=0, parabolic): at depth=0 every vertex Y
 * = surfFn(alx,alz) + RIM_EPS*t², tracing the arena surface with a tiny
 * anti-z-fight lift.
 */
export function buildScoopLidGeo(
  pts: THREE.Vector2[], cx: number, cz: number, rotY: number,
  surfFn: (alx: number, alz: number) => number,
): THREE.BufferGeometry {
  return buildScoopGeometry(pts, 0, 'parabolic', cx, cz, rotY, surfFn);
}

/**
 * Seam collar — a multi-ring transition strip radiating outward from the
 * pit/zone rim onto the parent arena surface.  Each ring follows the arena
 * bowl curvature so the collar blends smoothly from the scoop rim into the
 * surrounding surface, covering all jagged triangle artifacts produced by the
 * arena bowl's hole-skipping tessellation.
 *
 * Ring 0  (inner): zone/pit rim at surfFn + RIM_EPS.
 * Ring SEAM_RINGS (outer): arena surface SEAM_TRANSITION_WIDTH cm outward, flush.
 * Intermediate rings follow the arena surface Y, with RIM_EPS fading to zero.
 */
export function buildScoopSeam(
  pts: THREE.Vector2[], cx: number, cz: number, rotY: number,
  surfFn: (alx: number, alz: number) => number,
): THREE.BufferGeometry {
  const N = pts.length;
  const cosR = Math.cos(rotY); const sinR = Math.sin(rotY);

  function surfY(lx: number, lz: number): number {
    return surfFn(cx + lx * cosR - lz * sinR, cz + lx * sinR + lz * cosR);
  }

  const pos: number[] = [];
  const idx: number[] = [];

  for (let r = 0; r <= SEAM_RINGS; r++) {
    const t = r / SEAM_RINGS; // 0 = rim, 1 = outer edge
    for (let i = 0; i < N; i++) {
      const lx = pts[i].x; const lz = pts[i].y;
      const len = Math.sqrt(lx * lx + lz * lz);
      const ox = len > 0 ? lx + (lx / len) * SEAM_TRANSITION_WIDTH * t : lx;
      const oz = len > 0 ? lz + (lz / len) * SEAM_TRANSITION_WIDTH * t : lz;
      // Rim gets RIM_EPS lift above surface; outer edge is flush; interpolate linearly
      pos.push(ox, surfY(ox, oz) + RIM_EPS * (1 - t), oz);
    }
  }

  for (let r = 0; r < SEAM_RINGS; r++) {
    for (let i = 0; i < N; i++) {
      const i0 = r * N + i;       const i1 = r * N + (i + 1) % N;
      const o0 = (r + 1) * N + i; const o1 = (r + 1) * N + (i + 1) % N;
      idx.push(i0, i1, o0, i1, o1, o0);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

import * as THREE from 'three';
import { ChildHole } from '../types/arenaTypes';

/* ══════════════════════════════════════════════════════════════════════════
   Shared geometry primitives.
   These are the lowest-level building blocks — no imports from other
   geometry files. All higher-level builders (bowlBuilders, scoopBuilders,
   etc.) call these instead of duplicating the ring/edge math.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Hole test (exported, used by callers that only need a point test) ─── */
export function inChildHole(x: number, z: number, holes: ChildHole[]): boolean {
  for (const h of holes) {
    if (_ptInHole(x, z, h)) return true;
  }
  return false;
}

/* ── Internal helpers ────────────────────────────────────────────────────
   These implement exact polygon-clipping for hole boundaries so the
   tessellation boundary matches the hole shape precisely — no centroid skip,
   no staircase, works for every opening shape (circle, triangle, star, …).
────────────────────────────────────────────────────────────────────────── */

/** Exact point-in-hole test for a single hole (no inflation). */
function _ptInHole(x: number, z: number, h: ChildHole): boolean {
  const dx = x - h.cx; const dz = z - h.cz;
  const c = Math.cos(-h.rotY); const s = Math.sin(-h.rotY);
  const lx = dx * c - dz * s; const lz = dx * s + dz * c;
  if (h.pts) {
    const pts = h.pts; const n = pts.length;
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      if ((pts[i].y > lz) !== (pts[j].y > lz) &&
          lx < (pts[j].x - pts[i].x) * (lz - pts[i].y) / (pts[j].y - pts[i].y) + pts[i].x)
        inside = !inside;
    }
    return inside;
  }
  return (lx / h.rx) ** 2 + (lz / h.rz) ** 2 <= 1.0;
}

/**
 * Find the first t ∈ [0,1] where segment (x0,z0)→(x1,z1) crosses the
 * boundary of hole h (in arena-local XZ).  Returns -1 if no crossing.
 */
function _crossingT(
  x0: number, z0: number, x1: number, z1: number, h: ChildHole,
): number {
  const c = Math.cos(-h.rotY); const s = Math.sin(-h.rotY);
  const dx0 = x0 - h.cx; const dz0 = z0 - h.cz;
  const dx1 = x1 - h.cx; const dz1 = z1 - h.cz;
  const lx0 = dx0 * c - dz0 * s; const lz0 = dx0 * s + dz0 * c;
  const lx1 = dx1 * c - dz1 * s; const lz1 = dx1 * s + dz1 * c;
  const dlx = lx1 - lx0; const dlz = lz1 - lz0;
  let best = Infinity;

  if (h.pts) {
    const pts = h.pts; const n = pts.length;
    for (let i = 0; i < n; i++) {
      const ax = pts[i].x; const az = pts[i].y;
      const bx = pts[(i + 1) % n].x; const bz = pts[(i + 1) % n].y;
      const denom = dlx * (bz - az) - dlz * (bx - ax);
      if (Math.abs(denom) < 1e-10) continue;
      const t  = ((ax - lx0) * (bz - az) - (az - lz0) * (bx - ax)) / denom;
      const s2 = ((ax - lx0) * dlz       - (az - lz0) * dlx)       / denom;
      if (t >= -1e-6 && t <= 1 + 1e-6 && s2 >= -1e-6 && s2 <= 1 + 1e-6)
        best = Math.min(best, Math.max(0, t));
    }
  } else {
    const rx = h.rx; const rz = h.rz;
    const a  = (dlx / rx) ** 2 + (dlz / rz) ** 2;
    const b  = 2 * (lx0 * dlx / rx ** 2 + lz0 * dlz / rz ** 2);
    const cc = (lx0 / rx) ** 2 + (lz0 / rz) ** 2 - 1;
    const disc = b * b - 4 * a * cc;
    if (disc >= 0) {
      const sq = Math.sqrt(disc);
      for (const t of [(-b - sq) / (2 * a), (-b + sq) / (2 * a)])
        if (t >= -1e-6 && t <= 1 + 1e-6) best = Math.min(best, Math.max(0, t));
    }
  }
  return best === Infinity ? -1 : best;
}

/** 3-D vertex in arena-local XZ (x=lx, z=lz) with computed world Y. */
type V3 = { x: number; y: number; z: number };

/**
 * Clip a convex polygon to the EXTERIOR of a single hole.
 * Walk around the polygon: keep outside vertices, insert intersection
 * vertices wherever an edge crosses the hole boundary.
 * Works for convex holes and simple concave holes (e.g. stars).
 */
function _clipToExterior(poly: V3[], h: ChildHole): V3[] {
  const n = poly.length;
  const ins = poly.map(v => _ptInHole(v.x, v.z, h));
  if (ins.every(v => !v)) return poly;   // all outside — unchanged
  if (ins.every(v =>  v)) return [];     // all inside  — removed
  const result: V3[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const v0 = poly[i]; const v1 = poly[j];
    const in0 = ins[i]; const in1 = ins[j];
    if (!in0) result.push(v0);
    if (in0 !== in1) {
      const t = _crossingT(v0.x, v0.z, v1.x, v1.z, h);
      if (t >= 0) result.push({
        x: v0.x + t * (v1.x - v0.x),
        y: v0.y + t * (v1.y - v0.y),
        z: v0.z + t * (v1.z - v0.z),
      });
    }
  }
  return result;
}

/**
 * Clip a primitive (triangle or quad) against all holes, then
 * fan-triangulate the surviving polygon into pos/idx arrays.
 * flip=true reverses winding (for downward-facing normals).
 */
function _addClipped(
  verts: V3[], holes: ChildHole[],
  pos: number[], idx: number[], flip: boolean,
): void {
  let poly = verts;
  for (const h of holes) {
    poly = _clipToExterior(poly, h);
    if (poly.length < 3) return;
  }
  const base = pos.length / 3;
  for (const v of poly) pos.push(v.x, v.y, v.z);
  for (let i = 1; i < poly.length - 1; i++) {
    if (flip) idx.push(base, base + i + 1, base + i);
    else      idx.push(base, base + i, base + i + 1);
  }
}

/* ── Parabolic ring geometry ─────────────────────────────────────────────
   Single implementation of "concentric rings with per-vertex Y via yFn".
   yFn is the only specialisation hook:
     Bowl:  (lx, lz, t) => baseY - depth*(1-t²)
     Scoop: (lx, lz, t) => surfFn(lx,lz) - depth*(1-t²) + RIM_EPS*t²

   No-holes path: shared vertex indices (fast).
   Holes path: per-primitive polygon clipping — hole boundaries are exact
   edges in the triangulation, so no staircase artefacts for any shape.
────────────────────────────────────────────────────────────────────────── */
export type RingYFn = (lx: number, lz: number, t: number) => number;

export function buildParabolicRingGeo(
  pts: THREE.Vector2[],
  rings: number,
  yFn: RingYFn,
  holes: ChildHole[] = [],
  centerFlip = false,
): THREE.BufferGeometry {
  const N = pts.length;
  const pos: number[] = [];
  const idx: number[] = [];

  if (holes.length === 0) {
    /* ── Fast path: shared vertices ──────────────────────────────────── */
    pos.push(0, yFn(0, 0, 0), 0);
    for (let r = 1; r <= rings; r++) {
      const t = r / rings;
      for (let i = 0; i < N; i++) {
        const lx = pts[i].x * t; const lz = pts[i].y * t;
        pos.push(lx, yFn(lx, lz, t), lz);
      }
    }
    for (let i = 0; i < N; i++) {
      const a = 1 + i; const b = 1 + (i + 1) % N;
      centerFlip ? idx.push(0, b, a) : idx.push(0, a, b);
    }
    for (let r = 1; r < rings; r++) {
      const b0 = 1 + (r - 1) * N; const b1 = 1 + r * N;
      for (let i = 0; i < N; i++) {
        const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
        const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
        idx.push(a0, c0, a1, c0, c1, a1);
      }
    }
  } else {
    /* ── Holes path: exact polygon clipping ──────────────────────────── */
    // Pre-compute all ring vertices.
    const center: V3 = { x: 0, y: yFn(0, 0, 0), z: 0 };
    const ringV: V3[][] = [];
    for (let r = 1; r <= rings; r++) {
      const t = r / rings; const row: V3[] = [];
      for (let i = 0; i < N; i++) {
        const lx = pts[i].x * t; const lz = pts[i].y * t;
        row.push({ x: lx, y: yFn(lx, lz, t), z: lz });
      }
      ringV.push(row);
    }
    // Center fan: each triangle is (center, ring0[i], ring0[i+1])
    for (let i = 0; i < N; i++) {
      _addClipped([center, ringV[0][i], ringV[0][(i + 1) % N]], holes, pos, idx, centerFlip);
    }
    // Ring strips: each quad becomes two triangles matching original winding
    for (let r = 0; r < rings - 1; r++) {
      const inner = ringV[r]; const outer = ringV[r + 1];
      for (let i = 0; i < N; i++) {
        const a0 = inner[i]; const c0 = inner[(i + 1) % N];
        const a1 = outer[i]; const c1 = outer[(i + 1) % N];
        _addClipped([a0, c0, a1], holes, pos, idx, false);
        _addClipped([c0, c1, a1], holes, pos, idx, false);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ── Parabolic ring section — appends into existing pos/idx arrays ───────
   Used by buildFreeArenaMesh which builds a composite geometry (interior
   bowl + outer skirt + bottom cap) into a single buffer.
   Returns the new base offset after all vertices added.
────────────────────────────────────────────────────────────────────────── */
export function appendParabolicBowlSection(
  pts: THREE.Vector2[],
  rings: number,
  depth: number,
  baseY: number,
  pos: number[],
  idx: number[],
  base: number,
  holes: ChildHole[],
): number {
  const N = pts.length;
  const floorY = baseY - depth;
  const yFn = (_lx: number, _lz: number, t: number): number => baseY - depth * (1 - t * t);

  if (holes.length === 0) {
    /* Fast path */
    pos.push(0, floorY, 0);
    for (let r = 1; r <= rings; r++) {
      const t = r / rings; const y = baseY - depth * (1 - t * t);
      for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
    }
    for (let i = 0; i < N; i++) {
      const a = base + 1 + i; const b = base + 1 + (i + 1) % N;
      idx.push(base + 0, b, a); // flip
    }
    for (let r = 1; r < rings; r++) {
      const b0 = base + 1 + (r - 1) * N; const b1 = base + 1 + r * N;
      for (let i = 0; i < N; i++) {
        const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
        const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
        idx.push(a0, c0, a1, c0, c1, a1);
      }
    }
    return base + 1 + rings * N;
  }

  /* Holes path: polygon clipping — vertices added dynamically so base tracking is via pos.length */
  const center: V3 = { x: 0, y: floorY, z: 0 };
  const ringV: V3[][] = [];
  for (let r = 1; r <= rings; r++) {
    const t = r / rings; const row: V3[] = [];
    for (let i = 0; i < N; i++) {
      const lx = pts[i].x * t; const lz = pts[i].y * t;
      row.push({ x: lx, y: yFn(lx, lz, t), z: lz });
    }
    ringV.push(row);
  }
  // We must still push center vertex to keep pos/base in sync for the outer code that
  // builds the skirt. But with dynamic clipping the inner bowl doesn't use a fixed base.
  // Solution: build the clipped bowl into a temporary buffer and copy in.
  const tmpPos: number[] = []; const tmpIdx: number[] = [];
  for (let i = 0; i < N; i++) {
    _addClipped([center, ringV[0][i], ringV[0][(i + 1) % N]], holes, tmpPos, tmpIdx, true);
  }
  for (let r = 0; r < rings - 1; r++) {
    const inner = ringV[r]; const outer = ringV[r + 1];
    for (let i = 0; i < N; i++) {
      const a0 = inner[i]; const c0 = inner[(i + 1) % N];
      const a1 = outer[i]; const c1 = outer[(i + 1) % N];
      _addClipped([a0, c0, a1], holes, tmpPos, tmpIdx, false);
      _addClipped([c0, c1, a1], holes, tmpPos, tmpIdx, false);
    }
  }
  const tmpBase = pos.length / 3;
  for (const v of tmpPos) pos.push(v);
  for (const i of tmpIdx) idx.push(tmpBase + i);

  return tmpBase + tmpPos.length / 3;
}

/* ── Rim edge loop ───────────────────────────────────────────────────────
   Returns line-segment pairs (x0,y0,z0, x1,y1,z1) as a flat number array.
   Used by buildEdgeLines, buildMoatEdgeLines, buildScoopEdgeLines.
────────────────────────────────────────────────────────────────────────── */
export function buildRimEdges(pts: THREE.Vector2[], baseY: number): number[] {
  const N = pts.length;
  const v: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i + 1) % N];
    v.push(a.x, baseY, a.y, b.x, baseY, b.y);
  }
  return v;
}

/* ── Floor loop + vertical pillars ──────────────────────────────────────
   Pairs well with buildRimEdges to form a straight-wall edge wireframe.
────────────────────────────────────────────────────────────────────────── */
export function buildFloorAndPillarEdges(pts: THREE.Vector2[], baseY: number, depth: number): number[] {
  const N = pts.length;
  const floorY = baseY - depth;
  const v: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = pts[i]; const b = pts[(i + 1) % N];
    v.push(a.x, floorY, a.y, b.x, floorY, b.y);
  }
  const step = Math.max(1, Math.floor(N / 8));
  for (let i = 0; i < N; i += step) {
    v.push(pts[i].x, baseY, pts[i].y, pts[i].x, floorY, pts[i].y);
  }
  return v;
}

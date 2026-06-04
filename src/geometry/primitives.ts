import * as THREE from 'three';
import { ChildHole } from '../types/arenaTypes';

/* ══════════════════════════════════════════════════════════════════════════
   Shared geometry primitives.
   These are the lowest-level building blocks — no imports from other
   geometry files. All higher-level builders (bowlBuilders, scoopBuilders,
   etc.) call these instead of duplicating the ring/edge math.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Hole test ────────────────────────────────────────────────────────────
   Used by bowl builders to skip triangles inside child openings.
   Lives here (not surfaceUtils) so primitives has no upward import.
────────────────────────────────────────────────────────────────────────── */
export function inChildHole(x: number, z: number, holes: ChildHole[]): boolean {
  for (const h of holes) {
    const dx = x - h.cx; const dz = z - h.cz;
    const c = Math.cos(-h.rotY); const s = Math.sin(-h.rotY);
    const lx = dx * c - dz * s; const lz = dx * s + dz * c;
    if ((lx / h.rx) ** 2 + (lz / h.rz) ** 2 <= 1.08) return true;
  }
  return false;
}

/* ── Parabolic ring geometry ─────────────────────────────────────────────
   Single implementation of "concentric rings with per-vertex Y via yFn".
   yFn is the only specialisation hook:
     Bowl:  (lx, lz, t) => baseY - depth*(1-t²)
     Scoop: (lx, lz, t) => surfFn(lx,lz) - depth*(1-t²) + RIM_EPS*t²

   Returns a complete BufferGeometry (center fan + ring strips + normals).
   Callers control both the ring count and the y function.

   centerFlip: when true, reverses the center-fan winding so normals point
   downward (used by parabolic-bowl variants where the bowl is viewed from
   above and the back-face is shown). Scoop geometry uses the default
   (normals up, front-face visible from above).
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

  // Center vertex at t=0
  pos.push(0, yFn(0, 0, 0), 0);

  // Ring vertices
  for (let r = 1; r <= rings; r++) {
    const t = r / rings;
    for (let i = 0; i < N; i++) {
      const lx = pts[i].x * t;
      const lz = pts[i].y * t;
      pos.push(lx, yFn(lx, lz, t), lz);
    }
  }

  const hasHoles = holes.length > 0;

  // Center fan
  for (let i = 0; i < N; i++) {
    const a = 1 + i;
    const b = 1 + (i + 1) % N;
    if (hasHoles) {
      const cx = (pos[0] + pos[a * 3] + pos[b * 3]) / 3;
      const cz = (pos[2] + pos[a * 3 + 2] + pos[b * 3 + 2]) / 3;
      if (inChildHole(cx, cz, holes)) continue;
    }
    // centerFlip=true → (0, b, a) normal-down; false → (0, a, b) normal-up
    centerFlip ? idx.push(0, b, a) : idx.push(0, a, b);
  }

  // Ring strips (same winding for both)
  for (let r = 1; r < rings; r++) {
    const b0 = 1 + (r - 1) * N;
    const b1 = 1 + r * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
      const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
      if (hasHoles) {
        const qx = (pos[a0 * 3] + pos[c0 * 3] + pos[a1 * 3] + pos[c1 * 3]) / 4;
        const qz = (pos[a0 * 3 + 2] + pos[c0 * 3 + 2] + pos[a1 * 3 + 2] + pos[c1 * 3 + 2]) / 4;
        if (inChildHole(qx, qz, holes)) continue;
      }
      idx.push(a0, c0, a1, c0, c1, a1);
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

  pos.push(0, floorY, 0); // center
  for (let r = 1; r <= rings; r++) {
    const t = r / rings;
    const y = baseY - depth * (1 - t * t);
    for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
  }

  // Center fan (flip=true → normals toward interior of composite mesh)
  for (let i = 0; i < N; i++) {
    const a = base + 1 + i;
    const b = base + 1 + (i + 1) % N;
    if (holes.length > 0) {
      const cx = (pos[base * 3] + pos[a * 3] + pos[b * 3]) / 3;
      const cz = (pos[base * 3 + 2] + pos[a * 3 + 2] + pos[b * 3 + 2]) / 3;
      if (inChildHole(cx, cz, holes)) continue;
    }
    idx.push(base + 0, b, a); // flip
  }

  // Ring strips
  for (let r = 1; r < rings; r++) {
    const b0 = base + 1 + (r - 1) * N;
    const b1 = base + 1 + r * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i; const c0 = b0 + (i + 1) % N;
      const a1 = b1 + i; const c1 = b1 + (i + 1) % N;
      if (holes.length > 0) {
        const qx = (pos[a0 * 3] + pos[c0 * 3] + pos[a1 * 3] + pos[c1 * 3]) / 4;
        const qz = (pos[a0 * 3 + 2] + pos[c0 * 3 + 2] + pos[a1 * 3 + 2] + pos[c1 * 3 + 2]) / 4;
        if (inChildHole(qx, qz, holes)) continue;
      }
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }

  return base + 1 + rings * N;
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

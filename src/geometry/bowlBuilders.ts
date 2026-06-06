import * as THREE from 'three';
import { TESS, STEP_SLOPE_FRAC } from '../config/arenaConstants';
import { WallProfile, ChildHole } from '../types/arenaTypes';
import {
  buildParabolicRingGeo,
  appendParabolicBowlSection,
  buildRimEdges,
  buildFloorAndPillarEdges,
  inChildHole,
} from './primitives';
import { resamplePts } from './surfaceUtils';

/* ══════════════════════════════════════════════════════════════════════════
   Bowl builders.
   Responsible for arena bowl geometry: parabolic bowls, straight cuts,
   moat rings, and free-standing arena meshes.
   Changes here when bowl shape algorithms change (not ring count — that's
   in arenaConstants.TESS, not the parabolic math — that's in primitives.ts).
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Parabolic bowl: opening at y=baseY, deepest at y=baseY−depth.
 * When holes[] is provided, triangles whose centroid falls inside a hole are skipped.
 */
export function buildParabolicBowl(
  pts: THREE.Vector2[], depth: number,
  baseY = 0,
  holes: ChildHole[] = [],
): THREE.BufferGeometry {
  const rings = holes.length > 0 ? TESS.PARABOLIC_BOWL * 2 : TESS.PARABOLIC_BOWL;
  const yFn = (_lx: number, _lz: number, t: number): number => baseY - depth * (1 - t * t);
  // centerFlip=true → same winding as original buildParabolicBowl (normals toward interior)
  return buildParabolicRingGeo(pts, rings, yFn, holes, true);
}

export function buildStraightCut(pts: THREE.Vector2[], depth: number, baseY = 0): THREE.BufferGeometry {
  const N = pts.length;
  const pos: number[] = []; const idx: number[] = [];
  for (const p of pts) pos.push(p.x, baseY, p.y);
  for (const p of pts) pos.push(p.x, baseY - depth, p.y);
  pos.push(0, baseY - depth, 0);
  for (let i = 0; i < N; i++) {
    const t0=i, t1=(i+1)%N, b0=N+i, b1=N+(i+1)%N;
    idx.push(t0, t1, b0, t1, b1, b0);
  }
  for (let i = 0; i < N; i++) idx.push(2 * N, N + (i + 1) % N, N + i);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

export function buildEdgeLines(pts: THREE.Vector2[], depth: number, profile: WallProfile, baseY = 0): THREE.BufferGeometry {
  const v = [
    ...buildRimEdges(pts, baseY),
    ...(profile === 'straight' ? buildFloorAndPillarEdges(pts, baseY, depth) : []),
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/**
 * Unified moat geometry: outer rim → valley → inner rim.
 * outerProfile controls outer wall, innerProfile controls inner wall.
 * 'step' builds terraced steps; 'spiral'/'parabolic' builds a curved bowl;
 * 'straight' builds a vertical cylinder.
 * outerStepCount/outerStepStart control the outer stepped wall;
 * innerStepCount/innerStepStart control the inner stepped wall independently.
 * stepStart is the depth at which stepping begins (smooth section above it).
 */
export function buildMoatGeometry(
  outerPts: THREE.Vector2[], _innerPts: THREE.Vector2[],
  depth: number,
  outerProfile: WallProfile, innerProfile: WallProfile,
  innerRimOffset: number,
  baseY = 0,
  outerStepCount = 3,
  outerStepStart = 0,
  innerStepCount = 3,
  innerStepStart = 0,
): THREE.BufferGeometry {
  const N = outerPts.length;
  const innerPts = resamplePts(_innerPts, N);
  const HALF = TESS.MOAT_HALF;
  const flatFrac = 1 - STEP_SLOPE_FRAC;  // flat tread fraction per step
  const valleyY = baseY - depth;
  const innerRise = depth + innerRimOffset;

  const midPts = outerPts.map((op, i) => new THREE.Vector2(
    (op.x + innerPts[i].x) / 2, (op.y + innerPts[i].y) / 2,
  ));

  // Build a ring by lerping between two point arrays at fraction b with given Y
  function makeRing(
    pA: THREE.Vector2[], pB: THREE.Vector2[], b: number, y: number,
  ): [number, number, number][] {
    const row: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      row.push([pA[i].x * (1 - b) + pB[i].x * b, y, pA[i].y * (1 - b) + pB[i].y * b]);
    }
    return row;
  }

  // For floor-strip decision: 'step' and 'spiral' are treated like 'parabolic'
  const outerIsStep    = outerProfile === 'step';
  const innerIsStep    = innerProfile === 'step';
  const outerIsStraight = outerProfile === 'straight';
  const innerIsStraight = innerProfile === 'straight';
  const needsFloor = outerIsStraight || innerIsStraight;

  // Where each wall ends/begins horizontally at valley level
  const outerEndXZ   = outerIsStraight ? outerPts : midPts;
  const innerStartXZ = innerIsStraight ? innerPts  : midPts;

  const allRings: [number, number, number][][] = [];

  // ── Outer section: outer rim → valley ──────────────────────────────────────
  if (outerIsStep) {
    const sN = Math.max(1, outerStepCount);
    const smoothDepth = Math.max(0, Math.min(outerStepStart, depth - sN));
    const stepDepth = depth - smoothDepth;
    const smoothFrac = smoothDepth / depth;
    allRings.push(makeRing(outerPts, midPts, 0, baseY));  // rim ring
    // Smooth initial section before steps begin
    if (smoothFrac > 0) {
      const SMOOTH = 4;
      for (let r = 1; r <= SMOOTH; r++) {
        const t = r / SMOOTH;
        allRings.push(makeRing(outerPts, midPts, t * smoothFrac, baseY - smoothDepth * t));
      }
    }
    // Stepped section
    for (let k = 0; k < sN; k++) {
      const b1 = smoothFrac + (k / sN + flatFrac / sN) * (1 - smoothFrac);
      const b2 = smoothFrac + ((k + 1) / sN) * (1 - smoothFrac);
      const Y0 = baseY - smoothDepth - k * stepDepth / sN;
      const Y2 = baseY - smoothDepth - (k + 1) * stepDepth / sN;
      allRings.push(makeRing(outerPts, midPts, b1, Y0));
      allRings.push(makeRing(outerPts, midPts, b2, Y2));
    }
  } else {
    // Smooth outer: parabolic (incl. spiral), straight
    for (let r = 0; r <= HALF; r++) {
      const b = r / HALF;
      const t = 1 - b;
      const y = outerIsStraight ? baseY - depth * b : baseY - depth * (1 - t * t);
      allRings.push(makeRing(outerPts, outerEndXZ, b, y));
    }
  }

  // ── Floor strip (only when at least one wall is straight) ────────────────
  if (needsFloor) {
    const FLOOR = 8;
    for (let r = 1; r <= FLOOR; r++) {
      const b = r / FLOOR;
      allRings.push(makeRing(outerEndXZ, innerStartXZ, b, valleyY));
    }
  }

  // ── Inner section: valley → inner rim ────────────────────────────────────
  if (innerIsStep) {
    const sN = Math.max(1, innerStepCount);
    const smoothHeight = Math.max(0, Math.min(innerStepStart, innerRise - sN));
    const stepHeight = innerRise - smoothHeight;
    const smoothFrac = smoothHeight / innerRise;
    // Smooth initial section at valley bottom before steps begin
    if (smoothFrac > 0) {
      const SMOOTH = 4;
      for (let r = 0; r < SMOOTH; r++) {
        const t = r / SMOOTH;
        allRings.push(makeRing(innerStartXZ, innerPts, t * smoothFrac, valleyY + smoothHeight * t));
      }
    }
    // Stepped section
    for (let k = 0; k < sN; k++) {
      const b1 = smoothFrac + (k / sN + flatFrac / sN) * (1 - smoothFrac);
      const b2 = smoothFrac + ((k + 1) / sN) * (1 - smoothFrac);
      const Y0 = valleyY + smoothHeight + k * stepHeight / sN;
      const Y2 = valleyY + smoothHeight + (k + 1) * stepHeight / sN;
      allRings.push(makeRing(innerStartXZ, innerPts, b1, Y0));
      allRings.push(makeRing(innerStartXZ, innerPts, b2, Y2));
    }
  } else if (needsFloor) {
    // Inner section after floor strip
    for (let r = 1; r <= HALF; r++) {
      const b = r / HALF;
      const y = innerIsStraight ? valleyY + innerRise * b : valleyY + innerRise * b * b;
      allRings.push(makeRing(innerStartXZ, innerPts, b, y));
    }
  } else {
    // Both non-straight (parabolic/step/spiral) — direct from midPts to innerPts
    for (let r = 1; r <= HALF; r++) {
      const b = r / HALF;
      const y = valleyY + innerRise * b * b;
      allRings.push(makeRing(midPts, innerPts, b, y));
    }
  }

  const pos: number[] = [];
  for (const ring of allRings) for (const v of ring) pos.push(v[0], v[1], v[2]);
  const idx: number[] = [];
  const TOTAL = allRings.length;
  for (let r = 0; r < TOTAL - 1; r++) {
    const b0 = r * N; const b1 = (r + 1) * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i, c0 = b0 + (i + 1) % N, a1 = b1 + i, c1 = b1 + (i + 1) % N;
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

export function buildMoatEdgeLines(
  outerPts: THREE.Vector2[], _innerPts: THREE.Vector2[],
  depth: number, innerRimOffset: number, baseY = 0,
  outerProfile: WallProfile = 'parabolic',
  innerProfile: WallProfile = 'parabolic',
  outerStepCount = 3,
  outerStepStart = 0,
  innerStepCount = 3,
  innerStepStart = 0,
): THREE.BufferGeometry {
  const N = outerPts.length;
  const innerPts = resamplePts(_innerPts, N);
  const innerRimY = baseY + innerRimOffset;
  const valleyY = baseY - depth;
  const innerRise = depth + innerRimOffset;
  const midPts = outerPts.map((op, i) => new THREE.Vector2(
    (op.x + innerPts[i].x) / 2, (op.y + innerPts[i].y) / 2,
  ));
  const step = Math.max(1, Math.floor(N / 8));
  const v: number[] = [
    ...buildRimEdges(outerPts, baseY),
    ...buildFloorAndPillarEdges(outerPts, baseY, depth),
  ];
  // Inner: rim loop + floor loop + pillars
  for (let i = 0; i < N; i++) {
    const a = innerPts[i]; const b = innerPts[(i + 1) % N];
    v.push(a.x, innerRimY, a.y, b.x, innerRimY, b.y);
    v.push(a.x, valleyY, a.y, b.x, valleyY, b.y);
    if (i % step === 0) v.push(a.x, innerRimY, a.y, a.x, valleyY, a.y);
  }
  // Outer step terrace edges
  if (outerProfile === 'step') {
    const sN = Math.max(1, outerStepCount);
    const smoothDepth = Math.max(0, Math.min(outerStepStart, depth - sN));
    const stepDepth = depth - smoothDepth;
    const smoothFrac = smoothDepth / depth;
    for (let k = 1; k < sN; k++) {
      const b = smoothFrac + (k / sN) * (1 - smoothFrac);
      const y = baseY - smoothDepth - k * stepDepth / sN;
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        v.push(
          outerPts[i].x * (1 - b) + midPts[i].x * b, y, outerPts[i].y * (1 - b) + midPts[i].y * b,
          outerPts[j].x * (1 - b) + midPts[j].x * b, y, outerPts[j].y * (1 - b) + midPts[j].y * b,
        );
      }
    }
  }
  // Inner step terrace edges
  if (innerProfile === 'step') {
    const sN = Math.max(1, innerStepCount);
    const smoothHeight = Math.max(0, Math.min(innerStepStart, innerRise - sN));
    const stepHeight = innerRise - smoothHeight;
    const smoothFrac = smoothHeight / innerRise;
    for (let k = 1; k < sN; k++) {
      const b = smoothFrac + (k / sN) * (1 - smoothFrac);
      const y = valleyY + smoothHeight + k * stepHeight / sN;
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        v.push(
          midPts[i].x * (1 - b) + innerPts[i].x * b, y, midPts[i].y * (1 - b) + innerPts[i].y * b,
          midPts[j].x * (1 - b) + innerPts[j].x * b, y, midPts[j].y * (1 - b) + innerPts[j].y * b,
        );
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/** Self-contained arena: interior bowl + outer skirt walls + bottom cap. */
export function buildFreeArenaMesh(
  pts: THREE.Vector2[], depth: number, wallProfile: WallProfile,
  baseY = 0, holes: ChildHole[] = [],
): THREE.BufferGeometry {
  const N = pts.length;
  const floorY = baseY - depth;
  const pos: number[] = [];
  const idx: number[] = [];
  let base = 0;

  // Interior bowl — uses shared appendParabolicBowlSection to avoid duplicating ring math
  if (wallProfile === 'parabolic') {
    const rings = holes.length > 0 ? TESS.PARABOLIC_BOWL * 2 : TESS.PARABOLIC_BOWL;
    base = appendParabolicBowlSection(pts, rings, depth, baseY, pos, idx, base, holes);
  } else {
    // Straight interior
    const rimB = base;
    for (const p of pts) pos.push(p.x, baseY, p.y);
    const flrB = rimB + N;
    for (const p of pts) pos.push(p.x, floorY, p.y);
    for (let i = 0; i < N; i++) {
      const t0=rimB+i, t1=rimB+(i+1)%N, b0=flrB+i, b1=flrB+(i+1)%N;
      idx.push(t0, t1, b0, t1, b1, b0);
    }
    const fc = flrB + N;
    pos.push(0, floorY, 0);
    for (let i = 0; i < N; i++) {
      if (holes.length > 0 && inChildHole((pts[i].x + pts[(i+1)%N].x) / 3, (pts[i].y + pts[(i+1)%N].y) / 3, holes)) continue;
      idx.push(fc, flrB + i, flrB + (i + 1) % N);
    }
    base = fc + 1;
  }

  // Outer skirt (vertical walls, outward-facing)
  const outerRimB = base;
  for (const p of pts) pos.push(p.x, baseY, p.y);
  const outerFlrB = outerRimB + N;
  for (const p of pts) pos.push(p.x, floorY, p.y);
  for (let i = 0; i < N; i++) {
    const t0=outerRimB+i, t1=outerRimB+(i+1)%N, b0=outerFlrB+i, b1=outerFlrB+(i+1)%N;
    idx.push(t0, b0, t1, t1, b0, b1);
  }
  base = outerFlrB + N;

  // Bottom cap (facing down)
  const capCtr = base;
  pos.push(0, floorY, 0);
  const capRim = capCtr + 1;
  for (const p of pts) pos.push(p.x, floorY, p.y);
  for (let i = 0; i < N; i++) idx.push(capCtr, capRim + i, capRim + (i + 1) % N);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

/** Edge lines for a free-floating arena: rim + floor + vertical pillars. */
export function buildFreeArenaEdges(pts: THREE.Vector2[], depth: number, baseY = 0): THREE.BufferGeometry {
  const v = [
    ...buildRimEdges(pts, baseY),
    ...buildFloorAndPillarEdges(pts, baseY, depth),
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

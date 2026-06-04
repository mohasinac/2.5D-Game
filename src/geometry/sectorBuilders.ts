import * as THREE from 'three';
import { SectorData } from '../types/beybladeTypes';

export interface ISectorGeometryBuilder {
  buildMeshGeometry(s: SectorData): THREE.BufferGeometry;
  buildEdgeGeometry(s: SectorData): THREE.BufferGeometry;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function segCount(arcDeg: number): number {
  return Math.max(8, Math.ceil(Math.abs(arcDeg) / 5));
}

// Generates N+1 points along an elliptic arc from startDeg to endDeg at height y.
function ellipseArc(
  rx: number, rz: number,
  startDeg: number, endDeg: number,
  y: number,
  n: number,
): number[] {
  const pts: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = startDeg + (endDeg - startDeg) * (i / n);
    const rad = THREE.MathUtils.degToRad(t);
    pts.push(rx * Math.cos(rad), y, rz * Math.sin(rad));
  }
  return pts;
}

function pushQuadStrip(
  pos: number[], idx: number[],
  bottomStart: number, topStart: number,
  count: number, // number of quads = count (count+1 vertices per row)
): void {
  for (let i = 0; i < count; i++) {
    const b0 = bottomStart + i;
    const b1 = bottomStart + i + 1;
    const t0 = topStart + i;
    const t1 = topStart + i + 1;
    idx.push(b0, b1, t1, b0, t1, t0);
  }
}

// Fan triangles from a centre vertex to an arc (for solid caps).
function pushCapFan(
  pos: number[], idx: number[],
  centreIdx: number, arcStart: number, count: number, flipWinding: boolean,
): void {
  for (let i = 0; i < count; i++) {
    const a = arcStart + i;
    const b = arcStart + i + 1;
    if (flipWinding) idx.push(centreIdx, b, a);
    else idx.push(centreIdx, a, b);
  }
}

// Quad-strip ring for hollow annular caps (outer arc → inner arc).
function pushAnnularCap(
  idx: number[],
  outerStart: number, innerStart: number,
  count: number, flipWinding: boolean,
): void {
  for (let i = 0; i < count; i++) {
    const o0 = outerStart + i,  o1 = outerStart + i + 1;
    const n0 = innerStart + i,  n1 = innerStart + i + 1;
    if (flipWinding) idx.push(o0, n0, n1, o0, n1, o1);
    else             idx.push(o0, o1, n1, o0, n1, n0);
  }
}

function buildGeometryFromArrays(pos: number[], idx: number[]): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ── Solid sector builder ──────────────────────────────────────────────────────

export class SolidSectorBuilder implements ISectorGeometryBuilder {
  buildMeshGeometry(s: SectorData): THREE.BufferGeometry {
    const {
      startAngle, endAngle, height,
      topRadiusX, topRadiusZ, bottomRadiusX, bottomRadiusZ,
    } = s;
    const arcDeg = endAngle - startAngle;
    const isFull = Math.abs(arcDeg) >= 359.9;
    const N = segCount(arcDeg);
    const pos: number[] = [];
    const idx: number[] = [];

    // Bottom outer arc: indices [0 .. N]
    const botArcStart = 0;
    pos.push(...ellipseArc(bottomRadiusX, bottomRadiusZ, startAngle, endAngle, 0, N));
    // Top outer arc: indices [N+1 .. 2N+1]
    const topArcStart = N + 1;
    pos.push(...ellipseArc(topRadiusX, topRadiusZ, startAngle, endAngle, height, N));

    // Outer wall
    pushQuadStrip(pos, idx, botArcStart, topArcStart, N);

    // Centres for caps
    const botCentre = pos.length / 3;
    pos.push(0, 0, 0);
    const topCentre = pos.length / 3;
    pos.push(0, height, 0);

    // Bottom cap (winding outward → flip)
    pushCapFan(pos, idx, botCentre, botArcStart, N, true);
    // Top cap (winding outward)
    pushCapFan(pos, idx, topCentre, topArcStart, N, false);

    // Side faces for partial arcs
    if (!isFull) {
      // Start side: centre → start of bottom arc → start of top arc
      const bS = botArcStart, tS = topArcStart;
      idx.push(botCentre, bS, tS, botCentre, tS, topCentre);
      // End side: centre → end of top arc → end of bottom arc
      const bE = botArcStart + N, tE = topArcStart + N;
      idx.push(botCentre, topCentre, tE, botCentre, tE, bE);
    }

    return buildGeometryFromArrays(pos, idx);
  }

  buildEdgeGeometry(s: SectorData): THREE.BufferGeometry {
    return buildSectorEdgeLines(s, false);
  }
}

// ── Hollow sector builder ─────────────────────────────────────────────────────

export class HollowSectorBuilder implements ISectorGeometryBuilder {
  buildMeshGeometry(s: SectorData): THREE.BufferGeometry {
    const {
      startAngle, endAngle, height,
      topRadiusX, topRadiusZ, bottomRadiusX, bottomRadiusZ,
      innerTopRadiusX, innerTopRadiusZ, innerBottomRadiusX, innerBottomRadiusZ,
    } = s;
    const arcDeg = endAngle - startAngle;
    const isFull = Math.abs(arcDeg) >= 359.9;
    const N = segCount(arcDeg);
    const pos: number[] = [];
    const idx: number[] = [];

    const botOuterStart = 0;
    pos.push(...ellipseArc(bottomRadiusX, bottomRadiusZ, startAngle, endAngle, 0, N));
    const topOuterStart = N + 1;
    pos.push(...ellipseArc(topRadiusX, topRadiusZ, startAngle, endAngle, height, N));
    const botInnerStart = 2 * (N + 1);
    pos.push(...ellipseArc(innerBottomRadiusX, innerBottomRadiusZ, startAngle, endAngle, 0, N));
    const topInnerStart = 3 * (N + 1);
    pos.push(...ellipseArc(innerTopRadiusX, innerTopRadiusZ, startAngle, endAngle, height, N));

    // Outer wall
    pushQuadStrip(pos, idx, botOuterStart, topOuterStart, N);
    // Inner wall (normals inward → flip winding)
    for (let i = 0; i < N; i++) {
      const b0 = botInnerStart + i,  b1 = botInnerStart + i + 1;
      const t0 = topInnerStart + i,  t1 = topInnerStart + i + 1;
      idx.push(b0, t0, t1, b0, t1, b1);
    }
    // Bottom annular cap (flip)
    pushAnnularCap(idx, botOuterStart, botInnerStart, N, true);
    // Top annular cap
    pushAnnularCap(idx, topOuterStart, topInnerStart, N, false);

    // Side faces for partial arcs — flat annular quads at each end
    if (!isFull) {
      // Start side
      idx.push(botOuterStart, botInnerStart, topInnerStart, botOuterStart, topInnerStart, topOuterStart);
      // End side
      const bO = botOuterStart + N, bI = botInnerStart + N;
      const tO = topOuterStart + N, tI = topInnerStart + N;
      idx.push(bO, tO, tI, bO, tI, bI);
    }

    return buildGeometryFromArrays(pos, idx);
  }

  buildEdgeGeometry(s: SectorData): THREE.BufferGeometry {
    return buildSectorEdgeLines(s, true);
  }
}

// ── Edge lines (wireframe outline) ────────────────────────────────────────────

function buildSectorEdgeLines(s: SectorData, hollow: boolean): THREE.BufferGeometry {
  const {
    startAngle, endAngle, height,
    topRadiusX, topRadiusZ, bottomRadiusX, bottomRadiusZ,
    innerTopRadiusX, innerTopRadiusZ, innerBottomRadiusX, innerBottomRadiusZ,
  } = s;
  const arcDeg = endAngle - startAngle;
  const isFull = Math.abs(arcDeg) >= 359.9;
  const N = segCount(arcDeg);
  const verts: number[] = [];

  function arc(rx: number, rz: number, y: number, closed: boolean): void {
    const start = verts.length / 3;
    for (let i = 0; i <= N; i++) {
      const t = startAngle + arcDeg * (i / N);
      const rad = THREE.MathUtils.degToRad(t);
      verts.push(rx * Math.cos(rad), y, rz * Math.sin(rad));
    }
    // Connect consecutive vertices as line segments
    for (let i = 0; i < N; i++) {
      verts.push(...verts.slice((start + i) * 3, (start + i + 1) * 3));
      verts.push(...verts.slice((start + i + 1) * 3, (start + i + 2) * 3));
    }
    if (closed) {
      verts.push(...verts.slice(start * 3, (start + 1) * 3));
      verts.push(...verts.slice((start + N) * 3, (start + N + 1) * 3));
    }
  }

  // Rebuild as line segments directly (pos pairs)
  const linePts: number[] = [];
  function addArcLines(rx: number, rz: number, y: number): void {
    for (let i = 0; i < N; i++) {
      const t0 = THREE.MathUtils.degToRad(startAngle + arcDeg * (i / N));
      const t1 = THREE.MathUtils.degToRad(startAngle + arcDeg * ((i + 1) / N));
      linePts.push(rx * Math.cos(t0), y, rz * Math.sin(t0));
      linePts.push(rx * Math.cos(t1), y, rz * Math.sin(t1));
    }
    if (isFull) {
      const t0 = THREE.MathUtils.degToRad(endAngle - arcDeg / N);
      const t1 = THREE.MathUtils.degToRad(startAngle);
      linePts.push(rx * Math.cos(t0), y, rz * Math.sin(t0));
      linePts.push(rx * Math.cos(t1), y, rz * Math.sin(t1));
    }
  }

  function addVerticals(rx0: number, rz0: number, rx1: number, rz1: number, angles: number[]): void {
    for (const deg of angles) {
      const rad = THREE.MathUtils.degToRad(deg);
      linePts.push(rx0 * Math.cos(rad), 0, rz0 * Math.sin(rad));
      linePts.push(rx1 * Math.cos(rad), height, rz1 * Math.sin(rad));
    }
  }

  const edgeAngles = isFull
    ? [startAngle, startAngle + 90, startAngle + 180, startAngle + 270]
    : [startAngle, endAngle];

  addArcLines(bottomRadiusX, bottomRadiusZ, 0);
  addArcLines(topRadiusX, topRadiusZ, height);
  addVerticals(bottomRadiusX, bottomRadiusZ, topRadiusX, topRadiusZ, edgeAngles);

  if (hollow) {
    addArcLines(innerBottomRadiusX, innerBottomRadiusZ, 0);
    addArcLines(innerTopRadiusX, innerTopRadiusZ, height);
    addVerticals(innerBottomRadiusX, innerBottomRadiusZ, innerTopRadiusX, innerTopRadiusZ, edgeAngles);
  }

  void verts; // suppress unused warning from the original unused helper
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  return geo;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function getSectorBuilder(isHollow: boolean): ISectorGeometryBuilder {
  return isHollow ? new HollowSectorBuilder() : new SolidSectorBuilder();
}

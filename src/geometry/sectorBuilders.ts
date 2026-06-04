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

// Push N+1 elliptic-arc points directly into pos (avoids intermediate array + spread).
function pushEllipseArc(
  pos: number[],
  rx: number, rz: number,
  startDeg: number, endDeg: number,
  y: number, n: number,
): void {
  const range = endDeg - startDeg;
  for (let i = 0; i <= n; i++) {
    const rad = THREE.MathUtils.degToRad(startDeg + range * (i / n));
    pos.push(rx * Math.cos(rad), y, rz * Math.sin(rad));
  }
}

function pushQuadStrip(
  pos: number[], idx: number[],
  bottomStart: number, topStart: number,
  count: number,
): void {
  for (let i = 0; i < count; i++) {
    const b0 = bottomStart + i, b1 = b0 + 1;
    const t0 = topStart    + i, t1 = t0 + 1;
    idx.push(b0, b1, t1, b0, t1, t0);
  }
}

function pushCapFan(
  pos: number[], idx: number[],
  centreIdx: number, arcStart: number, count: number, flipWinding: boolean,
): void {
  for (let i = 0; i < count; i++) {
    const a = arcStart + i, b = a + 1;
    if (flipWinding) idx.push(centreIdx, b, a);
    else             idx.push(centreIdx, a, b);
  }
}

function pushAnnularCap(
  idx: number[],
  outerStart: number, innerStart: number,
  count: number, flipWinding: boolean,
): void {
  for (let i = 0; i < count; i++) {
    const o0 = outerStart + i, o1 = o0 + 1;
    const n0 = innerStart + i, n1 = n0 + 1;
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
    const { startAngle, endAngle, height, topRadiusX, topRadiusZ, bottomRadiusX, bottomRadiusZ } = s;
    const arcDeg = endAngle - startAngle;
    const isFull = Math.abs(arcDeg) >= 359.9;
    const N = segCount(arcDeg);
    const pos: number[] = [];
    const idx: number[] = [];

    const botArcStart = 0;
    pushEllipseArc(pos, bottomRadiusX, bottomRadiusZ, startAngle, endAngle, 0, N);
    const topArcStart = N + 1;
    pushEllipseArc(pos, topRadiusX, topRadiusZ, startAngle, endAngle, height, N);

    pushQuadStrip(pos, idx, botArcStart, topArcStart, N);

    const botCentre = pos.length / 3;
    pos.push(0, 0, 0);
    const topCentre = pos.length / 3;
    pos.push(0, height, 0);

    pushCapFan(pos, idx, botCentre, botArcStart, N, true);
    pushCapFan(pos, idx, topCentre, topArcStart, N, false);

    if (!isFull) {
      const bS = botArcStart, tS = topArcStart;
      idx.push(botCentre, bS, tS, botCentre, tS, topCentre);
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
    pushEllipseArc(pos, bottomRadiusX, bottomRadiusZ, startAngle, endAngle, 0, N);
    const topOuterStart = N + 1;
    pushEllipseArc(pos, topRadiusX, topRadiusZ, startAngle, endAngle, height, N);
    const botInnerStart = 2 * (N + 1);
    pushEllipseArc(pos, innerBottomRadiusX, innerBottomRadiusZ, startAngle, endAngle, 0, N);
    const topInnerStart = 3 * (N + 1);
    pushEllipseArc(pos, innerTopRadiusX, innerTopRadiusZ, startAngle, endAngle, height, N);

    pushQuadStrip(pos, idx, botOuterStart, topOuterStart, N);
    // Inner wall — inverted normals (flip winding)
    for (let i = 0; i < N; i++) {
      const b0 = botInnerStart + i, b1 = b0 + 1;
      const t0 = topInnerStart + i, t1 = t0 + 1;
      idx.push(b0, t0, t1, b0, t1, b1);
    }
    pushAnnularCap(idx, botOuterStart, botInnerStart, N, true);
    pushAnnularCap(idx, topOuterStart, topInnerStart, N, false);

    if (!isFull) {
      idx.push(botOuterStart, botInnerStart, topInnerStart, botOuterStart, topInnerStart, topOuterStart);
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
  const linePts: number[] = [];

  // Cache previous endpoint to halve trig calls — each endpoint is shared by two segments.
  function addArcLines(rx: number, rz: number, y: number): void {
    let prevRad = THREE.MathUtils.degToRad(startAngle);
    let prevCos = Math.cos(prevRad);
    let prevSin = Math.sin(prevRad);
    for (let i = 1; i <= N; i++) {
      const rad = THREE.MathUtils.degToRad(startAngle + arcDeg * (i / N));
      const c = Math.cos(rad);
      const sn = Math.sin(rad);
      linePts.push(rx * prevCos, y, rz * prevSin, rx * c, y, rz * sn);
      prevCos = c; prevSin = sn;
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

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  return geo;
}

// ── Factory — singleton instances; builders are stateless so they're safely shared ──

const _solidBuilder  = new SolidSectorBuilder();
const _hollowBuilder = new HollowSectorBuilder();

export function getSectorBuilder(isHollow: boolean): ISectorGeometryBuilder {
  return isHollow ? _hollowBuilder : _solidBuilder;
}

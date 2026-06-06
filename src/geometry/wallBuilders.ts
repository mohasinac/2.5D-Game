/**
 * wallBuilders.ts
 * Wall geometry: extruded barriers attached to arena rims, bridge deck edges, the octagon base, or trap surfaces.
 *
 * Tilt convention: 0° = vertical. Negative = inward (toward arena, top swings over bowl).
 * Positive = outward (top swings away from arena, like a door hinge). Range [-90, +30].
 *
 * Thickness: walls have a solid cross-section — outer face + inner face + top face.
 * The inner face is offset from the outer face by `thickness` cm along the inward direction.
 * Top face connects outer-top to inner-top (horizontal).
 */
import * as THREE from 'three';
import { DEG2RAD, OCTAGON_BASE, MIN_WALL_HEIGHT, MIN_WALL_GAP, ROT } from '../config/arenaConstants';
import { WallData, WallTopProfile, TrapData, ArenaData } from '../types/arenaTypes';

/* ── Arc filter ─────────────────────────────────────────────────────────── */

/**
 * Return the sub-arc of `rimPts` that lies within [arcStart, arcEnd] degrees
 * (measured as angle around origin in the XZ plane).
 * Points are interpolated at the exact arc boundaries.
 */
export function arcFilterPts(
  rimPts: THREE.Vector2[],
  arcStart: number,
  arcEnd: number,
): THREE.Vector2[] {
  const N = rimPts.length;
  if (N === 0) return [];

  // Normalise angles to [0, 360)
  let a0 = ((arcStart % 360) + 360) % 360;
  let a1 = ((arcEnd   % 360) + 360) % 360;
  const wraps = a1 <= a0;   // arc crosses the 0/360 boundary

  // Compute the angle of each rim point (atan2 in XZ plane, 0→360)
  const angles = rimPts.map(p => ((Math.atan2(p.y, p.x) / DEG2RAD) + 360) % 360);

  const result: THREE.Vector2[] = [];

  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const aI = angles[i];
    const aJ = angles[j];

    const inArc = (a: number) => wraps ? (a >= a0 || a <= a1) : (a >= a0 && a <= a1);

    if (inArc(aI)) result.push(rimPts[i].clone());

    // Check for crossing arcStart or arcEnd between i and j
    for (const boundary of [a0, a1]) {
      const crossed = wraps
        ? crossesAngleWrapped(aI, aJ, boundary)
        : crossesAngle(aI, aJ, boundary);
      if (crossed) {
        const t = angleLerp(aI, aJ, boundary, wraps);
        if (t > 0 && t < 1) {
          result.push(new THREE.Vector2(
            rimPts[i].x + t * (rimPts[j].x - rimPts[i].x),
            rimPts[i].y + t * (rimPts[j].y - rimPts[i].y),
          ));
        }
      }
    }
  }
  return result;
}

function crossesAngle(a: number, b: number, target: number): boolean {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return target > lo && target < hi;
}
function crossesAngleWrapped(a: number, b: number, target: number): boolean {
  return crossesAngle(a, b, target);
}
function angleLerp(a: number, b: number, target: number, _wraps: boolean): number {
  if (a === b) return 0;
  return (target - a) / (b - a);
}

/* ── Top profile modulation ─────────────────────────────────────────────── */

function topProfileOffset(
  t: number,
  profile: WallTopProfile,
  amplitude: number,
  frequency: number,
  arcLengthM: number,
): number {
  if (profile === 'flat' || amplitude === 0) return 0;
  const phase = t * arcLengthM * frequency * Math.PI * 2;
  switch (profile) {
    case 'triangles':   return amplitude * Math.abs(((t * arcLengthM * frequency) % 1) * 2 - 1);
    case 'waves':       return amplitude * 0.5 * (1 + Math.sin(phase));
    case 'serrated': {
      const frac = (t * arcLengthM * frequency) % 1;
      return amplitude * (1 - frac);
    }
    case 'crenellated':
      return amplitude * (Math.round(Math.sin(phase) * 0.5 + 0.5));
    default: return 0;
  }
}

/* ── Per-panel geometry ─────────────────────────────────────────────────── */

/**
 * Build vertices + indices for a single wall panel.
 *
 * For non-isDouble walls, each rim point generates 4 vertices:
 *   4i+0 = outerBottom, 4i+1 = outerTop, 4i+2 = innerBottom, 4i+3 = innerTop
 * Generates outer face + inner face + top face.
 * End-cap quads are added when addStartCap / addEndCap = true.
 */
function buildPanelGeometry(
  panelPts: THREE.Vector2[],
  rimY: number,
  height: number,
  tilt: number,
  thickness: number,
  isDouble: boolean,
  peakHeight: number,
  peakTilt: number,
  topProfile: WallTopProfile,
  topAmplitude: number,
  topFrequency: number,
  inwardDir: (p: THREE.Vector2) => THREE.Vector2,
  addStartCap: boolean,
  addEndCap: boolean,
  /** 1 = inward (toward center), -1 = outward (away from center). Default 1 for compat. */
  dirMult = 1,
): { positions: number[]; normals: number[]; indices: number[] } {
  const tiltRad = Math.max(-Math.PI / 2, Math.min(30 * DEG2RAD, tilt * DEG2RAD));
  const clampedHeight = Math.max(MIN_WALL_HEIGHT, height);
  const thick = Math.max(0.1, thickness);

  let arcLen = 0;
  for (let i = 0; i < panelPts.length - 1; i++) {
    const dx = panelPts[i + 1].x - panelPts[i].x;
    const dy = panelPts[i + 1].y - panelPts[i].y;
    arcLen += Math.sqrt(dx * dx + dy * dy);
  }
  const arcLenM = arcLen / 100;

  const positions: number[] = [];
  const normals:   number[] = [];
  const indices:   number[] = [];
  const N = panelPts.length;

  if (!isDouble) {
    // Build 4 vertices per rim point: outerBottom, outerTop, innerBottom, innerTop
    for (let i = 0; i < N; i++) {
      const t = i / Math.max(N - 1, 1);
      const p = panelPts[i];
      const inDir = inwardDir(p);
      const profileOff = topProfileOffset(t, topProfile, topAmplitude, topFrequency, arcLenM);
      const topH = clampedHeight + profileOff;

      // Clamp thickness outward so wall never exceeds octagon boundary
      const effectiveThick = dirMult === -1
        ? Math.min(thick, computeMaxOutwardDist(p.x, p.y))
        : thick;

      // Outer bottom (on the rim surface)
      positions.push(p.x, rimY, p.y);
      normals.push(0, 0, 1);

      // Outer top (displaced by tilt in dirMult*inward direction)
      const otX = p.x + (-Math.sin(tiltRad)) * topH * inDir.x * dirMult;
      const otZ = p.y + (-Math.sin(tiltRad)) * topH * inDir.y * dirMult;
      const otY = rimY + Math.cos(tiltRad) * topH;
      positions.push(otX, otY, otZ);
      normals.push(0, 0, 1);

      // Inner bottom (outer bottom offset by dirMult*inward by thickness)
      positions.push(p.x + inDir.x * effectiveThick * dirMult, rimY, p.y + inDir.y * effectiveThick * dirMult);
      normals.push(0, 0, 1);

      // Inner top (outer top offset by dirMult*inward by thickness, same Y height)
      positions.push(otX + inDir.x * effectiveThick * dirMult, otY, otZ + inDir.y * effectiveThick * dirMult);
      normals.push(0, 0, 1);
    }

    // Helpers: ob(i)=4i, ot(i)=4i+1, ib(i)=4i+2, it(i)=4i+3
    const ob = (i: number) => 4 * i;
    const ot = (i: number) => 4 * i + 1;
    const ib = (i: number) => 4 * i + 2;
    const it = (i: number) => 4 * i + 3;

    // Outer face quads (normals point outward)
    for (let i = 0; i < N - 1; i++) {
      indices.push(ob(i), ob(i+1), ot(i+1), ob(i), ot(i+1), ot(i));
    }

    // Inner face quads (reversed winding → normals point inward)
    for (let i = 0; i < N - 1; i++) {
      indices.push(ib(i), it(i+1), ib(i+1), ib(i), it(i), it(i+1));
    }

    // Top face quads (normals point up)
    for (let i = 0; i < N - 1; i++) {
      indices.push(ot(i), it(i), it(i+1), ot(i), it(i+1), ot(i+1));
    }

    // Start end-cap (closes the cross-section at the wall's start edge)
    if (addStartCap && N > 0) {
      indices.push(ob(0), ot(0), it(0), ob(0), it(0), ib(0));
    }

    // End end-cap (closes the cross-section at the wall's end edge)
    if (addEndCap && N > 0) {
      const e = N - 1;
      indices.push(ob(e), ib(e), it(e), ob(e), it(e), ot(e));
    }

  } else {
    // /\ double-wall cross-section (no thickness applied to double-wall for geometry clarity)
    const peakRad = Math.max(0, Math.min(60 * DEG2RAD, peakTilt * DEG2RAD));
    for (let i = 0; i < N; i++) {
      const p = panelPts[i];
      const inDir = inwardDir(p);
      positions.push(p.x, rimY, p.y);
      normals.push(0, 1, 0);
      const peakX = p.x + (-Math.sin(peakRad)) * peakHeight * inDir.x;
      const peakZ = p.y + (-Math.sin(peakRad)) * peakHeight * inDir.y;
      const peakY = rimY + Math.cos(peakRad) * peakHeight;
      positions.push(peakX, peakY, peakZ);
      normals.push(0, 1, 0);
    }
    for (let i = 0; i < N - 1; i++) {
      const b0 = i * 2, pk0 = i * 2 + 1;
      const b1 = (i + 1) * 2, pk1 = (i + 1) * 2 + 1;
      indices.push(b0, b1, pk1, b0, pk1, pk0);
    }
  }

  return { positions, normals, indices };
}

/* ── Build wall mesh geometry ───────────────────────────────────────────── */

/**
 * Build the THREE.BufferGeometry for a wall.
 * @param wall      WallData (fully populated)
 * @param rimPts    Arena rim points in arena-local XZ (THREE.Vector2[])
 * @param rimY      World Y of the attachment surface (rim or base top face)
 * @param arenaCX   Arena centre world X (used for inward direction; 0 for base/trap walls)
 * @param arenaCZ   Arena centre world Z
 * @param joinStart Suppress start end-cap (wall is joined to an adjacent wall at start)
 * @param joinEnd   Suppress end end-cap (wall is joined to an adjacent wall at end)
 */
export function buildWallGeometry(
  wall: WallData,
  rimPts: THREE.Vector2[],
  rimY: number,
  arenaCX = 0,
  arenaCZ = 0,
  joinStart = false,
  joinEnd = false,
): THREE.BufferGeometry {
  const effectiveTilt = (wall.fullPerimeter && !wall.hasGaps) ? 0 : wall.tilt;

  let workPts: THREE.Vector2[];
  let centreX: number;
  let centreZ: number;

  if (wall.parentType === 'base') {
    const len = Math.max(1, wall.baseLength);
    const cosR = Math.cos(wall.baseRotY * DEG2RAD);
    const sinR = Math.sin(wall.baseRotY * DEG2RAD);
    const cx = wall.basePosX;
    const cz = wall.basePosZ;
    workPts = [
      new THREE.Vector2(cx - (len / 2) * cosR, cz - (len / 2) * sinR),
      new THREE.Vector2(cx + (len / 2) * cosR, cz + (len / 2) * sinR),
    ];
    centreX = cx;
    centreZ = cz;
  } else {
    workPts = wall.fullPerimeter
      ? rimPts
      : arcFilterPts(rimPts, wall.arcStart, wall.arcEnd);
    centreX = arenaCX;
    centreZ = arenaCZ;
  }

  if (workPts.length < 2) return new THREE.BufferGeometry();

  const inwardDir = (p: THREE.Vector2) => {
    const dx = centreX - p.x;
    const dz = centreZ - p.y;
    const len2 = Math.sqrt(dx * dx + dz * dz) || 1;
    return new THREE.Vector2(dx / len2, dz / len2);
  };

  const dirMult = (wall.thicknessDirection ?? 'outward') === 'inward' ? 1 : -1;

  const allPositions: number[] = [];
  const allIndices:   number[] = [];
  let vertexOffset = 0;

  const panels = buildPanelList(workPts, wall);

  for (let pi = 0; pi < panels.length; pi++) {
    const isFirst = pi === 0;
    const isLast  = pi === panels.length - 1;
    // First panel inherits joinStart; last panel inherits joinEnd.
    // Interior gap panels always get both caps (they're standalone pieces).
    const addStartCap = isFirst ? !joinStart : true;
    const addEndCap   = isLast  ? !joinEnd   : true;

    const { positions, indices } = buildPanelGeometry(
      panels[pi],
      rimY,
      wall.height,
      effectiveTilt,
      wall.thickness,
      wall.isDouble,
      wall.peakHeight,
      wall.peakTilt,
      wall.topProfile,
      wall.topAmplitude,
      wall.topFrequency,
      inwardDir,
      addStartCap,
      addEndCap,
      dirMult,
    );
    allPositions.push(...positions);
    allIndices.push(...indices.map(i => i + vertexOffset));
    vertexOffset += positions.length / 3;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3));
  geo.setIndex(allIndices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Divide the full rim-point list into an array of panel sub-arrays,
 * skipping gap segments between panels.
 */
function buildPanelList(
  pts: THREE.Vector2[],
  wall: WallData,
): THREE.Vector2[][] {
  if (!wall.hasGaps) return [pts];

  const gapW   = Math.max(MIN_WALL_GAP, wall.gapWidth);
  const panW   = Math.max(MIN_WALL_GAP, wall.panelWidth);
  const period = gapW + panW;

  const arcLens = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dz = pts[i].y - pts[i - 1].y;
    arcLens.push(arcLens[arcLens.length - 1] + Math.sqrt(dx * dx + dz * dz));
  }
  const totalLen = arcLens[arcLens.length - 1];

  const panels: THREE.Vector2[][] = [];
  let s = 0;

  while (s < totalLen) {
    const panelEnd = Math.min(s + panW, totalLen);
    const panel = sliceArcByLength(pts, arcLens, s, panelEnd);
    if (panel.length >= 2) panels.push(panel);
    s += period;
  }
  return panels;
}

function sliceArcByLength(
  pts: THREE.Vector2[],
  arcLens: number[],
  lo: number,
  hi: number,
): THREE.Vector2[] {
  const result: THREE.Vector2[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = arcLens[i];
    if (a >= lo && a <= hi) {
      result.push(pts[i].clone());
    } else if (i > 0) {
      const prev = arcLens[i - 1];
      for (const target of [lo, hi]) {
        if (target > prev && target < a) {
          const t = (target - prev) / (a - prev);
          result.push(new THREE.Vector2(
            pts[i - 1].x + t * (pts[i].x - pts[i - 1].x),
            pts[i - 1].y + t * (pts[i].y - pts[i - 1].y),
          ));
        }
      }
    }
  }
  return result;
}

/* ── Build wall edge wireframe ──────────────────────────────────────────── */

export function buildWallEdgeGeometry(
  wall: WallData,
  rimPts: THREE.Vector2[],
  rimY: number,
  arenaCX = 0,
  arenaCZ = 0,
  joinStart = false,
  joinEnd = false,
): THREE.BufferGeometry {
  const effectiveTilt = (wall.fullPerimeter && !wall.hasGaps) ? 0 : wall.tilt;
  const tiltRad = Math.max(-Math.PI / 2, Math.min(30 * DEG2RAD, effectiveTilt * DEG2RAD));
  const clampedHeight = Math.max(MIN_WALL_HEIGHT, wall.height);
  const thick = Math.max(0.1, wall.thickness);
  const dirMult = (wall.thicknessDirection ?? 'outward') === 'inward' ? 1 : -1;

  let workPts: THREE.Vector2[];
  let centreX: number;
  let centreZ: number;

  if (wall.parentType === 'base') {
    const len = Math.max(1, wall.baseLength);
    const cosR = Math.cos(wall.baseRotY * DEG2RAD);
    const sinR = Math.sin(wall.baseRotY * DEG2RAD);
    workPts = [
      new THREE.Vector2(wall.basePosX - (len / 2) * cosR, wall.basePosZ - (len / 2) * sinR),
      new THREE.Vector2(wall.basePosX + (len / 2) * cosR, wall.basePosZ + (len / 2) * sinR),
    ];
    centreX = wall.basePosX;
    centreZ = wall.basePosZ;
  } else {
    workPts = wall.fullPerimeter
      ? rimPts
      : arcFilterPts(rimPts, wall.arcStart, wall.arcEnd);
    centreX = arenaCX;
    centreZ = arenaCZ;
  }

  const verts: number[] = [];
  const panels = buildPanelList(workPts, wall);

  for (let pi = 0; pi < panels.length; pi++) {
    const isFirst = pi === 0;
    const isLast  = pi === panels.length - 1;
    const showStartCap = isFirst ? !joinStart : true;
    const showEndCap   = isLast  ? !joinEnd   : true;

    const panel = panels[pi];
    const N = panel.length;

    // Outer bottom loop
    for (let i = 0; i < N - 1; i++) {
      verts.push(panel[i].x, rimY, panel[i].y);
      verts.push(panel[i + 1].x, rimY, panel[i + 1].y);
    }

    // Inner bottom loop
    for (let i = 0; i < N - 1; i++) {
      const effThick0 = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(panel[i].x, panel[i].y)) : thick;
      const effThick1 = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(panel[i+1].x, panel[i+1].y)) : thick;
      const [ix0, iz0] = innerPt(panel[i], centreX, centreZ, effThick0, dirMult);
      const [ix1, iz1] = innerPt(panel[i + 1], centreX, centreZ, effThick1, dirMult);
      verts.push(ix0, rimY, iz0, ix1, rimY, iz1);
    }

    // Outer top loop
    for (let i = 0; i < N - 1; i++) {
      const [tx0, ty0, tz0] = topVert(panel[i],   rimY, clampedHeight, tiltRad, centreX, centreZ, 0, dirMult);
      const [tx1, ty1, tz1] = topVert(panel[i + 1], rimY, clampedHeight, tiltRad, centreX, centreZ, 0, dirMult);
      verts.push(tx0, ty0, tz0, tx1, ty1, tz1);
    }

    // Inner top loop
    for (let i = 0; i < N - 1; i++) {
      const effThick0 = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(panel[i].x, panel[i].y)) : thick;
      const effThick1 = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(panel[i+1].x, panel[i+1].y)) : thick;
      const [tx0, ty0, tz0] = topVert(panel[i],   rimY, clampedHeight, tiltRad, centreX, centreZ, effThick0 * dirMult, dirMult);
      const [tx1, ty1, tz1] = topVert(panel[i + 1], rimY, clampedHeight, tiltRad, centreX, centreZ, effThick1 * dirMult, dirMult);
      verts.push(tx0, ty0, tz0, tx1, ty1, tz1);
    }

    // Vertical outer + inner edges at endpoints and end-cap lines
    if (N > 0) {
      // Start of panel
      const effThickS = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(panel[0].x, panel[0].y)) : thick;
      const [otx0, oty0, otz0] = topVert(panel[0], rimY, clampedHeight, tiltRad, centreX, centreZ, 0, dirMult);
      const [itx0, ity0, itz0] = topVert(panel[0], rimY, clampedHeight, tiltRad, centreX, centreZ, effThickS * dirMult, dirMult);
      const [ix0, iz0] = innerPt(panel[0], centreX, centreZ, effThickS, dirMult);

      if (showStartCap) {
        // Outer vertical edge
        verts.push(panel[0].x, rimY, panel[0].y, otx0, oty0, otz0);
        // Inner vertical edge
        verts.push(ix0, rimY, iz0, itx0, ity0, itz0);
        // Top cap edge (outer top → inner top)
        verts.push(otx0, oty0, otz0, itx0, ity0, itz0);
        // Bottom cap edge (outer bottom → inner bottom)
        verts.push(panel[0].x, rimY, panel[0].y, ix0, rimY, iz0);
      }

      // End of panel
      const last = panel[N - 1];
      const effThickE = dirMult === -1 ? Math.min(thick, computeMaxOutwardDist(last.x, last.y)) : thick;
      const [otxE, otyE, otzE] = topVert(last, rimY, clampedHeight, tiltRad, centreX, centreZ, 0, dirMult);
      const [itxE, ityE, itzE] = topVert(last, rimY, clampedHeight, tiltRad, centreX, centreZ, effThickE * dirMult, dirMult);
      const [ixE, izE] = innerPt(last, centreX, centreZ, effThickE, dirMult);

      if (showEndCap) {
        verts.push(last.x, rimY, last.y, otxE, otyE, otzE);
        verts.push(ixE, rimY, izE, itxE, ityE, itzE);
        verts.push(otxE, otyE, otzE, itxE, ityE, itzE);
        verts.push(last.x, rimY, last.y, ixE, rimY, izE);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

/**
 * Maximum distance a wall can extend outward (away from arena center) from point (wx, wz)
 * before hitting the octagon inscribed circle boundary.
 * Uses the conservative inscribed-circle approximation: APOTHEM - dist_to_origin.
 */
function computeMaxOutwardDist(wx: number, wz: number): number {
  const r = Math.sqrt(wx * wx + wz * wz);
  return Math.max(0, OCTAGON_BASE.radius * Math.cos(Math.PI / OCTAGON_BASE.sides) - r);
}

/** Returns world XZ of the offset point shifted by thick in the direction `dirMult * inward`. */
function innerPt(
  p: THREE.Vector2,
  cx: number,
  cz: number,
  thick: number,
  dirMult: number,
): [number, number] {
  const dx = cx - p.x; const dz = cz - p.y;
  const len = Math.sqrt(dx * dx + dz * dz) || 1;
  return [p.x + (dx / len) * thick * dirMult, p.y + (dz / len) * thick * dirMult];
}

/**
 * Compute the top-edge vertex for a rim point, with optional offset for inner face.
 * @param thicknessOffset  0 = outer edge, thick = inner edge  (scaled by dirMult already)
 */
function topVert(
  p: THREE.Vector2,
  rimY: number,
  height: number,
  tiltRad: number,
  cx: number,
  cz: number,
  thicknessOffset: number,
  dirMult: number,
): [number, number, number] {
  const dx = cx - p.x; const dz = cz - p.y;
  const len = Math.sqrt(dx * dx + dz * dz) || 1;
  const inX = dx / len; const inZ = dz / len;
  const topX = p.x + (-Math.sin(tiltRad)) * height * inX * dirMult + inX * thicknessOffset;
  const topZ = p.y + (-Math.sin(tiltRad)) * height * inZ * dirMult + inZ * thicknessOffset;
  const topY = rimY + Math.cos(tiltRad) * height;
  return [topX, topY, topZ];
}

/* ── Trap rim polygon helpers ───────────────────────────────────────────── */

/**
 * Returns the perimeter polygon of a trap in trap-local XZ (centered at 0,0, rotated by trap.rotY).
 * Used to position a wall on top of a trap plate.
 */
export function trapRimPoints(trap: TrapData): THREE.Vector2[] {
  const hw = trap.dimX / 2;
  const hd = trap.dimZ / 2;
  const rotY = trap.rotY * DEG2RAD;
  const cosR = Math.cos(rotY);
  const sinR = Math.sin(rotY);

  const rot = (x: number, z: number): THREE.Vector2 =>
    new THREE.Vector2(x * cosR - z * sinR, x * sinR + z * cosR);

  switch (trap.shape) {
    case 'rectangle':
      return [rot(-hw, -hd), rot(hw, -hd), rot(hw, hd), rot(-hw, hd)];

    case 'circle': {
      const SEGS = 64;
      return Array.from({ length: SEGS }, (_, i) => {
        const a = (i / SEGS) * Math.PI * 2;
        return new THREE.Vector2(hw * Math.cos(a), hw * Math.sin(a));
      });
    }

    case 'ellipse': {
      const SEGS = 64;
      return Array.from({ length: SEGS }, (_, i) => {
        const a = (i / SEGS) * Math.PI * 2;
        return rot(hw * Math.cos(a), hd * Math.sin(a));
      });
    }

    case 'hexagon': {
      return Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return rot(hw * Math.cos(a), hd * Math.sin(a));
      });
    }

    default: return [];
  }
}

/**
 * Returns the world-space XZ center of a trap.
 */
export function trapWorldCenter(
  trap: TrapData,
  arenas: Map<string, ArenaData>,
): { x: number; z: number } {
  if (trap.parentType === 'base') {
    return { x: trap.basePosX, z: trap.basePosZ };
  }
  // arena-parented: polar position within arena
  const arena = arenas.get(trap.parentId);
  const posAngleRad = trap.posAngle * DEG2RAD;
  const lx = trap.posR * Math.cos(posAngleRad);
  const lz = trap.posR * Math.sin(posAngleRad);
  const ax = arena?.posX ?? 0;
  const az = arena?.posZ ?? 0;
  return { x: ax + lx, z: az + lz };
}

/* ── Default WallData factory ───────────────────────────────────────────── */

export function defaultWallData(
  id: string,
  name: string,
  parentId: string,
  parentType: WallData['parentType'],
): WallData {
  return {
    id, name, parentId, parentType,
    fullPerimeter: true,
    arcStart: 0, arcEnd: 360,
    basePosX: 0, basePosZ: 0, baseRotY: 0, baseLength: 20,
    height: 10,
    tilt: 0,
    thickness: 2,
    thicknessDirection: 'outward',
    hasGaps: false, gapWidth: 10, panelWidth: 20,
    topProfile: 'flat', topAmplitude: 3, topFrequency: 1,
    isDouble: false, peakHeight: 8, peakTilt: 30,
    holes: [],
    isDestructible: false,
    hitPoints: 100,
    autoJoin: true,
    moatRing: 'outer',
    rotateOnArena: false,
    arenaRotateMode: 'continuous',
    arenaRotateSpeed: ROT.DEFAULT_SPEED,
    arenaRotateStepDeg: 30,
    arenaRotateStepInterval: 1,
    arenaRotateOscAmp: ROT.DEFAULT_OSC_AMP,
    arenaRotateOscFreq: ROT.DEFAULT_OSC_FREQ,
    color: 0x88aacc,
    surface: 'plain',
    customTileData: null,
    tileScale: 1,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    opacity: 1,
    material: 'abs',
    presentStlb64: null,
    presentColor: 0xaaaaaa,
    mesh: null,
    edges: null,
  };
}

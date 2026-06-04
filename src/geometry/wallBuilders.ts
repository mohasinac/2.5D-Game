/**
 * wallBuilders.ts
 * Wall geometry: extruded barriers attached to arena rims, bridge deck edges, or the octagon base.
 *
 * Tilt convention: 0° = vertical. Negative = inward (toward arena, top swings over bowl).
 * Positive = outward (top swings away from arena, like a door hinge). Range [-90, +30].
 */
import * as THREE from 'three';
import { DEG2RAD, OCTAGON_BASE, MIN_WALL_HEIGHT, MIN_WALL_GAP } from '../config/arenaConstants';
import { WallData, WallTopProfile } from '../types/arenaTypes';

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

/**
 * Given a normalised arc position `t` [0,1] and the top-profile settings,
 * return an additional Y offset applied to the wall top edge.
 */
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
    case 'serrated': {  // right-triangle: fast rise, instant drop
      const frac = (t * arcLengthM * frequency) % 1;
      return amplitude * (1 - frac);
    }
    case 'crenellated':
      return amplitude * (Math.round(Math.sin(phase) * 0.5 + 0.5));
    default: return 0;
  }
}

/* ── Per-panel geometry ─────────────────────────────────────────────────── */

function buildPanelGeometry(
  panelPts: THREE.Vector2[],
  rimY: number,
  height: number,
  tilt: number,     // degrees, clamped [-90,+30]; negative=inward
  isDouble: boolean,
  peakHeight: number,
  peakTilt: number,
  topProfile: WallTopProfile,
  topAmplitude: number,
  topFrequency: number,
  inwardDir: (p: THREE.Vector2) => THREE.Vector2,  // unit vector pointing toward arena centre
): { positions: number[]; normals: number[]; indices: number[] } {
  const tiltRad = Math.max(-Math.PI / 2, Math.min(30 * DEG2RAD, tilt * DEG2RAD));
  const clampedHeight = Math.max(MIN_WALL_HEIGHT, height);

  // Estimate arc length in metres for topProfile frequency
  let arcLen = 0;
  for (let i = 0; i < panelPts.length - 1; i++) {
    const dx = panelPts[i + 1].x - panelPts[i].x;
    const dy = panelPts[i + 1].y - panelPts[i].y;
    arcLen += Math.sqrt(dx * dx + dy * dy);
  }
  const arcLenM = arcLen / 100; // cm → m

  const positions: number[] = [];
  const normals:   number[] = [];
  const indices:   number[] = [];

  const N = panelPts.length;

  if (!isDouble) {
    // Single wall: N bottom verts + N top verts
    for (let i = 0; i < N; i++) {
      const t = i / Math.max(N - 1, 1);
      const p = panelPts[i];
      const inDir = inwardDir(p);
      const profileOff = topProfileOffset(t, topProfile, topAmplitude, topFrequency, arcLenM);
      const topH = clampedHeight + profileOff;

      // Bottom vertex (at rim)
      positions.push(p.x, rimY, p.y);
      normals.push(0, 0, 1);   // approximate; per-face normals computed below

      // Top vertex (displaced by tilt)
      // negative tilt = sin(tiltRad)<0 = displaces inward (inDir direction)
      const topX = p.x + (-Math.sin(tiltRad)) * topH * inDir.x;
      const topZ = p.y + (-Math.sin(tiltRad)) * topH * inDir.y;
      const topY = rimY + Math.cos(tiltRad) * topH;
      positions.push(topX, topY, topZ);
      normals.push(0, 0, 1);
    }
    // Quad faces: i=bottom_i, i+1=top_i, i+2=top_{i+1}, i+3=bottom_{i+1}
    for (let i = 0; i < N - 1; i++) {
      const b0 = i * 2;     const t0 = i * 2 + 1;
      const b1 = (i + 1) * 2; const t1 = (i + 1) * 2 + 1;
      indices.push(b0, b1, t1, b0, t1, t0);
    }
  } else {
    // Double /\ wall: each segment gets two halves meeting at peak
    const peakRad = Math.max(0, Math.min(60 * DEG2RAD, peakTilt * DEG2RAD));
    for (let i = 0; i < N; i++) {
      const p = panelPts[i];
      const inDir = inwardDir(p);

      // Bottom (rim)
      positions.push(p.x, rimY, p.y);
      normals.push(0, 1, 0);

      // Peak (top centre, leaning inward by peakTilt — always at centre of wall thickness)
      const peakX = p.x + (-Math.sin(peakRad)) * peakHeight * inDir.x;
      const peakZ = p.y + (-Math.sin(peakRad)) * peakHeight * inDir.y;
      const peakY = rimY + Math.cos(peakRad) * peakHeight;
      positions.push(peakX, peakY, peakZ);
      normals.push(0, 1, 0);
    }
    // Same quad strip between consecutive points
    for (let i = 0; i < N - 1; i++) {
      const b0 = i * 2; const pk0 = i * 2 + 1;
      const b1 = (i + 1) * 2; const pk1 = (i + 1) * 2 + 1;
      indices.push(b0, b1, pk1, b0, pk1, pk0);
    }
  }

  return { positions, normals, indices };
}

/* ── Build wall mesh geometry ───────────────────────────────────────────── */

/**
 * Build the THREE.BufferGeometry for a wall.
 * @param wall     WallData (fully populated)
 * @param rimPts   Arena rim points in arena-local XZ (THREE.Vector2[])
 * @param rimY     World Y of the attachment surface (rim or base top face)
 * @param arenaCX  Arena centre world X (used for inward direction on arena walls; 0 for base walls)
 * @param arenaCZ  Arena centre world Z
 */
export function buildWallGeometry(
  wall: WallData,
  rimPts: THREE.Vector2[],
  rimY: number,
  arenaCX = 0,
  arenaCZ = 0,
): THREE.BufferGeometry {
  const effectiveTilt = (wall.fullPerimeter && !wall.hasGaps) ? 0 : wall.tilt;

  // For 'base' walls: rimPts is a 2-point line [(-L/2,0), (L/2,0)] rotated by baseRotY
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

  // Inward direction function (unit vector from point toward arena centre)
  const inwardDir = (p: THREE.Vector2) => {
    const dx = centreX - p.x;
    const dz = centreZ - p.y;
    const len2 = Math.sqrt(dx * dx + dz * dz) || 1;
    return new THREE.Vector2(dx / len2, dz / len2);
  };

  const allPositions: number[] = [];
  const allIndices:   number[] = [];
  let vertexOffset = 0;

  // Split into panels if gaps enabled
  const panels = buildPanelList(workPts, wall);

  for (const panel of panels) {
    const { positions, indices } = buildPanelGeometry(
      panel,
      rimY,
      wall.height,
      effectiveTilt,
      wall.isDouble,
      wall.peakHeight,
      wall.peakTilt,
      wall.topProfile,
      wall.topAmplitude,
      wall.topFrequency,
      inwardDir,
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

  // Accumulate arc lengths
  const arcLens = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dz = pts[i].y - pts[i - 1].y;
    arcLens.push(arcLens[arcLens.length - 1] + Math.sqrt(dx * dx + dz * dz));
  }
  const totalLen = arcLens[arcLens.length - 1];

  const panels: THREE.Vector2[][] = [];
  let s = 0; // current position along arc

  while (s < totalLen) {
    const panelEnd  = Math.min(s + panW, totalLen);
    const panel = sliceArcByLength(pts, arcLens, s, panelEnd);
    if (panel.length >= 2) panels.push(panel);
    s += period;
  }
  return panels;
}

/** Extract a sub-array of pts between arc lengths [lo, hi]. */
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
      // Check if lo or hi falls between arcLens[i-1] and arcLens[i]
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
  // Deduplicate and sort by arc length
  return result;
}

/* ── Build wall edge wireframe ──────────────────────────────────────────── */

export function buildWallEdgeGeometry(
  wall: WallData,
  rimPts: THREE.Vector2[],
  rimY: number,
  arenaCX = 0,
  arenaCZ = 0,
): THREE.BufferGeometry {
  const effectiveTilt = (wall.fullPerimeter && !wall.hasGaps) ? 0 : wall.tilt;
  const tiltRad = Math.max(-Math.PI / 2, Math.min(30 * DEG2RAD, effectiveTilt * DEG2RAD));
  const clampedHeight = Math.max(MIN_WALL_HEIGHT, wall.height);

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

  for (const panel of panels) {
    const N = panel.length;
    // Bottom rim loop
    for (let i = 0; i < N - 1; i++) {
      verts.push(panel[i].x, rimY, panel[i].y);
      verts.push(panel[i + 1].x, rimY, panel[i + 1].y);
    }
    // Top loop
    for (let i = 0; i < N - 1; i++) {
      const [tx0, ty0, tz0] = topVert(panel[i],   rimY, clampedHeight, tiltRad, centreX, centreZ);
      const [tx1, ty1, tz1] = topVert(panel[i + 1], rimY, clampedHeight, tiltRad, centreX, centreZ);
      verts.push(tx0, ty0, tz0, tx1, ty1, tz1);
    }
    // Vertical edges at endpoints
    if (N > 0) {
      const [tx0, ty0, tz0] = topVert(panel[0], rimY, clampedHeight, tiltRad, centreX, centreZ);
      verts.push(panel[0].x, rimY, panel[0].y, tx0, ty0, tz0);
      const last = panel[N - 1];
      const [tx1, ty1, tz1] = topVert(last, rimY, clampedHeight, tiltRad, centreX, centreZ);
      verts.push(last.x, rimY, last.y, tx1, ty1, tz1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function topVert(
  p: THREE.Vector2,
  rimY: number,
  height: number,
  tiltRad: number,
  cx: number,
  cz: number,
): [number, number, number] {
  const dx = cx - p.x; const dz = cz - p.y;
  const len = Math.sqrt(dx * dx + dz * dz) || 1;
  const inX = dx / len; const inZ = dz / len;
  const topX = p.x + (-Math.sin(tiltRad)) * height * inX;
  const topZ = p.y + (-Math.sin(tiltRad)) * height * inZ;
  const topY = rimY + Math.cos(tiltRad) * height;
  return [topX, topY, topZ];
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
    hasGaps: false, gapWidth: 10, panelWidth: 20,
    topProfile: 'flat', topAmplitude: 3, topFrequency: 1,
    isDouble: false, peakHeight: 8, peakTilt: 30,
    holes: [],
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

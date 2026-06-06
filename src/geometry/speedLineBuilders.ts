import * as THREE from 'three';
import { SL, DEG2RAD, OCTAGON_BASE } from '../config/arenaConstants';
import {
  ArenaData, ZoneData, SpeedLineData, SpeedLineSegment, SpeedLineHandleType,
  SpeedLinePresetType, SpeedLinePresetParams, SpeedLineRamp,
  SpeedLineSection,
} from '../types/arenaTypes';
import { polarToLocalXZ } from './surfaceUtils';
import { SceneSurfaceProjector } from './sceneSurfaceProjector';

/* ══════════════════════════════════════════════════════════════════════════
   Speed line geometry builders.
   Path computation, ribbon, handles, markers, overlap detection, templates.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Bowl wall normal ──────────────────────────────────────────────────── */
export function bowlWallNormal(arena: ArenaData, lx: number, lz: number): THREE.Vector3 {
  if (arena.wallProfile === 'straight') {
    return new THREE.Vector3(-lx, 0, -lz).normalize();
  }
  const rx = arena.radiusX; const rz = arena.radiusZ; const d = arena.depth;
  return new THREE.Vector3(-2 * d * lx / (rx * rx), 1, -2 * d * lz / (rz * rz)).normalize();
}

/* ── Surface normal at path point ─────────────────────────────────────── */
export function pathSurfaceNormal(pt: THREE.Vector3, arena: ArenaData, sl: SpeedLineData): THREE.Vector3 {
  if (sl.surfaceFollow) return bowlWallNormal(arena, pt.x - arena.posX, pt.z - arena.posZ);
  return new THREE.Vector3(0, 1, 0);
}

/* ── Segment path computation ─────────────────────────────────────────── */
export function computeSegmentPath(
  sl: SpeedLineData,
  arena: ArenaData,
  surfFn: (lx: number, lz: number) => number,
  projector?: SceneSurfaceProjector,
): THREE.Vector3[] {
  const surfOffset = sl.surfaceOffset ?? SL.DEFAULT_SURFACE_OFFSET;
  const { lx: lx0, lz: lz0 } = polarToLocalXZ(sl.startR, sl.startAngle);
  const startY = surfFn(lx0, lz0) + surfOffset;
  const pos = new THREE.Vector3(lx0, startY, lz0);

  // Direction quaternion from startDir (yaw in world space)
  let q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sl.startDir * DEG2RAD, 0));

  const pts: THREE.Vector3[] = [pos.clone()];
  const normals: THREE.Vector3[] = [new THREE.Vector3(0, 1, 0)];
  const M = SL.SUB_STEPS_PER_SEG;

  // Precompute arena rotation for arena-local → world conversion
  const arenaRotY = (arena.rotY ?? 0) * DEG2RAD;
  const cosA = Math.cos(arenaRotY);
  const sinA = Math.sin(arenaRotY);

  for (const seg of sl.segments) {
    // Apply segment pivots to direction quaternion
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const right   = new THREE.Vector3(1, 0, 0).applyQuaternion(q);

    // rotY: yaw around world up
    if (seg.rotY !== 0) {
      const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), seg.rotY * DEG2RAD);
      q = qY.multiply(q);
    }
    // rotX: pitch around current right axis
    if (seg.rotX !== 0) {
      const curRight = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
      const qX = new THREE.Quaternion().setFromAxisAngle(curRight, seg.rotX * DEG2RAD);
      q = qX.multiply(q);
    }
    // rotZ: roll around current forward axis
    if (seg.rotZ !== 0) {
      const curFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      const qZ = new THREE.Quaternion().setFromAxisAngle(curFwd, seg.rotZ * DEG2RAD);
      q = qZ.multiply(q);
    }

    void forward; void right;

    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const stepLen = seg.length / M;

    for (let k = 0; k < M; k++) {
      pos.addScaledVector(fwd, stepLen);
      if (sl.surfaceFollow) {
        if (projector) {
          // Convert arena-local XZ → world XZ for raycasting
          const worldX = arena.posX + pos.x * cosA - pos.z * sinA;
          const worldZ = arena.posZ + pos.x * sinA + pos.z * cosA;
          const hit = projector.project(worldX, worldZ, surfOffset);
          pos.y = hit.point.y;
          normals.push(hit.normal.clone());
        } else {
          pos.y = surfFn(pos.x, pos.z) + surfOffset;
          normals.push(new THREE.Vector3(0, 1, 0));
        }
      } else {
        normals.push(new THREE.Vector3(0, 1, 0));
      }
      pts.push(pos.clone());
    }
  }

  // Store normals into sl.pointNormals (runtime-only)
  sl.pointNormals = normals;

  return pts;
}

/* ── Compute joint positions (one per segment boundary) ───────────────── */
export function computeJoints(pts: THREE.Vector3[]): THREE.Vector3[] {
  const M = SL.SUB_STEPS_PER_SEG;
  const joints: THREE.Vector3[] = [pts[0].clone()];
  for (let i = 1; i < pts.length; i++) {
    if (i % M === 0) joints.push(pts[i].clone());
  }
  if ((pts.length - 1) % M !== 0) joints.push(pts[pts.length - 1].clone());
  return joints;
}

/* ── 3D ribbon builder ──────────────────────────────────────────────────── */
export function buildRibbon3D(
  centerline: THREE.Vector3[],
  normals:    THREE.Vector3[],
  width: number,
): THREE.BufferGeometry {
  const N = centerline.length;
  if (N < 2) return new THREE.BufferGeometry();

  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < N; i++) {
    const pt = centerline[i];
    const normal = normals[i];

    // Tangent via central diff
    let tangent: THREE.Vector3;
    if (i === 0) tangent = centerline[1].clone().sub(centerline[0]);
    else if (i === N - 1) tangent = centerline[N-1].clone().sub(centerline[N-2]);
    else tangent = centerline[i+1].clone().sub(centerline[i-1]);

    if (tangent.lengthSq() < 1e-12) tangent.set(0, 0, 1);
    tangent.normalize();

    const rightPerp = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    if (rightPerp.lengthSq() < 1e-12) rightPerp.set(1, 0, 0);

    const left  = pt.clone().addScaledVector(rightPerp, -width / 2);
    const right = pt.clone().addScaledVector(rightPerp,  width / 2);

    positions.push(left.x,  left.y,  left.z);
    positions.push(right.x, right.y, right.z);
  }

  for (let i = 0; i < N - 1; i++) {
    const l0 = i * 2;     const r0 = i * 2 + 1;
    const l1 = (i+1)*2;   const r1 = (i+1)*2 + 1;
    indices.push(l0, r0, l1,  r0, r1, l1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* ── Marker builders ───────────────────────────────────────────────────── */
export function buildStartMarker(pt: THREE.Vector3, color: number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(SL.MARKER_SIZE, 8, 6);
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(pt);
  return m;
}

export function buildEndMarker(pt: THREE.Vector3, color: number): THREE.Mesh {
  const geo = new THREE.ConeGeometry(SL.MARKER_SIZE * 0.8, SL.MARKER_SIZE * 2, 6);
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(pt);
  return m;
}

export function buildArrowMeshes(
  centerline: THREE.Vector3[],
  color: number,
  direction: 'forward' | 'reverse' | 'bidirectional',
): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  let accumulated = 0;
  for (let i = 1; i < centerline.length; i++) {
    const dist = centerline[i].distanceTo(centerline[i-1]);
    accumulated += dist;
    if (accumulated >= SL.ARROW_SPACING) {
      accumulated = 0;
      const tangent = centerline[i].clone().sub(centerline[i-1]).normalize();
      if (direction === 'reverse') tangent.negate();

      const geo = new THREE.ConeGeometry(SL.ARROW_HALF_W, SL.ARROW_LEN, 4);
      const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.7 });
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(centerline[i]);

      const up = new THREE.Vector3(0, 1, 0);
      if (Math.abs(tangent.dot(up)) < 0.99) {
        m.quaternion.setFromUnitVectors(up, tangent);
      }
      meshes.push(m);
    }
  }
  return meshes;
}

/* ── Activation radius indicator (dashed circle) ──────────────────────── */
export function buildActivationRadiusMarker(center: THREE.Vector3, radius: number, color: number): THREE.Mesh {
  const N = 32;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    pts.push(new THREE.Vector3(center.x + Math.cos(a) * radius, center.y + 0.05, center.z + Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
  return new THREE.Mesh(geo, mat);
}

/* ── Handle meshes ─────────────────────────────────────────────────────── */
export function buildHandleMeshes(
  joints: THREE.Vector3[],
  sl: SpeedLineData,
): { mesh: THREE.Mesh; type: SpeedLineHandleType; index: number }[] {
  const result: { mesh: THREE.Mesh; type: SpeedLineHandleType; index: number }[] = [];
  for (let i = 0; i < joints.length; i++) {
    const geo = new THREE.SphereGeometry(SL.HANDLE_RADIUS, 8, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: SL.HANDLE_COLOR, depthTest: false, transparent: true, opacity: 0.9,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(joints[i]);
    const type: SpeedLineHandleType = i === 0 ? 'start' : `joint_${i}`;
    m.userData = { slId: sl.id, handleType: type, handleIndex: i };
    result.push({ mesh: m, type, index: i });
  }
  return result;
}

/* ── Overlap detection ─────────────────────────────────────────────────── */
export function buildOverlapSphere(worldPos: THREE.Vector3): THREE.Mesh {
  const geo = new THREE.SphereGeometry(SL.OVERLAP_SPHERE_R, 8, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.6 });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(worldPos);
  return m;
}

export function samplePathForOverlap(
  sl: SpeedLineData,
  arena: ArenaData,
  surfFn: (lx: number, lz: number) => number,
): THREE.Vector3[] {
  return computeSegmentPath(sl, arena, surfFn);
}

/* ══════════════════════════════════════════════════════════════════════════
   Templates — pure data functions returning SpeedLineSegment[]
   Caller assigns IDs.
   ══════════════════════════════════════════════════════════════════════════ */

function blankSeg(length: number, rotX = 0, rotY = 0, rotZ = 0, speedMult = 0): SpeedLineSegment {
  return { id: '', length, rotX, rotY, rotZ, speedMult, objRotX: 0, objRotY: 0, objRotZ: 0 };
}

export function templateStraight(length: number, N: number): SpeedLineSegment[] {
  const segLen = length / N;
  return Array.from({ length: N }, () => blankSeg(segLen));
}

export function templateCircle(radius: number, N: number): SpeedLineSegment[] {
  const circumference = 2 * Math.PI * radius;
  const segLen = circumference / N;
  const rotY   = 360 / N;
  return Array.from({ length: N }, () => blankSeg(segLen, 0, rotY));
}

export function templateSpiral(outerR: number, turns: number, N: number): SpeedLineSegment[] {
  const circumference = 2 * Math.PI * outerR * turns;
  const segLen = circumference / N;
  const rotY   = turns * 360 / N;
  return Array.from({ length: N }, () => blankSeg(segLen, 1, rotY));
}

export function templateWallSpiral(turns: number, N: number): SpeedLineSegment[] {
  const segLen = 10;
  const rotY   = turns * 360 / N;
  return Array.from({ length: N }, () => blankSeg(segLen, 5, rotY));
}

export function templateZigzag(amplitude: number, segLen: number, N: number): SpeedLineSegment[] {
  const rotY = Math.atan2(amplitude, segLen) * (180 / Math.PI) * 2;
  return Array.from({ length: N }, (_, i) => blankSeg(segLen, 0, i % 2 === 0 ? rotY : -rotY));
}

export function templateWave(amplitude: number, segLen: number, N: number): SpeedLineSegment[] {
  return Array.from({ length: N }, (_, i) => {
    const rotY = Math.sin((i / N) * Math.PI * 2) * amplitude;
    return blankSeg(segLen, 0, rotY);
  });
}

export function templateClimb(angle: number, N: number, segLen: number): SpeedLineSegment[] {
  return Array.from({ length: N }, () => blankSeg(segLen, angle));
}

export function templateLoop(radius: number, N: number): SpeedLineSegment[] {
  const circumference = 2 * Math.PI * radius;
  const segLen = circumference / N;
  const rotX   = 360 / N;
  return Array.from({ length: N }, () => blankSeg(segLen, rotX));
}

export function templateCorkscrew(radius: number, turns: number, N: number): SpeedLineSegment[] {
  const circumference = 2 * Math.PI * radius * turns;
  const segLen = circumference / N;
  const rotY   = turns * 360 / N;
  return Array.from({ length: N }, () => blankSeg(segLen, 5, rotY));
}

export function templateAerialFigure8(radius: number, N: number): SpeedLineSegment[] {
  const half = Math.floor(N / 2);
  const circumference = 2 * Math.PI * radius;
  const segLen = circumference / half;
  const rotY = 360 / half;
  const segs1 = Array.from({ length: half }, () => blankSeg(segLen, 0,  rotY));
  const segs2 = Array.from({ length: half }, () => blankSeg(segLen, 5, -rotY));
  return [...segs1, ...segs2];
}

export function templateLaunchRamp(rampAngle: number, boostMult: number, N: number, segLen: number): SpeedLineSegment[] {
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const seg = blankSeg(segLen, rampAngle * t);
    seg.speedMult = 1 + (boostMult - 1) * t;
    return seg;
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   PRESET SHAPE SAMPLERS
   All return N+1 [x, z] points in arena-local space.
   ══════════════════════════════════════════════════════════════════════════ */

function rotPt(x: number, z: number, rotY_deg: number): [number, number] {
  const r = rotY_deg * DEG2RAD;
  return [x * Math.cos(r) - z * Math.sin(r), x * Math.sin(r) + z * Math.cos(r)];
}

/** Distribute N+1 samples across arcs defined by sectionAngles (sum 360°).
 *  Returns array of angles in radians for each sample point. */
function distributeAngles(N: number, sectionAngles: number[], fullRange: number): number[] {
  if (sectionAngles.length === 0) {
    return Array.from({ length: N + 1 }, (_, i) => (i / N) * fullRange);
  }
  const sum = sectionAngles.reduce((a, b) => a + b, 0);
  const norm = sectionAngles.map(a => (a / sum) * 360);
  const angles: number[] = [];
  let accumulated = 0;
  for (let s = 0; s < norm.length; s++) {
    const arcRad = norm[s] * DEG2RAD;
    const segsInArc = Math.max(1, Math.round((norm[s] / 360) * N));
    for (let k = 0; k <= segsInArc; k++) {
      if (angles.length <= N) angles.push(accumulated + (k / segsInArc) * arcRad);
    }
    accumulated += arcRad;
  }
  while (angles.length < N + 1) angles.push(accumulated);
  return angles.slice(0, N + 1);
}

export function sampleCircle(
  cx: number, cz: number, r: number, rotY: number, N: number,
  sectionAngles: number[] = [], arcFraction = 1.0,
): [number, number][] {
  const fullRange = arcFraction * Math.PI * 2;
  const thetas = distributeAngles(N, sectionAngles.length > 0 && arcFraction >= 1.0 ? sectionAngles : [], fullRange);
  return thetas.slice(0, N + 1).map(t => {
    const [rx, rz] = rotPt(r * Math.cos(t), r * Math.sin(t), rotY);
    return [cx + rx, cz + rz];
  });
}

export function sampleEllipse(
  cx: number, cz: number, rx: number, rz: number, rotY: number, N: number,
  sectionAngles: number[] = [], arcFraction = 1.0,
): [number, number][] {
  const fullRange = arcFraction * Math.PI * 2;
  const thetas = distributeAngles(N, sectionAngles.length > 0 && arcFraction >= 1.0 ? sectionAngles : [], fullRange);
  return thetas.slice(0, N + 1).map(t => {
    const [lx, lz] = rotPt(rx * Math.cos(t), rz * Math.sin(t), rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function samplePolygon(
  cx: number, cz: number, r: number, sides: number, rotY: number, N: number,
  sectionAngles: number[] = [], arcFraction = 1.0,
): [number, number][] {
  const effectiveSides = sectionAngles.length > 0 ? sectionAngles.length : sides;
  const angles = sectionAngles.length > 0 ? sectionAngles : Array(effectiveSides).fill(360 / effectiveSides);
  const pts: [number, number][] = [];
  let cumDeg = 0;
  const vertices: number[] = [0];
  for (const a of angles) { cumDeg += a; vertices.push(cumDeg); }
  const totalDeg = cumDeg;
  const arcDeg = arcFraction * totalDeg;
  const segsPerSide = Math.max(1, Math.floor(N / effectiveSides));
  for (let s = 0; s < effectiveSides; s++) {
    const startDeg = vertices[s];
    const endDeg   = vertices[s + 1];
    if (startDeg >= arcDeg) break;
    const t0 = startDeg * DEG2RAD;
    const t1 = Math.min(endDeg, arcDeg) * DEG2RAD;
    const v0x = r * Math.cos(t0); const v0z = r * Math.sin(t0);
    const v1x = r * Math.cos(t1); const v1z = r * Math.sin(t1);
    for (let k = 0; k <= segsPerSide; k++) {
      const tt = k / segsPerSide;
      const lx = v0x + (v1x - v0x) * tt;
      const lz = v0z + (v1z - v0z) * tt;
      const [rx2, rz2] = rotPt(lx, lz, rotY);
      pts.push([cx + rx2, cz + rz2]);
    }
  }
  if (pts.length > N + 1) pts.length = N + 1;
  while (pts.length < N + 1) pts.push(pts[pts.length - 1]);
  return pts;
}

export function sampleTriangle(
  cx: number, cz: number, r: number, rotY: number, N: number,
  sectionAngles: number[] = [],
): [number, number][] {
  return samplePolygon(cx, cz, r, 3, rotY, N, sectionAngles);
}

export function sampleStar(
  cx: number, cz: number, outerR: number, innerFrac: number, petals: number, rotY: number, N: number,
): [number, number][] {
  const innerR = outerR * innerFrac;
  const pts: [number, number][] = [];
  const total = petals * 2;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * total;
    const angle = (t / total) * Math.PI * 2;
    const isOuter = Math.floor(t) % 2 === 0;
    const rad = isOuter ? outerR : innerR;
    const [lx, lz] = rotPt(rad * Math.cos(angle), rad * Math.sin(angle), rotY);
    pts.push([cx + lx, cz + lz]);
  }
  return pts;
}

export function sampleFlower(
  cx: number, cz: number, R: number, innerFrac: number, petals: number, rotY: number, N: number,
  arcFraction = 1.0,
): [number, number][] {
  const fullRange = petals % 2 === 0 ? Math.PI * 2 : Math.PI;
  const range = fullRange * arcFraction;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * range;
    const r = Math.max(innerFrac * R, R * Math.abs(Math.cos(petals * t)));
    const [lx, lz] = rotPt(r * Math.cos(t), r * Math.sin(t), rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

function applyEasing(t: number, easing: string): number {
  switch (easing) {
    case 'ease_in':    return t * t;
    case 'ease_out':   return 1 - (1 - t) * (1 - t);
    case 'ease_inout': return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    default:           return t;
  }
}

export function sampleSpiralOut(
  cx: number, cz: number, innerR: number, outerR: number, turns: number,
  loopGap: number, easing: string, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const angle = t * turns * Math.PI * 2;
    const e = applyEasing(t, easing);
    const r = innerR + (outerR - innerR) * e;
    const [lx, lz] = rotPt(r * Math.cos(angle), r * Math.sin(angle), rotY);
    void loopGap;
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleSpiralIn(
  cx: number, cz: number, outerR: number, innerR: number, turns: number,
  loopGap: number, easing: string, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const angle = t * turns * Math.PI * 2;
    const e = applyEasing(t, easing);
    const r = outerR + (innerR - outerR) * e;
    const [lx, lz] = rotPt(r * Math.cos(angle), r * Math.sin(angle), rotY);
    void loopGap;
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleHelix(
  cx: number, cz: number, r: number, turns: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const angle = t * turns * Math.PI * 2;
    const [lx, lz] = rotPt(r * Math.cos(angle), r * Math.sin(angle), rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleZigzag(
  cx: number, cz: number, length: number, amplitude: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const lat = amplitude * (i % 2 === 0 ? 1 : -1);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleWave(
  cx: number, cz: number, length: number, amplitude: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const lat = amplitude * Math.sin(t * Math.PI * 2);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleCosineWave(
  cx: number, cz: number, length: number, amplitude: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const lat = amplitude * Math.cos(t * Math.PI * 2);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleDampedWave(
  cx: number, cz: number, length: number, maxAmp: number, periods: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const env = 1 - t;
    const lat = maxAmp * env * Math.sin(t * periods * Math.PI * 2);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleGrowingWave(
  cx: number, cz: number, length: number, maxAmp: number, periods: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const env = t;
    const lat = maxAmp * env * Math.sin(t * periods * Math.PI * 2);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleSnake(
  cx: number, cz: number, length: number, amplitude: number, periods: number, rotY: number, N: number,
): [number, number][] {
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const fwd = t * length;
    const lat = amplitude * Math.sin(t * periods * Math.PI * 2);
    const [lx, lz] = rotPt(lat, fwd, rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleFigure8(
  cx: number, cz: number, r: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const half = Math.ceil((N + 1) / 2);
  const other = N + 1 - half;
  const fullRange = arcFraction * Math.PI * 2;
  const pts: [number, number][] = [];
  // First loop CCW, offset +r on X
  for (let i = 0; i < half; i++) {
    const t = (i / Math.max(1, half - 1)) * (fullRange / 2);
    const [lx, lz] = rotPt(r + r * Math.cos(t), r * Math.sin(t), rotY);
    pts.push([cx + lx, cz + lz]);
  }
  // Second loop CW, offset -r on X
  for (let i = 0; i < other; i++) {
    const t = (i / Math.max(1, other - 1)) * (fullRange / 2);
    const [lx, lz] = rotPt(-r + r * Math.cos(-t), r * Math.sin(-t), rotY);
    pts.push([cx + lx, cz + lz]);
  }
  return pts.slice(0, N + 1);
}

export function sampleLemniscate(
  cx: number, cz: number, a: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const fullRange = arcFraction * Math.PI * 2;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = -Math.PI + (i / N) * fullRange;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const lx = a * Math.cos(t) / denom;
    const lz = a * Math.sin(t) * Math.cos(t) / denom;
    const [rx, rz] = rotPt(lx, lz, rotY);
    return [cx + rx, cz + rz] as [number, number];
  });
}

export function sampleTreefoil(
  cx: number, cz: number, r: number, rotY: number, N: number,
): [number, number][] {
  // Rose curve k=3/2: need theta in [0..4pi]
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * Math.PI * 4;
    const rad = r * Math.abs(Math.cos(1.5 * t));
    const [lx, lz] = rotPt(rad * Math.cos(t), rad * Math.sin(t), rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleCardioid(
  cx: number, cz: number, a: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const range = arcFraction * Math.PI * 2;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * range;
    const r = a * (1 - Math.cos(t));
    const [lx, lz] = rotPt(r * Math.cos(t), r * Math.sin(t), rotY);
    return [cx + lx, cz + lz] as [number, number];
  });
}

export function sampleEpicycloid(
  cx: number, cz: number, R: number, r: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const range = arcFraction * Math.PI * 2;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * range;
    const lx = (R + r) * Math.cos(t) - r * Math.cos(((R + r) / r) * t);
    const lz = (R + r) * Math.sin(t) - r * Math.sin(((R + r) / r) * t);
    const [rx, rz] = rotPt(lx, lz, rotY);
    return [cx + rx, cz + rz] as [number, number];
  });
}

export function sampleHypocycloid(
  cx: number, cz: number, R: number, r: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const range = arcFraction * Math.PI * 2;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * range;
    const lx = (R - r) * Math.cos(t) + r * Math.cos(((R - r) / r) * t);
    const lz = (R - r) * Math.sin(t) - r * Math.sin(((R - r) / r) * t);
    const [rx, rz] = rotPt(lx, lz, rotY);
    return [cx + rx, cz + rz] as [number, number];
  });
}

export function sampleAstroid(
  cx: number, cz: number, R: number, rotY: number, N: number, arcFraction = 1.0,
): [number, number][] {
  const range = arcFraction * Math.PI * 2;
  return Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * range;
    const lx = R * Math.pow(Math.cos(t), 3);
    const lz = R * Math.pow(Math.sin(t), 3);
    const [rx, rz] = rotPt(lx, lz, rotY);
    return [cx + rx, cz + rz] as [number, number];
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   CORE CONVERTERS
   ══════════════════════════════════════════════════════════════════════════ */

/** Convert angle to [-180, 180) range */
function normalizeAngle180(deg: number): number {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

/** Convert N+1 XZ waypoints to SpeedLineSegment array using heading convention. */
export function waypointsToSegments(
  pts: [number, number][],
  heightDelta: number,
): { segments: SpeedLineSegment[]; startDir: number; startR: number; startAngle: number } {
  const N = pts.length - 1;
  if (N < 1) return { segments: [], startDir: 0, startR: 0, startAngle: 0 };

  const headings: number[] = [];
  for (let i = 0; i < N; i++) {
    const dx = pts[i + 1][0] - pts[i][0];
    const dz = pts[i + 1][1] - pts[i][1];
    headings.push(Math.atan2(-dx, dz) * (180 / Math.PI));
  }

  const startR     = Math.hypot(pts[0][0], pts[0][1]);
  const startAngle = Math.atan2(pts[0][1], pts[0][0]) * (180 / Math.PI);
  const startDir   = headings[0];

  const yRisePerSeg = heightDelta / N;
  const segments: SpeedLineSegment[] = [];

  for (let i = 0; i < N; i++) {
    const dx = pts[i + 1][0] - pts[i][0];
    const dz = pts[i + 1][1] - pts[i][1];
    const horzLen = Math.hypot(dx, dz);
    const segLen  = Math.hypot(horzLen, yRisePerSeg);
    const rotY    = i === 0 ? 0 : normalizeAngle180(headings[i] - headings[i - 1]);
    const rotX    = horzLen > 1e-9 ? Math.atan2(yRisePerSeg, horzLen) * (180 / Math.PI) : 0;

    segments.push({
      id: '',
      length: Math.max(0.01, segLen),
      rotX,
      rotY,
      rotZ: 0,
      speedMult: 0,
      objRotX: 0, objRotY: 0, objRotZ: 0,
      maxStayDuration: 0,
      statModifiers: null,
      sectionIndex: -1,
    });
  }

  return { segments, startDir, startR, startAngle };
}

/** Evaluate a waveform at sample index i, returning value in [-1, +1]. */
function evaluateWaveform(
  waveform: string,
  i: number,
  N: number,
  periodSteps: number,
  modPhase: number,
  pulseWidth: number,
): number {
  const t = (i / N) * N / periodSteps;   // cycles
  const phase = modPhase / 360;
  const tPhased = t + phase;
  const frac = tPhased - Math.floor(tPhased);   // 0..1 within period
  switch (waveform) {
    case 'sine':             return Math.sin(frac * Math.PI * 2);
    case 'cosine':           return Math.cos(frac * Math.PI * 2);
    case 'triangle':         return frac < 0.5 ? 4 * frac - 1 : 3 - 4 * frac;
    case 'sawtooth':         return 2 * frac - 1;
    case 'inverse_sawtooth': return 1 - 2 * frac;
    case 'square':           return frac < 0.5 ? 1 : -1;
    case 'pulse':            return frac < pulseWidth ? 1 : 0;
    case 'exp_rise':         return Math.pow(frac, 2) * 2 - 1;
    case 'exp_decay':        return 1 - Math.pow(frac, 2) * 2;
    case 'damped_sine':      return (1 - i / N) * Math.sin(frac * Math.PI * 2);
    case 'growing_sine':     return (i / N) * Math.sin(frac * Math.PI * 2);
    default:                 return Math.sin(frac * Math.PI * 2);
  }
}

/** Apply shape modulation to waypoints in-place. */
export function applyModulation(
  pts: [number, number][],
  params: SpeedLinePresetParams,
): void {
  const mod = params.modulation;
  if (mod.type === 'none') return;
  const N = pts.length - 1;
  const rotRad = params.rotationY * DEG2RAD;
  for (let i = 0; i <= N; i++) {
    const wave = evaluateWaveform(mod.waveform, i, N, mod.periodSteps, mod.modPhase, mod.pulseWidth);
    const dx = pts[i][0] - params.centerX;
    const dz = pts[i][1] - params.centerZ;
    switch (mod.type) {
      case 'radial_scale': {
        const dist = Math.hypot(dx, dz);
        const scale = 1 + mod.amplitude * wave / Math.max(1, dist);
        pts[i][0] = params.centerX + dx * scale;
        pts[i][1] = params.centerZ + dz * scale;
        break;
      }
      case 'angle_drift': {
        const angle = Math.atan2(dz, dx) + mod.amplitude * wave * DEG2RAD;
        const dist  = Math.hypot(dx, dz);
        pts[i][0] = params.centerX + dist * Math.cos(angle);
        pts[i][1] = params.centerZ + dist * Math.sin(angle);
        break;
      }
      case 'xyz_shift': {
        pts[i][0] += mod.amplitude * wave * Math.cos(rotRad);
        pts[i][1] += mod.amplitude * wave * Math.sin(rotRad);
        break;
      }
    }
  }
}

/** Apply speed ramp profile to segments' speedMult. */
export function applySpeedRamp(segs: SpeedLineSegment[], ramp: SpeedLineRamp): void {
  const N = segs.length;
  if (N === 0) return;
  const { profile, speedMin, speedMax, entrySteps, exitSteps } = ramp;
  for (let i = 0; i < N; i++) {
    let mult = speedMax;
    switch (profile) {
      case 'constant':
        mult = speedMax;
        break;
      case 'accelerate':
        if (i < entrySteps) mult = speedMin + (speedMax - speedMin) * (i / Math.max(1, entrySteps - 1));
        else mult = speedMax;
        break;
      case 'decelerate':
        if (i >= N - exitSteps) mult = speedMax + (speedMin - speedMax) * ((i - (N - exitSteps)) / Math.max(1, exitSteps - 1));
        else mult = speedMax;
        break;
      case 'bell':
        if (i < entrySteps) mult = speedMin + (speedMax - speedMin) * (i / Math.max(1, entrySteps - 1));
        else if (i >= N - exitSteps) mult = speedMax + (speedMin - speedMax) * ((i - (N - exitSteps)) / Math.max(1, exitSteps - 1));
        else mult = speedMax;
        break;
      case 'inverse_bell':
        if (i < entrySteps) mult = speedMax + (speedMin - speedMax) * (i / Math.max(1, entrySteps - 1));
        else if (i >= N - exitSteps) mult = speedMin + (speedMax - speedMin) * ((i - (N - exitSteps)) / Math.max(1, exitSteps - 1));
        else mult = speedMin;
        break;
    }
    segs[i].speedMult = mult;
  }
}

/** Extract angleDeg[] from SpeedLineSection[] for use by samplers. */
function sectionToAngles(sections: SpeedLineSection[]): number[] {
  return sections.map(s => s.angleDeg);
}

/** Main preset segment generator — calls shape sampler → modulation → waypointsToSegments → ramp → IDs. */
export function generatePresetSegments(
  preset: SpeedLinePresetType,
  params: SpeedLinePresetParams,
  ramp: SpeedLineRamp,
  slId: string,
  getNextSegId: () => string,
): { segments: SpeedLineSegment[]; startDir: number; startR: number; startAngle: number } {
  const { centerX: cx, centerZ: cz, radiusX: rx, radiusZ: rz, rotationY: rotY,
          sides, petals, turns, steps: N, innerRadius, arcFraction,
          sections, pitchPerTurn } = params;

  const sectionAngles = sectionToAngles(sections);

  let pts: [number, number][] = [];
  let heightDelta = params.heightDelta;

  switch (preset) {
    case 'circle':
      pts = sampleCircle(cx, cz, rx, rotY, N, sectionAngles, arcFraction);
      break;
    case 'ellipse':
      pts = sampleEllipse(cx, cz, rx, rz, rotY, N, sectionAngles, arcFraction);
      break;
    case 'polygon':
      pts = samplePolygon(cx, cz, rx, sides, rotY, N, sectionAngles, arcFraction);
      break;
    case 'triangle':
      pts = sampleTriangle(cx, cz, rx, rotY, N, sectionAngles);
      break;
    case 'star':
      pts = sampleStar(cx, cz, rx, innerRadius, petals, rotY, N);
      break;
    case 'flower':
    case 'rose_curve':
      pts = sampleFlower(cx, cz, rx, innerRadius, petals, rotY, N, arcFraction);
      break;
    case 'spiral_in':
      pts = sampleSpiralIn(cx, cz, rx, rx * innerRadius, turns, params.loopGap, params.radiusEasing, rotY, N);
      heightDelta = pitchPerTurn * turns;
      break;
    case 'spiral_out':
      pts = sampleSpiralOut(cx, cz, rx * innerRadius, rx, turns, params.loopGap, params.radiusEasing, rotY, N);
      heightDelta = pitchPerTurn * turns;
      break;
    case 'helix':
      pts = sampleHelix(cx, cz, rx, turns, rotY, N);
      heightDelta = pitchPerTurn * turns;
      break;
    case 'zigzag':
      pts = sampleZigzag(cx, cz, rx * 2, rz, rotY, N);
      break;
    case 'wave':
      pts = sampleWave(cx, cz, rx * 2, rz, rotY, N);
      break;
    case 'cosine_wave':
      pts = sampleCosineWave(cx, cz, rx * 2, rz, rotY, N);
      break;
    case 'damped_wave':
      pts = sampleDampedWave(cx, cz, rx * 2, rz, petals, rotY, N);
      break;
    case 'growing_wave':
      pts = sampleGrowingWave(cx, cz, rx * 2, rz, petals, rotY, N);
      break;
    case 'snake':
      pts = sampleSnake(cx, cz, rx * 2, rz, petals, rotY, N);
      break;
    case 'figure_8':
      pts = sampleFigure8(cx, cz, rx, rotY, N, arcFraction);
      break;
    case 'lemniscate':
      pts = sampleLemniscate(cx, cz, rx, rotY, N, arcFraction);
      break;
    case 'trefoil':
      pts = sampleTreefoil(cx, cz, rx, rotY, N);
      break;
    case 'cardioid':
      pts = sampleCardioid(cx, cz, rx, rotY, N, arcFraction);
      break;
    case 'epicycloid': {
      const r_ep = rx / Math.max(1, petals - 1);
      pts = sampleEpicycloid(cx, cz, rx, r_ep, rotY, N, arcFraction);
      break;
    }
    case 'hypocycloid': {
      const r_hp = rx / Math.max(2, petals);
      pts = sampleHypocycloid(cx, cz, rx, r_hp, rotY, N, arcFraction);
      break;
    }
    case 'astroid':
      pts = sampleAstroid(cx, cz, rx, rotY, N, arcFraction);
      break;
    case 'point_zone':
      pts = sampleCircle(cx, cz, rx, rotY, Math.max(8, N), [], 1.0);
      break;
    case 'jump': {
      // Jump preset: straight XZ lerp from source to pre-resolved destination.
      // ArenaSandbox pre-resolves src into params.startPosX/Z/Y and dst into params.endPosX/Z/Y
      // before calling generatePresetSegments (src = sl.startR/startAngle converted to arena-local).
      const srcX = params.startPosX;
      const srcZ = params.startPosZ;
      const dstX = params.endPosX;
      const dstZ = params.endPosZ;
      const steps = Math.max(4, N);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        pts.push([srcX + (dstX - srcX) * t, srcZ + (dstZ - srcZ) * t]);
      }
      heightDelta = params.endPosY - params.startPosY;
      break;
    }
    default:
      return { segments: [], startDir: 0, startR: 0, startAngle: 0 };
  }

  // Apply modulation before segment conversion
  if (params.modulation.type !== 'none') {
    applyModulation(pts, params);
  }

  const result = waypointsToSegments(pts, heightDelta);
  const { segments } = result;

  // Close loop — append segment back to start
  if (params.closeLoop && arcFraction >= 1.0 && pts.length >= 2) {
    const last = pts[pts.length - 1];
    const first = pts[0];
    const dx = first[0] - last[0];
    const dz = first[1] - last[1];
    const closePts: [number, number][] = [last, first];
    const closeResult = waypointsToSegments(closePts, 0);
    if (closeResult.segments.length > 0) {
      const closeSeg = closeResult.segments[0];
      if (segments.length > 0) {
        const prevHeading = Math.atan2(-dx, dz) * (180 / Math.PI);
        const lastSeg = segments[segments.length - 1];
        const lastHeading = result.startDir + segments.reduce((acc, s) => acc + s.rotY, 0);
        closeSeg.rotY = normalizeAngle180(prevHeading - lastHeading);
      }
      segments.push(closeSeg);
    }
  }

  // Apply section properties to segments
  if (sections.length > 0) {
    const totalSegs = segments.length;
    let segIdx = 0;
    for (let s = 0; s < sections.length && segIdx < totalSegs; s++) {
      const sec = sections[s];
      const segsInSection = Math.max(1, Math.round((sec.angleDeg / 360) * totalSegs));
      const startIdx = segIdx;
      const endIdx   = Math.min(segIdx + segsInSection, totalSegs);
      for (let k = startIdx; k < endIdx; k++) {
        segments[k].maxStayDuration = sec.maxStayDuration;
        segments[k].statModifiers   = sec.statModifiers;
        segments[k].sectionIndex    = s;
        // Apply per-section Y offset as rotX adjustment (Y rise per segment)
        if (sec.yOffset !== 0) {
          const nextSec = sections[s + 1];
          const nextY   = nextSec ? nextSec.yOffset : (params.closeLoop ? sections[0]?.yOffset ?? 0 : sec.yOffset);
          const t       = segsInSection > 1 ? (k - startIdx) / (segsInSection - 1) : 0;
          const yAtSeg  = sec.yOffset + (nextY - sec.yOffset) * t;
          const segLen  = segments[k].length;
          if (segLen > 1e-9) {
            segments[k].rotX += Math.atan2(yAtSeg / segsInSection, segLen) * (180 / Math.PI);
          }
        }
      }
      segIdx = endIdx;
    }
  }

  // Apply start/end position Y adjustments via rotX on first/last segment
  if (params.startPosY !== 0 && segments.length > 0) {
    const seg = segments[0];
    if (seg.length > 1e-9) seg.rotX += Math.atan2(params.startPosY, seg.length) * (180 / Math.PI);
  }
  if (params.endPosY !== 0 && segments.length > 0) {
    const seg = segments[segments.length - 1];
    if (seg.length > 1e-9) seg.rotX += Math.atan2(params.endPosY, seg.length) * (180 / Math.PI);
  }

  // Apply speed ramp
  applySpeedRamp(segments, ramp);

  // Assign IDs
  void slId;
  for (const seg of segments) {
    seg.id = getNextSegId();
  }

  return { segments, startDir: result.startDir, startR: result.startR, startAngle: result.startAngle };
}

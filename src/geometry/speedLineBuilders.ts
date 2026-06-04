import * as THREE from 'three';
import { SL, DEG2RAD, OCTAGON_BASE } from '../config/arenaConstants';
import { ArenaData, ZoneData, SpeedLineData, SpeedLineSegment, SpeedLineHandleType } from '../types/arenaTypes';
import { polarToLocalXZ } from './surfaceUtils';

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
  surfFn: (lx: number, lz: number) => number,
): THREE.Vector3[] {
  const { lx: lx0, lz: lz0 } = polarToLocalXZ(sl.startR, sl.startAngle);
  const startY = surfFn(lx0, lz0) + SL.SURFACE_LIFT;
  const pos = new THREE.Vector3(lx0, startY, lz0);

  // Direction quaternion from startDir (yaw in world space)
  let q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sl.startDir * DEG2RAD, 0));

  const pts: THREE.Vector3[] = [pos.clone()];
  const M = SL.SUB_STEPS_PER_SEG;

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
        pos.y = surfFn(pos.x, pos.z) + SL.SURFACE_LIFT;
      }
      pts.push(pos.clone());
    }
  }

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
  surfFn: (lx: number, lz: number) => number,
): THREE.Vector3[] {
  const pts = computeSegmentPath(sl, surfFn);
  return pts;
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

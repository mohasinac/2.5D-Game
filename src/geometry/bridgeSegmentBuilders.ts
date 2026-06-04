/**
 * bridgeSegmentBuilders.ts
 * Bridge track geometry: segment-based Hot-Wheels style tracks.
 *
 * Each segment has its own shape (straight/curve/ramp/loop/hairpin/corkscrew/chicane/bezier)
 * and inherits the cross-section (flat or U-channel) from the parent BridgeData.section.
 *
 * Pose: { pos, dir, up } — orthonormal frame. dir = forward, up = track normal (usually world-up
 * unless banked or in a loop). All geometry is swept along the sampled pose array.
 */
import * as THREE from 'three';
import {
  DEG2RAD,
  BRIDGE_SEGMENT_SAMPLES,
  BRIDGE_LOOP_SEGMENTS,
  BRIDGE_CROSS_COLS,
  DEFAULT_SEGMENT_LENGTH,
  DEFAULT_CURVE_RADIUS,
  DEFAULT_CURVE_ANGLE,
  DEFAULT_LOOP_RADIUS,
  DEFAULT_HAIRPIN_RADIUS,
  DEFAULT_CORKSCREW_LENGTH,
  DEFAULT_BRIDGE_WIDTH,
  DEFAULT_BRIDGE_DEPTH,
} from '../config/arenaConstants';
import {
  BridgeSegmentData, BridgeSegmentType,
  BridgeSection, BridgeCrossSection,
  BridgeEndpointRef, ArenaData, WallData,
} from '../types/arenaTypes';

/* ── Pose ──────────────────────────────────────────────────────────────── */

export interface SegmentPose {
  pos: THREE.Vector3;
  dir: THREE.Vector3;   // forward (normalised)
  up:  THREE.Vector3;   // track normal (normalised)
}

function clonePose(p: SegmentPose): SegmentPose {
  return { pos: p.pos.clone(), dir: p.dir.clone(), up: p.up.clone() };
}

/** Returns the binormal = dir × up (pointing to the right of the track). */
function binormal(pose: SegmentPose): THREE.Vector3 {
  return new THREE.Vector3().crossVectors(pose.dir, pose.up).normalize();
}

/* ── Default starting pose (world-origin, facing +X) ────────────────────── */
export const DEFAULT_START_POSE: SegmentPose = {
  pos: new THREE.Vector3(0, 31, 0),  // just above default octagon base (30 cm)
  dir: new THREE.Vector3(1, 0, 0),
  up:  new THREE.Vector3(0, 1, 0),
};

/* ── Resolve arena/wall rim angle → world start pose ────────────────────── */
export function resolveStartPose(
  ref: BridgeEndpointRef,
  arenas: Map<string, ArenaData>,
  walls: Map<string, WallData>,
  baseHeight: number,
): SegmentPose {
  if (ref.type === 'freepoint') {
    const yaw = ref.freeDirDeg * DEG2RAD;
    return {
      pos: new THREE.Vector3(ref.freePosX, ref.freePosY, ref.freePosZ),
      dir: new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw)).normalize(),
      up:  new THREE.Vector3(0, 1, 0),
    };
  }
  if (ref.type === 'arena') {
    const arena = arenas.get(ref.id);
    if (!arena) return clonePose(DEFAULT_START_POSE);
    const ang = ref.angle * DEG2RAD;
    const rx = arena.radiusX; const rz = arena.radiusZ;
    const rimX = arena.posX + rx * Math.cos(ang);
    const rimZ = arena.posZ + rz * Math.sin(ang);
    const rimY = baseHeight + arena.posY;
    const tangX =  -rz * Math.sin(ang);
    const tangZ =   rx * Math.cos(ang);
    const tangLen = Math.sqrt(tangX * tangX + tangZ * tangZ) || 1;
    return {
      pos: new THREE.Vector3(rimX, rimY, rimZ),
      dir: new THREE.Vector3(tangX / tangLen, 0, tangZ / tangLen),
      up:  new THREE.Vector3(0, 1, 0),
    };
  }
  // wall attachment — simplified: use freepoint fallback
  return clonePose(DEFAULT_START_POSE);
}

/* ── Per-type path sampler ──────────────────────────────────────────────── */

/** Returns BRIDGE_SEGMENT_SAMPLES poses along the segment path. */
export function sampleSegmentPath(
  seg: BridgeSegmentData,
  startPose: SegmentPose,
): SegmentPose[] {
  switch (seg.type) {
    case 'straight': return sampleStraight(startPose, seg.length, BRIDGE_SEGMENT_SAMPLES);
    case 'ramp':     return sampleRamp(startPose, seg.length, seg.rampAngle, BRIDGE_SEGMENT_SAMPLES);
    case 'curve':    return sampleCurve(startPose, seg.curveRadius, seg.curveAngle, seg.curveDirection, seg.bankAngle, BRIDGE_SEGMENT_SAMPLES);
    case 'hairpin':  return sampleCurve(startPose, seg.curveRadius || DEFAULT_HAIRPIN_RADIUS, 180, seg.curveDirection, seg.bankAngle, BRIDGE_SEGMENT_SAMPLES);
    case 'loop':     return sampleLoop(startPose, seg.loopRadius, BRIDGE_LOOP_SEGMENTS);
    case 'corkscrew':return sampleCorkscrew(startPose, seg.corkscrewLength, seg.corkscrewTurns, BRIDGE_SEGMENT_SAMPLES);
    case 'chicane':  return sampleChicane(startPose, seg.curveRadius, seg.curveAngle / 2, seg.curveDirection, BRIDGE_SEGMENT_SAMPLES);
    case 'bezier':   return sampleBezier(startPose, seg, BRIDGE_SEGMENT_SAMPLES);
    default:         return sampleStraight(startPose, DEFAULT_SEGMENT_LENGTH, BRIDGE_SEGMENT_SAMPLES);
  }
}

/** Returns the end pose of the segment (last element of sampleSegmentPath). */
export function computeSegmentEndPose(seg: BridgeSegmentData, startPose: SegmentPose): SegmentPose {
  const samples = sampleSegmentPath(seg, startPose);
  return samples[samples.length - 1];
}

/* ── Individual path samplers ───────────────────────────────────────────── */

function sampleStraight(start: SegmentPose, length: number, N: number): SegmentPose[] {
  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    result.push({
      pos: start.pos.clone().addScaledVector(start.dir, t * length),
      dir: start.dir.clone(),
      up:  start.up.clone(),
    });
  }
  return result;
}

function sampleRamp(start: SegmentPose, length: number, rampAngleDeg: number, N: number): SegmentPose[] {
  const rampRad = rampAngleDeg * DEG2RAD;
  // Forward direction after ramp (tilted in the vertical plane)
  const right = binormal(start);
  const rampDir = start.dir.clone()
    .multiplyScalar(Math.cos(rampRad))
    .addScaledVector(start.up, Math.sin(rampRad))
    .normalize();
  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    result.push({
      pos: start.pos.clone().addScaledVector(rampDir, t * length),
      dir: rampDir.clone(),
      up:  start.up.clone(),
    });
  }
  return result;
}

function sampleCurve(
  start: SegmentPose,
  radius: number,
  angleDeg: number,
  direction: 'left' | 'right',
  bankAngleDeg: number,
  N: number,
): SegmentPose[] {
  const totalRad = angleDeg * DEG2RAD;
  const sign = direction === 'right' ? 1 : -1;
  const right = binormal(start);
  // Centre of circular arc
  const centre = start.pos.clone().addScaledVector(right, sign * radius);
  const bankRad = bankAngleDeg * DEG2RAD;

  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const ang = t * totalRad;
    // Position on circle: rotate start→centre vector around up axis
    const toStart = start.pos.clone().sub(centre);
    const rotated = rotateAroundAxis(toStart, start.up, -sign * ang);
    const pos = centre.clone().add(rotated);

    // Direction = tangent to circle
    const tangent = rotateAroundAxis(start.dir.clone(), start.up, -sign * ang);
    // Up = banked
    const bankUp = rotateAroundAxis(start.up.clone(), tangent, sign * bankRad * t);

    result.push({ pos, dir: tangent.normalize(), up: bankUp.normalize() });
  }
  return result;
}

function sampleLoop(start: SegmentPose, radius: number, N: number): SegmentPose[] {
  // Full 360° vertical loop; centre is above start pos
  const right = binormal(start);
  const centre = start.pos.clone().addScaledVector(start.up, radius);
  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const ang = t * Math.PI * 2;
    // Start at bottom (facing forward), rotate around right axis
    const toStart = start.pos.clone().sub(centre);
    const rotated = rotateAroundAxis(toStart, right, -ang);
    const pos = centre.clone().add(rotated);
    const tangent = rotateAroundAxis(start.dir.clone(), right, -ang);
    const up = rotateAroundAxis(start.up.clone(), right, -ang);
    result.push({ pos, dir: tangent.normalize(), up: up.normalize() });
  }
  return result;
}

function sampleCorkscrew(start: SegmentPose, length: number, turns: number, N: number): SegmentPose[] {
  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const roll = t * turns * Math.PI * 2;
    const pos = start.pos.clone().addScaledVector(start.dir, t * length);
    const up = rotateAroundAxis(start.up.clone(), start.dir, roll);
    result.push({ pos, dir: start.dir.clone(), up: up.normalize() });
  }
  return result;
}

function sampleChicane(
  start: SegmentPose,
  radius: number,
  halfAngleDeg: number,
  firstDirection: 'left' | 'right',
  N: number,
): SegmentPose[] {
  const half = Math.ceil(N / 2);
  const firstHalf = sampleCurve(start, radius, halfAngleDeg, firstDirection, 0, half);
  const endFirst = firstHalf[firstHalf.length - 1];
  const secondDir: 'left' | 'right' = firstDirection === 'left' ? 'right' : 'left';
  const secondHalf = sampleCurve(endFirst, radius, halfAngleDeg, secondDir, 0, N - half + 1);
  return [...firstHalf, ...secondHalf.slice(1)];
}

function sampleBezier(start: SegmentPose, seg: BridgeSegmentData, N: number): SegmentPose[] {
  // Build cubic bezier control points in start-pose local frame → world
  const right = binormal(start);
  const p0 = start.pos.clone();
  const p1 = localToWorld(start, right, seg.cp1X, seg.cp1Y, seg.cp1Z);
  const p2 = localToWorld(start, right, seg.cp2X, seg.cp2Y, seg.cp2Z);
  const p3 = localToWorld(start, right, seg.endX, seg.endY, seg.endZ);

  const result: SegmentPose[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const pos = cubicBezier(p0, p1, p2, p3, t);
    const tangent = cubicBezierTangent(p0, p1, p2, p3, t).normalize();
    // Up is world-up projected perpendicular to tangent
    const worldUp = new THREE.Vector3(0, 1, 0);
    const right_ = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
    const up = new THREE.Vector3().crossVectors(right_, tangent).normalize();
    result.push({ pos, dir: tangent, up });
  }
  return result;
}

function localToWorld(pose: SegmentPose, right: THREE.Vector3, lx: number, ly: number, lz: number): THREE.Vector3 {
  return pose.pos.clone()
    .addScaledVector(right,    lx)
    .addScaledVector(pose.up,  ly)
    .addScaledVector(pose.dir, lz);
}

function cubicBezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number): THREE.Vector3 {
  const it = 1 - t;
  return p0.clone().multiplyScalar(it ** 3)
    .addScaledVector(p1, 3 * it * it * t)
    .addScaledVector(p2, 3 * it * t * t)
    .addScaledVector(p3, t ** 3);
}

function cubicBezierTangent(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number): THREE.Vector3 {
  const it = 1 - t;
  return p1.clone().sub(p0).multiplyScalar(3 * it * it)
    .addScaledVector(p2.clone().sub(p1), 6 * it * t)
    .addScaledVector(p3.clone().sub(p2), 3 * t * t);
}

function rotateAroundAxis(v: THREE.Vector3, axis: THREE.Vector3, angle: number): THREE.Vector3 {
  return v.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), angle));
}

/* ── Cross-section builder ──────────────────────────────────────────────── */

/**
 * Returns N+1 points (for N=BRIDGE_CROSS_COLS) across the track width in the
 * local binormal/up plane of `pose`. Y goes up, X goes right.
 * Points are in WORLD space.
 */
function crossSectionPoints(pose: SegmentPose, section: BridgeSection): THREE.Vector3[] {
  const N = BRIDGE_CROSS_COLS;
  const right = binormal(pose);
  const half = section.width / 2;
  const pts: THREE.Vector3[] = [];

  for (let i = 0; i <= N; i++) {
    const u = i / N;            // 0 = left rail, 1 = right rail
    const lateralDist = -half + u * section.width;

    let verticalOff = 0;
    if (section.crossSection === 'u_channel' && section.depth > 0) {
      // Parabolic dip: 0 at rails, -depth at centre
      const normalised = (u - 0.5) * 2;   // -1 at left, +1 at right
      verticalOff = -section.depth * (1 - normalised * normalised);
    }

    pts.push(
      pose.pos.clone()
        .addScaledVector(right,    lateralDist)
        .addScaledVector(pose.up,  verticalOff),
    );
  }
  return pts;
}

/* ── Sweep deck mesh ─────────────────────────────────────────────────────── */

export function buildSegmentDeckGeometry(
  seg: BridgeSegmentData,
  startPose: SegmentPose,
  section: BridgeSection,
): THREE.BufferGeometry {
  const poses = sampleSegmentPath(seg, startPose);
  const M = poses.length;     // frames along path
  const K = BRIDGE_CROSS_COLS + 1;  // verts per cross-section (left rail + cols + right rail)

  const positions: number[] = [];
  const indices:   number[] = [];

  // Deck surface
  for (let fi = 0; fi < M; fi++) {
    const cs = crossSectionPoints(poses[fi], section);
    for (const p of cs) positions.push(p.x, p.y, p.z);
  }

  for (let fi = 0; fi < M - 1; fi++) {
    for (let ci = 0; ci < K - 1; ci++) {
      const i00 = fi * K + ci;
      const i01 = fi * K + ci + 1;
      const i10 = (fi + 1) * K + ci;
      const i11 = (fi + 1) * K + ci + 1;
      indices.push(i00, i10, i11, i00, i11, i01);
    }
  }

  // Side walls
  if (section.hasLeftWall || section.hasRightWall) {
    const wallH = section.sideWallHeight;
    for (let fi = 0; fi < M; fi++) {
      const cs = crossSectionPoints(poses[fi], section);
      const pose = poses[fi];
      for (const side of ['left', 'right'] as const) {
        if (side === 'left' && !section.hasLeftWall) continue;
        if (side === 'right' && !section.hasRightWall) continue;
        const railPt = side === 'left' ? cs[0] : cs[BRIDGE_CROSS_COLS];
        const topPt = railPt.clone().addScaledVector(pose.up, wallH);
        positions.push(railPt.x, railPt.y, railPt.z);
        positions.push(topPt.x,  topPt.y,  topPt.z);
      }
    }

    // Indices for side walls
    const deckVerts = M * K;
    let sideOffset = deckVerts;
    const sidesPerFrame = (section.hasLeftWall ? 2 : 0) + (section.hasRightWall ? 2 : 0);

    for (let fi = 0; fi < M - 1; fi++) {
      let localOff = 0;
      for (const side of ['left', 'right'] as const) {
        if (side === 'left'  && !section.hasLeftWall)  continue;
        if (side === 'right' && !section.hasRightWall) continue;
        const b0 = sideOffset + fi * sidesPerFrame + localOff;
        const t0 = b0 + 1;
        const b1 = sideOffset + (fi + 1) * sidesPerFrame + localOff;
        const t1 = b1 + 1;
        indices.push(b0, b1, t1, b0, t1, t0);
        localOff += 2;
      }
    }
  }

  // Start cap
  const startCs = crossSectionPoints(poses[0], section);
  const capBase = positions.length / 3;
  for (const p of startCs) positions.push(p.x, p.y, p.z);
  for (let i = 0; i < K - 2; i++) {
    indices.push(capBase, capBase + i + 1, capBase + i + 2);
  }

  // End cap
  const endCs = crossSectionPoints(poses[M - 1], section);
  const capEnd = positions.length / 3;
  for (const p of endCs) positions.push(p.x, p.y, p.z);
  for (let i = 0; i < K - 2; i++) {
    indices.push(capEnd, capEnd + i + 2, capEnd + i + 1);  // reversed winding
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* ── Edge wireframe ────────────────────────────────────────────────────────*/

export function buildSegmentEdgeGeometry(
  seg: BridgeSegmentData,
  startPose: SegmentPose,
  section: BridgeSection,
): THREE.BufferGeometry {
  const poses = sampleSegmentPath(seg, startPose);
  const verts: number[] = [];
  const K = BRIDGE_CROSS_COLS;

  for (let fi = 0; fi < poses.length - 1; fi++) {
    const csA = crossSectionPoints(poses[fi], section);
    const csB = crossSectionPoints(poses[fi + 1], section);
    // Left rail
    verts.push(csA[0].x, csA[0].y, csA[0].z, csB[0].x, csB[0].y, csB[0].z);
    // Right rail
    verts.push(csA[K].x, csA[K].y, csA[K].z, csB[K].x, csB[K].y, csB[K].z);
    // Centre
    const mid = Math.floor(K / 2);
    verts.push(csA[mid].x, csA[mid].y, csA[mid].z, csB[mid].x, csB[mid].y, csB[mid].z);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

/* ── Default data factories ─────────────────────────────────────────────── */

export function defaultBridgeSection(): BridgeSection {
  return {
    width: DEFAULT_BRIDGE_WIDTH,
    crossSection: 'u_channel',
    depth: DEFAULT_BRIDGE_DEPTH,
    hasLeftWall: true, hasRightWall: true,
    sideWallHeight: 5,
    material: 'abs',
    color: 0x888888,
    surface: 'plain',
    customTileData: null,
    tileScale: 1,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    opacity: 1,
  };
}

export function defaultSegment(
  id: string,
  name: string,
  bridgeId: string,
  orderIndex: number,
  type: BridgeSegmentType = 'straight',
): BridgeSegmentData {
  return {
    id, name, bridgeId, orderIndex, type,
    length: DEFAULT_SEGMENT_LENGTH,
    rampAngle: 0,
    curveRadius: DEFAULT_CURVE_RADIUS,
    curveAngle: DEFAULT_CURVE_ANGLE,
    curveDirection: 'right',
    bankAngle: 0,
    cp1X: 10, cp1Y: 0, cp1Z: 10,
    cp2X: 20, cp2Y: 0, cp2Z: 20,
    endX: 0,  endY: 0, endZ: 30,
    loopRadius: DEFAULT_LOOP_RADIUS,
    corkscrewLength: DEFAULT_CORKSCREW_LENGTH,
    corkscrewTurns: 1,
    color: null,
    surface: null,
    mesh: null,
    edges: null,
  };
}

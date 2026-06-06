import * as THREE from 'three';
import { JL, DEG2RAD } from '../config/arenaConstants';
import type {
  JumpLinkData, JumpLinkEndpoint, JumpLinkParentType, JumpEndpointMode,
  JumpFlightConfig, JumpFlightStatModifiers, JumpArcProfile,
  ArenaData, ObstacleData, TrapData, SpeedLineData,
} from '../types/arenaTypes';
import type { JumpLinkSave } from '../utils/arenaPersistence';
import { polarToLocalXZ, arenaSurfaceYAtArenaLocal } from './surfaceUtils';
import { trapSurfY } from './trapBuilders';

/* ── Default config factories ────────────────────────────────────────────── */

export function defaultJumpFlightConfig(): JumpFlightConfig {
  return {
    arcDuration:    JL.DEFAULT_ARC_DURATION,
    launchAngleDeg: JL.DEFAULT_LAUNCH_ANGLE,
    launchForce:    JL.DEFAULT_LAUNCH_FORCE,
    gravityScale:   JL.DEFAULT_GRAVITY,
    airDrag:        JL.DEFAULT_AIR_DRAG,
    landingImpact:  JL.DEFAULT_IMPACT,
    landingBounce:  JL.DEFAULT_BOUNCE,
    spinRateMult:   1.0,
    spinDeltaRPM:   0,
    statModifiers: {
      spinRateMult:    1.0,
      staminaMult:     1.0,
      attackMult:      1.0,
      defenseMult:     1.0,
      weightMult:      1.0,
      burstResistMult: 1.0,
    },
    trailEnabled: false,
    trailColor:   null,
    trailWidth:   2,
    trailFade:    0.1,
    launchFlash:  false,
    landFlash:    false,
    flashColor:   0xffffff,
  };
}

export function defaultJumpEndpoint(
  mode: JumpEndpointMode,
  parentType: JumpLinkParentType,
  parentId: string,
): JumpLinkEndpoint {
  return {
    mode, parentType, parentId,
    localX: 0, localZ: 0,
    worldX: 0, worldY: 0, worldZ: 0,
    speedLineId: null,
    atStart: false,
  };
}

export function defaultJumpLink(
  name: string,
  id: string,
  srcParentId: string,
  srcParentType: JumpLinkParentType,
): JumpLinkData {
  const src = defaultJumpEndpoint('parent_surface', srcParentType, srcParentId);
  const dst = defaultJumpEndpoint('parent_surface', srcParentType, srcParentId);
  dst.localX = 20;
  return {
    id, name,
    src, dst,
    isBidirectional:    false,
    trigger:            'button',
    triggerSpeedLineId: null,
    proximityRadius:    JL.DEFAULT_PROX_RADIUS,
    arcProfile: 'parabolic',
    arcHeight:  JL.DEFAULT_ARC_HEIGHT,
    flight:     defaultJumpFlightConfig(),
    color:      JL.DEFAULT_COLOR,
    glowColor:  JL.DEFAULT_GLOW,
    opacity:    JL.DEFAULT_OPACITY,
    discRadius: JL.DEFAULT_DISC_RADIUS,
    sourceMesh:  undefined as unknown as THREE.Mesh,
    destMesh:    undefined as unknown as THREE.Mesh,
    arcLine:     undefined as unknown as THREE.Line,
    arrowMeshes: [],
  };
}

/* ── World-position resolution ───────────────────────────────────────────── */

export function resolveEndpointWorld(
  ep: JumpLinkEndpoint,
  arenas: ReadonlyMap<string, ArenaData>,
  obstacles: ReadonlyMap<string, ObstacleData>,
  traps: ReadonlyMap<string, TrapData>,
  getSpeedLine: (id: string) => SpeedLineData | undefined,
  baseHeight: number,
): { x: number; y: number; z: number } {
  switch (ep.mode) {
    case 'world_point':
      return { x: ep.worldX, y: ep.worldY, z: ep.worldZ };

    case 'parent_surface': {
      switch (ep.parentType) {
        case 'base':
          return { x: ep.localX, y: baseHeight, z: ep.localZ };

        case 'arena': {
          const arena = arenas.get(ep.parentId);
          if (!arena) return { x: ep.localX, y: baseHeight, z: ep.localZ };
          const cos = Math.cos(arena.rotY * DEG2RAD);
          const sin = Math.sin(arena.rotY * DEG2RAD);
          const wx = arena.posX + ep.localX * cos - ep.localZ * sin;
          const wz = arena.posZ + ep.localX * sin + ep.localZ * cos;
          const wy = arenaSurfaceYAtArenaLocal(arena, ep.localX, ep.localZ);
          return { x: wx, y: wy, z: wz };
        }

        case 'obstacle': {
          const obs = obstacles.get(ep.parentId);
          if (!obs) return { x: ep.localX, y: baseHeight, z: ep.localZ };
          return {
            x: obs.posX + ep.localX,
            y: obs.posY + obs.dimY / 2,
            z: obs.posZ + ep.localZ,
          };
        }

        case 'trap': {
          const trap = traps.get(ep.parentId);
          if (!trap) return { x: ep.localX, y: baseHeight, z: ep.localZ };
          const surfY = trapSurfY(trap, arenas as Map<string, ArenaData>, baseHeight);
          let wx = ep.localX;
          let wz = ep.localZ;
          if (trap.parentType === 'arena') {
            const arena = arenas.get(trap.parentId);
            if (arena) {
              const { lx, lz } = polarToLocalXZ(trap.posR, trap.posAngle);
              const cos = Math.cos(arena.rotY * DEG2RAD);
              const sin = Math.sin(arena.rotY * DEG2RAD);
              const trapWorldX = arena.posX + lx * cos - lz * sin;
              const trapWorldZ = arena.posZ + lx * sin + lz * cos;
              wx = trapWorldX + ep.localX;
              wz = trapWorldZ + ep.localZ;
            }
          }
          return { x: wx, y: surfY, z: wz };
        }
      }
      break;
    }

    case 'speed_line_end': {
      if (!ep.speedLineId) return { x: 0, y: baseHeight, z: 0 };
      const sl = getSpeedLine(ep.speedLineId);
      if (!sl) return { x: 0, y: baseHeight, z: 0 };
      const arena = arenas.get(sl.parentArenaId);
      if (!arena) return { x: 0, y: baseHeight, z: 0 };

      if (ep.atStart) {
        const { lx, lz } = polarToLocalXZ(sl.startR, sl.startAngle);
        const cos = Math.cos(arena.rotY * DEG2RAD);
        const sin = Math.sin(arena.rotY * DEG2RAD);
        const wx = arena.posX + lx * cos - lz * sin;
        const wz = arena.posZ + lx * sin + lz * cos;
        const wy = arenaSurfaceYAtArenaLocal(arena, lx, lz);
        return { x: wx, y: wy, z: wz };
      } else {
        // Approximate end: walk all segments to accumulate final world position
        const cos = Math.cos(arena.rotY * DEG2RAD);
        const sin = Math.sin(arena.rotY * DEG2RAD);
        const { lx: slx, lz: slz } = polarToLocalXZ(sl.startR, sl.startAngle);
        let alx = slx; let alz = slz;
        let dir = (sl.startDir ?? 0) * DEG2RAD;
        for (const seg of sl.segments) {
          const fwd = seg.length;
          const dy = (seg.rotY ?? 0) * DEG2RAD;
          dir += dy;
          alx -= Math.sin(dir) * fwd;
          alz += Math.cos(dir) * fwd;
        }
        const wx = arena.posX + alx * cos - alz * sin;
        const wz = arena.posZ + alx * sin + alz * cos;
        const wy = arenaSurfaceYAtArenaLocal(arena, alx, alz);
        return { x: wx, y: wy, z: wz };
      }
    }
  }
  return { x: 0, y: baseHeight, z: 0 };
}

/* ── Disc mesh ───────────────────────────────────────────────────────────── */

export function buildDiscMesh(
  color: number,
  glowColor: number | null,
  radius: number,
  opacity: number,
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(radius, radius, JL.DISC_HEIGHT, 32);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glowColor ?? color,
    emissiveIntensity: JL.GLOW_INTENSITY,
    transparent: true,
    opacity,
  });
  return new THREE.Mesh(geo, mat);
}

/* ── Arc line ────────────────────────────────────────────────────────────── */

function _lerpV3(a: {x:number;y:number;z:number}, b: {x:number;y:number;z:number}, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

export function buildArcLine(
  src: { x: number; y: number; z: number },
  dst: { x: number; y: number; z: number },
  arcHeight: number,
  profile: JumpArcProfile,
  color: number,
  opacity: number,
): THREE.Line {
  const N = JL.ARC_SAMPLES;
  const pts: THREE.Vector3[] = [];

  switch (profile) {
    case 'instant':
      pts.push(new THREE.Vector3(src.x, src.y, src.z));
      pts.push(new THREE.Vector3(dst.x, dst.y, dst.z));
      break;

    case 'parabolic':
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const p = _lerpV3(src, dst, t);
        p.y += arcHeight * 4 * t * (1 - t);
        pts.push(new THREE.Vector3(p.x, p.y, p.z));
      }
      break;

    case 'bezier': {
      const cp1 = { x: src.x, y: src.y + arcHeight, z: src.z };
      const cp2 = { x: dst.x, y: dst.y + arcHeight, z: dst.z };
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const mt = 1 - t;
        const x = mt*mt*mt*src.x + 3*mt*mt*t*cp1.x + 3*mt*t*t*cp2.x + t*t*t*dst.x;
        const y = mt*mt*mt*src.y + 3*mt*mt*t*cp1.y + 3*mt*t*t*cp2.y + t*t*t*dst.y;
        const z = mt*mt*mt*src.z + 3*mt*mt*t*cp1.z + 3*mt*t*t*cp2.z + t*t*t*dst.z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      break;
    }
  }

  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geo, mat);
}

/* ── Arc arrow cones ─────────────────────────────────────────────────────── */

export function buildArcArrows(
  arcPts: THREE.Vector3[],
  isBidirectional: boolean,
  color: number,
  opacity: number,
): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  const total = arcPts.length;
  if (total < 2) return meshes;

  const step = Math.max(1, Math.floor(total / (JL.ARROW_COUNT + 1)));
  const indices: number[] = [];
  for (let k = 1; k <= JL.ARROW_COUNT; k++) {
    indices.push(Math.min(k * step, total - 2));
  }

  const mat = new THREE.MeshStandardMaterial({
    color, transparent: true, opacity,
    emissive: color, emissiveIntensity: 0.4,
  });

  function makeCone(posIdx: number, reversed: boolean): THREE.Mesh {
    const geo = new THREE.ConeGeometry(JL.ARROW_HALF_W, JL.ARROW_LEN, 4);
    const mesh = new THREE.Mesh(geo, mat.clone());
    const pos = arcPts[posIdx].clone();
    const next = arcPts[reversed ? Math.max(posIdx - 1, 0) : Math.min(posIdx + 1, total - 1)].clone();
    mesh.position.copy(pos);
    mesh.lookAt(next);
    mesh.rotateX(Math.PI / 2);
    return mesh;
  }

  for (const idx of indices) {
    meshes.push(makeCone(idx, false));
    if (isBidirectional) {
      meshes.push(makeCone(idx, true));
    }
  }
  return meshes;
}

/* ── Extract arc points array from a THREE.Line ──────────────────────────── */

function _arcLinePoints(line: THREE.Line): THREE.Vector3[] {
  const posAttr = line.geometry.attributes['position'];
  if (!posAttr) return [];
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < posAttr.count; i++) {
    pts.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
  }
  return pts;
}

/* ── Build all jump link objects ─────────────────────────────────────────── */

export function buildJumpLinkObjects(
  data: JumpLinkData,
  arenas: ReadonlyMap<string, ArenaData>,
  obstacles: ReadonlyMap<string, ObstacleData>,
  traps: ReadonlyMap<string, TrapData>,
  getSpeedLine: (id: string) => SpeedLineData | undefined,
  baseHeight: number,
): { sourceMesh: THREE.Mesh; destMesh: THREE.Mesh; arcLine: THREE.Line; arrowMeshes: THREE.Mesh[] } {
  const srcW = resolveEndpointWorld(data.src, arenas, obstacles, traps, getSpeedLine, baseHeight);
  const dstW = resolveEndpointWorld(data.dst, arenas, obstacles, traps, getSpeedLine, baseHeight);

  const sourceMesh = buildDiscMesh(data.color, data.glowColor, data.discRadius, data.opacity);
  sourceMesh.position.set(srcW.x, srcW.y + JL.DISC_HEIGHT / 2, srcW.z);

  const destColor = data.isBidirectional ? data.color : Math.floor(data.color * 0.7);
  const destMesh = buildDiscMesh(destColor, data.glowColor, data.discRadius, data.opacity);
  destMesh.position.set(dstW.x, dstW.y + JL.DISC_HEIGHT / 2, dstW.z);

  const arcLine = buildArcLine(srcW, dstW, data.arcHeight, data.arcProfile, data.color, data.opacity);
  const arcPts = _arcLinePoints(arcLine);
  const arrowMeshes = buildArcArrows(arcPts, data.isBidirectional, data.color, data.opacity);

  return { sourceMesh, destMesh, arcLine, arrowMeshes };
}

/* ── Apply (rebuild in place) ────────────────────────────────────────────── */

export function applyJumpLink(
  data: JumpLinkData,
  arenas: ReadonlyMap<string, ArenaData>,
  obstacles: ReadonlyMap<string, ObstacleData>,
  traps: ReadonlyMap<string, TrapData>,
  getSpeedLine: (id: string) => SpeedLineData | undefined,
  baseHeight: number,
): void {
  data.sourceMesh.geometry.dispose();
  (data.sourceMesh.material as THREE.Material).dispose();
  data.destMesh.geometry.dispose();
  (data.destMesh.material as THREE.Material).dispose();
  data.arcLine.geometry.dispose();
  (data.arcLine.material as THREE.Material).dispose();
  for (const m of data.arrowMeshes) {
    m.geometry.dispose();
    (m.material as THREE.Material).dispose();
  }
  data.arrowMeshes = [];

  const result = buildJumpLinkObjects(data, arenas, obstacles, traps, getSpeedLine, baseHeight);
  data.sourceMesh.geometry = result.sourceMesh.geometry;
  data.sourceMesh.material = result.sourceMesh.material;
  data.sourceMesh.position.copy(result.sourceMesh.position);

  data.destMesh.geometry = result.destMesh.geometry;
  data.destMesh.material = result.destMesh.material;
  data.destMesh.position.copy(result.destMesh.position);

  data.arcLine.geometry = result.arcLine.geometry;
  data.arcLine.material = result.arcLine.material;

  data.arrowMeshes = result.arrowMeshes;
}

/* ── Restore from save ───────────────────────────────────────────────────── */

export function jumpLinkFromSave(save: JumpLinkSave): JumpLinkData {
  const data = defaultJumpLink(save.name, save.id, save.src.parentId, save.src.parentType);
  data.src = { ...save.src };
  data.dst = { ...save.dst };
  data.isBidirectional    = save.isBidirectional;
  data.trigger            = save.trigger;
  data.triggerSpeedLineId = save.triggerSpeedLineId;
  data.proximityRadius    = save.proximityRadius;
  data.arcProfile         = save.arcProfile;
  data.arcHeight          = save.arcHeight;
  data.flight             = { ...save.flight, statModifiers: { ...save.flight.statModifiers } };
  data.color              = save.color;
  data.glowColor          = save.glowColor;
  data.opacity            = save.opacity;
  data.discRadius         = save.discRadius;
  return data;
}

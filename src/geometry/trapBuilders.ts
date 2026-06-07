import * as THREE from 'three';
import {
  MIN_TRAP_DIM, DEFAULT_TRAP_DIM_X, DEFAULT_TRAP_DIM_Z,
  TRAP_PLATE_HEIGHT, SPIKE_COUNT, SPIKE_HEIGHT, TRAP_SAFE_INTERVAL, TRAP_UNSAFE_INTERVAL,
  DEG2RAD,
} from '../config/arenaConstants';
import {
  TrapData, TrapShape, TrapEffect, TrapVariant, TrapDurationTier, SurfaceType, OpeningShape, ArenaData, ArenaMaterial,
  defaultProjectileConfig,
} from '../types/arenaTypes';
import { buildSurfaceMaterial } from './materialBuilders';
import { polarToLocalXZ, arenaSurfaceYAtArenaLocal } from './surfaceUtils';

/* ── Plate geometry by shape ─────────────────────────────────────────────── */

function _plateGeo(shape: TrapShape, dimX: number, dimZ: number): THREE.BufferGeometry {
  switch (shape) {
    case 'rectangle':
      return new THREE.BoxGeometry(dimX, TRAP_PLATE_HEIGHT, dimZ);
    case 'circle':
      return new THREE.CylinderGeometry(dimX / 2, dimX / 2, TRAP_PLATE_HEIGHT, 32);
    case 'ellipse': {
      const g = new THREE.CylinderGeometry(1, 1, TRAP_PLATE_HEIGHT, 32);
      g.scale(dimX / 2, 1, dimZ / 2);
      return g;
    }
    case 'hexagon': {
      const shape2d = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const x = (dimX / 2) * Math.cos(a);
        const z = (dimZ / 2) * Math.sin(a);
        i === 0 ? shape2d.moveTo(x, z) : shape2d.lineTo(x, z);
      }
      shape2d.closePath();
      const extruded = new THREE.ExtrudeGeometry(shape2d, {
        depth: TRAP_PLATE_HEIGHT, bevelEnabled: false,
      });
      extruded.rotateX(-Math.PI / 2);
      extruded.translate(0, -TRAP_PLATE_HEIGHT / 2, 0);
      return extruded;
    }
  }
}

/* ── Variant mesh geometry ───────────────────────────────────────────────── */

function _variantGeo(data: TrapData): THREE.Mesh | null {
  const yOff = TRAP_PLATE_HEIGHT / 2;
  switch (data.variant) {
    case 'spike': {
      const merged = new THREE.BufferGeometry();
      const positions: number[] = [];
      const grid = Math.round(Math.sqrt(SPIKE_COUNT));
      const spacing = data.dimX / (grid + 1);
      for (let row = 0; row < grid; row++) {
        for (let col = 0; col < grid; col++) {
          const sx = -data.dimX / 2 + spacing * (col + 1);
          const sz = -data.dimZ / 2 + spacing * (row + 1);
          const coneGeo = new THREE.ConeGeometry(SPIKE_HEIGHT * 0.15, SPIKE_HEIGHT, 4);
          coneGeo.translate(sx, yOff + SPIKE_HEIGHT / 2, sz);
          const pos = coneGeo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
          }
        }
      }
      merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      merged.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ color: 0x555555 });
      return new THREE.Mesh(merged, mat);
    }
    case 'trampoline': {
      const g = new THREE.BoxGeometry(data.dimX * 0.9, TRAP_PLATE_HEIGHT * 0.4, data.dimZ * 0.9);
      const mat = new THREE.MeshStandardMaterial({ color: 0x222266 });
      const m = new THREE.Mesh(g, mat);
      m.position.y = yOff + TRAP_PLATE_HEIGHT * 0.2;
      return m;
    }
    case 'hammer': {
      const group = new THREE.Group();
      const armGeo = new THREE.BoxGeometry(2, data.dimZ * 0.7, 2);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(0, yOff + data.dimZ * 0.35, 0);
      const headGeo = new THREE.BoxGeometry(data.dimX * 0.5, 3, data.dimZ * 0.3);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, yOff + data.dimZ * 0.7, data.dimZ * 0.15);
      group.add(arm, head);
      // Flatten to a single mesh
      const result = new THREE.Mesh(new THREE.BufferGeometry(), armMat);
      result.add(arm, head);
      return result;
    }
    case 'saw': {
      const g = new THREE.CylinderGeometry(
        Math.min(data.dimX, data.dimZ) * 0.45,
        Math.min(data.dimX, data.dimZ) * 0.45,
        TRAP_PLATE_HEIGHT * 0.8, 16,
      );
      const mat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
      const m = new THREE.Mesh(g, mat);
      m.position.y = yOff + TRAP_PLATE_HEIGHT * 0.4;
      return m;
    }
    case 'chomper': {
      const jawW = data.dimX * 0.9;
      const jawD = data.dimZ * 0.4;
      const jawH = 4;
      const jawMat = new THREE.MeshStandardMaterial({ color: 0xaa2200 });
      const geoTop = new THREE.BoxGeometry(jawW, jawH, jawD);
      const geoBot = new THREE.BoxGeometry(jawW, jawH, jawD);
      const topJaw = new THREE.Mesh(geoTop, jawMat);
      const botJaw = new THREE.Mesh(geoBot, jawMat);
      topJaw.position.set(0, yOff + jawH / 2 + 2, -jawD * 0.3);
      botJaw.position.set(0, yOff + jawH / 2 + 2,  jawD * 0.3);
      const container = new THREE.Mesh(new THREE.BufferGeometry(), jawMat);
      container.add(topJaw, botJaw);
      return container;
    }
    case 'hidden_pit': {
      const g = new THREE.BoxGeometry(data.dimX * 0.95, TRAP_PLATE_HEIGHT * 0.5, data.dimZ * 0.95);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x111111, transparent: true, opacity: 0.5,
      });
      const m = new THREE.Mesh(g, mat);
      m.position.y = yOff + TRAP_PLATE_HEIGHT * 0.25;
      return m;
    }
    case 'earthquake': {
      return buildEarthquakeMesh(data, 0);
    }
    case 'rpm': {
      return buildRPMMesh(data);
    }
    case 'projectile': {
      return buildProjectileMesh(data.projConfig);
    }
    case 'buff':
    case 'generic':
    default:
      return null;
  }
}

/* ── Earthquake mesh ─────────────────────────────────────────────────────── */

export function buildEarthquakeMesh(data: TrapData, surfY: number): THREE.Mesh {
  const rings  = Math.max(1, data.eqRingCount);
  const segs   = Math.max(3, data.eqSegmentsPerRing);
  const rx     = data.dimX / 2;
  const rz     = data.dimZ / 2;
  const total  = rings * segs;

  const positions = new Float32Array(total * 4 * 3);
  const indices: number[] = [];
  let vi = 0;

  for (let r = 0; r < rings; r++) {
    const r0 = r / rings;
    const r1 = (r + 1) / rings;
    for (let s = 0; s < segs; s++) {
      const a0 = (s / segs) * Math.PI * 2;
      const a1 = ((s + 1) / segs) * Math.PI * 2;

      const pts: [number, number][] = [
        [r0 * rx * Math.cos(a0), r0 * rz * Math.sin(a0)],
        [r1 * rx * Math.cos(a0), r1 * rz * Math.sin(a0)],
        [r1 * rx * Math.cos(a1), r1 * rz * Math.sin(a1)],
        [r0 * rx * Math.cos(a1), r0 * rz * Math.sin(a1)],
      ];
      const base = vi;
      for (const [x, z] of pts) {
        positions[vi * 3 + 0] = x;
        positions[vi * 3 + 1] = TRAP_PLATE_HEIGHT / 2;
        positions[vi * 3 + 2] = z;
        vi++;
      }
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: 0x886644, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = surfY + TRAP_PLATE_HEIGHT;
  return mesh;
}

export function updateEarthquakeMeshHeights(data: TrapData): void {
  if (!data._eqCurrentHeights || !data.variantMesh) return;
  const geo = data.variantMesh.geometry as THREE.BufferGeometry;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const rings = Math.max(1, data.eqRingCount);
  const segs  = Math.max(3, data.eqSegmentsPerRing);
  let vi = 0;
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segs; s++) {
      const cellIdx = r * segs + s;
      const h = data._eqCurrentHeights[cellIdx] ?? 0;
      const y = TRAP_PLATE_HEIGHT / 2 + h;
      // 4 vertices per quad
      for (let v = 0; v < 4; v++) {
        pos.setY(vi++, y);
      }
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

/* ── RPM disc mesh ───────────────────────────────────────────────────────── */

export function buildRPMMesh(data: TrapData): THREE.Mesh {
  const r    = Math.min(data.dimX, data.dimZ) * 0.45;
  const segs = 24;
  const geo  = new THREE.CylinderGeometry(r, r, TRAP_PLATE_HEIGHT * 0.5, segs);
  const colors: number[] = [];
  const count = geo.attributes.position.count;
  for (let i = 0; i < count; i++) {
    const alt = Math.floor(i / 3) % 2 === 0;
    colors.push(alt ? 0.6 : 0.25, alt ? 0.6 : 0.25, alt ? 0.65 : 0.3);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.5, roughness: 0.4 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = TRAP_PLATE_HEIGHT * 0.75;
  return mesh;
}

/* ── Projectile source mesh ──────────────────────────────────────────────── */

export function buildProjectileMesh(cfg: TrapData['projConfig']): THREE.Mesh {
  let geo: THREE.BufferGeometry;
  const dx = cfg.dimX, dy = cfg.dimY, dz = cfg.dimZ;
  switch (cfg.shape) {
    case 'cube':
      geo = new THREE.BoxGeometry(dx, dy, dz); break;
    case 'cylinder':
      geo = new THREE.CylinderGeometry(dx / 2, dx / 2, dy, 16); break;
    case 'cone':
      geo = new THREE.ConeGeometry(dx / 2, dy, 16); break;
    case 'diamond': {
      const dGeo = new THREE.OctahedronGeometry(dx / 2);
      dGeo.scale(1, dy / dx, dz / dx);
      geo = dGeo; break;
    }
    case 'sphere':
    default:
      geo = new THREE.SphereGeometry(dx / 2, 12, 8); break;
  }
  const mat = new THREE.MeshStandardMaterial({
    color: cfg.color,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: cfg.emissiveIntensity,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(cfg.rotOffsetX * DEG2RAD, cfg.rotOffsetY * DEG2RAD, cfg.rotOffsetZ * DEG2RAD);
  mesh.position.y = TRAP_PLATE_HEIGHT + dy / 2;
  return mesh;
}

/* ── Build / apply ───────────────────────────────────────────────────────── */

export function buildTrapObjects(
  data: TrapData,
  surfY: number,
): [THREE.Mesh, THREE.LineSegments, THREE.Mesh | null] {
  const plateGeo = _plateGeo(data.shape, data.dimX, data.dimZ);
  const plateMat = buildSurfaceMaterial({
    color: data.color, surface: data.surface, customTileData: data.customTileData, tileScale: data.tileScale, baseMaterial: data.baseMaterial,
  });
  const bm = plateMat as THREE.MeshStandardMaterial;
  bm.emissive.setHex(data.emissiveColor);
  bm.emissiveIntensity = data.emissiveIntensity;
  const mesh = new THREE.Mesh(plateGeo, plateMat);
  mesh.rotation.y = data.rotY * DEG2RAD;
  _setTrapWorldPos(data, mesh, surfY);

  const edgesGeo = new THREE.EdgesGeometry(plateGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);

  const variantMesh = _variantGeo(data);
  if (variantMesh) {
    variantMesh.position.copy(mesh.position);
    variantMesh.rotation.copy(mesh.rotation);
  }

  return [mesh, edges, variantMesh];
}

function _setTrapWorldPos(data: TrapData, obj: THREE.Object3D, surfY: number): void {
  if (data.parentType === 'arena') {
    const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
    obj.position.set(lx, surfY + TRAP_PLATE_HEIGHT / 2, lz);
  } else {
    obj.position.set(data.basePosX, surfY + TRAP_PLATE_HEIGHT / 2, data.basePosZ);
  }
}

export function applyTrap(data: TrapData, surfY: number): void {
  data.mesh.geometry.dispose();
  data.edges.geometry.dispose();

  const plateGeo = _plateGeo(data.shape, data.dimX, data.dimZ);
  data.mesh.geometry = plateGeo;
  data.edges.geometry = new THREE.EdgesGeometry(plateGeo);

  data.mesh.rotation.y = data.rotY * DEG2RAD;
  _setTrapWorldPos(data, data.mesh, surfY);
  data.edges.position.copy(data.mesh.position);
  data.edges.rotation.copy(data.mesh.rotation);

  const plateMat = buildSurfaceMaterial({
    color: data.color, surface: data.surface, customTileData: data.customTileData, tileScale: data.tileScale, baseMaterial: data.baseMaterial,
  });
  const pm = plateMat as THREE.MeshStandardMaterial;
  pm.emissive.setHex(data.emissiveColor);
  pm.emissiveIntensity = data.emissiveIntensity;
  (data.mesh.material as THREE.Material).dispose();
  data.mesh.material = plateMat;

  if (data.variantMesh) {
    data.variantMesh.position.copy(data.mesh.position);
    data.variantMesh.rotation.copy(data.mesh.rotation);
  }
}

export function trapSurfY(
  data: TrapData,
  arenas: Map<string, ArenaData>,
  baseHeight: number,
): number {
  if (data.parentType === 'base') return baseHeight;
  const arena = arenas.get(data.parentId);
  if (!arena) return baseHeight;
  const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
  return arenaSurfaceYAtArenaLocal(arena, lx, lz);
}

export function defaultTrap(
  name: string,
  id: string,
  parentId: string,
  parentType: 'arena' | 'base',
): TrapData {
  const [mesh, edges] = _platePlaceholder();
  return {
    id, name, parentId, parentType,
    shape: 'rectangle' as TrapShape,
    dimX: DEFAULT_TRAP_DIM_X, dimZ: DEFAULT_TRAP_DIM_Z,
    rotY: 0,
    posR: 0, posAngle: 0,
    basePosX: 0, basePosZ: 0,
    effect: 'launch' as TrapEffect,
    variant: 'generic' as TrapVariant,
    forceX: 0, forceY: 5, forceZ: 0,
    damageFactor: 0.2,
    healFactor: 0.1,
    freezeDuration: 3,
    buffSurface: null,
    pitShape: 'circle' as OpeningShape, pitRadiusX: 10, pitRadiusZ: 10, pitDepth: 10,
    pitSides: 5, pitStarInner: 0.5,
    isPeriodic: false,
    safeInterval: TRAP_SAFE_INTERVAL,
    unsafeInterval: TRAP_UNSAFE_INTERVAL,
    activationLimit: 0,
    speedPathId: null,
    durationTiers: [] as TrapDurationTier[],
    gravityRange: 30, gravityStrength: 50,
    gravityMode: 'continuous' as const,
    gravityPulseInterval: 2, gravityPulseWidth: 0.5,
    linkedSpeedLineId: null,
    eqRingCount: 3, eqSegmentsPerRing: 6, eqMaxElevationCm: 5,
    eqElevationMode: 'random' as const,
    eqRingRanges: [0.3, 0.7, 1.0],
    eqPermanent: false, eqFadeCycles: 3,
    eqPulseMode: 'triggered' as const, eqPulseIntervalMs: 2000, eqPulseWidthMs: 1000,
    rpmSpeed: 180, rpmEffect: 'tangential' as const, rpmRange: 0,
    rpmMatchSpin: false, rpmForceScale: 1.0,
    rpmPulseMode: 'continuous' as const, rpmPulseIntervalMs: 0, rpmPulseWidthMs: 0,
    projLaunchMode: 'single' as const, projCount: 1, projSpreadAngleDeg: 30,
    projBurstCount: 3, projBurstDelayMs: 100,
    projLaunchDelayMs: 0, projLaunchAngleDeg: 0,
    projRandomizeAngle: false,
    projPattern: 'ring' as const, projPatternCount: 6,
    projConfig: defaultProjectileConfig(),
    projPulseMode: 'triggered' as const, projPulseIntervalMs: 3000,
    projPlateSpin: 0,
    envTriggerEvent: '',
    envTargetArenaId: '',
    baseMaterial: 'abs' as ArenaMaterial,
    color: 0xcc4400,
    surface: 'plain' as SurfaceType,
    customTileData: null,
    tileScale: 1,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    presentStlb64: null,
    presentColor: 0xaaaaaa,
    visible: true,
    mesh, edges, variantMesh: null,
  };
}

function _platePlaceholder(): [THREE.Mesh, THREE.LineSegments] {
  const geo = new THREE.BoxGeometry(DEFAULT_TRAP_DIM_X, TRAP_PLATE_HEIGHT, DEFAULT_TRAP_DIM_Z);
  const mat = buildSurfaceMaterial({ color: 0xcc4400, surface: 'plain', tileScale: 1 });
  const mesh = new THREE.Mesh(geo, mat);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  return [mesh, new THREE.LineSegments(edgesGeo, edgesMat)];
}

export function clampTrapDim(v: number): number {
  return Math.max(MIN_TRAP_DIM, v);
}

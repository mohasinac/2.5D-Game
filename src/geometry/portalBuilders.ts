import * as THREE from 'three';
import {
  TRAP_PLATE_HEIGHT, PORTAL_RING_HEIGHT, PORTAL_RING_TUBE_R,
  DEFAULT_PORTAL_DIM, DEFAULT_EXIT_VEL_SCALE, MIN_TRAP_DIM, DEG2RAD,
} from '../config/arenaConstants';
import {
  PortalData, PortalDestType, TrapShape, ArenaData, SurfaceType,
} from '../types/arenaTypes';
import { buildSurfaceMaterial } from './materialBuilders';
import { polarToLocalXZ, arenaSurfaceYAtArenaLocal } from './surfaceUtils';

const DEFAULT_PORTAL_COLOR = 0x00e5ff;

/* ── Pad geometry (same scheme as trap plate) ────────────────────────────── */

function _padGeo(shape: TrapShape, dimX: number, dimZ: number): THREE.BufferGeometry {
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

function _ringMesh(data: PortalData, worldY: number): THREE.Mesh {
  const radius = Math.min(data.dimX, data.dimZ) / 2;
  const geo = new THREE.TorusGeometry(radius, PORTAL_RING_TUBE_R, 8, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: data.glowColor,
    emissive: data.glowColor,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.9,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  const [wx, wz] = _worldXZ(data);
  ring.position.set(wx, worldY + TRAP_PLATE_HEIGHT / 2 + PORTAL_RING_HEIGHT, wz);
  return ring;
}

function _worldXZ(data: PortalData): [number, number] {
  if (data.parentType === 'arena') {
    const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
    return [lx, lz];
  }
  return [data.basePosX, data.basePosZ];
}

function _setPadPos(data: PortalData, mesh: THREE.Object3D, surfY: number): void {
  const [wx, wz] = _worldXZ(data);
  mesh.position.set(wx, surfY + TRAP_PLATE_HEIGHT / 2, wz);
  mesh.rotation.y = data.rotY * DEG2RAD;
}

/* ── Build / apply ───────────────────────────────────────────────────────── */

export function buildPortalObjects(
  data: PortalData,
  surfY: number,
): [THREE.Mesh, THREE.LineSegments, THREE.Mesh | null] {
  const padGeo = _padGeo(data.shape, data.dimX, data.dimZ);
  const padMat = buildSurfaceMaterial({
    color: data.color,
    surface: data.surface,
    customTileData: data.customTileData,
    tileScale: data.tileScale,
    transparent: true,
    opacity: 0.85,
  });
  (padMat as THREE.MeshStandardMaterial).emissive.setHex(data.glowColor);
  (padMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
  const mesh = new THREE.Mesh(padGeo, padMat);
  _setPadPos(data, mesh, surfY);

  const edgesGeo = new THREE.EdgesGeometry(padGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: data.glowColor, transparent: true, opacity: 0.8 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);

  const ring = _ringMesh(data, surfY);

  return [mesh, edges, ring];
}

export function applyPortal(data: PortalData, surfY: number): void {
  data.mesh.geometry.dispose();
  data.edges.geometry.dispose();

  const padGeo = _padGeo(data.shape, data.dimX, data.dimZ);
  data.mesh.geometry = padGeo;
  data.edges.geometry = new THREE.EdgesGeometry(padGeo);

  _setPadPos(data, data.mesh, surfY);
  data.edges.position.copy(data.mesh.position);
  data.edges.rotation.copy(data.mesh.rotation);

  const newPadMat = buildSurfaceMaterial({
    color: data.color, surface: data.surface, customTileData: data.customTileData,
    tileScale: data.tileScale, transparent: true, opacity: 0.85,
  });
  (newPadMat as THREE.MeshStandardMaterial).emissive.setHex(data.glowColor);
  (newPadMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
  (data.mesh.material as THREE.Material).dispose();
  data.mesh.material = newPadMat;
  (data.edges.material as THREE.LineBasicMaterial).color.setHex(data.glowColor);

  if (data.ringMesh) {
    const [wx, wz] = _worldXZ(data);
    data.ringMesh.position.set(wx, surfY + TRAP_PLATE_HEIGHT / 2 + PORTAL_RING_HEIGHT, wz);
    const radius = Math.min(data.dimX, data.dimZ) / 2;
    data.ringMesh.geometry.dispose();
    data.ringMesh.geometry = new THREE.TorusGeometry(radius, PORTAL_RING_TUBE_R, 8, 32);
    (data.ringMesh.material as THREE.MeshStandardMaterial).color.setHex(data.glowColor);
    (data.ringMesh.material as THREE.MeshStandardMaterial).emissive.setHex(data.glowColor);
  }
}

export function portalSurfY(
  data: PortalData,
  arenas: Map<string, ArenaData>,
  baseHeight: number,
): number {
  if (data.parentType === 'base') return baseHeight;
  const arena = arenas.get(data.parentId);
  if (!arena) return baseHeight;
  const { lx, lz } = polarToLocalXZ(data.posR, data.posAngle);
  return arenaSurfaceYAtArenaLocal(arena, lx, lz);
}

export function defaultPortal(
  name: string,
  id: string,
  parentId: string,
  parentType: 'arena' | 'base',
): PortalData {
  const [mesh, edges, ringMesh] = _portalPlaceholder();
  return {
    id, name, parentId, parentType,
    shape: 'circle' as TrapShape,
    dimX: DEFAULT_PORTAL_DIM, dimZ: DEFAULT_PORTAL_DIM,
    rotY: 0,
    posR: 0, posAngle: 0,
    basePosX: 0, basePosZ: 0,
    destType: 'portal' as PortalDestType,
    destPortalId: null, destArenaId: null,
    destPosX: 0, destPosY: 0, destPosZ: 0,
    exitVelScale: DEFAULT_EXIT_VEL_SCALE,
    exitRotY: NaN,
    isBidirectional: false,
    color: DEFAULT_PORTAL_COLOR,
    glowColor: DEFAULT_PORTAL_COLOR,
    surface: 'plain' as SurfaceType,
    customTileData: null,
    tileScale: 1,
    presentStlb64: null,
    presentColor: 0xaaaaaa,
    visible: true,
    mesh, edges, ringMesh,
  };
}

function _portalPlaceholder(): [THREE.Mesh, THREE.LineSegments, THREE.Mesh] {
  const geo = new THREE.CylinderGeometry(DEFAULT_PORTAL_DIM / 2, DEFAULT_PORTAL_DIM / 2, TRAP_PLATE_HEIGHT, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: DEFAULT_PORTAL_COLOR,
    emissive: DEFAULT_PORTAL_COLOR,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: DEFAULT_PORTAL_COLOR, transparent: true, opacity: 0.8 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  const ringGeo = new THREE.TorusGeometry(DEFAULT_PORTAL_DIM / 2, PORTAL_RING_TUBE_R, 8, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: DEFAULT_PORTAL_COLOR, emissive: DEFAULT_PORTAL_COLOR, emissiveIntensity: 1.2,
    transparent: true, opacity: 0.9,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = TRAP_PLATE_HEIGHT / 2 + PORTAL_RING_HEIGHT;
  return [mesh, edges, ring];
}

export function clampPortalDim(v: number): number {
  return Math.max(MIN_TRAP_DIM, v);
}

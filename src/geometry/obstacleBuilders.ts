import * as THREE from 'three';
import {
  MIN_OBSTACLE_DIM, DEFAULT_OBSTACLE_DIM, DEFAULT_ARENA_MATERIAL,
} from '../config/arenaConstants';
import { ObstacleData, ObstacleShape, SurfaceType, ArenaMaterial } from '../types/arenaTypes';
import { buildSurfaceMaterial } from './materialBuilders';

/* ── Geometry by shape ──────────────────────────────────────────────────── */

function _shapeGeometry(data: ObstacleData): THREE.BufferGeometry {
  const { shape, dimX, dimY, dimZ } = data;
  switch (shape) {
    case 'cube':
      return new THREE.BoxGeometry(dimX, dimX, dimX);
    case 'cuboid':
      return new THREE.BoxGeometry(dimX, dimY, dimZ);
    case 'sphere':
      return new THREE.SphereGeometry(dimX / 2, 32, 16);
    case 'cylinder':
      return new THREE.CylinderGeometry(dimX / 2, dimX / 2, dimY, 32);
    case 'pyramid': {
      const g = new THREE.ConeGeometry(dimX / 2, dimY, 4);
      g.rotateY(Math.PI / 4);
      return g;
    }
    case 'frustum':
      // dimX = bottom diameter, dimZ = top diameter, dimY = height
      return new THREE.CylinderGeometry(dimZ / 2, dimX / 2, dimY, 32);
  }
}

export function buildObstacleObjects(data: ObstacleData): [THREE.Mesh, THREE.LineSegments] {
  const mat = buildSurfaceMaterial({
    color: data.color,
    surface: data.surface,
    customTileData: data.customTileData,
    tileScale: data.tileScale,
    baseMaterial: data.material,
    transparent: data.opacity < 1,
    opacity: data.opacity,
  });
  const m = mat as THREE.MeshStandardMaterial;
  m.emissive.setHex(data.emissiveColor);
  m.emissiveIntensity = data.emissiveIntensity;
  if (data.opacity < 1) { m.transparent = true; m.opacity = data.opacity; m.depthWrite = false; }
  const geo = _shapeGeometry(data);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;

  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);

  _positionObstacle(data, mesh, edges);
  return [mesh, edges];
}

function _positionObstacle(data: ObstacleData, mesh: THREE.Mesh, edges: THREE.LineSegments): void {
  const { posX, posY, posZ, rotX, rotY, rotZ } = data;
  mesh.position.set(posX, posY, posZ);
  mesh.rotation.set(rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180);
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);
}

export function applyObstacle(data: ObstacleData): void {
  data.mesh.geometry.dispose();
  data.edges.geometry.dispose();

  const geo = _shapeGeometry(data);
  data.mesh.geometry = geo;
  data.edges.geometry = new THREE.EdgesGeometry(geo);

  _positionObstacle(data, data.mesh, data.edges);

  const mat = buildSurfaceMaterial({
    color: data.color,
    surface: data.surface,
    customTileData: data.customTileData,
    tileScale: data.tileScale,
    baseMaterial: data.material,
    transparent: data.opacity < 1,
    opacity: data.opacity,
  });
  const m = mat as THREE.MeshStandardMaterial;
  m.emissive.setHex(data.emissiveColor);
  m.emissiveIntensity = data.emissiveIntensity;
  if (data.opacity < 1) { m.transparent = true; m.opacity = data.opacity; m.depthWrite = false; }
  (data.mesh.material as THREE.Material).dispose();
  data.mesh.material = mat;
}

export function defaultObstacle(name: string, id: string, baseHeight: number): ObstacleData {
  const dim = DEFAULT_OBSTACLE_DIM;
  const [mesh, edges] = _makePlaceholder(dim, baseHeight + dim / 2 + 10);
  return {
    id, name,
    shape: 'cube' as ObstacleShape,
    dimX: dim, dimY: dim, dimZ: dim,
    posX: 0, posY: baseHeight + dim / 2 + 10, posZ: 0,
    rotX: 0, rotY: 0, rotZ: 0,
    isFloating: true,
    isDestructible: false,
    hitPoints: 3,
    contactForceX: 0, contactForceY: 0, contactForceZ: 0,
    color: 0x888888,
    surface: 'plain' as SurfaceType,
    customTileData: null,
    tileScale: 1,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    opacity: 1,
    material: DEFAULT_ARENA_MATERIAL as ArenaMaterial,
    theme: 'default',
    speedPathId: null,
    presentStlb64: null,
    presentColor: 0xaaaaaa,
    mesh, edges,
  };
}

function _makePlaceholder(dim: number, posY: number): [THREE.Mesh, THREE.LineSegments] {
  const geo = new THREE.BoxGeometry(dim, dim, dim);
  const mat = buildSurfaceMaterial({ color: 0x888888, surface: 'plain', tileScale: 1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, posY, 0);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  edges.position.copy(mesh.position);
  return [mesh, edges];
}

/* ── Dimension clamping helper (used by PropertiesPanel) ────────────────── */
export function clampObstacleDim(v: number): number {
  return Math.max(MIN_OBSTACLE_DIM, v);
}

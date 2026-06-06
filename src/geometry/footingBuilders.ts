import * as THREE from 'three';
import { ObstacleShape, SurfaceType, BaseFootingData } from '../types/arenaTypes';
import { buildSurfaceMaterial } from './materialBuilders';

/* ── Shape geometry (parallel to obstacleBuilders but decoupled) ────────── */

function _footingShapeGeo(data: BaseFootingData): THREE.BufferGeometry {
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

function _positionFooting(
  data: BaseFootingData,
  baseHeight: number,
  mesh: THREE.Mesh,
  edges: THREE.LineSegments,
): void {
  const halfH = data.shape === 'cube' ? data.dimX / 2 : data.dimY / 2;
  const worldY = baseHeight + data.posY + halfH;
  mesh.position.set(data.basePosX, worldY, data.basePosZ);
  mesh.rotation.set(0, data.baseRotY * Math.PI / 180, 0);
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);
}

export function buildFootingObjects(
  data: BaseFootingData,
  baseHeight: number,
): [THREE.Mesh, THREE.LineSegments] {
  const mat = buildSurfaceMaterial({
    color: data.color,
    surface: data.surface,
    customTileData: data.customTileData,
    tileScale: data.tileScale,
    transparent: data.opacity < 1,
    opacity: data.opacity,
  });
  const m = mat as THREE.MeshStandardMaterial;
  m.emissive.setHex(data.emissiveColor);
  m.emissiveIntensity = data.emissiveIntensity;
  if (data.opacity < 1) { m.transparent = true; m.opacity = data.opacity; m.depthWrite = false; }

  const geo = _footingShapeGeo(data);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;

  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);

  _positionFooting(data, baseHeight, mesh, edges);
  return [mesh, edges];
}

export function applyFooting(data: BaseFootingData, baseHeight: number): void {
  data.mesh!.geometry.dispose();
  data.edges!.geometry.dispose();

  const geo = _footingShapeGeo(data);
  data.mesh!.geometry = geo;
  data.edges!.geometry = new THREE.EdgesGeometry(geo);

  _positionFooting(data, baseHeight, data.mesh!, data.edges!);

  const mat = buildSurfaceMaterial({
    color: data.color,
    surface: data.surface,
    customTileData: data.customTileData,
    tileScale: data.tileScale,
    transparent: data.opacity < 1,
    opacity: data.opacity,
  });
  const m = mat as THREE.MeshStandardMaterial;
  m.emissive.setHex(data.emissiveColor);
  m.emissiveIntensity = data.emissiveIntensity;
  if (data.opacity < 1) { m.transparent = true; m.opacity = data.opacity; m.depthWrite = false; }
  (data.mesh!.material as THREE.Material).dispose();
  data.mesh!.material = mat;
}

export function defaultFooting(
  name: string,
  id: string,
  baseHeight: number,
): BaseFootingData {
  const dim = 20;
  const geo = new THREE.BoxGeometry(dim, dim, dim);
  const mat = buildSurfaceMaterial({ color: 0x888888, surface: 'plain' as SurfaceType, tileScale: 1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, baseHeight + dim / 2, 0);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  edges.position.copy(mesh.position);

  return {
    id, name,
    shape: 'cube' as ObstacleShape,
    dimX: dim, dimY: dim, dimZ: dim,
    basePosX: 0, basePosZ: 0,
    baseRotY: 0,
    posY: 0,
    color: 0x888888,
    surface: 'plain' as SurfaceType,
    customTileData: null,
    tileScale: 1,
    emissiveColor: 0x000000,
    emissiveIntensity: 0,
    opacity: 1,
    presentStlb64: null,
    presentColor: 0xaaaaaa,
    mesh, edges,
  };
}

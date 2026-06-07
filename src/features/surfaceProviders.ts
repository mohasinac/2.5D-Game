import * as THREE from 'three';
import type { ArenaData } from '../types/arenaTypes';
import { DEG2RAD } from '../config/arenaConstants';
import { arenaSurfaceYAtArenaLocal, polarToLocalXZ } from '../geometry/surfaceUtils';
import type { ISurfaceProvider, SurfaceHit } from './ISurfaceProvider';

const _UP = new THREE.Vector3(0, 1, 0);

/**
 * ISurfaceProvider that wraps an ArenaData bowl.
 * Uses the parabolic-Y math from surfaceUtils; ArenaData is the only arena-specific import.
 */
export class ArenaSurfaceProvider implements ISurfaceProvider {
  constructor(
    private readonly _arenaId: string,
    private readonly arena: ArenaData,
  ) {}

  get surfaceId(): string { return this._arenaId; }

  getSurfaceAt(worldX: number, worldZ: number): SurfaceHit {
    const c  = Math.cos(this.arena.rotY * DEG2RAD);
    const s  = Math.sin(this.arena.rotY * DEG2RAD);
    const dx = worldX - this.arena.posX;
    const dz = worldZ - this.arena.posZ;
    // Inverse rotation: world → arena-local
    const lx = dx * c + dz * s;
    const lz = -dx * s + dz * c;
    return { y: arenaSurfaceYAtArenaLocal(this.arena, lx, lz), normal: _UP };
  }

  getCenter(): { x: number; z: number; rotY: number } {
    return { x: this.arena.posX, z: this.arena.posZ, rotY: this.arena.rotY };
  }

  polarToWorld(r: number, angleDeg: number): { x: number; z: number } {
    const { lx, lz } = polarToLocalXZ(r, angleDeg);
    const c = Math.cos(this.arena.rotY * DEG2RAD);
    const s = Math.sin(this.arena.rotY * DEG2RAD);
    return {
      x: this.arena.posX + lx * c - lz * s,
      z: this.arena.posZ + lx * s + lz * c,
    };
  }
}

/**
 * ISurfaceProvider for any flat horizontal surface at a constant Y.
 * Used for the octagon base or any non-curved platform.
 */
export class FlatSurfaceProvider implements ISurfaceProvider {
  constructor(
    private readonly _surfaceId: string,
    private readonly _y:  number,
    private readonly _cx: number = 0,
    private readonly _cz: number = 0,
  ) {}

  get surfaceId(): string { return this._surfaceId; }

  getSurfaceAt(_worldX: number, _worldZ: number): SurfaceHit {
    return { y: this._y, normal: _UP };
  }

  getCenter(): { x: number; z: number; rotY: number } {
    return { x: this._cx, z: this._cz, rotY: 0 };
  }

  polarToWorld(r: number, angleDeg: number): { x: number; z: number } {
    const rad = angleDeg * DEG2RAD;
    return { x: this._cx + r * Math.cos(rad), z: this._cz + r * Math.sin(rad) };
  }
}

/**
 * ISurfaceProvider that downward-raycasts against a list of THREE.Mesh objects.
 * Useful when the surface shape isn't known analytically (e.g. imported geometry).
 */
export class MeshSurfaceProvider implements ISurfaceProvider {
  private readonly _raycaster = new THREE.Raycaster();
  private readonly _origin    = new THREE.Vector3();
  private readonly _dir       = new THREE.Vector3(0, -1, 0);

  constructor(
    private readonly _surfaceId: string,
    private readonly _meshes:    THREE.Mesh[],
    private readonly _fallbackY: number,
    private readonly _cx: number = 0,
    private readonly _cz: number = 0,
  ) {}

  get surfaceId(): string { return this._surfaceId; }

  getSurfaceAt(worldX: number, worldZ: number): SurfaceHit {
    this._origin.set(worldX, 500, worldZ);
    this._raycaster.set(this._origin, this._dir);
    const hits = this._raycaster.intersectObjects(this._meshes, false);
    if (hits.length > 0) {
      return {
        y:      hits[0].point.y,
        normal: hits[0].face?.normal?.clone() ?? new THREE.Vector3(0, 1, 0),
      };
    }
    return { y: this._fallbackY, normal: new THREE.Vector3(0, 1, 0) };
  }

  getCenter(): { x: number; z: number; rotY: number } {
    return { x: this._cx, z: this._cz, rotY: 0 };
  }

  polarToWorld(r: number, angleDeg: number): { x: number; z: number } {
    const rad = angleDeg * DEG2RAD;
    return { x: this._cx + r * Math.cos(rad), z: this._cz + r * Math.sin(rad) };
  }
}

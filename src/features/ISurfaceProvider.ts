import type * as THREE from 'three';

/** Result of querying a surface at a world-space XZ position. */
export interface SurfaceHit {
  /** World-space Y of the surface at the query point. */
  y: number;
  /** Surface normal at the query point (world-space). */
  normal: THREE.Vector3;
}

/**
 * Generic surface abstraction — decouples feature managers from ArenaData.
 *
 * Any sandbox can implement this (arena bowl, flat base, raycast mesh, etc.)
 * and inject it into feature managers without importing ArenaData.
 *
 * Design
 * ──────
 * ISurfaceProvider replaces the `getArenas()` callback that
 * ParentedFeatureManager previously accepted.  Managers that need to place
 * objects on a surface call `getSurfaceAt` / `polarToWorld` / `getCenter`
 * instead of reaching into an ArenaData struct.
 *
 * Implementations
 * ───────────────
 * ArenaSurfaceProvider — wraps ArenaData; uses parabolic-bowl math.
 * FlatSurfaceProvider  — constant Y plane; useful for octagon base or any flat surface.
 * MeshSurfaceProvider  — downward raycast against registered THREE.Mesh objects.
 * (All three in surfaceProviders.ts)
 */
export interface ISurfaceProvider {
  /** Unique ID matching the feature's parentId (e.g. arenaId, 'octagon-base'). */
  readonly surfaceId: string;

  /**
   * Returns the world-space Y and surface normal at the given world XZ position.
   * Inputs are world-space coordinates — NOT arena-local.
   */
  getSurfaceAt(worldX: number, worldZ: number): SurfaceHit;

  /** World XZ centre of the surface and its Y-rotation (degrees). */
  getCenter(): { x: number; z: number; rotY: number };

  /**
   * Convert a polar (r, angleDeg) position to world XZ.
   * For arena surfaces: r=0 → centre; angleDeg measured from +X axis.
   * For flat surfaces: measured from the provider's cx/cz centre.
   */
  polarToWorld(r: number, angleDeg: number): { x: number; z: number };
}

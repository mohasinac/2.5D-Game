import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════════
   SceneSurfaceProjector
   Downward raycasting against all registered scene meshes.
   Used by computeSegmentPath to thread speed lines over any surface
   (arena bowl, walls, obstacles, bridge decks).
   ══════════════════════════════════════════════════════════════════════════ */

export class SceneSurfaceProjector {
  private raycaster = new THREE.Raycaster();
  private meshes: THREE.Mesh[] = [];
  private fallbackSurfFn: (lx: number, lz: number) => number;

  constructor(
    meshes: THREE.Mesh[],
    fallbackSurfFn: (lx: number, lz: number) => number,
  ) {
    this.meshes = meshes.slice();
    this.fallbackSurfFn = fallbackSurfFn;
  }

  addMesh(m: THREE.Mesh): void {
    this.meshes.push(m);
  }

  /** Cast downward from high Y in WORLD space.
   *  Returns the closest hit point (offset by surfaceOffset along face normal),
   *  and the face normal in world space.
   *  Falls back to fallbackSurfFn(x, z) + Y if no mesh is hit. */
  project(
    x: number,
    z: number,
    surfaceOffset: number,
  ): { point: THREE.Vector3; normal: THREE.Vector3 } {
    const origin = new THREE.Vector3(x, 500, z);
    const dir    = new THREE.Vector3(0, -1, 0);
    this.raycaster.set(origin, dir);

    const hits = this.raycaster.intersectObjects(this.meshes, false);
    if (hits.length > 0) {
      const h = hits[0];
      const normal = h.face
        ? h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize()
        : new THREE.Vector3(0, 1, 0);
      const point = h.point.clone().addScaledVector(normal, surfaceOffset);
      return { point, normal };
    }

    const fallY = this.fallbackSurfFn(x, z);
    return {
      point:  new THREE.Vector3(x, fallY + surfaceOffset, z),
      normal: new THREE.Vector3(0, 1, 0),
    };
  }
}

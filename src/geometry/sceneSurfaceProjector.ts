import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

/* ══════════════════════════════════════════════════════════════════════════
   SceneSurfaceProjector
   Downward raycasting against all registered scene meshes.
   Used by computeSegmentPath to thread speed lines over any surface
   (arena bowl, walls, obstacles, bridge decks).

   BVH-ACCELERATED, and not optionally so.
   The projector raycasts once per path point, and a speed line is ~800 points
   (100 segments x SUB_STEPS_PER_SEG). Measured against a representative
   8,128-triangle bowl, brute-force `intersectObjects` took **434 ms for one
   rebuild** — with the path cache's 500 ms window that is ~87% of the budget
   spent blocking, every second a bey is near a speed line. Building a bounds
   tree per geometry turns the same work into a handful of milliseconds.

   This became load-bearing the moment the arena bowl itself was added to the
   projector (previously it only saw walls, obstacles and bridge decks, and the
   bowl — by far the heaviest mesh — was skipped).
   ══════════════════════════════════════════════════════════════════════════ */

/* Installed on the prototypes once, at module load. `acceleratedRaycast` falls
   back to the stock implementation for any geometry with no boundsTree, so
   meshes the projector never sees are completely unaffected. */
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export class SceneSurfaceProjector {
  private raycaster = new THREE.Raycaster();
  private meshes: THREE.Mesh[] = [];
  private fallbackSurfFn: (lx: number, lz: number) => number;

  constructor(
    meshes: THREE.Mesh[],
    fallbackSurfFn: (lx: number, lz: number) => number,
  ) {
    this.fallbackSurfFn = fallbackSurfFn;
    for (const m of meshes) this.addMesh(m);
  }

  addMesh(m: THREE.Mesh): void {
    /* Build the tree lazily and once per geometry. Geometries are rebuilt
       wholesale on edit (dispose-then-build), so a surviving tree always
       belongs to the geometry it was built from. */
    const geo = m.geometry as THREE.BufferGeometry & { boundsTree?: unknown };
    if (geo && !geo.boundsTree && geo.getAttribute('position')) {
      geo.computeBoundsTree();
      /* A bounds tree is a set of typed arrays that `geometry.dispose()` knows
         nothing about, and this project disposes geometry on every arena edit.
         Hooking the geometry's own dispose event frees the tree at exactly the
         right moment without touching the ~20 bespoke disposal sites — and
         without any of them having to remember that BVHs exist. Registered once
         per geometry, guarded by the `!boundsTree` check above. */
      geo.addEventListener('dispose', function onDispose(this: typeof geo) {
        this.disposeBoundsTree();
        this.removeEventListener('dispose', onDispose);
      });
    }
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

  /**
   * Highest surface at or below `maxY` — the one a body at that height would
   * actually stand on.
   *
   * `project` takes the globally topmost hit, which is right for painting a
   * ribbon onto a stadium from above and badly wrong for physics: a bey inside
   * a bowl with a bridge crossing over it would be told the deck is its ground
   * and teleport up onto it. Standing is "what is beneath my feet", not "what is
   * highest in this column".
   *
   * `slack` lets the test see a surface a little ABOVE the probe point so a body
   * resting exactly on a deck is not dropped through it by floating-point noise
   * on the following frame.
   *
   * Returns null when nothing is underneath, so the caller can fall back to its
   * own analytic surface rather than being handed an invented one.
   */
  projectBelow(
    x: number,
    z: number,
    maxY: number,
    surfaceOffset = 0,
    slack = 0.5,
  ): { point: THREE.Vector3; normal: THREE.Vector3; object: THREE.Object3D } | null {
    if (this.meshes.length === 0) return null;

    this.raycaster.set(new THREE.Vector3(x, 500, z), new THREE.Vector3(0, -1, 0));
    const hits = this.raycaster.intersectObjects(this.meshes, false);

    /* Hits arrive nearest-first from above, so the LAST one within the ceiling
       is the highest surface at or below it. */
    let best: THREE.Intersection | null = null;
    for (const h of hits) {
      if (h.point.y <= maxY + slack) { best = h; break; }
    }
    if (!best) return null;

    const normal = best.face
      ? best.face.normal.clone().transformDirection(best.object.matrixWorld).normalize()
      : new THREE.Vector3(0, 1, 0);
    return {
      point: best.point.clone().addScaledVector(normal, surfaceOffset),
      normal,
      object: best.object,
    };
  }
}

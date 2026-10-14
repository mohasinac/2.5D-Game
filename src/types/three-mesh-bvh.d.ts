/**
 * Prototype augmentations installed by `geometry/sceneSurfaceProjector.ts`.
 *
 * three-mesh-bvh ships its own types, but the monkey-patch pattern it documents
 * (assigning onto THREE.BufferGeometry.prototype) is invisible to TypeScript
 * unless the module interfaces are widened here.
 */
import 'three';

declare module 'three' {
  interface BufferGeometry {
    boundsTree?: unknown;
    computeBoundsTree(): void;
    disposeBoundsTree(): void;
  }
}

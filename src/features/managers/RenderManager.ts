import * as THREE from 'three';
import { applyRenderPolicy } from '../../render/shadowPolicy';

interface RenderEntry {
  objects: THREE.Object3D[];
  parents: (THREE.Object3D | null)[];
}

/**
 * Universal Three.js object registry that centralises all scene add/remove/dispose
 * and visibility operations previously scattered across every FeatureManager subclass.
 *
 * Each feature ID maps to a list of objects and their parent containers.
 * scene is the fallback parent when none is specified.
 */
export class RenderManager {
  private readonly _entries = new Map<string, RenderEntry>();

  constructor(private readonly scene: THREE.Scene) {}

  /**
   * Register objects for a feature and add them to the scene (or parent).
   * Additive: calling add() again with the same id appends more objects.
   * First-time registration only — do NOT call again for in-place geometry rebuilds.
   */
  add(id: string, objects: THREE.Object3D[], parent?: THREE.Object3D): void {
    let entry = this._entries.get(id);
    if (!entry) {
      entry = { objects: [], parents: [] };
      this._entries.set(id, entry);
    }
    for (const obj of objects) {
      entry.objects.push(obj);
      entry.parents.push(parent ?? null);
      /* The project's main scene-add funnel, so it is where shadow casting and
         tone-mapping exclusion are decided for every managed feature — walls,
         bridges, obstacles, traps, portals, footings, jump links, speed lines.
         Applying it here rather than in the 21 geometry builders keeps those
         pure (params -> BufferGeometry) as the import-direction rule requires.
         Recurses, so wall pivot groups and bridge anim pivots are covered. */
      applyRenderPolicy(obj);
      (parent ?? this.scene).add(obj);
    }
  }

  /**
   * Remove all objects for a feature from the scene/parent, dispose geometry +
   * material (recursing into Groups), and clear the registry entry.
   *
   * Recursion was added because the previous behaviour — "Groups are removed but
   * their children are NOT individually disposed" — leaked every mesh nested
   * under a Group and forced two managers to hand-roll their own disposal
   * (`WallManager.disposeOne`'s two divergent `_rotatePivot` paths, and
   * `BridgeManager._disposeSegment`). Those special cases existed only to work
   * around this gap.
   *
   * Geometry is disposed once per unique BufferGeometry and materials once per
   * unique Material, so shared instances are not double-disposed (which would
   * corrupt any other object still using them).
   */
  dispose(id: string): void {
    const entry = this._entries.get(id);
    if (!entry) return;

    const seenGeo = new Set<THREE.BufferGeometry>();
    const seenMat = new Set<THREE.Material>();

    const disposeDeep = (obj: THREE.Object3D): void => {
      // Snapshot children: disposing must not mutate the array being walked.
      for (const child of [...obj.children]) disposeDeep(child);

      const withGeo = obj as Partial<THREE.Mesh>;
      if (withGeo.geometry && !seenGeo.has(withGeo.geometry)) {
        seenGeo.add(withGeo.geometry);
        withGeo.geometry.dispose();
      }
      const mat = (obj as Partial<THREE.Mesh>).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if (m && !seenMat.has(m)) { seenMat.add(m); m.dispose(); }
        }
      }
    };

    for (let i = 0; i < entry.objects.length; i++) {
      const obj = entry.objects[i];
      (entry.parents[i] ?? this.scene).remove(obj);
      disposeDeep(obj);
    }
    this._entries.delete(id);
  }

  /**
   * Remove all objects for a feature from the scene/parent WITHOUT disposing geometry.
   * Clears the registry entry. Use when transitioning between render modes
   * (e.g. wall pivot-group on/off) where geometry will be re-registered immediately.
   */
  detach(id: string): void {
    const entry = this._entries.get(id);
    if (!entry) return;
    for (let i = 0; i < entry.objects.length; i++) {
      (entry.parents[i] ?? this.scene).remove(entry.objects[i]);
    }
    this._entries.delete(id);
  }

  /** Set visibility on all registered objects for a feature. */
  setVisible(id: string, visible: boolean): void {
    const entry = this._entries.get(id);
    if (!entry) return;
    for (const obj of entry.objects) obj.visible = visible;
  }

  /** Get all registered objects across all features (for raycasting). */
  getPickable(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    for (const e of this._entries.values()) out.push(...e.objects);
    return out;
  }

  /** Get objects registered for a specific feature. */
  getObjects(id: string): THREE.Object3D[] {
    return this._entries.get(id)?.objects ?? [];
  }

  /** Get a snapshot map of id → objects (for view-mode merging). */
  getAllEntries(): ReadonlyMap<string, THREE.Object3D[]> {
    const out = new Map<string, THREE.Object3D[]>();
    for (const [id, e] of this._entries) out.set(id, e.objects);
    return out;
  }

  /** Dispose all registered features. */
  clear(): void {
    for (const id of [...this._entries.keys()]) this.dispose(id);
  }
}

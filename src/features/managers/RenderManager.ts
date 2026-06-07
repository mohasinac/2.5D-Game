import * as THREE from 'three';

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
      (parent ?? this.scene).add(obj);
    }
  }

  /**
   * Remove all objects for a feature from the scene/parent, dispose geometry+material,
   * and clear the registry entry.
   * Groups are removed but their children are NOT individually disposed (callers
   * must dispose child entries separately via their own IDs).
   */
  dispose(id: string): void {
    const entry = this._entries.get(id);
    if (!entry) return;
    for (let i = 0; i < entry.objects.length; i++) {
      const obj = entry.objects[i];
      const par = entry.parents[i];
      (par ?? this.scene).remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          (obj.material as THREE.Material).dispose();
        }
      } else if (obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
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

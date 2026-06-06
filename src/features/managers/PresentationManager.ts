import * as THREE from 'three';
import type { PresentConfig } from '../../types/sharedTypes';
import type { SceneContext } from '../IArenaFeature';

/* ══════════════════════════════════════════════════════════════════════════
   PresentationManager — centralized STL present-mesh lifecycle.
   Tracks one present mesh per node ID; applies PresentConfig transforms.
   Decoupled from all feature types — works with any string node ID.
   ══════════════════════════════════════════════════════════════════════════ */

interface PresentEntry {
  mesh: THREE.Mesh;
  nodeId: string;
}

export class PresentationManager {
  private readonly entries = new Map<string, PresentEntry>();
  private _viewMode: 'hitbox' | 'both' | 'present' = 'both';

  constructor(private readonly ctx: SceneContext) {}

  /**
   * Load or replace the present mesh for a node.
   * `worldPos` is used as the mesh's initial base position.
   * The PresentConfig offX/Y/Z are applied on top.
   */
  load(
    nodeId:   string,
    config:   PresentConfig,
    worldPos: THREE.Vector3,
    geometry: THREE.BufferGeometry,
  ): void {
    // Dispose existing mesh if present
    this.dispose(nodeId);

    if (!config.stlb64 || geometry.index === null && geometry.getAttribute('position')?.count === 0) return;

    const mat = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.5,
      metalness: 0.3,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    this._applyTransform(mesh, config, worldPos);

    const visible = this._viewMode !== 'hitbox';
    mesh.visible = visible;

    this.ctx.scene.add(mesh);
    this.entries.set(nodeId, { mesh, nodeId });
  }

  /** Update transforms on an already-loaded present mesh without re-loading the STL. */
  updateTransform(nodeId: string, config: PresentConfig, worldPos: THREE.Vector3): void {
    const entry = this.entries.get(nodeId);
    if (!entry) return;
    this._applyTransform(entry.mesh, config, worldPos);
    (entry.mesh.material as THREE.MeshStandardMaterial).color.setHex(config.color);
  }

  /** Remove and dispose present mesh for a node. */
  dispose(nodeId: string): void {
    const entry = this.entries.get(nodeId);
    if (!entry) return;
    this.ctx.scene.remove(entry.mesh);
    entry.mesh.geometry.dispose();
    (entry.mesh.material as THREE.Material).dispose();
    this.entries.delete(nodeId);
  }

  /** Dispose ALL tracked present meshes. */
  disposeAll(): void {
    for (const id of [...this.entries.keys()]) this.dispose(id);
  }

  /**
   * Apply view mode — hitbox-visible objects stay visible in 'hitbox'/'both',
   * present meshes stay visible in 'both'/'present'.
   */
  applyViewMode(
    mode: 'hitbox' | 'both' | 'present',
    hitboxObjectsMap: ReadonlyMap<string, THREE.Object3D[]>,
  ): void {
    this._viewMode = mode;
    const showHitbox  = mode !== 'present';
    const showPresent = mode !== 'hitbox';

    for (const [, objs] of hitboxObjectsMap) {
      for (const o of objs) o.visible = showHitbox;
    }
    for (const entry of this.entries.values()) {
      entry.mesh.visible = showPresent;
    }
  }

  getEntry(nodeId: string): PresentEntry | undefined {
    return this.entries.get(nodeId);
  }

  /** Advance animated decal timers (no-op until opening decal animation is implemented). */
  tick(_dt: number): void {}

  private _applyTransform(mesh: THREE.Mesh, cfg: PresentConfig, worldPos: THREE.Vector3): void {
    mesh.position.set(
      worldPos.x + cfg.offX,
      worldPos.y + cfg.offY,
      worldPos.z + cfg.offZ,
    );
    mesh.rotation.set(
      THREE.MathUtils.degToRad(cfg.rotX),
      THREE.MathUtils.degToRad(cfg.rotY),
      THREE.MathUtils.degToRad(cfg.rotZ),
    );
    mesh.scale.set(cfg.scaleX, cfg.scaleY, cfg.scaleZ);
  }
}

import * as THREE from 'three';
import type { ObstacleData } from '../../types/arenaTypes';
import type { ObstacleSave } from '../../utils/arenaPersistence';
import {
  buildObstacleObjects,
  applyObstacle,
  defaultObstacle,
} from '../../geometry/obstacleBuilders';
import { obstacleToSave } from '../../utils/arenaPersistence';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages free-floating 3-D obstacle shapes placed anywhere in world space.
 *
 * Lifecycle
 * ─────────
 * add()           → creates with defaultObstacle defaults, builds geometry, registers tree node
 * apply(data)     → in-place geometry rebuild after property changes (calls applyObstacle)
 * remove(id)      → disposes GPU resources, unregisters from scene + tree
 * clear()         → disposes all; called during scene reset
 * restoreData([]) → hydrates data from save without geometry (buildAndShow called per item by caller)
 * buildAndShow(d) → builds geometry + adds tree node; called during load / undo-redo restore
 *
 * Reuse
 * ─────
 * ObstacleManager has no arena-specific dependencies beyond SceneContext.
 * It can be used in any Three.js sandbox that hosts free-floating shapes.
 */
export class ObstacleManager extends FeatureManager<ObstacleData, ObstacleSave> {

  constructor(ctx: SceneContext) {
    super(ctx, 'obstacle', 'Obstacle');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Add a new obstacle with defaults and return the live data object.
   * @param treeOpts  Optional scene-tree node options (e.g. add-child buttons).
   */
  add(treeOpts?: Record<string, unknown>): ObstacleData {
    const id   = this.nextId();
    const data = defaultObstacle(this.nextLabel(), id, this.ctx.getFallbackY());
    return this._insert(data, '⬛', 'octagon-base', treeOpts);
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  /**
   * Rebuild the obstacle's mesh geometry in-place.
   * mesh + edges must already exist (they are created by buildGeometry / add).
   */
  apply(data: ObstacleData): void {
    applyObstacle(data);
    // Re-register the same objects (they are mutated in-place by applyObstacle)
    this.ctx.trackObjects(data.id, [data.mesh!, data.edges!]);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  /**
   * Build geometry for a data object that was previously hydrated by
   * fromSave() and add a scene-tree node.  Called by ArenaSandbox during
   * loadArena / _applyConfigToScene after restoreData().
   */
  buildAndShow(
    data: ObstacleData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.buildGeometry(data);
    this.ctx.sceneTree.add(data.id, data.name, '⬛', 'octagon-base', treeOpts as never);
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: ObstacleData): void {
    // Dispose any placeholder geometry created by defaultObstacle() before
    // building the proper mesh from actual data values.
    if (data.mesh)  { data.mesh.geometry.dispose();  (data.mesh.material  as THREE.Material).dispose(); }
    if (data.edges) { data.edges.geometry.dispose(); (data.edges.material as THREE.Material).dispose(); }

    const [mesh, edges] = buildObstacleObjects(data);
    data.mesh  = mesh;
    data.edges = edges;
    this.ctx.scene.add(mesh, edges);
    this.ctx.trackObjects(data.id, [mesh, edges]);
  }

  protected disposeOne(data: ObstacleData): void {
    this.ctx.scene.remove(data.mesh);
    data.mesh.geometry.dispose();
    (data.mesh.material as THREE.Material).dispose();
    this.ctx.scene.remove(data.edges);
    data.edges.geometry.dispose();
    (data.edges.material as THREE.Material).dispose();
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: ObstacleData): ObstacleSave {
    return obstacleToSave(data);
  }

  fromSave(save: ObstacleSave): ObstacleData {
    // Start from defaults so all required fields are present, then overlay
    // the saved values.  The placeholder mesh from defaultObstacle will be
    // disposed and replaced when buildGeometry() is called.
    const data = defaultObstacle(save.name, save.id, this.ctx.getFallbackY());
    Object.assign(data, {
      shape:            save.shape,
      theme:            save.theme,
      dimX:             save.dimX,
      dimY:             save.dimY,
      dimZ:             save.dimZ,
      posX:             save.posX,
      posY:             save.posY,
      posZ:             save.posZ,
      rotX:             save.rotX,
      rotY:             save.rotY,
      rotZ:             save.rotZ,
      isFloating:       save.isFloating,
      isDestructible:   save.isDestructible,
      hitPoints:        save.hitPoints,
      contactForceX:    save.contactForceX,
      contactForceY:    save.contactForceY,
      contactForceZ:    save.contactForceZ,
      color:            save.color,
      surface:          save.surface,
      customTileData:   save.customTileData,
      tileScale:        save.tileScale,
      material:         save.material,
      emissiveColor:    save.emissiveColor,
      emissiveIntensity:save.emissiveIntensity,
      opacity:          save.opacity,
      speedPathId:      save.speedPathId,
      presentStlb64:    save.presentStlb64,
      presentColor:     save.presentColor,
      visible:          save.visible ?? true,
    });
    return data;
  }
}

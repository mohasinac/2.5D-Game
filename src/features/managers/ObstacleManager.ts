import * as THREE from 'three';
import type { ObstacleData } from '../../types/arenaTypes';
import type { ObstacleSave } from '../../utils/arenaPersistence';
import {
  buildObstacleObjects,
  applyObstacle,
  defaultObstacle,
} from '../../geometry/obstacleBuilders';
import { DEFAULT_OBSTACLE_WEIGHT } from '../../config/arenaConstants';
import { obstacleToSave } from '../../utils/arenaPersistence';
import { propRegistry, resolveModelId } from '../propRegistry';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext, IPositionedManager } from '../IArenaFeature';

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
export class ObstacleManager extends FeatureManager<ObstacleData, ObstacleSave> implements IPositionedManager {

  constructor(ctx: SceneContext) {
    super(ctx, 'obstacle', 'Obstacle');
  }

  // ── IPositionedManager ───────────────────────────────────────────────────

  getWorldPosition(id: string): THREE.Vector3 | null {
    const data = this.items.get(id);
    if (!data?.mesh) return null;
    return data.mesh.getWorldPosition(new THREE.Vector3());
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
    this.setVisible(data.id, data.visible ?? true);
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
    this.setVisible(data.id, data.visible ?? true);
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
    this.ctx.renderMgr.add(data.id, [mesh, edges]);

    this._attachProp(data, mesh);
  }

  /**
   * Swap in a real model where the data asks for one.
   *
   * THE PRIMITIVE IS BUILT FIRST, ALWAYS. The load is async and may fail, so
   * the procedural shape is the thing that guarantees something is on screen;
   * the model is an upgrade applied when and if it arrives. That ordering is
   * also what makes a fresh clone with no `assets/` still render an arena.
   *
   * `theme` resolves the id when `modelId` is null. Every boat in the demo
   * arena has carried `theme: 'boat'` since it was authored and NOTHING has
   * ever read it — which is why the Sea Side Bowl's "boats" are grey boxes.
   * Picking deterministically by index rather than at random keeps a given
   * arena looking the same on every load.
   *
   * COLLISION IS UNAFFECTED: `sim/step/obstacles.ts` resolves against the
   * authored primitive either way, so art can change without altering how a
   * stadium plays.
   */
  private _attachProp(data: ObstacleData, mesh: THREE.Mesh): void {
    const id = resolveModelId(data.modelId, data.theme, data.id);
    if (!id) return;

    const longest = Math.max(data.dimX, data.dimY, data.dimZ);
    void propRegistry().load(id).then((root) => {
      /* The obstacle may have been edited or deleted while the file was in
         flight — `applyObstacle` rebuilds destructively — so re-check that
         this is still the live mesh before touching the scene. */
      if (!root || data.mesh !== mesh) return;

      const inst = propRegistry().instantiate(id, longest);
      if (!inst) return;

      /* Hide the placeholder rather than removing it: it stays the thing the
         render manager owns and disposes, so the model cannot leak if the
         obstacle is deleted a frame later. The white edge overlay goes too —
         a wireframe box around a detailed boat is the giveaway that the swap
         is cosmetic.

         MATERIAL-LEVEL, NOT OBJECT-LEVEL. `Object3D.visible` is INHERITED by
         children, so `mesh.visible = false` also hid the model parented to it
         one line later — every prop vanished and the arena looked emptier than
         it had with boxes. Hiding the material leaves the node tree visible so
         the child still draws. */
      for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        m.visible = false;
      }
      if (data.edges) data.edges.visible = false;
      mesh.add(inst);
    });
  }

  protected disposeOne(_data: ObstacleData): void {
    // renderMgr.dispose() in base remove()/clear() handles scene removal + GPU disposal.
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
      weight:           save.weight ?? DEFAULT_OBSTACLE_WEIGHT,
      visible:          save.visible ?? true,
      modelId:          save.modelId ?? null,
      hideOnTrapIds:    save.hideOnTrapIds,
    });
    return data;
  }
}

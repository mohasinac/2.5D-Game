import * as THREE from 'three';
import type { BaseFootingData } from '../../types/arenaTypes';
import type { BaseFootingSave } from '../../utils/arenaPersistence';
import {
  buildFootingObjects,
  applyFooting,
  defaultFooting,
} from '../../geometry/footingBuilders';
import { footingToSave } from '../../utils/arenaPersistence';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages decorative / structural 3-D shapes placed on the octagon base.
 *
 * Footings are intentionally distinct from ObstacleManager:
 * • Positioned only on the base surface (basePosX / basePosZ / posY-above-base).
 * • Different field set (no world-space rotX/Z, no material, no theme).
 * • Different geometry builder (footingBuilders.ts — decoupled from obstacleBuilders.ts).
 *
 * This separation follows the coupling-prevention rule in CLAUDE.md: the two
 * object types share no geometry code, allowing independent evolution.
 *
 * Reuse
 * ─────
 * FootingManager has no arena-specific dependencies beyond SceneContext.
 * It can host footing objects on any flat base surface in any Three.js scene.
 */
export class FootingManager extends FeatureManager<BaseFootingData, BaseFootingSave> {

  constructor(ctx: SceneContext) {
    super(ctx, 'footing', 'Footing');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  add(): BaseFootingData {
    const id   = this.nextId();
    const data = defaultFooting(this.nextLabel(), id, this.ctx.getFallbackY());
    return this._insert(data, '⬢', 'octagon-base');
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  apply(data: BaseFootingData): void {
    applyFooting(data, this.ctx.getFallbackY());
    this.ctx.trackObjects(data.id, [data.mesh!, data.edges!]);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(data: BaseFootingData): void {
    this.buildGeometry(data);
    this.ctx.sceneTree.add(data.id, data.name, '⬢', 'octagon-base');
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: BaseFootingData): void {
    // Dispose placeholder geometry from defaultFooting()
    if (data.mesh)  { data.mesh.geometry.dispose();  (data.mesh.material  as THREE.Material).dispose(); }
    if (data.edges) { data.edges.geometry.dispose(); (data.edges.material as THREE.Material).dispose(); }

    const [mesh, edges] = buildFootingObjects(data, this.ctx.getFallbackY());
    data.mesh  = mesh;
    data.edges = edges;
    this.ctx.scene.add(mesh, edges);
    this.ctx.trackObjects(data.id, [mesh, edges]);
  }

  protected disposeOne(data: BaseFootingData): void {
    if (data.mesh) {
      this.ctx.scene.remove(data.mesh);
      data.mesh.geometry.dispose();
      (data.mesh.material as THREE.Material).dispose();
      data.mesh = null;
    }
    if (data.edges) {
      this.ctx.scene.remove(data.edges);
      data.edges.geometry.dispose();
      (data.edges.material as THREE.Material).dispose();
      data.edges = null;
    }
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: BaseFootingData): BaseFootingSave {
    return footingToSave(data);
  }

  fromSave(save: BaseFootingSave): BaseFootingData {
    const data = defaultFooting(save.name, save.id, this.ctx.getFallbackY());
    Object.assign(data, {
      shape:             save.shape,
      dimX:              save.dimX,
      dimY:              save.dimY,
      dimZ:              save.dimZ,
      basePosX:          save.basePosX,
      basePosZ:          save.basePosZ,
      baseRotY:          save.baseRotY,
      posY:              save.posY,
      color:             save.color,
      surface:           save.surface,
      customTileData:    save.customTileData,
      tileScale:         save.tileScale,
      emissiveColor:     save.emissiveColor,
      emissiveIntensity: save.emissiveIntensity,
      opacity:           save.opacity,
      presentStlb64:     save.presentStlb64,
      presentColor:      save.presentColor,
      visible:           save.visible ?? true,
    });
    return data;
  }
}

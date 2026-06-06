import * as THREE from 'three';
import type { TrapData, TrapDurationTier, ArenaData } from '../../types/arenaTypes';
import type { TrapSave, WallSave } from '../../utils/arenaPersistence';
import {
  buildTrapObjects,
  applyTrap,
  defaultTrap,
  trapSurfY,
} from '../../geometry/trapBuilders';
import { trapToSave } from '../../utils/arenaPersistence';
import { ParentedFeatureManager } from '../ParentedFeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages trigger trap pads — flat interactive surfaces placed on arena bowls
 * or the octagon base.
 *
 * Traps have three geometry components:
 *   mesh        — the flat plate
 *   edges       — plate wireframe
 *   variantMesh — optional variant geometry (spikes, trampoline, hammer, etc.)
 *
 * variantMesh must be disposed separately (analogous to arena.spiralMeshes).
 *
 * Wall cascade
 * ────────────
 * Traps can parent walls (parentType='trap').  When a trap is removed, its
 * child walls must be removed first.  Callers pass a wall-disposal callback
 * (removeTrapWalls) so TrapManager stays decoupled from WallManager.
 *
 * Reuse
 * ─────
 * Inherits parent-surface resolution from ParentedFeatureManager.
 * Has no direct dependency on WallManager — wall cleanup is injected.
 */
export class TrapManager extends ParentedFeatureManager<TrapData, TrapSave> {

  constructor(
    ctx: SceneContext,
    getArenas: () => ReadonlyMap<string, ArenaData>,
  ) {
    super(ctx, 'trap', 'Trap', getArenas);
  }

  // ── Public factory ───────────────────────────────────────────────────────

  /**
   * Add a new trap on a given parent (arena or base).
   * @param treeOpts  Scene-tree node options (add-child buttons injected by caller).
   */
  add(
    parentId:   string,
    parentType: 'arena' | 'base',
    treeOpts?:  Record<string, unknown>,
  ): TrapData {
    const id   = this.nextId();
    const data = defaultTrap(this.nextLabel(), id, parentId, parentType);
    const treeParent = parentType === 'base' ? 'octagon-base' : parentId;
    return this._insert(data, '⚡', treeParent, treeOpts);
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  apply(data: TrapData): void {
    const surfY = trapSurfY(data, this.getArenas() as Map<string, ArenaData>, this.ctx.getBaseHeight());
    applyTrap(data, surfY);
    const objs: THREE.Object3D[] = [data.mesh!, data.edges!];
    if (data.variantMesh) objs.push(data.variantMesh);
    this.ctx.trackObjects(data.id, objs);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(
    data:      TrapData,
    treeOpts?: Record<string, unknown>,
  ): void {
    this.buildGeometry(data);
    const treeParent = data.parentType === 'base' ? 'octagon-base' : data.parentId;
    this.ctx.sceneTree.add(data.id, data.name, '⚡', treeParent, treeOpts as never);
  }

  // ── Override remove to support wall cascade ──────────────────────────────

  /**
   * Remove a trap and optionally cascade to child walls first.
   * @param removeTrapWalls  Callback to dispose walls parented to this trap.
   *                         Injected by ArenaSandbox — TrapManager stays decoupled from WallManager.
   */
  removeWithWalls(
    id:              string,
    removeTrapWalls: (trapId: string) => void,
  ): boolean {
    removeTrapWalls(id);
    return this.remove(id);
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: TrapData): void {
    const surfY = trapSurfY(data, this.getArenas() as Map<string, ArenaData>, this.ctx.getBaseHeight());
    const [mesh, edges, variantMesh] = buildTrapObjects(data, surfY);
    data.mesh        = mesh;
    data.edges       = edges;
    data.variantMesh = variantMesh;

    const objs: THREE.Object3D[] = [mesh, edges];
    if (variantMesh) objs.push(variantMesh);
    this.ctx.scene.add(...objs);
    this.ctx.trackObjects(data.id, objs);
  }

  protected disposeOne(data: TrapData): void {
    this.ctx.scene.remove(data.mesh);
    data.mesh.geometry.dispose();
    (data.mesh.material as THREE.Material).dispose();
    this.ctx.scene.remove(data.edges);
    data.edges.geometry.dispose();
    (data.edges.material as THREE.Material).dispose();
    if (data.variantMesh) {
      this.ctx.scene.remove(data.variantMesh);
      data.variantMesh.geometry.dispose();
      (data.variantMesh.material as THREE.Material).dispose();
      data.variantMesh = null;
    }
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: TrapData): TrapSave {
    // wallToSave is handled by the caller (ArenaSandbox) — walls: [] populated there
    return trapToSave(data);
  }

  fromSave(save: TrapSave): TrapData {
    const data = defaultTrap(save.name, save.id, save.parentId, save.parentType);
    Object.assign(data, {
      shape:             save.shape,
      variant:           save.variant,
      effect:            save.effect,
      dimX:              save.dimX,
      dimZ:              save.dimZ,
      rotY:              save.rotY,
      posR:              save.posR,
      posAngle:          save.posAngle,
      basePosX:          save.basePosX,
      basePosZ:          save.basePosZ,
      forceX:            save.forceX,
      forceY:            save.forceY,
      forceZ:            save.forceZ,
      damageFactor:      save.damageFactor,
      healFactor:        save.healFactor,
      freezeDuration:    save.freezeDuration,
      buffSurface:       save.buffSurface,
      pitShape:          save.pitShape,
      pitRadiusX:        save.pitRadiusX,
      pitRadiusZ:        save.pitRadiusZ,
      pitDepth:          save.pitDepth,
      pitSides:          save.pitSides,
      pitStarInner:      save.pitStarInner,
      isPeriodic:        save.isPeriodic,
      safeInterval:      save.safeInterval,
      unsafeInterval:    save.unsafeInterval,
      activationLimit:   save.activationLimit,
      speedPathId:       save.speedPathId,
      durationTiers:     save.durationTiers.map((d): TrapDurationTier => ({ ...d })),
      baseMaterial:      save.baseMaterial,
      color:             save.color,
      surface:           save.surface,
      customTileData:    save.customTileData,
      tileScale:         save.tileScale,
      emissiveColor:     save.emissiveColor,
      emissiveIntensity: save.emissiveIntensity,
      presentStlb64:     save.presentStlb64,
      presentColor:      save.presentColor,
    });
    return data;
  }

  /** Expose the saved walls array from a TrapSave for the caller to restore. */
  static extractWalls(save: TrapSave): WallSave[] {
    return save.walls ?? [];
  }
}

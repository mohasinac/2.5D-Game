import * as THREE from 'three';
import type { PortalData } from '../../types/arenaTypes';
import type { PortalSave } from '../../utils/arenaPersistence';
import {
  buildPortalObjects,
  applyPortal,
  defaultPortal,
} from '../../geometry/portalBuilders';
import { portalToSave } from '../../utils/arenaPersistence';
import { ParentedFeatureManager } from '../ParentedFeatureManager';
import type { SceneContext } from '../IArenaFeature';
import type { ISurfaceProvider } from '../ISurfaceProvider';

/**
 * Manages instant-teleport portal pads placed on arena bowls or the octagon base.
 *
 * Portals have three geometry components:
 *   mesh     — the flat pad
 *   edges    — pad wireframe
 *   ringMesh — TorusGeometry floating above the pad (glow ring)
 *
 * ringMesh must be disposed separately (like trap.variantMesh).
 *
 * Reuse
 * ─────
 * Inherits parent-surface resolution from ParentedFeatureManager.
 * Has no arena-specific dependencies beyond what SceneContext and
 * getArenas() already provide.
 */
export class PortalManager extends ParentedFeatureManager<PortalData, PortalSave> {

  constructor(
    ctx:        SceneContext,
    getSurface: (surfaceId: string) => ISurfaceProvider | undefined,
  ) {
    super(ctx, 'portal', 'Portal', getSurface);
  }

  // ── Public factory ───────────────────────────────────────────────────────

  add(
    parentId:   string,
    parentType: 'arena' | 'base',
  ): PortalData {
    const id   = this.nextId();
    const data = defaultPortal(this.nextLabel(), id, parentId, parentType);
    const treeParent = this.resolveTreeParent(data);
    return this._insert(data, '◉', treeParent);
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  apply(data: PortalData): void {
    applyPortal(data, this.resolveSurfaceY(data));
    const objs: THREE.Object3D[] = [data.mesh!, data.edges!];
    if (data.ringMesh) objs.push(data.ringMesh);
    this.ctx.trackObjects(data.id, objs);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(data: PortalData): void {
    this.buildGeometry(data);
    const treeParent = this.resolveTreeParent(data);
    this.ctx.sceneTree.add(data.id, data.name, '◉', treeParent);
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: PortalData): void {
    const [mesh, edges, ringMesh] = buildPortalObjects(data, this.resolveSurfaceY(data));
    data.mesh     = mesh;
    data.edges    = edges;
    data.ringMesh = ringMesh;

    const objs: THREE.Object3D[] = [mesh, edges];
    if (ringMesh) objs.push(ringMesh);
    this.ctx.scene.add(...objs);
    this.ctx.trackObjects(data.id, objs);
  }

  protected disposeOne(data: PortalData): void {
    this.ctx.scene.remove(data.mesh);
    data.mesh.geometry.dispose();
    (data.mesh.material as THREE.Material).dispose();
    this.ctx.scene.remove(data.edges);
    data.edges.geometry.dispose();
    (data.edges.material as THREE.Material).dispose();
    if (data.ringMesh) {
      this.ctx.scene.remove(data.ringMesh);
      data.ringMesh.geometry.dispose();
      (data.ringMesh.material as THREE.Material).dispose();
      data.ringMesh = null;
    }
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: PortalData): PortalSave {
    return portalToSave(data);
  }

  fromSave(save: PortalSave): PortalData {
    const data = defaultPortal(save.name, save.id, save.parentId, save.parentType);
    Object.assign(data, {
      shape:          save.shape,
      dimX:           save.dimX,
      dimZ:           save.dimZ,
      rotY:           save.rotY,
      posR:           save.posR,
      posAngle:       save.posAngle,
      basePosX:       save.basePosX,
      basePosZ:       save.basePosZ,
      destType:       save.destType,
      destPortalId:   save.destPortalId,
      destArenaId:    save.destArenaId,
      destPosX:       save.destPosX,
      destPosY:       save.destPosY,
      destPosZ:       save.destPosZ,
      exitVelScale:   save.exitVelScale,
      exitRotY:       save.exitRotY,
      isBidirectional:save.isBidirectional,
      color:          save.color,
      glowColor:      save.glowColor,
      surface:        save.surface,
      customTileData: save.customTileData,
      tileScale:      save.tileScale,
      presentStlb64:  save.presentStlb64,
      presentColor:   save.presentColor,
      visible:        save.visible ?? true,
    });
    return data;
  }
}

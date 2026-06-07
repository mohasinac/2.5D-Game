import * as THREE from 'three';
import type { JumpLinkData, ArenaData, ObstacleData, TrapData, SpeedLineData, JumpLinkParentType } from '../../types/arenaTypes';
import type { JumpLinkSave } from '../../utils/arenaPersistence';
import { jumpLinkToSave } from '../../utils/arenaPersistence';
import {
  buildJumpLinkObjects,
  applyJumpLink,
  defaultJumpLink,
  jumpLinkFromSave,
} from '../../geometry/jumpLinkBuilders';
import { FeatureManager } from '../FeatureManager';
import type { SceneContext } from '../IArenaFeature';

/**
 * Manages Jump Link connectors — two-endpoint arcs that launch beyblades
 * along a parabolic/bezier/instant trajectory from a source disc to a
 * destination disc.
 *
 * Unlike portals (instant teleport), jump links apply physics forces and
 * show a visible trajectory arc. The bey is airborne and independent of
 * any speed line the moment it leaves the source disc.
 *
 * Source and destination can be on arenas, obstacles, traps, or the
 * octagon base, or at raw world-coordinate points, or at speed line
 * endpoints — or a mix of both.
 */
export class JumpLinkManager extends FeatureManager<JumpLinkData, JumpLinkSave> {

  constructor(
    ctx:             SceneContext,
    private readonly getArenas:    () => ReadonlyMap<string, ArenaData>,
    private readonly getObstacles: () => ReadonlyMap<string, ObstacleData>,
    private readonly getTraps:     () => ReadonlyMap<string, TrapData>,
    private readonly getSpeedLine: (id: string) => SpeedLineData | undefined,
  ) {
    super(ctx, 'jl', 'Jump Link');
  }

  // ── Public factory ───────────────────────────────────────────────────────

  add(srcParentId: string, srcParentType: JumpLinkParentType): JumpLinkData {
    const id   = this.nextId();
    const data = defaultJumpLink(this.nextLabel(), id, srcParentId, srcParentType);
    const treeParent = srcParentType === 'base' ? 'octagon-base' : srcParentId;
    return this._insert(data, '⤻', treeParent);
  }

  // ── Apply (rebuild geometry in-place after property edits) ──────────────

  apply(data: JumpLinkData): void {
    // Remove all objects from scene (without disposing) so new arrowMeshes can be re-registered
    this.ctx.renderMgr.detach(data.id);
    applyJumpLink(data, this.getArenas(), this.getObstacles(), this.getTraps(),
      this.getSpeedLine, this.ctx.getFallbackY());
    const objs: THREE.Object3D[] = [data.sourceMesh, data.destMesh, data.arcLine, ...data.arrowMeshes];
    this.ctx.renderMgr.add(data.id, objs);
  }

  // ── Build + show (used during restore / undo-redo) ──────────────────────

  buildAndShow(data: JumpLinkData, treeParent: string): void {
    this.buildGeometry(data);
    this.ctx.sceneTree.add(data.id, data.name, '⤻', treeParent);
  }

  // ── Template Method implementation ───────────────────────────────────────

  protected buildGeometry(data: JumpLinkData): void {
    const result = buildJumpLinkObjects(
      data, this.getArenas(), this.getObstacles(), this.getTraps(),
      this.getSpeedLine, this.ctx.getFallbackY(),
    );
    data.sourceMesh  = result.sourceMesh;
    data.destMesh    = result.destMesh;
    data.arcLine     = result.arcLine;
    data.arrowMeshes = result.arrowMeshes;

    const objs: THREE.Object3D[] = [result.sourceMesh, result.destMesh, result.arcLine, ...result.arrowMeshes];
    this.ctx.renderMgr.add(data.id, objs);
  }

  protected disposeOne(data: JumpLinkData): void {
    // THREE.Line (arcLine) is not auto-disposed by renderMgr — handle it explicitly.
    // renderMgr.dispose() (called by FeatureManager.remove after this) handles
    // scene.remove + geometry disposal for Mesh (sourceMesh, destMesh, arrowMeshes).
    data.arcLine.geometry.dispose();
    (data.arcLine.material as THREE.Material).dispose();
    data.arrowMeshes = [];
  }

  // ── Serialisation ────────────────────────────────────────────────────────

  toSave(data: JumpLinkData): JumpLinkSave {
    return jumpLinkToSave(data);
  }

  fromSave(save: JumpLinkSave): JumpLinkData {
    return jumpLinkFromSave(save);
  }
}

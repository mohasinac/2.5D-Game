import type { SceneTree } from '../../utils/SceneTree';
import type { TreeStateStore } from '../../stores/treeStateStore';
import type { RotationNodeType } from '../../types/arenaTypes';

/** Injected by ArenaSandbox — never import from screens/ inside this file. */
export interface SceneTreeOps {
  // Map/manager existence (for type dispatch in handlers)
  hasArena:       (id: string) => boolean;
  hasPit:         (id: string) => boolean;
  hasZone:        (id: string) => boolean;
  hasJumpLink:    (id: string) => boolean;
  hasTranslation: (id: string) => boolean;
  wallMgrHas:     (id: string) => boolean;
  bridgeMgrHas:   (id: string) => boolean;
  isSegment:      (id: string) => boolean;
  slMgrHas:       (id: string) => boolean;
  obstacleMgrHas: (id: string) => boolean;
  trapMgrHas:     (id: string) => boolean;
  portalMgrHas:   (id: string) => boolean;
  rotMgrHas:      (id: string) => boolean;
  rotMgrHasNode:  (id: string) => boolean;
  footingMgrHas:  (id: string) => boolean;

  // State / undo
  captureUndo:    () => void;
  save:           () => void;
  getSelectedId:  () => string | null;
  clearSelectedId:() => void;
  showPropsEmpty: () => void;
  getTreeChildIds:(parentId: string) => string[];

  // Remove ops
  removeArena:    (id: string) => void;
  removePit:      (id: string) => void;
  removeZone:     (id: string) => void;
  removeWall:     (id: string) => void;
  removeBridge:   (id: string) => void;
  removeSegment:  (id: string) => void;
  removeSl:       (id: string) => void;
  removeObstacle: (id: string) => void;
  removeTrap:     (id: string) => void;
  removePortal:   (id: string) => void;
  removeRotation: (id: string) => void;
  removeFooting:  (id: string) => void;
  removeJumpLink: (id: string) => void;
  removeTranslation:(id: string) => void;
  removeSubNode:  (id: string) => void;
  removeMemberFromRotation:(id: string) => void;

  // Reparent ops (compound — implemented in ArenaSandbox)
  reparentWall:   (id: string, newParentId: string) => void;
  reparentPit:    (id: string, newArenaId: string) => void;
  reparentZone:   (id: string, newArenaId: string) => void;
  reparentTrap:   (id: string, newParentId: string) => void;
  reparentPortal: (id: string, newParentId: string) => void;
  reparentSl:     (id: string, newParentId: string) => void;
  reparentBridgeSegment:(nodeId: string, newParentId: string, treeChildOrder: string[]) => void;

  // Duplicate ops
  duplicateArena:   (id: string) => void;
  duplicatePit:     (id: string) => void;
  duplicateZone:    (id: string) => void;
  duplicateWall:    (id: string) => void;
  duplicateTrap:    (id: string) => void;
  duplicatePortal:  (id: string) => void;
  duplicateObstacle:(id: string) => void;
  duplicateFooting: (id: string) => void;

  // Group / rotation ops
  nodeTypeOf:     (id: string) => RotationNodeType | undefined;
  addRotationFor: (memberIds: string[], types: RotationNodeType[],
                   pivotX: number, pivotY: number, pivotZ: number) => void;
  defaultPivotFor:(nodeId: string, type: RotationNodeType) => { pivotX: number; pivotY: number; pivotZ: number };
}

export class SceneTreeManager {
  constructor(
    private readonly tree:           SceneTree,
    private readonly ops:            SceneTreeOps,
    private readonly treeStateStore: TreeStateStore,
  ) {}

  wire(): void {
    this.tree.onDelete    = (ids)       => this._handleDelete(ids);
    this.tree.onGroup     = (gid, cids) => this._handleGroup(gid, cids);
    this.tree.onReparent  = (nid, pid)  => this._handleReparent(nid, pid);
    this.tree.onDuplicate = (id)        => this._handleDuplicate(id);
    this.tree.onExpand    = (id, exp)   => this.treeStateStore.getState().setExpanded(id, exp);
  }

  restore(): void {
    const ids = this.treeStateStore.getState().expandedIds;
    for (const id of ids) this.tree.setExpanded(id, true);
  }

  registerRotationNode(id: string): void {
    this.tree.setNodeActions(id, [
      { label: 'Ungroup', action: () => this._handleUngroup(id) },
    ]);
  }

  private _handleDelete(ids: string[]): void {
    this.ops.captureUndo();
    for (const id of ids) {
      if (id.startsWith('wallprofile-')) continue;
      if (id.startsWith('present-') || id.startsWith('particle-') ||
          id.startsWith('weather-') || id.startsWith('env-')) {
        this.ops.removeSubNode(id);
        continue;
      }
      if (this.ops.hasArena(id))       { this.ops.removeArena(id);   continue; }
      if (this.ops.hasPit(id))         { this.ops.removePit(id);     continue; }
      if (this.ops.hasZone(id))        { this.ops.removeZone(id);    continue; }
      if (this.ops.hasJumpLink(id))    { this.ops.removeJumpLink(id); continue; }
      if (this.ops.hasTranslation(id)) { this.ops.removeTranslation(id); continue; }
      if (this.ops.wallMgrHas(id)) {
        if (this.ops.rotMgrHasNode(id)) this.ops.removeMemberFromRotation(id);
        this.ops.removeWall(id);   continue;
      }
      if (this.ops.obstacleMgrHas(id)) {
        if (this.ops.rotMgrHasNode(id)) this.ops.removeMemberFromRotation(id);
        this.ops.removeObstacle(id); continue;
      }
      if (this.ops.trapMgrHas(id)) {
        if (this.ops.rotMgrHasNode(id)) this.ops.removeMemberFromRotation(id);
        this.ops.removeTrap(id);   continue;
      }
      if (this.ops.portalMgrHas(id))  { this.ops.removePortal(id);  continue; }
      if (this.ops.slMgrHas(id))      { this.ops.removeSl(id);      continue; }
      if (this.ops.isSegment(id))     { this.ops.removeSegment(id); continue; }
      if (this.ops.bridgeMgrHas(id))  { this.ops.removeBridge(id);  continue; }
      if (this.ops.rotMgrHas(id))     { this.ops.removeRotation(id); continue; }
      if (this.ops.footingMgrHas(id)) { this.ops.removeFooting(id); continue; }
    }
    if (ids.some(id => id === this.ops.getSelectedId())) {
      this.ops.clearSelectedId();
      this.ops.showPropsEmpty();
    }
    this.ops.save();
  }

  private _handleGroup(autoGroupId: string, childIds: string[]): void {
    this.tree.remove(autoGroupId);
    const validIds:   string[]          = [];
    const validTypes: RotationNodeType[] = [];
    for (const cid of childIds) {
      const t = this.ops.nodeTypeOf(cid);
      if (t && !this.ops.rotMgrHasNode(cid)) { validIds.push(cid); validTypes.push(t); }
    }
    if (validIds.length < 1) return;
    let sumX = 0, sumY = 0, sumZ = 0;
    for (let i = 0; i < validIds.length; i++) {
      const p = this.ops.defaultPivotFor(validIds[i], validTypes[i]);
      sumX += p.pivotX; sumY += p.pivotY; sumZ += p.pivotZ;
    }
    const n = validIds.length;
    this.ops.addRotationFor(validIds, validTypes, sumX / n, sumY / n, sumZ / n);
  }

  private _handleReparent(nodeId: string, newParentId: string | null): void {
    if (!newParentId) return;
    if (nodeId.startsWith('present-') || nodeId.startsWith('particle-') ||
        nodeId.startsWith('weather-') || nodeId.startsWith('env-')) return;
    if (nodeId.startsWith('wallprofile-')) return;
    if (this.ops.hasJumpLink(nodeId)) return;

    if (this.ops.isSegment(nodeId)) {
      const childOrder = this.ops.getTreeChildIds(newParentId)
        .filter(id => this.ops.isSegment(id));
      this.ops.reparentBridgeSegment(nodeId, newParentId, childOrder);
      this.ops.save();
      return;
    }
    if (this.ops.wallMgrHas(nodeId))   { this.ops.reparentWall(nodeId, newParentId);   this.ops.save(); return; }
    if (this.ops.hasPit(nodeId))       { this.ops.reparentPit(nodeId, newParentId);    this.ops.save(); return; }
    if (this.ops.hasZone(nodeId))      { this.ops.reparentZone(nodeId, newParentId);   this.ops.save(); return; }
    if (this.ops.trapMgrHas(nodeId))   { this.ops.reparentTrap(nodeId, newParentId);   this.ops.save(); return; }
    if (this.ops.portalMgrHas(nodeId)) { this.ops.reparentPortal(nodeId, newParentId); this.ops.save(); return; }
    if (this.ops.slMgrHas(nodeId))     { this.ops.reparentSl(nodeId, newParentId);     this.ops.save(); return; }
    // arenas, obstacles, footings, bridges, rotations → no-op
  }

  private _handleDuplicate(id: string): void {
    if (id.startsWith('present-') || id.startsWith('particle-') ||
        id.startsWith('weather-') || id.startsWith('env-')) return;
    if (this.ops.hasArena(id))        { this.ops.duplicateArena(id);    return; }
    if (this.ops.hasPit(id))          { this.ops.duplicatePit(id);      return; }
    if (this.ops.hasZone(id))         { this.ops.duplicateZone(id);     return; }
    if (this.ops.wallMgrHas(id))      { this.ops.duplicateWall(id);     return; }
    if (this.ops.trapMgrHas(id))      { this.ops.duplicateTrap(id);     return; }
    if (this.ops.portalMgrHas(id))    { this.ops.duplicatePortal(id);   return; }
    if (this.ops.obstacleMgrHas(id))  { this.ops.duplicateObstacle(id); return; }
    if (this.ops.footingMgrHas(id))   { this.ops.duplicateFooting(id);  return; }
    // bridges, speed lines, rotations, segments → no-op
  }

  private _handleUngroup(rotationId: string): void {
    if (!this.ops.rotMgrHas(rotationId)) return;
    this.ops.captureUndo();
    this.ops.removeRotation(rotationId);
    this.ops.save();
  }
}

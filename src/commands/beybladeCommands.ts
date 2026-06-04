import { ICommand } from './ICommand';
import { BeybladeStore } from '../stores/BeybladeStore';
import {
  PartData, SectorData, GroupData, AxisData,
} from '../types/beybladeTypes';

// Callbacks injected so commands don't import the renderer directly (DIP)
export interface BeybladeCommandCtx {
  store: BeybladeStore;
  onPartAdded(id: string): void;
  onPartRemoved(id: string): void;
  onPartUpdated(id: string): void;
  onSectorAdded(partId: string, sectorId: string): void;
  onSectorRemoved(partId: string, sectorId: string): void;
  onSectorUpdated(sectorId: string): void;
  onGroupAdded(id: string): void;
  onGroupRemoved(id: string): void;
  onGroupUpdated(id: string): void;
  onRootOrderChanged(): void;
  onAxisUpdated(): void;
  onTreeRebuild(): void;
}

// ── Axis ──────────────────────────────────────────────────────────────────────

export class UpdateAxisCmd implements ICommand {
  readonly description = 'Update axis';
  private prev: AxisData;
  constructor(private ctx: BeybladeCommandCtx, private next: Partial<AxisData>) {
    this.prev = { ...ctx.store.getAxis() };
  }
  execute(): void { this.ctx.store.setAxis(this.next); this.ctx.onAxisUpdated(); }
  undo(): void { this.ctx.store.setAxis(this.prev); this.ctx.onAxisUpdated(); }
}

// ── Parts ─────────────────────────────────────────────────────────────────────

export class AddPartCmd implements ICommand {
  readonly description = 'Add part';
  constructor(private ctx: BeybladeCommandCtx, private data: PartData) {}
  execute(): void {
    this.ctx.store.addPart(this.data);
    this.ctx.store.addToRoot(this.data.id);
    this.ctx.onPartAdded(this.data.id);
  }
  undo(): void {
    this.ctx.store.removePart(this.data.id);
    this.ctx.store.removeFromRoot(this.data.id);
    this.ctx.onPartRemoved(this.data.id);
  }
}

export class DeletePartCmd implements ICommand {
  readonly description = 'Delete part';
  private snapshot: PartData;
  private snapshotSectors: SectorData[];
  private wasInRoot: boolean;
  private parentGroupId: string | null;
  constructor(private ctx: BeybladeCommandCtx, private partId: string) {
    this.snapshot = { ...ctx.store.getPart(partId), sectorIds: [...ctx.store.getPart(partId).sectorIds] };
    this.snapshotSectors = this.snapshot.sectorIds.map(sid => ({ ...ctx.store.getSector(sid) }));
    this.wasInRoot = ctx.store.getRootChildIds().includes(partId);
    this.parentGroupId = this._findParentGroup();
  }
  private _findParentGroup(): string | null {
    for (const g of this.ctx.store.getAllGroups()) {
      if (g.childIds.includes(this.partId)) return g.id;
    }
    return null;
  }
  execute(): void {
    for (const sid of this.snapshot.sectorIds) this.ctx.store.removeSector(sid);
    this.ctx.store.removePart(this.partId);
    if (this.wasInRoot) this.ctx.store.removeFromRoot(this.partId);
    if (this.parentGroupId) {
      const g = this.ctx.store.getGroup(this.parentGroupId);
      this.ctx.store.updateGroup(this.parentGroupId, { childIds: g.childIds.filter(id => id !== this.partId) });
    }
    this.ctx.onPartRemoved(this.partId);
  }
  undo(): void {
    for (const s of this.snapshotSectors) this.ctx.store.addSector(s);
    this.ctx.store.addPart(this.snapshot);
    if (this.wasInRoot) this.ctx.store.addToRoot(this.partId);
    if (this.parentGroupId) {
      const g = this.ctx.store.getGroup(this.parentGroupId);
      this.ctx.store.updateGroup(this.parentGroupId, { childIds: [...g.childIds, this.partId] });
    }
    this.ctx.onPartAdded(this.partId);
  }
}

export class UpdatePartCmd implements ICommand {
  readonly description = 'Update part';
  private prev: Partial<PartData>;
  constructor(private ctx: BeybladeCommandCtx, private id: string, private next: Partial<PartData>) {
    const p = ctx.store.getPart(id);
    this.prev = Object.fromEntries(
      (Object.keys(next) as (keyof PartData)[]).map(k => [k, p[k]])
    ) as Partial<PartData>;
  }
  execute(): void { this.ctx.store.updatePart(this.id, this.next); this.ctx.onPartUpdated(this.id); }
  undo(): void { this.ctx.store.updatePart(this.id, this.prev); this.ctx.onPartUpdated(this.id); }
}

// ── Sectors ───────────────────────────────────────────────────────────────────

export class CutSectorsCmd implements ICommand {
  readonly description = 'Cut into sectors';
  private oldSectorIds: string[];
  constructor(private ctx: BeybladeCommandCtx, private partId: string, private newSectors: SectorData[]) {
    this.oldSectorIds = [...ctx.store.getPart(partId).sectorIds];
  }
  execute(): void {
    for (const sid of this.oldSectorIds) this.ctx.store.removeSector(sid);
    for (const s of this.newSectors) this.ctx.store.addSector(s);
    this.ctx.store.updatePart(this.partId, { sectorIds: this.newSectors.map(s => s.id) });
    this.ctx.onPartUpdated(this.partId);
  }
  undo(): void {
    for (const s of this.newSectors) this.ctx.store.removeSector(s.id);
    for (const sid of this.oldSectorIds) { /* already gone — sectors were removed */ }
    this.ctx.store.updatePart(this.partId, { sectorIds: this.oldSectorIds });
    this.ctx.onPartUpdated(this.partId);
  }
}

export class UpdateSectorCmd implements ICommand {
  readonly description = 'Update sector';
  private prev: Partial<SectorData>;
  constructor(private ctx: BeybladeCommandCtx, private partId: string, private sectorId: string, private next: Partial<SectorData>) {
    const s = ctx.store.getSector(sectorId);
    this.prev = Object.fromEntries(
      (Object.keys(next) as (keyof SectorData)[]).map(k => [k, s[k]])
    ) as Partial<SectorData>;
  }
  execute(): void { this.ctx.store.updateSector(this.sectorId, this.next); this.ctx.onSectorUpdated(this.sectorId); }
  undo(): void { this.ctx.store.updateSector(this.sectorId, this.prev); this.ctx.onSectorUpdated(this.sectorId); }
}

export class DeleteSectorCmd implements ICommand {
  readonly description = 'Delete sector';
  private snapshot: SectorData;
  constructor(private ctx: BeybladeCommandCtx, private partId: string, private sectorId: string) {
    this.snapshot = { ...ctx.store.getSector(sectorId) };
  }
  execute(): void {
    this.ctx.store.removeSector(this.sectorId);
    const p = this.ctx.store.getPart(this.partId);
    this.ctx.store.updatePart(this.partId, { sectorIds: p.sectorIds.filter(id => id !== this.sectorId) });
    this.ctx.onSectorRemoved(this.partId, this.sectorId);
  }
  undo(): void {
    this.ctx.store.addSector(this.snapshot);
    const p = this.ctx.store.getPart(this.partId);
    this.ctx.store.updatePart(this.partId, { sectorIds: [...p.sectorIds, this.sectorId] });
    this.ctx.onSectorAdded(this.partId, this.sectorId);
  }
}

// ── Groups ────────────────────────────────────────────────────────────────────

export class AddGroupCmd implements ICommand {
  readonly description = 'Add group';
  constructor(private ctx: BeybladeCommandCtx, private data: GroupData) {}
  execute(): void {
    this.ctx.store.addGroup(this.data);
    this.ctx.store.addToRoot(this.data.id);
    this.ctx.onGroupAdded(this.data.id);
  }
  undo(): void {
    this.ctx.store.removeGroup(this.data.id);
    this.ctx.store.removeFromRoot(this.data.id);
    this.ctx.onGroupRemoved(this.data.id);
  }
}

export class DeleteGroupCmd implements ICommand {
  readonly description = 'Delete group';
  private snapshot: GroupData;
  private wasInRoot: boolean;
  constructor(private ctx: BeybladeCommandCtx, private groupId: string) {
    const g = ctx.store.getGroup(groupId);
    this.snapshot = { ...g, childIds: [...g.childIds] };
    this.wasInRoot = ctx.store.getRootChildIds().includes(groupId);
  }
  execute(): void {
    // Promote children to root
    for (const cid of this.snapshot.childIds) this.ctx.store.addToRoot(cid);
    this.ctx.store.removeGroup(this.groupId);
    if (this.wasInRoot) this.ctx.store.removeFromRoot(this.groupId);
    this.ctx.onGroupRemoved(this.groupId);
  }
  undo(): void {
    this.ctx.store.addGroup(this.snapshot);
    if (this.wasInRoot) this.ctx.store.addToRoot(this.groupId);
    for (const cid of this.snapshot.childIds) this.ctx.store.removeFromRoot(cid);
    this.ctx.onGroupAdded(this.groupId);
  }
}

export class UpdateGroupCmd implements ICommand {
  readonly description = 'Update group';
  private prev: Partial<GroupData>;
  constructor(private ctx: BeybladeCommandCtx, private id: string, private next: Partial<GroupData>) {
    const g = ctx.store.getGroup(id);
    this.prev = Object.fromEntries(
      (Object.keys(next) as (keyof GroupData)[]).map(k => [k, g[k]])
    ) as Partial<GroupData>;
  }
  execute(): void { this.ctx.store.updateGroup(this.id, this.next); this.ctx.onGroupUpdated(this.id); }
  undo(): void { this.ctx.store.updateGroup(this.id, this.prev); this.ctx.onGroupUpdated(this.id); }
}

export class MoveNodeCmd implements ICommand {
  readonly description = 'Move node';
  constructor(
    private ctx: BeybladeCommandCtx,
    private nodeId: string,
    private fromParentId: string | null, // null = root
    private toParentId: string | null,   // null = root
    private toIndex: number,
  ) {}
  execute(): void { this._move(this.fromParentId, this.toParentId, this.toIndex); }
  undo(): void { this._move(this.toParentId, this.fromParentId, 0); }
  private _move(from: string | null, to: string | null, _idx: number): void {
    if (from === null) {
      this.ctx.store.removeFromRoot(this.nodeId);
    } else {
      const g = this.ctx.store.getGroup(from);
      this.ctx.store.updateGroup(from, { childIds: g.childIds.filter(id => id !== this.nodeId) });
    }
    if (to === null) {
      this.ctx.store.addToRoot(this.nodeId);
    } else {
      const g = this.ctx.store.getGroup(to);
      const kids = [...g.childIds, this.nodeId];
      this.ctx.store.updateGroup(to, { childIds: kids });
    }
    this.ctx.onRootOrderChanged();
  }
}

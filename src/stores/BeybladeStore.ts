import {
  AxisData, PartData, SectorData, GroupData, BeybladeBuildConfig,
} from '../types/beybladeTypes';

const DEFAULT_AXIS: AxisData = { tiltAngle: 0, pivotOffset: 0, spinDir: 'right' };

export class BeybladeStore {
  private axis: AxisData = { ...DEFAULT_AXIS };
  private parts = new Map<string, PartData>();
  private sectors = new Map<string, SectorData>();
  private groups = new Map<string, GroupData>();
  private rootChildIds: string[] = [];
  private _partSeq = 0;
  private _sectorSeq = 0;
  private _groupSeq = 0;

  // ── Axis ──────────────────────────────────────────────────────────────────
  getAxis(): Readonly<AxisData> { return this.axis; }
  setAxis(data: Partial<AxisData>): void { Object.assign(this.axis, data); }

  // ── Parts ─────────────────────────────────────────────────────────────────
  getPart(id: string): PartData {
    const p = this.parts.get(id);
    if (!p) throw new Error(`Part not found: ${id}`);
    return p;
  }
  getAllParts(): PartData[] { return [...this.parts.values()]; }
  hasPart(id: string): boolean { return this.parts.has(id); }
  findPartOfSector(sectorId: string): string | null {
    for (const [pid, part] of this.parts) {
      if (part.sectorIds.includes(sectorId)) return pid;
    }
    return null;
  }
  addPart(data: PartData): void { this.parts.set(data.id, data); }
  updatePart(id: string, data: Partial<PartData>): void {
    const p = this.getPart(id);
    Object.assign(p, data);
  }
  removePart(id: string): void { this.parts.delete(id); }

  // ── Sectors ───────────────────────────────────────────────────────────────
  getSector(id: string): SectorData {
    const s = this.sectors.get(id);
    if (!s) throw new Error(`Sector not found: ${id}`);
    return s;
  }
  hasSector(id: string): boolean { return this.sectors.has(id); }
  addSector(data: SectorData): void { this.sectors.set(data.id, data); }
  updateSector(id: string, data: Partial<SectorData>): void {
    const s = this.getSector(id);
    Object.assign(s, data);
  }
  removeSector(id: string): void { this.sectors.delete(id); }

  // ── Groups ────────────────────────────────────────────────────────────────
  getGroup(id: string): GroupData {
    const g = this.groups.get(id);
    if (!g) throw new Error(`Group not found: ${id}`);
    return g;
  }
  getAllGroups(): GroupData[] { return [...this.groups.values()]; }
  hasGroup(id: string): boolean { return this.groups.has(id); }
  addGroup(data: GroupData): void { this.groups.set(data.id, data); }
  updateGroup(id: string, data: Partial<GroupData>): void {
    const g = this.getGroup(id);
    Object.assign(g, data);
  }
  removeGroup(id: string): void { this.groups.delete(id); }

  // ── Root tree ─────────────────────────────────────────────────────────────
  getRootChildIds(): string[] { return this.rootChildIds; }
  setRootChildIds(ids: string[]): void { this.rootChildIds = [...ids]; }

  addToRoot(id: string): void {
    if (!this.rootChildIds.includes(id)) this.rootChildIds.push(id);
  }
  removeFromRoot(id: string): void {
    this.rootChildIds = this.rootChildIds.filter(x => x !== id);
  }

  // ── ID sequences ──────────────────────────────────────────────────────────
  nextPartId(): string { return `part-${++this._partSeq}`; }
  nextSectorId(): string { return `sector-${++this._sectorSeq}`; }
  nextGroupId(): string { return `group-${++this._groupSeq}`; }

  // ── Serialization ─────────────────────────────────────────────────────────
  serialize(): BeybladeBuildConfig {
    return {
      version: 1,
      axis: { ...this.axis },
      rootChildIds: [...this.rootChildIds],
      groups: [...this.groups.values()].map(g => ({ ...g, childIds: [...g.childIds] })),
      parts: [...this.parts.values()].map(p => ({ ...p, sectorIds: [...p.sectorIds] })),
      sectors: [...this.sectors.values()].map(s => ({ ...s })),
      partSeq: this._partSeq,
      sectorSeq: this._sectorSeq,
      groupSeq: this._groupSeq,
    };
  }

  deserialize(cfg: BeybladeBuildConfig): void {
    this.axis = { ...cfg.axis };
    this.parts.clear();
    this.sectors.clear();
    this.groups.clear();
    for (const p of cfg.parts) this.parts.set(p.id, { ...p, sectorIds: [...p.sectorIds] });
    for (const s of cfg.sectors) this.sectors.set(s.id, { ...s });
    for (const g of cfg.groups) this.groups.set(g.id, { ...g, childIds: [...g.childIds] });
    this.rootChildIds = [...cfg.rootChildIds];
    this._partSeq = cfg.partSeq;
    this._sectorSeq = cfg.sectorSeq;
    this._groupSeq = cfg.groupSeq;
  }

  reset(): void {
    this.axis = { ...DEFAULT_AXIS };
    this.parts.clear();
    this.sectors.clear();
    this.groups.clear();
    this.rootChildIds = [];
    this._partSeq = 0;
    this._sectorSeq = 0;
    this._groupSeq = 0;
  }
}

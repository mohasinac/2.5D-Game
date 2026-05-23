// Uniform spatial grid index for arena entities. Used by interest
// management (per-client visible-set) and by physics broad-phase queries.
// See plan Part 15.
//
// All input coordinates are in **cm** (world space, origin at arena center).

export interface GridEntity {
  id: string;
  x_cm: number;
  y_cm: number;
  radiusCm: number;
}

export interface Rect { x: number; y: number; w: number; h: number; }

export class SpatialGrid {
  /** Cell side in cm. 4cm matches the typical bey diameter for good locality. */
  readonly cellCm: number;
  private cells = new Map<string, Set<string>>();
  private entityCell = new Map<string, string>();
  private entities = new Map<string, GridEntity>();

  constructor(cellCm: number = 4) {
    this.cellCm = cellCm;
  }

  private key(cx: number, cy: number): string { return `${cx},${cy}`; }
  private cellOf(x_cm: number, y_cm: number): { cx: number; cy: number } {
    return { cx: Math.floor(x_cm / this.cellCm), cy: Math.floor(y_cm / this.cellCm) };
  }

  insertOrUpdate(e: GridEntity): void {
    const { cx, cy } = this.cellOf(e.x_cm, e.y_cm);
    const newKey = this.key(cx, cy);
    const oldKey = this.entityCell.get(e.id);
    if (oldKey === newKey) {
      this.entities.set(e.id, e);
      return;
    }
    if (oldKey) {
      const old = this.cells.get(oldKey);
      old?.delete(e.id);
      if (old && old.size === 0) this.cells.delete(oldKey);
    }
    let bucket = this.cells.get(newKey);
    if (!bucket) {
      bucket = new Set();
      this.cells.set(newKey, bucket);
    }
    bucket.add(e.id);
    this.entityCell.set(e.id, newKey);
    this.entities.set(e.id, e);
  }

  remove(id: string): void {
    const key = this.entityCell.get(id);
    if (!key) return;
    const bucket = this.cells.get(key);
    bucket?.delete(id);
    if (bucket && bucket.size === 0) this.cells.delete(key);
    this.entityCell.delete(id);
    this.entities.delete(id);
  }

  clear(): void {
    this.cells.clear();
    this.entityCell.clear();
    this.entities.clear();
  }

  size(): number { return this.entities.size; }

  /** Entities whose center lies inside `rect` (with optional margin). */
  queryRect(rect: Rect, marginCm = 0): GridEntity[] {
    const out: GridEntity[] = [];
    const x0 = rect.x - marginCm;
    const y0 = rect.y - marginCm;
    const x1 = rect.x + rect.w + marginCm;
    const y1 = rect.y + rect.h + marginCm;
    const c0 = this.cellOf(x0, y0);
    const c1 = this.cellOf(x1, y1);
    for (let cx = c0.cx; cx <= c1.cx; cx++) {
      for (let cy = c0.cy; cy <= c1.cy; cy++) {
        const bucket = this.cells.get(this.key(cx, cy));
        if (!bucket) continue;
        bucket.forEach((id) => {
          const e = this.entities.get(id);
          if (!e) return;
          if (e.x_cm >= x0 && e.x_cm <= x1 && e.y_cm >= y0 && e.y_cm <= y1) out.push(e);
        });
      }
    }
    return out;
  }

  /** Entities whose AABB (using radius) intersects `rect`. */
  queryRectByAabb(rect: Rect, marginCm = 0): GridEntity[] {
    const out: GridEntity[] = [];
    const x0 = rect.x - marginCm;
    const y0 = rect.y - marginCm;
    const x1 = rect.x + rect.w + marginCm;
    const y1 = rect.y + rect.h + marginCm;
    // Expand cell range by max expected radius — 1 cell covers 4cm; most beys
    // fit in one cell, but very large obstacles may span more. We use 4-cell
    // expansion as a heuristic.
    const expand = 16;
    const c0 = this.cellOf(x0 - expand, y0 - expand);
    const c1 = this.cellOf(x1 + expand, y1 + expand);
    for (let cx = c0.cx; cx <= c1.cx; cx++) {
      for (let cy = c0.cy; cy <= c1.cy; cy++) {
        const bucket = this.cells.get(this.key(cx, cy));
        if (!bucket) continue;
        bucket.forEach((id) => {
          const e = this.entities.get(id);
          if (!e) return;
          if (
            e.x_cm + e.radiusCm >= x0 &&
            e.x_cm - e.radiusCm <= x1 &&
            e.y_cm + e.radiusCm >= y0 &&
            e.y_cm - e.radiusCm <= y1
          ) out.push(e);
        });
      }
    }
    return out;
  }

  /** Entities within a circular query radius (cm). */
  queryCircle(x_cm: number, y_cm: number, radiusCm: number): GridEntity[] {
    const cand = this.queryRect({ x: x_cm - radiusCm, y: y_cm - radiusCm, w: radiusCm * 2, h: radiusCm * 2 });
    return cand.filter((e) => {
      const dx = e.x_cm - x_cm;
      const dy = e.y_cm - y_cm;
      return dx * dx + dy * dy <= radiusCm * radiusCm;
    });
  }
}

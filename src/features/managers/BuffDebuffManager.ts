import type { ITickableManager } from '../IArenaFeature';
import {
  type BaseStatModifiers,
  defaultBaseStatModifiers,
  combineStatMods,
} from '../../types/sharedTypes';

export type BuffSourceType = 'speed_line' | 'trap' | 'zone' | 'jump_link' | 'arena' | 'custom';

export interface ActiveBuff {
  sourceId:   string;
  sourceType: BuffSourceType;
  mods:       Partial<BaseStatModifiers>;
  durationMs: number | null;   // null = indefinite until removeSource is called
  appliedAt:  number;          // performance.now() at apply time
}

/**
 * Tracks multiplicative stat-modifier stacks per entity.
 *
 * Each source (speed line, trap, zone) applies a named buff via apply().
 * Calling removeSource() removes it immediately (e.g. entity left the zone).
 * Timed buffs (durationMs !== null) expire automatically each tick().
 *
 * getEffective() returns the combined BaseStatModifiers (multiplicative product)
 * of all currently active buffs for an entity.
 *
 * Owned by SpawnManager; tick() is called from SpawnManager.tick() each frame.
 */
export class BuffDebuffManager implements ITickableManager {
  private readonly _buffs = new Map<string, ActiveBuff[]>();

  apply(entityId: string, buff: ActiveBuff): void {
    if (!this._buffs.has(entityId)) this._buffs.set(entityId, []);
    const arr = this._buffs.get(entityId)!;
    const idx = arr.findIndex(b => b.sourceId === buff.sourceId);
    if (idx >= 0) arr[idx] = buff;
    else arr.push(buff);
  }

  removeSource(entityId: string, sourceId: string): void {
    const arr = this._buffs.get(entityId);
    if (!arr) return;
    const next = arr.filter(b => b.sourceId !== sourceId);
    if (next.length) this._buffs.set(entityId, next);
    else this._buffs.delete(entityId);
  }

  clearEntity(entityId: string): void {
    this._buffs.delete(entityId);
  }

  getEffective(entityId: string): BaseStatModifiers {
    const arr = this._buffs.get(entityId);
    if (!arr?.length) return defaultBaseStatModifiers();
    return arr.reduce(
      (acc, b) => combineStatMods(acc, { ...defaultBaseStatModifiers(), ...b.mods }),
      defaultBaseStatModifiers(),
    );
  }

  tick(_dtMs: number): void {
    const now = performance.now();
    for (const [entityId, arr] of this._buffs) {
      const kept = arr.filter(b => b.durationMs === null || now - b.appliedAt < b.durationMs);
      if (kept.length) this._buffs.set(entityId, kept);
      else this._buffs.delete(entityId);
    }
  }

  clear(): void {
    this._buffs.clear();
  }
}

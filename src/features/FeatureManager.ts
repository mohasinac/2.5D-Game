import type { SceneContext } from './IArenaFeature';

/**
 * Abstract generic manager for arena features.
 *
 * Design patterns applied
 * ────────────────────────
 * • Template Method  — defines the add/remove/clear/restore algorithm;
 *   concrete subclasses fill in buildGeometry, disposeOne, toSave, fromSave.
 * • Factory Method   — each concrete subclass provides an add() method that
 *   calls the protected _insert() helper after creating domain-specific defaults.
 * • Open / Closed    — new feature types extend this class without touching it.
 * • Single Responsibility — manages one feature collection; no UI/rendering logic.
 *
 * Generic parameters
 * ──────────────────
 * TData — the runtime data interface (e.g. ObstacleData).
 *         Must have at minimum { id: string; name: string }.
 * TSave — the serialisable save interface (e.g. ObstacleSave).
 *         Must have at minimum { id: string }.
 */
export abstract class FeatureManager<
  TData extends { id: string; name: string },
  TSave extends { id: string },
> {
  /** Live feature store. Keyed by feature id. */
  protected readonly items = new Map<string, TData>();

  /** Monotonically increasing counter; never reset to 0 mid-session. */
  protected seq = 0;

  /**
   * @param ctx       Scene dependency-injection context.
   * @param idPrefix  Short prefix used to build unique IDs (e.g. 'obs').
   * @param labelBase Human-readable noun used for auto-generated names (e.g. 'Obstacle').
   */
  constructor(
    protected readonly ctx: SceneContext,
    protected readonly idPrefix: string,
    protected readonly labelBase: string,
  ) {}

  // ── Template Method hooks (must be implemented by subclasses) ────────────

  /**
   * Build Three.js geometry for the feature and add it to the scene.
   * Called by _insert() when a feature is added, and by restore() when
   * loading a save file.  The data object is already in this.items when
   * this runs.
   */
  protected abstract buildGeometry(data: TData): void;

  /**
   * Remove the feature's geometry from the scene and dispose GPU resources.
   * The item is removed from this.items immediately after this call.
   * Do NOT call sceneTree.remove() here — remove() handles that.
   */
  protected abstract disposeOne(data: TData): void;

  /** Serialise a single item to its save format. */
  abstract toSave(data: TData): TSave;

  /**
   * Deserialise a save entry back into a runtime data object.
   * Mesh / edges / other runtime-only refs must be null/undefined.
   * buildGeometry() will be called after this to reconstruct geometry.
   */
  abstract fromSave(save: TSave): TData;

  // ── ID / label helpers ───────────────────────────────────────────────────

  protected nextId(): string    { return `${this.idPrefix}-${++this.seq}`; }
  protected nextLabel(): string { return `${this.labelBase} ${this.seq}`;  }

  // ── Read helpers ─────────────────────────────────────────────────────────

  get(id: string): TData | undefined           { return this.items.get(id); }
  getAll(): ReadonlyMap<string, TData>         { return this.items; }
  has(id: string): boolean                     { return this.items.has(id); }
  getSeq(): number                             { return this.seq; }
  /** Restore the sequence counter from a saved value (used during load). */
  restoreSeq(n: number): void                 { this.seq = Math.max(this.seq, n); }

  // ── Protected factory helper ─────────────────────────────────────────────

  /**
   * Store the data, build its geometry, and register a scene-tree node.
   * Subclasses call this at the end of their public add() / addToX() methods.
   *
   * @param data         Fully initialised data object (no geometry yet).
   * @param treeIcon     Icon character for the scene-tree node.
   * @param treeParentId Scene-tree parent node ID (or null for root).
   * @param treeOpts     Extra scene-tree node options (add-child buttons, etc.).
   */
  protected _insert(
    data: TData,
    treeIcon: string,
    treeParentId: string | null,
    treeOpts?: Record<string, unknown>,
  ): TData {
    this.items.set(data.id, data);
    this.buildGeometry(data);
    this.ctx.sceneTree.add(data.id, data.name, treeIcon, treeParentId, treeOpts as never);
    return data;
  }

  // ── Concrete CRUD ────────────────────────────────────────────────────────

  /**
   * Remove a feature by id.
   * Disposes geometry, removes from store, removes tree node.
   * Returns true if found and removed, false if not found.
   */
  remove(id: string): boolean {
    const data = this.items.get(id);
    if (!data) return false;
    this.ctx.untrackObjects(id);
    this.disposeOne(data);
    this.items.delete(id);
    this.ctx.sceneTree.remove(id);
    return true;
  }

  /**
   * Clear ALL features in this manager.
   * Used during scene reset.  Does NOT reset the sequence counter —
   * caller must call restoreSeq(0) explicitly if a hard reset is desired.
   */
  clear(): void {
    for (const data of this.items.values()) {
      this.ctx.untrackObjects(data.id);
      this.disposeOne(data);
    }
    this.items.clear();
    this.seq = 0;
  }

  /**
   * Serialise all items (optionally filtered).
   */
  serializeAll(filter?: (d: TData) => boolean): TSave[] {
    const result: TSave[] = [];
    for (const d of this.items.values()) {
      if (!filter || filter(d)) result.push(this.toSave(d));
    }
    return result;
  }

  /**
   * Restore from an array of saves without touching the scene tree.
   * Used by the internal load helpers in ArenaSandbox that control
   * tree-node ordering themselves.
   *
   * After this call, items are stored but have NO geometry yet.
   * Callers must call buildGeometry(data) + sceneTree.add() per item
   * (or use restoreAndBuild for a simpler one-liner).
   */
  restoreData(saves: TSave[]): void {
    for (const save of saves) {
      const data = this.fromSave(save);
      this.items.set(data.id, data);
      // Advance seq so nextId() won't collide
      const n = parseInt(data.id.split('-').pop() ?? '0', 10);
      if (!Number.isNaN(n) && n > this.seq) this.seq = n;
    }
  }
}

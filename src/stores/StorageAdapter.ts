/* ══════════════════════════════════════════════════════════════════════════
   PHASE 12 — THE STORAGE SEAM

   The corpus already assumes this: CS12 Case 615 describes `ComboTask`
   records living in a Firestore `combo_effects` collection and compiled to
   engine `BehaviorRef[]`. Firestore was always the intended home for authored
   content; today everything is localStorage.

   This is the seam, and ONLY the seam. No Firebase SDK import, no network
   call, no emulator — the app currently makes zero network requests of any
   kind and that property is worth keeping until the emulator is actually
   running. A `FirestoreAdapter` slots in behind this interface later without
   touching a single store.

   WHAT MOVES AND WHAT DOES NOT. Shared CONTENT moves — arena presets, bey
   presets, parsed special moves, combo tasks, match history. The arena
   EDITOR's working state stays local: it is per-session scratch, not content,
   and round-tripping it through a network would make the editor feel worse
   for no benefit.
   ══════════════════════════════════════════════════════════════════════════ */

/** A collection of documents keyed by id. Deliberately minimal. */
export interface StorageAdapter {
  readonly name: string;
  /** Read one document, or null. */
  get<T>(collection: string, id: string): Promise<T | null>;
  /** Read a whole collection. */
  list<T>(collection: string): Promise<T[]>;
  /** Create or replace one document. */
  put<T>(collection: string, id: string, value: T): Promise<void>;
  /** Remove one document. Absent ids are not an error. */
  remove(collection: string, id: string): Promise<void>;
  /** True when writes will survive a reload. */
  readonly durable: boolean;
}

/**
 * The collections the project actually uses, named once.
 *
 * A const rather than free strings so a typo is a compile error instead of a
 * silently empty collection — the failure mode that is hardest to notice,
 * because an empty list looks exactly like "nothing saved yet".
 */
export const COLLECTIONS = {
  arenas:        'arenas',
  beys:          'beys',
  specialMoves:  'special_moves',
  /** CS12 Case 615 names this collection explicitly. */
  comboEffects:  'combo_effects',
  matches:       'matches',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

/**
 * The default adapter: the browser's own storage, behind the new interface.
 *
 * Goes through `localStorage` directly, which the project otherwise BANS
 * outside `src/stores/`. That ban exists so persistence cannot leak into
 * feature code; this file is in `src/stores/` and is the sanctioned place for
 * it, which is the whole point of putting the adapter here.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name = 'localStorage';
  readonly durable = true;

  constructor(private readonly prefix = 'bey_db_') {}

  private key(collection: string, id: string): string {
    return `${this.prefix}${collection}__${id}`;
  }

  private indexKey(collection: string): string {
    return `${this.prefix}${collection}__index`;
  }

  private readIndex(collection: string): string[] {
    try {
      const raw = localStorage.getItem(this.indexKey(collection));
      return raw ? JSON.parse(raw) as string[] : [];
    } catch { return []; }
  }

  private writeIndex(collection: string, ids: string[]): void {
    localStorage.setItem(this.indexKey(collection), JSON.stringify(ids));
  }

  async get<T>(collection: string, id: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(this.key(collection, id));
      return raw ? JSON.parse(raw) as T : null;
    } catch { return null; }
  }

  async list<T>(collection: string): Promise<T[]> {
    const out: T[] = [];
    for (const id of this.readIndex(collection)) {
      const v = await this.get<T>(collection, id);
      if (v !== null) out.push(v);
    }
    return out;
  }

  async put<T>(collection: string, id: string, value: T): Promise<void> {
    localStorage.setItem(this.key(collection, id), JSON.stringify(value));
    const ids = this.readIndex(collection);
    if (!ids.includes(id)) { ids.push(id); this.writeIndex(collection, ids); }
  }

  async remove(collection: string, id: string): Promise<void> {
    localStorage.removeItem(this.key(collection, id));
    this.writeIndex(collection, this.readIndex(collection).filter(x => x !== id));
  }
}

/**
 * In-memory adapter, for tests and for the offline path.
 *
 * `durable: false` is load-bearing information, not a detail: a caller that
 * needs to warn "this will not be saved" can ask rather than guess.
 */
export class MemoryStorageAdapter implements StorageAdapter {
  readonly name = 'memory';
  readonly durable = false;
  private data = new Map<string, Map<string, unknown>>();

  private col(c: string): Map<string, unknown> {
    let m = this.data.get(c);
    if (!m) { m = new Map(); this.data.set(c, m); }
    return m;
  }

  async get<T>(collection: string, id: string): Promise<T | null> {
    return (this.col(collection).get(id) as T) ?? null;
  }
  async list<T>(collection: string): Promise<T[]> {
    return [...this.col(collection).values()] as T[];
  }
  async put<T>(collection: string, id: string, value: T): Promise<void> {
    this.col(collection).set(id, value);
  }
  async remove(collection: string, id: string): Promise<void> {
    this.col(collection).delete(id);
  }
}

/** The adapter the app uses. Swapped for a Firestore one when it exists. */
let active: StorageAdapter = new LocalStorageAdapter();

export function setStorageAdapter(a: StorageAdapter): void { active = a; }
export function storage(): StorageAdapter { return active; }

// serverDataCache.ts
// In-process cache for Firestore data that is read on every room creation.
// Call `warmServerCache()` once at server startup. Each loader checks the cache
// before hitting Firestore, so concurrent room creates never produce duplicate reads.

import { getFirestoreDb } from "./firebase";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import { CLASSIC_2D_COLLECTIONS, SHARED_COLLECTIONS, COLLECTIONS } from "../constants/collections";

// ── TTLs ─────────────────────────────────────────────────────────────────────

const ARENA_TTL_MS    = 30 * 60 * 1000; //  30 min
const BEYBLADE_TTL_MS = 30 * 60 * 1000; //  30 min
const COMBO_TTL_MS    = 60 * 60 * 1000; //  60 min
const MOVE_TTL_MS     = 60 * 60 * 1000; //  60 min
const SETTINGS_TTL_MS = 10 * 60 * 1000; //  10 min

// ── Per-document caches ───────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

const arenaCache    = new Map<string, CacheEntry<ArenaConfig>>();
const beybladeCache = new Map<string, CacheEntry<BeybladeStats>>();

// ── Collection-level caches (bulk pre-load) ───────────────────────────────────

let allArenasCache:     { data: ArenaConfig[];    fetchedAt: number } | null = null;
let allBeybladesCache:  { data: BeybladeStats[];  fetchedAt: number } | null = null;
let comboEffectsCache:  { data: Record<string, unknown>[]; fetchedAt: number } | null = null;
let specialMovesCache:  { data: Record<string, unknown>[]; fetchedAt: number } | null = null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isFresh(fetchedAt: number, ttlMs: number): boolean {
  return Date.now() - fetchedAt < ttlMs;
}

// ── Per-document loaders (called per room create) ─────────────────────────────

/**
 * Load a single arena by id, serving from cache if fresh.
 * Falls back to null on timeout / missing doc — callers must handle null.
 */
export async function getCachedArena(arenaId: string): Promise<ArenaConfig | null> {
  const entry = arenaCache.get(arenaId);
  if (entry && isFresh(entry.fetchedAt, ARENA_TTL_MS)) return entry.data;

  // Try bulk cache first — avoids a per-doc read if we already fetched all arenas
  if (allArenasCache && isFresh(allArenasCache.fetchedAt, ARENA_TTL_MS)) {
    const found = allArenasCache.data.find(a => (a as unknown as { id?: string }).id === arenaId);
    if (found) {
      arenaCache.set(arenaId, { data: found, fetchedAt: Date.now() });
      return found;
    }
    return null;
  }

  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const doc = await Promise.race([
      db.collection(CLASSIC_2D_COLLECTIONS.ARENAS).doc(arenaId).get(),
      new Promise<null>((_, rej) => setTimeout(() => rej(new Error("timeout")), 5_000)),
    ]);
    if (!doc || !(doc as FirebaseFirestore.DocumentSnapshot).exists) return null;
    const data = (doc as FirebaseFirestore.DocumentSnapshot).data() as ArenaConfig;
    arenaCache.set(arenaId, { data, fetchedAt: Date.now() });
    return data;
  } catch {
    return null;
  }
}

/**
 * Load a single beyblade_stats doc by id, serving from cache if fresh.
 */
export async function getCachedBeyblade(beybladeId: string): Promise<BeybladeStats | null> {
  const entry = beybladeCache.get(beybladeId);
  if (entry && isFresh(entry.fetchedAt, BEYBLADE_TTL_MS)) return entry.data;

  if (allBeybladesCache && isFresh(allBeybladesCache.fetchedAt, BEYBLADE_TTL_MS)) {
    const found = allBeybladesCache.data.find(b => (b as unknown as { id?: string }).id === beybladeId);
    if (found) {
      beybladeCache.set(beybladeId, { data: found, fetchedAt: Date.now() });
      return found;
    }
    return null;
  }

  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const doc = await Promise.race([
      db.collection(CLASSIC_2D_COLLECTIONS.BEYBLADE_STATS).doc(beybladeId).get(),
      new Promise<null>((_, rej) => setTimeout(() => rej(new Error("timeout")), 5_000)),
    ]);
    if (!doc || !(doc as FirebaseFirestore.DocumentSnapshot).exists) return null;
    const data = (doc as FirebaseFirestore.DocumentSnapshot).data() as BeybladeStats;
    beybladeCache.set(beybladeId, { data, fetchedAt: Date.now() });
    return data;
  } catch {
    return null;
  }
}

// ── Bulk pre-loaders ──────────────────────────────────────────────────────────

async function preloadArenas(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  if (allArenasCache && isFresh(allArenasCache.fetchedAt, ARENA_TTL_MS)) return;
  try {
    const snap = await db.collection(CLASSIC_2D_COLLECTIONS.ARENAS).get();
    const data: ArenaConfig[] = [];
    snap.forEach(doc => data.push({ ...(doc.data() as ArenaConfig), id: doc.id } as ArenaConfig));
    allArenasCache = { data, fetchedAt: Date.now() };
    // Populate per-doc cache
    data.forEach(a => {
      const id = (a as unknown as { id?: string }).id;
      if (id) arenaCache.set(id, { data: a, fetchedAt: Date.now() });
    });
    console.log(`[serverDataCache] Loaded ${data.length} arenas`);
  } catch (err) {
    console.warn("[serverDataCache] Could not preload arenas:", err);
  }
}

async function preloadBeyblades(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  if (allBeybladesCache && isFresh(allBeybladesCache.fetchedAt, BEYBLADE_TTL_MS)) return;
  try {
    const snap = await db.collection(CLASSIC_2D_COLLECTIONS.BEYBLADE_STATS).get();
    const data: BeybladeStats[] = [];
    snap.forEach(doc => data.push({ ...(doc.data() as BeybladeStats), id: doc.id } as BeybladeStats));
    allBeybladesCache = { data, fetchedAt: Date.now() };
    data.forEach(b => {
      const id = (b as unknown as { id?: string }).id;
      if (id) beybladeCache.set(id, { data: b, fetchedAt: Date.now() });
    });
    console.log(`[serverDataCache] Loaded ${data.length} beyblade stats`);
  } catch (err) {
    console.warn("[serverDataCache] Could not preload beyblades:", err);
  }
}

async function preloadComboEffects(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  if (comboEffectsCache && isFresh(comboEffectsCache.fetchedAt, COMBO_TTL_MS)) return;
  try {
    const snap = await db.collection(SHARED_COLLECTIONS.COMBO_EFFECTS as string).get();
    const data: Record<string, unknown>[] = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    comboEffectsCache = { data, fetchedAt: Date.now() };
    console.log(`[serverDataCache] Loaded ${data.length} combo effects`);
  } catch (err) {
    console.warn("[serverDataCache] Could not preload combo effects:", err);
  }
}

async function preloadSpecialMoves(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  if (specialMovesCache && isFresh(specialMovesCache.fetchedAt, MOVE_TTL_MS)) return;
  try {
    const snap = await db.collection(SHARED_COLLECTIONS.SPECIAL_MOVES).get();
    const data: Record<string, unknown>[] = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    specialMovesCache = { data, fetchedAt: Date.now() };
    console.log(`[serverDataCache] Loaded ${data.length} special moves`);
  } catch (err) {
    console.warn("[serverDataCache] Could not preload special moves:", err);
  }
}

// ── Public accessors for cached combo effects and special moves ───────────────

export function getCachedComboEffects(): Record<string, unknown>[] {
  return comboEffectsCache?.data ?? [];
}

export function getCachedSpecialMoves(): Record<string, unknown>[] {
  return specialMovesCache?.data ?? [];
}

export function getCachedAllArenas(): ArenaConfig[] {
  return allArenasCache?.data ?? [];
}

export function getCachedAllBeyblades(): BeybladeStats[] {
  return allBeybladesCache?.data ?? [];
}

// ── Cache invalidation (admin save → call these) ──────────────────────────────

export function invalidateArenaCache(arenaId?: string): void {
  if (arenaId) {
    arenaCache.delete(arenaId);
  } else {
    arenaCache.clear();
    allArenasCache = null;
  }
}

export function invalidateBeybladeCache(beybladeId?: string): void {
  if (beybladeId) {
    beybladeCache.delete(beybladeId);
  } else {
    beybladeCache.clear();
    allBeybladesCache = null;
  }
}

export function invalidateComboCache(): void { comboEffectsCache = null; }
export function invalidateSpecialMoveCache(): void { specialMovesCache = null; }

// ── Startup warm-up ───────────────────────────────────────────────────────────

let _warmed = false;

/**
 * Pre-loads all arenas, beyblades, combo effects, and special moves into memory.
 * Call once from server/index.ts after Firebase Admin is initialized.
 * Subsequent calls are no-ops while caches are fresh.
 */
export async function warmServerCache(): Promise<void> {
  if (_warmed) return;
  _warmed = true;
  console.log("[serverDataCache] Warming server data cache...");
  await Promise.allSettled([
    preloadArenas(),
    preloadBeyblades(),
    preloadComboEffects(),
    preloadSpecialMoves(),
  ]);
  console.log("[serverDataCache] Server cache warm-up complete.");

  // Schedule periodic refresh every 25 minutes (before TTLs expire)
  setInterval(async () => {
    console.log("[serverDataCache] Refreshing server data cache...");
    _warmed = false; // reset flag so next warmServerCache() re-fetches
    allArenasCache   = null;
    allBeybladesCache= null;
    comboEffectsCache= null;
    specialMovesCache= null;
    _warmed = true;
    await Promise.allSettled([
      preloadArenas(),
      preloadBeyblades(),
      preloadComboEffects(),
      preloadSpecialMoves(),
    ]);
    console.log("[serverDataCache] Server cache refresh complete.");
  }, 25 * 60 * 1000);
}

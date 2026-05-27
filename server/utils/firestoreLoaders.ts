import { getFirestoreDb } from "./firebase";
import { COLLECTIONS } from "../constants/collections";
import type { GimmickDef } from "./gimmickExpander";
import { loadGimmickSynergies, type GimmickSynergyDef } from "../physics/MechanicRegistry";

let _gimmickDefsCache: Record<string, GimmickDef> | null = null;

export async function loadGimmickDefs(): Promise<Record<string, GimmickDef>> {
  if (_gimmickDefsCache) return _gimmickDefsCache;
  const db = getFirestoreDb();
  if (!db) return {};
  const snap = await db.collection(COLLECTIONS.GIMMICK_DEFS).get();
  _gimmickDefsCache = {};
  snap.forEach(doc => {
    _gimmickDefsCache![doc.id] = { id: doc.id, ...doc.data() } as GimmickDef;
  });
  return _gimmickDefsCache;
}

// ── Bey Accessories ──────────────────────────────────────────────────────────

export interface BeyAccessoryDef {
  id: string;
  name: string;
  description?: string;
  iconEmoji?: string;
  effectType: "passive_stat" | "on_proc" | "on_burst" | "on_contact";
  /** Stat modifiers applied at match start (field → delta). */
  statModifiers?: Record<string, number>;
  /** Proc chance 0–1 (for on_proc effects). */
  procChance?: number;
  /** Proc effect description (for on_proc). */
  procEffect?: string;
}

let _beyAccessoriesCache: Record<string, BeyAccessoryDef> | null = null;

export async function loadBeyAccessories(): Promise<Record<string, BeyAccessoryDef>> {
  if (_beyAccessoriesCache) return _beyAccessoriesCache;
  const db = getFirestoreDb();
  if (!db) return {};
  try {
    const snap = await db.collection(COLLECTIONS.BEY_ACCESSORIES).get();
    _beyAccessoriesCache = {};
    snap.forEach(doc => {
      _beyAccessoriesCache![doc.id] = { id: doc.id, ...doc.data() } as BeyAccessoryDef;
    });
  } catch (err) {
    console.warn("[firestoreLoaders] Could not load bey_accessories:", err);
    _beyAccessoriesCache = {};
  }
  return _beyAccessoriesCache;
}

/** Load gimmick × part material synergies from Firestore into the global registry. */
export async function initGimmickSynergies(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const snap = await db.collection(COLLECTIONS.GIMMICK_SYNERGIES).get();
    const synergies: GimmickSynergyDef[] = [];
    snap.forEach(doc => {
      synergies.push({ id: doc.id, ...doc.data() } as GimmickSynergyDef & { id: string });
    });
    loadGimmickSynergies(synergies);
    console.log(`✅ Loaded ${synergies.length} gimmick synergies`);
  } catch (err) {
    console.warn("[firestoreLoaders] Could not load gimmick_synergies:", err);
  }
}

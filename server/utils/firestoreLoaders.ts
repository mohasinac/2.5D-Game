import { getFirestoreDb } from "./firebase";
import { COLLECTIONS } from "../constants/collections";
import type { GimmickDef } from "./gimmickExpander";

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

import * as admin from "firebase-admin";
import { TYPE_MATRIX, ZONE_IMMUNITIES } from "../../shared/types/elementTypes";

export interface LoadedTypeMatrix {
  matrix: Record<string, Record<string, number>>;
  zoneImmunities: Record<string, string[]>;
}

// 5-minute module-level TTL cache — type edits are rare, server restart always clears
let _cache: { data: LoadedTypeMatrix; ts: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function loadElementTypeMatrix(
  db: admin.firestore.Firestore,
): Promise<LoadedTypeMatrix> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL_MS) return _cache.data;

  try {
    const snap = await db.collection("element_type_configs").get();
    if (snap.empty) throw new Error("element_type_configs is empty — run npm run seed:element-types");

    const matrix: Record<string, Record<string, number>> = {};
    const zoneImmunities: Record<string, string[]> = {};

    for (const d of snap.docs) {
      const data = d.data();
      if (data.attackAdvantages && typeof data.attackAdvantages === "object") {
        matrix[d.id] = data.attackAdvantages as Record<string, number>;
      }
      if (Array.isArray(data.zoneImmunities) && data.zoneImmunities.length > 0) {
        zoneImmunities[d.id] = data.zoneImmunities;
      }
    }

    _cache = { data: { matrix, zoneImmunities }, ts: Date.now() };
    return _cache.data;
  } catch (e) {
    console.warn("⚠️  Could not load element_type_configs from Firestore — using hardcoded matrix.", (e as Error).message);
    const fallback: LoadedTypeMatrix = {
      matrix: TYPE_MATRIX as Record<string, Record<string, number>>,
      zoneImmunities: Object.fromEntries(
        Object.entries(ZONE_IMMUNITIES).map(([k, v]) => [k, v ?? []]),
      ) as Record<string, string[]>,
    };
    // Cache the fallback briefly (30s) so we don't hammer Firestore on repeated failures
    _cache = { data: fallback, ts: Date.now() - CACHE_TTL_MS + 30_000 };
    return fallback;
  }
}

export function invalidateElementTypeMatrixCache() {
  _cache = null;
}

// Compute the type advantage multiplier from a dynamic matrix.
// Dual-type attacker: use the BEST (highest) matchup.
// Dual-type defender: MULTIPLY both resistances.
export function computeDynamicTypeMultiplier(
  matrix: Record<string, Record<string, number>>,
  attackerTypes: string[],
  defenderTypes: string[],
): number {
  if (attackerTypes.length === 0 || defenderTypes.length === 0) return 1.0;

  let result = 1.0;
  for (const def of defenderTypes) {
    // Best attacker matchup against this defender
    let best = 0;
    for (const att of attackerTypes) {
      const val = matrix[att]?.[def] ?? 1.0;
      if (val > best) best = val;
    }
    result *= best === 0 ? 1.0 : best;
  }
  return result;
}

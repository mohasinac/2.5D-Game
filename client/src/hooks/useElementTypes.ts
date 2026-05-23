import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { ElementTypeConfig } from "@/types/elementTypeConfig";

export type { ElementTypeConfig };

export function buildMatrixFromConfigs(
  configs: ElementTypeConfig[],
): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const c of configs) {
    matrix[c.id] = { ...c.attackAdvantages };
  }
  return matrix;
}

interface UseElementTypesResult {
  configs: ElementTypeConfig[];
  loading: boolean;
  error: string | null;
  matrixBySlug: Record<string, Record<string, number>>;
  refresh: () => void;
}

// Module-level cache with 60s TTL
let _cache: { configs: ElementTypeConfig[]; ts: number } | null = null;
const CACHE_TTL = 60_000;

export function useElementTypes(): UseElementTypesResult {
  const [configs, setConfigs] = useState<ElementTypeConfig[]>(_cache?.configs ?? []);
  const [loading, setLoading] = useState(!_cache || Date.now() - _cache.ts > CACHE_TTL);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (!force && _cache && Date.now() - _cache.ts < CACHE_TTL) {
      setConfigs(_cache.configs);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ELEMENT_TYPE_CONFIGS));
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as ElementTypeConfig));
      // Sort: defaults first, then alphabetical by name
      loaded.sort((a, b) => {
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      _cache = { configs: loaded, ts: Date.now() };
      setConfigs(loaded);
    } catch (e) {
      setError("Failed to load element types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(() => {
    _cache = null;
    load(true);
  }, [load]);

  return {
    configs,
    loading,
    error,
    matrixBySlug: buildMatrixFromConfigs(configs),
    refresh,
  };
}

export function invalidateElementTypesCache() {
  _cache = null;
}

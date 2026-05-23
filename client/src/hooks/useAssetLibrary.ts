import { useEffect } from "react";
import { useGameDataStore, type AssetDoc } from "@/stores/gameDataStore";

export type { AssetDoc };

export function useAssetLibrary(collectionName: string, tag?: string) {
  const key = tag ? `${collectionName}:${tag}` : collectionName;
  const assets = useGameDataStore(s => s.assets[key] ?? []);
  const loaded = useGameDataStore(s => s.assetsLoaded[key] ?? false);
  const loading = useGameDataStore(s => s.loading[key] ?? false);
  const error = useGameDataStore(s => s.errors[key] ?? null);
  const fetch = useGameDataStore(s => s.fetchAssets);

  useEffect(() => { fetch(collectionName, tag); }, [fetch, collectionName, tag]);

  return { assets, loaded, loading, error };
}

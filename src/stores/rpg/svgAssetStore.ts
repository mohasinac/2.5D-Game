import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SvgAssetState {
  assets:      Record<string, string>;
  setAsset:    (id: string, data: string) => void;
  removeAsset: (id: string) => void;
  getAsset:    (id: string) => string | null;
  getAllAssets: () => Record<string, string>;
  clear:       () => void;
}

export const svgAssetStore = createStore<SvgAssetState>()(
  persist(
    (set, get) => ({
      assets:      {},
      setAsset:    (id, data)  => set((s) => ({ assets: { ...s.assets, [id]: data } })),
      removeAsset: (id)        => set((s) => {
        const next = { ...s.assets };
        delete next[id];
        return { assets: next };
      }),
      getAsset:    (id)        => get().assets[id] ?? null,
      getAllAssets: ()          => get().assets,
      clear:       ()          => set({ assets: {} }),
    }),
    {
      name:    'rpg_assets_v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

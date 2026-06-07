import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BeybladeBuildConfig } from '../types/beybladeTypes';

const BEY_SAVE_VERSION = 2;

interface BeybladeConfigState {
  config: BeybladeBuildConfig | null;
  save:    (cfg: BeybladeBuildConfig) => void;
  load:    () => BeybladeBuildConfig | null;
  discard: () => void;
}

export type BeybladeConfigStore = ReturnType<typeof createBeybladeConfigStore>;

export function createBeybladeConfigStore(storageKey: string) {
  return createStore<BeybladeConfigState>()(
    persist(
      (set, get) => ({
        config:  null,
        save:    (cfg) => set({ config: { ...cfg, v: BEY_SAVE_VERSION } }),
        load:    () => get().config,
        discard: () => set({ config: null }),
      }),
      {
        name:    storageKey,
        storage: createJSONStorage(() => localStorage),
        version: BEY_SAVE_VERSION,
        migrate: () => ({ config: null } as BeybladeConfigState),
      },
    ),
  );
}

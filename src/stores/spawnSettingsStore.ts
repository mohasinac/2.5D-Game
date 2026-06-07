import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SpawnSettings {
  spawnX: number; spawnY: number; spawnZ: number;
  velX:   number; velY:   number; velZ:   number;
  tiltDeg:    number;
  rpm:        number;
  followCam:  boolean;
  selfRotate: boolean;
  autoMove:   boolean;
}

function defaultSettings(): SpawnSettings {
  return {
    spawnX: 0, spawnY: 0, spawnZ: 0,
    velX:   0, velY:   0, velZ:   0,
    tiltDeg: 0, rpm: 0,
    followCam: false, selfRotate: false, autoMove: false,
  };
}

interface SpawnSettingsState {
  settings: SpawnSettings;
  save:    (s: SpawnSettings) => void;
  load:    () => SpawnSettings;
  discard: () => void;
}

export const spawnSettingsStore = createStore<SpawnSettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings(),
      save:    (s) => set({ settings: s }),
      load:    () => get().settings,
      discard: () => set({ settings: defaultSettings() }),
    }),
    {
      name:    'bey_spawn_manager_settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RpgSettingsState {
  settings: Record<string, unknown> | null;
  save:     (s: Record<string, unknown>) => void;
  load:     () => Record<string, unknown> | null;
  discard:  () => void;
}

export const rpgSettingsStore = createStore<RpgSettingsState>()(
  persist(
    (set, get) => ({
      settings: null,
      save:     (s)  => set({ settings: s }),
      load:     ()   => get().settings,
      discard:  ()   => set({ settings: null }),
    }),
    {
      name:    'rpg_settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

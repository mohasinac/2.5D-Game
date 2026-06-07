import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ArenaPreset } from '../types/presetTypes';

interface ArenaPresetsState {
  presets: ArenaPreset[];
  list:    () => ArenaPreset[];
  save:    (preset: ArenaPreset) => void;
  remove:  (id: string) => void;
  update:  (id: string, patch: Partial<ArenaPreset>) => void;
}

function upsert(arr: ArenaPreset[], item: ArenaPreset): ArenaPreset[] {
  const i = arr.findIndex(x => x.id === item.id);
  const next = [...arr];
  if (i >= 0) next[i] = item; else next.push(item);
  return next;
}

export const arenaPresetsStore = createStore<ArenaPresetsState>()(
  persist(
    (set, get) => ({
      presets: [],
      list:    () => get().presets,
      save:    (preset) => set((st) => ({ presets: upsert(st.presets, preset) })),
      remove:  (id)     => set((st) => ({ presets: st.presets.filter(p => p.id !== id) })),
      update:  (id, patch) => set((st) => ({
        presets: st.presets.map(p => p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p),
      })),
    }),
    {
      name:    'bey_arena_presets',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

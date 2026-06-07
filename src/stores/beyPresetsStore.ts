import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BeyPreset } from '../types/presetTypes';

interface BeyPresetsState {
  presets: BeyPreset[];
  list:    () => BeyPreset[];
  save:    (preset: BeyPreset) => void;
  remove:  (id: string) => void;
  update:  (id: string, patch: Partial<BeyPreset>) => void;
}

function upsert(arr: BeyPreset[], item: BeyPreset): BeyPreset[] {
  const i = arr.findIndex(x => x.id === item.id);
  const next = [...arr];
  if (i >= 0) next[i] = item; else next.push(item);
  return next;
}

export const beyPresetsStore = createStore<BeyPresetsState>()(
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
      name:    'bey_bey_presets',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

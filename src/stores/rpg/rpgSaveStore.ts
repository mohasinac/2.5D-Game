import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RpgSaveState {
  slotBlobs:  Record<number, string | null>;
  setSlot:    (idx: number, blob: string) => void;
  deleteSlot: (idx: number) => void;
  getSlot:    (idx: number) => string | null;
}

export const rpgSaveStore = createStore<RpgSaveState>()(
  persist(
    (set, get) => ({
      slotBlobs:  {},
      setSlot:    (idx, blob)  => set((s) => ({ slotBlobs: { ...s.slotBlobs, [idx]: blob } })),
      deleteSlot: (idx)        => set((s) => {
        const next = { ...s.slotBlobs };
        delete next[idx];
        return { slotBlobs: next };
      }),
      getSlot:    (idx)        => get().slotBlobs[idx] ?? null,
    }),
    {
      name:    'rpg_saves',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

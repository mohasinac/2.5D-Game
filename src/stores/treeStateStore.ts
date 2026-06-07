import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TreeStateState {
  expandedIds: Set<string>;
  setExpanded: (id: string, expanded: boolean) => void;
  isExpanded:  (id: string) => boolean;
  clear:       () => void;
}

export type TreeStateStore = ReturnType<typeof createTreeStateStore>;

export function createTreeStateStore(storageKey: string) {
  return createStore<TreeStateState>()(
    persist(
      (set, get) => ({
        expandedIds: new Set<string>(),
        setExpanded: (id, expanded) => set((st) => {
          const next = new Set(st.expandedIds);
          if (expanded) next.add(id); else next.delete(id);
          return { expandedIds: next };
        }),
        isExpanded: (id) => get().expandedIds.has(id),
        clear:      () => set({ expandedIds: new Set() }),
      }),
      {
        name:    storageKey,
        storage: createJSONStorage(() => localStorage),
        // Serialize Set as string[] for JSON storage
        partialize: (s) => ({ expandedIds: [...s.expandedIds] }),
        merge: (persisted, current) => {
          const p = persisted as { expandedIds?: unknown };
          return {
            ...current,
            expandedIds: Array.isArray(p.expandedIds)
              ? new Set<string>(p.expandedIds as string[])
              : new Set<string>(),
          };
        },
      },
    ),
  );
}

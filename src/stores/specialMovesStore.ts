import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SpecialMoveSave } from '../types/specialMoveTypes';

/* ══════════════════════════════════════════════════════════════════════════
   SPECIAL MOVES — off raw localStorage at last.

   CLAUDE.md lists this as debt in two places: "`SM_STORAGE_KEY =
   'bey_special_moves'` uses raw `localStorage`, violating the Zustand-only
   rule" and "Three things bypass Zustand". `SpecialMoveSandbox` read and
   wrote the key directly with its own try/catch around `JSON.parse`, which
   is exactly the pattern the banned-patterns list names:
   "`localStorage.setItem/getItem/removeItem` outside `src/stores/`".

   SAME KEY, deliberately. The data shape is unchanged — an array of
   `SpecialMoveSave` — so this is a move, not a migration, and the project's
   no-backward-compatibility rule stays satisfied: there is no version shim
   here because nothing needs converting.

   WHY IT MATTERS BEYOND TIDINESS. The hand-rolled version silently swallowed
   every failure, so a quota error or a malformed blob looked identical to
   "no moves authored yet". Zustand's `persist` owns the serialisation, the
   versioning and the error path, which is the whole reason the rule exists.
   ══════════════════════════════════════════════════════════════════════════ */

interface SpecialMovesState {
  moves: SpecialMoveSave[];
  save:    (m: SpecialMoveSave[]) => void;
  load:    () => SpecialMoveSave[];
  discard: () => void;
}

export const specialMovesStore = createStore<SpecialMovesState>()(
  persist(
    (set, get) => ({
      moves:   [],
      save:    (m) => set({ moves: m }),
      load:    () => get().moves,
      discard: () => set({ moves: [] }),
    }),
    {
      name:    'bey_special_moves',
      storage: createJSONStorage(() => localStorage),
      /* No `migrate`: on a version bump Zustand discards, which is the
         project rule. Nothing here writes a shim. */
      version: 1,
    },
  ),
);

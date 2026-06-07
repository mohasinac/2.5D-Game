import { createStore } from 'zustand/vanilla';
import type { ArenaConfig } from '../utils/arenaPersistence';
import type { BeybladeBuildConfig } from '../types/beybladeTypes';

interface PendingArenaLoad {
  config: ArenaConfig;
  mode:   'replace' | 'merge';
}

interface PendingBeyLoad {
  config: BeybladeBuildConfig;
  mode:   'replace' | 'merge';
}

interface PendingLoadState {
  arenaPending: PendingArenaLoad | null;
  beyPending:   PendingBeyLoad   | null;
  setArenaPending: (p: PendingArenaLoad | null) => void;
  setBeyPending:   (p: PendingBeyLoad   | null) => void;
  takeArenaPending: () => PendingArenaLoad | null;
  takeBeyPending:   () => PendingBeyLoad   | null;
}

export const pendingLoadStore = createStore<PendingLoadState>()((set, get) => ({
  arenaPending: null,
  beyPending:   null,
  setArenaPending: (p) => set({ arenaPending: p }),
  setBeyPending:   (p) => set({ beyPending:   p }),
  takeArenaPending: () => {
    const p = get().arenaPending;
    set({ arenaPending: null });
    return p;
  },
  takeBeyPending: () => {
    const p = get().beyPending;
    set({ beyPending: null });
    return p;
  },
}));

import { createStore } from 'zustand/vanilla';

interface AdminUiState {
  activeTab:  string;
  selectedId: string | null;
  setTab:     (tab: string) => void;
  select:     (id: string | null) => void;
}

export const adminUiStore = createStore<AdminUiState>()((set) => ({
  activeTab:  '',
  selectedId: null,
  setTab:     (tab) => set({ activeTab: tab }),
  select:     (id)  => set({ selectedId: id }),
}));

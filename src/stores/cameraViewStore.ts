import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import type * as THREE from 'three';

interface CameraView {
  position: { x: number; y: number; z: number };
  target:   { x: number; y: number; z: number };
}

interface CameraViewState {
  view:  CameraView | null;
  save:  (position: THREE.Vector3, target: THREE.Vector3) => void;
  load:  () => CameraView | null;
  reset: () => void;
}

export type CameraViewStore = ReturnType<typeof createCameraViewStore>;

export function createCameraViewStore(storageKey: string) {
  return createStore<CameraViewState>()(
    persist(
      (set, get) => ({
        view:  null,
        save:  (pos, tgt) => set({
          view: {
            position: { x: pos.x, y: pos.y, z: pos.z },
            target:   { x: tgt.x, y: tgt.y, z: tgt.z },
          },
        }),
        load:  () => get().view,
        reset: () => set({ view: null }),
      }),
      {
        name:    storageKey,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
}

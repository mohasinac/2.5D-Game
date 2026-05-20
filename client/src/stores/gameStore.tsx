import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GameSettings {
  beybladeId: string | null;
  arenaId: string | null;
  gameMode: "tryout" | "single-battle" | "pvp" | "tournament" | null;
  difficulty?: "easy" | "medium" | "hard";
  opponentId?: string;
  username?: string;
  userId?: string;
  activeRoomId: string | null;
}

// ─── AES-GCM encrypted localStorage ─────────────────────────────────────────
// Key is PBKDF2-derived from a static passphrase + origin, so data is
// unreadable in DevTools without the derivation parameters.

let _cryptoKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (_cryptoKey) return _cryptoKey;
  const enc = new TextEncoder();
  const origin = typeof window !== "undefined" ? window.location.origin : "localhost";
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(`beyblade-game-v1:${origin}`),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  // Fewer iterations in test/dev so key derivation doesn't slow tests;
  // full 100k in production build.
  const iterations = import.meta.env.MODE === "test" ? 1_000 : 100_000;
  _cryptoKey = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode("bey-salt-v1"), iterations, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  return _cryptoKey;
}

async function encryptStr(plaintext: string): Promise<string> {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  const buf = new Uint8Array(12 + cipher.byteLength);
  buf.set(iv);
  buf.set(new Uint8Array(cipher), 12);
  return btoa(String.fromCharCode(...buf));
}

async function decryptStr(ciphertext: string): Promise<string> {
  const key = await getCryptoKey();
  const buf = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: buf.slice(0, 12) },
    key,
    buf.slice(12),
  );
  return new TextDecoder().decode(plain);
}

// No-op storage for the test environment — prevents async crypto calls from
// interfering with test isolation and keeps tests fast.
const noopStorage = {
  getItem: (_name: string): null => null,
  setItem: (_name: string, _value: string): void => {},
  removeItem: (_name: string): void => {},
};

const encryptedStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      return await decryptStr(raw);
    } catch {
      // Corrupted or unencrypted legacy data — discard it.
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    localStorage.setItem(name, await encryptStr(value));
  },
  removeItem: (name: string): void => localStorage.removeItem(name),
};

// ─── Default state ───────────────────────────────────────────────────────────

export const defaultSettings: GameSettings = {
  beybladeId: null,
  arenaId: null,
  gameMode: null,
  difficulty: undefined,
  opponentId: undefined,
  username: "Player",
  // Stable random ID generated once per device; persisted across reloads.
  userId: `user_${Math.random().toString(36).slice(2, 9)}`,
  activeRoomId: null,
};

// ─── Store ───────────────────────────────────────────────────────────────────

interface GameStore {
  settings: GameSettings;
  /** True once the async persist storage has been read on startup. */
  _hydrated: boolean;
  setBeyblade: (id: string) => void;
  setArena: (id: string) => void;
  setGameMode: (mode: GameSettings["gameMode"]) => void;
  setDifficulty: (d: GameSettings["difficulty"]) => void;
  setOpponent: (id: string) => void;
  setGameConfig: (config: Partial<GameSettings>) => void;
  startGame: (mode: GameSettings["gameMode"]) => void;
  resetGame: () => void;
  setActiveRoom: (roomId: string | null) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      settings: { ...defaultSettings },
      _hydrated: false,

      setBeyblade: (beybladeId) =>
        set((s) => ({ settings: { ...s.settings, beybladeId } })),

      setArena: (arenaId) =>
        set((s) => ({ settings: { ...s.settings, arenaId } })),

      setGameMode: (gameMode) =>
        set((s) => ({ settings: { ...s.settings, gameMode } })),

      setDifficulty: (difficulty) =>
        set((s) => ({ settings: { ...s.settings, difficulty } })),

      setOpponent: (opponentId) =>
        set((s) => ({ settings: { ...s.settings, opponentId } })),

      setGameConfig: (config) =>
        set((s) => ({ settings: { ...s.settings, ...config } })),

      startGame: (gameMode) =>
        set((s) => ({ settings: { ...s.settings, gameMode } })),

      resetGame: () =>
        set((s) => ({
          settings: {
            ...defaultSettings,
            userId: s.settings.userId,
            username: s.settings.username,
            activeRoomId: null,
          },
        })),

      setActiveRoom: (activeRoomId) =>
        set((s) => ({ settings: { ...s.settings, activeRoomId } })),
    }),
    {
      name: "beyblade-game-state",
      storage: createJSONStorage(() =>
        import.meta.env.MODE === "test" ? noopStorage : encryptedStorage,
      ),
      // Only persist settings — _hydrated and actions are runtime-only.
      partialize: (state) => ({ settings: state.settings }),
      onRehydrateStorage: () => (_state, error) => {
        if (!error) useGameStore.setState({ _hydrated: true });
      },
    },
  ),
);

// ─── Hook ────────────────────────────────────────────────────────────────────
// Drop-in replacement for the old useGame() context hook.

export function useGame() {
  const store = useGameStore();
  return {
    settings: store.settings,
    isHydrated: store._hydrated,
    isReady: Boolean(
      store.settings.beybladeId &&
        store.settings.arenaId &&
        store.settings.gameMode,
    ),
    setBeyblade: store.setBeyblade,
    setArena: store.setArena,
    setGameMode: store.setGameMode,
    setDifficulty: store.setDifficulty,
    setOpponent: store.setOpponent,
    setGameConfig: store.setGameConfig,
    startGame: store.startGame,
    resetGame: store.resetGame,
    setActiveRoom: store.setActiveRoom,
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────
// Zustand is global — no Provider is required. This component exists purely
// so existing <GameProvider> usage in RootLayout compiles unchanged.

export function GameProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

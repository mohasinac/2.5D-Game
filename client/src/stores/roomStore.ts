import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RoomPhase =
  | "idle"
  | "setup"
  | "matchmaking"
  | "in-lobby"
  | "connecting"
  | "in-game"
  | "post-game";

export type RoomType =
  | "pvp"
  | "ai"
  | "royale"
  | "teams"
  | "tournament"
  | "tryout"
  | "story";

interface RoomState {
  phase: RoomPhase;
  roomType: RoomType | null;
  roomId: string | null;
  colyseusRoomId: string | null;
  roomCode: string | null;
  beybladeId: string | null;
  arenaId: string | null;
  bestOf: 1 | 3 | 5;
  modifierIds: string[];
  readyPlayers: string[];
  matchmakingError: string | null;
  matchmakingDeadline: number | null;
  reconnectToken: string | null;

  setPhase: (phase: RoomPhase) => void;
  setRoom: (updates: Partial<Pick<RoomState,
    "roomId" | "colyseusRoomId" | "roomCode" | "roomType" |
    "beybladeId" | "arenaId" | "bestOf" | "modifierIds">>) => void;
  setReady: (playerIds: string[]) => void;
  setReconnectToken: (token: string | null) => void;
  setMatchmakingError: (error: string | null) => void;
  reset: () => void;
}

const DEFAULT: Omit<RoomState, keyof { setPhase: unknown; setRoom: unknown; setReady: unknown; setReconnectToken: unknown; setMatchmakingError: unknown; reset: unknown }> = {
  phase: "idle",
  roomType: null,
  roomId: null,
  colyseusRoomId: null,
  roomCode: null,
  beybladeId: null,
  arenaId: null,
  bestOf: 3,
  modifierIds: [],
  readyPlayers: [],
  matchmakingError: null,
  matchmakingDeadline: null,
  reconnectToken: null,
};

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      ...DEFAULT,

      setPhase: (phase) => set({ phase }),

      setRoom: (updates) => set(updates),

      setReady: (playerIds) => set({ readyPlayers: playerIds }),

      setReconnectToken: (token) => set({ reconnectToken: token }),

      setMatchmakingError: (error) => set({ matchmakingError: error }),

      reset: () => set({ ...DEFAULT }),
    }),
    {
      name: "bey-room-v1",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

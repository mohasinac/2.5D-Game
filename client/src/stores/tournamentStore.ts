import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  collection, doc, getDoc, getDocs, onSnapshot, query,
  where, Unsubscribe,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "@/types/game";

const TOURNAMENT_TTL_MS = 30 * 60 * 1000; // 30 min per tournament

interface TournamentState {
  activeTournamentId: string | null;
  tournament: TournamentDoc | null;
  participants: TournamentParticipantDoc[];
  bracket: TournamentMatchDoc[];
  myMatch: TournamentMatchDoc | null;
  _fetchedAt: Record<string, number>;
  isLoading: boolean;
  error: string | null;

  loadTournament: (id: string, myUserId?: string) => void;
  unsubscribe: () => void;
  invalidate: (id: string) => void;
}

// Non-persisted snapshot listener reference
let _unsubFn: Unsubscribe | null = null;

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      activeTournamentId: null,
      tournament: null,
      participants: [],
      bracket: [],
      myMatch: null,
      _fetchedAt: {},
      isLoading: false,
      error: null,

      loadTournament: (id: string, myUserId?: string) => {
        const { _fetchedAt } = get();
        const isFresh = typeof _fetchedAt[id] === "number" && Date.now() - _fetchedAt[id] < TOURNAMENT_TTL_MS;
        if (get().activeTournamentId === id && isFresh) return;

        // Clean up any existing listener
        if (_unsubFn) { _unsubFn(); _unsubFn = null; }

        set({ activeTournamentId: id, isLoading: true, error: null });

        // Fetch static tournament doc once
        getDoc(doc(db, COLLECTIONS.TOURNAMENTS, id)).then(snap => {
          if (!snap.exists()) {
            set({ isLoading: false, error: "Tournament not found" });
            return;
          }
          set({ tournament: { id, ...snap.data() } as TournamentDoc });
        }).catch(() => set({ isLoading: false, error: "Failed to load tournament" }));

        // Participants — fetch once
        getDocs(query(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), where("tournamentId", "==", id)))
          .then(snap => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as TournamentParticipantDoc));
            set({ participants: docs });
          })
          .catch(() => {});

        // Bracket — live snapshot so colyseusRoomId updates arrive in real time
        _unsubFn = onSnapshot(
          query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", id)),
          (snap) => {
            const matches = snap.docs.map(d => ({ id: d.id, ...d.data() } as TournamentMatchDoc));
            matches.sort((a, b) => a.round - b.round || a.matchNumber - b.matchNumber);
            const myMatch = myUserId
              ? matches.find(m =>
                  (m.participant1Id === myUserId || m.participant2Id === myUserId) &&
                  m.status !== "completed" && m.status !== "bye"
                ) ?? null
              : null;
            set({
              bracket: matches,
              myMatch,
              isLoading: false,
              _fetchedAt: { ...get()._fetchedAt, [id]: Date.now() },
            });
          },
          () => set({ isLoading: false, error: "Failed to sync bracket" })
        );
      },

      unsubscribe: () => {
        if (_unsubFn) { _unsubFn(); _unsubFn = null; }
        set({ activeTournamentId: null, tournament: null, participants: [], bracket: [], myMatch: null });
      },

      invalidate: (id: string) => {
        const { [id]: _, ...rest } = get()._fetchedAt;
        set({ _fetchedAt: rest });
      },
    }),
    { name: "bey-tournament-v1" }
  )
);

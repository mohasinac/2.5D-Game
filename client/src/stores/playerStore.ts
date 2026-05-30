import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, doc, getDocs, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

const PLAYER_TTL_MS = 15 * 60 * 1000; // 15 min

export interface PlayerProfile {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  draws: number;
  matchesPlayed: number;
  tournamentPoints: number;
  totalDamageDealt: number;
  totalCollisions: number;
}

export interface OwnedBeyblade {
  id: string;
  name: string;
  type?: string;
  attack?: number;
  defense?: number;
  stamina?: number;
  specialMoveId?: string | null;
  comboIds?: string[];
  imageUrl?: string | null;
  color?: string;
}

export interface MatchSummary {
  id: string;
  opponentName: string;
  opponentBeyName: string;
  outcome: "win" | "loss" | "draw";
  seriesScore: string;
  xpGained: number;
  createdAt: number;
  vsBot?: boolean;
}

export interface StoryProgress {
  currentSeasonId: string | null;
  currentEpisodeId: string | null;
  completedEpisodes: string[];
}

export interface MatchResult {
  outcome: "win" | "loss" | "draw";
  xpGained: number;
  vsBot?: boolean;
}

interface PlayerState {
  profile: PlayerProfile | null;
  ownedBeyblades: OwnedBeyblade[];
  recentMatches: MatchSummary[];
  tournamentRegistrations: string[];
  storyProgress: StoryProgress | null;
  _fetchedAt: number | null;
  isLoading: boolean;
  error: string | null;
  loadPlayer: (userId: string) => Promise<void>;
  invalidate: () => void;
  updateAfterMatch: (result: MatchResult) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      profile: null,
      ownedBeyblades: [],
      recentMatches: [],
      tournamentRegistrations: [],
      storyProgress: null,
      _fetchedAt: null,
      isLoading: false,
      error: null,

      loadPlayer: async (userId: string) => {
        const { _fetchedAt } = get();
        if (_fetchedAt !== null && Date.now() - _fetchedAt < PLAYER_TTL_MS) return;
        set({ isLoading: true, error: null });
        try {
          const [profileSnap, beysSnap, matchesSnap] = await Promise.all([
            getDoc(doc(db, COLLECTIONS.PLAYER_STATS, userId)),
            getDocs(query(collection(db, COLLECTIONS.BEYBLADE_STATS), where("userId", "==", userId))),
            getDocs(query(collection(db, COLLECTIONS.MATCHES), where("playerIds", "array-contains", userId), orderBy("createdAt", "desc"), limit(20))),
          ]);

          const profileData = profileSnap.exists()
            ? ({ userId, ...profileSnap.data() } as PlayerProfile)
            : null;

          const beyblades = beysSnap.docs.map(d => ({ id: d.id, ...d.data() } as OwnedBeyblade));

          const matches = matchesSnap.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              opponentName: data.opponentName ?? "Unknown",
              opponentBeyName: data.opponentBeyName ?? "",
              outcome: data.winner === userId ? "win" : data.isDraw ? "draw" : "loss",
              seriesScore: data.seriesScore ?? "0-0",
              xpGained: data.xpGained ?? 0,
              createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
              vsBot: data.vsBot ?? false,
            } as MatchSummary;
          });

          set({
            profile: profileData,
            ownedBeyblades: beyblades,
            recentMatches: matches,
            _fetchedAt: Date.now(),
            isLoading: false,
          });
        } catch (e) {
          set({ isLoading: false, error: "Failed to load player data" });
        }
      },

      invalidate: () => set({ _fetchedAt: null }),

      updateAfterMatch: (result: MatchResult) => {
        const { profile } = get();
        if (!profile) return;
        const delta = result.outcome === "win" ? { wins: 1 } : result.outcome === "loss" ? { losses: 1 } : { draws: 1 };
        set({
          profile: {
            ...profile,
            matchesPlayed: profile.matchesPlayed + 1,
            wins: profile.wins + (delta.wins ?? 0),
            losses: profile.losses + (delta.losses ?? 0),
            draws: profile.draws + (delta.draws ?? 0),
            xp: profile.xp + result.xpGained,
          },
        });
      },
    }),
    { name: "bey-player-v1" }
  )
);

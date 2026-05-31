import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

interface Season {
  id: string;
  name: string;
  order: number;
  episodeIds: string[];
  description: string;
  unlockCondition: string;
}

interface Episode {
  id: string;
  seasonId: string;
  order: number;
  title: string;
  opponentCharacterId: string;
  battleConfig: { aiDifficulty: string; bestOf: number; arenaId: string };
}

interface PlayerProgress {
  completedEpisodeIds: string[];
  bondLevels: Record<string, number>;
}

export default function StorySelectPage() {
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [progress, setProgress] = useState<PlayerProgress>({ completedEpisodeIds: [], bondLevels: {} });
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [seasonsSnap, episodesSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.SEASONS)),
          getDocs(collection(db, COLLECTIONS.EPISODES)),
        ]);

        const s = seasonsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Season))
          .sort((a, b) => a.order - b.order);
        const e = episodesSnap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Episode))
          .sort((a, b) => a.order - b.order);

        setSeasons(s);
        setEpisodes(e);

        if (user) {
          const progDoc = await getDoc(doc(db, COLLECTIONS.PLAYER_PROGRESS, user.uid));
          if (progDoc.exists()) {
            setProgress(progDoc.data() as PlayerProgress);
          }
        }

        if (s.length > 0) setSelectedSeason(s[0].id);
      } catch (err) {
        console.error("Failed to load story data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const isSeasonUnlocked = (season: Season): boolean => {
    if (season.unlockCondition === "none") return true;
    if (season.unlockCondition.startsWith("complete_season:")) {
      const reqSeasonId = season.unlockCondition.replace("complete_season:", "");
      const reqSeason = seasons.find((s) => s.id === reqSeasonId);
      if (!reqSeason) return false;
      return reqSeason.episodeIds.every((epId) => progress.completedEpisodeIds.includes(epId));
    }
    return false;
  };

  const isEpisodeCompleted = (epId: string) => progress.completedEpisodeIds.includes(epId);

  const seasonEpisodes = episodes.filter((e) => e.seasonId === selectedSeason);

  const handleStartEpisode = (episodeId: string) => {
    navigate(`/game/story/episode/${episodeId}`);
  };

  if (loading) {
    return (
      <div className="h-dvh overflow-hidden bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading Story Mode...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-gray-900 text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col" style={{ flex: 1, minHeight: 0, padding: '1.5rem', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Story Mode</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {seasons.map((season) => {
            const unlocked = isSeasonUnlocked(season);
            const completedCount = season.episodeIds.filter((id) => isEpisodeCompleted(id)).length;
            return (
              <button
                key={season.id}
                onClick={() => unlocked && setSelectedSeason(season.id)}
                disabled={!unlocked}
                className={`flex-shrink-0 px-6 py-4 rounded-lg border-2 transition ${
                  selectedSeason === season.id
                    ? "border-blue-500 bg-blue-900/30"
                    : unlocked
                    ? "border-gray-600 bg-gray-800 hover:border-gray-400"
                    : "border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-left">
                  <p className="font-bold">{season.name}</p>
                  <p className="text-sm text-gray-400">
                    {unlocked
                      ? `${completedCount}/${season.episodeIds.length} completed`
                      : "Locked"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedSeason && (
          <div className="space-y-4">
            {seasons.find((s) => s.id === selectedSeason)?.description && (
              <p className="text-gray-400 mb-6">
                {seasons.find((s) => s.id === selectedSeason)?.description}
              </p>
            )}
            {seasonEpisodes.map((ep, i) => {
              const completed = isEpisodeCompleted(ep.id);
              const prevCompleted = i === 0 || isEpisodeCompleted(seasonEpisodes[i - 1]?.id);
              const available = prevCompleted;
              return (
                <div
                  key={ep.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition ${
                    completed
                      ? "border-green-700 bg-green-900/20"
                      : available
                      ? "border-gray-600 bg-gray-800 hover:border-blue-500"
                      : "border-gray-700 bg-gray-800/50 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        completed ? "bg-green-700" : available ? "bg-blue-700" : "bg-gray-700"
                      }`}
                    >
                      {completed ? "V" : i + 1}
                    </div>
                    <div>
                      <p className="font-bold">{ep.title}</p>
                      <p className="text-sm text-gray-400">
                        vs {ep.opponentCharacterId} | {ep.battleConfig.aiDifficulty} | BO{ep.battleConfig.bestOf}
                      </p>
                    </div>
                  </div>
                  {available && !completed && (
                    <button
                      onClick={() => handleStartEpisode(ep.id)}
                      className="px-6 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 transition"
                    >
                      Battle
                    </button>
                  )}
                  {completed && (
                    <button
                      onClick={() => handleStartEpisode(ep.id)}
                      className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                    >
                      Replay
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

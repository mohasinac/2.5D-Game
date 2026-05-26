import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

interface DialogueLine {
  speaker: string;
  text: string;
}

interface Episode {
  id: string;
  seasonId: string;
  title: string;
  opponentCharacterId: string;
  outroDialogue: DialogueLine[];
  rewardBeySystemId: string | null;
}

export default function EpisodeOutroPage() {
  const navigate = useNavigate();
  const { episodeId } = useParams<{ episodeId: string }>();
  const [searchParams] = useSearchParams();
  const won = searchParams.get("won") === "true";
  const { currentUser: user } = useAuth();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressSaved, setProgressSaved] = useState(false);

  useEffect(() => {
    async function load() {
      if (!episodeId) return;
      try {
        const epDoc = await getDoc(doc(db, COLLECTIONS.EPISODES, episodeId));
        if (epDoc.exists()) {
          setEpisode({ id: epDoc.id, ...epDoc.data() } as Episode);
        }
      } catch (err) {
        console.error("Failed to load episode:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [episodeId]);

  useEffect(() => {
    if (!won || !user || !episodeId || progressSaved) return;
    async function saveProgress() {
      try {
        const ref = doc(db, COLLECTIONS.PLAYER_PROGRESS, user!.uid);
        const existing = await getDoc(ref);
        const data = existing.exists() ? existing.data() : { completedEpisodeIds: [], bondLevels: {} };
        const completed = new Set<string>(data.completedEpisodeIds || []);
        completed.add(episodeId!);
        await setDoc(ref, { ...data, completedEpisodeIds: Array.from(completed) }, { merge: true });
        setProgressSaved(true);
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }
    saveProgress();
  }, [won, user, episodeId, progressSaved]);

  const handleAdvance = () => {
    if (!episode) return;
    if (dialogueIndex < (episode.outroDialogue?.length ?? 0) - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      navigate("/game/story");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col gap-4">
        <p className="text-xl">Episode not found</p>
        <button onClick={() => navigate("/game/story")} className="px-4 py-2 bg-gray-700 rounded">
          Back to Story
        </button>
      </div>
    );
  }

  const hasDialogue = episode.outroDialogue && episode.outroDialogue.length > 0;
  const currentLine = hasDialogue ? episode.outroDialogue[dialogueIndex] : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className={`text-5xl font-bold mb-4 ${won ? "text-green-400" : "text-red-400"}`}>
          {won ? "VICTORY" : "DEFEAT"}
        </div>
        <p className="text-gray-400 mb-8">{episode.title}</p>

        {won && episode.rewardBeySystemId && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
            <p className="font-bold text-yellow-300">Reward Unlocked!</p>
            <p className="text-sm text-gray-300">New beyblade system available</p>
          </div>
        )}

        {hasDialogue && currentLine && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm font-bold mb-2 uppercase tracking-wider text-gray-400">
              {currentLine.speaker === "player" ? "You" : currentLine.speaker}
            </p>
            <p className="text-lg">{currentLine.text}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {hasDialogue && dialogueIndex < (episode.outroDialogue?.length ?? 0) - 1 ? (
            <button
              onClick={handleAdvance}
              className="px-6 py-3 bg-blue-600 rounded font-bold hover:bg-blue-500 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => navigate("/game/story")}
              className="px-6 py-3 bg-blue-600 rounded font-bold hover:bg-blue-500 transition"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

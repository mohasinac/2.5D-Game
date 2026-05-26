import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";

interface DialogueLine {
  speaker: string;
  text: string;
}

interface Episode {
  id: string;
  seasonId: string;
  title: string;
  opponentCharacterId: string;
  dialogue: DialogueLine[];
  outroDialogue: DialogueLine[];
  battleConfig: { aiDifficulty: string; bestOf: number; arenaId: string };
  rewardBeySystemId: string | null;
}

export default function EpisodeIntroPage() {
  const navigate = useNavigate();
  const { episodeId } = useParams<{ episodeId: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleAdvance = () => {
    if (!episode) return;
    if (dialogueIndex < episode.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      navigate(`/game/ai?episodeId=${episodeId}&aiDifficulty=${episode.battleConfig.aiDifficulty}&bestOf=${episode.battleConfig.bestOf}`);
    }
  };

  const handleSkip = () => {
    if (!episode) return;
    navigate(`/game/ai?episodeId=${episodeId}&aiDifficulty=${episode.battleConfig.aiDifficulty}&bestOf=${episode.battleConfig.bestOf}`);
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

  const currentLine = episode.dialogue[dialogueIndex];
  const isLastLine = dialogueIndex >= episode.dialogue.length - 1;

  const speakerColor =
    currentLine?.speaker === "narrator"
      ? "text-yellow-300"
      : currentLine?.speaker === "player"
      ? "text-blue-300"
      : "text-red-300";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-center">{episode.title}</h2>
          <p className="text-sm text-gray-400 mb-8 text-center">
            vs {episode.opponentCharacterId}
          </p>

          <div className="bg-gray-800 rounded-lg p-6 min-h-[200px] flex flex-col justify-between">
            <div>
              <p className={`text-sm font-bold mb-2 uppercase tracking-wider ${speakerColor}`}>
                {currentLine?.speaker === "player" ? "You" : currentLine?.speaker}
              </p>
              <p className="text-lg leading-relaxed">{currentLine?.text}</p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <p className="text-sm text-gray-500">
                {dialogueIndex + 1} / {episode.dialogue.length}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleAdvance}
                  className="px-6 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 transition"
                >
                  {isLastLine ? "Battle!" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

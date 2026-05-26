import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "../lib/firebase";

interface InputFrame {
  tick: number;
  bitmasks: Record<string, number>;
}

interface ReplayData {
  matchId: string;
  arenaId: string;
  players: Array<{ userId: string; username: string; beybladeId: string }>;
  frames: InputFrame[];
  totalTicks: number;
  winner: string;
  createdAt: string;
}

export default function ReplayViewerPage() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const [replay, setReplay] = useState<ReplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTick, setCurrentTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    async function load() {
      if (!matchId) {
        setError("No match ID provided");
        setLoading(false);
        return;
      }
      try {
        const replayDoc = await getDoc(doc(db, COLLECTIONS.MATCH_REPLAYS, matchId));
        if (!replayDoc.exists()) {
          setError("Replay not found");
          setLoading(false);
          return;
        }
        setReplay({ matchId, ...replayDoc.data() } as ReplayData);
      } catch (err) {
        console.error("Failed to load replay:", err);
        setError("Failed to load replay");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  useEffect(() => {
    if (!playing || !replay) return;
    const interval = setInterval(() => {
      setCurrentTick((prev) => {
        if (prev >= replay.totalTicks - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, (1000 / 60) / speed);
    return () => clearInterval(interval);
  }, [playing, replay, speed]);

  const handleScrub = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentTick(parseInt(e.target.value, 10));
    },
    []
  );

  const formatTime = (tick: number) => {
    const seconds = Math.floor(tick / 60);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading replay...</p>
      </div>
    );
  }

  if (error || !replay) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col gap-4">
        <p className="text-xl text-red-400">{error || "Replay not available"}</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Back to Home
        </button>
      </div>
    );
  }

  const currentFrame = replay.frames.find((f) => f.tick === currentTick);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
          >
            Back
          </button>
          <h1 className="text-lg font-bold">Replay: {matchId}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {replay.players.map((p) => (
            <span
              key={p.userId}
              className={`px-2 py-1 rounded ${p.userId === replay.winner ? "bg-green-800 text-green-200" : "bg-gray-700"}`}
            >
              {p.username}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-950 p-8">
        <div className="text-center">
          <p className="text-6xl font-mono mb-4">{formatTime(currentTick)}</p>
          <p className="text-gray-400">
            Tick {currentTick} / {replay.totalTicks}
          </p>
          {currentFrame && (
            <div className="mt-4 text-sm text-gray-500">
              {Object.entries(currentFrame.bitmasks).map(([userId, mask]) => (
                <p key={userId}>
                  {userId}: 0x{mask.toString(16).padStart(4, "0")}
                </p>
              ))}
            </div>
          )}
          <p className="mt-8 text-gray-600 text-sm">
            Visual replay requires the game renderer. This viewer shows the input timeline.
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <input
            type="range"
            min={0}
            max={replay.totalTicks - 1}
            value={currentTick}
            onChange={handleScrub}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTick(0)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
              >
                Start
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className={`px-4 py-1 rounded font-bold text-sm ${
                  playing ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => setCurrentTick(replay.totalTicks - 1)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
              >
                End
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-sm ${
                    speed === s ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400">{formatTime(currentTick)} / {formatTime(replay.totalTicks)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

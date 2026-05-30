import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../stores/roomStore";

const MODE_LABELS: Record<string, string> = {
  pvp: "1v1 PvP",
  teams: "2v2 Teams",
  royale: "Battle Royale",
};

export default function MatchmakingPage() {
  const navigate = useNavigate();
  const { phase, roomType, bestOf, matchmakingError, matchmakingDeadline, reset } = useRoomStore();

  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!matchmakingDeadline) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((matchmakingDeadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };
    update();
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, [matchmakingDeadline]);

  function handleCancel() {
    reset();
    navigate("/game");
  }

  if (phase === "in-game") {
    navigate("/game/room");
    return null;
  }

  const modeLabel = MODE_LABELS[roomType ?? ""] ?? "Match";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg1 p-6 text-center">
      {matchmakingError ? (
        <>
          <p className="text-red-400 text-lg mb-4">{matchmakingError}</p>
          <button onClick={handleCancel} className="px-6 py-2 rounded-lg bg-bg2 text-theme-text border border-border-c">
            Back to Menu
          </button>
        </>
      ) : phase === "in-lobby" ? (
        <>
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-theme-text mb-2">Match Found!</h1>
          <p className="text-theme-muted mb-6">Mode: {modeLabel} · BO{bestOf}</p>
          <div className="w-full max-w-sm bg-bg2 border border-border-c rounded-xl p-4">
            <p className="text-sm text-theme-muted">Waiting for opponent to ready up…</p>
          </div>
          <button onClick={handleCancel} className="mt-6 text-sm text-theme-muted underline">
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6" />
          <h1 className="text-2xl font-bold text-theme-text mb-2">Finding Opponents…</h1>
          <p className="text-theme-muted mb-2">Mode: {modeLabel} · BO{bestOf}</p>
          <p className="text-sm text-accent font-mono mb-6">0:{String(secondsLeft).padStart(2, "0")} remaining</p>
          <p className="text-xs text-theme-muted mb-8">Auto-fills with AI if no opponents join</p>
          <button onClick={handleCancel} className="px-6 py-2 rounded-lg bg-bg2 text-theme-text border border-border-c text-sm">
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

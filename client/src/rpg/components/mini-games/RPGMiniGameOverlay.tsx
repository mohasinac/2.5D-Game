/**
 * RPGMiniGameOverlay — Full-screen mini-game wrapper
 *
 * Dispatches to the right mini-game component based on `game.type`:
 *   qte                   → MiniGameQTE
 *   bey_trajectory_aim    → MiniGameTargetHit
 *   bey_trajectory_block  → MiniGamePlatformBlock
 *
 * Wraps all three in a consistent dark overlay with:
 * - Title card / description
 * - Countdown intro ("3-2-1-GO!")
 * - Score / XP result panel before calling onComplete
 */

import { useState, useEffect, useCallback } from "react";
import type { ActiveMiniGame, MiniGameResult } from "../../data/schemas";
import { MiniGameQTE }           from "./MiniGameQTE";
import { MiniGameTargetHit }     from "./MiniGameTargetHit";
import { MiniGamePlatformBlock } from "./MiniGamePlatformBlock";

// ── Game type metadata ────────────────────────────────────────────────────────
const GAME_META: Record<string, { title: string; icon: string; colour: string }> = {
  qte: {
    title:  "Perfect Launch!",
    icon:   "⚡",
    colour: "#facc15",
  },
  bey_trajectory_aim: {
    title:  "Target Practice",
    icon:   "🎯",
    colour: "#3b82f6",
  },
  bey_trajectory_block: {
    title:  "Block the Waterfall",
    icon:   "🪵",
    colour: "#22c55e",
  },
};

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ result, onDone }: { result: MiniGameResult; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div
        className="text-5xl font-black"
        style={{ color: result.success ? "#22c55e" : "#ef4444" }}
      >
        {result.success ? "SUCCESS!" : "TRY AGAIN"}
      </div>
      <div className="flex gap-6 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{result.score}</div>
          <div className="text-white/50">score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">+{result.xpEarned}</div>
          <div className="text-white/50">XP earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{result.hitsLanded}</div>
          <div className="text-white/50">hits</div>
        </div>
      </div>
      <div className="text-white/30 text-xs animate-pulse">continuing…</div>
    </div>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────
interface Props {
  game: ActiveMiniGame;
  onComplete: (result: MiniGameResult) => void;
}

type UIPhase = "title" | "playing" | "result";

export function RPGMiniGameOverlay({ game, onComplete }: Props) {
  const [uiPhase, setUIPhase]     = useState<UIPhase>("title");
  const [result,  setResult]      = useState<MiniGameResult | null>(null);
  const [countdown, setCountdown] = useState(3);

  const meta = GAME_META[game.type] ?? { title: "Mini-Game", icon: "🎮", colour: "#a855f7" };

  // Title card → countdown → playing
  useEffect(() => {
    if (uiPhase !== "title") return;
    const t = setTimeout(() => setUIPhase("playing"), 2000);
    return () => clearTimeout(t);
  }, [uiPhase]);

  const handleGameComplete = useCallback((r: MiniGameResult) => {
    setResult(r);
    setUIPhase("result");
  }, []);

  const handleResultDone = useCallback(() => {
    if (result) onComplete(result);
  }, [result, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(4px)" }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-xl px-4">

        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl">{meta.icon}</div>
          <h2
            className="text-xl font-black tracking-wider uppercase"
            style={{ color: meta.colour }}
          >
            {meta.title}
          </h2>
          {game.config.description && (
            <p className="text-white/60 text-sm text-center max-w-xs">
              {game.config.description}
            </p>
          )}
        </div>

        {/* Body */}
        {uiPhase === "title" && (
          <div className="text-white/40 text-sm animate-pulse">Get ready…</div>
        )}

        {uiPhase === "playing" && game.type === "qte" && (
          <MiniGameQTE config={game.config} onComplete={handleGameComplete} />
        )}

        {uiPhase === "playing" && game.type === "bey_trajectory_aim" && (
          <MiniGameTargetHit config={game.config} onComplete={handleGameComplete} />
        )}

        {uiPhase === "playing" && game.type === "bey_trajectory_block" && (
          <MiniGamePlatformBlock config={game.config} onComplete={handleGameComplete} />
        )}

        {uiPhase === "result" && result && (
          <ResultCard result={result} onDone={handleResultDone} />
        )}

        {/* Bottom hint */}
        {uiPhase === "playing" && (
          <div className="text-white/20 text-[10px] tracking-widest uppercase">
            Mini-Game — {game.id}
          </div>
        )}
      </div>
    </div>
  );
}

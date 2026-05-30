// ResultsScreen — post-series results overlay with animated stats + confetti.
// Victory: gold header + confetti. Defeat: dark header. Draw: silver header.
// Stats count up over 2.5s. XP bar fills after count-up completes.

import React, { useEffect, useState } from "react";
import { ConfettiLayer } from "./ConfettiLayer";
import { StatCountUp } from "./StatCountUp";

export interface MatchStats {
  damageDealt: number;
  collisions: number;
  topMoveName: string | null;
  spinTimeMs: number;
  winStreak: number;
}

export interface SeriesResult {
  outcome: "victory" | "defeat" | "draw";
  myScore: number;
  opponentScore: number;
  myBeyName: string;
  myBeyType?: string;
  opponentName: string;
  opponentBeyName: string;
  xpGained: number;
  tournamentPoints: number;
  stats: MatchStats;
}

interface ResultsScreenProps {
  result: SeriesResult;
  onRematch: () => void;
  onNewOpponent: () => void;
  onMenu: () => void;
}

const OUTCOME_CONFIG = {
  victory: {
    label: "VICTORY!",
    color: "#FFD700",
    bg: "linear-gradient(135deg,rgba(40,30,0,0.95),rgba(20,20,10,0.95))",
    border: "#FFD700",
    confetti: true,
  },
  defeat: {
    label: "DEFEATED",
    color: "#FF3333",
    bg: "linear-gradient(135deg,rgba(30,5,5,0.95),rgba(15,15,20,0.95))",
    border: "#FF3333",
    confetti: false,
  },
  draw: {
    label: "DRAW",
    color: "#AAAAAA",
    bg: "linear-gradient(135deg,rgba(20,20,20,0.95),rgba(15,15,20,0.95))",
    border: "#888888",
    confetti: false,
  },
};

function formatSpinTime(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function XPBar({ xp }: { xp: number }) {
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFill(Math.min(100, (xp / 500) * 100)), 2600);
    return () => clearTimeout(t);
  }, [xp]);
  return (
    <div className="w-full mt-1">
      <div className="flex justify-between text-[10px] font-mono mb-1">
        <span style={{ color: "#FFD700" }}>XP</span>
        <span style={{ color: "#FFD700" }}>+{xp}</span>
      </div>
      <div className="h-2 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full rounded"
          style={{
            width: `${fill}%`,
            background: "linear-gradient(90deg,#FFD700,#FFA500)",
            boxShadow: "0 0 8px #FFD70066",
            transition: "width 800ms ease-out",
          }}
        />
      </div>
    </div>
  );
}

export function ResultsScreen({ result, onRematch, onNewOpponent, onMenu }: ResultsScreenProps) {
  const [visible, setVisible] = useState(false);
  const cfg = OUTCOME_CONFIG[result.outcome];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute inset-0 z-[130] flex flex-col items-center justify-center overflow-y-auto"
      style={{ background: cfg.bg, opacity: visible ? 1 : 0, transition: "opacity 400ms" }}
    >
      <ConfettiLayer active={cfg.confetti} />

      <div className="relative z-[2] flex flex-col items-center gap-4 px-4 w-full max-w-[420px] py-6">

        {/* Outcome header */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="font-black tracking-[0.25em] [animation:victoryPunch_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{
              fontSize: "clamp(1.8rem,5vw,2.6rem)",
              color: cfg.color,
              textShadow: `0 0 32px ${cfg.color}88`,
            }}
          >
            {cfg.label}
          </div>
          {result.tournamentPoints > 0 && (
            <div className="text-[12px] font-mono" style={{ color: cfg.color + "99" }}>
              +{result.tournamentPoints} Tournament Points
            </div>
          )}
        </div>

        {/* Series score */}
        <div
          className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${cfg.border}33` }}
        >
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/40 font-mono uppercase">YOU</span>
            <span className="text-[11px] font-bold truncate max-w-[90px]" style={{ color: cfg.color }}>{result.myBeyName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-black font-mono text-[2.2rem] leading-none"
              style={{ color: result.outcome === "victory" ? cfg.color : "rgba(255,255,255,0.8)" }}
            >
              {result.myScore}
            </span>
            <span className="text-white/30 font-mono">─</span>
            <span
              className="font-black font-mono text-[2.2rem] leading-none"
              style={{ color: result.outcome === "defeat" ? "#FF3333" : "rgba(255,255,255,0.8)" }}
            >
              {result.opponentScore}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/40 font-mono uppercase">{result.opponentName}</span>
            <span className="text-[11px] font-bold truncate max-w-[90px] text-white/70">{result.opponentBeyName}</span>
          </div>
        </div>

        {/* XP */}
        {result.xpGained > 0 && <XPBar xp={result.xpGained} />}

        {/* Match stats */}
        <div
          className="w-full rounded-2xl px-5 py-4 flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">MATCH STATS</div>
          {[
            {
              label: "Damage Dealt",
              node: <StatCountUp value={result.stats.damageDealt} delay={300} format={n => n.toLocaleString()} className="font-mono font-bold text-white" />,
            },
            {
              label: "Collisions",
              node: <StatCountUp value={result.stats.collisions} delay={500} className="font-mono font-bold text-white" />,
            },
            {
              label: "Top Move",
              node: <span className="font-mono font-bold text-white">{result.stats.topMoveName ?? "—"}</span>,
            },
            {
              label: "Spin Time",
              node: <span className="font-mono font-bold text-white">{formatSpinTime(result.stats.spinTimeMs)}</span>,
            },
            result.stats.winStreak > 1 ? {
              label: "Streak",
              node: <span className="font-mono font-bold" style={{ color: "#FF8C00" }}>🔥 {result.stats.winStreak} wins</span>,
            } : null,
          ].filter(Boolean).map((row, i) => (
            <div key={i} className="flex justify-between items-center text-[12px]">
              <span className="text-white/50">{row!.label}</span>
              {row!.node}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={onRematch}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            🔄 Rematch
          </button>
          <button
            onClick={onNewOpponent}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            🔍 New Opp
          </button>
          <button
            onClick={onMenu}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-transform active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
          >
            🏠 Menu
          </button>
        </div>
      </div>

      <style>{`
        @keyframes victoryPunch {
          0%   { opacity:0; transform:scale(0.5); }
          70%  { transform:scale(1.12); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>
    </div>
  );
}

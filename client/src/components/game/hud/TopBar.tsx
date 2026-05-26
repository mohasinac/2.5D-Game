import React from "react";

interface TopBarProps {
  timerSec: number;
  status?: string;
  tournamentName?: string;
  roundLabel?: string;
  modifiers?: string[];
  spectatorCount?: number;
}

export function TopBar({ timerSec, status, tournamentName, roundLabel, modifiers = [], spectatorCount }: TopBarProps) {
  const mm = Math.floor(timerSec / 60).toString().padStart(2, "0");
  const ss = Math.floor(timerSec % 60).toString().padStart(2, "0");
  const low = timerSec > 0 && timerSec <= 30;

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none font-mono"
    >
      <div className="bg-[rgba(8,12,26,0.85)] backdrop-blur-md border-x border-b border-white/10 rounded-b-xl px-4 pt-1.5 pb-2 flex flex-col items-center gap-0.5 min-w-[120px]">
        {/* Tournament label */}
        {tournamentName && (
          <span className="text-theme-yellow text-[0.5rem] tracking-widest uppercase font-bold truncate max-w-[160px] drop-shadow-sm">
            {tournamentName}{roundLabel ? ` · ${roundLabel}` : ""}
          </span>
        )}

        {/* Timer */}
        <div className={`text-[1.1rem] font-black tracking-[0.06em] tabular-nums ${low ? "text-theme-red animate-pulse" : "text-white"}`}>
          {mm}:{ss}
        </div>

        {/* Status badge */}
        {status && status !== "in-progress" && (
          <span className="text-[0.5rem] tracking-[0.15em] uppercase text-white/40">{status}</span>
        )}

        {/* Modifier chips */}
        {modifiers.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center mt-0.5">
            {modifiers.slice(0, 4).map(m => (
              <span key={m} className="text-[0.45rem] px-1 py-px rounded bg-white/10 text-white/60 tracking-wide uppercase">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Spectator count */}
        {spectatorCount !== undefined && spectatorCount > 0 && (
          <span className="text-[0.45rem] text-white/30 tracking-wide">{spectatorCount} watching</span>
        )}
      </div>
    </div>
  );
}

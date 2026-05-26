import React from "react";
import { SPBar } from "./SPBar";

interface AllyEntry {
  id: string;
  username: string;
  beyType: string;
  spinPct: number;
}

interface PlayerPanelProps {
  username: string;
  beyType: string;
  spinPct: number;
  allies?: AllyEntry[];
  seriesWins?: number;
  targetWins?: number;
}

const TYPE_HEX: Record<string, string> = {
  attack:   "#ff5544",
  defense:  "#3388ff",
  stamina:  "#33cc77",
  balanced: "#ffcc33",
};

const TYPE_LABEL: Record<string, string> = {
  attack: "ATK", defense: "DEF", stamina: "STA", balanced: "BAL",
};

export function PlayerPanel({ username, beyType, spinPct, allies = [], seriesWins, targetWins }: PlayerPanelProps) {
  const typeHex = TYPE_HEX[beyType] ?? "#aabbcc";
  const typeLabel = TYPE_LABEL[beyType] ?? "—";
  const hasAllies = allies.length > 0;

  return (
    <div
      className="absolute top-3 left-3 z-50 pointer-events-none flex flex-col gap-1.5 min-w-[130px] max-w-[180px]"
    >
      {/* ── Player card ── */}
      <div
        className="hud-type-border rounded-lg px-2.5 pt-2 pb-2.5 backdrop-blur-md flex flex-col gap-2 border"
        style={{ "--tc": typeHex, background: "rgba(8,12,26,0.88)" } as React.CSSProperties}
      >
        {/* Name row */}
        <div className="flex items-center gap-1.5">
          <span className="hud-type-dot w-2 h-2 rounded-full shrink-0" style={{ "--tc": typeHex } as React.CSSProperties} />
          <span className="text-white font-semibold text-[0.7rem] font-mono truncate flex-1">{username}</span>
          <span
            className="hud-type-text text-[0.5rem] font-bold tracking-wider shrink-0"
            style={{ "--tc": typeHex } as React.CSSProperties}
          >{typeLabel}</span>
        </div>

        {/* SP bar */}
        <SPBar spinPct={spinPct} label="STAMINA" />

        {/* Series score */}
        {seriesWins !== undefined && targetWins !== undefined && targetWins > 1 && (
          <div className="flex gap-[3px] mt-0.5">
            {Array.from({ length: targetWins }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-[3px] rounded-full ${i < seriesWins ? "hud-type-bg" : "bg-white/10"}`}
                style={{ "--tc": typeHex } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Ally cards (team mode) ── */}
      {hasAllies && (
        <div className="flex flex-col gap-1">
          <span className="text-[0.45rem] tracking-[0.18em] text-white/30 uppercase px-0.5">Allies</span>
          {allies.map(ally => {
            const allyHex = TYPE_HEX[ally.beyType] ?? "#aabbcc";
            return (
              <div
                key={ally.id}
                className="hud-type-border rounded-md px-2 py-1.5 backdrop-blur-md flex flex-col gap-1 border"
                style={{ "--tc": allyHex, background: "rgba(8,12,26,0.80)" } as React.CSSProperties}
              >
                <div className="flex items-center gap-1.5">
                  <span className="hud-type-dot w-1.5 h-1.5 rounded-full shrink-0" style={{ "--tc": allyHex } as React.CSSProperties} />
                  <span className="text-white/80 text-[0.6rem] font-mono truncate">{ally.username}</span>
                </div>
                <SPBar spinPct={ally.spinPct} compact />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import type { ServerBeyGhost } from "@/types/game";

interface OpponentPanelProps {
  myId: string;
  myTeamId?: string;
  beyGhosts?: Map<string, ServerBeyGhost>;
  maxVisible?: number;
}

interface OpponentEntry {
  id: string;
  username: string;
  beyType: string;
  spinPct: number;
  tier: number;
  dist: number;
  isAlly: boolean;
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

function spinBarClass(pct: number): string {
  if (pct >= 75) return "bg-theme-green";
  if (pct >= 40) return "bg-theme-yellow";
  return "bg-theme-red";
}

function spinTextClass(pct: number): string {
  if (pct >= 75) return "text-theme-green";
  if (pct >= 40) return "text-theme-yellow";
  return "text-theme-red";
}

function tierDot(tier: number) {
  if (tier === 2) return "●";
  if (tier === 1) return "◐";
  return "·";
}

function OpponentRow({ op }: { op: OpponentEntry }) {
  const hex = TYPE_HEX[op.beyType] ?? "#aabbcc";
  const label = TYPE_LABEL[op.beyType] ?? "—";

  return (
    <div
      className="hud-type-border rounded-md px-2 py-[5px] backdrop-blur-md flex items-center gap-2 border"
      style={{ "--tc": hex, background: op.isAlly ? "rgba(8,28,20,0.82)" : "rgba(8,12,26,0.82)" } as React.CSSProperties}
    >
      {/* Type dot + tier */}
      <span
        className="hud-type-text text-[0.5rem] shrink-0 w-2 text-center"
        style={{ "--tc": hex } as React.CSSProperties}
      >{tierDot(op.tier)}</span>

      {/* Name */}
      <span className="text-white/80 text-[0.6rem] font-mono truncate flex-1 min-w-0 max-w-[80px]">
        {op.username}
      </span>

      {/* Type badge */}
      <span
        className="hud-type-text text-[0.45rem] font-bold tracking-wide shrink-0"
        style={{ "--tc": hex } as React.CSSProperties}
      >{label}</span>

      {/* Spin bar */}
      <div className="flex flex-col gap-[2px] w-14 shrink-0">
        <div className="h-[4px] rounded-full bg-white/10 overflow-hidden">
          <div
            className={`w-pct h-full rounded-full ${spinBarClass(op.spinPct)}`}
            style={{ "--pct": `${op.spinPct}%` } as React.CSSProperties}
          />
        </div>
        <span className={`text-[0.48rem] font-mono font-bold text-right ${spinTextClass(op.spinPct)}`}>
          {op.spinPct}%
        </span>
      </div>
    </div>
  );
}

export function OpponentPanel({ myId, myTeamId = "", beyGhosts, maxVisible = 8 }: OpponentPanelProps) {
  const [entries, setEntries] = useState<OpponentEntry[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!beyGhosts) return;
    tickRef.current += 1;
    if (tickRef.current < 10) return;
    tickRef.current = 0;

    const me = beyGhosts.get(myId) ?? null;
    const list: OpponentEntry[] = [];

    beyGhosts.forEach((ghost, id) => {
      if (id === myId) return;
      const dx = me ? ghost.x_cm - me.x_cm : 0;
      const dy = me ? ghost.y_cm - me.y_cm : 0;
      list.push({
        id,
        username: ghost.username,
        beyType: ghost.beyType,
        spinPct: ghost.spin_pct,
        tier: ghost.tier,
        dist: me ? Math.sqrt(dx * dx + dy * dy) : 0,
        isAlly: myTeamId !== "" && ghost.teamId === myTeamId,
      });
    });

    list.sort((a, b) => {
      if (a.isAlly !== b.isAlly) return a.isAlly ? -1 : 1;
      return a.dist - b.dist;
    });

    setEntries(list.slice(0, maxVisible));
  });

  if (entries.length === 0) return null;

  const allies = entries.filter(e => e.isAlly);
  const enemies = entries.filter(e => !e.isAlly);
  const hasTeams = allies.length > 0;

  return (
    <div
      className="absolute top-3 right-3 z-50 pointer-events-none flex flex-col gap-1 min-w-[170px] max-w-[220px]"
    >
      {hasTeams && enemies.length > 0 && (
        <span className="text-[0.45rem] tracking-[0.18em] text-white/30 uppercase px-0.5">Enemies</span>
      )}
      {enemies.map(op => <OpponentRow key={op.id} op={op} />)}

      {hasTeams && allies.length > 0 && (
        <>
          <span className="text-[0.45rem] tracking-[0.18em] text-white/30 uppercase px-0.5 mt-1">Allies</span>
          {allies.map(op => <OpponentRow key={op.id} op={op} />)}
        </>
      )}
    </div>
  );
}

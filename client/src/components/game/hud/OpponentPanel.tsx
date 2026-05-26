// Phase 28 HUD — OpponentPanel: nearest-8 opponents from beyGhosts, re-sorted every 10 ticks.

import { useEffect, useRef, useState } from "react";
import type { ServerBeyGhost } from "@/types/game";

interface OpponentPanelProps {
  myId: string;
  beyGhosts?: Map<string, ServerBeyGhost>;
}

const TYPE_COLORS: Record<string, string> = {
  attack: "#ff6655",
  defense: "#4488ff",
  stamina: "#44dd88",
  balanced: "#ffcc44",
};

interface OpponentEntry {
  id: string;
  username: string;
  beyType: string;
  spinPct: number;
  tier: number;
  dist: number;
}

function tierLabel(tier: number): string {
  if (tier === 2) return "●";
  if (tier === 1) return "◐";
  return "○";
}

export function OpponentPanel({ myId, beyGhosts }: OpponentPanelProps) {
  const [opponents, setOpponents] = useState<OpponentEntry[]>([]);
  const tickRef = useRef(0);
  const myGhostRef = useRef<ServerBeyGhost | null>(null);

  useEffect(() => {
    if (!beyGhosts) return;
    tickRef.current += 1;
    if (tickRef.current < 10) return;
    tickRef.current = 0;

    const me = beyGhosts.get(myId) ?? null;
    myGhostRef.current = me;

    const entries: OpponentEntry[] = [];
    beyGhosts.forEach((ghost, id) => {
      if (id === myId) return;
      const dx = me ? ghost.x_cm - me.x_cm : 0;
      const dy = me ? ghost.y_cm - me.y_cm : 0;
      const dist = me ? Math.sqrt(dx * dx + dy * dy) : 0;
      entries.push({
        id,
        username: ghost.username,
        beyType: ghost.beyType,
        spinPct: ghost.spin_pct,
        tier: ghost.tier,
        dist,
      });
    });

    entries.sort((a, b) => a.dist - b.dist);
    setOpponents(entries.slice(0, 8));
  });

  if (opponents.length === 0) return null;

  return (
    <div
      style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)" }}
      className="flex flex-col gap-[3px] z-50 pointer-events-none"
    >
      {opponents.map(op => {
        const color = TYPE_COLORS[op.beyType] ?? "#aabbcc";
        return (
          <div
            key={op.id}
            style={{ border: `1px solid ${color}44` }}
            className="bg-[rgba(10,14,28,0.80)] rounded-[0.35rem] px-1.5 py-[2px] flex items-center gap-[5px] font-mono text-[0.6rem] backdrop-blur-sm"
          >
            <span style={{ color }} className="text-[0.55rem]">{tierLabel(op.tier)}</span>
            <span className="text-[#dde] max-w-16 overflow-hidden text-ellipsis whitespace-nowrap">
              {op.username}
            </span>
            <span style={{ color: op.spinPct >= 40 ? "#aaccee" : "#ff6644" }} className="ml-auto">
              {op.spinPct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

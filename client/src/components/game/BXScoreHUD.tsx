// BXScoreHUD — shown on scoring-mode arenas (Xtreme / Over / Pocket points).
// Renders a compact points board and fires a full-screen flash when a ring-out scores.

import { useEffect, useState } from "react";

export interface BXScoreEntry {
  userId: string;
  username: string;
  points: number;
  type: string;
}

interface BXScoreHUDProps {
  scoringMode: string | undefined;
  pointsTarget: number | undefined;
  playerPoints: Map<string, number> | undefined;
  beyblades: Map<string, { userId?: string; username?: string; type?: string; id: string }>;
  myUserId: string;
}

const TYPE_COLORS: Record<string, string> = {
  attack: "#ff4444",
  defense: "#4488ff",
  stamina: "#44ff88",
  balanced: "#ffcc44",
};

export function BXScoreHUD({ scoringMode, pointsTarget, playerPoints, beyblades, myUserId }: BXScoreHUDProps) {
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [prevPoints, setPrevPoints] = useState<Map<string, number>>(new Map());

  // Fire a brief flash whenever any player's score increases.
  useEffect(() => {
    if (!playerPoints) return;
    let changed = false;
    for (const [uid, pts] of playerPoints) {
      const prev = prevPoints.get(uid) ?? 0;
      if (pts > prev) { changed = true; break; }
    }
    if (changed) {
      const myPts = playerPoints.get(myUserId) ?? 0;
      const myPrev = prevPoints.get(myUserId) ?? 0;
      setFlashColor(myPts > myPrev ? "#ffcc44" : "rgba(255,255,255,0.3)");
      const t = setTimeout(() => setFlashColor(null), 180);
      setPrevPoints(new Map(playerPoints));
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPoints]);

  // Only render for scoring arenas.
  if (!scoringMode || scoringMode === "elimination") return null;

  const target = pointsTarget ?? 3;

  // Build sorted score list.
  const entries: BXScoreEntry[] = [];
  for (const [, bey] of beyblades) {
    if (!bey.userId) continue;
    entries.push({
      userId: bey.userId,
      username: bey.username ?? "Player",
      points: playerPoints?.get(bey.userId) ?? 0,
      type: bey.type ?? "balanced",
    });
  }
  entries.sort((a, b) => b.points - a.points);

  return (
    <>
      {/* Score board — top-center */}
      <div style={{
        position: "absolute",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
      }}
        className="flex flex-col items-center gap-1 pointer-events-none"
      >
        <div className="text-[10px] text-theme-muted tracking-[0.08em] uppercase">
          {scoringMode === "points" ? "Xtreme Points" : scoringMode} — first to {target}
        </div>
        <div className="flex gap-2">
          {entries.map(e => {
            const isMe = e.userId === myUserId;
            const color = TYPE_COLORS[e.type] ?? "#aaaaaa";
            return (
              <div key={e.userId}
                className="rounded-lg py-1 px-[10px] flex flex-col items-center min-w-[54px] border"
                style={{ background: isMe ? `${color}22` : "rgba(15,23,42,0.85)", borderColor: isMe ? color : "var(--border)" }}
              >
                <span className="text-[11px] text-theme-muted overflow-hidden max-w-[64px] text-ellipsis whitespace-nowrap">
                  {isMe ? "You" : e.username}
                </span>
                {/* Pip row */}
                <div className="flex gap-[3px] mt-[3px]">
                  {Array.from({ length: target }).map((_, i) => (
                    <div key={i} className="w-[10px] h-[10px] rounded-full transition-[background] duration-150 border" style={{ background: i < e.points ? color : "var(--bg3)", borderColor: `${color}55` }} />
                  ))}
                </div>
                <span className="text-[16px] font-bold mt-[2px]" style={{ color }}>{e.points}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen flash on score */}
      {flashColor && (
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none z-[50] [animation:bxFlash_0.18s_ease-out_forwards]" style={{ background: flashColor }} />
      )}
    </>
  );
}

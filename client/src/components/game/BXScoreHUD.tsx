// BXScoreHUD — shown on scoring-mode arenas (Xtreme / Over / Pocket points).
// Renders a compact points board and fires a full-screen flash when a ring-out scores.

import { useEffect, useState } from "react";
import { C } from "@/styles/theme";

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
        pointerEvents: "none",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {scoringMode === "points" ? "Xtreme Points" : scoringMode} — first to {target}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {entries.map(e => {
            const isMe = e.userId === myUserId;
            const color = TYPE_COLORS[e.type] ?? "#aaaaaa";
            return (
              <div key={e.userId} style={{
                background: isMe ? `${color}22` : "rgba(15,23,42,0.85)",
                border: `1px solid ${isMe ? color : C.border}`,
                borderRadius: 8,
                padding: "4px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 54,
              }}>
                <span style={{ fontSize: 11, color: C.muted, overflow: "hidden", maxWidth: 64, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isMe ? "You" : e.username}
                </span>
                {/* Pip row */}
                <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                  {Array.from({ length: target }).map((_, i) => (
                    <div key={i} style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: i < e.points ? color : C.bg3,
                      border: `1px solid ${color}55`,
                      transition: "background 150ms",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color, marginTop: 2 }}>{e.points}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-screen flash on score */}
      {flashColor && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: flashColor,
          opacity: 0.18,
          pointerEvents: "none",
          zIndex: 50,
          animation: "bxFlash 0.18s ease-out forwards",
        }} />
      )}
    </>
  );
}

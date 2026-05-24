// Phase 25 — RoyaleHUD: player strip sorted by spin%, zone timer, phase color ring.

import type { ServerGameState, ServerBeyblade } from "@/types/game";

interface RoyaleHUDProps {
  gameState: ServerGameState;
  myId: string;
}

const PHASE_COLORS = ["#ffcc00", "#ff9900", "#ff6600", "#ff3300", "#cc0000"];
const PHASE_LABELS = ["Full Arena", "Phase 1", "Phase 2", "Phase 3", "Phase 4 — FINAL"];
const DRAIN_RATES  = [0, 3, 6, 10, 15];

function spinPct(bey: ServerBeyblade): number {
  return Math.round((bey.spin / Math.max(1, bey.maxSpin)) * 100);
}

export function RoyaleHUD({ gameState, myId }: RoyaleHUDProps) {
  const arena = gameState.arena;
  if (!arena) return null;

  const phase = arena.safeZonePhase ?? 0;
  const timer = arena.safeZoneTimer ?? 0;
  const color = PHASE_COLORS[phase] ?? "#ffcc00";
  const label = PHASE_LABELS[phase] ?? "Phase";
  const drain = DRAIN_RATES[phase] ?? 0;

  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(Math.floor(timer % 60)).padStart(2, "0");

  const beyblades = gameState.beyblades
    ? Array.from((gameState.beyblades as Map<string, ServerBeyblade>).values())
        .filter(b => (b as any).isActive !== false)
        .sort((a, b) => spinPct(b) - spinPct(a))
    : [];

  return (
    <>
      {/* Zone timer bar */}
      <div style={{
        position: "absolute",
        top: "2.8rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 55,
        pointerEvents: "none",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
      }}>
        <div style={{ fontSize: "0.65rem", color, fontWeight: 700, letterSpacing: "0.05em" }}>
          {label}{drain > 0 ? ` — ${drain} spin/s outside` : ""}
        </div>
        <div style={{
          fontSize: "1rem", fontWeight: 700, color,
          textShadow: `0 0 8px ${color}88`,
        }}>
          {mm}:{ss}
        </div>
        {/* Progress strip */}
        <div style={{ display: "flex", gap: 3 }}>
          {PHASE_COLORS.map((c, i) => (
            <div key={i} style={{
              width: 14, height: 4, borderRadius: 2,
              background: i <= phase ? c : "rgba(255,255,255,0.12)",
            }} />
          ))}
        </div>
      </div>

      {/* Player strip */}
      <div style={{
        position: "absolute",
        left: "0.6rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        zIndex: 55,
        pointerEvents: "none",
        maxHeight: "60vh",
        overflowY: "hidden",
      }}>
        {beyblades.map(bey => {
          const pct = spinPct(bey);
          const isMe = bey.userId === myId || bey.id === myId;
          const barColor = pct >= 40 ? "#44dd88" : pct >= 10 ? "#ff8833" : "#ff3322";
          return (
            <div key={bey.id} style={{
              background: isMe ? "rgba(255,200,50,0.15)" : "rgba(10,14,28,0.80)",
              border: `1px solid ${isMe ? "#ffcc00" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "0.35rem",
              padding: "2px 6px",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              minWidth: 90,
              backdropFilter: "blur(2px)",
            }}>
              <span style={{ color: isMe ? "#ffcc00" : "#aabbcc", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {(bey as any).username ?? bey.userId?.slice(0, 8) ?? "?"}
              </span>
              <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 2 }} />
              </div>
              <span style={{ color: barColor, fontWeight: 700 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

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
      }}
        className="flex flex-col items-center gap-[3px] font-mono"
      >
        <div className="text-[0.65rem] font-bold tracking-[0.05em]" style={{ color }}>
          {label}{drain > 0 ? ` — ${drain} spin/s outside` : ""}
        </div>
        <div className="text-base font-bold" style={{ color, textShadow: `0 0 8px ${color}88` }}>
          {mm}:{ss}
        </div>
        {/* Progress strip */}
        <div className="flex gap-[3px]">
          {PHASE_COLORS.map((c, i) => (
            <div key={i} className="w-[14px] h-[4px] rounded-[2px]" style={{ background: i <= phase ? c : "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      </div>

      {/* Player strip */}
      <div style={{
        position: "absolute",
        left: "0.6rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 55,
        pointerEvents: "none",
        maxHeight: "60vh",
        overflowY: "hidden",
      }}
        className="flex flex-col gap-[3px]"
      >
        {beyblades.map(bey => {
          const pct = spinPct(bey);
          const isMe = bey.userId === myId || bey.id === myId;
          const barColor = pct >= 40 ? "#44dd88" : pct >= 10 ? "#ff8833" : "#ff3322";
          return (
            <div key={bey.id} className={`flex items-center gap-[5px] min-w-[90px] font-mono rounded-[0.35rem] px-[6px] py-[2px] text-[0.6rem] backdrop-blur-sm border ${isMe ? "bg-[rgba(255,200,50,0.15)] border-[#ffcc00]" : "bg-[rgba(10,14,28,0.80)] border-[rgba(255,255,255,0.1)]"}`}>
              <span className={`max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap ${isMe ? "text-[#ffcc00]" : "text-[#aabbcc]"}`}>
                {(bey as any).username ?? bey.userId?.slice(0, 8) ?? "?"}
              </span>
              <div className="flex-1 h-[3px] rounded-[2px] overflow-hidden bg-white/10">
                <div className="h-full rounded-[2px]" style={{ width: `${pct}%`, background: barColor }} />
              </div>
              <span className="font-bold" style={{ color: barColor }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

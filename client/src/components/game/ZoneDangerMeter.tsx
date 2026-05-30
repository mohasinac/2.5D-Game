import type { ServerGameState } from "@/types/game";

interface Props {
  gameState: ServerGameState;
  myId: string;
}

const PHASE_COLORS = ["#ffcc00", "#ff9900", "#ff6600", "#ff3300", "#cc0000"];

export function ZoneDangerMeter({ gameState, myId }: Props) {
  const arena = gameState.arena;
  if (!arena || (arena.safeZoneRadius ?? 0) === 0) return null;

  const radius = arena.safeZoneRadius!;
  const zx = arena.safeZoneX ?? 0;
  const zy = arena.safeZoneY ?? 0;
  const phase = arena.safeZonePhase ?? 0;
  const phaseColor = PHASE_COLORS[phase] ?? "#ffcc00";

  const beys = gameState.beyblades;
  let safeFrac = 1; // 1 = fully inside, 0 = far outside

  if (beys) {
    const myBey = Array.from((beys as Map<string, any>).values()).find(
      b => b.userId === myId || b.id === myId
    );
    if (myBey) {
      const dx = (myBey.x ?? 0) - zx;
      const dy = (myBey.y ?? 0) - zy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // safeFrac: 1 = at center, 0 = at 2× radius distance
      safeFrac = Math.max(0, Math.min(1, 1 - (dist - radius) / Math.max(1, radius)));
    }
  }

  const isInside = safeFrac >= 1;
  const fillColor = isInside ? "#00CC66" : phaseColor;
  const fillPct = isInside ? 100 : Math.round(safeFrac * 100);

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none z-[56]">
      {/* Label */}
      <span
        className="text-[0.55rem] font-bold tracking-[0.06em] uppercase"
        style={{ color: isInside ? "#00CC66" : phaseColor }}
      >
        {isInside ? "SAFE" : "DANGER"}
      </span>

      {/* Vertical bar */}
      <div
        className="w-[6px] rounded-full overflow-hidden"
        style={{
          height: 64,
          background: "rgba(255,255,255,0.08)",
          boxShadow: `0 0 4px ${fillColor}44`,
        }}
      >
        {/* Fill from bottom up */}
        <div
          className="w-full rounded-full transition-all duration-500"
          style={{
            height: `${fillPct}%`,
            background: fillColor,
            marginTop: `${100 - fillPct}%`,
            boxShadow: isInside ? "none" : `0 0 6px ${fillColor}`,
          }}
        />
      </div>

      {/* Bottom label */}
      <span className="text-[0.55rem] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
        ZONE
      </span>
    </div>
  );
}

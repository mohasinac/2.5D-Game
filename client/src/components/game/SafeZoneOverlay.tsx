import { useEffect, useRef, useState } from "react";
import type { ServerGameState } from "@/types/game";

interface Props {
  gameState: ServerGameState;
  myId: string;
}

const PHASE_LABELS = ["Full Arena", "Phase 1", "Phase 2", "Phase 3", "FINAL ZONE"];
const PHASE_COLORS = ["#ffcc00", "#ff9900", "#ff6600", "#ff3300", "#cc0000"];

export function SafeZoneOverlay({ gameState, myId }: Props) {
  const arena = gameState.arena;
  const [flashVisible, setFlashVisible] = useState(false);
  const [flashLabel, setFlashLabel] = useState("");
  const prevPhaseRef = useRef<number>(-1);

  const phase = arena?.safeZonePhase ?? 0;
  const radius = arena?.safeZoneRadius ?? 0;

  // Flash "ZONE CLOSING" when phase advances
  useEffect(() => {
    if (prevPhaseRef.current === -1) {
      prevPhaseRef.current = phase;
      return;
    }
    if (phase > prevPhaseRef.current) {
      const label = phase >= 4 ? "FINAL ZONE!" : "ZONE CLOSING";
      setFlashLabel(label);
      setFlashVisible(true);
      const t = setTimeout(() => setFlashVisible(false), 2200);
      prevPhaseRef.current = phase;
      return () => clearTimeout(t);
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  // Determine if player is outside safe zone
  const beys = gameState.beyblades;
  let isOutside = false;
  let distanceFrac = 0;

  if (beys && radius > 0) {
    const myBey = Array.from((beys as Map<string, any>).values()).find(
      b => b.userId === myId || b.id === myId
    );
    if (myBey) {
      const zx = arena?.safeZoneX ?? 0;
      const zy = arena?.safeZoneY ?? 0;
      // Beyblade x/y are in cm; safe zone x/y also in arena-local cm
      const dx = (myBey.x ?? 0) - zx;
      const dy = (myBey.y ?? 0) - zy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distanceFrac = Math.max(0, (dist - radius) / Math.max(1, radius));
      isOutside = dist > radius;
    }
  }

  if (radius === 0) return null;

  const phaseColor = PHASE_COLORS[phase] ?? "#ffcc00";

  return (
    <>
      {/* Phase transition flash */}
      {flashVisible && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[70]"
          style={{ animation: "zoneFlash 2.2s ease-out forwards" }}
        >
          <div
            className="text-center"
            style={{ filter: `drop-shadow(0 0 24px ${phaseColor})` }}
          >
            <div
              className="text-4xl font-black tracking-widest"
              style={{ color: phaseColor, textShadow: `0 0 20px ${phaseColor}` }}
            >
              {flashLabel}
            </div>
            <div className="text-sm font-bold mt-1 opacity-80" style={{ color: phaseColor }}>
              {PHASE_LABELS[phase] ?? ""}
            </div>
          </div>
        </div>
      )}

      {/* Outside-zone pulsing screen-edge warning */}
      {isOutside && (
        <div
          className="absolute inset-0 pointer-events-none z-[60]"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, ${phaseColor}${Math.round(Math.min(distanceFrac * 0.7, 0.55) * 255).toString(16).padStart(2, "0")} 100%)`,
            animation: "zoneEdgePulse 1.2s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes zoneFlash {
          0%   { opacity: 0; transform: scale(0.85); }
          10%  { opacity: 1; transform: scale(1.05); }
          30%  { opacity: 1; transform: scale(1); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes zoneEdgePulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </>
  );
}

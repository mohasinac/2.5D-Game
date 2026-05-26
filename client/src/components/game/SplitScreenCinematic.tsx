import React, { useState, useEffect } from "react";
import type { SplitScreenCinematicData } from "@/types/game";

interface SplitScreenCinematicProps {
  data: SplitScreenCinematicData;
  eliminatedBeyIds?: Set<string>;
  onEnd?: () => void;
}

const SPECIAL_EMOJIS: Record<string, string> = {
  stampede_rush: "⚡",
  gyro_anchor: "🛡️",
  spin_recovery: "♻️",
  tactical_burst: "💫",
  shock_pulse: "💥",
  ascending_dragon_bite: "🐉",
  storm_bringer: "🌪️",
};

const SPECIAL_COLORS: Record<string, string> = {
  stampede_rush: "#ff5522",
  gyro_anchor: "#4488ff",
  spin_recovery: "#44ff88",
  tactical_burst: "#ffcc44",
  shock_pulse: "#ff44aa",
  ascending_dragon_bite: "#ff2200",
  storm_bringer: "#00aaff",
};

export function SplitScreenCinematic({ data, eliminatedBeyIds, onEnd }: SplitScreenCinematicProps) {
  const [active, setActive] = useState(new Set(data.participants.map(p => p.beyId)));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Handle participant-out updates
  useEffect(() => {
    if (!eliminatedBeyIds || eliminatedBeyIds.size === 0) return;
    setActive(prev => {
      const next = new Set(prev);
      eliminatedBeyIds.forEach(id => next.delete(id));
      return next;
    });
  }, [eliminatedBeyIds]);

  const participants = data.participants;
  const n = participants.length;
  const cols = n <= 2 ? n : n <= 3 ? 3 : 2;
  const rows = n <= 3 ? 1 : 2;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in",
      }}
      className="grid pointer-events-none"
    >
      {participants.map(p => {
        const isActive = active.has(p.beyId);
        const color = SPECIAL_COLORS[p.specialMove] ?? "#ffffff";
        const emoji = SPECIAL_EMOJIS[p.specialMove] ?? "⚡";

        return (
          <div
            key={p.beyId}
            style={{
              background: isActive
                ? `linear-gradient(135deg, rgba(0,0,0,0.75), rgba(0,0,0,0.6))`
                : "rgba(0,0,0,0.85)",
              border: `2px solid rgba(255,255,255,0.15)`,
              transition: "opacity 0.4s",
              opacity: isActive ? 1 : 0.45,
            }}
            className="flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Glow border effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: `3px solid ${color}`,
                borderRadius: 0,
                boxShadow: `inset 0 0 30px ${color}44`,
                pointerEvents: "none",
              }}
            />

            {/* Content */}
            <div className="text-[40px] mb-2">{emoji}</div>
            <div className="text-[22px] font-bold text-white font-mono tracking-[2px]">
              {p.displayName}
            </div>
            <div style={{ color }} className="text-[13px] mt-1 uppercase tracking-[3px]">
              {p.specialMove.replace(/_/g, " ")}
            </div>

            {!isActive && (
              <div className="text-[14px] text-[#aaa] mt-2.5 italic">
                FINISHED
              </div>
            )}

            {/* Animated edge line */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 3,
                  background: color,
                  width: "100%",
                  animation: "shrink 2.5s linear forwards",
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

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
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in",
        pointerEvents: "none",
      }}
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
              borderRight: "2px solid rgba(255,255,255,0.15)",
              borderBottom: "2px solid rgba(255,255,255,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.4s",
              opacity: isActive ? 1 : 0.45,
              position: "relative",
              overflow: "hidden",
            }}
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
            <div style={{ fontSize: 40, marginBottom: 8 }}>{emoji}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", fontFamily: "monospace", letterSpacing: 2 }}>
              {p.displayName}
            </div>
            <div style={{ fontSize: 13, color, marginTop: 4, textTransform: "uppercase", letterSpacing: 3 }}>
              {p.specialMove.replace(/_/g, " ")}
            </div>

            {!isActive && (
              <div style={{ fontSize: 14, color: "#aaa", marginTop: 10, fontStyle: "italic" }}>
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

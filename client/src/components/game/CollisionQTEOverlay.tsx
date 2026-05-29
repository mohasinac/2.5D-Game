import React, { useEffect, useRef } from "react";

interface CollisionQTEOverlayProps {
  active: boolean;
  power: number;
  maxPower?: number;
  canFireSpecial: boolean;
  qteMultiplier: number;
  currentSP: number;
  onFireSpecial: () => void;
  onMash?: () => void;
}

function getPowerColor(power: number): string {
  if (power >= 150) return "#ffd700";
  if (power >= 100) return "#ff6600";
  if (power >= 80)  return "#ffaa00";
  if (power >= 50)  return "#ffcc00";
  return "#44ff88";
}

export function CollisionQTEOverlay({
  active,
  power,
  maxPower = 150,
  canFireSpecial,
  qteMultiplier,
  currentSP,
  onFireSpecial,
  onMash,
}: CollisionQTEOverlayProps) {
  const specialFiredRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      onMash?.();
      if (e.code === "Space" && canFireSpecial && !specialFiredRef.current) {
        e.preventDefault();
        specialFiredRef.current = true;
        onFireSpecial();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, canFireSpecial, onFireSpecial, onMash]);

  useEffect(() => {
    if (active) specialFiredRef.current = false;
  }, [active]);

  if (!active) return null;

  const fillPct = Math.min(100, (power / maxPower) * 100);
  const barColor = getPowerColor(power);
  const finalMult = qteMultiplier * (currentSP / 100);

  return (
    <div
      style={{
        width: 150,
        background: "rgba(8,10,20,0.82)",
        border: `1.5px solid ${barColor}88`,
        borderRadius: 10,
        padding: "7px 10px 8px",
        boxShadow: `0 3px 16px rgba(0,0,0,0.5), 0 0 10px ${barColor}22`,
        userSelect: "none",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      {/* Title */}
      <div style={{ fontSize: 9, fontWeight: 800, color: barColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        ⚡ CLASH — MASH!
      </div>

      {/* Power bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 3, height: 8, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", width: `${fillPct}%`,
          background: barColor, borderRadius: 3,
          transition: "width 0.05s linear, background 0.1s",
          boxShadow: fillPct >= 66 ? `0 0 6px ${barColor}` : undefined,
        }} />
      </div>

      {/* Power value + multiplier */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: barColor, fontWeight: 700 }}>{power}%</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>{finalMult.toFixed(1)}x</span>
      </div>

      {/* Special prompt */}
      {canFireSpecial && (
        <div
          style={{
            fontSize: 8, fontWeight: 800, color: "#ff8800",
            textAlign: "center", letterSpacing: "0.1em",
            padding: "3px 0",
            border: "1px solid #ff880055",
            borderRadius: 4,
            animation: "cqte-blink 0.5s infinite alternate",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          onClick={onFireSpecial}
        >
          🔥 [SPACE] SPECIAL
        </div>
      )}

      <style>{`
        @keyframes cqte-blink {
          from { opacity: 0.65; }
          to   { opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}

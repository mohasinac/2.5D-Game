import React, { useEffect, useRef, useState, useCallback } from "react";

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
  const [flashOn, setFlashOn] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerMash = useCallback(() => {
    navigator.vibrate?.(15);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashOn(true);
    flashTimerRef.current = setTimeout(() => setFlashOn(false), 100);
    onMash?.();
  }, [onMash]);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      triggerMash();
      if (e.code === "Space" && canFireSpecial && !specialFiredRef.current) {
        e.preventDefault();
        specialFiredRef.current = true;
        onFireSpecial();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, canFireSpecial, onFireSpecial, triggerMash]);

  useEffect(() => {
    if (active) specialFiredRef.current = false;
  }, [active]);

  useEffect(() => () => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
  }, []);

  if (!active) return null;

  const fillPct = Math.min(100, (power / maxPower) * 100);
  const barColor = getPowerColor(power);
  const finalMult = qteMultiplier * (currentSP / 100);

  return (
    <div
      onClick={triggerMash}
      onTouchStart={(e) => { e.preventDefault(); triggerMash(); }}
      style={{
        position: "fixed",
        bottom: "28%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 75,
        width: 180,
        background: flashOn ? "rgba(255,200,0,0.18)" : "rgba(8,10,20,0.92)",
        border: `1.5px solid ${flashOn ? barColor : barColor + "88"}`,
        borderRadius: 12,
        padding: "10px 12px 10px",
        boxShadow: flashOn
          ? `0 3px 16px rgba(0,0,0,0.6), 0 0 22px ${barColor}88`
          : `0 3px 16px rgba(0,0,0,0.6), 0 0 14px ${barColor}33`,
        userSelect: "none",
        pointerEvents: "auto",
        cursor: "pointer",
        touchAction: "none",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        transition: "background 0.05s, box-shadow 0.05s, border-color 0.05s",
      }}
    >
      {/* Title */}
      <div style={{ fontSize: 10, fontWeight: 800, color: barColor, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>
        ⚡ CLASH — TAP HERE!
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
            fontSize: 10, fontWeight: 800, color: "#ff8800",
            textAlign: "center", letterSpacing: "0.08em",
            padding: "8px 0",
            border: "1px solid #ff880088",
            borderRadius: 6,
            animation: "cqte-blink 0.5s infinite alternate",
            pointerEvents: "auto",
            cursor: "pointer",
            touchAction: "none",
          }}
          onClick={(e) => { e.stopPropagation(); navigator.vibrate?.(25); onFireSpecial(); }}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); navigator.vibrate?.(25); onFireSpecial(); }}
        >
          🔥 FIRE SPECIAL
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

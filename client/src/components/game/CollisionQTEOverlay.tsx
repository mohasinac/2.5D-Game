import React, { useEffect, useRef } from "react";

interface CollisionQTEOverlayProps {
  active: boolean;
  power: number;             // 0–150
  maxPower?: number;         // default 150
  canFireSpecial: boolean;
  qteMultiplier: number;
  currentSP: number;
  onFireSpecial: () => void;
  onMash?: () => void;       // called on any keydown during the QTE window
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

  // Any keydown → mash; Space → also fire special if available
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      // Mash on any key
      onMash?.();
      // Space additionally fires special
      if (e.code === "Space" && canFireSpecial && !specialFiredRef.current) {
        e.preventDefault();
        specialFiredRef.current = true;
        onFireSpecial();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, canFireSpecial, onFireSpecial, onMash]);

  // Reset ref when QTE becomes active
  useEffect(() => {
    if (active) specialFiredRef.current = false;
  }, [active]);

  if (!active) return null;

  const fillPct = Math.min(100, (power / maxPower) * 100);
  const barColor = getPowerColor(power);
  const isHard = power >= 100;
  const isOvercharged = power >= maxPower;
  const finalMult = qteMultiplier * (currentSP / 100);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        background: "rgba(0,0,0,0.82)",
        border: `2px solid ${barColor}`,
        borderRadius: 12,
        padding: "18px 28px",
        minWidth: 360,
        textAlign: "center",
        color: "#fff",
        fontFamily: "monospace",
        boxShadow: `0 0 24px ${barColor}44`,
        userSelect: "none",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, letterSpacing: 2 }}>
        ⚡ COLLISION! MASH BUTTONS! ⚡
      </div>

      {/* Power bar */}
      <div style={{ background: "#222", borderRadius: 6, height: 22, position: "relative", marginBottom: 6, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${fillPct}%`,
            background: barColor,
            borderRadius: 6,
            transition: "width 0.05s linear, background 0.1s",
            boxShadow: isOvercharged ? `0 0 12px ${barColor}` : undefined,
          }}
        />
        <div style={{ position: "absolute", right: 6, top: 2, fontSize: 13, fontWeight: "bold", color: "#fff", textShadow: "1px 1px 2px #000" }}>
          {power}%
        </div>
      </div>

      {/* Hard zone indicator */}
      {isHard && (
        <div
          style={{
            fontSize: 11,
            color: "#ff9900",
            marginBottom: 6,
            animation: "pulse 0.6s infinite alternate",
            opacity: 0.9,
          }}
        >
          ── GETTING HARDER ──
        </div>
      )}

      {/* Multiplier display */}
      <div style={{ fontSize: 13, color: "#aaa", marginBottom: 10 }}>
        QTE: <span style={{ color: barColor }}>{qteMultiplier.toFixed(2)}x</span>
        &nbsp;×&nbsp;
        SP: <span style={{ color: "#88aaff" }}>{currentSP}%</span>
        &nbsp;=&nbsp;
        <span style={{ color: "#fff", fontWeight: "bold" }}>{finalMult.toFixed(2)}x</span> damage
      </div>

      {/* Special fire prompt */}
      {canFireSpecial && (
        <button
          onClick={onFireSpecial}
          style={{
            background: "linear-gradient(135deg,#ff4400,#ff8800)",
            border: "2px solid #ffa500",
            borderRadius: 8,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 14,
            padding: "8px 18px",
            cursor: "pointer",
            animation: "blink 0.5s infinite alternate",
            letterSpacing: 1,
            boxShadow: "0 0 12px #ff6600",
          }}
        >
          🔥 PRESS [SPACE] TO FIRE SPECIAL! 🔥
        </button>
      )}

      <style>{`
        @keyframes pulse {
          from { opacity: 0.6; }
          to   { opacity: 1.0; }
        }
        @keyframes blink {
          from { opacity: 0.7; box-shadow: 0 0 8px #ff6600; }
          to   { opacity: 1.0; box-shadow: 0 0 20px #ff6600; }
        }
      `}</style>
    </div>
  );
}

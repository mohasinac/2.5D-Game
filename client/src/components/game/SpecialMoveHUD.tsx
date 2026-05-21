import { useEffect, useState } from "react";
import { C } from "@/styles/theme";

interface SpecialMoveData {
  id: string;
  name: string;
  iconEmoji: string;
  visual: {
    screenFlashColor?: string;
  };
}

interface SpecialMoveHUDProps {
  myBeyblade: any;
  specialMoveData: SpecialMoveData | null;
  lastSpecialMoveFired: string | null;
}

export function SpecialMoveHUD({ myBeyblade, specialMoveData, lastSpecialMoveFired }: SpecialMoveHUDProps) {
  const [flashColor, setFlashColor] = useState<string | null>(null);

  useEffect(() => {
    if (lastSpecialMoveFired && specialMoveData) {
      setFlashColor(specialMoveData.visual?.screenFlashColor || "#ff4444");
      const timeout = setTimeout(() => setFlashColor(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [lastSpecialMoveFired, specialMoveData]);

  if (!myBeyblade || !specialMoveData) return null;

  const power = myBeyblade.power ?? 0;
  const maxPower = 100;
  const powerPercent = Math.min(100, (power / maxPower) * 100);
  const cooldownProgress = (myBeyblade.specialCooldown ?? 0) > 0 ? ((myBeyblade.specialCooldown ?? 0) / 3000) * 100 : 0;
  const isReady = power >= 50 && (myBeyblade.specialCooldown ?? 0) <= 0;
  const powerBarColor = power >= 50 ? "#00ff88" : "#ffaa00";

  // Cooldown ring SVG (circumference based)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cooldownProgress / 100) * circumference;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        pointerEvents: "none",
        zIndex: 10,
        background: flashColor ? flashColor : undefined,
        opacity: flashColor ? 0.3 : undefined,
        transition: flashColor ? "opacity 200ms" : undefined,
        borderRadius: 12,
        padding: flashColor ? 12 : 0,
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "rgba(15, 23, 42, 0.9)",
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: 12,
        minWidth: 140,
      }}>
        {/* Icon and Name */}
        <div style={{ fontSize: 28 }}>{specialMoveData.iconEmoji}</div>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", fontFamily: "monospace", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {specialMoveData.name}
        </div>

        {/* Power Bar */}
        <div style={{ width: "100%", minWidth: 120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4, color: C.muted }}>
            <span>Power</span>
            <span style={{ fontFamily: "monospace", color: powerBarColor }}>{Math.round(powerPercent)}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: powerBarColor,
                borderRadius: 3,
                transition: "width 100ms",
                width: `${powerPercent}%`,
              }}
            />
          </div>
        </div>

        {/* Cooldown Ring with text */}
        <div style={{ position: "relative", width: 70, height: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={70} height={70} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            {/* Background ring */}
            <circle
              cx={35}
              cy={35}
              r={radius}
              fill="none"
              stroke={C.bg3}
              strokeWidth={3}
            />
            {/* Progress ring */}
            {cooldownProgress > 0 && (
              <circle
                cx={35}
                cy={35}
                r={radius}
                fill="none"
                stroke={C.yellow}
                strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 100ms linear" }}
              />
            )}
          </svg>
          {/* Center text */}
          <div style={{ textAlign: "center", fontSize: 10, color: C.text, fontFamily: "monospace", fontWeight: 700, zIndex: 1 }}>
            {cooldownProgress > 0 ? `${Math.round(100 - cooldownProgress)}%` : isReady ? "READY" : "—"}
          </div>
        </div>

        {/* Ready indicator */}
        {isReady && (
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.green,
            textTransform: "uppercase",
            animation: "pulse 1s infinite",
            textAlign: "center",
          }}>
            Ready to Use
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

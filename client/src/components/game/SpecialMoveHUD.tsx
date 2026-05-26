import React, { useEffect, useState } from "react";

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
      className="absolute pointer-events-none z-10 rounded-xl"
      style={{ bottom: 16, left: 16, "--fc": flashColor ?? "transparent", background: flashColor ? "var(--fc)" : undefined, opacity: flashColor ? 0.3 : undefined, transition: flashColor ? "opacity 200ms" : undefined, padding: flashColor ? 12 : undefined } as React.CSSProperties}
    >
      <div className="flex flex-col items-center gap-2 bg-[rgba(15,23,42,0.9)] rounded-xl border border-border-c p-3 min-w-[140px]">
        {/* Icon and Name */}
        <div className="text-[28px]">{specialMoveData.iconEmoji}</div>
        <div className="text-[11px] text-theme-muted text-center font-mono max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
          {specialMoveData.name}
        </div>

        {/* Power Bar */}
        <div className="w-full min-w-[120px]">
          <div className="flex justify-between text-[10px] mb-1 text-theme-muted">
            <span>Power</span>
            <span className="font-mono text-[color:var(--pbc)]" style={{ "--pbc": powerBarColor } as React.CSSProperties}>{Math.round(powerPercent)}%</span>
          </div>
          <div className="w-full h-[6px] bg-bg3 rounded-[3px] overflow-hidden">
            <div
              className="h-full rounded-[3px] [transition:width_100ms] bg-[color:var(--pbc)] w-[--pbw]"
              style={{ "--pbc": powerBarColor, "--pbw": `${powerPercent}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Cooldown Ring with text */}
        <div data-testid="special-move-power-ring" className="relative w-[70px] h-[70px] flex items-center justify-center">
          <svg width={70} height={70} className="absolute -rotate-90">
            {/* Background ring */}
            <circle cx={35} cy={35} r={radius} fill="none" stroke="var(--bg3)" strokeWidth={3} />
            {/* Progress ring */}
            {cooldownProgress > 0 && (
              <circle
                cx={35} cy={35} r={radius}
                fill="none" stroke="var(--yellow)" strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="[transition:stroke-dashoffset_100ms_linear]"
              />
            )}
          </svg>
          {/* Center text */}
          <div className="text-center text-[10px] text-theme-text font-mono font-bold z-[1]">
            {cooldownProgress > 0 ? `${Math.round(100 - cooldownProgress)}%` : isReady ? "READY" : "—"}
          </div>
        </div>

        {/* Ready indicator */}
        {isReady && (
          <div data-testid="special-move-active" className="text-[10px] font-bold text-theme-green uppercase text-center [animation:pulse_1s_infinite]">
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

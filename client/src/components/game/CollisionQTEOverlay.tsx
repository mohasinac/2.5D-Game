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
      className="fixed bg-black/[.82] rounded-xl py-[18px] px-[28px] min-w-[360px] text-center text-white font-mono select-none border-2 border-[--bc] shadow-[0_0_24px_var(--bs)] z-[1000]"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", "--bc": barColor, "--bs": `${barColor}44` } as React.CSSProperties}
    >
      <div className="text-[18px] font-bold mb-[10px] tracking-[2px]">
        ⚡ COLLISION! MASH BUTTONS! ⚡
      </div>

      {/* Power bar */}
      <div className="bg-[#222] rounded-[6px] h-[22px] relative mb-[6px] overflow-hidden">
        <div
          className={`h-full rounded-[6px] [transition:width_0.05s_linear,background_0.1s] w-[--fw] bg-[color:var(--bc)] ${isOvercharged ? "shadow-[0_0_12px_var(--bc)]" : ""}`}
          style={{ "--fw": `${fillPct}%`, "--bc": barColor } as React.CSSProperties}
        />
        <div className="absolute right-[6px] top-[2px] text-[13px] font-bold text-white [text-shadow:1px_1px_2px_#000]">
          {power}%
        </div>
      </div>

      {/* Hard zone indicator */}
      {isHard && (
        <div
          className="text-[11px] text-[#ff9900] mb-[6px] opacity-90 [animation:pulse_0.6s_infinite_alternate]"
        >
          ── GETTING HARDER ──
        </div>
      )}

      {/* Multiplier display */}
      <div className="text-[13px] text-[#aaa] mb-[10px]">
        QTE: <span className="text-[color:var(--tc)]" style={{ "--tc": barColor } as React.CSSProperties}>{qteMultiplier.toFixed(2)}x</span>
        &nbsp;×&nbsp;
        SP: <span className="text-[#88aaff]">{currentSP}%</span>
        &nbsp;=&nbsp;
        <span className="text-white font-bold">{finalMult.toFixed(2)}x</span> damage
      </div>

      {/* Special fire prompt */}
      {canFireSpecial && (
        <button
          onClick={onFireSpecial}
          className="rounded-lg text-white font-bold text-[14px] px-[18px] py-2 cursor-pointer tracking-[1px] bg-[linear-gradient(135deg,#ff4400,#ff8800)] border-2 border-[#ffa500] shadow-[0_0_12px_#ff6600] [animation:blink_0.5s_infinite_alternate]"
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

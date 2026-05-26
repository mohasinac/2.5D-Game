// Phase 28 HUD — SPBar: spin-percent bar with color bands.
// ≥75% = green, ≥40% = orange, ≥10% = red, <10% = rapid red flash.

import { useEffect, useRef, useState } from "react";

interface SPBarProps {
  spinPct: number;  // 0–100
  label?: string;
}

function bandColor(pct: number): string {
  if (pct >= 75) return "#44dd88";
  if (pct >= 40) return "#ffaa22";
  if (pct >= 10) return "#ff4433";
  return "#ff2200";
}

export function SPBar({ spinPct, label = "SPIN" }: SPBarProps) {
  const clamped = Math.max(0, Math.min(100, spinPct));
  const color = bandColor(clamped);
  const critical = clamped < 10;

  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (critical) {
      intervalRef.current = setInterval(() => setVisible(v => !v), 150);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setVisible(true);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [critical]);

  const fillStyle: React.CSSProperties = {
    "--pct": `${clamped}%`,
    background: visible ? color : "rgba(255,255,255,0.05)",
    boxShadow: visible && clamped > 0 ? `0 0 4px ${color}88` : "none",
    transition: critical ? "none" : "width 0.15s ease, background 0.3s ease",
  } as React.CSSProperties;

  return (
    <div className="flex flex-col items-stretch gap-[2px] w-[90px] font-mono">
      <div className="flex justify-between text-[0.55rem] text-[#aabbcc]">
        <span>{label}</span>
        <span style={{ color: visible ? color : "transparent" }} className="font-bold">{clamped}%</span>
      </div>
      <div className="h-[6px] rounded-[3px] bg-white/10 overflow-hidden">
        <div style={fillStyle} className="w-pct h-full rounded-[3px]" />
      </div>
    </div>
  );
}

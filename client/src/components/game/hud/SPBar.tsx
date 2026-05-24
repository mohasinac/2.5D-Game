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

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "stretch", gap: "2px",
      width: 90, fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "#aabbcc" }}>
        <span>{label}</span>
        <span style={{ color: visible ? color : "transparent", fontWeight: 700 }}>{clamped}%</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${clamped}%`, height: "100%",
          background: visible ? color : "rgba(255,255,255,0.05)",
          borderRadius: 3,
          transition: critical ? "none" : "width 0.15s ease, background 0.3s ease",
          boxShadow: visible && clamped > 0 ? `0 0 4px ${color}88` : "none",
        }} />
      </div>
    </div>
  );
}

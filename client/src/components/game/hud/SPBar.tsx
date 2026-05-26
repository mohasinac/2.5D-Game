import { useEffect, useRef, useState } from "react";
import React from "react";

interface SPBarProps {
  spinPct: number;
  label?: string;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
}

function barClass(pct: number, flashing: boolean): string {
  if (flashing) return "bg-white/20";
  if (pct >= 75) return "bg-theme-green";
  if (pct >= 40) return "bg-theme-yellow";
  return "bg-theme-red";
}

function labelClass(pct: number): string {
  if (pct >= 75) return "text-theme-green";
  if (pct >= 40) return "text-theme-yellow";
  return "text-theme-red";
}

const HEIGHT_CLASS: Record<"sm" | "md" | "lg", string> = {
  sm: "h-[3px]",
  md: "h-[5px]",
  lg: "h-[8px]",
};

export function SPBar({ spinPct, label = "SPIN", compact = false, size = "md" }: SPBarProps) {
  const clamped = Math.max(0, Math.min(100, spinPct));
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
    <div className={`flex flex-col gap-[3px] ${compact ? "w-20" : "w-full"} font-mono`}>
      <div className="flex justify-between items-center">
        <span className="text-[0.5rem] tracking-widest text-white/40 uppercase">{label}</span>
        <span className={`text-[0.55rem] font-bold ${visible ? labelClass(clamped) : "text-transparent"}`}>
          {clamped}%
        </span>
      </div>
      <div className={`${HEIGHT_CLASS[size]} rounded-full bg-white/10 overflow-hidden`}>
        <div
          className={`w-pct h-full rounded-full transition-[width] duration-150 ${barClass(clamped, critical && !visible)}`}
          style={{ "--pct": `${clamped}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

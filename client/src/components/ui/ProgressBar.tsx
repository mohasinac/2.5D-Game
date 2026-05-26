import type React from "react";
import { cn } from "@/lib/cn";

type BarColor = "blue" | "red" | "green" | "yellow" | "purple" | "orange";

interface Props {
  value: number;
  color?: BarColor;
  className?: string;
  height?: string;
}

const colorClasses: Record<BarColor, string> = {
  blue:   "bg-theme-blue",
  red:    "bg-theme-red",
  green:  "bg-theme-green",
  yellow: "bg-theme-yellow",
  purple: "bg-theme-purple",
  orange: "bg-theme-orange",
};

export function ProgressBar({ value, color = "blue", className, height = "h-1.5" }: Props) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div className={cn("w-full bg-bg3 rounded-full overflow-hidden", height, className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-150 w-pct", colorClasses[color])}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

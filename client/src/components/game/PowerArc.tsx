// PowerArc — circular charge meter for the LaunchPhase overlay.
// 270° speedometer arc with four color zones: blue (charging) → yellow (good) → green (perfect) → red (overpowered).

import React from "react";

interface PowerArcProps {
  power: number;        // 0–150 raw launch power
  size?: number;        // diameter in px, default 110
  strokeWidth?: number; // arc stroke width, default 10
}

const START = 135;   // start angle (degrees, clockwise from +X axis)
const SWEEP = 270;   // total arc span

function arc(cx: number, cy: number, r: number, s: number, e: number): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(s)); const y1 = cy + r * Math.sin(rad(s));
  const x2 = cx + r * Math.cos(rad(e)); const y2 = cy + r * Math.sin(rad(e));
  const large = e - s > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function zoneColor(pct: number): string {
  if (pct >= 95) return "#FF3333";
  if (pct >= 85) return "#00FF88";
  if (pct >= 50) return "#FFCC00";
  return "#4D9FFF";
}

function zoneLabel(pct: number): string {
  if (pct >= 95) return "OVERPOWERED";
  if (pct >= 85) return "PERFECT!";
  if (pct >= 50) return "GOOD POWER";
  return "CHARGING...";
}

export function PowerArc({ power, size = 110, strokeWidth = 10 }: PowerArcProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth * 2 - 4) / 2;

  // Display pct is 0-100 scaled from raw 0-150
  const pct = Math.min(100, (power / 150) * 100);
  const activeDeg = (pct / 100) * SWEEP;

  // Zone boundary angles (from START)
  const z1 = (50 / 100) * SWEEP;  // blue → yellow at 50%
  const z2 = (85 / 100) * SWEEP;  // yellow → green at 85%
  const z3 = (95 / 100) * SWEEP;  // green → red at 95%

  const color = zoneColor(pct);
  const label = zoneLabel(pct);
  const isPerfect = pct >= 85 && pct < 95;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden
      >
        {/* Zone background arcs */}
        <path d={arc(cx, cy, r, START, START + z1)}           fill="none" stroke="#4D9FFF1A" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={arc(cx, cy, r, START + z1, START + z2)}      fill="none" stroke="#FFCC001A" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={arc(cx, cy, r, START + z2, START + z3)}      fill="none" stroke="#00FF881A" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={arc(cx, cy, r, START + z3, START + SWEEP)}   fill="none" stroke="#FF33331A" strokeWidth={strokeWidth} strokeLinecap="round" />

        {/* Active fill */}
        {activeDeg > 1 && (
          <path
            d={arc(cx, cy, r, START, START + activeDeg)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: "stroke 150ms ease",
              filter: isPerfect ? `drop-shadow(0 0 6px ${color})` : undefined,
            }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="flex flex-col items-center justify-center z-10 pointer-events-none">
        <span
          className="text-[9px] font-mono uppercase tracking-wide"
          style={{ color: color + "99" }}
        >
          {label}
        </span>
        <span
          className="text-[22px] font-black font-mono leading-none mt-0.5"
          style={{
            color,
            textShadow: isPerfect ? `0 0 14px ${color}` : undefined,
            animation: isPerfect ? "pulse 0.4s ease-in-out infinite" : undefined,
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

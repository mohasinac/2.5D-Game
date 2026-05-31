// SpinArcBar — 270° circular arc showing spin duration remaining.
// Like a speedometer: green → orange → red as spin drops.
// Center shows the RPM value.

import React, { useMemo } from "react";
import { spinArcColor } from "@/constants/hudColors";

interface SpinArcBarProps {
  spin: number;
  maxSpin: number;
  size?: number;       // total SVG width/height in px (default 88)
  strokeWidth?: number;
}

export function SpinArcBar({ spin, maxSpin, size = 88, strokeWidth = 7 }: SpinArcBarProps) {
  const fraction = maxSpin > 0 ? Math.min(1, Math.max(0, spin / maxSpin)) : 0;
  const rpm = Math.round(spin);
  const color = spinArcColor(fraction);

  const center = size / 2;
  const radius = center - strokeWidth / 2 - 2;

  // Arc spans 270° (from 135° to 405°, i.e., bottom-left to bottom-right going clockwise).
  // SVG angles: 0° = 3 o'clock, increasing clockwise.
  const ARC_DEG = 270;
  const START_DEG = 135;  // bottom-left
  const circumference = 2 * Math.PI * radius;
  const arcLength = (ARC_DEG / 360) * circumference;
  const filledLength = fraction * arcLength;

  // Convert degrees to radians for SVG path
  function polarToCartesian(angleDeg: number): { x: number; y: number } {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
  }

  function arcPath(startDeg: number, endDeg: number): string {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const sweepDeg = ((endDeg - startDeg) + 360) % 360;
    const largeArc = sweepDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const bgPath   = arcPath(START_DEG, START_DEG + ARC_DEG);
  const fillDeg  = START_DEG + fraction * ARC_DEG;
  // Clamp so we don't draw a degenerate arc at 0%
  const fillPath = fraction > 0.005
    ? arcPath(START_DEG, fillDeg)
    : "";

  // Pulse glow when critical
  const isCritical = fraction < 0.2;

  // Container uses em so it scales with the vmin-proportional root font-size.
  // The SVG uses viewBox so internal geometry stays correct at any display size.
  const emSize = `${(size / 14).toFixed(3)}em`;
  return (
    <div className="relative flex items-center justify-center" style={{ width: emSize, height: emSize }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%' }} className="absolute inset-0">
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: isCritical ? `drop-shadow(0 0 4px ${color})` : undefined,
              transition: "stroke 0.4s ease-out",
            }}
          />
        )}
      </svg>

      {/* Center RPM number */}
      <div className="flex flex-col items-center z-[1] select-none pointer-events-none">
        <span
          className="font-mono font-bold leading-none"
          style={{
            fontSize: Math.round(size * 0.2),
            color,
            transition: "color 0.4s ease-out",
          }}
        >
          {rpm.toLocaleString()}
        </span>
        <span className="font-mono text-[rgba(255,255,255,0.45)] leading-none" style={{ fontSize: Math.round(size * 0.1) }}>
          RPM
        </span>
      </div>

      {/* Critical pulse ring */}
      {isCritical && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 12px 4px ${color}66`,
            animation: "spinCriticalPulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes spinCriticalPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// BurstMeter — 5-segment horizontal burst resistance bar.
// Segments pop off one by one as the beyblade takes damage.
// Last segment flashes red when one hit away from burst.

import React, { useEffect, useRef } from "react";
import { burstSegmentColor } from "@/constants/hudColors";

const TOTAL_SEGMENTS = 5;

interface BurstMeterProps {
  health: number;
  maxHealth: number;
  /** Whether to flip the bar direction (for opponent strip, bar fills right-to-left) */
  flip?: boolean;
  compact?: boolean;
}

export function BurstMeter({ health, maxHealth, flip = false, compact = false }: BurstMeterProps) {
  const prevHealth = useRef(health);
  const [popIndex, setPopIndex] = React.useState<number | null>(null);

  // Calculate remaining segments (0–5 based on health fraction)
  const fraction = maxHealth > 0 ? Math.min(1, Math.max(0, health / maxHealth)) : 0;
  const remaining = Math.round(fraction * TOTAL_SEGMENTS);

  // Trigger pop animation when a segment is lost
  useEffect(() => {
    if (health < prevHealth.current) {
      const newRemaining = Math.round((health / (maxHealth || 1)) * TOTAL_SEGMENTS);
      setPopIndex(newRemaining);
      const t = setTimeout(() => setPopIndex(null), 400);
      prevHealth.current = health;
      return () => clearTimeout(t);
    }
    prevHealth.current = health;
  }, [health, maxHealth]);

  const segH = compact ? 6 : 8;
  const segW = compact ? 16 : 22;
  const gap  = compact ? 2 : 3;

  const segments = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
    const segIndex = flip ? TOTAL_SEGMENTS - 1 - i : i;
    const isActive = segIndex < remaining;
    const isPopping = segIndex === popIndex;
    const color = isActive ? burstSegmentColor(segIndex, remaining) : "rgba(255,255,255,0.1)";

    return (
      <div
        key={i}
        style={{
          width: segW,
          height: segH,
          borderRadius: segH / 2,
          background: color,
          transition: "background 0.3s ease-out, transform 0.15s ease-out",
          transform: isPopping ? "scale(1.4)" : "scale(1)",
          boxShadow: isActive && remaining === 1 ? `0 0 6px 2px ${color}` : undefined,
        }}
      />
    );
  });

  return (
    <div
      className="flex items-center"
      style={{
        gap,
        flexDirection: flip ? "row-reverse" : "row",
        animation: remaining === 1 ? "burstWarningPulse 0.8s ease-in-out infinite" : undefined,
      }}
    >
      {segments}
      <style>{`
        @keyframes burstWarningPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

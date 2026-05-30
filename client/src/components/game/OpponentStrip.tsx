// OpponentStrip — mirrored HUD strip for opponent(s) shown at the top of screen.
// Smaller than PlayerStrip; burst meter flips right-to-left.

import React from "react";
import type { ServerBeyblade } from "@/types/game";
import { SpinArcBar } from "./SpinArcBar";
import { BurstMeter } from "./BurstMeter";
import { TYPE_COLORS } from "@/types/game";

interface OpponentStripProps {
  beyblade: ServerBeyblade;
  compact?: boolean;
}

function hexToStr(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}

export function OpponentStrip({ beyblade, compact = false }: OpponentStripProps) {
  const typeColor = hexToStr(TYPE_COLORS[beyblade.type] ?? 0xffffff);
  const arcSize = compact ? 56 : 68;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-xl backdrop-blur-sm pointer-events-none select-none"
      style={{
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${typeColor}22`,
      }}
    >
      {/* Name + burst (right-to-left) */}
      <div className="flex flex-col gap-1 min-w-0 items-end">
        <span
          className="font-mono font-bold truncate max-w-[90px]"
          style={{ fontSize: compact ? 9 : 11, color: typeColor }}
        >
          {beyblade.username || (beyblade.isAI ? "AI" : "???")}
        </span>
        <BurstMeter health={beyblade.power} maxHealth={100} flip compact={compact} />
      </div>

      {/* Spin arc (smaller) */}
      <SpinArcBar spin={beyblade.spin} maxSpin={beyblade.maxSpin} size={arcSize} strokeWidth={compact ? 5 : 6} />
    </div>
  );
}

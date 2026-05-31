// OpponentStrip — mirrored HUD strip for opponent(s) shown at the top of screen.
// Smaller than PlayerStrip; burst meter flips right-to-left.
// Accent color driven by slotColor (server-assigned per-player slot); type color is secondary.

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
  // Slot color is the primary accent; type color is used as secondary label only.
  const accentColor = beyblade.slotColor ?? typeColor;
  const arcSize = compact ? 56 : 68;

  return (
    <div
      data-testid="opponent-strip"
      className="flex items-center gap-2 px-2 py-1.5 rounded-xl backdrop-blur-sm pointer-events-none select-none"
      style={{
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${accentColor}44`,
      }}
    >
      {/* Name + burst (right-to-left) */}
      <div className="flex flex-col gap-1 min-w-0 items-end">
        <span
          className="font-mono font-bold truncate max-w-[6em]"
          style={{ fontSize: compact ? '0.7em' : '0.85em', color: accentColor }}
        >
          {beyblade.username || (beyblade.isAI ? "AI" : "???")}
        </span>
        {beyblade.isActive ? (
          <>
            <BurstMeter health={beyblade.power} maxHealth={100} flip compact={compact} />
            <span
              style={{ fontSize: '0.62em', color: typeColor, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {beyblade.type}
            </span>
          </>
        ) : (
          <span
            className="font-mono font-bold"
            style={{ fontSize: '0.7em', color: "#ff4444", letterSpacing: "0.08em" }}
          >
            ELIMINATED
          </span>
        )}
      </div>

      {/* Spin arc (smaller) */}
      <SpinArcBar spin={beyblade.spin} maxSpin={beyblade.maxSpin} size={arcSize} strokeWidth={compact ? 5 : 6} />
    </div>
  );
}

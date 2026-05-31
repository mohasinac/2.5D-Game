// PlayerStrip — the player's own HUD strip (bottom of screen).
// Shows: name, SpinArcBar (circular RPM arc), BurstMeter (5 segments).
// Accent color driven by slotColor (server-assigned per-player slot); type color is secondary.

import React from "react";
import type { ServerBeyblade } from "@/types/game";
import { SpinArcBar } from "./SpinArcBar";
import { BurstMeter } from "./BurstMeter";
import { TYPE_COLORS } from "@/types/game";

interface PlayerStripProps {
  beyblade: ServerBeyblade;
}

function hexToStr(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}

export function PlayerStrip({ beyblade }: PlayerStripProps) {
  const typeColor = hexToStr(TYPE_COLORS[beyblade.type] ?? 0xffffff);
  // Slot color is the primary accent; type color is used as secondary label only.
  const accentColor = beyblade.slotColor ?? typeColor;

  return (
    <div
      data-testid="player-strip"
      className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-sm pointer-events-none select-none"
      style={{
        background: "rgba(0,0,0,0.65)",
        border: `1px solid ${accentColor}55`,
        boxShadow: `0 0 12px 0 ${accentColor}33`,
      }}
    >
      {/* Spin arc */}
      <SpinArcBar spin={beyblade.spin} maxSpin={beyblade.maxSpin} size={80} strokeWidth={7} />

      {/* Name + burst */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <span
          className="font-mono font-bold text-xs truncate max-w-[7em]"
          style={{ color: accentColor }}
        >
          {beyblade.username || "YOU"}
        </span>
        <BurstMeter health={beyblade.power} maxHealth={100} />
        <span
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: '0.7em', color: typeColor, opacity: 0.6 }}
        >
          {beyblade.type}
        </span>
      </div>
    </div>
  );
}

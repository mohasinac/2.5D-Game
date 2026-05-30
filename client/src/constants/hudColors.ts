// HUD color constants — Clash Royale-inspired color contract.
// All HUD components must use these instead of raw hex strings for consistency.

export const HUD_COLORS = {
  // Status / state
  healthy:  "#00FF88",  // high spin, full burst — green
  warning:  "#FFAA00",  // medium spin, 2 burst segments — orange
  critical: "#FF3333",  // low spin, 1 burst left — red
  cooldown: "#4D9FFF",  // ability on cooldown — blue
  neutral:  "#AAAAAA",  // disabled / neutral state

  // Actions
  actionReady:   "#FFD700",  // gold — ability ready to use, launch button
  actionPressed: "#FFF176",  // lighter gold — pressed state

  // Combo system
  comboFill:    "#AA55FF",  // purple — combo meter fill
  comboMax:     "#FFD700",  // gold — combo at max multiplier

  // Arena / hazards
  hazardZone:   "#FF4500",  // orange-red — hazard overlap
  safeZone:     "#00CC66",  // green — safe zone interior
  safeZoneEdge: "#FFCC00",  // yellow — safe zone border

  // Text on dark backgrounds
  textPrimary: "#FFFFFF",
  textMuted:   "rgba(255,255,255,0.6)",
  textDim:     "rgba(255,255,255,0.35)",

  // Panel backgrounds
  panelBg:      "rgba(0,0,0,0.65)",
  panelBgLight: "rgba(0,0,0,0.4)",
  panelBorder:  "rgba(255,255,255,0.12)",

  // Type-based bey colors (matches TYPE_COLORS in game.ts)
  typeAttack:   "#EF4444",
  typeDefense:  "#3B82F6",
  typeStamina:  "#22C55E",
  typeBalanced: "#A855F7",
} as const;

export type HudColor = keyof typeof HUD_COLORS;

// Derive spin arc color from spin fraction (0–1)
export function spinArcColor(fraction: number): string {
  if (fraction > 0.5) return HUD_COLORS.healthy;
  if (fraction > 0.2) return HUD_COLORS.warning;
  return HUD_COLORS.critical;
}

// Derive burst meter segment color from segment index vs remaining segments
export function burstSegmentColor(segmentIndex: number, totalRemaining: number): string {
  if (totalRemaining <= 1) return HUD_COLORS.critical;
  if (totalRemaining <= 2) return HUD_COLORS.warning;
  return HUD_COLORS.actionReady;
}

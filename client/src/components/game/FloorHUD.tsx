/**
 * FloorHUD — vertical floor-stack indicator shown on the right side of the arena.
 * Shows the player which floor they're on, which floors are reachable, and the
 * alignment status of each nearby link (aligned / near-miss / misaligned / severed).
 *
 * Rotation indicators show each floor's CW/CCW direction and speed.
 * Link rows show alignment %, degrees-off, and traversal state.
 */

import React from "react";
import { alpha } from "@/styles/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LinkStatus = "aligned" | "near" | "misaligned" | "severed" | "disconnected" | "cooldown" | "always_open";
export type LinkAlignmentStatus = LinkStatus;
export type FloorLinkType = "corridor" | "portal" | "ramp" | "pit" | "trampoline";

export interface FloorLinkInfo {
  linkType: FloorLinkType;
  direction: "up" | "down";
  status: LinkStatus;
  /** 0 = perfectly aligned, 1 = fully misaligned */
  alignmentFraction: number;
  /** Current angular error in degrees */
  degreesOff?: number;
  /** Full error margin for this link in degrees */
  errorMarginDeg?: number;
  cooldownTicks?: number;
}

export interface FloorInfo {
  floorIndex: number;
  arenaName: string;
  links: FloorLinkInfo[];
  /** This arena's current rotation direction */
  rotationDirection?: "cw" | "ccw";
  /** This arena's rotation speed in degrees per second */
  rotationSpeedDegPerSec?: number;
}

interface Props {
  totalFloors: number;
  currentFloorIndex: number;
  floors: FloorInfo[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LINK_ICONS: Record<FloorLinkType, string> = {
  corridor:   "🚪",
  portal:     "🌀",
  ramp:       "📐",
  pit:        "⬇️",
  trampoline: "⬆️",
};

const STATUS_COLOR: Record<LinkStatus, string> = {
  aligned:      "#22c55e",
  near:         "#eab308",
  misaligned:   "#ef4444",
  severed:      "#334155",
  disconnected: "#334155",
  cooldown:     "#64748b",
  always_open:  "#a855f7",
};

const STATUS_LABEL: Record<LinkStatus, string> = {
  aligned:      "ALIGNED",
  near:         "NEAR",
  misaligned:   "LOCKED",
  severed:      "SEVERED",
  disconnected: "SEVERED",
  cooldown:     "WAIT",
  always_open:  "OPEN",
};

// ─── Alignment arc ─────────────────────────────────────────────────────────────

function AlignmentArc({ fraction, color, size = 22 }: { fraction: number; color: string; size?: number }) {
  const r    = size / 2 - 2.5;
  const circ = 2 * Math.PI * r;
  const fill = (1 - Math.min(fraction, 1)) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={alpha(color, 0.18)} strokeWidth={2.5} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray={circ}
        strokeDashoffset={circ - fill}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 180ms linear" }}
      />
    </svg>
  );
}

// ─── Rotation badge ───────────────────────────────────────────────────────────

/** Animated spinning ring showing CW or CCW rotation + speed */
function RotationBadge({ direction, speedDegPerSec }: { direction?: "cw" | "ccw"; speedDegPerSec?: number }) {
  if (!direction || !speedDegPerSec) {
    return <span style={{ color: alpha("#64748b", 0.4) }} className="text-[9px] font-mono">—</span>;
  }
  const secPerRev = (360 / speedDegPerSec).toFixed(1);
  const color = direction === "cw" ? "#3b82f6" : "#eab308";
  return (
    <div className="flex flex-col items-center gap-[1px] flex-shrink-0">
      <svg width={14} height={14} style={{ animation: `${direction === "cw" ? "rotCW" : "rotCCW"} ${secPerRev}s linear infinite` }}>
        <circle cx={7} cy={7} r={5} fill="none" stroke={alpha(color, 0.6)} strokeWidth={1.5} strokeDasharray="8 4" />
        <circle cx={7} cy={2} r={1.5} fill={color} />
      </svg>
      <span style={{ color }} className="text-[7px] font-mono font-bold">
        {direction === "cw" ? "CW" : "CCW"}
      </span>
    </div>
  );
}

// ─── Link row ─────────────────────────────────────────────────────────────────

function LinkRow({ link }: { link: FloorLinkInfo }) {
  const color = STATUS_COLOR[link.status];
  const isAlwaysOpen   = link.status === "always_open";
  const isDisconnected = link.status === "disconnected" || link.status === "severed";
  const isCooldown     = link.status === "cooldown";

  // Alignment percentage: 100% = perfectly aligned
  const alignPct = isAlwaysOpen
    ? 100
    : isDisconnected
    ? 0
    : Math.max(0, Math.round((1 - link.alignmentFraction) * 100));

  return (
    <div className="flex items-center gap-[5px] py-[3px]">
      {/* Arc or dot */}
      {isAlwaysOpen || isDisconnected ? (
        <div className="w-[22px] h-[22px] flex items-center justify-center">
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: color,
            boxShadow: isAlwaysOpen ? `0 0 6px ${color}` : "none",
          }} />
        </div>
      ) : (
        <AlignmentArc fraction={link.alignmentFraction} color={color} />
      )}

      {/* Icon */}
      <span className="text-[12px] leading-none">{LINK_ICONS[link.linkType]}</span>

      {/* Status + alignment detail */}
      <div className="flex-1 min-w-0">
        <div style={{ color }} className="text-[9px] font-bold font-mono tracking-[0.4px]">
          {isCooldown && link.cooldownTicks != null
            ? `WAIT ${link.cooldownTicks}t`
            : STATUS_LABEL[link.status]}
        </div>
        <div className="text-theme-faint text-[8px] mt-[0.5px] whitespace-nowrap overflow-hidden text-ellipsis">
          {isAlwaysOpen
            ? "no alignment"
            : isDisconnected
            ? link.cooldownTicks != null ? `recon in ${link.cooldownTicks}t` : "rotate to reconnect"
            : link.degreesOff != null && link.errorMarginDeg != null
            ? link.degreesOff <= link.errorMarginDeg
              ? `${alignPct}% ✓`
              : `${link.degreesOff.toFixed(0)}° off (±${link.errorMarginDeg}°)`
            : `${alignPct}%`
          }
        </div>
      </div>

      {/* Enter / blocked indicator */}
      <span style={{
        color: link.status === "aligned" || link.status === "always_open" ? "#22c55e"
             : link.status === "near" ? "#eab308"
             : "#64748b",
      }} className="text-[10px] font-bold flex-shrink-0">
        {link.status === "aligned" || link.status === "always_open"
          ? link.direction === "up" ? "↑" : "↓"
          : link.status === "near"
          ? "~"
          : "✕"}
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FloorHUD({ totalFloors, currentFloorIndex, floors }: Props) {
  if (totalFloors <= 1) return null;

  const cardBorderColor = "#334155";
  const cardBg = "rgba(15,23,42,0.88)";
  const cardPadding = "5px 9px";

  const anyRotating = floors.some(f => f.rotationDirection && f.rotationSpeedDegPerSec);

  return (
    <>
      <style>{`
        @keyframes floorGlow {
          0%,100% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50%      { border-color: rgba(59,130,246,0.7); box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        }
        @keyframes rotCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes rotCCW { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
      `}</style>

      <div style={{
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 15,
        width: 136,
      }}
        className="pointer-events-none flex flex-col items-stretch select-none gap-0"
      >

        {/* Render top → bottom = highest floor index → F0 */}
        {Array.from({ length: totalFloors }).map((_, revIdx) => {
          const fi      = totalFloors - 1 - revIdx;
          const info    = floors.find(f => f.floorIndex === fi);
          const isCur   = fi === currentFloorIndex;
          const upLinks = info?.links.filter(l => l.direction === "up")   ?? [];
          const dnLinks = info?.links.filter(l => l.direction === "down") ?? [];

          return (
            <div key={fi}>
              {/* ── Up-links connector strip ── */}
              {upLinks.length > 0 && (
                <div style={{
                  background: cardBg,
                  border: `1px solid ${cardBorderColor}`,
                  padding: cardPadding,
                  borderRadius: "8px 8px 0 0",
                  borderBottom: "none",
                }}>
                  {upLinks.map((l, i) => <LinkRow key={i} link={l} />)}
                </div>
              )}

              {/* ── Floor tile ── */}
              <div style={{
                background: isCur ? alpha("#3b82f6", 0.18) : cardBg,
                border: `1px solid ${isCur ? "#3b82f6" : cardBorderColor}`,
                padding: cardPadding,
                borderRadius:
                  upLinks.length > 0 && dnLinks.length > 0 ? 0
                  : upLinks.length > 0 ? "0 0 8px 8px"
                  : dnLinks.length > 0 ? "8px 8px 0 0"
                  : 8,
                animation: isCur ? "floorGlow 2.4s ease-in-out infinite" : "none",
              }}
                className="flex items-center gap-[6px]"
              >
                {/* Floor index badge */}
                <div style={{
                  background: isCur ? "#3b82f6" : "#1e293b",
                  color: isCur ? "#fff" : "#64748b",
                }} className="w-[22px] h-[22px] rounded-[6px] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                  F{fi}
                </div>

                {/* Name + status */}
                <div className="flex-1 min-w-0">
                  <div style={{
                    fontWeight: isCur ? 700 : 500,
                    color: isCur ? "#f1f5f9" : "#94a3b8",
                  }} className="text-[11px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {info?.arenaName ?? `Floor ${fi}`}
                  </div>
                  {isCur && (
                    <div className="text-theme-blue text-[9px] font-bold tracking-[0.5px] mt-[1px]">
                      ◆ HERE
                    </div>
                  )}
                </div>

                {/* Rotation badge */}
                <RotationBadge
                  direction={info?.rotationDirection}
                  speedDegPerSec={info?.rotationSpeedDegPerSec}
                />
              </div>

              {/* ── Down-links connector strip ── */}
              {dnLinks.length > 0 && (
                <div style={{
                  background: cardBg,
                  border: `1px solid ${cardBorderColor}`,
                  padding: cardPadding,
                  borderRadius: "0 0 8px 8px",
                  borderTop: "none",
                }}>
                  {dnLinks.map((l, i) => <LinkRow key={i} link={l} />)}
                </div>
              )}

              {/* Thin connector between floor groups */}
              {fi > 0 && (
                <div className="w-[2px] h-2 mx-auto bg-border-c" />
              )}
            </div>
          );
        })}

        {/* Ground label */}
        <div className="text-theme-faint text-center text-[9px] mt-[2px] tracking-[0.5px] font-semibold">
          ▼ GROUND
        </div>

        {/* Rotation legend */}
        {anyRotating && (
          <div className="mt-[5px] px-[6px] py-[3px] rounded-[6px] text-[8px] flex gap-[6px] justify-center bg-[rgba(15,23,42,0.7)] border border-border-c text-theme-faint">
            <span><span className="text-theme-blue">↻</span> CW</span>
            <span><span className="text-theme-yellow">↺</span> CCW</span>
            <span><span className="text-theme-green">↑↓</span> open</span>
          </div>
        )}
      </div>
    </>
  );
}

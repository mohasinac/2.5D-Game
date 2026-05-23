/**
 * FloorHUD — vertical floor-stack indicator shown on the right side of the arena.
 * Shows the player which floor they're on, which floors are reachable, and the
 * alignment status of each nearby link (aligned / near-miss / misaligned / severed).
 *
 * Rotation indicators show each floor's CW/CCW direction and speed.
 * Link rows show alignment %, degrees-off, and traversal state.
 */

import { C, alpha } from "@/styles/theme";

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
  aligned:      C.green,
  near:         C.yellow,
  misaligned:   C.red,
  severed:      "#334155",
  disconnected: "#334155",
  cooldown:     C.faint,
  always_open:  C.purple,
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
    return <span style={{ fontSize: 9, color: alpha(C.faint, 0.4), fontFamily: "monospace" }}>—</span>;
  }
  const secPerRev = (360 / speedDegPerSec).toFixed(1);
  const color = direction === "cw" ? C.blue : C.yellow;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0 }}>
      <svg width={14} height={14} style={{ animation: `${direction === "cw" ? "rotCW" : "rotCCW"} ${secPerRev}s linear infinite` }}>
        <circle cx={7} cy={7} r={5} fill="none" stroke={alpha(color, 0.6)} strokeWidth={1.5} strokeDasharray="8 4" />
        <circle cx={7} cy={2} r={1.5} fill={color} />
      </svg>
      <span style={{ fontSize: 7, color, fontFamily: "monospace", fontWeight: 700 }}>
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
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0" }}>
      {/* Arc or dot */}
      {isAlwaysOpen || isDisconnected ? (
        <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: color,
            boxShadow: isAlwaysOpen ? `0 0 6px ${color}` : "none",
          }} />
        </div>
      ) : (
        <AlignmentArc fraction={link.alignmentFraction} color={color} />
      )}

      {/* Icon */}
      <span style={{ fontSize: 12, lineHeight: 1 }}>{LINK_ICONS[link.linkType]}</span>

      {/* Status + alignment detail */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: 0.4 }}>
          {isCooldown && link.cooldownTicks != null
            ? `WAIT ${link.cooldownTicks}t`
            : STATUS_LABEL[link.status]}
        </div>
        <div style={{ fontSize: 8, color: C.faint, marginTop: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
        fontSize: 10, fontWeight: 700, flexShrink: 0,
        color: link.status === "aligned" || link.status === "always_open" ? C.green
             : link.status === "near" ? C.yellow
             : C.faint,
      }}>
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

  const card: React.CSSProperties = {
    background: "rgba(15,23,42,0.88)",
    border: `1px solid ${C.border}`,
    padding: "5px 9px",
  };

  const anyRotating = floors.some(f => f.rotationDirection && f.rotationSpeedDegPerSec);

  return (
    <>
      <style>{`
        @keyframes floorGlow {
          0%,100% { border-color: ${C.blue}; box-shadow: 0 0 0 0 ${alpha(C.blue, 0.4)}; }
          50%      { border-color: ${alpha(C.blue, 0.7)}; box-shadow: 0 0 0 3px ${alpha(C.blue, 0.12)}; }
        }
        @keyframes rotCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes rotCCW { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
      `}</style>

      <div style={{
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        zIndex: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: 136,
        userSelect: "none",
        gap: 0,
      }}>

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
                <div style={{ ...card, borderRadius: "8px 8px 0 0", borderBottom: "none" }}>
                  {upLinks.map((l, i) => <LinkRow key={i} link={l} />)}
                </div>
              )}

              {/* ── Floor tile ── */}
              <div style={{
                ...card,
                borderRadius:
                  upLinks.length > 0 && dnLinks.length > 0 ? 0
                  : upLinks.length > 0 ? "0 0 8px 8px"
                  : dnLinks.length > 0 ? "8px 8px 0 0"
                  : 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: isCur ? alpha(C.blue, 0.18) : "rgba(15,23,42,0.88)",
                borderColor: isCur ? C.blue : C.border,
                animation: isCur ? "floorGlow 2.4s ease-in-out infinite" : "none",
              }}>
                {/* Floor index badge */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: isCur ? C.blue : C.bg3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: isCur ? "#fff" : C.faint,
                }}>
                  F{fi}
                </div>

                {/* Name + status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11, fontWeight: isCur ? 700 : 500,
                    color: isCur ? C.text : C.muted,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {info?.arenaName ?? `Floor ${fi}`}
                  </div>
                  {isCur && (
                    <div style={{ fontSize: 9, color: C.blue, fontWeight: 700, letterSpacing: 0.5, marginTop: 1 }}>
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
                <div style={{ ...card, borderRadius: "0 0 8px 8px", borderTop: "none" }}>
                  {dnLinks.map((l, i) => <LinkRow key={i} link={l} />)}
                </div>
              )}

              {/* Thin connector between floor groups */}
              {fi > 0 && (
                <div style={{ width: 2, height: 8, background: C.border, margin: "0 auto" }} />
              )}
            </div>
          );
        })}

        {/* Ground label */}
        <div style={{ textAlign: "center", fontSize: 9, color: C.faint, marginTop: 2, letterSpacing: 0.5, fontWeight: 600 }}>
          ▼ GROUND
        </div>

        {/* Rotation legend */}
        {anyRotating && (
          <div style={{
            marginTop: 5, padding: "3px 6px",
            background: "rgba(15,23,42,0.7)", border: `1px solid ${C.border}`, borderRadius: 6,
            fontSize: 8, color: C.faint, display: "flex", gap: 6, justifyContent: "center",
          }}>
            <span><span style={{ color: C.blue }}>↻</span> CW</span>
            <span><span style={{ color: C.yellow }}>↺</span> CCW</span>
            <span><span style={{ color: C.green }}>↑↓</span> open</span>
          </div>
        )}
      </div>
    </>
  );
}

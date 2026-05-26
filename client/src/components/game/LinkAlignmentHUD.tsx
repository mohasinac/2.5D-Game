/**
 * LinkAlignmentHUD — bottom-center HUD showing alignment status for nearby floor links.
 *
 * Per-link card contains:
 *   - Dual-compass SVG: two small arena circles showing their current opening angles
 *     and the angular gap between them vs the tolerance zone (green arc).
 *   - Angular difference readout: "Xdeg off" or "ALIGNED ✓"
 *   - Correction zone indicator: shaded arc showing the ±errorMarginDeg window.
 *   - For severed links: "Ndeg until reconnect" with a countdown arc.
 *   - Status summary bar at the bottom showing the nearest actionable link.
 */

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LinkAlignmentStatus = "aligned" | "near" | "misaligned" | "severed" | "cooldown" | "always_open";

export interface LinkAlignmentInfo {
  id: string;
  linkType: "corridor" | "portal" | "ramp" | "pit" | "trampoline";
  direction: "up" | "down";
  alignmentStatus: LinkAlignmentStatus;
  /** Current angular error in degrees (0 = perfectly aligned). */
  degreesOff: number;
  /** Total error margin for this link (ArenaLinkAlignmentConfig.errorMarginDeg). */
  errorMarginDeg: number;
  cooldownTicks?: number;
  optOutTicksLeft?: number;
}

interface Props {
  links: LinkAlignmentInfo[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, string> = {
  corridor:   "🚪",
  portal:     "🌀",
  ramp:       "📐",
  pit:        "⬇️",
  trampoline: "⬆️",
};

const STATUS_COLORS: Record<LinkAlignmentStatus, string> = {
  aligned:     "#22c55e",
  near:        "#eab308",
  misaligned:  "#ef4444",
  severed:     "#475569",
  always_open: "#a855f7",
  cooldown:    "#eab308",
};

// ─── Dual compass ─────────────────────────────────────────────────────────────

/**
 * Two arena circles side by side, each with an opening notch.
 * The left arena's opening rotates based on degreesOff, showing the angular gap.
 * The green arc shows the ±errorMarginDeg tolerance zone.
 * For "always_open" portals, shows a single pulsing ring.
 * For "severed" links, shows a dashed ring with a reconnect arc.
 */
function DualCompass({ link }: { link: LinkAlignmentInfo }) {
  const SIZE = 76;
  const W = SIZE * 2 + 14;
  const H = SIZE;
  const r   = SIZE / 2 - 4;
  const cx1 = SIZE / 2, cy = SIZE / 2;
  const cx2 = SIZE + 14 + SIZE / 2;

  const color = STATUS_COLORS[link.alignmentStatus];
  const isAlways  = link.alignmentStatus === "always_open";
  const isSevered = link.alignmentStatus === "severed" || link.alignmentStatus === "cooldown";
  const isAligned = link.alignmentStatus === "aligned";

  // Current opening angle of arena A (offset by degreesOff from aligned position)
  const alignedAngle = 0; // 0 = pointing right = toward arena B
  const curAngle     = (alignedAngle + link.degreesOff) * (Math.PI / 180);

  // Arena A opening position
  const ox1 = cx1 + r * Math.cos(curAngle);
  const oy1 = cy  + r * Math.sin(curAngle);

  // Arena B opening position (always pointing left = Math.PI)
  const ox2 = cx2 + r * Math.cos(Math.PI);
  const oy2 = cy;

  // Error margin arc extents on arena A
  const marginRad = (link.errorMarginDeg * Math.PI) / 180;
  const arcS = cx1 + r * Math.cos(-marginRad);
  const arcT = cy  + r * Math.sin(-marginRad);
  const arcE = cx1 + r * Math.cos(+marginRad);
  const arcU = cy  + r * Math.sin(+marginRad);

  // For severed: show degrees until back in tolerance zone
  const degUntilAligned = Math.max(0, link.degreesOff - link.errorMarginDeg);

  // Connection line color + style
  const lineColor = isAlways ? "#a855f7"
    : isSevered ? "#475569"
    : isAligned ? "#22c55e"
    : link.alignmentStatus === "near" ? "#eab308"
    : "#ef4444";

  return (
    <svg width={W} height={H} className="overflow-visible block">
      {/* ── Error margin tolerance arc on arena A ── */}
      {!isAlways && !isSevered && (
        <path
          d={`M${cx1} ${cy} L${arcS} ${arcT} A${r} ${r} 0 ${marginRad * 2 > Math.PI ? 1 : 0} 1 ${arcE} ${arcU} Z`}
          fill="color-mix(in srgb, #22c55e 18%, transparent)" stroke="color-mix(in srgb, #22c55e 40%, transparent)" strokeWidth={0.5}
        />
      )}

      {/* ── Arena A circle ── */}
      {isAlways ? (
        <>
          <circle cx={cx1} cy={cy} r={r} fill="color-mix(in srgb, #a855f7 8%, transparent)" stroke="color-mix(in srgb, #a855f7 50%, transparent)" strokeWidth={2} strokeDasharray="6 3" />
          <circle cx={cx1} cy={cy} r={r - 6} fill="none" stroke="color-mix(in srgb, #a855f7 25%, transparent)" strokeWidth={1} strokeDasharray="3 3" />
        </>
      ) : isSevered ? (
        <circle cx={cx1} cy={cy} r={r} fill="none" stroke="color-mix(in srgb, #475569 60%, transparent)" strokeWidth={2} strokeDasharray="5 5" />
      ) : (
        <circle cx={cx1} cy={cy} r={r} fill={`color-mix(in srgb, ${color} 6%, transparent)`} stroke={`color-mix(in srgb, ${color} 45%, transparent)`} strokeWidth={2} />
      )}

      {/* ── Arena B circle ── */}
      {isAlways ? (
        <circle cx={cx2} cy={cy} r={r} fill="color-mix(in srgb, #a855f7 8%, transparent)" stroke="color-mix(in srgb, #a855f7 50%, transparent)" strokeWidth={2} strokeDasharray="6 3" />
      ) : (
        <circle cx={cx2} cy={cy} r={r} fill={`color-mix(in srgb, ${color} 4%, transparent)`} stroke="color-mix(in srgb, #334155 60%, transparent)" strokeWidth={1.5} />
      )}

      {/* ── Opening notch on arena A (rotates with degreesOff) ── */}
      {!isAlways && (
        <circle cx={ox1} cy={oy1} r={3.5}
          fill={isAligned ? "#22c55e" : isSevered ? "#475569" : color}
          opacity={isSevered ? 0.5 : 1} />
      )}

      {/* ── Opening notch on arena B (fixed, points left) ── */}
      {!isAlways && (
        <circle cx={ox2} cy={oy2} r={3.5} fill="color-mix(in srgb, #3b82f6 80%, transparent)" />
      )}

      {/* ── Connection line between openings ── */}
      {!isAlways && (
        <line x1={ox1} y1={oy1} x2={ox2} y2={oy2}
          stroke={lineColor} strokeWidth={isSevered ? 1 : 1.5}
          strokeDasharray={isSevered ? "4 3" : isAligned ? "none" : "5 3"}
          opacity={isSevered ? 0.4 : 1}
        />
      )}

      {/* ── Portal: always-open ring with center dot ── */}
      {isAlways && (
        <circle cx={(cx1 + cx2) / 2} cy={cy} r={4} fill="#a855f7" opacity={0.8} />
      )}

      {/* ── Angular gap arc (degreesOff indicator on arena A) ── */}
      {!isAlways && !isSevered && link.degreesOff > 1 && (
        <>
          <path
            d={`M${cx1 + r * 0.55} ${cy} A${r * 0.55} ${r * 0.55} 0 0 1 ${cx1 + r * 0.55 * Math.cos(curAngle)} ${cy + r * 0.55 * Math.sin(curAngle)}`}
            fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.7}
          />
          <text
            x={cx1 + r * 0.78 * Math.cos(curAngle / 2)}
            y={cy + r * 0.78 * Math.sin(curAngle / 2) + 4}
            fontSize={8} fill={color} textAnchor="middle" fontWeight="bold">
            {link.degreesOff.toFixed(0)}°
          </text>
        </>
      )}

      {/* ── Severed: degrees-until-reconnect arc ── */}
      {isSevered && degUntilAligned > 0 && (
        <>
          <text x={cx1} y={cy + 4} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="bold">
            {degUntilAligned.toFixed(0)}°
          </text>
          <text x={cx1} y={cy + 15} textAnchor="middle" fontSize={7} fill="color-mix(in srgb, #475569 70%, transparent)">
            to reconnect
          </text>
        </>
      )}

      {/* ── Cooldown tick countdown ── */}
      {link.alignmentStatus === "cooldown" && link.cooldownTicks != null && (
        <text x={cx1} y={cy + 4} textAnchor="middle" fontSize={10} fill="#eab308" fontWeight="bold">
          {Math.ceil(link.cooldownTicks / 60)}s
        </text>
      )}

      {/* ── Labels ── */}
      <text x={cx1} y={H - 1} textAnchor="middle" fontSize={8} fill="#64748b">Arena A</text>
      <text x={cx2} y={H - 1} textAnchor="middle" fontSize={8} fill="#64748b">Arena B</text>
    </svg>
  );
}

// ─── Per-link card ────────────────────────────────────────────────────────────

function LinkCard({ link }: { link: LinkAlignmentInfo }) {
  const color = STATUS_COLORS[link.alignmentStatus];
  const isAligned = link.alignmentStatus === "aligned" || link.alignmentStatus === "always_open";
  const isSevered = link.alignmentStatus === "severed" || link.alignmentStatus === "cooldown";

  return (
    <div className="flex flex-col items-center gap-[5px] relative">
      <style>{`
        @keyframes lhudGlow  { 0%,100%{filter:drop-shadow(0 0 3px ${color}66)} 50%{filter:drop-shadow(0 0 9px ${color}cc)} }
        @keyframes lhudFlash { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Dual compass */}
      <div
        className={`bg-[rgba(15,23,42,0.8)] rounded-[10px] px-2 py-[6px] border border-[--lbc] ${isAligned ? "[animation:lhudGlow_1.5s_ease-in-out_infinite]" : ""}`}
        style={{ "--lbc": `color-mix(in srgb, ${color} ${isSevered ? "20%" : "35%"}, transparent)` } as React.CSSProperties}
      >
        <DualCompass link={link} />
      </div>

      {/* Angular readout */}
      <div
        className={`flex items-center gap-[5px] px-[10px] py-[3px] rounded-[20px] border border-[--lbc2] bg-[--lbg] ${isAligned ? "[animation:lhudFlash_1.2s_ease-in-out_infinite]" : ""}`}
        style={{ "--lbc2": `color-mix(in srgb, ${color} 30%, transparent)`, "--lbg": `color-mix(in srgb, ${isAligned ? color : "#0f172a"} ${isAligned ? "12%" : "80%"}, transparent)` } as React.CSSProperties}
      >
        <span className="text-[13px] leading-none">{LINK_ICONS[link.linkType]}</span>
        <span className="text-[10px] font-bold font-mono text-[color:var(--lc)]" style={{ "--lc": color } as React.CSSProperties}>
          {link.alignmentStatus === "always_open"
            ? "OPEN"
            : link.alignmentStatus === "aligned"
            ? "✓ GO"
            : link.alignmentStatus === "near"
            ? `${link.degreesOff.toFixed(0)}° near`
            : link.alignmentStatus === "severed"
            ? link.cooldownTicks ? `${Math.ceil(link.cooldownTicks / 60)}s cooldown` : "SEVERED"
            : link.alignmentStatus === "cooldown"
            ? `${Math.ceil((link.cooldownTicks ?? 0) / 60)}s wait`
            : `${link.degreesOff.toFixed(0)}° off`
          }
        </span>
        {link.alignmentStatus !== "always_open" && link.alignmentStatus !== "aligned" && (
          <span className="text-[9px] text-theme-faint">(±{link.errorMarginDeg}°)</span>
        )}
      </div>

      {/* Direction label */}
      <div className="text-[9px] text-theme-faint uppercase tracking-[0.5px]">
        {link.direction === "up" ? "↑ UP" : "↓ DOWN"}
      </div>

      {/* Trampoline opt-out hint */}
      {link.linkType === "trampoline" && link.optOutTicksLeft != null && (
        <div className="text-[9px] font-bold rounded-[6px] px-[6px] py-[2px] text-theme-yellow bg-[rgba(234,179,8,0.1)] border border-[rgba(234,179,8,0.3)] [animation:lhudFlash_0.8s_ease-in-out_infinite]">
          SPACE/↓ to stay · {link.optOutTicksLeft}t
        </div>
      )}

      {/* Aligned flash outer ring */}
      {isAligned && (
        <div
          className="absolute pointer-events-none rounded-[14px] border-2 border-[--arc] [animation:lhudFlash_1.2s_ease-in-out_infinite]"
          style={{ "--arc": `color-mix(in srgb, ${color} 35%, transparent)`, inset: -4 } as React.CSSProperties}
        />
      )}
    </div>
  );
}

// ─── Summary bar ─────────────────────────────────────────────────────────────

function SummaryBar({ links }: { links: LinkAlignmentInfo[] }) {
  const nearest = links.find(l => l.alignmentStatus === "aligned" || l.alignmentStatus === "always_open")
    ?? links.find(l => l.alignmentStatus === "near")
    ?? links[0];
  const color = STATUS_COLORS[nearest.alignmentStatus];

  return (
    <div
      className="flex items-center gap-2 px-[14px] py-[5px] rounded-[10px] text-[11px] bg-[rgba(15,23,42,0.92)] border border-[--sbc]"
      style={{ "--sbc": `color-mix(in srgb, ${color} 35%, transparent)` } as React.CSSProperties}
    >
      <span className="text-[14px]">{LINK_ICONS[nearest.linkType]}</span>
      <span className="text-theme-muted">{nearest.linkType.toUpperCase()}</span>
      <span className="font-bold text-[color:var(--sc)]" style={{ "--sc": color } as React.CSSProperties}>
        {nearest.alignmentStatus === "always_open"
          ? "ALWAYS OPEN — ENTER"
          : nearest.alignmentStatus === "aligned"
          ? "ALIGNED — ENTER"
          : nearest.alignmentStatus === "near"
          ? `NEAR — ${nearest.degreesOff.toFixed(0)}° off (±${nearest.errorMarginDeg}°)`
          : nearest.alignmentStatus === "cooldown"
          ? `COOLDOWN — ${nearest.cooldownTicks != null ? `${Math.ceil(nearest.cooldownTicks / 60)}s` : "…"}`
          : nearest.alignmentStatus === "severed"
          ? nearest.cooldownTicks ? `SEVERED — recon ${Math.ceil(nearest.cooldownTicks / 60)}s` : "SEVERED — ROTATE TO ALIGN"
          : `${nearest.degreesOff.toFixed(0)}° OFF — need ±${nearest.errorMarginDeg}°`
        }
      </span>
      {/* Alignment % for near/misaligned */}
      {(nearest.alignmentStatus === "near" || nearest.alignmentStatus === "misaligned") && (
        <span className="text-theme-faint text-[10px] ml-[2px]">
          {Math.max(0, Math.round((1 - nearest.degreesOff / (nearest.errorMarginDeg * 2)) * 100))}%
        </span>
      )}
    </div>
  );
}

// ─── Main HUD ─────────────────────────────────────────────────────────────────

export default function LinkAlignmentHUD({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <div
      className="absolute flex flex-col items-center gap-2 pointer-events-none z-[10]"
      style={{ bottom: 16, left: "50%", transform: "translateX(-50%)" }}
    >
      {/* ── Per-link cards ── */}
      <div className="flex gap-3 items-end">
        {links.map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>

      {/* ── Summary bar ── */}
      <SummaryBar links={links} />
    </div>
  );
}

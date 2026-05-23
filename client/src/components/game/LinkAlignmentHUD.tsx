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
import { C, alpha } from "@/styles/theme";

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
  aligned:     C.green,
  near:        C.yellow,
  misaligned:  C.red,
  severed:     "#475569",
  always_open: C.purple,
  cooldown:    C.yellow,
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
  const lineColor = isAlways ? C.purple
    : isSevered ? "#475569"
    : isAligned ? C.green
    : link.alignmentStatus === "near" ? C.yellow
    : C.red;

  return (
    <svg width={W} height={H} style={{ overflow: "visible", display: "block" }}>
      {/* ── Error margin tolerance arc on arena A ── */}
      {!isAlways && !isSevered && (
        <path
          d={`M${cx1} ${cy} L${arcS} ${arcT} A${r} ${r} 0 ${marginRad * 2 > Math.PI ? 1 : 0} 1 ${arcE} ${arcU} Z`}
          fill={alpha(C.green, 0.18)} stroke={alpha(C.green, 0.4)} strokeWidth={0.5}
        />
      )}

      {/* ── Arena A circle ── */}
      {isAlways ? (
        <>
          <circle cx={cx1} cy={cy} r={r} fill={alpha(C.purple, 0.08)} stroke={alpha(C.purple, 0.5)} strokeWidth={2} strokeDasharray="6 3" />
          <circle cx={cx1} cy={cy} r={r - 6} fill="none" stroke={alpha(C.purple, 0.25)} strokeWidth={1} strokeDasharray="3 3" />
        </>
      ) : isSevered ? (
        <circle cx={cx1} cy={cy} r={r} fill="none" stroke={alpha("#475569", 0.6)} strokeWidth={2} strokeDasharray="5 5" />
      ) : (
        <circle cx={cx1} cy={cy} r={r} fill={alpha(color, 0.06)} stroke={alpha(color, 0.45)} strokeWidth={2} />
      )}

      {/* ── Arena B circle ── */}
      {isAlways ? (
        <circle cx={cx2} cy={cy} r={r} fill={alpha(C.purple, 0.08)} stroke={alpha(C.purple, 0.5)} strokeWidth={2} strokeDasharray="6 3" />
      ) : (
        <circle cx={cx2} cy={cy} r={r} fill={alpha(color, 0.04)} stroke={alpha(C.border, 0.6)} strokeWidth={1.5} />
      )}

      {/* ── Opening notch on arena A (rotates with degreesOff) ── */}
      {!isAlways && (
        <circle cx={ox1} cy={oy1} r={3.5}
          fill={isAligned ? C.green : isSevered ? "#475569" : color}
          opacity={isSevered ? 0.5 : 1} />
      )}

      {/* ── Opening notch on arena B (fixed, points left) ── */}
      {!isAlways && (
        <circle cx={ox2} cy={oy2} r={3.5} fill={alpha(C.blue, 0.8)} />
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
        <circle cx={(cx1 + cx2) / 2} cy={cy} r={4} fill={C.purple} opacity={0.8} />
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
          <text x={cx1} y={cy + 15} textAnchor="middle" fontSize={7} fill={alpha("#475569", 0.7)}>
            to reconnect
          </text>
        </>
      )}

      {/* ── Cooldown tick countdown ── */}
      {link.alignmentStatus === "cooldown" && link.cooldownTicks != null && (
        <text x={cx1} y={cy + 4} textAnchor="middle" fontSize={10} fill={C.yellow} fontWeight="bold">
          {Math.ceil(link.cooldownTicks / 60)}s
        </text>
      )}

      {/* ── Labels ── */}
      <text x={cx1} y={H - 1} textAnchor="middle" fontSize={8} fill={C.faint}>Arena A</text>
      <text x={cx2} y={H - 1} textAnchor="middle" fontSize={8} fill={C.faint}>Arena B</text>
    </svg>
  );
}

// ─── Per-link card ────────────────────────────────────────────────────────────

function LinkCard({ link }: { link: LinkAlignmentInfo }) {
  const color = STATUS_COLORS[link.alignmentStatus];
  const isAligned = link.alignmentStatus === "aligned" || link.alignmentStatus === "always_open";
  const isSevered = link.alignmentStatus === "severed" || link.alignmentStatus === "cooldown";

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      position: "relative",
    }}>
      <style>{`
        @keyframes lhudGlow  { 0%,100%{filter:drop-shadow(0 0 3px ${color}66)} 50%{filter:drop-shadow(0 0 9px ${color}cc)} }
        @keyframes lhudFlash { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Dual compass */}
      <div style={{
        animation: isAligned ? "lhudGlow 1.5s ease-in-out infinite" : "none",
        background: "rgba(15,23,42,0.8)",
        border: `1px solid ${alpha(color, isSevered ? 0.2 : 0.35)}`,
        borderRadius: 10, padding: "6px 8px",
      }}>
        <DualCompass link={link} />
      </div>

      {/* Angular readout */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "3px 10px", borderRadius: 20,
        background: isAligned ? alpha(color, 0.12) : alpha(C.bg1, 0.8),
        border: `1px solid ${alpha(color, 0.3)}`,
        animation: isAligned ? "lhudFlash 1.2s ease-in-out infinite" : "none",
      }}>
        <span style={{ fontSize: 13, lineHeight: 1 }}>{LINK_ICONS[link.linkType]}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace" }}>
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
          <span style={{ fontSize: 9, color: C.faint }}>(±{link.errorMarginDeg}°)</span>
        )}
      </div>

      {/* Direction label */}
      <div style={{ fontSize: 9, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {link.direction === "up" ? "↑ UP" : "↓ DOWN"}
      </div>

      {/* Trampoline opt-out hint */}
      {link.linkType === "trampoline" && link.optOutTicksLeft != null && (
        <div style={{
          fontSize: 9, color: C.yellow, fontWeight: 700,
          background: alpha(C.yellow, 0.1), border: `1px solid ${alpha(C.yellow, 0.3)}`,
          borderRadius: 6, padding: "2px 6px",
          animation: "lhudFlash 0.8s ease-in-out infinite",
        }}>
          SPACE/↓ to stay · {link.optOutTicksLeft}t
        </div>
      )}

      {/* Aligned flash outer ring */}
      {isAligned && (
        <div style={{
          position: "absolute", inset: -4,
          borderRadius: 14,
          border: `2px solid ${alpha(color, 0.35)}`,
          animation: "lhudFlash 1.2s ease-in-out infinite",
          pointerEvents: "none",
        }} />
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
    <div style={{
      background: "rgba(15,23,42,0.92)",
      border: `1px solid ${alpha(color, 0.35)}`,
      borderRadius: 10,
      padding: "5px 14px",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 11,
    }}>
      <span style={{ fontSize: 14 }}>{LINK_ICONS[nearest.linkType]}</span>
      <span style={{ color: C.muted }}>{nearest.linkType.toUpperCase()}</span>
      <span style={{ color, fontWeight: 700 }}>
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
        <span style={{ color: C.faint, fontSize: 10, marginLeft: 2 }}>
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
    <div style={{
      position: "absolute",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      pointerEvents: "none",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}>

      {/* ── Per-link cards ── */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
        {links.map(link => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>

      {/* ── Summary bar ── */}
      <SummaryBar links={links} />
    </div>
  );
}

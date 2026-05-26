import React from "react";
import { SPBar } from "./SPBar";

interface AllyEntry {
  id: string;
  username: string;
  beyType: string;
  spinPct: number;
}

interface PlayerPanelProps {
  username: string;
  beyType: string;
  spinPct: number;
  allies?: AllyEntry[];
  seriesWins?: number;
  targetWins?: number;
}

export const TYPE_HEX: Record<string, string> = {
  attack:   "#ff5544",
  defense:  "#3388ff",
  stamina:  "#33cc77",
  balanced: "#ffcc33",
};

export const TYPE_LABEL: Record<string, string> = {
  attack: "ATK", defense: "DEF", stamina: "STA", balanced: "BAL",
};

// ── Segmented arc wheel (180° fan, 12 segments) ──────────────────────────────
// The wheel fans out from the bottom-left corner (anchor = bottom-left of SVG).
// Start angle: 180° (pointing left), end angle: 0° (pointing right), sweeping
// counter-clockwise (i.e. the arc goes UP through 90° like a speedometer).
// Segment i is "lit" if spinPct >= threshold_i.

const SEGMENTS = 12;
const WHEEL_SIZE = 90;       // SVG viewport px
const CX = WHEEL_SIZE / 2;   // centre of the full circle the arc is part of
const CY = WHEEL_SIZE;        // bottom of the SVG (arc anchors bottom-centre)
const R_OUTER = WHEEL_SIZE * 0.88;
const R_INNER = WHEEL_SIZE * 0.50;
const GAP_DEG = 3;            // gap between segments in degrees

// Segment colour bands: 0-3 = orange-red, 4-7 = yellow-green, 8-11 = green
const SEGMENT_COLORS_LIT = [
  "#ff3322", "#ff4422", "#ff5533", "#ff6644",   // 0-3  orange-red
  "#ffaa22", "#ffcc33", "#ddcc22", "#aacc22",   // 4-7  yellow
  "#66cc44", "#44dd55", "#33dd66", "#22ee77",   // 8-11 green
];
const COLOR_DIM = "rgba(255,255,255,0.07)";

function toRad(deg: number): number { return (deg * Math.PI) / 180; }

function arcPath(startDeg: number, endDeg: number, rOuter: number, rInner: number, cx: number, cy: number): string {
  const s1 = toRad(startDeg);
  const e1 = toRad(endDeg);

  const x1 = cx + rOuter * Math.cos(s1);
  const y1 = cy + rOuter * Math.sin(s1);
  const x2 = cx + rOuter * Math.cos(e1);
  const y2 = cy + rOuter * Math.sin(e1);

  const x3 = cx + rInner * Math.cos(e1);
  const y3 = cy + rInner * Math.sin(e1);
  const x4 = cx + rInner * Math.cos(s1);
  const y4 = cy + rInner * Math.sin(s1);

  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

interface SpinWheelProps {
  spinPct: number;
  /** "left" = arc fans left-to-right (player, top-left card).
   *  "right" = arc fans right-to-left (opponent, top-right card, mirrored). */
  side?: "left" | "right";
}

function SpinWheel({ spinPct, side = "left" }: SpinWheelProps) {
  // Arc spans 180° from 180° (left) through 90° (top) to 0° (right).
  // In SVG coordinate space: angles are measured CW from positive-x.
  // We want the arc to go from the bottom-left up through the top to bottom-right,
  // but since CY=WHEEL_SIZE (bottom), the arc from 180° to 0° (going CCW, i.e. upward)
  // fills the top half of the circle.
  //
  // SVG arcs sweep: we go from 180° to 0°, so sweep = -180° (CCW).
  // Each of the 12 segments occupies 180°/12 = 15° with a GAP_DEG gap inside.
  // Segment 0 starts at 180° (far left) and ends near 165°.
  // Segment 11 starts near 15° and ends at 0° (far right).

  const segSpan = 180 / SEGMENTS;            // degrees per segment
  const halfGap = GAP_DEG / 2;

  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    // Angles in "math" convention (0 = right, CCW positive).
    // Segment i goes from (180 - i*segSpan) down to (180 - (i+1)*segSpan).
    // In SVG, angles are measured CW, so we negate: startDeg = -(180 - i*segSpan).
    // But it's easier to keep everything in SVG CW angles.
    //
    // Alternatively: arc from 180° (CCW) means SVG angle 180° = left.
    // Let's work in SVG angles directly.
    // Segment i: SVG startAngle = 180 - i*segSpan + halfGap
    //            SVG endAngle   = 180 - (i+1)*segSpan - halfGap
    // Because we're going from left to right (decreasing angle), the arc sweeps CW
    // with a negative sweep → large-arc = 0, sweep = 0 (clockwise) works if we
    // swap start/end. Let's keep start < end:
    const svgStart = 180 - (i + 1) * segSpan + halfGap;
    const svgEnd   = 180 - i * segSpan - halfGap;

    const threshold = (i / SEGMENTS) * 100;
    const lit = spinPct >= threshold + 0.5;

    return { svgStart, svgEnd, lit, color: SEGMENT_COLORS_LIT[i] };
  });

  const rpmValue = Math.round(spinPct * 40);   // fake RPM: 0–4000

  const svgContent = (
    <svg
      width={WHEEL_SIZE}
      height={WHEEL_SIZE}
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="shrink-0"
      aria-hidden="true"
    >
      {segments.map((seg, i) => (
        <path
          key={i}
          d={arcPath(seg.svgStart, seg.svgEnd, R_OUTER, R_INNER, CX, CY)}
          fill={seg.lit ? seg.color : COLOR_DIM}
          style={seg.lit ? { filter: "drop-shadow(0 0 3px currentColor)", opacity: 0.9 } : { opacity: 0.4 }}
        />
      ))}
      {/* Centre hub */}
      <circle cx={CX} cy={CY} r={R_INNER * 0.38} fill="rgba(255,255,255,0.06)" />

      {/* RPM label inside the arc */}
      <text
        x={CX}
        y={CY - R_INNER * 0.72}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontFamily="monospace"
        fontWeight="700"
        fill="rgba(255,255,255,0.70)"
        letterSpacing="0.04em"
      >
        {rpmValue}
      </text>
      <text
        x={CX}
        y={CY - R_INNER * 0.45}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="5.5"
        fontFamily="monospace"
        fontWeight="600"
        fill="rgba(255,255,255,0.35)"
        letterSpacing="0.08em"
      >
        RPM
      </text>
    </svg>
  );

  if (side === "right") {
    // Mirror horizontally for opponent card
    return (
      <div className="shrink-0" style={{ transform: "scaleX(-1)" }}>
        {svgContent}
      </div>
    );
  }
  return <div className="shrink-0">{svgContent}</div>;
}

export { SpinWheel };

// ── PlayerPanel ───────────────────────────────────────────────────────────────
export function PlayerPanel({ username, beyType, spinPct, allies = [], seriesWins, targetWins }: PlayerPanelProps) {
  const typeHex = TYPE_HEX[beyType] ?? "#aabbcc";
  const typeLabel = TYPE_LABEL[beyType] ?? "—";
  const hasAllies = allies.length > 0;

  return (
    <div
      className="absolute top-0 left-0 z-50 pointer-events-none flex flex-col gap-1.5"
      style={{ "--tc": typeHex } as React.CSSProperties}
    >
      {/* ── Main player corner card ── */}
      <div
        className="hud-type-border border-r border-b rounded-br-2xl backdrop-blur-md bg-[rgba(5,8,20,0.90)] flex flex-col items-start gap-1.5 pt-2 pb-3 pl-2 pr-4"
      >
        {/* Arc wheel */}
        <SpinWheel spinPct={spinPct} side="left" />

        {/* Name + type badge */}
        <div className="flex items-center gap-2 w-full px-1">
          <span className="text-white font-bold text-[0.72rem] font-mono tracking-wider truncate flex-1 uppercase">
            {username}
          </span>
          <span
            className="hud-type-text text-[0.5rem] font-black tracking-[0.15em] shrink-0 border hud-type-border rounded px-1 py-px"
          >
            {typeLabel}
          </span>
        </div>

        {/* Stamina bar */}
        <div className="w-full px-1">
          <SPBar spinPct={spinPct} label="STAMINA" size="lg" />
        </div>

        {/* Series score pips */}
        {seriesWins !== undefined && targetWins !== undefined && targetWins > 1 && (
          <div className="flex gap-1 px-1 w-full mt-0.5">
            {Array.from({ length: targetWins }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full ${i < seriesWins ? "hud-type-bg" : "bg-white/10"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Ally cards (team mode) ── */}
      {hasAllies && (
        <div className="flex flex-col gap-1 pl-1">
          <span className="text-[0.44rem] tracking-[0.18em] text-white/30 uppercase px-0.5">Allies</span>
          {allies.map(ally => {
            const allyHex = TYPE_HEX[ally.beyType] ?? "#aabbcc";
            return (
              <div
                key={ally.id}
                className="hud-type-border border rounded-lg px-2 py-1.5 backdrop-blur-md flex items-center gap-2 bg-[rgba(8,12,26,0.80)]"
                style={{ "--tc": allyHex } as React.CSSProperties}
              >
                <span className="hud-type-dot w-2 h-2 rounded-full shrink-0" />
                <span className="text-white/80 text-[0.6rem] font-mono truncate flex-1">{ally.username}</span>
                <SPBar spinPct={ally.spinPct} compact size="sm" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

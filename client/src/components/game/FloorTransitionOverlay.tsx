/**
 * FloorTransitionOverlay — shown during the traversalTicks window when a bey
 * crosses a floor link (pit fall, ramp climb, portal warp, trampoline launch).
 *
 * State machine:
 *   "transit"        — actively traversing; trajectory SVG and progress bar animate
 *   "auto_launch"    — trampoline auto-bounce from pit; opt-out prompt shown
 *   "opt_out_window" — player still has time to press SPACE/↓ to cancel launch
 *   "cancelled"      — player opted out; bey stays on current floor
 *   "arrived"        — brief flash before overlay hides
 *
 * Each link type has a unique trajectory path SVG:
 *   pit        → parabolic arc falling down
 *   trampoline → bounce arc going up
 *   ramp       → angled diagonal climb line
 *   portal     → circular warp ring
 *   corridor   → horizontal dash
 */
import React from "react";
import { alpha } from "@/styles/theme";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransitionState =
  | "transit"
  | "auto_launch"
  | "opt_out_window"
  | "cancelled"
  | "arrived";

export interface FloorTransitionProps {
  visible: boolean;
  linkType: "corridor" | "portal" | "ramp" | "pit" | "trampoline";
  fromFloor: number;
  toFloor: number;
  fromLabel?: string;
  toLabel?: string;
  /** 0–1 progress of the traversal */
  progress: number;
  state: TransitionState;
  optOutTicksLeft?: number;
  optOutWindowTicks?: number;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

const LINK_META: Record<string, { icon: string; label: string; color: string; verb: string; particleChar: string }> = {
  corridor:   { icon: "🚪", label: "Corridor",   color: "#3b82f6", verb: "CROSSING",  particleChar: "─" },
  portal:     { icon: "🌀", label: "Portal",     color: "#a855f7", verb: "WARPING",   particleChar: "✦" },
  ramp:       { icon: "📐", label: "Ramp",       color: "#eab308", verb: "CLIMBING",  particleChar: "╱" },
  pit:        { icon: "⬇️",  label: "Pit",        color: "#ef4444", verb: "FALLING",   particleChar: "▾" },
  trampoline: { icon: "⬆️",  label: "Trampoline", color: "#22c55e", verb: "LAUNCHING", particleChar: "▴" },
};

// ─── Trajectory SVG ───────────────────────────────────────────────────────────

/** Per-link-type physics path. progress (0–1) controls how far the bey dot has traveled. */
function TrajectoryPath({ linkType, progress, color }: { linkType: string; progress: number; color: string }) {
  const W = 200, H = 76;
  const p = Math.min(Math.max(progress, 0), 1);

  type PathDef = { d: string; bx: (t: number) => number; by: (t: number) => number };

  const paths: Record<string, PathDef> = {
    pit: {
      d: `M${W/2} 8 Q${W/2+22} ${H/2} ${W/2+10} ${H-10}`,
      bx: t => W/2 + 22 * Math.sin(t * Math.PI) * t,
      by: t => 8 + (H - 18) * t,
    },
    trampoline: {
      d: `M${W/2} ${H-10} Q${W/2-22} ${H/2} ${W/2-10} 8`,
      bx: t => W/2 - 22 * Math.sin(t * Math.PI) * t,
      by: t => H - 10 - (H - 18) * t,
    },
    ramp: {
      d: `M${30} ${H-10} L${W-30} 8`,
      bx: t => 30 + (W - 60) * t,
      by: t => H - 10 - (H - 18) * t,
    },
    portal: {
      d: `M${W/2-22} ${H/2} a22 22 0 1 1 44 0 a22 22 0 1 1 -44 0`,
      bx: t => W/2 + 22 * Math.cos(t * 2 * Math.PI - Math.PI / 2),
      by: t => H/2 + 22 * Math.sin(t * 2 * Math.PI - Math.PI / 2),
    },
    corridor: {
      d: `M${18} ${H/2} L${W-18} ${H/2}`,
      bx: t => 18 + (W - 36) * t,
      by: _ => H / 2,
    },
  };

  const def = paths[linkType] ?? paths.corridor;
  const bx = def.bx(p);
  const by = def.by(p);

  return (
    <svg width={W} height={H} className="block mx-auto">
      {/* Ghost trail */}
      <path d={def.d} fill="none" stroke={alpha(color, 0.2)} strokeWidth={2} strokeDasharray="6 4" />
      {/* Traveled arc (grows with progress) */}
      {p > 0.02 && (
        <path d={def.d} fill="none" stroke={color} strokeWidth={2}
          strokeDasharray="1000" strokeDashoffset={1000 - p * 1000}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 60ms linear" }} />
      )}
      {/* Bey dot */}
      <circle cx={bx} cy={by} r={7} fill={alpha(color, 0.25)} stroke={color} strokeWidth={1.5} />
      <circle cx={bx} cy={by} r={3} fill={color} />
    </svg>
  );
}

// ─── Phase indicator ──────────────────────────────────────────────────────────

function PhaseBadge({ state, linkType }: { state: TransitionState; linkType: string }) {
  const color = LINK_META[linkType]?.color ?? "#3b82f6";
  const isTramps = linkType === "trampoline";

  const phases = isTramps
    ? [
        { key: "transit",        label: "Fall",     match: ["transit"] },
        { key: "auto_launch",    label: "Land",     match: ["auto_launch"] },
        { key: "opt_out_window", label: "Opt-out",  match: ["opt_out_window"] },
        { key: "done",           label: "Done",     match: ["arrived", "cancelled"] },
      ]
    : [
        { key: "transit",  label: "Transit",  match: ["transit"] },
        { key: "arrived",  label: "Arrived",  match: ["arrived"] },
      ];

  return (
    <div className="flex items-center gap-[3px] justify-center mb-[10px]">
      {phases.map((ph, i) => {
        const active = (ph.match as string[]).includes(state);
        return (
          <div key={ph.key} className="flex items-center gap-[3px]">
            <div
              style={{
                background: active ? alpha(color, 0.2) : alpha("#1e293b", 0.6),
                border: `1px solid ${active ? color : "#334155"}`,
                color: active ? color : "#64748b",
                transition: "all 0.15s",
              }}
              className="px-2 py-[2px] rounded-[10px] text-[9px] font-bold"
            >
              {ph.label}
            </div>
            {i < phases.length - 1 && <span style={{ color: "#64748b" }} className="text-[9px]">›</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles({ char, color, count = 8 }: { char: string; color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          fontSize: 13,
          color: alpha(color, 0.5),
          left: `${8 + (i / count) * 84}%`,
          top: `${18 + Math.sin(i * 1.3) * 28}%`,
          animation: `floatP${i % 3} ${1.2 + (i % 3) * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.15}s`,
        }}>
          {char}
        </div>
      ))}
    </>
  );
}

// ─── Floor badge ──────────────────────────────────────────────────────────────

function FloorBadge({ index, label, dim }: { index: number; label?: string; dim?: boolean }) {
  return (
    <div style={{ opacity: dim ? 0.45 : 1, transition: "opacity 0.2s" }} className="text-center">
      <div
        style={{
          background: dim ? alpha("#1e293b", 0.5) : alpha("#3b82f6", 0.15),
          border: `2px solid ${dim ? "#334155" : "#3b82f6"}`,
          color: dim ? "#64748b" : "#f1f5f9",
        }}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-[18px] font-extrabold mx-auto mb-1"
      >
        {index}
      </div>
      {label && (
        <div style={{ color: dim ? "#64748b" : "#94a3b8" }} className="text-[10px] max-w-[64px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-bg3 text-theme-text border border-border-c rounded px-[6px] py-[1px] text-[10px] font-mono">
      {children}
    </kbd>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export default function FloorTransitionOverlay({
  visible, linkType, fromFloor, toFloor, fromLabel, toLabel,
  progress, state, optOutTicksLeft, optOutWindowTicks,
}: FloorTransitionProps) {
  const meta = LINK_META[linkType] ?? LINK_META.corridor;
  const isGoingDown = toFloor < fromFloor;
  const arrow = linkType === "pit" ? "⬇" : linkType === "trampoline" ? "⬆" : isGoingDown ? "⬇" : "⬆";
  const optOutPct = optOutWindowTicks && optOutTicksLeft != null
    ? (optOutTicksLeft / optOutWindowTicks) * 100
    : 0;

  if (!visible) return null;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30 }} className="flex items-center justify-center pointer-events-none">
      <style>{`
        @keyframes floatP0 { 0%,100%{transform:translateY(0);opacity:.6} 50%{transform:translateY(-16px);opacity:1} }
        @keyframes floatP1 { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(12px);opacity:.8} }
        @keyframes floatP2 { 0%,100%{transform:translateY(-5px);opacity:.5} 50%{transform:translateY(8px);opacity:.9} }
        @keyframes tSlideIn { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
        @keyframes tFlash   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes tPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.5)} 50%{box-shadow:0 0 0 8px rgba(234,179,8,0)} }
        @keyframes tPop     { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0 }} className="bg-[rgba(2,8,23,0.65)] backdrop-blur-sm" />

      {/* Main card */}
      <div
        style={{
          border: `2px solid ${alpha(meta.color, 0.5)}`,
          animation: "tSlideIn 0.18s ease-out",
          boxShadow: `0 0 48px ${alpha(meta.color, 0.18)}`,
        }}
        className="relative bg-[rgba(15,23,42,0.96)] rounded-[20px] px-[30px] py-5 min-w-[300px] max-w-[380px] text-center overflow-hidden"
      >
        <Particles char={meta.particleChar} color={meta.color} />

        {/* Link type badge */}
        <div className="mb-2 relative">
          <span
            style={{
              color: meta.color,
              background: alpha(meta.color, 0.12),
              border: `1px solid ${alpha(meta.color, 0.3)}`,
            }}
            className="text-[11px] font-bold uppercase tracking-[1.5px] rounded-[20px] px-3 py-[3px]"
          >
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* Phase indicator */}
        <PhaseBadge state={state} linkType={linkType} />

        {/* Verb */}
        <div
          style={{
            color: "#94a3b8",
            animation: state === "arrived" ? "tFlash 0.4s ease-in-out 3" : "none",
          }}
          className="text-[13px] font-bold tracking-[2px] uppercase mb-[10px]"
        >
          {state === "arrived"   ? "ARRIVED"
           : state === "cancelled" ? "STAYING"
           : meta.verb}
        </div>

        {/* Floor F2 → arrow → F1 */}
        <div className="flex items-center justify-center gap-[14px] mb-3">
          <FloorBadge index={fromFloor} label={fromLabel} dim />
          <div className="flex flex-col items-center gap-[2px]">
            <span style={{ color: meta.color }} className="text-[22px] leading-none">{arrow}</span>
            <span className="text-theme-faint text-[9px]">
              {Math.abs(toFloor - fromFloor)} floor{Math.abs(toFloor - fromFloor) > 1 ? "s" : ""}
            </span>
          </div>
          <FloorBadge index={toFloor} label={toLabel} />
        </div>

        {/* Trajectory SVG */}
        {(state === "transit" || state === "arrived") && (
          <div className="mb-[10px]">
            <TrajectoryPath linkType={linkType} progress={state === "arrived" ? 1 : progress} color={meta.color} />
          </div>
        )}

        {/* Transit progress bar */}
        {state === "transit" && (
          <div style={{ background: alpha("#334155", 0.5) }} className="w-full h-[4px] rounded-[2px] overflow-hidden">
            <div style={{
              height: "100%", width: `${progress * 100}%`,
              background: meta.color,
              transition: "width 50ms linear", boxShadow: `0 0 6px ${meta.color}`,
            }} className="rounded-[2px]" />
          </div>
        )}

        {/* Opt-out transit bar */}
        {state === "opt_out_window" && (
          <div style={{ background: alpha("#334155", 0.4) }} className="w-full h-[3px] rounded-[2px] overflow-hidden mb-1">
            <div style={{
              height: "100%", width: `${progress * 100}%`,
              background: meta.color, transition: "width 50ms linear",
            }} className="rounded-[2px]" />
          </div>
        )}

        {/* Auto-launch / opt-out panel */}
        {(state === "auto_launch" || state === "opt_out_window") && (
          <div
            style={{
              background: alpha("#eab308", 0.08),
              border: `1px solid ${alpha("#eab308", 0.3)}`,
              animation: "tPulse 1.2s ease-in-out infinite",
            }}
            className="mt-[10px] px-[14px] py-[10px] rounded-[10px]"
          >
            <div className="text-theme-yellow text-[12px] font-bold mb-1">
              {state === "opt_out_window"
                ? `OPT-OUT WINDOW — ${optOutTicksLeft ?? "…"}t left`
                : `AUTO-LAUNCHING IN ${optOutTicksLeft != null ? `${optOutTicksLeft}t` : "…"}`
              }
            </div>
            <div className="text-theme-muted text-[11px]">
              Hold <Key>SPACE</Key> or <Key>↓</Key> to stay on this floor
            </div>
            {optOutWindowTicks != null && (
              <div style={{ background: alpha("#eab308", 0.2) }} className="mt-[6px] w-full h-[3px] rounded-[2px] overflow-hidden">
                <div style={{ height: "100%", width: `${optOutPct}%`, background: "#eab308", transition: "width 50ms linear" }} className="rounded-[2px]" />
              </div>
            )}
            <div className="text-theme-faint text-[10px] mt-[6px] leading-[1.4]">
              You landed on a trampoline — it will bounce you back to F{fromFloor} unless you cancel.
            </div>
          </div>
        )}

        {/* Cancelled */}
        {state === "cancelled" && (
          <div
            style={{
              background: alpha("#22c55e", 0.08),
              border: `1px solid ${alpha("#22c55e", 0.3)}`,
              animation: "tPop 0.25s ease-out",
            }}
            className="mt-3 px-[14px] py-[10px] rounded-[10px]"
          >
            <div className="text-theme-green text-[13px] font-bold">✓ Launch cancelled</div>
            <div className="text-theme-muted text-[11px] mt-[2px]">Staying on Floor {fromFloor}</div>
          </div>
        )}

        {/* Arrived */}
        {state === "arrived" && (
          <div style={{ color: meta.color, animation: "tFlash 0.4s ease-in-out 2" }} className="mt-[10px] text-[12px] font-bold">
            ✓ Floor {toFloor}{toLabel ? ` — ${toLabel}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

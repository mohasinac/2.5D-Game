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
          strokeLinecap="round" className="[transition:stroke-dashoffset_60ms_linear]" />
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
    <div className="flex items-center gap-1 justify-center mb-2.5">
      {phases.map((ph, i) => {
        const active = (ph.match as string[]).includes(state);
        return (
          <div key={ph.key} className="flex items-center gap-1">
            <div
              className={`px-2 py-0.5 rounded-[10px] text-[9px] font-bold transition-all duration-150 border [background:var(--tb-bg)] [color:var(--tb-c)] ${active ? "border-[var(--tc)]" : "border-[#334155]"}`}
              style={{
                "--tc": color,
                "--tb-bg": active ? `color-mix(in srgb, ${color} 20%, transparent)` : "rgba(30,41,59,0.6)",
                "--tb-c": active ? color : "#64748b",
              } as React.CSSProperties}
            >
              {ph.label}
            </div>
            {i < phases.length - 1 && <span className="text-[9px] text-[#64748b]">›</span>}
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
        <div key={i} className="absolute text-[13px] pointer-events-none text-[color:var(--pc)]"
          style={{
            "--pc": `color-mix(in srgb, ${color} 50%, transparent)`,
            left: `${8 + (i / count) * 84}%`,
            top: `${18 + Math.sin(i * 1.3) * 28}%`,
            animation: `floatP${i % 3} ${1.2 + (i % 3) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          } as React.CSSProperties}>
          {char}
        </div>
      ))}
    </>
  );
}

// ─── Floor badge ──────────────────────────────────────────────────────────────

function FloorBadge({ index, label, dim }: { index: number; label?: string; dim?: boolean }) {
  return (
    <div className={cn("text-center transition-opacity duration-200", dim ? "opacity-45" : "opacity-100")}>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-[18px] font-extrabold mx-auto mb-1 border-2 ${dim ? "bg-[rgba(30,41,59,0.5)] border-[#334155] text-[#64748b]" : "bg-[rgba(59,130,246,0.15)] border-[#3b82f6] text-[#f1f5f9]"}`}
      >
        {index}
      </div>
      {label && (
        <div className={cn("text-[10px] max-w-[64px] overflow-hidden text-ellipsis whitespace-nowrap", dim ? "text-[#64748b]" : "text-[#94a3b8]")}>
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
    <div className="absolute inset-0 z-[30] flex items-center justify-center pointer-events-none">
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
      <div className="absolute inset-0 bg-[rgba(2,8,23,0.65)] backdrop-blur-sm" />

      {/* Main card */}
      <div
        className="relative bg-[rgba(15,23,42,0.96)] rounded-[20px] px-[30px] py-5 min-w-[300px] max-w-[380px] text-center overflow-hidden border-2 [animation:tSlideIn_0.18s_ease-out] [border-color:var(--tc-50)] [box-shadow:0_0_48px_var(--tc-18)]"
        style={{ "--tc": meta.color, "--tc-50": `color-mix(in srgb, ${meta.color} 50%, transparent)`, "--tc-18": `color-mix(in srgb, ${meta.color} 18%, transparent)` } as React.CSSProperties}
      >
        <Particles char={meta.particleChar} color={meta.color} />

        {/* Link type badge */}
        <div className="mb-2 relative">
          <span
            className="text-[11px] font-bold uppercase tracking-[1.5px] rounded-[20px] px-3 py-[3px] border [color:var(--tc)] [background:var(--tc-12)] [border-color:var(--tc-30)]"
            style={{ "--tc": meta.color, "--tc-12": `color-mix(in srgb, ${meta.color} 12%, transparent)`, "--tc-30": `color-mix(in srgb, ${meta.color} 30%, transparent)` } as React.CSSProperties}
          >
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* Phase indicator */}
        <PhaseBadge state={state} linkType={linkType} />

        {/* Verb */}
        <div
          className={`text-[13px] font-bold tracking-[2px] uppercase mb-2.5 text-[#94a3b8] ${state === "arrived" ? "[animation:tFlash_0.4s_ease-in-out_3]" : ""}`}
        >
          {state === "arrived"   ? "ARRIVED"
           : state === "cancelled" ? "STAYING"
           : meta.verb}
        </div>

        {/* Floor F2 → arrow → F1 */}
        <div className="flex items-center justify-center gap-3.5 mb-3">
          <FloorBadge index={fromFloor} label={fromLabel} dim />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[22px] leading-none text-[color:var(--mc)]" style={{ "--mc": meta.color } as React.CSSProperties}>{arrow}</span>
            <span className="text-theme-faint text-[9px]">
              {Math.abs(toFloor - fromFloor)} floor{Math.abs(toFloor - fromFloor) > 1 ? "s" : ""}
            </span>
          </div>
          <FloorBadge index={toFloor} label={toLabel} />
        </div>

        {/* Trajectory SVG */}
        {(state === "transit" || state === "arrived") && (
          <div className="mb-2.5">
            <TrajectoryPath linkType={linkType} progress={state === "arrived" ? 1 : progress} color={meta.color} />
          </div>
        )}

        {/* Transit progress bar */}
        {state === "transit" && (
          <div className="w-full h-[4px] rounded-[2px] overflow-hidden bg-[rgba(51,65,85,0.5)]">
            <div className="rounded-[2px] transition-[width] duration-[50ms] linear h-full bg-[color:var(--mc)] shadow-[0_0_6px_var(--mc)]" style={{ "--mc": meta.color, width: `${progress * 100}%` } as React.CSSProperties} />
          </div>
        )}

        {/* Opt-out transit bar */}
        {state === "opt_out_window" && (
          <div className="w-full h-[3px] rounded-[2px] overflow-hidden mb-1 bg-[rgba(51,65,85,0.4)]">
            <div className="rounded-[2px] transition-[width] duration-[50ms] linear h-full bg-[color:var(--mc)]" style={{ "--mc": meta.color, width: `${progress * 100}%` } as React.CSSProperties} />
          </div>
        )}

        {/* Auto-launch / opt-out panel */}
        {(state === "auto_launch" || state === "opt_out_window") && (
          <div
            className="mt-[10px] px-[14px] py-[10px] rounded-[10px] bg-yellow-10 border border-[rgba(234,179,8,0.3)] [animation:tPulse_1.2s_ease-in-out_infinite]"
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
              <div className="mt-[6px] w-full h-[3px] rounded-[2px] overflow-hidden bg-[rgba(234,179,8,0.2)]">
                <div className="rounded-[2px] transition-[width] duration-[50ms] linear h-full bg-[#eab308] w-[--oow]" style={{ "--oow": `${optOutPct}%` } as React.CSSProperties} />

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
            className="mt-3 px-[14px] py-[10px] rounded-[10px] bg-green-10 border border-[rgba(34,197,94,0.3)] [animation:tPop_0.25s_ease-out]"
          >
            <div className="text-theme-green text-[13px] font-bold">✓ Launch cancelled</div>
            <div className="text-theme-muted text-[11px] mt-[2px]">Staying on Floor {fromFloor}</div>
          </div>
        )}

        {/* Arrived */}
        {state === "arrived" && (
          <div
            className="mt-[10px] text-[12px] font-bold [animation:tFlash_0.4s_ease-in-out_2] text-[color:var(--mc)]"
            style={{ "--mc": meta.color } as React.CSSProperties}
          >
            ✓ Floor {toFloor}{toLabel ? ` — ${toLabel}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

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
import { C, alpha } from "@/styles/theme";

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
  corridor:   { icon: "🚪", label: "Corridor",   color: C.blue,   verb: "CROSSING",  particleChar: "─" },
  portal:     { icon: "🌀", label: "Portal",     color: C.purple, verb: "WARPING",   particleChar: "✦" },
  ramp:       { icon: "📐", label: "Ramp",       color: C.yellow, verb: "CLIMBING",  particleChar: "╱" },
  pit:        { icon: "⬇️",  label: "Pit",        color: C.red,    verb: "FALLING",   particleChar: "▾" },
  trampoline: { icon: "⬆️",  label: "Trampoline", color: C.green,  verb: "LAUNCHING", particleChar: "▴" },
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
    <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
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
  const color = LINK_META[linkType]?.color ?? C.blue;
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
    <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "center", marginBottom: 10 }}>
      {phases.map((ph, i) => {
        const active = (ph.match as string[]).includes(state);
        return (
          <div key={ph.key} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{
              padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700,
              background: active ? alpha(color, 0.2) : alpha(C.bg3, 0.6),
              border: `1px solid ${active ? color : C.border}`,
              color: active ? color : C.faint,
              transition: "all 0.15s",
            }}>
              {ph.label}
            </div>
            {i < phases.length - 1 && <span style={{ color: C.faint, fontSize: 9 }}>›</span>}
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
          position: "absolute", fontSize: 13, color: alpha(color, 0.5),
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
    <div style={{ textAlign: "center", opacity: dim ? 0.45 : 1, transition: "opacity 0.2s" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: dim ? alpha(C.bg3, 0.5) : alpha(C.blue, 0.15),
        border: `2px solid ${dim ? C.border : C.blue}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, color: dim ? C.faint : C.text,
        margin: "0 auto 4px",
      }}>
        {index}
      </div>
      {label && (
        <div style={{ fontSize: 10, color: dim ? C.faint : C.muted, maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </div>
      )}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      background: C.bg3, borderRadius: 4, padding: "1px 6px",
      fontSize: 10, color: C.text, fontFamily: "monospace",
      border: `1px solid ${C.border}`,
    }}>
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
    <div style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
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
      <div style={{ position: "absolute", inset: 0, background: "rgba(2,8,23,0.65)", backdropFilter: "blur(2px)" }} />

      {/* Main card */}
      <div style={{
        position: "relative",
        background: "rgba(15,23,42,0.96)",
        border: `2px solid ${alpha(meta.color, 0.5)}`,
        borderRadius: 20, padding: "20px 30px",
        minWidth: 300, maxWidth: 380, textAlign: "center",
        animation: "tSlideIn 0.18s ease-out",
        boxShadow: `0 0 48px ${alpha(meta.color, 0.18)}`,
        overflow: "hidden",
      }}>
        <Particles char={meta.particleChar} color={meta.color} />

        {/* Link type badge */}
        <div style={{ marginBottom: 8, position: "relative" }}>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 1.5, color: meta.color,
            background: alpha(meta.color, 0.12), border: `1px solid ${alpha(meta.color, 0.3)}`,
            borderRadius: 20, padding: "3px 12px",
          }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* Phase indicator */}
        <PhaseBadge state={state} linkType={linkType} />

        {/* Verb */}
        <div style={{
          fontSize: 13, fontWeight: 700, color: C.muted,
          letterSpacing: 2, textTransform: "uppercase", marginBottom: 10,
          animation: state === "arrived" ? "tFlash 0.4s ease-in-out 3" : "none",
        }}>
          {state === "arrived"   ? "ARRIVED"
           : state === "cancelled" ? "STAYING"
           : meta.verb}
        </div>

        {/* Floor F2 → arrow → F1 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 12 }}>
          <FloorBadge index={fromFloor} label={fromLabel} dim />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 22, color: meta.color, lineHeight: 1 }}>{arrow}</span>
            <span style={{ fontSize: 9, color: C.faint }}>
              {Math.abs(toFloor - fromFloor)} floor{Math.abs(toFloor - fromFloor) > 1 ? "s" : ""}
            </span>
          </div>
          <FloorBadge index={toFloor} label={toLabel} />
        </div>

        {/* Trajectory SVG */}
        {(state === "transit" || state === "arrived") && (
          <div style={{ marginBottom: 10 }}>
            <TrajectoryPath linkType={linkType} progress={state === "arrived" ? 1 : progress} color={meta.color} />
          </div>
        )}

        {/* Transit progress bar */}
        {state === "transit" && (
          <div style={{ width: "100%", height: 4, background: alpha(C.border, 0.5), borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress * 100}%`,
              background: meta.color, borderRadius: 2,
              transition: "width 50ms linear", boxShadow: `0 0 6px ${meta.color}`,
            }} />
          </div>
        )}

        {/* Opt-out transit bar */}
        {state === "opt_out_window" && (
          <div style={{ width: "100%", height: 3, background: alpha(C.border, 0.4), borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
            <div style={{
              height: "100%", width: `${progress * 100}%`,
              background: meta.color, borderRadius: 2, transition: "width 50ms linear",
            }} />
          </div>
        )}

        {/* Auto-launch / opt-out panel */}
        {(state === "auto_launch" || state === "opt_out_window") && (
          <div style={{
            marginTop: 10, padding: "10px 14px",
            background: alpha(C.yellow, 0.08), border: `1px solid ${alpha(C.yellow, 0.3)}`,
            borderRadius: 10, animation: "tPulse 1.2s ease-in-out infinite",
          }}>
            <div style={{ fontSize: 12, color: C.yellow, fontWeight: 700, marginBottom: 4 }}>
              {state === "opt_out_window"
                ? `OPT-OUT WINDOW — ${optOutTicksLeft ?? "…"}t left`
                : `AUTO-LAUNCHING IN ${optOutTicksLeft != null ? `${optOutTicksLeft}t` : "…"}`
              }
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>
              Hold <Key>SPACE</Key> or <Key>↓</Key> to stay on this floor
            </div>
            {optOutWindowTicks != null && (
              <div style={{ marginTop: 6, width: "100%", height: 3, background: alpha(C.yellow, 0.2), borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${optOutPct}%`, background: C.yellow, borderRadius: 2, transition: "width 50ms linear" }} />
              </div>
            )}
            <div style={{ fontSize: 10, color: C.faint, marginTop: 6, lineHeight: 1.4 }}>
              You landed on a trampoline — it will bounce you back to F{fromFloor} unless you cancel.
            </div>
          </div>
        )}

        {/* Cancelled */}
        {state === "cancelled" && (
          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: alpha(C.green, 0.08), border: `1px solid ${alpha(C.green, 0.3)}`,
            borderRadius: 10, animation: "tPop 0.25s ease-out",
          }}>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>✓ Launch cancelled</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Staying on Floor {fromFloor}</div>
          </div>
        )}

        {/* Arrived */}
        {state === "arrived" && (
          <div style={{ marginTop: 10, fontSize: 12, color: meta.color, fontWeight: 700, animation: "tFlash 0.4s ease-in-out 2" }}>
            ✓ Floor {toFloor}{toLabel ? ` — ${toLabel}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

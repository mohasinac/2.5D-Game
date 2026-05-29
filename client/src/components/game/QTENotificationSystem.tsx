/**
 * QTENotificationSystem — one component per QTE archetype.
 *
 * Design table:
 *
 * ┌────────────────────┬──────────────────┬──────────────┬────────────────────┬────────────────────┐
 * │ Variant            │ Trigger           │ Shape        │ Position           │ Colour theme       │
 * ├────────────────────┼──────────────────┼──────────────┼────────────────────┼────────────────────┤
 * │ SequenceQTE        │ qte-prompt        │ Compact card │ Bottom-centre      │ Yellow→Green/Red   │
 * │ (counter/hijack)   │ beylink-hijack    │ 220×~110px   │                    │                    │
 * ├────────────────────┼──────────────────┼──────────────┼────────────────────┼────────────────────┤
 * │ MashQTE            │ collision-start   │ Slim strip   │ Right edge, v-mid  │ Dynamic power bar  │
 * │ (clash mash)       │                   │ 152×~120px   │                    │ green→gold         │
 * ├────────────────────┼──────────────────┼──────────────┼────────────────────┼────────────────────┤
 * │ SingleKeyQTE       │ beylink-escape    │ Toast pill   │ Top-centre         │ Cyan (escape)      │
 * │ (escape/block)     │ beylink-hjk-block │ 190×~46px    │                    │ Blue (block)       │
 * ├────────────────────┼──────────────────┼──────────────┼────────────────────┼────────────────────┤
 * │ DebuffNotice       │ beylink-ctrl-loss │ Status badge │ Top-left           │ Red/amber          │
 * │ (passive debuff)   │                   │ 160×~52px    │                    │                    │
 * └────────────────────┴──────────────────┴────────────────────┴────────────────────┘
 */

import React, { useEffect, useRef, useState } from "react";
import type { QTEPromptData } from "@/game/hooks/useColyseus";

// ─── Key display helpers ──────────────────────────────────────────────────────
const KEY_DISPLAY: Record<string, string> = {
  left: "←", right: "→", up: "↑", down: "↓",
  attack: "J", defense: "K", dodge: "L",
};
const KEYMAP: Record<string, string> = {
  ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
  j: "attack", k: "defense", l: "dodge",
  J: "attack", K: "defense", L: "dodge",
};

// ─── Shared timer hook ────────────────────────────────────────────────────────
function useCountdown(expiresAt: number | null, onExpire: () => void) {
  const [frac, setFrac] = useState(1.0);
  useEffect(() => {
    if (!expiresAt) return;
    const total = expiresAt - Date.now();
    if (total <= 0) { onExpire(); return; }
    const id = setInterval(() => {
      const rem = expiresAt - Date.now();
      const f = Math.max(0, rem / total);
      setFrac(f);
      if (f <= 0) { clearInterval(id); onExpire(); }
    }, 50);
    return () => clearInterval(id);
  }, [expiresAt]);
  return frac;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SEQUENCE QTE — compact bottom-centre card with key-sequence pills
//    Used for: counter (block opponent's special) + BeyLink hijack attack
// ─────────────────────────────────────────────────────────────────────────────

interface SequenceQTEProps {
  prompt: QTEPromptData;
  variant?: "counter" | "hijack";    // counter=yellow, hijack=purple
  onKeyPress: (key: string) => void;
  onDismiss: () => void;
  onSuccess?: () => void;            // fired immediately when sequence completes
}

export function SequenceQTE({ prompt, variant = "counter", onKeyPress, onDismiss, onSuccess }: SequenceQTEProps) {
  const [progress, setProgress] = useState(0);
  const [shake, setShake]       = useState(false);
  const [result, setResult]     = useState<"success" | null>(null);
  const progressRef             = useRef(progress);
  const resultRef               = useRef(result);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { resultRef.current = result; }, [result]);

  // Reset on new prompt
  useEffect(() => {
    setProgress(0); setShake(false); setResult(null);
  }, [prompt.attackerBeyId, prompt.expiresAt]);

  const frac = useCountdown(prompt.expiresAt, onDismiss);

  // Keyboard
  useEffect(() => {
    if (result) return;
    const handler = (e: KeyboardEvent) => {
      if (resultRef.current) return;
      const key = KEYMAP[e.key];
      if (!key) return;
      e.preventDefault();
      const expected = prompt.sequence[progressRef.current];
      if (key === expected) {
        const next = progressRef.current + 1;
        if (next >= prompt.sequence.length) {
          setProgress(next); setResult("success");
          onSuccess?.();
          onKeyPress(key); setTimeout(onDismiss, 450);
        } else {
          setProgress(next); onKeyPress(key);
        }
      } else {
        setProgress(0); setShake(true);
        setTimeout(() => setShake(false), 260);
        onKeyPress(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prompt, result, onKeyPress, onDismiss]);

  const accent     = variant === "hijack" ? "#a855f7" : "#eab308";
  const timerColor = frac > 0.5 ? "#22c55e" : frac > 0.25 ? "#eab308" : "#ef4444";
  const borderCol  = result ? "#22c55e" : accent;

  return (
    <div
      data-testid="qte-sequence"
      style={{
        width: 220, background: "rgba(10,12,22,0.90)",
        border: `1.5px solid ${borderCol}`,
        borderRadius: 12, padding: "8px 12px 10px",
        boxShadow: `0 4px 20px rgba(0,0,0,0.55), 0 0 12px ${borderCol}33`,
        transform: shake ? "translateX(-5px)" : "none",
        transition: "transform 0.06s",
        pointerEvents: "none", userSelect: "none", position: "relative",
        textAlign: "center",
      }}
    >
      {/* Label */}
      <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 5 }}>
        {variant === "hijack" ? "🔗 Hijack!" : "⚡ Counter!"}
      </div>

      {/* Key sequence */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 7 }}>
        {prompt.sequence.map((k, i) => {
          const done    = result || i < progress;
          const current = !result && i === progress;
          return (
            <div key={i} data-testid={`qte-key-${i}`} style={{
              width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, fontSize: 13, fontWeight: 800,
              border: `1.5px solid ${done ? "#22c55e" : current ? accent : "#2d3748"}`,
              background: done ? "rgba(34,197,94,0.18)" : current ? `${accent}20` : "rgba(20,25,40,0.6)",
              color: done ? "#22c55e" : current ? accent : "#4a5568",
              transition: "all 0.08s",
            }}>
              {KEY_DISPLAY[k] ?? k.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Timer bar */}
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${frac * 100}%`, background: timerColor, borderRadius: 2, transition: "width 0.05s linear, background 0.3s" }} />
      </div>

      {/* Success flash */}
      {result && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 11,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(34,197,94,0.18)", color: "#22c55e",
          fontSize: 14, fontWeight: 900, letterSpacing: "0.1em",
        }}>
          BLOCKED!
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MASH QTE — slim right-edge strip for collision clash
//    Used for: collision-qte-start
// ─────────────────────────────────────────────────────────────────────────────

interface MashQTEProps {
  active: boolean;
  power: number;           // 0–150
  maxPower?: number;
  canFireSpecial: boolean;
  qteMultiplier: number;
  currentSP: number;
  onFireSpecial: () => void;
  onMash?: () => void;
}

function mashColor(p: number) {
  if (p >= 150) return "#ffd700";
  if (p >= 100) return "#ff6600";
  if (p >= 80)  return "#ffaa00";
  if (p >= 50)  return "#ffcc00";
  return "#44ff88";
}

export function MashQTE({ active, power, maxPower = 150, canFireSpecial, qteMultiplier, currentSP, onFireSpecial, onMash }: MashQTEProps) {
  const specialFiredRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      onMash?.();
      if (e.code === "Space" && canFireSpecial && !specialFiredRef.current) {
        e.preventDefault(); specialFiredRef.current = true; onFireSpecial();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, canFireSpecial, onFireSpecial, onMash]);

  useEffect(() => { if (active) specialFiredRef.current = false; }, [active]);

  if (!active) return null;

  const fillPct   = Math.min(100, (power / maxPower) * 100);
  const color     = mashColor(power);
  const finalMult = (qteMultiplier * currentSP / 100).toFixed(1);

  return (
    <div
      data-testid="qte-mash"
      style={{
        width: 152, background: "rgba(8,10,20,0.84)",
        border: `1.5px solid ${color}66`,
        borderRadius: 10, padding: "7px 10px 8px",
        boxShadow: `0 3px 16px rgba(0,0,0,0.5), 0 0 8px ${color}22`,
        userSelect: "none", display: "flex", flexDirection: "column", gap: 5,
      }}
    >
      {/* Title */}
      <div style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        ⚡ CLASH — MASH!
      </div>

      {/* Power bar */}
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 3, height: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${fillPct}%`,
          background: color, borderRadius: 3,
          transition: "width 0.05s linear, background 0.1s",
          boxShadow: fillPct >= 67 ? `0 0 5px ${color}` : undefined,
        }} />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color, fontWeight: 700 }}>{power}%</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{finalMult}x dmg</span>
      </div>

      {/* Special prompt */}
      {canFireSpecial && (
        <div
          data-testid="qte-mash-special"
          onClick={onFireSpecial}
          style={{
            fontSize: 8, fontWeight: 800, color: "#ff8800",
            textAlign: "center", letterSpacing: "0.08em",
            padding: "3px 0", border: "1px solid #ff880055", borderRadius: 4,
            animation: "mash-blink 0.5s infinite alternate",
            pointerEvents: "auto", cursor: "pointer",
          }}
        >
          🔥 SPACE → SPECIAL
        </div>
      )}

      <style>{`
        @keyframes mash-blink { from { opacity: 0.6; } to { opacity: 1.0; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SINGLE KEY QTE — small toast pill, top-centre
//    Used for: beylink-escape (victim escapes trap) + beylink-hijack-block (defender blocks)
// ─────────────────────────────────────────────────────────────────────────────

export interface SingleKeyQTEData {
  key: string;              // the single key to press
  label: string;            // e.g. "Escape!" or "Block Hijack!"
  expiresAt: number;
  variant: "escape" | "block";
}

interface SingleKeyQTEProps {
  data: SingleKeyQTEData;
  onPress: (key: string) => void;
  onDismiss: () => void;
}

export function SingleKeyQTE({ data, onPress, onDismiss }: SingleKeyQTEProps) {
  const [result, setResult] = useState<"success" | null>(null);
  const resultRef = useRef(result);
  useEffect(() => { resultRef.current = result; }, [result]);

  const frac = useCountdown(result ? null : data.expiresAt, onDismiss);

  useEffect(() => {
    if (result) return;
    const handler = (e: KeyboardEvent) => {
      if (resultRef.current) return;
      const pressed = KEYMAP[e.key] ?? e.key.toLowerCase();
      if (pressed === data.key || e.key.toLowerCase() === data.key) {
        e.preventDefault();
        setResult("success");
        onPress(data.key);
        setTimeout(onDismiss, 400);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, result, onPress, onDismiss]);

  const accent     = data.variant === "escape" ? "#06b6d4" : "#3b82f6";
  const timerColor = frac > 0.5 ? accent : frac > 0.25 ? "#eab308" : "#ef4444";
  const keyLabel   = KEY_DISPLAY[data.key] ?? data.key.toUpperCase();

  return (
    <div
      data-testid="qte-single-key"
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(8,12,24,0.88)",
        border: `1.5px solid ${result ? "#22c55e" : accent}`,
        borderRadius: 24, padding: "6px 14px 6px 8px",
        boxShadow: `0 2px 14px rgba(0,0,0,0.5), 0 0 8px ${accent}33`,
        userSelect: "none", pointerEvents: "none", position: "relative", overflow: "hidden",
      }}
    >
      {/* Timer fill behind everything */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 24,
        background: timerColor,
        width: `${frac * 100}%`, opacity: 0.08,
        transition: "width 0.05s linear, background 0.3s",
      }} />

      {/* Key chip */}
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        background: result ? "#22c55e22" : `${accent}22`,
        border: `1.5px solid ${result ? "#22c55e" : accent}`,
        borderRadius: 7, fontSize: 14, fontWeight: 900,
        color: result ? "#22c55e" : accent,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {result ? "✓" : keyLabel}
      </div>

      {/* Text */}
      <div style={{ fontSize: 10, fontWeight: 700, color: result ? "#22c55e" : "rgba(255,255,255,0.85)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
        {result ? "Done!" : data.label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DEBUFF NOTICE — passive status badge, top-left
//    Used for: beylink-control-loss (reverse / scramble / freeze)
// ─────────────────────────────────────────────────────────────────────────────

export interface DebuffNoticeData {
  mode: "reverse" | "scramble" | "freeze";
  durationTicks: number;
  startedAt: number;   // Date.now() when received
  tickMs?: number;     // ms per server tick, default 16
}

interface DebuffNoticeProps {
  data: DebuffNoticeData;
  onExpire: () => void;
}

const DEBUFF_META: Record<string, { icon: string; label: string; color: string }> = {
  reverse:  { icon: "↩", label: "REVERSED",  color: "#ef4444" },
  scramble: { icon: "⁇", label: "SCRAMBLED", color: "#f97316" },
  freeze:   { icon: "❄", label: "FROZEN",    color: "#38bdf8" },
};

export function DebuffNotice({ data, onExpire }: DebuffNoticeProps) {
  const tickMs     = data.tickMs ?? 16;
  const totalMs    = data.durationTicks * tickMs;
  const expiresAt  = data.startedAt + totalMs;
  const frac       = useCountdown(expiresAt, onExpire);
  const meta       = DEBUFF_META[data.mode] ?? DEBUFF_META.scramble;

  return (
    <div
      data-testid="qte-debuff"
      style={{
        width: 160, background: "rgba(8,10,20,0.86)",
        border: `1.5px solid ${meta.color}88`,
        borderRadius: 8, padding: "5px 10px 6px",
        boxShadow: `0 2px 12px rgba(0,0,0,0.5)`,
        userSelect: "none", pointerEvents: "none",
        display: "flex", flexDirection: "column", gap: 4,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 13 }}>{meta.icon}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: meta.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {meta.label}
        </span>
      </div>

      {/* Duration bar */}
      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${frac * 100}%`, background: meta.color, borderRadius: 2, transition: "width 0.1s linear" }} />
      </div>
    </div>
  );
}

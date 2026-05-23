// BeyLink Hijack HUD — shown to victim (hijack initiated) and attacker (block window).
// Also handles escape QTE (victim presses key to break free) and control-loss banner.
// All panels share the same screen slot (bottom-center, above ComboHUD).

import React, { useEffect, useRef, useState } from "react";
import type { BeyLinkHijackQTEData, BeyLinkHijackBlockQTEData, BeyLinkQTEData, BeyLinkControlLossData } from "@/game/hooks/useColyseus";

// ─── Countdown ring ───────────────────────────────────────────────────────────

function CountdownRing({ fraction, color, size = 36 }: { fraction: number; color: string; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color + "22"} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${circ * fraction} ${circ}`}
        style={{ transition: "stroke-dasharray 100ms linear" }} />
    </svg>
  );
}

// ─── Key cap ──────────────────────────────────────────────────────────────────

function KeyCap({ k, color }: { k: string; color: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 34, height: 34, borderRadius: 7,
      background: color + "22",
      border: `2px solid ${color}`,
      boxShadow: `0 3px 0 ${color}88, 0 0 10px ${color}55`,
      color, fontWeight: 900, fontSize: 16, fontFamily: "monospace",
      userSelect: "none",
    }}>{k}</div>
  );
}

// ─── Victim panel — hijack initiated, waiting for attacker ────────────────────

function VictimPanel({ data }: { data: BeyLinkHijackQTEData }) {
  const [fraction, setFraction] = useState(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = data.expiresAt - Date.now();
      const total = data.windowTicks * (1000 / 60);
      setFraction(Math.max(0, remaining / total));
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)",
      border: "1px solid #818cf888", borderRadius: 12,
      padding: "10px 16px", minWidth: 220,
      boxShadow: "0 0 24px #818cf822",
      animation: "beylink-pulse-blue 1.2s ease-in-out infinite",
    }}>
      <CountdownRing fraction={fraction} color="#818cf8" />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 6px #818cf8" }} />
          <span style={{ color: "#818cf8", fontWeight: 800, fontSize: 11, letterSpacing: 0.8 }}>HIJACK INITIATED</span>
        </div>
        <div style={{ color: "#9ca3af", fontSize: 10 }}>
          Waiting for attacker to respond…
        </div>
        <div style={{ marginTop: 5, height: 2, background: "#ffffff11", borderRadius: 1 }}>
          <div style={{ width: `${fraction * 100}%`, height: "100%", background: "#818cf8", borderRadius: 1, transition: "width 100ms linear" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Attacker panel — block window ───────────────────────────────────────────

interface AttackerPanelProps {
  data: BeyLinkHijackBlockQTEData;
  onBlock: (stackKey: string, key: string) => void;
}
function AttackerPanel({ data, onBlock }: AttackerPanelProps) {
  const [fraction, setFraction] = useState(1);
  const [pressed, setPressed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = data.expiresAt - Date.now();
      const total = data.windowTicks * (1000 / 60);
      setFraction(Math.max(0, remaining / total));
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === data.key.toUpperCase() && !pressed) {
        setPressed(true);
        onBlock(data.stackKey, data.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, onBlock, pressed]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)",
      border: `1px solid ${pressed ? "#14b8a888" : "#ef444488"}`, borderRadius: 12,
      padding: "10px 16px", minWidth: 240,
      boxShadow: `0 0 24px ${pressed ? "#14b8a822" : "#ef444422"}`,
      animation: pressed ? "none" : "beylink-pulse-red 0.7s ease-in-out infinite",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}>
      <CountdownRing fraction={fraction} color={pressed ? "#14b8a6" : "#ef4444"} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: pressed ? "#14b8a6" : "#ef4444", boxShadow: `0 0 6px ${pressed ? "#14b8a6" : "#ef4444"}` }} />
          <span style={{ color: pressed ? "#14b8a6" : "#ef4444", fontWeight: 800, fontSize: 11, letterSpacing: 0.8 }}>
            {pressed ? "BLOCKED!" : "HIJACK INCOMING!"}
          </span>
        </div>
        {!pressed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <KeyCap k={data.key} color="#ef4444" />
            <span style={{ color: "#d1d5db", fontSize: 10 }}>
              Block the takeover
            </span>
          </div>
        )}
        {pressed && (
          <div style={{ color: "#14b8a6", fontSize: 10, fontWeight: 600 }}>
            You denied the hijack attempt
          </div>
        )}
        {!pressed && (
          <div style={{ marginTop: 5, height: 2, background: "#ffffff11", borderRadius: 1 }}>
            <div style={{ width: `${fraction * 100}%`, height: "100%", background: "#ef4444", borderRadius: 1, transition: "width 100ms linear" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Escape QTE panel — victim must press the displayed key to break free ─────

function EscapePanel({ data, onEscape }: { data: BeyLinkQTEData; onEscape: (key: string) => void }) {
  const [fraction, setFraction] = useState(1);
  const [pressed, setPressed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const remaining = data.expiresAt - Date.now();
      const total = data.windowTicks * (1000 / 60);
      setFraction(Math.max(0, remaining / total));
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === data.key.toUpperCase() && !pressed) {
        setPressed(true);
        onEscape(data.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, onEscape, pressed]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)",
      border: `1px solid ${pressed ? "#14b8a888" : "#f59e0b88"}`, borderRadius: 12,
      padding: "10px 16px", minWidth: 230,
      boxShadow: `0 0 24px ${pressed ? "#14b8a822" : "#f59e0b22"}`,
      animation: pressed ? "none" : "beylink-pulse-orange 0.8s ease-in-out infinite",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}>
      <style>{`
        @keyframes beylink-pulse-orange {
          0%,100% { box-shadow: 0 0 10px #f59e0b22; }
          50%      { box-shadow: 0 0 22px #f59e0b88; }
        }
      `}</style>
      <CountdownRing fraction={fraction} color={pressed ? "#14b8a6" : "#f59e0b"} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: pressed ? "#14b8a6" : "#f59e0b", boxShadow: `0 0 6px ${pressed ? "#14b8a6" : "#f59e0b"}` }} />
          <span style={{ color: pressed ? "#14b8a6" : "#f59e0b", fontWeight: 800, fontSize: 11, letterSpacing: 0.8 }}>
            {pressed ? "BREAKING FREE!" : "LINK TRAP!"}
          </span>
        </div>
        {!pressed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <KeyCap k={data.key} color="#f59e0b" />
            <span style={{ color: "#d1d5db", fontSize: 10 }}>Press to escape the link</span>
          </div>
        )}
        {pressed && (
          <div style={{ color: "#14b8a6", fontSize: 10, fontWeight: 600 }}>Escape key registered!</div>
        )}
        {!pressed && (
          <div style={{ marginTop: 5, height: 2, background: "#ffffff11", borderRadius: 1 }}>
            <div style={{ width: `${fraction * 100}%`, height: "100%", background: "#f59e0b", borderRadius: 1, transition: "width 100ms linear" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Control-loss banner — notifies player their controls are altered ──────────

const CONTROL_LOSS_META: Record<BeyLinkControlLossData["mode"], { label: string; desc: string; color: string }> = {
  reverse:  { label: "CONTROLS REVERSED",  desc: "Left/Right inputs are swapped!",          color: "#ef4444" },
  scramble: { label: "CONTROLS SCRAMBLED", desc: "Input directions are randomised!",         color: "#f97316" },
  freeze:   { label: "CONTROLS FROZEN",    desc: "Bey is unresponsive — fight the link!",   color: "#818cf8" },
};

function ControlLossBanner({ data }: { data: BeyLinkControlLossData }) {
  const [visible, setVisible] = useState(true);
  const meta = CONTROL_LOSS_META[data.mode];
  useEffect(() => {
    const id = setTimeout(() => setVisible(false), data.durationTicks * (1000 / 60));
    return () => clearTimeout(id);
  }, [data]);
  if (!visible) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)",
      border: `1px solid ${meta.color}88`, borderRadius: 12,
      padding: "8px 14px",
      animation: "beylink-pulse-cl 0.6s ease-in-out infinite",
    }}>
      <style>{`
        @keyframes beylink-pulse-cl {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.7; }
        }
      `}</style>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div>
        <div style={{ color: meta.color, fontWeight: 800, fontSize: 11, letterSpacing: 0.8 }}>{meta.label}</div>
        <div style={{ color: "#9ca3af", fontSize: 10, marginTop: 2 }}>{meta.desc}</div>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface BeyLinkHijackHUDProps {
  hijackQTE: BeyLinkHijackQTEData | null;
  hijackBlockQTE: BeyLinkHijackBlockQTEData | null;
  onBlock: (stackKey: string, key: string) => void;
  /** Escape QTE shown when player is trapped in a hostile link. */
  escapeQTE?: BeyLinkQTEData | null;
  /** Called with the key the player pressed to escape the link. */
  onEscape?: (key: string) => void;
  /** Active control-loss effect (reverse / scramble / freeze). */
  controlLoss?: BeyLinkControlLossData | null;
}

export function BeyLinkHijackHUD({ hijackQTE, hijackBlockQTE, onBlock, escapeQTE, onEscape, controlLoss }: BeyLinkHijackHUDProps) {
  if (!hijackQTE && !hijackBlockQTE && !escapeQTE && !controlLoss) return null;

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes beylink-pulse-blue {
          0%,100% { box-shadow: 0 0 10px #818cf822; }
          50%      { box-shadow: 0 0 22px #818cf866; }
        }
        @keyframes beylink-pulse-red {
          0%,100% { box-shadow: 0 0 10px #ef444422; }
          50%      { box-shadow: 0 0 22px #ef444488; }
        }
      `}</style>

      <div style={{
        position: "absolute",
        bottom: 110,             // above ComboHUD
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
      }}>
        {controlLoss && <ControlLossBanner data={controlLoss} />}
        {escapeQTE && onEscape && (
          <div style={{ pointerEvents: "auto" }}>
            <EscapePanel data={escapeQTE} onEscape={onEscape} />
          </div>
        )}
        {hijackQTE && <VictimPanel data={hijackQTE} />}
        {hijackBlockQTE && (
          <div style={{ pointerEvents: "auto" }}>
            <AttackerPanel data={hijackBlockQTE} onBlock={onBlock} />
          </div>
        )}
      </div>
    </>
  );
}

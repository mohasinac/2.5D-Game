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
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color + "22"} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${circ * fraction} ${circ}`}
        className="[transition:stroke-dasharray_100ms_linear]" />
    </svg>
  );
}

// ─── Key cap ──────────────────────────────────────────────────────────────────

function KeyCap({ k, color }: { k: string; color: string }) {
  return (
    <div
      className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[7px] font-black text-[16px] font-mono select-none border-2"
      style={{ "--tc": color, borderColor: color, boxShadow: `0 3px 0 ${color}88, 0 0 10px ${color}55`, color, background: `${color}22` } as React.CSSProperties}
    >{k}</div>
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
    <div
      className="flex items-center gap-[10px] bg-[rgba(10,10,20,0.92)] backdrop-blur-sm rounded-xl px-4 py-[10px] min-w-[220px] border border-[#818cf888] shadow-[0_0_24px_#818cf822] [animation:beylink-pulse-blue_1.2s_ease-in-out_infinite]"
    >
      <CountdownRing fraction={fraction} color="#818cf8" />
      <div className="flex-1">
        <div className="flex items-center gap-[6px] mb-[3px]">
          <div className="w-[7px] h-[7px] rounded-full bg-[#818cf8] shadow-[0_0_6px_#818cf8]" />
          <span className="text-[#818cf8] font-extrabold text-[11px] tracking-[0.8px]">HIJACK INITIATED</span>
        </div>
        <div className="text-[#9ca3af] text-[10px]">
          Waiting for attacker to respond…
        </div>
        <div className="mt-[5px] h-[2px] bg-[rgba(255,255,255,0.067)] rounded-[1px]">
          <div className="h-full bg-[#818cf8] rounded-[1px] [transition:width_100ms_linear]" style={{ width: `${fraction * 100}%` }} />
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
    <div
      className={`flex items-center gap-[10px] bg-[rgba(10,10,20,0.92)] backdrop-blur-sm rounded-xl px-4 py-[10px] min-w-[240px] border [transition:border-color_0.2s,box-shadow_0.2s] ${pressed ? "border-[#14b8a888] shadow-[0_0_24px_#14b8a822]" : "border-[#ef444488] shadow-[0_0_24px_#ef444422] [animation:beylink-pulse-red_0.7s_ease-in-out_infinite]"}`}
    >
      <CountdownRing fraction={fraction} color={pressed ? "#14b8a6" : "#ef4444"} />
      <div className="flex-1">
        <div className="flex items-center gap-[6px] mb-[5px]">
          <div
            className={`w-[7px] h-[7px] rounded-full ${pressed ? "bg-[#14b8a6] shadow-[0_0_6px_#14b8a6]" : "bg-[#ef4444] shadow-[0_0_6px_#ef4444]"}`}
          />
          <span className={`font-extrabold text-[11px] tracking-[0.8px] ${pressed ? "text-[#14b8a6]" : "text-[#ef4444]"}`}>
            {pressed ? "BLOCKED!" : "HIJACK INCOMING!"}
          </span>
        </div>
        {!pressed && (
          <div className="flex items-center gap-2">
            <KeyCap k={data.key} color="#ef4444" />
            <span className="text-[#d1d5db] text-[10px]">
              Block the takeover
            </span>
          </div>
        )}
        {pressed && (
          <div className="text-[#14b8a6] text-[10px] font-semibold">
            You denied the hijack attempt
          </div>
        )}
        {!pressed && (
          <div className="mt-[5px] h-[2px] bg-[rgba(255,255,255,0.067)] rounded-[1px]">
            <div className="h-full bg-[#ef4444] rounded-[1px] [transition:width_100ms_linear]" style={{ width: `${fraction * 100}%` }} />
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
    <div
      className={`flex items-center gap-[10px] bg-[rgba(10,10,20,0.92)] backdrop-blur-sm rounded-xl px-4 py-[10px] min-w-[230px] border [transition:border-color_0.2s,box-shadow_0.2s] ${pressed ? "border-[#14b8a888] shadow-[0_0_24px_#14b8a822]" : "border-[#f59e0b88] shadow-[0_0_24px_#f59e0b22] [animation:beylink-pulse-orange_0.8s_ease-in-out_infinite]"}`}
    >
      <style>{`
        @keyframes beylink-pulse-orange {
          0%,100% { box-shadow: 0 0 10px #f59e0b22; }
          50%      { box-shadow: 0 0 22px #f59e0b88; }
        }
      `}</style>
      <CountdownRing fraction={fraction} color={pressed ? "#14b8a6" : "#f59e0b"} />
      <div className="flex-1">
        <div className="flex items-center gap-[6px] mb-[5px]">
          <div
            className={`w-[7px] h-[7px] rounded-full ${pressed ? "bg-[#14b8a6] shadow-[0_0_6px_#14b8a6]" : "bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]"}`}
          />
          <span className={`font-extrabold text-[11px] tracking-[0.8px] ${pressed ? "text-[#14b8a6]" : "text-[#f59e0b]"}`}>
            {pressed ? "BREAKING FREE!" : "LINK TRAP!"}
          </span>
        </div>
        {!pressed && (
          <div className="flex items-center gap-2">
            <KeyCap k={data.key} color="#f59e0b" />
            <span className="text-[#d1d5db] text-[10px]">Press to escape the link</span>
          </div>
        )}
        {pressed && (
          <div className="text-[#14b8a6] text-[10px] font-semibold">Escape key registered!</div>
        )}
        {!pressed && (
          <div className="mt-[5px] h-[2px] bg-[rgba(255,255,255,0.067)] rounded-[1px]">
            <div className="h-full bg-[#f59e0b] rounded-[1px] [transition:width_100ms_linear]" style={{ width: `${fraction * 100}%` }} />
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
    <div
      className="flex items-center gap-[10px] bg-[rgba(10,10,20,0.92)] backdrop-blur-sm rounded-xl px-[14px] py-2 border [animation:beylink-pulse-cl_0.6s_ease-in-out_infinite]"
      style={{ borderColor: `${meta.color}88` }}
    >
      <style>{`
        @keyframes beylink-pulse-cl {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.7; }
        }
      `}</style>
      <span className="text-[18px]">⚠️</span>
      <div>
        <div className="font-extrabold text-[11px] tracking-[0.8px]" style={{ color: meta.color }}>{meta.label}</div>
        <div className="text-[#9ca3af] text-[10px] mt-[2px]">{meta.desc}</div>
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
      }}
        className="flex flex-col items-center gap-2 pointer-events-none"
      >
        {controlLoss && <ControlLossBanner data={controlLoss} />}
        {escapeQTE && onEscape && (
          <div className="pointer-events-auto">
            <EscapePanel data={escapeQTE} onEscape={onEscape} />
          </div>
        )}
        {hijackQTE && <VictimPanel data={hijackQTE} />}
        {hijackBlockQTE && (
          <div className="pointer-events-auto">
            <AttackerPanel data={hijackBlockQTE} onBlock={onBlock} />
          </div>
        )}
      </div>
    </>
  );
}

// ComboHUD — left-side combo strip with multiplier, meter, and activation flash.
// Multiplier (×1.0–×2.5): local streak counter, resets after 5s of no combos.
// Combo meter (purple): fills with streak, drains on reset.
// Activation popup: bold move name floats up + screen flash.

import React, { useEffect, useRef, useState } from "react";
import { costIcon, KEY_LABEL } from "@/constants/combos";
import type { ComboDoc } from "@/stores/gameDataStore";
import { HUD_COLORS } from "@/constants/hudColors";

const KL = KEY_LABEL as Record<string, string>;

const STREAK_TIMEOUT_MS = 5000;
const MAX_MULTIPLIER = 2.5;
const MULTIPLIER_STEP = 0.25;

interface ComboHUDProps {
  lastCombo: { name: string; comboId?: string; timestamp: number } | null;
  attachedComboIds?: string[];
  cooldowns?: Record<string, number>;
  power?: number;
  comboChargeScale?: number;
  comboMap?: Record<string, ComboDoc>;
}

export function ComboHUD({
  lastCombo, attachedComboIds, cooldowns, power = 0, comboChargeScale = 0, comboMap = {},
}: ComboHUDProps) {
  const [now, setNow] = useState(Date.now());
  const [multiplier, setMultiplier] = useState(1.0);
  const [meterPct, setMeterPct] = useState(0);
  const [activePopup, setActivePopup] = useState<{ name: string; key: number } | null>(null);
  const streakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLastComboRef = useRef<typeof lastCombo>(null);
  const popupKeyRef = useRef(0);

  // Tick at 10Hz for cooldown rings
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  // Handle new combo fired
  useEffect(() => {
    if (!lastCombo || lastCombo === prevLastComboRef.current) return;
    if (prevLastComboRef.current?.timestamp === lastCombo.timestamp) return;
    prevLastComboRef.current = lastCombo;

    // Increase multiplier (cap at MAX_MULTIPLIER)
    setMultiplier(prev => Math.min(MAX_MULTIPLIER, parseFloat((prev + MULTIPLIER_STEP).toFixed(2))));
    setMeterPct(prev => Math.min(100, prev + 20));

    // Show popup with combo name
    popupKeyRef.current += 1;
    setActivePopup({ name: lastCombo.name, key: popupKeyRef.current });
    const popT = setTimeout(() => setActivePopup(null), 1000);

    // Reset streak after timeout
    if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
    streakTimerRef.current = setTimeout(() => {
      setMultiplier(1.0);
      setMeterPct(0);
    }, STREAK_TIMEOUT_MS);

    return () => clearTimeout(popT);
  }, [lastCombo]);

  useEffect(() => () => {
    if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
  }, []);

  const attached = (attachedComboIds ?? []).map(id => comboMap[id]).filter(Boolean) as ComboDoc[];
  const hasStreak = multiplier > 1.0;

  return (
    <>
      {/* Left-side combo strip — shown only when bey has attached combos */}
      {attached.length > 0 && (
        <div className="absolute left-3 bottom-[100px] flex flex-col gap-2 pointer-events-none z-[11]" style={{ minWidth: 130 }}>

          {/* Multiplier + meter */}
          {hasStreak && (
            <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.6)" }}>
              <span
                className="font-black font-mono leading-none [animation:comboMult_0.2s_ease-out]"
                style={{
                  fontSize: "clamp(1.4rem,4vw,1.8rem)",
                  color: "#FFD700",
                  textShadow: "0 0 12px #FFD70088",
                }}
              >
                ×{multiplier.toFixed(2)}
              </span>
              <span className="text-[9px] font-mono text-[#FFD700]/60 uppercase tracking-widest">COMBO</span>
              {/* Meter bar */}
              <div className="w-full h-1.5 rounded-full overflow-hidden mt-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-[width_300ms]"
                  style={{ width: `${meterPct}%`, background: HUD_COLORS.comboFill, boxShadow: `0 0 6px ${HUD_COLORS.comboFill}` }}
                />
              </div>
            </div>
          )}

          {/* Attached combo buttons */}
          <div className="text-[9px] text-white/30 uppercase tracking-widest px-1">Combos</div>
          {attached.map(c => {
            if (!c) return null;
            const cdEnd = cooldowns?.[c.id] ?? 0;
            const onCooldown = now < cdEnd;
            const cdRemaining = onCooldown ? Math.max(0, cdEnd - now) : 0;
            const cdPct = onCooldown ? Math.min(1, cdRemaining / (c.cooldownMs || 1)) : 0;
            const insufficient = c.cost > 0 && power < c.cost;
            const dim = onCooldown || insufficient;

            return (
              <div
                key={c.id}
                className="relative rounded-[10px] px-2.5 py-2 overflow-hidden border transition-[opacity_200ms]"
                style={{
                  background: "rgba(15,23,42,0.88)",
                  borderColor: dim ? "rgba(255,255,255,0.1)" : HUD_COLORS.comboFill,
                  opacity: dim ? 0.5 : 1,
                  boxShadow: dim ? "none" : `0 0 8px 0 ${HUD_COLORS.comboFill}44`,
                  animation: !dim ? "comboBtnReady 1.8s ease-in-out infinite" : undefined,
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold" style={{ color: dim ? "rgba(255,255,255,0.4)" : HUD_COLORS.comboFill }}>
                    {c.name}
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: c.cost === 0 ? HUD_COLORS.actionReady : "rgba(255,255,255,0.4)" }}>
                    {costIcon(c.cost)}
                  </span>
                </div>
                <div className="flex gap-1">
                  {c.sequence.map((k, i) => (
                    <span key={i} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-white/70">{KL[k] ?? k}</span>
                  ))}
                </div>
                {onCooldown && (
                  <>
                    <div className="absolute left-0 bottom-0 h-0.5 transition-[width_100ms_linear]"
                      style={{ width: `${(1 - cdPct) * 100}%`, background: HUD_COLORS.comboFill }} />
                    <div className="absolute top-1 right-1.5 text-[8px] font-mono" style={{ color: HUD_COLORS.cooldown }}>
                      {(cdRemaining / 1000).toFixed(1)}s
                    </div>
                  </>
                )}
                {insufficient && !onCooldown && (
                  <div className="text-[8px] mt-0.5" style={{ color: HUD_COLORS.critical }}>
                    {c.cost}⚡ needed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Charge bar */}
      {comboChargeScale > 0 && (
        <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 z-[12]">
          <div className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: comboChargeScale >= 1 ? HUD_COLORS.healthy : HUD_COLORS.actionReady }}>
            {comboChargeScale >= 1 ? "CHARGED!" : "Charging..."}
          </div>
          <div className="w-36 h-1.5 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded transition-[width_100ms_linear]"
              style={{
                width: `${comboChargeScale * 100}%`,
                background: comboChargeScale >= 1 ? HUD_COLORS.healthy : HUD_COLORS.actionReady,
                boxShadow: comboChargeScale >= 1 ? `0 0 8px ${HUD_COLORS.healthy}` : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Activation popup (move name floats up) */}
      {activePopup && (
        <div
          key={activePopup.key}
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-[15] [animation:comboFloat_1s_ease-out_forwards]"
        >
          <div
            className="font-black uppercase tracking-[0.12em] font-mono whitespace-nowrap"
            style={{
              fontSize: "clamp(1.2rem,3.5vw,1.8rem)",
              color: HUD_COLORS.comboFill,
              textShadow: `0 0 20px ${HUD_COLORS.comboFill}`,
            }}
          >
            {activePopup.name}!
          </div>
        </div>
      )}

      <style>{`
        @keyframes comboFloat {
          0%   { opacity:1; transform:translateX(-50%) scale(1.2) translateY(0); }
          30%  { opacity:1; transform:translateX(-50%) scale(1)   translateY(-20px); }
          100% { opacity:0; transform:translateX(-50%) scale(0.9) translateY(-60px); }
        }
        @keyframes comboMult {
          0%   { transform:scale(1.4); }
          100% { transform:scale(1);   }
        }
        @keyframes comboBtnReady {
          0%,100% { box-shadow:0 0 8px 0 ${HUD_COLORS.comboFill}44; }
          50%     { box-shadow:0 0 14px 2px ${HUD_COLORS.comboFill}77; }
        }
      `}</style>
    </>
  );
}

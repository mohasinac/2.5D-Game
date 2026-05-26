import { useEffect, useState } from "react";
import { costIcon, KEY_LABEL } from "@/constants/combos";
const KL = KEY_LABEL as Record<string, string>;
import type { ComboDoc } from "@/stores/gameDataStore";

interface FiredComboEntry {
  id: string;
  name: string;
  firedAt: number;
}

interface ComboHUDProps {
  /** Last combo successfully activated (from `combo` broadcast). */
  lastCombo: { name: string; comboId?: string; timestamp: number } | null;
  /** Beyblade's attached combo ids (max 3). When provided, shows the persistent combo strip. */
  attachedComboIds?: string[];
  /** Per-combo cooldown end times (epoch ms). */
  cooldowns?: Record<string, number>;
  /** Current power level (0–100) — combos with cost > power are shown dimmed. */
  power?: number;
  /** Charge progress 0–1 for a charged combo being held. 0 = not charging. */
  comboChargeScale?: number;
  /** Pre-loaded combo map from Firebase — keyed by combo id. Replaces getComboDisplay. */
  comboMap?: Record<string, ComboDoc>;
}

export function ComboHUD({ lastCombo, attachedComboIds, cooldowns, power = 0, comboChargeScale = 0, comboMap = {} }: ComboHUDProps) {
  const [comboHistory, setComboHistory] = useState<FiredComboEntry[]>([]);
  const [comboPopup, setComboPopup] = useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());

  // Tick at 10Hz so cooldown rings progress visually.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (lastCombo) {
      const newEntry: FiredComboEntry = {
        id: `${lastCombo.comboId ?? lastCombo.name}-${lastCombo.timestamp}`,
        name: lastCombo.name,
        firedAt: lastCombo.timestamp,
      };
      setComboHistory((prev) => [newEntry, ...prev].slice(0, 4));
      setComboPopup(true);
      const timeout = setTimeout(() => setComboPopup(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [lastCombo]);

  const attached = (attachedComboIds ?? []).map(id => comboMap[id]).filter(Boolean) as ComboDoc[];

  return (
    <>
      {/* Attached-combos strip (bottom-right above history) — shown only when bey has combos */}
      {attached.length > 0 && (
        <div style={{
          position: "absolute", bottom: 88, right: 16,
          zIndex: 11,
        }}
          className="flex flex-col gap-[6px] pointer-events-none"
        >
          <div className="text-theme-muted text-[10px] uppercase tracking-[0.06em]">Combos</div>
          {attached.map((c) => {
            if (!c) return null;
            const cdEnd = cooldowns?.[c.id] ?? 0;
            const onCooldown = now < cdEnd;
            const cdRemaining = onCooldown ? Math.max(0, cdEnd - now) : 0;
            const cdPct = onCooldown ? Math.min(1, cdRemaining / c.cooldownMs) : 0;
            const insufficient = c.cost > 0 && power < c.cost;
            const dim = onCooldown || insufficient;
            return (
              <div key={c.id} className={`bg-[rgba(15,23,42,0.88)] rounded-[10px] px-[10px] py-2 min-w-[200px] relative overflow-hidden border ${dim ? "border-[#334155] opacity-[0.55]" : "border-[#22c55e] opacity-100"}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[12px] font-bold ${dim ? "text-[#94a3b8]" : "text-[#22c55e]"}`}>
                    {c.name}
                  </span>
                  <span className={`text-[10px] font-mono ${c.cost === 0 ? "text-[#eab308]" : "text-[#64748b]"}`}>
                    {costIcon(c.cost)}
                  </span>
                </div>
                <div className="text-theme-text text-[10px] flex gap-1">
                  {c.sequence.map((k, i) => (
                    <span key={i} className="bg-bg3 px-[6px] py-[2px] rounded font-mono text-[10px]">{KL[k] ?? k}</span>
                  ))}
                </div>
                {onCooldown && (
                  <div className="absolute left-0 bottom-0 h-[2px] bg-[#22c55e] [transition:width_100ms_linear]" style={{
                    width: `${(1 - cdPct) * 100}%`,
                  }} />
                )}
                {insufficient && !onCooldown && (
                  <div className="text-theme-red text-[9px] mt-1">
                    Needs {c.cost} power
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Charge bar — shown while player holds the last key of a charged combo */}
      {comboChargeScale > 0 && (
        <div data-testid="combo-charge-bar" style={{
          position: "absolute", bottom: 72, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 12,
        }}
          className="pointer-events-none flex flex-col items-center gap-1"
        >
          <div className="text-theme-yellow text-[10px] font-mono tracking-[0.1em] uppercase">
            {comboChargeScale >= 1 ? "CHARGED!" : "Charging…"}
          </div>
          <div className="w-[140px] h-[6px] bg-white/[.12] rounded-[3px] overflow-hidden">
            <div className="rounded-[3px] h-full [transition:width_100ms_linear,background_200ms]" style={{
              width: `${comboChargeScale * 100}%`,
              background: comboChargeScale >= 1 ? "#22c55e" : "#eab308",
              boxShadow: comboChargeScale >= 1 ? "0 0 8px #22c55e" : undefined,
            }} />
          </div>
        </div>
      )}

      {/* Fired-combo history (bottom-right) */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        zIndex: 10,
      }}
        className="flex flex-col gap-1 pointer-events-none"
      >
        {comboHistory.map((combo) => {
          const comboId = combo.id.split("-")[0];
          const display = comboMap[comboId] ?? comboMap[combo.name];
          return (
            <div key={combo.id} data-testid={`combo-fired-${combo.id}`} className="bg-[rgba(15,23,42,0.85)] rounded-lg px-3 py-2 min-w-[160px] border border-[#334155]" style={{
              animation: combo === comboHistory[0] ? "slideIn 0.3s ease-out" : undefined,
            }}>
              <div className="text-theme-muted text-[11px] mb-1">
                <span className="text-theme-green uppercase font-mono font-bold">
                  {display?.name ?? combo.name}
                </span>
              </div>
              <div className="text-theme-text text-[10px] flex gap-1 flex-wrap">
                {display?.sequence.map((k, idx) => (
                  <span key={idx} className="bg-bg3 px-[6px] py-[2px] rounded font-mono text-[9px]">{KL[k] ?? k}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMBO! popup */}
      {comboPopup && (
        <div style={{
          position: "absolute", bottom: "50%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
        }}
          className="pointer-events-none [animation:comboFloat_1.2s_ease-out_forwards]"
        >
          <div className="text-theme-green text-[56px] font-black uppercase tracking-[0.1em] font-mono [text-shadow:0_0_20px_#22c55e]">COMBO!</div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes comboFloat {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
        }
      `}</style>
    </>
  );
}

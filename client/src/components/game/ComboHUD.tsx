import { useEffect, useState } from "react";
import { C } from "@/styles/theme";
import { getComboDisplay, costIcon, KEY_LABEL } from "@/constants/combos";

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
}

export function ComboHUD({ lastCombo, attachedComboIds, cooldowns, power = 0 }: ComboHUDProps) {
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

  const attached = (attachedComboIds ?? []).map(id => getComboDisplay(id)).filter(Boolean) as Array<ReturnType<typeof getComboDisplay> & object>;

  return (
    <>
      {/* Attached-combos strip (bottom-right above history) — shown only when bey has combos */}
      {attached.length > 0 && (
        <div style={{
          position: "absolute", bottom: 88, right: 16,
          display: "flex", flexDirection: "column", gap: 6,
          pointerEvents: "none", zIndex: 11,
        }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Combos</div>
          {attached.map((c) => {
            if (!c) return null;
            const cdEnd = cooldowns?.[c.id] ?? 0;
            const onCooldown = now < cdEnd;
            const cdRemaining = onCooldown ? Math.max(0, cdEnd - now) : 0;
            const cdPct = onCooldown ? Math.min(1, cdRemaining / c.cooldownMs) : 0;
            const insufficient = c.cost > 0 && power < c.cost;
            const dim = onCooldown || insufficient;
            return (
              <div key={c.id} style={{
                background: "rgba(15, 23, 42, 0.88)",
                borderRadius: 10,
                border: `1px solid ${dim ? C.border : C.green}`,
                padding: "8px 10px", minWidth: 200,
                opacity: dim ? 0.55 : 1,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: dim ? C.muted : C.green }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 10, color: c.cost === 0 ? C.yellow : C.faint, fontFamily: "monospace" }}>
                    {costIcon(c.cost)}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: C.text, display: "flex", gap: 4 }}>
                  {c.sequence.map((k, i) => (
                    <span key={i} style={{
                      background: C.bg3, padding: "2px 6px", borderRadius: 4,
                      fontFamily: "monospace", fontSize: 10,
                    }}>{KEY_LABEL[k]}</span>
                  ))}
                </div>
                {onCooldown && (
                  <div style={{
                    position: "absolute", left: 0, bottom: 0, height: 2,
                    width: `${(1 - cdPct) * 100}%`, background: C.green,
                    transition: "width 100ms linear",
                  }} />
                )}
                {insufficient && !onCooldown && (
                  <div style={{ fontSize: 9, color: C.red, marginTop: 4 }}>
                    Needs {c.cost} power
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Fired-combo history (bottom-right) */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        display: "flex", flexDirection: "column", gap: 4,
        pointerEvents: "none", zIndex: 10,
      }}>
        {comboHistory.map((combo) => {
          const display = getComboDisplay(combo.name) ?? getComboDisplay(comboHistory[0].id.split("-")[0]);
          return (
            <div key={combo.id} style={{
              background: "rgba(15, 23, 42, 0.85)",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              padding: "8px 12px", minWidth: 160,
              animation: combo === comboHistory[0] ? "slideIn 0.3s ease-out" : undefined,
            }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
                <span style={{ textTransform: "uppercase", fontFamily: "monospace", color: C.green, fontWeight: 700 }}>
                  {display?.name ?? combo.name}
                </span>
              </div>
              <div style={{ fontSize: 10, color: C.text, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {display?.sequence.map((k, idx) => (
                  <span key={idx} style={{
                    background: C.bg3, padding: "2px 6px", borderRadius: 4,
                    fontFamily: "monospace", fontSize: 9,
                  }}>{KEY_LABEL[k]}</span>
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
          pointerEvents: "none", zIndex: 15,
          animation: "comboFloat 1.2s ease-out forwards",
        }}>
          <div style={{
            fontSize: 56, fontWeight: 900, color: C.green,
            textTransform: "uppercase",
            textShadow: `0 0 20px ${C.green}`,
            letterSpacing: "0.1em", fontFamily: "monospace",
          }}>COMBO!</div>
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

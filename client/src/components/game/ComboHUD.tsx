import { useEffect, useState } from "react";
import { C } from "@/styles/theme";

const COMBO_SEQUENCES: Record<string, string[]> = {
  storm_assault: ["Left", "Right", "Attack"],
  gyro_counter: ["Defend", "Defend", "Dodge"],
  aerial_smash: ["Jump", "Attack"],
  spinning_slash: ["Dodge", "Attack"],
  counter_strike: ["Defend + Attack"],
  dash_left: ["Left", "Left"],
  dash_right: ["Right", "Right"],
};

interface ComboEntry {
  id: string;
  name: string;
  firedAt: number;
}

interface ComboHUDProps {
  lastCombo: { name: string; timestamp: number } | null;
}

export function ComboHUD({ lastCombo }: ComboHUDProps) {
  const [comboHistory, setComboHistory] = useState<ComboEntry[]>([]);
  const [comboPopup, setComboPopup] = useState<boolean>(false);

  useEffect(() => {
    if (lastCombo) {
      const newEntry: ComboEntry = {
        id: `${lastCombo.name}-${lastCombo.timestamp}`,
        name: lastCombo.name,
        firedAt: lastCombo.timestamp,
      };
      setComboHistory((prev) => [newEntry, ...prev].slice(0, 4));
      setComboPopup(true);
      const timeout = setTimeout(() => setComboPopup(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [lastCombo]);

  return (
    <>
      {/* Combo list on bottom-right */}
      <div style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pointerEvents: "none",
        zIndex: 10,
      }}>
        {comboHistory.map((combo) => (
          <div
            key={combo.id}
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              padding: "8px 12px",
              minWidth: 160,
              animation: combo === comboHistory[0] ? "slideIn 0.3s ease-out" : undefined,
            }}
          >
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
              <span style={{ textTransform: "uppercase", fontFamily: "monospace", color: C.green, fontWeight: 700 }}>
                {combo.name}
              </span>
            </div>
            <div style={{ fontSize: 10, color: C.text, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {COMBO_SEQUENCES[combo.name]?.map((key, idx) => (
                <span
                  key={idx}
                  style={{
                    background: C.bg3,
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontFamily: "monospace",
                    fontSize: 9,
                  }}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* COMBO! popup */}
      {comboPopup && (
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 15,
            animation: "comboFloat 1.2s ease-out forwards",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: C.green,
              textTransform: "uppercase",
              textShadow: `0 0 20px ${C.green}`,
              letterSpacing: "0.1em",
              fontFamily: "monospace",
            }}
          >
            COMBO!
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes comboFloat {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px);
          }
        }
      `}</style>
    </>
  );
}

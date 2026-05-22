// [HUD] BeySelector — [1][2][3][4] strip for team battle bey switching.
// Shows up to 4 team beys; highlights the currently possessed one.
// Press 1/2/3/4 to signal possession request to server.

import { useEffect } from "react";
import { C } from "@/styles/theme";

interface BeySlot {
  index: number;
  beyId: string;
  username: string;
  health: number;
  maxHealth: number;
  spin: number;
  maxSpin: number;
  isActive: boolean;
  isControlled: boolean;
}

interface Props {
  slots: BeySlot[];
  onSelect: (index: number) => void;
}

export function BeySelector({ slots, onSelect }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Digit1") onSelect(0);
      else if (e.code === "Digit2") onSelect(1);
      else if (e.code === "Digit3") onSelect(2);
      else if (e.code === "Digit4") onSelect(3);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  if (slots.length === 0) return null;

  return (
    <div
      data-testid="bey-selector"
      style={{
        display: "flex",
        gap: 6,
        padding: "6px 10px",
        background: "#00000066",
        borderRadius: 10,
        backdropFilter: "blur(4px)",
      }}
    >
      {slots.map((slot, i) => {
        const healthPct = slot.maxHealth > 0 ? slot.health / slot.maxHealth : 0;
        const spinPct = slot.maxSpin > 0 ? slot.spin / slot.maxSpin : 0;
        const healthColor = healthPct > 0.5 ? "#22c55e" : healthPct > 0.25 ? "#eab308" : "#ef4444";

        return (
          <button
            key={slot.beyId}
            type="button"
            onClick={() => onSelect(i)}
            style={{
              width: 56,
              background: slot.isControlled
                ? "#3b82f633"
                : slot.isActive ? "#1e293b88" : "#1e293b44",
              border: `2px solid ${slot.isControlled ? "#3b82f6" : slot.isActive ? "#334155" : "#1e293b"}`,
              borderRadius: 8,
              padding: "4px 0",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              opacity: slot.isActive ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: slot.isControlled ? "#3b82f6" : "#94a3b8" }}>
              [{i + 1}]
            </span>
            <span style={{ fontSize: 9, color: "#f1f5f9", maxWidth: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {slot.username}
            </span>
            {/* Health bar */}
            <div style={{ width: 40, height: 3, background: "#334155", borderRadius: 2 }}>
              <div style={{ width: `${healthPct * 100}%`, height: "100%", background: healthColor, borderRadius: 2, transition: "width 0.2s" }} />
            </div>
            {/* Spin bar */}
            <div style={{ width: 40, height: 3, background: "#334155", borderRadius: 2 }}>
              <div style={{ width: `${spinPct * 100}%`, height: "100%", background: "#3b82f6", borderRadius: 2, transition: "width 0.2s" }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

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
      className="flex gap-1.5 px-2.5 py-1.5 bg-black/40 rounded-[10px] backdrop-blur"
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
              background: slot.isControlled
                ? "#3b82f633"
                : slot.isActive ? "#1e293b88" : "#1e293b44",
              border: `2px solid ${slot.isControlled ? "#3b82f6" : slot.isActive ? "#334155" : "#1e293b"}`,
              opacity: slot.isActive ? 1 : 0.4,
            }}
            className="w-14 rounded-lg py-1 cursor-pointer flex flex-col items-center gap-[3px]"
          >
            <span style={{ color: slot.isControlled ? "#3b82f6" : "#94a3b8" }} className="text-[10px] font-bold">
              [{i + 1}]
            </span>
            <span className="text-[9px] text-[#f1f5f9] max-w-12 overflow-hidden text-ellipsis whitespace-nowrap">
              {slot.username}
            </span>
            {/* Health bar */}
            <div className="w-10 h-[3px] bg-[#334155] rounded-sm">
              <div style={{ width: `${healthPct * 100}%`, background: healthColor }} className="h-full rounded-sm transition-[width] duration-200" />
            </div>
            {/* Spin bar */}
            <div className="w-10 h-[3px] bg-[#334155] rounded-sm">
              <div style={{ width: `${spinPct * 100}%` }} className="h-full bg-[#3b82f6] rounded-sm transition-[width] duration-200" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

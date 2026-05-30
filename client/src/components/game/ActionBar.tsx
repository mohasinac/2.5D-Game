// ActionBar — bottom action buttons row (Special Move + Combo shortcuts).
// Visible during in-progress state only.
// Special button pulses gold when ready; combos show cost badges and cooldowns.

import React from "react";
import { HUD_COLORS } from "@/constants/hudColors";
import type { SpecialMoveDoc } from "@/stores/gameDataStore";
import type { ComboDoc } from "@/stores/gameDataStore";

interface ActionBarProps {
  // Special move
  specialMove: SpecialMoveDoc | null;
  specialPower: number;          // 0–100
  specialCooldownMs: number;     // remaining cooldown in ms
  onSpecial: () => void;
  // Combos (up to 3)
  combos: ComboDoc[];
  comboCooldowns: Record<string, number>;  // comboId → epoch ms end
  currentPower: number;          // for greying out costly combos
  onCombo: (comboId: string) => void;
  // Pause
  onPause: () => void;
}

export function ActionBar({
  specialMove, specialPower, specialCooldownMs, onSpecial,
  combos, comboCooldowns, currentPower, onCombo,
  onPause,
}: ActionBarProps) {
  const now = Date.now();

  const specialReady = specialMove !== null && specialPower >= 50 && specialCooldownMs <= 0;
  const specialChargePct = Math.min(100, (specialPower / 100) * 100);

  return (
    <div className="flex items-center justify-center gap-2 pointer-events-auto select-none px-3 py-2">
      {/* Combo buttons */}
      {combos.map(combo => {
        const cdEnd = comboCooldowns[combo.id] ?? 0;
        const onCd = cdEnd > now;
        const cdFrac = onCd ? Math.min(1, (cdEnd - now) / (combo.cooldownMs || 1)) : 0;
        const canAfford = currentPower >= (combo.cost ?? 0);
        const disabled = onCd || !canAfford;

        return (
          <button
            key={combo.id}
            onClick={() => !disabled && onCombo(combo.id)}
            className="relative flex flex-col items-center justify-center rounded-xl transition-all duration-150 active:scale-95"
            style={{
              width: 56, height: 56,
              background: disabled ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.75)",
              border: `2px solid ${disabled ? "rgba(255,255,255,0.1)" : HUD_COLORS.comboFill}`,
              boxShadow: disabled ? "none" : `0 0 8px 0 ${HUD_COLORS.comboFill}66`,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {/* Cooldown sweep */}
            {onCd && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx={28} cy={28} r={24} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={3} />
                <circle
                  cx={28} cy={28} r={24}
                  fill="none"
                  stroke={HUD_COLORS.cooldown}
                  strokeWidth={3}
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={(1 - cdFrac) * 2 * Math.PI * 24}
                />
              </svg>
            )}
            <span className="text-[16px] z-[1]">{combo.sequence?.join("") ?? "?"}</span>
            {(combo.cost ?? 0) > 0 && (
              <span className="text-[8px] font-mono font-bold z-[1]" style={{ color: HUD_COLORS.actionReady }}>
                {combo.cost}⚡
              </span>
            )}
          </button>
        );
      })}

      {/* Special Move button */}
      {specialMove && (
        <button
          onClick={() => specialReady && onSpecial()}
          className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-150 active:scale-95"
          style={{
            width: 68, height: 68,
            background: specialReady ? "rgba(10,10,10,0.85)" : "rgba(0,0,0,0.6)",
            border: `3px solid ${specialReady ? HUD_COLORS.actionReady : "rgba(255,255,255,0.12)"}`,
            boxShadow: specialReady ? `0 0 16px 4px ${HUD_COLORS.actionReady}88` : "none",
            cursor: specialReady ? "pointer" : "not-allowed",
            animation: specialReady ? "specialReadyBounce 1.2s ease-in-out infinite" : undefined,
          }}
        >
          {/* Charge arc */}
          {!specialReady && specialCooldownMs <= 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 68 68">
              <circle cx={34} cy={34} r={28} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
              <circle
                cx={34} cy={34} r={28}
                fill="none"
                stroke={specialChargePct >= 50 ? HUD_COLORS.actionReady : HUD_COLORS.cooldown}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={(1 - specialChargePct / 100) * 2 * Math.PI * 28}
              />
            </svg>
          )}
          <span className="text-2xl z-[1]">{specialMove.iconEmoji}</span>
          <span
            className="text-[8px] font-mono font-bold z-[1] truncate max-w-[60px] text-center"
            style={{ color: specialReady ? HUD_COLORS.actionReady : HUD_COLORS.textMuted }}
          >
            {specialReady ? "READY!" : `${Math.round(specialChargePct)}%`}
          </span>
        </button>
      )}

      {/* Pause */}
      <button
        onClick={onPause}
        className="flex items-center justify-center rounded-full active:scale-90"
        style={{
          width: 36, height: 36,
          background: "rgba(0,0,0,0.55)",
          border: "1.5px solid rgba(255,255,255,0.15)",
        }}
      >
        <span className="text-[14px]">⏸</span>
      </button>

      <style>{`
        @keyframes specialReadyBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}

// Phase 28 HUD — AbilityIcons: 3 ability slots with radial cooldown sweeps (2D mode only).

import React from "react";

interface AbilitySlot {
  label: string;
  cooldownMs: number;
  maxCooldownMs: number;
  color?: string;
}

interface AbilityIconsProps {
  slots: [AbilitySlot, AbilitySlot, AbilitySlot];
}

const SIZE = 44;
const R = SIZE / 2 - 4;
const CIRCUMFERENCE = 2 * Math.PI * R;

function CooldownRing({ slot }: { slot: AbilitySlot }) {
  const progress = slot.maxCooldownMs > 0 ? slot.cooldownMs / slot.maxCooldownMs : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const ready = progress <= 0;
  const color = slot.color ?? "#4488ff";

  return (
    <div className="relative flex items-center justify-center w-11 h-11">
      <svg width={SIZE} height={SIZE} className="absolute top-0 left-0 -rotate-90">
        {/* Track */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
        {/* Cooldown sweep */}
        {!ready && (
          <circle
            cx={SIZE/2} cy={SIZE/2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}
      </svg>
      {/* Label */}
      <span
        className={`font-mono text-[0.65rem] font-bold z-[1] ${ready ? "text-white" : "text-[rgba(180,200,220,0.5)]"}`}
      >
        {slot.label}
      </span>
      {ready && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none shadow-[0_0_6px_2px_var(--gc)]"
          style={{ "--gc": `${color}66` } as React.CSSProperties}
        />
      )}
    </div>
  );
}

export function AbilityIcons({ slots }: AbilityIconsProps) {
  return (
    <div
      className="absolute flex gap-2 z-50 pointer-events-none"
      style={{ bottom: "1.5rem", left: "50%", transform: "translateX(-50%)" }}
    >
      {slots.map((slot, i) => <CooldownRing key={i} slot={slot} />)}
    </div>
  );
}

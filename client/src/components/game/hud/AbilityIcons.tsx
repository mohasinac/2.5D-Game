// Phase 28 HUD — AbilityIcons: 3 ability slots with radial cooldown sweeps (2D mode only).

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
    <div style={{ width: SIZE, height: SIZE }} className="relative flex items-center justify-center">
      <svg width={SIZE} height={SIZE} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
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
        style={{ color: ready ? "#fff" : "rgba(180,200,220,0.5)" }}
        className="font-mono text-[0.65rem] font-bold z-[1]"
      >
        {slot.label}
      </span>
      {ready && (
        <div
          style={{ boxShadow: `0 0 6px 2px ${color}66` }}
          className="absolute inset-0 rounded-full pointer-events-none"
        />
      )}
    </div>
  );
}

export function AbilityIcons({ slots }: AbilityIconsProps) {
  return (
    <div
      style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)" }}
      className="flex gap-2 z-50 pointer-events-none"
    >
      {slots.map((slot, i) => <CooldownRing key={i} slot={slot} />)}
    </div>
  );
}

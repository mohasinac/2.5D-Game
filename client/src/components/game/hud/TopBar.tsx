// Phase 28 HUD — TopBar: avatar, name, score, match timer.

interface TopBarProps {
  username: string;
  score?: number;
  timerSec: number;
  beyType?: string;
  spinPct?: number;
}

const TYPE_COLORS: Record<string, string> = {
  attack: "#ff6655",
  defense: "#4488ff",
  stamina: "#44dd88",
  balanced: "#ffcc44",
};

export function TopBar({ username, score, timerSec, beyType = "balanced", spinPct }: TopBarProps) {
  const mm = Math.floor(timerSec / 60).toString().padStart(2, "0");
  const ss = Math.floor(timerSec % 60).toString().padStart(2, "0");
  const typeColor = TYPE_COLORS[beyType] ?? "#aabbcc";

  return (
    <div
      style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        border: `1px solid ${typeColor}55`,
      }}
      className="px-4 py-[0.35rem] bg-[rgba(10,14,28,0.85)] border-t-0 rounded-b-[0.6rem] backdrop-blur flex items-center gap-4 z-50 pointer-events-none font-mono"
    >
      {/* Type indicator dot */}
      <div style={{ background: typeColor }} className="w-2 h-2 rounded-full shrink-0" />

      {/* Username + spin pct */}
      <div className="flex flex-col items-start">
        <span className="text-[0.7rem] text-[#dde] font-semibold">{username}</span>
        {spinPct !== undefined && (
          <span style={{ color: typeColor }} className="text-[0.6rem]">{spinPct}% spin</span>
        )}
      </div>

      {/* Timer */}
      <div className="text-[0.9rem] text-white font-bold tracking-[0.06em]">
        {mm}:{ss}
      </div>

      {/* Score */}
      {score !== undefined && (
        <div className="text-[0.7rem] text-[#cce] font-semibold">
          {score}pt
        </div>
      )}
    </div>
  );
}

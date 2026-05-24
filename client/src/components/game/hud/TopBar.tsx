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
    <div style={{
      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
      padding: "0.35rem 1rem",
      background: "rgba(10,14,28,0.85)",
      border: `1px solid ${typeColor}55`,
      borderTop: "none",
      borderRadius: "0 0 0.6rem 0.6rem",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", gap: "1rem",
      zIndex: 50, pointerEvents: "none",
      fontFamily: "monospace",
    }}>
      {/* Type indicator dot */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor, flexShrink: 0 }} />

      {/* Username + spin pct */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.7rem", color: "#dde", fontWeight: 600 }}>{username}</span>
        {spinPct !== undefined && (
          <span style={{ fontSize: "0.6rem", color: typeColor }}>{spinPct}% spin</span>
        )}
      </div>

      {/* Timer */}
      <div style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 700, letterSpacing: "0.06em" }}>
        {mm}:{ss}
      </div>

      {/* Score */}
      {score !== undefined && (
        <div style={{ fontSize: "0.7rem", color: "#cce", fontWeight: 600 }}>
          {score}pt
        </div>
      )}
    </div>
  );
}

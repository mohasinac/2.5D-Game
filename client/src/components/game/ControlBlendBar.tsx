// Phase 24 — ControlBlendBar: shows the current player-authority blend (0–100).
// Reads `controlAuthority` from the local beyblade schema (synced at 60Hz).
// 100 = full player control; 0 = full natural/AI motion.
// Position: top-right corner, compact pill style.

interface ControlBlendBarProps {
  /** 0–100 from Beyblade.controlAuthority */
  authority: number;
  /** When true, a clash QTE is active — render a gold clash ring instead. */
  clashQTEActive?: boolean;
  /** Clash QTE seconds remaining */
  clashQTETimer?: number;
}

const BAR_WIDTH = 120;
const BAR_HEIGHT = 8;

export function ControlBlendBar({ authority, clashQTEActive, clashQTETimer }: ControlBlendBarProps) {
  const pct = Math.min(1, Math.max(0, authority / 100));

  // Color: green = full player control, yellow = partial, red = mostly natural
  const r = Math.round(255 * (1 - pct));
  const g = Math.round(200 * pct + 55);
  const barColor = `rgb(${r},${g},60)`;

  if (clashQTEActive) {
    return (
      <div
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
        className="px-3 py-[0.4rem] bg-[rgba(20,15,0,0.85)] border-2 border-[#ffcc00] rounded-lg flex flex-col items-center gap-[0.2rem] z-50 backdrop-blur"
      >
        <span className="text-[#ffcc00] font-mono text-[0.65rem] font-bold tracking-[0.08em]">
          ⚡ CLASH QTE
        </span>
        <span className="text-[#fff9cc] font-mono text-[0.75rem]">
          {typeof clashQTETimer === "number" ? clashQTETimer.toFixed(1) : ""}s
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ position: "absolute", top: "1rem", right: "1rem", minWidth: `${BAR_WIDTH + 12}px` }}
      className="px-[0.6rem] py-[0.35rem] bg-[rgba(10,15,30,0.75)] border border-[rgba(100,160,220,0.3)] rounded-lg flex flex-col items-start gap-[0.2rem] z-50 backdrop-blur"
    >
      <span className="text-[#9bb] font-mono text-[0.6rem] tracking-[0.05em]">
        CONTROL {Math.round(authority)}%
      </span>
      <div style={{ width: BAR_WIDTH, height: BAR_HEIGHT }} className="bg-white/10 rounded overflow-hidden">
        <div
          style={{
            width: `${pct * 100}%`,
            height: "100%",
            background: barColor,
            borderRadius: 4,
            transition: "width 0.12s ease-out",
          }}
        />
      </div>
    </div>
  );
}

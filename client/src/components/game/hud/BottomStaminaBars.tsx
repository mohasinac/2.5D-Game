import React from "react";

interface BottomStaminaBarsProps {
  mySpinPct: number;
  myType: string;
  opponents: { spinPct: number; beyType: string; username: string }[];
}

const TYPE_HEX: Record<string, string> = {
  attack:   "#ff5544",
  defense:  "#3388ff",
  stamina:  "#33cc77",
  balanced: "#ffcc33",
};

function fillClass(pct: number): string {
  if (pct >= 40) return "bg-theme-yellow";
  return "bg-theme-red";
}

// ── Single bar with fill head dot ──────────────────────────────────────────
// side="left"  → bar fills left to right, rounded right
// side="right" → bar fills right to left (flex-row-reverse), rounded left
interface BarProps {
  spinPct: number;
  beyType: string;
  username: string;
  side: "left" | "right";
  narrow?: boolean;
}

function StaminaBar({ spinPct, beyType, side, narrow = false }: BarProps) {
  const clamped = Math.max(0, Math.min(100, spinPct));
  const hex = TYPE_HEX[beyType] ?? "#aabbcc";
  const height = narrow ? "h-[10px]" : "h-[14px]";
  const rounded = side === "left" ? "rounded-r-full" : "rounded-l-full";
  const fillFlex = side === "left" ? "" : "flex-row-reverse";

  return (
    <div
      className={`relative ${height} bg-[rgba(0,0,0,0.55)] overflow-hidden ${rounded}`}
      style={{ "--tc": hex } as React.CSSProperties}
    >
      {/* Fill track */}
      <div className={`absolute inset-0 flex items-stretch ${fillFlex}`}>
        <div
          className={`w-pct h-full transition-[width] duration-200 ${fillClass(clamped)}`}
          style={{ "--pct": `${clamped}%` } as React.CSSProperties}
        />
      </div>

      {/* Accent dot at fill head */}
      <div
        className={`absolute inset-y-0 flex items-center pointer-events-none ${side === "left" ? "left-0" : "right-0"}`}
        style={{ "--pct": `${clamped}%` } as React.CSSProperties}
      >
        <div
          className="w-[5px] h-[5px] rounded-full bg-sky-300 shadow-[0_0_6px_2px_rgba(120,200,255,0.7)]"
          style={
            side === "left"
              ? { marginLeft: `calc(var(--pct) - 3px)` }
              : { marginRight: `calc(var(--pct) - 3px)` }
          }
        />
      </div>
    </div>
  );
}

// ── BottomStaminaBars ────────────────────────────────────────────────────────
export function BottomStaminaBars({ mySpinPct, myType, opponents }: BottomStaminaBarsProps) {
  const royale = opponents.length >= 3;

  if (royale) {
    // Royale mode: stack all bars vertically in bottom-left area
    return (
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col-reverse gap-1 pb-2 px-3">
        {/* Player bar */}
        <div className="flex items-center gap-2 w-[45vw] max-w-[400px]">
          <span className="text-[0.5rem] font-mono text-white/50 shrink-0 w-12 truncate uppercase">YOU</span>
          <div className="flex-1">
            <StaminaBar spinPct={mySpinPct} beyType={myType} username="You" side="left" narrow />
          </div>
        </div>
        {/* Opponent bars */}
        {opponents.map((op, i) => (
          <div key={i} className="flex items-center gap-2 w-[45vw] max-w-[400px]">
            <span className="text-[0.5rem] font-mono text-white/50 shrink-0 w-12 truncate uppercase">
              {op.username}
            </span>
            <div className="flex-1">
              <StaminaBar spinPct={op.spinPct} beyType={op.beyType} username={op.username} side="left" narrow />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 1v1 or 1v2: player bar left, first opponent bar right
  const featured = opponents[0];
  const extras = opponents.slice(1);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex items-end justify-between pb-2 px-2 gap-2">
      {/* Player bar — anchored left */}
      <div className="w-[45vw] max-w-[400px] flex flex-col gap-1">
        <StaminaBar spinPct={mySpinPct} beyType={myType} username="You" side="left" />
        {/* Extra opponent bars stacked above if 2 opponents */}
        {extras.map((op, i) => (
          <StaminaBar key={i} spinPct={op.spinPct} beyType={op.beyType} username={op.username} side="right" narrow />
        ))}
      </div>

      {/* Featured opponent bar — anchored right, fills RTL */}
      {featured && (
        <div className="w-[45vw] max-w-[400px]">
          <StaminaBar spinPct={featured.spinPct} beyType={featured.beyType} username={featured.username} side="right" />
        </div>
      )}
    </div>
  );
}

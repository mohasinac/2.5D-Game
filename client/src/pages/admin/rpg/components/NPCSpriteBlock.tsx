/**
 * NPCSpriteBlock — colored GBA-style sprite stand-in for NPC CRUD pages.
 *
 * Since actual sprite sheets are stored in Firebase Storage and not available
 * in the admin UI, we render a pixel-art-flavored colored block whose color
 * and icon are keyed by NPC type. The facing direction is drawn as a small
 * directional arrow inside the block.
 */

const TYPE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  trainer:     { bg: "#3b5fa0", border: "#5b8fd0", icon: "T" },
  rival:       { bg: "#9b3030", border: "#d05050", icon: "R" },
  gym_leader:  { bg: "#7a3a7a", border: "#b060b0", icon: "G" },
  shopkeeper:  { bg: "#3a7a3a", border: "#60b060", icon: "$" },
  story:       { bg: "#7a5a20", border: "#c09040", icon: "S" },
  boss:        { bg: "#6a0000", border: "#cc0000", icon: "B" },
  ally:        { bg: "#2a6a6a", border: "#40aaaa", icon: "A" },
  merchant:    { bg: "#4a6a20", border: "#80aa40", icon: "M" },
  npc:         { bg: "#444444", border: "#888888", icon: "N" },
  elder:       { bg: "#5a4a20", border: "#aa8840", icon: "E" },
  quest_giver: { bg: "#2a4a7a", border: "#4080cc", icon: "Q" },
  blader:      { bg: "#1a5a8a", border: "#3090d0", icon: "⚡" },
  default:     { bg: "#3a3a3a", border: "#666666", icon: "?" },
};

const FACING_ARROWS: Record<string, string> = {
  up:    "▲",
  down:  "▼",
  left:  "◀",
  right: "▶",
};

interface Props {
  npcType?: string;
  facing?: string;
  displayName?: string;
  hasBattle?: boolean;
  /** Pixel size of the block square. Default 48. */
  size?: number;
}

export function NPCSpriteBlock({
  npcType   = "default",
  facing    = "down",
  displayName,
  hasBattle = false,
  size      = 48,
}: Props) {
  const style = TYPE_COLORS[npcType] ?? TYPE_COLORS["default"];
  const arrow = FACING_ARROWS[facing] ?? "▼";

  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: size }}>
      {/* Sprite block */}
      <div
        className="relative flex items-center justify-center rounded select-none overflow-hidden"
        style={{
          width:       size,
          height:      size,
          background:  style.bg,
          border:      `2px solid ${style.border}`,
          imageRendering: "pixelated",
          fontFamily:  "monospace",
        }}
      >
        {/* Type icon (large, centered) */}
        <span
          className="font-bold"
          style={{ fontSize: Math.round(size * 0.4), color: style.border, lineHeight: 1 }}
        >
          {style.icon}
        </span>

        {/* Facing arrow — bottom-center overlay */}
        <span
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2"
          style={{ fontSize: Math.round(size * 0.22), color: "rgba(255,255,255,0.75)", lineHeight: 1 }}
        >
          {arrow}
        </span>

        {/* Battle badge — top-right corner */}
        {hasBattle && (
          <span
            className="absolute top-0.5 right-0.5 text-[8px] bg-red-600 text-white rounded-sm px-0.5 leading-tight"
            style={{ fontSize: Math.round(size * 0.18) }}
          >
            ⚔
          </span>
        )}
      </div>

      {/* Name label (optional, capped width) */}
      {displayName && (
        <span
          className="text-gray-300 font-mono text-center truncate"
          style={{ fontSize: Math.max(9, Math.round(size * 0.18)), maxWidth: size + 16 }}
        >
          {displayName}
        </span>
      )}
    </div>
  );
}

/** Compact inline badge used in table rows */
export function NPCTypeBadge({ npcType }: { npcType?: string }) {
  const style = TYPE_COLORS[npcType ?? "default"] ?? TYPE_COLORS["default"];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
      style={{ background: style.bg + "88", color: style.border, border: `1px solid ${style.border}44` }}
    >
      {style.icon} {npcType ?? "npc"}
    </span>
  );
}

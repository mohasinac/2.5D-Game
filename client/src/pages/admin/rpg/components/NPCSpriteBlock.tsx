/**
 * NPCSpriteBlock — animated GBA-style NPC preview for admin CRUD pages.
 *
 * Two modes:
 *  1. Sprite sheet uploaded → renders a canvas that plays the walk cycle from
 *     the sheet (standard 4-row × 3-col layout: down/left/right/up × stand/step-L/step-R).
 *  2. No sprite sheet       → renders an animated colored block (type-color + facing
 *     arrow) with a gentle head-bob.
 *
 * Profile-state variants: `npcState` prop shifts the tint / icon displayed.
 */

import { useRef, useEffect, useCallback } from "react";

// ── Type → color mapping ────────────────────────────────────────────────────
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

// NPC state → overlay tint (alpha 0.25 on top of the base color)
const STATE_TINTS: Record<string, string> = {
  idle:          "transparent",
  battle_ready:  "rgba(255,80,80,0.22)",
  defeated:      "rgba(60,60,60,0.45)",
  happy:         "rgba(80,255,120,0.18)",
  talking:       "rgba(255,220,80,0.18)",
  sleeping:      "rgba(80,120,255,0.18)",
};

// State → overlay icon
const STATE_ICONS: Record<string, string> = {
  battle_ready: "⚔",
  defeated:     "💀",
  happy:        "😊",
  talking:      "💬",
  sleeping:     "💤",
};

const FACING_ROW: Record<string, number> = { down: 0, left: 1, right: 2, up: 3 };
const FACING_ARROWS: Record<string, string> = { up: "▲", down: "▼", left: "◀", right: "▶" };

// Walk cycle: frames per second and total columns in the sprite sheet
const WALK_FPS  = 8;
const WALK_COLS = 3; // columns per row: stand | step-left | step-right

// ── Sprite-sheet animated canvas component ─────────────────────────────────
interface AnimatedSpriteProps {
  spriteSheetUrl: string;
  facing:         string;
  npcState:       string;
  size:           number;
  frameW?:        number; // if known; auto-detected from sheet width / WALK_COLS
  frameH?:        number; // if known; auto-detected from sheet height / 4
}

function AnimatedSpriteCanvas({
  spriteSheetUrl, facing, npcState, size, frameW, frameH,
}: AnimatedSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(0);

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;

    const ctx  = canvas.getContext("2d")!;
    const fW   = frameW ?? Math.floor(img.naturalWidth  / WALK_COLS);
    const fH   = frameH ?? Math.floor(img.naturalHeight / 4);
    const row  = FACING_ROW[facing] ?? 0;
    const col  = Math.floor(((ts - t0Ref.current) / 1000) * WALK_FPS) % WALK_COLS;
    const sx   = col  * fW;
    const sy   = row  * fH;

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    // Draw sprite frame
    ctx.drawImage(img, sx, sy, fW, fH, 0, 0, size, size);

    // State tint overlay
    const tint = STATE_TINTS[npcState] ?? "transparent";
    if (tint !== "transparent") {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, size, size);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [facing, npcState, size, frameW, frameH]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = spriteSheetUrl;
    imgRef.current = img;
    t0Ref.current  = performance.now();

    img.onload = () => {
      t0Ref.current  = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    };
    return () => {
      cancelAnimationFrame(rafRef.current);
      imgRef.current = null;
    };
  }, [spriteSheetUrl, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="border border-gray-700 rounded"
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}

// ── Colored-block animated canvas (no sprite sheet) ────────────────────────
interface BlockAnimProps {
  npcType:  string;
  facing:   string;
  npcState: string;
  size:     number;
}

function AnimatedBlockCanvas({ npcType, facing, npcState, size }: BlockAnimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number>(performance.now());
  const style     = TYPE_COLORS[npcType] ?? TYPE_COLORS["default"];

  useEffect(() => {
    t0Ref.current = performance.now();

    const animate = (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx   = canvas.getContext("2d")!;
      const elapsed = (ts - t0Ref.current) / 1000;

      // head-bob: ±2px vertical offset
      const bob     = Math.sin(elapsed * Math.PI * 2 * 1.8) * 2;
      // walk-cycle: 3-frame step-toggle (step-left / stand / step-right)
      const stepPhase = Math.floor(elapsed * WALK_FPS) % 3;

      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = false;

      // Body block
      ctx.fillStyle = style.bg;
      ctx.strokeStyle = style.border;
      ctx.lineWidth = 2;
      const bodyW = Math.round(size * 0.6);
      const bodyH = Math.round(size * 0.5);
      const bodyX = Math.round((size - bodyW) / 2);
      const bodyY = Math.round(size * 0.3 + bob);
      ctx.beginPath();
      ctx.roundRect(bodyX, bodyY, bodyW, bodyH, 3);
      ctx.fill();
      ctx.stroke();

      // Head
      const headR = Math.round(size * 0.18);
      const headX = Math.round(size / 2);
      const headY = Math.round(size * 0.22 + bob);
      ctx.fillStyle = style.bg;
      ctx.strokeStyle = style.border;
      ctx.beginPath();
      ctx.arc(headX, headY, headR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Type icon inside head
      ctx.fillStyle = style.border;
      ctx.font = `bold ${Math.round(headR * 1.1)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(style.icon, headX, headY);

      // Legs (walk-cycle)
      const legW = Math.round(size * 0.12);
      const legH = Math.round(size * 0.18);
      const legY = bodyY + bodyH;
      const legOffsets = [
        stepPhase === 0 ? -2 : stepPhase === 2 ? 2 : 0,  // left leg
        stepPhase === 0 ? 2  : stepPhase === 2 ? -2 : 0, // right leg
      ];
      const legXs = [
        bodyX + Math.round(bodyW * 0.2),
        bodyX + Math.round(bodyW * 0.6),
      ];
      ctx.fillStyle = style.bg;
      ctx.strokeStyle = style.border;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.roundRect(legXs[i], legY + legOffsets[i], legW, legH, 2);
        ctx.fill();
        ctx.stroke();
      }

      // Facing arrow — small, below legs
      const arrow = FACING_ARROWS[facing] ?? "▼";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `${Math.round(size * 0.14)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(arrow, size / 2, legY + legH + Math.round(size * 0.09));

      // State tint overlay
      const tint = STATE_TINTS[npcState] ?? "transparent";
      if (tint !== "transparent") {
        ctx.fillStyle = tint;
        ctx.fillRect(0, 0, size, size);
      }

      // State icon badge top-right
      const stateIcon = STATE_ICONS[npcState];
      if (stateIcon) {
        ctx.font = `${Math.round(size * 0.22)}px serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(stateIcon, size - 2, 2);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [npcType, facing, npcState, size, style]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="border border-gray-700 rounded"
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}

// ── Public component ────────────────────────────────────────────────────────

export type NPCState =
  | "idle" | "battle_ready" | "defeated" | "happy" | "talking" | "sleeping";

interface Props {
  npcType?:        string;
  facing?:         string;
  npcState?:       NPCState;
  displayName?:    string;
  hasBattle?:      boolean;
  spriteSheetUrl?: string | null;
  /** Frame dimensions — optional, auto-detected from sheet size */
  frameW?:         number;
  frameH?:         number;
  /** Pixel size of the block square. Default 48. */
  size?:           number;
}

export function NPCSpriteBlock({
  npcType        = "default",
  facing         = "down",
  npcState       = "idle",
  displayName,
  hasBattle      = false,
  spriteSheetUrl = null,
  frameW,
  frameH,
  size           = 48,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        {spriteSheetUrl ? (
          <AnimatedSpriteCanvas
            spriteSheetUrl={spriteSheetUrl}
            facing={facing}
            npcState={npcState}
            size={size}
            frameW={frameW}
            frameH={frameH}
          />
        ) : (
          <AnimatedBlockCanvas
            npcType={npcType}
            facing={facing}
            npcState={npcState}
            size={size}
          />
        )}

        {/* Battle badge — top-right corner overlay (above canvas) */}
        {hasBattle && (
          <span
            className="absolute top-0.5 right-0.5 text-white bg-red-600 rounded-sm px-0.5 leading-tight"
            style={{ fontSize: Math.round(size * 0.18) }}
          >
            ⚔
          </span>
        )}
      </div>

      {/* Name label */}
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

// ── Compact inline badge (table rows) ────────────────────────────────────────
const TYPE_COLORS_BADGE = TYPE_COLORS;

export function NPCTypeBadge({ npcType }: { npcType?: string }) {
  const style = TYPE_COLORS_BADGE[npcType ?? "default"] ?? TYPE_COLORS_BADGE["default"];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
      style={{ background: style.bg + "88", color: style.border, border: `1px solid ${style.border}44` }}
    >
      {style.icon} {npcType ?? "npc"}
    </span>
  );
}

// ── NPC state selector (used in edit panels) ─────────────────────────────────
interface StateSelectorProps {
  value:    NPCState;
  onChange: (s: NPCState) => void;
}

const ALL_STATES: NPCState[] = ["idle","battle_ready","defeated","happy","talking","sleeping"];

export function NPCStateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_STATES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
            value === s
              ? "bg-amber-500 text-black font-bold"
              : "bg-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          {STATE_ICONS[s] ? `${STATE_ICONS[s]} ` : ""}
          {s.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

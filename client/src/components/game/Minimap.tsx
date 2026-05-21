// Minimap — small top-left overlay showing the full arena + bey positions
// + the current viewport rect. Shown only when the arena is larger than the
// short screen axis (so it adds value); for small arenas the in-game camera
// already shows everything. See plan Part 15.

import type { ServerBeyblade, ServerGameState } from "@/types/game";
import { PX_PER_CM_BASE } from "@/constants/units";

interface MinimapProps {
  gameState: ServerGameState | null;
  beyblades: Map<string, ServerBeyblade>;
  /** Local player's bey id to highlight in a distinct color. */
  selfId?: string | null;
  /** Optional minimap edge size in rem. */
  sizeRem?: number;
  /** Current camera viewport in cm (world space). When provided, rendered as a rect. */
  viewportCm?: { x: number; y: number; w: number; h: number } | null;
}

export function Minimap({ gameState, beyblades, selfId, sizeRem = 12, viewportCm }: MinimapProps) {
  const arena = gameState?.arena;
  if (!arena) return null;

  // Arena dimensions in cm.
  const widthCm = arena.width / PX_PER_CM_BASE;
  const heightCm = arena.height / PX_PER_CM_BASE;

  // Only show minimap for "map-sized" arenas (> 80cm short axis ~ 2 screen widths
  // at default scale on a typical desktop). Cheap heuristic.
  if (Math.min(widthCm, heightCm) < 80) return null;

  // Convert physics units → cm centered.
  const PHYSICS = 16;
  const cmFromPhys = (p: number, halfPhysCenter: number) =>
    (p - halfPhysCenter) / (PX_PER_CM_BASE * PHYSICS);

  const physCenterX = (arena.width * PHYSICS) / 2;
  const physCenterY = (arena.height * PHYSICS) / 2;

  // SVG viewBox = arena cm bounds centered at origin.
  const vbX = -widthCm / 2;
  const vbY = -heightCm / 2;
  const vbW = widthCm;
  const vbH = heightCm;

  const beyDots: Array<{ id: string; cx: number; cy: number; color: string; alive: boolean }> = [];
  beyblades.forEach((b, id) => {
    beyDots.push({
      id,
      cx: cmFromPhys(b.x, physCenterX),
      cy: cmFromPhys(b.y, physCenterY),
      color: id === selfId ? "#ffcc44" : (b.isAI ? "#ff5555" : "#55aaff"),
      alive: b.isActive,
    });
  });

  return (
    <div
      aria-label="Arena minimap"
      style={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        width: `${sizeRem}rem`,
        height: `${sizeRem}rem`,
        background: "rgba(10,14,28,0.85)",
        border: "1px solid rgba(120,160,200,0.4)",
        borderRadius: "0.5rem",
        backdropFilter: "blur(4px)",
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Arena outline */}
        {arena.shape === "circle" ? (
          <circle cx={0} cy={0} r={Math.min(vbW, vbH) / 2 - 1} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, vbW / 200)} />
        ) : (
          <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="rgba(40,55,80,0.5)" stroke="#4488cc" strokeWidth={Math.max(0.5, vbW / 200)} />
        )}

        {/* Bey dots */}
        {beyDots.map((d) => (
          <circle
            key={d.id}
            cx={d.cx}
            cy={d.cy}
            r={Math.max(1.5, vbW / 60)}
            fill={d.color}
            opacity={d.alive ? 1 : 0.3}
          />
        ))}

        {/* Viewport rectangle showing what the player can currently see. */}
        {viewportCm && (
          <rect
            x={viewportCm.x}
            y={viewportCm.y}
            width={viewportCm.w}
            height={viewportCm.h}
            fill="none"
            stroke="#ffcc44"
            strokeWidth={Math.max(0.6, vbW / 150)}
            strokeDasharray={`${vbW / 80} ${vbW / 160}`}
            opacity={0.85}
          />
        )}
      </svg>
    </div>
  );
}

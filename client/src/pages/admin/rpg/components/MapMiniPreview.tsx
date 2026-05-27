import { useRef, useEffect, useMemo } from "react";
import type { RPGMap } from "@/rpg/data/schemas";

export const TILE_COLORS: Record<number, string> = {
  0:  "#111111",  // empty / void
  1:  "#4a7c4f",  // grass
  2:  "#6b6b6b",  // wall
  3:  "#2d5a2d",  // tree
  4:  "#7a5c3a",  // building
  5:  "#c4a96a",  // path / floor
  6:  "#4a7a9b",  // arena
  7:  "#8b6f47",  // door
  8:  "#6e4a82",  // shop
  9:  "#888888",  // rock
  10: "#3b6fa0",  // water
  11: "#d4a44c",  // sand
  12: "#c0c0c0",  // metal
  13: "#5a3a1a",  // wood
  14: "#e06060",  // lava
  15: "#60d0e0",  // ice
};

export const TILE_LABELS: Record<number, string> = {
  0:  "void",     1:  "grass",   2:  "wall",     3:  "tree",
  4:  "building", 5:  "path",    6:  "arena",    7:  "door",
  8:  "shop",     9:  "rock",    10: "water",     11: "sand",
  12: "metal",    13: "wood",    14: "lava",      15: "ice",
};

interface Props {
  map: RPGMap;
  maxWidth?: number;
  showLegend?: boolean;
}

export function MapMiniPreview({ map, maxWidth = 300, showLegend = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const groundLayer = map.layers.find((l) => l.name === "ground");
    const decoLayer   = map.layers.find((l) => l.name === "decoration");
    if (!groundLayer) {
      // No ground layer — fill with a placeholder grid
      const scale = Math.max(2, Math.min(4, Math.floor(maxWidth / (map.width || 20))));
      canvas.width  = (map.width  || 20) * scale;
      canvas.height = (map.height || 15) * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= (map.width || 20); x++) {
        ctx.beginPath(); ctx.moveTo(x * scale, 0); ctx.lineTo(x * scale, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= (map.height || 15); y++) {
        ctx.beginPath(); ctx.moveTo(0, y * scale); ctx.lineTo(canvas.width, y * scale); ctx.stroke();
      }
      return;
    }

    const scale = Math.max(2, Math.min(4, Math.floor(maxWidth / map.width)));
    canvas.width  = map.width  * scale;
    canvas.height = map.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Draw tiles
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const idx       = y * map.width + x;
        const groundT   = groundLayer.data[idx]  ?? 0;
        const decoT     = decoLayer?.data[idx]   ?? 0;

        ctx.fillStyle = TILE_COLORS[groundT] ?? "#111";
        ctx.fillRect(x * scale, y * scale, scale, scale);

        if (decoT > 0) {
          ctx.fillStyle = TILE_COLORS[decoT] ?? "#555";
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    // NPC placements — red squares
    for (const npc of map.npcPlacements) {
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(
        npc.spawnTile.x * scale + 1,
        npc.spawnTile.y * scale + 1,
        scale - 2,
        scale - 2,
      );
    }

    // Exits — amber semi-transparent rects
    for (const exit of map.exits) {
      ctx.fillStyle = "rgba(255,200,0,0.55)";
      ctx.fillRect(
        exit.triggerRect.x      * scale,
        exit.triggerRect.y      * scale,
        exit.triggerRect.width  * scale,
        exit.triggerRect.height * scale,
      );
    }

    // Event triggers — cyan semi-transparent rects
    for (const ev of map.eventTriggers ?? []) {
      if (ev.triggerRect) {
        ctx.fillStyle = "rgba(80,220,220,0.4)";
        ctx.fillRect(
          ev.triggerRect.x      * scale,
          ev.triggerRect.y      * scale,
          ev.triggerRect.width  * scale,
          ev.triggerRect.height * scale,
        );
      }
    }

  }, [map, maxWidth]);

  // Which tile IDs actually appear on this map (for legend)
  const usedTileIds = useMemo(() => {
    if (!showLegend) return [];
    const ids = new Set<number>();
    for (const layer of map.layers) {
      for (const t of layer.data) if (t > 0) ids.add(t);
    }
    return [...ids].sort((a, b) => a - b);
  }, [map, showLegend]);

  return (
    <div className="flex flex-col gap-1.5">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded"
        style={{ imageRendering: "pixelated", display: "block" }}
      />

      {/* Mini stats row */}
      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
        <span>{map.width}×{map.height} tiles</span>
        {map.npcPlacements?.length > 0 && (
          <span className="text-red-400">● {map.npcPlacements.length} NPC{map.npcPlacements.length !== 1 ? "s" : ""}</span>
        )}
        {map.exits?.length > 0 && (
          <span className="text-amber-400">▶ {map.exits.length} exit{map.exits.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Legend */}
      {showLegend && usedTileIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {usedTileIds.map((id) => (
            <span key={id} className="flex items-center gap-1 text-[9px] text-gray-400">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm border border-gray-700"
                style={{ background: TILE_COLORS[id] ?? "#111" }}
              />
              {TILE_LABELS[id] ?? `t${id}`}
            </span>
          ))}
          <span className="flex items-center gap-1 text-[9px] text-red-400">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500" />npc
          </span>
          <span className="flex items-center gap-1 text-[9px] text-amber-400">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400/60" />exit
          </span>
        </div>
      )}
    </div>
  );
}

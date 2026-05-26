import { useRef, useEffect } from "react";
import type { RPGMap } from "@/rpg/data/schemas";

const TILE_COLORS: Record<number, string> = {
  0: "#111",
  1: "#4a7c4f",  // grass
  2: "#6b6b6b",  // wall
  3: "#2d5a2d",  // tree
  4: "#7a5c3a",  // building
  5: "#c4a96a",  // path
  6: "#4a7a9b",  // arena
  7: "#8b6f47",  // door
  8: "#6e4a82",  // shop
  9: "#888888",  // rock
  10: "#3b6fa0", // water
};

interface Props {
  map: RPGMap;
  maxWidth?: number;
}

export function MapMiniPreview({ map, maxWidth = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const groundLayer = map.layers.find((l) => l.name === "ground");
    const decoLayer = map.layers.find((l) => l.name === "decoration");
    if (!groundLayer) return;

    const scale = Math.min(4, Math.floor(maxWidth / map.width));
    canvas.width = map.width * scale;
    canvas.height = map.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const idx = y * map.width + x;
        const groundTile = groundLayer.data[idx] ?? 0;
        const decoTile = decoLayer?.data[idx] ?? 0;

        ctx.fillStyle = TILE_COLORS[groundTile] ?? "#111";
        ctx.fillRect(x * scale, y * scale, scale, scale);

        if (decoTile > 0) {
          ctx.fillStyle = TILE_COLORS[decoTile] ?? "#555";
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    for (const npc of map.npcPlacements) {
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(
        npc.spawnTile.x * scale + 1,
        npc.spawnTile.y * scale + 1,
        scale - 2,
        scale - 2,
      );
    }

    for (const exit of map.exits) {
      ctx.fillStyle = "rgba(255, 200, 0, 0.6)";
      ctx.fillRect(
        exit.triggerRect.x * scale,
        exit.triggerRect.y * scale,
        exit.triggerRect.width * scale,
        exit.triggerRect.height * scale,
      );
    }
  }, [map, maxWidth]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-700 rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

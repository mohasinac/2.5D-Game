import { TILE_IDS } from "../parser/types";

const TILE_COLORS: Record<string, string> = {
  grass: "#4a7c4f",
  wall: "#6b6b6b",
  tree: "#2d5a2d",
  building: "#7a5c3a",
  path: "#c4a96a",
  arena: "#4a7a9b",
  door: "#8b6f47",
  shop: "#6e4a82",
  rock: "#888888",
  water: "#3b6fa0",
};

export function generateTilesetDataUrl(): string {
  const tileSize = 16;
  const entries = Object.entries(TILE_IDS);
  const width = entries.length * tileSize;
  const height = tileSize;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  for (const [name, id] of entries) {
    const x = (id - 1) * tileSize;
    const color = TILE_COLORS[name] ?? "#555555";

    ctx.fillStyle = color;
    ctx.fillRect(x, 0, tileSize, tileSize);

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(x + 0.5, 0.5, tileSize - 1, tileSize - 1);

    if (name === "tree") {
      ctx.fillStyle = "#3d7a3d";
      ctx.beginPath();
      ctx.arc(x + 8, 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(x + 7, 10, 2, 5);
    } else if (name === "water") {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(x + 3, 5, 4, 1);
      ctx.fillRect(x + 8, 9, 5, 1);
    }
  }

  return canvas.toDataURL("image/png");
}

import { TILE_SIZE } from "../constants/rpgConstants";
import type { TileCoord, WorldCoord, TileRect } from "../data/schemas";

export function tileToWorld(tile: TileCoord): WorldCoord {
  return { x: tile.x * TILE_SIZE, y: tile.y * TILE_SIZE };
}

export function worldToTile(world: WorldCoord): TileCoord {
  return { x: Math.floor(world.x / TILE_SIZE), y: Math.floor(world.y / TILE_SIZE) };
}

export function tileCenterWorld(tile: TileCoord): WorldCoord {
  return { x: tile.x * TILE_SIZE + TILE_SIZE / 2, y: tile.y * TILE_SIZE + TILE_SIZE / 2 };
}

export function tilesEqual(a: TileCoord, b: TileCoord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function tileInRect(tile: TileCoord, rect: TileRect): boolean {
  return (
    tile.x >= rect.x &&
    tile.x < rect.x + rect.width &&
    tile.y >= rect.y &&
    tile.y < rect.y + rect.height
  );
}

export function adjacentTile(
  tile: TileCoord,
  dir: "up" | "down" | "left" | "right"
): TileCoord {
  switch (dir) {
    case "up":    return { x: tile.x,     y: tile.y - 1 };
    case "down":  return { x: tile.x,     y: tile.y + 1 };
    case "left":  return { x: tile.x - 1, y: tile.y };
    case "right": return { x: tile.x + 1, y: tile.y };
  }
}

export function tileDistance(a: TileCoord, b: TileCoord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function clampTile(tile: TileCoord, mapWidth: number, mapHeight: number): TileCoord {
  return {
    x: Math.max(0, Math.min(mapWidth - 1, tile.x)),
    y: Math.max(0, Math.min(mapHeight - 1, tile.y)),
  };
}

/** Flat row-major index from tile coords */
export function tileIndex(tile: TileCoord, mapWidth: number): number {
  return tile.y * mapWidth + tile.x;
}

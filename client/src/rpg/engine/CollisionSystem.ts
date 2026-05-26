import type { TileCoord, RPGMap } from "../data/schemas";
import { tileIndex } from "../utils/tileUtils";

export class CollisionSystem {
  private grid: boolean[] = [];
  private mapWidth = 0;
  private mapHeight = 0;

  loadMap(map: RPGMap): void {
    this.mapWidth = map.width;
    this.mapHeight = map.height;
    this.grid = new Array(map.width * map.height).fill(false);

    const collisionLayer = map.layers.find((l) => l.name === "collision");
    if (!collisionLayer) return;

    for (let i = 0; i < collisionLayer.data.length; i++) {
      if (collisionLayer.data[i] > 0) {
        this.grid[i] = true;
      }
    }
  }

  isWalkable(tile: TileCoord): boolean {
    if (
      tile.x < 0 || tile.y < 0 ||
      tile.x >= this.mapWidth || tile.y >= this.mapHeight
    ) {
      return false;
    }
    return !this.grid[tileIndex(tile, this.mapWidth)];
  }

  setBlocked(tile: TileCoord, blocked: boolean): void {
    const idx = tileIndex(tile, this.mapWidth);
    if (idx >= 0 && idx < this.grid.length) {
      this.grid[idx] = blocked;
    }
  }

  clear(): void {
    this.grid = [];
    this.mapWidth = 0;
    this.mapHeight = 0;
  }
}

import type { TileCoord, RPGMap } from "../data/schemas";
import { tileIndex, worldToTile } from "../utils/tileUtils";

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

  get width(): number  { return this.mapWidth; }
  get height(): number { return this.mapHeight; }

  /** #17: Tile-walkable by world coordinate — used for AABB corner queries. */
  isWalkableTile(worldX: number, worldY: number): boolean {
    return this.isWalkable(worldToTile({ x: worldX, y: worldY }));
  }

  /**
   * #17: Check whether an axis-aligned bounding box centered at (cx, cy)
   * with half-extents (halfW, halfH) is fully walkable.
   * Tests all 4 corners; if any corner is in a blocked tile, returns false.
   */
  isRectWalkable(cx: number, cy: number, halfW: number, halfH: number): boolean {
    return (
      this.isWalkableTile(cx - halfW, cy - halfH) &&
      this.isWalkableTile(cx + halfW, cy - halfH) &&
      this.isWalkableTile(cx - halfW, cy + halfH) &&
      this.isWalkableTile(cx + halfW, cy + halfH)
    );
  }
}

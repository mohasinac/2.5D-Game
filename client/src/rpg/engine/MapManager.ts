import * as PIXI from "pixi.js";
import type { RPGMap, TileCoord, MapLayer, MapEntryPoint } from "../data/schemas";
import { TILE_SIZE } from "../constants/rpgConstants";
import { tileToWorld } from "../utils/tileUtils";
import { CollisionSystem } from "./CollisionSystem";

const LAYER_Z: Record<MapLayer, number> = {
  ground: 0,
  decoration: 1,
  collision: -1, // not rendered
  above: 3,
  events: -1,   // not rendered
};

export class MapManager {
  private layerContainers: Map<MapLayer, PIXI.Container> = new Map();
  private tileContainers: PIXI.Container = new PIXI.Container();
  private currentMap: RPGMap | null = null;
  private tileTextures: Map<number, PIXI.Texture> = new Map();
  public collision: CollisionSystem = new CollisionSystem();

  constructor(private worldContainer: PIXI.Container) {
    worldContainer.addChild(this.tileContainers);
  }

  async loadMap(map: RPGMap, tilesetTexture: PIXI.Texture): Promise<void> {
    this.unloadMap();
    this.currentMap = map;
    this.collision.loadMap(map);
    this.buildTileTextures(tilesetTexture, map);
    this.renderLayers(map);
  }

  unloadMap(): void {
    this.tileContainers.removeChildren();
    this.layerContainers.clear();
    this.tileTextures.clear();
    this.currentMap = null;
    this.collision.clear();
  }

  getCurrentMap(): RPGMap | null {
    return this.currentMap;
  }

  getEntryPoint(entryId: string): MapEntryPoint | null {
    return this.currentMap?.entryPoints.find((e) => e.id === entryId) ?? null;
  }

  getLayer(name: MapLayer): PIXI.Container | null {
    return this.layerContainers.get(name) ?? null;
  }

  private buildTileTextures(tilesetTexture: PIXI.Texture, map: RPGMap): void {
    // Tileset is a horizontal strip of TILE_SIZE tiles
    const tilesPerRow = Math.floor(tilesetTexture.width / TILE_SIZE);
    const totalTiles = tilesPerRow * Math.floor(tilesetTexture.height / TILE_SIZE);

    for (let gid = 1; gid <= totalTiles; gid++) {
      const col = (gid - 1) % tilesPerRow;
      const row = Math.floor((gid - 1) / tilesPerRow);
      this.tileTextures.set(
        gid,
        new PIXI.Texture({
          source: tilesetTexture.source,
          frame: new PIXI.Rectangle(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE),
        })
      );
    }
  }

  private renderLayers(map: RPGMap): void {
    const renderOrder: MapLayer[] = ["ground", "decoration", "above"];
    for (const layerName of renderOrder) {
      const layerDef = map.layers.find((l) => l.name === layerName);
      if (!layerDef || !layerDef.visible) continue;

      const container = new PIXI.Container();
      container.zIndex = LAYER_Z[layerName];
      this.tileContainers.addChild(container);
      this.layerContainers.set(layerName, container);

      for (let i = 0; i < layerDef.data.length; i++) {
        const gid = layerDef.data[i];
        if (gid === 0) continue;
        const tex = this.tileTextures.get(gid);
        if (!tex) continue;

        const tileX = i % map.width;
        const tileY = Math.floor(i / map.width);
        const sprite = new PIXI.Sprite(tex);
        const world = tileToWorld({ x: tileX, y: tileY });
        sprite.x = world.x;
        sprite.y = world.y;
        container.addChild(sprite);
      }
    }
    this.tileContainers.sortChildren();
  }

  placeholderTileset(color1 = 0x4a7c59, color2 = 0x3a5c49): PIXI.Texture {
    const g = new PIXI.Graphics();
    // 16 tiles in a row (GID 1–16), alternating colors
    for (let i = 0; i < 16; i++) {
      g.rect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
      g.fill(i % 2 === 0 ? color1 : color2);
      // Draw a subtle border
      g.rect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
      g.stroke({ width: 0.5, color: 0x000000, alpha: 0.2 });
    }
    const rt = PIXI.RenderTexture.create({ width: 16 * TILE_SIZE, height: TILE_SIZE });
    return rt;
  }

  getTileWorldPosition(tile: TileCoord): { x: number; y: number } {
    return tileToWorld(tile);
  }
}

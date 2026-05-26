import type { RPGMap, TileLayer, MapExit, MapEntryPoint, MapLayer } from "@/rpg/data/schemas";
import type { ScenarioLocation, ScenarioMeta } from "./types";
import { TILE_LEGEND, TILE_IDS } from "./types";
import { prefixId } from "./idUtils";

function parseSize(size?: string): { width: number; height: number } {
  if (!size) return { width: 20, height: 15 };
  const parts = size.toLowerCase().split("x");
  return {
    width: parseInt(parts[0], 10) || 20,
    height: parseInt(parts[1] ?? parts[0], 10) || 15,
  };
}

function layoutToLayers(
  layout: string[],
  width: number,
  height: number,
): { ground: number[]; decoration: number[]; collision: number[] } {
  const ground: number[] = [];
  const decoration: number[] = [];
  const collision: number[] = [];

  for (let y = 0; y < height; y++) {
    const row = layout[y] ?? "";
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? ".";
      const tileDef = TILE_LEGEND[ch] ?? TILE_LEGEND["."]!;
      const tileId = TILE_IDS[tileDef.name] ?? TILE_IDS["grass"]!;

      if (tileDef.layer === "decoration") {
        ground.push(TILE_IDS["grass"]!);
        decoration.push(tileId);
      } else {
        ground.push(tileId);
        decoration.push(0);
      }
      collision.push(tileDef.collision ? 1 : 0);
    }
  }

  return { ground, decoration, collision };
}

function generateDefaultLayout(width: number, height: number): string[] {
  const rows: string[] = [];
  for (let y = 0; y < height; y++) {
    if (y === 0 || y === height - 1) {
      rows.push("W".repeat(width));
    } else {
      rows.push("W" + ".".repeat(width - 2) + "W");
    }
  }
  return rows;
}

export function parseLocations(
  locations: ScenarioLocation[],
  meta: ScenarioMeta,
  localIds: Set<string>,
): { maps: RPGMap[]; warnings: string[] } {
  const maps: RPGMap[] = [];
  const warnings: string[] = [];

  for (const loc of locations) {
    const mapId = prefixId(meta.id, loc.id);
    const { width, height } = parseSize(loc.size);
    const layout = loc.layout && loc.layout.length > 0
      ? loc.layout
      : generateDefaultLayout(width, height);

    const actualHeight = layout.length;
    const actualWidth = Math.max(width, ...layout.map((r) => r.length));

    const { ground, decoration, collision } = layoutToLayers(layout, actualWidth, actualHeight);

    const makeTileLayer = (name: MapLayer, data: number[]): TileLayer => ({
      name,
      width: actualWidth,
      height: actualHeight,
      data,
      visible: true,
    });

    const layers: TileLayer[] = [
      makeTileLayer("ground", ground),
      makeTileLayer("decoration", decoration),
      makeTileLayer("collision", collision),
      makeTileLayer("above", new Array(actualWidth * actualHeight).fill(0)),
      makeTileLayer("events", new Array(actualWidth * actualHeight).fill(0)),
    ];

    const exits: MapExit[] = (loc.exits ?? []).map((exit, i) => {
      const targetMapId = localIds.has(exit.to)
        ? prefixId(meta.id, exit.to)
        : exit.to;

      let triggerRect = { x: 0, y: 0, width: 1, height: 1 };
      switch (exit.direction) {
        case "south":
          triggerRect = { x: Math.floor(actualWidth / 2) - 1, y: actualHeight - 1, width: 2, height: 1 };
          break;
        case "north":
          triggerRect = { x: Math.floor(actualWidth / 2) - 1, y: 0, width: 2, height: 1 };
          break;
        case "east":
          triggerRect = { x: actualWidth - 1, y: Math.floor(actualHeight / 2) - 1, width: 1, height: 2 };
          break;
        case "west":
          triggerRect = { x: 0, y: Math.floor(actualHeight / 2) - 1, width: 1, height: 2 };
          break;
      }

      return {
        id: `${mapId}-exit-${i}`,
        triggerRect,
        targetMapId,
        targetEntryId: `from-${oppositeDir(exit.direction)}`,
        direction: exit.direction,
        transitionType: exit.transition ?? "walk",
      };
    });

    const entryPoints: MapEntryPoint[] = (loc.entryPoints ?? []).map((ep) => ({
      id: ep.id,
      tile: { x: ep.tile[0], y: ep.tile[1] },
      facingDirection: ep.facing ?? "down",
    }));

    if (entryPoints.length === 0) {
      entryPoints.push({
        id: "default",
        tile: { x: Math.floor(actualWidth / 2), y: Math.floor(actualHeight / 2) },
        facingDirection: "down",
      });
    }

    for (const exit of loc.exits ?? []) {
      const fromId = `from-${exit.direction}`;
      if (!entryPoints.some((ep) => ep.id === fromId)) {
        let tile = { x: Math.floor(actualWidth / 2), y: 1 };
        let face: "up" | "down" | "left" | "right" = "down";
        switch (exit.direction) {
          case "south":
            tile = { x: Math.floor(actualWidth / 2), y: 1 };
            face = "down";
            break;
          case "north":
            tile = { x: Math.floor(actualWidth / 2), y: actualHeight - 2 };
            face = "up";
            break;
          case "east":
            tile = { x: 1, y: Math.floor(actualHeight / 2) };
            face = "right";
            break;
          case "west":
            tile = { x: actualWidth - 2, y: Math.floor(actualHeight / 2) };
            face = "left";
            break;
        }
        entryPoints.push({ id: fromId, tile, facingDirection: face });
      }
    }

    const map: RPGMap = {
      id: mapId,
      regionId: meta.regionId,
      displayName: loc.name,
      type: loc.type ?? "city",
      width: actualWidth,
      height: actualHeight,
      tilesetId: `${mapId}-tileset`,
      layers,
      exits,
      entryPoints,
      eventTriggers: [],
      npcPlacements: [],
      bgmTrackId: loc.bgm ?? "",
      lightingPreset: loc.lighting ?? "day",
    };

    maps.push(map);
  }

  return { maps, warnings };
}

function oppositeDir(d: string): string {
  switch (d) {
    case "north": return "south";
    case "south": return "north";
    case "east": return "west";
    case "west": return "east";
    default: return "south";
  }
}

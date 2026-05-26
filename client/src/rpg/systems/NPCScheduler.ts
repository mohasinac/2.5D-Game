import * as PIXI from "pixi.js";
import type { NPC, RPGMap, TileCoord, FacingDirection, TimeSlot } from "../data/schemas";
import { tileCenterWorld, tilesEqual } from "../utils/tileUtils";
import { TILE_SIZE, NPC_PATROL_PAUSE_MS } from "../constants/rpgConstants";
import type { SpriteAnimationSystem, CharacterSprite } from "../engine/SpriteAnimationSystem";

interface LiveNPC {
  def: NPC;
  cs: CharacterSprite;
  tile: TileCoord;
  facing: FacingDirection;
  patrolPath?: TileCoord[];
  patrolIndex: number;
  patrolPauseTimer: number;
  isPatrolling: boolean;
}

export class NPCScheduler {
  private liveNPCs: Map<string, LiveNPC> = new Map();
  private npcDefs: Map<string, NPC> = new Map();
  private npcContainer: PIXI.Container = new PIXI.Container();
  private animSystem: SpriteAnimationSystem;
  private placeholderTexture: PIXI.Texture | null = null;
  private textureCache: Map<string, PIXI.Texture> = new Map();

  constructor(animSystem: SpriteAnimationSystem) {
    this.animSystem = animSystem;
  }

  getContainer(): PIXI.Container { return this.npcContainer; }

  registerNPCs(npcs: NPC[]): void {
    npcs.forEach((n) => this.npcDefs.set(n.id, n));
  }

  setPlaceholderTexture(tex: PIXI.Texture): void {
    this.placeholderTexture = tex;
  }

  setTexture(spriteSheetId: string, tex: PIXI.Texture): void {
    this.textureCache.set(spriteSheetId, tex);
  }

  spawnNPCsForMap(map: RPGMap, timeSlot: TimeSlot, tournamentDay = false): void {
    this.despawnAllNPCs();
    const activeSlot = tournamentDay ? "tournament" : timeSlot;

    for (const placement of map.npcPlacements) {
      const def = this.npcDefs.get(placement.npcId);
      if (!def) continue;

      // Find the schedule entry for this map + time slot
      const schedEntry = def.schedule.find(
        (s) => s.mapId === map.id && (s.timeSlot === activeSlot || s.timeSlot === "morning")
      );

      const spawnTile = schedEntry?.tile ?? placement.spawnTile;
      const facing = schedEntry?.facing ?? def.defaultFacing;
      const patrolPath = schedEntry?.patrolPath;

      const texture = this.textureCache.get(def.spriteSheetId) ?? this.placeholderTexture;
      if (!texture) continue;

      const cs = this.animSystem.createCharacterSprite(texture, facing);
      cs.container.zIndex = 5;
      const pos = tileCenterWorld(spawnTile);
      cs.container.x = pos.x;
      cs.container.y = pos.y + TILE_SIZE / 2;
      this.npcContainer.addChild(cs.container);

      this.liveNPCs.set(def.id, {
        def, cs, tile: { ...spawnTile }, facing,
        patrolPath, patrolIndex: 0,
        patrolPauseTimer: 0, isPatrolling: false,
      });
    }
  }

  despawnAllNPCs(): void {
    for (const live of this.liveNPCs.values()) {
      this.npcContainer.removeChild(live.cs.container);
    }
    this.liveNPCs.clear();
  }

  update(deltaMS: number): void {
    for (const live of this.liveNPCs.values()) {
      this.animSystem.update(live.cs, deltaMS);
      this.updatePatrol(live, deltaMS);
    }
  }

  private updatePatrol(live: LiveNPC, deltaMS: number): void {
    if (!live.patrolPath || live.patrolPath.length < 2) return;

    if (live.patrolPauseTimer > 0) {
      live.patrolPauseTimer -= deltaMS;
      return;
    }

    const nextIndex = (live.patrolIndex + 1) % live.patrolPath.length;
    const nextTile = live.patrolPath[nextIndex];

    if (tilesEqual(live.tile, nextTile)) {
      live.patrolIndex = nextIndex;
      live.patrolPauseTimer = NPC_PATROL_PAUSE_MS;
      this.animSystem.setMoving(live.cs, false);
      return;
    }

    // Move one step toward next tile
    const dx = nextTile.x - live.tile.x;
    const dy = nextTile.y - live.tile.y;
    const newFacing: FacingDirection =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0 ? "right" : "left"
        : dy > 0 ? "down" : "up";

    if (newFacing !== live.facing) {
      live.facing = newFacing;
      this.animSystem.setFacing(live.cs, newFacing);
    }

    // Animate toward next tile
    const target = tileCenterWorld(nextTile);
    const speed = TILE_SIZE / 200; // px per ms
    const dx2 = target.x - live.cs.container.x;
    const dy2 = target.y + TILE_SIZE / 2 - live.cs.container.y;
    const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (dist < speed * deltaMS) {
      live.cs.container.x = target.x;
      live.cs.container.y = target.y + TILE_SIZE / 2;
      live.tile = { ...nextTile };
      live.patrolIndex = nextIndex;
      live.patrolPauseTimer = NPC_PATROL_PAUSE_MS;
      this.animSystem.setMoving(live.cs, false);
    } else {
      const ratio = (speed * deltaMS) / dist;
      live.cs.container.x += dx2 * ratio;
      live.cs.container.y += dy2 * ratio;
      this.animSystem.setMoving(live.cs, true);
    }
  }

  getNPCAtTile(tile: TileCoord): NPC | null {
    for (const live of this.liveNPCs.values()) {
      if (tilesEqual(live.tile, tile)) return live.def;
    }
    return null;
  }

  getNPCAdjacentToTile(tile: TileCoord, facing: FacingDirection): NPC | null {
    const dirs: Record<FacingDirection, TileCoord> = {
      up:    { x: tile.x,     y: tile.y - 1 },
      down:  { x: tile.x,     y: tile.y + 1 },
      left:  { x: tile.x - 1, y: tile.y },
      right: { x: tile.x + 1, y: tile.y },
    };
    return this.getNPCAtTile(dirs[facing]);
  }

  getNPCDef(npcId: string): NPC | null {
    return this.npcDefs.get(npcId) ?? null;
  }
}

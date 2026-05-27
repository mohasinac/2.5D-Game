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

/** Callback fired when a chaser NPC enters catchRadius of the player. */
export type NPCCatchCallback = (npcId: string, catchEventId: string) => void;

export class NPCScheduler {
  private liveNPCs: Map<string, LiveNPC> = new Map();
  private npcDefs: Map<string, NPC> = new Map();
  private npcContainer: PIXI.Container = new PIXI.Container();
  private animSystem: SpriteAnimationSystem;
  private placeholderTexture: PIXI.Texture | null = null;
  private textureCache: Map<string, PIXI.Texture> = new Map();

  // ── Chase / catch state ────────────────────────────────────────────────────
  /** Current player tile — updated every frame by PlayerController. */
  private playerTile: TileCoord = { x: 0, y: 0 };
  /** NPCs whose catch event has already fired this map session. Cleared on map change. */
  private catchFiredIds: Set<string> = new Set();
  /** External callback that fires a StoryEvent when the player is caught. */
  private onNPCCatch?: NPCCatchCallback;

  constructor(animSystem: SpriteAnimationSystem) {
    this.animSystem = animSystem;
  }

  getContainer(): PIXI.Container { return this.npcContainer; }

  /**
   * Register the callback that fires when a patrol NPC catches the player.
   * Typically wired to StoryEventSystem.queueEventIfEligible in useRPGEngine.
   */
  setOnNPCCatch(cb: NPCCatchCallback): void {
    this.onNPCCatch = cb;
  }

  /**
   * Update the tracked player tile each frame so chase detection is current.
   * Called by PlayerController after every movement step.
   */
  setPlayerTile(tile: TileCoord): void {
    this.playerTile = { ...tile };
  }

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
    // Reset catch-fired set so events can re-trigger on a fresh map load
    this.catchFiredIds.clear();
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
      this.checkCatch(live);
    }
  }

  /**
   * Chase / catch detection.
   * Uses Chebyshev (chessboard) distance so diagonal adjacency counts.
   * Fires at most once per map session per NPC (catchFiredIds guard).
   */
  private checkCatch(live: LiveNPC): void {
    if (!live.def.catchRadius || !live.def.catchEventId) return;
    if (this.catchFiredIds.has(live.def.id)) return;
    if (!this.onNPCCatch) return;

    const dx = Math.abs(live.tile.x - this.playerTile.x);
    const dy = Math.abs(live.tile.y - this.playerTile.y);
    const dist = Math.max(dx, dy); // Chebyshev distance

    if (dist <= live.def.catchRadius) {
      this.catchFiredIds.add(live.def.id);
      this.onNPCCatch(live.def.id, live.def.catchEventId);
    }
  }

  /**
   * Allow the catch event to fire again (e.g. after the player is reset to
   * the room start point and re-enters the dojo).
   */
  resetCatch(npcId: string): void {
    this.catchFiredIds.delete(npcId);
  }

  /** Clear all catch state — call when leaving a map entirely. */
  resetAllCatch(): void {
    this.catchFiredIds.clear();
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

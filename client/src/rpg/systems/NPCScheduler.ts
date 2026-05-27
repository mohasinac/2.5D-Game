import * as PIXI from "pixi.js";
import type { NPC, RPGMap, TileCoord, FacingDirection, TimeSlot } from "../data/schemas";
import { tileCenterWorld, tilesEqual, adjacentTile as adjTile } from "../utils/tileUtils";
import { TILE_SIZE, NPC_PATROL_PAUSE_MS } from "../constants/rpgConstants";
import type { SpriteAnimationSystem, CharacterSprite } from "../engine/SpriteAnimationSystem";
import type { CollisionSystem } from "../engine/CollisionSystem";

interface LiveNPC {
  def: NPC;
  cs: CharacterSprite;
  tile: TileCoord;
  facing: FacingDirection;
  patrolPath?: TileCoord[];
  patrolIndex: number;
  patrolPauseTimer: number;
  isPatrolling: boolean;
  bubble?: PIXI.Text;
  bubbleBaseY?: number;
  bubbleVisible?: boolean;
  // #16: Terror radius
  warningBubble?: PIXI.Text;
  warningLevel?: "low" | "high" | "none";
  // #18: BFS chase pathfinding
  chaseMode?: boolean;
  chasePath?: TileCoord[];
  chasePathIndex?: number;
  chaseRecomputeMs?: number;
  chaseMoveTimer?: number; // ms accumulator for tile-step movement during chase
}

/** Callback fired when a chaser NPC enters catchRadius of the player. */
export type NPCCatchCallback = (npcId: string, catchEventId: string) => void;

/** #16: Terror radius warning callback — fired when proximity changes. */
export type NPCWarningCallback = (npcId: string, intensity: "low" | "high" | "none") => void;

export class NPCScheduler {
  private liveNPCs: Map<string, LiveNPC> = new Map();
  private npcDefs: Map<string, NPC> = new Map();
  private npcContainer: PIXI.Container = new PIXI.Container();
  private animSystem: SpriteAnimationSystem;
  private placeholderTexture: PIXI.Texture | null = null;
  private textureCache: Map<string, PIXI.Texture> = new Map();
  private bubbleElapsed: number = 0; // ms accumulator for bubble bob
  // #18: collision system for BFS pathfinding
  private collision?: CollisionSystem;

  // ── Chase / catch state ────────────────────────────────────────────────────
  /** Current player tile — updated every frame by PlayerController. */
  private playerTile: TileCoord = { x: 0, y: 0 };
  /** NPCs whose catch event has already fired this map session. Cleared on map change. */
  private catchFiredIds: Set<string> = new Set();
  /** External callback that fires a StoryEvent when the player is caught. */
  private onNPCCatch?: NPCCatchCallback;
  /** #16: Terror radius warning callback. */
  private onNPCWarning?: NPCWarningCallback;

  constructor(animSystem: SpriteAnimationSystem, collision?: CollisionSystem) {
    this.animSystem = animSystem;
    this.collision = collision;
  }

  /** #18: Wire in the collision system after construction (if not passed in ctor). */
  setCollisionSystem(cs: CollisionSystem): void {
    this.collision = cs;
  }

  getContainer(): PIXI.Container { return this.npcContainer; }

  /**
   * Register the callback that fires when a patrol NPC catches the player.
   * Typically wired to StoryEventSystem.queueEventIfEligible in useRPGEngine.
   */
  setOnNPCCatch(cb: NPCCatchCallback): void {
    this.onNPCCatch = cb;
  }

  /** #16: Register terror radius warning callback. */
  setOnNPCWarning(cb: NPCWarningCallback): void {
    this.onNPCWarning = cb;
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

      // Speech bubble (shown when NPC has dialogue available)
      const bubble = new PIXI.Text({
        text: "...",
        style: {
          fontSize: 7,
          fill: 0xffffff,
          fontFamily: "monospace",
          fontWeight: "bold",
          dropShadow: { color: 0x000000, blur: 2, angle: Math.PI / 4, distance: 1 },
        },
      });
      bubble.anchor.set(0.5, 1);
      const bubbleBaseY = cs.container.y - TILE_SIZE * 1.6;
      bubble.x = cs.container.x;
      bubble.y = bubbleBaseY;
      bubble.visible = false;
      bubble.zIndex = 10;
      this.npcContainer.addChild(bubble);

      // #16: Terror radius "!" warning bubble (separate from dialogue bubble)
      let warningBubble: PIXI.Text | undefined;
      if (def.catchRadius) {
        warningBubble = new PIXI.Text({
          text: "!",
          style: {
            fontSize: 10,
            fill: 0xff4400,
            fontFamily: "monospace",
            fontWeight: "bold",
            dropShadow: { color: 0x000000, blur: 2, angle: Math.PI / 4, distance: 1 },
          },
        });
        warningBubble.anchor.set(0.5, 1);
        warningBubble.x = cs.container.x + 8;
        warningBubble.y = cs.container.y - TILE_SIZE * 2;
        warningBubble.visible = false;
        warningBubble.alpha = 0;
        warningBubble.zIndex = 11;
        this.npcContainer.addChild(warningBubble);
      }

      this.liveNPCs.set(def.id, {
        def, cs, tile: { ...spawnTile }, facing,
        patrolPath, patrolIndex: 0,
        patrolPauseTimer: 0, isPatrolling: false,
        bubble, bubbleBaseY, bubbleVisible: false,
        warningBubble, warningLevel: "none",
      });
    }
  }

  despawnAllNPCs(): void {
    for (const live of this.liveNPCs.values()) {
      this.npcContainer.removeChild(live.cs.container);
      if (live.bubble) this.npcContainer.removeChild(live.bubble);
      if (live.warningBubble) this.npcContainer.removeChild(live.warningBubble); // #16
    }
    this.liveNPCs.clear();
  }

  update(deltaMS: number): void {
    this.bubbleElapsed += deltaMS;
    const bob = Math.sin(this.bubbleElapsed / 400) * 2; // ±2px gentle bob
    for (const live of this.liveNPCs.values()) {
      this.animSystem.update(live.cs, deltaMS);
      // #18: Chase takes priority over patrol when active
      const inChase = this.updateChase(live, deltaMS);
      if (!inChase) this.updatePatrol(live, deltaMS);
      this.checkCatch(live);
      // Keep bubble anchored above NPC sprite (which may move during patrol)
      if (live.bubble && live.bubbleVisible) {
        live.bubble.x = live.cs.container.x;
        live.bubbleBaseY = live.cs.container.y - TILE_SIZE * 1.6;
        live.bubble.y = live.bubbleBaseY + bob;
      }
      // #16: Keep warning "!" bubble positioned above NPC
      if (live.warningBubble && live.warningBubble.visible) {
        live.warningBubble.x = live.cs.container.x + 8;
        live.warningBubble.y = live.cs.container.y - TILE_SIZE * 2 + bob;
        // Pulse alpha for high warning
        if (live.warningLevel === "high") {
          live.warningBubble.alpha = 0.6 + 0.4 * Math.sin(this.bubbleElapsed / 150);
        }
      }
    }
  }

  /**
   * Chase / catch detection + #16 terror radius warnings.
   * Uses Chebyshev (chessboard) distance so diagonal adjacency counts.
   * Fires at most once per map session per NPC (catchFiredIds guard).
   */
  private checkCatch(live: LiveNPC): void {
    if (!live.def.catchRadius || !live.def.catchEventId) return;
    if (!this.onNPCCatch) return;

    const dx = Math.abs(live.tile.x - this.playerTile.x);
    const dy = Math.abs(live.tile.y - this.playerTile.y);
    const dist = Math.max(dx, dy); // Chebyshev distance
    const cr = live.def.catchRadius;

    // #18: Activate BFS chase when player enters 2× catchRadius
    if (dist <= cr * 2 && !live.chaseMode) {
      live.chaseMode = true;
      live.chasePath = undefined;
      live.chasePathIndex = 0;
      live.chaseRecomputeMs = 0;
    }

    // #16: Terror radius warning tiers
    const newWarning: "low" | "high" | "none" =
      dist <= cr * 1.5 ? "high" :
      dist <= cr * 3   ? "low"  : "none";

    if (newWarning !== live.warningLevel) {
      live.warningLevel = newWarning;
      this.onNPCWarning?.(live.def.id, newWarning);
      // Update "!" bubble visibility and alpha
      if (live.warningBubble) {
        live.warningBubble.visible = newWarning !== "none";
        live.warningBubble.alpha = newWarning === "high" ? 1.0 : 0.4;
      }
    }

    if (!this.catchFiredIds.has(live.def.id) && dist <= cr) {
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

  // #18: BFS pathfinding from `start` to `goal` in the collision map.
  // Returns array of TileCoords from start (exclusive) to goal (inclusive), or null if no path.
  private bfsPath(start: TileCoord, goal: TileCoord, maxDepth = 64): TileCoord[] | null {
    if (!this.collision) return null;
    if (tilesEqual(start, goal)) return [];
    const visited = new Set<string>();
    const queue: Array<{ tile: TileCoord; path: TileCoord[] }> = [{ tile: start, path: [] }];
    const key = (t: TileCoord) => `${t.x},${t.y}`;
    visited.add(key(start));
    while (queue.length > 0) {
      const { tile, path } = queue.shift()!;
      if (path.length >= maxDepth) continue;
      for (const dir of ["up", "down", "left", "right"] as const) {
        const next = adjTile(tile, dir);
        const nk = key(next);
        if (visited.has(nk)) continue;
        if (!this.collision.isWalkable(next)) continue;
        visited.add(nk);
        const newPath = [...path, next];
        if (tilesEqual(next, goal)) return newPath;
        queue.push({ tile: next, path: newPath });
      }
    }
    return null;
  }

  // #18: Advance NPC one tile toward player if in chaseMode.
  private updateChase(live: LiveNPC, deltaMS: number): boolean {
    if (!live.chaseMode || !live.def.catchRadius) return false;
    const cr = live.def.catchRadius;
    const dx = Math.abs(live.tile.x - this.playerTile.x);
    const dy = Math.abs(live.tile.y - this.playerTile.y);
    const dist = Math.max(dx, dy);

    // Exit chase if player is more than 3× catchRadius away
    if (dist > cr * 3) {
      live.chaseMode = false;
      live.chasePath = undefined;
      return false;
    }

    // Recompute path every 500ms or when path exhausted
    const now = Date.now();
    if (!live.chasePath || live.chasePath.length === 0 || (now - (live.chaseRecomputeMs ?? 0)) > 500) {
      live.chasePath = this.bfsPath(live.tile, this.playerTile) ?? undefined;
      live.chasePathIndex = 0;
      live.chaseRecomputeMs = now;
    }

    if (!live.chasePath || live.chasePath.length === 0) return true;

    // Advance timer for tile-step movement
    live.chaseMoveTimer = (live.chaseMoveTimer ?? 0) + deltaMS;
    const stepMs = NPC_PATROL_PAUSE_MS; // reuse patrol timing constant
    if (live.chaseMoveTimer < stepMs) return true;
    live.chaseMoveTimer = 0;

    const nextTile = live.chasePath[live.chasePathIndex ?? 0];
    if (!nextTile || tilesEqual(live.tile, this.playerTile)) return true;

    // Snap NPC to next tile
    live.tile = { ...nextTile };
    const pos = tileCenterWorld(nextTile);
    live.cs.container.x = pos.x;
    live.cs.container.y = pos.y + TILE_SIZE / 2;

    // Update facing
    const facingDx = nextTile.x - live.tile.x;
    const facingDy = nextTile.y - live.tile.y;
    const newFacing: FacingDirection =
      Math.abs(facingDx) > Math.abs(facingDy)
        ? facingDx > 0 ? "right" : "left"
        : facingDy > 0 ? "down" : "up";
    if (newFacing !== live.facing) {
      live.facing = newFacing;
      this.animSystem.setFacing(live.cs, newFacing);
    }
    this.animSystem.setMoving(live.cs, true);

    live.chasePathIndex = (live.chasePathIndex ?? 0) + 1;
    if (live.chasePathIndex >= live.chasePath.length) {
      live.chasePath = undefined; // path exhausted; will recompute next frame
    }
    return true;
  }

  // ── Speech bubble API ───────────────────────────────────────────────────────

  /** Show the "..." bubble above an NPC to indicate they have dialogue. */
  showDialogueBubble(npcId: string): void {
    const live = this.liveNPCs.get(npcId);
    if (!live?.bubble) return;
    live.bubble.visible = true;
    live.bubbleVisible = true;
  }

  /** Hide the dialogue bubble (e.g. while dialogue is playing). */
  hideDialogueBubble(npcId: string): void {
    const live = this.liveNPCs.get(npcId);
    if (!live?.bubble) return;
    live.bubble.visible = false;
    live.bubbleVisible = false;
  }

  /** Hide all bubbles (e.g. during a cutscene). */
  hideAllBubbles(): void {
    for (const live of this.liveNPCs.values()) {
      if (!live.bubble) continue;
      live.bubble.visible = false;
      live.bubbleVisible = false;
    }
  }

  /** Restore bubbles for all NPCs that have a dialogueId. */
  restoreAllBubbles(): void {
    for (const live of this.liveNPCs.values()) {
      if (!live.bubble) continue;
      const hasDlg = !!live.def.defaultDialogueId;
      live.bubble.visible = hasDlg;
      live.bubbleVisible = hasDlg;
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

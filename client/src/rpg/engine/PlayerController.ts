import * as PIXI from "pixi.js";
import type { TileCoord, FacingDirection } from "../data/schemas";
import {
  TILE_SIZE, WALK_DURATION_MS,
} from "../constants/rpgConstants";
import { tileCenterWorld, adjacentTile, tilesEqual } from "../utils/tileUtils";
import type { CollisionSystem } from "./CollisionSystem";
import type { SpriteAnimationSystem, CharacterSprite } from "./SpriteAnimationSystem";
import type { RPGInputState } from "../hooks/useRPGInput";

interface WalkAnimation {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number; // 0–1
  targetTile: TileCoord;
  resolve?: () => void;
}

export class PlayerController {
  private tile: TileCoord = { x: 5, y: 5 };
  private facing: FacingDirection = "down";
  private walkAnim: WalkAnimation | null = null;
  private locked = false;
  private cs: CharacterSprite | null = null;
  private worldContainer: PIXI.Container | null = null;
  private onTileChange?: (tile: TileCoord) => void;
  private onFacingChange?: (facing: FacingDirection) => void;

  constructor(
    private animSystem: SpriteAnimationSystem,
    private collision: CollisionSystem
  ) {}

  init(
    container: PIXI.Container,
    texture: PIXI.Texture,
    startTile: TileCoord,
    facing: FacingDirection = "down"
  ): void {
    if (this.cs && this.worldContainer) {
      this.worldContainer.removeChild(this.cs.container);
    }
    this.worldContainer = container;
    this.cs = this.animSystem.createCharacterSprite(texture, facing);
    this.cs.container.zIndex = 10;
    container.addChild(this.cs.container);
    this.tile = { ...startTile };
    this.facing = facing;
    const pos = tileCenterWorld(startTile);
    this.cs.container.x = pos.x;
    this.cs.container.y = pos.y + TILE_SIZE / 2;
  }

  onTileChanged(cb: (tile: TileCoord) => void): void {
    this.onTileChange = cb;
  }

  onFacingChanged(cb: (facing: FacingDirection) => void): void {
    this.onFacingChange = cb;
  }

  update(deltaMS: number, input: RPGInputState): void {
    if (this.cs) this.animSystem.update(this.cs, deltaMS);

    if (this.walkAnim) {
      this.updateWalkAnim(deltaMS);
      return;
    }

    if (this.locked) return;

    const dir = this.getInputDirection(input);
    if (!dir) {
      if (this.cs) this.animSystem.setMoving(this.cs, false);
      return;
    }

    const newFacing = dir;
    if (newFacing !== this.facing) {
      this.facing = newFacing;
      if (this.cs) this.animSystem.setFacing(this.cs, newFacing);
      this.onFacingChange?.(newFacing);
    }

    const targetTile = adjacentTile(this.tile, dir);
    if (!this.collision.isWalkable(targetTile)) {
      if (this.cs) this.animSystem.setMoving(this.cs, false);
      return;
    }

    this.startWalk(targetTile);
  }

  private startWalk(targetTile: TileCoord): void {
    const from = tileCenterWorld(this.tile);
    const to = tileCenterWorld(targetTile);
    this.walkAnim = {
      fromX: from.x,
      fromY: from.y + TILE_SIZE / 2,
      toX: to.x,
      toY: to.y + TILE_SIZE / 2,
      progress: 0,
      targetTile,
    };
    if (this.cs) this.animSystem.setMoving(this.cs, true);
  }

  private updateWalkAnim(deltaMS: number): void {
    if (!this.walkAnim || !this.cs) return;
    this.walkAnim.progress += deltaMS / WALK_DURATION_MS;
    if (this.walkAnim.progress >= 1) {
      this.walkAnim.progress = 1;
      this.cs.container.x = this.walkAnim.toX;
      this.cs.container.y = this.walkAnim.toY;
      this.tile = { ...this.walkAnim.targetTile };
      this.onTileChange?.(this.tile);
      this.walkAnim.resolve?.();
      this.walkAnim = null;
      this.animSystem.setMoving(this.cs, false);
    } else {
      const t = this.walkAnim.progress;
      this.cs.container.x = this.walkAnim.fromX + (this.walkAnim.toX - this.walkAnim.fromX) * t;
      this.cs.container.y = this.walkAnim.fromY + (this.walkAnim.toY - this.walkAnim.fromY) * t;
    }
  }

  async walkTo(targetTile: TileCoord, facing?: FacingDirection): Promise<void> {
    if (facing) {
      this.facing = facing;
      if (this.cs) this.animSystem.setFacing(this.cs, facing);
    }
    if (tilesEqual(this.tile, targetTile)) return;
    return new Promise((resolve) => {
      const from = tileCenterWorld(this.tile);
      const to = tileCenterWorld(targetTile);
      this.walkAnim = {
        fromX: from.x, fromY: from.y + TILE_SIZE / 2,
        toX: to.x, toY: to.y + TILE_SIZE / 2,
        progress: 0, targetTile, resolve,
      };
      if (this.cs) this.animSystem.setMoving(this.cs, true);
    });
  }

  teleportTo(tile: TileCoord, facing: FacingDirection): void {
    this.tile = { ...tile };
    this.facing = facing;
    this.walkAnim = null;
    if (this.cs) {
      const pos = tileCenterWorld(tile);
      this.cs.container.x = pos.x;
      this.cs.container.y = pos.y + TILE_SIZE / 2;
      this.animSystem.setFacing(this.cs, facing);
      this.animSystem.setMoving(this.cs, false);
    }
    this.onTileChange?.(tile);
    this.onFacingChange?.(facing);
  }

  lock(): void   { this.locked = true;  if (this.cs) this.animSystem.setMoving(this.cs, false); }
  unlock(): void { this.locked = false; }
  isLocked(): boolean { return this.locked; }
  isWalking(): boolean { return this.walkAnim !== null; }

  getTile(): TileCoord         { return { ...this.tile }; }
  getFacing(): FacingDirection { return this.facing; }
  getContainer(): PIXI.Container | null { return this.cs?.container ?? null; }

  getFacingTile(): TileCoord { return adjacentTile(this.tile, this.facing); }

  getWorldPosition(): { x: number; y: number } {
    if (this.cs) return { x: this.cs.container.x, y: this.cs.container.y };
    const pos = tileCenterWorld(this.tile);
    return { x: pos.x, y: pos.y + TILE_SIZE / 2 };
  }

  private getInputDirection(input: RPGInputState): FacingDirection | null {
    if (input.up)    return "up";
    if (input.down)  return "down";
    if (input.left)  return "left";
    if (input.right) return "right";
    return null;
  }
}

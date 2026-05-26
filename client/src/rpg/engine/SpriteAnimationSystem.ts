import * as PIXI from "pixi.js";
import type { FacingDirection } from "../data/schemas";
import { TILE_SIZE, WALK_DURATION_MS } from "../constants/rpgConstants";

// Spritesheet layout convention:
// Row 0: walk-down  (3 frames)
// Row 1: walk-left  (3 frames)
// Row 2: walk-right (3 frames)
// Row 3: walk-up    (3 frames)
// Each frame is TILE_SIZE × TILE_SIZE pixels
const DIRECTION_ROW: Record<FacingDirection, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const WALK_FRAME_COUNT = 3;
const IDLE_FRAME = 1; // middle frame of each row used for idle

export interface CharacterSprite {
  container: PIXI.Container;
  sprite: PIXI.Sprite;
  texture: PIXI.Texture;
  sheetWidth: number;
  sheetHeight: number;
  facing: FacingDirection;
  walkTimer: number;
  frameIndex: number;
  isMoving: boolean;
}

export class SpriteAnimationSystem {
  createCharacterSprite(
    texture: PIXI.Texture,
    facing: FacingDirection = "down"
  ): CharacterSprite {
    const container = new PIXI.Container();
    const sprite = new PIXI.Sprite(this.getFrame(texture, facing, IDLE_FRAME));
    sprite.anchor.set(0.5, 1); // feet at origin
    container.addChild(sprite);
    return {
      container, sprite, texture,
      sheetWidth: texture.width,
      sheetHeight: texture.height,
      facing,
      walkTimer: 0,
      frameIndex: IDLE_FRAME,
      isMoving: false,
    };
  }

  setFacing(cs: CharacterSprite, dir: FacingDirection): void {
    cs.facing = dir;
    if (!cs.isMoving) {
      this.applyFrame(cs, IDLE_FRAME);
    }
  }

  setMoving(cs: CharacterSprite, moving: boolean): void {
    cs.isMoving = moving;
    if (!moving) {
      cs.frameIndex = IDLE_FRAME;
      cs.walkTimer = 0;
      this.applyFrame(cs, IDLE_FRAME);
    }
  }

  update(cs: CharacterSprite, deltaMS: number): void {
    if (!cs.isMoving) return;
    cs.walkTimer += deltaMS;
    const frameDuration = WALK_DURATION_MS / WALK_FRAME_COUNT;
    if (cs.walkTimer >= frameDuration) {
      cs.walkTimer -= frameDuration;
      cs.frameIndex = (cs.frameIndex + 1) % WALK_FRAME_COUNT;
      this.applyFrame(cs, cs.frameIndex);
    }
  }

  private applyFrame(cs: CharacterSprite, frameIndex: number): void {
    cs.sprite.texture = this.getFrame(cs.texture, cs.facing, frameIndex);
  }

  private getFrame(
    texture: PIXI.Texture,
    facing: FacingDirection,
    frameIndex: number
  ): PIXI.Texture {
    const row = DIRECTION_ROW[facing];
    const frameW = TILE_SIZE;
    const frameH = TILE_SIZE;
    return new PIXI.Texture({
      source: texture.source,
      frame: new PIXI.Rectangle(
        frameIndex * frameW,
        row * frameH,
        frameW,
        frameH
      ),
    });
  }

  createPlaceholderTexture(color: number = 0x4488ff): PIXI.Texture {
    const g = new PIXI.Graphics();
    // Draw 3×4 grid of TILE_SIZE squares (3 walk frames × 4 directions)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < WALK_FRAME_COUNT; col++) {
        g.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
        g.fill(color);
      }
    }
    return PIXI.RenderTexture.create({
      width: TILE_SIZE * WALK_FRAME_COUNT,
      height: TILE_SIZE * 4,
    });
  }
}

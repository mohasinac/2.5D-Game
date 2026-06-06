import Phaser from 'phaser';
import { PLAYER_WALK_SPEED, PLAYER_INTERACT_RADIUS } from '../config/rpgConstants.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';

type PlayerState = 'idle' | 'walk' | 'locked';

export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private state: PlayerState = 'idle';
  private facing: 'up' | 'down' | 'left' | 'right' = 'down';
  private interactKey: Phaser.Input.Keyboard.Key;
  private inventoryKey: Phaser.Input.Keyboard.Key;

  constructor(private scene: Phaser.Scene, tileX: number, tileY: number, tileSize: number) {
    const x = tileX * tileSize + tileSize / 2;
    const y = tileY * tileSize + tileSize / 2;
    this.sprite = scene.physics.add.sprite(x, y, 'tyson');
    this.sprite.setCollideWorldBounds(true);

    const spriteDef = svgAssetStore.getSprite('tyson');
    if (spriteDef) {
      this.setupAnimations(spriteDef, scene);
    }
    this.sprite.play('tyson_idle_down');

    const kb = scene.input.keyboard!;
    this.interactKey  = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.inventoryKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.I);

    const hitbox = spriteDef?.hitbox;
    if (hitbox) {
      this.sprite.setBodySize(hitbox.width, hitbox.height);
      this.sprite.setOffset(hitbox.offsetX, hitbox.offsetY);
    }
  }

  private setupAnimations(spriteDef: ReturnType<typeof svgAssetStore.getSprite>, scene: Phaser.Scene): void {
    if (!spriteDef) return;
    const anims = scene.anims;
    const scale = 2; // SVG was loaded at scale 2
    const fw = spriteDef.frameWidth * scale;
    const fh = spriteDef.frameHeight * scale;
    const cols = spriteDef.cols;

    spriteDef.animations.forEach(animDef => {
      const key = `tyson_${animDef.name.replace('-', '_')}`;
      if (anims.exists(key)) return;
      anims.create({
        key,
        frames: animDef.frames.map(f => ({
          frame: 0,
          key: spriteDef.id,
          textureFrame: { x: (f % cols) * fw, y: Math.floor(f / cols) * fh, w: fw, h: fh } as unknown as string | number,
        })),
        frameRate: animDef.fps,
        repeat: animDef.loop ? -1 : 0,
      });
    });
  }

  get x(): number { return this.sprite.x; }
  get y(): number { return this.sprite.y; }
  get interactJustPressed(): boolean { return Phaser.Input.Keyboard.JustDown(this.interactKey); }
  get inventoryJustPressed(): boolean { return Phaser.Input.Keyboard.JustDown(this.inventoryKey); }

  lock(): void   { this.state = 'locked'; this.sprite.setVelocity(0, 0); }
  unlock(): void { this.state = 'idle'; }
  isLocked(): boolean { return this.state === 'locked'; }
  getFacing(): string { return this.facing; }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (this.state === 'locked') return;

    const speed = PLAYER_WALK_SPEED;
    let vx = 0; let vy = 0;

    if (cursors.left.isDown)        { vx = -speed; this.facing = 'left'; }
    else if (cursors.right.isDown)  { vx =  speed; this.facing = 'right'; }
    if (cursors.up.isDown)          { vy = -speed; this.facing = 'up'; }
    else if (cursors.down.isDown)   { vy =  speed; this.facing = 'down'; }

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    this.sprite.setVelocity(vx, vy);

    const moving = vx !== 0 || vy !== 0;
    this.state = moving ? 'walk' : 'idle';

    const animPrefix = moving ? 'tyson_walk_' : 'tyson_idle_';
    const animKey = `${animPrefix}${this.facing}`;
    const fallback = `tyson_idle_down`;
    const target = this.sprite.anims.currentAnim?.key;
    const desired = this.sprite.scene?.anims.exists(animKey) ? animKey : fallback;
    if (target !== desired) this.sprite.play(desired);

    // Save position periodically
    const tileSize = 48;
    gameStateStore.setPlayerPos(
      Math.floor(this.sprite.x / tileSize),
      Math.floor(this.sprite.y / tileSize),
    );
  }

  getInteractArea(): Phaser.Geom.Circle {
    return new Phaser.Geom.Circle(this.sprite.x, this.sprite.y, PLAYER_INTERACT_RADIUS);
  }

  destroy(): void { this.sprite.destroy(); }
}

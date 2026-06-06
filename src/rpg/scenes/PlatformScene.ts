import Phaser from 'phaser';
import { eventBus } from '../systems/EventBus.ts';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { PLATFORM_JUMP_VELOCITY, PLATFORM_SPRING_VELOCITY } from '../config/rpgConstants.ts';
import type { PlatformLevel, PlatformTile, PlatformCollectible } from '../../types/rpgTypes.ts';

interface PlatformSceneData {
  level: PlatformLevel;
  triggerId: string;
}

export class PlatformScene extends Phaser.Scene {
  private level!: PlatformLevel;
  private triggerId!: string;
  private runner!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.StaticGroup;
  private exitZone!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft = 0;
  private timerEvent!: Phaser.Time.TimerEvent;
  private ended = false;
  private spikes: Phaser.GameObjects.Rectangle[] = [];
  private crumbleTiles = new Map<string, { rect: Phaser.GameObjects.Rectangle; triggered: boolean }>();

  constructor() { super({ key: 'PlatformScene' }); }

  create(data: PlatformSceneData): void {
    this.level     = data.level;
    this.triggerId = data.triggerId;
    this.timeLeft  = data.level.timeLimitSec;
    this.ended     = false;

    const { tileSize, cols, rows, gravity, bgColor } = data.level;
    const worldW = cols * tileSize;
    const worldH = rows * tileSize;

    this.cameras.main.setBackgroundColor(bgColor || '#1a0a2e');
    this.physics.world.gravity.y = gravity || 800;
    this.physics.world.setBounds(0, 0, worldW, worldH + tileSize * 2);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    this.platforms       = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group();
    this.collectibles    = this.physics.add.staticGroup();

    this.buildPlatforms(data.level.tiles, tileSize);
    this.buildCollectibles(data.level.collectibles, tileSize);
    this.buildExitZone(tileSize);

    // Spawn player
    const spawnX = data.level.spawnCol * tileSize + tileSize / 2;
    const spawnY = data.level.spawnRow * tileSize;
    this.runner = this.physics.add.sprite(spawnX, spawnY, 'tyson');
    this.runner.setCollideWorldBounds(true);
    (this.runner.body as Phaser.Physics.Arcade.Body).setMaxVelocityY(600);

    this.cameras.main.startFollow(this.runner, true, 0.15, 0.15);

    this.physics.add.collider(this.runner, this.platforms, (obj, tile) => {
      const key = (tile as Phaser.GameObjects.Rectangle).name;
      if (key && this.crumbleTiles.has(key)) {
        const cr = this.crumbleTiles.get(key)!;
        if (!cr.triggered) {
          cr.triggered = true;
          this.time.delayedCall(400, () => {
            cr.rect.destroy();
            this.platforms.remove(cr.rect, true, true);
          });
        }
      }
    });
    this.physics.add.collider(this.runner, this.movingPlatforms);

    this.physics.add.overlap(this.runner, this.collectibles, (_r, item) => {
      const cItem = item as Phaser.GameObjects.Rectangle;
      const itemId = cItem.name;
      if (itemId) {
        inventoryStore.add(itemId, 1);
        eventBus.emit('inventory:changed');
      }
      this.collectibles.remove(cItem, true, true);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();

    // HUD
    this.timerText = this.add.text(12, 12, `${this.timeLeft}s`, {
      fontFamily: 'Orbitron, monospace', fontSize: '16px', color: '#ff6b35',
    }).setScrollFactor(0);

    this.add.text(this.scale.width - 12, 12, 'ESC: quit', {
      fontFamily: 'Rajdhani, monospace', fontSize: '12px', color: '#556677',
    }).setScrollFactor(0).setOrigin(1, 0);

    this.timerEvent = this.time.addEvent({
      delay: 1000, repeat: this.timeLeft - 1,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`${this.timeLeft}s`);
        if (this.timeLeft <= 0) this.endGame(false);
      },
    });

    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.endGame(false));

    this.events.on('update', () => this.checkFallDeath(worldH));
  }

  private buildPlatforms(tiles: PlatformTile[], tileSize: number): void {
    for (const t of tiles) {
      const x = t.col * tileSize + tileSize / 2;
      const y = t.row * tileSize + tileSize / 2;

      let color = 0x3a5a8a;
      if (t.type === 'spring')  color = 0x22aa44;
      if (t.type === 'spike')   color = 0xcc2222;
      if (t.type === 'crumble') color = 0xaa8822;
      if (t.type === 'moving')  color = 0x8844aa;

      if (t.type === 'moving') {
        const rect = this.add.rectangle(x, y, tileSize - 2, tileSize - 2, color);
        this.physics.add.existing(rect);
        const body = rect.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.allowGravity = false;
        const speed = t.moveSpeed ?? 60;
        body.setVelocityX(t.moveAxis === 'x' ? speed : 0);
        body.setVelocityY(t.moveAxis === 'y' ? speed : 0);
        this.movingPlatforms.add(rect);

        const range = t.moveRange ?? 80;
        let dist = 0;
        this.events.on('update', (_time: number, delta: number) => {
          dist += (Math.abs(body.velocity.x) + Math.abs(body.velocity.y)) * delta / 1000;
          if (dist >= range) {
            dist = 0;
            body.setVelocity(-body.velocity.x, -body.velocity.y);
          }
        });
      } else {
        const rect = this.add.rectangle(x, y, tileSize - 2, tileSize - 2, color);
        this.physics.add.existing(rect, true);
        rect.name = `${t.col}:${t.row}`;
        this.platforms.add(rect);

        if (t.type === 'spike') this.spikes.push(rect);
        if (t.type === 'crumble') {
          this.crumbleTiles.set(rect.name, { rect, triggered: false });
        }
      }
    }
  }

  private buildCollectibles(items: PlatformCollectible[], tileSize: number): void {
    for (const item of items) {
      const x = item.col * tileSize + tileSize / 2;
      const y = item.row * tileSize + tileSize / 2;
      const rect = this.add.rectangle(x, y, tileSize * 0.6, tileSize * 0.6, 0xffcc00);
      rect.name = item.itemId;
      this.physics.add.existing(rect, true);
      this.collectibles.add(rect);
    }
  }

  private buildExitZone(tileSize: number): void {
    const { exitCol, exitRow } = this.level;
    const x = exitCol * tileSize + tileSize / 2;
    const y = exitRow * tileSize + tileSize / 2;
    this.exitZone = this.add.rectangle(x, y, tileSize, tileSize, 0x00e5ff, 0.4);
    this.physics.add.existing(this.exitZone, true);
    this.add.text(x, y - tileSize, 'EXIT', {
      fontFamily: 'Orbitron, monospace', fontSize: '10px', color: '#00e5ff',
    }).setOrigin(0.5);
  }

  private checkFallDeath(worldH: number): void {
    if (this.runner.y > worldH + 50) this.endGame(false);
  }

  update(): void {
    if (this.ended || !this.runner) return;

    const body = this.runner.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    if (this.cursors.left.isDown)       body.setVelocityX(-160);
    else if (this.cursors.right.isDown) body.setVelocityX(160);
    else                                body.setVelocityX(0);

    if ((this.cursors.up.isDown || this.cursors.space?.isDown) && onGround) {
      body.setVelocityY(PLATFORM_JUMP_VELOCITY);
    }

    // Spring tiles
    if (onGround) {
      for (const spike of this.spikes) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          this.runner.getBounds(), spike.getBounds())) {
          this.endGame(false);
          return;
        }
      }
    }

    // Check exit
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      this.runner.getBounds(), this.exitZone.getBounds())) {
      this.endGame(true);
      return;
    }

    // Spring bounce
    for (const [, { rect }] of this.crumbleTiles) {
      if (!rect.active) continue;
    }
  }

  private endGame(win: boolean): void {
    if (this.ended) return;
    this.ended = true;
    this.timerEvent.remove();

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0);

    const msg = win ? 'STAGE CLEAR!' : 'GAME OVER';
    const col = win ? '#00e5ff' : '#ff6b35';
    this.add.text(width / 2, height / 2 - 30, msg, {
      fontFamily: 'Orbitron, monospace', fontSize: '32px', color: col,
    }).setOrigin(0.5).setScrollFactor(0);

    if (win) {
      if (this.level.rewardItemId) {
        inventoryStore.add(this.level.rewardItemId, 1);
        eventBus.emit('inventory:changed');
        this.add.text(width / 2, height / 2 + 20, `+ ${this.level.rewardItemId}`, {
          fontFamily: 'Rajdhani, monospace', fontSize: '18px', color: '#dde8ff',
        }).setOrigin(0.5).setScrollFactor(0);
      }
      if (this.level.rewardGold > 0) {
        inventoryStore.addGold(this.level.rewardGold);
        eventBus.emit('gold:changed', { amount: this.level.rewardGold });
      }
      if (this.level.winFlagKey) {
        gameStateStore.setFlag(this.level.winFlagKey, true);
      }
    }

    eventBus.emit('minigame:result', {
      levelId: this.triggerId, win,
      rewardItemId: win ? (this.level.rewardItemId ?? null) : null,
      rewardGold:   win ? this.level.rewardGold : 0,
      winFlagKey:   win ? (this.level.winFlagKey ?? null) : null,
    });

    this.time.delayedCall(2500, () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
    });
  }
}

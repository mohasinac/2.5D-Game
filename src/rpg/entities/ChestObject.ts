import Phaser from 'phaser';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { eventBus } from '../systems/EventBus.ts';

export class ChestObject {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private opened = false;
  private readonly flagKey: string;

  constructor(
    scene: Phaser.Scene,
    id: string,
    tileX: number, tileY: number,
    tileSize: number,
    private itemId: string,
  ) {
    const x = tileX * tileSize + tileSize / 2;
    const y = tileY * tileSize + tileSize / 2;
    this.flagKey = `chest_opened_${id}`;
    this.sprite = scene.physics.add.sprite(x, y, 'chest');
    this.sprite.setImmovable(true);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.opened = gameStateStore.getFlag(this.flagKey);
    if (this.opened) this.sprite.setAlpha(0.4);
  }

  open(): void {
    if (this.opened) return;
    this.opened = true;
    gameStateStore.setFlag(this.flagKey, true);
    inventoryStore.add(this.itemId, 1);
    eventBus.emit('inventory:changed');
    this.sprite.setAlpha(0.4);
  }

  isOpen(): boolean { return this.opened; }
  destroy(): void { this.sprite.destroy(); }
}

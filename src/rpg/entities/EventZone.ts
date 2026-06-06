import Phaser from 'phaser';
import type { EventZonePlacement } from '../../types/rpgTypes.ts';

export class EventZone {
  readonly zone: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    placement: EventZonePlacement,
    tileSize: number,
  ) {
    const x = placement.tileX * tileSize + (placement.widthTiles * tileSize) / 2;
    const y = placement.tileY * tileSize + (placement.heightTiles * tileSize) / 2;
    const w = placement.widthTiles * tileSize;
    const h = placement.heightTiles * tileSize;

    this.zone = scene.add.rectangle(x, y, w, h, 0x00e5ff, 0);
    scene.physics.add.existing(this.zone, true);
  }

  destroy(): void { this.zone.destroy(); }
}

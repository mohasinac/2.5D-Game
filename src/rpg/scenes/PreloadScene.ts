import Phaser from 'phaser';
import { SVGAssetLoader } from '../systems/SVGAssetLoader.ts';

export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  preload(): void {
    const { width, height } = this.scale;

    // Loading bar background
    const barBg = this.add.rectangle(width / 2, height / 2, 400, 24, 0x111122);
    const bar   = this.add.rectangle(width / 2 - 200, height / 2, 0, 20, 0x00e5ff);
    barBg.setStrokeStyle(2, 0x00e5ff);
    bar.setOrigin(0, 0.5);

    const label = this.add.text(width / 2, height / 2 - 30, 'LOADING...', {
      fontFamily: 'Orbitron, monospace', fontSize: '14px', color: '#00e5ff',
    }).setOrigin(0.5);

    this.load.on('progress', (v: number) => {
      bar.width = 400 * v;
      label.setText(`LOADING... ${Math.floor(v * 100)}%`);
    });

    SVGAssetLoader.loadAll(this);
  }

  create(): void {
    this.scene.start('WorldScene');
    this.scene.launch('UIScene');
    this.scene.launch('DialogueScene');
  }
}

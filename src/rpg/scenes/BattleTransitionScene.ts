import Phaser from 'phaser';
import { eventBus } from '../systems/EventBus.ts';

interface BattleTransitionData {
  npcId: string;
}

export class BattleTransitionScene extends Phaser.Scene {
  constructor() { super({ key: 'BattleTransitionScene' }); }

  create(data: BattleTransitionData): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x000000);

    const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff);
    flash.setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha:   { from: 0, to: 1 },
      duration: 200,
      yoyo:    true,
      repeat:  2,
      onComplete: () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(450, () => {
          eventBus.emit('battle:start', { npcId: data.npcId });
          // Return to WorldScene after stub (3D battle would take over here)
          this.time.delayedCall(1500, () => {
            this.cameras.main.fadeIn(400, 0, 0, 0);
            this.scene.stop();
            this.scene.resume('WorldScene');
          });
        });
      },
    });

    this.add.text(width / 2, height / 2, 'BATTLE!', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '48px',
      color:      '#ff6b35',
      stroke:     '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
  }
}

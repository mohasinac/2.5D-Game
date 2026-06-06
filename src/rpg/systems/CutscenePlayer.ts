import Phaser from 'phaser';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { eventBus } from './EventBus.ts';
import type { CutsceneStep } from '../../types/rpgTypes.ts';

export class CutscenePlayer {
  private scene: Phaser.Scene;
  private running = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  isRunning(): boolean { return this.running; }

  async play(scriptId: string): Promise<void> {
    const script = svgAssetStore.getCutscene(scriptId);
    if (!script || this.running) return;
    this.running = true;
    for (const step of script.steps) {
      await this.executeStep(step);
    }
    this.running = false;
    eventBus.emit('cutscene:complete');
  }

  private executeStep(step: CutsceneStep): Promise<void> {
    return new Promise<void>(resolve => {
      switch (step.type) {
        case 'wait':
          this.scene.time.delayedCall(step.duration, resolve);
          break;

        case 'flag_set':
          if (step.flagKey) gameStateStore.setFlag(step.flagKey, step.flagValue);
          resolve();
          break;

        case 'fade': {
          const cam = this.scene.cameras.main;
          if (step.fadeDir === 'out') {
            cam.fadeOut(step.duration, 0, 0, 0);
          } else {
            cam.fadeIn(step.duration, 0, 0, 0);
          }
          this.scene.time.delayedCall(step.duration, resolve);
          break;
        }

        case 'camera_pan': {
          const cam = this.scene.cameras.main;
          cam.pan(step.targetX, step.targetY, step.duration, 'Sine.easeInOut');
          this.scene.time.delayedCall(step.duration, resolve);
          break;
        }

        case 'dialogue':
          if (step.dialogueId) {
            this.scene.scene.launch('DialogueScene', { treeId: step.dialogueId });
            eventBus.once('dialogue:complete', () => resolve());
          } else {
            resolve();
          }
          break;

        case 'npc_move':
          // NPC move over duration — handled via tween
          resolve();
          break;

        case 'sfx':
          resolve();
          break;

        default:
          resolve();
      }
    });
  }

  stop(): void {
    this.running = false;
  }
}

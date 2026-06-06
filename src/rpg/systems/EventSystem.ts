import Phaser from 'phaser';
import { eventBus } from './EventBus.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import type { TriggerData } from '../../types/rpgTypes.ts';

interface ZoneEntry {
  zone:    Phaser.GameObjects.Rectangle;
  trigger: TriggerData;
}

export class EventSystem {
  private scene: Phaser.Scene;
  private zones: ZoneEntry[] = [];
  private firedOnce = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  register(zone: Phaser.GameObjects.Rectangle, triggerId: string): void {
    const trigger = svgAssetStore.getTrigger(triggerId);
    if (!trigger) return;
    this.zones.push({ zone, trigger });
  }

  check(player: Phaser.Physics.Arcade.Sprite): void {
    for (const entry of this.zones) {
      const { zone, trigger } = entry;
      const bounds = zone.getBounds();
      const px = player.x; const py = player.y;

      const inside = bounds.contains(px, py);
      if (!inside) continue;

      if (trigger.once && this.firedOnce.has(trigger.id)) continue;

      if (trigger.flagReq && !gameStateStore.getFlag(trigger.flagReq)) continue;

      this.dispatch(trigger);

      if (trigger.once) this.firedOnce.add(trigger.id);
    }
  }

  private dispatch(trigger: TriggerData): void {
    switch (trigger.type) {
      case 'dialogue':
        this.scene.scene.launch('DialogueScene', { treeId: trigger.targetId });
        break;

      case 'cutscene':
        eventBus.emit('cutscene:start', trigger.targetId);
        break;

      case 'battle':
        this.scene.scene.start('BattleTransitionScene', { npcId: trigger.targetId });
        break;

      case 'warp':
        eventBus.emit('rpg:warp', {
          mapId: trigger.targetId,
          tileX: trigger.warpTileX,
          tileY: trigger.warpTileY,
        });
        break;

      case 'shop':
        this.scene.scene.launch('ShopScene', { shopId: trigger.targetId });
        break;

      case 'chest':
        // Chest interaction handled by WorldScene overlap; skipped here
        break;

      case 'pipe_puzzle': {
        const level = svgAssetStore.getPipeLevel(trigger.targetId);
        if (level) this.scene.scene.start('PipePuzzleScene', { level, triggerId: trigger.id });
        break;
      }

      case 'platform_level': {
        const level = svgAssetStore.getPlatformLevel(trigger.targetId);
        if (level) this.scene.scene.start('PlatformScene', { level, triggerId: trigger.id });
        break;
      }
    }
  }

  destroy(): void {
    this.zones = [];
    this.firedOnce.clear();
  }
}

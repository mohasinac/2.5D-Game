import Phaser from 'phaser';
import type { MiniGameResult } from '../../types/rpgTypes.ts';

export interface EventBusEvents {
  'battle:start':      { npcId: string };
  'minigame:result':   MiniGameResult;
  'dialogue:complete': void;
  'cutscene:start':    string;
  'cutscene:complete': void;
  'rpg:warp':          { mapId: string; tileX: number; tileY: number };
  'inventory:changed': void;
  'gold:changed':      { amount: number };
  'quest:updated':     { questId: string };
}

class TypedEventBus extends Phaser.Events.EventEmitter {
  emit<K extends keyof EventBusEvents>(
    event: K,
    ...args: EventBusEvents[K] extends void ? [] : [EventBusEvents[K]]
  ): boolean {
    return super.emit(event as string, ...args);
  }

  on<K extends keyof EventBusEvents>(
    event: K,
    fn: (data: EventBusEvents[K]) => void,
    context?: unknown,
  ): this {
    return super.on(event as string, fn, context);
  }

  once<K extends keyof EventBusEvents>(
    event: K,
    fn: (data: EventBusEvents[K]) => void,
    context?: unknown,
  ): this {
    return super.once(event as string, fn, context);
  }

  off<K extends keyof EventBusEvents>(
    event: K,
    fn?: (data: EventBusEvents[K]) => void,
    context?: unknown,
  ): this {
    return super.off(event as string, fn, context);
  }
}

export const eventBus = new TypedEventBus();

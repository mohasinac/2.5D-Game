import { BaseLocalSimulation, type SimSnapshot, type SimGameEvent } from './BaseLocalSimulation';
import type { GameRoomConfig } from '../../types/gameRoom';

type OnSnapshotFn = (snap: SimSnapshot) => void;
type OnGameEventFn = (event: SimGameEvent) => void;

export class StoryBattleSimulation extends BaseLocalSimulation {
  constructor(config: Omit<GameRoomConfig, 'roomType'> & Partial<Pick<GameRoomConfig, 'roomType'>>, onSnapshot: OnSnapshotFn, onGameEvent?: OnGameEventFn) {
    super({ aiCount: 1, ...config, roomType: 'story-battle' } as GameRoomConfig, onSnapshot, onGameEvent);
  }
}

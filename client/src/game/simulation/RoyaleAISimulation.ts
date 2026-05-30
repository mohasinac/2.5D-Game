import { BaseLocalSimulation, type SimSnapshot, type SimGameEvent } from './BaseLocalSimulation';
import type { GameRoomConfig } from '../../types/gameRoom';

type OnSnapshotFn = (snap: SimSnapshot) => void;
type OnGameEventFn = (event: SimGameEvent) => void;

export class RoyaleAISimulation extends BaseLocalSimulation {
  constructor(config: Omit<GameRoomConfig, 'roomType'> & Partial<Pick<GameRoomConfig, 'roomType'>>, onSnapshot: OnSnapshotFn, onGameEvent?: OnGameEventFn) {
    super({ aiCount: 7, ...config, roomType: 'royale-ai' } as GameRoomConfig, onSnapshot, onGameEvent);
  }
}

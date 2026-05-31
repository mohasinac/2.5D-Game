export type RoomType =
  | 'tryout'
  | 'pvai'
  | 'story-battle'
  | 'tournament-ai'
  | 'royale-ai';

export interface GameRoomConfig {
  roomType: RoomType;
  beybladeId: string;
  arenaId: string;
  aiDifficulty?: 'medium' | 'hard' | 'hell';
  aiCount?: number;
  bestOf?: 1 | 3 | 5;
  tournamentId?: string;
  matchId?: string;
  spectate?: boolean;
  modifierIds?: string[];
  launcherType?: 'string' | 'ripcord';
  storyContext?: { episodeId: string; sceneIndex: number };
}

export const LOCAL_ROOM_TYPES: RoomType[] = ['tryout', 'pvai', 'story-battle', 'tournament-ai', 'royale-ai'];

export function isLocalRoom(_roomType: RoomType): boolean {
  return true;
}

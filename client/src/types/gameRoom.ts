export type RoomType =
  | 'tryout'
  | 'pvai'
  | 'pvp'
  | 'tournament'
  | 'royale'
  | 'story-battle';

export interface GameRoomConfig {
  roomType: RoomType;
  beybladeId: string;
  arenaId: string;
  is25D?: boolean;
  aiDifficulty?: 'medium' | 'hard' | 'hell';
  aiCount?: number;
  bestOf?: 1 | 3 | 5;
  tournamentId?: string;
  matchId?: string;
  pvpRoomId?: string;
  spectate?: boolean;
  modifierIds?: string[];
  launcherType?: 'string' | 'ripcord';
  storyContext?: { episodeId: string; sceneIndex: number };
}

export const LOCAL_ROOM_TYPES: RoomType[] = ['tryout', 'pvai', 'story-battle'];
export const SERVER_ROOM_TYPES: RoomType[] = ['pvp', 'tournament', 'royale'];

export function isLocalRoom(roomType: RoomType): boolean {
  return LOCAL_ROOM_TYPES.includes(roomType);
}

export const COLYSEUS_ROOM_NAME: Record<Extract<RoomType, 'pvp' | 'tournament' | 'royale'>, string> = {
  pvp: 'battle_room',
  tournament: 'tournament_battle_room',
  royale: 'royale_battle_room',
};

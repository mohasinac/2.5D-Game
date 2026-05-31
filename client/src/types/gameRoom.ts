import { ROOM_NAMES } from "@/shared/utils/gameMode";
import type { GameMode } from "@/shared/utils/gameMode";

export type RoomType =
  | 'tryout'
  | 'pvai'
  | 'pvp'
  | 'teams'
  | 'tournament'
  | 'royale'
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
  pvpRoomId?: string;
  spectate?: boolean;
  modifierIds?: string[];
  launcherType?: 'string' | 'ripcord';
  storyContext?: { episodeId: string; sceneIndex: number };
  // Private lobby support
  private?: boolean;
  roomCode?: string;
  // Team battle
  teamColor?: 'red' | 'blue';
  // Royale
  royaleSize?: 4 | 8 | 12;
}

export const LOCAL_ROOM_TYPES: RoomType[] = ['tryout', 'pvai', 'story-battle', 'tournament-ai', 'royale-ai'];
export const SERVER_ROOM_TYPES: RoomType[] = ['pvp', 'teams', 'tournament', 'royale'];

export function isLocalRoom(roomType: RoomType): boolean {
  return LOCAL_ROOM_TYPES.includes(roomType);
}

// Maps each server room type to its Colyseus room name.
// Use roomNameForConfig() instead of this map directly when you have a GameRoomConfig.
export const COLYSEUS_ROOM_NAME: Record<Extract<RoomType, 'pvp' | 'teams' | 'tournament' | 'royale'>, (mode: GameMode) => string> = {
  pvp:        (mode) => ROOM_NAMES[mode].battle,
  teams:      () => ROOM_NAMES.global.teamBattle25d,
  tournament: (mode) => ROOM_NAMES[mode].tournament,
  royale:     () => ROOM_NAMES.global.royale,
};

export function roomNameForConfig(config: GameRoomConfig): string {
  // Always use 2.5D rooms — 2D mode has been removed.
  const mode: GameMode = "2.5d";
  switch (config.roomType) {
    case 'pvp':          return ROOM_NAMES[mode].battle;
    case 'teams':        return ROOM_NAMES.global.teamBattle25d;
    case 'tournament':   return ROOM_NAMES[mode].tournament;
    case 'royale':       return ROOM_NAMES.global.royale;
    case 'pvai':         return ROOM_NAMES[mode].aiBattle;
    case 'tryout':       return ROOM_NAMES[mode].tryout;
    case 'story-battle': return ROOM_NAMES.global.story;
    default:             return ROOM_NAMES[mode].battle;
  }
}

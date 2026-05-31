// gameModeScenarios.ts
// Per-mode default configs used as fallbacks when a game room is started without
// explicit Firestore data. All values are hardcoded — no seeds required.

import type { RoomType } from '../types/gameRoom';

export interface GameModeScenario {
  roomType: RoomType;
  description: string;
  // Player defaults
  beybladeId: string;
  arenaId: string;
  // Series format
  bestOf: 1 | 3 | 5;
  // AI config (used by local simulation modes)
  aiCount: number;
  aiDifficulty: 'medium' | 'hard' | 'hell';
  // AI beyblades in rotation order — cycles when aiCount > list length
  aiBeybladeIds: string[];
  // Royale: target lobby size
  royaleSize: 4 | 8 | 12;
}

// IDs that are guaranteed to have code-level stat fallbacks in BaseLocalSimulation
const PLAYER_BEY  = 'storm_pegasus_105rf';
const AI_BEY_1    = 'dark_wolf_df145fs';
const AI_BEY_2    = 'rock_leone_lb145sb';
const AI_BEY_3    = 'earth_eagle_145wd';

export const DEFAULT_ARENA_ID = 'default_black_arena';

export const SCENARIO_MAP: Record<RoomType, GameModeScenario> = {
  // ── Local simulation modes ─────────────────────────────────────────────────

  tryout: {
    roomType:       'tryout',
    description:    'Solo practice — no opponents, no timer, free-spin training',
    beybladeId:     PLAYER_BEY,
    arenaId:        DEFAULT_ARENA_ID,
    bestOf:         1,
    aiCount:        0,
    aiDifficulty:   'medium',
    aiBeybladeIds:  [],
    royaleSize:     4,
  },

  pvai: {
    roomType:       'pvai',
    description:    '1 vs 1 against an AI opponent (Medium difficulty)',
    beybladeId:     PLAYER_BEY,
    arenaId:        DEFAULT_ARENA_ID,
    bestOf:         3,
    aiCount:        1,
    aiDifficulty:   'medium',
    aiBeybladeIds:  [AI_BEY_1, AI_BEY_2, AI_BEY_3],
    royaleSize:     4,
  },

  'story-battle': {
    roomType:       'story-battle',
    description:    'Story mode episode battle — scripted AI opponent',
    beybladeId:     PLAYER_BEY,
    arenaId:        DEFAULT_ARENA_ID,
    bestOf:         1,
    aiCount:        1,
    aiDifficulty:   'medium',
    aiBeybladeIds:  [AI_BEY_1],
    royaleSize:     4,
  },

  'tournament-ai': {
    roomType:       'tournament-ai',
    description:    'Solo vs AI bracket tournament — difficulty scales by round',
    beybladeId:     PLAYER_BEY,
    arenaId:        DEFAULT_ARENA_ID,
    bestOf:         3,
    aiCount:        3,  // number of rounds (total opponents in bracket)
    aiDifficulty:   'medium',
    aiBeybladeIds:  [AI_BEY_1, AI_BEY_2, AI_BEY_3],
    royaleSize:     4,
  },

  'royale-ai': {
    roomType:       'royale-ai',
    description:    'Battle Royale — 1 human vs 7 AI opponents, last bey standing',
    beybladeId:     PLAYER_BEY,
    arenaId:        DEFAULT_ARENA_ID,
    bestOf:         1,
    aiCount:        7,
    aiDifficulty:   'medium',
    aiBeybladeIds:  [AI_BEY_1, AI_BEY_2, AI_BEY_3, AI_BEY_1, AI_BEY_2, AI_BEY_3, AI_BEY_1],
    royaleSize:     8,
  },

};

/**
 * Returns the scenario for the given room type, or the tryout scenario as a
 * safe default when the room type is unrecognised.
 */
export function getScenario(roomType: RoomType | undefined): GameModeScenario {
  if (!roomType || !(roomType in SCENARIO_MAP)) return SCENARIO_MAP.tryout;
  return SCENARIO_MAP[roomType];
}

/**
 * Merges caller-supplied config fields on top of the scenario defaults so every
 * field is always defined. Caller values win; scenario values fill the gaps.
 */
export function applyScenarioDefaults(
  roomType: RoomType,
  config: Partial<{
    beybladeId: string;
    arenaId: string;
    bestOf: 1 | 3 | 5;
    aiCount: number;
    aiDifficulty: 'medium' | 'hard' | 'hell';
    royaleSize: 4 | 8 | 12;
  }>,
): Required<typeof config> & { royaleSize: 4 | 8 | 12 } {
  const s = getScenario(roomType);
  return {
    beybladeId:   config.beybladeId   || s.beybladeId,
    arenaId:      config.arenaId      || s.arenaId,
    bestOf:       config.bestOf       ?? s.bestOf,
    aiCount:      config.aiCount      ?? s.aiCount,
    aiDifficulty: config.aiDifficulty ?? s.aiDifficulty,
    royaleSize:   config.royaleSize   ?? s.royaleSize,
  };
}

// Client-side mirror of server/shared/utils/matchmakingFilters.ts.
// These are the filter options passed to Colyseus joinOrCreate() so that
// players with different preferences land in separate rooms.

export interface BattleRoomFilter {
  size: 2 | 3 | 4;
  bestOf: 1 | 3 | 5;
  modifierKey: string;
}

export interface TeamBattleRoomFilter {
  teamSize: 2;
  bestOf: 1 | 3 | 5;
}

export interface RoyaleRoomFilter {
  size: 4 | 8 | 12;
}

export function buildModifierKey(modifierIds: string[]): string {
  return [...modifierIds].sort().join(",");
}

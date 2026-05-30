// Typed contracts for Colyseus filterBy() options.
// Client join options must include these fields so players land in compatible rooms.
// Keep each interface flat — Colyseus filterBy only supports top-level string/number keys.

export interface BattleRoomFilter {
  /** Target human player count: 2 = 1v1, 3 = FFA-3, 4 = FFA-4 */
  size: 2 | 3 | 4;
  bestOf: 1 | 3 | 5;
  /** Sorted modifier IDs joined by comma, or "" for no modifiers */
  modifierKey: string;
}

export interface TeamBattleRoomFilter {
  /** Always 2 — two teams of two */
  teamSize: 2;
  bestOf: 1 | 3 | 5;
}

export interface RoyaleRoomFilter {
  /** Target lobby size: 4 / 8 / 12 players */
  size: 4 | 8 | 12;
}

// Helper: build a stable modifier key from an array of modifier IDs.
export function buildModifierKey(modifierIds: string[]): string {
  return [...modifierIds].sort().join(",");
}

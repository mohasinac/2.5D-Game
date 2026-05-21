// Discriminator for the two parallel pipelines. Strict separation:
// classic 2D and 2.5D parts-based are never confused at runtime.

export type GameMode = "2d" | "2.5d";

export function isGameMode(value: unknown): value is GameMode {
  return value === "2d" || value === "2.5d";
}

// Canonical Colyseus room names per mode. Used by server registration and client join.
export const ROOM_NAMES = {
  "2d": {
    tryout: "tryout_2d_room",
    battle: "battle_2d_room",
    aiBattle: "ai_battle_2d_room",
    tournament: "tournament_battle_2d_room",
  },
  "2.5d": {
    tryout: "tryout_25d_room",
    battle: "battle_25d_room",
    aiBattle: "ai_battle_25d_room",
    tournament: "tournament_battle_25d_room",
  },
} as const;

export type RoomFlavor = keyof typeof ROOM_NAMES["2d"];

export function roomNameFor(mode: GameMode, flavor: RoomFlavor): string {
  return ROOM_NAMES[mode][flavor];
}

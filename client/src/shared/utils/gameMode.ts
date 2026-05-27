// Client-side mirror of src/shared/utils/gameMode.ts.
// Kept in sync by convention. If you change one, change the other.

export type GameMode = "2d" | "2.5d";

export function isGameMode(value: unknown): value is GameMode {
  return value === "2d" || value === "2.5d";
}

// Canonical Colyseus room names per mode — must match server registration in src/index.ts.
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

// Derive mode from a URL pathname. Used by game pages to support both
// /game/2d/... and /game/2.5d/... routing. Falls back to "2d" for legacy
// URLs (/game/battle/:id, etc.) so existing bookmarks keep working.
export function modeFromPath(pathname: string): GameMode {
  if (pathname.includes("/2.5d/") || pathname.includes("/25d/")) return "2.5d";
  return "2d"; // default — preserves backwards-compat with legacy /game/battle/... bookmarks
}

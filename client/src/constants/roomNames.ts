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
  global: {
    royale: "royale_battle_room",
    teamBattle: "team_battle_room",
    teamBattle25d: "parts25d_team_battle_room",
    story: "story_battle_room",
  },
} as const;

export type GameMode = "2d" | "2.5d";
export type RoomFlavor = keyof typeof ROOM_NAMES["2d"];
export type GlobalRoomFlavor = keyof typeof ROOM_NAMES["global"];

export function roomNameFor(mode: GameMode, flavor: RoomFlavor): string {
  return ROOM_NAMES[mode][flavor];
}

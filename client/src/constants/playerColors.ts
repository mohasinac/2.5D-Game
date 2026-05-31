/**
 * Player slot colors — 6 distinct, high-contrast, colorblind-friendly.
 * Slot 0 is always blue (own player). Slots 1–5 are opponents/teammates.
 */
export const PLAYER_SLOT_COLORS: Record<number, string> = {
  0: "#3B82F6", // blue   — own player
  1: "#EF4444", // red
  2: "#22C55E", // green
  3: "#F59E0B", // amber
  4: "#A855F7", // purple
  5: "#EC4899", // pink
};

/** Team colors for 2v2 mode (even slots = team A, odd slots = team B). */
export const TEAM_COLORS: Record<"A" | "B", string> = {
  A: "#3B82F6", // blue team
  B: "#EF4444", // red team
};

/** Returns the slot color hex for a given slot index (wraps after 5). */
export function getSlotColor(slotIndex: number): string {
  return PLAYER_SLOT_COLORS[slotIndex % Object.keys(PLAYER_SLOT_COLORS).length] ?? "#FFFFFF";
}

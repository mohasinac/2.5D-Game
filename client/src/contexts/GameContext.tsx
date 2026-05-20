// Re-exports the Zustand-backed store so all existing imports from
// "@/contexts/GameContext" continue to work without changes.
export type { GameSettings } from "@/stores/gameStore";
export { GameProvider, useGame, useGameStore, defaultSettings } from "@/stores/gameStore";

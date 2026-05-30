// Re-exports from refactored simulation hierarchy.
// LocalGameSimulation is an alias for BaseLocalSimulation for backward compatibility.
export { BaseLocalSimulation as LocalGameSimulation } from './BaseLocalSimulation';
export type {
  SimStatus,
  SimPhase,
  SimSnapshot,
  SimGameEvent,
  TournamentBracketInfo,
} from './BaseLocalSimulation';

export { TryoutSimulation } from './TryoutSimulation';
export { AIBattleSimulation } from './AIBattleSimulation';
export { StoryBattleSimulation } from './StoryBattleSimulation';
export { TournamentAISimulation } from './TournamentAISimulation';
export { RoyaleAISimulation } from './RoyaleAISimulation';

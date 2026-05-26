// Combat AI output → intent layer input
export interface BladerIntent {
  targetBeyId: string | null;
  movementBias: 'rush' | 'orbit' | 'center' | 'edge' | 'retreat' | 'counter';
  aggression: number;         // 0–1; scales input force magnitude
  useSpecial: boolean;
  useCombo: string | null;    // combo id or null
  launchParams?: {            // only used pre-launch
    power: number;            // 0–150
    angle: number;            // -45–+45°
    position: number;         // 0–1
  };
}

// Bey Control AI output → server input
export interface ControlRequest {
  intent: BladerIntent;
  beyId: string;
  obedienceFactor: number;    // 0–1; from BeyPersonality.obedience × bond multiplier
  executedBitmask: number;    // final uint16 sent to server
}

// Per-tick game snapshot for AI consumption
export interface AIGameSnapshot {
  tick: number;
  beyblades: Map<string, AIBeyState>;   // from Colyseus state
  arenaRadius: number;
  arenaCenterX: number;
  arenaCenterY: number;
}

export interface AIBeyState {
  id: string;
  userId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  maxSpin: number;
  isAlive: boolean;
  tiltAngle: number;
}

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'hell';

export interface DifficultyProfile {
  tickIntervalMs: number;
  reactionDelayMs: number;
  errorRate: number;
  predictionTicks: number;
  usesPatternLearning: boolean;
}

export const DIFFICULTY_PROFILES: Record<AIDifficulty, DifficultyProfile> = {
  easy:   { tickIntervalMs: 600, reactionDelayMs: 400, errorRate: 0.30, predictionTicks: 0,  usesPatternLearning: false },
  medium: { tickIntervalMs: 300, reactionDelayMs: 200, errorRate: 0.10, predictionTicks: 3,  usesPatternLearning: false },
  hard:   { tickIntervalMs: 150, reactionDelayMs: 80,  errorRate: 0.03, predictionTicks: 6,  usesPatternLearning: false },
  hell:   { tickIntervalMs: 80,  reactionDelayMs: 30,  errorRate: 0.00, predictionTicks: 10, usesPatternLearning: true  },
};

export type TeamRole = 'attacker' | 'protector' | 'stamina' | 'bait' | 'free';

export interface TeamMessage {
  fromId: string;
  type: 'claim_target' | 'need_support' | 'protect_ally' | 'move_formation';
  data: Record<string, unknown>;
}

export type EmotionState = 'calm' | 'excited' | 'frustrated' | 'desperate';

export type InstinctPattern = 'wild' | 'flower' | 'center_pull' | 'wall_ride' | 'rail_orbit' | 'balanced' | 'free' | 'defensive';

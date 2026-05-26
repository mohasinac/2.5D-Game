import type { InstinctPattern } from './AITypes';

export interface CharacterProfile {
  aggression: number;     // 0–1
  counterBias: number;    // 0–1
  risk: number;           // 0–1
  rushBias: number;       // 0–1
  specialTiming: 'early' | 'mid' | 'late';
  supportBias: number;    // 0–1
}

export interface BondBehavior {
  minBond: number;
  behavior: string;
  effect: string;
}

export interface BeyPersonalityData {
  aggression: number;      // 0–100
  obedience: number;       // 0–100
  rushBias: number;        // 0–100
  specialBias: number;     // 0–100
  centerControl: number;   // 0–100
  instinct: InstinctPattern;
  bondBehaviors: BondBehavior[];
}

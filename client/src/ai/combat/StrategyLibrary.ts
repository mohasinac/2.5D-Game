import type { BladerIntent, AIBeyState } from '../types/AITypes';

export type StrategyName = 'rush' | 'counter' | 'stall' | 'orbit' | 'edge_push' | 'center_hold' | 'retreat';

export interface StrategyConfig {
  movementBias: BladerIntent['movementBias'];
  baseAggression: number;
  preferredDistance: number;  // px from target
  specialCondition: (self: AIBeyState, target: AIBeyState) => boolean;
}

export const STRATEGIES: Record<StrategyName, StrategyConfig> = {
  rush: {
    movementBias: 'rush',
    baseAggression: 0.9,
    preferredDistance: 50,
    specialCondition: (self, target) => target.spin / target.maxSpin < 0.5,
  },
  counter: {
    movementBias: 'counter',
    baseAggression: 0.5,
    preferredDistance: 150,
    specialCondition: (_self, target) => target.spin / target.maxSpin < 0.3,
  },
  stall: {
    movementBias: 'center',
    baseAggression: 0.1,
    preferredDistance: 300,
    specialCondition: (self) => self.spin / self.maxSpin < 0.4,
  },
  orbit: {
    movementBias: 'orbit',
    baseAggression: 0.4,
    preferredDistance: 120,
    specialCondition: (self) => self.spin / self.maxSpin < 0.3,
  },
  edge_push: {
    movementBias: 'edge',
    baseAggression: 0.8,
    preferredDistance: 80,
    specialCondition: (_self, target) => {
      const distFromCenter = Math.sqrt(target.x * target.x + target.y * target.y);
      return distFromCenter > 200;
    },
  },
  center_hold: {
    movementBias: 'center',
    baseAggression: 0.3,
    preferredDistance: 200,
    specialCondition: (self) => self.spin / self.maxSpin < 0.5,
  },
  retreat: {
    movementBias: 'retreat',
    baseAggression: 0.0,
    preferredDistance: 400,
    specialCondition: () => false,
  },
};

export function selectStrategy(
  selfSpin: number,
  selfMaxSpin: number,
  targetDistFromEdge: number,
  aggression: number,
  counterBias: number
): StrategyName {
  const spinRatio = selfSpin / selfMaxSpin;
  if (spinRatio < 0.2) return 'retreat';
  if (spinRatio < 0.4) return 'stall';
  if (targetDistFromEdge < 100 && aggression > 0.6) return 'edge_push';
  if (counterBias > 0.7) return 'counter';
  if (aggression > 0.8) return 'rush';
  return 'orbit';
}

import type { BladerIntent, AIGameSnapshot, AIBeyState, AIDifficulty } from '../types/AITypes';
import type { CharacterProfile } from '../types/CharacterTypes';
import { getDifficultyProfile, shouldMakeError, predictPosition } from './DifficultyModifiers';
import { getCharacterProfile } from './CharacterProfiles';
import { selectStrategy, STRATEGIES } from './StrategyLibrary';
import { OpponentMemory } from './OpponentMemory';

export class CombatAI {
  private character: CharacterProfile;
  private difficulty: AIDifficulty;
  private memory: OpponentMemory;
  private lastDecisionTick: number = 0;
  private currentIntent: BladerIntent;
  private beyId: string;

  constructor(beyId: string, characterName: string, difficulty: AIDifficulty) {
    this.beyId = beyId;
    this.character = getCharacterProfile(characterName);
    this.difficulty = difficulty;
    this.memory = new OpponentMemory();
    this.currentIntent = this.defaultIntent();
  }

  private defaultIntent(): BladerIntent {
    return {
      targetBeyId: null,
      movementBias: 'center',
      aggression: this.character.aggression,
      useSpecial: false,
      useCombo: null,
    };
  }

  computeLaunchParams(): BladerIntent['launchParams'] {
    const profile = getDifficultyProfile(this.difficulty);
    const basePower = 90 + Math.random() * 30;
    const errorPower = shouldMakeError(profile.errorRate) ? (Math.random() - 0.5) * 40 : 0;
    return {
      power: Math.min(150, Math.max(50, basePower + errorPower)),
      angle: (Math.random() - 0.5) * 20,
      position: 0.3 + Math.random() * 0.4,
    };
  }

  update(snapshot: AIGameSnapshot): BladerIntent {
    const profile = getDifficultyProfile(this.difficulty);
    if (snapshot.tick - this.lastDecisionTick < profile.tickIntervalMs / 16.67) {
      return this.currentIntent;
    }
    this.lastDecisionTick = snapshot.tick;

    const self = snapshot.beyblades.get(this.beyId);
    if (!self || !self.isAlive) return this.defaultIntent();

    // Select target
    const target = this.selectTarget(snapshot, self);
    if (!target) {
      this.currentIntent = { ...this.defaultIntent(), movementBias: 'center' };
      return this.currentIntent;
    }

    // Record opponent for pattern learning (Hell mode)
    if (profile.usesPatternLearning) {
      this.memory.record(target.id, snapshot.tick, 0, target.x, target.y, target.vx, target.vy);
    }

    // Predict target position
    const predicted = predictPosition(target.x, target.y, target.vx, target.vy, profile.predictionTicks);
    const dx = predicted.x - self.x;
    const dy = predicted.y - self.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Edge distance calculation
    const targetDistFromCenter = Math.sqrt(target.x * target.x + target.y * target.y);
    const targetDistFromEdge = snapshot.arenaRadius - targetDistFromCenter;

    // Select strategy
    const strategyName = selectStrategy(
      self.spin, self.maxSpin,
      targetDistFromEdge,
      this.character.aggression,
      this.character.counterBias
    );
    const strategy = STRATEGIES[strategyName];

    // Apply error
    let aggression = strategy.baseAggression * this.character.aggression;
    if (shouldMakeError(profile.errorRate)) {
      aggression = Math.random();
    }

    // Special timing
    const spinRatio = self.spin / self.maxSpin;
    let useSpecial = false;
    if (this.character.specialTiming === 'early' && spinRatio > 0.7) useSpecial = true;
    if (this.character.specialTiming === 'mid' && spinRatio < 0.5 && spinRatio > 0.3) useSpecial = true;
    if (this.character.specialTiming === 'late' && spinRatio < 0.3) useSpecial = true;

    this.currentIntent = {
      targetBeyId: target.id,
      movementBias: strategy.movementBias,
      aggression,
      useSpecial,
      useCombo: dist < 100 && aggression > 0.7 ? 'quick-dash-r' : null,
    };

    return this.currentIntent;
  }

  private selectTarget(snapshot: AIGameSnapshot, self: AIBeyState): AIBeyState | null {
    let bestTarget: AIBeyState | null = null;
    let bestScore = -Infinity;

    for (const [, bey] of snapshot.beyblades) {
      if (bey.id === self.id || !bey.isAlive || bey.userId === self.userId) continue;
      const dx = bey.x - self.x;
      const dy = bey.y - self.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spinRatio = bey.spin / bey.maxSpin;
      const score = (1 - spinRatio) * 100 - dist * 0.5;
      if (score > bestScore) {
        bestScore = score;
        bestTarget = bey;
      }
    }
    return bestTarget;
  }

  getMemory(): OpponentMemory {
    return this.memory;
  }

  destroy(): void {
    this.memory.clear();
  }
}

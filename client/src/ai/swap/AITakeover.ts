import type { BladerIntent, AIBeyState } from '../types/AITypes';

export class AITakeover {
  static createIntentFromCurrentState(bey: AIBeyState): BladerIntent {
    const speed = Math.sqrt(bey.vx * bey.vx + bey.vy * bey.vy);
    let movementBias: BladerIntent['movementBias'] = 'center';

    if (speed > 2.0) {
      const distFromCenter = Math.sqrt(bey.x * bey.x + bey.y * bey.y);
      if (distFromCenter > 150) movementBias = 'edge';
      else movementBias = 'rush';
    } else if (speed < 0.5) {
      movementBias = 'center';
    } else {
      movementBias = 'orbit';
    }

    return {
      targetBeyId: null,
      movementBias,
      aggression: 0.5,
      useSpecial: false,
      useCombo: null,
    };
  }

  static smoothTransition(
    prevBitmask: number,
    newBitmask: number,
    transitionProgress: number // 0–1
  ): number {
    if (transitionProgress >= 1.0) return newBitmask;
    // During transition, blend movement bits from old to new
    // Keep action bits (attack/defense/special) from new
    const movementMask = 0x0F; // bits 0-3
    const actionBits = newBitmask & ~movementMask;

    if (transitionProgress < 0.5) {
      return (prevBitmask & movementMask) | actionBits;
    }
    return newBitmask;
  }
}

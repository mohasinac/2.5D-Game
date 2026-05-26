import type { BeyPersonalityData } from '../types/CharacterTypes';
import type { BladerIntent } from '../types/AITypes';

export function applyBitBeastInfluence(
  intent: BladerIntent,
  personality: BeyPersonalityData,
  bondLevel: number
): BladerIntent {
  const modified = { ...intent };

  // Bit beast personality overrides at high bond
  if (bondLevel >= 0.6) {
    const personalityAggression = personality.aggression / 100;
    modified.aggression = modified.aggression * 0.7 + personalityAggression * 0.3;
  }

  // Center control influence
  if (personality.centerControl > 70 && modified.movementBias === 'rush') {
    if (Math.random() < (personality.centerControl - 70) / 100) {
      modified.movementBias = 'orbit';
    }
  }

  // Special bias influence
  if (personality.specialBias > 80 && !modified.useSpecial) {
    if (Math.random() < (personality.specialBias - 80) / 200) {
      modified.useSpecial = true;
    }
  }

  return modified;
}

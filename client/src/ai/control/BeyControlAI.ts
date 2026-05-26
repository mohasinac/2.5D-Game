import type { BladerIntent, AIBeyState, AIGameSnapshot } from '../types/AITypes';
import type { BeyPersonalityData } from '../types/CharacterTypes';
import { computeInstinctBitmask } from './InstinctSystem';
import { EmotionSystem } from './EmotionSystem';
import { applyBitBeastInfluence } from './BitBeastInfluence';

const BIT_LEFT = 1 << 0;
const BIT_RIGHT = 1 << 1;
const BIT_UP = 1 << 2;
const BIT_DOWN = 1 << 3;
const BIT_ATTACK = 1 << 4;
const BIT_DEFENSE = 1 << 5;
const BIT_DODGE = 1 << 6;
const BIT_JUMP = 1 << 7;
const BIT_SPECIAL = 1 << 9;

export class BeyControlAI {
  private personality: BeyPersonalityData;
  private emotion: EmotionSystem;
  private beyId: string;
  private bondLevel: number = 0;

  constructor(beyId: string, personality: BeyPersonalityData) {
    this.beyId = beyId;
    this.personality = personality;
    this.emotion = new EmotionSystem();
  }

  setBondLevel(level: number): void {
    this.bondLevel = level;
  }

  getEmotion(): EmotionSystem {
    return this.emotion;
  }

  computeBitmask(intent: BladerIntent, snapshot: AIGameSnapshot): number {
    const self = snapshot.beyblades.get(this.beyId);
    if (!self || !self.isAlive) return 0;

    this.emotion.tick(self.spin / self.maxSpin);

    const obedience = (this.personality.obedience / 100) *
      (0.5 + this.bondLevel * 0.5) *
      this.emotion.getObedienceModifier();

    // Check if bey disobeys — use instinct instead
    if (Math.random() > obedience) {
      return computeInstinctBitmask(
        this.personality.instinct,
        self,
        snapshot.tick,
        snapshot.arenaRadius
      ).bitmask;
    }

    const modified = applyBitBeastInfluence(intent, this.personality, this.bondLevel);
    return this.translateIntentToBitmask(modified, self, snapshot);
  }

  private translateIntentToBitmask(intent: BladerIntent, self: AIBeyState, snapshot: AIGameSnapshot): number {
    let bitmask = 0;

    if (intent.targetBeyId) {
      const target = snapshot.beyblades.get(intent.targetBeyId);
      if (target && target.isAlive) {
        const dx = target.x - self.x;
        const dy = target.y - self.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        switch (intent.movementBias) {
          case 'rush':
            if (dx > 10) bitmask |= BIT_RIGHT;
            else if (dx < -10) bitmask |= BIT_LEFT;
            if (dy > 10) bitmask |= BIT_DOWN;
            else if (dy < -10) bitmask |= BIT_UP;
            if (dist < 120) bitmask |= BIT_ATTACK;
            break;
          case 'orbit': {
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            bitmask |= Math.cos(angle) > 0 ? BIT_RIGHT : BIT_LEFT;
            bitmask |= Math.sin(angle) > 0 ? BIT_DOWN : BIT_UP;
            if (dist < 100) bitmask |= BIT_ATTACK;
            break;
          }
          case 'counter':
            bitmask |= BIT_DEFENSE;
            if (dist < 80) {
              bitmask |= BIT_ATTACK;
              bitmask |= BIT_DODGE;
            }
            break;
          case 'retreat':
            if (dx > 0) bitmask |= BIT_LEFT;
            else bitmask |= BIT_RIGHT;
            if (dy > 0) bitmask |= BIT_UP;
            else bitmask |= BIT_DOWN;
            bitmask |= BIT_DEFENSE;
            break;
          case 'edge':
            if (dx > 10) bitmask |= BIT_RIGHT;
            else if (dx < -10) bitmask |= BIT_LEFT;
            if (dy > 10) bitmask |= BIT_DOWN;
            else if (dy < -10) bitmask |= BIT_UP;
            bitmask |= BIT_ATTACK;
            break;
          case 'center':
          default:
            if (self.x > 20) bitmask |= BIT_LEFT;
            else if (self.x < -20) bitmask |= BIT_RIGHT;
            if (self.y > 20) bitmask |= BIT_UP;
            else if (self.y < -20) bitmask |= BIT_DOWN;
            break;
        }
      }
    } else {
      // No target — go to center
      if (self.x > 20) bitmask |= BIT_LEFT;
      else if (self.x < -20) bitmask |= BIT_RIGHT;
      if (self.y > 20) bitmask |= BIT_UP;
      else if (self.y < -20) bitmask |= BIT_DOWN;
    }

    if (intent.useSpecial) bitmask |= BIT_SPECIAL;
    if (intent.useCombo) bitmask |= BIT_JUMP;

    return bitmask;
  }

  onDamageTaken(): void { this.emotion.onDamageTaken(); }
  onDamageDealt(): void { this.emotion.onDamageDealt(); }
  onMiss(): void { this.emotion.onMiss(); }

  destroy(): void {
    this.emotion.reset();
  }
}

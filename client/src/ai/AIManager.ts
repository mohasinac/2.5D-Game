import type { AIGameSnapshot, AIDifficulty } from './types/AITypes';
import { CombatAI } from './combat/CombatAI';
import { loadCharacterProfiles } from './combat/CharacterProfiles';
import { loadDifficultyProfiles } from './combat/DifficultyModifiers';
import { TeamAI } from './combat/TeamAI';
import { BeyControlAI } from './control/BeyControlAI';
import { BondSystem } from './control/BondSystem';
import { getBeyPersonality, loadBeyPersonalities } from './control/BeyPersonalities';
import { ControlManager } from './swap/ControlManager';
import { PossessionSystem } from './swap/PossessionSystem';

interface AIBeyEntry {
  beyId: string;
  userId: string;
  combatAI: CombatAI;
  controlAI: BeyControlAI;
  characterName: string;
  beyPersonalityName: string;
}

export class AIManager {
  private entries: Map<string, AIBeyEntry> = new Map();
  private teamAI: TeamAI;
  private bondSystem: BondSystem;
  private controlManager: ControlManager;
  private possession: PossessionSystem;
  private difficulty: AIDifficulty;
  private sendInput: (beyId: string, bitmask: number) => void;

  constructor(
    difficulty: AIDifficulty,
    sendInput: (beyId: string, bitmask: number) => void
  ) {
    this.difficulty = difficulty;
    this.sendInput = sendInput;
    this.teamAI = new TeamAI();
    this.bondSystem = new BondSystem();
    this.controlManager = new ControlManager();
    this.possession = new PossessionSystem();

    this.controlManager.onSwap((oldBeyId, _newBeyId) => {
      if (oldBeyId) {
        this.possession.revokePlayerControl(oldBeyId);
      }
      this.possession.grantPlayerControl(_newBeyId);
    });
  }

  async init(): Promise<void> {
    await Promise.all([
      loadCharacterProfiles(),
      loadBeyPersonalities(),
      loadDifficultyProfiles(),
    ]);
  }

  registerAIBey(
    beyId: string,
    userId: string,
    characterName: string,
    beyPersonalityName: string
  ): void {
    const personality = getBeyPersonality(beyPersonalityName);
    const combatAI = new CombatAI(beyId, characterName, this.difficulty);
    const controlAI = new BeyControlAI(beyId, personality);

    const bond = this.bondSystem.getBond(userId, beyId);
    controlAI.setBondLevel(bond);

    this.entries.set(beyId, {
      beyId,
      userId,
      combatAI,
      controlAI,
      characterName,
      beyPersonalityName,
    });

    this.controlManager.registerBey(beyId, 'ai');
    this.teamAI.addMember(beyId, userId, combatAI);
  }

  setPlayerBey(beyId: string): void {
    this.controlManager.setPlayerBey(beyId);
    this.possession.grantPlayerControl(beyId);
  }

  update(snapshot: AIGameSnapshot): void {
    this.teamAI.update(snapshot);

    for (const [beyId, entry] of this.entries) {
      if (this.controlManager.isPlayerControlled(beyId)) continue;

      const bey = snapshot.beyblades.get(beyId);
      if (!bey || !bey.isAlive) continue;

      const intent = entry.combatAI.update(snapshot);
      const bitmask = entry.controlAI.computeBitmask(intent, snapshot);
      this.sendInput(beyId, bitmask);
    }
  }

  handleSwap(userId: string, allBeys: Map<string, { userId: string; isAlive: boolean }>): void {
    this.controlManager.cycleToNext(userId, allBeys);

    const newPlayerBeyId = this.controlManager.getPlayerBeyId();
    if (newPlayerBeyId) {
      const _entry = this.entries.get(newPlayerBeyId);
      if (_entry) {
        // Player taking over — no AI update needed for this bey
      }
    }
  }

  onBeyDamageTaken(beyId: string): void {
    this.entries.get(beyId)?.controlAI.onDamageTaken();
  }

  onBeyDamageDealt(beyId: string): void {
    this.entries.get(beyId)?.controlAI.onDamageDealt();
  }

  onMatchEnd(winnerId: string): void {
    for (const [beyId, entry] of this.entries) {
      if (beyId === winnerId) {
        this.bondSystem.onWin(entry.userId, beyId);
      } else {
        this.bondSystem.onLoss(entry.userId, beyId);
      }
    }
  }

  getControlManager(): ControlManager {
    return this.controlManager;
  }

  getBondSystem(): BondSystem {
    return this.bondSystem;
  }

  destroy(): void {
    for (const entry of this.entries.values()) {
      entry.combatAI.destroy();
      entry.controlAI.destroy();
    }
    this.entries.clear();
    this.controlManager.destroy();
    this.possession.clear();
  }
}

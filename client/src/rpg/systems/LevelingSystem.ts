import type { LevelingConfig, GateCondition, GateCheckResult } from "../data/schemas";
import { evaluateGateCondition } from "../utils/flagUtils";
import { MAX_PLAYER_LEVEL, MAX_BEYBLADE_LEVEL } from "../constants/rpgConstants";

export class LevelingSystem {
  private config: LevelingConfig = {
    xpCurve: [],
    maxPlayerLevel: MAX_PLAYER_LEVEL,
    maxBeybladeLevel: MAX_BEYBLADE_LEVEL,
  };

  loadConfig(cfg: LevelingConfig): void {
    this.config = cfg;
  }

  getPlayerLevel(totalXP: number): number {
    let level = 1;
    for (let i = 0; i < this.config.xpCurve.length; i++) {
      if (totalXP >= this.config.xpCurve[i]) level = i + 2;
      else break;
    }
    return Math.min(level, this.config.maxPlayerLevel);
  }

  getBeybladeLevel(totalXP: number): number {
    let level = 1;
    for (let i = 0; i < this.config.xpCurve.length; i++) {
      if (totalXP >= this.config.xpCurve[i]) level = i + 2;
      else break;
    }
    return Math.min(level, this.config.maxBeybladeLevel);
  }

  getXPToNextLevel(totalXP: number): number {
    const level = this.getPlayerLevel(totalXP);
    if (level >= this.config.maxPlayerLevel) return 0;
    const nextThreshold = this.config.xpCurve[level - 1];
    return nextThreshold != null ? nextThreshold - totalXP : 0;
  }

  checkGate(
    gate: GateCondition,
    flags: Record<string, boolean>,
    playerLevel: number,
    beybladeLevels: Record<string, number>,
    earnedBadges: string[],
    defeatedNPCs: Record<string, boolean>
  ): GateCheckResult {
    return evaluateGateCondition(
      gate, flags, playerLevel, beybladeLevels, earnedBadges, defeatedNPCs
    );
  }

  getConfig(): LevelingConfig {
    return this.config;
  }
}

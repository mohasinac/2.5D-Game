import type { LevelingConfig, GateCondition, GateCheckResult } from "../data/schemas";
import { evaluateGateCondition } from "../utils/flagUtils";
import { MAX_PLAYER_LEVEL, MAX_BEYBLADE_LEVEL } from "../constants/rpgConstants";

export class LevelingSystem {
  private config: LevelingConfig = {
    xpCurve: [],
    maxPlayerLevel: MAX_PLAYER_LEVEL,
    maxBeybladeLevel: MAX_BEYBLADE_LEVEL,
  };
  /**
   * Active arc-level cap. When set, getPlayerLevel never returns a value above
   * this ceiling even if XP would warrant a higher level. Cleared between arcs.
   */
  private arcLevelCap: number | null = null;

  loadConfig(cfg: LevelingConfig): void {
    this.config = cfg;
  }

  // ── Arc cap ─────────────────────────────────────────────────────────────────

  setArcLevelCap(cap: number | null): void {
    this.arcLevelCap = cap;
  }

  getArcLevelCap(): number | null {
    return this.arcLevelCap;
  }

  // ── Level computation ───────────────────────────────────────────────────────

  getPlayerLevel(totalXP: number): number {
    let level = 1;
    for (let i = 0; i < this.config.xpCurve.length; i++) {
      if (totalXP >= this.config.xpCurve[i]) level = i + 2;
      else break;
    }
    const hardCap = this.config.maxPlayerLevel;
    const arcCap = this.arcLevelCap;
    const effectiveCap = arcCap != null ? Math.min(hardCap, arcCap) : hardCap;
    return Math.min(level, effectiveCap);
  }

  getBeybladeLevel(totalXP: number): number {
    let level = 1;
    for (let i = 0; i < this.config.xpCurve.length; i++) {
      if (totalXP >= this.config.xpCurve[i]) level = i + 2;
      else break;
    }
    return Math.min(level, this.config.maxBeybladeLevel);
  }

  /**
   * XP needed to reach the next level, respecting the arc cap.
   * Returns 0 if already at or above the cap.
   */
  getXPToNextLevel(totalXP: number): number {
    const level = this.getPlayerLevel(totalXP);
    const hardCap = this.config.maxPlayerLevel;
    const arcCap = this.arcLevelCap;
    const effectiveCap = arcCap != null ? Math.min(hardCap, arcCap) : hardCap;
    if (level >= effectiveCap) return 0;
    const nextThreshold = this.config.xpCurve[level - 1];
    return nextThreshold != null ? nextThreshold - totalXP : 0;
  }

  /**
   * Returns true when the player has hit the arc cap.
   * Used by HUD to show "Arc Cap" instead of a progress bar.
   */
  isAtArcCap(totalXP: number): boolean {
    if (this.arcLevelCap == null) return false;
    return this.getPlayerLevel(totalXP) >= this.arcLevelCap;
  }

  // ── Gate check ──────────────────────────────────────────────────────────────

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

  // ── Stat normalisation helper ────────────────────────────────────────────────

  /**
   * Returns a 0–1 normalised power fraction for a given level within the arc.
   * Used by StoryBattleRoom to scale AI spin/stats proportionally.
   *
   * Examples (arcCap = 20):
   *   level  5 → 0.25   (early arc, AI is easy)
   *   level 10 → 0.50   (mid arc)
   *   level 20 → 1.00   (arc boss tier)
   */
  normalisedPower(level: number): number {
    const cap = this.arcLevelCap ?? this.config.maxPlayerLevel;
    if (cap <= 1) return 1;
    return Math.min(1, Math.max(0, (level - 1) / (cap - 1)));
  }
}


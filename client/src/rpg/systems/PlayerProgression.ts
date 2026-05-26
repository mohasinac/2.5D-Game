import type { BattleResult } from "../data/schemas";
import type { RPGStore } from "../stores/rpgStore";
import type { QuestSystem } from "./QuestSystem";
import type { BadgeSystem } from "./BadgeSystem";

export class PlayerProgression {
  constructor(
    private store: () => RPGStore,
    private questSystem: QuestSystem,
    private badgeSystem: BadgeSystem
  ) {}

  getReputationTier(): "pariah" | "unknown" | "known" | "respected" | "legend" {
    const rep = this.store().reputation;
    if (rep < -50) return "pariah";
    if (rep < 10)  return "unknown";
    if (rep < 30)  return "known";
    if (rep < 70)  return "respected";
    return "legend";
  }

  applyBattleResult(
    result: BattleResult,
    npcId: string,
    xpReward?: { playerXP?: number; beybladeXP?: number; beybladeXPTarget?: string }
  ): void {
    const s = this.store();
    s.applyBattleResult(result);

    if (result.outcome === "win" && xpReward) {
      if (xpReward.playerXP) s.addPlayerXP(xpReward.playerXP);
      if (xpReward.beybladeXP) {
        const target = xpReward.beybladeXPTarget ?? s.equippedBeybladeId;
        if (target) s.addBeybladeXP(target, xpReward.beybladeXP);
      }
    }

    // Award NPC-defeat badges
    if (result.outcome === "win") {
      const badges = this.badgeSystem.getBadgesForNPCDefeat(npcId);
      badges.forEach((b) => s.awardBadge(b));
    }

    // Advance "defeat-npc" quest objectives
    const quests = this.questSystem.getQuestsWithNPCDefeatObjective(npcId, s.activeQuestIds);
    if (result.outcome === "win") {
      quests.forEach(({ questId, objectiveId }) => {
        s.advanceObjective(questId, objectiveId, 1);
        if (this.questSystem.checkAllObjectivesComplete(questId, s.questStates[questId]?.objectiveProgress ?? {})) {
          const questDef = this.questSystem.getQuestDef(questId);
          if (questDef) {
            s.completeQuest(questId);
            s.applyQuestReward(questDef.rewards);
            s.pushNotification({ type: "quest-complete", title: "Quest Complete!", subtitle: questDef.title });
            // Award quest-completion badges
            this.badgeSystem.getBadgesForQuestComplete(questId).forEach((b) => s.awardBadge(b));
          }
        }
      });
    }
  }

  applyMapArrival(mapId: string): void {
    const s = this.store();
    const quests = this.questSystem.getQuestsWithMapObjective(mapId, s.activeQuestIds);
    quests.forEach(({ questId, objectiveId }) => {
      s.advanceObjective(questId, objectiveId, 1);
      if (this.questSystem.checkAllObjectivesComplete(questId, s.questStates[questId]?.objectiveProgress ?? {})) {
        const questDef = this.questSystem.getQuestDef(questId);
        if (questDef) {
          s.completeQuest(questId);
          s.applyQuestReward(questDef.rewards);
          s.pushNotification({ type: "quest-complete", title: "Quest Complete!", subtitle: questDef.title });
        }
      }
    });
  }

  applyNPCTalk(npcId: string): void {
    const s = this.store();
    const quests = this.questSystem.getQuestsWithTalkObjective(npcId, s.activeQuestIds);
    quests.forEach(({ questId, objectiveId }) => {
      s.advanceObjective(questId, objectiveId, 1);
    });
  }
}

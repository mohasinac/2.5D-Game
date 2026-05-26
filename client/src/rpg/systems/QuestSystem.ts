import type { Quest, QuestObjective, QuestStatus } from "../data/schemas";
import { evaluateFlagCondition } from "../utils/flagUtils";

export class QuestSystem {
  private questDefs: Map<string, Quest> = new Map();

  registerQuest(quest: Quest): void {
    this.questDefs.set(quest.id, quest);
  }

  registerQuests(quests: Quest[]): void {
    quests.forEach((q) => this.registerQuests([q]));
    quests.forEach((q) => this.questDefs.set(q.id, q));
  }

  getQuestDef(questId: string): Quest | null {
    return this.questDefs.get(questId) ?? null;
  }

  getAvailableQuests(
    flags: Record<string, boolean>,
    completedQuestIds: string[],
    routeId: string | null,
    arcId: string | null
  ): Quest[] {
    return Array.from(this.questDefs.values()).filter((q) => {
      if (routeId && q.routeExclusiveFor && q.routeExclusiveFor !== routeId) return false;
      if (arcId && q.arcId !== arcId) return false;
      if (q.prerequisites.some((p) => !completedQuestIds.includes(p))) return false;
      if (q.requiredFlags && !evaluateFlagCondition(q.requiredFlags, flags)) return false;
      if (completedQuestIds.includes(q.id)) return false;
      return true;
    });
  }

  checkObjectiveComplete(
    questId: string,
    objectiveId: string,
    progress: Record<string, number>
  ): boolean {
    const quest = this.questDefs.get(questId);
    if (!quest) return false;
    const obj = quest.objectives.find((o) => o.id === objectiveId);
    if (!obj) return false;
    const required = obj.quantity ?? 1;
    return (progress[objectiveId] ?? 0) >= required;
  }

  checkAllObjectivesComplete(
    questId: string,
    progress: Record<string, number>
  ): boolean {
    const quest = this.questDefs.get(questId);
    if (!quest) return false;
    return quest.objectives
      .filter((o) => !o.optional)
      .every((o) => this.checkObjectiveComplete(questId, o.id, progress));
  }

  /** Find quests with a "defeat-npc" objective matching npcId */
  getQuestsWithNPCDefeatObjective(
    npcId: string,
    activeQuestIds: string[]
  ): Array<{ questId: string; objectiveId: string }> {
    const results: Array<{ questId: string; objectiveId: string }> = [];
    for (const questId of activeQuestIds) {
      const quest = this.questDefs.get(questId);
      if (!quest) continue;
      for (const obj of quest.objectives) {
        if (obj.type === "defeat-npc" && obj.targetId === npcId) {
          results.push({ questId, objectiveId: obj.id });
        }
      }
    }
    return results;
  }

  /** Find quests with a "reach-map" objective matching mapId */
  getQuestsWithMapObjective(
    mapId: string,
    activeQuestIds: string[]
  ): Array<{ questId: string; objectiveId: string }> {
    const results: Array<{ questId: string; objectiveId: string }> = [];
    for (const questId of activeQuestIds) {
      const quest = this.questDefs.get(questId);
      if (!quest) continue;
      for (const obj of quest.objectives) {
        if (obj.type === "reach-map" && obj.targetId === mapId) {
          results.push({ questId, objectiveId: obj.id });
        }
      }
    }
    return results;
  }

  /** Find quests with a "talk-to-npc" objective matching npcId */
  getQuestsWithTalkObjective(
    npcId: string,
    activeQuestIds: string[]
  ): Array<{ questId: string; objectiveId: string }> {
    const results: Array<{ questId: string; objectiveId: string }> = [];
    for (const questId of activeQuestIds) {
      const quest = this.questDefs.get(questId);
      if (!quest) continue;
      for (const obj of quest.objectives) {
        if (obj.type === "talk-to-npc" && obj.targetId === npcId) {
          results.push({ questId, objectiveId: obj.id });
        }
      }
    }
    return results;
  }
}

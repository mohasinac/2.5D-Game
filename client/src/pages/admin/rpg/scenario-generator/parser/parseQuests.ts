import type { Quest } from "@/rpg/data/schemas";
import type { ScenarioQuest, ScenarioMeta } from "./types";
import { prefixId, resolveRef } from "./idUtils";

export function parseQuests(
  quests: ScenarioQuest[],
  meta: ScenarioMeta,
  localIds: Set<string>,
): { quests: Quest[]; warnings: string[] } {
  const result: Quest[] = [];
  const warnings: string[] = [];
  const slug = meta.id;

  for (const q of quests) {
    const questId = prefixId(slug, q.id);

    const objectives = q.objectives.map((obj, i) => ({
      id: `${questId}-obj-${i}`,
      type: obj.type,
      targetId: resolveRef(slug, obj.target, localIds),
      quantity: obj.quantity,
      description: obj.description,
      optional: obj.optional ?? false,
    }));

    const rewards = q.rewards ?? {};

    const quest: Quest = {
      id: questId,
      title: q.title,
      description: q.description,
      arcId: meta.arcId,
      category: q.category ?? "main",
      prerequisites: (q.prerequisites ?? []).map((p) => resolveRef(slug, p, localIds)),
      requiredFlags: q.requiredFlags,
      objectives,
      rewards: {
        reputation: rewards.reputation,
        friendship: rewards.friendship,
        items: rewards.items,
        beybladeId: rewards.beybladeId,
        unlockMapIds: rewards.unlockMapIds?.map((m) => resolveRef(slug, m, localIds)),
        setFlags: rewards.setFlags,
        xp: rewards.xp,
        badgeId: rewards.badgeId ? resolveRef(slug, rewards.badgeId, localIds) : undefined,
      },
    };

    result.push(quest);
  }

  return { quests: result, warnings };
}

import type { NPC, DialogueTree, NPCScheduleEntry, NPCBattleConfig } from "@/rpg/data/schemas";
import type { ScenarioCharacter, ScenarioMeta } from "./types";
import { prefixId, resolveRef } from "./idUtils";
import { makeSimpleDialogue } from "./parseDialogueShorthand";

export function parseCharacters(
  characters: ScenarioCharacter[],
  meta: ScenarioMeta,
  localIds: Set<string>,
): { npcs: NPC[]; dialogues: DialogueTree[]; warnings: string[] } {
  const npcs: NPC[] = [];
  const dialogues: DialogueTree[] = [];
  const warnings: string[] = [];
  const slug = meta.id;

  for (const ch of characters) {
    const npcId = prefixId(slug, ch.id);
    const greetingDlgId = `${npcId}-greeting`;

    if (ch.greeting) {
      dialogues.push(makeSimpleDialogue(greetingDlgId, npcId, [ch.greeting]));
    } else {
      dialogues.push(makeSimpleDialogue(greetingDlgId, npcId, ["..."]));
    }

    let battleConfig: NPCBattleConfig | undefined;
    if (ch.battleConfig) {
      const bc = ch.battleConfig;
      const introDlgId = `${npcId}-battle-intro`;
      const victoryDlgId = `${npcId}-battle-victory`;
      const defeatDlgId = `${npcId}-battle-defeat`;

      dialogues.push(makeSimpleDialogue(introDlgId, npcId, ["Let's battle!"]));
      dialogues.push(makeSimpleDialogue(victoryDlgId, npcId, ["Well fought!"]));
      dialogues.push(makeSimpleDialogue(defeatDlgId, npcId, ["I'll get you next time!"]));

      battleConfig = {
        beybladeId: bc.beybladeId,
        arenaId: bc.arenaId,
        difficulty: bc.difficulty ?? "medium",
        introDialogueId: introDlgId,
        victoryDialogueId: victoryDlgId,
        defeatDialogueId: defeatDlgId,
        canRematch: bc.canRematch ?? false,
        xpReward: bc.xpReward,
        awardsBadgeId: bc.awardsBadgeId
          ? resolveRef(slug, bc.awardsBadgeId, localIds)
          : undefined,
        gate: bc.gate,
      };
    }

    const schedule: NPCScheduleEntry[] = [];
    if (ch.schedule) {
      for (const s of ch.schedule) {
        schedule.push({
          timeSlot: s.timeSlot as NPCScheduleEntry["timeSlot"],
          mapId: resolveRef(slug, s.location, localIds),
          tile: { x: s.tile[0], y: s.tile[1] },
          facing: s.facing ?? "down",
        });
      }
    } else if (ch.location && ch.tile) {
      schedule.push({
        timeSlot: "morning",
        mapId: resolveRef(slug, ch.location, localIds),
        tile: { x: ch.tile[0], y: ch.tile[1] },
        facing: ch.facing ?? "down",
      });
    }

    const npc: NPC = {
      id: npcId,
      displayName: ch.name,
      type: ch.type ?? "blader",
      spriteSheetId: `${npcId}-sprite`,
      portraitId: `${npcId}-portrait`,
      defaultFacing: ch.facing ?? "down",
      schedule,
      defaultDialogueId: greetingDlgId,
      battleConfig,
      arcIds: [meta.arcId],
    };

    npcs.push(npc);
  }

  return { npcs, dialogues, warnings };
}

import type { ScenarioInput, ScenarioOutput } from "./types";
import { resetNodeCounter } from "./idUtils";
import { parseLocations } from "./parseLocations";
import { parseCharacters } from "./parseCharacters";
import { parseScenes } from "./parseScenes";
import { parseQuests } from "./parseQuests";
import { parseBadges } from "./parseBadges";
import { parseItems } from "./parseItems";

export function parseScenario(input: ScenarioInput): ScenarioOutput {
  resetNodeCounter();

  const meta = input.scenario;
  const warnings: string[] = [];

  const localLocationIds = new Set((input.locations ?? []).map((l) => l.id));
  const localCharacterIds = new Set((input.characters ?? []).map((c) => c.id));
  const localSceneIds = new Set((input.scenes ?? []).map((s) => s.id));
  const localQuestIds = new Set((input.quests ?? []).map((q) => q.id));
  const localBadgeIds = new Set((input.badges ?? []).map((b) => b.id));
  const localItemIds = new Set((input.items ?? []).map((i) => i.id));

  const allLocalIds = new Set([
    ...localLocationIds,
    ...localCharacterIds,
    ...localSceneIds,
    ...localQuestIds,
    ...localBadgeIds,
    ...localItemIds,
  ]);

  const locResult = parseLocations(input.locations ?? [], meta, allLocalIds);
  warnings.push(...locResult.warnings);

  const charResult = parseCharacters(input.characters ?? [], meta, allLocalIds);
  warnings.push(...charResult.warnings);

  const sceneResult = parseScenes(input.scenes ?? [], meta, allLocalIds, localCharacterIds);
  warnings.push(...sceneResult.warnings);

  const questResult = parseQuests(input.quests ?? [], meta, allLocalIds);
  warnings.push(...questResult.warnings);

  const badgeResult = parseBadges(input.badges ?? [], meta, allLocalIds);
  warnings.push(...badgeResult.warnings);

  const itemResult = parseItems(input.items ?? [], meta);
  warnings.push(...itemResult.warnings);

  for (const map of locResult.maps) {
    const charOnMap = (input.characters ?? []).filter((c) => c.location === getLocalId(map.id, meta.id));
    for (const ch of charOnMap) {
      const npcId = `${meta.id}-${kebab(ch.id)}`;
      if (ch.tile) {
        map.npcPlacements.push({
          npcId,
          spawnTile: { x: ch.tile[0], y: ch.tile[1] },
        });
      }
    }

    const triggers = sceneResult.eventTriggersByMap[map.id];
    if (triggers) {
      map.eventTriggers.push(...triggers);
    }
  }

  return {
    maps: locResult.maps,
    npcs: charResult.npcs,
    dialogues: [...charResult.dialogues, ...sceneResult.dialogues],
    quests: questResult.quests,
    storyEvents: sceneResult.storyEvents,
    cutscenes: sceneResult.cutscenes,
    badges: badgeResult.badges,
    items: itemResult.items,
    warnings,
  };
}

function getLocalId(prefixedId: string, scenarioId: string): string {
  const prefix = `${scenarioId}-`;
  return prefixedId.startsWith(prefix) ? prefixedId.slice(prefix.length) : prefixedId;
}

function kebab(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

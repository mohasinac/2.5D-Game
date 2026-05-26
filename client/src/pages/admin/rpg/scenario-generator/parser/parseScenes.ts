import type {
  DialogueTree, StoryEvent, Cutscene, StoryEventStep, CutsceneStep,
  CutsceneActorPlacement, MapEventTrigger,
} from "@/rpg/data/schemas";
import type { ScenarioScene, ScenarioMeta } from "./types";
import { prefixId, resolveRef } from "./idUtils";
import { parseDialogueShorthand } from "./parseDialogueShorthand";

interface ParsedScenes {
  dialogues: DialogueTree[];
  storyEvents: StoryEvent[];
  cutscenes: Cutscene[];
  eventTriggersByMap: Record<string, MapEventTrigger[]>;
  warnings: string[];
}

export function parseScenes(
  scenes: ScenarioScene[],
  meta: ScenarioMeta,
  localIds: Set<string>,
  characterIds: Set<string>,
): ParsedScenes {
  const dialogues: DialogueTree[] = [];
  const storyEvents: StoryEvent[] = [];
  const cutscenes: Cutscene[] = [];
  const eventTriggersByMap: Record<string, MapEventTrigger[]> = {};
  const warnings: string[] = [];
  const slug = meta.id;

  for (const scene of scenes) {
    const sceneId = prefixId(slug, scene.id);
    const dlgId = `${sceneId}-dlg`;

    if (scene.dialogue && scene.dialogue.length > 0) {
      const dlgTree = parseDialogueShorthand(dlgId, scene.dialogue);
      for (const node of Object.values(dlgTree.nodes)) {
        if (node.speakerId && characterIds.has(node.speakerId)) {
          node.speakerId = prefixId(slug, node.speakerId);
        }
      }
      dialogues.push(dlgTree);
    }

    const isCutscene = scene.type === "cutscene" || (scene.actors && scene.actors.length > 0);

    if (isCutscene) {
      const setupActors: CutsceneActorPlacement[] = (scene.actors ?? []).map((a) => ({
        npcId: resolveRef(slug, a.npcId, characterIds),
        tile: { x: a.tile[0], y: a.tile[1] },
        facing: a.facing ?? "down",
      }));

      const steps: CutsceneStep[] = [
        { type: "lock-player" },
      ];
      if (scene.dialogue && scene.dialogue.length > 0) {
        steps.push({ type: "dialogue", dialogueId: dlgId });
      }
      steps.push({ type: "unlock-player" });

      const cutscene: Cutscene = {
        id: `${sceneId}-cut`,
        displayName: scene.name,
        setupActors,
        steps,
        teardown: "return-control",
      };
      cutscenes.push(cutscene);
    }

    const evtId = `${sceneId}-evt`;
    const evtSteps: StoryEventStep[] = [
      { type: "lock-player" },
    ];
    if (scene.dialogue && scene.dialogue.length > 0) {
      evtSteps.push({ type: "dialogue", dialogueId: dlgId });
    }
    evtSteps.push({ type: "unlock-player" });

    const storyEvent: StoryEvent = {
      id: evtId,
      displayName: scene.name,
      arcId: meta.arcId,
      category: "shared",
      triggerCondition: {},
      gate: scene.gate,
      triggerOnce: scene.triggerOnce !== false,
      blocksPlayerInput: true,
      steps: evtSteps,
      completionFlags: scene.completionFlags ?? { [`${sceneId}-done`]: true },
    };
    storyEvents.push(storyEvent);

    if (scene.location && scene.triggerTile) {
      const mapId = resolveRef(slug, scene.location, localIds);
      const trigger: MapEventTrigger = {
        id: `${evtId}-trigger`,
        triggerRect: { x: scene.triggerTile[0], y: scene.triggerTile[1], width: 1, height: 1 },
        storyEventId: evtId,
        triggerOnce: scene.triggerOnce !== false,
        triggerMode: scene.triggerMode ?? "interact",
      };
      if (!eventTriggersByMap[mapId]) eventTriggersByMap[mapId] = [];
      eventTriggersByMap[mapId].push(trigger);
    }
  }

  return { dialogues, storyEvents, cutscenes, eventTriggersByMap, warnings };
}

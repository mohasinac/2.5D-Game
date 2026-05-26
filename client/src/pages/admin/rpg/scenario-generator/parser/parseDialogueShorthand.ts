import type { DialogueTree, DialogueNode, DialogueChoice } from "@/rpg/data/schemas";
import type { DialogueShorthandEntry } from "./types";
import { uniqueNodeId } from "./idUtils";

export function parseDialogueShorthand(
  dialogueId: string,
  entries: DialogueShorthandEntry[],
): DialogueTree {
  const nodes: Record<string, DialogueNode> = {};
  const labelMap: Record<string, string> = {};
  const gotoFixups: Array<{ nodeId: string; field: "nextNodeId"; target: string }> = [];
  const choiceGotoFixups: Array<{ nodeId: string; choiceIdx: number; target: string }> = [];

  let prevNodeId: string | null = null;

  for (const entry of entries) {
    const raw = entry as Record<string, unknown>;

    if ("choice" in raw && typeof raw.choice === "object" && raw.choice !== null) {
      const ch = raw.choice as { prompt: string; options: Array<{ label: string; setFlag?: string; goto?: string }> };
      const nodeId = uniqueNodeId();
      const choices: DialogueChoice[] = ch.options.map((opt, i) => {
        const choiceId = `${nodeId}_c${i}`;
        const choice: DialogueChoice = {
          id: choiceId,
          label: opt.label,
          nextNodeId: "",
        };
        if (opt.setFlag) {
          choice.setsFlags = { [opt.setFlag]: true };
        }
        if (opt.goto) {
          choiceGotoFixups.push({ nodeId, choiceIdx: i, target: opt.goto });
        }
        return choice;
      });

      const node: DialogueNode = {
        id: nodeId,
        type: "choice",
        speakerId: "",
        text: ch.prompt,
        choices,
      };
      nodes[nodeId] = node;
      if (prevNodeId && nodes[prevNodeId] && !nodes[prevNodeId].nextNodeId && nodes[prevNodeId].type === "speech") {
        nodes[prevNodeId].nextNodeId = nodeId;
      }
      prevNodeId = nodeId;
      continue;
    }

    let label: string | undefined;
    if ("label" in raw && typeof raw.label === "string") {
      label = raw.label;
    }

    const speakerEntries = Object.entries(raw).filter(
      ([k]) => k !== "label" && k !== "goto" && k !== "setFlag",
    );

    if (speakerEntries.length === 0) continue;

    for (const [speaker, text] of speakerEntries) {
      if (typeof text !== "string") continue;

      const nodeId = uniqueNodeId();
      const node: DialogueNode = {
        id: nodeId,
        type: "speech",
        speakerId: speaker,
        text,
      };

      if ("setFlag" in raw && typeof raw.setFlag === "string") {
        node.setsFlags = { [raw.setFlag as string]: true };
      }

      nodes[nodeId] = node;

      if (label) {
        labelMap[label] = nodeId;
      }

      if ("goto" in raw && typeof raw.goto === "string") {
        gotoFixups.push({ nodeId, field: "nextNodeId", target: raw.goto as string });
      }

      if (prevNodeId && nodes[prevNodeId]) {
        const prev = nodes[prevNodeId];
        if (prev.type === "speech" && !prev.nextNodeId) {
          prev.nextNodeId = nodeId;
        } else if (prev.type === "choice" && prev.choices) {
          for (const c of prev.choices) {
            if (!c.nextNodeId) {
              c.nextNodeId = nodeId;
            }
          }
        }
      }
      prevNodeId = nodeId;
    }
  }

  for (const fix of gotoFixups) {
    const target = labelMap[fix.target];
    if (target && nodes[fix.nodeId]) {
      nodes[fix.nodeId].nextNodeId = target;
    }
  }
  for (const fix of choiceGotoFixups) {
    const target = labelMap[fix.target];
    if (target && nodes[fix.nodeId]?.choices?.[fix.choiceIdx]) {
      nodes[fix.nodeId].choices![fix.choiceIdx].nextNodeId = target;
    }
  }

  const lastNodeId = prevNodeId;
  if (lastNodeId && nodes[lastNodeId]) {
    const last = nodes[lastNodeId];
    if (last.type === "speech" && !last.nextNodeId) {
      const endId = uniqueNodeId();
      nodes[endId] = { id: endId, type: "end", speakerId: "", text: "" };
      last.nextNodeId = endId;
    }
  }

  const nodeIds = Object.keys(nodes);
  const startNodeId = nodeIds[0] ?? "";

  return { id: dialogueId, nodes, startNodeId };
}

export function makeSimpleDialogue(
  dialogueId: string,
  speakerId: string,
  lines: string[],
): DialogueTree {
  const entries: DialogueShorthandEntry[] = lines.map((text) => ({ [speakerId]: text }));
  return parseDialogueShorthand(dialogueId, entries);
}

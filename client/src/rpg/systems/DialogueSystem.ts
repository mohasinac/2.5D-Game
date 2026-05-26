import type { DialogueTree, DialogueNode, DialogueChoice, FlagCondition } from "../data/schemas";
import { evaluateFlagCondition } from "../utils/flagUtils";

export class DialogueSystem {
  private trees: Map<string, DialogueTree> = new Map();
  private currentTree: DialogueTree | null = null;
  private currentNodeId: string | null = null;
  private onComplete: (() => void) | null = null;
  private flags: Record<string, boolean> = {};

  registerTree(tree: DialogueTree): void {
    this.trees.set(tree.id, tree);
  }

  setFlags(flags: Record<string, boolean>): void {
    this.flags = flags;
  }

  startDialogue(
    treeId: string,
    onComplete?: () => void,
    onFlagChange?: (flags: Record<string, boolean>) => void
  ): DialogueNode | null {
    const tree = this.trees.get(treeId);
    if (!tree) return null;
    this.currentTree = tree;
    this.currentNodeId = tree.startNodeId;
    this.onComplete = onComplete ?? null;
    return this.getCurrentNode();
  }

  getCurrentNode(): DialogueNode | null {
    if (!this.currentTree || !this.currentNodeId) return null;
    return this.currentTree.nodes[this.currentNodeId] ?? null;
  }

  isActive(): boolean {
    return this.currentTree !== null && this.currentNodeId !== null;
  }

  /** Returns the next node (or null on end). Handles branching automatically. */
  advance(
    choiceId?: string,
    onFlagChange?: (key: string, value: boolean) => void
  ): DialogueNode | null {
    const node = this.getCurrentNode();
    if (!node) return null;

    // Apply flags from this node
    if (node.setsFlags) {
      Object.entries(node.setsFlags).forEach(([k, v]) => onFlagChange?.(k, v));
    }

    let nextNodeId: string | null = null;

    switch (node.type) {
      case "speech":
        nextNodeId = node.nextNodeId ?? null;
        break;
      case "choice": {
        if (!choiceId) return node; // waiting for player choice
        const choice = node.choices?.find((c) => c.id === choiceId);
        if (!choice) return node;
        if (choice.setsFlags) {
          Object.entries(choice.setsFlags).forEach(([k, v]) => onFlagChange?.(k, v));
        }
        nextNodeId = choice.nextNodeId;
        break;
      }
      case "branch": {
        const cond = node.branchCondition;
        if (cond && evaluateFlagCondition(cond, this.flags)) {
          nextNodeId = node.branchTrueNodeId ?? null;
        } else {
          nextNodeId = node.branchFalseNodeId ?? null;
        }
        break;
      }
      case "trigger":
        nextNodeId = node.nextNodeId ?? null;
        break;
      case "end":
      default:
        nextNodeId = null;
        break;
    }

    if (!nextNodeId) {
      this.end();
      return null;
    }

    this.currentNodeId = nextNodeId;
    return this.resolveAutoNodes(onFlagChange);
  }

  /** Auto-advance through branch nodes without waiting for player */
  private resolveAutoNodes(
    onFlagChange?: (key: string, value: boolean) => void
  ): DialogueNode | null {
    let node = this.getCurrentNode();
    while (node && node.type === "branch") {
      node = this.advance(undefined, onFlagChange);
    }
    return node;
  }

  getAvailableChoices(): DialogueChoice[] {
    const node = this.getCurrentNode();
    if (!node || node.type !== "choice") return [];
    return (node.choices ?? []).filter((c) => {
      if (!c.requiredFlag) return true;
      return evaluateFlagCondition(c.requiredFlag, this.flags);
    });
  }

  abort(): void {
    this.end();
  }

  getTree(treeId: string): DialogueTree | null {
    return this.trees.get(treeId) ?? null;
  }

  getDialogueForNPC(npc: { defaultDialogueId: string }, _flags: Record<string, boolean>): DialogueTree | null {
    return this.trees.get(npc.defaultDialogueId) ?? null;
  }

  isActive(): boolean { return this.currentTree !== null; }
  getCurrentTreeId(): string | null { return this.currentTree?.id ?? null; }

  private end(): void {
    this.currentTree = null;
    this.currentNodeId = null;
    this.onComplete?.();
    this.onComplete = null;
  }
}

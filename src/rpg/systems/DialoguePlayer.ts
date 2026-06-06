import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { eventBus } from './EventBus.ts';
import type { DialogueNode, DialogueTree } from '../../types/rpgTypes.ts';

export interface DialogueLine {
  speaker:   string;
  emotion:   string;
  text:      string;
  choices:   { label: string; index: number }[];
  nodeId:    string;
}

export class DialoguePlayer {
  private tree: DialogueTree | null = null;
  private currentNode: DialogueNode | null = null;
  private onLine: (line: DialogueLine | null) => void = () => {};

  start(treeId: string, cb: (line: DialogueLine | null) => void): void {
    const tree = svgAssetStore.getDialogue(treeId);
    if (!tree) { cb(null); return; }
    this.tree = tree;
    this.onLine = cb;
    this.goTo(tree.startId);
  }

  private goTo(nodeId: string): void {
    if (!this.tree) return;
    const node = this.tree.nodes.find(n => n.id === nodeId);
    if (!node) { this.end(); return; }
    this.currentNode = node;
    this.processNode(node);
  }

  private processNode(node: DialogueNode): void {
    switch (node.type) {
      case 'START':
        if (node.nextId) this.goTo(node.nextId); else this.end();
        break;

      case 'END':
        this.end();
        break;

      case 'CONDITION': {
        const flag = node.flagKey ? gameStateStore.getFlag(node.flagKey) : false;
        const next = flag ? node.trueBranch : node.falseBranch;
        if (next) this.goTo(next); else this.end();
        break;
      }

      case 'EVENT':
        this.applyEvent(node);
        if (node.nextId) this.goTo(node.nextId); else this.end();
        break;

      case 'TEXT':
      case 'CHOICE':
        this.onLine({
          speaker:  node.speaker,
          emotion:  node.emotion,
          text:     node.text,
          choices:  node.choices.map((c, i) => ({ label: c.label, index: i })),
          nodeId:   node.id,
        });
        break;
    }
  }

  private applyEvent(node: DialogueNode): void {
    if (!node.eventType) return;
    const arg = node.eventArg ?? '';
    switch (node.eventType) {
      case 'set_flag':
        gameStateStore.setFlag(arg, true);
        break;
      case 'give_item': {
        const [itemId, qtyStr] = arg.split(':');
        inventoryStore.add(itemId, parseInt(qtyStr ?? '1', 10));
        eventBus.emit('inventory:changed');
        break;
      }
      case 'take_item': {
        const [itemId, qtyStr] = arg.split(':');
        inventoryStore.remove(itemId, parseInt(qtyStr ?? '1', 10));
        eventBus.emit('inventory:changed');
        break;
      }
      case 'trigger_cutscene':
        eventBus.emit('cutscene:start', arg);
        break;
    }
  }

  advance(choiceIndex?: number): void {
    const node = this.currentNode;
    if (!node) return;

    if (node.type === 'CHOICE' && choiceIndex !== undefined) {
      const choice = node.choices[choiceIndex];
      if (!choice) return;
      if (choice.flagReq && !gameStateStore.getFlag(choice.flagReq)) return;
      this.goTo(choice.nextId);
    } else if (node.type === 'TEXT') {
      if (node.nextId) this.goTo(node.nextId); else this.end();
    }
  }

  private end(): void {
    this.currentNode = null;
    this.tree = null;
    this.onLine(null);
    eventBus.emit('dialogue:complete');
  }

  isActive(): boolean { return this.currentNode !== null; }
}

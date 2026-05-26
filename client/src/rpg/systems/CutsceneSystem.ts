import type { Cutscene, CutsceneStep } from "../data/schemas";

export type CutsceneStepHandler = (step: CutsceneStep) => Promise<void>;

export class CutsceneSystem {
  private cutscenes: Map<string, Cutscene> = new Map();
  private activeCutscene: Cutscene | null = null;
  private stepHandlers: Map<string, CutsceneStepHandler> = new Map();
  private onStart?: (id: string) => void;
  private onEnd?: () => void;

  registerCutscene(cutscene: Cutscene): void {
    this.cutscenes.set(cutscene.id, cutscene);
  }

  onStepType(type: string, handler: CutsceneStepHandler): void {
    this.stepHandlers.set(type, handler);
  }

  onCutsceneStart(cb: (id: string) => void): void { this.onStart = cb; }
  onCutsceneEnd(cb: () => void): void             { this.onEnd = cb; }

  async playCutscene(cutsceneId: string): Promise<void> {
    const cutscene = this.cutscenes.get(cutsceneId);
    if (!cutscene) return;
    this.activeCutscene = cutscene;
    this.onStart?.(cutsceneId);

    const parallelGroups: CutsceneStep[][] = [];
    let currentGroup: CutsceneStep[] = [];

    for (const step of cutscene.steps) {
      if (step.parallel) {
        currentGroup.push(step);
      } else {
        if (currentGroup.length > 0) {
          parallelGroups.push(currentGroup);
          currentGroup = [];
        }
        parallelGroups.push([step]);
      }
    }
    if (currentGroup.length > 0) parallelGroups.push(currentGroup);

    for (const group of parallelGroups) {
      if (group.length === 1) {
        await this.executeStep(group[0]);
      } else {
        await Promise.all(group.map((s) => this.executeStep(s)));
      }
    }

    this.activeCutscene = null;
    this.onEnd?.();
  }

  private async executeStep(step: CutsceneStep): Promise<void> {
    const handler = this.stepHandlers.get(step.type);
    if (handler) await handler(step);
  }

  stop(): void {
    this.activeCutscene = null;
    this.onEnd?.();
  }

  isPlaying(): boolean {
    return this.activeCutscene !== null;
  }

  processQueue(): void { /* cutscene plays on demand via play() */ }
}

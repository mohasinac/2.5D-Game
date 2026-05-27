import type { StoryEvent, StoryEventStep, RPGMap } from "../data/schemas";
import { evaluateFlagCondition, evaluateGateCondition } from "../utils/flagUtils";

// Minimal subset of RPGStore the event system needs for eligibility checks
interface StoreSnapshot {
  flags: Record<string, boolean>;
  level: number;
  beybladeLevels: Record<string, number>;
  earnedBadges: string[];
  defeatedNPCs: Record<string, boolean>;
  routeId: string | null;
}

export type StepHandler = (step: StoryEventStep) => Promise<void>;

export class StoryEventSystem {
  private events: Map<string, StoryEvent> = new Map();
  private firedOnceIds: Set<string> = new Set();
  private queue: StoryEvent[] = [];
  private running = false;
  private stepHandlers: Map<string, StepHandler> = new Map();
  private onEventStart?: (eventId: string) => void;
  private onEventEnd?: (eventId: string) => void;

  registerEvent(event: StoryEvent): void {
    this.events.set(event.id, event);
  }

  registerEvents(events: StoryEvent[]): void {
    events.forEach((e) => this.events.set(e.id, e));
  }

  onStepType(type: string, handler: StepHandler): void {
    this.stepHandlers.set(type, handler);
  }

  onStart(cb: (eventId: string) => void): void { this.onEventStart = cb; }
  onEnd(cb: (eventId: string) => void): void   { this.onEventEnd = cb; }

  checkTriggersForMap(
    map: RPGMap,
    flags: Record<string, boolean>,
    playerLevel: number,
    beybladeLevels: Record<string, number>,
    earnedBadges: string[],
    defeatedNPCs: Record<string, boolean>,
    routeId: string | null
  ): void {
    for (const trigger of map.eventTriggers) {
      this.queueEventIfEligible(
        trigger.storyEventId, flags, playerLevel,
        beybladeLevels, earnedBadges, defeatedNPCs, routeId
      );
    }
  }

  queueEventIfEligible(
    eventId: string,
    flags: Record<string, boolean>,
    playerLevel: number,
    beybladeLevels: Record<string, number>,
    earnedBadges: string[],
    defeatedNPCs: Record<string, boolean>,
    routeId: string | null
  ): boolean {
    const event = this.events.get(eventId);
    if (!event) return false;
    if (event.triggerOnce && this.firedOnceIds.has(eventId)) return false;
    if (event.routeExclusiveFor && event.routeExclusiveFor !== routeId) return false;
    if (!evaluateFlagCondition(event.triggerCondition, flags)) return false;
    if (event.gate) {
      const gateResult = evaluateGateCondition(
        event.gate, flags, playerLevel, beybladeLevels, earnedBadges, defeatedNPCs
      );
      if (!gateResult.passed) return false;
    }
    this.queueEvent(event);
    return true;
  }

  queueEvent(event: StoryEvent): void {
    if (this.queue.some((e) => e.id === event.id)) return;
    this.queue.push(event);
    if (!this.running) {
      this.processNext();
    }
  }

  isPlaying(): boolean {
    return this.running;
  }

  private async processNext(): Promise<void> {
    if (this.queue.length === 0) { this.running = false; return; }
    this.running = true;
    const event = this.queue.shift()!;
    this.onEventStart?.(event.id);
    await this.runSteps(event);
    if (event.triggerOnce) this.firedOnceIds.add(event.id);
    this.onEventEnd?.(event.id);
    this.processNext();
  }

  private async runSteps(event: StoryEvent): Promise<void> {
    for (const step of event.steps) {
      const handler = this.stepHandlers.get(step.type);
      if (handler) {
        await handler(step);
      }
    }
  }

  markFired(eventId: string): void {
    this.firedOnceIds.add(eventId);
  }

  // Convenience wrapper using a store snapshot
  checkTriggersForMapFromStore(mapId: string, store: StoreSnapshot): string[] {
    const event = this.events;
    const triggered: string[] = [];
    for (const [id, ev] of event.entries()) {
      if (ev.triggerOnce && this.firedOnceIds.has(id)) continue;
      if (ev.routeExclusiveFor && ev.routeExclusiveFor !== store.routeId) continue;
      if (!evaluateFlagCondition(ev.triggerCondition, store.flags)) continue;
      if (ev.gate) {
        const r = evaluateGateCondition(ev.gate, store.flags, store.level, store.beybladeLevels, store.earnedBadges, store.defeatedNPCs);
        if (!r.passed) continue;
      }
      triggered.push(id);
    }
    return triggered;
  }

  queueEventIfEligibleFromStore(eventId: string, store: StoreSnapshot): boolean {
    return this.queueEventIfEligible(
      eventId,
      store.flags,
      store.level,
      store.beybladeLevels,
      store.earnedBadges,
      store.defeatedNPCs,
      store.routeId
    );
  }

  checkTriggersForMapObj(map: RPGMap, store: StoreSnapshot): void {
    this.checkTriggersForMap(
      map, store.flags, store.level,
      store.beybladeLevels, store.earnedBadges, store.defeatedNPCs,
      store.routeId
    );
  }

  /**
   * Queue an event by ID unconditionally (bypasses gate/flag checks).
   * Used by the mini-game system to fire the onSuccess/onFailure event
   * after a mini-game completes, without needing a full store snapshot.
   */
  queueEventById(eventId: string): boolean {
    const event = this.events.get(eventId);
    if (!event) return false;
    this.queueEvent(event);
    return true;
  }

  // Trigger queue processing is automatic when events are enqueued.
  // This no-op is here so callers can call processQueue() without error.
  processQueue(): void { /* self-draining async queue */ }
}

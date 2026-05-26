import type { BadgeDef, GateCondition, GateCheckResult } from "../data/schemas";
import { evaluateGateCondition } from "../utils/flagUtils";

export class BadgeSystem {
  private defs: Map<string, BadgeDef> = new Map();

  loadDefs(badges: BadgeDef[]): void {
    badges.forEach((b) => this.defs.set(b.id, b));
  }

  getDef(id: string): BadgeDef | null {
    return this.defs.get(id) ?? null;
  }

  getAllDefs(): BadgeDef[] {
    return Array.from(this.defs.values());
  }

  getBadgesForRegion(regionId: string): BadgeDef[] {
    return Array.from(this.defs.values()).filter((b) => b.regionId === regionId);
  }

  getBadgesForArc(arcId: string): BadgeDef[] {
    return Array.from(this.defs.values()).filter((b) => b.arcId === arcId || !b.arcId);
  }

  getEarnedBadgesForRegion(regionId: string, earned: string[]): BadgeDef[] {
    return this.getBadgesForRegion(regionId).filter((b) => earned.includes(b.id));
  }

  /** Returns badge IDs that should be awarded based on npc defeat */
  getBadgesForNPCDefeat(npcId: string): string[] {
    return Array.from(this.defs.values())
      .filter((b) => b.earnCondition.type === "defeat-npc" && b.earnCondition.targetId === npcId)
      .map((b) => b.id);
  }

  getBadgesForQuestComplete(questId: string): string[] {
    return Array.from(this.defs.values())
      .filter((b) => b.earnCondition.type === "complete-quest" && b.earnCondition.targetId === questId)
      .map((b) => b.id);
  }

  getBadgesForStoryEvent(eventId: string): string[] {
    return Array.from(this.defs.values())
      .filter((b) => b.earnCondition.type === "story-event" && b.earnCondition.targetId === eventId)
      .map((b) => b.id);
  }

  evaluateGate(
    gate: GateCondition,
    flags: Record<string, boolean>,
    playerLevel: number,
    beybladeLevels: Record<string, number>,
    earnedBadges: string[],
    defeatedNPCs: Record<string, boolean>
  ): GateCheckResult {
    return evaluateGateCondition(gate, flags, playerLevel, beybladeLevels, earnedBadges, defeatedNPCs);
  }
}

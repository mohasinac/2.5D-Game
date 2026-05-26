import type { BattleParams, BattleResult, NPC } from "../data/schemas";
import type { RPGStore } from "../stores/rpgStore";
import type { DialogueSystem } from "./DialogueSystem";
import type { QuestSystem } from "./QuestSystem";
import type { LevelingSystem } from "./LevelingSystem";
import type { BadgeSystem } from "./BadgeSystem";
import type { NPCScheduler } from "./NPCScheduler";

interface NavigateFn {
  (path: string, options?: { state?: unknown }): void;
}

export class BattleTransitionSystem {
  private onFlash?: () => void;

  constructor(
    private store: () => RPGStore,
    private dialogueSystem: DialogueSystem,
    private questSystem: QuestSystem,
    private levelingSystem: LevelingSystem,
    private badgeSystem: BadgeSystem,
    private npcScheduler: NPCScheduler,
    private navigate: NavigateFn,
    private getServerUrl: () => string
  ) {}

  setOnFlash(cb: () => void): void {
    this.onFlash = cb;
  }

  async initiateBattle(
    params: BattleParams,
    npc: NPC,
    userId: string,
    username: string
  ): Promise<void> {
    const store = this.store();

    // Gate check
    if (npc.battleConfig?.gate) {
      const result = this.levelingSystem.checkGate(npc.battleConfig.gate, store);
      if (!result.passed) {
        const lockedId = npc.battleConfig.lockedDialogueId ?? "generic_not_ready";
        this.dialogueSystem.startDialogue(lockedId, store.flags);
        return;
      }
    }

    store.setPlayerLocked(true);
    store.setPendingBattleParams(params);

    // White flash transition
    this.onFlash?.();
    await this.delay(300);

    try {
      const { Client } = await import("colyseus.js");
      const client = new Client(this.getServerUrl());
      const room = await client.create("story_battle_room", {
        beybladeId: params.playerBeybladeId,
        aiBeybladeId: params.opponentBeybladeId,
        arenaId: params.arenaId,
        userId,
        username,
        aiDifficulty: params.difficulty,
        bestOf: params.bestOf ?? 1,
        rpgContext: params.rpgContext,
      });

      this.navigate(`/rpg/battle/${room.roomId}`, {
        state: { battleParams: params, roomId: room.roomId },
      });
    } catch (err) {
      console.error("[BattleTransitionSystem] Failed to create story_battle_room:", err);
      store.setPlayerLocked(false);
      store.setPendingBattleParams(null);
    }
  }

  handleBattleReturn(result: BattleResult): void {
    const store = this.store();

    // Record battle outcome
    store.recordBattle(result.npcId, result.outcome);

    if (result.outcome === "win") {
      store.markNPCDefeated(result.npcId);
    }

    // NPC battle config rewards on win
    const npcDef = this.npcScheduler.getNPCDef(result.npcId);
    if (npcDef?.battleConfig && result.outcome === "win") {
      const bc = npcDef.battleConfig;

      if (bc.rewardFlags) {
        store.setFlags(bc.rewardFlags);
      }

      if (bc.xpReward) {
        this.levelingSystem.awardXP(bc.xpReward, store.equippedBeybladeId);
      }

      if (bc.awardsBadgeId) {
        this.badgeSystem.awardBadge(bc.awardsBadgeId);
      }
    }

    // Reputation delta: +5 on win, -2 on loss
    const repDelta = result.outcome === "win" ? 5 : result.outcome === "loss" ? -2 : 0;
    if (repDelta !== 0) store.adjustReputation(repDelta);

    // Advance defeat-npc quest objectives
    if (result.outcome === "win") {
      const quests = this.questSystem.getQuestsWithNPCDefeatObjective(result.npcId);
      for (const quest of quests) {
        if (store.questStates[quest.id]?.status === "active") {
          for (const obj of quest.objectives) {
            if (obj.type === "defeat-npc" && obj.targetId === result.npcId) {
              store.advanceObjective(quest.id, obj.id, 1);
            }
          }
        }
      }
    }

    // Clear pending params/result
    store.setPendingBattleParams(null);
    store.setPendingBattleResult(null);
    store.setPlayerLocked(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

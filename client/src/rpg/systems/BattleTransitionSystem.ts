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
    const s = this.store();

    if (npc.battleConfig?.gate) {
      const result = this.levelingSystem.checkGate(
        npc.battleConfig.gate,
        s.flags,
        s.level,
        s.beybladeLevels,
        s.earnedBadges,
        s.defeatedNPCs
      );
      if (!result.passed) {
        const lockedId = npc.battleConfig.lockedDialogueId ?? "generic_not_ready";
        this.dialogueSystem.startDialogue(lockedId);
        return;
      }
    }

    s.setPlayerLocked(true);
    s.setPendingBattleParams(params);

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
      s.setPlayerLocked(false);
      s.setPendingBattleParams(null);
    }
  }

  handleBattleReturn(result: BattleResult): void {
    const s = this.store();

    s.recordBattle(result.npcId, result.outcome);

    if (result.outcome === "win") {
      s.markNPCDefeated(result.npcId);
    }

    const npcDef = this.npcScheduler.getNPCDef(result.npcId);
    if (npcDef?.battleConfig && result.outcome === "win") {
      const bc = npcDef.battleConfig;

      if (bc.rewardFlags) {
        s.setFlags(bc.rewardFlags);
      }

      if (bc.xpReward) {
        if (bc.xpReward.playerXP) s.addPlayerXP(bc.xpReward.playerXP);
        if (bc.xpReward.beybladeXP) {
          const target = bc.xpReward.beybladeXPTarget ?? s.equippedBeybladeId;
          if (target) s.addBeybladeXP(target, bc.xpReward.beybladeXP);
        }
      }

      if (bc.awardsBadgeId) {
        s.awardBadge(bc.awardsBadgeId);
      }
    }

    const repDelta = result.outcome === "win" ? 5 : result.outcome === "loss" ? -2 : 0;
    if (repDelta !== 0) s.adjustReputation(repDelta);

    if (result.outcome === "win") {
      const matches = this.questSystem.getQuestsWithNPCDefeatObjective(
        result.npcId,
        s.activeQuestIds
      );
      for (const match of matches) {
        s.advanceObjective(match.questId, match.objectiveId, 1);
      }
    }

    s.setPendingBattleParams(null);
    s.setPendingBattleResult(null);
    s.setPlayerLocked(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

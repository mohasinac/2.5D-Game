import type { BattleParams, BattleResult, NPC, InventoryItem } from "../data/schemas";
import { ROOM_NAMES } from "@/shared/utils/gameMode";
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
  /**
   * Caller must supply the live item-def lookup so we can read
   * launchBoost / wearRate without importing Firebase directly.
   */
  private itemDefs: Record<string, InventoryItem> = {};

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

  /** Register item definitions so wear/boost logic can look them up. */
  setItemDefs(defs: InventoryItem[]): void {
    this.itemDefs = Object.fromEntries(defs.map((d) => [d.id, d]));
  }

  // ── Gate checks ─────────────────────────────────────────────────────────────

  /**
   * Returns true if the player can challenge this NPC right now.
   * Checks: level gate, bey equipped, rematch cooldown, no-bey state.
   */
  canChallenge(npc: NPC): { allowed: boolean; reason?: string } {
    const s = this.store();

    // Must have a beyblade equipped
    if (!s.equippedBeybladeId) {
      return { allowed: false, reason: "You don't have a Beyblade right now!" };
    }

    // Level / flag / badge gate
    if (npc.battleConfig?.gate) {
      const result = this.levelingSystem.checkGate(
        npc.battleConfig.gate,
        s.flags,
        s.effectiveLevel(),
        s.beybladeLevels,
        s.earnedBadges,
        s.defeatedNPCs
      );
      if (!result.passed) return { allowed: false, reason: result.reason };
    }

    // Rematch cooldown
    const alreadyDefeated = s.defeatedNPCs[npc.id];
    if (alreadyDefeated && npc.battleConfig?.canRematch) {
      if (!s.canRematch(npc.id)) {
        const remaining = s.npcRematchCooldowns[npc.id] ?? 0;
        return {
          allowed: false,
          reason: `${npc.displayName} needs a break — fight ${remaining} more battle${remaining !== 1 ? "s" : ""} first.`,
        };
      }
    } else if (alreadyDefeated && !npc.battleConfig?.canRematch) {
      return { allowed: false, reason: `${npc.displayName} won't battle you again.` };
    }

    return { allowed: true };
  }

  // ── Main initiate ────────────────────────────────────────────────────────────

  async initiateBattle(
    params: BattleParams,
    npc: NPC,
    userId: string,
    username: string
  ): Promise<void> {
    const s = this.store();

    // Gate check (shows locked dialogue if failed)
    const check = this.canChallenge(npc);
    if (!check.allowed) {
      const lockedId = npc.battleConfig?.lockedDialogueId ?? "generic_not_ready";
      this.dialogueSystem.startDialogue(lockedId);
      return;
    }

    // ── Enrich params before sending to the server ────────────────────────────

    // 1. Effective (arc-capped) player level for server-side normalisation
    const effectiveLvl = s.effectiveLevel();
    const enriched: BattleParams = {
      ...params,
      playerLevel: effectiveLvl,
      arcLevelCap: s.arcLevelCap ?? undefined,
    };

    // 2. Launch boost from equipped launcher + upgrades
    const boost = s.getLaunchBoostTotal(this.itemDefs);
    if (boost > 0) enriched.launchBoost = boost;

    // 3. Broken launcher warning (boost is 0 but launcher is selected & broken)
    const launcherId = s.equippedLauncherId;
    if (launcherId && (s.itemDurability[launcherId] ?? 1) === 0) {
      s.pushNotification({
        type: "item-received",
        title: "Launcher Broken!",
        subtitle: "No launch boost — visit the shop.",
      });
      // Battle continues without boost; the warning is informational only
    }

    s.setPlayerLocked(true);
    s.setPendingBattleParams(enriched);

    this.onFlash?.();
    await this.delay(300);

    try {
      const { Client } = await import("colyseus.js");
      const client = new Client(this.getServerUrl());
      const room = await client.create(ROOM_NAMES.global.story, {
        beybladeId: enriched.playerBeybladeId,
        aiBeybladeId: enriched.opponentBeybladeId,
        arenaId: enriched.arenaId,
        userId,
        username,
        aiDifficulty: enriched.difficulty,
        bestOf: enriched.bestOf ?? 1,
        rpgContext: enriched.rpgContext,
        playerLevel: enriched.playerLevel,
        arcLevelCap: enriched.arcLevelCap,
        launchBoost: enriched.launchBoost ?? 0,
        forcedOutcome: enriched.rpgContext.forcedOutcome,
      });

      this.navigate(`/rpg/battle/${room.roomId}`, {
        state: { battleParams: enriched, roomId: room.roomId },
      });
    } catch (err) {
      console.error("[BattleTransitionSystem] Failed to create story battle room:", err);
      s.setPlayerLocked(false);
      s.setPendingBattleParams(null);
    }
  }

  // ── Battle return ────────────────────────────────────────────────────────────

  handleBattleReturn(result: BattleResult): void {
    const s = this.store();
    const npcDef = this.npcScheduler.getNPCDef(result.npcId);
    const bc = npcDef?.battleConfig;

    // Record the battle and tick cooldowns
    s.recordBattle(result.npcId, result.outcome);
    s.tickRematchCooldowns();

    // ── Wear the launcher ─────────────────────────────────────────────────────
    const launcherId = s.equippedLauncherId;
    if (launcherId) {
      const def = this.itemDefs[launcherId];
      const wearAmount = def?.wearRate ?? 0;
      if (wearAmount > 0) {
        const broke = s.wearItem(launcherId, wearAmount);
        if (broke) {
          // wearItem already pushes a "Launcher Broke!" notification
        } else {
          const remaining = s.itemDurability[launcherId] ?? 0;
          if (remaining <= 20) {
            s.pushNotification({
              type: "item-received",
              title: "Launcher Wearing Out",
              subtitle: `${remaining}% durability left — visit the shop soon.`,
            });
          }
        }
      }

      // Wear installed upgrades too (at half the launcher's wear rate)
      for (const upgradeId of s.installedUpgradeIds) {
        const upgDef = this.itemDefs[upgradeId];
        if (upgDef?.wearRate) {
          s.wearItem(upgradeId, Math.ceil(upgDef.wearRate / 2));
        }
      }
    }

    // ── Always-set flags (fires on any outcome) ───────────────────────────────
    if (bc?.alwaysSetFlags) s.setFlags(bc.alwaysSetFlags);

    // ── Win outcomes ──────────────────────────────────────────────────────────
    if (result.outcome === "win") {
      s.markNPCDefeated(result.npcId);

      // Set rematch cooldown
      if (bc?.rematchCooldownBattles && bc.rematchCooldownBattles > 0) {
        s.setNPCRematchCooldown(result.npcId, bc.rematchCooldownBattles);
      }

      // Rewards: flags, XP, badge
      if (bc?.rewardFlags) s.setFlags(bc.rewardFlags);

      if (bc?.xpReward) {
        if (bc.xpReward.playerXP) s.addPlayerXP(bc.xpReward.playerXP);
        if (bc.xpReward.beybladeXP) {
          const target = bc.xpReward.beybladeXPTarget ?? s.equippedBeybladeId;
          if (target) s.addBeybladeXP(target, bc.xpReward.beybladeXP);
        }
      }

      if (bc?.awardsBadgeId) s.awardBadge(bc.awardsBadgeId);

      // Team points (Arc 2)
      if (bc?.teamPointsReward && bc.teamPointsReward > 0) {
        s.addTeamPoints(bc.teamPointsReward);
        s.pushNotification({
          type: "quest-update",
          title: `+${bc.teamPointsReward} Team Points`,
          subtitle: `Total: ${s.teamPoints + bc.teamPointsReward}`,
        });
      }

      // Quest objective: defeat-npc
      const matches = this.questSystem.getQuestsWithNPCDefeatObjective(
        result.npcId,
        s.activeQuestIds
      );
      for (const match of matches) {
        s.advanceObjective(match.questId, match.objectiveId, 1);
      }

      // Reputation
      const repDelta = result.rpgContext.isBossEncounter ? 25 : 10;
      s.adjustReputation(repDelta);
      s.adjustFriendship(result.npcId, 5);

    } else if (result.outcome === "loss") {
      // Loss XP (partial reward)
      if (bc?.lossXpReward) {
        if (bc.lossXpReward.playerXP) s.addPlayerXP(bc.lossXpReward.playerXP);
        if (bc.lossXpReward.beybladeXP) {
          const target = bc.lossXpReward.beybladeXPTarget ?? s.equippedBeybladeId;
          if (target) s.addBeybladeXP(target, bc.lossXpReward.beybladeXP);
        }
      }
      s.adjustReputation(-2);
    }

    s.setPendingBattleParams(null);
    s.setPendingBattleResult(null);
    s.setPlayerLocked(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

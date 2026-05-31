import { AIBattleRoom } from "./AIBattleRoom";
import type { Client } from "colyseus";
import type { BeybladeStats } from "../types/shared";

interface RPGContext {
  npcId: string;
  questId?: string;
  storyEventId?: string;
  isBossEncounter: boolean;
}

interface StoryBattleOptions {
  beybladeId: string;
  aiBeybladeId: string;
  arenaId: string;
  userId: string;
  username: string;
  spectate?: boolean;
  aiDifficulty?: "medium" | "hard" | "hell";
  bestOf?: 1 | 3 | 5;
  rpgContext: RPGContext;
  /** Optional overrides applied to AI beyblade stats after load — used for scripted boss encounters. */
  partOverrides?: Partial<BeybladeStats>;
}

// [SERVER-ROOM] StoryBattleRoom — extends AIBattleRoom with RPG story context.
// After series ends, broadcasts "rpg:battle-result" so StoryBattleGamePage can
// return the player to /rpg/game with the outcome.
export class StoryBattleRoom extends AIBattleRoom {
  private rpgContext: RPGContext = { npcId: "", isBossEncounter: false };
  private humanUserId = "";

  async onCreate(options: StoryBattleOptions) {
    const npcId = options.rpgContext?.npcId;
    if (!npcId) {
      // Story battles require an npcId — reject the room so it is never listed
      // in the matchmaker and cannot be joined without a valid rpgContext.
      await this.disconnect();
      return;
    }
    // Default to BO1 for story battles unless explicitly overridden
    const opts = { bestOf: 1 as 1 | 3 | 5, ...options };
    await super.onCreate(opts);
    this.rpgContext = options.rpgContext;
    this.humanUserId = options.userId ?? "";
  }

  async onJoin(client: Client, options: StoryBattleOptions) {
    await super.onJoin(client, options);
    if (!options.spectate) {
      this.humanUserId = options.userId ?? "";
    }
    // Apply partOverrides to all AI beyblades (isAI=true) after super creates them.
    if (options.partOverrides && Object.keys(options.partOverrides).length > 0) {
      const overrides = options.partOverrides;
      this.state.beyblades.forEach((bey) => {
        if (!bey.isAI) return;
        if (overrides.type !== undefined) bey.type = overrides.type;
        if (overrides.color !== undefined) bey.color = overrides.color;
        if (overrides.spinDirection !== undefined) bey.spinDirection = overrides.spinDirection;
        if (overrides.mass !== undefined) bey.mass = overrides.mass;
        if (overrides.radius !== undefined) {
          bey.radius = overrides.radius;
          bey.actualSize = overrides.radius * 24;
        }
        if (overrides.specialMoveId !== undefined) bey.specialMove = overrides.specialMoveId;
        if (overrides.typeDistribution !== undefined) {
          const { attack, defense, stamina } = overrides.typeDistribution;
          if (attack !== undefined) {
            bey.attackPoints = attack;
            bey.damageMultiplier = 1.0 + attack * 0.007;
            bey.speedBonus = 1.0 + attack * 0.007;
          }
          if (defense !== undefined) {
            bey.defensePoints = defense;
            bey.damageTaken = Math.max(0.45, 1 - defense * 0.003);
            bey.knockbackDistance = 10 * (1 - defense * 0.00167);
            bey.invulnerabilityChance = 0.1 + defense * 0.000667;
          }
          if (stamina !== undefined) {
            bey.staminaPoints = stamina;
            bey.spinStealFactor = 0.1 * (1 + stamina * 0.02667);
            bey.spinDecayRate = 8 * (1 - stamina * 0.001);
            bey.maxSpin = Math.ceil(2000 * (1 + stamina * 0.008));
            bey.spin = bey.maxSpin;
            bey.maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
            bey.stamina = bey.maxStamina;
            bey.health = bey.maxStamina;
            bey.maxHealth = bey.maxStamina;
          }
        }
        if (overrides.spinDecayRate !== undefined) bey.spinDecayRate = overrides.spinDecayRate;
      });
    }
  }

  // Override broadcast to intercept "series-end" and append rpg context
  broadcast(type: string | number, message?: any, options?: any): any {
    const result = super.broadcast(type, message, options);
    if (type === "series-end") {
      const msg = message as {
        winner: { userId?: string } | null;
        seriesScore: Record<string, number>;
        reason: string;
      };
      const outcome: "win" | "loss" | "draw" =
        msg.winner == null
          ? "draw"
          : msg.winner.userId === this.humanUserId
          ? "win"
          : "loss";

      super.broadcast("rpg:battle-result", {
        npcId: this.rpgContext.npcId,
        outcome,
        seriesScore: msg.seriesScore,
        rpgContext: this.rpgContext,
      });
    }
    return result;
  }
}

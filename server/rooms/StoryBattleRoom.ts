import { AIBattleRoom } from "./AIBattleRoom";
import type { Client } from "colyseus";

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
  aiDifficulty?: "medium" | "hard" | "hell";
  bestOf?: 1 | 3 | 5;
  rpgContext: RPGContext;
}

// [SERVER-ROOM] StoryBattleRoom — extends AIBattleRoom with RPG story context.
// After series ends, broadcasts "rpg:battle-result" so StoryBattleGamePage can
// return the player to /rpg/game with the outcome.
export class StoryBattleRoom extends AIBattleRoom {
  private rpgContext: RPGContext = { npcId: "", isBossEncounter: false };
  private humanUserId = "";

  onCreate(options: StoryBattleOptions) {
    super.onCreate(options);
    this.rpgContext = options.rpgContext ?? { npcId: "", isBossEncounter: false };
  }

  onJoin(client: Client, options: StoryBattleOptions) {
    super.onJoin(client, options);
    if (!options.spectate) {
      this.humanUserId = options.userId ?? "";
    }
  }

  // Called by onMessage("series-end") listener in base; we hook the broadcast
  onMessage(client: Client, message: unknown) {
    super.onMessage(client, message);
  }

  // Override broadcast to intercept "series-end" and append rpg context
  broadcast(type: string, message?: unknown, options?: { except?: Client }) {
    super.broadcast(type, message, options);
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
  }
}

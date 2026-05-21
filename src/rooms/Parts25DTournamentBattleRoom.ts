import type { Client } from "colyseus";
import { TournamentBattleRoom } from "./TournamentBattleRoom";
import { PartSystemManager } from "./PartSystemManager";
import { buildPartSystemManager, registerBeyOnManager, tickBeyOnManager } from "./parts25d/partSystemHooks";
import type { Beyblade } from "./schema/GameState";

export class Parts25DTournamentBattleRoom extends TournamentBattleRoom {
  protected partSystemManager?: PartSystemManager;

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = "tournament-2.5d";
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    console.log("→ Parts25DTournamentBattleRoom active (2.5D parts pipeline)");

    // Tournament AI participants are created during super.onCreate(); register
    // them with the manager now.
    const physicsOpts = { physics: this.physics };
    if (Array.isArray(options.aiParticipants)) {
      for (const aiP of options.aiParticipants) {
        const aiBey = this.state.beyblades.get(aiP.userId);
        if (!aiBey) continue;
        await registerBeyOnManager(this.partSystemManager, aiP.beybladeId, aiP.userId, aiBey, physicsOpts);
      }
    }
  }

  async onJoin(client: Client, options: any) {
    await super.onJoin(client, options);
    if (options.spectate) return;
    const bey = this.state.beyblades.get(client.sessionId);
    if (!bey || !this.partSystemManager) return;
    await registerBeyOnManager(
      this.partSystemManager, options.beybladeId, client.sessionId, bey,
      { physics: this.physics },
    );
  }

  protected onTickedBey(beyblade: Beyblade, dt: number): void {
    if (!this.partSystemManager) return;
    tickBeyOnManager(this.partSystemManager, beyblade, this.state, dt);
  }

  protected onBeyCollided(id1: string, id2: string, impactForce: number): void {
    if (!this.partSystemManager) return;
    this.partSystemManager.onBeyCollision(id1, id2, impactForce, this.state.beyblades as unknown as Map<string, Beyblade>, this.state);
  }
}

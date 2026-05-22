import type { Client } from "colyseus";
import { AIBattleRoom } from "./AIBattleRoom";
import { PartSystemManager } from "./PartSystemManager";
import { buildPartSystemManager, registerBeyOnManager, registerModeSwitchHandler, tickBeyOnManager } from "./parts25d/partSystemHooks";
import type { Beyblade } from "./schema/GameState";

export class Parts25DAIBattleRoom extends AIBattleRoom {
  protected partSystemManager?: PartSystemManager;

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = "ai-battle-2.5d";
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    registerModeSwitchHandler(this, () => this.partSystemManager);
    console.log("→ Parts25DAIBattleRoom active (2.5D parts pipeline)");
  }

  async onJoin(client: Client, options: any) {
    await super.onJoin(client, options);
    if (options.spectate) return;
    if (!this.partSystemManager) return;

    // super.onJoin returns early on spectate, match-full, or second-player —
    // in those cases no human bey was created. Skip registration entirely so
    // we don't re-register the AI bey (which would reset its 2.5D mechanism
    // fire counts and re-launch its physics body mid-match).
    const humanBey = this.state.beyblades.get(client.sessionId);
    if (!humanBey) return;

    const physicsOpts = { physics: this.physics };
    await registerBeyOnManager(this.partSystemManager, options.beybladeId, client.sessionId, humanBey, physicsOpts);

    // AI bey — created in super.onJoin alongside the human. id is the static
    // __ai__ session id; resolve from options.aiBeybladeId.
    const aiId = "__ai__";
    const aiBey = this.state.beyblades.get(aiId);
    if (aiBey && options.aiBeybladeId) {
      await registerBeyOnManager(this.partSystemManager, options.aiBeybladeId, aiId, aiBey, physicsOpts);
    }
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

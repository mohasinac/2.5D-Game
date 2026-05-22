import type { Client } from "colyseus";
import { BattleRoom } from "./BattleRoom";
import { PartSystemManager } from "./PartSystemManager";
import { buildPartSystemManager, registerBeyOnManager, registerModeSwitchHandler, tickBeyOnManager } from "./parts25d/partSystemHooks";
import type { Beyblade } from "./schema/GameState";

export class Parts25DBattleRoom extends BattleRoom {
  protected partSystemManager?: PartSystemManager;

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = (options.ranked ? "single-battle-pvp-ranked-2.5d" : "single-battle-pvp-2.5d");
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    registerModeSwitchHandler(this, () => this.partSystemManager);
    console.log("→ Parts25DBattleRoom active (2.5D parts pipeline)");
  }

  async onJoin(client: Client, options: any) {
    await super.onJoin(client, options);
    if (options.spectate) return;
    const bey = this.state.beyblades.get(client.sessionId);
    if (!bey || !this.partSystemManager) return;
    const bundle = await registerBeyOnManager(
      this.partSystemManager, options.beybladeId, client.sessionId, bey,
      { physics: this.physics },
    );
    if (bundle) {
      console.log(`✅ Registered 2.5D bey '${bundle.system.displayName}' for ${bey.username}`);
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

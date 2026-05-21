// 2.5D variant of TryoutRoom. Sets mode flag, instantiates a
// PartSystemManager sized to the arena, and registers the joining bey from
// the beyblade_systems collection. The base TryoutRoom calls onTickedBey()
// inside its tick loop — we forward that to the manager here.

import type { Client } from "colyseus";
import { TryoutRoom } from "./TryoutRoom";
import { PartSystemManager } from "./PartSystemManager";
import { buildPartSystemManager, registerBeyOnManager, tickBeyOnManager } from "./parts25d/partSystemHooks";
import type { Beyblade } from "./schema/GameState";

export class Parts25DTryoutRoom extends TryoutRoom {
  protected partSystemManager?: PartSystemManager;

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = "tryout-2.5d";
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    console.log("→ Parts25DTryoutRoom active (2.5D parts pipeline)");
  }

  async onJoin(client: Client, options: any) {
    await super.onJoin(client, options);
    const bey = this.state.beyblades.get(client.sessionId);
    if (!bey || !this.partSystemManager) return;
    // options.beybladeId is treated as a beyblade_systems document id in 2.5D.
    const bundle = await registerBeyOnManager(
      this.partSystemManager, options.beybladeId, client.sessionId, bey,
      { physics: this.physics },
    );
    if (bundle) {
      console.log(`✅ Registered 2.5D bey '${bundle.system.displayName}' (${bundle.parts.subParts.length} sub-parts)`);
    }
  }

  protected onTickedBey(beyblade: Beyblade, dt: number): void {
    if (!this.partSystemManager) return;
    tickBeyOnManager(this.partSystemManager, beyblade, this.state, dt);
  }
}

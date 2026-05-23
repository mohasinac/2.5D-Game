// [SERVER-ROOM] Parts25DTeamBattleRoom — 2v2 team battles using the 2.5D parts pipeline.
// Extends TeamBattleRoom and layers in 2.5D part-system logic (identical pattern
// to Parts25DBattleRoom, but the base class is TeamBattleRoom instead of BattleRoom).
//
// K2: Created as a sibling of Parts25DBattleRoom + TeamBattleRoom.

import type { Client } from "colyseus";
import { TeamBattleRoom } from "./TeamBattleRoom";
import { PartSystemManager } from "./PartSystemManager";
import {
  buildPartSystemManager,
  registerBeyOnManager,
  registerModeSwitchHandler,
  tickBeyOnManager,
} from "./parts25d/partSystemHooks";
import type { Beyblade } from "./schema/GameState";

export class Parts25DTeamBattleRoom extends TeamBattleRoom {
  protected partSystemManager?: PartSystemManager;

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = (options.ranked
      ? "team-battle-pvp-ranked-2.5d"
      : "team-battle-pvp-2.5d");
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    registerModeSwitchHandler(this, () => this.partSystemManager);
    console.log("→ Parts25DTeamBattleRoom active (2.5D parts pipeline + team battle)");
  }

  async onJoin(client: Client, options: any) {
    await super.onJoin(client, options);
    if (options.spectate) return;
    const bey = this.state.beyblades.get(client.sessionId);
    if (!bey || !this.partSystemManager) return;
    const bundle = await registerBeyOnManager(
      this.partSystemManager,
      options.beybladeId,
      client.sessionId,
      bey,
      { physics: this.physics },
    );
    if (bundle) {
      console.log(
        `✅ Registered 2.5D team bey '${bundle.system.displayName}' for ${bey.username}`,
      );
    }
  }

  protected onTickedBey(beyblade: Beyblade, dt: number): void {
    if (!this.partSystemManager) return;
    tickBeyOnManager(this.partSystemManager, beyblade, this.state, dt);
  }

  protected onBeyCollided(id1: string, id2: string, impactForce: number): void {
    if (!this.partSystemManager) return;
    this.partSystemManager.onBeyCollision(
      id1,
      id2,
      impactForce,
      this.state.beyblades as unknown as Map<string, Beyblade>,
      this.state,
    );
  }

  /**
   * Override tick combination-lock hook to also advance the 2.5D part system
   * combination-lock state (if manager is present). Called by BattleRoom's
   * combo processing path once per tick.
   */
  protected onTickCombinationLock(_dt: number): void {
    if (!this.partSystemManager) return;
    this.partSystemManager.tickCombinationLock(
      new Map(
        Array.from(
          (this.state.beyblades as unknown as Map<string, Beyblade>).entries(),
        ),
      ),
      (this as any).currentTick ?? 0,
    );
  }
}

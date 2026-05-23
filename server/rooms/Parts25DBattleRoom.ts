import type { Client } from "colyseus";
import Matter from "matter-js";
import { BattleRoom } from "./BattleRoom";
import { PartSystemManager } from "./PartSystemManager";
import { buildPartSystemManager, registerBeyOnManager, registerModeSwitchHandler, tickBeyOnManager } from "./parts25d/partSystemHooks";
import type { Beyblade, DetachedBodySchema } from "./schema/GameState";
import { COLLISION_CATEGORIES } from "../utils/physicsFlags";

export class Parts25DBattleRoom extends BattleRoom {
  protected partSystemManager?: PartSystemManager;
  private detachedMatterBodies = new Map<string, Matter.Body>();

  async onCreate(options: any) {
    await super.onCreate(options);
    this.state.mode = (options.ranked ? "single-battle-pvp-ranked-2.5d" : "single-battle-pvp-2.5d");
    this.partSystemManager = buildPartSystemManager(this.state.arena);
    registerModeSwitchHandler(this, () => this.partSystemManager);

    // Wire Matter.js rigid bodies for detached bodies as they are spawned.
    this.state.detachedBodies.onAdd((body: DetachedBodySchema, key: string) => {
      this._createDetachedMatterBody(key, body);
    });
    this.state.detachedBodies.onRemove((_body: DetachedBodySchema, key: string) => {
      const matterBody = this.detachedMatterBodies.get(key);
      if (matterBody) {
        try { Matter.World.remove((this.physics as any).world, matterBody); } catch { /* already removed */ }
        this.detachedMatterBodies.delete(key);
      }
    });

    console.log("→ Parts25DBattleRoom active (2.5D parts pipeline)");
  }

  private _createDetachedMatterBody(key: string, schema: DetachedBodySchema): void {
    const radiusPx = Math.max(4, schema.radius * 24);
    const matterBody = Matter.Bodies.circle(schema.x, schema.y, radiusPx, {
      mass: schema.mass,
      restitution: 0.7,
      friction: 0.02,
      frictionAir: 0.015,
      label: `detached_${key}`,
      collisionFilter: {
        category: COLLISION_CATEGORIES.PROJECTILE,
        mask: COLLISION_CATEGORIES.BEYBLADE | COLLISION_CATEGORIES.OBSTACLE,
      },
    });
    Matter.Body.setVelocity(matterBody, { x: schema.velocityX, y: schema.velocityY });
    try {
      Matter.World.add((this.physics as any).world, matterBody);
    } catch { /* physics not yet initialised — body will be added on next tick */ }
    this.detachedMatterBodies.set(key, matterBody);
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

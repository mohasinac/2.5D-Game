// [SERVER-ROOM] TeamBattleRoom — 2v2 team battles with switchable beys.
// Each team has up to 2 beys; a player can "possess" (transfer control to) a
// different team bey using the spatial possession mechanic (specialTap + direction).
//
// Extends BattleRoom — re-uses all physics, combo, and timeline logic.

import { BattleRoom } from "./BattleRoom";
import { Client } from "colyseus";
import type { PlayerInput } from "../shared/utils/bitmask";

interface TeamJoinOptions {
  beybladeId: string;
  teamBeybladeIds?: string[];   // additional bey ids for this player's team (max 3 extra)
  arenaId: string;
  arenaSystemId?: string;
  userId: string;
  username: string;
  team: "red" | "blue";
  spectate?: boolean;
  bestOf?: 1 | 3 | 5;
  modifierIds?: string[];
}

// Maps sessionId → team
const teamMap = new Map<string, "red" | "blue">();
// Maps sessionId → currently controlled beyId (could be any team bey)
const controlledBey = new Map<string, string>();
// Maps beyId → ownerSessionId (who spawned this bey)
const beyOwner = new Map<string, string>();

export class TeamBattleRoom extends BattleRoom {
  // Override maxClients for team format (2×2 players + spectators)
  maxClients = 12;

  async onJoin(client: Client, options: TeamJoinOptions) {
    if (options.spectate) {
      await super.onJoin(client, options as unknown as Parameters<BattleRoom["onJoin"]>[1]);
      return;
    }

    // Let BattleRoom handle the primary bey spawn
    await super.onJoin(client, options as unknown as Parameters<BattleRoom["onJoin"]>[1]);

    teamMap.set(client.sessionId, options.team ?? "blue");
    controlledBey.set(client.sessionId, client.sessionId); // control own bey by default
    beyOwner.set(client.sessionId, client.sessionId);

    this.broadcast("team-joined", {
      sessionId: client.sessionId,
      username: options.username,
      team: options.team ?? "blue",
    });
  }

  onLeave(client: Client, consented: boolean) {
    teamMap.delete(client.sessionId);
    controlledBey.delete(client.sessionId);
    beyOwner.delete(client.sessionId);
    return super.onLeave(client, consented);
  }

  /**
   * Spatial possession: transfer control to the nearest team bey in a 60° cone
   * centered on the given direction. Only beys owned by this player's team are
   * eligible. Control is seamless — effective next tick.
   */
  protected handleSpatialPossession(
    sessionId: string,
    direction: "left" | "right" | "up" | "down"
  ): void {
    const team = teamMap.get(sessionId);
    if (!team) return;

    const controlBeyId = controlledBey.get(sessionId) ?? sessionId;
    const mover = this.state.beyblades.get(controlBeyId);
    if (!mover) return;

    // Direction vector
    const dirVec = {
      left:  { x: -1, y: 0 },
      right: { x:  1, y: 0 },
      up:    { x:  0, y: -1 },
      down:  { x:  0, y:  1 },
    }[direction];

    const CONE_HALF_ANGLE = Math.PI / 3; // 60°
    let bestSid: string | null = null;
    let bestDist = Infinity;

    this.state.beyblades.forEach((bey, sid) => {
      if (sid === controlBeyId) return;
      if (!bey.isActive) return;
      // Must be a bey belonging to the same team
      if (teamMap.get(beyOwner.get(sid) ?? "") !== team) return;
      // Must not already be controlled by another player
      const alreadyControlled = Array.from(controlledBey.values()).some(
        cid => cid === sid && cid !== controlBeyId
      );
      if (alreadyControlled) return;

      const dx = bey.x - mover.x;
      const dy = bey.y - mover.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;

      // Check 60° cone
      const nx = dx / dist, ny = dy / dist;
      const dot = nx * dirVec.x + ny * dirVec.y;
      if (dot < Math.cos(CONE_HALF_ANGLE)) return;

      if (dist < bestDist) { bestDist = dist; bestSid = sid; }
    });

    if (bestSid) {
      controlledBey.set(sessionId, bestSid);
      this.broadcast("possession-transferred", {
        sessionId,
        fromBeyId: controlBeyId,
        toBeyId: bestSid,
      });
    }
  }

  /**
   * Override handleInput to redirect to controlled bey and detect possession combos.
   * specialTap + direction key → spatial possession instead of special move.
   */
  protected handleInput(client: Client, input: PlayerInput): void {
    const sessionId = client.sessionId;

    // Check for spatial possession gesture: specialTap + movement direction
    if (input.specialTap) {
      const dir =
        input.moveLeft  ? "left"  :
        input.moveRight ? "right" :
        input.moveUp    ? "up"    :
        input.moveDown  ? "down"  : null;
      if (dir) {
        this.handleSpatialPossession(sessionId, dir as "left" | "right" | "up" | "down");
        // Consume the input — do not fire special move
        return;
      }
    }

    // Remap input to the currently controlled bey
    const targetBeyId = controlledBey.get(sessionId) ?? sessionId;
    if (targetBeyId !== sessionId) {
      // Temporarily redirect: create a fake client with targetBeyId as sessionId
      // We do this by calling the parent handleInput with a proxied client object
      const proxyClient = { ...client, sessionId: targetBeyId };
      super.handleInput(proxyClient as Client, input);
      return;
    }

    super.handleInput(client, input);
  }
}

/**
 * Pure eject-behavior handler for speed line exits.
 * Returns an EjectResult — does NOT mutate velocity directly.
 * Caller (SpawnManager) assigns: this.vel.copy(result.velocity).
 *
 * special_move is a reserved no-op placeholder.
 */

import * as THREE from 'three';
import type { SpeedLineExitBehavior, JumpLinkData } from '../../types/arenaTypes';

export interface EjectContext {
  velocity:     THREE.Vector3;             // current velocity (not mutated)
  position:     THREE.Vector3;             // entity world position at exit point
  pathForward:  THREE.Vector3;             // tangent direction at exit point (unit vector)
  launchForce:  number;                    // cm/s impulse magnitude for 'launch'
  jumpLinks:    ReadonlyMap<string, JumpLinkData>;
  slJumpLinkId: string | null;             // sl.jumpLinkId — which JL to target
}

export interface EjectResult {
  velocity: THREE.Vector3;       // new velocity after eject (caller applies this)
  jumpTo?:  THREE.Vector3;       // if jump_link: launch toward this world position
}

export function applyEjectBehavior(
  behavior: SpeedLineExitBehavior,
  ctx: EjectContext,
): EjectResult {
  switch (behavior) {
    case 'normal':
      return { velocity: ctx.velocity.clone() };

    case 'launch':
      return { velocity: ctx.pathForward.clone().multiplyScalar(ctx.launchForce) };

    case 'loop':
      // Re-enter path from start — caller resets path entry flag.
      return { velocity: ctx.velocity.clone() };

    case 'jump_link': {
      const jl = ctx.slJumpLinkId ? ctx.jumpLinks.get(ctx.slJumpLinkId) : null;
      if (!jl) return { velocity: ctx.velocity.clone() };
      // Resolve destination from dst endpoint.
      // Only 'world_point' mode provides direct XYZ; other modes require arena lookup
      // which callers must pre-resolve into world_point before using this handler.
      const dst = jl.dst;
      if (dst.mode !== 'world_point') return { velocity: ctx.velocity.clone() };
      const dest = new THREE.Vector3(dst.worldX, dst.worldY, dst.worldZ);
      const dir = dest.clone().sub(ctx.position).normalize();
      return {
        velocity: dir.multiplyScalar(ctx.launchForce),
        jumpTo: dest,
      };
    }

    case 'special_move':
      // Placeholder — reserved for anime-physics override. Returns velocity unchanged.
      return { velocity: ctx.velocity.clone() };

    default:
      return { velocity: ctx.velocity.clone() };
  }
}

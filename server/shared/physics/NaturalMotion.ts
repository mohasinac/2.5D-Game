// Natural gyroscopic motion for beyblades — Phase 24 L2A.2.
// Computes the "AI layer" force that makes beyblades move like real gyroscopes
// rather than RC cars. Blended with player input by computeAuthority() in InputHandler.ts.

import type { Beyblade } from "../../rooms/schema/GameState";

export interface DecisionBias {
  fx?: number;
  fy?: number;
  railTargetX?: number;
  railTargetY?: number;
}

export interface NaturalForce {
  fx: number;
  fy: number;
}

/**
 * Compute natural gyroscopic motion force for a single beyblade.
 *
 * @param bey           The beyblade schema object (position, velocity, spin, mass, etc.)
 * @param cx            Arena center X in physics pixels
 * @param cy            Arena center Y in physics pixels
 * @param attitude      Active attitude bits: "aggressive" | "defensive" | "stamina" | null
 * @param opponents     Opponent beyblades (for seek/avoid logic)
 * @param isAIStunned   When true AI force is suppressed (80ms stun window)
 * @param decisionBias  Per-bey seeded decision output (from BeyDecision mechanic)
 * @param rageBurstActive  When true, all forces scaled ×2
 */
export function computeNaturalForce(
  bey: Beyblade,
  cx: number,
  cy: number,
  attitude: "aggressive" | "defensive" | "stamina" | null,
  opponents: Beyblade[],
  isAIStunned: boolean,
  decisionBias: DecisionBias,
  rageBurstActive: boolean,
): NaturalForce {
  if (isAIStunned) return { fx: 0, fy: 0 };

  const mass = bey.mass;
  const spinFrac = bey.maxSpin > 0 ? Math.min(1, bey.spin / bey.maxSpin) : 0;
  const vx = bey.velocityX;
  const vy = bey.velocityY;
  const speed = Math.sqrt(vx * vx + vy * vy);

  // Radius vector from arena centre → bey
  const rx = bey.x - cx;
  const ry = bey.y - cy;
  const radiusDist = Math.sqrt(rx * rx + ry * ry) || 1;

  let fx = 0;
  let fy = 0;

  // 1. Orbit layer — tangential force perpendicular to radius vector.
  //    Produces the characteristic orbital path of a well-spinning bey.
  const grip = (bey as any).gripFactor ?? 0.5;
  const orbitStr = 0.0005 * mass * spinFrac * grip;
  // Tangent: rotate radius 90° (CCW for right-spinning, CW for left-spinning)
  const spinSign = bey.spinDirection === "left" ? -1 : 1;
  fx += (-ry / radiusDist) * orbitStr * spinSign;
  fy += ( rx / radiusDist) * orbitStr * spinSign;

  // 2. Momentum continuation — nudge along current velocity direction.
  //    Simulates gyroscopic rigidity (resistance to changing heading).
  if (speed > 0.1) {
    const contStr = 0.0001 * mass * spinFrac * (speed / 300);
    fx += (vx / speed) * contStr;
    fy += (vy / speed) * contStr;
  }

  // 3. Attitude bias — player-directed intent modifier.
  if (attitude === "aggressive" && opponents.length > 0) {
    // Seek nearest opponent
    let nearestDist = Infinity;
    let nearX = cx, nearY = cy;
    for (const opp of opponents) {
      const dx = opp.x - bey.x;
      const dy = opp.y - bey.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) { nearestDist = d; nearX = opp.x; nearY = opp.y; }
    }
    const dToOpp = Math.sqrt((nearX - bey.x) ** 2 + (nearY - bey.y) ** 2) || 1;
    const seekStr = 0.0003 * mass;
    fx += ((nearX - bey.x) / dToOpp) * seekStr;
    fy += ((nearY - bey.y) / dToOpp) * seekStr;
  } else if (attitude === "defensive") {
    // Bias away from opponents
    for (const opp of opponents) {
      const dx = bey.x - opp.x;
      const dy = bey.y - opp.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const avoidStr = 0.0002 * mass / opponents.length;
      fx += (dx / d) * avoidStr;
      fy += (dy / d) * avoidStr;
    }
  }
  // attitudeStamina = conserve spin — no extra force, handled by authority blend reducing player input

  // 4. Spin stabilisation — gentle centring when spinning slowly.
  //    Stops erratic movement when nearly out of spin.
  if (spinFrac < 0.40) {
    const stabStr = 0.0002 * mass * (1 - spinFrac);
    fx += (-rx / radiusDist) * stabStr;
    fy += (-ry / radiusDist) * stabStr;
  }

  // 5. Death spiral — strong pull toward centre when critically low spin (batch-015 §D).
  //    Real beyblades spiral inward just before stopping.
  if (spinFrac < 0.15) {
    const spiralStr = 0.001 * mass * (0.15 - spinFrac) * 10;
    fx += (-rx / radiusDist) * spiralStr;
    fy += (-ry / radiusDist) * spiralStr;
  }

  // 6. Rage burst — double all forces when active.
  if (rageBurstActive) {
    fx *= 2.0;
    fy *= 2.0;
  }

  // 7. Rail adhesion — sticky pull toward a rail target when decision system requests it.
  if (decisionBias.railTargetX !== undefined && decisionBias.railTargetY !== undefined) {
    const dxRail = decisionBias.railTargetX - bey.x;
    const dyRail = decisionBias.railTargetY - bey.y;
    const dRail = Math.sqrt(dxRail * dxRail + dyRail * dyRail) || 1;
    const railStr = 0.0006 * mass;
    fx += (dxRail / dRail) * railStr;
    fy += (dyRail / dRail) * railStr;
  }

  // 8. Decision bias — direct force injection from the decision system.
  fx += decisionBias.fx ?? 0;
  fy += decisionBias.fy ?? 0;

  return { fx, fy };
}

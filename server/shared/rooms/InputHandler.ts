// Shared input → physics action mapping. Extracted from the duplicate
// handleInput blocks in BattleRoom (~96 LOC), TryoutRoom (~79 LOC),
// AIBattleRoom (~80 LOC), TournamentBattleRoom (~72 LOC).
//
// Pure module: takes the beyblade, the decoded PlayerInput, and a physics bridge.
// Returns an event summary the caller may broadcast.

import type { Beyblade } from "../../rooms/schema/GameState";
import type { PlayerInput } from "../utils/bitmask";

export interface InputPhysicsBridge {
  applyForce(id: string, fx: number, fy: number): void;
  applyLateralForce(id: string, spinDirection: "left" | "right", magnitude: number): void;
}

export interface InputEvents {
  attacked?: boolean;
  specialFired?: boolean;
}

// True when the bey is in a "loss of control" window (special move / combo executing).
export function isControlLocked(beyblade: Beyblade): boolean {
  return (beyblade.controlLockedUntilMs ?? 0) > Date.now();
}

// Apply 4-direction movement forces. Skipped when beyblade is comboExecuting or
// inside a loss-of-control window from a special move / combo.
//
// is25D = true  → forces are relative to beyblade.rotation (2.5D/3D mode):
//   W=forward along facing, S=backward, A=right-strafe, D=left-strafe
// is25D = false → forces are absolute world-axis directions (2D flat mode):
//   W=world-up (−Y), S=world-down (+Y), A=world-left (−X), D=world-right (+X)
export function applyMovementInput(
  beyblade: Beyblade,
  input: PlayerInput,
  forceMagnitude: number,
  physics: InputPhysicsBridge,
  is25D = false,
): void {
  if (beyblade.comboExecuting) return;
  if (isControlLocked(beyblade)) return;

  if (is25D) {
    // 2.5D: forces rotate with beyblade facing direction.
    // Screen convention: x+ = right, y+ = down. Rotation r=0 faces +X (East).
    // Left strafe (A) = CCW-90° from facing = (sin(r), -cos(r)).
    // Right strafe (D) = CW-90° from facing = (-sin(r), cos(r)).
    const r = beyblade.rotation;
    if (input.moveLeft) {
      // A = left strafe relative to forward direction
      physics.applyForce(beyblade.id, Math.sin(r) * forceMagnitude * 1.5, -Math.cos(r) * forceMagnitude * 1.5);
    }
    if (input.moveRight) {
      // D = right strafe relative to forward direction
      physics.applyForce(beyblade.id, -Math.sin(r) * forceMagnitude * 1.5, Math.cos(r) * forceMagnitude * 1.5);
    }
    if (input.moveUp) {
      // W = forward
      physics.applyForce(beyblade.id, Math.cos(r) * forceMagnitude * 1.5, Math.sin(r) * forceMagnitude * 1.5);
    }
    if (input.moveDown) {
      // S = backward
      physics.applyForce(beyblade.id, -Math.cos(r) * forceMagnitude, -Math.sin(r) * forceMagnitude);
    }
  } else {
    // 2D flat: absolute world-axis forces
    if (input.moveLeft)  physics.applyForce(beyblade.id, -forceMagnitude * 1.5,  0);
    if (input.moveRight) physics.applyForce(beyblade.id,  forceMagnitude * 1.5,  0);
    if (input.moveUp)    physics.applyForce(beyblade.id,  0, -forceMagnitude * 1.5);
    if (input.moveDown)  physics.applyForce(beyblade.id,  0,  forceMagnitude);
  }
}

// Apply jump / attack / defense / dodge / charge / special-tap actions.
// Returns event flags so the caller can broadcast "attack" / "special-move" etc.
export function applyActionInput(
  beyblade: Beyblade,
  input: PlayerInput,
  forceMagnitude: number,
  physics: InputPhysicsBridge,
  fireSpecial: (b: Beyblade) => void,
): InputEvents {
  const events: InputEvents = {};
  if (beyblade.comboExecuting || beyblade.stunTimer > 0) return events;
  // Loss of control: ignore movement/action bits during a special / combo window.
  if (isControlLocked(beyblade)) return events;

  if (input.jump && !beyblade.isAirborne && !beyblade.inPit && !beyblade.isDefending && beyblade.landingLag <= 0) {
    beyblade.isAirborne = true;
    beyblade.airborneTimer = 1.0;
  }

  if (input.attack && beyblade.attackCooldown <= 0) {
    physics.applyForce(
      beyblade.id,
      Math.cos(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier,
      Math.sin(beyblade.rotation) * forceMagnitude * 3 * beyblade.damageMultiplier,
    );
    beyblade.attackBuffTimer = 0.5;
    beyblade.attackCooldown = 1.5;
    events.attacked = true;
  }

  if (input.defense && !beyblade.isAirborne && beyblade.landingLag <= 0) {
    beyblade.isDefending = true;
    beyblade.defenseBuffTimer = 0.1;
  } else if (!input.defense) {
    beyblade.isDefending = false;
  }

  const canDodge = !beyblade.inPit && !beyblade.isDefending && beyblade.power >= 10 && beyblade.dodgeBuffTimer <= 0;
  if (input.dodge && canDodge) {
    physics.applyLateralForce(
      beyblade.id,
      beyblade.spinDirection as "left" | "right",
      forceMagnitude * 4 * beyblade.speedBonus,
    );
    beyblade.dodgeBuffTimer = 0.4;
    beyblade.power = Math.max(0, beyblade.power - 10);
  }

  if (input.chargeHeld) {
    const isMoving = !!(input.moveLeft || input.moveRight || input.moveUp || input.moveDown);
    beyblade.power = Math.min(100, beyblade.power + (isMoving ? 2 : 1));
  }

  const wantsSpecial = input.specialTap || input.specialMove;
  if (wantsSpecial && beyblade.specialCooldown <= 0) {
    const hasPower = input.specialTap ? beyblade.power >= 50 : true;
    if (hasPower) {
      fireSpecial(beyblade);
      if (input.specialTap) beyblade.power = Math.max(0, beyblade.power - 50);
      beyblade.specialCooldown = 3;
      // Loss-of-control window during the special animation (~500ms by default).
      // Per-move duration override comes from special_moves docs in Phase 5 follow-up.
      beyblade.controlLockedUntilMs = Date.now() + 500;
      beyblade.controlLockSource = "special";
      events.specialFired = true;
    }
  }

  if (input.direction && (input.direction.x !== 0 || input.direction.y !== 0)) {
    const mag = Math.sqrt(input.direction.x ** 2 + input.direction.y ** 2);
    physics.applyForce(
      beyblade.id,
      (input.direction.x / mag) * forceMagnitude,
      (input.direction.y / mag) * forceMagnitude,
    );
  }

  return events;
}

// Convenience: force magnitude given a beyblade's current state.
export function computeForceMagnitude(beyblade: Beyblade): number {
  const stability = Math.min(1, beyblade.spin / beyblade.maxSpin);
  return 0.001 * beyblade.mass * stability * beyblade.speedBonus;
}

// ── Phase 24: Authority Blend ────────────────────────────────────────────────

/**
 * Arena authority multiplier — reduces player control near features that have
 * their own physics (rails, gravity wells, spin zones, pits).
 * Reads optional playerAuthorityConfig from the arena config doc.
 * Returns a multiplier in [0, 2]; default 1.0 when no config is set.
 */
export function computeArenaAuthorityMultiplier(
  bey: Beyblade,
  arenaAuthorityConfig?: {
    globalMultiplier?: number;
    curvatureMultiplier?: number;
    featureOverrides?: Record<string, number>;
  },
): number {
  if (!arenaAuthorityConfig) return 1.0;
  return arenaAuthorityConfig.globalMultiplier ?? 1.0;
}

/**
 * Compute the α scalar (0–1) controlling player vs. natural-motion blend.
 * α=1.0 → full player control; α=0.0 → full natural motion (AI layer).
 *
 * @param holdMs          How many ms the directional key has been held continuously
 * @param chargeHeld      Whether Space / RT charge is being held
 * @param clashBoostTicks Remaining ticks of clash-QTE authority boost
 * @param spinFrac        bey.spin / bey.maxSpin
 * @param speedPx         Current speed in physics pixels/s
 * @param prevAlpha       Previous smoothed α (for lerp continuity)
 * @param arenaMultiplier Result of computeArenaAuthorityMultiplier()
 * @param overrideZero    Force α=0 (combo, stun, controlLocked)
 * @param overrideHigh    Force α=0.90 (AI surrender — held >3000ms)
 */
export function computeAuthority(
  holdMs: number,
  chargeHeld: boolean,
  clashBoostTicks: number,
  spinFrac: number,
  speedPx: number,
  prevAlpha: number,
  arenaMultiplier: number,
  overrideZero: boolean,
  overrideHigh: boolean,
): number {
  if (overrideZero) return 0;
  if (overrideHigh) return 0.90;

  const holdBoost  = Math.min(0.70, holdMs / 3000 * 0.70);
  const spaceBoost = chargeHeld ? 0.10 : 0;
  const clashBoost = Math.min(0.20, clashBoostTicks / 10 * 0.20);
  const spinPenalty = spinFrac < 0.40 ? (0.40 - spinFrac) * 1.5 : 0;
  const momentumPenalty = speedPx > 400 ? Math.min(0.20, (speedPx - 400) / 2000 * 0.20) : 0;

  const alpha_raw = Math.max(0, Math.min(1,
    0.30 + holdBoost + spaceBoost + clashBoost - spinPenalty - momentumPenalty,
  ));
  const alpha_arena = alpha_raw * arenaMultiplier;
  // Smooth α with lerp factor 0.08 for gradual transitions
  return prevAlpha + (alpha_arena - prevAlpha) * 0.08;
}

/**
 * Blend player force and natural motion force using the α scalar,
 * then apply the combined force to the beyblade.
 *
 * @param beyId         Beyblade id string
 * @param playerFx/Fy  Raw player input force components
 * @param naturalFx/Fy Natural motion force components (from NaturalMotion.ts)
 * @param alpha         Authority scalar from computeAuthority()
 * @param physics       Physics bridge
 */
export function applyBlendedMovement(
  beyId: string,
  playerFx: number,
  playerFy: number,
  naturalFx: number,
  naturalFy: number,
  alpha: number,
  physics: InputPhysicsBridge,
): void {
  const fx = playerFx * alpha + naturalFx * (1 - alpha);
  const fy = playerFy * alpha + naturalFy * (1 - alpha);
  physics.applyForce(beyId, fx, fy);
}

// ── Phase 24: Steering Force ──────────────────────────────────────────────────

/**
 * Centripetal perpendicular steering — changes heading without changing speed.
 * Uses the cross-product between current velocity and target direction to
 * compute a perpendicular correction force.
 *
 * @param beyblade    The beyblade to steer
 * @param targetDirX  Normalised X component of desired direction
 * @param targetDirY  Normalised Y component of desired direction
 * @param turnRate    Aggressiveness of the turn (tip-dependent, 0–1)
 * @param physics     Physics bridge
 */
export function applySteeringForce(
  beyblade: Beyblade,
  targetDirX: number,
  targetDirY: number,
  turnRate: number,
  physics: InputPhysicsBridge,
): void {
  const cvx = beyblade.velocityX;
  const cvy = beyblade.velocityY;
  const speed = Math.sqrt(cvx * cvx + cvy * cvy);
  if (speed < 1) return;

  const cross = cvx * targetDirY - cvy * targetDirX;
  const steerStr = beyblade.mass * speed * turnRate * 0.002;
  physics.applyForce(
    beyblade.id,
    -cvy * cross * steerStr,
     cvx * cross * steerStr,
  );

  // Spin cost for sharp turns
  const spinSteerCost = 0.0002;
  beyblade.spin = Math.max(0, beyblade.spin - Math.abs(cross) * turnRate * spinSteerCost);
}

// ── Phase 24: Contextual I-key ────────────────────────────────────────────────

/**
 * Context-dependent I-key / jump action:
 * - Context A (spin < 40% OR airborne): centring stabilisation + upward impulse.
 * - Context B (spin ≥ 40%, grounded):  probabilistic jump attempt gated by core type + mass.
 *
 * @param bey       The beyblade
 * @param randVal   Seeded random value 0–1 (from createPRNG, NOT Math.random)
 * @param physics   Physics bridge
 */
export function applyContextualJump(
  bey: Beyblade,
  randVal: number,
  physics: InputPhysicsBridge,
): void {
  if (bey.comboExecuting || bey.stunTimer > 0 || isControlLocked(bey)) return;

  const spinFrac = bey.maxSpin > 0 ? bey.spin / bey.maxSpin : 0;

  if (spinFrac < 0.40 || bey.isAirborne) {
    // Context A — stabilise: centring (33%) + upward (67%)
    const stabForce = 0.003 * bey.mass;
    const toCentreX = -(bey.x - ((bey as any)._arenaCenterX as number | undefined ?? 0));
    const toCentreY = -(bey.y - ((bey as any)._arenaCenterY as number | undefined ?? 0));
    const dist = Math.sqrt(toCentreX ** 2 + toCentreY ** 2) || 1;
    physics.applyForce(bey.id, (toCentreX / dist) * stabForce * 0.33, (toCentreY / dist) * stabForce * 0.33);
    // "Upward" in 2D physics = upward screen impulse (−Y)
    physics.applyForce(bey.id, 0, -stabForce * 0.67);
    return;
  }

  // Context B — jump attempt
  if (bey.isAirborne || bey.inPit || bey.isDefending || bey.landingLag > 0) return;

  // Jump probabilities by archetype (batch-013 §C)
  const jumpProb: Record<string, number> = {
    attack: 0.60, balanced: 0.30, defense: 0.10, stamina: 0.08,
  };
  const prob = jumpProb[bey.type] ?? 0.20;
  const massOk = bey.mass <= 15;

  if (massOk && randVal < prob) {
    bey.isAirborne = true;
    bey.airborneTimer = 1.0;
  }
}

// ── Phase 24: Type-Aware X Defense ───────────────────────────────────────────

/**
 * Type-aware response to the X / defense input key.
 * Each archetype interprets "hold defense" differently.
 */
export function applyTypeAwareDefense(
  bey: Beyblade,
  physics: InputPhysicsBridge,
): void {
  if (bey.comboExecuting || bey.stunTimer > 0 || isControlLocked(bey)) return;

  const forceMag = computeForceMagnitude(bey);
  const spinFrac = bey.maxSpin > 0 ? bey.spin / bey.maxSpin : 0;

  switch (bey.type) {
    case "defense": {
      // Full guard: lock movement, drain spin 50% penalty
      bey.isDefending = true;
      bey.defenseBuffTimer = 0.15;
      bey.spin = Math.max(0, bey.spin - bey.maxSpin * 0.005);
      break;
    }
    case "attack": {
      // Auto-dodge: lateral arc burst, power−10
      if (bey.power >= 10) {
        physics.applyLateralForce(bey.id, bey.spinDirection as "left" | "right", forceMag * 5);
        bey.power = Math.max(0, bey.power - 10);
        bey.dodgeBuffTimer = 0.3;
      }
      break;
    }
    case "stamina": {
      // Evasion: lateral in spin direction, power−5
      if (bey.power >= 5) {
        physics.applyLateralForce(bey.id, bey.spinDirection as "left" | "right", forceMag * 3);
        bey.power = Math.max(0, bey.power - 5);
      }
      break;
    }
    case "balanced":
    default: {
      // Context-dependent: high spin → guard, low spin → dodge
      if (spinFrac >= 0.60) {
        bey.isDefending = true;
        bey.defenseBuffTimer = 0.1;
      } else {
        if (bey.power >= 10) {
          physics.applyLateralForce(bey.id, bey.spinDirection as "left" | "right", forceMag * 4);
          bey.power = Math.max(0, bey.power - 10);
          bey.dodgeBuffTimer = 0.35;
        }
      }
      break;
    }
  }
}

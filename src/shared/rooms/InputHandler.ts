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

// Apply 4-direction movement forces. Skipped when beyblade is comboExecuting.
export function applyMovementInput(
  beyblade: Beyblade,
  input: PlayerInput,
  forceMagnitude: number,
  physics: InputPhysicsBridge,
): void {
  if (beyblade.comboExecuting) return;

  if (input.moveLeft) {
    physics.applyForce(
      beyblade.id,
      -Math.sin(beyblade.rotation) * forceMagnitude * 1.5,
       Math.cos(beyblade.rotation) * forceMagnitude * 1.5,
    );
  }
  if (input.moveRight) {
    physics.applyForce(
      beyblade.id,
       Math.sin(beyblade.rotation) * forceMagnitude * 1.5,
      -Math.cos(beyblade.rotation) * forceMagnitude * 1.5,
    );
  }
  if (input.moveUp) {
    physics.applyForce(
      beyblade.id,
      Math.cos(beyblade.rotation) * forceMagnitude * 1.5,
      Math.sin(beyblade.rotation) * forceMagnitude * 1.5,
    );
  }
  if (input.moveDown) {
    physics.applyForce(
      beyblade.id,
      -Math.cos(beyblade.rotation) * forceMagnitude,
      -Math.sin(beyblade.rotation) * forceMagnitude,
    );
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

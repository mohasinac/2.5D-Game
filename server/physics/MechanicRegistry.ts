import type { Beyblade } from "../rooms/schema/GameState";

export interface MechanicContext {
  bey: Beyblade;
  opponentId?: string;
  opponent?: Beyblade;
  dt: number;
  applyForce: (id: string, fx: number, fy: number) => void;
  applyKnockback: (id: string, dir: { x: number; y: number }, dist: number) => void;
  setVelocity?: (id: string, vx: number, vy: number) => void;
  getPosition?: (id: string) => { x: number; y: number } | null;
}

export interface MechanicHandler {
  onActivate?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
  tick?: (ctx: MechanicContext, params: Record<string, unknown>, state: Record<string, unknown>) => void;
  onCollision?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
  passive?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
}

// Populated by registerMechanic() calls from each handler file
const REGISTRY: Record<string, MechanicHandler> = {};

export function registerMechanic(id: string, handler: MechanicHandler): void {
  REGISTRY[id] = handler;
}

export function getMechanic(id: string): MechanicHandler | undefined {
  return REGISTRY[id];
}

export function dispatchBehaviorRef(
  behaviorRef: { behaviorId: string; params?: Record<string, unknown> },
  ctx: MechanicContext,
): void {
  // behaviorId format: "<namespace>.<mechanicId>" e.g. "factor.attack_amplifier"
  const parts = behaviorRef.behaviorId.split(".");
  const mechanicId = parts[parts.length - 1];
  const handler = REGISTRY[mechanicId];
  if (!handler) {
    console.warn(`[MechanicRegistry] No handler for "${behaviorRef.behaviorId}" (mechanicId="${mechanicId}")`);
    return;
  }
  handler.onActivate?.(ctx, behaviorRef.params ?? {});
}

// Auto-register all mechanic handlers
import "./mechanics/energyReserve";
import "./mechanics/velocityBurst";
import "./mechanics/attackAmplifier";
import "./mechanics/freeSpin";
import "./mechanics/spinTransfer";
import "./mechanics/spinEqualization";
import "./mechanics/rotationReverse";
import "./mechanics/spinThresholdSwitch";
import "./mechanics/modeSwitch";
import "./mechanics/rubberGrip";
import "./mechanics/contactDeflect";
import "./mechanics/springRecoil";
import "./mechanics/weightShift";
import "./mechanics/spinStealCoupling";
import "./mechanics/railLock";
import "./mechanics/centerPull";
import "./mechanics/bearingDrift";
import "./mechanics/burstSuppress";
import "./mechanics/staminaRecovery";
import "./mechanics/surfaceFrictionModifier";
import "./mechanics/orbitMovement";
import "./mechanics/upperLaunch";
import "./mechanics/smashImpact";
import "./mechanics/barrageHit";
import "./mechanics/zeroGFloat";
import "./mechanics/magneticPull";
import "./mechanics/contactHeightGate";
import "./mechanics/spinDirectionBonus";
import "./mechanics/subPartBurst";
import "./mechanics/defenseStance";
import "./mechanics/revivalSpin";
// Phase 24 stubs — full implementation in Session C
import "./mechanics/authorityBlend";
import "./mechanics/steeringForce";
import "./mechanics/beyDecision";
import "./mechanics/naturalMotion";

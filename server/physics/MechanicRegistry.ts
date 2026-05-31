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

// ── #19: Gimmick × Part Material Synergy Registry ────────────────────────────
// Loaded at match start from Firestore `gimmick_synergies`. Keys = `${gimmickId}:${materialId}`.
export interface GimmickSynergyDef {
  gimmickId: string;
  materialId: string;
  modifierType: string; // e.g. "force_multiplier", "spin_bonus", "cooldown_reduction"
  value: number;        // multiplier or additive bonus
  description?: string;
}

const SYNERGY_REGISTRY: Map<string, GimmickSynergyDef> = new Map();

/** Load synergies from Firestore data at match start. */
export function loadGimmickSynergies(synergies: GimmickSynergyDef[]): void {
  SYNERGY_REGISTRY.clear();
  for (const s of synergies) {
    SYNERGY_REGISTRY.set(`${s.gimmickId}:${s.materialId}`, s);
  }
}

/** Get the synergy multiplier for a gimmick + material pair. Returns 1.0 if no synergy. */
export function getGimmickSynergyMultiplier(gimmickId: string, materialId: string): number {
  const key = `${gimmickId}:${materialId}`;
  const syn = SYNERGY_REGISTRY.get(key);
  if (!syn) return 1.0;
  // For force_multiplier and spin_bonus types, return as multiplier
  return syn.value ?? 1.0;
}

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
import "./mechanics/authorityBlend";
import "./mechanics/steeringForce";
import "./mechanics/beyDecision";
import "./mechanics/naturalMotion";
// Phase 2 — new handlers from INDEX_A–E case study findings (#36–59)
import "./mechanics/centrifugalDeployBow";
import "./mechanics/limitBreakDeploy";
import "./mechanics/centrifugalBarrierBlades";
import "./mechanics/centrifugalModeChange";
import "./mechanics/springBladeAwakening";
import "./mechanics/freeSpinTip";
import "./mechanics/hybridTipMode";
import "./mechanics/springClutch";
import "./mechanics/aerialTip";
import "./mechanics/suctionTip";
import "./mechanics/freeSpinConicalTip";
import "./mechanics/freeSpinFrame";
import "./mechanics/ladRing";
import "./mechanics/partialFreeSpinSar";
import "./mechanics/layerModeSwitch";
import "./mechanics/detrimentalModeSwitch";
import "./mechanics/bistableModeSwitch";
import "./mechanics/lifeAfterDeath";
import "./mechanics/destabilizeSlope";
import "./mechanics/subArDeflect";
import "./mechanics/rubberSmashAr";
import "./mechanics/rollerDeflect";
import "./mechanics/rollerRighting";
import "./mechanics/chipSeparation";

/**
 * MoveExecutor.ts — universal move execution pipeline.
 *
 * All per-type switch statements and hardcoded move handling are replaced by
 * this module. The executor resolves material modifiers, element type multipliers,
 * geometry contact multipliers, and gimmick synergy multipliers, then dispatches
 * to the correct MechanicRegistry handler.
 *
 * Usage:
 *   executeMoveWithConfig(config, ctx);
 *
 * This is the only entry point for applying any mechanic — whether triggered
 * by a beyblade gimmick, an arena element, a special move phase, or a combo.
 */

import { getMechanic, getGimmickSynergyMultiplier, type MechanicContext } from "./MechanicRegistry";
import { resolveMaterial, resolveCOR } from "./registries/MaterialRegistry";
import { resolveAttackType } from "./registries/AttackTypeRegistry";
import { resolveElementMultiplier } from "./registries/ElementTypeRegistry";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MoveConfig {
  mechanicId: string;
  params: Record<string, unknown>;
  /** Material of the attacking contact surface (e.g. "abs_hard", "metal_zinc") */
  materialId?: string;
  /** Material of the target contact surface (for COR calculation) */
  targetMaterialId?: string;
  /** Attack type ID (e.g. "smash", "upper", "absorb") */
  attackTypeId?: string;
  /** Attacker element type (e.g. "fire", "water") */
  attackerElementTypeId?: string;
  /** Defender element type */
  defenderElementTypeId?: string;
  /** Gimmick ID used for synergy lookup */
  gimmickId?: string;
  /** Geometry-derived contact multiplier (pre-computed from WingDef arc/radius) */
  geometryContactMult?: number;
}

export interface MoveResult {
  handled: boolean;
  spinDelta?: number;
  healthDelta?: number;
  burstDelta?: number;
  tiltDelta?: number;
  effectiveDmgMult?: number;
}

// ── Modifier resolution ───────────────────────────────────────────────────────

/**
 * Resolve all multipliers for a move and pack them into the params.
 * Returns augmented params; original MoveConfig.params is not mutated.
 */
function buildAugmentedParams(
  config: MoveConfig,
): Record<string, unknown> {
  const base = { ...config.params };

  // 1. Material dmgMult
  if (config.materialId) {
    const mat = resolveMaterial(config.materialId);
    base._materialDmgMult = mat.dmgMult;
    base._materialMu = mat.mu_k;
  }

  // 2. COR between attack and target surfaces
  if (config.materialId && config.targetMaterialId) {
    base._cor = resolveCOR(config.materialId, config.targetMaterialId);
  }

  // 3. Attack type frictionMu and spin modifiers
  if (config.attackTypeId) {
    const at = resolveAttackType(config.attackTypeId);
    base._attackFrictionMu   = at.frictionMu;
    base._attackSpinDeltaMult = at.spinDeltaMult;
    base._attackTiltIncrement = at.tiltIncrement;
    base._attackRecoilFactor  = at.recoilFactor;
  }

  // 4. Element type interaction multiplier
  const attackerEl = config.attackerElementTypeId ?? "neutral";
  const defenderEl = config.defenderElementTypeId ?? "neutral";
  base._elementMult = resolveElementMultiplier(attackerEl, defenderEl);

  // 5. Gimmick × material synergy multiplier
  const synergyMult = config.gimmickId && config.materialId
    ? getGimmickSynergyMultiplier(config.gimmickId, config.materialId)
    : 1.0;
  base._synergyMult = synergyMult;

  // 6. Geometry contact multiplier (pre-computed from WingDef arc/radius)
  base._geometryContactMult = config.geometryContactMult ?? 1.0;

  // Composite effective damage multiplier (for callers that want the final number)
  const matDmg  = (base._materialDmgMult  as number) ?? 1.0;
  const elemMul = (base._elementMult      as number) ?? 1.0;
  const synMul  = (base._synergyMult      as number) ?? 1.0;
  const geoMul  = (base._geometryContactMult as number) ?? 1.0;
  base._effectiveDmgMult = matDmg * elemMul * synMul * geoMul;

  return base;
}

// ── Main executor ─────────────────────────────────────────────────────────────

/**
 * Execute a move with the given config and context.
 * Dispatches to the MechanicRegistry handler after resolving all multipliers.
 */
export function executeMoveWithConfig(
  config: MoveConfig,
  ctx: MechanicContext,
): MoveResult {
  const handler = getMechanic(config.mechanicId);
  if (!handler) {
    console.warn(`[MoveExecutor] No handler registered for mechanicId "${config.mechanicId}"`);
    return { handled: false };
  }

  const augmented = buildAugmentedParams(config);
  handler.onActivate?.(ctx, augmented);

  return {
    handled: true,
    effectiveDmgMult: augmented._effectiveDmgMult as number,
  };
}

/**
 * Execute a passive (per-tick) move.
 * Used for mechanics like free_spin, stamina_recovery, motor_spin_boost.
 */
export function executePassiveMove(
  config: MoveConfig,
  ctx: MechanicContext,
  state: Record<string, unknown>,
): MoveResult {
  const handler = getMechanic(config.mechanicId);
  if (!handler) return { handled: false };

  const augmented = buildAugmentedParams(config);
  handler.passive?.(ctx, augmented);
  handler.tick?.(ctx, augmented, state);

  return { handled: true };
}

/**
 * Execute a collision-phase move.
 * Used for mechanics triggered specifically at the moment of contact.
 */
export function executeCollisionMove(
  config: MoveConfig,
  ctx: MechanicContext,
): MoveResult {
  const handler = getMechanic(config.mechanicId);
  if (!handler) return { handled: false };

  const augmented = buildAugmentedParams(config);
  handler.onCollision?.(ctx, augmented);

  return {
    handled: true,
    effectiveDmgMult: augmented._effectiveDmgMult as number,
  };
}

/**
 * Expand a gimmick's behaviorRefs into MoveConfig objects ready for execution.
 * Uses GimmickRegistry so no Firestore reads per tick.
 */
export function gimmickToMoveConfigs(
  gimmickId: string,
  gimmickDef: { behaviorRefs: Array<{ mechanicId: string; params: Record<string, unknown> }> },
  overrides?: Partial<Pick<MoveConfig, "materialId" | "targetMaterialId" | "attackTypeId" | "attackerElementTypeId" | "defenderElementTypeId">>
): MoveConfig[] {
  return gimmickDef.behaviorRefs.map(ref => ({
    mechanicId: ref.mechanicId,
    params: { ...ref.params },
    gimmickId,
    ...overrides,
  }));
}

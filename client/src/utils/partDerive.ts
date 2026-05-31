import type { MechanicInstance } from "@/types/phase21";

// ── WingDef ───────────────────────────────────────────────────────────────────

export interface WingDef {
  wingId:       string;
  count:        number;
  /** Angular spacing between wing instances. Defaults to 360/count when 0. */
  spacingDeg:   number;
  offsetDeg:    number;
  shape:        "triangle" | "rectangle" | "arc" | "spike" | "tapered" | "custom";
  r_inner_cm:   number;
  r_outer_cm:   number;
  z_base_cm:    number;
  z_top_cm:     number;
  arcWidth_deg: number;
  tiltAngle_deg:number;
  movementType: WingMovementType;
  // Movement parameters (only for non-fixed movement types)
  pivotRadius_cm?:       number;
  deployThreshold_N?:    number;
  maxDeployAngle_deg?:   number;
  returnTimeMs?:         number;
  bistable?:             boolean;
  requiresManualReset?:  boolean;
  bearingMu?:            number;
  ringMass_g?:           number;
  spinDecouplingFactor?: number;
  modePositions?:        { label: string; pivotAngle_deg: number }[];
  // Contact physics
  contactMaterialId: string;
  dmgMult:           number;
  attackTypeId:      string;
  // 2.5D rendering
  heightProfile: "flat" | "dome" | "tapered" | "ridge" | "spike";
  renderColor?:  string;
}

export type WingMovementType =
  | "fixed"
  | "deployable_individual"
  | "deployable_collective"
  | "free_spin_ring"
  | "mode_switch";

// ── ContactPointConfig ────────────────────────────────────────────────────────

export interface ContactPointConfig {
  arcStart:     number;
  arcEnd:       number;
  radiusInner:  number;
  radiusOuter:  number;
  z_min_cm:     number;
  z_max_cm:     number;
  materialId:   string;
  dmgMult:      number;
  attackTypeId: string;
  wingDefId:    string;
  wingIndex:    number;
}

// ── Auto-Derivation Pipeline ──────────────────────────────────────────────────

/**
 * Derives one ContactPointConfig per wing instance from a WingDef.
 * Wings are placed at evenly-spaced angles (offsetDeg + i × effectiveSpacing).
 */
export function deriveContactPoints(wingDef: WingDef): ContactPointConfig[] {
  const effectiveSpacing =
    wingDef.spacingDeg > 0 ? wingDef.spacingDeg : 360 / wingDef.count;

  return Array.from({ length: wingDef.count }, (_, i) => {
    const centerAngle = wingDef.offsetDeg + i * effectiveSpacing;
    return {
      arcStart:    centerAngle - wingDef.arcWidth_deg / 2,
      arcEnd:      centerAngle + wingDef.arcWidth_deg / 2,
      radiusInner: wingDef.r_inner_cm,
      radiusOuter: wingDef.r_outer_cm,
      z_min_cm:    wingDef.z_base_cm,
      z_max_cm:    wingDef.z_top_cm,
      materialId:  wingDef.contactMaterialId,
      dmgMult:     wingDef.dmgMult,
      attackTypeId: wingDef.attackTypeId,
      wingDefId:   wingDef.wingId,
      wingIndex:   i,
    };
  });
}

/**
 * Derives the MechanicInstance (if any) for a WingDef based on movementType.
 * Returns null for fixed wings (no mechanic, contact point is static).
 */
export function deriveWingMechanic(wingDef: WingDef): MechanicInstance | null {
  switch (wingDef.movementType) {
    case "fixed":
      return null;

    case "deployable_individual":
      return {
        mechanicId: "contactDeflect",
        params: {
          perWingIndependent: true,
          wingCount:          wingDef.count,
          deployThreshold_N:  wingDef.deployThreshold_N ?? 2.0,
          maxDeployAngle_deg: wingDef.maxDeployAngle_deg ?? 45,
          returnTimeMs:       wingDef.returnTimeMs ?? 350,
          pivotRadius_cm:     wingDef.pivotRadius_cm ?? wingDef.r_inner_cm,
          outerRadius_cm:     wingDef.r_outer_cm,
        },
      };

    case "deployable_collective":
      return {
        mechanicId: wingDef.bistable ? "burstSuppress" : "contactDeflect",
        params: {
          perWingIndependent: false,
          wingCount:          wingDef.count,
          bistable:           wingDef.bistable ?? false,
          requiresManualReset: wingDef.requiresManualReset ?? false,
          deployThreshold_N:  wingDef.deployThreshold_N ?? 2.0,
          maxDeployAngle_deg: wingDef.maxDeployAngle_deg ?? 45,
        },
      };

    case "free_spin_ring":
      return {
        mechanicId: "freeSpin",
        params: {
          ringMass_g:           wingDef.ringMass_g ?? 3.2,
          ringRadius_cm:        (wingDef.r_inner_cm + wingDef.r_outer_cm) / 2,
          bearingMu:            wingDef.bearingMu ?? 0.02,
          spinDecouplingFactor: wingDef.spinDecouplingFactor ?? 0.85,
        },
      };

    case "mode_switch":
      return {
        mechanicId: "modeSwitch",
        params: {
          modes: wingDef.modePositions ?? [],
        },
      };

    default:
      return null;
  }
}

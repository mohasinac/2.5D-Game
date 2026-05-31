import { describe, it, expect } from "vitest";
import {
  deriveContactPoints,
  deriveWingMechanic,
  type WingDef,
} from "@/utils/partDerive";

const baseWing = (): WingDef => ({
  wingId:       "w1",
  count:        3,
  spacingDeg:   0,
  offsetDeg:    0,
  shape:        "triangle",
  r_inner_cm:   1.2,
  r_outer_cm:   2.7,
  z_base_cm:    0.1,
  z_top_cm:     0.6,
  arcWidth_deg: 60,
  tiltAngle_deg:0,
  movementType: "fixed",
  contactMaterialId: "abs_hard",
  dmgMult:           1.0,
  attackTypeId:      "smash",
  heightProfile:     "flat",
});

describe("deriveContactPoints", () => {
  it("produces N contact points for wingDef.count=N", () => {
    const pts = deriveContactPoints({ ...baseWing(), count: 4 });
    expect(pts).toHaveLength(4);
  });

  it("spacingDeg auto = 360/count when spacingDeg=0", () => {
    const wing = { ...baseWing(), count: 3, spacingDeg: 0, offsetDeg: 0 };
    const pts = deriveContactPoints(wing);
    expect(pts[0].arcStart).toBeCloseTo(-30);
    expect(pts[0].arcEnd).toBeCloseTo(30);
    expect(pts[1].arcStart).toBeCloseTo(90);
    expect(pts[1].arcEnd).toBeCloseTo(150);
    expect(pts[2].arcStart).toBeCloseTo(210);
    expect(pts[2].arcEnd).toBeCloseTo(270);
  });

  it("uses explicit spacingDeg when > 0", () => {
    const wing = { ...baseWing(), count: 2, spacingDeg: 90, offsetDeg: 0 };
    const pts = deriveContactPoints(wing);
    expect(pts[1].arcStart).toBeCloseTo(60);
    expect(pts[1].arcEnd).toBeCloseTo(120);
  });

  it("z_min_cm and z_max_cm from wingDef z_base/z_top", () => {
    const wing = { ...baseWing(), z_base_cm: 0.2, z_top_cm: 0.8 };
    const pts = deriveContactPoints(wing);
    expect(pts[0].z_min_cm).toBe(0.2);
    expect(pts[0].z_max_cm).toBe(0.8);
  });

  it("radiusInner and radiusOuter match wingDef radii", () => {
    const wing = { ...baseWing(), r_inner_cm: 1.5, r_outer_cm: 3.0 };
    const pts = deriveContactPoints(wing);
    for (const pt of pts) {
      expect(pt.radiusInner).toBe(1.5);
      expect(pt.radiusOuter).toBe(3.0);
    }
  });

  it("materialId, dmgMult, attackTypeId copied from wingDef", () => {
    const wing = {
      ...baseWing(),
      contactMaterialId: "metal_zinc",
      dmgMult:           1.5,
      attackTypeId:      "upper",
    };
    const pts = deriveContactPoints(wing);
    expect(pts[0].materialId).toBe("metal_zinc");
    expect(pts[0].dmgMult).toBe(1.5);
    expect(pts[0].attackTypeId).toBe("upper");
  });

  it("wingDefId and wingIndex set correctly on every point", () => {
    const wing = { ...baseWing(), wingId: "test-wing", count: 3 };
    const pts = deriveContactPoints(wing);
    pts.forEach((pt, i) => {
      expect(pt.wingDefId).toBe("test-wing");
      expect(pt.wingIndex).toBe(i);
    });
  });

  it("count=1 produces a single contact point at offsetDeg", () => {
    const wing = { ...baseWing(), count: 1, offsetDeg: 45, arcWidth_deg: 30 };
    const pts = deriveContactPoints(wing);
    expect(pts).toHaveLength(1);
    expect(pts[0].arcStart).toBeCloseTo(30);
    expect(pts[0].arcEnd).toBeCloseTo(60);
  });
});

describe("deriveWingMechanic", () => {
  it("fixed movementType returns null", () => {
    const wing = { ...baseWing(), movementType: "fixed" as const };
    expect(deriveWingMechanic(wing)).toBeNull();
  });

  it("deployable_individual returns contactDeflect mechanic", () => {
    const wing = {
      ...baseWing(),
      movementType:       "deployable_individual" as const,
      deployThreshold_N:  2.0,
      maxDeployAngle_deg: 45,
      returnTimeMs:       350,
      pivotRadius_cm:     1.2,
    };
    const m = deriveWingMechanic(wing);
    expect(m).not.toBeNull();
    expect(m!.mechanicId).toBe("contactDeflect");
    expect(m!.params!.perWingIndependent).toBe(true);
    expect(m!.params!.wingCount).toBe(3);
  });

  it("deployable_individual uses defaults when optional params absent", () => {
    const wing = {
      ...baseWing(),
      movementType: "deployable_individual" as const,
    };
    const m = deriveWingMechanic(wing);
    expect(m!.params!.deployThreshold_N).toBe(2.0);
    expect(m!.params!.maxDeployAngle_deg).toBe(45);
    expect(m!.params!.returnTimeMs).toBe(350);
  });

  it("deployable_collective + bistable=true returns burstSuppress", () => {
    const wing = {
      ...baseWing(),
      movementType: "deployable_collective" as const,
      bistable:     true,
    };
    const m = deriveWingMechanic(wing);
    expect(m!.mechanicId).toBe("burstSuppress");
    expect(m!.params!.bistable).toBe(true);
  });

  it("deployable_collective + bistable=false returns contactDeflect", () => {
    const wing = {
      ...baseWing(),
      movementType: "deployable_collective" as const,
      bistable:     false,
    };
    const m = deriveWingMechanic(wing);
    expect(m!.mechanicId).toBe("contactDeflect");
    expect(m!.params!.perWingIndependent).toBe(false);
  });

  it("free_spin_ring returns freeSpin mechanic with ringMass param", () => {
    const wing = {
      ...baseWing(),
      movementType:          "free_spin_ring" as const,
      ringMass_g:            3.2,
      bearingMu:             0.02,
      spinDecouplingFactor:  0.85,
    };
    const m = deriveWingMechanic(wing);
    expect(m!.mechanicId).toBe("freeSpin");
    expect(m!.params!.ringMass_g).toBe(3.2);
    expect(m!.params!.bearingMu).toBe(0.02);
    expect(m!.params!.spinDecouplingFactor).toBe(0.85);
  });

  it("free_spin_ring ringRadius_cm = average of r_inner and r_outer", () => {
    const wing = {
      ...baseWing(),
      movementType: "free_spin_ring" as const,
      r_inner_cm:   1.5,
      r_outer_cm:   2.5,
    };
    const m = deriveWingMechanic(wing);
    expect(m!.params!.ringRadius_cm).toBeCloseTo(2.0, 6);
  });

  it("free_spin_ring uses defaults when optional params absent", () => {
    const wing = { ...baseWing(), movementType: "free_spin_ring" as const };
    const m = deriveWingMechanic(wing);
    expect(m!.params!.ringMass_g).toBe(3.2);
    expect(m!.params!.bearingMu).toBe(0.02);
    expect(m!.params!.spinDecouplingFactor).toBe(0.85);
  });

  it("mode_switch returns modeSwitch mechanic with modes array", () => {
    const wing = {
      ...baseWing(),
      movementType:  "mode_switch" as const,
      modePositions: [
        { label: "attack",  pivotAngle_deg: 0 },
        { label: "defense", pivotAngle_deg: 45 },
      ],
    };
    const m = deriveWingMechanic(wing);
    expect(m!.mechanicId).toBe("modeSwitch");
    expect(m!.params!.modes).toHaveLength(2);
  });

  it("mode_switch uses empty array when modePositions absent", () => {
    const wing = { ...baseWing(), movementType: "mode_switch" as const };
    const m = deriveWingMechanic(wing);
    expect(m!.params!.modes).toEqual([]);
  });
});

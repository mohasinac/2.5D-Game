// [2.5D] Beyblade System Converter
// Two-step process:
//   1. resolveBeybladeSystem  — inline all part docs + apply active config overrides
//   2. computeBeybladeStats   — convert resolved system to BeybladeStats for the physics engine
// Also exports computeEffectiveRadius — used by SideProfileView, TopDownView, ComputedStatsPanel.

import type {
  BeybladeSystem,
  ARPart,
  SubPart,
  WDPart,
  TipPart,
  CorePart,
  CasingPart,
  BitBeastPart,
  SpinTrackPart,
  AnyPart,
  SubPartAttachment,
  SystemContactPoint,
  BezierPath,
  FourierRadialProfile,
  BezierSplineProfile,
  PartConfiguration,
  PartShape,
} from "../types/beybladeSystem";
import { synthesizeRadialCache, MATERIAL_MULTIPLIERS } from "../types/beybladeSystem";
import type { BeybladeStats, PointOfContact, SpinStealPoint } from "../types/beybladeStats";

// ─── computeEffectiveRadius ───────────────────────────────────────────────────
// Returns the bounding radius (mm) of a part's geometry.
// Priority: bezierPath polygonCache → fourierProfile amplitude → sideProfileSpline peak → outerRadius
export function computeEffectiveRadius(geometry: PartShape, outerRadiusFallback = 0): number {
  // 1. Bezier path polygon cache — exact bounding radius
  if (geometry.bezierPath?.polygonCache?.length) {
    return Math.max(
      ...geometry.bezierPath.polygonCache.map((p) => Math.sqrt(p.x * p.x + p.y * p.y))
    );
  }
  // 2. Fourier profile — analytical upper bound: a0 + Σ √(a²+b²)
  if (geometry.fourierProfile) {
    const fp = geometry.fourierProfile;
    const harmonicSum = fp.harmonics.reduce(
      (sum, h) => sum + Math.sqrt(h.a * h.a + h.b * h.b),
      0
    );
    return fp.a0 + harmonicSum;
  }
  // 3. Side profile spline — peak knot radius (lathe-profile parts)
  if (geometry.sideProfileSpline?.knots?.length) {
    return Math.max(...geometry.sideProfileSpline.knots.map((k) => k.radius));
  }
  // 4. Declared outerRadius fallback
  return outerRadiusFallback;
}

// ─── resolvePartConfig ────────────────────────────────────────────────────────
// Applies config overrides on top of base part values (shallow merge).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolvePartConfig<T extends { configurations: PartConfiguration<any>[] }>(
  part: T,
  configName?: string
): T {
  if (!configName) return part;
  const config = part.configurations.find((c) => c.name === configName);
  if (!config) return part;
  return { ...part, ...config.overrides } as T;
}

// ─── Part map types ───────────────────────────────────────────────────────────

export interface PartDocMap {
  [id: string]: AnyPart;
}

export interface ResolvedBeybladeSystem {
  system: BeybladeSystem;
  bitBeast?: BitBeastPart;
  attackRing: ARPart;
  weightDisk: WDPart;
  tip: TipPart;
  core?: CorePart;
  casing: CasingPart;
  spinTrack?: SpinTrackPart;
  subParts: Array<{ attachment: SubPartAttachment; part: SubPart }>;
}

// ─── resolveBeybladeSystem ────────────────────────────────────────────────────
// Fetches parts from partDocs, applies activeConfigs overrides, returns resolved system.
// partDocs: flat map of { [partId]: AnyPart } containing all parts referenced by the system.
export function resolveBeybladeSystem(
  system: BeybladeSystem,
  partDocs: PartDocMap
): ResolvedBeybladeSystem {
  function getRequired<T extends AnyPart>(id: string, label: string): T {
    const p = partDocs[id];
    if (!p) throw new Error(`[resolveBeybladeSystem] Missing part "${label}" id=${id}`);
    return p as T;
  }

  const ar = resolvePartConfig(
    getRequired<ARPart>(system.attackRingId, "attackRing"),
    system.activeConfigs.attackRing
  );
  const wd = resolvePartConfig(
    getRequired<WDPart>(system.weightDiskId, "weightDisk"),
    system.activeConfigs.weightDisk
  );
  const tip = resolvePartConfig(
    getRequired<TipPart>(system.tipId, "tip"),
    system.activeConfigs.tip
  );
  const casing = resolvePartConfig(
    getRequired<CasingPart>(system.casingId, "casing"),
    system.activeConfigs.casing
  );

  const bitBeast = system.bitBeastId
    ? resolvePartConfig(
        getRequired<BitBeastPart>(system.bitBeastId, "bitBeast"),
        system.activeConfigs.bitBeast
      )
    : undefined;

  const core = system.coreId
    ? resolvePartConfig(
        getRequired<CorePart>(system.coreId, "core"),
        system.activeConfigs.core
      )
    : undefined;

  const subParts = system.subPartAttachments.map((attachment, idx) => {
    const part = resolvePartConfig(
      getRequired<SubPart>(attachment.subPartId, `subPart[${idx}]`),
      attachment.activeConfig
    );
    return { attachment, part };
  });

  const spinTrack = system.spinTrackId
    ? resolvePartConfig(
        getRequired<SpinTrackPart>(system.spinTrackId, "spinTrack"),
        system.activeConfigs?.spinTrack
      )
    : undefined;

  return { system, bitBeast, attackRing: ar, weightDisk: wd, tip, core, casing, spinTrack, subParts };
}

// ─── computeBeybladeStats ─────────────────────────────────────────────────────
// Converts a resolved BeybladeSystem into BeybladeStats for the physics engine.
// Sub-part CPs are included only when mode='fixed' (or wrong-direction partial_slip at rest).
// Runtime spin-state exclusion is handled server-side; this gives the static baseline.
export function computeBeybladeStats(
  resolved: ResolvedBeybladeSystem,
  subPartSpinsAtRest = true // true = assume all sub-parts are at rest (static baseline)
): BeybladeStats {
  const { system, bitBeast, attackRing, weightDisk, tip, core, casing, subParts } = resolved;

  // ── Effective radius (cm) ──
  const arRadius = computeEffectiveRadius(
    attackRing.geometry,
    attackRing.dimensions.outerRadius
  );
  const wdRadius = computeEffectiveRadius(
    weightDisk.geometry,
    weightDisk.dimensions.outerRadius
  );
  const effectiveRadiusCm = Math.max(arRadius, wdRadius) / 10;

  // ── Mass (g) ──
  const partMasses: number[] = [
    weightDisk.weight,
    core?.weight ?? 0,
    bitBeast?.weight ?? 0,
  ];
  const pocketMass = [attackRing, weightDisk, casing as AnyPart].reduce((sum, p) => {
    return (
      sum +
      p.pockets.reduce((ps, pocket) => ps + pocket.ballCount * (pocket.ballMaterial === "metal" ? 2 : 0.5), 0)
    );
  }, 0);
  const subPartMass = subParts.reduce((sum, { part }) => sum + part.weight, 0);
  const totalMass = partMasses.reduce((a, b) => a + b, 0) + pocketMass + subPartMass;

  // ── Gather all contact points ──
  const allCPs: SystemContactPoint[] = [
    ...attackRing.contactPoints,
    ...weightDisk.contactPoints,
    ...casing.contactPoints,
    ...(tip as unknown as { contactPoints?: SystemContactPoint[] }).contactPoints ?? [],
  ];

  // Include sub-part CPs based on mode
  for (const { part, attachment } of subParts) {
    const include =
      part.mode === "fixed" ||
      (subPartSpinsAtRest && part.mode !== "free_spin");
    if (include) {
      allCPs.push(...part.contactPoints);
    }
  }

  // ── Split into pointsOfContact / spinStealPoints ──
  const pointsOfContact: PointOfContact[] = [];
  const spinStealPoints: SpinStealPoint[] = [];

  for (const cp of allCPs) {
    const matMult = MATERIAL_MULTIPLIERS[cp.material] ?? MATERIAL_MULTIPLIERS["abs"];
    if (cp.attackType === "spin_steal" || cp.material === "rubber") {
      spinStealPoints.push({
        angle: cp.angle,
        spinStealMultiplier: matMult.spinSteal * cp.damageMultiplier,
        width: cp.width,
      });
    } else {
      pointsOfContact.push({
        angle: cp.angle,
        damageMultiplier: matMult.damage * cp.damageMultiplier,
        width: cp.width,
      });
    }
  }

  // ── Type distribution ──
  const metalCPCount = allCPs.filter((c) => c.material === "metal").length;
  const rubberCPCount = allCPs.filter((c) => c.material === "rubber").length;
  const totalCPs = allCPs.length || 1;
  const attackScore = Math.min(150, Math.round((metalCPCount / totalCPs) * 150));
  const defenseScore = Math.min(150, Math.round((weightDisk.weight / 20) * 150));
  const staminaScore = Math.min(150, Math.round(tip.gripFactor * 150));
  const total = attackScore + defenseScore + staminaScore;

  // ── Derived stats (mirrors server formula from CLAUDE.md) ──
  const damageMultiplier = 1.0 + attackScore * 0.007;
  const damageTaken = 1 - defenseScore * 0.003;
  const spinDecayRate = 8 * (1 - staminaScore * 0.001) * (1 + tip.gripFactor * 0.3);
  const maxSpin = 2000 * (1 + staminaScore * 0.0008);

  // ── Tip offset ──
  const tipPos = casing.slots.tipSlot.position;
  const tipOffsetX = tipPos === "center" ? 0 : tipPos.x;
  const tipOffsetY = tipPos === "center" ? 0 : tipPos.y;

  const beyType =
    attackScore >= defenseScore && attackScore >= staminaScore
      ? "attack"
      : defenseScore >= attackScore && defenseScore >= staminaScore
      ? "defense"
      : staminaScore >= attackScore && staminaScore >= defenseScore
      ? "stamina"
      : "balanced";

  return {
    id: system.linkedStatsId ?? system.id,
    displayName: system.displayName,
    fileName: system.id,
    type: beyType,
    spinDirection: system.spinDirection,
    mass: totalMass,
    radius: effectiveRadiusCm,
    typeDistribution: {
      attack: attackScore,
      defense: defenseScore,
      stamina: staminaScore,
      total,
    },
    damageMultiplier,
    damageTaken,
    knockbackDistance: 1.0 - defenseScore * 0.002,
    invulnerabilityChance: defenseScore * 0.001,
    spinDecayRate,
    maxSpin,
    spinStealFactor: rubberCPCount / totalCPs,
    maxStamina: staminaScore * 10,
    pointsOfContact,
    spinStealPoints: spinStealPoints.length ? spinStealPoints : undefined,
  };
}

// ─── Helper: ensure Fourier radialCache is populated ─────────────────────────
export function ensureRadialCache(fp: FourierRadialProfile): FourierRadialProfile {
  if (fp.radialCache?.length === 360) return fp;
  return { ...fp, radialCache: synthesizeRadialCache(fp) };
}

// ─── Helper: sample BezierSplineProfile at a given height ────────────────────
// Linear interpolation between knots (Catmull-Rom smooth version deferred to editor).
export function sampleSplineRadius(
  spline: BezierSplineProfile,
  height: number
): number {
  const knots = spline.knots;
  if (!knots.length) return 0;
  if (height <= knots[0].height) return knots[0].radius;
  if (height >= knots[knots.length - 1].height) return knots[knots.length - 1].radius;
  for (let i = 0; i < knots.length - 1; i++) {
    const k0 = knots[i];
    const k1 = knots[i + 1];
    if (height >= k0.height && height <= k1.height) {
      const t = (height - k0.height) / (k1.height - k0.height);
      return k0.radius + t * (k1.radius - k0.radius);
    }
  }
  return knots[knots.length - 1].radius;
}

// ─── Helper: get bottom circle radius for a part with bottomMimic=false ──────
export function getBottomCircleRadius(geometry: PartShape, innerRadiusFallback = 0): number {
  if (geometry.sideProfileSpline?.knots?.length) {
    return geometry.sideProfileSpline.knots[0].radius;
  }
  return innerRadiusFallback;
}

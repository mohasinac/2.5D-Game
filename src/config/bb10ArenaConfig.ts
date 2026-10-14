import type { ArenaConfig } from '../utils/arenaPersistence';

/**
 * BB-10 — the real BeyStadium Attack Type, at anime scale.
 *
 * Source: `case study/10 case study.md` Case 545, tagged [REAL-WORLD CONFIRMED],
 * with the Tornado Ridge engagement window from Case 546 and the Sliding Shoot
 * trajectory budget from Case 547.
 *
 * WHAT IS FAITHFUL TO THE SOURCE
 * ──────────────────────────────
 * - The five-zone radial section, via `wallProfile: 'bb10'` (flat centre /
 *   ~30deg slope / 16.7deg Tornado Ridge / ~50deg second incline / vertical
 *   wall). Zone fractions and the 3-of-61 mm ridge height come from `BB10` in
 *   arenaConstants and are shared with the physics surface.
 * - **3 walls and 3 exits.** Case 545 derives P(ejection) = 0.492 from the
 *   circumference split: 3 wall chords of 155 mm (465 mm, 43.5%) against 3 exit
 *   chords of 150 mm (450 mm, 42.1%), with 153 mm of transitions. The three
 *   60deg wall arcs below, separated by three 60deg gaps, reproduce that
 *   near-even wall:exit ratio — which is the thing that balances Defence types.
 *
 * WHAT IS DELIBERATELY NOT FAITHFUL
 * ─────────────────────────────────
 * - **Scale.** The real stadium is 340 mm across. This is 240 cm — roughly 7x.
 *   Sec. H5 of the plan settles this: anime arenas are deliberately enormous
 *   ("the anime's stadiums are huge... the anime takes creative liberties"),
 *   and the goal is the anime, not the toy. BB-10 contributes its *design*, not
 *   its dimensions. Because the profile is expressed in fractions of radius,
 *   the shape is preserved exactly under that scaling.
 * - **Exact exit azimuths.** Case 545 gives the wall/exit *ratio* but not the
 *   placement for this particular stadium (unlike the BX-10 in Case 548, which
 *   does specify chords and azimuths). Even 120deg spacing is therefore an art
 *   choice, not a measurement.
 *
 * ACCEPTANCE (plan Sec. Verification)
 * ───────────────────────────────────
 * A Sliding Shoot at 15deg and 1.50 m/s must arrive at the centre at
 * 2.6-2.8 m/s — a 77-87% gain over a Radial Shoot's 1.3-1.5 m/s. That is a
 * documented number from Case 547, not a tuning target. It cannot be checked
 * until the launcher exists (Phase 11b); the profile shape itself is covered by
 * `tests/unit/bb10Profile.spec.ts`.
 */

/** Bowl radius, cm. Anime scale — see the scale note above. */
const R = 120;

/** Depth, cm. Real ratio is 61 mm drop over a 170 mm radius = 0.359 of R. */
const DEPTH = Math.round(R * (61 / 170));   // 43 cm

/* Three 60deg walls at 0deg / 120deg / 240deg, leaving three 60deg exits
   between them — the Case 545 wall:exit ratio. */
const WALL_ARCS: ReadonlyArray<readonly [number, number]> = [
  [-30, 30], [90, 150], [210, 270],
];

function wall(i: number, arcStart: number, arcEnd: number) {
  return {
    id: `bb10-wall-${i + 1}`, name: `Wall ${String.fromCharCode(65 + i)}`,
    parentId: 'bb10-arena', parentType: 'arena' as const,
    fullPerimeter: false, arcStart, arcEnd,
    basePosX: 0, basePosZ: 0, baseRotY: 0, baseLength: 80,
    // Real wall is 30 mm on a 170 mm radius = 0.176 of R.
    height: Math.round(R * (30 / 170)), tilt: 0,
    thickness: 2, thicknessDirection: 'outward' as const,
    hasGaps: false, gapWidth: 10, panelWidth: 20,
    topProfile: 'flat' as const, topAmplitude: 0, topFrequency: 4,
    isDouble: false, peakHeight: 5, peakTilt: 10,
    holes: [], isDestructible: false, hitPoints: 100,
    autoJoin: false, moatRing: 'outer' as const,
    rotateOnArena: false, arenaRotateMode: 'continuous' as const,
    arenaRotateSpeed: 30, arenaRotateStepDeg: 30, arenaRotateStepInterval: 1,
    arenaRotateOscAmp: 45, arenaRotateOscFreq: 0.5,
    color: 0xb9c2d0, surface: 'plain' as const, customTileData: null, tileScale: 20,
    emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
    material: 'abs' as const, presentStlb64: null, presentColor: 0xffffff,
  };
}

export const BB10_ARENA_CONFIG: ArenaConfig = {
  baseConfig: {
    height: 30, sides: 8, color: 0xc0c8d8, surface: 'plain',
    customTileData: null, tileScale: 20, apothem: 100,
  },
  arenas: [
    {
      id: 'bb10-arena', name: 'BB-10 Attack Type',
      openingShape: 'circle',
      wallProfile: 'bb10',          // ← the five-zone section
      radiusX: R, radiusZ: R, depth: DEPTH,
      sides: 6, starInner: 0.5,
      color: 0xdde3ec, surface: 'plain', customTileData: null, tileScale: 20,
      baseMaterial: 'abs',          // real BB-10 is ABS; drives restitution 0.65
      posX: 0, posZ: 0, posY: 0, rotY: 0,
      isMoat: false, innerRadiusX: 15, innerRadiusZ: 15,
      innerOpeningShape: 'circle', innerSides: 6, innerStarInner: 0.5,
      innerWallProfile: 'parabolic', innerRimOffset: 10,
      stepApplyToAll: true,         // one profile for the whole perimeter
      stepEdgeProfiles: [], stepArcDivisions: 4,
      stepCount: 3, stepStartDepth: 5, stepRiserProfile: 'parabolic',
      rampMode: 'none', rampAngle: 20, rampWidth: 20,
      spiralTurns: 2, spiralClockwise: false, spiralCount: 1,
      spiralLedgeWidth: 5, spiralLedgeHeight: 2, spiralRadiusFrac: 0.7,
      stepsColor: null, stepsSurface: null, stepsCustomTileData: null,
      spiralColor: null, spiralSurface: null, spiralCustomTileData: null,
      lightColor: 0xffffff, lightIntensity: 0.9, lightPosY: 140, lightRange: 320,
      particlePreset: 'none',
      presentStlb64: null, presentColor: 0xffffff,
      pits: [], zones: [],
      walls: WALL_ARCS.map(([s, e], i) => wall(i, s, e)),
      speedLines: [],
    },
  ],
  arenaSeq: 2, pitSeq: 0, zoneSeq: 0,
  wallSeq: WALL_ARCS.length + 1, bridgeSeq: 0, segmentSeq: 0,
  speedLineSeq: 1,
  speedLines: [],
  baseWalls: [],
  bridges: [],
  obstacles: [], obstacleSeq: 0,
  traps: [],     trapSeq: 0,
  portals: [],   portalSeq: 0,
  rotations: [], rotationSeq: 0,
  footings: [],  footingSeq: 0,
  jumpLinks: [], jumpLinkSeq: 0,
  translations: [], translationSeq: 0,
};

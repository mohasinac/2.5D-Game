import { defaultArena } from '../../geometry/arenaObjectBuilders';
import { arenaToSave } from '../../utils/arenaPersistence';
import type { ArenaConfig, ObstacleSave } from '../../utils/arenaPersistence';
import { DEFAULT_BASE_HEIGHT, APOTHEM } from '../arenaConstants';
import type { ArenaData, SurfaceType, WallProfile } from '../../types/arenaTypes';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 17 — ARENA BLUEPRINTS

   CS10 specs 19 of the 30 anime stadiums NUMERICALLY: diameters, zone radii,
   slopes, surface friction and restitution, and the mechanic parameters. So
   these are authored from case numbers, not eyeballed from screenshots —
   the screenshot becomes the sanity check rather than the source.

   WHY A BLUEPRINT LAYER. A full `ArenaConfig` is a save DTO: every seq
   counter, every empty child array, every wall and trap record. The shipped
   demo arena is ~400 lines for one stadium. Writing nineteen of those by
   hand would be nineteen chances to mistype a field that no type error
   catches because the shape is still valid — and the interesting content,
   the CS10 numbers, would be buried in boilerplate.

   A blueprint is the numbers and nothing else; `expand` produces the DTO.
   Each stadium below is ten or fifteen lines of real measurements, which is
   also the form in which they can be CHECKED against the case.

   UNITS: CS10 works in millimetres, the project in centimetres. Every
   diameter below is converted at the point of use via `mm`, never silently.
   ══════════════════════════════════════════════════════════════════════════ */

/** CS10 gives millimetres; the project is centimetres. State it once. */
export const mm = (millimetres: number): number => millimetres / 10;

export interface ObstacleBlueprint {
  name: string;
  shape: 'cube' | 'cuboid' | 'sphere' | 'cylinder' | 'pyramid' | 'frustum';
  /** cm */
  dimX: number; dimY: number; dimZ: number;
  posX: number; posY: number; posZ: number;
  rotY?: number;
  color?: number;
}

export interface ArenaBlueprint {
  id: string;
  name: string;
  /** The CS10 case this is built from, for traceability. */
  caseNum: number;
  /** Bowl radius, cm. */
  radius: number;
  /** Optional second radius for an oval dish, cm. */
  radiusZ?: number;
  /** Bowl depth, cm. */
  depth: number;
  profile: WallProfile;
  surface: ExtendedSurface;
  color: number;
  /** Octagon base apothem, cm. Defaults to the project's fixed 2 m base. */
  baseApothem?: number;
  /** Per-arena gravity multiplier. The Moon arena's whole mechanic. */
  gravityScale?: number;
  /** Steps, for a terraced bowl. */
  stepCount?: number;
  obstacles?: ObstacleBlueprint[];
  /** What the case says is interesting about this stadium. */
  notes: string;
}

/* ── MATERIALS CS10 NEEDS AND THIS PROJECT DOES NOT HAVE ─────────────────
   `SurfaceType` carries thirteen values and FOUR of the materials CS10's
   stadiums are made of are not among them: stone, grass, water and asphalt.
   They are mapped to the nearest available type below rather than invented,
   and the mapping is wrong in at least one place that matters — water is
   given as mu 0.80-1.20 by CS10 (ploughing resistance, the HIGHEST in the
   table) whereas the nearest type we have, `ice`, is 0.03-0.05, the LOWEST.
   Using it would make the Tsunami Stadium behave like a skating rink.
   `sand` at 0.45 is the closest in the one dimension that affects play.

   Recorded here rather than silently resolved: the real fix is four new
   surface types with their own CS10 mu/e, which is an `arenaConstants` and
   texture change, not a blueprint one.                                     */
export const SURFACE_FALLBACK = {
  stone:   'concrete',
  grass:   'plain',
  water:   'sand',
  asphalt: 'concrete',
} as const satisfies Record<string, SurfaceType>;

export type ExtendedSurface = SurfaceType | keyof typeof SURFACE_FALLBACK;

/** Resolve an extended name to a type the renderer actually supports. */
export function resolveSurface(s: ExtendedSurface): SurfaceType {
  return (SURFACE_FALLBACK as Record<string, SurfaceType>)[s] ?? (s as SurfaceType);
}

/** Empty collections, so each blueprint only states what it changes. */
function emptyConfig(baseApothem: number): ArenaConfig {
  return {
    baseConfig: {
      height: DEFAULT_BASE_HEIGHT, sides: 8, color: 0x2a2a3a,
      surface: 'concrete', customTileData: null, tileScale: 20,
      apothem: baseApothem,
    },
    arenas: [], arenaSeq: 1, pitSeq: 1, zoneSeq: 1,
    bridges: [], wallSeq: 1, bridgeSeq: 1, segmentSeq: 1,
    speedLineSeq: 1, speedLines: [], baseWalls: [],
    obstacles: [], obstacleSeq: 1,
    traps: [], trapSeq: 1,
    portals: [], portalSeq: 1,
    rotations: [], rotationSeq: 1,
    footings: [], footingSeq: 1,
    jumpLinks: [], jumpLinkSeq: 1,
    translations: [], translationSeq: 1,
  };
}

function obstacleSave(id: string, b: ObstacleBlueprint): ObstacleSave {
  return {
    id, name: b.name, shape: b.shape,
    dimX: b.dimX, dimY: b.dimY, dimZ: b.dimZ,
    posX: b.posX, posY: b.posY, posZ: b.posZ,
    rotX: 0, rotY: b.rotY ?? 0, rotZ: 0,
    isFloating: true, isDestructible: false, hitPoints: 100,
    contactForceX: 0, contactForceY: 0, contactForceZ: 0,
    color: b.color ?? 0x8899aa, surface: 'concrete',
    customTileData: null, tileScale: 20,
    emissiveColor: 0x000000, emissiveIntensity: 0, opacity: 1,
    material: 'stone', modelId: null, theme: 'none',
    speedPathId: null, presentStlb64: null, presentColor: 0xffffff,
    weight: 100, visible: true, hideOnTrapIds: [],
  } as unknown as ObstacleSave;
}

/** Blueprint → a loadable `ArenaConfig`. */
export function expand(bp: ArenaBlueprint): ArenaConfig {
  const cfg = emptyConfig(bp.baseApothem ?? APOTHEM);

  const arena: ArenaData = {
    ...defaultArena(bp.name),
    openingShape: 'circle',
    wallProfile: bp.profile,
    radiusX: bp.radius,
    radiusZ: bp.radiusZ ?? bp.radius,
    depth: bp.depth,
    color: bp.color,
    surface: resolveSurface(bp.surface),
    gravityScale: bp.gravityScale ?? 1,
    stepCount: bp.stepCount ?? 4,
  };

  cfg.arenas = [arenaToSave('arena-1', arena, new Map(), new Map())];
  cfg.arenaSeq = 2;

  (bp.obstacles ?? []).forEach((o, i) => {
    cfg.obstacles.push(obstacleSave(`obstacle-${i + 1}`, o));
  });
  cfg.obstacleSeq = (bp.obstacles?.length ?? 0) + 1;

  return cfg;
}

/** Expand a whole catalogue, keyed by id. */
export function expandAll(bps: readonly ArenaBlueprint[]): Record<string, ArenaConfig> {
  const out: Record<string, ArenaConfig> = {};
  for (const bp of bps) out[bp.id] = expand(bp);
  return out;
}

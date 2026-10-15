import { mm, type ArenaBlueprint } from './blueprint';

/* ══════════════════════════════════════════════════════════════════════════
   THE CS10-SPECCED STADIUMS

   Each entry carries the case number it was built from, so any figure here
   can be checked against the corpus rather than taken on trust. CS10's 24
   arena cases give diameters, zone radii, slopes and surface tables for 19
   of the 30 anime stadiums in the reference folder — these are authored from
   those numbers, with the screenshot as a sanity check rather than a source.

   The remaining ~11 (Grand Canyon, Ramp Dish, Batcave, Floater, Playground,
   Rooftop Electric, Fog Dish, and the unlabelled ones) have NO case and stay
   screenshot-only. They are not listed here, because a blueprint with
   invented numbers would be indistinguishable from a sourced one — which is
   the whole failure this file is arranged to avoid.
   ══════════════════════════════════════════════════════════════════════════ */

export const CS10_ARENAS: readonly ArenaBlueprint[] = [
  {
    id: 'bba-white', name: 'Original BBA Stadium', caseNum: 558,
    /* 290 mm housing, 250 mm bowl, two zones: a flat centre and a 38.1°
       slope, with four corner pockets. The baseline shape that Punch Bowl,
       Small Bowl and Large Bowl are all variations on. */
    radius: mm(250) / 2, depth: mm(250) / 2 * Math.tan(38.1 * Math.PI / 180) * 0.5,
    profile: 'parabolic', surface: 'plain', color: 0xe8e8ec,
    notes: 'flat centre + 38.1° slope, 4 corner pockets',
  },
  {
    id: 'tower', name: 'Tower Arena', caseNum: 563,
    /* 2000 mm sphere-section bowl on a 1000 mm column, R_sphere 1025 mm,
       three zones, and a raised 300 mm inner platform with a 10-second
       solo-hold win condition. The pillar is the plan's obstacle-collision
       acceptance case. */
    radius: mm(2000) / 2, depth: mm(300),
    profile: 'parabolic', surface: 'metal', color: 0x6a7080,
    obstacles: [{
      name: 'Central Column', shape: 'frustum',
      dimX: mm(1000), dimY: mm(600), dimZ: mm(760),
      posX: 0, posY: -mm(150), posZ: 0, color: 0x8a8f9a,
    }],
    notes: 'sphere-section bowl, raised inner platform, 5 petal exits',
  },
  {
    id: 'colosseum', name: 'Roman Colosseum', caseNum: 564,
    /* 3000 mm, eight concentric stepped terraces of 100 mm each at a 27.8°
       drop angle, marble centre out to terracotta rings. ZERO ring-out
       exits — this stadium can only be won by spin-out, which is why it
       needed real spin decay before it meant anything. */
    radius: mm(3000) / 2, depth: mm(800), stepCount: 8,
    profile: 'step', surface: 'stone', color: 0xd9c9a8,
    notes: '8 terraces, 27.8° drop, NO exits — spin-out only',
  },
  {
    id: 'moon-trampoline', name: 'Moon Base Trampoline', caseNum: 577,
    /* g_moon = 1.625 m/s² — one sixth of Earth, giving the 6.03x bounce
       height the case computes. The whole stadium is one parameter. */
    radius: mm(2400) / 2, depth: mm(500),
    profile: 'parabolic', surface: 'metal', color: 0x9aa0ad,
    gravityScale: 1.625 / 9.81,
    obstacles: [{
      name: 'Central Tower', shape: 'cylinder',
      dimX: mm(300), dimY: mm(700), dimZ: mm(300),
      posX: 0, posY: -mm(100), posZ: 0, color: 0xcc4444,
    }],
    notes: '1/6 gravity, 6.03x bounce, central tower with a red danger band',
  },
  {
    id: 'blizzard-s1', name: 'Blizzard Bowl (Season 1)', caseNum: 574,
    /* 1200 mm, the smaller Season-1 version. Snow accumulates and shrinks
       the arena FROM THE RIM IN — the `rim_in` direction in
       `sim/step/surfaceState.ts` exists for this case specifically. */
    radius: mm(1200) / 2, depth: mm(260),
    profile: 'parabolic', surface: 'ice', color: 0xdce8f2,
    notes: 'snow accumulation rim-in, wind gusts, periodic avalanche dumps',
  },
  {
    id: 'brick-courtyard', name: 'Brick Courtyard', caseNum: 573,
    /* Oval 1400 x 1000 mm. Rain accumulates CENTRE-OUT — the opposite
       direction to the Blizzard Bowl, which is why surface mutation is one
       mechanic with a direction rather than two mechanics. */
    radius: mm(1400) / 2, radiusZ: mm(1000) / 2, depth: mm(200),
    profile: 'straight', surface: 'concrete', color: 0xa86a52,
    notes: 'progressive rain shrinking the arena centre-out, mortar-joint grid',
  },
  {
    id: 'tree-stump', name: 'Tree Stump Bowl', caseNum: 572,
    /* 1000 mm — the smallest stadium. Annual growth-ring ridges WITH GAPS:
       a second, simpler Tornado-Ridge-like mechanic worth reusing here. */
    radius: mm(1000) / 2, depth: mm(180), stepCount: 6,
    profile: 'step', surface: 'wood', color: 0xb98a52,
    notes: 'growth-ring ridges with gaps — a simpler tornado ridge',
  },
  {
    id: 'obstacle-dish', name: 'Obstacle Dish', caseNum: 576,
    /* 2000 mm with eight obstacle categories at 18% floor and 12% wall
       coverage. The acceptance stadium for lateral obstacle collision —
       before Phase 5 every one of these was scenery. */
    radius: mm(2000) / 2, depth: mm(400),
    profile: 'parabolic', surface: 'concrete', color: 0x7a8088,
    obstacles: [
      { name: 'Spike Cone A', shape: 'pyramid', dimX: 12, dimY: 16, dimZ: 12, posX: 35, posY: -8, posZ: 0 },
      { name: 'Spike Cone B', shape: 'pyramid', dimX: 12, dimY: 16, dimZ: 12, posX: -35, posY: -8, posZ: 0 },
      { name: 'Floor Block',  shape: 'cuboid',  dimX: 20, dimY: 8,  dimZ: 12, posX: 0, posY: -12, posZ: 40, rotY: 30 },
      { name: 'Wooden Log',   shape: 'cylinder', dimX: 10, dimY: 34, dimZ: 10, posX: 0, posY: -12, posZ: -40, rotY: 0 },
      { name: 'Divider Plate', shape: 'cuboid', dimX: 30, dimY: 10, dimZ: 3, posX: 20, posY: -10, posZ: -20, rotY: 65 },
    ],
    notes: '8 obstacle categories, 18% floor / 12% wall coverage',
  },
  {
    id: 'sand-pagoda', name: 'Sand Pagoda', caseNum: 570,
    /* 2000 mm, three terraced levels with 55° ramps between them and three
       indestructible conical pagodas, deep sand at the centre. */
    radius: mm(2000) / 2, depth: mm(450), stepCount: 3,
    profile: 'step', surface: 'sand', color: 0xd8c08a,
    obstacles: [
      { name: 'Pagoda N', shape: 'frustum', dimX: 26, dimY: 40, dimZ: 8, posX: 0,   posY: 0, posZ: -45 },
      { name: 'Pagoda SE', shape: 'frustum', dimX: 26, dimY: 40, dimZ: 8, posX: 39,  posY: 0, posZ: 22 },
      { name: 'Pagoda SW', shape: 'frustum', dimX: 26, dimY: 40, dimZ: 8, posX: -39, posY: 0, posZ: 22 },
    ],
    notes: '3 terraces, 3 conical pagodas, 55° ramps, deep sand centre',
  },
  {
    id: 'white-house', name: 'White House Bowl', caseNum: 569,
    /* 2400 mm, 40° bowl slope, an indestructible central building with a
       roof platform, and 18 destructible trees that break above 1.01 m/s —
       the first real use for the editor-only `isDestructible` flag. */
    radius: mm(2400) / 2, depth: mm(520),
    profile: 'parabolic', surface: 'grass', color: 0x6f8f5a,
    obstacles: [{
      name: 'Central Building', shape: 'cuboid',
      dimX: 40, dimY: 30, dimZ: 30, posX: 0, posY: -10, posZ: 0, color: 0xf0f0e8,
    }],
    notes: 'indestructible building + roof platform, 18 breakable trees',
  },
  {
    id: 'forbidden-city', name: 'Forbidden City Dish', caseNum: 571,
    radius: mm(2000) / 2, radiusZ: mm(1500) / 2, depth: mm(380),
    profile: 'straight', surface: 'stone', color: 0xb4452f,
    obstacles: [{
      name: 'Imperial Gate Hall', shape: 'cuboid',
      dimX: mm(1000), dimY: 24, dimZ: mm(700), posX: 0, posY: -8, posZ: 0, color: 0xc85a3a,
    }],
    notes: 'raised central platform, 2 ramps, hollow arch gate passage',
  },
  {
    id: 'cityscape', name: 'Cityscape Bowl', caseNum: 565,
    radius: mm(2400) / 2, depth: mm(420),
    profile: 'straight', surface: 'concrete', color: 0x5a6068,
    notes: 'building-wall street grid, plazas/boulevards/alleys, 6 rim protrusions',
  },
  {
    id: 'field-of-doom', name: 'Field of Doom (Baseball)', caseNum: 559,
    radius: mm(2000) / 2, radiusZ: mm(1000) / 2, depth: mm(220),
    profile: 'straight', surface: 'grass', color: 0x4f7a3f,
    notes: 'rectangle, asymmetric high/low wall, dual grass-mud surface',
  },
  {
    id: 'tsunami', name: 'Tsunami Stadium', caseNum: 568,
    /* Four water-depth zones, each with its own viscous decay constant —
       the clearest case for per-surface friction actually mattering. */
    radius: mm(2800) / 2, radiusZ: mm(2000) / 2, depth: mm(600),
    profile: 'parabolic', surface: 'water', color: 0x2a6a8f,
    notes: '4-depth water model, volcanic rock climb, tree canopy COR 0',
  },
  {
    id: 'great-wall', name: 'Great Wall Bowl', caseNum: 567,
    /* Three arch tunnels 70 mm tall — the project's literal reference for
       the underground path layer. */
    radius: mm(3000) / 2, radiusZ: mm(1500) / 2, depth: mm(500),
    profile: 'step', surface: 'stone', color: 0x9a8f7a, stepCount: 5,
    notes: 'stone corridors, crenellated climb, 3 arch tunnels (underground)',
  },
  {
    id: 'nj-turnpike', name: 'New Jersey Turnpike Dish', caseNum: 566,
    /* A full 360° vertical loop at R 280 mm — the acceptance case for
       centripetal retention in `sim/step/aerial.ts`. */
    radius: mm(2400) / 2, radiusZ: mm(1800) / 2, depth: mm(450),
    profile: 'parabolic', surface: 'asphalt', color: 0x44484e,
    notes: 'banked highway + full 360° vertical loop (R 280 mm), curbs, flyovers',
  },
  {
    id: 'wok', name: 'Wok Arena', caseNum: 575,
    radius: mm(640) / 2, depth: mm(180),
    profile: 'parabolic', surface: 'metal', color: 0x3a3a3e,
    notes: 'rocking pedestal, dynamic tilt under impact, tau 0.5 s decay',
  },
  {
    id: 'blizzard-vforce', name: 'Blizzard Bowl (V-Force)', caseNum: 560,
    radius: mm(2000) / 2, depth: mm(360),
    profile: 'parabolic', surface: 'ice', color: 0xe4eef6,
    notes: 'flat ice, pine-tree ring boundary with gaps, scattered rocks',
  },
  {
    id: 'rpm-dish', name: 'R.P.M. Dish', caseNum: 561,
    radius: mm(2000) / 2, depth: mm(380),
    profile: 'parabolic', surface: 'metal', color: 0x707684,
    notes: 'motorised central rotating disc, exponential spin-up',
  },
];

/** Look one up by id. */
export function arenaBlueprint(id: string): ArenaBlueprint | undefined {
  return CS10_ARENAS.find(a => a.id === id);
}

/** Stadiums with no CS10 case — screenshot-only, deliberately NOT authored. */
export const SCREENSHOT_ONLY = [
  'grand canyon', 'ramp dish', 'batcave', 'floater', 'playground arena',
  'rooftop electric', 'fog dish', 'desert temple', 'big arenas', 'black arena 1',
] as const;

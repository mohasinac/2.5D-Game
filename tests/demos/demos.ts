/**
 * The feature demo manifest.
 *
 * One entry per *variant*, not per feature family — every wall top profile, every
 * speed-line preset, every trap effect gets its own demo. Entries are generated
 * from the real type unions so a new enum member shows up as a missing demo
 * rather than being silently uncovered.
 *
 * Each entry answers one question, stated in `question`, so a viewer knows what
 * they are meant to be judging.
 */

import type { ArenaConfig } from '../../src/utils/arenaPersistence';
import type {
  OpeningShape, WallProfile, WallTopProfile, ZoneFill, ObstacleShape,
  TrapEffect, TrapVariant, SurfaceType, ArenaMaterial, SpeedLinePresetType,
  SpeedLineExitBehavior, SpeedLineActivationMode, SpeedLineEntryCondition,
  SpeedLineDirection, SpeedLineOscAxis,
} from '../../src/types/arenaTypes';
import type { ParticlePreset, WeatherPreset } from '../../src/types/sharedTypes';
import { DemoDriver } from './driver';
import {
  makeDemoArena, demoWall, demoSpeedLine, demoObstacle, demoTrap,
  demoPortal, demoFooting, demoPit, demoZone, DEMO_ARENA_ID,
} from './arenaFactory';

export interface FeatureDemo {
  id: string;
  family: string;
  label: string;
  question: string;
  config: ArenaConfig;
  focusId?: string;
  focusDistance?: number;
  run(d: DemoDriver): Promise<void>;
}

/* ── Shared behaviours ────────────────────────────────────────────────────── */

/** Drop a bey into the bowl centre and let it find the surface. */
const dropCentre = async (d: DemoDriver): Promise<void> => {
  await d.drop(0, 0, 50);
  await d.settle(2200);
};

/** Drop off-centre so the bey rolls down the bowl and meets the rim. */
const dropOffCentre = async (d: DemoDriver): Promise<void> => {
  await d.drop(34, 0, 45);
  await d.settle(2600);
};

/* Launch speeds are tuned so the bey stays in a 60 cm / 24 cm-deep bowl that has
   no wall. Faster than roughly 220 cm/s and it climbs the parabola and leaves the
   arena, which makes the demo about the launch rather than the feature. Demos
   that deliberately want an escape set their own, higher, velocity. */

/** Fire the bey across the bowl so it strikes whatever is in its path. */
const launchAcross = async (d: DemoDriver): Promise<void> => {
  await d.launch({ x: -34, y: 6, z: 0 }, { x: 210, y: 0, z: 0 });
  await d.settle(2600);
};

/** Send the bey round the bowl so it rides the rim. */
const rimRun = async (d: DemoDriver): Promise<void> => {
  await d.launch({ x: 0, y: 6, z: -34 }, { x: 190, y: 0, z: 0 });
  await d.settle(3000);
};

/* ── Enum lists (kept in sync with src/types) ─────────────────────────────── */

const OPENING_SHAPES: OpeningShape[] =
  ['circle', 'ellipse', 'rectangle', 'hexagon', 'triangle', 'star'];

const WALL_PROFILES: WallProfile[] = ['parabolic', 'straight', 'step', 'spiral'];

const TOP_PROFILES: WallTopProfile[] =
  ['flat', 'triangles', 'waves', 'serrated', 'crenellated'];

const ZONE_FILLS: ZoneFill[] =
  ['water', 'lava', 'swamp', 'poison', 'sand', 'ice', 'void', 'custom'];

const OBSTACLE_SHAPES: ObstacleShape[] =
  ['cube', 'cuboid', 'sphere', 'cylinder', 'pyramid', 'frustum'];

const TRAP_EFFECTS: TrapEffect[] = [
  'damage', 'heal', 'launch', 'reverse_controls', 'freeze', 'buff_zone',
  'hidden_pit', 'chomper', 'gravity_pull', 'earthquake', 'rpm', 'projectile',
];

const TRAP_VARIANT_FOR: Record<TrapEffect, TrapVariant> = {
  damage: 'spike', heal: 'buff', launch: 'trampoline',
  reverse_controls: 'generic', freeze: 'generic', buff_zone: 'buff',
  hidden_pit: 'hidden_pit', chomper: 'chomper', gravity_pull: 'gravity_pull',
  earthquake: 'earthquake', rpm: 'rpm', projectile: 'projectile',
};

const SURFACES: SurfaceType[] = [
  'plain', 'checker', 'grid', 'hex', 'stripes', 'dots',
  'concrete', 'metal', 'wood', 'ice', 'sand', 'lava_rock', 'custom_png',
];

const MATERIALS: ArenaMaterial[] = ['rubber', 'stone', 'abs', 'metal'];

/** All 24 generatable presets — `custom` and `jump` are excluded by design. */
const SL_PRESETS: SpeedLinePresetType[] = [
  'circle', 'ellipse', 'polygon', 'triangle', 'star', 'flower',
  'spiral_in', 'spiral_out', 'helix', 'zigzag', 'wave', 'snake',
  'figure_8', 'lemniscate', 'trefoil', 'cardioid', 'epicycloid',
  'hypocycloid', 'astroid', 'rose_curve', 'damped_wave', 'growing_wave',
  'cosine_wave', 'point_zone',
];

const SL_RAMPS = ['constant', 'accelerate', 'decelerate', 'bell', 'inverse_bell'] as const;

const SL_WAVEFORMS = [
  'sine', 'cosine', 'triangle', 'sawtooth', 'inverse_sawtooth', 'square',
  'pulse', 'exp_rise', 'exp_decay', 'damped_sine', 'growing_sine',
] as const;

const SL_ACTIVATION: SpeedLineActivationMode[] = ['always', 'event', 'periodic', 'proximity'];
const SL_ENTRY: SpeedLineEntryCondition[] = ['always', 'moving_only', 'fast_only', 'slow_only'];
const SL_EXIT: SpeedLineExitBehavior[] = ['normal', 'launch', 'loop', 'special_move', 'jump_link'];
const SL_DIRECTION: SpeedLineDirection[] = ['forward', 'reverse', 'bidirectional'];
const SL_OSC_AXES: SpeedLineOscAxis[] = ['path', 'lateral', 'normal', 'all'];

const PARTICLES: ParticlePreset[] =
  ['embers', 'snow', 'sparks', 'dust', 'bubbles', 'void_motes'];

const WEATHER: WeatherPreset[] = ['rain', 'snow', 'fog', 'sandstorm', 'ash', 'mist'];

/* ── Family builders ──────────────────────────────────────────────────────── */

function bowlDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = [];

  for (const wp of WALL_PROFILES) {
    out.push({
      id: `bowl-profile-${wp}`, family: 'bowl',
      label: `Bowl · wall profile: ${wp}`,
      question: 'Does the bey follow the bowl wall shape, or clip through it?',
      config: makeDemoArena({ arena: { wallProfile: wp } }),
      run: dropOffCentre,
    });
  }

  for (const shape of OPENING_SHAPES) {
    out.push({
      id: `bowl-shape-${shape}`, family: 'bowl',
      label: `Bowl · opening shape: ${shape}`,
      question: 'Is the rim the right shape, and does the bey stay inside it?',
      config: makeDemoArena({ arena: { openingShape: shape } }),
      run: rimRun,
    });
  }

  out.push(
    {
      id: 'bowl-moat', family: 'bowl',
      label: 'Bowl · moat ring',
      question: 'Is there a ring channel with a raised inner island?',
      config: makeDemoArena({ arena: { isMoat: true, innerRadiusX: 26, innerRadiusZ: 26 } }),
      run: dropOffCentre,
    },
    {
      id: 'bowl-moat-tall-island', family: 'bowl',
      label: 'Bowl · moat with tall island',
      question: 'Does the raised island block the bey from the centre?',
      config: makeDemoArena({
        arena: { isMoat: true, innerRadiusX: 26, innerRadiusZ: 26, innerRimOffset: 18 },
      }),
      run: launchAcross,
    },
    {
      id: 'bowl-moat-inner-spiral', family: 'bowl',
      label: 'Bowl · moat, spiral inner wall',
      question: 'Does the inner island wall render as a spiral ledge?',
      config: makeDemoArena({
        arena: { isMoat: true, innerWallProfile: 'spiral', innerRimOffset: 14 },
      }),
      run: dropOffCentre,
    },
    {
      id: 'bowl-elevated', family: 'bowl',
      label: 'Bowl · raised above the base (posY 20)',
      question: 'Is the whole bowl lifted, with the rim 20 cm above the octagon?',
      config: makeDemoArena({ arena: { posY: 20 } }),
      run: async (d) => { await d.drop(0, 0, 70); await d.settle(2400); },
    },
    {
      id: 'bowl-shallow', family: 'bowl',
      label: 'Bowl · shallow (depth 6)',
      question: 'Can the bey escape a shallow bowl under its own momentum?',
      config: makeDemoArena({ arena: { depth: 6 } }),
      run: launchAcross,
    },
    {
      id: 'bowl-stepped-many', family: 'bowl',
      label: 'Bowl · stepped, 6 terraces',
      question: 'Does the bey step down each terrace, or fall straight through?',
      config: makeDemoArena({ arena: { wallProfile: 'step', stepCount: 6, stepStartDepth: 4 } }),
      run: dropOffCentre,
    },
    {
      id: 'bowl-ramp', family: 'bowl',
      label: 'Bowl · ramp cut into the wall',
      question: 'Is there a ramp, and does the bey ride up it?',
      config: makeDemoArena({ arena: { rampMode: 'one-side', rampAngle: 25, rampWidth: 26 } }),
      run: rimRun,
    },
  );

  return out;
}

function pitDemos(): FeatureDemo[] {
  return [
    {
      id: 'pit-basic', family: 'pit',
      label: 'Pit · circular, 10 cm fixed depth',
      question: 'Does the bey fall into the pit and stay there?',
      config: makeDemoArena({ pits: [demoPit()] }),
      focusId: 'demo-pit', focusDistance: 70,
      run: async (d) => { await d.drop(28, 0, 40); await d.settle(2600); },
    },
    {
      id: 'pit-shapes', family: 'pit',
      label: 'Pit · star opening',
      question: 'Is the pit mouth star-shaped and cleanly cut into the bowl?',
      config: makeDemoArena({ pits: [demoPit({ openingShape: 'star', radiusX: 18, radiusZ: 18 })] }),
      focusId: 'demo-pit', focusDistance: 70,
      run: async (d) => { await d.drop(28, 0, 40); await d.settle(2400); },
    },
    {
      id: 'pit-offcentre', family: 'pit',
      label: 'Pit · near the rim (posR 44)',
      question: 'Does a pit placed near the rim stay inside the bowl boundary?',
      config: makeDemoArena({ pits: [demoPit({ posR: 44, radiusX: 10, radiusZ: 10 })] }),
      focusId: 'demo-pit', focusDistance: 70,
      run: rimRun,
    },
  ];
}

function zoneDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = ZONE_FILLS.map((fill) => ({
    id: `zone-fill-${fill}`, family: 'zone',
    label: `Zone · fill: ${fill}`,
    question: 'Does the liquid surface animate and clip to the zone opening?',
    config: makeDemoArena({ zones: [demoZone({ fill })] }),
    focusId: 'demo-zone', focusDistance: 80,
    run: async (d) => { await d.drop(0, 0, 45); await d.settle(2600); },
  }));

  out.push(
    {
      id: 'zone-opacity-low', family: 'zone',
      label: 'Zone · fill opacity 0.3',
      question: 'Is the bowl floor visible through the translucent fill?',
      config: makeDemoArena({ zones: [demoZone({ fill: 'water', fillOpacity: 0.3 })] }),
      focusId: 'demo-zone', focusDistance: 80,
      run: dropCentre,
    },
    {
      id: 'zone-glow', family: 'zone',
      label: 'Zone · strong seam glow',
      question: 'Does the seam glow trace the zone edge?',
      config: makeDemoArena({
        zones: [demoZone({ fill: 'lava', seamGlowIntensity: 1, seamGlowColor: 0xff5500 })],
      }),
      focusId: 'demo-zone', focusDistance: 80,
      run: dropCentre,
    },
    {
      id: 'zone-moat', family: 'zone',
      label: 'Zone · moat (ring of liquid)',
      question: 'Is there a liquid ring with a dry island in the middle?',
      config: makeDemoArena({
        zones: [demoZone({ fill: 'water', isMoat: true, radiusX: 30, radiusZ: 30 })],
      }),
      focusId: 'demo-zone', focusDistance: 90,
      run: dropOffCentre,
    },
  );

  return out;
}

function wallDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = [];

  for (const tp of TOP_PROFILES) {
    out.push({
      id: `wall-top-${tp}`, family: 'wall',
      label: `Wall · top profile: ${tp}`,
      question: 'Is the top edge shaped correctly all the way round?',
      config: makeDemoArena({ walls: [demoWall({ topProfile: tp, topAmplitude: 4 })] }),
      run: rimRun,
    });
  }

  for (const [name, tilt] of [['inward', -35], ['vertical', 0], ['outward', 20]] as const) {
    out.push({
      id: `wall-tilt-${name}`, family: 'wall',
      label: `Wall · tilt ${name} (${tilt}°)`,
      question: 'Does the wall lean the right way, and does the bey bounce off it?',
      config: makeDemoArena({
        // Tilt is forced to 0 on a closed ring with no gaps — use an arc so it applies.
        walls: [demoWall({ tilt, fullPerimeter: false, arcStart: -90, arcEnd: 90 })],
      }),
      run: launchAcross,
    });
  }

  for (const mat of MATERIALS) {
    out.push({
      id: `wall-material-${mat}`, family: 'wall',
      label: `Wall · material: ${mat}`,
      question: `Does the bey bounce with ${mat} restitution? (rubber dead, metal lively)`,
      config: makeDemoArena({ walls: [demoWall({ material: mat })] }),
      run: launchAcross,
    });
  }

  for (const shape of ['circle', 'rectangle', 'hexagon', 'triangle', 'star'] as const) {
    out.push({
      id: `wall-hole-${shape}`, family: 'wall',
      label: `Wall · hole: ${shape}`,
      question: 'Is there a hole punched through the wall face?',
      config: makeDemoArena({
        walls: [demoWall({
          height: 18,
          holes: [{ shape, u: 0.5, v: 0.5, sizeU: 0.3, sizeV: 0.5, rot: 0 }] as never,
        })],
      }),
      run: launchAcross,
    });
  }

  out.push(
    {
      id: 'wall-gaps', family: 'wall',
      label: 'Wall · alternating gaps',
      question: 'Are there open gaps, and can the bey escape through one?',
      config: makeDemoArena({
        walls: [demoWall({ hasGaps: true, gapWidth: 30, panelWidth: 30 })],
      }),
      run: rimRun,
    },
    {
      id: 'wall-double', family: 'wall',
      label: 'Wall · double (/\\ cross-section)',
      question: 'Does the wall form a peaked ridge rather than a flat slab?',
      config: makeDemoArena({
        walls: [demoWall({ isDouble: true, peakHeight: 10, peakTilt: 18, height: 16 })],
      }),
      run: launchAcross,
    },
    {
      id: 'wall-thickness-inward', family: 'wall',
      label: 'Wall · thickness inward',
      question: 'Does the wall thicken toward the bowl centre, moving the contact surface in?',
      config: makeDemoArena({
        walls: [demoWall({ thickness: 6, thicknessDirection: 'inward' })],
      }),
      run: launchAcross,
    },
    {
      id: 'wall-thickness-outward', family: 'wall',
      label: 'Wall · thickness outward',
      question: 'Does the wall thicken away from the centre, leaving the contact surface at the rim?',
      config: makeDemoArena({
        walls: [demoWall({ thickness: 6, thicknessDirection: 'outward' })],
      }),
      run: launchAcross,
    },
    {
      id: 'wall-autojoin', family: 'wall',
      label: 'Wall · auto-join between two arcs',
      question: 'Do the two arcs meet seamlessly, with no end-cap wall between them?',
      config: makeDemoArena({
        walls: [
          demoWall({ id: 'w-a', name: 'Arc A', fullPerimeter: false, arcStart: 0, arcEnd: 180, autoJoin: true }),
          demoWall({ id: 'w-b', name: 'Arc B', fullPerimeter: false, arcStart: 180, arcEnd: 360, autoJoin: true }),
        ],
      }),
      run: rimRun,
    },
    {
      id: 'wall-nojoin', family: 'wall',
      label: 'Wall · auto-join OFF between two arcs',
      question: 'Are there visible end caps where the two arcs meet? (contrast with auto-join ON)',
      config: makeDemoArena({
        walls: [
          demoWall({ id: 'w-a', name: 'Arc A', fullPerimeter: false, arcStart: 0, arcEnd: 180, autoJoin: false }),
          demoWall({ id: 'w-b', name: 'Arc B', fullPerimeter: false, arcStart: 180, arcEnd: 360, autoJoin: false }),
        ],
      }),
      run: rimRun,
    },
    {
      id: 'wall-moat-inner', family: 'wall',
      label: 'Wall · on the moat INNER rim',
      question: 'Is the wall on the island edge rather than the outer rim?',
      config: makeDemoArena({
        arena: { isMoat: true, innerRimOffset: 12 },
        walls: [demoWall({ moatRing: 'inner', height: 10 })],
      }),
      run: dropOffCentre,
    },
    {
      id: 'wall-base-parent', family: 'wall',
      label: 'Wall · free-standing on the octagon base',
      question: 'Does a base-parented wall stand outside the bowl?',
      config: makeDemoArena({
        config: {
          baseWalls: [demoWall({
            id: 'base-wall', parentType: 'base', parentId: 'octagon-base',
            basePosX: 80, basePosZ: 0, baseRotY: 90, baseLength: 60, height: 16,
          })],
          wallSeq: 1,
        },
      }),
      focusId: 'base-wall', focusDistance: 90,
      run: async (d) => { await d.drop(80, 0, 50); await d.settle(2200); },
    },
    {
      id: 'wall-rotate-continuous', family: 'wall',
      label: 'Wall · auto-rotate, continuous',
      question: 'Does the wall arc sweep steadily around the arena?',
      config: makeDemoArena({
        walls: [demoWall({
          fullPerimeter: false, arcStart: -40, arcEnd: 40,
          rotateOnArena: true, arenaRotateMode: 'continuous', arenaRotateSpeed: 70,
        })],
      }),
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(4000); },
    },
    {
      id: 'wall-rotate-step', family: 'wall',
      label: 'Wall · auto-rotate, stepped',
      question: 'Does the wall jump in discrete steps rather than sweeping?',
      config: makeDemoArena({
        walls: [demoWall({
          fullPerimeter: false, arcStart: -40, arcEnd: 40,
          rotateOnArena: true, arenaRotateMode: 'step',
          arenaRotateStepDeg: 45, arenaRotateStepInterval: 0.7,
        })],
      }),
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(4000); },
    },
    {
      id: 'wall-rotate-oscillate', family: 'wall',
      label: 'Wall · auto-rotate, oscillating',
      question: 'Does the wall swing back and forth about its start angle?',
      config: makeDemoArena({
        walls: [demoWall({
          fullPerimeter: false, arcStart: -40, arcEnd: 40,
          rotateOnArena: true, arenaRotateMode: 'oscillate',
          arenaRotateOscAmp: 60, arenaRotateOscFreq: 0.6,
        })],
      }),
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(4000); },
    },
    {
      id: 'wall-destructible', family: 'wall',
      label: 'Wall · flagged destructible (100 HP)',
      question: 'Editor flag only — the wall should still behave as solid.',
      config: makeDemoArena({ walls: [demoWall({ isDestructible: true, hitPoints: 100 })] }),
      run: launchAcross,
    },
    {
      id: 'wall-tall', family: 'wall',
      label: 'Wall · tall (30 cm)',
      question: 'Does a tall wall contain a fast bey that a short one would not?',
      config: makeDemoArena({ walls: [demoWall({ height: 30 })] }),
      run: async (d) => {
        await d.launch({ x: -46, y: 14, z: 0 }, { x: 460, y: 60, z: 0 });
        await d.settle(3000);
      },
    },
    {
      id: 'wall-short', family: 'wall',
      label: 'Wall · minimum height (10 cm)',
      question: 'Can a fast bey clear a minimum-height wall? (contrast with the tall wall)',
      config: makeDemoArena({ walls: [demoWall({ height: 10 })] }),
      run: async (d) => {
        await d.launch({ x: -46, y: 14, z: 0 }, { x: 460, y: 60, z: 0 });
        await d.settle(3000);
      },
    },
  );

  return out;
}

function speedLineDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = [];

  for (const preset of SL_PRESETS) {
    out.push({
      id: `sl-preset-${preset}`, family: 'speedline',
      label: `Speed line · preset: ${preset}`,
      question: 'Is the ribbon the right shape, projected onto the bowl surface?',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ presetType: preset })] }),
      focusDistance: 130,
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(3000); },
    });
  }

  for (const profile of SL_RAMPS) {
    out.push({
      id: `sl-ramp-${profile}`, family: 'speedline',
      label: `Speed line · speed ramp: ${profile}`,
      question: 'Does the bey speed up / slow down along the ribbon as the profile implies?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({
          presetType: 'circle',
          speedRamp: { profile, speedMin: 0.4, speedMax: 2.2, entrySteps: 6, exitSteps: 6 },
        } as never)],
      }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3600); },
    });
  }

  for (const waveform of SL_WAVEFORMS) {
    out.push({
      id: `sl-waveform-${waveform}`, family: 'speedline',
      label: `Speed line · modulation waveform: ${waveform}`,
      question: 'Is the circle deformed by this waveform in a recognisable way?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({
          presetType: 'circle',
          presetParams: {
            ...demoSpeedLine().presetParams as object,
            modulation: {
              type: 'radial_scale', waveform, amplitude: 8,
              periodSteps: 10, modPhase: 0, pulseWidth: 0.5,
            },
          },
        } as never)],
      }),
      focusDistance: 130,
      run: async (d) => { await d.settle(900); },
    });
  }

  for (const mode of SL_ACTIVATION) {
    out.push({
      id: `sl-activation-${mode}`, family: 'speedline',
      label: `Speed line · activation: ${mode}`,
      question: 'Does the ribbon exert force only when it should be active?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({ activationMode: mode, activationRadius: 26 })],
      }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3400); },
    });
  }

  for (const cond of SL_ENTRY) {
    out.push({
      id: `sl-entry-${cond}`, family: 'speedline',
      label: `Speed line · entry condition: ${cond}`,
      question: 'Is the bey accepted onto the ribbon only when the condition holds?',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ entryCondition: cond })] }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3400); },
    });
  }

  for (const exit of SL_EXIT) {
    out.push({
      id: `sl-exit-${exit}`, family: 'speedline',
      label: `Speed line · exit behaviour: ${exit}`,
      question: 'What happens to the bey when it reaches the end of the ribbon?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({
          presetType: 'wave', exitBehavior: exit, launchForce: 320,
          presetParams: { ...demoSpeedLine().presetParams as object, closeLoop: false },
        } as never)],
      }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3600); },
    });
  }

  for (const dir of SL_DIRECTION) {
    out.push({
      id: `sl-direction-${dir}`, family: 'speedline',
      label: `Speed line · direction: ${dir}`,
      question: 'Which way is the bey pushed along the ribbon?',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ direction: dir })] }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3400); },
    });
  }

  for (const axis of SL_OSC_AXES) {
    out.push({
      id: `sl-osc-${axis}`, family: 'speedline',
      label: `Speed line · oscillation axis: ${axis}`,
      question: 'Does the bey wobble along the expected axis while on the ribbon?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({
          oscillate: true, oscAxis: axis, oscAmplitude: 4, oscFrequency: 2,
        })],
      }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3400); },
    });
  }

  out.push(
    {
      id: 'sl-wide', family: 'speedline',
      label: 'Speed line · 30 cm wide ribbon',
      question: 'Does the maximum-width ribbon render and still project to the surface?',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ width: 30 })] }),
      focusDistance: 140,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(3000); },
    },
    {
      id: 'sl-flat', family: 'speedline',
      label: 'Speed line · surfaceFollow OFF',
      question: 'Does the ribbon stay flat instead of hugging the bowl curvature?',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ surfaceFollow: false })] }),
      focusDistance: 140,
      run: async (d) => { await d.settle(900); },
    },
    {
      id: 'sl-disabled', family: 'speedline',
      label: 'Speed line · disabled',
      question: 'Is the ribbon hidden AND inert? (nothing should push the bey)',
      config: makeDemoArena({ speedLines: [demoSpeedLine({ enabled: false })] }),
      focusDistance: 130,
      run: async (d) => { await d.drop(38, 0, 40); await d.settle(2800); },
    },
    {
      id: 'sl-arc-half', family: 'speedline',
      label: 'Speed line · arcFraction 0.5 (half circle)',
      question: 'Is only half the circle drawn, cut symmetrically?',
      config: makeDemoArena({
        speedLines: [demoSpeedLine({
          presetParams: { ...demoSpeedLine().presetParams as object, arcFraction: 0.5 },
        } as never)],
      }),
      focusDistance: 130,
      run: async (d) => { await d.settle(900); },
    },
  );

  return out;
}

function obstacleDemos(): FeatureDemo[] {
  return OBSTACLE_SHAPES.map((shape) => ({
    id: `obstacle-${shape}`, family: 'obstacle',
    label: `Obstacle · ${shape}`,
    question: 'Is the shape correct? (note: the bey does NOT collide with obstacles yet)',
    config: makeDemoArena({
      obstacles: [demoObstacle({ shape, posX: 0, posY: 10, posZ: 0 })],
    }),
    focusId: 'demo-obstacle', focusDistance: 70,
    run: launchAcross,
  }));
}

function trapDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = TRAP_EFFECTS.map((effect) => ({
    id: `trap-effect-${effect}`, family: 'trap',
    label: `Trap · effect: ${effect}`,
    question: 'Does the plate render, and does the bey react when it crosses it?',
    config: makeDemoArena({
      traps: [demoTrap({ effect, variant: TRAP_VARIANT_FOR[effect] })],
    }),
    focusId: 'demo-trap', focusDistance: 80,
    run: async (d) => { await d.drop(0, 0, 45); await d.settle(3200); },
  }));

  for (const shape of ['rectangle', 'circle', 'ellipse', 'hexagon'] as const) {
    out.push({
      id: `trap-shape-${shape}`, family: 'trap',
      label: `Trap · footprint: ${shape}`,
      question: 'Is the plate footprint the right shape?',
      config: makeDemoArena({ traps: [demoTrap({ shape, dimX: 30, dimZ: 22 })] }),
      focusId: 'demo-trap', focusDistance: 80,
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(2600); },
    });
  }

  for (const mode of ['random', 'wave', 'ripple', 'checkerboard'] as const) {
    out.push({
      id: `trap-earthquake-${mode}`, family: 'trap',
      label: `Trap · earthquake elevation: ${mode}`,
      question: 'Do the ring segments rise in the named pattern?',
      config: makeDemoArena({
        traps: [demoTrap({
          effect: 'earthquake', variant: 'earthquake', dimX: 60, dimZ: 60,
          eqRingCount: 4, eqSegmentsPerRing: 12, eqMaxElevationCm: 8,
          eqElevationMode: mode, eqPulseMode: true, eqPulseIntervalMs: 1200, eqPulseWidthMs: 700,
        } as never)],
      }),
      focusId: 'demo-trap', focusDistance: 95,
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(4200); },
    });
  }

  for (const surf of ['sand', 'lava', 'ice', 'water', 'oil'] as const) {
    out.push({
      id: `trap-buff-${surf}`, family: 'trap',
      label: `Trap · buff zone: ${surf}`,
      question: 'Does the bey slow / drift as the surface implies while standing on it?',
      config: makeDemoArena({
        traps: [demoTrap({
          effect: 'buff_zone', variant: 'buff', buffSurface: surf, dimX: 40, dimZ: 40,
        } as never)],
      }),
      focusId: 'demo-trap', focusDistance: 85,
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(3600); },
    });
  }

  return out;
}

function portalDemos(): FeatureDemo[] {
  return [
    {
      id: 'portal-world-point', family: 'portal',
      label: 'Portal · destination: world point',
      question: 'Does the bey teleport to the fixed XYZ destination?',
      config: makeDemoArena({ portals: [demoPortal()] }),
      focusId: 'demo-portal', focusDistance: 85,
      run: async (d) => { await d.drop(35, 0, 42); await d.settle(3000); },
    },
    {
      id: 'portal-pair', family: 'portal',
      label: 'Portal · linked pair, bidirectional',
      question: 'Does entering either pad move the bey to the other?',
      config: makeDemoArena({
        portals: [
          demoPortal({ id: 'p-a', name: 'Portal A', destType: 'portal', destPortalId: 'p-b', posAngle: 0 }),
          demoPortal({ id: 'p-b', name: 'Portal B', destType: 'portal', destPortalId: 'p-a', posAngle: 180 }),
        ],
      }),
      focusId: 'p-a', focusDistance: 110,
      run: async (d) => { await d.drop(35, 0, 42); await d.settle(3400); },
    },
    {
      id: 'portal-random-arena', family: 'portal',
      label: 'Portal · destination: random point in arena',
      question: 'Does the bey reappear somewhere inside the bowl?',
      config: makeDemoArena({
        portals: [demoPortal({ destType: 'random_arena', destArenaId: DEMO_ARENA_ID })],
      }),
      focusId: 'demo-portal', focusDistance: 85,
      run: async (d) => { await d.drop(35, 0, 42); await d.settle(3000); },
    },
  ];
}

function footingDemos(): FeatureDemo[] {
  return OBSTACLE_SHAPES.map((shape) => ({
    id: `footing-${shape}`, family: 'footing',
    label: `Footing · ${shape}`,
    question: 'Does the footing sit flush on the octagon base (top face at Y=0)?',
    config: makeDemoArena({ footings: [demoFooting({ shape })] }),
    focusId: 'demo-footing', focusDistance: 70,
    run: async (d) => { await d.drop(70, 0, 50); await d.settle(2400); },
  }));
}

function surfaceDemos(): FeatureDemo[] {
  return SURFACES.map((surface) => ({
    id: `surface-${surface}`, family: 'surface',
    label: `Surface texture · ${surface}`,
    question: 'Is the procedural texture applied to the bowl?',
    config: makeDemoArena({ arena: { surface } }),
    focusDistance: 130,
    run: async (d) => { await d.settle(800); },
  }));
}

function particleDemos(): FeatureDemo[] {
  return PARTICLES.map((preset) => ({
    id: `particle-${preset}`, family: 'particle',
    label: `Particles · ${preset}`,
    question: 'Are particles emitting over the arena?',
    config: makeDemoArena({ arena: { particlePreset: preset } }),
    focusDistance: 140,
    run: async (d) => { await d.settle(1800); },
  }));
}

function environmentDemos(): FeatureDemo[] {
  const out: FeatureDemo[] = WEATHER.map((w) => ({
    id: `env-weather-${w}`, family: 'environment',
    label: `Weather · ${w}`,
    question: 'Is the weather system visible over the arena?',
    config: makeDemoArena({ arena: { weatherPreset: w } as never }),
    focusDistance: 150,
    run: async (d) => { await d.settle(2000); },
  }));

  out.push(
    {
      id: 'env-gravity-low', family: 'environment',
      label: 'Gravity scale 0.25',
      question: 'Does the bey fall noticeably slower than at 1.0?',
      config: makeDemoArena({ arena: { gravityScale: 0.25 } as never }),
      run: async (d) => { await d.drop(0, 0, 70); await d.settle(3200); },
    },
    {
      id: 'env-gravity-high', family: 'environment',
      label: 'Gravity scale 2.5',
      question: 'Does the bey slam down much faster than at 1.0?',
      config: makeDemoArena({ arena: { gravityScale: 2.5 } as never }),
      run: async (d) => { await d.drop(0, 0, 70); await d.settle(2400); },
    },
    {
      id: 'env-tilt', family: 'environment',
      label: 'Arena tilt 12° on X',
      question: 'Is the whole bowl tilted, and does the bey drift downhill?',
      config: makeDemoArena({ arena: { tiltX: 12 } as never }),
      run: dropCentre,
    },
    {
      id: 'env-fog', family: 'environment',
      label: 'Fog density 0.8',
      question: 'Is there a visible fog volume over the arena?',
      config: makeDemoArena({ arena: { fogDensity: 0.8 } as never }),
      focusDistance: 150,
      run: async (d) => { await d.settle(1800); },
    },
    {
      id: 'env-wind', family: 'environment',
      label: 'Wind with gusts',
      question: 'Do weather particles blow along the wind direction and gust periodically?',
      config: makeDemoArena({
        arena: {
          weatherPreset: 'rain', windEnabled: true, windDirectionDeg: 90,
          windStrengthCms: 60, windGustInterval: 2, windGustMult: 2.5,
        } as never,
      }),
      focusDistance: 150,
      run: async (d) => { await d.settle(3000); },
    },
    {
      id: 'env-score', family: 'environment',
      label: 'Scoring: 10 points/second',
      question: 'Does the score HUD appear and tick upward?',
      config: makeDemoArena({ arena: { pointsPerSecond: 10 } as never }),
      run: async (d) => { await d.drop(0, 0, 45); await d.settle(3000); },
    },
    {
      id: 'env-light-off', family: 'environment',
      label: 'Arena light intensity 0',
      question: 'Is the arena lit only by the scene lights? (no point light should be created)',
      config: makeDemoArena({ arena: { lightIntensity: 0 } }),
      focusDistance: 130,
      run: async (d) => { await d.settle(800); },
    },
  );

  return out;
}

/* ── The manifest ─────────────────────────────────────────────────────────── */

export const DEMOS: FeatureDemo[] = [
  ...bowlDemos(),
  ...pitDemos(),
  ...zoneDemos(),
  ...wallDemos(),
  ...speedLineDemos(),
  ...obstacleDemos(),
  ...trapDemos(),
  ...portalDemos(),
  ...footingDemos(),
  ...surfaceDemos(),
  ...particleDemos(),
  ...environmentDemos(),
];

export const FAMILIES = [...new Set(DEMOS.map((d) => d.family))];

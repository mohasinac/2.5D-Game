/**
 * The simulation's data model: plain, serializable, THREE-free.
 *
 * WHY THIS EXISTS
 * ───────────────
 * `SpawnManager` encodes "there is exactly one bey" at every level: its size,
 * mass, gravity and friction are module-level `const`s, so no bey can differ
 * from another; the string `'spawn_ball'` is its entity id in seven places; and
 * physics is gated on whether a mesh exists. Two beys today means instantiating
 * a second manager — with its own HUD, its own keydown listener and its own
 * buff manager — which is how `/special-moves` currently does it, and it does
 * not extend to six.
 *
 * `BeySpec` is what a bey IS (static, from the builder and the STL analysis).
 * `BeyState` is what a bey is DOING (per-tick, mutable, snapshot-able).
 * Neither imports THREE, uses the wall clock, or reads unseeded randomness —
 * which is what makes a replay reproduce and, later, what makes client-side
 * prediction possible without a second rewrite.
 *
 * Vectors are plain `{x,y,z}` rather than `THREE.Vector3` on purpose: a state
 * that can be `structuredClone`d is a state that can be snapshotted, diffed,
 * rewound and sent. `THREE.Vector3` carries prototype methods that do not
 * survive any of those.
 */

/* `arenaConstants` is safe to depend on here: it imports only TYPES from
   `arenaTypes`, which erase at compile time, so no THREE reaches `sim/`.
   `sim/friction.ts` already relies on the same thing. */
import { DEFAULT_TIP_TYPE } from '../config/arenaConstants';
import type { BeyTipType } from '../config/arenaConstants';

export interface Vec3 { x: number; y: number; z: number }

export const vec3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });

/** Spin sense. Signed in physics terms: right-hand = -1 about +Y. */
export type SpinDir = 'right' | 'left';

/** Magnacore polarity. Inert until the magnetism work lands, but authored now. */
export type TipPolarity = 'north' | 'south' | 'none';

/**
 * Static properties of one bey.
 *
 * Every field here was a module-level constant in `SpawnManager`, which is
 * precisely why no two beys could ever differ. Defaults reproduce the current
 * single-entity behaviour exactly, so demoting them changes nothing until a
 * caller supplies something else.
 */
export interface BeySpec {
  id: string;

  /* ── Geometry, cm ── */
  /** XZ collision radius — the disc girth, not the tip. */
  radius: number;
  /** Total height, tip to cap. */
  height: number;
  /** Tip offset from the group origin (disc centre). Negative: below. */
  tipOffset: number;

  /* ── Mass properties ── */
  /** Grams. From the assembled part stack. */
  mass: number;
  /** Moment of inertia about the spin axis, g·cm². From the STL analysis. */
  inertiaSpin: number;
  /** Centre-of-mass height above the contact point, cm. Drives topple torque. */
  comY: number;

  /**
   * Which tip archetype this bey runs, keyed into `BEY_TIP_PROFILES`.
   *
   * The tip supplies the two numbers spin decay needs — friction and contact
   * radius — plus the bearing `coupling` that makes a stamina tip a stamina
   * tip. Held as a key rather than the numbers so a bey's tip can be swapped
   * at runtime (ledger N7) without the spec drifting out of step with the
   * table it came from.
   */
  tipType: BeyTipType;

  /* ── Response ── */
  moveForce: number;
  jumpImpulse: number;
  /** Per-frame XZ damping while grounded, at the reference surface. */
  frictionGround: number;
  /** Per-frame XZ damping while airborne. */
  frictionAir: number;
  maxSpeedH: number;
  restitution: number;
  maxHealth: number;

  /**
   * How much the player overrides the bey's own parts-driven motion.
   * 1 = the blader decides, 0 = the bey does. The Gen 1/2 vs Gen 3/4 dial.
   */
  controlAuthority: number;
}

/**
 * Per-tick state of one bey. Everything here is expected to change during a
 * battle; nothing here is authored.
 */
export interface BeyState {
  id: string;
  pos: Vec3;
  vel: Vec3;
  grounded: boolean;
  health: number;

  /** Angular speed, rad/s. Cosmetic until the spin-decay integrator lands. */
  omega: number;
  spinDir: SpinDir;
  tipPolarity: TipPolarity;

  /** Degrees from vertical. Simulated by the heavy-top model once spin decays. */
  tiltDeg: number;

  /**
   * True once the top has fallen past `SLEEP_OUT_TILT` or run out of spin.
   *
   * A real end state at last: before the heavy-top model there was no way for
   * a bey to lose other than being manually despawned, because `health` is
   * clamped and never compared to zero anywhere in `src`.
   */
  sleptOut: boolean;

  /** Per-arena gravity multiplier, resolved from whatever is underfoot. */
  gravityScale: number;
  /** Friction coefficient of the surface underfoot. See config SURFACE_PHYSICS. */
  surfaceMu: number;

  /** Sim-clock ms of the last wall/bey impact, and whether it stuck. */
  lastCollisionMs: number;
  lastCollisionSticky: boolean;
}

/** Baseline spec — the historical single-entity constants, named. */
export const DEFAULT_BEY_SPEC: Omit<BeySpec, 'id'> = {
  radius:    5,
  height:    13,
  tipOffset: -10,

  /* Placeholders until the assembler composes them from real parts: roughly a
     Galeon-class plastic-gen bey (~30 g). `inertiaSpin` and `comY` are what the
     heavy-top model needs and the STL analyser already measures.

     UNITS: g·cm², and the previous value here was 5.0e-6 — which is a kg·m²
     figure (CS10's whole MFB assembly is 7.3e-6 kg·m²). Off by the 1e7
     conversion factor. Nothing consumed it at the time, so nothing broke, but
     the heavy-top model would have computed a sleep-out threshold of ~154,000
     rad/s and toppled every bey the instant it was switched on. The annular
     form for a 30 g disc spanning 1–5 cm gives 0.5 × 30 × (1² + 5²) = 390,
     which puts the stability threshold at a sane ~17 rad/s against a 1500 rpm
     (157 rad/s) launch. `tests/unit/spinPhysics.spec.ts` guards the magnitude
     so the same slip cannot come back. */
  mass:        30,
  inertiaSpin: 390,
  comY:        2.0,
  tipType:     DEFAULT_TIP_TYPE,

  moveForce:      800,
  jumpImpulse:    300,
  frictionGround: 0.88,
  frictionAir:    0.997,
  maxSpeedH:      400,
  restitution:    0.45,
  maxHealth:      100,

  controlAuthority: 1.0,
};

export function makeBeySpec(id: string, over: Partial<BeySpec> = {}): BeySpec {
  return { id, ...DEFAULT_BEY_SPEC, ...over };
}

export function makeBeyState(spec: BeySpec, over: Partial<BeyState> = {}): BeyState {
  return {
    id: spec.id,
    pos: vec3(),
    vel: vec3(),
    grounded: false,
    health: spec.maxHealth,
    omega: 0,
    spinDir: 'right',
    tipPolarity: 'none',
    tiltDeg: 0,
    sleptOut: false,
    gravityScale: 1,
    surfaceMu: 0.15,
    lastCollisionMs: -Infinity,
    lastCollisionSticky: false,
    ...over,
  };
}

/** Deep copy. The unit a snapshot/rollback system would store. */
export function cloneBeyState(s: BeyState): BeyState {
  return { ...s, pos: { ...s.pos }, vel: { ...s.vel } };
}

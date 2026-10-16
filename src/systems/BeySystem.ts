import type { BeySpec, BeyState, Vec3 } from '../sim/state';
import { makeBeyState } from '../sim/state';
import * as Step from '../sim/step/integrate';
import {
  stepSpin, spinDecayRate, rpmToOmega, omegaToRpm, tiltFromContact, SLEEP_OUT_TILT,
} from '../sim/step/spin';
import { resolveBeyPairs, type BeyBody, type BeyContact } from '../sim/step/beyCollision';
import { applySpinExchange, type SpinBody } from '../sim/step/spinExchange';
import { BEY_TIP_PROFILES, effectiveTipFriction } from '../config/arenaConstants';
import { detachPart, attachPart, type LivePart } from '../sim/step/partMutation';
import {
  dispatchLaunch, dispatchTick, dispatchContact, resetGimmicks, spinTransmissionOf,
} from './GimmickRegistry';
import type { BeyTipType } from '../config/arenaConstants';
import { stepClones, PositionTrail, type Clone } from '../sim/step/clones';
import {
  makeBurstState, applyBurstImpulse, burstProgress,
  DEFAULT_BURST, type BurstState, type BurstSpec,
} from '../sim/step/burst';
import { stepLink, stationFor, stationSteering, type BeyLink } from './BeyLink';
import { magneticAccel, stadiumMagnetAccel } from '../sim/step/fieldForce';
import { applyWear, wearFrictionFactor, FRESH, type WearState } from '../sim/step/surfaceState';
import { makeClone } from '../sim/step/clones';
import { stepLooseMass, looseInertia, comOffset, type LooseMass } from '../sim/step/looseMass';
import { applyAmplification } from './BattleGauges';
import type { InputFrame } from './InputSystem';
import { EMPTY_FRAME } from './InputSystem';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 10b (part 2) — THE ROSTER

   This is the class that makes the project a game rather than an editor: the
   first time more than one bey has existed at once.

   WHAT IT REPLACES. `SpawnManager` encodes "there is exactly one bey" at
   every level — its size, mass, gravity and friction were module constants so
   no two beys could differ, and the string `'spawn_ball'` is its entity id in
   seven places. `new SpawnManager` appears twice in `src/`, once per screen,
   never twice in one scene, so the special-move target is an invisible
   hardcoded point rather than an opponent.

   WHAT IT UNBLOCKS. `resolveBeyPairs` has been sitting in `sim/step/` fully
   unit-tested and uncalled, because there was nothing to pair. This is its
   caller, and with it the ledger's largest single block — ~700 contact cases
   — becomes reachable.

   NO THREE, NO DOM, NO CLOCK. The roster owns plain `BeyState`, so the whole
   thing is snapshot-able and replayable; `BeyRenderer` syncs meshes from it
   separately. That split is also what a rollback netcode would need, which is
   why it is worth keeping true now rather than retrofitting.
   ══════════════════════════════════════════════════════════════════════════ */

export interface BeyEntity {
  /** Mutable: runtime part mutation recomposes it. */
  spec: BeySpec;
  state: BeyState;
  /** Live parts, for runtime detach / morph / swap (ledger N7). */
  parts: LivePart[];
  /** Visual-only entities this bey has produced. Never collide. */
  clones: Clone[];
  /** Recent positions, so an afterimage samples the real path. */
  trail: PositionTrail;
  /** Whether a centrifugal deployment (Limit Break, Awakening) is out. */
  deployed: boolean;
  /** The ratchet, and how far round it has clicked. */
  burstSpec: BurstSpec;
  burst: BurstState;
  /**
   * Accumulated tip wear (ledger N15).
   *
   * Parts have been indestructible and unchanging since the beginning. Wear
   * matters here specifically because `wearFrictionFactor` RISES before it
   * falls — the "wear-in" cases describe rubber that grips better once broken
   * in, and a tip whose behaviour inverts as it goes. A part that only ever
   * degrades cannot express either.
   */
  wear: WearState;
  /**
   * Balls free to roll in a race, pocket or slot (ledger: CS1 29, CS3 197,
   * CS4 237/274). Empty for every bey that has none, which is nearly all of
   * them — the cost of the pass is then a single length check.
   */
  loose: LooseMass[];
  /**
   * `inertiaSpin`/`comY` with every loose mass at rest.
   *
   * Kept separately because migration RECOMPUTES these each time rather than
   * accumulating onto them — adding a delta per tick would let rounding drift
   * the spec away from the part it describes over a long round.
   */
  baseInertia: number;
  baseComY: number;
  /**
   * The pose this bey launched with, so a new round can re-launch it.
   *
   * `beginRound` used to reset health, `alive` and the ratchet but nothing
   * spatial, so round two began with the loser lying wherever it had died.
   */
  launch: { pos: Vec3; vel: Vec3; omega: number };
  /** Team tag for friendly fire and win conditions. Null = free-for-all. */
  team: string | null;
  /** Cleared when the bey rings out, bursts, or sleeps out. */
  alive: boolean;
  /**
   * The tip a `mode_change` gimmick swapped away from.
   *
   * Held on the entity rather than the part because `swapTip` rewrites
   * `spec.tipType` in place: once swapped, the spec IS the alternate mode, so
   * there is nothing left to derive the way back from. Undefined whenever no
   * mode change is active, which is also how `resetGimmicks` knows whether a
   * new round has a tip to restore.
   */
  _tipBeforeMode?: BeyTipType;
}

/** What the world supplies per bey per tick, resolved by the arena layer. */
export interface WorldSample {
  /** Height of whatever is under the tip, world Y. */
  surfaceY: number;
  /** Friction of that surface. */
  surfaceMu: number;
  /** Per-arena gravity multiplier. */
  gravityScale: number;
  /** False when the bey is over nothing — off the edge. */
  supported: boolean;
}

export const DEFAULT_WORLD: WorldSample = {
  surfaceY: 0, surfaceMu: 0.15, gravityScale: 1, supported: true,
};

/** Why a bey stopped being in play. The project's first real end states. */
export type DefeatCause = 'sleep_out' | 'ring_out' | 'burst' | 'health';

export interface BeyDefeat {
  id: string;
  cause: DefeatCause;
}

export interface StepReport {
  contacts: BeyContact[];
  defeats: BeyDefeat[];
}

/** Below this world Y a bey has left the stadium entirely. */
export const RING_OUT_Y = -500;

/**
 * Friction between two bey surfaces in a clash, for spin exchange.
 *
 * ABS-on-ABS; the pair's real materials belong here once parts carry them,
 * which is Phase 11's job.
 */
export const BEY_PAIR_FRICTION = 0.17;

export class BeySystem {
  private entities = new Map<string, BeyEntity>();

  /* Scratch arrays, reused every tick. The roster is 2-6 beys and this runs
     at 60 Hz; allocating per frame would be the single largest garbage
     source in the simulation. */
  /** Cooperative links between members — Twin Tornado, Dragoon Tank. */
  private links = new Map<string, BeyLink>();
  private cloneSeq = 0;
  /**
   * Bey-to-bey magnetic strength, cm³/s².
   *
   * Live by default rather than opt-in, because `tipPolarity` is its own
   * gate: it defaults to `'none'` and `magneticAccel` returns zero for any
   * pair where either side is neutral. So a Magnacore bey feels this the
   * moment it declares a polarity and nothing else is disturbed — which is
   * the behaviour the system had on paper all along.
   */
  magnetStrength = 4000;
  /**
   * Stadium floor magnets: centre, strength and the radius they reach.
   *
   * Strength stays 0 because NO SHIPPED ARENA DECLARES MAGNETS YET — the
   * mechanism is wired and the content is not, and saying so here is better
   * than a default that silently tugs every bey in every stadium.
   */
  stadiumMagnet = { centre: { x: 0, y: 0, z: 0 }, strength: 0, radius: 120 };
  private bodyScratch: BeyBody[] = [];
  private spinScratch = new Map<string, SpinBody>();

  /**
   * Register a bey.
   *
   * `parts` IS THE FOURTH ARGUMENT NOW, and its absence was defect 11. This
   * list was hardcoded to `[]` at construction and nothing else ever wrote
   * to it, so `shouldDeploy`, `detachPart`, `attachPart`, `morphPart` and
   * `swapTip` — all written, all unit-tested — could never run on any bey in
   * any match. Supplying it is what makes `GimmickRegistry` have anything to
   * dispatch on.
   *
   * Still optional, because a bey with no authored parts is a legitimate
   * thing: `makeBeySpec` produces a complete, playable body from defaults and
   * the editor spawns one constantly.
   */
  add(
    spec: BeySpec,
    team: string | null = null,
    over: Partial<BeyState> = {},
    parts: LivePart[] = [],
  ): BeyEntity {
    const state = makeBeyState(spec, over);
    const entity: BeyEntity = {
      spec,
      state,
      parts,
      clones: [],
      trail: new PositionTrail(),
      deployed: false,
      /* COPIED, NOT SHARED. Every bey pointed at the same `DEFAULT_BURST`
         object, so authoring one bey's tooth count or spring would silently
         have retuned the ratchet of every other bey in the match. */
      burstSpec: { ...DEFAULT_BURST },
      burst: makeBurstState(DEFAULT_BURST),
      wear: FRESH,
      loose: [],
      baseInertia: spec.inertiaSpin,
      baseComY: spec.comY,
      /* The launch pose, kept so a new round can put the bey back. Without it
         `beginRound` reset health and the ratchet but left position, velocity
         and spin untouched, so round two resumed exactly where round one
         died — a defeated bey lying still at the rim. */
      launch: { pos: { ...state.pos }, vel: { ...state.vel }, omega: state.omega },
      team,
      alive: true,
    };
    this.entities.set(spec.id, entity);
    /* LAUNCH HOOKS RUN AT REGISTRATION, before the first tick. Polarity and
       loose mass are declarations rather than events: a Magnacore bey whose
       `tipPolarity` was set one frame late would spend that frame magnetically
       inert, and seeding loose mass after the first `stepLooseMass` would
       recompute inertia from a base that had already moved. */
    dispatchLaunch(entity);
    return entity;
  }

  remove(id: string): void { this.entities.delete(id); }
  get(id: string): BeyEntity | undefined { return this.entities.get(id); }
  all(): IterableIterator<BeyEntity> { return this.entities.values(); }
  get size(): number { return this.entities.size; }
  clear(): void { this.entities.clear(); }

  /** Everyone still in play. */
  living(): BeyEntity[] {
    const out: BeyEntity[] = [];
    for (const e of this.entities.values()) if (e.alive) out.push(e);
    return out;
  }

  /**
   * Advance every bey one step, then resolve them against each other.
   *
   * ORDER: per-entity motion first, contact second. Resolving contacts before
   * the bodies have moved would use last frame's positions, which at 400 cm/s
   * and 60 Hz is nearly 7 cm of error — comfortably more than a bey's radius,
   * so hits would register in the wrong place or not at all.
   */
  step(
    dt: number,
    inputs: ReadonlyMap<string, InputFrame>,
    world: (id: string) => WorldSample,
  ): StepReport {
    for (const e of this.entities.values()) {
      if (e.alive) this.stepOne(e, dt, inputs.get(e.spec.id) ?? EMPTY_FRAME, world(e.spec.id));
    }

    this.stepMagnetism(dt);

    const contacts = this.resolveContacts();

    this.stepLinks(dt);

    /* Clones and deployments ride on the state that was just stepped. */
    for (const e of this.entities.values()) {
      e.trail.push(e.state.pos);
      if (e.clones.length > 0) {
        e.clones = stepClones(e.clones, dt * 1000, e.state.pos, e.trail.get());
      }
      /* GIMMICKS TICK HERE, replacing `updateDeployment`. That method handled
         exactly one archetype (centrifugal deployment) against a hardcoded
         250 rad/s, and was guarded by this same `length > 0` test over a list
         nothing ever filled. The registry covers all ten archetypes and takes
         each threshold from the part's own radius and strength. */
      if (e.parts.length > 0) dispatchTick(e, dt);

      /* LOOSE MASS. A ball that migrates outward raises the assembly's
         inertia, so the SAME bey spins down more slowly later in a round than
         it did at launch — the part's whole reason to exist, and it falls out
         of feeding `I` back into the spin model rather than being scripted.
         Recomputed only while something is actually still moving. */
      if (e.loose.length > 0) {
        let moved = false;
        for (const m of e.loose) moved = stepLooseMass(m, e.state.omega, dt) || moved;
        if (moved) {
          e.spec.inertiaSpin = e.baseInertia + looseInertia(e.loose);
          /* An odd ball count leaves a real imbalance, which raises the CoM
             moment and makes the bey wobble — speed through instability. */
          e.spec.comY = e.baseComY + comOffset(e.loose, e.spec.mass);
        }
      }
    }

    const defeats = this.collectDefeats();
    return { contacts, defeats };
  }

  /**
   * Magnetic coupling — the Magnacore system (ledger N6), finally live.
   *
   * `tipPolarity` has been stored on the state and exposed by a getter since
   * the beginning with no physics consumer at all, so the entire Magnacore
   * generation was unmodellable. Two forces, because the corpus describes
   * two: bey-to-bey (like repels, opposite attracts — "those Beyblades will
   * never hit each other" versus "contact each other violently") and
   * stadium-to-bey from floor magnets, where a South core is repelled into
   * irregular, faster movement and a North core is drawn in and harder to
   * shift.
   *
   * Applied as an acceleration before contact resolution, so two attracting
   * beys are genuinely driven together and then collide normally rather than
   * being teleported into contact.
   */
  private stepMagnetism(dt: number): void {
    const live = this.living();
    if (live.length === 0) return;

    for (let i = 0; i < live.length; i++) {
      const a = live[i];
      for (let j = i + 1; j < live.length; j++) {
        const b = live[j];
        const acc = magneticAccel(
          a.state.pos, a.state.tipPolarity,
          b.state.pos, b.state.tipPolarity, this.magnetStrength,
        );
        /* Equal and opposite — Newton's third law is not optional here, and
           skipping it would let a pair accelerate itself across the dish. */
        a.state.vel.x += acc.x * dt; a.state.vel.z += acc.z * dt;
        b.state.vel.x -= acc.x * dt; b.state.vel.z -= acc.z * dt;
      }
    }

    const { centre, strength, radius } = this.stadiumMagnet;
    if (strength <= 0) return;
    for (const e of live) {
      const acc = stadiumMagnetAccel(e.state.pos, centre, e.state.tipPolarity, strength, radius);
      e.state.vel.x += acc.x * dt;
      e.state.vel.z += acc.z * dt;
    }
  }

  /**
   * Fire a special move, returning the impulse actually delivered.
   *
   * THIS IS THE `[M]` BOUNDARY, and it is a separate multiplication on
   * purpose. The plan's acceptance test is that the same move with `[M]`
   * disabled produces the physical figure and with it enabled produces the
   * amplified one — only keeping the physical value intact and multiplying
   * can satisfy both, which is why this returns rather than scaling in place.
   *
   * Combos never come through here. They are capped by `ComboDetector`'s
   * ceilings instead, so the anime layer cannot leak into player-skill
   * expression even if a caller forgets.
   */
  fireSpecial(
    id: string, physicalImpulse: number, mFactor = 8.0, amplified = true,
  ): number {
    const e = this.entities.get(id);
    if (!e || !e.alive) return 0;

    const delivered = applyAmplification(physicalImpulse, mFactor, amplified);

    /* An amplified move leaves afterimages — the illusion and ambush moves
       (CS13 1453/1664/1665, CS15 2063/2064) are visual entities with their
       own position, never colliders, so they are spawned here and stepped
       with everything else. */
    if (amplified) {
      for (let i = 0; i < 3; i++) {
        e.clones.push(makeClone({
          id: `${id}-afterimage-${this.cloneSeq++}`,
          ownerId: id,
          kind: 'afterimage',
          pos: { ...e.state.pos },
          lifetimeMs: 320 + i * 90,
        }));
      }
    }
    return delivered;
  }

  private stepOne(e: BeyEntity, dt: number, input: InputFrame, w: WorldSample): void {
    const { spec, state } = e;

    state.gravityScale = w.gravityScale;
    state.surfaceMu    = w.surfaceMu;

    if (input.moveX !== 0 || input.moveZ !== 0) {
      Step.applySteering(state, spec, { x: input.moveX, y: 0, z: input.moveZ }, dt);
    }
    if (input.jump) Step.applyJump(state, spec);

    Step.applyGravity(state, dt);
    Step.integrate(state, spec, dt);
    Step.clampHorizontalSpeed(state, spec);

    if (w.supported) {
      state.grounded = Step.resolveLanding(state, spec, w.surfaceY, spec.restitution);
    } else {
      state.grounded = false;
    }

    /* Spin only decays against a surface — see `_stepSpin` in SpawnManager
       for the same reasoning. An airborne bey keeps every rad/s it had. */
    if (state.grounded) {
      const tip = BEY_TIP_PROFILES[spec.tipType] ?? BEY_TIP_PROFILES.hard_flat;
      /* Wear modulates the tip's grip, which is the only place it can
         honestly act: a worn tip is a different tip, so it belongs in mu
         rather than as a separate penalty bolted onto the result. */
      const mu  = effectiveTipFriction(tip, state.surfaceMu) * wearFrictionFactor(e.wear);
      const r = stepSpin(
        spec,
        { omega: Math.abs(state.omega), tiltRad: state.tiltDeg * Math.PI / 180 },
        spinDecayRate(spec.mass, spec.inertiaSpin, mu, tip.contactRadius),
        dt,
      );
      const sign = state.spinDir === 'left' ? -1 : 1;
      state.omega   = r.omega * sign;
      state.tiltDeg = r.tiltRad * 180 / Math.PI;
      state.sleptOut = r.sleptOut;
    }
  }

  /** Pairwise contact, plus the spin exchange each contact implies. */
  private resolveContacts(): BeyContact[] {
    const live = this.living();
    if (live.length < 2) return [];

    this.bodyScratch.length = 0;
    this.spinScratch.clear();

    for (const e of live) {
      const { spec, state } = e;
      /* `pos` and `vel` are passed BY REFERENCE so the resolver writes
         straight into the entity's state — the same aliasing trick
         SpawnManager uses with its Vector3s, and the reason no copy-back
         step is needed. */
      this.bodyScratch.push({
        id: spec.id,
        pos: state.pos,
        vel: state.vel,
        radius: spec.radius,
        mass: spec.mass,
        contactLow: spec.tipOffset,
        contactHigh: spec.tipOffset + spec.height,
        restitution: spec.restitution,
      });
      const tip = BEY_TIP_PROFILES[spec.tipType] ?? BEY_TIP_PROFILES.hard_flat;
      this.spinScratch.set(spec.id, {
        id: spec.id,
        spin: state.omega,
        inertiaSpin: spec.inertiaSpin,
        contactRadius: Math.max(tip.contactRadius, spec.radius * 0.5),
      });
    }

    const contacts = resolveBeyPairs(this.bodyScratch);

    for (const c of contacts) {
      /* BURST. Each contact drives the ratchet of BOTH beys — the impulse is
         shared, and which one pops depends on its own tooth count, spring
         and tip grip rather than on who initiated. */
      for (const id of [c.a, c.b]) {
        const e = this.entities.get(id);
        if (!e) continue;

        /* WHAT THIS BEY ACTUALLY FEELS. A rubber layer or a free-spinning
           core attenuates the hit before it reaches anything, so every
           consumer below reads the absorbed figure rather than the raw
           contact impulse — absorbing a spike and then bursting from its
           full magnitude anyway is precisely the bug this avoids.

           `c.impulse` itself is left untouched: it is the mutual impulse of
           the PAIR, the other bey attenuates it differently, and the caller
           uses it for hit-stop and gauge where the real magnitude is what
           matters. */
        const felt = e.parts.length > 0 ? dispatchContact(e, c.impulse) : c.impulse;

        /* DESTABILISATION. The contact band tells us WHERE on the body the
           hit landed, so a strike high on the layer tips the bey and one on
           the base barely does — which is what contact-height matching was
           for. Gyroscopic stiffness is in the formula, so a fast bey shrugs
           it off and a dying one goes over. */
        const heightAboveTip = c.contactY - (e.state.pos.y + e.spec.tipOffset);
        const dTilt = tiltFromContact(
          felt, Math.max(0, heightAboveTip),
          e.spec.inertiaSpin, e.state.omega,
          e.state.tiltDeg * Math.PI / 180,
        );
        const next = e.state.tiltDeg * Math.PI / 180 + dTilt;
        e.state.tiltDeg = Math.min(Math.PI / 2, next) * 180 / Math.PI;
        if (next >= SLEEP_OUT_TILT) e.state.sleptOut = true;

        if (!e.burst.burst) {
          const tip = BEY_TIP_PROFILES[e.spec.tipType] ?? BEY_TIP_PROFILES.hard_flat;
          applyBurstImpulse(e.burst, e.burstSpec, felt, e.spec.radius, tip.friction);
        }

        /* WEAR. Toughness scales with mass because a heavier part carries more
           material to give up before it is spent; using the impulse rather
           than a hit count is what lets one hard clash age a tip more than
           several glancing ones. */
        e.wear = applyWear(e.wear, felt, e.spec.mass * 400);
      }

      const sa = this.spinScratch.get(c.a);
      const sb = this.spinScratch.get(c.b);
      if (!sa || !sb) continue;
      /* FREE SPIN DECOUPLES THE PAIR. Torque crosses the contact through
         whichever surface transmits least, so the WEAKER link governs — a
         free-spinning layer protects its owner from spin-steal AND denies
         the attacker the steal, which is the two-sided property that makes
         the part worth fitting. Multiplying the two factors instead would
         let two free-spin beys attenuate each other twice over. */
      const transmission = Math.min(
        this.spinTransmissionFor(c.a), this.spinTransmissionFor(c.b),
      );
      applySpinExchange(sa, sb, c.impulse * transmission, BEY_PAIR_FRICTION);
      const ea = this.entities.get(c.a);
      const eb = this.entities.get(c.b);
      if (ea) { ea.state.omega = sa.spin; ea.state.spinDir = sa.spin < 0 ? 'left' : 'right'; }
      if (eb) { eb.state.omega = sb.spin; eb.state.spinDir = sb.spin < 0 ? 'left' : 'right'; }
    }
    return contacts;
  }

  /**
   * Check the end conditions — the first time this project can decide a loser.
   *
   * `health` has existed since the beginning, is drained by traps and zones,
   * and has never once been compared to zero anywhere in `src`. That, plus no
   * sleep-out and no ring-out, is why a match could not end.
   */
  private collectDefeats(): BeyDefeat[] {
    const out: BeyDefeat[] = [];
    for (const e of this.entities.values()) {
      if (!e.alive) continue;
      let cause: DefeatCause | null = null;

      /* Burst first: it outranks the others because a layer that has come
         off cannot then ring out or spin down — and it scores differently. */
      if (e.burst.burst)                cause = 'burst';
      else if (e.state.pos.y < RING_OUT_Y) cause = 'ring_out';
      else if (e.state.sleptOut)        cause = 'sleep_out';
      else if (e.state.health <= 0)     cause = 'health';

      if (cause) { e.alive = false; out.push({ id: e.spec.id, cause }); }
    }
    return out;
  }

  /* ── Cooperative links (ledger code L) ────────────────────────────── */

  addLink(link: BeyLink): void { this.links.set(link.id, link); }
  removeLink(id: string): void { this.links.delete(id); }
  linkOf(id: string): BeyLink | undefined { return this.links.get(id); }

  /**
   * Hold formations and advance shared phase.
   *
   * Followers are STEERED toward their station rather than snapped to it —
   * a cooperative move should look like two bladers holding a shape, not
   * like one bey parented to another, and a snap would also bypass every
   * collision resolver on the way.
   */
  private stepLinks(dt: number): void {
    if (this.links.size === 0) return;

    const positions = new Map<string, { x: number; y: number; z: number }>();
    for (const e of this.entities.values()) positions.set(e.spec.id, e.state.pos);

    for (const [id, link] of this.links) {
      if (!stepLink(link, dt, positions)) { this.links.delete(id); continue; }
      if (link.kind === 'resonance') continue;     // no positional constraint

      const leader = this.entities.get(link.members[0]);
      if (!leader) continue;
      const heading = { x: leader.state.vel.x, y: 0, z: leader.state.vel.z };

      for (let i = 1; i < link.members.length; i++) {
        const follower = this.entities.get(link.members[i]);
        if (!follower || !follower.alive) continue;
        const offset = link.offsets[i - 1] ?? { x: 0, y: 0, z: -12 };
        const station = stationFor(leader.state.pos, heading, offset);
        const dir = stationSteering(follower.state.pos, station);
        const pull = follower.spec.moveForce * link.cohesion * dt;
        follower.state.vel.x += dir.x * pull;
        follower.state.vel.z += dir.z * pull;
      }
    }
  }

  /* ── Runtime part mutation (ledger N7) ────────────────────────────── */

  /** Detach a part mid-battle; the spec is recomposed from what remains. */
  detach(id: string, partId: string): number {
    const e = this.entities.get(id);
    if (!e) return 0;
    const r = detachPart(e.spec, e.parts, partId);
    e.spec = r.spec;
    return r.shedMass;
  }

  /** Re-attach — the boomerang satellite's return. */
  attach(id: string, partId: string): void {
    const e = this.entities.get(id);
    if (!e) return;
    e.spec = attachPart(e.spec, e.parts, partId).spec;
  }

  /** Spin-torque transmission of one bey's parts, 1 when it has none. */
  private spinTransmissionFor(id: string): number {
    const e = this.entities.get(id);
    return e && e.parts.length > 0 ? spinTransmissionOf(e) : 1;
  }

  /**
   * Re-arm every one-shot gimmick for a new round.
   *
   * `MatchSystem.beginRound` restores position, spin and the ratchet; without
   * this a bey that released its Engine Gear or shed a satellite in round one
   * would start round two still spent and still missing the part.
   */
  resetGimmicksFor(id: string): void {
    const e = this.entities.get(id);
    if (e && e.parts.length > 0) resetGimmicks(e);
  }

  /** Add a visual clone owned by this bey. Never enters contact. */
  addClone(id: string, clone: Clone): void {
    this.entities.get(id)?.clones.push(clone);
  }

  /** Snapshot for replay, rollback, or assertion. Deep, and THREE-free. */
  snapshot(): Record<string, BeyState> {
    const out: Record<string, BeyState> = {};
    for (const [id, e] of this.entities) out[id] = structuredClone(e.state);
    return out;
  }

  restore(snap: Record<string, BeyState>): void {
    for (const [id, st] of Object.entries(snap)) {
      const e = this.entities.get(id);
      if (e) e.state = structuredClone(st);
    }
  }

  /** Burst progress 0..1, for the HUD's staged Burst gauge. */
  burstProgressOf(id: string): number {
    const e = this.entities.get(id);
    return e ? burstProgress(e.burst) : 0;
  }

  /** Convenience for HUDs: rpm rather than rad/s. */
  /**
   * Spin in RPM, for display.
   *
   * ITS ONLY CALLER USED IT AS A THRESHOLD AND WAS WRONG TO. The AI compared
   * `|ω| < rpmOf(id) * 0.2` — rad/s against RPM of the same entity — which
   * reduces to `|ω| < 1.91·|ω|` and disabled the opponent entirely. Kept
   * because the HUD legitimately wants RPM, but the name now says what it is
   * for: a bey's spin compared against ANOTHER bey's RPM is a unit error, and
   * compared against its own is a tautology.
   */
  rpmOf(id: string): number {
    const e = this.entities.get(id);
    return e ? omegaToRpm(Math.abs(e.state.omega)) : 0;
  }

  setRpm(id: string, rpm: number): void {
    const e = this.entities.get(id);
    if (!e) return;
    const sign = e.state.spinDir === 'left' ? -1 : 1;
    e.state.omega = rpmToOmega(rpm) * sign;
  }
}

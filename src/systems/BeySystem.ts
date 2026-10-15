import type { BeySpec, BeyState } from '../sim/state';
import { makeBeyState } from '../sim/state';
import * as Step from '../sim/step/integrate';
import { stepSpin, spinDecayRate, rpmToOmega, omegaToRpm } from '../sim/step/spin';
import { resolveBeyPairs, type BeyBody, type BeyContact } from '../sim/step/beyCollision';
import { applySpinExchange, type SpinBody } from '../sim/step/spinExchange';
import { BEY_TIP_PROFILES, effectiveTipFriction } from '../config/arenaConstants';
import { detachPart, attachPart, morphPart, shouldDeploy, type LivePart } from '../sim/step/partMutation';
import { stepClones, PositionTrail, type Clone } from '../sim/step/clones';
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
  /** Team tag for friendly fire and win conditions. Null = free-for-all. */
  team: string | null;
  /** Cleared when the bey rings out, bursts, or sleeps out. */
  alive: boolean;
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
  private bodyScratch: BeyBody[] = [];
  private spinScratch = new Map<string, SpinBody>();

  add(spec: BeySpec, team: string | null = null, over: Partial<BeyState> = {}): BeyEntity {
    const entity: BeyEntity = {
      spec,
      state: makeBeyState(spec, over),
      parts: [],
      clones: [],
      trail: new PositionTrail(),
      deployed: false,
      team,
      alive: true,
    };
    this.entities.set(spec.id, entity);
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

    const contacts = this.resolveContacts();

    /* Clones and deployments ride on the state that was just stepped. */
    for (const e of this.entities.values()) {
      e.trail.push(e.state.pos);
      if (e.clones.length > 0) {
        e.clones = stepClones(e.clones, dt * 1000, e.state.pos, e.trail.get());
      }
      if (e.parts.length > 0) this.updateDeployment(e);
    }

    const defeats = this.collectDefeats();
    return { contacts, defeats };
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
      const mu  = effectiveTipFriction(tip, state.surfaceMu);
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
      const sa = this.spinScratch.get(c.a);
      const sb = this.spinScratch.get(c.b);
      if (!sa || !sb) continue;
      applySpinExchange(sa, sb, c.impulse, BEY_PAIR_FRICTION);
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

      if (e.state.pos.y < RING_OUT_Y)   cause = 'ring_out';
      else if (e.state.sleptOut)        cause = 'sleep_out';
      else if (e.state.health <= 0)     cause = 'health';

      if (cause) { e.alive = false; out.push({ id: e.spec.id, cause }); }
    }
    return out;
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

  /**
   * Centrifugal deployment: Limit Break, Turbo Awakening, extending wings.
   *
   * Inertia rises with the SQUARE of the radius, so a deployment measurably
   * slows spin-down as well as extending reach — the documented trade, and
   * it needs no separate bookkeeping because recomposition produces it.
   */
  private updateDeployment(e: BeyEntity): void {
    const threshold = 250;                       // rad/s
    const want = shouldDeploy(e.state.omega, threshold, e.deployed);
    if (want === e.deployed) return;
    e.deployed = want;
    const wing = e.parts.find(p => p.detachable);
    if (wing) {
      e.spec = morphPart(e.spec, e.parts, wing.id,
        want ? wing.outerRadius * 1.25 : wing.outerRadius / 1.25).spec;
    }
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

  /** Convenience for HUDs: rpm rather than rad/s. */
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

import * as THREE from 'three';
import type { ITickableManager } from '../IArenaFeature';
import type {
  SpecialMoveDefinition, SpecialMovePhase, SpecialMoveProjectileCmd,
  SpecialMoveSave, TargetDummyState,
} from '../../types/specialMoveTypes';
import {
  defaultSpecialMove, specialMoveFromSave, specialMoveToSave,
} from '../../types/specialMoveTypes';
import type { SpawnManager } from './SpawnManager';
import type { SimClock } from '../../sim/SimClock';

type SMState = 'idle' | 'executing';

const RESONANCE_WALL_HIT = 8;
const RESONANCE_TAP      = 10;
const RESONANCE_MAX      = 100;
const TARGET_HP_MAX      = 100;
const CASTER_HP_MAX      = 100;

export class SpecialMoveManager implements ITickableManager {
  private _moves     = new Map<string, SpecialMoveDefinition>();
  private _moveSeq   = 0;

  private _state: SMState = 'idle';
  private _activeDefId: string | null = null;
  private _activePhaseId: string | null = null;
  private _phaseTimer  = 0;   // seconds elapsed in current phase
  private _resonance   = 0;

  /* ── EXECUTION STATE, which used to live on the authored definitions ─────
     All three fields below were previously written onto `SpecialMovePhase`
     and `SpecialMoveDefinition` under a "runtime only" comment, and that is
     precisely what corrupted them. See the header of `specialMoveTypes.ts`.
     Here they are per-manager and per-run, so a move is read-only data that
     cannot be damaged by being cast. */

  /**
   * Times each phase has repeated in THIS execution.
   *
   * Keyed by phase id rather than a single counter because a move can loop,
   * advance, and loop again on a later phase; one counter would carry the
   * first phase's tally into the second.
   */
  private _loops = new Map<string, number>();
  /**
   * Phases whose `hitEffect` has already landed in THIS execution.
   *
   * REPLACES `phase.hitEffect = null`. The old line made a hit fire once per
   * SESSION rather than once per phase entry, destroyed the authored data,
   * and then got written back to storage by the next save.
   */
  private _hitFired = new Set<string>();
  /** Sim-seconds each move was last cast at. Was `def._lastUsedAt`. */
  private _lastUsed = new Map<string, number>();

  // Target dummy (simple physics state)
  private _targetPos = new THREE.Vector3(0, 0, 25);
  private _targetVel = new THREE.Vector3();
  private _targetHp  = TARGET_HP_MAX;
  private _casterHp  = CASTER_HP_MAX;

  // Injected SpawnManager (set after construction)
  private _spawnMgr: SpawnManager | null = null;

  // HUD element refs (set from SpecialMoveSandbox)
  private _resonanceBarEl: HTMLElement | null = null;
  private _casterHpBarEl:  HTMLElement | null = null;
  private _targetHpBarEl:  HTMLElement | null = null;
  private _activePhaseEl:  HTMLElement | null = null;

  // Key unsub
  private _tKeyUnsub?: () => void;

  constructor(
    /** Deterministic sim clock — move cooldowns must be replayable. */
    private readonly clock: SimClock,
    /** Callback to get caster world position (from SpawnManager). */
    private readonly getCasterPos: () => THREE.Vector3 | null,
    /** Callback to set caster velocity (SpawnManager.setVelocity). */
    private readonly setCasterVel: (v: THREE.Vector3) => void,
    /** Fires when a move completes a hitEffect check against target. */
    private readonly onHit?: (damage: number, impulse: THREE.Vector3) => void,
    /**
     * Launch a projectile for a phase that declares one.
     *
     * THE THIRD DEFECT: "Projectile commands are declared but not executed."
     * `_enterPhase` carried a comment saying the sandbox would handle it and
     * the sandbox never did, so `SpecialMoveProjectileCmd` — a full authored
     * struct with radius, speed, lifetime and colour, editable in the panel
     * — did nothing at all.
     *
     * Injected rather than imported because `ProjectileManager` belongs to
     * the screen; a manager reaching for another manager directly is the
     * coupling the project bans outright.
     */
    private readonly onProjectile?: (
      cmd: SpecialMoveProjectileCmd,
      origin: THREE.Vector3,
      dir: THREE.Vector3,
    ) => void,
  ) {}

  // ── Injection (called from SpecialMoveSandbox after construction) ──────────

  bindSpawnManager(sm: SpawnManager): void {
    this._spawnMgr = sm;
    sm._onWallImpact = () => this.reportImpact(RESONANCE_WALL_HIT);
  }

  bindHudElements(opts: {
    resonanceBar: HTMLElement | null;
    casterHpBar:  HTMLElement | null;
    targetHpBar:  HTMLElement | null;
    activePhase:  HTMLElement | null;
  }): void {
    this._resonanceBarEl = opts.resonanceBar;
    this._casterHpBarEl  = opts.casterHpBar;
    this._targetHpBarEl  = opts.targetHpBar;
    this._activePhaseEl  = opts.activePhase;
  }

  registerTKey(onPress: (cb: () => void) => () => void): void {
    this._tKeyUnsub = onPress(() => this._onTrigger());
  }

  unregisterTKey(): void {
    this._tKeyUnsub?.();
    this._tKeyUnsub = undefined;
  }

  // ── Resonance ──────────────────────────────────────────────────────────────

  reportImpact(amount: number): void {
    this._resonance = Math.min(RESONANCE_MAX, this._resonance + amount);
    this._updateHud();
  }

  getResonance(): number { return this._resonance; }

  // ── Move management ────────────────────────────────────────────────────────

  addMove(): SpecialMoveDefinition {
    const id = `sm-${++this._moveSeq}`;
    const def = defaultSpecialMove(id);
    this._moves.set(id, def);
    return def;
  }

  getMove(id: string): SpecialMoveDefinition | undefined { return this._moves.get(id); }
  getAllMoves(): ReadonlyMap<string, SpecialMoveDefinition> { return this._moves; }

  removeMove(id: string): void {
    if (this._activeDefId === id) this._exitToIdle();
    this._moves.delete(id);
  }

  updateMove(def: SpecialMoveDefinition): void { this._moves.set(def.id, def); }

  serializeAll(): SpecialMoveSave[] {
    return [...this._moves.values()].map(specialMoveToSave);
  }

  loadSaves(saves: SpecialMoveSave[]): void {
    this._moves.clear();
    for (const s of saves) {
      const def = specialMoveFromSave(s);
      this._moves.set(def.id, def);
      if (def.id.startsWith('sm-')) {
        const n = parseInt(def.id.slice(3), 10);
        if (!isNaN(n) && n > this._moveSeq) this._moveSeq = n;
      }
    }
  }

  // ── Target dummy ───────────────────────────────────────────────────────────

  setTargetPosition(pos: THREE.Vector3): void { this._targetPos.copy(pos); }
  getTargetPosition(): THREE.Vector3 { return this._targetPos.clone(); }
  getTargetState(): TargetDummyState {
    return { pos: this._targetPos.clone(), vel: this._targetVel.clone(), hp: this._targetHp };
  }

  resetTargetHp(): void { this._targetHp = TARGET_HP_MAX; this._updateHud(); }
  resetCasterHp(): void { this._casterHp = CASTER_HP_MAX; this._updateHud(); }

  // ── Selected move ──────────────────────────────────────────────────────────

  private _selectedMoveId: string | null = null;
  selectMove(id: string | null): void { this._selectedMoveId = id; }
  getSelectedMoveId(): string | null { return this._selectedMoveId; }

  // ── Tick ──────────────────────────────────────────────────────────────────

  tick(dt: number): void {
    if (this._state === 'executing') {
      this._tickPhase(dt);
    }
    this._updateHud();
  }

  // ── Internal: T-key handler ────────────────────────────────────────────────

  private _onTrigger(): void {
    if (this._state === 'executing') return; // move already running

    const moveId = this._selectedMoveId ?? this._moves.keys().next().value ?? null;
    if (!moveId) {
      // No move selected — tap charge
      this.reportImpact(RESONANCE_TAP);
      return;
    }

    const def = this._moves.get(moveId);
    if (!def) { this.reportImpact(RESONANCE_TAP); return; }

    if (this._resonance < def.resonanceCost) {
      // Insufficient resonance — tap charge
      this.reportImpact(RESONANCE_TAP);
      return;
    }

    // Check cooldown (sim seconds, so a replayed move fires at the same step)
    const now = this.clock.nowSec();
    if (now - (this._lastUsed.get(moveId) ?? -Infinity) < def.cooldownSec) return;

    // Fire!
    this._resonance = Math.max(0, this._resonance - def.resonanceCost);
    this._lastUsed.set(moveId, now);
    this._activeDefId = moveId;
    this._state = 'executing';
    /* A FRESH RUN. Loop tallies and spent hit effects are per-cast, so they
       are cleared here rather than carried over — without this the second
       cast of a looping move would start with the first cast's counter and
       exit immediately. */
    this._loops.clear();
    this._hitFired.clear();
    this._enterPhase(def.entryPhaseId);
  }

  // ── Internal: phase execution ──────────────────────────────────────────────

  private _enterPhase(phaseId: string): void {
    const def = this._activeDefId ? this._moves.get(this._activeDefId) : null;
    if (!def) { this._exitToIdle(); return; }
    const phase = def.phases.get(phaseId);
    if (!phase) { this._exitToIdle(); return; }

    this._activePhaseId = phaseId;
    this._phaseTimer    = 0;
    /* `phase._loopAccum = 0` WAS HERE, and it is the loop bug in one line:
       `_tickPhase` incremented the counter and then called this to re-enter
       the phase, which zeroed the increment it had just made. The tally
       lives in `this._loops` now and is only cleared when a cast STARTS. */

    /* The hit is re-armed per ENTRY, so a looping phase can land once per
       repetition — which is what a multi-hit move means. The old code
       deleted `hitEffect` from the definition instead, making it once per
       session and corrupting the saved move. */
    this._hitFired.delete(phaseId);

    // Apply velocity boost immediately
    if (phase.velocityBoost) {
      const boost = new THREE.Vector3(phase.velocityBoost.x, phase.velocityBoost.y, phase.velocityBoost.z);
      const cur = this._spawnMgr?.getVelocity() ?? new THREE.Vector3();
      this.setCasterVel(cur.add(boost));
    }

    /* PROJECTILES FIRE HERE. This was a comment saying the sandbox owned it;
       the sandbox did not. Aimed at the target from the caster, falling back
       to the caster's own heading when the two are coincident — `normalize()`
       on a zero vector yields (0,0,0) and the bullet would never move. */
    if (phase.projectile && this.onProjectile) {
      const origin = this.getCasterPos();
      if (origin) {
        const dir = new THREE.Vector3().subVectors(this._targetPos, origin);
        if (dir.lengthSq() < 1e-8) {
          const vel = this._spawnMgr?.getVelocity();
          dir.set(vel?.x ?? 0, 0, vel?.z ?? 1);
        }
        if (dir.lengthSq() < 1e-8) dir.set(0, 0, 1);
        this.onProjectile(phase.projectile, origin.clone(), dir.normalize());
      }
    }
  }

  private _tickPhase(dt: number): void {
    const def = this._activeDefId ? this._moves.get(this._activeDefId) : null;
    if (!def || !this._activePhaseId) { this._exitToIdle(); return; }
    const phase = def.phases.get(this._activePhaseId);
    if (!phase) { this._exitToIdle(); return; }

    this._phaseTimer += dt;

    // Hit detection
    if (phase.hitEffect && !this._hitFired.has(phase.id)) {
      const casterPos = this.getCasterPos();
      if (casterPos) {
        const dist = casterPos.distanceTo(this._targetPos);
        if (dist < phase.hitEffect.hitRadius) {
          const dmg = phase.hitEffect.damageAmount;
          this._targetHp = Math.max(0, this._targetHp - dmg);

          const impulseDir = new THREE.Vector3().subVectors(this._targetPos, casterPos).normalize();
          if (phase.hitEffect.knockback === 'down') {
            impulseDir.set(0, -1, 0);
          } else if (phase.hitEffect.knockback === 'radial') {
            impulseDir.y = 0; impulseDir.normalize();
          }
          this.onHit?.(dmg, impulseDir.multiplyScalar(phase.hitEffect.impulseMag));
          /* MARKED, NOT DELETED. `phase.hitEffect = null` fired once per
             session and permanently destroyed the authored effect; this
             fires once per phase ENTRY and leaves the definition intact. */
          this._hitFired.add(phase.id);
        }
      }
    }

    if (this._phaseTimer >= phase.durationSec) {
      const done = this._loops.get(phase.id) ?? 0;
      if (phase.loopCount > 0 && done < phase.loopCount) {
        /* Counted BEFORE re-entering, and in a map `_enterPhase` does not
           touch — the old code stored this on the phase and `_enterPhase`
           reset it, so the comparison above could never become false and
           the move ran forever. */
        this._loops.set(phase.id, done + 1);
        this._enterPhase(phase.id);
        return;
      }

      if (phase.nextPhaseId) {
        this._enterPhase(phase.nextPhaseId);
      } else {
        this._exitToIdle();
      }
    }
  }

  private _exitToIdle(): void {
    this._state = 'idle';
    this._activeDefId   = null;
    this._activePhaseId = null;
    this._phaseTimer    = 0;
    this._loops.clear();
    this._hitFired.clear();
  }

  /** Is a move currently running? The join `ArenaSandbox` needs. */
  isExecuting(): boolean { return this._state === 'executing'; }

  // ── HUD update ─────────────────────────────────────────────────────────────

  private _updateHud(): void {
    if (this._resonanceBarEl) {
      this._resonanceBarEl.style.width = `${(this._resonance / RESONANCE_MAX) * 100}%`;
    }
    if (this._casterHpBarEl) {
      this._casterHpBarEl.style.width = `${(this._casterHp / CASTER_HP_MAX) * 100}%`;
    }
    if (this._targetHpBarEl) {
      this._targetHpBarEl.style.width = `${(this._targetHp / TARGET_HP_MAX) * 100}%`;
    }
    if (this._activePhaseEl) {
      const def   = this._activeDefId ? this._moves.get(this._activeDefId) : null;
      const phase = def && this._activePhaseId ? def.phases.get(this._activePhaseId) : null;
      this._activePhaseEl.textContent = this._state === 'executing' && phase ? phase.label : '—';
    }
  }

  dispose(): void {
    this.unregisterTKey();
    if (this._spawnMgr) this._spawnMgr._onWallImpact = undefined;
  }
}

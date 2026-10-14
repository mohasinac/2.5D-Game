/* ══════════════════════════════════════════════════════════════════════════
   PHASE 15 — THE COMBO GATE CHAIN  (all ~290 COMBO cases are GAP)

   There is no input-sequence system at all. `ControlManager` exposes movement
   axes plus jump and trigger, and the corpus' own notation uses keys (`K`
   defend, `E` dodge) that have no binding anywhere — so every combo case in
   CS12, CS13 and CS15 is blocked on machinery that does not exist.

   CS12 Case 610 specifies the detector precisely and, unusually for the
   corpus, consistently: a sliding window of the last three keys, a 600 ms
   prune, per-combo windows of 400-500 ms, then a chain of gates. Of the ~200
   contradictions catalogued across the fifteen files, none targets this
   algorithm — so it is implemented as written rather than reinterpreted.

   TWO NOTATION PROBLEMS THAT HAD TO BE DECIDED, both recorded rather than
   silently resolved:

   1. CS15 OVERLOADS `->`. It is both the moveRight input and the sequence
      delimiter, which makes the combo notation unparseable as one grammar.
      Here sequences are arrays of tokens, and parsing corpus strings is the
      extractor's problem, not the runtime's.

   2. COST IS 15 FOR 37 COMBOS AND 25 FOR THREE OTHERS with no stated rule,
      against a power bar that does not exist. Costs are data on the combo,
      so whichever the extractor decides, the gate chain does not care.

   THE CEILINGS ARE HARD. Combos never receive `[M]` amplification and are
   capped at damage ×1.5, lock 300 ms, no invulnerability, no AoE, no full
   spin recovery. Those are enforced here, at the definition boundary, because
   a combo that quietly exceeds them is indistinguishable from a special.
   ══════════════════════════════════════════════════════════════════════════ */

export type BeyType = 'attack' | 'defense' | 'stamina' | 'balance';

export interface ComboDef {
  id: string;
  name: string;
  /** Input tokens in order. Three is the norm; the detector allows 2-4. */
  sequence: readonly string[];
  /** Power cost. 0 for the free movement combos. */
  cost: number;
  /** Cooldown before this combo may fire again, ms. */
  cooldownMs: number;
  /** Max gap between consecutive keys, ms. CS12 uses 400-500. */
  windowMs: number;
  /** Which bey types may use it. Empty = all. */
  allowedTypes: readonly BeyType[];
  /** Capped at COMBO_MAX_DAMAGE_MULT. */
  damageMultiplier: number;
  /** Capped at COMBO_MAX_LOCK_MS. */
  lockMs: number;
}

/* The four hard ceilings, from CS12 Case 614. */
export const COMBO_MAX_DAMAGE_MULT = 1.5;
export const COMBO_MAX_LOCK_MS     = 300;
export const COMBO_MAX_SPIN_DELTA  = 50;
/** Keys older than this are dropped from the history. */
export const COMBO_PRUNE_MS        = 600;
/** No more than three combos may be attached to one bey. */
export const COMBO_SLOTS           = 3;

export interface KeyPress { token: string; atMs: number; }

export interface ComboContext {
  beyType: BeyType;
  power: number;
  /** Sim-ms. Never a wall-clock read — the detector must replay identically. */
  nowMs: number;
  /** Per-combo last-fired times. */
  lastFired: ReadonlyMap<string, number>;
  /** Global cooldown end, sim-ms. */
  globalReadyAtMs: number;
}

/** Why a candidate did not fire. Returned so the HUD can say so. */
export type ComboReject =
  | 'no_match' | 'not_attached' | 'type_disallowed'
  | 'insufficient_power' | 'on_cooldown' | 'global_cooldown' | 'window_expired';

export interface ComboResult {
  combo: ComboDef | null;
  reject: ComboReject | null;
}

/** Clamp a definition to the ceilings. Applied at registration. */
export function clampComboDef(def: ComboDef): ComboDef {
  return {
    ...def,
    damageMultiplier: Math.min(def.damageMultiplier, COMBO_MAX_DAMAGE_MULT),
    lockMs: Math.min(def.lockMs, COMBO_MAX_LOCK_MS),
  };
}

/**
 * Sliding-window combo detection.
 *
 * History is pruned by age rather than length so a slow player's stale keys
 * cannot combine with fresh ones into a combo neither was aiming for — the
 * failure mode a fixed-length buffer has.
 */
export class ComboDetector {
  private history: KeyPress[] = [];
  private attached: ComboDef[] = [];

  /** Attach up to `COMBO_SLOTS` combos to this bey. */
  attach(defs: readonly ComboDef[]): void {
    this.attached = defs.slice(0, COMBO_SLOTS).map(clampComboDef);
  }

  attachedCombos(): readonly ComboDef[] { return this.attached; }

  /** Record a key. Prunes anything older than the window. */
  press(token: string, nowMs: number): void {
    this.history.push({ token, atMs: nowMs });
    this.prune(nowMs);
  }

  private prune(nowMs: number): void {
    const cutoff = nowMs - COMBO_PRUNE_MS;
    let i = 0;
    while (i < this.history.length && this.history[i].atMs < cutoff) i++;
    if (i > 0) this.history.splice(0, i);
  }

  reset(): void { this.history.length = 0; }

  /**
   * The gate chain, in CS12's order.
   *
   * Order matters for the REJECT REASON, not just the outcome: checking power
   * before the sequence would tell a player they lack power for a combo they
   * never actually input, which is worse than silence.
   */
  tryFire(ctx: ComboContext): ComboResult {
    this.prune(ctx.nowMs);

    let sawMatch = false;
    for (const combo of this.attached) {
      if (!this.matches(combo, ctx.nowMs)) continue;
      sawMatch = true;

      if (combo.allowedTypes.length > 0 && !combo.allowedTypes.includes(ctx.beyType)) {
        return { combo: null, reject: 'type_disallowed' };
      }
      if (ctx.power < combo.cost) {
        return { combo: null, reject: 'insufficient_power' };
      }
      if (ctx.nowMs < ctx.globalReadyAtMs) {
        return { combo: null, reject: 'global_cooldown' };
      }
      const last = ctx.lastFired.get(combo.id);
      if (last !== undefined && ctx.nowMs - last < combo.cooldownMs) {
        return { combo: null, reject: 'on_cooldown' };
      }

      this.reset();           // consume the input so it cannot double-fire
      return { combo, reject: null };
    }

    return { combo: null, reject: sawMatch ? 'window_expired' : 'no_match' };
  }

  /**
   * Does the tail of the history spell this combo, within its window?
   *
   * Matched against the TAIL, so a longer run of keys ending in the right
   * three still fires — and a fourth key pressed AFTER a match has already
   * been consumed cannot re-trigger it, because `tryFire` clears the history.
   */
  private matches(combo: ComboDef, nowMs: number): boolean {
    const n = combo.sequence.length;
    if (n === 0 || this.history.length < n) return false;

    const tail = this.history.slice(-n);
    for (let i = 0; i < n; i++) {
      if (tail[i].token !== combo.sequence[i]) return false;
    }
    /* Every consecutive gap must be inside the window, and the whole thing
       must still be fresh. */
    for (let i = 1; i < n; i++) {
      if (tail[i].atMs - tail[i - 1].atMs > combo.windowMs) return false;
    }
    return nowMs - tail[n - 1].atMs <= combo.windowMs;
  }
}

/* ── forceState (N11) — CS13 Case 630, the corpus' only DESIGN PRINCIPLE case ─ */

/**
 * A behavioural compulsion placed on the opponent by a special.
 *
 * Every special applies one, each with a documented correct counter-play and
 * a punishment for the wrong response. For an AI it is "applied literally as
 * an aggression or positioning override", which is why this doubles as the
 * local-AI design rather than needing a separate behaviour tree.
 */
export type ForceState =
  | 'none'
  | 'must_attack'
  | 'must_stay_still'
  | 'cannot_attack_freely'
  | 'must_keep_distance'
  | 'must_leave_zone';

export interface ForcedBehaviour {
  state: ForceState;
  /** Sim-ms at which it lapses. */
  untilMs: number;
  /** Where the compulsion is anchored, for the positional states. */
  anchor?: { x: number; z: number; radius: number };
}

/** Is this compulsion still in force? */
export function forceActive(f: ForcedBehaviour, nowMs: number): boolean {
  return f.state !== 'none' && nowMs < f.untilMs;
}

/* ── QTE (N10) ───────────────────────────────────────────────────────────── */

/**
 * A counter window on an incoming special.
 *
 * THE CORPUS HOLDS TWO MUTUALLY EXCLUSIVE INPUT MODELS — CS13 1578 specifies
 * a mash and 1581 a 200 ms dual-input, and each is contradicted by its own
 * paired combo case, which encodes the same move as a plain 3-key sequence.
 * The plan calls for a decision rather than an implementation of both.
 *
 * DECISION TAKEN HERE: a single timed press, window 60-120 ms as CS13 Case
 * 630's QTE block specifies. A mash cannot be made fair across frame rates
 * (the number of inputs a player lands depends on their polling rate), and a
 * dual-input is a mash with extra steps. One press in a stated window is
 * measurable, replayable and identical on every device.
 */
export interface QteWindow {
  /** Sim-ms the window opens. */
  openMs: number;
  /** Width, ms. CS13 specifies 60-120. */
  widthMs: number;
  /** Token that counters it. */
  token: string;
}

export const QTE_MIN_WIDTH_MS = 60;
export const QTE_MAX_WIDTH_MS = 120;

export function qteSucceeds(w: QteWindow, press: KeyPress): boolean {
  if (press.token !== w.token) return false;
  const width = Math.min(QTE_MAX_WIDTH_MS, Math.max(QTE_MIN_WIDTH_MS, w.widthMs));
  return press.atMs >= w.openMs && press.atMs <= w.openMs + width;
}

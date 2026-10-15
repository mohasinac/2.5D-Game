import type { BeySystem, BeyDefeat } from './BeySystem';
import { makeBurstState } from '../sim/step/burst';

/* ══════════════════════════════════════════════════════════════════════════
   ROUNDS, SCORING, AND THE FIRST MATCH THAT CAN END

   Until `BeySystem` there was no way to lose: `health` is drained by traps
   and zones and never compared to zero, there is no burst, no sleep-out and
   no ring-out — only a `Y < -500` respawn guard. So "a match" did not exist
   as a concept anywhere in the project.

   FINISH TYPES ARE WORTH DISTINGUISHING, not collapsing into "someone won".
   Round pips are supposed to show HOW each round was won, and the three
   finishes score differently in the real game — a burst is worth more than
   outspinning. Keeping the cause through to the scoreboard is what makes
   that possible.

   The `dv >= 4.0 m/s` ring-out threshold is [CONFIRMED] in CS10 and is the
   one win-condition constant the corpus does not contradict itself about, so
   it is taken as given rather than tuned.
   ══════════════════════════════════════════════════════════════════════════ */

export type FinishKind = 'ring_out' | 'burst' | 'sleep_out' | 'health' | 'timeout' | 'draw';

/**
 * Points per finish.
 *
 * CORRECTED against CS5's Burst System case, which states it directly: a
 * burst scores "two points instead of the usual one for ring-out". This
 * table previously gave both 2, which made the Burst era's signature finish
 * worth no more than pushing someone out — removing the whole reason to
 * build for burst resistance.
 */
export const FINISH_POINTS: Record<FinishKind, number> = {
  burst:     2,
  ring_out:  1,
  sleep_out: 1,
  health:    1,
  timeout:   0,
  draw:      0,
};

/** Ring-out impulse threshold, m/s. CS10 [CONFIRMED]. */
export const RING_OUT_DV = 4.0;

export interface RoundResult {
  winner: string | null;
  loser: string | null;
  kind: FinishKind;
  /** Sim-ms the round lasted. */
  durationMs: number;
}

export interface MatchConfig {
  /**
   * ROUNDS needed to take the match. Best-of-three is 2.
   *
   * Was `pointsToWin`, compared against accumulated FINISH_POINTS — so a
   * burst (2 points) ended a best-of-three in one round.
   */
  roundsToWin: number;
  /** Round length before a timeout finish, ms. 0 disables the clock. */
  roundLimitMs: number;
}

export const DEFAULT_MATCH: MatchConfig = { roundsToWin: 2, roundLimitMs: 180_000 };

/**
 * Anything that can win or lose a round.
 *
 * THE PLAYER IS NOT A ROSTER ENTITY. `SpawnManager` owns it — it carries all
 * the arena-feature collision (speed lines, traps, zones, portals, jump links,
 * channels) that roster beys do not — and `BeySystem` only borrows it by
 * reference for contact. So a match decided purely over `BeySystem` sees, in a
 * 1v1, exactly ONE participant: the opponent. Kill it and `living()` is empty,
 * which took the simultaneous-knockout branch below and reported **a draw
 * worth zero points for a round the player had just won**. The player could
 * equally never lose, because nothing fed its defeat back at all.
 *
 * This interface is the seam. Merging the player into the roster instead would
 * mean moving ~900 lines of arena-feature collision into `BeySystem`, which is
 * a far larger change than the bug warrants.
 */
export interface BattleParticipant {
  readonly id: string;
  isAlive(): boolean;
  /** Spin magnitude, rad/s — the timeout tiebreak. */
  spinMagnitude(): number;
  /** Put it back in the dish for the next round. */
  resetForRound(): void;
}

export class MatchSystem {
  private scores = new Map<string, number>();
  /** Rounds taken, which is what ends the match. */
  private roundsWon = new Map<string, number>();
  private rounds: RoundResult[] = [];
  private roundStartMs = 0;
  private over = false;
  /**
   * Is a round actually in progress?
   *
   * WITHOUT THIS, ROUNDS END THAT NOBODY PLAYED. A finish is not instant on
   * screen — the banner, the camera move and the re-launch take about three
   * seconds — and the simulation keeps running throughout. So the loser of
   * round one goes on falling, and the WINNER goes on spinning DOWN, and
   * around three seconds later it crosses its own sleep-out threshold. That
   * is another defeat, with the other fighter still dead from the real round,
   * so the living set is empty and it scores as a DRAW.
   *
   * Observed exactly that way: ring_out, then a phantom `draw`, then
   * ring_out. In a best-of-three a phantom round is not cosmetic — two of
   * them can decide the match before the third is launched.
   *
   * A round that has already finished cannot finish again.
   */
  private live = false;
  /** Participants outside the roster. In practice: the player. */
  private externals: BattleParticipant[] = [];

  constructor(
    private readonly beys: BeySystem,
    private readonly config: MatchConfig = DEFAULT_MATCH,
  ) {}

  /** Register a non-roster fighter. Idempotent per id. */
  addParticipant(p: BattleParticipant): void {
    if (!this.externals.some(x => x.id === p.id)) this.externals.push(p);
  }

  clearParticipants(): void { this.externals.length = 0; }

  /** Everyone still in, roster and externals alike. */
  private livingIds(): string[] {
    const out = this.beys.living().map(e => e.spec.id);
    for (const p of this.externals) if (p.isAlive()) out.push(p.id);
    return out;
  }

  private spinOf(id: string): number {
    const e = this.beys.get(id);
    if (e) return Math.abs(e.state.omega);
    return this.externals.find(p => p.id === id)?.spinMagnitude() ?? 0;
  }

  beginRound(nowMs: number): void {
    this.roundStartMs = nowMs;
    this.live = true;
    for (const e of this.beys.all()) {
      e.alive = true;
      e.state.sleptOut = false;
      e.state.health = e.spec.maxHealth;
      /* The ratchet re-seats between rounds. Without this a bey that was
         nearly burst in round one starts round two one hit from losing. */
      e.burst = makeBurstState(e.burstSpec);

      /* RE-LAUNCH, which did not happen. Health and the ratchet reset but
         nothing spatial did, so round two began with the loser lying
         wherever it had died — usually motionless at the rim, already out of
         the fight before the round started. */
      e.state.pos.x = e.launch.pos.x;
      e.state.pos.y = e.launch.pos.y;
      e.state.pos.z = e.launch.pos.z;
      e.state.vel.x = e.launch.vel.x;
      e.state.vel.y = e.launch.vel.y;
      e.state.vel.z = e.launch.vel.z;
      e.state.omega = e.launch.omega;
      /* Tilt too: a bey that toppled last round would otherwise spawn already
         past the sleep-out angle and fall over instantly. */
      e.state.tiltDeg = 0;
      e.state.grounded = false;
    }
    for (const p of this.externals) p.resetForRound();
  }

  /**
   * Fold this tick's defeats into the round.
   *
   * Returns the round result the moment one is decided, so the caller can
   * run the finish presentation before anything is reset — the round has to
   * be observable at the instant it ends, not after cleanup.
   */
  update(nowMs: number, defeats: readonly BeyDefeat[]): RoundResult | null {
    /* `!live` is the inter-round gap — see the field. Defeats that land there
       belong to the round that just ended, not to the next one. */
    if (this.over || !this.live) return null;

    if (defeats.length > 0) {
      /* Spans roster AND externals, which is the whole fix: with the player
         counted, beating the opponent leaves one living fighter and resolves
         as a win instead of falling through to the draw branch. */
      const living = this.livingIds();
      /* A simultaneous knockout is a draw, not an arbitrary winner. It is
         rare and it is exactly the case a "take the first survivor" shortcut
         gets wrong. */
      if (living.length === 0) {
        return this.finishRound(null, defeats[0].id, 'draw', nowMs);
      }
      if (living.length === 1) {
        /* Report the cause of the fighter that actually fell, not whichever
           defeat happens to be first — with two sources feeding this, the
           order is no longer meaningful. */
        const d = defeats.find(x => x.id !== living[0]) ?? defeats[0];
        return this.finishRound(living[0], d.id, d.cause, nowMs);
      }
    }

    if (this.config.roundLimitMs > 0 && nowMs - this.roundStartMs >= this.config.roundLimitMs) {
      /* On the clock, the most spin left wins — the real tiebreak, and the
         reason spin decay had to be real before rounds could mean anything. */
      const living = this.livingIds();
      if (living.length === 0) return this.finishRound(null, null, 'draw', nowMs);
      const best = living.reduce((a, b) => (this.spinOf(b) > this.spinOf(a) ? b : a));
      return this.finishRound(best, null, 'timeout', nowMs);
    }
    return null;
  }

  private finishRound(
    winner: string | null, loser: string | null, kind: FinishKind, nowMs: number,
  ): RoundResult {
    this.live = false;
    const result: RoundResult = {
      winner, loser, kind, durationMs: nowMs - this.roundStartMs,
    };
    this.rounds.push(result);
    if (winner) {
      this.scores.set(winner, (this.scores.get(winner) ?? 0) + FINISH_POINTS[kind]);

      /* THE MATCH ENDS ON ROUNDS WON, NOT POINTS. Ending on points made a
         single burst — worth 2, against `pointsToWin: 2` — win the whole
         match outright, so "best of three" could never happen and the burst
         bonus silently became a one-hit kill. Points are still accumulated:
         they are the SCORE, shown on the HUD and used to break a tie. */
      const won = (this.roundsWon.get(winner) ?? 0) + 1;
      this.roundsWon.set(winner, won);
      if (won >= this.config.roundsToWin) this.over = true;
    }
    return result;
  }

  scoreOf(id: string): number { return this.scores.get(id) ?? 0; }
  /** Rounds taken — what actually decides the match. */
  roundsWonBy(id: string): number { return this.roundsWon.get(id) ?? 0; }
  /** Round-by-round history, including how each was won. For the pips. */
  history(): readonly RoundResult[] { return this.rounds; }
  isOver(): boolean { return this.over; }

  matchWinner(): string | null {
    if (!this.over) return null;
    let best: string | null = null, bestScore = -1;
    for (const [id, score] of this.roundsWon) {
      if (score > bestScore) { bestScore = score; best = id; }
    }
    return best;
  }

  reset(): void {
    this.live = false;
    this.scores.clear();
    this.roundsWon.clear();
    this.rounds.length = 0;
    this.over = false;
  }
}

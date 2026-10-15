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
  /** Rounds needed to take the match. Best-of-three is 2. */
  pointsToWin: number;
  /** Round length before a timeout finish, ms. 0 disables the clock. */
  roundLimitMs: number;
}

export const DEFAULT_MATCH: MatchConfig = { pointsToWin: 2, roundLimitMs: 180_000 };

export class MatchSystem {
  private scores = new Map<string, number>();
  private rounds: RoundResult[] = [];
  private roundStartMs = 0;
  private over = false;

  constructor(
    private readonly beys: BeySystem,
    private readonly config: MatchConfig = DEFAULT_MATCH,
  ) {}

  beginRound(nowMs: number): void {
    this.roundStartMs = nowMs;
    for (const e of this.beys.all()) {
      e.alive = true;
      e.state.sleptOut = false;
      e.state.health = e.spec.maxHealth;
      /* The ratchet re-seats between rounds. Without this a bey that was
         nearly burst in round one starts round two one hit from losing. */
      e.burst = makeBurstState(e.burstSpec);
    }
  }

  /**
   * Fold this tick's defeats into the round.
   *
   * Returns the round result the moment one is decided, so the caller can
   * run the finish presentation before anything is reset — the round has to
   * be observable at the instant it ends, not after cleanup.
   */
  update(nowMs: number, defeats: readonly BeyDefeat[]): RoundResult | null {
    if (this.over) return null;

    if (defeats.length > 0) {
      const living = this.beys.living();
      /* A simultaneous knockout is a draw, not an arbitrary winner. It is
         rare and it is exactly the case a "take the first survivor" shortcut
         gets wrong. */
      if (living.length === 0) {
        return this.finishRound(null, defeats[0].id, 'draw', nowMs);
      }
      if (living.length === 1) {
        const d = defeats[0];
        return this.finishRound(living[0].spec.id, d.id, d.cause, nowMs);
      }
    }

    if (this.config.roundLimitMs > 0 && nowMs - this.roundStartMs >= this.config.roundLimitMs) {
      /* On the clock, the most spin left wins — the real tiebreak, and the
         reason spin decay had to be real before rounds could mean anything. */
      const living = this.beys.living();
      if (living.length === 0) return this.finishRound(null, null, 'draw', nowMs);
      const best = living.reduce((a, b) =>
        Math.abs(b.state.omega) > Math.abs(a.state.omega) ? b : a);
      return this.finishRound(best.spec.id, null, 'timeout', nowMs);
    }
    return null;
  }

  private finishRound(
    winner: string | null, loser: string | null, kind: FinishKind, nowMs: number,
  ): RoundResult {
    const result: RoundResult = {
      winner, loser, kind, durationMs: nowMs - this.roundStartMs,
    };
    this.rounds.push(result);
    if (winner) {
      const pts = (this.scores.get(winner) ?? 0) + FINISH_POINTS[kind];
      this.scores.set(winner, pts);
      if (pts >= this.config.pointsToWin) this.over = true;
    }
    return result;
  }

  scoreOf(id: string): number { return this.scores.get(id) ?? 0; }
  /** Round-by-round history, including how each was won. For the pips. */
  history(): readonly RoundResult[] { return this.rounds; }
  isOver(): boolean { return this.over; }

  matchWinner(): string | null {
    if (!this.over) return null;
    let best: string | null = null, bestScore = -1;
    for (const [id, score] of this.scores) {
      if (score > bestScore) { bestScore = score; best = id; }
    }
    return best;
  }

  reset(): void {
    this.scores.clear();
    this.rounds.length = 0;
    this.over = false;
  }
}

import { test, expect } from '@playwright/test';

/**
 * A MATCH THE PLAYER CAN WIN, AND A MATCH THE PLAYER CAN LOSE.
 *
 * WHY THIS EXISTS
 * ───────────────
 * Both directions were impossible, for two unrelated reasons, and neither
 * threw, logged, or looked broken on screen.
 *
 *   WINNING was reported as a draw. `MatchSystem` decided rounds purely over
 *   `BeySystem`'s roster, and the player is not in it — `SpawnManager` owns
 *   the player because it carries all the arena-feature collision (speed
 *   lines, traps, zones, portals, channels) that roster beys do not. So in a
 *   1v1 the match saw exactly ONE participant. Kill the opponent and the
 *   living set was EMPTY, which took the simultaneous-knockout branch and
 *   returned `draw`, worth zero points, for a round the player had just won.
 *
 *   LOSING did not exist at all. Nothing fed the player's defeat back into the
 *   match, so a motionless, burst, ringed-out player was still "in".
 *
 * WHY POSITION AND SPIN ARE NOT ENOUGH TO TEST THIS. A screenshot of a won
 * round and a screenshot of a drawn round are identical: one bey spinning, one
 * bey still. The defect lived entirely in the scoreboard, so the assertions
 * have to read the scoreboard — which is why `getMatchDiag` reports the round
 * history, the per-fighter rounds-won, and the player (absent from `beys`,
 * since it is not a roster entity).
 *
 * FALSIFICATION. Checked the way the pitfalls file demands — by disabling the
 * fix, not by trusting the pass:
 *   · Restore the roster-only living set and `wins a match` fails on
 *     `kind: 'draw'` and a null winner.
 *   · Drop the player's defeat feed and `loses a match` times out with the
 *     match never ending.
 *   · Score in points with `pointsToWin: 2` and `two rounds, not one burst`
 *     fails: the match ends after a single round.
 */

const BATTLE = '/battle';

/** `PLAYER_BEY_ID` — the id `SpawnManager` registers the player under. */
const PLAYER = 'spawn_ball';

/** Far outside the octagon base's footprint. `BASE_APOTHEM` is 100 cm. */
const OFF_THE_BASE = { x: 4000, y: 20, z: 0 };

/** `FINISH_POINTS`. A burst is worth two; everything decisive is worth one. */
const POINTS: Record<string, number> = {
  burst: 2, ring_out: 1, sleep_out: 1, health: 1, timeout: 0, draw: 0,
};

interface MatchDiag {
  running: boolean;
  roundsPlayed: number;
  over: boolean;
  matchWinner: string | null;
  participants: string[];
  rounds: { winner: string | null; loser: string | null; kind: string }[];
  roundsWon: Record<string, number>;
  score: Record<string, number>;
  player: { id: string; alive: boolean; rpm: number; burst: number; y: number } | null;
  beys: { id: string; alive: boolean; rpm: number; sleptOut: boolean; y: number }[];
}

/* The match layer is physics and bookkeeping, not layout — it behaves
   identically at every viewport, so running this three times would triple the
   wall clock and the flake surface for no extra information. The responsive
   work is covered by `screens.spec.ts`, which runs on all three. */
test.skip(({ viewport }) => (viewport?.width ?? 0) < 1000,
  'match bookkeeping is viewport-independent; covered once, on desktop');

/**
 * Start a battle, and leave physics on the VARIABLE timestep.
 *
 * That is the opposite of the deck-collision spec, deliberately.
 * `setFixedTimestep` advances sim time by a fixed amount PER FRAME, so sim
 * time is yoked to frame rate — and under SwiftShader, where the whole suite
 * runs, frames are slow enough that a 12-second match took longer than the
 * 90-second test budget. It failed as a timeout, which reads as "the battle
 * hung" and is nothing of the kind.
 *
 * A fixed step buys protection from tunnelling, and this spec does not need
 * it: it asserts on BOOKKEEPING — who was recorded as beating whom, and for
 * how many points. Both round outcomes below are forced outright, so no
 * assertion here depends on a contact resolving precisely, or at all.
 */
async function startBattle(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(BATTLE);
  await page.waitForFunction(() => !!window.__demo?.ready, null, { timeout: 60_000 });
  await page.locator('#battle-start').click();
  await page.waitForFunction(() => (window.__demo.getMatchDiag() as unknown as MatchDiag).running,
    null, { timeout: 15_000 });
}

/**
 * What the match looked like, for a failure message.
 *
 * A bare `expected true, received false` on "did the match end" says nothing
 * about WHY — a stalled round, a phantom draw and a match that ended one round
 * short all read identically. This prints the history instead.
 */
function summarise(d: MatchDiag): string {
  const hist = d.rounds.map(r => `${r.kind}(w=${r.winner},l=${r.loser})`).join(' | ') || 'no rounds';
  const roster = d.beys.map(b => `${b.id}:${b.alive ? 'alive' : 'out'}@${Math.round(b.rpm)}rpm`).join(', ');
  const p = d.player
    ? `player:${d.player.alive ? 'alive' : 'out'}@${Math.round(d.player.rpm)}rpm y=${Math.round(d.player.y)}`
    : 'player:absent';
  return `[${hist}] roundsWon=${JSON.stringify(d.roundsWon)} ${p} ${roster}`;
}

/** Which side is made to lose each round. */
type Force = 'player' | 'opponents';

/**
 * Poll the match until it ends, forcing one side to lose every tick.
 *
 * FORCING IS WHY THIS IS A TEST AND NOT A COIN FLIP. Letting the fight play
 * out would make the result depend on balance tuning, so every future tuning
 * pass would break a test about scoring. Both levers below decide a round
 * without touching any of the code under test, and both repeat each tick
 * because `beginRound` RE-LAUNCHES everyone — that is one of the fixes this
 * spec covers, so forcing once would settle round one and then stall.
 *
 * THE TWO SIDES NEED DIFFERENT LEVERS, and finding that out was the whole
 * difficulty:
 *
 *   The PLAYER is dropped off the edge of the octagon base. Not teleported
 *   below the floor — at the stadium centre the surface resolver lifts it
 *   straight back onto the bowl (observed: set to y = -400, read back -12 on
 *   the next frame). Past `BASE_APOTHEM` there is nothing under it, so it
 *   falls honestly and rings out, which is the real defeat path rather than a
 *   simulated one.
 *
 *   The OPPONENT has its SPIN zeroed. The same teleport fails here for a
 *   second, unrelated reason: `containToEllipse` only lets a bey leave the
 *   rim above the ring-out speed, so a teleported bey — which has no velocity
 *   — is dragged back inside before anything observes it. Nothing undoes a
 *   spin of zero, so it sleeps out.
 */
async function runUntil(
  page: import('@playwright/test').Page,
  force: Force,
  opts: { tickMs?: number; timeoutMs?: number } = {},
): Promise<MatchDiag> {
  const { tickMs = 150, timeoutMs = 150_000 } = opts;
  const deadline = Date.now() + timeoutMs;
  let last = await page.evaluate(() => window.__demo.getMatchDiag() as unknown as MatchDiag);

  while (Date.now() < deadline && !last.over) {
    last = await page.evaluate((a: { who: Force; off: { x: number; y: number; z: number } }) => {
      const api = window.__demo;
      const d = api.getMatchDiag() as unknown as MatchDiag;
      if (a.who === 'player') {
        if (d.player?.alive) api.setBeyPosition(a.off);
      } else {
        for (const b of d.beys) if (b.alive) api.setRosterState(b.id, { omega: 0 });
      }
      return api.getMatchDiag() as unknown as MatchDiag;
    }, { who: force, off: OFF_THE_BASE });
    if (last.over) break;
    await page.waitForTimeout(tickMs);
  }
  return last;
}

/* A full best-of-three is three launches plus two ~3-second finish
   presentations, and each poll is a round trip into a SwiftShader page. The
   default 90 s budget is not generous enough for that, and a budget overrun
   reads as "the battle hung", which is the most misleading failure this spec
   could produce. */
test.describe.configure({ timeout: 240_000 });

test.describe('the battle loop', () => {
  test('counts the player as a fighter at all', async ({ page }) => {
    await startBattle(page);
    const d = await page.evaluate(() => window.__demo.getMatchDiag() as unknown as MatchDiag);

    /* THE ROOT CAUSE, asserted directly. With the player missing from the
       participant set every other symptom in this file follows, so it is worth
       failing here with a clear message rather than later as a mystery draw. */
    expect(d.participants).toContain(PLAYER);
    expect(d.participants.length).toBeGreaterThanOrEqual(2);
    expect(d.player).not.toBeNull();
    expect(d.player!.alive).toBe(true);
    /* Launched, not merely present: a player at 0 rpm is already defeated. */
    expect(d.player!.rpm).toBeGreaterThan(100);
    /* The ratchet starts re-seated. It did not, between rounds, which meant a
       bey that survived round one at 7/8 clicks began round two one hit from
       losing — invisible on screen, decisive in play. */
    expect(d.player!.burst).toBe(0);
  });

  test('the player WINS a match, and not by a draw', async ({ page }) => {
    await startBattle(page);
    const d = await runUntil(page, 'opponents');

    expect(d.over, `the match must actually end — saw ${summarise(d)}`).toBe(true);
    expect(d.matchWinner).toBe(PLAYER);

    /* THE DRAW BUG. Every round the player took used to be recorded as a draw
       with a null winner, so this is the assertion that pins it. */
    for (const r of d.rounds) {
      expect(r.kind, 'a decided round is never a draw').not.toBe('draw');
      expect(r.winner, 'a decided round always names a winner').not.toBeNull();
    }
    expect(d.rounds.filter(r => r.winner === PLAYER).length).toBeGreaterThanOrEqual(2);
    expect(d.roundsWon[PLAYER]).toBeGreaterThanOrEqual(2);
  });

  test('two rounds decide it, not one burst', async ({ page }) => {
    await startBattle(page);
    const d = await runUntil(page, 'opponents');

    /* Scoring used to be in POINTS against `pointsToWin: 2`, and a burst is
       worth 2 — so a single burst finish ended a best-of-three outright and
       "best of three" was unreachable. Rounds decide; points are the
       scoreboard figure. */
    expect(d.rounds.length).toBeGreaterThanOrEqual(2);

    /* And the points table is still applied — checked by reconstructing the
       winner's score from the finish kinds. This is what keeps the burst bonus
       honest: if `FINISH_POINTS.burst` silently became 1, a burst round would
       no longer reconcile. */
    const expected = d.rounds
      .filter(r => r.winner === d.matchWinner)
      .reduce((sum, r) => sum + (POINTS[r.kind] ?? 0), 0);
    expect(d.score[d.matchWinner!]).toBe(expected);
  });

  test('the player LOSES when it leaves the stadium', async ({ page }) => {
    await startBattle(page);
    const d = await runUntil(page, 'player');

    expect(d.over, `the player losing must end the match too — saw ${summarise(d)}`).toBe(true);
    expect(d.matchWinner).not.toBe(PLAYER);
    expect(d.matchWinner).not.toBeNull();

    /* Not just "the player did not win" — the player must be recorded as the
       LOSER, with the cause the stadium actually gave it. Nothing fed player
       defeat into the match before, so every one of these was unreachable. */
    const lost = d.rounds.filter(r => r.loser === PLAYER);
    expect(lost.length).toBeGreaterThanOrEqual(2);
    expect(lost.every(r => r.kind === 'ring_out')).toBe(true);
    expect(d.roundsWon[PLAYER] ?? 0).toBe(0);
  });
});

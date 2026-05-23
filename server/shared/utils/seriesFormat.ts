// Shared series-format helpers (BO1 / BO3 / BO5).
// Used by all room types except TryoutRoom (which is always BO1).

export type BestOf = 1 | 3 | 5;

export function normalizeBestOf(value: unknown): BestOf {
  if (value === 3) return 3;
  if (value === 5) return 5;
  return 1;
}

// First to ceil(bestOf / 2) game wins takes the series.
export function targetWinsFor(bestOf: BestOf): number {
  return Math.ceil(bestOf / 2);
}

// True if any player has reached targetWins.
export function isSeriesOver(seriesWins: Iterable<number>, targetWins: number): boolean {
  for (const w of seriesWins) {
    if (w >= targetWins) return true;
  }
  return false;
}

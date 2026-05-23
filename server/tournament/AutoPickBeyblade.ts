import { getAvailableBeybladeIds } from "../utils/tournamentFirebase";
import { createPRNG } from "../utils/prng";
import { hashString } from "../utils/hashString";

interface AutoPickOptions {
  tournamentAllowedIds: string[];
  tournamentDisabledIds: string[];
  globalBlacklist: string[];
  alreadyPickedInMatch: string[];
  seed?: string; // deterministic seed (e.g. matchId + participantId)
}

/**
 * Select a random beyblade for an AI participant or a player with no selection.
 * Called only from TournamentScheduler — never inside a physics tick.
 */
export async function autoPickBeyblade(options: AutoPickOptions): Promise<string> {
  const {
    tournamentAllowedIds,
    tournamentDisabledIds,
    globalBlacklist,
    alreadyPickedInMatch,
    seed,
  } = options;

  const candidates = await getAvailableBeybladeIds(tournamentAllowedIds, [
    ...tournamentDisabledIds,
    ...globalBlacklist,
  ]);

  const pickedSet = new Set(alreadyPickedInMatch);
  const filtered = candidates.filter((id) => !pickedSet.has(id));

  if (filtered.length === 0) {
    console.warn("[AutoPickBeyblade] No eligible beyblades — falling back to 'default'");
    return "default";
  }

  // Use seeded PRNG for deterministic selection
  const rand = seed ? createPRNG(hashString(seed)) : createPRNG(Math.floor(Math.random() * 2 ** 32));
  const index = Math.floor(rand() * filtered.length);
  return filtered[index];
}

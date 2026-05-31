import { describe, test, expect, vi } from "vitest";

// ─── Firebase mock (server-side uses firebase-admin) ─────────────────────────

vi.mock("firebase-admin", () => {
  const apps: any[] = [];
  const data = {
    bey1: { id: "bey1", type: "attack" },
    bey2: { id: "bey2", type: "defense" },
    bey3: { id: "bey3", type: "stamina" },
    bey4: { id: "bey4", type: "balanced" },
    bey5: { id: "bey5", type: "attack" },
  };

  const makeDocs = (filter?: string[]) =>
    Object.entries(data)
      .filter(([id]) => !filter || filter.includes(id))
      .map(([id, d]) => ({ id, data: () => d, exists: true }));

  const querySnap = (docs: any[]) => ({ docs, size: docs.length, empty: docs.length === 0 });

  let _getSnap: any = null;

  const collection = vi.fn().mockReturnValue({
    get: vi.fn().mockImplementation(() => Promise.resolve(querySnap(makeDocs()))),
    where: vi.fn().mockReturnThis(),
    // Simulate `.in(ids)` filtering
    orderBy: vi.fn().mockReturnThis(),
  });

  return {
    apps,
    credential: { cert: vi.fn() },
    initializeApp: vi.fn().mockImplementation(() => { apps.push({}); }),
    firestore: Object.assign(
      vi.fn().mockReturnValue({ collection }),
      {
        FieldPath: { documentId: vi.fn().mockReturnValue("__id__") },
        FieldValue: { serverTimestamp: vi.fn().mockReturnValue("SERVER_TS") },
        Timestamp: { fromDate: (d: Date) => d },
      }
    ),
  };
});

vi.mock("../../server/utils/firebase", () => ({
  loadBeybladesBatch: vi.fn().mockImplementation(async (ids: string[]) => {
    const ALL: Record<string, any> = {
      bey1: { id: "bey1", type: "attack" },
      bey2: { id: "bey2", type: "defense" },
      bey3: { id: "bey3", type: "stamina" },
      bey4: { id: "bey4", type: "balanced" },
      bey5: { id: "bey5", type: "attack" },
    };
    const result = new Map<string, any>();
    for (const id of ids) if (ALL[id]) result.set(id, ALL[id]);
    return result;
  }),
  db: {},
}));

import { autoPickBeyblade } from "../../server/tournament/AutoPickBeyblade";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("autoPickBeyblade — basic selection", () => {
  test("returns a non-empty string", async () => {
    const result = await autoPickBeyblade({
      tournamentAllowedIds: ["bey1", "bey2", "bey3"],
      tournamentDisabledIds: [],
      globalBlacklist: [],
      alreadyPickedInMatch: [],
      seed: "test-match",
    });
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("picks from the allowed list", async () => {
    const allowed = ["bey1", "bey2", "bey3"];
    const result = await autoPickBeyblade({
      tournamentAllowedIds: allowed,
      tournamentDisabledIds: [],
      globalBlacklist: [],
      alreadyPickedInMatch: [],
      seed: "test",
    });
    expect(allowed).toContain(result);
  });

  test("excludes disabled IDs", async () => {
    const result = await autoPickBeyblade({
      tournamentAllowedIds: ["bey1", "bey2", "bey3"],
      tournamentDisabledIds: ["bey1", "bey2"],
      globalBlacklist: [],
      alreadyPickedInMatch: [],
      seed: "test",
    });
    expect(result).toBe("bey3");
  });

  test("excludes global blacklist IDs", async () => {
    const result = await autoPickBeyblade({
      tournamentAllowedIds: ["bey1", "bey2"],
      tournamentDisabledIds: [],
      globalBlacklist: ["bey1"],
      alreadyPickedInMatch: [],
      seed: "test",
    });
    expect(result).toBe("bey2");
  });

  test("excludes already-picked IDs in this match", async () => {
    const result = await autoPickBeyblade({
      tournamentAllowedIds: ["bey1", "bey2"],
      tournamentDisabledIds: [],
      globalBlacklist: [],
      alreadyPickedInMatch: ["bey1"],
      seed: "test",
    });
    expect(result).toBe("bey2");
  });

  test("falls back to 'default' when all options are excluded", async () => {
    const result = await autoPickBeyblade({
      tournamentAllowedIds: ["bey1"],
      tournamentDisabledIds: ["bey1"],
      globalBlacklist: [],
      alreadyPickedInMatch: [],
      seed: "test",
    });
    expect(result).toBe("default");
  });
});

describe("autoPickBeyblade — distribution (seeded)", () => {
  test("different seeds pick different beyblades from the same pool", async () => {
    const pool = ["bey1", "bey2", "bey3", "bey4", "bey5"];
    const picks = await Promise.all(
      ["seed-a", "seed-b", "seed-c", "seed-d", "seed-e"].map((seed) =>
        autoPickBeyblade({
          tournamentAllowedIds: pool,
          tournamentDisabledIds: [],
          globalBlacklist: [],
          alreadyPickedInMatch: [],
          seed,
        }),
      ),
    );
    const unique = new Set(picks);
    // With 5 picks from 5 IDs and different seeds, we expect variety
    expect(unique.size).toBeGreaterThan(1);
  });
});

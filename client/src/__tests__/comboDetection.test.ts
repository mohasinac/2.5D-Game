/**
 * Combo detection tests — exercises src/utils/comboSystem.ts via relative path.
 * The client vitest config has no rootDir restriction, so this is allowed.
 */
import { describe, it, expect } from "vitest";
import {
  createComboTracker,
  detectCombo,
  pruneHistory,
} from "../../../src/utils/comboSystem";

// ─── helpers ────────────────────────────────────────────────────────────────

const T0 = 1000; // arbitrary start time

function quickFire(
  keys: Parameters<typeof detectCombo>[1],
  opts: Parameters<typeof detectCombo>[3] = {}
) {
  const tracker = createComboTracker();
  return detectCombo(tracker, keys, T0 + 300, opts);
}

// ─── basic detection ─────────────────────────────────────────────────────────

describe("detectCombo — basic match", () => {
  it("quick-dash-l fires on ←←J within window", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, {});
    expect(result).not.toBeNull();
    expect(result?.comboId).toBe("quick-dash-l");
  });

  it("power-thrust fires on JJJ with sufficient power", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, { power: 100 });
    detectCombo(tracker, ["attack"], T0 + 100, { power: 100 });
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 100 });
    expect(result?.comboId).toBe("power-thrust");
  });

  it("result costPaid matches combo definition", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, {});
    detectCombo(tracker, ["attack"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 100 });
    expect(result?.costPaid).toBe(25);
  });
});

// ─── window enforcement ──────────────────────────────────────────────────────

describe("detectCombo — timing window", () => {
  it("returns null when 3 keys span more than windowMs", () => {
    const tracker = createComboTracker();
    // quick-dash-l windowMs = 400ms; spread across 600ms → no match
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 200, {});
    const result = detectCombo(tracker, ["attack"], T0 + 601, {});
    // pruneHistory removes entries older than 600ms (default maxWindowMs)
    // The first entry is at T0=1000, last at T0+601=1601 → diff=601 > 600 → first pruned
    // so history only has 2 entries → no match
    expect(result).toBeNull();
  });

  it("fires when all 3 keys arrive within windowMs", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 150, {});
    const result = detectCombo(tracker, ["attack"], T0 + 300, {});
    expect(result?.comboId).toBe("quick-dash-l");
  });
});

// ─── attachedComboIds restriction ────────────────────────────────────────────

describe("detectCombo — attachedComboIds", () => {
  it("returns null when combo is not attached to beyblade", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, {
      attachedComboIds: ["guard-tap"], // quick-dash-l not in list
    });
    expect(result).toBeNull();
  });

  it("fires when combo is in attachedComboIds", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, {
      attachedComboIds: ["quick-dash-l"],
    });
    expect(result?.comboId).toBe("quick-dash-l");
  });
});

// ─── power check ─────────────────────────────────────────────────────────────

describe("detectCombo — power threshold", () => {
  it("returns null when power < combo cost", () => {
    // power-thrust costs 25
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, {});
    detectCombo(tracker, ["attack"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 20 });
    expect(result).toBeNull();
  });

  it("fires when power >= combo cost", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, {});
    detectCombo(tracker, ["attack"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 25 });
    expect(result?.comboId).toBe("power-thrust");
  });

  it("free combos (cost=0) fire regardless of power level", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], { power: 0 });
    expect(result?.comboId).toBe("quick-dash-l");
  });
});

// ─── per-combo cooldown ───────────────────────────────────────────────────────

describe("detectCombo — cooldown", () => {
  it("second fire is blocked while combo is on cooldown", () => {
    const tracker = createComboTracker();
    // Fire quick-dash-l at T0
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const first = detectCombo(tracker, ["attack"], T0 + 200, {});
    expect(first?.comboId).toBe("quick-dash-l");

    // Immediately try same combo — cooldown not expired (quick-dash-l cooldownMs=800)
    detectCombo(tracker, ["moveLeft"], T0 + 300, {});
    detectCombo(tracker, ["moveLeft"], T0 + 400, {});
    const second = detectCombo(tracker, ["attack"], T0 + 500, {});
    expect(second).toBeNull();
  });

  it("fires again after cooldown expires", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["attack"], T0 + 200, {});

    // Wait past cooldown (quick-dash-l cooldownMs=800; try at T0+1100)
    detectCombo(tracker, ["moveLeft"], T0 + 1100, {});
    detectCombo(tracker, ["moveLeft"], T0 + 1200, {});
    const second = detectCombo(tracker, ["attack"], T0 + 1300, {});
    expect(second?.comboId).toBe("quick-dash-l");
  });
});

// ─── type restriction ─────────────────────────────────────────────────────────

describe("detectCombo — type restriction", () => {
  it("spin-leech-jab blocked for non-stamina beyblade", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["attack"], T0 + 100, {});
    const result = detectCombo(tracker, ["moveRight"], T0 + 200, {
      beybladeType: "attack",
      power: 100,
    });
    expect(result).toBeNull();
  });

  it("spin-leech-jab allowed for stamina beyblade", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["attack"], T0 + 100, {});
    const result = detectCombo(tracker, ["moveRight"], T0 + 200, {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result?.comboId).toBe("spin-leech-jab");
  });
});

// ─── pruneHistory ────────────────────────────────────────────────────────────

describe("pruneHistory", () => {
  it("removes entries older than maxWindowMs", () => {
    const tracker = createComboTracker();
    tracker.history = [
      { key: "moveLeft", timestamp: 100 },
      { key: "moveLeft", timestamp: 500 },
      { key: "attack",   timestamp: 900 },
    ];
    pruneHistory(tracker, 1000, 400);
    // 1000 - 100 = 900 > 400 → removed; 1000 - 500 = 500 > 400 → removed; 1000 - 900 = 100 ≤ 400 → kept
    expect(tracker.history).toHaveLength(1);
    expect(tracker.history[0].key).toBe("attack");
  });
});

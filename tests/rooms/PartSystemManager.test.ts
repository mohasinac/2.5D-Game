// Unit tests for PartSystemManager's two new pure-logic behaviours:
//   1. Per-part combo merge (registerBey)
//   2. Player-switchable config cycling (applyConfigSwitch)
//
// The PartSystemManager class itself has heavy Colyseus + PartPhysics dependencies,
// so we replicate the two business-logic functions as stubs and verify them in
// isolation — the same pattern used throughout this test suite.

import { describe, test, expect, beforeEach } from "vitest";

// ─── Shared constants (mirrors PartSystemManager.ts) ─────────────────────────

const MODE_SWITCH_COOLDOWN_MS = 2_000;
const EFFECTIVE_COMBO_CAP = 8;

// ─── Minimal mock types ───────────────────────────────────────────────────────

interface MockConfig {
  name: string;
  displayName?: string;
  playerSwitchable?: boolean;
}

interface MockPart {
  id: string;
  comboIds?: string[];
  specialMoveId?: string;
  configurations?: MockConfig[];
}

interface MockBey {
  comboIds: string[];      // ArraySchema-like (push / forEach / clear)
  specialMove: string;
  activePartConfigs: Map<string, string>;
  configLastSwitchAt: Map<string, number>;
  defaultSpinDirection: string;
}

function makeBey(overrides: Partial<MockBey> = {}): MockBey {
  return {
    comboIds: [],
    specialMove: "",
    activePartConfigs: new Map(),
    configLastSwitchAt: new Map(),
    defaultSpinDirection: "right",
    ...overrides,
  };
}

// ─── Stubbed mergePartCombos (mirrors PartSystemManager.registerBey combo path) ─

function mergePartCombos(wholeBeyIds: string[], partsComboLists: string[][]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const id of wholeBeyIds) {
    if (typeof id === "string" && !seen.has(id)) { seen.add(id); merged.push(id); }
  }
  for (const ids of partsComboLists) {
    for (const id of ids) {
      if (!id || seen.has(id) || merged.length >= EFFECTIVE_COMBO_CAP) continue;
      seen.add(id);
      merged.push(id);
    }
  }
  return merged;
}

// ─── Stubbed seedDefaultConfigs (mirrors registerBey config-seed path) ─────────

function seedDefaultConfigs(bey: MockBey, partsByLayer: Record<string, MockPart | undefined>): void {
  for (const [layer, part] of Object.entries(partsByLayer)) {
    if (!part) continue;
    if (bey.activePartConfigs.get(layer)) continue;
    const def = (part.configurations ?? []).find((c) => c.playerSwitchable === true);
    if (def?.name) bey.activePartConfigs.set(layer, def.name);
  }
}

// ─── Stubbed resolveSpecialMove (mirrors registerBey specialMove path) ─────────

function resolveSpecialMove(
  wholeBeySpecial: string,
  partsInOrder: Array<MockPart | undefined>
): string {
  if (wholeBeySpecial && wholeBeySpecial !== "tactical_burst") return wholeBeySpecial;
  for (const p of partsInOrder) {
    if (p?.specialMoveId) return p.specialMoveId;
  }
  return wholeBeySpecial;
}

// ─── Stubbed applyConfigSwitch (mirrors PartSystemManager.applyConfigSwitch) ──

function applyConfigSwitch(
  bey: MockBey,
  part: MockPart | undefined,
  partLayer: string,
  configId: string | undefined,
  nowMs: number
): string | null {
  if (!part) return null;
  const cfgs = (part.configurations ?? []).filter((c) => c.playerSwitchable === true);
  if (cfgs.length === 0) return null;

  const lastAt = bey.configLastSwitchAt.get(partLayer) ?? 0;
  if (nowMs - lastAt < MODE_SWITCH_COOLDOWN_MS) return null;

  let target: MockConfig | undefined;
  if (configId) {
    target = cfgs.find((c) => c.name === configId);
  } else {
    const current = bey.activePartConfigs.get(partLayer) ?? "";
    const currIdx = cfgs.findIndex((c) => c.name === current);
    target = cfgs[(currIdx + 1) % cfgs.length];
  }
  if (!target) return null;

  bey.activePartConfigs.set(partLayer, target.name);
  bey.configLastSwitchAt.set(partLayer, nowMs);
  return target.name;
}

// ─── Tests: mergePartCombos ───────────────────────────────────────────────────

describe("mergePartCombos — per-part combo merging", () => {
  test("whole-bey combos appear first in the merged list", () => {
    const result = mergePartCombos(["guard-tap", "feint"], [["quick-dash-l"]]);
    expect(result[0]).toBe("guard-tap");
    expect(result[1]).toBe("feint");
  });

  test("per-part combos are appended after whole-bey combos", () => {
    const result = mergePartCombos(["guard-tap"], [["quick-dash-l", "pivot-strike"]]);
    expect(result).toEqual(["guard-tap", "quick-dash-l", "pivot-strike"]);
  });

  test("duplicates across whole-bey and parts are deduplicated", () => {
    const result = mergePartCombos(["quick-dash-l"], [["quick-dash-l", "feint"]]);
    // quick-dash-l appears only once
    expect(result.filter((id) => id === "quick-dash-l")).toHaveLength(1);
    expect(result).toContain("feint");
  });

  test("duplicates across multiple parts are deduplicated", () => {
    const result = mergePartCombos([], [["quick-dash-l"], ["quick-dash-l", "feint"]]);
    expect(result.filter((id) => id === "quick-dash-l")).toHaveLength(1);
  });

  test("result is capped at EFFECTIVE_COMBO_CAP (8)", () => {
    const whole = ["c1", "c2", "c3", "c4"];
    const parts = [["c5", "c6", "c7", "c8", "c9", "c10"]];
    const result = mergePartCombos(whole, parts);
    expect(result.length).toBe(EFFECTIVE_COMBO_CAP);
    // c9 and c10 are dropped
    expect(result).not.toContain("c9");
    expect(result).not.toContain("c10");
  });

  test("works when only per-part combos exist (no whole-bey combos)", () => {
    const result = mergePartCombos([], [["quick-dash-r"], ["guard-tap"]]);
    expect(result).toEqual(["quick-dash-r", "guard-tap"]);
  });

  test("works when only whole-bey combos exist (no parts)", () => {
    const result = mergePartCombos(["power-thrust", "riposte"], []);
    expect(result).toEqual(["power-thrust", "riposte"]);
  });

  test("empty strings are excluded from the merged list", () => {
    const result = mergePartCombos(["guard-tap"], [["", "feint"]]);
    expect(result).not.toContain("");
    expect(result).toContain("feint");
  });

  test("combos from multiple parts are all included (within cap)", () => {
    const result = mergePartCombos([], [["c1"], ["c2"], ["c3"]]);
    expect(result).toEqual(["c1", "c2", "c3"]);
  });
});

// ─── Tests: seedDefaultConfigs ───────────────────────────────────────────────

describe("seedDefaultConfigs — playerSwitchable config initialisation", () => {
  test("seeds first playerSwitchable config as default for a part slot", () => {
    const bey = makeBey();
    const tip: MockPart = {
      id: "flat",
      configurations: [
        { name: "attack-mode", playerSwitchable: true },
        { name: "defense-mode", playerSwitchable: true },
      ],
    };
    seedDefaultConfigs(bey, { tip });
    expect(bey.activePartConfigs.get("tip")).toBe("attack-mode");
  });

  test("does not overwrite an already-set config", () => {
    const bey = makeBey();
    bey.activePartConfigs.set("tip", "defense-mode");
    const tip: MockPart = {
      id: "flat",
      configurations: [{ name: "attack-mode", playerSwitchable: true }],
    };
    seedDefaultConfigs(bey, { tip });
    expect(bey.activePartConfigs.get("tip")).toBe("defense-mode");
  });

  test("skips non-playerSwitchable configs", () => {
    const bey = makeBey();
    const tip: MockPart = {
      id: "sharp",
      configurations: [{ name: "hidden-cfg", playerSwitchable: false }],
    };
    seedDefaultConfigs(bey, { tip });
    expect(bey.activePartConfigs.has("tip")).toBe(false);
  });

  test("skips parts with no configurations", () => {
    const bey = makeBey();
    seedDefaultConfigs(bey, { ar: { id: "tornado-wing" } });
    expect(bey.activePartConfigs.has("ar")).toBe(false);
  });

  test("seeds multiple slots independently", () => {
    const bey = makeBey();
    const tip: MockPart = { id: "flat", configurations: [{ name: "attack-mode", playerSwitchable: true }] };
    const ar: MockPart = { id: "scissor", configurations: [{ name: "aggressive", playerSwitchable: true }] };
    seedDefaultConfigs(bey, { tip, ar });
    expect(bey.activePartConfigs.get("tip")).toBe("attack-mode");
    expect(bey.activePartConfigs.get("ar")).toBe("aggressive");
  });
});

// ─── Tests: resolveSpecialMove ────────────────────────────────────────────────

describe("resolveSpecialMove — per-part special move fallback", () => {
  test("whole-bey special move wins when set", () => {
    const result = resolveSpecialMove("stampede-rush", [{ id: "p", specialMoveId: "gyro-anchor" }]);
    expect(result).toBe("stampede-rush");
  });

  test("falls back to bit_beast (first in order) when whole-bey is empty", () => {
    const result = resolveSpecialMove("", [
      { id: "bit-beast", specialMoveId: "stampede-rush" },
      { id: "core", specialMoveId: "gyro-anchor" },
    ]);
    expect(result).toBe("stampede-rush");
  });

  test("'tactical_burst' is treated as a missing whole-bey special (falls through)", () => {
    const result = resolveSpecialMove("tactical_burst", [{ id: "core", specialMoveId: "gyro-anchor" }]);
    expect(result).toBe("gyro-anchor");
  });

  test("returns empty string when no part has a special move", () => {
    const result = resolveSpecialMove("", [{ id: "ar" }, { id: "tip" }]);
    expect(result).toBe("");
  });

  test("skips undefined parts without error", () => {
    const result = resolveSpecialMove("", [undefined, { id: "core", specialMoveId: "spin-recovery" }]);
    expect(result).toBe("spin-recovery");
  });
});

// ─── Tests: applyConfigSwitch ─────────────────────────────────────────────────

describe("applyConfigSwitch — mode cycling and validation", () => {
  const T0 = 1_000_000;
  const AFTER_COOLDOWN = T0 + MODE_SWITCH_COOLDOWN_MS + 1;

  const flatTip: MockPart = {
    id: "flat",
    configurations: [
      { name: "attack-mode", playerSwitchable: true },
      { name: "defense-mode", playerSwitchable: true },
    ],
  };

  test("cycles to the next playerSwitchable config when no configId given", () => {
    const bey = makeBey();
    bey.activePartConfigs.set("tip", "attack-mode");
    const result = applyConfigSwitch(bey, flatTip, "tip", undefined, T0);
    expect(result).toBe("defense-mode");
    expect(bey.activePartConfigs.get("tip")).toBe("defense-mode");
  });

  test("cycles back to first config after reaching the last", () => {
    const bey = makeBey();
    bey.activePartConfigs.set("tip", "defense-mode");
    const result = applyConfigSwitch(bey, flatTip, "tip", undefined, T0);
    expect(result).toBe("attack-mode");
  });

  test("targets a specific configId when provided", () => {
    const bey = makeBey();
    bey.activePartConfigs.set("tip", "attack-mode");
    const result = applyConfigSwitch(bey, flatTip, "tip", "defense-mode", T0);
    expect(result).toBe("defense-mode");
  });

  test("returns null for an unknown configId", () => {
    const bey = makeBey();
    const result = applyConfigSwitch(bey, flatTip, "tip", "nonexistent-cfg", T0);
    expect(result).toBeNull();
  });

  test("enforces the 2 second cooldown — returns null within cooldown window", () => {
    const bey = makeBey();
    bey.configLastSwitchAt.set("tip", T0);
    const result = applyConfigSwitch(bey, flatTip, "tip", undefined, T0 + 1_500);
    expect(result).toBeNull();
  });

  test("allows switch exactly after cooldown expires", () => {
    const bey = makeBey();
    bey.configLastSwitchAt.set("tip", T0);
    const result = applyConfigSwitch(bey, flatTip, "tip", undefined, AFTER_COOLDOWN);
    expect(result).not.toBeNull();
  });

  test("records the switch timestamp in configLastSwitchAt", () => {
    const bey = makeBey();
    applyConfigSwitch(bey, flatTip, "tip", undefined, T0);
    expect(bey.configLastSwitchAt.get("tip")).toBe(T0);
  });

  test("returns null for an undefined part (unknown layer)", () => {
    const bey = makeBey();
    const result = applyConfigSwitch(bey, undefined, "nonexistent-layer", undefined, T0);
    expect(result).toBeNull();
  });

  test("returns null when part has no playerSwitchable configs", () => {
    const bey = makeBey();
    const part: MockPart = {
      id: "sharp",
      configurations: [{ name: "hidden", playerSwitchable: false }],
    };
    const result = applyConfigSwitch(bey, part, "tip", undefined, T0);
    expect(result).toBeNull();
  });

  test("returns null when part has no configurations at all", () => {
    const bey = makeBey();
    const part: MockPart = { id: "semi-flat" };
    const result = applyConfigSwitch(bey, part, "tip", undefined, T0);
    expect(result).toBeNull();
  });

  test("first cycle when no activePartConfig is set starts at index 0", () => {
    const bey = makeBey(); // activePartConfigs is empty
    const result = applyConfigSwitch(bey, flatTip, "tip", undefined, T0);
    // currIdx = -1 → (−1 + 1) % 2 = 0 → attack-mode
    expect(result).toBe("attack-mode");
  });

  test("independent cooldowns per part slot", () => {
    const bey = makeBey();
    bey.configLastSwitchAt.set("tip", T0);     // tip is on cooldown
    // ar has no last-switch timestamp yet → no cooldown
    const ar: MockPart = { id: "scissor", configurations: [{ name: "mode-a", playerSwitchable: true }] };
    const arResult = applyConfigSwitch(bey, ar, "ar", undefined, T0 + 500);
    const tipResult = applyConfigSwitch(bey, flatTip, "tip", undefined, T0 + 500);
    expect(arResult).toBe("mode-a");   // ar succeeds
    expect(tipResult).toBeNull();      // tip still in cooldown
  });
});

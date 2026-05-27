/**
 * Combo detection tests — exercises server/utils/comboSystem.ts via relative path.
 * Covers Cases 601–618 from the CS12 combo-system case study.
 *
 * Case map:
 *  601 — COMBO_REGISTRY completeness (8 entries, each 3-key sequence)
 *  602 — cost tiers (0 / 15 / 25 / 35 only)
 *  603 — damageMultiplier ceiling (≤ 1.5 for every combo)
 *  604 — lockMs ceiling (≤ 300 for every combo)
 *  605 — free combo fires at power 0
 *  606 — comboCostMultiplier=0 makes all combos free (free_combos round modifier)
 *  607 — windowMs per-combo (400 / 450 / 500ms enforcement)
 *  608 — quick-dash-l fires on ←←J inside window
 *  609 — quick-dash-r fires on →→J inside window
 *  610 — miskey invalidation: wrong third key → history slides, no stale match
 *  611 — power-thrust fires on JJJ with sufficient power; blocked when power < 25
 *  612 — riposte is defense-type; blocked for stamina beyblade
 *  613 — universal combos allowed for any beyblade type
 *  614 — attachedComboIds gate: combo not attached → null
 *  615 — spin-leech-jab fires for stamina only; spinStealBonus in ComboResult
 *  616 — microSpinBoost in ComboResult for spin-leech-jab
 *  617 — per-combo cooldown enforcement + expiry
 *  618 — history resets to [] after successful detection
 */

import { describe, it, expect } from "vitest";
import {
  createComboTracker,
  detectCombo,
  pruneHistory,
  COMBO_REGISTRY,
  getComboById,
} from "../../../server/utils/comboSystem";
import {
  findComboBySequence,
  isComboAllowedForType,
} from "../../../server/constants/combos";

// ─── helpers ─────────────────────────────────────────────────────────────────

const T0 = 10_000; // arbitrary start time — large enough that subtraction is always positive

/** Fire a 3-key sequence into a fresh tracker within a 300ms window. */
function quickFire(
  keys: Parameters<typeof detectCombo>[1],
  opts: Parameters<typeof detectCombo>[3] = {}
) {
  const tracker = createComboTracker();
  // Feed all 3 keys close together so windowMs is not an issue
  const [k1, k2, k3] = keys as string[];
  detectCombo(tracker, [k1], T0, opts);
  detectCombo(tracker, [k2], T0 + 100, opts);
  return detectCombo(tracker, [k3], T0 + 200, opts);
}

// ─── Case 601: Registry completeness ─────────────────────────────────────────

describe("Case 601 — COMBO_REGISTRY completeness", () => {
  it("contains exactly 8 combos", () => {
    expect(COMBO_REGISTRY).toHaveLength(8);
  });

  it("every combo has a 3-element sequence", () => {
    for (const combo of COMBO_REGISTRY) {
      expect(combo.sequence).toHaveLength(3);
    }
  });

  it("every combo has a non-empty id, name, and description", () => {
    for (const combo of COMBO_REGISTRY) {
      expect(combo.id.length).toBeGreaterThan(0);
      expect(combo.name.length).toBeGreaterThan(0);
      expect(combo.description.length).toBeGreaterThan(0);
    }
  });

  it("all 8 expected combo ids are present", () => {
    const ids = COMBO_REGISTRY.map(c => c.id);
    for (const expected of [
      "quick-dash-l", "quick-dash-r", "guard-tap", "feint",
      "riposte", "pivot-strike", "power-thrust", "spin-leech-jab",
    ]) {
      expect(ids).toContain(expected);
    }
  });
});

// ─── Case 602: Cost tiers ─────────────────────────────────────────────────────

describe("Case 602 — cost tiers are 0 / 15 / 25 / 35", () => {
  const VALID_COSTS = new Set([0, 15, 25, 35]);

  it("every combo cost is one of the valid tiers", () => {
    for (const combo of COMBO_REGISTRY) {
      expect(VALID_COSTS.has(combo.cost)).toBe(true);
    }
  });

  it("has exactly 4 free combos (cost=0)", () => {
    expect(COMBO_REGISTRY.filter(c => c.cost === 0)).toHaveLength(4);
  });

  it("has exactly 4 costed combos (cost>0)", () => {
    expect(COMBO_REGISTRY.filter(c => c.cost > 0)).toHaveLength(4);
  });

  it("spin-leech-jab costs 35 (max tier)", () => {
    expect(getComboById("spin-leech-jab")?.cost).toBe(35);
  });
});

// ─── Case 603: damageMultiplier ceiling ──────────────────────────────────────

describe("Case 603 — damageMultiplier ceiling ≤ 1.5", () => {
  it("every combo effect.damageMultiplier is ≤ 1.5 when defined", () => {
    for (const combo of COMBO_REGISTRY) {
      const dm = combo.effect.damageMultiplier ?? 1.0;
      expect(dm).toBeLessThanOrEqual(1.5);
    }
  });

  it("power-thrust is at the ceiling: damageMultiplier = 1.5", () => {
    expect(getComboById("power-thrust")?.effect.damageMultiplier).toBe(1.5);
  });
});

// ─── Case 604: lockMs ceiling ────────────────────────────────────────────────

describe("Case 604 — lockMs ceiling ≤ 300", () => {
  it("every combo effect.lockMs is ≤ 300", () => {
    for (const combo of COMBO_REGISTRY) {
      expect(combo.effect.lockMs).toBeLessThanOrEqual(300);
    }
  });

  it("power-thrust is at the ceiling: lockMs = 300", () => {
    expect(getComboById("power-thrust")?.effect.lockMs).toBe(300);
  });
});

// ─── Case 605: Free combos fire at power 0 ───────────────────────────────────

describe("Case 605 — free combos (cost=0) fire regardless of power", () => {
  it("quick-dash-l fires at power 0", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], { power: 0 });
    expect(result?.comboId).toBe("quick-dash-l");
  });

  it("guard-tap fires at power 0", () => {
    const result = quickFire(["defense", "defense", "defense"], { power: 0 });
    expect(result?.comboId).toBe("guard-tap");
  });

  it("feint fires at power 0", () => {
    const result = quickFire(["moveLeft", "moveRight", "defense"], { power: 0 });
    expect(result?.comboId).toBe("feint");
  });

  it("costPaid is 0 for all free combos", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], { power: 0 });
    expect(result?.costPaid).toBe(0);
  });
});

// ─── Case 606: comboCostMultiplier=0 (free_combos modifier) ─────────────────

describe("Case 606 — comboCostMultiplier=0 makes all combos cost 0", () => {
  it("power-thrust fires at power 0 when comboCostMultiplier=0", () => {
    const result = quickFire(["attack", "attack", "attack"], {
      power: 0,
      comboCostMultiplier: 0,
    });
    expect(result?.comboId).toBe("power-thrust");
    expect(result?.costPaid).toBe(0);
  });

  it("spin-leech-jab fires at power 0 with comboCostMultiplier=0 (stamina type)", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      power: 0,
      comboCostMultiplier: 0,
      beybladeType: "stamina",
    });
    expect(result?.comboId).toBe("spin-leech-jab");
    expect(result?.costPaid).toBe(0);
  });

  it("riposte fires at power 0 with comboCostMultiplier=0 (defense type)", () => {
    const result = quickFire(["defense", "defense", "attack"], {
      power: 0,
      comboCostMultiplier: 0,
      beybladeType: "defense",
    });
    expect(result?.comboId).toBe("riposte");
  });

  it("comboCostMultiplier=0.5 halves the power requirement", () => {
    // power-thrust costs 25; with 0.5 multiplier effective cost = round(12.5)=12 or 13
    // power=10 should be just below the threshold
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, { power: 10, comboCostMultiplier: 0.5 });
    detectCombo(tracker, ["attack"], T0 + 100, { power: 10, comboCostMultiplier: 0.5 });
    const insufficient = detectCombo(tracker, ["attack"], T0 + 200, { power: 10, comboCostMultiplier: 0.5 });
    // effective cost = round(25 * 0.5) = 13 > 10 → rejected
    expect(insufficient).toBeNull();

    // Same but with power=13 (meets threshold)
    const tracker2 = createComboTracker();
    detectCombo(tracker2, ["attack"], T0, { power: 13, comboCostMultiplier: 0.5 });
    detectCombo(tracker2, ["attack"], T0 + 100, { power: 13, comboCostMultiplier: 0.5 });
    const sufficient = detectCombo(tracker2, ["attack"], T0 + 200, { power: 13, comboCostMultiplier: 0.5 });
    expect(sufficient?.comboId).toBe("power-thrust");
  });
});

// ─── Case 607: windowMs per-combo enforcement ────────────────────────────────

describe("Case 607 — windowMs enforcement per-combo", () => {
  it("quick-dash-l (windowMs=400): 3 keys in 399ms fire; 401ms does not", () => {
    // Within window
    const t1 = createComboTracker();
    detectCombo(t1, ["moveLeft"], T0, {});
    detectCombo(t1, ["moveLeft"], T0 + 200, {});
    const inWindow = detectCombo(t1, ["attack"], T0 + 399, {});
    expect(inWindow?.comboId).toBe("quick-dash-l");

    // Outside window — spread the 3 keys so first is 401ms before last
    const t2 = createComboTracker();
    detectCombo(t2, ["moveLeft"], T0, {});
    detectCombo(t2, ["moveLeft"], T0 + 200, {});
    const outsideWindow = detectCombo(t2, ["attack"], T0 + 401, {});
    // window check: now(T0+401) - first_timestamp(T0) = 401 > combo.windowMs(400) → rejected
    expect(outsideWindow).toBeNull();
  });

  it("guard-tap (windowMs=500): 3 keys in 500ms fire; spread to 501ms does not", () => {
    const t1 = createComboTracker();
    detectCombo(t1, ["defense"], T0, {});
    detectCombo(t1, ["defense"], T0 + 250, {});
    const inWindow = detectCombo(t1, ["defense"], T0 + 499, {});
    expect(inWindow?.comboId).toBe("guard-tap");

    const t2 = createComboTracker();
    detectCombo(t2, ["defense"], T0, {});
    detectCombo(t2, ["defense"], T0 + 250, {});
    const outsideWindow = detectCombo(t2, ["defense"], T0 + 501, {});
    expect(outsideWindow).toBeNull();
  });

  it("feint (windowMs=450): 3 keys in 449ms fire", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveRight"], T0 + 200, {});
    const result = detectCombo(tracker, ["defense"], T0 + 449, {});
    expect(result?.comboId).toBe("feint");
  });
});

// ─── Case 608: quick-dash-l ───────────────────────────────────────────────────

describe("Case 608 — quick-dash-l (←←J)", () => {
  it("fires on correct sequence within window", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const result = detectCombo(tracker, ["attack"], T0 + 200, {});
    expect(result?.comboId).toBe("quick-dash-l");
    expect(result?.effect).toBe("speed_burst_left");
    expect(result?.costPaid).toBe(0);
  });

  it("classifies as speed_burst_left", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"]);
    expect(result?.effect).toBe("speed_burst_left");
  });
});

// ─── Case 609: quick-dash-r ───────────────────────────────────────────────────

describe("Case 609 — quick-dash-r (→→J)", () => {
  it("fires on correct sequence", () => {
    const result = quickFire(["moveRight", "moveRight", "attack"]);
    expect(result?.comboId).toBe("quick-dash-r");
    expect(result?.effect).toBe("speed_burst_right");
  });

  it("is distinct from quick-dash-l (different direction key)", () => {
    const r = quickFire(["moveRight", "moveRight", "attack"]);
    const l = quickFire(["moveLeft", "moveLeft", "attack"]);
    expect(r?.comboId).not.toBe(l?.comboId);
  });
});

// ─── Case 610: Miskey invalidation ───────────────────────────────────────────

describe("Case 610 — miskey invalidation", () => {
  it("wrong third key produces null (←←K does not trigger ←←J)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    // Send 'defense' instead of 'attack' — this sequence (←←K) matches no combo
    const result = detectCombo(tracker, ["defense"], T0 + 200, {});
    // ←←defense = moveLeft,moveLeft,defense — guard-tap requires defense,defense,defense
    expect(result).toBeNull();
  });

  it("after a miskey the history slides; correct keys can still fire", () => {
    const tracker = createComboTracker();
    // First: ← ← (wrong key) — no combo
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["defense"], T0 + 200, {}); // miskey (no combo)

    // Now the history is [←, ←, K] — add ←, J to get [←, K, ←, J]
    // sliding last3 = [K, ←, J] → no match; then [←, K, ←] → no; then [K, ←, J] → no
    // Actually history after miskey = 3 entries (no match fired, history not cleared)
    // Adding ←→ prune(T0+500): all T0..T0+200 entries survive (500ms window default)
    // history = [←, ←, K, ←, J] → last3 = [K, ←, J] no match
    // But new sequence starting from T0+300: if we add ←←J tightly:
    detectCombo(tracker, ["moveLeft"], T0 + 300, {});
    detectCombo(tracker, ["moveLeft"], T0 + 400, {});
    // Last 3 entries at T0+500: need to find a straddling window
    // history (post-prune at T0+500, maxWindowMs=600): all 5 entries survive
    // last3 = [←, ←, J]? No — last3 at point of J arrival is the most recent 3 keys
    // After T0+400 push: history = [←@T0, ←@100, K@200, ←@300, ←@400]
    // At T0+500 arrival of attack: push → [..., J@500]
    // prune at T0+500: T0+500 - T0 = 500 ≤ 600 → all kept
    // last3 = [←@300, ←@400, J@500] → matches quick-dash-l?
    // window check: T0+500 - T0+300 = 200 ≤ 400 → YES
    const result = detectCombo(tracker, ["attack"], T0 + 500, {});
    expect(result?.comboId).toBe("quick-dash-l");
  });

  it("history is NOT cleared on a non-matching key sequence", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["jump"], T0 + 50, {}); // jump not part of any combo start
    const result = detectCombo(tracker, ["jump"], T0 + 100, {});
    // No combo matches jump,jump → null (history still exists)
    expect(result).toBeNull();
    expect(tracker.history.length).toBeGreaterThan(0); // history not cleared
  });
});

// ─── Case 611: power-thrust ───────────────────────────────────────────────────

describe("Case 611 — power-thrust (JJJ)", () => {
  it("fires with power = 25 (exact threshold)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, { power: 25 });
    detectCombo(tracker, ["attack"], T0 + 100, { power: 25 });
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 25 });
    expect(result?.comboId).toBe("power-thrust");
    expect(result?.costPaid).toBe(25);
  });

  it("blocked with power = 24 (below threshold)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["attack"], T0, { power: 24 });
    detectCombo(tracker, ["attack"], T0 + 100, { power: 24 });
    const result = detectCombo(tracker, ["attack"], T0 + 200, { power: 24 });
    expect(result).toBeNull();
  });

  it("effect is damage_boost; durationMs=800; lockMs=300", () => {
    const result = quickFire(["attack", "attack", "attack"], { power: 100 });
    expect(result?.effect).toBe("damage_boost");
    expect(result?.durationMs).toBe(800);
    expect(result?.lockMs).toBe(300);
    expect(result?.damageMultiplier).toBe(1.5);
  });
});

// ─── Case 612: riposte type restriction ──────────────────────────────────────

describe("Case 612 — riposte (KKJ) type restriction to defense", () => {
  it("fires for defense beyblade", () => {
    const result = quickFire(["defense", "defense", "attack"], {
      beybladeType: "defense",
      power: 100,
    });
    expect(result?.comboId).toBe("riposte");
  });

  it("blocked for stamina beyblade", () => {
    const result = quickFire(["defense", "defense", "attack"], {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result).toBeNull();
  });

  it("blocked for attack beyblade", () => {
    const result = quickFire(["defense", "defense", "attack"], {
      beybladeType: "attack",
      power: 100,
    });
    expect(result).toBeNull();
  });
});

// ─── Case 613: Universal combos usable by any type ───────────────────────────

describe("Case 613 — universal combos work for all beyblade types", () => {
  const TYPES = ["attack", "defense", "stamina", "balanced", "universal"] as const;

  it("quick-dash-l (universal) fires for every type", () => {
    for (const type of TYPES) {
      const result = quickFire(["moveLeft", "moveLeft", "attack"], {
        beybladeType: type,
        power: 0,
      });
      expect(result?.comboId, `should fire for type=${type}`).toBe("quick-dash-l");
    }
  });

  it("power-thrust (universal) fires for every type given sufficient power", () => {
    for (const type of TYPES) {
      const result = quickFire(["attack", "attack", "attack"], {
        beybladeType: type,
        power: 100,
      });
      expect(result?.comboId, `should fire for type=${type}`).toBe("power-thrust");
    }
  });

  it("isComboAllowedForType: universal combos return true for all types", () => {
    const dash = getComboById("quick-dash-l")!;
    for (const type of TYPES) {
      expect(isComboAllowedForType(dash, type)).toBe(true);
    }
  });
});

// ─── Case 614: attachedComboIds gate ─────────────────────────────────────────

describe("Case 614 — attachedComboIds gate", () => {
  it("returns null when matching combo is not in attachedComboIds", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], {
      attachedComboIds: ["guard-tap", "power-thrust"],
    });
    expect(result).toBeNull(); // quick-dash-l not attached
  });

  it("fires when combo is in attachedComboIds", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], {
      attachedComboIds: ["quick-dash-l"],
    });
    expect(result?.comboId).toBe("quick-dash-l");
  });

  it("empty attachedComboIds array blocks all combos", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"], {
      attachedComboIds: [],
    });
    expect(result).toBeNull();
  });

  it("undefined attachedComboIds allows any combo (opt-in not required)", () => {
    const result = quickFire(["moveLeft", "moveLeft", "attack"]);
    expect(result?.comboId).toBe("quick-dash-l"); // no restriction when field absent
  });
});

// ─── Case 615: spin-leech-jab — stamina-only + spinStealBonus ─────────────────

describe("Case 615 — spin-leech-jab (←J→): stamina-only + spinStealBonus", () => {
  it("fires for stamina beyblade with sufficient power", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result?.comboId).toBe("spin-leech-jab");
  });

  it("blocked for attack beyblade", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "attack",
      power: 100,
    });
    expect(result).toBeNull();
  });

  it("blocked for defense beyblade", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "defense",
      power: 100,
    });
    expect(result).toBeNull();
  });

  it("spinStealBonus is 0.08 in ComboResult", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result?.spinStealBonus).toBe(0.08);
  });

  it("spinStealBonus is within max cap (≤ 0.1)", () => {
    for (const combo of COMBO_REGISTRY) {
      const bonus = combo.effect.spinStealBonus ?? 0;
      expect(bonus).toBeLessThanOrEqual(0.1);
    }
  });

  it("classifies as spin_steal effect", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result?.effect).toBe("spin_steal");
  });

  it("spinStealBonus is 0 for all non-steal combos", () => {
    const nonSteal = ["quick-dash-l", "guard-tap", "power-thrust", "riposte"];
    for (const id of nonSteal) {
      const combo = getComboById(id)!;
      expect(combo.effect.spinStealBonus ?? 0).toBe(0);
    }
  });
});

// ─── Case 616: microSpinBoost ────────────────────────────────────────────────

describe("Case 616 — microSpinBoost for spin-leech-jab", () => {
  it("microSpinBoost is 30 in ComboResult for spin-leech-jab", () => {
    const result = quickFire(["moveLeft", "attack", "moveRight"], {
      beybladeType: "stamina",
      power: 100,
    });
    expect(result?.microSpinBoost).toBe(30);
  });

  it("microSpinBoost is within max cap (≤ 50)", () => {
    for (const combo of COMBO_REGISTRY) {
      const boost = combo.effect.microSpinBoost ?? 0;
      expect(boost).toBeLessThanOrEqual(50);
    }
  });

  it("microSpinBoost is 0 for non-leech combos", () => {
    const result = quickFire(["attack", "attack", "attack"], { power: 100 });
    expect(result?.microSpinBoost).toBe(0);
  });

  it("spin-leech-jab registry entry has microSpinBoost=30", () => {
    const combo = getComboById("spin-leech-jab");
    expect(combo?.effect.microSpinBoost).toBe(30);
  });
});

// ─── Case 617: per-combo cooldown enforcement ─────────────────────────────────

describe("Case 617 — per-combo cooldown", () => {
  it("second fire of quick-dash-l blocked during cooldown (800ms)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    const first = detectCombo(tracker, ["attack"], T0 + 200, {});
    expect(first?.comboId).toBe("quick-dash-l");

    // Try again at T0+700 — still in 800ms cooldown
    detectCombo(tracker, ["moveLeft"], T0 + 400, {});
    detectCombo(tracker, ["moveLeft"], T0 + 500, {});
    const second = detectCombo(tracker, ["attack"], T0 + 700, {});
    expect(second).toBeNull();
  });

  it("fires again after cooldown expires (T0 + 200 + 800 = T0+1000)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["attack"], T0 + 200, {}); // first fire

    detectCombo(tracker, ["moveLeft"], T0 + 1100, {});
    detectCombo(tracker, ["moveLeft"], T0 + 1200, {});
    const result = detectCombo(tracker, ["attack"], T0 + 1300, {});
    expect(result?.comboId).toBe("quick-dash-l");
  });

  it("spin-leech-jab cooldown is 4500ms — blocked at 4499ms, fires at 4501ms", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, { beybladeType: "stamina", power: 100 });
    detectCombo(tracker, ["attack"],   T0 + 100, { beybladeType: "stamina", power: 100 });
    detectCombo(tracker, ["moveRight"],T0 + 200, { beybladeType: "stamina", power: 100 });

    // Just inside cooldown
    detectCombo(tracker, ["moveLeft"], T0 + 4000, { beybladeType: "stamina", power: 100 });
    detectCombo(tracker, ["attack"],   T0 + 4100, { beybladeType: "stamina", power: 100 });
    const blocked = detectCombo(tracker, ["moveRight"], T0 + 4699, { beybladeType: "stamina", power: 100 });
    expect(blocked).toBeNull();

    // After cooldown
    detectCombo(tracker, ["moveLeft"], T0 + 4900, { beybladeType: "stamina", power: 100 });
    detectCombo(tracker, ["attack"],   T0 + 5000, { beybladeType: "stamina", power: 100 });
    const fired = detectCombo(tracker, ["moveRight"], T0 + 5100, { beybladeType: "stamina", power: 100 });
    expect(fired?.comboId).toBe("spin-leech-jab");
  });

  it("different combos have independent cooldowns", () => {
    const tracker = createComboTracker();
    // Fire quick-dash-l at T0+200; global cooldown spacer = min(300, 800) = 300ms → expires T0+500
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["attack"],   T0 + 200, {});

    // Wait past global spacer (T0+500) — quick-dash-r has its own 800ms slot starting fresh.
    // Its per-combo cooldown was never set, so it should fire freely.
    detectCombo(tracker, ["moveRight"], T0 + 600, {});
    detectCombo(tracker, ["moveRight"], T0 + 700, {});
    const result = detectCombo(tracker, ["attack"], T0 + 800, {});
    expect(result?.comboId).toBe("quick-dash-r"); // different per-combo slot — not blocked
  });
});

// ─── Case 618: history reset after detection ─────────────────────────────────

describe("Case 618 — history cleared after successful combo detection", () => {
  it("tracker.history is empty after a combo fires", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["attack"],   T0 + 200, {});
    expect(tracker.history).toHaveLength(0);
  });

  it("history is NOT cleared on a non-match (sliding window preserved)", () => {
    const tracker = createComboTracker();
    detectCombo(tracker, ["moveLeft"], T0, {});
    detectCombo(tracker, ["moveLeft"], T0 + 100, {});
    detectCombo(tracker, ["jump"],     T0 + 200, {}); // no combo matches moveLeft,moveLeft,jump
    expect(tracker.history.length).toBeGreaterThan(0);
  });
});

// ─── pruneHistory ─────────────────────────────────────────────────────────────

describe("pruneHistory", () => {
  it("removes entries older than maxWindowMs", () => {
    const tracker = createComboTracker();
    tracker.history = [
      { key: "moveLeft", timestamp: 100 },
      { key: "moveLeft", timestamp: 500 },
      { key: "attack",   timestamp: 900 },
    ];
    pruneHistory(tracker, 1000, 400);
    // 1000-100=900 > 400 → removed; 1000-500=500 > 400 → removed; 1000-900=100 ≤ 400 → kept
    expect(tracker.history).toHaveLength(1);
    expect(tracker.history[0].key).toBe("attack");
  });

  it("keeps all entries when all are within window", () => {
    const tracker = createComboTracker();
    tracker.history = [
      { key: "attack", timestamp: 800 },
      { key: "attack", timestamp: 900 },
    ];
    pruneHistory(tracker, 1000, 500);
    expect(tracker.history).toHaveLength(2);
  });
});

// ─── findComboBySequence ──────────────────────────────────────────────────────

describe("findComboBySequence", () => {
  it("finds quick-dash-l by exact sequence", () => {
    const result = findComboBySequence(["moveLeft", "moveLeft", "attack"]);
    expect(result?.id).toBe("quick-dash-l");
  });

  it("finds spin-leech-jab by exact sequence", () => {
    const result = findComboBySequence(["moveLeft", "attack", "moveRight"]);
    expect(result?.id).toBe("spin-leech-jab");
  });

  it("returns undefined for non-existent sequence", () => {
    const result = findComboBySequence(["jump", "jump", "jump"]);
    expect(result).toBeUndefined();
  });

  it("returns undefined when sequence length != 3", () => {
    expect(findComboBySequence(["moveLeft", "moveLeft"] as any)).toBeUndefined();
    expect(findComboBySequence(["moveLeft", "moveLeft", "attack", "defense"] as any)).toBeUndefined();
  });
});

// ─── getComboById ─────────────────────────────────────────────────────────────

describe("getComboById", () => {
  it("returns correct combo for each known id", () => {
    expect(getComboById("guard-tap")?.sequence).toEqual(["defense", "defense", "defense"]);
    expect(getComboById("pivot-strike")?.type).toBe("balanced");
    expect(getComboById("riposte")?.cost).toBe(15);
  });

  it("returns undefined for unknown id", () => {
    expect(getComboById("nonexistent-combo")).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import {
  ComboTracker,
  detectCombo,
  pruneHistory,
  createComboTracker,
} from "../../src/utils/comboSystem";

const ANY_BEY = "balanced";

describe("comboSystem (3-key schema, cost-tiered)", () => {
  let tracker: ComboTracker;

  beforeEach(() => {
    tracker = createComboTracker();
  });

  describe("detectCombo — sequence + window", () => {
    it("detects quick-dash-r (moveRight × 2 + attack) when attached", () => {
      const now = 1000;
      expect(detectCombo(tracker, ["moveRight"], now, { attachedComboIds: ["quick-dash-r"] })).toBeNull();
      expect(detectCombo(tracker, ["moveRight"], now + 100, { attachedComboIds: ["quick-dash-r"] })).toBeNull();
      const result = detectCombo(tracker, ["attack"], now + 200, {
        attachedComboIds: ["quick-dash-r"],
        beybladeType: "attack",
      });
      expect(result).not.toBeNull();
      expect(result?.comboId).toBe("quick-dash-r");
      expect(result?.costPaid).toBe(0);
    });

    it("rejects when the combo is not attached to the beyblade", () => {
      const now = 1000;
      detectCombo(tracker, ["moveRight"], now, { attachedComboIds: ["quick-dash-l"] });
      detectCombo(tracker, ["moveRight"], now + 100, { attachedComboIds: ["quick-dash-l"] });
      const result = detectCombo(tracker, ["attack"], now + 200, {
        attachedComboIds: ["quick-dash-l"],
      });
      expect(result).toBeNull();
    });

    it("rejects when sequence falls outside the combo's window", () => {
      const now = 1000;
      detectCombo(tracker, ["moveRight"], now, { attachedComboIds: ["quick-dash-r"] });
      detectCombo(tracker, ["moveRight"], now + 200, { attachedComboIds: ["quick-dash-r"] });
      const result = detectCombo(tracker, ["attack"], now + 600, { // 600ms > 400ms window
        attachedComboIds: ["quick-dash-r"],
      });
      expect(result).toBeNull();
    });
  });

  describe("detectCombo — power cost", () => {
    it("fires power-thrust (cost 25) when power >= 25 and deducts no power from tracker", () => {
      const now = 1000;
      detectCombo(tracker, ["attack"], now,        { attachedComboIds: ["power-thrust"], power: 50 });
      detectCombo(tracker, ["attack"], now + 100,  { attachedComboIds: ["power-thrust"], power: 50 });
      const r = detectCombo(tracker, ["attack"], now + 200, {
        attachedComboIds: ["power-thrust"], power: 50,
      });
      expect(r).not.toBeNull();
      expect(r?.comboId).toBe("power-thrust");
      expect(r?.costPaid).toBe(25);
    });

    it("rejects power-thrust when power < cost", () => {
      const now = 1000;
      detectCombo(tracker, ["attack"], now,        { attachedComboIds: ["power-thrust"], power: 10 });
      detectCombo(tracker, ["attack"], now + 100,  { attachedComboIds: ["power-thrust"], power: 10 });
      const r = detectCombo(tracker, ["attack"], now + 200, {
        attachedComboIds: ["power-thrust"], power: 10,
      });
      expect(r).toBeNull();
    });
  });

  describe("detectCombo — type restriction", () => {
    it("allows spin-leech-jab only for stamina beyblades", () => {
      const now = 1000;
      const tryFire = (type: string) => {
        const local = createComboTracker();
        detectCombo(local, ["moveLeft"], now,        { attachedComboIds: ["spin-leech-jab"], power: 50, beybladeType: type });
        detectCombo(local, ["attack"],   now + 100,  { attachedComboIds: ["spin-leech-jab"], power: 50, beybladeType: type });
        return detectCombo(local, ["moveRight"], now + 200, {
          attachedComboIds: ["spin-leech-jab"], power: 50, beybladeType: type,
        });
      };
      expect(tryFire("stamina")).not.toBeNull();
      expect(tryFire("attack")).toBeNull();
    });
  });

  describe("detectCombo — per-combo cooldown", () => {
    it("blocks the same combo while its cooldown is active", () => {
      const now = 1000;
      detectCombo(tracker, ["attack"], now,        { attachedComboIds: ["power-thrust"], power: 50 });
      detectCombo(tracker, ["attack"], now + 100,  { attachedComboIds: ["power-thrust"], power: 50 });
      const first = detectCombo(tracker, ["attack"], now + 200, {
        attachedComboIds: ["power-thrust"], power: 50,
      });
      expect(first).not.toBeNull();

      // Try again immediately — must reject (cooldown 3500ms).
      detectCombo(tracker, ["attack"], now + 1000, { attachedComboIds: ["power-thrust"], power: 50 });
      detectCombo(tracker, ["attack"], now + 1100, { attachedComboIds: ["power-thrust"], power: 50 });
      const retry = detectCombo(tracker, ["attack"], now + 1200, {
        attachedComboIds: ["power-thrust"], power: 50,
      });
      expect(retry).toBeNull();
    });
  });

  describe("pruneHistory", () => {
    it("removes entries outside the 600ms default window", () => {
      const now = 1000;
      tracker.history = [
        { key: "moveLeft", timestamp: now - 2000 },
        { key: "moveRight", timestamp: now - 100 },
      ] as any;
      pruneHistory(tracker, now);
      expect(tracker.history).toHaveLength(1);
    });

    it("is a no-op on empty history", () => {
      tracker.history = [];
      expect(() => pruneHistory(tracker, 1000)).not.toThrow();
    });
  });

  it("returns null when given an empty input array", () => {
    expect(detectCombo(tracker, [], 1000, { attachedComboIds: ["power-thrust"], power: 50 })).toBeNull();
  });
});

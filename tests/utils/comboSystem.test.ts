import { describe, it, expect, beforeEach } from "vitest";
import { ComboTracker, detectCombo, pruneHistory } from "../../src/utils/comboSystem";

describe("comboSystem", () => {
  let tracker: ComboTracker;

  beforeEach(() => {
    tracker = { history: [] };
  });

  describe("detectCombo", () => {
    it("should detect storm_assault (moveLeft → moveRight → attack within 500ms)", () => {
      const now = 1000;
      const combo1 = detectCombo(tracker, ["moveLeft"], now);
      expect(combo1).toBeNull();
      expect(tracker.history).toHaveLength(1);

      const combo2 = detectCombo(tracker, ["moveRight"], now + 200);
      expect(combo2).toBeNull();
      expect(tracker.history).toHaveLength(2);

      const combo3 = detectCombo(tracker, ["attack"], now + 400);
      expect(combo3).not.toBeNull();
      expect(combo3?.name).toBe("storm_assault");
    });

    it("should not detect storm_assault if window exceeds 500ms", () => {
      const now = 1000;
      detectCombo(tracker, ["moveLeft"], now);
      detectCombo(tracker, ["moveRight"], now + 200);
      const combo = detectCombo(tracker, ["attack"], now + 600); // 600ms > 500ms window
      expect(combo).toBeNull();
    });

    it("should detect gyro_counter (defense → defense → dodge within 600ms)", () => {
      const now = 1000;
      detectCombo(tracker, ["defense"], now);
      detectCombo(tracker, ["defense"], now + 200);
      const combo = detectCombo(tracker, ["dodge"], now + 400);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("gyro_counter");
    });

    it("should detect aerial_smash (jump → attack within 300ms)", () => {
      const now = 1000;
      detectCombo(tracker, ["jump"], now);
      const combo = detectCombo(tracker, ["attack"], now + 250);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("aerial_smash");
    });

    it("should detect spinning_slash (dodge → attack within 300ms)", () => {
      const now = 1000;
      detectCombo(tracker, ["dodge"], now);
      const combo = detectCombo(tracker, ["attack"], now + 200);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("spinning_slash");
    });

    it("should detect counter_strike (defense + attack on same frame)", () => {
      const now = 1000;
      const combo = detectCombo(tracker, ["defense", "attack"], now);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("counter_strike");
    });

    it("should detect dash_left (moveLeft → moveLeft within 200ms)", () => {
      const now = 1000;
      detectCombo(tracker, ["moveLeft"], now);
      const combo = detectCombo(tracker, ["moveLeft"], now + 150);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("dash_left");
    });

    it("should detect dash_right (moveRight → moveRight within 200ms)", () => {
      const now = 1000;
      detectCombo(tracker, ["moveRight"], now);
      const combo = detectCombo(tracker, ["moveRight"], now + 150);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("dash_right");
    });

    it("should handle empty input gracefully", () => {
      const now = 1000;
      const combo = detectCombo(tracker, [], now);
      expect(combo).toBeNull();
      expect(tracker.history).toHaveLength(0);
    });

    it("should return ComboResult object with damage multiplier", () => {
      const now = 1000;
      detectCombo(tracker, ["jump"], now);
      const combo = detectCombo(tracker, ["attack"], now + 250);
      expect(combo).not.toBeNull();
      expect(combo?.name).toBe("aerial_smash");
      expect(combo?.damageMultiplier).toBe(2.0);
      expect(combo?.durationMs).toBe(0);
      expect(combo?.effect).toBe("damage_boost");
    });
  });

  describe("pruneHistory", () => {
    it("should remove old entries outside time window", () => {
      const now = 1000;
      tracker.history = [
        { key: "moveLeft", timestamp: now - 2000 },
        { key: "moveRight", timestamp: now - 100 },
      ];

      pruneHistory(tracker, now);
      expect(tracker.history).toHaveLength(1);
      expect(tracker.history[0].timestamp).toBe(now - 100);
    });

    it("should preserve recent history", () => {
      const now = 1000;
      tracker.history = [
        { key: "moveLeft", timestamp: now - 100 },
        { key: "moveRight", timestamp: now - 50 },
      ];

      pruneHistory(tracker, now);
      expect(tracker.history).toHaveLength(2);
    });

    it("should handle empty history gracefully", () => {
      tracker.history = [];
      expect(() => pruneHistory(tracker, 1000)).not.toThrow();
      expect(tracker.history).toHaveLength(0);
    });
  });
});

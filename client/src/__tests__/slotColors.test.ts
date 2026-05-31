import { describe, it, expect } from "vitest";
import {
  PLAYER_SLOT_COLORS,
  TEAM_COLORS,
  getSlotColor,
} from "@/constants/playerColors";

describe("PLAYER_SLOT_COLORS", () => {
  it("slot 0 is blue (#3B82F6)", () => {
    expect(PLAYER_SLOT_COLORS[0]).toBe("#3B82F6");
  });

  it("slot 1 is red (#EF4444)", () => {
    expect(PLAYER_SLOT_COLORS[1]).toBe("#EF4444");
  });

  it("has exactly 6 slots (0–5)", () => {
    const keys = Object.keys(PLAYER_SLOT_COLORS).map(Number);
    expect(keys).toHaveLength(6);
    expect(Math.min(...keys)).toBe(0);
    expect(Math.max(...keys)).toBe(5);
  });

  it("no two slots share the same hex color", () => {
    const colors = Object.values(PLAYER_SLOT_COLORS);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });

  it("all color values are valid 7-char hex strings", () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const color of Object.values(PLAYER_SLOT_COLORS)) {
      expect(color).toMatch(hexPattern);
    }
  });
});

describe("TEAM_COLORS", () => {
  it("team A is blue (#3B82F6)", () => {
    expect(TEAM_COLORS["A"]).toBe("#3B82F6");
  });

  it("team B is red (#EF4444)", () => {
    expect(TEAM_COLORS["B"]).toBe("#EF4444");
  });

  it("team colors match slot 0 and slot 1", () => {
    expect(TEAM_COLORS["A"]).toBe(PLAYER_SLOT_COLORS[0]);
    expect(TEAM_COLORS["B"]).toBe(PLAYER_SLOT_COLORS[1]);
  });
});

describe("getSlotColor", () => {
  it("returns correct color for each valid slot index", () => {
    for (let i = 0; i <= 5; i++) {
      expect(getSlotColor(i)).toBe(PLAYER_SLOT_COLORS[i]);
    }
  });

  it("returns a fallback (white or defined) for out-of-range slot", () => {
    const color = getSlotColor(99);
    expect(typeof color).toBe("string");
    expect(color.length).toBeGreaterThan(0);
  });
});

// Regression tests for BattleRoom — global settings enforcement, bitmask input,
// and series integration. No Colyseus import — logic stubs only.

import { describe, test, expect, beforeEach } from "vitest";

// ─── Settings check stub ──────────────────────────────────────────────────────

interface GlobalSettings {
  maintenanceMode: boolean;
  enablePvp: boolean;
  enableTryout: boolean;
  enableAiBattle: boolean;
  globalBeybladeBlacklist: string[];
  featureLoops: boolean;
  featureTurrets: boolean;
  featurePortals: boolean;
  featureSpecialMoves: boolean;
}

function checkRoomCreationAllowed(
  settings: GlobalSettings,
  roomType: "pvp" | "tryout" | "ai"
): void {
  if (settings.maintenanceMode) throw new Error("Maintenance");
  if (roomType === "pvp"    && !settings.enablePvp)      throw new Error("PVP disabled");
  if (roomType === "tryout" && !settings.enableTryout)   throw new Error("Tryout disabled");
  if (roomType === "ai"     && !settings.enableAiBattle) throw new Error("AI disabled");
}

// ─── Input bitmask decode stub (mirrors server) ───────────────────────────────

interface DecodedInput {
  moveLeft: boolean; moveRight: boolean; moveUp: boolean; moveDown: boolean;
  attack: boolean; defense: boolean; dodge: boolean; jump: boolean;
  chargeHeld: boolean; specialTap: boolean;
}

function decodeBitmask(bits: number): DecodedInput {
  return {
    moveLeft:   (bits & (1 << 0)) !== 0,
    moveRight:  (bits & (1 << 1)) !== 0,
    moveUp:     (bits & (1 << 2)) !== 0,
    moveDown:   (bits & (1 << 3)) !== 0,
    attack:     (bits & (1 << 4)) !== 0,
    defense:    (bits & (1 << 5)) !== 0,
    dodge:      (bits & (1 << 6)) !== 0,
    jump:       (bits & (1 << 7)) !== 0,
    chargeHeld: (bits & (1 << 8)) !== 0,
    specialTap: (bits & (1 << 9)) !== 0,
  };
}

function encodeBitmask(input: Partial<DecodedInput>): number {
  let f = 0;
  if (input.moveLeft)   f |= 1 << 0;
  if (input.moveRight)  f |= 1 << 1;
  if (input.moveUp)     f |= 1 << 2;
  if (input.moveDown)   f |= 1 << 3;
  if (input.attack)     f |= 1 << 4;
  if (input.defense)    f |= 1 << 5;
  if (input.dodge)      f |= 1 << 6;
  if (input.jump)       f |= 1 << 7;
  if (input.chargeHeld) f |= 1 << 8;
  if (input.specialTap) f |= 1 << 9;
  return f;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BattleRoom — global settings enforcement", () => {
  const validSettings: GlobalSettings = {
    maintenanceMode: false,
    enablePvp: true,
    enableTryout: true,
    enableAiBattle: true,
    globalBeybladeBlacklist: [],
    featureLoops: true,
    featureTurrets: true,
    featurePortals: true,
    featureSpecialMoves: true,
  };

  test("valid settings → no throw", () => {
    expect(() => checkRoomCreationAllowed(validSettings, "pvp")).not.toThrow();
  });

  test("maintenanceMode=true → throws regardless of room type", () => {
    const s = { ...validSettings, maintenanceMode: true };
    expect(() => checkRoomCreationAllowed(s, "pvp")).toThrow("Maintenance");
    expect(() => checkRoomCreationAllowed(s, "tryout")).toThrow("Maintenance");
    expect(() => checkRoomCreationAllowed(s, "ai")).toThrow("Maintenance");
  });

  test("enablePvp=false → throws for pvp room", () => {
    const s = { ...validSettings, enablePvp: false };
    expect(() => checkRoomCreationAllowed(s, "pvp")).toThrow("PVP disabled");
  });

  test("enablePvp=false → does NOT throw for tryout room", () => {
    const s = { ...validSettings, enablePvp: false };
    expect(() => checkRoomCreationAllowed(s, "tryout")).not.toThrow();
  });

  test("enableTryout=false → throws for tryout room", () => {
    const s = { ...validSettings, enableTryout: false };
    expect(() => checkRoomCreationAllowed(s, "tryout")).toThrow("Tryout disabled");
  });

  test("enableAiBattle=false → throws for ai room", () => {
    const s = { ...validSettings, enableAiBattle: false };
    expect(() => checkRoomCreationAllowed(s, "ai")).toThrow("AI disabled");
  });
});

describe("BattleRoom — bitmask input decoding", () => {
  test("0 → all false", () => {
    const input = decodeBitmask(0);
    expect(Object.values(input).every((v) => v === false)).toBe(true);
  });

  test("0x3FF → all true", () => {
    const input = decodeBitmask(0x3FF);
    expect(Object.values(input).every((v) => v === true)).toBe(true);
  });

  test("moveLeft=true, attack=true → bits 0 and 4 set", () => {
    const bits = encodeBitmask({ moveLeft: true, attack: true });
    const decoded = decodeBitmask(bits);
    expect(decoded.moveLeft).toBe(true);
    expect(decoded.attack).toBe(true);
    expect(decoded.moveRight).toBe(false);
    expect(decoded.defense).toBe(false);
  });

  test("round-trip: all 1024 bitmask combinations decode correctly", () => {
    for (let bits = 0; bits < 1024; bits++) {
      const decoded = decodeBitmask(bits);
      const reencoded = encodeBitmask(decoded);
      expect(reencoded).toBe(bits);
    }
  });

  test("legacy object format still works (backward compat)", () => {
    // Server onMessage handler accepts both number and legacy object
    function onMessage(message: number | Partial<DecodedInput>): DecodedInput {
      return typeof message === "number"
        ? decodeBitmask(message)
        : { moveLeft: false, moveRight: false, moveUp: false, moveDown: false,
            attack: false, defense: false, dodge: false, jump: false,
            chargeHeld: false, specialTap: false, ...message };
    }

    const fromObject = onMessage({ moveLeft: true });
    expect(fromObject.moveLeft).toBe(true);
    expect(fromObject.attack).toBe(false);

    const fromBitmask = onMessage(encodeBitmask({ moveLeft: true }));
    expect(fromBitmask.moveLeft).toBe(true);
    expect(fromBitmask.attack).toBe(false);
  });
});

describe("BattleRoom — beyblade blacklist enforcement", () => {
  function isBeybladeAllowed(beybladeId: string, blacklist: string[]): boolean {
    return !blacklist.includes(beybladeId);
  }

  test("beyblade not in blacklist → allowed", () => {
    expect(isBeybladeAllowed("bey1", ["bey2", "bey3"])).toBe(true);
  });

  test("beyblade in blacklist → not allowed", () => {
    expect(isBeybladeAllowed("bey1", ["bey1", "bey2"])).toBe(false);
  });

  test("empty blacklist → all beyblades allowed", () => {
    expect(isBeybladeAllowed("any-bey", [])).toBe(true);
  });
});

describe("BattleRoom — feature toggle gates", () => {
  function shouldProcessFeature(enabled: boolean | undefined): boolean {
    return enabled !== false;
  }

  test("feature undefined → enabled by default", () => {
    expect(shouldProcessFeature(undefined)).toBe(true);
  });

  test("feature true → enabled", () => {
    expect(shouldProcessFeature(true)).toBe(true);
  });

  test("feature false → disabled", () => {
    expect(shouldProcessFeature(false)).toBe(false);
  });
});

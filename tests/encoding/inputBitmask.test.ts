import { describe, test, expect } from "vitest";

// Replicate the encode/decode logic to test round-trips without importing client code.
// Must stay in sync with client/src/game/hooks/useColyseus.ts and the server decoder.

function encodeInput(input: {
  moveLeft?: boolean; moveRight?: boolean; moveUp?: boolean; moveDown?: boolean;
  attack?: boolean; defense?: boolean; dodge?: boolean; jump?: boolean;
  chargeHeld?: boolean; specialTap?: boolean;
}): number {
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

function decodeInput(mask: number) {
  return {
    moveLeft:   (mask & (1 << 0)) !== 0,
    moveRight:  (mask & (1 << 1)) !== 0,
    moveUp:     (mask & (1 << 2)) !== 0,
    moveDown:   (mask & (1 << 3)) !== 0,
    attack:     (mask & (1 << 4)) !== 0,
    defense:    (mask & (1 << 5)) !== 0,
    dodge:      (mask & (1 << 6)) !== 0,
    jump:       (mask & (1 << 7)) !== 0,
    chargeHeld: (mask & (1 << 8)) !== 0,
    specialTap: (mask & (1 << 9)) !== 0,
  };
}

describe("input bitmask encoding", () => {
  test("all-false encodes to 0", () => {
    expect(encodeInput({})).toBe(0);
  });

  test("all-true encodes to 0x3FF (all 10 bits set)", () => {
    expect(encodeInput({
      moveLeft: true, moveRight: true, moveUp: true, moveDown: true,
      attack: true, defense: true, dodge: true, jump: true,
      chargeHeld: true, specialTap: true,
    })).toBe(0x3FF);
  });

  test("moveLeft only → bit 0 set", () => {
    expect(encodeInput({ moveLeft: true })).toBe(1 << 0);
  });

  test("attack only → bit 4 set", () => {
    expect(encodeInput({ attack: true })).toBe(1 << 4);
  });

  test("specialTap only → bit 9 set", () => {
    expect(encodeInput({ specialTap: true })).toBe(1 << 9);
  });

  test("no bit collision between fields — each flag has a unique bit", () => {
    const fields: Array<keyof Parameters<typeof encodeInput>[0]> = [
      "moveLeft", "moveRight", "moveUp", "moveDown",
      "attack", "defense", "dodge", "jump", "chargeHeld", "specialTap",
    ];
    const bitmasks = fields.map((f) => encodeInput({ [f]: true }));
    const unique = new Set(bitmasks);
    expect(unique.size).toBe(fields.length);
  });
});

describe("input bitmask — round-trip", () => {
  test("all 1024 possible combinations round-trip losslessly", () => {
    for (let mask = 0; mask < 1024; mask++) {
      const decoded = decodeInput(mask);
      const reEncoded = encodeInput(decoded);
      expect(reEncoded).toBe(mask);
    }
  });

  test("moveLeft + attack together encode and decode correctly", () => {
    const encoded = encodeInput({ moveLeft: true, attack: true });
    const decoded = decodeInput(encoded);
    expect(decoded.moveLeft).toBe(true);
    expect(decoded.attack).toBe(true);
    expect(decoded.moveRight).toBe(false);
    expect(decoded.defense).toBe(false);
  });

  test("a typical WASD-left + attack combo", () => {
    const input = { moveLeft: true, attack: true, chargeHeld: true };
    const decoded = decodeInput(encodeInput(input));
    expect(decoded.moveLeft).toBe(true);
    expect(decoded.attack).toBe(true);
    expect(decoded.chargeHeld).toBe(true);
    expect(decoded.moveRight).toBe(false);
    expect(decoded.specialTap).toBe(false);
  });
});

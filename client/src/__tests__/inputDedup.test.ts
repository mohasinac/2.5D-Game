/**
 * P7: Input dedup unit test.
 * Exercises the bitmask encoding + dedup logic from useGameInput.ts in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Inline the bitmask encoder (same as useGameInput.encodeLocalBitmask) ─────

interface FullGameInput {
  moveLeft?: boolean; moveRight?: boolean; moveUp?: boolean; moveDown?: boolean;
  attack?: boolean; defense?: boolean; dodge?: boolean; jump?: boolean;
  chargeHeld?: boolean; specialTap?: boolean;
}

function encodeLocalBitmask(input: FullGameInput): number {
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

// ─── Simulate the dedup logic ──────────────────────────────────────────────────

const HEARTBEAT_MS = 500;

function makeDeduper(sendInput: (input: FullGameInput) => void) {
  let lastSentBitmask = -1;
  let lastSentTime = 0;

  return function send(input: FullGameInput, now: number) {
    const bitmask = encodeLocalBitmask(input);
    if (bitmask !== lastSentBitmask || now - lastSentTime >= HEARTBEAT_MS) {
      sendInput(input);
      lastSentBitmask = bitmask;
      lastSentTime = now;
    }
  };
}

describe("encodeLocalBitmask", () => {
  it("returns 0 for empty input", () => {
    expect(encodeLocalBitmask({})).toBe(0);
  });

  it("encodes each bit correctly", () => {
    expect(encodeLocalBitmask({ moveLeft: true })).toBe(1 << 0);
    expect(encodeLocalBitmask({ moveRight: true })).toBe(1 << 1);
    expect(encodeLocalBitmask({ moveUp: true })).toBe(1 << 2);
    expect(encodeLocalBitmask({ moveDown: true })).toBe(1 << 3);
    expect(encodeLocalBitmask({ attack: true })).toBe(1 << 4);
    expect(encodeLocalBitmask({ defense: true })).toBe(1 << 5);
    expect(encodeLocalBitmask({ dodge: true })).toBe(1 << 6);
    expect(encodeLocalBitmask({ jump: true })).toBe(1 << 7);
    expect(encodeLocalBitmask({ chargeHeld: true })).toBe(1 << 8);
    expect(encodeLocalBitmask({ specialTap: true })).toBe(1 << 9);
  });

  it("combines multiple keys", () => {
    expect(encodeLocalBitmask({ moveLeft: true, attack: true })).toBe((1 << 0) | (1 << 4));
  });
});

describe("input dedup logic", () => {
  it("sends on first call regardless of bitmask", () => {
    const sendInput = vi.fn();
    const send = makeDeduper(sendInput);
    send({ moveLeft: true }, 0);
    expect(sendInput).toHaveBeenCalledTimes(1);
  });

  it("skips duplicate bitmask within heartbeat window", () => {
    const sendInput = vi.fn();
    const send = makeDeduper(sendInput);
    // Send same input 120 times in 1000ms (simulating 120fps)
    for (let i = 0; i < 120; i++) {
      send({ moveLeft: true }, i * (1000 / 120));
    }
    // Only first send + heartbeat at 500ms fires; bitmask doesn't change
    // First call at t=0 → sends
    // Heartbeat at t≥500ms → sends once more (at i=60, t≈500)
    // Total: 2 sends
    expect(sendInput.mock.calls.length).toBeLessThanOrEqual(3);
    expect(sendInput.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("sends when bitmask changes", () => {
    const sendInput = vi.fn();
    const send = makeDeduper(sendInput);
    send({ moveLeft: true }, 0);
    send({ moveRight: true }, 8);   // different bitmask → sends
    send({ moveRight: true }, 16);  // same → deduped
    expect(sendInput).toHaveBeenCalledTimes(2);
  });

  it("sends heartbeat after 500ms even with same bitmask", () => {
    const sendInput = vi.fn();
    const send = makeDeduper(sendInput);
    send({ attack: true }, 0);
    send({ attack: true }, 499);  // still in window — skip
    send({ attack: true }, 501);  // heartbeat elapsed — send
    expect(sendInput).toHaveBeenCalledTimes(2);
  });

  it("120fps for 1s with same key sends ≤ 3 messages (initial + heartbeat)", () => {
    const sendInput = vi.fn();
    const send = makeDeduper(sendInput);
    const FPS = 120;
    const DURATION_MS = 1000;
    for (let frame = 0; frame < FPS; frame++) {
      send({ attack: true }, frame * (DURATION_MS / FPS));
    }
    // Initial call at t=0, heartbeat around t=500ms, possibly one near t=1000ms
    expect(sendInput.mock.calls.length).toBeLessThanOrEqual(3);
  });
});

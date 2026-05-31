import { describe, test, expect } from "vitest";
import { createPRNG } from "../../server/utils/prng";
import { hashString } from "../../server/utils/hashString";

describe("createPRNG — Mulberry32", () => {
  test("same seed produces same sequence for 10 000 draws", () => {
    const a = createPRNG(42);
    const b = createPRNG(42);
    for (let i = 0; i < 10_000; i++) {
      expect(a()).toBe(b());
    }
  });

  test("different seeds produce different sequences", () => {
    const a = createPRNG(1);
    const b = createPRNG(2);
    let differ = false;
    for (let i = 0; i < 100; i++) {
      if (a() !== b()) { differ = true; break; }
    }
    expect(differ).toBe(true);
  });

  test("output is always in [0, 1)", () => {
    const rand = createPRNG(99);
    for (let i = 0; i < 10_000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test("distribution is roughly uniform across [0, 1) — chi-square sanity check", () => {
    const rand = createPRNG(123);
    const bins = new Array(10).fill(0);
    const N = 10_000;
    for (let i = 0; i < N; i++) {
      bins[Math.floor(rand() * 10)]++;
    }
    // Each bin should be ~1000 ± 200 (very loose)
    for (const count of bins) {
      expect(count).toBeGreaterThan(800);
      expect(count).toBeLessThan(1200);
    }
  });

  test("seed 0 still produces valid output", () => {
    const rand = createPRNG(0);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("hashString — FNV-1a", () => {
  test("same string always produces same uint32", () => {
    expect(hashString("hello")).toBe(hashString("hello"));
    expect(hashString("match-123")).toBe(hashString("match-123"));
  });

  test("different strings produce different hashes (collision check on typical IDs)", () => {
    const hashes = new Set(["match-1", "match-2", "match-3", "arena-test", "beyblade-abc"].map(hashString));
    expect(hashes.size).toBe(5);
  });

  test("output is a non-negative integer (uint32)", () => {
    const h = hashString("test-id");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });

  test("empty string produces a deterministic hash", () => {
    expect(hashString("")).toBe(hashString(""));
  });
});

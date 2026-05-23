/**
 * Burst mechanic formula tests (Phase R).
 * The burst formula lives inside BattleRoom's collision loop.
 * We extract and validate the math here as a pure-function suite:
 *
 *   burstRaw      = max(0, incomingDmg - BURST_THRESHOLD) * 0.005
 *   burstSpinMod  = 1 + (1 - spinRatio) * 2.0
 *   burstResist   = clamp(victim.burstResistance ?? 50, 0, 100)
 *   burstFinal    = burstRaw * burstSpinMod * (1 - burstResist / 100)
 */
import { describe, it, expect } from "vitest";

const BURST_THRESHOLD = 40;

function burstFormula(
  incomingDmg: number,
  spinRatio: number,      // spin / maxSpin  (0.0–1.0)
  burstResistance: number | undefined,
): number {
  if (incomingDmg < BURST_THRESHOLD) return 0;
  const burstRaw = Math.max(0, incomingDmg - BURST_THRESHOLD) * 0.005;
  const burstSpinMod = 1 + (1 - spinRatio) * 2.0;
  const burstResist = Math.max(0, Math.min(100, burstResistance ?? 50));
  return burstRaw * burstSpinMod * (1 - burstResist / 100);
}

describe("burst formula — burstFinal probability", () => {
  it("returns 0 when incomingDmg is below the 40-point threshold", () => {
    expect(burstFormula(39, 0.5, 50)).toBe(0);
    expect(burstFormula(0, 0, 0)).toBe(0);
  });

  it("returns 0 exactly at the threshold (no excess damage)", () => {
    expect(burstFormula(40, 1.0, 0)).toBe(0);
  });

  it("worst-case: max damage, full spin, zero resistance → non-trivial chance", () => {
    // incomingDmg=140, spinRatio=1.0, resistance=0
    // burstRaw = (140-40)*0.005 = 0.5; spinMod=1+(1-1)*2=1; final=0.5
    expect(burstFormula(140, 1.0, 0)).toBeCloseTo(0.5);
  });

  it("low-spin bey (spinRatio=0) triples the modifier (spinMod=3)", () => {
    // burstRaw=(60-40)*0.005=0.1; spinMod=1+(1-0)*2=3; resist=0 → 0.3
    expect(burstFormula(60, 0, 0)).toBeCloseTo(0.3);
  });

  it("high burst resistance (85 = defense type) drastically reduces chance", () => {
    // burstRaw=(90-40)*0.005=0.25; spinMod=3 (spinRatio=0); (1-85/100)=0.15
    // final = 0.25 * 3 * 0.15 = 0.1125
    expect(burstFormula(90, 0, 85)).toBeCloseTo(0.1125);
  });

  it("burstResistance=100 makes burst chance exactly 0 regardless of damage", () => {
    expect(burstFormula(9999, 0, 100)).toBeCloseTo(0);
  });

  // burstResistance clamping — the key fix from Phase R
  it("negative burstResistance is clamped to 0 (same as 0 resistance)", () => {
    const withNegative = burstFormula(80, 0.5, -50);
    const withZero     = burstFormula(80, 0.5,   0);
    expect(withNegative).toBeCloseTo(withZero);
  });

  it("burstResistance > 100 is clamped to 100 (zero chance)", () => {
    expect(burstFormula(500, 0, 999)).toBeCloseTo(0);
  });

  it("undefined burstResistance defaults to 50", () => {
    const withUndefined = burstFormula(80, 0.5, undefined);
    const withFifty     = burstFormula(80, 0.5, 50);
    expect(withUndefined).toBeCloseTo(withFifty);
  });

  it("attack beyblade (resistance=20) has higher burst chance than defense (85)", () => {
    const attChance = burstFormula(80, 0.5, 20);
    const defChance = burstFormula(80, 0.5, 85);
    expect(attChance).toBeGreaterThan(defChance);
  });

  it("burstFinal is always non-negative (never negative probability)", () => {
    const cases: [number, number, number | undefined][] = [
      [BURST_THRESHOLD, 0, undefined],
      [1000, 0, 0],
      [1000, 1, 100],
      [40, 0.99, -9999],
    ];
    for (const [dmg, sr, br] of cases) {
      expect(burstFormula(dmg, sr, br)).toBeGreaterThanOrEqual(0);
    }
  });
});

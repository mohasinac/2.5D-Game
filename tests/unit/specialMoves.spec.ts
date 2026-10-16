import { test, expect } from '@playwright/test';
import {
  defaultSpecialMove, defaultSpecialMovePhase,
  specialMoveToSave, specialMoveFromSave,
  type SpecialMoveDefinition,
} from '../../src/types/specialMoveTypes';

/**
 * THE SPECIAL-MOVE DEFINITION IS AUTHORED DATA, AND USING A MOVE MUST NOT
 * DAMAGE IT.
 *
 * Two of the three defects CLAUDE.md records against this system were the
 * same mistake — execution state stored on the authored object:
 *
 *   · "`_tickPhase` nulls `phase.hitEffect` after it fires, permanently
 *      mutating the stored definition for the session."
 *   · Phases looped forever, because `_enterPhase` zeroed the `_loopAccum`
 *     that `_tickPhase` had just incremented.
 *
 * `SpecialMoveManager` needs a `SimClock`, a caster position and a DOM HUD,
 * so the manager itself is exercised in the browser specs. What is pinned
 * here is the property that makes both defects impossible to reintroduce:
 * the structs carry no runtime fields at all, so there is nothing on them
 * for an execution to corrupt.
 */

test.describe('definitions carry no runtime state', () => {
  const RUNTIME_KEYS = ['_loopAccum', '_lastUsedAt'];

  test('a fresh phase has no runtime fields', () => {
    const ph = defaultSpecialMovePhase('p1');
    for (const k of RUNTIME_KEYS) {
      expect(Object.keys(ph), `phase must not carry ${k}`).not.toContain(k);
    }
  });

  test('a fresh move has no runtime fields', () => {
    const def = defaultSpecialMove('m1');
    for (const k of RUNTIME_KEYS) {
      expect(Object.keys(def), `move must not carry ${k}`).not.toContain(k);
    }
  });

  test('and neither does one restored from a save', () => {
    // `specialMoveFromSave` used to re-stamp `_loopAccum: 0` and
    // `_lastUsedAt: 0` onto everything it loaded, which is how the runtime
    // fields survived a round-trip through storage.
    const def = specialMoveFromSave(specialMoveToSave(defaultSpecialMove('m2')));
    for (const k of RUNTIME_KEYS) {
      expect(Object.keys(def)).not.toContain(k);
      for (const ph of def.phases.values()) expect(Object.keys(ph)).not.toContain(k);
    }
  });
});

test.describe('a save round-trip preserves the authored move', () => {
  const authored = (): SpecialMoveDefinition => {
    const def = defaultSpecialMove('m3');
    const ph  = def.phases.get(def.entryPhaseId)!;
    ph.hitEffect = { hitRadius: 12, damageAmount: 25, knockback: 'away', impulseMag: 300 };
    ph.projectile = { radius: 1.5, speed: 220, lifetime: 2, color: 0xff6b35 };
    ph.loopCount = 3;
    return def;
  };

  test('THE HIT EFFECT SURVIVES, which is what nulling it destroyed', () => {
    // The old `_tickPhase` wrote `phase.hitEffect = null` on the stored
    // definition, so the next save persisted a move with no damage at all.
    const out = specialMoveFromSave(specialMoveToSave(authored()));
    const ph  = out.phases.get(out.entryPhaseId)!;
    expect(ph.hitEffect).not.toBeNull();
    expect(ph.hitEffect!.damageAmount).toBe(25);
  });

  test('the projectile command survives', () => {
    // Declared-but-never-executed was the third defect; the data at least has
    // to make it to the thing that now executes it.
    const out = specialMoveFromSave(specialMoveToSave(authored()));
    const ph  = out.phases.get(out.entryPhaseId)!;
    expect(ph.projectile).not.toBeNull();
    expect(ph.projectile!.speed).toBe(220);
  });

  test('loop count survives', () => {
    const out = specialMoveFromSave(specialMoveToSave(authored()));
    expect(out.phases.get(out.entryPhaseId)!.loopCount).toBe(3);
  });

  test('FALSIFICATION: a deep clone is not what is being tested', () => {
    // If `specialMoveToSave` handed back the same phase objects, every
    // assertion above would pass while the stored move stayed shared and
    // corruptible. The save must be a genuine copy.
    const def = authored();
    const out = specialMoveFromSave(specialMoveToSave(def));
    const a = def.phases.get(def.entryPhaseId)!;
    const b = out.phases.get(out.entryPhaseId)!;
    expect(b).not.toBe(a);
    b.hitEffect = null;
    expect(a.hitEffect).not.toBeNull();
  });
});

import { test, expect } from '@playwright/test';
import { BASE_COMBOS, combosFor } from '../../src/systems/comboDefs';
import {
  ComboDetector, COMBO_MAX_DAMAGE_MULT, COMBO_MAX_LOCK_MS, COMBO_SLOTS,
} from '../../src/systems/ComboDetector';
import {
  KeyboardInputSource, SCHEME_P1, SCHEME_P2, AiInputSource, TouchZoneInputSource,
} from '../../src/systems/inputSources';

/**
 * THE COMBO TABLE AND THE INPUT ALPHABET.
 *
 * Combos could never fire, for two independent reasons that each hid the
 * other: `ComboDetector.attach` had no caller so `attached` was always `[]`,
 * and there was no combo data in the repository to attach. On top of that the
 * three input sources spoke three different token languages, so even a wired
 * combo would have matched for at most one of them.
 */

const VALID = new Set(['UP', 'DOWN', 'LEFT', 'RIGHT', 'JUMP', 'TRIGGER', 'GUARD']);

test.describe('combo table', () => {

  test('there is a table at all, and ids are unique', () => {
    expect(BASE_COMBOS.length).toBeGreaterThanOrEqual(8);
    const ids = BASE_COMBOS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every token is in the canonical alphabet', () => {
    /* Authoring against raw key codes like 'KeyA' would make a combo
       desktop-only and silently unreachable on touch and for every AI. */
    const bad: string[] = [];
    for (const c of BASE_COMBOS) {
      for (const t of c.sequence) if (!VALID.has(t)) bad.push(`${c.id}:${t}`);
    }
    expect(bad).toEqual([]);
  });

  test('sequences are 2-4 keys, which is what the detector matches', () => {
    for (const c of BASE_COMBOS) {
      expect(c.sequence.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.sequence.length, c.id).toBeLessThanOrEqual(4);
    }
  });

  test('THE CEILINGS HOLD — a combo is skill inside the physical layer', () => {
    /* CS12 Case 614. Combos never receive `[M]` amplification, so these caps
       are the only thing separating player skill from the anime override. */
    for (const c of BASE_COMBOS) {
      expect(c.damageMultiplier, c.id).toBeLessThanOrEqual(COMBO_MAX_DAMAGE_MULT);
      expect(c.lockMs, c.id).toBeLessThanOrEqual(COMBO_MAX_LOCK_MS);
      expect(c.cost, c.id).toBeGreaterThanOrEqual(0);
      expect(c.cooldownMs, c.id).toBeGreaterThan(0);
    }
  });

  test('free combos are movement, paid combos are offence', () => {
    for (const c of BASE_COMBOS) {
      if (c.cost === 0) expect(c.damageMultiplier, c.id).toBeCloseTo(1.0, 5);
    }
  });

  test('combosFor filters by type and always leaves something attachable', () => {
    for (const t of ['attack', 'defense', 'stamina', 'balance']) {
      const list = combosFor(t);
      expect(list.length, t).toBeGreaterThan(0);
      for (const c of list) {
        if (c.allowedTypes.length > 0) expect(c.allowedTypes, c.id).toContain(t);
      }
    }
  });

  test('a filtered set actually fits the detector’s slots', () => {
    for (const t of ['attack', 'defense', 'stamina', 'balance']) {
      const det = new ComboDetector();
      det.attach(combosFor(t));
      expect(det.attachedCombos().length).toBeGreaterThan(0);
      expect(det.attachedCombos().length).toBeLessThanOrEqual(COMBO_SLOTS);
    }
  });

  test('THE POINT: an attached combo actually fires from its tokens', () => {
    /* The end-to-end claim. Before this, `tryFire` returned `no_match` on
       every frame of every battle. */
    const det = new ComboDetector();
    const weave = BASE_COMBOS.find(c => c.id === 'weave')!;
    det.attach([weave]);
    let t = 1000;
    for (const tok of weave.sequence) { det.press(tok, t); t += 100; }

    const r = det.tryFire({
      beyType: 'balance', power: 100, nowMs: t,
      lastFired: new Map(), globalReadyAtMs: 0,
    });
    expect(r.combo?.id).toBe('weave');
  });
});

test.describe('input alphabet', () => {

  test('P1 and P2 schemes stay disjoint after the KeyF fix', () => {
    /* `KeyF` was the P1 trigger AND the global fullscreen toggle, so pressing
       the special key toggled fullscreen. It is `KeyT` now, which is what the
       on-screen hint always claimed. */
    expect(SCHEME_P1.trigger).toBe('KeyT');
    const shared = Object.values(SCHEME_P1).filter(k =>
      (Object.values(SCHEME_P2) as string[]).includes(k));
    expect(shared).toEqual([]);
  });

  test('the keyboard emits SEMANTIC tokens, not key codes', () => {
    const target = new EventTarget();
    const src = new KeyboardInputSource('p1', SCHEME_P1, target);
    target.dispatchEvent(Object.assign(new Event('keydown'), {
      code: 'KeyA', preventDefault() {},
    }));
    expect(src.sample().pressed).toEqual(['LEFT']);
    src.detach();
  });

  test('THE AI IS NOT MUTE — it emits tokens like any other source', () => {
    /* It spread `EMPTY_FRAME`, whose `pressed` is always `[]`, so no AI
       opponent could execute a combo — not by choice, but because it had no
       voice. That also breaks the stated property that an AI frame is
       indistinguishable from a human one. */
    const ai = new AiInputSource('cpu', () => ({
      selfX: 0, selfZ: 0, targetX: 100, targetZ: 0, force: 'must_attack',
    }));
    const f = ai.sample();
    expect(f.pressed).toContain('RIGHT');
    expect(f.pressed).toContain('TRIGGER');
  });

  test('a joystick can spell, and a held direction is ONE letter', () => {
    const t = new TouchZoneInputSource('p1');
    t.setAxis(-1, 0);
    t.setAxis(-1, 0);            // still held — must not repeat
    t.setAxis(1, 0);             // flicked the other way
    expect(t.sample().pressed).toEqual(['LEFT', 'RIGHT']);
  });

  test('a centred joystick emits nothing', () => {
    const t = new TouchZoneInputSource('p1');
    t.setAxis(0.1, 0.1);
    expect(t.sample().pressed).toEqual([]);
  });
});

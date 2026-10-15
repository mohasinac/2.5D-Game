import { test, expect } from '@playwright/test';
import { CS10_ARENAS, arenaBlueprint, SCREENSHOT_ONLY } from '../../src/config/arenas';
import { expand, expandAll, mm, resolveSurface, SURFACE_FALLBACK } from '../../src/config/arenas/blueprint';

/**
 * The CS10-specced stadiums.
 *
 * These are DATA, so the tests check the two things data can get wrong:
 * that it expands into something the loader will accept, and that the
 * numbers still say what the case said. A stadium whose radius drifts is
 * invisible — it still renders, it is just not the stadium any more.
 */

test.describe('arena blueprints', () => {

  test('every blueprint cites the CS10 case it came from', () => {
    /* Traceability is the point of the whole exercise: authoring from case
       numbers rather than screenshots only helps if the number survives. */
    for (const bp of CS10_ARENAS) {
      expect(bp.caseNum, `${bp.id} has no case number`).toBeGreaterThan(0);
      expect(bp.notes.length, `${bp.id} has no note`).toBeGreaterThan(10);
    }
  });

  test('case numbers fall inside CS10 arena range (545-585)', () => {
    for (const bp of CS10_ARENAS) {
      expect(bp.caseNum, bp.id).toBeGreaterThanOrEqual(545);
      expect(bp.caseNum, bp.id).toBeLessThanOrEqual(585);
    }
  });

  test('ids are unique — a collision would silently shadow a stadium', () => {
    const ids = CS10_ARENAS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('mm converts to the project centimetre, once and visibly', () => {
    expect(mm(2000)).toBe(200);
    expect(mm(250)).toBe(25);
  });

  test('every blueprint expands into a loadable config', () => {
    for (const bp of CS10_ARENAS) {
      const cfg = expand(bp);
      expect(cfg.arenas, bp.id).toHaveLength(1);
      expect(cfg.arenaSeq, bp.id).toBe(2);
      expect(cfg.baseConfig.sides, bp.id).toBe(8);
      // Seq counters must exceed the ids actually used, or a later add collides.
      expect(cfg.obstacleSeq, bp.id).toBe((bp.obstacles?.length ?? 0) + 1);
    }
  });

  test('expandAll keys by id', () => {
    const all = expandAll(CS10_ARENAS);
    expect(Object.keys(all).length).toBe(CS10_ARENAS.length);
    expect(all['tower']).toBeDefined();
  });

  test('CS10 Case 563: the Tower is 2000 mm with a central column', () => {
    const bp = arenaBlueprint('tower')!;
    expect(bp.radius).toBe(100);          // 2000 mm diameter
    expect(bp.obstacles).toHaveLength(1);
    expect(bp.obstacles![0].shape).toBe('frustum');
  });

  test('CS10 Case 577: the Moon arena really is one sixth gravity', () => {
    const bp = arenaBlueprint('moon-trampoline')!;
    expect(bp.gravityScale).toBeCloseTo(1.625 / 9.81, 6);
    // Which is the whole mechanic: ~6x the bounce height.
    expect(1 / bp.gravityScale!).toBeCloseTo(6.03, 1);
  });

  test('CS10 Case 564: the Colosseum has 8 terraces and no exits', () => {
    const bp = arenaBlueprint('colosseum')!;
    expect(bp.stepCount).toBe(8);
    expect(bp.profile).toBe('step');
    expect(bp.notes).toContain('NO exits');
  });

  test('the two shrinking arenas shrink in OPPOSITE directions', () => {
    // Which is why surface mutation is one mechanic with a direction.
    expect(arenaBlueprint('blizzard-s1')!.notes).toContain('rim-in');
    expect(arenaBlueprint('brick-courtyard')!.notes).toContain('centre-out');
  });

  test('FOUR MATERIALS CS10 NEEDS DO NOT EXIST as SurfaceTypes', () => {
    /* Documented rather than hidden. The water mapping is the one that is
       genuinely wrong in a way that matters: CS10 puts water at mu 0.80-1.20,
       the highest in its table, and the nearest type by NAME (`ice`) is
       0.03-0.05, the lowest. Mapping it to `sand` keeps the play behaviour
       roughly right at the cost of the look. */
    expect(Object.keys(SURFACE_FALLBACK).sort()).toEqual(['asphalt', 'grass', 'stone', 'water']);
    expect(resolveSurface('water')).toBe('sand');
    expect(resolveSurface('water')).not.toBe('ice');
    expect(resolveSurface('stone')).toBe('concrete');
    // A real SurfaceType passes through untouched.
    expect(resolveSurface('metal')).toBe('metal');
  });

  test('screenshot-only stadiums are NOT authored with invented numbers', () => {
    /* The honest half: ~11 of the 30 have no case, so a blueprint for them
       would be indistinguishable from a sourced one. They are listed, not
       built. */
    const authored = new Set(CS10_ARENAS.map(a => a.id));
    for (const name of SCREENSHOT_ONLY) {
      expect(authored.has(name.replace(/\s+/g, '-')), name).toBe(false);
    }
  });

  test('oval dishes keep both radii distinct', () => {
    const oval = arenaBlueprint('brick-courtyard')!;
    expect(oval.radiusZ).toBeDefined();
    expect(oval.radiusZ).not.toBe(oval.radius);
    const cfg = expand(oval);
    expect(cfg.arenas[0].radiusX).not.toBe(cfg.arenas[0].radiusZ);
  });

  test('obstacle-bearing stadiums carry real obstacles into the config', () => {
    const dish = expand(arenaBlueprint('obstacle-dish')!);
    expect(dish.obstacles.length).toBeGreaterThanOrEqual(5);
    expect(dish.obstacles[0].id).toBe('obstacle-1');
  });
});

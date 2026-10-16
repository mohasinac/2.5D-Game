import { test, expect } from '@playwright/test';
import { TIP_MOVEMENT, desiredRadius, patternDirection, advancePattern, toPatternState } from '../../src/sim/step/movementPattern';
import { blendSteering, ridgeFaceAngle, ridgeImpulseSplit, gripFactor, ridgeCrossSpeed } from '../../src/sim/step/railBlend';
import { launchVelocity, apexHeight, minLoopSpeed, holdsLoop, teleport, behindTarget } from '../../src/sim/step/aerial';
import { ease, progress, animate, hazardFrame } from '../../src/utils/easing';
import { stepProjectile, canHit, projectileHit, leadAim, type Projectile, type ProjectileTarget } from '../../src/sim/step/projectile';
import { assemble, sortBySlot, isLegal, type AssemblyPart } from '../../src/bey/assembler';
import { stepCharge, launchOmega, LAUNCHERS, IDLE_LAUNCH } from '../../src/sim/step/launch';
import { rankineProfile, fieldAccel, totalFieldAccel, magneticAccel, stadiumMagnetAccel, FIELD_ACCEL_CAP, type FieldEffect } from '../../src/sim/step/fieldForce';
import { ComboDetector, clampComboDef, COMBO_MAX_DAMAGE_MULT, qteSucceeds, type ComboDef } from '../../src/systems/ComboDetector';
import { chargeGauges, awardXtreme, canPaySpecial, paySpecial, applyAmplification, tierForImpulse, EMPTY_GAUGES } from '../../src/systems/BattleGauges';
import { recompose, detachPart, morphPart, shouldDeploy, makeLivePart, type LivePart } from '../../src/sim/step/partMutation';
import { stepSurfaceMutation, isMutated, sampleSurface, applyWear, wearFrictionFactor, FRESH, type SurfaceMutation } from '../../src/sim/step/surfaceState';
import { MemoryStorageAdapter, COLLECTIONS } from '../../src/stores/StorageAdapter';
import { makeClone, stepClone, aiTargets, PositionTrail } from '../../src/sim/step/clones';
import { BeySystem, RING_OUT_Y } from '../../src/systems/BeySystem';
import { MatchSystem, FINISH_POINTS } from '../../src/systems/MatchSystem';
import { InputSystem, ScriptedInputSource, EMPTY_FRAME } from '../../src/systems/InputSystem';
import { makeBeySpec } from '../../src/sim/state';
import { contactSlipSpeed, isCounterSpin, applySpinExchange, signedSpin, type SpinBody } from '../../src/sim/step/spinExchange';
import { SCHEME_P1, SCHEME_P2, schemesConflict, TouchZoneInputSource, AiInputSource } from '../../src/systems/inputSources';
import { makeBurstState, applyBurstImpulse, holdingTorque, relativeTorque, relativeRotation, burstProgress, DEFAULT_BURST } from '../../src/sim/step/burst';
import { tiltFromContact } from '../../src/sim/step/spin';

/**
 * Phases 7-18, written in one pass with Docker down and no compiler.
 *
 * These are deliberately BEHAVIOURAL rather than exhaustive: each one pins
 * the single claim its module exists to make, so that a later change which
 * quietly inverts a sign or drops a guard fails here rather than in a demo.
 */

/* ── Phase 7: movement patterns ──────────────────────────────────────────── */
test.describe('movement patterns', () => {
  const arena = { ridgeRadius: 70, outerRadius: 100 };

  test('a flat tip is aggressive and a sharp tip barely moves', () => {
    // The sourced rule: flatter tips behave aggressively, pointed ones calmly.
    expect(TIP_MOVEMENT.rubber_flat.aggression).toBeGreaterThan(TIP_MOVEMENT.sharp.aggression * 5);
    expect(TIP_MOVEMENT.sharp.pattern).toBe('stationary');
    expect(TIP_MOVEMENT.rubber_flat.pattern).toBe('flower');
  });

  test('a flower sweeps between the centre and the ridge', () => {
    const p = TIP_MOVEMENT.rubber_flat;
    let lo = Infinity, hi = -Infinity;
    let st = toPatternState(50, 0, 0, 0);
    for (let i = 0; i < 400; i++) {
      st = advancePattern(st, p, 1 / 60);
      const r = desiredRadius(st, p, arena);
      lo = Math.min(lo, r); hi = Math.max(hi, r);
    }
    expect(hi).toBeCloseTo(arena.ridgeRadius, 0);
    expect(lo).toBeLessThan(arena.ridgeRadius * 0.3);
  });

  test('a tornado stall holds the ridge and does not oscillate', () => {
    const p = TIP_MOVEMENT.bearing;
    const st = toPatternState(70, 0, 0, 0);
    expect(desiredRadius(st, p, arena)).toBeCloseTo(arena.ridgeRadius, 6);
  });

  test('the direction is a unit vector even at the arena centre', () => {
    const d = patternDirection(toPatternState(0, 0, 0, 0), TIP_MOVEMENT.hard_flat, arena);
    expect(Math.hypot(d.x, d.z)).toBeCloseTo(1, 6);
  });
});

/* ── Phase 8: rail blend + the ridge ─────────────────────────────────────── */
test.describe('rail blending and the Tornado Ridge', () => {
  const bey    = { x: 1, y: 0, z: 0 };
  const player = { x: 0, y: 0, z: 1 };
  const rail   = { x: -1, y: 0, z: 0 };

  test('authority 0 means the bey ignores the blader entirely', () => {
    const d = blendSteering(bey, player, rail, 0, 0);
    expect(d.x).toBeCloseTo(1, 6);
    expect(d.z).toBeCloseTo(0, 6);
  });

  test('authority 1 hands the bey to the blader', () => {
    const d = blendSteering(bey, player, rail, 1, 0);
    expect(d.z).toBeCloseTo(1, 6);
  });

  test('full grip means the rail wins regardless of authority', () => {
    const d = blendSteering(bey, player, rail, 1, 1);
    expect(d.x).toBeCloseTo(-1, 6);
  });

  test('no stick input does not drag the bey toward the origin', () => {
    const d = blendSteering(bey, { x: 0, y: 0, z: 0 }, rail, 1, 0);
    expect(d.x).toBeCloseTo(1, 6);
  });

  test('CS10 Case 546: a 3 mm ridge sits at 16.7 degrees', () => {
    const ridge = { radius: 70, height: 0.3, halfWidth: 1.0, restitution: 0.5 };
    expect(ridgeFaceAngle(ridge) * 180 / Math.PI).toBeCloseTo(16.7, 0);
  });

  test('LOW AND SHARP BEATS TALL — more impulse goes inward', () => {
    /* The counter-intuitive result CS10 derives: a 3 mm ridge redirects 95.7%
       of the impulse inward, a 10 mm one only 70.7% and wastes the rest
       launching the bey. */
    const low  = { radius: 70, height: 0.3, halfWidth: 1.0, restitution: 0.5 };
    const tall = { radius: 70, height: 1.0, halfWidth: 1.0, restitution: 0.5 };
    const a = ridgeImpulseSplit(30, 200, low);
    const b = ridgeImpulseSplit(30, 200, tall);
    expect(a.inward / (a.inward + a.vertical)).toBeGreaterThan(
           b.inward / (b.inward + b.vertical));
    expect(Math.cos(a.beta)).toBeCloseTo(0.957, 2);
  });

  test('THE RIDGE CAN FAIL TO GRAB — that is the documented behaviour', () => {
    const ridge = { radius: 70, height: 0.3, halfWidth: 1.0, restitution: 0.5 };
    const cross = ridgeCrossSpeed(ridge);
    // A tall contact lip rides straight over it.
    expect(gripFactor(ridge, 0, 0.5, 10, cross)).toBe(0);
    // Too fast radially and it crosses instead of turning.
    expect(gripFactor(ridge, 0, 0.1, cross * 2, cross)).toBe(0);
    // Low and slow and close: held.
    expect(gripFactor(ridge, 0, 0.1, cross * 0.1, cross)).toBeGreaterThan(0.5);
  });
});

/* ── Phase 9: aerial, loops, teleport ────────────────────────────────────── */
test.describe('aerial and loops', () => {
  test('a 45-degree launch splits speed between travel and height', () => {
    const v = launchVelocity({ x: 1, y: 0, z: 0 }, {
      launchAngleDeg: 45, launchSpeed: 100, gravityScale: 1, airDrag: 1,
    });
    expect(v.x).toBeCloseTo(v.y, 4);
  });

  test('lower gravity means a higher apex — the moon arena', () => {
    const cfg = { launchAngleDeg: 60, launchSpeed: 300, gravityScale: 1, airDrag: 1 };
    const moon = { ...cfg, gravityScale: 1.625 / 9.81 };
    expect(apexHeight(moon)).toBeGreaterThan(apexHeight(cfg) * 5);
  });

  test('a loop needs speed, and needs LESS of it overhead', () => {
    // At the bottom gravity fully opposes the normal; overhead it assists.
    const bottom = minLoopSpeed(12, 0);
    const side   = minLoopSpeed(12, Math.PI / 2);
    expect(bottom).toBeGreaterThan(0);
    /* Compared against the bottom-of-loop demand rather than against zero:
       `cos(π/2)` is 6.1e-17 in IEEE754, not 0, so the requirement is ~8e-7
       cm/s. That is zero for every purpose here, and asserting it as a
       RATIO says what the physics claims — the wall costs nothing to hold —
       instead of pinning a float artefact. */
    expect(side / bottom).toBeLessThan(1e-6);
    expect(minLoopSpeed(12, Math.PI)).toBe(0);
  });

  test('a slow bey falls off a loop and a fast one holds', () => {
    expect(holdsLoop(10, 12, 0)).toBe(false);
    expect(holdsLoop(500, 12, 0)).toBe(true);
  });

  test('teleport is discontinuous and keeps momentum', () => {
    const pos = { x: 0, y: 0, z: 0 };
    teleport(pos, { x: 100, y: 5, z: -20 });
    expect(pos).toEqual({ x: 100, y: 5, z: -20 });
  });

  test('behindTarget is relative to the target heading, not the world', () => {
    const p = behindTarget({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, 10);
    expect(p.z).toBeCloseTo(-10, 6);
    expect(p.x).toBeCloseTo(0, 6);
  });
});

/* ── Phase 10: easing and hazards ────────────────────────────────────────── */
test.describe('easing and hazard telegraphs', () => {
  test('smoothstep is flat at both ends — a loop cannot visibly jerk', () => {
    expect(ease(0, 'smooth')).toBeCloseTo(0, 9);
    expect(ease(1, 'smooth')).toBeCloseTo(1, 9);
    expect(ease(0.5, 'smooth')).toBeCloseTo(0.5, 9);
  });

  test('pingpong folds back so a sweep takes ONE period', () => {
    expect(progress(0,    1, 'pingpong')).toBeCloseTo(0, 6);
    expect(progress(1,    1, 'pingpong')).toBeCloseTo(1, 6);
    expect(progress(1.5,  1, 'pingpong')).toBeCloseTo(0.5, 6);
    expect(progress(2,    1, 'pingpong')).toBeCloseTo(0, 6);
  });

  test('once clamps instead of wrapping', () => {
    expect(progress(5, 1, 'once')).toBe(1);
    expect(animate(5, 1, 'once', 'linear')).toBe(1);
  });

  test('A HAZARD TELEGRAPHS: it warns before it can hurt you', () => {
    const cycle = { windup: 0.5, strike: 0.2, recover: 0.3, rest: 1.0 };
    expect(hazardFrame(0.1, cycle).phase).toBe('windup');
    expect(hazardFrame(0.1, cycle).dangerous).toBe(false);
    expect(hazardFrame(0.6, cycle).dangerous).toBe(true);
    expect(hazardFrame(0.9, cycle).phase).toBe('recover');
    expect(hazardFrame(1.5, cycle).phase).toBe('rest');
  });

  test('only the strike phase is dangerous', () => {
    const cycle = { windup: 0.5, strike: 0.2, recover: 0.3, rest: 1.0 };
    let dangerous = 0;
    for (let t = 0; t < 2; t += 0.01) if (hazardFrame(t, cycle).dangerous) dangerous++;
    expect(dangerous).toBeGreaterThan(10);
    expect(dangerous).toBeLessThan(30);
  });
});

/* ── Phase 10c: projectiles ──────────────────────────────────────────────── */
test.describe('projectiles', () => {
  const mk = (over: Partial<Projectile> = {}): Projectile => ({
    id: 'p', ownerId: 'a', team: 'red',
    pos: { x: 0, y: 0, z: 0 }, vel: { x: 100, y: 0, z: 0 },
    radius: 2, mass: 5, lifetime: { kind: 'onCollision' }, ageMs: 0, dead: false,
    ...over,
  });
  const target = (over: Partial<ProjectileTarget> = {}): ProjectileTarget => ({
    id: 'b', team: 'blue', pos: { x: 0, y: 0, z: 0 },
    radius: 5, contactLow: -5, contactHigh: 5, ...over,
  });

  test('a bullet never hits its owner', () => {
    expect(canHit(mk(), target({ id: 'a' }))).toBe(false);
  });

  test('friendly fire is off within a team', () => {
    expect(canHit(mk(), target({ team: 'red' }))).toBe(false);
    expect(canHit(mk(), target({ team: 'blue' }))).toBe(true);
  });

  test('a low shot passes UNDER a tall bey', () => {
    const p = mk({ pos: { x: 0, y: -40, z: 0 } });
    expect(projectileHit(p, target())).toBeNull();
  });

  test('a hit reports an impulse and despawns an onCollision bullet', () => {
    const p = mk();
    const h = projectileHit(p, target())!;
    expect(h.impulse).toBeCloseTo(500, 4);
    expect(p.dead).toBe(true);
  });

  test('a persistent bullet survives its hit — the orbiting satellite', () => {
    const p = mk({ lifetime: { kind: 'persistent' } });
    expect(projectileHit(p, target())).not.toBeNull();
    expect(p.dead).toBe(false);
  });

  test('a timed bullet expires on its own', () => {
    const p = mk({ lifetime: { kind: 'timed', lifetimeMs: 100 } });
    expect(stepProjectile(p, 50)).toBe(true);
    expect(stepProjectile(p, 60)).toBe(false);
  });

  test('lead aim shoots ahead of a moving target', () => {
    const d = leadAim({ x: 0, y: 0, z: 0 }, { x: 100, y: 0, z: 0 }, { x: 0, y: 0, z: 100 }, 200);
    expect(d.z).toBeGreaterThan(0);
  });
});

/* ── Phase 11: assembly ──────────────────────────────────────────────────── */
test.describe('slot-ordered assembly', () => {
  const part = (over: Partial<AssemblyPart>): AssemblyPart => ({
    id: 'p', name: 'p', slot: 'weight_disk', weight: 10,
    innerRadius: 0.5, outerRadius: 2.5, height: 1, ...over,
  });

  test('parts stack bottom-up regardless of input order', () => {
    const s = sortBySlot([
      part({ id: 'chip', slot: 'bit_chip' }),
      part({ id: 'base', slot: 'blade_base' }),
      part({ id: 'wd',   slot: 'weight_disk' }),
    ]);
    expect(s.map(p => p.id)).toEqual(['base', 'wd', 'chip']);
  });

  test('THE WEIGHT INVARIANT IS AN ERROR, not a warning', () => {
    const r = assemble([
      part({ id: 'base', slot: 'blade_base', tipType: 'hard_flat' }),
      part({ id: 'wd', weight: 10, sectorWeights: [3, 3, 3] }),  // sums to 9
    ]);
    expect(r.issues.some(i => i.severity === 'error' && i.partId === 'wd')).toBe(true);
    expect(isLegal(r)).toBe(false);
  });

  test('an assembly with no blade base is illegal — nothing touches the floor', () => {
    const r = assemble([part({ id: 'wd' })]);
    expect(isLegal(r)).toBe(false);
  });

  test('mass, inertia, CoM and reach all come out of the stack', () => {
    const r = assemble([
      part({ id: 'base', slot: 'blade_base', weight: 8, outerRadius: 1.5, height: 2, tipType: 'rubber_flat' }),
      part({ id: 'wd', slot: 'weight_disk', weight: 15, outerRadius: 2.5, height: 1 }),
      part({ id: 'ar', slot: 'attack_ring', weight: 7, outerRadius: 3.0, height: 1 }),
    ]);
    expect(r.mass).toBe(30);
    expect(r.inertiaSpin).toBeGreaterThan(0);
    expect(r.comY).toBeGreaterThan(0);
    expect(r.radius).toBe(3.0);
    expect(r.height).toBe(4);
    expect(r.tipType).toBe('rubber_flat');
    expect(isLegal(r)).toBe(true);
  });

  test('each part keeps its own offset instead of being flattened', () => {
    const r = assemble([
      part({ id: 'base', slot: 'blade_base', height: 2, tipType: 'ball' }),
      part({ id: 'wd', height: 3 }),
    ]);
    expect(r.stack[0].baseY).toBe(0);
    expect(r.stack[1].baseY).toBe(2);
  });
});

/* ── Phase 11b: launch ───────────────────────────────────────────────────── */
test.describe('two-stage launch', () => {
  test('the second bar only opens once the first is full', () => {
    const L = LAUNCHERS.ripcord;
    let s = IDLE_LAUNCH;
    s = stepCharge(s, L, true, 0.2);
    expect(s.phase).toBe('charging');
    expect(s.boost).toBe(0);
    for (let i = 0; i < 20; i++) s = stepCharge(s, L, true, 0.1);
    expect(s.phase).toBe('boosting');
    expect(s.boost).toBeGreaterThan(0);
  });

  test('releasing early still launches, just weaker', () => {
    const L = LAUNCHERS.ripcord;
    const weak = launchOmega({ phase: 'charging', charge: 0.2, boost: 0 }, L, 1);
    const full = launchOmega({ phase: 'boosting', charge: 1, boost: 1 }, L, 1);
    expect(full).toBeGreaterThan(weak);
  });

  test('BLADER SKILL CAPS THE BOOST, not the base launch', () => {
    const L = LAUNCHERS.ripcord;
    const s = { phase: 'boosting' as const, charge: 1, boost: 1 };
    expect(launchOmega(s, L, 1)).toBeGreaterThan(launchOmega(s, L, 0));
    // With no boost earned, skill changes nothing.
    const noBoost = { phase: 'charging' as const, charge: 1, boost: 0 };
    expect(launchOmega(noBoost, L, 0)).toBeCloseTo(launchOmega(noBoost, L, 1), 6);
  });

  test('a string launcher reaches far more than a winder', () => {
    expect(LAUNCHERS.string.maxOmega).toBeGreaterThan(LAUNCHERS.winder.maxOmega * 3);
  });
});

/* ── Phase 11c + 14c: field forces ───────────────────────────────────────── */
test.describe('field forces', () => {
  const field = (over: Partial<FieldEffect> = {}): FieldEffect => ({
    id: 'f', kind: 'attract', centre: { x: 0, y: 0, z: 0 },
    radius: 100, coreRadius: 20, strength: 500, swirl: 0.5, ...over,
  });

  test('a Rankine profile rises inside the core and falls outside', () => {
    expect(rankineProfile(0, 20, 100)).toBeCloseTo(0, 6);
    expect(rankineProfile(20, 20, 100)).toBeCloseTo(1, 6);
    expect(rankineProfile(40, 20, 100)).toBeCloseTo(0.5, 6);
    expect(rankineProfile(200, 20, 100)).toBe(0);
  });

  test('attract pulls in and repel pushes out — the thing gravity_pull cannot do', () => {
    const at = fieldAccel(field({ kind: 'attract' }), { x: 50, y: 0, z: 0 });
    const re = fieldAccel(field({ kind: 'repel' }),   { x: 50, y: 0, z: 0 });
    expect(at.x).toBeLessThan(0);
    expect(re.x).toBeGreaterThan(0);
  });

  test('A VORTEX HAS A TANGENTIAL COMPONENT — the other thing it cannot do', () => {
    const v = fieldAccel(field({ kind: 'vortex', swirl: 0.8 }), { x: 50, y: 0, z: 0 });
    expect(Math.abs(v.z)).toBeGreaterThan(Math.abs(v.x));
  });

  test('a pure spin field has no radial pull at all', () => {
    const s = fieldAccel(field({ kind: 'spin' }), { x: 50, y: 0, z: 0 });
    expect(s.x).toBeCloseTo(0, 6);
    expect(Math.abs(s.z)).toBeGreaterThan(0);
  });

  test('stacked fields are capped so a pile-up cannot fling a bey to infinity', () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      field({ id: `f${i}`, kind: 'repel', strength: 5000 }));
    const a = totalFieldAccel(many, { x: 30, y: 0, z: 0 });
    expect(Math.hypot(a.x, a.z)).toBeLessThanOrEqual(FIELD_ACCEL_CAP + 1e-6);
  });

  test('nothing happens at the exact centre rather than exploding', () => {
    const a = fieldAccel(field(), { x: 0, y: 0, z: 0 });
    expect(Number.isFinite(a.x) && Number.isFinite(a.z)).toBe(true);
  });

  test('MAGNACORE: like poles repel, opposite attract, none does nothing', () => {
    const A = { x: 0, y: 0, z: 0 }, B = { x: 20, y: 0, z: 0 };
    expect(magneticAccel(A, 'north', B, 'north', 1e5).x).toBeLessThan(0);
    expect(magneticAccel(A, 'north', B, 'south', 1e5).x).toBeGreaterThan(0);
    expect(magneticAccel(A, 'none',  B, 'south', 1e5).x).toBe(0);
  });

  test('a south core is pushed off the stadium magnets, a north core drawn in', () => {
    const pos = { x: 40, y: 0, z: 0 }, c = { x: 0, y: 0, z: 0 };
    expect(stadiumMagnetAccel(pos, c, 'south', 300, 100).x).toBeGreaterThan(0);
    expect(stadiumMagnetAccel(pos, c, 'north', 300, 100).x).toBeLessThan(0);
  });
});

/* ── Phase 15: combos, forceState, QTE ───────────────────────────────────── */
test.describe('combo gate chain', () => {
  const dash: ComboDef = {
    id: 'dash', name: 'Quick Dash', sequence: ['L', 'L', 'J'],
    cost: 0, cooldownMs: 500, windowMs: 400, allowedTypes: [],
    damageMultiplier: 1, lockMs: 0,
  };
  const ctx = (over = {}) => ({
    beyType: 'attack' as const, power: 100, nowMs: 1000,
    lastFired: new Map<string, number>(), globalReadyAtMs: 0, ...over,
  });

  test('the right sequence inside the window fires', () => {
    const d = new ComboDetector(); d.attach([dash]);
    d.press('L', 900); d.press('L', 1000); d.press('J', 1100);
    expect(d.tryFire(ctx({ nowMs: 1150 })).combo?.id).toBe('dash');
  });

  test('A FOURTH KEY INVALIDATES THE MATCH', () => {
    const d = new ComboDetector(); d.attach([dash]);
    d.press('L', 900); d.press('L', 1000); d.press('J', 1100); d.press('K', 1150);
    expect(d.tryFire(ctx({ nowMs: 1180 })).combo).toBeNull();
  });

  test('too slow between keys and the window has expired', () => {
    const d = new ComboDetector(); d.attach([dash]);
    d.press('L', 100); d.press('L', 200); d.press('J', 900);
    expect(d.tryFire(ctx({ nowMs: 950 })).combo).toBeNull();
  });

  test('cost, type and cooldown each gate independently', () => {
    const costly: ComboDef = { ...dash, id: 'c', cost: 35, allowedTypes: ['stamina'] };
    const d = new ComboDetector(); d.attach([costly]);
    const press = () => { d.press('L', 900); d.press('L', 1000); d.press('J', 1100); };

    press();
    expect(d.tryFire(ctx({ nowMs: 1150, beyType: 'attack' })).reject).toBe('type_disallowed');
    press();
    expect(d.tryFire(ctx({ nowMs: 1150, beyType: 'stamina', power: 5 })).reject).toBe('insufficient_power');
    press();
    expect(d.tryFire(ctx({
      nowMs: 1150, beyType: 'stamina',
      lastFired: new Map([['c', 1000]]),
    })).reject).toBe('on_cooldown');
  });

  test('THE CEILINGS ARE HARD — a combo cannot exceed them', () => {
    const greedy = clampComboDef({ ...dash, damageMultiplier: 99, lockMs: 9999 });
    expect(greedy.damageMultiplier).toBe(COMBO_MAX_DAMAGE_MULT);
    expect(greedy.lockMs).toBe(300);
  });

  test('only three combos may be attached', () => {
    const d = new ComboDetector();
    d.attach([dash, { ...dash, id: '2' }, { ...dash, id: '3' }, { ...dash, id: '4' }]);
    expect(d.attachedCombos()).toHaveLength(3);
  });

  test('a QTE counters only inside its window and only with the right key', () => {
    const w = { openMs: 1000, widthMs: 100, token: 'K' };
    expect(qteSucceeds(w, { token: 'K', atMs: 1050 })).toBe(true);
    expect(qteSucceeds(w, { token: 'K', atMs: 1200 })).toBe(false);
    expect(qteSucceeds(w, { token: 'J', atMs: 1050 })).toBe(false);
  });
});

/* ── Phase 14/16: gauges and the [M] layer ───────────────────────────────── */
test.describe('gauges and BeySpirit', () => {
  test('ONLY the Active gauge fills with time', () => {
    const g = chargeGauges({ active: 0, xtreme: 0 }, 1);
    expect(g.active).toBeGreaterThan(0);
    expect(g.xtreme).toBe(0);
  });

  test('the Xtreme gauge is EARNED through attacks and counters', () => {
    let g = EMPTY_GAUGES;
    g = awardXtreme(g, 'hit');
    g = awardXtreme(g, 'counter');
    expect(g.xtreme).toBeGreaterThan(0);
  });

  test('a 150-cost special is payable from Xtreme but never from Active', () => {
    // This is the contradiction the two-gauge split resolves.
    let g = EMPTY_GAUGES;
    for (let i = 0; i < 20; i++) g = awardXtreme(g, 'counter');
    expect(canPaySpecial(g, 150)).toBe(true);
    expect(paySpecial(g, 150).xtreme).toBe(0);
  });

  test('[M] AMPLIFIES THE PHYSICAL VALUE AND LEAVES IT RECOVERABLE', () => {
    /* The plan's acceptance test: the same move with [M] off must produce
       the physical figure. Russian Bear Hook: 5.99 -> 71.9 at 12.0x. */
    expect(applyAmplification(5.99, 12.0, false)).toBeCloseTo(5.99, 6);
    expect(applyAmplification(5.99, 12.0, true)).toBeCloseTo(71.88, 2);
  });

  test('juice tiers scale with impulse and small hits get no shake', () => {
    expect(tierForImpulse(10)).toBe('small');
    expect(tierForImpulse(5000)).toBe('medium');
    expect(tierForImpulse(50000)).toBe('large');
  });
});

/* ── Phase 14b: part mutation ────────────────────────────────────────────── */
test.describe('runtime part mutation', () => {
  /* `makeLivePart` rather than object literals: the struct gained `gimmick`,
     `gimmickStrength` and `baseOuterRadius` when the registry landed, and the
     last of those must always equal `outerRadius` at construction or the
     first retraction resizes the part to the wrong figure. The factory is the
     only place that invariant is guaranteed. */
  const parts = (): LivePart[] => ([
    makeLivePart({ id: 'base', mass: 8, innerRadius: 0, outerRadius: 1.5, height: 2, baseY: 0 }),
    makeLivePart({ id: 'wd', mass: 15, innerRadius: 0.5, outerRadius: 2.5, height: 1, baseY: 2 }),
    makeLivePart({ id: 'armor', mass: 7, innerRadius: 2, outerRadius: 3.5, height: 1, baseY: 3, detachable: true }),
  ]);
  const spec = makeBeySpec('a');

  test('detaching sheds mass and recomposes inertia', () => {
    const p = parts();
    const before = recompose(spec, p);
    const r = detachPart(spec, p, 'armor');
    expect(r.shedMass).toBe(7);
    expect(r.spec.mass).toBe(23);
    expect(r.spec.inertiaSpin).toBeLessThan(before.inertiaSpin);
  });

  test('SHEDDING TOP-MOUNTED ARMOUR LOWERS THE CENTRE OF MASS', () => {
    // So a detach can be defensive, not only offensive — this falls out of
    // recomposition rather than needing to be special-cased.
    const p = parts();
    const before = recompose(spec, p);
    const after = detachPart(spec, p, 'armor').spec;
    expect(after.comY).toBeLessThan(before.comY);
  });

  test('a non-detachable part stays put', () => {
    const p = parts();
    expect(detachPart(spec, p, 'base').part).toBeNull();
  });

  test('extending a part raises inertia with the square of the radius', () => {
    const p = parts();
    const before = recompose(spec, p).inertiaSpin;
    const after = morphPart(spec, p, 'armor', 7).spec.inertiaSpin;
    expect(after).toBeGreaterThan(before * 1.5);
  });

  test('deployment has hysteresis so it cannot chatter on the threshold', () => {
    expect(shouldDeploy(100, 100, false)).toBe(false);
    expect(shouldDeploy(101, 100, false)).toBe(true);
    expect(shouldDeploy(90, 100, true)).toBe(true);     // stays out
    expect(shouldDeploy(80, 100, true)).toBe(false);    // well below: retracts
  });
});

/* ── Phase 17c/d: surface mutation and wear ──────────────────────────────── */
test.describe('surface mutation and wear', () => {
  const mut = (over: Partial<SurfaceMutation> = {}): SurfaceMutation => ({
    id: 'rain', direction: 'centre_out', arenaRadius: 100, rateCmPerSec: 10,
    extent: 0, mutatedMu: 0.8, mutatedRestitution: 0.2, impassable: false, ...over,
  });

  test('rain grows from the centre out, snow from the rim in', () => {
    const rain = mut({ direction: 'centre_out', extent: 30 });
    const snow = mut({ direction: 'rim_in', extent: 30 });
    expect(isMutated(rain, 10)).toBe(true);
    expect(isMutated(rain, 90)).toBe(false);
    expect(isMutated(snow, 10)).toBe(false);
    expect(isMutated(snow, 90)).toBe(true);
  });

  test('it cannot grow past the arena', () => {
    const m = mut({ rateCmPerSec: 1000 });
    stepSurfaceMutation(m, 10);
    expect(m.extent).toBe(100);
  });

  test('the sampled surface changes underfoot', () => {
    const base = { mu: 0.15, restitution: 0.65, impassable: false };
    const m = mut({ extent: 50 });
    expect(sampleSurface(base, [m], 10).mu).toBeCloseTo(0.8, 6);
    expect(sampleSurface(base, [m], 90).mu).toBeCloseTo(0.15, 6);
  });

  test('WEAR RISES BEFORE IT FALLS — rubber wears IN before it wears out', () => {
    expect(wearFrictionFactor({ wear: 0.1, impacts: 1, broken: false })).toBeGreaterThan(1);
    expect(wearFrictionFactor({ wear: 0.9, impacts: 9, broken: false })).toBeLessThan(1);
  });

  test('a part accumulates damage and eventually breaks', () => {
    let w = FRESH;
    for (let i = 0; i < 12; i++) w = applyWear(w, 100, 1000);
    expect(w.broken).toBe(true);
    expect(w.impacts).toBeGreaterThan(0);
  });
});

/* ── Phase 12: storage seam ──────────────────────────────────────────────── */
test.describe('storage adapter', () => {
  test('round-trips a document and lists it', async () => {
    const s = new MemoryStorageAdapter();
    await s.put(COLLECTIONS.arenas, 'a1', { name: 'Bowl' });
    expect(await s.get(COLLECTIONS.arenas, 'a1')).toEqual({ name: 'Bowl' });
    expect(await s.list(COLLECTIONS.arenas)).toHaveLength(1);
    await s.remove(COLLECTIONS.arenas, 'a1');
    expect(await s.get(COLLECTIONS.arenas, 'a1')).toBeNull();
  });

  test('durability is reported, not assumed', () => {
    expect(new MemoryStorageAdapter().durable).toBe(false);
  });
});

/* ── Phase 18b: clones ───────────────────────────────────────────────────── */
test.describe('clones and decoys', () => {
  test('an afterimage fades and then expires', () => {
    const c = makeClone({ id: 'c', ownerId: 'a', lifetimeMs: 100 });
    const trail = new PositionTrail();
    trail.push({ x: 0, y: 0, z: 0 });
    expect(stepClone(c, 50, { x: 0, y: 0, z: 0 }, trail.get())).toBe(true);
    expect(c.opacity).toBeLessThan(1);
    expect(stepClone(c, 60, { x: 0, y: 0, z: 0 }, trail.get())).toBe(false);
  });

  test('an orbit clone circles its owner', () => {
    const c = makeClone({ id: 'c', ownerId: 'a', kind: 'orbit', lifetimeMs: 10_000 });
    stepClone(c, 100, { x: 0, y: 0, z: 0 }, []);
    expect(Math.hypot(c.pos.x, c.pos.z)).toBeCloseTo(c.orbitRadius, 4);
  });

  test('ONLY A DECEIVING CLONE APPEARS TO AN AI', () => {
    const real = [{ id: 'bey', pos: { x: 0, y: 0, z: 0 } }];
    const honest = makeClone({ id: 'c1', ownerId: 'a', deceivesAi: false });
    const decoy  = makeClone({ id: 'c2', ownerId: 'a', deceivesAi: true });
    const seen = aiTargets(real, [honest, decoy]);
    expect(seen.map(t => t.id)).toEqual(['bey', 'c2']);
    expect(seen.find(t => t.id === 'c2')!.real).toBe(false);
  });
});

/* ── Phase 10b: the roster ───────────────────────────────────────────────── */
test.describe('BeySystem roster', () => {
  const flat = () => ({ surfaceY: 0, surfaceMu: 0.15, gravityScale: 1, supported: true });

  test('MORE THAN ONE BEY CAN EXIST — the thing that was impossible', () => {
    const s = new BeySystem();
    s.add(makeBeySpec('a'), 'red');
    s.add(makeBeySpec('b'), 'blue');
    expect(s.size).toBe(2);
    expect(s.living()).toHaveLength(2);
  });

  test('two beys placed on top of each other are pushed apart', () => {
    const s = new BeySystem();
    s.add(makeBeySpec('a'), 'red',  { pos: { x: -3, y: 10, z: 0 }, vel: { x: 100, y: 0, z: 0 } });
    s.add(makeBeySpec('b'), 'blue', { pos: { x: 3, y: 10, z: 0 }, vel: { x: 0, y: 0, z: 0 } });
    const r = s.step(1 / 60, new Map(), flat);
    expect(r.contacts.length).toBeGreaterThan(0);
  });

  test('A MATCH CAN END: ring-out is detected', () => {
    const s = new BeySystem();
    s.add(makeBeySpec('a'), null, { pos: { x: 0, y: RING_OUT_Y - 10, z: 0 } });
    const r = s.step(1 / 60, new Map(), () => ({ ...flat(), supported: false }));
    expect(r.defeats.map(d => d.cause)).toContain('ring_out');
    expect(s.living()).toHaveLength(0);
  });

  test('health reaching zero is finally checked', () => {
    const s = new BeySystem();
    const e = s.add(makeBeySpec('a'));
    e.state.health = 0;
    expect(s.step(1 / 60, new Map(), flat).defeats[0].cause).toBe('health');
  });

  test('a snapshot round-trips, which is what makes replay possible', () => {
    const s = new BeySystem();
    s.add(makeBeySpec('a'), null, { pos: { x: 5, y: 2, z: 1 } });
    const snap = s.snapshot();
    s.get('a')!.state.pos.x = 999;
    s.restore(snap);
    expect(s.get('a')!.state.pos.x).toBe(5);
  });

  test('DETERMINISM: the same roster and inputs replay identically', () => {
    const run = () => {
      const s = new BeySystem();
      s.add(makeBeySpec('a'), 'red',  { pos: { x: -4, y: 10, z: 0 }, vel: { x: 60, y: 0, z: 0 }, omega: 300 });
      s.add(makeBeySpec('b'), 'blue', { pos: { x: 4, y: 10, z: 0 }, omega: 300 });
      for (let i = 0; i < 120; i++) s.step(1 / 60, new Map(), flat);
      return JSON.stringify(s.snapshot());
    };
    expect(run()).toBe(run());
  });
});

/* ── Input boundary ──────────────────────────────────────────────────────── */
test.describe('InputSystem', () => {
  test('an unbound entity gets an empty frame rather than undefined', () => {
    expect(new InputSystem().frameFor('nobody')).toEqual(EMPTY_FRAME);
  });

  test('TWO LOCAL PLAYERS CAN BOTH MOVE — impossible with the singleton', () => {
    const sys = new InputSystem();
    const p1 = new ScriptedInputSource('p1');
    const p2 = new ScriptedInputSource('p2');
    sys.bind('a', p1); sys.bind('b', p2);
    p1.set({ moveX: 1 }); p2.set({ moveZ: -1 });
    const frames = sys.gather(1 / 60);
    expect(frames.get('a')!.moveX).toBe(1);
    expect(frames.get('b')!.moveZ).toBe(-1);
  });

  test('a scripted source is indistinguishable from any other', () => {
    // The property the plan's acceptance test needs: swap a human for an AI
    // or a replay without the consumer noticing.
    const src = new ScriptedInputSource('x');
    src.set({ jump: true });
    expect(src.sample().jump).toBe(true);
  });
});

/* ── Match flow ──────────────────────────────────────────────────────────── */
test.describe('MatchSystem', () => {
  test('a burst scores more than outspinning', () => {
    expect(FINISH_POINTS.burst).toBeGreaterThan(FINISH_POINTS.sleep_out);
  });

  test('the last bey standing takes the round', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'));
    beys.add(makeBeySpec('b'));
    const m = new MatchSystem(beys);
    m.beginRound(0);
    beys.get('b')!.alive = false;
    const r = m.update(1000, [{ id: 'b', cause: 'ring_out' }])!;
    expect(r.winner).toBe('a');
    expect(r.kind).toBe('ring_out');
  });

  test('A SIMULTANEOUS KNOCKOUT IS A DRAW, not an arbitrary winner', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'));
    beys.add(makeBeySpec('b'));
    const m = new MatchSystem(beys);
    m.beginRound(0);
    beys.get('a')!.alive = false;
    beys.get('b')!.alive = false;
    const r = m.update(1000, [{ id: 'a', cause: 'ring_out' }, { id: 'b', cause: 'ring_out' }])!;
    expect(r.kind).toBe('draw');
    expect(r.winner).toBeNull();
  });

  test('A ROUND CANNOT END TWICE — no phantom rounds in the finish gap', () => {
    /* FOUND LIVE, not reasoned about. Forcing the player out every round
       produced `ring_out | draw | ring_out` — a three-round best-of-three
       where the middle round was never launched.

       The gap between a finish and the next launch is about three seconds of
       banner and camera, and the simulation runs through all of it. So the
       round-one WINNER keeps spinning down and eventually crosses its own
       sleep-out threshold, while the loser is still dead. Two dead fighters,
       no living ones, and `update` scored it as a draw.

       In a best-of-three a phantom round is not cosmetic: two of them can
       decide the match before the third bey is even launched. */
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'));
    beys.add(makeBeySpec('b'));
    const m = new MatchSystem(beys);
    m.beginRound(0);

    beys.get('b')!.alive = false;
    expect(m.update(1000, [{ id: 'b', cause: 'ring_out' }])!.winner).toBe('a');

    /* The winner now spins down during the banner and dies too. This is the
       exact tick that used to invent a round. */
    beys.get('a')!.alive = false;
    expect(m.update(1500, [{ id: 'a', cause: 'sleep_out' }])).toBeNull();
    expect(m.history().length).toBe(1);
    expect(m.roundsWonBy('a')).toBe(1);
    expect(m.roundsWonBy('b')).toBe(0);

    /* And the gate re-opens for the round that IS launched, rather than
       latching shut — which would be the opposite bug and just as silent. */
    m.beginRound(2000);
    beys.get('b')!.alive = false;
    const r2 = m.update(3000, [{ id: 'b', cause: 'ring_out' }]);
    expect(r2).not.toBeNull();
    expect(r2!.winner).toBe('a');
    expect(m.history().length).toBe(2);
  });

  test('a timeout is decided on remaining spin', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'), null, { omega: 100 });
    beys.add(makeBeySpec('b'), null, { omega: 400 });
    const m = new MatchSystem(beys, { roundsToWin: 2, roundLimitMs: 100 });
    m.beginRound(0);
    const r = m.update(200, [])!;
    expect(r.kind).toBe('timeout');
    expect(r.winner).toBe('b');
  });

  /* ── The player is not a roster entity ────────────────────────────────── */

  /** A stand-in for what `SpawnManager` provides through the screen. */
  const player = (over: Partial<{ alive: boolean; spin: number }> = {}) => {
    const st = { alive: over.alive ?? true, spin: over.spin ?? 300, resets: 0 };
    return {
      p: {
        id: 'player',
        isAlive: () => st.alive,
        spinMagnitude: () => st.spin,
        resetForRound: () => { st.alive = true; st.resets++; },
      },
      st,
    };
  };

  test('THE PLAYER CAN WIN — beating the lone opponent is not a draw', () => {
    /* The bug this exists for: the player is owned by SpawnManager, not by
       BeySystem, so a 1v1 roster held exactly ONE bey. Killing it emptied
       `living()`, which took the simultaneous-knockout branch and reported a
       DRAW worth zero points for a round the player had just won.

       Disable `addParticipant` below and this test fails with kind 'draw'. */
    const beys = new BeySystem();
    beys.add(makeBeySpec('opponent-1'));
    const m = new MatchSystem(beys);
    const { p } = player();
    m.addParticipant(p);
    m.beginRound(0);

    beys.get('opponent-1')!.alive = false;
    const r = m.update(1000, [{ id: 'opponent-1', cause: 'burst' }])!;

    expect(r.winner).toBe('player');
    expect(r.loser).toBe('opponent-1');
    /* And the cause survives, so a burst is worth its 2 points. The call site
       used to hardcode `sleep_out`, quietly halving every burst finish. */
    expect(r.kind).toBe('burst');
    expect(m.scoreOf('player')).toBe(FINISH_POINTS.burst);
  });

  test('THE PLAYER CAN LOSE — its defeat is scored like any other', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('opponent-1'));
    const m = new MatchSystem(beys);
    const { p, st } = player();
    m.addParticipant(p);
    m.beginRound(0);

    st.alive = false;
    const r = m.update(1000, [{ id: 'player', cause: 'ring_out' }])!;
    expect(r.winner).toBe('opponent-1');
    expect(r.loser).toBe('player');
    expect(r.kind).toBe('ring_out');
  });

  test('a new round resets the player too, not just the roster', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('opponent-1'));
    const m = new MatchSystem(beys);
    const { p, st } = player({ alive: false });
    m.addParticipant(p);

    m.beginRound(0);
    expect(st.alive).toBe(true);
    expect(st.resets).toBe(1);
  });

  test('the timeout tiebreak considers the player’s spin', () => {
    /* Spin lives on `BeyState` for a roster bey and on `SpawnManager`'s rpm
       for the player; the tiebreak has to read both or it silently ignores
       whichever fighter is winning on stamina. */
    const beys = new BeySystem();
    beys.add(makeBeySpec('opponent-1'), null, { omega: 100 });
    const m = new MatchSystem(beys, { roundsToWin: 2, roundLimitMs: 100 });
    const { p } = player({ spin: 400 });
    m.addParticipant(p);
    m.beginRound(0);

    const r = m.update(200, [])!;
    expect(r.kind).toBe('timeout');
    expect(r.winner).toBe('player');
  });

  test('ONE BURST DOES NOT WIN A BEST-OF-THREE', () => {
    /* The match used to end on accumulated FINISH_POINTS, and a burst is
       worth 2 against `pointsToWin: 2` — so the Burst era's signature finish
       was silently a one-round match win. It ends on ROUNDS now; points
       remain the score. */
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'));
    beys.add(makeBeySpec('b'));
    const m = new MatchSystem(beys, { roundsToWin: 2, roundLimitMs: 0 });

    m.beginRound(0);
    beys.get('b')!.alive = false;
    m.update(100, [{ id: 'b', cause: 'burst' }]);
    expect(m.isOver(), 'one burst must NOT take the match').toBe(false);
    expect(m.scoreOf('a'), 'but it is still worth 2 points').toBe(2);
    expect(m.roundsWonBy('a')).toBe(1);

    m.beginRound(200);
    beys.get('b')!.alive = false;
    m.update(300, [{ id: 'b', cause: 'ring_out' }]);
    expect(m.isOver()).toBe(true);
    expect(m.matchWinner()).toBe('a');
    expect(m.roundsWonBy('a')).toBe(2);
  });

  test('a new round re-launches roster beys, not just their health', () => {
    /* `beginRound` reset health and the ratchet but nothing spatial, so round
       two started with the loser lying where it died. */
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'), null, { pos: { x: 10, y: 20, z: 30 }, omega: 500 });
    const m = new MatchSystem(beys, { roundsToWin: 2, roundLimitMs: 0 });

    const e = beys.get('a')!;
    e.state.pos.x = -999; e.state.pos.y = -999;
    e.state.omega = 0; e.state.tiltDeg = 89;

    m.beginRound(0);
    expect(e.state.pos.x).toBe(10);
    expect(e.state.pos.y).toBe(20);
    expect(e.state.omega).toBe(500);
    expect(e.state.tiltDeg, 'a toppled bey must not respawn toppled').toBe(0);
  });

  test('burst specs are per-bey, not one shared object', () => {
    const beys = new BeySystem();
    beys.add(makeBeySpec('a'));
    beys.add(makeBeySpec('b'));
    beys.get('a')!.burstSpec.toothCount = 99;
    expect(beys.get('b')!.burstSpec.toothCount).not.toBe(99);
  });
});

/* ── Phase 7b: spin exchange ─────────────────────────────────────────────── */
test.describe('spin exchange', () => {
  const body = (spin: number): SpinBody =>
    ({ id: String(spin), spin, inertiaSpin: 390, contactRadius: 2 });

  test('CO-SPIN HAS THE LARGER SLIP — the corpus reason is backwards', () => {
    const co      = contactSlipSpeed(body(300), body(300));
    const counter = contactSlipSpeed(body(300), body(-300));
    expect(co).toBeGreaterThan(counter);
    expect(counter).toBeCloseTo(0, 6);
  });

  test('COUNTER-SPIN IS A TRANSFER: one drains, the other GAINS', () => {
    // The conclusion the corpus reaches, by the mechanism it does not state.
    const a = body(400), b = body(-100);
    const r = applySpinExchange(a, b, 500, 0.17);
    expect(r.counterSpin).toBe(true);
    expect(r.deltaMagA).toBeLessThan(0);
    expect(r.deltaMagB).toBeGreaterThan(0);
  });

  test('CO-SPIN IS A SHARED LOSS: both grind down', () => {
    const a = body(400), b = body(200);
    const r = applySpinExchange(a, b, 500, 0.17);
    expect(r.counterSpin).toBe(false);
    expect(r.deltaMagA).toBeLessThan(0);
    expect(r.deltaMagB).toBeLessThan(0);
  });

  test('friction removes slip but never reverses it', () => {
    const a = body(10), b = body(10);
    applySpinExchange(a, b, 1e9, 10);
    expect(a.spin * b.spin).toBeGreaterThanOrEqual(0);
  });

  test('no slip means no exchange', () => {
    const a = body(300), b = body(-300);
    const r = applySpinExchange(a, b, 500, 0.17);
    expect(r.angularImpulse).toBe(0);
  });

  test('signedSpin and isCounterSpin agree on direction', () => {
    expect(signedSpin(300, 'left')).toBe(-300);
    expect(isCounterSpin(body(300), body(-1))).toBe(true);
    expect(isCounterSpin(body(300), body(0))).toBe(false);
  });
});

/* ── Phase 17b: local multiplayer input ──────────────────────────────────── */
test.describe('local multiplayer input', () => {

  test('THE TWO SCHEMES SHARE NO KEY', () => {
    /* Overlapping schemes do not error — both beys just twitch, which reads
       as a physics bug and is very hard to trace back to the keymap. */
    expect(schemesConflict(SCHEME_P1, SCHEME_P2)).toEqual([]);
  });

  test('a touch zone produces the same frame shape as a keyboard', () => {
    // The property that lets BeySystem not care where input came from.
    const t = new TouchZoneInputSource('p2');
    t.setAxis(0.5, -1);
    t.setButton('jump', true);
    const f = t.sample();
    expect(f.moveX).toBeCloseTo(0.5, 6);
    expect(f.moveZ).toBe(-1);
    expect(f.jump).toBe(true);
    expect(Object.keys(f).sort()).toEqual(Object.keys(EMPTY_FRAME).sort());
  });

  test('a press is reported ONCE, not on every frame it is held', () => {
    // Otherwise one tap matches a combo sequence on several frames running.
    const t = new TouchZoneInputSource('p');
    t.setButton('trigger', true);
    expect(t.sample().pressed).toEqual(['TRIGGER']);
    expect(t.sample().pressed).toEqual([]);
  });

  test('the joystick axis is clamped', () => {
    const t = new TouchZoneInputSource('p');
    t.setAxis(99, -99);
    const f = t.sample();
    expect(f.moveX).toBe(1);
    expect(f.moveZ).toBe(-1);
  });

  test('an AI drives toward its target and is reversed by must_keep_distance', () => {
    const near = new AiInputSource('ai', () => ({
      selfX: 0, selfZ: 0, targetX: 10, targetZ: 0, force: 'none',
    }));
    expect(near.sample().moveX).toBeCloseTo(1, 6);

    const away = new AiInputSource('ai', () => ({
      selfX: 0, selfZ: 0, targetX: 10, targetZ: 0, force: 'must_keep_distance',
    }));
    expect(away.sample().moveX).toBeCloseTo(-1, 6);
  });

  test('must_stay_still means genuinely still', () => {
    const held = new AiInputSource('ai', () => ({
      selfX: 0, selfZ: 0, targetX: 50, targetZ: 50, force: 'must_stay_still',
    }));
    expect(held.sample()).toEqual(EMPTY_FRAME);
  });
});

/* ── Burst — primitive #6's missing half ─────────────────────────────────── */
test.describe('burst', () => {

  test('CS5: holding torque is F_spring x r_tab / tan(theta)', () => {
    // The worked example: 1.0 N, 5 mm, 45 degrees -> 0.005 N*m.
    // In project units 1 N = 1e5 g*cm/s^2 and 5 mm = 0.5 cm, so
    // 1e5 * 0.5 / tan(45) = 5e4 g*cm^2/s^2, which IS 0.005 N*m.
    const t = holdingTorque({ ...DEFAULT_BURST, springForce: 1e5, tabRadius: 0.5, toothAngleDeg: 45 });
    expect(t).toBeCloseTo(5e4, 0);
  });

  test('A SHALLOWER TOOTH HOLDS HARDER — the tangent is why angle beats spring', () => {
    const shallow = holdingTorque({ ...DEFAULT_BURST, toothAngleDeg: 30 });
    const steep   = holdingTorque({ ...DEFAULT_BURST, toothAngleDeg: 60 });
    expect(shallow).toBeGreaterThan(steep);
  });

  test('a weak tap does not click the ratchet at all', () => {
    const st = makeBurstState(DEFAULT_BURST);
    expect(applyBurstImpulse(st, DEFAULT_BURST, 1, 5)).toBe(0);
    expect(st.clicks).toBe(0);
  });

  test('ONE HARD HIT CAN CLICK SEVERAL TEETH — CS5 says so explicitly', () => {
    const st = makeBurstState(DEFAULT_BURST);
    const clicks = applyBurstImpulse(st, DEFAULT_BURST, 5e6, 5);
    expect(clicks).toBeGreaterThan(1);
  });

  test('THE POINT: enough accumulated clicks burst the layer', () => {
    const st = makeBurstState(DEFAULT_BURST);
    for (let i = 0; i < 40 && !st.burst; i++) applyBurstImpulse(st, DEFAULT_BURST, 2e6, 5);
    expect(st.burst).toBe(true);
    expect(burstProgress(st)).toBe(1);
  });

  test('a grippier driver resists burst — the Dash-driver trade', () => {
    const loose = makeBurstState(DEFAULT_BURST);
    const dash  = makeBurstState(DEFAULT_BURST);
    applyBurstImpulse(loose, DEFAULT_BURST, 3e6, 5, 0.10);
    applyBurstImpulse(dash,  DEFAULT_BURST, 3e6, 5, 0.50);
    expect(dash.clicks).toBeLessThanOrEqual(loose.clicks);
  });

  test('more teeth means more hits to pop', () => {
    const few  = { ...DEFAULT_BURST, toothCount: 2 };
    const many = { ...DEFAULT_BURST, toothCount: 20 };
    expect(makeBurstState(many).clicksToBurst)
      .toBeGreaterThan(makeBurstState(few).clicksToBurst);
  });

  test('LAYER INERTIA RESISTS BURST — the term used to cancel out', () => {
    /* `relativeTorque` computed `Δω = J·r / I` then multiplied straight back
       by `I`, so inertia vanished algebraically and a heavy layer burst
       exactly as easily as a light one. Nothing covered the field, which is
       why it went unnoticed. Inertia now lives in `relativeRotation` — how
       far the layer TURNS — which is where it physically belongs, and is the
       real burst-resistance trade: mass on the layer buys safety. */
    const light = { ...DEFAULT_BURST, layerInertia: 40 };
    const heavy = { ...DEFAULT_BURST, layerInertia: 400 };

    const clicksLight = applyBurstImpulse(makeBurstState(light), light, 5e5, 2);
    const clicksHeavy = applyBurstImpulse(makeBurstState(heavy), heavy, 5e5, 2);
    expect(clicksHeavy).toBeLessThan(clicksLight);
  });

  test('relativeTorque is inertia-INDEPENDENT, and that is deliberate', () => {
    /* Angular impulse over the contact window is a torque; it does not care
       how heavy the thing being turned is. Asserted explicitly so a future
       edit cannot quietly reintroduce the cancellation by "restoring" I. */
    const a = relativeTorque(1e5, 2, { ...DEFAULT_BURST, layerInertia: 40 });
    const b = relativeTorque(1e5, 2, { ...DEFAULT_BURST, layerInertia: 4000 });
    expect(a).toBeCloseTo(b, 6);
    expect(a).toBeGreaterThan(0);
  });

  test('relativeRotation falls as inertia rises', () => {
    const light = relativeRotation(1e5, 2, { ...DEFAULT_BURST, layerInertia: 100 });
    const heavy = relativeRotation(1e5, 2, { ...DEFAULT_BURST, layerInertia: 1000 });
    expect(heavy).toBeCloseTo(light / 10, 6);
  });

  test('a burst layer cannot burst twice', () => {
    const st = makeBurstState(DEFAULT_BURST);
    st.burst = true;
    expect(applyBurstImpulse(st, DEFAULT_BURST, 1e9, 5)).toBe(0);
  });

  test('CS5 SCORING: a burst is worth MORE than a ring-out', () => {
    /* "scoring the opponent two points instead of the usual one for
       ring-out". Both were 2 before reading the case, which removed the
       entire reason to build for burst resistance. */
    expect(FINISH_POINTS.burst).toBe(2);
    expect(FINISH_POINTS.ring_out).toBe(1);
    expect(FINISH_POINTS.burst).toBeGreaterThan(FINISH_POINTS.ring_out);
  });

  test('burst outranks the other finishes in the roster', () => {
    const sys = new BeySystem();
    const e = sys.add(makeBeySpec('a'));
    e.burst.burst = true;
    e.state.health = 0;                       // both conditions true at once
    const r = sys.step(1 / 60, new Map(),
      () => ({ surfaceY: 0, surfaceMu: 0.15, gravityScale: 1, supported: true }));
    expect(r.defeats[0].cause).toBe('burst');
  });
});

/* ── CS1 Cases 8-10: a hit must be able to tilt a bey ────────────────────── */
test.describe('destabilisation from contact', () => {

  test('THE POINT: an off-centre hit tilts the bey', () => {
    // Before this, a bey could be struck anywhere and stand perfectly
    // upright — so upper attacks did nothing and Cases 8-10 were unreachable.
    const d = tiltFromContact(5000, 8, 390, 400, 0);
    expect(d).toBeGreaterThan(0);
  });

  test('CS1 Case 10: a HIGHER hit tilts more — h is the lever arm', () => {
    const low  = tiltFromContact(5000, 2,  390, 400, 0);
    const high = tiltFromContact(5000, 10, 390, 400, 0);
    expect(high).toBeCloseTo(low * 5, 6);
  });

  test('GYROSCOPIC STIFFNESS: a fast bey shrugs off what topples a dying one', () => {
    /* ω is in the denominator, so this is not a special case anybody has to
       write — "the bey is vulnerable now" simply follows from the equation. */
    const fast = tiltFromContact(5000, 8, 390, 600, 0);
    const slow = tiltFromContact(5000, 8, 390, 60, 0);
    expect(slow).toBeCloseTo(fast * 10, 5);
  });

  test('a hit on an already-tilted bey does less — the cos theta term', () => {
    const upright = tiltFromContact(5000, 8, 390, 400, 0);
    const leaning = tiltFromContact(5000, 8, 390, 400, Math.PI / 3);
    expect(leaning).toBeLessThan(upright);
    expect(leaning).toBeCloseTo(upright * Math.cos(Math.PI / 3), 6);
  });

  test('a stopped top is simply knocked over rather than dividing by zero', () => {
    expect(tiltFromContact(5000, 8, 390, 0, 0)).toBeCloseTo(Math.PI / 2, 6);
  });

  test('a heavier flywheel resists being tilted', () => {
    const light = tiltFromContact(5000, 8, 100, 400, 0);
    const heavy = tiltFromContact(5000, 8, 800, 400, 0);
    expect(heavy).toBeLessThan(light);
  });
});

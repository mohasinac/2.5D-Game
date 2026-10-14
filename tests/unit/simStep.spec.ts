import { test, expect } from '@playwright/test';
import {
  makeBeySpec, makeBeyState, cloneBeyState, vec3,
} from '../../src/sim/state';
import {
  applyGravity, integrate, clampHorizontalSpeed, applySteering,
  applyJump, tipY, resolveLanding, speedH, GRAVITY, AIR_CONTROL,
} from '../../src/sim/step/integrate';
import { SURFACE_PHYSICS } from '../../src/config/arenaConstants';

/**
 * The pure simulation step.
 *
 * These are the first physics functions that can be exercised without a
 * browser, a renderer, a scene or a mesh — which is the entire point of lifting
 * them out of `SpawnManager`, where physics was gated on whether a mesh existed
 * and every tuning value was a module constant no bey could differ from.
 *
 * They also pin the two properties the architecture depends on: state is plain
 * data that survives a structured clone, and stepping is deterministic.
 */

const spec = () => makeBeySpec('bey-1');

test.describe('sim/state', () => {

  test('state is plain data — it survives structuredClone', () => {
    // The property that makes snapshot/rollback/netcode possible later. A
    // THREE.Vector3 would lose its prototype here and stop being a vector.
    const s = makeBeyState(spec(), { pos: vec3(1, 2, 3) });
    const copy = structuredClone(s);
    expect(copy.pos).toEqual({ x: 1, y: 2, z: 3 });
    expect(copy).toEqual(s);
  });

  test('cloneBeyState deep-copies vectors, not references', () => {
    const s = makeBeyState(spec(), { pos: vec3(1, 2, 3) });
    const c = cloneBeyState(s);
    c.pos.x = 99;
    expect(s.pos.x).toBe(1);
  });

  test('the default spec reproduces the historical constants', () => {
    // Demoting module constants into a spec must change nothing by itself.
    const sp = spec();
    expect(sp.radius).toBe(5);
    expect(sp.tipOffset).toBe(-10);
    expect(sp.frictionGround).toBe(0.88);
    expect(sp.frictionAir).toBe(0.997);
    expect(sp.maxSpeedH).toBe(400);
  });

  test('two beys can now actually differ — the whole point', () => {
    const light = makeBeySpec('a', { mass: 20, maxSpeedH: 600 });
    const heavy = makeBeySpec('b', { mass: 50, maxSpeedH: 300 });
    expect(light.mass).not.toBe(heavy.mass);
    expect(light.maxSpeedH).not.toBe(heavy.maxSpeedH);
  });
});

test.describe('sim/step/integrate', () => {

  test('gravity accelerates an airborne bey downward', () => {
    const s = makeBeyState(spec(), { grounded: false });
    applyGravity(s, 1);
    expect(s.vel.y).toBeCloseTo(GRAVITY, 6);
  });

  test('gravity does NOT act on a grounded bey', () => {
    // The surface resolver holds it; integrating gravity too would fight it.
    const s = makeBeyState(spec(), { grounded: true });
    applyGravity(s, 1);
    expect(s.vel.y).toBe(0);
  });

  test('per-arena gravityScale is respected', () => {
    const s = makeBeyState(spec(), { grounded: false, gravityScale: 1.625 / 9.81 });
    applyGravity(s, 1);
    expect(s.vel.y).toBeCloseTo(GRAVITY * (1.625 / 9.81), 6);
  });

  test('integration advances position by velocity x dt', () => {
    const s = makeBeyState(spec(), { vel: vec3(10, 0, 20), grounded: false });
    integrate(s, spec(), 0.5);
    expect(s.pos.x).toBeCloseTo(5, 6);
    expect(s.pos.z).toBeCloseTo(10, 6);
  });

  test('damping is step-size independent', () => {
    // One 1/30 s step must land where two 1/60 s steps do, or the physics
    // changes whenever the frame rate does.
    const sp = spec();
    const big = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: true });
    integrate(big, sp, 1 / 30);

    const small = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: true });
    integrate(small, sp, 1 / 60);
    integrate(small, sp, 1 / 60);

    expect(small.vel.x).toBeCloseTo(big.vel.x, 6);
  });

  test('grounded damping follows the surface underfoot', () => {
    const sp = spec();
    const onIce  = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: true, surfaceMu: SURFACE_PHYSICS.ice.friction });
    const onSand = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: true, surfaceMu: SURFACE_PHYSICS.sand.friction });
    integrate(onIce, sp, 1 / 60);
    integrate(onSand, sp, 1 / 60);
    expect(onIce.vel.x).toBeGreaterThan(onSand.vel.x);
  });

  test('air damping ignores the surface — nothing is being touched', () => {
    const sp = spec();
    const a = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: false, surfaceMu: 0.04 });
    const b = makeBeyState(sp, { vel: vec3(100, 0, 0), grounded: false, surfaceMu: 0.55 });
    integrate(a, sp, 1 / 60);
    integrate(b, sp, 1 / 60);
    expect(a.vel.x).toBeCloseTo(b.vel.x, 9);
  });

  test('speed clamp limits horizontal motion but not vertical', () => {
    const sp = spec();
    const s = makeBeyState(sp, { vel: vec3(900, 250, 900) });
    clampHorizontalSpeed(s, sp);
    expect(speedH(s)).toBeCloseTo(sp.maxSpeedH, 4);
    expect(s.vel.y).toBe(250);
  });

  test('steering scales with controlAuthority — the player-vs-bey dial', () => {
    const full = makeBeySpec('a', { controlAuthority: 1 });
    const none = makeBeySpec('b', { controlAuthority: 0 });
    const sFull = makeBeyState(full, { grounded: true });
    const sNone = makeBeyState(none, { grounded: true });

    applySteering(sFull, full, vec3(0, 0, 1), 1 / 60);
    applySteering(sNone, none, vec3(0, 0, 1), 1 / 60);

    expect(sFull.vel.z).toBeGreaterThan(0);
    expect(sNone.vel.z).toBe(0);     // the bey ignores the blader entirely
  });

  test('airborne steering is reduced to AIR_CONTROL', () => {
    const sp = spec();
    const ground = makeBeyState(sp, { grounded: true });
    const air    = makeBeyState(sp, { grounded: false });
    applySteering(ground, sp, vec3(0, 0, 1), 1 / 60);
    applySteering(air,    sp, vec3(0, 0, 1), 1 / 60);
    expect(air.vel.z).toBeCloseTo(ground.vel.z * AIR_CONTROL, 6);
  });

  test('a zero steering vector does nothing rather than producing NaN', () => {
    const sp = spec();
    const s = makeBeyState(sp, { grounded: true });
    applySteering(s, sp, vec3(0, 0, 0), 1 / 60);
    expect(Number.isFinite(s.vel.x)).toBe(true);
    expect(s.vel.z).toBe(0);
  });

  test('jump only works from the ground', () => {
    const sp = spec();
    const grounded = makeBeyState(sp, { grounded: true });
    expect(applyJump(grounded, sp)).toBe(true);
    expect(grounded.vel.y).toBe(sp.jumpImpulse);
    expect(grounded.grounded).toBe(false);

    const airborne = makeBeyState(sp, { grounded: false });
    expect(applyJump(airborne, sp)).toBe(false);
  });

  test('tipY accounts for the tip offset, not the group origin', () => {
    const sp = spec();
    const s = makeBeyState(sp, { pos: vec3(0, 100, 0) });
    expect(tipY(s, sp)).toBe(100 + sp.tipOffset);
  });

  test('landing settles the tip exactly onto the surface', () => {
    const sp = spec();
    const s = makeBeyState(sp, { pos: vec3(0, -5, 0), vel: vec3(0, -1, 0) });
    resolveLanding(s, sp, 0, 0.45);
    expect(tipY(s, sp)).toBeCloseTo(0, 6);
  });

  test('a fast landing bounces; a slow one comes to rest', () => {
    const sp = spec();
    const fast = makeBeyState(sp, { pos: vec3(0, -5, 0), vel: vec3(0, -200, 0) });
    expect(resolveLanding(fast, sp, 0, 0.45)).toBe(false);
    expect(fast.vel.y).toBeGreaterThan(0);

    const slow = makeBeyState(sp, { pos: vec3(0, -5, 0), vel: vec3(0, -2, 0) });
    expect(resolveLanding(slow, sp, 0, 0.45)).toBe(true);
    expect(slow.vel.y).toBe(0);
  });

  test('landing above the surface is a no-op', () => {
    const sp = spec();
    const s = makeBeyState(sp, { pos: vec3(0, 500, 0), vel: vec3(0, -10, 0) });
    expect(resolveLanding(s, sp, 0, 0.45)).toBe(false);
    expect(s.pos.y).toBe(500);
  });

  test('DETERMINISM: the same inputs produce byte-identical state', () => {
    // The property that makes replays reproduce and, later, makes client-side
    // prediction correctable. It holds only because nothing here reads the wall
    // clock or an unseeded random.
    const run = () => {
      const sp = spec();
      const s = makeBeyState(sp, { pos: vec3(0, 50, 0), vel: vec3(12, 0, -7) });
      for (let i = 0; i < 240; i++) {
        applySteering(s, sp, vec3(1, 0, 0.5), 1 / 60);
        applyGravity(s, 1 / 60);
        integrate(s, sp, 1 / 60);
        clampHorizontalSpeed(s, sp);
        resolveLanding(s, sp, 0, sp.restitution);
      }
      return s;
    };
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });
});

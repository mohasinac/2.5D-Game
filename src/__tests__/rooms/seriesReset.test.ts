/**
 * SeriesManager.resetBeybladeForNextGame unit tests (Phase R fix).
 * Verifies that all per-game fields — including the isBurst and eliminationType
 * fields added in this session — are correctly cleared between games.
 */
import { describe, it, expect, vi } from "vitest";
import { resetBeybladeForNextGame, type SeriesPhysicsBridge } from "../../shared/rooms/SeriesManager";
import { Beyblade } from "../../rooms/schema/GameState";

function makePhysics(): SeriesPhysicsBridge {
  return {
    setPosition: vi.fn(),
    setLinearVelocity: vi.fn(),
    setAngularVelocity: vi.fn(),
  };
}

function makeBey(overrides: Partial<Beyblade> = {}): Beyblade {
  const b = new Beyblade();
  b.maxSpin = 2000;
  b.maxStamina = 100;
  Object.assign(b, overrides);
  return b;
}

describe("resetBeybladeForNextGame — core state", () => {
  it("sets isActive back to true", () => {
    const b = makeBey({ isActive: false });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.isActive).toBe(true);
  });

  it("clears isRingOut", () => {
    const b = makeBey({ isRingOut: true });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.isRingOut).toBe(false);
  });

  it("clears isBurst (Phase R new field)", () => {
    const b = makeBey({ isBurst: true });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.isBurst).toBe(false);
  });

  it("clears eliminationType back to empty string (Phase R new field)", () => {
    for (const et of ["burst", "ring_out", "spin_out"] as const) {
      const b = makeBey({ eliminationType: et });
      resetBeybladeForNextGame(b, undefined, makePhysics());
      expect(b.eliminationType).toBe("");
    }
  });

  it("resets spin to maxSpin", () => {
    const b = makeBey({ spin: 0, maxSpin: 2000 });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.spin).toBe(2000);
  });

  it("resets power to 0", () => {
    const b = makeBey({ power: 87 });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.power).toBe(0);
  });

  it("clears all buff timers", () => {
    const b = makeBey({ attackBuffTimer: 999, dodgeBuffTimer: 500, defenseBuffTimer: 300 });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.attackBuffTimer).toBe(0);
    expect(b.dodgeBuffTimer).toBe(0);
    expect(b.defenseBuffTimer).toBe(0);
  });

  it("clears airborne state", () => {
    const b = makeBey({ isAirborne: true, airborneTimer: 10, landingLag: 5 });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.isAirborne).toBe(false);
    expect(b.airborneTimer).toBe(0);
    expect(b.landingLag).toBe(0);
  });

  it("clears invulnerability and stun", () => {
    const b = makeBey({ isInvulnerable: true, invulnerabilityTimer: 200, stunTimer: 100 });
    resetBeybladeForNextGame(b, undefined, makePhysics());
    expect(b.isInvulnerable).toBe(false);
    expect(b.invulnerabilityTimer).toBe(0);
    expect(b.stunTimer).toBe(0);
  });
});

describe("resetBeybladeForNextGame — physics bridge", () => {
  it("calls setPosition with spawn coordinates when spawn is provided", () => {
    const b = makeBey();
    const physics = makePhysics();
    const spawn = { x: 100, y: 200 };

    resetBeybladeForNextGame(b, spawn, physics);

    expect(physics.setPosition).toHaveBeenCalledWith(b.id, 100, 200);
    expect(b.x).toBe(100);
    expect(b.y).toBe(200);
  });

  it("calls setLinearVelocity(0,0) on reset", () => {
    const b = makeBey();
    const physics = makePhysics();
    resetBeybladeForNextGame(b, { x: 0, y: 0 }, physics);
    expect(physics.setLinearVelocity).toHaveBeenCalledWith(b.id, 0, 0);
  });

  it("sets angular velocity to +50 for right-spin beys", () => {
    const b = makeBey({ spinDirection: "right" });
    const physics = makePhysics();
    resetBeybladeForNextGame(b, { x: 0, y: 0 }, physics);
    expect(physics.setAngularVelocity).toHaveBeenCalledWith(b.id, 50);
  });

  it("sets angular velocity to -50 for left-spin beys", () => {
    const b = makeBey({ spinDirection: "left" });
    const physics = makePhysics();
    resetBeybladeForNextGame(b, { x: 0, y: 0 }, physics);
    expect(physics.setAngularVelocity).toHaveBeenCalledWith(b.id, -50);
  });

  it("does NOT call physics when spawn is undefined", () => {
    const b = makeBey();
    const physics = makePhysics();
    resetBeybladeForNextGame(b, undefined, physics);
    expect(physics.setPosition).not.toHaveBeenCalled();
    expect(physics.setLinearVelocity).not.toHaveBeenCalled();
    expect(physics.setAngularVelocity).not.toHaveBeenCalled();
  });
});

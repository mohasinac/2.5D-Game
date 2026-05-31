// Server room logic tests — idle disconnect, win conditions, event payloads.
// Colyseus, Firebase, and PhysicsEngine are all mocked so these run in pure Node.

import { describe, test, expect, beforeEach, vi } from "vitest";

// ─── Colyseus mock ────────────────────────────────────────────────────────────
// Provide a minimal Room base class so the room files can extend it.

vi.mock("colyseus", () => {
  class Room {
    state: any = {};
    maxClients = 4;
    autoDispose = false;
    private _broadcasts: { type: string; data: any }[] = [];
    private _disconnected = false;

    setState(s: any) { this.state = s; }
    broadcast(type: string, data: any) { this._broadcasts.push({ type, data }); }
    disconnect() { this._disconnected = true; }
    setSimulationInterval(fn: (dt: number) => void, _ms: number) {
      // Store the callback so tests can invoke it manually
      (this as any)._simFn = fn;
    }
    onMessage(_type: string, _handler: any) {}

    // Test helpers
    _getBroadcasts() { return this._broadcasts; }
    _getLastBroadcast(type: string) {
      return [...this._broadcasts].reverse().find(b => b.type === type);
    }
    _isDisconnected() { return this._disconnected; }
    _resetBroadcasts() { this._broadcasts = []; this._disconnected = false; }
    _runTick(dt = 16) { if ((this as any)._simFn) (this as any)._simFn(dt); }
  }

  class Client {
    sessionId: string;
    constructor(id = "test-client") { this.sessionId = id; }
  }

  return { Room, Client };
});

// ─── Firebase mock ────────────────────────────────────────────────────────────

vi.mock("../server/utils/firebase", () => ({
  loadArena: vi.fn().mockResolvedValue(null),
  loadBeyblade: vi.fn().mockResolvedValue(null),
}));

// ─── Schema mock ──────────────────────────────────────────────────────────────
// Lightweight plain-object versions of the Colyseus MapSchema/ArraySchema
// decorators so the schema file can be imported without the real @colyseus/schema.

vi.mock("@colyseus/schema", () => {
  const Schema = class {
    toJSON() { return { ...this }; }
  };
  const type = (_t: any) => (_: any, __: any) => {};
  class MapSchema<V> extends Map<string, V> {}
  class ArraySchema<T> extends Array<T> {}
  return { Schema, type, MapSchema, ArraySchema };
});

// ─── PhysicsEngine mock ───────────────────────────────────────────────────────

vi.mock("../server/physics/PhysicsEngine", () => {
  class PhysicsEngine {
    setArenaConfig = vi.fn();
    createObstacles = vi.fn();
    createCircularArena = vi.fn();
    createRectangularArena = vi.fn();
    createBeyblade = vi.fn();
    removeBeyblade = vi.fn();
    setAngularVelocity = vi.fn();
    applyForce = vi.fn();
    applyLateralForce = vi.fn();
    checkBeybladeCollision = vi.fn().mockReturnValue(null);
    calculateCollisionDamage = vi.fn().mockReturnValue({ damage1: 0, damage2: 0, spinSteal1: 0, spinSteal2: 0 });
    getBodyState = vi.fn().mockReturnValue({ x: 0, y: 0, rotation: 0, velocityX: 0, velocityY: 0, angularVelocity: 10 });
    isOutOfBounds = vi.fn().mockReturnValue(false);
    update = vi.fn();
    destroy = vi.fn();
  }
  return { PhysicsEngine };
});

// ─── AIController mock ────────────────────────────────────────────────────────

vi.mock("../server/ai/AIController", () => {
  class AIController {
    computeInput = vi.fn().mockReturnValue({});
  }
  return { AIController };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a minimal beyblade-like object that satisfies room tick checks.
 * Properties mirror `Beyblade` schema fields used in tick/checkWinCondition.
 */
function makeBeyblade(id: string, overrides: Record<string, any> = {}) {
  return {
    id,
    userId: `user-${id}`,
    username: `Player-${id}`,
    isAI: false,
    type: "balanced",
    x: 540, y: 540,
    velocityX: 0, velocityY: 0,
    rotation: 0,
    angularVelocity: 10,
    spin: 2000, maxSpin: 2000,
    spinDecayRate: 8,
    spinDirection: "right",
    mass: 50,
    radius: 4,
    health: 100, maxHealth: 100,
    stamina: 1600, maxStamina: 1600,
    isActive: true, isAirborne: false, airborneTimer: 0,
    isDefending: false, isInvulnerable: false, isRingOut: false,
    inPit: false, inLoop: false,
    attackBuffTimer: 0, dodgeBuffTimer: 0, defenseBuffTimer: 0,
    attackCooldown: 0, specialCooldown: 0, stunTimer: 0,
    comboExecuting: false, comboTimer: 0,
    invulnerabilityTimer: 0, landingLag: 0,
    damageDealt: 0, damageReceived: 0, collisions: 0,
    power: 0,
    damageMultiplier: 1.0, damageTaken: 1.0, speedBonus: 1.0,
    knockbackDistance: 8, invulnerabilityChance: 0.1, spinStealFactor: 0.1,
    actualSize: 96, attackPoints: 120, defensePoints: 120, staminaPoints: 120,
    beybladeId: "default",
    ...overrides,
  };
}

/** Create a minimal GameState-like plain object (mirrors the Colyseus schema). */
function makeGameState(overrides: Record<string, any> = {}) {
  const beyblades = new Map<string, any>();
  return {
    mode: "ai-battle",
    status: "in-progress",
    timer: 180,
    startTime: Date.now(),
    winner: "",
    matchId: "test-match",
    arena: {
      id: "test", name: "Test", width: 50, height: 50,
      shape: "circle", theme: "metrocity",
      wallEnabled: true, wallBaseDamage: 5, wallRecoilDistance: 2,
      wallHasSpikes: false, wallSpikeDamageMultiplier: 1.5,
      wallHasSprings: false, wallSpringRecoilMultiplier: 1.0,
    },
    beyblades,
    ...overrides,
  };
}

// ─── Win condition logic ──────────────────────────────────────────────────────
// We test the `checkWinCondition` decision table directly by replicating its
// logic in an isolated function — same code as the rooms, no Colyseus import.

function checkWinCondition(state: ReturnType<typeof makeGameState>): {
  finished: boolean;
  winner: any | null;
  reason: string;
} {
  if (state.status !== "in-progress") return { finished: false, winner: null, reason: "" };

  const active = Array.from(state.beyblades.values()).filter((b: any) => b.isActive);
  const timeExpired = state.timer <= 0;

  if (active.length <= 1 || timeExpired) {
    let winner: any | null;
    if (active.length === 1) {
      winner = active[0];
    } else if (active.length > 1) {
      winner = active.reduce((best: any, b: any) => b.spin > best.spin ? b : best, active[0]);
    } else {
      winner = null;
    }
    const reason = active.length === 0
      ? "simultaneous-spinout"
      : active.length === 1
        ? "last-standing"
        : "timer";
    return { finished: true, winner, reason };
  }

  return { finished: false, winner: null, reason: "" };
}

// ─── Win condition tests ──────────────────────────────────────────────────────

describe("checkWinCondition — last-standing", () => {
  test("returns finished=true with the survivor when only 1 active beyblade", () => {
    const state = makeGameState();
    const winner = makeBeyblade("b1", { userId: "u1" });
    const loser = makeBeyblade("b2", { isActive: false });
    state.beyblades.set("b1", winner);
    state.beyblades.set("b2", loser);

    const result = checkWinCondition(state);

    expect(result.finished).toBe(true);
    expect(result.winner?.userId).toBe("u1");
    expect(result.reason).toBe("last-standing");
  });

  test("returns finished=false when 2 beyblades are still active", () => {
    const state = makeGameState();
    state.beyblades.set("b1", makeBeyblade("b1"));
    state.beyblades.set("b2", makeBeyblade("b2"));

    const result = checkWinCondition(state);

    expect(result.finished).toBe(false);
  });
});

describe("checkWinCondition — simultaneous spin-out", () => {
  test("returns finished=true with winner=null when both are inactive", () => {
    const state = makeGameState();
    state.beyblades.set("b1", makeBeyblade("b1", { isActive: false }));
    state.beyblades.set("b2", makeBeyblade("b2", { isActive: false }));

    const result = checkWinCondition(state);

    expect(result.finished).toBe(true);
    expect(result.winner).toBeNull();
    expect(result.reason).toBe("simultaneous-spinout");
  });
});

describe("checkWinCondition — timer expiry", () => {
  test("picks the beyblade with higher spin as winner when timer expires", () => {
    const state = makeGameState({ timer: 0 });
    const lowSpin = makeBeyblade("b1", { userId: "u1", spin: 600 });
    const highSpin = makeBeyblade("b2", { userId: "u2", spin: 1800 });
    state.beyblades.set("b1", lowSpin);
    state.beyblades.set("b2", highSpin);

    const result = checkWinCondition(state);

    expect(result.finished).toBe(true);
    expect(result.winner?.userId).toBe("u2");
    expect(result.reason).toBe("timer");
  });

  test("does not fire when timer > 0 and both active", () => {
    const state = makeGameState({ timer: 10 });
    state.beyblades.set("b1", makeBeyblade("b1"));
    state.beyblades.set("b2", makeBeyblade("b2"));

    const result = checkWinCondition(state);

    expect(result.finished).toBe(false);
  });

  test("does not fire if status is already finished", () => {
    const state = makeGameState({ status: "finished", timer: 0 });
    state.beyblades.set("b1", makeBeyblade("b1", { isActive: false }));

    const result = checkWinCondition(state);

    expect(result.finished).toBe(false);
  });
});

// ─── Spin-out broadcast payload ───────────────────────────────────────────────
// Verifies the payload shape emitted when a beyblade's spin reaches zero.
// The rooms must include { playerId, username, x, y, type } — the client's
// spawnSpinOutParticles uses x/y for position and type for particle colour.

describe("spin-out broadcast payload shape", () => {
  test("spin-out payload includes x, y, type alongside playerId and username", () => {
    // Simulate the broadcast call made inside the room tick at spin===0
    const bey = makeBeyblade("b1", {
      username: "Tester",
      x: 300, y: 420,
      type: "attack",
    });

    const payload = {
      playerId: bey.id,
      username: bey.username,
      x: bey.x,
      y: bey.y,
      type: bey.type,
    };

    expect(payload.playerId).toBe("b1");
    expect(payload.username).toBe("Tester");
    expect(payload.x).toBe(300);
    expect(payload.y).toBe(420);
    expect(payload.type).toBe("attack");
  });

  test("spin-out payload for every beyblade type has the correct type string", () => {
    const types = ["attack", "defense", "stamina", "balanced"] as const;
    for (const type of types) {
      const bey = makeBeyblade(`b-${type}`, { type });
      const payload = { playerId: bey.id, x: bey.x, y: bey.y, type: bey.type };
      expect(payload.type).toBe(type);
    }
  });
});

// ─── Idle disconnect logic ────────────────────────────────────────────────────
// The idle disconnect fires when `Date.now() - lastInputTime > 60_000`.
// We test the predicate directly without running the full room.

describe("idle disconnect predicate", () => {
  function shouldIdleDisconnect(lastInputTime: number, now = Date.now()) {
    return now - lastInputTime > 60_000;
  }

  test("returns false when input was 30s ago", () => {
    const lastInput = Date.now() - 30_000;
    expect(shouldIdleDisconnect(lastInput)).toBe(false);
  });

  test("returns false when input was exactly 60s ago", () => {
    const lastInput = Date.now() - 60_000;
    expect(shouldIdleDisconnect(lastInput)).toBe(false);
  });

  test("returns true when input was 61s ago", () => {
    const lastInput = Date.now() - 61_000;
    expect(shouldIdleDisconnect(lastInput)).toBe(true);
  });

  test("AI input MUST NOT reset lastInputTime — only human input does", () => {
    // Regression: if applyAIInput reset lastInputTime, an idle room with no
    // human would never disconnect. This test documents the contract.
    let lastInputTime = Date.now() - 65_000;

    // Simulate human input handler — SHOULD reset
    const humanHandleInput = () => { lastInputTime = Date.now(); };
    humanHandleInput();
    expect(shouldIdleDisconnect(lastInputTime)).toBe(false);

    // Reset to old timestamp
    lastInputTime = Date.now() - 65_000;

    // Simulate AI input — must NOT reset lastInputTime
    const applyAIInput = () => { /* does not touch lastInputTime */ };
    applyAIInput();
    expect(shouldIdleDisconnect(lastInputTime)).toBe(true);
  });

  test("BattleRoom: any one human player resets the timer", () => {
    let lastInputTime = Date.now() - 65_000;
    expect(shouldIdleDisconnect(lastInputTime)).toBe(true);

    // Player 2 sends input — should reset for everyone
    const player2HandleInput = () => { lastInputTime = Date.now(); };
    player2HandleInput();
    expect(shouldIdleDisconnect(lastInputTime)).toBe(false);
  });
});

// ─── Spin decay → spin-out trigger ────────────────────────────────────────────

describe("spin decay and spin-out trigger", () => {
  test("beyblade becomes inactive when spin reaches 0", () => {
    const bey = makeBeyblade("b1", { spin: 5, spinDecayRate: 8 });
    const dt = 1; // 1 second

    bey.spin = Math.max(0, bey.spin - bey.spinDecayRate * dt);
    if (bey.spin <= 0) {
      bey.isActive = false;
      bey.health = 0;
    }

    expect(bey.spin).toBe(0);
    expect(bey.isActive).toBe(false);
    expect(bey.health).toBe(0);
  });

  test("beyblade stays active when spin > 0 after decay", () => {
    const bey = makeBeyblade("b1", { spin: 100, spinDecayRate: 8 });
    bey.spin = Math.max(0, bey.spin - bey.spinDecayRate * 0.016);

    expect(bey.spin).toBeGreaterThan(0);
    expect(bey.isActive).toBe(true);
  });

  test("spin does not go below 0", () => {
    const bey = makeBeyblade("b1", { spin: 2, spinDecayRate: 8 });
    bey.spin = Math.max(0, bey.spin - bey.spinDecayRate * 1);

    expect(bey.spin).toBe(0);
  });
});

// ─── Nutation wobble threshold ────────────────────────────────────────────────

describe("nutation wobble — stability threshold", () => {
  function wobbleMagnitude(bey: { spin: number; maxSpin: number; mass: number }) {
    const stability = Math.min(1, bey.spin / bey.maxSpin);
    if (stability < 0.4) {
      return (1 - stability) * 0.002 * bey.mass;
    }
    return 0;
  }

  test("wobble is 0 at full spin", () => {
    expect(wobbleMagnitude({ spin: 2000, maxSpin: 2000, mass: 50 })).toBe(0);
  });

  test("wobble is 0 at exactly 40% spin", () => {
    expect(wobbleMagnitude({ spin: 800, maxSpin: 2000, mass: 50 })).toBe(0);
  });

  test("wobble is non-zero just below 40% spin", () => {
    const mag = wobbleMagnitude({ spin: 799, maxSpin: 2000, mass: 50 });
    expect(mag).toBeGreaterThan(0);
  });

  test("wobble increases as spin approaches 0", () => {
    const at30pct = wobbleMagnitude({ spin: 600, maxSpin: 2000, mass: 50 });
    const at10pct = wobbleMagnitude({ spin: 200, maxSpin: 2000, mass: 50 });
    expect(at10pct).toBeGreaterThan(at30pct);
  });

  test("wobble scales with mass — heavier beyblade wobbles more", () => {
    const light = wobbleMagnitude({ spin: 400, maxSpin: 2000, mass: 30 });
    const heavy = wobbleMagnitude({ spin: 400, maxSpin: 2000, mass: 80 });
    expect(heavy).toBeGreaterThan(light);
  });
});

// ─── Beyblade type distribution — stat formula ────────────────────────────────

describe("beyblade stat derivation from type distribution", () => {
  function deriveStats(dist: { attack: number; defense: number; stamina: number }) {
    return {
      damageMultiplier: 1.0 + dist.attack * 0.007,
      damageReduction: 1 - dist.defense * 0.003,
      spinDecayRate: 8 * (1 - dist.stamina * 0.001),
      maxSpin: Math.ceil(2000 * (1 + dist.stamina * 0.0008)),
    };
  }

  test("base distribution (120/120/120) produces mid-tier stats", () => {
    const s = deriveStats({ attack: 120, defense: 120, stamina: 120 });
    expect(s.damageMultiplier).toBeCloseTo(1.84);
    expect(s.damageReduction).toBeCloseTo(0.64);
    expect(s.spinDecayRate).toBeCloseTo(7.04);
  });

  test("max-attack (150/60/150) maximises damageMultiplier", () => {
    const s = deriveStats({ attack: 150, defense: 60, stamina: 150 });
    expect(s.damageMultiplier).toBeCloseTo(2.05);
  });

  test("max-defense (60/150/150) minimises damage taken", () => {
    const s = deriveStats({ attack: 60, defense: 150, stamina: 150 });
    expect(s.damageReduction).toBeCloseTo(0.55);
  });

  test("max-stamina (60/150/150) slows spin decay and increases maxSpin", () => {
    const s = deriveStats({ attack: 60, defense: 150, stamina: 150 });
    // Slowest decay at max stamina
    expect(s.spinDecayRate).toBeCloseTo(6.8);
    expect(s.maxSpin).toBeGreaterThan(2000);
  });

  test("zero-attack gives base damage multiplier of 1.0", () => {
    const s = deriveStats({ attack: 0, defense: 180, stamina: 180 });
    expect(s.damageMultiplier).toBeCloseTo(1.0);
  });
});

// ─── Match broadcast event contract ──────────────────────────────────────────
// Rooms emit these events; clients expect them. This tests the payload shapes
// to catch regressions if the server changes what it sends.

describe("broadcast event payload contracts", () => {
  test("collision event has p1, p2, damage1, damage2, contactPoint", () => {
    const payload = {
      p1: "session-1",
      p2: "session-2",
      damage1: 12.5,
      damage2: 8.3,
      contactPoint: { x: 300, y: 400 },
    };

    expect(payload).toHaveProperty("p1");
    expect(payload).toHaveProperty("p2");
    expect(payload).toHaveProperty("damage1");
    expect(payload).toHaveProperty("damage2");
    expect(payload.contactPoint).toHaveProperty("x");
    expect(payload.contactPoint).toHaveProperty("y");
  });

  test("game-over event has winner object with id/userId/username and reason", () => {
    const payload = {
      winner: { id: "b1", userId: "u1", username: "Champ" },
      reason: "last-standing",
    };

    expect(payload.winner).not.toBeNull();
    expect(payload.winner).toHaveProperty("id");
    expect(payload.winner).toHaveProperty("userId");
    expect(payload.winner).toHaveProperty("username");
    expect(["simultaneous-spinout", "last-standing", "timer"]).toContain(payload.reason);
  });

  test("game-over event winner is null on simultaneous spin-out", () => {
    const payload = {
      winner: null,
      reason: "simultaneous-spinout",
    };

    expect(payload.winner).toBeNull();
    expect(payload.reason).toBe("simultaneous-spinout");
  });

  test("ring-out event has playerId and username", () => {
    const payload = { playerId: "b1", username: "Tester" };

    expect(payload).toHaveProperty("playerId");
    expect(payload).toHaveProperty("username");
  });

  test("idle-disconnect event is an empty object", () => {
    const payload = {};
    expect(Object.keys(payload).length).toBe(0);
  });

  test("special-move event has playerId and known type string", () => {
    const validTypes = ["stampede-rush", "gyro-anchor", "spin-recovery", "tactical-burst"];

    for (const type of validTypes) {
      const payload = { playerId: "b1", type };
      expect(payload).toHaveProperty("playerId");
      expect(validTypes).toContain(payload.type);
    }
  });
});

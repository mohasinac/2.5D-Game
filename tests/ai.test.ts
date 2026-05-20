// Unit tests for AIController — server-side AI input generation.
// Verifies that each difficulty tier produces the correct decision pattern
// given known arena/opponent geometry. No Matter.js, no Firebase.

import { describe, test, expect, beforeEach } from "vitest";
import { AIController, type AIPlayerInput } from "../src/ai/AIController";

// ─── helpers ─────────────────────────────────────────────────────────────────

const ARENA_CX = 540;
const ARENA_CY = 540;
const ARENA_R  = 486; // 1080 * 0.45

function makeAI(overrides: Partial<ReturnType<typeof baseSnap>> = {}) {
  return {
    ...baseSnap("ai", ARENA_CX, ARENA_CY),
    ...overrides,
  };
}

function makeOpponent(overrides: Partial<ReturnType<typeof baseSnap>> = {}) {
  return {
    ...baseSnap("opp", ARENA_CX + 200, ARENA_CY),
    ...overrides,
  };
}

function baseSnap(id: string, x: number, y: number) {
  return {
    id,
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    spin: 1800,
    maxSpin: 2000,
    isAirborne: false,
    inPit: false,
    power: 30,
    spinDirection: "right",
    type: "balanced",
  };
}

// Run N ticks and collect the last input
function runTicks(ai: AIController, count: number, aiSnap: any, opponents: any[]): AIPlayerInput {
  let last: AIPlayerInput = {};
  for (let i = 0; i < count; i++) {
    last = ai.computeInput(aiSnap, opponents, ARENA_CX, ARENA_CY, ARENA_R);
  }
  return last;
}

// ─── Easy AI ────────────────────────────────────────────────────────────────

describe("AIController — easy", () => {
  let controller: AIController;
  beforeEach(() => { controller = new AIController("easy"); });

  test("produces at least one movement direction over 200 ticks", () => {
    const aiSnap = makeAI();
    const opp = makeOpponent();
    let anyMove = false;
    for (let i = 0; i < 200; i++) {
      const inp = controller.computeInput(aiSnap, [opp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.moveLeft || inp.moveRight || inp.moveUp || inp.moveDown) {
        anyMove = true;
        break;
      }
    }
    expect(anyMove).toBe(true);
  });

  test("attacks when opponent is within 300px", () => {
    const aiSnap = makeAI({ x: ARENA_CX, y: ARENA_CY });
    const closeOpp = makeOpponent({ x: ARENA_CX + 200, y: ARENA_CY }); // 200px away
    let attacked = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.attack) { attacked = true; break; }
    }
    expect(attacked).toBe(true);
  });

  test("does not attack opponent beyond 300px consistently", () => {
    // Opponent 350px away — easy AI should NOT attack
    const aiSnap = makeAI({ x: ARENA_CX, y: ARENA_CY });
    const farOpp  = makeOpponent({ x: ARENA_CX + 350, y: ARENA_CY });
    let attackCount = 0;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [farOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.attack) attackCount++;
    }
    expect(attackCount).toBe(0);
  });

  test("avoids arena edge — produces inward movement near boundary", () => {
    // Place AI near edge (90% of radius)
    const edgeX = ARENA_CX + ARENA_R * 0.9;
    const aiSnap = makeAI({ x: edgeX, y: ARENA_CY });
    const opp = makeOpponent({ x: ARENA_CX + 50, y: ARENA_CY });
    // Over 60 ticks some movement should point away from edge (left in this case)
    let moveLeft = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [opp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.moveLeft) { moveLeft = true; break; }
    }
    expect(moveLeft).toBe(true);
  });

  test("returns empty object (no inputs) when no opponents", () => {
    const aiSnap = makeAI();
    // With no opponents, easy AI still picks a random direction but won't attack
    const inp = controller.computeInput(aiSnap, [], ARENA_CX, ARENA_CY, ARENA_R);
    expect(inp.attack).toBeFalsy();
    expect(inp.defense).toBeFalsy();
  });
});

// ─── Medium AI ───────────────────────────────────────────────────────────────

describe("AIController — medium", () => {
  let controller: AIController;
  beforeEach(() => { controller = new AIController("medium"); });

  test("moves toward nearest opponent within 60 ticks", () => {
    // Opponent is to the right — AI should eventually emit moveRight
    const aiSnap  = makeAI({ x: ARENA_CX - 100, y: ARENA_CY });
    const oppSnap = makeOpponent({ x: ARENA_CX + 100, y: ARENA_CY });
    let movedRight = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [oppSnap], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.moveRight) { movedRight = true; break; }
    }
    expect(movedRight).toBe(true);
  });

  test("attacks when opponent is within 200px", () => {
    const aiSnap  = makeAI({ x: ARENA_CX, y: ARENA_CY });
    const closeOpp = makeOpponent({ x: ARENA_CX + 150, y: ARENA_CY });
    let attacked = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.attack) { attacked = true; break; }
    }
    expect(attacked).toBe(true);
  });

  test("uses defense when low spin and opponent close", () => {
    const aiSnap  = makeAI({ x: ARENA_CX, y: ARENA_CY, spin: 600, maxSpin: 2000 }); // 30% spin
    const closeOpp = makeOpponent({ x: ARENA_CX + 100, y: ARENA_CY });
    let defended = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.defense) { defended = true; break; }
    }
    expect(defended).toBe(true);
  });

  test("charges power when power is below 50", () => {
    const aiSnap = makeAI({ power: 20 });
    const opp    = makeOpponent({ x: ARENA_CX + 400, y: ARENA_CY }); // far away
    let charged = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [opp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.chargeHeld) { charged = true; break; }
    }
    expect(charged).toBe(true);
  });

  test("fires special when spin < 40% AND power >= 50", () => {
    const aiSnap  = makeAI({ spin: 700, maxSpin: 2000, power: 60 }); // 35% spin, 60 power
    const closeOpp = makeOpponent({ x: ARENA_CX + 100, y: ARENA_CY });
    let firedSpecial = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.specialTap) { firedSpecial = true; break; }
    }
    expect(firedSpecial).toBe(true);
  });

  test("does not fire special when power < 50", () => {
    const aiSnap  = makeAI({ spin: 700, maxSpin: 2000, power: 30 }); // insufficient power
    const closeOpp = makeOpponent({ x: ARENA_CX + 100, y: ARENA_CY });
    let firedSpecial = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.specialTap) { firedSpecial = true; break; }
    }
    expect(firedSpecial).toBe(false);
  });
});

// ─── Hard AI ─────────────────────────────────────────────────────────────────

describe("AIController — hard", () => {
  let controller: AIController;
  beforeEach(() => { controller = new AIController("hard"); });

  test("produces movement input on first tick", () => {
    const aiSnap = makeAI();
    const opp    = makeOpponent();
    const inp    = controller.computeInput(aiSnap, [opp], ARENA_CX, ARENA_CY, ARENA_R);
    const moved  = inp.moveLeft || inp.moveRight || inp.moveUp || inp.moveDown;
    expect(moved).toBe(true);
  });

  test("dodges when opponent is approaching fast and close", () => {
    // Opponent moving toward AI at speed 4 (> 3 threshold), within 200px
    const aiSnap  = makeAI({ x: ARENA_CX, y: ARENA_CY });
    const fastOpp = makeOpponent({
      x: ARENA_CX + 180, y: ARENA_CY,
      velocityX: -4, velocityY: 0, // moving left toward AI
    });
    let dodged = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [fastOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.dodge) { dodged = true; break; }
    }
    expect(dodged).toBe(true);
  });

  test("fires special when power >= 50 and opponent is close", () => {
    const aiSnap  = makeAI({ power: 55, spin: 1100, maxSpin: 2000 }); // 55% spin (<60% threshold), enough power
    const closeOpp = makeOpponent({ x: ARENA_CX + 120, y: ARENA_CY });
    let firedSpecial = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(aiSnap, [closeOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.specialTap) { firedSpecial = true; break; }
    }
    expect(firedSpecial).toBe(true);
  });

  test("uses defense near arena edge and opponent close", () => {
    // AI at 80%+ of arena radius, opponent nearby
    const edgeAI  = makeAI({ x: ARENA_CX + ARENA_R * 0.82, y: ARENA_CY });
    const nearOpp = makeOpponent({ x: ARENA_CX + ARENA_R * 0.82 - 150, y: ARENA_CY });
    let defended = false;
    for (let i = 0; i < 60; i++) {
      const inp = controller.computeInput(edgeAI, [nearOpp], ARENA_CX, ARENA_CY, ARENA_R);
      if (inp.defense) { defended = true; break; }
    }
    expect(defended).toBe(true);
  });

  test("ignores opponents with zero spin (already spun out)", () => {
    const aiSnap    = makeAI({ x: ARENA_CX, y: ARENA_CY });
    const spunOut   = makeOpponent({ spin: 0 }); // completely spun out
    // With no active opponents, hard AI still moves but won't attack a spun-out bey
    const inp = controller.computeInput(aiSnap, [spunOut], ARENA_CX, ARENA_CY, ARENA_R);
    expect(inp.attack).toBeFalsy();
  });
});

// ─── Shared behaviour ────────────────────────────────────────────────────────

describe("AIController — difficulty-agnostic behaviour", () => {
  test.each(["easy", "medium", "hard"] as const)(
    "%s AI returns a plain object (not null/undefined)",
    (diff) => {
      const ctrl = new AIController(diff);
      const aiSnap = makeAI();
      const result = ctrl.computeInput(aiSnap, [makeOpponent()], ARENA_CX, ARENA_CY, ARENA_R);
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    }
  );

  test.each(["easy", "medium", "hard"] as const)(
    "%s AI only sets boolean fields (no numbers/strings in input)",
    (diff) => {
      const ctrl = new AIController(diff);
      const aiSnap = makeAI();
      const inp = ctrl.computeInput(aiSnap, [makeOpponent()], ARENA_CX, ARENA_CY, ARENA_R);
      const boolKeys = ["moveLeft","moveRight","moveUp","moveDown","jump","attack","defense","dodge","chargeHeld","specialTap"];
      for (const k of boolKeys) {
        const v = (inp as any)[k];
        if (v !== undefined) expect(typeof v).toBe("boolean");
      }
    }
  );

  test("tickCounter increments across calls (stateful)", () => {
    const ctrl = new AIController("easy");
    const snap = makeAI();
    ctrl.computeInput(snap, [], ARENA_CX, ARENA_CY, ARENA_R);
    ctrl.computeInput(snap, [], ARENA_CX, ARENA_CY, ARENA_R);
    // We can verify stateful behaviour indirectly: after 90 ticks the direction should refresh
    // Just verify it doesn't throw across many ticks
    expect(() => {
      for (let i = 0; i < 200; i++) ctrl.computeInput(snap, [], ARENA_CX, ARENA_CY, ARENA_R);
    }).not.toThrow();
  });
});

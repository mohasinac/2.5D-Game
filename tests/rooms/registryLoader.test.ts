/**
 * registryLoader.test.ts
 *
 * Verifies the two-tier registry cache architecture:
 *   Tier 1 — TypeScript code registries: synchronous, always available, no Firestore.
 *   Tier 2 — Firestore admin-created content: loaded once via preloadFirestoreContent().
 *
 * Firebase is mocked so no real network calls are made.
 */

import { describe, it, expect, vi, beforeAll } from "vitest";

// ── Mocks (hoisted before any imports) ───────────────────────────────────────

vi.mock("../../server/utils/firebase", () => ({
  getFirestoreDb: vi.fn().mockReturnValue(null), // No Firestore connection in tests
}));

vi.mock("../../server/physics/registries/index", () => ({
  MaterialRegistry: {
    abs_hard:     { mu_k: 0.17, e: 0.67, dmgMult: 1.0 },
    metal_zinc:   { mu_k: 0.12, e: 0.80, dmgMult: 1.5 },
    rubber_soft:  { mu_k: 0.50, e: 0.25, dmgMult: 0.9 },
  },
  AttackTypeRegistry: {
    smash:  { frictionMu: 0.85 },
    upper:  { frictionMu: 0.70 },
    absorb: { frictionMu: 0.20 },
    burst:  { frictionMu: 0.95 },
  },
  GenerationRegistry: {
    plastics:    { omega0_rads: 400 },
    hms:         { omega0_rads: 450 },
    mfb:         { omega0_rads: 600 },
    burst_v1:    { omega0_rads: 700 },
    burst_choz:  { omega0_rads: 750 },
    bx:          { omega0_rads: 750 },
  },
  TipShapeRegistry: {
    flat:    { contactRadius_cm: 0.2, mu_k: 0.17 },
    sharp:   { contactRadius_cm: 0.1, mu_k: 0.17 },
    rubber:  { contactRadius_cm: 0.5, mu_k: 0.50 },
    bearing: { contactRadius_cm: 0.1, mu_k: 0.02 },
  },
  LiquidTypeRegistry: {
    water: { mu_eff: 1.0, speedMult: 0.7 },
    lava:  { mu_eff: 0.6, spinDecayAccel: 5 },
    ice:   { mu_eff: 0.05, speedMult: 1.3 },
  },
  ElementTypeRegistry: {
    fire:    { spinStealMult: 1.2 },
    water:   { spinStealMult: 0.8 },
    thunder: { burstMult: 1.4 },
  },
  ELEMENT_INTERACTION_TABLE: {
    fire:  { ice: 0.5, fire: 1.0 },
    water: { fire: 1.5, water: 1.0 },
  },
  BowlProfileRegistry: {
    flat:     { wallAngle_deg: 0 },
    standard: { wallAngle_deg: 20 },
    steep:    { wallAngle_deg: 45 },
  },
  ArenaShapeRegistry: {
    circle:   { sides: 0 },
    hexagon:  { sides: 6 },
    stadium:  { sides: -1 },
  },
  PartLayerRegistry: {
    upper: { z_min_cm: 0.5 },
    blade: { z_min_cm: 0.2 },
    guard: { z_min_cm: 0.1 },
  },
  GimmickRegistry: {
    power_drive:       { behaviorRefs: ["smashImpact"] },
    free_spin_bearing: { behaviorRefs: ["freeSpin"] },
    cho_z_awakening:   { behaviorRefs: ["burstSuppress"] },
  },
}));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import {
  getRegistry,
  preloadFirestoreContent,
  isRegistryReady,
  TypeScriptRegistries,
  refreshRegistry,
} from "../../server/lib/registryLoader";
import { getFirestoreDb } from "../../server/utils/firebase";

// ─────────────────────────────────────────────────────────────────────────────
// Tier 1 — TypeScript registries (always synchronous, no preload required)
// ─────────────────────────────────────────────────────────────────────────────

describe("registryLoader — Tier 1: TypeScript registries (always synchronous)", () => {
  it("materials registry is accessible without calling preloadFirestoreContent()", () => {
    const materials = getRegistry("materials");
    expect(materials).toBeDefined();
    expect(typeof materials).toBe("object");
    expect(Object.keys(materials).length).toBeGreaterThan(0);
  });

  it("materials registry contains abs_hard with correct physics constants", () => {
    const materials = getRegistry<{ mu_k: number; e: number }>("materials");
    const abs = materials["abs_hard"];
    expect(abs).toBeDefined();
    expect(abs.mu_k).toBe(0.17);
    expect(abs.e).toBe(0.67);
  });

  it("attackTypes registry is accessible synchronously", () => {
    const at = getRegistry("attackTypes");
    expect(at).toBeDefined();
    expect(Object.keys(at).length).toBeGreaterThan(0);
  });

  it("gimmicks registry is accessible synchronously", () => {
    expect(() => getRegistry("gimmicks")).not.toThrow();
    const gimmicks = getRegistry("gimmicks");
    expect(typeof gimmicks).toBe("object");
  });

  it("TypeScriptRegistries.materials() returns the same object as getRegistry('materials')", () => {
    const via_get    = getRegistry("materials");
    const via_helper = TypeScriptRegistries.materials();
    expect(via_get).toBe(via_helper);
  });

  it("TypeScriptRegistries.attackTypes() is accessible", () => {
    const at = TypeScriptRegistries.attackTypes();
    expect(at).toBeDefined();
  });

  it("all 11 Tier 1 registry keys are available without preload", () => {
    const tier1Keys = [
      "materials",
      "attackTypes",
      "generations",
      "tipShapes",
      "liquidTypes",
      "elementTypes",
      "elementInteractionTable",
      "bowlProfiles",
      "arenaShapes",
      "partLayers",
      "gimmicks",
    ];
    for (const key of tier1Keys) {
      expect(() => getRegistry(key), `${key} should not throw`).not.toThrow();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tier 2 — Firestore registries (require preload)
// ─────────────────────────────────────────────────────────────────────────────

describe("registryLoader — Tier 2: Firestore registries before preload", () => {
  it("getRegistry throws for unknown collection key", () => {
    expect(() => getRegistry("__nonexistent_collection_xyz__")).toThrow(/not loaded/);
  });

  it("error message references preloadFirestoreContent()", () => {
    expect(() => getRegistry("__test_unloaded_collection__")).toThrow(/preloadFirestoreContent/);
  });

  it("Firestore registry 'arenas' throws before preloadFirestoreContent() if not yet preloaded", () => {
    // Guard: only run if module is in pristine (pre-preload) state
    if (!isRegistryReady()) {
      expect(() => getRegistry("arenas")).toThrow(/not loaded/);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// After preloadFirestoreContent()
// ─────────────────────────────────────────────────────────────────────────────

describe("registryLoader — after preloadFirestoreContent()", () => {
  beforeAll(async () => {
    // Firebase is mocked to return null → loadFirestoreCollection gracefully sets {} for each
    await preloadFirestoreContent();
  });

  it("loads PartRegistry (attack_ring_parts) from Firestore without error", () => {
    expect(() => getRegistry("attack_ring_parts")).not.toThrow();
    const parts = getRegistry("attack_ring_parts");
    expect(typeof parts).toBe("object");
    // In test env without real Firestore, registry is empty ({}) but accessible
  });

  it("loads ArenaRegistry from Firestore without error", () => {
    expect(() => getRegistry("arenas")).not.toThrow();
    const arenas = getRegistry("arenas");
    expect(typeof arenas).toBe("object");
  });

  it("loads beyblade_stats registry without error", () => {
    expect(() => getRegistry("beyblade_stats")).not.toThrow();
  });

  it("loads special_moves registry without error", () => {
    expect(() => getRegistry("special_moves")).not.toThrow();
  });

  it("isRegistryReady() returns true after preload", () => {
    expect(isRegistryReady()).toBe(true);
  });

  it("calling preloadFirestoreContent() a second time is idempotent (no-op)", async () => {
    const firestoreDbMock = getFirestoreDb as ReturnType<typeof vi.fn>;
    const callsBefore = firestoreDbMock.mock.calls.length;
    await preloadFirestoreContent(); // second call — should be a no-op
    const callsAfter = firestoreDbMock.mock.calls.length;
    // No new Firestore calls should have been made (idempotent guard)
    expect(callsAfter).toBe(callsBefore);
  });

  it("caches registry after first load — repeated getRegistry() calls return same reference", () => {
    const r1 = getRegistry("materials");
    const r2 = getRegistry("materials");
    expect(r1).toBe(r2); // strict reference equality — same object
  });

  it("caches Firestore registry — same reference on repeated calls", () => {
    const a1 = getRegistry("arenas");
    const a2 = getRegistry("arenas");
    expect(a1).toBe(a2);
  });

  it("does not call Firestore during tick after initial load", () => {
    // Simulate 60 rapid-fire getRegistry() calls (like a room tick at 60 Hz would make)
    const firestoreDbMock = getFirestoreDb as ReturnType<typeof vi.fn>;
    const callsBefore = firestoreDbMock.mock.calls.length;

    for (let i = 0; i < 60; i++) {
      getRegistry("arenas");
      getRegistry("materials");
      getRegistry("attack_ring_parts");
      getRegistry("attackTypes");
    }

    const callsAfter = firestoreDbMock.mock.calls.length;
    expect(callsAfter).toBe(callsBefore); // zero new Firestore calls
  });

  it("getRegistry() is synchronous — no Promise returned", () => {
    const result = getRegistry("materials");
    // Should be a plain object, not a Promise
    expect(result).not.toBeInstanceOf(Promise);
    expect(typeof result.then).toBe("undefined");
  });

  it("refreshRegistry() re-fetches a single collection without throwing", async () => {
    // Firebase is mocked to null → refreshRegistry gracefully sets {} and returns
    await expect(refreshRegistry("arenas")).resolves.not.toThrow();
    expect(() => getRegistry("arenas")).not.toThrow();
  });

  it("Tier 1 registries remain accessible after preload (unchanged)", () => {
    const materials = getRegistry("materials");
    expect(Object.keys(materials).length).toBeGreaterThan(0);
    expect((materials as Record<string, unknown>)["abs_hard"]).toBeDefined();
  });
});

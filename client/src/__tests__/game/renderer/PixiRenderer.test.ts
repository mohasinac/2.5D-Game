import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import * as PIXI from "pixi.js";
import type { ServerBeyblade, ServerGameState } from "@/types/game";

// The global setup mocks pixi.js, but the mock canvas is a plain object.
// jsdom requires a real Node for appendChild, so we patch the Application mock
// to return a real <canvas> element before each test.
const MockApplication = PIXI.Application as unknown as ReturnType<typeof vi.fn>;

function patchMockCanvas() {
  const realCanvas = document.createElement("canvas");
  // Carry over the event-listener stubs so the renderer can call addEventListener
  (realCanvas as unknown as Record<string, unknown>).addEventListener = vi.fn();
  (realCanvas as unknown as Record<string, unknown>).removeEventListener = vi.fn();
  (realCanvas as unknown as Record<string, unknown>).remove = vi.fn();

  // Replace the canvas on the already-created mock instance — the mock factory
  // creates a new object per `new PIXI.Application()`, so we intercept via the
  // implementation factory and forward it to whoever consumes `app.canvas`.
  MockApplication.mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
    resize: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      stop: vi.fn(),
      start: vi.fn(),
      destroy: vi.fn(),
      deltaMS: 16,
    },
    stage: {
      addChild: vi.fn(),
      removeChild: vi.fn(),
      removeChildren: vi.fn(),
      addChildAt: vi.fn(),
      children: [],
      destroy: vi.fn(),
    },
    canvas: realCanvas,
    screen: { width: 800, height: 600 },
    renderer: { context: { gl: { getExtension: vi.fn(() => null) } } },
  }));
}

function makeContainer(): HTMLDivElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

function getAppInstance(renderer: BeybladeGameRenderer) {
  return (renderer as unknown as { app: Record<string, unknown> }).app;
}

function makeBeyblade(overrides: Partial<ServerBeyblade> = {}): ServerBeyblade {
  return {
    id: "b1",
    userId: "u1",
    username: "TestBey",
    x: 400,
    y: 300,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    angularVelocity: 10,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    spin: 2000,
    maxSpin: 2000,
    isActive: true,
    isAI: false,
    type: "attack",
    radius: 24,
    actualSize: 48,
    isInvulnerable: false,
    damageDealt: 0,
    damageReceived: 0,
    collisions: 0,
    spinDirection: "right",
    power: 0,
    isAirborne: false,
    airborneTimer: 0,
    isDefending: false,
    attackBuffTimer: 0,
    dodgeBuffTimer: 0,
    stunTimer: 0,
    comboExecuting: false,
    ...overrides,
  };
}

function makeGameState(overrides: Partial<ServerGameState> = {}): ServerGameState {
  return {
    status: "in-progress",
    mode: "tryout",
    timer: 60,
    startTime: 0,
    winner: "",
    matchId: "m1",
    arena: {
      id: "a1",
      name: "Test Arena",
      width: 1080,
      height: 1080,
      shape: "circle",
      theme: "forest",
    },
    beyblades: new Map(),
    ...overrides,
  };
}

describe("BeybladeGameRenderer", () => {
  let container: HTMLDivElement;
  let renderer: BeybladeGameRenderer;

  beforeEach(() => {
    patchMockCanvas();
    container = makeContainer();
    renderer = new BeybladeGameRenderer(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // ── Constructor ──────────────────────────────────────────────────────────────

  it("does NOT call app.init() in the constructor", () => {
    const app = getAppInstance(renderer);
    expect(app.init).not.toHaveBeenCalled();
  });

  // ── init() ──────────────────────────────────────────────────────────────────

  it("appends the canvas to the container after init() resolves", async () => {
    await renderer.init();
    const app = getAppInstance(renderer);
    // app.init was called once
    expect(app.init).toHaveBeenCalledTimes(1);
    // The real canvas element should now be a child of the container div
    expect(container.contains(app.canvas as Node)).toBe(true);
  });

  it("render(null, new Map()) returns without throwing after init()", async () => {
    await renderer.init();
    expect(() => renderer.render(null, new Map())).not.toThrow();
  });

  it("render with beyblades calls beybladeLayer.addChild for each beyblade", async () => {
    await renderer.init();

    const beybladeLayer = (renderer as unknown as {
      beybladeLayer: { addChild: ReturnType<typeof vi.fn> };
    }).beybladeLayer;

    const beyblades = new Map<string, ServerBeyblade>();
    beyblades.set("b1", makeBeyblade({ id: "b1" }));
    beyblades.set("b2", makeBeyblade({ id: "b2", type: "defense" }));

    const state = makeGameState({ beyblades });
    renderer.render(state, beyblades);

    expect(beybladeLayer.addChild).toHaveBeenCalled();
  });

  // ── destroy() ──────────────────────────────────────────────────────────────

  it("destroy() calls app.destroy(true, { children: true })", async () => {
    await renderer.init();
    const app = getAppInstance(renderer);
    renderer.destroy();
    expect(app.destroy).toHaveBeenCalledWith(true, { children: true });
  });

  it("destroy() is a no-op when called before init() — no throw, no app.destroy call", () => {
    const app = getAppInstance(renderer);
    expect(() => renderer.destroy()).not.toThrow();
    expect(app.destroy).not.toHaveBeenCalled();
  });

  it("destroy() sets initialized to false so subsequent render() calls are no-ops", async () => {
    await renderer.init();
    renderer.destroy();

    const beyblades = new Map<string, ServerBeyblade>();
    beyblades.set("b1", makeBeyblade());

    // render should silently return without any stage manipulation
    expect(() => renderer.render(makeGameState({ beyblades }), beyblades)).not.toThrow();

    const app = getAppInstance(renderer);
    // app.destroy was called exactly once during destroy(), not again
    expect(app.destroy).toHaveBeenCalledTimes(1);
  });

  // ── Particle spawning ───────────────────────────────────────────────────────

  it("spawnCollisionParticles can be called after init without throwing", async () => {
    await renderer.init();
    expect(() => renderer.spawnCollisionParticles(100, 200, 0xff0000, 0x0000ff)).not.toThrow();
  });

  it("spawnSpinOutParticles can be called after init without throwing", async () => {
    await renderer.init();
    expect(() => renderer.spawnSpinOutParticles(150, 250, 0x44ff88)).not.toThrow();
  });

  it("spawnDamageNumber creates a Text particle when damage > 0", async () => {
    await renderer.init();
    const MockText = PIXI.Text as unknown as ReturnType<typeof vi.fn>;
    const callsBefore = MockText.mock.instances.length;

    renderer.spawnDamageNumber(100, 100, 42);

    expect(MockText.mock.instances.length).toBeGreaterThan(callsBefore);
  });

  it("spawnDamageNumber does nothing when damage <= 0", async () => {
    await renderer.init();
    const MockText = PIXI.Text as unknown as ReturnType<typeof vi.fn>;
    const callsBefore = MockText.mock.instances.length;

    renderer.spawnDamageNumber(100, 100, 0);
    renderer.spawnDamageNumber(100, 100, -5);

    expect(MockText.mock.instances.length).toBe(callsBefore);
  });

  // ── resize() ────────────────────────────────────────────────────────────────

  it("resize() calls app.resize() when initialized", async () => {
    await renderer.init();
    const app = getAppInstance(renderer);
    renderer.resize();
    expect(app.resize).toHaveBeenCalledTimes(1);
  });

  it("resize() is a no-op before init() — no throw, no app.resize call", () => {
    const app = getAppInstance(renderer);
    expect(() => renderer.resize()).not.toThrow();
    expect(app.resize).not.toHaveBeenCalled();
  });
});

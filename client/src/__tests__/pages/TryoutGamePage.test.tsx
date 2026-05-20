import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TryoutGamePage } from "@/pages/TryoutGamePage";
import type { ServerBeyblade, ServerGameState, ConnectionState } from "@/types/game";

// ─── Module-level mock state ──────────────────────────────────────────────────
// We use a factory function pattern so individual tests can override the return
// value without needing require().

const defaultColyseusState = {
  connectionState: "connecting" as ConnectionState,
  gameState: null as ServerGameState | null,
  beyblades: new Map<string, ServerBeyblade>(),
  myBeyblade: null as ServerBeyblade | null,
  room: null as any,
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendInput: vi.fn(),
};

// Mutable reference that each test can replace
let colyseusState = { ...defaultColyseusState };

vi.mock("@/game/hooks/useColyseus", () => ({
  useColyseus: () => colyseusState,
}));

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: {
      beybladeId: "bey1",
      arenaId: "arena1",
      gameMode: "tryout",
      username: "Player",
      userId: "u1",
    },
    setBeyblade: vi.fn(),
    setArena: vi.fn(),
    setGameMode: vi.fn(),
    setDifficulty: vi.fn(),
    setOpponent: vi.fn(),
    setGameConfig: vi.fn(),
    startGame: vi.fn(),
    resetGame: vi.fn(),
    isReady: true,
  }),
  GameProvider: ({ children }: any) => children,
}));

// Prevent the RAF render loop from overflowing the stack.
// The setup.ts stub calls the callback immediately and synchronously, which
// would make the render loop recurse infinitely. Override it here so the
// first call fires once and subsequent calls return without invoking the cb.
let rafCallCount = 0;
beforeEach(() => {
  colyseusState = { ...defaultColyseusState, connect: vi.fn(), disconnect: vi.fn(), sendInput: vi.fn() };
  rafCallCount = 0;
  global.requestAnimationFrame = vi.fn((cb) => {
    // Fire the callback only on the very first call so the loop body runs once
    if (rafCallCount === 0) {
      rafCallCount++;
      cb(0);
    }
    return ++rafCallCount;
  });
});

vi.mock("@/game/hooks/usePixiRenderer", () => ({
  usePixiRenderer: () => ({
    render: vi.fn(),
    spawnCollisionParticles: vi.fn(),
    spawnSpinOutParticles: vi.fn(),
    spawnDamageNumber: vi.fn(),
  }),
}));

vi.mock("@/game/hooks/useGameInput", () => ({
  useGameInput: vi.fn(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <TryoutGamePage />
    </MemoryRouter>
  );
}

function makeBey(overrides: Partial<ServerBeyblade> = {}): ServerBeyblade {
  return {
    id: "bey-id",
    userId: "u1",
    username: "Player",
    x: 0, y: 0, rotation: 0,
    velocityX: 0, velocityY: 0, angularVelocity: 0,
    health: 80, maxHealth: 100,
    stamina: 100, maxStamina: 100,
    spin: 1800, maxSpin: 2000,
    isActive: true, isAI: false,
    type: "attack",
    radius: 30, actualSize: 30,
    isInvulnerable: false,
    damageDealt: 120, damageReceived: 30, collisions: 5,
    spinDirection: "right",
    power: 50,
    isAirborne: false, airborneTimer: 0,
    isDefending: false,
    attackBuffTimer: 0, dodgeBuffTimer: 0, stunTimer: 0,
    comboExecuting: false,
    ...overrides,
  };
}

function makeGameState(overrides: Partial<ServerGameState> = {}): ServerGameState {
  return {
    status: "in-progress",
    mode: "tryout",
    timer: 45,
    startTime: Date.now(),
    winner: "",
    matchId: "match-1",
    arena: null,
    beyblades: new Map(),
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TryoutGamePage", () => {
  it("renders the canvas container div", () => {
    renderPage();
    // Outer game container is a full-viewport div with position relative
    const container = document.querySelector('div[style*="100vh"]');
    expect(container).toBeInTheDocument();
  });

  it("Exit link goes to /game", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /exit/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/game");
  });

  it('shows "connecting" state indicator when not connected', () => {
    renderPage();
    // connectionState is rendered as uppercase text in the HUD span
    expect(screen.getByText("connecting")).toBeInTheDocument();
  });

  it("shows timer when gameState has a timer value", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ timer: 42 }),
    };

    render(
      <MemoryRouter>
        <TryoutGamePage />
      </MemoryRouter>
    );

    // Math.ceil(42) + "s" = "42s"
    expect(screen.getByText("42s")).toBeInTheDocument();
  });

  it("shows my beyblade stats (HP, Spin bars) when myBeyblade is provided", () => {
    const bey = makeBey({ health: 75, spin: 1600, maxSpin: 2000 });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      beyblades: new Map([["bey-id", bey]]),
      myBeyblade: bey,
    };

    render(
      <MemoryRouter>
        <TryoutGamePage />
      </MemoryRouter>
    );

    expect(screen.getByText("HP")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("Spin")).toBeInTheDocument();
  });

  it("game over overlay renders with performance stats when gameState.status=finished", () => {
    const bey = makeBey({ damageDealt: 250 });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", timer: 30 }),
      beyblades: new Map([["bey-id", bey]]),
      myBeyblade: bey,
    };

    render(
      <MemoryRouter>
        <TryoutGamePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/tryout complete/i)).toBeInTheDocument();
    // Stats: "Survived 30s with 250 damage dealt" — may match multiple elements
    expect(screen.getAllByText(/30s/i).length).toBeGreaterThanOrEqual(1);
    // The damage dealt number appears in the stats paragraph
    expect(screen.getByText(/survived.*30.*250.*damage/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import { AIBattleGamePage } from "@/pages/AIBattleGamePage";
import type { ServerBeyblade, ServerGameState, ConnectionState } from "@/types/game";

const USER_ID = "u1";

// ─── Module-level mock state ──────────────────────────────────────────────────

const defaultColyseusState = {
  connectionState: "connecting" as ConnectionState,
  gameState: null as ServerGameState | null,
  beyblades: new Map<string, ServerBeyblade>(),
  myBeyblade: null as ServerBeyblade | null,
  room: null as any,
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendInput: vi.fn(),
  isSpectating: false,
  sendQTEInput: vi.fn(),
  beyLinkQTE: null,
  beyLinkControlLoss: null,
  sendBeyLinkQTEInput: vi.fn(),
  beyLinkHijackQTE: null,
  beyLinkHijackBlockQTE: null,
  sendHijackBlock: vi.fn(),
  loadingStep: null as string | null,
  loadingError: null as string | null,
  visualEventQueue: [] as any[],
  floorInfo: [] as any[],
  myFloorIndex: 0,
  linkAlignments: [] as any[],
  floorTransition: null,
  collisionQTEData: null,
  collisionQTEPower: 0,
  collisionQTESpecialPrompt: false,
  sendCollisionQTEMash: vi.fn(),
  sendCollisionQTEFireSpecial: vi.fn(),
};

let colyseusState = { ...defaultColyseusState };

vi.mock("@/game/hooks/useColyseus", () => ({
  useColyseus: () => colyseusState,
}));

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: {
      beybladeId: "bey1",
      arenaId: "arena1",
      gameMode: "single-battle",
      username: "Player",
      userId: USER_ID,
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
    isHydrated: true,
    setActiveRoom: vi.fn(),
  }),
  GameProvider: ({ children }: any) => children,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: USER_ID, email: "a@b.com" },
    isAdmin: false,
    loading: false,
    signOutUser: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock("@/game/hooks/usePixiRenderer", () => ({
  usePixiRenderer: () => ({
    render: vi.fn(),
    spawnCollisionParticles: vi.fn(),
    spawnSpinOutParticles: vi.fn(),
    spawnDamageNumber: vi.fn(),
    physicsToScreen: vi.fn(() => ({ x: 0, y: 0 })),
    playSpecialMoveEffect: vi.fn(),
    playComboEffect: vi.fn(),
    setControlledBeyblade: vi.fn(),
    cameraZoomIn: vi.fn(),
    cameraZoomOut: vi.fn(),
    cameraZoomReset: vi.fn(),
  }),
}));

vi.mock("@/game/hooks/useGameInput", () => ({
  useGameInput: vi.fn(),
}));

// Prevent the RAF render loop from stack-overflowing.
let rafCallCount = 0;
beforeEach(() => {
  colyseusState = {
    ...defaultColyseusState,
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendInput: vi.fn(),
  };
  rafCallCount = 0;
  global.requestAnimationFrame = vi.fn((cb) => {
    if (rafCallCount === 0) {
      rafCallCount++;
      cb(0);
    }
    return ++rafCallCount;
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <AIBattleGamePage />
    </MemoryRouter>
  );
}

function makeBey(overrides: Partial<ServerBeyblade> = {}): ServerBeyblade {
  return {
    id: "bey-id",
    userId: USER_ID,
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
    damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: "right",
    power: 0,
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
    mode: "ai-battle",
    timer: 60,
    startTime: Date.now(),
    winner: "",
    matchId: "match-ai-1",
    arena: null,
    beyblades: new Map(),
    targetWins: 1,
    currentGame: 1,
    seriesWins: new Map(),
    seriesLeader: "",
    spectatorCount: 0,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AIBattleGamePage", () => {
  it("renders canvas container", () => {
    renderPage();
    const container = document.querySelector('div.h-screen');
    expect(container).toBeInTheDocument();
  });

  it("Exit link goes to /game/ai-battle (not /game/ai)", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /exit/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/game/ai-battle");
  });

  it('shows "VS AI" label', () => {
    renderPage();
    expect(screen.getByText("VS AI")).toBeInTheDocument();
  });

  it('shows "Loading AI battle..." overlay when not connected and gameState=null', () => {
    renderPage();
    expect(screen.getByText(/loading ai battle/i)).toBeInTheDocument();
  });

  it("shows Retry button when connectionState=error", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "error",
      gameState: null,
    };

    render(
      <MemoryRouter>
        <AIBattleGamePage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows Victory! overlay when gameState.status=finished with winner=userId", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: USER_ID }),
    };

    render(
      <MemoryRouter>
        <AIBattleGamePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/victory!/i)).toBeInTheDocument();
  });

  it("shows Defeated! overlay when gameState.status=finished with winner=other", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: "__ai__" }),
    };

    render(
      <MemoryRouter>
        <AIBattleGamePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/defeated!/i)).toBeInTheDocument();
  });

  it('"Play Again" button navigates to /game/ai-battle', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: USER_ID }),
    };

    const router = createMemoryRouter(
      [{ path: "/game/ai-battle/play", element: <AIBattleGamePage /> }],
      { initialEntries: ["/game/ai-battle/play"] }
    );

    render(<RouterProvider router={router} />);

    const playAgainBtn = screen.getByRole("button", { name: /play again/i });
    playAgainBtn.click();

    expect(router.state.location.pathname).toBe("/game/ai-battle");
  });

  it('"Menu" link goes to /game', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: "__ai__" }),
    };

    render(
      <MemoryRouter>
        <AIBattleGamePage />
      </MemoryRouter>
    );

    const menuLink = screen.getByRole("link", { name: /^menu$/i });
    expect(menuLink).toHaveAttribute("href", "/game");
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import { BattleGamePage } from "@/pages/BattleGamePage";
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

function renderPage(roomId = "room-123") {
  const router = createMemoryRouter(
    [{ path: "/game/battle/:roomId", element: <BattleGamePage /> }],
    { initialEntries: [`/game/battle/${roomId}`] }
  );
  return render(<RouterProvider router={router} />);
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
    mode: "single-battle-pvp",
    timer: 60,
    startTime: Date.now(),
    winner: "",
    matchId: "match-pvp-1",
    arena: null,
    beyblades: new Map(),
    // Series fields — default BO1 so "finished" overlay shows
    targetWins: 1,
    currentGame: 1,
    seriesWins: new Map(),
    seriesLeader: "",
    spectatorCount: 0,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BattleGamePage — layout", () => {
  it("renders canvas container", () => {
    renderPage();
    const container = document.querySelector('div.h-screen');
    expect(container).toBeInTheDocument();
  });

  it("Exit link goes to /game", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /exit/i });
    expect(link).toHaveAttribute("href", "/game");
  });

  it("shows connection state text in HUD", () => {
    renderPage();
    expect(screen.getByText("connecting")).toBeInTheDocument();
  });
});

// ─── Connecting overlay ───────────────────────────────────────────────────────

describe("BattleGamePage — connecting overlay", () => {
  it('shows "Joining battle..." when connectionState=connecting and gameState=null', () => {
    renderPage();
    expect(screen.getByText(/joining battle/i)).toBeInTheDocument();
  });

  it('shows "Connection lost" when connectionState=error and gameState is set', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "error",
      gameState: null,
    };

    render(
      <MemoryRouter>
        <BattleGamePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/connection lost/i)).toBeInTheDocument();
  });

  it('shows "Back to Lobby" link when connectionState=error', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "error",
      gameState: null,
    };

    render(
      <MemoryRouter>
        <BattleGamePage />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /back to lobby/i });
    expect(link).toHaveAttribute("href", "/game/battle/lobby");
  });

  it("no connecting overlay shown when connected with active game", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
    };

    renderPage();

    expect(screen.queryByText(/joining battle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/connection lost/i)).not.toBeInTheDocument();
  });
});

// ─── Game timer ───────────────────────────────────────────────────────────────

describe("BattleGamePage — timer", () => {
  it("shows Math.ceil(timer) + 's' when gameState has timer", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ timer: 47.3 }),
    };

    renderPage();

    expect(screen.getByText("48s")).toBeInTheDocument();
  });

  it("shows player count from beyblades map", () => {
    const bey1 = makeBey({ id: "b1", userId: USER_ID, username: "Player" });
    const bey2 = makeBey({ id: "b2", userId: "u2", username: "Opponent", isActive: false });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      beyblades: new Map([["b1", bey1], ["b2", bey2]]),
      myBeyblade: bey1,
    };

    renderPage();

    // 1 alive / 2 total
    expect(screen.getByText(/1\/2 alive/i)).toBeInTheDocument();
  });
});

// ─── Warmup overlay ──────────────────────────────────────────────────────────

describe("BattleGamePage — warmup overlay", () => {
  it("shows countdown number when status=warmup", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "warmup", timer: 3 }),
    };

    renderPage();

    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("does not show countdown when status=in-progress", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "in-progress" }),
    };

    renderPage();

    // Countdown only renders during warmup with timer 1-3
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});

// ─── My stats panel ──────────────────────────────────────────────────────────

describe("BattleGamePage — my stats panel", () => {
  it("shows HP and Spin bars when myBeyblade is set", () => {
    const bey = makeBey({ health: 65, spin: 1200, maxSpin: 2000 });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      beyblades: new Map([["bey-id", bey]]),
      myBeyblade: bey,
    };

    renderPage();

    expect(screen.getByText("HP")).toBeInTheDocument();
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("Spin")).toBeInTheDocument();
    // 1200/2000 = 60%
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("shows stability label 'Stable' when spin > 60% of maxSpin", () => {
    const bey = makeBey({ spin: 1400, maxSpin: 2000 }); // 70% → Stable
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      myBeyblade: bey,
    };

    renderPage();

    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("shows stability label 'Wobbling' when spin is 30-60% of maxSpin", () => {
    const bey = makeBey({ spin: 800, maxSpin: 2000 }); // 40% → Wobbling
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      myBeyblade: bey,
    };

    renderPage();

    expect(screen.getByText("Wobbling")).toBeInTheDocument();
  });

  it("shows stability label 'Critical!' when spin < 30% of maxSpin", () => {
    const bey = makeBey({ spin: 400, maxSpin: 2000 }); // 20% → Critical!
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      myBeyblade: bey,
    };

    renderPage();

    expect(screen.getByText("Critical!")).toBeInTheDocument();
  });

  it("does not show stats panel when myBeyblade is null", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      myBeyblade: null,
    };

    renderPage();

    expect(screen.queryByText("HP")).not.toBeInTheDocument();
  });

  it("shows beyblade type in stats panel", () => {
    const bey = makeBey({ type: "defense" });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      myBeyblade: bey,
    };

    renderPage();

    expect(screen.getByText("defense")).toBeInTheDocument();
  });
});

// ─── Opponent health bars ─────────────────────────────────────────────────────

describe("BattleGamePage — opponent health bars", () => {
  it("shows opponent username and ELIMINATED when opponent isActive=false", () => {
    const me = makeBey({ id: "b1", userId: USER_ID, username: "Player" });
    const opp = makeBey({ id: "b2", userId: "u2", username: "Rival", isActive: false, health: 0 });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      beyblades: new Map([["b1", me], ["b2", opp]]),
      myBeyblade: me,
    };

    renderPage();

    expect(screen.getByText("Rival")).toBeInTheDocument();
    expect(screen.getByText("ELIMINATED")).toBeInTheDocument();
  });

  it("does not show opponent panel when only 1 beyblade (solo)", () => {
    const me = makeBey({ id: "b1", userId: USER_ID });
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState(),
      beyblades: new Map([["b1", me]]),
      myBeyblade: me,
    };

    renderPage();

    expect(screen.queryByText("ELIMINATED")).not.toBeInTheDocument();
  });
});

// ─── Game over overlay (BO1 single game) ─────────────────────────────────────

describe("BattleGamePage — game over overlay", () => {
  it("shows VICTORY! and trophy emoji when winner === userId (BO1)", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: USER_ID, targetWins: 1 }),
    };

    renderPage();

    expect(screen.getByText("VICTORY!")).toBeInTheDocument();
    expect(screen.getByText("🏆")).toBeInTheDocument();
  });

  it("shows DEFEATED and skull emoji when winner !== userId (BO1)", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: "opponent-id", targetWins: 1 }),
    };

    renderPage();

    expect(screen.getByText("DEFEATED")).toBeInTheDocument();
    expect(screen.getByText("💀")).toBeInTheDocument();
  });

  it('"Play Again" link goes to /game/battle/lobby', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: USER_ID, targetWins: 1 }),
    };

    renderPage();

    const link = screen.getByRole("link", { name: /play again/i });
    expect(link).toHaveAttribute("href", "/game/battle/lobby");
  });

  it('"Menu" link goes to /game', () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: "other", targetWins: 1 }),
    };

    renderPage();

    const menuLink = screen.getByRole("link", { name: /^menu$/i });
    expect(menuLink).toHaveAttribute("href", "/game");
  });

  it("does not show game over overlay during active game", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "in-progress" }),
    };

    renderPage();

    expect(screen.queryByText("VICTORY!")).not.toBeInTheDocument();
    expect(screen.queryByText("DEFEATED")).not.toBeInTheDocument();
  });

  it("does not show BO1 overlay when targetWins > 1 (series game)", () => {
    colyseusState = {
      ...colyseusState,
      connectionState: "connected",
      gameState: makeGameState({ status: "finished", winner: USER_ID, targetWins: 2 }),
    };

    renderPage();

    // BO1 overlay should not show; series-end or game-end overlay would (requires message)
    const victoryEl = screen.queryByText("VICTORY!");
    expect(victoryEl).not.toBeInTheDocument();
  });
});

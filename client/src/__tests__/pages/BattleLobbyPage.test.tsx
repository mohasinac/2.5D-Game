import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BattleLobbyPage } from "@/pages/BattleLobbyPage";
import type { ServerBeyblade, ServerGameState } from "@/types/game";

// ─── Module-level mock state ──────────────────────────────────────────────────

const defaultColyseusState = {
  connectionState: "connected" as const,
  gameState: null as ServerGameState | null,
  beyblades: new Map<string, ServerBeyblade>(),
  myBeyblade: null as ServerBeyblade | null,
  room: null as any,
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendInput: vi.fn(),
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
      gameMode: "pvp",
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

beforeEach(() => {
  colyseusState = {
    ...defaultColyseusState,
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendInput: vi.fn(),
    beyblades: new Map(),
    room: null,
  };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <BattleLobbyPage />
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
    health: 100, maxHealth: 100,
    stamina: 100, maxStamina: 100,
    spin: 2000, maxSpin: 2000,
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BattleLobbyPage", () => {
  it('shows "PVP Battle Lobby" heading', () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /pvp battle lobby/i })).toBeInTheDocument();
  });

  it("shows connection status indicator", () => {
    renderPage();
    expect(screen.getByText("connected")).toBeInTheDocument();
  });

  it('shows "Waiting for players to join..." when beyblades is empty', () => {
    renderPage();
    expect(screen.getByText(/waiting for players to join/i)).toBeInTheDocument();
  });

  it("shows player list when beyblades has entries", () => {
    colyseusState = {
      ...colyseusState,
      beyblades: new Map([
        ["bey-a", makeBey({ id: "bey-a", userId: "u1", username: "Alpha" })],
        ["bey-b", makeBey({ id: "bey-b", userId: "u2", username: "Beta", type: "defense" })],
      ]),
    };

    render(
      <MemoryRouter>
        <BattleLobbyPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it('"Back to menu" link goes to /game', () => {
    renderPage();
    const link = screen.getByRole("link", { name: /← back to menu/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/game");
  });

  it("Start button is not shown when player is not host (< 2 players, empty lobby)", () => {
    // With no players the user is not the host — no Start button rendered
    renderPage();
    const startBtn = screen.queryByRole("button", { name: /start battle/i });
    expect(startBtn).not.toBeInTheDocument();
  });

  it('Start button calls room.send("start-game", {}) when >= 2 players and user is host', () => {
    const mockSend = vi.fn();
    const mockRoom = {
      sessionId: "s1",
      roomId: "room-123",
      onMessage: vi.fn(),
      send: mockSend,
      leave: vi.fn(),
    };

    // userId "u1" matches settings.userId — first in list makes user host
    colyseusState = {
      ...colyseusState,
      beyblades: new Map([
        ["bey-a", makeBey({ id: "bey-a", userId: "u1", username: "Alpha" })],
        ["bey-b", makeBey({ id: "bey-b", userId: "u2", username: "Beta" })],
      ]),
      room: mockRoom,
    };

    render(
      <MemoryRouter>
        <BattleLobbyPage />
      </MemoryRouter>
    );

    const startBtn = screen.getByRole("button", { name: /start battle/i });
    expect(startBtn).toBeEnabled();

    startBtn.click();

    expect(mockSend).toHaveBeenCalledWith("start-game", expect.objectContaining({ bestOf: expect.any(Number) }));
  });
});

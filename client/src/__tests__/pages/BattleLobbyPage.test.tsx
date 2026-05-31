import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import { BattleLobbyPage } from "@/pages/BattleLobbyPage";
import type { ServerGameState } from "@/types/game";

// ─── Module-level mock state ──────────────────────────────────────────────────

const defaultColyseusState = {
  connectionState: "disconnected" as const,
  gameState: null as ServerGameState | null,
  beyblades: new Map(),
  myBeyblade: null as any,
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
  loadingStep: null,
  loadingError: null,
  visualEventQueue: [],
  floorInfo: [],
  myFloorIndex: 0,
  linkAlignments: [],
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
      username: "Player",
      userId: "u1",
    },
  }),
  GameProvider: ({ children }: any) => children,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "u1" }, isAdmin: false, loading: false }),
  AuthProvider: ({ children }: any) => children,
}));

beforeEach(() => {
  colyseusState = {
    ...defaultColyseusState,
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendInput: vi.fn(),
  };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderAtPath(path = "/game/battle/lobby") {
  const router = createMemoryRouter(
    [{ path, element: <BattleLobbyPage /> }],
    { initialEntries: [path] },
  );
  return render(<RouterProvider router={router} />);
}

// ─── Phase 1 (choose) tests ───────────────────────────────────────────────────

describe("BattleLobbyPage — Phase 1 (choose)", () => {
  it("shows PVP BATTLE heading on /game/battle/lobby", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByText("PVP BATTLE")).toBeInTheDocument();
  });

  it("shows RANDOM MATCH card", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByText("RANDOM MATCH")).toBeInTheDocument();
  });

  it("shows FRIENDS ROOM card", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByText("FRIENDS ROOM")).toBeInTheDocument();
  });

  it("shows 'Find Match' button", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByRole("button", { name: /find match/i })).toBeInTheDocument();
  });

  it("shows 'Create Room' button", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByRole("button", { name: /create room/i })).toBeInTheDocument();
  });

  it("shows 'Join with Code' button", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByRole("button", { name: /join with code/i })).toBeInTheDocument();
  });

  it("shows '← Back to Battle Mode' navigation", () => {
    renderAtPath("/game/battle/lobby");
    expect(screen.getByText(/← back to battle mode/i)).toBeInTheDocument();
  });
});

describe("BattleLobbyPage — mode detection from pathname", () => {
  it("shows BATTLE ROYALE heading on /game/royale/lobby", () => {
    renderAtPath("/game/royale/lobby");
    expect(screen.getByText("BATTLE ROYALE")).toBeInTheDocument();
  });

  it("shows TOURNAMENT heading on /game/tournament/lobby", () => {
    renderAtPath("/game/tournament/lobby");
    expect(screen.getByText("TOURNAMENT")).toBeInTheDocument();
  });
});

describe("BattleLobbyPage — random connect transition", () => {
  it("clicking 'Find Match' transitions to searching state", () => {
    renderAtPath("/game/battle/lobby");
    fireEvent.click(screen.getByRole("button", { name: /find match/i }));
    expect(screen.getByText(/searching for opponent/i)).toBeInTheDocument();
  });

  it("'Cancel' button in connecting phase returns to choose", () => {
    renderAtPath("/game/battle/lobby");
    fireEvent.click(screen.getByRole("button", { name: /find match/i }));
    expect(screen.getByText(/searching for opponent/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByText("RANDOM MATCH")).toBeInTheDocument();
  });
});

describe("BattleLobbyPage — friends join code flow", () => {
  it("clicking 'Join with Code' shows code input", () => {
    renderAtPath("/game/battle/lobby");
    fireEvent.click(screen.getByRole("button", { name: /join with code/i }));
    expect(screen.getByPlaceholderText(/enter room code/i)).toBeInTheDocument();
  });

  it("'← Back' in join-code screen returns to choose", () => {
    renderAtPath("/game/battle/lobby");
    fireEvent.click(screen.getByRole("button", { name: /join with code/i }));
    expect(screen.getByPlaceholderText(/enter room code/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /← back/i }));
    expect(screen.getByText("RANDOM MATCH")).toBeInTheDocument();
  });
});

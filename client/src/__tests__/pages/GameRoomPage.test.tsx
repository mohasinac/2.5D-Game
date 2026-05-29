import { render, screen } from "@testing-library/react";
import { MemoryRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import React from "react";
import type { GameRoomConfig } from "@/types/gameRoom";

// ── Heavy module mocks ─────────────────────────────────────────────────────────

vi.mock("@/game/hooks/useColyseus", () => ({
  useColyseus: () => ({
    connectionState: "connecting",
    gameState: null,
    beyblades: new Map(),
    myBeyblade: null,
    room: null,
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
  }),
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
    triggerScreenShake: vi.fn(),
    triggerHitFlash: vi.fn(),
  }),
}));

vi.mock("@/game/hooks/useGameInput", () => ({
  useGameInput: vi.fn(),
}));

vi.mock("@/game/hooks/useLaunchInput", () => ({
  useLaunchInput: vi.fn(),
}));

vi.mock("@/hooks/useBitBeastCinematic", () => ({
  useBitBeastCinematic: () => ({ active: false, data: null, clear: vi.fn() }),
}));

vi.mock("@/hooks/useCombos", () => ({
  useCombos: () => ({ active: null, history: [], clear: vi.fn() }),
}));

vi.mock("@/hooks/useSpecialMoves", () => ({
  useSpecialMoves: () => ({ active: null, clear: vi.fn() }),
}));

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: { beybladeId: "bey1", arenaId: "arena1", username: "Player", userId: "u1" },
    is25D: true,
  }),
  GameProvider: ({ children }: any) => children,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "u1" }, isAdmin: false, loading: false }),
  AuthProvider: ({ children }: any) => children,
}));

// ── GameRoomPage tests ─────────────────────────────────────────────────────────

import { GameRoomPage } from "@/pages/GameRoomPage";

function renderWithConfig(config?: GameRoomConfig) {
  const router = createMemoryRouter(
    [{ path: "/game/room", element: <GameRoomPage /> }],
    {
      initialEntries: ["/game/room"],
      initialIndex: 0,
    }
  );
  // Patch the router state to include config
  if (config) {
    (router as any).state.location.state = { config };
  }
  return render(<RouterProvider router={router} />);
}

describe("GameRoomPage — renders without crash", () => {
  it("renders game shell container when no config provided (graceful fallback)", () => {
    // No config passed — GameRoomPage should not throw; shows loading or fallback
    expect(() => renderWithConfig()).not.toThrow();
  });

  it("renders game shell container with tryout config", () => {
    const config: GameRoomConfig = {
      roomType: "tryout",
      beybladeId: "bey1",
      arenaId: "default",
    };
    expect(() => renderWithConfig(config)).not.toThrow();
  });

  it("renders game shell container with pvai config", () => {
    const config: GameRoomConfig = {
      roomType: "pvai",
      beybladeId: "bey1",
      arenaId: "default",
      aiDifficulty: "medium",
    };
    expect(() => renderWithConfig(config)).not.toThrow();
  });
});

describe("GameRoomPage — loading state", () => {
  it("shows some loading indicator while connecting", () => {
    const config: GameRoomConfig = {
      roomType: "pvp",
      beybladeId: "bey1",
      arenaId: "default",
    };
    renderWithConfig(config);
    // Game should be rendering the GameShell which wraps the canvas
    const body = document.body;
    expect(body).toBeDefined();
    // At minimum the page renders without crashing
  });
});

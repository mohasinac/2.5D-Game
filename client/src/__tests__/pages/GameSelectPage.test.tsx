import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { GameSelectPage } from "@/pages/GameSelectPage";

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: {
      beybladeId: "bey1",
      arenaId: "arena1",
      gameMode: null,
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
    isReady: false,
  }),
  GameProvider: ({ children }: any) => children,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <GameSelectPage />
    </MemoryRouter>
  );
}

describe("GameSelectPage", () => {
  it('renders "Select Game Mode" heading', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /select game mode/i })).toBeInTheDocument();
    });
  });

  it("shows Tryout link to /game/tryout", async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /tryout/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/game/tryout");
    });
  });

  it("shows PVP Battle link to /game/battle/lobby", async () => {
    renderPage();
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /pvp battle/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/game/battle/lobby");
    });
  });

  it("AI Battle is disabled (no link) when enableAI=false (getDoc returns exists:false)", async () => {
    // Default mock from setup.ts returns exists: false — AI is disabled
    renderPage();
    await waitFor(() => {
      // The AI Battle card should be present as text
      expect(screen.getByText(/ai battle/i)).toBeInTheDocument();
    });
    // There should be NO link pointing to /game/ai-battle
    const links = screen.queryAllByRole("link");
    const aiBattleLink = links.find((l) => l.getAttribute("href") === "/game/ai-battle");
    expect(aiBattleLink).toBeUndefined();
  });

  it("AI Battle links to /game/ai-battle when enableAI=true", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        enableAI: true,
        enableTournament: false,
        maintenanceMode: false,
        serverMessage: "",
      }),
    } as any);

    renderPage();

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /ai battle/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/game/ai-battle");
    });
  });

  it("shows maintenance banner when maintenanceMode=true", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        enableAI: false,
        enableTournament: false,
        maintenanceMode: true,
        serverMessage: "",
      }),
    } as any);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText(/server is in maintenance mode/i)
      ).toBeInTheDocument();
    });
  });

  it("shows server message banner when serverMessage is set and maintenanceMode=false", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        enableAI: false,
        enableTournament: false,
        maintenanceMode: false,
        serverMessage: "Scheduled downtime at 11pm UTC",
      }),
    } as any);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText(/scheduled downtime at 11pm utc/i)
      ).toBeInTheDocument();
    });
    // Should NOT show the maintenance banner
    expect(screen.queryByText(/server is in maintenance mode/i)).not.toBeInTheDocument();
  });
});

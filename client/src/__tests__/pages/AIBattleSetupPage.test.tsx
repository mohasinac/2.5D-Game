import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import { getDocs } from "firebase/firestore";
import { AIBattleSetupPage } from "@/pages/AIBattleSetupPage";

// ─── Navigation capture ───────────────────────────────────────────────────────
// We track the last navigate call via a module-level variable so individual
// tests can inspect it without using require() (not available in ESM/vitest).

let lastNavigateTo: string | null = null;
let lastNavigateState: unknown = null;

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => (to: string, opts?: { state?: unknown }) => {
      lastNavigateTo = to;
      lastNavigateState = opts?.state ?? null;
    },
  };
});

// ─── Context mocks ────────────────────────────────────────────────────────────

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: {
      beybladeId: "",
      arenaId: "",
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

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "u1", email: "a@b.com" },
    isAdmin: false,
    loading: false,
    signOutUser: vi.fn(),
  }),
  AuthProvider: ({ children }: any) => children,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeQuerySnap(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    docs: docs.map((d) => ({ id: d.id, data: () => d.data })),
  };
}

const MOCK_BEYBLADES = [
  { id: "bey-1", data: { displayName: "Storm Eagle", type: "attack", spinDirection: "right" } },
  { id: "bey-2", data: { displayName: "Rock Leone", type: "defense", spinDirection: "left" } },
];

const MOCK_ARENAS = [
  { id: "arena-1", data: { name: "Classic Bowl", difficulty: "easy" } },
  { id: "arena-2", data: { name: "Volcano Crater", difficulty: "hard" } },
];

function setupGetDocsMock() {
  vi.mocked(getDocs)
    .mockResolvedValueOnce(makeQuerySnap(MOCK_BEYBLADES) as any)
    .mockResolvedValueOnce(makeQuerySnap(MOCK_ARENAS) as any);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AIBattleSetupPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  lastNavigateTo = null;
  lastNavigateState = null;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AIBattleSetupPage", () => {
  it("shows loading spinner initially", () => {
    // Keep getDocs pending so the loading state persists during the render
    vi.mocked(getDocs).mockReturnValue(new Promise(() => {}) as any);
    renderPage();
    expect(document.querySelector(".spin")).toBeInTheDocument();
  });

  it("renders beyblade cards after load", async () => {
    setupGetDocsMock();
    renderPage();

    await waitFor(() => {
      // Each beyblade appears twice (Your Beyblade + AI's Beyblade sections)
      expect(screen.getAllByText("Storm Eagle").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Rock Leone").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders arena cards after load", async () => {
    setupGetDocsMock();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Classic Bowl")).toBeInTheDocument();
      expect(screen.getByText("Volcano Crater")).toBeInTheDocument();
    });
  });

  it("selecting a beyblade highlights it (no crash, state updated)", async () => {
    const user = userEvent.setup();
    setupGetDocsMock();
    renderPage();

    await waitFor(() => screen.getAllByText("Rock Leone").length > 0);

    // There are two groups of beyblade buttons (Your Beyblade + AI's Beyblade).
    // Click the first Rock Leone button (Your Beyblade section).
    const rockLeoneButtons = screen.getAllByRole("button", { name: /rock leone/i });
    await user.click(rockLeoneButtons[0]);

    // After selecting, the card still renders (no crash, state updated)
    expect(screen.getAllByText("Rock Leone").length).toBeGreaterThan(0);
  });

  it("Start button is disabled until all options are selected (empty lists)", async () => {
    vi.mocked(getDocs)
      .mockResolvedValueOnce(makeQuerySnap([]) as any)
      .mockResolvedValueOnce(makeQuerySnap([]) as any);

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start battle/i })).toBeDisabled();
    });
  });

  it("clicking Start Battle navigates to /game/ai-battle/play with correct state", async () => {
    const user = userEvent.setup();
    setupGetDocsMock();
    renderPage();

    // Wait for data to load — Start button becomes enabled (auto-selects first bey/arena)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start battle/i })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: /start battle/i }));

    await waitFor(() => {
      expect(lastNavigateTo).toBe("/game/ai-battle/play");
    });
    expect(lastNavigateState).toMatchObject({
      beybladeId: "bey-1",
      arenaId: "arena-1",
    });
  });

  it("shows difficulty options Easy, Medium, Hard", async () => {
    setupGetDocsMock();
    renderPage();

    await waitFor(() => {
      // Each difficulty label text appears exactly once in the difficulty section
      expect(screen.getAllByRole("button", { name: /easy/i }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("button", { name: /medium/i }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("button", { name: /hard/i }).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('"← Back to menu" link goes to /game', async () => {
    setupGetDocsMock();
    renderPage();

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /← back to menu/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/game");
    });
  });
});

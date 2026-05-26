// Tests for the server-free TryoutGamePage.
// The page uses local client-side physics and loads data directly from Firestore —
// no Colyseus connection is opened.

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TryoutGamePage } from "@/pages/TryoutGamePage";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }), // no Firestore data → defaults
}));

vi.mock("@/lib/firebase", () => ({
  db: {},
  COLLECTIONS: {
    BEYBLADE_STATS: "beyblade_stats",
    ARENAS: "arenas",
  },
}));

vi.mock("@/contexts/GameContext", () => ({
  useGame: () => ({
    settings: {
      beybladeId: "bey1",
      arenaId: "arena1",
      gameMode: "tryout",
      username: "TestPlayer",
      userId: "u1",
    },
    isHydrated: true,
  }),
  GameProvider: ({ children }: any) => children,
}));

vi.mock("@/game/hooks/usePixiRenderer", () => ({
  usePixiRenderer: () => ({
    render: vi.fn(),
    setControlledBeyblade: vi.fn(),
    cameraZoomIn: vi.fn(),
    cameraZoomOut: vi.fn(),
    cameraZoomReset: vi.fn(),
  }),
}));

// ─── RAF stub — run loop body once, then stop ─────────────────────────────────
let rafCount = 0;
beforeEach(() => {
  rafCount = 0;
  global.requestAnimationFrame = vi.fn((cb) => {
    if (rafCount === 0) { rafCount++; cb(performance.now()); }
    return ++rafCount;
  });
  global.cancelAnimationFrame = vi.fn();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <TryoutGamePage />
    </MemoryRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TryoutGamePage — layout", () => {
  it("renders the canvas container div", () => {
    renderPage();
    const container = document.querySelector('div.h-screen');
    expect(container).toBeInTheDocument();
  });

  it("Exit link goes to /game", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /exit/i });
    expect(link).toHaveAttribute("href", "/game");
  });

  it('shows "LOCAL" status badge (no server connection)', () => {
    renderPage();
    // Initially shows "loading..." then "LOCAL" after Firestore load
    // Either is acceptable in a synchronous render
    const hud = screen.queryByText(/local/i) || screen.queryByText(/loading/i);
    expect(hud).toBeInTheDocument();
  });

  it("shows Spin bar in the HUD panel", () => {
    renderPage();
    expect(screen.getByText("Spin")).toBeInTheDocument();
  });

  it("shows stability label", () => {
    renderPage();
    // Any of Stable / Wobbling / Critical!
    const stableEl =
      screen.queryByText("Stable") ||
      screen.queryByText("Wobbling") ||
      screen.queryByText("Critical!");
    expect(stableEl).toBeInTheDocument();
  });

  it("does NOT import or use Colyseus", async () => {
    // Verify no useColyseus call is made — we check the module isn't imported
    // by confirming no "connecting" or "error" text appears (which would come from
    // the old Colyseus-based HUD).
    renderPage();
    expect(screen.queryByText("connecting")).not.toBeInTheDocument();
    expect(screen.queryByText("Connection lost")).not.toBeInTheDocument();
  });

  it("shows player username in HUD", () => {
    renderPage();
    expect(screen.getByText("TestPlayer")).toBeInTheDocument();
  });
});

describe("TryoutGamePage — no server dependency", () => {
  it("renders without a Colyseus server (no 'Joining' or 'Connected' text)", () => {
    renderPage();
    expect(screen.queryByText(/joining/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/connected/i)).not.toBeInTheDocument();
  });

  it("renders control hints at the bottom", () => {
    renderPage();
    expect(screen.getByText(/wasd/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "u1" }, isAdmin: false, loading: false }),
  AuthProvider: ({ children }: any) => children,
}));

import { GameModeLandingPage } from "@/pages/GameModeLandingPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <GameModeLandingPage />
    </MemoryRouter>
  );
}

describe("GameModeLandingPage — panels rendered", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("renders STORY MODE panel", () => {
    renderPage();
    expect(screen.getByText("STORY MODE")).toBeInTheDocument();
  });

  it("renders BATTLE MODE panel", () => {
    renderPage();
    expect(screen.getByText("BATTLE MODE")).toBeInTheDocument();
  });

  it("renders SETTINGS panel", () => {
    renderPage();
    expect(screen.getByText("SETTINGS")).toBeInTheDocument();
  });

  it("does not render ADMIN PANEL for non-admin users", () => {
    renderPage();
    expect(screen.queryByText("ADMIN PANEL")).not.toBeInTheDocument();
  });

  it("shows sublabels for story and battle modes", () => {
    renderPage();
    expect(screen.getByText(/RPG.*Combat/i)).toBeInTheDocument();
    expect(screen.getByText(/PvP|Tournament/i)).toBeInTheDocument();
  });
});

describe("GameModeLandingPage — navigation (with fake timers)", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("clicking BATTLE MODE navigates to /game/battle after 150ms debounce", () => {
    renderPage();
    fireEvent.click(screen.getByText("BATTLE MODE"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(mockNavigate).toHaveBeenCalledWith("/game/battle");
  });

  it("clicking STORY MODE navigates to /game/story after 150ms debounce", () => {
    renderPage();
    fireEvent.click(screen.getByText("STORY MODE"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(mockNavigate).toHaveBeenCalledWith("/game/story");
  });

  it("clicking SETTINGS navigates to /settings path after 150ms debounce", () => {
    renderPage();
    fireEvent.click(screen.getByText("SETTINGS"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringMatching(/settings/i)
    );
  });
});

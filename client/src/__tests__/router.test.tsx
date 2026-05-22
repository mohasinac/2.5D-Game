import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";

// ── Mock all pages so the test never imports Firebase / PixiJS directly ────────

vi.mock("@/pages/HomePage", () => ({ HomePage: () => <div>HOME</div> }));
vi.mock("@/pages/LoginPage", () => ({ LoginPage: () => <div>LOGIN</div> }));
vi.mock("@/pages/GameSelectPage", () => ({ GameSelectPage: () => <div>GAME</div> }));
vi.mock("@/pages/TryoutGamePage", () => ({ TryoutGamePage: () => <div>TRYOUT</div> }));
vi.mock("@/pages/BattleLobbyPage", () => ({ BattleLobbyPage: () => <div>LOBBY</div> }));
vi.mock("@/pages/BattleGamePage", () => ({ BattleGamePage: () => <div>BATTLE</div> }));
vi.mock("@/pages/AIBattleSetupPage", () => ({ AIBattleSetupPage: () => <div>AI-SETUP</div> }));
vi.mock("@/pages/AIBattleGamePage", () => ({ AIBattleGamePage: () => <div>AI-GAME</div> }));
vi.mock("@/pages/RendererDemoPage", () => ({ RendererDemoPage: () => <div>DEMO</div> }));

// Admin pages
vi.mock("@/pages/admin/AdminDashboardPage", () => ({ AdminDashboardPage: () => <div>ADMIN-DASHBOARD</div> }));
vi.mock("@/pages/admin/BeybladesListPage", () => ({ BeybladesListPage: () => <div>BEYBLADES</div> }));
vi.mock("@/pages/admin/BeybladeCreatePage", () => ({ BeybladeCreatePage: () => <div>BEYBLADE-CREATE</div> }));
vi.mock("@/pages/admin/BeybladeEditPage", () => ({ BeybladeEditPage: () => <div>BEYBLADE-EDIT</div> }));
vi.mock("@/pages/admin/ArenasListPage", () => ({ ArenasListPage: () => <div>ARENAS</div> }));
vi.mock("@/pages/admin/ArenaCreatePage", () => ({ ArenaCreatePage: () => <div>ARENA-CREATE</div> }));
vi.mock("@/pages/admin/ArenaEditPage", () => ({ ArenaEditPage: () => <div>ARENA-EDIT</div> }));
vi.mock("@/pages/admin/AssetsLibraryPage", () => ({ AssetsLibraryPage: () => <div>ASSETS</div> }));
vi.mock("@/pages/admin/assets/ArenaThemeAssetsPage", () => ({ ArenaThemeAssetsPage: () => <div>ARENA-THEME-ASSETS</div> }));
vi.mock("@/pages/admin/assets/ObstacleAssetsPage", () => ({ ObstacleAssetsPage: () => <div>OBSTACLE-ASSETS</div> }));
vi.mock("@/pages/admin/assets/TurretAssetsPage", () => ({ TurretAssetsPage: () => <div>TURRET-ASSETS</div> }));
vi.mock("@/pages/admin/assets/WaterBodyAssetsPage", () => ({ WaterBodyAssetsPage: () => <div>WATER-ASSETS</div> }));
vi.mock("@/pages/admin/assets/PortalAssetsPage", () => ({ PortalAssetsPage: () => <div>PORTAL-ASSETS</div> }));
vi.mock("@/pages/admin/assets/SoundAssetsPage", () => ({ SoundAssetsPage: () => <div>SOUND-ASSETS</div> }));
vi.mock("@/pages/admin/StatsPage", () => ({ StatsPage: () => <div>STATS</div> }));
vi.mock("@/pages/admin/SettingsPage", () => ({ SettingsPage: () => <div>SETTINGS</div> }));
vi.mock("@/pages/admin/ArenaTestPage", () => ({ ArenaTestPage: () => <div>ARENA-TEST</div> }));

// 2.5D part system pages
vi.mock("@/pages/admin/2d/PartSearchPage", () => ({ PartSearchPage: () => <div>PART-SEARCH</div> }));
vi.mock("@/pages/admin/2d/parts/PartListPage", () => ({ PartListPage: () => <div>PART-LIST</div> }));
vi.mock("@/pages/admin/2d/parts/PartCreatePage", () => ({ PartCreatePage: () => <div>PART-CREATE</div> }));
vi.mock("@/pages/admin/2d/parts/PartEditPage", () => ({ PartEditPage: () => <div>PART-EDIT</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemListPage", () => ({ BeybladeSystemListPage: () => <div>BEY-SYS-LIST</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemCreatePage", () => ({ BeybladeSystemCreatePage: () => <div>BEY-SYS-CREATE</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemEditPage", () => ({ BeybladeSystemEditPage: () => <div>BEY-SYS-EDIT</div> }));
vi.mock("@/pages/admin/2d/CompatibilityTagsPage", () => ({ CompatibilityTagsPage: () => <div>COMPAT-TAGS</div> }));

// ── Mock layouts and auth guards ───────────────────────────────────────────────

vi.mock("@/layouts/RootLayout", () => ({
  RootLayout: () => (
    <div>
      <Outlet />
    </div>
  ),
}));

vi.mock("@/layouts/AdminLayout", () => ({
  AdminLayout: () => (
    <div>
      <Outlet />
    </div>
  ),
}));

// Pass-through so protected content is always rendered in tests
vi.mock("@/components/auth/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/auth/AdminRoute", () => ({
  AdminRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock contexts so RootLayout / AdminLayout don't blow up
vi.mock("@/contexts/GameContext", () => ({
  GameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useGame: vi.fn(() => ({})),
}));

vi.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(() => ({ currentUser: null, isAdmin: false, loading: false, signOutUser: vi.fn() })),
}));

vi.mock("@/styles/theme", () => ({
  C: { bg0: "#000", purple: "#800080", white: "#fff", muted: "#aaa" },
}));

// ── Import the real router (all pages are already mocked above) ────────────────

import { router as appRouter } from "@/router";
import { createMemoryRouter, RouterProvider as _RouterProvider } from "react-router-dom";
import React from "react";

/**
 * Rebuild a memory router from the same route config but starting at `initialPath`.
 * We must use createMemoryRouter because the exported router is a BrowserRouter and
 * cannot be re-navigated in jsdom.
 */
function renderAt(initialPath: string) {
  // Extract the raw routes config from the BrowserRouter's internal state
  // The exported router has a `.routes` property (React Router v6 data router).
  const routes = (appRouter as unknown as { routes: Parameters<typeof createMemoryRouter>[0] }).routes;
  const memRouter = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(<RouterProvider router={memRouter} />);
}

describe("router", () => {
  it("/ renders HomePage", async () => {
    renderAt("/");
    expect(await screen.findByText("HOME")).toBeInTheDocument();
  });

  it("/login renders LoginPage", async () => {
    renderAt("/login");
    expect(await screen.findByText("LOGIN")).toBeInTheDocument();
  });

  it("/game renders GameSelectPage (ProtectedRoute pass-through)", async () => {
    renderAt("/game");
    expect(await screen.findByText("GAME")).toBeInTheDocument();
  });

  it("/game/tryout renders TryoutGamePage", async () => {
    renderAt("/game/tryout");
    expect(await screen.findByText("TRYOUT")).toBeInTheDocument();
  });

  it("/game/battle/lobby renders BattleLobbyPage", async () => {
    renderAt("/game/battle/lobby");
    expect(await screen.findByText("LOBBY")).toBeInTheDocument();
  });

  it("/game/battle/room-123 renders BattleGamePage", async () => {
    renderAt("/game/battle/room-123");
    expect(await screen.findByText("BATTLE")).toBeInTheDocument();
  });

  it("/game/ai-battle renders AIBattleSetupPage", async () => {
    renderAt("/game/ai-battle");
    expect(await screen.findByText("AI-SETUP")).toBeInTheDocument();
  });

  it("/game/ai-battle/play renders AIBattleGamePage", async () => {
    renderAt("/game/ai-battle/play");
    expect(await screen.findByText("AI-GAME")).toBeInTheDocument();
  });

  it("/admin renders AdminDashboardPage", async () => {
    renderAt("/admin");
    expect(await screen.findByText("ADMIN-DASHBOARD")).toBeInTheDocument();
  });

  it("unknown path /xyz does NOT render any known page content", async () => {
    renderAt("/xyz");
    // All known page labels should be absent — React Router renders nothing / 404
    expect(screen.queryByText("HOME")).not.toBeInTheDocument();
    expect(screen.queryByText("LOGIN")).not.toBeInTheDocument();
    expect(screen.queryByText("GAME")).not.toBeInTheDocument();
    expect(screen.queryByText("ADMIN-DASHBOARD")).not.toBeInTheDocument();
  });
});

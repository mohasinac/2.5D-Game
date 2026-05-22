import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { RendererDemoPage } from "./pages/RendererDemoPage";
import { GameSelectPage } from "./pages/GameSelectPage";
import { TryoutGamePage } from "./pages/TryoutGamePage";
import { BattleLobbyPage } from "./pages/BattleLobbyPage";
import { BattleGamePage } from "./pages/BattleGamePage";
import { AIBattleSetupPage } from "./pages/AIBattleSetupPage";
import { AIBattleGamePage } from "./pages/AIBattleGamePage";
import { TournamentListPage } from "./pages/TournamentListPage";
import { TournamentLobbyPage } from "./pages/TournamentLobbyPage";
import { TournamentBattleGamePage } from "./pages/TournamentBattleGamePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { TeamBattleLobbyPage } from "./pages/TeamBattleLobbyPage";
import { TeamBattleGamePage } from "./pages/TeamBattleGamePage";

// Admin pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { BeybladesListPage } from "./pages/admin/BeybladesListPage";
import { BeybladeCreatePage } from "./pages/admin/BeybladeCreatePage";
import { BeybladeEditPage } from "./pages/admin/BeybladeEditPage";
import { ArenasListPage } from "./pages/admin/ArenasListPage";
import { ArenaCreatePage } from "./pages/admin/ArenaCreatePage";
import { ArenaEditPage } from "./pages/admin/ArenaEditPage";
import { AssetsLibraryPage } from "./pages/admin/AssetsLibraryPage";
import { ArenaThemeAssetsPage } from "./pages/admin/assets/ArenaThemeAssetsPage";
import { ObstacleAssetsPage } from "./pages/admin/assets/ObstacleAssetsPage";
import { TurretAssetsPage } from "./pages/admin/assets/TurretAssetsPage";
import { WaterBodyAssetsPage } from "./pages/admin/assets/WaterBodyAssetsPage";
import { PortalAssetsPage } from "./pages/admin/assets/PortalAssetsPage";
import { SoundAssetsPage } from "./pages/admin/assets/SoundAssetsPage";
import { ParticlePresetsPage } from "./pages/admin/assets/ParticlePresetsPage";
import { StatsPage } from "./pages/admin/StatsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { ArenaTestPage } from "./pages/admin/ArenaTestPage";
import { TournamentsListPage } from "./pages/admin/TournamentsListPage";
import { TournamentCreatePage } from "./pages/admin/TournamentCreatePage";
import { TournamentDetailPage } from "./pages/admin/TournamentDetailPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AIVsAITestPage } from "./pages/admin/AIVsAITestPage";

// 2.5D part system pages
import { PartSearchPage } from "./pages/admin/2d/PartSearchPage";
import { PartListPage } from "./pages/admin/2d/parts/PartListPage";
import { PartCreatePage } from "./pages/admin/2d/parts/PartCreatePage";
import { PartEditPage } from "./pages/admin/2d/parts/PartEditPage";
import { BeybladeSystemListPage } from "./pages/admin/2d/beyblade-systems/BeybladeSystemListPage";
import { BeybladeSystemCreatePage } from "./pages/admin/2d/beyblade-systems/BeybladeSystemCreatePage";
import { BeybladeSystemEditPage } from "./pages/admin/2d/beyblade-systems/BeybladeSystemEditPage";
import { CompatibilityTagsPage } from "./pages/admin/2d/CompatibilityTagsPage";

// 2.5D arena system pages
import { ArenaSystemListPage } from "./pages/admin/arena-systems/ArenaSystemListPage";
import { ArenaSystemCreatePage } from "./pages/admin/arena-systems/ArenaSystemCreatePage";
import { ArenaSystemEditPage } from "./pages/admin/arena-systems/ArenaSystemEditPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "demo", element: <RendererDemoPage /> },
      { path: "game", element: <ProtectedRoute><GameSelectPage /></ProtectedRoute> },

      // ── Classic 2D pipeline ──
      { path: "game/2d/tryout", element: <ProtectedRoute><TryoutGamePage /></ProtectedRoute> },
      { path: "game/2d/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/2d/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/2d/ai-battle", element: <ProtectedRoute><AIBattleSetupPage /></ProtectedRoute> },
      { path: "game/2d/ai-battle/play", element: <ProtectedRoute><AIBattleGamePage /></ProtectedRoute> },
      { path: "game/2d/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/2d/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/2d/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },

      // ── 2.5D parts pipeline ──
      { path: "game/2.5d/tryout", element: <ProtectedRoute><TryoutGamePage /></ProtectedRoute> },
      { path: "game/2.5d/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/ai-battle", element: <ProtectedRoute><AIBattleSetupPage /></ProtectedRoute> },
      { path: "game/2.5d/ai-battle/play", element: <ProtectedRoute><AIBattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/2.5d/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },

      // ── Legacy routes (default to classic 2D pipeline via modeFromPath fallback) ──
      { path: "game/tryout", element: <ProtectedRoute><TryoutGamePage /></ProtectedRoute> },
      { path: "game/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/ai-battle", element: <ProtectedRoute><AIBattleSetupPage /></ProtectedRoute> },
      { path: "game/ai-battle/play", element: <ProtectedRoute><AIBattleGamePage /></ProtectedRoute> },
      { path: "game/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },
      // ── Team Battle (Phase K) ──
      { path: "game/2d/team-battle/lobby", element: <ProtectedRoute><TeamBattleLobbyPage /></ProtectedRoute> },
      { path: "game/2d/team-battle/:roomId", element: <ProtectedRoute><TeamBattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/team-battle/lobby", element: <ProtectedRoute><TeamBattleLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/team-battle/:roomId", element: <ProtectedRoute><TeamBattleGamePage /></ProtectedRoute> },

      // Leaderboard (public — no ProtectedRoute)
      { path: "leaderboard", element: <LeaderboardPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },

      // Beyblade CRUD
      { path: "beyblades", element: <BeybladesListPage /> },
      { path: "beyblades/create", element: <BeybladeCreatePage /> },
      { path: "beyblades/edit/:id", element: <BeybladeEditPage /> },

      // Arena CRUD (2D flat arenas)
      { path: "arenas", element: <ArenasListPage /> },
      { path: "arenas/create", element: <ArenaCreatePage /> },
      { path: "arenas/edit/:id", element: <ArenaEditPage /> },

      // Arena Systems CRUD (2.5D elevated arenas)
      { path: "arena-systems", element: <ArenaSystemListPage /> },
      { path: "arena-systems/create", element: <ArenaSystemCreatePage /> },
      { path: "arena-systems/:id", element: <ArenaSystemEditPage /> },


      // Asset CRUD library
      { path: "assets", element: <AssetsLibraryPage /> },
      { path: "assets/arena-themes", element: <ArenaThemeAssetsPage /> },
      { path: "assets/obstacles", element: <ObstacleAssetsPage /> },
      { path: "assets/turrets", element: <TurretAssetsPage /> },
      { path: "assets/water-bodies", element: <WaterBodyAssetsPage /> },
      { path: "assets/portals", element: <PortalAssetsPage /> },
      { path: "assets/sounds", element: <SoundAssetsPage /> },
      { path: "assets/particle-presets", element: <ParticlePresetsPage /> },

      // Utilities
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "arena-test", element: <ArenaTestPage /> },

      // Tournament admin
      { path: "tournaments", element: <TournamentsListPage /> },
      { path: "tournaments/create", element: <TournamentCreatePage /> },
      { path: "tournaments/:id", element: <TournamentDetailPage /> },

      // User management
      { path: "users", element: <UsersPage /> },

      // AI vs AI test lab — admin spectates two AIs fighting
      { path: "ai-vs-ai", element: <AIVsAITestPage /> },

      // ── 2.5D Part System — canonical URL ──
      { path: "2.5d/parts", element: <PartSearchPage /> },
      { path: "2.5d/parts/:partType", element: <PartListPage /> },
      { path: "2.5d/parts/:partType/create", element: <PartCreatePage /> },
      { path: "2.5d/parts/:partType/edit/:id", element: <PartEditPage /> },
      { path: "2.5d/beyblade-systems", element: <BeybladeSystemListPage /> },
      { path: "2.5d/beyblade-systems/create", element: <BeybladeSystemCreatePage /> },
      { path: "2.5d/beyblade-systems/edit/:id", element: <BeybladeSystemEditPage /> },
      { path: "2.5d/compatibility-tags", element: <CompatibilityTagsPage /> },
      { path: "2.5d/arena-systems", element: <ArenaSystemListPage /> },
      { path: "2.5d/arena-systems/create", element: <ArenaSystemCreatePage /> },
      { path: "2.5d/arena-systems/:id", element: <ArenaSystemEditPage /> },

      // ── Legacy /admin/2d/ routes (kept for back-compat; these manage 2.5D content) ──
      { path: "2d/parts", element: <PartSearchPage /> },
      { path: "2d/parts/:partType", element: <PartListPage /> },
      { path: "2d/parts/:partType/create", element: <PartCreatePage /> },
      { path: "2d/parts/:partType/edit/:id", element: <PartEditPage /> },
      { path: "2d/beyblade-systems", element: <BeybladeSystemListPage /> },
      { path: "2d/beyblade-systems/create", element: <BeybladeSystemCreatePage /> },
      { path: "2d/beyblade-systems/edit/:id", element: <BeybladeSystemEditPage /> },
      { path: "2d/compatibility-tags", element: <CompatibilityTagsPage /> },
    ],
  },
]);

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

// Admin pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { BeybladesListPage } from "./pages/admin/BeybladesListPage";
import { BeybladeCreatePage } from "./pages/admin/BeybladeCreatePage";
import { BeybladeEditPage } from "./pages/admin/BeybladeEditPage";
import { ArenasListPage } from "./pages/admin/ArenasListPage";
import { ArenaCreatePage } from "./pages/admin/ArenaCreatePage";
import { ArenaEditPage } from "./pages/admin/ArenaEditPage";
import { StadiumsListPage } from "./pages/admin/StadiumsListPage";
import { StadiumCreatePage } from "./pages/admin/StadiumCreatePage";
import { StadiumEditPage } from "./pages/admin/StadiumEditPage";
import { AssetsLibraryPage } from "./pages/admin/AssetsLibraryPage";
import { ArenaThemeAssetsPage } from "./pages/admin/assets/ArenaThemeAssetsPage";
import { ObstacleAssetsPage } from "./pages/admin/assets/ObstacleAssetsPage";
import { TurretAssetsPage } from "./pages/admin/assets/TurretAssetsPage";
import { WaterBodyAssetsPage } from "./pages/admin/assets/WaterBodyAssetsPage";
import { PortalAssetsPage } from "./pages/admin/assets/PortalAssetsPage";
import { SoundAssetsPage } from "./pages/admin/assets/SoundAssetsPage";
import { StatsPage } from "./pages/admin/StatsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { ArenaTestPage } from "./pages/admin/ArenaTestPage";

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
      { path: "game/tryout", element: <ProtectedRoute><TryoutGamePage /></ProtectedRoute> },
      { path: "game/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
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

      // Arena CRUD
      { path: "arenas", element: <ArenasListPage /> },
      { path: "arenas/create", element: <ArenaCreatePage /> },
      { path: "arenas/edit/:id", element: <ArenaEditPage /> },

      // Stadium CRUD
      { path: "stadiums", element: <StadiumsListPage /> },
      { path: "stadiums/create", element: <StadiumCreatePage /> },
      { path: "stadiums/edit/:id", element: <StadiumEditPage /> },

      // Asset CRUD library
      { path: "assets", element: <AssetsLibraryPage /> },
      { path: "assets/arena-themes", element: <ArenaThemeAssetsPage /> },
      { path: "assets/obstacles", element: <ObstacleAssetsPage /> },
      { path: "assets/turrets", element: <TurretAssetsPage /> },
      { path: "assets/water-bodies", element: <WaterBodyAssetsPage /> },
      { path: "assets/portals", element: <PortalAssetsPage /> },
      { path: "assets/sounds", element: <SoundAssetsPage /> },

      // Utilities
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "arena-test", element: <ArenaTestPage /> },
    ],
  },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

// Mock / sandbox pages (no auth required)
import { BeybladeRendererPage } from "./pages/mock/BeybladeRendererPage";
import { ArenaMockPage } from "./pages/mock/ArenaMockPage";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GameModeLandingPage } from "./pages/GameModeLandingPage";
import { GameModeSelectPage } from "./pages/GameModeSelectPage";
import { GameHubPage } from "./pages/GameHubPage";
import { StoryModeCardsPage } from "./pages/StoryModeCardsPage";
import { BattleModeCardsPage } from "./pages/BattleModeCardsPage";
import { GameRoomPage } from "./pages/GameRoomPage";
import { RendererDemoPage } from "./pages/RendererDemoPage";
import { AdminPlaceholderPage } from "./pages/admin/AdminPlaceholderPage";

// Player-facing pages
import MyBeysPage from "./pages/MyBeysPage";
import PlayerSettingsPage from "./pages/SettingsPage";
import TutorialPage from "./pages/TutorialPage";
import ProfilePage from "./pages/ProfilePage";
import EpisodeIntroPage from "./pages/EpisodeIntroPage";
import EpisodeOutroPage from "./pages/EpisodeOutroPage";
import ReplayViewerPage from "./pages/ReplayViewerPage";
import NotFoundPage from "./pages/NotFoundPage";

import { lazy, Suspense } from "react";

const RPGRouteSelectPage = lazy(() => import("./rpg/pages/RPGRouteSelectPage"));
const RPGGamePage = lazy(() => import("./rpg/pages/RPGGamePage"));
const RPGWorldMapPage = lazy(() => import("./rpg/pages/RPGWorldMapPage"));
const StoryBattleGamePage = lazy(() => import("./rpg/pages/StoryBattleGamePage"));

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full p-8"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/mock/beyblade",
    element: <BeybladeRendererPage />,
  },
  {
    path: "/mock/arena",
    element: <ArenaMockPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <GameModeLandingPage /> },
      { path: "demo", element: <RendererDemoPage /> },

      // ── Game flow ──
      { path: "game", element: <ProtectedRoute><GameModeSelectPage /></ProtectedRoute> },
      { path: "game/hub", element: <ProtectedRoute><GameHubPage /></ProtectedRoute> },
      { path: "game/battle", element: <ProtectedRoute><BattleModeCardsPage /></ProtectedRoute> },
      { path: "game/story", element: <ProtectedRoute><StoryModeCardsPage /></ProtectedRoute> },
      { path: "game/room", element: <ProtectedRoute><GameRoomPage /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute><Navigate to="/game/settings" replace /></ProtectedRoute> },

      // Redirect legacy tryout/ai-battle paths
      { path: "game/tryout", element: <Navigate to="/game/battle" replace /> },
      { path: "game/tryout/setup", element: <Navigate to="/game/battle" replace /> },
      { path: "game/tryout/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/ai-battle", element: <Navigate to="/game/battle" replace /> },
      { path: "game/ai-battle/play", element: <Navigate to="/game/battle" replace /> },

      // ── Player-facing pages ──
      { path: "game/my-beys", element: <ProtectedRoute><MyBeysPage /></ProtectedRoute> },
      { path: "game/settings", element: <ProtectedRoute><PlayerSettingsPage /></ProtectedRoute> },
      { path: "game/tutorial", element: <ProtectedRoute><TutorialPage /></ProtectedRoute> },
      { path: "game/story/episode/:episodeId/intro", element: <ProtectedRoute><EpisodeIntroPage /></ProtectedRoute> },
      { path: "game/story/episode/:episodeId/outro", element: <ProtectedRoute><EpisodeOutroPage /></ProtectedRoute> },
      { path: "game/replay/:matchId", element: <ProtectedRoute><ReplayViewerPage /></ProtectedRoute> },
      { path: "game/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "game/profile/:userId", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },

      // ── RPG Story Mode ──
      { path: "rpg", element: <ProtectedRoute><SuspenseWrap><RPGRouteSelectPage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/game", element: <ProtectedRoute><SuspenseWrap><RPGGamePage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/world-map", element: <ProtectedRoute><SuspenseWrap><RPGWorldMapPage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/battle/:roomId", element: <ProtectedRoute><SuspenseWrap><StoryBattleGamePage /></SuspenseWrap></ProtectedRoute> },

      // 404 catch-all
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminPlaceholderPage /></AdminRoute>,
  },
]);

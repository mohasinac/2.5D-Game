import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GameModeLandingPage } from "./pages/GameModeLandingPage";
import { GameModeSelectPage } from "./pages/GameModeSelectPage";
import { StoryModeCardsPage } from "./pages/StoryModeCardsPage";
import { BattleModeCardsPage } from "./pages/BattleModeCardsPage";
import { GameRoomPage } from "./pages/GameRoomPage";
import { RendererDemoPage } from "./pages/RendererDemoPage";
import { BattleLobbyPage } from "./pages/BattleLobbyPage";
import { BattleGamePage } from "./pages/BattleGamePage";
import { TournamentListPage } from "./pages/TournamentListPage";
import { TournamentLobbyPage } from "./pages/TournamentLobbyPage";
import { TournamentBattleGamePage } from "./pages/TournamentBattleGamePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { TeamBattleLobbyPage } from "./pages/TeamBattleLobbyPage";
import { TeamBattleGamePage } from "./pages/TeamBattleGamePage";

// New player-facing pages
import MyBeysPage from "./pages/MyBeysPage";
import PlayerSettingsPage from "./pages/SettingsPage";
import TutorialPage from "./pages/TutorialPage";
import StorySelectPage from "./pages/StorySelectPage";
import ProfilePage from "./pages/ProfilePage";
import MatchHistoryPage from "./pages/MatchHistoryPage";
import SpectatorLobbyPage from "./pages/SpectatorLobbyPage";
import EpisodeIntroPage from "./pages/EpisodeIntroPage";
import EpisodeOutroPage from "./pages/EpisodeOutroPage";
import ReplayViewerPage from "./pages/ReplayViewerPage";

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
import { BitBeastAssetsPage } from "./pages/admin/assets/BitBeastAssetsPage";
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
import { TournamentEditPage } from "./pages/admin/TournamentEditPage";
import { AIBattlesPage } from "./pages/admin/AIBattlesPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AIVsAITestPage } from "./pages/admin/AIVsAITestPage";

// Element type management
import { ElementTypesListPage } from "./pages/admin/ElementTypesListPage";
import { ElementTypeEditPage } from "./pages/admin/ElementTypeEditPage";

// M11: Custom enum admin pages
import BehaviorDefsPage from "./pages/admin/BehaviorDefsPage";
import ComboEffectsPage from "./pages/admin/ComboEffectsPage";
import AnimationPresetsPage from "./pages/admin/AnimationPresetsPage";
import RoundModifiersPage from "./pages/admin/RoundModifiersPage";
import MechanicDefsPage from "./pages/admin/MechanicDefsPage";
import GimmickDefsPage from "./pages/admin/GimmickDefsPage";
import GeometryDefsPage from "./pages/admin/GeometryDefsPage";
import StatDefsPage from "./pages/admin/StatDefsPage";

// Catalog CRUD pages
import { CombosPage } from "./pages/admin/CombosPage";
import { SpecialMovesPage } from "./pages/admin/SpecialMovesPage";
import { TurretAttackTypesPage } from "./pages/admin/TurretAttackTypesPage";
import { ArenaFeatureConfigsPage } from "./pages/admin/ArenaFeatureConfigsPage";
import { BeyLinkConfigsPage } from "./pages/admin/BeyLinkConfigsPage";
import { PartMaterialsPage } from "./pages/admin/PartMaterialsPage";

// Preset Def CRUD pages
import { TipShapeDefsPage } from "./pages/admin/TipShapeDefsPage";
import { CoreGimmickDefsPage } from "./pages/admin/CoreGimmickDefsPage";
import { AttackTypeDefsPage } from "./pages/admin/AttackTypeDefsPage";
import { ArenaThemeDefsPage } from "./pages/admin/ArenaThemeDefsPage";
import { ArenaShapeDefsPage } from "./pages/admin/ArenaShapeDefsPage";
import { BowlProfileDefsPage } from "./pages/admin/BowlProfileDefsPage";
import { TriggerTypeDefsPage } from "./pages/admin/TriggerTypeDefsPage";
import { StatEventDefsPage } from "./pages/admin/StatEventDefsPage";
import { PartLayerDefsPage } from "./pages/admin/PartLayerDefsPage";
import { SpecialInteractionDefsPage } from "./pages/admin/SpecialInteractionDefsPage";
import { TiltPresetDefsPage } from "./pages/admin/TiltPresetDefsPage";
import { DifficultyDefsPage } from "./pages/admin/DifficultyDefsPage";
import { FeatureAnimationDefsPage } from "./pages/admin/FeatureAnimationDefsPage";
import { PortalColorDefsPage } from "./pages/admin/PortalColorDefsPage";
import { PartShapeDefsPage } from "./pages/admin/PartShapeDefsPage";
import { WearPresetDefsPage } from "./pages/admin/WearPresetDefsPage";
import { ObstacleTagDefsPage } from "./pages/admin/ObstacleTagDefsPage";
import { BeyTypeDefsPage } from "./pages/admin/BeyTypeDefsPage";
import { ResetConditionDefsPage } from "./pages/admin/ResetConditionDefsPage";
import { LiquidTypeDefsPage } from "./pages/admin/LiquidTypeDefsPage";
import { HazardTypeDefsPage } from "./pages/admin/HazardTypeDefsPage";
import { ElementStatDefsPage } from "./pages/admin/ElementStatDefsPage";
import { ArenaTemplateDefsPage } from "./pages/admin/ArenaTemplateDefsPage";
import { RPGTriggerModeDefsPage } from "./pages/admin/RPGTriggerModeDefsPage";
import { RPGFacingDefsPage } from "./pages/admin/RPGFacingDefsPage";
import { GimmickSynergiesPage } from "./pages/admin/GimmickSynergiesPage";
import { BeyAccessoriesPage } from "./pages/admin/BeyAccessoriesPage";
import { BeyAccessoryEditPage } from "./pages/admin/BeyAccessoryEditPage";
import { BoostPadDefsPage } from "./pages/admin/BoostPadDefsPage";
import { StatusConditionDefsPage } from "./pages/admin/StatusConditionDefsPage";

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

// Arena Floor Group pages
import ArenaFloorGroupListPage from "./pages/admin/ArenaFloorGroupListPage";
import ArenaFloorGroupEditorPage from "./pages/admin/ArenaFloorGroupEditorPage";

// ── RPG pages (lazy-loaded) ──
import { lazy, Suspense } from "react";
const RPGRouteSelectPage = lazy(() => import("./rpg/pages/RPGRouteSelectPage"));
const RPGGamePage = lazy(() => import("./rpg/pages/RPGGamePage"));
const RPGWorldMapPage = lazy(() => import("./rpg/pages/RPGWorldMapPage"));
const StoryBattleGamePage = lazy(() => import("./rpg/pages/StoryBattleGamePage"));

// ── RPG admin pages (lazy-loaded) ──
const RPGAdminDashboardPage = lazy(() => import("./pages/admin/rpg/RPGAdminDashboardPage"));
const RPGRegionListPage = lazy(() => import("./pages/admin/rpg/regions/RPGRegionListPage"));
const RPGRegionCreatePage = lazy(() => import("./pages/admin/rpg/regions/RPGRegionCreatePage"));
const RPGRegionEditPage = lazy(() => import("./pages/admin/rpg/regions/RPGRegionEditPage"));
const RPGMapListPage = lazy(() => import("./pages/admin/rpg/maps/RPGMapListPage"));
const RPGMapCreatePage = lazy(() => import("./pages/admin/rpg/maps/RPGMapCreatePage"));
const RPGMapEditPage = lazy(() => import("./pages/admin/rpg/maps/RPGMapEditPage"));
const RPGNPCListPage = lazy(() => import("./pages/admin/rpg/npcs/RPGNPCListPage"));
const RPGNPCCreatePage = lazy(() => import("./pages/admin/rpg/npcs/RPGNPCCreatePage"));
const RPGNPCEditPage = lazy(() => import("./pages/admin/rpg/npcs/RPGNPCEditPage"));
const RPGDialogueListPage = lazy(() => import("./pages/admin/rpg/dialogues/RPGDialogueListPage"));
const RPGDialogueCreatePage = lazy(() => import("./pages/admin/rpg/dialogues/RPGDialogueCreatePage"));
const RPGDialogueEditPage = lazy(() => import("./pages/admin/rpg/dialogues/RPGDialogueEditPage"));
const RPGQuestListPage = lazy(() => import("./pages/admin/rpg/quests/RPGQuestListPage"));
const RPGQuestCreatePage = lazy(() => import("./pages/admin/rpg/quests/RPGQuestCreatePage"));
const RPGQuestEditPage = lazy(() => import("./pages/admin/rpg/quests/RPGQuestEditPage"));
const RPGStoryEventListPage = lazy(() => import("./pages/admin/rpg/story-events/RPGStoryEventListPage"));
const RPGStoryEventCreatePage = lazy(() => import("./pages/admin/rpg/story-events/RPGStoryEventCreatePage"));
const RPGStoryEventEditPage = lazy(() => import("./pages/admin/rpg/story-events/RPGStoryEventEditPage"));
const RPGCutsceneListPage = lazy(() => import("./pages/admin/rpg/cutscenes/RPGCutsceneListPage"));
const RPGCutsceneCreatePage = lazy(() => import("./pages/admin/rpg/cutscenes/RPGCutsceneCreatePage"));
const RPGCutsceneEditPage = lazy(() => import("./pages/admin/rpg/cutscenes/RPGCutsceneEditPage"));
const RPGItemListPage = lazy(() => import("./pages/admin/rpg/items/RPGItemListPage"));
const RPGItemCreatePage = lazy(() => import("./pages/admin/rpg/items/RPGItemCreatePage"));
const RPGItemEditPage = lazy(() => import("./pages/admin/rpg/items/RPGItemEditPage"));
const RPGBadgeListPage = lazy(() => import("./pages/admin/rpg/badges/RPGBadgeListPage"));
const RPGBadgeCreatePage = lazy(() => import("./pages/admin/rpg/badges/RPGBadgeCreatePage"));
const RPGBadgeEditPage = lazy(() => import("./pages/admin/rpg/badges/RPGBadgeEditPage"));
const RPGLevelingConfigPage = lazy(() => import("./pages/admin/rpg/RPGLevelingConfigPage"));
const RPGArcListPage = lazy(() => import("./pages/admin/rpg/arcs/RPGArcListPage"));
const RPGArcCreatePage = lazy(() => import("./pages/admin/rpg/arcs/RPGArcCreatePage"));
const RPGArcEditPage = lazy(() => import("./pages/admin/rpg/arcs/RPGArcEditPage"));
const RPGRouteListPage = lazy(() => import("./pages/admin/rpg/routes/RPGRouteListPage"));
const RPGRouteCreatePage = lazy(() => import("./pages/admin/rpg/routes/RPGRouteCreatePage"));
const RPGRouteEditPage = lazy(() => import("./pages/admin/rpg/routes/RPGRouteEditPage"));
const RPGDefListPage = lazy(() => import("./pages/admin/rpg/definitions/RPGDefListPage"));
const RPGScenarioGeneratorPage = lazy(() => import("./pages/admin/rpg/scenario-generator/RPGScenarioGeneratorPage"));

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full p-8"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
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

      // ── New unified game flow ──
      { path: "game", element: <ProtectedRoute><GameModeSelectPage /></ProtectedRoute> },
      { path: "game/battle", element: <ProtectedRoute><BattleModeCardsPage /></ProtectedRoute> },
      { path: "game/story", element: <ProtectedRoute><StoryModeCardsPage /></ProtectedRoute> },
      { path: "game/room", element: <ProtectedRoute><GameRoomPage /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute><Navigate to="/game/settings" replace /></ProtectedRoute> },

      // ── PvP & tournament Colyseus rooms (server-authoritative) ──
      { path: "game/2d/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/2d/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/2d/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/2d/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/2d/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/2.5d/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },

      // ── Legacy redirects ──
      { path: "game/2d/tryout", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2d/tryout/setup", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2d/tryout/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2d/ai-battle", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2d/ai-battle/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2.5d/tryout", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2.5d/tryout/setup", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2.5d/tryout/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2.5d/ai-battle", element: <Navigate to="/game/battle" replace /> },
      { path: "game/2.5d/ai-battle/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/tryout", element: <Navigate to="/game/battle" replace /> },
      { path: "game/tryout/setup", element: <Navigate to="/game/battle" replace /> },
      { path: "game/tryout/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/ai-battle", element: <Navigate to="/game/battle" replace /> },
      { path: "game/ai-battle/play", element: <Navigate to="/game/battle" replace /> },
      { path: "game/battle/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/battle/:roomId", element: <ProtectedRoute><BattleGamePage /></ProtectedRoute> },
      { path: "game/royale/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/tournament/lobby", element: <ProtectedRoute><BattleLobbyPage /></ProtectedRoute> },
      { path: "game/tournament", element: <ProtectedRoute><TournamentListPage /></ProtectedRoute> },
      { path: "game/tournament/:id", element: <ProtectedRoute><TournamentLobbyPage /></ProtectedRoute> },
      { path: "game/tournament/battle/:tournamentId/:matchId", element: <ProtectedRoute><TournamentBattleGamePage /></ProtectedRoute> },
      // ── Player-facing pages ──
      { path: "game/my-beys", element: <ProtectedRoute><MyBeysPage /></ProtectedRoute> },
      { path: "game/settings", element: <ProtectedRoute><PlayerSettingsPage /></ProtectedRoute> },
      { path: "game/tutorial", element: <ProtectedRoute><TutorialPage /></ProtectedRoute> },
      { path: "game/story/episode/:episodeId/intro", element: <ProtectedRoute><EpisodeIntroPage /></ProtectedRoute> },
      { path: "game/story/episode/:episodeId/outro", element: <ProtectedRoute><EpisodeOutroPage /></ProtectedRoute> },
      { path: "game/replay/:matchId", element: <ProtectedRoute><ReplayViewerPage /></ProtectedRoute> },
      { path: "game/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "game/profile/:userId", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "game/history", element: <ProtectedRoute><MatchHistoryPage /></ProtectedRoute> },
      { path: "game/spectate", element: <ProtectedRoute><SpectatorLobbyPage /></ProtectedRoute> },

      // ── Team Battle (Phase K) ──
      { path: "game/2d/team-battle/lobby", element: <ProtectedRoute><TeamBattleLobbyPage /></ProtectedRoute> },
      { path: "game/2d/team-battle/:roomId", element: <ProtectedRoute><TeamBattleGamePage /></ProtectedRoute> },
      { path: "game/2.5d/team-battle/lobby", element: <ProtectedRoute><TeamBattleLobbyPage /></ProtectedRoute> },
      { path: "game/2.5d/team-battle/:roomId", element: <ProtectedRoute><TeamBattleGamePage /></ProtectedRoute> },

      // ── RPG Story Mode ──
      { path: "rpg", element: <ProtectedRoute><SuspenseWrap><RPGRouteSelectPage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/game", element: <ProtectedRoute><SuspenseWrap><RPGGamePage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/world-map", element: <ProtectedRoute><SuspenseWrap><RPGWorldMapPage /></SuspenseWrap></ProtectedRoute> },
      { path: "rpg/battle/:roomId", element: <ProtectedRoute><SuspenseWrap><StoryBattleGamePage /></SuspenseWrap></ProtectedRoute> },

      // Leaderboard (public — no ProtectedRoute)
      { path: "leaderboard", element: <LeaderboardPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },

      // Element Type CRUD
      { path: "element-types",        element: <ElementTypesListPage /> },
      { path: "element-types/create", element: <ElementTypeEditPage /> },
      { path: "element-types/:id",    element: <ElementTypeEditPage /> },

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

      // Arena Floor Groups (multi-floor linked arenas)
      { path: "arena-floor-groups", element: <ArenaFloorGroupListPage /> },
      { path: "arena-floor-groups/:id", element: <ArenaFloorGroupEditorPage /> },


      // Asset CRUD library
      { path: "assets", element: <AssetsLibraryPage /> },
      { path: "assets/arena-themes", element: <ArenaThemeAssetsPage /> },
      { path: "assets/obstacles", element: <ObstacleAssetsPage /> },
      { path: "assets/turrets", element: <TurretAssetsPage /> },
      { path: "assets/water-bodies", element: <WaterBodyAssetsPage /> },
      { path: "assets/portals", element: <PortalAssetsPage /> },
      { path: "assets/sounds", element: <SoundAssetsPage /> },
      { path: "assets/particle-presets", element: <ParticlePresetsPage /> },
      { path: "assets/bitbeasts", element: <BitBeastAssetsPage /> },

      // Utilities
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "arena-test", element: <ArenaTestPage /> },

      // Tournament admin
      { path: "tournaments", element: <TournamentsListPage /> },
      { path: "tournaments/create", element: <TournamentCreatePage /> },
      { path: "tournaments/:id/edit", element: <TournamentEditPage /> },
      { path: "tournaments/:id", element: <TournamentDetailPage /> },

      // AI Battles admin
      { path: "ai-battles", element: <AIBattlesPage /> },

      // User management
      { path: "users", element: <UsersPage /> },

      // AI vs AI test lab — admin spectates two AIs fighting
      { path: "ai-vs-ai", element: <AIVsAITestPage /> },

      // ── M11: Custom enum admin pages ──
      { path: "behavior-defs",      element: <BehaviorDefsPage /> },
      { path: "combo-effects",      element: <ComboEffectsPage /> },
      { path: "particle-presets",   element: <ParticlePresetsPage /> },
      { path: "animation-presets",  element: <AnimationPresetsPage /> },
      { path: "round-modifiers",    element: <RoundModifiersPage /> },
      { path: "mechanic-defs",      element: <MechanicDefsPage /> },
      { path: "gimmick-defs",       element: <GimmickDefsPage /> },
      { path: "gimmick-synergies",        element: <GimmickSynergiesPage /> },
      { path: "bey-accessories",          element: <BeyAccessoriesPage /> },
      { path: "bey-accessories/create",   element: <BeyAccessoryEditPage /> },
      { path: "bey-accessories/:id",      element: <BeyAccessoryEditPage /> },
      { path: "boost-pad-defs",           element: <BoostPadDefsPage /> },
      { path: "status-condition-defs",    element: <StatusConditionDefsPage /> },
      { path: "geometry-defs",            element: <GeometryDefsPage /> },
      { path: "stat-defs",          element: <StatDefsPage /> },

      // ── Catalog CRUD ──
      { path: "combos",                  element: <CombosPage /> },
      { path: "special-moves",           element: <SpecialMovesPage /> },
      { path: "turret-attack-types",     element: <TurretAttackTypesPage /> },
      { path: "arena-feature-configs",   element: <ArenaFeatureConfigsPage /> },
      { path: "bey-link-configs",        element: <BeyLinkConfigsPage /> },
      { path: "part-materials",          element: <PartMaterialsPage /> },

      // ── Preset Defs CRUD ──
      { path: "tip-shape-defs",    element: <TipShapeDefsPage /> },
      { path: "core-gimmick-defs", element: <CoreGimmickDefsPage /> },
      { path: "attack-type-defs",  element: <AttackTypeDefsPage /> },
      { path: "arena-theme-defs",  element: <ArenaThemeDefsPage /> },
      { path: "arena-shape-defs",  element: <ArenaShapeDefsPage /> },
      { path: "bowl-profile-defs", element: <BowlProfileDefsPage /> },
      { path: "trigger-type-defs", element: <TriggerTypeDefsPage /> },
      { path: "stat-event-defs",   element: <StatEventDefsPage /> },
      { path: "part-layer-defs",              element: <PartLayerDefsPage /> },
      { path: "special-interaction-defs",    element: <SpecialInteractionDefsPage /> },
      { path: "tilt-preset-defs",            element: <TiltPresetDefsPage /> },
      { path: "difficulty-defs",             element: <DifficultyDefsPage /> },
      { path: "feature-animation-defs",      element: <FeatureAnimationDefsPage /> },
      { path: "portal-color-defs",           element: <PortalColorDefsPage /> },
      { path: "part-shape-defs",             element: <PartShapeDefsPage /> },
      { path: "wear-preset-defs",            element: <WearPresetDefsPage /> },
      { path: "obstacle-tag-defs",           element: <ObstacleTagDefsPage /> },
      { path: "bey-type-defs",               element: <BeyTypeDefsPage /> },
      { path: "reset-condition-defs",        element: <ResetConditionDefsPage /> },
      { path: "liquid-type-defs",            element: <LiquidTypeDefsPage /> },
      { path: "hazard-type-defs",            element: <HazardTypeDefsPage /> },
      { path: "element-stat-defs",           element: <ElementStatDefsPage /> },
      { path: "arena-template-defs",         element: <ArenaTemplateDefsPage /> },
      { path: "rpg-trigger-mode-defs",       element: <RPGTriggerModeDefsPage /> },
      { path: "rpg-facing-defs",             element: <RPGFacingDefsPage /> },

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

      // ── RPG Story Mode Admin ──
      { path: "rpg", element: <SuspenseWrap><RPGAdminDashboardPage /></SuspenseWrap> },
      { path: "rpg/regions", element: <SuspenseWrap><RPGRegionListPage /></SuspenseWrap> },
      { path: "rpg/regions/create", element: <SuspenseWrap><RPGRegionCreatePage /></SuspenseWrap> },
      { path: "rpg/regions/:id", element: <SuspenseWrap><RPGRegionEditPage /></SuspenseWrap> },
      { path: "rpg/maps", element: <SuspenseWrap><RPGMapListPage /></SuspenseWrap> },
      { path: "rpg/maps/create", element: <SuspenseWrap><RPGMapCreatePage /></SuspenseWrap> },
      { path: "rpg/maps/:id", element: <SuspenseWrap><RPGMapEditPage /></SuspenseWrap> },
      { path: "rpg/npcs", element: <SuspenseWrap><RPGNPCListPage /></SuspenseWrap> },
      { path: "rpg/npcs/create", element: <SuspenseWrap><RPGNPCCreatePage /></SuspenseWrap> },
      { path: "rpg/npcs/:id", element: <SuspenseWrap><RPGNPCEditPage /></SuspenseWrap> },
      { path: "rpg/dialogues", element: <SuspenseWrap><RPGDialogueListPage /></SuspenseWrap> },
      { path: "rpg/dialogues/create", element: <SuspenseWrap><RPGDialogueCreatePage /></SuspenseWrap> },
      { path: "rpg/dialogues/:id", element: <SuspenseWrap><RPGDialogueEditPage /></SuspenseWrap> },
      { path: "rpg/quests", element: <SuspenseWrap><RPGQuestListPage /></SuspenseWrap> },
      { path: "rpg/quests/create", element: <SuspenseWrap><RPGQuestCreatePage /></SuspenseWrap> },
      { path: "rpg/quests/:id", element: <SuspenseWrap><RPGQuestEditPage /></SuspenseWrap> },
      { path: "rpg/story-events", element: <SuspenseWrap><RPGStoryEventListPage /></SuspenseWrap> },
      { path: "rpg/story-events/create", element: <SuspenseWrap><RPGStoryEventCreatePage /></SuspenseWrap> },
      { path: "rpg/story-events/:id", element: <SuspenseWrap><RPGStoryEventEditPage /></SuspenseWrap> },
      { path: "rpg/cutscenes", element: <SuspenseWrap><RPGCutsceneListPage /></SuspenseWrap> },
      { path: "rpg/cutscenes/create", element: <SuspenseWrap><RPGCutsceneCreatePage /></SuspenseWrap> },
      { path: "rpg/cutscenes/:id", element: <SuspenseWrap><RPGCutsceneEditPage /></SuspenseWrap> },
      { path: "rpg/items", element: <SuspenseWrap><RPGItemListPage /></SuspenseWrap> },
      { path: "rpg/items/create", element: <SuspenseWrap><RPGItemCreatePage /></SuspenseWrap> },
      { path: "rpg/items/:id", element: <SuspenseWrap><RPGItemEditPage /></SuspenseWrap> },
      { path: "rpg/badges", element: <SuspenseWrap><RPGBadgeListPage /></SuspenseWrap> },
      { path: "rpg/badges/create", element: <SuspenseWrap><RPGBadgeCreatePage /></SuspenseWrap> },
      { path: "rpg/badges/:id", element: <SuspenseWrap><RPGBadgeEditPage /></SuspenseWrap> },
      { path: "rpg/leveling", element: <SuspenseWrap><RPGLevelingConfigPage /></SuspenseWrap> },
      { path: "rpg/arcs", element: <SuspenseWrap><RPGArcListPage /></SuspenseWrap> },
      { path: "rpg/arcs/create", element: <SuspenseWrap><RPGArcCreatePage /></SuspenseWrap> },
      { path: "rpg/arcs/:id", element: <SuspenseWrap><RPGArcEditPage /></SuspenseWrap> },
      { path: "rpg/routes", element: <SuspenseWrap><RPGRouteListPage /></SuspenseWrap> },
      { path: "rpg/routes/create", element: <SuspenseWrap><RPGRouteCreatePage /></SuspenseWrap> },
      { path: "rpg/routes/:id", element: <SuspenseWrap><RPGRouteEditPage /></SuspenseWrap> },
      { path: "rpg/definitions/:collection", element: <SuspenseWrap><RPGDefListPage /></SuspenseWrap> },
      { path: "rpg/scenario-generator", element: <SuspenseWrap><RPGScenarioGeneratorPage /></SuspenseWrap> },

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

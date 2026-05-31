import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Outlet } from "react-router-dom";
import React from "react";

// ── Mock all pages to avoid Firebase/PixiJS imports ───────────────────────────

vi.mock("@/pages/GameModeLandingPage", () => ({ GameModeLandingPage: () => <div>LANDING</div> }));
vi.mock("@/pages/LoginPage", () => ({ LoginPage: () => <div>LOGIN</div> }));
vi.mock("@/pages/RegisterPage", () => ({ RegisterPage: () => <div>REGISTER</div> }));
vi.mock("@/pages/GameModeSelectPage", () => ({ GameModeSelectPage: () => <div>GAME-SELECT</div> }));
vi.mock("@/pages/BattleModeCardsPage", () => ({ BattleModeCardsPage: () => <div>BATTLE-CARDS</div> }));
vi.mock("@/pages/StoryModeCardsPage", () => ({ StoryModeCardsPage: () => <div>STORY-CARDS</div> }));
vi.mock("@/pages/GameRoomPage", () => ({ GameRoomPage: () => <div>GAME-ROOM</div> }));
vi.mock("@/pages/BattleLobbyPage", () => ({ BattleLobbyPage: () => <div>BATTLE-LOBBY</div> }));
vi.mock("@/pages/BattleGamePage", () => ({ BattleGamePage: () => <div>BATTLE-GAME</div> }));
vi.mock("@/pages/TournamentListPage", () => ({ TournamentListPage: () => <div>TOURNAMENT-LIST</div> }));
vi.mock("@/pages/TournamentLobbyPage", () => ({ TournamentLobbyPage: () => <div>TOURNAMENT-LOBBY</div> }));
vi.mock("@/pages/TournamentBattleGamePage", () => ({ TournamentBattleGamePage: () => <div>TOURNAMENT-BATTLE</div> }));
vi.mock("@/pages/LeaderboardPage", () => ({ LeaderboardPage: () => <div>LEADERBOARD</div> }));
vi.mock("@/pages/RendererDemoPage", () => ({ RendererDemoPage: () => <div>DEMO</div> }));
vi.mock("@/pages/TeamBattleLobbyPage", () => ({ TeamBattleLobbyPage: () => <div>TEAM-LOBBY</div> }));
vi.mock("@/pages/TeamBattleGamePage", () => ({ TeamBattleGamePage: () => <div>TEAM-BATTLE</div> }));
vi.mock("@/pages/MyBeysPage", () => ({ default: () => <div>MY-BEYS</div> }));
vi.mock("@/pages/SettingsPage", () => ({ default: () => <div>SETTINGS</div> }));
vi.mock("@/pages/TutorialPage", () => ({ default: () => <div>TUTORIAL</div> }));
vi.mock("@/pages/StorySelectPage", () => ({ default: () => <div>STORY-SELECT</div> }));
vi.mock("@/pages/ProfilePage", () => ({ default: () => <div>PROFILE</div> }));
vi.mock("@/pages/MatchHistoryPage", () => ({ default: () => <div>MATCH-HISTORY</div> }));
vi.mock("@/pages/SpectatorLobbyPage", () => ({ default: () => <div>SPECTATOR-LOBBY</div> }));
vi.mock("@/pages/EpisodeIntroPage", () => ({ default: () => <div>EP-INTRO</div> }));
vi.mock("@/pages/EpisodeOutroPage", () => ({ default: () => <div>EP-OUTRO</div> }));
vi.mock("@/pages/ReplayViewerPage", () => ({ default: () => <div>REPLAY</div> }));
vi.mock("@/pages/HomePage", () => ({ HomePage: () => <div>HOME-LEGACY</div> }));

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
vi.mock("@/pages/admin/assets/BitBeastAssetsPage", () => ({ BitBeastAssetsPage: () => <div>BITBEAST-ASSETS</div> }));
vi.mock("@/pages/admin/assets/ParticlePresetsPage", () => ({ ParticlePresetsPage: () => <div>PARTICLE-PRESETS</div> }));
vi.mock("@/pages/admin/StatsPage", () => ({ StatsPage: () => <div>STATS</div> }));
vi.mock("@/pages/admin/SettingsPage", () => ({ SettingsPage: () => <div>ADMIN-SETTINGS</div> }));
vi.mock("@/pages/admin/ArenaTestPage", () => ({ ArenaTestPage: () => <div>ARENA-TEST</div> }));
vi.mock("@/pages/admin/TournamentsListPage", () => ({ TournamentsListPage: () => <div>ADMIN-TOURNAMENTS</div> }));
vi.mock("@/pages/admin/TournamentCreatePage", () => ({ TournamentCreatePage: () => <div>TOURNAMENT-CREATE</div> }));
vi.mock("@/pages/admin/TournamentDetailPage", () => ({ TournamentDetailPage: () => <div>TOURNAMENT-DETAIL</div> }));
vi.mock("@/pages/admin/TournamentEditPage", () => ({ TournamentEditPage: () => <div>TOURNAMENT-EDIT</div> }));
vi.mock("@/pages/admin/AIBattlesPage", () => ({ AIBattlesPage: () => <div>AI-BATTLES</div> }));
vi.mock("@/pages/admin/UsersPage", () => ({ UsersPage: () => <div>USERS</div> }));
vi.mock("@/pages/admin/AIVsAITestPage", () => ({ AIVsAITestPage: () => <div>AI-VS-AI</div> }));
vi.mock("@/pages/admin/ElementTypesListPage", () => ({ ElementTypesListPage: () => <div>ELEMENT-TYPES</div> }));
vi.mock("@/pages/admin/ElementTypeEditPage", () => ({ ElementTypeEditPage: () => <div>ELEMENT-TYPE-EDIT</div> }));
vi.mock("@/pages/admin/BehaviorDefsPage", () => ({ default: () => <div>BEHAVIOR-DEFS</div> }));
vi.mock("@/pages/admin/ComboEffectsPage", () => ({ default: () => <div>COMBO-EFFECTS</div> }));
vi.mock("@/pages/admin/AnimationPresetsPage", () => ({ default: () => <div>ANIMATION-PRESETS</div> }));
vi.mock("@/pages/admin/RoundModifiersPage", () => ({ default: () => <div>ROUND-MODIFIERS</div> }));
vi.mock("@/pages/admin/MechanicDefsPage", () => ({ default: () => <div>MECHANIC-DEFS</div> }));
vi.mock("@/pages/admin/GimmickDefsPage", () => ({ default: () => <div>GIMMICK-DEFS</div> }));
vi.mock("@/pages/admin/GeometryDefsPage", () => ({ default: () => <div>GEOMETRY-DEFS</div> }));
vi.mock("@/pages/admin/StatDefsPage", () => ({ default: () => <div>STAT-DEFS</div> }));
vi.mock("@/pages/admin/CombosPage", () => ({ CombosPage: () => <div>COMBOS</div> }));
vi.mock("@/pages/admin/SpecialMovesPage", () => ({ SpecialMovesPage: () => <div>SPECIAL-MOVES</div> }));
vi.mock("@/pages/admin/TurretAttackTypesPage", () => ({ TurretAttackTypesPage: () => <div>TURRET-ATTACK-TYPES</div> }));
vi.mock("@/pages/admin/ArenaFeatureConfigsPage", () => ({ ArenaFeatureConfigsPage: () => <div>ARENA-FEATURE-CONFIGS</div> }));
vi.mock("@/pages/admin/BeyLinkConfigsPage", () => ({ BeyLinkConfigsPage: () => <div>BEY-LINK-CONFIGS</div> }));
vi.mock("@/pages/admin/PartMaterialsPage", () => ({ PartMaterialsPage: () => <div>PART-MATERIALS</div> }));
vi.mock("@/pages/admin/TipShapeDefsPage", () => ({ TipShapeDefsPage: () => <div>TIP-SHAPE-DEFS</div> }));
vi.mock("@/pages/admin/CoreGimmickDefsPage", () => ({ CoreGimmickDefsPage: () => <div>CORE-GIMMICK-DEFS</div> }));
vi.mock("@/pages/admin/AttackTypeDefsPage", () => ({ AttackTypeDefsPage: () => <div>ATTACK-TYPE-DEFS</div> }));
vi.mock("@/pages/admin/ArenaThemeDefsPage", () => ({ ArenaThemeDefsPage: () => <div>ARENA-THEME-DEFS</div> }));
vi.mock("@/pages/admin/ArenaShapeDefsPage", () => ({ ArenaShapeDefsPage: () => <div>ARENA-SHAPE-DEFS</div> }));
vi.mock("@/pages/admin/BowlProfileDefsPage", () => ({ BowlProfileDefsPage: () => <div>BOWL-PROFILE-DEFS</div> }));
vi.mock("@/pages/admin/TriggerTypeDefsPage", () => ({ TriggerTypeDefsPage: () => <div>TRIGGER-TYPE-DEFS</div> }));
vi.mock("@/pages/admin/StatEventDefsPage", () => ({ StatEventDefsPage: () => <div>STAT-EVENT-DEFS</div> }));
vi.mock("@/pages/admin/PartLayerDefsPage", () => ({ PartLayerDefsPage: () => <div>PART-LAYER-DEFS</div> }));
vi.mock("@/pages/admin/SpecialInteractionDefsPage", () => ({ SpecialInteractionDefsPage: () => <div>SPECIAL-INTERACTION-DEFS</div> }));
vi.mock("@/pages/admin/ArenaFloorGroupListPage", () => ({ default: () => <div>FLOOR-GROUP-LIST</div> }));
vi.mock("@/pages/admin/ArenaFloorGroupEditorPage", () => ({ default: () => <div>FLOOR-GROUP-EDITOR</div> }));
vi.mock("@/pages/admin/TiltPresetDefsPage", () => ({ TiltPresetDefsPage: () => <div>TILT-PRESET-DEFS</div> }));
vi.mock("@/pages/admin/DifficultyDefsPage", () => ({ DifficultyDefsPage: () => <div>DIFFICULTY-DEFS</div> }));
vi.mock("@/pages/admin/FeatureAnimationDefsPage", () => ({ FeatureAnimationDefsPage: () => <div>FEATURE-ANIMATION-DEFS</div> }));
vi.mock("@/pages/admin/PortalColorDefsPage", () => ({ PortalColorDefsPage: () => <div>PORTAL-COLOR-DEFS</div> }));
vi.mock("@/pages/admin/PartShapeDefsPage", () => ({ PartShapeDefsPage: () => <div>PART-SHAPE-DEFS</div> }));
vi.mock("@/pages/admin/WearPresetDefsPage", () => ({ WearPresetDefsPage: () => <div>WEAR-PRESET-DEFS</div> }));
vi.mock("@/pages/admin/ObstacleTagDefsPage", () => ({ ObstacleTagDefsPage: () => <div>OBSTACLE-TAG-DEFS</div> }));
vi.mock("@/pages/admin/BeyTypeDefsPage", () => ({ BeyTypeDefsPage: () => <div>BEY-TYPE-DEFS</div> }));
vi.mock("@/pages/admin/ResetConditionDefsPage", () => ({ ResetConditionDefsPage: () => <div>RESET-CONDITION-DEFS</div> }));
vi.mock("@/pages/admin/LiquidTypeDefsPage", () => ({ LiquidTypeDefsPage: () => <div>LIQUID-TYPE-DEFS</div> }));
vi.mock("@/pages/admin/HazardTypeDefsPage", () => ({ HazardTypeDefsPage: () => <div>HAZARD-TYPE-DEFS</div> }));
vi.mock("@/pages/admin/ElementStatDefsPage", () => ({ ElementStatDefsPage: () => <div>ELEMENT-STAT-DEFS</div> }));
vi.mock("@/pages/admin/ArenaTemplateDefsPage", () => ({ ArenaTemplateDefsPage: () => <div>ARENA-TEMPLATE-DEFS</div> }));
vi.mock("@/pages/admin/RPGTriggerModeDefsPage", () => ({ RPGTriggerModeDefsPage: () => <div>RPG-TRIGGER-MODE-DEFS</div> }));
vi.mock("@/pages/admin/RPGFacingDefsPage", () => ({ RPGFacingDefsPage: () => <div>RPG-FACING-DEFS</div> }));
vi.mock("@/pages/admin/GimmickSynergiesPage", () => ({ GimmickSynergiesPage: () => <div>GIMMICK-SYNERGIES</div> }));
vi.mock("@/pages/admin/BeyAccessoriesPage", () => ({ BeyAccessoriesPage: () => <div>BEY-ACCESSORIES</div> }));
vi.mock("@/pages/admin/BeyAccessoryEditPage", () => ({ BeyAccessoryEditPage: () => <div>BEY-ACCESSORY-EDIT</div> }));
vi.mock("@/pages/admin/BoostPadDefsPage", () => ({ BoostPadDefsPage: () => <div>BOOST-PAD-DEFS</div> }));
vi.mock("@/pages/admin/StatusConditionDefsPage", () => ({ StatusConditionDefsPage: () => <div>STATUS-CONDITION-DEFS</div> }));

// 2.5D part system pages
vi.mock("@/pages/admin/2d/PartSearchPage", () => ({ PartSearchPage: () => <div>PART-SEARCH</div> }));
vi.mock("@/pages/admin/2d/parts/PartListPage", () => ({ PartListPage: () => <div>PART-LIST</div> }));
vi.mock("@/pages/admin/2d/parts/PartCreatePage", () => ({ PartCreatePage: () => <div>PART-CREATE</div> }));
vi.mock("@/pages/admin/2d/parts/PartEditPage", () => ({ PartEditPage: () => <div>PART-EDIT</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemListPage", () => ({ BeybladeSystemListPage: () => <div>BEY-SYS-LIST</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemCreatePage", () => ({ BeybladeSystemCreatePage: () => <div>BEY-SYS-CREATE</div> }));
vi.mock("@/pages/admin/2d/beyblade-systems/BeybladeSystemEditPage", () => ({ BeybladeSystemEditPage: () => <div>BEY-SYS-EDIT</div> }));
vi.mock("@/pages/admin/2d/CompatibilityTagsPage", () => ({ CompatibilityTagsPage: () => <div>COMPAT-TAGS</div> }));

// Arena system pages
vi.mock("@/pages/admin/arena-systems/ArenaSystemListPage", () => ({ ArenaSystemListPage: () => <div>ARENA-SYS-LIST</div> }));
vi.mock("@/pages/admin/arena-systems/ArenaSystemCreatePage", () => ({ ArenaSystemCreatePage: () => <div>ARENA-SYS-CREATE</div> }));
vi.mock("@/pages/admin/arena-systems/ArenaSystemEditPage", () => ({ ArenaSystemEditPage: () => <div>ARENA-SYS-EDIT</div> }));

// Preset pages
vi.mock("@/pages/admin/presets/ArenaPresetsPage", () => ({ default: () => <div>ARENA-PRESETS</div> }));
vi.mock("@/pages/admin/presets/BeyPresetsPage", () => ({ default: () => <div>BEY-PRESETS</div> }));
vi.mock("@/pages/admin/presets/ComboPresetsPage", () => ({ default: () => <div>COMBO-PRESETS</div> }));
vi.mock("@/pages/admin/presets/MechanicPresetsPage", () => ({ default: () => <div>MECHANIC-PRESETS</div> }));
vi.mock("@/pages/admin/presets/GimmickPresetsPage", () => ({ default: () => <div>GIMMICK-PRESETS</div> }));
vi.mock("@/pages/admin/presets/SpecialMovePresetsPage", () => ({ default: () => <div>SPECIAL-MOVE-PRESETS</div> }));
vi.mock("@/pages/admin/presets/PartPresetsPage", () => ({ default: () => <div>PART-PRESETS</div> }));
vi.mock("@/pages/admin/presets/SystemPresetsPage", () => ({ default: () => <div>SYSTEM-PRESETS</div> }));
vi.mock("@/pages/admin/presets/ObstaclePresetsPage", () => ({ default: () => <div>OBSTACLE-PRESETS</div> }));
vi.mock("@/pages/admin/presets/FeatureGroupPresetsPage", () => ({ default: () => <div>FEATURE-GROUP-PRESETS</div> }));

// RPG pages (lazy loaded — mock as suspense-compatible)
vi.mock("@/pages/rpg/RPGRouteSelectPage", () => ({ RPGRouteSelectPage: () => <div>RPG-SELECT</div> }));
vi.mock("@/pages/rpg/RPGGamePage", () => ({ RPGGamePage: () => <div>RPG-GAME</div> }));
vi.mock("@/pages/rpg/RPGWorldMapPage", () => ({ RPGWorldMapPage: () => <div>RPG-WORLD-MAP</div> }));
vi.mock("@/pages/rpg/StoryBattleGamePage", () => ({ StoryBattleGamePage: () => <div>STORY-BATTLE</div> }));

// Also mock all RPG admin pages to avoid import errors
vi.mock("@/pages/admin/rpg/RPGDashboardPage", () => ({ default: () => <div>RPG-DASHBOARD</div> }));
vi.mock("@/pages/admin/rpg/RPGRegionsPage", () => ({ default: () => <div>RPG-REGIONS</div> }));
vi.mock("@/pages/admin/rpg/RPGMapsPage", () => ({ default: () => <div>RPG-MAPS</div> }));
vi.mock("@/pages/admin/rpg/RPGNPCsPage", () => ({ default: () => <div>RPG-NPCS</div> }));
vi.mock("@/pages/admin/rpg/RPGDialoguesPage", () => ({ default: () => <div>RPG-DIALOGUES</div> }));
vi.mock("@/pages/admin/rpg/RPGQuestsPage", () => ({ default: () => <div>RPG-QUESTS</div> }));
vi.mock("@/pages/admin/rpg/RPGStoryEventsPage", () => ({ default: () => <div>RPG-STORY-EVENTS</div> }));
vi.mock("@/pages/admin/rpg/RPGCutscenesPage", () => ({ default: () => <div>RPG-CUTSCENES</div> }));
vi.mock("@/pages/admin/rpg/RPGItemsPage", () => ({ default: () => <div>RPG-ITEMS</div> }));
vi.mock("@/pages/admin/rpg/RPGBadgesPage", () => ({ default: () => <div>RPG-BADGES</div> }));
vi.mock("@/pages/admin/rpg/RPGArcsPage", () => ({ default: () => <div>RPG-ARCS</div> }));
vi.mock("@/pages/admin/rpg/RPGRoutesPage", () => ({ default: () => <div>RPG-ROUTES</div> }));
vi.mock("@/pages/admin/rpg/RPGConfigPage", () => ({ default: () => <div>RPG-CONFIG</div> }));
vi.mock("@/pages/admin/rpg/RPGDefsPage", () => ({ default: () => <div>RPG-DEFS</div> }));
vi.mock("@/pages/admin/AICharacterProfilesPage", () => ({ default: () => <div>AI-CHARACTER-PROFILES</div> }));
vi.mock("@/pages/admin/AIBeyPersonalitiesPage", () => ({ default: () => <div>AI-BEY-PERSONALITIES</div> }));
vi.mock("@/pages/admin/AIDifficultyProfilesPage", () => ({ default: () => <div>AI-DIFFICULTY-PROFILES</div> }));

// Layouts & guards
vi.mock("@/layouts/RootLayout", () => ({
  RootLayout: () => <div><Outlet /></div>,
}));

vi.mock("@/layouts/AdminLayout", () => ({
  AdminLayout: () => <div><Outlet /></div>,
}));

vi.mock("@/components/auth/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/auth/AdminRoute", () => ({
  AdminRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

// ── Import the real router ─────────────────────────────────────────────────────

import { router as appRouter } from "@/router";

function renderAt(initialPath: string) {
  const routes = (appRouter as unknown as { routes: Parameters<typeof createMemoryRouter>[0] }).routes;
  const memRouter = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(<RouterProvider router={memRouter} />);
}

// ── Public routes ──────────────────────────────────────────────────────────────

describe("router — public routes", () => {
  it("/ renders GameModeLandingPage", async () => {
    renderAt("/");
    expect(await screen.findByText("LANDING")).toBeInTheDocument();
  });

  it("/login renders LoginPage", async () => {
    renderAt("/login");
    expect(await screen.findByText("LOGIN")).toBeInTheDocument();
  });

  it("/leaderboard renders LeaderboardPage (no auth required)", async () => {
    renderAt("/leaderboard");
    expect(await screen.findByText("LEADERBOARD")).toBeInTheDocument();
  });
});

// ── New game flow routes ───────────────────────────────────────────────────────

describe("router — new game flow", () => {
  it("/game renders GameModeSelectPage", async () => {
    renderAt("/game");
    expect(await screen.findByText("GAME-SELECT")).toBeInTheDocument();
  });

  it("/game/battle renders BattleModeCardsPage", async () => {
    renderAt("/game/battle");
    expect(await screen.findByText("BATTLE-CARDS")).toBeInTheDocument();
  });

  it("/game/story renders StoryModeCardsPage", async () => {
    renderAt("/game/story");
    expect(await screen.findByText("STORY-CARDS")).toBeInTheDocument();
  });

  it("/game/room renders GameRoomPage", async () => {
    renderAt("/game/room");
    expect(await screen.findByText("GAME-ROOM")).toBeInTheDocument();
  });
});

// ── Battle lobby routes ────────────────────────────────────────────────────────

describe("router — lobby routes", () => {
  it("/game/battle/lobby renders BattleLobbyPage", async () => {
    renderAt("/game/battle/lobby");
    expect(await screen.findByText("BATTLE-LOBBY")).toBeInTheDocument();
  });

  it("/game/royale/lobby renders BattleLobbyPage", async () => {
    renderAt("/game/royale/lobby");
    expect(await screen.findByText("BATTLE-LOBBY")).toBeInTheDocument();
  });

  it("/game/tournament/lobby renders BattleLobbyPage", async () => {
    renderAt("/game/tournament/lobby");
    expect(await screen.findByText("BATTLE-LOBBY")).toBeInTheDocument();
  });
});

// ── Legacy game routes (still active for Colyseus PvP) ────────────────────────

describe("router — legacy game routes still active", () => {
  it("/game/battle/room-123 renders BattleGamePage (legacy PvP)", async () => {
    renderAt("/game/battle/room-123");
    expect(await screen.findByText("BATTLE-GAME")).toBeInTheDocument();
  });

  it("/game/tournament renders TournamentListPage", async () => {
    renderAt("/game/tournament");
    expect(await screen.findByText("TOURNAMENT-LIST")).toBeInTheDocument();
  });
});

// ── Legacy redirects ───────────────────────────────────────────────────────────

describe("router — legacy redirects to /game/battle", () => {
  it("/game/tryout redirects to /game/battle", async () => {
    renderAt("/game/tryout");
    expect(await screen.findByText("BATTLE-CARDS")).toBeInTheDocument();
  });

  it("/game/ai-battle redirects to /game/battle", async () => {
    renderAt("/game/ai-battle");
    expect(await screen.findByText("BATTLE-CARDS")).toBeInTheDocument();
  });

  it("/game/tryout redirects to /game/battle", async () => {
    renderAt("/game/tryout");
    expect(await screen.findByText("BATTLE-CARDS")).toBeInTheDocument();
  });
});

// ── Player profile/history pages ──────────────────────────────────────────────

describe("router — player pages", () => {
  it("/game/profile renders ProfilePage", async () => {
    renderAt("/game/profile");
    expect(await screen.findByText("PROFILE")).toBeInTheDocument();
  });

  it("/game/history renders MatchHistoryPage", async () => {
    renderAt("/game/history");
    expect(await screen.findByText("MATCH-HISTORY")).toBeInTheDocument();
  });

  it("/game/spectate renders SpectatorLobbyPage", async () => {
    renderAt("/game/spectate");
    expect(await screen.findByText("SPECTATOR-LOBBY")).toBeInTheDocument();
  });

  it("/game/settings renders PlayerSettingsPage", async () => {
    renderAt("/game/settings");
    expect(await screen.findByText("SETTINGS")).toBeInTheDocument();
  });
});

// ── Admin routes ──────────────────────────────────────────────────────────────

describe("router — admin routes", () => {
  it("/admin renders AdminDashboardPage", async () => {
    renderAt("/admin");
    expect(await screen.findByText("ADMIN-DASHBOARD")).toBeInTheDocument();
  });

  it("/admin/beyblades renders BeybladesListPage", async () => {
    renderAt("/admin/beyblades");
    expect(await screen.findByText("BEYBLADES")).toBeInTheDocument();
  });

  it("/admin/2.5d/beyblade-systems renders BeybladeSystemListPage", async () => {
    renderAt("/admin/2.5d/beyblade-systems");
    expect(await screen.findByText("BEY-SYS-LIST")).toBeInTheDocument();
  });

  it("/admin/2.5d/parts renders PartSearchPage", async () => {
    renderAt("/admin/2.5d/parts");
    expect(await screen.findByText("PART-SEARCH")).toBeInTheDocument();
  });

  it("/admin/settings renders admin SettingsPage", async () => {
    renderAt("/admin/settings");
    expect(await screen.findByText("ADMIN-SETTINGS")).toBeInTheDocument();
  });
});

// ── 404 (unknown path) ────────────────────────────────────────────────────────

describe("router — unknown path", () => {
  it("/xyz does not render any known page", async () => {
    renderAt("/xyz");
    expect(screen.queryByText("LANDING")).not.toBeInTheDocument();
    expect(screen.queryByText("ADMIN-DASHBOARD")).not.toBeInTheDocument();
    expect(screen.queryByText("BATTLE-CARDS")).not.toBeInTheDocument();
  });
});

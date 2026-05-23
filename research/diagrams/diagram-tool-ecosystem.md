# Diagram 10 — Tool Ecosystem Map

Admin → Forms → Editors → Validators → Database → Compiler → Engine.
Populated with real discovered systems from Stage 0E admin audit.

**UPDATED**: Stage 0E complete. Real systems discovered from `app/admin/` (Next.js App Router) + `scripts/`. Note: admin panel is a Next.js app under `app/`; game client is Vite under `client/`.

```mermaid
flowchart TD
  subgraph AdminLayer["Admin Layer (client/src/pages/admin/)"]
    DASH[AdminDashboardPage.tsx\nDashboard + tournament stats card]
    TOURNEY_LIST[TournamentsListPage.tsx\nTournament management]
    TOURNEY_CREATE[TournamentCreatePage.tsx\nSchedule / type / bestOf / restrictions]
    TOURNEY_DETAIL[TournamentDetailPage.tsx\nBracket view + manual advance + force-fill AI]
    USERS[UsersPage.tsx\nUser role management user/admin]
    STATS[StatsPage.tsx\nMatch statistics + leaderboard]
    SETTINGS[SettingsPage.tsx\nGame-wide feature toggles]
    TWOD[admin/2d/ routes\n2.5D part library CRUD]
    BEY_ADMIN[Beyblade admin pages ✅\nbeyblade_stats CRUD\nbeyblades/ + beyblades/create/ + beyblades/edit/:id]
    ARENA_ADMIN[Arena admin pages ✅\narenas CRUD\narenas/ + stadiums/ + arena-config-new/]
    STATS_ADMIN[Stats page ✅\nbeyblade_stats + arenas READ only]
    SETTINGS_ADMIN[Settings page ⚠️ stub\nsettings collection]
  end

  subgraph Forms["Existing Forms (confirmed)"]
    BEY_FORM[BeybladeSystem editor\nStats + combos + special move + parts]
    PART_FORM[Part CRUD editors\nContactPoint / Pocket editors]
    ARENA_FORM[Arena editor\nArenaConfig JSON + features]
    ASSET_FORM[AssetCrudPage.tsx\nShared asset library GIF-aware]
    ENTITY_PICK[EntityPicker.tsx\nSearchable name dropdown + tabbed preview]
  end

  subgraph EditorComponents["Editor Components (confirmed)"]
    BEY_SYS_ED[beyblade-system/ editor\nBeybladeSystem CRUD]
    PART_ED[part-editor/ editors\nContactPoint editor + Pocket editor]
    ASSET_CRUD[AssetCrudPage\nGIF-aware PNG/JPG/WebP asset library]
  end

  subgraph NewAdminNeeded["New Admin Pages Needed (Stage 0E gap)"]
    MECH_ADMIN[/admin/mechanics ❌\nmechanic_defs CRUD]
    GIMM_ADMIN[/admin/gimmicks ❌\ngimmick_defs CRUD + mechanic recipe editor]
    CAM_ADMIN[/admin/camera-profiles ❌\ncamera_profiles CRUD]
    AUD_ADMIN[/admin/audio-profiles ❌\naudio_profiles CRUD]
    SCRIPT_SCRATCH[/admin/scripts/scratch ❌\nScratch-like block editor]
    SCRIPT_NODES[/admin/scripts/nodes ❌\nVisual node graph editor]
    SCRIPT_CODE[/admin/scripts/code ❌\nRaw script editor]
    SCRIPT_ADV[/admin/scripts/advanced ❌\nAdvanced node editor + live preview]
  end

  subgraph SeedLayer["Seed Scripts (scripts/)"]
    SEED_BEY[seed-beyblades.js ✅\nbeyblade_stats ~20 beys]
    SEED_ARENA[seed-arenas.js ✅\nArena presets]
    SEED_COMBO[seed-combos.js ✅\n8 combos]
    SEED_AI[seed-ai-battles.js ✅\n3 AI presets]
    SEED_TOURNEY[seed-tournament-ai-solo.js ✅\n4-bracket solo-vs-AI]
    SEED_MOVES[seed-special-moves.js ✅\nSpecial move registry]
    SEED_PARTS[seed-2d-parts.js ✅\n2.5D part library]
    SEED_SYS[seed-bey-systems.js ✅\n2.5D assembled configs]
    SEED_ARENA_SYS[seed-arena-systems.js ✅\nArena system configs]
    SEED_GIMM[seed-gimmick-defs.js ❌ NEW\nmechanic_defs + gimmick_defs]
    SEED_CAM[seed-camera-profiles.js ❌ NEW\ncamera_profiles]
    SEED_AUD[seed-audio-profiles.js ❌ NEW\naudio_profiles]
  end

  subgraph DBLayer["Firestore Collections"]
    DB_EXISTING["Existing collections:\nbeyblade_stats / arenas / combos\nspecial_moves / beyblade_parts\nbeyblade_systems / arena_systems\nmatches / player_stats / users\ntournaments / tournament_brackets\ntournament_participants / ai_battles\narena_theme_assets / obstacle_assets\nturret_assets / water_body_assets\nportal_assets / sound_assets / settings"]
    DB_NEW["New collections needed:\nmechanic_defs / gimmick_defs\ncamera_profiles / audio_profiles\nscript_definitions / script_editor_metadata\ncomposition_blocks"]
  end

  subgraph RuntimeLayer["Runtime Layer"]
    VALID[Validation]
    COMP[Compiler]
    STORE[Static Runtime Store]
    ENGINE[Engine]
  end

  AdminLayer --> Forms
  Forms --> EditorComponents
  AdminLayer --> DB_EXISTING
  NewAdminNeeded --> DB_NEW
  SeedLayer --> DB_EXISTING
  SeedLayer --> DB_NEW
  DB_EXISTING --> VALID
  DB_NEW --> VALID
  VALID --> COMP
  COMP --> STORE
  STORE --> ENGINE

  BEY_ADMIN --> BEY_FORM
  ARENA_ADMIN --> ARENA_FORM
  TWOD --> PART_FORM
  TWOD --> BEY_SYS_ED
```

## Admin Coverage Table (Stage 0E — to be validated against actual code)

| System | Purpose | Existing Capabilities | Identified Gaps |
|--------|---------|----------------------|-----------------|
| AdminDashboardPage.tsx | Dashboard + stats | Tournament stats card | mechanic/gimmick stats |
| TournamentsListPage.tsx | Tournament management | List, create, cancel | — |
| TournamentCreatePage.tsx | Create tournament | Schedule, type, bestOf, restrictions | — |
| TournamentDetailPage.tsx | Bracket management | View, manual advance, force-fill AI | — |
| UsersPage.tsx | User roles | user/admin role management | — |
| StatsPage.tsx | Match + leaderboard | All existing stats | — |
| SettingsPage.tsx | Feature toggles | Game-wide settings doc | — |
| admin/2d/ routes | 2.5D part CRUD | Part library full CRUD | — |
| BeybladeSystem editor | Bey assembly | Stats + gimmickIds + parts | gimmickIds multi-select (needs update) |
| Part CRUD editors | Part editing | ContactPoint + Pocket | — |
| AssetCrudPage.tsx | Asset library | GIF-aware PNG/JPG/WebP | — |
| EntityPicker.tsx | Searchable dropdowns | Searchable + tabbed preview | — |
| /admin/mechanics | mechanic_defs CRUD | ❌ ABSENT | Full new page needed |
| /admin/gimmicks | gimmick_defs CRUD | ❌ ABSENT | Full new page + recipe editor needed |
| /admin/camera-profiles | camera_profiles CRUD | ❌ ABSENT | Full new page needed |
| /admin/audio-profiles | audio_profiles CRUD | ❌ ABSENT | Full new page needed |
| /admin/scripts/* | Visual scripting editors | ❌ ABSENT | 4 new editor pages needed (Rule 15) |

## Forms Coverage Table (Stage 0E — to be validated)

| Form | Purpose | Existing Fields | Missing Features |
|------|---------|----------------|-----------------|
| Beyblade editor | Create/edit beys | stats + specialMoveId + comboIds + parts | gimmickIds multi-select + systemId field |
| Part editor | Create/edit parts | ContactPoint + geometry | behavior profile fields |
| Arena editor | Create/edit arenas | ArenaConfig JSON | GearRailConfig + ScoringZoneConfig + TornadoRidgeConfig + ZeroGConfig fields |
| Asset editor | Asset library CRUD | PNG/JPG/GIF/WebP | — |
| Mechanic editor | mechanic_defs CRUD | ❌ ABSENT | full form with params schema + handler ID |
| Gimmick editor | gimmick_defs CRUD | ❌ ABSENT | mechanic recipe visual editor |
| Camera profile editor | camera_profiles CRUD | ❌ ABSENT | per-trigger camera behavior form |
| Audio profile editor | audio_profiles CRUD | ❌ ABSENT | per-trigger audio cue form |
| Script editor (Scratch) | block-based scripting | ❌ ABSENT | full Scratch-like UI |
| Script editor (Nodes) | node graph scripting | ❌ ABSENT | full node graph UI |
| Script editor (Code) | raw script editing | ❌ ABSENT | Monaco-style editor |

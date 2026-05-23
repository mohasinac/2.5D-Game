# Diagram 8 — Data Flow (Database → Runtime)

The engine NEVER fetches directly from the database at runtime. All data is compiled into a Static Runtime Store at server startup, then preloaded into each game session synchronously during `onCreate()`.

```mermaid
flowchart TD
  subgraph Authoring["Authoring Layer (Firebase Firestore)"]
    DB_MECH[mechanic_defs\nMechanic type → params schema + handler IDs\nNEW — seeded by seed-gimmick-defs.js]
    DB_GIMM[gimmick_defs\nGimmick ID → mechanic recipe + mode configs\nNEW — seeded by seed-gimmick-defs.js]
    DB_BEY[beyblade_stats\nBeyblade configs + gimmickIds + systemId\nexisting + enriched by seed-beyblades.js]
    DB_ARENA[arenas\nArena configs (validated ArenaConfig JSONs)\nexisting + enriched by seed-arenas.js]
    DB_MOVE[special_moves\nSpecial move registry + steps mechanic chains\nexisting + enriched by seed-special-moves.js]
    DB_COMBO[combos\n8 combo registry\nexisting]
    DB_CAM[camera_profiles\nCamera behavior configs per mechanic/gimmick/special\nNEW]
    DB_AUD[audio_profiles\nAudio cue configs per mechanic/gimmick/special/arena\nNEW]
    DB_SCRIPT[script_definitions\nCompiled script definitions — gameplay truth\nNEW Rule 15]
    DB_BLOCKS[composition_blocks\nRegistered block types + schemas\nNEW Rule 15]
    DB_PARTS[beyblade_parts\n2.5D part library\nexisting]
    DB_SYS[beyblade_systems\nAssembled 2.5D configs\nexisting]
  end

  subgraph Pipeline["Compilation Pipeline (server startup — ONCE)"]
    VAL[Validation\nSchema checks, reference integrity,\nfield type validation]
    COMP[Compiler\nDB docs → strongly-typed runtime structs\nGimmick recipes expanded\nMechanic handlers linked]
    STORE[Static Runtime Store\nIn-memory cache built at server startup\nnever rebuilt during match]
  end

  subgraph Session["Game Session (per room — onCreate)"]
    PRELOAD[Room onCreate preload\nSYNCHRONOUS — reads from RuntimeStore\nnever async, never in tick loop]
    SESSION[Game Session Data\nAll data needed for this match\ncached on room instance]
    ENGINE[Engine / Physics\nSimulation uses session data only\nnever reads DB or RuntimeStore directly]
    SIM[Deterministic Simulation\n60Hz fixed tick\nseed from matchId → PRNG]
  end

  subgraph AdminLayer["Admin Layer (authoring tools)"]
    ADMIN_UI[Admin UI\n/admin/mechanics\n/admin/gimmicks\n/admin/beyblades\n/admin/arenas\n/admin/camera-profiles\n/admin/audio-profiles\n/admin/scripts/*]
    SEED[Seed Scripts\nscripts/seed-*.js\nIdempotent, safe to re-run]
    RESEARCH[Research Files\nresearch/phase-*.md\nSeed scripts generated from research]
  end

  DB_MECH --> VAL
  DB_GIMM --> VAL
  DB_BEY --> VAL
  DB_ARENA --> VAL
  DB_MOVE --> VAL
  DB_COMBO --> VAL
  DB_CAM --> VAL
  DB_AUD --> VAL
  DB_SCRIPT --> VAL
  DB_BLOCKS --> VAL
  DB_PARTS --> VAL
  DB_SYS --> VAL

  VAL --> COMP
  COMP --> STORE
  STORE --> PRELOAD
  PRELOAD --> SESSION
  SESSION --> ENGINE
  ENGINE --> SIM

  ADMIN_UI --> DB_MECH
  ADMIN_UI --> DB_GIMM
  ADMIN_UI --> DB_BEY
  ADMIN_UI --> DB_ARENA
  ADMIN_UI --> DB_MOVE
  ADMIN_UI --> DB_CAM
  ADMIN_UI --> DB_AUD
  ADMIN_UI --> DB_SCRIPT

  SEED --> DB_MECH
  SEED --> DB_GIMM
  SEED --> DB_BEY
  SEED --> DB_ARENA
  SEED --> DB_MOVE

  RESEARCH --> SEED

  ENGINE -.->|FORBIDDEN| DB_MECH
  ENGINE -.->|FORBIDDEN| DB_BEY
  ENGINE -.->|FORBIDDEN| DB_ARENA
```

## Critical Rules

| Rule | Constraint | Reason |
|------|-----------|--------|
| Never DB in tick | Engine tick is synchronous — no `await`, no Firebase calls | Performance, determinism, network independence |
| Never DB in tick | `setSimulationInterval` callback must be sync | CLAUDE.md critical constraint |
| Preload in onCreate | All session data loaded once, synchronously, before warmup | Prevents runtime delays |
| Static Runtime Store | Built at server startup, never rebuilt during match | Consistent across all rooms |
| Seed scripts → DB → Compile | Research data becomes seed scripts, not engine constants | Rule 7 — everything is data |
| Admin CRUD for all collections | All new Firestore collections need admin pages | Rule 7 — everything editable |

## Firestore Collections (Complete Map)

| Collection | Status | Admin UI | Seed Script |
|-----------|--------|---------|------------|
| `beyblade_stats` | ✅ exists | ✅ /admin/beyblades | ✅ seed-beyblades.js |
| `arenas` | ✅ exists | ✅ /admin/arenas | ✅ seed-arenas.js |
| `combos` | ✅ exists | ⚠️ partial | ✅ seed-combos.js |
| `special_moves` | ✅ exists | ⚠️ partial | ✅ seed-special-moves.js |
| `beyblade_parts` | ✅ exists | ✅ /admin/2d/ | ✅ seed-2d-parts.js |
| `beyblade_systems` | ✅ exists | ✅ /admin/2d/ | ✅ seed-bey-systems.js |
| `matches` | ✅ exists | ✅ stats | — |
| `player_stats` | ✅ exists | ✅ stats | — |
| `tournaments` | ✅ exists | ✅ /admin/tournaments | ✅ seed-tournament-ai-solo.js |
| `tournament_brackets` | ✅ exists | ✅ /admin/tournaments/:id | — |
| `tournament_participants` | ✅ exists | ✅ /admin/tournaments/:id | — |
| `ai_battles` | ✅ exists | ⚠️ none | ✅ seed-ai-battles.js |
| `mechanic_defs` | ❌ NEW | ❌ needs /admin/mechanics | ❌ seed-gimmick-defs.js (new) |
| `gimmick_defs` | ❌ NEW | ❌ needs /admin/gimmicks | ❌ seed-gimmick-defs.js (new) |
| `camera_profiles` | ❌ NEW | ❌ needs /admin/camera-profiles | ❌ seed-camera-profiles.js (new) |
| `audio_profiles` | ❌ NEW | ❌ needs /admin/audio-profiles | ❌ seed-audio-profiles.js (new) |
| `script_definitions` | ❌ NEW (Rule 15) | ❌ needs /admin/scripts/* | — |
| `script_editor_metadata` | ❌ NEW (Rule 15) | — (editor-side only) | — |
| `composition_blocks` | ❌ NEW (Rule 15) | ❌ needs /admin/scripts/catalog | — |

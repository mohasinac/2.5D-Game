---
batch: 000
stage: 0E
status: complete
---

## Stage 0E — Admin + Forms + Tooling Audit

**IMPORTANT DISCOVERY**: The project has TWO separate app directories:
- `client/` — Vite + React SPA (port 3001, game client)
- `app/` — Next.js App Router (admin panel, deployed on Vercel)

Admin pages are under `app/admin/` using Next.js App Router, NOT `client/src/pages/admin/`.
CLAUDE.md references are accurate for the game client; admin panel is a separate Next.js app.

---

## Admin Pages (app/admin/)

| Page File | Route | Purpose | Collections CRUD | Status |
|-----------|-------|---------|-----------------|--------|
| page.tsx | /admin | Hub dashboard, navigation links | READ only | ✅ exists |
| beyblades/page.tsx | /admin/beyblades | List + filter beyblades | beyblade_stats READ+DELETE | ✅ exists |
| beyblades/create/page.tsx | /admin/beyblades/create | Create beyblade (3-step wizard) | beyblade_stats CREATE | ✅ exists |
| beyblades/edit/[id]/page.tsx | /admin/beyblades/edit/:id | Edit beyblade | beyblade_stats UPDATE | ✅ exists |
| stadiums/page.tsx | /admin/stadiums | List stadiums (new arena config v2) | arenas READ+DELETE | ✅ exists |
| stadiums/create/page.tsx | /admin/stadiums/create | Create stadium (new wall system) | arenas CREATE | ✅ exists |
| stadiums/edit/[id]/page.tsx | /admin/stadiums/edit/:id | Edit stadium | arenas UPDATE | ✅ exists |
| arenas/page.tsx | /admin/arenas | List legacy arenas | arenas READ+DELETE | ✅ exists |
| stats/page.tsx | /admin/stats | Match + type distribution stats | beyblade_stats + arenas READ | ✅ exists |
| settings/page.tsx | /admin/settings | Settings (stub, redirects to /admin/settings/game) | settings | ⚠️ stub |
| arena-config-new/page.tsx | /admin/arena-config-new | Interactive arena configurator (new system) | arenas CREATE+UPDATE | ✅ exists |
| arena-systems/page.tsx | /admin/arena-systems | Informational comparison page | None | ✅ exists |
| arena-test/page.tsx | /admin/arena-test | Arena system test/demo | None (test only) | ✅ exists |

**Total: 13 admin pages**

---

## Admin Components (app/components/admin/ or similar)

| Component | Purpose | Fields Edited | Collection |
|-----------|---------|--------------|-----------|
| BeybladeEditor.tsx | Modal beyblade editor | Full stats + specials + combos | beyblade_stats |
| MultiStepBeybladeEditor.tsx | 3-step wizard: basic info → distribution → contact points | All beyblade fields | beyblade_stats |
| Step1BasicInfo.tsx | Name, image, type, spin direction | name, imageUrl, type, spinDirection | — (step) |
| Step2TypeDistribution.tsx | Attack/defense/stamina sliders | attackPoints, defensePoints, staminaPoints | — (step) |
| Step3ContactPoints.tsx | Contact point visual editor with spike placement | contactPoints[] | — (step) |
| BeybladeImageUploader.tsx | Image upload with editor | imageUrl → Firebase Storage | beyblade_stats + Storage |
| BeybladePreview.tsx | Live preview of stats + visual | Display only | — |
| BeybladeCard.tsx | List card with edit/delete/preview | — | — |
| BeybladeManagement.tsx | List container with filtering + CRUD | Manages fetch/delete state | beyblade_stats |
| ArenaConfiguratorNew.tsx | Full tabbed arena editor | Complete ArenaConfig | arenas |
| BasicsTab.tsx | Name, shape, theme, auto-rotate | Basic arena fields | — (tab) |
| WallsTab.tsx | Edge-based walls, brick patterns, exit zones | Wall edges config | — (tab) |
| WaterBodiesTab.tsx | Water body placement | waterBodies[] | — (tab) |
| PortalsTab.tsx | Portal placement + config | portals[] | — (tab) |
| SpeedPathsTab.tsx | Speed path (loop) config | speedPaths[] | — (tab) |
| ObstaclesTab.tsx | Obstacle placement (rock, pillar) | obstacles[] | — (tab) |
| PitsTab.tsx | Pit/trap zone config | pits[] | — (tab) |
| TurretsTab.tsx | Turret placement + attack type | turrets[] | — (tab) |
| ArenaPreviewBasic.tsx | Visual arena renderer | Display only | — |
| ArenaPreviewModal.tsx | Arena preview modal | Display only | — |
| ArenaCard.tsx | Arena list card | — | — |
| DeleteConfirmModal.tsx | Generic delete confirmation | — | — |

**Total: ~24 admin components. No mechanic/gimmick/camera/audio editors exist.**

---

## Seed Scripts (scripts/)

| Script | Collection(s) | Records | npm alias |
|--------|--------------|---------|-----------|
| seed-all.js | (orchestrator) | all | seed / seed:all / reseed |
| seed-admin.js | users | 1 | seed:admin |
| seed-settings.js | settings | 1 | seed:settings |
| seed-beyblades.js | beyblade_stats | 16–20 | seed:beyblades |
| seed-arenas.js | arenas | 12 | seed:arenas |
| seed-special-moves.js | special_moves | 4 | seed:special-moves |
| seed-combos.js | combos | 8 | — |
| seed-beyblade-systems.js | beyblade_systems | 4 | seed:bey-systems |
| seed-arena-systems.js | arena_systems | 4 | seed:arena-systems |
| seed-2d-parts.js | *_parts (7 collections) | 50+ | seed:2d-parts |
| seed-behavior-defs.js | behavior_defs | 50+ | seed:behavior-defs |
| seed-combo-effects.js | combo_effects | 8+ | seed:combo-effects |
| seed-particle-presets.js | particle_presets | 20+ | seed:particle-presets |
| seed-animation-presets.js | animation_presets | 15+ | seed:anim-presets |
| seed-element-types.js | element_type_configs | 10+ | seed:element-types |
| seed-turret-attack-types.js | turret_attack_types | 8+ | seed:turret-attack-types |
| seed-arena-feature-configs.js | arena_feature_configs | 10+ | seed:arena-feature-configs |
| seed-bey-link-configs.js | bey_link_configs | 10+ | seed:bey-link-configs |
| seed-ai-battles.js | matches (AI templates) | 10–20 | seed:ai-battles |
| seed-tournament-ai-solo.js | tournaments + brackets + participants | 5–10 | seed:tournament-ai-solo |
| seed-round-modifiers.js | round_modifiers | 8+ | seed:round-modifiers |
| check.js | — (verify only) | — | check |
| verify-firebase.js | — (verify only) | — | — |
| test-rooms.js | — (test only) | — | test:rooms |
| clear-all.js | ALL (destructive) | — | clear / clear:all |
| fix-admin-role.js | users | 1 | fix:admin |

**Total: 24 seed scripts covering 31+ Firestore collections**

---

## Firestore Collections (firebase.ts constants — 31 total)

### Existing collections (complete list):
```
beyblade_stats / arenas / matches / player_stats
arena_theme_assets / obstacle_assets / turret_assets / water_body_assets
portal_assets / sound_assets
bit_beast_parts / attack_ring_parts / weight_disk_parts / sub_parts
tip_parts / core_parts / casing_parts / spin_track_parts
beyblade_systems / arena_systems
special_moves / combos / settings
particle_presets / combo_effects / element_type_configs
turret_attack_types / arena_feature_configs / bey_link_configs
animation_presets / behavior_defs / round_modifiers
tournaments / tournament_participants / tournament_brackets
users / ai_battles (via matches)
```

### Key finding — behavior_defs already exists:
`behavior_defs` collection already has 50+ keywords organized into categories:
- stats (attackPoints, defensePoints, etc.)
- movement (orbit, dash, freeze, etc.)
- transformation (become_attack, become_defense, etc.)
- spawning (projectile, clone, etc.)
- arena effects (quake, wind, gravity_surge, etc.)
- 2.5D specific keywords

This is the **precursor to mechanic_defs + gimmick_defs** — it's a keyword library approach, not a structured mechanic registry. Migration path: `behavior_defs` → seed data for `mechanic_defs` and `gimmick_defs`.

---

## Visual Scripting / Node Editor Check

**Result: ABSENT**

No node editor, block editor, graph editor, Scratch-like editor, or visual scripting system exists anywhere in the codebase. The `behavior_defs` keyword library is the closest precursor — it stores named behavior keywords that could become composition blocks.

---

## Mechanic / Gimmick / Camera / Audio Admin Check

**Result: ABSENT**

| Searched Form | Result |
|--------------|--------|
| mechanic_defs CRUD | ❌ ABSENT |
| gimmick_defs CRUD | ❌ ABSENT |
| camera_profiles CRUD | ❌ ABSENT |
| audio_profiles CRUD | ❌ ABSENT |
| MechanicEditor component | ❌ ABSENT |
| GimmickEditor component | ❌ ABSENT |

---

## Admin Coverage Table (Rule 9)

| New Collection | Needs Admin UI | Existing Form Can Extend? | New Form Required? |
|---------------|---------------|--------------------------|-------------------|
| mechanic_defs | YES | ❌ No — behavior_defs seeder is closest but not CRUD UI | NEW page: /admin/mechanics |
| gimmick_defs | YES | ❌ No | NEW page: /admin/gimmicks + recipe editor |
| camera_profiles | YES | ❌ No | NEW page: /admin/camera-profiles |
| audio_profiles | YES | ❌ No | NEW page: /admin/audio-profiles |
| script_definitions | YES | ❌ No | NEW: 4 editor pages at /admin/scripts/* |
| script_editor_metadata | NO (editor-internal) | N/A | Auto-managed by editors |
| composition_blocks | YES (catalog view) | ❌ No | NEW page: /admin/scripts/catalog |
| gimmickIds on beyblade_stats | YES | ✅ YES — extend MultiStepBeybladeEditor Step 1 with gimmickIds multi-select | Extend existing wizard |
| systemId on beyblade_stats | YES | ✅ YES — add to Step 1 basics | Extend existing wizard |
| GearRailConfig on arenas | YES | ✅ YES — add GearRailsTab to ArenaConfiguratorNew | Extend existing wizard |
| ScoringZoneConfig on arenas | YES | ✅ YES — add to ArenaConfiguratorNew | Extend existing wizard |
| TornadoRidgeConfig on arenas | YES | ✅ YES — add to ArenaConfiguratorNew | Extend existing wizard |
| ZeroGConfig on arenas | YES | ✅ YES — add to ArenaConfiguratorNew | Extend existing wizard |

---

## Forms Table (Rule 9)

| Form | Purpose | Existing Fields | Missing Features |
|------|---------|----------------|-----------------|
| MultiStepBeybladeEditor | Create/edit beys | name + image + type + spin + attack/def/stam + contactPoints | gimmickIds multi-select, systemId dropdown |
| ArenaConfiguratorNew | Create/edit arenas | Walls, obstacles, water, portals, speed paths, pits, turrets | GearRailsTab, ScoringZonesTab, TornadoRidgeTab, ZeroGTab |
| BeybladeEditor | Modal edit | Same as wizard | gimmickIds, systemId |
| behavior_defs seed | Keyword library | 50+ behavior keywords | Not a CRUD UI — needs migration to mechanic_defs admin |

---

## Admin Table (Rule 9)

| System | Purpose | Capabilities | Gaps |
|--------|---------|-------------|------|
| Beyblade admin | Manage bey configs | Full CRUD + 3-step wizard + image upload + preview | gimmickIds + systemId fields missing |
| Arena admin (new) | Manage arenas | Full CRUD + tabbed editor + 8 feature tabs + preview | GearRail + ScoringZone + TornadoRidge + ZeroG tabs missing |
| Stats dashboard | View match stats | Type distribution, counts, averages | mechanic/gimmick stats not yet |
| Settings | Game toggles | enableAI, enableTournament, maintenanceMode, serverMessage | ⚠️ stub — needs full implementation |
| Tournament admin | Bracket management | Full tournament lifecycle CRUD | — |
| 2.5D part library | Part CRUD | Full 7-type part CRUD | behavior profile fields |

---

## Engine Tool Table (Rule 9)

| Tool | Purpose | Existing Support | Reuse Potential |
|------|---------|-----------------|-----------------|
| behavior_defs seed | Keyword library | 50+ behavioral keywords | Migrate to mechanic_defs seed input |
| arena_feature_configs seed | Arena feature presets | 10+ configs | Extend to support new feature types |
| particle_presets seed | VFX presets | 20+ named presets | Extend to camera_profiles / audio_profiles |
| animation_presets seed | Keyframe presets | 15+ named sequences | Extend to presentation trigger configs |
| ArenaConfiguratorNew | Arena editing | 8 feature tabs | Add 4 more tabs for new feature types |
| MultiStepBeybladeEditor | Bey editing | 3-step wizard | Add step 0 or extend step 1 for gimmickIds |
| seed-all.js | Orchestrator | --only, --skip, --clear, --reseed | Add seed-gimmick-defs.js to pipeline |

---

## Outliers Found

| Item | Why Unusual | Research Needed |
|------|------------|----------------|
| app/ vs client/ split | TWO separate apps in same repo — Next.js admin + Vite game client | Understand which has latest code for each feature |
| behavior_defs already seeded | 50+ keywords pre-exist — not in CLAUDE.md collections list | Read behavior_defs content to see overlap with planned mechanic_defs |
| arena_feature_configs exists | Not in CLAUDE.md collections list but is seeded | Check if this overlaps with planned gimmick_defs |
| seed-round-modifiers.js | round_modifiers collection not in CLAUDE.md | Read to check if relevant to mechanic system |
| API routes | Admin pages use /api/ routes (not direct Firestore) | Understand API route structure for new admin pages |

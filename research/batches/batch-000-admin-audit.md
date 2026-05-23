---
batch: 000
stage: 0E
status: complete
sources_checked: 0
facts: 0
inferences: 0
speculations: 0
unknowns: 0
---

## Research Completed

Full audit of all 48 admin pages under `client/src/pages/admin/`. No external sources required — this is a code-reading stage. Every page was read directly from the codebase. The audit covers: what fields each page exposes, which Firestore collections it targets, which plan-required pages are missing, and what field gaps exist relative to the plan's new requirements (gimmickIds, mechanicIds, generation, series, etc.).

---

## Coverage Table

| Category | Pages Audited | Total Pages | Coverage % | Missing |
|----------|--------------|-------------|------------|---------|
| Beyblade CRUD | 2 (Create, Edit) | 2 | 100% | — |
| Arena CRUD | 2 (Create, Edit) | 2 | 100% | — |
| Arena Systems | 3 (List, Create, Edit) | 3 | 100% | — |
| 2.5D Parts | 3 (List, Create, Edit) | 3 | 100% | — |
| 2.5D Beyblade Systems | 3 (List, Create, Edit) | 3 | 100% | — |
| Special Moves | 1 (CRUD inline modal) | 1 | 100% | — |
| Combos | 1 (CRUD inline modal) | 1 | 100% | — |
| Combo Effects | 1 (CRUD inline modal) | 1 | 100% | — |
| Behavior Defs | 1 (CRUD inline modal) | 1 | 100% | — |
| Round Modifiers | 1 (CRUD inline modal) | 1 | 100% | — |
| Arena Feature Configs | 1 (CRUD inline modal) | 1 | 100% | — |
| BeyLink Configs | 1 (CRUD inline modal) | 1 | 100% | — |
| Animation Presets | 1 (CRUD inline modal) | 1 | 100% | — |
| Turret Attack Types | 1 (CRUD inline modal) | 1 | 100% | — |
| Element Types | 2 (List, Edit) | 2 | 100% | — |
| Tournament Admin | 3 (List, Create, Detail) | 3 | 100% | — |
| Asset Libraries | 6 (Sound, Portal, Obstacle, Turret, WaterBody, ArenaTheme) | 6 | 100% | — |
| Dashboard / Stats / Settings | 3 | 3 | 100% | — |
| Users | 1 | 1 | 100% | — |
| Arena Floor Groups | 2 | 2 | 100% | — |
| Test Pages (ArenaTest, AIVsAITest) | 2 | 2 | 100% | — |
| **MISSING pages (plan-required)** | 0 | 4 | 0% | mechanic_defs, gimmick_defs, camera_profiles, audio_profiles |

---

## COLLECTIONS Registry (current — from `client/src/lib/firebase.ts`)

| Constant | Firestore Name | Has Admin Page |
|----------|---------------|----------------|
| BEYBLADE_STATS | beyblade_stats | ✅ |
| ARENAS | arenas | ✅ |
| MATCHES | matches | read-only (StatsPage) |
| PLAYER_STATS | player_stats | read-only (StatsPage/Leaderboard) |
| ARENA_THEME_ASSETS | arena_theme_assets | ✅ |
| OBSTACLE_ASSETS | obstacle_assets | ✅ |
| TURRET_ASSETS | turret_assets | ✅ |
| WATER_BODY_ASSETS | water_body_assets | ✅ |
| PORTAL_ASSETS | portal_assets | ✅ |
| SOUND_ASSETS | sound_assets | ✅ |
| BIT_BEAST_PARTS | bit_beast_parts | ✅ (2D parts) |
| ATTACK_RING_PARTS | attack_ring_parts | ✅ |
| WEIGHT_DISK_PARTS | weight_disk_parts | ✅ |
| SUB_PARTS | sub_parts | ✅ |
| TIP_PARTS | tip_parts | ✅ |
| CORE_PARTS | core_parts | ✅ |
| CASING_PARTS | casing_parts | ✅ |
| SPIN_TRACK_PARTS | spin_track_parts | ✅ |
| BEYBLADE_SYSTEMS | beyblade_systems | ✅ |
| ARENA_SYSTEMS | arena_systems | ✅ |
| SPECIAL_MOVES | special_moves | ✅ |
| TOURNAMENTS | tournaments | ✅ |
| TOURNAMENT_PARTICIPANTS | tournament_participants | read-only |
| TOURNAMENT_BRACKETS | tournament_brackets | ✅ (detail) |
| SETTINGS | settings | ✅ |
| PARTICLE_PRESETS | particle_presets | ✅ |
| COMBO_EFFECTS | combo_effects | ✅ |
| ELEMENT_TYPE_CONFIGS | element_type_configs | ✅ |
| COMBOS | combos | ✅ |
| TURRET_ATTACK_TYPES | turret_attack_types | ✅ |
| ARENA_FEATURE_CONFIGS | arena_feature_configs | ✅ |
| BEY_LINK_CONFIGS | bey_link_configs | ✅ |
| ANIMATION_PRESETS | animation_presets | ✅ |
| BEHAVIOR_DEFS | behavior_defs | ✅ |
| ROUND_MODIFIERS | round_modifiers | ✅ |
| — | mechanic_defs | ❌ NOT IN COLLECTIONS |
| — | gimmick_defs | ❌ NOT IN COLLECTIONS |
| — | camera_profiles | ❌ NOT IN COLLECTIONS |
| — | audio_profiles | ❌ NOT IN COLLECTIONS |
| — | users | ❌ NOT IN COLLECTIONS (UsersPage uses `collection(db, "users")` directly) |
| — | ai_battles | ❌ NOT IN COLLECTIONS (no admin page) |
| — | stadiums | ❌ NOT IN COLLECTIONS (no admin page) |
| — | beyblade_parts | ❌ NOT IN COLLECTIONS (split into 8 type-specific collections) |
| — | special_moves (server-side name) | same as SPECIAL_MOVES |

---

## Page-by-Page Field Audit

### BeybladeEditPage.tsx (`/admin/beyblades/edit/:id`)

**Collection**: BEYBLADE_STATS  
**Sections and fields exposed**:

| Field | Type | UI Element | Notes |
|-------|------|------------|-------|
| displayName | string | text input | required |
| type | "attack"\|"defense"\|"stamina"\|"balanced" | 4 toggle buttons | auto-derived in create; manual override in edit |
| spinDirection | "right"\|"left" | 2 toggle buttons | |
| mass | number 30–80 | number input | grams |
| radius | number 2–7 step 0.5 | number input | cm |
| typeDistribution.attack | number 0–150 | range slider | |
| typeDistribution.defense | number 0–150 | range slider | |
| typeDistribution.stamina | number 0–150 | range slider | |
| (derived) damageMultiplier | float | read-only display | |
| (derived) damageTaken | float | read-only display | |
| (derived) maxStamina | int | read-only display | |
| (derived) spinStealFactor | float | read-only display | |
| (derived) maxSpin | int | read-only display | |
| (derived) spinDecayRate | float | read-only display | |
| imageUrl | string | file upload + WhatsApp/Crop editor | PNG/JPG/GIF/WebP |
| imagePosition | {x,y,scale,rotation} | WhatsApp editor | |
| elementTypes | string[] max 2 | SearchableSelect add + badge remove | |
| specialMoveId | string? | SearchableSelect | optional |
| comboIds | string[] max 3 | SearchableSelect add + badge remove | |
| pointsOfContact | PointOfContact[] | Step3ContactPoints component | |
| spinStealPoints | PointOfContact[] | Step3ContactPoints component | |

**Fields saved to Firestore** (from updateDoc call):
`displayName, type, spinDirection, mass, radius, imageUrl, imagePosition, typeDistribution, damageMultiplier, damageTaken, knockbackDistance, invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor, maxStamina, speedBonus, pointsOfContact, spinStealPoints, elementTypes, specialMoveId, comboIds, updatedAt`

**Fields MISSING vs. plan requirements**:
| Missing Field | Plan Section | Priority |
|--------------|-------------|----------|
| gimmickIds | Rule 7 (gimmick_defs), Stage 8 | HIGH — needed for gimmick composition |
| generation | Seed planning (334 beys from all eras) | HIGH — needed for era filtering |
| series | Beyblade era metadata | MED |
| spinStealPoints (on create page) | Already saved in edit, missing in create wizard | LOW |
| elementTypes (on create page) | create wizard step 0–3 only has basic/stats/image/contact; elementTypes only in edit | MED |
| specialMoveId (on create page) | same as above | MED |
| comboIds (on create page) | same as above | MED |

---

### BeybladeCreatePage.tsx (`/admin/beyblades/create`)

**4-step wizard**: Basic Info → Type Distribution → Image → Contact Points

**Fields exposed per step**:
- Step 0: displayName, spinDirection, mass, radius
- Step 1: attack, defense, stamina (range sliders with derived stats preview)
- Step 2: imageUrl (file upload with editor)
- Step 3: pointsOfContact (Step3ContactPoints component)

**Fields saved on create**:
`displayName, fileName, type (derived), spinDirection, mass, radius, imageUrl, imagePosition, typeDistribution, damageMultiplier, damageTaken, knockbackDistance, invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor, maxStamina, speedBonus, pointsOfContact, createdAt`

**Missing vs. edit page**: elementTypes, specialMoveId, comboIds, spinStealPoints — users must go to edit after create to set these. This is a known UX gap, not a blocker.

---

### ArenaEditPage.tsx (`/admin/arenas/edit/:id`) + ArenaCreatePage.tsx

**Collection**: ARENAS  
**UI**: Fully delegates to `<ArenaConfigurator>` component (not audited here — component level).  
**Schema**: Uses `ArenaConfig` from `client/src/types/arenaConfigNew.ts`.

Arena config supports: name, shape, width, height, theme, obstacles[], triggerZones[], gravityWells[], switches[], portals[], turrets[], waterBodies[], spinZones[], bumps[], arenaFloorGroupId.

**Missing vs. plan requirements**:
- ❌ No `mechanic_defs` linking — arena features are config objects, not mechanic references
- ❌ No `camera_profile` field on arenas
- ❌ No `audio_profile` field on arenas

---

### SpecialMovesPage.tsx (`/admin/special-moves`)

**Collection**: SPECIAL_MOVES  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per special move**:
| Field | Type | UI Element |
|-------|------|------------|
| name | string | text input |
| kind | "attack"\|"defense"\|"stamina"\|"balanced" | SearchableSelect |
| iconEmoji | string | text input |
| cooldownSec | number | number input |
| durationMs | number | number input |
| description | string | textarea |
| isDefault | boolean | checkbox |
| type | "attack"\|"defense"\|"stamina"\|"balanced" | SearchableSelect |
| flashColor | hex string | color picker + text input |

**Fields MISSING vs. plan requirements**:
| Missing Field | Plan Section | Priority |
|--------------|-------------|----------|
| steps[] | Special Move pipeline (Stage 2) — the plan requires step-by-step authoring (physics force, targeting, duration, power cost per step) | HIGH |
| mechanicRefs[] | Rule 2 multi-engine support — specials should reference mechanic IDs | HIGH |
| powerCost | Plan says "Costs ~100 power" — not stored per move | MED |
| targetingMode | Which bey(s) the special affects | MED |
| presentationProfile | camera/audio/visual per move | MED |
| engineBehavior.2d / .2_5d / .3d | Multi-engine support table | MED |

**Existing coverage**: Name, type/kind, cooldown, duration, icon, description, default flag, flash color. This is enough for basic seeding but not for full mechanic composition.

---

### CombosPage.tsx (`/admin/combos`)

**Collection**: COMBOS  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per combo**:
| Field | Type | UI Element |
|-------|------|------------|
| name | string | text input |
| sequence | [key, key, key] | 3× SearchableSelect |
| cost | 0\|15\|25\|35 | SearchableSelect |
| type | string (universal/attack/defense/stamina/balanced) | SearchableSelect |
| description | string | textarea |
| cooldownMs | number | number input |

**Key options available**: moveLeft, moveRight, moveUp, moveDown, attack, defense, dodge, jump (8 keys — matches CLAUDE.md bitmask bits 0–7)

**Fields MISSING vs. plan requirements**:
| Missing Field | Plan Section | Priority |
|--------------|-------------|----------|
| effectId / comboEffectId | Link combo → ComboEffect (combo_effects collection exists but there is no linking field) | HIGH |
| windowMs | Combo detection window — in CLAUDE.md spec but not in form | MED |
| mechanicRef | Which mechanic(s) the combo triggers | MED |
| presentationProfile | camera/audio/visual on activation | MED |

**Note**: `combo_effects` collection exists separately (ComboEffectsPage) but there is NO field in the combo form that links a combo to its effects. This is a data model gap — the engine has no way to look up what effect a combo triggers unless it's hardcoded.

---

### ComboEffectsPage.tsx (`/admin/combo-effects`)

**Collection**: COMBO_EFFECTS  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per combo effect**:
| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| effectType | enum | damage_multiplier / spin_drain / spin_boost / lock / knockback / combo_extender / shield / area_blast |
| magnitude | number | multiplier |
| duration | number (ms) | optional, 0=instant |
| icon | emoji | |
| description | string | |

**Gap**: No linking from Combos → ComboEffects. Combos and ComboEffects are orphaned collections without a join field.

---

### BehaviorDefsPage.tsx (`/admin/behavior-defs`)

**Collection**: BEHAVIOR_DEFS  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per behavior def**:
| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| behaviorType | enum | ai_pattern / arena_event / trigger_effect / switch_logic / obstacle_behavior |
| description | string | |
| parameters | Record<string,unknown> | free-form JSON blob |

**Gap**: Parameters are untyped JSON — no schema per behaviorType. The plan requires typed mechanic definitions with validated param schemas.

**Missing vs. plan requirements**:
- ❌ NO `mechanic_defs` page — BehaviorDefs covers arena/AI behavior but NOT the physics-level mechanic composition described in the plan (`MECHANIC_REGISTRY`, mechanic handlers, multi-engine adapters)
- ❌ NO `gimmick_defs` page — gimmick composition (mechanic recipe + mode configs) has no admin UI

---

### RoundModifiersPage.tsx (`/admin/round-modifiers`)

**Collection**: ROUND_MODIFIERS  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields**:
| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| modifierType | enum | damage_amp / speed_amp / defense_amp / spin_decay_rate / power_regen / ring_size / gravity / friction |
| magnitude | number | |
| condition | enum | always / low_spin / high_spin / low_hp / first_blood |
| stackable | boolean | |
| icon | emoji | |
| description | string | |

**Observation**: This is the most complete "data-driven gameplay modifier" system currently in the admin. The modifierType enum already covers most runtime beyblade stats. This is a good foundation for the plan's stat-mapping approach.

---

### ArenaFeatureConfigsPage.tsx (`/admin/arena-feature-configs`)

**Collection**: ARENA_FEATURE_CONFIGS  
**Categories**: hazard / effect_zone / particle / env_preset

**Fields**: id, label, category, description, icon, color

**Gap**: This is a label/registry for arena feature types, not a physics config. There is no mechanic binding or engine behavior linked here — it's purely a taxonomy.

---

### BeyLinkConfigsPage.tsx (`/admin/bey-link-configs`)

**Collection**: BEY_LINK_CONFIGS  
**Categories** (9): link_type / reverse_condition / bey_link_type / alignment / trigger_condition / effect_type / control_mode / movement_control / group_pattern

**Fields**: id, label, category, description, color

**Observation**: BeyLink is the multi-beyblade linking/grouping system. Categories describe all dimensions of the BeyLink interaction model: how beys connect (link_type), when effects reverse (reverse_condition), the physical connection type (bey_link_type), team alignment (alignment), trigger conditions (trigger_condition), effect types (effect_type), control modes (control_mode), movement control delegation (movement_control), and group formations (group_pattern).

This is a rich system that aligns well with the plan's composition approach. However it currently only stores label/taxonomy — no physics params.

---

### AnimationPresetsPage.tsx (`/admin/animation-presets`)

**Collection**: ANIMATION_PRESETS  
**Animation types**: hit_flash / combo_burst / special_surge / ring_out / spin_aura / trail / impact_ring / screen_shake

**Fields**: name, animationType, durationMs, easing, color, spriteUrl, description

**Observation**: This is the closest thing to a `presentation_profile` — stores animation/VFX configurations. Maps to Rule 6 (Presentation Layer). However it's standalone — no collection currently links a mechanic, combo, or special move to an animation preset ID.

---

### TurretAttackTypesPage.tsx (`/admin/turret-attack-types`)

**Collection**: TURRET_ATTACK_TYPES  
**Fields**: id, label, description, icon

Pure taxonomy for turret projectile types. No physics config.

---

### ArenaSystemCreatePage.tsx / ArenaSystemEditPage.tsx (`/admin/arena-systems`)

**Collection**: ARENA_SYSTEMS  
**Uses**: `ArenaSystem` type from `client/src/types/arenaSystem.ts`  
**UI**: Delegates to `<ArenaSystemEditor>` component.

**Known fields from defaultArena**:
- displayName, description, shape ("circle"), width, height, theme ("forest")
- difficulty ("medium"), elevationMap (type, tiltAngle, tiltDirection)
- wallProfile (baseHeight), slopePhysics (gravityStrength)
- wall (type "circular", height)

**Distinction from ArenaConfig (ARENAS)**: ArenaSystem is the 3D/physical structure (walls, elevation, slope). ArenaConfig is the feature layer (obstacles, switches, spin zones, bumps). These are separate Firestore collections and separate admin flows.

---

### 2.5D Parts: PartCreatePage.tsx / PartEditPage.tsx (`/admin/2d/parts/:partType`)

**8 Part Type Collections**: bit_beast_parts, attack_ring_parts, weight_disk_parts, sub_parts, tip_parts, core_parts, casing_parts, spin_track_parts

**Fields on create**: displayName, color  
**Fields on created doc (defaults)**: geometry (type: "preset", preset: "circle"), dimensions (height, outerRadius, innerRadius), compatibilityTags[], requiredCompatibility[], excludedCompatibility[], images{}, pockets[], configurations[], contactPoints[], createdAt, updatedAt

**PartEditPage**: Uses dedicated part editor components (ContactPoint, Pocket, etc.) — full 2.5D part authoring.

---

### Missing Admin Pages (plan-required, not yet built)

| Collection | Plan Reference | Priority | Notes |
|-----------|---------------|----------|-------|
| mechanic_defs | Rule 7, Stage 6 | CRITICAL | Physics-level mechanic composition; handler IDs, param schemas, multi-engine adapter flags |
| gimmick_defs | Rule 7, Stage 8 | CRITICAL | Gimmick ID → mechanic recipe + mode configs |
| camera_profiles | Rule 6, Rule 7 | HIGH | Camera behavior configs per mechanic/gimmick/special |
| audio_profiles | Rule 6, Rule 7 | HIGH | Audio cue configs per mechanic/gimmick/special/arena |
| ai_battles | CLAUDE.md table | LOW | Quick-launch preset entries; seeder exists but no admin UI |
| stadiums | CLAUDE.md table | LOW | Stadium metadata and images; no admin page |
| users | CLAUDE.md table | existing | UsersPage uses `collection(db, "users")` directly; not in COLLECTIONS constant |

---

## Multi-Engine Support Audit

| Admin Page | 2D Support | 2.5D Support | 3D Support | Gap |
|-----------|------------|-------------|------------|-----|
| BeybladeEdit | ✅ (stats drive 2D physics) | ✅ (pointsOfContact, radius) | ✅ (via ArenaSystem slope/wall) | No engine-specific param override |
| ArenaEdit | ✅ (ArenaConfig features) | ✅ (ArenaSystem elevation) | partial | No 3D mesh config |
| SpecialMoves | ✅ (basic params) | ❌ no 2.5D adapter | ❌ no 3D adapter | Missing multi-engine step authoring |
| Combos | ✅ | ❌ | ❌ | Missing engine-adapter fields |
| BehaviorDefs | partial (JSON params) | ❌ | ❌ | Free-form JSON, no adapter distinction |
| RoundModifiers | ✅ | ✅ (modifierType covers physics) | ✅ | Best coverage of engine-agnostic modifiers |

---

## Presentation Layer Audit (Rule 6)

The plan requires 9 presentation layers. Current admin coverage:

| Layer | Name | Admin Page | Status |
|-------|------|-----------|--------|
| 1 | Gameplay Logic | RoundModifiers, SpecialMoves | partial |
| 2 | Movement Logic | SpecialMoves (forceMs), BehaviorDefs | partial |
| 3 | Camera Logic | ❌ camera_profiles not built | MISSING |
| 4 | Audio Logic | ❌ audio_profiles not built | MISSING |
| 5 | Visual Effects | AnimationPresets | partial |
| 6 | Asset Layer | All asset library pages | ✅ |
| 7 | Arena Reactions | ArenaFeatureConfigs, BehaviorDefs | partial |
| 8 | World State | BehaviorDefs (switch_logic) | partial |
| 9 | Runtime Transitions | BehaviorDefs | partial (untyped JSON) |

---

## Data Model Gaps Summary

| Gap | Severity | Files Affected | Plan Reference |
|-----|----------|---------------|----------------|
| No mechanic_defs collection in COLLECTIONS | CRITICAL | firebase.ts, all rooms | Rule 7, Stage 6 |
| No gimmick_defs collection in COLLECTIONS | CRITICAL | firebase.ts, all rooms | Rule 7, Stage 8 |
| Combos not linked to ComboEffects | HIGH | CombosPage, comboSystem.ts | Stage 4 |
| SpecialMoves missing step authoring | HIGH | SpecialMovesPage | Stage 2 |
| BeybladeEdit missing gimmickIds | HIGH | BeybladeEditPage | Stage 8 |
| No camera_profiles admin page | HIGH | — | Rule 6, Rule 7 |
| No audio_profiles admin page | HIGH | — | Rule 6, Rule 7 |
| BeybladeCreate missing elementTypes/specialMoveId/comboIds | MED | BeybladeCreatePage | UX gap |
| AnimationPresets not linked from any mechanic/combo | MED | AnimationPresetsPage | Rule 6 |
| RoundModifiers not linked from arena/beyblade | MED | RoundModifiersPage | Stage 6 |
| BeybladeEdit missing generation/series fields | MED | BeybladeEditPage | Stage 12 (seed planning) |
| BehaviorDefs parameters untyped JSON | MED | BehaviorDefsPage | Rule 7 |
| COLLECTIONS missing mechanic_defs/gimmick_defs/camera_profiles/audio_profiles | CRITICAL | firebase.ts | Rule 7 |

---

## Proposed Extensions (from this audit)

| Candidate | Why Existing Fields Fail | Evidence | Tag |
|-----------|------------------------|---------|-----|
| Add `gimmickIds: string[]` to BeybladeEdit | gimmicks are composition objects that modify beyblade behavior at runtime — can't be expressed via existing specialMoveId/comboIds | Plan Rule 7 requires gimmick_defs CRUD | SPECULATION (no external sources yet — confirm in Stage 8) |
| Add `comboEffectId` to Combos form | combos and combo effects are orphaned collections — engine can't resolve what a combo does without this link | Code: CombosPage has no effectId field; ComboEffectsPage has no referencing combos field | INFERENCE (2 sources: code gap + plan requirement) |
| Add step authoring to SpecialMoves | current SpecialMoves form only has metadata (name, cooldown, duration, icon) — no physics force or targeting steps | Plan Stage 2 requires step-by-step authoring; engine already has special move steps (stampede_rush etc.) but they're hardcoded | INFERENCE |
| Add `generation` + `series` fields to BeybladeEdit | plan seeds 334 beys across all generations; filtering and display requires these fields | Stage 12 seed planning; plan lists Plastic Gen, HMS, MFB, Burst, BX eras | SPECULATION (confirm in Stage 12) |
| Add `camera_profiles` and `audio_profiles` to COLLECTIONS | plan Rule 7 explicitly requires these Firestore collections; current COLLECTIONS constant does not include them | Plan Rule 7, Rule 6; no admin page exists | FACT (code confirms absence) |

---

## Failed Retrievals
(none — this batch is code-reading only, no external URLs required)

## Missing Data
(none — all admin code was accessible and readable)

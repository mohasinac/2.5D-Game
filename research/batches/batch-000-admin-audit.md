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

Full audit of all admin pages under `client/src/pages/admin/`. No external sources required — this is a code-reading stage. Every page was read directly from the codebase at its current state. The audit covers: what fields each page exposes, which Firestore collections it targets, which plan-required pages are missing, and what field gaps remain relative to plan requirements. This is a rewrite of the original audit — all facts reflect current code, not the prior state.

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
| Tournament Admin | 4 (List, Create, Edit, Detail) | 4 | 100% | — |
| Asset Libraries | 7 (Sound, Portal, Obstacle, Turret, WaterBody, ArenaTheme, ParticlePresets) | 7 | 100% | — |
| Dashboard / Stats / Settings | 3 | 3 | 100% | — |
| Users | 1 | 1 | 100% | — |
| Arena Floor Groups | 2 | 2 | 100% | — |
| AI Battles | 1 (CRUD inline modal) | 1 | 100% | — |
| Part Materials | 1 (CRUD inline modal) | 1 | 100% | — |
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
| AI_BATTLES | ai_battles | ✅ **newly added to COLLECTIONS + page built** |
| PART_MATERIALS | part_materials | ✅ **new collection + page built** |
| — | mechanic_defs | ❌ NOT IN COLLECTIONS |
| — | gimmick_defs | ❌ NOT IN COLLECTIONS |
| — | camera_profiles | ❌ NOT IN COLLECTIONS |
| — | audio_profiles | ❌ NOT IN COLLECTIONS |
| — | users | ❌ NOT IN COLLECTIONS (UsersPage uses `collection(db, "users")` directly) |
| — | stadiums | ❌ NOT IN COLLECTIONS (no admin page) |
| — | beyblade_parts | ❌ NOT IN COLLECTIONS (split into 8 type-specific collections above) |

---

## Page-by-Page Field Audit

### BeybladeEditPage.tsx (`/admin/beyblades/edit/:id`)

**Collection**: BEYBLADE_STATS  
**Sections and fields exposed**:

| Field | Type | UI Element | Notes |
|-------|------|------------|-------|
| displayName | string | text input | required |
| type | "attack"\|"defense"\|"stamina"\|"balanced" | 4 toggle buttons | manual override |
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
| elementTypes | string[] max 2 | SearchableSelect add + badge remove | reads ELEMENT_TYPE_CONFIGS |
| specialMoveId | string? | SearchableSelect | optional |
| comboIds | string[] max 3 | SearchableSelect add + badge remove | shows sequence preview |
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

---

### BeybladeCreatePage.tsx (`/admin/beyblades/create`)

**5-step wizard** (was 4 — Step 4 "Abilities" added): Basic Info → Type Distribution → Image → Contact Points → Abilities

**Fields exposed per step**:
- Step 0: displayName, spinDirection, mass, radius
- Step 1: attack, defense, stamina (range sliders with derived stats preview)
- Step 2: imageUrl (file upload with WhatsApp/Crop editor)
- Step 3: pointsOfContact (Step3ContactPoints component)
- Step 4: elementTypes (12 preset tags, max 2), specialMoveId (SearchableSelect from SPECIAL_MOVES), comboIds (3 SearchableSelect slots from COMBOS)

**Fields saved on create**:
`displayName, fileName, type (derived), spinDirection, mass, radius, imageUrl, imagePosition, typeDistribution, damageMultiplier, damageTaken, knockbackDistance, invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor, maxStamina, speedBonus, pointsOfContact, elementTypes (if any), specialMoveId (if set), comboIds (if any), createdAt`

**Gap closed**: elementTypes, specialMoveId, comboIds are now settable at create time (previous audit flagged these as UX gaps — now resolved via Step 4). `spinStealPoints` is still not on the create wizard; it can only be set post-creation via the edit page.

**Remaining gaps** vs. edit page: spinStealPoints — users must go to edit after create to set these. Low priority.

---

### ArenaEditPage.tsx (`/admin/arenas/edit/:id`) + ArenaCreatePage.tsx

**Collection**: ARENAS  
**UI**: Fully delegates to `<ArenaConfigurator>` component.  
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
| effects.linearImpulse | number | number input |
| effects.spinDelta | number | number input |
| effects.invulnerabilityMs | number | number input |
| effects.spinStealRadiusPx | number | number input |
| effects.aoeRadiusPx | number | number input |
| effects.knockbackImpulse | number | number input |

**Gap partially closed**: Physics effect parameters (linearImpulse, spinDelta, invulnerabilityMs, etc.) are now directly authored on the special move form via an `effects` sub-object. Prior audit flagged this as HIGH gap.

**Fields STILL MISSING vs. plan requirements**:
| Missing Field | Plan Section | Priority |
|--------------|-------------|----------|
| steps[] | Special Move pipeline (Stage 2) — plan requires step-by-step authoring; effects are still one flat object, not a sequence of steps | HIGH |
| mechanicRefs[] | Rule 2 multi-engine support — specials should reference mechanic IDs | HIGH |
| targetingMode | Which bey(s) the special affects | MED |
| presentationProfile | camera/audio/visual per move | MED |
| engineBehavior.2d / .2_5d / .3d | Multi-engine support table | MED |

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
| windowMs | number (100–800ms) | number input — **now present** |
| effect.damageMultiplier | number 1.0–1.5 | number input |
| effect.forceImpulse | number | number input |
| effect.durationMs | number | number input |
| effect.lockMs | number 0–300 | number input |
| effect.spinStealBonus | number | number input |
| effect.microSpinBoost | number | number input |
| effect.dashDirection | "none"\|"left"\|"right"\|"back" | button group |

**Key options available**: moveLeft, moveRight, moveUp, moveDown, attack, defense, dodge, jump (8 keys — matches CLAUDE.md bitmask bits 0–7)

**Gap closed**: `windowMs` is now present. Each combo now carries its own inline `effect` object (damageMultiplier, dashDirection, forceImpulse, durationMs, lockMs, spinStealBonus, microSpinBoost). This replaces the previously missing link from combo → ComboEffect collection; combos are now self-contained rather than referencing a separate ComboEffects doc.

**Architecture note**: The `combo_effects` collection still exists as a separate CRUD page but combos no longer reference it. The two are now orphaned in opposite directions — combos carry their own effect inline; the ComboEffects collection is either legacy or serves a different purpose. Clarify intent.

**Fields STILL MISSING vs. plan requirements**:
| Missing Field | Plan Section | Priority |
|--------------|-------------|----------|
| mechanicRef | Which mechanic(s) the combo triggers | MED |
| presentationProfile | camera/audio/visual on activation | MED |

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

**Status**: Collection remains standalone. Since combos now carry inline effects (see CombosPage above), the relationship between this collection and combos is now unclear. ComboEffects may be used for a different purpose or may be legacy.

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

**Observation**: Most complete "data-driven gameplay modifier" system in the admin. modifierType enum covers most runtime beyblade stats. Good foundation for the plan's stat-mapping approach.

---

### ArenaFeatureConfigsPage.tsx (`/admin/arena-feature-configs`)

**Collection**: ARENA_FEATURE_CONFIGS  
**Categories**: hazard / effect_zone / particle / env_preset

**Fields**: id, label, category, description, icon, color

**Gap**: This is a label/registry for arena feature types, not a physics config. No mechanic binding or engine behavior — purely a taxonomy.

---

### BeyLinkConfigsPage.tsx (`/admin/bey-link-configs`)

**Collection**: BEY_LINK_CONFIGS  
**Categories** (9): link_type / reverse_condition / bey_link_type / alignment / trigger_condition / effect_type / control_mode / movement_control / group_pattern

**Fields**: id, label, category, description, color

**Observation**: BeyLink is the multi-beyblade linking/grouping system. Covers all dimensions of the BeyLink interaction model. Currently only stores label/taxonomy — no physics params.

---

### AnimationPresetsPage.tsx (`/admin/animation-presets`)

**Collection**: ANIMATION_PRESETS  
**Animation types**: hit_flash / combo_burst / special_surge / ring_out / spin_aura / trail / impact_ring / screen_shake

**Fields**: name, animationType, durationMs, easing, color, spriteUrl, description

**Observation**: Closest thing to a `presentation_profile` — stores animation/VFX configurations. Maps to Rule 6 (Presentation Layer). No collection currently links a mechanic, combo, or special move to an animation preset ID.

---

### TurretAttackTypesPage.tsx (`/admin/turret-attack-types`)

**Collection**: TURRET_ATTACK_TYPES  
**Fields**: id, label, description, icon

Pure taxonomy for turret projectile types. No physics config.

---

### AIBattlesPage.tsx (`/admin/ai-battles`) — **NEW**

**Collection**: AI_BATTLES (now in COLLECTIONS constant)  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per AI battle preset**:
| Field | Type | UI Element |
|-------|------|------------|
| displayName | string | text input |
| difficulty | "medium"\|"hard"\|"hell" | SearchableSelect |
| description | string | textarea |
| defaultBeybladeId | string | SearchableSelect (loads BEYBLADE_STATS) |
| defaultArenaId | string | SearchableSelect (loads ARENAS) |
| isActive | boolean | checkbox |

**Gap closed**: `ai_battles` collection previously had no admin UI (only a seeder). Now has full CRUD page and is registered in COLLECTIONS.

---

### PartMaterialsPage.tsx (`/admin/part-materials`) — **NEW**

**Collection**: PART_MATERIALS (new collection added to COLLECTIONS)  
**CRUD**: Full create/read/update/delete with inline modal.

**Fields per part material**:
| Field | Type | UI Element | Notes |
|-------|------|------------|-------|
| id | string | text input (manual) | slug ID |
| label | string | text input | display name |
| description | string | textarea | |
| gripFactor | number? | number input | optional physics param |
| aggressiveness | number? | number input | optional physics param |
| recoilFactor | number? | number input | optional physics param |
| surfaceFriction | number? | number input | optional physics param |
| density | number? | number input | optional physics param |
| durabilityDecay | number? | number input | optional physics param |

**Observation**: This is a new physics-data layer for 2.5D part materials. All numeric fields are optional, allowing partial definitions. This is an important foundation for material-based physics in the part system.

---

### TournamentEditPage.tsx (`/admin/tournaments/edit/:id`) — **NEW**

**Collection**: TOURNAMENTS  
**Purpose**: Edit an existing tournament (was previously create-only; list and detail had no edit flow).

**Fields exposed**:
| Field | Type | UI Element |
|-------|------|------------|
| name | string | text input |
| description | string | textarea |
| type | "pvp"\|"player-gauntlet"\|"mixed"\|"ai-exhibition" | SearchableSelect |
| maxParticipants | number | number input |
| minParticipants | number | number input |
| scheduledStartTime | datetime-local | datetime input |
| registrationDeadline | datetime-local | datetime input |
| roundIntervalMinutes | number | number input |
| bestOf | 1\|3\|5 | SearchableSelect |
| aiDifficulty | "medium"\|"hard"\|"hell" | SearchableSelect |
| autoFillWithAI | boolean | checkbox |
| allowedBeybladeIds | string[] | SearchableSelect (loads BEYBLADE_STATS) |
| disabledBeybladeIds | string[] | SearchableSelect (loads BEYBLADE_STATS) |
| allowedArenaIds | string[] | SearchableSelect (loads ARENAS) |

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

## Missing Admin Pages (plan-required, not yet built)

| Collection | Plan Reference | Priority | Notes |
|-----------|---------------|----------|-------|
| mechanic_defs | Rule 7, Stage 6 | CRITICAL | Physics-level mechanic composition; handler IDs, param schemas, multi-engine adapter flags |
| gimmick_defs | Rule 7, Stage 8 | CRITICAL | Gimmick ID → mechanic recipe + mode configs |
| camera_profiles | Rule 6, Rule 7 | HIGH | Camera behavior configs per mechanic/gimmick/special |
| audio_profiles | Rule 6, Rule 7 | HIGH | Audio cue configs per mechanic/gimmick/special/arena |
| stadiums | CLAUDE.md table | LOW | Stadium metadata and images; no admin page and not in COLLECTIONS |

---

## Gap Status Changes vs. Prior Audit

| Gap | Prior Status | Current Status |
|-----|-------------|----------------|
| BeybladeCreate missing elementTypes/specialMoveId/comboIds | HIGH gap | ✅ FIXED — Step 4 "Abilities" added to 5-step wizard |
| Combos missing windowMs | MED gap | ✅ FIXED — windowMs field present (100–800ms range) |
| Combos not linked to ComboEffects | HIGH gap | ✅ RESOLVED DIFFERENTLY — combos now carry inline `effect` object; no external reference needed |
| SpecialMoves missing physics params | HIGH gap | ✅ PARTIALLY FIXED — `effects` sub-object added (linearImpulse, spinDelta, invulnerabilityMs, spinStealRadiusPx, aoeRadiusPx, knockbackImpulse) |
| ai_battles not in COLLECTIONS, no admin page | LOW gap | ✅ FIXED — AI_BATTLES constant added, AIBattlesPage built |
| part_materials collection missing | N/A (new) | ✅ NEW — PART_MATERIALS constant added, PartMaterialsPage built |
| Tournament no edit page | implicit gap | ✅ FIXED — TournamentEditPage.tsx built |
| mechanic_defs page missing | CRITICAL | ❌ STILL MISSING |
| gimmick_defs page missing | CRITICAL | ❌ STILL MISSING |
| camera_profiles page missing | HIGH | ❌ STILL MISSING |
| audio_profiles page missing | HIGH | ❌ STILL MISSING |
| BeybladeEdit missing gimmickIds field | HIGH | ❌ STILL MISSING |
| BeybladeEdit missing generation/series fields | MED | ❌ STILL MISSING |
| SpecialMoves missing step[] authoring | HIGH | ❌ STILL MISSING (effects are one flat object, not a pipeline) |
| AnimationPresets not linked from mechanics/combos | MED | ❌ STILL UNLINKED |
| RoundModifiers not linked from arena/beyblade | MED | ❌ STILL UNLINKED |
| BehaviorDefs parameters untyped JSON | MED | ❌ STILL UNTYPED |

---

## Multi-Engine Support Audit

| Admin Page | 2D Support | 2.5D Support | 3D Support | Gap |
|-----------|------------|-------------|------------|-----|
| BeybladeEdit | ✅ (stats drive 2D physics) | ✅ (pointsOfContact, radius) | ✅ (via ArenaSystem slope/wall) | No engine-specific param override |
| ArenaEdit | ✅ (ArenaConfig features) | ✅ (ArenaSystem elevation) | partial | No 3D mesh config |
| SpecialMoves | ✅ (inline effects sub-object) | ❌ no 2.5D adapter | ❌ no 3D adapter | Missing step authoring and multi-engine flags |
| Combos | ✅ (inline effect sub-object) | ❌ | ❌ | Missing engine-adapter fields |
| BehaviorDefs | partial (JSON params) | ❌ | ❌ | Free-form JSON, no adapter distinction |
| RoundModifiers | ✅ | ✅ (modifierType covers physics) | ✅ | Best coverage of engine-agnostic modifiers |
| PartMaterials | ❌ (no 2D physics use) | ✅ (physics params for 2.5D parts) | partial | New — coverage TBD |

---

## Presentation Layer Audit (Rule 6)

The plan requires 9 presentation layers. Current admin coverage:

| Layer | Name | Admin Page | Status |
|-------|------|-----------|--------|
| 1 | Gameplay Logic | RoundModifiers, SpecialMoves (effects) | partial |
| 2 | Movement Logic | SpecialMoves (linearImpulse, knockbackImpulse), Combos (forceImpulse, dashDirection) | partial |
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
| BeybladeEdit missing gimmickIds | HIGH | BeybladeEditPage | Stage 8 |
| No camera_profiles admin page | HIGH | — | Rule 6, Rule 7 |
| No audio_profiles admin page | HIGH | — | Rule 6, Rule 7 |
| SpecialMoves missing step authoring pipeline | HIGH | SpecialMovesPage | Stage 2 |
| ComboEffects collection now orphaned (combos carry inline effects) | MED | ComboEffectsPage, CombosPage | Stage 4 |
| AnimationPresets not linked from any mechanic/combo | MED | AnimationPresetsPage | Rule 6 |
| RoundModifiers not linked from arena/beyblade | MED | RoundModifiersPage | Stage 6 |
| BeybladeEdit missing generation/series fields | MED | BeybladeEditPage | Stage 12 (seed planning) |
| BehaviorDefs parameters untyped JSON | MED | BehaviorDefsPage | Rule 7 |
| COLLECTIONS missing mechanic_defs/gimmick_defs/camera_profiles/audio_profiles | CRITICAL | firebase.ts | Rule 7 |

---

## Proposed Extensions (from this audit)

| Candidate | Why Existing Fields Fail | Evidence | Tag |
|-----------|------------------------|---------|-----|
| Add `gimmickIds: string[]` to BeybladeEdit | gimmicks are composition objects that modify beyblade behavior at runtime — can't be expressed via existing specialMoveId/comboIds | Plan Rule 7 requires gimmick_defs CRUD | SPECULATION (confirm in Stage 8) |
| Add step authoring to SpecialMoves | current effects sub-object is one flat bundle — no ordering, no per-step targeting or timing; hardcoded stamina_rush etc. use sequenced steps | Plan Stage 2 requires step-by-step authoring | INFERENCE |
| Add `generation` + `series` fields to BeybladeEdit | plan seeds 334 beys across all generations; filtering and display requires these fields | Stage 12 seed planning; plan lists Plastic Gen, HMS, MFB, Burst, BX eras | SPECULATION (confirm in Stage 12) |
| Add `camera_profiles` and `audio_profiles` to COLLECTIONS | plan Rule 7 explicitly requires these Firestore collections; current COLLECTIONS constant does not include them | Plan Rule 7, Rule 6; no admin page exists | FACT (code confirms absence) |
| Clarify ComboEffects vs. inline combo effect | combos now carry their own `effect` object; ComboEffectsPage is a separate standalone CRUD with a different schema — unclear if it's legacy or still in use | Code: ComboDoc.effect is inline; COMBO_EFFECTS collection is a separate taxonomy | INFERENCE (needs design decision) |

---

## Failed Retrievals
(none — this batch is code-reading only, no external URLs required)

## Missing Data
(none — all admin code was accessible and readable)

---
[↑ Index](../INDEX.md) &nbsp;�&nbsp; [Batch 001: Schema Catalog →](batch-001-schema-catalog.md)

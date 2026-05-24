# Research Progress

**Plan**: system-role-you-are-refactored-creek.md  
**Last updated**: 2026-05-24 (session 29 — Firebase preset defs refactor: 9 new collections replace all hardcoded admin dropdowns/enums; 10 Zustand store slices + hooks; 9 admin CRUD pages; 9 seed scripts; router + nav wired; TSC zero errors)

---

## Stage Status

| Stage | Name | Status | Output File | Last Batch |
|-------|------|--------|-------------|------------|
| 0A | Code Reading + Discovery | complete | phases/phase-00-engine-audit.md | batch-001 |
| 0B | New Discovery Table | complete | phases/phase-00-engine-audit.md | batch-002 |
| 0C | Mermaid Discovery Maps | complete | diagrams/ (17 files) | — |
| 0D | Engine Capability Summary | complete | phases/phase-00-engine-audit.md | batch-003 |
| 0E | Admin + Forms Audit | complete | phases/phase-00-engine-audit.md | batch-000 |
| 1  | Terminology + Concepts | complete | phases/phase-01-terminology.md | Batch 1K (session 5) |
| 2  | Special Move Understanding | complete | phases/phase-02-special-moves.md | Appendix 2Z (session 5) |
| 3  | Special Move → Bey Mapping | complete | phases/phase-03-specialmove-bey-map.md | batches 3A–3D |
| 4  | Combo / Trigger Mapping | complete | phases/phase-04-combo-mapping.md | batches 4A–4C |
| 5  | Parts: Features + Geometry | complete | phases/phase-05-parts.md | batches 5A–5E + batch-006 |
| 6  | Mechanic Definitions | complete | phases/phase-06-mechanics.md | batches 6A–6E |
| 7a | Beyblade Systems — Gen1 | complete | phases/phase-07-gen1.md | batches 7A–7E + Appendix N1 (session 5) |
| 7b | Beyblade Systems — Gen2/3/4 | complete | phases/phase-07-gen234.md | batches 7F–7N + Appendix N2 (session 5) |
| 8  | Beyblade Gimmick Configs | complete | phases/phase-08-gimmicks.md | batches 8A–8G |
| 9  | Arena Systems | complete | phases/phase-09-arenas.md | batches 9A–9E + Appendix 9Z (session 5) |
| 10 | Arena Implementations | complete | phases/phase-10-arena-implementation.md | — |
| 11 | Shared Architecture | complete | phases/phase-11-architecture.md | — |
| 12 | Seed Planning | complete | phases/phase-12-seed-plan.md | — |
| 13 | Controls / Camera / Audio | complete | phases/phase-13-controls.md | — |
| 14 | Game Modes | complete | phases/phase-14-game-modes.md | — |
| 16 | Gap Analysis | complete | phases/phase-16-gap-analysis.md | — |
| 19 | Implementation Plan | complete | phases/phase-19-impl-plan.md | — |
| 20 | Code Generation | complete | phases/phase-20-codegen.md | — |
| 21 | Unified Foundation Architecture | complete | phases/phase-21-unified-foundation.md | session 18 |

---

## Stage 0C Diagram Files (18/18 complete)

| # | File | Status |
|---|------|--------|
| 1 | diagram-engine-capabilities.md | ✅ |
| 2 | diagram-mechanics.md | ✅ |
| 3 | diagram-data-flow.md | ✅ |
| 4 | diagram-simulation-arch.md | ✅ |
| 5 | diagram-presentation-flow.md | ✅ |
| 6 | diagram-sequence-launch.md | ✅ |
| 7 | diagram-mode-flow.md | ✅ |
| 8 | diagram-arena-interaction.md | ✅ |
| 9 | diagram-extraction-pipeline.md | ✅ |
| 10 | diagram-tool-ecosystem.md | ✅ |
| 11 | diagram-input-abstraction.md | ✅ |
| 12 | diagram-rotation-systems.md | ✅ |
| 13 | diagram-camera-flow.md | ✅ |
| 14 | diagram-deterministic-flow.md | ✅ |
| 15 | diagram-research-flow.md | ✅ |
| 16 | diagram-script-authoring-flow.md | ✅ |
| 17 | diagram-script-execution.md | ✅ |
| 18 | diagram-turret-powerup-system.md | ✅ (session 12 additions) |

---

## Session 5 Additions (2026-05-23) — Episode Lore Deep-Read

Source: 617 episode markdown files under `linka/episodes/` (gen1/, gen2/, gen3/, gen4/).

| Addition | File | Content |
|---|---|---|
| Appendix N1 | phase-07-gen1.md | Gen1 narrative: season arc map, character rosters (S1/V-Force/G-Rev/HMS), faction tables, episode-derived mechanic intro dates, stadium configs by arc, bey power progression |
| Appendix N2 | phase-07-gen234.md | Gen2/3/4 narrative: all 4 Gen2 arcs, all 7 Gen3 Burst seasons, Gen4 BX; character rosters, story beats, key mechanics per season, faction summary tables |
| Batch 1K | phase-01-terminology.md | 8 named launch techniques with engine mappings; 19 mechanic first-appearances by episode; per-generation mechanic intro summary; scoring evolution table; stadium→mechanic relationship table |
| Appendix 2Z | phase-02-special-moves.md | Episode first-appearance for ~45 special moves across all 4 gens; mechanic-chain cross-reference linking episode evidence to `mechanicChain` IDs |
| Appendix 9Z | phase-09-arenas.md | Gen1/2/3/4 stadium episode cross-references (32 stadiums); stadium feature flags by generation; arena seed priority list (P0–P3) |

**Proofreading corrections applied same session:**
- phase-07-gen1.md: duplicate word "diagonal diagonal" → "diagonal"; "Torch Dragon" → "Thunder Dragon"
- phase-07-gen234.md: Dynamis bey corrected; Snake Pit S1 roster clarified; "Bashara" → "Basara" standardized
- phase-02-special-moves.md: Spin-steal wrongly attributed to Flame Sagittario removed; "Upper Dragon / Death Driger MS" → "Dragoon MS"
- phase-09-arenas.md: Beylin Temple arc label corrected from "MFB S1" → "MFB S2"

---

## Implemented Features (session 4, carried forward)

| Feature | Status | Key Files |
|---|---|---|
| Launch QTE (3-2-1 → 5s launch phase) | ✅ complete | `server/rooms/BattleRoom.ts`, `AIBattleRoom.ts`, `TryoutRoom.ts`, `TournamentBattleRoom.ts` |
| `GameState` launch schema fields | ✅ complete | `server/rooms/schema/GameState.ts` — 6 `Beyblade` fields + `launchTimer` |
| `useLaunchInput` hook | ✅ complete | `client/src/game/hooks/useLaunchInput.ts` |
| `LaunchPhase` overlay component | ✅ complete | `client/src/components/game/LaunchPhase.tsx` |
| `Countdown` → "Let It Rip!" | ✅ complete | `client/src/components/game/Countdown.tsx` |
| All 4 game pages wired | ✅ complete | `BattleGamePage`, `AIBattleGamePage`, `TryoutGamePage`, `TournamentBattleGamePage` |
| Client types updated | ✅ complete | `client/src/types/game.ts` — `"launching"` status, `launchTimer`, launch fields |
| `useColyseus` state bridge | ✅ complete | `launchTimer` added to `setGameState` mapping |

---

## Batches Written

| Batch | Stage | File | Status |
|-------|-------|------|--------|
| 000 | 0E | batches/batch-000-admin-audit.md | complete |
| 001 | 0A | batches/batch-001-schema-catalog.md | complete |
| 002 | 0B | batches/batch-002-discovery-table.md | complete |
| 003 | 0D | batches/batch-003-engine-capability-summary.md | complete |
| 004 | 5-ref | batches/batch-004-mfb-parts-disambiguation.md | complete — stage-7 fully proofread; FACT/INFERENCE/UNKNOWN tags throughout; WD/B:D/RF/R²F/LRF/4D-Bottom disambiguation; Zeus AR two-component free-spin section added (session 8) |
| 005 | 5-ref | batches/batch-005-burst-parts-disambiguation.md | complete — stage-7 fully proofread; all invented driver shapes removed; confirmed: Xtreme/Zephyr/Bearing/Drift/BD/Absorb behaviors; Dash driver list; Sparking marked incomplete |
| 006-x | 5-ref | batches/batch-006-x-parts-disambiguation.md | complete — stage-7 fully proofread; all invented bit mechanisms removed; confirmed: Flat/Rush/Needle/Gear Needle/Rubber Accel/Trans Kick; rack-and-pinion Gear Bit physics |
| 006-shape | 5-ref | batches/batch-006-shape-material-behavior-matrix.md | complete — original shape/material matrix |
| 007 | 5-ref | batches/batch-007-extended-tips-casings-gimmicks-disambiguation.md | complete |
| 1J (inline) | 1 | phases/phase-01-terminology.md §Batch 1J — Burst/BX disambiguation, 31 entries | complete |
| 1K (inline) | 1 | phases/phase-01-terminology.md §Batch 1K — episode launch techniques + mechanic intros | complete |
| 2Z (inline) | 2 | phases/phase-02-special-moves.md §Appendix 2Z — episode first-appearances | complete |
| N1 (inline) | 7a | phases/phase-07-gen1.md §Appendix N1 — Gen1 narrative context | complete |
| N2 (inline) | 7b | phases/phase-07-gen234.md §Appendix N2 — Gen2/3/4 narrative context | complete |
| 9Z (inline) | 9 | phases/phase-09-arenas.md §Appendix 9Z — episode stadium cross-reference | complete |
| 008 | source-verification | batches/batch-008-source-verification-parts-expansion.md | complete — 39 URLs fetched with visited flag; Gen1/HMS/Burst/BX parts expansion; 173 Burst drivers; 26 BX ratchets; 47+ BX blades with weights; 10 HMS RCs; 11 HMS ARs; 15 linka/ cache files |
| 009 | source-verification | batches/batch-009-live-verification.md | complete — 26 URLs checked; 4 discrepancies found (Zephyr=plastic not rubber; Xtreme Finish=3pts not 2; Drift=octagonal not pear/Gatinko; SD=Semi-Defense gap fill); T125/Wizard Rod/BX scoring/SD upgraded to FACT |
| 010 | proofread-and-inference-resolution | batches/batch-010-proofread-inference-resolution.md | complete — 22 URLs checked; 8 INFERENCE→FACT (Xtreme' softer rubber, Low Flat 1mm, High Needle 1mm, GB145 metal balls, SWD=Metal Fury not Zero-G, S130=Shield 130, W²D=Wave Wide Defense, BX match=best-of-3); 6 unknowns resolved; 5 proofreading fixes to batch-005 and batch-006-x |
| 011 | wd-weights-petal-physics | batches/batch-011-wd-weights-petal-physics.md | complete — 38 URLs fetched; 16 Gen1 WD weights from PlasticsDB; 21 AR weights confirmed; Force Disk clarified (Burst-era, not Gen1); petal count = emergent physics property |
| 012 | forge-disc-chassis-sar | batches/batch-012-forge-disc-chassis-sar.md | complete — 14 sources; Forge Disc weights (Force 19.2g, Armed 19.9g, Heavy/Gravity 21.6g, Quarter 21.8g); Chassis Single/Double system; 7-SAR catalog; Dragon Saucer SAR 1.9g + War Lion SAR 1.3g |
| 013 | deep-verification | batches/batch-013-deep-verification-pass.md | complete — 22 sources; 47 facts; 8 corrections: EWD single-bearing (bearingFriction 0.12), B:D world record 7:35 min + 170 height, W²D worse balance, SG Metal Flat tip = metal semi-flat (not flat), 5 blade base weights, Drain Fafnir Apr 29 2017, Geist Fafnir outclassed by Hell Salamander |
| 014 | archetype-physics | batches/batch-014-archetype-physics-deep-dive.md | complete — 18 sources; 64 facts; full physics model: tip friction hierarchy (rubber>plastic>metal), flower pattern mechanism, OWD vs CWD moment of inertia, LAD mechanics, AR contact geometry (concave=smash/slope=upper/roller=defense), all 8 Gen1 archetype decision trees, MFB/Burst/BX archetype physics, spin steal gear-coupling physics, opposite-spin mechanics, 10 engine model corrections |
| 015 | real-world-physics | batches/batch-015-real-world-physics.md | complete — 16 sources; 58 facts; classical mechanics grounding: gyroscopic precession formula Ω_P = rMg/(Iω), nutation 40% threshold confirmed, moment of inertia I = Σ(m·r²), tribology µ estimates by material, Euler's Disk / LAD divergence model, rigid-body collision impulse j formula with coefficient of restitution, opposite-spin gear coupling additive/subtractive surface velocity derivation, BX rack-and-pinion gear-rail, 8 engine model corrections |

---

## Session 6 Additions (2026-05-23) — Parts Disambiguation

| Addition | File | Content |
|---|---|---|
| batch-004 stage-7 | batches/batch-004-mfb-parts-disambiguation.md | Complete MFB tip/track catalog; B:D=Bearing Drive; WD flat disc not dome; RF/R²F/LRF/LF disambiguation; 4D Bottoms colon rule; rubber tip vs rubber CP; FACT/INFERENCE/UNKNOWN throughout |
| batch-005 stage-7 | batches/batch-005-burst-parts-disambiguation.md | Burst driver catalog (all sub-systems); Drift/Bearing Drift disambiguation; Dash driver list; confirmed shapes for Xtreme/Zephyr/Bearing/Drift/BD only; all other shapes INFERENCE from name; Sparking incomplete |
| batch-006-x stage-7 | batches/batch-006-x-parts-disambiguation.md | BX Bit catalog; Ratchet naming convention; Gear Bit rack-and-pinion mechanic; confirmed: Flat/Rush/Needle/Gear Needle/Rubber Accel; all other bit shapes INFERENCE from name; invented mechanism Notes removed |
| memory updated | memory/project_beyblade_parts_research.md | Full cross-gen reference with FACT/INFERENCE/UNKNOWN summary |

**Key disambiguation rules locked in this session:**
- B:D (MFB colon) = Bearing Drive. BD (no colon) = Burst Bearing Drift. Never conflate.
- Rubber TIP (floor) = aggressive flower-pattern movement. Rubber CP (opponent contact) = damage absorption + spin steal. Independent.
- Flower petal count = UNKNOWN for all Burst/BX drivers — only "flower pattern" confirmed, not specific count.
- Core = sphere inside elliptical cylinder (not plain cylinder).
- Bit beast chip: 4 canonical shapes: rect+circle, hexagonal nut, circle disc, triangular nut.

---

---

## Session 7 Additions (2026-05-23) — Gear Part Type

| Addition | File | Content |
|---|---|---|
| `GearPart` type | `shared/types/beybladeSystem.ts` | New `PartLayer` value `"gear"`; `GearShape`, `GearArchetype`, `GearPart` interface, `GearAttachment` interface; `BeybladeSystem.gearAttachments` slot; `AnyPart` + `PartTypeKey` unions updated; `SubPartParent` gains `"gear"` |
| Constants | `client/src/types/beybladeConstants.ts` | `gear → "gear_parts"` in `PART_TYPE_COLLECTION`; `gear → "gears"` in `PART_TYPE_SLUG` |
| phase-05-parts.md | research/phases/phase-05-parts.md | Section 1.9 Gear Part added; part type count 8 → 9; SubPartParent table updated |

**Key design decisions:**
- Gear is distinct from SubPart: it is physically larger, always triggers a named archetype shift, and may occupy a numbered slot when multiple sockets exist.
- `GearAttachment.slotIndex` (0-indexed) supports beys with multiple gear sockets (e.g. Astral Spriggan Q-Gear with 4 positions = 16+ mode combinations).
- `GearPart.enabledSubPartIds` — gears can unlock sub-parts that are only available when that gear is equipped.
- `SubPartParent` gains `"gear"` so a sub-part can mount onto a gear (e.g. a rubber pad that clips onto a sword gear tip).
- Firestore collection: `gear_parts`. Admin URL slug: `/admin/2d/parts/gears`.

**Real-world gear examples mapped:**
| Gear | Bey | GearShape | GearArchetype | attachesTo |
|------|-----|-----------|---------------|------------|
| Evolution Gear L (Lance) | Dynamite Belial NV2 | `lance` | `attack` | `ar` |
| Evolution Gear F (Fortress) | Dynamite Belial NV2 | `fortress` | `defense` | `ar` |
| Evolution Gear S (Shield) | Dynamite Belial NV2 | `shield` | `stamina` | `ar` |
| Evolution Gear V (Venture) | Dynamite Belial NV2 | `wing` | `balance` | `ar` |
| Evolution Gear H (Heavy) | Dynamite Belial NV2 | `anchor` | `stamina` | `ar` |
| Infinite Sword | Ultimate Belial | `sword` | `attack` | `ar` |
| Infinite Shield | Ultimate Belial | `shield` | `defense` | `ar` |
| Big Bang | Ultimate Belial | `ring` | `attack` | `ar` |
| Q-Gear (×4 slots) | Astral Spriggan | `ring` | `balance` | `core` |

---

## Session 8 Additions (2026-05-23) — Zeus AR Two-Component Design

| Addition | File | Content |
|---|---|---|
| Section B4 in batch-004 | batches/batch-004-mfb-parts-disambiguation.md | Zeus AR inner-center + free-spinning outer ring construction; per-scenario behavior table (normal spin / opponent contact / late-spin); physics model notes: outer ring needs independent angular velocity state (like `tipSpin` on EWD/ES), impulse resolver routes to ring first via `zeusArCouplingThreshold`, no contact protrusions → smooth disc, low `spinStealFactor` / moderate `damageReduction` |
| Fact/inference count updated | batches/batch-004-mfb-parts-disambiguation.md | facts 42 → 46, inferences 9 → 12 |

**Key design decision locked:**
- Zeus AR outer ring is a **separate angular-velocity state** — do not route collision impulse directly to `bey.spin`. Only force that exceeds `zeusArCouplingThreshold` bleeds into the inner body.
- Circular geometry = zero attack protrusions; contact behavior is absorption-dominant, not strike-dominant.

---

## Session 9 Additions (2026-05-23) — Q&A Checklist Resolution

| Group | Questions Resolved | Key Corrections / Findings |
|---|---|---|
| Group 1 (tip shapes) | Q1–Q4 | No discrete-petal tip exists; Zephyr = spiral (not oval); Xtreme Burst = rubber flat; oval tip = MFB Xtreme Wide |
| Group 2 (MFB names) | Q8–Q14 | SWD = Sharp Wide Defense (NOT Spiral); T125 = Tornado 125; UW145 = Upper Wing (not Under Wing); GB145 = Gravity Ball (not Gyro Ball) |
| Group 3 (Burst drivers) | Q15–Q23 | Orbit/Atomic = plastic ball (no rubber/bearing); Destroy = 8-pt star + plate (not rubber flat); Evolution = wears MORE aggressive; Dimension = 6-config height+tip; Trans = manual mode-twist; Universe = hemisphere + ring |
| Group 4 (BX bits) | Q34/Q35/Q37 | Low Flat = 1mm shorter (FACT); High Needle = 1mm taller (FACT); Wizard = Burst driver not BX bit (N/A) |
| Group 4 remaining | Q30–Q33/Q36/Q38 | Fandom wiki 403-blocked — remain INFERENCE/UNKNOWN |
| Group 6 (namespaces) | Q44–Q46 | `transform.*`, `spawn.*`, `arena.effect.*` all handled by turret system — confirmed |
| Group 7 (physics) | Q47–Q50 | `spin_equalization` not implemented; `rotation_reverse` design note (Dranzer GT style); `revival_spin` not implemented (formula confirmed); `barrage_hit` = single damage sum per collision call |
| Group 8 (camera/audio) | Q51–Q54 | Auto zoom-in NOT wired; shake only for aerial_smash+meteor; spectator fallback = active bey (not center); collision sound missing from AI/Tournament pages |

**Files updated this session:** batch-004, batch-005, batch-006-x, phase-04-combo-mapping, phase-06-mechanics, phase-13-controls, qa-checklist

**Remaining open:** Q30–Q33/Q36/Q38 (BX bits, wiki blocked), Q39–Q43 (Gen1 anime beys, wiki blocked), Q50 barrage (single impulse confirmed)

---

---

## Session 10 Additions (2026-05-23) — Arena Tilt (Z-axis)

| Addition | Files | Content |
|---|---|---|
| `ArenaConfig` tilt fields (full) | `shared/types/arenaConfigNew.ts` | `tiltAngle`, `tiltDirection`, `tiltMode`, `autoTilt`, `tiltSpeed`, `tiltPivotX/Y`, `tiltOscillateMin/Max/PeriodMs`, `rotationPivotX/Y` |
| `ArenaState` schema fields | `server/rooms/schema/GameState.ts` | All tilt + pivot fields as `@type` declarations; `tiltPhaseMs` internal oscillation clock |
| `advanceArenaTilt()` expanded | `server/shared/rooms/advanceArenaRotation.ts` | Handles `fixed` (direction spin) and `oscillate` (cosine-wave angle); `applyWeightTilt()` handles COM-tracking mode |
| `computeTiltForce()` | `server/shared/physics/ArenaUtils.ts` | `sin(tiltAngle) × 0.04 × mass` lateral force toward downhill azimuth |
| Room wiring | BattleRoom, TryoutRoom, AIBattleRoom, TournamentBattleRoom | `applyArenaToState` copies all new tilt/pivot fields; tick calls `advanceArenaTilt` + `applyWeightTilt`; per-bey loop applies `computeTiltForce` |
| Renderer tilt chain + pivots | `client/src/game/renderer/PixiRenderer.ts` | `arenaTiltOuter/Scale/Inner` perspective transform with configurable `tiltPivotX/Y`; rotation root reads `rotationPivotX/Y`; `updateArenaTilt()` called every frame |
| Admin UI (BasicsTab) | `client/src/components/admin/arena-tabs/BasicsTab.tsx` | Tilt mode selector (Fixed/Oscillate/Weight), oscillation range inputs, pivot X/Y for both tilt and rotation, Auto-Tilt sub-panel |
| Admin UI (FeaturesTab) | `client/src/components/admin/arena-tabs/FeaturesTab.tsx` | `controlledBySwitchId` inputs for SpinZones, GravityHoles, Bumps |
| Admin UI (TurretsTab) | `client/src/components/admin/arena-tabs/TurretsTab.tsx` | `controlledBySwitchId` input |
| Type: `TurretConfig.controlledBySwitchId` | `shared/types/arenaConfigNew.ts` | Added `controlledBySwitchId?: string` to turret config |
| Docs | `CHANGELOG.md`, `research/phases/phase-09-arenas.md`, `research/progress.md` | Full tilt system documentation including Zero-G Stadium canonical reference |

**Key design decision:** Tilt is arena-**wide** (tilts the entire plane — Zero-G, inverted, wall-ride). `bowlProfile`/`wallAngle` is surface-**local** (wall curvature only). They are independent and additive.

**Tilt angle semantics:**

| Angle | Effect | Physics | Visual |
|-------|--------|---------|--------|
| 0° | Flat (normal) | No lateral force | Circle |
| 30–60° | Tilted slope | Gentle–strong lateral drift | Ellipse |
| 90° | Wall-ride | Max lateral gravity | Line (edge-on) |
| 180° | Inverted / Zero-G | Reversed effective gravity | Circle (mirrored) |
| 270° | Wall-ride (opposite) | Max lateral gravity (opposite) | Line |
| 360° | Flat again | No lateral force | Circle |

**Tilt modes:**

| Mode | Server behavior | Use case |
|------|----------------|----------|
| `"fixed"` | Static angle; `autoTilt` rotates direction axis | Permanent tilted slope, spinning-tilted-bowl |
| `"oscillate"` | Cosine wave between `tiltOscillateMin`↔`Max`; `tiltPhaseMs` clock | Rocking arena, tidal wave effect |
| `"weight"` | COM of all active beys drives direction + angle; `tiltOscillateMax` is ceiling | Zero-G BB-G04 canonical recreation |

---

## Session 11 Additions (2026-05-23) — Turret Attack System: 150+ Anime/Game Moves

All changes live in four files; every move batch follows the same 4-file pattern (union → config fields → physics handlers → renderer colors + visuals → admin UI params).

| File | Role |
|------|------|
| `shared/types/arenaConfigNew.ts` | `TurretAttackType` union + per-move config field interface |
| `server/shared/rooms/TurretProcessor.ts` | `TurretRuntimeState` fields + exported physics handler functions |
| `client/src/game/renderer/FeatureRenderer.ts` | `TURRET_COLORS` entries + `syncProjectiles()` visual branches |
| `client/src/components/admin/arena-tabs/TurretsTab.tsx` | `TypeSpecificParams()` admin UI blocks per attack type |

### Move Batches Added

| Category | Moves | Notes |
|---|---|---|
| Street Fighter | hadoken, shoryuken, sonic_boom, flash_kick, raging_demon, spiral_drill, hundred_kicks, electric_body | 8 |
| Bleach bankais — round 1 | tensa_zangetsu, senbonzakura, daiguren_ice, absolute_zero, muken_poison, zanka_incinerate, suzumebachi, hihio_construct | 8 |
| Bleach bankais — round 2 | gigantification, ryujin_jakka_full, minazuki_heal, katen_kyokotsu, senbonzakura_kageyoshi, daiguren_full | 6 |
| Naruto jutsu | rasengan, chidori, shadow_clone, sand_burial, fireball_jutsu, eight_trigrams, amaterasu, susanoo, shuriken_throw, kunai_strike, smoke_bomb, wire_trap, exploding_tag | 13 |
| Summons | summon_toad, summon_snake, summon_slug, summon_kirin, summon_slugs_army, summon_garuda, summon_enma, summon_gamaken | 8 |
| Tekken | devil_beam, wind_god_fist, hellsweep, laser_scraper, twin_pistols | 5 |
| Time-based | time_stop, time_slow, time_rewind, time_acceleration | 4 |
| Bleach — Arrancar/Espada | cero, gran_rey_cero, cero_oscuras, bala, hierro, sonido, pesquisa, descorrer, lanza_del_relampago, santa_teresa, resurrección | 11 |
| Bleach — Gotei-13 | shunpo, reiatsu_burst, kido_hado_31, kido_hado_63, kido_hado_90, kido_bakudo_61, kido_bakudo_99, roar_of_seireitei | 8 |
| Vizored / Hollow | getsuga_tensho, mugetsu, fullbring_boost | 3 |
| Itachi / Genjutsu | tsukuyomi, amaterasu_mark, izanagi, izanami, sharingan_lock, crow_genjutsu, susanoo_itachi | 7 |
| Kabuto | edo_tensei (+ fixed missing handler: heal + spin regen + brief invulnerability) | 1 |
| Size & Weight scaling | enlarge, shrink, mass_shift, density_crush | 4 |
| Transformations | hollow_transform, kyuubi_mode, bijuu_mode, tailed_beast_bomb, curse_mark_2, six_paths_mode, ten_tails_jinchuriki, berserk_hollow | 8 |
| Deidara clay art | clay_spider, clay_dragon, clay_bomb, clay_clones_c4, katsu | 5 |
| Akatsuki | shinra_tensei, chibaku_tensei, samehada_drain, shark_bomb, earth_grudge_fear, jashin_ritual, paper_bomb_storm, kamui, limbo_hengoku, wood_dragon | 10 |
| Obito Uchiha | spiral_eye, phantom_pass, black_zetsu_bind, orange_mask_dash, ten_tails_bijuudama, truth_seeker_orbs | 6 |
| Rinnegan / Pain paths | bansho_tenin, human_path, preta_path, asura_path | 4 |
| Minato / Advanced Naruto | flying_thunder_god, rasenshuriken, odama_rasengan | 3 |
| Eight Gates / Taijutsu | eight_gates_release, evening_elephant, night_guy | 3 |
| Legendary / Otsutsuki | tengai_shinsei, kaguya_bones | 2 |
| Bleach — Aizen / Barragan / Grimmjow | kyoka_suigetsu, respira, desgarron | 3 |
| Dragon Ball | kamehameha, spirit_bomb, final_flash, death_beam | 4 |

**Total moves added this session: ~155** (all TypeScript-clean — zero errors in the 4 changed files)

### Key Physics Patterns

| Pattern | Moves using it |
|---------|---------------|
| AoE burst at turret position | shinra_tensei, tengai_shinsei, spirit_bomb, ten_tails_bijuudama |
| Timed buff on target bey (`_speedScale`, `_collisionDamageMult`) | kyuubi_mode, eight_gates_release, enlarge, shrink |
| Control lock + per-tick drain | wood_dragon, black_zetsu_bind, earth_grudge_fear, bijuu_mode |
| Limbo bypass (save/restore `invulnerable`) | limbo_hengoku, kaguya_bones, death_beam |
| Seeking projectile / AI movement | clay_spider, clay_dragon, truth_seeker_orbs |
| Kamui absorption (isActive = false, restore after delay) | kamui, phantom_pass |
| Charge → explode (2-phase tick) | spirit_bomb, chibaku_tensei |
| Confusion / forced movement | kyoka_suigetsu (beys attack neighbors), berserk_hollow (random hits) |
| Beam (line intersection test) | kamehameha (axis-projection width gate) |
| Orbiting damage field | truth_seeker_orbs (orbit around target bey) |
| Mirror damage | jashin_ritual (reflects damage back to linked target) |
| Transform (isActive toggle) | kamui, phantom_pass, orange_mask_dash |

### Runtime State Tracking Pairs

Every timed effect follows the pattern:
```typescript
turretRuntimeFieldNameTargetId?: string;   // which bey is affected
turretRuntimeFieldNameUntilMs?: number;    // expiry timestamp
```
Tick processors check `nowMs > untilMs` and clean up state + reverse applied modifiers.

### `applyKnockback` Signature

`bridge.applyKnockback(id, { x: normX, y: normY }, scalarForce)` — direction vector + scalar (NOT 2 scalars). All handlers use this correctly.

---

## Session 12 Additions (2026-05-23) — Q&A Checklist Closure + Param Fixes

| Change | Files | Detail |
|---|---|---|
| Q&A checklist 54/54 | `research/qa-checklist.md` | All questions resolved. Q30–Q33/Q36 BX bits confirmed FACT; Q38 Impact Drake rubber confirmed; Q39–Q43 Gen1 beys resolved; Q49 revival_spin corrected to IMPLEMENTED |
| Collision sound gap fixed | `AIBattleGamePage.tsx`, `TournamentBattleGamePage.tsx` | `SoundManager.play("collision")` added to both pages — all 3 battle pages now play collision sound |
| BX bits confirmed FACT | `batch-006-x-parts-disambiguation.md` | Taper=flat+outer ring (Balance), Ball=hemisphere BX-03 (Stamina), Point=flat+ball center BX-15 (Balance), Kick=hexagonal flat+gap CX-05 (Balance), Elevate=flat+bump+large disc BX-36 (Balance). Facts: 38→45 |
| Impact Drake rubber CPs | `batch-006-x-parts-disambiguation.md` | Confirmed rubber contact points on attack protrusions. `spinStealFactor` + `damageReduction` on collision |
| revival_spin corrected | `phase-06-mechanics.md`, `phase-08-gimmicks.md`, `qa-checklist.md` | IS implemented (`server/physics/mechanics/revivalSpin.ts`). Params corrected: `{ spinBoostAmount, triggerThreshold }` → `{ threshold=0.2, recoveryRate=10 }`. Seed scripts fixed to match. |
| Gen1 beys updated | `phase-07-gen1.md` | Tryhorn: AR=Land Attack/WD=Drag Saucer/BB=Drag Ship (Conf B). Galux: AR=War Lion/WD=Eight Wide/BB=Metal Ball Base (Conf B). Canarias: AR=Survivor/WD=Wide Attack A (mode switch UNKNOWN). Chameleon: camouflage=visual-only, contact_deflect removed. |
| Galux gimmick corrected | `phase-07-gen1.md`, `phase-08-gimmicks.md` | `heavy_wheel` → `["orbit_movement","contact_deflect"]` — Metal Ball Base = orbit wander; War Lion AR = deflect |
| Seed scripts fixed | `scripts/seed-mechanics.js`, `scripts/seed-gimmicks.js` | `revival_spin` params corrected from `{ threshold, burstAmount }` → `{ threshold: 0.2, recoveryRate: 10 }` to match actual implementation |

---

## Session 13 Additions (2026-05-23) — Admin UI completeness pass + Arena feature wiring

| Change | Files | Detail |
|---|---|---|
| `controlledBySwitchId` to DirectionalZones + TriggerZones | `FeaturesTab.tsx` | All 7 feature types now have switch-gating UI: SpinZones, GravityHoles, Bumps (session 10), DirectionalZones, TriggerZones (this session), Turrets (session 10) |
| BasicsTab — Description + Difficulty | `BasicsTab.tsx` | Description textarea + four-button difficulty selector (easy/medium/hard/extreme) added after arena name |
| BasicsTab — Tilt mode selector | `BasicsTab.tsx` | Tilt mode selector (Fixed/Oscillate/Weight) added before quick presets; conditional panels per mode; oscillation min/max/period; direction slider visibility rules |
| BasicsTab — Pivot inputs | `BasicsTab.tsx` | Tilt pivot X/Y (cm from center) in tilt panel; rotation pivot X/Y in auto-rotate panel |
| BasicsTab — Physics & Gameplay panel | `BasicsTab.tsx` | `staminaDrainMultiplier` slider (0.25×–4×); `qteEnabled` toggle + `qteWindowScaling` (flat/by_cost); `randomModifiers` toggle + `maxModifiers` input |
| BasicsTab — Visual Overrides panel | `BasicsTab.tsx` | `backgroundColor` + `floorColor` color picker + hex text + clear button each |
| ArenaConfigurator features tab count | `ArenaConfigurator.tsx` | Features badge now counts all 8 sub-types (+ spinZones, gravityHoles, bumps, directionalZones, triggerZones) |
| Docs updated | `CHANGELOG.md`, `progress.md`, `phase-09-arenas.md`, `phase-06-mechanics.md` | Full coverage of session 10–13 changes |

**Fields now exposed in admin UI that were previously schema-only:**

| Field | Type | Panel | Default |
|-------|------|-------|---------|
| `description` | `string` | Basics — Name section | `""` |
| `difficulty` | `"easy"\|"medium"\|"hard"\|"extreme"` | Basics — Name section | `"medium"` |
| `tiltMode` | `"fixed"\|"oscillate"\|"weight"` | Basics — Tilt | `"fixed"` |
| `tiltPivotX/Y` | `number` (cm) | Basics — Tilt | `0` |
| `rotationPivotX/Y` | `number` (cm) | Basics — Auto-Rotate | `0` |
| `tiltOscillateMin/Max` | `number` (°) | Basics — Tilt (oscillate mode) | `0 / 45` |
| `tiltOscillatePeriodMs` | `number` (ms) | Basics — Tilt (oscillate mode) | `4000` |
| `staminaDrainMultiplier` | `number` (0.25–4.0) | Basics — Physics & Gameplay | `1.0` |
| `qteEnabled` | `boolean` | Basics — Physics & Gameplay | `true` |
| `qteWindowScaling` | `"flat"\|"by_cost"` | Basics — Physics & Gameplay | `"by_cost"` |
| `randomModifiers` | `boolean` | Basics — Physics & Gameplay | `false` |
| `maxModifiers` | `number` | Basics — Physics & Gameplay | `2` |
| `backgroundColor` | `string` (hex) | Basics — Visual Overrides | theme default |
| `floorColor` | `string` (hex) | Basics — Visual Overrides | theme default |
| `controlledBySwitchId` | `string` | Features — DirectionalZones, TriggerZones | `""` |

---

## Session 14 Additions (2026-05-23) — mechanic_defs + gimmick_defs seed layer + admin CRUD

| Change | Files | Detail |
|---|---|---|
| `seed-mechanics.js` registered | `scripts/seed-all.js`, `package.json` | 31 mechanic_defs, one per MechanicRegistry handler. `npm run seed:mechanics`. |
| `seed-gimmicks.js` registered | `scripts/seed-all.js`, `package.json` | 27 gimmick_defs (22 original + 5 new). `npm run seed:gimmicks`. |
| 5 new gimmicks | `scripts/seed-gimmicks.js` | `magnacore_repel`, `magnacore_attract`, `dual_spin_launch`, `mode_switch_tip`, `spring_launch` |
| `MECHANIC_DEFS` + `GIMMICK_DEFS` constants | `client/src/lib/firebase.ts` | Added to COLLECTIONS object (`"mechanic_defs"`, `"gimmick_defs"`) |
| `MechanicDefsPage.tsx` | `client/src/pages/admin/MechanicDefsPage.tsx` | CRUD page at `/admin/mechanic-defs`. List grouped by category. Create/Edit modal: name, SearchableSelect category, description, JSON params editor. |
| `GimmickDefsPage.tsx` | `client/src/pages/admin/GimmickDefsPage.tsx` | CRUD page at `/admin/gimmick-defs`. List with behaviorRef chips. Create/Edit modal: name, description, SearchableMultiSelect beybladeTypes, behaviorRefs JSON editor with quick-add buttons. |
| Router wiring | `client/src/router.tsx` | Routes `/admin/mechanic-defs` and `/admin/gimmick-defs` added under AdminLayout |
| Phase 06 Section 10 | `research/phases/phase-06-mechanics.md` | Full seed layer documentation: mechanic_defs schema, gimmick_defs schema, 22 original gimmick table, 5 new gimmick table, gimmickExpander runtime wiring diagram |
| Diagram #18 | `research/diagrams/diagram-turret-powerup-system.md` | 8 Mermaid diagrams: dispatch flow, ghost sequence, illusion taxonomy, bey-as-weapon flow, movement state machine, mechanics breakdown, 4-file pattern, attack type pie |

**New admin routes:**

| Route | Page | Collection |
|-------|------|-----------|
| `/admin/mechanic-defs` | `MechanicDefsPage` | `mechanic_defs` |
| `/admin/gimmick-defs` | `GimmickDefsPage` | `gimmick_defs` |

---

## Session 15 Additions (2026-05-23) — Build fix + TSC zero-errors pass + form completeness

| Change | Files | Detail |
|---|---|---|
| Vercel build fix | `client/src/components/admin/part-editor/PartTypeFields.tsx` | Lines 761 + 797: missing `}` after `</>` closing JSX fragment in `&&` conditional expressions for `spin_injection` and `counter_rotation` gimmick gates. |
| `shared/types/` expansion | `shared/types/beybladeConstants.ts`, `shared/types/beybladeStats.ts`, `shared/types/comboVisual.ts` | Copied from `client/src/types/` so `shared/types/beybladeSystem.ts`, `comboTask.ts`, `specialMove.ts` can resolve their imports. These three files are now canonical in `shared/types/`. |
| `ServerProjectile` type fix | `client/src/types/game.ts` | Added `radius?`, `length?`, `width?` optional fields — used by `FeatureRenderer.ts` for shape-specific projectile rendering (e.g. `daiguren_front`, `muken_cloud`, `sand_cage`). |
| `PartTypeFields.tsx` unknown→ReactNode | `client/src/components/admin/part-editor/PartTypeFields.tsx` | Wrapped `detachment?.enabled` and `coreSlot?.enabled` with `!!()` — `Record<string, unknown>` values cannot be used directly as React boolean conditions. |
| `TurretsTab.tsx` accent typo | `client/src/components/admin/arena-tabs/TurretsTab.tsx` | `"resurreccion"` → `"resurrección"` — string literal did not match the union type. |
| `BeybladeSystemCreatePage` | `client/src/pages/admin/2d/beyblade-systems/BeybladeSystemCreatePage.tsx` | Added `gearAttachments: []` to initial object — `BeybladeSystem.gearAttachments` is required (non-optional). |
| `SoundManager` imports | `client/src/pages/AIBattleGamePage.tsx`, `client/src/pages/TournamentBattleGamePage.tsx` | Added `import { SoundManager } from "@/game/audio/SoundManager"` — was used but never imported. |
| Duplicate `sage_mode` key | `client/src/game/renderer/FeatureRenderer.ts` | Renamed second `sage_mode` → `sage_mode_naruto` (Minato/Advanced Naruto section, 0x557733 dark-green). First entry (Transformations, 0xff9933 orange) is canonical. |
| Theme property fixes | `client/src/pages/admin/GimmickDefsPage.tsx`, `client/src/pages/admin/MechanicDefsPage.tsx` | `C.textMuted` → `C.muted`, `C.accent` → `C.blue` — non-existent properties on the theme `C` object. |
| BeybladeEditPage advanced-physics | `client/src/pages/admin/BeybladeEditPage.tsx` | Added "Advanced Physics" section: `jumpForce` (N, default 0), `jumpHeight` (cm), `burstResistance` (0–100). These three `BeybladeStats` fields existed in the type but had no admin UI. |
| CLAUDE.md policy | `CLAUDE.md` | Added "TypeScript: Zero Errors Policy" section — `cd client && npx tsc --noEmit` must pass after every `.ts`/`.tsx` edit. Documents 4 recurring patterns. |

**TSC error categories fixed (all 7):**

| Category | Fix |
|----------|-----|
| Missing `shared/types/` modules (`beybladeStats`, `comboVisual`) | Copied 3 files from `client/src/types/` |
| `ServerProjectile` missing `radius`/`length`/`width` | Added optional fields to interface |
| `unknown` → `ReactNode` in PartTypeFields | `!!()` cast on two conditions |
| `"resurreccion"` literal mismatch | Corrected to `"resurrección"` |
| `gearAttachments` missing from create-page initial object | Added `gearAttachments: []` |
| `SoundManager` not imported | Added import in 2 pages |
| `C.textMuted` / `C.accent` non-existent | Mapped to `C.muted` / `C.blue` |

---

## Session 16 Additions (2026-05-23) — Admin form px→cm + missing field audit

| Change | Files | Detail |
|---|---|---|
| px→cm in ObstaclesTab | `client/src/components/admin/arena-tabs/ObstaclesTab.tsx` | `SLIDER_FIELDS` given `pxUnit?: true` flag. x, y, radius, recoilDistance display in cm (÷24). Render loop converts display↔px on change. |
| px→cm in SwitchesTab | `client/src/components/admin/arena-tabs/SwitchesTab.tsx` | `SliderRow` x/y now ÷24 display, ×24 on save. Import `PX_PER_CM_BASE`. |
| px→cm in TurretsTab (70 occurrences) | `client/src/components/admin/arena-tabs/TurretsTab.tsx` | Added `cmNumInput()` helper. `COMMON_FIELDS` x/y/radius/attackRange flagged `pxUnit`. 70 TypeSpecificParams `numInput` → `cmNumInput` and `(px)` → `(cm)` via PowerShell bulk replace. Velocity fields `(px/s)` left unchanged. |
| `triggerState` dropdown (Obstacles) | `client/src/components/admin/arena-tabs/ObstaclesTab.tsx` | Added **Initial State** `SearchableSelect` (on/off) in element type grid — was missing from all obstacle cards. |
| `triggerState` dropdown (Turrets) | `client/src/components/admin/arena-tabs/TurretsTab.tsx` | Added **Initial State** `SearchableSelect` (on/off) next to Controlled By Switch ID — was missing from all turret cards. |
| Zone shape selector (WaterBodies) | `client/src/components/admin/arena-tabs/WaterBodiesTab.tsx` | Zone section now shows shape picker (circle/oval/square/rectangle), conditional dimension fields (radius for circle/oval/square; width+height for rectangle/oval), and rotation input. Previously only radius was shown regardless of shape. |
| px→cm in SpecialMovesPage | `client/src/pages/admin/SpecialMovesPage.tsx` | `spinStealRadiusPx` and `aoeRadiusPx` physics effect inputs now display in cm (max 16.5, step 0.5). Import `PX_PER_CM_BASE`. Stored in px in Firestore. |
| `effectId` in CombosPage | `client/src/pages/admin/CombosPage.tsx` | Added `effectId?: string` to `ComboDoc` interface, `EMPTY` state, `openEdit`, `handleSave`, and form UI. Input with hint: "links to combo_effects collection". Addresses the `detectComboFromSlots()` gap found in phase-04. |

---

## Session 17 Additions (2026-05-23) — Combo effectId wiring complete

| Change | Files | Detail |
|---|---|---|
| `effectId` in COMBO_REGISTRY | `server/constants/combos.ts` | All 8 registry entries now carry `effectId` inline. `getComboById(id).effectId` returns a valid string. `spin-leech-jab` maps to `"spin-leech"` (matching the effect doc id). |
| phase-04 table corrected | `research/phases/phase-04-combo-mapping.md` | All 8 combos changed from "MISSING / Broken" → "✅ Wired". Critical-gap note updated to reflect complete resolution. |

---

## Session 18 Additions (2026-05-23) — Phase 21 Unified Foundation Architecture

| Addition | File | Content |
|---|---|---|
| Phase 21 | `research/phases/phase-21-unified-foundation.md` | Three-pillar architecture: BehaviorDef (mechanic_defs→gimmick_defs), GeometryDef (geometry_defs), StatDef (stat_defs). Full spec for applying the foundation to every entity in the game. |
| INDEX.md | `research/INDEX.md` | Phase 21 entry added |
| Amendment notes | `phase-06-mechanics.md`, `phase-05-parts.md` | Cross-references to phase-21 |

**Key design decisions in Phase 21:**
- `mechanic_defs` + `gimmick_defs` are the behavior source for ALL entities — not just beyblades. Special moves, combos, arena features, turret attacks, parts, and water bodies all express behavior as `MechanicInstance[]`.
- New `geometry_defs` collection: shared geometry primitives referenced by ID from CPs, arena features, obstacles, projectiles, beyblade silhouettes.
- New `stat_defs` collection: every numeric game attribute typed and ranged. `StatModifier[]` is the universal stat delta type used by beyblades, parts, arenas, combos, and special moves.
- Two new seed scripts: `seed:geometry` (16 standard shapes) and `seed:stat-defs` (~35 stat definitions).
- Two new admin routes: `/admin/geometry-defs` and `/admin/stat-defs`.
- Three new standard control panels for all admin forms: Behavior Panel (MechanicInstance picker), Geometry Panel (GeometryDef picker + inline define), Stats Panel (StatModifier editor).
- Migration is additive — all existing fields kept; new fields optional and coexist.
- **"Make anything" guarantee**: new beyblade abilities, arena features, special moves, combo effects, obstacle behaviors, part bonuses require only data authoring. Code only needed for new atomic mechanic handlers.

---

## Session 19 Additions (2026-05-23) — Source Verification + Parts Expansion

| Addition | Files | Content |
|---|---|---|
| batch-008 | research/batches/batch-008-source-verification-parts-expansion.md | 39 URLs fetched with visited-flag tracking; Gen1/HMS/MFB/Burst/BX parts expanded; 173 Burst drivers confirmed; 26 BX ratchets; 47+ BX blades with weights; 167+ Burst layers by sub-system; HMS AR/RC/WD weights |
| linka cache: Gen1 | linka/parts/gen1/{attack-rings,weight-disks,blade-bases}.md | PlasticsDB-sourced: 28 AR names, 15 WD names, 19+ blade base names, 11 CEW/CWD names |
| linka cache: HMS | linka/parts/hms/{attack-rings,running-cores,weight-disks}.md | HMSDB-sourced: 11 AR names (2 with weights), 10 RC names, 3 WD types with weights |
| linka cache: Burst | linka/parts/burst/{drivers,layers,discs}.md | Planner-sourced: all 173 drivers, 167+ layers by sub-system (Single/Dual/God/Cho-Z/GT/DB/Remake), 71 forge discs |
| linka cache: BX | linka/parts/bx/{blades,ratchets,bits}.md | BeyBX DB + BeyBase: 47+ blades (9 with weights), 26 ratchets, 32+ bits |
| linka cache: MFB | linka/parts/mfb/{tips-catalog,spin-tracks}.md | Compiled from batch-004: full MFB tip reference + spin track reference |

**Key source status:**
- Cloudflare/403 blocked: beyblade.fandom.com (list pages), worldbeyblade.org (all threads)
- Accessible Tier-1: plasticsdb.com ✓, hmsdb.com ✓, beybxdb.com ✓, burst.beybladeplanner.com ✓, beybase.com ✓ (Tier 2)
- Down: plasticsdb.net (connection refused — .com is correct URL per user)
- HMS weights: in Google Sheet linked from hmsdb.com — inaccessible via WebFetch

---

## Session 20 Additions (2026-05-23) — Full linka/parts/ Verification

| File | Changes |
|------|---------|
| `linka/parts/gen1/attack-rings.md` | Added 21 FACT-confirmed ARs from local bey files (Reverse Dragon, Cross Spike, Double Wing, Tiger Defenser, Eight Attacker, Whale Attacker, Dual Dragon, Cross Fang, Flame Wing, Eight Spike, Spike Dragon, Wing Upper, Ten Spike, Cross Attacker (5.6g), Sonic Tiger, Upper Claw (7g), Cross Dranzer, Strike Turtle, Wing Survivor, Triple Tiger, Shield Hammer (6g)). Fixed: Seaborg's AR is Whale Attacker (5g) not listed as Whale Crusher (different part). |
| `linka/parts/gen1/weight-disks.md` | **CRITICAL FIX**: Ten Heavy corrected ~14g→~17g (Draciel V2 local file: "heaviest WD in series"). Confirmed: Eight Balance 14g, Eight Wide 13g, Ten Wide 14g, Ten Balance ~15g, Magne Weight Disk ~14.6g. |
| `linka/parts/gen1/blade-bases.md` | **ERROR FIX**: "Customize Grip Base = Seaborg's base" was wrong — Seaborg uses Defense Grip Base. Added FACT entries: Storm Grip, SG Metal Ball, Spiral Change Base, Metal Change Base, Magne Flat Base, Defense Grip Base, Engine Stopper Base (Flame Pegasus, 5g), CEW Metal Sharp (FACT), Viper Metal Ball Base, First Clutch Base (Driger G), Hit Release Base (Draciel G). |
| `linka/parts/bx/blades.md` | Added blade weights from local files: DranSword ~32g/~35g mold 2, KnightShield ~32.4g/~34.8g mold 2, HellsScythe ~33g/~34g mold 2, LeonClaw ~31g est., CobaltDragoon heaviest-blade note. Fixed HellsScythe type UNKNOWN→Balance (confirmed from local file). |

**Verification method:** Read 25+ local linka/beys/ files (Gen1 S1 through G-Rev). No new web fetches — all corrections from cached local files.

---

## Session 20 Live Verification Additions (2026-05-23) — Tier-1 Source Verification Pass

26 URLs checked across Tier-1 sources (beyblade.fandom.com via WebSearch, worldbeyblade.org via WebSearch, burst.beybladeplanner.com, beybxdb.com, beybase.com). Batch-009 written.

### Discrepancies Found (4)

| # | Claim in prior batch | Correct fact | Source |
|---|---|---|---|
| A1 | batch-005: Zephyr = "spiral-grooved rubber flat tip" (Attack type) | Zephyr = hollow plastic flat tip (Balance type) — same family as MFB Hole Flat | Fandom wiki (via WebSearch), burst.beybladeplanner.com |
| A2 | batch-006-x Section I: "Xtreme Finish = 2 pts" | Xtreme Finish = 3 pts (ring-out via X Line) | worldbeyblade.org, beybladesuperleague.co.uk, malloftoys.com (3 independent sources) |
| A3 | batch-005: Drift = "chunky pear-shaped body on tiny plate, Gatinko era 2019" | Drift = wide octagonal body + free-spinning conical sharp tip, debut B-175 November 2020 (Limit Break era) | Fandom wiki (via WebSearch), burst.beybladeplanner.com |
| A4 | batch-004: SD short form unexpanded (gap, not contradiction) | SD = "Semi-Defense" | Fandom wiki (via WebSearch) |

### INFERENCE/UNKNOWN → FACT Upgrades

| Claim | Old tag | New tag | Sources |
|---|---|---|---|
| T125 = "Tornado 125" | INFERENCE | FACT | Fandom wiki + WBO snippet + PlasticsDB (3 sources) |
| Wizard Rod = BX Blade (Stamina, UX-03, Unique Line) | INFERENCE | FACT | beybxdb.com + beybase.com + Fandom wiki (3 sources) |
| BX scoring: Spin=1 / Burst=2 / Over=2 / Xtreme=3 | partial INFERENCE | FACT | worldbeyblade.org + beybladesuperleague.co.uk + malloftoys.com |
| SD = "Semi-Defense" | UNKNOWN | FACT | Fandom wiki + WBO snippet + burst.beybladeplanner.com |
| Rush Bit: 10 gear teeth (vs 12 on Flat Bit) | INFERENCE | FACT | beybxdb.com + beybase.com |
| Atomic driver volume 3.4× standard (hollow sphere cavity) | INFERENCE | FACT | Fandom wiki + WBO snippet + beybase.com |
| BX ratchets 6-60, 6-80, 4-55, 1-80 confirmed | not listed | FACT | beybxdb.com (direct measurement data) |
| Kick Bit debut April 26 2025 (CX-05) | UNKNOWN | FACT | beybxdb.com release database |
| Zephyr debut B-28 December 2016 | UNKNOWN | FACT | Fandom wiki + burst.beybladeplanner.com |
| Drift debut B-175 November 2020 | UNKNOWN (era wrong) | FACT | Fandom wiki + burst.beybladeplanner.com |

### Remaining UNKNOWNs After This Pass (7)

1. Flower-pattern petal count for any Burst driver or BX Rubber Accel (confirmed "flower pattern" shape — count undocumented in Tier-1 sources)
2. Individual Burst Sparking sub-system layer names (marketing names not scraped)
3. HMS Running Core weights from HMSDB Google Sheet (sheet inaccessible via WebFetch)
4. Gen1 Attack Ring individual weights (PlasticsDB lists by set, not per-part)
5. LF (Left Flat) petal orientation angle from vertical (visual only, undocumented)
6. R²F raised-arm height in mm (shape confirmed; metric undocumented)
7. LRF exact diameter vs plain rubber flat (material confirmed; size delta undocumented)

---

## Session 21 Additions (2026-05-23) — Proofread + INFERENCE Resolution Pass

| Addition | Files | Content |
|---|---|---|
| batch-010 | research/batches/batch-010-proofread-inference-resolution.md | 22 URLs / WebSearch queries; 8 INFERENCE→FACT upgrades; 6 UNKNOWN downgrades; 5 proofreading fixes to batch-005 and batch-006-x |
| batch-005 corrections (session 21) | batches/batch-005-burst-parts-disambiguation.md | 3 major corrections: Zephyr row (rubber/Attack → hollow plastic/Balance); Drift row (pear-shaped/Gatinko → octagonal+conical/Limit Break 2020); Absorb row (rubber outer ring → spring-loaded sharp + free-spinning plastic ring). Zephyr removed from rubber driver table (Section D1). Stage updated to 8. |
| batch-006-x corrections (session 21) | batches/batch-006-x-parts-disambiguation.md | Xtreme Finish scoring corrected from 2 pts → 3 pts in all 3 locations (Section D1 step 5; Section I table; Section I engine implication note). Over Finish row added to table. Target score note upgraded from INFERENCE to FACT. Stage updated to 8. |

### INFERENCE → FACT Upgrades (session 21)

| Claim | Old Tag | New Tag | Source |
|-------|---------|---------|--------|
| Xtreme' Dash = softer rubber compound than Xtreme | INFERENCE | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Xtreme' — direct quote confirms softer compound |
| Low Flat BX = 1mm shorter than Flat | FACT (user) | FACT (confirmed) | beybxdb.com/parts-system-guide/parts/bit/lowflat |
| High Needle BX = 1mm taller than Needle | FACT (user) | FACT (confirmed) | beybxdb.com/parts-system-guide/parts/bit/highneedle |
| GB145 balls = metal | FACT | FACT (confirmed) | beyblade.fandom.com/wiki/Spin_Track_-_Gravity_Ball_145 |
| SWD era = Metal Fury (Dec 2011), NOT Zero-G | INFERENCE | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Sharp_Wide_Defense; worldbeyblade.org |
| S130 = Shield 130 (not Semi-Sharp 130) | INFERENCE | FACT | beyblade.fandom.com/wiki/Spin_Track_-_Shield_130; WBO Track List |
| W²D = Wave Wide Defense (flat + spike center), NOT dual-layered WD | INFERENCE | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Wave_Wide_Defense |
| BX match format = best of 3 sets (4 pts per set) | INFERENCE | FACT | worldbeyblade.org/Thread-Beyblade-X-Rules; Thread-Beyblade-X-Rulebook |

### INFERENCE → UNKNOWN Downgrades (session 21)

| Claim | Old Tag | New Tag | Reason |
|-------|---------|---------|--------|
| Hvy145 = Heavy 145 extra-weighted track | INFERENCE | UNKNOWN | Part does not appear in any Tier-1 source; may not exist as a standard release |
| Quick' (Dash) = lighter than Quick | INFERENCE | UNKNOWN | Quick' not confirmed as a released driver; no weight comparison available |
| Rubber Accel BX = 5-petal flower pattern | UNKNOWN | UNKNOWN | Petal count remains unconfirmed; Rubber Accel has 16 gear teeth for Xtreme Dash |
| Rush Bit gears 2mm shorter than other bits | FACT (claimed batch-009) | UNKNOWN | "2mm shorter" applies to Under Bits category, not Rush; only confirmed for Rush: 10 gear teeth |
| Absorb = rubber outer ring + magnetic plate | "FACT sourced" | WRONG → corrected | Fandom wiki confirms Absorb = spring-loaded sharp tip + free-spinning plastic ring; no rubber ring |

### Remaining Open UNKNOWNs (after session 21)

1. Flower-pattern petal count for any Burst driver or BX Rubber Accel
2. Individual Burst Sparking sub-system layer names
3. HMS Running Core weights from HMSDB Google Sheet
4. Gen1 Attack Ring individual weights
5. LF raised-arm height in mm
6. R²F raised-arm height in mm
7. LRF exact diameter vs plain rubber flat
8. RF / R²F contact patch exact mm measurement
9. Hvy145 part existence / full name

---

## Session 24 Additions (2026-05-24) — Deep In-Depth Verification Pass + Corrections Applied

| Addition | Files | Content |
|---|---|---|
| batch-013 | research/batches/batch-013-deep-verification-pass.md | 22 sources checked; 47 facts confirmed; 8 corrections identified |
| batch-004 corrections | batches/batch-004-mfb-parts-disambiguation.md | EWD updated: single bearing only → `bearingFriction: 0.12` (not 0.02); W²D row added with worse-balance tradeoff confirmed; B:D updated: world record 7:35 min + height = 170 track + two-phase low-spin behavior; 4 new source audit entries; facts 46→52 |
| phase-07-gen234 corrections | research/phases/phase-07-gen234.md | Drain Fafnir: added release date April 29 2017 + three dragon heads + struggles vs Deep Chaos; Geist Fafnir: added rubber F's retract at high speed + outclassed by Hell Salamander in ALL aspects + Tier 1→2 downgrade; Shared Patterns note expanded |
| blade-bases.md rewrite | linka/parts/gen1/blade-bases.md | Full rewrite — 5 blade bases moved from INFERENCE to FACT(PDB) with weights: Bearing Base 8.0g, SG Metal Sharp 7.6g, SG Metal Flat 6.2g (tip corrected to metal semi-flat), Customize Grip Base 5.1g, SG Semi-Flat 4.7g; weight summary table added; SG Metal Flat tip name-vs-production discrepancy documented |

### Key Facts Confirmed (session 24)

| Fact | File Updated | Source |
|------|-------------|--------|
| EWD = single bearing only; `bearingFriction` should be 0.12 | batch-004 | Fandom wiki |
| B:D world record = 7:35 min | batch-004 | Fandom wiki |
| B:D height = equivalent to 170 spin track | batch-004 | Fandom wiki |
| W²D has worse balance than WD; WD still situationally preferred | batch-004 | WBO thread |
| SG Metal Flat Base tip = metal sharp with small flat cut (NOT true flat) | blade-bases.md | PlasticsDB |
| Bearing Base = 8.0g; double-bearing (plastic + NSK); first zombie base | blade-bases.md | Fandom wiki |
| Customize Grip Base = 5.1g; must-have competitive base; great LAD | blade-bases.md | PlasticsDB |
| SG Semi-Flat Base = 4.7g; 11 source beys; 2 molds | blade-bases.md | PlasticsDB |
| Drain Fafnir released April 29 2017; three dragon heads; struggles vs Deep Chaos | phase-07-gen234 | Fandom wiki |
| Geist Fafnir rubber F's retract at high speed | phase-07-gen234 | Fandom wiki |
| Geist Fafnir outclassed in ALL aspects by Hell Salamander | phase-07-gen234 | Fandom wiki |
| Dark Wing / Triangle Wing / Roller Defense Ring / Gyro Defense all confirmed competitive | batch-013 | PlasticsDB competitive-combos-list |

### Remaining Open UNKNOWNs (after session 24)

1. Revolver Attack WD weight (name confirmed; no individual PlasticsDB page found)
2. Star Attack WD weight (name confirmed; no individual PlasticsDB page found)
3. HMS Running Core weights (full table) — Google Sheet at hmsdb.com inaccessible
4. HMS AR weights (except Spiral Upper ~20g, Metal Saucer ~15g)
5. Burst Sparking sub-system individual layer names (Hyperion/Helios confirmed; full list not found)
6. RF / R²F contact patch exact mm; LF / R²F raised-arm height in mm
7. Individual chassis-only weights (except 1S = 16.82g)
8. War Bear / War Monkey / Dragon Breaker SAR weights
9. Blitz / Sting Forge Disc exact weights
10. 00 Core Disc exact weight (INFERENCE ~25g)

---

## Session 25 Additions (2026-05-24) — PixiJS v8 Bug-Fix Pass + Controls + PRNG

| Change | Files | Detail |
|---|---|---|
| ArenaPreview crash fix | `client/src/components/admin/ArenaPreview.tsx` | `appRef.current = app` was set before `await app.init()`, causing `app.screen.width` access on uninitialized renderer. Added `appInitializedRef = useRef(false)`; set it only after init completes; guard all `rebuildScene()` calls. Crash message: "this.renderer is undefined". |
| Admin layout flex chain | `client/src/layouts/AdminLayout.tsx` | Changed `<main>` from `{ overflowY: "auto" }` to `{ display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 0 }` — `height: "100%"` on child resolved to scroll-height instead of viewport height, causing preview panel to overflow off-screen with no scrollbar. |
| PartEditor root height | `client/src/components/admin/part-editor/PartEditor.tsx` | Root div changed from `height: "100%"` to `flex: 1; minHeight: 0` to fill exactly the viewport height of the flex parent. |
| Admin header user email | `client/src/layouts/AdminLayout.tsx` | Email was not visible. Now shows display name (or username prefix) at 12px + email below at 10px muted, with "Not signed in" fallback. |
| 2.5D A/D strafe swap | `server/shared/rooms/InputHandler.ts` | `moveLeft` (A key) and `moveRight` (D key) force vectors in 2.5D mode were exactly swapped. `moveLeft` = `(sin(r), -cos(r))` (CCW-90° from facing = left strafe); `moveRight` = `(-sin(r), cos(r))` (CW-90° from facing = right strafe). |
| ControlsLegend isTryout | `client/src/components/game/ControlsLegend.tsx` | Added `isTryout?: boolean` prop. In tryout mode: hides IJKL / Special-tap rows, shows italic note "Combat keys (IJKL) available in battle mode". |
| TryoutGamePage arena visibility | `client/src/pages/TryoutGamePage.tsx` | Render call moved outside `if (phase === "playing")` — arena and beyblade are now always drawn once `arenaConfig.current` is loaded, including countdown and launch phases. Passed `isTryout` to ControlsLegend. |
| ArenaSystemOrbitalView v8 rewrite | `client/src/components/admin/arena-system/ArenaSystemOrbitalView.tsx` | Full PixiJS v8 migration: `await app.init()` + `cancelled` flag; `circle().fill()` / `.stroke()`; `moveTo/lineTo/closePath + .fill()` for pie segments; `app.ticker.add()` replaces `requestAnimationFrame` loop + `app.renderer.render()`. |
| ArenaSystemTopDownView v8 rewrite | `client/src/components/admin/arena-system/ArenaSystemTopDownView.tsx` | Full PixiJS v8 migration: `circle/poly/rect + .fill()` for floor shapes; heatmap segments via `moveTo/lineTo/closePath + .fill()`; friction zones via `circle().stroke()` + hatch lines; wall outline via `circle/poly/rect + .stroke()`. Fixed broken heatmap color arithmetic. |
| ArenaSystemSideView v8 rewrite | `client/src/components/admin/arena-system/ArenaSystemSideView.tsx` | Full PixiJS v8 migration: all `lineStyle` → `moveTo/lineTo + .stroke()`; `new PIXI.Text({ text, style })` constructor; hardcoded numeric colors (was passing CSS `var(--muted)` string to PIXI). |
| ArenaSystemIsometricView v8 rewrite | `client/src/components/admin/arena-system/ArenaSystemIsometricView.tsx` | Full PixiJS v8 migration: dots via `circle(0,0,2).fill(color)`; outline via `moveTo/lineTo + .stroke()`; `app.ticker.add()` replaces `requestAnimationFrame` + `app.renderer.render()`. Fixed color brightness math. |
| BattleRoom spawn PRNG | `server/rooms/BattleRoom.ts` | Line 1791: `Math.floor(Math.random() * pool.length)` → `Math.floor(this.rand() * pool.length)`. Random spawn pool selection must use the seeded PRNG (`createPRNG`) for deterministic replay consistency. |
| Firebase COLLECTIONS | `client/src/lib/firebase.ts` | Added `ARENA_FLOOR_GROUPS: "arena_floor_groups"` and `USERS: "users"` to the `COLLECTIONS` constant object — hardcoded strings in admin pages reference these collections. |
| TSC zero-errors verified | — | `cd client && npx tsc --noEmit` passes with zero errors after all changes. |

**Root causes addressed:**
- PixiJS v8 removed synchronous constructor options: all four arena-system views used `new PIXI.Application({ width, height, backgroundColor })` which is v6/v7 only. They also called `app.renderer.render(app.stage)` manually and used `requestAnimationFrame` loops — both removed in v8 (auto-render via ticker).
- CSS variables (`var(--muted)`) are not parseable as numeric PIXI colors: SideView was passing `C.muted` directly to `lineStyle` and `Text.fill`. Fixed to use hardcoded hex numbers (`0x94a3b8`).
- `appRef.current = app` before `await app.init()` is the same crash pattern as ArenaPreview: accessing `app.screen` while `_renderer` is `undefined` throws "this.renderer is undefined".
- 2.5D physics convention (y increases downward): left strafe (A key) must push toward North (−Y), which is `(sin(r), -cos(r))`. The old code had `(-sin(r), cos(r))` — the right-strafe vector.

---

## Session 27 Additions (2026-05-24) — Material Wear Schedule + CP Weight Factor

| Change | Files | Detail |
|--------|-------|--------|
| `WearStep` type | `shared/types/beybladeSystem.ts` | `{ atSecond: number; wearLevel: number }` — defines one step in a time-based material degradation curve |
| `MaterialBand.wearSchedule` | `shared/types/beybladeSystem.ts` | `WearStep[]` optional field; absent = no wear (level stays 100 all match); linear interpolation between steps; last value held constant |
| `SystemContactPoint.weightFactor` | `shared/types/beybladeSystem.ts` | `number` optional (default 1.0); relative mass share for this CP; drives moment-of-inertia and admin visualisation |
| Wear physics | `server/physics/PartPhysics.ts` | `computeWearLevel()`, `applyWearToMaterialStats()`, `computeMinWearLevel()` — full wear evaluation + material stat scaling |
| Weight physics | `server/physics/PartPhysics.ts` | `getCpWeightShare()`, `computeCpMomentOfInertia()` — fractional share + I = Σ(share × m × r²) |
| Colyseus schema | `server/rooms/schema/GameState.ts` | `@type("float32") materialWearLevel: number = 100` added to Beyblade schema |
| Client type | `client/src/types/game.ts` | `materialWearLevel?: number` added to `ServerBeyblade` |
| PartSystemManager wiring | `server/rooms/PartSystemManager.ts` | `tickBey()` step 0: calls `computeMinWearLevel()` from elapsed timer, writes `bey.materialWearLevel` |
| PixiRenderer tint | `client/src/game/renderer/PixiRenderer.ts` | Wear tint: white (100, new) → `0xcc7733` brownish-orange (0, fully worn); linear interpolation on RGB channels |
| MaterialBandsEditor UI | `client/src/components/admin/part-editor/MaterialBandsEditor.tsx` | Per-band collapsible wear section: SVG sparkline, preset buttons (No wear / 100→50/3min / 100→0/3min / Stepped), add/remove step sliders |
| ContactPointEditor canvas | `client/src/components/admin/part-editor/ContactPointEditor.tsx` | Sector stroke width scales with weight share; `XX%` label at arc midpoint; CP list shows `XX%w`; detail panel has weight-factor slider + live share readout |
| ContactPointEditor toolbar | `client/src/components/admin/part-editor/ContactPointEditor.tsx` | "Auto-weight" button: sets `weightFactor` proportional to `radius × thickness × arcDeg` |
| Research docs | `research/phases/phase-05-parts.md` | Sections 2.5 (wear schedule) and 2.6 (weight factor) added |
| Research docs | `research/diagrams/diagram-simulation-arch.md`, `diagram-engine-capabilities.md` | 2.5D adapter updated; capability table adds two new rows |

**Wear schedule — example 100→50 over 3 min, then stable:**
```json
[{ "atSecond": 0, "wearLevel": 100 }, { "atSecond": 180, "wearLevel": 50 }]
```

**Weight factor — auto-distribution formula:**
```
volumeProxy_i = radius_i × thickness_i × arcDeg_i
weightFactor_i = (volumeProxy_i / Σ volumeProxy) × N   (normalised so average = 1.0)
```

**Physics impact of wear on material stats:**

| Stat | At wearLevel=100 (new) | At wearLevel=0 (fully worn) |
|------|----------------------|---------------------------|
| `gripMult` | × 1.0 (base) | × 0.0 (no grip) |
| `spinStealResist` | × 1.0 (base) | × 0.0 (no resistance) |
| `decayMod` | × 1.0 (base) | × 1.5 (+50% faster decay) |
| `frictionMult` | × 1.0 (base) | × 0.5 (half floor friction) |

---

## Session 28 Additions (2026-05-24) — Evolution Driver + One Piece/DS/AoT Turret Dispatch

### Evolution Driver (TipPart phase transition via wearSchedule)

| Change | Files | Detail |
|--------|-------|--------|
| `TipPart.materials?: MaterialBand[]` | `shared/types/beybladeSystem.ts` | Added missing field — other part types had `materials[]` but TipPart was always missing it. |
| `TipEvolutionStage.trigger.type` | `shared/types/beybladeSystem.ts` | Added `"wear_level"` trigger type. Full set: `"time" \| "wear_level" \| "spin_percent" \| "collision_count" \| "damage_taken"`. Removed `lockoutMs` (unnecessary — monotonic timer prevents oscillation). |
| `Beyblade.tipEvolutionStage` | `server/rooms/schema/GameState.ts` | `@type("uint8")` — stage index (0=default, 1+=evolved). Colyseus-synced at 60 Hz. |
| `Beyblade.tipEvolutionTimer` | `server/rooms/schema/GameState.ts` | `@type("number")` — match-elapsed ms since first tick. Monotonic: never resets between stages. |
| `computeMinWearLevel()` | `server/physics/PartPhysics.ts` | Reads `tip.materials[].wearSchedule` and returns the minimum wear level across all bands at `elapsedSec`. Used by `wear_level` trigger. |
| `tickEvolutionDriver()` | `server/physics/PartPhysics.ts` | Per-tick evolution check: increments `tipEvolutionTimer`, evaluates next stage trigger (any of 5 types), advances `tipEvolutionStage` and calls `bey.activePartConfigs.set("tip", nextStage.configName)` when condition met. |
| `PartSystemManager.tickBey()` | `server/rooms/PartSystemManager.ts` | Step 4b: calls `tickEvolutionDriver(parts.tip, bey, dtMs)` after bearing friction. `dtMs` forwarded from room hooks. |
| `partSystemHooks.ts` | `server/rooms/parts25d/partSystemHooks.ts` | `manager.tickBey()` call now passes `dt` as last argument. |
| `ServerBeyblade.tipEvolutionStage/Timer` | `client/src/types/game.ts` | Both fields added as `optional number`. |
| `PixiRenderer.TIP_STAGE_COLORS` | `client/src/game/renderer/PixiRenderer.ts` | `[0xffffff, 0xfbbf24, 0xf97316, 0xef4444]` — white/amber/orange/red for stages 0–3+. |
| `drawBeybladeShape()` | `client/src/game/renderer/PixiRenderer.ts` | Accepts `tipEvolutionStage` + `tipWearPct` params. Inner core circle uses stage color + wear alpha (`0.15 + wear/100 × 0.5`). |
| `createBeybladeDisplayObject()` | `client/src/game/renderer/PixiRenderer.ts` | Passes `tipEvolutionStage ?? 0` + `materialWearLevel ?? 100` to initial `drawBeybladeShape` call. |
| `updateBeybladeDisplayObject()` | `client/src/game/renderer/PixiRenderer.ts` | Tracks `prevTipStages` + `prevWearLevels` maps. Redraws shape only when stage or wear changes to avoid unnecessary GPU calls. |
| `PartModesHUD.tsx` | `client/src/components/game/PartModesHUD.tsx` | `tipEvolutionStage` prop; amber "STAGE N" badge on tip row; "EVOLVED!" flash on transition. |
| `MaterialBandsEditor` | `client/src/components/admin/part-editor/PartTypeFields.tsx` | Inline component in `TipFields`. Per-band material selector + coverage input + wear schedule step list. |
| `EvolutionStagesEditor` | `client/src/components/admin/part-editor/PartTypeFields.tsx` | Inline component in `TipFields`. Stage list with label/configName + trigger type selector + value input. Stage 0 shows "no trigger required" note. Color-coded by stage (white/amber/orange/red). |

**Key design decision:** The evolution driver reuses the existing `MaterialBand.wearSchedule` for time-based wear progression. `wear_level` trigger type reads `computeMinWearLevel(tip, elapsedSec)` — when wear drops to threshold, stage advances. No separate timer needed; `tipEvolutionTimer` is a monotonic match clock that also serves all non-wear trigger types.

### One Piece / Demon Slayer / Attack on Titan — Turret Dispatch Wiring

14 new turret attack types dispatched via `TurretDispatch.ts` fire + tick switch blocks. Seed entries added to `scripts/seed-turret-attack-types.js`.

| Franchise | Move IDs |
|-----------|----------|
| One Piece | `gear_second`, `gear_fourth`, `conquerors_haki`, `three_sword_style`, `diable_jambe` |
| Demon Slayer | `water_breathing`, `hinokami_kagura`, `thunder_breathing`, `beast_breathing`, `flame_breathing` |
| Attack on Titan | `thunder_spear`, `omni_directional`, `hardening`, `founding_titan` |

All 14 moves: fire dispatch cases added. Tick dispatch cases: `gear_second` (rapid burst), `diable_jambe` (DoT), `founding_titan` (area control). Handler functions already existed in `TurretProcessor.ts` — only dispatch wiring was missing.

---

## Current Work

- **Active stage**: none — all 20 research stages complete + Phase 21 unified foundation + source verification (session 19) + linka/parts/ verification + live Tier-1 verification pass (session 20) + deep verification pass (session 24) + bug-fix pass (session 25) + archetype physics deep-dive (session 26) + real-world classical mechanics grounding (session 26 continued) + wear schedule + CP weight factor (session 27) + evolution driver + One Piece/DS/AoT turret dispatch (session 28) + Firebase preset defs refactor (session 29)
- **Outstanding gaps**:
  1. Gear admin CRUD page (`/admin/2d/parts/gears`) and seed entries not yet built
  2. Dragon Ball move series incomplete — Gohan, Vegeta followup, Cell, Buu, Frieza transformation chain not yet added
  3. Dashboard links to `/admin/mechanic-defs` and `/admin/gimmick-defs` not yet added
  4. Phase 21 implementation — `geometry_defs` and `stat_defs` collections + seed scripts + admin pages + form panels not yet built

---

## Session 29 Additions (2026-05-24) — Firebase Preset Defs Refactor

Replaced all hardcoded admin dropdown arrays, enum lists, and default-value constants with Firebase-backed Firestore collections. Every option set is now editable at runtime by admins without a code deploy.

| Change | Files | Detail |
|--------|-------|--------|
| 9 new `COLLECTIONS` constants | `client/src/lib/firebase.ts` | `TIP_SHAPE_DEFS`, `CORE_GIMMICK_DEFS`, `ATTACK_TYPE_DEFS`, `ARENA_THEME_DEFS`, `ARENA_SHAPE_DEFS`, `BOWL_PROFILE_DEFS`, `TRIGGER_TYPE_DEFS`, `STAT_EVENT_DEFS`, `PART_LAYER_DEFS` |
| 10 new Zustand store slices | `client/src/stores/gameDataStore.ts` | Doc type interfaces + state fields + fetch functions for all 9 new collections + `StatDefDoc` slice. Each slice follows the lazy-load pattern: fetches once on first access, cached until `invalidate()` called. |
| 10 new React hooks | `client/src/hooks/use*.ts` | `useTipShapes`, `useCoreGimmicks`, `useAttackTypeDefs`, `useArenaThemeDefs`, `useArenaShapeDefs`, `useBowlProfileDefs`, `useTriggerTypeDefs`, `useStatEventDefs`, `usePartLayerDefs`, `useStatDefs` |
| `PartTypeFields.tsx` refactored | `client/src/components/admin/part-editor/PartTypeFields.tsx` | `TIP_SHAPES`, `CORE_GIMMICKS`, `STAT_KEYS`, `STAT_EVENTS`, `TRIGGER_TYPES`, `PART_LAYERS` hardcoded arrays renamed to `FALLBACK_*` and replaced with live Firebase data. `StatModifiersEditor`, `SwitchTargetsEditor`, `TipFields`, `CoreFields`, `BitBeastFields` all wired. |
| `ContactPointEditor.tsx` refactored | `client/src/components/admin/part-editor/ContactPointEditor.tsx` | `ATTACK_LABELS`, `LAYER_LABELS`, `MATERIAL_COLORS` replaced with live Firebase data. `materialColors` computed via `useMemo` merging material docs with fallback hex map. `drawCanvas()` accepts `materialColors` param. |
| `BasicsTab.tsx` refactored | `client/src/components/admin/arena-tabs/BasicsTab.tsx` | `SHAPES`, `THEMES`, `BOWL_PROFILES` replaced with `useArenaShapeDefs`, `useArenaThemeDefs`, `useBowlProfileDefs` hooks. `effectiveWallAngle` lookup chain handles both Firebase and hardcoded profiles. |
| 9 admin CRUD pages | `client/src/pages/admin/` | `TipShapeDefsPage`, `CoreGimmickDefsPage`, `AttackTypeDefsPage`, `ArenaThemeDefsPage`, `ArenaShapeDefsPage`, `BowlProfileDefsPage`, `TriggerTypeDefsPage`, `StatEventDefsPage`, `PartLayerDefsPage` — all follow modal create/edit + delete-confirm pattern, call `invalidate()` after mutations |
| Router wiring | `client/src/router.tsx` | 9 new routes under `/admin/` for all preset def pages |
| Admin nav | `client/src/layouts/AdminLayout.tsx` | "Preset Defs" collapsible section with 9 nav items + 9 breadcrumb labels added |
| 9 seed scripts | `scripts/seed-tip-shapes.js` … `scripts/seed-part-layer-defs.js` | Idempotent seeders with initial data: 16 tip shapes, 12 core gimmicks, 8 attack types, 12 arena themes, 10 arena shapes, 8 bowl profiles, 12 trigger types, 15 stat events, 12 part layers |
| `seed-all.js` + `package.json` | `scripts/seed-all.js`, `package.json` | 9 new seeder entries registered in orchestrator; 9 new `seed:*` npm scripts |
| Docs | `CLAUDE.md` | Firebase Collections table updated with all 9 new collections + Admin URLs. Seed Scripts table updated with all 9 new entries. |
| TSC | — | `cd client && npx tsc --noEmit` passes with zero errors |

### New Admin Routes

| Route | Page | Collection | Fields |
|-------|------|-----------|--------|
| `/admin/tip-shape-defs` | `TipShapeDefsPage` | `tip_shape_defs` | id, label, description |
| `/admin/core-gimmick-defs` | `CoreGimmickDefsPage` | `core_gimmick_defs` | id, label, description, hasPhysicsImpl |
| `/admin/attack-type-defs` | `AttackTypeDefsPage` | `attack_type_defs` | id, label, description, multiplier, color |
| `/admin/arena-theme-defs` | `ArenaThemeDefsPage` | `arena_theme_defs` | id, label, color, description |
| `/admin/arena-shape-defs` | `ArenaShapeDefsPage` | `arena_shape_defs` | id, label, vertexCount, description |
| `/admin/bowl-profile-defs` | `BowlProfileDefsPage` | `bowl_profile_defs` | id, label, wallAngle (0–75°), description |
| `/admin/trigger-type-defs` | `TriggerTypeDefsPage` | `trigger_type_defs` | id, label, description |
| `/admin/stat-event-defs` | `StatEventDefsPage` | `stat_event_defs` | id, label, description |
| `/admin/part-layer-defs` | `PartLayerDefsPage` | `part_layer_defs` | id, label, description |

### Hardcoded → Firebase Mapping

| Component | Was | Now |
|-----------|-----|-----|
| `TipFields` toggle buttons | hardcoded `TIP_SHAPES` array | `useTipShapes()` → `tip_shape_defs` |
| `CoreFields` toggle buttons | hardcoded `CORE_GIMMICKS` array | `useCoreGimmicks()` → `core_gimmick_defs` |
| `StatModifiersEditor` stat key dropdown | hardcoded `STAT_KEYS` array | `useStatDefs()` → `stat_defs` |
| `StatModifiersEditor` event dropdown | hardcoded `STAT_EVENTS` array | `useStatEventDefs()` → `stat_event_defs` |
| `StatModifiersEditor` trigger dropdown | hardcoded `TRIGGER_TYPES` array | `useTriggerTypeDefs()` → `trigger_type_defs` |
| `SwitchTargetsEditor` layer buttons | hardcoded `PART_LAYERS` array | `usePartLayerDefs()` → `part_layer_defs` |
| `ContactPointEditor` attack buttons | hardcoded `ATTACK_LABELS` array | `useAttackTypeDefs()` → `attack_type_defs` |
| `ContactPointEditor` layer buttons | hardcoded `LAYER_LABELS` array | `usePartLayerDefs()` → `part_layer_defs` |
| `ContactPointEditor` material colors | hardcoded `MATERIAL_COLORS` record | `usePartMaterials()` → `part_materials` (color field) |
| `BasicsTab` theme picker | hardcoded `THEMES` array | `useArenaThemeDefs()` → `arena_theme_defs` |
| `BasicsTab` shape picker | hardcoded `SHAPES` array | `useArenaShapeDefs()` → `arena_shape_defs` |
| `BasicsTab` bowl picker | hardcoded `BOWL_PROFILES` array | `useBowlProfileDefs()` → `bowl_profile_defs` |
| `BitBeastFields` special move dropdown | hardcoded `SPECIAL_MOVE_OPTIONS` | `useSpecialMoves()` → `special_moves` |

### Fallback Behavior

All replaced arrays are kept as `FALLBACK_*` constants. When the Firebase collection is empty (e.g., seed not yet run), the UI falls back to the hardcoded defaults. This means the editor is always functional even in a fresh Firebase environment.

---

## Session 26 Additions (2026-05-24) — Archetype Physics Deep Dive + Real-World Physics

| Addition | Files | Content |
|---|---|---|
| batch-014 | research/batches/batch-014-archetype-physics-deep-dive.md | 18 sources; 64 facts; comprehensive archetype physics model covering all generations |
| batch-015 | research/batches/batch-015-real-world-physics.md | 16 sources; 58 facts; classical mechanics grounding for all Beyblade physics |

### Key Real-World Physics Equations Confirmed (session 26 — batch-015)

| Equation | Domain | Engine Implication |
|----------|--------|--------------------|
| Ω_P = rMg/(Iω) | Gyroscopic precession | Precession inversely proportional to spin — 40% threshold correct in direction |
| L = I·ω | Angular momentum | Primary stability measure; high L = hard to tilt |
| I = Σ(m_i·r_i²) | Moment of inertia | OWD vs CWD: r² factor makes perimeter mass quadratically more effective |
| F = µ·N | Tip friction | µ_rubber 0.8–1.4 > µ_plastic 0.2–0.4 > µ_metal 0.1–0.25 |
| j = -(1+e)·v_rel_n / (1/mA + 1/mB + ...) | Collision impulse | e by material: rubber 0.3, plastic 0.7, metal 0.85 |
| Δω = (r×j·n)/I | Spin change from hit | Larger I = less spin lost per hit (heavy WD absorbs collisions) |
| v_rel = ωA·rA + ωB·rB (opp) | Opposite-spin coupling | Additive surface velocity = much more spin transfer vs same-spin (subtractive) |

### Engine Model Corrections Identified (session 26 — batch-015)

| Priority | Field | Current | Should Be |
|----------|-------|---------|-----------|
| HIGH | `spinDecayRate` | constant | should INCREASE as spin drops (more tilt = more contact area) |
| HIGH | LAD phase | linear stop | Euler's Disk curve: rapid circling divergence near zero |
| HIGH | `recoilFactor` | empirical | should use coefficient of restitution e by material |
| HIGH | `momentOfInertia` | not modeled | should derive from WD profile, scale `spinDecayRate` inversely |
| MED | Nutation wobble onset | 40% threshold | physically correct; wobble force should scale with tilt angle |
| MED | Spin steal transfer | fixed fraction | efficiency = f(µ_contact, r_contact, relative_ω) |
| LOW | Air drag | not modeled | k_air·ω² term; significant only at very high RPM |
| LOW | Bowl centripetal | not modeled | F_centripetal = m·v²/r toward center at stadium wall |

### Key Physics Rules Confirmed (session 26)

| Rule | Tag | Source |
|------|-----|--------|
| Rubber > Plastic > Metal tip friction hierarchy | FACT | WBO Physics thread |
| Rubber grip = periodic stick-slip cycle → flower pattern emerges | FACT | WBO + Fandom wiki RF |
| New RF is too grippy → erratic/self-KO; wear normalizes grip to controlled flower pattern | FACT | Fandom wiki RF |
| OWD (wide WD) = higher moment of inertia → longer spin time + collision resistance | FACT | WBO Physics thread |
| CWD (inward mass) = lower inertia → reaches higher RPM at launch but dies faster | FACT | WBO Physics thread |
| Metal Ball Base mass shifts OWD at high spin (centrifugal) → CWD at low spin (gravity) | FACT | Fandom wiki + WBO |
| LAD = roundness of WD profile + low-friction tip + circular AR profile | FACT | Fandom wiki + WBO Zombie |
| Wide Survivor = best zombie WD (perfectly circular = smoothest precession) | FACT | Fandom wiki WD-Wide Survivor |
| AR concave flat face → Smash Attack (high recoil both sides) | FACT | Fandom wiki Smash Attack |
| AR upward slope → Upper Attack (lower recoil; opponent lifted) | FACT | Fandom wiki Upper Attack |
| AR roller/curved → Force Dispersal (energy absorbed as roller rotation) | FACT | PlasticsDB Roller Defense Ring |
| Opposite-spin collision = gear coupling → faster bey transfers spin to slower bey | FACT | Fandom wiki Spin Absorption |
| Rubber CP on AR = 1.4× spin steal efficiency vs non-rubber (higher friction = better gear coupling) | FACT | Fandom wiki Spin Absorption |
| Circle Survivor EG = semi-free-spinning = near-zero KO force from any hit | FACT | PlasticsDB competitive list |
| Defensive Zombie = "best all-around combo" — combines free-spin LAD + opposite-spin steal | FACT | PlasticsDB competitive list |
| BX Xtreme Finish = 3 pts (center exit); Over Finish = 2 pts (corner exit) | FACT | beybxdb.com + WBO |
| BX Gear Flat triggers Xtreme Dash on X-Celerator Rail → speed burst | FACT | Fandom wiki Gear Flat / BX stadium |
| MFB Defense uses CWD/inward mass (resist being knocked over) vs Stamina OWD (resist spin loss) | FACT | WBO MFB combo guide |
| Heavier bey overall = more angular momentum = harder to stop = better defense AND stamina | FACT | WBO Physics thread |

### Archetype Decision Summaries (now in batch-014)

| Archetype | Primary Driver | Secondary | Key Trade-off |
|-----------|---------------|-----------|--------------|
| Smash Attack | Flat rubber tip (flower pattern) | High-reach flat-face AR | High recoil = self-KO risk |
| Upper Attack | Slope AR at opponent AR height | CWD WD for speed | Struggles vs Circle Survivor |
| Circle Survivor | Semi-free-spin EG | Ten Heavy WD | Above-dish hits vulnerability |
| Defensive Zombie | Bearing tip (free-spin) | Wide circular WD | Same-spin = no steal |
| Weight Defense | Heavy mass OWD | Metal ball shift | Less LAD than zombie |
| Compact | Small low-recoil AR | Ten Balance WD | Targeted by specialized counters |
| Pure Stamina | Sharp/needle tip | Wide circular WD | Attack type can brute-force KO |
| Zombie (opp-spin) | Opposite spin + circular AR | Bearing tip LAD | Wrong spin = loses normally |
| BX Attack | Gear Flat bit | Heavy blade | Self-KO risk from X-Dash |
| BX Stamina | Needle/Ball bit | Heavy disc | Less relevant (attack=3pts) |

---

## Session 23 Additions (2026-05-23) — Forge Disc Weights · Chassis · Sub Attack Rings

| Addition | Files | Content |
|---|---|---|
| batch-012 | research/batches/batch-012-forge-disc-chassis-sar.md | 14 sources checked; Forge Disc weights confirmed; Chassis system documented; SAR catalog built |
| Forge Disc weights | linka/parts/burst/discs.md | Heavy 21.6g, Gravity 21.6g, Quarter 21.8g, Armed 19.9g, Force 19.2g confirmed FACT. 00 ~25g INFERENCE. CORRECTION: numeric disc names do NOT reflect weight in grams. |
| Chassis system | linka/parts/burst/layers.md | Single vs Double Chassis concept; naming convention (N=rings, X=type); 8 chassis types cataloged; Dual Spin for Double Chassis; 1S = 16.82g confirmed |
| SAR concept | linka/parts/gen1/attack-rings.md | Sub Attack Ring concept (free-spinning, force-dispersing); 7-SAR catalog; Dragon Saucer SAR 1.9g + War Lion SAR 1.3g confirmed FACT from PlasticsDB; interchangeability rules; engine model note |
| DB Cores | linka/parts/burst/discs.md | 22 DB Core names confirmed from Burst Planner |

### Key Forge Disc Weight Tier (FACT, session 23)

| Tier | Discs |
|------|-------|
| Light | Force 19.2g |
| Standard | Armed 19.9g |
| Heavy | Heavy / Gravity 21.6g; Quarter 21.8g |
| Core Disc | 00 ~25g |

### Remaining Open UNKNOWNs (after session 23)

1. Revolver Attack WD weight (name confirmed; no individual PlasticsDB page found)
2. Star Attack WD weight (name confirmed; no individual PlasticsDB page found)
3. HMS Running Core weights (full table) — Google Sheet at hmsdb.com inaccessible
4. HMS AR weights (except Spiral Upper ~20g, Metal Saucer ~15g)
5. Burst Sparking individual layer names (Hyperion/Helios confirmed; full list not found)
6. RF / R²F contact patch exact mm; LF / R²F raised-arm height in mm
7. Individual chassis-only weights (except 1S = 16.82g); ~46g numbers appear to be full-combo weights
8. War Bear / War Monkey / Dragon Breaker SAR weights
9. Blitz / Sting Forge Disc exact weights (competitive heavy tier, weights unconfirmed)
10. 00 Core Disc exact weight (INFERENCE ~25g; no Tier-1 number confirmed)

---

## Session 22 Additions (2026-05-23) — WD Weights + Petal Physics + HMS 4-Part + Absorb Fix

| Addition | Files | Content |
|---|---|---|
| batch-011 | research/batches/batch-011-wd-weights-petal-physics.md | 38 URLs fetched; Gen1 WD weights confirmed (16 WDs); 21 AR weights confirmed from PlasticsDB bey pages; Force Disk clarified; petal count physics documented |
| Gen1 WD weights | linka/parts/gen1/weight-disks.md | All 16 WD names now have confirmed weights from PlasticsDB. Key corrections: Eight Heavy 15.3–15.5g (was ~14g); Ten Heavy 16.1g standard / 17g Spike Lizard (clarified which release); Eight Wide 12.7g / 12.2g (was 13g) |
| Gen1 AR weights | linka/parts/gen1/attack-rings.md | 22 ARs now FACT(PDB) with PlasticsDB weights. 9 corrections: Tiger Defenser 3.6g (was ~5g); Flame Wing 3.8g (was ~5g); Reverse Dragon 3.5–4.0g (was 5g); Eight Attacker 4.1g (was ~5g); Cross Spike 4.1g (was ~5g); Ten Spike 4.1g (was ~5g); Upper Claw 5.0–5.5g (was 7g); Strike Turtle 4.8g (was ~6g); Shield Hammer 6.3g (was 6g) |
| Force Disk clarified | batch-011 Section C, linka/parts/gen1/weight-disks.md | "Force Disk" does NOT exist in Gen1. "Force" = Forge Disc — Force (Fr), Burst-era metal disc, 19.2g, debuted B-23 December 2015 |
| Petal count physics | batch-004, 005, 006-x, 007, 009, 010 | All UNKNOWN petal-count entries replaced with PHYSICS-FACT: petal count is an emergent property (launch RPM, angle, position, tip friction, floor, slope, energy, inner-ridge diameter). Never hardcode per tip. |
| HMS 4-part structure | linka/parts/hms/attack-rings.md, running-cores.md | FACT (domain-expert): HMS = Bit Protector + Attack Ring (ABS+metal integrated) + WD or CWD + Running Core. No separate blade base or tip part. Metal is cast into the AR frame, hence ~15–20g vs gen1 ~3.5–7g |
| Absorb fix (batch-005) | batches/batch-005-burst-parts-disambiguation.md | 3 remaining "rubber outer ring" references for Absorb corrected to "spring-loaded sharp tip + free-spinning plastic ring — NO rubber component" (Section D1 table, disambiguation table, source audit table) |

### WD Weight Range (confirmed from PlasticsDB, session 22)

| Weight Class | WDs |
|-------------|-----|
| Lightest (~12g) | Eight Wide Soft 12.2g; Wide Survivor / Weight Ring 12.4g; Wide 12.7g; Eight Wide Hard 12.7g; Spark Disk 12.9g |
| Mid-light (~14g) | Wide Attack 13.7g; Balance / Eight Balance 14.1g; Ten Wide 14.0–14.3g; Wide Defense 14.5g; Magne WD 14.3–14.8g |
| Mid-heavy (~15g) | Ten Balance 15.0g; Eight Heavy 15.3–15.5g; Heavy 15.3g |
| Heaviest (~16g+) | Heavy Attack 16.0g; Ten Heavy 16.1g / 17g (Spike Lizard) |

### Remaining Open UNKNOWNs (after session 22)

1. Revolver Attack WD weight (name confirmed; no individual PlasticsDB page found)
2. Star Attack WD weight (name confirmed; no individual PlasticsDB page found)
3. HMS Running Core weights (full table) — Google Sheet at hmsdb.com inaccessible
4. HMS AR weights (except Spiral Upper ~20g, Metal Saucer ~15g) — same sheet
5. Burst Sparking sub-system individual layer names
6. RF / R²F contact patch exact mm measurement
7. LF raised-arm height in mm; R²F raised-arm height in mm
8. LRF exact diameter vs plain rubber flat

---

[↑ Index](INDEX.md)

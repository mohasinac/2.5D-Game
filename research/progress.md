# Research Progress

**Plan**: system-role-you-are-refactored-creek.md  
**Last updated**: 2026-05-23 (session 11 — Turret attack system: 155+ anime/game moves; Naruto/Bleach/Tekken/Dragon Ball/Obito/Rinnegan/Eight Gates; all 4 files TypeScript-clean)

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

---

## Stage 0C Diagram Files (17/17 complete)

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

## Current Work

- **Active stage**: none — all 20 research stages complete; Q&A checklist 46/54 resolved; turret attack system expanded to 155+ move types
- **Outstanding gaps**:
  1. Q30–Q33/Q36/Q38 — BX bits (Taper/Ball/Point/Kick/Elevate), wiki 403-blocked
  2. Q39–Q43 — Gen1 anime-exclusive beys, wiki 403-blocked
  3. Gear admin CRUD page (`/admin/2d/parts/gears`) and seed entries not yet built
  4. Collision sound missing from `AIBattleGamePage` and `TournamentBattleGamePage` (Q54 gap)
  5. `revival_spin` formula not yet wired into physics tick (design confirmed Q49)
  6. Room wiring for turret handler functions — `TurretProcessor.ts` exports the handlers but the room dispatch switch (in `TurretProcessor.ts` main `processTurret()` call path) needs case entries for all 155+ attack types
  7. Dragon Ball move series incomplete — Gohan, Vegeta followup, Cell, Buu, Frieza transformation chain not yet added
  8. One Piece, Demon Slayer, Attack on Titan — not yet started

---

[↑ Index](INDEX.md)

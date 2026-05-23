# Research Progress

**Plan**: system-role-you-are-refactored-creek.md  
**Last updated**: 2026-05-23 (session 19 — Source verification + parts expansion: 39 URLs fetched with visited flag; 14 linka/ cache files written; batch-008 complete)

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

## Current Work

- **Active stage**: none — all 20 research stages complete + Phase 21 unified foundation documented; Q&A checklist 54/54 resolved; turret attack system expanded to 179+ move types; source verification + parts expansion complete (session 19)
- **Outstanding gaps**:
  1. Gear admin CRUD page (`/admin/2d/parts/gears`) and seed entries not yet built
  2. Room wiring for turret handler functions — `TurretProcessor.ts` exports the handlers but the room dispatch switch needs case entries for all move types
  3. Dragon Ball move series incomplete — Gohan, Vegeta followup, Cell, Buu, Frieza transformation chain not yet added
  4. One Piece, Demon Slayer, Attack on Titan — not yet started
  5. Dashboard links to `/admin/mechanic-defs` and `/admin/gimmick-defs` not yet added
  6. Phase 21 implementation — `geometry_defs` and `stat_defs` collections + seed scripts + admin pages + form panels not yet built

---

[↑ Index](INDEX.md)

[↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 01: Terminology →](phase-01-terminology.md)

---

# Phase 00 — Engine Audit

> Synthesised from: batch-000 (admin audit) · batch-001 (schema catalog) · batch-002 (discovery table) · batch-003 (capability summary) · Stage-0C 17 diagrams.
> Admin UI: **ALL FORMS WILL BE REBUILT FROM SCRATCH** per user decision.

---

## What the Engine Can Do Right Now

### Physics

The server runs a synchronous 60Hz Matter.js loop. Beyblades are circles (`radius × 24 px`). Forces are applied from player/AI input via `computeForceMagnitude()` → `Matter.Body.applyForce()`. Collisions fire `Matter.Events 'collisionStart'` → `handleCollision()`, which applies a 5-material damage table, direction-dependent spin steal (same-dir ×0.5, counter ×1.5), and element-type multipliers from `ElementTypeLoader`.

The spin system is complete: `spin`, `spinDecayRate`, `maxSpin`, `spinDirection`, `spinStealFactor`. At < 40% stability, seeded PRNG wobble forces kick in. Counter-rotation sequencing (Dranzer GT) is implemented via `counterRotActive / counterRotStep / counterRotStepTick`.

> **PRNG consistency fix (session 25)**: `BattleRoom.ts` spawn pool selection was using `Math.random()` — an unseeded call that breaks deterministic replay. Fixed to `this.rand()` so all random choices go through the matchId-seeded `createPRNG` instance.

The 2.5D physics layer (`PartPhysics.ts`) extends the core with tip stats (`spinBias`, `bearingFriction`), material stats, and CP radial gating (±2mm). Two contact-point shapes coexist: legacy (angle/width/radius/thickness) and arc-segment (arcStart/arcEnd/rInner/rOuter). `resolveCpBounds()` normalises both.

### Combat

Special moves run a 5-phase state machine (idle → windup → executing → bleed → cooldown). Invulnerability is applied in the executing phase. Opponents can cancel a special during executing via QTE. `controlLockedUntilMs` blocks movement for the special's duration. **The new `SpecialMoveConfig` (steps[]) schema is defined in `shared/types/specialMove.ts` but rooms may still load the incompatible hardcoded `SpecialMoveDef` from `server/constants/specialMoves.ts` — this must be verified and resolved.**

Combos: `detectCombo()` uses a 3-key sliding window with per-combo cooldowns, power threshold checks, attached-combo check, and type restrictions. Six trigger-type combos run `detectTriggerCombos()` each tick. **Critical: `ComboDoc` in Firestore has no `effectId` field, so combos cannot reference their `ComboEffectDef` — all combos are effectively trigger-only stubs.**

### Arena

`ArenaFeatureProcessor.processArenaFeatures()` handles 14 feature types per tick. All of: loops, obstacles, pits, water, portals, turrets, bumps, floor hazards, switches, self-rotation — are fully wired. Gravity wells and spin zones use `executeBehavior()` which **only handles `movement.orbit`**. All other BehaviorRef behaviorIds (factor.*, transform.*, spawn.*, movement.circle/dash/retreat, arena.*) produce a console warning and no-op. This is the single largest runtime gap.

### AI

Three difficulty tiers (medium/hard/hell). Hell uses 10-tick prediction, ring-out awareness, and periodic combo emission. Legacy "easy" collapses to medium. All tiers are `computeInput()` pure functions.

### Multiplayer

Four room types. Series format BO1/3/5 via `SeriesManager`. Spectator support across all rooms. Tournament system with 30s scheduler poll, 3-min room cap, both-ready early-start, quit walkovers, and `tournamentPoints` leaderboard scoring.

---

## What is Broken or Missing

> **Audit update 2026-05-24** — verified against actual source files. Items marked ✅ FIXED have been confirmed resolved in code.

### CRITICAL — Verified Current Status

| # | Issue | Original Status | Current Status | Evidence |
|---|-------|----------------|----------------|----------|
| 1 | BehaviorRef dispatch gap | ~~CRITICAL~~ | ✅ **FIXED** | `ArenaFeatureProcessor.ts` lines 80–100: dispatches all prefixes (`movement.*`, `factor.*`, `transform.*`, `spawn.*`, `arena.*`) via `dispatchBehaviorRef()` to `MechanicRegistry` |
| 2 | `effectId` absent from `ComboDoc` | ~~CRITICAL~~ | 🔧 **PARTIAL** | Runtime: `ComboResult.effect` is a 6-value string union (works for current combos). Admin side: `effectId` picker referencing `combo_effects` collection still absent from combo editor. Not a runtime blocker. |
| 3 | Special move schema incompatibility | ~~CRITICAL~~ | ✅ **RESOLVED** | `src/constants/specialMoves.ts` does not exist in the codebase. Rooms load from Firestore `special_moves` using `SpecialMoveConfig` (steps[]) format. |

### HIGH — Verified Current Status

| # | Issue | Original Status | Current Status | Evidence |
|---|-------|----------------|----------------|----------|
| 4 | No step editor for Special Moves | HIGH | ❓ **Unknown** — verify admin special moves page has step editor | Needs manual check |
| 5 | No `ComboTask` editor for Combo Effects | HIGH | ❓ **Unknown** — verify combo-effects admin page | Needs manual check |
| 6 | Missing COLLECTIONS entries | ~~HIGH~~ | ✅ **FIXED** | `firebase.ts` lines 65–68: `MECHANIC_DEFS`, `GIMMICK_DEFS`, `GEOMETRY_DEFS`, `STAT_DEFS` all present. Note: `camera_profiles`, `audio_profiles` still absent. |

### MEDIUM — Verified Current Status

| # | Issue | Original Status | Current Status |
|---|-------|----------------|----------------|
| 7 | Trigger zone BehaviorRef gap | ~~MEDIUM~~ | ✅ **FIXED** (same fix as #1 — trigger zones use same `executeBehavior()`) |
| 8 | `roundModifier_defs` collection status | MEDIUM | ❓ Still unknown — verify runtime loads from `round_modifiers` Firestore |
| 9 | Arena links / BeyLinks partial | MEDIUM | ❓ Likely still partial — physics implementation needs verification |

### LOW — Verified Current Status

| # | Issue | Original Status | Current Status |
|---|-------|----------------|----------------|
| 10 | Gamepad input | LOW | ❌ **Still missing** — `useGameInput.ts` has no gamepad event reader (Phase 24 covers this) |
| 11 | Admin pages for gimmicks, mechanics | ~~LOW~~ | ✅ **FIXED** — `MechanicDefsPage.tsx`, `GimmickDefsPage.tsx`, `GeometryDefsPage.tsx`, `StatDefsPage.tsx` all exist |
| — | `camera_profiles`, `audio_profiles` in COLLECTIONS | NEW | ❌ **Still missing** — these two were not in the original P0.4 list but still absent from firebase.ts |

---

## Data Model Completeness

| Collection | Schema Defined | Admin UI | Seeder | Engine Loaded | Status |
|-----------|---------------|---------|--------|--------------|--------|
| `beyblade_stats` | ✅ | rebuild | ✅ | ✅ | Complete |
| `arenas` | ✅ | rebuild | ✅ | ✅ | Complete |
| `special_moves` | ✅ new schema | rebuild (step editor) | ✅ | ⚠️ schema mismatch | Broken |
| `combos` | ✅ (missing effectId) | rebuild | ✅ | ⚠️ effectId missing | Broken |
| `combo_effects` | ✅ | rebuild (task editor) | — | ⚠️ dispatch gap | Broken |
| `beyblade_parts` | ✅ | rebuild | ✅ | ✅ 2.5D | Complete |
| `beyblade_systems` | ✅ | rebuild | ✅ | ✅ | Complete |
| `arena_systems` | ✅ | rebuild | ✅ | ✅ | Complete |
| `element_types` | ✅ | rebuild | — | ✅ | Complete |
| `behavior_defs` | ✅ | rebuild | — | ⚠️ dispatch gap | Broken |
| `round_modifiers` | ✅ | rebuild | — | ❓ unknown | Unknown |
| `mechanic_defs` | ✅ in COLLECTIONS | ✅ MechanicDefsPage | ✅ seed:mechanics | ✅ MechanicRegistry | Complete |
| `gimmick_defs` | ✅ in COLLECTIONS | ✅ GimmickDefsPage | ✅ seed:gimmicks | ✅ gimmickExpander | Complete |
| `geometry_defs` | ✅ in COLLECTIONS | ✅ GeometryDefsPage | — | ❓ partial | Partial |
| `stat_defs` | ✅ in COLLECTIONS | ✅ StatDefsPage | — | ❓ partial | Partial |
| `camera_profiles` | ❌ not in COLLECTIONS | not built | — | ❌ | Missing |
| `audio_profiles` | ❌ not in COLLECTIONS | not built | — | ❌ | Missing |
| `animation_presets` | ✅ | rebuild | — | ❓ | Unknown |
| `tournaments` | ✅ | rebuild | ✅ | ✅ | Complete |
| `tournament_participants` | ✅ | rebuild | ✅ | ✅ | Complete |
| `tournament_brackets` | ✅ | rebuild | ✅ | ✅ | Complete |
| `ai_battles` | ✅ | rebuild | ✅ | ✅ | Complete |
| `player_stats` | ✅ | rebuild (read-only) | — | ✅ | Complete |
| `matches` | ✅ | rebuild (read-only) | — | ✅ | Complete |

---

## Stat System

360-point distribution across attack / defense / stamina (max 150 each).

| Stat | Formula | Effect |
|------|---------|--------|
| `attack` | `damageMultiplier = 1.0 + attack × 0.007` | 1.0×–2.05× |
| `defense` | `damageReduction = 1 − defense × 0.003` | 0–55% reduction |
| `stamina` | `spinDecayRate = 8 × (1 − stamina × 0.001)` | 8–6.8/tick |
| `stamina` | `maxSpin = ceil(2000 × (1 + stamina × 0.0008))` | 2000–2240 |
| `stamina` | `spinStealFactor = 0.1 × (1 + stamina × 0.02667)` | 0.1–0.5 |

StatDelta supports 29 numeric keys for in-match stat modification (combo effects, special moves, round modifiers).

---

## Physics Coordinate System

| Unit | Value |
|------|-------|
| 1 cm | 24 px |
| 1 em | 16 px |
| Arena radius | `min(w, h) × 0.45` px |
| Beyblade radius | `stats.radius × 24` px |
| Standard arena | 1080×1080 px stored |

---

## Priority Fix Order for Implementation Stages

1. Add `effectId` to `combos` schema + admin combo editor (Stage 4)
2. Wire `SpecialMoveConfig` pipeline end-to-end, remove/alias hardcoded `SpecialMoveDef` (Stage 2)
3. Implement full `executeBehavior()` dispatch for all BehaviorRef types (Stage 6 / mechanic dispatch)
4. Add `mechanic_defs`, `gimmick_defs`, `camera_profiles`, `audio_profiles` to COLLECTIONS (Stage 11)
5. Build `SpecialMoveStep[]` admin editor (Stage 2 admin UI)
6. Build `ComboTask[]` admin editor (Stage 4 admin UI)
7. Verify and complete `round_modifiers` Firestore loading path (Stage 14)
8. Complete arena link / BeyLink physics (Stage 10)

---

## Diagrams Index

All 17 Stage-0C diagrams are in `research/diagrams/`:

| File | Covers |
|------|--------|
| diagram-engine-capabilities.md | Full engine feature map |
| diagram-mechanics.md | Mechanic → Combo → Gimmick → SpecialMove → Part → Beyblade |
| diagram-data-flow.md | DB → Validation → Compiler → Runtime (Rule 7) |
| diagram-simulation-arch.md | 2D/2.5D adapter architecture (Rule 2) |
| diagram-presentation-flow.md | 9-layer presentation model (Rule 6) |
| diagram-sequence-launch.md | Input → collision → state update sequence |
| diagram-mode-flow.md | Mode trigger → config → stat changes |
| diagram-arena-interaction.md | ArenaConfig → hazards → beyblade effects |
| diagram-extraction-pipeline.md | Image → geometry → engine mapping (Rule 8) |
| diagram-tool-ecosystem.md | Admin → DB → Compiler → Runtime (Rule 9) |
| diagram-input-abstraction.md | Input devices → bitmask → intent (Rule 10) |
| diagram-rotation-systems.md | Spin → wobble → counter-rotation → camera (Rule 11) |
| diagram-camera-flow.md | GameplayEvent → CameraIntent → FinalCamera (Rule 12) |
| diagram-deterministic-flow.md | Input → FixedTick → Deterministic Simulation (Rule 13) |
| diagram-research-flow.md | Research → Tagged Facts → Implementation (Rule 14) |
| diagram-script-authoring-flow.md | Admin editor → Compiler → RuntimePackage (Rule 15) |
| diagram-script-execution.md | CoreSimulation → CompositionBlocks → Renderer (Rule 15) |

---

[↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 01: Terminology →](phase-01-terminology.md)

# Phase 16 — Gap Analysis

> Stage 16 | Source: all Stages 0A–14 research outputs
> Purpose: Consolidate every gap found across 14 stages into a single prioritized table.
> [P5-PENDING]: Gaps that may expand after Stage 5 (Parts) completes.
> [GEN1-PENDING]: Gaps that may expand after Stage 7 Gen1 completes.

---

## 1. Priority Legend

| Priority | Label | Meaning |
|---|---|---|
| P0 | BLOCKER | Code will not compile or engine crashes without this fix |
| P1 | CRITICAL | Core feature silently broken; data is lost or wrong at runtime |
| P2 | HIGH | Feature gap causes incorrect behavior observable in gameplay |
| P3 | MEDIUM | Missing feature reduces content; does not break existing flows |
| P4 | LOW | Enhancement; functional but suboptimal without it |
| P5 | COSMETIC | Visual/UX gap; no gameplay impact |

---

## 2. Schema Gaps (TypeScript types + Colyseus schema)

### 2A. Colyseus Schema Classes — Missing or Incomplete

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| SCH-01 | `server/shared/schema/GameState.ts` | `MechanicInstance` class not defined. `Beyblade.mechanics: ArraySchema<MechanicInstance>` therefore missing. Without this, gimmick/mechanic state cannot be synced to clients. | MECHANIC_REGISTRY cannot be used; all gimmick effects are invisible to client | P0 | Stage 11 |
| SCH-02 | `server/shared/schema/GameState.ts` | `Beyblade` missing fields: `gearCompatibleBit: boolean`, `xtremeEngaged: boolean`, `xtremeRailProgress: float32`, `xtremeRailId: string`, `egBoostOmega: float32`, `burstPressure: float32` | Xtreme Dash, Engine Gear, and burst mechanics cannot track state | P1 | Stage 11 |
| SCH-03 | `server/shared/schema/GameState.ts` | `ArenaState` missing fields: `scoringMode: string`, `pointsTarget: uint8`, `hasZeroG: boolean` | BX scoring and Zero-G arena cannot be configured per-room | P2 | Stage 11 |
| SCH-04 | `server/shared/schema/GameState.ts` | `GameState` missing: `playerPoints: MapSchema<uint8>` | BX point scoring has no schema storage; points lost between ticks | P1 | Stage 11 |

### 2B. ArenaConfig TypeScript Interface — Missing Fields

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| TYPES-01 | `shared/types/arenaConfigNew.ts` | `ArenaShape` missing `"rectangle"`. Infinity Stadium and Robert's Castle cannot be typed. | Two arena IDs fail TypeScript compilation | P0 | Stage 10 |
| TYPES-02 | `shared/types/arenaConfigNew.ts` | `PitType` missing `"penalty_well"`, `"xtreme_zone"`, `"over_zone"`, `"spike_pit"` | Gen1 pockets have no typed kind; BX scoring zones untyped; spike pits untyped | P1 | Stage 10 |
| TYPES-03 | `shared/types/arenaConfigNew.ts` | `GearRailConfig` interface does not exist | Xtreme Stadium gear rail cannot be configured | P1 | Stage 10 |
| TYPES-04 | `shared/types/arenaConfigNew.ts` | `ScoringZoneConfig` interface does not exist | BX point-differential exits cannot be seeded | P1 | Stage 10 |
| TYPES-05 | `shared/types/arenaConfigNew.ts` | `TornadoRidgeConfig` interface does not exist | Tornado stall terrain has no dedicated schema; currently overloaded on `elevationZones[]` with no orbit force fields | P2 | Stage 10 |
| TYPES-06 | `shared/types/arenaConfigNew.ts` | `ZeroGConfig` interface does not exist | Zero-G dynamic tilt stadium cannot be configured | P3 | Stage 10 |
| TYPES-07 | `shared/types/arenaConfigNew.ts` | `ArenaConfig` missing top-level fields: `gearRails?`, `scoringZones?`, `tornadoRidge?`, `zeroG?`, `staminaDrainMultiplier?` | Cannot add new arena data without type errors | P1 | Stage 10 |

### 2C. Shared TypeScript Types — Missing Collections

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| COLL-01 | `client/src/lib/firebase.ts` | `COLLECTIONS.MECHANIC_DEFS` constant missing | mechanic_defs Firestore collection unreachable by name constant | P1 | Stage 11 |
| COLL-02 | `client/src/lib/firebase.ts` | `COLLECTIONS.GIMMICK_DEFS` constant missing | gimmick_defs Firestore collection unreachable | P1 | Stage 11 |
| COLL-03 | `client/src/lib/firebase.ts` | `COLLECTIONS.CAMERA_PROFILES` constant missing | camera_profiles Firestore collection unreachable | P3 | Stage 13 |
| COLL-04 | `client/src/lib/firebase.ts` | `COLLECTIONS.AUDIO_PROFILES` constant missing | audio_profiles Firestore collection unreachable | P3 | Stage 13 |
| COLL-05 | `client/src/lib/firebase.ts` | `COLLECTIONS.SCRIPT_DEFINITIONS` constant missing | script_definitions collection unreachable | P2 | Stage 11 |
| COLL-06 | `client/src/lib/firebase.ts` | `COLLECTIONS.COMPOSITION_BLOCKS` constant missing | composition_blocks collection unreachable | P2 | Stage 11 |

---

## 3. Server Runtime Gaps

### 3A. MechanicRegistry — Does Not Exist

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| MECH-01 | `src/physics/MechanicRegistry.ts` | File does not exist. The MECHANIC_REGISTRY map (mechanic ID → handler) has never been created. | All 31 mechanics are unimplemented at runtime | P0 | Stage 6 + 11 |
| MECH-02 | `src/physics/mechanics/` | Directory does not exist. The 31 per-mechanic handler files are absent. | Zero mechanics execute | P0 | Stage 11 |
| MECH-03 | `src/utils/gimmickExpander.ts` | File does not exist. `gimmickIds[]` → `MechanicInstance[]` expansion never happens. | All gimmickIds on BeybladeStats are silently ignored at room creation | P0 | Stage 8 + 11 |
| MECH-04 | `src/rooms/PartSystemManager.ts` | `expandGimmicks()` is not called in `onCreate()` for any room type | Even if MechanicRegistry existed, gimmicks never activate | P0 | Stage 11 |

### 3B. BehaviorRef Dispatch Gap — CRITICAL EXISTING BUG

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| BREF-01 | `server/shared/rooms/ArenaFeatureProcessor.ts` → `executeBehavior()` | Only `movement.orbit` is dispatched. All other BehaviorRef types (`factor.*`, `transform.*`, `spawn.*`, `movement.circle`, `movement.dash`, `movement.freeze`, `movement.jump`, `arena.*`) are silently dropped. | Every combo, special move, and gimmick that uses any non-orbit BehaviorRef silently fails. This is the single largest runtime bug in the engine. | P0 | Stage 0D + 4 + 11 |
| BREF-02 | `server/shared/rooms/ArenaFeatureProcessor.ts` | `executeBehavior()` does not call `MechanicRegistry.dispatchBehaviorRef()` — the new registry dispatcher that routes all 36 BehaviorRef types. | Even after SCH-01 is fixed, BehaviorRefs still won't work without this routing fix. | P0 | Stage 11 |

### 3C. ArenaFeatureProcessor — Missing Dispatch Handlers

| Gap ID | Handler Needed | Gap Description | Priority | Stage Found |
|--------|---------------|-----------------|----------|-------------|
| AFEP-01 | `processGearRails(dt)` | No handler for GearRailConfig. Xtreme Dash gear rail boost never fires. | P1 | Stage 10 |
| AFEP-02 | `processScoringZones(dt)` | No handler for ScoringZoneConfig. BX point-differential exits are not counted. | P1 | Stage 10 |
| AFEP-03 | `processTornadoRidge(dt)` | No handler for TornadoRidgeConfig. Tornado Stall orbit force and spin boost never apply. | P2 | Stage 10 |
| AFEP-04 | `processTiltMechanic(dt)` | No handler for ZeroGConfig dynamic tilt. Zero-G stadium bowl direction never shifts. | P3 | Stage 10 |
| AFEP-05 | `processTriggerZones(dt)` | CRITICAL EXISTING GAP: TriggerZoneConfig exists in the ArenaConfig type and can be seeded, but is NEVER dispatched. All 7 TriggerZone kinds (damage, heal, KO, spin-boost, expel, speed-scale, safe) silently do nothing at runtime. | P0 | Stage 9 |
| AFEP-06 | `spike_pit_ko` | PitConfig with type `"spike_pit"` enters the standard escape-chance calculation; should instead immediately set `isRingOut = true` with no escape roll. | P2 | Stage 9 |

---

## 4. Data Layer Gaps (Firestore Collections)

### 4A. Missing Collections / Docs

| Gap ID | Collection | Gap Description | Priority | Stage Found |
|--------|-----------|-----------------|----------|-------------|
| DATA-01 | `mechanic_defs` | Collection does not exist in Firestore. 31 MechanicDef documents need to be seeded. | P1 | Stage 8 |
| DATA-02 | `gimmick_defs` | Collection does not exist in Firestore. 22 GimmickDef documents need to be seeded. | P1 | Stage 8 |
| DATA-03 | `combos` | All 8 combo documents exist but are missing the `effectId` field. Combos cannot reference their `ComboEffectDef`. | P1 | Stage 4 |
| DATA-04 | `beyblade_stats` | All beyblade documents have no `gimmickIds[]` field set. The field defaults to `undefined`/empty on every bey. | P1 | Stage 3 + 12 |
| DATA-05 | `beyblade_stats` | `specialMoveId` field is populated for ~20 Tier 1 beys (Stage 3 mapping), but the actual `special_moves` collection may have mismatched IDs between legacy hardcoded SpecialMoveDef and the new SpecialMoveConfig schema. | P2 | Stage 2 + 3 |
| DATA-06 | `arenas` | No arenas are seeded with the new `gearRails`, `scoringZones`, `tornadoRidge`, `zeroG` fields. | P2 | Stage 10 |
| DATA-07 | `camera_profiles` | Collection does not exist. No camera behavior profiles are seeded. | P3 | Stage 13 |
| DATA-08 | `audio_profiles` | Collection does not exist. No audio profiles are seeded. | P3 | Stage 13 |

### 4B. SpecialMove Schema Incompatibility

| Gap ID | Gap Description | Priority | Stage Found |
|--------|-----------------|----------|-------------|
| SM-01 | `src/constants/specialMoves.ts` defines `SpecialMoveDef` (hardcoded, no Firestore). New `shared/types/specialMove.ts` defines `SpecialMoveConfig` (steps[] Firestore model). These two schemas are incompatible — different field names, different execution model. Must migrate all 5 hardcoded entries to Firestore and delete the hardcoded file. | P1 | Stage 2 + 11 |
| SM-02 | `GameRoom.ts` (all room types) loads `SpecialMoveDef` from the hardcoded constant, not from Firestore. Firestore special moves are never loaded. | P1 | Stage 2 |
| SM-03 | `Beyblade.specialMoveId` schema field exists but the server-side `SpecialMoveDef` lookup uses the ID as a key into the hardcoded map, not Firestore. New `special_moves` Firestore docs are never read. | P1 | Stage 3 |

---

## 5. Control / Input Gaps

| Gap ID | File | Gap Description | Priority | Stage Found |
|--------|------|-----------------|----------|-------------|
| INP-01 | All 4 room types | Special move handling code is copy-pasted in each room (BattleRoom, AIBattleRoom, TournamentBattleRoom, TryoutRoom). Should be extracted to `InputHandler` shared class. | P4 | Stage 13 |
| INP-02 | All 4 room types | Combo detection code (`detectCombo`) is duplicated per room. | P4 | Stage 13 |
| INP-03 | `client/src/game/hooks/useGameInput.ts` | Intent layer partially extracted to shared `InputHandler` for movement but special/combo triggers are room-specific copy-paste. Client side does not have a clean "intent → bitmask" separation for new intent types. | P3 | Stage 13 |

---

## 6. Camera / Presentation Gaps

| Gap ID | Gap Description | Priority | Stage Found |
|--------|-----------------|----------|-------------|
| CAM-01 | `beyTiltAngle` is in Beyblade schema but never sent as a dedicated sync packet — clients infer tilt from spin ratio only. True gyroscopic tilt from physics is not propagated. | P3 | Stage 13 |
| CAM-02 | Camera profile system (`camera_profiles` collection) is architecturally designed but no camera_profiles docs exist and the client never reads them. All camera behavior is hardcoded in `PixiRenderer.ts`. | P3 | Stage 13 |
| CAM-03 | `spectatorFollowTargets` map in all rooms is informational only — the client computes follow independently. No server-side validation that the followed `beybladeId` still exists. | P4 | Stage 13 |

---

## 7. Game Mode Gaps

| Gap ID | Gap Description | Priority | Stage Found |
|--------|-----------------|----------|-------------|
| MODE-01 | Round modifiers (`defaultModifiers`, `randomModifiers` fields on ArenaConfig) are defined in the schema but `BattleRoom` is the only room that reads them. `AIBattleRoom` and `TournamentBattleRoom` always use an empty modifier set. | P2 | Stage 14 |
| MODE-02 | Points Battle win condition (`scoringMode: "points"`, `pointsTarget: uint8`) is in ArenaState schema (Stage 11 addition) but no room reads or enforces it. BX-style point scoring is always ignored. | P2 | Stage 14 |
| MODE-03 | 9 game modes identified in Stage 14 (Team Battle, Ranked, Quick Match, Challenge, Points Battle, Battle Royale, Gauntlet, Capture the Zone, Domination) are entirely absent from the room type list. Only 5 room types exist. | P3 | Stage 14 |
| MODE-04 | Battle Royale (8-bey format, 12-pocket stadium) has no room type. `BattleRoom` max is 4 players. | P3 | Stage 14 |

---

## 8. Seeding Gaps

| Gap ID | Description | Priority | Stage Found |
|--------|-------------|----------|-------------|
| SEED-01 | `npm run seed:gimmicks` script does not exist. gimmick_defs collection is empty. | P1 | Stage 8 + 12 |
| SEED-02 | `npm run seed:mechanics` script does not exist. mechanic_defs collection is empty. | P1 | Stage 8 + 12 |
| SEED-03 | `npm run seed:beyblades` script exists but does not write `gimmickIds[]` per bey (field is absent from all seeded BeybladeStats docs). | P1 | Stage 12 |
| SEED-04 | `npm run seed:arenas` script does not write the new fields: `gearRails`, `scoringZones`, `tornadoRidge`, `zeroG`, `penalty_well`/`xtreme_zone`/`over_zone`/`spike_pit` pit types. | P1 | Stage 10 + 12 |
| SEED-05 | `npm run seed:combos` writes combos without `effectId` field. All 8 combo docs are incomplete. | P1 | Stage 4 + 12 |
| SEED-06 | `npm run seed:special-moves` seeds from the legacy hardcoded `SpecialMoveDef` format, not the new `SpecialMoveConfig` (steps[]) format. The collection is populated with incompatible schema. | P1 | Stage 2 + 12 |
| SEED-07 | `npm run seed:beyblades` covers only ~20 beys from a legacy flat list. The full 334-bey plan from Stage 12 is not implemented. | P3 | Stage 12 |
| SEED-08 | `npm run seed:arenas` covers only a partial list of arenas. 14 P1–P3 arenas from Stage 10 are not seeded. | P2 | Stage 10 + 12 |

---

## 9. Part System Gaps (confirmed by Stage 5)

> Preliminary P5-PENDING estimates replaced with confirmed findings from Stage 5 research. Source: `phase-05-parts.md`.

| Gap ID | File | Gap Description | Impact | Priority | Stage Found |
|--------|------|-----------------|--------|----------|-------------|
| PART-01 | `server/physics/PhysicsEngine.ts` | `ARPart.contactPoints[]` (the 2.5D `SystemContactPoint` format) is never bridged to the physics engine. `PhysicsEngine` holds a `Map<string, BeybladeStats>` using the old `PointOfContact` type. 2.5D part CPs have **zero** effect on actual collision damage or force. The `getContactPointMultiplier()` call path only reads the legacy PoC format. | All 2.5D part geometry (recoilFactor, smashEfficiency, upperAttackBonus, material bands) is invisible to physics at runtime | P2 | Stage 5 |
| PART-02 | `server/physics/PhysicsEngine.ts` | `getContactPointMultiplier()` only reads legacy CP fields (`angle`, `width`). Arc-segment CP fields (`arcStart`, `arcEnd`, `lineThickness`, `radiusInner`, `radiusOuter`, `setId`) are implemented in the renderer (`renderRadius()`) but the physics engine's `checkRadialContactMatch()` ignores them. Arc-segment collision precision is renderer-only, not physics. | Arc-segment CP geometry produces visually correct rendering but wrong collision angles/zones at runtime | P3 | Stage 5 |
| PART-03c | `server/physics/PartPhysics.ts` | `spawnDetachedBody()` creates a `DetachedBodySchema` entry in `state.detachedBodies` but **never creates a corresponding Matter.js rigid body**. Detached mini-beys, projectiles, and fragments have no physical presence — they can't collide with anything. | `sub_part_burst` mechanic and any gimmick that detaches a sub-part produces a schema ghost with no physics | P2 | Stage 5 |

---

## 10. Gen1 Bey Seeding Gaps [GEN1-PENDING]

> The following gaps will be confirmed once Stage 7 Gen1 output is available.

| Gap ID | Description | Priority | Stage Found |
|--------|-------------|----------|-------------|
| GEN1-01 | ~91 Gen1 plastic beys not seeded with gimmickIds[]. Stage 7 Gen1 will provide the mapping. | P2 | Stage 7 |
| GEN1-02 | ~29 HMS beys not seeded with gimmickIds[]. All HMS beys need `dual_spin` in gimmickIds at minimum. | P2 | Stage 7 |
| GEN1-03 | Magnacore system beys (Seaborg, Wyborg, etc.) not seeded with `magnacore_pull` gimmick + correct stat allocations. | P2 | Stage 7 |

---

## 11. Master Gap Priority Table

Sorted by priority: P0 first, then P1, P2, P3, P4.

| # | Gap ID | Short Description | Priority | Blocked By | Fix In |
|---|--------|------------------|----------|-----------|--------|
| 1 | BREF-01 | BehaviorRef dispatch gap — only movement.orbit handled | P0 | — | Stage 20 |
| 2 | MECH-01 | MechanicRegistry.ts does not exist | P0 | — | Stage 20 |
| 3 | MECH-02 | src/physics/mechanics/ directory absent | P0 | MECH-01 | Stage 20 |
| 4 | MECH-03 | gimmickExpander.ts does not exist | P0 | MECH-01 | Stage 20 |
| 5 | SCH-01 | MechanicInstance Colyseus class missing | P0 | — | Stage 20 |
| 6 | AFEP-05 | TriggerZoneConfig never dispatched (all 7 kinds) | P0 | — | Stage 20 |
| 7 | BREF-02 | executeBehavior() doesn't call MechanicRegistry.dispatchBehaviorRef() | P0 | MECH-01 | Stage 20 |
| 8 | MECH-04 | expandGimmicks() never called in onCreate() | P0 | MECH-03 | Stage 20 |
| 9 | TYPES-01 | ArenaShape missing "rectangle" | P0 | — | Stage 20 |
| 10 | SCH-02 | Beyblade schema missing 6 new fields | P1 | SCH-01 | Stage 20 |
| 11 | SCH-04 | GameState.playerPoints MapSchema missing | P1 | — | Stage 20 |
| 12 | TYPES-02 | PitType missing 4 new kinds | P1 | — | Stage 20 |
| 13 | TYPES-03 | GearRailConfig interface missing | P1 | — | Stage 20 |
| 14 | TYPES-04 | ScoringZoneConfig interface missing | P1 | — | Stage 20 |
| 15 | TYPES-07 | ArenaConfig missing 5 new top-level fields | P1 | TYPES-03+04 | Stage 20 |
| 16 | COLL-01 | COLLECTIONS.MECHANIC_DEFS missing | P1 | — | Stage 20 |
| 17 | COLL-02 | COLLECTIONS.GIMMICK_DEFS missing | P1 | — | Stage 20 |
| 18 | DATA-01 | mechanic_defs collection empty | P1 | SEED-02 | Stage 20 |
| 19 | DATA-02 | gimmick_defs collection empty | P1 | SEED-01 | Stage 20 |
| 20 | DATA-03 | combos missing effectId field | P1 | SEED-05 | Stage 20 |
| 21 | DATA-04 | beyblade_stats.gimmickIds[] never set | P1 | SEED-03 | Stage 20 |
| 22 | SM-01 | SpecialMoveDef vs SpecialMoveConfig incompatibility | P1 | — | Stage 20 |
| 23 | SM-02 | GameRoom loads hardcoded SpecialMoveDef, not Firestore | P1 | SM-01 | Stage 20 |
| 24 | SM-03 | Beyblade.specialMoveId lookup uses hardcoded map | P1 | SM-01 | Stage 20 |
| 25 | SEED-01 | seed:gimmicks script does not exist | P1 | DATA-02 | Stage 20 |
| 26 | SEED-02 | seed:mechanics script does not exist | P1 | DATA-01 | Stage 20 |
| 27 | SEED-03 | seed:beyblades does not write gimmickIds[] | P1 | SEED-01 | Stage 20 |
| 28 | SEED-04 | seed:arenas missing new fields | P1 | TYPES-03+04 | Stage 20 |
| 29 | SEED-05 | seed:combos omits effectId | P1 | DATA-03 | Stage 20 |
| 30 | SEED-06 | seed:special-moves uses wrong schema | P1 | SM-01 | Stage 20 |
| 31 | AFEP-01 | processGearRails handler missing | P1 | TYPES-03 | Stage 20 |
| 32 | AFEP-02 | processScoringZones handler missing | P1 | TYPES-04 | Stage 20 |
| 33 | DATA-05 | specialMoveId / special_moves schema mismatch | P2 | SM-01 | Stage 20 |
| 34 | DATA-06 | arenas not seeded with new fields | P2 | SEED-04 | Stage 20 |
| 35 | SCH-03 | ArenaState missing scoringMode/pointsTarget/hasZeroG | P2 | — | Stage 20 |
| 36 | TYPES-05 | TornadoRidgeConfig missing | P2 | — | Stage 20 |
| 37 | COLL-05 | COLLECTIONS.SCRIPT_DEFINITIONS missing | P2 | — | Stage 20 |
| 38 | COLL-06 | COLLECTIONS.COMPOSITION_BLOCKS missing | P2 | — | Stage 20 |
| 39 | AFEP-03 | processTornadoRidge handler missing | P2 | TYPES-05 | Stage 20 |
| 40 | AFEP-06 | spike_pit_ko — spike pits use escape-chance roll | P2 | TYPES-02 | Stage 20 |
| 41 | MODE-01 | Round modifiers only active in BattleRoom | P2 | — | Stage 20 |
| 42 | MODE-02 | Points Battle win condition never enforced | P2 | SCH-03 | Stage 20 |
| 43 | SEED-07 | Only ~20 beys seeded (334 planned) | P2 | SEED-03 | Stage 20 |
| 44 | SEED-08 | Only partial arena list seeded | P2 | SEED-04 | Stage 20 |
| 45 | GEN1-01 | 91 Gen1 plastic beys missing gimmickIds[] | P2 | GEN1-PENDING | Stage 20 |
| 46 | GEN1-02 | 29 HMS beys missing gimmickIds[] | P2 | GEN1-PENDING | Stage 20 |
| 47 | GEN1-03 | Magnacore beys not seeded with magnacore_pull | P2 | GEN1-PENDING | Stage 20 |
| 48 | TYPES-06 | ZeroGConfig missing | P3 | — | Stage 20 |
| 49 | COLL-03 | COLLECTIONS.CAMERA_PROFILES missing | P3 | — | Stage 20 |
| 50 | COLL-04 | COLLECTIONS.AUDIO_PROFILES missing | P3 | — | Stage 20 |
| 51 | DATA-07 | camera_profiles collection empty | P3 | COLL-03 | Stage 20 |
| 52 | DATA-08 | audio_profiles collection empty | P3 | COLL-04 | Stage 20 |
| 53 | AFEP-04 | processTiltMechanic handler missing | P3 | TYPES-06 | Stage 20 |
| 54 | MODE-03 | 9 planned game modes absent | P3 | — | Future |
| 55 | MODE-04 | Battle Royale no room type | P3 | — | Future |
| 56 | CAM-01 | beyTiltAngle not propagated as dedicated sync | P3 | — | Stage 20 |
| 57 | CAM-02 | camera_profiles system never read by client | P3 | DATA-07 | Stage 20 |
| 58 | INP-03 | Client intent layer partially duplicated | P3 | — | Stage 20 |
| 59 | PART-01 | ARPart.contactPoints[] never bridged to PhysicsEngine (2.5D CPs have zero physics effect) | P2 | PART-01 | Stage 20 Block N |
| 60 | PART-02 | Arc-segment CP fields ignored by getContactPointMultiplier() — renderer-only | P3 | PART-02 | Stage 20 Block N |
| 61 | PART-03c | spawnDetachedBody() creates schema ghost but never creates Matter.js rigid body | P2 | PART-03c | Stage 20 Block N |
| 62 | INP-01 | Special move code copy-pasted across 4 rooms | P4 | — | Stage 20 |
| 63 | INP-02 | Combo detection code duplicated per room | P4 | — | Stage 20 |
| 64 | CAM-03 | spectatorFollowTargets has no server-side validation | P4 | — | Future |

---

## 12. Summary Counts

| Priority | Count |
|---|---|
| P0 (BLOCKER) | 9 |
| P1 (CRITICAL) | 22 |
| P2 (HIGH) | 13 |
| P3 (MEDIUM) | 10 |
| P4 (LOW) | 3 |
| P5/PENDING | 3 |
| **Total** | **60** |

**Most important cluster**: P0 gaps 1–8 form a dependency chain: MechanicRegistry → gimmickExpander → MechanicInstance schema → BehaviorRef dispatch. Fixing these 8 in order unblocks the entire mechanic/gimmick system.

**Second cluster**: P1 schema + seed gaps (items 10–30) must be fixed together since seeds depend on TypeScript types being valid first.

Source files: Stages 0D, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14

---
[← Phase 14: Game Modes](phase-14-game-modes.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Phase 19: Implementation Plan →](phase-19-impl-plan.md)

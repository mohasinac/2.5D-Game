# Research Folder — Master Summary

> **Last updated**: 2026-05-24 (Session 29)
> **Purpose**: Single-file fact-checked reference covering all 68 research documents. Read this before starting any new session.

---

## 1. Project Scope

- **Type**: Server-authoritative 2D + 2.5D physics Beyblade battle simulator
- **Engine stack**: Colyseus + Matter.js (server) · PixiJS 8 WebGL (client) · Firebase Firestore (data)
- **Beyblades researched**: 334+ across Gen1 Plastic, HMS, MFB, Burst, BX
- **Admin pages**: 51 (9 new preset-def CRUD pages added Session 29)
- **Sessions completed**: 29 (all on 2026-05-23 to 2026-05-24)

---

## 2. Rendering — What We Can and Cannot Do

| View | Status | Notes |
|------|--------|-------|
| 2D Top-Down | ✅ Production-ready | `PixiRenderer.ts` — beyblades are procedural circles, no sprites required |
| 2.5D Tilt/Isometric | ✅ Production-ready | Three-container transform chain: `arenaTiltOuter → arenaTiltScale → arenaTiltInner`. `scaleX = cos(tiltAngle)` gives foreshortening. Physics-backed (server sends tilt force at 60 Hz). |
| Full 3D | ❌ Not feasible without full rewrite | No Three.js/Babylon, no 3D models, no Rapier/Cannon physics. Everything is procedural or 2D. |

**Admin Arena System tools** (all under `client/src/components/admin/arena-system/`):

| Component | Type | What it does |
|-----------|------|--------------|
| `ArenaSystemEditor` | ✅ Full creator | Tabbed editor (Overview, Elevation Map, Wall Profile, Slope Physics, Features, Preview) with `onChange` + `onSave`. Real CRUD — not just a viewer. |
| `ArenaSystemIsometricView` | ⚠️ Static preview | PixiJS 9×9 elevation mesh using true isometric formula `(x−y*0.5, (x+y)*0.4)`. Shows bowl/pyramid/ramp profiles. No beyblades, no live physics. |
| `ArenaSystemTopDownView` | ⚠️ Static preview | 12-segment elevation heatmap |
| `ArenaSystemOrbitalView` | ⚠️ Static preview | Top-down with gravity/tilt direction arrow |
| `ArenaSystemSideView` | ⚠️ Static preview | 2D cross-section profile graph (floor curvature vs. distance from center) |
| `ArenaSystemPreview` | ⚠️ Static preview | Wrapper that composes the four views above into tabs |
| `ArenaSystemStatsPanel` | Info panel | Displays computed arena stats (radius, wall angle, physics values) |

**Gap**: There is NO standalone live 2.5D arena viewer for admins. The real tilt-chain 2.5D renderer (`arenaTiltOuter → arenaTiltScale → arenaTiltInner`) only runs inside `PixiRenderer.ts` during actual matches. The admin isometric view uses a different, simpler projection formula.

**Assets**: Zero local sprite/model files. Beyblades drawn at runtime via `drawBeybladeShape()`. Arena themes are color palettes only. Obstacle/turret/water/portal assets are PNG/JPG/WebP/GIF URLs stored in Firestore.

---

## 3. Physics Architecture

- **Server**: Matter.js 2D, 60 Hz tick, synchronous (no async in game loop)
- **2.5D layer**: `PartPhysics.ts` + `PartSystemManager.ts` — Z-axis behavior without a real Z coordinate
  - `beyTiltAngle` — visual + physics tilt (not a Z position)
  - `isAirborne` — cosmetic scale effect + shadow
  - `effectiveGravity` — modified by tilt angle
  - Wall/ceiling adhesion via `ClimbingPhysics.ts`
- **Tilt force**: `sin(tiltAngle) × 0.04 × mass` in tiltDirection vector, every tick
- **Nutation**: triggers at < 40% spin stability; seeded PRNG (`matchId` seed via `createPRNG` + `hashString`) — deterministic replays
- **Gyroscopic precession formula**: `Ω_P = rMg / (Iω)` — confirmed from real-world physics (Batch 015)
- **Moment of inertia** (`I = Σ(m·r²)`) — primary factor determining spin time; higher mass at larger radius = longer spin

---

## 4. Beyblade Part Taxonomy (Confirmed Facts)

### MFB Tips (65+ abbreviations confirmed)
- **B:D** = Bearing Drive (NOT "Bottom Drive") — world record spin time 7:35 min at 170 height
- **EWD** = single bearing (NOT double bearing) — `bearingFriction = 0.12`
- **WD vs W²D**: WD is Wide Defense; W²D is Wide² Defense — different rim profiles and masses
- **Drift / BD / Bearing Drift**: three separate tips — Drift (rubber contact), Bearing Drift (central bearing + rubber outer ring), BD (pure bearing)

### Burst Drivers (173 confirmed)
- All 173 Burst drivers catalogued with abbreviation, contact type, and spin-time profile

### BX Parts (Xtreme gear)
- 26 ratchets confirmed
- 47+ blades mapped
- Gear Bit mechanic: rack-and-pinion physical engagement on contact

### Weight Disks (Gen1 — real weights confirmed from sources)
- Eight Balance: 14.1 g
- Ten Heavy: 16.1 g
- Six Heavy, Eight Heavy, Ten Balance, etc. fully catalogued

### Flower Pattern — RESOLVED
- **Is NOT a fixed tip attribute** and **NOT literal petal protrusions**
- It is an **emergent physics property**: periodic stick-slip grip-release cycles create a winding-number orbital trajectory
- The number of "petals" depends on spin speed, floor friction, and tip contact area — it changes during a battle

### Zeus AR — special case
- Two-component free-spin architecture (outer ring free-spins independently of the core)

### Petal count — RESOLVED (Batch 011)
- Emergent winding-number of orbital trajectory
- Not a static property to store on the tip — varies dynamically

---

## 5. Engine Systems Inventory

### Mechanics (31 registered handlers)
`energy_reserve`, `velocity_burst`, `attack_amplifier`, `free_spin`, `spin_transfer`, and 26 more.
All handlers modify existing schema fields only — no new schema needed per mechanic.

### Gimmicks (27 defined)
22 original + 5 added Session 14: `magnacore_repel`, `magnacore_attract`, `dual_spin_launch`, `mode_switch_tip`, `spring_launch`.
Each gimmick is a recipe of `behaviorRefs → MechanicInstance[]`, expanded at match start by `gimmickExpander.ts`.

### Part Slots (9 types)
`attack_ring (AR)`, `weight_disk (WD)`, `tip`, `core`, `casing`, `bit_beast`, `sub_part`, `spin_track`, `gear` (added Session 7)

### Special Moves (45+ catalogued)
5-phase state machine: `idle → windup → executing → bleed → cooldown`
QTE cancellation gate active during windup.
Optional on beyblade — `specialMoveId` field; empty hides the HUD panel.

### Combos (8 total)
4 free (cost 0) + 4 cost-tiered (15/25/35 power).
Each requires exactly 3 keys. Max 3 combos per beyblade (`comboIds[]`).
`effectId` fully wired to `combo_effects` collection (Session 17).

| ID | Sequence | Cost | Type |
|----|----------|------|------|
| quick-dash-l | ←←J | 0 | universal |
| quick-dash-r | →→J | 0 | universal |
| guard-tap | KKK | 0 | universal |
| feint | ←→K | 0 | universal |
| riposte | KKJ | 15 | defense |
| pivot-strike | ←→J | 15 | balanced |
| power-thrust | JJJ | 25 | universal |
| spin-leech-jab | ←J→ | 35 | stamina |

### Arenas (32 stadiums catalogued)
- Shape types: circle, hexagon, star, stadium, cross, and more
- Feature types: spin zones, bumps, gravity wells, obstacles, trigger zones, switches, portals, water bodies, turrets
- Switch wiring: any feature with `controlledBySwitchId` activates only when that switch is on
- Self-rotation: any feature can spin in place (`selfRotation: { speedDegPerSec, direction }`)
- Arena shrink: `effectiveRadius` driven by `ArenaConfig.shrink`

### AI Difficulty (3 levels)
- **Medium**: chase + attack at 200px, defense at low spin
- **Hard**: 5-tick prediction, circle-strafe, dodge on closing speed > 3
- **Hell**: 10-tick prediction, ring-out-aware, dodge threshold 2, instant special activation, periodic 3-key combo every ~2s

### Turret Attacks (175+ moves)
All 4-file pattern, zero TSC errors. Includes all generations' anime/game signature moves.

---

## 6. Firebase Collections (Complete List)

| Collection | Purpose |
|-----------|---------|
| `beyblade_stats` | Beyblade configs (specialMoveId, comboIds) |
| `arenas` | Arena configs |
| `beyblade_parts` | 2.5D part library |
| `beyblade_systems` | Assembled 2.5D configs |
| `mechanic_defs` | 31 mechanic handlers |
| `gimmick_defs` | 27 gimmick recipes |
| `combos` | 8 combo definitions |
| `special_moves` | Special move registry |
| `ai_battles` | Quick-launch AI presets |
| `matches` | Match results |
| `player_stats` | Win/loss/damage/tournamentPoints |
| `tournaments` | Tournament metadata |
| `tournament_participants` | Per-player per-tournament docs |
| `tournament_brackets` | Bracket match slots |
| `tip_shape_defs` | 16 tip shape presets |
| `core_gimmick_defs` | 12 core gimmick modes |
| `attack_type_defs` | 8 attack types for contact points |
| `arena_theme_defs` | 12 arena visual themes |
| `arena_shape_defs` | 10 arena boundary shapes |
| `bowl_profile_defs` | 8 bowl wall-angle profiles |
| `trigger_type_defs` | 12 stat modifier trigger conditions |
| `stat_event_defs` | 15 stat tracking events |
| `part_layer_defs` | 12 part layer types |
| `settings` | Single game-wide config doc |
| `users` | User profiles and roles |
| `sound_assets` + asset libraries | Firestore-hosted asset URLs |

---

## 7. Unified Foundation (Phase 21 — Architectural Basis)

Three pillars replace hardcoded fields everywhere in the engine:

1. **BehaviorDef** — mechanic + gimmick handlers; used by special moves, combos, arena features, turrets, parts, obstacles, water bodies
2. **GeometryDef** — shape referenced once; used by AR contact points, arena boundaries, projectiles, zones, beyblade silhouettes
3. **StatDef** — types all numeric attributes; `StatModifier[]` is the universal stat-delta type

**"Make anything" guarantee**: new content requires only data authoring in Firestore — no code changes.

---

## 8. Beyblade Type Balance

360 total stat points, max 150 per category:

```
damageMultiplier = 1.0 + attack * 0.007       // 1.0x – 2.05x
damageReduction  = 1 - defense * 0.003        // 1.0x – 0.55x
spinDecayRate    = 8 * (1 - stamina * 0.001)  // 8 – 6.8 /s
maxSpin          = 2000 * (1 + stamina * 0.0008)
```

Archetype physics (Batch 014 — confirmed real-world grounding):
- **Attack**: low WD mass, high AR attack surface, fastest spin decay
- **Defense**: max WD mass at outer rim, maximum I, slow linear velocity
- **Stamina / Zombie**: large-diameter WD, rubber/bearing tip, longest spin time
- **Compact**: small WD, tight center-of-mass, high rebound
- **Balance**: mixed stats, generalist

---

## 9. Engine Optimizations (Phase 24 — Planned, Foundation Stays Intact)

All 11 optimizations are **additive only** — they improve performance without touching physics, game logic, or schema behavior. Safe to implement in any order within each priority tier.

### Rendering (PixiJS 8.14.0) — R1–R5

| ID | Technique | How | Effort | Gain |
|----|-----------|-----|--------|------|
| R1 | Frustum culling | `cullable = true` on `beyContainer`, `featureLayer`, `particleLayer` | Low | 15–25% draw calls when zoomed |
| R2 | ParticleContainer | Replace particle `Container` with `PIXI.ParticleContainer(2000, …)` + shared 4×4 RenderTexture for sparks | Medium | 10–30% heavy collision scenes |
| R3 | Bake arena floor | `generateTexture(arenaFloorGraphics)` after `rebuildArenaGeometry()`; re-bake only on tilt change or switch-gated feature change | Medium | 20–40% arena render cost |
| R4 | Dirty-flag redraws | Skip `redrawBeyGraphics` when `spin` and `material` unchanged from last frame | Low | 5–15% idle beys |
| R5 | LOD distant beys | Hide detail layer (`children[1]`) for beys > 400px from camera center | Low | 20–30% royale overview |

### Network (Colyseus) — N1–N4

| ID | Technique | How | Effort | Gain |
|----|-----------|-----|--------|------|
| N1 | Client-side prediction | Apply `applyBlendedMovement` locally this frame; lerp-reconcile on server tick (threshold-gated, not snap) | High | Input latency → ~0ms |
| N2 | AoI culling (royale) | `Room.filter()` — skip full sync for beys > 600px from client's bey; send position-only simplified state | Medium | 40–60% royale bandwidth |
| N3 | Input deduplication | `sendInputIfChanged(mask)` — skip send if bitmask unchanged; 500ms heartbeat to prevent server timeout | Low | 50–80% input messages |
| N4 | Schema type narrowing | Use `uint8` for `controlAuthority`, `safeZonePhase`; keep `rageBurstTicks` server-side only (no schema field) | Low | Small, consistent BW |

### Server / Matter.js — S1–S2

| ID | Technique | How | Effort | Gain |
|----|-----------|-----|--------|------|
| S1 | Static body sleeping | Verify `isStatic: true` on all wall segments + obstacle bodies in `createArenaWalls()` + `createObstacles()` | Low | 5–10% physics tick |
| S2 | Narrow-phase filter | Pre-filter `collisionStart` pairs by `dist < rA + rB + 50` before `processCollisions()` | Medium | 10–20% royale physics |

### Implementation Priority

| Tier | Items | Reason |
|------|-------|--------|
| Phase 1 — do first | R1, R4, N3, N4, S1 | Single-line or tiny changes; zero behavior risk |
| Phase 2 — medium effort | R3, R2, R5, S2 | Texture/container restructuring; test after each |
| Phase 3 — do last | N1, N2 | N1 needs correctness + jitter testing; N2 needs royale (Phase 23) first |

**Key constraint**: `applyBlendedMovement` + `applySteeringForce` live in `server/shared/rooms/InputHandler.ts` and are importable on the client via the `shared/` path — no code duplication needed for N1.

---

## 10. Known Gaps (Priority Order)

| Gap | Priority | Notes |
|-----|----------|-------|
| BehaviorRef dispatcher only handles `movement.orbit` (19+ unhandled branches) | HIGH | Critical — most gimmick effects never fire |
| mechanic_defs + gimmick_defs CRUD pages not linked in router | MEDIUM | Pages built, just missing routes |
| RoundModifier schema mismatch (admin vs runtime type) | MEDIUM | Admin uses flat name/type/magnitude; runtime uses nested override objects |
| Arena timeline + shrink not exposed in admin UI | MEDIUM | Config in code, no editor |
| Special move step authoring UI incomplete | LOW | Flat `effects` object, not step-by-step |
| Camera profiles + Audio profiles collections missing | LOW | Referenced by SpecialMoveStep at runtime |
| AnimationPresets orphaned | LOW | Defined, never linked |

---

## 10. Source Tier Reference

| Tier | Sources |
|------|---------|
| Tier-1 (authoritative) | plasticsdb.com, hmsdb.com, beybxdb.com, burst-planner, beybase |
| Tier-2 (cross-check) | Beyblade Fandom wiki, WBO forum posts |
| Verified count | 100+ URLs fetched across Batches 008–015 |

All facts in batches are tagged: **FACT** / **INFERENCE** / **SPECULATION** / **UNKNOWN**.

---

## 11. File Registry Quick Reference

| Location | Contents |
|----------|----------|
| `research/batches/batch-000` | Admin audit: 51 pages, 9 new collections |
| `research/batches/batch-001` | Schema catalog: 95+ fields, 11 Colyseus classes |
| `research/batches/batch-002` | Discovery table: 42 engine capability findings |
| `research/batches/batch-003` | Engine capability: 75 rows (physics, combat, arena, AI, render) |
| `research/batches/batch-004` | MFB parts: 65+ tip abbreviations, B:D correction |
| `research/batches/batch-005` | Burst parts: 173 drivers |
| `research/batches/batch-006` | BX parts: 26 ratchets, 47+ blades |
| `research/batches/batch-006-x` | BX disambiguation: Gear Bit, X-Cutter, Ratchet naming |
| `research/batches/batch-007` | Extended gimmicks: EWD, WD/W²D, tips/casings |
| `research/batches/batch-008` | Source verification: 39 URLs, INFERENCE→FACT upgrades |
| `research/batches/batch-009–015` | Deep physics: WD weights, petal resolution, archetype physics, real-world grounding |
| `research/phases/phase-00–03` | Core engine audit, terminology, special moves |
| `research/phases/phase-04–08` | Combos, parts (9 slots), mechanics (31), gimmicks (27) |
| `research/phases/phase-09–10` | Arenas (32 stadiums), arena features |
| `research/phases/phase-11–16` | Shared architecture, seed planning, controls, game modes, gap analysis |
| `research/phases/phase-19–21` | Implementation plan, code generation, unified foundation |
| `research/diagrams/` | 17 Mermaid architecture + flow diagrams |
| `research/INDEX.md` | Master file registry with status table |
| `research/progress.md` | Session-by-session activity log (Sessions 1–29) |

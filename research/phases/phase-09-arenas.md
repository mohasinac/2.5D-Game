[← Phase 08: Gimmicks](phase-08-gimmicks.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 10: Arena Implementation →](phase-10-arena-implementation.md)

---

# Phase 09 — Arena Systems

> Stage 9 | Source: linka/stadiums/ + arenaConfigNew.ts + ArenaFeatureProcessor.ts + diagram-arena-interaction.md

---

## Amendment — Session 18: Arenas Use All Three Foundation Pillars

> See **[Phase 21 — Unified Foundation](phase-21-unified-foundation.md)** for the full spec.

Every arena feature (spin zones, gravity holes, bumps, directional zones, trigger zones, obstacles, turrets, water bodies) gains:

| New field | Type | Purpose |
|-----------|------|---------|
| `mechanicRefs: MechanicInstance[]` | Pillar 1 | Behavior — replaces hardcoded ArenaFeatureProcessor logic |
| `geometry: GeometryRef` | Pillar 2 | Shape — replaces inline `radiusCm`/`shape`/`width`/`height` fields |
| `zoneModifiers?: StatModifier[]` | Pillar 3 | Stat deltas applied while a bey is inside the zone |

Arena top-level gains:

| New field | Type | Purpose |
|-----------|------|---------|
| `boundaryGeometryId?: string` | Pillar 2 | Non-circular arena boundary |
| `matchModifiers: StatModifier[]` | Pillar 3 | Replaces bespoke physics fields: `staminaDrainMultiplier`, `qteEnabled`, `qteWindowScaling`, `randomModifiers`, `maxModifiers` |

Old fields remain for backward compat. `matchModifiers` takes precedence when present.

---

## Stadium Inventory

| Stadium ID | Name | Gen | Shape | Diameter (cm) | Key Features | Special Mechanics | Source | Confidence |
|---|---|---|---|---|---|---|---|---|
| `tt-a1-spin-stadium` | Spin Stadium | gen1 | circular | 22 | 2 penalty pockets, flat bowl | Easy ring-out (small) | Canonical product A-1/A-2 | Medium (no dedicated wiki page) |
| `tt-gen1-beystadium-generic` | Beystadium (Gen 1 Generic) | gen1 | circular | 28 | 2 penalty pockets, gentle slope | Family umbrella for SG/Magnacore/EG variants | Fandom wiki `Beystadium` verified | High |
| `tt-a65-magnacore-stadium` | Magnacore Stadium | gen1 | circular | 28 | 2 pockets, 4 embedded floor magnets | Magnetic repel/attract vs Magnecore-equipped beys | Fandom wiki `Magnacore_System` verified | High |
| `tt-bb10-attack-stadium` | BB-10 Attack Type Beystadium | gen2 | circular | 34 | 8 pockets, tornado ridge (14 cm) | Tornado Stall technique; introduced ridge topology | Product card, no wiki body | High |
| `tt-bb91-gravity-stadium` | Gravity Destroyer Stadium | gen2 | circular | 30 | 2 pockets, small tornado ridge (11 cm) | 2-pocket variant = longer stamina battles | No wiki article | Medium |
| `tt-bbg04-zerog-stadium` | Zero-G Attack Type Beystadium | gen2.5 | circular | 32 | 2 pockets, pivot base | Dynamic tilt (±15°) — bowl rocks by mass distribution | Fandom `Beystadium` umbrella verified | High |
| `hasbro-destroyer-dome` | Destroyer Dome | gen2 | sphere | 25 | Closed sphere, no pockets | 360° wall-orbit; Dome Spin Track required | Fandom wiki `Destroyer_Dome` verified | High |
| `tt-b09-burst-standard` | Burst Beystadium Standard Type | gen3 | circular | 31 | 4 pockets, tornado ridge (14 cm), tall walls | Burst Finish de-emphasizes ring-out | No wiki article body | High |
| `tt-b33-god-layer-stadium` | Burst Evolution Stadium (God Layer) | gen3 | circular | 31 | 4 pockets, God Zone depression (~10 cm) | Central God Zone: stamina friction bonus | No wiki body | High |
| `hasbro-slingshock-stadium` | SlingShock Beystadium | gen3 | circular | 36 | 2–4 pockets, 4 plastic rail arcs | SlingShock Driver rail engagement = speed boost | Fandom `Beystadium` umbrella verified | High |
| `hasbro-hypersphere-stadium` | HyperSphere Beystadium | gen3 | circular | 38 | 0 pockets, vertical inner wall (8 cm), brink | Wall-climb + Vortex Drop attack | Fandom `Beystadium` umbrella verified | High |
| `tt-bx-10-xtreme-stadium` | Xtreme Stadium | gen4 | square-outer/circular-interior | 36.5 | 1 Xtreme Zone (19 cm), 2 Over Zones (12 cm each), gear rail | Xtreme Dash via gear-toothed Xtreme Line | Fandom wiki `Xtreme_Stadium` verified | High |
| `hasbro-g0318-tournament-beystadium` | Tournament Beystadium (Hasbro) | gen4 | same as BX-10 | 36.5 | Alias of BX-10; X-Celerator Rail branding | Mechanically identical to BX-10 | Fandom wiki `Xtreme_Stadium` verified | High |
| `tt-bx-46-infinity-stadium` | Infinity Stadium | gen4 | rectangular | N/A (larger than BX-10) | 2 Xtreme Zones (both ends), 4 Over Zones, 2 gear rails | Infinity Dash loop between both ends | Retail listings + Fandom summary verified | High |
| `anime-rooftop-beystadium` | Rooftop Beystadium | gen1 | circular | 25 | No pockets, low rim | Running aerial launch; wind variation | Episode ep01 doc | High |
| `anime-seaside-dome` | Seaside Dome (5-stage) | gen1 | circular | 35 | 5 modular inserts: plain → obstacle dish → tower → deep → 8-pocket | Multi-insert swapping per round | ep04–07 docs | High |
| `anime-china-towers-peak` | China Towers Peak Stadium | gen1 | circular | 32 | 2 pockets | Wind gust stochastic forces at altitude | ep10 doc | High |
| `anime-asian-tournament-standard` | Asian Tournament Standard | gen1 | circular | 32 | 2 pockets, twin-arena mode | Twin parallel arena layout | ep13–17 docs | High |
| `anime-asian-tournament-desert` | Asian Tournament Desert Stadium | gen1 | circular | 32 | 2 pockets | Sand floor — 2.5× friction; blocks banking/rush | ep17 doc | High |
| `anime-asian-tournament-finals` | Asian Tournament Finals (Central Pillar) | gen1 | circular | 34 | 2 pockets, central cylinder obstacle | Dragon-pillar obstacle blocks line-of-sight | ep15–16 docs | High |
| `anime-nj-turnpike` | New Jersey Turnpike Stadium | gen1 | circular | 34 | 2 pockets, raised wall median obstacle | Highway median obstacle splits pit floor | ep25 doc | High |
| `anime-baseball-diamond-dish` | Baseball Diamond Dish | gen1 | diamond (polygon) | ~34 (diagonal) | 4 base-shaped pockets at vertices | Non-circular boundary; asymmetric banking | ep28 doc | High |
| `anime-enrique-colosseum` | Enrique's Colosseum Arena | gen1 | circular | 35 | 2 pockets + 3 tiered rebound walls + 4 column obstacles | Tiered rebound: bey bounces off tiers before ring-out | ep35–36 docs | High |
| `anime-robert-castle-interior` | Robert's Castle Interior Arena | gen1 | rectangular | 28 | No pockets, stone walls at height 800mm | No ring-out; spin-out / burst / KO only | ep37 doc | High |
| `anime-robert-olympia-coliseum` | Robert's Olympia Coliseum | gen1 | circular | 40 | 4 pockets, 8 Greek column obstacles, deep pit | Greek pillars ring perimeter; deep pit | ep38–39 docs | High |
| `anime-balkov-abbey-chamber` | Balkov Abbey Battle Chamber | gen1 | rectangular | 30 | 4 spike pockets, stone walls, dim lighting | Spike pockets = instant KO; polished stone friction | ep40/44 docs | High |
| `anime-frozen-lake-baikal` | Frozen Lake Baikal | gen1 | open terrain | ~4000×4000 | No walls, cracking-ice pits | Ice friction 0.3×; dynamic crack pits form from impacts | ep45 doc | High |
| `anime-world-championship-stadium` | World Championship Official Stadium | gen1 | circular | 38 | 4 pockets, low central rise, tall walls (120mm) | Accepts `StadiumTransform`s (Tala's Ice Prison) | ep43/49/50 + GR docs | High |
| `anime-wolborg-ice-prison` | Wolborg Ice Prison Dimension | gen1 | transform overlay | — | Sealed pockets, ice walls, ice floor, orbiting Wolborg | Special-move terraforming — stadium transforms mid-battle | ep50–51 docs | High |
| `anime-battle-tower` | Battle Tower (V-Force) | gen1 | chain of 5 | varies | 5 distinct stadiums per floor | Dungeon-chain: gauntlet → standard → triangular → spike-floor → collapsing | ep21–27 docs | High |
| `anime-roller-coaster` | Abandoned Roller Coaster | gen1 | rail network | N/A | Rails as floor, loops, banked turns, junctions | Rail-network arena; loops require minimum velocity | ep38 doc | High |
| `anime-ayers-rock-stadium` | Ayers Rock Stadium | gen1 | open terrain (polygon) | ~5000×5000 | No walls/pockets, sand patches (friction 0.4×), sun glare | Polygon boundary; random slip zones | ep25 GR doc | High |
| `anime-wilderness-stadium` | Wilderness Stadium | gen1 | circular | 40 | 4 pockets, low central rise | Rock amphitheater backdrop; mechanically = World Championship | ep28–30 GR docs | High |
| `anime-red-dragon-stadium` | Red Dragon Stadium | gen1 | circular | 36 | 4 pockets, polyline dragon-spine obstacle | Asymmetric curved obstacle through pit center | ep27 GR doc | High |
| `anime-bega-main-stadium` | BEGA Main Stadium | gen1 | circular | 36 | 4 pockets, acrylic LED walls | LED feedback per event type (burst/KO/spin) | ep33/36/44 GR docs | High |
| `anime-justice-five-stadium` | Justice Five Tournament Stadium | gen1 | circular | 38 | 4 pockets (alias of World Championship) | Story-Mode 5-match boss tournament chain | ep49–51 GR docs | High |
| `anime-battle-bladers-stadium` | Battle Bladers Stadium | gen2 | circular | 100 | 8 pockets, colosseum scale | Scaled-up BB-10 topology; cinematic spectator tiers | ep47–50 MF docs | Medium (wiki blocked) |
| `anime-survival-battle-stadium` | Survival Battle Tournament Arena | gen2 | circular | 60 | 12 pockets, large tornado ridge (22 cm), 8 spawn points | Battle-Royale 8-bey format reference | ep22 MF doc | High |
| `anime-hyper-wrap-stadium` | Hyper Wrap Stadium | gen1 | circular | 32 | 4 narrow pockets, vertical hard rim | High-friction floor (1.5×); vertical walls block ring-out | ep23–24 S1 docs (wiki blocked) | Medium |
| `anime-ibc-arena-complex` | IBC Arena Complex | gen3 | multi-stadium | varies | 3 group courts + 1 main finals court | Parallel multi-match tournament layout | ep44–49 S2 docs | High |
| `anime-hyper-stadium-rise` | Hyper Stadium (Battle Island) | gen3 | circular | 42 | 4 pockets, vertical wall (6 cm), tornado ridge | HyperSphere hybrid: wall-climb + normal play | ep14–15 S4 docs | High |

---

## Per-Stadium Feature Breakdown

### Spin Stadium (A-1/A-2)
- **Shape**: circular
- **Dimensions**: 22 cm diameter, ~5 cm depth, wall slope ~15°
- **Key Features**: 2 small penalty pockets (symmetric N/S), flat concave floor
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Penalty pockets | `pits[]` | 2 × penalty_well at N/S | angleDeg 90/270, radiusFromCenter ~60mm |
  | Bowl walls | `wall.bowlProfile` | `shallow` | 15° slope |
  | Tight boundary | `wall` (ringout scale) | 0.85 | Small diameter → fast ring-out |
- **Special Mechanic**: Smallest official stadium; extremely quick ring-outs. Tutorial/casual arena.
- **Engine Status**: Fully implementable with existing `pits[]` + `wall` fields. No gaps.

---

### Beystadium Gen 1 Generic (Tournament Beystadium)
- **Shape**: circular
- **Dimensions**: 28 cm diameter, ~6 cm depth, slope ~15°
- **Key Features**: 2 penalty pockets (N/S), flat floor with gentle slope
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Penalty pockets | `pits[]` | 2 × penalty_well | angleDeg 90/270, radiusFromCenter ~80mm |
  | Bowl | `wall.bowlProfile` | `shallow` | Standard plastic-gen bowl |
- **Special Mechanic**: Umbrella for the entire plastic-generation product family. Standard rules: penalty pockets = forfeit, ring-out = KO.
- **Engine Status**: Fully implementable. No gaps.

---

### Magnacore Stadium (A-65)
- **Shape**: circular
- **Dimensions**: 28 cm diameter, standard plastic-gen depth
- **Key Features**: 2 pockets (E/W), 4 embedded floor magnets in symmetric pattern (+/- poles)
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Penalty pockets | `pits[]` | 2 × penalty_well | angleDeg 0/180 |
  | Floor magnets | `obstacles[]` with `physics.type:"magnetic"` | 4 × magnetic obstacles | magnetStrength +/- by polarity, magnetRadiusCm ~50mm |
  | Magnet processing | `ArenaFeatureProcessor.processMagnets()` | runtime ✅ | Applies attract/repel force when in radius |
- **Special Mechanic**: Magnetic interaction between floor magnets and Magnecore-equipped beys. Repel = erratic attack behavior; attract = defense lock. Magnetic Weight Disk vs Disk can repel beys from each other entirely (endurance battle) or force constant contact.
- **Engine Status**: `processMagnets()` already implemented. Obstacle `physics.type:"magnetic"` fully supported. No engine gaps.

---

### BB-10 Attack Type Beystadium
- **Shape**: circular
- **Dimensions**: 34 cm battle zone, tornado ridge 14 cm diameter, ~6 cm depth
- **Key Features**: 8 pockets at 45° increments, raised tornado ridge
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 8 pockets | `pits[]` | 8 × penalty_well at 45° | radiusFromCenter ~155mm |
  | Tornado ridge | `elevationZones[]` | 1 zone, r=70mm, spin boost | spinBoostOnPlatform or spinBoostPercent |
  | Bowl walls | `wall.bowlProfile` | `medium` | Standard BB-10 profile |
  | Open ring-out | `wall` | enabled, no exits gaps | Standard ring-out boundary |
- **Special Mechanic**: Tornado ridge enables the "Tornado Stall" technique (stamina types orbit ridge to preserve spin). 8-pocket layout creates dramatic KO moments. This is the canonical reference topology for all later stadium designs.
- **Engine Status**: All features implemented. `elevationZones[]` processes spin boosts. `pits[]` handles pockets. No gaps.

---

### Gravity Destroyer Stadium (BB-91)
- **Shape**: circular
- **Dimensions**: 30 cm diameter, smaller tornado ridge 11 cm, ~5 cm depth
- **Key Features**: 2 pockets (N/S), small tornado ridge
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 2 pockets | `pits[]` | 2 × penalty_well | angleDeg 90/270 |
  | Small ridge | `elevationZones[]` | r=55mm | Smaller than BB-10 ridge |
  | Bowl | `wall.bowlProfile` | `medium` | Standard BB-10 style |
- **Special Mechanic**: Fewer pockets = longer battles; favors stamina. Sold as starter-set bundle with Gravity Perseus/Gravity Destroyer bey.
- **Engine Status**: Fully implementable. No gaps.

---

### Zero-G Attack Type Beystadium (BBG-04)
- **Shape**: circular with pivot base
- **Dimensions**: 32 cm diameter, 2 pockets, ±15° tilt range
- **Key Features**: Ball-joint pivot base, 2 pockets, tornado ridge
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 2 pockets | `pits[]` | 2 × at N/S | Standard pits |
  | Ridge | `elevationZones[]` | center zone | r=50mm |
  | Dynamic tilt | **NOT IN ArenaConfig** | `tiltMechanic` (proposed extension) | Arena bowl tilts toward mass concentration; no current ArenaConfig field |
- **Special Mechanic**: The bowl tilts toward whichever side has heavier mass concentration. This shifts slope vectors in real time, turning the physics itself into a strategic element. Canonical reference for `TiltMechanicSystem`.
- **Engine Status**: CRITICAL GAP. Dynamic tilt is NOT in the current `ArenaConfig` schema or `ArenaFeatureProcessor`. Requires a new `tiltMechanic` field on `ArenaConfig` and a per-tick mass-sum calculation in the processor. This is the only commercially released stadium with an unimplemented core mechanic.

---

### Destroyer Dome
- **Shape**: hollow sphere
- **Dimensions**: ~25 cm sphere diameter
- **Key Features**: No pockets, no floor, no ring-out boundary; closed sphere with entry hole at top
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Spherical wall-orbit | **NOT IN ArenaConfig** | `wallClimbZones[]` (proposed `full_orbit` kind) | Bey orbits inside sphere at 90° tilt; no equivalent in current schema |
  | Compatibility gate | **NOT IN ArenaConfig** | `requiresDomeSpinTrack` | No per-bey part-compatibility gating in ArenaConfig |
  | Win condition | — | spin_out only | No ring-out; closed sphere |
- **Special Mechanic**: Beys must have a Dome Spin Track to maintain wall contact via centripetal force. Without it, bey falls. Smooth tracks + lightweight stamina beys do best. Very short battles.
- **Engine Status**: CRITICAL GAP. The `sphere` shape does not exist in `ArenaShape` union (only circle/triangle/square/pentagon/hexagon/heptagon/octagon/stars). Full orbital physics inside a sphere shell would require `WallClimbSystem` Phase A.3 extension. Not implementable with current schema.

---

### Burst Beystadium Standard Type (B-09)
- **Shape**: circular
- **Dimensions**: 31 cm battle zone, tornado ridge 14 cm, tall walls (~5 cm)
- **Key Features**: 4 pockets (NESW), tornado ridge, tall outer rim
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | 4 × at 0/90/180/270° | mouthMm ~32 |
  | Tornado ridge | `elevationZones[]` | center spin zone | Stamina boost on ridge |
  | Tall walls | `wall.bowlProfile` | `deep` | Taller than BB-10 to de-emphasize ring-out |
- **Special Mechanic**: Tall walls reduce ring-out frequency; Burst Finish (2 pts) becomes primary win condition. Same ridge topology as BB-10 but smaller pocket count.
- **Engine Status**: Fully implementable. No gaps.

---

### Burst Evolution Stadium / God Layer Stadium (B-33)
- **Shape**: circular
- **Dimensions**: 31 cm battle zone, tornado ridge 13 cm, God Zone 10 cm depression
- **Key Features**: 4 pockets (NESW), tornado ridge, central God Zone depression (~3 mm)
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | 4 × NESW | Standard |
  | Tornado ridge | `elevationZones[]` | center zone | r=65mm |
  | God Zone | `floorHazardZones[]` with `hazardType:"ice"` OR `effectZones[]` with `effectType:"spin_recovery"` | center depression r=50mm, frictionMultiplierPermille 700 | Friction reduction = stamina advantage. Best mapped as effect zone or custom friction zone |
- **Special Mechanic**: God Zone (central depression) gives a stability/stamina bonus to beys using God-Drivers (spring-loaded). Mechanically: reduced friction at center. Purely additive on top of B-09 topology.
- **Engine Status**: Implementable. God Zone best expressed as a central `floorHazardZones[]` entry with `hazardType:"ice"` (friction reduction) or as an `effectZones[]` entry with `effectType:"spin_recovery"`. No new schema field required.

---

### SlingShock Beystadium
- **Shape**: circular
- **Dimensions**: 36 cm, 2–4 pockets, 4 plastic rail arcs around inner perimeter
- **Key Features**: 4 curved plastic rails around inner wall, 2-4 pockets, tornado ridge
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 2–4 pockets | `pits[]` | 2–4 | variant-dependent |
  | Speed rails | `speedPaths[]` / loops + `gearRails` (proposed) | 4 arc rails | speedBoostPermille ~300, direction_policy: tangent_forward. Current `SpeedPathConfig` can approximate but lacks per-bey compatibility gating |
  | Compatibility gate | **NOT IN ArenaConfig** | `requiresSlingShockDriver` | ArenaConfig has no per-bey Driver compatibility gating |
- **Special Mechanic**: Rail engagement requires a SlingShock Driver tip that physically slots into the rail's nub geometry. +30% speed on exit + tangential redirect. Strategic: time entry to maximize exit vector toward opponent.
- **Engine Status**: PARTIAL GAP. `SpeedPathConfig` (loops) can model the speed boost path. However, the compatibility gate (only specific Drivers engage rails) has no ArenaConfig equivalent — the engine has no per-bey driver-type checking at the stadium level. For the game engine (which has no physical Driver parts), this can be simplified to no compatibility gating. The speed boost itself maps cleanly to `speedPaths[]`.

---

### HyperSphere Beystadium
- **Shape**: circular with vertical inner wall
- **Dimensions**: 38 cm outer, 22 cm inner battle ring, 8 cm vertical wall, 32 cm brink
- **Key Features**: 0 pockets, vertical inner wall, brink ring, battle ring floor
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Vertical inner wall | **NOT IN ArenaConfig** | `wallClimbZones[]` (proposed `vertical_inner_wall` kind) | No current field for inner vertical walls |
  | Battle ring | `wall` geometry | inner arena boundary | The 22 cm ring is the actual play area |
  | Win conditions | — | burst + spin_finish only | No ring-out, no pockets |
- **Special Mechanic**: HyperSphere Drivers (specialized tips) engage the inner vertical wall when angular velocity is high. Bey climbs to brink, orbits at 32 cm diameter, then drops into battle ring with vertical impact force (Vortex Drop). Dual-level arena: floor + brink.
- **Engine Status**: CRITICAL GAP. `ArenaConfig` has no `wallClimbZones[]` field. The `ArenaShape` union only supports 2D polygon shapes; vertical inner walls require a separate physics zone type. Requires Phase A.3 `WallClimbSystem` extension to `ArenaConfig` + `ArenaFeatureProcessor`.

---

### Xtreme Stadium (BX-10)
- **Shape**: square outer footprint, circular interior bowl
- **Dimensions**: 36.5 cm battle zone, tornado ridge 21 cm, Xtreme Zone 19 cm, 2 Over Zones 12 cm each
- **Key Features**: 1 Xtreme Zone (3-pt exit), 2 Over Zones (2-pt exits), gear-toothed Xtreme Line rail, tornado ridge
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Xtreme Zone exit | `pits[]` with kind `xtreme_zone` | 1 × center exit, angleDeg 270, 3 pts | `pits[]` tracks position but no scoring-value field exists in ArenaConfig |
  | Over Zone exits | `pits[]` with kind `over_zone` | 2 × corner exits, 2 pts | Same scoring gap |
  | Gear rail | `speedPaths[]` + gear-compat flag | 1 arc along inner edge | `SpeedPathConfig` lacks `requiresGearCompatibleBit` gating |
  | Tornado ridge | `elevationZones[]` | center, r=105mm | Standard ridge physics |
  | Square shape | `shape: "square"` | ✅ | `ArenaShape` supports `"square"` |
- **Special Mechanic**: Xtreme Dash — gear-compatible Bits engage the Xtreme Line rail and receive a large speed boost (~1.5×) directed toward exit zones. Distinguishes Gen 4: 3-pt Xtreme Finish vs 2-pt Over/Burst vs 1-pt Spin Finish point differential.
- **Engine Status**: PARTIAL GAP. `ArenaShape` supports `"square"`. `speedPaths[]` models the speed boost. However: (1) exit scoring differentiation (3-pt / 2-pt) is not in `ArenaConfig`; (2) gear-compatibility gating is not in ArenaConfig. For this engine these simplify: gear compat gate is omitted (all beys get the boost), exit-point scoring would need a new `exitScore` field on pits or a separate `exitZones[]` field.

---

### Tournament Beystadium / Hasbro G0318 (BX Stadium)
- **Shape**: identical to BX-10
- **Dimensions**: identical to BX-10
- **Key Features**: alias of `tt-bx-10-xtreme-stadium`; X-Celerator Rail branding
- **Arena Feature Mapping**: Same as Xtreme Stadium — `aliasOf` pattern.
- **Special Mechanic**: Same as BX-10 Xtreme Stadium; marketing name difference only.
- **Engine Status**: Implement as `aliasOf: 'tt-bx-10-xtreme-stadium'` — no separate implementation needed.

---

### Infinity Stadium (BX-46)
- **Shape**: long rectangular (larger than BX-10)
- **Dimensions**: exact cm TBD; larger than BX-10; both ends symmetrical
- **Key Features**: 2 Xtreme Zones (both ends), 4 Over Zones (all corners), 2 gear rails (both ends), tornado ridge, Infinity Dash loop
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Rectangular shape | `shape: "square"` or custom | No `"rectangle"` shape in `ArenaShape` union | Closest is `"square"` or would need `"rectangle"` added |
  | 2 Xtreme Zone exits | `pits[]` | 2 × xtreme_zone exits at both ends | Scoring gap same as BX-10 |
  | 4 Over Zone exits | `pits[]` | 4 × over_zone corners | Same |
  | 2 gear rails | `speedPaths[]` × 2 | One at each end, symmetrical | Infinity Dash: both rails active |
  | Infinity Dash | **NOT IN ArenaConfig** | `infinityDash` extension | Looping speed bonus for consecutive rail traversal |
  | Tornado ridge | `elevationZones[]` | center | Standard |
  | Faster stamina drain | `staminaDrainMultiplier` | `1.25` | **IMPLEMENTED** (session 13) — set `staminaDrainMultiplier: 1.25` for Infinity Stadium's 25% faster drain |
- **Special Mechanic**: Infinity Dash — bey catches rail_a → boosts → crosses → catches rail_b → boosts → loops back. Consecutive engagements possible (up to 10). Larger footprint + repeated boosts = 25% faster stamina drain than BX-10.
- **Engine Status**: PARTIAL GAP. `"rectangle"` shape missing from `ArenaShape` union (only square/polygon shapes available). Infinity Dash compound-loop bonus not in ArenaConfig. ~~`staminaDrainMultiplier` not in ArenaConfig~~ — **`staminaDrainMultiplier` added in session 13** (set to 1.25 for this stadium). Remaining gaps: rectangle shape + Infinity Dash compound-loop bonus.

---

### Rooftop Beystadium
- **Shape**: circular
- **Dimensions**: 25 cm, no walls, shallow bowl (10 mm depth)
- **Key Features**: No pockets, low rim, open-air outdoor setting, wind
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | No pockets | `pits: []` | empty | ✅ |
  | Wind | `environmentalEffect` | `preset: "storm"`, low intensity | `applyEnvironmentalEffects()` handles "storm" already |
  | Running launch | **NOT IN ArenaConfig** | `prelaunchMovement` extension | No pre-launch movement modifier in current schema |
  | Tutorial tag | `difficulty` | `"easy"` | Closest analog; no story mode tag |
- **Special Mechanic**: Tyson's running aerial launch — open rooftop enables sprint + jump launch for extra kinetic energy. Tutorial/beginner arena.
- **Engine Status**: Mostly implementable. Wind via `environmentalEffect`. Running launch mechanic (`prelaunchMovement`) is a non-standard field not in ArenaConfig; simplify to omit for first implementation.

---

### Seaside Dome (Multi-Stage, 5 Inserts)
- **Shape**: circular base venue, 5 modular inserts
- **Dimensions**: 35 cm base venue
- **Key Features**: Stage 1 = plain bowl; Stage 2 = 3 cylinder obstacles; Stage 3 = shallow saucer + central tower; Stage 4 = deep bowl; Stage 5 = 8 pockets + central rise
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Cylinder obstacles | `obstacles[]` | kind: "circle" obstacles at x/y positions | ✅ standard obstacle placement |
  | Central tower | `obstacles[]` | cylinder at x=0, y=0 | ✅ |
  | 8 pockets | `pits[]` | 8 × penalty_well | ✅ |
  | Modular inserts | **NOT IN ArenaConfig** | `modularInserts[]` extension | ArenaConfig has no "swap floor insert" mechanic |
- **Special Mechanic**: Per-round stadium insert swap — same outer venue, different floor layout per round. The modular-insert pattern is the canonical model for Story Mode tournament progression.
- **Engine Status**: Individual stages are all implementable with current ArenaConfig. The modular-insert swap (changing obstacles/pits mid-tournament) is not a runtime ArenaConfig feature — this is handled at the match-creation level (different ArenaConfig docs per round). No new schema needed; just requires multiple arena docs per tournament.

---

### China Towers Peak Stadium
- **Shape**: circular
- **Dimensions**: 32 cm, 2 pockets, low walls (30 mm), flat stone floor
- **Key Features**: 2 pockets, strong wind gusts, open-air at altitude
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 2 pockets | `pits[]` | 2 × at N/S | ✅ |
  | Wind gusts | `environmentalEffect` | `preset:"storm"`, gustIntervalTicks 60, magnitude 8mm | `applyEnvironmentalEffects("storm")` ✅ |
  | Visual backdrop | `theme` | `"mountains"` closest | No "skyscraper_peak" theme |
- **Special Mechanic**: Stochastic wind gusts every ~3 seconds. Ring-out risk amplified visually (beys fall off tower). Atmospheric pressure effect is too minor to model.
- **Engine Status**: Implementable. `environmentalEffect` with `"storm"` preset handles gusts. `"mountains"` theme for visual. No engine gaps.

---

### Asian Tournament Stadium (Standard / Semi / Finals / Desert variants)
- **Shape**: circular (all variants)
- **Dimensions**: 32–34 cm
- **Key Features**: 2 pockets (standard/desert), central pillar obstacle (finals), sand surface (desert), twin-arena layout (standard)
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Sand floor | `waterBodies[]` with `liquidType:"quicksand"` or `floorHazardZones[]` with `hazardType:"mud"` | frictionMultiplierPermille 2500 | High-friction surface. `mud` hazardType has 2.5× friction in processor |
  | Dragon-pillar obstacle | `obstacles[]` | cylinder at center | ✅ |
  | Twin arena | **NOT IN ArenaConfig** | `twinMode` extension | Rendering two arenas side-by-side is not in ArenaConfig |
  | Disables techniques | **NOT IN ArenaConfig** | `surface.disablesTechniques` | No technique-disable field in ArenaConfig |
- **Special Mechanic**: Desert variant: sand floor with friction 2.5× standard blocks banking, sliding shoot, and rush techniques. Finals variant: central pillar obstacle. Standard variant: twin parallel arenas.
- **Engine Status**: Desert friction: implementable via `floorHazardZones[]` with `hazardType:"mud"` (2.5× is supported by processor). Technique disabling is not in engine. Central pillar: fully implementable via `obstacles[]`. Twin arena layout requires a new engine-level multi-arena scene feature.

---

### American Tournament Stadium (Standard / NJ Turnpike / Finals / Baseball Diamond)
- **Shape**: circular (standard/finals/NJ), diamond polygon (baseball)
- **Dimensions**: 34–40 cm
- **Key Features**: NJ Turnpike has raised median wall; Baseball Diamond has non-circular boundary + 4 base pockets
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Median wall obstacle | `obstacles[]` | polyline_wall kind, horizontal across pit | `ObstacleShape` has `kind:"polyline"` ✅ |
  | Diamond boundary | `shape` | no `"diamond"` in ArenaShape | ArenaShape has `"square"` but not tilted square/diamond |
  | Diamond pockets | `pits[]` | 4 × at corners | ✅ positions |
  | Polygon boundary | **NOT IN ArenaConfig** | `ringoutBoundaryShape:"polygon"` + `ringoutBoundary[]` | Non-circular ring-out boundaries not in ArenaConfig |
- **Special Mechanic**: Baseball Diamond Dish has a non-circular (diamond polygon) outer boundary — the only canonical stadium with a purely non-circular play surface (Destroyer Dome is spherical but enclosed). Banking technique is asymmetric around a diamond rim.
- **Engine Status**: PARTIAL GAP. `ArenaShape` does not include `"diamond"` (a rotated square). However `"square"` rotated 45° could approximate it. Non-circular `ringoutBoundary` polygon is not in `ArenaConfig`. `obstacles[]` with `polyline` kind handles the NJ Turnpike median.

---

### Enrique's Colosseum Arena
- **Shape**: circular pit + 3 concentric tiered walls
- **Dimensions**: 35 cm pit, 3 tiers at +30/+60/+90 mm above rim
- **Key Features**: 2 pockets, 4 Roman column obstacles, 3-tier rebound walls
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 column obstacles | `obstacles[]` | 4 × circles at ±100mm offsets | ✅ standard obstacles |
  | 2 pockets | `pits[]` | N/S | ✅ |
  | Tiered rebound walls | **NOT IN ArenaConfig** | `tieredWalls[]` extension | No multi-tier rebound wall system in ArenaConfig |
  | Tier ring-out condition | **NOT IN ArenaConfig** | `ringoutCondition:"tier_settled_or_beyond_tier_3"` | Standard ring-out is pass-boundary; tier settling is different |
- **Special Mechanic**: The three concentric seating tiers act as graduated rebound barriers. A bey going over the rim bounces off Tier 1 (rebound 0.7), may reach Tier 2 (0.5), then Tier 3 (0.3). Ring-out only when bey settles on a tier at rest or clears Tier 3 entirely.
- **Engine Status**: GAP. `ArenaConfig` has no `tieredWalls[]` system. The column obstacles are implementable. The tiered rebound geometry requires a new multi-ring wall structure. This is a Story Mode arena so can be deferred.

---

### Robert's Castle Interior Arena
- **Shape**: rectangular
- **Dimensions**: 28 cm, stone walls at height ~800 mm (unscalable), no pockets
- **Key Features**: Very tall walls, no ring-out, polished stone floor, no pockets
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Rectangle shape | `shape: "square"` | ✅ approximation | No `"rectangle"` but `"square"` at non-equal sides would work |
  | Tall walls | `wall.bowlProfile:"steep"` + very tall segments | Effective ring-out blocked | Steep profile + wall height configuration |
  | No pockets | `pits: []` | empty ✅ | |
  | Stone friction | `floorHazardZones[]` | mild friction increase | Not a standard feature but no explicit floor-friction field in ArenaConfig |
  | No ring-out win | **NOT IN ArenaConfig** | `winConditions:["spin_out","burst","ko_by_impact"]` | ArenaConfig has no win condition override |
- **Special Mechanic**: No ring-out at all. Win only by spin-out or KO-by-impact. Favours stamina.
- **Engine Status**: GAP. Wall height sufficient to block ring-out can be approximated with very high `wall` damage/recoil. Win condition overriding (no ring-out) is not in ArenaConfig.

---

### Robert's Olympia Coliseum
- **Shape**: circular
- **Dimensions**: 40 cm, deep pit (80 mm depth), 4 pockets, 8 Greek column obstacles at perimeter
- **Key Features**: 4 pockets, 8 column obstacles near rim, deeper bowl than usual
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 8 pillars | `obstacles[]` | 8 × circles at r=155mm ring | ✅ |
  | 4 pockets | `pits[]` | NESW | ✅ |
  | Deep bowl | `wall.bowlProfile:"deep"` | 60° slope | ✅ |
- **Special Mechanic**: Greek columns near rim create an orbital obstacle ring. Deep bowl keeps beys fighting longer before ring-out.
- **Engine Status**: Fully implementable. All features map to existing schema. No gaps.

---

### Balkov Abbey Battle Chamber
- **Shape**: rectangular/walled
- **Dimensions**: 30 cm, stone walls at 120 cm height (no ring-out), 4 spike pockets
- **Key Features**: 4 narrow spike-bottomed pockets (instant KO), stone walls block ring-out, dim lighting, polished stone floor
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Spike pockets | `pits[]` | 4 × `spike_pocket` kind | PitConfig has no `kind` discriminator — need `kind:"spike"` for instant-KO vs normal escape-chance pit |
  | Stone walls | `wall` extreme height | `ringoutBoundaryScale: 0.0` | Force-blocking all ring-out |
  | Stone floor friction | `floorHazardZones[]` | very mild mud zone | Polished stone = 1.1× friction — minor |
  | Dim lighting | `theme:"haunted_factory"` | closest dark theme | No `lighting` field in ArenaConfig |
  | No ring-out | — | blocked by walls | |
- **Special Mechanic**: Spike pockets are instant-KO (vs normal pits where the bey has an escape chance). Antagonist-coded: no mercy.
- **Engine Status**: PARTIAL GAP. Existing `PitConfig` has `spinDamagePerSecond` and `escapeChance` but no `kind:"spike"` for instant-KO behavior. This requires adding a `spiked: boolean` flag to PitConfig. Wall height blocking ring-out: workaround with very high wall damage that instantly destroys the bey on contact (not ideal). Win condition override: same gap as Robert's castle.

---

### Frozen Lake Baikal
- **Shape**: open terrain (flat, unlimited radius)
- **Dimensions**: ~4000×4000 mm soft boundary
- **Key Features**: Ice surface (friction 0.3×), no walls, no pockets, dynamic crack pits forming from impacts
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Ice friction | `floorHazardZones[]` | `hazardType:"ice"` covering full arena | `frictionMultiplier: 0.05` gives very low friction ✅ |
  | No walls | `wall.enabled: false` | ✅ | |
  | Open terrain shape | `shape: "circle"` at large radius | No `"open_terrain"` shape | Use very large circular arena |
  | Dynamic crack pits | **NOT IN ArenaConfig** | `crackingEnabled: true` + dynamic pit spawning | ArenaConfig has static `pits[]` only; dynamic pit generation from impacts is a new mechanic |
  | Soft boundary | `shrink` or large radius | approximation | No native `playAreaMm` open boundary |
- **Special Mechanic**: Cracking mechanic — heavy impact accumulates `crackRiskMap`; at >70% a crack opens as a new pit (instant-KO void). This is a dynamic, stateful arena feature not achievable with static `pits[]`.
- **Engine Status**: CRITICAL GAP. Static ice `floorHazardZones[]` covers the friction. Dynamic crack generation (pits spawning mid-match from impact accumulation) is NOT in ArenaConfig or ArenaFeatureProcessor. Would require a new `dynamicPitSystem` in ArenaConfig + an impact-accumulation tracker in the physics room.

---

### World Championship Official Stadium
- **Shape**: circular
- **Dimensions**: 38 cm battle zone, 4 pockets (NESW), low central rise, tall walls (120 mm)
- **Key Features**: 4 pockets, low central rise (precursor of BB-10 ridge), tall walls, accepts `StadiumTransform`
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | NESW | ✅ |
  | Low central rise | `elevationZones[]` | small spin zone at center | Mild stamina bonus ✅ |
  | Tall walls | `wall.bowlProfile:"deep"` | 60° steep | ✅ |
  | Stadium transforms | **NOT IN ArenaConfig** | `acceptsStadiumTransforms: true` + `activeTransforms[]` | No mid-match arena parameter mutation system |
- **Special Mechanic**: Primary mechanism for Tala's Ice Prison (Wolborg Novae Rog). Arena transforms mid-battle. Also serves as the base for Wilderness Stadium and Justice Five Stadium (both alias of this).
- **Engine Status**: Standard features implementable. `StadiumTransform` system (mid-match arena mutation: ice walls rise, friction changes, pockets seal) is NOT in ArenaConfig. This is a major extension unique to Story Mode boss fights.

---

### Wolborg Ice Prison Dimension (StadiumTransform)
- **Shape**: transform overlay applied on top of base stadium
- **Dimensions**: transforms the World Championship Stadium
- **Key Features**: Ice walls (80 cm) rise from rim blocking ring-out; floor becomes ice (friction 0.2×); pockets seal; Wolborg orbit generates spin-damage DoT; ice mist reduces visibility
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Ice floor | `floorHazardZones[]` | `hazardType:"ice"` full area | ✅ |
  | Rising ice walls | **NOT IN ArenaConfig** | `StadiumTransform.delta.walls` | Mid-match wall mutation |
  | Sealed pockets | **NOT IN ArenaConfig** | `StadiumTransform.delta.pockets:"sealed"` | No pocket-sealing mid-match |
  | Orbit DoT aura | **NOT IN ArenaConfig** | `StadiumTransform.delta.ambient.auraDoTPerTick` | No per-tick spin-damage aura from orbiting bey |
  | Break conditions | **NOT IN ArenaConfig** | `StadiumTransform.breakConditions[]` | No special-move counter-break system |
- **Special Mechanic**: This is the canonical reference for `StadiumTransform` — a mid-battle arena mutation triggered by a special move. Technically not a separate arena but a runtime modifier applied to the base stadium. The engine currently has no such mechanism.
- **Engine Status**: CRITICAL GAP. This mechanic does not exist in any current system. It would require a new `StadiumTransform` interface + the ability to mutate ArenaConfig fields mid-match in the room. Purely for Story Mode / cinematic bosses.

---

### Battle Tower (V-Force)
- **Shape**: chain of 5 distinct arena defs
- **Dimensions**: varies per floor
- **Key Features**: Floor 1: gauntlet (4 enemy beys); Floor 3: triangular dish (3-way); Floor 4: spike-floor hazards; Floor 5: collapsing-tile arena
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Multi-floor chain | **NOT IN ArenaConfig** | `StadiumChain` extension | ArenaConfig is one arena at a time |
  | Spike floor hazards | `floorHazardZones[]` | multiple `hazardType:"trampoline"` or custom | Spikes on contact deal damage + redirect; closest analog is trampoline (pop-up) or obstacle with damage |
  | Triangular shape | `shape: "triangle"` | ✅ | ArenaShape has `"triangle"` |
  | Collapsing tiles | **NOT IN ArenaConfig** | `dynamicFloor.collapseRule:"tile_grid"` | No dynamic floor collapse in ArenaConfig |
  | Battle Royale (Floor 1) | `beySpawn[]` | 4 AI beys as enemies | `beySpawn` config handles NPC beys ✅ |
- **Special Mechanic**: Dungeon-style sequential stadium chain. Floor 5 (collapsing arena) is the most mechanically unique: tiles fall away randomly over time converting floor to void pits.
- **Engine Status**: MIXED. Triangle shape ✅. 3-way battle on triangle ✅ (Colyseus supports 2–4 players). Spike hazards: approximate via obstacle damage + recoil ✅. Collapsing floor: NOT IN ArenaConfig — requires `dynamicFloor` extension. Story Mode chain progression: not in ArenaConfig (handled at match/room level).

---

### Abandoned Roller Coaster Arena
- **Shape**: rail network (non-arena topology entirely)
- **Dimensions**: multi-segment rail track
- **Key Features**: Rails as the floor surface; loops, banked turns, junctions; off-rail = ring-out
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Rails as floor | **NOT IN ArenaConfig** | `RailNetworkArena` schema | Completely different physics model |
  | Loops with min velocity | **NOT IN ArenaConfig** | `loopMinSpeedMmPerTick` | Loop traversal physics |
  | Rail junctions | **NOT IN ArenaConfig** | `junctions[]` | Multi-path branching |
- **Special Mechanic**: The earliest rails-as-arena concept in the canon. Predates Gen 3 SlingShock by 15 years. Requires a fundamentally different physics model: beys constrained to rail curves rather than free in a bowl.
- **Engine Status**: CRITICAL GAP. Requires `RailNetworkArena` schema — an entirely new arena type that is incompatible with the current `ArenaConfig` bowl model. Cannot be approximated with existing schema.

---

### Ayers Rock Stadium
- **Shape**: open terrain (polygon boundary, ~5000×5000 mm)
- **Dimensions**: large flat rock platform, polygon eroded edge
- **Key Features**: No walls, no pockets, sandstone surface (1.0× friction), 3 random sand-patch slip zones (0.4× friction), sun glare visibility reduction
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Sand patches (slip zones) | `floorHazardZones[]` | `hazardType:"ice"` at 3 positions | `frictionMultiplier: 0.4` = slippery ✅ |
  | No walls | `wall.enabled: false` | ✅ | |
  | Sun glare | `environmentalEffect` | custom — no `sunGlare` preset | `"storm"` and `"blizzard"` exist but no sun-glare |
  | Polygon boundary | **NOT IN ArenaConfig** | `ringoutBoundaryShape:"polygon"` | Standard ArenaConfig uses circular arena |
  | Open terrain | `shape: "circle"` at large radius | approximation | No `"open_terrain"` shape |
- **Special Mechanic**: Random slip zones (low-friction sand patches) scattered across a large flat rock platform. Sun glare reduces visibility from one direction.
- **Engine Status**: PARTIAL GAP. Slip zones via `floorHazardZones[]` ✅. Polygon ring-out boundary not in ArenaConfig. Sun glare not in environmental presets (would need custom addition). Open terrain approximated by very large circle.

---

### Wilderness Stadium
- **Shape**: circular (pit); large natural rock amphitheater as backdrop (visual only)
- **Dimensions**: 40 cm pit, 4 pockets, low central rise
- **Key Features**: Mechanically identical to World Championship Stadium; rock formations as visual backdrop
- **Arena Feature Mapping**: Identical to `anime-world-championship-stadium`. `aliasOf` pattern.
- **Special Mechanic**: The natural rock amphitheater is purely cinematic. Pit mechanics = World Championship.
- **Engine Status**: Fully implementable as an alias with different theme/background. No engine gaps beyond what World Championship Stadium has.

---

### Red Dragon Stadium
- **Shape**: circular
- **Dimensions**: 36 cm, 4 pockets, 75 mm pit depth
- **Key Features**: 4 pockets, asymmetric serpentine dragon-spine obstacle (raised ~15 mm above floor, curved polyline from wall to wall)
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | NESW | ✅ |
  | Dragon spine obstacle | `obstacles[]` | `shape: {kind:"polyline", points:[...], thicknessCm:1.2}` | `ObstacleShape` has `"polyline"` ✅ |
  | Spine damage on contact | `obstacles[].damage` | "medium" | ✅ standard obstacle damage |
- **Special Mechanic**: Curved serpentine polyline obstacle divides the pit asymmetrically. Beys orbiting east-west cross the spine each lap; north orbit avoids it. Strategic obstacle navigation.
- **Engine Status**: Fully implementable. `ObstacleShape.kind:"polyline"` supports the curved spine. Standard `damage` field handles impact damage. No gaps.

---

### BEGA Main Stadium
- **Shape**: circular
- **Dimensions**: 36 cm, 4 pockets, acrylic LED walls
- **Key Features**: 4 pockets, low central rise, acrylic walls with LED feedback, 3 spectator tiers
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | NESW | ✅ |
  | Low central rise | `elevationZones[]` | center zone | ✅ |
  | LED wall feedback | **NOT IN ArenaConfig** | cinematic metadata | Visual-only; no gameplay effect |
  | Bowl | `wall.bowlProfile:"deep"` | ✅ | |
- **Special Mechanic**: LED walls flash colors on game events (burst/KO/spin win). Purely cinematic; mechanically standard tournament bowl. Includes a smaller training sub-arena (HQ interior, 30 cm, 2 pockets).
- **Engine Status**: Mechanically fully implementable. LED visual feedback not in ArenaConfig — would be client-side theme decoration.

---

### Justice Five Tournament Stadium
- **Shape**: circular
- **Dimensions**: 38 cm (alias of World Championship Stadium)
- **Key Features**: Mechanically identical to World Championship; holographic scoreboards, TV-broadcast lighting, boss-tournament chain
- **Arena Feature Mapping**: Alias of `anime-world-championship-stadium`.
- **Special Mechanic**: Story-Mode boss tournament: 5 sequential 1v1 matches vs BEGA roster. Match chain is room/matchmaking logic, not ArenaConfig.
- **Engine Status**: Mechanically fully implementable as alias. Boss-match chain is handled by tournament logic, not arena schema.

---

### Battle Bladers Stadium
- **Shape**: circular (colosseum-scaled BB-10)
- **Dimensions**: 100 cm (anime-scaled), 8 pockets, colosseum spectator tiers
- **Key Features**: Scaled-up BB-10 topology (8 pockets, tornado ridge), 4 spectator tiers, camera mounts, theatrical bit-beast auras
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 8 pockets | `pits[]` | 8 × at 45° | ✅ same as BB-10 |
  | Large scale | `width: 1000, height: 1000` | Large ARENA_RESOLUTION | Can set large dimensions |
  | Tornado ridge | `elevationZones[]` | large center zone | ✅ |
  | Spectator tiers | theme/cinematic | purely visual | No gameplay effect |
- **Special Mechanic**: Same mechanics as BB-10 but at colosseum scale. L-Drago Destructor absorbing dark power from spectators is anime-narrative only.
- **Engine Status**: Fully implementable. Colosseum scale just requires a larger arena config. No engine gaps.

---

### Survival Battle Tournament Arena
- **Shape**: circular
- **Dimensions**: 60 cm, 12 pockets at 30° increments, large tornado ridge (22 cm), 8 spawn points
- **Key Features**: 12 pockets, 8 spawn points, large battle-royale scale
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 12 pockets | `pits[]` | 12 × at 30° increments | ✅ |
  | 8 spawn points | **NOT IN ArenaConfig** | `spawnPoints[]` extension | ArenaConfig has no spawn-point positioning field |
  | Battle Royale mode | `beySpawn[]` | AI beys as opponents | `beySpawn` handles NPC spawning ✅ |
  | Large ridge | `elevationZones[]` | r=110mm | ✅ |
- **Special Mechanic**: Battle-royale reference arena: 8 simultaneous beys. `BattleRoom` already supports up to 4 players + AI; this would require a Battle Royale room mode with expanded player count.
- **Engine Status**: PARTIAL GAP. Arena geometry implementable. Spawn point positioning not in ArenaConfig. Battle Royale room with 8 simultaneous beys is a room-mode extension, not an ArenaConfig issue.

---

### Hyper Wrap Stadium
- **Shape**: circular
- **Dimensions**: 32 cm, 4 narrow pockets (N×2, S×2), vertical hard rim, textured high-friction floor
- **Key Features**: High-friction textured floor (1.5×), vertical walls that rebound instead of allowing ring-out, 4 narrow pockets
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 narrow pockets | `pits[]` | 2N + 2S | angleDeg 75/105/255/285, mouth ~18mm |
  | High-friction floor | `floorHazardZones[]` | `hazardType:"mud"` full area, mult ~1.5 | Mud = high friction ✅ |
  | Vertical wall rebound | `wall.bowlProfile:"flat"` | 0° = vertical walls | Vertical walls send bey back inward rather than out ✅ |
- **Special Mechanic**: High-friction floor makes stamina types spin out faster; vertical walls amplify impact returns. Favours upper-attack beys (quick KOs vs prolonged orbits).
- **Engine Status**: Implementable. `floorHazardZones[]` with mild `mud` type for friction increase. `bowlProfile:"flat"` for vertical walls. Narrow pocket positions via standard `pits[]`. No new schema required.

---

### IBC Arena Complex
- **Shape**: multi-stadium complex (3 group courts + main finals)
- **Dimensions**: group courts = B-09 standard (31 cm each); finals court = 38 cm
- **Key Features**: 3 parallel group-stage arenas + 1 finals arena, holographic group standings banners, multi-camera rendering
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | Group courts | `isMultiStadium` / separate arena docs | Each court = separate ArenaConfig | No multi-stadium complex wrapper in ArenaConfig |
  | Parallel matches | **NOT IN ArenaConfig** | tournament room coordination | Handled by Tournament system, not ArenaConfig |
  | Finals court | separate ArenaConfig | `tt-b09-burst-standard` variant | ✅ |
- **Special Mechanic**: Multi-match parallel tournament layout. Three simultaneous group matches feed into one finals court. Tournament mode architecture — not an ArenaConfig concern.
- **Engine Status**: Each individual court is a standard Burst stadium (fully implementable). The multi-stadium tournament wrapper is handled by the existing tournament system. No ArenaConfig gaps.

---

### Hyper Stadium (Battle Island Championship)
- **Shape**: circular
- **Dimensions**: 42 cm, 4 pockets, vertical wall 6 cm, tornado ridge 14 cm, brink at 38 cm diameter
- **Key Features**: HyperSphere-compatible vertical inner wall (6 cm), 4 pockets, tornado ridge, elevated outdoor setting
- **Arena Feature Mapping**:
  | Feature | ArenaConfig field | Value | Notes |
  |---|---|---|---|
  | 4 pockets | `pits[]` | NESW | ✅ |
  | Tornado ridge | `elevationZones[]` | center r=70mm | ✅ |
  | Vertical inner wall | **NOT IN ArenaConfig** | `wallClimbZones[]` (proposed) | Same gap as standalone HyperSphere stadium |
  | Larger dimensions | `width: 1008, height: 1008` | 42 cm = 1008px at 24px/cm | ✅ |
- **Special Mechanic**: Hybrid arena: standard Burst beys play in the floor bowl; HyperSphere beys can additionally climb the vertical wall to the brink for drop attacks. Two active play zones (floor + brink).
- **Engine Status**: Standard pit/ridge features fully implementable. Vertical wall climb: same CRITICAL GAP as HyperSphere Beystadium — requires Phase A.3 `WallClimbSystem`.

---

## Feature Type Coverage Table

| Feature Type | ArenaConfig field | Runtime Processor | executeBehavior() dispatch | Engine Status |
|---|---|---|---|---|
| Speed boost paths / rails | `speedPaths[]` (alias `loops[]`) | `checkLoopCollision` + `applyLoopBoost` | N/A | Complete |
| Obstacles (standard) | `obstacles[]` | `checkObstacleCollision` + `applyKnockback` | optional `movement.orbit` | Complete |
| Obstacles (magnetic) | `obstacles[].physics.type:"magnetic"` | `processMagnets()` | optional `movement.orbit` | Complete |
| Obstacles (electrified) | `obstacles[].physics.type:"electrified"` | `processElectrified()` | optional `movement.orbit` | Complete |
| Obstacles (spinner) | `obstacles[].physics.type:"spinner"` | `processSpinners()` | optional `movement.orbit` | Complete |
| Obstacles (sticky) | `obstacles[].physics.type:"sticky"` | `processSticky()` | optional `movement.orbit` | Complete |
| Obstacles (crusher) | `obstacles[].physics.type:"crusher"` | `processCrushers()` | optional `movement.orbit` | Complete |
| Obstacles (ramp) | `obstacles[].physics.type:"ramp"` | `processRamps()` | optional `movement.orbit` | Complete |
| Obstacles (ledge) | `obstacles[].physics.type:"ledge"` | `processLedges()` | optional `movement.orbit` | Complete |
| Obstacles (wrecking_ball) | `obstacles[].shape.kind:"wrecking_ball"` | `processWreckingBalls()` | optional `movement.orbit` | Complete |
| Pits (escape) | `pits[]` | `checkPitCollision` | N/A | Complete |
| Pits (spike/instant-KO) | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP — needs `spiked: boolean` on PitConfig |
| Water bodies | `waterBodies[]` | `checkWaterCollision` + `applyWaterResistance` | N/A | Complete |
| Portals | `portals[]` | `setPosition()` via bridge | N/A | Complete |
| Turrets | `turrets[]` | TurretProcessor (separate) | N/A | Complete |
| Switches | `switches[]` | SwitchConfig.targets[] state machine | N/A | Complete |
| Gravity wells | `gravityWells[]` | inline in `processArenaFeatures` | `movement.orbit` | Partial — orbit only dispatched |
| Spin zones | `spinZones[]` | inline in `processArenaFeatures` | `movement.orbit` | Partial — orbit only dispatched |
| Bumps | `bumps[]` | inline in `processArenaFeatures` | optional `movement.orbit` | Complete |
| Trigger zones | `triggerZones[]` | NOT YET CALLED in processArenaFeatures | `movement.orbit` ONLY | CRITICAL GAP — zone kinds (damage/heal/KO/etc.) not dispatched |
| Floor hazard zones | `floorHazardZones[]` | `processFloorHazardZones()` | N/A | Complete (13 hazard types) |
| Effect zones | `effectZones[]` | `processEffectZones()` | N/A | Complete |
| Elevation zones | `elevationZones[]` | `processElevationZones()` | N/A | Complete |
| Environmental effects | `environmentalEffect` | `applyEnvironmentalEffects()` | N/A | Complete (storm/blizzard/volcanic/underwater/earthquake) |
| Arena links (corridor/ramp) | `links[]` | types defined, partial physics | N/A | Partial |
| Bey links | `beyLinks[]` | types defined, partial physics | N/A | Partial |
| Arena shrink | `shrink` | types defined | N/A | Partial |
| Arena timeline | `arenaTimeline[]` | types defined | N/A | Partial |
| Background particles | `backgroundParticles` | client-only rendering | N/A | Visual only |
| Dynamic tilt (Zero-G) | `tiltAngle`, `tiltDirection`, `tiltMode`, `tiltPivotX/Y`, `tiltOscillate*`, `autoTilt`, `tiltSpeed` | `advanceArenaTilt()` + `applyWeightTilt()` + `computeTiltForce()` | N/A | **IMPLEMENTED** (session 10) — fixed/oscillate/weight modes; ±15° weight-COM for Zero-G BB-G04 via `tiltMode:"weight"` + `tiltOscillateMax:15` |
| Wall climb / sphere orbit | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | CRITICAL GAP |
| Tiered rebound walls | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Stadium transforms (mid-match) | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | CRITICAL GAP |
| Dynamic floor collapse | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Dynamic crack pits (ice) | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | CRITICAL GAP |
| Rail network arena | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | CRITICAL GAP |
| Non-circular ring-out boundary | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Polygon arena boundary | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Exit zone scoring (3pt/2pt) | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP (for BX scoring) |
| Global stamina drain multiplier | `staminaDrainMultiplier` | applied in room tick per-bey | N/A | **IMPLEMENTED** (session 13) — 0.25×–4.0× multiplier on spin decay; admin UI slider in BasicsTab Physics panel |
| Infinity Dash compound loop | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Background / floor color override | `backgroundColor`, `floorColor` | client renderer reads at load | N/A | **IMPLEMENTED** (session 13) — per-arena hex color overrides; admin UI color pickers in BasicsTab Visual Overrides panel |
| QTE enable / window scaling | `qteEnabled`, `qteWindowScaling` | combo/special activation gate in room | N/A | **IN SCHEMA** (session 13) — admin UI toggle + flat/by_cost selector in BasicsTab Physics panel |
| Random match modifiers | `randomModifiers`, `maxModifiers` | modifier picker at match start | N/A | **IN SCHEMA** (session 13) — admin UI toggle + max-stacked input in BasicsTab Physics panel |
| Sun glare environmental | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP (visual) |
| Gear rail compatibility gate | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | Simplified-away |
| Per-bey driver compatibility | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | Simplified-away |
| Win condition override | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP (Story Mode) |
| Spawn points (BR) | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |
| Multi-arena twin layout | NOT IN SCHEMA | NOT IMPLEMENTED | N/A | GAP |

---

## Arena → ArenaConfig JSON Skeletons

### Gen 1 — Spin Stadium
```json
{
  "id": "tt-a1-spin-stadium",
  "name": "Spin Stadium",
  "shape": "circle",
  "width": 528,
  "height": 528,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "glow",
    "exitColor": "#ef4444",
    "baseDamage": 3,
    "recoilDistance": 1.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "penalty_n", "type": "edge", "position": { "x": 0, "y": -60 }, "radius": 0.9, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.5, "angle": 90 },
    { "id": "penalty_s", "type": "edge", "position": { "x": 0, "y": 60 }, "radius": 0.9, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.5, "angle": 270 }
  ],
  "difficulty": "easy"
}
```

### Gen 1 — Magnacore Stadium
```json
{
  "id": "tt-a65-magnacore-stadium",
  "name": "Magnacore Stadium",
  "shape": "circle",
  "width": 672,
  "height": 672,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "glow",
    "exitColor": "#ef4444",
    "baseDamage": 3,
    "recoilDistance": 1.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "penalty_e", "type": "edge", "position": { "x": 100, "y": 0 }, "radius": 1.1, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.5, "angle": 0 },
    { "id": "penalty_w", "type": "edge", "position": { "x": -100, "y": 0 }, "radius": 1.1, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.5, "angle": 180 }
  ],
  "obstacles": [
    { "id": 1, "x": 70, "y": 70, "radius": 24, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "physics": { "type": "magnetic", "heightCm": 1, "magnetRadiusCm": 50, "magnetStrength": 5 } },
    { "id": 2, "x": -70, "y": 70, "radius": 24, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "physics": { "type": "magnetic", "heightCm": 1, "magnetRadiusCm": 50, "magnetStrength": -5 } },
    { "id": 3, "x": 70, "y": -70, "radius": 24, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "physics": { "type": "magnetic", "heightCm": 1, "magnetRadiusCm": 50, "magnetStrength": -5 } },
    { "id": 4, "x": -70, "y": -70, "radius": 24, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "physics": { "type": "magnetic", "heightCm": 1, "magnetRadiusCm": 50, "magnetStrength": 5 } }
  ],
  "difficulty": "medium"
}
```

### Gen 2 — BB-10 Attack Type Beystadium
```json
{
  "id": "tt-bb10-attack-stadium",
  "name": "Attack Type Beystadium (BB-10)",
  "shape": "circle",
  "width": 816,
  "height": 816,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p0",   "type": "edge", "position": { "x": 155, "y": 0 },    "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 0 },
    { "id": "p45",  "type": "edge", "position": { "x": 110, "y": 110 },  "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 45 },
    { "id": "p90",  "type": "edge", "position": { "x": 0, "y": 155 },    "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 90 },
    { "id": "p135", "type": "edge", "position": { "x": -110, "y": 110 }, "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 135 },
    { "id": "p180", "type": "edge", "position": { "x": -155, "y": 0 },   "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 180 },
    { "id": "p225", "type": "edge", "position": { "x": -110, "y": -110 },"radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 225 },
    { "id": "p270", "type": "edge", "position": { "x": 0, "y": -155 },   "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 270 },
    { "id": "p315", "type": "edge", "position": { "x": 110, "y": -110 }, "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 315 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 7, "heightCm": 2, "spinBoostPercent": 5 }
  ],
  "difficulty": "medium"
}
```

### Gen 2.5 — Zero-G Stadium (tiltMechanic MISSING — skeleton only)
```json
{
  "id": "tt-bbg04-zerog-stadium",
  "name": "Zero-G Attack Type Beystadium",
  "shape": "circle",
  "width": 768,
  "height": 768,
  "theme": "futuristic",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "edge", "position": { "x": 0, "y": 145 },  "radius": 1.25, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 90 },
    { "id": "p_s", "type": "edge", "position": { "x": 0, "y": -145 }, "radius": 1.25, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 270 }
  ],
  "elevationZones": [
    { "id": "ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 5, "heightCm": 1, "spinBoostPercent": 3 }
  ],
  "difficulty": "hard"
}
```
> NOTE: `tiltMechanic` field is NOT in current ArenaConfig schema. Dynamic bowl tilting must be added as an engine extension before this stadium can be fully implemented.

### Gen 3 — Burst Beystadium Standard Type
```json
{
  "id": "tt-b09-burst-standard",
  "name": "Beystadium Standard Type",
  "shape": "circle",
  "width": 744,
  "height": 744,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "edge", "position": { "x": 0, "y": 140 },   "radius": 1.33, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 90 },
    { "id": "p_e", "type": "edge", "position": { "x": 140, "y": 0 },   "radius": 1.33, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 0 },
    { "id": "p_s", "type": "edge", "position": { "x": 0, "y": -140 },  "radius": 1.33, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "edge", "position": { "x": -140, "y": 0 },  "radius": 1.33, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 180 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 7, "heightCm": 2, "spinBoostPercent": 5 }
  ],
  "difficulty": "medium"
}
```

### Gen 4 — Xtreme Stadium (BX-10)
```json
{
  "id": "tt-bx-10-xtreme-stadium",
  "name": "Xtreme Stadium",
  "shape": "square",
  "width": 876,
  "height": 876,
  "theme": "futuristic",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [
      { "walls": [{ "width": 100, "thickness": 1, "position": 0 }] },
      { "walls": [{ "width": 38, "thickness": 1, "position": 31 }] },
      { "walls": [{ "width": 100, "thickness": 1, "position": 0 }] },
      { "walls": [{ "width": 38, "thickness": 1, "position": 31 }] }
    ],
    "wallStyle": "metal",
    "exitStyle": "glow",
    "exitColor": "#00ff88",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [
    {
      "id": 1,
      "radius": 17,
      "shape": "circle",
      "speedBoost": 1.5,
      "spinBoost": 0,
      "renderStyle": "outline"
    }
  ],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "xtreme", "type": "edge", "position": { "x": 0, "y": -182 }, "radius": 3.96, "depth": 5, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 270 },
    { "id": "over_left",  "type": "edge", "position": { "x": -130, "y": -182 }, "radius": 2.5, "depth": 5, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 240 },
    { "id": "over_right", "type": "edge", "position": { "x": 130, "y": -182 },  "radius": 2.5, "depth": 5, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 300 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 10.5, "heightCm": 2.5, "spinBoostPercent": 4 }
  ],
  "difficulty": "medium"
}
```

### Anime — Frozen Lake Baikal (ice floor + static pits approximation)
```json
{
  "id": "anime-frozen-lake-baikal",
  "name": "Frozen Lake Baikal",
  "shape": "circle",
  "width": 1080,
  "height": 1080,
  "theme": "frozen_tundra",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "flat",
  "wall": {
    "enabled": false,
    "edges": [],
    "wallStyle": "stone",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 0,
    "recoilDistance": 0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [],
  "floorHazardZones": [
    {
      "id": "ice_surface",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 45,
      "hazardType": "ice",
      "frictionMultiplier": 0.05,
      "activeByDefault": true
    }
  ],
  "environmentalEffect": { "preset": "blizzard", "intensity": 0.3 },
  "backgroundParticles": { "type": "snow", "density": 25, "direction": 10 },
  "difficulty": "hard"
}
```

### Anime — Asian Tournament Desert Stadium
```json
{
  "id": "anime-asian-tournament-desert",
  "name": "Asian Tournament Desert Stadium",
  "shape": "circle",
  "width": 768,
  "height": 768,
  "theme": "desert",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 4,
    "recoilDistance": 1.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "edge", "position": { "x": 0, "y": 140 },  "radius": 1.1, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.4, "angle": 90 },
    { "id": "p_s", "type": "edge", "position": { "x": 0, "y": -140 }, "radius": 1.1, "depth": 3, "spinDamagePerSecond": 20, "escapeChance": 0.4, "angle": 270 }
  ],
  "floorHazardZones": [
    {
      "id": "sand_floor",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 32,
      "hazardType": "mud",
      "intensity": 1.0,
      "activeByDefault": true
    }
  ],
  "difficulty": "medium"
}
```

### Anime — Balkov Abbey Battle Chamber
```json
{
  "id": "anime-balkov-abbey-chamber",
  "name": "Balkov Abbey Battle Chamber",
  "shape": "square",
  "width": 720,
  "height": 720,
  "theme": "haunted_factory",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "flat",
  "wall": {
    "enabled": true,
    "edges": [
      { "walls": [{ "width": 85, "thickness": 3, "position": 7 }] },
      { "walls": [{ "width": 85, "thickness": 3, "position": 7 }] },
      { "walls": [{ "width": 85, "thickness": 3, "position": 7 }] },
      { "walls": [{ "width": 85, "thickness": 3, "position": 7 }] }
    ],
    "wallStyle": "stone",
    "exitStyle": "glow",
    "exitColor": "#880000",
    "baseDamage": 8,
    "recoilDistance": 1,
    "hasSpikes": false,
    "spikeDamageMultiplier": 2.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_ne", "type": "edge", "position": { "x": 103, "y": 103 },   "radius": 0.83, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 45 },
    { "id": "p_se", "type": "edge", "position": { "x": 103, "y": -103 },  "radius": 0.83, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 315 },
    { "id": "p_sw", "type": "edge", "position": { "x": -103, "y": -103 }, "radius": 0.83, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 225 },
    { "id": "p_nw", "type": "edge", "position": { "x": -103, "y": 103 },  "radius": 0.83, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0, "angle": 135 }
  ],
  "floorHazardZones": [
    { "id": "stone_floor", "x_cm": 0, "y_cm": 0, "radius_cm": 30, "hazardType": "mud", "intensity": 0.1, "activeByDefault": true }
  ],
  "difficulty": "hard"
}
```

### Anime — World Championship Official Stadium
```json
{
  "id": "anime-world-championship-stadium",
  "name": "World Championship Official Stadium",
  "shape": "circle",
  "width": 912,
  "height": 912,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 6,
    "recoilDistance": 2.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "edge", "position": { "x": 0, "y": 165 },   "radius": 1.25, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 90 },
    { "id": "p_e", "type": "edge", "position": { "x": 165, "y": 0 },   "radius": 1.25, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 0 },
    { "id": "p_s", "type": "edge", "position": { "x": 0, "y": -165 },  "radius": 1.25, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "edge", "position": { "x": -165, "y": 0 },  "radius": 1.25, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 180 }
  ],
  "elevationZones": [
    { "id": "central_rise", "x_cm": 0, "y_cm": 0, "radius_cm": 6, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "difficulty": "hard"
}
```

### Anime — Red Dragon Stadium
```json
{
  "id": "anime-red-dragon-stadium",
  "name": "Red Dragon Stadium",
  "shape": "circle",
  "width": 864,
  "height": 864,
  "theme": "ancient_temple",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "edge", "position": { "x": 0, "y": 145 },   "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 90 },
    { "id": "p_e", "type": "edge", "position": { "x": 145, "y": 0 },   "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 0 },
    { "id": "p_s", "type": "edge", "position": { "x": 0, "y": -145 },  "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "edge", "position": { "x": -145, "y": 0 },  "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 180 }
  ],
  "obstacles": [
    {
      "id": 1,
      "x": 0,
      "y": 0,
      "radius": 0,
      "health": 9999,
      "damage": 15,
      "recoilDistance": 10,
      "indestructible": true,
      "shape": {
        "kind": "polyline",
        "points": [
          { "x_cm": -13.5, "y_cm": -2 },
          { "x_cm": -8, "y_cm": 3 },
          { "x_cm": 0, "y_cm": -2 },
          { "x_cm": 8, "y_cm": 3 },
          { "x_cm": 13.5, "y_cm": -2 }
        ],
        "thicknessCm": 1.2,
        "closed": false
      },
      "physics": { "type": "wall", "heightCm": 1.5 }
    }
  ],
  "difficulty": "hard"
}
```

### Anime — Survival Battle Tournament Arena (Battle Royale reference)
```json
{
  "id": "anime-survival-battle-stadium",
  "name": "Survival Battle Tournament Arena",
  "shape": "circle",
  "width": 1080,
  "height": 1080,
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_0",   "type": "edge", "position": { "x": 275, "y": 0 },   "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 0 },
    { "id": "p_30",  "type": "edge", "position": { "x": 238, "y": 137 },  "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 30 },
    { "id": "p_60",  "type": "edge", "position": { "x": 137, "y": 238 },  "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 60 },
    { "id": "p_90",  "type": "edge", "position": { "x": 0, "y": 275 },   "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 90 },
    { "id": "p_120", "type": "edge", "position": { "x": -137, "y": 238 }, "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 120 },
    { "id": "p_150", "type": "edge", "position": { "x": -238, "y": 137 }, "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 150 },
    { "id": "p_180", "type": "edge", "position": { "x": -275, "y": 0 },  "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 180 },
    { "id": "p_210", "type": "edge", "position": { "x": -238, "y": -137 },"radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 210 },
    { "id": "p_240", "type": "edge", "position": { "x": -137, "y": -238 },"radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 240 },
    { "id": "p_270", "type": "edge", "position": { "x": 0, "y": -275 },  "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 270 },
    { "id": "p_300", "type": "edge", "position": { "x": 137, "y": -238 }, "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 300 },
    { "id": "p_330", "type": "edge", "position": { "x": 238, "y": -137 }, "radius": 1.17, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 330 }
  ],
  "elevationZones": [
    { "id": "large_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 11, "heightCm": 2.5, "spinBoostPercent": 5 }
  ],
  "beySpawn": {
    "enabled": false,
    "spawnIntervalSec": 0,
    "maxSpawnedBeys": 0,
    "despawnCondition": "knockout",
    "beyPool": []
  },
  "difficulty": "extreme"
}
```

---

## Arena Feature → Mechanic Mapping

| Feature | Current Runtime | Required BehaviorRef | Mechanic ID | Gap? |
|---|---|---|---|---|
| Speed loop / rail boost | `applyLoopBoost()` via `checkLoopCollision` | N/A | `loop_boost` | None |
| Obstacle collision + knockback | `checkObstacleCollision` + `applyKnockback` | optional `movement.orbit` | `obstacle_collision` | None |
| Magnetic attract/repel | `processMagnets()` → `applyForce` | optional `movement.orbit` | `magnetic_force` | None |
| Electrified disable | `processElectrified()` → `controlLockedUntilMs` | optional `movement.orbit` | `electric_disable` | None |
| Spinner spin boost | `processSpinners()` → `beyblade.spin +=` | optional `movement.orbit` | `spinner_boost` | None |
| Sticky freeze | `processSticky()` → `setVelocity(0,0)` | optional `movement.orbit` | `sticky_freeze` | None |
| Crusher extra damage | `processCrushers()` → `beyblade.health -=` | optional `movement.orbit` | `crusher_hit` | None |
| Ramp lateral force | `processRamps()` → `applyForce` | optional `movement.orbit` | `ramp_slide` | None |
| Ledge pop impulse | `processLedges()` → `applyForce` | optional `movement.orbit` | `ledge_pop` | None |
| Wrecking ball swing + hit | `processWreckingBalls()` → `applyKnockback` | optional `movement.orbit` | `wrecking_ball_hit` | None |
| Pit spin damage + escape | `checkPitCollision` → `spin -=` | N/A | `pit_trap` | None |
| Pit instant-KO (spike) | NOT IMPLEMENTED | N/A | `spike_pit_ko` | GAP — needs `spiked: true` on PitConfig |
| Water drag + spin drain | `applyWaterResistance` + `spin -=` | N/A | `water_drag` | None |
| Portal teleport | `setPosition()` | N/A | `portal_teleport` | None |
| Turret projectile damage | TurretProcessor | N/A | `turret_hit` | None |
| Gravity well attraction | inline `applyForce` toward hole center | `movement.orbit` (diverted) | `gravity_pull` | Partial — behaviorId diverts to orbit; non-orbit pull logic still inline |
| Spin zone orbit force | inline `applyForce` tangential | `movement.orbit` (diverted) | `spin_zone_orbit` | Partial — same diversion |
| Spin zone spin top-up | inline `beyblade.spin +=` | N/A | `spin_zone_boost` | None |
| Bump lateral recoil | inline `applyForce` radial | optional `movement.orbit` | `bump_recoil` | None |
| Trigger zone: safe | NOT CALLED | N/A | `trigger_safe` | CRITICAL GAP — trigger zone effects not dispatched |
| Trigger zone: damage | NOT CALLED | N/A | `trigger_damage` | CRITICAL GAP |
| Trigger zone: heal | NOT CALLED | N/A | `trigger_heal` | CRITICAL GAP |
| Trigger zone: KO | NOT CALLED | N/A | `trigger_ko` | CRITICAL GAP |
| Trigger zone: spin-boost | NOT CALLED | N/A | `trigger_spin_boost` | CRITICAL GAP |
| Trigger zone: expel | NOT CALLED | N/A | `trigger_expel` | CRITICAL GAP |
| Trigger zone: speed-scale | NOT CALLED | N/A | `trigger_speed_scale` | CRITICAL GAP |
| Floor hazard: lava | `processFloorHazardZones` → `health -=` | N/A | `lava_burn` | None |
| Floor hazard: electric | `processFloorHazardZones` → `controlLockedUntilMs` | N/A | `electric_zone` | None |
| Floor hazard: time_slow | `processFloorHazardZones` → `applyForce` opposing motion | N/A | `time_slow_zone` | None |
| Floor hazard: repulsion | `processFloorHazardZones` → `applyForce` outward | N/A | `repulsion_zone` | None |
| Floor hazard: drain | `processFloorHazardZones` → `power -=` | N/A | `power_drain_zone` | None |
| Floor hazard: ice | `processFloorHazardZones` → `applyWaterResistance` | N/A | `ice_zone` | None |
| Floor hazard: mud | `processFloorHazardZones` → `applyWaterResistance(2.5)` | N/A | `mud_zone` | None |
| Floor hazard: trampoline | `processFloorHazardZones` → `applyForce(0, -0.1)` | N/A | `trampoline_zone` | None |
| Floor hazard: combo_boost | `processFloorHazardZones` → `power +=` | N/A | `combo_charge_zone` | None |
| Floor hazard: void | `processFloorHazardZones` → `isRingOut = true` | N/A | `void_zone_ko` | None |
| Floor hazard: poison | `processFloorHazardZones` → `health -=` + `spin -=` | N/A | `poison_zone` | None |
| Effect zone: power_charge | `processEffectZones` → `power +=` | N/A | `power_charge_zone` | None |
| Effect zone: spin_recovery | `processEffectZones` → `spin +=` | N/A | `spin_recovery_zone` | None |
| Effect zone: turbo_zone | `processEffectZones` → `applyForce` with velocity | N/A | `turbo_boost_zone` | None |
| Elevation zone spin boost | `processElevationZones` → `spin +=` | N/A | `platform_spin_boost` | None |
| Dynamic bowl tilt | NOT IMPLEMENTED | N/A | `tilt_mechanic` | CRITICAL GAP |
| Wall climb / sphere orbit | NOT IMPLEMENTED | N/A | `wall_climb` | CRITICAL GAP |
| Ice crack generation | NOT IMPLEMENTED | N/A | `ice_crack_pit` | CRITICAL GAP |
| Stadium transform (mid-match) | NOT IMPLEMENTED | N/A | `stadium_transform` | CRITICAL GAP |
| Dynamic floor collapse | NOT IMPLEMENTED | N/A | `floor_collapse_tile` | GAP |

---

## Missing ArenaFeature Dispatch Cases

List of all feature types that need new `executeBehavior()` cases, or new top-level processing calls:

| behaviorId / mechanic | Feature | Handler Logic | Priority |
|---|---|---|---|
| `trigger_zone.damage` | TriggerZoneConfig kind: damage | `health -= zone.perSecond * dt` per bey inside | CRITICAL — existing type, never dispatched |
| `trigger_zone.heal` | TriggerZoneConfig kind: heal | `health += zone.perSecond * dt` per bey inside | CRITICAL |
| `trigger_zone.ko` | TriggerZoneConfig kind: knockout | Start solo-hold timer; if bey holds zone alone for `soloHoldMs` → ring-out | CRITICAL |
| `trigger_zone.spin_boost` | TriggerZoneConfig kind: spin-boost | `spin += zone.perSecond * dt` in direction | CRITICAL |
| `trigger_zone.expel` | TriggerZoneConfig kind: expel | `applyKnockback` radially outward from zone center, `impulseCm` force | CRITICAL |
| `trigger_zone.speed_scale` | TriggerZoneConfig kind: speed-scale | `applyForce` proportional to current velocity × (multiplier - 1) | CRITICAL |
| `trigger_zone.safe` | TriggerZoneConfig kind: safe | Set `isSafe` flag on bey; upstream code skips damage application when flag set | HIGH |
| `movement.pull` | Gravity wells (non-orbit) | Radial attraction force toward center (already done inline; needs behaviorRef variant) | LOW — already inline |
| `movement.repel` | Repulsion zones, magnet S-S | Radial repulsion force away from point | MEDIUM |
| `movement.freeze` | Sticky obstacles (non-orbit override) | `setVelocity(0,0)` + control lock | LOW — already done |
| `tilt_mechanic` | Zero-G Stadium | Per-tick: `Σ(bey_xy × bey_mass)` → normalize → tilt arena normal → recalculate wall bowl forces | HIGH |
| `wall_climb.vertical_inner` | HyperSphere / Battle Island | Detect bey proximity to inner wall edge; if angular vel > threshold → apply centripetal wall force → track brink orbit state | HIGH |
| `spike_pit_ko` | Balkov Abbey, spike floors | On pit entry: if `pit.spiked === true` → immediate `isRingOut = true` (no escape chance roll) | MEDIUM |
| `dynamic_floor_collapse` | Battle Tower Floor 5 | Per-tick grid: increment tile-collapse timer; at threshold convert tile to void `floorHazardZone` | LOW (Story Mode only) |
| `ice_crack_generation` | Frozen Lake Baikal | On heavy impact at location: increment `crackRiskMap[cell]`; at threshold spawn new `pits[]` entry as void | LOW (Story Mode only) |
| `infinity_dash_loop` | BX-46 Infinity Stadium | After second rail engagement within `loopThreshold_ms`: award stacking speed retention bonus | MEDIUM |
| `stadium_transform` | Wolborg Ice Prison, Boss Fights | Swap arena surface params, seal pockets, change wall height at trigger time | LOW (Story Mode only) |
| `environmental.sunGlare` | Ayers Rock | Reduce VFX brightness + player-camera contrast from one direction | LOW (visual only) |
| `spawn_point_resolve` | Survival Battle (BR) | Resolve 8 bey spawn positions from `spawnPoints[]` config | MEDIUM (BR mode) |

---

## Stadium Priority for Implementation

| Priority | Stadium | Reason | Arena Features Used |
|---|---|---|---|
| P1 | **BB-10 Attack Type Beystadium** | Canonical Gen 2 tournament standard; simple 8-pocket + ridge | `pits[]` × 8, `elevationZones[]` × 1 |
| P1 | **Burst Beystadium Standard Type** | Active Gen 3 tournament standard; simplest modern bowl | `pits[]` × 4, `elevationZones[]` × 1 |
| P1 | **Xtreme Stadium (BX-10)** | Active Gen 4 tournament standard; required for Beyblade X mode | `pits[]` × 3, `speedPaths[]` × 1, `elevationZones[]` × 1 |
| P1 | **Spin Stadium (A-1)** | Simplest arena possible; tutorial / beginner | `pits[]` × 2 |
| P2 | **Magnacore Stadium (A-65)** | Unique magnetic mechanic; `processMagnets()` already implemented | `pits[]` × 2, `obstacles[]` magnetic × 4 |
| P2 | **Burst Evolution Stadium (God Layer)** | Active Gen 3 variant; God Zone via `floorHazardZones[]` | `pits[]` × 4, `floorHazardZones[]` × 1 |
| P2 | **World Championship Official Stadium** | Gen 1 tournament finales; anime Story Mode mandatory | `pits[]` × 4, `elevationZones[]` × 1 |
| P2 | **Red Dragon Stadium** | Unique polyline obstacle; `ObstacleShape:"polyline"` untested in prod | `pits[]` × 4, `obstacles[]` polyline × 1 |
| P3 | **Gravity Destroyer Stadium** | Gen 2 variant; minimal additions | `pits[]` × 2, `elevationZones[]` × 1 |
| P3 | **Asian Tournament Desert Stadium** | High-friction floor unique mechanic; `floorHazardZones:mud` path | `pits[]` × 2, `floorHazardZones[]` × 1 |
| P3 | **Frozen Lake Baikal** | Ice `floorHazardZones`; engine feature validation | `floorHazardZones:ice` full arena; `environmentalEffect:blizzard` |
| P3 | **Balkov Abbey Battle Chamber** | Spike pockets; requires `PitConfig.spiked` extension | `pits[]` × 4 (spike kind), `floorHazardZones:mud` × 1 |
| P3 | **Survival Battle Arena** | Battle Royale reference; 12-pocket validation | `pits[]` × 12, `elevationZones[]` × 1 |
| P3 | **Hyper Wrap Stadium** | High-friction + vertical walls; `floorHazardZones:mud` path | `pits[]` × 4, `floorHazardZones:mud` × 1 |
| P4 | **Battle Bladers Stadium** | Colosseum scale; big pockets array | `pits[]` × 8, `elevationZones[]` × 1 — scaled-up BB-10 |
| P4 | **Seaside Dome (individual stages)** | Multi-stage obstacle variants; `obstacles[]` cylinder tests | Stage 2: `obstacles[]` × 3; Stage 3: `obstacles[]` × 1 (tower) |
| P4 | **Robert's Olympia Coliseum** | 8-column obstacle ring | `pits[]` × 4, `obstacles[]` × 8 |
| P4 | **BEGA Main Stadium** | Visual variant only; identical mechanics to World Championship | Alias |
| P4 | **Wilderness Stadium** | Visual variant only; alias of World Championship | Alias |
| P4 | **Justice Five Stadium** | Story Mode boss chain; alias of World Championship | Alias + boss tournament config |
| P4 | **Infinity Stadium (BX-46)** | BX variant; needs `"rectangle"` shape + Infinity Dash extension | BLOCKED on `ArenaShape` + infinity dash extension |
| P5 | **Zero-G Stadium** | Dynamic tilt; requires `TiltMechanicSystem` extension | BLOCKED on tilt mechanic |
| P5 | **SlingShock Beystadium** | Driver compat gate simplifed away; functional with `speedPaths[]` | `speedPaths[]` × 4 (no compat gate) |
| P5 | **HyperSphere Beystadium** | Wall climb; requires Phase A.3 `WallClimbSystem` | BLOCKED on wall climb |
| P5 | **Hyper Stadium (Battle Island)** | Wall climb hybrid; same block as HyperSphere | BLOCKED on wall climb |
| P5 | **Battle Tower floors 1–4** | Triangle shape + spike floor + obstacle variants | Floors 1–4 implementable; Floor 5 needs dynamic collapse |
| P5 | **China Towers Peak** | Wind gusts `environmentalEffect:"storm"` | Simple: `environmentalEffect:"storm"` |
| P5 | **Enrique's Colosseum** | Tiered rebound walls; requires schema extension | BLOCKED on `tieredWalls[]` |
| DEFERRED | **Destroyer Dome** | Sphere physics — fundamentally incompatible with 2D bowl model; 3D not planned | BLOCKED — not implementable in 2D/2.5D |
| DEFERRED | **Abandoned Roller Coaster** | Rail network arena — completely different physics model | BLOCKED — `RailNetworkArena` schema |
| DEFERRED | **Wolborg Ice Prison** | Mid-match stadium transform | BLOCKED — `StadiumTransform` system |
| DEFERRED | **Dynamic crack ice (Frozen Lake Baikal full version)** | Dynamic pit spawning from impacts | BLOCKED — `dynamicPitSystem` |
| DEFERRED | **Baseball Diamond Dish** | Non-circular polygon boundary | BLOCKED — `ringoutBoundaryShape:"polygon"` |

---

## Coordinate Notes

All position fields in ArenaConfig JSON skeletons above use **px units at 1 cm = 24 px** for the `pits[].position` (em-based fields use the arena's internal em system). Radius and `escapeChance` follow the `PitConfig` interface. The `width/height` dimensions above are computed as `diameter_cm × 24` px. Where the source linka file gives `mm` values, conversion is `mm / 10 × 24`.

## Source File Locations

- Stadium files: `C:\Users\mohsi\Downloads\Beyblade-Game-master\linka\stadiums\` (38 files)
- ArenaConfig type: `C:\Users\mohsi\Downloads\Beyblade-Game-master\shared\types\arenaConfigNew.ts`
- Client re-export: `C:\Users\mohsi\Downloads\Beyblade-Game-master\client\src\types\arenaConfigNew.ts`
- Runtime processor: `C:\Users\mohsi\Downloads\Beyblade-Game-master\server\shared\rooms\ArenaFeatureProcessor.ts`
- Arena diagram: `C:\Users\mohsi\Downloads\Beyblade-Game-master\research\diagrams\diagram-arena-interaction.md`

---
[← Phase 08: Gimmicks](phase-08-gimmicks.md) &nbsp;�&nbsp; [↑ Index](../INDEX.md) &nbsp;�&nbsp; [Phase 10: Arena Implementation →](phase-10-arena-implementation.md)


---

## Appendix 9Z — Episode Stadium Context & Arena-Episode Cross-Reference

> Source: `linka/episodes/` research across all generations. Maps stadiums/arenas from the anime to the seeded arena configs and their appearance in specific episodes.

---

### 9Z-1: Gen1 Stadium Episode Cross-Reference

| Stadium Name (game seed) | Anime Label | First Appearance Episode | Arc | Shape | Notable Features | Special Mechanic |
|---|---|---|---|---|---|---|
| Street Bowl (rooftop) | Unnamed rooftop bowl | G1 S1 Ep01 "The Blade Raider" | Classic | Circular shallow | Concrete surface; improvised rim; no walls | None |
| BBA Standard Bowl | BBA Tournament Stadium | G1 S1 Ep09 | Classic | Circular deep | Official high walls; raised platform base; smooth surface | None |
| Park Bowl | Unnamed park bowl | G1 S1 Ep04 | Classic | Circular | Outdoor grass surrounds; moderate depth | None |
| Desert Rock Bowl | Natural stone arena (China) | G1 S1 China arc Ep~18 | Classic | Irregular oval | Stone walls; rough floor; outdoor sun glare | Terrain irregularity |
| USA Sport Arena | Indoor sport arena (All Starz) | G1 S1 USA arc Ep~24 | Classic | Circular | Smooth indoor floor; side wall bumpers; artificial lighting | Wall bumpers |
| Psykick Lab Arena | Team Psykick lab stadium | G1 S2 Ep~20 | V-Force | Circular enclosed | Energy field rim possible; high-tech lighting | Energy wall (Cyber bey boost zone) |
| Saint Shields Ruins | Stone circle / ancient ruins | G1 S2 Ep~08 | V-Force | Irregular | Outdoor ruins; natural stone barriers; Bit-Beast energy focus | Magnacore interaction zone |
| World Championship Arena | WBBA World Championship | G1 S3 Ep~30 | G-Revolution | Circular large | Crowd seating; sponsor boards; professional surface | None |
| BEGA Justice Arena | BEGA Justice Five Stadium | G1 S3 Ep~48 | G-Revolution | Oversized circular | Giant screens; dramatic lighting; ceremonial feel | None |
| HMS Battle Arena | HMS Arena (BEGA HQ) | G-Rev Ep40 | HMS | Circular all-metal | All-metal bowl surface; no plastic rim; smooth high-speed surface | Bearing drift enhanced |

---

### 9Z-2: Gen2 Stadium Episode Cross-Reference

| Stadium Name (game seed) | Anime Label | First Appearance Episode | Arc | Shape | Notable Features | Special Mechanic |
|---|---|---|---|---|---|---|
| Koma Village Open Bowl | Koma Village square | G2 MF Ep01 "Pegasus Has Landed" | MFB S1 | Circular standard | Outdoor town square; crowd of Face Hunters; natural stone surround | None |
| Dark Nebula Lab Arena | Dark Nebula facility | G2 MF Ep~22 | MFB S1 | Circular enclosed | Underground lab; dark lighting; power generators surround | None |
| Beylin Temple (China) | Chinese Beylin arena | G2 MM China arc Ep~20 | MFB S2 | Circular traditional | Temple pillars; outdoor; symbolic decorations | None |
| WBC Main Stadium | World Beyblade Championship | G2 MM Ep~28 | MFB S2 | Circular large | International crowd; national flags; professional broadcast setup | None |
| Gravity Perseus Arena | Excalibur team battle arena | G2 MM Ep~14 | MFB S2 | Circular indoor | European castle backdrop; special lighting; Julian's home turf | None |
| Hades City Arena | HD Academy underground | G2 MM Ep~38 | MFB S2 | Circular extreme-deep | Extremely high walls; Kerbecs reinforced bowl; trap door variants | None |
| Legendary Blader Shrine | Ancient shrine (Metal Fury) | G2 MFu Ep~10 | Metal Fury | Circular stone | Outdoor ancient site; energy pillars; star fragment zones | Star fragment zones |
| Zero-G Tilting Arena | Zero-G / Shogun Steel stadium | Shogun Steel Ep01 | Shogun Steel | Circular suspended | Platform tilts/rocks during battle; no fixed ground | Dynamic tilt (Zero-G) |

---

### 9Z-3: Gen3 Stadium Episode Cross-Reference

| Stadium Name (game seed) | Anime Label | First Appearance Episode | Arc | Shape | Notable Features | Special Mechanic |
|---|---|---|---|---|---|---|
| BC Sol Practice Bowl | BC Sol training ground | G3 S1 Ep01 "Let's Go! Valtryek!" | Burst S1 | Circular standard | Indoor training; white bowl; standard Burst format | Burst Finish enabled |
| Beigoma Cup Arena | Official Beigoma Cup stadium | G3 S1 Ep~12 | Burst S1 | Circular | Crowd seats; official tournament setup | None |
| Snake Pit Hidden Arena | Snake Pit facility | G3 S1 Ep~35 | Burst S1 | Circular dark | Underground; sinister lighting; Red Eye (Shu) battles | None |
| BC Sol Spain Coliseum | BC Sol Spain training coliseum | G3 S2 Ep01 | Burst God | Circular | Spanish outdoor coliseum style; stone archways | None |
| World League Stadium | World Beyblade League (WBL) | G3 S2 Ep~25 | Burst God | Circular large | International broadcast; elevated platforms | None |
| Cho-Z Shrine Arena | Cho-Z Awakening site | G3 S3 Ep~08 | Cho-Z | Circular elevated | Mountain shrine; wind effects; power surge zones | Cho-Z boost zone |
| WBBA Grand Finals | WBBA Grand Tournament | G3 S3 Ep~48 | Cho-Z | Circular oversized | Largest Gen3 stadium; spectacular lighting | None |
| Gachi League Arena | Gachi competitive circuit | G3 S4 Ep01 | GT/Rise | Circular modern | Tech-forward design; LED ring; ranking display | None |
| Surge Championship Bowl | Surge final tournament | G3 S5 Ep~46 | Surge | Circular | Standard with Overdrive launch pockets | None |
| QuadDrive 4-Pocket Arena | QuadDrive season stadium | G3 S6 Ep01 | QuadDrive | Circular 4-pocket | Four distinct launch entry pockets around perimeter; allows multi-angle approaches | 4-pocket entry system |
| QuadStrike Elemental Arena | QuadStrike tournament arena | G3 S7 Ep01 | QuadStrike | Circular tiled floor | Floor divided into colored elemental power zones (fire/water/earth/wind) | Elemental tile boost zones |

---

### 9Z-4: Gen4 Stadium Episode Cross-Reference

| Stadium Name (game seed) | Anime Label | First Appearance Episode | Arc | Shape | Notable Features | Special Mechanic |
|---|---|---|---|---|---|---|
| Xenon City Street Arena | Xenon City open-air street | G4 S1 Ep01 "X" | BX S1 | Circular with X-rail | Outdoor urban; Xtreme Line rail embedded in floor; crowd barriers | Xtreme Line / Xtreme Dash |
| Team Persona Hideout Bowl | Team Persona base arena | G4 S1 Ep02 | BX S1 | Circular small | Indoor hideout; practice setup; no Xtreme Line | None |
| Xenon X League Stadium | X League official tournament | G4 S1 Ep~10 | BX S1 | Circular + X-rail | Full professional Xtreme Line setup; crowd seating; broadcast cameras | Xtreme Line; Xtreme Finish |
| X World Championship Arena | X World Championship | G4 S1 Ep~35 (approx) | BX S1 | Circular + X-rail large | Largest Gen4 stadium; X-Line features elevated section | Xtreme Line; Xtreme Finish |

---

### 9Z-5: Stadium Feature Flags by Generation (Episode-Confirmed)

| Feature Flag | Description | First Confirmed Episode | Gen |
|---|---|---|---|
| `burst_finish_enabled` | Bey can burst (disassemble) on heavy impact | G3 S1 Ep01 | Gen3+ |
| `xtreme_line_present` | Stadium has Xtreme Line rail for Xtreme Dash | G4 S1 Ep01 | Gen4 |
| `xtreme_finish_enabled` | Xtreme Finish win condition active | G4 S1 Ep01 | Gen4 |
| `zero_g_tilt` | Stadium platform tilts/rocks dynamically | Gen2 Shogun Steel Ep01 | Gen2 Zero-G |
| `magnacore_zone` | Magnacore polarity interaction zones present | G1 V-Force Ep08 | Gen1 V-Force |
| `elemental_tiles` | Floor tiles grant elemental power boosts | G3 S7 Ep01 | Gen3 QuadStrike |
| `energy_wall` | Rimwall has energy field (Cyber Beyblade boost) | G1 V-Force Ep~20 | Gen1 V-Force |
| `star_fragment_zones` | Ancient shrine energy pillars empower Legendary beys | G2 Metal Fury Ep~10 | Gen2 Metal Fury |
| `four_pocket_entry` | 4 launch pockets around stadium perimeter | G3 S6 Ep01 | Gen3 QuadDrive |
| `cho_z_boost_zone` | Power surge zones that amplify Cho-Z Awakening | G3 S3 Ep~08 | Gen3 Cho-Z |
| `all_metal_surface` | HMS all-metal bowl; enhances bearing_drift stamina | G-Rev Ep40 | Gen1 HMS |
| `dynamic_obstacles` | Moving or spawning obstacles within arena | Various (obstacle arenas) | Multi-gen |

---

### 9Z-6: Arena Seed Priority by Episode Significance

> Arenas listed here are episode-critical and should be seeded at highest priority for authenticity.

| Priority | Arena / Stadium | Significance | Episode Reference |
|---|---|---|---|
| P0 (must seed) | BBA Standard Bowl | All Gen1 tournament fights | G1 S1 Ep09+ |
| P0 (must seed) | BC Sol Practice Bowl | Gen3 all-season opener | G3 S1 Ep01 |
| P0 (must seed) | Xenon City X League Stadium | Gen4 primary arena | G4 S1 Ep~10 |
| P0 (must seed) | BEGA Justice Arena | Gen1 finale climax | G1 S3 Ep~48 |
| P0 (must seed) | QuadDrive 4-Pocket Arena | Gen3 S6 signature arena | G3 S6 Ep01 |
| P1 | Koma Village Open Bowl | Gen2 intro arena | G2 MF Ep01 |
| P1 | Zero-G Tilting Arena | Unique mechanic; Zero-G | Shogun Steel Ep01 |
| P1 | QuadStrike Elemental Arena | Elemental tile mechanic | G3 S7 Ep01 |
| P1 | WBC Main Stadium | Gen2 international tournament | G2 MM Ep~28 |
| P2 | Saint Shields Ruins | Magnacore zone; Gen1 V-Force | G1 V-Force Ep~08 |
| P2 | Cho-Z Shrine Arena | Cho-Z boost zone | G3 S3 Ep~08 |
| P2 | Street Bowl (rooftop) | Gen1 opening atmosphere | G1 S1 Ep01 |
| P3 | Desert Rock Bowl | Terrain irregularity feature | G1 S1 China arc |
| P3 | Dark Nebula Lab Arena | Atmospheric villain arena | G2 MF Ep~22 |

---

## Arena Tilt System (Z-axis orientation)

Added in v2.4.0. Distinct from `bowlProfile`/`wallAngle` (surface curvature) — tilt tilts the entire plane, while slope is local wall geometry. The two are independent and additive.

### Overview

| Concept | What it does |
|---------|-------------|
| **Tilt** (`tiltAngle`) | Tilts the arena floor plane 0–360° around a horizontal axis. 0=flat, 90=wall-ride, 180=inverted (Zero-G), 270=wall-ride back |
| **Direction** (`tiltDirection`) | Downhill azimuth: 0°=right (+X), 90°=down (+Y), 180°=left, 270°=up |
| **Slope** (`bowlProfile`/`wallAngle`) | Surface wall curvature — independent of tilt |

### Tilt Modes

| Mode | Behavior |
|------|----------|
| `"fixed"` | Static angle at `tiltAngle` + `tiltDirection`. `autoTilt` + `tiltSpeed` optionally spins the direction axis. |
| `"oscillate"` | Angle rocks between `tiltOscillateMin` ↔ `tiltOscillateMax` on a cosine wave. Period controlled by `tiltOscillatePeriodMs` (default 4 s). `autoTilt` also spins the direction simultaneously. |
| `"weight"` | Direction tracks the center of mass of all active beyblades. Angle scales from 0 to `tiltOscillateMax` (or `tiltAngle` as fallback) proportional to COM distance from arena center. |

### Physics

```
lateral force = sin(tiltAngle) × 0.04 × mass   (applied toward tiltDirection every tick)
```

At tilt=90° the arena is edge-on — beyblades experience maximum lateral drift (like a vertical-wall ride). At tilt=180° the force effectively reverses (inverted / Zero-G). Zero-G Stadium uses `tiltMode="weight"` with `tiltAngle ≈ 15°` and `tiltOscillateMax=15`.

### Pivot

Both tilt and rotation support an eccentric pivot (cm offset from arena center):

- `tiltPivotX/Y` — shifts the tilt axis so one edge dips while the other stays high
- `rotationPivotX/Y` — shifts the rotation center so the arena orbits an off-center point

In the renderer, the pivot is applied as `container.pivot = (pvx, pvy)` with `container.position = (pvx, pvy)` compensation so the visual origin remains at world (0,0).

### Canonical Reference: Zero-G Stadium (BB-G04)

The Zero-G Attack Beystadium (Shogun Steel series, gen2.5) rocks on a pivot base at ±15° driven by beyblade mass distribution — the first canon example of `tiltMode="weight"`. Key parameters:

```
tiltMode: "weight"
tiltAngle: 15          // max angle (used as tiltOscillateMax)
tiltOscillateMax: 15
tiltDirection: 0       // auto-tracks COM
autoTilt: false
```

---

*End of Appendix 9Z*

---

[← Phase 08: Gimmicks](phase-08-gimmicks.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 10: Arena Implementation →](phase-10-arena-implementation.md)

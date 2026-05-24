[← Phase 09: Arenas](phase-09-arenas.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 11: Architecture →](phase-11-architecture.md)

---

# Phase 10 — Arena Implementations

> Stage 10 | Source: phase-09-arenas.md + shared/types/arenaConfigNew.ts + ArenaFeatureProcessor.ts

---

## 1. TypeScript Schema Additions (arenaConfigNew.ts)

These must be added to `shared/types/arenaConfigNew.ts` BEFORE the seed script runs.

### 1.1 ArenaShape extension

```typescript
// CURRENT (line ~22):
export type ArenaShape =
  | "circle" | "triangle" | "square" | "pentagon"
  | "hexagon" | "heptagon" | "octagon"
  | "star3" | "star4" | "star5" | "star6" | "star7" | "star8";

// ADD "rectangle":
export type ArenaShape =
  | "circle" | "triangle" | "square" | "rectangle" | "pentagon"
  | "hexagon" | "heptagon" | "octagon"
  | "star3" | "star4" | "star5" | "star6" | "star7" | "star8";
```

**Needed by**: Infinity Stadium (BX-46), Robert's Castle Interior Arena.

### 1.2 PitType extension

```typescript
// CURRENT:
export type PitType = "edge" | "crater";

// REPLACE WITH:
export type PitType =
  | "edge"          // Standard penalty pocket / ring-out well
  | "crater"        // Irregular crater pit
  | "penalty_well"  // Gen1/Gen2 named penalty pocket
  | "xtreme_zone"   // BX Xtreme Zone (3-pt exit; triggers on KO)
  | "over_zone"     // BX Over Zone (2-pt exit; triggers on KO)
  | "spike_pit";    // Instant-KO spiked pit (Balkov Abbey etc.)
```

**Needed by**: Xtreme Stadium (BX-10), Infinity Stadium (BX-46), Balkov Abbey.

### 1.3 New interface: GearRailConfig

```typescript
/**
 * GearRailConfig — Xtreme Stadium gear-toothed rail.
 * A beyblade with gearCompatibleBit = true that contacts the rail
 * receives a speedBoostPermille speed burst and is redirected tangentially.
 */
export interface GearRailConfig {
  /** Unique ID within the arena */
  id: string;
  /**
   * Polyline vertices in cm (arena-center-relative).
   * The rail is a curved arc; approximate with 8–12 points.
   */
  polylineCm: Array<{ x: number; y: number }>;
  /**
   * Speed boost on engagement as permille (1000 = no change, 1500 = +50%).
   * Default 1500 for BX Xtreme Dash (empirically +40–50%).
   */
  speedBoostPermille: number;
  /**
   * If true, only beyblades with gearCompatibleBit = true get the boost.
   * If false (simplified), all beyblades get the boost.
   * Default: false (game simplification — no physical driver types).
   */
  requiresGearCompatibleBit?: boolean;
  /**
   * Duration of the speed boost in ms after leaving the rail.
   */
  boostDurationMs?: number;
  /**
   * IDs of ScoringZoneConfig entries that this rail guides the bey toward.
   */
  exitZoneIds?: string[];
  /** Visual color for the rail. Default: silver/metal. */
  color?: string;
}
```

### 1.4 New interface: ScoringZoneConfig

```typescript
/**
 * ScoringZoneConfig — BX-style exit scoring zones.
 * When a bey is eliminated in this zone, the eliminator scores `points`.
 */
export interface ScoringZoneConfig {
  /** Unique ID within the arena */
  id: string;
  /**
   * Kind of scoring zone:
   * - "xtreme" = Xtreme Zone (3 pts in BX; major ring-out)
   * - "over"   = Over Zone (2 pts in BX; minor ring-out)
   * - "pocket" = Legacy penalty pocket (1 pt)
   * - "ring_out" = Generic ring-out boundary (1 pt)
   */
  kind: "xtreme" | "over" | "pocket" | "ring_out";
  /** Center position relative to arena center, cm */
  x_cm: number;
  y_cm: number;
  /** Radius of the scoring zone trigger area, cm */
  radius_cm: number;
  /** Points awarded when a bey exits through this zone */
  points: number;
  /** Visual color. Default per kind: xtreme=gold, over=blue, pocket=red, ring_out=none. */
  color?: string;
}
```

### 1.5 New interface: TornadoRidgeConfig

```typescript
/**
 * TornadoRidgeConfig — Raised tornado ridge (tornado stall terrain).
 * A circular elevated ring near stadium center; imparts orbit force to beys on it.
 */
export interface TornadoRidgeConfig {
  /** Radius of the ridge center line, cm */
  radius_cm: number;
  /** Ridge height (visual + affects exit angle), cm. Typical: 0.5–1.5 */
  height_cm: number;
  /** Width of the ridge (flat top), cm. Typical: 1.0–2.5 */
  width_cm?: number;
  /**
   * If true, the ridge imparts an orbit force (tangential) to beys on it.
   * Speed: orbitSpeedRadPerSec. Default true.
   */
  impartsOrbit?: boolean;
  /** Orbit angular speed on the ridge, rad/sec. Default 0.8 */
  orbitSpeedRadPerSec?: number;
  /** Spin boost % per second while on the ridge. 0–20. Default 2 */
  spinBoostPercent?: number;
  /** Visual color. Default: slightly lighter than floor */
  color?: string;
}
```

### 1.6 New interface: ZeroGConfig

```typescript
/**
 * ZeroGConfig — Zero-G Beystadium dynamic tilt mechanic.
 * The arena bowl tilts toward the center of mass of all beyblades in play.
 * Per-tick: Σ(bey_position × bey_mass) → normalized → tilt normal vector.
 */
export interface ZeroGConfig {
  /** Whether tilt is active */
  enabled: boolean;
  /**
   * Effective gravity component along the tilt vector, cm/s².
   * Default 980 (1g). Increase for more dramatic tilt effects.
   */
  gravityCmPerSec2?: number;
  /**
   * Maximum tilt angle from vertical, degrees. Default 15 (matches physical product).
   */
  maxTiltDeg?: number;
  /**
   * Rebound coefficient when bey hits the wall during tilt. Default 0.6.
   */
  wallRebound?: number;
  /**
   * Smoothing factor for tilt transition (0–1). Lower = snappier. Default 0.05.
   */
  tiltSmoothingFactor?: number;
}
```

### 1.7 New interface: TiltMechanicConfig (synonym for ZeroGConfig; alias exported)

```typescript
export type TiltMechanicConfig = ZeroGConfig;
```

### 1.8 ArenaConfig field additions

Add these fields to the `ArenaConfig` interface (after the `bumps?` field in the NEW FEATURE FAMILY section):

```typescript
  // ===== GEN4 XTREME SYSTEM =====
  /** Gear-toothed rails for Xtreme Dash (BX stadiums) */
  gearRails?: GearRailConfig[];
  /** BX-style differentiated exit scoring zones */
  scoringZones?: ScoringZoneConfig[];

  // ===== TORNADO RIDGE =====
  /** Raised circular ridge near center (tornado stall terrain) */
  tornadoRidge?: TornadoRidgeConfig;

  // ===== ZERO-G / TILT =====
  /** Dynamic arena tilt mechanic (Zero-G Beystadium) */
  zeroG?: ZeroGConfig;

  // ===== GLOBAL DRAIN MODIFIER =====
  /**
   * Global spin drain rate multiplier for this arena (1.0 = normal).
   * Use > 1.0 for arenas that accelerate spin loss (e.g. BX-46 Infinity = 1.25).
   */
  staminaDrainMultiplier?: number;
```

---

## 2. ArenaFeatureProcessor Updates Required

These new dispatch cases must be added to `server/shared/rooms/ArenaFeatureProcessor.ts`:

| New Handler | Method | Priority |
|---|---|---|
| `processGearRails(dt)` | Per-tick: detect proximity to polyline; if within 5px → apply speedBoostPermille; set boostTimer | CRITICAL for Xtreme Stadium |
| `processScoringZones(dt)` | On bey ring-out: check which `ScoringZoneConfig` the bey passed through; add `points` to `playerPoints[userId]` | CRITICAL for BX scoring |
| `processTornadoRidge(dt)` | Per-tick: detect bey on ridge ring (r ± width/2); apply tangential orbit force; apply spinBoostPercent | HIGH |
| `processTiltMechanic(dt)` | Per-tick: Σ(bey.position × bey.mass) → normalize → set `arenaState.tiltVector` → apply gravityCmPerSec2 along tilt | HIGH |
| `processTriggerZones(dt)` | CRITICAL EXISTING GAP: all 7 TriggerZoneConfig kinds were never dispatched | CRITICAL |

---

## 3. Seed-Ready ArenaConfig JSON

All JSON below is ready to insert into `scripts/seed-arenas.js`. Values use **px at 1 cm = 24 px** for position fields where noted; other fields use their interface units (cm, %, em).

---

### P1 — Spin Stadium (A-1/A-2)
```json
{
  "id": "tt-a1-spin-stadium",
  "name": "Spin Stadium",
  "description": "Simplest official stadium. Small 22 cm bowl; fast ring-outs. Tutorial arena.",
  "width": 528,
  "height": 528,
  "shape": "circle",
  "theme": "grasslands",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.0, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 4,
    "recoilDistance": 2,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0, "y": 107 },  "radius": 1.0, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 90  },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0, "y": -107 }, "radius": 1.0, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 270 }
  ],
  "difficulty": "easy"
}
```

---

### P1 — BB-10 Attack Type Beystadium
```json
{
  "id": "tt-bb10-attack-stadium",
  "name": "BB-10 Attack Type Beystadium",
  "description": "8-pocket Gen2 tournament standard. Tornado ridge 14 cm diameter enables Tornado Stall technique.",
  "width": 816,
  "height": 816,
  "shape": "circle",
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_0",  "type": "penalty_well", "position": { "x": 155, "y": 0 },      "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_45", "type": "penalty_well", "position": { "x": 110, "y": 110 },     "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 45  },
    { "id": "p_90", "type": "penalty_well", "position": { "x": 0,   "y": 155 },     "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_135","type": "penalty_well", "position": { "x": -110, "y": 110 },    "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 135 },
    { "id": "p_180","type": "penalty_well", "position": { "x": -155, "y": 0 },      "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 180 },
    { "id": "p_225","type": "penalty_well", "position": { "x": -110, "y": -110 },   "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 225 },
    { "id": "p_270","type": "penalty_well", "position": { "x": 0,   "y": -155 },    "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_315","type": "penalty_well", "position": { "x": 110, "y": -110 },    "radius": 1.1, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 315 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 7, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "tornadoRidge": {
    "radius_cm": 7,
    "height_cm": 0.8,
    "width_cm": 2.0,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.8,
    "spinBoostPercent": 2
  },
  "difficulty": "medium"
}
```

---

### P1 — Burst Beystadium Standard Type (B-09)
```json
{
  "id": "tt-b09-burst-standard",
  "name": "Burst Beystadium Standard Type",
  "description": "Gen3 tournament standard. 4 pockets, tornado ridge, tall walls emphasize Burst Finish over ring-out.",
  "width": 744,
  "height": 744,
  "shape": "circle",
  "theme": "futuristic",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.3, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,    "y": 150 },  "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 150,  "y": 0 },    "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,    "y": -150 }, "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -150, "y": 0 },    "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 180 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 7, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "tornadoRidge": {
    "radius_cm": 7,
    "height_cm": 0.8,
    "width_cm": 2.0,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.8,
    "spinBoostPercent": 2
  },
  "difficulty": "medium"
}
```

---

### P1 — Xtreme Stadium (BX-10)

> **Requires new schema fields**: `gearRails`, `scoringZones`, `tornadoRidge`, `PitType.xtreme_zone`, `PitType.over_zone`

```json
{
  "id": "tt-bx-10-xtreme-stadium",
  "name": "Xtreme Stadium",
  "description": "Gen4 BX tournament standard. Xtreme Zone (3 pts), 2 Over Zones (2 pts), Xtreme Dash gear rail, tornado ridge.",
  "width": 876,
  "height": 876,
  "shape": "square",
  "theme": "cyber_grid",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] }
    ],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#facc15",
    "baseDamage": 6,
    "recoilDistance": 3.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    {
      "id": "xtreme_zone",
      "type": "xtreme_zone",
      "position": { "x": 0, "y": -165 },
      "radius": 2.5,
      "depth": 6,
      "spinDamagePerSecond": 0,
      "escapeChance": 0,
      "angle": 270
    },
    {
      "id": "over_zone_e",
      "type": "over_zone",
      "position": { "x": 165, "y": 0 },
      "radius": 1.8,
      "depth": 5,
      "spinDamagePerSecond": 0,
      "escapeChance": 0,
      "angle": 0
    },
    {
      "id": "over_zone_w",
      "type": "over_zone",
      "position": { "x": -165, "y": 0 },
      "radius": 1.8,
      "depth": 5,
      "spinDamagePerSecond": 0,
      "escapeChance": 0,
      "angle": 180
    }
  ],
  "gearRails": [
    {
      "id": "xtreme_line",
      "polylineCm": [
        { "x": -16, "y": -4 }, { "x": -12, "y": -7 }, { "x": -6, "y": -9 },
        { "x": 0,   "y": -9.5 }, { "x": 6, "y": -9 }, { "x": 12, "y": -7 },
        { "x": 16,  "y": -4 }
      ],
      "speedBoostPermille": 1500,
      "requiresGearCompatibleBit": false,
      "boostDurationMs": 400,
      "exitZoneIds": ["xtreme_zone"],
      "color": "#facc15"
    }
  ],
  "scoringZones": [
    { "id": "xtreme_zone", "kind": "xtreme", "x_cm": 0, "y_cm": -18.25, "radius_cm": 2.5, "points": 3, "color": "#facc15" },
    { "id": "over_zone_e", "kind": "over",   "x_cm": 18.25, "y_cm": 0,   "radius_cm": 1.8, "points": 2, "color": "#3b82f6" },
    { "id": "over_zone_w", "kind": "over",   "x_cm": -18.25, "y_cm": 0,  "radius_cm": 1.8, "points": 2, "color": "#3b82f6" }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 10.5, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "tornadoRidge": {
    "radius_cm": 10.5,
    "height_cm": 0.8,
    "width_cm": 2.5,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.9,
    "spinBoostPercent": 2
  },
  "difficulty": "hard"
}
```

---

### P1 — Tournament Beystadium / Hasbro G0318 (BX alias)

```json
{
  "id": "hasbro-g0318-tournament-beystadium",
  "name": "Tournament Beystadium",
  "description": "Hasbro alias of tt-bx-10-xtreme-stadium. X-Celerator Rail branding; mechanically identical.",
  "width": 876,
  "height": 876,
  "shape": "square",
  "theme": "cyber_grid",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.2, "position": 0 }] }
    ],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#facc15",
    "baseDamage": 6,
    "recoilDistance": 3.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "xtreme_zone",  "type": "xtreme_zone", "position": { "x": 0, "y": -165 },   "radius": 2.5, "depth": 6, "spinDamagePerSecond": 0, "escapeChance": 0, "angle": 270 },
    { "id": "over_zone_e",  "type": "over_zone",   "position": { "x": 165, "y": 0 },     "radius": 1.8, "depth": 5, "spinDamagePerSecond": 0, "escapeChance": 0, "angle": 0   },
    { "id": "over_zone_w",  "type": "over_zone",   "position": { "x": -165, "y": 0 },    "radius": 1.8, "depth": 5, "spinDamagePerSecond": 0, "escapeChance": 0, "angle": 180 }
  ],
  "gearRails": [
    {
      "id": "xcelerator_rail",
      "polylineCm": [
        { "x": -16, "y": -4 }, { "x": -12, "y": -7 }, { "x": -6, "y": -9 },
        { "x": 0,   "y": -9.5 }, { "x": 6, "y": -9 }, { "x": 12, "y": -7 },
        { "x": 16,  "y": -4 }
      ],
      "speedBoostPermille": 1500,
      "requiresGearCompatibleBit": false,
      "boostDurationMs": 400,
      "exitZoneIds": ["xtreme_zone"],
      "color": "#facc15"
    }
  ],
  "scoringZones": [
    { "id": "xtreme_zone",  "kind": "xtreme", "x_cm": 0, "y_cm": -18.25, "radius_cm": 2.5, "points": 3 },
    { "id": "over_zone_e",  "kind": "over",   "x_cm": 18.25, "y_cm": 0,   "radius_cm": 1.8, "points": 2 },
    { "id": "over_zone_w",  "kind": "over",   "x_cm": -18.25, "y_cm": 0,  "radius_cm": 1.8, "points": 2 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 10.5, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "tornadoRidge": {
    "radius_cm": 10.5,
    "height_cm": 0.8,
    "width_cm": 2.5,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.9,
    "spinBoostPercent": 2
  },
  "difficulty": "hard"
}
```

---

### P2 — Magnacore Stadium (A-65)
```json
{
  "id": "tt-a65-magnacore-stadium",
  "name": "Magnacore Stadium",
  "description": "Embedded floor magnets repel/attract Magnecore-equipped beys. 2 penalty pockets E/W.",
  "width": 672,
  "height": 672,
  "shape": "circle",
  "theme": "futuristic",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.0, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 4,
    "recoilDistance": 2.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_e", "type": "penalty_well", "position": { "x": 120,  "y": 0 }, "radius": 1.0, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 0   },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -120, "y": 0 }, "radius": 1.0, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 180 }
  ],
  "obstacles": [
    { "id": 1, "x": 60,  "y": 60,  "radius": 0, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.5 }, "physics": { "type": "magnetic", "magnetStrength": 3.0, "magnetRadiusCm": 5.0, "polarity": "repel" } },
    { "id": 2, "x": -60, "y": 60,  "radius": 0, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.5 }, "physics": { "type": "magnetic", "magnetStrength": 3.0, "magnetRadiusCm": 5.0, "polarity": "attract" } },
    { "id": 3, "x": 60,  "y": -60, "radius": 0, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.5 }, "physics": { "type": "magnetic", "magnetStrength": 3.0, "magnetRadiusCm": 5.0, "polarity": "attract" } },
    { "id": 4, "x": -60, "y": -60, "radius": 0, "health": 9999, "damage": 0, "recoilDistance": 0, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.5 }, "physics": { "type": "magnetic", "magnetStrength": 3.0, "magnetRadiusCm": 5.0, "polarity": "repel" } }
  ],
  "difficulty": "medium"
}
```

---

### P2 — Burst Evolution Stadium / God Layer Stadium (B-33)
```json
{
  "id": "tt-b33-god-layer-stadium",
  "name": "Burst Evolution Stadium (God Layer)",
  "description": "God Zone central depression reduces friction; stamina/spring-Driver bonus. Standard 4-pocket burst topology.",
  "width": 744,
  "height": 744,
  "shape": "circle",
  "theme": "quantum_realm",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.3, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,    "y": 150 },  "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 150,  "y": 0 },    "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,    "y": -150 }, "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -150, "y": 0 },    "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 180 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 6.5, "heightCm": 0.7, "spinBoostPercent": 2 }
  ],
  "floorHazardZones": [
    {
      "id": "god_zone",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 5,
      "hazardType": "ice",
      "damagePerSecond": 0,
      "frictionMultiplierPermille": 700,
      "color": "#818cf8"
    }
  ],
  "tornadoRidge": {
    "radius_cm": 6.5,
    "height_cm": 0.7,
    "width_cm": 2.0,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.8,
    "spinBoostPercent": 2
  },
  "difficulty": "medium"
}
```

---

### P2 — World Championship Official Stadium
```json
{
  "id": "anime-world-championship-stadium",
  "name": "World Championship Official Stadium",
  "description": "Gen1 World Championship venue. 4 pockets, central rise, tall walls. Story Mode boss arena.",
  "width": 912,
  "height": 912,
  "shape": "circle",
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.4, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,    "y": 178 },  "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 178,  "y": 0 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,    "y": -178 }, "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -178, "y": 0 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 180 }
  ],
  "elevationZones": [
    { "id": "central_rise", "x_cm": 0, "y_cm": 0, "radius_cm": 6, "heightCm": 0.8, "spinBoostPercent": 2 }
  ],
  "difficulty": "hard"
}
```

---

### P2 — Red Dragon Stadium
```json
{
  "id": "anime-red-dragon-stadium",
  "name": "Red Dragon Stadium",
  "description": "Asymmetric curved dragon-spine polyline obstacle through pit center. GR-era Story Mode.",
  "width": 864,
  "height": 864,
  "shape": "circle",
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
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0, "y": 145 },   "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 145, "y": 0 },   "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0, "y": -145 },  "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -145, "y": 0 },  "radius": 1.17, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 180 }
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
          { "x_cm": -8,    "y_cm":  3 },
          { "x_cm":  0,    "y_cm": -2 },
          { "x_cm":  8,    "y_cm":  3 },
          { "x_cm":  13.5, "y_cm": -2 }
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

---

### P3 — Gravity Destroyer Stadium (BB-91)
```json
{
  "id": "tt-bb91-gravity-stadium",
  "name": "Gravity Destroyer Stadium",
  "description": "2-pocket variant of BB-10 topology. Smaller tornado ridge; longer stamina-type battles.",
  "width": 720,
  "height": 720,
  "shape": "circle",
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "medium",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.1, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0, "y": 132 },  "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0, "y": -132 }, "radius": 1.0, "depth": 5, "spinDamagePerSecond": 28, "escapeChance": 0.35, "angle": 270 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 5.5, "heightCm": 0.6, "spinBoostPercent": 1 }
  ],
  "tornadoRidge": {
    "radius_cm": 5.5,
    "height_cm": 0.6,
    "width_cm": 1.5,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.7,
    "spinBoostPercent": 1
  },
  "difficulty": "easy"
}
```

---

### P3 — Asian Tournament Desert Stadium
```json
{
  "id": "anime-asian-tournament-desert",
  "name": "Asian Tournament Desert Stadium",
  "description": "Sand floor with 2.5x friction. Blocks banking, sliding shoot, and rush techniques.",
  "width": 768,
  "height": 768,
  "shape": "circle",
  "theme": "desert",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.1, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 4,
    "recoilDistance": 2.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,  "y": 148 },  "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 90  },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,  "y": -148 }, "radius": 1.1, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.4, "angle": 270 }
  ],
  "floorHazardZones": [
    {
      "id": "sand_floor",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 32,
      "hazardType": "mud",
      "damagePerSecond": 0,
      "frictionMultiplierPermille": 2500,
      "color": "#d97706"
    }
  ],
  "difficulty": "medium"
}
```

---

### P3 — Balkov Abbey Battle Chamber
```json
{
  "id": "anime-balkov-abbey-chamber",
  "name": "Balkov Abbey Battle Chamber",
  "description": "4 spike pockets: instant KO on entry. Polished stone floor. No escape chance.",
  "width": 720,
  "height": 720,
  "shape": "square",
  "theme": "haunted_factory",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [
      { "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] },
      { "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] }
    ],
    "wallStyle": "stone",
    "exitStyle": "none",
    "exitColor": "#1e1e1e",
    "baseDamage": 8,
    "recoilDistance": 1.5,
    "hasSpikes": true,
    "spikeDamageMultiplier": 2.0
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n",  "type": "spike_pit", "position": { "x": 0,    "y": 132 },  "radius": 1.1, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0.0, "angle": 90  },
    { "id": "p_e",  "type": "spike_pit", "position": { "x": 132,  "y": 0 },    "radius": 1.1, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0.0, "angle": 0   },
    { "id": "p_s",  "type": "spike_pit", "position": { "x": 0,    "y": -132 }, "radius": 1.1, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0.0, "angle": 270 },
    { "id": "p_w",  "type": "spike_pit", "position": { "x": -132, "y": 0 },    "radius": 1.1, "depth": 8, "spinDamagePerSecond": 999, "escapeChance": 0.0, "angle": 180 }
  ],
  "floorHazardZones": [
    {
      "id": "stone_floor",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 30,
      "hazardType": "ice",
      "damagePerSecond": 0,
      "frictionMultiplierPermille": 850,
      "color": "#374151"
    }
  ],
  "difficulty": "extreme"
}
```

---

### P3 — Frozen Lake Baikal
```json
{
  "id": "anime-frozen-lake-baikal",
  "name": "Frozen Lake Baikal",
  "description": "Open ice terrain. No walls; edge = ring-out. Ice floor 0.3x friction. Dynamic cracks from impacts (not yet implemented).",
  "width": 1080,
  "height": 1080,
  "shape": "circle",
  "theme": "frozen_tundra",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "shallow",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 0.5, "position": 0 }] }],
    "wallStyle": "none",
    "exitStyle": "none",
    "exitColor": "#93c5fd",
    "baseDamage": 0,
    "recoilDistance": 0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [],
  "floorHazardZones": [
    {
      "id": "ice_floor",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 100,
      "hazardType": "ice",
      "damagePerSecond": 0,
      "frictionMultiplierPermille": 300,
      "color": "#e0f2fe"
    }
  ],
  "environmentalEffect": {
    "preset": "blizzard",
    "windDirectionDeg": 45,
    "windMagnitudeCmPerSec": 120,
    "gustIntervalTicks": 180,
    "gustMagnitudeCmPerSec": 300,
    "gustDurationTicks": 30
  },
  "difficulty": "hard"
}
```

---

### P3 — Survival Battle Tournament Arena
```json
{
  "id": "anime-survival-battle-stadium",
  "name": "Survival Battle Tournament Arena",
  "description": "12-pocket battle-royale reference arena. Large 60 cm diameter; 8 spawn points; 22 cm tornado ridge.",
  "width": 1440,
  "height": 1440,
  "shape": "circle",
  "theme": "metrocity",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.5, "position": 0 }] }],
    "wallStyle": "plastic",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 6,
    "recoilDistance": 3.0,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_0",   "type": "penalty_well", "position": { "x": 258,  "y": 0 },      "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 0   },
    { "id": "p_30",  "type": "penalty_well", "position": { "x": 223,  "y": 129 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 30  },
    { "id": "p_60",  "type": "penalty_well", "position": { "x": 129,  "y": 223 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 60  },
    { "id": "p_90",  "type": "penalty_well", "position": { "x": 0,    "y": 258 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 90  },
    { "id": "p_120", "type": "penalty_well", "position": { "x": -129, "y": 223 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 120 },
    { "id": "p_150", "type": "penalty_well", "position": { "x": -223, "y": 129 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 150 },
    { "id": "p_180", "type": "penalty_well", "position": { "x": -258, "y": 0 },      "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 180 },
    { "id": "p_210", "type": "penalty_well", "position": { "x": -223, "y": -129 },   "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 210 },
    { "id": "p_240", "type": "penalty_well", "position": { "x": -129, "y": -223 },   "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 240 },
    { "id": "p_270", "type": "penalty_well", "position": { "x": 0,    "y": -258 },   "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 270 },
    { "id": "p_300", "type": "penalty_well", "position": { "x": 129,  "y": -223 },   "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 300 },
    { "id": "p_330", "type": "penalty_well", "position": { "x": 223,  "y": -129 },   "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.3, "angle": 330 }
  ],
  "elevationZones": [
    { "id": "tornado_ridge", "x_cm": 0, "y_cm": 0, "radius_cm": 11, "heightCm": 0.9, "spinBoostPercent": 2 }
  ],
  "tornadoRidge": {
    "radius_cm": 11,
    "height_cm": 0.9,
    "width_cm": 2.5,
    "impartsOrbit": true,
    "orbitSpeedRadPerSec": 0.8,
    "spinBoostPercent": 2
  },
  "difficulty": "hard"
}
```

---

### P3 — Hyper Wrap Stadium
```json
{
  "id": "anime-hyper-wrap-stadium",
  "name": "Hyper Wrap Stadium",
  "description": "4 narrow pockets; vertical hard rim walls; 1.5x floor friction. Ring-out very difficult.",
  "width": 768,
  "height": 768,
  "shape": "circle",
  "theme": "futuristic",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "steep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 2.0, "position": 0 }] }],
    "wallStyle": "metal",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 7,
    "recoilDistance": 1.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,    "y": 155 },  "radius": 0.8, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.3, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 155,  "y": 0 },    "radius": 0.8, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.3, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,    "y": -155 }, "radius": 0.8, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.3, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -155, "y": 0 },    "radius": 0.8, "depth": 4, "spinDamagePerSecond": 25, "escapeChance": 0.3, "angle": 180 }
  ],
  "floorHazardZones": [
    {
      "id": "high_friction_floor",
      "x_cm": 0,
      "y_cm": 0,
      "radius_cm": 32,
      "hazardType": "mud",
      "damagePerSecond": 0,
      "frictionMultiplierPermille": 1500,
      "color": "#475569"
    }
  ],
  "difficulty": "medium"
}
```

---

## 4. P4 Arena Aliases

These arenas share mechanics with already-seeded P2 arenas. Implement as separate Firestore docs referencing the same logic:

| Arena ID | Alias of | Extra fields |
|---|---|---|
| `anime-bega-main-stadium` | `anime-world-championship-stadium` | theme: `"quantum_realm"`, name: "BEGA Main Stadium", LED feedback via `arenaTimeline?` |
| `anime-wilderness-stadium` | `anime-world-championship-stadium` | theme: `"grasslands"`, name: "Wilderness Stadium" |
| `anime-justice-five-stadium` | `anime-world-championship-stadium` | theme: `"metrocity"`, name: "Justice Five Tournament Stadium" |

---

## 5. P4 — Robert's Olympia Coliseum (8-column ring)
```json
{
  "id": "anime-robert-olympia-coliseum",
  "name": "Robert's Olympia Coliseum",
  "description": "8 Greek column obstacles near rim. 4 NESW pockets. Deep bowl.",
  "width": 960,
  "height": 960,
  "shape": "circle",
  "theme": "ancient_temple",
  "autoRotate": false,
  "rotationSpeed": 0,
  "rotationDirection": "clockwise",
  "bowlProfile": "deep",
  "wall": {
    "enabled": true,
    "edges": [{ "walls": [{ "width": 100, "thickness": 1.4, "position": 0 }] }],
    "wallStyle": "stone",
    "exitStyle": "arrows",
    "exitColor": "#ef4444",
    "baseDamage": 5,
    "recoilDistance": 2.5,
    "hasSpikes": false,
    "spikeDamageMultiplier": 1.5
  },
  "speedPaths": [],
  "portals": [],
  "waterBodies": [],
  "pits": [
    { "id": "p_n", "type": "penalty_well", "position": { "x": 0,    "y": 186 },  "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 90  },
    { "id": "p_e", "type": "penalty_well", "position": { "x": 186,  "y": 0 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 0   },
    { "id": "p_s", "type": "penalty_well", "position": { "x": 0,    "y": -186 }, "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 270 },
    { "id": "p_w", "type": "penalty_well", "position": { "x": -186, "y": 0 },    "radius": 1.2, "depth": 5, "spinDamagePerSecond": 30, "escapeChance": 0.35, "angle": 180 }
  ],
  "obstacles": [
    { "id": 1, "x":  155, "y":   0,   "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 2, "x":  110, "y":  110,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 3, "x":    0, "y":  155,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 4, "x": -110, "y":  110,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 5, "x": -155, "y":    0,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 6, "x": -110, "y": -110,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 7, "x":    0, "y": -155,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } },
    { "id": 8, "x":  110, "y": -110,  "radius": 0, "health": 9999, "damage": 8, "recoilDistance": 6, "indestructible": true, "shape": { "kind": "circle", "radiusCm": 1.8 }, "physics": { "type": "wall", "heightCm": 8 } }
  ],
  "difficulty": "hard"
}
```

---

## 6. Blocked Arenas (Schema Extensions Required)

| Arena ID | Blocking Schema Gap | Required Extension | Estimated Priority |
|---|---|---|---|
| `tt-bbg04-zerog-stadium` | Dynamic tilt — no `zeroG` processor | `ZeroGConfig` + `processTiltMechanic()` handler | P5 |
| `hasbro-hypersphere-stadium` | Vertical inner wall — no `wallClimbZones[]` | `WallClimbSystem` Phase A.3 | P5 (post-ship) |
| `anime-hyper-stadium-rise` | Same as HyperSphere | Same | P5 (post-ship) |
| `tt-bx-46-infinity-stadium` | `"rectangle"` shape missing; Infinity Dash compound loop | Add `"rectangle"` to ArenaShape + `processInfinityDashLoop()` | P4 (after shape extension) |
| `hasbro-destroyer-dome` | `"sphere"` shape + full 360° orbital physics | Not implementable in 2D/2.5D; 3D not planned | DEFERRED |
| `anime-frozen-lake-baikal-full` | Dynamic crack pits spawning from impacts | `ice_crack_generation` processor | LOW (Story Mode) |
| `anime-wolborg-ice-prison` | Mid-match stadium transform | `stadium_transform` handler | LOW (Story Mode) |
| `anime-roller-coaster` | Rail-network floor + loop/bank physics | `RailNetworkArena` system | DEFERRED |
| `anime-baseball-diamond-dish` | Non-circular polygon ring-out boundary | `ringoutBoundaryShape:"polygon"` + polygon collider | P4 |
| `anime-enrique-colosseum` | Tiered rebound walls | `tieredWalls[]` extension | P4 (Story Mode) |
| `anime-asian-tournament-standard` | Twin-arena layout | Multi-arena scene system | DEFERRED |

---

## 7. Seed Script Additions (scripts/seed-arenas.js)

The seed script must:
1. Import the new `GearRailConfig`, `ScoringZoneConfig`, `TornadoRidgeConfig` interfaces from the updated `arenaConfigNew.ts`
2. Write all P1–P4 arena JSONs above to the `arenas` Firestore collection
3. Use idempotent `setDoc` with `merge: false` (replace, don't merge) to allow clean re-seeds
4. Run AFTER the `arenaConfigNew.ts` schema additions are in place

**npm script addition to package.json**:
```json
"seed:arenas:p1": "ts-node scripts/seed-arenas-p1.js",
"seed:arenas:p3": "ts-node scripts/seed-arenas-p3.js"
```

**Seeding order** (dependency-safe):
1. `seed:arenas:p1` → Spin Stadium, BB-10, B-09, Xtreme Stadium (no code deps)
2. `seed:arenas` (existing) → baseline arenas already in collection
3. `seed:arenas:p3` → Desert, Balkov, Baikal, Survival, Hyper Wrap (deps: `floorHazardZones[]` processor)
4. Robert's Olympia, BEGA/Wilderness/JF aliases — can run any time

---

## 8. Summary

| Metric | Count |
|---|---|
| Arenas fully seeded (P1–P3) | 14 |
| Arenas blocked on schema extension | 6 |
| Arenas deferred (fundamental changes) | 5 |
| New TypeScript interfaces | 5 (GearRailConfig, ScoringZoneConfig, TornadoRidgeConfig, ZeroGConfig, TiltMechanicConfig) |
| New ArenaConfig fields | 5 (gearRails, scoringZones, tornadoRidge, zeroG, staminaDrainMultiplier) |
| ArenaShape addition | 1 ("rectangle") |
| PitType additions | 4 (penalty_well, xtreme_zone, over_zone, spike_pit) |
| New ArenaFeatureProcessor handlers | 5 (processGearRails, processScoringZones, processTornadoRidge, processTiltMechanic, processTriggerZones) |

Source: `research/phases/phase-09-arenas.md`

---

[← Phase 09: Arenas](phase-09-arenas.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 11: Architecture →](phase-11-architecture.md)

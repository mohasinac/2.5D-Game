[← Phase 26: Engine Optimizations](phase-24-engine-optimizations.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 28: View Modes + HUD →](phase-28-view-modes-hud-bitbeast.md)

---

# Phase 27 — Tiered Area of Interest (AoI): Fog of War State Sync

> **Stage 27** — Defines a three-tier LOD model for server-to-client state delivery. The server always holds the full world. Each client receives only what is relevant to its current viewport and floor. Distant beys arrive as lightweight ghost dots; approaching beys arrive as shadow-state with velocity; only beys within the active viewport receive full 60 Hz schema sync. This cuts bandwidth and client CPU proportionally to arena size, and is the specification that supersedes the binary culling described in Phase 22 § 5.
>
> **Design pillars aligned:**
> - **StatDef** (Pillar 3) — `spin_pct` in the ghost schema is a compressed StatDef projection
> - **BehaviorDef** (Pillar 1) — tier promotion rules (elevator shaft bonus) reference `mechanic_defs` portal subtype
> - **GeometryDef** (Pillar 2) — OUTER_RADIUS_CM matches the minimap ViewBox half-width defined in Phase 22 § 6

---

## Diagrams

### Three-Tier AoI Zones (top-down, same floor)

```
              ←———————————————— 200 cm arena cross-section ————————————————→

  ╔══════════════════════════════════════════════════════════════════════════╗
  ║  Tier 0   ║  Tier 1  ║         Tier 2         ║  Tier 1  ║  Tier 0   ║
  ║  (Ghost)  ║ (Shadow) ║       (Full Sync)       ║ (Shadow) ║  (Ghost)  ║
  ║           ║          ║                         ║          ║           ║
  ║  dot on   ║  ghost   ║  full sprite, particles ║  ghost   ║  dot on   ║
  ║  minimap  ║  sprite  ║  spin ring, HUD         ║  sprite  ║  minimap  ║
  ║  only     ║  no FX   ║  60 Hz                  ║  no FX   ║  only     ║
  ║  10 Hz    ║  20 Hz   ║                         ║  20 Hz   ║  10 Hz    ║
  ╚══════════════════════════════════════════════════════════════════════════╝
       >100cm   60–100cm        ≤60cm        60–100cm      >100cm
                          ★ = Player Bey
                     ← viewport (50cm) →← buffer (10cm) →

  Constants:
    VIEWPORT_HALF_CM  = 50    (player can see 50cm radius)
    INNER_RADIUS_CM   = 60    (Tier 2 boundary; 10cm eager buffer beyond viewport edge)
    OUTER_RADIUS_CM   = 100   (Tier 1 boundary; also = minimap radius)
```

### Multi-Floor AoI (building metaphor)

```
  Floor 3   ●━━━━━━━━━━━━━━━●   floorDelta=3 from player → Tier 0 (ghost dot, floor stack only)
  ─────────────────────────────────────────────────────
  Floor 2   ●━━━━━━━━━━━━━━━●   floorDelta=2 → Tier 0
  ─────────────────────────────────────────────────────
  Floor 1   ○━━━━━━━━━━━━━━━○   floorDelta=1 → Tier 1  (can "hear through ceiling")
  ─────────────────────────────────────────────────────
  Floor 0   ◌━━━━━━━★━━━━━━◌   floorDelta=0, dist≤60cm → Tier 2 (full)
  (player)         │               dist 60–100cm → Tier 1
  ─────────────────┼───────────────────────────────────
  ELEVATOR   ↕↕↕↕↕↕│↕↕↕↕↕↕   if bey within 10cm of elevator shaft:
  SHAFT      ↕↕↕↕↕↕│↕↕↕↕↕↕   floorDelta threshold for Tier 1 expands +1
                    │              (open-shaft line-of-sight rule)

  ●  Tier 0: ghost dot (minimap floor stack, no world sprite)
  ○  Tier 1: shadow state (ghost sprite in world, velocity arrow on minimap)
  ◌  Tier 2: full state (full sprite, particles, HUD)
```

### Country / City Metaphor

```
  SERVER (The Country — knows everything)
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │   Bey A  Bey B  Bey C  Bey D  Bey E  Bey F  Bey G  Bey H  Bey I   │
  │   (full physics running for ALL of these every tick at 60 Hz)       │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
           │                         │                      │
           ▼ broadcast ghost         ▼ filterBy Tier 2      ▼ broadcast ghost
  ┌────────────────┐        ┌─────────────────┐    ┌────────────────┐
  │ CLIENT A       │        │ CLIENT B        │    │ CLIENT C       │
  │ (Player in     │        │ (Player in      │    │ (Player far    │
  │  Hyderabad)    │        │  Hyderabad      │    │  away)         │
  │                │        │  moving toward  │    │                │
  │  ★ = my bey   │        │  A)             │    │  ★ = far bey  │
  │  ● B = dot    │        │  ◌ A = full     │    │  ● A,B = dots │
  │  ● C = dot    │        │  ○ others = ghost│    │               │
  └────────────────┘        └─────────────────┘    └────────────────┘

  "I am in Hyderabad. My friend B is in Delhi — I see them as a dot.
   As B boards a train and closes in, I start getting velocity data.
   When B reaches my neighborhood (60cm), I get their full state."
```

### Ghost → Full Transition Flow

```
  Distance decreasing ──────────────────────────────────────────────────→

  >100cm          100cm           65cm           60cm           <60cm
    │               │               │               │               │
    ▼               ▼               ▼               ▼               ▼
  [NO DATA]    [TIER 0→1        [TIER 1:        [EAGER         [TIER 2:
               promoted:         shadow          PROMOTE:       full schema
               ghost schema      sprite          server sends   arrives,
               + velocity        rendered        full schema    opacity
               sent at 20Hz]     in world,       2 ticks        ramps from
                                 dot+arrow       early]         0.3→1.0]
                                 on minimap]
```

### Client Renderer Decision Tree

```
  For each bey on this tick:

  Is bey.id in state.beyblades (full schema)?
    YES ─→ Tier 2 render:
              draw full sprite at 1.0 opacity
              draw particle effects
              draw spin ring + HUD elements
              show on minimap as dot (from ghost schema)
     NO ─→ Is bey.id in state.beyGhosts?
              NO ─→ skip (not on this floor stack, not nearby)
             YES ─→ ghost.tier == 1?
                     YES ─→ Tier 1 render:
                               draw sprite at 0.3 opacity (grayscale filter)
                               NO particles, NO spin ring, NO HUD
                               show velocity arrow on minimap dot
                      NO ─→ Tier 0 render:
                               do NOT draw sprite in world
                               show dot on minimap only (color = ghost.teamId)
```

---

## 1. Design Principle

The server is the country. It runs full physics for every bey at 60 Hz regardless of where any client is looking. Clients are individuals in cities: each one only cares about their immediate vicinity.

**Country metaphor**: You are in Hyderabad. Your friend is in Delhi. On a country-level map, you both appear as colored dots — you know they exist and roughly where they are. As your friend boards a train and begins closing in, you start receiving richer data: their speed, direction, ETA. The moment they reach your neighborhood, you receive their full real-time position, condition, and behavior.

**Building metaphor**: You are on the 10th floor. Your friend is on the 1st floor. In the building's floor-stack side view, they appear as a dot on Floor 1. You do not receive their spin, tilt, or velocity until they climb near your floor. If they enter the elevator shaft, you can "see" them through the open shaft one floor sooner than you otherwise would.

**Applied to Beyblade**: The server is the country — full world state always. Each client is a citizen. The deliverable is a three-tier delivery system that makes bandwidth and CPU scale with arena size instead of growing linearly with bey count.

---

## 2. Constants

```typescript
// Shared between server and client (shared/constants/aoi.ts)
export const VIEWPORT_HALF_CM   = 50;   // player sees 50cm radius (100cm viewport)
export const INNER_RADIUS_CM    = 60;   // Tier 2 boundary — full schema, filterBy
export const OUTER_RADIUS_CM    = 100;  // Tier 1 boundary — ghost shadow, minimap radius
export const GHOST_HZ           = 10;   // Tier 0 ghost update frequency
export const SHADOW_HZ          = 20;   // Tier 1 shadow update frequency
export const FULL_HZ            = 60;   // Tier 2 full sync frequency
export const ELEVATOR_AoI_BONUS_CM = 10; // proximity to elevator shaft for floor-tier bonus
export const TIER1_OPACITY      = 0.3;  // ghost sprite opacity
export const TIER_FADE_MS       = 200;  // transition time Tier1↔Tier2
export const TIER_GHOST_FADE_MS = 100;  // transition time Tier0↔Tier1
```

---

## 3. Tier Definitions

| Tier | Name | Distance Condition | Floor Condition | Update Hz | Server sends | Client renders |
|------|------|-------------------|-----------------|-----------|-------------|----------------|
| 0 | Ghost/Dot | > OUTER_RADIUS_CM | OR floorDelta ≥ 2 | 10 | id, x, y, floorIndex, teamId | minimap dot only |
| 1 | Shadow | INNER_RADIUS_CM < dist ≤ OUTER_RADIUS_CM | OR floorDelta == 1 | 20 | Tier 0 + vx, vy, tiltAngle, spin_pct, beyType | ghost sprite (0.3 opacity) + minimap velocity arrow |
| 2 | Full | dist ≤ INNER_RADIUS_CM | AND floorDelta == 0 | 60 | Full Colyseus Beyblade schema | full sprite, particles, HUD |

**Self bey** (the player's own bey) is always Tier 2 regardless of position — the player always has full knowledge of themselves.

**Spectators** bypass all tier rules — they receive all beys as Tier 2 (free camera requires full state everywhere).

---

## 4. Ghost Schema (Tier 0 + Tier 1)

A lightweight Colyseus schema broadcast to **all clients** with no `filterBy`. This is the "country dot layer" — every client always knows where every bey is in compressed form.

```typescript
// src/schema/BeyGhostState.ts
import { Schema, type } from "@colyseus/schema";

export class BeyGhostState extends Schema {
  @type("string")  id: string = "";
  @type("number")  x_cm: number = 0;
  @type("number")  y_cm: number = 0;
  @type("int8")    floorIndex: number = 0;
  @type("string")  teamId: string = "";
  @type("uint8")   tier: number = 0;      // 0 = ghost dot, 1 = shadow

  // Tier 1 extras (populated when tier == 1, zeroed when tier == 0):
  @type("number")  vx_cm: number = 0;     // velocity x in cm/s
  @type("number")  vy_cm: number = 0;     // velocity y in cm/s
  @type("number")  tiltAngle: number = 0; // degrees, for ghost sprite tilt
  @type("uint8")   spin_pct: number = 0;  // 0–100 (compressed spin ratio)
  @type("string")  beyType: string = "";  // "attack"|"defense"|"stamina"|"balanced"
}
```

Add to `GameState.ts`:
```typescript
@type({ map: BeyGhostState })
beyGhosts: MapSchema<BeyGhostState> = new MapSchema();
```

`beyGhosts` is **always populated for every bey** in the room — including the player's own bey. The client uses it as the authoritative source for minimap rendering, regardless of tier.

---

## 5. Full Schema Filter (Tier 2)

The existing `beyblades: MapSchema<Beyblade>` gains a `filterBy` callback. Only Tier 2 beys are delivered:

```typescript
// BattleRoom.ts — in addBeybladeToState() or equivalent setup
this.state.beyblades.onAdd((bey, key) => {
  // no per-entry filter needed — room-level filter applies
});

// Set room-level filter (called once in onCreate after state is created):
this.state.beyblades.setFilter((client: Client, beyblade: Beyblade) => {
  // Spectators: always receive everything
  if (client.userData.isSpectator) return true;

  const ownId = this.playerBeyIds.get(client.sessionId);
  if (!ownId) return false;

  // Self: always Tier 2
  if (beyblade.beybladeId === ownId) return true;

  const ownBey = this.state.beyblades.get(ownId);
  if (!ownBey) return false;

  const dx = ownBey.x - beyblade.x;
  const dy = ownBey.y - beyblade.y;
  const distCm = Math.sqrt(dx * dx + dy * dy) / PX_PER_CM;
  const floorDelta = Math.abs(ownBey.beyFloorIndex - beyblade.beyFloorIndex);

  return distCm <= INNER_RADIUS_CM && floorDelta === 0;
});
```

---

## 6. Tier Computation (Server Tick)

Each tick, the server computes the tier for every (bey, client) pair when populating `beyGhosts`. Because `beyGhosts` is broadcast-all, the server sets `ghost.tier` to the **maximum tier this bey would be for any client** — no, that is wrong. `beyGhosts` is one record per bey (not per client), so the tier stored is the bey's **current positional tier relative to the server** — i.e., the tier the server will assign when comparing against any specific client.

Correct approach: `beyGhosts` stores the raw compressed position data only. The **client** reads its own bey's position from `beyblades` (Tier 2) or `beyGhosts` and computes which tier each ghost is relative to itself locally:

```typescript
// Client-side tier computation (runs in renderer or Colyseus sync hook)
function computeTier(
  ghost: BeyGhostState,
  selfBey: Beyblade,
  beyblades: MapSchema<Beyblade>
): 0 | 1 | 2 {
  // If the full schema arrived for this bey, it is Tier 2
  if (beyblades.has(ghost.id)) return 2;

  const dx = selfBey.x_cm - ghost.x_cm;
  const dy = selfBey.y_cm - ghost.y_cm;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const floorDelta = Math.abs(selfBey.floorIndex - ghost.floorIndex);

  if (floorDelta >= 2) return 0;
  if (floorDelta === 1) return 1;                        // building rule
  if (dist > OUTER_RADIUS_CM) return 0;
  if (dist > INNER_RADIUS_CM) return 1;
  return 1; // should not reach here — full schema should have arrived
}
```

The server sets `ghost.tier` as a **hint** to the client: it is the tier the server computed when it last populated the ghost record. Client uses this as the initial tier and can locally verify. They will always agree because both use the same constants.

**Server ghost population (tick function)**:

```typescript
// In BattleRoom.tick():
// Ghost updates are throttled per tier:
const isGhostTick   = this.tickCount % 6 === 0;  // 10 Hz for Tier 0
const isShadowTick  = this.tickCount % 3 === 0;  // 20 Hz for Tier 1

if (isGhostTick || isShadowTick) {
  this.state.beyblades.forEach((bey, id) => {
    let ghost = this.state.beyGhosts.get(id);
    if (!ghost) {
      ghost = new BeyGhostState();
      ghost.id = id;
      this.state.beyGhosts.set(id, ghost);
    }

    // Always update position (needed for all tiers)
    ghost.x_cm = bey.x / PX_PER_CM;
    ghost.y_cm = bey.y / PX_PER_CM;
    ghost.floorIndex = bey.beyFloorIndex;
    ghost.teamId = bey.teamId ?? "";

    // Compute this bey's tier relative to the "average" client — actually
    // we populate Tier 1 extras whenever the bey MIGHT be Tier 1 for any client.
    // Cost is negligible: it is just writing a few numbers.
    ghost.vx_cm = bey.velocityX / PX_PER_CM;
    ghost.vy_cm = bey.velocityY / PX_PER_CM;
    ghost.tiltAngle = bey.beyTiltAngle;
    ghost.spin_pct = Math.round((bey.spin / bey.maxSpin) * 100);
    ghost.beyType = bey.beyType ?? "";
    ghost.tier = 1; // client will demote to 0 locally if dist > OUTER_RADIUS_CM
  });
}
```

Populating all Tier 1 fields always is a small cost — it avoids conditional branching and ensures the client always has fresh velocity/tilt data the moment a bey enters the shadow zone.

---

## 7. Multi-Floor AoI: Building Rules

```
floorDelta = |playerBey.floorIndex - otherBey.floorIndex|

Tier table (multi-floor):

floorDelta  |  horizontal dist  |  Tier
────────────┼───────────────────┼──────
    0       |    ≤ 60 cm        |   2   ← Full sync
    0       |  60–100 cm        |   1   ← Shadow
    0       |   > 100 cm        |   0   ← Ghost dot
    1       |    any            |   1   ← Shadow (hear through floor)
    ≥ 2     |    any            |   0   ← Ghost dot

Elevator shaft proximity bonus:
  If otherBey.x_cm within ELEVATOR_AoI_BONUS_CM of an elevator portal AND
     playerBey.x_cm within ELEVATOR_AoI_BONUS_CM of the same portal:
    → floorDelta threshold for Tier 1 expands: floorDelta ≤ 2 → Tier 1
    → floorDelta threshold for Tier 2 expands: floorDelta ≤ 1 AND dist ≤ 30cm → Tier 2
    (Both beys are near the open shaft — the shaft is the "open door" line-of-sight)
```

The elevator bonus models the intuition: if you are standing at an elevator door and your friend is at the elevator door one floor below, you can lean over and see them directly.

---

## 8. Delta Zone: Pre-loading and Pop-in Prevention

When a bey crosses from Tier 1 → Tier 2 (dist decreasing past INNER_RADIUS_CM), the full schema message arrives 1–2 ticks after the threshold is crossed (network + processing latency). To prevent a visual pop-in:

**Server side — eager promotion**: When the server detects a bey will cross INNER_RADIUS_CM within 2 ticks (using current velocity):
```
projected_dist = dist - |velocity_cm_per_tick| * 2
if projected_dist < INNER_RADIUS_CM:
  → include this bey in full-schema send for this client immediately
```
This pre-sends the full schema 2 ticks early: `INNER_RADIUS_CM + (|v| * 2)` as the actual cutoff.

**Client side — interpolation while waiting**: When `ghost.tier` flips to 1 and the client has not yet received the full schema:
- Use `ghost.vx_cm`, `ghost.vy_cm` to interpolate position forward each frame
- Render ghost sprite at 0.3 opacity
- When full schema arrives: transition opacity 0.3 → 1.0 over TIER_FADE_MS (200ms)

**Tier 2 → Tier 1 transition** (bey moving away past INNER_RADIUS_CM + hysteresis):
- Hysteresis band = 5cm: Tier 2 exits at 65cm, Tier 1 exits at 60cm (prevents oscillation at boundary)
- Full schema stops being sent; ghost schema continues
- Client fades sprite from 1.0 → 0.3 over 150ms

```
Hysteresis:
  TIER2_EXIT_CM  = INNER_RADIUS_CM + 5  = 65cm  (once leaving, Tier 2 → Tier 1 at 65cm)
  TIER1_EXIT_CM  = OUTER_RADIUS_CM + 5  = 105cm (once leaving, Tier 1 → Tier 0 at 105cm)
  TIER2_ENTER_CM = INNER_RADIUS_CM      = 60cm  (entering, Tier 1 → Tier 2 at 60cm)
  TIER1_ENTER_CM = OUTER_RADIUS_CM      = 100cm (entering, Tier 0 → Tier 1 at 100cm)
```

---

## 9. Feature State Culling (Static and Dynamic)

Features (obstacles, turrets, pits, portals, spin zones) are **static** — their geometry doesn't change after room start. Client receives the full ArenaConfig at room join from Firestore. No culling needed for feature geometry.

**Dynamic feature state** (turret health, switch on/off, wrecking ball position, gravity hole spin) is filtered at the same OUTER_RADIUS_CM boundary:

```typescript
// In BattleRoom.ts — dynamic feature state update:
this.state.featureTick.forEach((featureState, featureId) => {
  const feature = this.arenaConfig.getFeatureById(featureId);
  if (!feature) return;
  
  // Send dynamic state only to clients within OUTER_RADIUS_CM of the feature
  featureState.setFilter((client: Client, value) => {
    const ownBey = this.getBeyForClient(client);
    if (!ownBey) return true; // spectator
    const dx = ownBey.x / PX_PER_CM - feature.x_cm;
    const dy = ownBey.y / PX_PER_CM - feature.y_cm;
    return Math.sqrt(dx*dx + dy*dy) <= OUTER_RADIUS_CM;
  });
});
```

For arenas > 150cm: a spatial grid (cell size = OUTER_RADIUS_CM) on the server provides O(1) feature proximity lookup rather than iterating all features.

---

## 10. Minimap Rule: Always Ghost Data

The minimap **never uses the full `beyblades` schema**. It always reads from `beyGhosts`. This is the "country map dot rule" — on the country map, everyone is just a dot.

```
Minimap rendering source:

  beyGhosts.forEach((ghost) => {
    if (ghost.id === selfId) return; // self is always at center, skip
    const dist = distanceToCm(selfBey, ghost);
    if (dist > OUTER_RADIUS_CM) return; // off-minimap (beyond radar range)
    
    // All beys within 100cm appear as dots, regardless of tier
    drawDot(minimap, ghost.x_cm, ghost.y_cm, ghost.teamId);
    
    // Tier 1: add velocity arrow
    if (ghost.tier === 1) {
      drawVelocityArrow(minimap, ghost.x_cm, ghost.y_cm, ghost.vx_cm, ghost.vy_cm);
    }
  });
```

Rules:
- No bey ever shows more than a dot + optional velocity arrow on the minimap
- Player's own bey: always center dot (yellow or white)
- All other beys: colored dot by teamId
- Tier 0 beys within 100cm: plain dot (no velocity arrow)
- Tier 1 beys: dot + small direction arrow
- Beys beyond 100cm: not on minimap at all (off-radar)
- Multi-floor: TopView shows beys on the same floor as the player (`ghost.floorIndex === selfFloorIndex`); SideView shows all floors as the floor-stack row dots

The minimap is a **position radar**, not a state display. It answers "where are they?" not "how are they?".

---

## 11. Spectator Mode

Spectators receive all beys as Tier 2 with no filtering. This is required because:
- The spectator camera can travel anywhere in the arena
- Spectators need full state to render particles, spin rings, and HUD for any bey

When a client joins with `{ spectate: true }`:
```typescript
// In the filterBy callback:
if (client.userData.isSpectator) return true;
```

The `beyGhosts` layer is still sent to spectators — they use it for the minimap, which always shows ghost dots.

---

## 12. Performance Impact Estimate

| Scenario | Without Phase 27 | With Phase 27 | Reduction |
|----------|-----------------|---------------|-----------|
| 2-player, 30cm arena | Both beys always Tier 2 | Same | 0% (small arena — all in range) |
| 4-player, 100cm arena | 4× full schemas per client | ~2 Tier 2 + 2 Tier 0/1 | ~35% |
| 20-player royale, 500cm arena | 20× full schemas per client | ~2–4 Tier 2 + rest ghost | ~80% |
| 20-player royale, client CPU | Renders 20 full sprites | Renders ~3 full + ~5 ghost + ~12 dot | ~70% GPU draw calls |

Ghost schema per bey: ~40 bytes (vs full Beyblade schema ~300 bytes). At 20 beys × 10Hz ghost vs 60Hz full: ghost broadcast = 20 × 40 × 10 = 8 KB/s per client (vs 20 × 300 × 60 = 360 KB/s without culling).

---

## 13. Integration with Other Phases

| Phase | What changes |
|-------|-------------|
| Phase 22 § 5 | Binary `CULL_RADIUS_CM = 60cm` is superseded. Replace with: "See Phase 27 — tiered AoI. INNER_RADIUS_CM = 60cm, OUTER_RADIUS_CM = 100cm." |
| Phase 26 N2 (AoI royale) | N2 was described as "skip full state for beys outside 600px, send position only". Phase 27 formalises this as the three-tier ghost schema system. N2 is now satisfied by this phase. |
| Phase 23 (Preset Library) | No change. Preset save/load is admin-only and has no AoI concern. |
| Phase 24 (Semi-autonomous control) | AI beys still run server-side at full fidelity. The client-facing AI bey is culled like any other bey — no special handling needed. |
| Phase 25 (Battle Royale) | 20-player mode is the primary beneficiary. OUTER_RADIUS_CM = 100cm applied; beys spread across 500cm arena → only ~4–6 beys in range per client at any time. |

---

## 14. Seed / Config Values

```typescript
// shared/constants/aoi.ts  (new file — import in both server and client)
export const AoI = {
  VIEWPORT_HALF_CM:     50,
  INNER_RADIUS_CM:      60,
  OUTER_RADIUS_CM:      100,
  TIER2_EXIT_CM:        65,    // hysteresis: exit Tier 2 slightly later than enter
  TIER1_EXIT_CM:        105,   // hysteresis: exit Tier 1 slightly later
  ELEVATOR_BONUS_CM:    10,    // proximity to elevator shaft for floor-tier bonus
  GHOST_HZ:             10,
  SHADOW_HZ:            20,
  FULL_HZ:              60,
  TIER1_OPACITY:        0.3,
  TIER_FADE_MS:         200,
  TIER_GHOST_FADE_MS:   100,
} as const;
```

Example ghost schema sizes (Colyseus binary encode estimate):
- Tier 0 ghost (tier=0, no velocity): ~20 bytes per bey
- Tier 1 shadow (tier=1, + velocity, tilt, spin_pct, beyType): ~52 bytes per bey
- Full Beyblade schema: ~280–320 bytes per bey

At 20 beys, 500cm arena, 4 players each receiving ~4 Tier 2 + ~6 Tier 1 + ~10 Tier 0:
- Ghost broadcast: 20 × 40 bytes avg × 10Hz = 8,000 B/s per client
- Full schema (4 beys × 300 bytes × 60Hz): 72,000 B/s per client
- Total: ~80 KB/s per client (vs 360 KB/s without culling)

---

## Implementation Status (audit 2026-05-24)

| Component | Status | Notes |
|-----------|--------|-------|
| `BeyGhostState` schema class | ❌ Missing | Not in `server/rooms/schema/` |
| `beyGhosts MapSchema` on `GameState` | ❌ Missing | Not in `GameState.ts` |
| `server/shared/constants/aoi.ts` constants | ❌ Missing | File does not exist |
| `filterBy` on `beyblades` MapSchema | ❌ Missing | No `setFilter` call in any room |
| Ghost population tick (10Hz / 20Hz) | ❌ Missing | Not in any room tick |
| Client tier computation in `PixiRenderer.ts` | ❌ Missing | No tier-based rendering logic |
| Tier 1 ghost sprite (0.3 opacity, grayscale) | ❌ Missing | Not in renderer |
| Tier 0 minimap dot | ❌ Missing | Minimap does not read from `beyGhosts` |
| Hysteresis bands (65cm exit / 105cm exit) | ❌ Missing | Depends on above |
| Multi-floor building line-of-sight rules | ❌ Missing | `beyFloorIndex` absent |
| Delta-zone pre-loading | ❌ Missing | No pre-load logic |

---

[← Phase 26: Engine Optimizations](phase-24-engine-optimizations.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 28: View Modes + HUD →](phase-28-view-modes-hud-bitbeast.md)

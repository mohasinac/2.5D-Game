[← Phase 23: Battle Modes](phase-23-battle-modes.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 27: Tiered AoI →](phase-27-tiered-aoi.md)

---

# Phase 24 — Engine Optimizations: PixiJS · Colyseus · Matter.js

> **Stage 24** — Performance optimization catalogue for the three engine layers:
> PixiJS 8.14.0 WebGL renderer (client), Colyseus 0.15 server (network), Matter.js (physics).
> All techniques are additive and non-breaking — they improve performance without changing
> game behavior.
>
> **Foundation constraint**: Physics engine (Matter.js 2D, 60 Hz), Colyseus schema sync, PixiJS
> 5-layer render stack, and all game logic remain unchanged. These optimizations operate on top
> of the existing foundation — no physics refactor, no schema redesign, no renderer swap.

---

## 1. Rendering Optimizations (PixiJS 8.14.0)

Current state from renderer survey: all visuals drawn as `PIXI.Graphics` primitives each frame,
no texture atlas, no `ParticleContainer`, no `cullable` flags, no client-side prediction.

### R1 — Frustum / Viewport Culling (`cullable = true`)

**PixiJS built-in.** Set once in `PixiRenderer.init()`:
```typescript
beyContainer.cullable     = true;
featureLayer.cullable     = true;
particleLayer.cullable    = true;
```
PixiJS skips render calls for containers whose bounds fall outside the screen rect.
At high zoom most arena features are off-screen — their draw calls drop to zero.

**Estimated gain: 15–25% fewer draw calls when zoomed.**

### R2 — ParticleContainer for Particles

**PixiJS built-in** — replaces `Container` for homogeneous sprite batches.
```typescript
const sparkPool = new PIXI.ParticleContainer(2000, {
  position: true, rotation: true, alpha: true, scale: true,
});
```
Batches all 2000 sprites in one GPU draw call. Requires converting particle sprites from
`PIXI.Graphics` to `PIXI.Sprite` with a shared `RenderTexture` (4×4 white circle, created once).

**Estimated gain: 10–30% for heavy particle scenes (collisions, death spiral).**

### R3 — Bake Static Arena Floor to RenderTexture

**Custom.** Arena floor and walls never change during a match:
```typescript
// After rebuildArenaGeometry():
const arenaTexture = renderer.app.renderer.generateTexture(arenaFloorGraphics);
const arenaSprite  = new Sprite(arenaTexture);
arenaLayer.addChild(arenaSprite);
arenaFloorGraphics.destroy();
```
Invalidation: re-bake only when `tiltAngle` changes (once per tick for `autoTilt` arenas)
or when arena features change mid-match (switch-gated obstacles).

**Estimated gain: 20–40% reduction in GPU work for arena geometry.**

### R4 — Dirty-Flag Graphics Redraws

**Custom.** Beyblade `PIXI.Graphics` currently redraws every frame:
```typescript
if (bey.spin !== bey._lastSpin || bey.material !== bey._lastMaterial) {
  redrawBeyGraphics(bey);
  bey._lastSpin      = bey.spin;
  bey._lastMaterial  = bey.material;
}
```
**Estimated gain: 5–15% for idle beys (no collision, no spin change).**

### R5 — LOD (Level of Detail) for Distant Beys

**Custom.** In royale full-overview mode with 20 beys:
```typescript
const distToCamera = distanceTo(bey, cameraCenter);
bey.container.children[1].visible = (distToCamera <= 400);  // hide detail layer when far
```
**Estimated gain: 20–30% in royale overview mode.**

---

## 2. Network / Colyseus Optimizations

### N1 — Client-Side Prediction

**Custom — most impactful for input feel.**

Current: `sendInput → server tick → state sync → render`. Latency = one server round-trip.

With prediction: apply movement locally this frame; reconcile with server state:
```typescript
// In game loop (client):
const localBey = { ...serverBey };
applyBlendedMovement(localBey, currentInput, localPhysicsBridge, lastNaturalForce, localAlpha);
// Render from localBey this frame; reconcile on server tick:
if (Math.abs(serverBey.x - localBey.x) > RECONCILE_THRESHOLD) {
  localBey.x = lerp(localBey.x, serverBey.x, 0.5);  // lerp back, not snap
  localBey.y = lerp(localBey.y, serverBey.y, 0.5);
}
```

**Key requirement:** `applyBlendedMovement` + `applySteeringForce` live in
`server/shared/rooms/InputHandler.ts` — importable on client via `shared/` path.
No code duplication required.

**Estimated gain: Input feels lag-free regardless of server round-trip time.**
**Implementation order: Phase 3 — requires correctness testing to avoid jitter.**

### N2 — AoI Culling: Three-Tier Fog of War

> **Fully specified in [Phase 27 — Tiered AoI](phase-27-tiered-aoi.md).** This entry records the optimization; Phase 27 is the implementation authority.

**Colyseus `filterBy` + broadcast ghost schema.**

Three tiers applied to all room types (not royale-only — scales from 2-player to 20-player):
- **Tier 2** (≤60cm, same floor): full `Beyblade` schema via `filterBy`, 60Hz
- **Tier 1** (60–100cm, or floorDelta=1): lightweight `BeyGhostState` broadcast, 20Hz — ghost sprite + velocity
- **Tier 0** (>100cm, or floorDelta≥2): `BeyGhostState` broadcast, 10Hz — minimap dot only

Ghost schema per bey ≈ 40 bytes. Full schema ≈ 300 bytes. At 20 beys, 500cm arena: ~80 KB/s per client vs 360 KB/s without culling.

**Estimated gain: 40–60% BW for 4-player 100cm arena; 75–80% for 20-player 500cm royale.**
**Prerequisite: Phase 27 (BeyGhostState schema + beyGhosts MapSchema added to GameState).**

### N3 — Input Send Deduplication

**Custom:**
```typescript
let lastSentMask = 0;
function sendInputIfChanged(mask: number) {
  if (mask !== lastSentMask) { room.send("input", mask); lastSentMask = mask; }
  // Heartbeat: send once every 500ms even if unchanged (prevents server timeout)
}
```
**Estimated gain: 50–80% reduction in input messages during idle / straight-line movement.**

### N4 — Schema Type Minimization

**Custom.** Use narrowest Colyseus types for new fields:
- `controlAuthority: uint8` (0–100 in 1 byte vs 4 bytes for float32)
- `safeZonePhase: uint8`
- `rageBurstTicks`: NOT on schema — server-side `Map<string, number>` only

**Estimated gain: small but consistent bandwidth reduction.**

---

## 3. Server / Matter.js Optimizations

### S1 — Obstacle Body Sleeping

**Matter.js built-in.** Static bodies benefit automatically when `isStatic: true`.
Verify `createArenaWalls()` and `createObstacles()` set `isStatic: true` on all
wall segments and arena obstacle bodies. Kinematic bodies wake up each tick — static ones don't.

**Estimated gain: 5–10% physics tick time for arenas with many obstacles.**

### S2 — Narrow-Phase Filter for Royale

**Custom.** Pre-filter collision pairs before full processing:
```typescript
Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
  const filtered = pairs.filter(p => {
    const dx = p.bodyA.position.x - p.bodyB.position.x;
    const dy = p.bodyA.position.y - p.bodyB.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (p.bodyA.circleRadius ?? 20) + (p.bodyB.circleRadius ?? 20) + 50;
  });
  processCollisions(filtered);
});
```
**Estimated gain: 10–20% collision processing in 20-player royale.**
**Prerequisite: royale mode (Phase 23) must exist.**

---

## 4. Implementation Priority

| Priority | Optimizations | Reason |
|---|---|---|
| **Phase 1** (low effort, immediate) | R1, R4, N3, N4, S1 | Single-line or small changes; zero risk of behavior change |
| **Phase 2** (medium effort) | R3, R2, R5, S2 | Require texture/container restructuring; test after each |
| **Phase 3** (high effort, high value) | N1, N2 | N1 requires correctness testing (jitter risk); N2 requires Phase 23 first |

---

## 5. Summary Table

| ID | Technique | Engine | Built-in? | Effort | Estimated Gain |
|---|---|---|---|---|---|
| R1 | Frustum culling | PixiJS | YES | Low | 15–25% draw calls |
| R2 | ParticleContainer | PixiJS | YES (once converted) | Medium | 10–30% particles |
| R3 | Bake arena floor | PixiJS RenderTexture | YES (once written) | Medium | 20–40% arena render |
| R4 | Dirty-flag redraws | Custom | No | Low | 5–15% idle |
| R5 | LOD distant beys | Custom | No | Low | 20–30% royale |
| N1 | Client-side prediction | Custom (shared/ code) | No | High | Input latency → ~0ms |
| N2 | AoI culling (royale) | Colyseus filter | Partial | Medium | 40–60% royale BW |
| N3 | Input deduplication | Custom | No | Low | 50–80% input msgs |
| N4 | Schema type narrowing | Colyseus types | YES | Low | Small BW |
| S1 | Static body sleeping | Matter.js | YES | Low | 5–10% physics |
| S2 | Narrow-phase filter | Custom | No | Medium | 10–20% royale physics |

---

## Implementation Status (audit 2026-05-24)

| Opt | Status | Notes |
|-----|--------|-------|
| R1 `cullable = true` | ❌ Not applied | `PixiRenderer.ts` 5-layer init does not set `cullable` |
| R2 `ParticleContainer` | ❌ Not applied | Particles use generic `Container` |
| R3 Bake arena floor | ❌ Not applied | Arena geometry redrawn every frame when `arenaRadius === 0` |
| R4 Dirty-flag redraws | ❌ Not applied | No `_lastSpin` / `_lastMaterial` check |
| R5 LOD distant beys | ❌ Not applied | No distance-based detail culling |
| N1 Client-side prediction | ❌ Not applied | Needs Phase 24 `applyBlendedMovement` in `shared/` first |
| N2 AoI culling | ❌ Not applied | Needs Phase 27 `BeyGhostState` first |
| N3 Input dedup | ❌ Not applied | `useGameInput.ts` sends every frame |
| N4 Schema type narrowing | ❌ Not applied | Depends on new fields from Phase 24/25 |
| S1 Static body `isStatic: true` | ❓ Verify | `PhysicsEngine.ts` creates walls — check `isStatic` flag |
| S2 Narrow-phase filter | ❌ Not applied | Needs royale room (Phase 25) first |

---

[← Phase 23: Battle Modes](phase-23-battle-modes.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 27: Tiered AoI →](phase-27-tiered-aoi.md)

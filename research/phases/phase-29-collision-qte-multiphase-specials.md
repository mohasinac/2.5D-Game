[← Phase 28: View Modes + HUD + BitBeast](phase-28-view-modes-hud-bitbeast.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

---

# Phase 29 — Collision QTE Power Meter · Multi-Phase Special Moves · Airborne Physics

> **Stage 29** — Collision-driven QTE mini-game for physical impacts; multi-phase special move
> execution with wind-up/active/wind-down sub-windows; Z-axis airborne physics; aerial clash
> detection; special-vs-special interaction map; key-sequence QTE block restricted to physical
> contact only.
>
> Builds on Phase 22 (semi-autonomous control, collision tiers) and Phase 02 (special moves).
> All diagrams reflect the **collision-only** trigger policy — no range-based counter alerts.

---

## 0. Design Decisions

| Decision | Value |
|----------|-------|
| Collision QTE trigger | Physical Matter.js contact only; combined damage ≥ 15 |
| Split-screen trigger | Physical collision between two special-active beys (ground or aerial) |
| Key-sequence QTE block | Physical collision tick only — no block offered for ranged specials |
| Special targeting | Auto-selects nearest within `moveDef.radius` at fire time; no player selection window |
| Range field | Search distance only — not a counter alert radius |
| No-waste policy | Every special always lands something (fallback phases, partial damage on QTE intercept) |
| **Move grouping** | Kinds collapsed into 4 groups (`strike`, `aerial`, `guard`, `field`); interaction map is group×group (10 entries) instead of kind×kind (11+) |
| Interaction definitions | Stored in `special_interaction_defs` Firestore collection; keyed by `"group:group"`; loaded into in-memory cache at room start |
| Collision event persistence | Every QTE result → `collision_qte_events`; every special clash → `special_clash_events`; both fire-and-forget (no await in game loop) |

---

## 1. Collision QTE Power Meter

### 1.1 Trigger Conditions

```
Each physics tick, after damage calculation for a pair (bey1, bey2):

  if bey1.beyAirborne OR bey2.beyAirborne:
    → apply damage immediately (aerial hit, no QTE)
    → aerial hit factor: damage × 0.7 (reduced traction in air)

  else if (damage1 + damage2) ≥ COLLISION_QTE_MIN_DAMAGE (15)
       AND pair NOT on cooldown (5000ms):
    → startCollisionQTE(id1, id2, damage1, damage2)

  else:
    → apply damage normally (existing path)
```

### 1.2 Power Formula (Diminishing Returns)

```
+12% per mash press while power < 100%
+6%  per mash press while power ≥ 100%
ceiling: 150% (COLLISION_QTE_MAX_POWER)

calcQTEPower(mashCount):
  power = 0
  for i in 0..mashCount:
    power += (power < 100 ? 12 : 6)
    if power >= 150: break
  return power

Mash counts to reach key thresholds:
  80% (special prompt) → 7 presses
  100% (ceiling entry) → 9 presses
  150% (max)          → 17 presses
```

### 1.3 Power Bar Color Ramp

```
0–60%:   green
60–80%:  yellow
80–100%: orange
100%+:   gold/glowing (overcharge zone)
"GETTING HARDER" text pulses above 80%
```

### 1.4 Special Fire During QTE

When `collisionQTEPower ≥ 80` AND `bey.power ≥ 30` (SP):
- Server broadcasts `"collision-qte-special-prompt"` to that player only
- Player presses Space → `"collision-qte-fire-special"` message
- `finalMultiplier = (collisionQTEPower / 100) × (bey.power / 100)`
- `handleSpecialMove(bey, finalMultiplier)` fires; `bey.power = 0`
- This is the ONLY way to achieve a supra-normal special multiplier (> 1.0×)

```
Example: QTE at 125%, SP at 80% → finalMult = 1.25 × 0.80 = 1.00×
Example: QTE at 150%, SP at 60% → finalMult = 1.50 × 0.60 = 0.90×
Example: QTE at 90%, SP at 35%  → finalMult = 0.90 × 0.35 = 0.315× (still fires — no-waste)
```

### 1.5 QTE Resolution

```
After 2500ms window:
  qteMultiplier = bey.collisionQTEPower / 100
  Apply held pendingDamage × qteMultiplier to each opponent's spin/stamina
  Broadcast "collision-qte-result" to both players
  Set pair cooldown 5000ms
  Reset collisionQTEActive = false, collisionQTEPower = 0
```

### 1.6 Constants

| Constant | Value |
|----------|-------|
| `COLLISION_QTE_MIN_DAMAGE` | 15 (combined) |
| `COLLISION_QTE_WINDOW_MS` | 2500 |
| `COLLISION_QTE_COOLDOWN_MS` | 5000 |
| `COLLISION_QTE_MAX_POWER` | 150 |
| `COLLISION_QTE_SPECIAL_THRESHOLD` | 80 |
| Min SP to fire special during QTE | 30 |

---

## 2. Key-Sequence QTE Block (Existing — Collision-Only Restriction)

The existing key-sequence QTE block mechanic is **unchanged in logic** but now gated by physical contact:

- Block prompt is ONLY shown when `hasPhysicalContactThisTick(attackerId, targetId)` returns true
- A purely ranged special (no Matter.js collision pair this tick) receives NO block prompt
- If block fires during physical collision:
  - Special is softened: 40% of special damage still lands (partial hit)
  - Attacker gets 30% SP refund (down from 80%)
  - Physical collision damage is ALSO calculated independently in the same tick
  - If combined collision damage ≥ 15 AND pair not on cooldown → collision QTE triggers as well
  - Both can resolve simultaneously on the same tick

---

## 3. Multi-Phase Special Move Definition

### 3.1 Updated `SpecialMoveDef` Interface

```typescript
interface SpecialMovePhaseEffects {
  linearImpulse?:    number;   // horizontal force on SELF
  verticalImpulse?:  number;   // Z-axis launch on SELF (aerial-launch) OR target (knockupTarget)
  spinDelta?:        number;   // spin change on SELF
  invulnerabilityMs?: number;
  damageMultiplier?: number;
  knockbackImpulse?: number;   // lateral force on target on hit
  knockupTarget?:    boolean;  // verticalImpulse hits TARGET instead of self
  aoeRadiusPx?:      number;
  landingAoePx?:     number;   // AoE on self-landing
  landingDmgMult?:   number;
}

interface SpecialMovePhase {
  phaseId:        string;
  windUpMs:       number;    // self-effects only, no target contact
  durationMs:     number;    // active window (target effects fire here)
  windDownMs:     number;    // no new forces; momentum carries through
  effects:        SpecialMovePhaseEffects;
  targetFlags: {
    canHitGrounded:         boolean;
    canHitAirborne:         boolean;
    requiresAirborneTarget: boolean;
  };
  skipCondition?:    "target_already_airborne" | "target_grounded";
  waitForAirborne?:  number;  // ms to hold when requiresAirborneTarget + target not airborne
  fallback?: {
    effects: SpecialMovePhaseEffects;
    targetFlags: { canHitGrounded: boolean; canHitAirborne: boolean; };
    label: string;
  };
  rangeCheck: "contact" | "radius" | "aoe" | "none";
  peakMs?:           number;  // ms offset from active start where phase is strongest
  peakToleranceMs?:  number;  // ± ms for timing bonus window (default 100ms)
}

interface SpecialMoveDef {
  id:          string;
  name:        string;
  kind:        "linear-burst" | "anchor" | "orbital" | "directional-burst"
             | "shockwave"   | "aerial-launch" | "knockup" | "homerun" | "teleport" | "custom";
  radius:      number;       // auto-target search range (px)
  cooldownSec: number;
  phases:      SpecialMovePhase[];
  flashColor:  string;
}
```

### 3.2 Phase Sub-State Executor

```
Each phase has total wall-clock = windUpMs + durationMs + windDownMs

Sub-state transitions:
  elapsed < windUpMs           → "windup"   (self-effects + approach force; NO target contact)
  elapsed < windUpMs+durationMs → "active"   (full self + target effects)
  elapsed < total              → "winddown" (no new forces; velocity carries naturally)

On sub-state change: broadcast "special-phase-substate" { beyId, phaseId, subState }
On total elapsed: advance specialPhaseIndex → next phase
```

| Sub-state | Self-effects | Target effects | New forces | Phase elapsed advances |
|-----------|-------------|----------------|------------|------------------------|
| `"windup"` | ✓ | ✗ | ✓ (approach ramp) | Yes |
| `"active"` | ✓ | ✓ | ✓ | Yes |
| `"winddown"` | ✗ | ✗ | ✗ | Yes |

### 3.3 waitForAirborne + Fallback (No-Waste)

When `requiresAirborneTarget = true` and target is NOT airborne:

```
Hold phase elapsed (don't advance)
Self-effects still apply every tick (self never loses out)
Track wait elapsed in specialPhaseWaitElapsed Map (server-side, NOT schema)

If target becomes airborne within waitForAirborne window:
  → fire phase effects at full power ✓

If wait expires:
  → use fallback.effects if defined (reduced ground strike)
  → broadcast "special-phase-fallback" { beyId, phaseId, fallbackLabel }
  → if no fallback: phase ends with self-effects only (still not wasted — self launched)
```

### 3.4 skipCondition

At phase activation time (specialPhaseIndex advances to this phase):

```
if skipCondition == "target_already_airborne" AND target.beyAirborne:
  → skip this phase entirely (specialPhaseIndex++)
  → control lock reduced by this phase's total duration (windUp+active+windDown)
  → main attack phase activates sooner (a bonus, not a penalty)
```

### 3.5 Continuous Arc Movement (No Instant Snaps)

- Only `kind: "teleport"` may snap bey position
- All other forces applied via `applyForce()` ramp over windUpMs ticks
- `beyHeight` driven only by physics tick; never set by phase state

```
Wrong: physics.setVelocity(id, vx, vy)
Right: apply partial force each tick over windUpMs
  const rampTicks = Math.ceil(phase.windUpMs / (1000/60));
  const forcePerTick = phase.effects.linearImpulse / rampTicks;
  physics.applyForce(id, forcePerTick * cos(dir), forcePerTick * sin(dir));
```

---

## 4. Airborne Physics (Z-Axis)

### 4.1 New Schema Fields (Beyblade)

```typescript
@type("number")  beyHeight:     number  = 0;     // px above arena floor (0 = grounded)
@type("number")  beyVerticalVel: number = 0;     // upward velocity; decayed by effectiveGravity
@type("boolean") beyAirborne:   boolean = false; // true while beyHeight > 0
```

### 4.2 Per-Tick Airborne Physics (runs for ALL beys, every tick)

```typescript
// Step 1 — airborne physics (BEFORE special phase tick)
if (bey.beyAirborne) {
  bey.beyHeight      += bey.beyVerticalVel * dt;
  bey.beyVerticalVel -= effectiveGravity * dt;
  if (bey.beyHeight <= 0) {
    bey.beyHeight = bey.beyVerticalVel = 0;
    bey.beyAirborne = false;
    onBeyLanded(bey);   // trigger landing AoE if aerial-launch phase
  }
}

// Step 2 — special phase tick
if (bey.specialMoveActive) tickSpecialPhase(bey, dt);

// Step 3 — collision detection + aerial clash
// Step 4 — damage application
```

Height-driven forces are applied as a ONE-TIME burst to `beyVerticalVel` at phase activation,
then gravity decelerates naturally. Phase transitions never reset or snap height.

### 4.3 3D Distance for Aerial Targeting

```typescript
function dist3D(bey1, bey2): number {
  const dx = bey1.x - bey2.x;
  const dy = bey1.y - bey2.y;
  const dz = bey1.beyHeight - bey2.beyHeight;
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}
```

### 4.4 Airborne Visual (2.5D Renderer)

- Bey sprite offset: `-beyHeight` on Y axis (screen space) — appears to rise above floor plane
- Drop shadow: separate sprite at floor position, scaled down as height increases
- Shadow opacity inversely proportional to height: `opacity = max(0.1, 1 - beyHeight/300)`
- Scale of airborne bey sprite: `scale = 1 + beyHeight * 0.0005` (slight perspective grow)
- "AIRBORNE" text label shown in split-screen panels while bey not grounded

---

## 5. Aerial Clash System

### 5.1 Detection (per tick, after individual special phase ticks)

```typescript
function detectAerialClash(beyblades: Beyblade[]) {
  for each pair (bey1, bey2):
    if bey1.beyAirborne && bey2.beyAirborne
    && bey1.specialMoveActive && bey2.specialMoveActive
    && dist3D(bey1, bey2) <= Math.min(moveDef1.radius, moveDef2.radius):
      triggerAerialClash(bey1, bey2);
}
```

### 5.2 Resolution

1. Each bey's current phase `damageMultiplier` applied cross to the other
2. Higher multiplier bey wins momentum direction (stronger knockback vector away from each other)
3. Both `beyAirborne → false` after recoil arc
4. Broadcast `"aerial-clash" { bey1Id, bey2Id, contactPoint3D }` to all clients
5. Client: crossing energy beam visual (two colour-coded beams), screen flash, particle burst
6. No QTE for aerial clashes (beys are airborne — no mash offered)

```
ASCII:
  ← pink beam (bey1)    cyan beam (bey2) →
                    ★ clash point
    ══════════════════╦═══════════════════
    ▌░░░░░░░░░░░░░░░░ ║ ░░░░░░░░░░░░░░░░▐
    ══════════════════╩═══════════════════
  ↙ bey1 flung left       bey2 flung right ↘
     (lands)                    (lands)
```

---

## 6. Split-Screen Cinematic (Collision-Triggered Only)

### 6.1 Trigger Conditions

Split-screen fires ONLY when two special-active beyblades physically collide:
- **Ground clash**: `!bey1.beyAirborne && !bey2.beyAirborne && specialMoveActive (both) && physicalContact`
- **Aerial clash**: `bey1.beyAirborne && bey2.beyAirborne && both specialMoveActive && dist3D ≤ minRadius`

No range-based triggers; no counter alert window.

### 6.2 Panel Layout

```
2 beys:                 3 beys:                4 beys:
┌──────┬──────┐         ┌─────┬─────┬─────┐   ┌─────┬─────┐
│ BEY1 │ BEY2 │         │ B1  │ B2  │ B3  │   │ B1  │ B2  │
│ move │ move │         │     │     │     │   ├─────┼─────┤
│  ⚡  │  🛡  │         │  ⚡ │  🛡 │  ♻  │   │ B3  │ B4  │
└──────┴──────┘         └─────┴─────┴─────┘   └─────┴─────┘
```

- CSS animation: slide in from centre outward → hold → fade on `"split-screen-end"`
- Each panel: progress bar showing that bey's remaining phase duration
- Panels collapse smoothly via CSS flex on `"split-screen-participant-out" { beyId }`

### 6.3 Duration (Server-Driven)

```typescript
// In triggerAerialClash() or ground-clash handler
function totalMoveDurationMs(moveDef: SpecialMoveDef): number {
  return moveDef.phases.reduce((acc, p) =>
    acc + p.windUpMs + p.durationMs + p.windDownMs, 0);
}

const maxEndMs = Math.max(
  Date.now() + totalMoveDurationMs(SPECIAL_MOVES[bey1.specialMove]),
  Date.now() + totalMoveDurationMs(SPECIAL_MOVES[bey2.specialMove])
);

for (const bey of [bey1, bey2]) {
  bey.controlLockedUntilMs = maxEndMs;
  bey.specialMoveActive    = true;
  bey.specialPhaseIndex    = 0;
  bey.specialPhaseElapsed  = 0;
}
```

Server broadcasts `"split-screen-end"` when the last `specialMoveActive → false` tick fires.
Client ends cinematic on receipt, not on a fixed timer.

---

## 7. Special-vs-Special Interaction Map

### 7.1 Move Groups

Rather than one entry per kind×kind pair, kinds are collapsed into **4 groups**. The interaction map is group×group — **10 entries** instead of 13+ kind-pair entries.

```typescript
type SpecialMoveGroup = "strike" | "aerial" | "guard" | "field";
```

| Group | Kinds | Description |
|-------|-------|-------------|
| `strike` | `linear-burst`, `directional-burst`, `homerun` | Forward-charging momentum attacks |
| `aerial` | `aerial-launch`, `knockup` | Height-based (self launches or sends target airborne) |
| `guard` | `anchor` | Stationary absorption + spin-steal |
| `field` | `orbital`, `shockwave` | Area-of-effect and path-deviation |

Each `SpecialMoveDef` gets a `group: SpecialMoveGroup` field. `resolveSpecialVsSpecial` builds the lookup key from groups, not kinds:
```typescript
const key = `${SPECIAL_MOVES[attBey.specialMove].group}:${SPECIAL_MOVES[defBey.specialMove].group}`;
```

Sub-kind modifiers (§7.5) layer on top of the group outcome for specific kinds that have unique secondary effects (e.g., `homerun` tilt, `shockwave` splash to bystanders).

### 7.2 Storage Architecture — Firestore-Backed, Per-Collision Lookup

Interaction definitions live in the **`special_interaction_defs`** Firestore collection. Each document id is the `"group:group"` key (**10 docs total**). No static global constant exists at runtime.

**At room start** (`BattleRoom.onCreate`): all docs loaded into `specialInteractionCache: Map<string, SpecialInteractionDef>`. The 60Hz game loop reads the cache only — zero Firestore calls in the tick.

**Per collision** (`resolveSpecialVsSpecial`): resolved outcome written to **`special_clash_events`** as fire-and-forget (no `await`).

```
special_interaction_defs/{group:group}     ← 10 documents
  attackerDamageScale: number
  defenderDamageScale: number
  attackerSpinDelta: number
  defenderSpinDelta: number
  attackerKnockback: "none" | "partial" | "full" | "reversed" | "enhanced"
  defenderKnockback: "none" | "partial" | "full" | "reversed" | "enhanced"
  timingBonus?: { peakFor: "attacker"|"defender"|"both", bonusScale: number, conditionDescription: string }
  description: string

special_clash_events/{auto-id}
  matchId, roomId
  attackerBeyId, defenderBeyId
  interactionKey: string          ← "strike:guard"
  attackerGroup, defenderGroup
  attackerKind, defenderKind      ← logged for analytics / sub-kind modifier tracing
  attackerScale: number
  defenderScale: number
  attAtPeak: boolean
  defAtPeak: boolean
  timingBonusApplied: boolean
  timestamp: number
```

### 7.3 When It Applies

When `applyPhaseEffectsToTarget` is called and `target.specialMoveActive = true`:
→ call `resolveSpecialVsSpecial(attBey, defBey, attPhase, defPhase)`
→ look up `specialInteractionCache.get(key) ?? DEFAULT_CLASH_OUTCOME`
→ apply sub-kind modifier if attacker kind has one (§7.5)
→ write result to `special_clash_events` (fire-and-forget)

### 7.4 Timing Bonus

Each phase has `peakMs` (ms offset from active start) and `peakToleranceMs` (± window).
Contact at peak → timing bonus from the interaction def applies to that side.
Broadcast `"special-interaction-result"` → client shows "PERFECT TIMING!" flash.

### 7.5 Group × Group Interaction Matrix (10 entries)

| Attacker Group | Defender Group | Outcome |
|---------------|---------------|---------|
| `strike` | `strike` | Both at full `damageMultiplier`; higher-spin bey pushes the other back more; **timing bonus**: contact at midpoint of BOTH active windows → both get +1.2× (perfect clash) |
| `strike` | `aerial` | Direction-dependent — ascending aerial: attacker 0.7× dmg + spin steal 0.15×. Diving aerial: aerial wins (+20% upper bonus); strike linearImpulse negated by downward impact |
| `strike` | `guard` | Guard invuln (attacker 0 damage); defender spin steal × 1.5 if contact within first 200ms of guard active — **timing bonus**: peakFor "defender" |
| `strike` | `field` | vs shockwave: detonates at contact; attacker takes 0.5× AoE blast. vs orbital: orbital full knockback off path; attacker 0.8× damage |
| `aerial` | `aerial` | **AERIAL CLASH** (see §5) — each takes the other's current phase `damageMultiplier`; higher mult wins momentum; both flung in opposite vectors |
| `aerial` | `guard` | Guard invuln applies; **no spin steal** (contact too brief — sweep/dive has no sustained ground contact); 0 damage regardless of aerial sub-kind |
| `aerial` | `field` | vs orbital: path disrupted 500ms; aerial 0.9× damage. vs shockwave: detonates below airborne bey (AoE from below); aerial takes 0.4× blast |
| `guard` | `guard` | Both stationary; no contact — each restores spin independently; no damage, no knockback |
| `guard` | `field` | vs shockwave: guard invuln + counter-pulse reduces AoE radius 30%. vs orbital: glancing 0.4× on orbital; guard unmoved |
| `field` | `field` | vs orbital×orbital: glancing 0.4× each; paths deflect ±30°; no knockback. vs shockwave×shockwave: AoEs merge at contact → combined 1.3× radius blast to all beys in range |

### 7.6 Sub-Kind Modifiers (applied after group outcome)

| Kind | Group | Additional effect layered on top of group outcome |
|------|-------|--------------------------------------------------|
| `homerun` | `strike` | On any defender contact: `beyTiltAngle += 15°` on defender regardless of outcome (even vs guard invuln) |
| `knockup` | `aerial` | Phase 0 sweep only: if defender is guard, override to 0 damage (sweep too fast for guard timing) |
| `shockwave` | `field` | AoE spreads from contact point — non-participant beys within `aoeRadiusPx` take 0.3× splash |
| `orbital` | `field` | Path disruption: target velocity direction deflected ±30° on contact (applies on top of group knockback) |

---

## 8. Contact Points During Special Phase Hits

The 2.5D CP system is consulted for special phase hits (not just normal collisions).

```typescript
function calculateSpecialContactDamage(phase, ca1, ca2, parts1, parts2) {
  const attackerCP  = findActiveCPAtAngle(parts1, ca1);
  const defenderCP  = findActiveCPAtAngle(parts2, ca2);
  const attackTypeMult = getAttackTypeMult(attackerCP?.attackType);  // smash=1.2, upper=1.4, etc.
  const defenseAbsorb  = defenderCP?.layer === "guard" ? 0.8 : 1.0;
  return phase.effects.damageMultiplier * attackTypeMult * defenseAbsorb * baseDamage;
}
```

Example: phase mult 2.0× + upper attackType (1.4×) + guard absorb (0.8×) = **2.24× effective**

---

## 9. Ground Recoil + Tilt (applyHitRecoil)

```typescript
function applyHitRecoil(target, contactAngle, hitForce, attackerH, targetH) {
  // 1. Lateral recoil
  physics.applyForce(target.id, lateralForce × cos(ca), lateralForce × sin(ca));

  // 2. Vertical component (hit from below → partial launch)
  const heightDelta  = attackerH - targetH;
  const vertLaunch   = hitForce * Math.sin(Math.atan2(heightDelta, 1)) * 0.3;
  if (vertLaunch > 50) { target.beyVerticalVel += vertLaunch; target.beyAirborne = true; }

  // 3. Tilt (contact angle drives wobble)
  target.beyTiltAngle = Math.min(45, target.beyTiltAngle + |heightDelta| * 0.01 * hitForce/1000);

  // 4. Floor grind (both near ground + lateral hit)
  if (attackerH < 10 && targetH < 10) {
    target.spin -= hitForce * 0.0002;  // amplified spin steal
    broadcast("floor-grind", { beyId: target.id, contactPoint, force: hitForce });
  }
}

// Upper attack bonus
if (heightDelta > 100) effectiveDamage *= 1.2;  // attacker 100px+ below target
```

---

## 10. New Move Definitions

### 10.1 ascending_dragon_bite (knockup, 2 phases)

```
Phase 0 — "sweep_knockup"
  windUpMs=100  durationMs=300  windDownMs=100  (total 500ms)
  effects: knockupTarget=true, verticalImpulse=300, linearImpulse=1000, damageMultiplier=0.8
  targetFlags: canHitGrounded=true, canHitAirborne=false, requiresAirborneTarget=false
  skipCondition: "target_already_airborne"   ← Phase 0 instantly skipped if target airborne
  rangeCheck: "contact"

Phase 1 — "ascending_bite"
  windUpMs=150  durationMs=400  windDownMs=150  (total 700ms)
  effects: verticalImpulse=400 (self rises), damageMultiplier=2.0, knockbackImpulse=4000
  targetFlags: canHitGrounded=false, canHitAirborne=true, requiresAirborneTarget=true
  waitForAirborne: 350ms
  fallback: { effects: {linearImpulse:2500, damageMultiplier:1.0, knockbackImpulse:2000},
              targetFlags: {canHitGrounded:true, canHitAirborne:false},
              label: "Dragon Descending Bite — ground strike at 1.0×" }
  rangeCheck: "radius" (3D distance including beyHeight delta)
```

**Timing continuity:**
```
T=0    Phase 0 windup   — L-Drago lowers, charges
T=100  Phase 0 active   — sweep fires, Pegasus knocked upward (beyAirborne=true)
T=400  Phase 0 active ends
T=500  Phase 0 winddown ends → Phase 1 windup starts immediately (no gap)
T=650  Phase 1 active   — bite at height, damageMultiplier=2.0
T=1050 Phase 1 active ends
T=1200 Phase 1 winddown ends — L-Drago arcs down naturally under gravity
```

### 10.2 storm_bringer (aerial-launch, 2 phases)

```
Phase 0 — "ascent"
  windUpMs=0  durationMs=500  windDownMs=0  (total 500ms)
  effects: verticalImpulse=350 (self goes airborne)
  targetFlags: canHitGrounded=false, canHitAirborne=false, requiresAirborneTarget=false
  rangeCheck: "none"

Phase 1 — "diving_strike"
  windUpMs=0  durationMs=700  windDownMs=0  (total 700ms)
  effects: linearImpulse=4500, damageMultiplier=1.7, landingAoePx=200, landingDmgMult=1.4,
           verticalImpulse=-500 (drives self downward)
  targetFlags: canHitGrounded=true, canHitAirborne=true, requiresAirborneTarget=false
  rangeCheck: "radius"
  fallback: none (can hit both grounded and airborne — no miss scenario)
```

---

## 11. Timing-Miss Decision Tree

```
Phase with requiresAirborneTarget=true fires
                  │
                  ▼
      Target currently airborne?
         YES ───────────────── NO
          │                     │
          ▼                     ▼
  Fire at full power     waitForAirborne defined?
                          YES ───────── NO
                           │             │
                           ▼             ▼
                   Hold phase, self   Skip target effects
                   effects apply      advance normally
                   wait up to waitMs
                         │
               Target airborne in window?
                 YES ──────── NO (wait expired)
                  │              │
                  ▼              ▼
           Full power     fallback defined?
            ✓              YES ──── NO
                            │        │
                            ▼        ▼
                      Apply fallback  Self-effects only
                      broadcast       (no target hit)
                      "special-phase-
                       fallback"
```

**Concrete scenario: "Pegasus already landed before L-Drago Phase 1 fires"**
```
T=0    Phase 0: sweeps Pegasus upward (beyAirborne=true)
T=400  Phase 1 starts: requiresAirborneTarget=true; Pegasus IS airborne ✓
T=416  Pegasus lands early (beyAirborne=false)
       → waitForAirborne=350ms starts; L-Drago keeps rising (self-verticalImpulse continues)
T=766  Wait expired; Pegasus never re-launched
       → fallback fires: "Dragon Descending Bite" at 1.0× on ground ← L-Drago still lands ✓
T=1100 Phase 1 ends (400ms active + 350ms wait)
```

---

## 12. Canonical Battle Reference — L-Drago vs Pegasus

The anime battle (Lightning L-Drago vs Storm Pegasus, Gingka vs Ryuga) defines the canonical
engine behaviour this phase must reproduce.

| Frame | Event | Engine mapping |
|-------|-------|----------------|
| F1 — Ground Shockwave | Both grounded; large collision; shockwave rings | Collision QTE triggers (combined damage ≥ 15) |
| F2 — Both Fly Off | Beys ricochet into air | `beyAirborne=true` for both; QTE ends (airborne guard) |
| F3 — L-Drago Scrape | Floor-level sweeping upper contact | Phase 0 "sweep_knockup": `canHitGrounded=true`, `knockupTarget=true` |
| F4 — Ascending Charge | L-Drago tilts, charges from below | Phase 1 "ascending_bite": `requiresAirborneTarget=true` |
| F5 — AIR CLASH | Both airborne + both specialMoveActive | `detectAerialClash()` → `triggerAerialClash()` → energy beam visual |

**skipCondition shortcut (Pegasus already airborne at Phase 0 activation):**
```
T=0   Both fires simultaneously:
        Pegasus: storm_bringer Phase 0 "ascent" → beyVerticalVel=350, beyAirborne=true
        L-Drago: ascending_dragon_bite Phase 0 check: target (Pegasus) IS airborne
                 → skipCondition "target_already_airborne" → SKIP Phase 0
                 → specialPhaseIndex = 1 immediately
                 → control lock for L-Drago reduced by 500ms (Phase 0 never ran)

T=~16  Phase 1 for L-Drago starts: requiresAirborneTarget=true; Pegasus IS airborne ✓
        self.beyVerticalVel += 400 (L-Drago also rises)

T=~200 Both airborne + both specialMoveActive + dist3D ≤ 300px
        → detectAerialClash() → AERIAL CLASH
        Pegasus Phase 1 diving_strike: damageMultiplier=1.7
        L-Drago Phase 1 ascending_bite: damageMultiplier=2.0
        → Both take cross-damage, fly in opposite vectors
        → "aerial-clash" broadcast → two crossing energy beams on client
```

---

## 13. No-Waste Policy

Every special move always produces some meaningful outcome.

| Scenario | Outcome |
|----------|---------|
| Aerial clash | Both deal phase `damageMultiplier` to each other; higher mult wins momentum; neither cancelled |
| Key-sequence QTE block (collision only) | 40% special damage still lands; 30% SP refund; collision QTE also triggers if combined ≥ 15 |
| Ranged special — no block offered | Special fires fully; no block prompt for non-contact |
| `requiresAirborneTarget` — target lands before hit | `waitForAirborne` holds; self-effects continue; fallback fires at reduced power if wait expires |
| Phase `skipCondition` triggered | Skipped phase's control lock is removed (faster move; bonus not penalty) |
| Special at < 50 SP during QTE | Fires at ≥ 30 SP with reduced `finalMult = QTE% × SP%` — never blocked for low SP |
| Phase target out of range (mid-phase) | Self-effects still apply; target contact retried each tick; re-enters range → still hit |

---

## 14. New Schema Fields

### Beyblade class additions

```typescript
// Collision QTE
@type("boolean") collisionQTEActive:   boolean = false;
@type("number")  collisionQTEPower:    number  = 0;   // 0–150 (integer %)

// Airborne physics
@type("number")  beyHeight:            number  = 0;   // px above arena floor
@type("number")  beyVerticalVel:       number  = 0;   // upward velocity
@type("boolean") beyAirborne:          boolean = false;

// Multi-phase tracking
@type("number")  specialPhaseIndex:    number  = 0;   // current phase in phases[]
@type("number")  specialPhaseElapsed:  number  = 0;   // ms elapsed in current phase (incl. windUp+active+windDown)
@type("string")  specialPhaseSubState: string  = "";  // "windup" | "active" | "winddown" | ""
```

### Server-side in-memory (NOT schema-synced)

```typescript
// In BattleRoom (Map<beyId, ...>)
private specialPhaseWaitElapsed  = new Map<string, number>();
private specialPhaseUsedFallback = new Map<string, boolean>();

// CollisionQTE state
private activeCollisionQTEs    = new Map<string, CollisionQTEState>();
private collisionQTECooldowns  = new Map<string, number>(); // key → expiry ms
```

---

## 15. New Client Message Types

```typescript
export interface CollisionQTEStartData {
  player1Id: string; player2Id: string; windowMs: number;
}
export interface CollisionQTESpecialPromptData {
  qteMultiplier: number; currentSP: number;
}
export interface CollisionQTEResultData {
  player1Id: string; player2Id: string;
  player1Multiplier: number; player2Multiplier: number;
}
export interface SplitScreenCinematicData {
  participants: { beyId: string; specialMove: string; displayName: string }[];
}
```

### Server → Client messages

| Message | Trigger | Payload |
|---------|---------|---------|
| `"collision-qte-start"` | QTE starts | `CollisionQTEStartData` |
| `"collision-qte-special-prompt"` | Power ≥ 80% + SP ≥ 30 | `CollisionQTESpecialPromptData` |
| `"collision-qte-result"` | QTE window closes | `CollisionQTEResultData` |
| `"aerial-clash"` | Aerial clash detected | `{ bey1Id, bey2Id, contactPoint3D }` |
| `"special-interaction-result"` | Special-vs-special resolves | `{ key, attAtPeak, defAtPeak, attackerScale, defenderScale }` |
| `"special-phase-substate"` | Sub-state changes | `{ beyId, phaseId, subState }` |
| `"special-phase-fallback"` | Fallback fires | `{ beyId, phaseId, fallbackLabel }` |
| `"split-screen-cinematic"` | Ground/aerial clash between specials | `SplitScreenCinematicData` |
| `"split-screen-participant-out"` | Bey KO'd during cinematic | `{ beyId }` |
| `"split-screen-end"` | Last special phase ends | `{}` |
| `"floor-grind"` | Ground-level lateral hit | `{ beyId, contactPoint, force }` |

### Client → Server messages

| Message | When | Payload |
|---------|------|---------|
| `"collision-qte-mash"` | Any action key during QTE window | `{}` |
| `"collision-qte-fire-special"` | Space during special prompt | `{}` |

---

## 16. Special Move Radii

| Move | Kind | Radius (px) | Notes |
|------|------|-------------|-------|
| `stampede_rush` | linear-burst | 400 | ~1/3 standard arena |
| `gyro_anchor` | anchor | 250 | Close-range spin drain |
| `spin_recovery` | orbital | 300 | Orbital loop radius |
| `tactical_burst` | directional-burst | 350 | Burst cone range |
| `shock_pulse` | shockwave | 250 | Unified with existing `aoeRadiusPx` |
| `ascending_dragon_bite` | knockup | 300 | L-Drago-style |
| `storm_bringer` | aerial-launch | 400 | Pegasus-style |

All existing single-phase moves migrated to `phases: [{ ...existing effects as single phase }]`.

---

## 17. Modified Files

| File | Change |
|------|--------|
| `server/constants/specialMoves.ts` | Rewrite `SpecialMoveDef` to multi-phase; add `SpecialMovePhase`, `SpecialMovePhaseEffects`, `SpecialInteractionDef`; remove static `SPECIAL_INTERACTIONS` (now Firestore-backed); migrate 5 existing moves; add `ascending_dragon_bite` + `storm_bringer`; add `radius` field to all |
| `scripts/seed-special-interaction-defs.js` | NEW: seed 10 group×group entries to `special_interaction_defs` Firestore collection |
| `server/rooms/schema/GameState.ts` | Add 8 new Beyblade schema fields (§14) |
| `server/rooms/BattleRoom.ts` | Add: `loadSpecialInteractionDefs()` in `onCreate`; CollisionQTE lifecycle (`startCollisionQTE`, `endCollisionQTE`+Firestore write, `calcQTEPower`); airborne physics tick; `tickSpecialPhase`; `detectAerialClash`; `triggerAerialClash`; `resolveSpecialVsSpecial`+Firestore write; `calculateSpecialContactDamage`; `applyHitRecoil`; `onBeyLanded`; modified `cancelSpecialMoveViaQTE` (collision-only gate, 40%/30%); `onMessage("collision-qte-mash")`; `onMessage("collision-qte-fire-special")` |
| `server/rooms/AIBattleRoom.ts` | ⚠️ AI auto-mash not yet implemented — `loadSpecialInteractionDefs()` not yet called; planned: ~10 mash/s tick counter + 40% special fire chance |
| `server/rooms/TryoutRoom.ts` | Not modified — TryoutRoom uses local browser physics, no Colyseus QTE |
| `server/physics/PhysicsEngine.ts` | `applyHitRecoil()` + `calculateSpecialContactDamage()` added inline to `BattleRoom.ts` |
| `client/src/types/game.ts` | 4 new payload interfaces (§15); update `SpecialMoveDef` to multi-phase shape |
| `client/src/game/hooks/useColyseus.ts` | 10 new message handlers; 2 new send helpers; keydown listener for mash/fire |
| `client/src/components/game/CollisionQTEOverlay.tsx` | NEW: power meter (0–150%), mash header, GETTING HARDER indicator, special fire prompt |
| `client/src/components/game/SplitScreenCinematic.tsx` | NEW: N-panel layout; dynamic collapse on participant-out; ends on server "split-screen-end" |
| `client/src/pages/BattleGamePage.tsx` | Wire `CollisionQTEOverlay` + `SplitScreenCinematic` |
| `client/src/pages/AIBattleGamePage.tsx` | Wire `CollisionQTEOverlay` + `SplitScreenCinematic` |
| `client/src/pages/admin/SpecialInteractionDefsPage.tsx` | NEW: Admin CRUD page for `special_interaction_defs` — 10 group×group entries; timing bonus section; missing-keys warning; route at `/admin/special-interaction-defs` |
| `client/src/lib/firebase.ts` | Added `SPECIAL_INTERACTION_DEFS`, `COLLISION_QTE_EVENTS`, `SPECIAL_CLASH_EVENTS` to `COLLECTIONS` |
| `client/src/router.tsx` | Added `{ path: "special-interaction-defs", element: <SpecialInteractionDefsPage /> }` under admin routes |
| `client/src/pages/TryoutGamePage.tsx` | NOT wired — local physics only (no Colyseus); CollisionQTE is server-driven and not applicable |

**New Firestore Collections**

| Collection | Purpose |
|-----------|---------|
| `special_interaction_defs` | 10 group×group interaction entries (keys like `"strike:guard"`); seeded by `scripts/seed-special-interaction-defs.js`; loaded into in-memory cache at room start |
| `collision_qte_events` | Per-collision QTE event log — written by `endCollisionQTE()` in BattleRoom (fire-and-forget) |
| `special_clash_events` | Per-special-vs-special clash log — written by `resolveSpecialVsSpecial()` (fire-and-forget) |

---

## 18. Verification Checklist

1. Hard collision → both players see QTE overlay; damage is held
2. Mash keys → power bar fills; diminishing returns above 100% (meter slows visibly)
3. Reach 80% + SP ≥ 30 → special fire prompt appears (Space to fire)
4. Fire special during QTE → damage = QTE× × SP% applied; `finalMult` in server log
5. QTE expires without special → collision damage at QTE multiplier applied
6. Fire special normally (no collision) → no QTE overlay shown; auto-targets nearest
7. Key-sequence QTE block attempted on ranged special → block NOT offered
8. Key-sequence QTE block during physical contact → 40% special lands + collision QTE triggers
9. AI battle: AI mash count increments ~10× per second during QTE window
10. Two special-active beys physically collide (ground) → split-screen triggers for those 2 beys
11. Two special-active beys both airborne + within 3D range → aerial clash event + beam visual
12. L-Drago `ascending_dragon_bite`: if Pegasus already airborne → Phase 0 skipped → Phase 1 fires immediately; control lock reduced
13. L-Drago Phase 1: Pegasus lands before hit → waitForAirborne 350ms → fallback "Dragon Descending Bite" fires on ground
14. Storm Pegasus `storm_bringer`: self launches (beyAirborne=true); dives; hits grounded or airborne target
15. L-Drago wind-up (100ms) plays visually before contact window; no instant snap
16. Wind-down: bey continues arc downward under gravity; no teleport to ground
17. Fire special with 35 SP + QTE at 90% → fires (≥30 SP threshold); finalMult = 0.315×
18. Upper hit (attacker 120px below target) → +20% damage bonus in server log
19. Both beys near floor + lateral hit → `"floor-grind"` event received by client
20. Phase hit: upper attackType (1.4×) × guard absorb (0.8×) × phase mult (2.0×) = 2.24× effective
21. After QTE ends → Firestore `collision_qte_events` doc written with correct `matchId`, both bey IDs, mash counts, multipliers
22. After special vs special clash → Firestore `special_clash_events` doc written with `interactionKey`, scales, `timingBonusApplied`
23. `npm run seed:special-interaction-defs` → 10 docs in `special_interaction_defs` with correct field values
24. `cd client && npx tsc --noEmit` passes with zero errors

---

## 19. Implementation Status — Phase 29

| Component | Status |
|-----------|--------|
| `special_interaction_defs` seed script | ✅ `scripts/seed-special-interaction-defs.js` — 10 group×group docs |
| `loadSpecialInteractionDefs()` in `BattleRoom.onCreate` | ✅ Loaded into `specialInteractionCache` before `setSimulationInterval` |
| CollisionQTE lifecycle in `BattleRoom` | ✅ `startCollisionQTE`, `endCollisionQTE` + Firestore write in `collision_qte_events` |
| `calcQTEPower` (diminishing returns) | ✅ +12% below 100%, +6% above 100%, ceiling 150% |
| `onMessage("collision-qte-mash")` | ✅ Debounced, updates `collisionQTEPower`, broadcasts special prompt at ≥80% + SP≥30 |
| `onMessage("collision-qte-fire-special")` | ✅ Validates SP≥30, computes `finalMult`, calls `handleSpecialMove` |
| Airborne physics tick (`tickAirbornePhysics`) | ✅ Runs every tick; decays `beyVerticalVel` by gravity; calls `onBeyLanded` |
| Multi-phase `tickSpecialPhase` | ✅ windup/active/winddown sub-state; `waitForAirborne` hold; fallback; skipCondition |
| `detectAerialClash` / `triggerAerialClash` | ✅ 3D distance check; cross-damage; opposite-vector recoil; `"aerial-clash"` broadcast |
| `resolveSpecialVsSpecial` + `special_clash_events` write | ✅ Group×group lookup from cache; timing bonus; fire-and-forget Firestore write |
| `cancelSpecialMoveViaQTE` collision-only gate | ✅ Collision-only gate via `physicalContactThisTick`; 40% damage / 30% SP refund |
| `applyHitRecoil` | ✅ Lateral + vertical component; tilt delta; floor-grind broadcast |
| `calculateSpecialContactDamage` | ✅ attackType mult × guard absorb × phase mult |
| Multi-phase `SpecialMoveDef` rewrite (`specialMoves.ts`) | ✅ All 5 existing moves migrated to `phases[]`; `ascending_dragon_bite` + `storm_bringer` added; `radius` + `group` fields on all |
| New Beyblade schema fields (`GameState.ts`) | ✅ 8 fields: `collisionQTEActive`, `collisionQTEPower`, `beyHeight`, `beyVerticalVel`, `beyAirborne`, `specialPhaseIndex`, `specialPhaseElapsed`, `specialPhaseSubState` |
| New client message types (`game.ts`) | ✅ `CollisionQTEStartData`, `CollisionQTESpecialPromptData`, `CollisionQTEResultData`, `SplitScreenCinematicData`, `AerialClashData`, `SpecialInteractionResultData`, `FloorGrindData` |
| `useColyseus.ts` new handlers + senders | ✅ 10 message handlers; `sendCollisionQTEMash` (50ms debounce + optimistic local update); `sendCollisionQTEFireSpecial` |
| `CollisionQTEOverlay.tsx` | ✅ Power bar (0–150%, color ramp); `onMash` global keydown listener; Space → fire special; "GETTING HARDER" pulse above 80% |
| `SplitScreenCinematic.tsx` | ✅ N-panel layout; `eliminatedBeyIds` prop; animated shrink bar; ends on `"split-screen-end"` |
| `BattleGamePage.tsx` wiring | ✅ `CollisionQTEOverlay` + `SplitScreenCinematic` wired; split-screen participant-out listener |
| `AIBattleGamePage.tsx` wiring | ✅ Same as BattleGamePage |
| `SpecialInteractionDefsPage.tsx` admin page | ✅ Full CRUD; timing bonus section; missing-key warning; route `/admin/special-interaction-defs` |
| `firebase.ts` `COLLECTIONS` update | ✅ `SPECIAL_INTERACTION_DEFS`, `COLLISION_QTE_EVENTS`, `SPECIAL_CLASH_EVENTS` added |
| TypeScript check | ✅ `cd client && npx tsc --noEmit` — 0 errors |
| `server/rooms/AIBattleRoom.ts` — AI auto-mash | ❌ AI auto-respond to collision QTE not yet added |
| `client/src/pages/TryoutGamePage.tsx` | ❌ Not applicable — local physics engine, no Colyseus connection |

---

[← Phase 28: View Modes + HUD + BitBeast](phase-28-view-modes-hud-bitbeast.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

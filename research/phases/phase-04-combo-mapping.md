[← Phase 03: Special Move -> Bey Map](phase-03-specialmove-bey-map.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 05: Parts →](phase-05-parts.md)

---

# Phase 04 — Combo / Trigger Mapping

> Stage 4 | Source: server/constants/combos.ts + server/utils/comboSystem.ts + server/utils/comboTaskCompiler.ts + shared/types/comboTask.ts + client/src/constants/combos.ts
> Date: 2026-05-23
> Analyst: Claude Code (claude-sonnet-4-6)

---

## Amendment — Session 18: Combos Use Pillar 1 (BehaviorDef)

> See **[Phase 21 — Unified Foundation](phase-21-unified-foundation.md)** for the full spec.

Combo effects are expressed as `effectRefs: MechanicInstance[]` on the combo doc, replacing `effectId` → `combo_effects` lookup. All 8 combos mapped to `effectRefs`:

| ID | effectRefs |
|----|-----------|
| `quick-dash-l` | `velocity_burst(dir:"left", force:0.04, ticks:5)` |
| `quick-dash-r` | `velocity_burst(dir:"right", force:0.04, ticks:5)` |
| `guard-tap` | `defense_stance(ticks:40, reducBoost:0.2)` |
| `feint` | `velocity_burst(dir:"retreat") + bearing_drift(ticks:10)` |
| `riposte` | `attack_amplifier(mult:1.2, ticks:25) + velocity_burst(force:0.03)` |
| `pivot-strike` | `velocity_burst(force:0.05) + attack_amplifier(mult:1.15, ticks:20)` |
| `power-thrust` | `velocity_burst(force:0.07) + attack_amplifier(mult:1.25, ticks:20)` |
| `spin-leech-jab` | `spin_transfer(stealFactor:0.25) + orbit_movement(radius:80)` |

The `effectId` field is kept for backward compat but deprecated in favor of `effectRefs`. New combo effects are authored via the Behavior Panel in CombosPage — no code changes required.

---

### Shared-Types Canonicalization Note (session 15)

`ComboTask`, `ComboEffectDef`, `BehaviorRef`, `ComboCondition`, `ComboVisual` are all in `shared/types/`:

| Type | File |
|------|------|
| `ComboTask`, `ComboEffectDef`, `BehaviorRef`, `ComboCondition`, `BeybladeComboSlot` | `shared/types/comboTask.ts` |
| `ComboVisual`, `ParticlePresetDoc` | `shared/types/comboVisual.ts` |

`BeybladeStats.comboSlots?: BeybladeComboSlot[]` replaces the legacy `enabledCombos?: string[]` field. The admin form still writes to legacy `comboIds` (array of registry IDs) — the migration to `comboSlots` with `effectId` references is outstanding (gap #6 in Current Work).

### Arena-Level QTE Modifiers (session 13)

Two new `ArenaConfig` fields (exposed in BasicsTab → Physics & Gameplay) directly gate the combo system:

| Field | Combo system effect |
|-------|-------------------|
| `qteEnabled: false` | `comboSystem.detectCombo()` short-circuits immediately — no combo can fire regardless of bey opt-in. All 8 seeded combos are inactive. |
| `qteWindowScaling: "flat"` | Override: victim always has 60 ticks to respond. `"by_cost"` (default) = `max(20, 60 - cost)` — more costly combos give the victim less time to react. |

The `on_low_spin` multi-threshold edge-state bug (see §2 below) is unaffected by these fields.

---

## 1. Existing Combo Registry (8 combos)

All 8 combos are defined in `server/constants/combos.ts` and mirrored (display-only, no `effect` field) in `client/src/constants/combos.ts`.

| ID | Sequence | Cost | Type | effectId | Status | Notes |
|----|----------|------|------|----------|--------|-------|
| `quick-dash-l` | ←←J | 0 | universal | `quick-dash-l` | ✅ Wired | dashDirection: left, durationMs: 300, lockMs: 0 |
| `quick-dash-r` | →→J | 0 | universal | `quick-dash-r` | ✅ Wired | dashDirection: right, durationMs: 300, lockMs: 0 |
| `guard-tap` | KKK | 0 | universal | `guard-tap` | ✅ Wired | damageMultiplier: 1.0, durationMs: 250, lockMs: 0 (pure guard, no offense) |
| `feint` | ←→K | 0 | universal | `feint` | ✅ Wired | dashDirection: back, durationMs: 200, lockMs: 0 |
| `riposte` | KKJ | 15 | defense | `riposte` | ✅ Wired | damageMultiplier: 1.3, durationMs: 600, lockMs: 200 |
| `pivot-strike` | ←→J | 15 | balanced | `pivot-strike` | ✅ Wired | damageMultiplier: 1.25, durationMs: 500, lockMs: 200 |
| `power-thrust` | JJJ | 25 | universal | `power-thrust` | ✅ Wired | damageMultiplier: 1.5, durationMs: 800, lockMs: 300 |
| `spin-leech-jab` | ←J→ | 35 | stamina | `spin-leech` | ✅ Wired | damageMultiplier: 1.1, spinStealBonus: 0.08, microSpinBoost: 30, durationMs: 800, lockMs: 200 |

**Resolution (Sessions 16–17):**

- `Combo.effectId?: string` was added to `server/constants/combos.ts` (the interface already had the field; values were absent). All 8 registry entries now carry their `effectId` inline — `getComboById(id).effectId` returns a valid ID.
- `scripts/seed-combo-effects.js` was created and seeds 14 `ComboEffectDef` documents (8 registry + 6 extended effects: `chaos-field`, `power-burst`, `chaos-gambit`, `meteor-strike`, `glacial-siege`, `shadow-shroud`).
- `scripts/seed-combos.js` maps `effectId` via `COMBO_EFFECT_IDS` table — Firestore `combos` docs have `effectId` on save/seed.
- `CombosPage.tsx` exposes `effectId?: string` in `ComboDoc`, EMPTY state, `openEdit`, `handleSave`, and form UI (text input with hint) — admins can set it manually.
- The admin form on `BeybladeEditPage.tsx` still writes `comboIds: string[]` (legacy). Migration to `comboSlots: BeybladeComboSlot[]` remains as a future enhancement only — the existing `detectCombo()` path works end-to-end via the inline `ComboEffect` objects.

---

## 2. Trigger Combo Types (6 types)

All 6 triggers are defined as `ComboTrigger` in `shared/types/comboTask.ts` and evaluated in `detectTriggerCombos()` in `server/utils/comboSystem.ts`.

| Trigger Type | Condition (from detectTriggerCombos) | Bey State Required | Effect When Fired | Edge-Detected? | Engine Status |
|---|---|---|---|---|---|
| `on_hit_received` | `ctx.wasHitThisTick === true` | Any; fires every tick a hit lands | Instant reactive — fires each tick the bey is hit (no edge detection) | No — fires every qualifying tick | Implemented in comboSystem.ts; no debounce risk if cooldown set |
| `on_near_ring_out` | `ctx.nearRingOut && !triggerState.prevNearRingOut` | `nearRingOut` flag set by physics; transition false→true | Fires exactly once on entering near-ring-out zone | Yes — false→true edge | Implemented; edge state in `TriggerState.prevNearRingOut` |
| `on_low_spin` | `ctx.spinRatio < (slot.condition.minSpin ?? 30)/100 && !triggerState.prevLowSpin` | `spin / maxSpin < threshold` (default 30%) | Fires exactly once when spin drops below threshold | Yes — false→true edge | Implemented; edge state in `TriggerState.prevLowSpin`; threshold pulled from first slot's `condition.minSpin` (potential bug if multiple slots have different thresholds — see note below) |
| `on_partner_near_ring_out` | `ctx.partnerNearRingOut === true` | Ally bey in near-ring-out position (team mode) | Fires every tick partner is near ring-out | No edge detection | Implemented; fires repeatedly while condition holds; caller must set cooldown |
| `on_opponent_special_move` | `ctx.opponentSpecialMoveActive && !triggerState.prevOpponentSpecialMove` | Opponent must have fired a special move this tick | Fires once on transition to opponent special active | Yes — false→true edge | Implemented; edge state in `TriggerState.prevOpponentSpecialMove` |
| `on_burst_attempt` | `ctx.burstAttemptThisTick === true` | Burst system in rooms must set this flag when burst pressure threshold crossed | Fires every tick a burst attempt is registered | No edge detection | Implemented in comboSystem.ts; depends on rooms correctly populating `burstAttemptThisTick` in TriggerContext — not verified in room code |

**Bug note (on_low_spin edge state):** `triggerState.prevLowSpin` is updated at the bottom of `detectTriggerCombos()` using only `slots[0]?.condition?.minSpin`. If a bey has multiple trigger slots with different `minSpin` thresholds, only the first slot's threshold drives the shared edge state. This can cause missed or spurious edge-firings for subsequent slots.

---

## 3. ComboTask Action → BehaviorRef Mapping

`compileAction()` in `server/utils/comboTaskCompiler.ts` is called at admin save time (not runtime). The full mapping:

| ComboTask action.type | ComboTask payload fields | BehaviorRef behaviorId | BehaviorRef params (key fields) | Runtime wired? |
|---|---|---|---|---|
| `multiplier` | `statDeltas: StatDelta[]` — each has `stat`, `multiplier?`, `delta?`, `setValue?`, `durationTicks?` | `"factor.boost"` (one ref per delta entry) | `stat`, `mult`, `delta`, `setValue`, `dur`, `target` | Unknown — `factor.boost` handler must exist in room/physics; not found in reviewed files |
| `transformation` | `transformTo: TransformTarget`, `durationTicks?`, `transformParams?`, `keepVisualAppearance?`, `visualOverride?` | `"transform.become_<transformTo>"` (e.g. `transform.become_gravity_well`) | `durationTicks`, `transformParams`, `keepVisualAppearance`, `visualConfig` | **YES — turret system uses this.** Turrets transform arena state mid-battle. [FACT: user-confirmed] |
| `spawning` | `spawnType: SpawnableEntityType`, `spawnPosition`, `spawnTarget?`, `count?`, `countFormation?`, `countSpacing?`, `spawnParams?` | `"spawn.<spawnType>"` (e.g. `spawn.portal`, `spawn.turret`) | `spawnPosition`, `spawnTarget`, `count`, `countFormation`, `countSpacing`, plus all `spawnParams` fields, `target` | **YES — turrets spawn projectiles as new physics bodies mid-battle.** [FACT: user-confirmed] |
| `movement` (non-swap) | `pattern: MovementPattern` (type ≠ `swap_position`), `durationTicks?`, `visualOverride?` | `"movement.<pattern.type>"` (e.g. `movement.circle`, `movement.dash_to`, `movement.freeze`) | All fields from `pattern` spread + `durationTicks`, `visualConfig`, `target` | Unknown — `movement.*` namespace not verified |
| `movement` (swap_position) | `pattern.type === "swap_position"`, `swapWith`, `preserveVelocity?`, `snapToGround?`, `preventRingOut?` | `"position.swap_with"` | `swapWith`, `preserveVelocity`, `preventRingOut`, `snapToGround`, `durationTicks`, `visualConfig`, `target` | Unknown — different namespace (`position.*`) from other movement patterns |
| `arena_effect` | `effect: ArenaEffectPayload` — one of 8 subtypes (`floor_override`, `gravity_change`, `arena_tilt`, `freeze_all`, `fog_of_war`, `darkness`, `reverse_controls`, `no_combos`) | `"arena.effect.<effect.type>"` (e.g. `arena.effect.gravity_change`) | All fields from `effect` spread | **YES — turret fire triggers named arena effects through the mechanic chain.** [FACT: user-confirmed] |

**Multiple targets:** When `task.target` is an array, `compileComboTask()` generates one `BehaviorRef` per target. The second and subsequent refs have `parallel: true`.

**Mixed-target actions (`targetedActions`):** Each `TargetedAction` in `task.targetedActions[]` is recursively compiled, producing independent refs flattened into the output.

**Conditions:** If `task.condition` is set, it is copied onto every emitted `BehaviorRef.condition`. The engine must check this condition before executing the behavior.

---

## 4. BehaviorRef → Mechanic ID Mapping (from type system)

These are the behaviorId strings the compiler emits mapped to their implied mechanic. No handler file has been identified in the reviewed server code; all statuses are UNVERIFIED.

| BehaviorRef behaviorId | Target Mechanic | Handler File (planned/unknown) | Current Status |
|---|---|---|---|
| `factor.boost` | Stat multiplier/delta application with optional duration | Unknown — should be in physics tick or room state processor | NOT VERIFIED — behaviorId string emitted but no handler found |
| `transform.become_gravity_well` | Transforms bey into gravity-well entity | Unknown | NOT VERIFIED |
| `transform.become_obstacle` | Transforms bey into obstacle entity | Unknown | NOT VERIFIED |
| `transform.become_spin_zone` | Transforms bey into spin-zone entity | Unknown | NOT VERIFIED |
| `transform.become_turret` | Transforms bey into turret entity | Unknown | NOT VERIFIED |
| `transform.become_hazard` | Transforms bey into hazard entity | Unknown | NOT VERIFIED |
| `transform.become_portal` | Transforms bey into portal entity | Unknown | NOT VERIFIED |
| `transform.become_normal` | Reverts bey from transformed state | Unknown | NOT VERIFIED |
| `spawn.portal` | Spawns a portal entity | Unknown | NOT VERIFIED |
| `spawn.obstacle` | Spawns an obstacle entity | Unknown | NOT VERIFIED |
| `spawn.gravity_well` | Spawns a gravity well entity | Unknown | NOT VERIFIED |
| `spawn.spin_zone` | Spawns a spin zone entity | Unknown | NOT VERIFIED |
| `spawn.pit` | Spawns a pit/floor hazard | Unknown | NOT VERIFIED |
| `spawn.turret` | Spawns a turret entity | Unknown | NOT VERIFIED |
| `spawn.trail` | Spawns a damage trail | Unknown | NOT VERIFIED |
| `spawn.clone_self` | Spawns a clone of the caster bey | Unknown | NOT VERIFIED |
| `spawn.bey_ai` | Spawns an AI-controlled bey | Unknown | NOT VERIFIED |
| `spawn.bey_friendly` | Spawns a friendly ally bey | Unknown | NOT VERIFIED |
| `spawn.floor_hazard` | Spawns a floor-level hazard | Unknown | NOT VERIFIED |
| `movement.circle` | Circular movement pattern | Unknown | NOT VERIFIED |
| `movement.dash_to` | Dash toward target (opponent/center) | Unknown | NOT VERIFIED |
| `movement.orbit_opponent` | Orbit around opponent | Unknown | NOT VERIFIED |
| `movement.freeze` | Lock position (no movement) | Unknown | NOT VERIFIED |
| `movement.dance` | Erratic dance movement | Unknown | NOT VERIFIED |
| `movement.zigzag` | Zigzag movement pattern | Unknown | NOT VERIFIED |
| `movement.bounce` | Bounce movement | Unknown | NOT VERIFIED |
| `movement.jump` | Simple jump | Unknown | NOT VERIFIED |
| `movement.high_jump` | High jump with hang time + land target | Unknown | NOT VERIFIED |
| `movement.meteor_strike` | High jump → descend → impact AoE | Unknown | NOT VERIFIED |
| `position.swap_with` | Teleport-swap positions with opponent | Unknown | NOT VERIFIED |
| `arena.effect.floor_override` | Override arena floor hazard type | Unknown | NOT VERIFIED |
| `arena.effect.gravity_change` | Change arena gravity multiplier | Unknown | NOT VERIFIED |
| `arena.effect.arena_tilt` | Tilt the arena | Unknown | NOT VERIFIED |
| `arena.effect.freeze_all` | Freeze all beys (except optionally teammates) | Unknown | NOT VERIFIED |
| `arena.effect.fog_of_war` | Apply fog of war visibility | Unknown | NOT VERIFIED |
| `arena.effect.darkness` | Apply darkness effect | Unknown | NOT VERIFIED |
| `arena.effect.reverse_controls` | Reverse input controls | Unknown | NOT VERIFIED |
| `arena.effect.no_combos` | Disable combo firing | Unknown | NOT VERIFIED |

---

## 5. Required ComboEffectDef Entries

For each of the 8 existing combos, a `ComboEffectDef` entry should be created in the `combo_effects` Firestore collection and linked via `effectId`. These definitions translate the inline `ComboEffect` to the `ComboTask[]` + compiled `BehaviorRef[]` pipeline.

| Combo ID | Proposed effectId | Effect Name | ComboTask[] Summary | ComboTrigger types | Effect ceiling compliance |
|---|---|---|---|---|---|
| `quick-dash-l` | `fx_quick_dash_l` | Quick Dash Left | 1 task: `movement` / `dash_to` leftward (pattern: `{type:"dash_to", target:"opponent"}` with leftward velocity override), instant timing, target: self | `sequence` only | Yes — no damage mult, no lock |
| `quick-dash-r` | `fx_quick_dash_r` | Quick Dash Right | 1 task: `movement` / `dash_to` rightward, instant timing, target: self | `sequence` only | Yes — no damage mult, no lock |
| `guard-tap` | `fx_guard_tap` | Guard Tap | 1 task: `multiplier` with `statDeltas: [{stat:"damageReduction", multiplier:1.0, durationTicks:15}]`, instant timing, target: self | `sequence` only | Yes — multiplier 1.0 (no offensive bonus) |
| `feint` | `fx_feint` | Feint | 1 task: `movement` / backward dash (`{type:"dash_to", target:"opponent"}` with reversed vector), instant timing, target: self | `sequence` only | Yes — no damage mult, no lock |
| `riposte` | `fx_riposte` | Riposte | 2 tasks: (1) `multiplier` `[{stat:"damageReduction", multiplier:1.2, durationTicks:12}]` instant; (2) `multiplier` `[{stat:"damageMultiplier", multiplier:1.3, durationTicks:36}]` timed 600ms, target: self | `sequence` only | Yes — mult 1.3 ≤ 1.5; lock 200ms ≤ 300ms |
| `pivot-strike` | `fx_pivot_strike` | Pivot Strike | 2 tasks: (1) `movement.dash_to` pivot (rightward), instant; (2) `multiplier` `[{stat:"damageMultiplier", multiplier:1.25, durationTicks:30}]` timed 500ms, target: self | `sequence` only | Yes — mult 1.25 ≤ 1.5; lock 200ms ≤ 300ms |
| `power-thrust` | `fx_power_thrust` | Power Thrust | 1 task: `multiplier` `[{stat:"damageMultiplier", multiplier:1.5, durationTicks:48}]` timed 800ms + movement `dash_to opponent`, target: self; `lockMs: 300` via `timing.durationTicks` for lock window | `sequence` only | Yes — mult 1.5 = ceiling exactly; lock 300ms = ceiling exactly |
| `spin-leech-jab` | `fx_spin_leech_jab` | Spin-Leech Jab | 3 tasks: (1) `multiplier` `[{stat:"damageMultiplier", multiplier:1.1, durationTicks:48}]` instant; (2) `multiplier` `[{stat:"spinStealFactor", multiplier:1.08, durationTicks:48}]` instant (0.08 steal = 8%); (3) `multiplier` `[{stat:"spin", delta:30}]` instant, target: self | `sequence` only | Yes — steal bonus 0.08 ≤ max 0.1; no invulnerability; no AoE |

---

## 6. Schema Fix Required

### 6.1 Field Missing: `effectId` on `Combo`

The `Combo` interface in `server/constants/combos.ts` must gain an `effectId: string` field:

```typescript
// server/constants/combos.ts — current (BROKEN)
export interface Combo {
  id: string;
  name: string;
  sequence: [ComboKey, ComboKey, ComboKey];
  cost: 0 | 15 | 25 | 35;
  type: ComboType;
  windowMs: number;
  effect: ComboEffect;
  cooldownMs: number;
  description: string;
  // effectId is ABSENT
}

// Required fix:
export interface Combo {
  id: string;
  name: string;
  sequence: [ComboKey, ComboKey, ComboKey];
  cost: 0 | 15 | 25 | 35;
  type: ComboType;
  windowMs: number;
  effect: ComboEffect;
  cooldownMs: number;
  description: string;
  effectId: string;   // <-- ADD THIS — references combo_effects/<effectId>
}
```

The `ComboDisplay` mirror in `client/src/constants/combos.ts` should also add `effectId: string` so the HUD and picker can look up effect details.

### 6.2 Firestore Migration Path

| Step | Action |
|---|---|
| 1 | Create `combo_effects` collection in Firestore (currently implied by `BeybladeComboSlot.effectId` but no seed script exists) |
| 2 | Add `scripts/seedComboEffects.ts` — writes the 8 `ComboEffectDef` entries from Section 5 above to `combo_effects/{effectId}` |
| 3 | Update `scripts/seedCombos.ts` (the existing `seed:combos` script) to include `effectId` on each combo doc |
| 4 | Add `effectId` field to each existing combo doc in `combos` collection (migration: run updater or re-seed idempotently) |
| 5 | Update `Combo` TypeScript interface + `COMBO_REGISTRY` constants with matching `effectId` values |
| 6 | Update `detectCombo()` return in `ComboResult` to include `effectId` so rooms can look up the compiled `BehaviorRef[]` |

### 6.3 `BeybladeComboSlot` vs Legacy `Combo` Path

The engine now has two parallel combo systems:

- **Legacy path** — `detectCombo()` uses `COMBO_REGISTRY`, produces `ComboResult`, rooms apply `damageMultiplier`/`lockMs` directly.
- **New slot path** — `detectComboFromSlots()` uses `BeybladeComboSlot[]`, produces `SlotComboResult` with `effectId`, looks up `ComboEffectDef.steps: BehaviorRef[]` from Firestore.

Until `effectId` is added to the `Combo` interface and the 8 `ComboEffectDef` docs are seeded, the new slot path is non-functional for all registry combos. The legacy path continues to work but cannot benefit from the `ComboTask` pipeline.

---

## 7. Combo → Bey Type Matrix

The `type` field on each combo defines which bey types may equip it. `"universal"` means any type.

| Combo ID | Attack Type | Defense Type | Stamina Type | Balance Type | Notes |
|---|---|---|---|---|---|
| `quick-dash-l` | Yes | Yes | Yes | Yes | Universal — free positional tool |
| `quick-dash-r` | Yes | Yes | Yes | Yes | Universal — mirror of quick-dash-l |
| `guard-tap` | Yes | Yes | Yes | Yes | Universal — free guard with no offensive value |
| `feint` | Yes | Yes | Yes | Yes | Universal — free movement feint |
| `riposte` | No | **Yes only** | No | No | Defense-type exclusive — parry-counter synergy |
| `pivot-strike` | No | No | No | **Yes only** | Balanced-type exclusive — directional commitment strike |
| `power-thrust` | Yes | Yes | Yes | Yes | Universal — highest damage mult (1.5×); expensive (25 power) |
| `spin-leech-jab` | No | No | **Yes only** | No | Stamina-type exclusive — spin steal is core stamina mechanic |

**Coverage gaps:**
- Attack type has no exclusive combo (only shares universals)
- Defense type has only `riposte` as exclusive
- Stamina type has only `spin-leech-jab` as exclusive
- Balanced type has only `pivot-strike` as exclusive

All 4 cost-tiered combos are exclusive to one type or universal; no type has more than 1 exclusive combo. Attack type has 0 exclusives — a gap in the registry.

---

## 8. Proposed New Combos (from research)

Based on mechanic patterns from phase-01 (type triangle, spin mechanics, collision physics) and phase-02 (special move mechanics including multi-strike, spin steal, ring-out, velocity burst, upper attack), the following 8 additional combos are proposed to fill coverage gaps and complement the existing registry.

| Proposed ID | Sequence | Cost | Type | Mechanic Effect | Priority | Rationale |
|---|---|---|---|---|---|---|
| `smash-rush` | →→J (hold J 0.5s) | 25 | attack | Velocity burst forward + 1.4× damage for 600ms + `lockMs: 150`; mirrors Attack-type smash attack pattern from phase-01 (`smash-attack.md`) | HIGH — fills Attack-exclusive gap | Attack type has no exclusive combo; smash-rush gives attack beys a committed charge tool |
| `upper-hook` | ↑J↑ | 20 | attack | Upper-attack trigger: short upward velocity impulse + `contactDamageMultiplier: 1.35` for 400ms; designed to trigger `AirborneSystem` on opponent; from phase-01 upper-attack mechanic | HIGH | Fills attack exclusive gap; uses upper-attack mechanic already in engine |
| `spin-reversal-jab` | ←→← | 30 | stamina | Toggles `spinDirection` flag for 2s via `setValue` StatDelta on `spinDirection`; opponent spin-equalization disrupted; from phase-01 Zombie/LAD and reverse-engine-gear concepts | MEDIUM | Stamina beys need counter-spin disruption tool; extends existing `spinDirection` field |
| `barrier-stance` | K↑K | 15 | defense | `damageReduction` multiplier 1.25 for 500ms + `displacementResistMultPermille` boost; from phase-01 Fortress Defense / defense-type mechanics | MEDIUM — fills defense arsenal | Defense type only has `riposte`; barrier-stance gives a pure-defensive window (no counter) |
| `shell-counter` | K↓J | 20 | defense | Reactive: on next hit received within 400ms, retaliates with 1.2× damage burst; implements `on_hit_received` trigger gate set up by sequence; bridges sequence + trigger paths | MEDIUM | Demonstrates sequence-to-trigger chaining; defense exclusive complement to riposte |
| `angular-surge` | JJ← | 20 | balanced | `speed` stat multiplier 1.3 for 400ms + `aggressiveness` 1.2 for 400ms; balanced beys gain burst-sprint capability; from phase-01 angular momentum concepts | MEDIUM | Balanced only has `pivot-strike`; angular-surge gives a speed/positioning tool |
| `gyro-lock` | ↓K↓ | 0 | stamina | Free: `tiltResistance` multiplier 1.5 for 600ms; prevents nutation/wobble when spin < 40%; from phase-01 gyroscopic stability and CLAUDE.md wobble system | LOW-MEDIUM | Free-tier stamina utility; directly counters the gyroscopic wobble behavior at <40% spin |
| `burst-brace` | KJ↓ | 25 | defense | `burstResistance` multiplier 1.6 for 800ms; from phase-01 burst pressure mechanics and Gen3 recoil = burst pressure accumulation | MEDIUM | No existing combo addresses burst resistance; defense beys most need this |

**Effect ceiling compliance for all proposed combos:**
- All `damageMultiplier` values ≤ 1.5 (ceiling)
- All `lockMs` values ≤ 300ms (ceiling)
- No invulnerability proposed
- No AoE proposed
- No full spin recovery proposed (only `tiltResistance` and `burstResistance` buffs)
- `spin-reversal-jab`'s `spinDirection` setValue is not a multiplier — does not violate numeric ceilings but represents a powerful state change; cost 30 reflects this

**Key sequences avoided (conflict check):**
- `←←J` and `→→J` — already taken by `quick-dash-l` / `quick-dash-r`
- `KKK` — taken by `guard-tap`
- `←→K` — taken by `feint`
- `KKJ` — taken by `riposte`
- `←→J` — taken by `pivot-strike`
- `JJJ` — taken by `power-thrust`
- `←J→` — taken by `spin-leech-jab`
- All 8 proposed sequences are unique and not present in the existing registry.

---

## Appendix A — Key Enumerated Values Reference

### ComboKey values (8 keys, from both combos.ts files)
`moveLeft` (←), `moveRight` (→), `moveUp` (↑), `moveDown` (↓), `attack` (J), `defense` (K), `dodge` (L), `jump` (I)

### ComboTrigger values (7 total, from comboTask.ts)
`sequence`, `on_hit_received`, `on_near_ring_out`, `on_low_spin`, `on_partner_near_ring_out`, `on_opponent_special_move`, `on_burst_attempt`

### ComboAction types (5 types, from comboTask.ts)
`multiplier`, `transformation`, `spawning`, `movement`, `arena_effect`

### StatDeltaKey values (27 stats, from comboTask.ts)
Numeric: `spin`, `maxSpin`, `spinDecayRate`, `damageMultiplier`, `damageReduction`, `contactDamageMultiplier`, `recoilFactor`, `spinStealFactor`, `spinStealResist`, `aggressiveness`, `gripFactor`, `surfaceFriction`, `speed`, `mass`, `radius`, `width`, `height`, `depth`, `jumpForce`, `jumpHeight`, `suctionForce`, `wallClimbFactor`, `gravityMult`, `bounceRestitution`, `tiltResistance`, `burstResistance`
Positional: `positionX`, `positionY`, `positionZ`
String: `spinDirection`

### ComboTarget values (7 types, from comboTask.ts)
`self`, `opponent`, `all_opponents`, `friendly`, `all_friendly`, `all`, `none`, `{type:"range", radiusCm:N}`

### TransformTarget values (7, from comboTask.ts)
`gravity_well`, `obstacle`, `spin_zone`, `turret`, `hazard`, `portal`, `normal`

### SpawnableEntityType values (11, from comboTask.ts)
`portal`, `obstacle`, `gravity_well`, `spin_zone`, `pit`, `turret`, `trail`, `clone_self`, `bey_ai`, `bey_friendly`, `floor_hazard`

### ArenaEffectPayload types (8, from comboTask.ts)
`floor_override`, `gravity_change`, `arena_tilt`, `freeze_all`, `fog_of_war`, `darkness`, `reverse_controls`, `no_combos`

---

## Appendix B — ComboResult.effect Classification Logic

`classifyEffect()` in `comboSystem.ts` maps each `Combo` to a coarse effect tag used by renderer/SFX:

| Condition (evaluated in order) | Assigned effect tag |
|---|---|
| `combo.effect.dashDirection === "left"` | `"speed_burst_left"` |
| `combo.effect.dashDirection === "right"` | `"speed_burst_right"` |
| `combo.effect.dashDirection === "back"` | `"speed_burst_back"` |
| `(combo.effect.spinStealBonus ?? 0) > 0` | `"spin_steal"` |
| `(combo.effect.damageMultiplier ?? 1) > 1` | `"damage_boost"` |
| default | `"guard"` |

Applying to all 8 registry combos:
- `quick-dash-l` → `speed_burst_left`
- `quick-dash-r` → `speed_burst_right`
- `guard-tap` → `guard` (damageMultiplier is exactly 1.0, not > 1)
- `feint` → `speed_burst_back`
- `riposte` → `damage_boost` (1.3 > 1)
- `pivot-strike` → `damage_boost` (1.25 > 1)
- `power-thrust` → `damage_boost` (1.5 > 1)
- `spin-leech-jab` → `spin_steal` (spinStealBonus: 0.08 > 0; checked before damage_boost)

---

## Appendix C — Turret Attack System vs BehaviorRef Namespace

The turret attack system (`TurretAttackType` union, ~175+ entries as of session 12) is a **parallel dispatch system** that overlaps conceptually with BehaviorRef but is architecturally distinct.

### Relationship to BehaviorRef

| Property | Combo BehaviorRef | Turret Attack |
|---|---|---|
| Dispatch key | `behaviorId` string (e.g. `"movement.dash_to"`) | `attackType` string (e.g. `"kamehameha"`) |
| Compiled by | `comboTaskCompiler.ts` at admin-save time | Directly dispatched at runtime in `TurretProcessor.ts` |
| Handler location | Unknown — `BehaviorRef` handlers not found | Exported functions in `TurretProcessor.ts` |
| State tracking | `BeyComboMatchState` per-bey in room | `TurretRuntimeState` per-turret in room |
| Triggered by | Bey input sequence (3-key window) | Arena turret attacking a bey |
| Target | Self (primarily), sometimes opponent | Bey(s) in turret range |
| Player agency | Player chooses when to input sequence | Automatic — turret fires on cooldown |

### Turret attack taxonomy (session 11+12 — 175+ types)

| Category | Count | Physics Pattern |
|---|---|---|
| Projectile (basic) | 10 | Physics body fired at target |
| AoE blast | 15 | Radius check, falloff damage + knockback |
| Beam line | 12 | Axis-projection intersection test |
| Timed debuff | 25 | `runtimeState.*UntilMs` + tick processor restores |
| Seeking/homing | 8 | Per-tick angle correction toward target |
| Ghost/illusion | 12 | Schema position override (`bey.x/y` set to false coords) |
| Buff on bey | 12 | `(bey as any)._xxx` flag, checked in collision handler |
| AoE field (persistent) | 20 | Per-tick radius check while `*UntilMs` active |
| Multi-target | 10 | Loop all beys, apply per-bey |
| Contro bey (power-up) | 8 | Mark bey with `(bey as any)._xxx` buff; bey IS the weapon |
| Summon/spawn | 8 | Create projectile or spawn child entity |
| Transformation | 15 | Set `(bey as any)._speedScale/_collisionDamageMult/_radiusScale` |
| Drain/leeching | 12 | Per-tick health/spin subtraction on target |
| Environmental | 8 | Modify arena physics globally |

### Ghost/Illusion pattern (key session 11-12 addition)

Illusion moves exploit Colyseus schema sync: writing false coordinates to `bey.x/y` (schema fields) causes all clients to render at the wrong position. Physics continues at true Matter.js body position via the bridge. On expiry, `_realX/Y` values are restored.

Four illusion variants implemented:
- **`kyoka_suigetsu`** — random ghost offset for all beys, drifts each tick
- **`mirror_world`** — larger random ghost offsets, drifts each tick
- **`genjutsu_veil`** — smaller drift per tick, longer duration
- **`mind_fracture`** — ghost position + `_mindFractureInvertInputs` flag (controls inversion)
- **`perfect_mirage`** — sets target `isActive = false` so client renders nothing

### Contra bey power-up pattern (session 12)

Bey IS the weapon — turret gives the bey a buff that changes its collision/movement behavior:
- `spread_bey` — `(bey as any)._spreadBeyCount` → on next collision fan into N vectors
- `railbey` — `(bey as any)._railbeyActive` + runtime `railbeyUntilMs` → turbo-speed + pierce
- `minigun_bey` — runtime pulse loop fires rapid damage from shooter to nearest bey
- `heat_seeker_bey` — instant ram at nearest opponent with high force
- `bomb_bey` — runtime fuse timer; on detonation AoE at bey's position
- `shield_bey` — sets `target.invulnerable = true`, `_shieldBeyHp = 1` for 1-hit absorb
- `turbo_bey` — `_turboSpeedMult/_turboCollisionMult` boost for duration
- `cannon_bey` — `applyKnockback` toward furthest opponent at 3000 force units

---

[← Phase 03: Special Move -> Bey Map](phase-03-specialmove-bey-map.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 05: Parts →](phase-05-parts.md)

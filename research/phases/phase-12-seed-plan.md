# Phase 12 — Seed Planning

> **Stage 12** — Complete seeding strategy for all Firestore collections.
> Source: phase-11-architecture.md + all batch files + research phases.
> Every seed script is idempotent (safe to re-run).

---

## 1. Seed Script Inventory

### Priority P0 — Required Before First Match

| Script | File | Collection | Writes | Notes |
|--------|------|-----------|--------|-------|
| Beyblades | `scripts/seed-beyblades.ts` | `beyblade_stats` | 334+ beys with gimmickIds + systemId + specialMoveId + comboIds | Extend existing script |
| Special Moves | `scripts/seed-special-moves.ts` | `special_moves` | 119+ moves as SpecialMoveConfig (steps[]) | Migrate from old SpecialMoveDef |
| Combos | `scripts/seed-combos.ts` | `combos` | 8 existing + 8 new proposed | Add effectId field |
| Combo Effects | `scripts/seed-combo-effects.ts` | `combo_effects` | ComboEffectDef per combo | NEW — currently missing |
| Arenas | `scripts/seed-arenas.ts` | `arenas` | 13+ canonical stadiums as ArenaConfig | Extend existing |
| Element Types | `scripts/seed-element-types.ts` | `element_types` | 12×12 matrix | existing — done |

### Priority P1 — Required for Gimmick + Part System

| Script | File | Collection | Writes | Notes |
|--------|------|-----------|--------|-------|
| Mechanic Defs | `scripts/seed-mechanic-defs.ts` | `mechanic_defs` | 31 mechanic definitions | NEW |
| Gimmick Defs | `scripts/seed-gimmick-defs.ts` | `gimmick_defs` | 22 gimmick recipes | NEW |
| Arena Systems | `scripts/seed-arena-systems.ts` | `arena_systems` | elevation/wall/slope configs | existing — done |
| 2.5D Parts | `scripts/seed-2d-parts.ts` | `beyblade_parts` | part library | existing — done |
| Bey Systems | `scripts/seed-bey-systems.ts` | `beyblade_systems` | assembled 2.5D configs | existing — done |

### Priority P2 — Required for Full Presentation Layer

| Script | File | Collection | Writes | Notes |
|--------|------|-----------|--------|-------|
| Camera Profiles | `scripts/seed-camera-profiles.ts` | `camera_profiles` | per-event camera configs | NEW |
| Audio Profiles | `scripts/seed-audio-profiles.ts` | `audio_profiles` | per-event audio configs | NEW |
| Round Modifiers | `scripts/seed-round-modifiers.ts` | `round_modifiers` | modifier definitions | NEW/verify |
| Animation Presets | `scripts/seed-animation-presets.ts` | `animation_presets` | animation configs | verify existing |
| Behavior Defs | `scripts/seed-behavior-defs.ts` | `behavior_defs` | behavior type schemas | verify existing |

### Priority P3 — Visual Scripting Infrastructure

| Script | File | Collection | Writes | Notes |
|--------|------|-----------|--------|-------|
| Composition Blocks | `scripts/seed-composition-blocks.ts` | `composition_blocks` | block type catalog | NEW |

---

## 2. Beyblade Seed Data Plan

### 2.1 Coverage (from Stage 7 research)

| Generation | System | Count | Priority |
|-----------|--------|-------|---------|
| Gen1 Plastic | `plastic_4layer`, `plastic_neo_sg`, `plastic_engine_gear`, `plastic_magnacore` | 94 | P1 — Tier1+2 first |
| Gen1 HMS | `hms` | 29 | P1 — all 29 small set |
| Gen2 MFB | `mfb` | 54 | P0 — meta beys Tier1 first |
| Gen2 Zero-G | `mfb_zerog` | 13 | P1 |
| Gen3 Burst S1 | `burst_s1` | 20 | P0 — Tier1 (Valtryek, Spryzen etc.) |
| Gen3 God | `burst_god` | 20 | P1 |
| Gen3 Cho-Z | `burst_choz` | 20 | P1 |
| Gen3 GT | `burst_gt` | 15 | P1 |
| Gen3 Superking | `burst_superking` | 12 | P2 |
| Gen3 DB | `burst_db` | 7 | P2 |
| Gen3 BU | `burst_bu` | 3 | P2 |
| Gen4 BX | `bx` | 33 | P0 — current gen, Tier1 first |
| Game Original | `game_original` | 14 | P1 |

### 2.2 First-Pass Seed (40+ minimum for P0 launch)

Minimum viable bey set for playable game:

**Iconic from each gen** (12 beys):
- Gen1: Dragoon GT (attack), Draciel S (defense), Wolborg 4 (stamina), Dranzer MS (HMS)
- Gen2: Storm Pegasus (attack), Earth Eagle (stamina), Rock Leone (defense), Basalt Horogium (stamina)
- Gen3: Valtryek V3 (attack), Spryzen Requiem (balance), Twin Nemesis (stamina), Nightmare Longinus (attack)
- Gen4: Dran Sword (attack), Leon Claw (defense), Wizard Arrow (stamina)

**Per-type coverage** (28 more):
- 7 attack types: 2 per gen (Gen1+2), 1 each Gen3/Gen4
- 7 defense types: same
- 7 stamina types: same
- 7 balance types: same

### 2.3 Beyblade Seed Record Format

```typescript
interface BeybladeSeedRecord {
  id: string;               // kebab-case unique
  name: string;
  type: 'attack' | 'defense' | 'stamina' | 'balance';
  attackPoints: number;     // sum ≤ 360, max 150
  defensePoints: number;
  staminaPoints: number;
  spinDirection: 'right' | 'left';
  mass: number;             // grams (real-world)
  radius: number;           // cm (real-world)
  systemId: string;         // from BEY_SYSTEM_DEFS
  gimmickIds: string[];     // from GIMMICK_REGISTRY
  specialMoveId?: string;   // from special_moves collection
  comboIds?: string[];      // max 3, from combos collection
  generation: 1 | 2 | 3 | 4;
  productCode?: string;     // e.g. "BB-28", "B-127"
  tier: 1 | 2 | 3;          // competitive tier
}
```

---

## 3. Special Move Seed Data Plan

### 3.1 Coverage (from Stage 2 research)

| Generation | Count | Source |
|-----------|-------|--------|
| Gen1 Plastic (individual files) | ~20 | linka/special-moves/*.md |
| Gen1 HMS | ~5 | gen1-extras-batch.md |
| Gen2 MFB | ~25 | gen2-extras-batch.md + individual |
| Gen3 Burst | ~30 | gen3-extras-batch.md + individual |
| Gen4 BX | ~10 | gen4-xtreme-dash-variants.md + individual |
| Game Original | ~29 | linka-moves-batch.md |
| **Total** | **~119** | |

### 3.2 SpecialMoveConfig Seed Record Format

```typescript
interface SpecialMoveSeedRecord {
  id: string;               // kebab-case
  name: string;
  type: 'attack' | 'defense' | 'stamina' | 'balance';
  powerCost: number;        // 0/50/100/150/200
  windupTicks: number;      // frames before executing
  bleedTicks: number;       // frames after executing before cooldown
  locksDurationTicks: number;
  cancelableByQTE: boolean;
  steps: SpecialMoveStep[];
  generation: 1 | 2 | 3 | 4;
}
```

### 3.3 Migration from SpecialMoveDef

The 5 hardcoded moves in `server/constants/specialMoves.ts` must be migrated:

| Old ID | New ID | Migration Notes |
|--------|--------|----------------|
| `stampede_rush` | `stampede-rush` | Convert `effects.force` to `velocity_burst` step |
| `gyro_anchor` | `gyro-anchor` | Convert `effects.invulnerability` to `defense_stance` step |
| `spin_recovery` | `spin-recovery` | Convert `effects.orbitForce` to `orbit_movement` step |
| `tactical_burst` | `tactical-burst` | Convert to `velocity_burst` + `stamina_recovery` steps |
| `shock_pulse` | `shock-pulse` | Convert to `smash_impact` area step |

---

## 4. Combo + Combo Effect Seed Data Plan

### 4.1 Existing 8 Combos — Add effectId

```typescript
// seed-combos.ts additions:
const comboEffectIds = {
  'quick-dash-l':    'fx-quick-dash-l',
  'quick-dash-r':    'fx-quick-dash-r',
  'guard-tap':       'fx-guard-tap',
  'feint':           'fx-feint',
  'riposte':         'fx-riposte',
  'pivot-strike':    'fx-pivot-strike',
  'power-thrust':    'fx-power-thrust',
  'spin-leech-jab':  'fx-spin-leech-jab',
};
```

### 4.2 ComboEffectDef Format

```typescript
interface ComboEffectDefSeedRecord {
  id: string;             // e.g. "fx-quick-dash-l"
  name: string;
  tasks: ComboTask[];     // compiled by ComboTaskCompiler at save-time
  triggers: ComboTrigger[];
  timing: ComboTiming;
  condition?: ComboCondition;
}
```

### 4.3 Proposed New Combos (from Stage 4 research)

8 additional combos bridging attack-type gap and defense coverage:

| New ID | Sequence | Cost | Type | effectId |
|--------|---------|------|------|---------|
| `smash-rush` | J→→ | 15 | attack | `fx-smash-rush` |
| `upper-hook` | ↑J↑ | 25 | attack | `fx-upper-hook` |
| `spin-reversal-jab` | ←J→ | 35 | stamina | `fx-spin-reversal-jab` |
| `gyro-lock` | ↓↓K | 15 | stamina | `fx-gyro-lock` |
| `barrier-stance` | KKL | 15 | defense | `fx-barrier-stance` |
| `shell-counter` | LKJ | 25 | defense | `fx-shell-counter` |
| `burst-brace` | KJK | 35 | defense | `fx-burst-brace` |
| `angular-surge` | →↑J | 25 | balance | `fx-angular-surge` |

---

## 5. Arena Seed Data Plan

### 5.1 Coverage (from Stage 9 research)

| Stadium | ID | Key Features | ArenaConfig Fields |
|---------|----|--------------|--------------------|
| Gen1 Beystadium | `gen1-standard` | Simple bowl, no hazards | shape, dimensions |
| Spin Stadium | `spin-stadium` | Speed rails, spin zones | loops, spinZones |
| Magnacore Stadium | `magnacore-stadium` | Magnetic poles | gravityWells (magnetic) |
| BB-10 Attack | `bb10-attack` | Large attack arena | obstacles |
| Gravity Perseus Stadium | `gravity-perseus` | Tilted floor | arenaSystem.slopePhysics |
| Zero-G Stadium | `zero-g` | Hanging/zero-g | hasZeroG=true |
| Burst Standard | `burst-standard` | Pocket zones | pits |
| Slingshock Stadium | `slingshock` | Rail system | arenaLinks (rail type) |
| Hypersphere Stadium | `hypersphere` | Wall-climbing | wallProfile |
| BX Xtreme Stadium | `bx-xtreme` | Xtreme Dash rails | xtremeRails[] |
| Destroyer Dome | `destroyer-dome` | Turrets | turrets |
| Battle Bladers | `battle-bladers` | Tournament special | large dimensions |
| Hyper Wrap Stadium | `hyper-wrap` | Wrap rail | arenaLinks |

### 5.2 ArenaConfig Seed Record Format

```typescript
interface ArenaSeedRecord {
  id: string;
  name: string;
  shape: 'circular' | 'oval' | 'square';
  dimensions: { width: number; height: number }; // in cm × 24 for px
  wallHeight?: number;
  bowlAngle?: number;
  obstacles?: ObstacleConfig[];
  loops?: LoopConfig[];
  pits?: PitConfig[];
  spinZones?: SpinZoneConfig[];
  bumps?: BumpConfig[];
  gravityWells?: GravityHoleConfig[];
  turrets?: TurretConfig[];
  portals?: PortalConfig[];
  switches?: SwitchConfig[];
  floorHazardZones?: FloorHazardZone[];
  triggerZones?: TriggerZoneConfig[];
  autoRotate?: boolean;
  rotationSpeed?: number;
  generation: 1 | 2 | 3 | 4;
  hasZeroG?: boolean;         // NEW field needed
}
```

---

## 6. Mechanic Defs Seed Data

```typescript
// scripts/seed-mechanic-defs.ts
const MECHANIC_DEF_SEEDS = [
  { id: 'velocity_burst', description: 'Direct velocity impulse', paramsSchema: { forceMagnitude: 'float', durationTicks: 'int' }, events: ['onActivate'] },
  { id: 'attack_amplifier', description: 'Timed damage multiplier', paramsSchema: { multiplier: 'float', durationTicks: 'int' }, events: ['tick', 'onActivate'] },
  { id: 'orbit_movement', description: 'Tangential orbit force', paramsSchema: { orbitRadius: 'float', orbitSpeed: 'float', direction: 'string' }, events: ['tick'] },
  { id: 'energy_reserve', description: 'Spring-loaded spin burst', paramsSchema: { chargeRate: 'float', dischargeThreshold: 'float', burstForce: 'float' }, events: ['tick', 'onActivate'] },
  { id: 'free_spin', description: 'Reduced spin decay + steal resist', paramsSchema: { decayModifier: 'float', stealResistBonus: 'float' }, events: ['tick'] },
  // ... (all 31 mechanics from phase-06-mechanics.md)
];
```

---

## 7. Gimmick Defs Seed Data

```typescript
// scripts/seed-gimmick-defs.ts
const GIMMICK_DEF_SEEDS = [
  { id: 'engine_gear', mechanics: ['energy_reserve', 'velocity_burst', 'attack_amplifier'], description: 'Spring-loaded reserve fires velocity burst on release' },
  { id: 'final_drive', mechanics: ['spin_threshold_switch', 'mode_switch'], description: 'Auto mode-switch at spin threshold' },
  { id: 'bearing_zombie', mechanics: ['free_spin', 'spin_equalization'], description: 'Free-spin LAD strategy' },
  { id: 'movable_sub_layer', mechanics: ['burst_suppress'], description: 'Dynamic burst resistance' },
  { id: 'heavy_wheel', mechanics: ['weight_shift'], description: 'Mass-based defense' },
  { id: 'ad145_deflect', mechanics: ['contact_deflect'], description: 'Angle-based damage deflect' },
  { id: 'xtreme_dash', mechanics: ['rail_lock', 'velocity_burst'], description: 'BX rail speed system' },
  { id: 'spin_steal_coupling', mechanics: ['spin_transfer', 'free_spin'], description: 'Glancing spin drain' },
  { id: 'counter_rotation', mechanics: ['rotation_reverse', 'spin_direction_bonus'], description: 'Spin reversal + counter bonus' },
  { id: 'left_spin_steal', mechanics: ['spin_direction_bonus', 'spin_transfer'], description: 'Left-spin steal bonus' },
  { id: 'upper_attacker', mechanics: ['upper_launch', 'contact_height_gate'], description: 'AR upper geometry' },
  { id: 'smash_attacker', mechanics: ['smash_impact', 'contact_height_gate'], description: 'AR smash geometry' },
  { id: 'rubber_attack', mechanics: ['rubber_grip', 'spin_transfer'], description: 'Rubber contact drain' },
  { id: 'burst_armor', mechanics: ['burst_suppress', 'defense_stance'], description: 'Gen3 layer burst protection' },
  { id: 'xtreme_line', mechanics: ['rail_lock', 'velocity_burst', 'center_pull'], description: 'Full BX Xtreme Dash system' },
  { id: 'gravity_mode', mechanics: ['zero_g_float', 'mode_switch'], description: 'Zero-G activation' },
  { id: 'magnacore_pull', mechanics: ['magnetic_pull', 'center_pull'], description: 'Magnacore magnetic stage' },
  { id: 'cho_z_spin_boost', mechanics: ['stamina_recovery', 'spin_transfer'], description: 'Cho-Z contact spin generation' },
  { id: 'bx_bit_gimmick', mechanics: ['mode_switch'], description: 'BX Bit mode configuration' },
];
```

---

## 8. npm Script Additions

Add to `package.json` scripts:

```json
{
  "seed:mechanic-defs": "ts-node scripts/seed-mechanic-defs.ts",
  "seed:gimmick-defs": "ts-node scripts/seed-gimmick-defs.ts",
  "seed:combo-effects": "ts-node scripts/seed-combo-effects.ts",
  "seed:camera-profiles": "ts-node scripts/seed-camera-profiles.ts",
  "seed:audio-profiles": "ts-node scripts/seed-audio-profiles.ts",
  "seed:composition-blocks": "ts-node scripts/seed-composition-blocks.ts",
  "seed:all": "npm run seed:beyblades && npm run seed:arenas && npm run seed:combos && npm run seed:combo-effects && npm run seed:special-moves && npm run seed:mechanic-defs && npm run seed:gimmick-defs && npm run seed:camera-profiles && npm run seed:audio-profiles && npm run seed:2d-parts && npm run seed:bey-systems && npm run seed:arena-systems && npm run seed:element-types && npm run seed:ai-battles && npm run seed:composition-blocks"
}
```

---

## 9. Seeding Order (dependency-safe)

1. `seed:element-types` — no deps
2. `seed:behavior-defs` — no deps
3. `seed:mechanic-defs` — no deps
4. `seed:gimmick-defs` — depends on mechanic-defs
5. `seed:special-moves` — no deps (self-contained SpecialMoveConfig)
6. `seed:combo-effects` — depends on behavior-defs
7. `seed:combos` — depends on combo-effects
8. `seed:beyblades` — depends on special-moves + combos + gimmick-defs
9. `seed:2d-parts` — no deps
10. `seed:bey-systems` — depends on 2d-parts
11. `seed:arena-systems` — no deps
12. `seed:arenas` — depends on arena-systems
13. `seed:ai-battles` — depends on beyblades + arenas
14. `seed:camera-profiles` — depends on mechanic-defs + gimmick-defs + special-moves
15. `seed:audio-profiles` — depends on mechanic-defs
16. `seed:animation-presets` — no deps
17. `seed:composition-blocks` — no deps
18. `seed:tournament-ai-solo` — depends on beyblades + arenas

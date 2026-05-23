---
batch: 002
stage: 1B
status: complete
---

## Research Completed
Bey systems, gear types, HMS, Burst system components, special parts (42 concepts)

## Facts Extracted

| Item | Raw Fact | Evidence Type | Confidence |
|------|---------|---------------|-----------|
| Gen1 (4-Layer System) | 4 interchangeable layers: Bit Chip + Attack Ring + Weight Disk (iron) + Blade Base; right-spin only; screwdriver assembly | FACT | HIGH |
| Hard Metal System (HMS) | All-metal AR (metal frame + ABS caul); Running Core replaces SG+BB; metal-on-metal CoR ≈ 0.9; smaller and faster than plastic | FACT | HIGH |
| Engine Gear System | Spring-loaded gear releases burst at launch; Standard EG vs Turbo EG (4×); initial RPM spike then dissipates; maps to coreReserveRemaining | FACT | HIGH |
| Spin Gear System | Star-shaped gear determines spin direction (left/right); backward-compatible with 4-Layer | FACT | HIGH |
| Neo Spin Gear / Magnacore | Hollow center for interchangeable cores (Normal, Bearing, Running, Magnecore, Heavy Metal) | FACT | HIGH |
| Magnacore System | Magnetic cores + stadium magnets; north=attract (defense), south=repel (attack); non-standard competitive | FACT | HIGH |
| Free spin | Component rotating independently via bearing/bushing/chain; decouples friction; enables LAD | FACT | HIGH |
| Bearing defense | Free-spinning bearing tips decouple body rotation; upper body retains spin while tip slows; zombie archetype | FACT | HIGH |
| Metal contact CoR | CoR ≈ 0.85–0.95 elastic; short contact duration; maximum recoil; self-KO risk high | FACT | HIGH |
| Plastic contact CoR | CoR ≈ 0.5–0.7; moderate recoil + spin drain; contact point geometry determines attack type | FACT | HIGH |
| Rubber flat (RF) tip | Highest traction coefficient (~4–5× plastic friction); maximum flower pattern attack speed; must be worn before use | FACT | HIGH |
| Shock absorption | Round contact surfaces + high mass + inward WD + rubber = absorbs kinetic energy | FACT | HIGH |
| Dual-spin | Gen1: swap Spin Gears. Gen2: rare (Gravity Destroyer, L-Drago). Gen3: Spriggan 7, Diabolos | FACT | HIGH |
| Chassis (DB) | Replaces Forge Disc in S6-S7; single (~16g attack) vs double (~20g defense/stamina) | FACT | HIGH |
| Forge Disc | Gen3 middle component; numbered (0-10) or named; weight ~14-24g; houses ratchet teeth | FACT | HIGH |
| Gatinko Chip | GT/BU-era replaceable spirit chip; ~3-5g; swappable cross-spirit combinations | FACT | HIGH |
| Frame (GT/Superking) | Additional outer ring on Forge Disc; adds 5-7g at max radius; multiple types | FACT | HIGH |
| Layer Base | GT/BU structural main body; separates into Layer Base + Gatinko Chip (S4); contact geometry carrier | FACT | HIGH |
| Layer Weight (Cho-Z) | Metal clip-on ~5-7g zinc alloy; increases smash force; improves burst resistance | FACT | HIGH |
| DB Core | S6-S7 structural hub; connects Armor+Blade to Chassis+Tip; ~8g; not a competitive variable | FACT | HIGH |
| V Gear (auto mode-switch) | Dynamic mode-switching triggered by real-time spin rate; spring-loaded or friction-release | INFERENCE | MEDIUM |
| Roller Defense | Gen3 special move by Silas; deflection via angle/momentum; OR Gen1 AR with free-spinning rollers | FACT/INFERENCE | MEDIUM |
| Mode gear types | D=defense, F=flat/attack, H=high, L=low, S=stamina, V=variable, VS=both; ~2g each; GT-era | FACT | HIGH |

## Existing Stat Mapping

| Research Finding | Existing Field Used | New Field Proposed? |
|-----------------|---------------------|---------------------|
| HMS metal contact | MATERIAL_MULTIPLIERS metal row (CoR 0.9) | No |
| Engine Gear burst | coreReserveRemaining + tickSpinInjection | No |
| Spin direction (SG) | spinDirection field + CLASH_MULTIPLIERS | No |
| Free spin bearing | free_spin mechanic (spinDecayRate↓ + spinStealResist↑) | No |
| Rubber flat tip | gripFactor + surfaceFriction (rubber values) | No |
| Shock absorption | damageReduction + MATERIAL_MULTIPLIERS rubber row | No |
| Metal contact | MATERIAL_MULTIPLIERS metal row | No |
| Chassis weight difference | mass field (single=lighter, double=heavier) + defensePoints | No |
| Layer Weight (metal clip) | mass field delta + attackPoints adjustment | No |
| Mode gear types (D/F/H/L/S) | aggressiveness + gripFactor + surfaceFriction (mode_switch mechanic) | No |
| V Gear auto-switch | spin_threshold_switch mechanic | No |
| Dual-spin | spinDirection field | No |
| Magnacore stadium magnets | effectiveGravity override / special arena feature | NEW: arena magnet zone mechanic (low priority, non-competitive) |

## New Mechanics Needed (Batch 2)

| Candidate | Why | Evidence | Status |
|-----------|-----|----------|--------|
| `magnet_zone` arena mechanic | Stadium magnet tiles push/pull bey; non-contact force; only for Magnacore arenas | FACT (Magnacore system described) | LOW PRIORITY (non-competitive, optional) |
| `v_gear_auto_switch` | Spin-rate-triggered automatic mode switch; distinct from manual mode_switch | INFERENCE (V Gear spring mechanism) | MAPS TO spin_threshold_switch mechanic |

## Shared Mechanics Discovered (Batch 2)

| Mechanic ID | Used By | Derived From |
|-------------|---------|-------------|
| `mode_switch` | All mode gears (D/F/H/L/S/VS), Final Drive, Running Core | applyStatModifier targeting aggressiveness/gripFactor/surfaceFriction |
| `spin_threshold_switch` | V Gear auto-switch, Final Drive, 4D System | isTriggerMet(spin_threshold) → applyStatModifier |
| `free_spin` | Bearing tips (Burst), Bearing Core (Plastic), Bearing Base (HMS) | spinDecayRate↓ + spinStealResist↑ |
| `energy_reserve` | Engine Gear (Gen1), Running Core variants, Turbo EG | coreReserveRemaining → velocity_burst fire |
| `weight_shift` | Layer Weight (Cho-Z), Outer WD, metal Forge Disc variants | mass delta + knockbackDistance reduction |
| `burst_suppress` | Movable Sub-Layer (Burst), high-teeth Ratchet (BX), Double Chassis | burstResistance dynamic boost |
| `spin_steal_coupling` | Bearing Base + EG Spring-loaded, HMS Advance Averazer | spinStealFactor on glancing angle |

## Coverage Summary

All 42 system/gear concepts processed. 3 concepts need genuinely new mechanics (Magnacore stadium magnet zone). All other concepts map cleanly to existing engine fields via mode_switch, spin_threshold_switch, free_spin, energy_reserve, weight_shift, burst_suppress, spin_steal_coupling.

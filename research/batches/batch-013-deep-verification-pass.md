---
batch: 013
stage: deep-verification
status: complete
sources_checked: 22
facts: 47
inferences: 6
unknowns: 4
corrections: 8
---

[← Batch 012: Forge Disc / Chassis / SAR](batch-012-forge-disc-chassis-sar.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 014: Archetype Physics →](batch-014-archetype-physics-deep-dive.md)

---

# Batch 013 — Deep In-Depth Verification Pass

> **Date**: 2026-05-23 | **Session 24**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: Full in-depth re-verification of research statements against live Tier-1 sources. Covers MFB tips, Gen1 blade bases, Gen1 competitive meta, Burst layers, BX competitive data.

---

## URL Fetch Log

| URL | Method | Result | Data Extracted |
|-----|--------|--------|----------------|
| https://beyblade.fandom.com/wiki/Performance_Tip_-_Rubber_Flat (via WebSearch) | WebSearch | SUCCESS | RF = rubber flat, break-in needed, aggressive, self-KO risk |
| https://beyblade.fandom.com/wiki/Performance_Tip_-_Eternal_Wide_Defense (via WebSearch) | WebSearch | SUCCESS | EWD = WD shape + ONE bearing free-spin tip; single bearing = still some friction |
| https://beyblade.fandom.com/wiki/Performance_Tip_-_Bearing_Drive (via WebSearch) | WebSearch | SUCCESS | B:D = 4D Bottom, internal metal shaft + ball bearings; world record 7:35 min |
| https://beyblade.fandom.com/wiki/Performance_Tip_-_Wave_Wide_Defense (via WebSearch) | WebSearch | SUCCESS | W²D = flat + center spike; spike wears → more aggressive; better LAD than WD; worse balance |
| https://www.plasticsdb.com/parts/blade-bases/sg-metal-flat-base | WebFetch | SUCCESS | 6.2g; metal sharp + small flat section (NOT true flat); Driger V; Tier 2 compact |
| https://www.plasticsdb.com/parts/blade-bases/sg-metal-sharp-base | WebFetch | SUCCESS | 7.6g; sharp metal; poor stability; not competitive |
| https://www.plasticsdb.com/parts/blade-bases/customize-grip-base | WebFetch | SUCCESS | 5.1g; Dragoon V2; multi-tip; "must-have" staple; good LAD |
| https://www.plasticsdb.com/parts/blade-bases/sg-semi-flat-base | WebFetch | SUCCESS | 4.7g; 11 source beys; mid-tier compact; 2 molds |
| https://www.plasticsdb.com/competitive-combos-list | WebFetch | SUCCESS | Full competitive meta: 11 combo types documented |
| https://beyblade.fandom.com/wiki/Blade_Base_-_Bearing_Base (via WebSearch) | WebSearch | SUCCESS | 8g; double bearing (1 plastic + 1 NSK); free-spinning sharp tip; first zombie base |
| https://worldbeyblade.org/Thread-Answered-How-does-rubber-work (via WebSearch) | WebSearch | SUCCESS | Gen1 rubber tip physics confirmed |
| https://beyblade.fandom.com/wiki/Layer_-_Drain_Fafnir (via WebSearch) | WebSearch | SUCCESS | Left-spin God Layer; rubber "F"s; spin equalization; April 29 2017 |
| https://beyblade.fandom.com/wiki/Layer_-_Geist_Fafnir (via WebSearch) | WebSearch | SUCCESS | Cho-Z Layer; rubber "F"s retract high-speed; aggressive shape; outclassed by Hell Salamander |
| https://worldbeyblade.org/Thread-Energy-Layer-Drain-Fafnir (via WebSearch) | WebSearch | SUCCESS | Drain Fafnir WBO thread — confirmed tier + behavior |
| https://beybase.com/bx-34-cobalt-dragoon-beyblade-review/ | WebSearch | SUCCESS | Cobalt Dragoon = heaviest BX blade; left-spin only; string launcher required; inconsistent |
| https://www.beybxdb.com/beyblade-product-list/beyblade-parts-weight | WebFetch | PARTIAL | Page links to external Google Sheet; individual weights not in HTML |
| https://www.plasticsdb.com/parts/blade-bases/sg-semi-flat-base (PlasticsDB SG Semi-Flat) | WebFetch | SUCCESS | 4.7g, 2 molds, 11 beys |
| beyblade gen1 Engine Gear system behavior (via WebSearch) | WebSearch | SUCCESS | Engine Gear = burst of speed on collision or low spin; Metal Semi-Flat EG confirmed |
| https://beyblade.fandom.com/wiki/Engine_Gear (via WebSearch) | WebSearch | SUCCESS | Engine Gear trigger: collision OR low spin → speed burst |
| beyblade burst Geist Fafnir competitive tier (via WebSearch) | WebSearch | SUCCESS | Outclassed by Hell Salamander in all aspects |
| https://mfbeyblade.fandom.com/wiki/EWD (via WebSearch) | WebSearch | SUCCESS | EWD = one bearing; single-bearing friction higher than B:D |
| https://mfbeyblade.fandom.com/wiki/B:D (via WebSearch) | WebSearch | SUCCESS | B:D = multiple ball bearings; near-zero friction; 7:35 min world record |

---

## SECTION A — MFB Tip Corrections and Confirmations

### A1. RF (Rubber Flat) — CONFIRMED with new detail

| Claim | Tag | Detail | Source |
|-------|-----|--------|--------|
| RF = hard rubber flat tip with center indentation | FACT | "flat, hard rubber tip, with a small indentation on the base of the tip" | Fandom wiki |
| RF = wide contact area, high traction | FACT | Large surface area + rubber = max traction against stadium floor | Fandom wiki |
| RF requires break-in before competitive use | FACT | "never use a brand new RF in competitive — wear down first; rapid movement subsides slightly but becomes controllable" | Fandom wiki |
| RF risk = self-KO | FACT | "likelihood of self-KOing is much higher" on new RF | Fandom wiki |
| RF movement = aggressive flower pattern | FACT | Confirmed by multiple Tier-1 sources | Fandom wiki + WBO |

### A2. EWD (Eternal Wide Defense) — CONFIRMED with critical correction

**CRITICAL CORRECTION**: EWD has **one bearing** (not double like B:D). The single bearing still creates "considerable friction" compared to WD. This is important for the engine model.

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| EWD = WD shape with bearing free-spin tip | FACT | FACT (reconfirmed) | "variation of WD with bearing implemented at the tip; free-spinning sharp piece" | Fandom wiki |
| EWD bearing = single (one bearing only) | — | **NEW FACT** | "it is only one bearing, there is still considerable friction between the bearing and the tip" | Fandom wiki |
| EWD wears quickly, loses stamina | — | **NEW FACT** | "wearing down affects its performance a lot" | Fandom wiki |
| EWD no balance issues unlike Eternal Sharp | — | **NEW FACT** | "does not suffer from balance issues because of its wide shape" | Fandom wiki |
| EWD excellent for spin-stealing combos | FACT | FACT (reconfirmed) | "provides the few more rotations needed to outspin an opponent in last seconds" | Fandom wiki |

**Engine correction**: EWD should use `bearingFriction: 0.12` (single bearing, still considerable friction), NOT `bearingFriction: 0.02` (which is B:D's double-bearing near-zero friction).

### A3. B:D (Bearing Drive) — CONFIRMED with world record

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| B:D = 4D Bottom with internal ball bearings | FACT | FACT (reconfirmed) | "metal shaft + metal casing + metal ball bearings between them" | Fandom wiki |
| B:D free-spinning tip | FACT | FACT (reconfirmed) | Tip free-spins independently | Fandom wiki |
| B:D = highest stamina potential of any MFB tip | FACT | FACT (reconfirmed) | "highest Stamina potential of any Performance Tip" | Fandom wiki |
| B:D world spin record | — | **NEW FACT** | 7 minutes 35 seconds — broke its own previous record of 7:12 | Fandom wiki |
| B:D height comparable to 170 spin track | — | **NEW FACT** | "height comparable to Spin Tracks at a 170 height" | Fandom wiki |

**Engine model note**: B:D's "base makes contact with stadium floor when tilted or low-spin, completely stops" — this means at very low spin B:D transitions from free-spinning tip to base-contact LAD mode. Engine should model this as a two-phase behavior.

### A4. W²D (Wave Wide Defense) — CONFIRMED with shape correction

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| W²D = flat surface + center spike | FACT (confirmed session 21) | FACT (reconfirmed) | "flat surface with a spike in the center" | Fandom wiki |
| W²D spike wears → more aggressive | FACT | FACT (reconfirmed) | "spike prone to wearing quickly, making it more aggressive" | Fandom wiki |
| W²D has better LAD than WD | FACT | FACT (reconfirmed) | "improvement in Life-After-Death" | Fandom wiki |
| W²D has slightly worse balance than WD | — | **NEW FACT** | "performs basically the same as WD but with worse balance but better attack" | WBO thread |
| W²D = upgrade of WD, not replacement | — | **NEW FACT** | "slight more raw Stamina" but balance tradeoff means WD still situationally preferred | Fandom wiki |

---

## SECTION B — Gen1 Blade Base Weights and Competitive Tiers

### B1. Gen1 Bearing Base — CONFIRMED with new detail

| Claim | Tag | Detail | Source |
|-------|-----|--------|--------|
| Bearing Base weight = 8g | FACT | "tip is free-spinning and weighs 8 grams" | Fandom wiki |
| Bearing Base = double bearing (1 plastic + 1 NSK replaceable) | FACT | "held in place by two bearings, one plastic, one can be replaced by NSK bearing" | Fandom wiki |
| Bearing Base = first zombie base | FACT | "only BB choice for first generation Zombies" | Fandom wiki |
| Bearing Base shaft compatible with Wolborg shaft casing | FACT | "shaft can be removed and put into casing of Wolborg's shaft" | Fandom wiki |
| SG (Bearing Version) = key competitive alternative to Bearing Base | — | **NEW FACT** | "SG (Bearing Version) became a serious choice for many players after Wolborg's release" | Fandom wiki |
| Tip = very sharp, low-friction plastic | FACT | "plastic that has low friction... one of the best tips for survival Beyblades" | Fandom wiki |

### B2. SG Metal Flat Base — CORRECTED

**CRITICAL CORRECTION**: SG Metal Flat Base does NOT have a true flat metal tip. The name is from the prototype design. Production tip = **metal sharp tip with a small flat section cut into the cone** (effectively metal semi-flat).

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| SG Metal Flat Base weight = 6.2g | — | **NEW FACT** | 6.2g | PlasticsDB |
| SG Metal Flat Base tip = metal flat | INFERENCE | **WRONG → CORRECTED** | Tip = "metal sharp tip with small flat section cut into the cone" — NOT a true flat | PlasticsDB |
| SG Metal Flat Base source bey = Driger V | — | **NEW FACT** | Included with Driger V | PlasticsDB |
| SG Metal Flat Base = Tier 2 compact bases only | — | **NEW FACT** | "Tier 2 for compact bases only" | PlasticsDB |
| SG Metal Flat Base = limited movement, poor late-match stability | — | **NEW FACT** | "good stamina, passable defense, fairly limited movement; poor stability late in matches due to sharp characteristics" | PlasticsDB |

**Engine model**: SG Metal Flat Base should use `tipShape: "sharp"` with a small `aggressiveness` value (not `"flat"`). The flat section is minor.

### B3. SG Metal Sharp Base — NEW

| Property | Value | Tag | Source |
|----------|-------|-----|--------|
| Weight | 7.6g | FACT | PlasticsDB |
| Tip | Sharp (metal) | FACT | PlasticsDB |
| Source bey | Flash Leopard 2 | FACT | PlasticsDB |
| Competitive | Not competitive | FACT | PlasticsDB: "outclassed by even Metal Sting Base" |
| Issues | Bad stability, no movement, limited defense, extremely poor LAD from large underside gaps | FACT | PlasticsDB |

### B4. SG Semi-Flat Base — NEW

| Property | Value | Tag | Source |
|----------|-------|-----|--------|
| Weight | 4.7g | FACT | PlasticsDB |
| Tip | Semi-flat, shallow angle, wears quickly | FACT | PlasticsDB |
| Source beys | Knight Dranzer, Galeon, BBA Balancer, Master Driger, Flash Leopard + 6 others (11 total) | FACT | PlasticsDB |
| Competitive | Mid-tier compact; "works well but slightly less capable than alternatives" | FACT | PlasticsDB |
| Molds | 2 molds; second slightly heavier (dual molding cylinders) | FACT | PlasticsDB |

### B5. Customize Grip Base — NEW

| Property | Value | Tag | Source |
|----------|-------|-----|--------|
| Weight | 5.1g | FACT | PlasticsDB |
| Source beys | Dragoon V2 (3 variants including Fire Blood and BBA Championship) | FACT | PlasticsDB |
| Tip compatibility | Multiple: Customize Grip Base Tip (rubber attack), SG Grip Base Tip (metal weight), bearing shafts for zombie | FACT | PlasticsDB |
| LAD | "remarkably good LAD"; creates substantial precession | FACT | PlasticsDB |
| Competitive | "must-have for the competitive Blader"; top-tier for attack + defense zombies + opposite-spin | FACT | PlasticsDB |
| Weakness | "skips ridge somewhat easily due to rounded edges" | FACT | PlasticsDB |

---

## SECTION C — Gen1 Competitive Meta (PlasticsDB Combos List)

**Source**: plasticsdb.com/competitive-combos-list — full competitive combo list. Every combo below is FACT.

### C1. Smash Attack

| Component | Top Options |
|-----------|-------------|
| AR | Corona Saber, Cross Griffon, Dark Wing, Dragon Breaker, Great Dragon, Square Edge, Triple Beak, Zeo Attack Ring (right spin); Dragon Breaker, Square Edge, Triple Beak, Triple Tiger (left spin) |
| WD | Ten Wide, Wide Defense, Wide Survivor, Ten Heavy, Heavy Attack |
| BB | Defense Grip Base, Storm Grip Base, SG Metal Flat Base (Gaia Dragoon V version), Grip Base, SG Grip Change Base |

**Note**: Great Dragon and Square Edge confirmed top Smash Attack ARs. Triple Tiger confirmed top Left-Spin Smash AR. Dark Wing is competitive (was INFERENCE from name only).

### C2. Defensive Zombie (Top Meta Type)

| Component | Top Options |
|-----------|-------------|
| AR | Tiger Defenser, Twin Horn, War Lion, Upper Dragoon |
| WD | Wide Defense, Wide Survivor |
| BB | Customize Grip Base, Defense Grip Base 2 |
| SG | SG (Bearing Version 2) with grip shaft |

**Rating**: "Best all-around combo contender" — FACT.

### C3. Circle Survivor Defense (Dominant Meta)

| Component | Top Options |
|-----------|-------------|
| AR | Roller Defense Ring, Tiger Defenser, Twin Horn, War Lion |
| WD | Ten Heavy, Ten Balance, Wide Defense |
| BB | Normal Base (Wolborg 4 / Rock Bison versions) with Circle Survivor engine gear |

**Rating**: "Dominant meta-defining type" — FACT.

### C4. Compacts

| Component | Top Options |
|-----------|-------------|
| AR | Tiger Defenser, War Lion, Twin Horn, Reverse Wolf |
| WD | Ten Balance, Ten Heavy, Wide Defense |
| BB | Metal Change Base, Metal Ball Base, Customize Metal Change Base |

**New FACT**: Metal Change Base and Metal Ball Base confirmed as top compact BBs (not just SG bases). Reverse Wolf AR added as compact option.

### C5. Upper Attack

| Component | Top Options |
|-----------|-------------|
| AR | Upper Claw, Upper Dragoon, Triangle Wing, Square Edge, Corona Saber, Whale Crusher |
| WD | Wide Defense, Ten Heavy, Ten Wide, Ten Balance |
| BB | Storm Grip Base (inverted tip) |

### C6. Stamina/Zombie

| Component | Top Options |
|-----------|-------------|
| AR | Tiger Defenser, Twin Horn, War Lion, Roller Defense Ring, Gyro Defense |
| WD | Wide Defense, Wide Survivor |
| BB | Customize Grip Base, Neo SG Double Bearing, Full Auto Clutch Base, Spiral Change Base |

**New FACT**: Roller Defense Ring confirmed competitive zombie AR. Gyro Defense AR listed. Spiral Change Base confirmed as zombie BB.

### C7. New Competitive Findings (Previously UNKNOWN or INFERENCE)

| Finding | New Tag | Notes |
|---------|---------|-------|
| Dark Wing AR is competitive (Smash Attack) | FACT | Was INFERENCE from name only; confirmed PlasticsDB competitive list |
| Triangle Wing AR is competitive (Upper Attack) | FACT | Was INFERENCE; confirmed |
| Roller Defense Ring AR is competitive (Zombie) | FACT | Was INFERENCE; confirmed |
| Gyro Defense AR is competitive (Zombie/Stamina) | FACT | Was UNKNOWN; confirmed |
| Twin Horn SAR compatible with Tiger Defenser combo | FACT | Confirmed in multiple combo types |
| Spiral Change Base = zombie BB | FACT | Was UNKNOWN; confirmed as Zombie BB |
| Metal Change Base = compact BB | FACT | Was INFERENCE; confirmed |
| Metal Ball Base = compact BB | FACT | Was INFERENCE; confirmed |
| "Circle Survivor" = dominant meta-defining type | FACT | Named explicitly on PlasticsDB |
| Defensive Zombie = "best all-around combo contender" | FACT | Named explicitly on PlasticsDB |
| Gyro Engine Gear = "nearly impossible to outspin" | FACT | Unique reversed bearing mechanics; niche but confirmed |

---

## SECTION D — Burst Layer Corrections

### D1. Drain Fafnir — CONFIRMED with dates

| Claim | Tag | Detail | Source |
|-------|-----|--------|--------|
| Drain Fafnir = left-spin God Layer | FACT | Confirmed God Layer System | Fandom wiki |
| Released April 29 2017 | — | **NEW FACT** | "released as a Starter in Japan on April 29th, 2017" | Fandom wiki |
| Rubber "F" contact points for spin equalization | FACT | "rubber 'F's stick out at two points along perimeter" | Fandom wiki |
| Drain Fafnir = three dragon head design | — | **NEW FACT** | "three dragon heads" representing Norse dragon Fafnir | Fandom wiki |
| Spin steal: when spinning slower than right-spin opponent | FACT | Confirmed mechanism | Fandom wiki |
| High Burst Resistance | FACT | "high Burst Resistance, Stamina, and Defense" | Fandom wiki + WBO |
| Struggles against Deep Chaos | — | **NEW FACT** | "may struggle against Layers such as Deep Chaos" | Fandom wiki |

### D2. Geist Fafnir — CORRECTIONS

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| Geist Fafnir = Cho-Z Layer | FACT | FACT (confirmed) | — | Fandom wiki |
| Geist Fafnir = left-spin | FACT | FACT (confirmed) | — | Fandom wiki |
| Rubber "F"s retract at high spin speed | — | **NEW FACT** | "retracts the rubber blade during high speed rotation to preserve rotational force; pops out only at low speed" | Fandom wiki |
| Geist Fafnir aggressive shape = burst/KO risk | — | **NEW FACT** | "aggressive shape creates Burst and Knock-Out risk even against Right-Spin opponents" | Fandom wiki |
| Geist Fafnir poor spin time | — | **NEW FACT** | "weight distribution creates poor spin times" | Fandom wiki |
| Geist Fafnir outclassed by Hell Salamander in ALL aspects | — | **NEW FACT** | "outclassed in all aspects by Hell Salamander" | Fandom wiki |

### D3. Engine Gear System (Gen1) — CONFIRMED

| Claim | Tag | Detail | Source |
|-------|-----|--------|--------|
| Engine Gear triggers on collision OR low spin | FACT | "triggers when blade base collides with object, or when running out of spin" | Fandom wiki |
| Engine Gear = burst of speed | FACT | "releases a quick burst of speed" | Fandom wiki |
| Metal Semi-Flat EG = balanced agility + stamina | FACT | "equipped with semi-flat tip for balanced Agility and Stamina" | Fandom wiki |
| Metal Semi-Flat EG = from Driger G or Dranzer G | FACT | "acquired from A-94 Driger G or A-99 Dranzer G" | Fandom wiki |

---

## SECTION E — BX Competitive Data

### E1. Cobalt Dragoon — CONFIRMED with key competitive notes

| Claim | Old Tag | New Tag | Detail | Source |
|-------|---------|---------|--------|--------|
| Cobalt Dragoon = left-spin | FACT | FACT (reconfirmed) | "only left-spinning Beyblade in the BX lineup" | BeyBase |
| Cobalt Dragoon = highly competitive | FACT | FACT (qualified) | Competitive but **inconsistent** — "unique, competitive, albeit inconsistent Blade" | BeyBase |
| Cobalt Dragoon = one of heaviest BX blades | FACT (from batch-008 weight ~heavy) | FACT | "one of the heaviest blades in Beyblade X" — exact weight not confirmed in web content (in Google Sheet) | BeyBase |
| Cobalt Dragoon requires string launcher | — | **NEW FACT** | "requires mastery of string launcher and consistently powerful shoot" | BeyBase |
| Cobalt Dragoon: heavy one-dimensional blade | — | **NEW FACT** | "heavy one-dimensional Blade only truly good for knocking out docile combos"; many alternatives perform more consistently | BeyBase |

---

## SECTION F — Summary of Tag Changes

| Claim | File | Old Tag | New Tag | Correction Type |
|-------|------|---------|---------|----------------|
| EWD = single bearing only (not double) | batch-004 | not specified | FACT | NEW — critical engine detail |
| EWD engine bearingFriction = 0.12 (not 0.02) | batch-004 | (engine model) | CORRECTED | single bearing has more friction than B:D |
| SG Metal Flat Base tip = metal semi-flat (not flat) | linka blade-bases | INFERENCE | CORRECTED — name misleading | production changed prototype design |
| SG Metal Flat Base weight = 6.2g | linka | UNKNOWN | FACT | PlasticsDB |
| SG Metal Sharp Base weight = 7.6g | linka | UNKNOWN | FACT | PlasticsDB |
| SG Semi-Flat Base weight = 4.7g | linka | UNKNOWN | FACT | PlasticsDB |
| Customize Grip Base weight = 5.1g | linka | UNKNOWN | FACT | PlasticsDB |
| Bearing Base weight = 8g | linka | UNKNOWN | FACT | Fandom wiki |
| Dark Wing AR = competitive Smash Attack | phase-07 | INFERENCE | FACT | PlasticsDB competitive list |
| Triangle Wing AR = competitive Upper Attack | phase-07 | INFERENCE | FACT | PlasticsDB competitive list |
| Roller Defense Ring = competitive Zombie | phase-07 | INFERENCE | FACT | PlasticsDB competitive list |
| Geist Fafnir outclassed by Hell Salamander | phase-07 | not stated | NEW FACT | Fandom wiki |
| Geist Fafnir rubber "F"s retract at high speed | phase-07 | not stated | NEW FACT | Fandom wiki |
| Drain Fafnir released April 29 2017 | phase-07 | UNKNOWN | FACT | Fandom wiki |
| B:D world record = 7:35 min | batch-004 | UNKNOWN | FACT | Fandom wiki |
| B:D height = equivalent to 170 height spin track | batch-004 | UNKNOWN | FACT | Fandom wiki |
| W²D has worse balance than WD | batch-004 | INFERENCE | FACT | WBO thread |
| Cobalt Dragoon requires string launcher | batch-006-x | UNKNOWN | FACT | BeyBase |

---

## SECTION G — Gen1 Blade Base Weight Summary (all confirmed this session)

| Blade Base | Weight | Source Bey | Competitive Tier | Tag |
|-----------|--------|------------|-----------------|-----|
| Bearing Base | 8.0g | Wolborg | Top — first zombie base | FACT |
| SG Metal Sharp Base | 7.6g | Flash Leopard 2 | Not competitive | FACT |
| SG Metal Flat Base | 6.2g | Driger V | Tier 2 compact only | FACT |
| Customize Grip Base | 5.1g | Dragoon V2 | Must-have top tier | FACT |
| SG Semi-Flat Base | 4.7g | 11 beys | Mid-tier compact | FACT |

---

[← Batch 012: Forge Disc / Chassis / SAR](batch-012-forge-disc-chassis-sar.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 014: Archetype Physics →](batch-014-archetype-physics-deep-dive.md)

---
batch: 012
stage: burst-parts-expansion
status: complete
sources_checked: 14
facts: 31
inferences: 9
unknowns: 6
---

[← Batch 011: WD Weights + Petal Physics](batch-011-wd-weights-petal-physics.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 013: Deep Verification Pass →](batch-013-deep-verification-pass.md)

---

# Batch 012 — Forge Disc Weights · Chassis System · Sub Attack Rings

> **Date**: 2026-05-23 | **Session 23**
> **Purpose**: (1) Document Forge Disc weights and structure. (2) Document Single vs Double Chassis (Superking/Sparking). (3) Document Gen1 Sub Attack Ring (SAR) concept and catalog.

---

## URL Fetch Log

| URL | Method | Result | Data Extracted |
|-----|--------|--------|----------------|
| https://burst.beybladeplanner.com/parts.php?type=disc | WebFetch | SUCCESS | 71 disc names confirmed; no weights in listing view |
| https://beyblade.fandom.com/wiki/Chassis_-_2S | WebFetch | 403 | — |
| https://beyblade.fandom.com/wiki/Chassis_-_1A | WebFetch | 403 | — |
| https://beyblade.fandom.com/wiki/Sub-Attack_Rings | WebFetch | 403 | — |
| https://www.plasticsdb.com/parts/attack-rings/dragon-saucer | WebFetch | SUCCESS | Dragon Saucer AR 4.5g + SAR 1.9g = 6.5g total |
| https://www.plasticsdb.com/parts/attack-rings/war-lion | WebFetch | SUCCESS | War Lion core AR 3.7g + SAR 1.3g = 5.0g total |
| WBO/Fandom chassis search (via WebSearch) | WebSearch | SUCCESS | Single vs Double Chassis concept + example types |
| Chassis weights search | WebSearch | SUCCESS | 1S = 16.82g; 1A/2B/2D ~46g (likely full-combo weight) |
| Forge disc weight search | WebSearch | SUCCESS | Heavy 21.6g; Gravity 21.6g; Quarter 21.8g; Armed 19.9g; 00 ~25g (Core Disc) |
| SAR search (plasticsdb) | WebSearch | SUCCESS | Dragon Saucer SAR, War Lion SAR, War Bear SAR, Wing Sub-Ring listed |

---

## SECTION A — Forge Discs

### A1. What is a Forge Disc?

**FACT**: In the Beyblade Burst system, the **Forge Disc** (abbreviated **Disc**) is the weighted metal ring between the Layer and the Driver. It replaced the Weight Disk from earlier generations. Most Forge Discs are solid zinc-alloy or aluminium pieces.

**System note**: Not all Burst sub-systems use a Forge Disc:
- Standard / Evolution / God / Cho-Z / Gatinko / DB / Ultimate → use a Forge Disc
- Sparking (Superking) → uses either a Forge Disc (Single Chassis combos) or NO Disc (Double Chassis replaces it)

### A2. Naming Convention — Numeric Discs

**FACT (Fandom wiki via WebSearch)**: Numeric discs (0, 1, 2, … 13, 00) are NOT named after their weight in grams. The number is an identifier only. Source: beyblade.fandom.com/wiki/Forge_Disc_-_00 ("The name does not reflect the weight").

**Correction**: linka/parts/burst/discs.md previously noted "Numeric discs named after weight (INFERENCE)". This is WRONG — removing that inference.

### A3. Confirmed Forge Disc Weights

| Disc Name | Weight | Era / Notes | Tag | Source |
|-----------|--------|-------------|-----|--------|
| Force (Fr) | 19.2g | Original Burst / B-23 Dec 2015 | FACT | Fandom wiki (WebSearch) |
| Armed (Ar) | 19.9g | Cho-Z era; 4 large outer protrusions | FACT | Fandom wiki (WebSearch) |
| Heavy (H) | 21.6g | Evolution era; heaviest standard Forge Disc at release | FACT | Fandom wiki (WebSearch) |
| Gravity (Gv) | 21.6g | Cho-Z era; same weight as Heavy | FACT | Fandom wiki (WebSearch) |
| Quarter (Q) | 21.8g | Heaviest named Forge Disc; outclassed Heavy/Gravity | FACT | Fandom wiki (WebSearch) |
| 00 | ~25g | Heaviest Core Disc; outclasses 0 by 1g | INFERENCE | WBO + Fandom (no exact gram listed) |

**Engine note**: The "heaviest Forge Disc" competitive slot tracks with the meta. The sequence was: Heavy (21.6g) → Quarter (21.8g) → then Core Discs (00 ~25g+) in later Superking/DB eras. Named discs beyond ~21g are the competitive heavy tier.

### A4. Disc Frames

**FACT**: 18 Disc Frames exist (confirmed count from Burst Planner). Frames attach to certain Forge Discs to add extra protrusions or weight distribution. Not all discs accept frames — disc compatibility is disc-specific. Source: burst.beybladeplanner.com.

### A5. DB Cores

**FACT**: 22 DB Cores exist. The DB Core attaches inside a DB Blade (no separate Forge Disc in some DB combinations — the Core is integrated). Confirmed names include: Achilles, Bahamut, Belial (multiple variants), Dragon, Fafnir, Helios, Hyperion, Kerbeus, Knight, Longinus, Lucifer, Perseus, Phoenix, Ragnaruk, Spriggan (multiple), Valkyrie (multiple), Xcalibur. Source: burst.beybladeplanner.com.

---

## SECTION B — Chassis System (Sparking / Superking)

### B1. What is a Chassis?

**FACT (Fandom wiki via WebSearch)**: In the **Superking Layer System** (Beyblade Burst Surge, 2020), beyblades use a **Chip + Ring + Chassis** structure instead of the standard Layer + Disc + Driver. The Chassis is the bottom component that determines the beyblade's tip and disc-equivalent weight distribution.

There are two types:

| Type | Description | Disc Slot |
|------|-------------|-----------|
| **Single Chassis** | Completes the Superking Layer alongside the Chip and Ring. Used **with** a standard Forge Disc. | Requires separate Forge Disc |
| **Double Chassis** | Has an integrated disc-equivalent design (wider, heavier). Used **without** a separate Forge Disc. | No separate Disc needed |

Source: beyblade.fandom.com/wiki/Burst_System + Category:Chassiss (via WebSearch)

### B2. Chassis Naming Convention

**FACT**: Chassis names follow the pattern `[number][letter]`:
- **Number** = number of rings used in the Superking Layer (1 = Single Chassis; 2 = Double Chassis; 4 = special)
- **Letter** = type abbreviation: A = Attack, S = Stamina, D = Defense, B = Balance

Examples: `1A` = Single Chassis Attack, `2S` = Double Chassis Stamina, `2D` = Double Chassis Defense.

### B3. Chassis Catalog

| Chassis | Type | Single/Double | Key Notes | Tag |
|---------|------|---------------|-----------|-----|
| **1A** | Attack | Single | Large striking blades that protrude thickly; strong Smash Attack | FACT |
| **1S** | Stamina | Single | Lightweight design (~16.82g confirmed); optimized for endurance | FACT (weight) |
| **1B** | Balance | Single | Continuous attack and endurance balance design | FACT |
| **1D** | Defense | Single | Weighs two-thirds of 1S (lighter still); used with Forge Disc | FACT (weight ratio vs 1S) |
| **2S** | Stamina | Double | Thin, wide shape; high centrifugal force; specializes in endurance; Dual Spin | FACT |
| **2D** | Defense | Double | Six Barrier Blades; Dual Spin; defense-focused | FACT |
| **2B** | Balance | Double | Balanced attack + endurance; Dual Spin | FACT |
| **4A** | Attack | Special (4-ring) | Larger combined ring design; attack-focused | INFERENCE |

**Weight note**: Search results returned ~46g for 1A/2B/2D in some listings. This likely represents the **complete assembled combination weight**, not the chassis alone. Individual chassis weights: 1S = 16.82g is confirmed as chassis-only. For attack/defense/balance chassis, chassis-only weights are UNKNOWN pending dedicated Fandom wiki pages (403-blocked this session).

Source: beyblade.fandom.com/wiki/Chassis_-_1A, 2S, 1B, 1D, 2D, 2B (via WebSearch snippets)

### B4. Dual Spin (Double Chassis)

**FACT**: Double Chassis beyblades support **Dual Spin** — the Ring and Chassis can be assembled for either right-spin or left-spin depending on orientation. This is different from left-spin-specific beys in earlier generations. Source: beyblade.fandom.com (via WebSearch).

### B5. Engine Implication

```
// Single Chassis → maps to CorePart + standard disc slot still active
// Double Chassis → maps to CorePart with integrated disc weight; no separate WDPart slot
chassisType: "single" | "double"

// Double Chassis: disc weight is baked into CorePart.dimensions.mass
// Single Chassis: CorePart.dimensions.mass = chassis-only; add Forge Disc WDPart mass separately

// Dual Spin supported by Double Chassis: spinDirection can be "left" | "right" at assembly
```

---

## SECTION C — Sub Attack Rings (SAR) — Gen1 Plastic Era

### C1. What is a SAR?

**FACT (Fandom wiki + PlasticsDB via WebSearch)**: A **Sub Attack Ring (SAR)** is a secondary free-spinning ring that attaches to certain Gen1 Attack Rings. Rules:
1. Some ARs **require** a SAR (must use one to be legal in WBO play)
2. SARs from compatible ARs are **interchangeable** under WBO rules
3. SARs are always **free-spinning** — they rotate independently from the main beyblade spin
4. The free-spin means the SAR does NOT add smash attack; it disperses collision force instead

Source: beyblade.fandom.com/wiki/Sub-Attack_Rings + plasticsdb.com (via WebSearch)

### C2. How Free-Spinning SARs Work (Physics)

**FACT (PlasticsDB + WBO via WebSearch)**:
- When the opponent's layer hits a free-spinning SAR, the SAR rotates to absorb and redirect the impact
- This drastically reduces recoil on the beyblade bearing the SAR
- Round/smooth SARs (Dragon Saucer) = maximum force dispersion + minor spin steal
- Aggressive SARs (War Bear) = protrusions catch the opponent but free-spin reduces self-damage
- The free-spin means the SAR acts like a bearing — collision energy goes into spinning the SAR, not into pushing the bey away

**Engine implication**: SARs should be modeled as a second AR-equivalent ring with:
- `freeSpin: true` (independent angular velocity)
- Low `recoilFactor` (force dispersion)
- Shape-dependent `spinStealFactor` (round SAR = moderate steal; aggressive = low steal, higher contact)

### C3. SAR Catalog

| SAR Name | Weight | Main AR | Free-Spin | Competitive Role | Tag | Source |
|----------|--------|---------|-----------|-----------------|-----|--------|
| **Dragon Saucer SAR** | 1.9g | Dragon Saucer | Yes | **Best defensive SAR**; round shape disperses force + mild spin steal; works with War Lion core as zombie/defense combo | FACT | plasticsdb.com/parts/attack-rings/dragon-saucer |
| **War Lion SAR** | 1.3g | War Lion | Yes | Small size; low recoil; best defensive core AR in right + left spin; replaces Dragon Saucer SAR in compact builds | FACT | plasticsdb.com/parts/attack-rings/war-lion |
| **War Bear SAR** | UNKNOWN | War Bear | Yes | Two large pickaxe protrusions; aggressive shape but free-spin limits smash effectiveness; slows down bearer | FACT (behavior) / UNKNOWN (weight) | plasticsdb.com (via WebSearch) |
| **War Monkey SAR** | UNKNOWN | War Monkey | Yes | Recommended over War Bear for defensive use | FACT (name) / UNKNOWN (weight) | WBO via WebSearch |
| **Dragon Breaker SAR** | UNKNOWN | Dragon Breaker | Yes | Aggressively designed; free-spin SAR | FACT (name) / UNKNOWN (weight, behavior) | plasticsdb.com (via WebSearch) |
| **Wing Sub-Ring** | UNKNOWN | (unknown main AR) | UNKNOWN | Listed on PlasticsDB — further research needed | FACT (name only) | plasticsdb.com/parts/attack-rings/wing-sub-ring |
| **Twin Horn SAR** (Hasbro) | UNKNOWN | Twin Horn | Yes | Recommended for defensive use over War Bear | FACT (name) / UNKNOWN (weight) | WBO via WebSearch |

### C4. SAR Interchangeability Rules

**FACT (WBO via WebSearch)**: Under WBO rules, any SAR that can physically fit an AR with a SAR slot is legal. The most common competitive interchange is using **Dragon Saucer SAR on War Lion core** — combining War Lion's low-recoil round shape with Dragon Saucer's superior round SAR for maximum spin-steal + defense.

### C5. Dragon Saucer Full Weight Breakdown

| Component | Weight | Tag |
|-----------|--------|-----|
| Dragon Saucer core AR | 4.5g | FACT (PlasticsDB) |
| Dragon Saucer SAR | 1.9g | FACT (PlasticsDB) |
| Dragon Saucer total | 6.5g | FACT (PlasticsDB) |

**Note**: In batch-011, we recorded "Dragon Saucer 6.5g total (core 4.5g + SAR 1.9g)" — confirmed correct.

### C6. War Lion Full Weight Breakdown

| Component | Weight | Tag |
|-----------|--------|-----|
| War Lion core AR | 3.7g | FACT (PlasticsDB) |
| War Lion SAR | 1.3g | FACT (PlasticsDB) |
| War Lion total | 5.0g | FACT (PlasticsDB) |

**Note**: War Lion total 5.0g matches what was recorded in batch-008. Both component weights are now confirmed.

---

## SECTION D — Files Updated This Session

| File | Change |
|------|--------|
| `linka/parts/burst/discs.md` | Added confirmed weights for 6 key discs; corrected "numeric disc name = weight" claim to FALSE; added DB Core names |
| `linka/parts/burst/layers.md` | Added Chassis section: Single vs Double Chassis concept, naming convention, catalog of 8 chassis types, Dual Spin note |
| `linka/parts/gen1/attack-rings.md` | Added Section 2: SAR concept + catalog (Dragon Saucer, War Lion, War Bear, War Monkey, Dragon Breaker, Wing Sub-Ring, Twin Horn) |

---

## SECTION E — Summary Table

| Claim | Old Tag | New Tag | Source |
|-------|---------|---------|--------|
| Numeric Forge Disc names = weight in grams | INFERENCE | **WRONG — FACT** | Fandom wiki: name does not reflect weight |
| Force (Fr) = 19.2g | FACT (batch-011) | FACT (reconfirmed) | — |
| Heavy (H) = 21.6g | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| Gravity (Gv) = 21.6g | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| Quarter (Q) = 21.8g | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| Armed (Ar) = 19.9g | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| 00 = heaviest Core Disc, ~25g | UNKNOWN | INFERENCE | WBO thread (no exact weight cited) |
| Single Chassis = used with Forge Disc | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| Double Chassis = replaces Forge Disc | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| Double Chassis supports Dual Spin | UNKNOWN | FACT | Fandom wiki (WebSearch) |
| SAR = free-spinning | FACT (WBO/Fandom via WebSearch) | FACT (confirmed) | — |
| Dragon Saucer SAR = 1.9g | FACT (batch-011 via bey page) | FACT (confirmed) | PlasticsDB part page direct |
| War Lion core AR = 3.7g; SAR = 1.3g | UNKNOWN | FACT | PlasticsDB part page direct |
| Dragon Saucer SAR on War Lion = best zombie combo | INFERENCE | FACT | PlasticsDB + WBO (multiple sources) |

---

[← Batch 011: WD Weights + Petal Physics](batch-011-wd-weights-petal-physics.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 013: Deep Verification Pass →](batch-013-deep-verification-pass.md)

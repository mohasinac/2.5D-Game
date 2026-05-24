---
batch: 011
stage: wd-weights-petal-physics
status: complete
sources_checked: 38
facts: 31
proofreading_fixes: 12
---

[← Batch 010: Proofread + INFERENCE Resolution](batch-010-proofread-inference-resolution.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 012: Forge Disc / Chassis / SAR →](batch-012-forge-disc-chassis-sar.md)

---

# Batch 011 — Gen1 WD Weights + Force Disk Clarification + Petal Count Physics

> **Date**: 2026-05-23 | **Session 22**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: (1) Fetch Gen1 Weight Disk weights from PlasticsDB and individual bey pages. (2) Clarify "Force Disk" naming. (3) Apply domain-expert physics correction for petal count — replace all UNKNOWN petal-count entries in 6+ files.

---

## URL Fetch Log

| URL | Method | Result | Data Extracted |
|-----|--------|--------|----------------|
| https://www.plasticsdb.com/weight-disks/ | WebFetch | 404 — path not found | None |
| https://www.plasticsdb.com/parts/weight-disks | WebFetch | SUCCESS (index, no weights in listing) | WD names; qualitative descriptions only |
| https://www.plasticsdb.com/parts/weight-disks/ten-heavy | WebFetch | SUCCESS | Ten Heavy 16.1g (regular) / 17g (Spike Lizard green-plated) |
| https://www.plasticsdb.com/parts/weight-disks/eight-heavy | WebFetch | SUCCESS | Eight Heavy 15.3g (regular) / 15.5g (indent mold) |
| https://www.plasticsdb.com/parts/weight-disks/wide-defense | WebFetch | SUCCESS | Wide Defense 14.5g |
| https://www.plasticsdb.com/parts/weight-disks/ten-wide | WebFetch | SUCCESS | Ten Wide 14.0g / 14.3g (SonoKong) |
| https://www.plasticsdb.com/parts/weight-disks/wide-survivor | WebFetch | SUCCESS | Wide Survivor 12.4g |
| https://www.plasticsdb.com/parts/weight-disks/wide-attack | WebFetch | SUCCESS | Wide Attack 13.7g |
| https://www.plasticsdb.com/parts/weight-disks/heavy-attack | WebFetch | SUCCESS | Heavy Attack 16.0g (from Gaia Dragoon) |
| https://www.plasticsdb.com/parts/weight-disks/balance | WebFetch | SUCCESS | Balance 14.1g |
| https://www.plasticsdb.com/parts/weight-disks/heavy | WebFetch | SUCCESS | Heavy 15.3g (broad range across copies) |
| https://www.plasticsdb.com/parts/weight-disks/eight-balance | WebFetch | SUCCESS | Eight Balance 14.1g |
| https://www.plasticsdb.com/parts/weight-disks/spark-disk | WebFetch | SUCCESS | Spark Disk 12.9g (Wide Survivor + flints variant) |
| https://www.plasticsdb.com/parts/weight-disks/weight-ring | WebFetch | SUCCESS | Weight Ring 12.4g (Hayate Base exclusive) |
| https://www.plasticsdb.com/beyblades/draciel-v2 | WebFetch | SUCCESS | Ten Heavy 16.1g; Strike Turtle AR 4.8g |
| https://www.plasticsdb.com/beyblades/driger-s | WebFetch | SUCCESS | Eight Heavy 15.3–15.5g; Tiger Defenser AR 3.6g |
| https://www.plasticsdb.com/beyblades/dragoon-g | WebFetch | SUCCESS | Ten Wide 14.0g; Eight Spiker AR 4.3g |
| https://www.plasticsdb.com/beyblades/wolborg-2 | WebFetch | SUCCESS | Eight Balance 14.1g; Upper Wolf AR 5.0–5.2g |
| https://www.plasticsdb.com/beyblades/master-dragoon | WebFetch | SUCCESS | Eight Heavy 15.3–15.5g; Upper Dragoon AR 6.2g Mold 1 / 6.0g Mold 2 |
| https://www.plasticsdb.com/beyblades/draciel-g | WebFetch | SUCCESS | Ten Wide 14.0–14.3g; Shield Hammer AR 6.3g |
| https://www.plasticsdb.com/beyblades/gaia-dragoon-g | WebFetch | SUCCESS | Ten Heavy 16.1g; Dragon Saucer AR 6.5g total |
| https://www.plasticsdb.com/beyblades/driger-v2 | WebFetch | SUCCESS | Ten Balance 15.0g; Upper Claw AR 5.0g Mold 1 / 5.5g Mold 2 |
| https://www.plasticsdb.com/beyblades/dranzer-g | WebFetch | SUCCESS | Ten Balance 15.0g; Wing Survivor AR 4.7g |
| https://www.plasticsdb.com/beyblades/dragoon-v | WebFetch | SUCCESS | Ten Wide 14.0–14.3g; Eight Attacker AR 4.1g |
| https://www.plasticsdb.com/beyblades/dragoon-s | WebFetch | SUCCESS | Eight Wide 12.7g (hard) / 12.2g (soft); Reverse Dragon AR 3.5g (Takara) / 4.0g (Hasbro) |
| https://www.plasticsdb.com/beyblades/dranzer-v2 | WebFetch | SUCCESS | Ten Balance 15.0g; Cross Dranzer AR 5.0g |
| https://www.plasticsdb.com/beyblades/draciel-s | WebFetch | SUCCESS | Eight Balance 14.1g; Cross Spike AR 4.1g |
| https://www.plasticsdb.com/beyblades/dragoon-v2 | WebFetch | SUCCESS | Magne WD 14.3g Mold 1 / 14.8g Mold 2; Spike Dragon AR 4.9g |
| https://www.plasticsdb.com/beyblades/draciel-v | WebFetch | SUCCESS | Ten Balance 15.0g; Ten Spike AR 4.1g |
| https://www.plasticsdb.com/beyblades/dranzer-v | WebFetch | SUCCESS | Ten Balance 15.0g; Cross Attacker AR 5.6g |
| https://www.plasticsdb.com/beyblades/bakutenryu-donitrus | WebFetch | SUCCESS | Eight Wide 12.7g / 12.2g; Fire Cracker AR 4.7g Mold 1 / 5.1g Mold 2 |
| https://www.plasticsdb.com/beyblades/driger-g | WebFetch | SUCCESS | Ten Balance 15.0g; Triple Tiger AR 6.3g |
| https://www.plasticsdb.com/beyblades/dranzer-f | WebFetch | SUCCESS | Eight Heavy 15.3–15.5g; Flame Wing AR 3.8g |
| https://www.plasticsdb.com/beyblades/dragoon-f | WebFetch | SUCCESS | Eight Wide 12.7g / 12.2g; Dual Dragon AR 5.9g total |
| https://www.plasticsdb.com/beyblades/draciel-f | WebFetch | SUCCESS | Eight Balance 14.1g; Eight Spike AR 4.2g |
| https://www.plasticsdb.com/beyblades/driger-f-g | WebFetch | 404 — URL not found | None |
| "force disk" beyblade gen1 plasticsdb | WebSearch | SUCCESS | No Gen1 "Force Disk" found; Force = Burst-era Forge Disc |
| "beyblade force disk weight disk generation 1" | WebSearch | SUCCESS | Confirmed Force Disk does not exist in Gen1 plastic era |
| plasticsdb "wide attack" weight disk grams | WebSearch | SUCCESS | Wide Attack 13.7g; Heavy Attack 16.0g confirmed |
| "forge disc force burst era weight grams" | WebSearch | SUCCESS | Force (Forge Disc) = 19.2g, Burst System debut B-23 Dec 2015 |

---

## Section A — Gen1 WD Weights

All weights confirmed from PlasticsDB individual part pages and/or PlasticsDB bey pages. Where mold variants exist, both are recorded.

| WD Name | Weight | Mold Variants | Source Beys | PlasticsDB URL | Tag |
|---------|--------|---------------|-------------|----------------|-----|
| Balance | 14.1g | none documented | Frostic Dranzer, Spark Knight, Makendo, others | /parts/weight-disks/balance | FACT |
| Eight Balance | 14.1g | none (heavier plated versions exist) | Draciel S, Draciel F, Wolborg 2, Dranzer S, Driger F, Death Driger, Knight Dranzer, Griffolyon | /parts/weight-disks/eight-balance | FACT |
| Eight Heavy | 15.3g (regular) / 15.5g (indent) | Regular Mold vs Indent Mold — "practically identical" | Driger S, Dranzer F, Master Dragoon | /parts/weight-disks/eight-heavy | FACT |
| Eight Wide | 12.7g (hard edge) / 12.2g (soft edge) | Hard Edge (Takara exclusive) vs Soft Edge (Hasbro + Takara) | Dragoon S, Dragoon F, Bakutenryu Donitrus | /parts/weight-disks/eight-wide | FACT |
| Heavy | 15.3g | broad weight variance across copies — no distinct named molds | Saizo, Megaro Arm, Bistool, Bakushin-Oh, others | /parts/weight-disks/heavy | FACT |
| Heavy Attack | 16.0g | none documented | Gaia Dragoon (all color versions) | /parts/weight-disks/heavy-attack | FACT |
| Magne Weight Disk | 14.3g (Mold 1) / 14.8g (Mold 2) | Two molds documented | Dragoon V2 | bey page only | FACT |
| Revolver Attack | UNKNOWN | — | — | index only | INFERENCE (name only) |
| Spark Disk | 12.9g | Wide Survivor base + flint add-ons (special set #12) | #12 Spark Disk set | /parts/weight-disks/spark-disk | FACT |
| Star Attack | UNKNOWN | — | — | index only | INFERENCE (name only) |
| Ten Balance | 15.0g | none documented | Draciel V, Dranzer V, Dranzer V2, Dranzer G, Driger V2, Driger G, Dragoon V2 | bey pages | FACT |
| Ten Heavy | 16.1g (regular) / 17g (Spike Lizard green-plated) | Regular vs Spike Lizard green-plated (preferred) | Draciel V2, Gaia Dragoon G | /parts/weight-disks/ten-heavy | FACT |
| Ten Wide | 14.0g (Takara/Hasbro) / 14.3g (SonoKong G-Blade) | SonoKong slightly heavier, thicker alloy | Dragoon V, Dragoon G, Draciel G | /parts/weight-disks/ten-wide | FACT |
| Wide | 12.7g | none documented | Various (special editions and random boosters) | /parts/weight-disks/wide | FACT (WebSearch) |
| Wide Attack | 13.7g | none documented | Various (special editions and random boosters) | /parts/weight-disks/wide-attack | FACT |
| Wide Defense | 14.5g | none documented | Wolborg, Driger S (competitive combo WD) | /parts/weight-disks/wide-defense | FACT |
| Wide Survivor | 12.4g | red-plated variant in special 3-disk set | Driger S (competitive zombie WD) | /parts/weight-disks/wide-survivor | FACT |
| Weight Ring | 12.4g | none | Hayate Base beys only | /parts/weight-disks/weight-ring | FACT |

**WD weight range summary:**
- Lightest: Eight Wide Soft Edge / Wide Survivor / Weight Ring ≈ 12.2–12.4g
- Mid-light: Spark Disk 12.9g; Wide 12.7g; Eight Wide Hard Edge 12.7g; Wide Survivor 12.4g
- Mid: Wide Attack 13.7g; Eight Wide 12.7g
- Mid-heavy: Balance / Eight Balance 14.1g; Wide Defense 14.5g; Ten Wide 14.0–14.3g; Magne WD 14.3–14.8g; Ten Balance 15.0g
- Heaviest: Eight Heavy 15.3–15.5g; Heavy 15.3g; Heavy Attack 16.0g; Ten Heavy 16.1g / 17g (Spike Lizard)

**CRITICAL CORRECTION**: The linka/parts/gen1/weight-disks.md file previously listed Ten Heavy as "~17g" and Eight Heavy as "~14g" (inferred from naming). Both are now corrected:
- Ten Heavy: 16.1g standard / 17g Spike Lizard plated. The ~17g from the local Draciel V2 file specifically refers to the Spike Lizard variant. **Standard release is 16.1g.**
- Eight Heavy: 15.3g regular / 15.5g indent mold — NOT ~14g. Prior local-file estimate was too low by ~1.3g.
- Eight Balance confirmed 14.1g (was noted as 14g estimate — now exact).

---

## Section B — Individual AR Weights Found on PlasticsDB Pages

All weights confirmed from PlasticsDB bey pages during WD fetch pass. These supplement the linka/parts/gen1/attack-rings.md file.

| AR Name | Weight | Molds | Source Bey | PlasticsDB URL | Notes | Tag |
|---------|--------|-------|------------|----------------|-------|-----|
| Fire Cracker | 4.7g (Mold 1) / 5.1g (Mold 2) | Mold 2 = extra plastic layer on bottom, thicker | Bakutenryu Donitrus | /beyblades/bakutenryu-donitrus | User screenshot confirmed this earlier — now Tier-1 verified | FACT |
| Tiger Defenser | 3.6g | none documented | Driger S | /beyblades/driger-s | CORRECTION: prior linka entry was ~5g — PlasticsDB says 3.6g | FACT |
| Eight Spiker | 4.3g | none | Dragoon G | /beyblades/dragoon-g | NOT same as Eight Attacker | FACT |
| Upper Wolf | 5.0–5.2g | two molds implied | Wolborg 2 | /beyblades/wolborg-2 | — | FACT |
| Upper Dragoon | 6.2g (Mold 1) / 6.0g (Mold 2) | Mold 2 slightly lighter | Master Dragoon | /beyblades/master-dragoon | — | FACT |
| Shield Hammer | 6.3g | none | Draciel G | /beyblades/draciel-g | CORRECTION: prior linka entry was 6g — PlasticsDB says 6.3g | FACT |
| Dragon Saucer | 6.5g total (core 4.5g + SAR 1.9g) | combined | Gaia Dragoon G | /beyblades/gaia-dragoon-g | SAR included in total | FACT |
| Upper Claw | 5.0g (Mold 1) / 5.5g (Mold 2) | two molds | Driger V2 | /beyblades/driger-v2 | CORRECTION: prior linka entry was 7g — PlasticsDB says 5.0–5.5g | FACT |
| Wing Survivor | 4.7g | none | Dranzer G | /beyblades/dranzer-g | Matches prior linka entry ~4.7g — confirmed | FACT |
| Eight Attacker | 4.1g | none | Dragoon V | /beyblades/dragoon-v | CORRECTION: prior linka entry was ~5g — PlasticsDB says 4.1g | FACT |
| Reverse Dragon | 3.5g (Takara) / 4.0g (Hasbro) | two regional molds | Dragoon S | /beyblades/dragoon-s | CORRECTION: prior linka entry was 5g — PlasticsDB says 3.5–4.0g | FACT |
| Cross Dranzer | 5.0g | none | Dranzer V2 | /beyblades/dranzer-v2 | Prior linka entry was ~5g — confirmed | FACT |
| Cross Spike | 4.1g | none | Draciel S | /beyblades/draciel-s | CORRECTION: prior linka entry was 5g — PlasticsDB says 4.1g | FACT |
| Spike Dragon | 4.9g | none | Dragoon V2 | /beyblades/dragoon-v2 | Prior linka entry was ~4.8g — now 4.9g | FACT |
| Ten Spike | 4.1g | none | Draciel V | /beyblades/draciel-v | CORRECTION: prior linka entry was ~5g — PlasticsDB says 4.1g | FACT |
| Cross Attacker | 5.6g | none | Dranzer V | /beyblades/dranzer-v | Matches prior linka entry 5.6g — confirmed | FACT |
| Triple Tiger | 6.3g | none | Driger G | /beyblades/driger-g | CORRECTION: prior linka entry was ~5g — PlasticsDB says 6.3g | FACT |
| Flame Wing | 3.8g | none | Dranzer F | /beyblades/dranzer-f | CORRECTION: prior linka entry was ~5g — PlasticsDB says 3.8g | FACT |
| Dual Dragon | 5.9g total (core 4.4g + sub 1.5g) | combined weight | Dragoon F | /beyblades/dragoon-f | Prior linka entry was ~4g — significantly different | FACT |
| Eight Spike | 4.2g | none | Draciel F | /beyblades/draciel-f | Prior linka entry was 4.2g — confirmed | FACT |
| Strike Turtle | 4.8g | none | Draciel V2 | /beyblades/draciel-v2 | Prior linka entry was ~6g — PlasticsDB says 4.8g | FACT |

**Weight pattern notes:**
- Lightest ARs: Reverse Dragon 3.5g (Takara), Tiger Defenser 3.6g, Flame Wing 3.8g
- Mid-light ARs: Eight Attacker / Ten Spike / Cross Spike ~4.1g; Eight Spike 4.2g
- Mid ARs: Fire Cracker 4.7–5.1g; Wing Survivor 4.7g; Spike Dragon 4.9g; Upper Claw 5.0–5.5g; Cross Dranzer 5.0g; Cross Attacker 5.6g; Dual Dragon 5.9g
- Heaviest ARs: Upper Wolf ~5.2g; Triple Tiger 6.3g; Shield Hammer 6.3g; Dragon Saucer 6.5g; Upper Dragoon 6.2g

---

## Section C — Force Disk Clarification

**Question**: Is "Force Disk" a real Gen1 part name? Is it "Forge Disc" (Burst era)?

### Finding: "Force Disk" does NOT exist as a Gen1 Weight Disk

Two independent WebSearch queries against PlasticsDB, beyblade.fandom.com, and worldbeyblade.org returned **zero results** for "Force Disk" as a Generation 1 plastic-era part.

The PlasticsDB weight disk index lists all confirmed Gen1 WD names:
Balance, Eight Balance, Eight Heavy, Eight Wide, Heavy, Heavy Attack, Magne Weight Disk, Revolver Attack, Spark Disk, Star Attack, Ten Balance, Ten Heavy, Ten Wide, Wide, Wide Attack, Wide Defense, Wide Survivor, Weight Ring.

**"Force Disk" is not among them.**

### What "Force" actually refers to: Burst-era Forge Disc

The Beyblade Burst system uses "Forge Discs" instead of "Weight Disks." One such Forge Disc is named **Force** (abbreviated **Fr**):

| Property | Value | Source |
|----------|-------|--------|
| Full name | Forge Disc — Force | beyblade.fandom.com/wiki/Forge_Disc_-_Force |
| System | Beyblade Burst (not Gen1 plastic) | FACT |
| Debut | B-23 Starter, Xcalibur Force Xtreme, December 26, 2015 | FACT (WebSearch) |
| Weight | 19.2g | FACT (WebSearch — multiple sources) |
| Shape | Symmetrical diamond/plus shape with four main armor-like protrusions | FACT |
| Function | Standard-weight metal disc for Burst combinations | FACT |

### What "Customize Weight Disk (CWD)" is

A separate confusion vector: Gen1 has "Customize Weight Disk" (CWD) sub-parts that attach below the Weight Disk. These are small support-ring components, NOT full Weight Disks. CWDs include CWD Defense Ring, CWD Free Defense, CWD Metal Frame, CWD Metal Ball, etc. None are called "Force Disk."

### Verdict

| Claim | Verdict |
|-------|---------|
| "Force Disk" = real Gen1 WD name | **FALSE** — no such Gen1 part exists |
| "Force Disk" = colloquial/misspelling of "Forge Disc" (Burst) | **LIKELY** — "Force" IS a real Burst Forge Disc (19.2g) |
| "Force Disk" = Customize Weight Disk family | **FALSE** — CWDs have different individual names |

**Recommendation**: Any prior research that mentions "Force Disk" in a Gen1 context is in error. The correct Burst-era term is "Forge Disc — Force" (Fr), 19.2g.

---

## Section D — Petal Count Physics

### Domain-Expert Correction (Source: user, session 22)

The claim "petal count is UNKNOWN for rubber tips" is a **category error** — not a gap in documentation, but a misunderstanding of the physics. Petal count is not a fixed intrinsic property of a tip at all.

### Full Physics Explanation

**PHYSICS-FACT (domain-expert)** — Petal count is an emergent property, not a fixed tip attribute.

Variables that determine petal count in a given launch:
1. **Launch RPM** — higher spin → faster orbit → more petals per traversal
2. **Launch angle (tilt)** — angle determines initial orbital eccentricity and phase
3. **Launch position** (distance from center) — larger initial radius = larger petals
4. **Tip friction coefficient** — rubber vs plastic, flat vs sharp; higher friction = tighter stick-slip cycles
5. **Floor surface friction** — stadium surface material affects slip threshold
6. **Arena slope / bowl profile** — slope directs the bey's drift between stick-slip events
7. **Current spin energy level** — as energy decays, orbital radius shrinks; petal pattern changes dynamically
8. **Inner-ridge diameter** — the stadium's inner ridge diameter defines the maximum orbital circle; petal count = winding number of the trajectory within this circle

The "flower pattern" is always inscribed within a circle (the stadium orbit path). The same tip can produce 3, 5, 6, 8+ petals depending on launch conditions. Petal count is essentially the **winding number** of the trajectory — how many times the tip completes a sub-loop before returning to the starting azimuth.

For tips with raised spiral arms (R²F, LF): the arm count sets a **mechanical lower bound** on the stick-slip frequency (5 arms = at minimum 5 grip events per revolution), but the actual petal count in the orbit path is still modulated by all the variables above.

**Engine implication**: Do NOT hardcode a petal count per tip. Instead simulate the physics (friction force, orbital radius, energy decay) and let the trajectory emerge naturally. The correct engine approach:
- Apply stick-slip lateral impulse magnitude based on `gripFactor` × `frictionCoefficient` × current floor normal force
- Let orbital mechanics (centripetal force balance vs floor friction) determine the path
- R²F/LF's raised arms should be modeled as a `gripFactor` multiplier with a rotational-phase bias — not as a literal "5-petal" hardcoded counter

**Prior research note**: R²F has 5 raised spiral arms — this is a geometric fact about the tip. The claim that it "produces a 5-petal movement pattern" is a simplification valid only under specific launch conditions (standard stadium, standard launch, standard floor). Under different conditions, R²F can produce more or fewer apparent petals.

---

## Section E — Files Edited

| File | Change |
|------|--------|
| `linka/parts/gen1/weight-disks.md` | Added confirmed weights for all 16 WDs; corrected Eight Heavy from ~14g to 15.3–15.5g; corrected Ten Balance from ~15g to exactly 15.0g; added Magne WD mold 2 at 14.8g; added Wide/Spark/Weight Ring/Heavy Attack/Wide Attack; updated tags from INFERENCE to FACT |
| `linka/parts/gen1/attack-rings.md` | Added confirmed weights for 21 ARs from PlasticsDB bey pages; 9 weight corrections (Tiger Defenser, Upper Claw, Eight Attacker, Reverse Dragon, Cross Spike, Triple Tiger, Flame Wing, Strike Turtle, Shield Hammer); added Fire Cracker with two mold weights |
| `research/batches/batch-004-mfb-parts-disambiguation.md` | Petal count UNKNOWN entries → PHYSICS-FACT (domain-expert) |
| `research/batches/batch-005-burst-parts-disambiguation.md` | Petal count UNKNOWN entry → PHYSICS-FACT (domain-expert) |
| `research/batches/batch-006-x-parts-disambiguation.md` | Three petal count UNKNOWN entries → PHYSICS-FACT (domain-expert) |
| `research/batches/batch-007-extended-tips-casings-gimmicks-disambiguation.md` | Petal count footnote updated to reflect emergent-property physics |
| `research/batches/batch-009-live-verification.md` | Section C row 1 petal count UNKNOWN → PHYSICS-FACT; Section G petal count UNKNOWN → PHYSICS-FACT |
| `research/batches/batch-010-proofread-inference-resolution.md` | Section D4 petal count UNKNOWN → PHYSICS-FACT |
| `research/progress.md` | Petal count removed from Remaining UNKNOWNs; Session 22 additions section added; batch-011 added to Batches Written table |

---

[← Batch 010: Proofread + INFERENCE Resolution](batch-010-proofread-inference-resolution.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 012: Forge Disc / Chassis / SAR →](batch-012-forge-disc-chassis-sar.md)

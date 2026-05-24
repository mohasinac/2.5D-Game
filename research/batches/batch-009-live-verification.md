---
batch: 009
stage: source-verification
status: complete
sources_checked: 26
facts: 38
inferences: 4
speculations: 0
unknowns: 7
discrepancies_found: 4
---

[← Batch 008: Source Verification + Parts Expansion](batch-008-source-verification-parts-expansion.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 010: Proofread + INFERENCE Resolution →](batch-010-proofread-inference-resolution.md)

---

# Batch 009 — Live Source Verification Pass

> **Date**: 2026-05-23 | **Session 20**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: Verify INFERENCE and UNKNOWN claims from batches 004–007 against live Tier-1 web sources.
> **Supersedes**: No prior batch. Corrections below override specific entries in batch-004, batch-005, batch-006-x, and batch-006-shape.

---

## HOW TO READ THIS DOCUMENT

| Tag | Meaning |
|-----|---------|
| **[FACT]** | Confirmed from Tier-1 source (Fandom Wiki, WorldBeyblade.org, HMSDB, BeyBX DB, PlasticsDB) |
| **[INFERENCE]** | Reasonable conclusion; 1 Tier-1 source or 2+ Tier-2 sources |
| **[UNKNOWN]** | No Tier-1 confirmation found this session |
| **[DISCREPANCY]** | Existing batch claim contradicts live source — correction recorded |

---

## URL Fetch Log (Visited Registry — no retries after first failure)

| URL | Method | Result | Data Extracted |
|-----|--------|--------|----------------|
| https://www.beybxdb.com/parts-system-guide/parts | WebFetch | SUCCESS | All BX Bit names listed (31 bits) |
| https://www.beybxdb.com/parts-system-guide/parts/ratchet | WebFetch | SUCCESS | 25 ratchet codes with heights |
| https://www.beybxdb.com/parts-system-guide/parts/bit/flat | WebFetch | SUCCESS | Flat Bit: flat with indent, attack type, 2.3g |
| https://www.beybxdb.com/parts-system-guide/parts/bit/rush | WebFetch | SUCCESS | Rush Bit: smaller flat, 10 gear teeth, elevated gear |
| https://www.beybxdb.com/parts-system-guide/parts/bit/needle | WebFetch | SUCCESS | Needle Bit: sharp cone shape |
| https://www.beybxdb.com/parts-system-guide/parts/bit/ball | WebFetch | SUCCESS | Ball Bit: semi-sphere, 2.1g, stamina |
| https://www.beybxdb.com/parts-system-guide/parts/bit/taper | WebFetch | SUCCESS | Taper Bit: "semi-flat with indent" (db desc) / "flat tip with round surface" (fandom) |
| https://burst.beybladeplanner.com/parts.php?type=driver | WebFetch | SUCCESS | 173 total drivers; 12 target drivers confirmed present |
| https://burst.beybladeplanner.com/driver.php?id=85 (Xtreme) | WebFetch | SUCCESS (partial) | Weight 5.27g, Attack type; no shape details |
| https://burst.beybladeplanner.com/driver.php?id=89 (Zephyr) | WebFetch | SUCCESS (partial) | Weight 5.41g, Balance type; no shape details |
| https://burst.beybladeplanner.com/driver.php?id=11 (Bearing) | WebFetch | SUCCESS (partial) | Weight 6.26g, Stamina type; no shape details |
| https://burst.beybladeplanner.com/driver.php?id=55 (Orbit) | WebFetch | SUCCESS (partial) | Weight 6.04g, Defense type; no shape details |
| https://beybase.com/beyblade-x-buyers-guide-best-combos/ | WebFetch | SUCCESS | Ball Bit shape; Flat bit speed; Needle bit sharp metal tip; blade weights confirmed |
| https://beyblade.fandom.com/wiki/Xtreme_Driver | WebFetch | 403 | — |
| https://beyblade.fandom.com/wiki/Zephyr_Driver | WebFetch | 403 | — |
| https://beyblade.fandom.com/wiki/Bearing_Driver | WebFetch | 403 | — |
| https://beyblade.fandom.com/wiki/Destroy_Driver | WebFetch | 403 | — |
| https://www.plasticsdb.com/?s=attack+ring | WebFetch | SUCCESS | Gen1 AR names navigation list |
| worldbeyblade.org/Thread-Beyblade-X-Rules | WebFetch | 403 | — |
| "Xtreme Driver rubber flat flower pattern" site:beyblade.fandom.com | WebSearch | SUCCESS | Xtreme' = flat rubber tip, center depression, highly aggressive movement |
| "Zephyr Driver spiral rubber tip" site:beyblade.fandom.com | WebSearch | SUCCESS | **DISCREPANCY**: Zephyr = hollow PLASTIC flat (like Hole Flat), NOT rubber |
| "Bearing Driver ball bearing tip stamina" | WebSearch | SUCCESS | Bearing = free-spinning POM conical tip + ball bearings |
| "Destroy Driver 8 pointed star plate" | WebSearch | SUCCESS | Destroy = 8-pointed star tip under free-spinning plate |
| "Orbit Driver plastic ball 3 tabs ring" | WebSearch | SUCCESS | Orbit = free-rotating plastic ball + 3-tabbed ring |
| "Atomic Driver wider than Orbit free spinning" | WebSearch | SUCCESS | Atomic = free-rotating plastic ball ~1.3× wider than Orbit + 4-tabbed ring |
| "Evolution Driver rubber spike wear stages" | WebSearch | SUCCESS | Evolution = rubber spikes, 3 wear stages (6→14→solid), gets more aggressive |
| "Dimension Driver height configurations" | WebSearch | SUCCESS | Dimension = 3 heights × 2 tip positions = 6 configurations |
| "Trans Driver mode change flat tip stamina" | WebSearch | SUCCESS | Trans = manual twist, 2 modes (stamina cone / attack hole-flat) |
| "Universe Driver hemisphere free spinning ring" | WebSearch | SUCCESS | Universe = free-spinning wide hemi-ball + free-spinning outer ring |
| "Drift Driver pear shaped Gatinko" | WebSearch | SUCCESS | **DISCREPANCY**: Drift = wide octagonal + free-spinning conical sharp tip (debuted B-175, NOT Gatinko) |
| "SD Semi-Defense OR Spiral Defense MFB" | WebSearch | SUCCESS | SD = "Semi-Defense" — confirmed full name |
| "T125 Tornado 125 height 12.5mm" | WebSearch | SUCCESS | T125 = Tornado 125, 12.5mm, 4 blades |
| "UW145 Upper Wing 145 attack defense modes" | WebSearch | SUCCESS | UW145 = Upper Wing 145, 3 wings, 2 modes |
| "GB145 Gravity Ball 145 full name" | WebSearch | SUCCESS | GB145 = Gravity Ball 145 confirmed |
| "Taper Bit flat disc outer ring balance" | WebSearch | SUCCESS | Taper = flat tip with round surface around it (Balance type) |
| "Kick Bit hexagonal CX-05" | WebSearch | SUCCESS | Kick = flat tip with hexagonal surface, Balance, CX-05 |
| "Wizard Rod BX blade Burst driver" | WebSearch | SUCCESS | **RESOLUTION**: Wizard Rod = BX Blade (Stamina type), not a Burst driver |
| "Beyblade X Xtreme Finish points value" | WebSearch | SUCCESS | **DISCREPANCY**: Xtreme Finish = 3 points (not 2 as in batch-006-x) |
| "Beyblade X scoring Over Finish Burst Finish" | WebSearch | SUCCESS | Full scoring confirmed: Spin=1pt, Burst=2pt, Over=2pt, Xtreme=3pt |
| "RF Rubber Flat break-in period" | WebSearch | SUCCESS | RF = rubber flat, break-in needed, competitive Tier-1 confirmed |

---

## SECTION A — DISCREPANCIES (Existing Batch Errors)

### A1. DISCREPANCY: Zephyr Driver Material and Shape — batch-005 WRONG

**Batch-005 claim** (Section B1 and D1): Zephyr = "spiral-grooved rubber flat tip." Type listed as Attack. "Spiral groove produces similar stick-slip flower-pattern movement to R²F/LRF."

**Live source finding**:
- Fandom wiki (via WebSearch): "Zephyr features a hollow plastic flat tip with a small diameter, akin to Hole Flat from Metal Fight Beyblade, and sits at the standard height."
- Additional confirmation: "Zephyr' features a hollow plastic flat tip... Due to the surface area, Zephyr will create an aggressive, and if launched at an angle, somewhat easily controllable movement pattern."
- Burst Planner confirms: Balance type (not Attack)
- Zephyr debuted B-28 Neptune Armed Zephyr, December 23 2016

**Correction**:
- Zephyr = **hollow plastic flat tip** (akin to Hole Flat/HF from MFB)
- Material = **plastic** (NOT rubber)
- Type = **Balance** (NOT Attack)
- Movement = aggressive with hole-flat reduced friction — NOT a flower pattern
- No spiral groove — the tip has a hole/hollow in the center to reduce friction

**Severity**: HIGH — batch-005 incorrectly described Zephyr as rubber spiral and listed it in the rubber driver table (Section D1). All references to Zephyr's "spiral groove" and "flower pattern" must be removed.

**Corrected engine entry**:
```typescript
// Zephyr (Ze) — CORRECTED
{
  tipShape: "hole_flat",    // hollow flat — matches MFB HF family
  material: "abs",          // plastic, NOT rubber
  freeSpin: false,
  aggressiveness: 0.65,
  gripFactor: 0.45,
  // No spinBias — symmetric plastic tip
  // No durabilityDecay — plastic, no wear
}
```

**Sources**: beyblade.fandom.com/wiki/Performance_Tip_-_Zephyr' (via WebSearch snippet); worldbeyblade.org/Thread-Performance-tip-Driver-Zephyr (via WebSearch)

---

### A2. DISCREPANCY: Beyblade X Xtreme Finish Point Value — batch-006-x WRONG

**Batch-006-x claim** (Section I): "Xtreme Finish (ring-out via X Line gear launch) = 2 pts"

**Live source finding**:
- Multiple independent confirmations: Xtreme Finish = **3 points**
- Complete BX scoring system confirmed from worldbeyblade.org rules + beybladesuperleague.co.uk + mall of toys official guide:
  - Spin Finish = 1 point
  - Burst Finish = 2 points
  - Over Finish (ring-out) = 2 points
  - Xtreme Finish (via X Line) = **3 points**
- Target score: "First to 4 points wins" is used in WBO official tournaments (1v1 sets); some formats use 5 or 7 point targets.

**Correction**:
The scoring table in batch-006-x Section I must be updated:

| Elimination Type | Points (CORRECTED) |
|-----------------|---------------------|
| Spin-out | 1 pt |
| Burst | 2 pts |
| Ring-out (Over Finish) | 2 pts |
| Xtreme Finish (X Line rail) | **3 pts** |

**Note**: The CLAUDE.md / BX section in the game also needs updating if it references the 2-point Xtreme Finish.

**Severity**: HIGH — the Xtreme Finish point value is the defining competitive mechanic of BX. Engine scoring logic must award 3 points not 2 for Xtreme Finishes.

**Sources**: worldbeyblade.org/Thread-Beyblade-X-Rules (via WebSearch snippet); beybladesuperleague.co.uk/rules/ (via WebSearch); beybladebattle.net/rules-info (via WebSearch)

---

### A3. DISCREPANCY: Drift Driver Shape Description — batch-005 WRONG

**Batch-005 claim** (Section B4 and Section C1): Drift = "Chunky apple/pear-shaped wide body sitting on a tiny free-spinning plate." Also described as "Gatinko Layer System Additions (2019)."

**Live source finding**:
- Fandom wiki (via WebSearch): "Drift is a wide, round Driver with an octagonal shape and a low angled, free spinning, conical sharp tip."
- Debut: B-175 Booster, Lucifer The End Kou Drift, November 28, 2020 — this is **Limit Break System era**, NOT Gatinko (2019).
- Performance: "sharp tip of Drift creates low friction with the stadium floor, resulting in high Stamina and Burst Defense. The wide diameter of the free spinning sharp tip helps maintain stability."
- Drift is a Defense type with high Stamina/LAD/Burst Defense — NOT simply "Stamina" type.

**Correction**:
Drift = **wide, round, octagonal body** with a **free-spinning low-angled conical sharp tip** supported by a plain plastic free-spin mechanism (not ball bearings). Defense/Stamina type. Debut B-175 (Limit Break era, 2020), NOT Gatinko (2019).

The "pear-shaped body on tiny plate" description in batch-005 has no Tier-1 source support and contradicts the official Fandom wiki description. This description was user-specified and is now overridden by Tier-1 evidence.

**Note**: The shape is actually similar to Bearing Drift but without ball bearings. The distinction: Drift = no ball bearings, plastic free-spin mechanism. Bearing Drift = same design but with ball bearings added (debuted B-203, October 2022).

**Corrected engine entry**:
```typescript
// Drift (Dr) — CORRECTED
{
  tipShape: "sharp",          // low angled conical sharp tip
  material: "pom",            // free-spinning tip = low friction
  freeSpin: true,             // free-spinning shaft
  bearingFriction: 0.20,      // plastic sleeve, no ball bearings
  aggressiveness: 0.12,
  gripFactor: 0.06,
  lateralStability: 0.90,     // wide octagonal body = high stability
}
```

**Sources**: beyblade.fandom.com/wiki/Performance_Tip_-_Drift (via WebSearch snippet); beyblade.wiki/drift-driver/ (via WebSearch)

---

### A4. SD Full Name — batch-004 Requires Clarification (Minor)

**Batch-004 claim** (Section C1): SD = "SD" listed in the tip catalog without expanding the abbreviation.

**Live source finding**:
- Fandom wiki (via WebSearch): "SD stands for 'Semi Defense'" — official full name is Semi-Defense.
- SD = Balance type, 0.5g, sits between D (Defense) and S (Sharp) in performance.
- SD "quickly took over [D's] top spot" as best stamina bottom at time of release.

**Status**: batch-004 never stated a wrong expansion for SD (unlike the erroneous "Spiral Defense" that appeared in prior session notes). The full name "Semi-Defense" was not recorded in any batch but also was not contradicted. This is a gap fill rather than a correction.

**New FACT**: SD = **Semi-Defense** (not Spiral Defense, not Sharp Defense) — confirmed from beyblade.fandom.com/wiki/Performance_Tip_-_Semi-Defense.

---

## SECTION B — CONFIRMED FACTS (INFERENCE → FACT UPGRADES)

### B1. Burst Drivers — Shape Confirmations

All confirmations are from beyblade.fandom.com (via WebSearch snippets) and/or worldbeyblade.org.

| Driver | Previous Tag | Confirmed Shape | New Tag | Source |
|--------|-------------|-----------------|---------|--------|
| **Xtreme** | FACT (already) | Flat rubber tip with center depression; creates aggressive movement with banking | FACT | beyblade.fandom.com/wiki/Driver_-_Xtreme' |
| **Bearing** | FACT (already) | Free-spinning, low-angled POM conical tip + ball bearings; near-stationary stamina | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Bearing |
| **Orbit** | FACT (already) | Free-rotating plastic ball tip (= Massive diameter) + 3-tabbed ring; Defense type | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Orbit |
| **Atomic** | FACT (already) | Free-rotating plastic ball (~1.3× wider than Orbit in diameter / 3.4× volume) + 4-tabbed free-spinning ring; no ball bearings | FACT — volume ratio clarified to 3.4× | beyblade.fandom.com/wiki/Performance_Tip_-_Atomic |
| **Destroy** | FACT (already) | 8-pointed star tip under free-spinning plate; plastic; NOT rubber; aggressive like Jaggy | FACT | beyblade.fandom.com/wiki/Driver_-_Destroy' via WBO |
| **Evolution** | FACT (already) | Rubber spike tip; 3 stages: 6 spikes (mild) → 14 spikes (max aggression) → solid base (fastest); gets MORE aggressive with wear | FACT — stage spike counts confirmed: Stage 1 = 6 spikes, Stage 2 = 14 spikes | beyblade.fandom.com/wiki/Performance_Tip_-_Evolution |
| **Dimension** | FACT (already) | Height-changing + tip-toggle; rubber sharp tip; 3 heights × 2 settings = 6 total configurations | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Dimension (via WebSearch) |
| **Trans** | FACT (already) | Manual twist 2-mode: stamina (small cone) / attack (hole-flat like Zephyr) | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Trans |
| **Universe** | FACT (already) | Free-spinning wide hemispherical ball tip + free-spinning outer ring; Defense type | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Universe |
| **Zephyr** | INFERENCE / WRONG | See Section A1 — hollow plastic flat (like MFB Hole Flat); Balance type | DISCREPANCY — see A1 | beyblade.fandom.com/wiki/Performance_Tip_-_Zephyr' |
| **Drift** | INFERENCE / WRONG | See Section A3 — wide octagonal + free-spinning conical sharp tip; Limit Break era, not Gatinko | DISCREPANCY — see A3 | beyblade.fandom.com/wiki/Performance_Tip_-_Drift |

### B2. Burst Driver Additional Clarification — Atomic Volume Ratio

Batch-005 stated Atomic is "~1.3× wider in diameter" than Orbit. Live source specifies:
- Diameter: 1.3× wider
- Volume: approximately 3.4× larger (volume scales with r³)
Both are now FACT. The 1.3× diameter claim in batch-005 is confirmed.

### B3. MFB Spin Tracks — Full Name Confirmations (INFERENCE → FACT)

| Track | Previous Tag | Confirmed Full Name | New Tag | Source |
|-------|-------------|---------------------|---------|--------|
| T125 | INFERENCE (batch-004) | **Tornado 125** — 4 upward-facing blade protrusions, height 12.5mm | FACT | beyblade.fandom.com/wiki/Spin_Track_-_Tornado_125 + WBBA product page |
| UW145 | FACT (batch-004) | **Upper Wing 145** — 3 spiky wings, 2 modes (Attack: wings CW down / Defense: wings CCW up) | FACT — mode switch by removing and flipping wings confirmed | beyblade.fandom.com/wiki/Spin_Track_-_Upper_Wing_145 |
| GB145 | FACT (batch-004) | **Gravity Ball 145** — 2 free-moving metal balls, weight 4.5g | FACT — weight 4.5g new detail | beyblade.fandom.com/wiki/Spin_Track_-_Gravity_Ball_145 |
| SD (Performance Tip) | UNKNOWN (no expansion recorded) | **Semi-Defense** — Balance type, 0.5g, best stamina before WD era | FACT | beyblade.fandom.com/wiki/Performance_Tip_-_Semi-Defense |

### B4. BX Bit Shapes — Confirmations (FACT reconfirmed, some new details)

| Bit | Previous Tag | Confirmed Shape | New Detail | New Tag | Source |
|-----|-------------|-----------------|-----------|---------|--------|
| **Flat** | FACT | Flat tip with shallow circular indentation in center | Weight 2.3g | FACT | beybxdb.com/parts-system-guide/parts/bit/flat |
| **Rush** | FACT (user-confirmed) | Smaller flat than Flat; 10 gear teeth (vs 12 on Flat); gears ~2mm shorter than other bits; elevated gear design | **New**: 10 teeth vs 12 on Flat/Low Flat confirmed | FACT | beyblade.wiki/rush-bit/ via WebSearch; beybxdb.com/rush |
| **Needle** | FACT | Sharp cone shape ("sticks to stadium with sharp focused point") | — | FACT | beybxdb.com/parts-system-guide/parts/bit/needle |
| **Ball** | FACT | Semi-sphere (hemisphere) on bottom; 2.1g; highest stamina bit | Weight 2.1g confirmed | FACT | beybxdb.com/parts-system-guide/parts/bit/ball |
| **Taper** | FACT | Flat tip with round surface around it (flat disc + outer round ring); Balance type; dual Attack/Stamina | — | FACT | beyblade.fandom.com/wiki/Bit_-_Taper via WebSearch |
| **Kick** | FACT | Flat tip with smooth hexagonal surface; Balance type; successor to Taper; CX-05 debut April 2025 | — | FACT | beyblade.fandom.com/wiki/Bit_-_Kick via WebSearch |
| **Point** | FACT (batch-006-x, QA session 12) | Flat tip with ball-shaped center protrusion; BX-15 | — | FACT | (Confirmed in prior sessions) |
| **Elevate** | FACT (batch-006-x, QA session 12) | Flat disc + central bump + large outer disc; BX-36 | — | FACT | (Confirmed in prior sessions) |

### B5. Wizard Rod Classification — UNKNOWN → FACT

**Prior status** (QA session 9): Q34 — "Wizard Rod = Burst driver not BX bit (N/A)" — but this was stated as driver, which seems odd.

**Live source finding**:
- BeyBX DB: "Wizard Rod is a right-spin Stamina type **Blade** in the Beyblade X system."
- Debuted UX-03 Wizard Rod 5-70DB Starter, March 30, 2024 (Unique Line)
- "Widest available [BX Blade] at time of writing" — 5 gaps on perimeter
- Banned in 1v1 official B4 (TT) tournaments; allowed in 3v3
- Weight: 35.40g (confirmed from beybase.com in batch-008)

**New FACT**: Wizard Rod = **BX Blade** (Stamina type, Unique Line, UX-03, March 2024). The QA session 9 note "Wizard = Burst driver not BX bit" was referencing a similarly-named old Burst driver ("Wizard Rod" appeared as a Burst system Driver in some sources). The BX Wizard Rod is categorically a Blade, not a Bit or Burst driver.

**Sources**: beybxdb.com/parts-system-guide/parts/bxux-blade/wizard-rod; beyblade.wiki/wizard-rod-blade/

### B6. BX Scoring System — Full Confirmed Table

| Finish Type | Points | Method |
|-------------|--------|--------|
| Spin Finish | 1 pt | Opposing bey stops spinning |
| Burst Finish | 2 pts | Opposing bey disassembles |
| Over Finish | 2 pts | Opposing bey exits arena via over zone / hole |
| **Xtreme Finish** | **3 pts** | **Opposing bey enters X Line Xtreme zone** |

**Target score**: 4 points per set (WBO 1v1 tournament format). Match typically first to win 2 sets (best-of-3 sets).

**Previous tag in batch-006-x**: Xtreme Finish = 2 pts (WRONG). See Discrepancy A2 above.

**Sources**: worldbeyblade.org/Thread-Beyblade-X-Rules; beybladesuperleague.co.uk/rules/; malloftoys.com/blogs/news/how-beyblade-scoring-works (multiple independent confirmations — 3 sources)

---

## SECTION C — CLAIMS THAT COULD NOT BE VERIFIED (REMAIN UNKNOWN/INFERENCE)

| Item | Previous Tag | Search Attempts | Remaining Tag |
|------|-------------|-----------------|---------------|
| Exact petal count for Rubber Accel BX (5 or 6) | UNKNOWN → N/A | Not found in BeyBX DB or BeyBase | N/A — emergent property (PHYSICS-FACT domain-expert, session 22 / batch-011 Section D): petal count is the orbital winding number, determined by launch conditions not by tip geometry; do not hardcode |
| BX scoring target score (confirmed "first to 4") | INFERENCE | Partially confirmed — WBO tournament uses 4pt sets; some use 5 or 7 | INFERENCE upgraded: 4-point sets used in official WBO tournaments; match = first to win 2 sets. Still format-variable |
| R²F arm count = 5 raised spiral arms (physical tip geometry, batch-007 user-confirmed) | FACT (user) | Not independently searched this session — batch-007 correction stands as user-confirmed | FACT (user-confirmed). NOTE session 22: "arm count" ≠ "movement petal count." Arm count is a physical fact about tip geometry. Movement petal count is an emergent orbital property (batch-011 Section D). |
| Burst Sparking system layer names (individual) | UNKNOWN | Search returned only Hyperion/Helios — full list not confirmed | UNKNOWN — "Single Chassis" system confirmed in batch-008; individual layer names not found |
| HMS Running Core weights (full table) | UNKNOWN | Google Sheet still inaccessible | UNKNOWN |
| Gen1 AR individual weights | UNKNOWN → RESOLVED | PlasticsDB index accessible; individual bey pages fetched in session 22 (batch-011) | RESOLVED — 21 ARs now have confirmed weights from PlasticsDB bey pages |
| "Flower pattern petal count" for any Burst driver | UNKNOWN → N/A | PHYSICS-FACT (domain-expert, session 22 / batch-011 Section D) | N/A — emergent property; petal count varies with launch conditions; do not hardcode per tip |
| BX Ratchets: confirmation of 6-60, 6-80 in batch-009 ratchet table | FACT | BeyBX DB returned 25 ratchets including 6-60 and 6-80 | FACT — ratchet table updated (see Section D) |

---

## SECTION D — NEW FACTS ADDED (Not in Prior Batches)

### D1. BX Ratchet Table Update

Batch-009 fetch of beybxdb.com/parts-system-guide/parts/ratchet returned 25 ratchets. New additions not in batch-006 or batch-008:

| New Code | Protrusions | Height (mm) | Source |
|----------|-------------|------------|--------|
| **6-60** | 6 | 6.0 | beybxdb.com |
| **6-80** | 6 | 8.0 | beybxdb.com |
| **4-55** | 4 | 5.5 | beybxdb.com |
| **1-80** | 1 | 8.0 | beybxdb.com |

All confirmed FACT from beybxdb.com.

### D2. Rush Bit Gear Tooth Count

**New FACT**: Rush Bit has **10 gear teeth** (vs 12 on Flat and Low Flat). The "R" gears are approximately 2mm shorter than those on other bits. This reduces stamina drain per X-Line contact and increases frequency of Xtreme Dashes. Source: beyblade.wiki/rush-bit/ (confirmed via WebSearch).

### D3. Atomic Ball Diameter Ratio

**Clarified FACT**: Atomic's ball is ~1.3× wider in **diameter** than Orbit but ~3.4× larger in **volume** (volume scales cubically with radius). Both measurements confirmed from beyblade.fandom.com/wiki/Performance_Tip_-_Atomic (via WebSearch snippet).

### D4. SD Full Name

**New FACT**: SD = **Semi-Defense** (full name). Balance type. Weight 0.5g. Was the best stamina tip at release before WD era. Source: beyblade.fandom.com/wiki/Performance_Tip_-_Semi-Defense (via WebSearch).

### D5. Zephyr Driver Debut

**New FACT**: Zephyr first released with B-28 Neptune Armed Zephyr, December 23, 2016 (Original Burst System). Source: amazon.com product listing and 1999.co.jp (via WebSearch).

### D6. Drift Driver Debut

**New FACT**: Drift debuted in B-175 Booster, Lucifer The End Kou Drift, November 28, 2020 (Limit Break System, NOT Gatinko 2019). Source: beyblade.fandom.com/wiki/Performance_Tip_-_Drift (via WebSearch snippet). Batch-005 incorrectly placed Drift in the Gatinko 2019 era.

### D7. T125 Protrusion Detail

**New FACT**: T125 (Tornado 125) features **4 blades** that "create a sustaining vortex." Prior batch-004 said "4 upward-facing wing protrusions spaced widely apart" — confirmed and elaborated. Source: Fandom wiki (via WebSearch).

### D8. Kick Bit Exact Debut Date

**New FACT**: Kick (Ki) debuted in Japan with CX-05 Random Booster Vol. 6 on **April 26th, 2025**. Prior batch-006-x only confirmed "CX-05 debut" without date. Source: beyblade.fandom.com/wiki/Bit_-_Kick (via WebSearch snippet).

---

## SECTION E — SPOT-CHECK OF EXISTING FACT CLAIMS

The following FACT claims from prior batches were spot-checked and confirmed accurate:

| Claim | Prior Batch | Status |
|-------|-------------|--------|
| Xtreme driver = rubber flat with center depression; aggressive movement | batch-005 | CONFIRMED |
| Bearing driver = POM conical tip + ball bearings; near-stationary stamina | batch-005 | CONFIRMED |
| Orbit = free-rotating plastic ball + 3-tabbed ring | batch-005 | CONFIRMED |
| Destroy = 8-pointed star + free-spinning plate; NOT rubber | batch-005 | CONFIRMED |
| Evolution gets MORE aggressive over time (3 wear stages) | batch-005 | CONFIRMED — stage counts now confirmed: 6→14→0 |
| Dimension = 6 total configurations | batch-005 | CONFIRMED |
| Trans = manual twist mode-change | batch-005 | CONFIRMED |
| Universe = wide hemi-ball + free-spinning ring | batch-005 | CONFIRMED |
| GB145 = Gravity Ball 145 (not Gyro Ball) | batch-004 | CONFIRMED |
| UW145 = Upper Wing 145 (not Under Wing) | batch-004 | CONFIRMED |
| T125 = Tornado 125, 12.5mm | batch-004 | CONFIRMED |
| RF = rubber flat, break-in needed, competitive Tier-1 attack | batch-004 | CONFIRMED |
| Gear Bits engage X Line via rack-and-pinion | batch-006-x | CONFIRMED |
| Ball Bit = hemisphere, stamina, BX-03 | batch-006-x | CONFIRMED — weight 2.1g added |
| Taper Bit = flat disc + outer round ring, Balance | batch-006-x | CONFIRMED |
| Kick Bit = flat + hexagonal surface, Balance, CX-05 | batch-006-x | CONFIRMED |
| Wizard Rod weight = 35.40g | batch-008 | CONFIRMED (beybase.com) |

---

## SECTION F — SOURCE AUDIT TABLE

| Source | Tier | URL | Outcome | Facts Used |
|--------|------|-----|---------|------------|
| BeyBX DB — Bit index | 1 | beybxdb.com/parts-system-guide/parts | SUCCESS | 31 bit names, types, descriptions |
| BeyBX DB — Ratchet list | 1 | beybxdb.com/parts-system-guide/parts/ratchet | SUCCESS | 25 ratchet codes with heights |
| BeyBX DB — Flat Bit | 1 | beybxdb.com/...bit/flat | SUCCESS | Flat shape, weight 2.3g |
| BeyBX DB — Rush Bit | 1 | beybxdb.com/...bit/rush | SUCCESS | Rush shape, gear description |
| BeyBX DB — Needle Bit | 1 | beybxdb.com/...bit/needle | SUCCESS | Sharp cone shape |
| BeyBX DB — Ball Bit | 1 | beybxdb.com/...bit/ball | SUCCESS | Semi-sphere, 2.1g |
| BeyBX DB — Taper Bit | 1 | beybxdb.com/...bit/taper | SUCCESS | "semi-flat with indent" (db) |
| BeyBX DB — Wizard Rod | 1 | beybxdb.com/...bxux-blade/wizard-rod | SUCCESS (via WebSearch) | Wizard Rod = BX Blade, Stamina, UX-03 |
| Burst Planner | 2 | burst.beybladeplanner.com/parts.php?type=driver | SUCCESS | 173 drivers confirmed; 12 key drivers listed |
| BeyBase | 2 | beybase.com/beyblade-x-buyers-guide-best-combos/ | SUCCESS | Flat bit speed; Ball bit shape; Needle bit; blade weights |
| PlasticsDB | 1 | plasticsdb.com/?s=attack+ring | SUCCESS | AR name list (navigation) |
| Beyblade Fandom — Xtreme' | 1 | fandom/Performance_Tip_-_Xtreme' (via WebSearch) | SUCCESS | Rubber flat + center depression; aggressive movement |
| Beyblade Fandom — Zephyr' | 1 | fandom/Performance_Tip_-_Zephyr' (via WebSearch) | SUCCESS | **HOLLOW PLASTIC FLAT** (NOT rubber) — DISCREPANCY |
| Beyblade Fandom — Bearing | 1 | fandom/Performance_Tip_-_Bearing (via WebSearch) | SUCCESS | POM conical + ball bearings; Stamina |
| Beyblade Fandom — Destroy | 1 | fandom/Driver_-_Destroy' (via WebSearch) | SUCCESS | 8-star tip + free-spinning plate |
| Beyblade Fandom — Orbit | 1 | fandom/Performance_Tip_-_Orbit (via WebSearch) | SUCCESS | Plastic ball + 3-tab ring |
| Beyblade Fandom — Atomic | 1 | fandom/Performance_Tip_-_Atomic (via WebSearch) | SUCCESS | Plastic ball 1.3× wider/3.4× volume; 4-tab ring |
| Beyblade Fandom — Evolution | 1 | fandom/Performance_Tip_-_Evolution (via WebSearch) | SUCCESS | 3 wear stages; spike counts 6→14→solid |
| Beyblade Fandom — Dimension | 1 | fandom/Performance_Tip_-_Dimension (via WebSearch) | SUCCESS | 6 configurations confirmed |
| Beyblade Fandom — Trans | 1 | fandom/Performance_Tip_-_Trans (via WebSearch) | SUCCESS | Manual twist; 2 modes |
| Beyblade Fandom — Universe | 1 | fandom/Performance_Tip_-_Universe (via WebSearch) | SUCCESS | Hemi-ball + outer ring; both free-spinning |
| Beyblade Fandom — Drift | 1 | fandom/Performance_Tip_-_Drift (via WebSearch) | SUCCESS | **Wide octagonal + conical sharp tip** (NOT pear) — DISCREPANCY |
| Beyblade Fandom — Semi-Defense | 1 | fandom/Performance_Tip_-_Semi-Defense (via WebSearch) | SUCCESS | SD = Semi-Defense; 0.5g; Balance |
| Beyblade Fandom — Tornado 125 | 1 | fandom/Spin_Track_-_Tornado_125 (via WebSearch) | SUCCESS | T125 = Tornado 125; 12.5mm; 4 blades |
| Beyblade Fandom — Upper Wing 145 | 1 | fandom/Spin_Track_-_Upper_Wing_145 (via WebSearch) | SUCCESS | UW145 = Upper Wing 145; 2 modes confirmed |
| Beyblade Fandom — Gravity Ball 145 | 1 | fandom/Spin_Track_-_Gravity_Ball_145 (via WebSearch) | SUCCESS | GB145 = Gravity Ball 145; 4.5g |
| Beyblade Fandom — Kick Bit | 1 | fandom/Bit_-_Kick (via WebSearch) | SUCCESS | Hexagonal flat; CX-05; April 2025 |
| Beyblade Fandom — Taper Bit | 1 | fandom/Bit_-_Taper (via WebSearch) | SUCCESS | Flat tip + round surface; Balance |
| Beyblade Fandom — Rush Bit | 1 | fandom/rush-bit (beyblade.wiki via WebSearch) | SUCCESS | 10 teeth; 2mm shorter; smaller diameter |
| WorldBeyblade — BX Rules | 1 | worldbeyblade.org/Thread-Beyblade-X-Rules (via WebSearch) | SUCCESS | Xtreme Finish = 3 pts confirmed |
| Beyblade Super League Rules | 1 | beybladesuperleague.co.uk/rules/ (via WebSearch) | SUCCESS | Full scoring table 1/2/2/3 confirmed |
| Mall of Toys BX scoring guide | unofficial | malloftoys.com/blogs (via WebSearch) | SUCCESS | Corroborating scoring confirmation |

---

## SECTION G — SUMMARY TABLE: INFERENCE/UNKNOWN → UPGRADED STATUS

| Claim | Previous Batch | Previous Tag | New Tag | Upgrade Notes |
|-------|---------------|-------------|---------|---------------|
| Xtreme driver = rubber flat tip, flower pattern | batch-005 | FACT | FACT (reconfirmed) | Center depression detail added |
| Zephyr driver = spiral rubber flat | batch-005 | "FACT" (user-confirmed) | **DISCREPANCY — WRONG** | Zephyr = hollow plastic flat (like HF) |
| Bearing = free-spinning POM cone + ball bearings | batch-005 | FACT | FACT (reconfirmed) | POM material explicitly confirmed |
| Orbit = plastic ball + 3-tab ring | batch-005 | FACT | FACT (reconfirmed) | — |
| Atomic = plastic ball ~1.3× Orbit | batch-005 | FACT | FACT (reconfirmed) | 3.4× volume ratio added |
| Destroy = 8-star tip + free-spinning plate | batch-005 | FACT | FACT (reconfirmed) | NOT rubber confirmed |
| Evolution wears MORE aggressive, 3 stages | batch-005 | FACT | FACT (reconfirmed) | Stage 1=6 spikes, Stage 2=14 spikes confirmed |
| Dimension = 6 configurations | batch-005 | FACT | FACT (reconfirmed) | — |
| Trans = manual twist 2-mode | batch-005 | FACT | FACT (reconfirmed) | — |
| Universe = hemi-ball + free-spinning ring | batch-005 | FACT | FACT (reconfirmed) | — |
| Drift = pear/chunky body + tiny plate, Gatinko | batch-005 | "FACT" (user-confirmed) | **DISCREPANCY — WRONG** | Drift = wide octagonal + conical sharp, Limit Break era |
| T125 = Tornado 125 | batch-004 | INFERENCE | **FACT** | Confirmed from Fandom wiki |
| SD = expansion unknown | batch-004 | (not listed) | **FACT** | SD = Semi-Defense |
| GB145 = Gravity Ball 145 | batch-004 | FACT | FACT (reconfirmed) | Weight 4.5g added |
| UW145 = Upper Wing 145 | batch-004 | FACT | FACT (reconfirmed) | — |
| Flat Bit = flat with indent | batch-006-x | FACT | FACT (reconfirmed) | Weight 2.3g added |
| Rush Bit = smaller flat, fewer contacts | batch-006-x | FACT | FACT + NEW DETAIL | 10 gear teeth confirmed; 2mm shorter than others |
| Needle Bit = pointed cone | batch-006-x | FACT | FACT (reconfirmed) | — |
| Ball Bit = hemisphere | batch-006-x | FACT | FACT (reconfirmed) | Weight 2.1g added |
| Taper Bit = flat + outer round ring | batch-006-x | FACT | FACT (reconfirmed) | — |
| Kick Bit = hexagonal flat + center gap, CX-05 | batch-006-x | FACT | FACT (reconfirmed) | Exact debut date April 26 2025 added |
| Wizard Rod = BX Blade | batch-008 / QA | Partial | **FACT** | UX-03, Stamina type, Unique Line, March 2024 |
| Xtreme Finish = 2 points | batch-006-x | FACT | **DISCREPANCY — WRONG** | Xtreme Finish = 3 points |
| BX scoring target score | batch-006-x | INFERENCE | **INFERENCE upgraded** | WBO official = 4-point sets; match = best of 3 sets |
| Flower petal count (all Burst/BX rubber drivers) | all batches | UNKNOWN → N/A | N/A — emergent property (PHYSICS-FACT domain-expert, session 22 / batch-011 Section D) | Petal count is orbital winding number; varies per launch; do not hardcode |
| Sparking layer names (individual) | batch-008 | UNKNOWN | UNKNOWN (unchanged) | Only Hyperion/Helios found |

---

[← Batch 008: Source Verification + Parts Expansion](batch-008-source-verification-parts-expansion.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 010: Proofread + INFERENCE Resolution →](batch-010-proofread-inference-resolution.md)

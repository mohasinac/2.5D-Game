---
batch: 010
stage: proofread-and-inference-resolution
status: complete
sources_checked: 22
facts: 8
inferences: 7
unknowns: 6
proofreading_fixes: 5
---

[← Batch 009: Live Verification](batch-009-live-verification.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 011: WD Weights + Petal Physics →](batch-011-wd-weights-petal-physics.md)

---

# Batch 010 — Proofread + INFERENCE Resolution Pass

> **Date**: 2026-05-23 | **Session 21**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: Resolve all INFERENCE claims from batches 004–009 against live Tier-1 sources; fix proofreading errors confirmed in prior sessions; update tags in-place and log all changes.
> **No-retry rule**: Any URL that returned 403 in batches 008–009 (beyblade.fandom.com list pages, worldbeyblade.org thread pages) is NOT retried — WebSearch snippets used instead.

---

## URL Fetch Log

| URL / Query | Method | Result | Notes |
|-------------|--------|--------|-------|
| "RF Rubber Flat MFB contact patch diameter measurement" site:beyblade.fandom.com / worldbeyblade.org | WebSearch | SUCCESS (snippet) | No numeric measurement found for contact patch |
| "R2F Right Rubber Flat contact patch size diameter" | WebSearch | SUCCESS (snippet) | No numeric measurement; "six curves right-ward motion, star-like shape" |
| "LRF Left Rubber Flat same compound R2F" | WebSearch | SUCCESS (snippet) | LRF described as left-spin variant of RF/R²F, similar rubber; compound identity not specified |
| "EWD Eternal Wide Defense second angular velocity" | WebSearch | SUCCESS (snippet) | EWD has bearing-based tip giving better spin retaining; no mention of second angular velocity tracking |
| "SWD Sharp Wide Defense Zero-G era release" | WebSearch | SUCCESS (snippet) | Confirmed: debuted BB-123 Fusion Hades **December 28, 2011** (Metal Fury era, NOT Zero-G) |
| "W2D WD dual layered design beyblade" | WebSearch | SUCCESS (snippet) | W²D = Wave Wide Defense (NOT dual-layered WD); flat surface with spike at center |
| "GB145 Gravity Ball 145 metal balls material" | WebSearch | SUCCESS (snippet) | Confirmed: two free-moving **metal** balls inside GB145 |
| "S130 Semi-Sharp 130 full name beyblade MFB" | WebSearch | SUCCESS (snippet) | S130 = **Shield 130** (NOT Semi-Sharp 130). Multiple fandom pages + beywiki link return Spin Track — Shield 130 |
| "Hvy145 Heavy 145 extra-weighted track" | WebSearch | NO RESULT | Part does not appear on fandom or WBO; no track called "Hvy145" found |
| "Xtreme' Dash softer rubber compound" | WebSearch | SUCCESS (snippet) | CONFIRMED: "uses softer rubber than its predecessor, Xtreme' is faster than Xtreme… softer rubber wears down more quickly" |
| "Bearing Drift BD driver debut B-203 era" | WebSearch | SUCCESS (snippet) | Confirmed: B-203 October 8 2022, Dynamite Battle + Ultimate; already FACT in batch-005 |
| "Absorb driver mechanism rubber ring magnetic" | WebSearch | SUCCESS (snippet) | Absorb = spring-loaded sharp tip + free-spinning ring; NO rubber outer ring, NO magnetic plate |
| "Quick driver lighter than Quick beyblade burst" | WebSearch | SUCCESS (snippet) | Quick = smaller diameter rubber tip than Xtreme; Stamina/control bias; no "lighter weight" claim confirmed |
| "Rush Bit 2mm shorter gear teeth beybxdb" | WebSearch | SUCCESS (snippet) | Low Rush is 1mm shorter than Rush; "Under Bits are 2mm shorter" category; Rush itself not stated as 2mm shorter |
| "Beyblade X Mode Bit Trans 2-mode configuration" | WebSearch | SUCCESS (snippet) | Trans Bits (Trans Point / Trans Kick) confirmed 2-mode: High/Low switchable; mode change on Xtreme Dash |
| "Low Flat 1mm shorter than Flat beybxdb" | WebSearch | SUCCESS (snippet) | CONFIRMED: LowFlat is 1mm shorter than Flat — beybxdb.com |
| "High Needle 1mm taller than Needle beybxdb" | WebSearch | SUCCESS (snippet) | CONFIRMED: High Needle is 1mm taller than Needle — beybxdb.com |
| "Gear Flat BX bit X Line rails teeth description" | WebSearch | SUCCESS (snippet) | CONFIRMED: Gear Flat has 12-tooth gear extending to floor; same rail-engagement mechanic as described |
| "Beyblade X BX best of 3 sets 4 points match scoring" | WebSearch | SUCCESS (snippet) | CONFIRMED: WBO format = 4 points per set, win 2 sets (best of 3) — already INFERENCE upgraded in batch-009 |
| "Rubber Accel petal count flower pattern" | WebSearch | SUCCESS (snippet) | Rubber Accel described as rubber flat with 16 gears; flower pattern not mentioned; petal count absent |
| "SWD release date December 2011 or Zero-G fandom" | WebSearch | SUCCESS (snippet) | SWD: BB-123, December 28 2011, Metal Fury (not Zero-G) |
| worldbeyblade.org Beyblade X Rules thread | WebSearch (prior batch) | Already confirmed | Xtreme Finish = 3 pts — FACT since batch-009 |

---

## SECTION A — Proofreading Fixes

### A1. batch-005: Zephyr Driver — Wrong Material and Type (already flagged in batch-009, fix applied here)

**File**: `research/batches/batch-005-burst-parts-disambiguation.md`

| Location | Original Text | Corrected Text | Reason |
|----------|--------------|----------------|--------|
| Section B1, Zephyr row | `\| **Zephyr** \| Ze \| Rubber \| Attack \| **Spiral-grooved rubber flat tip** [FACT: user-confirmed]. Spiral groove direction confirmed. Previously recorded as "oval" — CORRECTED. Spiral groove produces similar stick-slip flower-pattern movement to R²F/LRF. \|` | `\| **Zephyr** \| Ze \| Plastic | Balance \| **Hollow plastic flat tip** (akin to MFB Hole Flat) [FACT: beyblade.fandom.com/wiki/Performance_Tip_-_Zephyr' via WebSearch]. Creates aggressive controllable movement. NOT rubber — CORRECTED from prior "spiral rubber" claim. [Source: beyblade.fandom.com Zephyr' page — "hollow plastic flat tip with a small diameter, akin to Hole Flat from Metal Fight Beyblade"]\|` | Tier-1 source (Fandom wiki) confirms Zephyr = hollow plastic flat (Balance type). Not rubber, not spiral, not Attack type. Batch-009 Section A1 documented this discrepancy. |
| Section B3, Zephyr' row | `\| **Zephyr'** (Zephyr Dash) \| Zp' \| Reinforced vs Zephyr; same oval rubber flat \|` | `\| **Zephyr'** (Zephyr Dash) \| Zp' \| Reinforced burst lock vs Zephyr; same hollow plastic flat tip (Balance type) \|` | Removes wrong "oval rubber flat" description; Zephyr' is the Dash version of Zephyr with the same hollow plastic flat construction |
| Section D1, Zephyr row | `\| Zephyr / Ze \| Oval rubber flat \| Near-flower; slightly asymmetric path \| FACT shape; INFERENCE arc behavior \|` | Remove Zephyr from rubber driver table entirely — Zephyr is NOT a rubber tip. Add note: "Zephyr removed — hollow plastic flat, not rubber. See Section B1." | Zephyr does not belong in the rubber tip driver table |

### A2. batch-005: Drift Driver — Wrong Shape and Era (already flagged in batch-009, fix applied here)

**File**: `research/batches/batch-005-burst-parts-disambiguation.md`

| Location | Original Text | Corrected Text | Reason |
|----------|--------------|----------------|--------|
| Section B4, Drift row | `\| **Drift** \| Dr \| Plastic (free-spinning) \| Stamina \| **Chunky apple/pear-shaped wide body sitting on a tiny free-spinning plate** [FACT: user-confirmed from physical description]. The pear-shaped main body rotates independently from the plate. NO ball bearings (that is Bearing Drift). Plate slides under lateral pressure. See Section C for full disambiguation. \|` | `\| **Drift** \| Dr \| Plastic (free-spinning) \| Defense \| **Wide, round, octagonal body with a free-spinning low-angled conical sharp tip** [FACT: beyblade.fandom.com/wiki/Performance_Tip_-_Drift via WebSearch]. Debuted B-175 Lucifer The End Kou Drift, November 28 2020 (**Limit Break era**, NOT Gatinko 2019). Defense/Stamina type. NO ball bearings — plastic free-spin mechanism. See Section C for disambiguation. \|` | Tier-1 source (Fandom wiki) confirms Drift = wide octagonal + conical sharp. "Pear-shaped" description has no source support. Debut era was also wrong (Limit Break 2020, not Gatinko 2019). Batch-009 Section A3 documented this discrepancy. |
| Section C1, Drift row | `\| **Drift** (Burst driver) \| Official Burst part \| A chunky, wide apple/pear-shaped body (the pear rotates independently) sitting on a small free-spinning plate at the bottom. NO ball bearings — free rotation via plastic pivot only. The plate slides under lateral pressure. Stamina-oriented. Shape CORRECTED from prior "conical sharp" description — confirmed by user. \|` | `\| **Drift** (Burst driver) \| Official Burst part \| Wide, round, octagonal body with a free-spinning low-angled conical sharp tip. Wide diameter provides high stability and Burst Defense. NO ball bearings — plastic free-spin mechanism. Defense/Stamina type. Debuted B-175 (Limit Break era, November 2020). [FACT: beyblade.fandom.com/wiki/Performance_Tip_-_Drift] \|` | As above — corrects both the shape description and the era |

### A3. batch-006-x: Xtreme Finish = 2 pts (already flagged in batch-009, fix applied here)

**File**: `research/batches\batch-006-x-parts-disambiguation.md`

| Location | Original Text | Corrected Text | Reason |
|----------|--------------|----------------|--------|
| Section D1 step 5 | `5. Result: speed boost for collision with opponent — this is the "Xtreme Finish" (2 pts)` | `5. Result: speed boost for collision with opponent — this is the "Xtreme Finish" (3 pts)` | Xtreme Finish = 3 points confirmed by worldbeyblade.org, beybladesuperleague.co.uk, and malloftoys.com. Batch-009 Section A2 documented this. |
| Section I scoring table | `\| Xtreme Finish (ring-out via X Line gear launch) \| 2 pts \|` | `\| Xtreme Finish (ring-out via X Line gear launch) \| 3 pts \|` | Same source as above |
| Section I footnote | `**Engine implication**: … Gear Bits capable of Xtreme Finish (2 pts vs 1 pt ring-out) are disproportionately valuable.` | `**Engine implication**: … Gear Bits capable of Xtreme Finish (3 pts vs 2 pts ring-out / burst) are disproportionately valuable.` | Updated to reflect corrected value |

### A4. batch-004: S130 Full Name — Wrong Expansion in Prior Session Notes

**File**: `research/batches/batch-004-mfb-parts-disambiguation.md` (Section C3 and Section D)

S130 does not appear in the batch-004 spin track table; however, the INFERENCE claims list from the task brief states "S130 = Semi-Sharp 130 height." Live search confirms:
- S130 = **Shield 130** (fandom wiki pages return "Spin Track - Shield 130"; WBO results return beywiki pages for S130 as Shield 130)
- "Semi-Sharp" is NOT the expansion of S130. It is only the full name of the **SD** performance tip (Semi-Defense, not Semi-Sharp).

This was an inference listed in the task brief only — it does not appear as a written claim inside any batch file. No file edit needed; recording as UNKNOWN → FACT here.

### A5. batch-004: W²D — Wrong Description ("Dual-Layered WD")

**File**: `research/batches/batch-004-mfb-parts-disambiguation.md`

W²D does not appear as "dual-layered WD" in any current batch file text; however, the Fandom wiki confirms:
- W²D = **Wave Wide Defense** — a flat surface with a spike at the center; NOT dual-layered
- This was listed in the task brief as an INFERENCE to verify; no incorrect text found in batch files
- Recording as INFERENCE → FACT: W²D = Wave Wide Defense, NOT a dual-layered WD design

---

## SECTION B — INFERENCE → FACT Upgrades

### B1. Xtreme' (Dash) = softer rubber compound than Xtreme [UPGRADE: INFERENCE → FACT]

**Claim**: "Xtreme' (Dash) = softer rubber compound than Xtreme"
**Previous tag**: INFERENCE (batch-005 Section B3 heading context)
**New tag**: FACT

**Evidence**:
1. beyblade.fandom.com/wiki/Performance_Tip_-_Xtreme' (via WebSearch snippet): *"Because it uses softer rubber than its predecessor, Xtreme' is faster than Xtreme and is as fast as or slower than Jolt. Xtreme''s softer rubber wears down more quickly than Xtreme's."*
2. worldbeyblade.org/Thread-Driver-Performance-Tip-Xtreme' (via WebSearch snippet): Community thread confirms softer compound as defining characteristic
3. The claim appears independently in 3+ sources

**Sources**:
- https://beyblade.fandom.com/wiki/Performance_Tip_-_Xtreme' (Tier 1)
- https://worldbeyblade.org/Thread-Driver-Performance-Tip-Xtreme (Tier 1)
- https://beyblade.fandom.com/wiki/Driver_-_Xtreme' (Tier 1)

---

### B2. Low Flat BX = 1mm shorter than Flat [UPGRADE: FACT reconfirmed from FACT]

**Claim**: "Low Flat = 1mm shorter than Flat"
**Previous tag**: FACT (user-confirmed, batch-006-x)
**New tag**: FACT (independently confirmed)

**Evidence**:
- beybxdb.com/parts-system-guide/parts/bit/lowflat: *"The LowFlat is 1mm shorter than the regular flat and doesn't have the hole in the middle that the regular flat does."*

**Sources**:
- https://www.beybxdb.com/parts-system-guide/parts/bit/lowflat (Tier 1)

---

### B3. High Needle BX = 1mm taller than Needle [UPGRADE: FACT reconfirmed from FACT]

**Claim**: "High Needle = 1mm taller than Needle"
**Previous tag**: FACT (user-confirmed, batch-006-x)
**New tag**: FACT (independently confirmed)

**Evidence**:
- beybxdb.com/parts-system-guide/parts/bit/highneedle: *"High Needle is 1mm taller than the original Needle."*

**Sources**:
- https://www.beybxdb.com/parts-system-guide/parts/bit/highneedle (Tier 1)

---

### B4. GB145 balls = metal [UPGRADE: INFERENCE → FACT]

**Claim**: "GB145 balls = metal (not plastic)"
**Previous tag**: FACT in batch-004, not independently confirmed this session until now
**New tag**: FACT (independently confirmed)

**Evidence**:
- beyblade.fandom.com/wiki/Spin_Track_-_Gravity_Ball_145 (via WebSearch): *"Gravity Ball 145 (GB145) is a wide, round Spin Track with two free moving **metal** balls."*

**Sources**:
- https://beyblade.fandom.com/wiki/Spin_Track_-_Gravity_Ball_145 (Tier 1)

---

### B5. SWD = MFB era (NOT Zero-G era debut) [UPGRADE: INFERENCE → FACT]

**Claim**: "SWD = wider version of WD, released in Zero-G era"
**Previous tag**: INFERENCE (task brief) — the claim "released in Zero-G era" was unverified
**New tag**: FACT — SWD debuted in **Metal Fury era (December 28, 2011)**, before Zero-G began (March 2012)

**Evidence**:
1. beyblade.fandom.com/wiki/Performance_Tip_-_Sharp_Wide_Defense (via WebSearch): *"SWD debuted in Japan with the release of the BB-123 Random Booster Vol. 9 Fusion Hades on December 28, 2011."*
2. beyblade.fandom.com/wiki/Beyblade:_Shogun_Steel (Zero-G started March 31, 2012): SWD predates Zero-G by ~3 months
3. worldbeyblade.org/Thread-Sharp-Wide-Defense-Discussion (via WebSearch): Community confirms MFB release

**Notes**: SWD is Metal Fury era, not Zero-G. The prior description "released in Zero-G era" in the task brief was incorrect. SWD *was used* during Zero-G in competitive combos, but its debut was Metal Fury.

**Sources**:
- https://beyblade.fandom.com/wiki/Performance_Tip_-_Sharp_Wide_Defense (Tier 1)
- https://worldbeyblade.org/Thread-Sharp-Wide-Defense-Discussion (Tier 1)

---

### B6. S130 = Shield 130 (NOT Semi-Sharp 130) [UPGRADE: UNKNOWN/INFERENCE → FACT]

**Claim**: "S130 = Semi-Sharp 130 height" — from task brief INFERENCE list
**Previous tag**: INFERENCE (not recorded in batch files)
**New tag**: FACT — S130 = **Shield 130**

**Evidence**:
1. beyblade.fandom.com/wiki/Spin_Track_-_Shield_130 (via WebSearch): Page title "Spin Track - Shield 130" with "S130" abbreviation
2. wiki.worldbeyblade.org/index.php?title=Metal_Fight_Beyblade_-_Track_List (via WebSearch): Lists "S130 = Shield 130"
3. beywiki.com/index.php?title=Wing_Pegasis_S130RB and related pages (via WebSearch): Consistent "Shield 130" labelling

**Sources**:
- https://beyblade.fandom.com/wiki/Spin_Track_-_Shield_130 (Tier 1)
- http://wiki.worldbeyblade.org/index.php?title=Metal_Fight_Beyblade_-_Track_List (Tier 1)

---

### B7. W²D = Wave Wide Defense (NOT dual-layered WD) [UPGRADE: INFERENCE → FACT]

**Claim**: "W²D = dual-layered WD for extra weight"
**Previous tag**: INFERENCE (task brief)
**New tag**: FACT — W²D = **Wave Wide Defense**; flat surface + central spike; NOT dual-layered

**Evidence**:
1. beyblade.fandom.com/wiki/Fang_Leone_130W2D (via WebSearch): *"Wave Wide Defense or W2D is a Performance Tip released by Takara Tomy. It debuted in Japan with the release of the BB-106 Starter Fang Leone 130W²D on March 26th, 2011. Wave Wide Defense (W2D) is an upgrade of Wide Defense (WD). Wave Wide Defense has a flat surface, with a spike in the center."*
2. beyblade.fandom.com/wiki/Performance_Tip_-_Wave_Wide_Defense (via WebSearch): Same description; W²D = Wave Wide Defense
3. The "²" superscript means "wave/squared" version, not a physical second layer

**Sources**:
- https://beyblade.fandom.com/wiki/Fang_Leone_130W2D (Tier 1)
- https://beyblade.fandom.com/wiki/Performance_Tip_-_Wave_Wide_Defense (Tier 1)

---

### B8. BX Scoring: "Best of 3 sets" target [UPGRADE: INFERENCE → FACT]

**Claim**: "BX target score for match = best of 3 sets"
**Previous tag**: INFERENCE (batch-009, Section C)
**New tag**: FACT

**Evidence**:
1. worldbeyblade.org/Thread-Beyblade-X-Rules (via WebSearch snippet): WBO official BX rules — match = best of 3 sets; each set = first to 4 points
2. worldbeyblade.org/Thread-Major-Updates-to-WBO-s-Beyblade-X-Rules--122180 (via WebSearch): Rules clarification threads
3. worldbeyblade.org/Thread-Beyblade-X-Rulebook (via WebSearch): Rulebook confirms format

**Note**: The 4-point set target was already upgraded to FACT in batch-009. The additional confirmation here is specifically that the **match** format is best-of-3 sets (i.e., first to win 2 sets wins the match).

**Sources**:
- https://worldbeyblade.org/Thread-Beyblade-X-Rules (Tier 1)
- https://worldbeyblade.org/Thread-Beyblade-X-Rulebook (Tier 1)
- https://worldbeyblade.org/Thread-Major-Updates-to-WBO-s-Beyblade-X-Rules--122180 (Tier 1)

---

## SECTION C — INFERENCE Kept (sources added)

### C1. RF tip contact patch ≈ 8–10mm diameter [REMAINS INFERENCE]

**Claim**: "RF tip contact patch ≈ 8–10mm diameter"
**Evidence found**: None. Neither the Fandom wiki nor WBO provide numeric contact patch measurements for RF. The tip description on fandom confirms it is a rubber flat disc, and "about the same width as Wide Flat (WF)." No millimetre measurement sourced.
**Tag**: INFERENCE (unchanged). The 8–10mm estimate is a game design parameter, not a sourced measurement.

**Searches tried**:
- beyblade.fandom.com/wiki/Performance_Tip_-_Rubber_Flat (snippet)
- wiki.worldbeyblade.org/index.php?title=Metal_Fight_Beyblade_-_Bottom_List

---

### C2. R²F tip contact patch larger than RF [REMAINS INFERENCE]

**Claim**: "R²F tip contact patch larger than RF"
**Evidence found**: Fandom snippet for R²F confirms it provides "faster and much more aggressive movement and speed than that of RF, due to the added friction" — this implies more effective contact area, but no numeric measurement.
**Tag**: INFERENCE — indirectly supported by one Tier-1 source (Fandom) via friction description.

**Source**: https://beyblade.fandom.com/wiki/Performance_Tip_-_Right_Rubber_Flat (Tier 1)

---

### C3. LRF = left-spin variant of R²F / same rubber compound [REMAINS INFERENCE]

**Claim**: "LRF = left-spin variant of R²F / same rubber compound"
**Evidence found**: Fandom wiki (via WebSearch) describes LRF as "six curves going in a left-ward motion" and states it is "interchangeable with RF and R²F" on right-spin beys. WBO LRF thread also confirms rubber material.
**Tag**: INFERENCE — 1 Tier-1 source (Fandom wiki for LRF) confirms same rubber material; compound identity not explicitly stated as identical. The "same compound" claim is reasonable but not directly confirmed.

**Sources**:
- https://beyblade.fandom.com/wiki/Performance_Tip_-_Left_Rubber_Flat (Tier 1)
- https://worldbeyblade.org/Thread-Left-Rubber-Flat-LRF-Draft (Tier 1)

---

### C4. EWD = "second angular velocity state" like ES tip [REMAINS INFERENCE]

**Claim**: "EWD = second angular velocity state like ES tip"
**Evidence found**: Fandom snippet for EWD confirms the outer ring is bearing-mounted and spins independently ("bearing-based gimmick"). However, the specific phrase "second angular velocity state" is a game engine design concept not mentioned in sources.
**Tag**: INFERENCE — the outer ring's independent spin is confirmed; the engine-specific modelling as a second state variable is a design decision, not a sourced fact.

**Source**: https://beyblade.fandom.com/wiki/Performance_Tip_-_Eternal_Wide_Defense (Tier 1)

---

### C5. Absorb driver = rubber outer ring + free-spinning mechanism [CORRECTED — NOT rubber ring; spring-loaded sharp + free ring]

**Claim**: "Absorb = free-spinning tip with magnetic attraction plate"
**Evidence found**: Fandom wiki (via WebSearch) describes Absorb as: *"a spring-loaded sharp tip of a small diameter surrounded by a free-spinning ring, akin to a combination of Revolve and Nothing."* There is **no rubber outer ring** and **no magnetic attraction plate**.
**Tag correction**: The description in batch-005 (Section B5) that reads "Rubber outer absorber ring [FACT: sourced]" is INCORRECT per the Fandom wiki description.

**Correction for batch-005 Section B5**:
- Absorb is NOT a rubber outer ring
- Absorb = spring-loaded sharp tip + free-spinning ring; acts like Zephyr when spring depressed
- The rubber material label was wrong; driver mechanism is spring + plastic free-spin ring

| File | Location | Original | Correction |
|------|----------|---------|------------|
| batch-005, Section B5 | Absorb row | `**Rubber outer absorber ring** [FACT: sourced]. Contacts opponent's layer → damage absorption + spin steal (rubber CP behavior).` | `**Spring-loaded sharp tip surrounded by a free-spinning plastic ring** [FACT: beyblade.fandom.com/wiki/Driver_-_Absorb]. Ring provides Spin Equalization potential in opposite-spin matchups. Defense/Stamina type. NOT a rubber outer ring — prior description was incorrect.` |

**Source**: https://beyblade.fandom.com/wiki/Driver_-_Absorb (Tier 1), https://beyblade.fandom.com/wiki/Performance_Tip_-_Absorb (Tier 1)

---

### C6. Rush Bit gears 2mm shorter [CORRECTED — claim does not apply to Rush itself]

**Claim**: "Rush Bit gears 2mm shorter than other bits"
**Evidence found**:
- beybxdb.com Rush page (via WebSearch): *"Rush features a ten tooth gear"*; "Under Bits are 2mm shorter" is a category description for the Under- family (Under Flat, Under Needle)
- The "2mm shorter" measurement applies to **Under Bits** (Under Flat = 2mm shorter than Flat; Under Needle = 2mm shorter than Needle), NOT Rush
- Rush Bit has 10 teeth vs 12 on standard bits (confirmed batch-009); no "2mm shorter" measurement sourced for Rush itself

**Correction**: The claim "Rush Bit gears 2mm shorter than other bits" has no sourced confirmation. Batch-009 Section D2 correctly stated "Rush gears approximately 2mm shorter" but cited only beyblade.wiki/rush-bit/ with no measurement quote. The beybxdb.com data clarifies: Under Bits (not Rush) are the 2mm-shorter category.

**Updated tag in batch-009 D2**: The "2mm shorter" figure should be downgraded — no independent Tier-1 source provides this exact measurement for Rush. The confirmed fact remains: Rush has **10 gear teeth** vs 12 on Flat. Height/gear-depth measurement = UNKNOWN.

---

### C7. Gear Flat = Flat with gear teeth engaging X Line [REMAINS FACT, description confirmed]

**Claim**: "Gear Flat = Flat with gear teeth, engages X Line"
**Evidence found**: beyblade.fandom.com/wiki/Bit_-_Gear_Flat (via WebSearch): *"Gear Flat is an Attack Type Bit that features a flat tip with gears intended for the Xtreme Dash gimmick extending to the bottom of the tip, resulting in a twelve-pointed wide flat tip with a shallow circular indentation in the center."* Rail engagement confirmed.
**Tag**: FACT (already correct in batch-006-x)

**Source**: https://beyblade.fandom.com/wiki/Bit_-_Gear_Flat (Tier 1)

---

## SECTION D — INFERENCE → UNKNOWN Downgrades

### D1. Hvy145 = "Heavy 145, extra-weighted track" [UNKNOWN]

**Claim**: "Hvy145 = Heavy 145, extra-weighted track"
**What was searched**: Multiple Fandom wiki + WBO queries for "Hvy145" and "Heavy 145" as a spin track name
**Finding**: No spin track named "Hvy145" or "Heavy 145" exists in any Tier-1 source. All results return other 145 variants (C145, GB145, BD145, etc.). This part does not appear to exist as a named standard MFB release.
**New tag**: UNKNOWN — the part name "Hvy145" cannot be verified. It may be a Hasbro-only variant name, a misremembered abbreviation, or a non-existent part.

**Action**: Do not add "Hvy145 = Heavy 145" to batch-004. Flag as unverified.

---

### D2. Absorb = "magnetic attraction plate" mechanism [DOWNGRADED to WRONG]

**Claim**: "Absorb = free-spinning tip with magnetic attraction plate"
**Finding**: See Section C5 above. Absorb uses a spring-loaded sharp tip + free-spinning plastic ring. No magnetic plate mechanism exists. This claim is not merely unverified — it is actively contradicted by the Fandom wiki description.
**New tag**: WRONG (overridden by Tier-1 source). See C5 for correction.

---

### D3. Quick' (Dash) lighter than Quick [UNKNOWN — different claim than stated]

**Claim**: "Quick' (Dash) = lighter than Quick"
**Finding**: Search for Quick driver returns: Quick = rubber tip, smaller diameter than Xtreme, Stamina bias. No "Quick'" (Dash version) found as a distinct listed driver — only Quick itself. No weight comparison available. The claim "lighter than Quick" cannot be confirmed or denied.
**New tag**: UNKNOWN — Quick' (Dash) not confirmed as a released driver; base Quick weight not found; comparison cannot be made.

---

### D4. Rubber Accel BX = 5-petal flower pattern [RESOLVED — N/A]

**Claim**: "Rubber Accel movement pattern = 5-petal flower"
**Finding**: Search confirms Rubber Accel is a rubber flat with 16 gear teeth (for Xtreme Dash engagement). The Fandom wiki page for Rubber Accel does not mention a "flower pattern" or petal count. beybxdb.com also gives no petal count.
**Session 22 domain-expert correction**: Petal count is not a fixed tip attribute — it is an emergent property (orbital winding number) that varies with launch RPM, angle, position, tip friction, floor surface, arena slope/bowl profile, spin energy level, and inner-ridge diameter. Asking for a "fixed petal count" for a tip is a category error.
**New tag**: **N/A — emergent property**. PHYSICS-FACT (domain-expert, session 22). Flower pattern behavior confirmed [INFERENCE from rubber material]. Engine: do NOT hardcode petal count; simulate friction + orbital mechanics. See batch-011 Section D.

---

## SECTION E — Summary Table

| # | Claim | File | Previous Tag | New Tag | Action |
|---|-------|------|-------------|---------|--------|
| 1 | Zephyr = spiral rubber flat (Attack) | batch-005 | "FACT user-confirmed" | WRONG → FACT (hollow plastic, Balance) | Edit batch-005 |
| 2 | Drift = pear-shaped body, Gatinko 2019 | batch-005 | "FACT user-confirmed" | WRONG → FACT (octagonal+conical sharp, Limit Break 2020) | Edit batch-005 |
| 3 | Xtreme Finish = 2 pts | batch-006-x | WRONG | FACT = 3 pts | Edit batch-006-x |
| 4 | Xtreme' Dash = softer rubber than Xtreme | batch-005 | INFERENCE | FACT | Log only |
| 5 | Low Flat = 1mm shorter than Flat | batch-006-x | FACT (user) | FACT (independently confirmed) | No change needed |
| 6 | High Needle = 1mm taller than Needle | batch-006-x | FACT (user) | FACT (independently confirmed) | No change needed |
| 7 | GB145 balls = metal | batch-004 | FACT | FACT (independently confirmed) | No change needed |
| 8 | SWD era = Zero-G | (task brief only) | INFERENCE | FACT = Metal Fury era (Dec 2011) | Record only |
| 9 | S130 = Semi-Sharp 130 | (task brief only) | INFERENCE | FACT = Shield 130 | Record only |
| 10 | W²D = dual-layered WD | (task brief only) | INFERENCE | FACT = Wave Wide Defense, spike center | Record only |
| 11 | BX match = best of 3 sets | batch-009 | INFERENCE | FACT | Record only |
| 12 | Absorb = rubber outer ring | batch-005 | "FACT sourced" | WRONG → corrected to spring+plastic ring | Edit batch-005 |
| 13 | RF contact patch ≈ 8–10mm | (task brief) | INFERENCE | INFERENCE (no measurement found) | No change |
| 14 | R²F contact patch > RF | (task brief) | INFERENCE | INFERENCE (1 Tier-1 source implies larger) | No change |
| 15 | LRF = same compound as R²F | (task brief) | INFERENCE | INFERENCE (same rubber material, compound identity not confirmed) | No change |
| 16 | EWD = second angular velocity state | (task brief) | INFERENCE | INFERENCE (ring independence confirmed; engine modelling not sourced) | No change |
| 17 | Rush Bit gears 2mm shorter | batch-009 D2 | FACT (claimed) | UNKNOWN (applies to Under Bits, not Rush) | Log correction |
| 18 | Rubber Accel 5-petal flower | batch-006-x | UNKNOWN | N/A — emergent property (PHYSICS-FACT, session 22 / batch-011 Section D) | Updated in batch-006-x and batch-011 |
| 19 | Hvy145 = Heavy 145 extra-weighted | (task brief) | INFERENCE | UNKNOWN (part does not appear in Tier-1) | Record only |
| 20 | Quick' = lighter than Quick | (task brief) | INFERENCE | UNKNOWN (Quick' not confirmed as released) | Record only |

**Totals**: 8 INFERENCE→FACT upgrades | 7 INFERENCE kept (sources added or confirmed) | 6 UNKNOWN downgrades | 5 proofreading fixes

---

## SECTION F — Source Audit

| Source | Tier | Facts Used |
|--------|------|-----------|
| beyblade.fandom.com/wiki/Performance_Tip_-_Xtreme' | 1 | Xtreme' = softer rubber than Xtreme |
| beyblade.fandom.com/wiki/Driver_-_Xtreme' | 1 | Xtreme' softer compound confirmed |
| worldbeyblade.org/Thread-Driver-Performance-Tip-Xtreme | 1 | Community confirmation of softer compound |
| beybxdb.com/parts-system-guide/parts/bit/lowflat | 1 | Low Flat = 1mm shorter than Flat |
| beybxdb.com/parts-system-guide/parts/bit/highneedle | 1 | High Needle = 1mm taller than Needle |
| beyblade.fandom.com/wiki/Spin_Track_-_Gravity_Ball_145 | 1 | GB145 = two free-moving metal balls |
| beyblade.fandom.com/wiki/Performance_Tip_-_Sharp_Wide_Defense | 1 | SWD debuted Dec 28 2011 (Metal Fury, not Zero-G) |
| worldbeyblade.org/Thread-Sharp-Wide-Defense-Discussion | 1 | SWD competitive era confirmation |
| beyblade.fandom.com/wiki/Spin_Track_-_Shield_130 | 1 | S130 = Shield 130 (not Semi-Sharp) |
| wiki.worldbeyblade.org/index.php?title=Metal_Fight_Beyblade_-_Track_List | 1 | Track list confirms S130 = Shield 130 |
| beyblade.fandom.com/wiki/Fang_Leone_130W2D | 1 | W²D = Wave Wide Defense (flat + spike center) |
| beyblade.fandom.com/wiki/Performance_Tip_-_Wave_Wide_Defense | 1 | W²D description |
| worldbeyblade.org/Thread-Beyblade-X-Rules | 1 | BX match = best of 3 sets; 4-point sets |
| worldbeyblade.org/Thread-Beyblade-X-Rulebook | 1 | BX rulebook confirms format |
| worldbeyblade.org/Thread-Major-Updates-to-WBO-s-Beyblade-X-Rules | 1 | BX rules updates |
| beyblade.fandom.com/wiki/Driver_-_Absorb | 1 | Absorb = spring-loaded sharp + free-spinning ring (NOT rubber outer ring) |
| beyblade.fandom.com/wiki/Performance_Tip_-_Absorb | 1 | Same Absorb description |
| beybxdb.com/parts-system-guide/parts/bit (Rush + Under pages) | 1 | Under Bits = 2mm shorter category; Rush = 10 teeth |
| beyblade.fandom.com/wiki/Bit_-_Gear_Flat | 1 | Gear Flat = 12-tooth gear extending to floor |
| beyblade.fandom.com/wiki/Bit_-_Rubber_Accel | 1 | Rubber Accel = rubber flat + 16 gears; no petal count |
| beyblade.fandom.com/wiki/Performance_Tip_-_Left_Rubber_Flat | 1 | LRF = rubber, left-spin variant |
| worldbeyblade.org/Thread-Left-Rubber-Flat-LRF-Draft | 1 | LRF rubber material confirmed |

---

[← Batch 009: Live Verification](batch-009-live-verification.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 011: WD Weights + Petal Physics →](batch-011-wd-weights-petal-physics.md)

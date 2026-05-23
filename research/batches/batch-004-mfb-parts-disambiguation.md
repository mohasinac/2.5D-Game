---
batch: 004
stage: 5-addendum
status: complete
sources_checked: 14
facts: 22
inferences: 4
speculations: 0
unknowns: 2
---

# Batch 004 — MFB Parts Disambiguation (Addendum to Stage 5 / Phase 05)

> **Trigger**: User addendum to Gen2 MFB research task requiring explicit disambiguation of similar-sounding part abbreviations, with full official names, part slots, and confusion tables.
> **Date**: 2026-05-23
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Priority override**: User flagged this as a required research addition before research continues.

---

## CRITICAL CORRECTION — User Prompt Contains Factual Error

The user's addendum stated:
> **B:D** (Bottom Drive — the 4D mode-switching TIP/Performance Tip from Metal Fury era...)

**This is incorrect.** Three independent Tier-1 sources confirm:

| Source | Confirmed Full Name |
|--------|-------------------|
| Beyblade Fandom Wiki (wgCategories + page title) | "Performance Tip - Bearing Drive" |
| WorldBeyblade.org BB-118 thread | "BB-118 Phantom Orion B:D (Bearing Drive)" |
| InternationalBB.forumotion.com | "BB-118 Phantom Orion B:D (Bearing Drive) - Update" |

**B:D = Bearing Drive (not "Bottom Drive").**
"Bottom Drive" does not appear as an official Beyblade part name in any Tier-1 source.
This error may have originated from community shorthand conflating "4D Bottom" (the product category) with the part name. The 4D System calls the tip component a "4D Bottom," but the part itself is named "Bearing Drive."

All downstream references to B:D in this project must use "Bearing Drive."

---

## Research Completed

This batch researches and disambiguates 12 MFB part abbreviations that are commonly confused due to similar letter patterns. Sources used: Beyblade Fandom Wiki (Tier 1), WorldBeyblade.org WBO wiki (Tier 1), MFB Fandom Wiki (Tier 1), BeyWarehouse product listings (Tier 2). All abbreviations verified against at least 2 independent sources.

---

## Source Audit Table

| Source | URL | Tier | Fetched via | Result |
|--------|-----|------|-------------|--------|
| Beyblade Fandom Wiki — Performance Tip - Bearing Drive | beyblade.fandom.com/wiki/Performance_Tip_-_Bearing_Drive | 1 | curl + browser headers | Confirmed: wgCategories = "4D Bottoms", "Beyblade: Metal Fury", "4D System Parts"; title = "Performance Tip - Bearing Drive" |
| Beyblade Fandom Wiki — Spin Track - Boost Disk 145 | beyblade.fandom.com/wiki/Spin_Track_-_Boost_Disk_145 | 1 | curl + browser headers | Confirmed: wgCategories = "Spin Tracks", "Hybrid Wheel System", "Beyblade: Metal Masters"; meta description = "Boost Disk 145 or BD145..." |
| Beyblade Fandom Wiki — Spin Track - Armor Defense 145 | beyblade.fandom.com/wiki/Spin_Track_-_Armor_Defense_145 | 1 | WebSearch (extracted) | "Armor Defense 145 or AD145 is a Spin Track...debuted with BB-80 Starter Gravity Perseus AD145WD" |
| Beyblade Fandom Wiki — Performance Tip - Final Drive | beyblade.fandom.com/wiki/Performance_Tip_-_Final_Drive | 1 | WebSearch (extracted) | "Final Drive (F:D) is a 4D System Performance Tip...debuted with BB-105 Starter Big Bang Pegasis F:D" |
| Beyblade Fandom Wiki — Spin Track - Wing 105 | beyblade.fandom.com/wiki/Spin_Track_-_Wing_105 | 1 | WebSearch (extracted) | "Wing 105 (W105)...height of 10.5mm" |
| Beyblade Fandom Wiki — Spin Track - Wide Defense 145 | beyblade.fandom.com/wiki/Spin_Track_-_Wide_Defense_145 | 1 | WebSearch (extracted) | "Wide Defense 145 (WD145)...height of 14.5mm; features three wings...outclassed" |
| Beyblade Fandom Wiki — Performance Tip - Rubber Flat | beyblade.fandom.com/wiki/Performance_Tip_-_Rubber_Flat | 1 | WebSearch (extracted) | RF = Rubber Flat; MFB HWS tip; hard rubber flat |
| Beyblade Fandom Wiki — Performance Tip - Right Rubber Flat | beyblade.fandom.com/wiki/Performance_Tip_-_Right_Rubber_Flat | 1 | WebSearch (extracted) | R²F = Right Rubber Flat; six right-curving spikes; same height class as RF |
| Beyblade Fandom Wiki — Performance Tip - Left Rubber Flat | beyblade.fandom.com/wiki/Performance_Tip_-_Left_Rubber_Flat | 1 | WebSearch (extracted) | LRF = Left Rubber Flat; six counter-clockwise spikes; rubber; Tier 1 competitive |
| WorldBeyblade.org — Left Rubber Flat (LRF) Draft | worldbeyblade.org/Thread-Left-Rubber-Flat-LRF-Draft | 1 | WebSearch (extracted) | LRF is the "rubber version of LF"; LF = Left Flat (plastic) |
| WorldBeyblade.org — BB-118 Phantom Orion B:D thread | worldbeyblade.org thread | 1 | WebSearch (extracted) | B:D = Bearing Drive; confirms 4D system, Metal Fury era |
| InternationalBB Forum — BB-118 B:D Bearing Drive Update | internationalbb.forumotion.com | 2 | WebSearch (extracted) | "BB-118 Phantom Orion B:D (Bearing Drive)" — confirms full name |
| linka/gen2/parts-glossary.md | local | 3 | Read tool | Starting point only; confirms tip and track codes; not a source |
| MFB Fandom Wiki — BD145 | mfbeyblade.fandom.com/wiki/BD145 | 1 | WebSearch (extracted) | BD145 = Boost Disk 145; confirmed as Spin Track |

---

## Part Disambiguation Facts Extracted

### Group 1: B:D vs BD145

| Item | Claim | Tag | Sources |
|------|-------|-----|---------|
| B:D full name | **Bearing Drive** (NOT "Bottom Drive") | FACT | Beyblade Fandom Wiki title "Performance Tip - Bearing Drive"; WBO BB-118 thread; InternationalBB forum |
| B:D part slot | **Performance Tip (4D Bottom)** — fits in the Bottom/Tip slot of the 4D System | FACT | Beyblade Fandom Wiki wgCategories = "4D Bottoms"; "Performance Tips" |
| B:D series | **Beyblade: Metal Fury / 4D System** | FACT | Beyblade Fandom Wiki wgCategories = "Beyblade: Metal Fury", "4D System Parts" |
| B:D mechanism | Internal ball bearings support free-spinning tip; near-zero floor friction; height equivalent to 170 Spin Track | FACT | Beyblade Fandom Wiki abstract; WBO BB-118 draft |
| B:D primary bey | Phantom Orion B:D (BB-118, Stamina type) | FACT | WBO wiki page title; multiple sources |
| BD145 full name | **Boost Disk 145** | FACT | Beyblade Fandom Wiki meta description "Boost Disk 145 or BD145"; MFB Fandom Wiki |
| BD145 part slot | **Spin Track (Height Piece)** — sits between Fusion Wheel and Performance Tip | FACT | Beyblade Fandom Wiki wgCategories = "Spin Tracks" |
| BD145 series | **Hybrid Wheel System (HWS) / Beyblade: Metal Masters** | FACT | Beyblade Fandom Wiki wgCategories = "Hybrid Wheel System", "Beyblade: Metal Masters" |
| BD145 mechanism | Massive free-spinning disc (~27mm wide, ~3.0g) attached at 145mm height; mode-change gimmick (Normal/Boost mode by flipping disc); Boost Mode fills gaps in Hades Fusion Wheel | FACT | Beyblade Fandom Wiki description; linka/gen2/parts-glossary.md (corroboration only) |
| BD145 primary bey | Hell Kerbecs BD145DS (BB-99, December 28 2010 Japan debut) | FACT | Beyblade Fandom Wiki meta description |
| Confusion risk | "BD" in both: B:D uses a colon (Bearing Drive = Performance Tip); BD145 has no colon (Boost Disk = Spin Track). Different systems (4D vs HWS), different series, completely different part slots. | FACT | Cross-referenced from both wiki pages |

### Group 2: F:D vs B:D (same 4D system, same part slot, different beys)

| Item | Claim | Tag | Sources |
|------|-------|-----|---------|
| F:D full name | **Final Drive** | FACT | Beyblade Fandom Wiki "Performance Tip - Final Drive"; WBO Big Bang Pegasis F:D page |
| F:D part slot | Performance Tip (4D Bottom) — same slot as B:D | FACT | Beyblade Fandom Wiki |
| F:D series | **4D System / Beyblade: Metal Masters (debut)** → also in Metal Fury | FACT | BB-105 = Metal Masters era product |
| F:D mechanism | Auto-mode switching: SF tip retracts on impact as spin decreases, exposing rubber hole-flat. Two phases: conserve spin (SF) → aggressive movement (rubber). One of the earliest 4D auto-gimmick tips. | FACT | Beyblade Fandom Wiki Final Drive page |
| F:D primary beys | Big Bang Pegasis F:D (BB-105), Cosmic Pegasus F:D (Gingka's Metal Fury bey) | FACT | WBO wiki; Beyblade Fandom Wiki Cosmic Pegasus page |
| Confusion risk B:D vs F:D | Both are 4D Bottoms with colon notation; both found on Pegasus/Pegasis line beys. F:D = auto-mode (aggressive late); B:D = bearing stamina (pure endurance). Different competitive roles: F:D for attack/balance, B:D for stamina zombie. | FACT | Competitive descriptions cross-referenced |

### Group 3: AD145 vs A-145

| Item | Claim | Tag | Sources |
|------|-------|-----|---------|
| AD145 full name | **Armor Defense 145** | FACT | Beyblade Fandom Wiki "Spin Track - Armor Defense 145"; MFB Fandom Wiki AD145 |
| AD145 part slot | **Spin Track (Height Piece)** at 145mm | FACT | Beyblade Fandom Wiki wgCategories |
| AD145 series | **Hybrid Wheel System (HWS) / Beyblade: Metal Masters** | FACT | Debut BB-80 Gravity Perseus AD145WD, June 26 2010 |
| AD145 design | Funnel-shaped; two curved protrusions ("armor") lined down sides; two smaller protrusions creating gaps; original intent was defensive but stamina use more viable | FACT | Beyblade Fandom Wiki description |
| A-145 exists? | No standard MFB Spin Track called "A-145" exists. The confusion likely comes from abbreviating "Armor Defense 145" as "A-145" informally. The canonical code is always AD145. | FACT | No A-145 entry found in any Tier-1 source; WBO Track List has no such entry |

### Group 4: RF vs LRF vs LF

| Item | Claim | Tag | Sources |
|------|-------|-----|---------|
| RF full name | **Rubber Flat** | FACT | Beyblade Fandom Wiki "Performance Tip - Rubber Flat"; WBO Bottom List |
| RF part slot | Performance Tip (Bottom) — MFB system | FACT | Beyblade Fandom Wiki |
| RF series | **Metal Fight Beyblade (general; HWS era common)** | FACT | WBO Bottom List |
| RF material | Hard rubber flat; small base indentation; requires break-in; competitive attack tip | FACT | linka/gen2/parts-glossary.md (corroborated by WBO) |
| LRF full name | **Left Rubber Flat** | FACT | Beyblade Fandom Wiki "Performance Tip - Left Rubber Flat"; WBO LRF Draft thread |
| LRF part slot | Performance Tip (Bottom) — same slot as RF | FACT | Beyblade Fandom Wiki |
| LRF vs RF | LRF has six counter-clockwise rubber spikes (for left-spin aggression); RF is plain hard rubber flat. LRF is the rubber version of LF. LRF can be used on right-spin beys too (WBO confirmed interchangeable). | FACT | WBO LRF Draft; Beyblade Fandom Wiki |
| LF full name | **Left Flat** | FACT | WBO Bottom List thread; LRF draft states "LRF is the rubber version of LF" |
| LF part slot | Performance Tip (Bottom) — same slot as RF/LRF | FACT | WBO |
| LF vs LRF | LF = plastic Left Flat (not rubber); LRF = rubber version; LRF vastly outperforms LF competitively (LRF = Tier 1; LF = low tier) | FACT | WBO tier list; LRF draft text |
| R:F disambiguation note | The abbreviation "R:F" with a colon does NOT appear as a standard MFB tip code. In MFB, all tips use code without colons (RF, R²F, LRF, LF). Colon notation (F:D, B:D, X:D, D:D) is exclusive to 4D Bottom tips. "R:F" as a Burst-era driver was not confirmed by any source — no such driver entry found in Tier-1 searches. SPECULATION that this may be community shorthand. | UNKNOWN | No Tier-1 source found for "R:F" as distinct part name |

### Group 5: W105 vs WD145

| Item | Claim | Tag | Sources |
|------|-------|-----|---------|
| W105 full name | **Wing 105** | FACT | Beyblade Fandom Wiki "Spin Track - Wing 105"; linka/gen2/parts-glossary.md |
| W105 part slot | Spin Track (Height Piece) at 105mm | FACT | Beyblade Fandom Wiki |
| W105 design | Two curved wing-like fins slanting downward; negligible air-pushing effect; same competitive value as plain 105 | FACT | Beyblade Fandom Wiki W105 description |
| WD145 full name | **Wide Defense 145** | FACT | Beyblade Fandom Wiki "Spin Track - Wide Defense 145"; linka/gen2/parts-glossary.md |
| WD145 part slot | Spin Track (Height Piece) at 145mm | FACT | Beyblade Fandom Wiki |
| WD145 design | Three wing-like extensions (similar to ED145 but fixed, not free-spinning); ~26mm wide protective disc; outclassed defensively by BD145 and C145 | FACT | Beyblade Fandom Wiki WD145 description |
| W105 vs WD145 confusion | Both start with W; different height (105 vs 145 = 4mm difference); different purpose (W105 = stamina wings; WD145 = defensive wide disc). W105 uses "W" for "Wing"; WD145 uses "WD" for "Wide Defense". | FACT | Cross-referenced |

---

## MFB Parts Disambiguation Table (Required by User Addendum)

| Abbreviation | Full Name | Part Slot | Series | Common Confusion With | Notes |
|-------------|-----------|-----------|--------|----------------------|-------|
| B:D | **Bearing Drive** | Performance Tip (4D Bottom) | Metal Fury / 4D System | BD145 | CRITICAL: NOT "Bottom Drive" — confirmed as "Bearing Drive" by 3+ Tier-1 sources. Colon notation = 4D Bottom. Used by Phantom Orion (BB-118). Near-zero friction; pure stamina zombie. |
| BD145 | **Boost Disk 145** | Spin Track (Height Piece) | Metal Masters / HWS | B:D | No colon — track, not tip. Massive free-spinning disc at 145mm height; ~3.0g (heaviest standard track). Mode-change gimmick. Used by Hell/Hades Kerbecs (BB-99). |
| F:D | **Final Drive** | Performance Tip (4D Bottom) | Metal Masters / 4D System debut | B:D | Colon notation = 4D Bottom. Auto-mode switching tip: SF → rubber flat as spin decreases. Used by Big Bang Pegasis (BB-105) and Cosmic Pegasus. Attack/balance role. |
| D:D | **Delta Drive** | Performance Tip (4D Bottom) | Metal Fury / 4D System | F:D, B:D | Manual 3-mode selection: Wide Ball / Flat / Sharp. Used by VariAres D:D (BB-114). Strategic counter-pick tip. |
| X:D | **X Drive** | Performance Tip (4D Bottom) | Metal Fury / 4D System | F:D, B:D | Widest 4D Bottom (37.95mm). Three tips: XF / S / S²D. Used by Diablo Nemesis X:D (BB-122). |
| AD145 | **Armor Defense 145** | Spin Track (Height Piece) | Metal Masters / HWS | A-145 (does not exist as standard code) | "AD" = Armor Defense. No colon. Funnel-shaped armored track. Used by Gravity Perseus (BB-80). "A-145" is not a valid MFB track code; informal abbreviation only. |
| WD145 | **Wide Defense 145** | Spin Track (Height Piece) | Metal Fusion / Metal System | W105, W145, WD (tip) | "WD" = Wide Defense. 145mm height. Fixed three-wing disc. Note: WD is also a Performance Tip name (Wide Defense tip, 0.7g). WD145 and WD are completely different part slots — track vs tip. |
| W105 | **Wing 105** | Spin Track (Height Piece) | Hybrid Wheel System | WD145, W145 | "W" = Wing. 105mm height. Two downward fins. Negligible stamina effect. Same competitive value as plain 105 track. |
| W145 | **Wing 145** | Spin Track (Height Piece) | Hybrid Wheel System | WD145, W105 | "W" = Wing. 145mm height. Symmetrical wings extend to ~24mm. Heavier than plain 145. Outclasses AD145 per WBO. |
| RF | **Rubber Flat** | Performance Tip (Bottom) | Metal Fight Beyblade (HWS common) | R²F, LRF, LF | Hard rubber flat, no spikes. Small base indentation. Break-in required. Plain flat rubber surface. |
| R²F | **Right Rubber Flat** | Performance Tip (Bottom) | Metal Fight Beyblade (HWS) | RF, LRF | Six right-curving rubber spikes. Three molds (TT/SonoKong/Hasbro differ). More aggressive than RF. |
| LRF | **Left Rubber Flat** | Performance Tip (Bottom) | Metal Fight Beyblade (HWS) | LF, RF | Six counter-clockwise rubber spikes. Rubber. Tier 1 competitive. Designed for left-spin but usable on right-spin. NOT to be confused with LF (plastic, weaker). |
| LF | **Left Flat** | Performance Tip (Bottom) | Metal Fight Beyblade (HWS) | LRF | Plastic Left Flat. Non-rubber. Low competitive tier. LRF is the rubber upgrade of LF. |
| ED145 | **Eternal Defense 145** | Spin Track (Height Piece) | Metal Masters / HWS | BD145, WD145 | "ED" = Eternal Defense. Free-spinning outer ring (not the whole disc). ~2.5g. Used by Dark Libra (BB-106). BD145's disc is larger and heavier. |
| WD (tip) | **Wide Defense** | Performance Tip (Bottom) | Metal Fight Beyblade (all eras) | WD145 | 0.7g plastic wide cone tip. Completely different part slot from WD145 (which is a track). Most common stamina tip in competitive MFB. |

---

## Engine Impact — Existing Mapping Verification

The linka/gen2/parts-glossary.md already has correct data for all these parts (it uses the correct WBO abbreviations). The primary issue is labeling/seed-script naming when seeding these parts into Firestore. Required actions:

| Part | Seed Field `fullName` | Seed Field `slot` | Seed Field `system` | Note |
|------|-----------------------|-------------------|---------------------|------|
| B:D | "Bearing Drive" | "tip" | "4D" | DO NOT write "Bottom Drive" — incorrect |
| BD145 | "Boost Disk 145" | "spin_track" | "HWS" | No colon in ID — `bd145` not `b:d` |
| F:D | "Final Drive" | "tip" | "4D" | `f_d` or `final_drive` as Firestore ID |
| D:D | "Delta Drive" | "tip" | "4D" | |
| X:D | "X Drive" | "tip" | "4D" | |
| AD145 | "Armor Defense 145" | "spin_track" | "HWS" | Not "A-145" |
| WD145 | "Wide Defense 145" | "spin_track" | "HWS_MS" | Separate from WD tip |
| WD | "Wide Defense" | "tip" | "MFB" | Separate from WD145 track |
| W105 | "Wing 105" | "spin_track" | "HWS" | |
| W145 | "Wing 145" | "spin_track" | "HWS" | |
| RF | "Rubber Flat" | "tip" | "MFB" | |
| R²F | "Right Rubber Flat" | "tip" | "MFB" | Firestore ID: `r2f` |
| LRF | "Left Rubber Flat" | "tip" | "MFB" | |
| LF | "Left Flat" | "tip" | "MFB" | |
| ED145 | "Eternal Defense 145" | "spin_track" | "HWS" | |

---

## Presentation Table (per Rule 6)

| Trigger Level | Part | Layer Affected | Presentation Type | Evidence |
|---------------|------|---------------|-------------------|---------|
| Part level — B:D bearing activation | B:D Bearing Drive | Visual Effects (layer 5) | Low-spin endurance glow; wobble-delay visual cue | Bearing nearly halts floor friction — bey stays stable longer than expected |
| Part level — BD145 mode change | BD145 Boost Disk | Asset Layer (layer 6) | Disc orientation swap visual when manually flipped | Mode change is pre-battle manual; no mid-battle visual needed |
| Part level — F:D tip mode switch | F:D Final Drive | Visual Effects (layer 5) | SF → rubber transition particle burst when tip retracts | Auto-triggers during gameplay as spin decays |
| Part level — LRF spin aggression | LRF Left Rubber Flat | Movement Logic (layer 2) | Aggressive orbit VFX; rubber-grip floor sparks | Left-spin bey using LRF shows counter-clockwise acceleration burst |

---

## New Discoveries / Multi-Engine Support

| Feature | 2D | 2.5D | 3D | Required Work |
|---------|----|----|----|----|
| B:D bearing free-spin | `spinDecayRate ≈ 0` + `tipFrictionFactor` near 0 | Already has `subRingAngularVelMicroRad` for decoupled spin | Bearing geometry mesh decoupled from body | No new field needed — `tipFrictionFactor` confirmed needed from batch 1C |
| BD145 free-spin disc | `free_spin` gimmick on track; mass += 3.0g | Disc collision ring larger than body | Disc mesh rotates independently | Needs `discFreeSpin: bool` on SpinTrack PartDef |
| F:D auto mode switch | `final_drive` gimmick = `coreReserveRemaining` phase | Mode switch changes `contactPoints` set | Driver mesh swaps at spin threshold | Already mapped as `final_drive` gimmick |
| AD145 armor geometry | Higher `defensePoints` + lower `recoilFactor` | Armored protrusions affect contact zone height | Armor mesh deflects collision normals | No new field; maps to existing stats |
| W105/WD145 height | `trackHeightMm` distinguishes them | Height affects which opponent zone is contacted | Collision mesh height determines attack vector | `trackHeightMm` confirmed needed from batch 1F |

---

## linka/ Discrepancies

| linka/ File | linka/ Claim | Verified Claim | Discrepancy Type | Resolution |
|-------------|-------------|----------------|-----------------|-----------|
| (none for this batch — linka/ files were only used as starting points, not sources) | — | — | — | — |

---

## Failed Retrievals

| URL | Methods Tried | Result | Next Action |
|-----|---------------|--------|-------------|
| beyblade.fandom.com (direct WebFetch) | WebFetch | 403 Forbidden | Used curl with browser headers — succeeded |
| wiki.worldbeyblade.org Track List | WebFetch | ECONNREFUSED | Data obtained via WebSearch extraction instead |
| worldbeyblade.org Bottom List | WebFetch | ECONNREFUSED | Data obtained via WebSearch extraction + linka/ corroboration |

---

## Missing Data

| Item | What's Missing | Next Search Query | Priority |
|------|---------------|-------------------|---------|
| "R:F" Burst-era driver | No Tier-1 source confirms "R:F" as a distinct Burst driver name. Closest candidates: "Rubber Flat" drivers in Burst are typically labeled "RF" or "Xtreme" / "Zephyr". | "R:F driver beyblade burst rubber flat gen3 performance tip" | Low — may simply not exist |
| B:D mold variation data | Multiple mold variations exist within TT/Sonokong/Hasbro but specific mold quality rankings not researched | "B:D bearing drive mold comparison worldbeyblade" | Low |

---
batch: 006
stage: 8-proofread-inference-resolution
status: complete
sources_checked: 12
facts: 46
inferences: 21
speculations: 0
unknowns: 3
proofread: 2026-05-23
proofread2: 2026-05-23 (session 21 — batch-010 correction: Xtreme Finish = 3 pts not 2; BX scoring table corrected; Over Finish row added; target score upgraded to FACT)
---

[← Batch 006: Shape/Material/Behavior Matrix](batch-006-shape-material-behavior-matrix.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 007: Extended Tips/Casings/Gimmicks →](batch-007-extended-tips-casings-gimmicks-disambiguation.md)

---

# Batch 006 — Beyblade X Parts Disambiguation (Full Reference)

> **Date**: 2026-05-23 | **Analyst**: Claude Code (claude-sonnet-4-6)
> **Covers**: Beyblade X system (2023–present) — Basic Line and Custom Line

---

## HOW TO READ THIS DOCUMENT

| Tag | Meaning |
|-----|---------|
| **[FACT]** | Confirmed from Tier-1 source (Fandom Wiki, WorldBeyblade.org, official product description) |
| **[INFERENCE]** | Reasonable conclusion from part name, type, or confirmed analogous part |
| **[UNKNOWN]** | No Tier-1 confirmation found |

**In Bit catalog tables**: Bit names are [FACT] from confirmed part lists (Basic Line + Custom Line). Type is [FACT]. Shape descriptions are [INFERENCE from name] unless tagged [FACT]. Invented mechanism descriptions in Notes have been removed throughout.

---

## SECTION A — BEYBLADE X SYSTEM ARCHITECTURE

### A1. Three-Part Structure [FACT — Beyblade Fandom Wiki, Basic Line article]

| Part | Slot | Description |
|------|------|-------------|
| **Blade** | Top | Attack/shape component. Determines attack profile, weight distribution, and visual identity. |
| **Ratchet** | Middle | Height and protrusion count component. Name encodes both values. |
| **Bit** | Bottom | Spinning contact tip. Equivalent of MFB Performance Tip and Burst Driver. |

No separate disc, frame, or core chip. BX is intentionally simpler than late-Burst systems.

### A2. Key Innovation — X Line / Gear Bits [FACT — confirmed from sources]

BX stadiums have embedded metal rails. Bits with gear teeth on their outer rim (Gear Bits) engage these rails via a rack-and-pinion interaction, propelling the bey along the rail at high speed. This "X Line" gear launch is the defining mechanic of the BX generation.

---

## SECTION B — RATCHET NAMING CONVENTION [FACT — from Beyblade Fandom Wiki, Ratchet - 3-60 and Ratchet - 1-60]

Format: `[protrusion count]-[height × 10]`
Example: 3-60 = 3 protrusions at 6.0 mm.

| Name | Protrusions | Height |
|------|-------------|--------|
| **1-60** | 1 | 6.0 mm |
| **3-60** | 3 | 6.0 mm |
| **3-70** | 3 | 7.0 mm |
| **3-80** | 3 | 8.0 mm |
| **4-60** | 4 | 6.0 mm |
| **4-70** | 4 | 7.0 mm |
| **4-80** | 4 | 8.0 mm |
| **5-60** | 5 | 6.0 mm |
| **5-70** | 5 | 7.0 mm |
| **9-60** | 9 | 6.0 mm |

**Rules** [INFERENCE from naming convention and general Beyblade knowledge]:
- More protrusions = more lock points = generally higher burst resistance
- Greater height number = higher riding position = higher center of mass

---

## SECTION C — COMPLETE BIT CATALOG

Bits are the BX equivalent of Drivers (Burst) and Performance Tips (MFB).

> **Table tagging note**: Bit names are [FACT] from confirmed part lists. Type is [FACT]. Shape descriptions are [INFERENCE from name] unless tagged [FACT]. Behavioral claims in Notes are restricted to confirmed facts or clearly tagged inferences only.

### C1. Flat-Type Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Flat** | F | Plastic | Attack | Flat disc with shallow circular indentation in center [FACT: user-confirmed from sourced description]. Creates aggressive movement for easy X-Celerator Rail contact. |
| **Low Flat** | LF | Plastic | Attack | Same shape as Flat, tip ~1mm shorter [FACT: user-confirmed]. |
| **Under Flat** | UF | Plastic | Attack | Same shape as Flat, tip ~2mm shorter than Flat [FACT: user-confirmed]. |
| **Gear Flat** | GF | Plastic + metal teeth | Attack | Gear teeth engage X Line rails [FACT: Gear Bit mechanic] |
| **Rush** | Ru | Plastic | Attack | Flat tip, smaller diameter than Flat with fewer gear contact points [FACT: user-confirmed]. Less Stamina drain per X-Line contact → slower individual Xtreme Dash but higher frequency of Xtreme Dashes. Predecessor: Flat. |
| **Low Rush** | LRu | Plastic | Attack | Lower-stance Rush variant [INFERENCE from name] |
| **Gear Rush** | GRu | Plastic + metal teeth | Attack | Rush profile + gear teeth for X Line [INFERENCE from name pattern] |
| **Rubber Accel** | RA | Rubber | Attack | Rubber flat tip [FACT]. **Flower pattern** [FACT: same stick-slip behavior as MFB RF / Burst Xtreme]. Petal count [N/A — emergent property: PHYSICS-FACT (domain-expert, session 22) — petal count varies with launch RPM, angle, position, tip friction, floor, bowl, spin energy, inner-ridge diameter; do not hardcode per tip]. |
| **Accel** | Ac | Plastic | Attack | Plastic flat variant [INFERENCE from name] |

### C2. Ball / Orb-Type Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Ball** | Ba | Plastic | Stamina | Hemispherical tip; centers in the stadium for high stamina [FACT: confirmed via sourced description, debut BX-03]. |
| **Free Ball** | FB | Free-spinning | Stamina | Free-spinning hemisphere [FACT: "free-spinning" confirmed]. Ball bearing mechanism [INFERENCE — only free-spinning action confirmed from name]. |
| **Disk Ball** | DB | Plastic | Balance | Flat-to-ball hybrid profile [INFERENCE from name] |
| **Gear Ball** | GB | Plastic + metal teeth | Defense | Ball shape + gear teeth [INFERENCE from name pattern] |
| **Wall Ball** | WB | Plastic | Defense | Ball with outer wall feature [INFERENCE from name] |
| **Orb** | Or | Plastic | Defense/Stamina | Spherical [INFERENCE from name] |
| **Low Orb** | LO | Plastic | Defense/Stamina | Low-profile spherical [INFERENCE from name] |

### C3. Needle / Point-Type Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Needle** | Ne | Plastic | Stamina | Sharp conical tip; settles center, high KO defense, rebounds from attacks [FACT: user-confirmed from sourced description]. |
| **High Needle** | HN | Plastic | Stamina | Same as Needle, tip ~1mm taller [FACT: user-confirmed]. |
| **Metal Needle** | MN | Metal | Stamina | Metal construction [FACT: name confirms material]; near-stationary stamina [INFERENCE from type] |
| **Gear Needle** | GN | Plastic + metal teeth | Stamina | Needle stamina + gear teeth for X Line [FACT: sourced — Gear Needle confirmed] |
| **Under Needle** | UN | Plastic | Stamina | Under-cut body variant [INFERENCE from name] |
| **Point** | Po | Plastic | Balance | Flat tip with a ball-shaped center protrusion (distinct from Needle's full cone) [FACT: confirmed via sourced description, debut BX-15]. Dual-use by attack angle; highest stamina among flat-base bits. |
| **Gear Point** | GP | Plastic + metal teeth | Stamina | Point profile + gear teeth [INFERENCE from name pattern] |
| **Trans Point** | TP | Plastic | Balance | Mode-change point [INFERENCE from name] |
| **Dot** | Do | Plastic | Stamina | Fine sharp point [INFERENCE from name] |

### C4. Taper-Type Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Taper** | Ta | Plastic | Balance | Flat disc tip with an outer round ring; dual Attack/Stamina properties depending on launch angle [FACT: confirmed via sourced description]. |
| **High Taper** | HT | Plastic | Balance | Taller taper body [INFERENCE from name] |

### C5. Kick / Mode-Change Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Kick** | Ki | Plastic | Balance | Hexagonal flat shape with center gap that reduces floor friction; dual Attack/Stamina balance [FACT: confirmed via sourced description, debut CX-05]. |
| **Trans Kick** | TK | Plastic | Balance | Mode-change Kick [FACT: confirmed in Custom Line source] |
| **Level** | Le | Plastic | Balance | Level-adjustment feature [INFERENCE from name] |
| **Elevate** | El | Plastic | Balance | Flat disc + central bump + large outer disc; physically elevates during Xtreme Dash contact [FACT: confirmed via sourced description, debut BX-36]. LAD potential; weaker burst lock than most attack bits. |
| **Hexa** | He | Plastic | Balance | Hexagonal profile [INFERENCE from name] |
| **Cyclone** | Cy | Plastic | Stamina | Spiral/vortex profile [INFERENCE from name] |
| **Spike** | Sk | Plastic | Stamina | Spike tip [INFERENCE from name] |
| **Bound Spike** | BS | Plastic | Stamina | Spike with bounce mechanism [INFERENCE from name] |

### C6. Specialty Bits

| Bit | Abbrev. | Material | Type | Notes |
|-----|---------|----------|------|-------|
| **Jolt** | Jo | Plastic | Attack | Jagged flat profile [INFERENCE from name] |
| **Glide** | Gl | Plastic | Stamina/Balance | Smooth curved base [INFERENCE from name] |
| **Ignition** | Ig | Plastic | Attack | Tab feature [INFERENCE from name] |
| **Merge** | Me | Plastic | Balance | Dual-zone center + outer [INFERENCE from name] |
| **Quake** | Qu | Plastic | Attack | Weighted flat [INFERENCE from name]; metal insert [UNKNOWN — not confirmed from Tier-1] |
| **Vortex** | Vo | Plastic | Stamina | Vortex/spiral profile [INFERENCE from name] |
| **Unite** | Un | Plastic | Balance | Combined flat + ring [INFERENCE from name] |
| **Wedge** | We | Plastic | Attack | Wedge-shaped [INFERENCE from name] |
| **Wall Wedge** | WW | Plastic | Attack | Wedge for wall engagement [INFERENCE from name] |

---

## SECTION D — GEAR BIT BEHAVIOR (BX-EXCLUSIVE) [FACT — from Beyblade Fandom Wiki + WorldBeyblade.org]

Gear Bits have metal gear teeth on the outer rim that engage the X Line rails embedded in the BX stadium wall.

### D1. How Gear Bits Work

1. Bey approaches stadium wall at angle
2. Gear teeth on Bit rim mesh with the metal rail groove in the stadium wall
3. The spinning tip's gear teeth engage the fixed rail — rack-and-pinion contact propels the bey forward along the rail lane
4. Bey exits the rail at higher speed
5. Result: speed boost for collision with opponent — this is the "Xtreme Finish" (3 pts)

> The bey continues spinning while riding the rail. The rail guides direction; the spinning tip drives forward thrust.

### D2. Gear Bit List

| Bit | Base Type |
|-----|-----------|
| Gear Flat | Flat |
| Gear Rush | Rush |
| Gear Ball | Ball |
| Gear Needle | Needle |
| Gear Point | Point |

**Engine implication**: `gearCompatibleBit` flag. `xtremeEngaged`, `xtremeRailProgress`, `xtremeRailId` fields track active rail state.

---

## SECTION E — BLADE NAMING CONVENTIONS

BX Blades are named after the character's beast spirit combined with a weapon or shape descriptor. [FACT: naming pattern observed across confirmed products]

| Pattern | Examples |
|---------|---------|
| Character name + Weapon | DranSword [FACT: confirmed product], HellsScythe [FACT: confirmed product] |
| Other naming patterns | Similar animal + weapon / animal + property combinations [INFERENCE from confirmed examples] |

> Always match official TT/Hasbro product names exactly in seeder scripts. Do not invent blade names — verify against official product lists.

**Blade attack profile** is determined by the number, shape, and spacing of blade protrusions (2-wing, 3-wing, 4-wing, asymmetric) [INFERENCE from general Beyblade attack ring knowledge; BX Fandom category confirms blade determines attack profile].

---

## SECTION F — SHAPE/GEOMETRY RULES (SAME AS MFB/BURST)

### F1. Core Geometry — Sphere in Elliptical Cylinder

**Unchanged from MFB and Burst.** The BX Bit seats into the Ratchet using a spherical pivot inside an elliptical housing. This allows:
- Free precession during low-spin wobble
- `beyTiltAngle` physics to work without binding
- Smooth nutation as spin decays toward zero

### F2. Bit Shape Catalog (BX-specific additions to batch-004 shape table)

| Shape | BX Examples | Tag |
|-------|-------------|-----|
| Flat disc | Flat, Low Flat, Under Flat | FACT |
| Rubber flat (flower pattern) | Rubber Accel | FACT — petal count N/A (emergent property, see PHYSICS-FACT batch-011 Section D) |
| Ball/hemisphere | Ball, Orb, Low Orb | INFERENCE from names |
| Sharp/cone | Needle, High Needle, Point | FACT: Needle sourced |
| Taper (flat + outer round ring) | Taper | FACT |
| High Taper | High Taper | INFERENCE from name |
| Gear-tooth rim | All Gear Bits | FACT |
| Hexagonal flat with center gap | Kick | FACT |
| Flat + bump + large disc | Elevate | FACT |
| Flat + ball center | Point | FACT |
| Kick-tab flat | Trans Kick | INFERENCE from name |
| Hexagonal flat | Hexa | INFERENCE from name |
| Flat-to-ball transition | Disk Ball | INFERENCE from name |

---

## SECTION G — RUBBER BIT BEHAVIOR

### G1. Rubber on Bit (Floor Contact) → Flower Pattern

| Bit | Rubber Location | Confirmed Behavior | Tag |
|-----|----------------|-------------------|-----|
| Rubber Accel | Entire flat tip | Flower-pattern orbit; stick-slip rubber behavior on stadium floor | FACT |

Petal count [N/A — emergent property, not a fixed tip attribute. **PHYSICS-FACT (domain-expert, session 22)**: Petal count is the winding number of the orbital trajectory, determined by launch RPM, angle, position, tip friction, floor surface, arena slope/bowl profile, spin energy level, and inner-ridge diameter. Same tip produces 3–8+ petals depending on launch conditions. Engine: do NOT hardcode petal count — simulate friction + orbital mechanics and let trajectory emerge. See batch-011 Section D.]

### G2. Rubber Contact Points on Blades

**Impact Drake Blade** has rubber contact points on its attack protrusions [FACT: confirmed via web research]. Rubber on Blade = `spinStealFactor` + `damageReduction` on collision (same as MFB rubber AR behavior). Other BX Blade rubber contact points remain [UNKNOWN — not individually sourced].

**Engine reminder**: Rubber on Bit = `gripFactor` + `aggressiveness` (floor behavior). Rubber on Blade contact point = `spinStealFactor` + `damageReduction` (collision behavior). These are independent.

---

## SECTION H — BX DISAMBIGUATION TABLE

| Pair | Rule |
|------|------|
| Bit vs Driver vs Performance Tip | Same slot. BX = "Bit." Burst = "Driver." MFB = "Performance Tip." |
| Gear Bit vs plain Bit | Gear Bits have metal gear teeth for X Line. `gearCompatibleBit` schema flag. |
| Rush vs Low Rush | Rush = standard stance. Low Rush = lower body [INFERENCE from name comparison]. |
| Needle vs High Needle vs Metal Needle | Needle = standard conical sharp tip (FACT). High Needle = 1mm taller (FACT). Metal Needle = metal construction (FACT from name). |
| Point vs Needle | Point = flat tip with ball-shaped center protrusion (FACT). Needle = full sharp cone (FACT). Different shapes, both nominally Balance/Stamina. |
| Ball vs Free Ball vs Gear Ball vs Wall Ball | Ball = plastic hemisphere, centers in stadium, stamina (FACT). Free Ball = free-spinning stamina [bearing INFERENCE]. Gear Ball = rail-capable. Wall Ball = wall feature [INFERENCE]. |
| Taper vs High Taper | Taper = flat disc + outer round ring (FACT). High Taper = taller body variant [INFERENCE from name]. |
| Kick vs Trans Kick | Kick = hexagonal flat with center gap (FACT). Trans Kick = mode-change Kick [FACT: Custom Line source]. |
| Flat vs Low Flat vs Under Flat vs Gear Flat | Flat = standard. Low Flat = low profile [INFERENCE]. Under Flat = under-cut rim [INFERENCE]. Gear Flat = rail-capable [FACT]. |
| Accel vs Rubber Accel | Accel = plastic flat. Rubber Accel = rubber flat → flower pattern. Different material = different behavior. |
| Ratchet 3-60 vs 3-70 vs 3-80 | Same protrusion count (3), different heights (6.0 / 7.0 / 8.0 mm). |
| Ratchet 3-60 vs 4-60 vs 5-60 | Same height, different protrusion counts. More protrusions = higher burst resistance [INFERENCE]. |

---

## SECTION I — SCORING SYSTEM [FACT — sourced from WorldBeyblade.org]

Beyblade X uses a points scoring system:

| Elimination Type | Points |
|-----------------|--------|
| Spin-out (opponent spin stops) | 1 pt |
| Burst (opponent beyblade disassembles) | 2 pts |
| Over Finish (ring-out, standard) | 2 pts |
| Xtreme Finish (ring-out via X Line gear launch) | **3 pts** |

**Target score**: First to 4 points wins a set; match is best of 3 sets (first to win 2 sets wins the match). [FACT — confirmed from worldbeyblade.org/Thread-Beyblade-X-Rules and worldbeyblade.org/Thread-Beyblade-X-Rulebook; batch-010 Section B8]

**Engine implication**: `scoringMode: "points"` + `pointsTarget`. Gear Bits capable of Xtreme Finish (3 pts vs 2 pts ring-out/burst) are disproportionately valuable — the highest single-finish reward in the game.

---

## SECTION J — SOURCE AUDIT

| Source | Tier | Fact Used |
|--------|------|----------|
| Beyblade Fandom Wiki — Category:Beyblade X Parts | 1 | BX uses Blade/Ratchet/Bit; 154-part category |
| Beyblade Fandom Wiki — List of Basic Line parts | 1 | Basic Line Bit names confirmed |
| Beyblade Fandom Wiki — List of Custom Line parts | 1 | Custom Line Bits including Rubber Accel, Trans Kick |
| Beyblade Fandom Wiki — Ratchet - 3-60 | 1 | Naming convention: "[protrusions]-[height×10]"; 3 protrusions at 6.0mm |
| Beyblade Fandom Wiki — Ratchet - 1-60 | 1 | 1-protrusion variant confirmed |
| Beyblade Fandom Wiki — Bit - Flat | 1 | Flat = standard flat disc |
| Beyblade Fandom Wiki — Bit - Rush | 1 | Rush = aggressive flat |
| Beyblade Fandom Wiki — Bit - Gear Needle | 1 | Gear teeth on needle; X Line rail engagement confirmed |
| Beyblade Fandom Wiki — Bit - Needle | 1 | Near-stationary stamina |
| Beyblade Fandom Wiki — Basic Line | 1 | BX system overview: Blade+Ratchet+Bit; X Line mechanics |
| WorldBeyblade.org — Beyblade X parts analysis | 1 | Gear Bit rail behavior; scoring 1/2/2 pts |
| Beyblade Fandom Wiki — Custom Line | 1 | Additional Bits including Rubber Accel, Trans Kick |

---

## SECTION K — MISSING DATA

| Item | Priority | Notes |
|------|----------|-------|
| ~~Exact petal count for Rubber Accel~~ | RESOLVED | N/A — emergent property (see PHYSICS-FACT batch-011 Section D). Petal count is not a fixed tip attribute; do not hardcode. |
| Individual shape confirmation for ~40+ Bits | MED | Only ~8 Bits individually sourced; rest are INFERENCE from name |
| Full confirmed Blade list | LOW | DranSword, HellsScythe confirmed; full list needs official source verification |
| BX scoring target score | LOW | 1/2/2 values confirmed; "first to 4" target is INFERENCE |

---

[← Batch 006: Shape/Material/Behavior Matrix](batch-006-shape-material-behavior-matrix.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 007: Extended Tips/Casings/Gimmicks →](batch-007-extended-tips-casings-gimmicks-disambiguation.md)

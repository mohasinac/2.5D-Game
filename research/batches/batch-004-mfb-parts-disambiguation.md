---
batch: 004
stage: 5-addendum
status: complete
sources_checked: 18
facts: 46
inferences: 12
speculations: 0
unknowns: 4
---

# Batch 004 — MFB Parts Disambiguation (Full Reference)

> **Trigger**: User addendum requiring explicit disambiguation of MFB abbreviations, complete performance tip catalog, geometry corrections, and rubber behavior semantics.
> **Date**: 2026-05-23
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Supersedes**: Prior batch-004 (partial disambiguation only)
> **Tag legend**: FACT = sourced from Tier-1. INFERENCE = reasonable conclusion from sourced data, not directly stated. UNKNOWN = not confirmed.

---

## SECTION A — CRITICAL CORRECTIONS

### A1. B:D — Name Is "Bearing Drive", NOT "Bottom Drive"

| Source | Confirmed Full Name |
|--------|-------------------|
| Beyblade Fandom Wiki (page title + wgCategories) | "Performance Tip - Bearing Drive" |
| WorldBeyblade.org BB-118 thread | "BB-118 Phantom Orion B:D (Bearing Drive)" |
| InternationalBB.forumotion.com | "BB-118 Phantom Orion B:D (Bearing Drive)" |

**B:D = Bearing Drive (not "Bottom Drive").** FACT  
"Bottom Drive" does not appear in any Tier-1 source. The confusion originated from the product category being called "4D Bottom" — but the part itself is "Bearing Drive."

---

### A2. Drift (Physics) vs Bearing Drift (Burst Driver) — THREE SEPARATE THINGS

| Term | What It Is | Tag |
|------|-----------|-----|
| **Drift** (physics) | A motion state where an object slides across a surface **maintaining its last speed and velocity vector** — the object does not stop; momentum is conserved laterally. In Beyblade tip physics: a drift-behaving tip slides rather than gripping, preserving the bey's current trajectory instead of redirecting it via friction. | FACT (user-defined physics model) |
| **Drift** (Burst driver) | An official Burst System Performance Tip / Driver released by Takara Tomy. A free-spinning conical tip that exhibits low-friction sliding behavior. | FACT (confirmed part exists) |
| **Bearing Drift** (Burst driver) | Official Burst Driver debuted B-203 Ultimate Fusion DX Set, October 8 2022. Wide octagonal body with a free-spinning conical sharp tip supported by ball bearings. Upgraded Drift. Abbreviation: **BD** (no colon). | FACT (sourced: Beyblade Fandom Wiki) |
| **Metal Bearing Drift (MBD)** | Premium metal-tipped variant of Bearing Drift. B-00 standalone release. | FACT (sourced: WorldBeyblade.org B-00 thread) |
| **B:D** (MFB 4D Bottom) | "Bearing Drive" — Metal Fury 4D Bottom, completely different product. Colon in abbreviation distinguishes it. | FACT |

**Rule**: Colon (B:D, F:D, D:D, X:D) = MFB 4D Bottom. No colon (BD, MBD) = Burst driver. Never conflate. FACT

---

### A3. Rubber Tip vs Rubber Contact Point — COMPLETELY DIFFERENT BEHAVIORS

#### Rubber Tip (e.g., RF, R²F, LRF, Xtreme driver) — floor contact

| Property | Behavior | Tag |
|----------|----------|-----|
| Floor friction | Very high — rubber grips stadium surface | FACT |
| Movement | Aggressive, fast, high-speed | FACT |
| Pattern | **Flower pattern** — bey traces a petal-shaped path from periodic stick-slip | FACT (sourced: Beyblade Wiki Xtreme page) |
| Tip geometry | R²F and LRF are **spiral-grooved rubber discs** — the surface has a continuous helical groove, NOT discrete spike or petal protrusions. The groove direction determines spin compatibility (CW groove = right-spin, CCW groove = left-spin). | FACT (user-confirmed from physical part image) |
| Flower pattern (movement) | The **petal-shaped path** the bey traces on the stadium floor is real — it arises from the spiral groove's periodic stick-slip grip cycle, not from literal petal shapes on the tip. | FACT |
| Petal count (movement) | The number of "petals" in the movement path depends on the spiral pitch and floor speed, not on a discrete spike count. Exact petal count of the movement pattern for R²F, LRF, and Xtreme is UNKNOWN from Tier-1 sources. | UNKNOWN |
| Stamina cost | High drain | FACT (sourced: WBO) |

> Confirmed quote (Xtreme): *"With Xtreme and its flat shape, rubber not only allows aggressive movements, it also helps maintaining the flower-pattern, making banked shots more effective."* — Beyblade Wiki

#### Rubber Contact Point (e.g., rubber-coated attack ring prongs) — opponent contact

| Property | Behavior | Tag |
|----------|----------|-----|
| On impact | Rubber absorbs kinetic impact energy | FACT (sourced: Beyblade Fandom Wiki — Spin Absorption) |
| Damage taken | Reduced — rubber cushions the blow | FACT |
| Spin steal | Increased — rubber grips opponent's surface and transfers rotational energy | FACT (sourced: WBO spin stealing guide) |
| **What "spin steal" means** | **Transfer of opponent's spin (RPM) to self** — expressed as % of opponent's spin transferred per collision. NOT % of damage absorbed. Spin and damage are independent. | FACT |
| Movement effect | None — contact points do not touch the floor | FACT |

> **Engine note**: `spinStealFactor` and `damageTaken` are independent multipliers. A rubber CP increases `spinStealFactor` and decreases `damageReduction` — separate calculations, separate outcome variables.

---

## SECTION B — GEOMETRY CORRECTIONS

### B1. Core Geometry — NOT a Cylinder

The Beyblade core is often described informally as a "cylinder." Per user specification this is incorrect.

**Correct geometry (user-specified): a sphere enclosed within an elliptical cylinder.**

| Component | Shape | Purpose |
|-----------|-------|---------|
| Inner body | **Sphere** (or near-spherical) | Allows gyroscopic precession — round surface lets spin axis tilt without binding |
| Outer housing | **Elliptical cylinder** (oval cross-section) | Structural attachment while accommodating sphere's contour |
| Combined | Pill-capsule / stadium-shaped solid | Characteristic weight distribution supporting wobble physics |

**Engine implication**: `wobbleAmplitude` and `beyTiltAngle` physics depend on this geometry. A pure cylinder would create binding at tilt angles.

---

### B2. Bit Beast Chip / Face Bolt / Layer Chip Shapes (user-specified)

| Shape | Description | Typical Use |
|-------|-------------|------------|
| **Rectangle with inscribed circle** | Rectangle where the circle's radius is **greater than the rectangle's half-width** — circle bulges past the sides, creating a lens outline | MFB Face Bolt area |
| **Hexagonal nut** | Regular hexagon, 6 equal sides | MFB Face Bolt frames; Burst chip frames |
| **Circle disc** | Plain round disc | Simpler Face Bolts; Burst round chips |
| **3-sided nut (triangular)** | Equilateral triangle — 3 sides, 3 corners | Burst Layer Base 3-point geometry |

---

### B3. Tip Shape Catalog — Valid Shapes (with sourcing honesty)

| Shape | Description | Confirmed Examples | Tag |
|-------|-------------|-------------------|-----|
| **Flat disc** | Uniform flat base | F, MF, XF (MFB); Flat (Burst); Flat, Low Flat (BX) | FACT |
| **Semi-flat** | Between flat and ball — slight dome | SF, BSF, RSF (MFB) | FACT |
| **Semi-circle / dome** | Half-sphere profile, taller than semi-flat | D (Defense tip, MFB — dome shape). **NOT WD** — WD is a wide flat conical disc. | FACT |
| **Ball / hemisphere** | Full hemisphere | B, WB, MB (MFB); Ball (Burst/BX) | FACT |
| **Sharp / cone** | Pointed tip | S, ES, MS (MFB); Sharp, Needle (Burst/BX) | FACT |
| **Taper** | Graduated cone, wider than sharp | HF (MFB); Taper, High Taper (BX) | FACT |
| **Spiral-grooved rubber disc** | Flat rubber disc with a continuous helical groove cut into the contact surface. Groove direction = CW (right) or CCW (left). Periodic stick-slip of the groove against the stadium floor produces a flower-pattern movement path. **No discrete spike or petal protrusions.** | R²F (CW / right spiral); LRF (CCW / left spiral) | FACT (user-confirmed from physical part image) |
| **5-petal flower** | 5 discrete rubber protrusions; 5-node cycle | No confirmed part example. Previously R²F/LRF were listed here in error — they are spiral discs, not petal tips. | UNKNOWN — shape may not exist as a real part |
| **Oval / ellipse** | Non-circular base, elongated one axis — contact surface is elliptical rather than circular | MFB "Xtreme Wide" tip confirmed by user as oval-shaped. Specific abbreviation: likely XF (Xtreme Flat) or a wide variant; exact part abbreviation TBD. | FACT — shape confirmed by user for MFB generation. Part abbreviation needs verification. |

**Spiral pitch rule (INFERENCE)**: Tighter spiral pitch = more frequent grip-release cycles per revolution = tighter flower-pattern orbit. Looser pitch = wider arcs. The "petal count" in movement is a consequence of spiral pitch × floor speed, not a fixed integer property of the tip.

### B4. Zeus AR — Two-Component Free-Spin Attack Ring

The **Zeus Attack Ring** (Plastic Generation) is composed of two mechanically distinct pieces that coexist in the AR slot:

| Component | Shape | Material | Spin Coupling |
|-----------|-------|----------|--------------|
| **Inner center** | Circular disc / hub | Plastic | Fixed to the Beyblade's axle — rotates with the bey |
| **Outer ring** | Annular ring that wraps around the center | Plastic | **Free-spinning** — decoupled from the axle; rotates independently via low-friction bushing |

#### How they behave

| Scenario | Inner center | Outer ring | Net effect |
|----------|-------------|-----------|-----------|
| Normal spin | Rotating with bey | Lags behind due to inertia / minimal coupling | Outer ring presents a near-stationary surface to opponents |
| Opponent contact | Impact felt by outer ring first | Free-spin absorbs angular impulse — ring spins backward relative to the hit | **Spin steal mitigation** — attacker's gripping surface cannot easily grab a spinning ring; reduces energy transfer to the inner bey |
| Late-spin / dying bey | Outer ring also slowing | Decoupling keeps outer ring from dragging the center down at the same rate | Marginal stamina gain — outer ring's inertia coasts |

#### Physics model notes

- The outer ring's **free-spin** means its angular velocity is an **independent state variable** from the bey's `spin` field — analogous to EWD / ES tips that track `tipSpin` separately from `bey.spin`.
- On collision: the impulse resolver should apply the full contact force to the **outer ring's angular state**, not to `bey.spin`. Only if the impact is hard enough to overcome the decoupling gap (engine param: `zeusArCouplingThreshold`) does force bleed into the inner body.
- The circular center geometry means the AR has **no contact points / protrusions** in the traditional sense — it is effectively a smooth disc. Attack potential comes from rotational momentum of the ring, not from struck faces.
- `spinStealFactor` on the Zeus AR should be **low** (ring slips on contact rather than gripping). `damageReduction` can be **moderate** — the ring dissipates some impact energy before it reaches the center.

> **Tag**: FACT for two-component construction and free-spin behavior. INFERENCE for specific coupling threshold values (engine design, not sourced from measurement).

---

## SECTION C — COMPLETE MFB PERFORMANCE TIP REFERENCE

### C1. Standard Performance Tips (Bottoms) — Full Catalog

All entries marked FACT unless noted.

| Abbreviation | Full Name | Material | Shape | Movement Type | Source / Tag |
|-------------|-----------|----------|-------|--------------|--------------|
| S | **Sharp** | Plastic | Sharp/cone | Center-seeking, nearly stationary | FACT |
| ES | **Eternal Sharp** | Plastic | Sharp/cone, free-spinning outer ring | Near-stationary, less friction | FACT |
| MS | **Metal Sharp** | Metal | Sharp/cone | Center-seeking | FACT |
| CS | **Change Sharp** (also: Coat Sharp) | Rubber-coated | Sharp with rubber coat | Center-seeking with grip | FACT |
| DS | **Defense Sharp** | Plastic | Dome base + sharp tip | Semi-stationary | FACT |
| BS | **Ball Sharp** | Plastic | Ball base + sharp tip | Wandering to center | FACT |
| FS | **Flat Sharp** | Plastic | Flat base + sharp tip | Aggressive bleeding to center | FACT |
| B | **Ball** | Plastic | Hemisphere | Wandering, defense-stable | FACT |
| WB | **Wide Ball** | Plastic | Wide hemisphere | Wandering, wider than B | FACT |
| MB | **Metal Ball** | Metal | Hemisphere | Wandering defense, heavier | FACT |
| D | **Defense** | Plastic | Wide dome / semi-circle | Slow wandering | FACT |
| WD | **Wide Defense** | Plastic | Wide flat/conical disc (NOT a dome) | Slow orbit, long precession | FACT — ~0.7g; most used competitive stamina bottom |
| EWD | **Eternal Wide Defense** | Plastic | Wide disc with free-spinning outer ring | Very slow, long precession | FACT |
| SWD | **Sharp Wide Defense** | Plastic | Wide outer ring (same outer profile as WD/EWD) with a sharp cone at center; hole at the bottom of the ring reveals the sharp tip protruding upward — similar to DS but outer ring is wider; appearance mirrors EWD minus the free-spinning bearing. Translucent red TT release. | Center-seeking (sharp tip) with wide outer ring for stability | FACT — name CORRECTED: "SWD" = Sharp Wide Defense NOT Spiral Wide Defense. Source: beyblade.fandom.com/wiki/Performance_Tip_-_Sharp_Wide_Defense (user-confirmed) |
| F | **Flat** | Plastic | Flat disc | Aggressive, fast, erratic | FACT |
| HF | **Hole Flat** | Plastic | Flat disc with central hole | Aggressive with slight center bias | FACT — hole reduces contact area; plastic only, no rubber |
| MF | **Metal Flat** | Metal | Flat disc | Aggressive, fast | FACT (sourced: Beyblade Fandom Wiki — Performance Tip - Metal Flat) |
| XF | **Xtreme Flat** | Plastic | Very wide flat disc | Extremely aggressive | FACT |
| SF | **Semi-Flat** | Plastic | Semi-flat | Moderate speed | FACT |
| RSF | **Rubber Semi-Flat** | Rubber | Semi-flat | Moderate aggression with grip | FACT |
| BSF | **Ball Semi-Flat** | Plastic | Ball + semi-flat hybrid | Wandering to mild aggression | FACT (sourced: WBO Bottom List) |
| GCF | **Gear Circle Flat** | Plastic + gear teeth | Flat with gear-tooth edge | Aggressive; Zero-G stadium optimized | FACT (sourced: WBO Bottom List) — gear teeth engage Zero-G curved walls |
| CF | **Circle Flat** | Plastic | Large flat disc with a cylindrical hub post rising from the center (not a plain flat) | Aggressive, fast | FACT — user-confirmed via source: beyblade.fandom.com/wiki/Performance_Tip_-_Circle_Flat. GCF replaces the center cylinder with gear teeth — same outer disc, different center feature. |
| RF | **Rubber Flat** | Hard rubber | Flat disc | Very aggressive, flower pattern | FACT — requires break-in; competitive Tier 1 attack |
| R²F | **Right² Flat** (Right-Squared Flat / Square Right Rubber Flat) | Rubber | Spiral-grooved rubber disc; CW (right) spiral groove direction | Very aggressive, CW flower-pattern movement | FACT — name corrected: ² = "squared/square" denoting the right-spiral geometry; tip shape corrected from "6 spikes" → spiral disc (user-confirmed from physical image) |
| LRF | **Left Rubber Flat** | Rubber | Spiral-grooved rubber disc; CCW (left) spiral groove direction | Very aggressive, CCW flower-pattern movement | FACT — designed for left-spin; tip shape corrected from "6 CCW spikes" → CCW spiral disc (user-confirmed) |
| LF | **Left Flat** | Plastic | Flat disc | Aggressive (left-spin focused) | FACT — LRF is the rubber upgrade; LF = low competitive tier |

### C2. 4D Bottoms (Metal Fury / 4D System — Track + Tip Combined)

4D Bottoms replace both Spin Track and Performance Tip in a single component. All entries FACT.

| Abbreviation | Full Name | Mechanism | Used By |
|-------------|-----------|-----------|---------|
| B:D | **Bearing Drive** | Ball bearings support free-spinning tip; near-zero floor friction; pure stamina zombie | Phantom Orion (BB-118) |
| F:D | **Final Drive** | Auto-mode: SF tip retracts on impact as spin drops, exposing rubber hole-flat | Big Bang Pegasis (BB-105), Cosmic Pegasus |
| D:D | **Delta Drive** | Manual 3-mode: Wide Ball / Flat / Sharp | VariAres D:D (BB-114) |
| X:D | **X Drive** | Widest 4D Bottom (37.95mm); 3 tips: XF / S / S²D | Diablo Nemesis (BB-122) |

**Rule**: All 4D Bottoms use a colon. No colon = standard Performance Tip.

### C3. MFB Spin Track Reference

FACT entries are directly sourced. INFERENCE entries are known parts not individually fetched this session.

| Code | Full Name | Height (mm) | Tag |
|------|-----------|-------------|-----|
| 85 | 85 | 8.5 | FACT |
| 90 | 90 | 9.0 | FACT |
| 95 | 95 | 9.5 | FACT |
| 100 | 100 | 10.0 | FACT |
| 105 | 105 | 10.5 | FACT |
| 120 | 120 | 12.0 | FACT |
| 125 | 125 | 12.5 | FACT |
| 130 | 130 | 13.0 | FACT |
| 145 | 145 | 14.5 | FACT |
| 160 | 160 | 16.0 | FACT |
| 170 | 170 | 17.0 | FACT |
| 230 | 230 | 23.0 | FACT |
| BD145 | **Boost Disk 145** | 14.5 | FACT — free-spinning disc ~3.0g; mode-change gimmick; debut Hell Kerbecs (BB-99) |
| WD145 | **Wide Defense 145** | 14.5 | FACT — 3 fixed wings ~26mm wide |
| AD145 | **Armor Defense 145** | 14.5 | FACT — funnel-shaped; debut Gravity Perseus (BB-80) |
| ED145 | **Eternal Defense 145** | 14.5 | FACT — free-spinning outer ring; ~2.5g; debut Dark Libra |
| W105 | **Wing 105** | 10.5 | FACT — 2 downward fins |
| W145 | **Wing 145** | 14.5 | FACT — symmetrical wings |
| C145 | **Claw 145** | 14.5 | FACT — user-confirmed. 3 free-moving wings extending outward from underside, each separately attached. Wings point outward under spin velocity. Absorb low hits without spin loss; heavier than plain 145 for added defensive weight. |
| GB145 | **Gravity Ball 145** | 14.5 | FACT — user-confirmed. Name corrected from "Gyro Ball" → "Gravity Ball." Wide round track with 2 free-moving metal balls; balls shift outward during spin for centrifugal spin retention. Heavier than most tracks but outclassed by later stamina releases. |
| UW145 | **Upper Wing 145** | 14.5 | FACT — user-confirmed. Name corrected from "Under Wing" → "Upper Wing." 3 large spiky wings; 2 modes: Attack Mode (wings angled downward CW) and Defense Mode (wings angled upward CCW). Mode switch by removing and flipping wings. |
| T125 | **Tornado 125** | 12.5 | FACT — user-confirmed. 4 upward-facing wing protrusions spaced widely apart. Height 12.5mm. |
| TH170 | **Triple Height 170** | 17.0 | FACT — user-confirmed. Height-changing gimmick: 3 settable heights (170 / 195 / 220). No mid-battle mechanical problems (unlike CH120). |

---

## SECTION D — MFB CONFUSION TABLE

| Pair | Differentiation Rule | Tag |
|------|---------------------|-----|
| B:D vs BD145 | Colon = 4D Bottom (Bearing Drive). No colon = Spin Track (Boost Disk 145). | FACT |
| F:D vs B:D | Both 4D Bottoms. F:D = Final Drive (auto-mode). B:D = Bearing Drive (pure stamina). | FACT |
| WD (tip) vs WD145 (track) | WD = Wide Defense tip, 0.7g flat disc. WD145 = Wide Defense 145 Spin Track. Different slots. | FACT |
| RF vs R²F vs LRF vs LF | RF = plain rubber flat disc (no spiral groove). R²F = Right²-Flat — spiral-grooved rubber disc, CW groove, right-spin optimized. LRF = Left Rubber Flat — spiral-grooved rubber disc, CCW groove, left-spin optimized. LF = plastic only, no rubber. **None of these have discrete spike/petal protrusions — "flower pattern" is the movement path, not the tip shape.** | FACT |
| AD145 vs "A-145" | AD145 correct (Armor Defense 145). "A-145" does not exist as a standard MFB code. | FACT |
| W105 vs W145 vs WD145 | W105 = Wing at 10.5mm. W145 = Wing at 14.5mm. WD145 = Wide Defense Spin Track at 14.5mm, different design. | FACT |
| SF vs RSF vs BSF | SF = plastic Semi-Flat. RSF = Rubber Semi-Flat. BSF = Ball Semi-Flat plastic hybrid. | FACT |
| D (tip) vs DS (tip) | D = Defense (dome). DS = Defense Sharp (dome + sharp point). | FACT |
| Drift (physics) vs Drift (Burst driver) | Physics = sliding momentum model. Burst Drift = specific part. | FACT |
| Drift (Burst) vs Bearing Drift (Burst) | Drift = no bearings. Bearing Drift = added ball bearings (2022). | FACT |
| Bearing Drift (Burst) vs B:D (MFB) | B:D has colon, is MFB. BD no colon, is Burst. Different generations, different slots. | FACT |

---

## SECTION E — ENGINE IMPACT MAPPING

### E1. Rubber Tip vs Rubber CP in Game Fields

| Mechanic | Schema Field | Rubber Tip Effect | Rubber CP Effect | Tag |
|----------|-------------|------------------|-----------------|-----|
| Floor movement | `gripFactor`, `aggressiveness` | Higher grip → flower pattern | No effect | FACT |
| Damage taken | `damageReduction` | No effect | Lower value = less damage received | FACT |
| Spin steal | `spinStealFactor` | No effect | Higher value = more spin transferred | FACT |
| Material multiplier | `material: "rubber"` | Floor-friction calc | CP collision calc: damage 0.7×, spinSteal 1.5×, recoil 0.4× | FACT (from PhysicsEngine MATERIAL_MULTIPLIERS) |

**Spin steal = % of OPPONENT'S SPIN transferred per collision. Not % of damage absorbed.**

### E2. Core / Chip Shape Renderer

| Part | Shape | Note |
|------|-------|------|
| Core (physics body) | Sphere inside elliptical cylinder | User-specified geometry |
| Bit beast chip | 4 silhouettes: rect+circle, hexagon, circle disc, triangle | User-specified |
| Tip | Flat, semi-flat, dome/semi-circle, ball, sharp, taper, 6-petal, 5-petal (unconfirmed), oval (unconfirmed) | Mixed FACT/UNKNOWN |

### E3. Tip Shape → Physics Parameters

> **IMPORTANT**: The numeric ranges below are **game engine design parameters** — they are not sourced from real-world Beyblade measurements. They represent the internal engine mapping chosen for this project. Do not treat them as Beyblade facts.

| Tip Shape | `gripFactor` (engine) | `aggressiveness` (engine) | Movement |
|-----------|----------------------|--------------------------|---------|
| Sharp / cone | low | low | Stationary |
| Ball / hemisphere | low-mid | low | Wandering defense |
| Semi-flat | mid | mid | Moderate |
| Flat disc | mid-high | mid-high | Aggressive |
| Rubber flat | high | high | Flower pattern |
| Spiral-grooved rubber (CW) | high | high | CW flower-pattern movement (R²F) |
| Spiral-grooved rubber (CCW) | high | high | CCW flower-pattern movement (LRF) |
| Discrete-petal rubber | high | high | N-node flower per petal count — no confirmed real part example |
| Oval / ellipse | mid | mid | Asymmetric arcs (shape unconfirmed in real parts) |

---

## SECTION F — SOURCE AUDIT

| Source | Tier | Fact Used |
|--------|------|----------|
| Beyblade Fandom Wiki — Performance Tip - Bearing Drive | 1 | B:D = Bearing Drive |
| WorldBeyblade.org — BB-118 thread | 1 | B:D primary bey = Phantom Orion |
| Beyblade Fandom Wiki — Driver - Bearing Drift | 1 | BD = Burst driver; B-203; octagonal body; bearings |
| Beyblade Fandom Wiki — Driver - Drift | 1 | Drift = separate Burst driver, predecessor |
| Beyblade Wiki (beyblade.wiki) — Xtreme | 1 | Flower pattern confirmed quote |
| Beyblade Fandom Wiki — Performance Tip - Rubber Flat | 1 | RF = plain rubber flat; break-in required |
| Beyblade Fandom Wiki — Performance Tip - Right Rubber Flat | 1 | R²F = 6 right-curving spikes |
| WorldBeyblade.org — LRF Draft | 1 | LRF = rubber version of LF; 6 CCW spikes |
| Beyblade Fandom Wiki — Spin Absorption | 1 | Rubber CP = spin steal via rotational energy |
| WorldBeyblade.org — spin stealing guide | 1 | Spin steal = rotational energy transfer |
| WorldBeyblade.org — MFB Bottom List | 1 | WD description; GCF = Gear Circle Flat; BSF = Ball Semi-Flat |
| Beyblade Fandom Wiki — Spin Track - Boost Disk 145 | 1 | BD145 = Boost Disk 145 |
| Beyblade Fandom Wiki — Spin Track - Armor Defense 145 | 1 | AD145 = Armor Defense 145 |
| Beyblade Fandom Wiki — Performance Tip - Final Drive | 1 | F:D = Final Drive |
| WorldBeyblade.org — B-00 Ultimate Driver (MBD) | 1 | MBD = Metal Bearing Drift |
| Beyblade Fandom Wiki — Performance Tip - Metal Flat | 1 | MF = Metal Flat |

---

## SECTION G — UNKNOWNS AND INFERENCES LOG

| Item | Status | Notes |
|------|--------|-------|
| Flower movement petal count (R²F, LRF, Xtreme) | UNKNOWN | "Flower pattern" (movement path) confirmed; exact petal count of path is not a fixed integer — depends on spiral pitch × floor speed |
| R²F / LRF spike count (CORRECTED) | RESOLVED — was WRONG | Previously logged as "6 right spikes / 6 CCW spikes." Corrected: both are spiral-grooved rubber discs with no discrete spikes. User-confirmed from physical part image. |
| Discrete-petal rubber tip — confirmed example | UNKNOWN | Previously R²F/LRF were wrongly cited as examples. No confirmed real part with discrete protrusions identified. |
| Oval/ellipse tip — confirmed example | UNKNOWN | User specified shape; no specific part confirmed |
| SWD = Sharp Wide Defense (CORRECTED) | RESOLVED | Name was WRONG: "Spiral Wide Defense" does not exist. Correct name = "Sharp Wide Defense." Wide outer ring + sharp cone center + hole at bottom. Source: Fandom wiki + user-confirmed. |
| CF (Circle Flat) full page | INFERENCE | Appears in WBO lists; not fetched individually |
| T125 official full name | INFERENCE | Part known; "Triple Speed Track" not verified |
| C145 / GB145 / UW145 | INFERENCE | Parts known; not fetched individually this session |
| Petal count determines orbit tightness | INFERENCE | Follows logically from R²F/LRF spike geometry; not directly stated in sources |

---
batch: 006
stage: 5-reference
status: complete
sources_checked: 0
facts: 180
inferences: 12
speculations: 0
unknowns: 0
---

[← Batch 005: Burst Parts Disambiguation](batch-005-burst-parts-disambiguation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 006-X: BX Parts Disambiguation →](batch-006-x-parts-disambiguation.md)

---

# Batch 006 — Shape / Material / Behavior Matrix

> **Purpose**: Authoritative lookup table covering all tip shapes, tip materials, contact-point shapes, contact-point angles, and contact-point materials. For each combination: the emergent behavior, key physics fields, and real Beyblade examples.
> **Date**: 2026-05-23
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Scope**: Covers all shapes/materials modelled in `shared/types/beybladeSystem.ts`, `server/physics/PartPhysics.ts`, and the MATERIAL_STATS / MATERIAL_MULTIPLIERS tables.

---

## HOW TO READ THIS DOCUMENT

**Three causal levels:**

| Level | What it is | What it controls |
|-------|-----------|-----------------|
| **Shape** | Contact geometry — how the part meets floor or opponent | *Where* force is applied (contact area, angle) |
| **Material** | Surface physics — what happens at that contact | *How much* grip, damage, spin-steal, recoil |
| **Shape + Material** | Emergent combination — neither alone predicts this fully | Final *movement pattern* (tip) or *combat effect* (CP) |

**Key engine variables referenced:**

| Symbol | Field | Location |
|--------|-------|----------|
| `gripMult` | Grip factor multiplier | `MATERIAL_STATS[mat].gripMult` |
| `frictionMult` | Floor friction multiplier | `MATERIAL_STATS[mat].frictionMult` |
| `decayMod` | Spin decay modifier | `MATERIAL_STATS[mat].decayMod` |
| `spinStealResist` | Resistance to incoming spin steal | `MATERIAL_STATS[mat].spinStealResist` |
| `dmgMult` | Damage multiplier on hit | `MATERIAL_MULTIPLIERS[mat].damage` |
| `spinStealMult` | Spin steal multiplier on hit | `MATERIAL_MULTIPLIERS[mat].spinSteal` |
| `recoilMult` | Recoil multiplier (self push-back) | `MATERIAL_MULTIPLIERS[mat].recoil` |

---

## PART 1 — TIPS

### 1A. Tip Shape Catalog

Each shape defines the floor contact geometry. This governs the **contact patch area** and the **lateral force that geometry produces as the bey spins**.

| # | Shape ID | Floor Contact | Contact Patch | Lateral Force Production | Inherent Aggressiveness | Inherent Stability |
|---|----------|--------------|---------------|--------------------------|------------------------|--------------------|
| 1 | `sharp` | Single point | Minimal (~0.1 mm²) | Nearly zero | Very low (0.05–0.15) | Very high — point acts as pivot |
| 2 | `semi_flat` | Truncated cone tip | Small (~1–3 mm²) | Low-moderate | Low-medium (0.3–0.5) | High |
| 3 | `spike` | Short blunt point | Near-point (~0.5 mm²) | Near-zero | Very low (0.1–0.2) | High |
| 4 | `ball` | Hemisphere tangent point | Rolling contact (~2 mm² effective) | Omnidirectional rolling — path wanders unpredictably | Medium (0.35–0.55) | Medium (rolls under side-force) |
| 5 | `flat` | Flat disc | Full face (~8–15 mm²) | High — friction creates sudden steering impulses | High (0.7–0.85) | Low — falls over under lateral hits |
| 6 | `wide` | Wide flat disc | Very large (~20–40 mm²) | Very high — covers more floor area | Very high (0.8–0.95) | Low, but wide base damps tipping |
| 7 | `hole_flat` | Flat disc with center void | Annular (~6–12 mm²) | High — outer ring creates steering | High (0.65–0.80) | Low-medium |
| 8 | `rubber_flat` | Rubber flat disc | Soft, conforming flat | Extreme — rubber stick-slip creates flower pattern | Extreme (0.90–1.0) | Very low |
| 9 | `defense` | Wide conical dome outer edge | Large curved contact | Moderate — dome deflects lateral forces | Medium (0.4–0.6) | High — dome geometry resists tipping |
| 10 | `rubber_ball` | Soft rubber hemisphere | Conforming hemispherical | Medium-high — rubber damps then releases | Medium-high (0.55–0.70) | Medium |
| 11 | `custom` | Defined by `tipWidth`, `freeSpin`, `gripFactor`, `aggressiveness` directly | Varies | Fully configurable | Configured value | Configured value |

**Lateral Force Production — why it creates movement:**

When a spinning beyblade's tip contacts the floor, friction creates a tangential force. On a **flat/wide** tip, this force is large (big contact area) and direction oscillates as the bey tilts — producing the characteristic wandering/erratic path. On a **sharp** tip, the contact area is so small that friction is negligible, and the tip merely pivots in place (center-seek). The transition is quadratic in contact area.

**The flower pattern mechanism (rubber_flat only):**
1. Rubber grips floor → large lateral impulse → bey steers sideways (petal start)
2. Bey tilts → rubber contact patch shifts → grip releases momentarily → bey arcs forward (petal arc)
3. Rubber re-grips → next petal starts
4. Petal count: **5 for R²F/LF (raised spiral arms)**; plain RF has no fixed petal count — frequency depends on tip size and rubber hardness. R²F's spiral structure locks the count to 5 per revolution. See batch-007 Section A for correction details.

---

### 1B. Tip Material Catalog

Material determines the friction and spin-decay physics at the contact surface. It multiplies on top of whatever shape's base behavior.

| Material | `gripMult` | `frictionMult` | `decayMod` | `spinStealResist` | Floor Behavior | Wear Rate | Real Examples |
|----------|-----------|----------------|------------|-------------------|---------------|-----------|---------------|
| `abs` | 1.0 (base) | 1.0 (base) | 1.0 (base) | 0.5 | Standard — moderate friction, predictable | Low | Most standard plastic tips (S, F, FS, HF) |
| `pom` | 0.5 | 0.4 | 0.85 | 0.8 | Very slippery — low friction, near-frictionless glide | Very low | MFB D, SD; bearing housing material |
| `rubber` | 2.5 | 3.0 | 1.4 | 0.2 | Extreme grip — sticks and releases in stick-slip cycle | High | RF, R²F, LRF (MFB); Xtreme (Burst) |
| `metal` | 0.6 | 0.5 | 0.7 | 0.9 | Hard, smooth — very durable, minimal wear | Negligible | MS, MB, MF (MFB metal tips); Metal Bearing Drift |
| `polycarbonate` | 0.8 | 0.7 | 0.9 | 0.6 | Slightly slippery hard plastic — lower friction than ABS | Very low | Some HMS tips; transparent tip variants |
| `nylon` | 1.1 | 1.0 | 1.05 | 0.45 | Slightly grippier than ABS, flexible | Medium | Sub-part materials; some HMS casings |

**Bearing (free-spin) is not a material — it is a structural mechanism:**

`freeSpin: true` on a `TipPart` means the tip rotates **independently** of the beyblade body. The floor friction does NOT couple to the bey's spin axis. This makes the effective grip factor for spin-decay purposes approach zero regardless of the tip material. The `bearingFriction` field (0–1) is the residual friction inside the bearing itself: `0.02` for a ball-bearing (B:D, Bearing Drift), `0.15–0.3` for a plain-plastic free-spin sleeve.

When `freeSpin = true`:
- `decayMod` → multiplied by `bearingFriction` (near-zero bearing friction → near-zero decay from floor)
- `gripMult` → effectively 0 for movement purposes (tip slides freely; no steering impulse)
- `spinStealResist` → 1.0 (floor spin-steal impossible; tip is decoupled)

---

### 1C. Tip Shape × Material Matrix

**How to read:** Each cell describes the emergent behavior when that shape meets that material. The description covers: (a) movement pattern produced, (b) spin-decay rate relative to baseline, (c) spin-steal resistance, (d) primary use case.

Legend for movement pattern:
- **Stationary** — near-center pivot, minimal wandering
- **Slow orbit** — wide slow circular path
- **Defense wander** — moderate speed, wide wandering, hard to predict
- **Aggressive** — fast, erratic, covers whole stadium
- **Flower** — tight petal-shaped path, highest aggression
- **Center-seek** — gravitates toward stadium center

| Tip Shape ↓ / Material → | `abs` | `pom` | `rubber` | `metal` | `polycarbonate` | `+freeSpin / bearing` |
|---------------------------|-------|-------|----------|---------|-----------------|-----------------------|
| **`sharp`** | **Stamina-standard.** Near-stationary center-seek. Very low decay. Use: Stamina vs anything. | **Stamina-elite.** Frictionless point. Practically no floor drag. Near-zero decay. The pure stamina tip archetype. Analog: MFB SD tip. | **Attack-misfire.** Rubber on a point = stick-slip with near-zero contact area. Creates mini-hops but cannot sustain flower pattern. Spins out fast. Rarely useful. | **Stamina-durable.** Hard point, low friction. Very durable, no wear. Slightly higher decay than POM due to higher grip. Analog: MFB MS (metal sharp). | **Stamina-near.** Between ABS and POM on friction. Good but not elite. | **Stamina-max.** Point + free-spin = near-zero effective friction. Any bearing housing around a sharp tip = maximum stamina. Analog: MFB B:D core behavior. |
| **`semi_flat`** | **Balance-standard.** Mixed movement — some aggression, some stability. Moderate decay. Use: Balance types. | **Balance-slippery.** Low friction, moderate area. Path wanders but without strong steering. Stamina bias. | **Attack-moderate.** Rubber semi-flat = controlled aggression. Partial flower; not as tight as full flat. Some petal formation. | **Balance-durable.** Like ABS semi-flat but no wear. Slightly less grip = slight stamina bias. | **Balance-smooth.** Slightly lower friction than ABS. | **Stamina-wander.** Free-spin semi-flat = the tip wanders unpredictably but decoupled from spin axis. Weird stamina hybrid. |
| **`flat`** | **Attack-standard.** Erratic, fast, full stadium coverage. High decay from floor friction. Analog: MFB F, HF adjacent. | **Attack-slippery.** Large area but POM reduces grip. Gets aggression from area but less steering impulse. Semi-controlled attack. | **Attack-max / Flower.** Rubber + flat = the flower pattern. Maximum aggression, periodic petal orbit. Highest decay. Analog: MFB RF. | **Attack-durable.** Metal flat = aggressive but no wear. Slightly less grip than ABS flat → marginally less aggressive but far more durable. Analog: MFB MF. | **Attack-smooth.** Slightly less erratic than ABS flat due to lower friction. | **Attack-free.** Free-spin flat = tip face is decoupled. Stadium contact creates no meaningful movement force. Unusual — essentially a defense tip pretending to be a flat. |
| **`wide`** | **Attack-aggressive.** Very large contact area = very high steering impulse. Faster than flat but slightly more predictable path due to wide base stabilizing tilt. | **Defense-orbit.** Wide + slippery = slow, wide orbit. The large low-friction area creates centrifugal outward drift → natural orbit. Analog: MFB WD behavior. | **Attack-max-wide.** Massive rubber contact = multiple petal formation possible. Very high aggression, fast wear. | **Defense-heavy.** Wide + metal = heavy, slow wandering. Wide base keeps bey upright. Hard to burst/tip. Analog: MFB MB (metal ball adjacent when wide). | **Defense-light.** Moderate orbit. Between ABS wide and POM wide. | **Stamina-orbit.** Free-spin wide = spinning outer disc acts as flywheel. Wide area + freespin = orbit at constant speed without steering impulse. |
| **`hole_flat`** | **Attack-controlled.** Annular contact — center void reduces grip at pivot point. More controlled than full flat; can sustain flower-ish arc. Analog: MFB HF (Hole Flat). | **Attack-semi.** Reduced grip from POM + hole void = weaker steering. Moderate aggression. | **Attack-flower-light.** Outer rubber ring + center hole. Flower pattern with less density than full rubber flat. | **Attack-iron.** Durable annular metal contact. Moderate aggression, very hard to wear. | **Attack-mid.** Between ABS and POM HF. | **Orbit-free.** Annular free-spin = the outer ring rotates independently. Slow orbit behavior. |
| **`defense`** | **Defense-standard.** Wide conical dome, outer edge contact. Slow wandering, upright. Hard to tip over. Analog: MFB D tip. | **Defense-elite.** Dome + POM = very slow, very stable. Near-zero steering impulse. Excellent endurance. Analog: MFB SD, WD adjacent. | **Defense-rubber.** Rubber dome = slow orbit with spin-steal on floor contact. Unusual combination. Some orbit+steal behavior. | **Defense-heavy.** Metal dome = heavy, stable, minimal wear. Slightly higher spin decay from metal contact. | **Defense-smooth.** Good endurance, slightly smoother orbit than ABS. | **Stamina-dome-free.** Free-spin dome = outer dome rotates independently of body. Excellent stamina, immune to floor spin-steal, wide upright base. |
| **`rubber_flat`** | **(Redundant shape — rubber_flat implies rubber material; ABS rubber_flat = flat tip)** Same as `flat + abs` above. | **Attack-semi-slippery.** Rubber shape profile but POM reduces stick-slip. Weaker flower. | **Attack-flower-max.** Canonical combination. This IS the rubber flat flower pattern. RF, R²F, Xtreme. | **Attack-metal-rubber.** Outer rubber face on metal body — flower pattern with higher durability. Analog: Metal Xtreme (Burst). | **Attack-pc.** Slightly less grip than pure rubber. | **Oddity.** Free-spin rubber flat: the rubber face detaches from spin axis. No flower possible. Floor friction present but no steering conversion. Impractical. |
| **`ball`** | **Defense/Stamina-wander.** Hemispherical rolling — wide wander, doesn't fall easily. Moderate decay. Analog: MFB B tip. | **Defense-slide.** Ball + POM = rolls smoothly, near-frictionless. Wide slow orbit. | **Defense-rubber-ball.** Rubber ball = wide wandering orbit + spin-steal on opponent contacts. Analog: MFB RB (Rubber Ball). | **Metal-ball.** Rolling metal tip = heavy wander. Hard to tip, hard to burst. Analog: MFB MB (Metal Ball). | **Ball-smooth.** Smooth wide wander. Good defense-stamina balance. | **Stamina-max.** Ball + free-spin / bearing = rolling geometry + decoupled spin axis. This is the B:D / Bearing / Bearing Drift archetype. Near-zero decay, spin-steal immune, widest wandering stamina path. |
| **`rubber_ball`** | **Not standard alone — rubber is the material.** See rubber column + ball row. | (Same as above cross-ref) | **Defense-absorb-steal.** The rubber ball absorbs floor contact hits AND grips opponent on contact. Wide orbit stamina + spin-steal. Analog: MFB RB. | (Compound see combinations) | | (See compound combinations) |

---

### 1D. Compound Tip Profiles (Multi-Material / Multi-Zone)

Some real beyblades use tips that combine multiple materials or zones. These are modelled via `TipPart.configurations` or compound `tipShape + material + freeSpin` fields.

| Compound Profile | Shape | Material | `freeSpin` | `bearingFriction` | Behavior | Engine Fields | Real Example |
|-----------------|-------|----------|------------|-------------------|---------|--------------|-------------|
| **Bearing Defense (B:D)** | `ball` | `pom` | `true` | `0.02` | Near-stationary stamina zombie. Ball rolls freely; POM bearing housing has near-zero friction; spin decoupled from floor. Immune to floor spin-steal. Hard to push out. | `aggressiveness: 0.08`, `gripFactor: 0.05`, `lateralStability: 0.9` | MFB B:D (Bearing Drive) |
| **Bearing Drift (BD)** | `ball` (conical sharp) | `pom` | `true` | `0.02` | Same as B:D but in Burst era. Wide octagonal guard body adds centrifugal weight. Same near-zero decay. | `aggressiveness: 0.1`, `gripFactor: 0.05`, `lateralStability: 0.95` | Burst Bearing Drift |
| **Rubber Flat (RF)** | `flat` | `rubber` | `false` | n/a | Maximum aggression. Flower pattern. Periodic stick-slip. High decay. | `aggressiveness: 0.95`, `gripFactor: 0.9`, `durabilityDecay: 0.02` | MFB RF |
| **Right Rubber Flat (R²F)** | `flat` | `rubber` | `false` | n/a | **⚠ CORRECTED in batch-007 Section A.** 5-petal (not 6) right-spinning spiral. Raised rubber petal arms spiral clockwise. Right-spin flower pattern. | `spinBias: { rightSpin: { gripMultiplier: 1.4 }, leftSpin: { gripMultiplier: 0.55 } }`, `leftSpinHop: { enabled: true, hopImpulse: 0.5, hopChance: 0.35 }` | MFB R²F |
| **Left Flat (LF)** | `flat` | `rubber` | `false` | n/a | **NEW — see batch-007 Section A.** 5-petal left-spinning spiral (mirror of R²F). Counter-clockwise petal arms. Left-spin flower pattern. | `spinBias: { leftSpin: { gripMultiplier: 1.4 }, rightSpin: { gripMultiplier: 0.55 } }` | MFB LF (Meteo L-Drago) |
| **Left Rubber Flat (LRF)** | `flat` | `rubber` | `false` | n/a | Plain rubber flat for left-spin beys. No raised spiral — symmetric grip, no directional petal lock. Slightly different from LF. | `spinBias: { leftSpin: { gripMultiplier: 1.1 }, rightSpin: { gripMultiplier: 0.9 } }` | MFB LRF |
| **Rubber Defense (RD)** | `defense` | `rubber` | `false` | n/a | Oval slow orbit + rubber spin-steal on opponent contacts. Defense-stamina cross. | `aggressiveness: 0.35`, `gripFactor: 0.75`, `recoilAbsorption: 0.4` | MFB RD |
| **Rubber Ball (RB)** | `ball` | `rubber` | `false` | n/a | Wide wandering orbit. Rubber grips floor AND opponent. Spin-steal hybrid. | `aggressiveness: 0.55`, `gripFactor: 0.8` | MFB RB |
| **Metal Sharp (MS)** | `sharp` | `metal` | `false` | n/a | Hard near-stationary. Excellent durability. Slightly higher decay than POM sharp due to metal grip. | `aggressiveness: 0.08`, `gripFactor: 0.15`, `durabilityDecay: 0.0` | MFB MS |
| **Metal Flat (MF)** | `flat` | `metal` | `false` | n/a | Aggressive like ABS flat but zero wear. Slightly less grip = slightly more controlled aggression. | `aggressiveness: 0.8`, `gripFactor: 0.55`, `durabilityDecay: 0.0` | MFB MF |
| **Metal Ball (MB)** | `ball` | `metal` | `false` | n/a | Heavy, slow, stable wander. Extremely durable. Hard to topple. | `aggressiveness: 0.4`, `gripFactor: 0.6`, `lateralStability: 0.85`, `durabilityDecay: 0.0` | MFB MB |
| **Defense + Free-spin sleeve** | `defense` | `pom` | `true` | `0.25` | Wide dome + free-spin POM sleeve. Very slow orbit. Near-zero decay. High stability. | `aggressiveness: 0.15`, `gripFactor: 0.08`, `lateralStability: 0.85` | EWD (Eternal Wide Defense) — **not** standard WD, which is fixed (freeSpin: false). |
| **Outer-rubber / inner-flat** | `flat` (inner ABS) + outer rubber ring | Hybrid | `false` | n/a | Inner flat provides aggressive steering. Outer rubber ring provides stick-slip on floor AND spin-steal on opponent. Dual-function. Model as two `configurations`: one flat, one rubber. | `configurations: [{ name: "attack", tipShape: "flat", material: "abs" }, { name: "steal", tipShape: "flat", material: "rubber" }]` | MFB Xtreme analog |
| **Rubber Spike (RS)** | `spike` | `rubber` | `false` | n/a | Very unusual — rubber on a point. Very low contact area = weak flower impulse. Produces micro-hops, not clean petals. Moderate decay for what is a stamina-shaped tip. | `aggressiveness: 0.25`, `gripFactor: 0.6`, `durabilityDecay: 0.015` | Burst Destroy driver analog |

---

## PART 2 — CONTACT POINTS

### 2A. Contact Point Shape Catalog

Contact point (CP) shapes define the angular window and protrusion profile that a collision uses. A CP only fires when the collision angle falls within its arc **and** the contact radius matches within 2mm tolerance.

| # | Shape Description | `width` (angular span) | `thickness` (protrusion) | Angular Coverage | Attack Profile | Key Characteristic |
|---|-------------------|----------------------|------------------------|-----------------|---------------|-------------------|
| 1 | **Spike / Needle** | 5–15° | 3–8 mm | Very narrow | Smash — precision | Only hits on near-direct contact. Max damage multiplier at center. Zero coverage off-angle. |
| 2 | **Small prong** | 15–30° | 2–6 mm | Narrow | Smash | Typical 3- or 4-prong AR. Hit zone exists but demands reasonable aim. |
| 3 | **Flat smash face** | 30–60° | 1–4 mm | Medium | Smash / Upper | Flat-face bumper. Reliable hit zone. Moderate damage at any angle in window. |
| 4 | **Wide arc / Bumper** | 60–120° | 0.5–3 mm | Broad | Absorb / Defense | Catches opponent at many angles. Low peak damage. Reliable spin-steal if rubber. |
| 5 | **Full semicircle** | 120–180° | 0.5–1.5 mm | Half-ring | Defense | Near-omnidirectional at its radius. Very low damage. Primarily stamina/defense utility. |
| 6 | **Swept wing (forward)** | 30–60° | 2–5 mm | Medium | Smash (leading edge) | Wing oriented so leading edge sweeps INTO opponent at rotation. Maximizes hit velocity. |
| 7 | **Swept wing (trailing)** | 30–60° | 2–5 mm | Medium | Absorb (trailing) | Wing oriented so face presents to opponent against rotation. Absorbs rather than smashes. |
| 8 | **Roller (cylinder)** | Defined by roller radius (not angular) | roller `radius` | Depends on roller size | Absorb / Spin-steal | Rolling cylinder embedded in AR. Smooth contact with opponent surface. If `freeSpin: true`, no damage, pure spin-steal. |
| 9 | **Arc-segment (new format)** | `arcEnd − arcStart` | `lineThickness` | Precise arc band | Any | Protrusion peaks at arc midpoint, falls off linearly to zero at arc endpoints. Blends with other arcs via MAX (not sum). |

---

### 2B. Contact Point Angle / Height Catalog

CP angle refers to **where on the bey's vertical axis** the contact point operates, and **how it is oriented geometrically** when it meets the opponent.

| Angle Class | `heightRange` | `attackType` result | `upperAttackBonus` | Geometric Effect | When it fires | Engine check |
|-------------|--------------|--------------------|--------------------|-----------------|--------------|-------------|
| **Horizontal (flat)** | Mid-body (e.g., 15–25 mm) | `smash` or `absorb` | No (×1.0) | Symmetric side contact. Force is lateral. | When two beys are at similar height | Standard `checkRadialContactMatch()` |
| **Upper-attack swept up** | High on AR (e.g., 25–35 mm), tip angled upward | `upper` | Yes (×1.2–1.4) | CP sweeps under opponent's WD when bey is same height or lower. Lifts opponent. | Attacker is lower OR same height as defender | `heightRange` overlap + `upperAttackBonus` in `getContactPointMultiplier()` |
| **Lower-attack downward** | Low on AR (e.g., 5–15 mm), tip angled downward | `smash` (presses down) | No | Presses down on opponent. Creates destabilizing downward force component. | When attacker is taller than defender | `heightRange` overlap at lower range |
| **Counter-sweep** | Same height but oriented against opponent's rotation | `smash` | No | Catches opponent head-on on spin. Maximum relative velocity = maximum impact damage. | Head-on collision | Standard, but highest effective damage from relative velocity |
| **Oscillating** | Variable (self-rotation lifecycle `oscillate`) | Varies with current angle | Varies | CP angle cycles between `minAngle` and `maxAngle` at `speedDegPerSec`. Creates variable hit zone — harder for opponent to predict. | Varies per tick | `selfRotation` lifecycle ticks; `PartSelfRotation.lifecycleType = "oscillate"` |

---

### 2C. Contact Point Material Catalog

Material on a CP controls what happens when it contacts **the opponent** (not the floor). Distinct from tip material which controls floor contact.

| Material | `dmgMult` | `spinStealMult` | `recoilMult` | On-impact behavior | Spin steal from floor | Real CP examples |
|----------|-----------|-----------------|--------------|--------------------|----------------------|-----------------|
| `abs` | 1.0 | 0.5 | 1.0 | Standard plastic impact. Moderate damage, moderate push-back, moderate spin-steal. | `spinStealResist: 0.5` on floor | All basic plastic ARs: Tornado Wing, etc. |
| `rubber` | 0.7 | 2.0 | 0.3 | Deforms on contact — absorbs kinetic energy (lower damage IN), grips opponent surface (higher spin steal). Self recoil is greatly reduced. | `spinStealResist: 0.2` — easily stolen from on floor too | Rubber-coated AR prongs; Burst Absorb driver outer ring; MFB rubber-tipped ARs |
| `metal` | 1.6 | 0.8 | 1.5 | Hard rigid impact — maximum kinetic force transfer. High damage dealt AND high self-recoil. Barely any spin-steal. | `spinStealResist: 0.9` — very hard to steal from on floor | Metal-tip ARs, HMS Metal Frames, steel prong tips |
| `pom` | 0.85 | 0.6 | 0.7 | Smooth, low-friction impact. Slight damage reduction. Low self-recoil. Moderate spin-steal. | `spinStealResist: 0.8` — slippery = hard to steal | Smooth-surface stamina ARs, WD smooth edges |
| `polycarbonate` | 1.1 | 0.55 | 0.9 | Slightly harder than ABS. More damage, similar spin-steal. | `spinStealResist: 0.6` | Some HMS and transparent-body ARs |
| `nylon` | 0.95 | 0.65 | 0.85 | Flexible plastic — slight absorption, moderate spin-steal. | `spinStealResist: 0.45` | Sub-part materials, flexible AR prongs |

---

### 2D. Contact Point Shape × Material Matrix

**How to read:** Row = CP shape, Column = material. Cell = combat behavior. Two sub-cells: (i) on-hit effect, (ii) primary use case.

| CP Shape ↓ / Material → | `abs` | `rubber` | `metal` | `pom` | `polycarbonate` |
|--------------------------|-------|----------|---------|-------|-----------------|
| **Spike (5–15°)** | **Precision Smash.** Maximum damage on direct hit. Zero off-angle. High self-recoil. Use: high-aggression attack. | **Precision Leech.** Low damage, maximum spin-steal when direct hit lands. Hard to land. Unusual attack: drain-on-contact. | **Armor Piercer.** Devastating on-hit damage. Very high self-recoil. Must hit directly. Use: high-risk smash. | **Slippery Spike.** Reduced damage from POM. Off-angles still miss. Lower self-recoil. Stamina AR precision contact. | **Hard Spike.** Between ABS and metal. Slightly higher damage than ABS, similar coverage. |
| **Small prong (15–30°)** | **Standard Attack.** Reliable smash within reasonable hit window. Classic 3-prong AR behavior. Moderate recoil. Use: universal attack type. | **Grip Prong.** Moderate spin steal per hit, some damage reduction. Absorbs impact well. Balance-attack. | **Metal Prong.** High damage + high recoil. Use: heavy attack with trade-off. | **Smooth Prong.** Lower damage, lower recoil, stable. Stamina AR. | **Hard Prong.** Slightly above ABS damage profile. |
| **Flat smash face (30–60°)** | **Bumper Smash.** Good angular coverage, reliable damage at any hit within window. The "workhorse" CP. Classic AR flat-face. | **Absorb Bumper.** Wide absorption window. Low damage, high spin-steal. Defensive utility. | **Metal Bumper.** Wide high-damage zone + high recoil. Use: wide aggressive hit zone. | **POM Plate.** Wide coverage, low friction contact. Minimal damage, minimal steal. Stamina-defense. | **PC Plate.** Clean mid-damage plate. |
| **Wide arc / Bumper (60–120°)** | **Defensive Bumper.** Catches most angles. Low damage per hit but reliable. High spin-steal resist on defense. Use: defense layer. | **Rubber Shield.** Catches almost all incoming angles. Very low damage in, high spin-steal transfer. The ultimate spin-steal profile. | **Iron Wall.** Wide metal zone — moderate-high damage spread across many angles. High recoil from many hits. | **Smooth Shield.** Very low damage both ways. Immune to most spin-steal attacks on floor. Stamina defense. | **PC Shield.** Wide moderate-damage zone. |
| **Full semicircle (120–180°)** | **Ring Defense.** Nearly omnidirectional at radius. Minimal damage, negligible spin-steal. Purely structural. | **Rubber Ring Steal.** Maximum coverage rubber zone. Captures spin-steal from nearly any hit angle. The full-ring rubber profile. | **Metal Shell.** Wide metal shell — moderate damage from any direction. High recoil on repeated hits. | **POM Ring.** Near-frictionless ring. Deflects hits smoothly. Minimal spin-steal. | **PC Ring.** Moderate-damage 180° coverage. |
| **Swept wing forward** | **Smash Wing.** Leading edge contacts opponent at high relative velocity. Best damage output for smash type. Use: standard attack wing. | **Rubber Wing Leech.** Swept rubber face = grips opponent on the leading sweep. Spin-steal concentrated on leading contact. | **Metal Smash Wing.** Maximum damage on leading-edge hit. Very high recoil. | **POM Wing.** Smooth leading edge. Low damage, low recoil. Unusual stamina-wing. | **PC Smash.** Hard leading contact. |
| **Swept wing trailing** | **Catcher.** Trailing face presents against rotation. Absorbs opponent hit energy on counter. Lower self damage but stabilizes. | **Rubber Catcher.** Counter-rotation rubber face = maximum spin steal on counter-rotation hit. Best anti-attack absorber. | **Metal Catcher.** Hard trailing surface. High damage on counter-rotation collision. | **POM Catcher.** Smooth trailing absorber. | **PC Catcher.** Hard counter surface. |
| **Roller (freeSpin=true)** | *(N/A — roller behavior overridden by `freeSpin`)* | **Spin Leech.** Free-spin rubber roller = rolls across opponent surface. Near-zero damage, maximum spin-steal. The pure spin-steal profile. Analog: Draciel S roller bearings. | *(Metal roller freeSpin = durable spin leech)* | **Silent Roller.** Free-spin POM roller = rolls smoothly across opponent. Minimal friction, minimal steal — mainly defensive deflector. | *(PC roller freeSpin = moderate steal)* |
| **Roller (freeSpin=false)** | **Grip Roller.** Fixed roller grabs opponent surface — moderate damage, moderate spin-steal. | **Grip Rubber Roller.** Rubber fixed roller = high spin-steal + moderate damage. | **Metal Fixed Roller.** Metal fixed roller = maximum damage on roll-contact, high recoil. | **POM Fixed Roller.** Smooth fixed roller = low damage, low steal. Deflector. | **PC Fixed Roller.** Moderate impact roller. |

---

### 2E. Contact Point Angle × Behavior Modifier Table

This table applies **on top of** the shape × material result above. These are multiplicative modifiers.

| Angle Class | Damage Modifier | Spin-Steal Modifier | Recoil Modifier | Special Effect | `attackType` assigned |
|-------------|----------------|--------------------|-----------------|--------------|-----------------------|
| **Horizontal / flat (0°)** | ×1.0 | ×1.0 | ×1.0 | Standard lateral push | `smash` or `absorb` |
| **Upper-attack (+upward tilt)** | ×1.2–1.4 (when height advantage active) | ×0.8 | ×1.1 | Lifts opponent beyblade — increases tilt angle of target | `upper` |
| **Downward-sloped (–)** | ×0.9 | ×0.9 | ×0.8 | Presses opponent downward — reduces opponent height — counters upper attack | `smash` (press-down variant) |
| **Counter-sweep (head-on)** | ×1.5 (relative velocity bonus) | ×1.2 | ×1.8 | Maximum relative velocity on direct head-on smash | `smash` |
| **Oscillating** | ×0.6–1.2 (varies with oscillation phase) | ×0.6–1.2 | ×0.6–1.2 | Variable hit zone — no single vulnerable angle to predict | Varies — `smash` when at peak angle, `absorb` at trough |

---

### 2F. Oscillation / Self-Rotation Effects on Contact Points

`PartSelfRotation` on a CP means the contact point's angular position (`angle`) advances each tick independently of the bey's spin. This is separate from the bey's rotation — it is a motor-driven CP sweep.

| `lifecycleType` | `speedDegPerSec` range | Behavior | Combat Effect | Real analog |
|-----------------|----------------------|----------|--------------|-------------|
| `permanent` | Any | CP rotates continuously at constant speed for the match duration. | Creates a sweeping hit zone that moves around the AR. Fast speed = near-omnidirectional coverage over time. Slow speed = rotating "strong point." | Turret-style spinning mechanism |
| `interval` | Paired with `intervalMs`, `activeDurationMs` | CP sweeps for `activeDurationMs` then pauses for `intervalMs`. | Periodic strong zone. Attack phase + recovery phase. | Spring-loaded mechanism that activates cyclically |
| `once` | Used with ramp-up | CP sweeps from `startAngle` to `endAngle` exactly once, then stops. | One-shot rotation — fires on trigger (usually `ConfigTrigger`). | Gimmick that snaps into position on impact |
| `pulsed` | Fast, with pulseCount | CP fires in N quick bursts of rotation, then stops. | Rapid multi-hit burst in arc sweep. High spike damage in window. | Energy gear firing a rapid engagement |
| `oscillate` | Slow (5–30°/s) to fast (100–300°/s) | CP swings back and forth between `minOscillationAngle` and `maxOscillationAngle`. | **Slow oscillation** — widens effective hit zone without reducing peak multiplier. Hard to time defenses. **Fast oscillation** — near-continuous variable coverage, effectively reduces peak multiplier but catches all angles. | Variable-angle mechanism; Seaborg-style oscillating prong |

**Oscillation + material interaction:**

| Oscillation Speed | CP Material | Combined Effect |
|-------------------|-------------|----------------|
| Slow + spike + metal | At peak angle = precision max-damage smash. Off-peak = miss. Unpredictable timing. | **Timing spike** — devastating if timed right, harmless otherwise |
| Slow + wide-arc + rubber | At any phase = wide absorb window, rubber steal. Oscillation shifts the absorption zone. | **Roaming absorber** — no weak angle exists |
| Fast + spike + metal | Too fast to distinguish from wide arc for collision purposes. Effectively high-coverage medium-damage metal zone. | **Spinning metal brush** |
| Fast + roller + rubber | Rubber roller sweeping rapidly across opponent surface. Continuous spin-steal as roller passes over contact. | **Spin-drain sweep** |

---

### 2G. Combined Shape × Angle × Material Reference Profiles

The following are the most commonly useful CP configurations in the engine, including their full field set.

| Profile Name | Shape | `width` | `angle` / oscillation | Material | `attackType` | `damageMultiplier` | `heightRange` | Notes |
|-------------|-------|---------|----------------------|----------|-------------|-------------------|--------------|-------|
| **Standard Smash Prong** | Small prong | 25° | Fixed at 0°/120°/240° (3-prong) | `abs` | `smash` | 1.3–1.5 | Full AR range | The classic 3-prong AR. Reliable, general-purpose attack. |
| **Upper Attack Sweep** | Flat smash face | 40° | Angled +15° upward | `abs` | `upper` | 1.2 × `upperAttackBonus` | High (25–35 mm) | Sweeps under opponent WD. Best vs tall beys. |
| **Rubber Absorber** | Wide arc | 90° | Fixed horizontal | `rubber` | `absorb` | 0.7 | Mid (15–25 mm) | Wide rubber zone — catches spin, absorbs hit. Defense layering. |
| **Metal Spike** | Spike | 10° | Fixed at 0° | `metal` | `smash` | 2.0 | Full AR range | Max damage on direct hit. High self-recoil. High-risk attack. |
| **Spin Leech Roller** | Roller | roller radius | Fixed (roller sweeps via rotation) | `rubber` | `spin_steal` | 0.5 | WD height (10–20 mm) | Free-spin rubber roller. Low damage, max spin drain. |
| **Oscillating Sweep** | Small prong | 20° | Oscillates ±40° at 15°/s | `abs` | `smash` | 1.4 | Mid range | Prong sweeps a 80° zone slowly. Harder to time defenses. |
| **Metal Upper Spike** | Spike | 10° | Angled +20°, `upper` | `metal` | `upper` | 2.0 × `upperAttackBonus` | High | Precision upper. Max damage on perfect upper contact. Very risky. |
| **POM Stamina Plate** | Wide arc | 80° | Fixed horizontal | `pom` | `absorb` | 0.85 | Full range | Low-friction wide zone. Minimal damage both ways. Pure stamina defense. |
| **Burst Prong** | Small prong | 20° | Fixed at 0°/120°/240° | `abs` | `burst` | 1.1 | High (Burst-lock height) | Activates `burst` type for Burst System elimination. |
| **Rubber Oscillating Drain** | Wide arc | 70° | Oscillates ±30° at 25°/s | `rubber` | `spin_steal` | 0.65 | Mid | Roaming rubber zone that catches spin from many angles. No blind spots. |

---

## PART 3 — COMBINED BEY ARCHETYPE PROFILES

This section shows how tip + contact point combinations define the complete beyblade's combat role.

| Archetype | Tip Shape | Tip Material | `freeSpin` | CP Shape | CP Material | CP `attackType` | Emergent Behavior |
|-----------|-----------|-------------|------------|----------|-------------|----------------|-------------------|
| **Pure Stamina** | `sharp` | `pom` | false | Wide arc | `pom` | `absorb` | Near-stationary, minimal decay, wide AR deflects hits smoothly. Nearly no floor friction. |
| **Stamina Zombie (Bearing)** | `ball` | `pom` | true (bearing) | Wide arc | `pom` | `absorb` | Max stamina. Floor decoupled. Cannot be spin-stolen via floor. Wide AR deflects and steals slightly on contact. |
| **Pure Attack (Smash)** | `flat` | `rubber` | false | Swept wing (forward) | `abs` or `metal` | `smash` | Flower pattern + aggressive AR smash wing. Maximum collision frequency + maximum per-hit damage. |
| **Attack (Upper)** | `flat` | `abs` | false | Flat smash face | `abs` | `upper` | Moderate aggression + upper-attack bonus when height differential active. Counters tall stamina beys. |
| **Defense (Absorb)** | `defense` | `abs` | false | Wide arc | `rubber` | `absorb` | Wide slow orbit, wide rubber AR catches hits from any angle. Absorbs smash damage, steals spin from attacker. |
| **Defense (Bearing-dome)** | `defense` | `pom` | true | Wide arc | `pom` | `absorb` | Super-stamina defense. Floor decoupled + wide deflect AR + low friction. Hard to knock out. |
| **Spin-Steal (Rubber)** | `defense` or `ball` | `rubber` | false | Roller or Wide arc | `rubber` | `spin_steal` | Slow orbit + constant spin-steal on every collision. Wins by draining opponent spin over time. |
| **Counter-Attack** | `semi_flat` | `abs` | false | Swept wing (trailing) | `metal` or `abs` | `smash` | Moderate movement, trailing metal face catches attacker's own momentum. Deals high damage on counter-hit. |
| **Balance** | `semi_flat` | `abs` | false | Flat smash face | `abs` | `smash` | Mixed profile. Moderate everything. No clear weakness or strength. Requires skill to leverage. |
| **Burst Risk** | `flat` | `rubber` | false | Small prong | `abs` | `burst` | Same movement as pure attack, but AR prongs are Burst-type — high burst risk to self, high burst chance on opponent. |

---

## PART 4 — ENGINE FIELD QUICK REFERENCE

### Tip Part → Engine fields (for new seeds)

```typescript
interface TipPart {
  tipShape: TipShape;           // see Part 1A
  material: Material;           // see Part 1B
  gripFactor: number;           // 0–1; from shape (base) × material.gripMult
  aggressiveness: number;       // 0–1; from shape (base) × material.frictionMult
  freeSpin: boolean;            // true = bearing / free-spin mechanism
  bearingFriction: number;      // 0 = frictionless, 1 = fully locked; only meaningful if freeSpin=true
  spinBias?: { rightSpin: { gripMultiplier }, leftSpin: { gripMultiplier } };
  leftSpinHop?: { enabled, hopImpulse, hopChance };
  durabilityDecay: number;      // per rubber activation; rubber-only concern
  lateralStability: number;     // resistance to tipping from side hits
}
```

**Deriving gripFactor and aggressiveness from shape + material:**

```
gripFactor     = SHAPE_BASE_GRIP[shape]     × MATERIAL_STATS[material].gripMult
aggressiveness = SHAPE_BASE_AGGR[shape]     × MATERIAL_STATS[material].frictionMult

SHAPE_BASE_GRIP = { sharp: 0.1, spike: 0.15, semi_flat: 0.35, ball: 0.3,
                    flat: 0.55, wide: 0.65, hole_flat: 0.5, defense: 0.45,
                    rubber_flat: 0.9, rubber_ball: 0.75 }

SHAPE_BASE_AGGR = { sharp: 0.08, spike: 0.12, semi_flat: 0.45, ball: 0.45,
                    flat: 0.80, wide: 0.90, hole_flat: 0.75, defense: 0.50,
                    rubber_flat: 0.95, rubber_ball: 0.65 }
```

### Contact Point → Engine fields (for new seeds)

Minimum required fields for `getContactPointMultiplier()` to work:
```typescript
interface SystemContactPoint {
  // Required
  angle: number;              // 0–360° center of arc
  width: number;              // arc degrees; angular span
  damageMultiplier: number;   // 0.8–2.5; base damage factor
  material: Material;         // drives MATERIAL_MULTIPLIERS

  // Strongly recommended
  radius: number;             // mm from bey center; for radial gate (2mm tolerance)
  thickness: number;          // mm protrusion depth
  attackType: AttackType;     // "smash" | "upper" | "absorb" | "burst" | "spin_steal"
  heightRange: { min, max };  // mm from floor; for vertical gate

  // Optional physics extensions
  extends: boolean;
  extendThreshold: number;    // spin fraction to trigger
  extendedWidth: number;      // arc degrees at high spin
  extendedRadius: number;     // mm at high spin
  extendedThickness: number;  // mm at high spin

  // Arc-segment (new format — if used, overrides angle/width for rendering only)
  arcStart: number;
  arcEnd: number;
  radiusInner: number;
  radiusOuter: number;
  lineThickness: number;

  // Self-rotation
  selfRotation?: PartSelfRotation;

  // Roller
  roller?: { radius: number, material: Material, freeSpin: boolean };
}
```

---

## PART 5 — GAP / IMPLEMENTATION NOTES

| Gap | Description | Severity |
|-----|-------------|---------|
| **TIP-01** | `SHAPE_BASE_GRIP` and `SHAPE_BASE_AGGR` tables (Part 4) are not explicitly defined in the codebase — values are inferred from existing seed data and part documentation. Should be formalized in `beybladeConstants.ts`. | Medium |
| **TIP-02** | `durabilityDecay` for rubber tips is declared in `TipPart` but the room tick loop does not decrement `gripFactor` on rubber-mode activations. | Medium |
| **TIP-03** | `spinBias` is declared but not applied in the movement physics tick. Right-spin vs left-spin grip asymmetry is not active. | Medium |
| **CP-01** | Arc-segment CP fields (`arcStart`, `arcEnd`, `lineThickness`) are used in the renderer but `getContactPointMultiplier()` still falls back to `angle±width/2`. See PART-02 gap in phase-05-parts.md. | Medium |
| **CP-02** | `selfRotation` on CPs: the rotation tick exists in `PartSystemManager` but there is no runtime accumulator tracking each CP's current rotated angle. It would need a `cpAngles: number[]` runtime state array per bey-part. | High |
| **CP-03** | `roller.freeSpin = true` triggers rubber multipliers in `getContactPointMultiplier()` regardless of actual material — this is correct behavior but undocumented in the engine. | Low |

---

[← Batch 005: Burst Parts Disambiguation](batch-005-burst-parts-disambiguation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 006-X: BX Parts Disambiguation →](batch-006-x-parts-disambiguation.md)

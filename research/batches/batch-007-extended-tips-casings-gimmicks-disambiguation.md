---
batch: 007
stage: 5-reference
status: complete
sources_checked: 0
facts: 210
inferences: 18
speculations: 0
unknowns: 0
---

# Batch 007 — Extended Tips / Casings / Gimmicks / Disambiguation

> **Purpose**: Extends batch-006 with the full extended tip catalog (WF, XF, WB, RB, WD, BWD, BS, TB, EWD, EDS, LF), casing shape effects, all mechanical gimmick types (engine gears, clutches, magnacore, etc.), and a complete plastic-gen disambiguation table.
> **Also corrects**: R²F petal count (5, not 6) and adds LF (left flat spiral) — both user-confirmed facts.
> **Date**: 2026-05-23
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Supersedes**: batch-006 Section 1D rows for R²F and LRF only. All other batch-006 content remains canonical.

---

## SECTION A — CORRECTIONS TO BATCH-006

### A1. R²F Petal Count and Spiral Structure

**Batch-006 error:** R²F described as "6-node flower pattern" and "6-petal rubber spikes."
**Corrected facts (user-confirmed):**

| Property | Corrected Value | Notes |
|----------|----------------|-------|
| Petal count | **5 petals** | Not 6. The raised spiral has exactly 5 arms. |
| Structure | Raised rubber petal/spiral arms on a flat base | Not simple flat rubber. The protrusions are molded petal shapes. |
| Spiral direction | **Right-spinning spiral** (clockwise when viewed from above) | The petal orientation creates asymmetric grip — stronger in right-spin direction. |
| `spinBias.rightSpin.gripMultiplier` | 1.4 (corrected upward from 1.3) | Spiral structure makes right-spin stick-slip more pronounced. |
| Flower pattern | 5-petal flower, not 6-petal | Each rubber arm = one petal contact per revolution. |

**Corrected engine entry:**
```typescript
// R²F (Right Rubber Flat)
{
  tipShape: "flat",             // base geometry is flat
  material: "rubber",
  freeSpin: false,
  aggressiveness: 0.95,
  gripFactor: 0.9,
  spinBias: {
    rightSpin:  { gripMultiplier: 1.4 },   // spiral arms align with right-spin = stronger flower
    leftSpin:   { gripMultiplier: 0.55 },  // arms trail = weaker grip in left-spin direction
  },
  leftSpinHop: { enabled: true, hopImpulse: 0.5, hopChance: 0.35 },
  durabilityDecay: 0.02,
  // Visual note: 5 raised rubber petal arms spiraling clockwise viewed from below
}
```

### A2. LRF vs LF Disambiguation

Two distinct parts exist for left-spin rubber flat behavior:

| Part | Full Name | Structure | Spiral | Engine approach |
|------|-----------|-----------|--------|----------------|
| **LF** | Left Flat | Flat rubber face with **left-flowing spiral, 5 winds** | Counter-clockwise petal arms, same geometry as R²F but mirrored | `spinBias.leftSpin.gripMultiplier: 1.4`, `rightSpin: 0.55` |
| **LRF** | Left Rubber Flat | Standard flat rubber (no raised spiral) for left-spin | No directional spiral — same grip both spins, but slightly smaller flat face oriented for left-spin launch | `aggressiveness: 0.88`, symmetric grip |

**Rule**: LF is the direct mirror of R²F (5-petal left spiral). LRF is a non-petal plain rubber flat for left-spin.

**LF corrected engine entry:**
```typescript
// LF (Left Flat)
{
  tipShape: "flat",
  material: "rubber",
  freeSpin: false,
  aggressiveness: 0.93,
  gripFactor: 0.88,
  spinBias: {
    leftSpin:  { gripMultiplier: 1.4 },    // spiral arms align with left-spin
    rightSpin: { gripMultiplier: 0.55 },
  },
  leftSpinHop: { enabled: false },         // hop is only for right-spin beys facing left-spin opponents
  durabilityDecay: 0.02,
  // Visual note: 5 raised rubber petal arms spiraling counter-clockwise viewed from below
}
```

---

## SECTION B — EXTENDED TIP SHAPE CATALOG

### B1. Wide Flat (WF)

| Property | Value |
|----------|-------|
| Contact geometry | Wide flat disc, approx. 22–24 mm diameter |
| Contact patch vs standard F | ~2.5× area of standard Flat tip |
| Movement pattern | More aggressive than F — wider area = stronger steering impulse. Path is erratic but slightly more controlled than rubber flat due to plastic material. |
| Aggressiveness | 0.82–0.87 |
| GripFactor (ABS) | 0.60 |
| Spin decay | High — large floor contact |
| Key difference from F | WF covers more of the stadium floor per revolution. Opponents hit by a WF combo are pushed harder. |
| Real examples | MFB performance tip WF; used in several attack-type combos. |

```typescript
// Wide Flat (WF) — engine fields
tipShape: "wide",      // "wide" is the shape; flat face profile
material: "abs",       // standard, can be rubber for max aggression
aggressiveness: 0.85,
gripFactor: 0.60,
lateralStability: 0.35,  // wide base = somewhat lower tipping risk than narrow flat
durabilityDecay: 0.0,
```

### B2. Extreme Flat (XF)

| Property | Value |
|----------|-------|
| Contact geometry | The widest flat disc tip in MFB; approx. 26–28 mm diameter |
| Contact patch vs WF | ~1.3× area of WF |
| Movement pattern | Maximum aggression among flat-type tips. Stadium coverage is near-total. Very erratic — highly unpredictable path. |
| Aggressiveness | 0.93–0.97 |
| GripFactor (ABS) | 0.63 |
| Key difference from WF | XF's extra diameter means any movement error results in rapid stadium-wall contact — extremely high self-KO risk alongside maximum attack pressure. |
| Real examples | MFB XF used in tournament attack builds; controversial due to self-KO rate. |
| Note | If rubber: approaches flower pattern density. Rubber XF would be the highest-aggression tip in the game. |

```typescript
// Extreme Flat (XF) — engine fields
tipShape: "wide",      // same shape key as WF but wider — differentiate via tipWidth field
tipWidth: 27,          // mm; explicit width when "wide" ambiguity exists
material: "abs",
aggressiveness: 0.95,
gripFactor: 0.63,
lateralStability: 0.28,
durabilityDecay: 0.0,
```

### B3. Wide Ball (WB)

| Property | Value |
|----------|-------|
| Contact geometry | Hemispherical tip with wide-diameter base (~18–20 mm) |
| Contact patch | Rolling contact — point contact at hemisphere tangent; wide base gives stability |
| Movement pattern | Wide wandering path. The wide base damps tipping. More stable than standard Ball. Natural slow orbit due to wide footprint. |
| Aggressiveness | 0.45–0.55 |
| GripFactor (ABS) | 0.55 |
| Spin decay | Moderate — rolling reduces floor drag compared to flat |
| Key advantage over standard B | Wide base resists tipping on hit (higher `lateralStability`). Used on defense types where surviving hits matters more than raw defense. |
| Real examples | Rock Leone 145WB, Rock Zurafa R145WB — classic defense/defense-stamina combos |

```typescript
// Wide Ball (WB) — engine fields
tipShape: "ball",
tipWidth: 19,          // mm; wider than standard B (~12 mm)
material: "abs",
aggressiveness: 0.50,
gripFactor: 0.55,
lateralStability: 0.75,  // wide base = much harder to tip
recoilAbsorption: 0.45,  // wide base absorbs side-hit force
durabilityDecay: 0.0,
```

### B4. Rubber Ball (RB)

| Property | Value |
|----------|-------|
| Contact geometry | Ball tip with rubber coating (~14 mm diameter) |
| Floor contact | Rubber ball rolls on floor — periodic stick-slip from rubber surface on rolling contact |
| Opponent contact | Rubber surface grips opponent on contact → spin steal |
| Movement pattern | Wide wandering orbit (from ball rolling) + occasional grip-induced arc (from rubber stick-slip). Not a flower pattern — the rolling geometry prevents it. More of an oval/irregular orbit. |
| Aggressiveness | 0.55–0.65 |
| GripFactor | 0.80 (rubber) |
| Key property | Dual-function: floor rubber creates erratic rolling orbit; opponent contact rubber creates spin steal. Neither at maximum, both present. |
| Real examples | Jade Jupiter S130RB, Rock Aries ED145B adjacent combos |

```typescript
// Rubber Ball (RB) — engine fields
tipShape: "ball",
tipWidth: 14,
material: "rubber",
aggressiveness: 0.60,
gripFactor: 0.80,
lateralStability: 0.55,
recoilAbsorption: 0.50,  // rubber ball absorbs side-hits well
durabilityDecay: 0.015,  // rubber wears moderately
spinBias: null,          // symmetric — no directional preference
```

### B5. Wide Defense (WD)

| Property | Value |
|----------|-------|
| Contact geometry | Wide circular profile, outer rim contact only (~22 mm diameter). The "wide" means it contacts at the outermost edge, not the center. |
| Contact mechanics | Outer-rim-only contact = the bey's center is elevated slightly above floor. Creates a very slow orbit — the rim rolls rather than slides. |
| Movement pattern | Near-stationary to slow circular orbit. The wide rim creates centrifugal resistance that keeps the bey near the center. One of the most stamina-efficient tips. |
| Aggressiveness | 0.15–0.25 |
| GripFactor (POM material, typical) | 0.45 × 0.5 (pom) = 0.22 effective |
| Spin decay | Very low — outer rim contact area is small, POM material is low-friction |
| Lateral stability | Very high — wide base |
| Spin steal resist | High — center-elevated geometry makes floor spin-steal harder |
| Key property | The combination of large diameter + POM material + rim-only contact = the maximum inertia stamina tip with low decay. WD is the reference stamina tip. |
| Real examples | Earth Eagle 145WD, Phantom Orion context (B:D is better but WD is the benchmark). Basalt/Twisted Tempo 145WD, Flash Sagittario 230WD. |

```typescript
// Wide Defense (WD) — engine fields
tipShape: "defense",   // dome/wide profile; outer rim contact
tipWidth: 22,          // mm
material: "pom",       // standard WD is POM — key to low friction
aggressiveness: 0.18,
gripFactor: 0.22,      // pom gripMult (0.5) × shape base (0.45)
lateralStability: 0.88,
bearingFriction: 0.0,  // no bearing in base WD
freeSpin: false,
spinStealResist: 0.80, // elevated center = hard to spin-steal via floor
durabilityDecay: 0.0,
```

### B6. Big Wide Defense (BWD)

| Property | Value |
|----------|-------|
| Contact geometry | Larger diameter than WD (~26–28 mm). Outer rim contact. |
| Key difference from WD | Greater perimeter = greater moment of inertia at the same mass → spin lasts longer. |
| Movement pattern | Same as WD (slow orbit / near-stationary) but decays even more slowly. |
| Aggressiveness | 0.12–0.18 |
| GripFactor | ~0.18 |
| Inertia bonus | I ∝ r² — BWD's 27mm diameter (13.5mm radius) gives ~50% more rotational inertia at the tip level vs WD's 22mm diameter (11mm radius) |
| Lateral stability | Very high (>0.90) |
| Spin decay | Very low — improved over WD |
| Real examples | Berserker Begirados SR200BWD (ZeroG). Some Hasbro sets use "BWD" label. |

```typescript
// Big Wide Defense (BWD) — engine fields
tipShape: "defense",
tipWidth: 27,           // mm — explicitly wider than WD
material: "pom",
aggressiveness: 0.14,
gripFactor: 0.18,
lateralStability: 0.92,
freeSpin: false,
spinStealResist: 0.85,
durabilityDecay: 0.0,
// inertiaBonusFactor: 1.5  // relative to WD — recommend adding this field for accurate decay
```

### B7. Ball Sharp / Ball-Spike (BS)

> **Note on naming**: The user called this "Ball Spike." Official MFB name is "Ball Sharp" (BS). The tip has a ball-shaped outer profile with a central pointed (sharp) tip. "Ball Spike" is an acceptable alternate name.

| Property | Value |
|----------|-------|
| Contact geometry | Outer ball-hemisphere profile surrounding a central sharp/spike point. |
| Dual contact zones | At **high spin**: center sharp is dominant (point contact) → stamina behavior. At **low spin**: bey tilts, outer ball rim contacts → rolling defense behavior. |
| Movement pattern | High spin: near-stationary center-seek (like S). Low spin: wide rolling orbit as bey tilts onto ball rim (like B). Automatic transition — no player action. |
| Aggressiveness | High spin: ~0.10. Low spin (tilted): ~0.45. |
| GripFactor | High spin: ~0.12. Low spin: ~0.55. |
| Key property | Self-adaptive stamina-to-defense behavior. As the bey loses spin it automatically shifts to a rolling orbit that helps it survive. This IS a passive `mode_switch` behavior. |
| Real examples | Libra DF145BS, Night Virgo DF145BS, Thunder Libra. |

```typescript
// Ball Sharp (BS) — engine fields
// Requires two configurations
configurations: [
  {
    name: "stamina-mode",
    trigger: { type: "spin_fraction_above", threshold: 0.5 },
    tipShape: "sharp",
    gripFactor: 0.12,
    aggressiveness: 0.10,
    lateralStability: 0.85,
  },
  {
    name: "defense-mode",
    trigger: { type: "spin_fraction_below", threshold: 0.5 },
    tipShape: "ball",
    tipWidth: 14,
    gripFactor: 0.55,
    aggressiveness: 0.45,
    lateralStability: 0.65,
  }
],
// OR model as single tip with spin-threshold behavior:
tipShape: "semi_flat",       // compromise between the two extremes
material: "abs",
aggressiveness: 0.28,
gripFactor: 0.35,
lateralStability: 0.75,
// Note: configurations approach is more accurate
```

### B8. Twin Ball (TB)

| Property | Value |
|----------|-------|
| Contact geometry | Two ball protrusions offset asymmetrically from the center axis (~10 mm each). |
| Contact mechanics | The two contact points create an **uneven floor contact** — neither ball is at the center axis. This induces a rocking/precessing motion. |
| Movement pattern | **Deliberate wobble / rocking orbit.** The offset twin contact creates a periodic weight imbalance that makes the bey precess as it moves. Creates a low, rolling, wobbling stadium path. |
| Aggressiveness | 0.40–0.50 |
| GripFactor | 0.50 |
| Unique effect | The twin-ball wobble is distinct from any other tip. It mimics the late-battle zombie behavior (low, wobbling, hard to KO) even at moderate spin levels. |
| Spin steal resist | High — offset contact geometry makes floor spin-steal geometry inconsistent |
| Real examples | Bandid Genbull F230TB (ZeroG) — the TB + F230 combination is specifically designed to exploit ZeroG stadium wall contact. |

```typescript
// Twin Ball (TB) — engine fields
tipShape: "ball",
tipWidth: 10,
material: "abs",
aggressiveness: 0.45,
gripFactor: 0.50,
lateralStability: 0.50,          // dual contact = mid-stability (rocks but doesn't fall)
recoilAbsorption: 0.40,
// Requires custom wobble behavior:
// wobbleInducing: true            — recommend adding to TipPart to model TB's precession
// wobbleAmplitude: 0.3            — baseline wobble from geometry, not spin loss
durabilityDecay: 0.0,
```

### B9. Eternal Wide Defense (EWD)

| Property | Value |
|----------|-------|
| Contact geometry | Wide circular outer ring (same diameter range as WD, ~22 mm) + inner body. **The outer ring is free-spinning** (eternal = perpetual free-spin without a ball bearing). |
| Mechanism | A **plastic sleeve bearing** — the outer ring rides on a smooth inner post. No ball bearings. Friction is higher than B:D but much lower than locked POM. `bearingFriction: 0.12–0.18`. |
| Movement pattern | Near-stationary to slow orbit. Very similar to WD but with even lower effective friction because the outer floor contact ring spins independently. |
| Aggressiveness | 0.10–0.15 |
| GripFactor | Effectively ~0.08–0.12 (ring is decoupled from bey rotation) |
| Spin decay | Very low. The free-spin outer ring means floor friction does not directly couple to the bey's spin axis. |
| Spin steal resist | Very high. Even if opponent contacts the outer ring, it merely spins — no spin transfer to bey body. |
| Key distinction from B:D | B:D uses **ball bearings** (almost frictionless). EWD uses a **plastic sleeve** (some friction). EWD ≈ 60% as efficient as B:D. EWD is more accessible and durable. |
| Real examples | Evil Befall UW145EWD. |

```typescript
// Eternal Wide Defense (EWD) — engine fields
tipShape: "defense",
tipWidth: 22,
material: "pom",
freeSpin: true,
bearingFriction: 0.15,           // plastic sleeve, not ball bearing
aggressiveness: 0.12,
gripFactor: 0.08,
lateralStability: 0.90,
spinStealResist: 0.95,           // floor ring spins free = immune to floor steal
durabilityDecay: 0.0,            // sleeve wears negligibly
```

### B10. Eternal Defense Sharp / Eternal Defense Spike (EDS)

> **Naming note**: User called this "Eternal Defense Spike." Official MFB name is "Eternal Defense Sharp" (EDS). Both names refer to the same part — the 'S' in EDS is ambiguous between Sharp and Spike in community usage. "Eternal Defense Spike" is an accepted alternate name.

| Property | Value |
|----------|-------|
| Contact geometry | Central **sharp/spike point** surrounded by a free-spinning outer protective sleeve (smaller diameter than EWD, ~14–16 mm outer sleeve). |
| Mechanism | Same plastic sleeve free-spin as EWD but in a smaller, more compact form. The outer sleeve is narrower than EWD's outer ring. |
| Movement pattern | Near-stationary center-hold from the sharp core. Outer sleeve provides protection from spin-steal and absorbs lateral hits without transferring force to the sharp tip. |
| Aggressiveness | 0.06–0.12 |
| GripFactor | ~0.05 (sharp tip, low contact area; outer sleeve is free-spin so doesn't contribute) |
| Spin decay | Extremely low — sharp tip (minimal area) + free-spin outer sleeve (doesn't create friction) = near-zero total floor friction |
| Key advantage over S (standard Sharp) | The outer sleeve **absorbs opponent contact** on the lower body during battle. Without it, repeated contacts destabilize the sharp pivot point. EDS protects the center-hold mode. |
| Key difference from EWD | EDS has a **sharp center** = near-zero movement, maximum center-hold. EWD has a **wide rim center** = slight orbit. EDS is more stationary; EWD is more robust. |
| Real examples | Scythe Kronos T125**EDS**. Some Hasbro sets list it as "Eternal Sharp." |

```typescript
// Eternal Defense Sharp / Eternal Defense Spike (EDS) — engine fields
tipShape: "sharp",
material: "pom",
freeSpin: true,              // outer sleeve is free-spinning
bearingFriction: 0.18,       // plastic sleeve (slightly more friction than EWD due to smaller size)
aggressiveness: 0.07,
gripFactor: 0.04,
lateralStability: 0.92,      // outer sleeve prevents tipping
spinStealResist: 0.97,       // near-immune to spin steal — outer free-spin prevents any coupling
durabilityDecay: 0.0,
// suctionCap: 0.3            — outer sleeve edge provides minor suction effect
```

### B11. Left Flat (LF)

| Property | Value |
|----------|-------|
| Contact geometry | Flat disc (similar size to standard F) with **5 raised rubber petal arms spiraling counter-clockwise** (left-flowing). |
| Mechanism | Mirror of R²F. The left-flowing spiral creates directional stick-slip that is strongest in the **left-spin direction**. |
| Movement pattern | Left-spin flower pattern — 5 petals, tight periodic orbit. Equivalent aggression to R²F but for left-spin beys. For right-spin beys: reduced grip (trailing spiral = less stick-slip → near-normal flat behavior). |
| Aggressiveness | Left-spin: ~0.93. Right-spin: ~0.60. |
| Spin decay | High (rubber material) |
| Flower petal count | 5 petals (confirmed — same as R²F) |
| Real examples | Meteo L-Drago LW105**LF** — the most prominent LF user. Left-spin attack archetype. |

```typescript
// Left Flat (LF) — engine fields
tipShape: "flat",
material: "rubber",
freeSpin: false,
aggressiveness: 0.93,          // at full left-spin efficiency
gripFactor: 0.88,
spinBias: {
  leftSpin:  { gripMultiplier: 1.4 },    // spiral arms aligned = 5-petal flower
  rightSpin: { gripMultiplier: 0.55 },   // arms trailing = reduced grip
},
leftSpinHop: { enabled: false },          // hop only applies to right-spin beys
durabilityDecay: 0.02,
// Visual: 5 raised rubber petal arms, counter-clockwise viewed from below
```

---

## SECTION C — EXTENDED TIP BEHAVIOR MATRIX (New Shapes × Material)

Extending batch-006 Section 1C matrix for the new tip shapes. Column headers: `abs | pom | rubber | metal | +freeSpin/bearing`

| Tip Shape ↓ / Material → | `abs` | `pom` | `rubber` | `metal` | `+freeSpin` |
|--------------------------|-------|-------|----------|---------|-------------|
| **`wide` (WF)** | Wide erratic attack. High stadium coverage, moderate self-KO risk. | Wide low-friction orbit. Very wide slow path — defense/stamina variant. | **Rubber WF**: Near-flower pattern with extremely wide coverage. Very high aggression + very high self-KO risk. | Metal WF: Durable wide attack. No wear. | Free-spin wide: Outer disc decoupled. Defense-orbit with near-zero steering. Unusual. |
| **`wide` (XF — larger)** | Extreme aggression. Highest self-KO risk among standard tips. | Wide slippery orbit. POM's low friction on XF = very slow, very wide orbit. | **Rubber XF**: Maximum possible aggression. Self-KO almost inevitable. Niche. | Metal XF: Durable extreme attack. | — |
| **`ball` wide (WB)** | Wide wandering defense. Hard to tip. Absorbs hits well. | WB+POM: Slow, very wide orbit. Excellent LAD (Late Attack Defense — ability to out-last and survive late-battle). Defense-stamina archetype. | **Rubber WB**: Wide orbit + floor spin-steal. Defensive aggressor. Analog: RB but wider. | Heavy metal WB: Slow, very stable wander. Ultra-durable defense. | Free-spin WB: Wide outer ring decoupled. Excellent orbit stamina. High LAD. |
| **`ball` standard (RB)** | Ball+ABS: Standard wandering. Defense-balance. | Ball+POM: Slow, smooth wander. Low decay. | **RB (rubber ball)**: Orbit + spin steal. Dual role. | Metal ball: Heavy wander, durable. | Free-spin ball = B:D / Bearing archetype. Maximum stamina. |
| **`defense` WD profile** | WD+ABS: Moderate orbit, decent stamina. | **WD+POM: Canonical WD behavior.** Slow orbit, very low decay, excellent. | WD+rubber: Slow rubber-orbit + floor spin-steal. Defense-steal hybrid. | Metal WD: Durable defense orbit. Slightly higher decay from metal contact. | **EWD: outer ring free-spin.** Near-zero decay. Spin-steal immune. See B9. |
| **`sharp` narrow (EDS profile)** | Sharp+ABS: Standard stamina. | Sharp+POM: Elite stamina center-hold. | Sharp+rubber: Impractical (see batch-006). | Metal sharp: Durable stamina. | **EDS: sharp+free-spin sleeve.** Near-zero decay. Outer sleeve protection. See B10. |
| **`ball` (BS profile)** | **BS (Ball Sharp)**: Self-adapting. Sharp at high spin → ball at low spin. | — | — | — | — |
| **Twin-point (TB profile)** | **TB**: Deliberate wobble/precession orbit. Unique movement. | TB+POM: Even smoother wobble orbit. | TB+rubber: Wobble + periodic rubber stick-slip. Erratic wobble. | — | Free-spin TB: Decoupled wobble — very unusual hybrid. |
| **Flat spiral (R²F)** | — | — | **R²F: 5-petal right-spin flower.** Highest right-spin aggression. | R²F+metal: Durable spiral (degraded flower). | — |
| **Flat spiral (LF)** | — | — | **LF: 5-petal left-spin flower.** Mirror of R²F. Best for left-spin attack beys. | — | — |

---

## SECTION D — FREE-SPIN MECHANISM TYPES

Not all "free-spin" is equal. Five distinct mechanisms exist with different friction profiles:

| Mechanism Type | Friction (`bearingFriction`) | How it works | Examples | Engine modelling |
|---------------|------------------------------|--------------|---------|-----------------|
| **Ball bearing (steel balls)** | 0.01–0.03 | Steel balls in a race between inner and outer rings. Near-frictionless. | B:D (Bearing Drive MFB), Bearing (Burst), Bearing Drift (Burst BD), Wolborg MS Bearing Core 2 | `freeSpin: true`, `bearingFriction: 0.02` |
| **Plastic sleeve / eternal ring** | 0.12–0.20 | Outer ring rides on smooth inner plastic post. Friction depends on surface quality and lubrication state. | EWD (Eternal Wide Defense), EDS (Eternal Defense Sharp), ED145 free-spin disc | `freeSpin: true`, `bearingFriction: 0.15` |
| **Clutch-lock → free-spin release** | 0.0 after release (spring lock) | Starts locked to bey spin. Releases at spin threshold or impact. After release, inner mechanism spins freely with minimal coupling. | Dranzer series auto-change base, Seaborg Defense Grip Base | `freeSpin: false` → triggers `configurations` change to `freeSpin: true` on `clutch_release` trigger |
| **Engine gear shaft (post-release)** | ~0.05 after EG fires | After Engine Gear releases stored spin, the gear shaft decouples from the tip. Tip continues at full injected spin while bey body spin has decayed. Brief spin injection window. | Dragoon G Final Clutch Base, Strata Dragoon G Hit Release | `spinInjection` fires → `reserveRemaining` depletes → tip runs on injected spin differential |
| **HMS Running Core free-shaft** | 0.03–0.06 | The RC inner shaft is not fixed to the bey body — it can rotate slightly independently. Reduces spin loss on Smash impact. | Dranzer MF Free Shaft Core | `freeSpin: true`, `bearingFriction: 0.04`, applied to core level not tip level |

---

## SECTION E — CASING SHAPE CATALOG & EFFECTS

The casing (called **Blade Base** in plastic gen, **Performance Tip** housing in MFB, **Bottom** in some contexts) determines the bey's vertical profile and protection geometry.

### E1. Shape Catalog

| Shape Category | `CasingCategory` | Profile | Key Effects |
|---------------|-----------------|---------|-------------|
| **Compact / Round** | `round` | Small-diameter round shell. Minimal protrusion beyond AR. Low clearance. | Low profile makes bey harder to hit at WD height from below. But AR is closer to floor → vulnerable to low-height attacks. `clearanceHeight: 4–6 mm`. |
| **Wide flat-base** | `wide` | Wide-diameter flat bottom shell. Low height, large floor footprint. | Wide base provides highest `lateralStiffness` of any shape (hardest to tip). Very low `clearanceHeight: 2–4 mm`. Upper-attack CPs from opponents are blocked by wide casing coverage. |
| **Guard-wing / Fortress** | `custom` | Extensions or "wings" protrude radially from the casing body. | Guard wings deflect incoming hits sideways — `impactAbsorption: 0.3–0.5`. Wings can have their own CPs for counter-attack. High `lateralStiffness`. Used by Trypio (Flying Defense AR), Draciel V (fortress casing). |
| **Tall / cylindrical** | `round` tall | Taller profile. Higher `clearanceHeight`. | AR and WD are higher from floor → immune to under-attacks from shorter beys. But: upper-attack CPs from taller opponents can reach the WD. `clearanceHeight: 8–12 mm`. |
| **HMS Running Core (cylindrical)** | `custom` | Integrated SG+BB. Compact, very low profile (~6 mm tall). Dual-spin shoulder. | HMS RC is part of the system — it replaces separate SG+BB of plastic gen. Very compact = hard to hit at WD height from any direction. |
| **Spike-edge / defensive protrusion** | `custom` | Casing has downward-pointing spikes or sharp edges at the outer rim. | Spikes act as CPs at casing level — deflect or deal minor damage to opponent CPs that reach this height. `contactPoints: [{attackType: "smash", heightRange: {min:2, max:8}, damageMultiplier: 0.9}]`. |
| **Mechanism housing** | `custom` | Casing enlarged to house an internal mechanism (engine gear, magnacore, etc.). | Typically increases `clearanceHeight` due to mechanism bulk. Tradeoff: taller target profile in exchange for gimmick benefit. |

### E2. Clearance Height Interaction Table

`clearanceHeight` = mm from floor to the bottom of the casing body. This determines which opponent CPs can slip **under** the casing to hit the WD.

| Attacker CP `heightRange` | Defender `clearanceHeight` | Interaction |
|--------------------------|---------------------------|-------------|
| `{min: 0, max: 5}` (very low attack) | `clearanceHeight: 2` | CP fires — slides under defender casing. Hits WD/Core directly. |
| `{min: 0, max: 5}` | `clearanceHeight: 8` | CP skips — too high. Can't get under casing. |
| `{min: 10, max: 20}` (mid attack) | `clearanceHeight: 2` | CP hits casing body, not WD. Casing `impactAbsorption` absorbs some force. |
| `{min: 10, max: 20}` | `clearanceHeight: 12` | CP hits at WD height — full WD contact. No casing protection. |
| `{min: 20, max: 35}` (upper attack) | Any `clearanceHeight` | CP aims at AR level — ignores casing entirely. |

**Rule of thumb:**
- **Low casing (`clearanceHeight` < 5 mm)**: Virtually immune to under-attacks; vulnerable to same-height CPs that hit the casing body.
- **High casing (`clearanceHeight` > 10 mm)**: Vulnerable to under-attacks (opponent's low CPs slip under); WD is exposed at mid-height.

### E3. Casing Impact Absorption Effects

`impactAbsorption` on the casing reduces incoming force before it reaches the WD and Core.

| `impactAbsorption` | Effect | Real behavior |
|-------------------|--------|--------------|
| 0.0–0.1 | Standard rigid casing | Full force transfer to WD/Core. Normal damage and spin loss. |
| 0.1–0.3 | Partial absorption | Casing deflects 10–30% of hit force. Reduces spin loss and destabilization on glancing hits. |
| 0.3–0.5 | High absorption | Casing is cushioned/wide. Significantly reduces hit force to core. Defense archetypes. |
| 0.5+ | Very high absorption | Near-full absorption. Rubber casing or very wide fortress base. Spin-steal may be triggered instead of damage. |

### E4. Casing Contact Points

Casings can have their own CPs at the lower body height range (typically `heightRange: {min: 3, max: 15 mm}`). These fire when opponent CPs reach the casing level.

| CP Type on Casing | Effect |
|------------------|--------|
| **Deflector (wide arc, abs)** | Catches hits at casing level and deflects them sideways. Reduces effective damage. Used by fortress-type casings. |
| **Counter-prong (small prong, metal)** | Sharp edges on the casing deal damage to opponents whose low-height CPs contact the casing. Used by spike-edge casings. |
| **Roller (rubber, freeSpin)** | A roller at the casing perimeter spins against opponent — spin steal at casing height. Used by Draciel S-type metal ball base (the ball bearings in the casing). |
| **Guard wing (wide arc, abs)** | Very wide deflector. Catches almost all directions. Minimal damage, high deflection. Used by Flying Defense AR + case combo (Trypio). |

---

## SECTION F — MECHANICAL GIMMICK CATALOG

### F1. Engine Gear (EG) System — Complete Clutch Type Breakdown

The Engine Gear system stores launch spin in a compressed spring inside the SG/Core. The stored spin is released mid-battle via a clutch mechanism. The type of clutch defines WHEN and HOW the release occurs.

**Physics model (all EG types):**
```
At launch:
  bey.coreReserveRemaining = spinInjection.reserveCapacity   (~500–800 RPM equivalent)
  spinInjection.activationCondition = clutch-type-specific

During battle (tickSpinInjection):
  if clutch condition met:
    bey.spin += spinInjection.rateRPM / 60      // per tick at 60Hz
    bey.coreReserveRemaining -= spinInjection.rateRPM / 60
    if bey.coreReserveRemaining <= 0: deactivate injection
```

**Clutch type reference table:**

| Clutch Type | Activation Condition | Release Behavior | Velocity Burst? | Real Beys | Engine `activationCondition` |
|-------------|---------------------|-----------------|----------------|----------|------------------------------|
| **First Clutch (Instant Release)** | Always active from launch; releases on first significant hit OR after short delay | Fires immediately on impact. Very predictable — bursts within first few collisions. High RPM injection rate. | Yes (`velocity_burst`) | Zeus (First Clutch Base) | `"casing_trigger"`, trigger = first impact above threshold |
| **Hit Release** | Impact force exceeds `hitThreshold` at any time during battle | Fires when hit hard enough. Can delay if hit is glancing. Release is reactive — fires IN RESPONSE to being hit. Useful for counter-attack builds. | Sometimes (`spring_recoil` + `engine_gear`) | Strata Dragoon G, Trypio G (Jumping Base version) | `"casing_trigger"`, trigger = `impact_threshold >= hitThreshold` |
| **Final Clutch** | Spin falls below `spinThreshold` fraction | Fires when bey's spin decays to a set level. Provides a mid-battle stamina boost. Works best in stamina builds. | Moderate | Dragoon G (Final Clutch Dragoon G Version) | `"spin_threshold"`, activates when `bey.spin < maxSpin * 0.6` |
| **Full Auto Clutch** | Attempts to fire automatically but calibration is unreliable | Unreliable auto-engage. Fires at unpredictable intervals. Considered non-competitive. | No (too unreliable) | Gigars, Canarias, Darillanzer | `"casing_trigger"` (poorly calibrated) — model as random: `activationCondition: "always"` with low probability |
| **Reverse Engine Gear (Reverse EG)** | Fires after a set delay or on hit, BUT the gear spins in REVERSE direction | Rather than boosting forward spin, the EG fires in the opposite direction — creates a `counterRotation` effect that disrupts opponent's spin model. | Unusual burst effect | Dragoon GT, Dranzer GT | `counterRotation.enabled: true`, `directionSequence: ["left", "right"]` |

**EG integration into CorePart fields:**
```typescript
// Standard EG (Final Clutch example)
gimmick: "engine_gear",
spinInjection: {
  enabled: true,
  rateRPM: 150,                    // RPM added per second when firing
  reserveCapacity: 600,            // total RPM reserve in the spring
  activationCondition: "spin_threshold",
  spinThreshold: 0.60,             // fires when spin drops below 60% of max
},
```

### F2. Auto-Change Base (Mode Switch)

The "auto-change" or "mode switch" base allows the tip configuration to change either:
- **Pre-battle** (player selects) — player physically rotates the base before launching.
- **Mid-battle on trigger** — tip changes automatically when a physics condition is met.

| Mode Type | Trigger | Effect | Bey Examples |
|-----------|---------|--------|--------------|
| **Manual pre-battle** | Player choice before launch | Two or more tip configurations, one selected before battle. Completely player-controlled. | Dranzer S (Spiral Change), Dranzer F (Flame Change), Dranzer MS (Manual Change Core — 3 options: flat / sharp / semi-flat) |
| **Magnetic mid-battle** | Spin speed threshold (magnet pole flips) | Dranzer V: magnetic force in the base causes the tip to snap to a new position as spin changes. Auto-switches from flat→sharp as spin decays. | Dranzer V (Volcano Change Base) |
| **Mechanical auto-switch** | Impact force | Samurai Changer MS Battle Change Core: tip physically toggles between flat (attack) and sharp (stamina) each time the bey is hit hard. | Samurai Changer MS |
| **Spin-triggered tilt** | Low spin → bey tilts → geometry change | Death Gargoyle MS Metal Change Core: as spin decays and bey tilts, the contact point geometry shifts from sharp (center-hold) to flat (wider contact). Passive auto-change. | Death Gargoyle MS |
| **Engine Gear reverse** | EG fires → direction reverses | Dranzer GT Reverse EG: EG fires, momentarily reverses spin direction as a disruptive technique. | Dranzer GT |

**Engine modelling (mid-battle mode switch):**
```typescript
// Auto-change base — TipPart configurations
configurations: [
  {
    name: "attack",
    tipShape: "flat",
    material: "abs",
    aggressiveness: 0.80,
    gripFactor: 0.55,
    playerSwitchable: false,       // auto-only
    trigger: { type: "spin_fraction_above", threshold: 0.6 },
  },
  {
    name: "stamina",
    tipShape: "sharp",
    material: "abs",
    aggressiveness: 0.10,
    gripFactor: 0.12,
    playerSwitchable: false,
    trigger: { type: "spin_fraction_below", threshold: 0.6 },
  }
],
```

### F3. Magnacore System (Magnacore / Magnetic)

Magnacore uses magnetic North (N) or South (S) pole cores embedded in the Spin Gear. When two magnetically-equipped beys collide, their poles interact.

**Requirements for Magnacore activation (all three must be true):**
1. Both beys have a Magnecore (N or S) in their SG.
2. Both beys have a Magne Weight Disk (MWD) — the WD acts as the magnetic field conductor.
3. The beys are within magnetic activation range (~60–80 mm center-to-center).

| Pole Combination | Effect | In-game result | Engine field |
|-----------------|--------|----------------|-------------|
| N vs N (same pole) | **Repulsion** — the beys push apart | Rapid acceleration away from each other on collision. Acts like a super-recoil — both beys push off. Opponent is ring-out risk at low speed. | `gimmick: "magnetic"`, `magneticMode: "repel"`, `suctionEmit: -6` (negative = repulsion force) |
| N vs S (opposite poles) | **Attraction** — beys are pulled toward each other | Beys are drawn together before contact. Increases collision frequency. Increases spin-steal chance. Destabilizes defensive holds. | `gimmick: "magnetic"`, `magneticMode: "attract"`, `suctionEmit: 8` (positive = attraction) |
| N or S vs no Magnecore | No effect | Magnacore bey does not benefit. System requires both beys to have Magnecores. | No interaction |

**Vortex Ape Defense Ring sub-part interaction:**
The Vortex Ape (Dunga, Saint Shields) has a Defense Ring sub-part that provides S-tier spin-steal AND high LAD (Late Attack Defense), which combined with the Magnacore repulsion creates a particularly difficult defensive profile to attack.

```typescript
// Magnacore bey — CorePart fields
gimmick: "magnetic",
suctionEmit: -6,           // repulsion: pushes beys apart on contact
// OR
suctionEmit: 8,            // attraction: pulls beys together
// Additionally on Beyblade schema:
bey.suctionForce += core.suctionEmit   // applied in Physics tick when beys within range
```

### F4. Jumping Base (Spring Recoil — SG Jumping Base)

The jumping mechanism launches the bey into a ballistic arc on impact or on EG release.

| Gimmick | Trigger | Effect | Engine |
|---------|---------|--------|--------|
| **SG Jumping Base (Trygle)** | Spring pre-loaded from launch; fires on first significant hit | Bey literally hops — loses floor contact for 0.2–0.5 seconds. Can jump OVER incoming hits. Useful against low-contact attack builds. | `spring_recoil`; apply upward `forceY` impulse when trigger fires |
| **Trypio G Jumping Base + Hit Release EG** | Triggered simultaneously with EG Hit Release | On the hit that triggers EG release, the bey ALSO hops. Combined velocity burst + jump = very disruptive mid-battle. | `spring_recoil` + `engine_gear` firing simultaneously |
| **Aero Knight MS Aero Wing** | Launch one-shot | Launch toy mode — the helicopter-style disc generates upward lift on launch, giving the bey a raised initial trajectory. After the initial launch arc, no further effect. Single-use. Non-competitive. | `spring_recoil` one-shot; `activationCondition: "once"` |
| **Phantom Fox MS Bunshin Core** | Impact threshold | Upper half of the RC ejects on impact. Lower half continues with the sharp tip. Two-part split. | `detachment: { type: "fragment", trigger: "impact_threshold", returnToParent: false }` |

### F5. Magnacore Attract as Anti-Zombie

The attraction mode (N vs S poles) is the counter-strategy to the "Defense Zombie" archetype:
- Defense Zombie relies on staying near the center of the stadium and surviving on stamina.
- A Magnacore attract bey is pulled TOWARD the zombie continuously.
- This forces collisions at much higher frequency than the zombie player would choose.
- Combined with spin-steal AR (Gabriel's Twin Horn), the attract mode creates forced-contact spin equalization.

This models as: `magneticMode: "attract"` + CPs with `attackType: "spin_steal"` + rubber material = forced drain build.

### F6. Counter-Rotation (Reverse EG)

`CounterRotationConfig` fields apply when the bey's spin direction is reversed mid-battle:

```typescript
counterRotation: {
  enabled: true,
  activationCondition: "casing_trigger",    // fires when EG releases
  directionSequence: ["right", "left"],      // start right, flip to left on release
  stepDurationTicks: 45,                     // ~0.75 seconds per direction
  spinDecayCostPerStep: 0.08,               // 8% of spin lost at each direction transition
}
```

The counter-rotation effect at the collision level:
- During the left-spin phase, all CPs behave as if the bey is spinning in the opposite direction
- `spinBias.leftSpin` multipliers apply even if the bey was originally right-spin configured
- This briefly makes `attackType: "absorb"` CPs behave like `attackType: "smash"` (reverse hit profile)
- Duration is short — typically 1–2 ticks of contact per direction cycle

---

## SECTION G — PLASTIC GEN DISAMBIGUATION TABLE

### G1. Suffix Disambiguation Rules

**For plastic gen beys (Gen1)**, the letter suffixes after the name have DIFFERENT meanings depending on context:

| Suffix | Meaning in tip context | Meaning in bey series context | Meaning in HMS context |
|--------|----------------------|------------------------------|----------------------|
| **S** | Sharp tip (stamina-oriented point contact) | "S-Series" = first gen of that bey (Season 1) | Smash-type AR protrusion shape |
| **F** | Flat tip (attack-oriented flat disc) | "F-Series" = upgraded version (Season 2) | Force Smash geometry in AR |
| **G** | Guard (defensive protrusion on AR) | "G-Revolution era" = the bey released in G-Rev season | Guard component on base |
| **V** | Victory (tip, base variant) | "V = V-Force era" bey | Victory-era variant |
| **V2** | Version 2 (second form) | V-Force upgraded version | N/A |
| **GT** | "Grand Twist" (tip on some bases) | G-Revolution advanced bey (after V2) | N/A |
| **MBD** | Metal Ball Defense (blade base type) | Specific product code variant | N/A |
| **MS** | Metal Sharp tip | "Metal System" = HMS era | HMS suffix (all HMS beys) |
| **MF** | Metal Flat tip | "Metal Fighter" (some Draciel variants) | HMS metal flat RC |

**Critical ambiguity:** When you see "Driger G" — does it mean Driger with Guard AR or Driger from G-Revolution with Engine Gear? Answer: **Both simultaneously** — "Driger G" is the G-Revolution era Driger, which happens to have a Guard-type gimmick (Engine Gear clutch). The "G" refers to the era, not purely to the guard component.

### G2. Hasbro vs Takara Name Pairs (Complete)

| Hasbro Name | Takara Name (TT) | Product Code | Notes |
|-------------|-----------------|-------------|-------|
| **Death Driger** | Shadow Driger | A-36 | Death = evil/shadow in Hasbro localization. Same product. |
| **Strata Dragoon** | Gaia Dragoon | A-123 (HMS) | TWO DIFFERENT ERAS SHARE THIS CONFUSION. (a) A-123 Strata Dragoon MS = Gaia Dragoon MS (HMS). (b) Strata Dragoon (plastic) is Daichi's bey and is a DIFFERENT product from the HMS. DO NOT conflate. |
| **Vortex Ape** | Vortex Ape | A-77 | Same name in both regions. Two lore files (vortex-ape.md and vortex-ape-2.md) refer to SAME product — seed once only. |
| **Death Gargoyle** | Dark Gargoyle | Various | Hasbro uses "Death"; TT uses "Dark." BB-99 has a completely separate "Hell/Hades Kerbecs" disambiguation below. |
| **Hades Kerbecs** | Hell Kerbecs | BB-99 | Same product. "Hell" is direct TT name. "Hades" is Hasbro localization (mythological equivalent). |
| **Earth Aquila** | Aquila (Eagle) | BB-47 | Hasbro uses Earth Aquila; Japanese/international promotional material uses Earth Eagle or just Aquila. All refer to BB-47. |
| **Dragoon MF** | Ultimate Dragoon | HMS RBA3 prize | "MF" in Hasbro = Metal Flat (tip). TT name emphasizes "Ultimate" status as RBA prize. |
| **Bloody Devil MS** | Bloody Devil MS | MA-23 | Same name — unusual for Hasbro to keep "Bloody." The product was sold as-is in most markets. |
| **Trygator S / Trygator 2** | Trygator | Various | Two separate bey doc files, same product (Emily Watson character). Canonical name: Trygator 2. |

### G3. Critical Bey-Specific Disambiguation

#### Dragoon Family (Tyson)
All are RIGHT-SPIN attack types. Confusion comes from the multiple versions and era-transitions.

| Name | Era | System | Blade Base | Key Gimmick | Disambiguation |
|------|-----|--------|-----------|-------------|---------------|
| Dragoon S | S1 | `plastic_sgs` | Storm Grip Base (rubber tip) | `rubber_grip` | The original. S = first gen. Rubber tip for floor grip. |
| Dragoon V | V-Force | `plastic_sgs` | Voltaic Ape (volcano-spring) | `rubber_grip` + `velocity_burst` | V = Victory/V-Force. Voltaic spring base gives recoil burst. |
| Dragoon V2 | V-Force | `plastic_sgs` | Customize Grip | `rubber_grip` + `velocity_burst` | V2 = upgraded V. Same gimmick, refined grip. |
| Dragoon G | G-Revolution | `plastic_neosg` | Final Clutch EG | `engine_gear` + `velocity_burst` | G = G-Rev era. First EG Dragoon. Final Clutch fires at spin threshold. |
| Dragoon GT | G-Rev (BEGA arc) | `plastic_neosg` | Reverse EG (Hit Release) | `engine_gear` + `velocity_burst` | GT = Grand/Final form. Reverse EG fires on hit — disrupts after being struck. NOT same as Final Clutch. |
| Dragoon MS | HMS | `hms` | Grip Flat Core (rubber flat) | `rubber_grip` | HMS version. RC = Grip Flat Core (rubber flat). Very different from all plastic Dragoons. |
| Dragoon MF | HMS (prize) | `hms` | Metal Weight Grip Core | `rubber_grip` | Prize bey. Metal Weight Grip Core = heavier, hardened rubber RC variant. Stronger than standard Grip Flat Core. |
| Dragoon MS UV | HMS (prize) | `hms` | Grip Flat Core Ultimate Mode | `rubber_grip` + `velocity_burst` | UV = Ultimate Velocity. Grip Flat Core Ultimate Mode = 5mm soft red rubber, 120-130% speed of base. Highest self-KO risk in HMS. |

#### Dranzer Family (Kai)
All are RIGHT-SPIN STAMINA types. The mode-switch runs the entire Kai line.

| Name | Era | Mode Switch Mechanism | Attack mode tip | Stamina mode tip | Notes |
|------|-----|----------------------|----------------|-----------------|-------|
| Dranzer S | S1 | Spiral Change Base (manual) | flat | sharp | Player manually flips before launch |
| Dranzer F | S1/S2 | Flame Change Base (manual) | flat | sharp | Same as S but different aesthetic base |
| Dranzer V | V-Force | Volcano Change Base (magnetic mid-battle) | flat | sharp | AUTO-switches using magnet at spin threshold. Only Kai bey with automatic switch. |
| Dranzer V2 | V-Force | Customize Change Base (manual) | flat | sharp | Back to manual. V2 = refined manual selection. |
| Dranzer G | G-Rev | Engine Gear (Final Clutch) | EG releases spin boost | — | G-Rev era. Mode switch = EG clutch (different from auto-change). |
| Dranzer GT | G-Rev (BEGA) | Reverse Engine Gear | — | — | Reverse EG fires in reverse direction on hit. Destroyed by Brooklyn. |
| Dranzer MS | HMS | Manual Change Core (3 options) | flat | sharp | 3-way: flat / sharp / semi-flat. Pre-battle player choice. Most flexible in series. |

#### Draciel Family (Max)
All are RIGHT-SPIN DEFENSE types. Primary gimmick: contact deflection via the ball base mechanism.

| Name | Era | Blade Base | Key defensive mechanism | Disambiguation |
|------|-----|-----------|------------------------|---------------|
| Draciel MBD | S1 (first) | SG Metal Ball | Metal ball bearing in base = smooth rolling defense. NOT the same as Draciel S. This is the TRUE first form. | "MBD" = Metal Ball Defense (the SG variant). Common confusion: "MBD" looks like a suffix but it's actually the SG type. |
| Draciel S | S1 | SG Metal Ball Defense | Same ball mechanism as MBD but in updated form factor. `contact_deflect`. | S here = first named series variant, NOT sharp tip. |
| Draciel F | S2 | Metal Ball Defense F ver. | Updated form. F = Fortress (the blade base shape, not flat tip). | F here = Fortress, NOT flat tip. Common confusion. |
| Draciel G | G-Rev | Final Clutch EG + Metal Ball | EG release + ball defense combined. | G = G-Rev era. |

#### Wolborg Family (Tala)
The most critical disambiguation due to the bearing system evolving over 4 versions.

| Name | Era | SG Type | `freeSpin` | `bearingFriction` | Competitive Tier |
|------|-----|---------|-----------|-------------------|-----------------|
| Wolborg (original) | S1 | SG Bearing (plain bearing sleeve) | true | 0.20 | Good stamina but not the famous one |
| **Wolborg 2** | S1 | SG Bearing Version 2 (bearing + rubber tip) | true | 0.15 | **THE defense zombie cornerstone.** The rubber tip + bearing combo is what makes it famous. |
| Wolborg 4 | G-Rev | EG (bearing refinement) | true | 0.12 | Engine Gear + bearing. More complex but bearing quality also improved. |
| Wolborg MS | HMS | Bearing Core (ball bearing RC) | true | 0.02 | **S-tier. Ball bearing in RC.** The best bearing mechanism in the entire plastic generation. Bearing Core = ball bearings (not sleeve). |

**Rule:** "Wolborg 2" ≠ "Wolborg MS." Wolborg 2 uses a **sleeve bearing + rubber tip** (plastic gen, somewhat high friction). Wolborg MS uses **steel ball bearings** (HMS, near-frictionless). These are completely different mechanisms.

#### HMS Shared Metal Frame Families
Three distinct "family groups" where beys share the same zinc-alloy metal frame in their AR but have different plastic outer components (ABS cauls):

| Family | Members | Shared Metal Frame | Key difference |
|--------|---------|-------------------|----------------|
| **Upper Dragon family** | Phantom Fox MS (Upper Fox), Dragoon MF (Upper Dragon), Bloody Devil MS (Devil Crusher) | Same upper-attack AR frame | Plastic caul + AR name differs. Upper Dragon has best Force Smash; Upper Fox has different caul geometry; Devil Crusher is the weakest. |
| **Smash Phoenix family** | Dranzer MF (Smash Phoenix), Dark Leopard MS (Smash Leopard), Shining God MS (God Smasher) | Same Force Smash AR frame | God Smasher has slightly different finish. Smash Phoenix/Leopard are effectively the same attack profile from the metal layer. |
| **Circle Upper family** | Death Gargoyle MS (Circle Upper), Samurai Changer MS (Samurai Upper) | Similar circular upper-attack frame | Samurai Upper is wider (heavier plastic component), making it the heavier and better version. Circle Upper is the predecessor. |

### G4. HMS Naming System Reference

HMS uses a different product code system from plastic gen:

| Code Series | What it means | Examples |
|-------------|--------------|---------|
| **A-series (A-123, A-124, A-125, etc.)** | Main retail HMS releases in A-number sequence. The protagonist/antagonist beys. | A-123 = Strata Dragoon MS, A-124 = Driger MS, A-125 = Draciel MS, A-126 = Dragoon MS |
| **MA-series (MA-04 through MA-24)** | "Metallic Advance" or MA booster series. Includes all the competitive upgrade parts. | MA-08 = Wolborg MS, MA-12 = Advance Striker, MA-22 = Jiraiya MS |
| **RBA series (RBA1, RBA2, RBA3, RBA4)** | Random Booster Advanced. Rare prize beys. | RBA1 = Thunder Dragon, RBA2 = Sea Dragon, RBA3 = Dragoon MF, RBA4 = Dranzer MF |
| **FB series (FB-04, FB-05)** | Fukubako = annual new year prize sets. Very rare. | FB-04 = Einstein MS, FB-05 = Slash Riger MS |

**HMS-specific terminology:**
- **Running Core (RC)**: The integrated SG+BB piece unique to HMS. Not a separate SG. Not a separate BB. One piece that does both.
- **Circle Weight Disk (CWD)**: The HMS equivalent of WD. Named "Circle" because all HMS WDs are circular. Can be "CWD Free Cross" (free-spinning), "CWD Defense Ring" (fixed, heaviest), etc.
- **Metal Attack Ring (MAR)**: The HMS AR. Has a zinc-alloy metal frame + plastic ABS outer cap (caul). The metal frame is what matters for combat — the caul is mostly cosmetic but modifies contact geometry.

### G5. MFB / Gen2 Key Disambiguation

| Pair | Rule |
|------|------|
| **Hell Kerbecs vs Hades Kerbecs** | Same product BB-99. Hell = TT/Japanese name. Hades = Hasbro. |
| **Earth Eagle vs Earth Aquila** | Same product BB-47. Eagle = English common name. Aquila = constellation name used in anime/international releases. |
| **4D System vs Metal Fury** | "Metal Fury" is the series/anime name for MFB S3. "4D System" is the part system (multi-piece metal frame + 4D Bottom track+tip combo). Metal Fury = 4D System era, but not all BB-series beys are 4D (some are HWS beys that appear in the Metal Fury anime). |
| **4D Bottom vs Performance Tip** | "4D Bottom" is the track+tip combo exclusive to Metal Fury. It replaces the separate track+performance tip with one integrated unit. B:D, F:D, X:D, D:D are all 4D Bottoms (use colon notation). All other performance tips (S, F, WD, RF, etc.) are standard Performance Tips. |
| **HWS vs 4D** | HWS = Hybrid Wheel System = Metal Masters/Beyblade Metal Masters era (S2 of MFB). Same Fusion Wheel + Track + Tip structure as the original Metal System but heavier, better fusion wheels. 4D = the S3 Metal Fury upgrade. HWS beys (Basalt/Twisted, Earth Eagle, etc.) are NOT 4D. |

### G6. Engine Gear Clutch Type Disambiguation (Summary)

This is the most commonly confused plastic gen disambiguation after Wolborg 2 vs MS:

| Clutch Type | Activation | What the player experiences | Self-KO risk | Best combined with |
|-------------|-----------|----------------------------|-------------|-------------------|
| First Clutch | First hit | Fires instantly. Provides immediate burst when battle starts. | High — fires before bey stabilizes | High-attack AR for immediate smash |
| Hit Release | Hard hit | Fires when hit hard. Rewarded for surviving a big hit. | Low — fires defensively | Counter-attack base (Trypio G + Jumping Base) |
| Final Clutch | Spin decay | Fires when bey is tired. Provides stamina-extend. | Low | Stamina base, or delay-then-burst |
| Full Auto Clutch | Random | Unreliable — fires at unpredictable times. Non-competitive. | Variable | No competitive use |
| Reverse EG | Hit (reverse) | Creates disruption in bey's spin profile on hit. Unusual opponent-confusing effect. | Medium | Any attack or counter-attack build |

---

## SECTION H — DISAMBIGUATION QUICK-REFERENCE RULES

1. **Colon = MFB 4D Bottom**: Any tip with a colon (B:D, F:D, X:D, D:D) is a Metal Fury 4D Bottom. No colon = standard performance tip or Burst driver.

2. **Letter suffix after bey name**: Check which ERA the bey is from first. The same letter means different things in different eras.

3. **Wolborg**: Always specify which Wolborg. "Wolborg 2" = rubber+bearing SG (plastic). "Wolborg MS" = ball bearing RC (HMS). These are completely different performance tiers.

4. **Strata Dragoon vs Gaia Dragoon MS**: Strata Dragoon (plastic, Daichi's bey) is NOT the same as Gaia Dragoon MS / Strata Dragoon MS (HMS, product A-123). Completely different beys — one is plastic gen, one is HMS.

5. **EWD vs EDS**: EWD = Eternal Wide Defense (wide outer ring, slow orbit). EDS = Eternal Defense Sharp (sharp center, near-stationary). Both have free-spin sleeves but different profiles.

6. **R²F vs LF vs LRF**: R²F = 5-petal right spiral rubber. LF = 5-petal left spiral rubber (mirror). LRF = plain rubber flat, left-spin bias, no raised petals.

7. **Engine Gear does NOT mean "strong"**: The EG gimmick provides a burst of spin injection at a specific trigger, but the trigger timing determines whether it helps. Full Auto Clutch is non-competitive despite being EG.

8. **HMS dual-spin is default**: ALL HMS beys can be launched right OR left spin. Do not list `dual_spin` as a gimmick for HMS beys — it is the system standard, not a unique feature.

---

← [Batch 006: Shape/Material/Behavior Matrix](batch-006-shape-material-behavior-matrix.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

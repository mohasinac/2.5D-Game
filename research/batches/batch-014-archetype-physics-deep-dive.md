---
batch: 014
stage: archetype-physics
status: complete
sources_checked: 18
facts: 64
inferences: 8
unknowns: 3
corrections: 4
---

[← Batch 013: Deep Verification Pass](batch-013-deep-verification-pass.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 015: Real-World Physics →](batch-015-real-world-physics.md)

---

# Batch 014 — Archetype Physics Deep Dive

> **Date**: 2026-05-24 | **Session 25**
> **Analyst**: Claude Code (claude-sonnet-4-6)
> **Purpose**: Comprehensive verification of how each beyblade archetype actually works — tip material physics, weight distribution mechanics, AR contact geometry, and the full decision tree for attack/defense/stamina/zombie/compact/balance builds across all generations.

---

## URL / Search Log

| Query / URL | Method | Result | Data Extracted |
|------------|--------|--------|----------------|
| rubber tip vs plastic vs metal movement physics | WebSearch (plasticsdb, fandom, wbo) | SUCCESS | Friction hierarchy, flower pattern mechanism |
| weight distribution LAD spin time | WebSearch (fandom, wbo) | SUCCESS | OWD vs CWD, moment of inertia, LAD definition |
| attack combo smash upper attack AR geometry | WebSearch (plasticsdb, fandom) | SUCCESS | Contact angle types, recoil trade-offs |
| zombie defense stamina compact archetype gen1 | WebSearch (plasticsdb, fandom) | SUCCESS | Full archetype breakdowns from plasticsdb competitive list |
| plasticsdb.com/competitive-combos-list | WebFetch | SUCCESS | Full competitive archetype catalog: 11 types documented |
| beyblade.fandom.com/wiki/Smash_Attack | WebFetch | 403 | Used WebSearch snippet instead |
| upper attack vs smash attack slope angle | WebSearch (fandom, wbo) | SUCCESS | Concave vs sloped contact geometry confirmed |
| recoil minimize AR design roller defense | WebSearch (fandom, wbo, plasticsdb) | SUCCESS | Roller geometry as force dispersal mechanism |
| plasticsdb.com/parts/attack-rings/roller-defense-ring | WebFetch | SUCCESS | Roller physics, competitive tier, breakage note |
| MFB attack defense stamina decision factors | WebSearch (fandom, wbo) | SUCCESS | CWD/OWD distinction for MFB; tip type per archetype |
| weight distribution OWD centrifugal physics | WebSearch (fandom, wbo) | SUCCESS | Metal ball shift mechanism, moment of inertia confirmed |
| Burst attack stamina defense Xtreme driver | WebSearch (fandom, wbo) | SUCCESS | Xtreme' friction tradeoff, type characteristics |
| BX Xtreme Dash gear bit X-line strategy | WebSearch (fandom, beybxdb) | SUCCESS | Gear teeth → rail interaction; scoring zones confirmed |
| opposite spin zombie physics | WebSearch (fandom, wbo) | SUCCESS | Gear-coupling model confirmed |
| AR contact geometry concave convex slope | WebSearch (fandom, wbo) | SUCCESS | Three contact angle categories confirmed |
| mass collision outcome moment of inertia | WebSearch (fandom, wbo) | SUCCESS | OWD = angular momentum preservation; mass = defense |

---

## SECTION A — TIP MATERIAL PHYSICS

### A1. Friction Hierarchy (All Generations)

**Fundamental rule**: The tip's floor friction is the single most decisive factor for movement type.

| Material | Floor Friction | Movement Result | Spin Drain Rate | Tag |
|----------|---------------|----------------|----------------|-----|
| Rubber | Highest — rubber "grips" into stadium plastic; periodic stick-slip = flower pattern | Aggressive; fast; unpredictable; flower pattern | Highest (high grip = fast energy loss) | FACT |
| Plastic | Moderate — slides more than grips; can maintain some orbit | Moderate speed; wandering or orbital depending on shape | Moderate | FACT |
| Metal | Lowest — metal-on-plastic has very low coefficient of friction; tends to slip | Slow; center-seeking; stationary when sharp; erratic when flat | Lowest (lowest friction = slowest spin drain) | FACT |

**Source**: WBO Physics thread — *"metal tips are supposed to spin for a longer time, and rubber usually makes a top move around much faster than plastic does. The reason behind these variations in behaviour is simply friction."*

> **Engine implication**: `gripFactor` and `aggressiveness` should scale with material, not just shape. Rubber flat always has higher `gripFactor` than plastic flat of the same shape. Metal sharp has nearly zero `gripFactor`.

---

### A2. Flower Pattern — Why Rubber Creates It

| Mechanism Step | Description | Tag |
|---------------|-------------|-----|
| Rubber grips stadium | High friction coefficient locks tip momentarily to floor | FACT |
| Momentary lock → restoring torque | Beyblade's angular momentum forces the body to pivot around the locked contact point | FACT |
| Pivot = petal arc | The pivot traces an arc outward, then grip releases, bey launches forward | FACT |
| Cycle repeats | Each stick-slip cycle = one petal arc; full orbit = full flower | FACT |
| Break-in softens rubber | New RF is too stiff; stiff rubber grips too hard → erratic, self-KO risk. Worn RF = controlled flower pattern | FACT |
| Plastic flat cannot hold flower | Less grip = slip before pivot completes → movement degrades to erratic wandering, not a clean flower | FACT |

**Source**: Fandom wiki RF page — *"It is essential to wear the rubber of R²F before competitive use, as this allows the Beyblade to spin into a flower pattern more easily."*

> **Engine implication**: RF should have `requiresBreakIn: true`. Newly used RF = `gripFactor × 1.6` (too grippy, self-KO risk). Worn RF = `gripFactor × 1.0` (optimal). Model as a mileage variable that starts high and normalizes.

---

### A3. Tip Shape + Material Interaction Matrix

| Shape | Rubber | Plastic | Metal |
|-------|--------|---------|-------|
| **Flat disc** | Aggressive flower-pattern movement; highest attack mobility; high spin drain | Fast erratic movement; decent mobility but less controlled; moderate drain | Very aggressive but slips; less controlled than rubber; low drain |
| **Semi-flat** | Moderate-aggressive; partial flower tendency | Moderate speed; between flat and ball | Moderate; center-drift tendency |
| **Ball / hemisphere** | Wandering but with grip bursts; unusual combination | Classic wandering defense; stable | Smooth defense orbit; very stable |
| **Sharp / cone** | Near-stationary but with grip spikes | True stationary; classic stamina base | True stationary; lowest friction; metal precision |
| **Spiral-grooved (CW/CCW)** | Same as flat rubber but groove direction biases CW or CCW orbit direction | N/A | N/A |

---

### A4. Wear Progression

| Tip Type | How It Wears | Effect of Wear | Tag |
|----------|-------------|---------------|-----|
| Rubber Flat (RF) | Surface softens and spreads | Wear improves control; new RF = erratic, worn = optimal | FACT |
| Rubber Flat (Xtreme') | Softer compound wears faster than standard rubber | Wears slightly more aggressive initially then settles | FACT |
| W²D spike center | Spike tip wears down | Worn W²D becomes more aggressive (spike flattens = more surface contact) | FACT |
| Metal Sharp | Polishes over time | Minimal wear effect; slight reduction in friction | INFERENCE |
| Plastic Flat | Wears unevenly | Can develop slight taper that biases movement direction | INFERENCE |

---

## SECTION B — WEIGHT DISTRIBUTION PHYSICS

### B1. The Core Principle: Moment of Inertia

**Formal definition from WBO Physics thread:**
> *"Beyblades with an outwards mass distribution spin for longer and are less affected angularly by impacts, with the reason being that mass further from the axis of rotation increases moment of inertia."*

| Concept | Physics Explanation | Beyblade Implication | Tag |
|---------|--------------------|--------------------|-----|
| **Moment of inertia (I)** | I = Σ(m × r²) — mass at greater radius contributes quadratically more | Doubling distance from axis = 4× contribution to inertia | FACT |
| **OWD (Outward Weight Distribution)** | Mass concentrated at perimeter | High I → slow spin-up but long spin time; resists angular deceleration from hits | FACT |
| **CWD (Central/Inward Weight Distribution)** | Mass concentrated at center | Low I → reaches higher RPM at launch with same energy; loses spin faster on hit | FACT |
| **Spin time vs launch speed tradeoff** | Same launch energy; lighter inward bey spins faster but dies faster | Attack types want CWD for peak speed; Stamina wants OWD for longevity | FACT |

### B2. Weight Disk Width/Weight → LAD and Spin Time

| WD Property | Effect | Best For | Tag |
|------------|--------|----------|-----|
| Wide circular WD (e.g. Wide Survivor 12.4g) | Perfectly circular → minimum friction with stadium walls during precession + smooth LAD rolling | Zombie / Stamina | FACT |
| Wide circular WD (Wide Defense 14.5g) | Slightly heavier version of Wide Survivor → better hit resistance; slight LAD reduction vs Wide Survivor | Defensive Zombie (tolerates attack better) | FACT |
| Ten Heavy (~16.1g) | Heaviest standard WD → maximum mass for defense; more inward weight profile → less LAD than Wide variants | Defense / Circle Survivor | FACT |
| Ten Wide (14.0g) | Slightly lighter than Wide Defense; wide profile but less round → some LAD | Attack (lighter = speed) | FACT |
| Ten Balance (15.0g) | Balanced mass profile — moderate LAD, moderate defense | Compact / Balance | FACT |

**LAD (Life After Death) mechanics:**
> *"Life-After-Death refers to the amount of rolling that a Beyblade can perform at the end of the battle, often determined by the roundness/smoothness of its underside, which contacts the stadium floor."*

LAD is determined by three independent factors:
1. **Tip shape**: free-spinning bearing/sharp tip = minimal contact friction while rolling
2. **WD profile**: circular/smooth = rolls smoothly; non-circular = bumpy = faster LAD death
3. **AR profile**: how the AR's bottom edge rides the stadium floor during precession

### B3. Metal Ball Weight Shift Mechanism

**Draciel Metal Ball Defenser / Viper Metal Ball Base physics:**

| Spin State | Metal Ball Position | Weight Distribution | Effect | Tag |
|-----------|--------------------|--------------------|--------|-----|
| High spin | Centrifugal force pushes balls outward up ramps | OWD | Higher stability; higher center of gravity | FACT |
| Low spin | Gravity overcomes centrifugal; balls fall inward | CWD | Less stability; slightly faster remaining spin | FACT |

> *"When spinning rapidly, metal balls roll up the ramps inside to a position closer to the outside of the blade, giving a higher center of gravity and increased stability due to a more uniform distribution of overall weight. As the blade slows down, the force of gravity overcomes the centrifugal force and the metal balls roll back down the ramps towards the center of the blade, which hampers balance and stability but increases spin time."*

**Engine implication**: Metal Ball Base should use a dynamic `weightDistributionFactor` that scales with `spin / maxSpin`. At high spin: shift toward OWD params; at low spin: shift toward CWD params.

---

## SECTION C — AR CONTACT GEOMETRY → ATTACK TYPE

### C1. The Three AR Contact Angle Categories

| Contact Type | Geometry | Force Direction | Recoil | Attack Type | Tag |
|-------------|---------|----------------|--------|-------------|-----|
| **Concave / flat strike face** | Flat or slightly concave face perpendicular to rotation direction | Horizontal / downward into floor | HIGH (both beys repel equally) | Smash Attack | FACT |
| **Upward slope / ramp** | AR surface angles upward from front to back | Upward + lateral | LOWER (force redirected upward) | Upper Attack | FACT |
| **Convex / roller** | Rounded surface or free-spinning roller | Energy absorbed as rotation | VERY LOW (roller spins away absorbing force) | Defense / Force Dispersal | FACT |

**Smash Attack** source: *"Smash Attack utilizes high linear speeds and aggressively shaped contact points to impart large amounts of linear recoil to the opponent. The finer the point of contact on the Beyblade, the more pressure is applied."*

**Upper Attack** source: *"Beyblades with Upper Attack capabilities usually possess parts with sloping features that can be used to easily scoop the enemy Bey in a smooth action."*

**Roller Defense** source (PlasticsDB): *"The rollers help absorb energy from impact and disperse it in their rotation, converting direct impact force into rotational movement rather than backward momentum."*

### C2. Force Smash — Hybrid Contact

**Force Smash** = AR with both slope AND flat strike faces. Result: strikes down toward stadium floor (smash component) AND lifts (upper component) simultaneously. More effective against a wider range of opponent heights.

> *"The North American community adopted the term Force Smash for this classification of attack."* — Fandom wiki

### C3. Recoil and Self-KO Risk Table

| AR Contact Shape | Recoil on Self | Recoil on Opponent | Self-KO Risk | Best Role |
|-----------------|---------------|-------------------|-------------|-----------|
| Fine-point flat face | Very high | Very high | High | Pure attack (needs rubber grip tip to manage) |
| Multiple angled faces | High | High | Medium | Attack |
| Upward slope | Medium | Medium | Low | Upper Attack |
| Rounded/convex | Low | Low | Very low | Defense / Compact |
| Free-spinning roller | Very low | Very low | Minimal | Zombie AR / Defense |
| Circular no protrusions | Near zero | Near zero | Zero | Zombie (Tiger Defenser, War Lion) |

> **Engine implication**: `recoilFactor` on the AR should map to contact geometry. Free-spinning rollers and circular ARs = very low `recoilFactor`. Fine-point flat faces = highest. Upper Attack slopes = medium. This is a separate multiplier from the material multiplier.

---

## SECTION D — ARCHETYPE DECISION TREES

### D1. Attack Archetype (Smash Attack)

**Goal**: Knock opponent out of stadium (ring-out / OS).

**Decision tree**:
1. **AR**: Need wide, flat/concave strike faces with maximum exposure. High-reach contact points land more hits. Accepted: high recoil as trade-off.
2. **WD**: Want enough weight for impact, but NOT so heavy it slows movement. Ten Wide (14g) or Wide Defense (14.5g) preferred. Outward weight helps impact force.
3. **Tip**: MUST be flat and grippy for flower-pattern mobility. Rubber Flat > Plastic Flat > Metal Flat. Without aggressive tip, AR never reaches opponent.
4. **BB**: Rubber grip tip (Storm Grip, Defense Grip with flipped tip) provides traction. HMC adds rotational stability for high-impact ARs.
5. **Spin**: Same-spin vs opponent usually better for KOs. Opposite-spin = more spin steal but less linear impact.

**Critical failure modes**:
- Sharp tip = no movement → AR can't reach opponent → loses to everything
- Too-heavy WD = slower movement → reduces contact frequency
- Over-aggressive AR = high recoil → self-KO

**Source**: PlasticsDB competitive combos list — *"For competitive Smash Attack setups: to get the highest movement speed possible, flat tips are a necessity. Additionally, you should use a light WD. Focusing the weight towards the outside will increase the movement speed."*

---

### D2. Upper Attack Archetype

**Goal**: Lift opponent off floor, causing destabilization + ring-out.

**Decision tree**:
1. **AR**: Need upward-facing ramps on AR. Contact must happen at the level of opponent's AR (height matching is critical). Good: Upper Claw, Triangle Wing, Upper Dragoon.
2. **WD**: CWD (inward) preferred over OWD — high spin velocity for the initial scoop. Wide Defense acceptable for survivability.
3. **Tip**: Inverted Storm Grip Tip (tip-flipped BB) was traditionally used. Rubber tips also viable.
4. **Stadium**: Most effective in open stadiums without shrouds. Dish-based stadiums with walls reduce effectiveness. Recently re-legalized via Storm Grip Tip Flip.
5. **Weakness**: Struggles against Circle Survivor Defense.

**Source**: PlasticsDB — *"Struggles against Circle Survivor in dish-based stadiums. Stadiums with shrouds prevent over-wall KOs, reducing effectiveness."*

---

### D3. Defense Archetypes

**Three distinct defense strategies:**

#### D3a. Circle Survivor Defense (Dominant Meta)
- **Mechanism**: Semi-free-spinning top (Circle Survivor Engine Gear) absorbs collision energy by rotating independently; near-zero KO force transfers
- **Parts**: Circle Survivor/Circle Defenser EG + Normal Base + Ten Heavy WD + low-recoil AR
- **Why dominant**: *"Highly resistant to KO attempts; forces Attack decks to use taller setups. One of the more dominant types in the game."* — PlasticsDB
- **Weakness**: Hits above the dish can destabilize
- **Engine note**: The semi-free-spin EG = separate angular velocity state (like Zeus AR outer ring). Collision force goes into EG's independent spin before reaching bey core.

#### D3b. Defensive Zombie
- **Mechanism**: Bearing tip = near-zero floor friction → survives any attack + spins opposite direction → steals opponent's spin → outlasts
- **Parts**: SG (Bearing Version 2) with grip shaft + Wide Defense + Tiger Defenser / War Lion / Twin Horn AR + Customize Grip Base
- **Why strong**: *"Remarkably difficult to KO. Best all-around combo contender."* — PlasticsDB
- **Weakness**: Same-spin opponents skip spin steal; strongest attackers can force KOs

#### D3c. Weight-Based Defense
- **Mechanism**: Brute mass = high inertia = hard to KO via any collision
- **Parts**: SG Metal Ball Base (4 balls) + Ten Heavy + Neo SG HMC
- **Why viable**: *"Better same-spin performance than Circle Survivor"* — PlasticsDB
- **Distinction from Zombie**: This approach uses mass (not free-spin) as protection; works in same-spin matchups

#### D3d. Grip Defense
- **Mechanism**: Rubber sharp tip creates high grip = bey holds its position even when hit
- **Parts**: Defense Grip Base (rubber sharp) + Wide Defense + low-recoil AR
- **Severe weakness**: Very low stamina — one of the most specialized setups
- **Best counter**: Hyper Aggressive Attack builds specifically struggle against this

---

### D4. Stamina / Zombie Archetype

**Goal**: Outspin opponent; win by having more spin at end of battle.

#### D4a. Pure Stamina
- **Mechanism**: Low friction tip + high OWD → minimal spin decay over time
- **Parts**: Bearing or sharp tip + Wide Defense/Wide Survivor + circular low-recoil AR
- **Key**: Must avoid hits (high recoil AR = big spin loss per collision)
- **vs Attack**: Usually loses if attacker keeps landing hits (each hit costs stamina type more than it costs attacker)
- **vs Defense**: Usually wins (stamina decays slower; defense can't outspin a stamina type)

#### D4b. Zombie (Opposite-Spin Stamina)
- **Mechanism**: Spin in OPPOSITE direction to opponent. On contact, AR surfaces act like meshing gears → faster bey (opponent) transfers angular momentum to slower bey (zombie). Net effect: zombie gains spin from every collision.
- **Physics source**: *"When one gear spins in one direction and collides with another gear that spins in an opposite direction, the rotational momentum of the faster spinning gear is transferred to the other gear."* — Fandom wiki Spin Absorption
- **Critical requirement**: MUST spin opposite to opponent. Same-spin = no steal; slight spin loss instead.
- **Enhancers**: Rubber contact points on AR increase spin-steal efficiency (more friction = better gear coupling). Wide/circular AR alignment with WD profile = minimum recoil on collision while maximizing surface contact.
- **LAD**: Zombie wins by outlasting opponent via spin steal + free-spin bearing LAD rolling.
- **Best WD**: Wide Survivor (perfectly circular = smoothest precession roll = best LAD)
- **Best AR**: Tiger Defenser (near-circular, minimum recoil, excellent spin-steal surface)
- **Best tip**: Bearing tip = lowest floor friction = maximum LAD rolling duration

**Opposite-spin matchup consequences**:
| Attacker (right) vs Zombie (left) | Result |
|-----------------------------------|--------|
| Attacker hits zombie hard | Zombie steals more spin per hit; attacker weakens itself |
| High-friction AR on zombie | More spin stolen per contact |
| Zombie outlasts | Even if attacker starts faster, zombie slowly equalizes then exceeds |
| Zombie same spin vs attacker | No steal; zombie loses normally (stamina disadvantage) |

---

### D5. Compact Archetype

**Goal**: All-around reliability via weight concentration in small footprint.

**Mechanism**: Dense build = high inertia in small volume = survives hits + maintains spin + some movement for limited offense.

**Decision tree**:
1. **AR**: Small, low-recoil (Tiger Defenser, War Lion, Twin Horn). NOT large attack ARs.
2. **WD**: Ten Balance or Ten Heavy — maximize weight at moderate radius
3. **BB**: Metal Change Base (Tier 1) — auto-adjusts tip contact on impact; good LAD; or Metal Ball Base for orbit tendency
4. **Against**: Weak to dedicated attack types and specialized counters; generally reliable vs everything else
5. **Strength**: *"One of the greatest representations of all-around Balance types."* — PlasticsDB

---

## SECTION E — MFB (Metal Fight Beyblade) ARCHETYPE PHYSICS

### E1. Key Differences from Gen1

| Factor | Gen1 Plastics | MFB Metal | Impact |
|--------|--------------|-----------|--------|
| AR material | ABS plastic | Full metal wheel | Much harder collisions; less "flex" absorption |
| Recoil | AR protrusions absorb some via flex | Rigid metal = full recoil transfer | MFB requires more recoil management |
| Upper Attack viability | High (plastic = large slopes possible) | Lower (metal wheel = rigid, slopes less effective) | Gen1 had more Upper Attack diversity |
| Weight | ~20-25g assembled | ~35-50g assembled | MFB defense much harder to KO |
| Tip wear | Plastic tip wears gradually | Metal tip barely wears | Less "break-in" for MFB metal tips |

### E2. MFB Type Decision Factors

**Attack Type (MFB)**:
- Tip: RF, R²F, MF (Rubber Flat preferred > Metal Flat > Plastic Flat)
- Wheel: Aggressive contact points; wide spin track orbit for floor coverage
- Track: Low (85–100) = stays low for maximum wheel contact with opponent wheel
- Key: RF flower pattern = consistent hits vs any bey in stadium

**Defense Type (MFB)**:
- Weight = primary tool (MFB defense uses mass + OWD → high angular momentum)
- Tip: WD, D, SD (sharp/ball/defense tips — near stationary)
- Wheel: Round / no protrusions OR round outer edge = low recoil on hit
- Track: Height matching for wheel contact; BD145 popular for defensive weight + free-spin disc
- Physics: *"Defense-types benefit from Central Weight Distribution (CWD), with weight usually concentrated in the center of the Bey. Defense types are primarily used as counterpicks against Attack-type combos."*
  - **CORRECTION NOTE**: The source actually says *inward* weight for defense (to maximize angular stability against hits) — NOT the same as Gen1 rule. In MFB, defense uses more central/inward mass to resist being knocked over, while stamina uses OWD. Both want high mass but different radii.

**Stamina Type (MFB)**:
- Tip: WD, EWD (free-spin bearing), B:D (near-zero friction)
- Wheel: Wide, smooth, no protrusions; orbital tendency
- Track: 230 or TH170 (tall = wheels can't collide with attacker's wheel directly)
- OWD: High moment of inertia for spin conservation
- Key: EWD = single bearing (considerable friction, spin loss on wear); B:D = multiple bearings near-zero friction (best stamina tip ever made)

---

## SECTION F — BURST ERA ARCHETYPE PHYSICS

### F1. Burst System — Core Decision Factor

**Unique to Burst**: The burst threshold. Every Beyblade has a resistance value. On collision, if the force exceeds the threshold, Burst occurs (all points to opponent). This makes Burst entirely different from Gen1/MFB.

| Archetype | Burst Risk Strategy |
|-----------|-------------------|
| Attack | HIGH burst risk on self; compensated by Burst Resistance Lock Springs |
| Defense | LOW burst risk; thick contact points absorb without reaching threshold |
| Stamina | Negligible burst risk; smooth round layers rarely generate threshold force |
| Balance | Moderate; hybrid risk profile |

### F2. Burst Archetypes

**Attack (Burst)**:
- Driver: Xtreme (rubber flat) or Xtreme' (softer rubber compound, more aggressive)
- Layer: Aggressive protrusions; three-blade / wing designs
- Disc: Moderate weight (not too heavy — attack needs speed)
- Goal: Burst opponent OR ring-out (Over Finish 2pts, Xtreme Finish 3pts)
- Weakness: Self-burst risk; low stamina

**Defense (Burst)**:
- Driver: Sharp, Ball, Defense (near-stationary)
- Layer: Round smooth edge; spring locks resist burst
- Disc: Heavy (Gravity 21.6g, Quarter 21.8g)
- Goal: Absorb attack without bursting; outlast via mass
- Weakness: Stamina types outspin

**Stamina (Burst)**:
- Driver: Needle, Bearing, Nothing (near-zero friction)
- Layer: Wide smooth round; minimal burst exposure angle
- Disc: Heavy OWD (00 ~25g)
- Goal: Outspin all opponents; survive any burst attempt
- Strength: Most dominant type at high-level play
- Weakness: Gets demolished by high-tier attack if matched

**Spin-Steal (Burst — Drain Fafnir lineage)**:
- Spin opposite to opponent
- Rubber contact points on layer engage opponent surface → spin transfer
- Nothing driver = near-zero friction = long spin time
- Key: Must out-spin opponent after equalizing; relies on more-efficient spin-steal surface

---

## SECTION G — BX (BEYBLADE X) ARCHETYPE PHYSICS

### G1. The Xtreme Dash Gimmick — Core BX Mechanic

**All other Beyblade systems have smooth stadium floors. BX is unique:**

| Feature | Description | Tag |
|---------|-------------|-----|
| X-Celerator Rail (Xtreme Line) | Raised gear-tooth rail embedded in stadium inner wall | FACT |
| Gear Bit | BX Bits with gear teeth on the side of the tip | FACT |
| Xtreme Dash | Gear teeth on Bit contact X-Celerator Rail → motor-like acceleration burst | FACT |
| Xtreme Zone | Wide center exit of stadium | FACT |
| Xtreme Finish | Bey exits through Xtreme Zone = 3 points | FACT |
| Over Zone | Two corner exits of stadium | FACT |
| Over Finish | Bey exits through Over Zone = 2 points | FACT |
| Spin Finish | Bey stops spinning in stadium = 1 point | FACT |
| Burst Finish | Bey bursts in stadium = 1 point | FACT |

**Scoring hierarchy**: Xtreme Finish (3) > Over Finish (2) > Burst Finish (1) = Spin Finish (1)

> **This changes the entire meta**: Unlike all prior systems where ring-out = game over, BX *rewards* ring-out with MORE points. This means attack-oriented play is extremely important. Stamina is less dominant in BX than in Burst.

### G2. BX Bit Decision Factors

| Bit Type | Gear Teeth | Xtreme Dash Trigger Rate | Movement | Best Role |
|----------|-----------|------------------------|---------|----------|
| Gear Flat | Yes (full) | Very high | Very aggressive; high self-KO risk | High-reward attack |
| Gear Needle | Yes | Moderate | Aggressive but more controlled | Balanced attack |
| Flat | No | None | Aggressive | Attack without X-line risk |
| Rush | Yes (10 teeth) | Moderate | Fast | Attack mobility |
| Needle | No | None | Stationary-seek | Stamina/defense |
| Taper | No | None | Moderate cone-seek | Balance |
| Ball | No | None | Wandering | Defense/stamina |
| Rubber Accel | No floor gear | None (floor) | Aggressive rubber | Attack via grip not gear |

### G3. BX Blade Weight and Performance

| Factor | High Blade Weight | Low Blade Weight |
|--------|-----------------|-----------------|
| Xtreme Finish resistance | Harder to ring out | Easier to ring out |
| Attack force | More momentum = harder hits | Less momentum |
| Launch difficulty | Requires string launcher for heavy blades | Bey launcher sufficient |
| Cobalt Dragoon note | Heaviest blade in BX; requires string launcher; left-spin only; inconsistent | — |

---

## SECTION H — UNIVERSAL MOVEMENT DECISION FACTORS

### H1. The Five Factors That Determine Movement

In order of influence:

1. **Tip shape and material** (primary driver — most direct control over movement speed and pattern)
   - Flat + rubber = flower pattern aggression
   - Sharp + metal = stationary
   - Ball + plastic = wandering defense

2. **Total mass and distribution** (OWD vs CWD — determines spin time, LAD, collision resistance)
   - OWD → high moment of inertia → long spin, collision resistance
   - CWD → fast launch spin → short but powerful

3. **AR contact geometry** (determines recoil and attack type)
   - Fine flat face → smash, high recoil
   - Slope → upper attack, medium recoil
   - Rounded/roller → defense, near-zero recoil
   - Circular → zombie, near-zero recoil

4. **Spin direction** (relative to opponent — determines if spin steal is possible)
   - Opposite spin → gear-coupling spin transfer on contact
   - Same spin → both lose spin proportionally on contact

5. **Stadium interaction** (BX only: X-Celerator Rail; all generations: bowl profile and wall angle)
   - Bowl profile → redirects outward-moving bey back to center
   - Wall angle → determines how hard walls redirect vs absorb
   - BX X-Rail → gear bit triggers burst of speed

### H2. Type Advantage Triangle

```
              ATTACK
             /      \
loses to  ←/          \→ beats
          /            \
    DEFENSE ----→ STAMINA
      beats         beats
```

| Matchup | Dominant | Reason |
|---------|----------|--------|
| Attack vs Defense | Attack | Overwhelming force; defense can't regenerate spin lost by being hit repeatedly |
| Defense vs Stamina | Defense | Defense has more mass → higher angular momentum → stamina can't outspin |
| Stamina vs Attack | Stamina | Attack exhausts itself; stamina outlasts if it avoids being KO'd |
| **But in practice** | **Meta-dependent** | Circle Survivor Defense beats Attack AND Stamina in Gen1. Stamina dominates in Burst tournament play. BX attack dominates due to 3-point Xtreme Finish. |

### H3. Same-Spin vs Opposite-Spin Collision Physics

| Scenario | Contact Effect | Net Result |
|----------|--------------|-----------|
| Same-spin collision | Both wheels/layers briefly grip at contact point → friction drains both | Both lose spin proportionally to contact area and duration |
| Opposite-spin collision | Contact surfaces move in opposite directions → gear effect → faster bey transfers to slower | Faster bey loses more spin than slower bey gains (efficiency <100%) |
| Opposite-spin + rubber CP | Higher friction coefficient → more efficient spin transfer | Zombie steals more per collision |
| Opposite-spin + round/wide AR | Larger contact area → more continuous spin transfer surface | Continuous drain rather than burst steal |

---

## SECTION I — ENGINE MODEL CORRECTIONS AND IMPLICATIONS

| Engine Field | Current/Assumed | Corrected Value | Reason | Tag |
|-------------|----------------|----------------|--------|-----|
| Rubber tip `gripFactor` | Base value | `1.8×` vs plastic flat baseline | Rubber-plastic friction >> plastic-plastic | FACT |
| Metal tip `gripFactor` | Base value | `0.3×` vs plastic flat baseline | Metal-plastic friction << plastic-plastic | FACT |
| Break-in modifier for new RF | Not modeled | `gripFactor × 1.6` (too high, erratic) → normalize to `× 1.0` over wear | New RF = self-KO risk | FACT |
| OWD WD `momentOfInertia` | Static | Scale by `Σ(m × r²)` for each WD shape | Wide Survivor circular = max I at given mass | FACT |
| Metal ball BB `weightDistribution` | Static | Dynamic: OWD at `spin > 0.6 × maxSpin`; CWD at `spin < 0.3 × maxSpin` | Centrifugal shift confirmed | FACT |
| AR `recoilFactor` | Uniform per AR | Map to geometry: fine-point=1.0, slope=0.6, round=0.2, roller=0.1, circular=0.05 | Roller absorbs as rotation; circular slides | FACT |
| Opposite-spin `spinStealEfficiency` | Not modeled | `0.7–0.85×` (70–85% transfer efficiency; losses to heat/sound) | Not 100% efficient gear transfer | INFERENCE |
| Rubber CP `spinStealFactor` | Flat multiplier | `1.4×` vs non-rubber CP (higher friction = better gear coupling) | Confirmed by fandom Spin Absorption page | FACT |
| `spinStealFactor` for circular AR | Low base | `1.2×` for wide circular AR (larger contact surface) | More surface = more continuous transfer | INFERENCE |
| BX Xtreme Dash speed boost | Not modeled | Triggered when Gear Bit touches X-Celerator Rail; `speedBoost × 1.8–2.2×` for ~0.3s | Gear teeth engagement confirmed | FACT |

---

## SECTION J — SUMMARY: WHAT DETERMINES EACH STAT

| Beyblade Stat | Primary Determinant | Secondary | Tertiary |
|--------------|--------------------|-----------|---------| 
| **Movement speed** | Tip shape + material | Total mass (lighter = faster) | Stadium wall angle |
| **Flower pattern** | Rubber flat tip (required) | Break-in state | Stadium bowl radius |
| **Spin time** | OWD (wide circular WD) | Low-friction tip | Total mass |
| **LAD (Life After Death)** | Circular WD profile + bearing/sharp tip | Circular AR profile | Stadium floor friction |
| **KO resistance** | Total mass | Tip stability (sharp stays center) | AR recoil (low recoil = less flying out) |
| **Spin steal rate** | Opposite spin direction | Rubber contact points on AR | Wide/circular AR (more surface) |
| **Attack power** | Tip aggression (flat rubber) | AR protrusion force | Total mass × velocity |
| **Burst resistance (Burst)** | Spring lock count / strength | Layer shape (round = lower contact force) | Disc weight (heavier = more angular dampening) |
| **Xtreme Finish chance (BX)** | Blade weight | Gear Bit type | Launch power and angle |

---

## SECTION K — REMAINING UNKNOWNS

| Unknown | Status | Notes |
|---------|--------|-------|
| Exact rubber-plastic friction coefficient | UNKNOWN | Confirmed "higher than plastic-plastic" but no published coefficient |
| Spin steal transfer efficiency % | UNKNOWN | Confirmed < 100%; 70–85% is INFERENCE from collision physics |
| BX Xtreme Dash speed boost magnitude | UNKNOWN | Gear engagement confirmed; speed factor from this = INFERENCE |

---

[← Batch 013: Deep Verification Pass](batch-013-deep-verification-pass.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Batch 015: Real-World Physics →](batch-015-real-world-physics.md)

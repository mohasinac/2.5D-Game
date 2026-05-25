# Physics Chain: Part 7

**« Part 6:** [6 case study.md](6%20case%20study.md) (Cases 297–353)

---

## How to Write a Case Study

### Trigger Rule
Write a case **only** when the user actively provides wiki data and/or images for a part. Never write speculatively from general knowledge. Skip Hasbro-only systems.

### Case Header
```
## Case N — Part Name (X.X g)
```
N is the next sequential number. Weight in grams from wiki spec.

### Required Sections (in order)

**1. Thesis** — one paragraph. State the key physics claim about this part: what geometry drives its behaviour, what metric dominates, what competitive consequence follows. No marketing language, no adjectives like "great" or "amazing."

**2. Geometry** — ASCII diagram (top-view or side-view as appropriate) labelled with real dimensions from the wiki spec. Include: outer radius r_o, inner radius r_i, height, wall count/symmetry order, tip angle if applicable.

**3. Physics analysis sections** — one or more named sections (e.g. "Moment of Inertia", "Contact Mechanics", "Spin Decay", "Recoil Analysis"). Each section:
- States the physical model being applied
- Shows the equation in display form first
- Substitutes real values and computes a numeric result
- Uses SI units throughout (kg, m, N, rad/s, N·m)
- Converts from wiki units (g → kg, mm → m) explicitly inline

**4. TypeScript model** — fenced \`\`\`typescript block. Functions named after the part/phenomenon (camelCase). Parameters in natural units (g, mm, deg) with internal conversion to SI. Followed by `//` comment lines showing sample calls with arrow `→` and result + brief label. No multi-line comments or docstrings.

### Physics Formulas in Use (reference)

| Quantity | Formula |
|----------|---------|
| Annular disk inertia | `I = ½m(r_i² + r_o²)` |
| Multi-zone I_total | Sum of zone annular I values |
| Specific inertia | `I/m` in m² |
| Angular momentum | `L = I × ω` |
| Angular momentum deficit | `1 − (I_challenger × ω) / (I_target × ω)` |
| Spin decay rate | `dω/dt = τ_friction / I_total` |
| MFB stamina decay | `dω/dt = 8 × (1 − stamina × 0.001)` |
| Contact smash fraction | `cos(φ)` where φ = contact face angle from radial |
| Contact recoil fraction | `sin(φ)` |
| Centrifugal mode switch | `ω_c = √(F_ret / (m_arm × r_cam))` |
| Dynamic imbalance onset | `ω_cross = √(μ_s × g / Δr_CoM)` |
| Rubber traction (adhesive) | `F = μ_bulk × W + τ_adh × A_contact` |
| Hertzian contact (sphere) | `a = (3WR / 4E*)^(1/3)` |
| Sneddon cone contact | `a² = Pπ / (2E* tan α)` |
| Aerodynamic drag torque | `τ_aero ∝ A_frontal × r_eff² × ω²` |
| L-spin amplification | `1 + μ_rubber/μ_ABS` |
| Crown floor-scrape angle | `θ = arcsin((h_track + h_raise) / r_outer)` |
| Bump peak force | `F_peak = J / (σ_bump × √(2π))` |
| Rubber ring-out threshold | `J = m × μ × g × Δt_settle` |
| Indent recoil angle | `φ = arctan(d / pitch)` |
| Iron-powder volume fraction | `φ_p = Δm / (V_total × (ρ_powder − ρ_ABS))` |

### Material Constants (use consistently)
| Material | E (GPa) | ρ (kg/m³) | μ_kinetic |
|----------|---------|-----------|-----------|
| Zinc alloy (MFB MW) | 100 | 6600 | — |
| ABS plastic | 2.3 | 1050 | 0.35 |
| Rubber tip | 0.002 | 1200 | 0.85 |
| Hard tip (SP/S/D) | 2.3 | 1050 | 0.17 |
| Soft rubber flat (RF) | 0.002 | 1200 | 0.85 |
| Combined E* (rubber-ABS) | 0.0006 | — | — |
| Air (ρ) | — | 1.225 | — |
| Iron powder | — | 7874 | — |

### Symmetry Labels
- C₁ = no rotational symmetry
- C₂ = 2-fold (180° repeat), nutation forcing at 2ω
- C₃ = 3-fold (120° repeat), zero transverse anisotropy
- C₄+ = higher symmetry, increasingly isotropic

### Part-Type Checklist (Beyblade X: BX / UX / CX)

**BX Blade:** inertia (3-zone: zinc contact points, PMMA body, metal launcher hooks), specific inertia vs UX equivalent, recoil angle at contact face, Expand Blade rigidity delta (center bridge vs standard).

**UX Blade:** inertia (3-zone: zinc contacts, PMMA body, resin launcher hooks), OWD delta vs BX equivalent (mass shifted outward by hook material swap), contact face recoil angle, Ratchet-Integrated Blade: combined Blade+Ratchet inertia as single zone sum.

**CX Main Blade:** inertia (zinc contact zone + PMMA body zone), contact face recoil angle, system inertia fraction vs Assist Blade. Expand variant: Metal Blade inertia + Over Blade (PMMA) inertia summed separately.

**CX Assist Blade:** PMMA-only inertia, height contribution, contact angle at tip, system inertia fraction vs Main Blade. Varies per part — note height and radial reach.

**CX Lock Chip:** mass contribution only (low inertia, inner radius); Metal Lock Chip variant: additional mass delta and height delta vs standard.

**Ratchet (BX / UX / CX):** height contribution to total Bey CoM, burst resistance (twist-lock tooth engagement count), contact point count and angle if the Ratchet has functional protrusions. Simple Type O-snap: note absence of rotational preload.

**Bit:** contact patch radius (Hertzian or Sneddon by tip geometry), spin decay rate, X-Celerator Rail gear engagement (tooth count → dash frequency), lateral drift velocity for flat/semi-flat geometry, rubber Bit adhesive traction model if applicable.

### Style Rules
- No em-dashes in section prose — use colons or semicolons
- No bullet lists in the Thesis paragraph
- All numeric results shown to 3 significant figures
- Comparison lines always end with a parenthetical label: `→ 8.75×10⁻⁶ kg·m²`
- Never leave a section with only an equation and no numeric substitution
- No "future work" or "deferred" notes — if something cannot be computed from given data, omit it silently

---

## Case 354 — Basic Line System (BX)

**Thesis:** The Basic Line is the entry-level Beyblade X architecture: a three-component stack (Blade, Ratchet, Bit) in which the Blade carries zinc alloy contact points at the outer perimeter and metal launcher hooks at three inward positions; the metal hooks pull mass toward the center, keeping the center of gravity closer to the rotational axis and producing a balanced, stable spin geometry rather than maximum outward inertia; the Ratchet's twist-lock mechanism converts angular preload into burst resistance, where more indent engagement means a higher torque threshold before the Blade releases; the Bit's gear meshes with the Xtreme Stadium's X-Celerator Rail to deliver periodic speed bursts, and alternate tooth counts change both the burst frequency and peak velocity of those dashes.

### System Architecture

```
Top-down stack (BX standard):

┌─────────────────────────────────┐
│           B L A D E             │  ← zinc contact points (outer ring)
│  [ Gear Chip / PMMA window ]    │  ← transparent PMMA over paper avatar
│  [ metal launcher hooks ×3 ]    │  ← mass closer to axis than UX resin hooks
│  [ PMMA lower body ]            │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│          R A T C H E T          │  ← twist-lock onto Blade
│  [ tooth ring — sets burst Ω ]  │  ← more teeth = higher release torque
│  [ L / R spin selector ]        │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│             B I T               │  ← floor contact point
│  [ 12-tooth gear (standard) ]   │  ← meshes X-Celerator Rail
│  [ alternate tooth variants ]   │  ← change dash frequency / speed
└─────────────────────────────────┘
```

### Blade Sub-Structure

The Blade has three material zones radially:

| Zone | Material | Role |
|------|----------|------|
| Contact points (outer) | Zinc alloy | Primary striker; high density, high recoil resistance |
| Body | PMMA | Structural frame; low density, transparent for Gear Chip visibility |
| Launcher hooks (×3) | Metal | Launcher engagement; mass sits at mid-radius, pulling inertia inward relative to UX |

The Gear Chip sits beneath the PMMA window. In standard BX blades it rotates when the Bit engages. The Expand Blade variant bridges the central metal across the Gear Chip zone, adding structural rigidity at the cost of Gear Chip rotation and the paper avatar (replaced by sticker).

### Spin Direction Lock (system-wide rule: BX / UX / CX)

Every Beyblade X Blade is manufactured for exactly one spin direction — either Left (L) or Right (R). Physical stoppers built into the Blade prevent insertion of a launcher oriented in the wrong direction. Cross-launching a Bey in the incorrect direction is mechanically blocked by design and is an official safety hazard. The Ratchet carries L/R markers on its outer ring and is manually rotated to match the Blade's fixed spin direction at assembly time. The spin direction of a given Bey is set at the Blade level and cannot be changed; the Ratchet selector only aligns internal assembly, it does not override the Blade's stopper.

```
L-spin Blade  →  must use L-spin launcher  (CCW rotation)
R-spin Blade  →  must use R-spin launcher  (CW rotation)
Cross-launch  →  physically blocked by stopper; forced launch = danger
```

### Ratchet Mechanics

Burst resistance is set by the twist-lock tooth engagement between Ratchet and Blade. The Ratchet outer ring is manually rotatable to reverse spin direction (L/R markers). Simple Type Ratchets use an O-type snap joint with no rotational preload, producing lower and less adjustable burst resistance than the standard twist-lock design.

### Bit and X-Celerator Rail

The 12-tooth standard Bit produces one X-Celerator dash per 30° of stadium rail contact (360° / 12 teeth). Alternate tooth counts shift this ratio: fewer teeth = fewer dashes per lap at higher peak speed; more teeth = more frequent but lower-velocity dashes. The Bit geometry (flat, sharp, semi-flat, etc.) independently sets the floor contact patch and spin decay rate, analyzed per-Bit when data is provided.

---

## Case 355 — Unique Line System (UX)

**Thesis:** The Unique Line advances the BX architecture along a single structural axis: replacing the three metal launcher hooks with plastic hooks of equal geometry but lower density removes the inward mass pull on the system's inertia distribution, pushing the center of gravity outward so the zinc outer contact ring dominates the Blade's moment of inertia more completely than in BX; this Outward Weight Distribution (OWD) produces greater gyroscopic stability at a given spin rate because a larger fraction of total Blade inertia resides at the maximum radius; every UX release is further specialized in one distinct mechanical or geometric characteristic beyond OWD alone, making each Blade "unique" in a specific competitive axis; Ratchet-Integrated Blades extend this by fusing the Ratchet directly into the Blade, enabling gimmick mechanisms that span the Blade-Ratchet boundary and would be structurally impossible with separable parts.

### System Architecture

```
Top-down stack (UX standard):

┌─────────────────────────────────┐
│           B L A D E             │  ← zinc contact points (outer ring)
│  [ Gear Chip / sticker avatar ] │  ← sticker replaces paper cutout (no rotating chip)
│  [ resin launcher hooks ×3 ]    │  ← lower density than BX metal hooks → higher OWD
│  [ PMMA lower body ]            │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│          R A T C H E T          │  ← same twist-lock as BX
└─────────────────────────────────┘
┌─────────────────────────────────┐
│             B I T               │  ← unique gimmick variants per Bit
└─────────────────────────────────┘

Ratchet-Integrated variant:

┌─────────────────────────────────┐
│     BLADE + RATCHET (fused)     │  ← single unit; gimmick spans both zones
│  [ BulletGriffon type example ] │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│             B I T               │
└─────────────────────────────────┘
```

### OWD Mechanism: Hook Material Swap

In a BX Blade the three metal launcher hooks sit at mid-radius. Their mass contributes an inward inertia term that partially offsets the outer zinc ring's contribution. In a UX Blade those same hooks are resin: lower density at the same radial position means less mass at mid-radius, so the outer zinc ring's inertia fraction of the total is larger. The net effect is higher OWD without any change to outer contact geometry. Quantification requires hook mass and hook centroid radius, both to be computed per-Blade when wiki data is provided.

### Ratchet-Integrated Blade

Fusing the Ratchet into the Blade eliminates the twist-lock interface between them. This allows the combined unit to carry mechanisms (springs, cams, sliding parts) that depend on relative motion at the Blade-Ratchet boundary. The Expand Blade variant formalizes this: the integrated unit replaces both the separate Blade and Ratchet slots.

### Expand Blade (Feb 2026)

UX Expand Blades integrate the Ratchet into the Blade assembly. The standard Gear Chip rotating mechanism is absent; the avatar is a sticker. The combined inertia of the fused unit is computed as a single multi-zone sum when dimensions are provided.

---

## Case 356 — Custom Line System (CX)

**Thesis:** The Custom Line is a hybrid architecture that borrows the inertia balance philosophy of BX and the specialization philosophy of UX while introducing a modular three-part Blade stack (Lock Chip, Main Blade, Assist Blade); the Main Blade carries zinc contact points like both prior lines, but the ability to swap each sub-component independently means the CoG position and inertia distribution can be tuned per build rather than being fixed at manufacture; because the Assist Blade varies in height and radial reach independently of the Main Blade, the system's total moment of inertia is the sum of three separately tunable zones; the Expand Blade further splits the stack into four components by separating the Main Blade into an Over Blade (PMMA, outermost) and a Metal Blade (zinc, beneath), adding a fourth tunable inertia zone and enabling contact-point layering unavailable in any prior Beyblade X architecture.

### System Architecture

```
Top-down stack (CX standard, 5 components):

┌─────────────────────────────────┐
│          LOCK CHIP              │  ← twists to lock Main + Assist Blade
│  [ Gear Chip / sticker avatar ] │
│  [ standard: ABS ]              │
│  [ Metal LC: added mass + ht ]  │  ← Metal Lock Chip variant: denser, taller
└─────────────────────────────────┘
┌─────────────────────────────────┐
│         MAIN BLADE              │  ← primary contact points (zinc alloy)
│  [ PMMA body + decals ]         │
│  [ launcher hooks ×3 ]          │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│        ASSIST BLADE             │  ← secondary contact points (PMMA)
│  [ varies: height, radial reach]│  ← modulates Main Blade performance
└─────────────────────────────────┘
┌─────────────────────────────────┐
│          R A T C H E T          │  ← same twist-lock as BX/UX
└─────────────────────────────────┘
┌─────────────────────────────────┐
│             B I T               │
└─────────────────────────────────┘

Expand Blade stack (CX Expand, 6 components):

┌─────────────────────────────────┐
│          LOCK CHIP              │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│         OVER BLADE              │  ← outermost; PMMA contact points
│  [ sits over Metal Blade ]      │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│        METAL BLADE              │  ← zinc alloy contact points (primary striker)
│  [ sits beneath Over Blade ]    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│        ASSIST BLADE             │  ← PMMA secondary; same role as standard CX
└─────────────────────────────────┘
┌─────────────────────────────────┐
│          R A T C H E T          │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│             B I T               │
└─────────────────────────────────┘
```

### Component Roles

**Lock Chip:** Structural lock only. Twist-actuated via Bit or tool. Inertia contribution is small (inner radius, low mass). Metal Lock Chip adds mass and height at the center stack — raises the system CoM slightly and adds a minor inner-zone inertia term. The center hole on Metal Lock Chips clears launcher protrusion interference.

**Main Blade:** The primary physics actor: zinc contact points at outer radius drive the dominant inertia term and all direct collision interactions. PMMA body provides structural connection between zinc zones. Swappable across CX builds — different Main Blades vary outer radius, contact face count, and contact face angle.

**Assist Blade:** PMMA throughout — lower density than the Main Blade zinc zones. Its physics role is height extension and secondary contact: it changes where the Bey contacts an opponent in the vertical axis (low-contact vs high-contact matchups). Its radial reach relative to the Main Blade determines whether it contacts before, simultaneously, or after the primary zinc points. Inertia contribution is secondary but non-negligible in tall Assist Blade variants.

**Over Blade (Expand only):** PMMA outer layer over the Metal Blade. Because PMMA is lower density than zinc, the Over Blade shifts the outermost contact zone to a softer material, changing the recoil characteristic: PMMA-on-PMMA contact produces less recoil than zinc-on-zinc. The Metal Blade beneath still provides the dominant zinc inertia zone.

**Metal Blade (Expand only):** Zinc alloy contact points with no PMMA body — the structural frame function is moved to the Over Blade above and Assist Blade below. This concentrates metal mass at a specific radial band rather than distributing it across a mixed-material Blade body.

### Modular Inertia Summation

Total Blade inertia for a CX build (standard) is the sum of three independent zones:

```
I_blade_total = I_lock_chip + I_main_blade + I_assist_blade
```

For an Expand build:

```
I_blade_total = I_lock_chip + I_over_blade + I_metal_blade + I_assist_blade
```

Each term is computed as an annular disk `I = ½m(r_i² + r_o²)` for its radial zone when dimensions are provided. The key tuning lever is that a builder can replace any single component to shift one inertia zone without affecting the others — a customization axis unavailable in BX/UX.

---

## Case 357 — Ratchet System Architecture (BX / UX / CX)

**Thesis:** Ratchets in Beyblade X perform three simultaneous functions: they set the total height of the Bey (which controls the vertical impact plane and center-of-mass elevation), they determine burst resistance through the count and distribution of inner indents that the Blade must overcome to rotate past, and they fix the secondary shaft-lock preload that the Bit shaft must overcome to slide the Ratchet; the naming convention encodes both functions directly — the first number is the outer side count, the second number is height in tenths of a millimetre — so a 3-60 has 3 outer sides and stands 6.0 mm tall; the asymmetric 7-indent pattern found on 70-height Ratchets breaks C-symmetry and produces a direction-dependent burst threshold, meaning the Blade encounters a different resistance profile depending on whether it attempts to burst clockwise or counterclockwise relative to the Ratchet.

### Naming Convention

```
X  -  YY
│      └── height in Beyblade X units → YY × 0.1 mm
└───────── number of outer protrusion sides
```

Examples: 3-60 = 3 sides, 6.0 mm. 4-80 = 4 sides, 8.0 mm.

### Height Variants

| Name suffix | Height | Indent count | Distribution | Symmetry |
|-------------|--------|-------------|--------------|----------|
| -60 | 6.0 mm | 6 | 3 per side | C₃ |
| -70 | 7.0 mm | 7 | 3 one side, 4 other | C₁ (asymmetric) |
| -80 | 8.0 mm | 8 | 4 per side | C₄-like |

### Height and CoM Physics

Higher Ratchets raise the entire Bey's center of mass. A taller stack means:
- The Blade contact plane sits higher above the floor, changing whether the Bey strikes opponents at their contact ring or below it.
- The gyroscopic restoring torque arm increases: a taller CoM is more sensitive to tipping forces from lateral impacts.
- Conversely, a lower Ratchet (60) keeps the CoM closer to the floor, improving lateral stability at the cost of contact-height reach.

```
Side view (exaggerated):

High Ratchet (80):          Low Ratchet (60):
   ┌──Blade──┐                 ┌──Blade──┐
   │         │                 │         │
   │         │  ← tall         │         │  ← short
   └─Ratchet─┘                 └─Ratchet─┘
   ──────Bit──────              ──────Bit──────
   ═══════floor══════           ═══════floor══════
   CoM higher = more tilt-      CoM lower = more stable
   sensitive, higher strike      laterally, lower strike
```

### Burst Resistance: Indent Count Model

Each indent is a catch point that the Blade's burst tab must depress and slide past during a burst event. Total engagement work per burst attempt scales with indent count:

```
W_burst ∝ N_indents × F_indent × d_travel
```

Where N_indents = total indent count, F_indent = engagement force per indent, d_travel = tab travel per indent. More indents = more total work required = higher burst resistance.

| Height | N_indents | Relative burst resistance |
|--------|----------|--------------------------|
| -60 | 6 | Lowest |
| -70 | 7 | Mid |
| -80 | 8 | Highest |

### Asymmetric 70-Height (C₁ Pattern)

The 7-indent (3+4) layout on 70-height Ratchets is not symmetric. One outer side has 3 indents and the opposing side has 4. This means:
- The Blade encounters 3-indent resistance on one angular half and 4-indent resistance on the other.
- A hit that forces the Blade in the 3-indent direction bursts more easily than one in the 4-indent direction.
- This is a C₁ pattern: no rotational symmetry, one complete revolution is required before the pattern repeats.
- Competitive consequence: the lower-resistance arc is the "burst window" — opponents who know the Bey's orientation and strike into that arc have a higher burst probability.

### Spin Direction Selector

The Ratchet outer ring rotates to align with either L or R, indicated by markings on the body. This sets the internal assembly orientation — it does not change the Blade's fixed spin direction, which is enforced by the Blade's own stoppers.

---

## Case 358 — Bit System Architecture (BX / UX / CX)

**Thesis:** Bits are the primary interface between the Beyblade X system and the stadium, simultaneously controlling floor contact mechanics (movement type, spin decay, stability) and X-Celerator Rail engagement (dash frequency, dash speed); the gear tooth count on the Bit pinion sets the gear ratio against the stadium rail rack, where fewer teeth produce a smaller pitch circle and higher angular velocity per unit of linear bey travel, generating more frequent and more abrupt Xtreme Dashes; the Bit shaft's surface geometry independently controls burst resistance by varying the friction against the Ratchet bore — a ridged high-resistance shaft requires more lateral force to slide the Ratchet off, while a smooth low-resistance shaft allows the Ratchet to translate more easily; and the tip geometry at the base sets the floor contact patch, which determines movement type from aggressive and erratic (flat) to stable and centered (ball/dome).

### Bit Structure

```
Side view:

        ┌────┐   ← tip cap (connects to Ratchet; shaft resistance here)
        │    │
   ┌────┴────┴────┐  ← pinion gear ring (X-Celerator Rail engagement)
   └──────────────┘
        │    │   ← shaft body
        │    │
       [tip]      ← floor contact geometry
```

### Gear Count and Xtreme Dash Frequency

The Bit pinion rolls along the stadium rack (X-Celerator Rail). For a pinion on a rack:

```
Linear distance per pinion revolution = N_teeth × p_tooth
```

Where p_tooth = rack tooth pitch (fixed by stadium). So:

| Bit | Teeth | Distance per revolution | Relative dash frequency |
|-----|-------|------------------------|------------------------|
| Flat | 12 | 12 × p | Lower (covers more distance per rotation) |
| Rush | 10 | 10 × p | Higher (covers less distance per rotation) |

Fewer teeth: smaller pitch circle, shorter linear distance per revolution, bit rotates faster relative to bey travel speed, teeth engage the rail more frequently per metre of travel. Rush (10T) produces more Xtreme Dashes per stadium lap than Flat (12T) at the same bey speed.

### Shaft Resistance and Burst Resistance Contribution

The shaft protrusion profile controls friction between the Bit shaft and the Ratchet inner bore:

```
High resistance (Flat Bit):         Low resistance (Ball Bit):
   shaft has raised ridges            shaft is smooth/tapered
   │ ╠══╣ │  ← ridges grip bore      │ │      │ │  ← slides freely
   high friction → harder to         low friction → easier to
   slide Ratchet = higher burst       slide Ratchet = lower burst
```

This is a secondary burst resistance contribution stacked on top of the Ratchet's indent count. A high-resistance Bit shaft combined with a high-indent Ratchet produces maximum burst resistance; a low-resistance Bit with a low-indent Ratchet produces minimum.

### Tip Geometry and Movement Type

| Tip | Contact patch | Friction | Movement type |
|-----|--------------|---------|---------------|
| Flat | Large circular disk | High | Aggressive, erratic, wide travel |
| Ball/Dome | Small Hertzian point | Low | Stable, centered, minimal drift |

Flat tips spread the Bey's weight over a large area, maximising lateral friction force and producing high-speed unpredictable movement. Ball/dome tips concentrate the load at a near-point contact, minimising friction and keeping the Bey precessing smoothly in place.

### Xtreme Dash Mechanics

The X-Celerator Rail is a rack gear embedded in the Xtreme Stadium inner wall. When the Bey's orbital path brings the Bit pinion into contact with the rail, the pinion teeth mesh with the rack teeth. The engagement sequence:

```
1. Bey approaches rail on orbital path
2. Bit pinion teeth contact rack → reaction force pushes Bey tangentially
3. Each successive tooth engagement delivers an impulse
4. Bey exits rail contact at higher tangential speed
5. Xtreme Dash complete → Bey crosses stadium at increased velocity
```

Dash magnitude depends on: contact arc length (how far along the rail the Bey travels), tooth engagement force (bey weight × approach angle), and number of teeth meshed per unit time (gear count). Lower tooth count = more engagements per arc = more total impulse delivered per dash event.

---

## Case 359 — 4 Layer System (4LS): Original Series Architecture

**Thesis:** The 4 Layer System is the founding architecture of Beyblade Original Series competition; it is a four-component axial stack — Bit Chip, Attack Ring, Weight Disk, Blade Base — in which each layer occupies a distinct radial and vertical zone, and the absence of a discrete spin-direction housing (the Spin Gear, added in the successor system) means that spin chirality is encoded directly into the Blade Base geometry, making the BB a fixed-chirality structural component rather than a hot-swappable module; the Attack Ring is the sole determinant of collision behaviour because it is the only part that protrudes radially beyond the Weight Disk perimeter and contacts opposing Beyblades first; the Weight Disk, seated centrally between AR and BB, contributes the dominant fraction of the system's total moment of inertia because it concentrates metal mass at the largest accessible radius of any component other than the AR contact tips; the Blade Base tip is the sole floor-contact point and its geometry fully determines spin decay rate and movement pattern, with no mechanism in this system to change tip regime mid-battle.

### System Architecture

```
Axial stack, side cross-section (right-spin, standard assembly):

         ┌───────────────────────────────┐
         │         BIT CHIP              │  ← r ≈ 9 mm, h ≈ 3 mm, ABS
         │   [avatar sticker face-up]    │  ← decorative; mass ~1.0 g
         │   [Chip Protector above]      │  ← clear ABS cap, clips to AR
         └───────────────────────────────┘
                        │
         ┌───────────────────────────────┐
         │        ATTACK RING            │  ← r_outer ≈ 22–28 mm (AR-dependent)
         │  [contact protrusions outer]  │  ← primary collision surface
         │  [Bit Chip seat, central hole]│  ← holds Bit Chip from below
         │  [AR tabs lock to BB rim]     │  ← press-fit onto BB upper collar
         └───────────────────────────────┘
                        │
         ┌───────────────────────────────┐
         │        WEIGHT DISK            │  ← r_outer ≈ 20–23 mm, r_inner ≈ 4 mm
         │   [metal annular ring]        │  ← dominant I contributor, ~10–16 g
         │   [seats in BB WD groove]     │  ← locked by AR above, BB below
         └───────────────────────────────┘
                        │
         ┌───────────────────────────────┐
         │        BLADE BASE             │  ← r_outer ≈ 22–26 mm
         │   [WD seat groove, upper]     │  ← retains WD
         │   [spin-direction ratchet]    │  ← chirality fixed at manufacture
         │   [tip shaft, lower]          │  ← sole floor contact point
         └──────────────────┬────────────┘
                            │
                          [tip]   ← flat / ball / spike / etc.
                            │
                       ─────────── stadium floor
```

### Layer Roles and Radial Hierarchy

```
Radial reach (approximate, outermost first):

   AR contact tips    r ≈ 22–28 mm  ← first contact with opponent
   AR body            r ≈ 18–22 mm
   WD outer rim       r ≈ 20–23 mm  ← largest metal mass radius
   BB upper collar    r ≈ 18–20 mm
   Bit Chip           r ≈  9 mm     ← innermost, no contact role
   Chip Protector     r ≈ 11 mm     ← clear cover, clips over Bit Chip
```

The AR always reaches beyond or flush with the WD outer rim. Any AR with r_outer < r_WD would allow the WD to contact opponents first, which defeats the attack geometry design. All retail 4LS ARs satisfy r_AR ≥ r_WD by construction.

### Spin Chirality Encoding

In the 4LS there is no separate Spin Gear housing. The Blade Base carries internal ratchet geometry that engages the launcher cord and enforces rotation direction:

```
Right-spin BB ratchet:  tooth steep face leads on rightward cord pull → CW spin
Left-spin BB ratchet:   tooth steep face mirrored                    → CCW spin

Chirality is set at Blade Base manufacture.
Swapping to opposite chirality requires a different BB — no in-system module exists.
```

This is the architectural distinction between 4LS and the Spin Gear System: the SG System extracts this ratchet function into a removable two-piece shell (the Spin Gear Shells), making chirality a hot-swappable property. In 4LS, BB and chirality are inseparable.

### Moment of Inertia Budget

Four-component I sum, annular disk model for each layer:

```
I_total = I_BC + I_AR + I_WD + I_BB
```

**Bit Chip** (ABS disc, m ≈ 0.001 kg, r ≈ 0.009 m, solid disc approximation):
```
I_BC = ½ × m × r²
     = ½ × 0.001 × (0.009)²
     = ½ × 0.001 × 8.1×10⁻⁵
     ≈ 4.05×10⁻⁸ kg·m²
```

**Chip Protector** (clear ABS cap, m ≈ 0.5 g = 0.0005 kg, thin rim at r ≈ 0.011 m):
```
I_CP ≈ m × r²  (thin ring)
     = 0.0005 × (0.011)²
     ≈ 6.05×10⁻⁸ kg·m²
```

**Attack Ring** (ABS + optional metal tips, m ≈ 0.006 kg representative, annular: r_i ≈ 0.010 m, r_o ≈ 0.024 m):
```
I_AR = ½ × m × (r_i² + r_o²)
     = ½ × 0.006 × ((0.010)² + (0.024)²)
     = ½ × 0.006 × (1.0×10⁻⁴ + 5.76×10⁻⁴)
     = ½ × 0.006 × 6.76×10⁻⁴
     ≈ 2.03×10⁻⁶ kg·m²
```

**Weight Disk** (zinc/steel annular ring; representative Wide WD: m ≈ 0.0140 kg, r_i ≈ 0.004 m, r_o ≈ 0.022 m):
```
I_WD = ½ × m × (r_i² + r_o²)
     = ½ × 0.0140 × ((0.004)² + (0.022)²)
     = ½ × 0.0140 × (1.6×10⁻⁵ + 4.84×10⁻⁴)
     = ½ × 0.0140 × 5.0×10⁻⁴
     ≈ 3.50×10⁻⁶ kg·m²
```

**Blade Base** (ABS shell, m ≈ 0.005 kg, annular: r_i ≈ 0.004 m, r_o ≈ 0.020 m):
```
I_BB = ½ × m × (r_i² + r_o²)
     = ½ × 0.005 × ((0.004)² + (0.020)²)
     = ½ × 0.005 × (1.6×10⁻⁵ + 4.0×10⁻⁴)
     = ½ × 0.005 × 4.16×10⁻⁴
     ≈ 1.04×10⁻⁶ kg·m²
```

**Total (representative Wide WD build):**
```
I_total ≈ 4.05×10⁻⁸ + 6.05×10⁻⁸ + 2.03×10⁻⁶ + 3.50×10⁻⁶ + 1.04×10⁻⁶
        ≈ 6.63×10⁻⁶ kg·m²

WD share:  3.50×10⁻⁶ / 6.63×10⁻⁶ ≈ 52.8%  → WD is dominant I contributor
AR share:  2.03×10⁻⁶ / 6.63×10⁻⁶ ≈ 30.6%
BB share:  1.04×10⁻⁶ / 6.63×10⁻⁶ ≈ 15.7%
BC + CP:   ~1.0×10⁻⁷ / 6.63×10⁻⁶ ≈  1.5%  → negligible
```

The WD contributes more than half of total system inertia despite being geometrically constrained to r_o ≈ 22 mm, because its mass (≈14 g) is four to five times that of any other single layer. Heavy WD variants (≈16 g) push this share above 55%.

### Weight Disk Taxonomy

| Family | Representative | Mass | r_outer | I_WD (approx) | Role |
|--------|---------------|------|---------|----------------|------|
| Wide | Wide, Eight Wide, Ten Wide | 14 g | 22 mm | 3.50×10⁻⁶ kg·m² | Stamina; maximum I at standard radius |
| Heavy | Heavy, Eight Heavy, Ten Heavy | 14–16 g | 20 mm | 3.10–3.55×10⁻⁶ kg·m² | Defense; mass closer to axis, lower I but higher total weight |
| Balance | Balance, Eight Balance, Ten Balance | ~13 g | 21 mm | 3.20×10⁻⁶ kg·m² | Compromise I and total mass |
| Attack | Star Attack, Heavy Attack, Revolver Attack | ~12 g | varies | varies | Mass budget for movement; lighter than Wide |
| Special | Magnetic WD, Gyro Super WD | — | — | — | Gimmick; I secondary to mechanism |

Wide family maximises I at fixed outer radius. Heavy family trades I for total system mass (higher normal force on tip, higher friction force, faster lateral displacement of opponents on contact). The choice between Wide and Heavy is therefore a trade between spin retention (I) and collision impulse transfer (momentum).

### Attack Ring Contact Mechanics

The AR is the first contact point in every collision. Two geometry parameters determine the outcome:

```
φ = contact face angle from the radial direction

Smash fraction  = cos(φ)   → tangential force → opponent spin-down and lateral impulse
Recoil fraction = sin(φ)   → radial force     → self-destabilisation
```

An AR with φ = 0° (face perpendicular to radial, i.e. flat outward-facing wall) delivers maximum smash and zero recoil — pure Attack geometry. An AR with φ = 90° (face tangent to spin circle) delivers zero smash and maximum recoil — self-destabilising. Real ARs fall between these extremes; the protrusion shape and leading-edge angle set φ for each contact event.

```
Example: protrusion with φ = 30°
  smash fraction  = cos(30°) = 0.866  → 86.6% of contact impulse goes to attack
  recoil fraction = sin(30°) = 0.500  → 50.0% returned as self-recoil
```

Defense ARs minimise φ by using curved or sloped faces that deflect rather than catch; the slope redirects impulse inward (toward axis) rather than outward.

### Blade Base Tip Spin Decay

The BB tip is the sole floor-contact point. Spin decay rate from tip friction:

```
dω/dt = −τ_friction / I_total

τ_friction = μ × m_total × g × r_tip

where:
  μ        = kinetic friction coefficient (tip material)
  m_total  = total Bey mass (kg)
  g        = 9.81 m/s²
  r_tip    = effective contact radius of tip (m)
```

Representative values (hard ABS flat tip, μ = 0.35, m_total = 0.033 kg, r_tip = 0.004 m):
```
τ_friction = 0.35 × 0.033 × 9.81 × 0.004
           = 0.35 × 0.033 × 0.03924
           ≈ 4.53×10⁻⁴ N·m

dω/dt = −4.53×10⁻⁴ / 6.63×10⁻⁶
      ≈ −68.3 rad/s²
```

A sharp/spike tip (r_tip ≈ 0.001 m, μ ≈ 0.17):
```
τ_friction = 0.17 × 0.033 × 9.81 × 0.001
           ≈ 5.51×10⁻⁵ N·m

dω/dt = −5.51×10⁻⁵ / 6.63×10⁻⁶
      ≈ −8.3 rad/s²
```

Flat tip decays spin ~8× faster than spike at identical system I. This is the fundamental trade: flat tip produces high lateral mobility (high μ × large r_tip = high traction) at the direct cost of spin retention. Spike tip preserves spin but offers near-zero lateral force, producing stable precession.

### No Mid-Battle Mode Change

The 4LS has no mechanism for tip regime switching during a match. The BB tip geometry is fixed; there is no spring, cam, or centrifugal mechanism in this system (those appear in the Spin Gear System's RC family and the HMS system). Every 4LS performance outcome is determined entirely at launch by the static combination chosen.

### TypeScript Model

```typescript
function fourLayerSystemInertia(
  arMassG: number, arOuterMm: number, arInnerMm: number,
  wdMassG: number, wdOuterMm: number,
  bbMassG: number, bbOuterMm: number
): { iAR: number; iWD: number; iBB: number; iTotal: number; wdSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iBC  = 0.5 * toKg(1.0) * toM(9) ** 2;   // fixed: bit chip
  const iAR  = annular(toKg(arMassG), toM(arInnerMm), toM(arOuterMm));
  const iWD  = annular(toKg(wdMassG), toM(4),         toM(wdOuterMm));
  const iBB  = annular(toKg(bbMassG), toM(4),         toM(bbOuterMm));
  const iTotal = iBC + iAR + iWD + iBB;

  return {
    iAR,
    iWD,
    iBB,
    iTotal,
    wdSharePct: (iWD / iTotal) * 100
  };
}

function arContactFractions(phiDeg: number): { smash: number; recoil: number } {
  const phi = (phiDeg * Math.PI) / 180;
  return { smash: Math.cos(phi), recoil: Math.sin(phi) };
}

function tipSpinDecay(
  muKinetic: number, totalMassG: number,
  tipRadiusMm: number, iTotal: number
): number {
  const tau = muKinetic * (totalMassG / 1000) * 9.81 * (tipRadiusMm / 1000);
  return -(tau / iTotal); // rad/s²
}

// fourLayerSystemInertia(6, 24, 10, 14, 22, 5, 20)
//   → iWD ≈ 3.50×10⁻⁶ kg·m², iTotal ≈ 6.63×10⁻⁶ kg·m², wdSharePct ≈ 52.8%
// arContactFractions(30)
//   → smash ≈ 0.866, recoil ≈ 0.500  (30° protrusion face)
// arContactFractions(0)
//   → smash ≈ 1.000, recoil ≈ 0.000  (pure attack flat face)
// tipSpinDecay(0.35, 33, 4, 6.63e-6)
//   → ≈ −68.3 rad/s²  (flat ABS tip)
// tipSpinDecay(0.17, 33, 1, 6.63e-6)
//   → ≈  −8.3 rad/s²  (sharp spike tip)
```

---

## Case 360 — Spin Gear System (SGS): Five-Layer Architecture and Chirality Modularisation

**Thesis:** The Spin Gear System is the second Original Series architecture; it extends the 4 Layer System by inserting a fifth discrete layer — the Spin Gear — between the Weight Disk and the Blade Base, and this single addition accomplishes a complete architectural restructuring of chirality: spin direction is extracted from the Blade Base geometry where it was permanently encoded in the 4LS, and relocated into the Spin Gear shells where it becomes a hot-swappable, launcher-matched module that can be changed without replacing the BB; the Spin Gear also introduces gimmick capability at the sub-BB level, with variants carrying weights, ball bearings, and a spring-wound engine that are all physically housed within the SG assembly rather than the BB body; the Sub-Attack Ring is a second new structural element introduced in this system, a free-spinning secondary ring that decouples collision impulse from the main AR by rotating upon contact rather than transmitting the full impulse to the Bey body; the Weight Disk retains its role as the dominant inertia contributor, but the five-layer I budget now includes the SG assembly as a distinct term that varies with the gimmick variant chosen.

### System Architecture

```
Axial stack, side cross-section (5-layer, right-spin standard assembly):

         ┌──────────────────────────────────┐
         │           BIT CHIP               │  ← r ≈ 9–11 mm (new longer profile)
         │   [avatar sticker / game code]   │  ← lengthened vs 4LS; no Cover needed
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          ATTACK RING             │  ← r_outer ≈ 22–30 mm
         │  [contact protrusions, outer]    │  ← primary collision surface
         │  [Bit Chip seat, central]        │
         │  ┌──────────────────────────┐    │
         │  │    SUB-ATTACK RING       │    │  ← optional; free-spinning sub-ring
         │  │  [seated below AR body]  │    │  ← decouples collision recoil
         │  └──────────────────────────┘    │
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          WEIGHT DISK             │  ← r_outer ≈ 20–23 mm, metal
         │   [annular ring, dominant I]     │  ← iron; ~10–16 g
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐  ← NEW LAYER (absent in 4LS)
         │           SPIN GEAR              │  ← r_outer ≈ 19 mm
         │  [two plastic shells + metal ring│
         │   + metal gear + SG Core]        │
         │  [launcher tabs set chirality]   │  ← Right or Left, swappable
         │  [SG Core: tip shaft carrier]    │  ← exits through BB tip hole
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          BLADE BASE              │  ← r_outer ≈ 22–26 mm
         │  [SG cavity, upper]              │  ← receives SG assembly
         │  [base clips lock SG in place]   │
         │  [tip shaft exit, lower]         │
         └──────────────────┬───────────────┘
                            │
                          [tip]   ← SG Core shaft drives tip
                            │
                       ──────────── stadium floor
```

### 4LS vs SGS: Architectural Comparison

| Property | 4 Layer System | Spin Gear System |
|----------|---------------|-----------------|
| Layer count | 4 | 5 |
| Chirality location | Blade Base (fixed at manufacture) | Spin Gear shells (swappable) |
| Left-spin capability | Requires different BB | Requires only Left SG shells |
| Sub-Attack Ring | Not present | Available (free-spinning) |
| Gimmick layer | None | SG gimmick variants (weights, bearings, engine) |
| BB function | Contains ratchet + tip | Contains SG cavity + tip exit |
| Bit Chip profile | Short (requires Chip Cover) | Lengthened (Chip Cover obsolete) |
| Serial number format | None | A-000 format from Dec 2000 |

### Spin Gear Chirality Mechanism

The SG shells carry two launcher cord tabs whose position encodes spin direction:

```
Right Spin Gear:
  Tab position: close to right side of SG housing
  Cord engagement: rightward cord pull → CW rotation
  Compatible launcher: Right-Spin Shooter only

Left Spin Gear:
  Tab position: left side, tabs extend further outward than Right SG tabs
  Cord engagement: leftward cord pull → CCW rotation
  Compatible launcher: Left-Spin Shooter only
  Physical incompatibility: extended left tabs physically prevent
    Right-Spin Shooter insertion → cross-launch mechanically blocked

Chirality change procedure (SGS, vs 4LS):
  4LS: replace entire Blade Base
  SGS: swap SG shell pair only — BB unchanged
```

The physical incompatibility of Left SG tabs with Right shooters is a passive safety lock: the geometry prevents incorrect launcher insertion rather than relying on user awareness.

### Spin Gear Assembly Structure

```
Standard SG, exploded view:

  ┌─────────────────┐   ← Top Shell    (ABS, ~1.12 g)
  │  ratchet face   │     ratchet teeth engage launcher cord
  │  tab ×2        │     tab position = chirality
  ├─────────────────┤
  │  MWG seat       │   ← Metal Weight Gear slot (optional, ~1.12 g)
  ├─────────────────┤
  │  SG Core cavity │   ← SG Core presses in here
  └─────────────────┘   ← Bottom Shell (ABS, ~1.12 g)
           │
       [SG Core]        ← center shaft carrier; tip shaft exits BB tip hole
           │
         [tip]
```

Standard SG shell pair total: ~2.24 g (two shells at 1.12 g each).  
With Metal Weight Gear: ~3.36 g.  
SG Core adds ~0.5–1.5 g depending on variant.

Gimmick SG variants replace the standard shell pair and/or core with mechanism-bearing assemblies: the Full Auto Clutch SG carries ball bearings and a ratchet decoupler; the Engine Gear carries a spring-wound motor in an enlarged housing (covered as a separate system).

### Sub-Attack Ring Physics

The Sub-AR is a secondary ring seated below the main AR body. It is not fixed to the Bey's rotation axis: it mounts on a free-spinning collar and can rotate independently of the Bey.

```
Collision event, main AR contact:
  Opponent strikes main AR → full impulse transmitted to Bey body → recoil + spin loss

Collision event, Sub-AR contact:
  Opponent strikes Sub-AR → Sub-AR rotates freely → impulse partially absorbed
    in Sub-AR angular momentum rather than transmitted to Bey body

Recoil reduction model (impulse fraction transmitted to Bey body):
  Without Sub-AR:  J_bey = J_total         (100% transmitted)
  With Sub-AR:     J_bey = J_total × (I_bey / (I_bey + I_subAR))

  where I_subAR = moment of inertia of free-spinning Sub-AR ring
```

Representative Sub-AR (ABS ring, m ≈ 3 g = 0.003 kg, r_i ≈ 10 mm, r_o ≈ 22 mm):
```
I_subAR = ½ × 0.003 × ((0.010)² + (0.022)²)
        = ½ × 0.003 × (1.0×10⁻⁴ + 4.84×10⁻⁴)
        = ½ × 0.003 × 5.84×10⁻⁴
        ≈ 8.76×10⁻⁷ kg·m²

I_bey (representative 5-layer SGS build) ≈ 7.1×10⁻⁶ kg·m²

Transmitted fraction = 7.1×10⁻⁶ / (7.1×10⁻⁶ + 8.76×10⁻⁷)
                     = 7.1×10⁻⁶ / 7.98×10⁻⁶
                     ≈ 0.890  → 89.0% transmitted, 11.0% absorbed by Sub-AR rotation
```

The Sub-AR does not eliminate recoil — it reduces it proportionally to the ratio of Sub-AR inertia to total system inertia. A heavier or wider Sub-AR increases I_subAR and absorbs a larger fraction. This is why large-radius Sub-ARs (e.g., Dragon Breaker) produce measurably lower self-destabilisation on contact than small Sub-ARs.

### Five-Layer Inertia Budget

Adding the SG layer to the 4LS I budget:

```
I_total = I_BC + I_AR + I_WD + I_SG + I_BB
```

**SG shells** (ABS annular pair, m_total = 0.00224 kg, r_i ≈ 4 mm, r_o ≈ 19 mm):
```
I_SG_shells = ½ × 0.00224 × ((0.004)² + (0.019)²)
            = ½ × 0.00224 × (1.6×10⁻⁵ + 3.61×10⁻⁴)
            = ½ × 0.00224 × 3.77×10⁻⁴
            ≈ 4.22×10⁻⁷ kg·m²
```

**Metal Weight Gear** (thin ring at r ≈ 15 mm, m = 0.00112 kg):
```
I_MWG = m × r²   (thin ring approximation)
      = 0.00112 × (0.015)²
      = 0.00112 × 2.25×10⁻⁴
      ≈ 2.52×10⁻⁷ kg·m²
```

**Full SG assembly** (shells + MWG, no core):
```
I_SG = 4.22×10⁻⁷ + 2.52×10⁻⁷ = 6.74×10⁻⁷ kg·m²
```

**Full 5-layer I budget** (representative SGS build, Wide WD):

| Layer | Mass (g) | I (kg·m²) | Share |
|-------|----------|-----------|-------|
| Bit Chip | 1.0 | 4.05×10⁻⁸ | 0.57% |
| Attack Ring | 6.0 | 2.03×10⁻⁶ | 28.6% |
| Weight Disk (Wide) | 14.0 | 3.50×10⁻⁶ | 49.3% |
| Spin Gear (shells + MWG) | 3.36 | 6.74×10⁻⁷ | 9.5% |
| Blade Base | 5.0 | 1.04×10⁻⁶ | 14.7% |
| **Total** | **29.36** | **7.10×10⁻⁶** | 100% |

The SG layer contributes ~9.5% of system I — larger than Bit Chip but smaller than BB. Gimmick SGs (e.g., Engine Gear at ~11–21 g) push the SG share to 25–40% of I_total and become the dominant variable in the budget, which is why Engine Gear builds are analysed separately as their own system.

### Blade Base Compatibility Note

4LS Blade Bases lack the SG cavity and base clips. They can be physically inserted into SGS assemblies with modification but the SG cannot seat correctly: the base clips have nothing to engage. SGS rules treat such assemblies as imperfect or incomplete. SGS Blade Bases are not backward-compatible with 4LS in competitive use.

### TypeScript Model

```typescript
function sgSystemInertia(
  arMassG: number, arOuterMm: number, arInnerMm: number,
  wdMassG: number, wdOuterMm: number,
  sgShellsMassG: number, sgOuterMm: number,
  mwgMassG: number,
  bbMassG: number, bbOuterMm: number
): { iAR: number; iWD: number; iSG: number; iBB: number; iTotal: number; wdSharePct: number; sgSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iBC   = 0.5 * toKg(1.0) * toM(9) ** 2;
  const iAR   = annular(toKg(arMassG), toM(arInnerMm), toM(arOuterMm));
  const iWD   = annular(toKg(wdMassG), toM(4), toM(wdOuterMm));
  const iSGsh = annular(toKg(sgShellsMassG), toM(4), toM(sgOuterMm));
  const iMWG  = toKg(mwgMassG) * toM(15) ** 2;   // thin ring at r=15mm
  const iSG   = iSGsh + iMWG;
  const iBB   = annular(toKg(bbMassG), toM(4), toM(bbOuterMm));
  const iTotal = iBC + iAR + iWD + iSG + iBB;

  return { iAR, iWD, iSG, iBB, iTotal,
           wdSharePct: (iWD / iTotal) * 100,
           sgSharePct: (iSG / iTotal) * 100 };
}

function subARTransmittedFraction(
  iSystemKgm2: number,
  subARMassG: number, subAROuterMm: number, subARInnerMm: number
): number {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const iSubAR = 0.5 * toKg(subARMassG) *
    (toM(subARInnerMm) ** 2 + toM(subAROuterMm) ** 2);
  return iSystemKgm2 / (iSystemKgm2 + iSubAR);
}

// sgSystemInertia(6, 24, 10, 14, 22, 2.24, 19, 1.12, 5, 20)
//   → iWD ≈ 3.50×10⁻⁶, iSG ≈ 6.74×10⁻⁷, iTotal ≈ 7.10×10⁻⁶
//     wdSharePct ≈ 49.3%, sgSharePct ≈ 9.5%
// sgSystemInertia(6, 24, 10, 14, 22, 2.24, 19, 0, 5, 20)
//   → iSG ≈ 4.22×10⁻⁷ (shells only, no MWG), sgSharePct ≈ 6.2%
// subARTransmittedFraction(7.1e-6, 3, 22, 10)
//   → ≈ 0.890  (89.0% impulse reaches Bey body; 11.0% absorbed by Sub-AR)
// subARTransmittedFraction(7.1e-6, 6, 26, 10)
//   → ≈ 0.836  (heavier wide Sub-AR absorbs 16.4%)
```

---

## Case 361 — Magnacore System (MGS): Six-Layer Architecture and Magnetic Normal-Force Modulation

**Thesis:** The Magnacore System is the third Original Series architecture; its defining structural change over the Spin Gear System is the splitting of the SG assembly into two independent layers — the NEO Spin Gear shells (chirality module, hollow-centre design) and the Core (interchangeable weight or magnetic insert that seats inside those shells) — producing a Six-Layer structure in which the Core becomes a performance variable that can be swapped between builds without disturbing any other layer; the Magnecore variant of this Core carries a permanent magnet whose pole orientation relative to the fixed South-pole stadium magnet modulates the normal force on the Blade Base tip: a South Magnecore repels the stadium magnet and reduces N_normal, decreasing tip friction and producing erratic low-drag movement at the cost of easier ring-out; a North Magnecore attracts the stadium magnet and increases N_normal, increasing tip friction and producing a harder-to-displace defensive stance at the cost of faster spin decay; a Magnetic Weight Disk extends the magnetic interaction to the WD layer and allows even SGS Beyblades with Gimmick SGs to access the system without swapping their base assembly; Support Parts appear for the first time in this system as reversible BB accessories that change contact geometry and height depending on orientation.

### System Architecture

```
Axial stack, side cross-section (6-layer, Magnacore assembly):

         ┌──────────────────────────────────┐
         │           BIT CHIP               │  ← r ≈ 9–11 mm (long profile, no Cover)
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          ATTACK RING             │  ← r_outer ≈ 22–30 mm
         │  [optional Sub-Attack Ring]      │  ← free-spinning, carried from SGS
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          WEIGHT DISK             │  ← standard or Magnetic WD
         │  [standard: iron annular ring]   │  ← dominant I contributor
         │  [Magnetic WD: two-sided magnet] │  ← N/S polarity selectable by flip
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐
         │          BLADE BASE              │  ← with optional Support Parts
         │  [NEO SG cavity, upper]          │
         │  [SP attachment points, sides]   │  ← only on compatible BBs
         │  [tip shaft exit, lower]         │
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐  ← LAYER 5 (was single SG in SGS)
         │        NEO SPIN GEAR SHELLS      │  ← hollow centre; chirality tabs
         │  [NEO Right or NEO Left]         │  ← launcher cord engagement
         │  [hollowed core cavity]          │  ← accepts any interchangeable Core
         └──────────────────────────────────┘
                          │
         ┌──────────────────────────────────┐  ← LAYER 6 (new; split from SG)
         │              CORE                │  ← seats inside NEO SG hollow
         │  [Magnecore: N or S magnet]      │
         │  [Metal Weight Core: mass only]  │
         │  [Standard SG Core: legacy]      │
         └──────────────────┬───────────────┘
                            │
                          [tip]
                            │
                       ──────────── stadium floor
                            ↕
                    [BeyStadium magnet]     ← South pole always facing up
                    [in Magnacore Tray]
```

### SGS vs MGS: Architectural Comparison

| Property | Spin Gear System | Magnacore System |
|----------|-----------------|-----------------|
| Layer count | 5 | 6 |
| SG structure | Shells + fixed metal ring + Core (one unit) | NEO Shells (hollow) + Core (separate) |
| Core swappability | Fixed inside standard SG; not interchangeable | Fully interchangeable across all NEO SGs |
| Magnetic layer | None (MWG is mass only) | Magnecore (Core) and/or Magnetic WD |
| Stadium interaction | Passive (no magnet) | Active: stadium magnet modulates N_normal |
| Support Parts | Not present | Available on compatible BBs (reversible) |
| Gimmick SG compatibility | Gimmick SGs are native SGS parts | Gimmick BBs cannot swap NEO shells; use Magnetic WD instead |
| Cross-system compatibility | 4LS BBs imperfect in SGS | SGS Beyblades can use NEO SG + Magnecore in compatible BBs |

### NEO Spin Gear: Shell Architecture

Standard SGS shells have a solid metal ring pressed into the shell cavity; that ring cannot be removed. NEO SG shells hollow out the centre entirely, creating a standardised cavity that accepts any Core variant by press-fit. The launcher cord tabs and chirality encoding are unchanged from SGS shells; the only structural modification is the removal of the fixed ring and the standardisation of the cavity geometry.

```
Standard SGS shell (cross-section):         NEO SG shell (cross-section):

  ┌─────────────────┐                         ┌─────────────────┐
  │ ratchet face    │                         │ ratchet face    │
  │ tab ×2          │                         │ tab ×2          │
  ├─────────────────┤                         ├─────────────────┤
  │ [metal ring]    │  ← fixed, non-removable │ [open cavity]   │  ← hollow
  │ [SG Core fixed] │                         │ [any Core fits] │
  └─────────────────┘                         └─────────────────┘

Chirality tab geometry: identical between Standard and NEO shells.
NEO shells are lighter per pair than Standard (no fixed ring); mass transferred to Core.
```

Gimmick SGs (Full Auto Clutch, Engine Gear) cannot be replaced by NEO shells because the Blade Base bodies for those parts are moulded exclusively around the gimmick SG geometry. A Gimmick SG BB has no NEO SG cavity. These Beyblades access the Magnacore System through the Magnetic WD path only.

### Core Taxonomy and Mass Roles

| Core Type | Magnetic | Mass (approx) | Primary role |
|-----------|----------|--------------|--------------|
| Standard SG Core | No | ~0.5–1.0 g | Structural shaft carrier; minimum mass |
| Metal Weight Core (MWC) | No | ~1.5–2.5 g | Mass budget: higher I_total, higher normal force on tip |
| Magnecore (South) | Yes (S pole) | ~2.0–4.0 g | Repel stadium magnet; reduce N_normal; erratic movement |
| Magnecore (North) | Yes (N pole) | ~2.0–4.0 g | Attract stadium magnet; increase N_normal; defensive stance |

The Core sits at the smallest radius of any layer (r ≈ 5–8 mm), so its I contribution is small regardless of mass. Its primary performance levers are: (1) total Bey mass via m contribution → normal force on tip, and (2) magnetic force on N_normal (Magnecore only).

### Magnetic Normal-Force Modulation: Core Physics

The Magnacore sits at the Bey's centre axis. The stadium magnet tray is fixed beneath the stadium floor, always South pole upward. When the Bey passes over a stadium magnet the vertical magnetic force between Core and stadium acts along the z-axis (spin axis):

```
N_normal = m_total × g  ±  F_magnet

  South Magnecore in Bey (S pole down, stadium S pole up):
    Like poles → repulsion → F_magnet acts upward → reduces N_normal
    N_normal_S = m_total × g  −  F_magnet

  North Magnecore in Bey (N pole down, stadium S pole up):
    Unlike poles → attraction → F_magnet acts downward → increases N_normal
    N_normal_N = m_total × g  +  F_magnet
```

Effect on tip spin decay rate:
```
τ_tip = μ_tip × N_normal × r_tip

dω/dt = −τ_tip / I_total = −(μ_tip × N_normal × r_tip) / I_total
```

Representative values (m_total = 0.033 kg, μ = 0.17 sharp tip, r_tip = 0.001 m,
I_total = 7.1×10⁻⁶ kg·m², F_magnet = 0.030 N estimated):

```
Baseline (no magnet):
  N_baseline = 0.033 × 9.81 = 0.3237 N
  τ_baseline = 0.17 × 0.3237 × 0.001 = 5.50×10⁻⁵ N·m
  dω/dt = −5.50×10⁻⁵ / 7.1×10⁻⁶ ≈ −7.75 rad/s²

South Magnecore (repulsion, −F):
  N_S = 0.3237 − 0.030 = 0.2937 N
  τ_S = 0.17 × 0.2937 × 0.001 = 4.99×10⁻⁵ N·m
  dω/dt_S = −4.99×10⁻⁵ / 7.1×10⁻⁶ ≈ −7.03 rad/s²   → 9.3% slower spin decay

North Magnecore (attraction, +F):
  N_N = 0.3237 + 0.030 = 0.3537 N
  τ_N = 0.17 × 0.3537 × 0.001 = 6.01×10⁻⁵ N·m
  dω/dt_N = −6.01×10⁻⁵ / 7.1×10⁻⁶ ≈ −8.46 rad/s²   → 9.2% faster spin decay
```

South gives a small spin-retention advantage from reduced tip friction. North imposes a spin-retention penalty but provides a lateral-displacement resistance advantage: the same increased N_normal that raises τ_tip also raises the lateral friction force resisting ring-out:

```
F_lateral_resist = μ_tip × N_normal

  South: F_lateral = 0.17 × 0.2937 ≈ 0.0499 N
  North: F_lateral = 0.17 × 0.3537 ≈ 0.0601 N

  North resists ring-out ~20.4% more strongly than South at equal collision impulse.
```

### Magnetic Weight Disk: Extended Magnetic Layer

The Magnetic WD carries a permanent magnet in the WD annulus, not in the Core. It provides the same pole-polarity options (flip the WD to swap N/S) and allows:

1. SGS Beyblades with Gimmick SGs (non-NEO BBs) to access magnetic modulation without touching the SG assembly.
2. Double magnetic field strength when used simultaneously with a Magnecore in a NEO SG: both WD magnet and Core magnet interact with the stadium, approximately doubling F_magnet in the force equations above.
3. Magnetic interaction between two opposing Beyblades: if both carry Magnetic WDs with the same pole up, the WDs repel each other horizontally — Beyblades cannot approach closely, turning the match into a stamina contest. If poles are opposite, WDs attract, pulling Beyblades together for sustained high-frequency contact.

```
WD-vs-WD polarity:
  Both S (same): lateral repulsion → evasive, contact-avoided endurance match
  S vs N (different): lateral attraction → sustained mutual contact → collision-heavy match
```

### Support Parts

Support Parts attach to the sides of compatible Blade Bases. They are reversible: one face-up orientation produces one contact profile; flipping 180° produces a different profile (different height, radius, or friction surface). Their I contribution is a peripheral mass term:

```
I_SP = ½ × m_SP × (r_i_SP² + r_o_SP²)

Representative SP (ABS, ~3 g each × 2 = 6 g, r_i ≈ 18 mm, r_o ≈ 26 mm):
I_SP = ½ × 0.006 × ((0.018)² + (0.026)²)
     = ½ × 0.006 × (3.24×10⁻⁴ + 6.76×10⁻⁴)
     = ½ × 0.006 × 1.0×10⁻³
     ≈ 3.00×10⁻⁶ kg·m²
```

SP can contribute up to ~3×10⁻⁶ kg·m² — comparable to the WD — when mounted at outer radii. Their competitive significance is therefore not limited to their gimmick orientation function; they materially shift the system I budget and must be accounted for in spin-decay calculations when present.

### Six-Layer Inertia Budget

```
I_total = I_BC + I_AR + I_WD + I_BB + I_NEO_shells + I_Core  (+ I_SP if present)
```

| Layer | Mass (g) | r_outer (mm) | I (kg·m²) | Share |
|-------|----------|-------------|-----------|-------|
| Bit Chip | 1.0 | 9 | 4.05×10⁻⁸ | 0.5% |
| Attack Ring | 6.0 | 24 | 2.03×10⁻⁶ | 24.4% |
| Weight Disk (Wide) | 14.0 | 22 | 3.50×10⁻⁶ | 42.1% |
| Blade Base | 5.0 | 20 | 1.04×10⁻⁶ | 12.5% |
| NEO SG Shells | 1.8 | 19 | 3.24×10⁻⁷ | 3.9% |
| Core (Magnecore) | 3.0 | 8 | 9.60×10⁻⁸ | 1.2% |
| Support Parts (×2) | 6.0 | 26 | 3.00×10⁻⁶ | 36.1%* |
| **Total (no SP)** | **30.8** | — | **8.31×10⁻⁶** | 100% |
| **Total (with SP)** | **36.8** | — | **1.13×10⁻⁵** | 100% |

*SP share computed against the with-SP total. WD remains dominant when SP are absent; SP rival or exceed WD when present, making SP-equipped builds the highest-I configurations in the Original Series.

Core I is always negligible (~1%) regardless of Magnecore vs MWC choice; the Core's physics role is normal-force modulation, not inertia contribution.

### TypeScript Model

```typescript
function magnaSystemInertia(
  arMassG: number, arOuterMm: number, arInnerMm: number,
  wdMassG: number, wdOuterMm: number,
  bbMassG: number, bbOuterMm: number,
  neoShellsMassG: number,
  coreMassG: number, coreOuterMm: number,
  spPairMassG: number, spOuterMm: number, spInnerMm: number
): { iWD: number; iSP: number; iTotal: number; wdSharePct: number; spSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iBC      = 0.5 * toKg(1.0) * toM(9) ** 2;
  const iAR      = annular(toKg(arMassG), toM(10), toM(arOuterMm));
  const iWD      = annular(toKg(wdMassG), toM(4),  toM(wdOuterMm));
  const iBB      = annular(toKg(bbMassG), toM(4),  toM(bbOuterMm));
  const iNEO     = annular(toKg(neoShellsMassG), toM(4), toM(19));
  const iCore    = annular(toKg(coreMassG), toM(0), toM(coreOuterMm));
  const iSP      = spPairMassG > 0
    ? annular(toKg(spPairMassG), toM(spInnerMm), toM(spOuterMm))
    : 0;
  const iTotal   = iBC + iAR + iWD + iBB + iNEO + iCore + iSP;

  return { iWD, iSP, iTotal,
           wdSharePct: (iWD / iTotal) * 100,
           spSharePct: (iSP / iTotal) * 100 };
}

function magnaSpinDecay(
  totalMassG: number, tipMu: number, tipRadiusMm: number,
  iTotal: number,
  corePole: "north" | "south" | "none",
  fMagnetN: number
): number {
  const N = (totalMassG / 1000) * 9.81
    + (corePole === "north" ? fMagnetN : corePole === "south" ? -fMagnetN : 0);
  const tau = tipMu * N * (tipRadiusMm / 1000);
  return -(tau / iTotal);
}

function wdPolarityInteraction(
  pole1: "north" | "south", pole2: "north" | "south"
): "repel" | "attract" {
  return pole1 === pole2 ? "repel" : "attract";
}

// magnaSystemInertia(6, 24, 10, 14, 22, 5, 20, 1.8, 3, 8, 0, 0, 0)
//   → iWD ≈ 3.50×10⁻⁶, iTotal ≈ 8.31×10⁻⁶, wdSharePct ≈ 42.1% (no SP)
// magnaSystemInertia(6, 24, 10, 14, 22, 5, 20, 1.8, 3, 8, 6, 26, 18)
//   → iSP ≈ 3.00×10⁻⁶, iTotal ≈ 1.13×10⁻⁵, spSharePct ≈ 26.5% (with SP)
// magnaSpinDecay(33, 0.17, 1, 8.31e-6, "south", 0.030)
//   → ≈ −7.03 rad/s²  (South Magnecore; reduced N_normal)
// magnaSpinDecay(33, 0.17, 1, 8.31e-6, "north", 0.030)
//   → ≈ −8.46 rad/s²  (North Magnecore; increased N_normal)
// magnaSpinDecay(33, 0.17, 1, 8.31e-6, "none", 0)
//   → ≈ −7.75 rad/s²  (Metal Weight Core; no magnetic effect)
// wdPolarityInteraction("south", "south")  → "repel"  (both S: evasive endurance)
// wdPolarityInteraction("south", "north")  → "attract" (different: sustained contact)
```

---

## Case 362 — Engine Gear System (EGS): Spring-Energy Storage, Clutch-Timed Release, and EG-Dominant Inertia

**Thesis:** The Engine Gear System is the fourth Original Series architecture; it replaces the entire Spin Gear and Core sub-assembly with a single larger unit — the Engine Gear — whose defining feature is an internal spring mechanism that stores potential energy before launch via a Turbo Winder, then releases that energy as a rotational impulse at a moment determined entirely by the Blade Base clutch type; this clutch-timing architecture introduces a new competitive variable that has no analogue in any prior system: the builder chooses not just what the Bey does but precisely when its peak angular velocity occurs in the match timeline, with First Clutch releasing at launch, Final Clutch releasing on impact or at low spin, and No Clutch releasing steadily across the full match; the Engine Gear's mass (~10–21 g depending on variant) is four to ten times greater than the SGS SG shells it replaces, making the EG layer a co-dominant or dominant contributor to system inertia rather than the minor contributor the SG was; Custom Engine Weights introduce a CEW slot at the bottom of the EG that accepts interchangeable tip inserts and decouples tip geometry from the EG spring mechanism; the Reverse Engine Gear is the only part in the Original Series that applies torque in the counter-spin direction to the Bey's own rotation, producing a net spin-loss event at the moment of activation that is explicitly the mechanism for Dranzer GT's reverse attack strategy.

### System Architecture

```
Axial stack, side cross-section (EGS, First Clutch, standard EG):

         ┌──────────────────────────────────────┐
         │             BIT CHIP                  │  ← unchanged from MGS
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │           ATTACK RING                │  ← unchanged role
         │   [optional Sub-Attack Ring]         │
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │           WEIGHT DISK                │  ← unchanged role; dominant I
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │           BLADE BASE                 │  ← contains clutch mechanism
         │   [First / Final / No / Stopper]     │  ← clutch type determines trigger
         │   [EG cavity, upper]                 │  ← receives EG body
         │   [clutch tabs engage EG latch]      │  ← latch geometry = trigger timing
         │   [tip exit, lower]                  │
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐  ← REPLACES NEO SG + Core
         │           ENGINE GEAR                │  ← r_outer ≈ 19–22 mm, 10–21 g
         │   ┌──────────────────────────────┐   │
         │   │  spring chamber              │   │  ← wound by Turbo Winder pre-launch
         │   │  [coil spring, pre-wound]    │   │
         │   │  [EG latch: holds spring]    │   │  ← released by BB clutch tabs
         │   └──────────────────────────────┘   │
         │   [chirality: Right or Left EG]      │  ← fixed at manufacture in EG body
         │   ┌──────────────────────────────┐   │
         │   │  tip / CEW slot (lower)      │   │  ← standard tip or CEW insert
         │   └──────────────────────────────┘   │
         └──────────────────────────────────────┘
                            │
         [tip or CEW tip] ← floor contact point
                            │
                       ──────────── stadium floor
```

### SG/NEO SG vs Engine Gear: Structural Comparison

| Property | Spin Gear / NEO SG | Engine Gear |
|----------|--------------------|-------------|
| Mass | ~2.24 g (shells only) | ~10–21 g |
| I contribution | ~6–9% of system I | ~20–40% of system I |
| Energy storage | None (passive part) | Coil spring pre-wound before launch |
| Chirality mechanism | Launcher cord tab position | Fixed in EG body at manufacture |
| Core interchangeability | Yes (NEO SG hollow centre) | No; tip via CEW slot only |
| BB compatibility | SGS/MGS BB cavity | EGS-exclusive BB cavity; not cross-compatible |
| Clutch timing | Not applicable | Controlled by BB clutch type |
| Winding tool required | No | Yes (Turbo Winder) |

### Spring Energy Storage and Release

The EG spring is wound before launch using the Turbo Winder, which rotates the spring shaft to compress the coil. Stored elastic potential energy:

```
E_spring = ½ × k × x²

  k = spring constant (N/m)
  x = compression distance (m), proportional to number of wind turns
```

At clutch release the spring drives the EG tip shaft, applying a torque to the Bey body. The angular impulse delivered:

```
J_angular = ∫ τ_spring dt  ≈  ΔL = I_total × Δω_release

Rearranging for spin boost:
  Δω_release = J_angular / I_total

Energy-impulse relation (ideal, no friction loss):
  ½ × I_total × Δω_release² = E_spring
  Δω_release = √(2 × E_spring / I_total)
```

Representative Standard EG (E_spring ≈ 0.05 J estimated, I_total ≈ 9.5×10⁻⁶ kg·m²):
```
Δω_release = √(2 × 0.05 / 9.5×10⁻⁶)
           = √(10526)
           ≈ 102.6 rad/s  (≈ 980 RPM instantaneous boost)
```

Turbo EG provides 4× stronger release, meaning 4× the energy stored:
```
E_turbo = 4 × E_standard = 4 × 0.05 = 0.20 J
Δω_turbo = √(2 × 0.20 / 9.5×10⁻⁶) = √(42105) ≈ 205.2 rad/s  (≈ 1959 RPM boost)
```

The 4× energy ratio requires either a spring constant 4× larger at the same compression, or a winding depth √4 = 2× greater at the same k. Turbo Winders are physically larger to accommodate the additional winding depth.

### Blade Base Clutch Types

The BB clutch mechanism determines when the EG latch releases. Four distinct architectures:

```
FIRST CLUTCH (Instant Release):
  EG latch geometry: releases immediately on launcher pull
  Trigger: launch event itself
  Timeline: Δω_release applied at t ≈ 0 (peak spin is at launch)
  Use case: attack — Bey enters the stadium at maximum angular velocity
  Risk: EG energy consumed before opponent contact; no second burst

FINAL CLUTCH (Hit Release):
  EG latch geometry: spring-loaded tabs held closed by centrifugal force at high spin
  Trigger: (a) physical impact forces tabs inward past lock point, OR
           (b) spin decays below centrifugal threshold ω_c
  Pre-use requirement: clutch tabs must be manually pulled before winding
  Centrifugal release threshold:
    ω_c = √(F_retention / (m_arm × r_cam))
    where F_retention = spring force holding tabs closed
          m_arm       = mass of centrifugal arm
          r_cam       = radius of cam engagement point
  Timeline: Δω_release applied mid-to-late battle (on impact or at low spin)
  Use case: stamina/defense — burst rescues a flagging Bey near end of match

NO CLUTCH (Steady Release):
  EG latch: absent — spring engaged from the moment of launch
  Trigger: none; spring energy bleeds continuously into Bey rotation
  Timeline: sustained torque across full match duration
  Use case: paired with CEW (heavier EG variant); provides constant drive
  Bey type: Compact/Defense — CEW mass slows launch speed but spring maintains spin

ENGINE STOPPER BASE (Gyro EG exclusive):
  EG latch: absent; Bey can be launched via ripcord inserted into BB itself
  Launcher: not required; ripcord seats directly in BB
  Use case: exclusive to Gyro Engine Gear (Flame Pegasus)
  Physical consequence: tip bearing allows free-spin regardless of spring state
```

### Engine Gear Variants

**Standard EG (Right / Left):**
- Basic spring mechanism; tip geometry varies per release
- Tip is replaceable on most Standard EG Beyblades
- Chirality fixed in EG body; Right EG incompatible with Left-spin BB

**Turbo EG (Right / Left):**
- Spring constant or winding depth produces 4× release energy
- Always paired with Custom Engine Weights
- Tip replacement became less common near end of EGT System
- Exclusively used in Dragoon GT and Dranzer GT

**Reverse EG:**
```
Counter-rotation mechanism:

  Bey body spin direction: CW (right spin)
  Reverse EG spring wind direction: CCW

  At latch release:
    Spring torque τ_REG acts CCW on the tip shaft
    Tip contacts floor and transmits CCW friction to stadium
    Reaction applies CCW torque to Bey body (Newton 3rd)

  Net effect on Bey angular momentum:
    L_after = L_before − J_REG

    The Reverse EG subtracts angular momentum at release.
    Wiki confirms: "Beyblade slows down when the gear kicks in."

  Strategic purpose (Dranzer Gigs Turbo Reverse Attack):
    The counter-spin tip contacts the opponent's CCW tip moment → relative tip velocity
    between the two Beys is (ω_Dranzer_body + ω_REG), amplifying contact speed.
    The spin-loss is the cost paid to achieve this amplified contact event.
```

Exclusive to Dranzer GT. Always paired with CEW and Final Clutch Base (Dranzer GT version). The Final Clutch trigger on impact is the only logical pairing: firing the Reverse EG on contact maximises the amplified-tip-velocity window at exactly the collision moment.

**Gyro EG:**
- Bearing at tip decouples tip rotation from EG spring shaft and Bey body
- Tip spins freely and independently (bearing isolation, not frictional coupling)
- Uses plastic bearing (vs metal in SG Free Shaft Version — the only case in the system where plastic bearing was chosen; likely mass and cost optimisation)
- Exclusive to Flame Pegasus; must pair with Engine Stopper Base
- No launcher required: ripcord inserts into BB directly

```
Gyro EG tip isolation:

  Standard EG:  spring shaft ──friction──→ tip contact point (coupled)
  Gyro EG:      spring shaft ──bearing──→ tip shaft (decoupled)
                                  ↑
                           tip spins at floor-contact RPM,
                           not at Bey body RPM
  Result: tip friction decoupled from spin decay → lower τ_friction → better stamina
```

**Customize Gears (CG):**
- Functionally enlarged versions of the SGS Right SG (Free Shaft Version)
- Carry an interchangeable tip that spins freely and independently from the Bey
- Heavier than Standard EG at the same radius
- Exclusive to Zeus and Gigars
- No spring mechanism — Customize Gears are passive (no energy storage)
- Classified under EGS despite being mechanically closer to an oversized SG Free Shaft

### Custom Engine Weights (CEW)

The CEW slot is a cavity at the bottom of the EG that accepts interchangeable tip inserts. The CEW tip spins freely and independently from the EG spring shaft — it is bearing-decoupled from the spring mechanism.

```
EG with CEW:

  EG spring shaft rotation (ω_spring)
            ↓
        [bearing]           ← decouples spring shaft from CEW
            ↓
  CEW tip rotation (ω_CEW) ← set by floor friction, not by spring
```

CEW variants covered in earlier cases: Circle Defenser, Circle Survivor, Metal Ball, Metal Sharp, Metal Semi-Flat, Light Sharp, Metal Grip, Metal Change. Each CEW tip geometry produces a distinct contact patch and friction regime, analysed per-part.

CEW-equipped EGs are heavier than standard EGs at the same shell radius because the CEW insert adds tip mass inside the EG body. This mass sits near the axis (low r_CEW ≈ 5–8 mm) and contributes minimally to I but increases total Bey mass and therefore N_normal on the tip.

### Heavy Metal Core in EGS Context

The Heavy Metal Core is a Magnacore System Core that was packaged with some EGS releases (notably Metal Driger). It is not an EG component — it seats in a NEO SG cavity, not an EG cavity. Its appearance in EGS packaging reflects a Takara decision to include cross-system parts rather than EGS parts; Hasbro replaced it with Engine Gears in their releases of the same Beyblades. The HMC is analysed in the MGS Core taxonomy (Case 361) and its per-part physics in Case 185.

### EGS Inertia Budget

The EG's large mass fundamentally shifts the I budget versus prior systems:

```
I_EG = ½ × m_EG × (r_i² + r_o²)

Standard EG (m ≈ 10 g = 0.010 kg, r_i ≈ 4 mm, r_o ≈ 19 mm):
I_EG = ½ × 0.010 × ((0.004)² + (0.019)²)
     = ½ × 0.010 × (1.6×10⁻⁵ + 3.61×10⁻⁴)
     = ½ × 0.010 × 3.77×10⁻⁴
     ≈ 1.89×10⁻⁶ kg·m²

Gyro EG (m ≈ 21.2 g = 0.0212 kg, same radii):
I_GEG = ½ × 0.0212 × 3.77×10⁻⁴
      ≈ 3.99×10⁻⁶ kg·m²
```

| Layer | Mass (g) | I (kg·m²) | Share (Std EG) | Share (Gyro EG) |
|-------|----------|-----------|----------------|-----------------|
| Bit Chip | 1.0 | 4.05×10⁻⁸ | 0.4% | 0.3% |
| Attack Ring | 6.0 | 2.03×10⁻⁶ | 21.4% | 15.3% |
| Weight Disk (Wide) | 14.0 | 3.50×10⁻⁶ | 36.9% | 26.4% |
| Blade Base | 5.0 | 1.04×10⁻⁶ | 11.0% | 7.8% |
| Engine Gear | 10.0 / 21.2 | 1.89 / 3.99×10⁻⁶ | 19.9% | 30.1% |
| CEW (if present) | ~4.0 | ~9.6×10⁻⁸ | ~1.0% | ~0.7% |
| **Total** | **~36 / ~47** | **9.49 / 13.27×10⁻⁶** | 100% | 100% |

In SGS the SG layer was ~9.5% of system I. In EGS the Standard EG is ~20% and the Gyro EG is ~30%. The EG is the largest single variable in the I budget; no other layer changes as much between EGS builds as the EG choice. WD remains co-dominant at ~26–37% but is no longer the sole dominant term.

### TypeScript Model

```typescript
function egSpringBoost(
  springEnergyJ: number,
  iTotalKgm2: number
): number {
  return Math.sqrt(2 * springEnergyJ / iTotalKgm2); // rad/s
}

function finalClutchThreshold(
  fRetentionN: number, armMassG: number, camRadiusMm: number
): number {
  return Math.sqrt(fRetentionN / ((armMassG / 1000) * (camRadiusMm / 1000))); // rad/s
}

function reverseEGNetMomentum(
  lBeforeKgm2rads: number, jReverseKgm2rads: number
): number {
  return lBeforeKgm2rads - jReverseKgm2rads; // net L after counter-spin release
}

function egSystemInertia(
  arMassG: number, arOuterMm: number,
  wdMassG: number, wdOuterMm: number,
  bbMassG: number, bbOuterMm: number,
  egMassG: number, egOuterMm: number,
  cewMassG: number, cewOuterMm: number
): { iEG: number; iWD: number; iTotal: number; egSharePct: number; wdSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iBC  = 0.5 * toKg(1.0) * toM(9) ** 2;
  const iAR  = annular(toKg(arMassG),  toM(10), toM(arOuterMm));
  const iWD  = annular(toKg(wdMassG),  toM(4),  toM(wdOuterMm));
  const iBB  = annular(toKg(bbMassG),  toM(4),  toM(bbOuterMm));
  const iEG  = annular(toKg(egMassG),  toM(4),  toM(egOuterMm));
  const iCEW = cewMassG > 0
    ? annular(toKg(cewMassG), toM(0), toM(cewOuterMm))
    : 0;
  const iTotal = iBC + iAR + iWD + iBB + iEG + iCEW;

  return { iEG, iWD, iTotal,
           egSharePct: (iEG / iTotal) * 100,
           wdSharePct: (iWD / iTotal) * 100 };
}

// egSpringBoost(0.05, 9.49e-6)   → ≈ 102.6 rad/s  (Standard EG burst)
// egSpringBoost(0.20, 9.49e-6)   → ≈ 205.2 rad/s  (Turbo EG, 4× energy)
// finalClutchThreshold(0.15, 2.0, 8)
//   → ≈ 96.8 rad/s  (≈ 924 RPM; Final Clutch fires below this spin)
// reverseEGNetMomentum(0.025, 0.008)
//   → 0.017 kg·m²·rad/s  (Bey loses 32% of angular momentum at Reverse EG release)
// egSystemInertia(6, 24, 14, 22, 5, 20, 10, 19, 0, 0)
//   → iEG ≈ 1.89×10⁻⁶, iWD ≈ 3.50×10⁻⁶, iTotal ≈ 9.49×10⁻⁶
//      egSharePct ≈ 19.9%, wdSharePct ≈ 36.9%  (Standard EG, no CEW)
// egSystemInertia(6, 24, 14, 22, 5, 20, 21.2, 19, 4, 8)
//   → iEG ≈ 3.99×10⁻⁶, iTotal ≈ 1.33×10⁻⁵, egSharePct ≈ 30.0%  (Gyro EG)
```

---

## Case 363 — Hard Metal System (HMS): Complete Architecture Break, Running Core Consolidation, and Metal AR Contact Physics

**Thesis:** The Hard Metal System is the fifth and final Beyblade system of the Original Series (Generation 1 / Plastic Gen); it represents a complete compatibility break with all four predecessor systems — 4LS, SGS, MGS, EGS — and introduces a four-layer architecture (Bit Protector, Attack Ring, Weight Disk, Running Core) that consolidates the Spin Gear and Blade Base of plastics-generation Beyblades into a single Running Core unit; the Attack Ring gains a Metal Frame for the first time in the Original Series, and this addition at the contact perimeter produces three compounding effects — higher collision impulse due to zinc's ~6.3× density over ABS, near-zero contact-face deformation eliminating the energy loss to indentation that plastic ARs incur, and a co-dominant I contribution that displaces the WD as the sole dominant inertia term; an overall size reduction to approximately 75% of plastics-generation dimensions reduces I proportionally to the square of that factor (~56%), meaning that at equal launch energy HMS Beyblades achieve higher angular velocity than their plastic predecessors; the Dual Shooter eliminates part-based chirality selection entirely by providing separate Left and Right ripcord insertion holes, making spin direction a launcher choice rather than a Beyblade assembly property for the first time in any system; and the Running Core's structural role as the axle-spine of the Bey — with the AR and WD sliding over it and the Bit Protector locking from above — reverses the assembly logic of all plastics systems, where the Blade Base was the bottom terminus rather than the central spine.

### System Architecture

```
Axial stack, side cross-section (HMS standard assembly):

         ┌─────────────────────────────────────┐
         │          BIT PROTECTOR (BP)          │  ← r ≈ 14–16 mm; structural lock
         │  [Dual Shooter latch point]          │  ← launcher grips here
         │  [press-fit onto RC upper post]      │  ← held by RC; cannot fall out
         └─────────────────────────────────────┘
                            │ (slides over RC)
         ┌─────────────────────────────────────┐
         │          ATTACK RING (AR)            │  ← r_outer ≈ 16–22 mm (75% scale)
         │  ┌────────────────────────────────┐  │
         │  │ Metal Frame (zinc alloy)        │  │  ← outer contact perimeter; metal
         │  │ r ≈ contact protrusions         │  │  ← dense, non-deforming
         │  └────────────────────────────────┘  │
         │  ┌────────────────────────────────┐  │
         │  │ ABS Caul                        │  │  ← inner structural ABS ring
         │  │ seats around RC body            │  │  ← slides over RC
         │  └────────────────────────────────┘  │
         └─────────────────────────────────────┘
                            │ (slides over RC)
         ┌─────────────────────────────────────┐
         │          WEIGHT DISK (WD)            │  ← all circular in HMS
         │  [standard: solid metal annulus]     │  ← r_outer ≈ 16–20 mm
         │  [CWD: notched rim for ABS inserts]  │  ← Free Spinning or Stationary
         └─────────────────────────────────────┘
                            │ (slides over RC)
         ┌─────────────────────────────────────┐  ← SPINE of entire assembly
         │          RUNNING CORE (RC)           │  ← consolidates SG + BB
         │  [upper post: BP, AR, WD slide over] │  ← axle / spine
         │  [chirality: set by Dual Shooter]    │  ← NOT encoded in RC geometry
         │  [tip, lower]                        │  ← sole floor contact point
         └──────────────────┬──────────────────┘
                            │
                          [tip]
                            │
                       ─────────── stadium floor
```

### Assembly Logic Reversal vs Plastics Systems

```
Plastics (4LS / SGS / MGS / EGS):
  Blade Base = bottom terminus; other parts stack downward onto/around it
  Bit Chip = top terminus; sits in AR, purely decorative/structural-minor
  Assembly order: BB → SG → WD → AR → BC (bottom-up)

HMS:
  Running Core = central spine / axle; everything slides OVER it
  Bit Protector = locking cap at top; structural and launcher-engagement role
  Assembly order: RC (spine) → WD slides over → AR slides over → BP locks from top
```

The BP's structural importance is categorically different from the Bit Chip: a Bit Chip falling out in battle had no mechanical consequence (the AR held the WD in place independently). A BP displacement would allow AR and WD to separate from the RC, ending the battle immediately. The RC's post geometry prevents this; BP is held by the RC rather than by press-friction alone.

### Plastics vs HMS: Architectural Comparison

| Property | Plastics (4LS–EGS) | Hard Metal System |
|----------|-------------------|------------------|
| Generations | Gen 1 (Original Series / Plastic Gen) | Gen 1 final system |
| Layer count | 4–6 (system-dependent) | 4 |
| Chirality source | Part geometry (BB or SG) | Dual Shooter hole selection |
| AR material | ABS only | Metal Frame + ABS Caul |
| WD shape | Varied (non-circular options) | All circular |
| SG + BB | Separate layers | Consolidated into Running Core |
| Bit Chip / BP role | Decorative + light clip | Structural lock + launcher interface |
| Size vs plastics | Baseline | ~75% linear dimension |
| I vs plastics (same mass) | Baseline | ~56% (0.75² scaling) |
| Cross-system compat | Partial (SGS/MGS compatible) | None; complete break |

### Size Reduction: Inertia and Angular Velocity Consequences

All linear dimensions scale to ~0.75×. Moment of inertia scales as length²:

```
I_HMS ≈ (0.75)² × I_plastics = 0.5625 × I_plastics

For a representative plastics Wide WD build: I_plastics ≈ 7.1×10⁻⁶ kg·m²
I_HMS estimate: 0.5625 × 7.1×10⁻⁶ ≈ 3.99×10⁻⁶ kg·m²
```

At equal launch energy E_launch = ½ × I × ω₀²:

```
ω₀ = √(2 × E_launch / I)

ω₀_HMS    / ω₀_plastics = √(I_plastics / I_HMS)
                        = √(1 / 0.5625)
                        = √(1.778)
                        ≈ 1.333

HMS launches at ~33% higher angular velocity than a plastics Bey from the same launch energy.
```

Spin decay rate: tip friction torque τ = μ × m × g × r_tip. If r_tip scales to 0.75×:
```
τ_HMS = 0.75 × τ_plastics   (tip radius smaller)

dω/dt = −τ / I

dω/dt_HMS = −(0.75 × τ) / (0.5625 × I)
           = −(0.75 / 0.5625) × (τ / I)
           = −1.333 × dω/dt_plastics

HMS loses angular velocity 33% faster per second — but started 33% higher, so spin-out time is equivalent.
```

Angular momentum decay:
```
dL/dt = −τ   (independent of I)

dL/dt_HMS = −0.75 × τ_plastics

HMS angular momentum decays 25% more slowly per second than plastics at equal mass.
Time to zero angular momentum: t_stop = L₀ / τ = I × ω₀ / τ

t_stop_HMS / t_stop_plastics = (I_HMS × ω₀_HMS) / (I_plastics × ω₀_plastics) × (τ_plastics / τ_HMS)
= (0.5625 × 1.333) / 1.0 × (1.0 / 0.75)
= 0.75 / 0.75 = 1.0
```

At equal launch energy and equal mass, HMS and plastics spin out in approximately the same total elapsed time. The perceived advantage is not spin duration but angular velocity — HMS is spinning visibly faster at every point in the match, which corresponds to higher centrifugal stability and harder collision contacts.

### Metal Frame Contact Physics

Plastics AR contact face: ABS (E ≈ 2.3 GPa, ρ ≈ 1050 kg/m³)
HMS Metal Frame contact face: zinc alloy (E ≈ 100 GPa, ρ ≈ 6600 kg/m³)

**Density advantage at contact perimeter:**
```
ρ_zinc / ρ_ABS = 6600 / 1050 ≈ 6.29×

For the same contact-protrusion volume, zinc delivers 6.29× more mass at r_outer.
This mass contribution raises I_AR_metal and raises collision momentum transfer.
```

**Contact deformation (Hertzian contact, sphere-on-flat approximation):**
```
Contact radius: a = (3WR / 4E*)^(1/3)

Combined modulus E* (two ABS surfaces):
  1/E*_ABS = 2×(1−ν²)/E_ABS = 2×(1−0.35²)/2.3×10⁹ ≈ 7.52×10⁻¹⁰ Pa⁻¹
  E*_ABS ≈ 1.33×10⁹ Pa

Combined modulus E* (ABS vs zinc):
  1/E*_mixed = (1−ν_ABS²)/E_ABS + (1−ν_Zn²)/E_Zn
             = (1−0.1225)/2.3×10⁹ + (1−0.09)/100×10⁹
             ≈ 3.82×10⁻¹⁰ + 9.1×10⁻¹²
             ≈ 3.91×10⁻¹⁰ Pa⁻¹
  E*_mixed ≈ 2.56×10⁹ Pa

a_HMS / a_plastics = (E*_ABS / E*_mixed)^(1/3)
                   = (1.33×10⁹ / 2.56×10⁹)^(1/3)
                   = (0.520)^(1/3)
                   ≈ 0.804

HMS contact patch is ~80% the radius of a plastics-on-plastics contact → smaller area → higher peak pressure → impulse delivered over shorter contact time → higher peak force for the same collision energy.
```

**Deformation energy loss:**
In a plastics-on-plastics collision a fraction of kinetic energy is absorbed as plastic (recoverable/irrecoverable) deformation of the ABS contact faces. Zinc's elastic modulus is ~43× higher than ABS, meaning the zinc surface does not deform measurably at Beyblade collision loads. Energy that would have gone to indentation in a plastic AR is fully returned as elastic rebound, increasing effective coefficient of restitution.

### Chirality via Dual Shooter

In all plastics systems (4LS through EGS), spin direction is a property of a physical part: in 4LS it is the Blade Base ratchet; in SGS/MGS it is the Spin Gear shell tab position; in EGS it is the EG body. Changing chirality requires replacing that part.

In HMS chirality is a launcher property: the Dual Shooter has two ripcord insertion holes, one indexed to Left spin and one to Right. The Running Core accepts either orientation because the BP/AR/WD assembly is not chirality-locked to the RC geometry. The G-Winder is inserted into the correct hole at launch; no part of the Bey changes.

```
Plastics chirality change: replace SG shells (SGS) or entire EG (EGS)
HMS chirality change:      insert G-Winder into opposite Dual Shooter hole
Time to switch: plastics ≈ 30–60 s (disassembly/swap); HMS ≈ 0 s (no disassembly)
```

### Customize Weight Disk (CWD)

All HMS WDs are circular. CWDs add a notched rim:

```
CWD cross-section (side view):

         ┌──────────────────────────────┐
         │  solid metal annulus         │  ← standard WD body
         │                              │
         │  ◄ notch ► ◄ notch ►        │  ← small ridges at outer circumference
         └──────────────────────────────┘
                     │
         [ABS insert slots here]

Free Spinning insert:
  Does not engage notches; rotates freely on the WD rim.
  Physics: same mechanism as Sub-Attack Ring — free rotation absorbs collision
  impulse into insert angular momentum rather than transmitting to Bey body.
  Transmitted fraction = I_Bey / (I_Bey + I_insert)

Stationary insert:
  Engages notches; locked to WD rotation.
  Physics: adds peripheral mass at r_outer, increasing I_WD and total I_total.
  I_insert = ½ × m_insert × (r_i_insert² + r_o_insert²)
  Added to I_total as a standard annular term.
```

### Running Core Consolidation and Gimmick Capacity

The RC is structurally equivalent to the combined SG + BB from plastics systems. Because it is the single central spine, all gimmick mechanisms that previously required both a gimmick SG and a matching BB are now housed in one part. The Battle Change Core (Samurai Changer MS) demonstrates this: mode-change geometry, tip switch cam, and base locking are all within the RC unit rather than split between a gimmick SG and its exclusive BB.

### HMS Inertia Budget

```
I_total = I_BP + I_AR_metal + I_AR_ABS + I_WD + I_RC
```

Representative HMS build (standard AR, standard WD):

| Layer | Material | Mass (g) | r_outer (mm) | I (kg·m²) | Share |
|-------|----------|----------|-------------|-----------|-------|
| Bit Protector | ABS | 1.5 | 14 | 1.47×10⁻⁷ | 3.7% |
| AR Metal Frame | Zinc | 5.0 | 18 | 1.06×10⁻⁶ | 26.6% |
| AR ABS Caul | ABS | 3.0 | 18 | 5.82×10⁻⁷ | 14.6% |
| Weight Disk | Metal | 10.0 | 18 | 1.70×10⁻⁶ | 42.6% |
| Running Core | ABS/metal | 6.0 | 14 | 6.00×10⁻⁷ | 15.0% |
| **Total** | | **25.5** | | **3.99×10⁻⁶** | 100% |

AR total (Metal + ABS Caul): 1.64×10⁻⁶ kg·m² — 41.1% of system I. In plastics systems the WD was the dominant layer at ~50%; in HMS the AR rivals the WD because the metal density concentrates mass at large r. WD remains the single largest individual term at 42.6% but the AR's two-part combined contribution is comparable.

### TypeScript Model

```typescript
function hmsInertia(
  metalFrameMassG: number, metalFrameOuterMm: number, metalFrameInnerMm: number,
  absCaulMassG: number,    absCaulOuterMm: number,
  wdMassG: number,         wdOuterMm: number,
  rcMassG: number,         rcOuterMm: number,
  cwdInsertMassG: number,  cwdInsertOuterMm: number,
  cwdFreeSpinning: boolean
): { iAR: number; iWD: number; iRC: number; iTotal: number; arSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iBP    = 0.5 * toKg(1.5) * toM(14) ** 2;
  const iMetal = annular(toKg(metalFrameMassG), toM(metalFrameInnerMm), toM(metalFrameOuterMm));
  const iCaul  = annular(toKg(absCaulMassG),   toM(8),                 toM(absCaulOuterMm));
  const iAR    = iMetal + iCaul;
  const iWDbase = annular(toKg(wdMassG), toM(4), toM(wdOuterMm));
  // free-spinning inserts do NOT add to I_total (rotate independently)
  const iInsert = cwdFreeSpinning
    ? 0
    : annular(toKg(cwdInsertMassG), toM(wdOuterMm), toM(cwdInsertOuterMm));
  const iWD    = iWDbase + iInsert;
  const iRC    = annular(toKg(rcMassG), toM(2), toM(rcOuterMm));
  const iTotal = iBP + iAR + iWD + iRC;

  return { iAR, iWD, iRC, iTotal, arSharePct: (iAR / iTotal) * 100 };
}

function hmsLaunchOmegaRatio(): number {
  // HMS vs plastics omega at equal launch energy; I_HMS = 0.5625 × I_plastics
  return Math.sqrt(1 / 0.5625); // ≈ 1.333
}

function metalContactPatchRatio(eABS_GPa: number, eZinc_GPa: number, nuABS: number, nuZinc: number): number {
  const invEstar = (e: number, nu: number) => (1 - nu ** 2) / (e * 1e9);
  const eStarABS   = 1 / (2 * invEstar(eABS_GPa,  nuABS));
  const eStarMixed = 1 / (invEstar(eABS_GPa, nuABS) + invEstar(eZinc_GPa, nuZinc));
  return (eStarABS / eStarMixed) ** (1/3); // a_HMS / a_plastics
}

// hmsInertia(5, 18, 10, 3, 18, 10, 18, 6, 14, 0, 0, false)
//   → iAR ≈ 1.64×10⁻⁶, iWD ≈ 1.70×10⁻⁶, iTotal ≈ 3.99×10⁻⁶, arSharePct ≈ 41.1%
// hmsInertia(5, 18, 10, 3, 18, 10, 18, 6, 14, 2, 22, false)
//   → stationary CWD insert adds to I_WD (locked to WD rotation)
// hmsInertia(5, 18, 10, 3, 18, 10, 18, 6, 14, 2, 22, true)
//   → free-spinning CWD insert excluded from I_total (rotates independently)
// hmsLaunchOmegaRatio()
//   → ≈ 1.333  (HMS spins 33% faster than plastics at same launch energy)
// metalContactPatchRatio(2.3, 100, 0.35, 0.30)
//   → ≈ 0.804  (HMS contact patch 80% of plastics radius → harder, faster impact)
```

---

## Case 364 — Metal System (MFS): Generation 2 Opening Architecture, Wheel-Dominant Inertia, and Track Height Parametrisation

**Thesis:** The Metal System marks the opening of Generation 2 (Metal Saga / Metal Fight Beyblade), the complete architectural successor to Generation 1 (Original Series / Plastic Gen — Cases 359–363); it introduces a four-layer structure (Face Bolt, Wheel, Track, Bottom) that differs from every Generation 1 system in two foundational respects: first, the structural fastener is now a threaded screw (Face Bolt) rather than a press-fit cap, clip, or spring-retained locking part, making the assembly mechanically secure in a way that no prior system's top-cap component achieved; second, the Wheel — a single-piece metal ring — concentrates so much mass at the system's maximum radius that it contributes approximately 95% of total system moment of inertia, reducing the Track and Bottom to inertia-irrelevant components whose sole physics roles are height selection and tip contact mechanics respectively; the Track's height in tenths of a millimetre is encoded directly in its part number (145 = 14.5 mm, 230 = 23.0 mm, 100 = 10.0 mm), making height an explicitly tunable discrete variable for the first time in any Beyblade system; gimmick Tracks add aerodynamic, gravitational, and mechanical effects at the sub-Wheel level; and the Bottom's three-class taxonomy (Attack: flat/rubber, Defense: wide/ball, Stamina: sharp/free-spin) maps directly onto the three competitive archetypes, with tip geometry and material the sole determinant of movement pattern and spin decay rate in a system where the Wheel dictates all other physics.

### Generation Boundary

```
Generation 1 (Original Series / Plastic Gen): Cases 359–363
  4LS (1999) → SGS (2000) → MGS (2001) → EGS (2002) → HMS (2003)
  Common thread: Spin Gear / SG-derived chirality module; plastic-dominant ARs;
                 tip-carrying base = separate identifiable layer.

Generation 2 (Metal Saga / Metal Fight Beyblade): Cases 364+
  Metal System (2008) → Hybrid Wheel System → 4D System → Zero-G / Synchrome
  Common thread: Metal Wheel as dominant-I component; Face Bolt screw fastener;
                 Track = height module; Bottom = tip.
  Complete compatibility break with Generation 1.
```

### System Architecture

```
Axial stack, side cross-section (Metal System, standard build):

         ┌──────────────────────────────────────┐
         │            FACE BOLT                  │  ← threaded steel screw
         │  [sticker motif on head face]         │
         │  [screws DOWN through Wheel into Track]│  ← structural fastener
         └──────────────────────────────────────┘
                            │ (threaded through)
         ┌──────────────────────────────────────┐
         │              WHEEL                   │  ← single-piece metal ring
         │  [zinc/aluminum alloy]               │  ← r_outer ≈ 22–28 mm, 20–30 g
         │  [contact protrusions, outer rim]    │  ← sole contact surface vs opponent
         │  [Face Bolt hole, centre]            │  ← Face Bolt passes through
         │  [Track collar socket, underside]    │  ← Track upper post seats here
         └──────────────────────────────────────┘
                            │ (Track upper post)
         ┌──────────────────────────────────────┐
         │              TRACK                   │  ← ABS spine; sets Bey height
         │  [upper post: seats in Wheel socket] │
         │  [body: height = part number × 0.1 mm│  ← e.g., 145 → 14.5 mm
         │  [Bottom socket, lower end]          │  ← Bottom clips in here
         │  [optional gimmick mechanisms]       │  ← GB145 balls, DF145 fins, etc.
         └──────────────────────────────────────┘
                            │ (Bottom clips in)
         ┌──────────────────────────────────────┐
         │              BOTTOM                  │  ← tip; sole floor contact point
         │  [tip geometry: Attack/Defense/Stamina│
         │  [tip material: ABS / rubber / metal] │
         └──────────────────┬───────────────────┘
                            │
                          [tip]
                            │
                       ──────────── stadium floor
```

### Generation 1 vs Metal System: Architectural Comparison

| Property | Gen 1 (4LS–HMS) | Metal System (Gen 2) |
|----------|----------------|---------------------|
| Structural fastener | Press-fit / spring clip / BP lock | Threaded screw (Face Bolt) |
| Metal content | WD (plastics) / Metal Frame AR (HMS) | Wheel: entire ring is metal |
| AR / Wheel material | ABS or ABS + Metal Frame | Single-piece metal alloy |
| Height tuning | Fixed by BB (plastics) / RC (HMS) | Explicit: Track number = height in 0.1 mm |
| Tip separation from height | Combined in BB/RC | Separate: Track = height, Bottom = tip |
| I dominant layer | WD ~50% (plastics); AR ~41% (HMS) | Wheel ~95% |
| Chirality mechanism | SG tabs (plastics) / Dual Shooter hole (HMS) | Launcher; not encoded in Bey parts |
| Cross-gen compatibility | SGS/MGS partial | None with Gen 1 |

### Track Height Convention

Track part numbers encode height directly:

```
Track number = height in units of 0.1 mm

Examples:
  100  →  10.0 mm  (low; under-opponent AR contact)
  105  →  10.5 mm
  125  →  12.5 mm
  145  →  14.5 mm  (most common standard track)
  170  →  17.0 mm
  230  →  23.0 mm  (tallest; extreme height advantage / disadvantage)

Height determines the vertical level at which the Wheel contacts the opponent.
A Bey on 145 vs opponent on 100: Wheel-to-Wheel contact is at different axial levels.
A Bey on 230 vs opponent on 145: opponent Wheel contacts the Track body instead
  of the Wheel, bypassing the defender's metal contact surface entirely.
```

Height selection is the first time in any Beyblade system that a builder can explicitly target a specific axial contact point on the opponent's assembly. This did not exist in any Gen 1 system — Blade Base height was a fixed property of the BB, not a selectable module.

### Gimmick Tracks

| Track | Gimmick | Physics mechanism |
|-------|---------|------------------|
| GB145 (Gravity Ball 145) | Two or four metal balls in channels | Balls migrate outward at high spin (centrifugal), increasing I; migrate inward at low spin, reducing I — gyroscopic self-stabilisation |
| DF145 (Down Force 145) | Fins producing downward airflow | Aerodynamic normal-force increase: F_down ∝ ω²; increases N_tip → more friction resistance to ring-out |
| DF105 (Down Force 105) | Same as DF145, shorter height | As above; height 10.5 mm |
| T125 (Tornado 125) | Curved fins generating upward vortex | Reduced effective weight on tip; lower N_tip → less spin decay |
| C145 (Claw 145) | Outward-extending claw protrusions | Secondary contact surface below Wheel; contacts opponent's Track or Bottom |
| H145 (Horn 145) | Upward horn protrusions | Contacts opponent's Wheel underside or Track; mid-height interference |
| ED145 (Eternal Defense 145) | Free-spinning ring around Track body | Free-spin decouples collision impulse at Track level (same mechanism as Sub-AR) |
| CH120 (Change Height 120) | Switchable height mode | Builder selects height before match; locked during battle |
| TH170 (Triple Height 170) | Three selectable heights via rotation | 170 / 195 / 220 mm selectable; height strategy adjustable pre-launch |

**GB145 centrifugal I shift:**
```
Ball migrates from r_inner to r_outer as ω increases:

I_ball_low_spin  = m_ball × r_inner²   (ball seated near axis)
I_ball_high_spin = m_ball × r_outer²   (ball pressed to outer channel)

ΔI = m_ball × (r_outer² − r_inner²)

Representative (2 balls, m_ball = 1 g each = 0.001 kg, r_inner = 8 mm, r_outer = 20 mm):
ΔI = 0.001 × ((0.020)² − (0.008)²)
   = 0.001 × (4.0×10⁻⁴ − 6.4×10⁻⁵)
   = 0.001 × 3.36×10⁻⁴
   ≈ 3.36×10⁻⁷ kg·m²

At high spin: I_system increases by 3.36×10⁻⁷ → slower dω/dt (better stamina).
At low spin: I_system decreases → faster ω for same L (gyroscopic recovery).
```

### Bottom Taxonomy

```
Contact patch comparison (side view):

Attack (Flat/RF):          Defense (WD/WB):          Stamina (S/MS/EWD):
    ════════════               ╰──────╯                    ╿
   large flat disk           wide round dome             narrow point
   r_contact ≈ 4–8 mm       r_contact ≈ 2–4 mm          r_contact ≈ 0.5–1 mm
   μ = 0.35–0.85             μ = 0.20–0.35               μ = 0.10–0.20
   high F_lateral            high N resistance           minimum τ_friction
```

| Class | Examples | Contact radius | μ_kinetic | Spin decay dω/dt | Movement |
|-------|---------|---------------|-----------|-----------------|----------|
| Attack | F, HF, RF, R2F, MF | 4–8 mm | 0.35–0.85 | Fast (~50–150 rad/s²) | Aggressive, wide travel |
| Defense | WD, WB, RS, D | 2–4 mm | 0.20–0.35 | Medium (~15–40 rad/s²) | Stable, centered |
| Stamina | S, MS, ES, EDS, EWD | 0.5–1 mm | 0.10–0.20 | Slow (~5–15 rad/s²) | Minimal drift, precession |

Free-spinning Bottoms (EWD, ES, EDS) add a bearing between the tip shaft and the Bey body, decoupling tip rotation from Bey spin. This is the MFB equivalent of the Gyro EG in EGS: tip RPM is set by floor friction, not by Bey body RPM, minimising τ_friction at the tip.

### Wheel-Dominant Inertia Budget

The Wheel's large mass at large radius makes it the overwhelming I contributor:

```
I_Wheel (zinc alloy, m ≈ 28 g = 0.028 kg, r_i ≈ 8 mm, r_o ≈ 23 mm):
I_W = ½ × 0.028 × ((0.008)² + (0.023)²)
    = ½ × 0.028 × (6.4×10⁻⁵ + 5.29×10⁻⁴)
    = ½ × 0.028 × 5.93×10⁻⁴
    ≈ 8.30×10⁻⁶ kg·m²

I_Track (ABS, m ≈ 4 g, r_i ≈ 3 mm, r_o ≈ 14 mm):
I_T = ½ × 0.004 × ((0.003)² + (0.014)²)
    = ½ × 0.004 × 2.05×10⁻⁴
    ≈ 4.10×10⁻⁷ kg·m²

I_Bottom (ABS/nylon, m ≈ 1.5 g, r ≈ 6 mm):
I_B = ½ × 0.0015 × (0.006)²
    ≈ 2.70×10⁻⁸ kg·m²

I_Face Bolt (steel, m ≈ 1 g, r ≈ 3 mm):
I_FB ≈ 0.5 × 0.001 × (0.003)² ≈ 4.5×10⁻⁹ kg·m²  (negligible)
```

| Layer | Mass (g) | I (kg·m²) | Share |
|-------|----------|-----------|-------|
| Face Bolt | 1.0 | 4.5×10⁻⁹ | 0.05% |
| Wheel | 28.0 | 8.30×10⁻⁶ | 94.9% |
| Track (145, std) | 4.0 | 4.10×10⁻⁷ | 4.7% |
| Bottom | 1.5 | 2.70×10⁻⁸ | 0.31% |
| **Total** | **34.5** | **8.75×10⁻⁶** | 100% |

**The Wheel contributes ~95% of system I.** Track and Bottom choices do not materially alter the I budget: switching from a 145 to a 230 Track changes I by less than 1%. This is the defining physics property of Generation 2 — Wheel selection is the inertia decision; all other layers affect movement pattern and height but not spin retention.

### Spin Decay Model

```
dω/dt = −(μ_tip × m_total × g × r_tip) / I_total

With I_total ≈ 8.75×10⁻⁶ kg·m², m_total ≈ 0.0345 kg:

Attack Bottom (RF, μ = 0.85, r_tip = 6 mm):
  τ = 0.85 × 0.0345 × 9.81 × 0.006 = 1.73×10⁻³ N·m
  dω/dt = −1.73×10⁻³ / 8.75×10⁻⁶ ≈ −197.7 rad/s²

Defense Bottom (WD, μ = 0.28, r_tip = 3 mm):
  τ = 0.28 × 0.0345 × 9.81 × 0.003 = 2.85×10⁻⁴ N·m
  dω/dt = −2.85×10⁻⁴ / 8.75×10⁻⁶ ≈ −32.6 rad/s²

Stamina Bottom (S, μ = 0.15, r_tip = 0.8 mm):
  τ = 0.15 × 0.0345 × 9.81 × 0.0008 = 4.07×10⁻⁵ N·m
  dω/dt = −4.07×10⁻⁵ / 8.75×10⁻⁶ ≈ −4.7 rad/s²

RF tip decays ~42× faster than S tip. The Wheel I is identical in all three cases;
only the Bottom contact parameters change the decay rate.
```

### TypeScript Model

```typescript
function metalSystemInertia(
  wheelMassG: number, wheelOuterMm: number, wheelInnerMm: number,
  trackMassG: number, trackOuterMm: number,
  bottomMassG: number, bottomOuterMm: number,
  gb145BallMassG: number, gb145OuterMm: number, gb145InnerMm: number,
  highSpin: boolean
): { iWheel: number; iTrack: number; iTotal: number; wheelSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iWheel  = annular(toKg(wheelMassG), toM(wheelInnerMm), toM(wheelOuterMm));
  const iTrack  = annular(toKg(trackMassG), toM(3), toM(trackOuterMm));
  const iBottom = 0.5 * toKg(bottomMassG) * toM(bottomOuterMm) ** 2;
  const iFB     = 4.5e-9; // negligible, fixed
  const r_ball  = highSpin ? toM(gb145OuterMm) : toM(gb145InnerMm);
  const iGB145  = gb145BallMassG > 0
    ? 2 * toKg(gb145BallMassG) * r_ball ** 2
    : 0;
  const iTotal  = iWheel + iTrack + iBottom + iFB + iGB145;

  return { iWheel, iTrack, iTotal, wheelSharePct: (iWheel / iTotal) * 100 };
}

function bottomSpinDecay(
  muKinetic: number, totalMassG: number, tipRadiusMm: number, iTotalKgm2: number
): number {
  const tau = muKinetic * (totalMassG / 1000) * 9.81 * (tipRadiusMm / 1000);
  return -(tau / iTotalKgm2); // rad/s²
}

// metalSystemInertia(28, 23, 8, 4, 14, 1.5, 6, 0, 0, 0, false)
//   → iWheel ≈ 8.30×10⁻⁶, iTotal ≈ 8.75×10⁻⁶, wheelSharePct ≈ 94.9%
// metalSystemInertia(28, 23, 8, 4, 14, 1.5, 6, 1, 20, 8, true)
//   → GB145 high-spin: iGB adds 8.0×10⁻⁷, iTotal increases by ~9%
// metalSystemInertia(28, 23, 8, 4, 14, 1.5, 6, 1, 20, 8, false)
//   → GB145 low-spin: iGB adds 1.28×10⁻⁷, smaller I → higher ω recovery
// bottomSpinDecay(0.85, 34.5, 6, 8.75e-6)   → ≈ −197.7 rad/s²  (RF, Attack)
// bottomSpinDecay(0.28, 34.5, 3, 8.75e-6)   → ≈  −32.6 rad/s²  (WD, Defense)
// bottomSpinDecay(0.15, 34.5, 0.8, 8.75e-6) → ≈   −4.7 rad/s²  (S, Stamina)
```

---

## Case 365 — Hybrid Wheel System (HWS): Wheel Bifurcation, Energy Ring Outer-Rim Polycarbonate, and Two-Dimensional Customisation

**Thesis:** The Hybrid Wheel System is the second Metal Series system; its single architectural change from the Metal System is the bifurcation of the Metal System's one-piece metal Wheel into two independent parts — the Fusion Wheel (metal, primary contact surface and main I contributor, seated around the Spin Track) and the Energy Ring (polycarbonate, outer-rim launcher-hook carrier, seated in grooves on the Fusion Wheel's outer circumference) — and this split has two compounding physics consequences: the Fusion Wheel is generally lighter than the single-piece Metal System Wheel it replaces because the Energy Ring now occupies the outermost annular zone, and because polycarbonate has approximately one-fifth the density of zinc, the Energy Ring contributes less I per unit volume than a metal ring at the same radius would, shifting the effective specific inertia of the combined wheel assembly slightly inward toward the Fusion Wheel's metal mass; the practical design consequence is a two-dimensional customisation matrix in which any Fusion Wheel can be paired with any Energy Ring, creating independent selection of metal contact geometry (Fusion Wheel) and outer-rim profile (Energy Ring); the Spin Track and Performance Tip layers carry over from the Metal System with identical physics — height convention (part number = height in 0.1 mm), gimmick track mechanisms, and three-class Bottom taxonomy are all unchanged; the Fusion Wheel remains the dominant I contributor at ~55% of system I, while the Energy Ring at maximum radius contributes ~31% despite its polycarbonate density, making the combined wheel assembly ~86% of system I and preserving the Metal System's fundamental property that Wheel choice determines spin retention.

### System Architecture

```
Axial stack, side cross-section (HWS standard build):

         ┌──────────────────────────────────────┐
         │            FACE BOLT                  │  ← threaded screw; unchanged from MS
         │  [sticker motif]                      │
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │           ENERGY RING                │  ← NEW LAYER (split from MS Wheel)
         │  [polycarbonate; ρ ≈ 1200 kg/m³]     │  ← outer circumference of Bey
         │  [r_outer ≈ 23–27 mm]                │  ← at maximum system radius
         │  [launcher hook slots ×2]            │  ← ripcord/string launcher grips here
         │  [seated in FW outer groove]         │  ← Fusion Wheel holds ER in place
         │  [beast motif / name carrier]        │  ← Pegasus, Leone, Bull, etc.
         └──────────────────────────────────────┘
         ┌──────────────────────────────────────┐
         │           FUSION WHEEL               │  ← metal; primary contact surface
         │  [zinc alloy; ρ ≈ 6600 kg/m³]        │  ← lighter than Metal System Wheel
         │  [r_inner ≈ 6 mm, r_outer ≈ 22 mm]  │
         │  [contact protrusions, outer rim]    │  ← attack geometry; may protrude past ER
         │  [ER groove, outer circumference]    │  ← ER seats here
         │  [Spin Track collar socket, centre]  │  ← Track upper post seats here
         │  [performance style name]            │  ← Storm, Rock, Earth, etc.
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │           SPIN TRACK                 │  ← unchanged from Metal System
         │  [height = part number × 0.1 mm]     │
         │  [gimmick variants: GB145, DF145…]   │
         └──────────────────────────────────────┘
                            │
         ┌──────────────────────────────────────┐
         │         PERFORMANCE TIP              │  ← unchanged from Metal System
         │  [Attack / Defense / Stamina class]  │
         └──────────────────┬───────────────────┘
                            │
                          [tip]
                            │
                       ──────────── stadium floor
```

### Metal System vs HWS: Architectural Comparison

| Property | Metal System | Hybrid Wheel System |
|----------|-------------|-------------------|
| Layer count | 4 | 5 |
| Wheel structure | Single-piece metal ring | Fusion Wheel (metal) + Energy Ring (polycarbonate) |
| Outermost layer material | Metal (zinc) | Polycarbonate (ER) |
| Launcher hook location | In Wheel geometry | Energy Ring slots |
| Beast/motif name | Part of Wheel | Energy Ring name |
| Performance name | Part of Wheel | Fusion Wheel name |
| Customisation axes | 1 (Wheel choice) | 2 (FW × ER matrix) |
| Spin Track / Tip | Identical | Identical (unchanged) |

### Wheel Bifurcation: Material and Density Consequences

```
Metal System Wheel (zinc, single piece):
  ρ_zinc ≈ 6600 kg/m³
  Entire outer annulus is metal → maximum I per unit volume at outer r

HWS split:
  Fusion Wheel inner zone: zinc, r ≈ 6–22 mm
  Energy Ring outer zone:  polycarbonate, r ≈ 20–27 mm

  ρ_polycarbonate ≈ 1200 kg/m³
  ρ_zinc / ρ_PC  ≈ 5.5×

  For equal volume at the outer annulus (r = 20–27 mm):
    m_zinc_equivalent = 5.5 × m_ER

  The ER contributes only (1/5.5) ≈ 18% of the mass that a zinc ring of identical
  geometry would contribute. The I loss at that radius vs a full-metal design:
    ΔI_lost = I_ER × (1 − 1/5.5) = I_ER × 0.818

  This mass is NOT recovered elsewhere — total system metal mass is genuinely lower
  in HWS than Metal System, which is what the wiki means by "Metal Wheels generally
  were lighter than their Wheel counterparts."
```

### Energy Ring Physics Roles

The Energy Ring performs three distinct functions, only one of which is mass/inertia:

**1. Launcher interface:**
```
Two hook slots are moulded into the ER at symmetric positions (~180° apart).
The string launcher's plastic hooks snap into these slots when the Bey is loaded.
The pull force transfers from string → hooks → ER → (via ER-FW groove friction) → FW → angular momentum.
ER groove contact quality determines launch consistency: a loose ER rattles and loses transfer efficiency.
```

**2. Outer-rim I contribution (despite low density):**
```
I_ER (polycarbonate, m ≈ 6 g = 0.006 kg, r_i ≈ 20 mm, r_o ≈ 26 mm):
I_ER = ½ × 0.006 × ((0.020)² + (0.026)²)
     = ½ × 0.006 × (4.00×10⁻⁴ + 6.76×10⁻⁴)
     = ½ × 0.006 × 1.076×10⁻³
     ≈ 3.23×10⁻⁶ kg·m²

Despite being polycarbonate, the large radius produces a meaningful I term.
An equivalent zinc ER would contribute: 3.23×10⁻⁶ × 5.5 ≈ 1.78×10⁻⁵ kg·m² — 5.5× more.
The ER is the I penalty that the HWS customisation freedom costs.
```

**3. Outer collision surface (profile-dependent):**
```
If the Fusion Wheel contact protrusions do NOT extend past r_ER_outer:
  → Energy Ring outer surface is the first collision contact point.
  → ER material (PC) takes the impact; lower E_PC (2.4 GPa) vs zinc (100 GPa)
    → larger contact patch → more energy absorbed in deformation vs zinc contact.

If Fusion Wheel protrusions extend past r_ER_outer:
  → Fusion Wheel metal makes first contact.
  → Hard zinc surface → smaller contact patch → harder impulse (as in HMS Metal Frame).

FW protrusion radius vs ER outer radius is therefore a design variable that
determines whether the Bey's primary contact is metal-hard or PC-soft.
```

### Naming Convention

HWS established the standard MFB naming format used through the 4D System:

```
[Fusion Wheel] [Energy Ring] [Spin Track height][Performance Tip code]

Example: Storm Pegasus 105RF
  "Storm"    = Fusion Wheel (metal contact geometry)
  "Pegasus"  = Energy Ring (beast motif; launcher hook carrier)
  "105"      = Spin Track 105 (10.5 mm height)
  "RF"       = Performance Tip Rubber Flat (Attack class)

The Fusion Wheel name encodes performance style.
The Energy Ring name encodes the beast / visual identity.
Both are independently selectable in any combination.
```

### HWS Inertia Budget

```
I_Fusion Wheel (zinc, m ≈ 22 g = 0.022 kg, r_i ≈ 6 mm, r_o ≈ 22 mm):
I_FW = ½ × 0.022 × ((0.006)² + (0.022)²)
     = ½ × 0.022 × (3.6×10⁻⁵ + 4.84×10⁻⁴)
     = ½ × 0.022 × 5.20×10⁻⁴
     ≈ 5.72×10⁻⁶ kg·m²

I_Energy Ring (polycarbonate, m ≈ 6 g): ≈ 3.23×10⁻⁶ kg·m²  (computed above)

I_Spin Track (ABS, m ≈ 4 g, r_o ≈ 14 mm): ≈ 4.10×10⁻⁷ kg·m²

I_Performance Tip (m ≈ 1.5 g, r ≈ 6 mm):  ≈ 2.70×10⁻⁸ kg·m²

I_Face Bolt: ≈ 4.5×10⁻⁹ kg·m² (negligible)
```

| Layer | Material | Mass (g) | I (kg·m²) | Share |
|-------|----------|----------|-----------|-------|
| Face Bolt | Steel | 1.0 | 4.5×10⁻⁹ | 0.05% |
| Energy Ring | Polycarbonate | 6.0 | 3.23×10⁻⁶ | 34.5% |
| Fusion Wheel | Zinc alloy | 22.0 | 5.72×10⁻⁶ | 61.1% |
| Spin Track (145) | ABS | 4.0 | 4.10×10⁻⁷ | 4.4% |
| Performance Tip | ABS/rubber | 1.5 | 2.70×10⁻⁸ | 0.3% |
| **Total** | | **34.5** | **9.37×10⁻⁶** | 100% |

**Combined wheel assembly (FW + ER): 8.95×10⁻⁶ kg·m² = 95.5% of system I.**

The combined wheel assembly share is almost identical to the Metal System Wheel's ~95%, which means the HWS customisation split does not alter the fundamental property: Wheel assembly choice determines spin retention. The split introduces zero penalty to that property — it only redistributes I within the wheel assembly between metal (FW) and polycarbonate (ER) zones.

Comparing I budgets across systems:

| System | Dominant layer | Dominant I (kg·m²) | Share |
|--------|---------------|-------------------|-------|
| SGS (plastics) | Weight Disk | 3.50×10⁻⁶ | ~49% |
| EGS | Engine Gear + WD | 5.39×10⁻⁶ (combined) | ~57% |
| HMS | WD + AR metal | 2.76×10⁻⁶ (combined) | ~69% |
| Metal System | Wheel (single) | 8.30×10⁻⁶ | ~95% |
| HWS | FW + ER (combined) | 8.95×10⁻⁶ | ~95.5% |

### TypeScript Model

```typescript
function hwsInertia(
  fwMassG: number, fwOuterMm: number, fwInnerMm: number,
  erMassG: number, erOuterMm: number, erInnerMm: number,
  trackMassG: number, trackOuterMm: number,
  tipMassG: number, tipRadiusMm: number
): { iFW: number; iER: number; iWheelAssembly: number; iTotal: number;
     fwSharePct: number; erSharePct: number; wheelAssemblySharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iFW    = annular(toKg(fwMassG),    toM(fwInnerMm), toM(fwOuterMm));
  const iER    = annular(toKg(erMassG),    toM(erInnerMm), toM(erOuterMm));
  const iTrack = annular(toKg(trackMassG), toM(3),         toM(trackOuterMm));
  const iTip   = 0.5 * toKg(tipMassG) * toM(tipRadiusMm) ** 2;
  const iFB    = 4.5e-9;
  const iWheelAssembly = iFW + iER;
  const iTotal = iFW + iER + iTrack + iTip + iFB;

  return { iFW, iER, iWheelAssembly, iTotal,
           fwSharePct: (iFW / iTotal) * 100,
           erSharePct: (iER / iTotal) * 100,
           wheelAssemblySharePct: (iWheelAssembly / iTotal) * 100 };
}

function erILossVsFullMetal(
  erMassG: number, erOuterMm: number, erInnerMm: number,
  rhoPC: number, rhoZinc: number
): { iER: number; iEquivZinc: number; iLostPct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iER = annular(toKg(erMassG), toM(erInnerMm), toM(erOuterMm));
  // what a zinc ring of same geometry would contribute
  const massZincEquiv = erMassG * (rhoZinc / rhoPC);
  const iEquivZinc = annular(toKg(massZincEquiv), toM(erInnerMm), toM(erOuterMm));
  return { iER, iEquivZinc, iLostPct: ((iEquivZinc - iER) / iEquivZinc) * 100 };
}

// hwsInertia(22, 22, 6, 6, 26, 20, 4, 14, 1.5, 6)
//   → iFW ≈ 5.72×10⁻⁶, iER ≈ 3.23×10⁻⁶, iWheelAssembly ≈ 8.95×10⁻⁶
//      iTotal ≈ 9.37×10⁻⁶, fwSharePct ≈ 61.1%, erSharePct ≈ 34.5%
//      wheelAssemblySharePct ≈ 95.5%
// hwsInertia(28, 22, 6, 6, 26, 20, 4, 14, 1.5, 6)
//   → heavier FW: fwSharePct increases, wheelAssembly share increases
// erILossVsFullMetal(6, 26, 20, 1200, 6600)
//   → iER ≈ 3.23×10⁻⁶, iEquivZinc ≈ 1.78×10⁻⁵, iLostPct ≈ 81.9%
//      (ER at PC density captures only 18.1% of the I that full zinc would give)
```

---

## Case 366 — 4D System: Sub-Part Fusion Wheel Reconfiguration, Mode-Change Contact Geometry, and Final Drive Centrifugal Tip Switch

**Thesis:** The 4D System is the third Metal Series system and the last before the Synchrome (Zero-G) generation; it retains the five-component HWS stack (Face Bolt, Energy Ring, Fusion Wheel, Spin Track, Performance Tip) but restructures the Fusion Wheel and Performance Tip layers internally according to four stated design principles — Different Material, Divided Wheel, Dynamic Drive, Deep Custom — whose collective physics consequence is that the Fusion Wheel becomes a configurable sub-assembly of up to three parts (PC Frame, Metal Frame, Core) whose relative positions can be changed to produce discrete contact-geometry modes before launch, and the 4D Bottom (Final Drive, F:D) collapses the Spin Track and Performance Tip into a single combined unit that contains a centrifugal mechanism triggering an automatic tip-mode transition during battle; these two changes introduce two new classes of performance variable that did not exist in the Metal System or HWS — pre-launch mechanical mode selection at the Fusion Wheel level, and mid-battle automatic tip-regime switching — while the inertia budget structure remains Wheel-assembly dominant at approximately 90–95% of system I, with the PC Frame now adding a third polycarbonate I term alongside the Energy Ring and making polycarbonate's share of total system I larger than in any prior Metal Series system.

### Four 4D Design Principles

```
1. DIFFERENT MATERIAL
   Fusion Wheels now incorporate multiple materials in distinct sub-parts:
   PC Frame (polycarbonate) + Metal Frame (zinc/steel) + Core (ABS or light metal).
   Purpose: each material serves a different physical role at its assigned radius.

2. DIVIDED WHEEL
   The Fusion Wheel is split into 2–3 sub-parts that can be repositioned relative
   to each other. Rotating or flipping a sub-part changes the outer contact geometry
   without replacing any part — mode selection is a reconfiguration operation.
   Purpose: multiple performance modes from a single Fusion Wheel purchase.

3. DYNAMIC DRIVE
   The 4D Bottom (F:D — Final Drive) contains a centrifugal mechanism that switches
   tip contact regime automatically during battle as spin speed changes.
   Purpose: one Bottom covers multiple match phases (launch, mid-battle, late-battle).

4. DEEP CUSTOM
   The combination of (1)+(2)+(3) creates a larger customisation space than HWS:
   any [mode config of FW] × [any ER] × [any Track or F:D] × [any Tip].
   Purpose: competitive depth without expanding the part catalogue proportionally.
```

### System Architecture

```
Axial stack, side cross-section (4D system, Cosmic FW + F:D Bottom):

         ┌──────────────────────────────────────────┐
         │              FACE BOLT                    │  ← unchanged
         └──────────────────────────────────────────┘
                              │
         ┌──────────────────────────────────────────┐
         │            ENERGY RING                   │  ← unchanged from HWS
         │  [polycarbonate; launcher hooks]         │
         └──────────────────────────────────────────┘
         ┌──────────────────────────────────────────┐
         │         4D FUSION WHEEL (Cosmic example) │
         │  ┌────────────────────────────────────┐  │
         │  │  PC FRAME (polycarbonate)           │  │  ← outer ring; repositionable
         │  │  r_outer ≈ 22–25 mm                │  │  ← changes contact profile
         │  └────────────────────────────────────┘  │
         │  ┌────────────────────────────────────┐  │
         │  │  METAL FRAME (zinc)                │  │  ← primary contact surface
         │  │  r ≈ 14–22 mm                      │  │  ← main I and smash source
         │  └────────────────────────────────────┘  │
         │  ┌────────────────────────────────────┐  │
         │  │  CORE (ABS / light alloy)           │  │  ← structural spine of FW
         │  │  r ≈ 6–14 mm                        │  │  ← seats on Spin Track / F:D
         │  └────────────────────────────────────┘  │
         └──────────────────────────────────────────┘
                              │
         ┌──────────────────────────────────────────┐
         │         4D BOTTOM — FINAL DRIVE (F:D)    │  ← combines Track + Tip
         │  [Spin Track body: sets height]          │  ← no separate Track needed
         │  [Tip 1: active at high spin]            │  ← centrifugal mechanism holds
         │  [Tip 2: active at low spin]             │  ← releases when ω < ω_switch
         │  [centrifugal cam / spring latch]        │  ← trigger at ω_switch
         └──────────────────┬───────────────────────┘
                            │
              [Tip 1 or Tip 2 depending on ω]
                            │
                       ──────────── stadium floor
```

### HWS vs 4D System: Structural Comparison

| Property | Hybrid Wheel System | 4D System |
|----------|-------------------|-----------|
| Fusion Wheel sub-parts | 1 (single metal piece) | Up to 3 (PC Frame + Metal Frame + Core) |
| FW mode changes | None (single geometry) | Pre-launch repositioning of PC/Metal Frame |
| Polycarbonate I sources | Energy Ring only | Energy Ring + PC Frame |
| Combined Track + Tip | Never (always separate) | F:D Bottom unifies both layers |
| Mid-battle tip switch | None | F:D centrifugal mechanism |
| Total configurable axes | 2 (FW × ER) | FW mode × ER × Track-or-F:D × Tip |

### 4D Fusion Wheel: Mode Change Physics

The PC Frame and Metal Frame each have an asymmetric geometry. When a sub-part is rotated or flipped relative to the Core, the outer contact profile changes:

```
Mode A (PC Frame position 1):
          PC Frame protrusion extends outward beyond Metal Frame rim
          → PC (polycarbonate) makes first contact with opponent
          → larger contact patch (lower E*); softer impulse; more PC deformation energy loss
          → lower effective recoil (PC absorbs some collision energy)

Mode B (PC Frame position 2 — rotated 30–60° or flipped):
          Metal Frame protrusions now extend past retracted PC Frame
          → zinc makes first contact
          → smaller contact patch (higher E*); harder impulse; near-zero deformation loss
          → higher smash efficiency

Contact angle also shifts between modes:
  φ_A = angle of PC contact face from radial
  φ_B = angle of Metal Frame contact face from radial (different geometry)

  Smash_A = cos(φ_A),  Recoil_A = sin(φ_A)
  Smash_B = cos(φ_B),  Recoil_B = sin(φ_B)

Mode selection is therefore a pre-launch decision that sets both material hardness
and angular impulse fractions for every collision in the match.
```

### Final Drive (F:D) Centrifugal Tip Switch

The F:D is structurally a short Spin Track with a tip mechanism. It contains two contact tip regimes separated by a centrifugal latch:

```
At high spin (ω > ω_switch):
  Centrifugal force on latch arms exceeds spring retention force:
  F_centrifugal = m_arm × r_cam × ω²  > F_spring_retention
  → latch holds Tip 1 geometry in contact with floor
  → Tip 1 contact parameters: radius r_1, friction μ_1

At low spin (ω < ω_switch):
  F_centrifugal < F_spring_retention
  → latch releases; spring or gravity shifts contact to Tip 2
  → Tip 2 contact parameters: radius r_2, friction μ_2

Switch threshold:
  ω_switch = √(F_spring_retention / (m_arm × r_cam))  [rad/s]

Spin decay rate in each mode:
  dω/dt_1 = −(μ_1 × m_total × g × r_1) / I_total   (high spin, Tip 1)
  dω/dt_2 = −(μ_2 × m_total × g × r_2) / I_total   (low spin, Tip 2)
```

The competitive design intent is that Tip 1 (high spin phase) and Tip 2 (low spin phase) have different performance profiles appropriate to each match phase. Because the specific F:D geometry varies per release, the exact (r_1, μ_1, r_2, μ_2) values are computed per-part when data is provided.

### 4D Inertia Budget

The PC Frame adds a third polycarbonate I term to the system:

```
I_PC Frame (polycarbonate, m ≈ 5 g = 0.005 kg, r_i ≈ 17 mm, r_o ≈ 24 mm):
I_PCF = ½ × 0.005 × ((0.017)² + (0.024)²)
      = ½ × 0.005 × (2.89×10⁻⁴ + 5.76×10⁻⁴)
      = ½ × 0.005 × 8.65×10⁻⁴
      ≈ 2.16×10⁻⁶ kg·m²

I_Metal Frame (zinc, m ≈ 18 g = 0.018 kg, r_i ≈ 10 mm, r_o ≈ 21 mm):
I_MF = ½ × 0.018 × ((0.010)² + (0.021)²)
     = ½ × 0.018 × (1.0×10⁻⁴ + 4.41×10⁻⁴)
     = ½ × 0.018 × 5.41×10⁻⁴
     ≈ 4.87×10⁻⁶ kg·m²

I_Core (ABS, m ≈ 4 g = 0.004 kg, r_i ≈ 4 mm, r_o ≈ 12 mm):
I_Core = ½ × 0.004 × ((0.004)² + (0.012)²)
       = ½ × 0.004 × (1.6×10⁻⁵ + 1.44×10⁻⁴)
       ≈ 3.20×10⁻⁷ kg·m²

I_Energy Ring (polycarbonate, m ≈ 6 g): ≈ 3.23×10⁻⁶ kg·m²  (from HWS)
```

| Layer | Material | Mass (g) | I (kg·m²) | Share |
|-------|----------|----------|-----------|-------|
| Face Bolt | Steel | 1.0 | 4.5×10⁻⁹ | ~0% |
| Energy Ring | Polycarbonate | 6.0 | 3.23×10⁻⁶ | 29.4% |
| PC Frame | Polycarbonate | 5.0 | 2.16×10⁻⁶ | 19.6% |
| Metal Frame | Zinc | 18.0 | 4.87×10⁻⁶ | 44.3% |
| Core | ABS | 4.0 | 3.20×10⁻⁷ | 2.9% |
| F:D Bottom (Track+Tip) | ABS/nylon | 3.0 | ~1.0×10⁻⁷ | ~0.9% |
| **Total** | | **37.0** | **1.10×10⁻⁵** | 100% |

**Polycarbonate total (ER + PC Frame): 5.39×10⁻⁶ kg·m² = 49.0% of system I.**

In HWS the ER was the only polycarbonate I source (~34.5%). In 4D the PC Frame adds a second polycarbonate layer; combined polycarbonate now approaches half the system I. This is the physics cost of "Different Material" — the additional PC Frame at large radius adds I while displacing what would otherwise be zinc volume, holding total Wheel mass lower than it would be if the outer zones were all metal.

### TypeScript Model

```typescript
function fourDFusionWheelInertia(
  pcFrameMassG: number, pcFrameOuterMm: number, pcFrameInnerMm: number,
  metalFrameMassG: number, metalFrameOuterMm: number, metalFrameInnerMm: number,
  coreMassG: number, coreOuterMm: number,
  erMassG: number, erOuterMm: number, erInnerMm: number
): { iPCF: number; iMF: number; iCore: number; iER: number;
     iWheelAssembly: number; pcSharePct: number; metalSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iPCF   = annular(toKg(pcFrameMassG),    toM(pcFrameInnerMm),    toM(pcFrameOuterMm));
  const iMF    = annular(toKg(metalFrameMassG), toM(metalFrameInnerMm), toM(metalFrameOuterMm));
  const iCore  = annular(toKg(coreMassG),       toM(4),                 toM(coreOuterMm));
  const iER    = annular(toKg(erMassG),         toM(erInnerMm),         toM(erOuterMm));
  const iWheelAssembly = iPCF + iMF + iCore + iER;
  const pcTotal   = iPCF + iER;
  const metalTotal = iMF;

  return { iPCF, iMF, iCore, iER, iWheelAssembly,
           pcSharePct:    (pcTotal    / iWheelAssembly) * 100,
           metalSharePct: (metalTotal / iWheelAssembly) * 100 };
}

function fdSwitchThreshold(
  springForceN: number, armMassG: number, camRadiusMm: number
): number {
  return Math.sqrt(springForceN / ((armMassG / 1000) * (camRadiusMm / 1000))); // rad/s
}

function fdSpinDecay(
  omega: number, omegaSwitch: number,
  muTip1: number, rTip1Mm: number,
  muTip2: number, rTip2Mm: number,
  totalMassG: number, iTotalKgm2: number
): number {
  const mu  = omega > omegaSwitch ? muTip1  : muTip2;
  const rTip = omega > omegaSwitch ? rTip1Mm : rTip2Mm;
  const tau  = mu * (totalMassG / 1000) * 9.81 * (rTip / 1000);
  return -(tau / iTotalKgm2);
}

// fourDFusionWheelInertia(5, 24, 17, 18, 21, 10, 4, 12, 6, 26, 20)
//   → iPCF ≈ 2.16×10⁻⁶, iMF ≈ 4.87×10⁻⁶, iCore ≈ 3.20×10⁻⁷, iER ≈ 3.23×10⁻⁶
//      iWheelAssembly ≈ 1.06×10⁻⁵, pcSharePct ≈ 50.7%, metalSharePct ≈ 45.9%
// fdSwitchThreshold(0.12, 1.5, 9)
//   → ≈ 94.3 rad/s  (≈ 900 RPM; F:D switches tip below this)
// fdSpinDecay(200, 94.3, 0.35, 3.0, 0.15, 0.8, 37, 1.10e-5)
//   → ≈ −34.7 rad/s²  (high spin, Tip 1 active: wide defense-class contact)
// fdSpinDecay(80, 94.3, 0.35, 3.0, 0.15, 0.8, 37, 1.10e-5)
//   → ≈  −4.0 rad/s²  (low spin, Tip 2 active: sharp stamina-class contact)
```

---

## Case 367 — Synchrome System (Zero-G): Warrior Wheel Asymmetry, Three-Mode Flip Assembly, and Synchrome Inertia Amplification

**Thesis:** The Synchrome System is the fourth and final Metal Saga system; it retains the five-component structure of the Hybrid Wheel System but replaces the Face Bolt, Energy Ring, and Fusion Wheel with the Shogun Face Bolt (longer screw to accommodate Synchrome stack height), the Element Wheel (polycarbonate Crystal Wheel, functional equivalent of the Energy Ring), and the Warrior Wheel (asymmetric zinc Chromium Wheel, functional equivalent of the Fusion Wheel), and introduces three distinct battle modes from one assembly: Chromium Up (metal Warrior Wheel surface at combat height, default), Crystal Up (polycarbonate Element Wheel surface at combat height, achieved by flipping the assembled wheel), and Synchrome (Element Wheel replaced by a second Warrior Wheel, stacking two metal wheels and approximately doubling the zinc mass in the wheel assembly); the Warrior Wheel's C₁ rotational symmetry is the most significant physics departure from all prior Metal Saga Fusion Wheels — asymmetric geometry produces dynamic imbalance, a continuously varying contact face angle φ(θ) over one revolution, and an uneven collision frequency — and in the Synchrome configuration the relative rotational offset between the two Warrior Wheels determines whether their asymmetries partially cancel (180° offset) or compound (0° offset), making assembly alignment a competitive variable absent from every prior system; the Zero-G stadium introduces a tilting floor surface that periodically shifts the effective gravity vector, requiring tip designs (e.g. CF: Circle Flat) that maintain contact and friction on a non-horizontal plane rather than on the flat floor assumed by all prior spin-decay models.

### Component Rename Map

| HWS Component | Synchrome Equivalent | Japanese Name | Change |
|---------------|---------------------|---------------|--------|
| Face Bolt | Shogun Face Bolt (Stone Face) | ストーンフェイス | Longer screw shaft; diamond motif (TT) / cross (Hasbro) |
| Energy Ring | Element Wheel (Crystal Wheel) | クリスタルホイール | Crystal stud for elemental attribute; same PC material |
| Fusion Wheel | Warrior Wheel (Chromium Wheel) | クロームホイール | Asymmetric design; mythological creature motif |
| Spin Track | Spin Track | トラック | Unchanged function; same height convention |
| Performance Tip | Performance Tip | ボトム | New Zero-G specific tips (CF, etc.) |

### System Architecture

```
Axial stack, side cross-section (Chromium Up Mode, standard):

         ┌──────────────────────────────────────────┐
         │         SHOGUN FACE BOLT                  │  ← longer screw than Face Bolt
         │  [diamond/cross motif]                   │  ← extends through double-wheel stack
         └──────────────────────────────────────────┘
                              │ (screws through)
         ┌──────────────────────────────────────────┐  ← TOP of wheel assembly
         │           WARRIOR WHEEL                  │  ← metal (zinc); asymmetric
         │  [C₁ symmetry; mythological motif]       │  ← contact protrusions, outer rim
         │  [r_outer ≈ 22–26 mm]                   │
         └──────────────────────────────────────────┘
         ┌──────────────────────────────────────────┐  ← BOTTOM of wheel assembly
         │           ELEMENT WHEEL                  │  ← polycarbonate; crystal stud
         │  [r_outer ≈ 23–27 mm]                   │  ← elemental attribute marker
         │  [launcher hook slots ×2]               │  ← same function as Energy Ring
         └──────────────────────────────────────────┘
                              │
         ┌──────────────────────────────────────────┐
         │           SPIN TRACK                     │  ← unchanged; height convention same
         └──────────────────────────────────────────┘
                              │
         ┌──────────────────────────────────────────┐
         │         PERFORMANCE TIP                  │  ← Zero-G optimised variants
         └──────────────────┬───────────────────────┘
                            │
                          [tip]
                            │
                    ═══════════════  Zero-G stadium floor (tilts during battle)
```

### Three Battle Modes

```
CHROMIUM UP MODE (default):
  Assembly: Warrior Wheel on top, Element Wheel on bottom
  Contact surface presented to opponent: zinc Warrior Wheel
  Physics: hard zinc contact (E_zinc ≈ 100 GPa); small Hertzian patch; high impulse

  ┌─────────────────┐
  │  WARRIOR WHEEL  │  ← top; zinc contact faces opponent at collision height
  │  ELEMENT WHEEL  │  ← bottom; PC faces away from opponent
  └─────────────────┘

CRYSTAL UP MODE:
  Assembly: flip wheel stack 180° — Element Wheel is now on top
  Contact surface presented to opponent: polycarbonate Element Wheel
  Physics: soft PC contact (E_PC ≈ 2.4 GPa); larger Hertzian patch; softer impulse;
           PC absorbs more collision energy as deformation

  ┌─────────────────┐
  │  ELEMENT WHEEL  │  ← top; PC faces opponent
  │  WARRIOR WHEEL  │  ← bottom; zinc faces away
  └─────────────────┘

SYNCHROME MODE:
  Assembly: replace Element Wheel with a second Warrior Wheel
  Contact surface: two zinc Warrior Wheels stacked; metal on both faces
  Physics: largest I configuration; both collision faces are zinc;
           Shogun Face Bolt's longer screw spans extra axial thickness of two metal wheels

  ┌─────────────────┐
  │  WARRIOR WHEEL  │  ← top (WW₁)
  │  WARRIOR WHEEL  │  ← bottom (WW₂); element slot occupied by second metal wheel
  └─────────────────┘
```

### Warrior Wheel Asymmetry: C₁ Symmetry Physics

All prior Metal Saga Fusion Wheels had at minimum C₂ rotational symmetry; most had C₃ or higher, meaning the contact geometry repeated every 180° or 120°. The Warrior Wheel is C₁ — no rotational repeat. This has three distinct physics consequences:

**1. Dynamic imbalance:**
```
A C₁ wheel has its centre of mass offset from the geometric centre by Δr_CoM.
This offset produces a centrifugal imbalance force at spin frequency ω:
  F_imbalance = m_WW × Δr_CoM × ω²

At high ω this force is large → wobble onset earlier than for symmetric wheels.
Dynamic imbalance onset: ω_cross = √(μ_s × g / Δr_CoM)
Below ω_cross, static friction resists the offset; above it, the Bey precesses.
```

**2. Variable contact face angle:**
```
For a symmetric wheel (C₂, φ = const at contact points):
  smash fraction = cos(φ)  — same every collision

For C₁ Warrior Wheel, φ varies continuously with rotational position θ:
  smash(θ) = cos(φ(θ))
  recoil(θ) = sin(φ(θ))

Average over one revolution:
  <smash> = (1/2π) ∫₀²π cos(φ(θ)) dθ
  <recoil> = (1/2π) ∫₀²π sin(φ(θ)) dθ

Some positions deliver near-pure smash; others deliver near-pure recoil.
The variance in φ(θ) means outcomes are less predictable per collision
than a symmetric wheel — some contacts are highly effective, others are not.
```

**3. Synchrome offset alignment:**
```
Two Warrior Wheels stacked, rotational offset δ between WW₁ and WW₂:

δ = 0° (aligned):
  Both asymmetric mass offsets point same direction → CoM offset = 2 × Δr_CoM
  Dynamic imbalance compounded; contact protrusions from both wheels aligned at same θ

δ = 180° (counter-aligned):
  Mass offsets cancel → net CoM offset ≈ 0 → minimal dynamic imbalance
  Contact protrusions from WW₁ and WW₂ are at opposing θ positions
  → collision frequency effectively doubled (one wheel always near-optimal)

The assembly alignment of two Warrior Wheels in Synchrome is a competitive variable
absent from every prior system — it controls whether asymmetry compounds or cancels.
```

### Synchrome Inertia Amplification

Replacing the Element Wheel (polycarbonate) with a second Warrior Wheel (zinc):

```
Standard build (WW + EW):

I_WW (zinc, m ≈ 22 g, r_i ≈ 6 mm, r_o ≈ 22 mm):
I_WW = ½ × 0.022 × ((0.006)² + (0.022)²)
     = ½ × 0.022 × 5.20×10⁻⁴
     ≈ 5.72×10⁻⁶ kg·m²

I_EW (polycarbonate, m ≈ 6 g, r_i ≈ 20 mm, r_o ≈ 26 mm):
I_EW ≈ 3.23×10⁻⁶ kg·m²   (same as Energy Ring in HWS)

I_standard = I_WW + I_EW + I_Track + I_Tip
           ≈ 5.72×10⁻⁶ + 3.23×10⁻⁶ + 4.10×10⁻⁷ + 2.70×10⁻⁸
           ≈ 9.38×10⁻⁶ kg·m²

Synchrome build (WW + WW):
I_synchrome = I_WW₁ + I_WW₂ + I_Track + I_Tip
            ≈ 5.72×10⁻⁶ + 5.72×10⁻⁶ + 4.10×10⁻⁷ + 2.70×10⁻⁸
            ≈ 1.19×10⁻⁵ kg·m²

ΔI = I_synchrome − I_standard = 1.19×10⁻⁵ − 9.38×10⁻⁶ ≈ 2.49×10⁻⁶ kg·m²
ΔI/I_standard = 2.49×10⁻⁶ / 9.38×10⁻⁶ ≈ 26.5% increase
```

| Configuration | Wheel assembly mass (g) | I_wheel (kg·m²) | I_total (kg·m²) | I vs Standard |
|--------------|------------------------|-----------------|-----------------|---------------|
| Crystal Up (EW on top) | 28 | 8.95×10⁻⁶ | 9.38×10⁻⁶ | baseline |
| Chromium Up (WW on top) | 28 | 8.95×10⁻⁶ | 9.38×10⁻⁶ | same (flip only) |
| Synchrome (WW + WW) | 44 | 1.145×10⁻⁵ | 1.19×10⁻⁵ | +26.5% |

Flipping between Chromium Up and Crystal Up modes does not change I — it only changes which surface faces the opponent. Synchrome uniquely amplifies I by adding a second metal wheel; this is the largest I accessible in any Metal Saga system without modifying the Track or Tip.

### Shogun Face Bolt Screw Length

The standard Face Bolt screw seats at the Track's top socket after passing through: Face Bolt head → Energy Ring → Fusion Wheel. Axial stack = ER + FW = approximately 10–14 mm.

In Synchrome: the screw must pass through Element Wheel (or WW₂) + WW₁ = approximately 18–24 mm — up to 10 mm more than standard. The Shogun Face Bolt's longer shaft provides the additional thread engagement required to clamp a ~44 g dual-metal wheel assembly securely. An under-length screw on a Synchrome build produces incomplete thread engagement → reduced clamping force → assembly separation risk under impact.

### Zero-G Stadium and Tip Implications

Standard MFB stadiums have a flat floor. The Zero-G (Shogun Steel) stadium has a rocking, tilting bowl that swings during battle, periodically changing the angle of the floor relative to horizontal.

```
On a tilting floor (tilt angle α from horizontal):

Normal force on tip:   N = m_total × g × cos(α)
Lateral gravity component:  F_lateral = m_total × g × sin(α)

dω/dt = −(μ × N × r_tip) / I_total = −(μ × m × g × cos(α) × r_tip) / I_total

At α = 0° (flat): standard model applies
At α = 15° (tilting): N reduces to cos(15°) = 0.966 × mg → spin decay ~3.4% slower
                       but F_lateral = sin(15°) × mg → tends to push Bey toward low side

A tip optimised for Zero-G (CF — Circle Flat):
  Large circular flat contact patch maintains traction as floor tilts.
  The circular geometry is non-directional — equal friction in all lateral directions
  as the effective gravity vector rotates with the stadium tilt.
  A standard narrow sharp tip on a tilting surface loses effective contact
  when the tilt axis is not aligned with the tip's symmetric axis.
```

### TypeScript Model

```typescript
function synchromeInertia(
  wwMassG: number, wwOuterMm: number, wwInnerMm: number,
  ewMassG: number, ewOuterMm: number, ewInnerMm: number,
  trackMassG: number, trackOuterMm: number,
  tipMassG: number, tipRadiusMm: number,
  synchromeMode: boolean
): { iWheelAssembly: number; iTotal: number; iDeltaVsStandard: number; deltaSharePct: number } {
  const toKg = (g: number) => g / 1000;
  const toM  = (mm: number) => mm / 1000;
  const annular = (m: number, ri: number, ro: number) =>
    0.5 * m * (ri * ri + ro * ro);

  const iWW  = annular(toKg(wwMassG), toM(wwInnerMm), toM(wwOuterMm));
  const iEW  = annular(toKg(ewMassG), toM(ewInnerMm), toM(ewOuterMm));
  const iWheelAssembly = synchromeMode ? (iWW + iWW) : (iWW + iEW);
  const iTrack = annular(toKg(trackMassG), toM(3), toM(trackOuterMm));
  const iTip   = 0.5 * toKg(tipMassG) * toM(tipRadiusMm) ** 2;
  const iStandard = iWW + iEW + iTrack + iTip;
  const iTotal    = iWheelAssembly + iTrack + iTip;

  return { iWheelAssembly, iTotal,
           iDeltaVsStandard: iTotal - iStandard,
           deltaSharePct: ((iTotal - iStandard) / iStandard) * 100 };
}

function zeroGSpinDecay(
  muKinetic: number, totalMassG: number, tipRadiusMm: number,
  iTotalKgm2: number, tiltAngleDeg: number
): { decayRate: number; lateralForce: number } {
  const alpha = (tiltAngleDeg * Math.PI) / 180;
  const N     = (totalMassG / 1000) * 9.81 * Math.cos(alpha);
  const tau   = muKinetic * N * (tipRadiusMm / 1000);
  return {
    decayRate:   -(tau / iTotalKgm2),
    lateralForce: (totalMassG / 1000) * 9.81 * Math.sin(alpha)
  };
}

function synchromeImbalanceForce(
  wwMassG: number, comOffsetMm: number, omegaRadS: number,
  offset180: boolean
): number {
  const netOffset = offset180 ? 0 : (comOffsetMm / 1000) * 2;
  return (wwMassG / 1000) * 2 * netOffset * omegaRadS ** 2; // N
}

// synchromeInertia(22, 22, 6, 6, 26, 20, 4, 14, 1.5, 6, false)
//   → iWheelAssembly ≈ 8.95×10⁻⁶, iTotal ≈ 9.38×10⁻⁶, deltaSharePct = 0%  (standard)
// synchromeInertia(22, 22, 6, 6, 26, 20, 4, 14, 1.5, 6, true)
//   → iWheelAssembly ≈ 1.14×10⁻⁵, iTotal ≈ 1.19×10⁻⁵, deltaSharePct ≈ +26.5%
// zeroGSpinDecay(0.28, 38, 3, 9.38e-6, 0)
//   → decayRate ≈ −33.6 rad/s², lateralForce = 0 N  (flat floor)
// zeroGSpinDecay(0.28, 38, 3, 9.38e-6, 15)
//   → decayRate ≈ −32.5 rad/s², lateralForce ≈ 0.096 N  (15° tilt)
// synchromeImbalanceForce(22, 1.5, 200, false)
//   → ≈ 2.64 N  (aligned Synchrome, 200 rad/s, CoM offset 1.5mm compounded)
// synchromeImbalanceForce(22, 1.5, 200, true)
//   → 0 N  (180° offset; CoM offsets cancel)
```

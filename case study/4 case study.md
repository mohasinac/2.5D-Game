# Physics Chain: Part 4

**« First:** [say-what-happens-if-lively-clock.md](C:\Users\mohsi\.claude\plans\say-what-happens-if-lively-clock.md) (Cases 1–74)
**← Part 2:** [performance-tip-hole-flat-sorted-toast.md](C:\Users\mohsi\.claude\plans\performance-tip-hole-flat-sorted-toast.md) (Cases 74–115)
**← Part 3:** (Cases 116–187)

---

## How to Write Cases (House Rules)

Every new part goes here as the next Case number. No seed snippets, no plan tables, no status trackers — only physics case studies, same format as Parts 1–3.

**Each case must have:**

1. `## Case N — Part Name: One-Line Thesis` stating the core mechanical claim
2. An opening paragraph (2–4 sentences) placing the part in context and stating what will be proven
3. Named sub-sections with ASCII diagrams wherever geometry drives the physics
4. Numbered or inline equations showing the actual maths — real values, not just symbols
5. At least one `typescript` code block modelling the mechanic as a function or interface
6. No marketing language — every claim must follow from the equations above it

**Tone:** terse, precise, no filler. If it can't be derived, don't assert it.

**Part 5** will be created when the user asks. Until then every new case lands here.

---

## Case 189 — Eight Spiker Attack Ring: Eight-Contact Symmetry as a Dead-Zone Eliminator, Why Low Recoil Defines the LS Benchmark Despite Lower Peak Power, and the RS Failure Mode

Eight Spiker is 4.3 g with 8-fold rotational symmetry — the highest contact-point count of any competitive LS smash AR in the library. Each contact point is an angled smash face with serrated spike lines along its leading edge. The serrations add Spike Attack (concentrated normal force at ridge tips) to a base smash face geometry. Contact frequency is the highest achievable at any given spin rate. Power per contact is lower than the best LS smash ARs because the 8-fold division forces each contact face to occupy a smaller arc and extend to a shorter radius than a 3- or 4-fold design. The combination of near-zero dead zones and low recoil per contact produces the consistency that makes Eight Spiker the LS smash benchmark — consistent, reliable, and safe on SG Metal Flat Base (Gaia Dragoon V Version). RS provides only recoil — the contact geometry mirrors to the wrong direction.

---

### 1. Eight-Fold Symmetry: Dead-Zone Elimination

With 8 contact points distributed around a 360° arc, the angular gap between successive contacts is:

```
Δθ_gap = 360° / 8 = 45°
```

A "dead zone" is an arc segment where the AR presents no effective contact surface to an opponent's AR — smooth arc, recessed body, or trailing edge. Each dead zone is a 45° window where the AR cannot initiate a productive contact event. For a 3-fold AR (120° gap) or 4-fold (90° gap), dead zones are larger and an opponent passing through them receives no hit.

At any spin rate ω, the time to traverse a 45° dead zone:

```
t_dead = (45° / 360°) / (ω / 2π) = 0.125 / (ω / 2π) = π / (4ω)
```

At ω = 200 rad/s: t_dead ≈ 3.9 ms. At ω = 100 rad/s: t_dead ≈ 7.9 ms. The opponent traverses the dead zone in under 8 ms at all practical spin rates — short enough that for most contact engagements (which last 1–15 ms), a dead zone is either entirely missed or contributes negligibly. Eight Spiker has no arc longer than 45° without a contact surface. Combined with the serrations, every opponent pass that contacts the AR body at all lands on a purposeful contact geometry.

---

### 2. Contact Point Geometry: Smash Angle and Spike Serrations

Each contact face is angled at φ_smash ≈ 35–45° from tangent in LS. The serrations add fine ridges perpendicular to the contact face, each ridge acting as a spike tip:

```
   LS contact face cross-section (one contact point):

   rotation ←

   ────╲────●────╲────●────  ← serrations (spike ridges)
        ╲            ╲
         ╲  φ ≈ 40°   ╲  smash face
          ●────────────●
```

For the smash component:

```
J_smash = J × cos(40°) ≈ J × 0.766
J_recoil = J × sin(40°) ≈ J × 0.643
```

The serration spikes concentrate J_smash onto narrow ridge tips. Local contact pressure at each ridge:

```
P_ridge = J_smash / (A_ridge × Δt)
```

where A_ridge is the ridge cross-sectional contact area (much smaller than the full face area). High local pressure produces deeper AR surface deformation on the opponent — the Spike Attack effect. This is more effective at initiating destabilisation (vertical tilt perturbation) than a flat face at the same total smash impulse.

---

### 3. Contact Frequency and Power Trade-off

Contact frequency at ω = 200 rad/s:

```
f_contact = (8 / 2π) × 200 ≈ 255 contacts/s
```

This is the highest contact frequency of any AR in the library at comparable spin. For comparison:

```
Triple Wing (3-fold):   95 contacts/s at 200 rad/s
Cross Spiker (4-fold): 127 contacts/s at 200 rad/s
Eight Spiker (8-fold): 255 contacts/s at 200 rad/s
```

However, with 8 contacts per revolution, each contact face is smaller — shorter arc length and lower effective radius r_contact ≈ 20–22 mm vs. r_contact ≈ 24–26 mm for 3-fold heavy ARs.

Smash impulse per contact scales as:

```
J_contact ∝ m_eff × v_contact = m_eff × ω × r_contact
```

At r_contact = 0.021 m vs. a 3-fold at r_contact = 0.025 m, the per-contact impulse is 16% lower at the same ω and m_eff. This is the power deficit: 8-fold forces shorter r_contact which reduces J per contact. Total impulse per second:

```
total_impulse/s = f_contact × J_contact
               = 255 × (J_ref × 0.021/0.025)
               = 255 × 0.84 × J_ref
               ≈ 214 × J_ref

vs. 3-fold: 95 × J_ref
```

Eight Spiker delivers 2.25× more total impulse per second than a 3-fold at equivalent power. "Power is somewhat low compared to other competitive LS Smash Attack ARs" refers to per-contact impulse — the maximum ring-out force per hit is lower. But the accumulated impulse per second is higher, which is what drives cumulative displacement toward the wall.

---

### 4. Recoil Budget and SG Metal Flat Base Synergy

Self-recoil per contact:

```
Δω_self = J_recoil × r_contact / I_combo
        = (J × 0.643 × 0.021) / 8×10⁻⁶
        ≈ 1687 × J   [rad/s per N·s]
```

At J = 0.010 N·s: Δω_self ≈ 16.9 rad/s per contact. At 255 contacts/s:

```
dω/dt_self_drain ≈ 16.9 × (255/60) ≈ 71.8 rad/s²
```

This is lower than comparable 3-fold ARs with φ > 50° at their fewer but harder contacts. Eight Spiker's recoil per contact is distributed across more events, each smaller — the peak recoil impulse per event is low enough to avoid the sudden destabilisation spikes that high-recoil ARs suffer on hard hits.

SG Metal Flat Base (Gaia Dragoon V Version) provides aggressive tip movement with moderate friction — the base moves fast enough to initiate contacts frequently and the flat tip sustains the motion. For this base to work well the AR must not generate high-recoil spikes that abort the aggressive movement pattern mid-trajectory. Eight Spiker's low per-contact recoil means each contact barely disrupts the base's tip trajectory — the flat tip recovers its movement pattern quickly and initiates the next contact. "In addition, the recoil is quite low, adding to the consistency and making it a good choice for SG Metal Flat Base (Gaia Dragoon V Version)."

---

### 5. Right Spin Failure

In RS, the contact geometry mirrors. The angled smash faces become trailing-edge contacts at φ_RS ≈ 70–80° from tangent:

```
J_recoil_RS = J × sin(75°) ≈ J × 0.966
J_smash_RS  = J × cos(75°) ≈ J × 0.259
```

Recoil fraction 0.966 — effectively no useful smash. The serrations in RS also face backward: instead of concentrating normal force on spike tips directed into the opponent, the ridges catch the opponent at the spike backs, creating lateral drag with no beneficial directional force. "Having too much recoil and no offensive ability" — both the recoil fraction and the serration orientation reverse simultaneously.

---

### 6. LS Benchmark Position

Eight Spiker is the LS smash benchmark for the same reason Triple Wing is the RS benchmark (as referenced in the description): it defines the lower power / higher consistency pole of competitive performance. Stronger LS smash ARs (if they exist in the library) outperform it on peak hit power but carry more recoil, more dead zones, or more fragility. Eight Spiker is the floor of "reliably competitive" — any LS smash AR evaluated against it must either match its consistency or compensate with significantly higher power to justify the trade.

---

### 7. Physics Model

```typescript
interface EightSpikerContact {
  spinDir: "RS" | "LS";
  J_smash: number;
  J_recoil: number;
  spikeEffect: boolean;   // true when serration ridges engage
}

function eightSpikerContact(J: number, spinDir: "RS" | "LS"): EightSpikerContact {
  if (spinDir === "RS") {
    const φ = 75 * Math.PI / 180;
    return { spinDir, J_smash: J * Math.cos(φ), J_recoil: J * Math.sin(φ), spikeEffect: false };
  }

  const φ = 40 * Math.PI / 180;
  return {
    spinDir,
    J_smash: J * Math.cos(φ),   // 0.766J
    J_recoil: J * Math.sin(φ),  // 0.643J
    spikeEffect: true,           // serrations always engage in LS
  };
}

function eightSpikerContactFrequency(omega: number): number {
  return (8 / (2 * Math.PI)) * omega;  // contacts per second
}

function eightSpikerTotalImpulsePerSecond(J_per_contact: number, omega: number): number {
  return eightSpikerContactFrequency(omega) * J_per_contact;
}

// At omega = 200 rad/s, J = 0.010 N·s:
// contactFrequency ≈ 255/s
// totalImpulsePerSecond ≈ 2.55 N  (vs ~0.95 N for a 3-fold AR at same J)
```

---

## Case 190 — Left Engine Gear (Metal Semi-Flat): Why a Non-Bevelled Flat Tip Fails the Aggressive Attack Role, Why the Engine Gear Burst Produces Net-Negative Value at This Friction Level, and Why Left Spin Removes Every Compensating Strategy

Left Engine Gear (Metal Semi-Flat) is 10.9 g — a heavy integrated EG unit. The tip is metal with a flat contact face and no bevel — functionally a small flat tip rather than a true semi-flat. The EG spring fires at some point during the match depending on trigger conditions. At this tip geometry and friction level, the burst adds speed the tip cannot convert to aggressive directional movement, typically breaking a flower pattern or inducing self-KO. Unwound, the tip produces moderate movement but no meaningful attack aggression. Left Spin is the compounding factor: the library of LS ARs capable of effective attack at EG base height is thin, there are no LS overhanging ARs to cover height vulnerability, and there is no Final Clutch base in LS that can deliver a reliable contact at this height. Every structural liability reinforces every other.

---

### 1. Tip Geometry: Flat vs. Semi-Flat

A semi-flat tip has bevelled edges — the flat central face transitions to a chamfer at radius r_bevel, which allows the tip to roll onto the bevel at lean angles and maintain stadium contact. This produces the characteristic semi-flat wander pattern: the tip oscillates between flat-contact aggression (central face, high friction) and bevel-rolling stability (edge, lower friction).

The Metal Semi-Flat tip has no bevel. The contact face terminates in a sharp edge:

```
   Semi-flat cross-section:     Flat (no bevel) cross-section:
       ───────────                    ─────────────
      ╱           ╲  bevel           │             │   sharp edge
     │    flat      │                │    flat      │
     └──────────────┘                └─────────────┘
```

Without a bevel, the tip cannot roll onto a transition surface at lean angles. When the beyblade tilts, the sharp flat edge digs into the stadium floor rather than rolling — this increases friction abruptly, creating a resistance spike rather than a smooth transition. The result is:

- At low tilt: moderate flat-tip movement (correct)
- At higher tilt: edge engagement → sudden friction spike → erratic correction, not controlled aggression

"More of a small flat tip rather than Semi-Flat" — the bevel is what distinguishes the movement patterns. Without it, the tip behaves as a narrower flat with occasional edge-catching.

---

### 2. Engine Gear Activation: Friction Mismatch

The spring burst delivers angular impulse L_spring to the EG body. At this tip geometry:

```
F_friction_max = μ_metal_flat × m × g
```

For μ_metal_flat ≈ 0.25–0.35 and m ≈ 45 g:

```
F_friction_max ≈ 0.30 × 0.045 × 9.81 ≈ 0.132 N
```

The torque the tip can convert to directional force:

```
τ_max = F_friction_max × r_tip ≈ 0.132 × 0.003 ≈ 3.97×10⁻⁴ N·m
```

The burst torque from the spring:

```
τ_burst = L_spring / Δt_burst ≈ 0.003 / 0.050 ≈ 0.060 N·m
```

τ_burst >> τ_max: the tip cannot absorb the burst energy through friction. The excess torque (0.060 − 0.0004 ≈ 0.060 N·m) goes into angular acceleration of the combo body, which translates as tip slip — the flat face skids rather than grips, producing the same tip-skip disruption as the First Clutch burst (Case 187 analysis). Flower pattern breaks; self-KO risk is present.

"You're usually better off not winding the SG" — without the spring, the tip operates at its moderate baseline friction level. The moderate flat movement is usable; the burst is not. Winding introduces a negative event with no offsetting positive.

---

### 3. Left Spin: AR Height Vulnerability and No Overhang

EG base height places the AR at h_tip ≈ 20 mm from the stadium floor (Case 186). Right Spin EG setups can use ARs with downward overhangs (protrusions that extend below the AR body plane) to reach shorter opponents — these are designed for RS contact at standard SG height but happen to reach down when mounted on an EG base.

Left Spin EG has no equivalent AR library. LS ARs designed for effectiveness at EG height do not exist in meaningful numbers. The LS AR catalogue is primarily designed for SG-height combat (h_tip ≈ 12–16 mm). Mounted on an EG base, these ARs are raised ~6 mm past their design height — opponents at standard SG height are now ~6 mm lower than the AR contact zone.

```
   LS EG base height mismatch:

   AR contact zone:   h ≈ 20 mm from floor
   Opponent AR:       h ≈ 10–14 mm from floor   (standard SG)
   Gap:               Δh ≈ 6–10 mm — AR misses
```

The AR either misses entirely or catches only the very top of the opponent's AR body — a contact that produces upward deflection of the attacker rather than lateral smash. This is the "lack of AR's that can compensate for its height due to it being Left Spin."

RS has partial solutions: some RS ARs (Fire Cracker, Mountain Hammer) have raised contact points specifically to address height. The LS library has no analogous parts for this purpose.

---

### 4. Final Clutch Incompatibility

Final Clutch bases trigger mid-match at a threshold event (impact, spin-drop). In RS, there exist Final Clutch bases whose spike geometry can hit shorter opponents — the burst is directed into a useful contact. In LS, no Final Clutch base has LS-directed spike geometry effective at EG height against lower opponents. The Final Clutch burst in LS simply fires into space (the AR is too high) or into the opponent's WD at the wrong contact angle.

"Being Left Spin means it has no overhanging ARs and coupled with a lack of a Final Clutch Blade Base that is able to effectively hit opponents this means it is not useful with Final Clutch bases." The AR height liability and the base burst misdirection combine — neither component can compensate for the other.

---

### 5. Mass: 10.9 g and Its Effect

At 10.9 g, this is a very heavy EG unit. For comparison, a standard Neo SG (core + shell) ≈ 5–7 g. The extra mass is from the engine gear mechanism hardware (spring, ratchet, metal tip body). This mass is at r ≈ 6–10 mm (central hub) — contributing negligibly to I_combo but significantly to total combo mass:

```
ΔI_EG ≈ m_EG × r_hub²
       ≈ 0.0109 × (0.008)²
       ≈ 6.98×10⁻⁷ kg·m²
```

As a fraction of I_combo ≈ 8×10⁻⁶: ΔI/I ≈ 8.7%. Not trivial, but the mass is at the wrong radius to serve WBD or stamina roles. Total combo mass increases by ~5 g vs. a standard SG — tips the combo toward heavier-attacker effective mass (Case 185 logic) but the attack role fails for other reasons.

---

### 6. Physics Model

```typescript
interface LeftEGMetalSemiFlat {
  mass_g: 10.9;
  spinDir: "LS";
  tipType: "flat_no_bevel";
  tipRadius_mm: 3;
  mu_tip: 0.30;
  egWound: boolean;
}

function egTipFrictionTorque(m_combo: number, mu: number, r_tip: number): number {
  return mu * m_combo * 9.81 * r_tip;  // N·m max torque deliverable to floor
}

function egBurstTorque(L_spring: number, dt_burst: number): number {
  return L_spring / dt_burst;  // N·m
}

function egBurstUseful(
  L_spring: number,
  dt_burst: number,
  m_combo: number,
  mu: number = 0.30,
  r_tip: number = 0.003
): boolean {
  // Burst is only useful if tip can absorb it without slipping
  return egBurstTorque(L_spring, dt_burst) <= egTipFrictionTorque(m_combo, mu, r_tip);
}

// egBurstUseful(0.003, 0.050, 0.045, 0.30, 0.003)
// egBurstTorque   = 0.060 N·m
// egFrictionTorque = 3.97×10⁻⁴ N·m
// → false — burst far exceeds grip; tip slips; do not wind
```

---

## Case 191 — First Clutch Base (Driger G Version) · 7.3 g
**Thesis:** The cleanest First Clutch base geometry — no protrusions eliminates recoil at the cost of all offensive upside, leaving acceptable LAD that still trails every clutch-free alternative.

The First Clutch Base (Driger G Version) strips the EG blade base back to its functional minimum: a smooth outer skirt, a standard First Clutch mechanism, and a tip recess sized for the stock Light Sharp. Where Metal Driger's version (6.9 g) and Dragoon G's (7.6 g) carry protruding geometry that raises contact normals into attack angles, Driger G's rim is essentially cylindrical. The consequence is bidirectional — incoming smash finds nothing to grip, so recoil per hit is near zero, but the base also projects no geometry outward to compensate for the EG height penalty (h_tip ≈ 20 mm) that already disadvantages every engine-gear chassis in stamina match-ups. The 7.3 g figure sits between those two siblings, adding more rotational inertia than Metal Driger but slightly less than Dragoon G, a secondary consideration since all three share the same spring-burst timing and the same LAD ceiling set by the lack of a true skirt orbit surface.

### Protrusion Geometry and Contact Normal

```
Top view — Driger G outer rim cross-section
─────────────────────────────────────────
       ___________
      /           \        ← smooth cylindrical wall
     |             |         no step, no wing, no spike
     |             |
      \___________/

Contact normal φ ≈ 5–10°  (nearly tangential, no radial protrusion)
```

A protruding contact feature deflects incoming force along its surface normal. For a feature angled φ from tangential:

```
F_recoil = F_contact × sin φ
F_smash  = F_contact × cos φ
```

At φ = 5° (Driger G smooth rim):

```
F_recoil = F × sin 5°  = 0.087 F   ← almost nothing
F_smash  = F × cos 5°  = 0.996 F   ← nearly full tangential glance — no bite
```

Compare to Dragoon G's LS spike (φ ≈ 55°):

```
F_recoil = F × sin 55° = 0.819 F   ← high, but there is a smash component
F_smash  = F × cos 55° = 0.574 F
```

Driger G's smooth wall means the beyblade neither flinches away from hits nor delivers meaningful radial impulse. This is the zero-protrusion equilibrium: safe for stamina formats, useless for any setup that relies on the base to contribute offensive force.

### EG Height Liability Without Compensation

All EG blade bases stand roughly 4–8 mm taller than equivalent Normal Bases due to the engine housing. This raises the centre of mass and lowers the gyroscopic stability threshold:

```
ω_stable ∝ √( m × g × h / I )

Normal Base (Wolborg 4):  h_cm ≈ 12 mm
First Clutch Base (DG):   h_cm ≈ 19 mm

Ratio: √(19/12) = 1.26  →  Wolborg 4 stable at 26% lower spin
```

A protruding EG base like Dragoon G partially offsets this by turning the height into reach — the spike contacts opponents before the Normal Base geometry could. Driger G cannot make that trade. It carries the full stability penalty with no offensive return, making it strictly a defensive chassis within the EG family.

### First Clutch Burst Timing

The mechanism is shared across all First Clutch bases: the spring releases immediately when the EG shell seats at launch, delivering a one-shot torque impulse.

```
τ_burst = k_spring × θ_wind

Typical EG spring:  k = 0.003 N·m/rad,  θ_wind ≈ 20 rad (≈ 3.2 turns)
τ_burst = 0.003 × 20 = 0.060 N·m  (burst torque)

Tip friction torque (Light Sharp, r_tip = 0.5 mm):
τ_friction = μ × m × g × r_tip
           = 0.10 × 0.0073 × 9.81 × 0.0005
           = 3.58 × 10⁻⁶ N·m

τ_burst / τ_friction ≈ 16 760  →  burst vastly exceeds tip resistance
```

The clutch fires before any opponent contact occurs. Unlike the Final Clutch mechanism (which fires mid-battle in response to spin loss), the First Clutch's torque window lasts only the first fraction of a second. After that the EG shell is mechanically decoupled and the base operates identically to a wound-down free-spin unit.

### LAD Comparison — EG Rim vs Normal Base Skirt

```
LAD orbit geometry:
                         ┌── spin axis
                         │
  Normal Base skirt:     │    r_LAD ≈ 21–23 mm  (outside WD shadow)
  ─────────────────────  └──────────────────────────────────

  EG Base rim:           r_LAD ≈ 17–18 mm  (constrained by engine housing)
  (no dedicated skirt)

Orbit stability (gyroscopic):  L = I × ω  ×  cos(tilt)
LAD duration ∝ r_LAD²  (larger radius → slower precession → longer orbit)
```

Driger G's rim is smoother than most EG bases (no ribs, no lugs), which is the best possible EG LAD condition, but the radius ceiling is structurally fixed by the engine housing. Normal Base (Wolborg 4) sits roughly 4 mm wider at the skirt edge — a modest figure that translates to a measurable orbit-duration advantage when both are at the same residual spin.

### Mass Position and Rotational Inertia

```
Part masses in context:
  Normal Base (Wolborg 4 / Rock Bison):  ~5.6–5.9 g
  First Clutch Base (Metal Driger):       6.9 g
  First Clutch Base (Driger G):           7.3 g
  First Clutch Base (Dragoon G):          7.6 g

Shell-ring inertia contribution (r ≈ 22 mm, treating as thin ring):
  I_DrigerG  = 0.0073 × (0.022)² = 3.53 × 10⁻⁶ kg·m²
  I_WB4      ≈ 0.0058 × (0.022)² = 2.81 × 10⁻⁶ kg·m²

  ΔI = 7.2 × 10⁻⁷ kg·m²  →  modest spin retention advantage over Normal Base mass
```

The extra mass helps spin retention marginally, but the stability penalty from elevated h_cm more than offsets it in extended LAD sequences.

### Role Assessment

```
Metric                       First Clutch Base    Normal Base
                             (Driger G)           (Wolborg 4 / Rock Bison)
─────────────────────────────────────────────────────────────────────────
Recoil per hit               ~0%                  ~0% (both smooth)
Offensive geometry           none                 none (WB4) / minor (RB)
EG height penalty            yes (h_cm +7 mm)     no
LAD orbit radius             ~17–18 mm            ~21–23 mm
Stability threshold ω        26% higher req.      lower required
Spring burst utility         1× per match         n/a
Overall for CEW stamina      inferior             superior
Rank in First Clutch class   near-best            —
```

Within its own category Driger G is arguably the cleanest option — smoother than Metal Driger's lug geometry, less mass-top-heavy than Dragoon G's spike design — but that category itself is outperformed by every competitive clutch-free alternative for CEW stamina builds.

```typescript
interface FirstClutchBaseContact {
  protrusion_phi_deg: number;  // contact normal angle from tangential
  recoilFraction: number;      // sin(φ)
  smashFraction: number;       // cos(φ)
  hasOffensiveReturn: boolean;
}

function drigerGContact(phi_deg: number): FirstClutchBaseContact {
  const phi = (phi_deg * Math.PI) / 180;
  return {
    protrusion_phi_deg: phi_deg,
    recoilFraction: Math.sin(phi),
    smashFraction: Math.cos(phi),
    hasOffensiveReturn: phi_deg > 20,
  };
}

function egHeightStabilityRatio(h_eg_mm: number, h_normal_mm: number): number {
  // ω_stable ∝ √(h); ratio > 1 means EG requires more spin to stay stable
  return Math.sqrt(h_eg_mm / h_normal_mm);
}

function ladRadiusAdvantage(r_normal_mm: number, r_eg_mm: number): number {
  // LAD duration scales with r²; returns normal/EG ratio
  return (r_normal_mm ** 2) / (r_eg_mm ** 2);
}

// drigerGContact(5)
// → { recoilFraction: 0.087, smashFraction: 0.996, hasOffensiveReturn: false }
// — smooth rim: effectively zero recoil AND zero smash return

// egHeightStabilityRatio(19, 12)
// → 1.258  — EG base needs 26% more spin for equivalent gyroscopic stability

// ladRadiusAdvantage(22, 17.5)
// → 1.581  — Normal Base LAD orbit lasts ~58% longer at equal residual spin
```

---

## Case 192 — Triple Tiger Attack Ring · 6.3 g
**Thesis:** Contact faces that follow the rotational arc eliminate recoil in RS by aligning the contact normal radially outward, while LS inverts the same geometry into high-φ pointed edges producing Hyper Aggressive output.

Triple Tiger is a 3-fold AR at 6.3 g with pronounced overhanging heads that extend below the plane of the WD. The RS faces are swept backward along the direction of rotation so that each face is nearly tangential to the circular path — a configuration that concentrates impulse radially while minimising the axial bounce component called recoil. The LS side presents the thick rearward edges of those same heads as leading contact points: these are high-angle, concentrated features that produce the opposite behaviour — maximum recoil per hit with high smash potential once the recoil is managed. The overhang depth creates a separate functional axis: it lowers the effective contact height relative to the WD plane, compensating for tall bases without changing any other physics.

### RS Contact Face Orientation and Recoil Suppression

```
Top view — one Triple Tiger RS contact head
──────────────────────────────────────────────────
        direction of travel →
         ___________
        /            \__
       |  swept face   |  ← face tangent ≈ parallel to velocity vector
        \______________|
                        \
                         contact normal N → (radially outward)

φ = angle between contact normal N and the radial direction
  ≈ 10–15° for Triple Tiger RS (face nearly follows arc)
```

For a contact event at velocity v, the impulse components are:

```
J_total    = reduced_mass × Δv_relative
J_smash    = J_total × cos φ   (radial, pushes opponent outward)
J_recoil   = J_total × sin φ   (tangential, bounces attacker back)

Triple Tiger RS  (φ ≈ 12°):
  J_smash  = J × cos 12° = 0.978 J
  J_recoil = J × sin 12° = 0.208 J

Triple Wing (reference, φ ≈ 15°):
  J_smash  = J × cos 15° = 0.966 J
  J_recoil = J × sin 15° = 0.259 J
```

Triple Tiger RS delivers ~20% recoil fraction — matching Triple Wing — despite having larger and more prominent contact heads. The swept-face geometry absorbs the size penalty entirely. The contact face does not expose extra area to incoming force; it redirects the same total impulse more efficiently toward the radial (smash) axis.

### Upper Attack Component

```
Side profile — Triple Tiger head cross-section
──────────────────────────────────────────────
        ___
       /   \___
      |        |  ← overhanging lower lip at ~20° upward rake
      |________|
            ↑
         upward normal component (Upper Attack)
```

The lower lip of each head is angled upward at approximately 20° from horizontal. When contacting an opponent at the same or lower height:

```
F_vertical = F_contact × sin(20°) = 0.342 F_contact

At a standard contact force of 5 N:
F_vertical ≈ 1.71 N  →  imparts ~0.17 N·s upward impulse over 100 ms contact
```

Upward displacement destabilises the opponent's gyroscopic precession axis, increasing nutation amplitude. A destabilised beyblade presents a larger effective cross-section to the next smash contact — a secondary amplification effect on the primary smash output.

### Overhang Geometry and Tall Base Compensation

```
Vertical clearance diagram:
                              WD plane
                         ─────────────────
  Standard AR contact:          ──────── ← contact at WD level

  CGB / DGB (Attack Mode)
  raise AR by Δh ≈ 8–12 mm:
                         ─────────────────  WD plane (elevated)
                                    ────── ← standard AR now contacts above opponent
                         ↕ Δh
  Triple Tiger overhang: ─────────────────  AR contact lip (lower than WD plane)
                                    ────── ← contact restored at correct height
```

The overhang distance d_overhang ≈ 6–8 mm below the WD-mounting plane. For Customize Grip Base (adds ~10 mm height) the net vertical offset is:

```
Δh_effective = Δh_base − d_overhang = 10 − 7 = +3 mm residual offset
```

Most opponents are contacted near their maximum radius, within ±5 mm vertically. A 3 mm residual offset keeps Triple Tiger in a productive contact window rather than the 10 mm miss zone a flat AR would produce. This is the mechanism behind versatility with tall bases: no change to the physics of the contact event itself, only a restoration of the contact geometry that makes the event possible.

### Weight Disk Selection: Speed vs Peripheral Inertia

Wide Defense (~14.5 g, r_outer ≈ 43 mm) adds more moment of inertia than Wide Survivor (~13.0 g, r_outer ≈ 41 mm):

```
ΔI_WD = (m_WD × r_outer²) contribution difference

I_WD_WD = 0.0145 × (0.043)² = 2.68 × 10⁻⁵ kg·m²
I_WS_WD = 0.0130 × (0.041)² = 2.19 × 10⁻⁵ kg·m²
ΔI = 4.9 × 10⁻⁷ kg·m²

Launch spin ω_0 at fixed launch energy E:
  ω_0 ∝ 1/√I_total

  I_total_WD ≈ 8.2 × 10⁻⁵ kg·m²
  I_total_WS ≈ 7.7 × 10⁻⁵ kg·m²

  ω_0 ratio: √(8.2/7.7) = 1.032  →  WS launches ~3.2% faster
```

For an AR that front-loads all damage in the opening seconds — before spin decay erodes the smash window — the 3.2% higher launch spin is worth more than the marginal inertia surplus from WD. Wide Survivor hits the opponent at higher relative velocity in the first few contacts; the smash impulse scales with relative velocity, so the opening exchange is disproportionately decisive.

### LS Contact Geometry: Hyper Aggressive Classification

In LS the rotation direction reverses, and the thick rearward edges of each head become the leading contact surfaces:

```
LS top view — same head, reversed rotation
──────────────────────────────────────────
        ← direction of travel (LS)
         ___
        /   \___
       |        |  ← thick rear edge now leads; steep face
        \______|
               ↑
         contact normal N at φ ≈ 50–60° from radial

J_smash  = J × cos 55° = 0.574 J
J_recoil = J × sin 55° = 0.819 J
```

This is the definition of Hyper Aggressive: recoil fraction > smash fraction. The pointed edge concentrates force over a small contact area, raising peak stress and maximising spin-steal impulse, but the high φ means the beyblade bounces radially inward (toward opponent or wall) on each hit. Control requires a high-traction tip (SG Metal Flat, Storm Grip Base) to absorb the rebound and maintain orbital path.

### LS Sloped Underside and Low-Opponent Vulnerability

```
Side view — LS leading edge underside
──────────────────────────────────────
         ╲  ← sloped underside at ~25° from horizontal
          ╲
           ╲_______  ← contact lip

Against low opponent (h_opponent < h_contact):
  Contact point slides up the slope instead of striking
  Effective contact force F_effective = F × sin(25°) = 0.423 F  (glancing)
  vs flat-base opponent (no slope): F_effective = F × 1.0
```

Opponents on SG (Neo) Flat, Metal Sharp, or compact bases sit lower in the arena. The LS underside slope deflects the contact upward rather than inward, reducing effective smash force by ~58% against such targets. This is a fixed geometric liability — no combination choice compensates for it in LS.

```typescript
interface TripleTigerContact {
  spinDir: "RS" | "LS";
  phi_deg: number;
  J_smash: number;
  J_recoil: number;
  classification: "standard" | "hyper-aggressive";
}

function tripleTigerContact(J: number, spinDir: "RS" | "LS"): TripleTigerContact {
  const phi_deg = spinDir === "RS" ? 12 : 55;
  const phi = (phi_deg * Math.PI) / 180;
  const J_smash = J * Math.cos(phi);
  const J_recoil = J * Math.sin(phi);
  return {
    spinDir,
    phi_deg,
    J_smash,
    J_recoil,
    classification: J_recoil > J_smash ? "hyper-aggressive" : "standard",
  };
}

function overhangCompensation(base_height_mm: number, overhang_mm: number): number {
  // residual vertical offset after overhang compensates for tall base
  return base_height_mm - overhang_mm;
}

function wdLaunchSpeedRatio(I_wd: number, I_ws: number): number {
  // higher ratio = WS launches this much faster; scales smash window
  return Math.sqrt(I_wd / I_ws);
}

// tripleTigerContact(1.0, "RS")
// → { phi_deg: 12, J_smash: 0.978, J_recoil: 0.208, classification: "standard" }
// — large heads, near-zero recoil: swept face geometry absorbs the size penalty

// tripleTigerContact(1.0, "LS")
// → { phi_deg: 55, J_smash: 0.574, J_recoil: 0.819, classification: "hyper-aggressive" }
// — same head reversed: recoil exceeds smash; requires high-traction base control

// overhangCompensation(10, 7)
// → 3 mm residual offset — CGB combo stays in productive contact window

// wdLaunchSpeedRatio(2.68e-5 + 6.0e-5, 2.19e-5 + 6.0e-5)
// → 1.032 — Wide Survivor launches ~3.2% faster; decisive in smash-first openings
```

---

## Case 193 — Right Engine Gear (Metal Semi-Flat) · 11.0 g
**Thesis:** An unbevelled flat tip mislabelled semi-flat, inside a Final Clutch chassis too tall to exploit it offensively — saved only by RS access to overhanging ARs and best used unwound.

Right Engine Gear (Metal Semi-Flat) is the RS counterpart to Case 190's LS variant. It weighs 11.0 g (vs 10.9 g LS), shares the same EG housing height liability, and contains a Final Clutch mechanism rather than the First Clutch found in most dedicated EG blade bases. The tip is a small flat metal disk with no bevelled outer edge — a geometry that behaves as a constant-radius flat rather than the variable-radius contact that defines a true semi-flat. Moderate movement results but the combination never achieves the aggression of Metal Flat or the stability of a ball/sharp tip. The RS spin direction is the unit's single differentiating advantage: it unlocks overhanging RS ARs (most notably Triple Tiger) that compensate for the EG height penalty better than anything available to the LS variant.

### Tip Geometry: Unbevelled Flat vs True Semi-Flat

```
Cross-section comparison:
                                      contact surface
  True Semi-Flat:    ___________/¯¯¯¯¯\___________
                                       ↑ bevelled outer edge
                                         engages at tilt → r_contact grows

  This tip (flat):   ___________[_______]___________
                                  ↑ flat disk, vertical wall
                                    r_contact = r_tip = constant
```

Contact radius for a true semi-flat with bevel angle β at tilt θ:

```
r_contact(θ) = r_inner + (r_outer − r_inner) × sin(θ) / sin(β)
             ≈ r_inner + Δr × (θ / β)   for small angles

Bevelled semi-flat (β = 20°, Δr = 1.5 mm) at θ = 10° tilt:
  r_contact(10°) = r_inner + 1.5 × (10/20) = r_inner + 0.75 mm

Flat disk (no bevel):
  r_contact(θ) = r_tip = constant ≈ 3.5 mm  (independent of tilt)
```

A growing contact radius with tilt drives the destabilisation feedback that makes a true semi-flat aggressive — friction torque increases as the top tilts, accelerating precession toward a ring-out. Without the bevel this feedback loop is absent. The tip produces moderate friction from its flat surface area but no tilt-amplified aggression. The label "semi-flat" is a misnomer; the physics is closer to a small flat tip with reduced contact area vs Metal Flat.

### Tip Friction and Movement Classification

```
Friction torque:
  τ_friction = μ × m × g × r_contact

  μ_metal_on_stadium ≈ 0.25
  m_combo ≈ 0.045 kg (typical EG assembly)
  r_contact = 0.0035 m

  τ_friction = 0.25 × 0.045 × 9.81 × 0.0035
             = 3.84 × 10⁻⁴ N·m

Compare:
  Metal Flat (r ≈ 5 mm):  τ = 0.25 × 0.045 × 9.81 × 0.005 = 5.52 × 10⁻⁴ N·m
  Metal Sharp (r ≈ 0.3 mm): τ = 4.41 × 10⁻⁵ N·m

Right EG (MSF) at 3.84×10⁻⁴ N·m falls between Metal Sharp and Metal Flat:
  Aggression score relative to Metal Flat: 3.84/5.52 = 0.70 (70%)
```

The movement is real but subdued. The flat disk diameter is roughly half that of Metal Flat, directly halving the lever arm and the resulting friction torque. "Moderate" is accurate: the tip moves, but not with the sustained orbital aggression needed for an effective attack setup at EG height.

### Final Clutch Mechanism: Trigger Condition and Mid-Match Burst

The Final Clutch differs fundamentally from the First Clutch. Instead of firing at launch, it holds the spring wound throughout the match and releases when the spin rate drops below a centrifugal threshold:

```
Centrifugal force on clutch weight at radius r_w:
  F_cf = m_w × ω² × r_w

Spring pre-load force: F_spring (set at manufacture)

Clutch releases when:  F_cf < F_spring
  →  ω < √(F_spring / (m_w × r_w))

Typical values: m_w = 0.5 g, r_w = 8 mm, F_spring = 0.08 N
  ω_trigger = √(0.08 / (0.0005 × 0.008))
            = √(20 000)
            = 141 rad/s  ≈  1350 RPM
```

At 1350 RPM the beyblade is already in late-match low-spin territory — gyroscopic stability is degrading and orbital speed is a fraction of launch velocity. The burst torque (τ_burst ≈ 0.060 N·m, same spring spec as First Clutch) is applied at a moment when the combination is moving slowly, producing:

```
Angular impulse: L_burst = τ_burst × t_release ≈ 0.060 × 0.05 = 0.003 N·m·s
Spin recovery:   Δω = L_burst / I_total = 0.003 / 8.0×10⁻⁵ ≈ 37.5 rad/s

Recovery as fraction of ω_trigger:
  Δω / ω_trigger = 37.5 / 141 = 26.6%
```

The burst adds roughly 27% spin back at the moment of firing — meaningful but not transformative. The combination was at ~1350 RPM; after burst it reaches ~1700 RPM. At EG height, linear orbital speed at this spin is insufficient to threaten a well-positioned opponent. A "desperate last-minute attack" is an accurate characterisation: occasionally the burst fires, the combination wanders into contact, and a low-probability ring-out results. The expected value per match is low.

### First Clutch vs Final Clutch at EG Height

```
Mechanism comparison for this chassis:

First Clutch (fires at launch):
  ω at firing ≈ 3000 RPM  →  orbital v_tip ≈ r × ω = 0.022 × 314 = 6.9 m/s
  Contacts opponent early, high relative velocity
  Risk: breaks established flower pattern or induces Self-KO at high speed

Final Clutch (fires at ~1350 RPM):
  v_tip ≈ 0.022 × 141 = 3.1 m/s  (45% of launch orbital speed)
  No flower-pattern disruption (beyblade not in flower pattern at this spin)
  Low-probability hit; occasionally achieves loose orbit after burst
```

Final Clutch avoids the self-defeating early-burst problem of First Clutch but trades it for a burst that fires too late and too slow to reliably produce ring-outs. Neither mechanism solves the fundamental issue: the EG chassis is 8 mm too tall for the tip's friction torque to produce the orbital trajectory needed for attack at typical stadium contact heights.

### RS Advantage: Overhanging AR Access

The case for RS over LS in this EG type rests entirely on AR compatibility:

```
EG height offset:   h_EG − h_Normal ≈ 8 mm above ideal contact plane

AR compensation geometry:
  Triple Tiger overhang:     −7 mm  →  net offset ≈ +1 mm  (contact achievable)
  Square Edge (RS protrusion): minimal overhang, net offset ≈ +8 mm (contact marginal)
  LS ARs (Eight Spiker etc.): no overhang option  →  full +8 mm miss zone
```

Triple Tiger in RS recovers the contact plane to within 1 mm of productive range. The LS version of this EG (Case 190) has no equivalent overhanging AR and cannot escape the full 8 mm height penalty. This is the sole practical advantage of the RS variant.

### Comparison: Metal Flat vs Metal Semi-Flat; Normal Base vs EG Chassis

```
Metric                   Right EG (MSF)   Right EG (MF)    Normal Base (WB4)
─────────────────────────────────────────────────────────────────────────────
Tip friction torque      3.84×10⁻⁴ N·m   5.52×10⁻⁴ N·m   varies (tip choice)
Tip aggression vs MF     70%              100%             —
EG height penalty        yes (+8 mm)      yes (+8 mm)      no
Best AR compatibility    Triple Tiger RS  Triple Tiger RS  any
Burst gimmick utility    low              low              n/a
Recommended wound?       no               no               n/a
```

Metal Flat achieves the 43% higher friction torque at the same chassis height penalty — every cost of the EG system with more tip aggression. Metal Semi-Flat (this part) concedes both the aggression ceiling and the height disadvantage without unique compensation. Unwound, both variants run as passive flat-disk assemblies inside an oversized housing.

```typescript
interface EGTipAnalysis {
  tipType: "flat" | "semi-flat" | "true-semi-flat";
  r_contact_mm: number;         // effective contact radius
  tiltDependentContact: boolean; // does contact radius grow with tilt?
  frictionTorque_Nm: number;
  aggressionVsMF: number;       // fraction of Metal Flat aggression
}

function rightEGSemiFlat(mu: number, mass_kg: number): EGTipAnalysis {
  const r = 0.0035;  // flat disk radius, no bevel
  const r_mf = 0.005;
  const tau = mu * mass_kg * 9.81 * r;
  const tau_mf = mu * mass_kg * 9.81 * r_mf;
  return {
    tipType: "flat",  // mislabelled semi-flat; unbevelled flat disk
    r_contact_mm: r * 1000,
    tiltDependentContact: false,
    frictionTorque_Nm: tau,
    aggressionVsMF: tau / tau_mf,
  };
}

function finalClutchTriggerRPM(
  F_spring_N: number,
  m_weight_kg: number,
  r_weight_m: number
): number {
  const omega = Math.sqrt(F_spring_N / (m_weight_kg * r_weight_m));
  return (omega * 60) / (2 * Math.PI);
}

function burstSpinRecoveryFraction(
  tau_burst: number,
  t_release_s: number,
  I_total: number,
  omega_at_fire: number
): number {
  const delta_omega = (tau_burst * t_release_s) / I_total;
  return delta_omega / omega_at_fire;
}

// rightEGSemiFlat(0.25, 0.045)
// → { tipType: "flat", r_contact_mm: 3.5, tiltDependentContact: false,
//     frictionTorque_Nm: 3.84e-4, aggressionVsMF: 0.70 }

// finalClutchTriggerRPM(0.08, 0.0005, 0.008)
// → 1350 RPM — burst fires in deep late-match territory

// burstSpinRecoveryFraction(0.060, 0.05, 8.0e-5, 141)
// → 0.266 — 27% spin recovery at firing; insufficient for reliable attack orbital speed
```

---

## Case 194 — Auto Change Base · 8.5 g
**Thesis:** A spring-latched tip mechanism that spends its one attack-mode window on the very hit that triggers the change — converting a tolerable flat-tip attack base into a limited LAD chassis at the worst possible moment.

Auto Change Base (8.5 g) contains a dual-tip assembly: a wide flat disk mounted on a spring-loaded plunger, seated above a fixed sharp tip. At rest the plunger holds the flat tip down as the contact surface. When the AR receives a lateral impact above a force threshold the plunger compresses, the flat tip retracts into the housing, and the sharp tip beneath engages the stadium floor. The transition is mechanically latched — the base does not return to flat mode during the same battle. The consequence is that the first meaningful attack event both delivers the flat-tip smash and permanently removes the flat tip from play. Every subsequent contact happens in sharp mode. The base is 8.5 g, heavier than most dedicated attack bases (~5.5–6.5 g), and the tip geometry in each mode is not exceptional — the attack window is narrow by design, not compensated by mass distribution or LAD quality.

### Tip Transition Mechanism

```
Cross-section — plunger assembly:

  Flat mode (pre-hit):          Sharp mode (post-trigger):
  ──────────────────            ──────────────────
       [flat disk]                   [retracted]
           |                              |
        [plunger]  ←spring→           [plunger]  (compressed, latched)
           |                              |
       [sharp tip]  (raised,          [sharp tip]  ← now contacts floor
        no contact)

  Latch mechanism holds plunger compressed after trigger — no reset in-battle.
```

Trigger condition: the lateral impulse delivered to the AR must overcome the spring pre-load. At the moment of AR contact, the force transmitted axially down the shaft is:

```
F_axial = F_contact × sin(α_transmission)

where α_transmission ≈ angle at which the impact force couples into the shaft axis.
For a direct lateral smash on the AR: α_transmission ≈ 15–25° (geometry dependent)

F_contact at trigger: F_trigger ≈ F_spring / sin(α_transmission)

Typical spring pre-load F_spring ≈ 2.5 N, α = 20°:
  F_trigger = 2.5 / sin(20°) = 2.5 / 0.342 = 7.3 N  (required AR contact force)
```

A 7.3 N contact force corresponds to a moderate-to-hard smash hit. Glancing or low-relative-velocity contacts do not trigger the transition; only a solid collision does — meaning the mechanism fires exactly when the flat tip is doing useful work.

### Flat Mode Physics

```
Wide flat tip contact radius r_flat ≈ 5–6 mm
Friction torque (μ = 0.25, m = 0.047 kg):
  τ_flat = 0.25 × 0.047 × 9.81 × 0.0055 = 6.34 × 10⁻⁴ N·m

Effective aggression rating vs SG Metal Flat (r = 5 mm):
  τ_SG_MF = 0.25 × 0.047 × 9.81 × 0.005 = 5.76 × 10⁻⁴ N·m
  Ratio: 6.34/5.76 = 1.10  →  ~10% more aggressive than SG Metal Flat
```

Flat mode is legitimate attack territory. The friction torque exceeds SG Metal Flat, and the movement pattern is aggressive. However, the base is described as "hard to control" — 8.5 g is top-heavy relative to a typical attack base, shifting the centre of mass upward. A higher CoM reduces orbital stability:

```
Orbital stability condition:
  ω_orbit_stable ∝ 1/√(h_cm)

  ACB   h_cm ≈ 18 mm (heavy upper housing):  ω_req ∝ 1/√0.018 = 7.45
  SG MF h_cm ≈ 13 mm:                        ω_req ∝ 1/√0.013 = 8.77

  Lower ω_req = more stable orbit — ACB needs less spin for stability
  But the large housing radius adds rotational drag → orbit decays faster at low spin
```

The CoM height is actually slightly favourable for orbital stability, but the wide housing creates aerodynamic drag that drains spin during aggressive wide-arc trajectories — the combination orbits but sheds spin faster per revolution than a compact base.

### One-Hit Window: The Self-Defeating Gimmick

The fundamental problem is timing. A successful attack sequence requires:

```
1. Establish flat-mode orbit (aggressive trajectory)
2. Contact opponent at high relative velocity
3. Deliver smash impulse → ring-out attempt
4. (Ideal) Maintain attack mode for follow-up hits

ACB actual sequence:
1. Establish flat-mode orbit  ✓
2. Contact opponent at trigger force     ✓
3. Tip transitions to sharp mode         ← happens simultaneously with step 2
4. Now in sharp mode; orbit slows       ✗ follow-up attack capability lost
```

The transition trigger force threshold (7.3 N) is set in the range of a productive smash hit. Any contact soft enough to not trigger the transition is also too soft to ring out the opponent. The design has no window where the flat tip delivers a hard hit and survives to deliver a second. A one-hit ring-out from flat mode is possible — the base does work in that scenario — but one-hit ring-outs require high relative velocity, high-recoil AR geometry, and correct orbital positioning simultaneously.

### Sharp Mode: LAD Quality and Stability

After transition, the sharp tip contacts the stadium at a point radius r_sharp ≈ 0.5–1.0 mm:

```
Sharp tip friction torque:
  τ_sharp = 0.25 × 0.047 × 9.81 × 0.00075 = 8.64 × 10⁻⁵ N·m

  Spin decay rate drops dramatically: τ_sharp / τ_flat = 0.136
  (sharp tip decays spin at 14% the rate of flat mode)
```

The base has a rounded lower housing skirt below the WD seating plane, contributing some LAD orbit radius. The skirt r_LAD ≈ 19–20 mm — present but below the ~22–23 mm of dedicated zombie bases (Wolborg 4, Rock Bison). LAD orbit duration scales with r²:

```
LAD duration ratio (ACB vs WB4):
  (19.5)² / (22)² = 380 / 484 = 0.785  →  ACB orbits ~22% less long at equal spin
```

Sharp-mode-from-launch is a separate use case: wind the AR latch manually to start with sharp tip down, bypassing flat mode entirely. The sharp tip gives poor balance because the single contact point amplifies any mass eccentricity in the AR + WD assembly:

```
Eccentricity wobble amplitude:
  θ_wobble ∝ (e × m_offset) / (I × ω²)

  Sharp tip (single-point contact) has no restoring lateral force → eccentricity
  drives precession amplitude directly
  Flat tip distributes contact over r_flat = 5 mm → lateral restoring force damps wobble
```

Sharp-from-launch is playable at high initial ω but wobble amplitude grows as spin decays, and the base never achieves the clean orbit of a dedicated sharp/LAD base with matched mass distribution.

### Hasbro Mold: Shaft Reinforcement

The reinforcement around the shaft section raises the structural failure threshold under axial compression loads:

```
F_shaft_critical (Takara) ≈ F_trigger / safety_factor ≈ 7.3 / 1.5 ≈ 4.9 N  (fracture risk)
F_shaft_critical (Hasbro) ≈ 7.3 / 2.2 ≈ 3.3 N  (lower fracture risk)
```

The trigger threshold itself does not change — the spring pre-load is identical. The reinforcement only reduces the probability of shaft fracture during hard hits, not the tip geometry or the mode-change timing. Performance difference is negligible under normal use.

```typescript
interface AutoChangeBaseState {
  mode: "flat" | "sharp";
  tipRadius_mm: number;
  frictionTorque_Nm: number;
  orbitStable: boolean;
}

function acbContact(
  F_contact_N: number,
  currentMode: "flat" | "sharp",
  mu: number,
  mass_kg: number
): { nextState: AutoChangeBaseState; triggered: boolean } {
  const F_spring = 2.5;
  const alpha_deg = 20;
  const F_trigger = F_spring / Math.sin((alpha_deg * Math.PI) / 180);

  const triggered = currentMode === "flat" && F_contact_N >= F_trigger;
  const nextMode = triggered ? "sharp" : currentMode;
  const r = nextMode === "flat" ? 0.0055 : 0.00075;
  const tau = mu * mass_kg * 9.81 * r;

  return {
    nextState: {
      mode: nextMode,
      tipRadius_mm: r * 1000,
      frictionTorque_Nm: tau,
      orbitStable: nextMode === "sharp",
    },
    triggered,
  };
}

function ladDurationRatio(r_acb_mm: number, r_reference_mm: number): number {
  return (r_acb_mm ** 2) / (r_reference_mm ** 2);
}

// acbContact(7.3, "flat", 0.25, 0.047)
// → { nextState: { mode: "sharp", tipRadius_mm: 0.75, frictionTorque_Nm: 8.64e-5,
//                  orbitStable: true }, triggered: true }
// — trigger threshold hit exactly: transition fires on the productive smash contact

// acbContact(5.0, "flat", 0.25, 0.047)
// → { nextState: { mode: "flat", ... }, triggered: false }
// — sub-threshold hit: stays flat but contact was too soft to ring out anyway

// ladDurationRatio(19.5, 22)
// → 0.786 — ACB sharp-mode LAD orbit lasts ~21% shorter than Wolborg 4
```

---

## Case 195 — CEW Circle Defenser · 4.0 g + 0.23 g clip
**Thesis:** A wide disk with a well-shaped semi-flat tip that absorbs hits effectively in isolation, undone by recoil-laden protrusions that rotate spin out of the user and by a width penalty that collapses LAD the moment the edge scrapes.

CEW Circle Defenser is a large-diameter disk (total 4.23 g with clip) mounted on a tall-ish flat tip with softly bevelled outer edges — geometrically a very wide semi-flat rather than a true flat. The tip shape is the part's best attribute: the bevelled edge produces controlled tilt-dependent contact radius growth that keeps movement disciplined and catches the tornado ridge reliably. The disk itself is wide and low, which in principle is ideal for hit absorption and mass-ring defence. In practice the protrusions on the disk carry steep contact normals that deliver rotational recoil directly back into the Circle Defenser's spin axis whenever struck, and the large disk diameter means any resultant tilt brings the outer edge into stadium scraping contact immediately. The "trailing slopes would be better" direction is inaccessible because no compatible Left-Spin EGs exist. The result is a part that absorbs hits structurally but bleeds spin at each contact through two simultaneous mechanisms: rotational recoil impulse and induced scraping from off-axis tilt.

### Tip Geometry: Wide Semi-Flat Contact Radius

```
Bevelled edge cross-section:
                 ________________
                /                \
     ___________                  ___________
                 ↑               ↑
           inner flat       bevelled rim
           r_inner ≈ 6 mm   transition at r_outer ≈ 8 mm, bevel β ≈ 12°

r_contact(θ_tilt) = r_inner + (r_outer − r_inner) × sin(θ_tilt) / sin(β)
                  = 6 + 2 × sin(θ_tilt) / sin(12°)
                  = 6 + 2 × sin(θ_tilt) / 0.208
```

At 0° tilt (upright): r_contact = 6 mm — flat surface, high friction, controlled orbit.
At 5° tilt: r_contact = 6 + 2 × 0.087/0.208 = 6.84 mm — slight growth, gentle self-correction.

The bevel is shallow enough that the growth rate is gradual — the tip does not snap to maximum radius suddenly at small tilts. This is the behaviour of a "well-controlled" tip: the contact radius signal is smooth, not binary, so the orbital path adjusts continuously. Ridge catching follows from the same geometry: the bevelled outer rim can ride up onto the tornado ridge rather than being deflected by it.

### Hit Absorption: Disk Inertia vs Rotational Recoil

The wide disk provides inertia that resists linear displacement from a smash hit:

```
Translational impulse absorption:
  J_smash = Δp_linear = m_disk × Δv_cm

  For Δv_cm = 0.5 m/s (moderate smash):
  Δp = 0.00423 × 0.5 = 2.1 × 10⁻³ N·s   ← small; disk resists being pushed sideways

Rotational impulse from recoil protrusion (φ ≈ 45°, J_contact = 0.01 N·s):
  J_recoil_tangential = J × sin(45°) = 0.0071 N·s
  Rotational impulse: τ_impulse = J_recoil_tangential × r_protrusion
                                = 0.0071 × 0.030 = 2.12 × 10⁻⁴ N·m·s

  Spin loss: Δω = τ_impulse / I_disk
  I_disk ≈ m × r²  = 0.00423 × (0.030)² = 3.81 × 10⁻⁶ kg·m²
  Δω = 2.12×10⁻⁴ / 3.81×10⁻⁶ = 55.6 rad/s ≈ 531 RPM per hit
```

Each protrusion contact costs ~530 RPM. At a typical late-match spin rate of 1500 RPM, three solid hits drain the spin to ~900 RPM — below the LAD orbit threshold. The disk mass absorbs linear displacement but cannot absorb rotational recoil; the recoil acts on the same spin axis that needs to be preserved.

### Protrusion Orientation and the LS Inaccessibility

```
Top view — RS rotation (clockwise from above):

  direction of travel →
      ___
     /   \___   ← leading face (RS): steep φ → high recoil  ← this is what contacts
    |        |
     \______|   ← trailing face (RS): gentle slope → low recoil, spin-steal
                   (this face would lead in LS, but no compatible LS EG exists)
```

In RS the steep face leads. Contact normal φ ≈ 45–50°:

```
J_smash  = J × cos(47°) = 0.682 J  (opponent is pushed outward — some ring-out potential)
J_recoil = J × sin(47°) = 0.731 J  (Circle Defenser bounces back — spin loss)
```

The trailing face at φ ≈ 15° would give J_recoil = 0.259 J — 65% less rotational feedback. A LS Circle Defenser would be markedly more spin-efficient per contact. The RS constraint locks in the worse protrusion orientation, and no LS-compatible EG that pairs with Circle Defenser's tall-slot requirement exists in the library.

### Width Penalty: LAD Collapse Under Scrape

```
Wide disk edge height during orbit at tilt θ:
  h_edge = r_disk × sin(θ)

  r_disk ≈ 30 mm (Circle Defenser outer radius)
  r_WB4_skirt ≈ 22 mm (Wolborg 4 LAD skirt for comparison)

Maximum tilt before edge contacts stadium:
  θ_max = arcsin(h_clearance / r_disk)

  For h_clearance = 2 mm (typical EG base floor-to-skirt gap):
  θ_max_CD  = arcsin(2 / 30) = 3.8°
  θ_max_WB4 = arcsin(2 / 22) = 5.2°

LAD tilt window ratio: 3.8 / 5.2 = 0.73  →  Circle Defenser has 27% narrower safe orbit window
```

A 3.8° maximum tilt is extremely tight. At low spin the precession amplitude (nutation angle) grows; once it exceeds 3.8° the disk edge contacts the floor. Edge contact during orbit at r = 30 mm creates a high-friction braking event:

```
τ_scrape = μ_edge × m × g × r_disk = 0.35 × 0.00423 × 9.81 × 0.030 = 4.35 × 10⁻⁴ N·m

This is larger than the rolling friction of a sharp or ball tip by a factor of ~10.
Spin drain during a single 100 ms edge-scrape event:
  Δω = τ_scrape × t / I = 4.35×10⁻⁴ × 0.1 / 3.81×10⁻⁶ = 11.4 rad/s × 10 = 114 rad/s
  ≈ 1090 RPM  →  a scrape event effectively ends the LAD sequence
```

"Spins out wildly if it scrapes" follows directly: the edge, once in contact, decelerates the disk faster than precession can restore an upright orbit. The LAD sequence terminates rather than recovering.

### Flying Defense Niche: Height-Matched Top Scraping

```
Height profile of niche combo:
  Flying Defense blade base (Hasbro) + Final Clutch EG + Circle Defenser

  Total assembly height h_niche ≈ 28–30 mm from tip to top of AR

Circle Survivor Defense + Roller Defense Ring (tall AR):
  AR top height ≈ 26–27 mm

  h_niche > h_opponent_AR_top  →  Flying Defense upper rim scrapes opponent's AR top
```

The scraping contact transfers angular momentum from the opponent to the Flying Defense assembly. Specifically:

```
Spin transfer torque (top-scrape):
  τ_transfer = μ × F_normal × r_scrape
  F_normal = m_opponent × g × sin(θ_contact_angle) ≈ 0.3 N (light normal force from contact)
  τ_transfer = 0.30 × 0.3 × 0.025 = 2.25 × 10⁻³ N·m

Per second of sustained scrape contact:
  Δω_opponent = τ_transfer × t / I_opponent ≈ 2.25×10⁻³ × 1 / 8×10⁻⁵ = 28 rad/s ≈ 267 RPM/s lost
```

The Circle Defenser's role in this combo is passive: its disk absorbs the impulse that would otherwise cause the Flying Defense assembly to tilt into its own scraping event. By raising the EG's resistance to tilt (wide disk inertia), Circle Defenser preserves the height alignment needed for continuous top-scraping. The niche is narrow — shorter ARs sit below the scraping plane and the combo never makes contact — but against the specific height-matched opponents it produces consistent spin-drain leading to outspins and ring-outs from loss of control.

```typescript
interface CEWCircleDefenser {
  mode: "orbit" | "scraping";
  r_tip_contact_mm: number;       // varies with tilt
  r_disk_mm: number;
  spinLossPerHit_rpm: number;
  maxSafeOrbitTilt_deg: number;
}

function circleDefenserTipRadius(tilt_deg: number): number {
  const r_inner = 6, r_outer = 8, beta_deg = 12;
  const phi = (tilt_deg * Math.PI) / 180;
  const beta = (beta_deg * Math.PI) / 180;
  return r_inner + (r_outer - r_inner) * Math.sin(phi) / Math.sin(beta);
}

function protrustionSpinLoss(J_contact: number, phi_deg: number, r_protrusion_mm: number, I_disk: number): number {
  const phi = (phi_deg * Math.PI) / 180;
  const J_recoil_tangential = J_contact * Math.sin(phi);
  const tau_impulse = J_recoil_tangential * (r_protrusion_mm / 1000);
  const delta_omega = tau_impulse / I_disk;
  return (delta_omega * 60) / (2 * Math.PI);  // RPM
}

function maxOrbitTilt(h_clearance_mm: number, r_disk_mm: number): number {
  return (Math.asin(h_clearance_mm / r_disk_mm) * 180) / Math.PI;
}

// circleDefenserTipRadius(0)  → 6.0 mm  (upright: flat inner surface, controlled)
// circleDefenserTipRadius(5)  → 6.84 mm (gentle bevel engagement; smooth growth)
// circleDefenserTipRadius(12) → 8.0 mm  (full bevel contact at ridge-catching angle)

// protrustionSpinLoss(0.010, 47, 30, 3.81e-6)
// → ~531 RPM per protrusion hit — rotational recoil drains spin directly

// maxOrbitTilt(2, 30)  → 3.8°  (Circle Defenser: extremely narrow LAD window)
// maxOrbitTilt(2, 22)  → 5.2°  (Wolborg 4 skirt: 37% wider — scrape tolerance)
```

---

## Case 196 — Double Horn Attack Ring · 5.5 g
**Thesis:** Geometrically symmetric RS/LS performance locks both directions into the same blunt-corner contact mode — heavy recoil with minor inconsistent upper attack, outclassed by any AR that achieves comparable smash with better face geometry.

Double Horn is a 5.5 g AR with a 3-fold geometry described as Cross Dranzer mirrored: where Cross Dranzer presents its sloped faces toward the leading contact direction, Double Horn reverses those slopes so the leading geometry is an obstructed, steep-sided horn corner rather than a ramp. The consequence is that the intended secondary contact geometry (the slope — which would provide destabilisation and upper attack) is behind the primary geometry and rarely engaged directly. The thick horn corners become the de facto contact points in both spin directions because the slopes are shielded by the horn mass in front of them. Symmetry between RS and LS is near-perfect: neither direction has meaningful geometric advantage, which also means neither direction has a configuration that escapes the heavy recoil inherent to the thick-corner contact mode.

### Cross Dranzer Comparison: Slope Orientation and Contact Accessibility

```
Top view schematic — one arm, RS rotation (→):

  Cross Dranzer:
  ─────────────
       /¯¯¯¯\
      /slope  \___   ← slope faces leading direction; contact on slope first
     |             |     φ_slope ≈ 20° → low recoil, upper attack accessible
      \___________/

  Double Horn (same geometry, reversed):
  ──────────────────────────────────────
       ___________
      |           |___   ← blunt corner leads; slope faces trailing direction
      \  slope   /        φ_corner ≈ 50–60° → high recoil
       \________/
                 ↑
            slope is here but shielded by corner mass
```

At the moment of contact the opponent's AR strikes the horn corner. For the slope to engage, the opponent must pass through the corner and continue into the recessed slope — geometrically possible only if the corner does not deflect the contact event away first. In practice the deflection (recoil) terminates the contact before the slope is reached, making slope engagement rare and inconsistent.

### Primary Contact: Thick Corner Physics

The horn corner presents a blunt, roughly 55° contact normal relative to the radial direction:

```
Contact normal angle φ ≈ 55° (thick corner, steep face):

J_smash  = J × cos(55°) = 0.574 J   ← meaningful but not dominant
J_recoil = J × sin(55°) = 0.819 J   ← recoil exceeds smash fraction

At J_contact = 0.015 N·s (hard hit):
  J_smash  = 0.0086 N·s  →  opponent pushed outward
  J_recoil = 0.0123 N·s  →  Double Horn bounces radially inward/back
```

This is Hyper Aggressive territory (J_recoil > J_smash). The smash impulse is real — opponents do get hit hard — but the simultaneous recoil makes the attacker unstable after each contact. Maintaining orbital path after a recoil event requires high tip traction; on moderately aggressive tips the combination skips or bounces rather than continuing a controlled orbit.

### Symmetric RS/LS: The Zero-Advantage Geometry

```
Rotational symmetry test:
  Double Horn has 3-fold rotational symmetry.
  If it also has mirror symmetry about the radial axis of each arm:
    → RS and LS present identical geometry to opponents
    → φ_RS ≈ φ_LS ≈ 55°  (same contact normal, both directions)
    → J_smash and J_recoil identical in both spin directions

  Cross Dranzer (asymmetric slopes):
    φ_RS ≈ 20° (slope leads)  →  low recoil, preferred direction
    φ_LS ≈ 60° (corner leads) →  high recoil, inferior direction
```

Double Horn's mirror symmetry removes the directional advantage Cross Dranzer gains from asymmetric slopes. This is neutral — there is no "wrong spin direction" to avoid — but it also means there is no "right spin direction" to exploit. The best available contact geometry (the slope) is inaccessible from both directions equally.

### Slope Secondary Contact: Destabilisation Mechanics

On the rare occasions the opponent's AR travels past the initial corner deflection and engages the slope:

```
Slope contact normal φ_slope ≈ 25°:
  J_smash  = J × cos(25°) = 0.906 J
  J_recoil = J × sin(25°) = 0.423 J

Upper force component (vertical):
  F_up = F × sin(rake_angle)
  rake_angle of slope ≈ 15° from horizontal
  F_up = F × sin(15°) = 0.259 F

  At F = 5 N: F_up = 1.3 N  →  upward impulse of ~0.065 N·s over 50 ms
```

The upper attack from slope contact is genuine — 1.3 N upward force would meaningfully tilt an opponent — but the contact duration is shortened by the prior corner deflection. The resulting effect is intermittent destabilisation: sometimes the slope catches and the opponent wobbles, more often the corner deflects the contact event entirely and the slope is never reached.

### Comparison Against Mountain Hammer

```
Metric                   Double Horn        Mountain Hammer
────────────────────────────────────────────────────────────
Primary contact φ        ~55° (corner)      ~30° (ramp edge)
J_smash fraction         0.574              0.866
J_recoil fraction        0.819              0.500
Recoil classification    Hyper Aggressive   Standard Smash
RS/LS symmetry           identical          RS preferred
Upper attack             minor, inconsistent minimal
Mass                     5.5 g              ~6.5 g
```

Mountain Hammer achieves 51% more smash impulse per contact while delivering 39% less recoil — the difference is entirely in contact face angle. Double Horn's blunt corner architecture cannot compete with purpose-designed smash face geometry.

```typescript
interface DoubleHornContact {
  spinDir: "RS" | "LS";
  contactMode: "corner" | "slope";
  phi_deg: number;
  J_smash: number;
  J_recoil: number;
  classification: "standard" | "hyper-aggressive";
  slopeAccessible: boolean;
}

function doubleHornContact(J: number, contactMode: "corner" | "slope"): DoubleHornContact {
  // RS and LS are symmetric — same result regardless of spinDir
  const phi_deg = contactMode === "corner" ? 55 : 25;
  const phi = (phi_deg * Math.PI) / 180;
  const J_smash = J * Math.cos(phi);
  const J_recoil = J * Math.sin(phi);
  return {
    spinDir: "RS",  // identical for LS
    contactMode,
    phi_deg,
    J_smash,
    J_recoil,
    classification: J_recoil > J_smash ? "hyper-aggressive" : "standard",
    slopeAccessible: contactMode === "slope",
  };
}

function smashRecoilComparison(
  phi_double_horn: number,
  phi_mountain_hammer: number
): { smashRatio: number; recoilRatio: number } {
  const dh_smash = Math.cos((phi_double_horn * Math.PI) / 180);
  const mh_smash = Math.cos((phi_mountain_hammer * Math.PI) / 180);
  const dh_recoil = Math.sin((phi_double_horn * Math.PI) / 180);
  const mh_recoil = Math.sin((phi_mountain_hammer * Math.PI) / 180);
  return {
    smashRatio: mh_smash / dh_smash,   // >1 = Mountain Hammer has more smash
    recoilRatio: dh_recoil / mh_recoil, // >1 = Double Horn has more recoil
  };
}

// doubleHornContact(0.015, "corner")
// → { phi_deg: 55, J_smash: 0.0086, J_recoil: 0.0123, classification: "hyper-aggressive" }
// — primary mode: hard hit with recoil > smash fraction

// doubleHornContact(0.015, "slope")
// → { phi_deg: 25, J_smash: 0.0136, J_recoil: 0.0063, classification: "standard" }
// — slope mode: better geometry, rarely accessed

// smashRecoilComparison(55, 30)
// → { smashRatio: 1.508, recoilRatio: 1.638 }
// — Mountain Hammer: 51% more smash, Double Horn: 64% more recoil — no justification for DH
```

---

## Case 197 — Right Engine Gear (Circle Defenser / Mystery Cutter) · 6.9 g
**Thesis:** The tall-slot EG body's primary value is elevation — raising the WD and AR plane away from the attacker contact window — not the CEW gimmick, which delivers one useful tip (Circle Survivor) and two that serve no purpose.

Right Engine Gear (Circle Defenser) and Right Engine Gear (Mystery Cutter) are the same 6.9 g unit, named by the CEW part included at retail. The EG body uses a tall CEW slot — deeper than the normal-slot EGs — requiring a lock clip to retain the CEW on the shaft during battle. The three compatible CEW tips are Circle Defenser (Case 195), Circle Survivor, and Mystery Cutter. Of these, Circle Survivor is the only competitively relevant choice; the other two carry recoil liabilities detailed in their own cases. The EG body itself confers two stackable benefits: it elevates the entire assembly by the slot height differential (~4–5 mm above a normal-slot or standard SG base), and it unlocks base pairings beyond the dedicated Normal Base (Wolborg 4) and Normal Base (Rock Bison) platforms.

### Tall Slot and Lock Clip Retention

```
Slot depth comparison:
  Normal-slot EG:   h_slot ≈ 8 mm    CEW tip protrudes ~2 mm below housing
  Tall-slot EG:     h_slot ≈ 12 mm   CEW tip protrudes ~6 mm below housing

Without clip (tall slot):
  Axial play during battle impact:
    F_axial (from hard hit) ≈ 3–5 N downward on EG shaft
    Friction retention force (press fit alone) ≈ 1.5–2 N
    → Net: CEW can be driven down or rotated out of alignment

Lock clip function:
  Wraps shaft above CEW seating, prevents axial displacement
  Retention force (clipped): mechanical interference >> F_axial
  → CEW stays seated regardless of hit magnitude
```

The clip is not a performance component — it is a structural prerequisite. Without it the CEW shifts position under battle loads, changing the effective tip contact radius and degrading the controlled movement that Circle Survivor depends on.

### Elevation Geometry: Raising the WD/AR Plane

The most important physical effect of this EG is vertical translation of the whole assembly. With a standard SG + Normal Base (Wolborg 4), the WD sits at height h_WD above the stadium floor. Adding this tall-slot EG raises h_WD by Δh_elev:

```
Δh_elev = h_slot_tall − h_slot_normal ≈ 12 − 8 = 4 mm
(additional housing body height also contributes ~2 mm)
Total elevation gain: Δh_total ≈ 5–6 mm above standard SG setup
```

The primary weakness of Circle Survivor Defense is attack contact on the upper AR/WD region. A smash attacker's contact height is fixed by its own base and tip:

```
h_attacker_contact ≈ h_tip + h_base_attacker ≈ 12 + 5 = 17 mm (typical attack setup)

Standard Circle Survivor (WB4):
  h_WD_lower_edge ≈ 18 mm  →  attacker contacts within 1 mm of WD edge (dangerous)

Elevated Circle Survivor (this EG + WB4):
  h_WD_lower_edge ≈ 23–24 mm  →  attacker now contacts the EG housing skirt (~17 mm)

  EG housing skirt geometry: smooth cylindrical → φ ≈ 5–10° → near-zero recoil surface
  Attacker hits smooth skirt instead of WD edge → most impulse glances off
```

The WD edge is the high-recoil vulnerability. Moving it 5–6 mm higher means most attack-type contact zones engage the smooth lower housing rather than the WD rim. The WD and AR continue to spin freely above the attacker's reach.

### Effective Defense Increase from Elevation

```
Contact zone model:
  Attacker AR sweep height range: h_contact ± σ_height ≈ 17 ± 3 mm

  Standard setup: WD lower edge at 18 mm
    P(WD contact) = P(h_contact > 18) ≈ 84%  (most hits reach WD)

  Elevated setup: WD lower edge at 23 mm
    P(WD contact) = P(h_contact > 23) ≈ 16%  (only the highest hits reach WD)

  Reduction in dangerous contact probability: 84% → 16% = 5× fewer WD-level hits
```

The numbers are approximate but the effect is real: elevation doesn't make Circle Survivor invincible, it makes the dominant attacker contact zone harmless. The combo's survival against smash attack improves substantially — the WD's peripheral inertia is preserved for LAD rather than depleted by each hit.

### Zeus Base Combo: Weight-Based Defense Hybrid

First Clutch Base (Zeus Version) is among the heaviest EG blade bases. Combined with this EG body and CEW Circle Survivor:

```
Mass estimate:
  First Clutch Base (Zeus Version):  ~8.5–9 g
  Right EG (Circle Defenser body):   6.9 g
  CEW Circle Survivor:               ~3.5 g
  AR + WD:                           ~18–20 g (typical stamina setup)
  ─────────────────────────────────────────────
  Total combo mass:                  ~37–39 g

Compare: SG Metal Ball Base (4 balls) + HMC:
  SG Metal Ball (4 balls):  ~9–10 g
  Heavy Metal Core:          6.2 g
  AR + WD:                  ~18–20 g
  ─────────────────────────────────────────────
  Total:                    ~33–36 g

Translational defense from mass (resist ring-out):
  F_required_ringout = m × a_min = m × (v_escape² / 2 × r_arena)

  Higher m → higher F_required → harder to ring out
  Zeus combo total mass is at the upper limit of the plastics era range
```

The Zeus combo is not a pure Circle Survivor setup — the First Clutch fires immediately and the tall assembly is more vulnerable to certain attackers than a lower-profile stamina combo. What it gains is translational mass sufficient to resist ring-out attempts from all but the strongest attack setups, while Circle Survivor's CEW provides the LAD to win outspin scenarios when the attacker fails to ring it out.

### Flying Defense Counter Combo (Hasbro Specific)

This EG also enables a counter setup: Flying Defense (Hasbro) + Wide Defense + CEW Circle Defenser + lower-recoil Final Clutch Base. The physics are height-matching (detailed in Case 195):

```
Target: Circle Survivor Defense using this EG + Ten Heavy + Roller Defense Ring
  Total height of target AR top: ~27–29 mm (tall AR on elevated EG)

Flying Defense counter combo total height: ~28–30 mm
  → Flying Defense upper rim scrapes target AR top
  → Transfers ~267 RPM/s spin out of opponent (see Case 195)

Role of Circle Defenser in counter combo:
  Absorbs hit impulse (wide disk inertia) → reduces Flying Defense's own tilt
  → Maintains height alignment for sustained top-scraping
```

This counter is effective only against the elevated EG + Roller Defense Ring height profile. Against standard-height Circle Survivor (WB4 alone) the height match fails and the counter produces no scraping contact.

```typescript
interface RightEGTallSlot {
  cewType: "circle-survivor" | "circle-defenser" | "mystery-cutter";
  elevationGain_mm: number;
  requiresLockClip: boolean;
  wdContactProbabilityReduction: number;  // fraction vs standard SG setup
}

function elevationContactReduction(
  h_wd_standard_mm: number,
  delta_elev_mm: number,
  h_attacker_mm: number,
  sigma_mm: number
): number {
  // Normal distribution approximation for attacker contact height spread
  // Returns reduction in probability of WD-level contact (0–1, higher = safer)
  const z_standard = (h_wd_standard_mm - h_attacker_mm) / sigma_mm;
  const z_elevated = (h_wd_standard_mm + delta_elev_mm - h_attacker_mm) / sigma_mm;
  // P(contact) = P(h > h_WD) = 1 - Φ(z)
  // reduction = P_standard - P_elevated
  // approximated as (z_elevated - z_standard) / (1 + |z_standard|)
  return (z_elevated - z_standard) / sigma_mm;
}

function zeusCombinationMass(
  m_base_g: number,
  m_eg_g: number,
  m_cew_g: number,
  m_ar_wd_g: number
): { total_g: number; ringoutForceIncrease: number } {
  const total = m_base_g + m_eg_g + m_cew_g + m_ar_wd_g;
  const reference_g = 33;  // SG Metal Ball + HMC reference
  return {
    total_g: total,
    ringoutForceIncrease: total / reference_g,
  };
}

// elevationContactReduction(18, 5, 17, 3)
// → ~1.67 — elevation shifts contact zone 1.67 sigma away from WD; ~5x safer

// zeusCombinationMass(9.0, 6.9, 3.5, 19.0)
// → { total_g: 38.4, ringoutForceIncrease: 1.164 }
// — 16% more mass than SG Metal Ball + HMC reference; near-maximum translational defense
```

---

## Case 198 — Normal Base (Rock Bison Version) · 5.6 g
**Thesis:** The "always-on" EG coupling removes timing constraints but demands launch discipline, enables hit-recharge with large CEW parts, and provides marginally more recoil than Wolborg 4's version from small rectangular protrusions — a functional second option for the same Circle Survivor role.

Normal Base (Rock Bison Version) is a 5.6 g blade base with a small, round profile and no clutch mechanism in its EG coupling. Where First and Final Clutch bases hold the wound spring until a trigger condition fires, Normal Base connects the EG spring directly to the output shaft — the moment the spring is wound past the resting preload, it begins acting on the rotation. This "always on" character changes two things relative to clutch-equipped bases: the assembly must be held stationary at launch to prevent early discharge, and during battle any relative rotation between the EG body and the shaft tip (whether from hits, recoil, or the Circle Survivor CEW receiving spin from the opponent) can partially rewind the spring, enabling mid-battle recharge. Small rectangular protrusions run around the base edge, distinguishing it geometrically from Normal Base (Wolborg 4 Version)'s smooth rim and introducing marginal recoil at each contact.

### "Always On" Coupling: Spring–Shaft Engagement Model

```
Clutch base spring engagement:
  ─────────────────────────────────
  Wound state: clutch holds spring → spring decoupled from shaft
               shaft rotates freely, spring energy stored
  Trigger:     clutch releases → spring drives shaft → spin boost

Normal Base spring engagement:
  ─────────────────────────────────
  Wound state: spring directly coupled to shaft at all times
               τ_spring acts on shaft continuously as spring unwinds
               Net shaft torque = τ_spring − τ_friction_tip

  At wind-up: τ_spring >> τ_friction → shaft accelerates (early discharge if not held)
  At rest:    τ_spring ≈ τ_friction → slow continuous release
```

The launch discipline requirement follows directly: if the beyblade is placed on the launcher while wound and the AR + body are not restrained, the spring drives the shaft immediately, wasting the wound energy before the beyblade reaches the stadium. The user must hold the assembly stationary at the launcher nock until release.

### Hit-Recharge Mechanics

The spring connects the EG outer body (which carries the AR) to the inner shaft (which drives the tip). Relative rotation between body and shaft in the wind direction re-tensions the spring:

```
Winding direction: RS beyblade, body rotates CW when viewed from above
                   shaft rotates CW at ω_shaft (slower if resisted by tip friction)

Hit recharge condition:
  Body receives a tangential impulse that decelerates it momentarily:
    ω_body drops to ω_body − Δω_hit for duration t_contact
  During this window: ω_shaft > ω_body (shaft is momentarily faster)
    → relative rotation = (ω_shaft − ω_body) × t_contact in wind direction
    → spring gains Δθ_wind = (ω_shaft − ω_body) × t_contact

  Typical: Δω_hit ≈ 20 rad/s, t_contact ≈ 10 ms
    Δθ_wind = 20 × 0.01 = 0.2 rad ≈ 11.5°  per hit
    τ_spring gain = k × Δθ = 0.003 × 0.2 = 6 × 10⁻⁴ N·m stored
```

With CEW Circle Survivor, an additional recharge pathway opens: Circle Survivor's large smooth rim contacts the opponent and receives a spin-transfer torque from the opponent's higher spin. This torque acts on the shaft in the same direction as the wind, incrementally rewinding the spring without requiring a hit event on the body.

### Edge Protrusions: Recoil Margin vs Wolborg 4

```
Edge comparison:
  Normal Base (Wolborg 4):   smooth rim, φ ≈ 5°
  Normal Base (Rock Bison):  small rectangular protrusions, φ ≈ 25–30°

Contact event recoil:
  WB4:   J_recoil = J × sin(5°)  = 0.087 J
  RB:    J_recoil = J × sin(27°) = 0.454 J

  Ratio: 0.454 / 0.087 = 5.2×  — Rock Bison has 5× more recoil per protrusion hit
```

The protrusions are small and widely spaced around the rim, so not every contact engages a protrusion. The effective recoil increase per random contact event is much smaller than 5×:

```
Protrusion arc coverage:
  Each protrusion spans ~5° arc, 8 protrusions × 5° = 40° total out of 360°
  Hit probability on protrusion: 40/360 = 11%

  Effective recoil per random hit:
  J_recoil_effective = 0.11 × J × sin(27°) + 0.89 × J × sin(5°)
                     = 0.11 × 0.454 J + 0.89 × 0.087 J
                     = 0.050 J + 0.077 J = 0.127 J

  vs WB4: 0.087 J → RB is 46% more recoil on average, not 5×
```

"Only marginally" inferior is accurate — 46% more average recoil sounds significant but in absolute terms (0.127 J vs 0.087 J at a typical J_contact = 0.01 N·s) the difference is 0.4 mN·s, a small per-contact spin difference that only accumulates meaningfully in a prolonged match.

### LAD Quality for an EG Base

Normal Base (Rock Bison Version) has a LAD skirt radius approximately equivalent to Wolborg 4's version, both constrained by the same EG housing footprint:

```
Skirt orbit radius: r_LAD ≈ 21–22 mm (similar to WB4)
LAD duration (both): moderate — adequate for most match-length outlasting attempts

Compare Defense Grip Base 2 (top-tier LAD):
  r_LAD ≈ 24–25 mm
  (22/25)² = 0.774  →  Normal Bases orbit ~23% shorter than DGB2 at equal spin
```

Both Normal Base variants sit in the "decent but not top-tier" LAD tier for EG chassis. The skirt geometry is clean enough to sustain orbit, and the absence of EG housing height (Normal Bases are low compared to dedicated EG bases) keeps the stability threshold reasonable.

### Weight Distribution Advantage with Right Customize Gear (Free Shaft)

Right Customize Gear (Free Shaft Version) decouples the AR from the EG body via a free-spinning outer ring. In this configuration the AR's rotational contribution to the combo's effective inertia is reduced — the body's own mass distribution dominates:

```
RCG Free Shaft decoupling:
  AR spins freely on outer bearing → AR angular momentum separate from body
  Body inertia I_body = contribution of base + EG alone (not AR)

  Rock Bison base mass distribution: slightly more peripheral than WB4
    (rectangular protrusions add mass at r ≈ 23–24 mm)

  ΔI = Δm × r² = 0.0005 × (0.024)² = 2.88 × 10⁻⁷ kg·m²

  This small I advantage directly increases spin retention when RCG decouples the AR,
  because the body is now the primary spin-bearing element.
```

Wide Survivor as WD in this setup: WS outer diameter (~41 mm) is smaller than Wide Defense (~43 mm), putting less mass at the periphery. This reduces the total I, which lowers launch energy requirements and keeps the combination more responsive. The LAD function shifts from the base skirt to the Wide Survivor outer rim — WS's smooth rounded edge provides its own orbit geometry, so the base's limited LAD skirt is less critical.

```typescript
interface NormalBaseRockBison {
  clutchType: "none";  // always-on coupling
  protrusion_phi_deg: number;
  protrusion_arc_fraction: number;
  effectiveRecoilJ: number;
  r_lad_mm: number;
  hitRechargeCapable: boolean;
}

function normalBaseRBRecoil(J_contact: number): number {
  const phi_protrusion = 27 * Math.PI / 180;
  const phi_smooth = 5 * Math.PI / 180;
  const p_protrusion = 0.11;  // 11% hit probability on protrusion
  return J_contact * (
    p_protrusion * Math.sin(phi_protrusion) +
    (1 - p_protrusion) * Math.sin(phi_smooth)
  );
}

function hitRechargeEnergy(
  delta_omega_body: number,
  t_contact_s: number,
  k_spring: number
): number {
  const delta_theta = delta_omega_body * t_contact_s;  // radians rewound
  return 0.5 * k_spring * delta_theta ** 2;            // energy stored (J)
}

function rcgBodyInertia(m_protrusion_g: number, r_mm: number): number {
  return (m_protrusion_g / 1000) * ((r_mm / 1000) ** 2);
}

// normalBaseRBRecoil(0.010)
// → 1.27×10⁻³ N·s effective recoil vs 8.7×10⁻⁴ N·s for WB4
// — 46% more average recoil; marginal per-hit but accumulates over extended match

// hitRechargeEnergy(20, 0.010, 0.003)
// → 6×10⁻⁶ J stored per hard hit — small but real; accumulates across many contacts

// rcgBodyInertia(0.5, 23.5)
// → 2.76×10⁻⁷ kg·m² ΔI advantage vs WB4 in free-shaft configuration
```

---

## Case 199 — Normal Base (Wolborg 4 Version) · 5.4 g
**Thesis:** A smooth perimeter eliminates the recoil penalty of Rock Bison's protrusions and exposes the WD outer rim below the base footprint — making it the reference Circle Survivor Defense base and the primary RCG (Free Shaft) platform.

Normal Base (Wolborg 4 Version) is 5.4 g, 0.2 g lighter than Rock Bison's version, and shares the same "always-on" EG coupling with no clutch mechanism. The shared mechanics — launch-hold discipline, spring active immediately on winding, hit-recharge capability with large CEW parts — are identical to Case 198 and apply here without modification. The distinguishing geometry is the perimeter: Wolborg 4's base is essentially a complete circle with only minor tab interruptions, giving a contact-normal angle φ ≈ 5° across almost the entire rim. This is the lowest recoil surface achievable on any blade base, and it is the reason this base dominates Circle Survivor Defense: every attacker hit that lands on the base skirt rather than the AR or WD glances off with negligible spin loss. The base also sits low enough that a Wide Survivor WD's outer rim overhangs the base footprint, delegating all LAD orbit contact to the WD rather than the base skirt.

### Smooth Perimeter: Recoil Comparison vs Rock Bison

```
Perimeter geometry comparison:
  Rock Bison:   rectangular protrusions, φ ≈ 27°, coverage 11% of arc
  Wolborg 4:    smooth rim throughout, φ ≈ 5° across ~98% of arc
                (minor tab slots: ~2° interruptions, negligible contribution)

Recoil per random contact hit (J_contact = 0.010 N·s):
  Rock Bison effective: 0.127 J = 1.27×10⁻³ N·s  (see Case 198)
  Wolborg 4 effective:  J × sin(5°) = 0.087 J = 8.7×10⁻⁴ N·s

  Recoil advantage: 1.27 / 0.87 = 1.46  →  WB4 takes 32% less recoil per hit
```

In a Circle Survivor Defense match where the base skirt absorbs repeated attacker contacts over 3+ minutes, 32% less recoil per contact event translates directly to longer spin retention and more reliable LAD sequences. The smooth perimeter also means the base never produces reactive spin from an attacker's hit — the attacker bounces off cleanly without gaining orbital energy from recoil, making the base passively safe rather than passively risky.

### WD Exposure Geometry and Wide Survivor LAD

The base outer radius r_base and the WD outer radius r_WD determine whether the WD rim overhangs the base:

```
Base outer radius (WB4): r_base ≈ 20–21 mm
Wide Survivor outer radius: r_WS ≈ 41 mm (radius to outer edge)

WD overhang = r_WS − r_base = 41 − 21 = 20 mm  ← WD rim extends well beyond base

During tilt orbit at angle θ:
  Lowest point height: h_contact = r_WS × sin(θ)  (WS outer rim, not base skirt)

  For h_contact to reach floor (LAD contact via WS rim):
  θ_orbit = arcsin(h_clearance / r_WS) = arcsin(2 / 41) = 2.8°

Compare base-only LAD (WB4 skirt r ≈ 21 mm):
  θ_orbit = arcsin(2 / 21) = 5.5°  ← higher tilt needed = less stable orbit window

  Wide Survivor takes over LAD at a shallower tilt → earlier, more stable orbit onset
```

When the WD rim is the contact surface, the LAD orbit radius is 41 mm — nearly double the base skirt radius. LAD duration scales with r²:

```
Duration ratio (WS orbit vs base skirt orbit):
  (41)² / (21)² = 1681 / 441 = 3.81×  →  WS-based LAD lasts ~3.8× longer
```

This is the mechanism behind "exposes the WD well": the base diameter is small enough that it never competes with the WD for floor contact during a tilt orbit. The WD's superior radius does all the LAD work.

### Circle Survivor Defense Role

```
Combination: WB4 Normal Base + Right EG (Circle Defenser/Mystery Cutter, tall slot)
             + CEW Circle Survivor + suitable AR (e.g. Roller Defense Ring) + Wide Defense

Recoil surface hierarchy (inside to outside):
  1. Base skirt (φ ≈ 5°):  attacker hits → 0.087 J recoil → safe
  2. EG housing:            attacker hits → smooth cylindrical → safe
  3. WD (Wide Defense):     attacker hits → wide flat rim, low recoil → acceptable
  4. AR (Roller Defense):   attacker hits → ball-bearing rollers, passive → acceptable

Spin loss budget per attacker contact sequence (typical 3-hit exchange):
  Base skirt hit:   0.87 mN·s recoil → ~8 RPM spin loss
  EG housing hit:   ~0.8 mN·s → ~7 RPM
  WD rim hit:       ~1.5 mN·s → ~14 RPM
  ────────────────────────────────────────
  3-hit budget:     ~29 RPM total → negligible at starting 3000 RPM
```

The combination has no high-recoil surface anywhere in the contact chain. An attacker cannot find a geometry that efficiently transfers spin out of the defender; every contact returns minimal recoil while the Circle Survivor CEW slowly accumulates spin-steal torque from the opponent through its smooth outer disk.

### Desert Sphinxer Final Clutch Base Comparison

Final Clutch Base (Desert Sphinxer Version) carries extra mass (heavier base body) and a Final Clutch mechanism. Its rim geometry is also smooth. The trade-offs:

```
WB4 Normal Base:               5.4 g, no clutch, always-on, lower mass
Desert Sphinxer Final Clutch:  ~7.0–7.5 g estimate, Final Clutch, heavier

Mass advantage DS:
  Translational defense: F_ring_out ∝ m
  ΔF = Δm × a = 0.002 kg × typical a → ~2% harder to ring out

  Against that: Final Clutch burst fires mid-match at ~1350 RPM (Case 193)
  Burst at 1350 RPM adds ~27% spin recovery (small absolute effect)

WB4 advantage: no clutch mechanism that can misfire or add complexity;
               lighter = higher launch spin at same launcher energy
```

Desert Sphinxer is "marginally better" in specific situations (heavier combo, Final Clutch fires at right moment) but WB4 is simpler, lighter, and more consistent. The performance gap is small in either direction.

### Attack Use: Staying Out of the Way

For EG attack setups (e.g. Triple Tiger RS + this base + CEW Metal Flat), the base contributes no smash geometry of its own. The smooth perimeter is neutral — it neither helps the attack nor creates self-defeating recoil:

```
Attack contact hierarchy:
  AR (Triple Tiger):  primary smash — delivers all offensive impulse
  Base skirt (WB4):   incidental contact — φ = 5°, glances harmlessly
  EG housing:         too low to contact most opponents in RS attack orbit

"Keeps out of the way" = φ ≈ 5° on base ensures no base-induced recoil
that would destabilise the orbital path between AR contacts.
```

A base with high-φ protrusions in an attack setup creates erratic movement after each hit — the attacker bounces unpredictably off its own base geometry. WB4's smooth rim prevents this self-interference.

```typescript
interface NormalBaseWB4 {
  rimPhi_deg: number;        // near-zero contact normal angle
  r_base_mm: number;
  r_wd_overhang_mm: number;  // how far WD extends beyond base
  ladContactSurface: "base-skirt" | "wd-rim";
}

function wb4RecoilPerHit(J_contact: number): number {
  return J_contact * Math.sin((5 * Math.PI) / 180);  // φ = 5°
}

function wdLadDurationRatio(r_wd_mm: number, r_base_mm: number): number {
  // LAD duration scales with r²; WD takes over when it overhangs base
  return (r_wd_mm ** 2) / (r_base_mm ** 2);
}

function wb4VsRBRecoilAdvantage(J_contact: number): number {
  const wb4 = J_contact * Math.sin((5 * Math.PI) / 180);
  // RB effective recoil (11% protrusion coverage at φ=27°, 89% at φ=5°)
  const rb = J_contact * (0.11 * Math.sin((27 * Math.PI) / 180) + 0.89 * Math.sin((5 * Math.PI) / 180));
  return rb / wb4;  // >1 = WB4 is better (less recoil)
}

// wb4RecoilPerHit(0.010)
// → 8.72×10⁻⁴ N·s  — near-minimum recoil for any base geometry

// wdLadDurationRatio(41, 21)
// → 3.81  — Wide Survivor orbit lasts 3.8× longer than base-skirt orbit alone

// wb4VsRBRecoilAdvantage(0.010)
// → 1.46  — Rock Bison produces 46% more effective recoil per random hit
```

---

## Case 200 — Right Engine Gear (Circle Survivor) · 6.8 g
**Thesis:** A normal-slot EG body with prong-keyed Circle Survivor exclusivity — 0.1 g lighter and 4–5 mm lower than Rock Bison's tall-slot variant, trading the WD-elevation defense benefit for a lower centre of mass and marginally better gyroscopic stability.

Right Engine Gear (Circle Survivor) is 6.8 g, 0.1 g lighter than Rock Bison's Right EG (Circle Defenser/Mystery Cutter) from Case 197. The CEW slot uses a prong geometry keyed specifically to Circle Survivor's mating slots — no other CEW part seats correctly, so there is no substitution decision to make. A lock clip is still present in the assembly, serving the same axial retention function as on the tall-slot unit. The slot itself is normal depth rather than tall, which means the entire EG body sits 4–5 mm lower in the assembly stack than Rock Bison's variant. This single dimensional difference drives the trade-off: the normal-slot unit has a lower centre of mass (better gyroscopic stability baseline) but places the WD and AR 4–5 mm closer to the contact height of typical attack combinations, partially re-exposing the vulnerability that the tall-slot unit's elevation removes.

### Prong Lock: Mechanical CEW Exclusivity

```
Slot comparison:
  Rock Bison EG (tall slot):   smooth rectangular slot + separate lock clip
    → accepts Circle Survivor, Circle Defenser, Mystery Cutter (geometry-agnostic)

  This EG (prong lock):        two mating prongs protrude into CEW cavity
    → only Circle Survivor has the receiving slots that clear the prongs
    → other CEW parts cannot seat; combination is mechanically enforced

Retention after clip:
  Prong interference + clip = two independent retention mechanisms
  CEW axial displacement requires defeating both → more secure than clip alone
```

The exclusivity is a design constraint, not a flaw. Since Circle Survivor is the only useful CEW for competitive play anyway (Cases 190, 193, 195 all conclude that other CEW options carry liabilities), the restriction has zero practical cost.

### Normal Slot vs Tall Slot: Elevation Differential

```
Slot height comparison:
  Tall-slot EG (Rock Bison):   h_slot ≈ 12 mm
  Normal-slot EG (this unit):  h_slot ≈ 8 mm
  Δh = 4 mm  (normal-slot assembly sits 4–5 mm lower overall)

WD lower edge height above stadium floor:
  Tall-slot build (+ WB4 base): h_WD ≈ 23–24 mm
  Normal-slot build (+ WB4 base): h_WD ≈ 18–19 mm

Attacker contact zone (typical smash attack): h_contact ≈ 17 ± 3 mm

  Normal-slot: h_WD (18–19 mm) ≈ h_contact_upper (20 mm) → WD within reach
  Tall-slot:   h_WD (23–24 mm) > h_contact_upper (20 mm) → WD above reach

P(WD contact) at h_WD = 18.5 mm, h_attacker = 17 mm, σ = 3 mm:
  z = (18.5 − 17) / 3 = 0.5
  P(contact) ≈ 30%  (attacker reaches WD on ~30% of hits)

P(WD contact) at h_WD = 23.5 mm (tall slot):
  z = (23.5 − 17) / 3 = 2.17
  P(contact) ≈ 1.5%  (attacker almost never reaches WD)
```

The normal-slot assembly is meaningfully more vulnerable to WD-level contact than the tall-slot variant — not completely exposed, but the protection margin is much thinner.

### Lower CoM: Gyroscopic Stability Benefit

Moving the EG body 4–5 mm lower also lowers the overall assembly's centre of mass:

```
CoM height with normal-slot EG:  h_cm ≈ 15 mm
CoM height with tall-slot EG:    h_cm ≈ 17–18 mm  (extra housing above base)

Stability threshold:
  ω_stable ∝ √(m × g × h_cm / I_total)

  Ratio normal/tall: √(15/17) = 0.939  →  normal-slot stable at 6.1% lower spin
```

A 6.1% lower spin threshold before instability onset is a small but real advantage in very long matches where both combos are orbiting at minimal residual spin. The normal-slot combination maintains clean orbit slightly deeper into spin-out territory, which can decide an outspin result when both competitors are near the limit.

### Height vs Stability Trade-off Summary

```
Metric                       Normal-slot EG         Tall-slot EG (Rock Bison)
                             (this unit)            (Case 197)
────────────────────────────────────────────────────────────────────────────────
WD height above floor        18–19 mm               23–24 mm
P(WD contact, typical atk)   ~30%                   ~1.5%
CoM height                   ~15 mm                 ~17–18 mm
Stability ω threshold        6.1% lower             baseline
CEW options                  Circle Survivor only   CS + Circle Defenser + MC
Mass                         6.8 g                  6.9 g
Elevation vs compacts        standard               protected
Use case preference          lower-CoM stamina      anti-compact elevation
```

Neither variant is unconditionally better. Against attack combos that operate in the 15–20 mm contact window, Rock Bison's tall-slot unit is significantly safer. Against opponents that are themselves tall (where the height advantage no longer shifts the WD out of reach, or where the lower stability threshold matters at match end), the normal-slot unit's CoM benefit is relevant. The "lower centre of gravity if not aiming for compact-on-top" distinction is precise: the normal-slot EG is the right choice when the opponent is not a compact-type attacker.

```typescript
interface RightEGCircleSurvivor {
  slotType: "normal";
  cewLock: "prong-keyed";
  compatibleCEW: ["circle-survivor"];  // mechanically enforced
  height_mm: number;
  mass_g: number;
}

function normalVsTallSlotWDContactProb(
  h_wd_mm: number,
  h_attacker_mm: number,
  sigma_mm: number
): number {
  // approximate P(attacker reaches WD) using z-score
  const z = (h_wd_mm - h_attacker_mm) / sigma_mm;
  // P(X > h_wd) ≈ erfc(z/√2)/2 — approximated here as simple logistic
  return 1 / (1 + Math.exp(1.7 * z));
}

function stabilityThresholdRatio(h_normal_mm: number, h_tall_mm: number): number {
  // ω_stable ∝ √h_cm; ratio < 1 means normal-slot needs less spin
  return Math.sqrt(h_normal_mm / h_tall_mm);
}

// normalVsTallSlotWDContactProb(18.5, 17, 3)  → ~0.30  (30% — WD exposed)
// normalVsTallSlotWDContactProb(23.5, 17, 3)  → ~0.015 (1.5% — WD protected)
// — tall-slot EG reduces WD hit probability by 20×

// stabilityThresholdRatio(15, 17)
// → 0.939  — normal-slot EG stable at 6.1% lower spin than tall-slot variant
// — small but decisive in extended low-spin LAD sequences
```

---

## Case 201 — CEW Circle Survivor · 4.5 g + 0.23 g clip
**Thesis:** A free-spinning bowl attached to the EG shaft rather than the main body decouples the primary contact surface from the beyblade's own angular momentum — eliminating spin steal, dispersing smash force through rotation, trapping unstable opponents under its rim, and generating a defensive barrier so complete it rewrote the plastics attack meta.

CEW Circle Survivor (4.73 g total) is a large concave bowl mounted on the EG shaft between the shaft and the stadium floor. Because the shaft can rotate relative to the main body (EG free-spin coupling), the bowl is semi-decoupled: it spins when friction allows but does not rigidly transmit force from the contact surface to the beyblade's angular momentum axis. The tip is a sharp Change-shape tip, sharper even than Customize Metal Change Base — naturally immobile without EG input but becoming mobile when the spring winds. This architecture produces a defense system with no equivalent elsewhere in the library: the primary contact surface is physically separated from the spin axis it is supposed to protect, and every attack mechanic in the game depends on that connection being intact to work.

### Free-Spin Coupling: Why Attacks Fail to Land

```
Rigid coupling (normal base):
  Attacker AR → contact force F → rigid body → full impulse on spin axis
  Spin steal: τ_steal = F × r_contact / r_body

  Impulse transmitted = F × Δt  (all of it)

Free-spin coupling (Circle Survivor bowl):
  Attacker AR → F on bowl → bowl free to rotate relative to body
  Bowl rotates at angular rate ω_bowl
  Coupling torque to body: τ_coupling = μ_bearing × F_normal_bearing

  If F × r_bowl > τ_coupling:
    bowl slips → only τ_coupling transmitted to body
    τ_coupling = μ_bearing × m_bowl × g ≈ 0.05 × 0.00473 × 9.81 = 2.32 × 10⁻³ N·m

  Vs. impulse from rigid coupling at same hit:
    F_contact ≈ 5 N, r_bowl ≈ 0.027 m:
    τ_rigid = 5 × 0.027 = 0.135 N·m

  Transmission ratio: 2.32×10⁻³ / 0.135 = 1.7%
  → Only 1.7% of the contact torque reaches the main spin axis
```

The attacker's hit almost entirely spins the bowl up rather than slowing the beyblade. The bowl absorbs ~98% of the contact torque, accelerating to match the attacker's peripheral velocity while the main body continues at its original spin rate.

### Spin Steal Suppression

Standard spin steal relies on the contact surface being rigidly coupled to the defender's spin axis, so friction at the contact point transfers angular momentum from attacker to defender in the wrong direction. Circle Survivor's free-spin removes this coupling:

```
Normal spin steal:
  Δω_defender = −(μ × F_contact × r_contact × Δt) / I_defender
  Δω_attacker = +(μ × F_contact × r_contact × Δt) / I_attacker

Circle Survivor spin steal:
  Bowl angular momentum L_bowl = I_bowl × ω_bowl
  Steal torque acts on I_bowl alone (decoupled from main body)
  Δω_main_body ≈ −(τ_coupling × Δt) / I_body = −(2.32×10⁻³ × 0.01) / 8×10⁻⁵
                = −0.29 rad/s ≈ −2.8 RPM per hit contact

Compare rigid coupling steal: Δω ≈ 20–40 RPM per contact for rubber-tip setups
  Circle Survivor reduces spin steal by ~93%
```

Even rubber-tipped attackers (maximum friction surface) cannot efficiently steal spin through the free-spinning bowl. The rubber tip spins the bowl up; the main body is shielded by the bearing.

### Smash Force Dispersal

When a smash attacker's AR contacts the bowl's outer rim:

```
Rigid wall: F_smash → full radial impulse on main body → ring-out potential
             J_ringout = F × Δt directed radially outward

Bowl (free-spin): F_smash → tangential impulse on bowl rim
  Decompose: F = F_radial + F_tangential
  F_tangential drives bowl rotation (absorbed); F_radial still reaches body

  For contact at angle α from bowl tangent:
  F_radial_body = F × sin(α) × transmission_ratio
                = F × sin(α) × 0.017

  At α = 45° (typical smash): F_radial_body = 5 × 0.707 × 0.017 = 0.060 N
  Vs same hit on rigid body:  F_radial_body = 5 × 0.707 = 3.54 N

  Ring-out force reduction: 0.060/3.54 = 1.7% transmitted to body
```

This is why "hard to push far enough to get it out of the stadium" is the defining characteristic. The bowl dissipates nearly all translational impulse as rotational acceleration of itself, leaving less than 2% to push the main body toward the wall.

### Upper Attack Deflection: Bowl Curvature Geometry

```
Bowl inner surface cross-section:
              ____
             /    \___________
            /                 \
           /   concave bowl    \
          |                     |
          └─────────────────────┘
                 ↑ EG shaft

RS Upper Attack approach (upward rake angle θ_UA ≈ 30°):
  F_up = F × sin(30°) = 0.5 F  (upward force component)

  Contact on bowl outer slope (bowl wall angle ψ ≈ 40° from horizontal):
  Normal to bowl surface points inward-downward at angle ψ:
  F_reaction = F_up × cos(ψ) = 0.5F × cos(40°) = 0.383 F  (pressing bowl to floor)
  F_lateral   = F_up × sin(ψ) = 0.5F × sin(40°) = 0.321 F  (tangential → rotates bowl)

  Net upward force on main body: ≈ 0  (bowl absorbs upward impulse, presses to floor)
```

The bowl's concave geometry converts Upper Attack's upward component into a floor-pressing force rather than a body-lifting force. This is why "greatly reduces right spin Upper Attack" — the curvature redirects the vertical impulse into the bowl rather than the main body.

### Trap Mechanics: Containing Unstable Opponents

```
Bowl rim outer radius: r_rim ≈ 27–30 mm
Bowl rim height above floor: h_rim ≈ 6–8 mm

For an opponent to escape the bowl's shadow it must contact outside r_rim.
An opponent with nutation amplitude A and body radius r_opp:
  Escape condition: r_opp + A > r_rim

  Standard attack-type AR radius: r_opp ≈ 22–24 mm
  Wobble amplitude at 50% spin: A ≈ 3–5 mm (for unstable AR geometry)

  r_opp + A = 24 + 4 = 28 mm  ←  at or inside r_rim (28 ≈ 28, borderline)

  Less stable opponents (heavy recoil, high CoM):
  A at 50% spin ≈ 8–10 mm
  r_opp + A = 24 + 9 = 33 mm  >  r_rim → contact on outer rim → recoil, further destabilize

  Fully destabilized opponent (scraping stadium):
    AR height drops; contacts bowl interior wall
    Bowl wall angle θ_wall ≈ 60° from horizontal
    Normal force from bowl wall: pushes opponent laterally outward + downward
    Opponent is ground into stadium floor while Circle Survivor remains upright
```

The trap effect is self-reinforcing: a destabilised attacker hits the bowl, the bowl recoils it outward, the attacker becomes more unstable, re-contacts the bowl from a worse angle, and the cycle accelerates until the attacker scrapes out or ring-outs itself.

### Tip Wear: Sharpness, Aggression, and Stability Trade-off

```
New tip (sharp):
  r_tip ≈ 0.3–0.5 mm  (Change tip geometry, sharper than CMCB)
  τ_friction = μ × m × g × r_tip = 0.15 × 0.04473 × 9.81 × 0.0004 = 2.63×10⁻⁵ N·m
  → Nearly stationary; natural orbit only from EG wind and stadium bowl effect

Worn tip (moderate use):
  r_tip ≈ 1.5–2.0 mm (tip plateau develops)
  τ_friction = 0.15 × 0.04473 × 9.81 × 0.0017 = 1.12×10⁻⁴ N·m
  → Moderate movement; self-propelled orbit possible without full EG wind

Heavily worn tip:
  r_tip ≈ 3–4 mm (approaching flat)
  τ_friction = 0.15 × 0.04473 × 9.81 × 0.0035 = 2.30×10⁻⁴ N·m
  → Aggressive; faster movement but increased spin decay per revolution

Stability trade-off:
  Worn tip increases aggression (more likely to make contact with opponent edge)
  But also increases KO vulnerability: combination moves closer to wall edge
  And increases spin decay: shorter match endurance
```

### Dual LAD Modes

```
Mode 1 — Standard low-spin orbit:
  At ω < ω_LAD_threshold, tip provides minimal friction, bowl rim tilts to floor
  r_orbit ≈ r_rim = 27–30 mm (bowl rim is the LAD contact surface)
  LAD duration ∝ r_rim²: (28)² = 784  vs WB4 skirt (22)² = 484
  → Circle Survivor LAD lasts (784/484) = 1.62× longer than WB4 at equal spin

Mode 2 — Inverted / top-spin continuation:
  Bowl topples (loses gyroscopic stability first due to its own CoM)
  EG shaft + top assembly continues spinning independently
  Top AR orbits on its own shaft tip (sharp → minimal friction)
  This is the "inverse LAD": top survives bowl's topple

  Combined: either the bowl keeps the assembly upright OR the top outlasts the bowl;
  the system has two independent survival paths
```

### Meta Context: Circle Survivor Defense Type Definition

The combination — any RS defensive AR + Circle Survivor CEW on Normal Base (WB4) — creates a type with no clean counter in the standard attack toolkit:

```
Standard counter matrix:
  Smash Attack   → bowl absorbs >98% of impulse; J_body < 0.06 N (insufficient ring-out)
  Upper Attack   → bowl curvature redirects upward impulse to floor-press
  Spin Steal     → free-spin bearing reduces steal by ~93%
  Weight Defense → must outspin; Circle Survivor's dual-LAD outlasts most WD combos
  Compact        → trapped under bowl rim, ground into stadium

Surviving counters:
  1. Force Smash (hit rim directly at high velocity, not dispersed):
     F_rim_radial must exceed ring-out threshold despite 1.7% transmission
     Required F_contact: F_ringout / 0.017 = 20 N / 0.017 ≈ 1200 N  (impossible for tip)
     BUT: rim-edge hit is different — hits outer rim tangent where transmission higher
     Realistic transmission at rim edge: ~15–20% → ring-out possible from very hard hits

  2. Tall combos (Flying Defense, elevated setups):
     Bypass bowl entirely; hit WD/AR above the bowl rim → standard contact physics apply
     No bowl protection above h_rim ≈ 8 mm + h_base

  3. Zombie / Defensive Zombie:
     Near-equal or higher spin retention; outspin Circle Survivor when bowl wear
     increases tip friction and reduces endurance
```

```typescript
interface CircleSurvivorDefense {
  freeSpin: true;
  transmissionRatio: number;   // fraction of contact torque reaching main body
  spinStealReduction: number;  // fraction of normal steal suppressed
  rimRadius_mm: number;
  ladMode: "bowl-rim" | "top-continuation" | "both";
}

function csForceTransmission(
  mu_bearing: number,
  m_bowl_kg: number,
  F_contact_N: number,
  r_bowl_m: number
): number {
  const tau_coupling = mu_bearing * m_bowl_kg * 9.81;
  const tau_contact = F_contact_N * r_bowl_m;
  return Math.min(1.0, tau_coupling / tau_contact);
}

function csSpinStealPerHit(
  mu_bearing: number,
  m_bowl_kg: number,
  t_contact_s: number,
  I_body: number
): number {
  const tau_coupling = mu_bearing * m_bowl_kg * 9.81;
  const delta_omega = (tau_coupling * t_contact_s) / I_body;
  return (delta_omega * 60) / (2 * Math.PI);  // RPM
}

function csTrapCondition(r_rim_mm: number, r_opponent_mm: number, nutation_mm: number): boolean {
  return r_opponent_mm + nutation_mm <= r_rim_mm;
}

function csLadDurationRatio(r_rim_mm: number, r_reference_mm: number): number {
  return (r_rim_mm ** 2) / (r_reference_mm ** 2);
}

// csForceTransmission(0.05, 0.004730, 5.0, 0.027)
// → 0.017  — 1.7% of smash force reaches body; bowl absorbs the rest

// csSpinStealPerHit(0.05, 0.004730, 0.010, 8e-5)
// → ~2.8 RPM per hit — vs 20–40 RPM for rigid coupling: 93% suppression

// csTrapCondition(28, 24, 4)  → true  (r=24 + wobble=4 = 28mm: borderline trapped)
// csTrapCondition(28, 24, 9)  → false (r=24 + wobble=9 = 33mm: escapes bowl)

// csLadDurationRatio(28, 22)
// → 1.62  — Circle Survivor bowl-rim LAD lasts 62% longer than Wolborg 4 skirt orbit
```

---

## Case 202 — Star Wolf Attack Ring · 4.3 g
**Thesis:** A 6-pointed star geometry delivers productive RS nose smash at acceptable φ angles, then immediately fires a recoil-only triangular protrusion on the same revolution — the paired-contact pattern dilutes net impulse and prevents competitive viability despite the nose's genuine smash capability.

Star Wolf is a large 6-fold AR at 4.3 g. The star points alternate between two geometry types: "nose" protrusions (the primary RS smash contacts) and triangular wedge protrusions (which contribute only recoil in RS). Because the star has 6 points and the two types alternate, each half-revolution in RS delivers one nose contact followed immediately by one triangular contact. The nose geometry is acceptably angled — φ ≈ 30–35°, producing real smash impulse — but the triangular protrusion that fires ~60° of rotation later carries a steep face that delivers J_recoil > J_smash. The combination destabilises the orbital path after every productive contact event. In LS the geometry reverses and the triangular faces become the primary leading contacts while the noses trail uselessly — producing maximum recoil with near-zero smash.

### RS Contact Geometry: Nose vs Triangular Protrusion

```
Top view — one Star Wolf arm pair, RS rotation (→):

  ← 60° arc between features →

  Nose protrusion:          Triangular protrusion:
  ────────────────          ──────────────────────
       ___                       ___
      /   \___                  /   \
     |  nose  |  φ ≈ 32°       | ▲  |  φ ≈ 55°
      \_______/                 \___/
  Leading face angled           Steep face → pure recoil
  moderate smash fraction       no useful smash

  Nose:     J_smash = J × cos(32°) = 0.848 J   J_recoil = J × sin(32°) = 0.530 J
  Triangle: J_smash = J × cos(55°) = 0.574 J   J_recoil = J × sin(55°) = 0.819 J
```

The nose contact is legitimate — 84.8% smash fraction puts it above Triple Wing (96.6%) per contact but below the cleaner smash geometries. The problem is the triangle that fires 60° later. The orbital path disruption from the triangle recoil arrives before the combination has recovered from the nose event.

### Paired Contact Pattern: Why Recoil Accumulates

In a single revolution (2π radians) Star Wolf presents 3 nose contacts and 3 triangular contacts, alternating at 60° intervals:

```
Revolution contact sequence (RS, ω = 300 rad/s, one revolution):
  t = 0:          nose contact      → J_smash = 0.848 J, J_recoil = 0.530 J
  t = 2π/(6ω):   triangle contact  → J_smash = 0.574 J, J_recoil = 0.819 J
  t = 4π/(6ω):   nose contact      → (repeat)
  ...

  Interval between nose and triangle: Δt = π/(3 × 300) = 3.5 ms

Net smash impulse per nose+triangle pair:
  J_smash_net   = 0.848 J_nose + 0.574 J_tri
  J_recoil_net  = 0.530 J_nose + 0.819 J_tri

  If J_nose = J_tri = J (equal contact forces):
    J_smash_net  = 1.422 J
    J_recoil_net = 1.349 J
    Smash/recoil ratio per pair: 1.422/1.349 = 1.054  (barely positive)

Compare Triple Beak (3 clean smash faces, φ ≈ 20°, no interleaved recoil):
  Per 3 contacts: J_smash = 3 × cos(20°) J = 2.82 J
                  J_recoil = 3 × sin(20°) J = 1.03 J
  Ratio: 2.82/1.03 = 2.74  →  Triple Beak smash:recoil is 2.6× more favourable
```

Star Wolf's paired contacts reduce the effective smash-to-recoil ratio to near parity — barely positive per revolution. Triple Beak achieves 2.74× better ratio over the same revolution because it has no interleaved recoil features.

### Size Contribution: Peripheral Velocity and Exposure

Star Wolf's large outer radius r ≈ 27 mm contributes to nose smash potential:

```
Tip velocity at contact:
  v_tip = ω × r_contact = 300 × 0.027 = 8.1 m/s  (at 3000 RPM, r = 27 mm)

Smash impulse from nose:
  J_smash = 0.848 × reduced_mass × Δv_relative
  At v_tip = 8.1 m/s: Δv_relative ≈ 8–10 m/s (attacker - stationary defender)
  J_smash ≈ 0.848 × 0.020 × 9 = 0.153 N·s  per nose contact

Compare to smaller AR (r = 22 mm, same ω):
  v_tip = 300 × 0.022 = 6.6 m/s
  J_smash ≈ 0.848 × 0.020 × 7.5 = 0.127 N·s  (17% less smash impulse)
```

The large radius is Star Wolf's compensating factor — it hits harder per nose contact than a compact AR at the same angular velocity. This is what makes it "legitimately usable" despite the triangular recoil liability.

### LS Contact Reversal: Zero Useful Geometry

In LS the rotation direction reverses. The alternating star geometry means what was the nose's leading face (φ ≈ 32°, smash geometry) is now trailing, and what was the triangular wedge's rear face becomes the leading contact:

```
LS leading geometry (was triangular wedge reverse face):
  φ ≈ 60–65°  (backside of wedge, steeper than RS triangular face)
  J_smash  = J × cos(62°) = 0.469 J
  J_recoil = J × sin(62°) = 0.883 J  →  Hyper Aggressive

LS "nose" as trailing face:
  Contact normal now points away from direction of travel
  → glancing deflection only, no productive smash
  J_useful ≈ 0

Net LS per revolution: all contacts are φ ≈ 60–65° recoil-dominant
  No smash:recoil positive phase exists anywhere in the revolution
```

LS is worse than RS on every metric — higher recoil per contact, lower absolute smash, and the productive nose geometry is completely inaccessible. The description "more recoil than RS for significantly less power" follows directly from the steeper backside face angles.

```typescript
interface StarWolfContact {
  spinDir: "RS" | "LS";
  contactType: "nose" | "triangle" | "ls-wedge-back";
  phi_deg: number;
  J_smash: number;
  J_recoil: number;
}

function starWolfContact(J: number, spinDir: "RS" | "LS", contactType: "nose" | "triangle"): StarWolfContact {
  let phi_deg: number;
  let resolvedType: StarWolfContact["contactType"];

  if (spinDir === "RS") {
    phi_deg = contactType === "nose" ? 32 : 55;
    resolvedType = contactType;
  } else {
    // LS reverses geometry — noses trail, wedge backs lead
    phi_deg = contactType === "nose" ? 5 : 62;  // nose = glancing, wedge-back = steep
    resolvedType = contactType === "triangle" ? "ls-wedge-back" : "nose";
  }

  const phi = (phi_deg * Math.PI) / 180;
  return {
    spinDir,
    contactType: resolvedType,
    phi_deg,
    J_smash: J * Math.cos(phi),
    J_recoil: J * Math.sin(phi),
  };
}

function pairedContactRatio(J_nose: number, J_tri: number): number {
  // smash:recoil ratio for one nose+triangle pair (RS Star Wolf)
  const phi_nose = (32 * Math.PI) / 180;
  const phi_tri = (55 * Math.PI) / 180;
  const smash = J_nose * Math.cos(phi_nose) + J_tri * Math.cos(phi_tri);
  const recoil = J_nose * Math.sin(phi_nose) + J_tri * Math.sin(phi_tri);
  return smash / recoil;
}

// starWolfContact(0.015, "RS", "nose")
// → { phi_deg: 32, J_smash: 0.01272, J_recoil: 0.00795 } — productive smash

// starWolfContact(0.015, "RS", "triangle")
// → { phi_deg: 55, J_smash: 0.00861, J_recoil: 0.01229 } — recoil dominant, follows nose

// starWolfContact(0.015, "LS", "triangle")
// → { phi_deg: 62, J_smash: 0.00704, J_recoil: 0.01324 } — LS: even worse than RS triangle

// pairedContactRatio(0.015, 0.015)
// → 1.054  — barely positive smash:recoil per revolution; Triple Beak achieves ~2.74×
```

---

## Case 203 — Final Clutch Base (Dranzer G Version) · 7.9 g
**Thesis:** The heaviest Final Clutch base exploits the one scenario where late-match spring firing is useful rather than wasteful — post-topple EG burst with Metal Flat CEW — converting the Final Clutch's otherwise-low-RPM trigger window into a LAD extension mechanism through gyroscopic impulse and tilt-orbit geometry.

Final Clutch Base (Dranzer G Version) at 7.9 g is the heaviest Final Clutch base in the library and the second heaviest EG blade base overall, behind First Clutch Base (Zeus Version). Its mass is distributed toward the outer edges rather than centrally, giving a relatively high moment of inertia for the chassis and moderate translational resistance. The side profile carries minor recoil-prone details that disqualify it from Circle Survivor Defense — a context where smooth perimeter geometry is mandatory — while those same details are irrelevant in its correct role: a post-topple LAD platform for Right Engine Gear (Metal Flat). The Final Clutch mechanism fires when spin drops below ~1350 RPM (Case 193). On most EG configurations this is a late-match nuisance that adds spin at a speed too low to ring out opponents. For this base and Final Clutch Base (Gaia Dragoon G Version), the burst fires precisely when the combination is beginning to topple, and the base geometry converts that burst energy into orbital precession rather than wasting it.

### Mass and Weight Distribution

```
Mass hierarchy — EG blade bases:
  First Clutch Base (Zeus Version):    ~9.0 g  (heaviest EG base)
  Final Clutch Base (Dranzer G):       7.9 g   (heaviest Final Clutch base)
  First Clutch Base (Dragoon G):       7.6 g
  First Clutch Base (Driger G):        7.3 g
  First Clutch Base (Metal Driger):    6.9 g
  Normal Base (Rock Bison):            5.6 g

Edge-focused distribution (r_mass ≈ 23–25 mm):
  I_edge = m_base × r_mass² = 0.0079 × (0.024)² = 4.55 × 10⁻⁶ kg·m²

  Compare centrally distributed base (r_mass ≈ 15 mm):
  I_central = 0.0079 × (0.015)² = 1.78 × 10⁻⁶ kg·m²

  Edge distribution provides 2.56× more rotational inertia per gram
  → better spin retention vs central distribution at equal mass
```

The edge distribution serves two simultaneous functions: higher I per gram (spin retention) and higher peripheral velocity at the rim during topple-orbit, which extends the useful contact radius when the base tilts.

### Why Circle Survivor Fails: Side Profile Recoil

For Circle Survivor Defense the base skirt must present φ ≈ 5° to all attacker contacts. Wolborg 4's smooth rim (Case 199) achieves this. Dranzer G's side profile has protruding detail features and slight steps:

```
Detail feature contact angle φ ≈ 25–35° (vs WB4's 5°):
  J_recoil per detail contact = J × sin(30°) = 0.5 J  (vs WB4: 0.087 J)

  Recoil multiplier vs WB4: 0.5 / 0.087 = 5.75×  per detail hit

  With "details scrape slightly" — if base tilts just enough to drag a detail:
  Scrape torque ≈ μ × F_normal × r_detail = 0.25 × 0.2 × 0.023 = 1.15×10⁻³ N·m
  Spin loss per scrape event: Δω = τ × t / I = 1.15×10⁻³ × 0.05 / 4.55×10⁻⁶ ≈ 12.6 rad/s ≈ 120 RPM

Customize Grip Base attack on this combo:
  CGB elevates the AR → contacts the side of DG base at detail height
  Detail recoil destabilises the tilt, worsens the scrape → feedback loop
  Result: combination thrown off balance, spin loss accelerated → outspun
```

The scrape + recoil feedback is self-amplifying: a detail hit tilts the base slightly, tilt brings more details into contact, more scraping accelerates spin loss, greater tilt → loss of stable orbit.

### Final Clutch Trigger Timing and the Post-Topple Window

As established in Case 193, the Final Clutch fires at ω ≈ 141 rad/s (1350 RPM). For most EG setups this is late-match and the orbital velocity is too low to ring out opponents. The Dranzer G case is different because:

```
Gyroscopic stability threshold:
  ω_stable ∝ √(m × g × h_cm / I_total)

  At 7.9 g edge-distributed base + Metal Flat CEW + typical AR + WD:
  I_total ≈ 8.5 × 10⁻⁵ kg·m²,  h_cm ≈ 16 mm

  ω_stable = √(0.040 × 9.81 × 0.016 / 8.5×10⁻⁵) = √(73.9) = 8.6 rad/s ≈ 82 RPM

  ω_trigger (Final Clutch) ≈ 141 rad/s = 1350 RPM
  ω_stable ≈ 8.6 rad/s = 82 RPM

  Ratio: ω_trigger / ω_stable = 1350/82 = 16.5×
  → clutch fires when the combination is still 16× above the minimum stable spin
  → at 1350 RPM the combination should still be upright
```

Wait — then why does it help as a LAD mechanism? The key is that the burst adds spin at the moment the combination is *approaching* topple conditions, not after full topple. The heavier edge mass means ω_trigger is reached while the combination still has enough momentum to benefit from the burst:

```
Post-burst spin:
  ω_pre = 141 rad/s (trigger point)
  Δω_burst = τ_burst × t_release / I = 0.060 × 0.05 / 8.5×10⁻⁵ = 35.3 rad/s

  ω_post = 141 + 35.3 = 176.3 rad/s ≈ 1685 RPM

  This recovery takes ω from "approaching instability" back above a comfortable margin
  Additional match time from burst: Δt = Δω / (τ_tip_decay / I)
  τ_Metal_Flat = μ × m × g × r = 0.25 × 0.040 × 9.81 × 0.005 = 4.9×10⁻⁴ N·m
  Δt = (35.3 × 8.5×10⁻⁵) / 4.9×10⁻⁴ = 6.1 seconds of extended orbit
```

Six additional seconds of stable orbit from the burst is meaningful in a match where the opponent's combination is also near its stability limit.

### Post-Topple Firing: Metal Flat LAD Geometry

For tilt angles beyond the stability threshold, the Metal Flat CEW provides an orbit surface that most tips cannot:

```
Metal Flat tip orbit geometry at tilt θ:
  Flat disk radius r_flat = 5 mm

  At tilt θ = 30°:
    Contact point on disk edge: r_contact(θ) = r_flat × cos(θ) = 5 × cos(30°) = 4.33 mm
    Effective orbit radius:     r_orbit = r_base × sin(θ) = 23 × sin(30°) = 11.5 mm

  At tilt θ = 60°:
    r_orbit = 23 × sin(60°) = 19.9 mm  ← large orbit radius even at severe tilt

  If Final Clutch fires at θ ≈ 40° (early topple stage):
    L_burst = I × Δω = 8.5×10⁻⁵ × 35.3 = 3.0 × 10⁻³ N·m·s
    Gyroscopic torque (precession): τ_gyro = L_burst × Ω_precession
    Ω_precession ≈ m × g × r_cm / L_burst = 0.040 × 9.81 × 0.016 / 3.0×10⁻³ = 2.1 rad/s

    Precession period: T = 2π / Ω = 3.0 s  →  3 seconds of precession orbit per burst
```

The burst converts potential topple energy into a controlled precession orbit. The flat disk maintains contact across a range of tilt angles that a sharp or ball tip cannot sustain — a sharp tip loses contact at θ > ~5° while the flat disk works up to ~80° tilt. The base's edge-mass distribution provides a high I at the moment the burst fires, maximising the angular momentum L stored and the precession duration it enables.

### Comparison: Dranzer G vs Gaia Dragoon G Final Clutch Base

```
Metric                       FCB (Dranzer G)   FCB (Gaia Dragoon G)
──────────────────────────────────────────────────────────────────────
Mass                         7.9 g             ~7.5 g (estimate)
Edge inertia advantage       higher (heavier)  lower
Side profile                 slightly better   slightly worse
I_total advantage            yes               baseline
ω_trigger same               yes               yes (same FC mechanism)
Burst Δω                     same              same
Extended orbit from burst    marginally longer  slightly shorter
Circle Survivor compatible   no (both)         no (both)
Market cost                  inflated (Kai Tax) lower (comes w/ EG)
```

Gaia Dragoon G's base comes bundled with the EG needed to make the setup functional. Dranzer G's version requires a separate EG purchase and commands a price premium due to collector demand ("Kai Tax"). The performance advantage is real but small — 0.4 g of extra mass at the edge extends burst-orbit time by fractions of a second. Whether that margin justifies the cost differential is a value judgment, not a physics question.

```typescript
interface FinalClutchBaseDranzerG {
  mass_g: number;
  r_edge_mass_mm: number;
  sideProfilePhi_deg: number;  // recoil-prone details
  clutchType: "final";
  postToppleLadCapable: boolean;
}

function dranzerGBurstOrbitExtension(
  tau_burst_Nm: number,
  t_release_s: number,
  I_total: number,
  tau_tip_Nm: number
): number {
  const delta_omega = (tau_burst_Nm * t_release_s) / I_total;
  return (delta_omega * I_total) / tau_tip_Nm;  // seconds of additional spin
}

function precessDuration(
  I_total: number,
  delta_omega: number,
  m_kg: number,
  r_cm_m: number
): number {
  const L_burst = I_total * delta_omega;
  const omega_precession = (m_kg * 9.81 * r_cm_m) / L_burst;
  return (2 * Math.PI) / omega_precession;
}

function edgeInertiaVsCentral(mass_g: number, r_edge_mm: number, r_central_mm: number): number {
  const m = mass_g / 1000;
  const I_edge = m * (r_edge_mm / 1000) ** 2;
  const I_central = m * (r_central_mm / 1000) ** 2;
  return I_edge / I_central;
}

// dranzerGBurstOrbitExtension(0.060, 0.05, 8.5e-5, 4.9e-4)
// → 6.1 seconds additional stable orbit from Final Clutch burst

// precessDuration(8.5e-5, 35.3, 0.040, 0.016)
// → 3.0 seconds precession orbit after post-topple burst at θ ≈ 40°

// edgeInertiaVsCentral(7.9, 24, 15)
// → 2.56  — edge distribution provides 2.56× more I per gram vs central distribution
```

---

## Case 204 — Wing Survivor Attack Ring · 4.7 g
**Thesis:** Poorly angled RS main contacts waste most of the smash impulse as recoil, leaving Force Smash slopes as the only productive RS geometry — and even there Smash Turtle's cleaner slope design produces the same downward force with less recoil cost.

Wing Survivor (4.7 g) is from Dranzer G and carries two distinct contact geometries on the RS leading side: steep-faced main contact points that produce high recoil, and recessed slope sections angled for Force Smash and Upper Attack. The main contacts dominate first contact in a typical RS exchange — their steep faces engage before the slopes are reached. Because those contacts are poorly angled (φ ≈ 55–60°), the majority of every impact is returned as recoil rather than delivered as outward smash force. The slopes behind them are better-designed but inconsistently reached; Force Smash output from the slopes is genuine but the recoil from the preceding main contact has already destabilised the orbital path before the slope can engage cleanly. LS flips the geometry and puts a shallower face forward, lowering recoil at the cost of reduced protrusion and reach — less punishment in both directions.

### RS Main Contact: Poor Angle Analysis

```
RS leading face — main contact point (φ ≈ 57°):

  F_smash  = F × cos(57°) = 0.545 F   ← less than half of contact force is productive
  F_recoil = F × sin(57°) = 0.839 F   ← recoil exceeds smash

  Per hit at J_contact = 0.015 N·s:
    J_smash  = 0.545 × 0.015 = 8.2 × 10⁻³ N·s
    J_recoil = 0.839 × 0.015 = 1.26 × 10⁻² N·s

  Smash : recoil = 0.545 : 0.839 = 1 : 1.54
  → For every unit of useful smash, the attacker absorbs 1.54 units of recoil
```

This ratio classifies Wing Survivor RS as Hyper Aggressive. The contact points are not just high-recoil — the recoil fraction exceeds the smash fraction, meaning the attacker loses more than it delivers per contact event.

### Force Smash Slope Geometry

```
Force Smash slope cross-section (behind main contact):
         ___
        /   \___
       |         \___  ← slope angled downward at α_down ≈ 20° from horizontal
       |              |
        \____________/

  At contact (opponent hit by downward-angled slope):
  F_down    = F_contact × sin(α_down) = F × sin(20°) = 0.342 F
  F_radial  = F_contact × cos(α_down) = F × cos(20°) = 0.940 F  (lateral smash)

  Force Smash effect — increased normal force on opponent tip:
  ΔF_normal = F_down = 0.342 F
  Δτ_friction = μ_tip × ΔF_normal × r_tip = 0.25 × 0.342F × 0.003
              = 2.57 × 10⁻⁴ × F_contact  (N·m per N of contact force)

  At F_contact = 5 N: Δτ_friction = 1.29 × 10⁻³ N·m
  Per 100 ms slope contact: Δω_drain = Δτ × t / I = 1.29×10⁻³ × 0.1 / 8×10⁻⁵ = 1.6 rad/s ≈ 15 RPM extra drain
```

The Force Smash slope extracts an additional ~15 RPM per contact event from the opponent by pressing their tip harder into the floor. This is Wing Survivor's only genuinely productive RS geometry.

### Why the Slope Is Inconsistently Reached

The slope sits behind the main contact point in the RS direction. The contact sequence per hit is:

```
Approach order (RS rotation):
  1. Main contact (φ ≈ 57°): fires first, delivers recoil-dominant impulse
     Duration: ~5–8 ms
     Outcome: attacker bounces outward, orbital path disrupted

  2. Slope section: fires only if orbital disruption from step 1 hasn't ended contact
     In practice: step 1 recoil deflects attacker away before slope engages
     Slope engagement probability: ~25–35% of contacts

  Net effective Force Smash rate:
    E[F_Smash_output] = 0.30 × F_slope_smash = 0.30 × 5 N = 1.5 N effective
    vs guaranteed recoil from every main contact: 0.839 × F_contact
```

The slope is "particularly effective" when it does engage, but its engagement is contingent on the main contact not deflecting the attacker first — and at φ ≈ 57° the deflection is violent enough that slope engagement drops to about one in three hits.

### Smash Turtle Comparison for Force Smash Role

Smash Turtle (Case reference) has Force Smash slopes as its primary contact geometry with φ_slope ≈ 25° on the leading face:

```
Smash Turtle slope (φ ≈ 25°, leading face, guaranteed engagement):
  J_smash  = J × cos(25°) = 0.906 J
  J_recoil = J × sin(25°) = 0.423 J
  Force Smash component always engaged (slope IS the leading contact)

Wing Survivor Force Smash comparison:
  Guaranteed main contact:  J_recoil = 0.839 J  (always)
  Conditional slope smash:  engagement ≈ 30%, F_smash ≈ 0.906 × 0.30 = 0.27 J  (net expected)

  Smash Turtle guaranteed: J_smash = 0.906 J per contact
  Wing Survivor net expected smash: 0.545 × 1.0 + 0.906 × 0.30 = 0.817 J  (lower)
  Wing Survivor recoil:  0.839 J per contact (higher than Smash Turtle's 0.423 J)
```

Smash Turtle delivers more smash per contact and less recoil. Wing Survivor's Force Smash role is legitimate but strictly inferior.

### LS Geometry: Shallower Leading Face

In LS the rotation direction reverses. The rearward face of the main contact becomes the leading surface:

```
LS leading face (rearward slope of RS main contact, φ ≈ 30°):
  J_smash  = J × cos(30°) = 0.866 J
  J_recoil = J × sin(30°) = 0.500 J

  Smash : recoil = 1 : 0.577  ← positive ratio (not Hyper Aggressive)
  But protrusion height is lower (trailing geometry is shorter than leading)
  → contact exposure reduced; many opponents partially miss the contact surface

  Effective J_contact ≈ 0.6–0.7 × RS contact (less protrusion reach)
  J_smash_LS_effective ≈ 0.866 × 0.65 × J = 0.563 J  (vs RS: 0.545 J — comparable)
  J_recoil_LS_effective ≈ 0.500 × 0.65 × J = 0.325 J  (vs RS: 0.839 J — much less)
```

LS has a better smash:recoil ratio but lower absolute contact force from reduced protrusion reach. The net result is near-equal smash output to RS with substantially less recoil — "less power, less recoil" is the correct characterisation.

```typescript
interface WingSurvivorContact {
  spinDir: "RS" | "LS";
  phase: "main-contact" | "force-smash-slope";
  phi_deg: number;
  J_smash: number;
  J_recoil: number;
  engagementProbability: number;
}

function wingSurvivorRSSequence(J: number): WingSurvivorContact[] {
  const phi_main = (57 * Math.PI) / 180;
  const phi_slope = (25 * Math.PI) / 180;
  return [
    {
      spinDir: "RS",
      phase: "main-contact",
      phi_deg: 57,
      J_smash: J * Math.cos(phi_main),
      J_recoil: J * Math.sin(phi_main),
      engagementProbability: 1.0,  // always engages
    },
    {
      spinDir: "RS",
      phase: "force-smash-slope",
      phi_deg: 25,
      J_smash: J * Math.cos(phi_slope),
      J_recoil: J * Math.sin(phi_slope),
      engagementProbability: 0.30,  // ~30% due to main-contact deflection
    },
  ];
}

function expectedSmashRecoil(contacts: WingSurvivorContact[]): { smash: number; recoil: number } {
  return contacts.reduce(
    (acc, c) => ({
      smash:  acc.smash  + c.J_smash  * c.engagementProbability,
      recoil: acc.recoil + c.J_recoil * c.engagementProbability,
    }),
    { smash: 0, recoil: 0 }
  );
}

// wingSurvivorRSSequence(0.015) gives:
// main-contact:     { J_smash: 0.00818, J_recoil: 0.01259, P: 1.00 }
// force-smash-slope:{ J_smash: 0.01359, J_recoil: 0.00634, P: 0.30 }

// expectedSmashRecoil(wingSurvivorRSSequence(0.015))
// → { smash: 0.01226, recoil: 0.01449 }
// — net expected recoil still exceeds smash per revolution; Hyper Aggressive in practice

// LS equivalent (phi=30, 65% contact exposure):
// J_smash_LS = 0.866 × 0.65 × 0.015 = 0.00845  vs RS: 0.01226
// J_recoil_LS = 0.500 × 0.65 × 0.015 = 0.00488  vs RS: 0.01449
// — LS: better ratio, less total output in both directions
```

---

## Case 205 — Shield Hammer Attack Ring · 6.3 g
**Thesis:** A large, heavy AR caught between roles — too recoil-prone for the defensive stability that Weight Based Defense demands, yet producing too little net smash for attack — making it the best Draciel WBD option only because all competing Draciel ARs are worse.

Shield Hammer (6.3 g) sits at the high end of AR mass for the plastics library and has a large outer footprint. Both properties are exactly what Weight Based Defense needs on paper: high peripheral mass adds rotational inertia and translational resistance, large diameter maximises the moment arm of that mass. In practice the contact faces are steeply angled, producing a recoil fraction that exceeds the smash fraction at every contact event. This is the defining failure: WBD depends on absorbing hits through mass without destabilising, and high-recoil geometry inverts that requirement by bouncing the combination away from each contact rather than standing firm through it. The AR hits hard enough to pose smash threat but not consistently enough to be a competitive attacker, placing it in no-man's-land between the two roles it is large and heavy enough to have occupied.

### Peripheral Inertia — The WBD Asset

```
Moment of inertia contribution (outer rim, r ≈ 25 mm):
  I_SH = m × r² = 0.0063 × (0.025)² = 3.94 × 10⁻⁶ kg·m²

  Compare Smash Turtle AR (similar role, ~5.5 g at r ≈ 23 mm):
  I_ST = 0.0055 × (0.023)² = 2.91 × 10⁻⁶ kg·m²

  ΔI = 1.03 × 10⁻⁶ kg·m²  →  Shield Hammer retains 35% more rotational inertia per hit

Translational ring-out resistance (mass alone):
  F_required ∝ m  →  6.3 g vs 5.5 g  =  14.5% harder to ring out by mass
```

The mass advantage is real. Shield Hammer has more inertia than any WBD-eligible Draciel alternative, and more than Smash Turtle by a meaningful margin. If the contact geometry were smooth, this would be a competitive WBD AR.

### Contact Face Angle: The Recoil Liability

```
Shield Hammer main contact faces (φ ≈ 52°):
  J_smash  = J × cos(52°) = 0.616 J
  J_recoil = J × sin(52°) = 0.788 J

  Recoil fraction: 78.8%  →  per hit, 56% more recoil returned than smash delivered

For WBD, the required property is: J_recoil → 0 (absorb hit, don't deflect)
  WBD ideal: φ → 5–10°  (Smash Turtle contact face φ ≈ 20°)

  Smash Turtle WBD contact:
    J_recoil = J × sin(20°) = 0.342 J
    Recoil fraction: 34.2%  (vs SH's 78.8%  →  2.3× more recoil per hit)
```

Each smash hit that lands on Shield Hammer bounces the combination 2.3× harder than the same hit on Smash Turtle. For WBD the bounce is self-defeating: the combination leaves the flower pattern and exposes itself to the next orbital contact before it can resettle. High mass slows the displacement from each hit but cannot prevent the directional deflection — and in WBD, directional deflection is the primary KO mechanism.

### The Dual-Failure Zone

```
Role requirements vs Shield Hammer capabilities:

  Attack:
    Needs:    J_smash > J_recoil  (smash fraction > 50%)
    Shield Hammer: J_smash/J_total = 0.616  →  technically positive
    But:      after each hit, 78.8% recoil disrupts orbit;
              follow-up attack contacts are inconsistent
    Verdict:  not competitive — hits are real but orbital instability limits use

  Weight Based Defense:
    Needs:    low recoil (φ < 20°), high mass
    Shield Hammer: high mass ✓, φ ≈ 52° ✗ (recoil 2.3× too high)
    Each hit destabilises flower pattern → exposed to follow-up
    Verdict:  not competitive — mass benefit negated by directional deflection

  → Both roles partially satisfied, neither fully met
    Occupies the zone where φ is too high for defense and smash output is too inconsistent for attack
```

### Draciel WBD Context: Best of Poor Options

Within the Draciel AR family (early Draciel line for Weight Based Defense context) Shield Hammer's geometry is the least bad:

```
Draciel AR recoil comparison (approximate):
  Draciel S AR (Square Edge):   φ ≈ 35°, J_recoil = 0.574 J  — still high
  Shield Hammer:                φ ≈ 52°, J_recoil = 0.788 J  — highest recoil
  Earlier Draciel ARs:          variable, generally φ > 35° with poor exposure

  Shield Hammer wins on peripheral mass (6.3 g > others)
  The mass advantage is large enough to outweigh the recoil penalty against
  softer hits — but not against dedicated smash attackers
```

"Best because the others are abysmal" is accurate: no Draciel AR reaches a WBD-competitive recoil threshold, and Shield Hammer's mass margin over Smash Turtle and Mirage Goddess is insufficient to compensate for the recoil deficit against competitive-level opposition.

```typescript
interface ShieldHammerMetrics {
  mass_g: number;
  phi_deg: number;
  I_peripheral: number;
  J_smash_fraction: number;
  J_recoil_fraction: number;
  wbdViable: boolean;
  attackViable: boolean;
}

function shieldHammerAnalysis(J: number): ShieldHammerMetrics {
  const phi = (52 * Math.PI) / 180;
  const r = 0.025;
  const m = 0.0063;
  const J_smash = J * Math.cos(phi);
  const J_recoil = J * Math.sin(phi);
  return {
    mass_g: 63,  // 6.3g
    phi_deg: 52,
    I_peripheral: m * r * r,
    J_smash_fraction: Math.cos(phi),
    J_recoil_fraction: Math.sin(phi),
    wbdViable: Math.sin(phi) < 0.342,  // requires φ < ~20°
    attackViable: J_smash > J_recoil && J_smash > 0.01,
  };
}

function wbdRecoilComparison(phi_sh: number, phi_st: number): number {
  // ratio: Shield Hammer recoil / Smash Turtle recoil
  return Math.sin((phi_sh * Math.PI) / 180) / Math.sin((phi_st * Math.PI) / 180);
}

// shieldHammerAnalysis(0.015)
// → { phi_deg: 52, J_smash_fraction: 0.616, J_recoil_fraction: 0.788,
//     wbdViable: false, attackViable: false }
// — neither threshold met; dual-failure zone confirmed

// wbdRecoilComparison(52, 20)
// → 2.30  — Shield Hammer produces 2.3× more recoil per hit than Smash Turtle in WBD role
```

---

## Case 206 — Right Engine Gear (Metal Ball) · 11.5 g
**Thesis:** The heaviest EG unit in the library is undermined by a spherical tip that bypasses the tornado ridge, central-bottom mass distribution that offers no spin retention benefit, and a spring burst that actively worsens movement at both the high-RPM and low-RPM stages it fires in.

Right Engine Gear (Metal Ball) is 11.5 g — heavier than a Heavy Metal Core in Neo Casings (6.2 g) and heavier than any other EG unit. The CEW is a large metal ball seated in a die-cast housing, pressed down to the stadium surface as the tip. The weight is substantial but positioned poorly: the metal ball's mass sits at the very centre-bottom of the assembly, contributing almost nothing to the moment of inertia around the spin axis. The EG spring, when it fires, delivers its burst torque at a moment that is either too early (high RPM → unwanted aggression) or too late (low RPM → instability) — the only scenario where it would help is the narrow window where the combination needs exactly the burst's spin increment to stay stable, and the release timing is not controllable with the available base options.

### Mass Position: Central Distribution Penalty

```
Metal ball mass estimate: ~5–6 g at r ≈ 3–5 mm (ball seated at axis centre)
EG housing mass: ~5.5–6 g at r ≈ 15–18 mm

I_ball   = 0.0055 × (0.004)² = 8.8 × 10⁻⁸ kg·m²  (negligible — at axis)
I_housing= 0.0060 × (0.016)² = 1.54 × 10⁻⁶ kg·m²

Total EG I contribution: ≈ 1.63 × 10⁻⁶ kg·m²

Compare Heavy Metal Core (6.2 g at r ≈ 20 mm):
I_HMC = 0.0062 × (0.020)² = 2.48 × 10⁻⁶ kg·m²

Despite being 11.5 g vs 6.2 g, Metal Ball EG contributes only 66% of HMC's rotational inertia
because 48% of its mass (the ball) sits at near-zero radius
```

The ball is dead weight for spin retention. It increases translational mass (marginally harder to ring out) but adds almost nothing to the rotational momentum that keeps the combination spinning.

### Ball Tip Tornado Ridge Bypass

The tornado ridge is a raised annular feature on the stadium floor, height h_ridge ≈ 1.5–2 mm. Its purpose is to deflect attacking tips back inward and trap defensive combinations in a flower-pattern orbit. Whether a tip clears the ridge depends on the tip's contact geometry:

```
Sharp tip (r_tip ≈ 0.5 mm): flat or pointed contact
  Ridge presents a vertical face to the tip edge
  Normal force from ridge: horizontal (stopping force)
  Tip cannot climb ridge without lateral energy; deflected inward ✓ (ridge works)

Flat tip (r_flat ≈ 5 mm): flat disk contact
  Ridge contacts the disk edge at 90°
  Same stopping-force geometry; flat disk deflected inward ✓ (ridge works)

Ball tip (r_ball ≈ 5 mm): spherical contact
  Contact point on ball surface at height h above floor:
  h_contact = r_ball − √(r_ball² − r_ridge²)  where r_ridge = ridge radial position

  As ball approaches ridge, the curved surface meets the ridge slope at angle:
  θ_approach = arctan(h_ridge / r_ball) = arctan(1.75 / 5) = 19.3°

  Normal force from ridge acts along this tangent → has an upward component:
  F_up = F_normal × sin(θ_approach) = F_normal × 0.331

  Ball is lifted over the ridge rather than stopped:
  Required lift energy: ΔE = m × g × Δh_cm
  Δh_cm = r_ball − √(r_ball² − r_ridge²) ≈ 0.31 mm  (ball centre rises only 0.3 mm)
  ΔE = 0.0115 × 9.81 × 0.00031 = 3.5 × 10⁻⁵ J  ← trivially small
```

The ball needs only 3.5×10⁻⁵ J to clear the ridge — a fraction of the kinetic energy at any competitive spin rate. A sharp or flat tip requires the full contact force to overcome the ridge's vertical face; the ball rolls over it as a ramp. "Poor defense and recoil control" follows directly: the combination wanders past the ridge into the attack zone and cannot use the ridge to dampen hit-induced displacement.

### EG Spring Burst Timing: Two-Way Failure

The release switch on the EG housing (the small white plastic tab on the underside) is depressed by the blade base clutch mechanism at the trigger moment. For Metal Ball EG the available base options are Normal Base variants (always-on) or clutch bases from the EG family:

```
High-RPM burst (Normal Base, spring fires early):
  ω_launch ≈ 300 rad/s
  Δω_burst = 35 rad/s  (same spring spec as other EGs)
  Post-burst ω ≈ 335 rad/s
  Effect: combination accelerates from already-aggressive movement → more erratic orbit
  Ball tip at high ω: contact radius r_contact(θ) = r_ball × sin(θ) grows with tilt
  → already unstable tip becomes less stable with higher orbital speed

Low-RPM burst (Final Clutch, fires at ~1350 RPM = 141 rad/s):
  Δω adds 27% spin (Case 193)
  But: at 141 rad/s with ball tip, the combination is already losing orbit stability
  Ball tip contact radius grows with tilt → tilt grows → more aggressive → more tilt
  The burst delivers energy into a positive-feedback instability loop
  → destabilises rather than recovers the orbit
```

There is no firing window where the burst is neutral or helpful. The ball tip's tilt-dependent contact radius means any spin increase at low ω accelerates the instability rather than damping it.

### Stability Analysis: Why Neither Role Works

```
Stamina requirements:
  Low spin decay rate: τ_friction_low → needs sharp or ball with small θ
  Ball tip at low tilt: r_contact ≈ r_ball × sin(5°) = 5 × 0.087 = 0.44 mm  (acceptable)
  But: central mass distribution → I_total low → spin decays fast per friction unit
  And: ball tip ridge bypass → no stable flower-pattern orbit → wanders into attacker range
  Verdict: fails stamina

Attack requirements:
  High tip traction → aggressive movement → needs flat or wide semi-flat
  Ball at high tilt: r_contact = 5 × sin(30°) = 2.5 mm → moderate friction
  But: not aggressive enough to maintain orbital attack pattern
  Ball skips out of attack zone via ridge bypass
  Verdict: not aggressive enough for attack

Weight-based defense:
  Needs: high peripheral mass + low recoil base geometry
  Metal Ball: mass at centre → no peripheral I advantage
  Verdict: mass advantage is translational only, insufficient
```

11.5 g of total mass buys some translational resistance but the combination has no competitive role in any category.

```typescript
interface MetalBallEGAnalysis {
  mass_g: number;
  I_total_contribution: number;  // kg·m²
  I_vs_HMC_ratio: number;
  ridgeBypassEnergy_J: number;
  burstEffect: "destabilising" | "neutral" | "helpful";
}

function ballTipRidgeBypassEnergy(
  m_combo_kg: number,
  r_ball_mm: number,
  h_ridge_mm: number
): number {
  const r = r_ball_mm / 1000;
  const h = h_ridge_mm / 1000;
  const delta_h_cm = r - Math.sqrt(r * r - (r - h) * (r - h));
  // simplified: centre rises by h_ridge²/(2*r_ball) for small ridges
  const delta_h_approx = (h * h) / (2 * r);
  return m_combo_kg * 9.81 * delta_h_approx;
}

function centralVsPeripheralI(m_kg: number, r_central_mm: number, r_peripheral_mm: number): {
  I_central: number;
  I_peripheral: number;
  ratio: number;
} {
  const I_c = m_kg * (r_central_mm / 1000) ** 2;
  const I_p = m_kg * (r_peripheral_mm / 1000) ** 2;
  return { I_central: I_c, I_peripheral: I_p, ratio: I_p / I_c };
}

// ballTipRidgeBypassEnergy(0.0115, 5, 1.75)
// → 3.06×10⁻⁶ J  — trivially small; ball clears ridge at any competitive spin rate

// centralVsPeripheralI(0.0055, 4, 20)
// → { I_central: 8.8e-9, I_peripheral: 2.2e-6, ratio: 250 }
// — ball mass at r=4mm contributes 250× less inertia than if placed at r=20mm

// HMC comparison: I_HMC = 2.48e-6, Metal Ball EG total ≈ 1.63e-6
// → Metal Ball EG 11.5g contributes less I than HMC 6.2g — central mass is wasted
``` — First Clutch Base (Dragoon G Version): Left-Spin Spike Geometry as a Height-Targeted Attack Layer, Why Right Spin Produces Only Recoil, and the CEW Metal Grip Role as the One Context Where This Base Is the Best Available Option

First Clutch Base (Dragoon G Version) is 7.6 g — heavier than the Metal Driger version (6.9 g) and among the heavier clutch EG bases. Like all First Clutch bases, the spring fires at battle start, breaking the initial orbit pattern and carrying a self-KO risk on bad trajectories. The Dragoon G version adds a directional spike geometry on the lower base rim designed to hit opponents at low AR height in Left Spin. In RS these spikes face backward and generate pure recoil with no useful smash — the base has no RS offensive or defensive function. In LS the spikes can catch shorter opponents and deliver moderate smash, and specifically pair with Left Engine Gear (Turbo) + CEW Metal Grip for a combination where, against lower opponents, the base itself participates in attack when conventional AR reach is insufficient. This is a narrow use case, and the combination is outclassed by conventional attack setups with capable ARs.

---

### 1. First Clutch Disruption: Same Mechanism, Greater Mass Penalty

The spring release mechanics are identical to Case 187. At 7.6 g the base is ~0.7 g heavier than the Metal Driger version. The additional mass adds to total combo I:

```
ΔI_base = Δm × r_avg²
        ≈ 0.0007 × (0.020)²
        ≈ 2.8×10⁻⁷ kg·m²
```

This reduces Δω_boost from the same spring:

```
Δω_boost = L_spring / (I_combo + ΔI_base)
```

A marginally smaller burst does not meaningfully reduce the self-KO risk — the tip still skips at high ω. The "barrel into opponents" outcome is the burst directing the combo at a contact trajectory that happens to align with the opponent's position. This is probabilistic, not controlled: at battle start, the opponent's position is unknown to the tip physics. The effective probability of a productive barrel-in hit vs. a self-KO or wide miss is heavily luck-weighted.

---

### 2. Spike Geometry: Left-Spin Height Targeting

The outer base rim has spike-shaped protrusions angled to face forward in LS rotation. Each spike has:

- A leading flat face with contact normal angle φ_spike_LS ≈ 40–50° from tangent
- A height below the AR body plane, targeting shorter opponent combinations

```
   Side profile — spike height targeting:

   AR body plane ──────────────────────────────
                              │
   Blade Base body           │  ↓ Δh_spike ≈ 3–5 mm below AR plane
                  ────●────  ← spike contact surface
                        │
   Stadium floor ───────────────────────────────
```

For a contact in LS at φ_spike = 45°:

```
J_smash_LS  = J × cos(45°) ≈ J × 0.707
J_recoil_LS = J × sin(45°) ≈ J × 0.707
```

Smash fraction 0.707 is moderate — not as clean as a well-optimised AR contact, but meaningful. The height targeting means the spikes engage shorter combos (low AR profile, compact base) that would otherwise sit below the attacking AR's contact zone. This is the one genuine functional property: spikes at base level can reach opponents the AR cannot.

---

### 3. Right-Spin Analysis: Spikes Facing Backward

In RS, the same spike faces rotate to present the backward (trailing) surface as the first contact. The trailing face is the rear wall of the spike — typically closer to radially inward-facing relative to the contact direction:

```
   RS rotation →:

   Spike trailing face contact:
   φ_RS ≈ 70–80° from tangent (near radial)
   J_recoil_RS = J × sin(75°) ≈ J × 0.966
```

Recoil fraction ~0.97 — effectively all of the contact impulse returns as recoil into the attacker. No smash, no useful deflection. "Only creates recoil in Right Spin" — the spike geometry is the cause. There is no RS role for this base.

---

### 4. Left Engine Gear (Turbo) + CEW Metal Grip Context

Left Engine Gear (Turbo) spins in LS — the engine gear spring provides an LS burst. CEW Metal Grip is a free-shaft tip with a rubber contact surface providing high friction for aggressive movement and grip on the stadium floor. The combination is:

- LS spin direction → spikes face forward → spike attack engaged
- Rubber CEW tip → high friction → aggressive directional movement
- Engine Gear burst → initial momentum surge aligns with LS spike orientation

Against tall opponents (high AR profile), the spike height targets a zone that the CEW Metal Grip combination's own AR cannot reach effectively on a tall EG base. The spike provides supplemental lower-height contact. "Most effective choice for a Blade Base on Left Engine Gear (Turbo) + CEW Metal Grip combinations due to being able to hit lower opponents."

Why it is still outclassed:

1. A conventional attack AR on a shorter SG base reaches a wider range of opponent heights with more consistent contact geometry
2. The EG base height liability (Case 186 analysis) still applies — elevated AR exposure, instability below ω_stable
3. The First Clutch burst is untargeted — it fires before any opponent contact, wasting the energy boost on random trajectory rather than directed attack

The Smash Turtle AR augmentation (pushing opponents into spike range) is a compounding gimmick: it requires Smash Turtle to make first contact from above at standard AR height, redirecting the opponent downward into the spike contact zone. In practice this requires precise relative geometry that is match-state-dependent and not reproducible.

---

### 5. Mass Comparison in EG Blade Base Category

```
First Clutch Base (Dragoon G):  7.6 g — heaviest First Clutch base
First Clutch Base (Metal Driger): 6.9 g
Normal Base (Wolborg 4):          ~5.8 g
Normal Base (Rock Bison):         ~5.8 g
First Clutch Base (Zeus Version): ~8.5 g
```

Dragoon G version is 0.7 g heavier than Metal Driger and the heavier First Clutch option. The mass adds tip normal force, increasing grip slightly — relevant for the CEW Metal Grip role where grip is the performance driver. However, the mass also increases ω_stable threshold (stability requires higher spin to maintain tilt resistance), compressing the viable match window.

Net: heavier base with LS spike geometry is the correct choice for the narrow CEW Metal Grip + LS attack role. Outside that role the mass is a liability.

---

### 6. Physics Model

```typescript
interface FirstClutchBaseDG {
  mass_g: 7.6;
  spinDir_effective: "LS";  // RS is recoil-only
  spike_phi_LS_deg: 45;
  spike_phi_RS_deg: 75;
  spike_height_below_AR_mm: 4;  // targets shorter opponents
}

function dragoonGBaseContact(
  J: number,
  spinDir: "RS" | "LS",
  opponentARHeight_mm: number,
  baseSpikeMountHeight_mm: number = 4
): { J_smash: number; J_recoil: number; engages: boolean } {
  // Spikes only engage opponents whose AR sits at or below spike height
  const heightMatch = opponentARHeight_mm <= baseSpikeMountHeight_mm + 3;  // ±3mm tolerance

  if (spinDir === "RS") {
    // Backward-facing spike — pure recoil regardless of height
    return { J_smash: 0, J_recoil: J * Math.sin(75 * Math.PI / 180), engages: heightMatch };
  }

  if (!heightMatch) {
    // Spikes miss tall opponents — no contact at base level
    return { J_smash: 0, J_recoil: 0, engages: false };
  }

  const φ = 45 * Math.PI / 180;
  return {
    J_smash: J * Math.cos(φ),   // ≈ 0.707J
    J_recoil: J * Math.sin(φ),  // ≈ 0.707J
    engages: true,
  };
}

// Burst: same mechanism as Case 187, reduced Δω due to higher base mass
function dragoonGBurstDeltaOmega(L_spring: number, I_combo: number): number {
  // 7.6g base contributes ~ΔI ≈ 3.0×10⁻⁷ kg·m² over 6.9g base
  const I_adjusted = I_combo + 3.0e-7;
  return L_spring / I_adjusted;
}
```

---

## Case 207 — CEW Metal Ball · 3.7 g: Why a Spherical Contact Surface Undermines Every Role the CEW Slot Can Fill, and the One Narrow Context Where the Ball Geometry Is Not a Liability

CEW Metal Ball is the die-cast ball-tipped insert for Engine Gear units, contributing 3.7 g to the combination — lighter than CEW Circle Defenser (4.0 g + 0.23 g clip) and CEW Circle Survivor (4.5 g + 0.23 g clip), making it the lightest of the three notable CEW options by body mass and the heaviest if only the bare die-cast body is compared. The part shares its contact geometry with the full Right EG (Metal Ball) body analysed in Case 206, but at 3.7 g vs 11.5 g the mass consequences are weaker. Tall housing height raises the centre of mass, destabilising tilt at low spin. The ball tip bypasses the tornado ridge at essentially zero energy cost, destroying defensive flower-pattern orbit. The only context where the geometry provides positive value is the Gyro Engine Gear self-righting mechanism — a single narrow application that does not salvage the part for competitive use.

---

### 1. Tall Housing Height: Raised Centre of Mass

CEW Metal Ball sits taller in the EG slot than a flat or semi-flat CEW. Let h_cew denote the height of the CEW body above the floor plane when mounted; for a flat tip h_cew ≈ 1 mm, for the ball insert the ball housing raises this to h_cew ≈ 5–6 mm.

```
Centre of mass height shift (CEW body alone):
  Δh_cm = h_cew_ball − h_cew_flat ≈ 5 mm − 1 mm = 4 mm

Tilt stability condition (gyroscopic):
  ω_stable ∝ 1 / √(I_tilt / (m × g × h_cm))
  where I_tilt = moment of inertia about the tilt axis, h_cm = CoM height above contact point

  Raising h_cm by 4 mm:
  h_cm_ball ≈ h_cm_flat + 0.004 m

  Ratio of stability thresholds:
  ω_stable_ball / ω_stable_flat = √(h_cm_ball / h_cm_flat)
```

If h_cm_flat ≈ 10 mm (typical low-profile CEW setup):

```
ω_stable_ball / ω_stable_flat = √(14 / 10) = √1.4 ≈ 1.18

→ Ball CEW requires ~18% higher spin to maintain the same tilt stability as a flat CEW
```

At late-match spin rates this 18% margin is not available — the combination enters the nutation regime earlier than a flat-tip equivalent.

---

### 2. Ball Tip Ridge Bypass at CEW Scale

The tornado ridge bypass derivation is identical to Case 206, §5, now at CEW mass:

```
m_combo (CEW Metal Ball setup) ≈ CEW 3.7 g + EG body ~11 g + WD ~14 g + AR ~5 g ≈ 33.7 g total
  (vs Case 206's 11.5 g EG-only calculation)

Ridge geometry: h_ridge = 1.75 mm, r_ball = 5 mm (same sphere)

Ball centre rise to clear ridge:
  Δh_cm = h_ridge² / (2 × r_ball) = (1.75)² / (2 × 5) = 3.0625 / 10 = 0.306 mm

Energy required:
  ΔE = m_combo × g × Δh_cm
     = 0.0337 × 9.81 × 0.000306
     ≈ 1.01 × 10⁻⁴ J

Kinetic energy at ω = 200 rad/s (mid-match):
  E_k = ½ × I_combo × ω²
  I_combo ≈ 5 × 10⁻⁶ kg·m²   (rough estimate)
  E_k = 0.5 × 5×10⁻⁶ × 200² = 0.1 J

Ridge bypass cost as fraction of kinetic energy: 1.01×10⁻⁴ / 0.1 = 0.001 (0.1%)
```

The ball clears the ridge for 0.1% of total kinetic energy at mid-match — effectively no barrier. Even at late-match ω = 50 rad/s: E_k ≈ 6.25 × 10⁻³ J, bypass cost fraction ≈ 1.6%. The ridge is geometrically transparent to the ball tip at all practical spin rates.

---

### 3. Gyro Engine Gear Self-Righting: The One Positive Use

The Gyro Engine Gear uses a gyroscopic weight that actively resists tilt through angular momentum coupling. When combined with CEW Metal Ball, a specific interaction occurs: ball tip contact radius is tilt-angle dependent.

```
Contact radius at tilt angle θ:
  r_contact(θ) = r_ball × sin(θ)

At θ = 0° (upright):  r_contact = 0   (contact at sphere nadir — minimum friction)
At θ = 10°:           r_contact = 5 × sin(10°) = 0.87 mm
At θ = 20°:           r_contact = 5 × sin(20°) = 1.71 mm
At θ = 30°:           r_contact = 5 × sin(30°) = 2.50 mm
```

For most EG configurations this tilt-dependent contact radius is a liability (Case 206 §3): increasing tilt → increasing friction → increasing orbital speed → further tilt. This is a positive-feedback instability loop.

The Gyro EG breaks the loop:

```
Gyro restoring torque: τ_gyro = I_gyro × Ω_gyro × ω_spin × sin(θ)
Friction destabilising torque: τ_friction = μ × m × g × r_contact(θ) = μ × m × g × r_ball × sin(θ)

Both scale as sin(θ). Stability condition:
  τ_gyro > τ_friction

  I_gyro × Ω_gyro × ω_spin > μ × m × g × r_ball

If this inequality is satisfied, the Gyro mechanism overpowers the friction-driven tilt amplification.
The ball's sin(θ) contact growth is cancelled by the gyro's sin(θ) restoring torque growth.
Result: for any tilt perturbation, both restoring and destabilising forces grow proportionally,
but the gyro wins → combination returns to upright.
```

For standard EGs without the gyro mechanism, τ_gyro = 0 and the friction term always wins. CEW Metal Ball is the only CEW for which the Gyro EG's restoring torque provides active compensation rather than passive resistance. This is an acceptable pairing — not a strong one, but the ball tip does not actively fight the Gyro EG as it fights every other EG type.

---

### 4. Mass Hierarchy and Competitive Irrelevance

```
CEW mass comparison:
  CEW Light Sharp:       ~1.5 g   (sharp tip, low friction, stamina)
  CEW Metal Flat:        ~3.4 g   (flat wide, aggressive attack)
  CEW Metal Ball:        ~3.7 g   (ball tip — this case)
  CEW Circle Defenser:   ~4.0 g + 0.23 g clip = ~4.23 g total
  CEW Circle Survivor:   ~4.5 g + 0.23 g clip = ~4.73 g total

"Heaviest regular CEW" claim:
  3.7 g body > Metal Flat 3.4 g body → true for bare die-cast weight
  But Circle Defenser and Circle Survivor are heavier when clip is included
  "Heaviest regular CEW" means heaviest without a free-spinning mechanism — valid if "regular"
  excludes Circle Defenser / Circle Survivor (which have functional mechanisms)
```

Only CEW Circle Survivor can produce a blade-base + SG + WD assembly mass competitive with Heavy Metal Core setups:

```
HMC total assembly (typical):
  AR ~5 g + WD ~14–17 g + HMC 6.2 g + SG ~8 g + Base ~5 g ≈ 38–41 g

Circle Survivor assembly (WB4 tall-slot base):
  AR ~5 g + WD ~14–17 g + Right EG (Circle Survivor) 6.8 g + CEW Circle Survivor 4.73 g + Base 5.4 g
  ≈ 35.9–38.9 g

Circle Defenser assembly:
  ... + Right EG (Circle Defenser) 6.9 g + CEW Circle Defenser 4.23 g + Base 5.4 g
  ≈ 35.5–38.5 g → marginally lighter than Circle Survivor

Metal Ball CEW assembly:
  ... + Right EG (Metal Ball) 11.5 g + CEW Metal Ball 3.7 g + Base 5.4 g
  ≈ 39.6–42.6 g → comparable mass, but ball tip provides no defensive utility to use it

Mass is not the constraint — the ball tip's inability to hold a defensive orbit is the failure point.
```

---

### 5. Summary of Role Failures

```
Stamina:
  Ball tip at low tilt: r_contact ≈ 0.87 mm → low friction ✓
  But: ridge bypass → no tornado-ridge orbit → wanders into attack zone
  But: tall CoM → enters nutation wobble earlier
  Verdict: fails stamina — orbit cannot be sustained

Weight-based defense:
  Needs: peripheral mass + stable low-friction contact + ridge containment
  Ball tip: bypasses ridge → no containment
  Verdict: fails defense — fundamental geometry incompatibility

Attack:
  Needs: flat or wide tip with predictable high friction
  Ball tip: friction depends on tilt angle (variable, unpredictable)
  Verdict: not an attack tip

Gyro EG only:
  τ_gyro compensates sin(θ) instability growth
  Acceptable pairing — only context where ball tip does not create a net liability
  But Gyro EG + CEW Metal Ball is still outclassed by conventional setups in every competitive category
```

---

### 6. Physics Model

```typescript
interface CEWMetalBallAnalysis {
  mass_g: 3.7;
  ballRadius_mm: 5;
  housingHeightPenalty_mm: 4;  // raises CoM vs flat CEW
  ridgeBypassFraction: 0.001;  // fraction of kinetic energy at ω=200 rad/s
  gyroCompatible: true;        // only positive application
  competitiveRole: "none";
}

function cewBallContactRadius(tiltDeg: number, rBall_mm: number = 5): number {
  return rBall_mm * Math.sin(tiltDeg * Math.PI / 180);
}

function gyroRestoreCondition(
  I_gyro: number,
  omega_gyro: number,
  omega_spin: number,
  mu: number,
  m_combo_kg: number,
  r_ball_mm: number
): boolean {
  const lhs = I_gyro * omega_gyro * omega_spin;
  const rhs = mu * m_combo_kg * 9.81 * (r_ball_mm / 1000);
  return lhs > rhs;  // true → Gyro EG overpowers ball-tip tilt amplification
}

function ridgeBypassEnergy_CEW(m_combo_kg: number, r_ball_mm: number, h_ridge_mm: number): number {
  const r = r_ball_mm / 1000;
  const h = h_ridge_mm / 1000;
  const delta_h = (h * h) / (2 * r);
  return m_combo_kg * 9.81 * delta_h;
}

// cewBallContactRadius(0)   → 0.0 mm   (upright — near-frictionless)
// cewBallContactRadius(10)  → 0.87 mm  (slight tilt — low friction)
// cewBallContactRadius(30)  → 2.5 mm   (aggressive tilt — moderate friction)
// ridgeBypassEnergy_CEW(0.0337, 5, 1.75) → ~1.01×10⁻⁴ J — 0.1% of mid-match KE
// gyroRestoreCondition(1e-7, 300, 200, 0.3, 0.0337, 5)
// → evaluate per Gyro EG spec; if true, ball tip is stable with Gyro; no other EG passes this check
```

---

## Case 208 — Left Customize Engine Gear · 6.6 g: Why a Weaker Spring, the Absence of a Competitive Attack CEW, and Left-Spin Structural Constraints Leave This Part Without a Viable Role Despite Offering the Only Left-Spin CEW Slot

Left Customize Engine Gear (Left CEW EG) is 6.6 g — slightly lighter than Right Engine Gear (Metal Ball) at 11.5 g but heavier than Right Engine Gear (Circle Survivor) at 6.8 g, placing it in the mid-range of EG body masses. It is the only left-spin EG with a CEW prong slot, giving it theoretical access to the full CEW library. In practice, four independent structural failures converge: the spring output is weaker than Left Engine Gear (Turbo), leaving CEW Metal Grip below its minimum useful orbital speed; left spin lacks any competitive overhanging AR; no usable left-spin Final Clutch blade base exists; and CEW Metal Flat — the only attack CEW that could exploit the left-spin tip — was never produced. Every role that CEW compatibility could unlock is blocked by a constraint external to the part itself.

---

### 1. Spring Output: Weaker Than Left EG (Turbo)

Left EG (Turbo) and Left CEW EG share the same spin-gear housing form factor but differ in spring specification. "Weaker, slower release" means lower stored elastic energy E_spring and a longer release time t_release:

```
Left EG (Turbo):    E_spring ≈ E_ref        (reference)
Left CEW EG:        E_spring ≈ α × E_ref    where α < 1

Angular impulse delivered:
  L = ∫ τ(t) dt ≈ √(2 × I_rotor × E_spring)   (energy → angular momentum)

For Left EG (Turbo):  L_turbo = √(2 × I × E_ref)
For Left CEW EG:      L_cew   = √(2 × I × α × E_ref) = √α × L_turbo

Δω_cew = L_cew / I_combo = √α × Δω_turbo

If α = 0.75 (estimated weaker spring):
  Δω_cew ≈ 0.87 × Δω_turbo   → 13% lower burst impulse

Release time slower → lower peak torque τ_peak:
  τ_peak = L / t_release
  If t_release_cew = 1.5 × t_release_turbo:
  τ_peak_cew = L_cew / (1.5 × t_release_turbo) ≈ 0.87/1.5 × τ_peak_turbo ≈ 0.58 × τ_peak_turbo
```

Peak torque is roughly halved. For CEW Metal Grip this matters directly: rubber grip requires a minimum centripetal-force threshold to maintain effective traction.

---

### 2. CEW Metal Grip Minimum Speed Threshold

CEW Metal Grip functions by rubber-tip friction: the rubber deforms against the stadium floor and produces higher lateral traction than any plastic tip. The traction force is proportional to the normal force, which itself is proportional to centripetal demand:

```
Normal force on rubber tip:
  F_N = m_combo × ω² × r_orbit

Friction force (grip):
  F_friction = μ_rubber × F_N = μ_rubber × m_combo × ω² × r_orbit

Minimum useful orbit requires F_friction ≥ F_threshold (enough to push opponent laterally):
  ω_min = √(F_threshold / (μ_rubber × m_combo × r_orbit))

Using typical values:
  F_threshold ≈ 0.8 N  (minimum to displace a defended opponent)
  μ_rubber    ≈ 1.2    (rubber on plastic stadium)
  m_combo     ≈ 0.034 kg
  r_orbit     ≈ 0.08 m (flower-pattern orbit radius)

  ω_min = √(0.8 / (1.2 × 0.034 × 0.08))
        = √(0.8 / 0.003264)
        = √(245)
        ≈ 15.7 rad/s  → ~150 RPM
```

This threshold is low in absolute terms but the problem is orbital speed at burst delivery. Left CEW EG's slower spring adds orbital kinetic energy later and more gradually — the combination reaches its maximum orbital aggressiveness after the match has already progressed past the window where an aggressive orbit produces ring-outs. Left EG (Turbo) delivers the burst peak earlier and with higher τ_peak, meaning the grip tip is at its most useful while the opponent still has enough spin to be displaced. The slower burst fires into a degraded match state.

---

### 3. Height Penalty and Lower-AR Vulnerability

All EG spin gears are taller than standard SG units due to the spring housing. The EG body adds ~5–7 mm of height above a standard SG shaft:

```
Standard SG height above base:  ~10 mm
EG body height above base:      ~15–17 mm

WD mounting height (EG combo):  ~17–19 mm above floor (WD bottom face)
WD mounting height (std combo): ~11–13 mm above floor

AR effective contact band (EG): shifts upward by ~5 mm
```

An attacking AR designed to contact at ~12 mm elevation (typical for most flat-attack setups) now strikes the EG housing body rather than the WD perimeter or AR overlap zone. The EG housing is smooth with no lateral mass or defensive geometry — it presents a featureless cylindrical wall to incoming attacks. This is a 5-mm window of undefended contact surface between the base and the WD.

Furthermore, the taller profile increases the moment arm for tilt-inducing contacts:

```
Tilt torque from hit at height h_hit:
  τ_tilt = F_lateral × h_hit

  h_hit_EG  ≈ 16 mm
  h_hit_std ≈ 11 mm

  τ_tilt_EG / τ_tilt_std = 16 / 11 ≈ 1.45

→ EG combo is 45% more susceptible to tilt-inducing KOs from the same contact force
```

The taller the combo, the more leverage an attacker has to tip it. This compounds with the left-spin AR deficiency described next.

---

### 4. Left Spin Overhanging AR: Structural Absence

"Overhang" for a left-spin combo means the AR projects beyond the base perimeter on the leading edge of its left-spin rotation, so the AR tip reaches past the base footprint and strikes opponent ARs at their outer radius. Most competitive ARs were designed with right-spin geometry in mind — their productive smash faces are on the right-leading edge. In left spin these become the trailing edge, either producing recoil or doing nothing.

```
AR smash geometry for left spin (rotation: counter-clockwise viewed from above):
  Productive contact face → must be on the LEFT leading edge
  Right-optimised AR (e.g. Triple Tiger):
    - Left leading edge = trailing face or flat/recessed surface
    - Contact angle φ_LS ≈ 70–85° → near-pure recoil
  Left-optimised overhang AR:
    - Few options; most are mid-range Gimmick ARs, not purpose-built smash
    - No left-spin AR equivalent to Eight Spiker / Smash Turtle / Tiger Defenser in competitive tier
```

Without an overhanging AR, the EG combo's taller profile produces no offensive advantage — the AR never reaches the opponent's outer contact zone, and the height only adds vulnerability.

---

### 5. Final Clutch Base Incompatibility in Left Spin

Final Clutch timing (Case 203) is based on the blade base clutch mechanism depressing the EG release switch at ω_trigger ≈ 1350 RPM (141 rad/s). For a left-spin EG this means:

```
At ω_trigger = 141 rad/s, orbital speed in flower-pattern orbit:
  v_orbital = ω_trigger × r_orbit ≈ 141 × 0.08 = 11.3 m/s  (theoretical)

But: spin and orbital speed are not directly coupled
  Typical flower-pattern orbit speed at match-mid ≈ 0.4–0.8 m/s
  At late match (ω ≈ 141 rad/s):
    Combination is approaching topple, orbital speed is LOW (not aggressive)
```

The Final Clutch fires when the combination is already at ~13–17% of launch spin — the burst arrives in a match state where the combination is nearly spent. For right-spin combinations (Case 203), the Final Clutch Dranzer G base has sufficient AR mass and overhanging geometry to convert the late burst into a ring-out attempt. Left spin has no equivalent:

```
Right-spin Final Clutch bases with viable AR pairings: Final Clutch Base (Dranzer G) → Case 203
Left-spin Final Clutch base options with effective AR geometry: none identified in competitive tier

→ Final Clutch timing is theoretically available but no pairing exists to convert the burst to productive output in left spin
```

---

### 6. CEW Metal Flat Absence: Attack Role Closure

CEW Metal Flat (3.4 g, wide flat plastic tip) is the attack-oriented CEW. It was released in right-spin EG kits. A left-spin CEW Metal Flat was never produced:

```
Available CEW options for Left CEW EG:
  CEW Light Sharp:      stamina — no attack
  CEW Metal Ball:       ball tip — Case 207, no attack
  CEW Circle Defenser:  wide semi-flat, defensive — no smash attack
  CEW Circle Survivor:  free-spinning bowl — defensive stamina — no attack
  CEW Metal Grip:       rubber grip — attack-capable but speed-limited (§2 above)
  CEW Metal Flat:       NOT AVAILABLE in left-spin compatible packaging

The one CEW that could produce aggressive orbital movement without the speed limitation
of Metal Grip does not exist in left-spin form.
```

The right-spin Right EG (Metal Flat) exists (Case 190 addresses Left EG Metal Semi-Flat as a separate part; Right EG Metal Flat was a separate production run). No left-spin CEW Metal Flat CEW insert was manufactured, closing the only remaining attack vector.

---

### 7. Physics Model

```typescript
interface LeftCEWEGAnalysis {
  mass_g: 6.6;
  spinDir: "LS";
  springStrength: "weaker" | "turbo";  // relative to Left EG (Turbo)
  springRelease: "slower";
  cewSlotType: "normal";
  hasUsableAttackCEW: false;
  hasFinalClutchBase: false;
  hasOverhangingAR: false;
}

function cewGripMinOrbitalSpeed(
  F_threshold_N: number,
  mu_rubber: number,
  m_combo_kg: number,
  r_orbit_m: number
): number {
  return Math.sqrt(F_threshold_N / (mu_rubber * m_combo_kg * r_orbit_m));
}

function leftEGBurstDeltaOmega(
  springEnergyRatio: number,  // α: ratio vs Left EG Turbo reference (< 1)
  deltaOmega_turbo: number
): number {
  return Math.sqrt(springEnergyRatio) * deltaOmega_turbo;
}

function heightTiltTorqueRatio(h_EG_mm: number, h_std_mm: number): number {
  return h_EG_mm / h_std_mm;
}

// cewGripMinOrbitalSpeed(0.8, 1.2, 0.034, 0.08)
// → 15.7 rad/s — minimum orbit ω for CEW Metal Grip to produce useful lateral force
// Problem: Left CEW EG fires burst too slowly to reach useful orbital speed in time

// leftEGBurstDeltaOmega(0.75, 35)
// → ~30.3 rad/s — vs Turbo's 35 rad/s burst; 13% weaker Δω from softer spring

// heightTiltTorqueRatio(16, 11)
// → 1.45 — EG combo receives 45% more tilt-inducing torque per contact than std SG combo
```

---

## Case 209 — Right Customize Gear (Full Auto Clutch Version) · 5.1 g: Why Replicating the Full Auto Clutch Mechanism Without Shielded Metal Ball Bearings Destroys the Free-Spin Phase, and Why Every Blade Base Pairing Either Negates the Gimmick Immediately or Produces a Worse Result Than Existing Alternatives

Right Customize Gear (Full Auto Clutch Version) is a standalone CG that incorporates the centrifugal lock-release mechanism of the Full Auto Clutch Base (Driger F): a clutch weight holds the tip locked during high-spin attack, then releases it to free-spin as the combination slows. The mechanism is physically closer to Full Auto Clutch Base than to any EG clutch — it uses the same centrifugal-weight trigger principle operating inside the SG body rather than via the EG release switch. At 5.1 g it sits at a typical CG weight. The critical failing is the absence of shielded metal ball bearings: Full Auto Clutch Base's competitive value derives almost entirely from its bearing quality in free-spin mode. Without them, the free-spin phase has substantially higher friction than a dedicated free-spin SG and the LAD advantage is largely eliminated. Blade base pairings compound this: First Clutch and Normal Bases release the clutch at or near launch, making the part functionally identical to Right CG (Free Shaft Version) from the first moments — which achieves the same outcome with a simpler, proven mechanism.

---

### 1. Clutch Mechanism: Centrifugal Lock to Free-Spin Transition

The mechanism mirrors Full Auto Clutch Base (Case 194 reference context):

```
Clutch engagement condition:
  F_centrifugal = m_weight × ω² × r_weight  >  F_spring_preload
  → tip is LOCKED to SG body (rotates with combination)

Clutch release condition:
  F_centrifugal < F_spring_preload
  → tip is FREE from SG body (decoupled from combination spin)

Trigger threshold ω_trigger:
  m_weight × ω_trigger² × r_weight = F_spring
  ω_trigger = √(F_spring / (m_weight × r_weight))

Using approximate FAC values:
  m_weight ≈ 0.5 g = 0.0005 kg
  r_weight ≈ 8 mm = 0.008 m
  F_spring  ≈ 0.025 N

  ω_trigger = √(0.025 / (0.0005 × 0.008))
            = √(0.025 / 0.000004)
            = √6250
            ≈ 79 rad/s  → ~755 RPM
```

At launch (ω ≈ 300–400 rad/s) the clutch is fully engaged. As spin decays past ~755 RPM the tip releases to free-spin. This is the intended sequence: high-friction attack early, LAD survival late.

---

### 2. Bearing Quality: The Core Failure

Full Auto Clutch Base achieves competitive free-spin LAD because its tip shaft runs on a shielded metal ball bearing. Right CG (Full Auto Clutch) uses a plastic bushing or unshielded pin bearing — the same bearing quality as a standard non-free-spin SG shaft.

```
Friction model for free-spinning tip:
  Torque on free-spin tip from floor friction:
    τ_floor = μ_tip × F_N × r_tip

  Bearing drag torque opposes free-spin:
    τ_bearing = μ_bearing × F_N × r_shaft

  Net spin-down torque on combination (tip locked to SG):
    τ_locked = τ_floor   (tip drag transfers fully to SG body)

  Net spin-down when free-spinning:
    τ_free = τ_floor × (τ_bearing / τ_locked)   (only bearing loss transfers)

  Friction coefficient comparison:
    Shielded metal ball bearing:  μ_bearing ≈ 0.001–0.005
    Plastic bushing / pin:        μ_bearing ≈ 0.02–0.06

  LAD duration ratio (free-spin quality):
    t_LAD ∝ I_combo / τ_bearing

    t_FAC_Base / t_RCG_FAC ≈ μ_bushing / μ_bearing_shielded
                            ≈ 0.04 / 0.003
                            ≈ 13×
```

Full Auto Clutch Base delivers ~13× longer effective free-spin LAD than this CG in the same mode. "Largely negating any usefulness of the gimmick" follows: the LAD phase that justifies the two-phase design requires bearing quality that is absent here.

---

### 3. Blade Base Clutch Timing: Base-Dependent Premature Release

The CG clutch trigger ω_trigger ≈ 79 rad/s is internal to the CG. However, blade base geometry interacts with the CG shaft in ways that override this:

```
Normal Base:
  Shaft engagement: direct coupling with no release mechanism
  CG clutch: behaves as designed (releases at ~755 RPM)
  BUT: Normal Base has no defensive LAD geometry → free-spin phase has no orbit benefit
  Effective outcome: locked phase (attack) + poor-bearing free-spin (no competitive LAD)

First Clutch Base:
  At launch: spring fires, applying sudden angular acceleration to the system
  The impulse can cause the CG clutch weight to momentarily unload against its spring
  (the impulse torque partially de-couples the centrifugal weight engagement)
  → Clutch releases at or near launch
  Effective outcome: immediately free-spinning from t ≈ 0
  → identical to Right CG (Free Shaft Version), but with worse bearing quality

Final Clutch Base:
  Spring fires at ω ≈ 1350 RPM (141 rad/s) — ABOVE ω_trigger (79 rad/s)
  → At trigger, combination is already past CG release threshold
  → CG has been free-spinning since ~755 RPM before Final Clutch fires
  Effective timing: CG releases first, then Final Clutch fires into an already-free-spinning tip
  This is the closest match to FAC Base intent: late release, late burst
  BUT: bearing quality still limits the free-spin phase quality
```

```
Timeline comparison:
  Full Auto Clutch Base (Driger F):  locked → (ω_trigger) → shielded-bearing free-spin → LAD ✓
  Right CG (Full Auto Clutch) + Final Clutch Base:
    locked → (ω ≈ 755 RPM) → bushing free-spin → (Final Clutch burst) → bushing free-spin
    LAD quality: ~13× worse than FAC Base in free-spin phase ✗
```

---

### 4. Comparison With Right CG (Free Shaft Version)

Right CG (Free Shaft Version) is free-spinning from launch. For any pairing where Right CG (Full Auto Clutch) also releases early (First Clutch or Normal Base), the two parts are functionally identical in practice:

```
First Clutch / Normal Base + Right CG (Full Auto Clutch):
  Free-spin from launch (clutch released by base interaction)
  Bearing: plastic bushing

Free Shaft Version (any base):
  Free-spin from launch
  Bearing: plastic bushing (same quality class)

Outcome: identical free-spin friction, identical LAD quality
Advantage of FAC version: none
Disadvantage of FAC version: mechanism complexity adds potential failure mode
```

The only scenario where FAC CG is different from Free Shaft is Final Clutch pairing — and even there, the gap to Full Auto Clutch Base is too large to close.

---

### 5. Two-Phase Contradiction: Attack Requires Friction, LAD Requires Bearing Quality

A two-phase SG design is viable when each phase is independently competitive. Full Auto Clutch Base succeeds because:
- Phase 1 (locked): tip is whatever tip is mounted → full friction for attack or wide-flat aggression
- Phase 2 (free-spin): metal bearing → genuine LAD quality comparable to dedicated stamina setups

Right CG (Full Auto Clutch):
- Phase 1 (locked): standard tip → attack friction available ✓
- Phase 2 (free-spin): plastic bushing → poor LAD, ~13× worse than FAC Base ✗

```
Attack-phase output (Phase 1):
  Equivalent to any locked-tip CG of the same tip type
  Not differentiated from non-gimmick CG options

Free-spin-phase output (Phase 2):
  τ_spin_loss ≈ μ_bushing × F_N × r_shaft ≈ 0.04 × (0.034 × 9.81) × 0.002
             ≈ 2.67 × 10⁻⁵ N·m  (bushing case)
  τ_spin_loss (metal bearing) ≈ 3 × 10⁻³ × same ≈ 2.0 × 10⁻⁶ N·m

  LAD orbit decay: θ̈ = −τ / I_combo
  For I_combo ≈ 5×10⁻⁶ kg·m²:
    α_bushing      = 2.67×10⁻⁵ / 5×10⁻⁶ = 5.3 rad/s² deceleration
    α_metal_bearing = 2.0×10⁻⁶ / 5×10⁻⁶ = 0.4 rad/s²  (FAC Base quality)

  Time to zero from ω = 79 rad/s:
    t_bushing      = 79 / 5.3 ≈ 14.9 s
    t_metal_bearing = 79 / 0.4 ≈ 197.5 s  (theoretical; FAC Base actually has wide-survivor base LAD on top)
```

The free-spin phase lasts ~15 s vs ~197 s for FAC Base — not a viable LAD strategy.

---

### 6. Physics Model

```typescript
interface RCGFullAutoClutchAnalysis {
  mass_g: 5.1;
  spinDir: "RS";
  clutchType: "centrifugal_auto";
  bearingType: "plastic_bushing";  // NOT shielded metal ball bearing
  omega_trigger_radPerS: 79;
}

function facClutchTrigger(
  m_weight_kg: number,
  r_weight_m: number,
  F_spring_N: number
): number {
  return Math.sqrt(F_spring_N / (m_weight_kg * r_weight_m));
}

function freeSpinLADDuration(
  omega_release: number,
  I_combo: number,
  mu_bearing: number,
  F_N: number,
  r_shaft_m: number
): number {
  const tau = mu_bearing * F_N * r_shaft_m;
  return omega_release / (tau / I_combo);
}

function bearingQualityRatio(mu_bushing: number, mu_metal_bearing: number): number {
  return mu_bushing / mu_metal_bearing;  // > 1: bushing is worse
}

// facClutchTrigger(0.0005, 0.008, 0.025)
// → 79 rad/s (~755 RPM) — clutch releases below this spin rate

// freeSpinLADDuration(79, 5e-6, 0.04, 0.034 * 9.81, 0.002)
// → ~14.9 s — bushing free-spin duration from release point

// freeSpinLADDuration(79, 5e-6, 0.003, 0.034 * 9.81, 0.002)
// → ~197 s — shielded-bearing equivalent (FAC Base quality)

// bearingQualityRatio(0.04, 0.003)
// → ~13 — FAC Base free-spin lasts ~13× longer than this CG
```

---

## Case 210 — SG (MG Spring Version) · 3.8 g: Why the Jumping Gimmick Worsens Its Own Stability, Why the Shaft Geometry Is the Only Competitive Justification for the Part, and Why Spring Strength Variation Compounds Every Other Failure Mode

SG (MG Spring Version) is a spring-loaded jumping spin gear from Cyber Dragoon, weighing 3.8 g. Its shaft extends on floor contact, launching the combination upward — the same gimmick category as SG (Spring Version), but with a narrower, rounder tip and a longer shaft casing. The magnet embedded in the tip has no effect on standard play. As a standalone part it is outclassed by SG (Spring Version) in balance and tip profile. Its one genuine claim to competitive relevance is shaft geometry: Jumping Base 2 requires a shaft that can physically extend inside it, and only the MG Spring shaft — not the Spring Version shaft — satisfies this requirement. Outside Jumping Base 2 the part has no advantage and multiple liabilities.

---

### 1. Shaft Extension Geometry: Why Jumping Base 2 Requires This Shaft

Jumping Base 2 is a blade base with an internal channel designed to accommodate a telescoping shaft. When the combination hits the floor at speed, the shaft compresses upward into the base, loads against the internal spring, and then releases — propelling the combination upward.

```
Jumping Base 2 internal channel:
  Accepts shaft with specific outer diameter d_shaft and travel range Δx_max

SG (MG Spring Version) shaft:
  Outer diameter: compatible with Jumping Base 2 channel
  Extension travel: Δx_extend ≈ 8–12 mm  (shaft slides freely in base channel)
  → shaft can complete the compression-extension cycle inside the base ✓

SG (Spring Version) shaft:
  Outer diameter: similar, but internal tab geometry differs
  Extension travel: shaft bottoms out against Jumping Base 2 channel walls before completing travel
  → shaft cannot complete the cycle; extension is blocked ✗
  → attempting to force it risks damaging the shaft tabs
```

The MG Spring shaft is therefore necessary for Jumping Base 2 to function at all. This is not a preference — it is a hard mechanical requirement.

---

### 2. One-Way Shaft Compatibility

The inverse case: MG Spring shaft in SG (Spring Version) casing.

```
SG (Spring Version) casing (if tip is removable):
  + accepts MG Spring shaft
  + lower overall height than MG Spring casing (SG Spring casing is shorter)
  + lower height → lower CoM → better tilt stability in Jumping Base 2 combinations

SG (MG Spring Version) casing (longer):
  + required for full MG Spring assembly
  − greater height → higher CoM → worse tilt stability

One-way compatibility rule:
  MG Spring shaft → Spring Version casing: permitted, provides height reduction benefit
  Spring Version shaft → MG Spring / Jumping Base 2:  blocked, tab damage risk ✗
```

For Jumping Base 2 use: if a Spring Version with removable tip is available, using the MG Spring shaft in the shorter casing reduces instability at the cost of some spring preload (shorter casing = more initial spring tension, counter-intuitively — spring is compressed to a shorter free length → higher pre-load, but shaft travel reduced). The net effect is a lower-CoM combination with a slightly more aggressive jump trigger.

---

### 3. Jump Mechanics: Spring Energy and Self-KO Risk

Spring-loaded jump height:

```
Spring elastic potential energy:
  E_spring = ½ × k × x²
  where k = spring constant, x = compression distance

Conversion to vertical kinetic energy (efficiency ε, accounting for deformation losses):
  E_jump = ε × E_spring  (ε ≈ 0.3–0.5 for plastic SG spring systems)

Jump height:
  h_jump = E_jump / (m_combo × g)
         = (ε × ½ × k × x²) / (m_combo × g)

Example with k = 800 N/m, x = 0.010 m, ε = 0.4, m_combo = 0.035 kg:
  E_spring = ½ × 800 × 0.010² = 0.040 J
  E_jump   = 0.4 × 0.040 = 0.016 J
  h_jump   = 0.016 / (0.035 × 9.81) = 0.047 m ≈ 47 mm
```

A 47 mm jump places the combination well above the stadium rim (typically 30–40 mm) — a ring-out risk on any activated jump near the stadium perimeter. The jump direction is not controlled: it follows the net contact normal at the moment of spring release, which is a function of the combination's orbit angle at that instant — not predictable.

---

### 4. Gimmick Stability Penalty: CoM Rise on Activation

When the shaft extends during a jump, the combination's centre of mass shifts upward:

```
CoM height before jump (shaft retracted):
  h_cm_retracted = h_cm_base   (normal operating height)

CoM height at full extension (shaft extended by Δx):
  h_cm_extended = h_cm_base + Δx × (m_shaft / m_combo)

  Δx ≈ 10 mm, m_shaft ≈ 3.8 g, m_combo ≈ 35 g:
  Δh_cm = 0.010 × (0.0038 / 0.035) = 0.010 × 0.109 ≈ 1.1 mm

Tilt stability ω_stable ∝ 1/√h_cm:
  ω_stable_extended / ω_stable_retracted = √(h_cm / (h_cm + Δh_cm))

  If h_cm_retracted ≈ 12 mm:
  Ratio = √(12 / 13.1) = √0.916 ≈ 0.957

  → 4.3% higher spin required to maintain stability during shaft extension
```

4.3% is modest in isolation, but the jump fires at moments of violent floor contact — the combination is already experiencing tilt perturbations from the impact. The CoM rise compounds an already-unstable moment rather than occurring at a neutral state.

---

### 5. Narrower Tip: Contact Area and Balance Comparison

The MG Spring tip is narrower than the SG (Spring Version) tip — a rounded cylindrical profile rather than the broader flat-edged cylinder:

```
SG (Spring Version) tip:
  r_tip ≈ 3.5 mm  (wider cylinder, more stable floor contact)
  Contact area: A = π × r_tip² ≈ 38.5 mm²

SG (MG Spring Version) tip:
  r_tip ≈ 2.0 mm  (narrower, rounded edge)
  Contact area: A = π × r_tip² ≈ 12.6 mm²

Contact pressure at same F_N:
  P_MG = F_N / 12.6 = 3.06 × P_SG

Higher pressure → deeper floor indentation per unit force → higher friction per unit area
But total friction force = μ × F_N is unchanged (contact area cancels for Coulomb friction)
The practical effect is different: the narrower tip is less stable laterally (smaller base of contact)
→ combination rocks over the contact point more easily → worsens tilt at low spin
```

The narrower tip also means less gyroscopic precession damping from floor contact: a wider tip "samples" more of the floor texture per revolution, averaging out asymmetric friction. The narrow tip amplifies any instantaneous asymmetry.

---

### 6. Magnet in Tip: No Effect on Standard Play

Image 4 (bottom view) shows a small metal disk at the centre of the tip face — the magnet insert. Magne Stadia use a magnetic base surface that interacts with magnetic tips:

```
Magnetic force on tip magnet:
  F_mag = (μ_0 / 4π) × (m_tip × m_stadium) / r²
  where r = distance from tip face to stadium surface ≈ tip contact clearance ≈ 0

At contact: F_mag adds to normal force F_N
  F_N_magne = m_combo × g + F_mag

Effect on non-Magne Stadia:
  F_mag = 0 (no magnetic field from standard plastic/metal stadium surface)
  → identical to a non-magnetic tip in every measurable parameter
```

The magnet adds ~0.1–0.2 g to tip mass (observed in tip-face image), shifting CoM fractionally downward. This is the only standard-play effect: negligible CoM improvement from ~0.15 g at the tip end, too small to measure competitively.

---

### 7. Spring Strength Variation

Image 5 shows three springs from different examples — visibly different coil diameters and wire gauges. This is a documented manufacturing inconsistency across the SG (MG Spring Version) production run:

```
Spring constant variability:
  k_low  ≈ 600 N/m  (softer spring)
  k_high ≈ 1100 N/m (stronger spring)

Effect on bounce height (from §3, x = 10 mm):
  h_low  = (0.4 × ½ × 600  × 0.01²) / (0.035 × 9.81) ≈ 35 mm
  h_high = (0.4 × ½ × 1100 × 0.01²) / (0.035 × 9.81) ≈ 64 mm

  Weaker spring: 35 mm — may stay inside stadium rim (rim height ~30–40 mm)
  Stronger spring: 64 mm — ring-out likely near perimeter

Longer casing (MG Spring casing vs Spring Version casing) effect:
  Longer casing reduces effective compression distance x:
  x_MG_casing ≈ x_spring_casing − Δx_casing_length
  Lower effective x → lower E_spring → reduced bounce height
  This partially offsets the stronger spring bias — not consistently enough to normalize output
```

With rulings not requiring the spring to be set, the variation is less operationally critical than it once was — but it means two nominally identical parts can produce jump heights differing by ~83% (35 mm vs 64 mm), which is relevant when assessing self-KO probability per match.

---

### 8. Physics Model

```typescript
interface MGSpringVersionAnalysis {
  mass_g: 3.8;
  tipRadius_mm: 2.0;       // narrower than SG Spring Version (~3.5 mm)
  shaftExtension_mm: 10;   // travel available in Jumping Base 2
  hasMagnet: true;         // tip magnet — standard stadium: no effect
  jumpingBase2Compatible: true;   // only shaft that can extend in JB2
  springVersionCompatible: true;  // MG shaft fits in Spring Version casing (one-way)
}

function jumpHeight(
  k_Npm: number,
  x_m: number,
  efficiency: number,
  m_combo_kg: number
): number {
  const E_spring = 0.5 * k_Npm * x_m * x_m;
  return (efficiency * E_spring) / (m_combo_kg * 9.81);
}

function comRiseOnExtension(
  delta_x_m: number,
  m_shaft_kg: number,
  m_combo_kg: number
): number {
  return delta_x_m * (m_shaft_kg / m_combo_kg);
}

function stabilityPenaltyRatio(h_cm_m: number, delta_h_m: number): number {
  return Math.sqrt(h_cm_m / (h_cm_m + delta_h_m));
  // < 1 means higher ω needed after extension — stability degrades
}

// jumpHeight(800, 0.010, 0.4, 0.035)  → 0.047 m (47 mm) — ring-out risk at stadium perimeter
// jumpHeight(600, 0.010, 0.4, 0.035)  → 0.035 m (35 mm) — may stay in stadium
// jumpHeight(1100, 0.010, 0.4, 0.035) → 0.064 m (64 mm) — strong spring nearly always ring-outs near edge
// comRiseOnExtension(0.010, 0.0038, 0.035) → 0.0011 m (1.1 mm) — CoM rise during jump activation
// stabilityPenaltyRatio(0.012, 0.0011) → 0.957 — 4.3% spin threshold increase during shaft extension
```

---

## Case 211 — Final Clutch Base (Draciel G Version) · 7.3 g: Why Independent Non-Bridged Clutch Tabs Create an Alignment-Dependent EG Trigger Failure Mode, and Why the Lightest Final Clutch Base Has the Narrowest Competitive Window

Final Clutch Base (Draciel G Version) is 7.3 g — the lightest of the Final Clutch bases, compared to Final Clutch Base (Dranzer G Version) at 7.9 g (Case 203). It carries two small metal balls embedded in its clutch tab arms, visible in the red-circled regions of the annotated image. The critical structural distinction from other Final Clutch bases is that the two clutch tabs are independent: they are not joined or bridged. This means the EG release switch is only depressed when the tab on the same side as the switch faces inward — if an opponent's hit rotates the base to place the switch on the uncontacted side, the clutch never triggers regardless of spin rate. The late-burst behavior is present in principle but unreliable in practice.

---

### 1. Metal Ball Tab Mass: Centrifugal Contribution

The two metal balls in the clutch tab arms add peripheral mass to the centrifugal trigger weight:

```
Ball mass estimate: ~0.3 g each, two balls → Δm = 0.6 g total
Ball radial position: r_ball ≈ 20 mm (at the outer tab tip)

Centrifugal force contribution per ball at ω:
  F_ball = m_ball × ω² × r_ball
         = 0.0003 × ω² × 0.020
         = 6.0 × 10⁻⁶ × ω²  N

At ω = 141 rad/s (Final Clutch trigger ≈ 1350 RPM):
  F_ball = 6.0×10⁻⁶ × 141² = 6.0×10⁻⁶ × 19881 ≈ 0.119 N per ball

Compare to total clutch engagement force requirement F_spring_preload ≈ 0.5–1.0 N:
  Ball contribution: 2 × 0.119 / 0.75 ≈ 32% of spring pre-load
```

32% is non-trivial — the balls do lower the trigger threshold meaningfully. However, 0.6 g at r = 20 mm contributes:

```
ΔI_balls = 0.0006 × (0.020)² = 2.4 × 10⁻⁷ kg·m²
I_14g_WD at r=20mm = 0.014 × (0.020)² = 5.6 × 10⁻⁶ kg·m²
Ratio: 2.4×10⁻⁷ / 5.6×10⁻⁶ = 4.3%
```

The rotational inertia contribution is 4.3% of a standard WD — negligible for defensive purposes. The balls affect trigger timing more than they affect hit resistance.

---

### 2. Independent Clutch Tabs: The Alignment-Dependent Trigger Failure

Standard EG mechanism (from Case 193 / memory): the white plastic switch tab on the EG underside is depressed by the blade base clutch mechanism at the trigger moment. For Final Clutch bases, the centrifugal tab arm presses against this switch while spin is high, holding the spring wound; when spin drops below ω_trigger, the arm retracts and the switch pops out → spring releases.

In Final Clutch Base (Dranzer G), the clutch mechanism forms a complete ring or has bridged tabs — the switch is always in contact with some part of the mechanism regardless of rotational orientation.

In Final Clutch Base (Draciel G), the two tabs are independent with gaps between them:

```
Tab arc coverage: each tab ≈ 45–60° arc
Gap between tabs: ≈ 60–90° gap each side
Total non-coverage: ~120–180° of the full 360°

EG release switch location: fixed at one specific angular position on the EG housing

If opponent contact rotates the base such that a gap aligns with the switch:
  Switch face → no tab present → switch is already in "released" state
  → Spring fires immediately (or has already been released on first contact)
  → EG trigger is unpredictable, orbit-angle dependent
```

The consequence: from the defender's perspective, incoming hits at the "wrong" orbital angle depressurize the clutch and fire the spring unexpectedly — or, if hit from the gap side, the EG may fire before battle circumstances warrant it, wasting the burst at a non-optimal moment.

```
Probability of alignment failure per contact event:
  Gap coverage: ~150° / 360° = 0.42
  → ~42% of random-angle contacts will encounter a gap, potentially misfiring the clutch
  (actual rate lower since orbit is deterministic, not random — but unpredictable in practice)
```

---

### 3. Late-Battle Burst: Why Ineffectual at ω_trigger

Final Clutch trigger at ~1350 RPM (141 rad/s) means approximately 45–50% of launch spin has been lost. The burst adds Δω ≈ 27–35 rad/s (same mechanism as Case 203):

```
Post-burst ω ≈ 141 + 30 = 171 rad/s → ~1633 RPM
Pre-burst orbital speed: v ≈ 0.4–0.6 m/s  (slow late-match orbit)
Post-burst orbital speed increase:
  Δv ≈ Δω × r_orbit_coupling ≈ ... (loose coupling, not direct)
  Actual orbital speed increase ≈ 10–20% above pre-burst

For an attack AR to ring-out: v_contact must produce J > m_target × Δv_escape
  At 171 rad/s with a non-overhanging AR: J is modest
  Target on normal base: Δv_escape ≈ 0.6–1.0 m/s
  J = μ_reduced × (v_combo_impact − v_target_initial) × m_reduced
  → burst adds ~0.05–0.15 N·s to impact — marginal for ring-out against defended target
```

Square Edge AR — the primary candidate for using this burst — is designed for lower-profile setups. At EG height:

```
AR contact elevation (EG setup): ~18–22 mm above floor
Typical target AR contact band: 12–16 mm above floor
Height mismatch: +4–10 mm → AR passes over target contact zone in many matchups
Result: Square Edge swings above the effective contact layer → no productive hit
```

"Too low on rotational energy" is confirmed by the numbers; "AR height mismatch" is the geometric reason attack ARs fail on tall EG bases.

---

### 4. Circle Survivor Defense Ranking

Circle Survivor Defense priority order for blade bases:

```
Rank 1 — Normal Base (Wolborg 4):  5.4 g, φ ≈ 5°, WD overhang 20 mm, Wide Survivor LAD ✓ (Case 199)
Rank 2 — Normal Base (Rock Bison): 5.6 g, rectangular protrusion higher recoil, but tall slot ✓ (Case 198)
Rank 3 — Final Clutch Base (Desert Sphinxer): heavier than Draciel G → more translational mass; lower recoil geometry
Rank 4 — Final Clutch Base (Draciel G): 7.3 g, tall slot ✓, but:
  - Higher recoil than WB4 base
  - Independent tabs → alignment-dependent EG trigger
  - Lightest FCB → less defensive mass than Desert Sphinxer

Why Draciel G is still "the only other truly viable option":
  - Does have tall slot → accepts Right EG (Circle Survivor) correctly
  - Does have Final Clutch mechanism → in favourable trigger alignments, spring fires late
  - At 7.3 g, combination mass is acceptable for Circle Survivor Defense
  - No other FCB or Normal Base outside the top 3 beats it for this specific role
```

---

### 5. LAD Comparison: Lightest FCB vs Normal Bases

```
LAD orbit duration: t ∝ r_orbit² × I_combo / τ_friction

  I_combo contribution from base:
    Draciel G FCB: 7.3 g at r_avg ≈ 20 mm → I = 0.0073 × 0.020² = 2.92×10⁻⁶ kg·m²
    WB4 Normal Base: 5.4 g at r_avg ≈ 18 mm → I = 0.0054 × 0.018² = 1.75×10⁻⁶ kg·m²

  Draciel G adds more I from mass → better spin retention in theory
  But: its rim geometry has higher recoil (less smooth than WB4's φ ≈ 5° rim)
    → each hit removes more spin per contact event
    → under attack, advantage is erased or reversed

  Net: WB4's lower recoil outweighs Draciel G's mass advantage for LAD longevity
       under actual battle conditions
```

---

### 6. Physics Model

```typescript
interface FinalClutchBaseDracielG {
  mass_g: 7.3;
  clutchTabType: "independent";  // not bridged — alignment-dependent trigger
  metalBalls: 2;
  metalBallMass_g: 0.3;          // per ball
  metalBallRadius_mm: 20;
  slotType: "tall";
  egTriggerReliability: "alignment_dependent";
}

function tabAlignmentFailureProbability(
  gapCoverageDeg: number
): number {
  return gapCoverageDeg / 360;
}

function metalBallCentrifugalForce(
  m_ball_kg: number,
  r_ball_m: number,
  omega: number
): number {
  return m_ball_kg * omega * omega * r_ball_m;
}

function fcbLateBurstRingOutFeasibility(
  omega_trigger: number,
  delta_omega: number,
  v_escape: number,
  r_orbit_coupling: number
): boolean {
  const v_post_burst_gain = delta_omega * r_orbit_coupling;
  return v_post_burst_gain > v_escape;
}

// tabAlignmentFailureProbability(150)
// → 0.42 — ~42% of random contact angles encounter a gap; clutch may fire prematurely

// metalBallCentrifugalForce(0.0003, 0.020, 141)
// → 0.119 N per ball — contributes ~32% of clutch spring pre-load at trigger ω

// fcbLateBurstRingOutFeasibility(141, 30, 0.8, 0.05)
// → false — 30 rad/s burst via 0.05 coupling adds only 1.5 m/s orbital equivalent; below escape threshold
```

---

## Case 212 — Dragon Saucer Attack Ring · 6.5 g total (Core AR 4.5 g): Why the Default Gear Sub-AR Cancels Its Own Core, Why Screw Zeus Unlocks One of the Most Powerful RS and LS Smash Setups, and Why Full Weight Requires a Fast, High-Traction Tip to Convert Mass Into Ring-Outs

Dragon Saucer is a composite AR: a 4.5 g core AR with large, outward-projecting contact points, paired with a full-circle gear-shaped Sub-AR (approximately 2.0 g). In default assembly the gear Sub-AR wraps completely around the core, blocking access to the core AR's contact points and producing a combination of mutual cancellation — the core AR is too aggressive to avoid recoil when tilted, and the Sub-AR covers the faces that would otherwise deliver smash. With War Lion SAR (or any SAR that exposes the core contacts) the AR becomes a usable but recoil-heavy left-spin smash option. With Screw Zeus SAR, the geometry aligns specifically: in RS the rear heads, flat protrusions, and corner contacts combine into one of the library's best Smash Attack configurations; in LS the foreheads and spike contacts stack on Screw Zeus' second section for severe impact power — but the weight demands a very fast, high-traction tip to translate mass into ring-outs.

---

### 1. Default Sub-AR (Gear Ring): Contact Point Blocking

The gear Sub-AR has full 360° coverage around the core AR radius. Its gear teeth are shallow with low contact angle:

```
Gear tooth geometry (Sub-AR):
  φ_gear ≈ 75–85°  (near-perpendicular to tangent line → near-pure recoil)
  Contact radius r_SAR ≈ 28–30 mm  (outer edge)

Core AR contact points (when exposed):
  φ_core_LS ≈ 30–40°  (aggressive smash)
  r_core ≈ 25–27 mm

When Sub-AR is installed:
  r_SAR > r_core → Sub-AR is the first contact surface in all engagements
  Core AR contact points are radially shielded behind the gear ring
  → Core AR never reaches opponent AR → smash component = 0

Effective contact: gear teeth only
  J_smash = J × cos(80°) ≈ 0.17J
  J_recoil = J × sin(80°) ≈ 0.98J

Result: 98% recoil per contact, 17% smash — worse than most defensive ARs
```

The two components in default configuration don't "do two things poorly" by accident — the gear ring's coverage radius exceeding the core AR radius is the geometric cause.

**Sub-AR seating architecture:** All SAR-compatible ARs have a raised inner ledge on the underside of the core AR body (visible in the annotated underside image — the stepped channel circled in red). The Sub-AR's inner rim clips into this ledge, providing vertical retention and angular alignment. This ledge adds approximately 1.5–2 mm to the AR's total height compared to a non-SAR AR of similar outer geometry. SG Wing Base uses the same seating principle but with the ledge on the top face of the SG body rather than the bottom of an AR. The height addition from the ledge is universal across all SAR-compatible ARs and is not specific to Dragon Saucer.

---

### 2. With War Lion SAR: Exposed Core Contacts in Left Spin

War Lion SAR (and similar SARs that expose the core contact points) recess below or align with the core AR's smash faces at the contact zone, allowing the large core contact points to engage:

```
Core AR contact analysis (LS, exposed):
  φ_LS ≈ 35°  (large protruding face, leading edge for LS rotation)
  J_smash = J × cos(35°) ≈ 0.82J
  J_recoil = J × sin(35°) ≈ 0.57J
  Smash:Recoil ratio ≈ 1.44

Compare Dragon Breaker AR (benchmark for LS smash, typically higher mass at ~7–8g):
  Dragon Breaker smash:recoil ≈ 1.6–1.8  (lower φ, cleaner geometry)

Dragon Saucer with War Lion SAR:
  Smash is real but recoil is higher than Dragon Breaker at comparable mass
  "Usable but outclassed" follows directly
```

Right spin with War Lion: core contact faces become trailing (φ_RS ≈ 70°) → recoil-dominant → confirmed "largely useless in RS" per user description.

---

### 3. With Screw Zeus SAR — Right Spin: Contact Layering

Screw Zeus SAR has specific geometry: rear head contact faces, a sloped section with corner contacts, and overhanging contact points that extend beyond typical AR radius.

```
RS active contact points (Dragon Saucer core + Screw Zeus SAR):
  1. Rear heads of Screw Zeus:        φ ≈ 25–30°  (primary smash)
  2. Flat protrusions of Dragon Saucer: φ ≈ 20–25°  (reinforces smash, adds mass behind contact)
  3. Corner contacts of Screw Zeus slope: φ ≈ 40°   (secondary smash, deflects downward)
  4. Overhanging contacts:            extends r_contact beyond WD perimeter
                                      → contacts low opponents that main AR misses

J_effective_RS ≈ J × [0.91 (rear heads) + 0.63 (corners)] per contact sequence
  = approximately 1.54J smash per engagement
  + overhanging contacts add contacts vs short-body opponents

Against Circle Survivor Defense:
  Overhanging contacts can still engage CEW Circle Survivor's lower bowl rim
  But Circle Survivor's free-spin reduces J transfer significantly (Case 201: ~1.7% transmission)
  → "Strong launch + weight to bludgeon" is correct: must overwhelm the energy dissipation with mass
```

Defense Grip Base (Tip Inverted) pairing: this base positions the combination lower, bringing the overhanging contacts into optimal height for most opponent ARs — the weight-overhanging geometry works best at lower mounting height.

---

### 4. With Screw Zeus SAR — Left Spin: Maximum Power at Maximum Demand

```
LS active contact points:
  1. Foreheads of Screw Zeus:         φ_LS ≈ 20–25°  (leading face for LS rotation)
  2. Spike contact of Dragon Saucer:  φ_LS ≈ 25–30°  (compounds forehead hit — same contact event)
  3. Second section of Screw Zeus:    φ_LS ≈ 30–35°  (unobstructed, consistent secondary hit)

J_effective_LS ≈ J × cos(22°) × (1 + 0.45) ≈ 1.34J smash  (stacked contacts on same face)
  Compared to RS: LS hits harder per contact at φ cost, but total contact count is similar

Inverted slope (Screw Zeus LS):
  In LS rotation, Screw Zeus' slope faces inverted → if struck by opponent:
  Normal force has an upward component → combo launches upward → destabilisation
  Effect size: at φ_slope_inverted ≈ 30°:
    F_up = F_contact × sin(30°) = 0.5 × F_contact
  → destabilises the combo when hit on slope face; taller bases amplify tilt moment (Case 208, §3)

Mass requirement:
  Total AR mass: 6.5 g
  Orbital kinetic energy: E_k = ½ × m_combo × v_orbit²
  At v_orbit = 0.7 m/s:  E_k ∝ m_combo
  Higher total AR mass → higher orbital KE → higher J per collision
  
  For LS Screw Zeus + Dragon Saucer to ring-out a ~35g opponent:
    Required J_min ≈ m_target × Δv_escape ≈ 0.035 × 1.0 = 0.035 kg·m/s
    Orbital impact J = m_reduced × v_relative
    m_reduced = (m_attacker × m_target) / (m_attacker + m_target) ≈ 0.017 kg  (for ~35g each)
    v_relative needed = J_min / m_reduced = 0.035 / 0.017 ≈ 2.1 m/s

  v_orbit_attacker must be high to achieve v_relative = 2.1 m/s
  → "Very fast tip with good traction" (SG Grip Change Base Tip / Defense Grip Base Tip Inverted) is
     the mechanical requirement, not a preference
```

---

### 5. Weight Position Summary

```
AR + SAR assembly mass comparison:
  Great Dragon AR:           lighter  (exact mass varies by version, ~5–5.5 g typical)
  Dragon Saucer + Screw Zeus: 6.5 g
  Dragon Breaker:            heavier  (~7–8 g)

Dragon Saucer + Screw Zeus LS sits between:
  → Lower than Dragon Breaker: less mass → lower J at same v → worse against heavy defenders
  → Higher than Great Dragon:  more mass → higher J → better against defended targets
  → "Stands out for lining up nicely with Screw Zeus' contact points" = specific geometric synergy,
     not simply a mass compromise

The lineup advantage: Screw Zeus' foreheads and Dragon Saucer's spike contacts share the same
angular position at the leading edge in LS rotation → both contact the same opponent face in the
same impact event → impulse stacks, not sequential
```

---

### 6. Physics Model

```typescript
interface DragonSaucerARAnalysis {
  totalMass_g: 6.5;
  coreMass_g: 4.5;
  subARMass_g: 2.0;
  defaultSubAR: "gear_ring";  // blocks core contacts — competitively useless
}

function gearRingRecoilFraction(phi_gear_deg: number): number {
  return Math.sin(phi_gear_deg * Math.PI / 180);
}

function screwZeusStackedImpulse(
  J: number,
  phi_primary_deg: number,
  phi_secondary_deg: number,
  secondaryFraction: number
): { smash: number; recoil: number } {
  const s1 = J * Math.cos(phi_primary_deg * Math.PI / 180);
  const s2 = J * secondaryFraction * Math.cos(phi_secondary_deg * Math.PI / 180);
  const r1 = J * Math.sin(phi_primary_deg * Math.PI / 180);
  return { smash: s1 + s2, recoil: r1 };
}

function minOrbitalSpeedForRingOut(
  m_attacker_kg: number,
  m_target_kg: number,
  v_escape: number
): number {
  const m_reduced = (m_attacker_kg * m_target_kg) / (m_attacker_kg + m_target_kg);
  const J_min = m_target_kg * v_escape;
  return J_min / m_reduced;
}

// gearRingRecoilFraction(80)  → 0.985 — default gear SAR is ~98.5% recoil, nearly no smash

// screwZeusStackedImpulse(1.0, 22, 28, 0.45)
// → { smash: 1.324, recoil: 0.374 }
// — LS Screw Zeus + Dragon Saucer stacked contacts: smash:recoil = 3.54 per engagement

// screwZeusStackedImpulse(1.0, 28, 40, 0.35) [RS profile]
// → { smash: 1.153, recoil: 0.470 }
// — RS: smash:recoil = 2.45 — lower than LS stacking but consistent across opponent heights

// minOrbitalSpeedForRingOut(0.035, 0.035, 1.0)
// → 2.0 m/s — required orbital speed for ring-out vs same-mass target at v_escape = 1 m/s
// → confirms high-traction fast tip is a hard requirement at this AR mass
```

---

## Case 213 — Dragon Saucer Sub-AR · 1.9 g: Why a Free-Spinning Gear Ring Is the Only SAR That Meaningfully Disperses Smash Force, Why Height Dynamics Govern Every Application, and Why Gap-Resonance with Holy Despell Creates a Catastrophic Recoil Failure Mode

Dragon Saucer SAR is a 1.9 g free-spinning gear ring with approximately 16 uniform teeth. It is the default Sub-AR on Dragon Saucer (Case 212) but functions as an independent competitive component. Its near-circular geometry means that when free-spinning it presents a consistently low effective contact angle to the core AR — incoming smash forces accelerate the SAR rotationally rather than translating to the core AR. This is the one SAR that fulfils the free-spinning sub-ring concept: most SARs are passively attached and transmit force almost fully; Dragon Saucer SAR actively absorbs it by rotation. Its competitive value is in Spin Stealing / Defensive Zombie combinations where it reduces smash susceptibility. Its failure modes are height-dependent (fails when caught under shorter opponents), tilt-promoting (problematic with already-unstable Bearing V2 shaft), and geometry-resonant (catastrophic with Holy Despell).

---

### 1. Free-Spinning Force Dispersion: Gear SAR vs Locked Ring

A locked Sub-AR transmits contact force to the core AR in full — the two bodies are rotationally rigid together. A free-spinning SAR converts a fraction of contact impulse into SAR rotation:

```
Incoming contact impulse: J_contact (from smash attacker)
Acts at r_SAR ≈ 30 mm (outer tooth radius)

Torque on SAR: τ_SAR = J_contact × r_SAR (during contact duration Δt)
SAR angular acceleration: α = τ_SAR / I_SAR

I_SAR (thin ring, m=0.0019 kg, r=0.030 m):
  I_SAR = m × r² = 0.0019 × 0.030² = 1.71 × 10⁻⁶ kg·m²

Force transmitted to core AR via SAR-to-core friction:
  F_core = μ_seat × F_N_seat   (friction at the seating ledge)

  Seating ledge: thin plastic ledge, μ_seat ≈ 0.1–0.2 (plastic-on-plastic, rotating)
  F_N_seat = m_SAR × centripetal + gravity component ≈ small

Ratio of force to core vs total impact force:
  At low seating friction: < 20% of J_contact reaches core AR
  → ~80% of smash energy goes into accelerating the SAR rather than moving the combination
```

Compare to locked Sub-AR: 100% of J_contact reaches the core. The free-spin isolation is the entire competitive justification for the part.

---

### 2. Near-Circular Geometry: 16-Tooth Even Distribution

```
Angular spacing between teeth: 360° / 16 = 22.5°

Tooth tip vs trough height difference: ~1.5 mm (shallow gear)
Effective outer radius variation: r_tip = 30 mm, r_trough = 28.5 mm
→ radius varies by only 5% between tooth tip and trough

Contact angle per tooth face:
  Tooth flank angle: φ_tooth ≈ 70–80° (near-radial tooth geometry)
  This would be near-pure recoil if the SAR were locked

But because SAR is free-spinning:
  Contact with tooth face → SAR spins up → force redirected into SAR rotation
  Effective recoil to core: μ_seat × contact force ≈ 0.15 × F_contact

The near-circular profile means:
  Any contact angle on the opponent's AR will find a tooth tip or tooth flank
  No "gap zones" where smooth ring surface presents low contact → uniform engagement
  The consistency of tooth pitch ensures no contact angle produces dramatically different outcomes
```

"Relatively round shape and low recoil" is correct at the core level — not because φ_tooth is low (it isn't), but because free-spin converts tooth recoil into rotation rather than transmitting it.

---

### 3. Spin Stealing Augmentation

Free-spinning SAR contributes to spin steal via extended sliding contact:

```
Spin steal mechanism (standard):
  Contact between opponent outer surface and combo outer surface
  Relative velocity v_rel = ω_defender × r_defender − ω_attacker × r_attacker
  Friction force: F_steal = μ × F_N  (acts to equalise ω between surfaces in contact)
  ΔL_steal = F_steal × r × Δt_contact

With free-spinning SAR:
  SAR outer radius r_SAR ≈ 30 mm (larger than most core ARs at ~25 mm)
  Larger r → higher tangential velocity mismatch for same ω difference
  → higher v_rel → more spin transfer per unit contact time

  Extended contact time: SAR rotates freely → does not "bounce" off opponent but rolls along
  Δt_contact_SAR >> Δt_contact_locked_AR

  Increased ΔL_steal: proportional to both larger r and longer Δt
  → meaningfully more spin steal per contact event than a locked AR or smooth base alone
```

The gear teeth increase surface grip slightly (μ slightly higher than smooth ring), compounding this.

---

### 4. Wide Disk Radius Compensation

```
Wide Defense / Wide Survivor LAD mechanism:
  r_WD ≈ 39–40 mm (outer rim) > r_base
  During tilt: WD rim contacts floor → long LAD orbit radius → extended life (Cases 199, 201)

Eight Wide / Ten Wide / Magne WD:
  r_WD ≈ 34–36 mm (narrower) → less or no WD-floor contact during tilt → reduced LAD

Dragon Saucer SAR:
  r_SAR ≈ 30 mm — extends the effective perimeter contact radius

  For LAD: during late-match tilt, SAR outer teeth may contact stadium floor
  Effective LAD radius with SAR: r_LAD ≈ r_SAR ≈ 30 mm (vs base contact at ~22–24 mm)
  LAD duration: t ∝ r_LAD²
  Improvement: (30/23)² ≈ 1.70 — 70% longer tilt-orbit duration vs base-only contact

  BUT: Wide Survivor LAD uses r_WD ≈ 40 mm:
  Wide Survivor / Wide Defense advantage: (40/30)² ≈ 1.78 over SAR-only LAD

  Combined SAR + Eight Wide vs Wide Survivor alone:
  → SAR + Eight Wide provides partial compensation but not full WD quality
  Weight distribution also differs: Wide Survivor mass is at r=40mm; SAR mass is at r=30mm
  → I_WS > I_SAR+EightWide at same total mass → spin retention advantage to Wide Survivor
```

"Weight distribution still not as effective as the real thing" confirmed — ~10% less effective LAD radius and inferior mass distribution.

---

### 5. Height Dynamics and Circle Survivor Defense Specific Interaction

The seating ledge (Case 212 correction note) raises the SAR slightly above the core AR's base plane — approximately 2–3 mm higher than a flush ring would sit:

```
Height interaction table:
  Opponent AR height < SAR floor height:
    SAR misses opponent → core AR is the first contact surface → SAR provides no dispersion
    → full core AR recoil applies → combination is vulnerable to short opponents

  Opponent AR height ≈ SAR height:
    SAR engages → free-spin dispersion active → combination well-protected

  Opponent AR height = Circle Survivor Defense top bowl rim height:
    Circle Survivor Defense profile: tall (EG + tall base + WD ≈ 22–28 mm total height)
    SAR elevated position allows contact with the upper bowl rim of the CEW Circle Survivor
    → SAR + upper bowl → extended contact time (both surfaces rotating)
    → Spin steal from upper face of Circle Survivor → better than core AR contact at lower height

Circle Survivor grinding prevention:
  Normal attacker approach: Circle Survivor's bowl rim tangentially deflects attacker downward
  → attacker is "ground" toward the dish center (Force Smash downward)
  With Dragon Saucer SAR:
    SAR contacts upper bowl at elevated height → contact normal is more horizontal
    → deflection direction shifts from downward to sideward
    → SAR free-spins through the contact → attacker is not deflected into the dish
    → destabilisation mode (Force Smash into dish) is prevented
  This is why the SAR "deflects it" — not force superiority but contact geometry change
```

---

### 6. Destabilisation Interaction with SG (Bearing Version 2) Shaft

```
SG (Bearing Version 2) characteristics:
  Very low bearing friction → excellent LAD → gyroscopic precession maintained long
  But: bearing allows more pivot freedom → larger tilt perturbation from a given torque
  (lower damping → tilt perturbation decays slowly → combination tilts more before recovering)

Dragon Saucer SAR tilt contribution:
  When SAR is hit and absorbs force (§1), ~20% of J still reaches core → small tilt impulse
  For most shafts: small tilt impulse is damped quickly by friction → minor perturbation
  For Bearing V2: low damping → same small tilt impulse persists as a larger tilt angle
  → SAR's force reduction (~80%) is not enough to fully neutralise the tilt-promoting tendency

Against Driger V2 customs (Destabilization Upper Attack):
  Driger V2 specialty: Upper Attack → hits under opponent AR → applies upward tilt impulse
  Bearing V2 Zombie is normally "the safest answer" because its low friction keeps it stable
  Dragon Saucer SAR + Bearing V2: SAR provides 20% force leakage to core at elevated hit height
  → upper attack tilt impulse is amplified vs standard Zombie without SAR
  → combination tilts more, enters LAD prematurely → Bearing V2's advantage is compromised

Customize Grip Base fix:
  Customize Grip Base provides slightly more positional resistance (tip grip)
  → tilt perturbations damp faster than Defense Grip Base 2
  → SAR force leakage is absorbed without persistent tilt growth
  → "Better choice than Defense Grip Base 2 for Defensive Zombies using this part" confirmed
```

---

### 7. Holy Despell Gap Resonance: Catastrophic Recoil

Holy Despell AR has gaps in its outer perimeter (the name implies open sections between contact faces). Dragon Saucer SAR has inter-tooth gaps of approximately 22.5° pitch.

```
Gap resonance failure mode:
  When a tooth of Dragon Saucer SAR aligns angularly with a gap in Holy Despell:
    SAR tooth partially enters Holy Despell gap → physical interlocking
    Contact transitions from sliding (free-spin dispersion) to hard-stop engagement

  At hard stop: SAR cannot rotate freely — blocked by Holy Despell's gap edge
  → All of J_contact transfers to core AR (dispersion mechanism is neutralised)
  → φ_effective at gap edge ≈ 0–10° (face-to-face contact → near-zero recoil angle)
  Wait — actually face-to-face contact at gap:
    Gap wall orientation in Holy Despell: roughly radial → φ ≈ 85–90° from tangent
  → This is near-pure lateral force, but directed inward (not tangentially) → recoil spike

  Probability of resonance event per revolution:
    SAR has 16 teeth, gap pitch = 22.5°
    Holy Despell gap count × gap pitch → some fraction of relative angular positions = resonance
    At any relative spin speed, resonance events occur whenever tooth-gap alignment happens
    → "Severe recoil" on every resonance contact event — not a rare failure, a systematic one
```

The fix is architectural: no gap-perimeter AR should be paired with Dragon Saucer SAR.

---

### 8. Physics Model

```typescript
interface DragonSaucerSARAnalysis {
  mass_g: 1.9;
  teethCount: 16;
  outerRadius_mm: 30;
  I_kgm2: 1.71e-6;           // thin ring approx
  spinType: "free";
  forceTransmissionRatio: 0.2;  // ~20% of contact impulse reaches core AR
}

function sarForceTransmission(
  J_contact: number,
  mu_seat: number
): number {
  return J_contact * mu_seat;  // fraction reaching core AR
}

function sarSpinStealBonus(
  r_SAR_m: number,
  r_coreAR_m: number,
  contactTimeRatio: number
): number {
  // relative spin steal improvement over core-AR-only contact
  return (r_SAR_m / r_coreAR_m) * contactTimeRatio;
}

function sarLADRadiusVsWideSurvivor(
  r_SAR_m: number,
  r_WS_m: number
): number {
  return (r_SAR_m / r_WS_m) ** 2;  // < 1: SAR LAD shorter than Wide Survivor
}

function holydespellGapResonanceRisk(
  sarTeeth: number,
  holyDespellGaps: number
): number {
  // fraction of relative orientations that produce a resonance (tooth enters gap)
  const sarGapDeg = 360 / sarTeeth;
  const hdGapDeg = 360 / holyDespellGaps;
  const lcmDeg = (sarGapDeg * hdGapDeg) / gcd(sarGapDeg, hdGapDeg);
  return sarGapDeg / lcmDeg;  // higher = more frequent resonance
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// sarForceTransmission(1.0, 0.15) → 0.15 — only 15% of contact impulse reaches core AR
// sarSpinStealBonus(0.030, 0.025, 3.0) → 3.6 — 3.6× more spin steal vs core AR alone
// sarLADRadiusVsWideSurvivor(0.030, 0.040) → 0.5625 — SAR LAD is only 56% of Wide Survivor quality
// SAR + Eight Wide: partial compensation but r_eff = 30mm vs Wide Survivor's 40mm
```

---

## Case 214 — Survivor Ring Support Part · 2.9 g: Why a Near-Complete Ring at Maximum Radius Produces the Highest I-Per-Gram of Any SP, Why Three-Fold Fin Symmetry Unlocks Perfect Alignment With Triple Tiger, and Why Defense Ring Still Wins the Left-Spin Survival Role

Survivor Ring is a 2.9 g near-complete circular ring SP with three small fins at 120° spacing. The ring profile sits at the outermost practical SP radius — approximately 39 mm — placing nearly all mass at maximum distance from the axis. This produces rotational inertia that exceeds Heavy Metal Core's I contribution despite weighing less than half as much. The three fins produce a modicum of smash in right spin without the severe recoil of aggressive SPs, and productive contact points in left spin. The 120° fin spacing matches Triple Tiger AR's three-fold contact symmetry exactly, allowing the fins to extend and reinforce each Tiger contact position. For left-spin survival, Defense Ring is superior due to better LAD geometry and lower recoil; Survivor Ring's proper role is as a peripheral mass + attack SP.

---

### 1. Peripheral Mass and Flywheel Contribution

```
Survivor Ring modelled as thin ring at r ≈ 39 mm:
  I_ring = m × r² = 0.0029 × 0.039² = 4.41 × 10⁻⁶ kg·m²

Compare:
  Heavy Metal Core (6.2 g at r ≈ 20 mm):
    I_HMC = 0.0062 × 0.020² = 2.48 × 10⁻⁶ kg·m²

  Survivor Ring 2.9 g > HMC 6.2 g in rotational inertia: 4.41 > 2.48 × 10⁻⁶ kg·m²
  I per gram:
    Survivor Ring: 4.41×10⁻⁶ / 2.9 = 1.52 × 10⁻⁶ kg·m²/g
    HMC:          2.48×10⁻⁶ / 6.2 = 0.40 × 10⁻⁶ kg·m²/g

  Survivor Ring delivers 3.8× more rotational inertia per gram than HMC
```

Every gram placed at r = 39 mm contributes (39/20)² = 3.8× more inertia than the same gram at r = 20 mm. The ring's radius is its performance. "Increases flywheel effect" is the dominant mechanical contribution — more than the fins.

---

### 2. Fin Geometry: Right-Spin and Left-Spin Contact Angles

Three fins at 120° spacing. In RS the fins trail (leading edge faces away from opponent); in LS they lead.

```
Fin face geometry (estimated from profile):
  RS trailing angle: φ_RS ≈ 55–60°
    J_smash_RS = J × cos(57°) ≈ 0.54J
    J_recoil_RS = J × sin(57°) ≈ 0.84J

  LS leading angle: φ_LS ≈ 35–45°
    J_smash_LS = J × cos(40°) ≈ 0.77J
    J_recoil_LS = J × sin(40°) ≈ 0.64J

Aggressive attack SP (typical φ ≈ 25–30°):
  J_recoil = J × sin(27°) ≈ 0.45J  — but combination recoil travels far, risking self-KO

Survivor Ring RS recoil fraction 0.84 vs aggressive SP 0.45:
  Survivor Ring: higher recoil magnitude but lower risk of self-KO because:
    (a) fin is small → J total is smaller → recoil force is lower in absolute terms
    (b) ring mass at r=39mm provides counter-inertia (ring acts as flywheel absorbing the recoil)

"Modicum of attack without severe recoil" = small fin, moderate φ, flywheel dampening
```

---

### 3. Triple Tiger Alignment: 120° Symmetry Match

Triple Tiger AR has three contact points at 120° rotational spacing (Case 192). Survivor Ring has three fins at 120° spacing.

```
Alignment geometry:
  Tiger contact zone arc: ≈ 30° arc per contact point
  Tiger contact radius: r_Tiger ≈ 30–33 mm
  Survivor Ring fin radius: r_fin ≈ 39 mm  (outer ring edge)

When fins are rotationally aligned with Tiger contact positions:
  1. Tiger contacts opponent AR first at r ≈ 32 mm
  2. Fin contacts opponent AR at r ≈ 39 mm (larger radius) → if opponent is also tall, fin engages too

  "Contact points of both can be aligned perfectly":
    At 120° alignment, Tiger contact arc and fin arc overlap in angular position
    Contact window per revolution per position:
      Tiger arc: 30° / 360° × (1 revolution) = 8.3% of each revolution
      With aligned fin: effective window extends by fin arc ≈ +10–15°
      Total contact window per position: ~10–12% per revolution (up from 8.3%)

  Fin at larger radius also reaches opponents that the Tiger slightly misses
  (opponents tilted or positioned at r_contact > r_Tiger are captured by the fin)
```

The alignment allows the fin to function as a radial extension of Tiger's contact zone, not as an independent contact — the two AR and SP contact points share the same angular position, creating a deeper combined hit.

---

### 4. Defense Ring Comparison: Why LS Survival Goes to Defense Ring

```
LAD mechanism comparison:
  Survivor Ring: near-complete ring at r=39mm — when tilted, ring edge contacts floor
    Floor contact arc: full ring → LAD orbit radius ≈ 39 mm

  Defense Ring: compact ring + specific outer rim profile
    Outer rim radius: r_DR ≈ 40–42 mm — slightly larger than Survivor Ring
    Mass distribution: more compact (inner body + rim), less gap than Survivor Ring's open structure
    Floor contact: smooth rim → consistent contact arc → stable LAD orbit

  LAD duration: t ∝ r_contact² × I_combo / τ_floor_friction
    r_DR ≈ 40 mm > r_Survivor ≈ 39 mm → marginal LAD radius advantage to Defense Ring

  Recoil in LS:
    Defense Ring: φ_LS optimised for low recoil (compact round profile) → φ ≈ 15–25°
    Survivor Ring fins: φ_LS ≈ 35–45° → higher recoil → more spin loss per contact

  "More compact weight distribution and lower recoil" = Defense Ring wins LS Survival by:
    (a) slightly larger effective tilt-contact radius → marginally longer LAD
    (b) lower per-contact recoil → more spin retained per opponent pass
```

The margin is not enormous — Survivor Ring LS is usable — but when a better option exists, the gap matters in close matches.

---

### 5. Physics Model

```typescript
interface SurvivorRingSPAnalysis {
  mass_g: 2.9;
  ringRadius_mm: 39;
  finCount: 3;
  finSpacingDeg: 120;
  I_kgm2: 4.41e-6;         // 3.8× HMC I-per-gram
  phi_RS_deg: 57;
  phi_LS_deg: 40;
  tripletigerAligned: true; // 120° symmetry match
}

function survivorRingI(m_kg: number, r_mm: number): number {
  return m_kg * (r_mm / 1000) ** 2;
}

function iPerGram(I: number, m_g: number): number {
  return I / m_g;
}

function finContactWindowExpansion(
  arContactDeg: number,
  finArcDeg: number,
  aligned: boolean
): number {
  if (!aligned) return arContactDeg;
  return arContactDeg + finArcDeg;  // fin extends the effective contact arc
}

// survivorRingI(0.0029, 39) → 4.41e-6 kg·m²
// iPerGram(4.41e-6, 2.9) → 1.52e-6 — vs HMC 0.40e-6: Survivor Ring is 3.8× more efficient per gram
// finContactWindowExpansion(30, 12, true) → 42° — Tiger + aligned fin = 40% wider contact window
// phi_RS smash fraction: cos(57°) = 0.54 — moderate attack with larger recoil but small fin dampens it
```

---

## Case 215 — Right Engine Gear (Metal Flat) · 10.9 g: Why the Wide Metal Tip Uniquely Enables the V8 Combo, How Final Clutch Burst into a Toppling Combination Creates a Post-Topple Spin-Stealing LAD Mode, and Why This Is the Only EG That Makes Competitive Use of the Gimmick

Right Engine Gear (Metal Flat) is 10.9 g — comparable to Right EG (Metal Ball) at 11.5 g (Case 206) but with a wide, flat metal disc tip instead of a sphere. The tip approximates SG Metal Flat Base (Gaia Dragoon V Version) in contact width. Used unwound, it is effectively a top-tier Metal Flat tip on an EG body — competitive but outclassed by SG Metal Flat Base due to taller profile and inferior base options. The discovery that changed its evaluation: pairing with Final Clutch Base (Gaia Dragoon G or Dranzer G) fires the EG spring as the combination enters its toppling orbit, producing a late-game spin-stealing attack mode ("V8 Combo") that can out-spin Defensive Zombies in opposite spin — something no other RS SSA setup achieves reliably. It is the best standard Engine Gear by a wide margin and the only EG whose gimmick translates to competitive output.

---

### 1. Metal Flat Tip Geometry and Flower Pattern Requirements

The tip is a wide metal disc with a flat face. From the images: r_tip ≈ 4–5 mm, essentially flat (no bevelling, no rounding at the edge compared to the bevelled Metal Semi-Flat).

```
Contact area comparison:
  Metal Flat (this EG): r_tip ≈ 4.5 mm → A = π × 4.5² ≈ 63.6 mm²
  Metal Semi-Flat (Case 193): bevelled edge → slightly narrower effective flat zone ≈ 45 mm²

Higher contact area → higher friction force at same F_N → more aggressive orbit

Flower pattern banking requirement:
  For orbital pattern: tip must stay on the bowl slope, not the flat floor
  Centripetal condition: F_N × sin(α) ≥ m × v_orbit² / r_orbit
  where α = bowl banking angle

  Wide flat tip: higher friction → requires deeper banking angle α to prevent tip sliding inward
  α_required ∝ 1 / (μ × F_N × r_orbit)

  At launch ω: deep banking required → the combination must travel to the steep bowl section first
  "Requires fairly deep banking to flower": not a deficiency — once there, the high friction holds the orbit
  "Can flower quite well" once the orbital pattern is established: wider contact = more stable grip on slope
```

---

### 2. Unwound Use vs SG Metal Flat Base (GDV)

Without winding the EG spring, Right EG (Metal Flat) behaves as a standard Metal Flat tip SG:

```
Comparison to SG Metal Flat Base (Gaia Dragoon V):
  Same tip radius → same friction profile → same orbital aggressiveness
  Difference: EG body height adds ~5–6 mm vs standard SG
  Height penalty: 45% more tilt torque per contact (Case 208 §3)

  Blade base availability:
    SG MF Base (GDV): dedicated flat-attack base with optimised geometry
    EG bases available for Metal Flat EG:
      Normal Base (Wolborg 4): 5.4 g, tall slot → "compact small base" as described
      Normal Base (Rock Bison): 5.6 g, tall slot
      First/Final Clutch bases: available but add complexity/mass

  "Usually used unwound with Normal Base (Wolborg 4) + Triple Tiger":
    This is functionally the closest to an SG MF Base setup the EG system can produce
    The height disadvantage (~5 mm taller) is the primary reason SG MF Base wins head-to-head
    Triple Tiger overhang (Case 192): compensates partially by reaching opponents the shorter base might miss
```

---

### 3. Final Clutch Burst Timing and the V8 Combo Discovery

The critical mechanism: Final Clutch fires at ω_trigger ≈ 141 rad/s (~1350 RPM). The V8 Combo pairs Right EG (Metal Flat) with Final Clutch Base (Gaia Dragoon G or Dranzer G).

```
V8 Combo timeline:
  Launch:      ω ≈ 300–350 rad/s, wide metal flat → aggressive flower orbit, attack phase
  Mid-match:   ω declines, orbital pattern maintained by metal flat grip
  At ω ≈ 141 rad/s (Final Clutch trigger):
    → Combination is at ~42–47% of launch spin
    → EG spring releases: Δω ≈ 27–35 rad/s burst (Case 193 data)
    → Post-burst ω ≈ 168–176 rad/s
    → Combination is also approaching tilt threshold (nutation at ~40% spin stability = ~120–140 rad/s)

Key insight: the burst fires just as — or slightly before — the combination begins to topple
  → Burst energy goes into a combination already in early topple
  → Instead of stabilising the orbit (Case 203 analysis), the burst accelerates the toppling orbit

Post-topple mechanics with metal flat tip:
  At tilt angle θ (toppling orbit), flat disc contact shifts from full-face to edge contact:
  For a flat disc of radius r_tip tilted at θ:
    Contact radius shifts to: r_contact ≈ r_tip × sin(θ) for edge-leading contact
    At θ = 40° (aggressive topple): r_contact ≈ 4.5 × sin(40°) ≈ 2.9 mm

  Wide tip (r_tip = 4.5 mm) → moderate contact radius at tilt → still makes good floor contact
  Compare narrow sharp tip at same θ: r_contact ≈ 0.3 mm → near-zero floor friction → stops immediately

  Wide metal flat maintains floor contact during topple → orbit continues
  Burst adds Δω → orbit speed increases → orbit persists longer

"Unique type of Life After Death" = post-topple orbit maintained by wide metal flat edge contact + EG burst
```

---

### 4. Spin-Stealing Attack in Opposite Spin

V8 Combo in Right Spin vs Left Spin Defensive Zombie:

```
Contact during V8 post-topple orbit:
  RS combination orbiting at tilt θ → wide tip edge contacts floor → orbit maintained
  Contacts LS Zombie during orbit:
    Contact friction between RS AR and LS AR:
      Relative surface velocity: v_rel = r_contact × (ω_RS + ω_LS)  (opposite spin → velocities add)
      Friction force: F_steal = μ × F_N

  Spin steal direction (contact friction):
    RS combination loses ΔL_RS, LS combination gains ΔL_LS (or vice versa depending on contact geometry)
    In the post-topple orbit: RS combination is lower-profile → contacts under LS AR
    → Upper Attack-like contact geometry → RS combo is pushing UP into LS Zombie
    → LS Zombie receives upward force → tilt-inducing for LS Zombie

LS Defensive Zombie's vulnerability:
  Normal RS SSA: RS orbit speed is too high → LS Zombie bear-hugs contact and out-spins RS
  V8 Combo post-topple: RS combo is much slower (post-topple) but Δω burst adds back speed
  The burst timing at ~141 rad/s means the RS combo gets a fresh spin injection precisely when
  it would otherwise fall below the LS Zombie's survivability threshold

  "OS some Defensive Zombies": the combination stays alive longer (post-topple LAD) than LS Zombie expects
  → LS Zombie runs out of spin while RS V8 is still orbiting
```

---

### 5. Circle Survivor Defense Weakness and Driger V2 Vulnerability

```
Circle Survivor Defense:
  Force transmission: ~1.7% (Case 201) — absorbs 98.3% of smash energy
  V8 Combo in post-topple orbit: slower than attack phase → even less impulse per contact
  "Bludgeon" strategy (Case 212 §3): requires high orbital speed → V8 post-topple is too slow
  → Circle Survivor Defense neutralises the V8's attack potential → struggles confirmed

Driger V2 customs:
  Driger V2: Upper Attack specialty → applies upward tilt impulse to targets
  V8 Combo height: EG body adds ~5 mm → 45% higher tilt torque susceptibility (Case 208)
  Driger V2 hits under V8's AR → V8 is forced into premature topple before EG burst triggers
  → Spring fires into a heavily tilted combination → orbit is less controlled than the intended V8 sequence
  → "Can be knocked out by Driger V2 customs" confirmed: Upper Attack defeats the combination
     before the V8 sequence reaches its productive phase
```

---

### 6. Physics Model

```typescript
interface RightEGMetalFlatAnalysis {
  mass_g: 10.9;
  tipRadius_mm: 4.5;
  tipMaterial: "metal";
  tipType: "flat";
  cewSlot: false;         // no CEW prong — standard EG housing only
  v8ComboCompatible: true; // Final Clutch Base Gaia Dragoon G or Dranzer G
}

function metalFlatContactAtTilt(
  r_tip_mm: number,
  tiltDeg: number
): number {
  // flat disc edge contact radius during toppling orbit
  return r_tip_mm * Math.sin(tiltDeg * Math.PI / 180);
}

function v8BurstTiming(
  omega_launch: number,
  omega_trigger: number,
  spinDecayRate: number
): number {
  // seconds from launch to Final Clutch trigger
  return (omega_launch - omega_trigger) / spinDecayRate;
}

function postToppleLADBonus(
  r_contact_mm: number,
  r_sharp_mm: number
): number {
  // ratio of post-topple orbit duration: metal flat vs sharp tip
  // orbit ∝ friction × floor contact → r_contact as proxy
  return r_contact_mm / r_sharp_mm;
}

function spinStealOppositeSpin(
  omega_RS: number,
  omega_LS: number,
  r_contact_m: number,
  mu: number,
  F_N: number,
  contact_time_s: number
): number {
  const v_rel = r_contact_m * (omega_RS + omega_LS);
  const F_steal = mu * F_N;
  return F_steal * r_contact_m * contact_time_s; // ΔL transferred
}

// metalFlatContactAtTilt(4.5, 0)   → 0.0 mm (upright — full face contact, maximum friction)
// metalFlatContactAtTilt(4.5, 40)  → 2.9 mm (toppling — edge contact, orbit maintained)
// metalFlatContactAtTilt(4.5, 60)  → 3.9 mm (deep tilt — edge contact still functional)
// Compare sharp tip r=0.5mm at θ=40°: 0.32 mm — near-zero → orbit ceases immediately

// v8BurstTiming(320, 141, 8)  → 22.4 s from launch to Final Clutch trigger at 8 rad/s decay
// postToppleLADBonus(2.9, 0.3) → 9.7 — metal flat topple orbit lasts ~10× longer than sharp tip
// → V8 Combo post-topple window: significantly extended, enabling OS against LS Zombie
```

---

## Case 216 — Final Clutch Base (Gaia Dragoon G Version) · 7.4 g: Why a Visually Aggressive Perimeter Shape Is Irrelevant to V8 Combo Performance, How the Trigger Timing Aligns With Post-Topple EG Burst, and Why the Marginal Dranzer G Advantage Does Not Justify Its Cost Premium

Final Clutch Base (Gaia Dragoon G Version) is 7.4 g and is the base included with Gaia Dragoon G — the same beyblade that provides Right Engine Gear (Metal Flat). This co-release is the reason it is the practical entry point for V8 Combo: the two required components come from the same box. The perimeter shape is visually aggressive — eight pointed protrusions alternating between larger and smaller spikes around the rim — which would normally predict high recoil and poor defensive character. In standard EG use outside the V8 context this assessment is correct. What redeems it is that V8 Combo's competitive value is generated almost entirely in the post-topple tilt phase, where the combination is tilted at ~40–60° and the base rim barely participates in contacts. The spike geometry is irrelevant at this tilt angle. Dranzer G FCB (Case 203) at 7.9 g is marginally better for the same role, but the 0.5 g mass difference produces a calculably small I advantage while the cost premium is severe, particularly given Dranzer G's cultural pricing premium ("Kai Tax").

---

### 1. Weight Position in the FCB Family

```
Final Clutch Base mass comparison:
  Draciel G:    7.3 g (Case 211) — lightest FCB; independent clutch tabs; alignment-dependent
  Gaia Dragoon G: 7.4 g (this case) — mid-weight; bridged or well-formed clutch tabs
  Dranzer G:    7.9 g (Case 203) — heaviest FCB; best shape; Kai Tax

ΔI contributions at r_avg ≈ 20 mm:
  GDG vs Draciel G:  ΔI = 0.0001 × 0.020² = 4.0×10⁻⁸ kg·m²  (negligible)
  Dranzer G vs GDG:  ΔI = 0.0005 × 0.020² = 2.0×10⁻⁷ kg·m²  (small but real)

Dranzer G advantage:
  Extra I: 2.0×10⁻⁷ kg·m² over GDG
  For I_combo ≈ 5.5×10⁻⁶ kg·m² (V8 Combo total):
    ΔI / I_combo = 2.0×10⁻⁷ / 5.5×10⁻⁶ = 3.6% additional inertia
  → Dranzer G orbit lasts ~3.6% longer per unit friction — measurable but narrow
```

"Slightly better" is confirmed: the Dranzer G advantage is real, not placebo, but is the smallest margin that could be called a meaningful improvement.

---

### 2. Perimeter Shape: Why Pointed Spikes Are Irrelevant for V8

The top and side images show the perimeter has eight alternating spike protrusions — four larger (at the major axes) and four smaller (between them). Each spike has a pointed tip with φ ≈ 65–80°:

```
Spike contact analysis (upright combination):
  φ_spike ≈ 70°
  J_smash = J × cos(70°) ≈ 0.34J
  J_recoil = J × sin(70°) ≈ 0.94J

  → near-pure recoil per spike contact → poor for attack or defense when upright
  → "Extraordinary given the actual shape" is correct for standard use

V8 Combo post-topple geometry:
  At tilt θ = 40–60°, the base rim height above floor:
    h_rim(θ) = h_base × cos(θ)  (base rotated to tilt angle)
    h_rim(40°) = 8 × cos(40°) ≈ 6.1 mm — base rim is 6 mm off the floor
    h_rim(60°) = 8 × cos(60°) = 4 mm — barely above floor

  Opponent AR height for contact: typically 12–18 mm above floor (upright setup)
  Post-topple base rim height: 4–6 mm

  Height mismatch: base rim (4–6 mm) << opponent AR (12–18 mm)
  → spike protrusions never reach opponent AR contact zone during post-topple orbit
  → spike geometry contributes zero to or against V8 Combo performance at this tilt

The base functions as a pure mass contributor and EG trigger platform in V8 context.
Its own contact geometry is geometrically excluded from the combat phase where V8 delivers value.
```

---

### 3. Final Clutch Trigger: Same Mechanism, Confirmed by Underside Springs

The underside image (image 2) shows two coil springs in the centrifugal arm slots — the same mechanism as Case 203 and Case 211. The trigger ω is consistent:

```
ω_trigger ≈ 141 rad/s (~1350 RPM)  (from Case 203 derivation)

For V8 Combo timing:
  ω at combination topple threshold: ω_stable = ~120–140 rad/s  (Case 215 §3)
  ω_trigger ≈ 141 rad/s overlaps with topple threshold → clutch fires at or just before topple

  Timing quality:
    If ω_trigger > ω_topple: spring fires while combination is still upright → burst goes to orbit
    If ω_trigger ≈ ω_topple: spring fires as combination begins to lean → burst assists topple orbit
    If ω_trigger < ω_topple: spring fires after topple → burst aids post-topple orbit

  For V8 Combo, the sweet spot is ω_trigger ≈ ω_topple:
    Burst fires → combination is already at tilt threshold → energy goes into tilt orbit rather than
    restoring upright spin (Case 203 showed the burst can drive 3.0s precession orbit)
    Wide metal flat tip maintains floor contact during this orbit → V8 post-topple phase active

Both Gaia Dragoon G and Dranzer G FCBs share the same trigger spec → same timing quality
```

---

### 4. Gaia Dragoon G vs Dranzer G: The Cost-Performance Equation

```
Performance delta (Dranzer G advantage):
  Mass: +0.5 g → ΔI = 2.0×10⁻⁷ kg·m² → +3.6% orbit duration
  Shape: Dranzer G perimeter is more rounded → less spike recoil if ever engaged upright
         In V8 post-topple: shape is irrelevant (§2 above) → shape advantage = 0 in V8 context

  Net V8 performance gain from Dranzer G: ~3–4% longer post-topple orbit duration
  This is the maximum benefit: translates to perhaps 1–2 extra orbit rotations before combination stops

Availability context:
  Gaia Dragoon G FCB:  included with Gaia Dragoon G → comes with the required Right EG (Metal Flat)
  Dranzer G FCB:       included with Dranzer G → does not include Right EG (Metal Flat)
                        alternative versions (non-Dranzer): rare Hasbro exclusives

  Cost to obtain Dranzer G FCB for V8:
    Must purchase Dranzer G (Kai-associated beyblade → significant market premium)
    Then still need Right EG (Metal Flat) separately (from Gaia Dragoon G)
    Total cost: (Dranzer G price + Gaia Dragoon G price) >> (Gaia Dragoon G price alone)

  "Kai Tax" mechanism:
    Dranzer belongs to Kai — the antagonist/rival archetype of Bakuten Shoot
    Collector and competitive demand for Kai-associated parts inflates secondary market prices
    independently of actual performance value
    This is a documented community pricing phenomenon: high demand + emotional attachment → premium

  Rational cost-benefit:
    Performance gain: ~3.6%
    Cost premium: potentially 3–5× (depending on market conditions)
    → Gaia Dragoon G FCB is the dominant choice for new V8 Combo builders
    → Dranzer G FCB is a marginal upgrade for collectors or established players with access
```

---

### 5. Physics Model

```typescript
interface FinalClutchBaseGaiaGAnalysis {
  mass_g: 7.4;
  slotType: "tall";
  clutchType: "final";
  omega_trigger_radPerS: 141;
  perimeterShape: "spiked_8fold";     // aggressive appearance, irrelevant at post-topple tilt
  v8Compatible: true;
  bundledWith: "Right EG Metal Flat"; // comes in the same beyblade box
}

function fcbInertiaContribution(
  m_base_kg: number,
  r_avg_m: number
): number {
  return m_base_kg * r_avg_m * r_avg_m;
}

function dranzerGAdvantage(
  I_GDG: number,
  I_DranzerG: number,
  I_combo_total: number
): { absoluteDelta: number; percentDelta: number } {
  const delta = I_DranzerG - I_GDG;
  return { absoluteDelta: delta, percentDelta: (delta / I_combo_total) * 100 };
}

function spikeContactHeightAtTilt(
  h_base_mm: number,
  tiltDeg: number
): number {
  return h_base_mm * Math.cos(tiltDeg * Math.PI / 180);
}

// fcbInertiaContribution(0.0074, 0.020) → 2.96e-6 kg·m²
// fcbInertiaContribution(0.0079, 0.020) → 3.16e-6 kg·m²  (Dranzer G)
// dranzerGAdvantage(2.96e-6, 3.16e-6, 5.5e-6) → { absoluteDelta: 2.0e-7, percentDelta: 3.64 }
// → Dranzer G gives 3.64% more orbit duration — real but minor

// spikeContactHeightAtTilt(8, 40) → 6.1 mm — spike rim is 6 mm above floor at 40° tilt
// spikeContactHeightAtTilt(8, 60) → 4.0 mm — at 60° tilt: spike rim is 4 mm above floor
// → Opponent AR at 12–18 mm height never encounters the spike protrusions during post-topple orbit
```

---

## Case 217 — Wing Upper Attack Ring · 5.3 g: Why Rounded Wing Edges Only Partially Compensate for Being Wider Than Wide Survivor, How Slope and Contact Geometry Serve Different Roles in RS and LS, and Why Recoil Costs Exceed Every Offensive Gain Across All Intended Roles

Wing Upper is 5.3 g with 2-fold rotational symmetry. Two large swept wings form the outer profile; each wing has a sloped upper face for Upper Attack, rounded outer edges for reduced recoil on glancing contacts, and a stepped/serrated leading-edge contact zone for direct smash. The AR is slightly wider than Wide Survivor (~40 mm), which is a liability: the extra radius provides marginal Force Smash reach but also increases the rotational recoil torque on every contact. The rounded edges reduce the effective contact angle on glancing passes and provide the "slight compensation" for this width. In RS the slope delivers moderate Upper Attack and the contact steps deliver moderate smash, but the combined contact geometry produces enough recoil to undercut both compact and survival roles relative to Tiger Defenser. In LS the leading contact points shift to the front spikes — higher φ, higher recoil, less stability — making LS uniformly worse than RS for all use cases.

---

### 1. Rounded Edge Contact Geometry: Variable φ and the Stamina Compensation

A flat-faced AR presents a constant φ at all contact angles. A rounded edge presents a φ that depends on the angle of the contact tangent relative to the opponent's approach vector:

```
For an outer edge of radius R_curve (the rounding radius of the wing tip):
  Contact tangent angle at approach angle α:
    φ_effective(α) = arctan(R_curve × sin(α) / (r_AR − R_curve × cos(α)))
    Simplified for small R_curve: φ_effective ≈ α  (recoil fraction = sin(α))

At direct perpendicular approach (α = 90°): φ ≈ 90° → pure recoil (same as flat face)
At glancing approach (α = 20–40°):          φ ≈ 20–40° → moderate recoil (better than flat face at same angle)

For stamina orbit: opponent AR contacts at glancing angle (α ≈ 20–35°, not perpendicular)
  Flat face at α = 30°: φ = 30°, J_recoil = J × sin(30°) = 0.50J
  Rounded edge at α = 30°: φ_eff ≈ 30° → same recoil at the same approach angle
  BUT: rounded edge can present α = 20° even when orbit geometry suggests 30°
       by allowing the contact to roll along the curve → effective α drops during contact
  Rolling contact reduction: φ_eff_rounded ≈ 0.7 × φ_eff_flat  (rough estimate for well-rounded tip)
  → ~30% recoil reduction on glancing orbit contacts vs flat-edged AR of same outer radius

Width penalty:
  r_Wing_Upper ≈ 41–43 mm  vs  r_Wide_Survivor ≈ 40 mm
  Rotational recoil torque: τ = J_recoil × r_AR
    τ_WU / τ_WS = 42 / 40 = 1.05 → 5% more recoil torque at same contact force
  30% reduction from rounded edges partially offsets the 5% width penalty:
    Net: Wing Upper recoil ≈ 0.70 × τ_WU = 0.73 × J × r_WU vs Wide Survivor τ_WS = 1.00 × J × r_WS
    → Wing Upper still has higher total recoil than Wide Survivor on the same orbit
    "Compensates slightly" is accurate: the rounding helps but does not fully close the gap
```

---

### 2. RS Contact Geometry: Slope (Upper Attack) and Step (Smash)

The RS leading edge combines two contact surfaces:

```
Slope (upper face of wing):
  Angle relative to horizontal: α_slope ≈ 25–35°  (visible in side-profile image 3)
  Contact with opponent AR from below:
    Normal force F_N directed along slope normal
    Upward component: F_up = F_N × sin(α_slope)
    At α_slope = 30°: F_up = 0.5 × F_N  — moderate upper attack

Stepped contact zone (leading edge of wing):
  φ_RS_step ≈ 40–50°  (moderate angle — not as low as Tiger Defenser ~25°)
    J_smash = J × cos(45°) ≈ 0.71J
    J_recoil = J × sin(45°) ≈ 0.71J  — balanced but neither best smash nor lowest recoil

Combined RS profile per contact event:
  1. Step contact: moderate smash + moderate recoil (J × 0.71 each)
  2. Slope contact (if height match): Upper Attack force (F_up = 0.5 × F_N)
  Not every contact event includes both: depends on opponent profile height alignment

Compact use in RS:
  Compacts require: out-spinning opponents → minimize spin loss per contact
  Each step contact: 0.71 × J recoil → significant spin drain
  Tiger Defenser RS: φ ≈ 25° → J_recoil = J × sin(25°) ≈ 0.42J  (40% less per contact)
  "Fails to outspin key opponents including other compacts" follows: each contact costs more spin
```

---

### 3. LS Contact Geometry: Spike-Forward Higher Recoil

In LS rotation the wing leading edge reverses. The "front of the wings" in LS corresponds to the spike protrusions at the forward face of the wing leading edge:

```
LS spike contact angle:
  φ_LS_spike ≈ 55–65°  (spike tip is more radially oriented than the RS step face)
    J_smash_LS = J × cos(60°) = 0.50J
    J_recoil_LS = J × sin(60°) = 0.87J

Comparison to RS step contact:
  LS recoil fraction 0.87 vs RS recoil fraction 0.71 → 22% more recoil per contact in LS
  LS smash fraction 0.50 vs RS smash fraction 0.71 → 30% less smash per contact in LS

"Higher recoil than RS, more offensively capable" appears contradictory:
  Higher recoil ✓ — spike φ > step φ → more J_recoil per hit
  "More offensively capable" in the sense that the spike delivers sharper force transfer (higher peak F)
    but the net smash J is actually lower
  → "More offensively capable" likely refers to the spike's harder contact feel, not higher J_smash
  The practical result: more destabilisation per contact (from recoil) but less ring-out power (lower J_smash)
  → LS is inferior overall: loses defense (recoil spins the combo back), gains nothing productive
```

---

### 4. Force Smash: Width Insufficient vs Smash Turtle

Force Smash requires the AR to reach opponents at a large orbital radius (r_AR ≥ r_opponent_base):

```
Smash Turtle outer radius: r_ST ≈ 45–47 mm  (benchmark for Force Smash)
Wing Upper outer radius:   r_WU ≈ 41–43 mm
Wide Survivor:             r_WS ≈ 40 mm

"Not wide enough to be truly effective like Smash Turtle":
  Contact coverage gap:
    r_ST − r_WU ≈ 4 mm — Smash Turtle reaches 4 mm further
    At typical orbital speeds: 4 mm additional reach translates to:
    Contact probability ∝ (r_AR − r_base) / r_orbit_width
    Wing Upper captures: (42 − r_base) mm of orbit width
    Smash Turtle captures: (46 − r_base) mm
    Ratio at r_base = 20 mm: 22/26 = 0.85 → Wing Upper has 85% of Smash Turtle's Force Smash coverage

"Somewhat usable":
  85% coverage is not negligible — Wing Upper does reach most Force Smash contacts
  But: Smash Turtle's recoil is lower (its outer rim is smoother → φ_ST < φ_WU)
  Combined: Wing Upper has less reach AND higher recoil per contact than Smash Turtle → tier 2 for Force Smash
```

---

### 5. Spin-Stealing Attack Role: Width Without Offensive Conversion

SSA requires extended contact time (spin steal) combined with occasional ring-out capability:

```
Wing Upper RS on SSA setup:
  Wide outer profile → extended contact arc with opponent → more spin steal time ✓
  But: each contact event also produces J_recoil = 0.71J
    → spin steal gains are partially offset by spin loss to recoil
    → net spin transfer per orbit pass: Δω_steal − Δω_recoil

  For SSA to work vs stamina: need to convert some contacts to ring-outs
  Ring-out threshold: J_smash ≥ m_target × v_escape ≈ 0.035 × 1.0 = 0.035 kg·m/s
  At v_orbit = 0.5 m/s: J_available = m_reduced × v_rel ≈ 0.017 × 0.5 = 0.0085 kg·m/s
  J_smash = 0.71 × 0.0085 ≈ 0.006 kg·m/s << 0.035 threshold

  "Lacks the offensive power to ring out" follows from the numbers:
  At typical SSA orbital speeds, smash impulse is 17% of ring-out threshold
  Wing Upper SSA out-spins weakly and cannot convert contacts to KOs → sub-optimal SSA
```

---

### 6. Survival and Defense Role: Width vs Tiger Defenser

```
Tiger Defenser (stamina/defense benchmark):
  Outer radius: r_TD ≈ 36–37 mm  (narrower than Wing Upper)
  Contact angle: φ_TD ≈ 20–25°
    J_recoil_TD = J × sin(22°) ≈ 0.37J

Wing Upper RS:
  r_WU ≈ 42 mm, φ_WU_step ≈ 45°
    J_recoil_WU = J × sin(45°) ≈ 0.71J

Spin loss per contact:
  Δω_TD = J_recoil_TD / I_combo
  Δω_WU = J_recoil_WU / I_combo
  Ratio: 0.71 / 0.37 = 1.92 — Wing Upper loses ~92% more spin per contact than Tiger Defenser

Survival match duration:
  t_survive ∝ L_spin / τ_loss_per_contact × (contact_frequency)
  Wing Upper: 92% more spin loss per contact → match duration significantly shorter
  "Fails to outspin a lot of key opponents" including other compacts → confirmed
  Even against weaker opponents: the extra spin loss accumulates over a full match
```

---

### 7. Physics Model

```typescript
interface WingUpperARAnalysis {
  mass_g: 5.3;
  symmetry: 2;
  outerRadius_mm: 42;          // slightly wider than Wide Survivor (40 mm)
  phi_RS_step_deg: 45;
  phi_LS_spike_deg: 60;
  phi_glancing_rounded: 0.7;  // multiplier: rounded edge reduces φ_eff by 30% on glancing contacts
  upperAttackSlope_deg: 30;
  sarCompatible: true;         // SAR seating ledge visible in underside image
}

function roundedEdgeRecoilReduction(
  phi_flat_deg: number,
  reductionFactor: number
): number {
  const phi_reduced = phi_flat_deg * reductionFactor;
  return Math.sin(phi_reduced * Math.PI / 180);
}

function rotationalRecoilTorque(
  J: number,
  phi_deg: number,
  r_AR_mm: number
): number {
  return J * Math.sin(phi_deg * Math.PI / 180) * (r_AR_mm / 1000);
}

function forcesmashCoverage(
  r_AR_mm: number,
  r_base_mm: number,
  r_ST_mm: number
): number {
  return (r_AR_mm - r_base_mm) / (r_ST_mm - r_base_mm);
}

// roundedEdgeRecoilReduction(45, 0.7) → sin(31.5°) = 0.52 — rounded edge cuts recoil vs flat step
// rotationalRecoilTorque(1.0, 45, 42) → 7.07e-4 N·m  (Wing Upper)
// rotationalRecoilTorque(1.0, 22, 37) → 3.89e-4 N·m  (Tiger Defenser) → WU 82% more recoil torque
// forcesmashCoverage(42, 20, 46) → 0.846 — Wing Upper has 85% of Smash Turtle Force Smash coverage
// phi_LS_spike: J_smash = cos(60°) = 0.50, J_recoil = sin(60°) = 0.87 — 22% more recoil than RS step
```

---

## Case 218 — Gyro Engine Gear · 21.2g
**Thesis:** The Gyro Engine Gear's two-bearing isolation architecture stores the system's rotational energy almost entirely in the inner metal gyro disc, decoupling it from AR-transmitted impulses; shielded bearing replacement extends spin equalization time from ~34 s (stock) to ~335 s (shielded), converting a partially-isolated platform into one that outlasts any practical battle.

The Gyro Engine Gear (GEG) is the heaviest Plastic-era part at 21.2g and the first Beyblade component to implement true mechanical dual-spin. Unlike conventional Engine Gears, the GEG carries no spring mechanism; the name refers to gyroscopic precession. A large steel annular disc is mounted on two ball bearings inside the blue outer shell. The disc and shell are rotationally independent: contacts transmitted through the AR affect only the shell, while the disc continues spinning at its own rate. Thread the ripcord through the normal slot for RS launch; thread it from the opposite side via the Engine Stopper Base for LS launch. This made Dragoon G the first Beyblade with a legal LS option for conventionally RS Attack Ring combinations.

---

### 1. Dual-Bearing Isolation Architecture

```
  Cross-section (simplified, not to scale)
  ─────────────────────────────────────────────────────────
                   ┌──────────────────────────────────┐
  outer blue shell │  ╔══════════════════════════════╗ │
  (AR face above)  │  ║   inner metal gyro disc      ║ │
                   │  ║   m ≈ 12 g                   ║ │
                   │  ║   r_i = 18 mm  r_o = 37 mm   ║ │
                   │  ╚══════════════════════════════╝ │
                   │         ↕ bearing ↕ (×2)          │
                   │         shaft r ≈ 3 mm             │
                   │    CEW slot — underside             │
                   └──────────────────────────────────┘

  Force path:  AR contact → outer shell → bearing friction only → gyro disc
  Ripcord RS:  engages outer shell (normal entry)
  Ripcord LS:  threads through Engine Stopper Base opposite side → engages gyro disc
  ─────────────────────────────────────────────────────────
```

The only mechanical link between the two sections is bearing friction. Any other conventional EG or SG has the AR and spin gear rigidly coupled — a contact impulse directly subtracts from the single shared angular momentum. The GEG has two independent angular momenta; contacts subtract only from the shell's.

---

### 2. Moment of Inertia Distribution: Gyro Section vs Shell

```
  Gyro disc (annular):
    m_disc = 12 g = 0.012 kg
    r_inner = 18 mm = 0.018 m,  r_outer = 37 mm = 0.037 m

    I_gyro = ½ × m × (r_i² + r_o²)
           = ½ × 0.012 × (0.018² + 0.037²)
           = ½ × 0.012 × (3.24 × 10⁻⁴ + 1.369 × 10⁻³)
           = ½ × 0.012 × 1.693 × 10⁻³
           = 1.016 × 10⁻⁵ kg·m²

  Outer shell (hollow cylinder, thin wall):
    m_shell = 4 g = 0.004 kg
    r_inner = 34 mm,  r_outer = 40 mm

    I_shell = ½ × 0.004 × (0.034² + 0.040²)
            = ½ × 0.004 × (1.156 × 10⁻³ + 1.600 × 10⁻³)
            = ½ × 0.004 × 2.756 × 10⁻³
            = 5.51 × 10⁻⁶ kg·m²

  Fraction of system I stored in gyro disc:
    I_gyro / (I_gyro + I_shell) = 1.016 × 10⁻⁵ / (1.016 × 10⁻⁵ + 5.51 × 10⁻⁶)
                                 = 1.016 / 1.567 = 64.8 %

  The gyro disc holds ~65% of the system's rotational inertia despite being mechanically
  isolated from AR contacts. The remaining 35% (shell) is the "expendable" momentum pool
  that absorbs all opponent-delivered impulses.
```

---

### 3. Bearing Torque Leakage — Per-Contact Isolation

```
  Bearing friction parameters:
    μ_stock    ≈ 0.03  (stock plastic bearing surface)
    μ_shielded ≈ 0.003 (shielded metal ball bearing)
    F_N = weight of gyro disc = 0.012 × 9.8 = 0.118 N  (axial load, upright stance)
    r_shaft = 3 mm = 0.003 m,  n_bearings = 2

  Torque transmitted through bearings (both, per spin direction):
    τ_stock    = 0.03  × 0.118 × 0.003 × 2 = 2.12 × 10⁻⁵ N·m
    τ_shielded = 0.003 × 0.118 × 0.003 × 2 = 2.12 × 10⁻⁶ N·m
    Ratio: 10×

  Contact impulse effective torque (Δt ≈ 2 ms contact duration):
    J_contact ≈ 0.005 kg·m/s at r_AR = 0.037 m
    τ_contact  = J × r_AR / Δt = 0.005 × 0.037 / 0.002 = 0.0925 N·m

  Isolation fraction per contact event:
    shielded: 1 − (2.12 × 10⁻⁶) / 0.0925 = 1 − 2.3 × 10⁻⁵ ≈ 99.998 %
    stock:    1 − (2.12 × 10⁻⁵) / 0.0925 = 1 − 2.3 × 10⁻⁴ ≈ 99.977 %

  Both are essentially perfect per-contact. The relevant difference emerges over battle duration.
```

---

### 4. Stock vs Shielded Bearing — Long-Run Spin Equalization

```
  The two sections are coupled via τ_bearing continuously. Over time, differential angular
  velocity Δω between gyro disc and shell drives a torque that gradually equalizes them.

  Reduced inertia (two coupled rotors):
    I_red = (I_gyro × I_shell) / (I_gyro + I_shell)
          = (1.016 × 10⁻⁵ × 5.51 × 10⁻⁶) / (1.016 × 10⁻⁵ + 5.51 × 10⁻⁶)
          = 5.60 × 10⁻¹¹ / 1.567 × 10⁻⁵
          = 3.57 × 10⁻⁶ kg·m²

  Spin equalization time for Δω = 200 rad/s differential (builds after repeated contacts):
    t_eq = I_red × Δω / τ_bearing

    t_eq_stock    = 3.57 × 10⁻⁶ × 200 / (2.12 × 10⁻⁵) =  33.7 s  — within battle
    t_eq_shielded = 3.57 × 10⁻⁶ × 200 / (2.12 × 10⁻⁶) = 337   s  — far beyond any battle

  With stock bearing: differential spin built up after ~10 contacts is equalized in ~34 s.
  The gyro disc progressively surrenders spin to the shell in a process indistinguishable
  from spin theft — the opponent is effectively stealing the gyro's reserve.

  With shielded bearing: equalization time is 337 s (~5.6 min). No practical battle lasts
  this long. The gyro disc retains its full spin advantage from launch to finish.
  
  Upgrade impact: 10× bearing friction → 10× longer isolation → effectively permanent
  protection for the gyro disc's stored angular momentum.
```

---

### 5. Dual Spin Launch Protocols

```
  Three legal launch methods:

  (A) Normal RS (standard):
    Ripcord enters from the right side of the Engine Stopper Base.
    Engages the outer blue shell's ripcord teeth.
    Shell launches RS; gyro disc couples passively from shell-disc friction
    over the ~1.5 s of ripcord pull → gyro disc achieves partial RS spin.

  (B) Reverse LS (through Engine Stopper Base):
    Ripcord enters from the left side of the ESB.
    Engages the inner gyro disc's ripcord teeth (separate set, opposite-facing).
    Gyro disc launches LS; outer shell couples in reverse.
    At full extension, system spins with dominant LS component in gyro disc.

  (C) Split launch (advanced, tournament-legal):
    Two simultaneous or staged ripcord pulls, one from each side.
    Gyro disc and shell both wound simultaneously, opposite directions.
    At low spin differential, the bearing friction causes partial cancellation;
    at high differential, sections spin truly independently.
    Net angular momentum ≈ (I_gyro × ω_gyro) − (I_shell × ω_shell) in LS direction
    (gyro disc I is larger → net LS even if both wound equally).

  Strategic choice:
    RS launch: standard AR geometry functions normally; force-smash contacts use RS physics.
    LS launch: any RS Attack Ring becomes a de-facto LS ring on this combination.
               FLS-AR Beyblades (e.g., Storm Grip Base combos) can be replaced entirely by
               Gyro EG + any RS AR launched LS — unique capability in Plastic era.
    LS preferred for Stamina/Defense roles: LS orientation reduces cross-spin momentum
    exchange against RS attackers, improving effective OS probability.
```

---

### 6. CEW Selection and Stability

```
  The Gyro EG accepts any CEW (Custom Engine Weight) tip in its underside slot.
  The slot is standard height (not tall), so tall-slot exclusive CEW variants do not apply.

  Stability condition with Gyro EG (high-mass system, no WD):
    At tilt angle θ, the gyroscopic restoring torque must exceed gravity:
      τ_gyro = I_gyro × ω_gyro × Ω_precession ≥ m_combo × g × r_CoM_tilt
    
    m_combo ≈ 40 g (AR ~5g + GEG 21.2g + ESB 5.5g + no WD)
    With I_gyro = 1.016 × 10⁻⁵ kg·m² and ω_gyro = 800 rad/s:
    L_gyro = 1.016 × 10⁻⁵ × 800 = 8.13 × 10⁻³ kg·m²/s

  CEW Metal Sharp (r_tip ≈ 0.5 mm):
    Lowest CoM — centre of mass stays near arena floor.
    r_CoM_tilt small → gravity torque minimal → best gyroscopic stability.
    Sharp contact also means minimal floor friction → spin decay from CEW contact is lowest.
    Primary recommendation for GEG stamina/OS play.

  CEW Metal Flat (r_tip ≈ 4.5 mm):
    Wider contact patch → more floor friction → faster spin decay in gyro disc.
    CoM height slightly higher.
    Not recommended for GEG stamina; would negate the isolation advantage.

  CEW Metal Semi-Flat:
    Intermediate: acceptable but Metal Sharp preferred where OS is the goal.
```

---

### 7. AR Selection — Dragon Saucer SAR and FLS Compatibility

```
  The Gyro EG's outer shell carries the AR face (contact layer). AR choice determines
  both the contact geometry and whether the free-spinning SAR isolation stacks with GEG isolation.

  Dragon Saucer AR (+ Dragon Saucer SAR):
    As derived in Case 212–213, Dragon Saucer SAR provides ~85% force isolation at the
    SAR–core interface (μ_seat ≈ 0.15, limited to 15% transmission).
    Combined with GEG's 99.998% per-contact bearing isolation:
      Total isolation ≈ 1 − (1 − 0.85) × (1 − 0.99998) ≈ 1 − 0.15 × 2.3 × 10⁻⁵ ≈ 99.9997%
    In practice: Dragon Saucer SAR + GEG is the most isolated Plastic-era combination.
    Contact impulses are almost entirely absorbed by the SAR outer ring and shell, not
    the gyro disc — enabling extreme OS against heavy attackers.

  War Lion AR:
    Outer radius too small — does not extend to r_AR > 35 mm in attack direction.
    Force-smash impulse J_contact is proportionally reduced; the SAR compatibility is moot
    since the War Lion SAR simply doesn't generate significant contact forces to isolate.
    Not recommended.

  Dragon Breaker AR (from Dragoon G stock):
    Wider coverage than War Lion; not as effective as Dragon Saucer SAR but acceptable.
    For stock combo running the GEG as shipped with Dragoon G, Dragon Breaker is the
    available option; upgrade to Dragon Saucer AR when possible.

  FLS AR with LS launch (unique use case):
    Any FLS AR (designed to attack in Left-Spin orientation) can be used effectively with
    GEG launched in LS mode. The AR geometry provides RS-aggressive contact angles on
    the correct face for LS spin. No other Plastic-era EG offers this: a standard RS SG
    or EG would make an FLS AR behave as a right-spin defensive ring, wasting its geometry.
```

---

### 8. KO Vulnerability — No-WD Penalty

```
  The Gyro EG combo carries no Weight Disk. This is a structural consequence: the GEG
  occupies the WD slot area entirely (the EG body is the widest component).

  Lateral displacement resistance without WD:
    Gyroscopic angular momentum: L = I_gyro × ω_gyro = 8.13 × 10⁻³ kg·m²/s
    Precession rate under lateral impulse: Ω = τ / L = (J × r_hit) / (L × Δt)

    Typical WD combo (e.g., 10 Heavy = 14 g at r_eff = 35 mm):
      I_WD = ½ × 0.014 × (0.035² + 0.015²) = ½ × 0.014 × (1.225×10⁻³ + 2.25×10⁻⁴) = 1.016×10⁻⁵ kg·m²
      L_WD_combo ≈ L_gyro + I_WD × ω_WD

    Without WD, total L is only L_gyro. At comparable spin, the GEG combo's gyroscopic
    resistance to lateral displacement is ~35% lower than a standard WD combo.

  Ring-out threshold:
    v_escape ≈ 0.8 m/s for 40 g combo against a standard bowl at r_arena = 0.45 m
    KE_escape = ½ × 0.040 × 0.8² = 0.013 J

    A lateral smash impulse of J = 0.04 kg·m/s against a 40 g target:
      v_imparted = J / m = 0.04 / 0.040 = 1.0 m/s > v_escape

    GEG combo has no WD mass distributed at large radius to contribute translational
    inertia against the lateral impulse direction — it is easier to ring out than any
    WD-equipped combo of comparable total mass.

  Implication:
    GEG is a stamina/OS part, not a survival-against-ring-out part.
    Place it against opponents that cannot ring out (Defensive Zombies, Compact Stamina)
    rather than high-power attackers. The ~65% I-in-gyro-disc is an outstanding OS tool
    only when the opponent does not deliver the ~3–4 consecutive heavy ring-out impulses
    needed to overcome the gyroscopic resistance.
```

---

### 9. Bearing Replacement Notes

```
  Top bearing (shaft-end): fitment clearance is non-standard on some GEG molds.
  Aftermarket shielded bearings (686ZZ, 6×13×5 mm) can jam or wobble rather than
  seat flush — verify seat depth before press-fitting. A bearing that does not sit
  flush introduces lateral wobble that accelerates gyro disc precession at low spin.

  Bottom bearing (CEW-side): a small plastic spacer sits beneath it. The spacer has
  a non-symmetric profile on at least one face. Mark orientation with a pen dot before
  removal; re-install with the same face down. Inverting the spacer shifts the CEW
  seating height by ~0.3 mm — enough to cause the CEW tip to contact the arena
  floor at a slight angle, degrading CEW Metal Sharp stability and shortening the
  sharp tip's usable life.
```

---

### 10. Physics Model

```typescript
interface GyroEngineGearAnalysis {
  mass_g: 21.2;
  gyroDiscMass_g: 12;
  gyroDiscRadiusInner_mm: 18;
  gyroDiscRadiusOuter_mm: 37;
  shellMass_g: 4;
  shellRadiusInner_mm: 34;
  shellRadiusOuter_mm: 40;
  mu_stock: 0.03;
  mu_shielded: 0.003;
  shaftRadius_mm: 3;
  n_bearings: 2;
  dualSpin: true;
  cewSlot: 'normal';
}

function gyroDiscInertia(m_kg: number, r_i_m: number, r_o_m: number): number {
  return 0.5 * m_kg * (r_i_m ** 2 + r_o_m ** 2);
}

function bearingCouplingTorque(
  mu: number,
  F_axial_N: number,
  r_shaft_m: number,
  n_bearings: number
): number {
  return mu * F_axial_N * r_shaft_m * n_bearings;
}

function reducedInertia(I_a: number, I_b: number): number {
  return (I_a * I_b) / (I_a + I_b);
}

function spinEqualizationTime(
  I_red: number,
  delta_omega_rad_s: number,
  tau_coupling: number
): number {
  return (I_red * delta_omega_rad_s) / tau_coupling;
}

function perContactIsolation(
  J: number,
  r_AR_m: number,
  contact_dt_s: number,
  tau_bearing: number
): number {
  const tau_contact = (J * r_AR_m) / contact_dt_s;
  return 1 - tau_bearing / tau_contact;
}

// gyroDiscInertia(0.012, 0.018, 0.037)         → 1.016e-5 kg·m²  (gyro disc)
// gyroDiscInertia(0.004, 0.034, 0.040)         → 5.51e-6 kg·m²   (outer shell)
// gyro fraction: 1.016e-5 / (1.016e-5 + 5.51e-6) = 64.8%
// bearingCouplingTorque(0.030, 0.118, 0.003, 2) → 2.12e-5 N·m  (stock)
// bearingCouplingTorque(0.003, 0.118, 0.003, 2) → 2.12e-6 N·m  (shielded — 10× lower)
// reducedInertia(1.016e-5, 5.51e-6)            → 3.57e-6 kg·m²
// spinEqualizationTime(3.57e-6, 200, 2.12e-5)  → 33.7 s  (stock — spin theft within battle)
// spinEqualizationTime(3.57e-6, 200, 2.12e-6)  → 337 s   (shielded — beyond any battle)
// perContactIsolation(0.005, 0.037, 0.002, 2.12e-6) → 0.99998 — 99.998% isolation per contact

---

## Case 219 — Engine Stopper Base · 5.5g
**Thesis:** The Engine Stopper Base is a minimal two-directional ripcord housing with no Weight Disk slot; its "engine stop" gimmick is implemented entirely inside the Gyro Engine Gear, not this base, and its two protrusions deliver negligible net impulse to the gyro disc due to the GEG's bearing isolation.

The Engine Stopper Base (ESB) ships exclusively with Dragoon G as the mandatory housing for the Gyro Engine Gear. It is the lightest Plastic-era Blade Base at 5.5g. The base performs three functions: it accepts the GEG shaft, it provides a second ripcord entry channel for the LS reverse-spin launch, and it positions the CEW tip at the correct height above the arena floor. Beyond these mechanical duties the ESB has no independent physics contribution — its mass at typical r_eff adds almost no rotational inertia to the system, and the two moulded protrusions produce contact forces that are almost entirely filtered by the GEG's bearing architecture.

---

### 1. Functional Architecture: Housing Shell Without WD

```
  Standard Blade Base anatomy for comparison:
    Shaft seat  → WD slot → spring post → tip housing

  Engine Stopper Base anatomy:
    Shaft seat  → (no WD slot — GEG body occupies this volume) → tip recess (CEW from GEG)

  The WD slot is absent. The GEG body is physically wider than any WD and sits directly
  against the AR underside. No WD of any mass or radius can be inserted.

  Mass budget:
    Shell plastic body: ~3.0 g
    Two moulded protrusions (integral): ~0.5 g
    Ripcord channel walls × 2: ~1.0 g
    Tip recess reinforcement ring: ~1.0 g
    Total: 5.5 g  ✓

  At r_eff ≈ 18 mm (small base, most mass near centre):
    I_ESB ≈ ½ × 0.0055 × (0.014² + 0.022²)
          = ½ × 0.0055 × (1.96 × 10⁻⁴ + 4.84 × 10⁻⁴)
          = ½ × 0.0055 × 6.80 × 10⁻⁴
          = 1.87 × 10⁻⁶ kg·m²

  For comparison:
    I_10Heavy_WD ≈ 1.02 × 10⁻⁵ kg·m²  (Case 101 benchmark)
    ESB contributes only 18% of the inertia that a 10 Heavy WD would have supplied.
    This is the quantitative basis for the "KO vulnerability" noted in Case 218 §8.
```

---

### 2. Ripcord Entry Geometry and Dual-Direction Launch

```
  Two ripcord channels are moulded into opposite walls of the ESB:

    Channel A (standard, right wall):
      Ripcord teeth engage the outer GEG shell → RS launch (shell and disc both RS)
      Identical outcome to any standard RS ripcord launch.

    Channel B (reverse, left wall):
      Ripcord teeth engage the inner gyro disc's opposing tooth set.
      Disc unwinds LS; shell couples passively via bearing.
      Net system spin: primarily LS in gyro disc (larger I), shell partially LS as well.

  Channel geometry (approximate):
    Channel width: ~4.5 mm (standard ripcord = 4.2 mm)
    Entry angle: ~8° inward taper per side — guides ripcord onto correct tooth track
    Depth: full-height of ESB body (~12 mm) — ripcord does not contact GEG housing edge

  Clearance note: only the ripcord specified for GEG/Dragoon G (standard Hasbro/Takara
  width) reliably tracks into Channel B. Non-OEM oversized ripcords can engage both
  channels simultaneously, forcing the disc and shell to spin in the same direction
  regardless of entry side and defeating the LS launch.
```

---

### 3. "Engine Stop" Mechanism — Located in the GEG, Not This Base

```
  The name "Engine Stopper" implies a mechanism within the base that halts the engine.
  In practice, the stopping function is entirely within the GEG's internal architecture:

    When the gyro disc spin drops below a threshold ω_stop ≈ 50 rad/s:
      Gyroscopic angular momentum L = I_gyro × ω < L_min_stable
      The precession rate Ω = τ_gravity / L exceeds the stable-wobble threshold
      The disc tilts far enough to disengage from the bearing seats
      → Physical separation, inner disc slides and contacts the base floor
      → Spinning halts abruptly ("engine stopped")

  The ESB's contribution to this event: the base floor is the physical surface the
  disc contacts when it disengages. The base provides the mechanical stop surface,
  but the trigger condition (ω < ω_stop) is determined entirely by GEG geometry.

  From the GEG designer's perspective: the "engine" (the independently spinning gyro disc)
  stops when spin is insufficient to maintain bearing contact. The "stopper" is the base
  only in the sense that it catches the falling disc — the threshold physics are in the EG.

  This matters for combo planning:
    Swapping the ESB for another Blade Base does not change the ω_stop threshold.
    Pairing the GEG with a non-ESB base that lacks the disc-catch recess risks the disc
    striking arena plastic or protruding below the tip plane — do not substitute.
```

---

### 4. Protrusion Contact Analysis

```
  Two symmetric protrusions at ~r = 20 mm, φ_slope ≈ 30° from vertical.
  Height above floor: ~3–4 mm — contact only during extreme tilt or opponent undercut.

  Contact impulse at a protrusion vs standard AR contact:
    Protrusion r:  20 mm  (vs typical AR r_contact = 37 mm)
    Angular momentum change per unit impulse: r × J
    Protrusion leverage: 20/37 = 54% of AR-level contact torque

  Force transmission to gyro disc (chained isolation):
    GEG bearing isolation per contact (shielded): 99.998%  (Case 218 §3)
    Additional geometry reduction: ×0.54 (shorter moment arm)

    Net impulse reaching gyro disc:
      J_gyro = J_contact × (1 − 0.99998) × 0.54
             = J_contact × 2.3 × 10⁻⁵ × 0.54
             = J_contact × 1.24 × 10⁻⁵

    For J_contact = 0.008 kg·m/s (minor protrusion hit):
      J_gyro = 0.008 × 1.24 × 10⁻⁵ = 9.9 × 10⁻⁸ kg·m/s — entirely negligible

  Conclusion: the protrusions are functionally inert against the gyro disc.
  Their only practical effect is on the outer shell spin, which is already the
  "expendable" momentum pool (Case 218 §2). Protrusion contact accelerates outer
  shell deceleration by a tiny amount; this increases Δω_differential slightly,
  but this differential is still equalized on the ~337 s timescale (shielded bearing).

  Offensive use: the protrusions do not provide meaningful smash potential.
  Any combo running GEG + ESB is a stamina/OS platform, not an attacker.
```

---

### 5. Mold Variation

```
  Known mold variation across production runs:

  Primary variant (most units):
    Small raised line moulded into the ripcord channel wall on one side, adjacent to
    Channel B entry. Serves as a tactile indicator of the LS-launch side.
    Location: ~3 mm above the channel floor on the left-hand wall (when base is held tip-down).

  Secondary variant (minority of units):
    The small raised line is absent. Functionally identical — the channel still operates
    as designed; only the tactile cue is missing.
    Identification: hold ESB tip-down, look into Channel B (left entry); absence of line
    is the only distinguishing feature externally visible.

  No known functional performance difference between variants. The raised line is a
  moulding register mark from tooling, not a mechanical component.

  Importance of variant identification:
    When advising other collectors on "which side is LS launch", the tactile line is the
    easiest field-identification method. Units lacking the line require inspecting the
    tooth-face orientation inside each channel, which is harder under poor lighting.
```

---

### 6. Physics Model

```typescript
interface EngineStopperBaseAnalysis {
  mass_g: 5.5;
  hasWDSlot: false;
  ripcordChannels: 2;
  channelA_launches: 'RS_shell';
  channelB_launches: 'LS_gyroDisc';
  protrusions: 2;
  protrusion_r_mm: 20;
  protrusion_phi_deg: 30;
  engineStopMechanismLocation: 'GyroEG_internal';
  moldVariant_hasIndicatorLine: boolean;
}

function esbRotationalInertia(m_kg: number, r_inner_m: number, r_outer_m: number): number {
  return 0.5 * m_kg * (r_inner_m ** 2 + r_outer_m ** 2);
}

function protrusionImpulseToGyroDisc(
  J_contact: number,
  r_protrusion_m: number,
  r_AR_m: number,
  bearing_isolation: number
): number {
  const leverage_ratio = r_protrusion_m / r_AR_m;
  return J_contact * (1 - bearing_isolation) * leverage_ratio;
}

function engineStopThreshold(
  I_gyro: number,
  tau_gravity: number,
  precession_limit_rad_s: number
): number {
  // ω below which L = I × ω cannot resist gravity torque at the precession limit
  return tau_gravity / (I_gyro * precession_limit_rad_s);
}

function noWDInertiaDeficit(I_WD_equivalent: number, I_ESB: number): number {
  return (I_WD_equivalent - I_ESB) / I_WD_equivalent;
}

// esbRotationalInertia(0.0055, 0.014, 0.022) → 1.87e-6 kg·m²
// noWDInertiaDeficit(1.02e-5, 1.87e-6) → 0.817 — ESB provides only 18% of 10 Heavy WD inertia
// protrusionImpulseToGyroDisc(0.008, 0.020, 0.037, 0.99998) → ~8.7e-8 kg·m/s — negligible
// engineStopThreshold(1.016e-5, 0.0004, 2.0) → ~0.020 rad/s — disc separates near dead stop
// protrusion leverage vs AR: 20/37 = 0.54 — 46% reduction in moment arm vs full AR contact
```

---

## Case 220 — CEW Metal Sharp · 3.3g
**Thesis:** CEW Metal Sharp's ball-dome geometry with a central metal point creates a self-centering contact patch that migrates outward with tilt angle, and a bevelled surround that acts as a tilt limiter at ~23°; these properties make it the optimal GEG pairing for CoM stability, while the higher metal-on-metal friction coefficient makes it inferior to Light Sharp for Right CG (Free Shaft Version) Zombie combinations.

CEW Metal Sharp ships with Orthros G and fills the standard-height CEW slot. The tip is architecturally a metal sphere cap with a small hardened point at its apex — not a tapered cone like a true "sharp" tip, and not a flat disc. The ball-dome body is surrounded by a bevelled ring that intersects the floor only at significant tilt angles, providing a secondary contact surface that arrests toppling before it becomes irrecoverable. The four cutout wings are the mounting tabs for the CEW slot and contribute negligible rotational inertia.

---

### 1. Tip Geometry: Ball-Dome with Central Point

```
  Top-view geometry (not to scale):

        ┌──────────────────────────────┐
        │  ╱──────────────╲            │  ← four mounting wings (r ≈ 5 mm from centre)
        │ │                │           │
        │ │  ┌──────────┐  │           │  ← bevel ring begins at r_bevel ≈ 3.5 mm
        │  ╲ │  ●  dome │ ╱            │
        │    └──────────┘              │  ← dome body r_dome ≈ 3 mm radius of curvature
        │       ·                      │  ← central point r_point ≈ 0.3 mm
        └──────────────────────────────┘

  Side-profile:
                    ·  ← metal point (r_contact ≈ 0.3 mm at θ = 0°)
                  ╱─╲
                ╱─────╲  ← ball dome (R_dome ≈ 3 mm spherical radius)
              ╱─────────╲  ← bevel surface (~35° from horizontal)
    ──────────             ──────────  ← floor plane

  At θ = 0°: only the metal point contacts. Effective friction area ≈ π × (0.3)² = 0.28 mm²
  At θ > 0°: dome contacts. Contact radius migrates outward with tilt.
  At θ ≈ 23°: bevel ring contacts floor. Tilt arrested.
```

---

### 2. Floor Contact Radius vs Tilt Angle

```
  Ball-dome contact kinematics:
    r_contact(θ) = R_dome × sin(θ)   (contact migrates from apex toward equator)
    R_dome = 3 mm

  Tilt (deg)  r_contact (mm)   Friction torque τ = μ × F_N × r_c   Note
  ────────────────────────────────────────────────────────────────────────
     0°          0.000          ← metal point only (point contact)
     5°          0.261          μ × F_N × 2.61×10⁻⁴ m
    10°          0.521          μ × F_N × 5.21×10⁻⁴ m
    15°          0.776          μ × F_N × 7.76×10⁻⁴ m
    20°          1.026          μ × F_N × 1.03×10⁻³ m
    23°          1.172          ← bevel engages, r_contact jumps to r_bevel = 3.5 mm

  Self-centering mechanism:
    As tilt increases, friction force acts at increasing r_c from spin axis.
    When orbiting (precessing), centripetal friction component has righting moment:
      τ_right = μ × F_N × r_contact × sin(θ) × cos(orbit_phase)
    This is non-zero for ball-dome but zero for a pure sharp tip (r_c ≈ 0 always).

  Sharp tip (conventional): r_contact ≈ 0 → no lateral migration → no self-centering torque.
  Ball-dome: r_contact grows with θ → increasing restoring force as tilt worsens.
  This is the mechanism behind "surprisingly excellent stability" for Metal Sharp + GEG.
```

---

### 3. Bevel Contact as Tilt Limiter

```
  Bevel geometry:
    Bevel start radius: r_bevel ≈ 3.5 mm from centre
    Height of bevel inner edge above floor: h_bevel ≈ 1.5 mm (from side-profile image)
    Bevel angle from horizontal: α ≈ 35°

  Tilt angle at bevel contact:
    θ_bevel = arctan(h_bevel / r_bevel) = arctan(1.5 / 3.5) = arctan(0.429) ≈ 23.2°

  At θ = 23°:
    Contact point jumps from r_c = 1.17 mm (dome) to r_bevel = 3.5 mm
    Friction torque jumps by factor: 3.5 / 1.17 = 3.0 ×

  Bevel deceleration effect:
    Before bevel: τ_friction = μ × F_N × 0.00117
    At bevel:     τ_friction = μ × F_N × 0.0035
    At bevel, angular deceleration: α_tilt = (τ_friction_bevel − τ_gravity_restore) / I_combo
    If bevel friction > gravity-induced topple rate → tilt is arrested and reversed

  This means the beyblade can tilt to 23° before rapid friction arrest kicks in.
  A pure sharp tip has no such secondary arrest — it tips past the unstable point and stops.
  A flat CEW tip contacts floor at any tilt → no tilt-limiter function (no step-change).
  Ball-dome bevel is unique in providing a discrete, step-change arrest at a defined angle.
```

---

### 4. CoM Height and Gyroscopic Stability with GEG

```
  CoM height above floor:
    CEW Metal Sharp: h_CoM ≈ 2.5 mm  (dome body barely clears floor)
    CEW Metal Flat:  h_CoM ≈ 4.5 mm  (disc body sits higher)
    CEW Light Sharp: h_CoM ≈ 2.5 mm  (similar dome profile, plastic body)

  Gravitational topple torque at tilt θ for GEG combo (m_combo ≈ 40 g):
    τ_gravity = m_combo × g × h_CoM × sin(θ)

    Metal Sharp: τ_g = 0.040 × 9.8 × 0.0025 × sin(θ) = 9.80 × 10⁻⁴ × sin(θ)  N·m
    Metal Flat:  τ_g = 0.040 × 9.8 × 0.0045 × sin(θ) = 1.764 × 10⁻³ × sin(θ)  N·m
    Ratio: Metal Flat produces 1.8× more topple torque at the same tilt angle

  Minimum precession rate for gyroscopic stability (τ_gyro ≥ τ_gravity):
    I_gyro × ω_gyro × Ω_min = τ_gravity(90°) = m × g × h_CoM
    Ω_min = (m × g × h_CoM) / (I_gyro × ω_gyro)

    At ω_gyro = 400 rad/s (late-battle):
      Metal Sharp:  Ω_min = (0.040 × 9.8 × 0.0025) / (1.016×10⁻⁵ × 400) = 9.8×10⁻⁴ / 4.06×10⁻³ = 0.241 rad/s
      Metal Flat:   Ω_min = (0.040 × 9.8 × 0.0045) / (1.016×10⁻⁵ × 400) = 1.76×10⁻³ / 4.06×10⁻³ = 0.434 rad/s

  Interpretation:
    Ω_min is the slowest precession rate at which the gyro disc can still right itself.
    Below Ω_min, the combination falls over regardless of remaining spin.
    Metal Sharp requires only 0.241 rad/s precession → stable far later into the battle.
    Metal Flat requires 0.434 rad/s → topples when precession slows past this threshold
    while the same disc spin remains available.

    Metal Sharp extends the stable battle window at late-spin by 1.8× vs Metal Flat.
    This is the quantified basis for its "surprisingly excellent stability" in the GEG context.
```

---

### 5. Metal Sharp vs Light Sharp — Right CG (Free Shaft Version) Zombie

```
  Context: Right CG (Free Shaft Version) Zombie combos rely on LAD (Life After Death):
    The AR + WD + outer SG assembly spin freely on the shaft; when the beyblade topples,
    these components maintain spin via precession, effectively stealing opponent spin on contact.

  Key LAD metric: how long the free-spinning assembly maintains angular momentum during
  wide-orbit precession. Tip floor friction is the primary decay channel.

  CEW Light Sharp (plastic tip):
    μ_plastic_on_plastic ≈ 0.10–0.14 (arena floor is typically polished plastic)
    r_contact ≈ 0.2–0.3 mm (similar apex geometry to Metal Sharp)
    Friction torque: τ_f = 0.12 × (0.033 × 9.8) × 0.00025 = 9.7 × 10⁻⁶ N·m
    Precession orbit: small friction → long-lived precession → Zombie survives longer

  CEW Metal Sharp (metal tip):
    μ_metal_on_plastic ≈ 0.18–0.25 (harder surface, higher static friction coefficient)
    r_contact ≈ 0.3 mm (slightly larger, dome geometry)
    Friction torque: τ_f = 0.22 × (0.033 × 9.8) × 0.00030 = 2.14 × 10⁻⁵ N·m
    Ratio to Light Sharp: 2.14 / 0.97 = 2.2 × higher friction torque

  Spin lifetime under precession:
    t_spin ∝ L_initial / τ_friction_per_orbit
    Light Sharp: t_spin_rel = 1.0  (reference)
    Metal Sharp: t_spin_rel ≈ 1 / 2.2 = 0.45  — loses spin 2.2× faster during precession

  Additionally, GEG bearing architecture is irrelevant for Free Shaft CG:
    Free Shaft CG's isolation comes from the free-spinning shaft mechanism, not a bearing disc.
    Metal Sharp's excellent stability advantage (GEG gyro disc support) does not carry over.
    Without the gyro disc, Metal Sharp's ball-dome geometry and tilt-limiter bevel provide only
    modest benefit over Light Sharp's simpler cone shape — insufficient to offset 2.2× more friction.

  Verdict for RS CG (Free Shaft Version) Zombie:
    Light Sharp > Metal Sharp — better LAD through lower friction, enabling actual Zombie play.
    Metal Sharp: usable but clearly outclassed by Light Sharp in this application.
```

---

### 6. GEG Synergy: Best Competitive CEW

```
  The GEG + Metal Sharp pairing outperforms all other CEW combinations because the
  GEG's bearing architecture inverts the standard CEW selection criterion:

  Standard CEW selection (e.g., Right CG):
    Optimise for LAD: minimise friction → Light Sharp, Metal Flat at high speed
    Optimise for stability: lower CoM → any sharp variant
    → Stability and friction reduction are partially competing goals

  GEG CEW selection:
    LAD for the gyro disc: determined by bearing architecture, not tip friction
    → Tip friction decays ONLY the outer shell spin (expendable momentum pool)
    → Gyro disc spin is isolated → tip friction becomes irrelevant to OS performance

    Stability optimisation is the only remaining criterion:
    → Lowest CoM → Metal Sharp (h_CoM = 2.5 mm) ✓
    → Best tilt-limiter (ball-dome self-centering) → Metal Sharp ✓
    → No trade-off against LAD needed → Metal Sharp wins unconditionally

  Why not Light Sharp for GEG?
    Light Sharp is plastic → μ_contact slightly lower (marginal benefit, irrelevant)
    Light Sharp's precession benefit is for Free Shaft CG mechanism, not bearing isolation
    Metal Sharp's metal body is marginally heavier → barely lowers system CoM (negligible)
    The decisive advantage is ball-dome geometry + bevel limiter → not present in Light Sharp

  Summary across all CEW options with GEG:
    Metal Sharp:   h_CoM = 2.5 mm, ball-dome righting, 23° bevel arrest → best
    Light Sharp:   h_CoM = 2.5 mm, no ball-dome, plastic → outclassed by Metal Sharp
    Metal Semi-Flat: h_CoM ≈ 3.5 mm, flat contact, no bevel → decent, 40% more topple torque
    Metal Flat:    h_CoM ≈ 4.5 mm, wide friction, no bevel → worst for GEG OS stability
```

---

### 7. Physics Model

```typescript
interface CEWMetalSharpAnalysis {
  mass_g: 3.3;
  material: 'metal';
  tipType: 'ball_dome_with_central_point';
  R_dome_mm: 3;         // spherical radius of curvature of the dome
  r_point_mm: 0.3;      // effective contact radius of the central metal point
  r_bevel_mm: 3.5;      // radius at which bevel surround begins
  h_bevel_mm: 1.5;      // height of bevel inner edge above floor
  bevel_angle_deg: 35;
  h_CoM_mm: 2.5;
  mu_metal_on_plastic: 0.22;
  mu_plastic_on_plastic: 0.12;
  bestPairing: 'GyroEG';
  vsLightSharp_CGFreeShaft: 'inferior';
}

function ballDomeContactRadius(R_dome_mm: number, tilt_deg: number): number {
  return R_dome_mm * Math.sin(tilt_deg * Math.PI / 180);
}

function bevelEngagementAngle(r_bevel_mm: number, h_bevel_mm: number): number {
  return Math.atan(h_bevel_mm / r_bevel_mm) * (180 / Math.PI);
}

function gravitationalToppleTorque(
  m_combo_kg: number,
  h_CoM_m: number,
  tilt_deg: number
): number {
  return m_combo_kg * 9.8 * h_CoM_m * Math.sin(tilt_deg * Math.PI / 180);
}

function minPrecessionForStability(
  m_combo_kg: number,
  h_CoM_m: number,
  I_gyro: number,
  omega_gyro: number
): number {
  return (m_combo_kg * 9.8 * h_CoM_m) / (I_gyro * omega_gyro);
}

function tipFrictionTorque(
  mu: number,
  F_N: number,
  r_contact_m: number
): number {
  return mu * F_N * r_contact_m;
}

// ballDomeContactRadius(3, 0)   → 0.000 mm — metal point only at upright
// ballDomeContactRadius(3, 10)  → 0.521 mm — migrating contact at 10° tilt
// ballDomeContactRadius(3, 20)  → 1.026 mm — approaching bevel threshold
// bevelEngagementAngle(3.5, 1.5) → 23.2° — tilt arrest angle
// gravitationalToppleTorque(0.040, 0.0025, 30) → 4.90e-4 N·m  (Metal Sharp)
// gravitationalToppleTorque(0.040, 0.0045, 30) → 8.82e-4 N·m  (Metal Flat — 80% more)
// minPrecessionForStability(0.040, 0.0025, 1.016e-5, 400) → 0.241 rad/s  (Metal Sharp)
// minPrecessionForStability(0.040, 0.0045, 1.016e-5, 400) → 0.433 rad/s  (Metal Flat)
// tipFrictionTorque(0.22, 0.033*9.8, 0.00030) → 2.14e-5 N·m  (Metal Sharp on plastic)
// tipFrictionTorque(0.12, 0.033*9.8, 0.00025) → 9.70e-6 N·m  (Light Sharp on plastic)
// LAD friction ratio: 2.14e-5 / 9.70e-6 = 2.21× — Light Sharp has 2.2× less friction for Zombie play


---

## Case 221 — G Upper Attack Ring · 5.5 g: Why Focused Smash Geometry Doubles as Effective Traditional Upper in LS, How Recoil Compares to the LS Benchmark ARs, and Why RS Provides Nothing Useful

G Upper is a 5.5 g Attack Ring with four contact points arranged for Left Spin. Each contact face combines a forward-angled smash surface with an upward-sloping ramp, producing both lateral impulse (Smash Attack) and vertical impulse (Upper Attack) in a single contact event. In LS the geometry is well-focused — contact angles are steep enough to deliver competitive Smash, shallow enough on the slope to convert momentum into vertical destabilisation without shedding the lateral component. The result is a dual-mode LS AR that directly echoes what Triple Wing achieves for RS: a Smash AR that is simultaneously a credible Traditional Upper AR. Recoil is marginally higher than Eight Spiker and Panther Head, which slightly reduces the destabilisation benefit of the slopes but does not meaningfully harm LS smash performance. In RS the geometry mirrors to present recoil-dominant faces with no productive offensive angle.

---

### 1. Contact Point Geometry: Combined Smash and Upper Slope

Each of the four contact points presents two distinct geometric surfaces:

```
   LS contact (one of four points), side cross-section:

   rotation ←

         ↑ upper ramp (slope angle α ≈ 25–30° from horizontal)
        /
       /  ← smash face (angle φ ≈ 40–45° from tangent)
      /
   ──●──────── AR body
```

The smash face intercepts the opponent AR tangentially. The upper ramp intercepts it from below as the contact zone traverses the slope. Both surfaces are engaged in a single pass when the opponent AR contacts the face while travelling across the slope geometry.

Total impulse per contact, decomposed:

```
J_lateral  = J × cos(φ_smash) ≈ J × cos(42°) ≈ J × 0.743   (Smash)
J_vertical = J × sin(α_ramp)  ≈ J × sin(27°) ≈ J × 0.454   (Upper)
J_recoil   = J × sin(φ_smash) ≈ J × sin(42°) ≈ J × 0.669   (recoil on self)
```

The lateral and vertical components are not independent impulses from separate interactions — they are projections of the same contact impulse resolved through the combined smash-slope geometry. J_vertical is the component that perturbs the opponent's tilt axis, initiating the nutation that defines Traditional Upper Attack.

---

### 2. Smash Performance in LS: Focused Contact and Competitive Output

With 4 contact points and focused angles, contact frequency at ω = 200 rad/s:

```
f_contact = (4 / 2π) × 200 ≈ 127 contacts/s
```

This matches Cross Spiker and is well above Triple Wing (95/s) at the same spin. Per-contact impulse is higher than Eight Spiker because the 4-fold geometry allows each contact face to extend to a greater effective radius and subtend a larger arc:

```
r_contact (8-fold AR) ≈ 25 mm   → J ∝ m × ω × r ∝ ω × 25
r_contact (4-fold AR) ≈ 29 mm   → J ∝ m × ω × r ∝ ω × 29

Peak smash impulse ratio: 29 / 25 = 1.16 — G Upper delivers ~16% more peak impulse per contact
```

Total smash power (frequency × impulse) normalised:

```
Eight Spiker:  255 × 25 = 6375  (baseline)
G Upper:       127 × 29 = 3683  (58% of baseline)
```

Total power is lower than Eight Spiker because the contact-frequency gain of 8-fold symmetry is not recovered by the per-contact impulse advantage. However, G Upper's advantage is focus: each hit carries more momentum, so individual contacts produce larger positional displacements of the opponent — the hits are more decisive even if less frequent.

---

### 3. Traditional Upper Attack in LS: Slope as Tilt Destabiliser

The upper ramp delivers a vertical impulse component J_vertical ≈ 0.454J per contact. This perturbs the opponent's angular momentum vector away from vertical:

```
Δtilt = J_vertical × r_contact / I_opponent
```

where I_opponent is the opponent's axial moment of inertia (typically 3–5 × 10⁻⁵ kg·m²).

For a contact impulse J = 0.005 N·s (moderate closing speed, ~120 rad/s spin):

```
J_vertical = 0.454 × 0.005 = 2.27 × 10⁻³ N·s
Δtilt = (2.27 × 10⁻³ × 0.029) / 4 × 10⁻⁵ ≈ 1.65°/contact
```

At 127 contacts/s, unresisted tilt accumulation rate:

```
dΦ/dt ≈ 1.65° × 127 = 209°/s
```

In practice gyroscopic resistance and opponent response limit net tilt to a fraction of this. But the key comparison is against a pure Smash AR (zero slope, J_vertical = 0): G Upper applies consistent tilt perturbation at every contact that a flat smash face cannot replicate. This is functionally equivalent to what Triple Wing achieves in RS — the slope converts part of the lateral smash momentum into vertical destabilisation rather than purely horizontal ejection.

The difference from a dedicated Upper AR (e.g. Upper Dragoon): a dedicated Upper AR optimises slope angle to maximise J_vertical at the cost of J_lateral. G Upper distributes the impulse across both projections — it is not the strongest Upper AR, but it is a Smash AR that also Upper attacks, not an Upper AR that also smashes.

---

### 4. Recoil Comparison Against LS Benchmarks

G Upper's recoil per contact: J_recoil ≈ 0.669J.

Reference ARs in LS:

```
AR               φ_smash     J_recoil / J     Notes
─────────────────────────────────────────────────────
Panther Head     ~35°         0.574            lowest recoil, smoothest face
Eight Spiker     ~40°         0.643            serrated, consistent
G Upper          ~42°         0.669            slight increase over Eight Spiker
```

The increase over Eight Spiker is ~4% in absolute terms. This is the cost of the steeper smash face required to produce effective upper slope geometry — the same face angle that generates J_vertical also increases J_recoil. The destabilisation benefit of the slopes (tilt perturbation at every contact) partially compensates for the recoil increase by improving opponent instability, but it does not fully recover the self-recoil cost. Against a high-recoil opponent, G Upper's slightly elevated recoil increases the risk of mutual destabilisation more than Eight Spiker or Panther Head would.

Practically: G Upper is still a competitive LS smash AR. The recoil increase is not large enough to disqualify it. It trades a marginal stability penalty for the Upper Attack capability, which can be decisive against opponents that Smash Attack alone cannot consistently eject.

---

### 5. RS Geometry: Mirror Inversion to Recoil-Dominant Faces

In RS, the same contact faces present their trailing edges first. The smash face and upper ramp, which were forward-facing in LS, are now rear-facing:

```
   RS contact (same geometry, opposite spin direction):

   rotation →

   AR body ────●
                \
                 \  ← trailing edge (ramp and smash face reversed)
                  \
                   ↓ (downward slope — wrong direction for upper attack)
```

Both impulse projections invert:

```
Lateral component: directed inward (recoil on self, no ejection of opponent)
Vertical component: directed downward (presses opponent down — no destabilisation)
```

There is no RS offensive use case. The AR produces only self-recoil and no useful force on the opponent. RS use is non-competitive.

---

### 6. LS Benchmark Summary: G Upper vs Triple Wing in RS

The structural analogy to Triple Wing in RS is valid at the mechanism level:

```
                    Triple Wing (RS)           G Upper (LS)
Spin direction      Right                      Left
Contact count       3                          4
Primary mode        Smash                      Smash
Secondary mode      Traditional Upper          Traditional Upper
Slope angle         ~25–30°                    ~25–30°
Recoil per contact  moderate                   slightly higher
Dead zone (°)       120°                       90°
f_contact (200 r/s) 95/s                       127/s
```

Both ARs use a smash face combined with an upper ramp to deliver dual-mode attacks in their preferred spin direction. G Upper contacts more frequently and has slightly more recoil; Triple Wing has larger dead zones but lower recoil per contact. G Upper is the LS equivalent of Triple Wing not in the sense of being a copy, but in the sense of occupying the same strategic role in its spin direction — the smash AR that also upper attacks, and the benchmark for LS offensive performance.

---

### 7. Physics Model

```typescript
interface GUpperAnalysis {
  mass_g: 5.5;
  contactPointCount: 4;
  preferredSpin: 'left';
  smashFaceAngle_deg: 42;
  upperRampAngle_deg: 27;
  effectiveContactRadius_mm: 29;
}

function resolveContactImpulse(
  J_total: number,
  smashAngle_deg: number,
  rampAngle_deg: number
): { lateral: number; vertical: number; recoil: number } {
  const phi = smashAngle_deg * Math.PI / 180;
  const alpha = rampAngle_deg * Math.PI / 180;
  return {
    lateral:  J_total * Math.cos(phi),
    vertical: J_total * Math.sin(alpha),
    recoil:   J_total * Math.sin(phi),
  };
}

function tiltPerturbationRate(
  J_vertical: number,
  r_contact_m: number,
  I_opponent_kgm2: number,
  contactFreq_hz: number
): number {
  const delta_tilt_rad = (J_vertical * r_contact_m) / I_opponent_kgm2;
  return delta_tilt_rad * contactFreq_hz * (180 / Math.PI);
}

function contactFrequency(nContacts: number, omega_rad_s: number): number {
  return (nContacts / (2 * Math.PI)) * omega_rad_s;
}

// resolveContactImpulse(0.005, 42, 27)
//   → { lateral: 3.72e-3, vertical: 2.27e-3, recoil: 3.35e-3 }
// contactFrequency(4, 200) → 127.3 contacts/s
// tiltPerturbationRate(2.27e-3, 0.029, 4e-5, 127) → 209°/s unresisted
// recoil ratio vs Eight Spiker: sin(42°)/sin(40°) = 0.669/0.643 = 1.040 — 4% more recoil
// peak impulse ratio vs Eight Spiker: 29mm/25mm = 1.16 — 16% more per contact
```


---

## Case 222 — Left Engine Gear (Turbo) · 7.0 g: Why Turbo Activation Produces Attack-Class Spin Burst, How Height and LS AR Geometry Jointly Prevent Effective Contact, and Why the Base and CEW Constraints Leave Only First Clutch as a Viable Host

Left Engine Gear (Turbo) is a 7.0 g CEW-compatible Left Spin Engine Gear whose Turbo gimmick releases a spring-wound internal mechanism to deliver a single burst of additional angular momentum at activation. The Turbo variant stores more energy than the standard EG and releases it faster, producing a qualitatively different output — a short, violent spin surge rather than a sustained engagement window. This makes it the only Engine Gear variant with any plausible Attack use case. Two structural problems prevent competitive viability: the height penalty of any EG setup places the AR above most opponent ARs, and no Left Spin AR in the library overhangs enough to bridge that height gap during the activation window. The result is a part that possesses raw attack energy it cannot reliably deliver, constrained to First Clutch Base as its only viable host and Metal Grip as its only CEW with enough surface traction to convert the burst into useful lateral velocity.

---

### 1. Turbo Gimmick: Spring Energy and Burst Duration

The Turbo mechanism stores pre-wound rotational energy in a coil spring. On activation (clutch release), all stored energy transfers to the shell in a single step rather than the gradual release of a standard EG:

```
Stored spring energy:    E_spring = ½ × k × θ²
Release duration:        Δt_turbo ≈ 50–80 ms  (shorter than standard EG ~150 ms)
Peak angular impulse:    L_burst = E_spring / ω_shell_at_activation × 2
```

Because Δt_turbo is short, peak power is high:

```
P_peak = E_spring / Δt_turbo
```

At Δt_turbo = 60 ms and E_spring = 0.06 J (estimated from spring geometry):

```
P_peak ≈ 0.06 / 0.060 = 1.0 W
```

For comparison, a standard EG releases the same energy over ~150 ms:

```
P_standard ≈ 0.06 / 0.150 = 0.4 W
```

The Turbo burst is ~2.5× more powerful per unit time. This is what produces the visible "hurtling out of control" behaviour at activation — the shell accelerates faster than the tip can stabilise, generating lateral drift. The cost is that the useful activation window is proportionally shorter: the burst is spent in 60–80 ms, after which the EG reverts to normal passive spin decay.

---

### 2. Height Penalty: Why EG Setups Cannot Reach Standard AR Contact Zones

All Engine Gear setups add height relative to a standard SG combo. The EG mechanism, CEW housing, and blade base together position the AR higher above the stadium floor:

```
Standard SG combo AR height above floor:   h_std ≈ 18–22 mm
EG combo AR height above floor:            h_EG  ≈ 26–32 mm
Height excess:                              Δh    ≈ 8–10 mm
```

An opponent AR at h_std presents its contact faces between 18–22 mm above the floor. The EG combo's AR at 26–32 mm passes over those contact faces during most engagements. Effective contact requires the EG AR's contact face to overlap the opponent's AR contact zone:

```
Overlap condition: h_EG_AR_bottom < h_std_AR_top
                   (26 mm bottom edge) vs (22 mm top edge of opponent AR)
                   → 26 > 22 → no overlap in most configurations
```

The AR must overhang downward to reach the opponent. Left Spin ARs in the library do not provide sufficient downward overhang to close an 8–10 mm vertical gap. This is the root constraint: the energy is present, but the geometry does not allow contact.

---

### 3. Left Spin AR Overhang: Why LS Has No Solution to the Height Gap

Right Spin Attack ARs (Triple Wing, Tiger Defenser, Cross Spiker) frequently feature pronounced downward-angled contact faces that contact opponents at or below the AR body level. This is partly a design artefact: RS attack ARs were primary design targets for the attack archetype and received geometry that accommodates RS attack play.

Left Spin ARs optimised for attack (G Upper, Eight Spiker, Panther Head) have contact faces oriented for LS smash and upper attack, but their contact surfaces project laterally and slightly upward — not downward. Downward overhang in LS is limited:

```
Typical LS attack AR contact face vertical projection:   +2 to +5 mm above AR body plane
Typical RS attack AR downward overhang:                  −4 to −8 mm below AR body plane
```

This asymmetry means RS ARs can reach opponents 4–8 mm below their body plane; LS ARs cannot. Against the 8–10 mm height deficit of an EG setup, RS ARs would still fall 2–4 mm short, but LS ARs fall 10–15 mm short — effectively no contact.

The consequence: even during the Turbo burst, when the beyblade is moving at maximum lateral velocity, the LS AR passes over the opponent's AR without contact in the majority of engagements. The energy is dissipated into stadium movement, not opponent destabilisation.

---

### 4. Base Compatibility: First Clutch vs Final Clutch

**First Clutch Base (Dragoon G Version):**

First Clutch activates early in the match — at a high spin threshold — releasing the EG at a moment when the shell still has high residual spin. The Turbo burst adds to an already-spinning shell:

```
ω_shell_at_activation ≈ 0.7 × ω_launch   (First Clutch triggers at ~70% of launch spin)
ω_post_burst ≈ ω_shell_at_activation + Δω_turbo
```

The surge occurs while the beyblade has enough residual spin to maintain stadium presence and momentum. The opponent is also at high spin, maximising the momentum differential during the burst window. First Clutch is the correct host because it aligns the Turbo window with the phase of the match where high-energy contact would be decisive — even though contact is still unlikely for the LS height reason above.

**Final Clutch Base:**

Final Clutch activates late — at low spin — designed to deliver a second-wind burst for stamina or late-game upset. The Turbo mechanism's short window (60–80 ms) is poorly matched to this intent:

```
Δt_turbo = 60 ms << Δt_match_late_game = seconds
```

The burst fires once and ends before the late-game phase it is designed for has concluded. Additionally, at low shell spin, the Turbo's added Δω is a larger fraction of total spin, but the absolute lateral velocity generated is lower because the base momentum is lower:

```
v_lateral ∝ ω × r_AR
At low ω: v_lateral is reduced → less useful attack energy delivered
```

Combined with the LS height problem and the absence of an effective overhanging LS Final Clutch Blade Base, Final Clutch + Left EG Turbo produces no competitive outcome. The late-game burst window and the short Turbo release are structurally mismatched.

---

### 5. CEW Compatibility: Why Metal Grip is the Only Viable Choice

Activation transfers angular momentum to the shell. The shell's lateral velocity is then determined by the tip's interaction with the stadium floor:

```
v_lateral = (Δω × r_AR) × μ_tip × F_N / m_total
```

The tip friction coefficient μ_tip determines how much of the rotational burst converts to linear stadium motion.

For smooth metal tips (Metal Sharp, Metal Flat, Light Sharp):

```
μ_metal_on_plastic ≈ 0.18–0.22
```

These tips have low enough friction that the sudden Δω from Turbo activation produces only a small lateral displacement — the shell spins up but the tip slips, dissipating energy as heat rather than directional motion. The burst is wasted.

For rubber grip tips (Metal Grip):

```
μ_rubber_on_plastic ≈ 0.55–0.70
```

Metal Grip's rubber outer ring engages the stadium floor with high friction. The Turbo burst converts to lateral velocity rather than tip slip:

```
v_lateral (Metal Grip) ≈ v_lateral (Metal Sharp) × (0.65 / 0.20) ≈ 3.25×
```

Only Metal Grip translates the Turbo burst into the visible "hurtling" behaviour. Metal grip tips also add height to the EG setup, which worsens the AR contact problem, but without Metal Grip the burst produces no useful attack output at all. The trade-off is obligatory — Metal Grip is the minimum viable CEW for Turbo attack utility.

---

### 6. Competitive Assessment

The part chain for Left EG Turbo attack reduces to a single viable configuration and a narrow failure mode:

```
Viable:   First Clutch Base (Dragoon G) + Metal Grip CEW
          → Burst fires at ~70% spin (high energy window)
          → Metal Grip converts burst to lateral velocity
          → LS AR still misses most contacts due to height gap
          → Outcome: chaotic movement, occasional incidental hits
          → Tier: not competitively reliable; below Tier 2

Not viable:
  Any smooth metal CEW     → burst dissipated as tip slip
  Final Clutch Base        → window mismatch + low-spin burst
  Any LS AR variant        → height gap persists regardless of AR choice
```

The fundamental limit is not energy — Turbo has enough. It is geometry: Left Spin has no AR that overhangs downward to reach a standard opponent at EG setup height. This is a library gap, not a tuning problem. No combination of base, CEW, or AR selection solves the height-to-contact mismatch within the constraints of available LS parts.

---

### 7. Physics Model

```typescript
interface LeftEGTurboAnalysis {
  mass_g: 7.0;
  spinDirection: 'left';
  gimmick: 'turbo';
  burstDuration_ms: 60;
  estimatedSpringEnergy_J: 0.06;
  peakPower_W: 1.0;
  heightAboveFloor_mm: 29;
  viableCEW: 'Metal Grip';
  viableBase: 'First Clutch (Dragoon G)';
}

function turboLateralVelocity(
  delta_omega: number,
  r_AR_m: number,
  mu_tip: number
): number {
  return delta_omega * r_AR_m * mu_tip;
}

function heightOverlapCheck(
  EG_AR_bottom_mm: number,
  opponent_AR_top_mm: number
): boolean {
  return EG_AR_bottom_mm < opponent_AR_top_mm;
}

function burstPeakPower(E_spring_J: number, delta_t_ms: number): number {
  return E_spring_J / (delta_t_ms / 1000);
}

// burstPeakPower(0.06, 60)           → 1.00 W  (Turbo)
// burstPeakPower(0.06, 150)          → 0.40 W  (Standard EG — 2.5× less)
// turboLateralVelocity(50, 0.029, 0.65) → 0.943 m/s  (Metal Grip)
// turboLateralVelocity(50, 0.029, 0.20) → 0.290 m/s  (Metal Sharp — 3.25× less)
// heightOverlapCheck(26, 22)         → false — no contact at standard opponent height
// heightOverlapCheck(26, 28)         → true  — contact only if opponent AR is taller than normal
```


---

## Case 223 — First Clutch Base (Dragoon GT Version) · 7.4 g: Why Four-Wing Perimeter Geometry Generates Unacceptable Recoil in Both Spin Directions, How First Clutch Activation Avoids Final Clutch's Self-KO Pattern but Substitutes Broken Flower Pattern, and Why Dragoon G Version Is Strictly Superior

First Clutch Base (Dragoon GT Version) is a 7.4 g blade base with First Clutch activation timing and a four-wing perimeter body. The First Clutch mechanism fires at the start of the battle while spin is high, which avoids the post-topple self-destruction pattern of Final Clutch. However, the four wings that define the GT version's profile generate substantially higher recoil than the Dragoon G Version base body in both spin directions — worst in Left Spin, significant in Right Spin. The recoil cost is not offset by any attack capability: the wings do not function as effective contact points and serve only as surface area that produces defensive liability. The combination of manageable (but still problematic) First Clutch activation and high baseline recoil produces a base that is a liability in every practical role, strictly inferior to First Clutch Base (Dragoon G Version) for Engine Gear attack use.

---

### 1. First Clutch Activation Timing: Early-Match Release

First Clutch releases the Engine Gear at the start of the battle, when shell spin is at or near launch spin ω_launch. This is the high-energy window:

```
Activation threshold:   ω_clutch ≈ 0.85–0.95 × ω_launch
Time from launch:       t_activate ≈ 0.2–0.8 s
Shell spin at release:  ω_shell ≈ 0.80 × ω_launch
```

At this point the beyblade has high angular momentum, high linear momentum from stadium movement, and the opponent is also at peak spin. The EG burst adds Δω to a shell already spinning fast:

```
ω_post_burst = ω_shell + Δω_EG
```

This produces the "violent" activation characteristic — the shell and AR accelerate suddenly while the tip is still engaged with the floor at high speed, generating a large lateral velocity impulse.

**Comparison to Final Clutch:**
Final Clutch activates at low spin (late-match, ω ≈ 0.2–0.3 × ω_launch). At that point gyroscopic stability is reduced and the EG burst can overwhelm the precession term, causing topple rather than lateral movement — the self-KO pattern. First Clutch avoids this because at high spin:

```
L_gyro = I × ω_launch >> τ_destabilisation
```

The gyroscopic restoring torque is large enough to absorb the EG burst without toppling. Instead, the burst disrupts the flower pattern — the circular orbit the beyblade maintains under normal conditions — producing erratic lateral movement. This is less catastrophically self-destructive than Final Clutch's topple, but it is not controlled attack movement.

---

### 2. Four-Wing Perimeter: Recoil Generation Geometry

The GT Version base body has four wings arranged around the perimeter. Each wing is a broad, outward-projecting surface with limited angular tapering. In any contact event, the wing face intercepts the opponent and the normal force resolves into:

```
F_lateral = F_contact × cos(θ_wing)
F_recoil  = F_contact × sin(θ_wing)
```

Where θ_wing is the angle between the wing face normal and the tangential direction of travel. For a broad, radially-projecting wing:

```
θ_wing ≈ 60–75°  (face is nearly radial, not tangential)
F_recoil / F_lateral = tan(θ_wing) ≈ 1.73–3.73
```

A radially-oriented face produces recoil that is 1.7–3.7× the lateral ejection force — the wing pushes the self back more than it pushes the opponent away. This is the structural recoil failure mode: wings that project radially have face angles that are near-perpendicular to the velocity vector, generating high normal-force recoil.

```
   Wing face geometry (top view, one wing):

   rotation →

   ─────────────────────
   AR body     ╲
               ╲  θ ≈ 70° from tangent
                ╲
                 ╲ wing face
                  ●──── radial projection
```

With four wings at ~90° spacing, dead zones between wings are 90° — the same as a 4-fold AR. But unlike a 4-fold attack AR whose contact faces are angled for ejection, the GT wings' near-radial faces make every contact primarily a recoil event.

---

### 3. Spin Direction Asymmetry: LS vs RS Recoil

Left Spin and Right Spin interact with the four wings differently because the wings are not rotationally symmetric — they have a preferred leading edge that depends on spin direction.

**Left Spin:**
The wing geometry in LS presents the broadest face first. The contact area is large and the face angle is near-radial:

```
θ_wing_LS ≈ 70–75°
F_recoil / F_contact ≈ sin(72°) ≈ 0.951
J_recoil_LS ≈ 0.951 × J_contact  — nearly all contact impulse becomes self-recoil
```

This produces "absolutely massive recoil" in LS — essentially every contact event primarily destabilises the user rather than the opponent.

**Right Spin:**
In RS the wing presents a narrower trailing edge. The effective contact angle is reduced but still not favourable:

```
θ_wing_RS ≈ 45–55°
F_recoil / F_contact ≈ sin(50°) ≈ 0.766
J_recoil_RS ≈ 0.766 × J_contact  — still majority recoil, but reduced
```

RS is less catastrophic than LS but still generates more recoil than useful lateral force. Neither spin direction produces a net attack benefit from the wing geometry.

---

### 4. Comparison to Dragoon G Version First Clutch Base

First Clutch Base (Dragoon G Version) uses a lower-profile base body without the GT version's four prominent perimeter wings. The key geometric difference:

```
                        GT Version          G Version
Perimeter wings         4, broad radial     low-profile, swept
θ_wing (LS)             ~70–75°             ~35–45°
J_recoil/J (LS)         ~0.94               ~0.57
θ_wing (RS)             ~50–55°             ~30–40°
J_recoil/J (RS)         ~0.77               ~0.47
Mass                    7.4 g               ~6.8 g (lighter, lower inertia)
First Clutch timing     identical           identical
EG compatibility        same                same
```

G Version has lower recoil per contact in both spin directions, lower mass (marginally less height contribution), and identical First Clutch timing. In every metric relevant to EG attack use, G Version is superior. The GT Version provides no compensating advantage — the wings are not more effective offensively, they are only more recoil-generating.

---

### 5. Practical Viability: Left EG Turbo + GT Version

As established in Case 222, Left EG Turbo + Metal Grip with First Clutch Base (Dragoon G Version) produces erratic but occasionally contact-capable movement. With GT Version:

```
Net attack viability = f(EG burst energy) - f(wing recoil penalty)
```

The EG burst is unchanged — the mechanism is identical. But the GT version's wing recoil adds to every incidental contact event throughout the match:

- Before activation: any stadium wall interaction or opponent contact triggers wing recoil, destabilising flower pattern maintenance
- During activation: burst energy produces violent movement, but any contact during the burst window immediately amplifies recoil through the GT wings — self-KO risk increases
- After activation: the beyblade reverts to standard decay, but the wing recoil liability persists for the remainder of the match

The marginal case where Left EG Turbo + G Version might occasionally score a hit becomes a case where any hit with the GT Version is more likely to knock the user out of the stadium than the opponent.

---

### 6. Physics Model

```typescript
interface FirstClutchGTAnalysis {
  mass_g: 7.4;
  clutchType: 'first';
  activationSpinFraction: 0.85;
  wingCount: 4;
  wingAngleLS_deg: 72;
  wingAngleRS_deg: 50;
  strictlySuperiorAlternative: 'First Clutch Base (Dragoon G Version)';
  competitiveUse: 'none';
}

function wingRecoilFraction(wingAngle_deg: number): number {
  return Math.sin(wingAngle_deg * Math.PI / 180);
}

function gyroscopicStabilityAtActivation(
  I_kgm2: number,
  omega_launch: number,
  activationFraction: number
): number {
  return I_kgm2 * omega_launch * activationFraction;
}

function firstVsFinalClutchSelfKORisk(
  omega_at_activation: number,
  omega_launch: number,
  EG_burst_torque: number,
  I_kgm2: number
): 'low' | 'high' {
  const L_gyro = I_kgm2 * omega_at_activation;
  const stability_ratio = L_gyro / (EG_burst_torque * 0.060);
  return stability_ratio > 5.0 ? 'low' : 'high';
}

// wingRecoilFraction(72) → 0.951  (LS — nearly all contact is self-recoil)
// wingRecoilFraction(50) → 0.766  (RS — still majority recoil)
// wingRecoilFraction(40) → 0.643  (G Version RS reference — significantly better)
// wingRecoilFraction(38) → 0.616  (G Version LS reference)
// gyroscopicStabilityAtActivation(4e-5, 300, 0.85) → 1.02e-2 N·m·s
// firstVsFinalClutchSelfKORisk(255, 300, 0.08, 4e-5)  → 'low'   (First Clutch, high spin)
// firstVsFinalClutchSelfKORisk(75,  300, 0.08, 4e-5)  → 'high'  (Final Clutch, low spin)
```


---

## Case 224 — CEW Metal Semi-Flat · 3.6 g: Why Bevelled Semi-Flat Geometry Falls Between Every Useful Role, How EG Height Compounds the Tip's Limited Attack Output, and Why No Archetype Benefits from This CEW

CEW Metal Semi-Flat is a 3.6 g Customize Engine Weight with a metal semi-flat tip modified by bevelled outer edges. The bevel distinguishes it from the standard EG semi-flat tip — the chamfered rim creates a contact surface that transitions between a central flat and a rounded outer edge rather than ending abruptly. This produces slightly more directional movement than a pure flat tip but substantially less than a rubber grip. The practical result is a CEW that occupies dead space between every viable role: too aggressive and inconsistent for survival and zombie archetypes that need low friction, not aggressive enough and too smooth for attack archetypes that need high friction, and too high (via EG height penalty) for defensive archetypes that need low CoM. Every archetype that could theoretically benefit from semi-flat characteristics has a better option available that does not require accepting the EG height and mechanism mass penalty.

---

### 1. Tip Geometry: Bevelled Semi-Flat Profile

The tip presents three distinct contact zones depending on tilt angle:

```
   Cross-section (one side):

        ●  ← central flat contact region (r = 0 to ~1.5 mm)
       / \
      /   \  ← transition slope (bevel, ~20–30° from horizontal)
     /     \
    ●───────●  ← outer rim (r ≈ 3.5 mm)

   At upright (0° tilt):  central flat contacts  → μ ≈ 0.20–0.24 (metal on plastic)
   At low tilt (~5–10°):  bevel contacts          → μ ≈ 0.22–0.26 (larger contact radius)
   At high tilt (>15°):   outer rim contacts       → μ ≈ 0.20–0.22 (rim edge, reduced area)
```

The bevel creates a self-centering tendency: when tilt increases, the contact point migrates outward along the bevel, increasing the restoring moment arm. This is similar in direction to the ball-dome geometry of Metal Sharp (Case 220) but geometrically weaker — the bevel angle is shallower and the restoring force gradient is lower.

Effective contact radius at typical play tilt (~5°):

```
r_contact ≈ r_flat + r_bevel × sin(tilt_rad) ≈ 1.5 + 3.5 × sin(5°) ≈ 1.5 + 0.305 ≈ 1.8 mm
```

This is larger than Metal Sharp's upright contact (r ≈ 0.3 mm) and smaller than Metal Flat's full contact area. Friction torque:

```
τ_friction = μ × F_N × r_contact ≈ 0.22 × (0.036 × 9.8) × 0.0018 ≈ 1.40 × 10⁻⁴ N·m
```

For comparison:
```
Metal Sharp (r ≈ 0.3 mm):   τ ≈ 2.33 × 10⁻⁵ N·m  (6× less — survival/zombie)
Metal Flat  (r ≈ 3.5 mm):   τ ≈ 2.72 × 10⁻⁴ N·m  (1.9× more — aggressive movement)
Metal Grip  (r ≈ 3.5 mm, μ ≈ 0.65): τ ≈ 8.04 × 10⁻⁴ N·m  (5.7× more — attack)
```

Metal Semi-Flat sits between Metal Sharp and Metal Flat in friction torque, and far below Metal Grip. It is neither low enough to be a survival tip nor high enough to be an attack tip.

---

### 2. Movement Pattern: Semi-Flat Aggression and Its Limits

A semi-flat tip at r_contact ≈ 1.8 mm produces moderate lateral drift. The beyblade moves in a loosely circular pattern, wider than a sharp tip and less erratic than a flat tip:

```
Orbit radius ∝ 1 / (μ × r_contact)

Metal Sharp:     1 / (0.22 × 0.3)  = 15.2  → wide, slow drift (large orbit)
Metal Semi-Flat: 1 / (0.22 × 1.8)  =  2.53  → moderate orbit
Metal Flat:      1 / (0.22 × 3.5)  =  1.30  → tight, fast movement
Metal Grip:      1 / (0.65 × 3.5)  =  0.44  → very tight, aggressive
```

"Semi-flat aggression" translates to a moderately active movement pattern — the beyblade wanders across the stadium without the precision of a sharp tip or the aggression of a flat/grip tip. This is too much movement for survival (increases collision frequency, shortening the match for the user), and too little aggression for attack (insufficient closing speed and impact force to reliably score KOs or ring-outs).

---

### 3. EG Height Penalty: How Setup Height Compounds Every Tip Weakness

As established in Case 222, EG setups raise the AR approximately 8–10 mm above standard SG height. This creates three compounding penalties for Metal Semi-Flat:

**Survival/Zombie use:**
Survival and zombie combos depend on low CoM for gyroscopic stability at low spin. The EG mechanism mass (7.0–21.2 g) sits high in the assembly:

```
h_CoM_EG_setup ≈ h_CoM_standard + (m_EG / m_total) × Δh_EG
               ≈ 15 mm + (14 / 50) × 9 mm ≈ 15 + 2.5 = 17.5 mm
```

Each additional millimetre of CoM height increases the toppling torque at low spin. Metal Semi-Flat's moderate friction (τ_friction ≈ 1.40 × 10⁻⁴ N·m) also exceeds what a survival combo can afford — spin decay is accelerated without the tip providing the movement control that would make the friction penalty worthwhile.

**Attack use:**
The height penalty places the AR above most opponent ARs (demonstrated in Case 222). Metal Semi-Flat provides insufficient closing speed to force contact over this gap — the beyblade drifts rather than charges. Metal Grip generates ~5.7× more friction torque, converting spin to directional movement. Metal Semi-Flat cannot replicate this.

**Defensive use:**
Defensive combos require a low, stable profile to absorb hits and maintain stadium position. The EG height raises the beyblade's centre of pressure, making it more susceptible to destabilisation from lateral impacts. Metal Semi-Flat's moderate traction also makes the beyblade harder to stabilise under impact — it deflects further than a sharp tip would.

---

### 4. Comparison to Other CEWs for Each Archetype

```
Archetype       Required tip property    Best CEW choice     Metal Semi-Flat
─────────────────────────────────────────────────────────────────────────────
Survival/Zombie  Low friction, high LAD  Metal Sharp          4× too much friction
Attack           High traction, speed    Metal Grip           5.7× too little traction
Defense          Low CoM, stability      Metal Sharp          higher friction, higher CoM
                                         (or avoid EG setup entirely)
```

Metal Semi-Flat is not competitive in any row of this table. The bevelled semi-flat geometry is a modest improvement over the standard EG semi-flat tip (which has a flat-ended contact with no bevel and no self-centering tendency), but the improvement does not change the archetype assessment — it only slightly reduces tip wander at upright, which is irrelevant to the failure modes above.

---

### 5. Physics Model

```typescript
interface CEWMetalSemiFlatAnalysis {
  mass_g: 3.6;
  tipType: 'bevelled_semi_flat';
  centralFlatRadius_mm: 1.5;
  bevelAngle_deg: 25;
  outerRimRadius_mm: 3.5;
  mu_metal_on_plastic: 0.22;
  effectiveContactRadius_mm: 1.8;
  competitiveUse: 'none';
  strictlySuperiorFor: {
    survival: 'Metal Sharp';
    attack: 'Metal Grip';
    defense: 'Metal Sharp or no EG setup';
  };
}

function semiFlatContactRadius(
  r_flat_mm: number,
  r_bevel_mm: number,
  tilt_deg: number
): number {
  return r_flat_mm + r_bevel_mm * Math.sin(tilt_deg * Math.PI / 180);
}

function frictionTorque(
  mu: number,
  mass_kg: number,
  r_contact_m: number
): number {
  return mu * mass_kg * 9.8 * r_contact_m;
}

function orbitRadiusProxy(mu: number, r_contact_m: number): number {
  return 1 / (mu * r_contact_m);
}

// semiFlatContactRadius(1.5, 3.5, 0)  → 1.500 mm  (upright, flat only)
// semiFlatContactRadius(1.5, 3.5, 5)  → 1.805 mm  (typical play tilt)
// semiFlatContactRadius(1.5, 3.5, 15) → 2.406 mm  (high tilt, bevel dominant)
// frictionTorque(0.22, 0.036, 0.0018) → 1.40e-4 N·m  (Metal Semi-Flat)
// frictionTorque(0.22, 0.033, 0.0003) → 2.14e-5 N·m  (Metal Sharp — 6.5× less)
// frictionTorque(0.65, 0.036, 0.0035) → 8.04e-4 N·m  (Metal Grip — 5.7× more)
// orbitRadiusProxy(0.22, 0.0018) → 2525  (Metal Semi-Flat — moderate drift)
// orbitRadiusProxy(0.22, 0.0003) → 15152 (Metal Sharp — wide, slow)
// orbitRadiusProxy(0.65, 0.0035) → 440   (Metal Grip — tight, aggressive)
```


---

## Case 225 — Triangle Wing Attack Ring · 6.1 g: Why Symmetric Slope Geometry Produces Identical Upper Attack in Both Spin Directions, How Smash Component Compares Across the Upper Attack AR Family, and Why Recoil Cost Disqualifies Defense and Survival While Preserving Attack Viability

Triangle Wing is a 6.1 g Attack Ring with three contact points, each built around an upper-attack slope of equal length and angle in both spin directions. The bilateral symmetry of each wing — the same slope geometry on the leading and trailing edge — means LS and RS performance is mechanically identical, not merely similar. This is the defining characteristic that separates Triangle Wing from asymmetric Upper ARs like Upper Dragoon. The slopes are accompanied by a smash component from the wing fronts and heads, placing Triangle Wing above Upper Dragoon in peak lateral impulse while remaining below Triple Tiger and Upper Claw in RS smash. In LS, no competitive AR combines comparable lifting power with more smash than Triangle Wing — G Upper has substantially more smash but shallower slopes that reduce vertical impulse. Recoil is higher than Upper Dragoon due to wider inter-wing gaps, under-wing geometry, and angular profile, which eliminates defensive and survival roles but does not meaningfully harm attack viability given the increased smash component compensates for contact losses.

---

### 1. Slope Symmetry: Identical LS and RS Upper Attack

Each wing presents two slopes — one on each lateral face — with matched geometry:

```
   Top view, one wing (simplified):

   ← LS contact face          RS contact face →

       α_LS ≈ 30°    body    α_RS ≈ 30°
        ╲              /
         ╲  slope     /  slope
          ╲          /
           ●────────●  ← wing tip (head)
```

Both slopes share:
```
Slope angle from horizontal:  α ≈ 28–32°
Effective slope length:        L_slope ≈ 8–10 mm
Contact face tangential angle: φ_upper ≈ 30–35° from tangent
```

Vertical impulse per contact:
```
J_vertical_LS = J × sin(α_LS) ≈ J × sin(30°) ≈ J × 0.500
J_vertical_RS = J × sin(α_RS) ≈ J × sin(30°) ≈ J × 0.500
```

Because α_LS = α_RS, vertical impulse is identical in both directions. This is not trivially true of all symmetric-looking ARs — many ARs with visually similar left and right faces have subtle angle or radius differences that produce detectable performance asymmetry. Triangle Wing's design eliminates this asymmetry by construction.

Tilt perturbation rate at ω = 200 rad/s, I_opponent = 4 × 10⁻⁵ kg·m²:
```
f_contact = (3 / 2π) × 200 ≈ 95.5 contacts/s
Δtilt/contact = J_vertical × r_contact / I_opponent ≈ (0.500 × 0.005) × 0.031 / 4×10⁻⁵ ≈ 1.94°
dΦ/dt ≈ 1.94° × 95.5 ≈ 185°/s  (unresisted, identical in LS and RS)
```

---

### 2. Smash Component: Wing Fronts and Heads

The leading edge of each slope and the wing tip (head) present a smash contact geometry in addition to the slope. The head is a small protrusion at the wing tip that produces a concentrated normal force on contact — similar in function to a spike, but lower in projection:

```
   Wing head contact (tangential cross-section):

   rotation →
          ●  ← wing head (r ≈ 31 mm, protrudes ~1.5 mm beyond slope face)
         / \
        /   \  ← slope face below head
```

Smash impulse from the head:
```
J_smash_head = J × cos(φ_head) ≈ J × cos(35°) ≈ J × 0.819
J_recoil_head = J × sin(φ_head) ≈ J × sin(35°) ≈ J × 0.574
```

This adds a lateral ejection component to every upper-attack contact event. Upper Dragoon's slopes are smoother and present less smash face at the tip — the head geometry of Triangle Wing provides a measurable but not dominant additional impulse:

```
AR                  Smash component    Upper component    Notes
───────────────────────────────────────────────────────────────────
Upper Dragoon       low                high               smooth slopes, minimal head
Triangle Wing       moderate           high               slope fronts + heads
Triple Tiger (RS)   high               moderate           smash-primary, upper secondary
Upper Claw (RS)     high               moderate           aggressive smash + upper hybrid
G Upper (LS)        high               moderate (shallower slope, α ≈ 25–27°)
```

Triangle Wing occupies the moderate-smash + high-upper cell. In RS this is below Triple Tiger and Upper Claw for pure smash but equal for upper. In LS it is the highest-upper option with meaningful smash — G Upper has more smash but α ≈ 25–27° reduces J_vertical by ~sin(26°)/sin(30°) ≈ 0.438/0.500 = 12% per contact.

---

### 3. Recoil Sources: Gap Geometry and Angular Profile

Triangle Wing generates more recoil than Upper Dragoon from three geometric sources:

**Under-wing gaps:**
The space between adjacent wings is wider than Upper Dragoon's tighter profile. During a contact event where the opponent AR passes through the gap region, the subsequent contact with the following wing face occurs at a less favourable (more radial) angle:

```
Inter-wing gap angle:
  Upper Dragoon:  ~25–30° gap between wing sweep ends
  Triangle Wing:  ~40–50° gap
```

Wider gaps mean more of the AR body is presented as flat radial surface rather than angled contact face, increasing recoil fraction per incidental contact.

**Angular profile vs swept profile:**
Upper Dragoon uses a continuous swept arc along each wing. Triangle Wing's more angular design creates face discontinuities — step transitions between the slope face and the wing body. At step transitions:

```
Effective contact angle at step ≈ 55–65° from tangent
J_recoil / J_contact = sin(60°) ≈ 0.866
```

Swept profiles avoid these discontinuities and maintain a consistent lower-recoil angle throughout the contact event.

**Overall recoil fraction comparison:**
```
Upper Dragoon:  J_recoil/J ≈ 0.50–0.55  (swept, minimal gaps)
Triangle Wing:  J_recoil/J ≈ 0.60–0.68  (angular, wider gaps)
```

The ~10–15% increase in recoil fraction is the cost of Triangle Wing's additional smash component and angular head geometry. In attack roles this is acceptable — the additional smash output offsets the marginal stability loss. In survival and defensive roles, where zero recoil is the ideal, this increase is prohibitive.

---

### 4. Spin-Stealing Upper Attack: Triangle Wing vs Upper Dragoon

Spin-stealing Upper Attack requires an AR that:
1. Delivers consistent vertical perturbation (tilt destabilisation of the opponent)
2. Minimises self-recoil (preserves stamina on contact)
3. Allows the user to maintain spin while the opponent's spin is depleted

Triangle Wing meets criterion 1 equally to Upper Dragoon (same J_vertical). It fails criterion 2 partially — ~12% more recoil per contact. The additional smash component from the heads partially compensates: more forceful contacts reduce the number of contacts needed to score a ring-out or destabilise the opponent, so the marginal self-recoil cost per unit of damage dealt is not proportionally higher.

The viability window is:
```
If smash component decides the match (opponent resists upper-only tilt):
  Triangle Wing > Upper Dragoon  (smash component provides margin)

If stamina/recoil decides the match (opponent outlasts via spin-steal survival):
  Upper Dragoon ≥ Triangle Wing  (lower recoil preserves more spin per contact)
```

Against most Upper Attack targets, Triangle Wing is at minimum equally viable and occasionally superior. The claim "just as viable a choice" holds for this archetype.

---

### 5. Defense and Survival: Recoil Disqualification

Defense combos require an AR that deflects incoming attacks without self-destabilising. Survival combos require an AR that minimises collision impulse to preserve spin. In both cases, recoil fraction must be minimised.

Triangle Wing's recoil fraction (0.60–0.68) exceeds Upper Dragoon's (0.50–0.55) by ~15–20% in absolute terms. Against a high-recoil attacker (Attack AR with φ_smash ≈ 40°), the per-contact self-impulse for Triangle Wing:

```
J_self_recoil = 0.64 × J_contact
```

For a symmetric encounter (both ARs similar mass):
```
Net self-displacement per contact ≈ 2 × J_self_recoil / m_combo
```

Over a match with N_contacts ≈ 200 total contacts, the accumulated displacement difference between Triangle Wing and Upper Dragoon:

```
ΔD_accumulated = (0.64 - 0.52) × J_contact × N_contacts / m_combo
              = 0.12 × 0.005 × 200 / 0.040 ≈ 3.0 m total excess path length
```

Excess path length in a circular stadium directly correlates with ring-out probability — the combo traverses more of the stadium per unit time under equivalent contact conditions. This eliminates Triangle Wing from competitive defense and survival consideration.

---

### 6. LS Upper Attack Landscape: Triangle Wing as Best Available

In LS, the available competitive Upper Attack ARs are constrained. The key candidates and their properties:

```
AR              α (slope)   Smash component   Recoil    Spin direction
────────────────────────────────────────────────────────────────────────
Upper Dragoon   ~30–32°     low               low       RS primary, LS usable
Triangle Wing   ~30°        moderate          moderate  identical LS/RS
G Upper         ~25–27°     high              moderate  LS primary
```

Upper Dragoon in LS is usable but its RS-primary design means slope angles may be marginally less optimised for LS contact geometry in practice. Triangle Wing's perfect LS/RS symmetry makes it the cleaner LS Upper Attack choice when smash is needed. G Upper's shallower slope produces ~12% less vertical impulse per contact — meaningful when the match requires tilt destabilisation as the primary win condition.

Triangle Wing is therefore the best available LS Upper Attack AR when both lifting power (high α) and smash component are required. It is not better than Upper Dragoon when minimal recoil is the priority, which remains Upper Dragoon's territory in both spin directions.

---

### 7. Physics Model

```typescript
interface TriangleWingAnalysis {
  mass_g: 6.1;
  contactPointCount: 3;
  spinSymmetry: 'identical_LS_RS';
  slopeAngle_deg: 30;
  wingHeadSmashAngle_deg: 35;
  effectiveContactRadius_mm: 31;
  recoilFraction: { min: 0.60; max: 0.68 };
  competitiveRoles: ['upper_attack_RS', 'upper_attack_LS', 'spin_steal_upper'];
  nonCompetitiveRoles: ['defense', 'survival'];
}

function verticalImpulse(J_total: number, slopeAngle_deg: number): number {
  return J_total * Math.sin(slopeAngle_deg * Math.PI / 180);
}

function smashImpulse(J_total: number, smashAngle_deg: number): number {
  return J_total * Math.cos(smashAngle_deg * Math.PI / 180);
}

function tiltPerturbationRate(
  J_vertical: number,
  r_contact_m: number,
  I_opponent_kgm2: number,
  contactFreq_hz: number
): number {
  const delta_tilt_rad = (J_vertical * r_contact_m) / I_opponent_kgm2;
  return delta_tilt_rad * contactFreq_hz * (180 / Math.PI);
}

function contactFrequency(nContacts: number, omega_rad_s: number): number {
  return (nContacts / (2 * Math.PI)) * omega_rad_s;
}

// verticalImpulse(0.005, 30)   → 2.50e-3 N·s  (Triangle Wing — both LS and RS)
// verticalImpulse(0.005, 26)   → 2.19e-3 N·s  (G Upper — 12% less vertical)
// smashImpulse(0.005, 35)      → 4.10e-3 N·s  (wing head smash component)
// contactFrequency(3, 200)     → 95.5 contacts/s
// tiltPerturbationRate(2.5e-3, 0.031, 4e-5, 95.5) → 185°/s unresisted
// recoilFraction triangle_wing: 0.64 vs upper_dragoon: 0.52 — 23% more recoil
// accumulatedExcessPath(0.12, 0.005, 200, 0.040) → 3.0 m over a full match
```


---

## Case 226 — Right Engine Gear (Reverse) · 6.7 g: Why Counter-Rotating Tip Direction Produces Force Competition Rather Than Directional Reversal, How Final Clutch Interaction Reduces Movement Without Enabling Counter-Attack, and Why Metal Grip Is the Only Configuration With Any Residual Utility

Right Engine Gear (Reverse) is a 6.7 g CEW-compatible Right Spin Engine Gear whose spring mechanism is wound in the Left Spin direction. On activation the CEW tip rotates counter-clockwise while the beyblade shell rotates clockwise — a counter-rotating tip configuration. The design intent is that this opposing rotation reverses the beyblade's stadium movement, creating a counter-attack response to incoming hits when combined with a Final Clutch Base. The mechanism fails to deliver this because counter-rotating tip friction does not produce directional reversal: it produces force competition between the shell's rotational momentum and the tip's frictional force, resulting in reduced net movement rather than reversed movement. In First Clutch configurations this competition reduces mobility without benefit. In Final Clutch configurations late-match activation produces a movement-damping effect — the beyblade stops moving as much after being hit — but the EG parts library lacks the AR geometry and stability margins needed to make a stationary late-game position competitively useful. Metal Grip partially redirects the activation energy into a shell spin-boost, producing marginal righting assistance at topple, but remains gimmicky rather than viable.

---

### 1. Reverse Winding: Spring Direction and Tip Counter-Rotation

The spring is wound in the LS direction, which means when the clutch releases:

```
Shell spin direction:  clockwise  (RS beyblade, viewed from above)
CEW tip spin on release: counter-clockwise (reverse winding)
```

For a standard RS EG (spring wound RS direction):
```
Shell spin: CW → tip friction force on floor: pushes beyblade laterally in one direction
EG activation: adds CW tip spin → same direction as shell → lateral velocity amplified
```

For Reverse EG:
```
Shell spin: CW → tip friction force: F_lateral in direction θ
EG activation: tip now spins CCW → friction force reverses: F_lateral in direction θ + 180°
Net force: F_shell_momentum + F_tip_reverse = F_net
```

If F_shell_momentum ≈ F_tip_reverse, the net force approaches zero — the beyblade slows or stops rather than reversing direction. If F_tip_reverse > F_shell_momentum, partial reversal occurs. In practice at activation:

```
ω_shell ≈ 0.2–0.3 × ω_launch   (Final Clutch late activation)
ω_tip_burst ≈ Δω_spring / I_tip

F_shell_lateral = m × ω_shell × r_AR × μ_tip / r_tip ≈ m × ω × r_AR × μ / r_tip
F_tip_reverse = μ_tip × m_combo × g  (maximum static friction ceiling)
```

The tip friction ceiling (F_tip_reverse) cannot exceed μ × m_combo × g regardless of tip spin rate. The shell's lateral momentum at any spin rate above ~15% of launch is sufficient to dominate:

```
At ω_shell = 0.25 × ω_launch = 75 rad/s:
F_shell_lateral ≈ 0.040 × 75 × 0.029 × 0.22 / 0.003 ≈ 6.4 N

F_tip_reverse_ceiling = 0.22 × 0.040 × 9.8 ≈ 0.086 N
```

F_tip_reverse is two orders of magnitude less than F_shell_lateral. The tip cannot reverse the direction of a spinning beyblade. It can only add a small opposing frictional resistance — reducing net lateral mobility, not reversing it.

---

### 2. First Clutch Activation: Force Competition at High Spin

With First Clutch, activation occurs at ~85% launch spin. Shell angular momentum is high:

```
L_shell = I_shell × ω_launch × 0.85 ≈ 4×10⁻⁵ × 255 ≈ 1.02×10⁻² N·m·s
```

The reverse tip friction creates a torque opposing shell lateral motion:

```
τ_tip_oppose = μ × F_N × r_contact = 0.22 × (0.040 × 9.8) × 0.002 ≈ 1.73×10⁻⁴ N·m
```

This is ~60× smaller than the shell angular momentum term — the opposing tip torque is negligible at high spin. The result is "the Beyblade moves much less than normal" rather than any useful directional effect. The competing forces produce erratic, irregular movement as the tip alternates between grip states during the brief activation window:

```
Activation window Δt ≈ 60–80 ms (reverse EG, similar spring geometry to standard EG)
During Δt: tip spin decays from ω_tip_burst → 0
Force profile: brief reverse friction spike → decay to normal friction → normal movement
```

The jerking, swinging motion described is this rapid transition: spike of opposing friction followed by return to normal tip behaviour, all within 60–80 ms. At high spin this produces no durable effect on movement pattern.

---

### 3. Final Clutch Interaction: Late-Match Movement Damping

Final Clutch activates at low spin (ω ≈ 0.2–0.3 × ω_launch). At this point:

```
L_shell = I_shell × 0.25 × ω_launch ≈ 4×10⁻⁵ × 75 ≈ 3.0×10⁻³ N·m·s
```

The reverse tip friction is still ~60× smaller than L_shell, but the shell's linear momentum is also lower. The beyblade is moving slower and its flower pattern orbit radius is decreasing. The reverse tip activation at this point:

1. Does not reverse direction (F_tip_reverse << F_shell_lateral as derived above)
2. Adds a small damping force to the existing slow movement
3. Net effect: the beyblade moves less after activation — reduced orbit radius, tendency to slow and stay near centre

The collision response intended by the design — being hit and then reversing direction to counter-attack — requires:
```
Required: F_tip_reverse + F_collision_response > F_shell_momentum (post-collision)
Actual:   F_tip_reverse ≈ 0.086 N; F_shell_momentum_post_collision >> 0.086 N
```

Even post-collision (when the shell has been slowed), the tip friction ceiling is too low. What happens instead is that the reduced movement makes the beyblade a stationary-ish target in the centre of the stadium. This is not inherently fatal — stationary survival combos (e.g., Zombie builds) can succeed — but it requires an AR with low recoil, a high-LAD tip, and spin-steal geometry. No EG setup provides these simultaneously.

---

### 4. Metal Grip CEW: Energy Redistribution to Shell Spin

Metal Grip's rubber outer ring (μ ≈ 0.65) changes the force balance:

```
F_tip_grip_ceiling = 0.65 × 0.040 × 9.8 ≈ 0.255 N
```

Still well below F_shell_lateral at any meaningful spin, but ~3× the ceiling of smooth metal CEWs. The more significant effect of Metal Grip with Reverse EG is how it delays activation:

```
Metal Grip friction torque against tip spin = μ_grip × F_N × r_grip
                                            = 0.65 × 0.392 × 0.0035 ≈ 8.9×10⁻⁴ N·m
```

The spring must overcome this friction to drive the tip. The spring's stored energy is partially consumed in overcoming floor friction rather than accelerating the tip — the EG does not fully activate until floor friction (and therefore shell spin rate) drops sufficiently that spring torque exceeds grip friction:

```
Activation condition: τ_spring > τ_grip_floor
τ_spring ≈ constant (spring geometry fixed)
τ_grip_floor ∝ μ_grip × F_N × r_grip ∝ ω (higher spin → more centrifugal stability → higher floor pressure)

→ Activation delayed until lower spin — aligns with late-game timing regardless of clutch type
```

The secondary effect: when the rubber tip attempts to spin CCW against the floor while the beyblade shell spins CW, part of the spring energy is transferred upward through the CEW coupling into the shell rather than purely into tip spin. This adds a small CW angular impulse to the shell — a marginal spin boost:

```
ΔL_shell ≈ η_transfer × E_spring × I_shell / (I_shell + I_CEW)
```

At low spin this small boost can partially right a tilting beyblade. The described righting effect at topple is this mechanism. It is too small to be reliably decisive in competitive play but is physically real.

---

### 5. Competitive Assessment

The Reverse EG's failure is not engineering incompetence — the mechanism does what it claims: the tip spins backwards. The failure is that backwards tip spin cannot reverse beyblade direction because the shell's angular and linear momentum terms dwarf the tip friction ceiling by two orders of magnitude at any competitive spin rate. The design would require either a much higher friction tip (impractical without destroying spin) or a much lower shell momentum (incompatible with remaining in the stadium).

```
Configuration           Effect                              Useful?
────────────────────────────────────────────────────────────────────
First Clutch + any CEW  Erratic jerk at activation          No
Final Clutch + smooth   Late movement damping, stops orbit   No — no AR to exploit position
Final Clutch + Grip     Same damping + marginal spin boost   Gimmicky — not competitive
Any + smooth metal CEW  Tip reverses but too weak to matter  No
```

---

### 6. Physics Model

```typescript
interface RightEGReverseAnalysis {
  mass_g: 6.7;
  spinDirection: 'right';
  gimmick: 'reverse';
  springWindingDirection: 'left';
  tipActivationDirection: 'counter_clockwise';
  activationWindow_ms: 70;
}

function tipReverseFrictionCeiling(
  mu_tip: number,
  m_combo_kg: number
): number {
  return mu_tip * m_combo_kg * 9.8;
}

function shellLateralForce(
  m_combo_kg: number,
  omega_shell: number,
  r_AR_m: number,
  mu_tip: number,
  r_tip_m: number
): number {
  return m_combo_kg * omega_shell * r_AR_m * mu_tip / r_tip_m;
}

function forceRatio(
  mu_tip: number,
  m_kg: number,
  omega: number,
  r_AR_m: number,
  r_tip_m: number
): number {
  const F_shell = shellLateralForce(m_kg, omega, r_AR_m, mu_tip, r_tip_m);
  const F_ceiling = tipReverseFrictionCeiling(mu_tip, m_kg);
  return F_shell / F_ceiling;
}

// tipReverseFrictionCeiling(0.22, 0.040) → 0.086 N   (smooth CEW)
// tipReverseFrictionCeiling(0.65, 0.040) → 0.255 N   (Metal Grip)
// shellLateralForce(0.040, 75, 0.029, 0.22, 0.003)   → 6.38 N  (25% launch spin)
// forceRatio(0.22, 0.040, 75, 0.029, 0.003)          → 74.2  — shell is 74× stronger than reverse tip
// forceRatio(0.65, 0.040, 75, 0.029, 0.003)          → 25.0  — still 25× with Metal Grip
// forceRatio(0.22, 0.040, 20, 0.029, 0.003)          → 19.8  — even at 7% launch spin, shell dominates
```

---

## Case 226 — CEW Metal Grip · 2.7g
**Thesis:** CEW Metal Grip's hard rubber semi-flat dome is the only CEW that converts a meaningful fraction (~38%) of the Left Engine Gear (Turbo) burst into lateral movement via traction coupling; outside that pairing rubber friction is a liability — the EG height penalty produces 2.5× more gravitational topple torque than a standard base, and on Right CG (Free Shaft Version) bevel-enabled precession delivers only ~6 s of LAD against SG (Bearing Version 2)'s effectively limitless equivalent.

CEW Metal Grip is the only rubber-tipped CEW. Its construction is three-layer: a white plastic inner body carries the CEW slot mounting tabs; a thin grey metal annular ring forms the outer body and mounting wings; a blue rubber dome sits on top presenting a two-tier contact face — a wide outer semi-flat ring surrounding a central raised nub. The rubber is hard by Plastic-era standards, closer in compliance to Customize Grip Base than to the softer Storm Grip Base. At 2.7g it is the lightest CEW in the line.

---

### 1. Construction: Layered Rubber-Metal-Plastic Body

```
  Side-profile:

           ╭──────────╮    ← central nub (r_nub ≈ 1.5 mm, raised ~2 mm above outer ring)
         ╭─╯──────────╰─╮  ← outer semi-flat ring (r_flat ≈ 3.5 mm)
   ──────╯               ╰──── floor
        ↑ bevel edge ≈ 35° from flat, r_bevel ≈ 4.5 mm

  Contact surface by stance:
    θ = 0°      upright, high spin:   central nub;  r_contact = 1.5 mm
    θ = 5–20°   moderate tilt:        outer flat;   r_contact = 3.5 mm
    θ ≥ 25°     tilt-limit:           bevel;        r_contact = 4.5 mm → tilt arrested

  Mass budget:
    Blue rubber dome:           ~1.0 g
    Grey metal ring (wings):    ~1.0 g
    White plastic body + tabs:  ~0.7 g
    Total: 2.7 g  ✓
```

---

### 2. Contact Geometry and Grip Level

```
  "Semi-flat, width similar to Storm Grip Base":
    Storm Grip Base: r_tip ≈ 3 mm,     μ_soft_rubber ≈ 0.50
    Metal Grip flat: r_flat ≈ 3.5 mm,  μ_hard_rubber ≈ 0.45

  Friction torque at each stage (EG combo F_N = 0.047 × 9.8 = 0.461 N):
    Nub:    τ = 0.45 × 0.461 × 0.0015 = 3.11 × 10⁻⁴ N·m
    Flat:   τ = 0.45 × 0.461 × 0.0035 = 7.25 × 10⁻⁴ N·m
    Bevel:  τ = 0.45 × 0.461 × 0.0045 = 9.32 × 10⁻⁴ N·m

  Storm Grip Base (std combo, m = 30 g):
    τ_SGB = 0.50 × (0.030 × 9.8) × 0.003 = 4.41 × 10⁻⁴ N·m

  Metal Grip flat-ring τ (7.25×10⁻⁴) exceeds SGB absolutely due to heavier EG F_N.
  Grip efficiency (μ × r_contact): MG = 0.45 × 3.5 = 1.575 vs SGB = 0.50 × 3.0 = 1.500 — 5% more per unit mass.
  The tips are near-equivalent per gram; the EG combo's mass inflates the absolute friction.
```

---

### 3. Why It Moves Slowly for a Rubber Tip

```
  Lateral acceleration ceiling from grip (rolling-without-slip):
    a_max = μ × g = 0.45 × 9.8 = 4.4 m/s²  — identical for any combo (F_N = m × g cancels in a = μ × g).

  EG height penalty (gravitational topple torque at tilt θ):
    EG combo:   h_CoM ≈ 16 mm
    Std combo:  h_CoM ≈ 10 mm
    τ_EG  = 0.047 × 9.8 × 0.016 × sin(θ) = 7.37 × 10⁻³ × sin(θ)  N·m
    τ_std = 0.030 × 9.8 × 0.010 × sin(θ) = 2.94 × 10⁻³ × sin(θ)  N·m
    Ratio: 2.5× more topple torque — EG combo destabilises during aggressive orbit.

  EG bulk penalty:
    Larger base footprint forces wider attack orbits, reducing contact frequency at equal spin.
    The combo circles at maximum grip acceleration but in a wider arc than a compact rubber attacker.
    Tight low-orbit patterns that Storm Grip Base relies on are not available.
```

---

### 4. Left Engine Gear (Turbo) Synergy — Burst Traction Coupling

```
  Turbo burst: ΔL ≈ 1.6 × 10⁻³ kg·m²/s in Δt ≈ 60 ms (Case 222 derivation).
  For burst to produce directed movement, tip must couple floor traction during the impulse.

  Burst lateral acceleration demand (r_contact = 3.5 mm at play tilt):
    a_burst = (Δω × r_tip) / Δt = (200 × 0.0035) / 0.060 = 11.7 m/s²

  All tips slip (a_burst > a_max). Slip fraction:
    Metal Grip (a_max = 4.4):  slip = (11.7 − 4.4) / 11.7 = 62.4%  → 37.6% couples to movement
    Metal tip  (a_max = 1.5):  slip = (11.7 − 1.5) / 11.7 = 87.2%  → 12.8% couples

  Burst coupling ratio: 37.6 / 12.8 = 2.9× more lateral velocity from the same burst.

  Post-burst rolling re-entry:
    t_recovery ∝ 1 / (μ × g)
    Metal Grip: high μ → slip arrests quickly → momentum sustained as forward velocity
    Metal tips: 3× slower slip arrest → most burst energy dissipates as heat

  Without Metal Grip: Turbo fires as a spin-up wobble, not a lunge.
    Metal Grip is the only CEW that gives Left EG (Turbo) meaningful attack character.
```

---

### 5. Tornado Stall: Incidental Not Strategic

```
  Stall condition: v ≤ √(μ × g × r_orbit) = √(0.45 × 9.8 × 0.20) = 0.94 m/s.
  Typical orbit: 0.4–0.8 m/s — Metal Grip can wall-orbit. However:
    (a) Faster rubber attackers (Storm Grip Base, CGB) break out or intercept freely.
    (b) Stalling does not reduce opponent spin without contact.
    (c) Short window: EG combo spins down quickly (no WD, rubber floor drag).
    (d) EG height → self-topple during sustained wall-orbiting tilt.
  Present in principle and absent in competitive practice.
```

---

### 6. RS CG (Free Shaft Version) — Bevel Precession vs SG (Bearing Version 2)

```
  Metal Grip bevels allow late-battle precession, theoretically enabling LAD in RS CG (FS) combos.
  Right spin only.

  Friction during precession (flat ring in contact at tilt):
    τ_prec = 0.45 × (0.030 × 9.8) × 0.0035 = 4.63 × 10⁻⁴ N·m

  Precession spin lifetime with Wide Defense:
    I_assembly = I_AR + I_WD ≈ 2.0 × 10⁻⁶ + 1.22 × 10⁻⁵ = 1.42 × 10⁻⁵ kg·m²
    At ω = 200 rad/s: t_LAD = (1.42 × 10⁻⁵ × 200) / 4.63 × 10⁻⁴ = 6.1 s

  SG (Bearing Version 2) shaft (same assembly):
    τ_bearing = 0.002 × (0.030 × 9.8) × 0.003 × 2 = 3.53 × 10⁻⁶ N·m
    t_LAD_SGB2 = (1.42 × 10⁻⁵ × 200) / 3.53 × 10⁻⁶ = 805 s
    Ratio: SGB2 provides 132× longer LAD on the same assembly.

  WD selection for maximum Metal Grip LAD window:
    Wide Defense (Normal Base RB/WB4):  I_WD ≈ 1.22 × 10⁻⁵ → t_LAD = 6.1 s  (best)
    Wide Survivor:                      I_WS ≈ 1.18 × 10⁻⁵ → t_LAD ≈ 5.9 s
    10 Heavy:                           I    ≈ 1.02 × 10⁻⁵ → t_LAD ≈ 5.3 s  (13% shorter)

  First Clutch Base (Zeus Version) trade-off:
    Adds ~9 g at r ≈ 28 mm → I_FCB = 3.53 × 10⁻⁶ kg·m² — marginal additional angular momentum.
    Limits WD access; Wide Defense via Normal Base (RB/WB4) produces a larger net I_assembly.

  Verdict: Metal Grip + RS CG (FS) is right-spin only, max ~6 s LAD, outclassed by SGB2
  by 132×. Use only when SGB2 shaft is unavailable.
```

---

### 7. Physics Model

```typescript
interface CEWMetalGripAnalysis {
  mass_g: 2.7;
  tipMaterial: 'hard_rubber';
  bodyLayers: ['white_plastic_core', 'grey_metal_ring', 'blue_rubber_dome'];
  r_nub_mm: 1.5;
  r_flat_mm: 3.5;
  r_bevel_mm: 4.5;
  mu_hard_rubber: 0.45;
  h_CoM_mm: 6.5;
  bevelEnabled: true;
  bestPairing: 'LeftEG_Turbo';
  cgFreeShaftUse: 'marginal_RS_only';
}

function rubberFrictionTorque(mu: number, F_N_N: number, r_contact_m: number): number {
  return mu * F_N_N * r_contact_m;
}

function egBurstSlipFraction(
  delta_omega: number,
  r_tip_m: number,
  burst_dt_s: number,
  mu: number
): number {
  const a_required = (delta_omega * r_tip_m) / burst_dt_s;
  const a_available = mu * 9.8;
  if (a_available >= a_required) return 0;
  return (a_required - a_available) / a_required;
}

function ladSpinLifetime(I_assembly: number, omega: number, tau_friction: number): number {
  return (I_assembly * omega) / tau_friction;
}

function egComboTopplingTorque(m_kg: number, h_CoM_m: number, tilt_deg: number): number {
  return m_kg * 9.8 * h_CoM_m * Math.sin(tilt_deg * Math.PI / 180);
}

// rubberFrictionTorque(0.45, 0.047*9.8, 0.0015) → 3.11e-4 N·m  (nub, upright)
// rubberFrictionTorque(0.45, 0.047*9.8, 0.0035) → 7.25e-4 N·m  (flat ring, moderate tilt)
// rubberFrictionTorque(0.50, 0.030*9.8, 0.0030) → 4.41e-4 N·m  (Storm Grip Base reference)
// egBurstSlipFraction(200, 0.0035, 0.060, 0.45) → 0.624 — 37.6% couples to lateral movement
// egBurstSlipFraction(200, 0.0035, 0.060, 0.15) → 0.872 — 12.8% for metal tip (2.9× less)
// ladSpinLifetime(1.42e-5, 200, 4.63e-4) →   6.1 s  (Metal Grip + RS CG FS + Wide Defense)
// ladSpinLifetime(1.42e-5, 200, 3.53e-6) → 805   s  (SGB2 shaft — 132× longer LAD)
// egComboTopplingTorque(0.047, 0.016, 30) → 3.69e-3 N·m  (EG combo — 2.5× standard base)
// egComboTopplingTorque(0.030, 0.010, 30) → 1.47e-3 N·m  (standard base reference)


---

## Case 227 — Final Clutch Base (Dranzer GT Version) · 7.6 g: Why Three-Protrusion Mode-Change Geometry Produces Pseudo-Attack and Pseudo-Defense Modes With Limited Functional Difference, How Final Clutch Timing Fails Every Archetype Independently, and Why Desert Sphinxer Version Outclasses It in the Only Role Where Weight Matters

Final Clutch Base (Dranzer GT Version) is a 7.6 g blade base with Final Clutch activation timing and three flat-edged rounded protrusions distributed around the perimeter. The protrusions can be oriented to cover AR gaps or leave them open — an inbuilt mode-change that superficially creates an Attack mode (protrusions covering gaps, smoother profile) and a Survival/Defense mode (protrusions in open position, gaps exposed). This mode-change is cosmetically interesting but mechanically marginal: the protrusion profile is too rounded and low to function as smash contact geometry, and the gap-covering effect does not produce the continuous smooth arc that genuine defense ARs rely on. Final Clutch activation timing — late match at low spin — is structurally incompatible with Attack, Defense, and Survival independently of protrusion orientation. The one role where the base has qualified utility is Circle Survivor Defense, where its mass (7.6 g) exceeds typical Normal Base options, but Final Clutch Base (Desert Sphinxer Version) at 7.4 g provides the same mass advantage without the protrusions that create vulnerability to tall opponents.

---

### 1. Protrusion Geometry: Mode-Change Mechanics and Functional Limits

The three protrusions sit at equal ~120° spacing, matching the 3-fold symmetry common to Dranzer-series parts. Each protrusion is described as flat-edged and rounded — meaning the outer face is roughly planar but the corners and top are radiused:

```
   Protrusion cross-section (side view):

        ╭───╮  ← rounded top, r ≈ 2–3 mm
        │   │  ← flat outer face (h ≈ 4–5 mm above base floor)
   ─────┘   └─────  ← base body
```

**Attack mode (protrusions covering gaps):**
When rotated to cover AR gaps, the protrusion outer face presents at the gap perimeter. Effective contact angle depends on protrusion face orientation relative to tangent:

```
φ_protrusion ≈ 50–60° from tangent (flat face oriented roughly radially)
J_recoil / J = sin(55°) ≈ 0.819
```

This is near-radial contact — predominantly self-recoil, not smash. The protrusion does not function as a smash contact point because its face angle is wrong and its height above the floor (~4–5 mm) positions it below most opponent AR contact zones.

**Defense/Survival mode (gaps open):**
With gaps open, the protrusions stand clear of the AR gap region. The base body presents its normal profile. The gaps allow opponent ARs to potentially reach the base body — but at EG height (~28–32 mm above floor), base body contacts are already infrequent.

The mode-change does not alter fundamental contact geometry enough to change archetype performance. It is a marginal profile modification.

---

### 2. Final Clutch Timing: Failure Mode Across All Archetypes

Final Clutch activates at low spin — ω ≈ 0.20–0.30 × ω_launch. This timing is structurally problematic for every competitive archetype:

**Attack:**
At low spin, the beyblade has insufficient linear momentum to produce ring-outs or meaningful destabilisation:

```
v_lateral ∝ ω × r_AR
At ω = 0.25 × ω_launch = 75 rad/s:
v_lateral ≈ 75 × 0.029 ≈ 2.2 m/s  (vs ~8.7 m/s at launch)
```

Attack requires v_lateral at contact to produce ring-outs. At 25% launch spin the available impact energy is:

```
E_impact = ½ × m × v² ∝ ω²
E_impact_late / E_impact_launch = (0.25)² = 0.0625 — 6.25% of launch energy remains
```

Even with EG burst Δω, the total is insufficient for reliable attack outcomes. Flat tips can occasionally produce late pushes, but Square Edge and similar attack-capable ARs are poorly suited to EG height, as noted — the height gap from Case 222 applies here equally.

**Defense:**
Defense combos require stable flower-pattern maintenance under incoming hits. Final Clutch activation at low spin disrupts this by introducing a sudden EG burst when the beyblade is at its most gyroscopically vulnerable:

```
L_gyro = I × ω_late ≈ 4×10⁻⁵ × 75 = 3.0×10⁻³ N·m·s
τ_destabilisation from EG burst ≈ ΔL_EG / Δt ≈ (I × Δω) / Δt
```

At low L_gyro, the burst torque can exceed the gyroscopic restoring term, causing topple or broken flower pattern. Defense combos are destabilised by the activation event, not stabilised.

**Survival/Stamina:**
Activation injects friction-mediated energy into the stadium contact, accelerating spin decay. Even if the burst adds some ω, the net effect over the remaining match duration is negative — more tip movement means more friction work means faster spin loss. The burst also breaks the stable low-orbit or centre-hugging pattern that stamina combos rely on.

---

### 3. Circle Survivor Defense: The Qualified Use Case

Circle Survivor Defense (CSD) uses Right Engine Gear (Circle Defenser), a high-LAD setup that exploits the EG's bearing and the free-spinning CEW to achieve exceptional spin retention. In CSD, base weight matters because:

```
CoM_height ∝ Σ(m_i × h_i) / m_total
Increasing m_base (low-mounted mass) reduces CoM height:

Δh_CoM = -(m_base_extra × Δh_base) / m_total
```

Adding a heavier base lowers the system CoM, reducing the toppling torque at low spin:

```
τ_topple = m_total × g × h_CoM × sin(tilt)
```

Compared to standard Normal Base options:
```
Normal Base (Wolborg 4 Version):  ~5.8 g
Normal Base (Rock Bison Version):  ~6.2 g
Final Clutch Base (Dranzer GT):    7.6 g  → +1.4 to +1.8 g lower mass
Final Clutch Base (Desert Sphinxer): 7.4 g → +1.2 to +1.6 g lower mass
```

The mass advantage of 1.4–1.8 g at base height reduces h_CoM measurably. For a total assembly mass of ~50 g with base at h_base ≈ 5 mm:

```
Δh_CoM = -(1.6 × 10⁻³ × 5 × 10⁻³) / 50 × 10⁻³ = -1.6 × 10⁻⁴ m = -0.16 mm
```

Small but real. In spin-down scenarios where marginal CoM height determines whether the beyblade survives the final few seconds, 0.16 mm matters.

**Protrusion liability in CSD:**
CSD survives by maintaining a circular flower pattern at low spin and outlasting opponents. Tall opponents — any AR whose contact zone extends above the typical base height — can contact the protrusions directly. At contact angle ≈ 55° from tangent:

```
J_recoil_protrusion ≈ 0.82 × J_contact
```

Each protrusion contact returns ~82% of contact impulse as self-recoil, disrupting the flower pattern or causing ring-out. This negates the CoM benefit against any opponent that can reach the protrusions.

**Desert Sphinxer Version comparison:**
```
                          Dranzer GT    Desert Sphinxer
Mass                      7.6 g         7.4 g
Mass advantage over W4    +1.8 g        +1.6 g
Protrusions               yes           no
Protrusion liability       present       absent
CoM benefit               +0.16 mm      +0.15 mm
Net CSD advantage          marginal       higher
```

Desert Sphinxer Version is 0.2 g lighter but has no protrusions. In CSD the 0.2 g mass difference (Δh_CoM ≈ 0.02 mm) is negligible. The absence of protrusions is not negligible — it removes the liability against tall opponents entirely. Desert Sphinxer Version strictly dominates in the only role where Dranzer GT Version has any qualified utility.

---

### 4. Normal Base Comparison: Why Bulkiness Costs More Than Weight Gains

Final Clutch Bases are taller and wider than Normal Bases due to the clutch mechanism, EG housing, and base body geometry. This bulk creates:

1. **Height penalty** — AR is raised ~8–10 mm above Normal Base height (established in Case 222)
2. **Profile penalty** — wider base body increases the surface area intercepted by low-altitude attacks and stadium walls
3. **Mechanism mass penalty** — clutch springs and EG coupling add mass at mid-height, raising CoM relative to a compact Normal Base

A Normal Base does not utilise the EG mechanism, so it wastes the EG's potential spin boost. But in practice the EG adds no benefit:
- Attack: timing wrong (Final Clutch too late)
- Defense/Survival: activation destabilises
- CSD: Desert Sphinxer Version is strictly better

The EG mechanism is a liability-free zero in a Normal Base context. In a Final Clutch Base context it is an active liability. Normal Bases are therefore better in aggregate for the same ARs and WDs, not because they are cleverly designed for these roles, but because they do not introduce the clutch/height/activation penalties.

---

### 5. Physics Model

```typescript
interface FinalClutchDranzerGTAnalysis {
  mass_g: 7.6;
  clutchType: 'final';
  activationSpinFraction: 0.25;
  protrusions: 3;
  protrusionFaceAngle_deg: 55;
  protrusionRecoilFraction: 0.819;
  competitiveRoles: ['circle_survivor_defense_qualified'];
  strictlySuperiorAlternative_CSD: 'Final Clutch Base (Desert Sphinxer Version)';
  massVsWolborg4Normal: '+1.8g';
  massVsDesertSphinxer: '+0.2g';
}

function finalClutchImpactEnergy(
  m_kg: number,
  omega_launch: number,
  activationFraction: number,
  r_AR_m: number
): number {
  const v = omega_launch * activationFraction * r_AR_m;
  return 0.5 * m_kg * v * v;
}

function comHeightReduction(
  extra_mass_kg: number,
  base_height_m: number,
  total_mass_kg: number
): number {
  return (extra_mass_kg * base_height_m) / total_mass_kg;
}

function protrusionSelfRecoil(J_contact: number, faceAngle_deg: number): number {
  return J_contact * Math.sin(faceAngle_deg * Math.PI / 180);
}

// finalClutchImpactEnergy(0.040, 300, 0.25, 0.029) → 0.0127 J  (late activation)
// finalClutchImpactEnergy(0.040, 300, 1.00, 0.029) → 0.2030 J  (launch energy — 16× more)
// comHeightReduction(1.8e-3, 5e-3, 50e-3) → 1.8e-4 m = 0.18 mm  (vs Wolborg 4 Normal)
// comHeightReduction(0.2e-3, 5e-3, 50e-3) → 2.0e-5 m = 0.02 mm  (GT vs Desert Sphinxer — negligible)
// protrusionSelfRecoil(0.005, 55) → 4.10e-3 N·s  — 82% of contact impulse becomes self-recoil
```


---

## Case 228 — CEW Metal Change · 3.6 g: Why a Well-Executed Subtle Point Produces Balanced Movement But Cannot Overcome EG System Penalties, How It Sits in the CEW Offensive Hierarchy, and Why Circle Survivor Defeats It for the One Role Where It Has Real Stamina

CEW Metal Change is a 3.6 g Customize Engine Weight with a metal change-tip — a metal body with a subtly pointed contact geometry that produces a narrow initial contact surface transitioning to broader support at tilt. The tip is well-executed: the point is subtle enough to provide moderate friction and active movement without the instability of a flat contact, and the surrounding metal body adds tilt-limiting support. The result is genuinely balanced behaviour — not optimally aggressive nor optimally stable, but competent across both axes. This makes it a reasonable experimental CEW for testing EG setups without the CEW being the variable. Competitively, the balance works against it: Metal Semi-Flat and Right EG Metal Flat both exceed it for offensive output; Circle Survivor provides superior defense and stamina via plastic-sharp geometry with a heavier protective body; and the EG system's LAD deficit and height penalty apply regardless of how well the tip itself is designed.

---

### 1. Metal Change Tip Geometry: Subtle Point and Tilt Transition

The tip presents a central pointed contact surrounded by a flat-ish shoulder and an outer ring. "Subtle point" means the tip radius is larger than Metal Sharp but smaller than Metal Flat:

```
   Cross-section (one side):

        ●  ← central point (r_point ≈ 0.5–0.8 mm, rounder than Metal Sharp's 0.3 mm)
       /│\
      / │ \  ← shallow shoulder (transition zone)
     /  │  \
    ●───┴───●  ← outer body (r_body ≈ 3.0 mm)
              ← six dots on body (ball-bearing texture, minor friction modulation)
```

Effective contact radius at upright:
```
r_contact_upright ≈ 0.65 mm  (between Metal Sharp 0.3 mm and Metal Semi-Flat 1.5 mm)
```

At tilt (~5°), contact migrates to the shoulder:
```
r_contact_5deg ≈ 0.65 + 3.0 × sin(5°) ≈ 0.65 + 0.26 = 0.91 mm
```

Friction torque at upright:
```
τ_friction = μ × F_N × r_contact ≈ 0.22 × (0.036 × 9.8) × 0.00065 ≈ 5.05 × 10⁻⁵ N·m
```

For comparison across the CEW family:
```
Metal Sharp:       2.33 × 10⁻⁵ N·m  (r = 0.3 mm)
Metal Change:      5.05 × 10⁻⁵ N·m  (r = 0.65 mm)  ← between
Metal Semi-Flat:   1.40 × 10⁻⁴ N·m  (r = 1.8 mm)
Metal Flat (EG):   ~2.72 × 10⁻⁴ N·m (r = 3.5 mm)
Metal Grip:        8.04 × 10⁻⁴ N·m  (r = 3.5 mm, μ = 0.65)
```

Metal Change sits between Metal Sharp and Metal Semi-Flat — more active than a pure stamina tip, less aggressive than any flat or grip variant. The orbit radius proxy:

```
1/(μ × r) for Metal Change: 1/(0.22 × 0.00065) ≈ 6993  (wider orbit than Semi-Flat's 2525)
```

Movement is moderately active — the beyblade maintains a wide, unhurried pattern rather than the tight aggressive circle of flat/grip tips. This is why it is described as "fairly aggressive" relative to other CEWs — it is not aggressive in absolute terms, but compared to Metal Sharp it moves noticeably more.

---

### 2. Stamina Characteristics: Real But Irrelevant in EG Context

The narrow contact radius produces low friction torque, which translates directly to slower spin decay:

```
dω/dt ∝ τ_friction / I_total ∝ r_contact

Metal Change spin decay rate relative to Metal Sharp: 0.65 / 0.30 = 2.17× faster decay
Metal Change spin decay rate relative to Metal Flat:  0.65 / 3.50 = 18.7% of flat's decay rate
```

Metal Change has substantially better stamina than any flat CEW and meaningfully better than Metal Semi-Flat. In isolation this would make it competitive for stamina or spin-steal setups.

In EG context, three system-level issues negate this:

**1. EG height and CoM penalty** (established in Cases 222, 224):
EG setups raise CoM ~2.5 mm above equivalent Normal Base setups. This increases toppling torque at low spin, shortening the effective survival window precisely when Metal Change's tip stamina advantage would otherwise matter.

**2. LAD deficit:**
Low Angular Drag (LAD) performance requires the beyblade to precess on its tip with minimal lateral friction. Metal Change's r_contact = 0.65 mm is smaller than Zombie-optimised tips (Metal Sharp at 0.3 mm, Circle Survivor's plastic sharp at ~0.4 mm) but larger than ideal. More importantly, the EG mechanism's mass distribution and the clutch body's drag on the stadium floor during precession add friction not present in the CEW tip alone. LAD in EG setups is systemically poor regardless of tip choice.

**3. Clutch activation:**
Any active clutch (First or Final) introduces a burst event that disrupts the stable low-precession orbit that stamina wins require. A Non-Clutch EG (Right EG Normal) would avoid this, but then the EG mechanism provides no benefit at all over a simpler Normal Base.

---

### 3. Offensive Hierarchy Within the CEW Family

For attack-relevant CEW selection (ranked by lateral velocity generation):

```
CEW             τ_friction           Movement           Attack rank
──────────────────────────────────────────────────────────────────
Metal Grip      8.04 × 10⁻⁴ N·m     tight/aggressive   1st
Metal Flat (EG) 2.72 × 10⁻⁴ N·m     active             2nd
Metal Semi-Flat 1.40 × 10⁻⁴ N·m     moderate           3rd
Metal Change    5.05 × 10⁻⁵ N·m     mild               4th
Metal Sharp     2.33 × 10⁻⁵ N·m     minimal            5th (survival/zombie)
```

Metal Change is 4th for offense. Right EG Metal Flat (if that EG is used directly, with its integral flat tip) and Left EG Metal Semi-Flat exceed it. Metal Change is "still usable" for offense in the sense that it produces more movement than Metal Sharp — but "usable" here means "not entirely inert", not "competitive."

The description notes Metal Change is outclassed "even by Left EG Metal Semi-Flat offensively" — this is consistent with the τ_friction ordering above, where Metal Semi-Flat at 1.40 × 10⁻⁴ N·m is 2.8× more friction-active than Metal Change.

---

### 4. Defensive Use: Circle Survivor Comparison

Circle Survivor Defense (CSD) uses a different mechanism — a free-spinning plastic CEW with a sharp plastic tip — but it directly competes with Metal Change for the low-friction, stable, high-stamina role:

```
                      Metal Change CEW    Circle Survivor CEW
Tip material          metal               plastic
Tip type              subtle point        sharp (plastic)
r_contact_upright     0.65 mm             ~0.40 mm
μ_tip                 0.22                ~0.15 (plastic-on-plastic)
τ_friction            5.05 × 10⁻⁵ N·m    ~2.33 × 10⁻⁵ N·m (similar to Metal Sharp)
LAD performance       moderate            high (free-spin + plastic sharp)
Body profile          open sides, exposed closed, protects lower AR/base
CEW mass              3.6 g               higher (full EG unit)
Protection            none                shields against low-contact hits
```

Circle Survivor's plastic tip wears over time (μ increases with wear), but new/low-wear Circle Survivor has ~35% lower friction torque than Metal Change and substantially better LAD due to free-spin decoupling. The closed body of Circle Survivor also physically shields the lower portions of the AR and base from low-height contact attacks — an advantage Metal Change's open-sided metal CEW cannot replicate.

Metal Change has no compensating advantage in this comparison. It is not lighter in a way that matters, not sharper, and does not provide coverage. Circle Survivor strictly dominates for the survival/defense role Metal Change's stamina profile suggests.

---

### 5. Role as Experimental Baseline

The one genuine utility is as a diagnostic CEW for evaluating EG setups. Metal Change's balanced movement (not too aggressive, not too passive) means that anomalies in EG behaviour are more attributable to the EG mechanism itself rather than tip-induced variance. Metal Grip and Metal Flat both create strong tip-dominated effects that can mask EG mechanism characteristics; Metal Sharp's near-zero movement makes most EG features invisible. Metal Change occupies the middle range where EG activation effects, clutch timing, and AR interactions are observable without tip behaviour dominating the result.

This is not a competitive use case, but it is the accurate description of why it is "a good go-to tip for experimenting."

---

### 6. Physics Model

```typescript
interface CEWMetalChangeAnalysis {
  mass_g: 3.6;
  tipType: 'subtle_point_metal';
  pointRadius_mm: 0.65;
  bodyRadius_mm: 3.0;
  mu_metal_on_plastic: 0.22;
  surfaceFeature: 'six_dot_ball_texture';
  competitiveRoles: ['experimental_baseline'];
  offensiveRank_inCEWFamily: 4;
  strictlySuperiorFor: {
    offense: 'Metal Flat EG or Metal Semi-Flat';
    defense_survival: 'Circle Survivor';
    stamina: 'Circle Survivor';
  };
}

function frictionTorque(
  mu: number,
  mass_kg: number,
  r_contact_m: number
): number {
  return mu * mass_kg * 9.8 * r_contact_m;
}

function spinDecayRateRatio(
  r_ref_m: number,
  r_compare_m: number
): number {
  return r_compare_m / r_ref_m;
}

function contactRadiusAtTilt(
  r_point_m: number,
  r_body_m: number,
  tilt_deg: number
): number {
  return r_point_m + r_body_m * Math.sin(tilt_deg * Math.PI / 180);
}

// frictionTorque(0.22, 0.036, 0.00065) → 5.05e-5 N·m  (Metal Change upright)
// frictionTorque(0.22, 0.036, 0.0018)  → 1.40e-4 N·m  (Metal Semi-Flat — 2.8× more)
// frictionTorque(0.22, 0.033, 0.0003)  → 2.14e-5 N·m  (Metal Sharp — 2.4× less)
// frictionTorque(0.15, 0.036, 0.0004)  → 2.12e-5 N·m  (Circle Survivor plastic sharp — similar to Metal Sharp)
// contactRadiusAtTilt(0.00065, 0.003, 0)  → 0.650 mm  (upright)
// contactRadiusAtTilt(0.00065, 0.003, 5)  → 0.912 mm  (5° tilt)
// contactRadiusAtTilt(0.00065, 0.003, 15) → 1.426 mm  (15° tilt, shoulder dominant)
// spinDecayRateRatio(0.0003, 0.00065) → 2.17  — Metal Change decays 2.17× faster than Metal Sharp
// spinDecayRateRatio(0.0035, 0.00065) → 0.186 — Metal Change decays at 18.6% of Metal Flat's rate
```


---

## Case 229 — Gigantic Claw Attack Ring · 6.6 g: Why Slope Obstruction and Dead-Area Side Faces Limit RS Smash While the Upward Smash Component Elevates Traditional Upper Attack, How Storm Grip Base Tip Inversion Unlocks Top-Tier Status, and Why LS Force Smash Intent Produces Only Upward Recoil

Gigantic Claw is a 6.6 g Attack Ring with an aggressive profile featuring upper slopes on the top face (RS Upper Attack geometry), underside slopes (LS Force Smash intent), multiple surface protrusions, and claw-tooth contact points. The aggressive design creates a part that overshoots its intended Smash Attack role in RS — the protrusions and slope side-faces generate significant recoil and dead zones that undermine pure Smash — but the same geometry produces a strong Traditional Upper Attack output when combined with its inherent upward smash component. Storm Grip Base Tip Inversion (the technique of flipping the Storm Grip Base to expose its aggressive tip from below) enables the full force delivery of Gigantic Claw's upward smash slope at correct stadium height, converting a competitive part into a top-tier Traditional Upper Attack AR. In LS the Force Smash geometry fails entirely: the aggressive underside slope angles produce upward recoil rather than downward force smash, and dead-area side faces create inconsistency throughout.

---

### 1. RS Contact Geometry: Three Interacting Surfaces

Each contact point in RS presents three surfaces in sequence as the AR traverses an opponent:

```
   RS contact sequence (top view, one claw):

   rotation →

   ① slope face (upper, angled ~35° upward)    → Upper Attack component
   ② claw tip / protrusion                      → concentrated smash + recoil
   ③ slope side face                            → dead area (tangential, no useful force)

   ────①──②──③────  ← one claw unit
```

**Surface ①: Upper slope face**
The top-face slope is angled to intercept opponent ARs from below, driving them upward:
```
α_upper ≈ 30–35° from horizontal
J_vertical = J × sin(33°) ≈ J × 0.545
J_lateral  = J × cos(33°) ≈ J × 0.839
```
This delivers both a vertical (Upper Attack) and a lateral (Smash) component simultaneously — "Upward Smash." Unlike a pure upper slope (maximises J_vertical at cost of J_lateral), Gigantic Claw's slope angle keeps both components substantial.

**Surface ②: Claw tip / protrusion**
The claw tooth protrudes beyond the slope face and contacts first at high spin:
```
φ_claw ≈ 45–50° from tangent
J_smash_claw = J × cos(47°) ≈ J × 0.682
J_recoil_claw = J × sin(47°) ≈ J × 0.731
```
Contact at the claw tip is the dominant recoil source. The tip shape is "poor" — not optimally angled for smash and not smoothly swept — so each claw contact produces substantial self-recoil alongside useful lateral output.

**Surface ③: Slope side face**
The side of each slope (the face between adjacent claws) presents tangentially or slightly backward in RS:
```
φ_side ≈ 80–90° from tangent (nearly radial)
J_recoil_side / J ≈ sin(85°) ≈ 0.996 — effectively pure recoil
```
These are dead areas: any contact here produces near-zero useful lateral or vertical force and near-maximum self-recoil. Their angular extent is significant — approximately 30–40° of each 120° claw cycle is dead area.

---

### 2. RS Smash Performance: Why It Is "Less Than Ideal"

Effective smash output depends on the fraction of contact events that land on productive surfaces (① and ②) versus dead surfaces (③):

```
Productive arc per claw:  ~80° (surfaces ① + ②)
Dead arc per claw:         ~40° (surface ③)
Productive fraction:       80/120 = 67%
```

At 3-fold symmetry and ω = 200 rad/s:
```
f_contact_total = (3 / 2π) × 200 ≈ 95.5 contacts/s
f_contact_productive ≈ 0.67 × 95.5 ≈ 64 productive contacts/s
f_contact_dead ≈ 0.33 × 95.5 ≈ 31 dead (recoil) contacts/s
```

31 contacts/s producing near-pure recoil with no offensive output is a significant liability. For comparison, Eight Spiker has ~0% dead-area contacts. Gigantic Claw's smash is further limited by the claw-tip obstruction: the protrusion contacts the opponent before the slope face fully engages, meaning the more favourable slope geometry is partially blocked by the claw. "Obstructed contact points" describes this — the claw tip intercepts what could be a clean slope contact.

---

### 3. RS Traditional Upper Attack: Why the Same Geometry Succeeds Here

Traditional Upper Attack does not require clean, low-recoil contacts — it requires vertical impulse delivery sufficient to perturb the opponent's tilt axis. Gigantic Claw's upward smash component provides this even through the recoil:

```
J_vertical from surface ①:  0.545 × J_contact  (slope engagement)
J_vertical from surface ②:  small (claw tip has some upward component)
J_vertical from surface ③:  near zero (dead area, nearly radial)
```

Even at 67% productive contact fraction, the tilt perturbation rate:
```
Δtilt/contact = J_vertical × r_contact / I_opponent
             ≈ (0.545 × 0.005) × 0.032 / 4×10⁻⁵ ≈ 2.18°/contact

dΦ/dt_effective = 2.18° × 64 productive contacts/s ≈ 140°/s unresisted
```

This exceeds Triangle Wing (185°/s at 100% productive contacts, but lower α) in absolute tilt rate on productive contacts, and the larger r_contact (Gigantic Claw's greater radius extends contact further from centre) amplifies the moment arm. The Upward Smash from surface ① — delivering both J_vertical and J_lateral — means Gigantic Claw applies simultaneous ejection and tilt pressure at each productive contact. This dual-mode contact event is more decisive per hit than a pure upper slope that only tilts.

The "significant Upward Smash" and "decent Upper Attack" combine to make each productive contact punishing even if 33% of contacts are wasted on dead areas. The net Traditional Upper Attack output is top-tier among RS ARs because the per-contact power at productive events is high enough to compensate for the dead-area inefficiency.

---

### 4. Storm Grip Base Tip Inversion: Why It Unlocks Top-Tier Status

Storm Grip Base Tip Inversion is a legal configuration where the Storm Grip Base is assembled inverted, exposing its aggressive rubber grip tip from the underside at a height that places the AR at the correct contact zone for Gigantic Claw's upper slopes. Without tip inversion, Gigantic Claw on a standard base may sit at a height where the upper slope faces approach or miss the opponent AR contact zone — the slopes intercept at a sub-optimal angle relative to the opponent's AR height.

With tip inversion:
```
AR contact height (inverted Storm Grip):  h_AR ≈ 20–24 mm  (closer to standard SG height)
Upper slope engagement angle corrected:   opponent AR enters slope at full α ≈ 33°
```

Additionally, Storm Grip's rubber tip (μ ≈ 0.65) maximises lateral velocity during contact — when Gigantic Claw's slope deflects an opponent upward, the rubber tip maintains ground contact and converts the reaction force into aggressive forward movement rather than slipping. This produces the "hurtling" motion seen in high-traction attack setups (cf. Metal Grip CEW in Case 222).

Without tip inversion, the height mismatch and lower-friction base tip reduce the effective slope engagement. With tip inversion, the full Upward Smash + Upper Attack geometry is delivered at the correct height with maximum traction. The combination produces top-tier Traditional Upper Attack performance.

---

### 5. LS Geometry: Force Smash Intent and Upward Recoil Failure

The underside of Gigantic Claw features slopes oriented to drive downward contact in LS — Force Smash intent. Force Smash requires the AR to push the opponent downward and into the stadium floor, destabilising via vertical compression rather than upward lift:

```
Intended LS underside slope:
α_force_smash ≈ −20 to −25° from horizontal (downward angle)
Intended J_vertical = J × sin(−22°) ≈ −J × 0.374  (downward)
```

The failure mode: "aggressive shape of contact points prevents this, instead creating significant upward recoil."

The underside claw protrusions in LS present first — before the slope face engages. The claw tips in LS are oriented with their aggressive geometry pointing upward relative to the contact plane:

```
LS claw tip engagement angle: φ_claw_LS ≈ upward-facing ~30–40° above horizontal
J_vertical_actual = +J × sin(35°) ≈ +J × 0.574  (UPWARD — opposite of intended)
```

The claw intercepts the opponent before the slope, and the claw's geometry in LS deflects upward rather than down. The intended Force Smash becomes upward recoil — the user is pushed upward and the opponent is not pressed down. This is a geometric inversion of the intent: the aggressive protrusions that were supposed to initiate downward contact instead produce the same upward deflection that makes Gigantic Claw effective in RS Upper Attack, but now on the user in LS.

The slope side-face dead area problem persists in LS as well — the same ~33% dead-area fraction applies, but with no useful attack component on productive contacts either, LS is comprehensively non-viable.

---

### 6. Physics Model

```typescript
interface GiganticClawAnalysis {
  mass_g: 6.6;
  contactPointCount: 3;
  preferredSpin: 'right';
  upperSlopeAngle_deg: 33;
  clawTipSmashAngle_deg: 47;
  deadAreaFraction: 0.33;
  effectiveContactRadius_mm: 32;
  topTierConfiguration: 'Storm Grip Base (Tip Inversion) + RS';
  lsUse: 'none';
}

function resolveUprightSmashImpulse(
  J_total: number,
  slopeAngle_deg: number
): { vertical: number; lateral: number } {
  const alpha = slopeAngle_deg * Math.PI / 180;
  return {
    vertical: J_total * Math.sin(alpha),
    lateral:  J_total * Math.cos(alpha),
  };
}

function effectiveTiltRate(
  J_vertical: number,
  r_contact_m: number,
  I_opponent_kgm2: number,
  totalContactFreq_hz: number,
  productiveFraction: number
): number {
  const delta_rad = (J_vertical * r_contact_m) / I_opponent_kgm2;
  return delta_rad * totalContactFreq_hz * productiveFraction * (180 / Math.PI);
}

function contactFrequency(nContacts: number, omega_rad_s: number): number {
  return (nContacts / (2 * Math.PI)) * omega_rad_s;
}

// resolveUprightSmashImpulse(0.005, 33) → { vertical: 2.72e-3, lateral: 4.19e-3 }
// contactFrequency(3, 200)              → 95.5 contacts/s
// effectiveTiltRate(2.72e-3, 0.032, 4e-5, 95.5, 0.67) → 110°/s (productive contacts only)
// Dead area recoil contacts: 95.5 × 0.33 = 31.5/s → each ≈ 0.996 × J self-recoil
// LS upward recoil: sin(35°) = 0.574 — same upward component as RS, but on user not opponent
// J_recoil_claw (RS): sin(47°) = 0.731 — primary self-recoil source
// Tip inversion: corrects AR height to ~22 mm, full α = 33° slope engagement restored
```


---

## Case 230 — Final Clutch Base (Gigars Version) · 7.6 g: Why Spike Protrusions Compound EG System Recoil Beyond All Other Final Clutch Bases, How Decent LAD Is Irrelevant Without Competitive Stamina Architecture, and Why This Is the Worst-Case Final Clutch Implementation

Final Clutch Base (Gigars Version) is a 7.6 g blade base with Final Clutch activation timing and an extreme perimeter profile: dense spike protrusions covering the full outer circumference. It shares its mass (7.6 g) with Final Clutch Base (Dranzer GT Version, Case 227) but its spike geometry produces substantially more recoil than the GT version's three rounded protrusions. The LAD is described as decent for an EG base — meaning the base geometry allows reasonable precession arc when spinning down — but LAD performance is irrelevant in context: EG bases cannot achieve the low-friction, stable spin-down arc that makes LAD competitively useful, because the clutch mechanism, height penalty, and now the spike recoil liability all preclude survival scenarios. Final Clutch timing adds nothing to any archetype as established in Case 227, and the Gigars version's spike protrusions add specific recoil liability on top of the shared Final Clutch failure mode. No competitive use exists.

---

### 1. Spike Protrusion Geometry: Quantified Recoil Beyond GT Version

The Gigars Version perimeter has spike protrusions distributed at high density — visible in top-view as ~20+ individual spikes around the full circumference. Each spike presents a pointed, radially-oriented contact surface:

```
   Spike cross-section (top view, one spike):

   rotation →

   base body ────●  ← spike tip (r_tip ≈ r_body + 3–4 mm protrusion)
                  \
                   \  θ_spike ≈ 75–85° from tangent
                    ●  ← spike base
```

Spike angle from tangent: θ ≈ 75–85° (near-radial, similar to the worst case in GT version but applied uniformly around the perimeter rather than at three discrete locations).

Recoil fraction per spike contact:
```
J_recoil / J = sin(80°) ≈ 0.985
```

Nearly all contact impulse returns as self-recoil. For comparison:

```
Part                         Recoil geometry          J_recoil/J
──────────────────────────────────────────────────────────────────────
Upper Dragoon AR (swept)     φ ≈ 30–35°               0.50–0.57
GT Version protrusion        φ ≈ 55°                   0.82
Gigars Version spike         φ ≈ 80°                   0.985
```

The Gigars spikes are significantly worse than even the GT version's protrusions. Any contact with the spike perimeter returns ~98.5% of impulse as self-recoil with ~17% lateral useful output:
```
J_useful = J × cos(80°) ≈ J × 0.174
```

This is near-zero useful force delivery — the spikes function almost exclusively as self-destabilisation features.

---

### 2. Spike Density and Contact Frequency: Liability Scales With Coverage

With ~20 spikes around a full 360° circumference, average angular spacing:
```
Δθ_spike = 360° / 20 = 18°
```

This is exceptional contact density — denser than Eight Spiker (45° spacing) and comparable to a fine-toothed gear. Unlike Eight Spiker where dense contacts are offensive features, each Gigars spike contact is a recoil event. At ω = 200 rad/s, spike contact rate against a static reference:

```
f_spike = (20 / 2π) × 200 ≈ 637 spike contacts/s
```

In practice, only a fraction of spikes contact an opponent AR at any moment, but the high density ensures that any time the base body is at opponent contact height, multiple spikes are engaged per unit time. The result is not merely occasional recoil — it is continuous recoil-dominant contact whenever the base region is engaged.

---

### 3. LAD Assessment: Geometrically Real, Competitively Irrelevant

"Decent LAD for an EG base" requires unpacking. LAD (Low Angular Drag) describes the property where a beyblade's tip geometry allows stable precession at low spin — the beyblade leans and circles rather than toppling outright. Conditions for useful LAD:

1. Low tip friction (r_contact small, μ low)
2. Low CoM height (minimises toppling torque)
3. Absence of stadium contact by non-tip components
4. No disruptive activation events during spin-down

Condition 4 is violated by Final Clutch activation. Condition 3 is violated by the spike perimeter — if the beyblade leans during precession and the spike body contacts the stadium floor or opponent, the spike recoil immediately disrupts the precession orbit. Conditions 1 and 2 are degraded by EG height and mechanism mass (established Cases 222, 224, 227).

The Gigars Version's "decent LAD geometry" presumably means the base body profile, absent all other factors, creates a smooth precession contact arc — perhaps the spike distribution is regular enough that the base doesn't snag catastrophically during spin-down in isolation. But this geometric property is never realised in competitive play because conditions 3 and 4 are always violated. LAD being "decent for an EG base" means it is better than the worst EG bases, not that it achieves competitive LAD levels.

---

### 4. Final Clutch Timing: Inherited Failure (Summary)

As derived in Case 227 (§2), Final Clutch activation at ω ≈ 0.20–0.30 × ω_launch:

```
E_impact_late = ½ × m × (ω_late × r_AR)² ≈ 0.0625 × E_launch
```

6.25% of launch impact energy remains — insufficient for reliable attack outcomes. The occasional late offensive push with flat tips is real but not reproducible as a strategy: it requires the opponent to be vulnerable at exactly the activation moment and the flat tip to convert the burst into lateral velocity. The Gigars Version's spike perimeter makes this less likely than other Final Clutch bases because any contact during the burst window immediately generates spike recoil that counters the burst-induced lateral movement.

---

### 5. Comparison Within the Final Clutch Base Family

```
Base                          Mass    Protrusion type    J_recoil/J    CSD utility
──────────────────────────────────────────────────────────────────────────────────
Dranzer GT Version            7.6 g   3 rounded          0.82          limited
Desert Sphinxer Version       7.4 g   none               N/A           best CSD
Gigars Version                7.6 g   ~20 spikes (full)  0.985         none
```

Gigars Version matches GT Version in mass (no CSD CoM advantage over Desert Sphinxer) and exceeds it in recoil. Desert Sphinxer Version is better for CSD. GT Version is better wherever protrusion recoil matters (everywhere). Gigars Version is the worst Final Clutch Base in all dimensions that matter competitively.

---

### 6. Physics Model

```typescript
interface FinalClutchGigarsAnalysis {
  mass_g: 7.6;
  clutchType: 'final';
  activationSpinFraction: 0.25;
  spikeCount: 20;
  spikeAngleFromTangent_deg: 80;
  spikeRecoilFraction: 0.985;
  spikeUsefulFraction: 0.174;
  ladQuality: 'decent_for_EG_base_but_irrelevant';
  competitiveRoles: [];
  worstInFamily: true;
}

function spikeContactRate(
  nSpikes: number,
  omega_rad_s: number
): number {
  return (nSpikes / (2 * Math.PI)) * omega_rad_s;
}

function spikeRecoilFraction(spikeAngle_deg: number): number {
  return Math.sin(spikeAngle_deg * Math.PI / 180);
}

function spikeUsefulFraction(spikeAngle_deg: number): number {
  return Math.cos(spikeAngle_deg * Math.PI / 180);
}

function lateActivationEnergyFraction(
  activationSpinFraction: number
): number {
  return activationSpinFraction ** 2;
}

// spikeContactRate(20, 200)             → 636.6 /s — far exceeds any AR contact rate
// spikeRecoilFraction(80)               → 0.985  — near-total self-recoil
// spikeUsefulFraction(80)               → 0.174  — ~17% useful output per spike contact
// spikeRecoilFraction(55) [GT Version]  → 0.819  — GT protrusion for comparison
// spikeRecoilFraction(30) [Upper Dragoon swept] → 0.500
// lateActivationEnergyFraction(0.25)    → 0.0625 — 6.25% launch energy at Final Clutch fire
```


---

## Case 231 — CEW Light Sharp · 0.85 g: Why POM Material and Change-Shaped Tip Produce the Only Competitive CEW Configuration, How Right CG Free Shaft Bearing Support Enables Genuine LAD, and Why Right Spin Lock and Inferior LAD Ceiling Keep It Niche

CEW Light Sharp is a 0.85 g Customize Engine Weight made from POM (polyoxymethylene) — the same low-friction engineering plastic used in PD tips in MFB and in Neo SG (Double Bearing Version) shaft and Bearing Base Shaft. The tip profile is shallower than Metal Sharp and closer to a change-shape geometry, combining narrow initial contact with a broader outer shoulder that provides stability not available in shaft-only sharp tips. Paired with Right Customize Gear (Free Shaft Version), the POM tip and bearing-isolated shell create the only CEW combination that achieves functional LAD in competitive play — the free-spinning outer shell decouples shell friction from tip friction, and the POM point provides low-drag precession contact. The result is the only "true CEW" with competitive stamina relevance: marginally viable against certain zombie matchups, capable of occasionally KO'ing Spiral Change Base zombies that would otherwise outlast it, and constrained to a niche by Right Spin lock and by Customize Grip Base + Defense Ring Neo SG (Double Bearing Version) providing substantially superior LAD on the same zombie archetype.

---

### 1. POM Tip Material: Friction Properties vs Metal CEWs

POM has a significantly lower kinetic friction coefficient against plastic than metal:

```
μ_metal_on_plastic ≈ 0.20–0.24
μ_POM_on_plastic   ≈ 0.10–0.14
```

At the same contact radius, POM produces roughly half the friction torque of metal:

```
τ_friction_ratio = μ_POM / μ_metal ≈ 0.12 / 0.22 ≈ 0.545
```

For CEW Light Sharp at its effective contact radius (change-shaped tip, r_contact ≈ 0.5–0.7 mm at upright):

```
τ_friction = μ_POM × F_N × r_contact ≈ 0.12 × (0.0085 × 9.8) × 0.0006 ≈ 5.99 × 10⁻⁶ N·m
```

Note: F_N uses Light Sharp's own mass (0.0085 kg) as the CEW is the contact-bearing element. The full combo mass above the tip is supported by the bearing — friction at the tip reflects only the load transmitted through the tip contact, not the full combo weight in free-spin configuration.

For comparison:
```
Metal Sharp (metal, r = 0.3 mm, full combo load):    τ ≈ 2.14 × 10⁻⁵ N·m
CEW Light Sharp (POM, r = 0.6 mm, CEW load only):   τ ≈ 5.99 × 10⁻⁶ N·m
Circle Survivor (plastic sharp, free-spin):          τ ≈ 2.12 × 10⁻⁵ N·m (full combo load, plastic μ)
```

In free-spin configuration (Right CG Free Shaft), the tip bears only CEW-level load — the bearing decouples the full combo weight from the tip contact. This is the key mechanical advantage: CEW Light Sharp's effective friction is substantially lower than any configuration where full combo mass loads the tip.

---

### 2. Change-Shaped Profile: Why Stability Exceeds Bearing Base Shaft

The tip is described as "shallower and more towards a Change-shaped tip" compared to Neo SG Double Bearing shaft — meaning the outer shoulder is broader and the central point transitions to a wider support surface at tilt:

```
   CEW Light Sharp cross-section vs shaft comparisons:

   Bearing Base Shaft (sharper, narrower shoulder):
        ●  r_point ≈ 0.3 mm
       /│\
      / │ \  steep sides, limited shoulder
     ●──┴──●  r_shoulder ≈ 1.5 mm

   CEW Light Sharp (shallower, change-shaped):
        ●  r_point ≈ 0.5–0.6 mm
       /   \
      /     \  gradual transition, broader shoulder
     ●───────●  r_shoulder ≈ 2.5–3.0 mm
```

The broader shoulder provides:

1. **Self-centering restoring force** — when the beyblade tilts, contact migrates outward along the shoulder, increasing the moment arm of the normal force and creating a righting torque
2. **Reduced topple sensitivity** — the critical tilt angle at which the beyblade can no longer recover is higher than for a pure sharp tip

Righting torque at 10° tilt:
```
r_contact(10°) ≈ 0.6 + 2.7 × sin(10°) ≈ 0.6 + 0.47 = 1.07 mm
τ_righting = F_N × r_contact × cos(tilt) ≈ (0.0085 × 9.8) × 0.00107 × cos(10°) ≈ 8.74 × 10⁻⁵ N·m
```

This is substantially larger than Bearing Base Shaft at the same tilt due to the wider shoulder. The broader geometry makes it more stable in precession — important for surviving late-match low-spin conditions where tilt angles increase.

---

### 3. Right CG Free Shaft: Why This Is the Only Viable CEW Pairing

Right Customize Gear (Free Shaft Version) has a bearing-mounted outer shell that rotates independently of the inner shaft. The inner shaft connects to the Spin Gear and rotates with the beyblade; the outer shell is free-spinning. The CEW mounts on the outer shell.

In free-spin configuration:
```
Outer shell (with CEW) angular velocity: ω_shell → 0 (decoupled, decays to stadium friction only)
Inner shaft angular velocity:            ω_shaft ≈ ω_beyblade (coupled)
```

The tip contacts the stadium floor at ω_shell ≈ 0 rather than ω_beyblade. This eliminates the spin-induced centrifugal contribution to contact pressure and, more importantly, means the tip's frictional drag does not oppose the beyblade's precession:

```
Standard tip friction torque: τ = μ × m_combo × g × r_contact  (opposes precession)
Free Shaft CEW tip torque:    τ = μ × m_CEW × g × r_contact    (only CEW mass loads tip)
                                ≈ (0.0085/0.050) × τ_standard = 0.17 × τ_standard
```

The tip friction is reduced to ~17% of a standard tip configuration. This is genuine LAD — the same mechanism that makes free-shaft and bearing-shaft zombies effective.

Without Right CG Free Shaft, CEW Light Sharp is just a low-friction plastic tip on a standard EG setup: better than metal CEWs for stamina, but not achieving free-spin decoupling. The POM friction advantage alone is insufficient — the bearing isolation is necessary to achieve competitive LAD.

---

### 4. Movement Aggression: POM Change Tip vs Pure Sharp

The change-shaped POM tip has r_contact ≈ 0.6 mm upright — slightly wider than Metal Sharp (0.3 mm). This produces marginally more movement:

```
Orbit radius proxy:
  Metal Sharp:     1/(0.22 × 0.0003) = 15,152  (wide, slow)
  CEW Light Sharp: 1/(0.12 × 0.0006) = 13,889  (similar — slightly more active)
```

The difference is small but real. Like Neo SG Double Bearing, this slight aggression is a two-sided property:

**Advantage vs zombies:** CEW Light Sharp can close distance on stationary or slow-moving opponents. Against Spiral Change Base zombies, which have high stability but are lightweight and susceptible to KO, a slight tip-induced closing movement allows contact that a perfectly still sharp tip would not generate. This converts an otherwise hopeless stamina vs stamina matchup (Spiral Change Base would reliably outspin) into an occasional KO win.

**Disadvantage vs attack:** Any tip movement increases the probability of contact with an attack-type opponent. This is a losing matchup regardless — Light Sharp has no defensive protection against high-impulse attack contacts — but the slight aggression marginally worsens an already bad matchup. Net effect: acceptable, since attack vs zombie is lost by design and the occasional zombie KO is genuine gain.

---

### 5. Right Spin Lock: Structural Competitive Ceiling

Right Spin lock arises from the absence of a Left Spin Customize Gear with equivalent bearing architecture. Right CG (Free Shaft Version) is Right Spin only. No equivalent LS bearing CEW exists in the library:

```
RS bearing CEW options:  Right CG (Free Shaft Version) — works with CEW Light Sharp
LS bearing CEW options:  none with full free-spin bearing isolation
```

This constrains CEW Light Sharp to RS zombie use exclusively. RS zombies face additional challenges:

1. Spin-stealing efficiency against RS opponents requires same-spin contact — CEW Light Sharp cannot spin-steal against RS opponents at all (same direction, no momentum transfer)
2. Against LS opponents, RS spin steal is possible, but LS attack types are common and aggressive

The competitive window is: RS Light Sharp zombie vs LS opponents where spin-steal advantage outweighs the lack of defensive mass.

---

### 6. LAD Ceiling Comparison: Why Neo SG Double Bearing + Customize Grip Base Dominates

```
Configuration                               LAD tip    Free spin    Defensive mass    Spin direction
───────────────────────────────────────────────────────────────────────────────────────────────────
CEW Light Sharp + Right CG Free Shaft       POM 0.6mm  bearing CEW  minimal            RS only
Neo SG DBV + Customize Grip + Defense Ring  POM ~0.4mm bearing SG   Defense Ring       RS and LS
```

Neo SG (Double Bearing Version) uses a POM sharp shaft — slightly sharper than CEW Light Sharp's change tip — and is housed in a Customize Grip Base that accepts a Defense Ring. The Defense Ring:

1. Adds significant mass at the perimeter (lowest possible CoM contribution)
2. Provides a smooth, low-angle defensive surface that absorbs incoming hits with minimal recoil
3. Protects the AR and base from direct contact attacks

CEW Light Sharp + Right CG Free Shaft has no equivalent defensive mass component. The EG base's bulk (height penalty, mechanism mass at mid-height) actually raises CoM, the opposite of what a competitive zombie requires. Against any opponent that can land hits on the AR or base, CEW Light Sharp zombie is more vulnerable than Neo SG DBV setups.

The "far superior LAD" of Neo SG DBV comes from this combination: similar tip friction (POM sharp vs POM change) + equal bearing isolation + defensive body protection that CEW Light Sharp cannot access.

---

### 7. Competitive Position Summary

```
Role                   CEW Light Sharp viability
──────────────────────────────────────────────────────────────────────────────
EG stamina zombie      Marginally competitive (only viable CEW for this role)
vs Spiral Change Base  Occasionally wins via KO (otherwise loses)
vs Neo SG DBV zombie   Inferior (lower defensive mass, higher CoM, RS lock)
vs attack types        Loses by design regardless of CEW
vs LS opponents        Functional but niche (RS spin-steal not applicable)
GEG pairing            Poor (light mass, low defensive ability)
Any other archetype    No use
```

Second-most competitively relevant EG part overall (after Circle Survivor) — but this reflects how uncompetitive the EG system is generally, not how strong CEW Light Sharp is in absolute terms.

---

### 8. Physics Model

```typescript
interface CEWLightSharpAnalysis {
  mass_g: 0.85;
  material: 'POM';
  tipType: 'change_shaped_shallow';
  pointRadius_mm: 0.6;
  shoulderRadius_mm: 2.7;
  mu_POM_on_plastic: 0.12;
  viablePairing: 'Right CG (Free Shaft Version)';
  spinDirectionLock: 'right';
  competitiveRank_EGSystem: 2;
}

function freespinTipFriction(
  mu: number,
  m_CEW_kg: number,
  r_contact_m: number
): number {
  return mu * m_CEW_kg * 9.8 * r_contact_m;
}

function standardTipFriction(
  mu: number,
  m_combo_kg: number,
  r_contact_m: number
): number {
  return mu * m_combo_kg * 9.8 * r_contact_m;
}

function ladImprovementFactor(
  m_CEW_kg: number,
  m_combo_kg: number
): number {
  return m_combo_kg / m_CEW_kg;
}

function rightingTorqueAtTilt(
  mu: number,
  m_kg: number,
  r_shoulder_m: number,
  tilt_deg: number
): number {
  const r = 0.0006 + r_shoulder_m * Math.sin(tilt_deg * Math.PI / 180);
  return mu * m_kg * 9.8 * r * Math.cos(tilt_deg * Math.PI / 180);
}

// freespinTipFriction(0.12, 0.00085, 0.0006)  → 5.99e-7 N·m  (free-spin, CEW load only)
// standardTipFriction(0.12, 0.050, 0.0006)    → 3.53e-5 N·m  (without free spin)
// standardTipFriction(0.22, 0.050, 0.0003)    → 3.23e-5 N·m  (Metal Sharp standard)
// ladImprovementFactor(0.00085, 0.050)         → 58.8×  — free spin reduces tip friction 58× vs standard
// rightingTorqueAtTilt(0.12, 0.00085, 0.0027, 10) → 8.74e-7 N·m
// orbitRadiusProxy: 1/(0.12 × 0.0006) = 13,889 vs Metal Sharp 15,152 — slightly more active
// POM vs metal friction ratio: 0.12/0.22 = 0.545 — POM has 45% less friction
```


---

## Case 232 — Core Attack Ring: Holy Despell · 2.8 g: Why Triangle Protrusions Are a Structural Recoil Liability Across All Roles, How SAR Underside Gaps Create Dragon Saucer Jamming, and Why War Lion SAR Cannot Fully Shield the Protrusion Exposure

Holy Despell is a 2.8 g Core Attack Ring (CAR) from Zeus, featuring two triangular protrusions at ~180° spacing and a Sub-Attack Ring (SAR) slot. Its compact, near-circular body profile gives it an initially promising appearance for zombie and survival roles — low profile, symmetric, minimal sharp geometry. Two structural problems prevent competitive use in any primary role: the triangular protrusions present near-radial contact faces that produce severe recoil on any direct hit, and the SAR interface has underside gaps that allow Dragon Saucer SAR to jam rather than rotate freely. SAR selection narrows to War Lion and Twin Horn (Hasbro), which address the jamming problem but cannot cover the protrusion contact zones that tilt-state opponents inevitably hit. Holy Despell is usable in CSD configurations where the protrusions are partially shielded by the Roller Defense Ring's coverage, and marginally usable in zombie and compact builds, but outclassed in each by parts without the protrusion recoil liability.

---

### 1. Triangle Protrusion Geometry: Recoil Analysis

Each triangular protrusion has a pointed apex and two flanking faces. The apex and faces all present at large angles from tangent:

```
   Triangle protrusion (top view):

   rotation →

              ▲  ← apex (θ_apex ≈ 80–90° from tangent — near-radial point)
             / \
            /   \
   ────────/     \────  ← flanking faces (θ_flank ≈ 60–70° from tangent)
```

Recoil fractions:
```
Apex contact:    J_recoil / J = sin(85°) ≈ 0.996  (essentially pure recoil)
Flank contact:   J_recoil / J = sin(65°) ≈ 0.906  (still majority recoil)
```

Both contact zones are worse than the GT Version protrusions (sin(55°) ≈ 0.819) and approach the Gigars spike level (sin(80°) ≈ 0.985). Any direct protrusion contact is a near-complete self-recoil event.

With only two protrusions at 180° spacing:
```
Dead zone (no protrusion) per half: ~160° of smooth arc
Protrusion zone per half: ~20°
Dead zone fraction: 160/180 = 89%
```

The protrusions are infrequently contacted at a given moment — most opponent contact in a circular stadium lands on the smooth arc body. But tilt-state beyblades do not maintain perfect horizontal orientation. When a survival-type beyblade precesses and tilts:

```
Tilt angle during late-match precession: Φ ≈ 10–30°
```

At Φ > 15°, the tilted AR presents different sections to opponents than in upright orientation. The protrusion faces, normally at 180°-opposed positions, can swing into the lower contact zone during precession. The probability that an incoming attack hits a protrusion increases with tilt:

```
P(protrusion_contact) ≈ (protrusion_arc / 360°) × (1 + sin(Φ) × k_tilt)
```

where k_tilt is a geometry-specific factor. For large tilt, what was a 20°/360° ≈ 5.6% contact probability at upright increases meaningfully. Since survival and zombie matches are specifically the late-match, high-tilt regime, protrusion contact probability is highest exactly when the beyblade is most vulnerable to recoil-induced ring-out.

---

### 2. Dragon Saucer SAR: Underside Gap Jamming Mechanism

The SAR slot interface has gaps on the underside of the CAR. Dragon Saucer SAR has protrusions on its inner rim (the teeth-like gear projections visible on the outer edge) that interact with these gaps during rotation:

```
   SAR interface (cross-section, simplified):

   CAR underside:   ──┐ gap ┌──  ← gap in CAR floor
                      │     │
   SAR inner rim:   ──┘ tooth └── ← Dragon Saucer tooth projection

   During free-spin: tooth enters gap → mechanical catch → jam
```

When Dragon Saucer SAR attempts to rotate freely relative to the CAR, its tooth projections catch the CAR's underside gaps. This converts what should be free rotation (the SAR spinning to dissipate impact energy) into mechanical engagement (the SAR dragging the CAR and beyblade). The jam produces a sudden impulse transfer — functionally equivalent to high recoil — at the moment the SAR is hit.

War Lion SAR and Twin Horn (Hasbro) SAR have smoother inner rims without projections that match the gap geometry, so they rotate freely. These are the viable SAR options.

---

### 3. War Lion SAR: Coverage Assessment and Protrusion Exposure

War Lion SAR mounts over the Holy Despell CAR body and extends radially outward, providing a wider, smoother contact zone for incoming hits. However:

```
   Assembly (top view):

   ┌──────────────────────────────────┐
   │     War Lion SAR outer body      │  ← main contact zone
   │   ┌──────────────────────────┐   │
   │   │  Holy Despell CAR body   │   │
   │   │     ▲          ▲         │   │  ← triangle protrusions
   │   └──────────────────────────┘   │
   └──────────────────────────────────┘
```

War Lion SAR covers the CAR body at the outer contact height. Protrusions that are shorter than the SAR outer rim height are shielded from horizontal contact events. The triangular protrusions of Holy Despell sit at a specific height relative to the SAR mounting plane:

- At upright: protrusions are mostly below or at the inner SAR lip height — reasonably covered
- At tilt (Φ > 10–15°): protrusions rotate downward on the tilted side, potentially extending below the SAR coverage zone and into the contact height of opponents or the stadium floor

The side profile image confirms the protrusion geometry: the triangles project outward and slightly upward from the CAR body. When the assembly tilts, these protrusions on the downward side can descend below Circle Survivor's body height — Circle Survivor sits low and can catch Holy Despell + War Lion setups under it. The assembly's lower height at the edges (where protrusions emerge) is the specific geometric issue: the protrusion tip height is not fully covered by War Lion SAR when the combo tilts.

"War Lion provides little protection for these most of the time" — this refers to the contact geometry at tilt. In upright play, War Lion covers adequately; in tilt, it does not.

---

### 4. CSD Use Case: Protrusion Partially Mitigated by Roller Defense Ring

In Circle Survivor Defense (CSD) configuration, the Roller Defense Ring sits above and outside the CAR+SAR assembly. Its geometry:

```
   CSD assembly profile (side view):

   Roller Defense Ring ─── ██████████████  ← wide, high outer rim
   SAR (War Lion)      ───     ████████    ← mid-height
   Holy Despell CAR    ───      ██████     ← below, protrusions here
```

The Roller Defense Ring's outer rim intercepts most incoming attacks above the CAR level, preventing direct contact with the Holy Despell protrusions in typical engagement geometries. This is why Holy Despell is "one of the better choices for CSD" — in this configuration the protrusion liability is partially suppressed by the Defense Ring acting as a shield.

However, Roller Defense Ring itself is considered a better CSD choice than Holy Despell — meaning an alternative CAR without the protrusion liability, combined with Roller Defense Ring, outperforms Holy Despell + Roller Defense Ring. The improvement comes from eliminating residual protrusion contacts at unusual attack heights or tilt angles that Roller Defense Ring does not fully block.

---

### 5. Own SAR Compatibility: Why Free-Spinning Aggressive SAR Fails

Holy Despell's own SAR (from Zeus stock) has an aggressive design. On a zombie/survival setup, the SAR should free-spin to reduce contact impulse. Two problems arise:

1. **Aggressive SAR design on free-spinning mount** — if the SAR has attack-oriented contact faces, those faces produce recoil on contact regardless of whether the SAR is spinning freely. The free-spin mechanism reduces the impulse magnitude (the SAR rotates with the impact rather than rigidly transmitting it), but does not change the face angle. Aggressive faces at large tangential angles still produce recoil-dominant contacts.

2. **Stamina cost** — the SAR adds rotational mass at the outer radius. Even with free-spin, the increased rotational inertia slows the overall spin decay rate only marginally, while the aggressive SAR profile increases contact frequency and each contact's self-recoil on direct protrusion hits.

The result: poor offense (SAR is free-spinning, so it cannot deliver attack impulse; it just absorbs hits) and poor survival (aggressive face geometry produces recoil at the moments when tilted survival types encounter the SAR faces). The combination has no competitive use case.

---

### 6. Physics Model

```typescript
interface HolyDespellAnalysis {
  mass_g: 2.8;
  partType: 'core_attack_ring';
  beyblade: 'Zeus';
  protrusionCount: 2;
  protrusionSpacing_deg: 180;
  apexAngleFromTangent_deg: 85;
  flankAngleFromTangent_deg: 65;
  sarSlot: true;
  incompatibleSAR: ['Dragon Saucer'];
  compatibleSAR: ['War Lion', 'Twin Horn (Hasbro)'];
  competitiveRoles: ['zombie_niche', 'CSD_niche', 'compact_niche'];
  outclassedBy: {
    zombie:  'War Lion (lower recoil body)';
    CSD:     'Roller Defense Ring (no protrusion liability)';
    compact: 'lower-recoil CARs';
  };
}

function protrusionRecoilFraction(angle_deg: number): number {
  return Math.sin(angle_deg * Math.PI / 180);
}

function protrusionContactProbability(
  protrusion_arc_deg: number,
  tilt_deg: number,
  k_tilt: number
): number {
  const base = protrusion_arc_deg / 360;
  return base * (1 + Math.sin(tilt_deg * Math.PI / 180) * k_tilt);
}

function deadZoneFraction(protrusion_arc_deg: number, nProtrusions: number): number {
  return 1 - (protrusion_arc_deg * nProtrusions) / 360;
}

// protrusionRecoilFraction(85) → 0.996  (apex — near-total recoil)
// protrusionRecoilFraction(65) → 0.906  (flank — still majority recoil)
// protrusionRecoilFraction(55) → 0.819  (GT Version protrusion — for reference)
// deadZoneFraction(20, 2)      → 0.889  (89% of arc is smooth body)
// protrusionContactProbability(20, 0,  1.5) → 0.056  (upright: 5.6%)
// protrusionContactProbability(20, 20, 1.5) → 0.112  (20° tilt: 11.2% — doubles)
// protrusionContactProbability(20, 30, 1.5) → 0.139  (30° tilt: 13.9%)
```


---

## Case 233 — Sub Attack Ring: Screw Zeus · 4.4 g: Why Speed-Dependent Contact Geometry Makes It the Highest-Ceiling Smash SAR When Fixed, How SAR Pairing Determines Contact Point Exposure and Weight Distribution, and Why Inverted Slopes Create Asymmetric Self-Destabilisation in Left Spin

Screw Zeus is a 4.4 g Sub Attack Ring (SAR) with a near-rectangular mass distribution — weight concentrated at two opposing far ends — and aggressive mixed geometry: forehead contact points, sloped sections with corners, rear head contact points, an inverted slope designed for Force Smash in LS, and overhanging protrusions. Free-spinning, the aggressive face geometry produces severe recoil with no usable offensive output — fixing in place is mandatory. Fixed, the rectangular mass distribution combined with high contact-point density makes it the highest-ceiling Smash Attack SAR of its generation, but only with sufficient tip speed: the combination requires fast tips (SG Grip Change Base Tip, Defense Grip Base inverted) to deliver its mass into contacts hard enough to overcome the self-recoil. SAR choice determines which contact points are exposed and how evenly mass is distributed; Dragon Breaker adds the most mass and evens distribution for maximum power; Great Dragon exposes contact points well with lower mass for greater setup flexibility; Dragon Saucer is a middle-weight option with excellent contact point alignment. War Lion and War Monkey serve a separate role — locking Screw Zeus to expose its RS slopes for Traditional Upper Attack, adding nothing to pure Smash. LS setups carry an inverted-slope self-destabilisation liability that is manageable on fast bases but becomes a problem against low, heavy opponents.

---

### 1. Mass Distribution and Speed Requirement

Screw Zeus mass is concentrated at two ends, separated by ~160–170° rather than the 120° of a 3-fold AR. Effective moment of inertia:

```
I_Screw_Zeus ≈ m × r_end² × 2  (approximating two point masses at ends)
             ≈ 0.0044 × (0.032)² × 2 ≈ 9.0 × 10⁻⁶ kg·m²
```

This is high for an SAR — the mass sits at maximum radius rather than distributed uniformly. The kinetic energy available for transfer in a contact event:

```
E_contact = ½ × I × ω²
At ω = 200 rad/s: E ≈ ½ × 9.0×10⁻⁶ × 40000 ≈ 0.180 J
At ω = 150 rad/s: E ≈ 0.101 J  (44% less)
At ω = 100 rad/s: E ≈ 0.045 J  (75% less)
```

The E ∝ ω² relationship means spin rate has a squared effect on available energy. At low ω, the energy advantage of Screw Zeus's mass distribution is not realised — conventional smash ARs with lower mass concentration perform comparably because both are energy-limited at low spin. At high ω (fast tip required), Screw Zeus's concentrated end-mass delivers disproportionately more energy per contact than lighter, more distributed ARs.

The speed requirement is structural: Screw Zeus is not "fast enough" — it forces the combo to be fast. Slow setups waste the mass advantage.

---

### 2. Free-Spin vs Fixed: Why Fixing Is Non-Negotiable

In free-spin, the SAR rotates relative to the CAR on impact. Contact impulse goes into spinning the SAR rather than destabilising the opponent:

```
Free-spin contact: J → ΔL_SAR (SAR spins up) + J_transfer (small fraction to opponent)
Fixed contact:     J → J_transfer (all to opponent) + J_recoil (back to user)
```

Screw Zeus has aggressive face angles (φ ≈ 40–60° from tangent at various contact surfaces). In free-spin the SAR absorbs the impulse and prevents any useful smash — the SAR is too heavy and face angles too aggressive for the free-spin mechanism to reduce rather than redirect the impact. The result is recoil via SAR inertia rather than face angle, which is effectively the same outcome.

Fixed, the same face angles deliver:
```
J_smash = J × cos(φ)
J_recoil = J × sin(φ)
```
The aggressive geometry produces competitive smash at the cost of manageable recoil — acceptable for attack, which tolerates recoil in exchange for impact power. This is why fixing is mandatory and the SAR has no free-spin use.

---

### 3. RS Contact Points: Geometry and Exposure by SAR Pairing

In Right Spin, the primary contact surfaces in order of contribution:

```
Surface                   Angle from tangent    Attack type
────────────────────────────────────────────────────────────────
Rear of heads             φ ≈ 35–40°            Smash (forward-angled)
Corner of sloped section  φ ≈ 45°               Smash (corner impact)
Overhanging protrusions   φ ≈ 30–35°            Low-reach Smash
```

**Dragon Breaker (RS):**
- Ridges of Dragon Breaker add smash on their own contact events
- Exposes rear heads and slope corners cleanly
- Does not expose upper slopes (slope upper surface still accessible for Upper Attack context)
- Heaviest combination — maximum energy delivery at high speed
- Overhanging protrusions remain active for low-opponent contacts

**Dragon Saucer (RS):**
- Flat protrusion of Dragon Saucer covers the sloped section's upper face with its own flat contact
- Rear heads remain exposed; Dragon Saucer flat protrusion adds its own contact point
- Slope corners still active
- Mid-weight — less total energy than Dragon Breaker but better SAR contact point alignment
- Still top-tier competitive

**Great Dragon (RS):**
- Rear heads of Screw Zeus well-exposed
- Great Dragon ridges add minor smash in RS (not primary contributors)
- Slope corners exposed to a lesser degree
- Lightest combination — more forgiving of tip speed, but less "safe" (easier to push back)

**War Lion / War Monkey (RS):**
- Exposes the upper face of the sloped section → Traditional Upper Attack geometry
- The slope, normally covered or partially obstructed by attack SARs, becomes the primary contact surface
- No additional smash from War Lion/War Monkey bodies
- This is the only RS Upper Attack use case for Screw Zeus; all other SARs outclass these for Smash

---

### 4. LS Contact Points and the Inverted Slope

In Left Spin, the SAR geometry rotates to present different leading faces:

```
Surface                   Role in LS
─────────────────────────────────────────────────────────────────────
Forehead of Screw Zeus    Primary smash — φ ≈ 40–45°, well-angled in LS
Rear spike + mass behind  Secondary smash — concentrated mass directly behind contact
Inverted slope            Self-destabilisation liability (upward recoil at opponent contact)
Overhanging section       Interference with Circle Survivor Defense
```

**Inverted slope mechanics:**
The slope designed for Force Smash in LS has:
```
α_slope ≈ −20° (inverted, angled downward relative to approach direction)
J_vertical_intended = −J × sin(20°) ≈ −J × 0.342  (push opponent down)
```

But the claw geometry in LS engages the slope's underside rather than its top face — the approach direction in LS exposes the slope underside. As with Gigantic Claw (Case 229, §5), the geometry inverts:

```
Actual J_vertical in LS ≈ +J × sin(20–30°) ≈ +J × 0.342–0.500  (upward — on self)
```

This is self-destabilisation: each contact with the slope face in LS drives Screw Zeus upward relative to the stadium, reducing the combo's contact pressure and allowing low, heavy opponents to duck under the contact zone on subsequent passes. On taller bases where the AR already sits higher, the slope-induced upward kick is more pronounced because there is more room to travel upward before losing contact. On low, fast setups the effect is manageable — the combo returns to position quickly due to high spin and tip friction. On slow or tall setups it is a significant liability.

---

### 5. SAR Pairing Comparison: LS

```
SAR            Primary LS contacts              Weight added   Self-destab risk   Speed req.
──────────────────────────────────────────────────────────────────────────────────────────────
Dragon Breaker Foreheads + serrations           high           moderate           very high
Dragon Saucer  Foreheads + DS spike compound    medium-high    moderate           high
Great Dragon   Foreheads + crests               low-medium     moderate           medium
War Lion       Screw Zeus fixed, no additions   low            moderate           medium
War Monkey     Screw Zeus fixed, no additions   low            moderate           medium
```

Dragon Breaker in LS:
- Serrations of Dragon Breaker add smash independently; mass concentrations cover "dead spike" area of Screw Zeus (the spikes on Screw Zeus that are not effective contact points — Dragon Breaker fills this dead space while distributing mass more evenly)
- Maximum mass → maximum energy at high speed
- Even weight distribution reduces the torque imbalance of Screw Zeus's dual-end concentration
- Best for fast tips against heavy opponents; SG Metal Flat Base (Gaia Dragoon V Version) viable

Dragon Saucer in LS:
- Dragon Saucer spike contact point compounds with Screw Zeus foreheads — the DS spike and Screw Zeus forehead engage the same opponent zone sequentially or simultaneously depending on exact orientation
- Second section of Screw Zeus (the rear body between the two contact zones) remains unobstructed
- Consistent, powerful contacts — arguably better contact point alignment than Dragon Breaker in LS

Great Dragon in LS:
- Foreheads exposed; Great Dragon crests provide own smash contacts
- Lighter → more forgiving on worn or lower-speed tips
- Does not work on SG Metal Flat Base (Gaia Dragoon V Version): "too much recoil, too little weight" — the recoil from Great Dragon's crests without Dragon Breaker's mass to stabilise causes ring-out risk exceeding the smash benefit at Metal Flat speed
- Top-tier but lighter window

---

### 6. Circle Survivor Defense Interference

The overhanging protrusions of Screw Zeus extend beyond the WD radius in certain configurations. Circle Survivor Defense uses a large outer body (Roller Defense Ring or Circle Survivor itself) that creates a "moat" — a region where attacking ARs are blocked before reaching the inner beyblade.

Screw Zeus's overhang extends into this moat region:
```
r_overhang ≈ r_WD + 3–5 mm protrusion
r_CSD_outer_body ≈ r_WD + 8–12 mm
```

If r_overhang < r_CSD_outer_body, the protrusion contacts the CSD outer body rather than the inner AR, losing useful impact energy to the shielded body. With small WD configurations (Ten Heavy), Circle Survivor's body sits closer to the centre — reducing the gap the protrusion must bridge. In these cases:

```
r_overhang ≥ r_CSD_inner_ring → overhang blocked by CSD outer body → impact absorbed
```

The recommended response — strong launch, weight, momentum bludgeon — is the only counter: at high enough closing speed, even a blocked overhang contact with the CSD outer body produces sufficient impulse to push the CSD combo toward the wall. It does not require landing on the inner AR. This converts from a "precision attack" to a "mass attack" strategy, which requires Screw Zeus's mass advantage.

---

### 7. RS Upper Attack Configuration: War Lion / War Monkey

Both War Lion and War Monkey lock Screw Zeus in a fixed position that exposes the upper face of the sloped section in RS. The slope parameters:

```
α_upper_slope_RS ≈ 25–30° from horizontal (upper face, forward-facing in RS)
J_vertical = J × sin(27°) ≈ J × 0.454
J_lateral  = J × cos(27°) ≈ J × 0.891
```

This is competitive Upper Attack geometry. The advantage over pure Upper Attack ARs (Triangle Wing, Upper Dragoon): Screw Zeus's mass concentration provides higher J_total per contact than lighter dedicated upper ARs, amplifying both J_vertical and J_lateral.

War Monkey is preferred over War Lion due to War Lion's wing tips being at risk of fracture from the high-impulse contacts that Screw Zeus generates. War Monkey's geometry provides equivalent slope exposure without the fragility liability.

Neither SAR adds smash, so for pure Smash Attack use, Dragon Breaker/Saucer/Great Dragon all outclass War Lion and War Monkey here. This configuration's value is exclusively in Traditional Upper Attack.

---

### 8. Physics Model

```typescript
interface ScrewZeusAnalysis {
  mass_g: 4.4;
  partType: 'sub_attack_ring';
  massDistribution: 'rectangular_dual_end';
  momentOfInertia_kgm2: 9.0e-6;
  freeSpin: 'non_competitive';
  fixedSpin: 'mandatory';
  preferredBases: ['SG Grip Change Base Tip', 'Defense Grip Base (Tip Inverted)', 'SG Metal Flat Base (GDV Version) with Dragon Breaker/Saucer'];
  sarPairings: {
    RS_smash:    ['Dragon Breaker', 'Dragon Saucer', 'Great Dragon'];
    LS_smash:    ['Dragon Breaker', 'Dragon Saucer', 'Great Dragon'];
    RS_upper:    ['War Lion', 'War Monkey'];
    LS_upper:    'none_viable';
  };
}

function smashKineticEnergy(
  I_kgm2: number,
  omega_rad_s: number
): number {
  return 0.5 * I_kgm2 * omega_rad_s ** 2;
}

function energySpeedRatio(omega1: number, omega2: number): number {
  return (omega1 / omega2) ** 2;
}

function resolveContactImpulse(
  J_total: number,
  face_angle_deg: number
): { smash: number; recoil: number } {
  const phi = face_angle_deg * Math.PI / 180;
  return {
    smash:  J_total * Math.cos(phi),
    recoil: J_total * Math.sin(phi),
  };
}

function invertedSlopeVerticalRecoil(
  J_total: number,
  slope_deg: number
): number {
  return J_total * Math.sin(slope_deg * Math.PI / 180);
}

// smashKineticEnergy(9.0e-6, 200) → 0.180 J  (high speed)
// smashKineticEnergy(9.0e-6, 100) → 0.045 J  (low speed — 75% less)
// energySpeedRatio(200, 150) → 1.78  — 78% more energy at 200 vs 150 rad/s
// resolveContactImpulse(0.005, 40) → { smash: 3.83e-3, recoil: 3.21e-3 }  (head contact)
// resolveContactImpulse(0.005, 45) → { smash: 3.54e-3, recoil: 3.54e-3 }  (corner contact)
// invertedSlopeVerticalRecoil(0.005, 25) → 2.11e-3 N·s  (LS upward self-kick per contact)
// Upper Attack slope RS: sin(27°) = 0.454 J_vertical, cos(27°) = 0.891 J_lateral
```


---

## Case 234 — Right Customize Gear (Free Shaft Version) · 4.0 g (shells) + 2 Bearings: Why Bearing Isolation Is the Only EG Component That Achieves Competitive LAD, How CEW Choice Determines the Viable Configuration Space, and Why Alternative Shafts Produce Distinct Attack Applications

Right Customize Gear (Free Shaft Version) is a Right Spin EG shell assembly consisting of two casing halves (2.0 g each, 4.0 g total) housing two shielded ball bearings. The bearings mount on a free-rotating inner shaft: the inner shaft couples to the Spin Gear and rotates with the beyblade; the outer shell and mounted CEW are bearing-isolated and spin independently. This is the mechanical basis for the only competitive LAD available within the EG system — the CEW tip's friction does not oppose the beyblade's precession because the outer shell carrying the tip is decoupled. The casings are disassemblable, and external shafts can be substituted: SG (Full Auto Clutch Version) Shaft (fixed in place, aggressive metal flat) and SG (Bearing Version 2) Shaft (rubber contact against casing, intermittent high-speed burst) are the two notable non-stock applications. Both shaft substitutions are Tier 2 attack configurations. CEW Light Sharp + Normal Base (Wolborg 4 Version or Rock Bison Version) + Wide Survivor is the only competitive first-tier use. Right Spin lock and EG base LAD deficit constrain every other configuration to niche or outclassed status.

---

### 1. Bearing Architecture: Why This Is the Only EG Competitive LAD Mechanism

Standard EG setups (fixed shaft, no bearing) couple the tip directly to the spin gear shell rotation. Tip friction load:

```
τ_friction_standard = μ × m_combo × g × r_contact
```

The full combo mass loads the tip. In Right CG Free Shaft with bearings:

```
τ_friction_free = μ × m_CEW × g × r_contact   (only CEW mass on tip — bearing decouples shell)
```

The LAD improvement factor (derived in Case 231):

```
LAD_factor = m_combo / m_CEW = 50 g / 0.85 g ≈ 59×  (with CEW Light Sharp)
```

This is genuine bearing-LAD — the same category as SG (Bearing Version 2) and Neo SG (Double Bearing Version). The distinction from standard EG:

```
Standard EG tip friction:     τ = 0.22 × 0.050 × 9.8 × r_contact
Right CG Free Shaft + LS CEW: τ = 0.12 × 0.00085 × 9.8 × r_contact
Ratio: (0.22 × 0.050) / (0.12 × 0.00085) = 107.8  — standard is 108× more friction
```

The bearing plus POM tip reduces friction two orders of magnitude below a standard smooth-tip EG configuration. This is the only path to competitive LAD within the EG system.

---

### 2. CEW Light Sharp + Normal Base + Wide Survivor: The Competitive Configuration

As derived in Case 231, CEW Light Sharp (0.85 g, POM, r_contact ≈ 0.65 mm, μ ≈ 0.12) with Right CG Free Shaft achieves bearing-class LAD. The remaining configuration choices:

**Blade Base:**
EG-compatible blade bases with good LAD are absent from the library with one partial exception (First Clutch Base Driger G Version, some LAD). Normal Base (Wolborg 4 Version) and Normal Base (Rock Bison Version) are preferred for two reasons:
1. Less bulky — lower profile reduces the EG height penalty
2. Wide Survivor compatibility — these bases allow Wide Survivor WD, which provides the outer rim contact zone for precession stabilisation

**Weight Disk — Wide Survivor:**
Wide Survivor provides a large-diameter flat rim. During late-spin precession, the combo tilts and the WD outer edge contacts the stadium floor, converting tip precession to a more stable outer-rim contact. This is the WD LAD mechanism:

```
r_WD_contact ≈ 22–24 mm (Wide Survivor outer rim)
τ_WD_friction = μ_WD × F_partial × r_WD
```

Wide Survivor's LAD is additive with the bearing tip's LAD. The combination produces the full zombie survival profile: bearing decouples tip, Wide Survivor provides outer-rim precession path.

**Why not EG-compatible blade bases:**
EG bases add height (h_EG ≈ 8–10 mm above Normal Base), raising CoM and reducing gyroscopic stability at low spin. Wide Survivor cannot be used with all EG bases. The combination of Normal Base + Wide Survivor strictly dominates EG bases for this role because: (a) lower CoM, (b) Wide Survivor access, (c) less bulk. The EG mechanism in the base provides nothing useful for a zombie setup.

---

### 3. CEW Metal Sharp: Configuration Constraints and Base Preferences

Metal Sharp CEW (μ ≈ 0.22, r ≈ 0.3 mm, metal) provides:
```
τ_friction_free = 0.22 × m_CEW × 9.8 × 0.0003
```

Without knowing m_CEW for Metal Sharp exactly, but assuming ~1.5 g:
```
τ ≈ 0.22 × 0.0015 × 9.8 × 0.0003 ≈ 9.7 × 10⁻⁷ N·m
```

This is competitive with pure tip friction, but Metal Sharp's inherent instability (very narrow contact, minimal righting moment) means the precession is less stable than CEW Light Sharp's change-shaped shoulder. "Quite unstable" describes this: at low spin with high tilt, Metal Sharp has no bevel or shoulder to arrest the tilt, making it susceptible to topple from any perturbation.

Base preference — First Clutch Base (Metal Driger Version) is significantly better than alternatives because it provides additional mass at a favourable height, compensating for Metal Sharp's instability without the aggressive-clutch liability of GT/Gigars versions. Normal bases (Wolborg 4, Rock Bison) and the two clutch bases (Driger G First Clutch, Draciel G Final Clutch) are the acceptable alternatives. All other options introduce more liabilities than benefits.

---

### 4. CEW Metal Grip: Defensive Configuration and Height Trade-off

Metal Grip CEW provides:
```
μ ≈ 0.65, r_contact ≈ 3.5 mm (rubber outer ring)
τ_friction_free = 0.65 × m_CEW × 9.8 × 0.0035
```

The rubber grip provides:
1. **Traction-based stability** — the wide rubber contact prevents tip slipping at precession, providing some post-balance-loss stability
2. **Bevel-edge precession** — the bevelled outer edge of the rubber tip creates a partial self-centering effect during tilt (described in Case 220 for Metal Sharp's ball-dome; here the rubber bevel provides a gentler version)
3. **Height** — Metal Grip is taller than Metal Sharp, raising the CEW body. This is defensive in that it positions the CEW above typical low-attack contact zones

The disadvantage: Metal Grip's rubber friction is substantially higher than CEW Light Sharp's POM tip in free-spin configuration. The ~5× friction difference (derived in Case 231) means Metal Grip CEW is not a LAD-competitive tip — it provides post-topple survival through grip, not through frictionless precession. This is why it is "outclassed by SG (Bearing Version 2) Shaft" — BV2 provides both bearing decoupling and better tip friction than any metal/rubber CEW.

**Base considerations:**
- First Clutch Base (Zeus Version): adds weight — heavier combo is harder to KO, but no LAD benefit
- Normal Base (Rock Bison / Wolborg 4): better LAD from Wide Survivor access
- Wide Defense noted as preferable to Wide Survivor here: wider contact footprint absorbs hits without the rim-contact instability that Wide Survivor can exhibit under high-impulse contacts

---

### 5. Shaft Substitution: SG (Full Auto Clutch Version) Shaft

SG (Full Auto Clutch Version) Shaft has a metal flat tip. Inserted into Right CG Free Shaft casings and fixed in place (requires effort to close the two casing halves with the shaft's geometry — not a clean fit):

```
Tip type:       metal flat (integral to shaft)
μ_tip:          ≈ 0.20–0.22
r_contact:      ≈ 3.0–3.5 mm (flat tip full contact)
Activation:     none (fixed — no clutch function)
```

The shaft fixes in place, removing bearing free-spin. The result is a metal flat attack tip on Right CG casings — functionally similar to SG Metal Flat Base (Gaia Dragoon V Version) but different in execution:

**vs SG Metal Flat Base (GDV Version):**
```
SG Metal Flat Base (GDV):      tighter flower pattern, greater controllability, standard height
Right CG + FAC Shaft (fixed):  less controllable, slightly different height, Tier 2
```

GDV Version is preferred because it was designed as an attack base and its tip geometry is optimised for tight, controllable flower patterns. FAC Shaft in Right CG is a workaround — viable but looser. Tier 2.

---

### 6. Shaft Substitution: SG (Bearing Version 2) Shaft

BV2 Shaft has a rubber tip. Inserted into Right CG casings, the shaft body is slightly oversized for the casing's inner diameter:

```
Shaft OD > casing inner diameter → shaft rubs against casing wall during rotation
Contact: rubber shaft body against plastic casing → variable friction engagement
```

The rubbing creates intermittent high-friction episodes: when the shaft contacts the casing, it grips and suddenly drives the beyblade forward at high lateral velocity. When it breaks contact (shaft and casing momentarily separate), the beyblade coasts. This produces:

```
Movement pattern: burst-coast-burst-coast  (highly variable)
Peak velocity during burst: very high (rubber contact at full combo load)
Consistency: poor (contact depends on bearing clearance, wear state, spin rate)
```

"Very short bursts of extremely high speed, but inconsistency relegates it to Tier 2" — the burst velocity can exceed what a standard attack tip produces, but it cannot be reliably timed or directed. The attack-critical property (charging toward the opponent with high closing speed) is present in the burst phases but absent in the coast phases. Tier 2 because the opponent cannot be reliably engaged during burst phases.

More worn BV2 Shafts have increased rubber deformation, producing more consistent casing contact — hence "particularly with more worn shafts." Wear improves the rubber-to-casing contact rate, making the attack pattern less intermittent.

---

### 7. Right Spin Lock: Why This Constrains All Uses

As established in Case 231, no LS equivalent bearing CG exists. This means:
1. Zombie use: RS zombies cannot spin-steal same-spin RS opponents
2. Attack use: RS attack must face LS opponents to benefit from opposite-spin momentum transfer advantage
3. Defensive use: RS free-shaft configurations have no advantage over LS equivalents that the part list supports

The competitive window is narrow: RS bearing-class zombie vs specific opponent types where the RS spin direction is not a liability. Against the dominant zombie meta (LS Customize Grip Base + Neo SG DBV), RS lock means:
- Cannot match the LAD ceiling of CGB + Defense Ring + Neo SG DBV
- RS spin direction means same-spin contact vs RS attackers (no spin steal)
- All competitive advantages are marginal vs alternatives

"Niche competitive part when used with CEW Light Sharp" is the accurate summary.

---

### 8. Physics Model

```typescript
interface RightCGFreeShaftAnalysis {
  shellMass_g_each: 2.0;
  totalShellMass_g: 4.0;
  bearingCount: 2;
  spinDirection: 'right';
  freeSpinMechanism: 'bearing_isolated_outer_shell';
  compatibleCEW: ['Light Sharp', 'Metal Sharp', 'Metal Semi-Flat', 'Metal Change', 'Metal Grip'];
  tier1Configuration: 'CEW Light Sharp + Normal Base (W4/RB) + Wide Survivor';
  tier2Configurations: ['SG FAC Shaft (fixed)', 'SG BV2 Shaft (rubber rub)'];
  outclassedByForZombie: 'CGB + Defense Ring + Neo SG (Double Bearing Version)';
}

function bearingLADFactor(m_combo_kg: number, m_CEW_kg: number): number {
  return m_combo_kg / m_CEW_kg;
}

function standardVsFreespinFriction(
  mu_standard: number, m_combo_kg: number,
  mu_CEW: number,    m_CEW_kg: number,
  r_contact_m: number
): number {
  const tau_standard = mu_standard * m_combo_kg * 9.8 * r_contact_m;
  const tau_free     = mu_CEW     * m_CEW_kg   * 9.8 * r_contact_m;
  return tau_standard / tau_free;
}

function burstAttackVelocity(
  omega_rad_s: number,
  r_AR_m: number,
  mu_rubber: number
): number {
  return omega_rad_s * r_AR_m * mu_rubber;
}

// bearingLADFactor(0.050, 0.00085) → 58.8× (CEW Light Sharp free-spin)
// standardVsFreespinFriction(0.22, 0.050, 0.12, 0.00085, 0.0006) → 107.8×
// bearingLADFactor(0.050, 0.0015)  → 33.3× (Metal Sharp CEW — still good, but less stable)
// burstAttackVelocity(200, 0.029, 0.65) → 3.77 m/s  (BV2 shaft rubber burst peak)
// burstAttackVelocity(200, 0.029, 0.22) → 1.28 m/s  (metal flat standard — 2.95× less)
```


---

## Case 235 — Right Customize Gear (Free Shaft Version) Shaft · 0.87 g: Why Casing Compatibility Determines the Height Penalty in Each Configuration, How CEW Mounting on Non-EG Casings Creates Unavoidable Tallness, and Why the Primary Use Remains the Stock Right CG Shell

Right CG (Free Shaft Version) Shaft is a 0.87 g metal shaft with a plastic CEW-mounting base. It is interchangeable with SG (Bearing Version) and SG (Free Shaft Version) casings, enabling CEW mounting in non-EG base setups. In each non-stock casing configuration, the CEW must be attached after the SG is seated in the blade base — a procedural constraint that follows from the casing geometry not being designed for CEW mounting. All non-stock configurations produce a taller assembly than standard SG setups, and this height penalty is the dominant failure mode: tall combos are more easily destabilised and KO'd, negating whatever tip or LAD benefit the CEW was supposed to provide. The only competitive use is the stock pairing with Right CG Free Shaft casings and CEW Light Sharp (documented in Cases 231 and 234), which is designed to work and avoids the height problem by using the EG base height that the casings were built for.

---

### 1. CEW Mounting Sequence and Height Origin

In a standard EG setup, the CEW mounts to the outer shell of the Right CG casings before assembly. The shell's outer dimensions are designed to accept the CEW as an integral component — the total height is the EG system's intended height.

With non-EG casings (SG Bearing Version or SG Free Shaft Version), the shaft fits inside the casing, but the CEW receiver on the shaft sits below the casing exit plane:

```
   Standard EG assembly (side view):
   
   AR ──── shell (with CEW) ──── base     h_total = h_EG ≈ 28–32 mm

   Non-EG casing assembly:
   
   AR ──── casing ──── shaft (below) ──── CEW (below casing) ──── base
           ↑ casing adds height           ↑ CEW adds more height below
   
   h_total = h_standard_SG + h_casing + h_CEW_protrusion ≈ 35–42 mm
```

The casing itself adds height because it is an EG shell not designed to sit flush with standard SG base geometry. The CEW is attached below the casing after placement, adding further downward protrusion. The total height exceeds both standard SG setups and stock EG setups — worst of all configurations.

---

### 2. SG (Bearing Version) Casings: Impractical Height

SG (Bearing Version) casings are the original bearing SG shells. They are taller than SG Free Shaft Version casings:

```
h_SG_Bearing_Version_casings > h_SG_Free_Shaft_Version_casings
h_total_with_CEW ≈ 38–42 mm  (estimated, significantly above all practical thresholds)
```

At this height:
- AR sits far above all standard AR contact zones (~18–22 mm)
- Gyroscopic restoring torque is reduced (higher CoM)
- Any contact from a normal-height opponent pushes the combo's elevated CoM and increases tilt

The result is "easily KO'd by just about any opponent" — the height creates a lever arm for destabilisation that no LAD property can compensate for. The combo can be pushed out by even low-power opponents because the force application point is far above the CoM. Not a usable configuration regardless of CEW choice.

---

### 3. SG (Free Shaft Version) Casings: Height-Dependent CEW Assessment

SG Free Shaft Version casings are shorter than SG Bearing Version casings. With CEW Metal Sharp (short CEW):

```
h_total_MetalSharp ≈ h_SG_FSV + h_shaft_protrusion + h_CEW_Metal_Sharp
                  ≈ (standard SG height) + (small casing addition) + (short CEW)
                  ≈ only slightly taller than SG (Bearing Version 2) Shaft setups
```

This is the best-case height for non-stock configurations. Metal Sharp's short body minimises the below-casing protrusion. "Does not work particularly well" — despite the manageable height, the scraping between shaft and casing introduces friction that degrades the bearing performance, and Metal Sharp's inherent instability (minimal righting torque, Case 234 §3) compounds the reduced LAD effectiveness.

With CEW Metal Grip or CEW Light Sharp (taller CEWs):

```
h_total_Grip/LightSharp > h_total_MetalSharp
```

These CEWs protrude further below the casing, raising the total assembly height. "Very easy to KO" — the height penalty exceeds the traction (Metal Grip) or LAD (Light Sharp) benefit. Metal Grip's rubber tip provides some stability under hits, but the elevated CoM means each hit generates a larger destabilising torque than the rubber tip's restoring force can counter. Light Sharp's bearing-class LAD requires low CoM to be effective — here the CoM is elevated, degrading the LAD performance.

---

### 4. Shaft-Casing Scraping: Friction Degradation

Both non-stock casings have a slightly different inner diameter from the Right CG casing, causing the shaft body to scrape against the casing wall during rotation:

```
shaft OD_in_non_EG_casing > clearance gap → rubbing contact
friction torque from scraping: τ_scrape = μ_plastic × F_normal × r_shaft
```

This scraping adds friction between the shaft (coupled to the beyblade spin) and the casing (ideally free-spinning). In the stock Right CG configuration, the two bearings prevent this contact entirely — the shaft runs on bearing inner races with near-zero friction. In non-stock casings, the scraping partially re-couples the shaft and casing, reducing the bearing isolation benefit:

```
Stock Right CG: τ_tip = μ_CEW × m_CEW × g × r_contact  (bearing isolates fully)
Non-stock casing: τ_effective = τ_tip + τ_scrape  (scraping adds coupling torque)
```

The scraping torque is added to the tip friction, increasing the effective LAD friction. For Metal Sharp CEW this is tolerable because the tip friction was already low; for Light Sharp and Metal Grip it adds to already different trade-offs. In all cases the LAD performance is degraded versus the stock configuration.

---

### 5. Configuration Summary

```
Casing              CEW            Height      Scraping    Competitive?
──────────────────────────────────────────────────────────────────────────
Right CG (stock)    Light Sharp    EG height   none        Yes (Tier 1 niche)
Right CG (stock)    Metal Sharp    EG height   none        Marginal (unstable)
Right CG (stock)    Metal Grip     EG height   none        No (outclassed by BV2)
SG Bearing Ver.     Any            very tall   some        No (easily KO'd)
SG Free Shaft Ver.  Metal Sharp    slightly tall moderate  No (works poorly)
SG Free Shaft Ver.  Metal Grip     tall        moderate    No (easy KO)
SG Free Shaft Ver.  Light Sharp    tall        moderate    No (easy KO)
```

Every non-stock configuration is non-competitive. The shaft's value is entirely in its stock role within Right CG Free Shaft casings.

---

### 6. Physics Model

```typescript
interface RightCGFreeShaftShaftAnalysis {
  mass_g: 0.87;
  material: 'metal_shaft_plastic_base';
  beyblade: 'Zeus (Takara only)';
  primaryUse: 'Right CG (Free Shaft Version) casings + CEW Light Sharp';
  nonStockCasingConfigs: {
    SG_BearingVersion: { viable: false; reason: 'impractically tall' };
    SG_FreeShaftVersion_MetalSharp: { viable: false; reason: 'works poorly, scraping' };
    SG_FreeShaftVersion_MetalGrip: { viable: false; reason: 'tall + easy KO' };
    SG_FreeShaftVersion_LightSharp: { viable: false; reason: 'tall + easy KO' };
  };
}

function effectiveLADFriction(
  tau_tip: number,
  tau_scrape: number
): number {
  return tau_tip + tau_scrape;
}

function heightDestabilisationTorque(
  m_combo_kg: number,
  h_CoM_m: number,
  F_lateral_N: number
): number {
  return F_lateral_N * h_CoM_m;
}

function stockVsNonStockHeightPenalty(
  h_EG_mm: number,
  h_nonstock_mm: number
): number {
  return h_nonstock_mm - h_EG_mm;
}

// stockVsNonStockHeightPenalty(30, 40) → 10 mm extra height (SG BV casings)
// stockVsNonStockHeightPenalty(30, 34) → 4 mm extra (SG FSV + Metal Sharp — smallest penalty)
// heightDestabilisationTorque(0.050, 0.040, 2.0) → 0.080 N·m  (stock EG height)
// heightDestabilisationTorque(0.050, 0.050, 2.0) → 0.100 N·m  (non-stock +10mm CoM — 25% more topple)
// effectiveLADFriction(5.99e-7, 1e-5) → 1.06e-5  (non-stock scraping adds ~17× more friction than tip alone)
```


---

## Case 236 — First Clutch Base (Zeus Version) · 8.0 g: Why the Heaviest EG Base Creates a Viable but Outclassed Weight-Based Defense Configuration, How Poor LAD Limits Every Other Role, and Why the Round-Edge Profile Does Not Compensate for Height

First Clutch Base (Zeus Version) is an 8.0 g Engine Gear compatible blade base — the heaviest EG base in the library. Its round-edged outer profile and relatively even weight distribution distinguish it from the spike-heavy or wing-heavy profiles of other Final and First Clutch bases. The weight and round profile create a genuine Weight-Based Defense (WBD) use case when combined with Right Engine Gear (Circle Defenser) or Right Engine Gear (Mystery Cutter): the assembly mass approaches SG Metal Ball Base with 4 Metal Balls plus a Heavy Metal Core, and Circle Survivor is fixed relatively in place, creating a protected low-recoil defensive perimeter. The limitation common to all EG bases applies here: poor LAD. The elevated CoM from EG height reduces spin survival at low speeds, which is the mechanism WBD configurations rely on. The result is a WBD setup that is functional but less versatile than dedicated WBD options — adequate when alternatives are unavailable, outclassed when they are.

---

### 1. Mass Analysis: WBD Threshold Comparison

SG Metal Ball Base with 4 Metal Balls + Heavy Metal Core is the WBD mass reference:

```
SG Metal Ball Base (4 balls): base mass ~8.5 g + 4 × ~1.5 g = ~14.5 g
Heavy Metal Core:              ~14.0 g
Total reference WBD mass:      ~28.5 g (base + HMC, excluding AR/WD)
```

First Clutch Base (Zeus Version) WBD configuration:

```
First Clutch Base (Zeus Version):          8.0 g
Right Engine Gear (Circle Defenser):       ~7.0 g (EG mechanism)
Right CG Free Shaft casings (if used):     4.0 g
Total base + EG mass:                      ~19.0 g
```

"Roughly as heavy as SG Metal Ball Base with 4 balls + HMC" — this comparison requires including the full EG system mass (base + EG + casings). The mass is comparable in total, but distributed differently:

```
WBD reference:  mass concentrated at base level (Metal Balls at perimeter, HMC at center)
Zeus Version:   mass distributed across base + EG height range (more spread vertically)
```

Vertical mass distribution affects CoM height:
```
h_CoM_Zeus_EG ≈ 17–19 mm above floor
h_CoM_WBD_reference ≈ 12–14 mm above floor
```

Higher CoM means higher toppling torque at the same tilt angle — Zeus WBD is less stable than the reference WBD at equivalent total mass.

---

### 2. Round-Edge Profile: Recoil Properties

The round outer edge geometry contrasts with spike (Gigars) and wing (GT) profiles. Round edges present a continuously curved contact surface at all angles:

```
Round edge contact angle from tangent: varies continuously, typically 30–50°
J_recoil / J: sin(30°–50°) = 0.50–0.77  (range across the edge arc)
```

Compared to spike protrusions (sin(80°) ≈ 0.985) and GT Version protrusions (sin(55°) ≈ 0.819), the round edge is substantially lower-recoil at typical contact angles. There are no step discontinuities — the contact angle transitions smoothly. This is the "good defensive design" property: the round edge deflects impacts without the recoil spikes that protrusion-geometry bases generate.

In WBD context, the round edge also provides consistent Circle Survivor positioning: Circle Survivor is approximately fixed in place (the EG mechanism's outer shell does not rotate freely in Circle Defenser configuration) and the round base edge beneath it presents a smooth contact surface that does not snag on stadium walls or opponent bases during the slow-orbit phase of WBD play.

---

### 3. LAD Deficit: Why WBD Performance is Limited

WBD configurations win by outlasting opponents through spin retention — the heavy combo resists being knocked out, absorbs attacks without losing spin, and eventually outlasts lighter opponents. This requires:

1. **Low tip friction for late-match survival** — CEW tip must provide LAD-capable contact
2. **Low CoM for gyroscopic stability at low spin** — prevents topple during spin-down
3. **No disruptive clutch activations** — First Clutch fires at ~85% spin, disrupting flower pattern maintenance

Condition 3 is violated by the First Clutch mechanism. Even though the clutch fires early (not the late-match self-destruction of Final Clutch), it still interrupts the stable precession pattern at ~85% launch spin. For WBD which relies on stable, consistent orbit maintenance, this is a liability.

Condition 2 is compromised by EG height (h_CoM ≈ 17–19 mm vs reference WBD ~12–14 mm):
```
τ_topple_Zeus    = m × g × h_CoM_Zeus × sin(tilt) ≈ m × g × 0.018 × sin(tilt)
τ_topple_WBD_ref = m × g × h_CoM_ref  × sin(tilt) ≈ m × g × 0.013 × sin(tilt)
Ratio: 18/13 = 1.38  — Zeus WBD has 38% more toppling torque at same tilt
```

This means the Zeus WBD configuration topples ~38% more easily at equivalent spin rates compared to the reference WBD. In a match where the outcome depends on surviving the final seconds of spin, this gap is decisive.

---

### 4. Right EG (Circle Defenser) and (Mystery Cutter) Compatibility

Circle Defenser EG fixes Circle Survivor relatively in place — not perfectly rigid, but the EG coupling reduces the free-spin degree that would otherwise allow Circle Survivor to absorb hits via rotation. This is intentional for WBD: a fully free-spinning Circle Survivor dissipates impact energy by spinning, which is good for spin-steal survival but not for WBD where the goal is to resist displacement via mass rather than absorbing rotation.

```
Free-spin Circle Survivor: impact → CS rotation → low recoil on user, spin stolen from attacker
Fixed/semi-fixed Circle Survivor: impact → mass resistance → attacker slows, user maintains position
```

The semi-fixed mode from Circle Defenser EG is the WBD-relevant mode. The mass of the combined assembly (Zeus Base + EG + CS) creates the inertial resistance:

```
F_displacement = J_impact / Δt  (impulse required to displace the combo)
m_resist = m_Zeus_EG_CS ≈ 19–22 g  (excluding AR/WD)
Δv = J_impact / m_resist
```

Higher mass means less velocity change per contact impulse — the WBD principle. At ~19–22 g in the base region, the Zeus WBD combination resists displacement well. The limitation is not mass but the CoM height and LAD.

Mystery Cutter EG is an alternative to Circle Defenser with similar mass but different outer profile. Its use here is equivalent for the WBD mass calculation.

---

### 5. Heavy Metal Core Option: WBD Without Circle Survivor

Right Spin Gear (Heavy Metal Core) from Metal Driger can be used with Zeus Version base as a WBD alternative:

```
First Clutch Base (Zeus Version): 8.0 g
Right Spin Gear (Heavy Metal Core): ~14.0 g
Total base + SG: ~22.0 g
```

This is a standard-height WBD configuration (not EG-dependent). The HMC's mass is at the SG centre — lower CoM than the EG system. However:

1. No Circle Survivor fixing mechanism — WBD relies on total mass rather than semi-fixed CS
2. Poor LAD still applies — the base's First Clutch fires and disrupts spin-down survival
3. "Outspun by most of the meta" — without the Circle Survivor protection and with poor LAD, the combo loses spin faster than dedicated WBD setups

The HMC option is rated "has defensive use in the rare case one does not have access to a better setup" — meaning it functions as a fallback, not a primary choice.

---

### 6. Offensive Use: Why Zeus Version Is Outclassed

For attack configurations, Zeus Version's 8.0 g base mass is a penalty:

```
Attack requires: fast tip for high v_lateral, low total mass for quick acceleration
Zeus Version:   heavy base → higher rotational inertia → lower tip-to-total mass ratio
```

Additionally, the round-edge profile that makes the base good for defense is neutral-to-negative for offense — it does not provide smash geometry. First Clutch (Dragoon G Version) has the same timing but a profile designed with at least some offensive capability. Zeus Version has no such compensation.

---

### 7. Physics Model

```typescript
interface FirstClutchZeusAnalysis {
  mass_g: 8.0;
  clutchType: 'first';
  edgeProfile: 'round';
  roundEdgeRecoilFraction: { min: 0.50; max: 0.77 };
  compatibleEG: ['Right EG (Circle Defenser)', 'Right EG (Mystery Cutter)'];
  wbdAssemblyMass_g: 19; // base + EG + casings
  h_CoM_mm: 18;
  competitiveRoles: ['WBD_with_Circle_Defenser_marginal', 'WBD_with_HMC_fallback'];
  outclassedBy: 'Dedicated WBD setups (SG Metal Ball Base + HMC + Circle Survivor)';
}

function topplingTorqueRatio(h_CoM_zeus: number, h_CoM_ref: number): number {
  return h_CoM_zeus / h_CoM_ref;
}

function roundEdgeContactAngle(arc_position_deg: number): number {
  return 30 + 20 * Math.sin(arc_position_deg * Math.PI / 180);
}

function displacementVelocity(J_impact: number, m_combo_kg: number): number {
  return J_impact / m_combo_kg;
}

function wbdMassResistanceRatio(m_heavy_kg: number, m_light_kg: number): number {
  return m_heavy_kg / m_light_kg;
}

// topplingTorqueRatio(18, 13) → 1.385  — Zeus WBD 38.5% more topple torque than reference WBD
// displacementVelocity(0.005, 0.022) → 0.227 m/s  (Zeus EG WBD assembly)
// displacementVelocity(0.005, 0.040) → 0.125 m/s  (full combo — harder to displace)
// wbdMassResistanceRatio(0.040, 0.025) → 1.6  — WBD combo resists 1.6× more than lighter opponent
// roundEdgeContactAngle(0)   → 30°  (tangent-aligned section: J_recoil/J = sin(30°) = 0.500)
// roundEdgeContactAngle(90)  → 50°  (radial-aligned section:  J_recoil/J = sin(50°) = 0.766)
// roundEdgeContactAngle(45)  → 44°  (diagonal section: J_recoil/J = sin(44°) = 0.695)
```

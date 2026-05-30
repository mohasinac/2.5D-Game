# INDEX_C Gap Fill — Cases 1376–1380, 1498–1524, 1546–1573

---

### [Case 1376 — Energy Layer: Arc Bahamut (Burst God)](./9%20case%20study.md#case-1376)

**System**: Burst God / left-spin defense  
**Geometry**: 12.7 g · r_i 1.5 cm · r_o 4.0 cm · 3-tooth ratchet · 6 CW-oriented blades · 6 centrifugally-deployable sub-layer segments extending to r ≈ 2.5 cm at burst threshold  
**Material**: ABS plastic (high-grade, navy) · μ not explicitly stated  
**Spin Coupling**: rigid (left-spin layer; free-spin via Atomic tip handled at tip level)  
**Contact Points**: r_o 4.0 cm · rounded trailing-face geometry (CW blades on LS layer) · recoil-deflecting vs RS opponents  
**Movement Freedom**: sub-layer deployable (gap-filling at 3/4 burst advancement)  
**Base Stats**: Attack — low; Defense — A-tier (opposite-spin); Stamina — S-tier (with Atomic); Burst resist — B-tier same-spin  
**Mechanism**: Left-spin anti-burst reaction — RS impacts advance ratchet TOWARD locked position, providing passive re-tightening. Sub-layer extends to cover inter-blade gaps under sustained pressure, reducing peak contact stress by ~50%. 3 short teeth compensated by LS anti-burst reaction + Atomic dampening.  
**2.5D Rendering**: perimeter blades at r_o 4.0 cm · sub-layer ring visible at r ≈ 2.5 cm in extended mode  
**Gimmick**: centrifugal sub-layer gap-fill → MechanicRegistry: `centrifugal_mode_change` (threshold ω trigger, burst-zone reactive)  
**Engine Note**: I = 1.157×10⁻⁵ kg·m² · anti-burst torque direction reversal for LS vs RS matchups; sub-layer activation at burst threshold fraction 0.75

---

### [Case 1377 — Forge Disc: 2 (Burst God)](./9%20case%20study.md#case-1377)

**System**: Burst God / Forge Disc  
**Geometry**: 21.21 g · r_i 0.6 cm · r_o 4.0 cm · symmetrical elliptical · even-number (accepts Frame attachment)  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: none — disc-level contact rare at standard tip heights  
**Movement Freedom**: fixed (accepts Bump or other Frames via tab+socket)  
**Base Stats**: neutral across all types; 51.3% of assembly L in Arc Bahamut 2Bump Atomic  
**Mechanism**: Jack-of-all-trades disc — symmetrical mass distribution, no preferred attack axis. Even-numbered design enables Frame pairing. Average weight in Burst God Core Disc range (lighter than 0/00, heavier than 4).  
**2.5D Rendering**: elliptical silhouette at r_o 4.0 cm · smooth perimeter  
**Gimmick**: none  
**Engine Note**: I = 1.734×10⁻⁵ kg·m² · L fraction 51.3% of Arc Bahamut 2Bump Atomic at ω₀ = 700 rad/s

---

### [Case 1378 — Disc Frame: Bump (Burst God)](./9%20case%20study.md#case-1378)

**System**: Burst God / Disc Frame  
**Geometry**: 3.27 g · r_i 3.5 cm · r_o 4.0 cm · 16 hemispherical bumps at 22.5° spacing · bump height h ≈ 1.5 mm  
**Material**: ABS plastic  
**Spin Coupling**: rigid (mounted on Disc 2)  
**Contact Points**: 16 point-contact bumps at r_o 4.0 cm · elevated normal force during grazing contact  
**Movement Freedom**: fixed  
**Base Stats**: attack potential above Glaive/Cross; aerodynamic drag ΔC_D ≈ +6% vs Glaive  
**Mechanism**: Bumps create rough outer perimeter → higher friction transfer on lateral contact → improved spin-off capability. Paired with Disc 2 for added attack surface. Minor stamina penalty vs smooth frames.  
**2.5D Rendering**: ring silhouette at r_o 4.0 cm with 16 bump protrusions  
**Gimmick**: none (passive rough surface)  
**Engine Note**: I = 4.619×10⁻⁶ kg·m² · dmg contact modifier from rough perimeter geometry

---

### [Case 1379 — Performance Tip: Atomic (Burst God)](./9%20case%20study.md#case-1379)

**System**: Burst God / Performance Tip  
**Geometry**: 8.8 g · free-rotating polycarbonate ball r_ball 0.7 cm · four-tab free-spinning outer ring r_tab 1.2 cm · body height ~10.5 mm  
**Material**: ABS body + polycarbonate ball + ABS four-tab ring  
**Spin Coupling**: ball free-rotates (decoupled from assembly spin); tab ring free-spins  
**Contact Points**: ball (primary, battle phase) μ_roll ≈ 0.02 at r 0.7 cm; four-tab ring (LAD phase, ω < 280 rad/s) μ ≈ 0.08 at r 1.2 cm  
**Movement Freedom**: ball free-rotating; ring free-spinning  
**Base Stats**: Stamina — best-in-class; t_stall = 374 s on Arc Bahamut assembly  
**Mechanism**: Free-rotating ball absorbs impact torque spikes, reducing ratchet advancement rate per collision. Ball decouples rotational impulse pathway to ratchet. Four-tab LAD ring activates during wobble phase for life-after-death extension. Three Hasbro variants: V1 μ≈0.05, V2 ≈0.02 (matches TT), V3 μ_mixed ≈0.10.  
**2.5D Rendering**: ball tip protrudes ~3 mm below housing · tab ring visible at r 1.2 cm  
**Gimmick**: free-rotating ball + LAD ring → MechanicRegistry: `free_spin_tip` + `lad_ring`  
**Engine Note**: I_eff (excl. decoupled ball) = 2.453×10⁻⁷ kg·m² · τ_roll = μ_ball × m × g × r_ball; LAD tab torque = 0.08 × m × g × 0.012

---

### [Case 1380 — Full Assembly: Arc Bahamut 2Bump Atomic (Burst God)](./9%20case%20study.md#case-1380)

**System**: Burst God / left-spin defense assembly  
**Geometry**: total 45.98 g · ω₀ 700 rad/s (LR String Launcher)  
**Material**: see component cases  
**Spin Coupling**: rigid (assembly) · ball and LAD ring decoupled at tip  
**Contact Points**: Arc Bahamut r_o 4.0 cm rounded blades; Bump Frame 16× bumps at 4.0 cm  
**Movement Freedom**: sub-layer deployable; Atomic ball/ring free-spinning  
**Base Stats**: Attack — D; Defense — A (opposite-spin); Stamina — S (t_stall 374 s); Speed — low (center-seeking tendency)  
**Mechanism**: Composite spin-retention and opposite-spin defense build. LS anti-burst reaction from RS opponents. Atomic ball friction τ = 6.316×10⁻⁵ N·m → dω/dt 1.869 rad/s² → t_stall 374.5 s. LAD phase (ω < 280): tab ring engages for additional 21.8 s. Opposite-spin v_rel = 31.92 m/s at ω_battle 420 rad/s → LS ratchet pushed TOWARD locked position.  
**2.5D Rendering**: Arc Bahamut outer profile at 4.0 cm · Bump bumps visible · Atomic ball protrusion at tip  
**Gimmick**: see Cases 1376 + 1379 gimmicks; assembly amplifies both  
**Engine Note**: I_total = 3.380×10⁻⁵ kg·m² · L₀ = 2.366×10⁻² N·m·s · spinDecayRate = 1.869 rad/s² · LAD onset 280 rad/s; LS burst-direction reversal flag required

| Component | L fraction |
|-----------|-----------|
| Arc Bahamut | 34.2% |
| Forge Disc 2 | 51.3% |
| Frame Bump | 13.7% |
| Atomic (eff.) | 0.7% |

---

<!-- Case 1498: not found in CS13 or CS9 -->

<!-- Case 1499: not found in CS13 or CS9 -->

---

### [Case 1500 — Face Bolt: Aquario (MFB Metal Fusion)](./9%20case%20study.md#case-1500)

**System**: Metal Fusion Beyblade / Metal System first generation · BB-21  
**Geometry**: ~1.2 g · r ≈ 0 (center piece) · excluded from assembly I calculations  
**Material**: ABS plastic  
**Spin Coupling**: rigid (static Face Bolt)  
**Contact Points**: none (center, r ≈ 0)  
**Movement Freedom**: fixed  
**Base Stats**: cosmetic only; per convention I_FB ≈ 0  
**Mechanism**: Center-piece mass exclusion per convention. Depicts Aquarius zodiac motif. "AQRO" on TT release; Hasbro omits text on some variants; Cyber Aquario uses abstract water-drop motif.  
**2.5D Rendering**: Face Bolt plate at center; not rendered in physics model  
**Gimmick**: none  
**Engine Note**: mass excluded from assembly weight; I contribution negligible

---

### [Case 1501 — Metal Wheel: Aquario (MFB Metal Fusion)](./9%20case%20study.md#case-1501)

**System**: Metal Fusion Beyblade / Metal System  
**Geometry**: 27.0 g (est.) · r_i 0.7 cm · r_o 3.7 cm · 4 textured wave fins · trailing-face orientation (fins point opposite to spin) · hollow semicircular cutouts between fins  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: r_o 3.7 cm · convex trailing surface · e ≈ 0.45–0.55 (glancing) vs e ≈ 0.65–0.70 for flat leading-face  
**Movement Freedom**: fixed  
**Base Stats**: Attack — mediocre (~33% of equivalent aggressive wheel); Defense — poor; Stamina — poor (ΔC_D ≈ +30–40% vs circular disc)  
**Mechanism**: Trailing-face fin design — convex backs face direction of travel → glancing deflection rather than clean impact. Recoil impulse reduced 30–40% vs aggressive wheel. Hollow semicircles reduce aerodynamic profile but harm perimeter mass uniformity. Introductory/casual use only.  
**2.5D Rendering**: 4-fin silhouette at r_o 3.7 cm · hollow gaps between fins  
**Gimmick**: none  
**Engine Note**: I = 1.914×10⁻⁵ kg·m² (annular, hollow cutouts reduce to ~85–90% of formula; value used as calculated); smash coefficient ≈ 45% of dedicated attack wheel

---

### [Case 1502 — Spin Track: 105 (MFB Metal Fusion)](./9%20case%20study.md#case-1502)

**System**: Metal Fusion Beyblade  
**Geometry**: 1.0 g (est.) · height 10.5 mm · r_track ≈ 0.4 cm · slim cylindrical · 4th lowest in lineup  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: none (track, no floor-scrape risk at this height)  
**Movement Freedom**: fixed  
**Base Stats**: no competitive niche — neither optimal low-profile for attack (85–100 preferred) nor unique height benefit  
**Mechanism**: Standard height track. No gimmick mass or geometry benefit. Weakest contributing factor of Aquario 105F assembly — all competitive builds should substitute 85 or 90.  
**2.5D Rendering**: slim cylinder h 1.05 cm · z-layer positioning  
**Gimmick**: none  
**Engine Note**: I = 1.70×10⁻⁸ kg·m² (negligible) · CoM height effect: 85 is ~19% more stable against lateral topple vs 105

---

### [Case 1503 — Performance Tip: Flat (F) (MFB Metal Fusion)](./9%20case%20study.md#case-1503)

**System**: Metal Fusion Beyblade  
**Geometry**: 0.8 g (est.) · r_contact 0.3 cm · contact area 28.3 mm²  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: flat circular face r 0.3 cm · μ_k 0.22 (ABS on rubber-mat MFB stadium)  
**Movement Freedom**: fixed  
**Base Stats**: mobility — excellent for attack; stamina — poor; controlled pattern — inferior to RF  
**Mechanism**: High friction × large contact area → strong lateral force → aggressive, erratic circular movement. Tends toward chaotic wide orbits rather than neat flower pattern of Rubber Flat. Budget/casual attack when RF unavailable.  
**2.5D Rendering**: flat disc tip at r 0.3 cm  
**Gimmick**: none  
**Engine Note**: I = 3.6×10⁻⁹ kg·m² (negligible) · τ = 0.22 × m × g × 0.003 · movement: wandering wide pattern

---

### [Case 1504 — Full Assembly: Aquario 105F (MFB Metal Fusion)](./9%20case%20study.md#case-1504)

**System**: Metal Fusion Beyblade / introductory attack  
**Geometry**: total 32.3 g · ω₀ 500 rad/s (standard Beylauncher ripcord)  
**Material**: see component cases  
**Spin Coupling**: rigid  
**Contact Points**: Aquario Wheel trailing fins at r_o 3.7 cm; θ_approach ≈ 15° glancing  
**Movement Freedom**: fixed  
**Base Stats**: Attack — mediocre (~33% of aggressive wheel); Defense — poor; Stamina — 49.1 s  
**Mechanism**: Beginner/introductory attack combo. All components underperform competitive alternatives. Flat tip aggressive movement but chaotic pattern. t_stall = 49.1 s. Impact impulse Δp ≈ 0.139 N·s/hit vs 0.418 N·s for equivalent aggressive wheel.  
**2.5D Rendering**: Aquario 4-fin silhouette · slim 105 track · flat tip  
**Gimmick**: none  
**Engine Note**: I_total = 2.054×10⁻⁵ kg·m² · L₀ = 1.027×10⁻² N·m·s · dω/dt = 10.18 rad/s² · t_stall 49.1 s · fin contact delivers ~33% of aggressive wheel smash output

---

### [Case 1505 — Shogun Face Bolt: Byakko (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1505)

**System**: Beyblade Zero-G (Shogun Steel) · **STATUS: PROTOTYPE — cancelled 2013, never officially released**  
**Geometry**: ~6.0 g total (Stone Face center ~3.0 g excluded; outer metal ring ~3.0 g at r_ring ≈ 1.1 cm included)  
**Material**: ABS Stone Face + zinc alloy outer ring  
**Spin Coupling**: rigid  
**Contact Points**: none (face/center component)  
**Movement Freedom**: fixed; asymmetric construction accommodates Synchrome dual-WW stacking  
**Base Stats**: contributes 10.9% of assembly L in Berserker Byakko 125S  
**Mechanism**: White Tiger of the West (Byakko/Whiger) mythological motif. Unlike standard MFB Face Bolts, the thick outer metal ring sits at non-trivial radius r_ring ≈ 1.1 cm and is included in assembly calculations. Asymmetric construction (not symmetric like MFB beys) accommodates Synchrome.  
**2.5D Rendering**: outer ring at r 1.1 cm · Stone Face center excluded  
**Gimmick**: none  
**Engine Note**: I_ring = 3.63×10⁻⁶ kg·m² (outer ring only; stone face excluded per convention) · prototype status means physical tolerances may differ from production spec

---

### [Case 1506 — Warrior Wheel: Byakko (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1506)

**System**: Beyblade Zero-G · **PROTOTYPE**  
**Geometry**: ~31.0 g (est.) · r_i 0.8 cm · r_o 4.2 cm · C3 symmetry · 3 wing-pairs at 120° · 4 sloped layers per wing · 12 distinct contact edges  
**Material**: zinc alloy die-cast · blue stickers  
**Spin Coupling**: rigid (single-WW configuration lacks Synchrome stack rigidity)  
**Contact Points**: 4 sloped layers per wing → step-deflection geometry; 12 contact edges per revolution  
**Movement Freedom**: fixed (single-WW; designed for Synchrome two-WW stacking)  
**Base Stats**: Stamina type; 85.4% of assembly L in Berserker Byakko 125S  
**Mechanism**: C3 asymmetry: 4 sloped wing layers create non-zero products of inertia I_xz/I_yz → principal axes tilted from geometric spin axis → torque-free precession wobble onset at ω < ~300 rad/s. Step-deflection geometry intended to shed recoil laterally. Single-WW lacks Synchrome rigidity.  
**2.5D Rendering**: 3-wing silhouette at r_o 4.2 cm · tiered layer profile visible  
**Gimmick**: none active (Synchrome gimmick requires second WW)  
**Engine Note**: I = 2.834×10⁻⁵ kg·m² · C3 axial asymmetry → early wobble onset modeling; nutation amplitude ~1–2° at ω 200 rad/s

---

### [Case 1507 — Element Wheel: Berserker (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1507)

**System**: Beyblade Zero-G  
**Geometry**: 4.5 g · r_i 0.8 cm · r_o 2.2 cm · chain/boulder motif · irregular outer profile  
**Material**: ABS plastic (dark green)  
**Spin Coupling**: rigid  
**Contact Points**: irregular "boulder" orb protrusions at r_o 2.2 cm · aerodynamic drag penalty  
**Movement Freedom**: fixed (faces inward in Synchrome → shape irrelevant in stacked use)  
**Base Stats**: structural only (~3.7% of assembly I); outclassed in all performance categories by Warrior Wheels  
**Mechanism**: All Element Wheels outclassed by Warrior Wheels. In Synchrome (two WW), the EW faces inward where shape has no combat effect. In single-WW Berserker Byakko 125S, it completes the spin system without contributing meaningfully to performance.  
**2.5D Rendering**: ring silhouette at r_o 2.2 cm · boulder-orb protrusion texture  
**Gimmick**: none  
**Engine Note**: I = 1.233×10⁻⁶ kg·m² · 3.7% of assembly I; no attack or defense contribution modeled

---

### [Case 1508 — Spin Track: 125 (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1508)

**System**: Beyblade Zero-G  
**Geometry**: 1.3 g · height 12.5 mm · midpoint between 105 and 145  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: none  
**Movement Freedom**: fixed  
**Base Stats**: balance height — more stable than 145 under attack; higher clearance than 105; good for stamina  
**Mechanism**: Mid-height balance for stamina: Warrior Wheel face clears stadium floor, lower CoM than 145 combos → tighter stability window. Declines competitively once T125/D125 available (those add mass and aerodynamic/defense profiles plain 125 cannot match).  
**2.5D Rendering**: cylinder h 1.25 cm  
**Gimmick**: none  
**Engine Note**: I = 2.925×10⁻⁸ kg·m² (negligible) · CoM height 1.25 cm contributes to tipping moment calculations

---

### [Case 1509 — Performance Tip: Spike (S) / Sharp (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1509)

**System**: Beyblade Zero-G  
**Geometry**: 0.6 g · pointed conical tip · r_contact ≈ 0.10 cm (modeled; true apex sharper)  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: near-frictionless pivot · μ_S ≈ 0.05 · near-stationary bey behaviour  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — near-optimal pivot (lowest friction in Zero-G library); Stability — vulnerable to lateral destabilization  
**Mechanism**: Point contact approximates frictionless pivot → near-stationary centre-holding in Zero-G bowl. τ = 0.05 × m × g × 0.001. Small r_contact + large h_CoM (at 125 height) → severe tipping tendency from any lateral force. Outclassed by D tip for most use.  
**2.5D Rendering**: sharp cone tip extending below housing  
**Gimmick**: none  
**Engine Note**: I = 3.0×10⁻¹⁰ kg·m² (negligible) · τ = 1.981×10⁻⁵ N·m → dω/dt 0.597 rad/s² · t_stall 837.5 s (flat); t_stall_ZG ~879 s

---

### [Case 1510 — Full Assembly: Berserker Byakko 125S (Zero-G / Shogun Steel)](./9%20case%20study.md#case-1510)

**System**: Zero-G / Shogun Steel · **PROTOTYPE — cancelled, never commercially released**  
**Geometry**: total 40.4 g · ω₀ 500 rad/s (standard Beylauncher)  
**Material**: see component cases  
**Spin Coupling**: rigid  
**Contact Points**: Byakko WW 4-layer step-deflection profile at r_o 4.2 cm  
**Movement Freedom**: fixed (Spike tip near-stationary)  
**Base Stats**: Stamina — very high (t_stall_ZG ~879 s theoretical flat; ~8–12 min practical); Stability — vulnerable (Spike, tall CoM, C3 wobble); Burst resist — weak (EW provides none; single-WW, no Synchrome rigidity)  
**Mechanism**: High-stamina prototype. Spike provides lowest-friction contact in Zero-G library. C3 axial asymmetry from Byakko's 4-layer wings → premature wobble at ω < 300 rad/s. Zero-G stadium 17.5° tilt: Spike keeps bey at bowl centre where tilt force is minimal.  
**2.5D Rendering**: Byakko 3-wing profile at r_o 4.2 cm · 125 height · Spike cone tip  
**Gimmick**: none functional (Synchrome requires second WW)  
**Engine Note**: I_total = 3.320×10⁻⁵ kg·m² · L₀ = 1.660×10⁻² N·m·s · dω/dt = 0.597 rad/s² · C3 wobble onset ~300 rad/s; prototype: physical tolerances uncertain

| Component | L fraction |
|-----------|-----------|
| Warrior Wheel Byakko | 85.4% |
| SFB outer ring | 10.9% |
| Element Wheel Berserker | 3.7% |

---

### [Case 1511 — Energy Layer: Shelter Regulus (Burst God)](./9%20case%20study.md#case-1511)

**System**: Burst God / Balance  
**Geometry**: 13.4 g · r_i 1.5 cm · r_o_retracted 3.8 cm · r_o_extended 4.2 cm · ratchet teeth weak (short) · square perimeter profile · 4 centrifugal claws (2 lion heads + 2 lion claws)  
**Material**: ABS plastic + metal God Layer chip  
**Spin Coupling**: rigid  
**Contact Points**: square corner protrusions at r_o ≈ 3.8–4.2 cm · α ≈ 45° contact angle · recoil 8.1× amplified vs circular layer  
**Movement Freedom**: claws deployable (extend to r 4.2 cm at high spin; retract at ω < 200 rad/s)  
**Base Stats**: Burst resist — poor (short weak teeth, square recoil); Attack — low; Stamina — hampered by recoil losses  
**Mechanism**: Centrifugal claw extension/retraction. At high spin (Attack Mode): claws extend to r 4.2 cm, wider profile. At low spin (Defense Mode): claws retract, gaps partially reduced. Square-perimeter recoil problem persists in BOTH modes — F_N = F_contact × sin(45°) vs circular sin(5°) = 8.1× recoil amplification. ΔI at transition = 6.4×10⁻⁷ kg·m² (1.86% — negligible). Spin gain at retraction: +5.2% (unobservable in practice).  
**2.5D Rendering**: square outer profile at r_o 3.8–4.2 cm · 4 lion-head/claw protrusions  
**Gimmick**: centrifugal claw extension → `centrifugal_mode_change` (k_spring ≈ 200 N/m estimated)  
**Engine Note**: I_retracted = 1.240×10⁻⁵; I_extended = 1.304×10⁻⁵ kg·m² · burst threshold torque ~3 mN·m (weak); square recoil 8.1× amplifier → N_burst ≈ 2–4 hits against hard attackers

---

### [Case 1512 — Forge Disc: 5 (Burst God)](./9%20case%20study.md#case-1512)

**System**: Burst God / Forge Disc  
**Geometry**: 22.0 g · r_i 0.6 cm · r_o 3.8 cm · odd-numbered (asymmetrical elliptical) · 2 protrusions one side, 3 the other (mass-balanced) · "5"/"IV"-shaped molded protrusions  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: none (standard disc — layer contact rare at tip heights)  
**Movement Freedom**: fixed (accepts Frame via Frame accommodation slots)  
**Base Stats**: comparable stamina/defense to Disc 4; 47.8% of assembly L in Shelter Regulus 5Star Tower  
**Mechanism**: Despite visual asymmetry, mass-balanced disc. Resembles reversed Disc 4. High OWD supports KO resistance and stable LAD wobble. Paired with Glaive or Cross Frame achieves high stamina potential.  
**2.5D Rendering**: elliptical silhouette at r_o 3.8 cm · numeral-5-shaped protrusion details  
**Gimmick**: none  
**Engine Note**: I = 1.628×10⁻⁵ kg·m² · L fraction 47.8% of Shelter Regulus 5Star Tower assembly

---

### [Case 1513 — Disc Frame: Star (Burst God)](./9%20case%20study.md#case-1513)

**System**: Burst God / Disc Frame  
**Geometry**: 2.4 g · r_i 3.3 cm · r_o 3.7 cm · 8 protrusions top (5 star + 3 placed between) · 10 protrusions bottom · smooth underside between protrusions  
**Material**: ABS plastic (semi-transparent teal)  
**Spin Coupling**: rigid (mounts on Disc 5)  
**Contact Points**: r_o 3.7 cm — too small to reach opponent Layer in most God-era matchups; protrusion contact angle α ≈ slight  
**Movement Freedom**: fixed  
**Base Stats**: versatile middle-ground — Attack/LAD hybrid; LAD below Glaive/Cross but above most non-LAD frames  
**Mechanism**: Attack use: 2.4 g above average frame mass → slight impulse if contact occurs; but r_o 3.7 cm too small for reliable Layer contact. LAD use: smooth underside provides consistent bearing surface during wobble phase. Neither role is best-in-class.  
**2.5D Rendering**: ring at r_o 3.7 cm · star and bump protrusion texture on top/bottom faces  
**Gimmick**: none (passive LAD surface)  
**Engine Note**: I = 2.950×10⁻⁶ kg·m²; I_thin-ring check at r_mid 3.5 cm = 2.940×10⁻⁶ ✓

---

### [Case 1514 — Performance Tip: Tower (Burst God)](./9%20case%20study.md#case-1514)

**System**: Burst God / Performance Tip  
**Geometry**: 5.5 g · semi-flat tip r_contact 0.35 cm · wide base r_base 1.5 cm · two centrifugal tabs embedded in base · ω_t ≈ 250 rad/s  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: semi-flat tip μ ≈ 0.18 (est.) at r 0.35 cm (high-spin); wide base r 1.5 cm (low-spin — upward-angle destabilization risk)  
**Movement Freedom**: tabs deployable (extend to r 1.3 cm high-spin; retract low-spin changing tip height)  
**Base Stats**: Stamina — inadequate (t_stall 91.3 s); Burst resist — poor (gimmick creates upward-angle destabilization); not recommended competitive  
**Mechanism**: Height-change gimmick: high-spin tabs extend → semi-flat tip at low position (moderate movement). Low-spin tabs retract → tip rises, in-theory wide-base burst trap, in-practice upward-angle destabilization of own bey. Top-heavy geometry at low-spin raises CoM → increased tipping. Gimmick fails on three counts.  
**2.5D Rendering**: wide base visible at r 1.5 cm · tip position changes with spin phase  
**Gimmick**: centrifugal height change → `centrifugal_mode_change` (k_tab ≈ 37.5 N/m; ω_t ≈ 250 rad/s); gimmick counterproductive  
**Engine Note**: I_high = 2.631×10⁻⁶; I_low = 2.001×10⁻⁶ kg·m² · dω/dt = 7.665 rad/s² · t_stall 91.3 s

---

### [Case 1515 — Full Assembly: Shelter Regulus 5Star Tower (Burst God)](./9%20case%20study.md#case-1515)

**System**: Burst God / Balance (intended) / poor burst-vulnerability build  
**Geometry**: total 43.3 g · ω₀ 700 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid (assembly)  
**Contact Points**: Shelter Regulus square corners at r_o 3.8–4.2 cm · Tower base r 1.5 cm (low-spin)  
**Movement Freedom**: dual gimmick — Regulus claws + Tower tab height change (both transition near ω ≈ 200–250 rad/s)  
**Base Stats**: Stamina — 91.3 s (adequate but not competitive); Defense — poor; Burst — 2–4 hits against hard attackers  
**Mechanism**: All four gimmick-bearing parts fail to deliver intended benefit. Dual transition at ω_t ≈ 200 rad/s gives combined spin gain +3.8% (within wobble zone, masked by destabilization). Tower destabilizes own bey in low-spin mode. Square recoil + weak teeth = N_burst ≈ 2–4 hits. Only casual/introductory use.  
**2.5D Rendering**: Regulus extended claw profile at 4.2 cm · Disc 5 elliptical · Star Frame ring · Tower wide base  
**Gimmick**: compound dual centrifugal gimmick (Regulus + Tower) — both `centrifugal_mode_change` instances  
**Engine Note**: I_launch = 3.490×10⁻⁵; I_post-transition = 3.363×10⁻⁵ kg·m² · L₀ = 2.443×10⁻² N·m·s · dω/dt = 7.665 rad/s² · t_stall 91.3 s · burst threshold τ ≈ 3 mN·m (weak layer)

---

### [Case 1516 — Superking Chip: Hyperion 2 (Burst Sparking / Superking)](./9%20case%20study.md#case-1516)

**System**: Burst Sparking / Superking (SK)  
**Geometry**: 5.7 g · r ≈ 1.1 cm (standard SK Chip outer lip) · right-spin · metallic weight insert integrated  
**Material**: ABS + metal insert  
**Spin Coupling**: rigid  
**Contact Points**: none (chip-level component at small radius)  
**Movement Freedom**: fixed; Metal Chip Core (MCC) optional insert (+3.5 g at r ≈ 0.8 cm, adds burst resistance stiffness)  
**Base Stats**: τ_burst_chip 4.5–5.0 mN·m; with Xceed'+X Dash spring: τ_burst_assembly ≈ 6.5 mN·m  
**Mechanism**: One of five SK Chips with metal insert. Only Hyperion 2 and Solomon accept Metal Chip Core (MCC). MCC adds ΔI ≈ 2.24×10⁻⁷ kg·m² (+0.5% assembly I — marginal); primary MCC benefit is chip-to-ring interface stiffening for burst resistance. Hasbro (Hyperion Flamebringer): softer plastics, τ_burst_Hasbro ≈ 5.0 mN·m (~20% lower).  
**2.5D Rendering**: small chip at r 1.1 cm at layer center  
**Gimmick**: none; MCC optional insert  
**Engine Note**: I = 3.449×10⁻⁷ kg·m² (0.78% of assembly I); τ_burst_chip 4.5–5.0 mN·m hard engagement surface

---

### [Case 1517 — Ring: Burn (Burst Sparking / Superking) — Limit Break](./9%20case%20study.md#case-1517)

**System**: Burst Sparking / Superking / Limit Break  
**Geometry**: 24.5 g · r_tip_Normal 3.5 cm · r_tip_Activated 4.0 cm · r_i ≈ 1.4 cm · 4 spring-loaded attack blades · latch mechanism coupled to burst lock  
**Material**: ABS + spring mechanism  
**Spin Coupling**: rigid (ring frame) · blades deployable via spring latch  
**Contact Points**: 4 blades at r 3.5 cm (Normal) → 4 super-large blades at r 4.0 cm (Activated) · +17.2% blade KE at activation  
**Movement Freedom**: deployable blades (one-way — cannot revert once activated)  
**Base Stats**: Attack — strong post-activation; KE_A = 0.824 J vs KE_N = 0.703 J (+17.2%)  
**Mechanism**: Limit Break via two independent trigger routes: (1) lock-advancement — burst torque accumulation reaches latch threshold (natural mid-battle escalation after 3–5 exchanges); (2) strong single impact forces instant activation. Blade extension compensates 5.3% spin drop from I increase → net +17% blade KE. Post-activation spin decay: dω/dt_A = 37.98 rad/s² (slightly slower than Normal due to higher I).  
**2.5D Rendering**: blades at r 3.5 cm Normal / 4.0 cm Activated · spring deployment animation  
**Gimmick**: spring-loaded blade deployment → MechanicRegistry: `limit_break_deploy` (trigger: lock-advancement threshold OR strong impact; one-way; ΔI = 2.43×10⁻⁶ kg·m²)  
**Engine Note**: I_Normal = 1.783×10⁻⁵; I_Activated = 2.026×10⁻⁵ kg·m² · ΔI = 2.43×10⁻⁶ · ω_after = I_N/I_A × ω_before; blade KE +17.2%; limitBreakDeltaKE = +0.121 J

---

### [Case 1518 — Forge Disc: Cho (超 — Burst Sparking / Superking)](./9%20case%20study.md#case-1518)

**System**: Burst Sparking / Superking / Limit Break Disc  
**Geometry**: 31.3 g · r_i 0.6 cm · r_o 4.0 cm · heaviest of the three Limit Break Discs  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: none (disc-level; Limit Break interface geometry with Ring Burn)  
**Movement Freedom**: fixed; dedicated Limit Break disc — standard discs lack required interface geometry  
**Base Stats**: 57.0% of assembly L in Hyperion Burn Cho Xceed'+X; L_Cho = 1.757×10⁻² N·m·s at ω₀ 700 rad/s  
**Mechanism**: Stores >50% of total assembly angular momentum. Dedicated Limit Break Disc: inner geometry mates with ring's spring/latch housing to allow slight ring rotation that triggers latch (lock-advancement route). Standard discs (0, 2, 7 etc.) lack this interface → Limit Break Rings incompatible. Cho is heaviest LB disc vs Volcano (~28–29 g) and The End (~25–27 g).  
**2.5D Rendering**: circular disc at r_o 4.0 cm · Cho (超) symbol details  
**Gimmick**: Limit Break interface (passive; enables Burn ring latch mechanism)  
**Engine Note**: I = 2.510×10⁻⁵ kg·m² · 57.0% of assembly I; dedicated disc flag for Limit Break ring compatibility

---

### [Case 1519 — Performance Tip: Xceed'+X (Burst Sparking / Superking)](./9%20case%20study.md#case-1519)

**System**: Burst Sparking / Superking / Dash Driver  
**Geometry**: 10.4 g · rubber flat tip r_eff ≈ 0.5 cm (locked) · free-spinning plate r_plate ≈ 1.2 cm (locked by Xceed Chip) · Dash spring  
**Material**: ABS body + rubber flat contact + Xceed Chip (ABS insert)  
**Spin Coupling**: rubber tip rigid (plate locked by chip)  
**Contact Points**: rubber flat at r 0.5 cm · μ_rubber 0.50 (full contact, no plate-slip correction)  
**Movement Freedom**: free-spinning plate locked by Xceed Chip insert; Dash spring provides higher burst lock pre-tension  
**Base Stats**: τ friction = 1.764×10⁻³ N·m → dω/dt 40.07 rad/s² · t_stall 17.5 s; movement — aggressive wide flower pattern  
**Mechanism**: Xceed Chip locks the free-spinning plate, raising effective r_eff from 3.5 mm (Xceed' baseline) to 5.0 mm and μ from ~0.30 to 0.50 — 43% more friction torque. Dash spring: k_Dash ≈ 1.25× standard → +1.5–2.0 mN·m burst resistance. Trade-off: maximum contact aggression at cost of spin retention (t_stall 17.5 s vs 29.1 s for Xceed').  
**2.5D Rendering**: rubber flat tip visible at r 0.5 cm · plate ring at r 1.2 cm  
**Gimmick**: plate-lock via removable Xceed Chip insert; Dash spring  
**Engine Note**: I = 7.488×10⁻⁷ kg·m² · τ = 0.50 × m × g × 0.005 · driverType: dash-rubber-flat-locked · Dash bonus: +1.5–2.0 mN·m burst threshold

---

### [Case 1520 — Full Assembly: Hyperion Burn Cho Xceed'+X (Burst Sparking / Superking)](./9%20case%20study.md#case-1520)

**System**: Burst Sparking / Superking / Limit Break Attack  
**Geometry**: total 71.9 g · ω₀ 700 rad/s (SK LR String Launcher) · Hasbro: Hyperion Flamebringer Cho Xceed'+X  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · Burn blades spring-deployable  
**Contact Points**: Burn blades at r 3.5 cm Normal / 4.0 cm Activated · Xceed'+X rubber flat at r 0.5 cm  
**Movement Freedom**: Burn Limit Break (one-way deployment); Xceed Chip plate-lock  
**Base Stats**: Attack — strong; t_stall 17.5 s; t_wobble 10.5 s; burst resist 6.5 mN·m; v_tip_A 15.92 m/s  
**Mechanism**: Must secure KO or Burst before t_wobble ≈ 10.5 s. Burn ring Limit Break activates after 3–5 exchanges (lock-advancement) or one strong hit, delivering +17.2% blade KE at activation. Post-activation spin decay: dω/dt_A = 37.98 rad/s² (slightly improved from Normal 40.07 due to higher I). MCC upgrade: +0.5% L (marginal); primary benefit is burst resistance stiffening.  
**2.5D Rendering**: Burn ring blade profile at r 3.5–4.0 cm · Cho disc elliptical · Xceed rubber tip  
**Gimmick**: Burn Limit Break → `limit_break_deploy` (see Case 1517) + Xceed'+X plate-lock  
**Engine Note**: I_normal = 4.402×10⁻⁵; I_activated = 4.645×10⁻⁵ kg·m² · L₀ = 3.081×10⁻² N·m·s · spinDecayRate_normal 40.07 · spinDecayRate_activated 37.98 rad/s² · limitBreakSpinDrop −5.3% · limitBreakDeltaKE +17.2% · burstResistance 6.5 mN·m · t_stall 17.5 s

| Component | I fraction (Normal) |
|-----------|-------------------|
| Cho disc | 57.0% |
| Ring Burn | 40.5% |
| Chip + Tip | 2.5% |

---

### [Case 1521 — Energy Layer: Greatest Raphael (Dynamite Battle)](./9%20case%20study.md#case-1521)

**System**: Dynamite Battle (DB) · single-piece non-customizable Layer · ~2021 TT · also Glory Regnar  
**Geometry**: 30.7 g · body 23.5 g (r_i 0.4 cm, r_o 3.6 cm) · 6 PC spike arms 4.5 g (r_ext 4.2 cm Attack / r_def 2.6 cm Defense) · 2 Metal Burst Lock tabs 2.7 g (r_atk 3.6 cm / r_def 2.1 cm) · ω_t ≈ 200 rad/s  
**Material**: ABS + polycarbonate (PC) spikes + metal burst lock tabs  
**Spin Coupling**: rigid; arms and Metal Burst Lock centrifugally deployable  
**Contact Points**: 6 spike arms at r 4.2 cm (Attack Mode) / r 2.6 cm (Defense Mode) · 2 metal tab protrusions  
**Movement Freedom**: Overdrive System: centrifugal arm extension/retraction + simultaneous Metal Burst Lock slide  
**Base Stats**: Balance; I_attack = 2.685×10⁻⁵; I_defense = 1.964×10⁻⁵ kg·m² · ΔI = 7.21×10⁻⁶ (−26.8% at transition)  
**Mechanism**: Overdrive System — at high spin arms extend (Attack Mode / OWD); at ω < 200 rad/s arms retract toward axis (Defense Mode / CWD). Metal Burst Lock slides from r 3.6 cm → r 2.1 cm at same transition, physically obstructing Disc-Layer groove: τ_burst_attack ~14 mN·m → τ_burst_defense ~20 mN·m. Layer-only spin boost at transition: ω_after = (2.685e-5 × 200) / 1.964e-5 = 273.4 rad/s (+36.7%). Assembly-level boost: +12.9% (dampened by Over disc). Overdrive spin boost interrupts Fafnir-type absorber cycle for ~0.3–0.8 s.  
**2.5D Rendering**: 6-spike outer profile at r 4.2 cm Attack / round profile at r 2.6 cm Defense · metal protrusions visible  
**Gimmick**: Overdrive centrifugal mode change → `centrifugal_mode_change` + Metal Burst Lock → burst-resistance step-up at transition  
**Engine Note**: I_attack = 2.685×10⁻⁵; I_defense = 1.964×10⁻⁵ · ω_t ≈ 200 rad/s · τ_burst_attack 14 mN·m; τ_burst_defense 20 mN·m; Overdrive arm interruption risk: asymmetric CWD if only one arm activates

---

### [Case 1522 — Forge Disc: Over (Dynamite Battle)](./9%20case%20study.md#case-1522)

**System**: Dynamite Battle (DB) / one of heaviest Forge Discs  
**Geometry**: 33.7 g · r_i 0.8 cm · r_o 4.5 cm · smooth circular · no protrusions or cavities  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: smooth perimeter at r_o 4.5 cm · no edges to catch stadium walls → optimal LAD  
**Movement Freedom**: fixed  
**Base Stats**: maximum OWD + LAD; I_Over = 3.520×10⁻⁵ kg·m²; 55.6% of I_attack in Greatest Raphael assembly  
**Mechanism**: Smooth circular profile maximizes OWD and LAD simultaneously. No ridges/tabs → no edge-catch during final precession roll. Exceeds Giga disc (+4.4% I at only +2.7% mass) confirming optimized circular mass placement. I_Over/I_Disc0 = 1.679 (+67.9% vs Disc 0). Preferred whenever maximum OWD + LAD required regardless of bey type.  
**2.5D Rendering**: smooth annular disc at r_o 4.5 cm  
**Gimmick**: none  
**Engine Note**: I = 3.520×10⁻⁵ kg·m² · r_inner validated against AstralSpriggan Over Quattro-0 I_total inference

---

### [Case 1523 — Performance Tip: High Xtend+' (DB Dash variant)](./9%20case%20study.md#case-1523)

**System**: Dynamite Battle (DB) / Dash (') spring  
**Geometry**: 9.3 g · 3-mode Xtend Chip adjustable · Attack r_contact 0.8 cm μ 0.25 · Defense r 0.15 cm cone μ 0.05 · Stamina r 0.2 cm cone μ 0.04 · LAD base r_base ≈ 0.7 cm  
**Material**: ABS housing + spring mechanism + Xtend Chip insert  
**Spin Coupling**: contact geometry changes per mode (chip repositions within housing)  
**Contact Points**: Attack: wide hollow flat r 0.8 cm; Defense: low-angle stepped cone r 0.15 cm; Stamina: low-angle cone r 0.2 cm  
**Movement Freedom**: 3-click mode selection via Xtend Chip  
**Base Stats**: Attack — t_stall ~30.6 s (highly aggressive, short operational window); Stamina — best mode (comparable to Zone+Z, Bearing in LAD profile); Dash spring: +2.5 mN·m burst resist  
**Mechanism**: Xtend Chip repositions in housing to change contact geometry. Mode changes affect only contact point, not mass distribution (I unchanged). Stamina mode described as comparable to Zone+Z and Bearing in LAD and low-friction cone geometry. LAD base r_base ≈ 7 mm → comparable to Zone+Z free-spin ring (~8 mm). Dash spring k ≈ 1.25× standard: δτ_Dash ≈ +2.5 mN·m.  
**2.5D Rendering**: tip geometry changes per mode · wide base visible for LAD  
**Gimmick**: 3-mode Xtend Chip → `mode_switch_tip`  
**Engine Note**: I = 1.214×10⁻⁶ kg·m² · Stamina mode: τ = 0.04 × 0.0737 × 9.81 × 0.002 = 5.784×10⁻⁵ N·m → t_stall (assembly) 766 s; Attack mode: τ = 1.446×10⁻³ N·m → t_stall ~30.6 s; Dash burst bonus: +2.5 mN·m

---

### [Case 1524 — Full Assembly: Greatest Raphael Over High Xtend+' (Dynamite Battle)](./9%20case%20study.md#case-1524)

**System**: Dynamite Battle (DB) · also Glory Regnar Over High Xtend+' · ~2021 TT  
**Geometry**: total 73.7 g · ω₀ 700 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · Overdrive arms + Metal Lock centrifugally deployable at ω_t 200 rad/s  
**Contact Points**: Greatest Raphael spikes at r 4.2 cm Attack / r 2.6 cm Defense · HXe+' tip per selected mode  
**Movement Freedom**: Overdrive dual-mode; HXe+' 3-mode  
**Base Stats**: Stamina mode t_stall 766 s (theoretical); L₀ = 4.429×10⁻² N·m·s; burst: ~14 mN·m Attack → ~22.5 mN·m Defense mode  
**Mechanism**: Recommended as Opposite-Spin Stamina / Spin Equalization platform. At ω_t = 200 rad/s: ω_after = 225.7 rad/s (+12.9% at assembly level — dampened from layer-only +36.7% by Over disc large fixed I). Overdrive interrupts Fafnir-type drain cycle ~0.3–0.8 s per event. Stamina mode phase breakdown: t_1 (Attack Mode 700→200 rad/s) = 546.9 s + Overdrive fires + t_2 (Defense Mode 225.7→0) = 218.7 s → total 765.6 s. Over disc contributes 55.6% of I_attack. Not recommended vs same-spin heavy DB beys (lighter 30.7 g single-piece layer). Best paired with Mobius or Drift for max Stamina.  
**2.5D Rendering**: Raphael spike profile Attack/Defense · Over disc large smooth annular · HXe+' tip  
**Gimmick**: Overdrive dual-mode (see Case 1521) + HXe+' 3-mode (see Case 1523) + Metal Burst Lock step-up  
**Engine Note**: I_attack = 6.327×10⁻⁵; I_defense = 5.606×10⁻⁵ kg·m² · L₀ = 4.429×10⁻² N·m·s · Stamina: τ = 5.784×10⁻⁵ N·m · t_stall 766 s · burst: 14 mN·m (Attack) → 22.5 mN·m (Defense, Metal Lock + Dash spring active)

| Assembly State | I (kg·m²) | Notes |
|---------------|-----------|-------|
| Attack Mode | 6.327×10⁻⁵ | Layer + Over + HXe+' |
| Defense Mode | 5.606×10⁻⁵ | Post-Overdrive |
| Over disc fraction | 55.6% | Primary I reservoir |

---

### [Case 1546 — Energy Ring: Dragonis (MFB 4D System)](./9%20case%20study.md#case-1546)

**System**: MFB 4D System / BB-109 · right-spin dragon motif  
**Geometry**: 2.8 g (est.) · r_i ≈ 1.8 cm · r_o ≈ 3.2 cm · 2 dagger blades at ~160° separation (not 180°) · diamond-chain whip fills arcs  
**Material**: ABS plastic (transparent aquamarine with glitter)  
**Spin Coupling**: rigid  
**Contact Points**: r_o 3.2 cm dagger tips · non-symmetric contact events (2-fold quasi-symmetry only)  
**Movement Freedom**: fixed  
**Base Stats**: contributes only 5.0% of assembly I (95.0% from Omega Wheel + track/tip); neutral-to-negative part  
**Mechanism**: ~160° blade separation (not 180°) creates CoM offset Δr_CoM ≈ 0.4–0.7 mm. Centrifugal imbalance force at ω 390 rad/s: F ≈ 0.26 N → continuous micro-vibration → accelerated spin decay via tip micro-oscillation. Sole right-spin dragon-motif ER in MFB; value is purely aesthetic.  
**2.5D Rendering**: 2-dagger silhouette at r_o 3.2 cm · chain-whip detail between daggers  
**Gimmick**: none  
**Engine Note**: I_Dragonis = 1.997×10⁻⁶ kg·m² · CoM offset imbalance force 0.26 N at battle ω; model as slight additional spin decay contribution

---

### [Case 1547 — Fusion Wheel Core: Omega (MFB 4D System)](./9%20case%20study.md#case-1547)

**System**: MFB 4D System · inner metal component  
**Geometry**: 25.3 g · r_i 0.8 cm · r_scale ≈ 3.8 cm · r_talon ≈ 3.2 cm · 3 overlapping curved scales (dominant outer profile) + 3 blunt cylindrical talons (shorter) · hollow underside  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid (with Frame in fixed mode assembly; two tab modes: Assault / Barrage)  
**Contact Points**: 3 scale tips at r 3.8 cm α ≈ 20° from tangent; 3 talon tips at r 3.2 cm α ≈ 5°  
**Movement Freedom**: fixed (orientation locked via asymmetric tab system — 2 possible seating positions)  
**Base Stats**: scale contact: F_radial 94.0% (KO force), F_tangential 34.2% (recoil) — low-recoil attack profile  
**Mechanism**: Scale protrusions curve inward at α ≈ 20° — predominantly radial force → opponent pushed away (KO) with lower recoil than attacking wheel. Talon protrusions at α ≈ 5° (even less recoil, but overshadowed by scales at larger radius). Hollow underside reduces mid-radius mass while allowing Frame to provide targeted outer weight.  
**2.5D Rendering**: 3-scale + 3-talon silhouette · scales dominant at r_o 3.8 cm  
**Gimmick**: none (passive contact geometry)  
**Engine Note**: I_Core = 2.369×10⁻⁵ kg·m² · scale contact: F_radial/F_total = cos(20°) = 0.940; F_tangential = sin(20°) = 0.342

---

### [Case 1548 — Fusion Wheel Frame: Omega (MFB 4D System)](./9%20case%20study.md#case-1548)

**System**: MFB 4D System · outer metal ring component  
**Geometry**: 12.5 g · r_inner ≈ 2.0 cm · r_outer ≈ 4.4 cm · 3 evenly-spaced wings · 2 asymmetric internal tabs (deterministic 2-position orientation lock)  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid (seated on Core in exactly 2 positions: Assault or Barrage)  
**Contact Points**: 3 wing edges at r_tip 4.4 cm · asymmetric tabs prevent upside-down mounting  
**Movement Freedom**: fixed (non-reversible mid-battle; asymmetric tab lock enforces 2 positions only)  
**Base Stats**: I_Frame = 1.544×10⁻⁵ kg·m²; primary outer contact mass for Omega assembly  
**Mechanism**: Two asymmetric tabs with different widths → exactly 2 seating positions (Assault and Barrage). Upside-down seating physically impossible. Mode selection intentional and non-reversible mid-battle (deterministic orientation lock). Three wings provide 3 contact events per revolution in Barrage mode, 6 (scales + wing edges) in Assault.  
**2.5D Rendering**: 3-wing outer ring at r_o 4.4 cm  
**Gimmick**: none (passive mode selection; locked pre-battle)  
**Engine Note**: I_Frame = 1.544×10⁻⁵ kg·m²; tabConstraint: 2 positions; upside-down flag: physically blocked

---

### [Case 1549 — Fusion Wheel: Omega — Assault Mode (MFB 4D System)](./9%20case%20study.md#case-1549)

**System**: MFB 4D System · combined Omega Wheel  
**Geometry**: total Omega 37.8 g (Core 25.3 + Frame 12.5) · Frame wings fill gap between talon and scale protrusions · scales remain exposed at outer profile · 6 contact events/rev (3 scales + 3 wing edges)  
**Material**: see Core (1547) and Frame (1548)  
**Spin Coupling**: rigid combined  
**Contact Points**: primary r_scale 3.8 cm α 20° (e ≈ 0.25); secondary r_wing 4.4 cm  
**Movement Freedom**: fixed (Assault mode pre-set)  
**Base Stats**: v_scale 14.82 m/s at ω 390; J_Assault 0.389 N·s/hit; 372 hits/s; sustained impact power 144.8 N·s/s  
**Mechanism**: Gap-filling by Frame → continuous outer profile → quasi-continuous grinding rather than discrete impacts. Low recoil (e = 0.25, scale geometry) → Omega persists through contact. 6-event frequency compensates lower per-hit impulse. 85 track → 7.5 mm contact height → tilt-destabilization of standard-height opponents.  
**2.5D Rendering**: combined 6-protrusion profile · scales at r 3.8 cm dominant · wing fill visible  
**Gimmick**: none (passive assembly profile)  
**Engine Note**: I_Omega_Assault = 3.913×10⁻⁵ kg·m² · J_per_hit 0.389 N·s · hitRate 372/s at ω 390; sustainedPower 144.8 N·s/s

---

### [Case 1550 — Fusion Wheel: Omega — Barrage Mode (MFB 4D System)](./9%20case%20study.md#case-1550)

**System**: MFB 4D System · combined Omega Wheel / Barrage configuration  
**Geometry**: same 37.8 g · Frame wings cover scale protrusions · 3 contact events/rev (Frame wings only) · r_wing 4.4 cm  
**Material**: same as Assault Mode  
**Spin Coupling**: rigid combined  
**Contact Points**: 3 wing tips at r 4.4 cm α ≈ 35° (wedge geometry) · e ≈ 0.30  
**Movement Freedom**: fixed (Barrage mode pre-set)  
**Base Stats**: J_Barrage 0.469 N·s/hit; 186 hits/s; sustained impact power 87.4 N·s/s (vs Assault 144.8); poor LAD (interrupted outer profile)  
**Mechanism**: Three discrete wings at 44 mm — higher per-hit impulse but halved hit frequency vs Assault. ΔL_per_hit = 0.469 × 0.044 = 20.6 mN·m·s vs Assault 14.8 mN·m·s. Gap between hits allows opponent recovery. Interrupted outer profile → poor LAD (contacts ground intermittently between wing segments). Use case: single high-speed opening burst attempt rather than sustained grinding.  
**2.5D Rendering**: 3-wing silhouette at r_o 4.4 cm · core features buried  
**Gimmick**: none (passive assembly profile)  
**Engine Note**: I_Omega_Barrage = 3.913×10⁻⁵ kg·m² (unchanged) · J_per_hit 0.469 N·s · hitRate 186/s; sustainedPower 87.4 N·s/s; LAD penalty from interrupted profile

| Mode | Impulse/hit | Hit rate | Sustained power |
|------|-------------|---------|----------------|
| Assault | 0.389 N·s | 372/s | 144.8 N·s/s |
| Barrage | 0.469 N·s | 186/s | 87.4 N·s/s |

---

### [Case 1551 — Spin Track: 85 (MFB System)](./9%20case%20study.md#case-1551)

**System**: MFB System / shortest available MFB track  
**Geometry**: ~0.9 g (est.) · height 8.5 mm · outer diameter ~8 mm · narrow cylinder  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: none (track height positions Wheel contact band at 7.5 mm above arena floor)  
**Movement Freedom**: fixed  
**Base Stats**: optimal for low-attacker customizations; floor-scrape critical angle θ_crit ≈ 3.2°  
**Mechanism**: Defines "low attacker" builds by placing Fusion Wheel contact band at opponent's Tip/Track junction. vs 145 track opponent: Omega hits 7 mm below their Fusion Wheel → tilt torque per hit τ_tilt ≈ 0.118 N·m (destabilizes opponents). High-track combos (Hades Kerbecs BD145DS, Flame Byxis 230WD) immune as their contact band is at 23 mm, above effective reach.  
**2.5D Rendering**: slim cylinder h 0.85 cm  
**Gimmick**: none  
**Engine Note**: I = 9×10⁻⁹ kg·m² (negligible) · contact band height 0.75 cm; tilt torque = J × (h_CoM_opponent − h_contact) / r_contact; floor-scrape θ_crit 3.2°

---

### [Case 1552 — Performance Tip: XF (Extreme Flat) (MFB System)](./9%20case%20study.md#case-1552)

**System**: MFB System  
**Geometry**: ~0.7 g (est.) · tip face r_face 0.8 cm · r_eff (effective) 0.533 cm (= 2/3 × 0.8 cm) · 4 small ABS nubs at edge · same diameter as rubber RF (16 mm)  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: flat disc r_eff 0.533 cm · μ_k 0.35 (ABS on BeySadium)  
**Movement Freedom**: fixed  
**Base Stats**: τ_friction = 7.72×10⁻⁴ N·m; dω/dt −19.4 rad/s² (ref: 42.2 g Omega assembly); t_stall 33.5 s; movement — aggressive wandering / Tornado Stalling tendency  
**Mechanism**: Wide 16 mm contact amplifies friction moment arm → aggressive wandering. Precession rate Ω = 0.0497 rad/s at battle ω — too high for clean oval paths → chaotic movement. Left-spin use: optimal spin-equalisation coefficient (sufficient friction without rubber over-grip; wider area vs MF for more efficient equalisation). Outclassed by RF for attack (RF maintains flower pattern reliably).  
**2.5D Rendering**: wide flat disc tip at r 0.8 cm  
**Gimmick**: none  
**Engine Note**: I = 2.24×10⁻⁸ kg·m² (negligible) · τ = μ_k × N × R_eff = 0.35 × (m × g) × 0.00533

---

### [Case 1553 — Assembly: Omega Dragonis 85XF — Assault Mode (MFB 4D System)](./9%20case%20study.md#case-1553)

**System**: MFB 4D System · Assault Mode  
**Geometry**: total 42.2 g (excl. Face Bolt) · ω₀ 650 rad/s (MFB era)  
**Material**: see component cases  
**Spin Coupling**: rigid  
**Contact Points**: Omega scales r 3.8 cm + Frame wing edges r 4.4 cm · 6 contact events/rev  
**Movement Freedom**: Assault Mode fixed (Frame orientation pre-set)  
**Base Stats**: sustained impact power 144.5 N·s/s; t_stall 34.6 s; t_battle 13.8 s; L_launch 26.77 mN·m·s  
**Mechanism**: 85 track places contact band at 7.5 mm → tilt destabilisation of standard-height opponents. Low recoil scale contact (e = 0.25) → grinding approach. Angular momentum deficit vs competitive builds: ~33% lower than Flash/Variares at comparable ω₀. Effective against lighter stamina customs; insufficient for decisive KOs against heavy defense types.  
**2.5D Rendering**: Omega 6-contact profile · 85 low track · XF wide flat tip  
**Gimmick**: none (passive assembly)  
**Engine Note**: I_total = 4.118×10⁻⁵ kg·m² · L₀ = 26.77 mN·m·s · dω/dt −18.8 rad/s² · t_stall 34.6 s · sustainedPower 144.5 N·s/s

---

### [Case 1554 — Assembly: Omega Dragonis 85XF — Barrage Mode (MFB 4D System)](./9%20case%20study.md#case-1554)

**System**: MFB 4D System · Barrage Mode  
**Geometry**: identical mass and I to Assault Mode (42.2 g, I = 4.118×10⁻⁵ kg·m²)  
**Material**: see component cases  
**Spin Coupling**: rigid  
**Contact Points**: 3 Frame wing tips at r 4.4 cm · e 0.30 · 3 contact events/rev  
**Movement Freedom**: Barrage Mode fixed  
**Base Stats**: J_Barrage 0.469 N·s/hit; 186 hits/s; sustained power 87.3 N·s/s; t_stall 34.6 s (identical to Assault); LAD poor (interrupted profile)  
**Mechanism**: See Case 1550 for mode comparison. ΔL_per_hit 20.6 vs Assault 14.8 mN·m·s — longer lever arm per hit at cost of halved frequency. Gap between hits allows opponent recovery. Poor LAD from three-wing interrupted outer profile. Practical use: opening burst attempt where 44 mm contact matches opponent Layer recess geometry.  
**2.5D Rendering**: 3-wing outer profile at r 4.4 cm · core features buried  
**Gimmick**: none (passive assembly)  
**Engine Note**: I_total = 4.118×10⁻⁵ kg·m² (unchanged from Assault) · hitRate 186/s; sustainedPower 87.3 N·s/s; LAD penalty flag

---

### [Case 1555 — Energy Ring: Aries (MFB Standard System)](./9%20case%20study.md#case-1555)

**System**: MFB Standard System  
**Geometry**: 3.0 g · r_i ≈ 1.8 cm · r_o ≈ 3.0 cm · 3-fold symmetric (C3) · 3 outward "head" protrusions with rock-like engravings · triangular outer perimeter  
**Material**: ABS plastic (translucent hot-pink)  
**Spin Coupling**: rigid  
**Contact Points**: 3 rock-head protrusions at r_o 3.0 cm · α ≈ 25° from tangent · rock-surface texture (marginally higher local friction)  
**Movement Freedom**: fixed  
**Base Stats**: 14.5% of assembly I (vs 82.8% from Clay LW); not the limiting factor  
**Mechanism**: 3 ram-head protrusions create triangular contact perimeter. Surface texture provides marginally better grip during spin equalization but no competitive advantage. Competitive role limited by Clay LW's plastic construction.  
**2.5D Rendering**: triangular 3-protrusion silhouette at r_o 3.0 cm  
**Gimmick**: none  
**Engine Note**: I_Aries = 1.841×10⁻⁶ kg·m²; contact α 25°; 14.5% of assembly I

---

### [Case 1556 — Light Wheel: Clay (MFB Light Wheel Series)](./9%20case%20study.md#case-1556)

**System**: MFB Light Wheel Series · plastic equivalent of Counter Metal Wheel  
**Geometry**: 15.0 g · r_i ≈ 0.8 cm · r_o ≈ 3.6 cm · 4-arm counter-type rounded cross  
**Material**: ABS plastic (safety factor SF = 0.39 < 1 at typical battle loads → structural failure inevitable)  
**Spin Coupling**: rigid  
**Contact Points**: r_o 3.6 cm rounded arm tips; same profile as Counter FW  
**Movement Freedom**: fixed; collector item only — structural integrity fails after 5–10 moderate impacts  
**Base Stats**: I = 1.051×10⁻⁵ kg·m² (52.3% of equivalent Counter metal at ~2.0×10⁻⁵); L_launch 9.243 mN·m·s at ω₀ 650 rad/s (50.8% of Storm FW)  
**Mechanism**: Same geometry as Counter FW but ABS plastic. Mass reduced 50%. Wing root bending stress at typical battle impact: σ = 129.6 MPa vs ABS yield σ_y = 50 MPa → SF 0.39 — fracture mechanically inevitable. Used as collector/display only. Competitive value: zero.  
**2.5D Rendering**: 4-arm rounded profile at r_o 3.6 cm  
**Gimmick**: none  
**Engine Note**: I = 1.051×10⁻⁵ kg·m² · structural failure flag: SF < 1 → model as progressive damage or immediate disqualification from competitive use context

---

### [Case 1557 — Spin Track: ED145 (Eternal Defense 145) (MFB System)](./9%20case%20study.md#case-1557)

**System**: MFB System / 14.5 mm height  
**Geometry**: 1.7 g total (body ~1.1 g, 3 free-spinning wings ~0.6 g) · height 14.5 mm · 3 free-spinning wing segments on pivot  
**Material**: ABS plastic  
**Spin Coupling**: wings free-spinning about pivot shoulder  
**Contact Points**: 3 wings at r ≈ 2.2 cm · wings slip on any meaningful impact (τ_impact >> τ_slip_threshold of 3.322 mN·m)  
**Movement Freedom**: wings free-spinning (pivot absorption)  
**Base Stats**: ~15–25% reduction in effective KO recoil vs WD145 (fixed wings); ED145 below BD145 overall  
**Mechanism**: At battle ω, centrifugal F per wing = 0.671 N; slip threshold = 1.107 mN·m/wing. Any impact >3.322 mN·m (combined) causes wing slip. Wing slip redirects portion of hit tangentially → partial deflection vs full elastic recoil (WD145). BD145 superior (higher mass at larger radius + bearing absorption). Real benefit: ~15–25% recoil reduction; stamina: 2.5% of assembly I (track-level).  
**2.5D Rendering**: 3-wing silhouette at r 2.2 cm · free-spin pivot indicator  
**Gimmick**: free-spin wings → `free_spin` (pivot-based impact absorption)  
**Engine Note**: I = 3.15×10⁻⁷ kg·m² · wing slip threshold 3.322 mN·m; KO recoil reduction ~15–25%

---

### [Case 1558 — Performance Tip: Ball (B) (MFB System)](./9%20case%20study.md#case-1558)

**System**: MFB System  
**Geometry**: 0.6 g · hemisphere radius R 0.5 cm · contact radius at tilt θ: r_c = R × sin(θ)  
**Material**: ABS plastic hemisphere  
**Spin Coupling**: rigid  
**Contact Points**: single point (upright); contact shifts to circle r_c = R sin(θ) when tilted · μ_k 0.35  
**Movement Freedom**: fixed  
**Base Stats**: τ_Ball at θ=5° = 3.04×10⁻⁵ N·m (~25× lower than XF); dω/dt_tip −2.40 rad/s²; theoretical spin-out 271 s (tip-only; air drag dominates in practice → real ~30–60 s)  
**Mechanism**: Curved bottom → center-seeking restoring moment = m × g × R × sin(θ) ≈ 9.96×10⁻⁴ × θ N·m/rad → keeps bey at stadium centre. As spin drops below ω_critical ≈ 250 rad/s, gyroscopic rigidity weakens and restoring moment cannot suppress wobble. With Clay Aries' low I_total, ω_critical arrives sooner.  
**2.5D Rendering**: hemisphere protruding below housing  
**Gimmick**: none (passive center-seeking geometry)  
**Engine Note**: I = 6×10⁻⁹ kg·m² (negligible) · τ_Ball = μ_k × N × R × sin(θ); center-seeking model; ω_critical 250 rad/s

---

### [Case 1559 — Assembly: Clay Aries ED145B (MFB Light Wheel Series)](./9%20case%20study.md#case-1559)

**System**: MFB Light Wheel Series / defense-oriented (mechanically) / completely outclassed  
**Geometry**: total 20.3 g · ω₀ 650 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · ED145 wings free-spinning  
**Contact Points**: Clay LW rounded arms r_o 3.6 cm · ED145 free-spin wings at r 2.2 cm  
**Movement Freedom**: ED145 free-spin wings; Ball tip center-seeking  
**Base Stats**: L_launch 8.26 mN·m·s (31% of standard competitive MFB); t_ball_theoretical 271 s (tip); burst resist — not applicable (no Burst system); KO resist — very poor (20.3 g)  
**Mechanism**: Mechanically defense-oriented (center-seeking Ball, free-spin wings) but completely outclassed by plastic Light Wheel. 20.3 g assembly is lighter than almost any Metal Wheel bey. Clay LW structural failure risk in battle. ED145 wing slip reduces KO recoil ~15–20%. Ball tip low friction extends stamina but critical failure at wobble >10–15° tilt. Collectible value: unique Aries design + ED145 track (ED145 itself remains useful in custom builds).  
**2.5D Rendering**: Clay 4-arm profile · ED145 3 free-spin wings · Ball hemisphere tip  
**Gimmick**: ED145 wing absorption + Ball center-seeking  
**Engine Note**: I_total = 1.270×10⁻⁵ kg·m² · L₀ = 8.255 mN·m·s · structural failure flag for Clay LW; collector item designation

---

### [Case 1560 — Energy Layer: Holy Horusood (Burst Standard System)](./9%20case%20study.md#case-1560)

**System**: Burst Standard System (B-35)  
**Geometry**: 8.1 g · r_corner ≈ 3.2 cm · r_side ≈ 2.4 cm (8 mm recessed sides) · r_i ≈ 1.0 cm · "square-in-circle" silhouette · 4 teeth (first short, 2–4 medium-short) · n_eff 3.5  
**Material**: ABS plastic · 2-tier design (4 upper feathered blades: 2 opaque + 2 clear)  
**Spin Coupling**: rigid  
**Contact Points**: 4 square corners at r_o 3.2 cm · α ≈ 35–45° from tangent · recoil ε ≈ 0.50 (corners deflect ~50% of impact energy)  
**Movement Freedom**: fixed  
**Base Stats**: burst threshold 49 mN·m (n_eff 3.5 × τ_floor 14 mN·m) → 1–2 hits from competitive attacker; destabilization via waved blade contact (inconsistent vector)  
**Mechanism**: Square perimeter corners → high recoil at both contact sides. Despite recoil deflecting 50% of energy, effective τ reaching ratchet = τ_impact × 0.50 = 60 mN·m for 120 mN·m attacker — still exceeds 49 mN·m threshold. Short first tooth (n_eff 3.5 vs standard 4.0) → below Standard burst resistance tier. Waved colored blades apply tilt torque with chaotic friction vector → unreliable destabilization.  
**2.5D Rendering**: square outer profile at r_o 3.2 cm · 2-tier blade detail  
**Gimmick**: none  
**Engine Note**: I = 4.105×10⁻⁶ kg·m² · n_eff 3.5 · τ_burst_threshold 49 mN·m; recoil ε 0.50 at corners

---

### [Case 1561 — Forge Disc: Upper (Burst Standard System)](./9%20case%20study.md#case-1561)

**System**: Burst Standard System  
**Geometry**: 20.0 g · r_i 0.8 cm · 2 wings at 180° symmetry · major axis r_o 3.6 cm · minor axis r_o 1.8 cm · wing incidence angle ≈ 10°  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: none (disc-level)  
**Movement Freedom**: fixed  
**Base Stats**: I = 9.536×10⁻⁶ kg·m²; lightest Burst Standard era disc at time of release; Upper Force = 0.9% of bey weight (negligible)  
**Mechanism**: Upper Force aerodynamics: F_L = 0.003 N total (both wings) vs bey weight 0.325 N → 0.9% of weight → no measurable effect on stability or KO resistance. Aerodynamic gimmick confirmed negligible. Weight deficit vs Stamina discs (4: 21.11 g, 7: ~21.5 g) → lower KO resistance and angular momentum.  
**2.5D Rendering**: 2-wing elliptical silhouette at r_o 3.6 cm · wing slope detail  
**Gimmick**: Upper Force aero (negligible in game model)  
**Engine Note**: I = 9.536×10⁻⁶ kg·m² · Upper Force lift = 0.003 N → dmg modifier near zero; weight lightest of era → lower L vs competitive discs

---

### [Case 1562 — Performance Tip: Claw (Burst Standard System)](./9%20case%20study.md#case-1562)

**System**: Burst Standard System  
**Geometry**: 5.0 g · cone tip r_cone ≈ 0.25 cm · 4 free-moving claw appendages at r_claw ≈ 0.9–1.0 cm · ω_crit ≈ 150 rad/s  
**Material**: ABS plastic  
**Spin Coupling**: rigid tip; claws free-moving (centrifugal)  
**Contact Points**: cone tip r 0.25 cm μ 0.25; claw scrape contact r 0.9–1.0 cm when tilted  
**Movement Freedom**: claws extend centrifugally (F_CF 0.132 N per claw at ω 420 vs F_spring ~0.03–0.05 N); retract below ω 150 rad/s  
**Base Stats**: τ_cone = 2.03×10⁻⁴ N·m; dω/dt (in assembly) −13.3 rad/s²; t_stall 52.7 s  
**Mechanism**: At high spin, claws extend (retracted position — clear of floor). When knocked off-balance, tilted bey's claws contact floor at r 0.9–1.0 cm → friction torque opposing KO tipping. Small cone contact → lower tip friction → improved burst resistance (counter-intuitive: small contact area transmits impacts more cleanly to ratchet). Center-seeking cone behaviour.  
**2.5D Rendering**: cone tip extending below housing · 4 claw appendages at r 0.9–1.0 cm  
**Gimmick**: centrifugal claw extension → `centrifugal_mode_change` (KO-resistance function at tilt)  
**Engine Note**: I_Claw_extended = 1.62×10⁻⁶ kg·m² · τ_cone = 2.03×10⁻⁴ N·m · claw KO resist torque = μ × N_claw × r_claw

---

### [Case 1563 — Assembly: Holy Horusood Upper Claw (Burst Standard System)](./9%20case%20study.md#case-1563)

**System**: Burst Standard System / defense-oriented / severely limited  
**Geometry**: total 33.1 g · ω₀ 700 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · Claw appendages centrifugal  
**Contact Points**: Horusood square corners r 3.2 cm · Claw cone r 0.25 cm  
**Movement Freedom**: Claw centrifugal claws  
**Base Stats**: I_total = 1.526×10⁻⁵ kg·m²; t_stall 52.7 s; burst: 1–2 hits from competitive attacker  
**Mechanism**: Three compounding failures: (1) short teeth + high corner recoil → burst 1–2 hits; (2) Upper disc too light → low L, poor KO resistance; (3) square corner recoil drains angular momentum faster than expected. Theoretically defense/stamina (center-seeking Claw, Upper disc) but practically ineffective in all competitive categories. Upper disc 62.5% of I. τ_burst_threshold 49 mN·m (n_eff 3.5); one-hit burst condition τ_impact > 98 mN·m.  
**2.5D Rendering**: Horusood square profile · Upper 2-wing disc · Claw cone + appendages  
**Gimmick**: Horusood (none) + Claw centrifugal claws  
**Engine Note**: I_total = 1.526×10⁻⁵ kg·m² · L₀ = 10.68 mN·m·s · dω/dt −13.3 rad/s² · t_stall 52.7 s · burst 1–2 hits against competitive attack

---

### [Case 1564 — Energy Layer: Vise Leopard (Burst Cho-Z System)](./9%20case%20study.md#case-1564)

**System**: Burst Cho-Z  
**Geometry**: 18.9 g · r_o ≈ 3.8 cm (metal head tips) · 2 metal leopard-head inclusions at 180° (30% = 5.67 g each at r_mean 3.3 cm) · plastic body 70% · 3 strong teeth n_eff 5  
**Material**: ABS plastic body + metal leopard-head inclusions (σ_y ≈ 200 MPa vs ABS 50 MPa)  
**Spin Coupling**: rigid; spring-loaded "bite" gimmick (non-functional in combat)  
**Contact Points**: metal heads at r_o 3.8 cm · consistent geometry (metal does not flatten over time); bite gap 2–3 mm  
**Movement Freedom**: spring-loaded bite gap (non-functional — gap too narrow for most opponents; spring too weak vs impact forces)  
**Base Stats**: I = 1.517×10⁻⁵ kg·m²; τ_to_burst 70 mN·m; ~3 strong hits to burst; solid burst resistance for attack type  
**Mechanism**: Metal heads primary advantage: maintain yield strength over time (no profile flattening). Spring bite gimmick: gap 2–3 mm vs opponent protrusion 4–8 mm → cannot enter; spring retention F ≈ 2–5 N vs impact F ≈ 100 N → ratio 1:20–50 → gimmick non-functional. Rubber teeth too small to grip. Three strong teeth: N_burst ≈ 3 solid hits from max attack.  
**2.5D Rendering**: 2 leopard-head metal protrusions at r_o 3.8 cm · bite gap visible  
**Gimmick**: spring bite (non-functional) → model as passive; teeth n_eff 5  
**Engine Note**: I = 1.517×10⁻⁵ kg·m² · τ_burst 70 mN·m (n_eff 5 × 14 mN·m); metal head contact: no degradation over time

---

### [Case 1565 — Forge Disc: 12 (Burst Cho-Z System)](./9%20case%20study.md#case-1565)

**System**: Burst Cho-Z / SwitchStrike era  
**Geometry**: 16.1 g · major axis r_o ≈ 3.4 cm · minor axis r_o ≈ 2.4 cm · elliptical · 3 protrusions per side ("12" label, flanking stylised) · serrated perimeter  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: serrated protrusion edges at r ≈ 3.0 cm (stress concentrations on opponent Layer during incidental contact)  
**Movement Freedom**: fixed (Frame accommodation slots on major axis)  
**Base Stats**: I = 7.350×10⁻⁶ kg·m²; lightest Cho-Z/SwitchStrike Core Disc; weight deficit limits KO resistance  
**Mechanism**: Lightest disc of era at 16.1 g → lower KO resistance and L vs Heavy (~21 g), 4 (21.11 g), 7 (~21.5 g), 0 (~22 g). Serrated edges cause progressive Layer wear on opponent contact — modeled as incremental burst resistance degradation over extended series. Partially compensated by Lift Frame (heaviest available Frame, 3.5 g).  
**2.5D Rendering**: elliptical silhouette at major r_o 3.4 cm · serrated protrusion details  
**Gimmick**: none (passive serrated contact wear)  
**Engine Note**: I = 7.350×10⁻⁶ kg·m² · lightest disc; serrated wear modeling: progressive τ_burst degradation on opponent Layer per contact event

---

### [Case 1566 — Disc Frame: Lift (Burst Cho-Z System)](./9%20case%20study.md#case-1566)

**System**: Burst Cho-Z / heaviest Disc Frame  
**Geometry**: 3.5 g · r_i 2.0 cm · r_o 3.8 cm · flip-able (Defense Mode: smooth round; Attack Mode: rough Under-like wedge protrusions) · floor-scrape θ_crit ≈ 3.0°  
**Material**: ABS plastic  
**Spin Coupling**: rigid (flip-mode selected pre-battle)  
**Contact Points**: Defense: smooth r_o 3.8 cm; Attack: wedge protrusions at r 3.8 cm α ≈ 20° (F_burst_component = F × sin(20°) ≈ 0.342 × F)  
**Movement Freedom**: flip-able (2 modes: Defense / Attack — pre-battle only)  
**Base Stats**: I = 3.227×10⁻⁶ kg·m²; τ_scrape = 5.83×10⁻³ N·m (enormous spin drain if scraping); scrape onset at θ > 3°  
**Mechanism**: Defense Mode preferred for stable combos. Attack Mode wedge protrusions aimed at advancing opponent burst during Disc-to-Layer contact — but same-height Burst tips make such contact rare. Floor scrape at θ > 3° creates τ_scrape ≈ 5.83 mN·m → dramatic spin drain during Destroy aggressive movement phase (θ fluctuates 3–8° in orbit). Contradicts intended Attack Mode application.  
**2.5D Rendering**: ring at r_o 3.8 cm · protrusion texture in Attack mode  
**Gimmick**: flip mode pre-battle  
**Engine Note**: I = 3.227×10⁻⁶ kg·m² · τ_scrape = 5.83×10⁻³ N·m at θ > 3.0°; scrape event flag for aggressive movement patterns

---

### [Case 1567 — Performance Tip: Destroy (Burst Cho-Z System)](./9%20case%20study.md#case-1567)

**System**: Burst Cho-Z  
**Geometry**: 6.2 g · 8-pointed star tip (alternating r_inner 0.6 cm / r_outer 1.2 cm) · free-spinning plate r_plate ≈ 2.0–2.2 cm (low position, no Layer lock-up)  
**Material**: ABS body + free-spinning plate (ABS)  
**Spin Coupling**: star tip rigid; plate free-spinning  
**Contact Points**: star tip r_eff 0.9 cm μ_k 0.35; free-spinning plate contacts floor (not Layer) during tilt  
**Movement Freedom**: free-spinning plate decoupled  
**Base Stats**: τ_star = 1.382×10⁻³ N·m; poor stamina; high LAD (plate acts as secondary gyroscope at low spin)  
**Mechanism**: Eight-pointed star tip → Jaggy-equivalent aggressive movement. Free-spinning plate low position → contacts floor (not Layer) during tilt → plate driven by floor friction → spinning plate L_plate = I_plate × ω_plate acts as secondary gyroscope, resisting tilt change and extending precession by 3–8 additional revolutions. This eliminates lock-up problem affecting Guard/Cycle (high-plate tips that contact Layer). Plate floor-spin mechanism: at ω_plate = 80 rad/s, L_plate = 8.75×10⁻⁵ N·m·s.  
**2.5D Rendering**: 8-pointed star tip · free-spinning plate ring at r 2.1 cm  
**Gimmick**: free-spinning plate LAD → `free_spin` (low-position floor-contact variant; secondary gyroscope model)  
**Engine Note**: I_Destroy = 1.213×10⁻⁶ kg·m² · τ_star = 1.382×10⁻³ N·m; LAD extension: +3–8 rev after main body spin would tip; plate ω_plate driven by floor contact

---

### [Case 1568 — Assembly: Vise Leopard 12Lift Destroy (Burst Cho-Z System)](./9%20case%20study.md#case-1568)

**System**: Burst Cho-Z / Attack  
**Geometry**: total 44.7 g · ω₀ 700 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · Destroy plate free-spinning  
**Contact Points**: Vise Leopard metal heads r_o 3.8 cm · Destroy star tip r_eff 0.9 cm  
**Movement Freedom**: Destroy free-spinning plate; Lift flip-mode (pre-battle)  
**Base Stats**: I_total = 2.706×10⁻⁵ kg·m²; L₀ = 18.94 mN·m·s; t_battle 5.5 s; t_stall 13.7 s (6–10 s practical with scraping); N_burst ~3 strong hits on opponent; burst resist n_eff 5  
**Mechanism**: Aggressive Destroy tip drives bey near Tornado Ridge. Attack window (launch to wobble): ~8.2 s. Vise Leopard metal heads v_contact = 15.96 m/s at battle ω. Lift scrape risk: Destroy orbit causes θ ≈ 3–8° → Lift Frame scrapes at θ > 3° → τ_scrape ~5.83 mN·m events dramatically accelerate spin decay. Practical spin-out 6–10 s. Destroy free-plate extends precession +5–10 revolutions post-spin-down.  
**2.5D Rendering**: Vise Leopard 2-metal-head profile · Disc 12 + Lift Frame ring · Destroy 8-point star + plate  
**Gimmick**: Lift flip-mode + Destroy free-plate LAD  
**Engine Note**: I_total = 2.706×10⁻⁵ kg·m² · L₀ = 18.94 mN·m·s · dω/dt −51.1 rad/s² (base) + Lift scrape events → practical t_stall 6–10 s · N_burst_opponent ~3 hits

---

### [Case 1569 — Energy Layer: Tornado Wyvern (Burst God System)](./9%20case%20study.md#case-1569)

**System**: Burst God System (B-35) · Defense Type  
**Geometry**: 9.2 g · top layer 5.06 g solid (r_o 3.4 cm) · bottom ring 4.14 g free-spinning (r_mean 2.8 cm) · 8 blades each layer · 4 short teeth n_eff 3  
**Material**: ABS plastic (top solid + translucent lower free-spin ring)  
**Spin Coupling**: top rigid; bottom ring free-spinning  
**Contact Points**: top layer r_o 3.4 cm · 8 blades with 22.5° gap between each (50% gap probability per hit)  
**Movement Freedom**: free-spinning lower ring (absorbs tangential impact components)  
**Base Stats**: effective burst threshold 60.6 mN·m input (solid contact) vs 30 mN·m (gap contact) · ring absorption fraction f = 0.505  
**Mechanism**: Free ring absorbs 50.5% of each hit's tangential component → effective burst resistance boosted despite short teeth (n_eff 3, τ_floor_short 10 mN·m). With ring: threshold 60.6 mN·m input (8% better than standard 4-tooth bey). Gap vulnerability: 50% of hits contact between blades → full transfer to ratchet, threshold only 30 mN·m → burst in 1 hit from 120 mN·m attacker. Ring-body friction: operates near-synchronously most of battle → stamina penalty not catastrophic (drag only during ring spin-up and impact recovery).  
**2.5D Rendering**: 8-blade top layer at r_o 3.4 cm · translucent 8-blade ring at r 2.8 cm  
**Gimmick**: free-spinning ring impact absorption → `free_spin` (f_absorbed = 0.505; gap-contact bypass; gap probability 0.5)  
**Engine Note**: I_TW_coupled = 6.421×10⁻⁶ kg·m²; n_eff 3; burst threshold: 60.6 mN·m (solid) / 30 mN·m (gap); ring: f_absorbed 0.505; ring friction: negligible at steady state

---

### [Case 1570 — Forge Disc: 4 (Burst God System)](./9%20case%20study.md#case-1570)

**System**: Burst God System · primary Stamina-oriented Core Disc  
**Geometry**: 21.11 g · r_i 0.8 cm · major axis r_o 3.6 cm · minor axis r_o 2.2 cm · "4"/"IV" protrusion labels at outermost positions  
**Material**: zinc alloy die-cast  
**Spin Coupling**: rigid  
**Contact Points**: none (disc level)  
**Movement Freedom**: fixed (accepts Disc Frames at major-axis slots)  
**Base Stats**: I = 1.187×10⁻⁵ kg·m²; OWD factor 1.433 (43.3% higher I vs uniform distribution at same r_outer)  
**Mechanism**: Primary stamina disc. High OWD: extended protrusions at r_o 3.6 cm store more angular momentum per gram vs disc with uniform distribution. I_4 vs I_uniform_28mm: ratio 1.433. More mass at larger r → larger L per gram → better KO resistance and spin persistence. Accepts Glaive, Cross, Star, Bump etc. Frames for further configuration.  
**2.5D Rendering**: elliptical disc at r_o 3.6 cm · "4" protrusion label detail  
**Gimmick**: none  
**Engine Note**: I = 1.187×10⁻⁵ kg·m² · OWD factor 1.433; confirmed mass 21.11 g

---

### [Case 1571 — Disc Frame: Glaive (Burst God System)](./9%20case%20study.md#case-1571)

**System**: Burst God System  
**Geometry**: 2.34 g · r_i 2.0 cm · r_o 3.6 cm (ring) · two sharp wave protrusions at r ≈ 3.8 cm (pointing upward, no floor scrape)  
**Material**: ABS plastic  
**Spin Coupling**: rigid (mounts on Disc 4)  
**Contact Points**: smooth round perimeter at r_o 3.6 cm (continuous arc → optimal LAD contact with stadium wall/floor)  
**Movement Freedom**: fixed  
**Base Stats**: I = 2.228×10⁻⁶ kg·m²; LAD — excellent (second only to Cross); upward protrusions prevent floor scrape  
**Mechanism**: Round outer profile → continuous contact arc during precession → bowl wall normal force acts steadily → longer effective precession path. Upward protrusions avoid adding floor-scrape drag. LAD duration extension: estimated +3–6 s vs no-Frame. Primary use: stamina/defense combos where smooth perimeter maximises both spin persistence and LAD.  
**2.5D Rendering**: smooth ring at r_o 3.6 cm · 2 upward-pointing wave protrusions at r 3.8 cm  
**Gimmick**: none (passive LAD surface)  
**Engine Note**: I = 2.228×10⁻⁶ kg·m²; LAD: continuous arc contact → +3–6 s precession extension

---

### [Case 1572 — Performance Tip: Atomic (Burst God System)](./9%20case%20study.md#case-1572)

**System**: Burst God System  
**Geometry**: ~6.0 g (est.) · free-rotating ball r_ball ≈ 0.325 cm · four-tab free-spinning ring r_tab ≈ 1.5 cm · two independently decoupled elements  
**Material**: ABS housing · polycarbonate ball · ABS four-tab ring  
**Spin Coupling**: ball free-rotating (rolling friction); ring free-spinning (LAD)  
**Contact Points**: ball μ_roll ≈ 0.01 at r 0.325 cm (primary, battle phase); four-tab ring r 1.5 cm during severe tilt (less frequent — large ball diameter makes floor contact rare)  
**Movement Freedom**: ball and ring both independently decoupled  
**Base Stats**: τ_roll = 1.228×10⁻⁵ N·m (63× lower than flat ABS XF tip); theoretical spin-out ~10³ s (tip-only; air drag dominates at high ω); TT variant has weaker burst spring (τ_floor ≈ 12 mN·m) vs Orbit (14–16 mN·m) and Hasbro V2  
**Mechanism**: Ball rolls on floor rather than sliding → rolling friction vs sliding friction → 63× friction reduction vs flat ABS. Spin decay at high ω dominated by aerodynamic drag. At low ω, drag drops with ω² → ball's near-zero tip friction → bey persists at low ω longer than opponents with flat/rubber tips. Ball free-rotation absorbs ~5–10% of tangential impact components (similar to Tornado Wyvern ring but smaller scale). Three Hasbro variants per Case 1379 note.  
**2.5D Rendering**: ball tip protruding ~3 mm below housing · 4-tab ring at r 1.5 cm  
**Gimmick**: free-rotating ball + free-spinning ring → `free_spin_tip` + `lad_ring`  
**Engine Note**: I_housing ≈ 1.5×10⁻⁷ kg·m² · τ_roll = 0.01 × m × g × 0.00325; air drag dominates above ω ~200 rad/s; burst spring weaker than Orbit: τ_floor ≈ 12 mN·m (TT), ~14–16 mN·m (Hasbro V2)

---

### [Case 1573 — Assembly: Tornado Wyvern 4Glaive Atomic (Burst God System)](./9%20case%20study.md#case-1573)

**System**: Burst God System / Defense + Stamina hybrid  
**Geometry**: total ~38.65 g · ω₀ 700 rad/s  
**Material**: see component cases  
**Spin Coupling**: rigid assembly · Wyvern bottom ring free-spinning · Atomic ball and ring free-rotating/spinning  
**Contact Points**: Tornado Wyvern top layer r_o 3.4 cm · 50% gap probability per hit; Atomic ball r 0.325 cm  
**Movement Freedom**: Wyvern free ring; Atomic ball + ring  
**Base Stats**: I_total = 2.073×10⁻⁵ kg·m²; L₀ = 14.51 mN·m·s; t_stall dominated by air drag (not tip friction); burst: 60.6 mN·m solid / 30 mN·m gap; top competitive tier vs stamina opponents  
**Mechanism**: Defense/stamina hybrid. Atomic ball near-zero tip friction → spin decay dominated by air drag (τ_air ≈ 7×10⁻⁴ N·m at ω 420 → dω/dt −33.8 rad/s²; at ω 150 drops to −4.3 rad/s²). The dramatic slowdown in spin decay rate at low ω is the key competitive property: vs stamina opponents (flat/rubber tips), those tips continue draining spin even at low ω while Atomic ball does not → outlasts all such opponents. Disc 4 OWD + Glaive LAD amplify stamina and extend spin time. Tornado Wyvern free ring compensates short teeth vs solid contacts. Primary failure mode: opponent consistently contacts blade gaps → burst 1–2 hits.  
**2.5D Rendering**: Wyvern 8-blade top + translucent bottom ring · Disc 4 elliptical · Glaive smooth ring · Atomic ball tip  
**Gimmick**: Wyvern free ring absorption + Atomic ball free-rotation + Glaive LAD  
**Engine Note**: I_total = 2.073×10⁻⁵ kg·m² · L₀ = 14.51 mN·m·s · dω/dt varies with ω² (air-drag model required); burst 60.6/30 mN·m (solid/gap); ring f_absorbed 0.505; ball τ_roll = 1.228×10⁻⁵ N·m

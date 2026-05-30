# BEYBLADE CASE STUDY INDEX — Part C (Cases 1051–1600)
> Phase 0 audit complete · All geometry in cm · PX_PER_CM = 24
> True case count: 1660 unique numbered cases · Highest: 1873 · Next Available: 1874

## CS6 Overflow — Cases 1051–1087 {#cs6-overflow}
Source: `6 case study.md` (overflow block — Zero-G Crystal/Chrome Wheels, ZeroG tracks/tips, and some MFB parts; formerly lettered cases 308a–354j)

---

### [Case 1051 — Bottom: Jog Ball / JB](./6%20case%20study.md#case-1051)

**System**: Gen2-MFB / MFS  
**Geometry**: Nominal ball R ≈ 0.43 cm; spike tip r ≈ 0.05 cm; full disc r ≈ 0.78 cm · height ≈ 0.90 cm  
**Material**: ABS · μ_k = 0.35 · Hertzian spike-tip contact (single-spike Hertzian)  
**Spin Coupling**: rigid  
**Contact Points**: spike tip r ≈ 0.005 cm Hertzian (a = 0.052 mm) · floor contact  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 40 · Stamina 85 · Speed 30  
**Mechanism**: Spike-covered ball surface: contact area 76% smaller than WB, reducing spinning friction torque. dω/dt = 0.167 rad/s² (better stamina than WB 0.344, B 0.300; slightly worse than MB 0.144). Competitive use: L-Drago 100JB destabilizer — spike micro-torque pulses at ~150 Hz inject erratic lateral impulse on each glancing strike.  
**2.5D Rendering**: z_cm ≈ 0 · heightProfile: spherical spike array  
**Gimmick**: Spike contact geometry → `spikeContactTip` handler; centering spring k = 114 N/m  
**Engine Note**: contactRadius = spikeContactRadius(r_spike=0.05mm, W); dω/dt integrates spike-tip Hertzian torque

---

### [Case 1052 — Fusion Wheel: Forbidden](./6%20case%20study.md#case-1052)

**System**: Gen2-MFB / HWS · Balance  
**Geometry**: r_o ≈ 2.37 cm · r_i ≈ 0.80 cm · 2 gaps each ~50° · 260° of solid arc (72.2% ring retained)  
**Material**: Zinc alloy (standard MFB wheel) · μ_k via tip · e varies by contact angle  
**Spin Coupling**: rigid  
**Contact Points**: 4 gap-wall edges (2 per gap) at φ ≈ 45° · r ≈ 2.37 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 50 · Defense 50 · Stamina 60 · Speed 50  
**Mechanism**: Two 180°-opposed circular gaps on an otherwise near-circular wheel. Gap-wall angle φ ≈ 45°: smash fraction = cos(45°) = 0.707, recoil fraction = sin(45°) = 0.707 — equal smash and recoil per contact. I ≈ 7.97×10⁻⁶ kg·m² (est.); L ≈ 1.20×10⁻³ kg·m²/s at launch. Mid-tier stamina; high recoil compromises both attack and defense roles.  
**2.5D Rendering**: z_cm ≈ 1.8 · 2-fold gap symmetry  
**Gimmick**: Gap-wall contact → gapSmashRecoil(phi=45°) → balanced impulse split  
**Engine Note**: contactAngle = 45°; smash and recoil both at 0.707× factor

---

### [Case 1053 — Track: Eternal Defense 145 / ED145](./6%20case%20study.md#case-1053)

**System**: Gen2-MFB / HWS · Track · 14.5 mm height  
**Geometry**: 3 free-rotating wings · pivot r ≈ 0.50 cm · wing outer r ≈ 1.50 cm · h = 1.45 cm  
**Material**: ABS plastic wings · friction-fit plastic pivot (no bearing)  
**Spin Coupling**: wings free on plastic pivot  
**Contact Points**: wing outer faces at r ≈ 1.50 cm per wing  
**Movement Freedom**: wings rotate freely about plastic pivot shaft  
**Base Stats**: Attack 0 · Defense 65 · Stamina 50 · Speed 0  
**Mechanism**: Three wings rotate on a plain plastic friction-fit pivot. Pivot friction τ_pivot = μ × F_N × r_pivot ≈ 2.63×10⁻³ N·m at typical impact — steals ~12% of impact energy vs BD145 (bearing pivot ≈ τ=0). Below BD145 and C145 in defense effectiveness. Standard 145-height positioning useful for stamina wobble endurance.  
**2.5D Rendering**: z_cm = 1.45 track height · 3 radial wings  
**Gimmick**: Wing hit absorption → `frictionPivotWing` (12% energy loss per hit vs bearing pivot)  
**Engine Note**: I_wing = 1.33×10⁻⁸ kg·m² each; pivot friction reduces absorption efficiency

---

### [Case 1054 — Bottom: Flat Ball / FB](./6%20case%20study.md#case-1054)

**System**: Gen2-MFB / HWS · Bottom · compound tip  
**Geometry**: Annular flat ring r_inner = 0.15 cm · r_outer = 0.35 cm · ball R ≈ 0.25 cm · protrusion δ ≈ 0.05 cm · θ_flat ≈ 8.2°  
**Material**: ABS (both zones) · μ_k = 0.35  
**Spin Coupling**: rigid  
**Contact Points**: Phase 1 (upright θ < 8.2°): ball tip a = 0.088 mm · Phase 2 (tilted θ > 8.2°): annular flat r_eff = 0.263 cm  
**Movement Freedom**: fixed — tilt threshold switches mode  
**Base Stats**: Attack 30 · Defense 30 · Stamina 60 · Speed 40  
**Mechanism**: Central ball (R=2.5mm) protrudes 0.5mm above flat annular ring. Upright: ball contact dω/dt = 0.284 rad/s² (5% better stamina than B). Tilted: flat ring contact dω/dt = 45.1 rad/s² (159× faster decay). θ_flat = 8.2° (same order as CS). Wears quickly under impact loads; ABS ball sustains 306 MPa peak stress (6.8× yield) on attack contact.  
**2.5D Rendering**: z_cm ≈ 0 · compound tip cross-section  
**Gimmick**: Tilt-threshold compound → `flatBallCompound(theta_flat=8.2°)` handler  
**Engine Note**: Phase switch at θ = 8.2°; track phase 1 → Hertzian ball, phase 2 → annular flat

---

### [Case 1055 — Clear Wheel: Eonis / Ionis](./6%20case%20study.md#case-1055)
> [Hasbro: Ionis]

**System**: Gen2-MFB / HWS · Clear Wheel  
**Geometry**: 2-fold horn symmetry (2 bull/cow heads at 180°) · r_i ≈ 1.0 cm · r_o ≈ 2.3 cm  
**Material**: Polycarbonate ABS · cosmetic  
**Spin Coupling**: rigid (seated atop Metal Wheel)  
**Contact Points**: none significant (cosmetic ring)  
**Movement Freedom**: fixed  
**Base Stats**: (cosmetic — use Forbidden wheel stats)  
**Mechanism**: 2.8 g Clear Wheel contributing ~10% of combined Wheel+CW inertia (I ≈ 8.81×10⁻⁷ kg·m²). C₂ symmetry matches Forbidden's 2-fold gap symmetry. Best assembly: align Eonis horns over Forbidden gaps to partially restore angular momentum over gap arcs and reduce 2-node wobble.  
**2.5D Rendering**: z_cm ≈ 0.3 (cosmetic layer above wheel) · negligible physics  
**Engine Note**: Cosmetic ring preset; motifImage swap only for new variants

---

### [Case 1056 — Fusion Wheel: Dark](./6%20case%20study.md#case-1056)

**System**: Gen2-MFB / MFS · Balance (non-competitive)  
**Geometry**: 12 spikes evenly spaced at 30° intervals (C₁₂) · r_o ≈ 2.37 cm  
**Material**: Zinc alloy · 31.4 g  
**Spin Coupling**: rigid  
**Contact Points**: 12 near-uniform perimeter spike tips  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 20 · Stamina 20 · Speed 30  
**Mechanism**: Near-circular 12-fold symmetric wheel with too-small individual protrusions for meaningful smash and too-frequent contact discontinuities for clean stamina. I distributes over large cross-section (lower I per gram than edge-concentrated wheels). No competitive use: insufficient smash for attack, perimeter disruptions harm stamina, insufficient mass for defense.  
**2.5D Rendering**: z_cm ≈ 1.8 · C₁₂ spike perimeter  
**Gimmick**: 12-point contact frequency → uniform scatter impulse (non-competitive)  
**Engine Note**: 12-node uniform contact; no attack specialization

---

### [Case 1057 — Bottom: Flat Spike / Flat Sharp / FS](./6%20case%20study.md#case-1057)

**System**: Gen2-MFB / MFS · Bottom · compound tip  
**Geometry**: Sharp cone at center (half-angle ~32.5°) · flat ring r_inner ≈ 0.08 cm · r_outer ≈ 0.25 cm · protrusion δ ≈ 0.03 cm · θ_flat ≈ 6.9°  
**Material**: ABS · μ_k = 0.35  
**Spin Coupling**: rigid  
**Contact Points**: Phase 1 (upright): sharp cone tip (Sneddon regime) · Phase 2 (tilted θ > 6.9°): narrow flat ring r_eff ≈ 0.18 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 25 · Defense 15 · Stamina 55 · Speed 45  
**Mechanism**: ABS sharp cone (dω/dt ≈ 0.112 rad/s², same as S tip) surrounded by narrow flat ring (r_o = 0.25 cm vs FB = 0.35 cm, WF = 0.50–0.70 cm). Tilt mode dω/dt ≈ 30.8 rad/s² (275× upright rate). Both phases mediocre: narrow flat insufficient for destabilization, ABS sharp wears quickly. Balance compromise.  
**2.5D Rendering**: z_cm ≈ 0 · compound cone+annular  
**Engine Note**: Distinguish from F:S (Final Survive — different part entirely); FS = compound cone+flat ring

---

### [Case 1058 — Clear Wheel: Wolf](./6%20case%20study.md#case-1058)

**System**: Gen2-MFB / MFS · Clear Wheel · C₄ symmetry  
**Geometry**: 4 wolf-head motifs at 90° intervals · r_i ≈ 1.0 cm · r_o ≈ 2.2 cm  
**Material**: Polycarbonate · 3.1 g  
**Spin Coupling**: rigid  
**Contact Points**: cosmetic ring; 4-node mass distribution provides gyroscopic stability  
**Movement Freedom**: fixed  
**Base Stats**: (cosmetic)  
**Mechanism**: 3.1 g CW with strict C₄ (4-fold) rotational symmetry. Four equal nodes damp precession-rate oscillation; resists 2-node wobble mode better than 2-fold wheels (e.g. Aquila). ~10–11% of combined Wheel+CW inertia. Value: stability enhancement rather than angular momentum addition.  
**2.5D Rendering**: z_cm ≈ 0.3 cosmetic · C₄ node distribution  
**Engine Note**: Cosmetic ring; C₄ flag for stability bonus in precession model

---

### [Case 1059 — Fusion Wheel: Poison](./6%20case%20study.md#case-1059)

**System**: Gen2-MFB / HWS · Balance (non-competitive)  
**Geometry**: 15 rectangular teeth at 24° spacing (C₁₅) · r_o ≈ 2.37 cm · raised base (exposes track)  
**Material**: Zinc alloy · 29.8 g · tooth face angle φ ≈ 80–85° from tangent  
**Spin Coupling**: rigid  
**Contact Points**: 15 near-perpendicular rectangular tooth faces → near-pure recoil  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 15 · Stamina 20 · Speed 30  
**Mechanism**: Near-perpendicular tooth faces (φ ≈ 80–85°): smash ≈ cos(85°) ≈ 0.087, recoil ≈ sin(85°) ≈ 0.996. Despite high open-spoke I ≈ 9.32×10⁻⁶ kg·m² (near-equal to Earth at less mass), all energy lost to recoil. Raised base exposes Spin Track to opponent contact. 15 contacts every 2.8 ms at 150 rad/s → constant self-destabilization. No competitive use.  
**2.5D Rendering**: z_cm ≈ 2.0 raised base · 15 rectangular teeth  
**Engine Note**: Near-pure recoil contact; raised base flag lowers effective wheel height

---

### [Case 1060 — Fusion Wheel: Spiral](./6%20case%20study.md#case-1060)
> JP name: Screw (スクリュー)

**System**: Gen2-MFB / HWS · Attack · Upper Smash hybrid  
**Geometry**: 3 upward-curving wings at 120° (C₃) · r_o ≈ 2.20 cm · wing face angle 20–32° from horizontal  
**Material**: Zinc/ABS composite HWS wheel · 34.2 g  
**Spin Coupling**: rigid  
**Contact Points**: 3 oval-face protrusions · r ≈ 2.0 cm · φ_horizontal = 20–32°  
**Movement Freedom**: fixed  
**Base Stats**: Attack 70 · Defense 30 · Stamina 40 · Speed 55  
**Mechanism**: Three upward-curving wings produce Upper Smash Attack: horizontal smash cos(20–32°) ≈ 0.85–0.93, vertical lift sin(20–32°) ≈ 0.37–0.53. Not pure Upper Attack (needs ≥ 45° for dominance). At 34.2 g provides 14.6% more I than Storm (30.4 g). Best with small Energy Rings (Pisces, Tempo) exposing metal faces; 90-track height mandatory.  
**2.5D Rendering**: z_cm ≈ 1.5 · upward-curving 3-wing silhouette  
**Gimmick**: Upper smash hybrid → `upperSmashHybrid(phi_horiz=26°)` → partial vertical impulse  
**Engine Note**: φ_horizontal ≈ 26° average; vertical impulse component = sin(26°) × F_contact

---

### [Case 1061 — Clear Wheel: Serpent](./6%20case%20study.md#case-1061)

**System**: Gen2-MFB / HWS · Clear Wheel  
**Geometry**: 8 overlapping serpent bodies (effective C₄ symmetry from paired overlap) · r_i ≈ 1.0 cm · r_o ≈ 2.2 cm  
**Material**: Polycarbonate · 2.9 g  
**Spin Coupling**: rigid  
**Contact Points**: cosmetic  
**Movement Freedom**: fixed  
**Base Stats**: (cosmetic)  
**Mechanism**: 2.9 g CW with Celtic-knot serpent pattern producing effective C₄ symmetry (four paired element groups). Marginally more stable than C₂ rings. ~9.3% of combined Wheel+CW inertia — negligible for competitive purposes.  
**2.5D Rendering**: z_cm ≈ 0.3 cosmetic  
**Engine Note**: Cosmetic ring preset; effective C₄ symmetry flag

---

### [Case 1062 — Chrome Wheel: Ifraid](./6%20case%20study.md#case-1062)

**System**: Gen2-ZeroG / Synchrome · Attack (Warrior Wheel)  
**Geometry**: 3 extended attack wings with jagged contact faces · r_outer ≈ 2.5 cm  
**Material**: Metal alloy · 51.26 g (heaviest Chrome Wheel in ZeroG lineup)  
**Spin Coupling**: rigid (part of Synchrome stack)  
**Contact Points**: 3 jagged wing faces · r ≈ 2.3–2.5 cm · smash-dominant geometry  
**Movement Freedom**: fixed  
**Base Stats**: Attack 95 · Defense 50 · Stamina 65 · Speed 70  
**Mechanism**: 51.26 g — 5.66 g heavier than 2nd-place Begirados (45.6 g). Always the angular momentum leader in any Synchrome assembly regardless of partner wheel. Three extended attack wings deliver strong smash at outer radii. Stock combo: Saramanda Ifraid W145CF — definitive ZeroG Attack Synchrome.  
**2.5D Rendering**: z_cm ≈ 2.2 · 3-wing attack profile  
**Gimmick**: Heaviest Chrome Wheel → dominant L in all Synchrome pairings; smash-dominant 3-wing  
**Engine Note**: Mass = 51.26 g; assign highest I among ZeroG Chrome Wheels

---

### [Case 1063 — Chrome Wheel: Begirados](./6%20case%20study.md#case-1063)

**System**: Gen2-ZeroG / Synchrome · Balance (heavy defensive profile)  
**Geometry**: Large round wheel with hollow spaces and ribs · Bahamut-like monster head with open jaw, fang, horn  
**Material**: Metal alloy · 45.6 g (second-heaviest ZeroG Chrome Wheel)  
**Spin Coupling**: rigid  
**Contact Points**: broad distributed contact profile (balance geometry)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 50 · Defense 70 · Stamina 70 · Speed 50  
**Mechanism**: 45.6 g with broad contact geometry. Does not specialize — wins by sheer mass sustaining angular momentum through contact. Best Synchrome partner for Ifraid (bottom wheel); provides structural mass without competing with Ifraid's attack profile.  
**2.5D Rendering**: z_cm ≈ 2.0 · round balance profile  
**Engine Note**: 45.6 g (corrects linka file discrepancy of 30.5 g — that is wrong)

---

### [Case 1064 — Chrome Wheel: Goreim](./6%20case%20study.md#case-1064)

**System**: Gen2-ZeroG / Synchrome · Defense  
**Geometry**: Compact golem-themed round defense profile · r_outer ≈ 1.9 cm  
**Material**: Metal alloy · 21.04 g (light end of ZeroG Chrome Wheel hierarchy)  
**Spin Coupling**: rigid  
**Contact Points**: low-recoil round profile · near-circular deflection  
**Movement Freedom**: fixed  
**Base Stats**: Attack 25 · Defense 60 · Stamina 55 · Speed 35  
**Mechanism**: 21.04 g — near bottom of ZeroG mass hierarchy. Low-recoil round contact surface. Value in Synchrome: acts as bottom wheel adding mass when paired with Begirados or Dragooon without altering top wheel's attack profile. Solo chassis: outclassed defensively by heavier peers.  
**2.5D Rendering**: z_cm ≈ 1.8 · compact round  
**Engine Note**: 21.04 g; defense role, lower I contribution in Synchrome stack

---

### [Case 1065 — Chrome Wheel: Saramanda](./6%20case%20study.md#case-1065)

**System**: Gen2-ZeroG / Synchrome · Attack (bottom wheel in Ifraid Synchrome)  
**Geometry**: Fire salamander tail curves · moderate smash faces · r_outer ≈ 2.2 cm  
**Material**: Metal alloy · 25.35 g  
**Spin Coupling**: rigid  
**Contact Points**: salamander-tail curved faces · moderate smash geometry  
**Movement Freedom**: fixed  
**Base Stats**: Attack 55 · Defense 40 · Stamina 55 · Speed 50  
**Mechanism**: 25.35 g. Primary role: bottom wheel in Saramanda Ifraid W145CF Synchrome — provides structural support while Ifraid (51.26 g, top) dominates angular momentum and contact. Own attack profile secondary to function as stable mass base.  
**2.5D Rendering**: z_cm ≈ 1.8 · curved salamander-tail profile  
**Engine Note**: 25.35 g; typically bottom wheel in Ifraid Synchrome stack

---

### [Case 1066 — Chrome Wheel: Orojya](./6%20case%20study.md#case-1066)

**System**: Gen2-ZeroG / Synchrome · Stamina/Balance  
**Geometry**: Serpentine curved perimeter · moderate smash contact · r_outer ≈ 2.2 cm  
**Material**: Metal alloy · 25.94 g (heaviest of lighter-tier ZeroG wheels)  
**Spin Coupling**: rigid  
**Contact Points**: curved serpentine faces  
**Movement Freedom**: fixed  
**Base Stats**: Attack 40 · Defense 50 · Stamina 60 · Speed 45  
**Mechanism**: 25.94 g — flexible Synchrome partner without specialization. Orochi (eight-headed serpent) motif; associates with 500-track Pirate builds. Slightly heavier than Saramanda (25.35 g) in same weight class; interchangeable as bottom-wheel Synchrome partner.  
**2.5D Rendering**: z_cm ≈ 1.8 · serpentine curved  
**Engine Note**: 25.94 g; Pirate-faction builds

---

### [Case 1067 — Chrome Wheel: Girago](./6%20case%20study.md#case-1067)

**System**: Gen2-ZeroG / Synchrome · Attack  
**Geometry**: Giraffe neck silhouette → 2 major contact points at outer radii · angular protrusions  
**Material**: Metal alloy · 29.8 g (mid-heavy tier)  
**Spin Coupling**: rigid  
**Contact Points**: 2 main angular protrusions · r ≈ 2.1–2.3 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 65 · Defense 40 · Stamina 55 · Speed 55  
**Mechanism**: 29.8 g. Angular protrusions produce smash-dominant contact. Mid-heavy tier alongside Wyvang (30.6 g) and Genbull (30.4 g) — suitable solo attack or secondary Synchrome partner adding smash without excess recoil.  
**2.5D Rendering**: z_cm ≈ 2.0 · angular giraffe-neck protrusion  
**Engine Note**: 29.8 g; 2-node smash contact geometry

---

### [Case 1068 — Chrome Wheel: Balro](./6%20case%20study.md#case-1068)

**System**: Gen2-ZeroG / Synchrome · Attack  
**Geometry**: Demon/beast (Balrog) motif · prominent attack protrusions  
**Material**: Metal alloy · 29.4 g (near-identical to Girago 29.8 g)  
**Spin Coupling**: rigid  
**Contact Points**: attack protrusions at outer radius  
**Movement Freedom**: fixed  
**Base Stats**: Attack 65 · Defense 38 · Stamina 52 · Speed 55  
**Mechanism**: 29.4 g. Near-identical to Girago (0.4 g diff → < 0.5% inertia variation). Balro, Girago, and Wyvang are effectively interchangeable as Synchrome attack partners at this mass tier.  
**2.5D Rendering**: z_cm ≈ 2.0 · beast-motif attack protrusions  
**Engine Note**: 29.4 g; interchangeable with Girago at this tier

---

### [Case 1069 — Chrome Wheel: Genbull](./6%20case%20study.md#case-1069)

**System**: Gen2-ZeroG / Synchrome · Defense  
**Geometry**: Bull-horned design · broad round deflection profile · r_outer ≈ 2.2 cm  
**Material**: Metal alloy · 30.4 g (heavier defense tier)  
**Spin Coupling**: rigid  
**Contact Points**: broad horned deflection faces — deflects rather than smashes  
**Movement Freedom**: fixed  
**Base Stats**: Attack 35 · Defense 72 · Stamina 65 · Speed 40  
**Mechanism**: 30.4 g defense chassis — heaviest in mid-tier defense group. Broad horned profile deflects contact force around circumference. Competitive stamina-retention with F230 + TB combination (Bandid Genbull F230TB stock build).  
**2.5D Rendering**: z_cm ≈ 2.0 · broad horned deflection profile  
**Engine Note**: 30.4 g; deflection-dominant contact model

---

### [Case 1070 — Chrome Wheel: Wyvang](./6%20case%20study.md#case-1070)

**System**: Gen2-ZeroG / Synchrome · Attack  
**Geometry**: Wyvern wing silhouette · angular attack protrusions  
**Material**: Metal alloy · 30.6 g (heaviest mid-tier, second-heaviest non-top-5 overall)  
**Spin Coupling**: rigid  
**Contact Points**: wing-edge protrusions · smash-dominant at r ≈ 2.2 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 68 · Defense 42 · Stamina 56 · Speed 58  
**Mechanism**: 30.6 g. Optimal attack weight: heavy enough for angular momentum endurance, light enough for sharp attack vectors without Begirados-level recoil penalty. Wyvern wings create smash-dominant sharp contact geometry.  
**2.5D Rendering**: z_cm ≈ 2.0 · wyvern wing profile  
**Engine Note**: 30.6 g; sharp-vector smash contact, minimal self-recoil

---

### [Case 1071 — Chrome Wheel: Leviathan](./6%20case%20study.md#case-1071)

**System**: Gen2-ZeroG / Synchrome · Defense  
**Geometry**: Sea-serpent revolver-pattern contact · near-circular distributed contact profile · r_outer ≈ 2.1 cm  
**Material**: Metal alloy · 27.31 g (mid-tier between Orojya and Genbull)  
**Spin Coupling**: rigid  
**Contact Points**: revolver-pattern curved faces distributing impact around circumference  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 68 · Stamina 62 · Speed 38  
**Mechanism**: 27.31 g. Revolver contact geometry distributes collision force around circumference — ideal defense mechanism. Smoothest contact profile in ZeroG lineup. Stock builds: Guardian Leviathan 160SB (Kite), Goreim Leviathan E230SB stamina Synchrome.  
**2.5D Rendering**: z_cm ≈ 1.9 · revolver-pattern smooth perimeter  
**Engine Note**: 27.31 g; distributed contact for defense; smoothest recoil curve of ZeroG wheels

---

### [Case 1072 — Spin Track: W145 (Wing 145) — ZeroG](./6%20case%20study.md#case-1072)

**System**: Gen2-ZeroG / Synchrome · Track · 14.5 mm height  
**Geometry**: 14.5 mm height · ~24.0 mm outer width with wing protrusions · ~1.5 g  
**Material**: ABS/PC plastic  
**Spin Coupling**: rigid  
**Contact Points**: wings at r ≈ 1.2 cm  
**Movement Freedom**: fixed (no wing extension mechanism)  
**Base Stats**: (track component)  
**Mechanism**: Wing skirt extending bey's effective perimeter. Negligible aerodynamic effect at typical spin speeds (intended downforce not realized). Primary role: moderate 145-height positioning for attack builds against standard-height opponents; shorter than 160/230, taller than 85–125.  
**2.5D Rendering**: z_cm = 1.45 track height · wing protrusion silhouette  
**Engine Note**: h = 1.45 cm; wing geometry cosmetic (no aerodynamic effect in game engine)

---

### [Case 1073 — Spin Track: LW160 (Left Wing 160) — ZeroG](./6%20case%20study.md#case-1073)

**System**: Gen2-ZeroG / Synchrome · Track · 16.0 mm height  
**Geometry**: 16.0 mm height · ~23.0 mm outer · ~1.6 g · left-facing wing protrusions  
**Material**: ABS/PC plastic  
**Spin Coupling**: rigid  
**Contact Points**: wings at r ≈ 1.15 cm  
**Movement Freedom**: fixed  
**Base Stats**: (track component)  
**Mechanism**: Left-wing skirt at 16.0 mm — taller than W145. Designed for left-spin Dragoon Chrome Wheel. Left-orientation theoretical downforce interaction with floor rotation; negligible in practice. Taller profile increases Chrome Wheel reach height — useful vs 145-height opponents in left-spin context. Vulnerability: low-attacker clipping at sub-160 heights.  
**2.5D Rendering**: z_cm = 1.60 track height · left-facing wing protrusion  
**Engine Note**: h = 1.60 cm; left-spin context; wing cosmetic

---

### [Case 1074 — Spin Track: 500 (50.0 mm Extreme Height) — ZeroG](./6%20case%20study.md#case-1074)

**System**: Gen2-ZeroG / Synchrome · Track · extreme height  
**Geometry**: h = 5.00 cm (50.0 mm) — tallest track in franchise history · tube body  
**Material**: ABS/PC plastic  
**Spin Coupling**: rigid  
**Contact Points**: Chrome Wheel contact at top; extreme height raises CoG near critical  
**Movement Freedom**: fixed  
**Base Stats**: (track component)  
**Mechanism**: 50.0 mm — longest track ever released across all Beyblade generations. Stock combo: Pirate Orochi 500E. Enables top-down Smash Attack unreachable by all sub-230 opponents (immune to Upper Attack). Physics edge case: extreme CoG elevation makes bey uniquely vulnerable to lateral toppling forces harmless to standard builds.  
**2.5D Rendering**: z_cm = 5.00 track height — extreme height rendering  
**Engine Note**: h = 5.00 cm; high CoG instability flag; immune to Upper Attack from sub-230 opponents

---

### [Case 1075 — Track: SP230 (Spike 230)](./6%20case%20study.md#case-1075)

**System**: Gen2-ZeroG / Synchrome · Track · 23.0 mm height  
**Geometry**: h = 2.30 cm · body w ≈ 2.50 cm · 4 downward spike claws · mass ≈ 4.3 g  
**Material**: ABS/PC · claw μ ≈ 0.14 on ZeroG stadium floor  
**Spin Coupling**: rigid  
**Contact Points**: 4 spike claws at r ≈ 1.25 cm · floor / stadium slope  
**Movement Freedom**: fixed  
**Base Stats**: (track component — ZeroG claw anchor)  
**Mechanism**: Four BD145-style downward spike claws engage the tilted ZeroG stadium floor. Claw friction resists slope-push: 14% of centrifugal slope force at θ = 15° tilt. Primary stock combo: Gladiator Bahamdia SP230GCF (Kira Hayama's 2nd bey). Pairs with GCF/GF tip for wall-orbit anchor.  
**2.5D Rendering**: z_cm = 2.30 track height · claw protrusions below base  
**Gimmick**: `sp230ClawResistance(tilt_deg, mu_claw)` → 14% slope-push resistance at θ=15°  
**Engine Note**: I_SP230 = 2.24×10⁻⁷ kg·m²; claw anchor modifier +0.14 vs ZeroG slope

---

### [Case 1076 — Track: F230 (Free 230 / Fusion 230)](./6%20case%20study.md#case-1076)

**System**: Gen2-ZeroG / Synchrome · Track · 23.0 mm height  
**Geometry**: h = 2.30 cm · split-body: lower fixed section (60%) + upper free-spinning section (40%) · mass ≈ 2.5 g  
**Material**: ABS/PC  
**Spin Coupling**: upper section free-spins on lower fixed shaft  
**Contact Points**: (track component — no lateral contacts)  
**Movement Freedom**: upper section decoupled  
**Base Stats**: (track component — ZeroG stamina)  
**Mechanism**: Free-spinning upper section decouples Chrome Wheel from floor-contact vibrations; ~40–60% of ground-contact shock absorbed at free joint before reaching Chrome Wheel. Effective system I includes only fixed lower section (5.55×10⁻⁸ kg·m²); upper section excluded. Stock combo: Bandid Genbull F230TB.  
**2.5D Rendering**: z_cm = 2.30 track height  
**Gimmick**: `f230VibrationAttenuation(0.50, F_impact)` → 50% shock absorption at free joint  
**Engine Note**: I_effective = 5.55×10⁻⁸ kg·m² (fixed lower only); impact decoupling −50% shock transmission

---

### [Case 1077 — Track: E230 (Energy 230)](./6%20case%20study.md#case-1077)

**System**: Gen2-ZeroG / Synchrome · Track · 23.0 mm height · sliding disc  
**Geometry**: h = 2.30 cm · disc outer ∅ = 4.80 cm (widest track in franchise) · mass = 7.4 g (heaviest ZeroG track)  
**Material**: ABS/PC disc on stem  
**Spin Coupling**: disc free-rotates AND slides vertically on stem  
**Contact Points**: disc outer edge at r = 2.40 cm · floor/wall  
**Movement Freedom**: disc slides vertically 3–5 mm as bey wobbles  
**Base Stats**: (track component — extreme stamina extension)  
**Mechanism**: At ω < 60% nominal, wobble begins and disc slides down 3–5 mm — lowers CoG ~15%, extending precession period by ~15% (+500 ms survival estimate). I_E230 = 1.597×10⁻⁶ kg·m² (7–20× heavier than other tracks — dominant inertia contributor in any assembly). Stock combo: Goreim Revizer E230SB.  
**2.5D Rendering**: z_cm = 2.30 track height · wide sliding disc silhouette  
**Gimmick**: `e230DiscSlideStaminaBonus(slide_mm, track_h_mm)` → +15% precession period at 3mm slide  
**Engine Note**: I_E230 = 1.597×10⁻⁶ kg·m²; disc r = 2.40 cm; dominant track I contributor

---

### [Case 1078 — Performance Tip: CF (Circle Flat)](./6%20case%20study.md#case-1078)

**System**: Gen2-ZeroG / Synchrome · Tip · wide disc flat  
**Geometry**: disc ∅ = 3.380 cm · flat centre contact r ≈ 0.20 cm · mass = 2.5 g · h ≈ 0.89 cm  
**Material**: ABS disc + plastic flat centre · μ_eff ≈ 0.10 (centre flat + disc floor friction)  
**Spin Coupling**: rigid  
**Contact Points**: flat centre r ≈ 0.20 cm + disc wall engagement at r = 1.69 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 75 · Defense 25 · Stamina 20 · Speed 80  
**Mechanism**: Wide 33.80 mm disc interacts directly with ZeroG stadium floor and walls; each orbital pass converts ~8–12% of centrifugal force to disc wall grip. CF is the definitive ZeroG attack tip. dω/dt = 7.26 rad/s² at full Ifraid Synchrome (~4 s spin life) — short but aggressive. Stock combo: Samurai Ifraid W145CF. Hasbro name = "Claw Flat" (same part; TT canonical = "Circle Flat").  
**2.5D Rendering**: z_cm ≈ 0 · wide disc contact silhouette  
**Gimmick**: Disc wall engagement: `cfWallGrip(mu=0.10, psi=20°)` → +8–12% directional push per orbit  
**Engine Note**: I_CF = 3.78×10⁻⁷ kg·m²; μ_eff = 0.10; decay 7.26 rad/s² (Ifraid system)

---

### [Case 1079 — Performance Tip: BSF (Blade Semi-Flat)](./6%20case%20study.md#case-1079)

**System**: Gen2-ZeroG / Synchrome · Tip · blade-fin semi-flat  
**Geometry**: ∅ = 1.970 cm · 8 blade fins at 40° · h = 1.089 cm · mass = 1.19 g  
**Material**: ABS · μ_fin ≈ 0.12 · semi-flat contact  
**Spin Coupling**: rigid  
**Contact Points**: semi-flat contact + 8 blade fins at r ≈ 0.985 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 50 · Stamina 45 · Speed 40  
**Mechanism**: 8 left-facing blade fins resist ZeroG slope sway-out: ~12% of sway force countered. Left-spin alignment (Dragoon builds) amplifies anti-sway effect via CW micro-torque. Stock combo: Ronin Dragoon LW160BSF (Sakyo Kurayami).  
**2.5D Rendering**: z_cm ≈ 0 · 8-fin perimeter profile  
**Gimmick**: `bsfSwaySout(mu_fin=0.12)` → +0.12 sway resistance; left-spin amplification  
**Engine Note**: I_BSF = 6.31×10⁻⁸ kg·m²; anti-sway modifier +0.12 in ZeroG

---

### [Case 1080 — Performance Tip: BWD (Big Wide Defense)](./6%20case%20study.md#case-1080)

**System**: Gen2-ZeroG / Synchrome · Tip · wide defense cone  
**Geometry**: tip w ≈ 1.50 cm · h ≈ 0.92 cm · 30° cone · mass ≈ 1.0 g  
**Material**: ABS · μ_k (cone) — 30° shallow angle  
**Spin Coupling**: rigid  
**Contact Points**: cone tip at r ≈ 0.75 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 70 · Stamina 50 · Speed 0  
**Mechanism**: Shallower than D (30° vs 35°): smash = 0.866 (vs D = 0.819), recoil = 0.500 (vs D = 0.574) — 12.8% less recoil than D at same contact. Wide stance + shallow angle resists slope-push 8–12% better than narrower tips. Stock combo: Berserker Begirados SR200BWD, Guardian Revizer E230BWD.  
**2.5D Rendering**: z_cm ≈ 0 · wide shallow cone  
**Gimmick**: `bwdRecoil(theta=30°)` → smash 0.866, recoil 0.500  
**Engine Note**: I_BWD = 2.81×10⁻⁸ kg·m²; θ = 30°; slope resistance +8–12% vs narrower tips

---

### [Case 1081 — Performance Tip: GCF (Gear Circle Flat)](./6%20case%20study.md#case-1081)

**System**: Gen2-ZeroG / Synchrome · Tip · gear-edge disc flat  
**Geometry**: disc ∅ = 3.347 cm · mass = 2.5 g · h = 0.888 cm · 8–12 gear teeth on outer perimeter  
**Material**: ABS gear-tooth disc · μ_avg ≈ 0.049 (gear-tooth periodic)  
**Spin Coupling**: rigid  
**Contact Points**: gear teeth r ≈ 1.674 cm · stadium wall engagement  
**Movement Freedom**: fixed  
**Base Stats**: Attack 55 · Defense 30 · Stamina 30 · Speed 65  
**Mechanism**: Gear-cut teeth grip stadium wall inner slope on each orbital pass; micro-locking impulse peaks (+0.20 wall engagement modifier) vs CF's continuous smooth contact. GCF better for sustained outer-ring orbiting; CF better for floor-contact aggression. Stock combo: Gladiator Bahamdia SP230GCF. Fan alias "GF" for this tip is incorrect (GF = Giga Flat, different part).  
**2.5D Rendering**: z_cm ≈ 0 · gear-tooth perimeter disc  
**Gimmick**: `gcfWallEngagement(mu_tooth=0.14, tooth_frac=0.35)` → μ_avg 0.049 + impulse spike +0.20  
**Engine Note**: I_GCF = 3.70×10⁻⁷ kg·m²; gear-tooth wall engagement +0.20 modifier

---

### [Case 1082 — Performance Tip: E (Eternal)](./6%20case%20study.md#case-1082)

**System**: Gen2-ZeroG / MFB · Tip · free-spinning bearing stamina  
**Geometry**: outer housing r ≈ 0.70 cm · inner free axle r ≈ 0.05 cm · mass ≈ 0.8 g  
**Material**: outer ABS housing + bearing · μ_bearing ≈ 0.005  
**Spin Coupling**: inner axle free-spins independently via bearing  
**Contact Points**: inner axle spike point r ≈ 0.05 cm · floor  
**Movement Freedom**: inner axle fully decoupled  
**Base Stats**: Attack 0 · Defense 20 · Stamina 95 · Speed 5  
**Mechanism**: Free-spinning inner axle contacts floor at near-zero relative velocity → μ_effective ≈ 0.005 (91.7% friction reduction vs standard sharp tip μ = 0.06). dω/dt ≈ 0.29 rad/s² — extends spin lifetime ~10–12× vs sharp. Stock combo: Pirate Orochi 500E. Required for 500-track height survival.  
**2.5D Rendering**: z_cm ≈ 0 · spike point contact  
**Gimmick**: `eternalFrictionRatio(mu_bearing=0.005)` → 8.3% of standard sharp friction  
**Engine Note**: μ_bearing = 0.005; I_inner negligible; 91.7% friction reduction vs sharp

---

### [Case 1083 — Performance Tip: TB (Twin Ball)](./6%20case%20study.md#case-1083)

**System**: Gen2-ZeroG / Synchrome · Tip · twin-ball wobble-resonance  
**Geometry**: outer housing w ≈ 1.60 cm · offset inner ball r ≈ 0.45 cm · eccentricity ≈ 1.5 mm · mass ≈ 1.0 g  
**Material**: ABS · μ_ball ≈ 0.090  
**Spin Coupling**: rigid  
**Contact Points**: alternating outer/inner ball contact  
**Movement Freedom**: offset inner ball creates periodic lateral force  
**Base Stats**: Attack 0 · Defense 60 · Stamina 60 · Speed 20  
**Mechanism**: Offset inner ball (eccentricity 1.5 mm) creates 7.1×10⁻³ N periodic lateral force at 1200 rpm — sustains controlled wobble orbit rather than allowing bey to fall flat. Dual-ball contact μ_avg ≈ 0.091. Stock combo: Bandid Genbull F230TB, Bandid Goreim F230TB. Alternate name "Tornado Ball" in some docs.  
**2.5D Rendering**: z_cm ≈ 0 · dual-hemisphere contact  
**Gimmick**: `tbWobbleForce(m_inner, omega, eccentricity=0.0015)` → sustained controlled wobble  
**Engine Note**: I_TB = 2.54×10⁻⁸ kg·m²; eccentricity = 1.5 mm; wobble resonance flag

---

### [Case 1084 — Fusion Wheel: Grand (29.3 g)](./6%20case%20study.md#case-1084)

**System**: Gen2-MFB / HWS · Defense-hybrid  
**Geometry**: r_o ≈ 2.20 cm · 6 wall sections in 3 paired groups · gap void 8.3% of perimeter · textured indents on wall faces  
**Material**: Zinc alloy · 29.3 g  
**Spin Coupling**: rigid  
**Contact Points**: 6 wall faces (near-vertical, θ_indent ≈ 18°) · smash ≈ 0.95, recoil ≈ 0.31 · 8.3% contact time void  
**Movement Freedom**: fixed  
**Base Stats**: Attack 40 · Defense 55 · Stamina 55 · Speed 40  
**Mechanism**: I_Grand = 7.22×10⁻⁶ kg·m² — 22.4% lower than Earth (2nd mold, 33.0 g). Textured indents introduce recoil (~5%) making Grand a smash-hybrid rather than pure defense. Outclassed by Earth in all roles. Grand Capricorn 145D spin time ~12–15 s. Gap voids reduce effective contact by 8.3%.  
**2.5D Rendering**: z_cm ≈ 2.0 · 6-wall 3-group profile  
**Gimmick**: Gap void penalty −8.3% contact time; textured-indent recoil component  
**Engine Note**: I = 7.22×10⁻⁶ kg·m²; contactAngle = 18°; gapVoidFraction = 0.083

---

### [Case 1085 — Energy Ring: Capricorn (2.9 g)](./6%20case%20study.md#case-1085)

**System**: Gen2-MFB / HWS · Energy Ring (Clear Wheel)  
**Geometry**: r_i ≈ 1.0 cm · r_o ≈ 2.1 cm · C₂ symmetry (2 goat heads + horn pairs at 180°) · 2.9 g  
**Material**: Polycarbonate ABS  
**Spin Coupling**: rigid (seated atop Metal Wheel)  
**Contact Points**: cosmetic — horn tips protrude ~0.3 mm above Fusion Wheel surface (negligible contact)  
**Movement Freedom**: fixed  
**Base Stats**: (cosmetic — 9.0% of combined Wheel+CW mass)  
**Mechanism**: I_Capricorn = 7.84×10⁻⁷ kg·m² (9.7% of Grand Capricorn 145D system I). C₂ symmetry with matched lobes → same orbital stability as C₄. Horn tip angle θ ≈ 20°: smash 0.940, but horn protrusion contained within Fusion Wheel profile. Cosmetic role. Face Bolt variants: "CAPRICORNE" banner (standard), horn-only (Metal Masters era).  
**2.5D Rendering**: z_cm ≈ 0.30 cosmetic layer · C₂ nodes  
**Engine Note**: cosmetic ring; C₂ symmetry flag; `captionVariant: "full"|"notext"|"hornonly"`

---

### [Case 1086 — Track: 145 — MFB Standard](./6%20case%20study.md#case-1086)

**System**: Gen2-MFB / HWS · Track · plain hexagonal  
**Geometry**: h = 1.45 cm · hex tube w ≈ 1.70 cm · no protrusions · mass ≈ 0.9 g  
**Material**: ABS/PC hexagonal tube  
**Spin Coupling**: rigid  
**Contact Points**: (no lateral contacts)  
**Movement Freedom**: fixed  
**Base Stats**: (track component — standard 145 height)  
**Mechanism**: Plain hexagonal tube at 14.5 mm — formerly tallest standard track before 230. Sets h_CoG ~6 mm higher than 85 track: ~15% longer late-battle wobble survival. Below 230 in CoG height (230 raises CoG ~8.5 mm further → less stable at low spin). Standard defensive midpoint height for MFB 145-era builds. Tipping ω_crit ≈ 675 rpm in Grand Capricorn 145D.  
**2.5D Rendering**: z_cm = 1.45 track height · hexagonal tube  
**Engine Note**: h = 1.45 cm; I_145 = 5.09×10⁻⁸ kg·m²; no gimmick flag

---

### [Case 1087 — Performance Tip: D (Defense) — MFB](./6%20case%20study.md#case-1087)

**System**: Gen2-MFB / HWS · Tip · wide defense cone  
**Geometry**: full w = 1.555 cm · tip w = 0.894 cm · h = 0.889 cm · 35° cone · mass = 0.68 g  
**Material**: ABS · μ_k = 0.090  
**Spin Coupling**: rigid  
**Contact Points**: cone tip r ≈ 0.447 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 55 · Stamina 65 · Speed 0  
**Mechanism**: 35° cone: smash = 0.819, recoil = 0.574. Recovery arc = 55° → bey self-centres after wall contact (passive recovery). dω/dt = 16.7 rad/s² in Grand Capricorn 145D (I = 8.05×10⁻⁶). Better stamina than WD when WD free-spin is unstable; stiffer than WD for heavy combos. Paradox: more friction than S but better defense due to wide contact patch reducing recoil direction variance.  
**2.5D Rendering**: z_cm ≈ 0 · wide cone cross-section  
**Gimmick**: Wall contact recovery: reboundsAngle = 55° (self-centres after wall hit)  
**Engine Note**: r_contact = 0.447 cm; θ = 35°; decay 16.7 rad/s² (Grand Capricorn 145D)

---

## CS2 Overflow — Case 1088 {#cs2-overflow-1088}
Source: `2 case study.md` (Case 1088 — DB era Nexus disc; formerly CS2 case 74, renumbered due to CS1 conflict)

---

### [Case 1088 — Disc: Nexus (30.6 g) — DB Era](./2%20case%20study.md#case-1088)

**System**: Gen4-DB (Dynamite Battle) · Disc  
**Geometry**: r_o ≈ 3.60 cm · r_i ≈ 1.0 cm · 8 blades (4 upper + 4 lower, 45° interleaved offset) · 30.6 g  
**Material**: Metal (zinc alloy) · blade contact faces  
**Spin Coupling**: rigid  
**Contact Points**: 8 blade edges at 45° spacing · r ≈ 3.0–3.6 cm · contact rate = 382 hits/s at 300 rad/s  
**Movement Freedom**: fixed  
**Base Stats**: Attack 55 · Defense 55 · Stamina 50 · Speed 55  
**Mechanism**: Two-tier blade arrangement: upper 4 at 0°/90°/180°/270°, lower 4 at 45°/135°/225°/315°. Two-tier delivers impulse at both heights simultaneously (less energy lost to tilt). I_Nexus ≈ 2.13×10⁻⁵ kg·m² — 2.1× heavier than Ten Heavy at similar I. Attack barrage: J_blade ≈ 0.034 N·s per contact at 300 rad/s; F_avg ≈ 13 N continuous. Mass mid-radius (attack bias) not rim-heavy (lower I per gram aids acceleration).  
**2.5D Rendering**: z_cm ≈ 0.3 (disc layer) · 8-blade two-tier profile  
**Gimmick**: Two-tier simultaneous height contact → `dualTierImpulse` handler  
**Engine Note**: I = 2.13×10⁻⁵ kg·m²; contactRate = 382/s at 300 rad/s; barrage model

---

## CS5 Overflow — Cases 1089–1096 {#cs5-overflow}
Source: `5 case study.md` (Cases 1089–1096 — HMS AR/CWD/RC for Dragoon MF and Dranzer MF; formerly CS5 cases 297–304, renumbered due to CS6 conflict)

---

### [Case 1089 — AR: Upper Dragon (Dragoon MF) · ~19 g](./5%20case%20study.md#case-1089)

**System**: Gen1-HMS · Attack Ring · shared Metal Frame  
**Geometry**: r_contact ≈ 1.95 cm · 3 zinc contact faces at 120° · contact angle RS φ ≈ 38° · LS φ ≈ 17° (caul-obstructed)  
**Material**: Zinc alloy metal frame (~12.5 g) + ABS caul (~6.5 g) · e_zinc = 0.80  
**Spin Coupling**: rigid  
**Contact Points**: 3 Metal Frame zinc faces · smash RS = 0.616 · smash LS = 0.292  
**Movement Freedom**: fixed  
**Base Stats**: Attack 55 · Defense 30 · Stamina 30 · Speed 50  
**Mechanism**: Shares Metal Frame with Upper Fox and Devil Crusher. Upper Dragon's ABS caul is most aggressive of the three. Metal COR +7.5% impulse over ABS (e_zinc=0.80 vs e_ABS=0.675). RS smash 61.6%; LS only 47% of RS throughput (caul blocks metal exposure in LS). 3-point mass distribution (non-continuous) → slight aerodynamic asymmetry → disqualified from stamina. Requires GFC Ultimate Mode RC for orbital speed to achieve ring-out threshold.  
**2.5D Rendering**: z_cm ≈ 1.5 HMS scale · 3 zinc face protrusions  
**Gimmick**: RS preferred; `upperDragonContactImpulse(v_orb)` → 0.0151 N·s at GFC orbit  
**Engine Note**: smashRS = 0.616; smashLS = 0.292; bestRC = GFC_ultimate_mode

---

### [Case 1090 — CWD: Chain Attacker (Dragoon MF) · ~17 g](./5%20case%20study.md#case-1090)

**System**: Gen1-HMS · CWD (Counter Weight Disc) · anime-default for Dragoon MF  
**Geometry**: ~12–14 bi-lobed chain-link protrusions around perimeter · protrusion h ≈ 2.0 mm · 17 g  
**Material**: ABS plastic frame + metal core · perimeter contact area 42 mm²  
**Spin Coupling**: (CWD type)  
**Contact Points**: 14 chain links · contact frequency ≈ 223 hits/s at 100 rad/s  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 20 · Stamina 30 · Speed 20  
**Mechanism**: High contact frequency (14 links/rev) + low per-link impulse. Only genuine use: opposite-spin spin-steal (high frequency + low recoil risk). For attack: insufficient impulse throughput. For defense: chain links add recoil catch points — worse than smooth CWD. Functional neutral in all roles.  
**2.5D Rendering**: z_cm ≈ 1.0 HMS CWD height · chain-link perimeter  
**Engine Note**: contactFreq = 223/s; impulsePer = low; tierRating = niche_spin_steal

---

### [Case 1091 — CWD: Eternal Survivor (Dragoon MF) · ~17 g](./5%20case%20study.md#case-1091)

**System**: Gen1-HMS · CWD · fixed-rotation  
**Geometry**: 3 gear-tooth protrusions at 120° · r_outer ≈ 2.20 cm (exceeds most HMS ARs ≈ 1.9–2.1 cm) · 17 g  
**Material**: ABS + metal · fixed (non-free-spinning)  
**Spin Coupling**: fixed  
**Contact Points**: 3 gear protrusions · but diameter excess causes CWD-first contact before AR engages  
**Movement Freedom**: fixed — full impulse transfer to combo  
**Base Stats**: Attack 25 · Defense 25 · Stamina 25 · Speed 25  
**Mechanism**: CWD outer radius (2.2 cm) exceeds HMS AR radius → opponent contacts CWD before AR, absorbing energy and reducing smash delivery. Fixed rotation = full impulse transfer (advantage vs free-spin). Niche: destabilises chunky CWD combos via below-AR contact. Best AR: Circle Upper Mold 2 (least impacted by diameter excess). Had r_outer been 1–2 mm smaller, would be a staple.  
**2.5D Rendering**: z_cm ≈ 1.0 HMS CWD height · 3 fixed gear protrusions  
**Engine Note**: diameterExcess = true; bestAR = circle_upper_mold2; rotation = fixed

---

### [Case 1092 — RC: Metal Weight Grip Core (Dragoon MF) · ~3 g](./5%20case%20study.md#case-1092)

**System**: Gen1-HMS · Running Core · rubber attack  
**Geometry**: rubber dome tip r ≈ 2.0 mm (slightly smaller than GFC 2.25 mm) · 3 g  
**Material**: Hard rubber dome · μ = 0.50  
**Spin Coupling**: rigid  
**Contact Points**: rubber dome floor contact r ≈ 2.0 mm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 60 · Defense 20 · Stamina 20 · Speed 55 (below GFC)  
**Mechanism**: +2.7% friction force vs GFC from extra mass (F_N: 0.383 vs 0.373 N). Smaller tip radius → tighter orbit, lower peak orbital speed. Speed deficit negligible for top-tier ARs (Metal Upper, Jiraiya Blade, Circle Upper) but causes J_contact < ring-out threshold for mid-tier ARs. Most beginner-friendly rubber HMS RC. Best beginner attacker entry point.  
**2.5D Rendering**: z_cm ≈ 0 · rubber dome contact  
**Engine Note**: r_tip = 2.0 mm; mu = 0.50; bigThreeCompat = true; midTierPenalty = significant

---

### [Case 1093 — AR: Smash Phoenix (Dranzer MF) · ~18 g](./5%20case%20study.md#case-1093)

**System**: Gen1-HMS · Attack Ring · shared Metal Frame  
**Geometry**: mostly circular rim (φ_body ≈ 3°) + Phoenix beak protrusions (φ_beak ≈ 27°) + Phoenix head (φ_head ≈ 12°) · 18 g  
**Material**: ABS caul + zinc Metal Frame (3-point uneven distribution) · e_zinc = 0.80  
**Spin Coupling**: rigid  
**Contact Points**: circular rim (near-zero smash, near-full recoil) + 3 beak contacts (0.454 smash) + 3 head contacts (0.208 smash)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 40 (LS) · Stamina 20 · Speed 35  
**Mechanism**: Shares Metal Frame with Smash Leopard and God Smasher. Circular rim → near-zero smash + near-full recoil → destabilises own stamina. Uneven 3-point Metal Frame distribution → 3-fold inertia asymmetry → nutation wobble. LS defense viable: circular body deflects incoming RS contacts tangentially. Best with Reverse Defenser CWD + Bearing Core 2 (LS defense/zombie).  
**2.5D Rendering**: z_cm ≈ 1.5 HMS scale · near-circular rim + Phoenix head protrusions  
**Engine Note**: defense_LS = viable_with_reverse_defenser; smash = sub-competitive; unstable stamina

---

### [Case 1094 — CWD: Wing Attacker (Dranzer MF) · ~17 g](./5%20case%20study.md#case-1094)

**System**: Gen1-HMS · CWD · free-spinning  
**Geometry**: large wing extensions r_wing ≈ 3.0 cm (exceeds all HMS ARs ≈ 1.9–2.1 cm) · 17 g  
**Material**: ABS plastic wings + metal core · free-spinning  
**Spin Coupling**: wings free-spin independently  
**Contact Points**: wing outer faces r ≈ 3.0 cm — contacts opponent before AR can engage  
**Movement Freedom**: wings rotate freely — absorbs hits without counterforce  
**Base Stats**: Attack 0 · Defense 0 · Stamina 0 · Speed 0 (no competitive use)  
**Mechanism**: Wings extend past all HMS ARs → opponent contacts wing before AR → wing spins up (absorbs hit), transferring no counterforce to combo. Free-spin prevents useful impulse transfer. Large r_wing → stadium contact at reduced tilt angle → earlier topple-scrape. No competitive application; HMS equivalent of Wing Base.  
**2.5D Rendering**: z_cm ≈ 1.0 HMS CWD height · wide free-spinning wings  
**Engine Note**: competitiveUse = none; wingRadius = 3.0 cm; freeSpinAbsorb = true

---

### [Case 1095 — CWD: Reverse Defenser (Dranzer MF) · ~17 g](./5%20case%20study.md#case-1095)

**System**: Gen1-HMS · CWD · defense/zombie  
**Geometry**: smooth curved outer rim r ≈ 2.2 cm (≈ CWD God Ring equivalent) · "slightly thinner" than God Ring · 17 g  
**Material**: ABS (wears to improved surface) · fixed rotation  
**Spin Coupling**: fixed  
**Contact Points**: smooth curved rim → tangential deflection (α ≈ 6°)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 70 · Stamina 55 · Speed 0  
**Mechanism**: Functionally identical to CWD God Ring — large smooth rim at r ≈ 2.2 cm deflects incoming contacts tangentially before AR engages. Fixed rotation ensures direct impulse transfer. Worn surface improves (mould flash rounds off → cleaner tangential deflection, better LAD). Best use: Metal Ape AR + Bearing Core 2 (standard HMS wall-defense combo). Found in RB5; godRingEquivalence = true.  
**2.5D Rendering**: z_cm ≈ 1.0 HMS CWD height · smooth curved rim  
**Engine Note**: godRingEquivalence = true; wornProfile = superior; bestAR = metal_ape

---

### [Case 1096 — RC: Free Shaft Core (Dranzer MF) · ~3 g](./5%20case%20study.md#case-1096)

**System**: Gen1-HMS · Running Core · metal sharp with shaft-decoupling  
**Geometry**: outer shell r ≈ 7 mm · inner metal sharp r_tip ≈ 0.4 mm · 3 g  
**Material**: metal sharp tip · μ_tip ≈ 0.12 · shaft-to-shell coupling loosens at low ω  
**Spin Coupling**: shaft-decouples at low ω → outer shell partially independent  
**Contact Points**: metal sharp tip r ≈ 0.04 cm · floor  
**Movement Freedom**: fixed at high ω; decoupled at low ω  
**Base Stats**: Attack 10 · Defense 10 · Stamina 30 · Speed 10  
**Mechanism**: Above ω_decouple: behaves like fixed-shaft RC. Below threshold: shaft slips → early precession onset; exits competitive spin window while Bearing Core still functional. Low-friction metal tip → low orbital movement → "docile." Best scenario: Jiraiya Blade + full-power flat launch for early ring-out attempt before orbital decay. Free Shaft Core is the Dranzer MF stock RC.  
**2.5D Rendering**: z_cm ≈ 0 · metal sharp contact  
**Engine Note**: earlyprecession = true; docile movement; bestUse = full_power_flat_jiraiya

---

## CS4 Overflow — Case 1097 {#cs4-overflow-1097}
Source: `4 case study.md` (Case 1097 — CEW Metal Grip; formerly CS4 case 226 2nd occurrence)

---

### [Case 1097 — CEW: Metal Grip · 2.7 g](./4%20case%20study.md#case-1097)

**System**: Gen1-Plastic / EG (Engine Gear) · Custom Engine Weight  
**Geometry**: central nub r ≈ 0.15 cm (raised ~2 mm) · outer semi-flat ring r_flat ≈ 0.35 cm · bevel r ≈ 0.45 cm at 35° · metal annular ring wings · 2.7 g  
**Material**: Hard rubber dome (μ ≈ 0.45) + grey metal ring + white plastic inner body  
**Spin Coupling**: Left Engine Gear (Turbo) burst coupling: 37.6% traction coupling (vs metal tip 12.8%)  
**Contact Points**: Phase 1 (θ=0°): nub r=0.15cm · Phase 2 (θ=5–20°): flat ring r=0.35cm · Phase 3 (θ≥25°): bevel r=0.45cm  
**Movement Freedom**: tilt-threshold switches contact phase  
**Base Stats**: Attack 40 · Defense 20 · Stamina 20 · Speed 35  
**Mechanism**: Only rubber-tipped CEW. Three-phase contact surface: nub → flat → bevel. Burst coupling: Turbo EG burst demand 11.7 m/s² > a_max (4.4 m/s²) → all tips slip; Metal Grip slips 62.4% (37.6% couples) vs metal tip 87.2% slip (12.8% couples) → 2.9× more lateral velocity from same burst. EG height penalty (h_CoM 16 mm vs 10 mm) → 2.5× more topple torque than standard combo. Lightest CEW (2.7 g). Only CEW that gives Left EG (Turbo) meaningful attack character.  
**2.5D Rendering**: z_cm ≈ 0 · rubber dome + bevel cross-section  
**Gimmick**: `legTurboBurstCoupling`: Left EG (Turbo) burst → 37.6% traction coupling → directed lunge  
**Special Move**: Compatible beys: any with Left Engine Gear (Turbo) installed  
**Engine Note**: mu_rubber = 0.45; r_flat = 0.35 cm; burstCoupling = 37.6%; EG height penalty ×2.5 topple

---

## CS13 Overflow — Cases 1098–1124 {#cs13-overflow-1098}
Source: `13 case study.md` (Cases 1098–1124 — Franchise special moves, gimmick foundations, and combos; Kenta/Tsubasa/Phi/Arman/Bel/Phelix/Rantaro-Ranjiro triplets)

---

### [Case 1098 — [GIMMICK] Kenta Yumiya — Flame Sagittario C145S](./13%20case%20study.md#case-1098)

**System**: Gen2-MFB / HWS · GIMMICK  
**Geometry**: m = 39.8 g · I = 2.379×10⁻⁵ kg·m² · ω₀ = 220 rad/s · Flame wheel 26 g · C145 track 5.8 g  
**Material**: Zinc alloy Flame wheel + ABS/PC · C145 fixed claw: η_claw ≈ 0.28 · μ_S = 0.35  
**Spin Coupling**: rigid  
**Contact Points**: 3 fixed claw protrusions at 120° (C145) · bowl-wall engagement; Sharp tip r = 0.08 cm  
**Movement Freedom**: fixed claws — always extended  
**Base Stats**: Attack 50 · Defense 30 · Stamina 60 · Speed 55  
**Mechanism**: C145 three fixed claws (α_claw ≈ 20–25° below horizontal) catch inclined bowl wall → convert horizontal orbit KE into vertical launch. η_claw = 28% conversion; θ_launch ≈ 60° from horizontal. Physical apex ≈ 3.5 cm at v_orb = 1.8 m/s (BeySpirit amplification required for Diving Claw visual). Endurance ≈ 48 s (Sharp tip). No speed threshold — claws always engage at v_orb ≥ 0.5 m/s.  
**2.5D Rendering**: z_cm = 1.45 (C145 height) · 3-claw protrusion silhouette  
**Gimmick**: `c145ClawLaunch(v_orb, m, theta_deg)` → 28% KE conversion; bowl-wall claw anchor  
**Engine Note**: eta_claw = 0.28; theta_launch = 60°; beyTiltAngle → 90° on bowl-wall engage

---

### [Case 1099 — [SPECIAL] Diving Claw](./13%20case%20study.md#case-1099)

**System**: CS13 Special Move · Kenta Yumiya · Flame Sagittario C145S  
**Geometry**: Phase 1: 500 ms wall-ride · Phase 2: 800 ms BeySpirit ascent (h_apex_anime ≈ 2.5 m) · Phase 3: 500 ms gravity dive  
**Material**: BeySpirit ×2.8 amplification + height factor ×4.5 · v_fall_anime = 19.6 m/s  
**Spin Coupling**: special override — anime physics  
**Contact Points**: Sharp tip A_tip = 2.01×10⁻⁶ m² · σ_peak ≈ 3.81 GPa on Face Bolt (crack probability 40% at late QTE)  
**Movement Freedom**: beyTiltAngle → 90° from Phase 1; invulnerable 1400 ms  
**Base Stats**: powerCost 110 · selfCost −60 · cooldown 7500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. C145 wall-ride triggers aerial ascent (BeySpirit-amplified). Fire Wheel at apex ≥ 60 Hz CFF threshold. KE_total ≈ 7.82 J. Face Bolt crack chance 40% (late): burstThreshold −15% for match.  
**2.5D Rendering**: beyTiltAngle 90° aerial + fire-wheel visual (CFF illusion at ω_apex)  
**Gimmick**: Derived from Case 1098 C145 claw mechanics  
**Special Move**: Diving Claw — QTE "Claw Drop" hold J: Late (350–500ms) spin −100, impulse 1750eu, KO 4800eu, dmg 1.85×, burst +16%, crack 40%; Medium spin −60 dmg 1.62×; Early spin −30 dmg 1.38×  
**Compatible beys**: any with C145 track + BeySpirit (Sagittario assembly recommended)  
**Engine Note**: invulnerable 1400 ms; faceBoltCrack = true at late QTE; powerCost 110

---

### [Case 1100 — [COMBO] Flame Claw (→ J K)](./13%20case%20study.md#case-1100)

**System**: CS13 Combo · Kenta Yumiya · Flame Sagittario C145S  
**Geometry**: Sequence: → (moveRight) + J (attack) + K (defense) · windowMs 600 · cooldownMs 3800  
**Material**: C145 claw wall-catch geometry  
**Spin Coupling**: combo (requires `flameSagittarioC145`)  
**Contact Points**: J: claw wall-catch strike; K: Flame wheel deflect brace  
**Movement Freedom**: wallBounce = true after J (auto-repositions)  
**Base Stats**: cost 15 power · type: attack  
**Mechanism**: Dash right (→), C145 claw catches bowl wall (J: spin −35, dmg 1.25×, lock 45ms, wallBounce), convert to Flame wheel deflect (K within 300ms: incomingDmgReduction ×0.60). Ground-level version of Diving Claw wall-engage phase. Ceiling: 1.25×≤1.5×; 45ms≤300ms lock; wallBounce positional only.  
**2.5D Rendering**: wallBounce repositioning visual  
**Gimmick**: Derived from C145 claw geometry (Case 1098)  
**Engine Note**: J: spinDelta −35, dmgMult 1.25×, lockMs 45, wallBounce; K: incomingDmg ×0.60; cost 15

---

### [Case 1101 — [GIMMICK] Kenta Yumiya — Flash Sagittario 230WD](./13%20case%20study.md#case-1101)

**System**: Gen2-MFB / HWS · GIMMICK · 4D era  
**Geometry**: m = 47.5 g · I = 3.315×10⁻⁵ kg·m² · ω₀ = 210 rad/s · Flash 4D wheel 32 g · 230 track 23 mm  
**Material**: 4D Metal Wheel (heavier multi-piece) + ABS/PC · WD bearing μ ≈ 0.020  
**Spin Coupling**: rigid  
**Contact Points**: WD bearing r = 0.50 cm · floor · beast-arrow projections (ranged)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 55 · Defense 30 · Stamina 90 · Speed 40  
**Mechanism**: Flash heavier 4D wheel (32 g vs Flame 26 g); 230 track raises h_CoM to 15.5 mm. WD bearing: dω/dt = 1.406 rad/s² → endurance ≈ 149 s (excellent). No C145 — beast-arrow ranged projection (5 sequential arrows at v=15 m/s, spin cost 28 rad/s each). 230 tall height supports stable upright stance for 5 BeySpirit projections. Physical claw-launch unavailable.  
**2.5D Rendering**: z_cm = 2.30 (230 height) · wide WD disc  
**Gimmick**: Beast-arrow projection (ranged); WD bearing stamina; 230 tall height contact evasion  
**Engine Note**: I = 3.315×10⁻⁵ kg·m²; decay 1.406 rad/s²; arrowSpeed 15 m/s; spinCostPerArrow 28

---

### [Case 1102 — [SPECIAL] Diving Arrow](./13%20case%20study.md#case-1102)

**System**: CS13 Special Move · Kenta Yumiya · Flash Sagittario 230WD  
**Geometry**: 5 arrows, 200 ms apart (1000 ms total window) · opponent dodge QTE per arrow (← or → within 300 ms)  
**Material**: BeySpirit ranged projection · WD suppresses drift during volley  
**Spin Coupling**: special override  
**Contact Points**: ranged — bey holds position; interrupt if opponent contacts within 60 px  
**Movement Freedom**: Flash Sagittario holds position; not invulnerable (interruptible)  
**Base Stats**: powerCost 100 · selfCost −50 · cooldown 7000 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Improvised substitute for Diving Claw (no C145). 5-arrow volley; per-arrow stats: selfSpin −28, targetSpin −28, impulse 350eu, dmg 1.20×. Full 5-arrow: totalSelfSpin −140, totalTargetSpin −140, totalImpulse 1750eu. Volley cancels if opponent contacts within 60px during sequence.  
**Special Move**: Diving Arrow — per-arrow QTE dodge; full 5-hit: selfSpin −140, targetSpin −140, impulse 1750eu  
**Compatible beys**: any with Flash 4D Wheel + Sagittario II BitBeast  
**Engine Note**: 5 arrows × (spinDelta −28, impulse 350eu, dmg 1.20×); volley interrupt at 60px

---

### [Case 1103 — [COMBO] Flash Arrow (J ↑ J)](./13%20case%20study.md#case-1103)

**System**: CS13 Combo · Kenta Yumiya · Flash Sagittario 230WD  
**Geometry**: Sequence: J + ↑ (moveUp) + J · windowMs 700 · cooldownMs 4500  
**Material**: Flash 4D Metal Wheel contacts  
**Spin Coupling**: combo (requires `flashSagittarioFW`)  
**Contact Points**: J1: Flash wheel contact; ↑: 120 ms face-rotation; J2: Flash wheel contact fresh surface  
**Movement Freedom**: directional advance between hits  
**Base Stats**: cost 25 power · type: universal  
**Mechanism**: Two physical Flash wheel contacts with 120 ms positional advance rotating the contact face. Physical hits — no beast-arrow. Hit 1: spin −30, dmg 1.20×, lock 25ms. Hit 2: spin −30, dmg 1.25×, lock 30ms. Total lock 55ms ≤ 300ms; total spin −60.  
**Engine Note**: H1: spinDelta −30, dmg 1.20×, lock 25ms; H2: spinDelta −30, dmg 1.25×, lock 30ms; cost 25

---

### [Case 1104 — [GIMMICK] Tsubasa Otori — Earth Eagle 145WD (Second Appearance)](./13%20case%20study.md#case-1104)

**System**: Gen2-MFB / HWS · GIMMICK (second special move case)  
**Geometry**: m ≈ 42.0 g · I ≈ 3.012×10⁻⁵ kg·m² · ω₀ ≈ 210 rad/s · h_CoM standard 145 height  
**Material**: Earth Fusion Wheel + ABS/PC · WD bearing; aerial: τ_air ≈ 1.2×10⁻⁷×ω → dω/dt_aerial = 0.836 rad/s²  
**Spin Coupling**: rigid  
**Contact Points**: WD bearing r = 0.50 cm · floor; Diving Crush vertical dive (no horizontal)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 50 · Defense 40 · Stamina 75 · Speed 45  
**Mechanism**: Cross-reference Case 834 for full assembly. Focus: WD aerial spin retention (dω/dt_aerial = −0.836 rad/s²; Δω ≈ 1.0 rad/s over 1.2 s aerial — <0.5% spin loss). Eagle beast lifts h ≈ 3.5 m; anime v_fall ×2.5 = 20.7 m/s; KE_total ≈ 9.66 J. Barrier-defense counter: Keel Strangler or barrierDefenseType specials absorb 85% of dmgMult bonus (1.80× → 1.12×). Only CS13 special with defined counter-class flag.  
**2.5D Rendering**: z_cm = 1.45 (145 height) · Eagle beast lift visual  
**Gimmick**: `divingCrushBarrier(active, rawDmgMult)` → 85% dmgMult reduction when barrier active  
**Engine Note**: barrierDefenseType counter flag; aerial Δω ≈ 1.0 rad/s negligible

---

### [Case 1105 — [SPECIAL] Diving Crush](./13%20case%20study.md#case-1105)

**System**: CS13 Special Move · Tsubasa Otori · Earth Eagle 145WD  
**Geometry**: Phase 1: Eagle Lift 700 ms · Phase 2: Apex aim 200 ms · Phase 3: dive 450 ms + impact  
**Material**: BeySpirit ×2.5; v_fall_anime = 20.7 m/s; KE_total ≈ 9.66 J  
**Spin Coupling**: special override  
**Contact Points**: vertical dive — no horizontal approach angle; barrierDefense negation flag  
**Movement Freedom**: beyTiltAngle → 90° Phase 1; invulnerable 900 ms  
**Base Stats**: powerCost 110 · selfCost −55 · cooldown 7500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Eagle beast lift (h ≈ 3.5 m) + BeySpirit ×2.5 dive. QTE "Eagle Plunge" hold J: Late (320–450ms) spin −95, imp 1700eu, KO 4500eu, dmg 1.80× (1.12× with barrier), burst +16%; Medium spin −58, dmg 1.58×; Early spin −28, dmg 1.35×.  
**Special Move**: Diving Crush — QTE hold J; counter: barrierDefenseType reduces dmgMult 85%  
**Compatible beys**: any with Earth Fusion Wheel + Eagle BitBeast  
**Engine Note**: invulnerable 900 ms; barrierNegation 85%; powerCost 110; late: spin −95, KO 4500eu

---

### [Case 1106 — [COMBO] Feather Strike (↑ ← J)](./13%20case%20study.md#case-1106)

**System**: CS13 Combo · Tsubasa Otori · Earth Eagle 145WD  
**Geometry**: Sequence: ↑ (moveUp) + ← (moveLeft) + J · windowMs 650 · cooldownMs 4200  
**Spin Coupling**: combo (requires `earthEagleFW`)  
**Contact Points**: J: banked approach smash with minor upper-contact bonus + lift impulse 30eu  
**Movement Freedom**: banked sweep approach  
**Base Stats**: cost 15 power · type: balanced  
**Mechanism**: Eagle surges forward (↑), banks sharply left (←), delivers elevated smash contact (J). Banked approach: dmg 1.28×, spin −38, lock 45ms, liftImpulse 30eu (miniature Diving Crush aerial entry). 30eu lift impulse minor; ceiling 1.28×≤1.5×; 45ms lock.  
**Engine Note**: J: spinDelta −38, dmgMult 1.28×, lockMs 45, liftImpulse 30eu; cost 15; type balanced

---

### [Case 1107 — [GIMMICK] Phi — Dead Phoenix 10 Friction (Second Appearance)](./13%20case%20study.md#case-1107)

**System**: Gen4-Burst-GT · GIMMICK (second special move case)  
**Geometry**: m_total ≈ 47.0 g · Dead Armor m = 8.0 g, clip F = 4.0 N, F_centrifugal = 117.6 N at 700 rad/s  
**Material**: Friction driver rubber; e_rubber ≈ 0.72; v_rebound_anime ×3.2  
**Spin Coupling**: special override  
**Contact Points**: Friction rubber wall rebound; armor ejection v ≈ 8.5 m/s at 55° above horizontal  
**Movement Freedom**: Dead Armor separates on BeySpirit trigger  
**Base Stats**: (see Case 828 for main assembly)  
**Mechanism**: Cross-reference Cases 828, 876. Focus: mid-air elastic collision for Double Dead Stinger (Case 1117). Dead Armor separation: F_centrifugal 117.6 N >> F_clip 4.0 N at 700 rad/s → easy BeySpirit separation. Rubber wall rebound: v_approach 3.2 m/s × e_rubber 0.72 × BeySpirit 3.2 = 7.36 m/s → h_apex_phoenix ≈ 1.38 m. Armor h_apex ≈ 2.47 m. BeySpirit sync ensures simultaneous impact.  
**2.5D Rendering**: Dead Armor separation visual; dual-trajectory arc  
**Gimmick**: `dreadArmorSeparation(omega)` → canSeparate: true at ω ≥ 13 rad/s  
**Engine Note**: F_centrifugal = 0.008×ω²×0.030; separation at any competitive spin; rubber e = 0.72

---

### [Case 1108 — [SPECIAL] Diving Dead Stinger Press](./13%20case%20study.md#case-1108)

**System**: CS13 Special Move · Phi · Dead Phoenix 10 Friction  
**Geometry**: Phase 1: Wall approach 400 ms · Phase 2: Rebound + separation 150 ms · Phase 3: Dual aerial 800 ms · Phase 4: simultaneous strike  
**Material**: v_fall_anime = 19.6 m/s · KE_combined ≈ 7.82 J  
**Spin Coupling**: special override  
**Contact Points**: Dead Phoenix + Dead Armor simultaneous dual strike (0 ms between)  
**Movement Freedom**: invulnerable Phase 2+3 (~950 ms)  
**Base Stats**: powerCost 115 · selfCost −65 · cooldown 8000 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Friction rubber rebound + armor separation → dual aerial. QTE "Dead Impact" — tap J at shadow-convergence (200 ms window). On hit: spin −85, impulse 1600eu, KO 4200eu, dmg 1.80×, burst +15%. Combined Phoenix + Armor = "colossal damage." Armor acts as secondary projectile timed to arrive simultaneously with Phoenix.  
**Special Move**: Diving Dead Stinger Press — tap J within 200 ms; dual simultaneous hit  
**Compatible beys**: any with Dead Phoenix Layer + Friction driver  
**Engine Note**: QTE window 200 ms; dual simultaneous: spin −85, imp 1600eu, KO 4200eu, dmg 1.80×

---

### [Case 1109 — [COMBO] Dead Dive (J ↑ K)](./13%20case%20study.md#case-1109)

**System**: CS13 Combo · Phi · Dead Phoenix 10 Friction  
**Geometry**: Sequence: J + ↑ (moveUp) + K · windowMs 700 · cooldownMs 4200  
**Spin Coupling**: combo (requires `deadPhoenixLayer`)  
**Contact Points**: J: Dead Phoenix blade strike; ↑: Friction rubber floor push (brief lift); K: Dead Armor absorb  
**Movement Freedom**: brief lift from Friction rubber push  
**Base Stats**: cost 15 power · type: attack  
**Mechanism**: Strike (J: spin −43, dmg 1.30×, lock 50ms, frictionBonus +8eu), Friction rubber floor-push (↑ brief lift), Dead Armor absorb (K within 400 ms: incomingDmg ×0.65). Two-phase: strike then armored counter-capture. Ceiling: 1.30×≤1.5×; 50ms≤300ms lock.  
**Engine Note**: J: spinDelta −43, dmg 1.30×, lock 50ms, +8eu; K: incomingDmg ×0.65; cost 15

---

### [Case 1110 — [GIMMICK] Arman Kusaba — Bushin Ashindra Hurricane Keep Ten](./13%20case%20study.md#case-1110)

**System**: Gen4-BX · GIMMICK  
**Geometry**: m = 28.0 g · I = 1.709×10⁻⁵ kg·m² · ω₀ = 800 rad/s · 12 blades at 30° spacing  
**Material**: BX Bushin Layer Base (12-blade lime-green ABS) · Keep Ten bit μ ≈ 0.08  
**Spin Coupling**: rigid  
**Contact Points**: 12 blade faces · sweep frequency 1528 Hz at 800 rad/s (visually solid disc — no gaps)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 75 · Stamina 60 · Speed 30  
**Mechanism**: 12 blades (far more than typical BX 3–6). Blade sweep frequency 1528 Hz >> 60 Hz CFF → blade disc is visually solid at operating spin. F_per_blade = 0.0181 N; 12 blades = 0.217 N aerodynamic force. Double Bushin Guard (BeySpirit all 12): F = 0.434 N. Vortex effective radius 60 px. Spin decay: dω/dt = 3.22 rad/s².  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · 12-blade disc silhouette (solid visual)  
**Gimmick**: `bushinAshindraStats()` → 12-blade vortex; Double Bushin Guard 2× base power  
**Engine Note**: bladeCount 12; sweepFreq 1528 Hz; F_double 0.434 N; vortexRadius 60 px

---

### [Case 1111 — [SPECIAL] Double Bushin Guard](./13%20case%20study.md#case-1111)

**System**: CS13 Special Move · Arman Kusaba · Bushin Ashindra Hurricane Keep Ten  
**Geometry**: Active period 2500 ms · vortex radius 60 px · all 12 blades engaged  
**Material**: BeySpirit ×2.0 blade engagement; lime-green whirlwind  
**Spin Coupling**: special override  
**Contact Points**: any opponent within 60 px → outward deflection 180eu  
**Movement Freedom**: (defensive — holds position)  
**Base Stats**: spinCost −60 · powerCost 110 · cooldown 8000 ms · duration 2500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. All 12 blades simultaneously create continuous defensive vortex (2× base Bushin Guard at ×0.65). While active on collision: incomingDmg ×0.40 (60% absorbed), reflectedDmg ×1.10, deflectForce 180eu, spinDrain −18 per 500 ms contact.  
**Special Move**: Double Bushin Guard — 2500 ms vortex; on collision: inDmg ×0.40, reflect ×1.10, deflect 180eu  
**Compatible beys**: any with Bushin Layer Base (Ashindra blade)  
**Engine Note**: incomingDmgMult ×0.40; reflectedDmg ×1.10; deflect 180eu; spinDrain −18/500ms

---

### [Case 1112 — [COMBO] Twelvefold Brace (K ↓ K)](./13%20case%20study.md#case-1112)

**System**: CS13 Combo · Arman Kusaba · Bushin Ashindra Hurricane Keep Ten  
**Geometry**: Sequence: K + ↓ (moveDown, 80ms face rotation ~30°) + K · windowMs 500 · cooldownMs 3000  
**Spin Coupling**: combo (requires `bushinAshindraLayer`)  
**Contact Points**: K1: 6-blade partial brace; K2: fresh blade face brace  
**Movement Freedom**: ↓ retreat rotates blade face 30° (one blade spacing)  
**Base Stats**: cost 0 power (free) · type: defense  
**Mechanism**: K1 brace (×0.68 dmg reduction), 80ms ↓ retreat rotates face, K2 brace fresh surface (×0.72 dmg reduction, +8 spin gain, 20ms lock). Combined if both timed: 0.68 × 0.72 = 0.4896× (strong dual reduction). 12-blade advantage enables double-brace trivially without power. Free cost.  
**Engine Note**: K1: ×0.68; K2: ×0.72, spinGain +8, lock 20ms; combined ×0.490; cost 0 free

---

### [Case 1113 — [GIMMICK] Bel Daizora — Devastate Belfyre Almight Perfect Gear](./13%20case%20study.md#case-1113)

**System**: Gen4-BX · GIMMICK  
**Geometry**: m ≈ 35.0 g · Perfect Gear spring: k = 1222 N/m, x_max = 4.5 mm, E_mech = 0.01223 J  
**Material**: BX Belfyre blade + Almight driver (spring-ratchet) · BeySpirit ×40 spring amplification  
**Spin Coupling**: spring-ratchet release on impact  
**Contact Points**: (see Case 864 for main assembly parameters)  
**Movement Freedom**: Perfect Gear re-cocks under BeySpirit after first-dive landing  
**Base Stats**: (see Case 864)  
**Mechanism**: Cross-reference Cases 846, 864. Perfect Gear spring k=1222 N/m compresses on first-dive impact; BeySpirit ×40 amplifies to E_launch_2nd = 0.486 J → v_2nd = 5.27 m/s → h_apex_2nd = 1.415 m. Second dive KE = 3.812 J. Combined two-dive KE ≈ 10.0 J ("definite KO" justified). First dive: h_apex_1st ≈ 2.0 m, KE = 6.183 J.  
**2.5D Rendering**: Perfect Gear second-launch spring visual  
**Gimmick**: `perfectGearSecondLaunch(BeySpirit=40, m=0.035)` → E=0.486 J, v=5.27 m/s, h=1.415 m  
**Engine Note**: k_PG = 1222 N/m; BeySpirit ×40; combinedKE ≈ 10.0 J; "definite KO" flag

---

### [Case 1114 — [SPECIAL] Double Devastate Dive](./13%20case%20study.md#case-1114)

**System**: CS13 Special Move · Bel Daizora · Devastate Belfyre Almight Perfect Gear  
**Geometry**: Phase 1: First dive (ref Case 864) · Phase 2: PG re-launch (250 ms QTE2 window) · Phase 3: Second dive  
**Material**: combinedKE ≈ 10.0 J; v_2nd_anime = 14.76 m/s  
**Spin Coupling**: special override  
**Contact Points**: First dive + second dive sequential; total invulnerable ~1578 ms  
**Movement Freedom**: invulnerable Phase 1 re-ascent + Phase 3  
**Base Stats**: powerCost 130 · selfCost −80 · cooldown 9000 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Three-stage QTE: hold-J (first dive) / tap-J (250 ms re-launch window) / hold-J (second dive). Most demanding QTE in CS13. Full+Full: totalSpin −165, combined 2.50×, burst +30%, combinedKE ~10 J. Miss QTE2: move ends at first dive only.  
**Special Move**: Double Devastate Dive — QTE1 hold-J (500ms); QTE2 tap-J (250ms); QTE3 hold-J (400ms); full+full: combined 2.50×  
**Compatible beys**: any with Devastate Belfyre blade + Almight Perfect Gear driver  
**Engine Note**: 3-stage QTE; QTE2 window 250 ms; full+full: spin −165, dmg 2.50×, burst +30%

---

### [Case 1115 — [COMBO] Gravity Surge (J ↓ J)](./13%20case%20study.md#case-1115)

**System**: CS13 Combo · Bel Daizora · Devastate Belfyre Almight Perfect Gear  
**Geometry**: Sequence: J + ↓ (moveDown, 100ms spring pre-load) + J · windowMs 750 · cooldownMs 5000  
**Spin Coupling**: combo (requires `devastateBelfyreBlade`)  
**Contact Points**: J1: Belfyre strike; J2: spring-boosted contact (Almight spring pre-load echo)  
**Movement Freedom**: ↓ drops weight for spring pre-load  
**Base Stats**: cost 25 power · type: attack  
**Mechanism**: Strike (J1: spin −45, dmg 1.32×, lock 30ms), drop pre-load (↓ 100ms), spring-boosted second hit (J2: spin −42, dmg 1.35×, lock 35ms, springBonus +20eu). Miniature Perfect Gear echo. Total lock 65ms ≤ 300ms. Ceiling: 1.35×≤1.5×.  
**Engine Note**: J1: spin −45, dmg 1.32×, lock 30ms; J2: spin −42, dmg 1.35×, lock 35ms, +20eu; cost 25

---

### [Case 1116 — [GIMMICK] Phi — Dead Phoenix 10 Friction (Third Appearance)](./13%20case%20study.md#case-1116)

**System**: Gen4-Burst-GT · GIMMICK (third special move case)  
**Geometry**: Elastic head-on intercept: v_armor = +3.2 m/s, v_phoenix = −6.5 m/s · v_armor_elastic = 11.027 m/s  
**Material**: elastic collision (m_p=22g, m_a=8g); BeySpirit redirect ×1.4 → v_anime = 15.44 m/s  
**Spin Coupling**: special override  
**Contact Points**: mid-air elastic collision; KE_anime = 0.953 J (3.3× original Dead Stinger armor KE)  
**Movement Freedom**: Phoenix orbits far side for head-on intercept after miss  
**Base Stats**: (see Cases 828, 876)  
**Mechanism**: Cross-reference Cases 828, 876, 1107. Focus: Double Dead Stinger redirect mechanic. After Armor misses: Phoenix intercepts from opposite direction at v_phoenix = 6.5 m/s; elastic collision sends Armor back at 11.027 m/s (×1.4 BeySpirit = 15.44 m/s). Dodge window halved (200 ms vs 400 ms). KE +244.6% vs original shot. Only CS13 special with "redirect on miss" mechanic.  
**Gimmick**: `doubleArmorRedirect(v_phoenix, v_armor, bs=1.4)` → v_elastic 11.027 m/s, v_anime 15.44 m/s  
**Engine Note**: elastic collision formula; dodge window 200 ms (halved); KE_anime 3.3× original

---

### [Case 1117 — [SPECIAL] Double Dead Stinger](./13%20case%20study.md#case-1117)

**System**: CS13 Special Move · Phi · Dead Phoenix 10 Friction  
**Geometry**: Phase 1: First shot 300 ms (v ≈ 8.5 m/s, dodge window 400 ms) · Phase 2: Intercept 500 ms · Phase 3: Redirect (v ≈ 15.4 m/s, dodge window 200 ms)  
**Material**: redirect 3.3× KE of original shot  
**Spin Coupling**: special override  
**Contact Points**: first shot or redirect — only one hits; KE_redirect 3.3× original  
**Movement Freedom**: no Phi QTE — aim first shot via movement before activation  
**Base Stats**: powerCost 115 · selfCost −55 or −70 · cooldown 7500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Unique: dodging the first shot enables the stronger redirect. First shot hits (dodge fail): spin −55, imp 900eu, KO 2200eu, dmg 1.55×, burst +11%. Redirect hits (dodge first, fail redirect): spin −70, imp 1400eu, KO 3800eu, dmg 1.80×, burst +17%. Both dodged: 0 damage.  
**Special Move**: Double Dead Stinger — redirect-on-miss; QTE1 ←/→ 400ms; QTE2 ←/→ 200ms  
**Compatible beys**: any with Dead Phoenix Layer + Friction driver  
**Engine Note**: redirectStronger = true; first: dmg 1.55×; redirect: dmg 1.80× (3.3× KE)

---

### [Case 1118 — [COMBO] Armor Spike (J ← J)](./13%20case%20study.md#case-1118)

**System**: CS13 Combo · Phi · Dead Phoenix 10 Friction  
**Geometry**: Sequence: J + ← (moveLeft, 90ms flank) + J · windowMs 700 · cooldownMs 4000  
**Spin Coupling**: combo (requires `deadPhoenixLayer`)  
**Contact Points**: J1: Dead Phoenix blade; ← flank orbit; J2: Dead Phoenix blade from ~30° new angle  
**Movement Freedom**: flank-orbit repositioning  
**Base Stats**: cost 15 power · type: attack  
**Mechanism**: Strike (J1: spin −40, dmg 1.25×, lock 30ms), flank left (← 90ms repositioning — echo of Double Dead Stinger intercept orbit), flank contact (J2: spin −38, dmg 1.28×, lock 35ms). Ground-level miniature of redirect orbit. Total lock 65ms.  
**Engine Note**: J1: spin −40, dmg 1.25×, lock 30ms; J2: spin −38, dmg 1.28×, lock 35ms; cost 15

---

### [Case 1119 — [GIMMICK] Phelix Payne — Prominence Phoenix Tapered Metal Universe-10](./13%20case%20study.md#case-1119)

**System**: Gen4-BX · GIMMICK  
**Geometry**: m = 32.8 g (core 26.8 g + shield 6.0 g) · I = 2.421×10⁻⁵ kg·m² · ω₀ = 800 rad/s  
**Material**: Prominence Shield 3-point clip F ≈ 3.5 N; F_centrifugal = 134.4 N at 800 rad/s  
**Spin Coupling**: Shield separates on BeySpirit trigger  
**Contact Points**: Shield m = 6.0 g r ≈ 4.2 cm; dual free-fall: v_fall_anime = 25.357 m/s  
**Movement Freedom**: Shield separates at apex; Phoenix core and Shield fall independently  
**Base Stats**: Attack 60 · Defense 35 · Stamina 50 · Speed 60  
**Mechanism**: Prominence Shield (analogous to Dead Armor) separates at aerial apex. h_apex ≈ 3.2 m; KE_core = 8.616 J, KE_shield = 1.929 J, KE_total = 10.545 J. Multi-target: Shield can target different opponent from Phoenix core in 3–4 player. In 1v1 both converge. Tapered Metal bit: μ ≈ 0.12 (low friction stamina).  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · Shield separation arc  
**Gimmick**: `prominencePhoenixStats()` → dual free-fall KE 10.545 J  
**Engine Note**: KE_total 10.545 J; Shield auto-targets nearest opponent in multi-bey; v_fall 25.357 m/s

---

### [Case 1120 — [SPECIAL] Double Prominence Dive](./13%20case%20study.md#case-1120)

**System**: CS13 Special Move · Phelix Payne · Prominence Phoenix Tapered Metal Universe-10  
**Geometry**: Phase 1: 700 ms launch · Phase 2: 200 ms apex separation (aim Phoenix, Shield auto-targets) · Phase 3: 500 ms dual fall + impact  
**Material**: combinedKE 10.545 J; v_fall_anime = 25.357 m/s  
**Spin Coupling**: special override  
**Contact Points**: Phoenix (1v1) + Shield simultaneously; in multi-bey: separate targets  
**Movement Freedom**: invulnerable Phase 1+2+100ms Phase 3 ≈ 1000 ms  
**Base Stats**: powerCost 120 · selfCost −70 · cooldown 8500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Shield separation at apex; player aims Phoenix, Shield auto-targets. QTE "Prominence Impact" hold J. Full (350–500ms): Phoenix spin −80, imp 1600eu, KO 4200eu, dmg 1.82×, burst +15%; Shield spin −35, imp 700eu, KO 1800eu, dmg 1.42×, burst +8%; 1v1 combined: dmg 2.24×. Multi-bey: separate target stats only.  
**Special Move**: Double Prominence Dive — QTE hold J; full 1v1 combined dmg 2.24×; multi-bey split  
**Compatible beys**: any with Prominence Phoenix blade  
**Engine Note**: Phoenix full: dmg 1.82×; Shield full: dmg 1.42×; combined 2.24×; multiTarget flag

---

### [Case 1121 — [COMBO] Prominence Crash (↓ ↑ K)](./13%20case%20study.md#case-1121)

**System**: CS13 Combo · Phelix Payne · Prominence Phoenix Tapered Metal Universe-10  
**Geometry**: Sequence: ↓ (moveDown) + ↑ (moveUp) + K · windowMs 700 · cooldownMs 4800  
**Spin Coupling**: combo (requires `prominencePhoenixBlade`)  
**Contact Points**: K: Shield outer edge contact on downswing (shieldEdgeLift 35eu)  
**Movement Freedom**: ↓-↑ oscillation creates vertical momentum  
**Base Stats**: cost 25 power · type: attack  
**Mechanism**: Dip low (↓), surge upward (↑ mini-launch arc), Shield-edge brace contact on downswing (K: spin −46, dmg 1.33×, lock 45ms, shieldEdgeLift 35eu). Ground echo of Double Prominence Dive descent phase. Ceiling: 1.33×≤1.5×; 45ms lock ≤ 300ms; shieldEdgeLift 35eu minor.  
**Engine Note**: K: spinDelta −46, dmg 1.33×, lock 45ms, shieldLift 35eu; cost 25

---

### [Case 1122 — [GIMMICK] Rantaro & Ranjiro Kiyama — Glide Roktavor Wheel Revolve 1S](./13%20case%20study.md#case-1122)

**System**: Gen4-Burst-Surge · GIMMICK · Tag-Team (first Tag-Team Special in CS13)  
**Geometry**: m = 27.0 g · I = 1.526×10⁻⁵ kg·m² · ω₀ = 800 rad/s · Revolve 1S bit μ ≈ 0.06  
**Material**: Glide Roktavor blade (octopus-motif wide orbital sweeps) + Revolve 1S free-spinning bit  
**Spin Coupling**: rigid  
**Contact Points**: Revolve 1S r = 0.20 cm · floor · orbital sweep contacts  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 20 · Stamina 70 · Speed 50  
**Mechanism**: Both Kiyama brothers use identical Glide Roktavor assemblies. For Double Tornado: must orbit at 180° offset, same radius, speed within 0.3 m/s. Full sync (η=1.0): Ω_double = 25 rad/s, vortex radius 1.5× single. Sync tolerance ±20°. Desync (η<0.5): collapses to individual Glide Tornados. Spin decay: dω/dt = 2.08 rad/s².  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · orbital sweep arc; dual-bey sync visual  
**Gimmick**: `doubleRoktavorOrbit(v_A, v_B, offset_deg)` → syncQuality, Omega_double, vortexRadiusMult  
**Engine Note**: syncTolerance ±20°; Omega_double 25 rad/s at perfect sync; vortexMult 1.5×

---

### [Case 1123 — [SPECIAL] Double Tornado](./13%20case%20study.md#case-1123)

**System**: CS13 Special Move · Rantaro + Ranjiro Kiyama · Glide Roktavor Wheel Revolve 1S · TAG-TEAM  
**Geometry**: Phase 1: Sync Spiral 1222 ms · Phase 2: Tornado Eruption 800 ms + duration 1500 ms (3 × 500 ms cycles)  
**Material**: Full sync (η=1.0): per-opponent per 500ms: spinDelta −45, impulse 600eu, dmg 1.45×; finalKO 2000eu  
**Spin Coupling**: special override · tag-team: both players activate within 500 ms sync window  
**Contact Points**: full-arena AoE — all opponents regardless of position  
**Movement Freedom**: both allied beys invulnerable during Phase 2 (1500 ms)  
**Base Stats**: spinCost −80 each · powerCost 120 each · cooldown 9000 ms shared  
**Mechanism**: NOTE: special moves override all EG/clutch/mechanical limits; anime physics override. First Tag-Team Special in CS13. Both players activate within 500 ms. QTE "Sync Hold" — both hold J during Phase 1 (η_sync builds). Partial (0.5≤η<1.0): stats scale by η. Desync (η<0.5): two individual Glide Tornados. Full sync 1500ms: total spinDrain −135 per opponent + 2000eu final burst.  
**Special Move**: Double Tornado — TAG-TEAM; sync window 500 ms; full: 3×(spin −45, imp 600eu, dmg 1.45×) + 2000eu burst  
**Compatible beys**: BOTH players must have Glide Roktavor assembled  
**Engine Note**: tagTeam = true; syncWindow 500 ms; sharedCooldown 9000 ms; AoE all opponents

---

### [Case 1124 — [COMBO] Glide Sweep (↓ ↑ J)](./13%20case%20study.md#case-1124)

**System**: CS13 Combo · Rantaro Kiyama · Glide Roktavor Wheel Revolve 1S  
**Geometry**: Sequence: ↓ (moveDown) + ↑ (moveUp) + J · windowMs 600 · cooldownMs 3200  
**Spin Coupling**: combo (requires `glideRoktavorBlade`)  
**Contact Points**: J: blade contact at arc apex with sweepImpulse 40eu (lateral push-past)  
**Movement Freedom**: orbital sweep approach  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: Backstroke (↓), forward glide sweep (↑), blade contact at apex (J: spin −32, dmg 1.22×, lock 35ms, sweepImpulse 40eu). Miniature single-bey echo of Double Tornado orbital approach. Free cost — orbital design makes sweep trivially accessible. Both brothers can use simultaneously; no Double Tornado bonus (full special requires separate activation).  
**Engine Note**: J: spinDelta −32, dmg 1.22×, lock 35ms, sweepImpulse 40eu; cost 0 free

---

## CS2 Overflow — Cases 1125–1126 {#cs2-overflow-1125}
Source: `2 case study.md` (Cases 1125–1126 — Plastic Gen assembly cases: Trygle (A-F Series) + Wyborg (A-F Series))

---

### [Case 1125 — Assembly: Trygle (Triple Wing AR + Eight Wide WD + SG Spring + Jumping Base Trygle)](./2%20case%20study.md#case-1125)

**System**: Gen1-Plastic / SG (Spin Gear) · Assembly · A-to-F Series  
**Geometry**: m = 30.5 g · I = 2.314×10⁻⁵ kg·m² · ω₀ ≈ 104.7 rad/s  
**Material**: ABS/polycarbonate · ski-tip μ = 0.22  
**Spin Coupling**: SG Spring Version (spring pre-loads Jumping Base)  
**Contact Points**: ski tips r = 0.50 cm · floor (ski-contact unstable at θ > 8°)  
**Movement Freedom**: Jumping Base ski contact — positive-feedback tilt collapse above 8°  
**Base Stats**: Attack 20 · Defense 20 · Stamina 10 · Speed 25 (all undermined by tilt instability)  
**Mechanism**: SG Spring elevates base ~2 mm (worsens upper-attack exposure). t_stall theoretical 7.4 s (neutral tilt); real 1–3 s (tilt instability collapse). Eight Wide WD I = 9.97×10⁻⁶ (43.1% of total) — extends stable window ~0.8 s but insufficient. Triple Wing AR (near-tangential smash = 0.15, RS/LS equal) wasted — cannot operate without stable platform. WBO: banned (Jumping Base excluded from standard legal sets).  
**2.5D Rendering**: z_cm ≈ 1.5 · ski-tip contact profile  
**Gimmick**: Jumping Base positive-feedback tilt collapse (Case 110 cross-ref); ski tip θ_crit = 8°  
**Engine Note**: tiltInstability = true; t_real = 1–3 s; noCompetitiveUse = true

---

### [Case 1126 — Assembly: Wyborg (Double Snake AR + Eight Balance WD + SG Auto Change + SG Auto Change Base)](./2%20case%20study.md#case-1126)

**System**: Gen1-Plastic / SG (Spin Gear) · Assembly · A-to-F Series  
**Geometry**: m = 29.0 g · I = 2.124×10⁻⁵ kg·m² · ω₀ ≈ 104.7 rad/s  
**Material**: ABS/polycarbonate · Mode 1 flat μ = 0.20; Mode 2 rim μ = 0.05  
**Spin Coupling**: SG Auto Change (tip retracts on lateral F > 0.5 N → Mode 2 rim-riding)  
**Contact Points**: Mode 1: flat r = 0.60 cm; Mode 2: outer rim r = 2.50 cm  
**Movement Freedom**: tip retracts to rim-riding mode on heavy impact  
**Base Stats**: Attack 15 · Defense 40 · Stamina 50 · Speed 20  
**Mechanism**: Mode 1: dω/dt = 16.1 rad/s² (t_stall 6.5 s). Mode 2 post-impact rim-riding: similar decay rate but can self-KO by hopping wall at high orbital speed. Against left-spin: auto-recentres (beneficial). Against attack-type RS (BK/BK2, F > 0.8–1.4 N): Mode 2 triggers → orbital self-KO risk. Double Snake AR: RS smash 0.22, counter-spin (LS attacker) smash 0.41 → 1.8× recoil per contact in LS encounters. Combat t_stall ≈ 4.7–6.5 s.  
**2.5D Rendering**: z_cm ≈ 1.5 · double snake profile; auto-change mechanism  
**Gimmick**: `autoChange(lateralForce)` → Mode 2 rim-riding if F > 0.5 N; self-KO risk vs RS  
**Engine Note**: autoChangeTrigger = 0.5 N; counterSpinRecoil 1.8×; Mode2 selfKO risk vs RS attackers

---

## CS6 Overflow — Cases 1127–1134 {#cs6-overflow-zerog-assemblies}
Source: `6 case study.md` (Cases 1127–1134 — Zero-G assembly cases: 8 stock Synchrome combos)

---

### [Case 1127 — Assembly: Samurai Ifraid W145CF](./6%20case%20study.md#case-1127)

**System**: Gen2-ZeroG / Synchrome · Assembly · Smash Attack  
**Geometry**: m = 61.16 g · I = 5.873×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s (ZeroG launcher)  
**Material**: Ifraid Chrome Wheel (51.26 g, heaviest ZeroG CW) + Samurai Crystal Wheel (5.4 g) + W145 (3.8 g) + CF tip (0.7 g)  
**Spin Coupling**: Synchrome (single Chrome Wheel + Crystal Wheel)  
**Contact Points**: Ifraid 6-blade smash at r = 40 mm · CF disc wall engagement  
**Movement Freedom**: fixed  
**Base Stats**: Attack 95 · Defense 50 · Stamina 20 · Speed 80  
**Mechanism**: Ifraid 80.6% of system I (51.78×10⁻⁶). L₀ = 5.533×10⁻³ N·m·s (highest single-layer ZeroG). Per-contact KO impulse: 0.130 N·s (sufficient for ring-out from stadium centre vs 55g opponent). CF tip dω/dt = 23.4 rad/s² → t_stall ≈ 4.0 s (irrelevant — wins by KO). W145 upward deflection reduces self-recoil ~15%. WBO Tier 1 attack.  
**2.5D Rendering**: z_cm = 1.45 (W145) · 6-blade Ifraid silhouette  
**Engine Note**: I_total 5.873×10⁻⁵; J_contact 0.130 N·s; t_stall 4.0 s; Tier1 attack

---

### [Case 1128 — Assembly: Pirates Orojya 145D](./6%20case%20study.md#case-1128)

**System**: Gen2-ZeroG / Synchrome · Assembly · Defense / Stamina  
**Geometry**: m = 32.62 g · I = 2.983×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s  
**Material**: Orojya Chrome Wheel (25.94 g) + Pirates Crystal Wheel (4.0 g) + 145 (2.0 g) + D tip (0.68 g)  
**Spin Coupling**: Synchrome  
**Contact Points**: Orojya round profile deflects tangentially · D tip r = 0.447 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 60 · Stamina 80 · Speed 20  
**Mechanism**: Orojya 83.7% of system I. D tip: dω/dt = 5.14 rad/s² → t_stall = 18.3 s (best stamina in covered single-CW ZeroG parts). Orojya's rounded shell deflects contacts (low recoil). D tip centripetal self-centres after wall contact. Stamina-efficient single-Chrome-Wheel ZeroG assembly.  
**2.5D Rendering**: z_cm = 1.45 (145) · round Orojya profile  
**Engine Note**: I_total 2.983×10⁻⁵; t_stall 18.3 s; self-centring D tip; stamina leader

---

### [Case 1129 — Assembly: Thief Phoenic E230GCF](./6%20case%20study.md#case-1129)

**System**: Gen2-ZeroG / Synchrome · Assembly · Tall-Height Stamina  
**Geometry**: m = 41.4 g · I = 3.496×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s  
**Material**: Phoenic Chrome Wheel (29.8 g) + Thief Crystal Wheel (5.3 g) + E230 (5.5 g) + GCF (0.8 g)  
**Spin Coupling**: Synchrome  
**Contact Points**: GCF gear-tooth outer disc r = 1.674 cm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 45 · Stamina 55 · Speed 35  
**Mechanism**: E230 raises contact zone to 28–32 mm above dish — standard 145-height opponents contact lower shell (~35% impulse reduction). GCF higher-than-expected friction (r_contact = 1.0 cm at outer gear ring) → dω/dt = 20.9 rad/s² → t_stall = 4.5 s. Stamina shorter than D-tipped assemblies by 13.8 s. Situational vs short-track opponents only.  
**2.5D Rendering**: z_cm = 2.30 (E230) · Phoenic at extreme height  
**Engine Note**: I_total 3.496×10⁻⁵; t_stall 4.5 s; height evasion −35% impulse vs 145-height opponents

---

### [Case 1130 — Assembly: Dark Knight Dragooon LW160BSF](./6%20case%20study.md#case-1130)

**System**: Gen2-ZeroG / Synchrome · Assembly · Left-Wing Stamina  
**Geometry**: m = 39.77 g · I = 3.532×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s · LW160 left-facing wings  
**Material**: Dragooon Chrome Wheel (30.9 g) + Dark Knight Crystal Wheel (3.87 g) + LW160 (4.2 g) + BSF (0.8 g)  
**Spin Coupling**: Synchrome  
**Contact Points**: BSF blade fins r = 0.985 cm · LW160 wings cosmetic aerodynamic  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 50 · Stamina 60 · Speed 35  
**Mechanism**: BSF blade fins: dω/dt = 17.0 rad/s². LW160 left-wing sweep: aerodynamic download reduces normal force ~8% at high ω → extends t_stall from 5.5 s → ~6.0 s net. Mid-tier ZeroG stamina. LW160 aero benefit real but modest. RS spin direction (LW160 designed for RS despite left-wing designation).  
**2.5D Rendering**: z_cm = 1.60 (LW160) · left-wing sweep silhouette  
**Engine Note**: I_total 3.532×10⁻⁵; t_stall ~6.0 s with LW160 aero; mid-tier stamina

---

### [Case 1131 — Assembly: Archer Gargole SA165WSF](./6%20case%20study.md#case-1131)

**System**: Gen2-ZeroG / Synchrome · Assembly · Attack-Defense Hybrid  
**Geometry**: m = 41.54 g · I = 3.559×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s  
**Material**: Gargole Chrome Wheel (29.5 g) + Archer Crystal Wheel (5.16 g) + SA165 (6.18 g) + WSF (0.7 g)  
**Spin Coupling**: Synchrome  
**Contact Points**: WSF r = 0.90 cm; SA165 switch-fold wings (extend at high ω, fold at < 35% ω₀)  
**Movement Freedom**: SA165 switch mechanism (centrifugal wing extension/fold)  
**Base Stats**: Attack 60 · Defense 45 · Stamina 30 · Speed 55  
**Mechanism**: WSF tip: dω/dt = 25.8 rad/s² → t_stall = 3.7 s. SA165 wings: extend (centrifugal) at high spin for attack; fold under impact below 35% ω₀ → reduces late-match recoil vulnerability. Mid-match attack; late-match defense via fold. Outclassed by pure attack (Ifraid) or pure stamina (Orojya/D).  
**2.5D Rendering**: z_cm = 1.65 (SA165) · switch-fold wing mechanism  
**Engine Note**: I_total 3.559×10⁻⁵; t_stall 3.7 s; SA165 switchFold at < 35% ω₀

---

### [Case 1132 — Assembly: Berserker Begirados SR200BWD](./6%20case%20study.md#case-1132)

**System**: Gen2-ZeroG / Synchrome · Assembly · Stamina / High-Track Defense  
**Geometry**: m = 54.2 g · I = 5.060×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s · SR200 h = 20.0 mm  
**Material**: Begirados Chrome Wheel (45.6 g, 2nd heaviest ZeroG CW) + Berserker Crystal Wheel (4.5 g) + SR200 (3.3 g) + BWD (0.8 g)  
**Spin Coupling**: Synchrome  
**Contact Points**: BWD r = 1.40 cm; SR200 armor walls absorb ~20% first-contact energy  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 65 · Stamina 75 · Speed 20  
**Mechanism**: BWD tip: dω/dt = 12.6 rad/s² (μ_BWD = 0.10). SR200 height (20 mm): 145-height opponents contact lower shell → −28% effective impulse → +1.4 s adjusted t_stall. Net t_stall ≈ 8.9 s. Strong stamina-defense tier. Susceptible to upper-attack from Ifraid at correct angle (tall assembly).  
**2.5D Rendering**: z_cm = 2.00 (SR200) · Begirados large profile  
**Engine Note**: I_total 5.060×10⁻⁵; t_stall ~8.9 s; SR200 height evasion +1.4 s; anti-upper weak

---

### [Case 1133 — Assembly: Bandid Genbull F230TB](./6%20case%20study.md#case-1133)

**System**: Gen2-ZeroG / Synchrome · Assembly · Extreme-Height Stamina  
**Geometry**: m = 41.5 g · I = 3.548×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s · F230 h = 23.0 mm free-spin  
**Material**: Genbull Chrome Wheel (30.4 g) + Bandid Crystal Wheel (4.8 g) + F230 (5.5 g) + TB (0.8 g)  
**Spin Coupling**: Synchrome + F230 free-spin vibration damping  
**Contact Points**: TB twin-ball r = 0.60 cm each  
**Movement Freedom**: F230 upper section decoupled; TB offset inner ball sustains wobble  
**Base Stats**: Attack 15 · Defense 60 · Stamina 80 · Speed 20  
**Mechanism**: TB tip: dω/dt = 9.70 rad/s². F230 free-spin: ~25% impact energy dissipation per contact → adjusted t_stall ≈ 11.2 s. Top-tier ZeroG stamina (known competitive assembly). TB twin-ball wobble: less stable than single-D; susceptible to erratic approach. F230 + Genbull height (23 mm) evasion vs 145/165 opponents.  
**2.5D Rendering**: z_cm = 2.30 (F230) · Genbull with free-spin track  
**Engine Note**: I_total 3.548×10⁻⁵; t_stall ~11.2 s with F230 damping; top-tier stamina

---

### [Case 1134 — Assembly: Killerken Balro A230WB (Dual-Chrome Synchrome)](./6%20case%20study.md#case-1134)

**System**: Gen2-ZeroG / Dual-Chrome Synchrome · Assembly · Defense / High-Mass  
**Geometry**: m = 66.05 g · I = 6.121×10⁻⁵ kg·m² · ω₀ ≈ 94.2 rad/s · Dual Chrome (no Crystal Wheel)  
**Material**: Balro Chrome Wheel (29.4 g, outer) + Killerken Chrome Wheel (30.45 g, inner) + A230 (5.5 g) + WB (0.7 g)  
**Spin Coupling**: Dual-Chrome stack (two full Chrome Wheels — nearly doubles I vs standard)  
**Contact Points**: WB r = 0.70 cm; A230 armor walls absorb ~20% contact energy  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 80 · Stamina 70 · Speed 15  
**Mechanism**: L₀ = 5.766×10⁻³ N·m·s (highest in batch — slightly above Ifraid 5.533×10⁻³ but stored in defense shells not attack blades). WB: dω/dt = 8.17 rad/s² → t_stall = 11.5 s. 66 g mass resists KO + spin-steal. A230 armor ~20% energy absorption. Primary weakness: very high mass → launch difficulty; wide WB movement can self-KO at very high spin. Definitive defensive configuration in covered ZeroG parts library.  
**2.5D Rendering**: z_cm = 2.30 (A230) · dual-Chrome massive stack  
**Engine Note**: I_total 6.121×10⁻⁵; L₀ 5.766×10⁻³; t_stall 11.5 s; highest mass in covered ZeroG assemblies

---

## CS13 Overflow — Cases 1135–1157 {#cs13-overflow-1135}
Source: `13 case study.md` (Cases 1135–1157 — Dan/Reiki Sodo, Lui Shirosagi, Ranzo Kiyama, Ryuga × 2, Meteo Ryuga, Daigo/Black Eye triplets)

---

### [Case 1135 — [GIMMICK] Dan & Reiki Sodo — Evil Gemios DF145FS](./13%20case%20study.md#case-1135)

**System**: Gen2-MFB / HWS · GIMMICK · Tag-Team foundation  
**Geometry**: m = 34.0 g · I = 2.268×10⁻⁵ kg·m² · ω₀ = 750 rad/s · DF145 aerodynamic downforce  
**Material**: Evil Metal Wheel + ABS/PC · DF145 downforce fin rake angle θ_fin = −15°  
**Spin Coupling**: FS dual-mode (flat: μ = 0.32; sharp: μ = 0.09)  
**Contact Points**: DF145 fin tips at r ≈ 3.0 cm · floor (FS contact)  
**Movement Freedom**: FS mode switch at ω threshold  
**Base Stats**: Attack 55 · Defense 35 · Stamina 50 · Speed 65  
**Mechanism**: DF145 downforce fins generate downward aerodynamic force: F_down = 0.0028 ω² N. Two FS modes: flat (aggressive approach) and sharp (orbital stamina). θ_sync = 90° — Dan and Reiki must orbit at 90° offset for Down Burst tag-team thermal amplification. I_total 2.268×10⁻⁵; dω/dt_flat = 9.8 rad/s², dω/dt_sharp = 0.52 rad/s².  
**2.5D Rendering**: z_cm = 1.45 (DF145) · Evil wheel twin-Gemios silhouette; downforce fin visual  
**Gimmick**: `df145Downforce(omega)` → F_down = 0.0028 × ω²; θ_sync = 90° for Down Burst  
**Engine Note**: I = 2.268×10⁻⁵; F_down per rads²; thetaSync 90° tag-team requirement

---

### [Case 1136 — [SPECIAL] Down Burst](./13%20case%20study.md#case-1136)

**System**: CS13 Special Move · Dan + Reiki Sodo · Evil Gemios DF145FS · TAG-TEAM  
**Geometry**: Phase 1: Sync Approach 600 ms (θ_sync = 90° offset) · Phase 2: Thermal Burst 1500 ms (3 × 500 ms cycles) · Full KO: finalKO 1800 eu  
**Material**: Ω_thermal = 33.0 rad/s at η = 1.0; fire + ice thermal amplification (dual-element)  
**Spin Coupling**: special override · tag-team: both activate within 500 ms  
**Contact Points**: AoE all opponents; full-arena thermal wave  
**Movement Freedom**: both allied beys invulnerable during Phase 2 (1500 ms)  
**Base Stats**: spinCost −80 each · powerCost 120 each · cooldown 9000 ms shared  
**Mechanism**: NOTE: special moves override all EG/clutch/mechanical limits; anime physics override. Second Tag-Team Special. Dan (fire) + Reiki (ice) orbit at θ_sync = 90°. Per 500 ms cycle at η = 1.0: spinDelta −40, impulse 480 eu, dmgMult 1.40×. Full 3 cycles + finalKO: totalSpinDelta −120, totalImpulse 1440 eu + 1800 eu burst. Partial sync (0.5 ≤ η < 1.0): scale by η.  
**Special Move**: Down Burst — TAG-TEAM; θ_sync = 90°; full: 3×(spin −40, 480eu, 1.40×) + 1800eu burst  
**Compatible beys**: BOTH players must have Evil Gemios DF145FS  
**Engine Note**: tagTeam = true; thetaSync 90°; thermalAmpFire+Ice; fullTotalSpin −120; sharedCooldown 9000 ms

---

### [Case 1137 — [COMBO] Gemios Arc (↑ ← J)](./13%20case%20study.md#case-1137)

**System**: CS13 Combo · Dan Sodo · Evil Gemios DF145FS  
**Geometry**: Sequence: ↑ (moveUp) + ← (moveLeft) + J · windowMs 600 · cooldownMs 3100  
**Spin Coupling**: combo (requires `evilGemiosWheel`)  
**Contact Points**: J: Evil wheel asymmetric orbital drift hit; arcImpulse 35 eu lateral  
**Movement Freedom**: orbital arc approach  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: DF145's downforce fins bias orbit inward during ↑ surge; ← arcs the approach to align the Evil wheel's asymmetric contact (J: spin −28, dmg 1.18×, lock 30ms, arcImpulse 35eu). Ground-level miniature of Down Burst orbital-sync approach. Free cost — orbital bias is inherent to DF145 design.  
**Engine Note**: J: spinDelta −28, dmgMult 1.18×, lockMs 30, arcImpulse 35eu; cost 0 free

---

### [Case 1138 — [GIMMICK] Lui Shirosagi — Nightmare Lúinor Destroy](./13%20case%20study.md#case-1138)

**System**: Gen4-Burst-Turbo · GIMMICK  
**Geometry**: m = 44.5 g · I = 3.950×10⁻⁵ kg·m² · ω₀ = 580 rad/s · 3-click burst regulation  
**Material**: Dragon-head click-burst blade + Destroy driver (aggressive orbital)  
**Spin Coupling**: click-burst (3 stages: ×1.2 → ×1.5 → ×2.0 dmg; +30%/+50%/+75% burst risk)  
**Contact Points**: r_outer ≈ 38 mm dragon-head contacts; Destroy flat tip dω/dt = 47.0 rad/s²  
**Movement Freedom**: aggressive orbital (Destroy driver)  
**Base Stats**: Attack 80 · Defense 20 · Stamina 25 · Speed 75  
**Mechanism**: Three dragon-head clicks activate sequentially on repeated contact. Click 1: dmg ×1.2, burstRisk +30%. Click 2: dmg ×1.5, burstRisk +50%. Click 3: dmg ×2.0, burstRisk +75%. Dragon Crash (Case 1139) triggers full-click counterattack. Destroy driver: dω/dt = 47.0 rad/s² (very high decay — short aggressive window).  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · dragon-head 3-click mechanism visual  
**Gimmick**: `nightmareLuinorClicks(n)` → dmgMult[1.2, 1.5, 2.0]; burstRisk[30,50,75]%  
**Engine Note**: clickCount 3; dmgMult escalation; Destroy dω/dt 47.0 rad/s²; shortWindow

---

### [Case 1139 — [SPECIAL] Dragon Crash](./13%20case%20study.md#case-1139)

**System**: CS13 Special Move · Lui Shirosagi · Nightmare Lúinor Destroy  
**Geometry**: Stance phase (F_trigger ≥ 400 eu) + 3-click trigger sequence (600 ms) · counterImpulse 480 eu  
**Material**: BeySpirit reactive counterattack; must survive burst check at Click 3  
**Spin Coupling**: special override  
**Contact Points**: Click 3 deepest engagement; post-activation +75% residual burstRisk  
**Movement Freedom**: stance mode (stops orbital movement during trigger phase)  
**Base Stats**: powerCost 90 · selfCost −50 · cooldown 7500 ms  
**Mechanism**: NOTE: special move overrides all burst regulation mechanical state; anime physics override. Reactive: activated by incoming hit (F_trigger ≥ 400 eu). Stance + 3-click sequence: survives burst check → counterImpulse 480 eu, dmgMult 2.0×, lockMs 120, KO 2200 eu. Post-activation: residual burstRisk +75% for 3000 ms (Nightmare Lúinor risks self-burst after triggering). Partial (survives 2 clicks): counterImpulse 300 eu, dmg 1.50×.  
**Special Move**: Dragon Crash — reactive; F_trigger ≥ 400 eu; full 3-click: counter 480eu, dmg 2.0×, KO 2200eu  
**Compatible beys**: any with Nightmare Lúinor blade + Destroy driver  
**Engine Note**: reactive = true; postActivation burstRisk +75%; fullCounter: dmg 2.0×, lock 120ms

---

### [Case 1140 — [COMBO] Dragon Head Guard (K ↓ J)](./13%20case%20study.md#case-1140)

**System**: CS13 Combo · Lui Shirosagi · Nightmare Lúinor Destroy  
**Geometry**: Sequence: K + ↓ (moveDown) + J · windowMs 650 · cooldownMs 3500  
**Spin Coupling**: combo (requires `nightmareLuinorBlade`)  
**Contact Points**: J: absorb-drop-counter; counterPush 60 eu  
**Movement Freedom**: ↓ retreats to lower contact plane before counter  
**Base Stats**: cost 15 power · type: defense  
**Mechanism**: K brace absorbs incoming (incomingDmg ×0.65), ↓ drops center of mass for counter-approach, J delivers dragon-head counter-strike (spin −35, dmg 1.28×, lock 45ms, counterPush 60eu). Single-click echo of Dragon Crash's reactive stance. Ceiling: 1.28×≤1.5×; 45ms≤300ms lock.  
**Engine Note**: J: spinDelta −35, dmgMult 1.28×, lockMs 45, counterPush 60eu; K: ×0.65; cost 15 defense

---

### [Case 1141 — [GIMMICK] Ranzo Kiyama — Cyclone Roktavor Giga Never-6](./13%20case%20study.md#case-1141)

**System**: Gen4-Burst-Surge · GIMMICK  
**Geometry**: m = 30.5 g · I = 1.673×10⁻⁵ kg·m² · ω₀ = 800 rad/s · 4-wing vortex design  
**Material**: 4-wing Roktavor blade + Never-6 low-friction driver; μ = 0.06  
**Spin Coupling**: rigid  
**Contact Points**: 4-wing outer sweep contacts; Never-6 r_contact ≈ 2.0 mm  
**Movement Freedom**: fixed  
**Base Stats**: Attack 30 · Defense 50 · Stamina 70 · Speed 40  
**Mechanism**: Four vortex wings at 90° spacing. Ω_cyclone = 16.20 rad/s (single bey orbit). DWC shield radius r = 70 mm, DWCG shield radius r = 95 mm (Case 1142/1143). Spin decay: dω/dt = 1.61 rad/s² (Never-6 excellent stamina). Cyclone shield collapses below ω = 200 rad/s.  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · 4-wing vortex silhouette; cyclone visual at high ω  
**Gimmick**: `cycloneRoktavorVortex(omega)` → vortexActive: omega ≥ 200; shieldR 70/95 mm  
**Engine Note**: dω/dt 1.61 rad/s²; Omega_cyclone 16.20 rad/s; DWC_r 70 mm; DWCG_r 95 mm

---

### [Case 1142 — [SPECIAL] Double Winged Cyclone](./13%20case%20study.md#case-1142)

**System**: CS13 Special Move · Ranzo Kiyama · Cyclone Roktavor Giga Never-6  
**Geometry**: Active 1500 ms · DWC shield r = 70 mm · 7 × 200 ms windows max  
**Material**: BeySpirit cyclone spin-up; collapses if ω < 200 rad/s  
**Spin Coupling**: special override  
**Contact Points**: any opponent within r = 70 mm → deflect 300 eu + dmgMult 1.15×  
**Movement Freedom**: defensive hold (does not orbit during DWC)  
**Base Stats**: powerCost 100 · spinCost −60 · cooldown 7500 ms · duration 1500 ms  
**Mechanism**: NOTE: special move overrides all burst regulation mechanical state; anime physics override. Defensive cyclone shield. Per 200 ms window: spinDelta −20, deflect 300 eu, dmgMult 1.15×. Max 7 windows at full duration. Shield collapses if ω falls below 200 rad/s during activation. Total at full: spinDelta −140, 2100 eu deflect.  
**Special Move**: Double Winged Cyclone — shield r 70mm; per 200ms: spin −20, 300eu, 1.15×; collapse < 200 ω  
**Compatible beys**: any with Cyclone Roktavor blade + Never-6 driver  
**Engine Note**: DWC_r 70mm; 7 windows max; spinCollapse at ω < 200; duration 1500 ms

---

### [Case 1143 — [SPECIAL] Double Winged Cyclone Grande](./13%20case%20study.md#case-1143)

**System**: CS13 Special Move · Ranzo Kiyama · Cyclone Roktavor Giga Never-6 (Grande form)  
**Geometry**: Active 2000 ms · DWCG capture r = 95 mm · capture threshold v_opp < 1.8 m/s  
**Material**: BeySpirit expanded vortex; capture → inward pull; final eject 1600 eu  
**Spin Coupling**: special override  
**Contact Points**: opponents within r = 95 mm → capture if v < 1.8 m/s; per 200 ms: inward 250 eu  
**Movement Freedom**: hold position during capture; final eject outward  
**Base Stats**: powerCost 110 · spinCost −80 · cooldown 8500 ms · duration 2000 ms  
**Mechanism**: NOTE: special move overrides all burst regulation; anime physics override. Enhanced cyclone expands radius to 95 mm and captures opponents (v < 1.8 m/s threshold). Per 200 ms window: spinDelta −30, inward 250 eu, dmgMult 1.25×. Final eject: 1600 eu outward, spinDelta −50. Total (10 windows): spinDelta −350, inward 2500 eu + 1600 eu eject.  
**Special Move**: DWCG — capture r 95mm; per 200ms: spin −30, inward 250eu, 1.25×; eject 1600eu  
**Compatible beys**: any with Cyclone Roktavor blade + Never-6 driver  
**Engine Note**: captureThreshold v < 1.8 m/s; finalEject 1600eu; totalSpin −350; DWCG_r 95 mm

---

### [Case 1144 — [COMBO] Cyclone Wing (↑ → J)](./13%20case%20study.md#case-1144)

**System**: CS13 Combo · Ranzo Kiyama · Cyclone Roktavor Giga Never-6  
**Geometry**: Sequence: ↑ (moveUp) + → (moveRight) + J · windowMs 600 · cooldownMs 3100  
**Spin Coupling**: combo (requires `cycloneRoktavorBlade`)  
**Contact Points**: J: orbital arc blade contact; wake 30 eu (trailing vortex drag)  
**Movement Freedom**: arc surge approach  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: ↑ surge, → arc turns along orbital path, J delivers wing blade at apex (spin −30, dmg 1.20×, lock 25ms, wake 30eu). Miniature echo of DWC/DWCG orbital setup. Free cost — natural to Never-6 stamina orbit.  
**Engine Note**: J: spinDelta −30, dmgMult 1.20×, lockMs 25, wake 30eu; cost 0 free

---

### [Case 1145 — [GIMMICK] Ryuga — L-Drago Destructor F:S + L-Drago Destroy DF105LRF](./13%20case%20study.md#case-1145)

**System**: Gen2-MFB / HWS · GIMMICK · Left-spin absorb + F:S mode switch  
**Geometry**: m = 55.6 g (Destructor F:S) · I = 5.024×10⁻⁵ kg·m² · LEFT-SPIN · ω₀ = 580 rad/s  
**Material**: L-Drago Destructor absorb wings (k_absorb = 0.15); F:S mode switch (Hole Flat / Sharp)  
**Spin Coupling**: spin-steal k_absorb = 0.15 per contact; F:S dual-mode tip  
**Contact Points**: 3 absorb-wing contacts at 120° · Hole Flat: μ = 0.32 (dω/dt 23.0 rad/s²); Sharp: μ = 0.09 (dω/dt 1.64 rad/s²)  
**Movement Freedom**: F:S mode switch via tilt threshold  
**Base Stats**: Attack 65 · Defense 30 · Stamina 60 · Speed 60  
**Mechanism**: Left-spin absorb wings steal spin from right-spin opponents on contact. dmgMult_de cap 2.0× at absorb = 200 rad/s total stolen. Hole Flat (Final) mode: aggressive orbital, fast decay. Sharp (Survive) mode: stamina precision. F:S switches automatically. L-Drago Destroy DF105LRF variant: DF105 downforce + LRF Left Rubber Flat for stronger absorb orbit.  
**2.5D Rendering**: z_cm ≈ 1.45 (145/105 height) · left-spin L-Drago silhouette; absorb-wing mark  
**Gimmick**: `lDragoAbsorb(deltaOmega, absorbed)` → k=0.15; dmgMult cap 2.0× at absorbed=200  
**Engine Note**: leftSpin = true; absorb k=0.15; HoleFlat dω/dt 23.0; Sharp dω/dt 1.64; cap 2.0× at 200

---

### [Case 1146 — [SPECIAL] Dragon Emperor Life Destructor](./13%20case%20study.md#case-1146)

**System**: CS13 Special Move · Ryuga · L-Drago Destructor F:S (mode-dependent)  
**Geometry**: HoleFlat: CCW fire ring AoE full arena · Sharp: targeted inferno beam + rock crash  
**Material**: dmgMult_eff = base + min(totalAbsorbed/200, 1.0) × 0.50 (absorb power scaling)  
**Spin Coupling**: special override  
**Contact Points**: HoleFlat: AoE sweep all opponents; Sharp: single-target + wall  
**Movement Freedom**: HoleFlat holds position; Sharp linear charge  
**Base Stats**: powerCost 110 · selfCost −60 · cooldown 9000 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. Power scales with prior absorbed spin. HoleFlat: 3 sweep cycles × 300 ms (each: spinDelta −45, impulse 600 eu, dmgMult 1.50×, fireDoT +1.30×/2500ms) + final burst 1600 eu. Sharp: Phase A nova (spinDelta −55, dmg 1.70×, fireDoT +1.40×/3000ms, 500eu) + Phase B rock crash (wall 2200eu, spinDelta −80). vsRago variant: dmg ×2.5 override.  
**Special Move**: DELD — HoleFlat AoE 3 sweeps + 1600eu burst; Sharp nova + 2200eu wall; absorb scaling  
**Compatible beys**: any with L-Drago Destructor layer + F:S driver  
**Engine Note**: absorbScaling: base + min(absorbed/200,1.0)×0.50; HoleFlat sweep; Sharp wallImpact 2200eu

---

### [Case 1147 — [COMBO] Dragon Fang (← ↑ J)](./13%20case%20study.md#case-1147)

**System**: CS13 Combo · Ryuga · L-Drago Destructor F:S  
**Geometry**: Sequence: ← (moveLeft) + ↑ (moveUp) + J · windowMs 700 · cooldownMs 3800  
**Spin Coupling**: combo (requires `lDragoDestructorWheel`)  
**Contact Points**: J: left-spin CCW approach + partial absorb; absorbGain +15 ω  
**Movement Freedom**: CCW orbital approach (left-spin natural direction)  
**Base Stats**: cost 25 power · type: attack  
**Mechanism**: ← moves into CCW orbital path, ↑ surges toward opponent along absorb-wing approach vector, J delivers blade contact with partial spin-steal (spin −40, dmg 1.35×, lock 50ms, absorbGain +15ω). Left-spin absorb approach — stronger than Meteo Spiral's +10ω because Destructor wings are larger. Ceiling: 1.35×≤1.5×; 50ms≤300ms.  
**Engine Note**: J: spinDelta −40, dmgMult 1.35×, lockMs 50, absorbGain +15ω; cost 25 attack

---

### [Case 1148 — [GIMMICK] Ryuga — Lightning L-Drago 100HF](./13%20case%20study.md#case-1148)

**System**: Gen2-MFB / HWS · GIMMICK · Upper Mode wedge contacts + HF orbital drive  
**Geometry**: m = 38.3 g · I = 2.758×10⁻⁵ kg·m² · LEFT-SPIN · ω₀ = 750 rad/s  
**Material**: Lightning Metal Wheel Upper Mode (wedge θ = 35°) + HF Left Flat rubber (μ = 0.42)  
**Spin Coupling**: absorb k_absorb = 0.12; Upper Mode wedge h_contact = 8 mm liftFraction = 0.574  
**Contact Points**: 3 wedge contacts at 120°; θ_upper = 35°; HF r_contact = 6.0 mm  
**Movement Freedom**: aggressive orbital (HF flat rubber tip)  
**Base Stats**: Attack 65 · Defense 25 · Stamina 45 · Speed 70  
**Mechanism**: Lightning wheel in Upper Mode: wedge contacts bypass below opponent Energy Layer (h_contact = 8 mm < h_opp ≈ 14 mm). liftFraction = sin(35°) = 0.574. Three-dragon BeyBeast manifested above CFF. HF tip dω/dt = 24.5 rad/s². Dragon Emperor Soaring Bite Strike (Case 1149) exploits upper-mode wedge geometry.  
**2.5D Rendering**: z_cm ≈ 1.0 (100 height) · Lightning wedge profile; three-dragon above CFF visual  
**Gimmick**: `lightningUpperMode(F_contact)` → liftImpulse = 0.574 × F_contact; k_absorb 0.12  
**Engine Note**: liftFraction 0.574 (sin35°); h_contact 8mm; HF dω/dt 24.5 rad/s²; leftSpin = true

---

### [Case 1149 — [SPECIAL] Dragon Emperor Soaring Bite Strike](./13%20case%20study.md#case-1149)

**System**: CS13 Special Move · Ryuga · Lightning L-Drago 100HF (first Dark Move, k_dark = 1.8)  
**Geometry**: Phase 1: Three-dragon ascent (205 eu lift × 3 dragons, spinDelta −45 each) · Phase 2: Slam 1170 eu · Phase 3: Ground crash 800 eu  
**Material**: k_dark = 1.8 [M]; total spinDelta −255  
**Spin Coupling**: special override  
**Contact Points**: wedge contacts in upper mode approach; slam uses full-body L-Drago impact  
**Movement Freedom**: invulnerable Phase 1+2 (~800 ms)  
**Base Stats**: powerCost 120 · selfCost −70 · cooldown 9500 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mechanical limits; anime physics override. First Dark Move (k_dark = 1.8). Phase 1: three-dragon BeySpirit ascent from below-layer approach (each: 205eu lift, spinDelta −45). Phase 2: aerial slam (1170eu, spinDelta −90, dmg 2.0×). Phase 3: ground shockwave (800eu, spinDelta −30). Total spinDelta: (−45×3)+(−90)+(−30) = −255. Dark power first use.  
**Special Move**: DESBS — Phase 1: 3×(205eu,−45); Phase 2: 1170eu,−90,dmg2.0×; Phase 3: 800eu,−30  
**Compatible beys**: any with Lightning L-Drago wheel + 100 track + HF/LF tip  
**Engine Note**: k_dark 1.8; firstDarkMove = true; totalSpinDelta −255; Phase2 slam dmg 2.0×

---

### [Case 1150 — [SPECIAL] Dragon Emperor Soaring Destruction](./13%20case%20study.md#case-1150)

**System**: CS13 Special Move · Ryuga · Lightning L-Drago 100HF (second Dark Move, k_dark = 2.5, ONE USE)  
**Geometry**: Phase 1: Dark Vortex Charge 400 ms (v = 8.0 m/s) · Phase 2: Aerial Smash 600 ms (h = 1.2 m) · Phase 3: Ground Slam 300 ms  
**Material**: k_dark = 2.5; AoE shockwave r ≈ 120 px; one use per match  
**Spin Coupling**: special override · oneUsePerMatch = true (dark power fully depleted)  
**Contact Points**: Phase 1 direct charge; Phase 2 detonation omnidirectional; Phase 3 slam + AoE  
**Movement Freedom**: no invulnerability window (charge is telegraphed)  
**Base Stats**: powerCost 130 · spinCost −80 · cooldown 12220 ms · ONE USE PER MATCH  
**Mechanism**: NOTE: special move overrides all EG/clutch mechanical state; full dark power exhaustion (k_dark = 2.5); L-Drago cannot use further Dark Moves in the same match after activation (anime physics override — dark power fully depleted). Phase 1: chargeImpulse 2500 eu, spinDelta −80, dmg 2.0×. Phase 2: aerial detonation 1800 eu (omnidirectional KO risk), spinDelta −70. Phase 3: ground slam 1222 eu, spinDelta −50; AoE adjacent 400 eu, adjacentSpinDelta −20. Total spinDelta: −80+(−70)+(−50) = −200.  
**Special Move**: DESD — P1: 2500eu,−80; P2: 1800eu,−70 omnidirKO; P3: 1222eu,−50 + AoE 400eu; spin −200  
**Compatible beys**: any with Lightning L-Drago wheel (final match use only)  
**Engine Note**: oneUsePerMatch = true; k_dark 2.5; totalSpin −200; adjacentAoE 400eu; highestPowerCost CS13

---

### [Case 1151 — [COMBO] Dark Upper (K ↑ J)](./13%20case%20study.md#case-1151)

**System**: CS13 Combo · Ryuga · Lightning L-Drago 100HF  
**Geometry**: Sequence: K + ↑ (moveUp) + J · windowMs 550 · cooldownMs 3200  
**Spin Coupling**: combo (requires `lightningLDragoWheel`)  
**Contact Points**: J: Upper Mode wedge approach after guard align; liftImpulse 180 eu  
**Movement Freedom**: K intercept + ↑ upper-mode realign  
**Base Stats**: cost 15 power · type: attack  
**Mechanism**: K guard-intercepts incoming, ↑ realigns to Upper Mode wedge angle (35°), J delivers upper-attack blade (spin −35, dmg 1.30×, lock 40ms, liftImpulse 180eu). Miniature single-contact version of Soaring Bite Strike Phase 1. Ceiling: 1.30×≤1.5×; 40ms≤300ms; liftImpulse 180eu vertical.  
**Engine Note**: J: spinDelta −35, dmgMult 1.30×, lockMs 40, liftImpulse 180eu; cost 15 attack

---

### [Case 1152 — [GIMMICK] Ryuga — Meteo L-Drago LW105LF](./13%20case%20study.md#case-1152)

**System**: Gen2-MFB / HWS · GIMMICK · Metal Masters era · Left-spin absorb evolution  
**Geometry**: m = 43.5 g · I = 3.271×10⁻⁵ kg·m² · LEFT-SPIN · ω₀ = −750 rad/s  
**Material**: Meteo Metal Wheel absorb wings (k_absorb = 0.18, wider than Lightning) + LF Left Flat rubber (μ = 0.52)  
**Spin Coupling**: absorb k = 0.18; LW105 CCW drag reduction η = 0.12  
**Contact Points**: 3 absorb wings at 120°; LF r_contact = 6.5 mm  
**Movement Freedom**: aggressive CCW orbital  
**Base Stats**: Attack 60 · Defense 30 · Stamina 55 · Speed 65  
**Mechanism**: Three wider Meteo absorb wings evolve Lightning's k from 0.15 to 0.18. LW105 track's CCW aerodynamic channelling: η_lw105 = 0.12 → dω/dt_eff = −24.3 rad/s² (from base −27.6). Entanglement threshold: |ω_opp| + |ω_Meteo| > 400 rad/s → entangled spinTransferRate = 0.35 per 200 ms window. Dragon Emperor Supreme Flight (Case 1153) uses Masters form.  
**2.5D Rendering**: z_cm = 1.05 (LW105) · Meteo wider absorb-wing profile; three-dragon CCW visual  
**Gimmick**: `meteoLDragoEntangle(omega_Meteo, omega_opp)` → entangled: relSpeed > 400; transfer 0.35  
**Engine Note**: absorb k=0.18; LW105 η=0.12; entangle threshold 400 rel-rad/s; dω/dt_eff −24.3

---

### [Case 1153 — [SPECIAL] Dragon Emperor Supreme Flight](./13%20case%20study.md#case-1153)

**System**: CS13 Special Move · Ryuga · Meteo L-Drago LW105LF (Masters) / L-Drago Destructor F:S (Fury)  
**Geometry**: Masters: Entangle 600 ms (3×200ms) + Phase 2 close/ranged; Fury: mode-dependent sweep/nova  
**Material**: Masters: spinTransfer +12ω/window; Fury: power scales with absorbed spin (cap 2.0× at 200 absorbed)  
**Spin Coupling**: special override  
**Contact Points**: Masters close (≤50px): Phase 2a; Masters ranged (>50px): Phase 2b; Fury: AoE or linear  
**Movement Freedom**: Masters: invulnerable during entangle 600 ms  
**Base Stats**: Masters: powerCost 100 · spinCost −50 · cooldown 8500 ms; Fury: powerCost 110 · spinCost −60 · cooldown 9000 ms  
**Mechanism**: NOTE: special move overrides all EG/clutch/mode state; anime physics override. Fury power scales with absorbed spin. Masters — Phase 2a (close ≤50px): spinDelta −65, dmg 1.60×, impulse 350eu, fireDoT +1.25×/2500ms. Phase 2b (ranged): 3×250ms blasts each spinDelta −25, impulse 280eu, dmg 1.30×. Fury HoleFlat: 3 sweep×300ms (spin −45, 600eu, 1.50×, fireDoT) + 1600eu burst. Fury Sharp: nova (spin −55, dmg 1.70×, fireDoT, 500eu) + rock crash (2200eu, spin −80).  
**Special Move**: DESF — dual assembly/era; Masters close dmg 1.60×; Fury absorb scaling base + min(a/200,1)×0.50  
**Compatible beys**: Masters: Meteo L-Drago LW105LF · Fury: L-Drago Destructor F:S  
**Engine Note**: dualForm; Masters totalSpin −145; FuryHoleFlat totalSpin −135; FurySharp totalSpin −135

---

### [Case 1154 — [COMBO] Meteo Spiral (↑ J ↓)](./13%20case%20study.md#case-1154)

**System**: CS13 Combo · Ryuga · Meteo L-Drago LW105LF  
**Geometry**: Sequence: ↑ (moveUp) + J + ↓ (moveDown) · windowMs 600 · cooldownMs 3100  
**Spin Coupling**: combo (requires `meteoLDragoWheel`)  
**Contact Points**: J: absorb-wing contact at approach apex; absorbGain +10 ω  
**Movement Freedom**: surge-then-retreat CCW orbital; LW105 drag bonus during ↑ surge  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: ↑ CCW surge (LW105 aerodynamic bonus), J delivers absorb-wing contact at apex (spin −32, dmg 1.22×, lock 35ms, absorbGain +10ω), ↓ retreat widens orbital spacing. Free cost — natural to Meteo CCW movement.  
**Engine Note**: J: spinDelta −32, dmgMult 1.22×, lockMs 35, absorbGain +10ω; cost 0 free

---

### [Case 1155 — [GIMMICK] Daigo Kurogami / Black Eye — Krusher / Shadow Doomscizor 2 Vortex Hunter](./13%20case%20study.md#case-1155)

**System**: Gen4-Burst-Turbo · GIMMICK · Sliding scythe sequential strike  
**Geometry**: m = 27.0 g · I = 1.305×10⁻⁵ kg·m² · ω₀ = 580 rad/s · d_slide = 8 mm spring k = 80 N/m  
**Material**: Outer black scythe (ABS) + inner scythe; spring PE = 2.56×10⁻³ J; t_reload = 100 ms  
**Spin Coupling**: rigid; Vortex Hunter multi-mode orbital  
**Contact Points**: outer scythe r = 34 mm; inner scythe r = 28 mm (exposed after retraction)  
**Movement Freedom**: Vortex Hunter (orbital stamina or aggressive Hunter mode)  
**Base Stats**: Attack 60 · Defense 20 · Stamina 60 · Speed 60  
**Mechanism**: Outer scythe retracts (d_slide = 8 mm) under impact → spring stores 2.56×10⁻³ J → inner scythe springs forward 100 ms later (k_second = 0.65 × first-hit impulse). One orbital approach; two sequential blade contacts. Double Strike (Case 1156) fires full spring-reload sequence. Spin decay (Vortex orbital): dω/dt = 7.32 rad/s².  
**2.5D Rendering**: z_cm ≈ 1.5 BX height · outer/inner scythe slide mechanism  
**Gimmick**: `doomscizorSlideScythe(J1_eu)` → J2 = 0.65×J1; total = 1.65×J1; reload 100ms  
**Engine Note**: k_spring 80 N/m; d_slide 8mm; k_second 0.65; t_reload 100ms; dω/dt 7.32 rad/s²

---

### [Case 1156 — [SPECIAL] Double Strike](./13%20case%20study.md#case-1156)

**System**: CS13 Special Move · Daigo Kurogami (Krusher) / Black Eye (Shadow) · Doomscizor 2 Vortex Hunter  
**Geometry**: First strike 20ms lock · Slide phase 100ms · Second strike 60ms lock; total engagement 180ms  
**Material**: BeySpirit spring amplification; inner scythe burstBonus +15% ratchet engagement  
**Spin Coupling**: special override  
**Contact Points**: outer scythe first (r = 34mm), inner scythe second (r = 28mm, deeper axle disruption)  
**Movement Freedom**: Vortex Hunter aggressive Hunter mode approach  
**Base Stats**: powerCost 80 · selfCost −25 · cooldown 6000 ms  
**Mechanism**: NOTE: special move overrides all burst regulation; BeySpirit amplifies slide spring reload beyond physical limits (anime physics override). First Strike: spinDelta −25, impulse 380eu, dmgMult 1.20×, lockMs 20. Slide phase: 100ms inner scythe springs. Second Strike: spinDelta −40, impulse 247eu (380×0.65), dmgMult 1.35×, lockMs 60, burstBonus +15%. Combined: totalSpinDelta −65; effectiveDmgMult 1.20×1.35 = 1.62×.  
**Special Move**: Double Strike — two-contact; S1: 380eu,−25,1.20×; slide 100ms; S2: 247eu,−40,1.35×,+15%burst  
**Compatible beys**: any with Doomscizor Layer + Vortex Hunter driver  
**Engine Note**: effectiveDmg 1.620×; totalSpin −65; burstBonus +15% S2; totalEngagement 180ms

---

### [Case 1157 — [COMBO] Scythe Edge (→ ↑ J)](./13%20case%20study.md#case-1157)

**System**: CS13 Combo · Daigo Kurogami / Black Eye · Doomscizor 2 Vortex Hunter  
**Geometry**: Sequence: → (moveRight) + ↑ (moveUp) + J · windowMs 600 · cooldownMs 2800  
**Spin Coupling**: combo (requires `doomscizorLayer`)  
**Contact Points**: J: outer scythe only at orbital apex; scytheSlide = false (no spring reload)  
**Movement Freedom**: Vortex Hunter stamina orbital tendency (rightward natural)  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: → follows natural Vortex Hunter orbital tendency, ↑ surges toward apex, J delivers single outer scythe contact (spin −22, dmg 1.16×, lock 25ms; scytheSlide false — spring NOT triggered). Single outer scythe only; Double Strike requires separate activation. Free cost — orbital tracking inherent.  
**Engine Note**: J: spinDelta −22, dmgMult 1.16×, lockMs 25, scytheSlide false; cost 0 free

---

## CS9 Overflow — Cases 1158–1175 {#cs9-overflow-1158}
Source: `9 case study.md` (Cases 1158–1175 — Cho-Z + Superking + Gatinko parts; Dead Hades, Left Aeclipse, Super Hyperion, Dread Bahamut assemblies)

---

### [Case 1158 — Energy Layer: Dead Hades · 22.2 g · Cho-Z](./9%20case%20study.md#case-1158)

**System**: Gen3-Burst / Cho-Z Layer · Energy Layer · Balance  
**Geometry**: r_contact ≈ 3.8 cm · 2 scythe blades · φ ≈ 40° · 7 metal weights (6 outer + 1 center) · 22.2 g  
**Material**: Zinc weights (6.5 g, 29.3% mass, 30.6% I) + ABS body  
**Spin Coupling**: rigid · Level Chip recommended (fine locks, imbalance Δr ≈ 1.0–1.5 mm)  
**Contact Points**: 2 scythe blades at r ≈ 38 mm · smash = sin(40°) = 0.643 · J_contact ≈ 0.451 N·s at ω₀  
**Movement Freedom**: fixed  
**Base Stats**: Attack 70 · Defense 40 · Stamina 40 · Speed 60  
**Mechanism**: I = 2.286×10⁻⁵ kg·m². Scythe blades deliver high per-contact impulse (0.451 N·s — among highest Cho-Z). Fine locks: T_lock ≈ 2.53×10⁻³ N·m (50% of standard) → burst-prone at high impact velocities. Imbalance Δr ≈ 1–1.5 mm → F_centrifugal = 26.9 N at ω₀ disrupts Zephyr' banking without Level Chip. Best disc: 0 or 10 (+13.7% inertia over stock 11Turn).  
**2.5D Rendering**: z_cm ≈ 1.5 BX-scale Cho-Z · 2-scythe asymmetric silhouette  
**Gimmick**: fineLockBurstRisk = true; levelChipRequired = true (banking pattern stability)  
**Engine Note**: I 2.286×10⁻⁵; J_contact 0.451 N·s; fineLock T 2.53×10⁻³ N·m; bestDisc 0 or 10

---

### [Case 1159 — Forge Disc 11 · est. 11.4 g · Cho-Z Era](./9%20case%20study.md#case-1159)

**System**: Gen3-Burst / Cho-Z · Core Disc (paired with Frames)  
**Geometry**: elliptical asymmetric · r_o = 35 mm · r_i = 8 mm · 11.4 g  
**Material**: Metal (die-cast) · lightest Cho-Z Core Disc  
**Spin Coupling**: rigid  
**Contact Points**: disc-level — no direct contact; inertial  
**Movement Freedom**: fixed  
**Base Stats**: Attack 20 · Defense 20 · Stamina 25 · Speed 0 (disc only)  
**Mechanism**: I = 7.347×10⁻⁶ kg·m² (19.8% of Dead Hades 11Turn assembly). 52% lighter than Disc 10 (23.8 g) but only 17% lower I (r_o ≈ 35 mm similar to Disc 10). Stock limitation: in Dead Hades 11Turn, Disc 11+Turn provides 25% less combined I than 0Wall. Official verdict: "severely hinders Attack, Defense, and Stamina potential." Niche: with Wall Frame I_total_disc+frame = 13.1×10⁻⁶.  
**2.5D Rendering**: z_cm ≈ 0.3 (disc layer) · elliptical  
**Gimmick**: none (inertial only); Frame compatibility: yes (Core Disc)  
**Engine Note**: I 7.347×10⁻⁶; 25% inertia deficit vs 0Wall; stockLimitation = severe

---

### [Case 1160 — Disc Frame: Turn · 3.6 g · Cho-Z Era](./9%20case%20study.md#case-1160)

**System**: Gen3-Burst / Cho-Z · Disc Frame · two-mode (Defense / Attack)  
**Geometry**: compact annular ring · r_o = 46 mm · r_i = 33 mm · 3.6 g  
**Material**: ABS  
**Spin Coupling**: rigid  
**Contact Points**: outer ring; disc-to-layer contact probability 15–25% (rare height match)  
**Movement Freedom**: rotatable mode ring (cosmetic in practice — gimmick rarely fires)  
**Base Stats**: Attack 20 · Defense 20 · Stamina 0 · Speed 0 (frame contribution only)  
**Mechanism**: I = 5.768×10⁻⁶ kg·m² (compact annular → high I per gram despite label). Gimmick: disc-to-layer contact at rare height alignment (15–25% probability). Practical value: pure inertia at r = 46 mm (maximum Frame radius). Best companion for Disc 11 (compensates partial deficit) or any disc where outer-radius inertia is desired without scrape risk.  
**2.5D Rendering**: z_cm ≈ 0.3 (frame) · annular ring  
**Gimmick**: gimmickFiringRate 15–25%; pureInertia = primary value  
**Engine Note**: I 5.768×10⁻⁶; gimmickProbability 0.15–0.25; noScrapeRisk = true

---

### [Case 1161 — Performance Tip: Zephyr' · est. 5.8 g · Cho-Z Era](./9%20case%20study.md#case-1161)

**System**: Gen3-Burst / Cho-Z · Performance Tip · hollow-flat (Hole Flat type)  
**Geometry**: annular flat · r_o = 5 mm · r_i = 2 mm · r_eff = 4 mm · μ = 0.15 · 5.8 g  
**Material**: ABS hollow plastic flat · thicker spring vs base Zephyr  
**Spin Coupling**: rigid tip  
**Contact Points**: flat annular at r_eff = 4 mm · floor  
**Movement Freedom**: Tornado Ridge banking (aggressive orbital at high ω; ω_crit ≈ 6.7 rad/s for Ridge stall)  
**Base Stats**: Attack 30 · Defense 15 · Stamina 50 · Speed 50  
**Mechanism**: dω/dt = 6.81 rad/s² in Dead Hades 11Turn assembly; t_stall = 101.9 s ideal. Banking disrupted without Level Chip: F_centrifugal 26.9 N >> Ridge contact force 2 N. Self-KO risk: ω_orbit_crit = 19.7 rad/s (usually governed by Ridge before breach). Thicker spring: +~30% burst resistance vs base Zephyr.  
**2.5D Rendering**: z_cm ≈ 0 · hollow flat contact  
**Gimmick**: tornadoRidgeBanking = true; levelChipMandatory (with imbalanced layers)  
**Engine Note**: dω/dt 6.81 rad/s²; t_stall 101.9 s; selfKO_omega_crit 19.7 rad/s; banking disrupts without LC

---

### [Case 1162 — Assembly: Dead Hades 11Turn Zephyr' (Cho-Z, Balance Attack/Stamina)](./9%20case%20study.md#case-1162)

**System**: Gen3-Burst / Cho-Z · Assembly · Balance Attack / Stamina  
**Geometry**: m = 43.5 g · I = 3.716×10⁻⁵ kg·m² · ω₀ = 694 rad/s  
**Material**: Dead Hades Layer (22.2 g) + Disc 11 (11.4 g) + Frame Turn (3.6 g) + Zephyr' (5.8 g) + Level Chip (0.5 g)  
**Spin Coupling**: rigid · Level Chip mandatory  
**Contact Points**: Dead Hades scythe r = 38 mm; J_contact (battle ω) = 0.271 N·s  
**Movement Freedom**: Zephyr' Tornado Ridge banking (banking requires Level Chip)  
**Base Stats**: Attack 65 · Defense 35 · Stamina 50 · Speed 55  
**Mechanism**: I_layer 61.6% of I_total (atypical — Disc 11 lightweight). L₀ = 2.579×10⁻² N·m·s. Per-contact self-loss Δω = 277 rad/s (significant — rapid spin depletion under contact). t_stall = 101.9 s ideal; ~40.8 s to battle ω (416 rad/s). Optimal upgrade: Disc 0 → +13.7% inertia, +13.7% t_stall. Stock Disc 11+Turn is 25% below optimal 0Wall.  
**2.5D Rendering**: z_cm = 1.45 (W145 equiv.) · Dead Hades scythe + Turn outer ring  
**Gimmick**: levelChipMandatory; stockDisc11 limitation severe  
**Engine Note**: I 3.716×10⁻⁵; L₀ 2.579×10⁻²; Δω_self 277 rad/s per hit; optimalUpgrade = 0Wall

---

### [Case 1163 — Energy Layer: Left Aeclipse · 19.8 g · Cho-Z, Left-Spin](./9%20case%20study.md#case-1163)

**System**: Gen3-Burst / Cho-Z · Energy Layer · Balance · LEFT-SPIN  
**Geometry**: r_contact ≈ 3.8 cm · Left Apollos half (spike, φ ≈ 70°) + Right Artemis half (3 blades, φ ≈ 35°) · 19.8 g  
**Material**: Metal blade lining (3.5 g, 17.7% mass, 21.9% I, distributed along edges) + ABS body  
**Spin Coupling**: rigid · No Level Chip compatible (gimmick blocks slot) · Δr_CoM ≈ 2.15 mm permanent  
**Contact Points**: n = 1 effective symmetry; avg recoil coefficient 0.581; counter-spin J ≈ 0.487 N·s (1.8× same-spin)  
**Movement Freedom**: fixed; imbalance causes precession at high ω  
**Base Stats**: Attack 40 · Defense 30 · Stamina 15 · Speed 55  
**Mechanism**: I = 2.075×10⁻⁵ kg·m². Counter-spin doubles relative velocity (v_rel = 31.6 m/s vs 15.8 m/s same-spin). Self-loss Δω per counter hit = 892 rad/s — catastrophic. No Level Chip → F_centrifugal 20.5 N permanent. Best use: Disc 0 + Bearing driver (left-spin burst attack at very high ω). Avoid stamina/defense roles.  
**2.5D Rendering**: z_cm ≈ 1.5 · asymmetric eclipse silhouette (half-spike/half-blade); leftSpin indicator  
**Gimmick**: noLevelChip = true; counterSpinMult 1.8×; avgRecoilCoeff 0.581  
**Engine Note**: I 2.075×10⁻⁵; CoM offset 2.15mm permanent; Δω_self 892 rad/s per counter-hit; bestUse leftSpinBurst

---

### [Case 1164 — Superking Chip: Hyperion 1 · est. 5.5 g · Superking](./9%20case%20study.md#case-1164)

**System**: Gen5-Burst / Superking · Chip · Right-Spin  
**Geometry**: r_o = 16 mm · r_i = 5 mm · no metal · 5.5 g  
**Material**: ABS (no metal inserts)  
**Spin Coupling**: chip seats burst spring  
**Contact Points**: none (covered by Ring in use)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 0 · Stamina 0 · Speed 0 (cosmetic)  
**Mechanism**: I = 7.73×10⁻⁷ kg·m² (2.1% of assembly). No metal → no burst resistance bonus. Functional placeholder. Outclassed by Hyperion 2, Solomon (metal inserts), Diabolos/Spriggan (dual-spin). Burst resistance comes from Ring + Chassis geometry, not chip.  
**2.5D Rendering**: z_cm ≈ 0 (center chip level) · simple disc  
**Gimmick**: none; burstSpring seat only  
**Engine Note**: I 7.73×10⁻⁷; 2.1% of assembly; cosmetic; upgrade to Hyperion 2 or Solomon

---

### [Case 1165 — Ring: Super · est. 21.5 g · Superking, Attack](./9%20case%20study.md#case-1165)

**System**: Gen5-Burst / Superking · Ring · Attack · Right-Spin  
**Geometry**: 6 contact blades (3 paired large+medium, 1 small each) · r_contact = 41 mm · blade angle 20° down (Upper Attack) · 21.5 g  
**Material**: ABS body (18.5 g) + 3 metal inserts at r = 34 mm (3.0 g, 15.7% I)  
**Spin Coupling**: thick underside raises Chip+Ring → optimal tooth exposure on 1A Chassis  
**Contact Points**: 6 blade faces; v_tip = 17.2 m/s at battle ω; J_vert = 0.0227 N·s (Upper Attack; Δv_vert = 0.445 m/s on opponent)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 80 · Defense 30 · Stamina 15 · Speed 70  
**Mechanism**: I = 2.202×10⁻⁵ kg·m² (59.5% of Super Hyperion assembly). Six-blade Upper Attack: blades angled 20° down → slide under opponent ring → upward impulse. Thick underside → correct tooth exposure → "great burst resistance" (official). Best with 1A Chassis (designed together). Durability: chips/dents after 20–50 competitive matches; maintain 2–3 spares.  
**2.5D Rendering**: z_cm ≈ 1.5 · 6-blade ring with upper-attack profile; metal insert marks  
**Gimmick**: upperAttack: J_vert 0.0227 N·s per hit; liftVelocity 0.445 m/s; durabilityWarning  
**Engine Note**: I 2.202×10⁻⁵; J_vert 0.0227 N·s; Δv_vert 0.445 m/s; burstResist "great"; durability limited

---

### [Case 1166 — Chassis: 1A · est. 18.5 g · Superking, Attack, Double Chassis](./9%20case%20study.md#case-1166)

**System**: Gen5-Burst / Superking · Chassis (Double, integrates Disc mass) · Attack · Right-Spin  
**Geometry**: symmetric 4-blade plan · r_o = 38 mm · r_i = 8 mm · 18.5 g  
**Material**: ABS (Double Chassis — integrates Disc mass, no separate Disc)  
**Spin Coupling**: hosts burst spring + teeth (T_burst ≈ 5.06×10⁻³ N·m standard depth)  
**Contact Points**: no direct blade contact (Ring covers); inertial + burst mechanism  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 0 · Stamina 0 · Speed 0 (chassis structure)  
**Mechanism**: I = 1.395×10⁻⁵ kg·m² (37.7% of assembly). Double Chassis eliminates disc-layer relative rotation (prior burst accumulation point). Standard tooth depth = 100% T_burst standard (vs Dead Hades fine locks 50%). Super Ring + 1A designed together for optimal tooth-exposure geometry → "great burst resistance."  
**2.5D Rendering**: z_cm ≈ 0.5 · 4-blade chassis base  
**Gimmick**: doubleChassisArchitecture = true; T_burst 5.06×10⁻³ N·m  
**Engine Note**: I 1.395×10⁻⁵; 37.7%; T_burst 5.06×10⁻³; bestPairing Super Ring

---

### [Case 1167 — Performance Tip: Xceed' · est. 5.5 g · Superking, Attack](./9%20case%20study.md#case-1167)

**System**: Gen5-Burst / Superking · Performance Tip · Attack (dual-mode rubber+plate)  
**Geometry**: rubber flat center (r_eff = 4 mm, μ_rubber = 0.70) + free-spinning plate (r = 12 mm, μ_plate = 0.04) · 5.5 g  
**Material**: rubber center + bearing-mounted ABS plate  
**Spin Coupling**: dual-mode: active (rubber) / passive (plate)  
**Contact Points**: active mode r_eff = 4 mm; passive mode plate r = 12 mm  
**Movement Freedom**: rubber flat → aggressive tornado/flower orbital; plate → gyroscopic stabiliser + anti-self-KO braking  
**Base Stats**: Attack 60 · Defense 10 · Stamina 20 · Speed 65  
**Mechanism**: Active: dω/dt = 37.9 rad/s², t_stall = 18.5 s. Passive (plate on bowl): dω/dt = 6.49 rad/s², t_stall = 107.9 s (theoretical). Plate L = 7.56×10⁻⁵ N·m·s at ω = 420 rad/s (gyro stabilise). Anti-KO: F_drag_plate = 1.15×10⁻³ N restoring. Thicker spring vs base Xceed → more assertive orbit.  
**2.5D Rendering**: z_cm ≈ 0 · rubber center + outer plate ring  
**Gimmick**: dualMode: rubber orbital + plate stabiliser; antiSelfKO braking  
**Engine Note**: dω/dt active 37.9 rad/s²; t_stall active 18.5 s; plate μ 0.04; thickerSpring

---

### [Case 1168 — Assembly: Super Hyperion Xceed 1A (Superking, Attack)](./9%20case%20study.md#case-1168)

**System**: Gen5-Burst / Superking · Assembly · Attack  
**Geometry**: m = 51.0 g · I = 3.700×10⁻⁵ kg·m² · ω₀ = 700 rad/s  
**Material**: Ring Super (21.5 g) + Chip Hyperion 1 (5.5 g) + Chassis 1A (18.5 g) + Tip Xceed' (5.5 g)  
**Spin Coupling**: Double Chassis architecture; great burst resistance  
**Contact Points**: Ring Super 6 blades r = 41 mm; J_vert 0.0227 N·s Upper Attack; v_tip = 17.2 m/s  
**Movement Freedom**: Xceed' aggressive tornado orbital  
**Base Stats**: Attack 90 · Defense 25 · Stamina 20 · Speed 75  
**Mechanism**: L₀ = 2.590×10⁻² N·m·s. dω/dt = 37.9 rad/s²; t_stall = 18.5 s (theoretical). Effective attack window: 4–8 s after battle ω (2–5 direct contacts). Per-hit self-loss Δω = 73.5 rad/s. Upper attack Δv_vert = 0.445 m/s per hit. Burst resistance "great" (Super Ring + 1A tooth alignment). Heaviest Superking attack combo: 51.0 g (Double Chassis integrates disc mass).  
**2.5D Rendering**: z_cm = 1.5 · Super Ring + Chassis profile  
**Gimmick**: upperAttack; doubleChassisNoBurstAccum = true  
**Engine Note**: I 3.700×10⁻⁵; dω/dt 37.9; attackWindow 4–8 s; Δω_self 73.5/hit; burstRes "great"

---

### [Case 1169 — Gatinko Chip: Bahamut · 3.1 g · Burst GT, Left-Spin](./9%20case%20study.md#case-1169)

**System**: Gen4-Burst / Gatinko (GT) · Chip · Left-Spin  
**Geometry**: r_o = 15 mm · r_i = 5 mm · 7 fine locks · no metal · 3.1 g  
**Material**: ABS (TT JP) · Hasbro Balkesh = weaker plastic (inferior)  
**Spin Coupling**: seats burst spring (7 fine locks)  
**Contact Points**: none (covered by Layer Base)  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 15 · Stamina 0 · Speed 0  
**Mechanism**: I = 3.88×10⁻⁷ kg·m² (1.0% of assembly). 7 fine locks: T_burst per tooth ≈ 9.0×10⁻⁴ N·m (50% of standard 0.8mm depth → each slips at lower torque). Gen Layer Weight (Case 1170) only viable mitigation. Hasbro Balkesh: weaker plastic — inferior. Belial chip (TT JP) → Hasbro Belfyre (different mold).  
**2.5D Rendering**: z_cm ≈ 0 · chip level · dragon head motif  
**Gimmick**: fineLock × 7; mitigation: Gen Layer Weight + Dash Driver  
**Engine Note**: I 3.88×10⁻⁷; fineLocks 7; hasbro_Balkesh = weaker plastic; recommend Gen weight

---

### [Case 1170 — Layer Weight: Gen · 1.1 g · Burst GT, Burst Stopper](./9%20case%20study.md#case-1170)

**System**: Gen4-Burst / Gatinko · Layer Weight · Burst Stopper  
**Geometry**: small rubber piece · r_cm ≈ 9 mm · triangular protrusion · 1.1 g  
**Material**: Rubber (T_stop ≈ 3.33×10⁻⁴ N·m at 1 tooth — elastic catch)  
**Spin Coupling**: rubber catches tooth at 1 angular position (last-resort burst save)  
**Contact Points**: triangular protrusion vs burst tooth at 1 position  
**Movement Freedom**: fixed once installed  
**Base Stats**: Attack 0 · Defense 10 · Stamina 0 · Speed 0  
**Mechanism**: I = 8.91×10⁻⁸ kg·m² (0.24%). Rubber catch prevents final burst completion at one tooth position. Other 6 fine-lock teeth still accumulate at normal rate. Net: "last-resort save" — prevents burst even when all 6 other teeth are fully advanced. Mass penalty: replaces 3–5 g standard weight → reduces all performance categories. Only justified in Dread combinations.  
**2.5D Rendering**: z_cm ≈ 0.5 (layer weight slot)  
**Gimmick**: burstStopper = true at 1 tooth position; dreadOnlyJustified  
**Engine Note**: T_stop 3.33×10⁻⁴ N·m; 1-of-7 teeth; massPenalty replaces 3–5 g standard weight

---

### [Case 1171 — Layer Base: Dread · 14.5 g · Burst GT, Left-Spin, Defense](./9%20case%20study.md#case-1171)

**System**: Gen4-Burst / Gatinko · Layer Base · Defense · Left-Spin  
**Geometry**: 4 CW blades + 6 gaps (pre-activation) → circular profile (post-activation) · 14.5 g  
**Material**: ABS main base (10.0 g) + movable sub-layer segments (4.5 g at r ≈ 36 mm)  
**Spin Coupling**: rigid; movable sub-layer fills gaps one-time on impact  
**Contact Points**: pre-activation: gap catches amplify burst torque +30–50%; post-activation: circular deflection → T_burst_circular ≈ 10–20% of T_burst_gap  
**Movement Freedom**: sub-layer shifts outward on significant hit (one-time, irreversible)  
**Base Stats**: Attack 15 · Defense 65 · Stamina 50 · Speed 15  
**Mechanism**: I = 1.188×10⁻⁵ kg·m² (31.6% of assembly). Binary gimmick: pre-activation high burst risk (gap catches); post-activation circular deflection (5–10× burst improvement per tooth). Left-spin counter vs RS doubles v_rel but circular profile deflects radially (66% impulse reduction). Sub-layer non-spring-loaded: once circular, stays circular for match. Activation window 1–3 hard hits = critical survival phase.  
**2.5D Rendering**: z_cm ≈ 1.5 · 4-blade gap profile → circular post-activation  
**Gimmick**: movableSubLayer: gaps → circular on hit; oneTime irreversible; circularDeflectMult 5–10×  
**Engine Note**: I 1.188×10⁻⁵; activation 1–3 hits; post-activation T_burst 10–20% of pre; leftSpin = true

---

### [Case 1172 — Forge Disc 7 · 23.2 g · Burst GT Era, Stamina/All-Purpose](./9%20case%20study.md#case-1172)

**System**: Gen4-Burst / Gatinko · Forge Disc · Metal · All-Purpose  
**Geometry**: 7-section asymmetric-but-balanced (halved sections) · r_o = 39 mm · r_i = 10 mm · 23.2 g  
**Material**: Metal die-cast zinc alloy · Frame compatible (Core Disc / odd number)  
**Spin Coupling**: rigid  
**Contact Points**: disc-level inertial only  
**Movement Freedom**: fixed  
**Base Stats**: Attack 40 · Defense 40 · Stamina 55 · Speed 0 (disc contribution)  
**Mechanism**: I = 1.880×10⁻⁵ kg·m² (OWD rank 3rd after Disc 0 and 10). With Frame Wall: I_7Wall = 2.420×10⁻⁵ (surpasses Disc 0 alone). No burst risk (unlike Disc 8). "One of the heaviest discs" — benefits all three performance categories. Official: "7 can be used to great effect in any Combination" with Frames.  
**2.5D Rendering**: z_cm ≈ 0.3 (disc layer) · 7-section disc  
**Gimmick**: highOWD; frameCompatible = true; bestFrame Wall  
**Engine Note**: I 1.880×10⁻⁵; OWD 53.3%; with Wall I 2.420×10⁻⁵; noBurstRisk = true

---

### [Case 1173 — Disc Frame: Wall · 4.1 g · Burst GT Era, Defense/CoM](./9%20case%20study.md#case-1173)

**System**: Gen4-Burst / Gatinko · Disc Frame · Defense · CoM-lowering  
**Geometry**: round thick frame · 8 large downward protrusions · r_o = 43 mm · r_i = 28 mm · 4.1 g  
**Material**: ABS  
**Spin Coupling**: rigid  
**Contact Points**: protrusions contact stadium floor in banking (scrape) · clearance at 5° tilt = −5.1 mm  
**Movement Freedom**: fixed; protrusion scrape during banking orbital movement  
**Base Stats**: Attack 0 · Defense 20 · Stamina 0 · Speed 0 (frame only)  
**Mechanism**: I = 5.40×10⁻⁶ kg·m² (14.4% of assembly). CoM shift −2.5 mm → precession rate −14% → upright spin window +16%. Scrape-free only in near-vertical spinning (Bearing/Orbit-based combinations). With Disc 7: I_7Wall = 2.420×10⁻⁵ (highest Burst GT disc+frame configuration). Official: "difficult to achieve banking patterns" — use only in upright stamina combos.  
**2.5D Rendering**: z_cm = −0.3 (protrusions extend below disc plane) · 8-protrusion silhouette  
**Gimmick**: comLowering −2.5mm; precessionReduction −14%; scrapeRisk HIGH in banking  
**Engine Note**: I 5.40×10⁻⁶; CoM −2.5mm; scrapeAtTilt5deg; bestUse Bearing/Orbit upright

---

### [Case 1174 — Performance Tip: Orbit Metal · 7.8 g · Burst GT, Defense](./9%20case%20study.md#case-1174)

**System**: Gen4-Burst / Gatinko · Performance Tip · Defense · metal ball  
**Geometry**: metal ball r = 3 mm · μ_eff = 0.05 (metal-on-PC) · r_eff = 3 mm · 7.8 g  
**Material**: metal ball (steel/zinc) in ABS socket  
**Spin Coupling**: ball-socket free rotation  
**Contact Points**: near-point metal ball contact · floor  
**Movement Freedom**: precession orbit (no tornado drive) · KO resistance LOW (μ = 0.05 → F_resist = 0.026 N vs rubber 0.350 N)  
**Base Stats**: Attack 0 · Defense 15 · Stamina 85 · Speed 10  
**Mechanism**: dω/dt = 2.10 rad/s²; t_stall = 333 s (theoretical ~5.4 min; near-Bearing performance). Paradox (official): labeled Defense but metal reduces KO resistance (13× less floor grip than rubber flat Xceed'). Precession at battle ω: Ω_p = 0.518 rad/s → T_precession = 12.1 s per orbit (slow stable orbit with Wall Frame). Best use: Bearing-class spin equalization with Wall Frame upright orbit.  
**2.5D Rendering**: z_cm ≈ 0 · metal ball near-point  
**Gimmick**: metalBallKoResistanceLow = true (official); ultraLowFriction; precessionOrbit  
**Engine Note**: dω/dt 2.10 rad/s²; t_stall 333 s; F_resist 0.026 N; precess T 12.1 s with Wall

---

### [Case 1175 — Assembly: Dread Bahamut 7Wall Orbit Metal (Burst GT, Defense/Spin-Eq, Left-Spin)](./9%20case%20study.md#case-1175)

**System**: Gen4-Burst / Gatinko · Assembly · Defense / Spin Equalization · LEFT-SPIN  
**Geometry**: m = 53.8 g · I = 3.682×10⁻⁵ kg·m² · ω₀ = 700 rad/s  
**Material**: Chip Bahamut (3.1 g) + Gen weight (1.1 g) + Base Dread (14.5 g) + Disc 7 (23.2 g) + Frame Wall (4.1 g) + Tip Orbit Metal (7.8 g)  
**Spin Coupling**: Left-spin; Disc 7 (50.0% of I) dominant contributor  
**Contact Points**: Dread base (pre/post-activation circular); counter-spin vs RS: v_rel = 31.9 m/s; post-circular deflection reduces J 66%  
**Movement Freedom**: precession orbit T = 11.9 s (Wall CoM lowering); no banking (Wall protrusion scrape)  
**Base Stats**: Attack 10 · Defense 70 · Stamina 90 · Speed 10  
**Mechanism**: L₀ = 2.577×10⁻² N·m·s. dω/dt = 2.15 rad/s²; t_stall = 325.6 s (~5.4 min) — 17.6× slower spin-down than Super Hyperion. Activation window (1–3 hits) = critical burst risk; Gen provides 1 last-resort save; post-activation circular deflection reduces burst torque 5–10×. Left-spin counter-rotation drains RS opponents. Low KO resistance (official metal ball paradox). Best use: outlast all stamina/burst-attack combos.  
**2.5D Rendering**: z_cm = 0 (ball tip) + −0.3 (Wall protrusion) · Dread 4-blade → circular profile  
**Gimmick**: ultraLongSpin 325.6 s; gimmickActivation 1–3 hits; leftSpinDrain; genBurstSave  
**Engine Note**: I 3.682×10⁻⁵; dω/dt 2.15; t_stall 325.6 s; precess T 11.9 s; activation window critical

---

## CS13 Overflow — Cases 1176–1193 {#cs13-overflow-1176}
Source: `13 case study.md` (Cases 1176–1193 — Lui Shirosagi Brutal Lúinor, Tyson/Daichi GT, Julia/Raul Pegasus, Free/Shu Fafnir, Ray Driger, Rick Rock Bison triplets)

> **SKIP: Cases 1194–1215 (confirmed gap — no source data)**

---

### [Case 1176 — [GIMMICK] Lui Shirosagi — Brutal Lúinor 13 Jolt](./13%20case%20study.md#case-1176)

**System**: Gen4-Burst-Turbo (Cho-Z) · GIMMICK · four dragon-head uppercut geometry  
**Geometry**: m = 49.0 g · I = 4.002×10⁻⁵ kg·m² · ω₀ = 580 rad/s · 4 dragon heads at 90° spacing  
**Material**: Brutal Lúinor blade (36.0 g Cho-Z reinforced) + 13 Disc (6.5 g) + Jolt driver (free-disc rubber ball, μ_eff = 0.30)  
**Spin Coupling**: rigid; Jolt free-disc decouples upper disc from layer spin (−33% energy bleed)  
**Contact Points**: 4 dragon-head contacts at 90°; θ_exit = 22°; h_head = 3.5 mm < h_opp_layer = 5.5 mm (bypasses outer ridge); f_head = 369.4 Hz CFF  
**Movement Freedom**: Jolt rubber ball grip; variable tilt at orbital approach  
**Base Stats**: Attack 80 · Defense 25 · Stamina 30 · Speed 70  
**Mechanism**: I_blade = 3.580×10⁻⁵ (89.5% of I). Four heads at 90° spacing: all four contact within 10.84 ms window at head-on charge. Each head slips under h_opp_layer at θ_entry = −15° → exits at θ_exit = +22° → F_z = sin(22°) × F_contact = 0.374 × F_contact. Dragon Scream (Case 1177) fires all 4 sequential uppercuts + final burst. dω/dt = 10.8 rad/s².  
**2.5D Rendering**: z_cm ≈ 1.5 BX Cho-Z · 4-head dragon silhouette; undercut approach vector  
**Gimmick**: `brutalLuinorUppercut(omega, F)` → F_z = 0.374×F; window 10.84ms at 580 rad/s; 4-head bypass  
**Engine Note**: I 4.002×10⁻⁵; 4 heads; θ_exit 22°; h_head 3.5mm < h_opp 5.5mm; dω/dt 10.8 rad/s²

---

### [Case 1177 — [SPECIAL] Dragon Scream](./13%20case%20study.md#case-1177)

**System**: CS13 Special Move · Lui Shirosagi · Brutal Lúinor 13 Jolt  
**Geometry**: 4 heads × 2.71 ms each = 10.84 ms total contact window · v_charge = 3.0 m/s · finalBurst 1300 eu  
**Material**: BeySpirit k_bs = 1.5; 4 sequential uppercuts bypass outer contact ridge  
**Spin Coupling**: special override  
**Contact Points**: 4 sequential head-on contacts; each below h_opp_layer → upward deflection  
**Movement Freedom**: linear head-on charge (not orbital tangent)  
**Base Stats**: powerCost 90 · selfCost −45 · cooldown 7500 ms  
**Mechanism**: NOTE: special move overrides all burst regulation; BeySpirit (k_bs = 1.5) amplifies 4 uppercut strikes (anime physics override). Per head: spinDelta −28, liftImpulse 160 eu, lateralImpulse 280 eu, dmgMult 1.25×. Post-charge burst (200 ms after all 4): finalImpulse 1300 eu, spinDelta −45, burstBonus +18% cumulative. Total at 4 heads: spinDelta −157 (−28×4 + −45); liftTotal 640 eu. Partial (<3 heads): no final burst; scale linearly.  
**Special Move**: Dragon Scream — 4 sequential heads; per head: 160eu lift, 280eu lat, −28, 1.25×; burst: 1300eu, −45  
**Compatible beys**: any with Brutal Lúinor (Bloody Longinus) blade + Jolt driver  
**Engine Note**: 4 heads at 10.84ms; totalSpin −157; finalBurst 1300eu; burstBonus +18%; partial < 3 no burst

---

### [Case 1178 — [COMBO] Brutal Upper (↓ K J)](./13%20case%20study.md#case-1178)

**System**: CS13 Combo · Lui Shirosagi · Brutal Lúinor 13 Jolt  
**Geometry**: Sequence: ↓ (moveDown) + K + J · windowMs 550 · cooldownMs 3500  
**Spin Coupling**: combo (requires `brutalLuinorBlade`)  
**Contact Points**: J: undercut single dragon head; liftImpulse 195 eu (θ_exit 22° bypassed outer ridge)  
**Movement Freedom**: ↓ lowers contact plane via Jolt rubber ball grip  
**Base Stats**: cost 15 power · type: attack  
**Mechanism**: ↓ pulls Jolt contact plane lower (rubber grip tightens at low orbital radius), K braces at outer blade to align head below h_opp_layer, J delivers single dragon-head uppercut (spin −38, dmg 1.32×, lock 55ms, liftImpulse 195eu). Single-head precision bypass. Ceiling: 1.32×≤1.5×; 55ms≤300ms.  
**Engine Note**: J: spinDelta −38, dmgMult 1.32×, lockMs 55, liftImpulse 195eu; cost 15 attack

---

### [Case 1179 — [GIMMICK] Tyson Granger — Dragoon GT + Daichi Sumeragi — Strata Dragoon G](./13%20case%20study.md#case-1179)

**System**: Gen1-Plastic / EG · GIMMICK · Tag-Team foundation (Dragoon Tank)  
**Geometry**: Dragoon GT: m = 48.5 g · I = 2.248×10⁻⁵ · ω₀ = 750 rad/s; Strata Dragoon G: m = 51.5 g · I = 1.968×10⁻⁵  
**Material**: Dragoon GT: G Upper AR (21.0 g) + Ten Wide WD (14.0 g) + Left EG Turbo (6.5 g) + CEW Metal Grip (2.0 g) + FCB (5.0 g); all confirmed from part list  
**Spin Coupling**: Left EG Turbo fires CCW (inward centripetal for CW orbit) on FCB trigger (tip-to-tip contact)  
**Contact Points**: G Upper AR: θ_upper = 30°; F_z fraction = sin(30°) = 0.500; Metal Grip μ = 0.30  
**Movement Freedom**: Metal Grip dω/dt = 28.6 rad/s² (Dragoon GT)  
**Base Stats**: Attack 55 · Defense 30 · Stamina 30 · Speed 60 (Dragoon GT)  
**Mechanism**: Left EG fires opposite main spin → CCW = inward centripetal for CW orbit. J_lateral = 0.064 N·s couples both beys into shared circular orbit ("energy ring"). Tip-to-tip FCB trigger. m_coupled = 100.0 g; KE_charge = 10.046 J → v_charge = 14.17 m/s for Dragoon Tank (Case 1180). G Upper θ_upper = 30° provides upward lift component to charge contact.  
**2.5D Rendering**: z_cm ≈ 1.5 · G Upper AR with wedge profile; Energy Ring dual-bey visual  
**Gimmick**: `dragoonTankCouple(omega_GT, omega_Strata, fcbFired)` → v_charge 14.17 m/s at full spin  
**Engine Note**: J_lateral 0.064 N·s inward; m_coupled 100.0 g; v_charge 14.17 m/s; FCB trigger = tip-to-tip

---

### [Case 1180 — [SPECIAL] Dragoon Tank](./13%20case%20study.md#case-1180)

**System**: CS13 Special Move · Tyson Granger + Daichi Sumeragi · Dragoon GT + Strata Dragoon G · TAG-TEAM  
**Geometry**: Phase 1: Tip-Touch Coupling 600 ms · Phase 2: Orbital Ring Run 800 ms · Phase 3: Tank Charge 600 ms (v = 14.17 m/s)  
**Material**: m_coupled = 100.0 g; G Upper θ_upper = 30° → liftComponent 875 eu; AoE r_splash = 90 px  
**Spin Coupling**: special override · tag-team: both activate within 500 ms  
**Contact Points**: Phase 2: orbit-path contacts; Phase 3: head-on charge with upper-attack lift  
**Movement Freedom**: both invulnerable during Phase 1 coupling  
**Base Stats**: powerCost 100 each · spinCost −60 each · cooldown 9000 ms shared · sync window 500 ms  
**Mechanism**: NOTE: special moves override all EG/clutch state; Left EG re-engages via BeySpirit (anime override). Phase 1: FCB fires; Left EG couples beys into orbit. Phase 2 (per orbit-path contact): spin −22, 270eu, dmg 1.22×. Phase 3: chargeImpulse 1750eu, liftComponent 875eu, spinDelta −85, dmg 2.1×, AoE adjacent 480eu/−25. Desync (η<0.4): individual v ≈ 5.5 m/s charges only.  
**Special Move**: Dragoon Tank — TAG-TEAM; Phase 3: 1750eu + 875eu lift, −85, 2.1×; AoE 480eu  
**Compatible beys**: BOTH players: Dragoon GT + Strata Dragoon G (confirmed part lists)  
**Engine Note**: tagTeam = true; v_charge 14.17 m/s; m_coupled 100 g; sharedCooldown 9000 ms; deync solo 5.5 m/s

---

### [Case 1181 — [COMBO] Tank Dash (→ ↓ J)](./13%20case%20study.md#case-1181)

**System**: CS13 Combo · Tyson Granger · Dragoon GT  
**Geometry**: Sequence: → (moveRight) + ↓ (moveDown) + J · windowMs 600 · cooldownMs 2900  
**Spin Coupling**: combo (requires `dragoonGTGUpperAR`)  
**Contact Points**: J: G Upper wedge at lowered approach; driveImpulse 55 eu  
**Movement Freedom**: Metal Grip CEW rightward orbital drift  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: → follows Metal Grip natural orbital drift, ↓ lowers contact plane (rubber grip friction increases), J delivers G Upper wedge at lowered angle (spin −25, dmg 1.18×, lock 30ms, driveImpulse 55eu). Ground-level single-direction Dragoon Tank frontal drive. Free cost.  
**Engine Note**: J: spinDelta −25, dmgMult 1.18×, lockMs 30, driveImpulse 55eu; cost 0 free

---

### [Case 1182 — [GIMMICK] Julia + Raul Fernandez — Thunder Pegasus + Torch Pegasus](./13%20case%20study.md#case-1182)

**System**: Gen1-Plastic · GIMMICK · Tag-Team (Gemini Attack foundation) · F-Dynasty  
**Geometry**: Thunder Pegasus: m = 43.0 g · I = 1.787×10⁻⁵; Torch Pegasus: m = 43.5 g · I = 1.821×10⁻⁵ · ω₀ = 750 rad/s each  
**Material**: Thunder/Torch Pegasus 3-wing AR (19.0/19.5 g) + Wide Defense WD (16.0 g) + Flat Base (μ = 0.40); all estimated [M]  
**Spin Coupling**: Arc discharge: +55 ω per bey (k_gemini = 2.2 [M]) → ω₀_charged = 805 rad/s  
**Contact Points**: wing blade tips (f_blade = 357.9 Hz CFF); arc contact at blade tips during charge phase  
**Movement Freedom**: Flat Base aggressive orbital; dω/dt = 28.3 rad/s² (Thunder)  
**Base Stats**: Attack 55 · Defense 25 · Stamina 35 · Speed 65  
**Mechanism**: Triboelectric atmospheric charge at high RPM; arc discharge at blade-tip contact → +55 ω boost per bey. KE_charged_total = 11.689 J; aerial PE = 1.697 J → KE_impact = 13.386 J → v_dive = 17.60 m/s. Beat World Champions Tyson + Daichi in G-Revolution tournament.  
**2.5D Rendering**: z_cm ≈ 1.5 · 3-wing Pegasus AR; atmospheric arc visual  
**Gimmick**: `geminiAttackCharge(omega_Julia, omega_Raul)` → KE 13.386 J, v_dive 17.60 m/s at full spin  
**Engine Note**: k_gemini 2.2; arcBoost +55ω; v_dive 17.60 m/s; KE_impact 13.386 J

---

### [Case 1183 — [SPECIAL] Gemini Attack](./13%20case%20study.md#case-1183)

**System**: CS13 Special Move · Julia + Raul Fernandez · Thunder + Torch Pegasus · TAG-TEAM  
**Geometry**: Phase 1: Atmospheric Charge 800 ms · Phase 2: Blade-Tip Arc 200 ms · Phase 3: Meteor Dive 600 ms (v = 17.60 m/s)  
**Material**: k_gemini = 2.2; AoE r = 100 px; total primary spinDelta −140  
**Spin Coupling**: special override · tag-team: 500 ms sync window  
**Contact Points**: Phase 2 arc discharge AoE ≤ 100 px; Phase 3 primary + AoE  
**Movement Freedom**: both invulnerable Phase 1+2 (~1000 ms)  
**Base Stats**: powerCost 105 each · spinCost −50 each · cooldown 9500 ms shared  
**Mechanism**: NOTE: twin BeySpirit arc discharge (k_gemini = 2.2) amplifies atmospheric static beyond triboelectric limits (anime override). Phase 1 (90° offset): +55ω, nearby arcDisrupt spin −20, 150eu. Phase 2: arc flash spinDelta −25, 200eu to r≤100px. Phase 3: primary 2000eu, −95, dmg 2.2×, ringOut 2200eu; AoE adj −40, 650eu. Partial sync (η<0.5): ground charge v 7.5 m/s, dmg 1.3× only.  
**Special Move**: Gemini Attack — TAG-TEAM; meteor dive dmg 2.2×; P3 primary 2000eu, −95; AoE 650eu  
**Compatible beys**: BOTH: Thunder + Torch Pegasus  
**Engine Note**: tagTeam = true; v_dive 17.60 m/s; dmg 2.2×; totalSpinP −140; sharedCooldown 9500 ms

---

### [Case 1184 — [COMBO] Pegasus Dive (↑ ↓ J)](./13%20case%20study.md#case-1184)

**System**: CS13 Combo · Julia / Raul Fernandez · Thunder / Torch Pegasus  
**Geometry**: Sequence: ↑ (moveUp) + ↓ (moveDown) + J · windowMs 600 · cooldownMs 2900  
**Spin Coupling**: combo (requires `thunderOrTorchPegasusAR`)  
**Contact Points**: J: wing-blade at dive apex; diveImpulse 50 eu  
**Movement Freedom**: ↑↓ axis swing natural to Pegasus 3-wing geometry  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: ↑ surge (wide wing surface momentum), ↓ pivots contact arc down at apex, J delivers wing blade at dive-arc bottom (spin −28, dmg 1.20×, lock 30ms, diveImpulse 50eu). Mini Gemini Attack meteor approach. Free cost.  
**Engine Note**: J: spinDelta −28, dmgMult 1.20×, lockMs 30, diveImpulse 50eu; cost 0 free

---

### [Case 1185 — [GIMMICK] Free De La Hoya — Drain Fafnir 8 Nothing](./13%20case%20study.md#case-1185)

**System**: Gen4-Burst-Standard · GIMMICK · Left-spin rubber angular momentum absorption  
**Geometry**: m = 30.5 g · I = 2.038×10⁻⁵ kg·m² · LEFT-SPIN ω₀ = −640 rad/s · μ_rubber = 0.65; Δt_contact = 12 ms  
**Material**: Fafnir rubber outer ring at r = 38 mm (k_absorb = 0.08 per hit normal; ×1.8 special) + Nothing driver (μ = 0.02)  
**Spin Coupling**: LEFT-SPIN rubber drain: drain_k = max(0, 1 − |ω_Faf| / ω_opp); active while |ω_Faf| < ω_opp  
**Contact Points**: rubber outer ring r = 38 mm; 12 ms extended contact vs 3 ms rigid  
**Movement Freedom**: near-zero orbital decay (Nothing dω/dt = −0.147 rad/s²)  
**Base Stats**: Attack 10 · Defense 30 · Stamina 95 · Speed 20  
**Mechanism**: LEFT-SPIN rubber converts RS impact → Fafnir spin gain (diminishing returns as gap closes). At entry ω_opp = 500, |ω_Faf| = 300: Δω_Faf = +18.8 per hit (k=0.08); Drain Spin special (k×1.8): +33.8 per hit. Spriggan Requiem manga: k = 0.10, I = 2.138×10⁻⁵. Nothing driver: all gained spin preserved between hits (0.147 rad/s² decay negligible).  
**2.5D Rendering**: z_cm ≈ 1.5 · Fafnir 3-blade rubber ring; leftSpin CCW indicator  
**Gimmick**: `fafnirDrainHit(omega_opp, omega_Faf, I_opp, special)` → diminishing-return drain; drain active while |ωF| < ω_opp  
**Engine Note**: leftSpin; k_rubber 0.08 normal / 0.144 special; dω/dt Nothing −0.147; drain closes gap w/ dim returns

---

### [Case 1186 — [SPECIAL] Drain Spin](./13%20case%20study.md#case-1186)

**System**: CS13 Special Move · Free De La Hoya · Drain Fafnir 8 Nothing  
**Geometry**: 5-hit active window · 5000 ms · per-hit diminishing-return drain  
**Material**: k_drain = 1.8 (special amplifier); 5-hit cumulative Δω_Faf +120.8 rad/s; opponent −89 total  
**Spin Coupling**: special override  
**Contact Points**: rubber outer ring r = 38 mm; each hit progresses drain diminishing-returns  
**Movement Freedom**: holds orbit; Nothing driver preserves all drain spin  
**Base Stats**: powerCost 70 · spinCost 0 (net positive in practice) · cooldown 6000 ms · duration 5 hits / 5000 ms  
**Mechanism**: NOTE: k_drain = 1.8 amplifies rubber drain (anime override for the amplifier factor; diminishing-return physics are correct and require no override). Per-hit: Hit 1 drain_k=0.40 → +33.8ω; Hit 2 drain_k=0.332 → +28.1ω; Hit 3 +23.4; Hit 4 +19.4; Hit 5 +16.1. Cumulative: Fafnir +120.8ω total; opp total −89. Passive drain (k=1.0) continues post-special as long as |ωFaf| < ω_opp. Spriggan Requiem manga: same formula k_SR=0.10.  
**Special Move**: Drain Spin — 5-hit active; cumul: Fafnir +120.8ω, opp −89; post: passive drain continues  
**Compatible beys**: any with Drain Fafnir rubber layer (left-spin required); Spriggan Requiem manga variant  
**Engine Note**: k_drain 1.8; 5 hits; dimReturns = correct physics; postSpecial passive k=1.0 continues

---

### [Case 1187 — [COMBO] Fafnir Surge (↓ ↑ J)](./13%20case%20study.md#case-1187)

**System**: CS13 Combo · Free De La Hoya · Drain Fafnir 8 Nothing  
**Geometry**: Sequence: ↓ (moveDown) + ↑ (moveUp) + J · windowMs 600 · cooldownMs 2500  
**Spin Coupling**: combo (requires `fafnirRubberLayer`)  
**Contact Points**: J: rubber outer ring contact at surge apex; absorbGain +12 ω (mini-drain)  
**Movement Freedom**: Nothing driver near-frictionless orbital shift; ↓↑ skims floor then lifts  
**Base Stats**: cost 0 power (free) · type: universal  
**Mechanism**: Nothing driver allows approach from extremely low plane (↓ skims floor aligning rubber contact arc with base level), ↑ surge lifts to rubber-contact height, J delivers rubber contact (spin −25, dmg 1.16×, lock 20ms, absorbGain +12ω — mini-drain, no special active). Free cost.  
**Engine Note**: J: spinDelta −25, dmgMult 1.16×, lockMs 20, absorbGain +12ω; cost 0 free

---

### [Case 1188 — [GIMMICK] Ray Kon — Driger S](./13%20case%20study.md#case-1188)

**System**: Gen1-Plastic · GIMMICK · Tiger Defenser + Metal Change Base evasion  
**Geometry**: m = 48.5 g · I = 1.940×10⁻⁵ kg·m² · ω₀ = 750 rad/s · 4 tiger-claw contacts at 90°; θ_claw = 20° inward  
**Material**: Tiger Defenser AR (20.0 g) + Eight Heavy WD (19.0 g) + Metal Change Base (μ_sharp = 0.06; μ_bearing = 0.02); all confirmed from part list  
**Spin Coupling**: Metal Change Base auto-switches sharp→bearing on force/impact  
**Contact Points**: 4 inward-curved claw faces; deflect fraction sin(20°) = 0.342; bearing mode evasion cost: 0.857 N at 45° redirect  
**Movement Freedom**: sharp mode (gyro stable) / bearing mode (near-frictionless evasion orbit); dω/dt_avg = 4.5 rad/s²  
**Base Stats**: Attack 50 · Defense 50 · Stamina 50 · Speed 45  
**Mechanism**: Tiger Defenser 4 inward-curved claws deflect off-angle contacts (glancing deflection). Metal Change Base bearing mode: auto-activates under impact → near-frictionless → enables 45° orbital redirect (0.857 N force, achievable without static friction). Evasion: shadow wake at vacated position 30% of incoming force; 200 ms counter window after redirect. Driger Shadow (Case 1189) is GBA 2002 Evasion Technique (回避技, Lv.20).  
**2.5D Rendering**: z_cm ≈ 1.5 · 4-claw Tiger Defenser; Metal Change Base indicator  
**Gimmick**: `drigerShadowKinematics(v, F_eu)` → evadeForce 0.857 N; wake 30%; counter 200ms  
**Engine Note**: metalChange: sharp μ 0.06 → bearing μ 0.02 on impact; θ_evade 45°; wake 30%; counter 200ms

---

### [Case 1189 — [SPECIAL] Driger Shadow](./13%20case%20study.md#case-1189)

**System**: CS13 Special Move · Ray Kon · Driger S · GBA 2002 Evasion Technique (Bakuten Shoot Beyblade 2002)  
**Geometry**: Evasion phase 80 ms (bearing mode; invulnerable) · Counter window 200 ms · Input window: tap J within 150 ms before contact  
**Material**: Metal Change Base bearing mode evasion; no BeySpirit override (GBA game-engine mechanical technique)  
**Spin Coupling**: special override (bearing mode force-activates)  
**Contact Points**: shadow wake at vacated position: 30% of incoming; counter J: Tiger claw at rear/side angle (spin −42, 520eu, dmg 1.40×, lock 50ms)  
**Movement Freedom**: 45° redirect during 80 ms evasion window  
**Base Stats**: powerCost 60 (cheapest special in CS13) · spinCost −20 · cooldown 6500 ms  
**Mechanism**: NOTE: GBA video game exclusive — no anime BeySpirit override applies (this is a game-engine mechanical technique). Tap J within 0–150 ms before projected contact. Evasion: bearing mode activates; Driger redirects 45°; incoming force reduced to 30% (shadow wake takes 70%); drigerSpinDelta = −0.30 × normal. Counter window 200 ms: J → Tiger claw (−42, 520eu, 1.40×, 50ms). No J: reposition only.  
**Special Move**: Driger Shadow — evasion 80ms; wake 30%; counter J: −42, 520eu, 1.40×; powerCost 60  
**Compatible beys**: any with Tiger Defenser AR + Metal Change Base  
**Engine Note**: noAnimeOverride (GBA mechanic); evasionWindow 80ms; shadow 30%; counterDmg 1.40×; cost 60 cheapest

---

### [Case 1190 — [COMBO] Tiger Shadow (← K J)](./13%20case%20study.md#case-1190)

**System**: CS13 Combo · Ray Kon · Driger S  
**Geometry**: Sequence: ← (moveLeft) + K + J · windowMs 550 · cooldownMs 3000  
**Spin Coupling**: combo (requires `drigerTigerDefenserAR`)  
**Contact Points**: J: Tiger claw from left-offset angle; deflectBonus 50 eu (partial incoming −25%)  
**Movement Freedom**: ← bearing-mode lateral shift  
**Base Stats**: cost 0 power (free) · type: defense  
**Mechanism**: ← shifts Driger leftward out of approach vector (Metal Change bearing mode lowers lateral friction), K intercepts at inward claw 20° deflection angle (partial incoming absorb −25% for 300ms), J delivers adjacent claw counter-strike from left-offset angle (spin −30, dmg 1.22×, lock 35ms, deflectBonus 50eu). Combo-level evade-then-counter without Driger Shadow evasion system. Free cost.  
**Engine Note**: J: spinDelta −30, dmgMult 1.22×, lockMs 35, deflectBonus 50eu; K: −25% incoming; cost 0 free

---

### [Case 1191 — [GIMMICK] Rick Anderson — Rock Bison](./13%20case%20study.md#case-1191)

**System**: Gen1-Plastic · GIMMICK · Double Horn smash + Right EG Circle Defenser orbital + Drop Rock foundation  
**Geometry**: m = 58.5 g · I = 2.698×10⁻⁵ kg·m² · ω₀ = 750 rad/s · 2 horn contacts at 180°; θ_horn = 25°  
**Material**: Double Horn AR (24.0 g) + Ten Heavy WD (22.0 g) + Right EG Circle Defenser (8.0 g, E_spring = 0.65 J) + Normal Base (4.5 g); confirmed from part list  
**Spin Coupling**: Right EG fires CW (same as RS spin → spin boost); BeySpirit redirects CW → vertical for Drop Rock launch  
**Contact Points**: 2 horns at r = 39 mm; f_horn = 238.7 Hz CFF; θ_horn = 25°; dω/dt = 21.3 rad/s²  
**Movement Freedom**: Circle Defenser wide-radius floor sweep on EG fire  
**Base Stats**: Attack 70 · Defense 50 · Stamina 30 · Speed 55  
**Mechanism**: Heavy smash assembly (m = 58.5 g — heaviest Plastic Gen bey in CS13 to date). Ten Heavy WD I = 5.104×10⁻⁶ (19% of I). Right EG CW fire: spin boost in RS orbit; BeySpirit converts CW → vertical launch (anime override). Drop Rock: h_apex_anime = 3.0 m; m_sphere = 1.559 kg; v_impact = 7.67 m/s; p = 11.96 kg·m/s (highest single-hit momentum in CS13).  
**2.5D Rendering**: z_cm ≈ 1.5 · Double Horn 2-blade massive silhouette; rock fragment accretion visual  
**Gimmick**: `dropRockSphere(h, m_rocks)` → p = 11.96 kg·m/s at full anime scale  
**Engine Note**: heaviestPlasticGen 58.5 g; p_sphere 11.96 kg·m/s; h_apex_anime 3.0 m; rightEG CW = spin boost

---

### [Case 1192 — [SPECIAL] Drop Rock](./13%20case%20study.md#case-1192)

**System**: CS13 Special Move · Rick Anderson · Rock Bison  
**Geometry**: Phase 1: Rock Accumulation 1000 ms (debris AoE ≤ 60 px) · Phase 2: EG Launch 100 ms · Phase 3: Meteor Descent 800 ms (v = 7.67 m/s)  
**Material**: m_sphere = 1.559 kg; AoE shrapnel r ≈ 150 px; ground shockwave 1222 eu  
**Spin Coupling**: special override; Right EG re-engages via BeySpirit (CW → vertical redirect, anime override)  
**Contact Points**: Phase 3 primary: 2800eu; shrapnel AoE: 700eu; ground shockwave: 1222eu  
**Movement Freedom**: Bison invulnerable during Phase 1 accumulation  
**Base Stats**: powerCost 110 · spinCost −55 · cooldown 9500 ms  
**Mechanism**: NOTE: Right EG re-engages via BeySpirit; CW spring energy redirected vertically (anime override — normal EG fires laterally). Phase 1: rock fragments accumulate (debris spin −8, 80eu to ≤60px). Phase 2: EG launch → h_apex = 3.0 m. Phase 3: primary impact 2800eu, spinDelta −90, dmg 2.3×; shrapnel AoE 700eu/−30; ground shockwave 1222eu/−45. ringOutRisk extreme (p = 11.96 kg·m/s — highest CS13). Partial charge scales proportionally.  
**Special Move**: Drop Rock — Phase 3: 2800eu, −90, 2.3×; shrapnel 700eu; shockwave 1222eu; extreme ringOut  
**Compatible beys**: any with Double Horn AR + Right EG Circle Defenser  
**Engine Note**: p_sphere 11.96 kg·m/s highest CS13; primaryImpulse 2800eu; shrapnel 700eu; charge scales

---

### [Case 1193 — [COMBO] Horn Charge (→ J ↓)](./13%20case%20study.md#case-1193)

**System**: CS13 Combo · Rick Anderson · Rock Bison  
**Geometry**: Sequence: → (moveRight) + J + ↓ (moveDown) · windowMs 550 · cooldownMs 3500  
**Spin Coupling**: combo (requires `rockBisonDoubleHornAR`)  
**Contact Points**: J: Double Horn smash at orbital peak; rockPressure 80 eu (downward grinding)  
**Movement Freedom**: Ten Heavy WD rightward orbital inertia; ↓ grinding follow-through  
**Base Stats**: cost 15 power · type: universal  
**Mechanism**: → leverages Ten Heavy WD high orbital inertia (heaviest WD in CS13), J delivers Double Horn smash at orbital peak (spin −42, dmg 1.38×, lock 60ms), ↓ follows horn trajectory downward (rockPressure 80eu grinding follow-through). Miniature Drop Rock descent combined with horn smash geometry. Ceiling: 1.38×≤1.5×; 60ms≤300ms.  
**Engine Note**: J: spinDelta −42, dmgMult 1.38×, lockMs 60, rockPressure 80eu; cost 15; heaviestWD orbital

---

> **SKIP: Cases 1194–1215 (confirmed gap — no source data)**

---

## CS13 Overflow — Cases 1216–1278 {#cs13-overflow-1216}
Source: `13 case study.md` (CS13 overflow — Blindt DeVoy Dusk Balkesh triplet + remaining MFB/Burst character triplets)

---

### [Case 1216 — [GIMMICK] Blindt DeVoy — Dusk Balkesh 7Wall Orbit Metal Gen](./13%20case%20study.md#case-1216)

**System**: Gen2-MFB / HWS · Attack  
**Geometry**: r_o ≈ 2.45 cm · r_i ≈ 0.90 cm · 4 dragon-head protrusions θ_exit=22° · h ≈ 2.00 cm  
**Material**: Zinc alloy wheel · ABS Track 7 · Metal Gen tip  
**Spin Coupling**: rigid  
**Contact Points**: 4 dragon-head contact edges at r ≈ 2.45 cm, θ_exit = 22°  
**Movement Freedom**: fixed  
**Base Stats**: Attack 80 · Defense 30 · Stamina 50 · Speed 70  
**Mechanism**: m = 45.5 g · I = 3.173×10⁻⁵ kg·m² · ω₀ = 700 rad/s. dω/dt = −0.70 rad/s² (second-lowest after Nothing — near-perfect stamina tip). Wing deflection α = 73.6° (e_wing = 0.55, θ_wing = 30°). Gyro p_eff = 0.543 kg·m/s — spin-rim momentum dominates 4:1 over translational momentum, conferring extreme gyroscopic stability and tilt resistance.  
**2.5D Rendering**: z_cm ≈ 2.0 · 4 dragon-head protrusions visible at top silhouette  
**Gimmick**: `duskWingDeflect`(α=73.6°, e_wing=0.55); gyroStability p_eff = 0.543 kg·m/s; metalGenTip dω/dt = −0.70 rad/s²  
**Engine Note**: gyroMomentum = 0.543; wingAngle = 73.6°; spinDecay rate −0.70 rad/s²; 4 dragon-head CPs

---

### [Case 1217 — [SPECIAL] Dusk Gyro](./13%20case%20study.md#case-1217)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: Phase2 roll d = 0.40 m travel · Phase3 crash radius r ≈ 2.45 cm at impact  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: Phase3 crash: 2500eu impact, ringOut 2200eu  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 0 · Stamina 0 · Speed 90  
**Mechanism**: Three-phase attack. Phase1: tilt axis 90° (−10 spin, BeySpirit override). Phase2: gyro roll — a_roll = 7.28 m/s², v_crash = 2.41 m/s, d = 0.40 m, t = 0.331 s. Phase3 crash: spinDelta −80, dmgMult 2.05×, ringOut 2200eu. powerCost 95. **Anime physics override**: BeySpirit maintains 90° axis tilt — a horizontal spin axis violates angular momentum conservation under normal physics; override allows full powered roll trajectory.  
**2.5D Rendering**: Phase1 tilt animation 90°; Phase2 rolling projectile arc; Phase3 crash burst  
**Gimmick**: Triggers Dusk Wing geometry; uses duskWingDeflect at crash angle  
**Special Move**: Dusk Gyro · powerCost 95 · animeOverride true  
**Compatible beys**: Any bey running Dusk Balkesh with Metal Gen tip and Blindt DeVoy BeySpirit unlock  
**Arena**: Standard dish · requires ≥0.40 m clearance for roll arc  
**Engine Note**: phase1 tiltAngle = 90°; phase2 a_roll = 7.28, v_crash = 2.41, t = 0.331; phase3 spinDelta −80, dmgMult 2.05; powerCost 95

---

### [Case 1218 — [COMBO] Gyro Roll (↓ → J)](./13%20case%20study.md#case-1218)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: chargeImpulse 65eu on connect  
**Movement Freedom**: —  
**Base Stats**: Attack 40 · Defense 0 · Stamina 0 · Speed 60  
**Mechanism**: Reduced Dusk Gyro maneuver without 90° tilt. spinDelta −30, dmgMult 1.24×, lockMs 40, chargeImpulse 65eu. Free cost, universal. Sliding 3-key window: ↓ → J.  
**2.5D Rendering**: Short roll arc, no tilt phase  
**Gimmick**: comboDetect(seq=[down,right,jump], window=500ms); chargeImpulse 65eu  
**Engine Note**: spinDelta −30, dmgMult 1.24×, lockMs 40, chargeImpulse 65eu; cost 0; universal combo

---

### [Case 1219 — [SPECIAL] Dusk Wing](./13%20case%20study.md#case-1219)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: Wing deflect angle α = 73.6° · parry window 120 ms  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: Parry deflect 1800eu ring-out; counter 380eu  
**Movement Freedom**: —  
**Base Stats**: Attack 70 · Defense 80 · Stamina 0 · Speed 50  
**Mechanism**: Reactive parry triggered within 250 ms input window. Phase1: deflect at α = 73.6°, 1800eu ring-out push, opponent spin −45. Phase2: counter 380eu, opponent spin −20, dmgMult 1.55×. Self spin −15. powerCost 80. **No anime override** — wing deflection α = 73.6° derives directly from measured wing geometry (e_wing = 0.55, θ_wing = 30°); this is real physics, not BeySpirit.  
**2.5D Rendering**: Wing panel protrudes at deflect moment; counter flash  
**Gimmick**: Extends duskWingDeflect(α=73.6°) into parry reaction chain  
**Special Move**: Dusk Wing · powerCost 80 · animeOverride false  
**Compatible beys**: Any bey running Dusk Balkesh  
**Arena**: Standard dish  
**Engine Note**: parryWindow 250ms, parryActive 120ms; deflect α = 73.6°, 1800eu; counter 380eu, dmgMult 1.55×; powerCost 80

---

### [Case 1220 — [COMBO] Wing Counter (↑ K J)](./13%20case%20study.md#case-1220)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: deflect 45eu on counter  
**Movement Freedom**: —  
**Base Stats**: Attack 30 · Defense 60 · Stamina 0 · Speed 0  
**Mechanism**: Abbreviated Dusk Wing parry without ring-out push. spinDelta −22, dmgMult 1.20×, lockMs 25, deflect 45eu. Free cost, defense type. Sliding 3-key window: ↑ K J.  
**2.5D Rendering**: Wing flash on connect  
**Gimmick**: comboDetect(seq=[up,defense,jump], window=500ms); deflect 45eu  
**Engine Note**: spinDelta −22, dmgMult 1.20×, lockMs 25, deflect 45eu; cost 0; defense combo

---

### [Case 1221 — [SPECIAL] Dusk Circle](./13%20case%20study.md#case-1221)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: Smooth rim shield; wing retraction during active phase  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: inDmg ×0.50 while shield active; burstBonus +40%  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 100 · Stamina 50 · Speed 0  
**Mechanism**: Defensive shield activated by hit ≥30 spinDelta or manual trigger at ≤60% ω₀. Duration 5000 ms. inDmg ×0.50; burstBonus +40% for attacker; spinCost −8 per second while active. powerCost 70. Disables Dusk Wing and Dusk Gyro while shield is active. **Anime physics override**: Retractable wings that fold into smooth rim are not physically possible at 111 Hz rotation; override allows wing retraction to function during spin.  
**2.5D Rendering**: Wing protrusions retract visually; smooth rim silhouette during active phase  
**Gimmick**: `duskCircleShield`(duration=5000ms, inDmgMult=0.50, burstBonus=0.40); disables duskWingDeflect  
**Special Move**: Dusk Circle · powerCost 70 · animeOverride true  
**Compatible beys**: Any bey running Dusk Balkesh  
**Arena**: Any  
**Engine Note**: shieldDuration 5000ms; inDmgMult 0.50; burstBonus 0.40; spinCost −8/s; powerCost 70; disables Dusk Wing + Dusk Gyro

---

### [Case 1222 — [COMBO] Circle Block (↓ K ↓)](./13%20case%20study.md#case-1222)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: deflect 40eu on connect  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 55 · Stamina 40 · Speed 0  
**Mechanism**: Short-duration Dusk Circle activation without burst bonus modifier. spinDelta −18, dmgMult 1.12×, lockMs 20, deflect 40eu. Free cost, defense type. Sliding 3-key window: ↓ K ↓.  
**2.5D Rendering**: Brief rim smoothing animation  
**Gimmick**: comboDetect(seq=[down,defense,down], window=500ms); deflect 40eu  
**Engine Note**: spinDelta −18, dmgMult 1.12×, lockMs 20, deflect 40eu; cost 0; defense combo

---

## CS13 Overflow — Cases 1223–1600 {#cs13-overflow}
Source: `13 case study.md` (continuation — Xcalius dual-contact through Horusood Claw Whirl; formerly lettered overflow)

---

### [Case 1223 — [GIMMICK] Xcalius Series — Sword-Tip Alignment and Metal Sword Dual-Force Contact Geometry](./13%20case%20study.md#case-1223)

**System**: Gen2-Burst / DB-System · Attack  
**Geometry**: r_sword = 4.2 cm · r_disc_protrusion = 3.8 cm · alignment window 0.537 ms at ω = 650 rad/s  
**Material**: ABS layer + metal sword insert (Breaker/Surge) · COR_ABS = 0.55 · COR_metal = 0.72  
**Spin Coupling**: rigid  
**Contact Points**: Xeno: dual simultaneous (layer tip + disc protrusion) at r_eff = 4.0 cm · Surge/Breaker: metal tip + secondary ABS protrusion  
**Movement Freedom**: Xeno: sliding cam extends tip 0.6 cm outward during alignment window  
**Base Stats**: Attack 100 · Defense 10 · Stamina 20 · Speed 80  
**Mechanism**: Xeno Xcalius: BeySpirit cam extends sword tip 6 mm outward during 0.537 ms Magnum protrusion alignment window → dual-point simultaneous contact → 2× effective impulse. Surge/Breaker: metal COR (0.72 vs 0.55) × secondary ABS protrusion ≈ 2.0× combined. m=51.5g (Xeno), I=4.319×10⁻⁵ kg·m². ω₀=680 rad/s, dω/dt=−6.14 rad/s².  
**2.5D Rendering**: z_cm = 1.8 · sword-tip extend flash on alignment  
**Gimmick**: xcaliusDualContact(variant, ω) → v=26.0m/s, mult=2.0×, alignWindowMs=0.537  
**Engine Note**: dualContact forceMultiplier 2.0×; Xeno: cam-extend at alignment; Surge/Breaker: metalCOR 0.72

---

### [Case 1224 — [SPECIAL] Dual Sabers / Double Impact (Xander Shakadera / Xavier Bogard)](./13%20case%20study.md#case-1224)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: strikeImpulse 1950eu; spinDelta −95  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 0 · Stamina 0 · Speed 90  
**Mechanism**: Sword-tip aligned + disc protrusion contact simultaneously (Xeno: 300ms shift; Surge/Breaker: no shift). strikeImpulse 1950eu, spinDelta −95, dmgMult 2.2×. powerCost 85, cooldown 7500ms. **Anime physics override**: BeySpirit cam fires against centrifugal return spring at 108 Hz.  
**2.5D Rendering**: Dual contact flash on both tip + disc  
**Gimmick**: dualSabers(variant) → impulse 1950eu, spin −95, dmg 2.2×  
**Special Move**: Dual Sabers / Double Impact · powerCost 85 · animeOverride true  
**Compatible beys**: Beys with sword-tip layer (r≥3.8cm) + heavy wide disc with peripheral protrusion (Xeno-type) OR metal sword insert + secondary contact (Surge/Breaker type)  
**Engine Note**: strikeImpulse 1950eu; spinDelta −95; dmgMult 2.2×; powerCost 85; cooldown 7500ms

---

### [Case 1225 — [COMBO] Saber Strike (J ↑ J)](./13%20case%20study.md#case-1225)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: swordImpulse 70eu on first J  
**Movement Freedom**: —  
**Base Stats**: Attack 70 · Defense 0 · Stamina 10 · Speed 60  
**Mechanism**: Double-tap sword surge: first J contact + ↑ tilt + second J follow-through. spinDelta −35, dmgMult 1.30×, lockMs 55. Cost 15, attack type.  
**2.5D Rendering**: Sword trail on both J hits  
**Gimmick**: comboDetect(seq=[attack,up,attack], window=600ms)  
**Engine Note**: spinDelta −35, dmgMult 1.30×, lockMs 55, swordImpulse 70eu; cost 15; attack combo

---

### [Case 1226 — [GIMMICK] Dual Charge — Universal Two-Bey Pincer Charge Physics](./13%20case%20study.md#case-1226)

**System**: Gen2-Burst / Universal · Two-Bey  
**Geometry**: θ_separation ≈ 180° · p_A = p_B = 0.0875 kg·m/s at v=2.5m/s, m=35g  
**Material**: flat/rubber/ball driver required · sync window 300ms  
**Spin Coupling**: independent  
**Contact Points**: synced: p_total = 0.175 kg·m/s → 1600eu total; unsynced: 800eu each  
**Movement Freedom**: both beys orbit to opposite sides  
**Base Stats**: Attack 80 · Defense 0 · Stamina 0 · Speed 90  
**Mechanism**: Antiparallel momentum vectors are additive from target frame → 2.0× single charge. Sync constraint: both beys must initiate within 300ms. Driver requirement: flat/rubber/ball only (sharp/bearing cannot reposition in time). Synced: 1600eu, −70 spinDelta, 1.80× dmgMult. Unsynced: 800eu each.  
**2.5D Rendering**: Pincer approach trails from both beys  
**Gimmick**: dualChargeImpact(m_A, v_A, m_B, v_B, syncDeltaMs) → synced/unsynced  
**Engine Note**: syncWindow 300ms; synced: 1600eu/−70/1.80×; unsynced: 800eu/−35/1.0×; driver: flat/rubber/ball only

---

### [Case 1227 — [SPECIAL] Dual Charge / Double Attack (Hyuga Hizashi + Valt Aoi)](./13%20case%20study.md#case-1227)

**System**: Gen2-Burst / DB-System · Special Move (Two-Bey Joint)  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: synced: total 1600eu / spinDelta −70 / dmgMult 1.80×  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 0 · Stamina 0 · Speed 85  
**Mechanism**: Two allied beys orbit to 180° separation, charge simultaneously (Δt≤300ms). Momentum addition: p_total=0.175 kg·m/s → 1600eu, −70 spinDelta, 1.80× dmgMult. Unsynced: 800eu each. powerCost 80/bey, cooldown 8500ms shared. **Anime physics override**: BeySpirit coordinates simultaneous target-lock within 300ms window.  
**2.5D Rendering**: Dual converging charge trails  
**Gimmick**: dualCharge(syncDeltaMs) → synced: 1600eu/−70/1.80×  
**Special Move**: Dual Charge / Double Attack · powerCost 80/bey · animeOverride true  
**Compatible beys**: Any two allied beys with flat/rubber/ball drivers  
**Engine Note**: syncWindow 300ms; synced: 1600eu; spinDelta −70; dmgMult 1.80×; powerCost 80/bey; cooldown 8500ms

---

### [Case 1228 — [COMBO] Charge Rush (↑ ↑ J)](./13%20case%20study.md#case-1228)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: chargeImpulse 60eu  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 0 · Stamina 10 · Speed 70  
**Mechanism**: Double-sprint + strike: two rapid advances build momentum, third beat delivers smash. spinDelta −28, dmgMult 1.22×, lockMs 35. Free cost, universal type.  
**2.5D Rendering**: Speed trail on double advance  
**Gimmick**: comboDetect(seq=[up,up,attack], window=600ms)  
**Engine Note**: spinDelta −28, dmgMult 1.22×, lockMs 35, chargeImpulse 60eu; cost 0; universal combo

---

### [Case 1229 — [GIMMICK] Dread Hades / Fusion Aether — Seven Hexagon Energy Layer and Turn Frame Channeling](./13%20case%20study.md#case-1229)

**System**: Gen2-Burst / GT-System · Attack/Defense dual-mode  
**Geometry**: r_hex = 4.4 cm · n_hex = 7 · spacing 51.4° · r_turn = 3.2 cm · n_teeth = 24  
**Material**: Dread Hades polymer hex nodes; Turn Frame gear teeth  
**Spin Coupling**: DB Core mode ring (shifts 26° for defense mode)  
**Contact Points**: Attack: F_7hex = 188.1N at r_hex; Defense: smooth orbital, dω/dt = −0.512 rad/s²  
**Movement Freedom**: Zephyr' variable tip: rubber flat at ω>400 (attack) / sharp pin at ω<400 (defense)  
**Base Stats**: Attack 85 · Defense 70 · Stamina 60 · Speed 75  
**Mechanism**: m=50.0g, I=4.312×10⁻⁵ kg·m², ω₀=720 rad/s. Attack: 7 hex nodes fire simultaneously (BeySpirit k=1.6), F_7hex=188.1N, impulse=1.129 N·s. Defense: near-Nothing dω/dt=−0.512 rad/s² (Zephyr' sharp pin, left-spin). Fusion Aether left-spin uses Turn Frame gear teeth (r=3.2cm, I=3.072×10⁻⁶ kg·m²) as channeling surface.  
**2.5D Rendering**: z_cm = 2.0 · hex-node glow in attack mode / smooth silhouette in defense  
**Gimmick**: dreadHadesMode(mode, ω, n_active) → attack: F=188N, impulse=1.13 N·s; defense: dω/dt=−0.512  
**Engine Note**: attackMode: forceMultiplier 7hex simultaneous; defenseMode: decay −0.512 rad/s²; Zephyr' tipSwitch at 400 rad/s

---

### [Case 1230 — [SPECIAL] Dread Impulse / Dead Impulse (Hyde / Count Nightfell)](./13%20case%20study.md#case-1230)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: Hades: impulse 2600eu / spinDelta −100; Fusion Aether Turn Frame: 2400eu / −90  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 10 · Stamina 10 · Speed 80  
**Mechanism**: Attack Mode: all 7 hex nodes fire co-instantaneously (BeySpirit collapses 114μs sequential pattern to single 6ms window). Hades: 2600eu, −100, 2.25×; Fusion Aether (Turn Frame, r=3.2cm): 2400eu, −90, 2.10×. powerCost 100, cooldown 9000ms. **Anime physics override**: 802 Hz sequential contact collapsed to single simultaneous impact.  
**2.5D Rendering**: All 7 hex nodes glow/fire simultaneously  
**Gimmick**: dreadImpulse(variant) → Hades: 2600eu/−100/2.25×; Fusion Aether: 2400eu/−90/2.10×  
**Special Move**: Dread Impulse · powerCost 100 · animeOverride true  
**Compatible beys**: 5+ peripheral nodes on energy layer (hex/polygon); or Turn Frame in attack orientation  
**Engine Note**: simultaneous hex collapse; powerCost 100; cooldown 9000ms

---

### [Case 1231 — [COMBO] Hex Slam (J ↓ J)](./13%20case%20study.md#case-1231)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: weightBonus 75eu  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 15 · Stamina 10 · Speed 60  
**Mechanism**: Double smash with downward press: mass advantage of 50.0g Dread Hades pressed through opponent. spinDelta −38, dmgMult 1.32×, lockMs 50. Cost 15, attack type.  
**2.5D Rendering**: Heavy-press animation on ↓ beat  
**Gimmick**: comboDetect(seq=[attack,down,attack], window=600ms)  
**Engine Note**: spinDelta −38, dmgMult 1.32×, lockMs 50, weightBonus 75eu; cost 15; attack combo

---

### [Case 1232 — [SPECIAL] Dread Gravity / Dead Gravity (Hyde / Count Nightfell)](./13%20case%20study.md#case-1232)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 3 orbit passes: −12/pass, 120eu/pass; vortex: 2000eu / spinDelta −70 / dmgMult 1.85×  
**Movement Freedom**: —  
**Base Stats**: Attack 30 · Defense 85 · Stamina 80 · Speed 40  
**Mechanism**: Defense Mode / left-spin. BeySpirit gravity well r_well=180px, g_well=0.04px/ms². 3 inward orbit passes (r_n+1 = 0.70×r_n), each −12 spin / 120eu. Phase 3 vortex finisher: 2000eu, −70, 1.85×, verticalLaunch. Total: −106 spin, 2360eu. powerCost 90, cooldown 9500ms. **Anime physics override**: centrifugal expulsion inverted to centripetal attraction (BeySpirit gravity field).  
**2.5D Rendering**: Orbital spiral trail; vortex upward launch  
**Gimmick**: dreadGravity(n_orbits, r_initial) → orbital −36 + vortex −70 = −106 total  
**Special Move**: Dread Gravity · powerCost 90 · animeOverride true  
**Compatible beys**: Defense Mode layer (≥45g) + near-frictionless orbital driver (Zephyr', Nothing, Orbit, bearing)  
**Engine Note**: gravityWell r=180px; orbitDecay 3 passes; vortexLift 2000eu; total spinDelta −106; powerCost 90; cooldown 9500ms

---

### [Case 1233 — [COMBO] Gravity Spiral (↓ ← J)](./13%20case%20study.md#case-1233)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: gravityPull 35eu (weak inward force on opponent)  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 35 · Stamina 60 · Speed 40  
**Mechanism**: Downward-left arc + attack tracing orbital closing phase. spinDelta −20, dmgMult 1.14×, lockMs 25. Free cost, stamina type.  
**2.5D Rendering**: Arc approach trail  
**Gimmick**: comboDetect(seq=[down,left,attack], window=600ms)  
**Engine Note**: spinDelta −20, dmgMult 1.14×, lockMs 25, gravityPull 35eu; cost 0; stamina combo

---

### [Case 1234 — [GIMMICK] Dragon Series — Dragon Blade Sweep and Wall-Ricochet Kinetic Build](./13%20case%20study.md#case-1234)

**System**: Gen2-Burst / DB-System · Attack  
**Geometry**: r_blade = 4.0 cm · θ_sweep = 35° · n_blades = 3 · r_orbit = 19.2 cm · s = 0.603 m  
**Material**: ABS · COR_wall = 0.60  
**Spin Coupling**: rigid  
**Contact Points**: wall rebound: v_rebound = 0.923 m/s → p_rebound = 0.034 kg·m/s; 4-hit barrage: 200eu/hit + 500eu final  
**Movement Freedom**: Charge rubber flat driver (μ=0.08)  
**Base Stats**: Attack 90 · Defense 5 · Stamina 20 · Speed 85  
**Mechanism**: m=37.0g, I=2.553×10⁻⁵ kg·m², ω₀=720 rad/s, dω/dt=−9.09 rad/s². Half-orbit wall approach: a_orbital=1.962 m/s², v_wall=1.538 m/s. COR_wall=0.60 → v_rebound=0.923 m/s toward opponent. 4-hit barrage at v_hit≈1.2 m/s: 200eu × 3 + 500eu final = 1100eu total.  
**2.5D Rendering**: z_cm ≈ 1.8 · wall-bounce trail + 4-hit barrage  
**Gimmick**: dragonWallRicochet(ω) → v_wall 1.538m/s, v_rebound 0.923m/s, 4× 200eu + 500eu  
**Engine Note**: wallRicochet COR 0.60; barrage 4 hits; total 1100eu; dω/dt −9.09 rad/s²

---

### [Case 1235 — [SPECIAL] Dragon Launch / Dragon Shoot (Dante Koryu)](./13%20case%20study.md#case-1235)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: total 1100eu / spinDelta −70 / dmgMult 1.80× / n_hits 4  
**Movement Freedom**: —  
**Base Stats**: Attack 90 · Defense 0 · Stamina 15 · Speed 90  
**Mechanism**: Half-orbit build → wall ricochet (COR=0.60) → 4-hit barrage (200+200+200+500eu). Full charge: 1100eu, −70, 1.80×, 4 hits. Partial: 600eu, −40, 1.40×, 2 hits. powerCost 80, spinCost 8, cooldown 7500ms. **Anime physics override**: BeySpirit locks ricochet vector onto opponent regardless of wall-contact geometry.  
**2.5D Rendering**: Half-orbit trail + wall flash + 4 hit sparks  
**Gimmick**: dragonLaunch(chargedFull) → full: 1100eu/−70/1.80×/4hits  
**Special Move**: Dragon Launch · powerCost 80 · animeOverride true  
**Compatible beys**: Any bey with flat/rubber driver (Charge, Ignition', Attack, Xtreme)  
**Engine Note**: wallBounce COR 0.60; 4-hit barrage; total 1100eu; powerCost 80; cooldown 7500ms

---

### [Case 1236 — [COMBO] Dragon Dash (→ ↑ J)](./13%20case%20study.md#case-1236)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: wallBounce 50eu (minor ricochet bonus)  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 0 · Stamina 10 · Speed 70  
**Mechanism**: Right-forward diagonal approach + strike. spinDelta −25, dmgMult 1.20×, lockMs 30. Free cost, attack type.  
**2.5D Rendering**: Diagonal approach trail  
**Gimmick**: comboDetect(seq=[right,up,attack], window=600ms)  
**Engine Note**: spinDelta −25, dmgMult 1.20×, lockMs 30, wallBounce 50eu; cost 0; attack combo

---

### [Case 1237 — [GIMMICK] Oliver's Unicolyon — Earth Shake Oscillation Mechanics](./13%20case%20study.md#case-1237)

**System**: Gen1-Plastic / SGS · Oscillation Foundation  
**Geometry**: r_AR = 4.2 cm · r_WD = 2.0 cm · f_spin = 108.2 Hz  
**Material**: ABS plastic · stadium ABS floor (d_floor ≈ 0.15–0.25)  
**Spin Coupling**: rigid  
**Contact Points**: F_lateral_peak = 0.89–2.46 N at f_osc=4Hz, A=20mm  
**Movement Freedom**: fixed tip contact; lateral oscillation driven by BeySpirit  
**Base Stats**: Attack 20 · Defense 30 · Stamina 60 · Speed 30  
**Mechanism**: m=40.0g, I=3.80×10⁻⁵ kg·m², ω₀=680 rad/s (6497 rpm). Lateral oscillation model: F_lateral = m×A_osc×sin(2π×f_osc×t); f_osc=3–5 Hz, A=15–25mm, F_peak≈0.89–2.46N. Resonance with opponent nutation (f_nutation≈2–8Hz) amplifies wobble each cycle. Stadium floor transmits: d_floor=0.15–0.25; near-unity transmission at <80mm separation. **Anime override**: BeySpirit sustains oscillation beyond physical tip-friction capability.  
**2.5D Rendering**: Ground-shake ripple effect on arena floor  
**Gimmick**: earthShakeOscillation(f_osc, r_separation, f_nutation_opp) → resonant/non-resonant  
**Engine Note**: f_osc 3–5Hz; A_osc 15–25mm; resonance check vs f_nutation_opp; floor transmission

---

### [Case 1238 — [SPECIAL] Earth Shake (Oliver · Unicolyon)](./13%20case%20study.md#case-1238)

**System**: Gen1-Plastic / SGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: resonant total spinDelta −70; non-resonant −40; primary impulse 1200eu; dmgMult 1.80×  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 30 · Stamina 60 · Speed 20  
**Mechanism**: Phase 1: 800ms manifestation. Phase 2: 3000ms stadium shake at f_osc=4Hz; 12 ticks × (−10 resonant / −4 non-resonant); wobble_factor +0.06/tick resonant. Phase 3: vortex slam 1200eu. QTE: ←→ rhythm + J vortex tap. powerCost 75, cooldown 8000ms. **Anime override**: sustained ground-shake beyond physical tip friction.  
**2.5D Rendering**: Stadium vibration ripple + Unicolyon BitBeast manifestation  
**Gimmick**: earthShake(resonantTicks, nonResonantTicks, qteRhythm, qteVortex) → spinDelta + impulse  
**Special Move**: Earth Shake · powerCost 75 · animeOverride true  
**Compatible beys**: Any Plastic Gen bey with a Bit Beast (BitBeast-type specialMoveId); excludes non-Bit-Beast beys  
**Engine Note**: resonantTick −10; nonResonantTick −4; vortexBase 1200eu; wobbleFactor +0.06/resonantTick; powerCost 75; cooldown 8000ms

---

### [Case 1239 — [COMBO] Quake Jab (← → K)](./13%20case%20study.md#case-1239)

**System**: Gen1-Plastic / SGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: shakePush 35eu (lateral destabilize micro-impulse)  
**Movement Freedom**: —  
**Base Stats**: Attack 30 · Defense 35 · Stamina 40 · Speed 40  
**Mechanism**: Left shoulder-check → rightward push → guard-deflect micro-oscillation nudge. spinDelta −22, dmgMult 1.15×, lockMs 25. Free cost, balanced type.  
**2.5D Rendering**: Quick left-right flash  
**Gimmick**: comboDetect(seq=[left,right,defense], window=600ms)  
**Engine Note**: spinDelta −22, dmgMult 1.15×, lockMs 25, shakePush 35eu; cost 0; balanced combo

---

### [Case 1240 — [GIMMICK] Emperor Forneus 0 Yard — Slope-Riding Outer-Rim Banking Mechanics](./13%20case%20study.md#case-1240)

**System**: Gen2-Burst / GT-System · Defense/Counter  
**Geometry**: r_rim = 4.1 cm · θ_wall = 45° · v_rise = 2.24 m/s · h_climb = 25.6 cm · v_total = 8.28 m/s  
**Material**: ABS · Yard rubber ball tip μ=0.15 (normal) / μ=0.20 (drift)  
**Spin Coupling**: rigid  
**Contact Points**: J_impact = 0.298 N·s at standard medium-hit input  
**Movement Freedom**: Yard ball driver: free multi-axis movement; bowl-wall climbing  
**Base Stats**: Attack 35 · Defense 70 · Stamina 60 · Speed 55  
**Mechanism**: m=36.0g, I=3.141×10⁻⁵ kg·m², ω₀=700 rad/s, f=111.4Hz. Power absorption: incoming impulse redirected up wall (v_rise = p_up/m). Outer-rim banking: Δv_bank = 2×v_rise×sin(α/2) at α=90° → 3.17 m/s. Gravity descent: v_descent ≈ v_rise. v_total = v_rise + v_bank + v_rim = 8.28 m/s. J_impact = 0.298 N·s. dω/dt = −2.529 rad/s² (normal Yard contact).  
**2.5D Rendering**: z_cm = 1.8 · bowl-wall climb trajectory + banking arc  
**Gimmick**: emperorCrashGimmick(m_opp, v_approach, θ_wall) → v_rise, h_climb, v_total, J_impact  
**Engine Note**: powerAbsorption scaling; bankingAngle 90°; v_total 8.28m/s; dω/dt −2.529 rad/s²

---

### [Case 1241 — [SPECIAL] Emperor Crash (Fubuki Sumiye · Emperor Forneus 0 Yard)](./13%20case%20study.md#case-1241)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: medium: 1800eu / spinDelta −80 / dmgMult 1.90×; scales with opponent hit strength  
**Movement Freedom**: —  
**Base Stats**: Attack 60 · Defense 70 · Stamina 40 · Speed 60  
**Mechanism**: Phase 1: absorb incoming impulse, redirect up wall (0–600ms). Phase 2: outer-rim banking at apex (600–1100ms). Phase 3: emperor crash slam (1100–1600ms). Scales: weak≤30%→800eu/1.50×; medium 31–70%→1800eu/1.90×; strong 71–100%→2600eu/2.20×. QTE: J at apex + K during climb. powerCost 85, cooldown 8500ms. **Anime override**: BeySpirit amplifies slope-riding beyond Yard friction limit.  
**2.5D Rendering**: Wall-climb + banking flash + slam  
**Gimmick**: emperorCrash(opponentPowerFraction, qteApex, qteClimb) → scaled impulse/spinDelta/dmgMult  
**Special Move**: Emperor Crash · powerCost 85 · animeOverride true  
**Compatible beys**: Ball/rubber-ball/wide-flat driver (r_outer≥3.5cm); driver: Y, O', B, Un, Na, Su  
**Engine Note**: powerScaling 0.0–1.0; baseImpulse 800–2600eu; dmgMult 1.50×–2.20×; powerCost 85; cooldown 8500ms

---

### [Case 1242 — [COMBO] Rim Ride (→ K ↑)](./13%20case%20study.md#case-1242)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: slopeBonus 40eu if within 80px of arena wall  
**Movement Freedom**: —  
**Base Stats**: Attack 35 · Defense 40 · Stamina 35 · Speed 50  
**Mechanism**: Wall approach → guard deflect → angled counter-charge. spinDelta −20, dmgMult 1.18×, lockMs 30. Near-wall bonus: +40eu. Free cost, balanced type.  
**2.5D Rendering**: Wall-deflect arc  
**Gimmick**: comboDetect(seq=[right,defense,up], window=600ms); slopeBonus 40eu if nearWall  
**Engine Note**: spinDelta −20, dmgMult 1.18×, lockMs 30, slopeBonus 40eu nearWall; cost 0; balanced combo

---

### [Case 1243 — [GIMMICK] Emperor Forneus 0 Yard — Yard Driver Outer-Rim Tilt Contact (Emperor Drift Mechanism)](./13%20case%20study.md#case-1243)

**System**: Gen2-Burst / GT-System · Drift Mechanics  
**Geometry**: R_ball = 0.5 cm · r_rim = 0.7 cm · θ_tilt ≈ 45–52° · r_contact_drift = 0.7 cm · r_arc = 21.8 cm  
**Material**: ABS rubber ball · μ_k_drift = 0.20  
**Spin Coupling**: rigid  
**Contact Points**: outer-rim: dω/dt_drift = −15.72 rad/s² · v_rim = 4.90 m/s · v_final = 7.06 m/s  
**Movement Freedom**: tilted outer-rim contact; drift arc guided by gyroscopic precession (Ω_prec = 0.02246 rad/s)  
**Base Stats**: Attack 60 · Defense 20 · Stamina 40 · Speed 75  
**Mechanism**: Normal Yard: r_tip_centre≈1.5mm → dω/dt=−2.529 rad/s². Drift: outer rim (r=7mm) contacts floor at θ≈52° → dω/dt_drift=−15.72 rad/s² (6× faster). v_rim=4.90m/s; a_drift=1.962 m/s²; v_final(1.1s)=7.06m/s. Arc radius=218mm. J_impact=0.254 N·s.  
**2.5D Rendering**: Tilted bey silhouette; sparking outer-rim drift arc  
**Gimmick**: emperorDriftGimmick(ω, t_drift) → v_initial, v_final, J_impact, r_arc, spin_lost  
**Engine Note**: outerRimContact r=0.7cm; dω/dt_drift −15.72 rad/s²; arcRadius 218mm; J_impact 0.254 N·s

---

### [Case 1244 — [SPECIAL] Emperor Drift (Fubuki Sumiye · Emperor Forneus 0 Yard)](./13%20case%20study.md#case-1244)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 1700eu / spinDelta −75 / dmgMult 1.85× / selfSpinDrain −17 rad/s  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 20 · Stamina 45 · Speed 80  
**Mechanism**: Phase 1: tilt initiation (0–300ms). Phase 2: drift arc ~218mm radius, 1 full circuit, speed 4.90→7.06 m/s (1100ms). Phase 3: crash (1400–1700ms). QTE: J at mid-arc + directional aim bonus within 30°. powerCost 80, cooldown 8000ms. **Anime override**: BeySpirit sustains extreme outer-rim tilt beyond physical gyroscopic correction.  
**2.5D Rendering**: Tilted bey + sparking drift trail + crash flash  
**Gimmick**: emperorDrift(qteArc, exitAngleDeg) → impulse, spinDelta, dmgMult, selfDrain  
**Special Move**: Emperor Drift · powerCost 80 · animeOverride true  
**Compatible beys**: Wide ball/rubber-ball driver (Yard, Orbit, Unite, Navigate, Bearing, Survive, Merge, Atomic); r_outer≥3.5cm  
**Engine Note**: driftArcRadius 218mm; v_final 7.06m/s; impulse 1700eu; spinDelta −75; selfDrain −17 rad/s; powerCost 80; cooldown 8000ms

---

### [Case 1245 — [COMBO] Drift Dash (← K →)](./13%20case%20study.md#case-1245)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: arcBonus 30eu if range>120px  
**Movement Freedom**: —  
**Base Stats**: Attack 35 · Defense 35 · Stamina 35 · Speed 50  
**Mechanism**: Lateral feint → guard deflect → rightward surge. spinDelta −18, dmgMult 1.16×, lockMs 25. Free cost, balanced type.  
**2.5D Rendering**: Left-right redirect flash  
**Gimmick**: comboDetect(seq=[left,defense,right], window=600ms); arcBonus 30eu if range>120px  
**Engine Note**: spinDelta −18, dmgMult 1.16×, lockMs 25, arcBonus 30eu; cost 0; balanced combo

---

### [Case 1246 — [GIMMICK] Eclipse Genesis Hybrid — Lemniscate Resonance Barrier Mechanics](./13%20case%20study.md#case-1246)

**System**: Gen2-Burst / BU-System · Defense/Field  
**Geometry**: r_Layer = 4.0 cm · 2-lobe symmetric · f_lemniscate = 59.7 Hz · r_max = 6.25 cm (625px) · a = 4.42 cm  
**Material**: ABS 2-lobe layer · Hybrid bearing tip μ=0.05  
**Spin Coupling**: Hybrid bearing mode: near-zero translational drift  
**Contact Points**: field contact: 900eu radially outward; wall-adjacent bonus: 1260eu  
**Movement Freedom**: near-stationary centre-spin (v_translational ≈ 0.05–0.10 m/s)  
**Base Stats**: Attack 20 · Defense 80 · Stamina 70 · Speed 15  
**Mechanism**: m=42.0g, I=3.494×10⁻⁵ kg·m², ω₀=750 rad/s, f=119.4Hz, dω/dt=−0.590 rad/s² (bearing). 2-lobe anti-phase: f_lemniscate=f/2=59.7Hz. Standing wave in lemniscate (∞) shape: r_max=625px. Contact triggers radial push 900eu (1260eu if within 200px of wall), spinDelta −45, dmgMult 1.60× per target.  
**2.5D Rendering**: ∞ shape barrier field; radial push flash on contact  
**Gimmick**: eclipsePulseBarrier(r_contact, r_wall, m_opp) → pushImpulse, ringOutBonus, spinDelta  
**Engine Note**: lemniscateRadius 625px; contactPush 900eu; wallBonus 1.40×; spinDelta −45; dω/dt −0.590 rad/s²

---

### [Case 1247 — [SPECIAL] Eclipse Pulse (Gwyn Reynolds · Eclipse Genesis Hybrid)](./13%20case%20study.md#case-1247)

**System**: Gen2-Burst / BU-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 900eu/opponent; ring-out near-wall +40%; spinDelta −45/target; barrier 3000ms  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 85 · Stamina 75 · Speed 10  
**Mechanism**: Phase 1: centering 500ms. Phase 2: barrier formation (lemniscate r=625px) 1000ms. Phase 3: contact trigger → shockwave all opponents in field. AoE per-target: 900eu, −45, 1.60×; wall-adjacent: 1260eu. Multi-opponent: each lobe pushes one in opposite radial direction. QTE: J at formation + K hold centre. powerCost 90, cooldown 10000ms. **Anime override**: BeySpirit sustains field beyond ω decay.  
**2.5D Rendering**: ∞ glowing barrier; shockwave expansion  
**Gimmick**: eclipsePulse(nOpponents, qteFormation, qteCentre, nearWall[]) → perOpponentImpulse  
**Special Move**: Eclipse Pulse · powerCost 90 · animeOverride true  
**Compatible beys**: Bearing/Orbit/Atomic/Unite driver + 2-lobe symmetric Layer; L×I ≥ 0.020 kg·m²·rad/s  
**Engine Note**: fieldRadius 625px; perOpponent 900eu; wallBonus 1.40×; spinDelta −45; dmgMult 1.60×; powerCost 90; cooldown 10000ms

---

### [Case 1248 — [COMBO] Pulse Guard (↓ K ↑)](./13%20case%20study.md#case-1248)

**System**: Gen2-Burst / BU-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: deflectPush 50eu radially outward  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 55 · Stamina 50 · Speed 20  
**Mechanism**: Centre-draw → guard brace → outward push. spinDelta −15, dmgMult 1.12×, lockMs 30. Free cost, defense type.  
**2.5D Rendering**: Centre-anchor flash + outward push  
**Gimmick**: comboDetect(seq=[down,defense,up], window=600ms); deflectPush 50eu  
**Engine Note**: spinDelta −15, dmgMult 1.12×, lockMs 30, deflectPush 50eu; cost 0; defense combo

---

### [Case 1249 — [GIMMICK] Eclipse Armor Two-Blade Whip Mechanics](./13%20case%20study.md#case-1249)

**System**: Gen2-Burst / BU-System · Attack (Two-Bey)  
**Geometry**: n_blades = 2 · r_blade = 4.2 cm · m_blade = 3.0g · f_contact = 238.7 Hz · v_tip = 31.5 m/s · r_whip_eff = 8.4 cm  
**Material**: Eclipse Armor (ABS blades) · COR implied standard  
**Spin Coupling**: rigid on both host assemblies  
**Contact Points**: J_per_blade = 0.0945 N·s · J_total = 0.189 N·s (both blades) ≈ 1600eu  
**Movement Freedom**: 60° sweep arc per blade; two arcs at 180° separation  
**Base Stats**: Attack 85 · Defense 10 · Stamina 10 · Speed 80  
**Mechanism**: Eclipse Armor: 2 blades at 180°, r_blade=4.2cm, m_blade=3.0g. f_contact=ω/π=238.7Hz (continuous blur). Whip extension: BeySpirit extends energy envelope to r_whip=8.4cm (2× r_blade); v_tip=31.5m/s. F_blade=70.9N, J_per_blade=0.0945 N·s, J_total=0.189 N·s ≈ 1600eu. Prime Apocalypse assembly: m=40.0g, I=3.557×10⁻⁵; Eclipse Genesis: m=42.0g, I=3.494×10⁻⁵.  
**2.5D Rendering**: Dual blade arcs at 180°; whip extension flash  
**Gimmick**: eclipseArmorSlashGimmick(ω, r_blade) → f_contact, v_tip, J_per_blade, J_total  
**Engine Note**: f_contact 238.7Hz; v_tip 31.5m/s; J_total 0.189 N·s; r_whip_eff 8.4cm; twoBladeArcs 180°

---

### [Case 1250 — [SPECIAL] Eclipse Whip (Gwyn Reynolds / Arthur Peregrine)](./13%20case%20study.md#case-1250)

**System**: Gen2-Burst / BU-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: both blades: 1600eu / spinDelta −70 / dmgMult 1.80×; sweep zone: two 60° arcs at 180°, r_eff=2016px  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 10 · Stamina 10 · Speed 80  
**Mechanism**: Phase 1: blade charge 400ms. Phase 2: whip extension to r_whip=84mm. Phase 3: dual slash (both 60° arcs simultaneously). Both blades: 1600eu total, −70, 1.80×. One blade: 800eu, −70, 1.50×. QTE: J at full-extension flash + directional aim. powerCost 80, cooldown 8000ms. **Anime override**: blade energy envelope extends beyond 42mm physical tip.  
**2.5D Rendering**: Two sweeping arc trails + impact flash  
**Gimmick**: eclipseWhip(qteSlash, aimBonus, nBladesInSweep) → totalImpulse, spinDelta, dmgMult  
**Special Move**: Eclipse Whip · powerCost 80 · animeOverride true  
**Compatible beys**: Eclipse Armor ring (2 blades at ~180°, r_blade≥3.5cm); or equivalent 2-dominant-blade layer  
**Engine Note**: dualBlade 1600eu; spinDelta −70; dmgMult 1.80×; sweepZone two 60° arcs; powerCost 80; cooldown 8000ms

---

### [Case 1251 — [COMBO] Whip Cross (→ J ←)](./13%20case%20study.md#case-1251)

**System**: Gen2-Burst / BU-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: sweepBonus 45eu (second-direction exit)  
**Movement Freedom**: —  
**Base Stats**: Attack 60 · Defense 10 · Stamina 10 · Speed 65  
**Mechanism**: Right dash → attack → left sweep follow-through. spinDelta −30, dmgMult 1.22×, lockMs 40. Free cost, attack type.  
**2.5D Rendering**: Cross-body sweep trail  
**Gimmick**: comboDetect(seq=[right,attack,left], window=600ms); sweepBonus 45eu  
**Engine Note**: spinDelta −30, dmgMult 1.22×, lockMs 40, sweepBonus 45eu; cost 0; attack combo

---

### [Case 1252 — [GIMMICK] Orb Engaard Outer Quest — Spherical-Orb Slope Adhesion and Deflection Mechanics](./13%20case%20study.md#case-1252)

**System**: Gen2-Burst / DB-System · Defense  
**Geometry**: n_orbs = 6 · r_orb = 0.5 cm · r_orb_centre = 4.0 cm · COR_orb = 0.65 · C_roll = 0.02  
**Material**: ABS/rubber composite orbs · Quest ball tip  
**Spin Coupling**: rigid  
**Contact Points**: α=45°: p_absorbed=0.012 N·s, p_counter=0.023 N·s, p_tangential=0.023 N·s (at p_in=0.050 N·s)  
**Movement Freedom**: Quest ball driver: smooth lateral + slope traversal  
**Base Stats**: Attack 10 · Defense 80 · Stamina 55 · Speed 40  
**Mechanism**: m=38.0g, I=3.388×10⁻⁵ kg·m², ω₀=700 rad/s. 6 orbs evenly at r=4.0cm. Rolling resistance C_roll=0.02 (7.5× less than sliding) → low wall-ride drag. Orb deflection: spherical geometry absorbs only ~24% of impulse at α=45°, returns ~46% as counter. Outer disc at r=4.2cm maximises I for gyroscopic wall stability.  
**2.5D Rendering**: z_cm = 1.8 · orb highlights on bowl-wall contact  
**Gimmick**: orbDeflection(p_in, α_deg) → p_absorbed, p_counter, p_tangential  
**Engine Note**: rollingResistance C_roll=0.02; orbCOR 0.65; counter ≈ 46% at α=45°; wallRide stable

---

### [Case 1253 — [SPECIAL] Egis Guard (Evel Oxford · Orb Engaard Outer Quest)](./13%20case%20study.md#case-1253)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 150eu counter/deflect; burstBonus +50%; spin recovery +10 rad/s/s; max 8–10 deflections/2500ms  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 85 · Stamina 60 · Speed 30  
**Mechanism**: Phase 1: wall mount (0–400ms, rolling adhesion). Phase 2: guard stance 2500ms (each deflect: 150eu counter, ~30eu absorbed, +50% burst resist, +10 rad/s/s spin recovery). Phase 3: optional J spring-exit (400eu dash). Total counter scales with deflect count + QTE precision (K taps). powerCost 70, cooldown 8000ms. **Anime override**: BeySpirit anchors slope contact beyond rolling friction.  
**2.5D Rendering**: Wall-mounted orb guard stance; counter flash per deflect  
**Gimmick**: egisGuard(nDeflections, qteHitCount, qteExitSpring) → totalCounter, selfSpin, burstBonus  
**Special Move**: Egis Guard · powerCost 70 · animeOverride true  
**Compatible beys**: Spherical/convex outer-rim layer + ball/orbit-family driver (r_outer≥3.5cm; μ_roll driver)  
**Engine Note**: counterPerDeflect 150eu; burstBonus 50%; spinRecovery +10 rad/s/s; guardDuration 2500ms; powerCost 70; cooldown 8000ms

---

### [Case 1254 — [COMBO] Orb Bounce (K J K)](./13%20case%20study.md#case-1254)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: deflectReturn 40eu on final K  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 55 · Stamina 40 · Speed 25  
**Mechanism**: Guard-attack-guard rhythm mirroring orb deflection cycle. spinDelta −20, dmgMult 1.15×, lockMs 35. Free cost, defense type.  
**2.5D Rendering**: Guard-strike-guard flash sequence  
**Gimmick**: comboDetect(seq=[defense,attack,defense], window=600ms); deflectReturn 40eu  
**Engine Note**: spinDelta −20, dmgMult 1.15×, lockMs 35, deflectReturn 40eu; cost 0; defense combo

---

### [Case 1255 — [GIMMICK] Kinetic Satomb 2Glaive Loop — Loop Tip Curved-Edge Stadium-Wall Orbit](./13%20case%20study.md#case-1255)

**System**: Gen2-Burst / Evolution-System · Attack  
**Geometry**: r_orbit = 38.1 cm · C_orbit = 239.4 cm · r_Loop_outer = 0.6 cm · μ_roll_wall = 0.04  
**Material**: ABS Kinetic Satomb + Glaive frame; Loop tip toroidal rim  
**Spin Coupling**: rigid  
**Contact Points**: v₀=3.0→v₁.₅=4.2 m/s after 1.5 orbits; J_impact=0.158 N·s ≈ 1400eu physical  
**Movement Freedom**: Loop rim rolls against bowl wall in continuous orbit  
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 85  
**Mechanism**: m=37.0g, I=2.959×10⁻⁵ kg·m², ω₀=680 rad/s. Loop tip toroidal rim (r_cs=3mm, r_outer=6mm) engages bowl wall. Wall friction drive: F_drive=μ_roll×N_wall=0.03496N at v=3.0m/s. ΔKE per orbit=0.0837J → v₁=3.678m/s. After 1.5 orbits: v=4.2m/s, J=0.158 N·s ≈ 1400eu (BeySpirit amplified to 1750eu).  
**2.5D Rendering**: Stadium-perimeter orbit trail + speed build  
**Gimmick**: cycloneLoopGimmick(v0, n_orbits) → v_final, J_impact, C_orbit  
**Engine Note**: wallRollFriction μ=0.04; speedBuild 3.0→4.2m/s/1.5orbits; J_impact 0.158 N·s

---

### [Case 1256 — [SPECIAL] Cyclone Loop (Silas Karlisle · Kinetic Satomb 2Glaive Loop)](./13%20case%20study.md#case-1256)

**System**: Gen2-Burst / Evolution-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 1750eu / spinDelta −65 / dmgMult 1.80× / orbit 1.5  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 5 · Stamina 20 · Speed 88  
**Mechanism**: Phase 1: wall engage (0–300ms). Phase 2: 1.5 orbit loops, speed 3.0→4.2m/s. Phase 3: exit tangentially toward opponent, full Glaive blade contact. QTE: J at each orbit completion (+150eu +0.5 orbit) + directional aim (+200eu). powerCost 75, cooldown 8000ms. **Anime override**: BeySpirit maintains wall-contact drive regardless of spin decay.  
**2.5D Rendering**: Perimeter orbit trail + tangential exit flash  
**Gimmick**: cycloneLoop(qteOrbitHits, aimBonus) → totalImpulse, spinDelta, dmgMult  
**Special Move**: Cyclone Loop · powerCost 75 · animeOverride true  
**Compatible beys**: Loop tip (L) or equivalent toroidal-rim driver; any attack/balanced layer  
**Engine Note**: baseImpulse 1750eu; spinDelta −65; dmgMult 1.80×; orbit 1.5; powerCost 75; cooldown 8000ms

---

### [Case 1257 — [COMBO] Loop Dash (↑ → J)](./13%20case%20study.md#case-1257)

**System**: Gen2-Burst / Evolution-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: arcBonus 35eu if within 120px of wall  
**Movement Freedom**: —  
**Base Stats**: Attack 50 · Defense 5 · Stamina 15 · Speed 65  
**Mechanism**: Upward dash → rightward arc → strike. spinDelta −22, dmgMult 1.18×, lockMs 30. Wall-adjacent bonus 35eu. Free cost, attack type.  
**2.5D Rendering**: Arcing approach trail  
**Gimmick**: comboDetect(seq=[up,right,attack], window=600ms); arcBonus 35eu nearWall  
**Engine Note**: spinDelta −22, dmgMult 1.18×, lockMs 30, arcBonus 35eu; cost 0; attack combo

---

### [Case 1258 — [GIMMICK] Emperor Forneus 0 Yard — 12-Blade Metal Layer CFF and Burst-Resistance Analysis](./13%20case%20study.md#case-1258)

**System**: Gen2-Burst / GT-System · Defense Analysis  
**Geometry**: n_blades = 12 · θ_gap = 30° · f_contact = 1337 Hz · B_mult = 3.86× · r_contact = 3.1 cm  
**Material**: Die-cast zinc alloy · COR_metal = 0.72 vs COR_ABS = 0.55  
**Spin Coupling**: rigid  
**Contact Points**: J_blade = 0.155 N·s · E_retained = 0.070 J · Δω_self = 153 rad/s/hard-block  
**Movement Freedom**: fixed  
**Base Stats**: Attack 0 · Defense 90 · Stamina 60 · Speed 0  
**Mechanism**: 12 blades × f_contact=1337Hz (continuous blur ring). θ_half=15° → B_mult=1/sin(15°)=3.86× (vs 4-blade ABS B_mult=1.41×). Metal COR=0.72 → J_blade=0.155 N·s on standard contact. Δω_self≈153 rad/s per hard block (21.8% of ω₀, reduced ~40% by azimuthal averaging). 2.74× harder to burst than 4-blade ABS.  
**2.5D Rendering**: Continuous metal blur ring at battle spin  
**Gimmick**: metalLayerAnalysis(ω, v_in, m_opp) → f_contact, burstMult, J_blade, dOmega  
**Engine Note**: f_contact 1337Hz; burstResistMult 3.86×; metalCOR 0.72; J_blade 0.155 N·s

---

### [Case 1259 — [SPECIAL] Emperor Guard (Fubuki Sumiye · Emperor Forneus 0 Yard)](./13%20case%20study.md#case-1259)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: 150eu/deflect / burstBonus +65% / duration 3000ms; spin held at ω₀=700 rad/s  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 95 · Stamina 65 · Speed 0  
**Mechanism**: 12-blade metal layer spins at ω₀=700 rad/s for 3000ms (BeySpirit holds spin). Each deflect: 150eu counter (perfect) / 100eu (hit) / 50eu (miss); burst resist +65% / +50% / +35%; per-deflect spinDelta_opp −18. QTE: hold D + press J when opponent at r≤200px. powerCost 65, cooldown 7500ms. **Anime override**: spin maintained at ω₀ regardless of impact losses.  
**2.5D Rendering**: Metal blur ring glowing; counter flash per deflect  
**Gimmick**: emperorGuard(qteHit, hitQuality) → counterEu, burstBonus, duration  
**Special Move**: Emperor Guard · powerCost 65 · animeOverride true  
**Compatible beys**: Metal/metal-reinforced Layer ≥600 rad/s, n≥6 blades/lobes, COR≥0.65, Shore D≥70  
**Engine Note**: spinHeld ω₀=700 rad/s (BeySpirit); counterEu 50/100/150; burstBonus 35%/50%/65%; duration 2000/3000ms; powerCost 65; cooldown 7500ms

---

### [Case 1260 — [COMBO] Iron Ward (→ K J)](./13%20case%20study.md#case-1260)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: highSpin bonus: dmgMult 1.30× (spin>500 rad/s)  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 60 · Stamina 30 · Speed 25  
**Mechanism**: Lateral step → guard hold → counter-snap along blade edge. spinDelta −14, dmgMult 1.22× (1.30× high-spin), lockMs 120. Free cost, defense type.  
**2.5D Rendering**: Blade-face counter flash  
**Gimmick**: comboDetect(seq=[right,defense,attack], window=600ms); highSpin dmgMult 1.30×  
**Engine Note**: spinDelta −14, dmgMult 1.22×(+1.30× highSpin), lockMs 120; cost 0; defense combo

---

### [Case 1261 — [GIMMICK] Gravity Destroyer AD145WD — Counter Mode Vortex Field and Wide Defense Platform Analysis](./13%20case%20study.md#case-1261)

**System**: Gen2-MFB / HWS · Defense/Vortex  
**Geometry**: r_FW = 4.1 cm · r_inner = 1.4 cm · r_tip_WD = 0.75 cm · AD145 CoM shift +2mm/step  
**Material**: Zinc alloy Gravity FW · μ_WD = 0.018 · COR Counter Mode α = 0.42  
**Spin Coupling**: dual-spin switch (Counter Mode vs Attack Mode)  
**Contact Points**: J_counter = 0.085 N·s at J_in=0.060; Δω_self = +642 rad/s (transient spin boost)  
**Movement Freedom**: WD flat tip: low-friction stable orbit; AD145 height-adjustable (3 positions)  
**Base Stats**: Attack 20 · Defense 90 · Stamina 80 · Speed 20  
**Mechanism**: m=41.5g, I=3.895×10⁻⁵ kg·m², ω₀=650 rad/s, dω/dt=−14.5 rad/s², t_stable=26.9s. Counter Mode α=0.42: J_counter=J_in×1.42=0.085 N·s (per J_in=0.060). AD145 CoM shift: Ω_prec_std=0.165 rad/s → Ω_prec_max=0.264 rad/s (1.6× more frequent vortex pulsing at max height). ΔP_vortex=78Pa physical; BeySpirit extends field.  
**2.5D Rendering**: z_cm = 1.45 · vortex field emanating from AD145; 8 pillar layout in Eyes of Medusa  
**Gimmick**: gravityDestroyerAnalysis(ω, adHeight) → Ω_prec, decay, t_stable, J_counter  
**Engine Note**: counterModeAlpha 0.42; J_counter 1.42×J_in; AD145 Ω_prec 0.165–0.264 rad/s; dω/dt −14.5 rad/s²; t_stable 26.9s

---

### [Case 1262 — [SPECIAL] Eyes of Medusa (Julian Konzern · Gravity Destroyer AD145WD)](./13%20case%20study.md#case-1262)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: r_field 420px / drain 1.85× / duration 4000ms / 180eu/trapped-bey  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 80 · Stamina 90 · Speed 0  
**Mechanism**: 8 gravity pillars (one per Gravity FW arm) at 45° spacing. r_inner=80px (safe zone), r_outer_field=350–420px. BeySpirit amplifier k_medusa=0.65 → g_eff=16.19 m/s². Trapped beys: dω/dt × 1.65 (drain mult). Escape condition: v_tip=r_tip×ω > 3.5 m/s. QTE: hold D+W → release at centre. powerCost 80, cooldown 9000ms. **Anime override**: sustains field radius beyond physical pressure gradient limits.  
**2.5D Rendering**: 8-pillar gravity cage; drain particles on trapped beys  
**Gimmick**: eyesOfMedusa(qteHit, hitQuality) → fieldRadius, spinDrainMult, duration, eu  
**Special Move**: Eyes of Medusa · powerCost 80 · animeOverride true  
**Compatible beys**: GIMMICK-RESTRICTED — Gravity FW Counter Mode dual-spin required; others: r_field/2, drain ≤1.20×  
**Engine Note**: fieldRadius 280/350/420px; drainMult 1.45/1.65/1.85×; duration 2500/4000ms; escape v_tip≥3.5m/s; powerCost 80; cooldown 9000ms

---

### [Case 1263 — [COMBO] Stone Gaze (↓ J K)](./13%20case%20study.md#case-1263)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: highSpin bonus: additional −8 spinDelta (spin>600 rad/s)  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 45 · Stamina 55 · Speed 20  
**Mechanism**: Press centre → Counter Mode blade tap (spin drain contact) → sustain field hold. spinDelta −20 (−28 high-spin), dmgMult 1.15×, lockMs 200. Free cost, stamina type.  
**2.5D Rendering**: Gravity-press energy contact  
**Gimmick**: comboDetect(seq=[down,attack,defense], window=600ms); highSpin extraDrain −8  
**Engine Note**: spinDelta −20(−28 highSpin), dmgMult 1.15×, lockMs 200; cost 0; stamina combo

---

### [Case 1264 — [GIMMICK] Triumph Tempest Dragon Charge Metal 1A — Spring-Loaded Pop-Out Blade Deployment Analysis](./13%20case%20study.md#case-1264)

**System**: Gen2-BX / BX-System · Attack  
**Geometry**: r_retracted = 4.1 cm · r_deployed = 4.7 cm · x_ext = 0.6 cm · k_spring = 850 N/m  
**Material**: ABS Tempest Ring + hidden blades · COR_metal_deployed = 0.72 · Charge Metal tip μ=0.045  
**Spin Coupling**: rigid  
**Contact Points**: J_total = J_bounce + J_snap = 0.155 + 0.060 = 0.215 N·s · v_recoil = 7.17 m/s  
**Movement Freedom**: spring-latch; blade extends +0.6cm on trigger force ≥15N  
**Base Stats**: Attack 90 · Defense 10 · Stamina 25 · Speed 80  
**Mechanism**: m=36.0g, I=3.285×10⁻⁵ kg·m², ω₀=720 rad/s. E_spring=0.0153J, F_trigger=15N, Δt_deploy=12ms. Δv_tip=ω×Δr=4.32m/s → J_snap=0.060 N·s. Stage 1: J_bounce=0.155 N·s (COR=0.72). Total: J=0.215 N·s → v_recoil=7.17m/s. Δω_self=−303 rad/s (42% spin cost). dω/dt_CM=−19.2 rad/s², t_stable=22.5s.  
**2.5D Rendering**: Blade-snap visual + double-impact flash  
**Gimmick**: tempestDragonBladeSnap(ω, v_in, m_opp) → J_spring, J_snap, J_total, v_recoil, dOmega_self  
**Engine Note**: springEnergy 0.0153J; J_snap 0.060 N·s; J_total 0.215 N·s; v_recoil 7.17m/s; Δω_self −303 rad/s; Charge Metal dω/dt −19.2 rad/s²

---

### [Case 1265 — [SPECIAL] Extreme Recoil / Double Bound (Dante Koryu · Triumph Tempest Dragon Charge Metal 1A)](./13%20case%20study.md#case-1265)

**System**: Gen2-BX / BX-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: v_recoil 8.40m/s / spinDelta_opp −75 / burst mult 2.55× / 900eu; self Δω −200 rad/s  
**Movement Freedom**: —  
**Base Stats**: Attack 95 · Defense 0 · Stamina 10 · Speed 85  
**Mechanism**: Stage 1: COR bounce (J_bounce=0.155 N·s). Stage 2: blade-snap kick (J_snap, BeySpirit). QTE: hold J through contact → tap J within 180ms snap window. Perfect: v_recoil=8.40m/s, spin −75, burst 2.55×, 900eu. Hit: 7.17m/s, −60, 2.10×, 600eu. Miss: stage 1 only 4.90m/s, −35, 1.45×, 200eu. BeySpirit absorbs 45% of self spin cost (Δω −167 hit / −200 perfect). powerCost 85, cooldown 8000ms. **Anime override**: self spin-loss partially recovered via BeySpirit.  
**2.5D Rendering**: Double-impact flash; opponent launch arc  
**Gimmick**: extremeRecoil(qteHit, hitQuality) → v_recoil, spinDelta, burstMult, eu  
**Special Move**: Extreme Recoil / Double Bound · powerCost 85 · animeOverride true  
**Compatible beys**: GIMMICK-RESTRICTED — spring-latch retractable blade mechanism required; without: stage 1 only (v_recoil ≤5.0m/s, burst ≤1.5×)  
**Engine Note**: stage2SnapActive on QTE; perfect: v=8.40m/s/burst 2.55×; hit: 7.17m/s/2.10×; miss: 4.90m/s/1.45×; powerCost 85; cooldown 8000ms

---

### [Case 1266 — [COMBO] Blade Snap (J → J)](./13%20case%20study.md#case-1266)

**System**: Gen2-BX / BX-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: highSpin bonus: dmgMult 1.45× (spin>650 rad/s)  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 5 · Stamina 10 · Speed 60  
**Mechanism**: Two-stage blade contact: first J plants tip → lateral sweep → second J follow-through on deployed blade face. spinDelta −22, dmgMult 1.38× (1.45× high-spin), lockMs 60. Cost 15, attack type.  
**2.5D Rendering**: Two-stage blade contact flash  
**Gimmick**: comboDetect(seq=[attack,right,attack], window=600ms); highSpin dmgMult 1.45×  
**Engine Note**: spinDelta −22, dmgMult 1.38×(+1.45× highSpin), lockMs 60; cost 15; attack combo

---

### [Case 1267 — [GIMMICK] Scythe Kronos T125EDS — T125 Debris-Vortex Generation and EDS Endurance Platform](./13%20case%20study.md#case-1267)

**System**: Gen2-MFB / HWS · Stamina/AoE  
**Geometry**: n_prongs = 3 · r_prong = 2.5 cm · f_vortex = 306 Hz · v_eject_BS = 32.0 m/s (BeySpirit, r=5cm)  
**Material**: Zinc alloy Scythe FW · EDS: inner sharp tip μ=0.015 + outer free-spinning ring  
**Spin Coupling**: EDS free-spinning ring: lateral contacts absorbed without angular loss  
**Contact Points**: KE_frag = 0.512 J each (at v=32.0m/s); N_fragments = 10–14/volley; total KE ≈ 5.1–7.2 J  
**Movement Freedom**: inner sharp tip: minimal drift; outer EDS ring: isolates body from wall contacts  
**Base Stats**: Attack 20 · Defense 40 · Stamina 95 · Speed 30  
**Mechanism**: m=42.5g, I=4.227×10⁻⁵ kg·m², ω₀=640 rad/s. T125 prongs: f_vortex=306Hz, v_tip=16.0m/s physical (32.0m/s BeySpirit at r_BS=5cm). KE_frag=0.512J/fragment, 10–14/volley. EDS inner sharp tip: dω/dt=−0.148 rad/s², t_stable=2595s. Outer free-ring: absorbs lateral contacts, isolates hub spin.  
**2.5D Rendering**: Debris vortex ring; EDS ring glow  
**Gimmick**: scytheKronosVortex(ω, r_pickup, n_frags) → f_vortex, v_eject, KE_total, t_stable  
**Engine Note**: vortexFreq 306Hz; KE_frag 0.512J; EDS dω/dt −0.148 rad/s²; t_stable 2595s

---

### [Case 1268 — [SPECIAL] Exploding Fist (Aguma · Scythe Kronos T125EDS)](./13%20case%20study.md#case-1268)

**System**: Gen2-MFB / HWS · Special Move (AoE ring)  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: 11–12 fragments / r=280px / 85eu/frag ≈ 980eu total; spinDelta −8/fragment  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 35 · Stamina 70 · Speed 20  
**Mechanism**: Death BitBeast channels BeySpirit into T125 prongs → ring of debris expelled simultaneously. Fragments equally spaced at Δθ=360°/N; t_flight ≈ 1.6ms (effectively instant). Hit: 7–9 frags/230px/75eu ≈ 600eu. Miss: 3–4/160px/65eu ≈ 240eu. QTE: hold J → release at peak debris density. powerCost 70, cooldown 7000ms.  
**2.5D Rendering**: Ring of debris columns at r=ring radius  
**Gimmick**: explodingFist(qteHit, hitQuality) → fragments, ringRadius, euPerFrag, spinDeltaOpp  
**Special Move**: Exploding Fist · powerCost 70 · animeOverride true (BeySpirit vortex amplification)  
**Compatible beys**: Any bey with ≥3 outward prongs/flanges at height ≥1cm; T125, DF145, LW105, multi-prong tracks  
**Engine Note**: AoE ring; fragments 3/7/12; ringRadius 160/230/280px; euPerFrag 65/75/85; spinDelta −8/frag; powerCost 70; cooldown 7000ms

---

### [Case 1269 — [COMBO] Debris Scatter (↑ K J)](./13%20case%20study.md#case-1269)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: single concentrated debris fragment ejection  
**Movement Freedom**: —  
**Base Stats**: Attack 30 · Defense 30 · Stamina 45 · Speed 35  
**Mechanism**: Advance + prong guard intercept + single debris ejection. spinDelta −15, dmgMult 1.22×, lockMs 80. Free cost, universal type.  
**2.5D Rendering**: Single debris flash on J  
**Gimmick**: comboDetect(seq=[up,defense,attack], window=600ms)  
**Engine Note**: spinDelta −15, dmgMult 1.22×, lockMs 80; cost 0; universal combo

---

### [Case 1270 — [GIMMICK] Scythe Kronos T125EDS — Scythe FW Asymmetric Arm and Great Ring Energy Discharge Model](./13%20case%20study.md#case-1270)

**System**: Gen2-MFB / HWS · AoE Energy  
**Geometry**: m_arm = 18g · r_tip = 4.2 cm · v_arm_tip = 26.88 m/s · KE_arm = 6.50 J · f_arm = 102 Hz  
**Material**: Zinc alloy dominant arm · Death BitBeast BeySpirit  
**Spin Coupling**: rigid  
**Contact Points**: E_ring = 0.75 × KE_total × degradationFactor = 6.49J (use 1) → 2.60J (use 4)  
**Movement Freedom**: full-arena radial slash  
**Base Stats**: Attack 25 · Defense 40 · Stamina 80 · Speed 30  
**Mechanism**: Single dominant arm (18g, r=4.2cm), v_tip=26.88m/s, KE_arm=6.50J, f_arm=102Hz (dense slash carpet). KE_total=8.657J. Death traces arm path as 360° energy ring: E_ring=0.75×KE_total=6.49J. Degradation per use: ×(1−0.20×(n−1)), floor 0.40. Use 1: 6.49J → Use 4: 2.60J.  
**2.5D Rendering**: Full-arena radial ring slash from scythe arm  
**Gimmick**: greatRingEnergyModel(ω, useCount) → KE_total, E_ring, degradationFactor  
**Engine Note**: f_arm 102Hz; E_ring 6.49J use-1; degradation 20%/use; floor 40%

---

### [Case 1271 — [SPECIAL] Great Ring of Destruction (Aguma · Scythe Kronos T125EDS)](./13%20case%20study.md#case-1271)

**System**: Gen2-MFB / HWS · Special Move (Full-Arena AoE)  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect use-1: r=560px / dmgMult 2.10× / spinDelta −100 / 1600eu  
**Movement Freedom**: —  
**Base Stats**: Attack 30 · Defense 45 · Stamina 85 · Speed 25  
**Mechanism**: Death BitBeast releases accumulated KE as radial dark-purple discharge. Degradation: each use reduces power by 20% (floor 40%). Perfect hit: r=560px, 2.10×, −100, 1600eu (use 1); degrades to ~1.08× floor at use 3+. QTE: hold D+J → release at peak aura. powerCost 120, cooldown 12000ms. Δω_self −48 (BeySpirit 60% recovery). **Anime override**: full-arena radius + multi-bey simultaneous KO.  
**2.5D Rendering**: Full-arena radial ring expansion; degrading intensity per use  
**Gimmick**: greatRingOfDestruction(qteHit, hitQuality, useCount) → fieldRadius, dmgMult, spinDelta, eu  
**Special Move**: Great Ring of Destruction · powerCost 120 · animeOverride true  
**Compatible beys**: GIMMICK-RESTRICTED — Death BitBeast + single large asymmetric arm required; others: r_field ≤280px, dmgMult ≤1.45×  
**Engine Note**: fullArenaAoE; degradation 20%/use; perfect use-1: 560px/2.10×/−100/1600eu; powerCost 120; cooldown 12000ms

---

### [Case 1272 — [COMBO] Death Reap (↑ J K)](./13%20case%20study.md#case-1272)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: highSpin bonus: dmgMult 1.48× (spin>550 rad/s)  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 20 · Stamina 30 · Speed 45  
**Mechanism**: Advance + scythe-arm slash at r_tip=4.2cm + arc follow-through hold. spinDelta −25, dmgMult 1.40× (1.48× high-spin), lockMs 150. Cost 15, attack type.  
**2.5D Rendering**: Scythe-arm sweep trail  
**Gimmick**: comboDetect(seq=[up,attack,defense], window=600ms); highSpin dmgMult 1.48×  
**Engine Note**: spinDelta −25, dmgMult 1.40×(+1.48× highSpin), lockMs 150; cost 15; attack combo

---

### [Case 1273 — [GIMMICK] Alter Cognite 6Meteor Trans — Ultra Stamina Mode Rim-Riding Physics](./13%20case%20study.md#case-1273)

**System**: Gen2-Burst / Turbo-System · Stamina  
**Geometry**: r_trans_rubber = 0.9 cm · θ_rim = 78° · r_CoM_h = 0.811 cm · C_rim = 141.4 cm  
**Material**: Trans rubber ring μ=0.10; inner ratchet spring (4-mode: Attack/Defense/Stamina/Trans)  
**Spin Coupling**: Trans tip mode-switch: rubber ring (high spin) / internal ratchet to Ultra Stamina  
**Contact Points**: rim: dω/dt_rim = −10.4 rad/s² · t_rim = 33.5 s · v_rim = 1.3 mm/s  
**Movement Freedom**: rim-riding: bey tilts to 78°, walks along stadium edge at ~1.3mm/s  
**Base Stats**: Attack 5 · Defense 30 · Stamina 98 · Speed 10  
**Mechanism**: m=35.0g, I=2.958×10⁻⁵ kg·m², ω₀=580 rad/s. Ultra Stamina Mode: Trans rubber ring grips stadium rim at θ=78°. Ω_prec=0.162 rad/s, v_rim=1.3mm/s, t_orbit=1079s (18min). dω/dt_rim=−10.4 rad/s², t_rim=33.5s endurance. Near-stationary from opponent perspective; minimal spin loss while opponent degrades.  
**2.5D Rendering**: Tilted bey silhouette creeping along stadium rim  
**Gimmick**: rimRidingPhysics(ω) → Ω_prec, v_rim, t_orbit, spinDecayRate, t_rim_endurance  
**Engine Note**: rimAngle 78°; v_rim 1.3mm/s; dω/dt_rim −10.4 rad/s²; t_rim 33.5s; Trans tip mode-switch at ω_t (internal ratchet)

---

### [Case 1274 — [SPECIAL] Eternity Launch / Slide-Off Shoot (Cuza Ackermann · Alter Cognite 6Meteor Trans)](./13%20case%20study.md#case-1274)

**System**: Gen2-Burst / Turbo-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: 5000ms rim / slide-off dmgMult 1.35× / spinDelta −30 / 500eu  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 30 · Stamina 98 · Speed 15  
**Mechanism**: QTE: hold W → press K at wall contact → mount rim. Hit: 5000ms rim, spin immune, slide-off 1.20×/−18/300eu. Perfect: slide-off 1.35×/−30/500eu. J exit: spring-off wall 400eu dash. Slide-off triggered when opponent spin < 40% ω₀; exit drop v=0.885m/s, v_combined≈4.5m/s. powerCost 60, cooldown 9000ms. **Anime override**: BeySpirit extends rim endurance to 5000ms (physical 33.5s, no override needed but spin held above floor).  
**2.5D Rendering**: Tilted rim stance + slide-off descend flash  
**Gimmick**: eternityLaunch(qteHit, hitQuality, opponentSpinFraction) → rimMounted, endurance, slideOff stats  
**Special Move**: Eternity Launch · powerCost 60 · animeOverride true  
**Compatible beys**: Rubber outer ring tip (Eternal, EDS, Orbit, bearing, Trans); tall track/disc clearing rim height  
**Engine Note**: rimDuration 5000ms; spinImmune true; slideOffDmgMult 1.20/1.35×; slideOffSpin −18/−30; powerCost 60; cooldown 9000ms

---

### [Case 1275 — [COMBO] Slide Counter (↑ J ↓)](./13%20case%20study.md#case-1275)

**System**: Gen2-Burst / Turbo-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: wallProximity bonus: dmgMult ×1.10  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 25 · Stamina 55 · Speed 30  
**Mechanism**: Ascend to wall → height-advantage strike → controlled descent. spinDelta −16, dmgMult 1.25× (×1.375 near-wall), lockMs 80. Free cost, stamina type.  
**2.5D Rendering**: Height-advantage drop flash  
**Gimmick**: comboDetect(seq=[up,attack,down], window=600ms); wallProximity dmgMult ×1.10  
**Engine Note**: spinDelta −16, dmgMult 1.25×(×1.375 nearWall), lockMs 80; cost 0; stamina combo

---

### [Case 1276 — [GIMMICK] Archer Hercules 13 Eternal — Shield Retraction and Angular Momentum Spin-Up Analysis](./13%20case%20study.md#case-1276)

**System**: Gen2-Burst / SuperKing-System · Stamina  
**Geometry**: r_ext = 4.0 cm · r_ret = 3.2 cm · r_inner = 1.2 cm · ω₀ = 600 rad/s  
**Material**: ABS retractable shield · Eternal inner sharp tip μ=0.012 · COR_Eternal_ring = 0.80  
**Spin Coupling**: I_ext = 3.009×10⁻⁵ kg·m² → I_ret = 2.015×10⁻⁵ (angular momentum conserved)  
**Contact Points**: ω_ret = 896 rad/s (figure-skater boost 1.493×) · t_stable_ret = 3254s ≈ 54 min · J_return = 0.063 N·s  
**Movement Freedom**: Eternal free-ring: elastic intermediate (COR=0.80) for all contacts  
**Base Stats**: Attack 5 · Defense 60 · Stamina 98 · Speed 10  
**Mechanism**: m=34.5g. Shield retraction (r_ext→r_ret): L conserved → ω_ret=896 rad/s (+49.3%). W_spring=2.672J (BeySpirit provides). dω/dt_ret=−0.2017 rad/s², t_stable=3254s. Eternal ring COR=0.80 → J_return=0.0634 N·s, v_return=2.11 m/s per contact.  
**2.5D Rendering**: Shield retract animation; spin boost flash; Eternal ring glow  
**Gimmick**: archerHerculesShieldRetract(ω_ext) → I_ext, I_ret, ω_ret, spinBoostRatio, W_spring, t_stable  
**Engine Note**: shieldRetract I_ext→I_ret; ω_boost 1.493×; W_spring 2.672J; dω/dt_ret −0.2017 rad/s²; t_stable 3254s

---

### [Case 1277 — [SPECIAL] Endless Spin (Hae-jin Oh · Archer Hercules 13 Eternal)](./13%20case%20study.md#case-1277)

**System**: Gen2-Burst / SuperKing-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: spinBoost 1.49× / returnDmgMult 1.38× / duration 5000ms / +spin +294 / 600eu  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 65 · Stamina 98 · Speed 10  
**Mechanism**: BeySpirit activates spring-retraction → shield collapses (r_ext→r_ret), +49% spin. Eternal free-ring becomes primary contact surface: every hit returned at 2.11 m/s. Active 5000ms. QTE: hold K → double-tap J. Perfect: boost 1.49×, return 1.38×, +spin +294, 600eu activation, +80eu/contact. powerCost 70, cooldown 8000ms. **Anime override**: BeySpirit provides spring energy W=2.672J.  
**2.5D Rendering**: Shield-retract flash + Eternal ring glow during active window  
**Gimmick**: endlessSpin(qteHit, hitQuality) → spinBoostMult, returnDmgMult, duration, spinDelta_self, eu  
**Special Move**: Endless Spin · powerCost 70 · animeOverride true  
**Compatible beys**: Retractable/mode-change layer (I_ret/I_ext ≤ 0.75) + free-spinning outer tip (Eternal, EDS, bearing COR≥0.70)  
**Engine Note**: spinBoost 1.15/1.35/1.49×; returnDmgMult 1.10/1.25/1.38×; duration 2500/5000ms; euPerContact 80; powerCost 70; cooldown 8000ms

---

### [Case 1278 — [COMBO] Spin Shield (K ↑ J)](./13%20case%20study.md#case-1278)

**System**: Gen2-Burst / SuperKing-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: shieldHit bonus: dmgMult 1.40× if K phase made contact  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 55 · Stamina 40 · Speed 25  
**Mechanism**: Extended shield brace → pivot → counter-thrust releasing partially-loaded spring. spinDelta −18, dmgMult 1.32× (1.40× if shield hit), lockMs 90. Cost 15, defense type.  
**2.5D Rendering**: Shield compress + pivot + thrust flash  
**Gimmick**: comboDetect(seq=[defense,up,attack], window=600ms); shieldHit dmgMult 1.40×  
**Engine Note**: spinDelta −18, dmgMult 1.32×(+1.40× shieldHit), lockMs 90; cost 15; defense combo

---

### [Case 1316 — T125 (Tornado 125): 1.7 g — Four Curved Swept-Blade Fins at Downward Pitch; Downforce Negligible; Equivalent Performance to D125](./9%20case%20study.md#case-1316)

**System**: MFB (Metal Fight Beyblade) — Spin Track  
**Geometry**: 1.7 g; height_cm: 1.25; cylinder r_body ≈ 0.7 cm; 4 curved swept-blade fins shaped like circular arrows (↻) — each blade sweeps ~40° arc; fins span r_inner: 0.5 cm → r_outer: 1.1 cm; z_base: ~0.8 cm (mid-cylinder), z_top: 1.25 cm (top of cylinder); fins pitched at tiltAngle_deg: −8 (tips angled slightly downward = "tornado/downforce" intent when spinning); foldSymmetry: 4  
**Material**: ABS  
**Spin Coupling**: rigid — track is fixed to beyblade shaft  
**Contact Points**: Fin tips at r=1.1 cm, z=0.8–1.25 cm. Contact only when opponent's part zone overlaps this height band. ABS, dmgMult 0.4 (small fins, weak contact). Fins do NOT reach opponent's Fusion Wheel (FW is above the track at z=1.25+ cm).  
**Movement Freedom**: fixed — no moving parts; fin pitch is geometry-baked at manufacture  
**Base Stats**: Attack: low; Defense: low; Stamina: low (I_track ≈ 4.2×10⁻⁸ kg·m² — negligible vs wheel I); Speed: dependent on tip  
**Mechanism**: 4 curved fins pitched slightly downward generate theoretical downforce when spinning (F_aero ≈ 0.00128 N = 0.28% of gravitational normal force at ω₀=600 rad/s) — negligible in practice. T125 performs identically to D125 (same height, no aerodynamic benefit). Slightly heavier than D125 (+0.1 g from fin material). The swept-blade "tornado" shape is decorative/branding; fins are passive mass distributors, not active aerodynamic devices.  
**2.5D Rendering**: z-stack: cylinder at z=0–1.25 cm; 4 curved blade fins at z=0.8–1.25 cm. In 2.5D perspective: the near-side blade appears at fuller arc width; the 3 far-side blades appear more compressed. The swept-arc shape (↻) creates a subtly dynamic-looking silhouette even when static. No gimmick-state silhouette change.  
**Gimmick**: No mechanic derived — downforce is aerodynamically negligible. WingDef present for rendering/mass only.  
**Engine Note**: height=1.25cm; mass=1.7g; WingDef: {count:4, spacingDeg:90, shape:"arc", r_inner_cm:0.5, r_outer_cm:1.1, z_base_cm:0.8, z_top_cm:1.25, arcWidth_deg:40, tiltAngle_deg:−8, movementType:"fixed"}; NO mechanic (downforce_negligible); equivalent to D125 in all game mechanics; I_track=4.2e-8 kg·m²; foldSymmetry:4.  
**Note**: Case 1525 (Grand Cetus) describes "T125 triple-wing" — this is a CS13-session naming discrepancy; the part physically has **4 fins** per Case 1316 and Case 1423. Treat as 4-fin for all engine/WingDef purposes.

---

### [Case 1340 — [GIMMICK] Vex Lucifer Mobius 2D — 2D Rubber-Blade Centrifugal Perimeter](./13%20case%20study.md#case-1340)

**System**: Gen2-Burst / DB-System · Defense/Stamina  
**Geometry**: r_pivot = 1.3 cm · r_ext = 3.1 cm · n_blades = 4 · ω_deploy = 194 rad/s (1850 rpm)  
**Material**: Rubber blades (Shore A 60 → A 28 BeySpirit) · COR_normal = 0.28 · COR_BeySpirit = 0.72  
**Spin Coupling**: Mobius driver ±0.4mm float under lateral force  
**Contact Points**: ΔI_deployed = 4.75×10⁻⁶ kg·m² · I_total_deployed ≈ 2.25×10⁻⁵ kg·m² · dω/dt = −2.36 rad/s²  
**Movement Freedom**: Mobius dual-mode (inner point + outer rubber ring)  
**Base Stats**: Attack 10 · Defense 75 · Stamina 85 · Speed 20  
**Mechanism**: m=34.0g. 4 rubber blades on spring-pivot arms at r_pivot=1.3cm; deploy at ω≥194 rad/s to r_ext=3.1cm. ΔI=4.75×10⁻⁶ kg·m². COR_rubber=0.28 → 72% energy absorbed as elastic strain, rebounds radially outward. Vex Ring channels recoil symmetrically regardless of contact angle. dω/dt=−2.36 rad/s² (high stamina). BeySpirit: blades extend to r=3.3cm, COR→0.72, near-elastic return.  
**2.5D Rendering**: z_cm ≈ 1.5 · blade-deploy flash at ω_deploy; rubber-glow on contact  
**Gimmick**: bladesDeploy(ω); COR 0.28→0.72 BeySpirit; Vex Ring radial channeling; ΔI 4.75×10⁻⁶  
**Engine Note**: deployThreshold 194 rad/s; r_ext 3.1cm; ΔI 4.75e-6; COR_normal 0.28; dω/dt −2.36 rad/s²

---

### [Case 1341 — [SPECIAL] Vexing Wall / Variant Wall (Lain Valhalla · Vex Lucifer Mobius 2D)](./13%20case%20study.md#case-1341)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: spinDelta −20 / dmgMult 1.42× / lockMs 140; J_repulsion = 0.105 N·s  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 80 · Stamina 85 · Speed 15  
**Mechanism**: BeySpirit extends blades to r_BS=3.3cm, drops rubber Shore A 60→28, COR 0.28→0.72. J_repulsion=(1+0.72)×0.034×1.8=0.105 N·s, F_peak≈26N. Zero net spin absorption (elastic return); radially outward knockback. QTE: hold K → tap J at contact (220ms window). powerCost 80. **Anime override**: spring preload ceiling overridden; COR jump 0.28→0.72.  
**2.5D Rendering**: Rubber blade glow + radial repulsion burst  
**Gimmick**: vexingWall(qteHit, hitQuality) → spinDelta, dmgMult, lockMs  
**Special Move**: Vexing Wall · powerCost 80 · animeOverride true  
**Compatible beys**: Rubber-blade or rubber-perimeter chassis (COR≥0.65) + force-channelling outer ring (Vex Ring type)  
**Engine Note**: J_repulsion 0.105 N·s; perfect: spin −20/dmg 1.42×/lock 140ms; hit: −14/1.35×/110ms; powerCost 80

---

### [Case 1342 — [COMBO] Rubber Recoil (K → → J)](./13%20case%20study.md#case-1342)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: kContact bonus: spinDelta −13 / dmgMult 1.38× / lockMs 130  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 55 · Stamina 50 · Speed 30  
**Mechanism**: Rubber perimeter brace → lateral reposition → accumulated spring energy thrust. kContact: spinDelta −13, dmgMult 1.38×, lockMs 130. No contact: −6, 1.12×, 50ms. Cost 15, defense type.  
**2.5D Rendering**: Guard-recoil flash + lateral dash  
**Gimmick**: comboDetect(seq=[defense,right,attack], window=600ms); kContact bonus  
**Engine Note**: spinDelta −13(kContact)/−6, dmgMult 1.38×/1.12×, lockMs 130/50; cost 15; defense combo

---

### [Case 1343 — [GIMMICK] Storm Pegasus 105RF — RF Friction-Heat Vacuum Engine](./13%20case%20study.md#case-1343)

**System**: Gen2-MFB / HWS · Attack  
**Geometry**: r_tip = 0.5 cm · A_contact ≈ 251 mm² · r_wheel = 1.9 cm  
**Material**: RF rubber flat · μ_k = 0.85 (cold) → 0.95 (heated at ΔT=+15°C)  
**Spin Coupling**: rigid  
**Contact Points**: Q_dot = 0.714 W at ω=600 rad/s · ΔP_vortex = 78 Pa (sub-ambient) · v_lateral = 1.2 m/s  
**Movement Freedom**: aggressive stochastic: 1.2 m/s lateral max  
**Base Stats**: Attack 85 · Defense 5 · Stamina 30 · Speed 90  
**Mechanism**: m=28.5g, I=1.62×10⁻⁵ kg·m². RF rubber annulus r_tip=5mm generates heat at Q_dot=0.714W → μ rises 0.85→0.95 (positive feedback). Centrifugal fan: ΔP=78Pa (sub-ambient), updraft disturbs opponent trajectory. dω/dt=−8.2 rad/s² (heated rubber). BeySpirit: ΔP→312Pa, v_up=23m/s, negates trajectory manipulation.  
**2.5D Rendering**: z_cm ≈ 0 · friction heat sparks; vacuum updraft  
**Gimmick**: rfFrictionHeat(ω) → Q_dot, ΔP_vortex, v_lateral; BeySpirit override ΔP×4  
**Engine Note**: μ_heated 0.95; Q_dot 0.714W; ΔP 78Pa (physical) / 312Pa (BeySpirit); dω/dt −8.2 rad/s²

---

### [Case 1344 — [SPECIAL] Full Power v1 (Gingka Hagane · Storm Pegasus 105RF)](./13%20case%20study.md#case-1344)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge QTE: spinDelta −25 / dmgMult 1.45× / lockMs 80 / vacuumActive true  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 0 · Stamina 20 · Speed 92  
**Mechanism**: BeySpirit overrides μ_k ceiling → ΔP×4=312Pa, v_up=23m/s updraft. Vacuum zone traps opponent (negates trajectory manipulation). QTE: hold J ≥600ms + release. chargeRatio r=chargeMs/600: spinDelta=−25r, dmgMult=1.28+0.17r, lockMs=80r; vacuum active at r≥0.8. powerCost 90. **Anime override**: μ_k>1.0 + updraft 23m/s.  
**2.5D Rendering**: Vacuum updraft visual; friction heat glow  
**Gimmick**: fullPowerV1(chargeMs, qteHit) → spinDelta, dmgMult, lockMs, vacuumActive  
**Special Move**: Full Power (RF) · powerCost 90 · animeOverride true  
**Compatible beys**: RF / WRF / RSF or equivalent rubber-flat with contact area ≥150mm²  
**Engine Note**: chargeRatio scale; vacuum at r≥0.8; max: spin −25/dmg 1.45×/lock 80ms; powerCost 90

---

### [Case 1345 — [COMBO] Friction Blitz (J J →)](./13%20case%20study.md#case-1345)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: firstHit bonus: spinDelta −22 / dmgMult 1.44× / lockMs 65  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 0 · Stamina 20 · Speed 80  
**Mechanism**: Initial RF charge strike → main rubber-heat burst → exit dash. firstHit: −22, 1.44×, 65ms. No firstHit: −12, 1.28×, 30ms. Cost 25, attack type.  
**2.5D Rendering**: RF heat spark + double impact  
**Gimmick**: comboDetect(seq=[attack,attack,right], window=600ms); firstHit bonus  
**Engine Note**: spinDelta −22/−12, dmgMult 1.44×/1.28×, lockMs 65/30; cost 25; attack combo

---

### [Case 1346 — [GIMMICK] Cosmic Pegasus F:D — F:D Spin-Sacrifice Drive](./13%20case%20study.md#case-1346)

**System**: Gen2-MFB / HWS · Attack/Stamina  
**Geometry**: r_outer_A = 0.9 cm · r_inner_B = 0.15 cm · ω_t = 354 rad/s (3380 rpm) · Δω_transient = +12 rad/s  
**Material**: F:D rubber outer ring μ=0.80 (Mode A) / inner sharp μ=0.12 (Mode B)  
**Spin Coupling**: centrifugally-governed spring sleeve switches Mode A↔B at ω_t  
**Contact Points**: Mode A: dω/dt ≈ −15 rad/s²; Mode B: dω/dt ≈ −2.3 rad/s²; transient Δv≈+0.55 m/s at transition  
**Movement Freedom**: Mode A: aggressive rubber flat; Mode B: stable sharp-pin orbit  
**Base Stats**: Attack 70 · Defense 15 · Stamina 65 · Speed 75  
**Mechanism**: m=29.6g, I=1.80×10⁻⁵ kg·m². m_sleeve=0.8g, r_sleeve=3.2mm, F_spring=0.32N → ω_t=354 rad/s. Mode A→Mode B crossing: contact area 201mm²→19mm², friction drop → transient Δω=+12 rad/s physical / +180 rad/s BeySpirit. "Sacrifice spin for power" = deliberate Mode A overrun + BeySpirit-amplified transition surge.  
**2.5D Rendering**: Mode A rubber glow; Mode B sharp-point contact; transition flash  
**Gimmick**: F:D modeSwitchAt(ω_t=354 rad/s); transient Δω +12 (physical) / +180 (BeySpirit)  
**Engine Note**: modeTransitionAt 354 rad/s; Δω_transient +12 rad/s (physical); Mode A dω/dt −15; Mode B dω/dt −2.3

---

### [Case 1347 — [SPECIAL] Full Power v2 (Gingka Hagane · Cosmic Pegasus F:D)](./13%20case%20study.md#case-1347)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: heavy sacrifice+perfect: spinDelta −31 / dmgMult 1.46× / lockMs 108  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 10 · Stamina 55 · Speed 80  
**Mechanism**: Run Mode A (sacrifice spin), tap K to manage decay, tap J at F:D transition firing. BeySpirit: Δω_BS=+180 rad/s at transition vs physical +12. spinDelta=−(12+28×sac), dmgMult≤1.46×, lockMs up to 140. QTE window 180ms around spin crossing ω_t. powerCost 85. **Anime override**: spin surplus injected at transition (+180 vs +12 rad/s).  
**2.5D Rendering**: Mode A sacrifice + transition flash burst  
**Gimmick**: fullPowerV2(qteHit, hitQuality, spinRatio) → spinDelta, dmgMult, lockMs  
**Special Move**: Full Power (F:D) · powerCost 85 · animeOverride true  
**Compatible beys**: F:D / Final Drive or equivalent Mode A/B spring-governed transition tip  
**Engine Note**: modeTransition at ω_t; BeySpirit Δω +180; spinSacrifice scales output; powerCost 85

---

### [Case 1348 — [COMBO] Drive Surge (J K J)](./13%20case%20study.md#case-1348)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinRatio scales: heavy sac (spinRatio≤0.40) → spinDelta −28, dmgMult 1.46×, lockMs 100  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 15 · Stamina 45 · Speed 70  
**Mechanism**: Mode A strike → Mode B transition guard → transition-burst follow-through. Scales with spinSacrifice: sac=0.60→spinDelta −23/dmg 1.33×/lock 85ms; sac=0.40→−28/1.46×/100ms. Cost 25, attack type.  
**2.5D Rendering**: Mode-switch flash on K beat  
**Gimmick**: comboDetect(seq=[attack,defense,attack], window=600ms); spinSacrifice scaling  
**Engine Note**: spinDelta −18 to −28, dmgMult 1.28 to 1.46×, lockMs 70–100; cost 25; attack combo

---

### [Case 1349 — [GIMMICK] Torch Pegasus — Toroidal Fire-Vortex Ring](./13%20case%20study.md#case-1349)

**System**: Gen2-MFB / HWS · Attack (Fire Element)  
**Geometry**: r_AR = 1.8 cm · c_blade = 0.9 cm · CL = 1.2 · Γ = 0.058 m²/s (physical) / 0.18 m²/s (BeySpirit)  
**Material**: Torch Pegasus AR fire-element swept blades  
**Spin Coupling**: rigid  
**Contact Points**: v_ring_phys = 0.80 m/s · v_ring_BS = 2.4 m/s; upper-attack pressure from above  
**Movement Freedom**: ring propagates toward opponent  
**Base Stats**: Attack 70 · Defense 5 · Stamina 30 · Speed 65  
**Mechanism**: m=29.4g, I=1.75×10⁻⁵ kg·m². 4 swept blades generate toroidal vortex ring: Γ=0.058 m²/s → v_ring=0.80 m/s physical. Fire element: thermal expansion +30% circulation. BeySpirit: Γ=0.18 m²/s, v_ring=2.4 m/s. Ring expands to envelope opponent from above (upper-attack geometry). Thermal disruption reduces gyroscopic precession damping.  
**2.5D Rendering**: Fire vortex ring propagating toward opponent  
**Gimmick**: toroidalVortexRing(ω, Γ_BS) → v_ring, distributed upper-attack pressure  
**Engine Note**: Γ_physical 0.058 m²/s; Γ_BeySpirit 0.18 m²/s; v_ring 2.4 m/s; upper-attack geometry

---

### [Case 1350 — [SPECIAL] Fuerza Valiente / Flame Thunder Brave Strike (Raul · Torch Pegasus)](./13%20case%20study.md#case-1350)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: spinDelta −28 / dmgMult 1.44× / lockMs 120  
**Movement Freedom**: —  
**Base Stats**: Attack 70 · Defense 0 · Stamina 25 · Speed 65  
**Mechanism**: BeySpirit channels into swept blades → Γ×3=0.18 m²/s → v_ring=2.4 m/s. Fire-vortex expands, envelops opponent from above, applies distributed upper-attack + thermal spin-stability disruption. QTE: hold J 350ms → tap K at apex. chargeRatio scale: −28 spin/1.44×/120ms at full. powerCost 85. **Anime override**: Γ×3 + thermal damping disruption.  
**2.5D Rendering**: Expanding fire-vortex ring + thermal disruption visual  
**Gimmick**: fuerzaValiente(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Fuerza Valiente · powerCost 85 · animeOverride true  
**Compatible beys**: Fire/thunder element wheel with swept upper blades r_AR≥1.6cm  
**Engine Note**: Γ_BeySpirit 0.18 m²/s; v_ring 2.4 m/s; full charge: spin −28/dmg 1.44×/lock 120ms; powerCost 85

---

### [Case 1351 — [COMBO] Vortex Fang (↓ J →)](./13%20case%20study.md#case-1351)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: jHit: spinDelta −18 / dmgMult 1.40× / lockMs 80  
**Movement Freedom**: —  
**Base Stats**: Attack 60 · Defense 0 · Stamina 20 · Speed 55  
**Mechanism**: Pull low for ground-skim vortex angle → release at opponent's base → exit right. spinDelta −18, dmgMult 1.40×, lockMs 80. Cost 25, attack type.  
**2.5D Rendering**: Low-angle vortex release flash  
**Gimmick**: comboDetect(seq=[down,attack,right], window=600ms)  
**Engine Note**: spinDelta −18, dmgMult 1.40×, lockMs 80; cost 25; attack combo

---

### [Case 1352 — [GIMMICK] Draciel F — Centrifugal Metal-Ball Barrier](./13%20case%20study.md#case-1352)

**System**: Gen1-Plastic / SGS · Defense  
**Geometry**: n_balls = 4 · r_0 = 1.4 cm · r_max = 2.1 cm · m_ball = 3.5g · ω_deploy ≥ 380 rad/s  
**Material**: Metal balls (COR ≈ 0.55) · elastic tether k_t = 0.45 N/mm  
**Spin Coupling**: rigid  
**Contact Points**: ΔI_deployed = 3.43×10⁻⁶ kg·m² · I_total ≈ 2.10×10⁻⁵ kg·m² · COR_BeySpirit ≈ 0.12 (88% absorption)  
**Movement Freedom**: balls extend centrifugally to r_max when ω≥380 rad/s  
**Base Stats**: Attack 0 · Defense 88 · Stamina 70 · Speed 0  
**Mechanism**: m≈50.6g total with Water Capes SP. 4 metal balls: ΔI=3.43×10⁻⁶ at r_max=2.1cm. COR_metal-plastic≈0.55 → 45% KE absorbed per contact. Water Capes SP: secondary outer shield distributes lateral impact. dω/dt=−5.3 rad/s² (high stamina defense). BeySpirit: balls lock at r_max at any spin, COR→0.12 (88% absorption).  
**2.5D Rendering**: z_cm ≈ 0 · metal ball protrusions; glowing barrier in Fortress Defense  
**Gimmick**: metalBallDeploy(ω); ΔI 3.43×10⁻⁶; COR 0.55→0.12 BeySpirit  
**Engine Note**: deployThreshold 380 rad/s; r_max 2.1cm; ΔI 3.43e-6; COR 0.55; dω/dt −5.3 rad/s²

---

### [Case 1353 — [SPECIAL] Fortress Defense (Max Tate · Draciel F)](./13%20case%20study.md#case-1353)

**System**: Gen1-Plastic / SGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full contact (200ms): self +8 / opp −20 / dmgMult 1.40× / lockMs 180  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 90 · Stamina 75 · Speed 0  
**Mechanism**: BeySpirit locks balls at r_max regardless of spin, drops COR 0.55→0.12 (88% absorption). QTE: hold K through opponent contact (0–200ms). contactAbsorb scale: self +4–8, opp −10–20, dmgMult 1.20–1.40×, lockMs 140–180. powerCost 75. **Anime override**: physical deploy threshold ω≥380 rad/s overridden; COR drop to 0.12 near-inelastic.  
**2.5D Rendering**: Glowing metal-ball barrier ring; absorption glow on contact  
**Gimmick**: fortressDefense(contactMs, qteHit) → selfSpin, oppSpin, dmgMult, lockMs  
**Special Move**: Fortress Defense · powerCost 75 · animeOverride true  
**Compatible beys**: BB with centrifugally-extensible mass pockets (≥4 pockets, r_max≥1.8cm) reaching opponent AR zone  
**Engine Note**: COR_BeySpirit 0.12; 88% absorption; contactScale 0–200ms; powerCost 75

---

### [Case 1354 — [COMBO] Shell Guard (↓ K K)](./13%20case%20study.md#case-1354)

**System**: Gen1-Plastic / SGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: bothKHit: spinDelta −14 / dmgMult 1.32× / lockMs 130  
**Movement Freedom**: —  
**Base Stats**: Attack 0 · Defense 70 · Stamina 55 · Speed 0  
**Mechanism**: Drop low → prime barrier → full barrier activation. bothKHit: −14, 1.32×, 130ms. Single K: −6, 1.14×, 50ms. Cost 15, defense type.  
**2.5D Rendering**: Metal-ball deploy flash on both K beats  
**Gimmick**: comboDetect(seq=[down,defense,defense], window=600ms); bothKHit bonus  
**Engine Note**: spinDelta −14/−6, dmgMult 1.32×/1.14×, lockMs 130/50; cost 15; defense combo

---

### [Case 1355 — [GIMMICK] Salvage Valtryek Shot-7 — Shot Driver Spring-Jump Uppercut](./13%20case%20study.md#case-1355)

**System**: Gen2-Burst / DB-System · Attack  
**Geometry**: k_s = 0.80 N/mm · x_0 = 4 mm · E_s = 6.4 mJ · v_z = 0.596 m/s (physical) / 1.93 m/s (BeySpirit×10) · h_max = 18 mm (physical) / 190 mm (BeySpirit)  
**Material**: ABS Shot driver coil spring  
**Spin Coupling**: rigid (7 disc provides gyroscopic stabilisation during jump)  
**Contact Points**: uppercut at h=18mm (equatorial zone, z=15–25mm); BeySpirit: h=190mm (aerial dive)  
**Movement Freedom**: vertical jump on spring release; 7 disc r=3.2cm stabilises  
**Base Stats**: Attack 80 · Defense 5 · Stamina 20 · Speed 75  
**Mechanism**: m=34.5g, I_total≈2.05×10⁻⁵ kg·m². Spring: k=0.80N/mm, x=4mm → E=6.4mJ → v_z=0.596m/s, h=18mm. Salvage Ring at h=18mm intersects opponent equatorial belt (15–25mm) for tilt-maximising contact. BeySpirit×10: E=64mJ, v_z=1.93m/s, h=190mm (aerial dive + descending blow).  
**2.5D Rendering**: Spring-jump arc + uppercut flash  
**Gimmick**: shotSpringJump(k_s, x_0, m) → v_z, h_max; BeySpirit ×10 override  
**Engine Note**: E_spring 6.4mJ; v_z 0.596m/s (physical) / 1.93m/s (BeySpirit); h_max 18mm / 190mm; equatorial contact

---

### [Case 1356 — [SPECIAL] Flying Upper / Shot Upper (Valt Aoi · Salvage Valtryek Shot-7)](./13%20case%20study.md#case-1356)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect doubleTap ≤80ms: spinDelta −30 / dmgMult 1.45× / lockMs 140  
**Movement Freedom**: —  
**Base Stats**: Attack 82 · Defense 0 · Stamina 15 · Speed 78  
**Mechanism**: BeySpirit amplifies spring ×10: E=64mJ, v_z=1.93m/s, h=190mm. Ascending contact through opponent zone + descending dive. QTE: double-tap J within 150ms. Perfect (≤80ms): −30, 1.45×, 140ms. Normal (>80ms): −20, 1.35×, 90ms. Miss: −10, 1.22×, 40ms. powerCost 80. **Anime override**: spring ×10, aerial 190mm vs physical 18mm.  
**2.5D Rendering**: Aerial arc + uppercut + dive flash  
**Gimmick**: flyingUpper(doubleTap, tapInterval) → spinDelta, dmgMult, lockMs  
**Special Move**: Flying Upper · powerCost 80 · animeOverride true  
**Compatible beys**: Spring-jump driver (Shot or equivalent, E_s≥4mJ); heavy disc r≥2.8cm for stabilisation  
**Engine Note**: BeySpirit ×10 spring; aerial h=190mm; doubleTap ≤80ms perfect: −30/1.45×/140ms; powerCost 80

---

### [Case 1357 — [COMBO] Jump Strike (J ↑ J)](./13%20case%20study.md#case-1357)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: firstHit bonus: spinDelta −20 / dmgMult 1.42× / lockMs 95  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 0 · Stamina 10 · Speed 60  
**Mechanism**: Ground-contact loads spring → vertical jump → apex-strike descent. firstHit: −20, 1.42×, 95ms. No firstHit: −8, 1.16×, 30ms. Cost 15, attack type.  
**2.5D Rendering**: Jump arc + descending strike flash  
**Gimmick**: comboDetect(seq=[attack,up,attack], window=600ms); firstHit spring-load bonus  
**Engine Note**: spinDelta −20/−8, dmgMult 1.42×/1.16×, lockMs 95/30; cost 15; attack combo

---

### [Case 1358 — [GIMMICK] Krusher Doomscizor 2Vortex Hunter — Wall-Ride Gravity Dive Double-Strike](./13%20case%20study.md#case-1358)

**System**: Gen2-Burst / DB-System · Attack  
**Geometry**: v_x = 1.4 m/s · h_wall = 174 mm (physical) / 350 mm (BeySpirit) · v_z_impact = 1.85 m/s (physical) / 2.62 m/s (BS)  
**Material**: Vortex Frame (air-deflection vanes CL=0.35); Hunter rubber tip μ (aggressive)  
**Spin Coupling**: rigid  
**Contact Points**: wall strike: ~0.04J; floor impact: 0.097J combined (physical); BeySpirit: 0.180J combined  
**Movement Freedom**: Hunter driver: aggressive rubber tip; wall adhesion via Vortex Frame lift  
**Base Stats**: Attack 80 · Defense 5 · Stamina 20 · Speed 82  
**Mechanism**: m=29.5g, I=2.15×10⁻⁵ kg·m². Phase 1: wall approach at v_x=1.4m/s; F_lift=0.494mN (physical) → h_wall=174mm. Phase 2: gravity dive v_z=1.85m/s floor impact. BeySpirit ×24 lift: h_BS=350mm, v_z_BS=2.62m/s, combined KE=0.180J. Wall-strike + floor-impact = Double Strike.  
**2.5D Rendering**: Wall-climb trajectory + dive arc + double impact flash  
**Gimmick**: vortexWallRide(v_x, CL) → F_lift, h_wall, v_z; BeySpirit ×24 override  
**Engine Note**: F_lift_physical 0.494mN / BS 12mN; h_wall 174mm / BS 350mm; v_z 1.85 / BS 2.62 m/s

---

### [Case 1359 — [SPECIAL] Flying Double Strike (Daigo Kurogami · Krusher Doomscizor 2Vortex Hunter)](./13%20case%20study.md#case-1359)

**System**: Gen2-Burst / DB-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: both hits perfect: spinDelta −35 / dmgMult 1.48× / lockMs 160; wall only: −14/1.28×/70ms  
**Movement Freedom**: —  
**Base Stats**: Attack 82 · Defense 0 · Stamina 15 · Speed 85  
**Mechanism**: BeySpirit ×24 lift → h_BS=350mm wall ride. Wall strike (scythe blades scrape wall) + gravity-dive overhead impact (2.62m/s targeting top surface). QTE: J at wall contact (100ms) + J at dive apex (200ms). both hits perfect: −35, 1.48×, 160ms. Both normal: −26, 1.40×, 120ms. powerCost 90. **Anime override**: F_lift ×24 for full wall adhesion.  
**2.5D Rendering**: Wall-ride trail + overhead dive flash + dual impacts  
**Gimmick**: flyingDoubleStrike(wallHit, diveHit, hitQuality) → spinDelta, dmgMult, lockMs  
**Special Move**: Flying Double Strike · powerCost 90 · animeOverride true  
**Compatible beys**: Vortex Frame (or lift-assist frame F_lift≥0.4mN) + aggressive rubber driver (v_lateral≥1.2m/s)  
**Engine Note**: wallStrike + diveStrike; both perfect: −35/1.48×/160ms; powerCost 90

---

### [Case 1360 — [COMBO] Scythe Dive (→ ↓ J)](./13%20case%20study.md#case-1360)

**System**: Gen2-Burst / DB-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: wallContact bonus: spinDelta −24 / dmgMult 1.43× / lockMs 105  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 0 · Stamina 10 · Speed 70  
**Mechanism**: Wall arc → wall-climb angle → gravity-augmented scythe contact. wallContact: −24, 1.43×, 105ms. No wall: −10, 1.22×, 40ms. Cost 25, attack type.  
**2.5D Rendering**: Wall-arc + dive flash  
**Gimmick**: comboDetect(seq=[right,down,attack], window=600ms); wallContact bonus  
**Engine Note**: spinDelta −24/−10, dmgMult 1.43×/1.22×, lockMs 105/40; cost 25; attack combo

---

### [Case 1361 — [GIMMICK] Blitz Striker 100RSF — RSF Multi-Strike Spin Absorption](./13%20case%20study.md#case-1361)

**System**: Gen2-MFB / HWS · Attack  
**Geometry**: n_blades = 4 · θ_blade = 65° to tangent · r_outer = 2.0 cm · RSF r_inner = 0.15 cm / r_outer = 0.5 cm  
**Material**: Zinc alloy Blitz Striker FW · RSF rubber outer ring μ=0.80 / sharp inner μ=0.12  
**Spin Coupling**: rigid  
**Contact Points**: Δω per strike (physical): +13.1 rad/s to Striker · net 4-strike: +40–52 rad/s / −40–52 opp  
**Movement Freedom**: RSF: rubber ring at high spin → sharp pin at low spin  
**Base Stats**: Attack 85 · Defense 5 · Stamina 35 · Speed 80  
**Mechanism**: m=28.2g, I=1.65×10⁻⁵ kg·m². 4 steep smash blades (θ=65°). Partial elastic collision per strike: Δω_Striker≈+13.1 rad/s (physical). 4 strikes in ~80ms: net +40–52 rad/s accumulated (BeySpirit: +130 rad/s as single discharge pulse). RSF: high-spin rubber grip for attack runs; low-spin sharp pin for stamina orbit.  
**2.5D Rendering**: Multi-blade contact spark trail; RSF rubber glow at high spin  
**Gimmick**: multiStrikeAbsorption(n_strikes, I_opp, I_striker, Δω_diff) → Δω_per_strike, total  
**Engine Note**: μ_RSF 0.80 (rubber) / 0.12 (sharp); bladeAngle 65°; Δω/strike +13.1 rad/s; 4-strike total +40–52 rad/s physical

---

### [Case 1362 — [SPECIAL] Flash of Lightning (Masamune Kadoya · Blitz Striker 100RSF)](./13%20case%20study.md#case-1362)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 4 taps: spinDelta −40 / dmgMult 1.46× / lockMs 120  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 0 · Stamina 25 · Speed 82  
**Mechanism**: BeySpirit stores 4 successive blade contacts as "lightning charge" → single discharge pulse at 4th tap. tapCount/4 scale: spin=−(10+30×charge), dmgMult=1.20+0.26×charge, lockMs=40+80×charge. QTE: 4 J taps within 400ms (100ms each). powerCost 95. **Anime override**: successive contacts stored and discharged as single 130 rad/s pulse (vs physical 4×13=52 rad/s sequential).  
**2.5D Rendering**: Lightning accumulation + single discharge flash  
**Gimmick**: flashOfLightning(tapCount, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Flash of Lightning · powerCost 95 · animeOverride true  
**Compatible beys**: Multi-blade attack wheel ≥3 steep-angle blades (θ≥55°) + RSF/WF/rubber semi-flat tip  
**Engine Note**: 4-tap charge; discharge scale; 4 taps: −40/1.46×/120ms; powerCost 95

---

### [Case 1363 — [COMBO] Lightning Chain (← J J)](./13%20case%20study.md#case-1363)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: firstHit bonus: spinDelta −26 / dmgMult 1.44× / lockMs 85  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 0 · Stamina 20 · Speed 70  
**Mechanism**: Left-arc approach aligns Blitz blades → first J initial charge → second J discharge arc. firstHit: −26, 1.44×, 85ms. No firstHit: −10, 1.22×, 30ms. Cost 25, attack type.  
**2.5D Rendering**: Lightning arc on second J  
**Gimmick**: comboDetect(seq=[left,attack,attack], window=600ms); firstHit bonus  
**Engine Note**: spinDelta −26/−10, dmgMult 1.44×/1.22×, lockMs 85/30; cost 25; attack combo

---

### [Case 1364 — [GIMMICK] Judgement Joker 00Turn Trick Zan — Trick Driver Eccentric Mode-Switch](./13%20case%20study.md#case-1364)

**System**: Gen2-Burst / GT-System · Attack/Stamina  
**Geometry**: m_ecc = 0.4g · r_ecc = 2.8 mm · ω_t = 284 rad/s (2710 rpm) · Turn Frame: 4 asymmetric vanes r=3.3cm  
**Material**: Trick driver eccentric tungsten insert; Turn Frame asymmetric ABS vanes  
**Spin Coupling**: eccentric-weight pivot arm; mode switch at ω_t  
**Contact Points**: Attack mode: outer rubber ring μ=0.78, r=7mm; Stamina mode: inner sharp μ=0.09, r=1.2mm  
**Movement Freedom**: Attack mode: aggressive rubber flat 1.5+ m/s; Stamina mode: stable orbit  
**Base Stats**: Attack 65 · Defense 20 · Stamina 65 · Speed 70  
**Mechanism**: m=38.1g, I=2.88×10⁻⁵ kg·m². τ_c=m_ecc×ω²×r_ecc×l_arm vs τ_s=0.144 N·mm → ω_t=284 rad/s. Random trajectory switches from floor micro-irregularities. Turn Frame asymmetry: net lateral torque biases orbit direction per mode (magnified in Stamina mode). BeySpirit: switch rate 8–12 Hz (vs physical 0.3–0.5 Hz) → trajectory change 25–45°/switch, below human reaction time.  
**2.5D Rendering**: Mode-switch shimmer; direction-change trail  
**Gimmick**: trickModeSwitch(ω, ω_t=284) → attackMode / staminaMode; BeySpirit: 8–12 switches/s  
**Engine Note**: ω_t 284 rad/s; attackMode μ=0.78/r=7mm; staminaMode μ=0.09/r=1.2mm; BeySpirit switchRate 8–12Hz

---

### [Case 1365 — [SPECIAL] Fortune's Trick (Joker · Judgement Joker 00Turn Trick Zan)](./13%20case%20study.md#case-1365)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 3 switches: spinDelta −30 / dmgMult 1.42× / lockMs 130 / trajectoryShift true  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 20 · Stamina 65 · Speed 72  
**Mechanism**: BeySpirit forces 8–12 mode switches/second (vs physical 0.3–0.5/s). Each switch: direction change 25–45°, <80ms for opponent to react. QTE: tap J at each mode-switch shimmer (up to 3). switchesHit/3 scale: spin=−(8+22r), dmgMult=1.20+0.22r, lockMs=50+80r; trajectoryShift at ≥2 switches. powerCost 70. **Anime override**: switch rate 8–12 Hz exceeds human reaction time (~150ms).  
**2.5D Rendering**: Rapid direction-change shimmers + trajectory disruption visual  
**Gimmick**: fortunesTrick(switchesHit, qteHit) → spinDelta, dmgMult, lockMs, trajectoryShift  
**Special Move**: Fortune's Trick · powerCost 70 · animeOverride true  
**Compatible beys**: Trick driver or equivalent eccentric-weight dual-mode tip (ω_t ∈ 200–450 rad/s operating range)  
**Engine Note**: switchRate 8–12Hz BeySpirit; trajectory 25–45°/switch; 3 switches: −30/1.42×/130ms; powerCost 70

---

### [Case 1366 — [COMBO] Trick Feint (↓ ← J)](./13%20case%20study.md#case-1366)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: directionConfused bonus: spinDelta −16 / dmgMult 1.36× / lockMs 90  
**Movement Freedom**: —  
**Base Stats**: Attack 40 · Defense 15 · Stamina 45 · Speed 55  
**Mechanism**: Stamina-mode orbit approach → abrupt direction swap (simulate mode-switch) → Attack-mode strike during opponent repositioning. confused: −16, 1.36×, 90ms. Not confused: −7, 1.18×, 35ms. Cost 15, balanced type.  
**2.5D Rendering**: Direction-switch flash + attack  
**Gimmick**: comboDetect(seq=[down,left,attack], window=600ms); directionConfused bonus  
**Engine Note**: spinDelta −16/−7, dmgMult 1.36×/1.18×, lockMs 90/35; cost 15; balanced combo

---

### [Case 1367 — [GIMMICK] Genesis Valtryek 6Vortex Reboot — Flash Launch Low-Angle Rush Spiral](./13%20case%20study.md#case-1367)

**System**: Gen2-Burst / God-System · Attack/Ring-Out  
**Geometry**: θ_launch = 5–8° · v_x = 9.45 m/s · v_z = 0.99 m/s · r_1 ≈ 18.2 cm (near-wall orbit)  
**Material**: Reboot driver rubber outer ring μ=0.75 / inner bearing  
**Spin Coupling**: Reboot inner free-spin bearing (minimal spin decay during wall transit)  
**Contact Points**: F_ring_out ≈ 1.17 N at v_orbit=2.5 m/s per orbit (trap near ring-out zone)  
**Movement Freedom**: near-wall spiral; first orbits r≈182mm; inner bearing preserves spin during high-v transit  
**Base Stats**: Attack 75 · Defense 5 · Stamina 30 · Speed 90  
**Mechanism**: m=30.0g, I=2.15×10⁻⁵ kg·m². Low-angle launch (5–8° vs standard 45°) → v_x=9.45m/s → immediate near-wall orbit at r₁≈182mm. Reboot inner bearing: spin preserved during first high-speed laps. F_ring_out≈1.17N per orbit. BeySpirit: orbit locked at r_wall−3mm constant (self-correcting spiral).  
**2.5D Rendering**: Near-wall spiral trail from launch entry  
**Gimmick**: flashLaunchSpiral(θ_launch, v_total) → v_x, v_z, r_1, F_ring_out; BeySpirit orbit-lock  
**Engine Note**: θ_launch 5–8°; v_x 9.45m/s; r_1 182mm; F_ring_out 1.17N/orbit; Reboot bearing spin-preserve

---

### [Case 1368 — [SPECIAL] Flash Launch / Flash Shoot (Valt Aoi · various Valtryek assemblies)](./13%20case%20study.md#case-1368)

**System**: Gen2-Burst / God-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: parallel launch (0°/100%): spinDelta −35 / dmgMult 1.45× / lockMs 160 / ringOutForce 1.0  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 0 · Stamina 20 · Speed 92  
**Mechanism**: QTE: launchTilt≤5° AND power≥90% (set during Launch Phase). tiltBonus=(15−tilt)/15; powerRatio=power/100. spinDelta=−(15+20×pR×tB), dmgMult=1.25+0.20×pR×tB, lockMs=60+100×pR×tB, ringOutForce=pR×tB. ringOutForce≥0.8 triggers ring-out attempt. powerCost 100. **Anime override**: BeySpirit locks orbit at wall periphery (self-correcting spiral).  
**2.5D Rendering**: Low-angle launch arc + near-wall spiral trail  
**Gimmick**: flashLaunch(launchTilt, launchPower, qteHit) → spinDelta, dmgMult, lockMs, ringOutForce  
**Special Move**: Flash Launch · powerCost 100 · animeOverride true  
**Compatible beys**: Rubber outer-ring driver (Accel, Variable, Reboot, Xtreme, μ≥0.65); inner free-spin/bearing mechanism  
**Engine Note**: launchPhase integration; tiltBonus; ringOutForce scale; max: −35/1.45×/160ms/1.0; powerCost 100

---

### [Case 1369 — [COMBO] Spiral Rush (→ ← J)](./13%20case%20study.md#case-1369)

**System**: Gen2-Burst / God-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: wallAdjacent bonus: spinDelta −22 / dmgMult 1.43× / lockMs 110  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 0 · Stamina 15 · Speed 75  
**Mechanism**: Right arc + cross-over feint left → wall-adjacent opponent strike. wallAdjacent: −22, 1.43×, 110ms. Not wall: −10, 1.25×, 55ms. Cost 25, attack type.  
**2.5D Rendering**: Arc-cross trail + wall-adjacent flash  
**Gimmick**: comboDetect(seq=[right,left,attack], window=600ms); wallAdjacent bonus  
**Engine Note**: spinDelta −22/−10, dmgMult 1.43×/1.25×, lockMs 110/55; cost 25; attack combo

---

### [Case 1370 — [GIMMICK] Hades Crown 130FB — FB Flat-Base Crimson Dash](./13%20case%20study.md#case-1370)

**System**: Gen2-MFB / HWS · Attack  
**Geometry**: r_FB = 0.7 cm · A_contact = 154 mm² · z_AR = 18–22 mm · track height = 13.0 mm  
**Material**: FB flat plastic tip μ=0.60 · Hades Crown AR upward-angled crown blades  
**Spin Coupling**: rigid  
**Contact Points**: z_AR = 18–22mm contacts opponent equatorial belt (12–18mm) → upper/equatorial zone; v_linear_burst_BS = 4.2 m/s  
**Movement Freedom**: FB chaotic stochastic at ω>500: a_wobble=0.4mm, v_lateral=1.5–1.8 m/s  
**Base Stats**: Attack 88 · Defense 0 · Stamina 25 · Speed 85  
**Mechanism**: m=29.2g, I=1.58×10⁻⁵ kg·m². FB flat: A=154mm², chaotic at ω>500 rad/s (a_wobble=0.4mm), v_lateral=1.5–1.8 m/s. 130 track: z_AR=18–22mm reaches opponent equatorial belt → maximises tilt-imparting lever arm. dω/dt=−7.6 rad/s². BeySpirit: converts chaotic path to 4.2m/s linear intercept; interrupts opponent special-move charge.  
**2.5D Rendering**: Crimson flash on high-speed intercept; upper-equatorial contact zone  
**Gimmick**: fbChaosMovement(ω); z_AR 18–22mm equatorial intercept; BS linear 4.2m/s  
**Engine Note**: μ_FB 0.60; chaotic at ω>500; v_lateral 1.5–1.8m/s; z_AR 18–22mm; dω/dt −7.6 rad/s²

---

### [Case 1371 — [SPECIAL] Flash Attack (Bao · Hades Crown 130FB)](./13%20case%20study.md#case-1371)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect: spinDelta −32 / dmgMult 1.46× / lockMs 130 / specialInterrupt true (if opponent charging)  
**Movement Freedom**: —  
**Base Stats**: Attack 88 · Defense 0 · Stamina 20 · Speed 87  
**Mechanism**: BeySpirit converts chaotic FB path to 4.2m/s linear intercept (t_traverse=44ms, too fast to react). Upper-equatorial contact (z=18–22mm) stops opponent special charge. QTE: tap →+J simultaneously (120ms). perfect: −32, 1.46×, 130ms, interrupt. hit: −22, 1.35×, 80ms, interrupt if charging. powerCost 85. **Anime override**: chaotic→single-vector 4.2m/s; special-move interrupt.  
**2.5D Rendering**: Crimson linear flash across arena; interrupt burst  
**Gimmick**: flashAttack(qteHit, hitQuality, opponentChargingSpecial) → spinDelta, dmgMult, lockMs, specialInterrupt  
**Special Move**: Flash Attack · powerCost 85 · animeOverride true  
**Compatible beys**: FB / F / HF flat-base tip (A≥100mm²) + tall track (≥120 height) + upper-contact AR z≥16mm  
**Engine Note**: linearBurst 4.2m/s; upper-equatorial z=18–22mm; specialInterrupt; powerCost 85

---

### [Case 1372 — [COMBO] Crimson Dash (→ J ↓)](./13%20case%20study.md#case-1372)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: jHit: spinDelta −20 / dmgMult 1.42× / lockMs 75  
**Movement Freedom**: —  
**Base Stats**: Attack 70 · Defense 0 · Stamina 15 · Speed 75  
**Mechanism**: Flat-tip right dash → upper equatorial strike → drop below recoil zone. jHit: −20, 1.42×, 75ms. No hit: −9, 1.20×, 25ms. Cost 25, attack type.  
**2.5D Rendering**: Crimson right-arc flash + drop  
**Gimmick**: comboDetect(seq=[right,attack,down], window=600ms)  
**Engine Note**: spinDelta −20/−9, dmgMult 1.42×/1.20×, lockMs 75/25; cost 25; attack combo

---

### [Case 1373 — [GIMMICK] Hyperion Flamebringer Cho Xceed'+X — Flamebringer Ring Limit Breaker System](./13%20case%20study.md#case-1373)

**System**: Gen2-Burst / BU-System · Attack  
**Geometry**: r_fold = 2.3 cm · r_ext = 3.4 cm · n_blades = 4 · m_blade = 2.8g · ω_release = 849 rad/s (8100 rpm)  
**Material**: Flamebringer Ring ABS + centrifugal latch · k_deploy = 2.4 N/mm · x_deploy = 3mm  
**Spin Coupling**: ΔI at deployment = 7.04×10⁻⁶ kg·m² → ω drops 22% (I_pre=2.50×10⁻⁵ → I_post=3.20×10⁻⁵)  
**Contact Points**: E_deploy_physical = 172.8 mJ total / BeySpirit = 605 mJ (×3.5) · secondary strike at r_ext=3.4cm  
**Movement Freedom**: blades folded flush below ω_release; deploy at ω≥849 rad/s (BeySpirit: any spin)  
**Base Stats**: Attack 92 · Defense 5 · Stamina 20 · Speed 85  
**Mechanism**: m=26.7g, I_pre=2.50×10⁻⁵ kg·m². Latch releases at ω≥849 rad/s → blades snap from r=2.3cm to r=3.4cm. ΔI=7.04×10⁻⁶, ω drops 22% (angular momentum conserved). BeySpirit: latch fires at any spin, E_BS=605mJ (×3.5). Primary strike = blade flare; secondary = deployed blades at r=3.4cm on next contact. Thermal flame aura disrupts spin stability.  
**2.5D Rendering**: Blade-deploy flash (folded→extended); secondary strike radius visual  
**Gimmick**: flamebringerLBDeploy(ω, v_in, m_opp); BeySpirit override: deployAtAnySpin, E_BS ×3.5  
**Engine Note**: ω_release 849 rad/s (physical, BeySpirit overrides); E_deploy 172.8 mJ / 605 mJ BS; ΔI 7.04e-6; ω_drop 22%

---

### [Case 1374 — [SPECIAL] Flaming Limit Breaker / Limit Break Burn (Hyuga Hizashi · Hyperion Flamebringer Cho Xceed'+X)](./13%20case%20study.md#case-1374)

**System**: Gen2-Burst / BU-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: spinDelta −38 / dmgMult 1.48× / lockMs 155 / selfSpin −12  
**Movement Freedom**: —  
**Base Stats**: Attack 92 · Defense 0 · Stamina 15 · Speed 87  
**Mechanism**: BeySpirit lowers release threshold to any spin; E_BS=605mJ (×3.5 physical). Four blades simultaneously flare to r=3.4cm (primary strike) + sustained secondary attack zone. Thermal flame disruption. QTE: hold J 400ms → release. chargeRatio scale: perfect (r≥0.9): −38/1.48×/155ms/self−12. powerCost 95. **Anime override**: release at any spin; E_deploy ×3.5.  
**2.5D Rendering**: Simultaneous four-blade flare + flame aura  
**Gimmick**: flamingLimitBreaker(chargeMs, qteHit) → spinDelta, dmgMult, lockMs, spinDelta_self  
**Special Move**: Flaming Limit Breaker · powerCost 95 · animeOverride true  
**Compatible beys**: Flamebringer Ring (centrifugally-latched deployable blades, ω_release≥800 rad/s, r_ext≥3.2cm)  
**Engine Note**: E_BS 605mJ; primary+secondary strike; full: −38/1.48×/155ms/self−12; powerCost 95

---

### [Case 1375 — [COMBO] Limit Blaze (J → K)](./13%20case%20study.md#case-1375)

**System**: Gen2-Burst / BU-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: perfect (hitQuality>0.75): spinDelta −32 / dmgMult 1.50× / lockMs 160  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 10 · Stamina 15 · Speed 75  
**Mechanism**: Primary blade strike → arc reposition → Limit Breaker blade-extension burst. perfect: −32, 1.50×, 160ms. Normal: −22, 1.40×, 110ms. No hit: −12, 1.25×, 50ms. Cost 35, attack type.  
**2.5D Rendering**: Primary strike + blade-flare burst flash  
**Gimmick**: comboDetect(seq=[attack,right,defense], window=600ms); hitQuality scale  
**Engine Note**: spinDelta −32/−22/−12, dmgMult 1.50×/1.40×/1.25×, lockMs 160/110/50; cost 35; attack combo

---

### [Case 1381 — [GIMMICK] Judgement Joker 00Turn Trick Zan — Fate's Judgement Asymmetric Rubber Blade Mechanics](./13%20case%20study.md#case-1381)

**System**: Gen2-Burst / GT-System · Attack/Risk  
**Geometry**: t_strong = 3.2 mm · t_weak = 1.4 mm · P_burst_strong = 0.04 · P_burst_weak = 0.50  
**Material**: Rubber blades: COR_strong = 0.35 (physical) → 0.70 (BeySpirit) · COR_weak = 0.55 → 0.88  
**Spin Coupling**: rigid  
**Contact Points**: F_strong_BS = 38.5N · F_weak_BS = 42.5N · Expected burst risk = 0.27 per contact  
**Movement Freedom**: uniform random contact angle → 50% chance each side  
**Base Stats**: Attack 85 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: m=44.1g, I=3.10×10⁻⁵ kg·m². 4 rubber blades; 2 strong-side (t=3.2mm backing, COR=0.35, P_burst=0.04) + 2 weak-side (t=1.4mm, COR=0.55, P_burst=0.50). P(strong)=0.50, P(weak)=0.50 → E[burst]=0.27 per contact. BeySpirit amplifies both sides: strong COR 0.35→0.70 (safer), weak COR 0.55→0.88 (more dangerous). "50/50 chance of victory or self-destruction."  
**2.5D Rendering**: Strong-side blue glow / weak-side red glow; burst risk indicator  
**Gimmick**: asymmetricRubberBlade(strongSide) → COR, F_contact, P_burst; BeySpirit amplification  
**Engine Note**: COR_strong 0.35→0.70 BS; COR_weak 0.55→0.88 BS; P_burst strong 0.04/0.06 BS; weak 0.50/0.65 BS

---

### [Case 1382 — [SPECIAL] Fate's Judgement / The Judgement (Joe Lazure · Judgement Joker 00Turn Trick Zan)](./13%20case%20study.md#case-1382)

**System**: Gen2-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: strong perfect: −35/1.48×/150ms/burst 0.06; weak perfect: −40/1.50×/180ms/burst 0.65  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 15 · Stamina 20 · Speed 82  
**Mechanism**: BeySpirit amplifies rubber COR (strong 0.35→0.70; weak 0.55→0.88). Contact side resolved by hidden RNG seeded on contact timing. Strong: F=38.5N, safe (burst 0.06). Weak: F=42.5N, dangerous (burst 0.65). QTE: hold J → release at contact (200ms). powerCost 90. **Anime override**: COR beyond rubber material limits; weak-side burst risk 0.65.  
**2.5D Rendering**: Strong/weak side colour differential; burst risk flash  
**Gimmick**: fatesJudgement(qteHit, hitQuality, strongSide) → spinDelta, dmgMult, lockMs, selfBurstRisk  
**Special Move**: Fate's Judgement · powerCost 90 · animeOverride true  
**Compatible beys**: Layer Base with strong/weak asymmetry (P_burst gap ≥0.25); rubber blades  
**Engine Note**: RNG contact side; strong: −35/1.48×/burst 0.06; weak: −40/1.50×/burst 0.65; powerCost 90

---

### [Case 1383 — [COMBO] Judge's Gamble (K J K)](./13%20case%20study.md#case-1383)

**System**: Gen2-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: strong hit: −18/1.40×/100ms/burst 0.04; weak hit: −24/1.46×/120ms/burst 0.30  
**Movement Freedom**: —  
**Base Stats**: Attack 60 · Defense 25 · Stamina 20 · Speed 60  
**Mechanism**: Guard → rubber blade contact → guard hold. RNG resolves side. strong: −18, 1.40×, 100ms, selfBurst 0.04. weak: −24, 1.46×, 120ms, selfBurst 0.30. No hit: −8, 1.18×, 30ms. Cost 25, balanced type.  
**2.5D Rendering**: Side-resolve colour flash on J  
**Gimmick**: comboDetect(seq=[defense,attack,defense], window=600ms); RNG side resolve  
**Engine Note**: strong: −18/1.40×/burst 0.04; weak: −24/1.46×/burst 0.30; cost 25; balanced combo

---

### [Case 1384 — [GIMMICK] Virgo ED145ES — Fierce Lady Flash ED145 Free-Ring Tai-Chi Deflection](./13%20case%20study.md#case-1384)

**System**: Gen2-MFB / HWS · Defense/Stamina  
**Geometry**: r_ring = 1.75 cm · m_ring = 2.8g · I_ring = 4.3×10⁻⁷ kg·m² · μ_bearing = 0.02  
**Material**: ED145 free-spinning ring on bearing race · ES tip (Eternal Sharp)  
**Spin Coupling**: ring decoupled from track body (bearing isolation: 95% of lateral force → ring spin-up)  
**Contact Points**: F_body 1st contact: ~1.05N avg (vs 2.0N rigid); 2nd+: 0.10N effective (70% deflect)  
**Movement Freedom**: ES inner sharp tip: minimal drift; ED145 outer ring: absorbs lateral contacts independently  
**Base Stats**: Attack 5 · Defense 80 · Stamina 85 · Speed 15  
**Mechanism**: F_body = μ_bearing × N ≈ 0.02N (vs rigid 0.40N → 95% diverted to ring spin-up). Ring spin-up: α_ring=81,400 rad/s² → +326 rad/s in 4ms first contact (54% match). Repeated contacts: ring already spinning → near-zero friction by 2nd hit (70% deflect). Tai-Chi principle: yields to incoming AR force rather than opposing. BeySpirit extends deflect to sustained ~85% per hit.  
**2.5D Rendering**: ED145 ring rotating independently; deflect arc on contact  
**Gimmick**: ed145FreeRing(contactEvent) → F_body, ring spin-up, deflectFraction  
**Engine Note**: bearingμ 0.02; first-contact deflect 48%; 2nd+ deflect 70%; BeySpirit ≈85%; ES tip dω/dt minimal

---

### [Case 1385 — [SPECIAL] Claw Reflection / Tai-Chi Counter (Virgo ED145ES)](./13%20case%20study.md#case-1385)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta_self +6; spinDelta_opp −28; dmgMult 1.40×; lockMs 130  
**Movement Freedom**: —  
**Base Stats**: Attack 10 · Defense 85 · Stamina 80 · Speed 15  
**Mechanism**: BeySpirit extends ED145 free-ring deflect to sustained ~85% per hit. spinDelta_self +6, opp −28, dmg 1.40×, lock 130ms. powerCost 80, cooldown 7500ms. **Anime physics override**: deflect fraction 0.97 (near-perfect elastic return), redirecting all incoming momentum back toward attacker.  
**2.5D Rendering**: Full-ring deflect aura; momentum-reversal arc  
**Gimmick**: clawReflection(ringActive) → deflectFraction 0.97, counterImpulse  
**Special Move**: Claw Reflection · powerCost 80 · animeOverride true  
**Compatible beys**: Beys with ED145-type free-spinning outer ring on bearing race (μ≤0.03); ES or equivalent stamina tip  
**Engine Note**: spinDelta_self +6; opp −28; dmgMult 1.40×; powerCost 80

---

### [Case 1386 — [COMBO] Tai-Chi Spin (↓ K J)](./13%20case%20study.md#case-1386)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta_self +4; spinDelta_opp −18; dmgMult 1.34×; lockMs 90  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 80 · Stamina 85 · Speed 15  
**Mechanism**: ↓ (drop to centre) → K (brace free ring) → J (deflect counter). Hit: self +4, opp −18, 1.34×, 90ms. Miss: self +1, opp −6, 1.12×, 25ms. Cost 15, defense type.  
**2.5D Rendering**: Deflect arc flash on K  
**Gimmick**: comboDetect(seq=[moveDown,defense,attack], window=600ms)  
**Engine Note**: self +4; opp −18; 1.34×; 90ms; cost 15; defense combo

---

### [Case 1387 — [GIMMICK] Burn Fireblaze 135 MS Magnetic Snap Tip Gyro-Lock (Teru Saotome · Burn Fireblaze 135MS)](./13%20case%20study.md#case-1387)

**System**: Gen2-MFB / HWS · Stamina/Defense  
**Geometry**: r_outer = 2.1 cm · r_inner = 0.9 cm · r_MS_ball = 0.6 cm · m = 37.5 g  
**Material**: MS tip: μ_magnet ≈ 0.01 when centred (magnetic snap) · Fireblaze wheel: ABS  
**Spin Coupling**: rigid  
**Contact Points**: MS magnetic snap: μ_eff ≈ 0.01 centred vs 0.15 drifting; dω/dt = −0.30 rad/s² centred  
**Movement Freedom**: MS tip magnetically centres on dimple (no lateral drift); slight pivot on hard hits  
**Base Stats**: Attack 5 · Defense 55 · Stamina 110 · Speed 10  
**Mechanism**: MS (Magnet Sharp) tip carries a small rare-earth magnet that snaps to a steel dimple centred on the stadium floor, providing near-zero friction spin. m=37.5g, I=7.8×10⁻⁶ kg·m², ω₀=600 rad/s. At centre: dω/dt ≈ −0.30 rad/s². Hard hit displaces tip; remagnetisation pulls it back in ~0.5s. BeySpirit holds snap at any spin level.  
**2.5D Rendering**: z_cm = 1.2 · MS glint on snap  
**Gimmick**: magnetSnap(displaced) → μ_eff, reSnapMs  
**Engine Note**: MS centred dω/dt −0.30 rad/s²; displaced dω/dt −8.5 rad/s²; reSnap 500ms

---

### [Case 1388 — [SPECIAL] Burning Fire Strike (Teru Saotome · Burn Fireblaze 135MS)](./13%20case%20study.md#case-1388)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −28; dmgMult 1.40×; lockMs 110  
**Movement Freedom**: —  
**Base Stats**: Attack 40 · Defense 55 · Stamina 80 · Speed 35  
**Mechanism**: BeySpirit fire element coats Fireblaze wheel. Charge (300ms) + release. perfect: −28, 1.40×, 110ms. partial: −18, 1.30×, 70ms. miss: −10, 1.18×, 30ms. powerCost 78. **Anime physics override**: fire mantle pre-softens opponent AR surface (PC ~420K), raising effective contact area and force.  
**2.5D Rendering**: Fire mantle aura on wheel; impact explosion  
**Gimmick**: burningFireStrike(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Burning Fire Strike · powerCost 78 · animeOverride true  
**Compatible beys**: Fire-element wheel with r_outer≥1.8cm; MS or Sharp stamina tip  
**Engine Note**: spinDelta −28; dmgMult 1.40×; powerCost 78; cooldown 7000ms

---

### [Case 1389 — [COMBO] Fire Snap (J K ↓)](./13%20case%20study.md#case-1389)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −16; dmgMult 1.32×; lockMs 65  
**Movement Freedom**: —  
**Base Stats**: Attack 35 · Defense 55 · Stamina 80 · Speed 35  
**Mechanism**: J (fire AR swipe) → K (MS re-snap, stabilise) → ↓ (drop to centre contact). Hit: −16, 1.32×, 65ms. Miss: −7, 1.14×, 20ms. Cost 15, attack type.  
**2.5D Rendering**: Fire wheel flash; MS snap glint  
**Gimmick**: comboDetect(seq=[attack,defense,moveDown], window=600ms)  
**Engine Note**: −16/1.32×/65ms; cost 15; attack combo

---

### [Case 1390 — [GIMMICK] Burn Fireblaze Inferno Upper — Elevated Radial AR Strike (Teru Saotome · Burn Fireblaze 135MS)](./13%20case%20study.md#case-1390)

**System**: Gen2-MFB / HWS · Stamina/Attack  
**Geometry**: r_outer = 2.1 cm · upper-smash contact at r = 2.1 cm · I = 7.8×10⁻⁶ kg·m²  
**Material**: Fireblaze wheel: ABS flame-wing geometry · MS tip magnetic snap  
**Spin Coupling**: rigid  
**Contact Points**: v_wheel = 12.6 m/s; F_smash = 35.4 N; P = 2.36 MPa (below yield)  
**Movement Freedom**: MS snap holds Fireblaze at centre; upper-smash requires orbital approach  
**Base Stats**: Attack 40 · Defense 50 · Stamina 80 · Speed 35  
**Mechanism**: Fireblaze wheel sweeps upward against opponent's lower AR at maximum radius (r=2.1cm). v=600×0.021=12.6 m/s, KE=1.404 J, F=35.4 N at t_c=4ms, P=2.36 MPa (sub-yield). BeySpirit fire-upper adds: F_BS=3×35.4=106N, P_BS=7.08 MPa. Upper-launch trajectory raises opponent ~30mm off floor.  
**2.5D Rendering**: Upper-arc flash; opponent elevation effect  
**Gimmick**: inferno_upper(omega) → v_wheel, F_smash, upperLaunchForce  
**Engine Note**: F_smash 35.4N physical; BeySpirit F_BS 106N; upper-launch Δz ≈30mm [M]

---

### [Case 1391 — [SPECIAL] Fighting Snake Flash (Mei-Mei · Aquario 105F)](./13%20case%20study.md#case-1391)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: tapCount×3 perfect: −24/×1.31/75ms; 1-tap: −8/×1.15/25ms; miss: −8/×1.12/20ms  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 10 · Stamina 30 · Speed 75  
**Mechanism**: Flat-tip (F) sinusoidal lateral-instability path amplified by BeySpirit: C_lat 0.18→0.55 [M]. Each of 3 slither crossings hits separate opponent zone (tap J, 200ms window per tap). tapCount 3 perfect: −24, 1.31×, 75ms. powerCost 70. **Anime physics override**: BeySpirit triples lateral coupling, creating controlled 3-target S-path.  
**2.5D Rendering**: Sinusoidal orbit trail; multi-hit flash  
**Gimmick**: fightingSnakeFlash(tapCount, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Fighting Snake Flash · powerCost 70 · animeOverride true  
**Compatible beys**: Flat/wide-rubber-flat tip (r_tip≥3mm); wave/curve-protrusion AR for periodic lateral impulses  
**Engine Note**: 3-tap: −24/1.31×/75ms; 1-tap: −8/1.15×; powerCost 70

---

### [Case 1392 — [COMBO] Snake Slither (→ J ←)](./13%20case%20study.md#case-1392)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −12; dmgMult 1.28×; lockMs 45  
**Movement Freedom**: —  
**Base Stats**: Attack 50 · Defense 10 · Stamina 35 · Speed 75  
**Mechanism**: → (arc right entering slither) → J (wave-AR crossing apex strike) → ← (slip left on second slither leg). Hit: −12, 1.28×, 45ms. Miss: −5, 1.10×, 15ms. Cost 15, attack type.  
**2.5D Rendering**: S-curve orbital trail; contact flash  
**Gimmick**: comboDetect(seq=[moveRight,attack,moveLeft], window=600ms)  
**Engine Note**: −12/1.28×/45ms; cost 15; attack combo

---

### [Case 1393 — [GIMMICK] Omega Blast — Prime Apocalypse Sword Point Concentrated Strike (Arthur Peregrine · Prime Apocalypse 0Dagger Ultimate Reboot')](./13%20case%20study.md#case-1393)

**System**: Gen3-Burst / GT-System · Attack  
**Geometry**: r_sword = 1.8 cm · r_dagger = 2.0 cm · A_sword = 3 mm² · m = 47.0 g  
**Material**: GT Layer: PC + sword protrusion · Dagger frame: PC tabs · UR' driver: bearing+spring  
**Spin Coupling**: rigid  
**Contact Points**: F_sword = 88.4 N; F_dagger_total = 34 N; F_total_phys = 122 N [M]; P_sword = 29.5 MPa (below PC yield)  
**Movement Freedom**: UR' bearing: μ≈0.05; dω/dt = −1.54 rad/s²  
**Base Stats**: Attack 90 · Defense 20 · Stamina 55 · Speed 70  
**Mechanism**: Prime Apocalypse single sword protrusion (A=3mm²) + Dagger frame 4 tabs (A=6mm² each). At ω=530 rad/s: v=9.54 m/s, KE=1.686 J, F_sword=88.4 N, P=29.5 MPa. Dagger tabs: F_total=34 N. Combined F_total_phys=122 N [M]. UR' driver bearing: dω/dt=−1.54 rad/s². I_total=1.20×10⁻⁵ kg·m².  
**2.5D Rendering**: z_cm = 2.0 · sword-tip protrusion flash  
**Gimmick**: swordPointConcentrated(omega) → F_sword, P_sword, F_combined  
**Engine Note**: F_total_phys 122N; P_sword 29.5MPa; dω/dt −1.54 rad/s²

---

### [Case 1394 — [SPECIAL] Omega Blast / End Blaster (Arthur Peregrine · Prime Apocalypse 0Dagger Ultimate Reboot')](./13%20case%20study.md#case-1394)

**System**: Gen3-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −30/×1.42/110ms; partial (r=0.5): −19/×1.31/65ms; miss: −10/×1.18/0ms  
**Movement Freedom**: —  
**Base Stats**: Attack 90 · Defense 15 · Stamina 55 · Speed 70  
**Mechanism**: BeySpirit routes all KE through sword contact point: F_sword_BS=3×122=366 N, P=122 MPa >> PC yield [M]. Charge (400ms) + release (150ms window). perfect: −30, 1.42×, 110ms. powerCost 85. **Anime physics override**: BeySpirit concentrates all frame energy through sword tip → layer-surface penetration beyond yield.  
**2.5D Rendering**: Sword tip concentrate flash; pressure spike  
**Gimmick**: omegaBlast(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Omega Blast / End Blaster · powerCost 85 · animeOverride true  
**Compatible beys**: Layer with single sword/spike r≥1.6cm, A_tip≤8mm², + frame tab reinforcement r≥1.8cm  
**Engine Note**: spinDelta −30; dmgMult 1.42×; powerCost 85; cooldown 7500ms

---

### [Case 1395 — [COMBO] Sword Point (↑ J →)](./13%20case%20study.md#case-1395)

**System**: Gen3-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −20; dmgMult 1.38×; lockMs 90  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 15 · Stamina 55 · Speed 70  
**Mechanism**: ↑ (charge up orbit, build approach speed) → J (sword-point concentrated strike) → → (break away along bowl arc). Hit: −20, 1.38×, 90ms. Miss: −8, 1.18×, 25ms. Cost 25, attack type.  
**2.5D Rendering**: Sword protrusion flash on J  
**Gimmick**: comboDetect(seq=[moveUp,attack,moveRight], window=600ms)  
**Engine Note**: −20/1.38×/90ms; cost 25; attack combo

---

### [Case 1396 — [GIMMICK] Final Blast — Prime Apocalypse Spring-Lock Sword Enhancement (Arthur Peregrine · Prime Apocalypse 0Dagger Ultimate Reboot')](./13%20case%20study.md#case-1396)

**System**: Gen3-Burst / GT-System · Attack  
**Geometry**: r_sword = 1.8 cm · x_comp = 3 mm · k_sword = 12 N/mm · m = 47.0 g  
**Material**: PC layer body with polymer-composite spring cam  
**Spin Coupling**: rigid  
**Contact Points**: J_normal = 0.352 N·s; J_spring = 0.054 N·s; J_final_phys = 0.406 N·s (+15% vs Omega Blast)  
**Movement Freedom**: Spring cam: compress at F_trigger≥36 N [M]; release t_release ≈1.5ms  
**Base Stats**: Attack 90 · Defense 20 · Stamina 55 · Speed 70  
**Mechanism**: Spring-loaded sword cam. k=12 N/mm, x_comp=3mm, E_spring=0.054 J. Trigger: F_trigger≥36N (opponent hit). Release: v_release_phys=6.0 m/s; BeySpirit: v_BS=10.4 m/s (√(2×0.162/0.003)). Combined: v_sword_spin+v_BS=9.54+10.4=19.9 m/s [M]. Contact angle ±40° for trigger.  
**2.5D Rendering**: Spring-release flash; amplified sword strike  
**Gimmick**: springLockSword(swordPushedIn) → J_final, v_combined  
**Engine Note**: E_spring 0.054 J physical; BeySpirit E_BS 0.162 J; v_combined 19.9 m/s [M]

---

### [Case 1397 — [SPECIAL] Final Blast / Final Blaster (Arthur Peregrine · Prime Apocalypse 0Dagger Ultimate Reboot')](./13%20case%20study.md#case-1397)

**System**: Gen3-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spring+perfect: −42/×1.50/160ms; spring+miss: −14/×1.24/30ms; no spring: −18/×1.28/50ms  
**Movement Freedom**: —  
**Base Stats**: Attack 90 · Defense 20 · Stamina 55 · Speed 70  
**Mechanism**: K (guard, sword pushes in, spring loads) → J (120ms window, spring release). BeySpirit amplifies E_spring ×3 (0.162 J [M]); v_combined=19.9 m/s [M]. spring+perfect: −42, 1.50×, 160ms. powerCost 90. **Anime physics override**: BeySpirit spring energy ×3; combined velocity exceeds Omega Blast ×3.  
**2.5D Rendering**: Spring-loading indicator; release flash  
**Gimmick**: finalBlast(swordPushedIn, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Final Blast / Final Blaster · powerCost 90 · animeOverride true  
**Compatible beys**: Layer with spring-loaded sword/spike (compression stroke≥2mm, k≥8 N/mm); pre-load requires incoming F≥36N  
**Engine Note**: spring+perfect: −42/1.50×/160ms; powerCost 90

---

### [Case 1398 — [COMBO] Break Blaster (K ↓ J)](./13%20case%20study.md#case-1398)

**System**: Gen3-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spring loaded: −28/×1.46/120ms; no spring: −18/×1.30/80ms  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 20 · Stamina 55 · Speed 70  
**Mechanism**: K (guard, spring pre-load) → ↓ (drop angle) → J (spring release blast). Spring+hit: −28, 1.46×, 120ms. No spring+hit: −18, 1.30×, 80ms. Miss: −10, 1.20×, 30ms. Cost 35, attack type.  
**2.5D Rendering**: Guard stance → spring pop on J  
**Gimmick**: comboDetect(seq=[defense,moveDown,attack], window=600ms); springState check  
**Engine Note**: spring: −28/1.46×/120ms; no spring: −18/1.30×/80ms; cost 35; attack combo

---

### [Case 1399 — [GIMMICK] Saber Strike — Xcalius Sword Blade Lock-and-Thrust (Xander Shakadera · Xcalius Force Xtreme / Xeno Xcalius Magnum Impact)](./13%20case%20study.md#case-1399)

**System**: Gen3-Burst / Burst-God · Attack  
**Geometry**: r_sword = 1.9 cm · blade_width = 0.9 cm · r_disc = 2.1 cm · m = 43.5 g (XFX)  
**Material**: Xcalius Layer: ABS sword geometry · Force disc: heavy ABS · Xtreme driver: rubber flat  
**Spin Coupling**: rigid  
**Contact Points**: F_smash = 56.8 N; lock multiplier 1.70×; J_total = 0.483 N·s [M]; P_lock = 3.55 MPa  
**Movement Freedom**: Xtreme driver: μ=0.50; dω/dt = −142 rad/s²  
**Base Stats**: Attack 100 · Defense 10 · Stamina 15 · Speed 90  
**Mechanism**: Single asymmetric sword protrusion (r=19mm, width=9mm). At ω=600 rad/s: v=11.4 m/s, KE=1.62 J. Phase 1 smash (5ms): F=56.8 N. Phase 2 lock (15ms): hook catches opponent → J_add=0.199 N·s, lock mult=1.70×. Phase 3 thrust (2mm slide): delta_KE=0.040 J. Total J=0.483 N·s. I_total=9.0×10⁻⁶ kg·m² (XFX).  
**2.5D Rendering**: z_cm = 1.5 · lock-hook flash; thrust trail  
**Gimmick**: saberLockThrust(omega) → F_smash, lockMult, J_total  
**Engine Note**: F_smash 56.8N; lockMult 1.70×; J_total 0.483 N·s; Xtreme dω/dt −142 rad/s²

---

### [Case 1400 — [SPECIAL] Saber Strike (Xander Shakadera · Xcalius Force Xtreme / Xeno Xcalius Magnum Impact)](./13%20case%20study.md#case-1400)

**System**: Gen3-Burst / Burst-God · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full thrust perfect: −38/×1.48/150ms; partial (t=0.5): −25/×1.35/90ms; miss: −12/×1.22/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 10 · Stamina 15 · Speed 90  
**Mechanism**: BeySpirit: instant full-grip from first contact (no slip phase). t_BS=20ms, J_BS=1.136 N·s (4.0× standard). Thrust phase BS: F_thrust=59.7 N, Δx=4mm, ΔKE=0.239 J. Tap J (80ms) + hold J (300ms). powerCost 88. **Anime physics override**: instant lock engagement (no slip), extended thrust hold, opponent fully immobilised during thrust.  
**2.5D Rendering**: Lock-and-thrust sequence; blade aura extending beyond physical  
**Gimmick**: saberStrike(thrustMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Saber Strike · powerCost 88 · animeOverride true  
**Compatible beys**: Single asymmetric sword layer extending to r≥1.7cm, hook geometry (protrusion height≥3mm, width≤1.2cm); rubber/mobile flat tip  
**Engine Note**: full thrust: −38/1.48×/150ms; powerCost 88

---

### [Case 1401 — [COMBO] Sword Slash (↑ J ↓)](./13%20case%20study.md#case-1401)

**System**: Gen3-Burst / Burst-God · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −26; dmgMult 1.44×; lockMs 95  
**Movement Freedom**: —  
**Base Stats**: Attack 95 · Defense 10 · Stamina 20 · Speed 85  
**Mechanism**: ↑ (climb bowl wall, elevation) → J (lock strike from above) → ↓ (drive through downward). Hit: −26, 1.44×, 95ms. Miss: −10, 1.20×, 25ms. Cost 25, attack type.  
**2.5D Rendering**: Elevated sword hook flash  
**Gimmick**: comboDetect(seq=[moveUp,attack,moveDown], window=600ms)  
**Engine Note**: −26/1.44×/95ms; cost 25; attack combo

---

### [Case 1402 — [GIMMICK] Flame Saber — Dranzer Aerial Spiral Descent Sharp-Tip Stomp (Kai Hiwatari · Dranzer F)](./13%20case%20study.md#case-1402)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.2 cm · h_launch = 0.5 m [M] · r_tip = 0.1 cm · m = 37.5 g  
**Material**: Dranzer F AR: fire-wing ABS · Right EG · S tip  
**Spin Coupling**: rigid  
**Contact Points**: F = 238.8 N [M]; P = 76.0 MPa >> PC yield [M]; A_S = 3.14×10⁻⁶ m²  
**Movement Freedom**: S tip: μ=0.06; dω/dt = −3.47 rad/s²  
**Base Stats**: Attack 85 · Defense 10 · Stamina 45 · Speed 70  
**Mechanism**: Right EG launches Dranzer vertically (ω_launch≈720 rad/s [M]). Precession: Ω_prec=1.23 rad/s → arc 22° in 0.32s descent from 0.5m. Landing: v_fall=3.13 m/s, ω_spin≈600 rad/s. Combined F=238.8 N [M], P=76 MPa >> PC yield (structural damage). I_total=6.4×10⁻⁶ kg·m².  
**2.5D Rendering**: Aerial trajectory arc; spiral descent path; tip-stomp landing  
**Gimmick**: flameSaberStomp(omega_launch, height) → F_impact, P_tip, landingOffset  
**Engine Note**: F_impact 238.8N [M]; P 76MPa >> yield; spiral landing offset ~80mm [M]

---

### [Case 1403 — [SPECIAL] Flame Saber (Kai Hiwatari · Dranzer F)](./13%20case%20study.md#case-1403)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −35/×1.44/130ms; partial (r=0.5): −23/×1.32/80ms; miss: −14/×1.20/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 10 · Stamina 40 · Speed 70  
**Mechanism**: ↑ hold (350ms) + J tap at apex (200ms window). EG launches aerial; BeySpirit fire mantle 1800K [M] (physical ~400K). Fire pre-softens opponent AR. BeySpirit ×2: F_BS=477.6 N, J_BS=2.39 N·s [M]. powerCost 82. **Anime physics override**: instant S-tip deploy, fire mantle 1800K, targeted stomp precision.  
**2.5D Rendering**: Aerial fire meteor trajectory; explosion on landing  
**Gimmick**: flameSaber(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Flame Saber · powerCost 82 · animeOverride true  
**Compatible beys**: Fire-element AR (swept-wing, r_outer≥1.8cm) + EG/TLEG achieving ω≥650 rad/s [M]; Sharp/S tip  
**Engine Note**: full charge: −35/1.44×/130ms; powerCost 82

---

### [Case 1404 — [COMBO] Fire Dive (J ↑ J)](./13%20case%20study.md#case-1404)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −24; dmgMult 1.42×; lockMs 88  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 10 · Stamina 45 · Speed 70  
**Mechanism**: J (floor-level AR swipe, first contact) → ↑ (EG propel skyward, fire AR trailing) → J (descend tip-first, Sharp impact on top surface). Hit: −24, 1.42×, 88ms. Miss: −8, 1.20×, 22ms. Cost 25, attack type.  
**2.5D Rendering**: Double-hit sequence; aerial arc between Js  
**Gimmick**: comboDetect(seq=[attack,moveUp,attack], window=600ms)  
**Engine Note**: −24/1.42×/88ms; cost 25; attack combo

---

### [Case 1405 — [GIMMICK] Flame Gigs Turbo — Dranzer GT Dual-Stage EG Concentric Orbit Attack (Kai Hiwatari · Dranzer GT)](./13%20case%20study.md#case-1405)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.2 cm · r_in = 6.0 cm · r_out = 18.0 cm · m = 38.3 g  
**Material**: Dranzer GT AR: fire-wing ABS · Engine Gear GT: dual-stage gear  
**Spin Coupling**: rigid  
**Contact Points**: Inner: v=13.7 m/s; Outer: v=14.0 m/s; F_smash≈38.6 N per pass; dual-pass J_total=0.386 N·s  
**Movement Freedom**: EG GT: dual-stage burst (2 bursts per cycle, Δt=5.2ms between) · two orbit rings  
**Base Stats**: Attack 80 · Defense 15 · Stamina 40 · Speed 75  
**Mechanism**: EG GT: 2 teeth 180° apart → 2 bursts per revolution (δt=5.2ms). First burst → inner orbit r_in=60mm; second → outer orbit r_out=180mm. Both AR contact speeds ≈14 m/s. Physical J_total=0.386 N·s [M]. BeySpirit elevates both trails to blue (2200K [M]), pre-softening opponent AR on inner pass. I_total=7.5×10⁻⁶ kg·m².  
**2.5D Rendering**: Dual concentric ring trails; inner/outer orbit arcs  
**Gimmick**: flameGigsTurbo(omega) → innerOrbit, outerOrbit, dualPassForce  
**Engine Note**: 2 bursts/rev; inner v=13.7 m/s; outer v=14.0 m/s; BeySpirit blue-fire 2200K [M]

---

### [Case 1406 — [SPECIAL] Flame Gigs Turbo (Kai Hiwatari · Dranzer GT)](./13%20case%20study.md#case-1406)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: dual+perfect: −38/×1.46/140ms; dual+miss: −18/×1.28/50ms; single trail: −15/×1.22/40ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 40 · Speed 75  
**Mechanism**: Hold J+K (350ms, both EG GT stages primed). BeySpirit simultaneously activates both stages, blue fire 2200K [M]. Dual pass: F_BS=57.9 N/pass × 2, J_total=0.579 N·s [M]. powerCost 88. **Anime physics override**: simultaneous dual-orbit coverage; blue flame temperature elevation; pre-weakened surface penetration on second pass.  
**2.5D Rendering**: Dual blue-fire ring orbits; second-pass breakthrough  
**Gimmick**: flameGigsTurbo(dualHeld, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Flame Gigs Turbo · powerCost 88 · animeOverride true  
**Compatible beys**: EG base with ≥2 propulsion burst events/cycle (ω_motor≥150 rad/s [M]); fire-element AR r_outer≥1.8cm  
**Engine Note**: dual+perfect: −38/1.46×/140ms; single: −15/1.22×; powerCost 88

---

### [Case 1407 — [COMBO] Twin Flame (J K J)](./13%20case%20study.md#case-1407)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.42×; lockMs 82  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 40 · Speed 75  
**Mechanism**: J (inner orbit fire strike, r_in≈60mm) → K (EG GT reload, trail transitions inner→outer) → J (outer orbit fire strike r_out≈180mm). Hit: −22, 1.42×, 82ms. Miss: −8, 1.18×, 22ms. Cost 25, attack type.  
**2.5D Rendering**: Inner then outer ring flash sequence  
**Gimmick**: comboDetect(seq=[attack,defense,attack], window=600ms)  
**Engine Note**: −22/1.42×/82ms; cost 25; attack combo

---

### [Case 1408 — [GIMMICK] Flame Claw — Sagittario C145 Passive-Fin Fire Tornado Tangential Strike (Kenta · Sagittario C145S)](./13%20case%20study.md#case-1408)

**System**: Gen2-MFB / HWS · Stamina  
**Geometry**: r_wheel = 1.8 cm · r_fin = 1.5 cm · m = 29.5 g · I = 5.0×10⁻⁶ kg·m²  
**Material**: C145 fins: 3 passive-rotation on bearing race (slip ratio 0.54) · S tip: μ=0.06  
**Spin Coupling**: fins: bearing-decoupled from track body  
**Contact Points**: tangential: F_tan = 12.9 N; fin vortex: F_vortex = 8.4 mN physical; v_fin = 4.46 m/s  
**Movement Freedom**: S tip: dω/dt = −3.47 rad/s² · fins centrifugally locked at ω≥200 rad/s  
**Base Stats**: Attack 20 · Defense 10 · Stamina 100 · Speed 20  
**Mechanism**: C145: 3 passive fins at r=15mm on bearing race. Slip ratio 0.54 → ω_fin=297 rad/s at ω_bey=550 rad/s. Tangential approach ≈25° off tangent: F_tan=12.9 N. Fin vortex F_vortex=8.4 mN (negligible physical, amplified BeySpirit). Spiral approach orbit. I_total=5.0×10⁻⁶ kg·m².  
**2.5D Rendering**: Spiral orbit trail; fin blade-passing whir; fire tornado column above C145  
**Gimmick**: flameClaw(omega_bey) → omega_fin, F_tan, F_vortex  
**Engine Note**: slip ratio 0.54; F_tan 12.9N; vortex F 8.4mN physical; spiral approach

---

### [Case 1409 — [SPECIAL] Flame Claw (Kenta · Sagittario C145S)](./13%20case%20study.md#case-1409)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −22/×1.34/90ms; partial: −14/×1.23/55ms; miss: −5/×1.10/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 10 · Stamina 95 · Speed 20  
**Mechanism**: Hold J (300ms, C145 spin up, fire tornado). BeySpirit: fin ω → zero-slip (ω_fin_BS=550 rad/s [M]), v_fin_BS=8.25 m/s. Fire column 900K [M]; q_BS=40.8 Pa. Sustained spin drain. powerCost 75. **Anime physics override**: zero-slip co-rotation, fire tornado column height, acute spin shock in ~90ms.  
**2.5D Rendering**: Fire tornado column above track; sustained drain aura  
**Gimmick**: flameClaw(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Flame Claw · powerCost 75 · animeOverride true  
**Compatible beys**: C145-type ≥3-fin passive-rotation track (r_fin≥1.2cm); fire element; S/DS tip  
**Engine Note**: full charge: −22/1.34×/90ms; powerCost 75

---

### [Case 1410 — [COMBO] Claw Spiral (↑ J ←)](./13%20case%20study.md#case-1410)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −14; dmgMult 1.30×; lockMs 60  
**Movement Freedom**: —  
**Base Stats**: Attack 20 · Defense 10 · Stamina 95 · Speed 20  
**Mechanism**: ↑ (outer orbit rise, fin tornado building from below) → J (tangential claw swipe from height) → ← (spiral exit, fire column over opponent). Hit: −14, 1.30×, 60ms. Miss: −5, 1.12×, 18ms. Cost 25, stamina type.  
**2.5D Rendering**: Spiral exit trail; fire tornado after J  
**Gimmick**: comboDetect(seq=[moveUp,attack,moveLeft], window=600ms)  
**Engine Note**: −14/1.30×/60ms; cost 25; stamina combo

---

### [Case 1411 — [GIMMICK] Fire Execution — Dark Gargoyle Wing-Vortex Fire Tornado Ring-Out (Miguel · Dark Gargoyle)](./13%20case%20study.md#case-1411)

**System**: Gen1-Plastic / SGS · Attack  
**Geometry**: r_wing = 2.4 cm · c_wing = 1.2 cm · n_wings = 4 · m = 33.0 g · I = 7.1×10⁻⁶ kg·m²  
**Material**: Dark Gargoyle AR: swept gargoyle-wing ABS · Right SG · standard base  
**Spin Coupling**: rigid  
**Contact Points**: Γ = 0.0864 m²/s [M]; v_ring = 0.88 m/s; r_ring = 2.4 cm; F_out_phys ≈ 0.07 N  
**Movement Freedom**: standard base  
**Base Stats**: Attack 55 · Defense 20 · Stamina 40 · Speed 55  
**Mechanism**: 4 swept gargoyle wings at r=24mm. Γ=0.5×c_wing×CL×v_wing=0.0864 m²/s [M]. Toroidal vortex ring: r_ring=24mm, v_ring=0.88 m/s, expands ~10%/m. F_smash=35.5 N, P=2.37 MPa. Ring-out: vortex propagates to opponent. I_total=7.1×10⁻⁶ kg·m².  
**2.5D Rendering**: Toroidal vortex ring propagation; wide-wing sweep trail  
**Gimmick**: fireExecution(omega) → Gamma, v_ring, F_out  
**Engine Note**: Γ 0.0864 m²/s [M]; v_ring 0.88 m/s; F_smash 35.5N; ring-out propagation range ~150mm

---

### [Case 1412 — [SPECIAL] Fire Execution (Miguel · Dark Gargoyle)](./13%20case%20study.md#case-1412)

**System**: Gen1-Plastic / SGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −32/×1.45/120ms; partial: −20/×1.38/75ms; miss: −10/×1.15/35ms  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 20 · Stamina 40 · Speed 55  
**Mechanism**: Hold J (500ms) + tap K (150ms release). BeySpirit gargoyle demon manifests: Γ_BS=0.30 m²/s [M] (×3.5), v_ring_BS=2.9 m/s, F_out_BS=0.418 N, J_ring=0.125 N·s (> ring-out threshold). powerCost 90. **Anime physics override**: gargoyle wing materialisation, stadium-spanning vortex, sustained ring-out push ~418 mN.  
**2.5D Rendering**: Gargoyle spirit materialisation; fire tornado stadium coverage; ring-out push  
**Gimmick**: fireExecution(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Fire Execution · powerCost 90 · animeOverride true  
**Compatible beys**: Wide-wing AR r≥2.2cm with fire element; r_ring≥2.0cm; passive-blade track supplements (not required)  
**Engine Note**: full: −32/1.45×/120ms; powerCost 90

---

### [Case 1413 — [COMBO] Gargoyle Spin (← J →)](./13%20case%20study.md#case-1413)

**System**: Gen1-Plastic / SGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.40×; lockMs 90  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 20 · Stamina 40 · Speed 55  
**Mechanism**: ← (spiral in, vortex building from left arc) → J (fire tornado release, rotational wing-strike) → → (exit right, opponent pushed outward by ring exit vortex). Hit: −22, 1.40×, 90ms. Miss: −10, 1.18×, 30ms. Cost 35, attack type.  
**2.5D Rendering**: Vortex ring ejection on J; radial push exit  
**Gimmick**: comboDetect(seq=[moveLeft,attack,moveRight], window=600ms)  
**Engine Note**: −22/1.40×/90ms; cost 35; attack combo

---

### [Case 1414 — [GIMMICK] Fire Arrow — Dranzer S Fire-Coated Direct Charge Explosive Impact (Kai Hiwatari · Dranzer S)](./13%20case%20study.md#case-1414)

**System**: Gen1-Plastic / SGS · Attack  
**Geometry**: r_AR = 2.1 cm · m = 28.7 g · I = 4.4×10⁻⁶ kg·m²  
**Material**: Dranzer S AR: swept-blade fire-phoenix ABS · S tip: μ=0.06  
**Spin Coupling**: rigid  
**Contact Points**: F = 31.4 N; P = 2.24 MPa (below yield); fire pre-heat A_eff = 16.1 mm² → P_mod = 1.95 MPa  
**Movement Freedom**: S tip: dω/dt = −3.84 rad/s²  
**Base Stats**: Attack 65 · Defense 10 · Stamina 60 · Speed 70  
**Mechanism**: At ω=600 rad/s: v=12.6 m/s, KE=0.792 J, F=31.4 N, P=2.24 MPa. Fire coating pre-heats AR surface (physical ~400K approaches 420K softening). A_eff spreads to 16.1 mm². S tip retains spin through charge. I_total=4.4×10⁻⁶ kg·m².  
**2.5D Rendering**: Fire-coated charge trail; direct arrow trajectory  
**Gimmick**: fireArrow(omega) → F_smash, P_contact, A_effective  
**Engine Note**: F 31.4N; P 2.24MPa; fire pre-heat A_eff 16.1mm²; dω/dt −3.84 rad/s²

---

### [Case 1415 — [SPECIAL] Fire Arrow (Kai Hiwatari · Dranzer S)](./13%20case%20study.md#case-1415)

**System**: Gen1-Plastic / SGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −30/×1.42/110ms; partial: −20/×1.31/65ms; miss: −10/×1.18/25ms  
**Movement Freedom**: —  
**Base Stats**: Attack 65 · Defense 10 · Stamina 55 · Speed 70  
**Mechanism**: Hold J (300ms). BeySpirit fire mantle 1800K [M] (physical ~400K). PC contact zone softened. F_BS=3×31.4=94.2 N [M]; J_explosion=0.05 N·s; J_total=0.427 N·s [M]. powerCost 75. **Anime physics override**: fire mantle 1800K fully softens contact zone; plasma burst at interface; Dranzer phoenix materialisation.  
**2.5D Rendering**: Fire arrow trajectory; explosion fireball on contact  
**Gimmick**: fireArrow(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Fire Arrow · powerCost 75 · animeOverride true  
**Compatible beys**: Fire-element AR with swept-wing geometry (no lateral protrusions beyond r_AR); S/Sharp tip  
**Engine Note**: full: −30/1.42×/110ms; powerCost 75

---

### [Case 1416 — [COMBO] Arrow Flash (→ J K)](./13%20case%20study.md#case-1416)

**System**: Gen1-Plastic / SGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −16; dmgMult 1.34×; lockMs 60  
**Movement Freedom**: —  
**Base Stats**: Attack 60 · Defense 10 · Stamina 60 · Speed 70  
**Mechanism**: → (charge rightward, build fire-coat) → J (fire smash at peak velocity) → K (recoil guard vs explosion backwash). Hit: −16, 1.34×, 60ms. Miss: −7, 1.16×, 15ms. Cost 15, attack type.  
**2.5D Rendering**: Fire charge approach; recoil guard flash  
**Gimmick**: comboDetect(seq=[moveRight,attack,defense], window=600ms)  
**Engine Note**: −16/1.34×/60ms; cost 15; attack combo

---

### [Case 1417 — [GIMMICK] Final Wall — Lucius Endbringer Ring Limit Break Two-Layer Free-Spin Barrier (Lain Valhalla · Lucius Endbringer Kou Drift)](./13%20case%20study.md#case-1417)

**System**: Gen4-Burst / Burst-DB · Defense/Stamina  
**Geometry**: r_inner_ring = 2.0–2.6 cm · r_outer_ring = 2.6–3.3 cm · m = 48.5 g · I = 2.52×10⁻⁵ kg·m²  
**Material**: Endbringer Ring: inner blade layer on bearing race (μ_bearing≈0.02); outer zigzag facets · Drift driver: metal ball bearing  
**Spin Coupling**: inner layer: bearing-decoupled (LB active); outer: rigid pre-LB  
**Contact Points**: first-contact deflect 48% [M]; steady-state 95% [M]; zigzag counter-return 41% of deflected; Drift dω/dt = −0.85 rad/s²  
**Movement Freedom**: Drift tip: μ=0.015; near-zero drift; LB trigger: F≥45 N or 5–8 accumulated impacts [M]  
**Base Stats**: Attack 10 · Defense 100 · Stamina 90 · Speed 15  
**Mechanism**: Endbringer Ring: inner blade layer on bearing (μ=0.02). LB trigger: F≥45 N or 5–8 hits [M]. First contact: 48% deflect (spin-up transient). Steady-state: 95% deflect (match speed). Outer zigzag: 41% counter-return of deflected force. F_body=0.02×N (rigid: 0.40×N → 95% diverted). Drift: dω/dt=−0.85 rad/s². I_total=2.52×10⁻⁵ kg·m².  
**2.5D Rendering**: Free-ring deflect; zigzag counter-arc; LB stage indicator  
**Gimmick**: endbringerLimitBreak(stage) → deflectFraction, counterReturn  
**Engine Note**: LB trigger F≥45 N [M]; first-contact 48%; steady-state 95%; zigzag 41%; Drift dω/dt −0.85 rad/s²

---

### [Case 1418 — [SPECIAL] Final Wall (Lain Valhalla · Lucius Endbringer Kou Drift)](./13%20case%20study.md#case-1418)

**System**: Gen4-Burst / Burst-DB · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: LB+perfect: self +8/opp −30/×1.42/140ms; LB+miss: self +2/opp −10/×1.18/40ms; no LB+perfect: self +3/opp −12/×1.20/60ms  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 100 · Stamina 85 · Speed 15  
**Mechanism**: Hold K (500ms). BeySpirit: instant inner layer pre-spin (no transient). First contact → 95% deflect [M]. Zigzag counter: 0.41×0.95×F at opponent [M]. Energy barrier: 8mm exclusion zone [M], J_KB=0.054 N·s [M]. powerCost 85. **Anime physics override**: instant LB activation at any spin speed; spherical energy exclusion field; opponent knock-back before physical contact.  
**2.5D Rendering**: Red BeySpirit sphere; 8mm exclusion field; counter-impulse arc  
**Gimmick**: finalWall(limitBreakActive, qteHit) → spinDelta_self, spinDelta_opp, dmgMult, lockMs  
**Special Move**: Final Wall · powerCost 85 · animeOverride true  
**Compatible beys**: DB/BU-era Layer Ring with inner free-spinning blade layer on bearing (LB trigger mechanism)  
**Engine Note**: LB+perfect: self +8/opp −30/1.42×/140ms; powerCost 85

---

### [Case 1419 — [COMBO] Barrier Crush (K ↑ K)](./13%20case%20study.md#case-1419)

**System**: Gen4-Burst / Burst-DB · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta_self +5; spinDelta_opp −20; dmgMult 1.38×; lockMs 100  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 100 · Stamina 85 · Speed 15  
**Mechanism**: K (prime Endbringer free-spin deflect) → ↑ (Drift precession rise) → K (barrier slam descent, combined downward+lateral). Hit: self +5, opp −20, 1.38×, 100ms. Miss: self 0, opp −8, 1.16×, 30ms. Cost 25, defense type.  
**2.5D Rendering**: Elevation then barrier slam arc  
**Gimmick**: comboDetect(seq=[defense,moveUp,defense], window=600ms)  
**Engine Note**: self +5; opp −20; 1.38×; 100ms; cost 25; defense combo

---

### [Case 1420 — [GIMMICK] Final Limit Breaker — Endbringer Ring Explosive Dual-Layer Separation Double Free-Spin (Lain Valhalla · Lucius Endbringer Kou Drift)](./13%20case%20study.md#case-1420)

**System**: Gen4-Burst / Burst-DB · Defense  
**Geometry**: r_inner = 2.0–2.6 cm · r_outer = 2.6–3.3 cm · m = 48.5 g · I = 2.52×10⁻⁵ kg·m²  
**Material**: Both layers independently free-spin on bearings (μ≈0.02 each)  
**Spin Coupling**: double-bearing isolation (both layers decoupled)  
**Contact Points**: cascaded deflect: 96% [M]; double zigzag return: 0.41×0.96×F; kick impulse J_kick=0.098 N·s [M]  
**Movement Freedom**: physical full-separation trigger: F≥80 N [M] (BeySpirit bypasses); v_sep_BS=3.5 m/s [M]  
**Base Stats**: Attack 15 · Defense 100 · Stamina 85 · Speed 15  
**Mechanism**: Both inner AND outer blade layers free-spin simultaneously. Cascaded: 1−(1−0.80)²=0.96 deflect [M]. Double zigzag counter: 0.41×0.96. Physical v_sep≈0.5 m/s, J_kick≈0.014 N·s; BeySpirit v_sep=3.5 m/s, J_kick=0.098 N·s [M]. Physical trigger F≥80 N [M].  
**2.5D Rendering**: Dual-ring separation flash; 96% deflect shield  
**Gimmick**: finalLimitBreaker(stage, qteHit) → spinDelta_self, spinDelta_opp, deflectFraction  
**Engine Note**: 96% deflect [M]; J_kick 0.098 N·s [M]; BeySpirit v_sep 3.5 m/s [M]

---

### [Case 1421 — [SPECIAL] Final Limit Breaker (Lain Valhalla · Lucius Endbringer Kou Drift)](./13%20case%20study.md#case-1421)

**System**: Gen4-Burst / Burst-DB · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: LB2+perfect: self +10/opp −38/×1.50/170ms deflect 0.96; LB1+perfect: self +5/opp −18/×1.30/80ms deflect 0.80; no LB+perfect: self +2/opp −8/×1.12/30ms deflect 0.20  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 100 · Stamina 85 · Speed 15  
**Mechanism**: Hold K (400ms). BeySpirit: both layers separate explosively (v_sep_BS=3.5 m/s [M]), simultaneously pre-spun to match ω. 96% deflect from first contact [M]. Double zigzag: 39% counter. J_kick=0.098 N·s [M]. powerCost 95. **Anime physics override**: instant dual-ring explosive separation; simultaneous pre-spin; spherical dual-ring BeySpirit energy field.  
**2.5D Rendering**: Explosive dual-ring opening; dual BeySpirit field  
**Gimmick**: finalLimitBreaker(limitBreakStage, qteHit) → spinDelta_self, spinDelta_opp, deflectFraction  
**Special Move**: Final Limit Breaker · powerCost 95 · animeOverride true  
**Compatible beys**: Two-layer LB Ring with both inner and outer on independent bearing races (r_outer≥2.5cm [M])  
**Engine Note**: LB2+perfect: self +10/opp −38/1.50×/170ms/deflect 0.96; powerCost 95

---

### [Case 1422 — [COMBO] Limit Edge (K → J)](./13%20case%20study.md#case-1422)

**System**: Gen4-Burst / Burst-DB · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta_self +4; spinDelta_opp −24; dmgMult 1.44×; lockMs 110; deflectFraction 0.75  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 100 · Stamina 85 · Speed 15  
**Mechanism**: K (prime both LB rings into free-spin) → → (yield right, opponent force absorbed by both spinning rings) → J (inter-layer gap counter-strike). Hit: self +4, opp −24, 1.44×, 110ms, deflect 0.75. Miss: self 0, opp −8, 1.18×, 30ms, deflect 0.15. Cost 35, defense type.  
**2.5D Rendering**: Dual-layer absorption; inter-gap strike flash  
**Gimmick**: comboDetect(seq=[defense,moveRight,attack], window=600ms)  
**Engine Note**: self +4; opp −24; 1.44×; 110ms; deflect 0.75; cost 35; defense combo

---

### [Case 1423 — [GIMMICK] Inferno Blast — Flame Libra T125 Fin Blade Sonic Resonance Acoustic Draw-In (Yu Tendo · Flame Libra T125ES)](./13%20case%20study.md#case-1423)

**System**: Gen2-MFB / HWS · Stamina  
**Geometry**: r_wheel = 1.8 cm · r_fin = 1.4 cm · m = 32.8 g · I = 5.4×10⁻⁶ kg·m²  
**Material**: T125: 4 upright passive fins at height 125mm · ES tip: sharp centre + bearing ring  
**Spin Coupling**: fins passive (not driven)  
**Contact Points**: f_bp = 382 Hz at ω=600 rad/s [M]; p = 92.4 Pa [M]; SPL = ~133 dB [M]; F_radiation = 0.060 N  
**Movement Freedom**: ES: inner sharp (μ=0.06), near-zero drift; dω/dt = −3.57 rad/s²  
**Base Stats**: Attack 5 · Defense 10 · Stamina 115 · Speed 10  
**Mechanism**: T125: 4 fins at r=14mm, height 125mm. Blade-passing f_bp=382 Hz at ω=600 rad/s. Acoustic p=92.4 Pa [M], SPL≈133 dB [M]. F_radiation=0.060 N (sustained draw-in). Frequency tuning: yellow 382Hz/orange, green 480Hz, blue 600Hz (BeySpirit assist). ES stamina: dω/dt=−3.57 rad/s². I_total=5.4×10⁻⁶ kg·m².  
**2.5D Rendering**: Fin blade-passing frequency colour indicator; acoustic draw-in pull  
**Gimmick**: infernoBlast(omega) → f_bp, p_acoustic, F_radiation  
**Engine Note**: f_bp 382Hz [M]; p 92.4Pa [M]; F_radiation 60mN; dω/dt −3.57 rad/s²

---

### [Case 1424 — [SPECIAL] Inferno Blast (Yu Tendo · Flame Libra T125ES)](./13%20case%20study.md#case-1424)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: blue/max: −32/×1.44/160ms; green: −24/×1.34/110ms; yellow: −18/×1.26/80ms; miss: −5/×1.10/20ms  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 10 · Stamina 110 · Speed 10  
**Mechanism**: Hold K (300ms resonance) + tap J (150ms release). BeySpirit ×20 [M]: yellow F_draw=1.20N, green 1.90N, blue 2.96N. Sustained draw-in over 0.5s pulls opponent 13–33mm closer [M]. powerCost 80. **Anime physics override**: BeySpirit resonance ×20; frequency-tuning capability mid-battle; structural effects at stadium scale.  
**2.5D Rendering**: Acoustic beam colour gradient yellow→green→blue; draw-in funnel  
**Gimmick**: infernoBlast(frequencyLevel, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Inferno Blast · powerCost 80 · animeOverride true  
**Compatible beys**: ≥4-fin spin track (height≥100mm [M]); f_bp 300–600 Hz; ES/S tip  
**Engine Note**: blue: −32/1.44×/160ms; powerCost 80; freq levels 1/2/3

---

### [Case 1425 — [COMBO] Sonic Draw (↓ K J)](./13%20case%20study.md#case-1425)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −16; dmgMult 1.28×; lockMs 70  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 10 · Stamina 110 · Speed 10  
**Mechanism**: ↓ (drop to bowl base, acoustic floor reflection doubles draw-in) → K (resonance lock, sustained frequency) → J (sonic smash, orbit inward into drawn opponent). Hit: −16, 1.28×, 70ms. Miss: −5, 1.10×, 20ms. Cost 25, stamina type.  
**2.5D Rendering**: Floor-reflection acoustic funnel; draw-in orbit  
**Gimmick**: comboDetect(seq=[moveDown,defense,attack], window=600ms)  
**Engine Note**: −16/1.28×/70ms; cost 25; stamina combo

---

### [Case 1426 — [GIMMICK] Final Inferno Blast — Flame Libra Stadium Constructive Resonance Coherent Acoustic Beam (Yu Tendo · Flame Libra T125ES)](./13%20case%20study.md#case-1426)

**System**: Gen2-MFB / HWS · Stamina  
**Geometry**: r_fin = 1.4 cm · f_target = 672 Hz [M] · N_reflections = 8 [M] · P_amplified = 2280 Pa [M]  
**Material**: Same as Case 1423  
**Spin Coupling**: fins passive  
**Contact Points**: P_amplified = 2280 Pa [M]; BeySpirit ×5: P_BS = 11400 Pa [M]; rock uplift: F=57 N >> weight 4.9 N [M]  
**Movement Freedom**: ω_BS = 1056 rad/s [M] (beyond physical ES max ~750 rad/s)  
**Base Stats**: Attack 5 · Defense 10 · Stamina 115 · Speed 10  
**Mechanism**: Stadium resonance: f_0=672 Hz (bowl cavity), ω_required=1056 rad/s [M]. N=8 coherent reflections → P=2280 Pa [M], BeySpirit ×5 → 11400 Pa [M]. F_draw_BS=11.5 N at full resonance. Rock uplift: 57 N vs 4.9 N weight [M]. Requires BeySpirit spin boost to exceed physical ES ceiling.  
**2.5D Rendering**: Stadium resonance column (green→white-blue); rock levitation; earth shaking  
**Gimmick**: finalInfernoBlast(chargeMs) → f_bp_BS, P_amplified, F_draw  
**Engine Note**: f_0 672Hz [M]; P_BS 11400Pa [M]; rock uplift 57N [M]; ω_BS 1056 rad/s [M] (BeySpirit only)

---

### [Case 1427 — [SPECIAL] Final Inferno Blast (Yu Tendo · Flame Libra T125ES)](./13%20case%20study.md#case-1427)

**System**: Gen2-MFB / HWS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −48/×1.50/200ms; half: −33/×1.35/120ms; miss: −8/×1.18/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 10 · Stamina 110 · Speed 10  
**Mechanism**: Hold J+K (600ms) + release (100ms window). BeySpirit spin boost to ω_BS=1056 rad/s [M]. f_bp=672 Hz hits closed-bowl resonance. N=8 constructive: P=2280 Pa, ×5 BS = 11400 Pa [M]. F_draw_BS=11.5 N, opponent pulled ~5.75 N·s in 0.5s [M]. powerCost 100. **Anime physics override**: BeySpirit spin to 1056 rad/s (physical max ~750); stadium resonance locking; rock levitation at geological scale.  
**2.5D Rendering**: Green/white energy column; rock levitation; stadium-shake  
**Gimmick**: finalInfernoBlast(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Final Inferno Blast · powerCost 100 · animeOverride true  
**Compatible beys**: T125-class ≥4-fin track + closed-bowl stadium type; ES/S tip  
**Engine Note**: full: −48/1.50×/200ms; powerCost 100

---

### [Case 1428 — [COMBO] Inferno Pulse (J ↓ K)](./13%20case%20study.md#case-1428)

**System**: Gen2-MFB / HWS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −20; dmgMult 1.32×; lockMs 85  
**Movement Freedom**: —  
**Base Stats**: Attack 5 · Defense 10 · Stamina 110 · Speed 10  
**Mechanism**: J (T125 frequency spike, resonance pulse at opponent) → ↓ (ES tip couples to floor, acoustic energy into stadium surface) → K (sustain floor resonance, opponent spin disrupted by floor-transmitted vibration). Hit: −20, 1.32×, 85ms. Miss: −5, 1.10×, 20ms. Cost 25, stamina type.  
**2.5D Rendering**: Floor-coupling vibration; frequency spike pulse  
**Gimmick**: comboDetect(seq=[attack,moveDown,defense], window=600ms)  
**Engine Note**: −20/1.32×/85ms; cost 25; stamina combo

---

### [Case 1429 — [GIMMICK] 2Bump Disc Ratchet Shift — Arc Balkesh Three-Position Detent Mechanism (Boa Alcazaba · Arc Balkesh 2Bump Atomic)](./13%20case%20study.md#case-1429)

**System**: Gen3-Burst / GT-Rise · Defense/Stamina  
**Geometry**: r_bump = 2.8 cm · r_layer = 3.7 cm · m = 54.0 g · I = 3.14×10⁻⁵ kg·m²  
**Material**: Arc Balkesh Layer: ABS 3-lug detent track · 2Bump disc: raised bumps · Atomic tip: ball bearing  
**Spin Coupling**: rigid (until 3rd shift)  
**Contact Points**: e_disc pre-shield = 0.72 [M]; shift-3 = 0.85 [M]; τ_shift = 0.224 N·m; J_θ = 2.75×10⁻⁴ N·m·s  
**Movement Freedom**: Atomic tip: μ=0.04; dω/dt = −1.35 rad/s²  
**Base Stats**: Attack 15 · Defense 85 · Stamina 80 · Speed 15  
**Mechanism**: 2Bump disc 2 bumps at r=28mm engage 3-lug track. Each significant hit → +1 detent (3 positions, 120°/shift). At shift 3: shield orientation (360° symmetric). τ_shift=0.224 N·m, J_θ=2.75×10⁻⁴ N·m·s (any normal hit exceeds). Atomic bearing: dω/dt=−1.35 rad/s². I_total=3.14×10⁻⁵ kg·m².  
**2.5D Rendering**: Ratchet shift indicator (3 positions); shield-active glow at shift 3  
**Gimmick**: ratchetShift(hitCount) → shiftCount, e_disc, shieldActive  
**Engine Note**: τ_shift 0.224 N·m; 3 detent positions; shift-3: e_disc 0.85; Atomic dω/dt −1.35 rad/s²

---

### [Case 1430 — [SPECIAL] Final Guard (Boa Alcazaba · Arc Balkesh 2Bump Atomic)](./13%20case%20study.md#case-1430)

**System**: Gen3-Burst / GT-Rise · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 3-shift+low force+perfect: self +3/opp −35/×1.0/200ms/oppBurst true; 3-shift+high force: selfBurst  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 90 · Stamina 75 · Speed 15  
**Mechanism**: K (3 incoming hits, 200ms each). At shift 3: BeySpirit red shield. Low force (F≤75N [M]): e_BS=0.97 [M], near-perfect return, P_opp_burst=0.85 [M]. High force (>75N [M]): self burst. powerCost 90. **Anime physics override**: near-unity elasticity (e=0.97); opponent burst on return; threshold self-burst on heavy hit.  
**2.5D Rendering**: Red BeySpirit shield at shift 3; burst-on-return effect  
**Gimmick**: finalGuard(shiftCount, qteHit, opponentForceTier) → selfSpinDelta, oppSpinDelta, oppBurst, selfBurst  
**Special Move**: Final Guard · powerCost 90 · animeOverride true  
**Compatible beys**: Multi-position ratchet Energy Layer (3+ detents, r_bump≥2.5cm [M]); ball-bearing tip  
**Engine Note**: shift3+low+perfect: opp −35/burst; shift3+high: selfBurst; powerCost 90

---

### [Case 1431 — [COMBO] Shield Slam (J ↑ K)](./13%20case%20study.md#case-1431)

**System**: Gen3-Burst / GT-Rise · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta_self +2; spinDelta_opp −18; dmgMult 1.38×; lockMs 95  
**Movement Freedom**: —  
**Base Stats**: Attack 15 · Defense 85 · Stamina 75 · Speed 15  
**Mechanism**: J (probe attack, first shift impulse via recoil) → ↑ (ride up bowl, bait pursuit) → K (plant at apex, brace raised layer vs pursuing opponent). Hit: self +2, opp −18, 1.38×, 95ms. Miss: self +1, opp −8, 1.10×, 25ms. Cost 15, defense type.  
**2.5D Rendering**: Elevated brace flash on K  
**Gimmick**: comboDetect(seq=[attack,moveUp,defense], window=600ms)  
**Engine Note**: self +2; opp −18; 1.38×; 95ms; cost 15; defense combo

---

### [Case 1432 — [GIMMICK] Dread Phoenix 10 Friction Wall-Ricochet Skyrocket (Phi · Dread Phoenix 10 Friction)](./13%20case%20study.md#case-1432)

**System**: Gen3-Burst / GT-System · Attack  
**Geometry**: r_layer = 3.8 cm · r_disc = 3.3 cm · r_contact = 0.5 cm (rubber) · m = 58.0 g · I = 3.89×10⁻⁵ kg·m²  
**Material**: Dread Phoenix Layer: ABS diagonal blade · 10 Forge Disc: heavy ABS · Friction tip: rubber μ=0.55  
**Spin Coupling**: rigid  
**Contact Points**: v_z_BS = 14.5 m/s [M]; h_apex = 10.7 m [M]; F_impact = 280 N [M]; τ_rub = 0.77 N·m [M]  
**Movement Freedom**: Friction tip: μ=0.55; dω/dt = −40.2 rad/s²  
**Base Stats**: Attack 100 · Defense 15 · Stamina 10 · Speed 85  
**Mechanism**: Wall approach v_in=4.2 m/s [M], wall angle 35°, e=0.75. Physical: v_z=1.81 m/s, h=0.17m. BeySpirit ×8: v_z_BS=14.5 m/s, h=10.7 m [M]. Dive: F_impact=280 N [M], τ_rubber=0.77 N·m to opponent AR [M]. Friction tip torque-drain on landing. I_total=3.89×10⁻⁵ kg·m².  
**2.5D Rendering**: Wall-ride → aerial arc → dive impact; rubber grip torque visual  
**Gimmick**: wallRicochetSkyrocket(omega, v_in) → v_z, h_apex, F_impact  
**Engine Note**: BeySpirit ×8 v_z [M]; h_apex 10.7m [M]; F_impact 280N [M]; Friction dω/dt −40.2 rad/s²

---

### [Case 1433 — [SPECIAL] Final Dread Impact (Phi · Dread Phoenix 10 Friction)](./13%20case%20study.md#case-1433)

**System**: Gen3-Burst / GT-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 3-phase+perfect: −45/×1.50/180ms; 2-phase: −28/×1.38/100ms; 0-phase: −8/×1.18/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 15 · Stamina 10 · Speed 85  
**Mechanism**: Phase 1: ↑ hold (400ms, wall charge). Phase 2: J (150ms, ricochet). Phase 3: J (200ms, dive impact). BeySpirit ×8 amplifies v_z to 14.5 m/s [M]. 3-phase perfect: −45, 1.50×, 180ms. powerCost 95. **Anime physics override**: wall exit 10.7m height (physically 0.37m); 280N dive force (PC fracture); rubber torque-drain τ=0.77 N·m.  
**2.5D Rendering**: 3-phase QTE sequence; aerial skyrocket; dive explosion  
**Gimmick**: finalDreadImpact(phasesCompleted, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Final Dread Impact · powerCost 95 · animeOverride true  
**Compatible beys**: Diagonal-blade Layer (AR width≥2.0cm [M]) + rubber tip (μ≥0.5); bowl wall angle≥25°  
**Engine Note**: 3-phase: −45/1.50×/180ms; powerCost 95

---

### [Case 1434 — [COMBO] Phoenix Dive (→ ↑ J)](./13%20case%20study.md#case-1434)

**System**: Gen3-Burst / GT-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −26; dmgMult 1.42×; lockMs 110  
**Movement Freedom**: —  
**Base Stats**: Attack 95 · Defense 15 · Stamina 10 · Speed 85  
**Mechanism**: → (lateral push toward bowl wall) → ↑ (ride up curved slope) → J (shallow slope-assisted dive strike from elevated position). Hit: −26, 1.42×, 110ms. Miss: −10, 1.22×, 35ms. Cost 25, attack type.  
**2.5D Rendering**: Wall-ride arc; elevated position then dive  
**Gimmick**: comboDetect(seq=[moveRight,moveUp,attack], window=600ms)  
**Engine Note**: −26/1.42×/110ms; cost 25; attack combo

---

### [Case 1435 — [GIMMICK] Arc Balkesh 2Bump Shield-Active Slope Momentum (Boa Alcazaba · Arc Balkesh 2Bump Atomic)](./13%20case%20study.md#case-1435)

**System**: Gen3-Burst / GT-Rise · Defense/Attack  
**Geometry**: r_layer = 3.7 cm · m = 54.0 g · R_arc = 13.0 cm · θ_wall = 30°  
**Material**: Same as Case 1429  
**Spin Coupling**: rigid (shield active)  
**Contact Points**: N_wall = 142.2 N [M]; v_slope = 9.42 m/s [M]; v_crash = 20.8 m/s [M]; F_crash = 374 N [M]  
**Movement Freedom**: Atomic tip: μ=0.04; BeySpirit provides 12 N slope thrust [M]  
**Base Stats**: Attack 50 · Defense 85 · Stamina 65 · Speed 50  
**Mechanism**: Shield active (shift 3). BeySpirit slope thrust: F_BS=12 N, a=222 m/s², s=200mm → v_slope=9.42 m/s [M]. Combined with tangential orbit v_tan=18.5 m/s: v_crash=20.8 m/s [M], F_crash=374 N [M]. Spin drain opponent: Δω=66.5 rad/s [M]. Self-shield absorbs recoil.  
**2.5D Rendering**: Wall-ride slope descent; crash vector arc; shield glow  
**Gimmick**: slopeRide(shieldActive) → v_slope, v_crash, F_crash  
**Engine Note**: BeySpirit thrust 12N [M]; v_crash 20.8 m/s [M]; F_crash 374N [M]; Δω_opp 66.5 rad/s [M]

---

### [Case 1436 — [SPECIAL] Final Crash (Boa Alcazaba · Arc Balkesh 2Bump Atomic)](./13%20case%20study.md#case-1436)

**System**: Gen3-Burst / GT-Rise · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 3-shift+perfect: −42/×1.48/175ms/ringOut 0.65; 3-shift+miss: −28/×1.38/110ms/ringOut 0.38; <3 shifts: −15/×1.24/55ms/ringOut 0.10  
**Movement Freedom**: —  
**Base Stats**: Attack 55 · Defense 85 · Stamina 60 · Speed 55  
**Mechanism**: Phase 1: K ×3 (shifts, 300ms each). Phase 2: ↑ (mount bowl wall, 200ms). Phase 3: J (crash release, 150ms). Shield-on crash self-protects (no self-burst at 374N [M]). Primary win: ring-out. powerCost 95. **Anime physics override**: BeySpirit slope thrust 12N; shield-on self-protection at 374N; crash ring-out trajectory.  
**2.5D Rendering**: 3-shift indicator; slope-crash arc; ring-out vector  
**Gimmick**: finalCrash(shiftCount, qteHit) → spinDelta, dmgMult, lockMs, ringOutChance  
**Special Move**: Final Crash · powerCost 95 · animeOverride true  
**Compatible beys**: 3-position ratchet Layer (r_bump≥2.5cm [M]); ball-bearing tip; bowl wall angle≥20°  
**Engine Note**: 3-shift+perfect: −42/1.48×/175ms/ringOut 0.65; powerCost 95

---

### [Case 1437 — [COMBO] Slope Charge (↑ K J)](./13%20case%20study.md#case-1437)

**System**: Gen3-Burst / GT-Rise · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −20; dmgMult 1.36×; lockMs 85  
**Movement Freedom**: —  
**Base Stats**: Attack 45 · Defense 80 · Stamina 60 · Speed 50  
**Mechanism**: ↑ (drive up bowl slope using orbital momentum) → K (brace layer at apex, keep against wall) → J (release down-slope smash as wall carries back into stadium). Hit: −20, 1.36×, 85ms. Miss: −8, 1.18×, 28ms. Cost 15, defense type.  
**2.5D Rendering**: Wall-ride arc; slope-descent strike  
**Gimmick**: comboDetect(seq=[moveUp,defense,attack], window=600ms)  
**Engine Note**: −20/1.36×/85ms; cost 15; defense combo

---

### [Case 1438 — [GIMMICK] Shelter Regulus Lion Fang Protrusion Contact (Ren Wu Sun · Shelter Regulus 5Star Tower)](./13%20case%20study.md#case-1438)

**System**: Gen3-Burst / Burst-Rise · Attack  
**Geometry**: r_fang = 3.7 cm · A_fang = 6 mm² per tip · m = 55.0 g · I = 3.46×10⁻⁵ kg·m²  
**Material**: Shelter Regulus Layer: ABS 4-lion-head fang protrusions · 5Star disc · Tower tip μ=0.08  
**Spin Coupling**: rigid  
**Contact Points**: F_impact = 249 N [M]; per-fang ≈ 62 N; P_fang ≈ 10.3 MPa (below PC yield)  
**Movement Freedom**: Tower tip: dω/dt = −7.5 rad/s²; wide stance, stable centred orbit  
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 70  
**Mechanism**: 4 lion-fang protrusions at r=37mm, A=6mm² each. At ω=490 rad/s: v=18.1 m/s, KE=4.16 J, F_total=249 N [M], P=10.3 MPa (sub-yield). Tower tip: dω/dt=−7.5 rad/s². I_total=3.46×10⁻⁵ kg·m².  
**2.5D Rendering**: 4-fang protrusion flash; lion-head contact points  
**Gimmick**: lionFangContact(omega) → F_fang, P_fang  
**Engine Note**: F_total 249N; P_fang 10.3MPa; Tower dω/dt −7.5 rad/s²

---

### [Case 1439 — [SPECIAL] Fang Attack (Ren Wu Sun · Shelter Regulus 5Star Tower)](./13%20case%20study.md#case-1439)

**System**: Gen3-Burst / Burst-Rise · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −32/×1.44/130ms; partial: −24/×1.34/80ms; miss: −14/×1.26/40ms  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 70  
**Mechanism**: Hold J (400ms) + release on lion roar. BeySpirit extends r_fang 37mm→44mm [M]. F_BS=3×(0.055×21.6/0.004)=891 N [M]. A_ext=4mm²/fang; P_BS≈62 MPa [M] → PC yield → layer scoring. powerCost 80. **Anime physics override**: BeySpirit fang extension to r=44mm (rigid physical boundary); ×3 force; PC yield surface scoring; Regulus lion materialisation.  
**2.5D Rendering**: Fang extension aura to r=44mm; lion spirit flash  
**Gimmick**: fangAttack(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Fang Attack · powerCost 80 · animeOverride true  
**Compatible beys**: Layer with ≥2 symmetric fang/claw at r≥3.0cm [M], A_tip≤8mm²; no wide-blade distributed contact  
**Engine Note**: full: −32/1.44×/130ms; powerCost 80

---

### [Case 1440 — [COMBO] Fang Rush (J → J)](./13%20case%20study.md#case-1440)

**System**: Gen3-Burst / Burst-Rise · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.40×; lockMs 95  
**Movement Freedom**: —  
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 70  
**Mechanism**: J (first fang strike from standing orbit) → → (orbit right, wider arc) → J (second fang from flanking position, orbital momentum increase). Hit: −22, 1.40×, 95ms. Miss: −10, 1.22×, 35ms. Cost 25, attack type.  
**2.5D Rendering**: Two-point flanking rush; diagonal fang arcs  
**Gimmick**: comboDetect(seq=[attack,moveRight,attack], window=600ms)  
**Engine Note**: −22/1.40×/95ms; cost 25; attack combo

---

### [Case 1441 — [GIMMICK] Galaxy Pegasus W105R2F Wing-Tip Smash (Gingka Hagane · Galaxy Pegasus W105R2F)](./13%20case%20study.md#case-1441)

**System**: Gen2-MFB / 4D-System · Attack  
**Geometry**: r_wing = 3.0 cm · A_wing = 4 mm² per tip · m = 43.0 g · I = 1.62×10⁻⁵ kg·m²  
**Material**: Galaxy Pegasus Metal Wheel: steel 30g (r_outer=30mm) · PC Frame · R2F tip rubber μ=0.62  
**Spin Coupling**: rigid  
**Contact Points**: F_wing = 177 N [M]; P = 22.3 MPa (below PC yield); 2 wing tips  
**Movement Freedom**: R2F tip: μ=0.62; dω/dt = −113 rad/s²  
**Base Stats**: Attack 95 · Defense 10 · Stamina 10 · Speed 100  
**Mechanism**: Galaxy Pegasus Metal Wheel: 2 asymmetric wing-blade protrusions at r=30mm. At ω=550 rad/s: v=16.5 m/s, KE=2.45 J, F_wing=177 N [M], P=22.3 MPa. R2F rubber tip: dω/dt=−113 rad/s². I_total=1.62×10⁻⁵ kg·m².  
**2.5D Rendering**: Wing-tip smash flash; high-speed orbit trail  
**Gimmick**: wingTipSmash(omega) → v_wing, F_wing, P_wing  
**Engine Note**: F_wing 177N; P 22.3MPa; R2F dω/dt −113 rad/s²

---

### [Case 1442 — [SPECIAL] Galaxy Nova (Gingka Hagane · Storm Pegasus 105RF / Galaxy Pegasus W105R2F)](./13%20case%20study.md#case-1442)

**System**: Gen2-MFB / 4D-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −40/×1.50/160ms; partial: −29/×1.37/95ms; miss: −12/×1.24/40ms  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 10 · Stamina 10 · Speed 100  
**Mechanism**: ↑ hold (500ms orbital charge) + release on constellation flash (200ms). BeySpirit nova ×4 [M]: F_BS=708 N, P_BS=89.2 MPa >> PC yield → layer fracture/burst [M]. ΔKE_opp=2.83 J [M]. powerCost 90. **Anime physics override**: BeySpirit concentrates rotational+translational KE into wing-tip at ×4; 89.2 MPa vs yield ~60 MPa; stellar nova burst explosion.  
**2.5D Rendering**: Constellation flash; nova point burst; stadium explosion effect  
**Gimmick**: galaxyNova(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Galaxy Nova · powerCost 90 · animeOverride true  
**Compatible beys**: Attack Metal Wheel ≥2 wing/blade at r≥2.5cm [M], A_tip≤6mm²; rubber tip μ≥0.55  
**Engine Note**: full: −40/1.50×/160ms; powerCost 90

---

### [Case 1443 — [COMBO] Nova Strike (↑ → J)](./13%20case%20study.md#case-1443)

**System**: Gen2-MFB / 4D-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −24; dmgMult 1.40×; lockMs 100  
**Movement Freedom**: —  
**Base Stats**: Attack 95 · Defense 10 · Stamina 10 · Speed 100  
**Mechanism**: ↑ (build vertical orbit, elevation potential) → → (arc laterally right, elevation→orbital speed) → J (directed nova strike at peak approach). Hit: −24, 1.40×, 100ms. Miss: −10, 1.22×, 35ms. Cost 25, attack type.  
**2.5D Rendering**: Diagonal high-speed arc; nova flash  
**Gimmick**: comboDetect(seq=[moveUp,moveRight,attack], window=600ms)  
**Engine Note**: −24/1.40×/100ms; cost 25; attack combo

---

### [Case 1444 — [GIMMICK] Dragoon G Left Engine Gear Vortex Air Column (Tyson Granger · Dragoon G)](./13%20case%20study.md#case-1444)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.2 cm · r_EG = 2.0 cm · m = 58.0 g · I = 1.22×10⁻⁵ kg·m²  
**Material**: Dragoon G AR: swept-blade geometry · Left EG: spring-wound co-spin · Grip base μ=0.50  
**Spin Coupling**: rigid  
**Contact Points**: v_tip_EG = 39.5 m/s [M]; F_draw_phys = 2.18 N [M]; F_draw_BS = 173 N [M] (×8)  
**Movement Freedom**: Grip base: μ=0.50; dω/dt = −93.2 rad/s²  
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 80  
**Mechanism**: LEG: E_spring≈2.5 J [M], Δω_EG=1266 rad/s, ω_post=1796 rad/s [M]. v_tip=39.5 m/s [M]. Free-vortex air column: v(r)=v_tip×r_AR/r. F_draw_phys=2.18 N [M] (positions opponent). BeySpirit ×8: v_BS=316 m/s [M], F_draw_BS=173 N [M] (irresistible). I_total=1.22×10⁻⁵ kg·m².  
**2.5D Rendering**: Vortex air column; draw-in pull arc; EG release flash  
**Gimmick**: vortexAirColumn(omega) → v_tip_EG, F_draw, F_draw_BS  
**Engine Note**: v_tip_EG 39.5 m/s [M]; F_draw_phys 2.18N [M]; BeySpirit ×8 → 173N [M]

---

### [Case 1445 — [SPECIAL] Galaxy Storm (Tyson Granger · Dragoon G)](./13%20case%20study.md#case-1445)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full perfect: −35/×1.44/150ms; partial: −25/×1.32/90ms; miss: −10/×1.22/35ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 80  
**Mechanism**: J (EG release, 150ms) → K (hold vortex 300ms) → J (draw-in strike 200ms). BeySpirit dragon wind ×8: v_storm=316 m/s [M], F_BS=173 N (opponent drawn in). Then AR smash at v_tip=39.5 m/s [M]. powerCost 85. **Anime physics override**: vortex ×8 to F3-tornado-speed; irresistible draw-in 173N; Dragoon wind spirit manifests.  
**2.5D Rendering**: Galaxy vortex column; draw-in spiral; AR smash  
**Gimmick**: galaxyStorm(vortexMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Galaxy Storm · powerCost 85 · animeOverride true  
**Compatible beys**: Left-rotation co-spin EG (E_spring≥2.0 J [M]); AR with ≥60% arc-sweep blade geometry  
**Engine Note**: full: −35/1.44×/150ms; powerCost 85

---

### [Case 1446 — [COMBO] Whirlwind Slash (J ↓ ←)](./13%20case%20study.md#case-1446)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −20; dmgMult 1.38×; lockMs 80  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 10 · Stamina 25 · Speed 80  
**Mechanism**: J (first claw-of-vortex strike, standing) → ↓ (drop, opponent pulled toward lower arc) → ← (swing CCW, second vortex-arc strike from low angle, spiral descent mimicry). Hit: −20, 1.38×, 80ms. Miss: −8, 1.20×, 28ms. Cost 25, attack type.  
**2.5D Rendering**: Descending vortex spiral; dual-pass arc  
**Gimmick**: comboDetect(seq=[attack,moveDown,moveLeft], window=600ms)  
**Engine Note**: −20/1.38×/80ms; cost 25; attack combo

---

### [Case 1447 — [GIMMICK] Dragoon GT Turbo Left EG Dual-Vortex Interference (Tyson Granger · Dragoon GT)](./13%20case%20study.md#case-1447)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.2 cm · r_TLEG = 2.2 cm · m = 60.0 g · I = 1.33×10⁻⁵ kg·m²  
**Material**: Dragoon GT AR: swept-blade · Turbo Left EG: E_spring≈3.5 J [M]  
**Spin Coupling**: rigid  
**Contact Points**: v_1 = 40.1 m/s [M]; v_2 (reflected) = 32.1 m/s [M]; v_max (constructive) = 72.2 m/s [M]; N_nodes = 4–6 [M]  
**Movement Freedom**: Grip base: μ=0.50; dω/dt = −93 rad/s²  
**Base Stats**: Attack 80 · Defense 10 · Stamina 20 · Speed 85  
**Mechanism**: TLEG: E=3.5 J [M], Δω=1283 rad/s, ω_T=1823 rad/s [M], v_tip=40.1 m/s [M]. Wall reflection e=0.80 → v_2=32.1 m/s [M]. Constructive interference: v_max=72.2 m/s [M], q_max=3191 Pa [M]. N_nodes≈4–6 around arena [M]. BeySpirit ×12: v_BS=866 m/s [M], q_BS≈460 kPa [M], F_node=1302 N/node [M].  
**2.5D Rendering**: Dual vortex node interference pattern; Dragoon effigy projections at nodes  
**Gimmick**: dualVortexInterference(omega) → v_primary, v_reflected, v_constructive, N_nodes  
**Engine Note**: v_max 72.2 m/s [M]; N_nodes 4–6 [M]; BeySpirit ×12 → 866 m/s [M]

---

### [Case 1448 — [SPECIAL] Galaxy Turbo Twister (Tyson Granger · Dragoon GT)](./13%20case%20study.md#case-1448)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full perfect: −42/×1.50/170ms; partial: −29/×1.38/100ms; miss: −12/×1.26/40ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 10 · Stamina 20 · Speed 85  
**Mechanism**: J (TLEG release, 150ms) → ↑ (sustain rotation 300ms, interference pattern builds) → J (release all nodes, 200ms). BeySpirit ×12 each node [M]: F_node_BS=1302 N [M]. Multi-target: primary full dmgMult; secondary/tertiary ×0.7 [M]. powerCost 95. **Anime physics override**: hypersonic vortex 866 m/s; simultaneous Dragoon effigy multi-target nodes; dual-orbit coverage.  
**2.5D Rendering**: Multi-node Dragoon effigy; simultaneous multi-target strikes  
**Gimmick**: galaxyTurboTwister(vortexPower, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Galaxy Turbo Twister · powerCost 95 · animeOverride true  
**Compatible beys**: Turbo EG (E_spring≥3.0 J [M], left rotation); AR ≥70% arc sweep [M]  
**Engine Note**: full: −42/1.50×/170ms; powerCost 95; multi-target ×0.7

---

### [Case 1449 — [COMBO] Turbo Spiral (← ↑ J)](./13%20case%20study.md#case-1449)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.40×; lockMs 95  
**Movement Freedom**: —  
**Base Stats**: Attack 75 · Defense 10 · Stamina 20 · Speed 85  
**Mechanism**: ← (wind up CCW in LEG direction) → ↑ (climb bowl slope, build centrifugal energy) → J (release spinning descent strike from apex, single-vortex convergence). Hit: −22, 1.40×, 95ms. Miss: −10, 1.22×, 35ms. Cost 25, attack type.  
**2.5D Rendering**: CCW wind-up arc; descent strike  
**Gimmick**: comboDetect(seq=[moveLeft,moveUp,attack], window=600ms)  
**Engine Note**: −22/1.40×/95ms; cost 25; attack combo

---

### [Case 1450 — [GIMMICK] Gatling Dragon Movable-Blade SHM to CHM Mode Switch (Dante Koryu · Gatling Dragon Metal Charge)](./13%20case%20study.md#case-1450)

**System**: Gen4-Burst / BU-System · Attack  
**Geometry**: r_blade_SHM = 4.0 cm · r_blade_CHM = 3.3 cm · m = 58.0 g · I = 3.93×10⁻⁵ kg·m²  
**Material**: Gatling Dragon Blade: spring-pivot movable blades · Metal Charge Chassis: integral driver μ=0.12  
**Spin Coupling**: rigid (SHM locked); spring-pivot (CHM transition)  
**Contact Points**: F_SHM = 387 N [M]; P = 24.3 MPa; mode-switch: F_switch≥20 N [M]; CHM: 3 contacts/rev, F_CHM=191 N each  
**Movement Freedom**: Metal Charge driver: μ=0.12; dω/dt = −6.9 rad/s²  
**Base Stats**: Attack 100 · Defense 20 · Stamina 35 · Speed 80  
**Mechanism**: Two spring-pivot blades at r=40mm (SHM)/33mm (CHM). SHM: dragon jaws closed, circular contact. CHM: blades pivot inward on F≥20N [M] → elliptical, 3 contacts/rev. F_SHM=387 N [M], P=24.3 MPa (sub-yield). CHM: F=191 N/contact, J_total_CHM=2.87 N·s/rev [M]. Spring reset on impulse decay. I_total=3.93×10⁻⁵ kg·m².  
**2.5D Rendering**: Blade-pivot animation SHM↔CHM; mode indicator; 3-contact ellipse  
**Gimmick**: bladeModeSwitchSHM_CHM(F_hit) → mode, F_contact, N_contacts  
**Engine Note**: F_SHM 387N; P 24.3MPa; switch threshold 20N [M]; CHM 3×191N/rev [M]

---

### [Case 1451 — [SPECIAL] Gambit Break (Dante Koryu · Gatling Dragon Metal Charge)](./13%20case%20study.md#case-1451)

**System**: Gen4-Burst / BU-System · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: SHM+perfect: −36/×1.48/155ms; CHM+perfect: −28/×1.38/110ms; SHM+miss: −18/×1.28/55ms  
**Movement Freedom**: —  
**Base Stats**: Attack 100 · Defense 20 · Stamina 35 · Speed 80  
**Mechanism**: → (charge 300ms) + J (150ms window). BeySpirit ×2 speed [M]: ω_BS=1000 rad/s, v_BS=40.0 m/s, F_BS_SHM=773 N [M], P_BS=48.3 MPa (near-yield). Opponent recoil → CHM: F_CHM_BS=382 N/contact, 3 hits. powerCost 85. **Anime physics override**: BeySpirit doubles ω; 773N near-yield SHM; burst at full 60 MPa charge; spring-pivot mode switch is physical.  
**2.5D Rendering**: Speed-up double-ω flash; SHM strike; CHM follow-up  
**Gimmick**: gambitBreak(modeActive, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Gambit Break · powerCost 85 · animeOverride true  
**Compatible beys**: Spring-pivot movable blade (r_extended≥3.5cm [M], F_switch≤25N [M]); heavy chassis ≥50g [M]  
**Engine Note**: SHM+perfect: −36/1.48×/155ms; CHM+perfect: −28/1.38×; powerCost 85

---

### [Case 1452 — [COMBO] Dragon Blade Rush (→ J ↑)](./13%20case%20study.md#case-1452)

**System**: Gen4-Burst / BU-System · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.40×; lockMs 90  
**Movement Freedom**: —  
**Base Stats**: Attack 95 · Defense 20 · Stamina 35 · Speed 80  
**Mechanism**: → (orbit right, blade-face toward opponent) → J (SHM blade strike at contact) → ↑ (ride momentum up slope after hit, opponent cannot recover laterally). Hit: −22, 1.40×, 90ms. Miss: −10, 1.22×, 32ms. Cost 25, attack type.  
**2.5D Rendering**: Blade strike; upward momentum follow-through  
**Gimmick**: comboDetect(seq=[moveRight,attack,moveUp], window=600ms)  
**Engine Note**: −22/1.40×/90ms; cost 25; attack combo

---

### [Case 1453 — [GIMMICK] Driger G Right Engine Gear Stroboscopic Clone Effect (Ray Kon · Driger G)](./13%20case%20study.md#case-1453)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.0 cm · m = 54.0 g · I = 1.01×10⁻⁵ kg·m²  
**Material**: Driger G AR: 2 tiger-claw protrusions · Right EG: spring E≈2.0 J [M] · Grip base μ=0.50  
**Spin Coupling**: rigid  
**Contact Points**: f_rot = 264.5 Hz [M]; 2 claws × 13.2 positions/f_persist = 26 apparent positions → 5–6 clones [M]; J_hit = 1.79×10⁻⁴ N·s [M]  
**Movement Freedom**: Grip base: dω/dt = −105 rad/s² (high, exhausts quickly)  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: REG: E=2.0 J [M], Δω=1132 rad/s, ω_post=1662 rad/s [M], v_AR=33.2 m/s [M]. f_rot=264.5 Hz [M]. Eye persistence 50ms: 2×13.2=26 apparent positions → 5–6 perceived clones [M]. f_claw=529 Hz: ~159 micro-impacts in 300ms. J_hit=1.79×10⁻⁴ N·s each. I_total=1.01×10⁻⁵ kg·m².  
**2.5D Rendering**: Stroboscopic 5-clone ghost images; high-frequency claw flash  
**Gimmick**: stroboscopicClone(omega_post_EG) → f_rot, N_apparent_positions, N_clones  
**Engine Note**: f_rot 264.5Hz [M]; 5–6 perceived clones [M]; f_claw 529Hz [M]; 159 hits/300ms [M]

---

### [Case 1454 — [SPECIAL] Gatling Claw (Ray Kon · Driger G)](./13%20case%20study.md#case-1454)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: 5 clones: −38/×1.48/160ms; 3 clones: −31/×1.40/120ms; miss: −10/×1.20/30ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: J (EG release) → J (clone strike 300ms window). BeySpirit tiger spirit: energy clone at each of 5 stroboscopic positions, each ×4 force [M]: F_per_clone_BS=2388 N [M]; 5-clone total=11940 N [M] (multi-angle). powerCost 85. **Anime physics override**: Tiger spirit energy manifestation at each clone position; ×4 force amplification per clone; simultaneous multi-vector assault.  
**2.5D Rendering**: 5 tiger-spirit energy clones; multi-angle assault  
**Gimmick**: gatlingClaw(cloneHits, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Gatling Claw · powerCost 85 · animeOverride true  
**Compatible beys**: Right-rotation co-spin EG (E≥1.8 J [M]); ≥2 claw/fang at r≥1.8cm [M]  
**Engine Note**: 5 clones: −38/1.48×/160ms; powerCost 85

---

### [Case 1455 — [COMBO] Tiger Flash (J ← J)](./13%20case%20study.md#case-1455)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −22; dmgMult 1.40×; lockMs 85  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: J (initial EG-boosted claw strike) → ← (swing CCW away, bleed EG spin) → J (return claw from opposite arc, two-point flanking). Hit: −22, 1.40×, 85ms. Miss: −9, 1.20×, 30ms. Cost 25, attack type.  
**2.5D Rendering**: Two-point flanking claw arcs  
**Gimmick**: comboDetect(seq=[attack,moveLeft,attack], window=600ms)  
**Engine Note**: −22/1.40×/85ms; cost 25; attack combo

---

### [Case 1456 — [GIMMICK] Driger G Super-Charged Lightning Over-Rev (Ray Kon · Driger G)](./13%20case%20study.md#case-1456)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.0 cm · m = 54.0 g · I = 1.01×10⁻⁵ kg·m² · ω_super = 2510 rad/s [M]  
**Material**: Same as Case 1453  
**Spin Coupling**: rigid  
**Contact Points**: v_super = 50.2 m/s [M]; F_per_strike = 903 N [M]; P = 113 MPa >> PC yield [M] → catastrophic burst  
**Movement Freedom**: Grip base dω/dt = −105 rad/s² (sustained at ω_super for ~18.9s)  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: BeySpirit over-rev ×1.51 above EG ceiling [M]: ω_super=2510 rad/s [M]. f_super=399.5 Hz [M] >> critical flicker 50 Hz → continuous green blur (imperceptible speed [M]). Eye persistence: 2×(399.5×0.050)=39.9 → blur not clones. F_strike=903 N [M], P=113 MPa >> yield → catastrophic. KE_super=31.8 J [M] (7.2× EG peak).  
**2.5D Rendering**: Continuous green energy disc (no discrete positions); imperceptible-speed effect  
**Gimmick**: overRevLightning(omega_super) → f_super, F_strike, P_contact  
**Engine Note**: ω_super 2510 rad/s [M]; f 399.5Hz [M]; F 903N [M]; P 113MPa [M]; KE 31.8J [M]

---

### [Case 1457 — [SPECIAL] Gatling Claw Maximum (Ray Kon · Driger G)](./13%20case%20study.md#case-1457)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full charge perfect: −44/×1.50/175ms; partial: −32/×1.38/108ms; miss: −14/×1.28/45ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: Hold K (500ms BeySpirit charge) + release (150ms flash). ω_super=2510 rad/s [M], green disc blur. F=903 N [M], P=113 MPa >> yield → burst on contact. powerCost 95. **Anime physics override**: BeySpirit provides ~18J above EG ceiling (physical max ~4.4 J at ω_post_EG); continuous omnidirectional contact pressure; imperceptible speed (399.5 Hz).  
**2.5D Rendering**: Green disc over-rev; continuous contact pressure field  
**Gimmick**: gatlingClawMaximum(chargeMs, qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Gatling Claw Maximum · powerCost 95 · animeOverride true  
**Compatible beys**: Right EG + ≥2 claws; BeySpirit ≥80% [M]; ω_super requires +300 rad/s above EG ceiling  
**Engine Note**: full: −44/1.50×/175ms; powerCost 95

---

### [Case 1458 — [COMBO] Claw Maximum Rush (K J ←)](./13%20case%20study.md#case-1458)

**System**: Gen1-Plastic / EGS · Combo  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: spinDelta −30; dmgMult 1.46×; lockMs 130  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 15 · Stamina 20 · Speed 80  
**Mechanism**: K (gather BeySpirit, coil before strike) → J (amplified charged claw hit, not full over-rev) → ← (bleed CCW, reposition). Hit: −30, 1.46×, 130ms. Miss: −12, 1.26×, 40ms. Cost 35, attack type.  
**2.5D Rendering**: Charge posture; enhanced claw hit; CCW reposition  
**Gimmick**: comboDetect(seq=[defense,attack,moveLeft], window=600ms)  
**Engine Note**: −30/1.46×/130ms; cost 35; attack combo

---

### [Case 1459 — [GIMMICK] Driger G Multi-Pass Translational Rush Mechanics (Ray Kon · Driger G, manga)](./13%20case%20study.md#case-1459)

**System**: Gen1-Plastic / EGS · Attack  
**Geometry**: r_AR = 2.0 cm · v_approach = 4.5 m/s [M] · N_passes = 5 [M] · pass_interval = 63 ms [M]  
**Material**: Same as Case 1453 (EG held in reserve)  
**Spin Coupling**: rigid  
**Contact Points**: v_contact = 15.1 m/s [M]; F_pass = 204 N [M]; J_total = 4.08 N·s [M]; J_total_BS = 7.72 N·s [M]  
**Movement Freedom**: Grip base translational: v_orb≈2.0 m/s CoM; orbital pass interval ~63ms  
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 85  
**Mechanism**: Manga variant: 5 rapid orbital passes (no EG release during attack). v_contact=10.6+4.5=15.1 m/s [M], F_pass=204 N [M]. Pass interval ~63ms. J_total=4.08 N·s [M]. BeySpirit ×4 approach: v_approach_BS=18.0 m/s [M], F_pass_BS=386 N [M], J_total_BS=7.72 N·s [M].  
**2.5D Rendering**: 5 rapid pass arcs; cumulative impulse accumulation  
**Gimmick**: multiPassRush(N_passes, v_approach) → J_total, J_total_BS  
**Engine Note**: N_passes 5 [M]; pass_interval 63ms [M]; J_total 4.08 N·s [M]; BS J_total 7.72 N·s [M]

---

### [Case 1460 — [SPECIAL] Gatling Fang (Ray Kon · Driger G, manga)](./13%20case%20study.md#case-1460)

**System**: Gen1-Plastic / EGS · Special Move  
**Geometry**: —  
**Material**: —  
**Spin Coupling**: —  
**Contact Points**: full perfect: −38/×1.46/155ms; partial: −26/×1.36/100ms; miss: −10/×1.22/35ms  
**Movement Freedom**: —  
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 85  
**Mechanism**: → (charge 200ms) + J (trigger 5-pass burst, 150ms window). BeySpirit ×4 approach [M]: F_pass_BS=386 N [M], J_total_BS=7.72 N·s [M]. powerCost 85. **Anime physics override**: BeySpirit ×4 approach speed; 5-pass cumulative J >7N·s against any opponent.  
**2.5D Rendering**: 5 rapid sequential pass arcs; cumulative momentum trail  
**Gimmick**: gatlingFang(qteHit) → spinDelta, dmgMult, lockMs  
**Special Move**: Gatling Fang (manga) · powerCost 85 · animeOverride true  
**Compatible beys**: ≥2 claws/fangs at r≥1.5cm [M]; rubber/grip tip v_orb≥3.5 m/s [M]; no EG required  
**Engine Note**: full: −38/1.46×/155ms; powerCost 85

---

### [Case 1461 — [COMBO] Fang Barrage (J → K)](./13%20case%20study.md#case-1461)

**System**: Gen1-Plastic / EGS · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: secondPassHit: −18/1.38×/75ms; miss: −8/1.18×/25ms
**Movement Freedom**: —
**Base Stats**: Attack 80 · Defense 10 · Stamina 25 · Speed 85
**Mechanism**: J (first pass) → → (close gap) → K (second-pass guard-strike). Second pass hit: −18, 1.38×, 75ms. Miss: −8, 1.18×, 25ms. Cost 25, attack type.
**2.5D Rendering**: Double-arc pass flash on K
**Gimmick**: comboDetect(seq=[attack,moveRight,defense], window=600ms)
**Engine Note**: secondPassHit: −18/1.38×/75ms; miss: −8/1.18×/25ms; cost 25; attack combo

---

### [Case 1462 — [GIMMICK] SP230 Ultra-Tall Spin Track Precession Geometry (Kira Hayama · Gladiator Bahamut SP230GF)](./13%20case%20study.md#case-1462)

**System**: Gen2-MFB / Zero-G Chrome Wheel · Stamina/Defense
**Geometry**: r = 3.90 cm · m = 47.0 g · I = 4.103×10⁻⁵ kg·m² · ω₀ = 550 rad/s · h_SP230 = 2.30 cm · h_105 = 1.05 cm
**Material**: Chrome Wheel Bahamut + GF tip (μ=0.65, r=0.5 cm)
**Spin Coupling**: SP230 height ratio 2.19× over 105 track; COM d_SP230 = 3.1 cm vs d_105 = 1.85 cm
**Contact Points**: GF tip: τ_f = 1.498×10⁻³ N·m; t_spin = 15.1 s; P_floor = 0.824 W
**Movement Freedom**: Elevated SP230 shifts CoM 1.68× higher — precession Ω_SP230 = 0.994 rad/s vs 0.594 for 105
**Base Stats**: Attack 20 · Defense 65 · Stamina 70 · Speed 25
**Mechanism**: I_total = 4.103e-5 kg·m²; L₀ = 2.257e-2 kg·m²/s. SP230 raises COM by 31mm vs 18.5mm → precession rate 67% higher (Ω = τ/L, τ proportional to d_COM). GF tip μ=0.65 locks pivot-anchor at high ω. Precession frequency 0.994 rad/s = 0.158 Hz (one full precession orbit per 6.3 s).
**2.5D Rendering**: Elevated SP230 silhouette; slow precession orbit arc
**Gimmick**: sp230Precession(ω, I, COM_height) → Ω_prec, stability
**Engine Note**: h_SP230 2.30 cm; I 4.103e-5; Ω_prec 0.994 rad/s; t_spin 15.1 s (GF tip)

---

### [Case 1463 — [SPECIAL] Gladiator Demolition (Kira Hayama · Gladiator Bahamut SP230GF)](./13%20case%20study.md#case-1463)

**System**: Gen2-MFB / Zero-G Chrome Wheel · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: centred+perfect: −53→capped/1.50×/200ms; centred+miss: −42/1.45×/200ms; not centred+miss: −12/1.22×/50ms
**Movement Freedom**: —
**Base Stats**: Attack 25 · Defense 70 · Stamina 65 · Speed 25
**Mechanism**: → hold (400ms) + J (200ms). centred+perfect: −53/1.50×/200ms; centred+miss: −42/1.45×/200ms; not centred: −12/1.22×/50ms. powerCost 90. BeySpirit ×10: F_BS = 3.00 N, A_BS = 11.6 mm [M]. **Anime physics override**: SP230 elevated COM magnifies torque arm ×10 via BeySpirit.
**2.5D Rendering**: SP230 elevated crash; tower-drop impulse arc
**Gimmick**: gladiatorDemolition(centred, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Gladiator Demolition · powerCost 90 · animeOverride true
**Compatible beys**: Chrome Wheel ≥25 g at r≥2.8 cm + SP230 + GF tip [M]
**Engine Note**: centred+perfect: −53/1.50×/200ms; powerCost 90

---

### [Case 1464 — [COMBO] Arena Crack (→ → K)](./13%20case%20study.md#case-1464)

**System**: Gen2-MFB / Zero-G Chrome Wheel · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: centred: −16/1.38×/80ms; not: −8/1.18×/30ms
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 65 · Stamina 70 · Speed 25
**Mechanism**: → → (approach) → K (brace + crash). Centred: −16, 1.38×, 80ms. Not centred: −8, 1.18×, 30ms. Cost 25, balanced type.
**2.5D Rendering**: Double-forward rush then guard-crash flash
**Gimmick**: comboDetect(seq=[moveRight,moveRight,defense], window=600ms)
**Engine Note**: centred: −16/1.38×/80ms; not: −8/1.18×/30ms; cost 25; balanced combo

---

### [Case 1465 — [GIMMICK] Synchrome Dual-Chrome-Wheel Mass Stacking SP230R2F (Kira Hayama · Pegasus Bahamoote)](./13%20case%20study.md#case-1465)

**System**: Gen2-MFB / Zero-G Synchrome · Stamina/Attack
**Geometry**: r_outer = 3.30 cm · m_synchrome = 72.0 g · I_synchrome = 7.039×10⁻⁵ kg·m² · ω₀ = 480 rad/s
**Material**: CW Bahamut (inner, m=33 g, r=3.1 cm) + CW Pegasus (outer, m=28 g, r=3.3 cm) + WW+SFB (I=8.214×10⁻⁶)
**Spin Coupling**: L₀ = 3.379×10⁻² kg·m²/s (Synchrome combined L = 2× single-CW values)
**Contact Points**: R2F tip: r=7 mm, μ=0.62, τ_f = 3.062×10⁻³ N·m; t_spin = 11.0 s; P_floor = 1.470 W (+78% vs single-CW GF)
**Movement Freedom**: Outer CW Pegasus at r=33 mm adds 36% more I than single CW; dual-BitBeast BeySpirit available
**Base Stats**: Attack 35 · Defense 50 · Stamina 55 · Speed 40
**Mechanism**: I_B = 3.169e-5, I_P = 3.049e-5; I_synchrome = 7.039e-5. R2F vs GF: P_floor 1.470 W vs 0.824 W. Dual-BitBeast Pegasus+Bahamut synchrome bond amplifies output [M].
**2.5D Rendering**: Dual Chrome Wheel silhouette; synchrome mass-stack visible in cross-section
**Gimmick**: synchromeStack(I_B, I_P, I_WW) → I_total, L₀, P_floor
**Engine Note**: I_synchrome 7.039e-5; L₀ 3.379e-2; P_floor 1.470 W (R2F tip)

---

### [Case 1466 — [SPECIAL] Final Ultimate Demolition (Kira Hayama)](./13%20case%20study.md#case-1466)

**System**: Gen2-MFB / Zero-G Synchrome · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: synchromeBonus+perfect: −70→capped/1.50×/220ms; no synchrome+perfect: −48/1.50×/220ms; sync+miss: −22/1.50×/60ms
**Movement Freedom**: —
**Base Stats**: Attack 40 · Defense 45 · Stamina 50 · Speed 40
**Mechanism**: → (400ms park) → → (200ms) + J (300ms dual BitBeast release). synchromeBonus+perfect: capped 1.50×/220ms; no synchrome+perfect: −48/1.50×/220ms; sync+miss: −22/1.50×/60ms. powerCost 100. BeySpirit dual-BitBeast ×2: A_floor = 33.9 mm [M] (3× ABS structural failure). **Anime physics override**: dual BitBeast force exceeds all material limits.
**2.5D Rendering**: Dual BitBeast release aura; twin-wave impact arc
**Gimmick**: finalUltimateDemolition(synchrome, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Final Ultimate Demolition · powerCost 100 · animeOverride true
**Compatible beys**: Synchrome I≥6.0×10⁻⁵ [M] + SP230 [M]
**Engine Note**: synchromeBonus+perfect: capped/1.50×/220ms; powerCost 100

---

### [Case 1467 — [COMBO] Sync Shatter (→ → J)](./13%20case%20study.md#case-1467)

**System**: Gen2-MFB / Zero-G Synchrome · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: synchromeActive: −20/1.42×/90ms; not: −10/1.20×/35ms
**Movement Freedom**: —
**Base Stats**: Attack 35 · Defense 50 · Stamina 55 · Speed 40
**Mechanism**: → → (dual-mass approach) + J (shatter). synchromeActive: −20, 1.42×, 90ms. Not: −10, 1.20×, 35ms. Cost 25, attack type.
**2.5D Rendering**: Dual-CW mass approach trail; shatter burst
**Gimmick**: comboDetect(seq=[moveRight,moveRight,attack], window=600ms)
**Engine Note**: synchromeActive: −20/1.42×/90ms; not: −10/1.20×/35ms; cost 25; attack combo

---

### [Case 1468 — [GIMMICK] Genesis Special Dual-Blade Alignment Burst Force (Valt Aoi · Strike Valtryek 6Vortex Reboot)](./13%20case%20study.md#case-1468)

**System**: Gen3-Burst / Surge·SuperKing · Attack
**Geometry**: r = ~3.0 cm · m = 53.0 g · I = 3.842×10⁻⁵ kg·m² · ω₀ = 680 rad/s
**Material**: Genesis Special aligned dual protrusions at r≥2.8 cm; EL blade type
**Spin Coupling**: L₀ = 2.613×10⁻² kg·m²/s; single blade F = 32.9 N, dual aligned F = 65.9 N
**Contact Points**: Dual aligned: τ_burst = 2.109 N·m [M] (4× standard threshold → near-certain burst). BeySpirit ×5: F_BS = 329 N [M], τ_BS = 10.53 N·m [M]
**Movement Freedom**: —
**Base Stats**: Attack 90 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: I = 3.842e-5, ω₀ = 680, L₀ = 2.613e-2. Single blade: F = m_eff × v² = 32.9 N [M], τ_burst = 1.053 N·m [M]. Dual aligned: F_double = 65.9 N [M], τ = 2.109 N·m [M] → 4× standard burst threshold. BeySpirit ×5 amplification to full storm [M].
**2.5D Rendering**: Dual blade protrusion flash; burst-probability indicator surge
**Gimmick**: genesisAlignment(dual, ω) → F_double, τ_burst
**Engine Note**: single τ 1.053 N·m [M]; dual τ 2.109 N·m [M]; ω₀ 680 rad/s

---

### [Case 1469 — [SPECIAL] Genesis Whip / God Slash (Valt Aoi · Strike Valtryek 6Vortex Reboot)](./13%20case%20study.md#case-1469)

**System**: Gen3-Burst / Surge·SuperKing · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: dualAligned+perfect: capped/1.50×/208ms; not dual+perfect: −30/1.44×/130ms; miss: −10/1.20×/40ms
**Movement Freedom**: —
**Base Stats**: Attack 90 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: J (250ms) + ← (150ms). dualAligned+perfect: capped/1.50×/208ms; not dual+perfect: −30/1.44×/130ms; miss: −10/1.20×/40ms. powerCost 80. **Anime physics override**: Genesis Special dual EL blade alignment: τ_burst 4× standard → near-certain burst on any opponent.
**2.5D Rendering**: Dual-blade whip arc; burst-flash on contact
**Gimmick**: genesisWhip(dual, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Genesis Whip / God Slash · powerCost 80 · animeOverride true
**Compatible beys**: Genesis Special aligned EL blade protrusions r≥2.8 cm [M]
**Engine Note**: dualAligned+perfect: capped/1.50×/208ms; powerCost 80

---

### [Case 1470 — [COMBO] Whip Cross (J ← J)](./13%20case%20study.md#case-1470)

**System**: Gen3-Burst / Surge·SuperKing · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: secondAligned: −22/1.42×/100ms; not: −10/1.22×/40ms
**Movement Freedom**: —
**Base Stats**: Attack 90 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: J (first hit) → ← (flank) → J (second aligned hit). secondAligned: −22, 1.42×, 100ms. Not: −10, 1.22×, 40ms. Cost 25, attack type.
**2.5D Rendering**: Two-hit arc; second flash on second J
**Gimmick**: comboDetect(seq=[attack,moveLeft,attack], window=600ms)
**Engine Note**: secondAligned: −22/1.42×/100ms; not: −10/1.22×/40ms; cost 25; attack combo

---

### [Case 1471 — [GIMMICK] Reboot Driver Spring-Retract Tip-Speed Burst (Valt Aoi · Genesis Valtryek 6Vortex Reboot)](./13%20case%20study.md#case-1471)

**System**: Gen3-Burst / Surge · Stamina/Attack
**Geometry**: r_tip_ext = 0.55 cm (extended) → r_tip_ret = 0.20 cm (retracted); k_spring = 80 N/m; x_max = 4 mm
**Material**: EL spring; rubber retract/extend mechanism
**Spin Coupling**: Mechanism 1: tip retraction reduces friction 63.6%. Mechanism 2: EL spring PE = 6.40×10⁻⁴ J; Δv = 0.505 m/s physical
**Contact Points**: BeySpirit t_r = 8 s → Δω = +95.0 rad/s [M]; k_BS = 800 N/m → Δv_BS = 1.60 m/s [M]
**Movement Freedom**: Stability: θ_max_ret = 1.43° (retracted, 2.75× smaller tilt tolerance vs extended 3.93°)
**Base Stats**: Attack 70 · Defense 35 · Stamina 55 · Speed 70
**Mechanism**: Retraction at t_r=2s (physical): +23.7 rad/s spin boost from friction reduction alone. BeySpirit extends retract to t_r=8s → +95.0 rad/s [M]. EL spring k=80 N/m: PE=6.40e-4J, Δv=0.505 m/s physical. Stability trade-off: retracted tip = 2.75× narrower tilt tolerance.
**2.5D Rendering**: Tip-retract animation (shrink at r_tip); spring-glow on extend
**Gimmick**: rebootRetract(t_r, k_spring) → Δω_spin, Δv_spring
**Engine Note**: Δω_physical +23.7 rad/s; Δω_BS +95.0 rad/s [M]; Δv_spring 0.505 m/s physical / 1.60 m/s [M]

---

### [Case 1472 — [SPECIAL] Genesis Reboot / God Reboot (Valt Aoi)](./13%20case%20study.md#case-1472)

**System**: Gen3-Burst / Surge · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: spring+dodge+perfect: capped/1.50×/120ms; no spring+dodge+perfect: −28/1.40×/120ms; dodge failed: +25 self spinloss/0.80×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 70 · Defense 35 · Stamina 55 · Speed 70
**Mechanism**: K (absorb 200ms) + ← (Reboot evasion 300ms) + J (spring counter 200ms). spring+dodge+perfect: capped/1.50×/120ms; no spring+dodge+perfect: −28/1.40×/120ms; dodge failed: +25 self spinloss/0.80×/0ms. powerCost 75. **Anime physics override**: Reboot tip spring mechanism fires counter with BeySpirit-amplified Δv = 1.60 m/s [M].
**2.5D Rendering**: Evasion arc; spring-release counter flash
**Gimmick**: genesisReboot(springCharged, dodgeSuccess, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Genesis Reboot / God Reboot · powerCost 75 · animeOverride true
**Compatible beys**: Reboot / Ultimate Reboot Performance Tip
**Engine Note**: spring+dodge+perfect: capped/1.50×/120ms; powerCost 75

---

### [Case 1473 — [COMBO] Reboot Rush (K → J)](./13%20case%20study.md#case-1473)

**System**: Gen3-Burst / Surge · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: springCharged: −18/1.38×/80ms; not: −8/1.18×/30ms
**Movement Freedom**: —
**Base Stats**: Attack 70 · Defense 35 · Stamina 55 · Speed 70
**Mechanism**: K (absorb/spring-charge) → → (approach) → J (spring discharge). springCharged: −18, 1.38×, 80ms. Not: −8, 1.18×, 30ms. Cost 25, balanced type.
**2.5D Rendering**: Spring-charge glow on K; release flash on J
**Gimmick**: comboDetect(seq=[defense,moveRight,attack], window=600ms)
**Engine Note**: springCharged: −18/1.38×/80ms; not: −8/1.18×/30ms; cost 25; balanced combo

---

### [Case 1474 — [GIMMICK] Tip-Lock Dual-Bey Angular Momentum Coupling (Julia+Raul · Thunder Pegasus + Torch Pegasus)](./13%20case%20study.md#case-1474)

**System**: Gen2-MFB / Metal Masters · Cooperative
**Geometry**: m₁ = m₂ = 33 g · I₁ = I₂ = 2.350×10⁻⁵ kg·m² · ω₁ = 520 rad/s · ω₂ = 505 rad/s
**Material**: Two co-spinning Thunder+Torch Pegasus assemblies; rubber tips μ≥0.60 [M]; FW≥20 g each [M]
**Spin Coupling**: ω_common = 512.3 rad/s [M]; I_combined = 4.706×10⁻⁵; L_combined = 2.411×10⁻² kg·m²/s
**Contact Points**: Heavy cutter drop h=30 mm [M]: F_grav = 25.3 N, F_rot = 401.9 N, F_total = 427.2 N [M]. BeySpirit ×5: F_BS = 2136 N [M]
**Movement Freedom**: Tip-Lock binds both beys at common ω via frictional coupling [M]
**Base Stats**: Attack 75 · Defense 20 · Stamina 35 · Speed 75
**Mechanism**: Thunder: I₁ = 2.350e-5, ω₁ = 520. Torch: I₂ = 2.350e-5, ω₂ = 505. ω_common = 512.3 rad/s [M] via angular momentum coupling. Combined I = 4.706e-5, L = 2.411e-2. BeySpirit ×5: F_BS = 2136 N [M].
**2.5D Rendering**: Twin-bey tip-lock animation; combined rotation circle
**Gimmick**: tipLock(I1, ω1, I2, ω2) → ω_common, L_combined
**Engine Note**: ω_common 512.3 rad/s [M]; L_combined 2.411e-2; F_cutter 427.2 N [M]

---

### [Case 1475 — [SPECIAL] Gemini Crash (Julia+Raul Fernandez)](./13%20case%20study.md#case-1475)

**System**: Gen2-MFB / Metal Masters · Special Move (Cooperative)
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: bothLaunched+tipLocked+perfect: −50/1.50×/200ms; tipLocked no perfect: −35/1.38×/80ms; not tipLocked: −20/1.28×/50ms; single bey: −10/1.18×/25ms
**Movement Freedom**: —
**Base Stats**: Attack 75 · Defense 20 · Stamina 35 · Speed 75
**Mechanism**: J₁+J₂ (within 100ms) → ← (converge 400ms) → J (cutter drop 200ms). powerCost 100 (50 each). Two-player cooperative. bothLaunched+tipLocked+perfect: −50/1.50×/200ms. **Anime physics override**: BeySpirit ×5 tip-lock amplification; F_total = 427.2 N → 2136 N [M].
**2.5D Rendering**: Dual-bey converge; cutter-drop impact flash
**Gimmick**: geminiCrash(tipLocked, bothLaunched, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Gemini Crash · powerCost 100 (50 each) · animeOverride true
**Compatible beys**: Two co-spinning same-direction beys, rubber tips μ≥0.60 [M], FW≥20 g each [M]
**Engine Note**: bothLaunched+tipLocked+perfect: −50/1.50×/200ms; powerCost 100

---

### [Case 1476 — [COMBO] Twin Strike (J → ←)](./13%20case%20study.md#case-1476)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: bothArmed: −20/1.40×/90ms; not: −10/1.20×/35ms
**Movement Freedom**: —
**Base Stats**: Attack 75 · Defense 20 · Stamina 35 · Speed 75
**Mechanism**: J (first bey strike) → → (gap close) → ← (second bey cross-strike). bothArmed: −20, 1.40×, 90ms. Not: −10, 1.20×, 35ms. Cost 25, attack type.
**2.5D Rendering**: Cross-pattern dual-arc on ←
**Gimmick**: comboDetect(seq=[attack,moveRight,moveLeft], window=600ms)
**Engine Note**: bothArmed: −20/1.40×/90ms; not: −10/1.20×/35ms; cost 25; attack combo

---

### [Case 1477 — [GIMMICK] Proof Frame Floor-Grinding Tilt-Recovery Drift Boost (Free De La Hoya · Geist Fafnir 8'Proof Absorb)](./13%20case%20study.md#case-1477)

**System**: Gen3-Burst / Cho-Z·GT · Stamina
**Geometry**: r_frame = ~3.5 cm · θ_tilt = 15° · ω = 400 rad/s
**Material**: Wide outer disc frame r≥3.5 cm; Absorb or translational tip
**Spin Coupling**: Frame spin drain 3.45× faster than tip (τ_frame = 1.548×10⁻³ vs τ_tip = 4.49×10⁻⁴ N·m)
**Contact Points**: BeySpirit ×5: a_BS = 3.81 m/s² [M]; Δv = 3.81 m/s [M] over 1.5 s. Physical: F_drive = 0.0387 N, a = 0.760 m/s², Δv = 1.14 m/s [M]
**Movement Freedom**: Frame floor contact when tilted: v_frame = 16.0 m/s, drift boost enables Geist Counter Phase 2
**Base Stats**: Attack 15 · Defense 25 · Stamina 95 · Speed 50
**Mechanism**: θ=15°, ω=400 rad/s: F_N_frame = 0.1290 N, F_drive = 0.0387 N, v_frame = 16.0 m/s, a_drift = 0.760 m/s², Δv over 1.5 s = 1.14 m/s [M]. Frame drain 3.45× tip drain. BeySpirit ×5: a_BS = 3.81 m/s², Δv = 3.81 m/s [M]. DISTINCT from Case 624 (Absorb Break).
**2.5D Rendering**: Frame ground-contact spark trail at tilt angle; drift speed boost indicator
**Gimmick**: proofFrameDrift(θ_tilt, ω, t_grind) → F_drive, a_drift, Δv
**Engine Note**: θ 15°; F_drive 0.0387 N; a_drift 0.760 m/s² physical / 3.81 m/s² [M]; τ_frame 1.548e-3 N·m

---

### [Case 1478 — [SPECIAL] Geist Counter (Free De La Hoya)](./13%20case%20study.md#case-1478)

**System**: Gen3-Burst / Cho-Z·GT · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: absorbed+driftComplete+perfect: +10→self→capped/1.50×/126ms; drift only: −5/1.38×/90ms; miss: no effect
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 30 · Stamina 90 · Speed 50
**Mechanism**: K (absorb 200ms) → → → (drift arc 400ms) → J (counter 200ms). 3-phase. absorbed+driftComplete+perfect: +10 self/capped/1.50×/126ms. powerCost 70. **Anime physics override**: Proof Frame floor-grind drift converts incoming momentum to counter impulse; frame v=16.0 m/s → counter strike.
**2.5D Rendering**: Absorb-fade; drift arc trail; counter burst
**Gimmick**: geistCounter(absorbed, driftComplete, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Geist Counter · powerCost 70 · animeOverride true
**Compatible beys**: Wide outer disc frame r≥3.5 cm [M] with floor-contact tilt; Absorb or translational tip
**Engine Note**: absorbed+driftComplete+perfect: +10 self/capped/1.50×/126ms; powerCost 70

---

### [Case 1479 — [COMBO] Counter Drift (K ← J)](./13%20case%20study.md#case-1479)

**System**: Gen3-Burst / Cho-Z·GT · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: absorbHit: +5/1.38×/80ms; not: −8/1.18×/30ms
**Movement Freedom**: —
**Base Stats**: Attack 15 · Defense 25 · Stamina 95 · Speed 50
**Mechanism**: K (absorb) → ← (drift flank) → J (counter). absorbHit: self +5, opp 1.38×, 80ms. Not: −8, 1.18×, 30ms. Cost 25, balanced type.
**2.5D Rendering**: Absorb-to-drift arc; counter flash on J
**Gimmick**: comboDetect(seq=[defense,moveLeft,attack], window=600ms)
**Engine Note**: absorbHit: +5/1.38×/80ms; not: −8/1.18×/30ms; cost 25; balanced combo

---

### [Case 1480 — [GIMMICK] Geist Fafnir Rubber Blade Retraction Circular-Profile Vortex (Free De La Hoya)](./13%20case%20study.md#case-1480)

**System**: Gen3-Burst / Cho-Z·GT · Stamina
**Geometry**: Extended C_D = 1.20; retracted C_D = 0.50; 83.6% drag reduction on retract
**Material**: Rubber blades BeySpirit-extendable; smooth circular retracted profile
**Spin Coupling**: Physical ω_trans = 185 rad/s (blades retract) — below battle window. BeySpirit extends blades in battle [M]
**Contact Points**: Free-vortex: v_θ(50mm) = 3.87 m/s [M]; F_vortex = 0.025 N [M]; BeySpirit ×5: F_BS = 0.625 N [M]
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 20 · Stamina 100 · Speed 45
**Mechanism**: Extended blades: C_D=1.20 (high drag). Retracted: C_D=0.50 (83.6% drag reduction). Physical ω_trans=185 rad/s; BeySpirit extends blades in battle window [M]. Free-vortex at 50mm: v_θ=3.87 m/s [M]. BeySpirit ×5: F_BS=0.625 N [M].
**2.5D Rendering**: Blade extend/retract animation; vortex swirl field indicator
**Gimmick**: fafnirRetract(bladeExtended, ω) → C_D, v_vortex
**Engine Note**: C_D_ext 1.20; C_D_ret 0.50; v_θ(50mm) 3.87 m/s [M]; F_BS 0.625 N [M]

---

### [Case 1481 — [SPECIAL] Geist Spin (Free De La Hoya)](./13%20case%20study.md#case-1481)

**System**: Gen3-Burst / Cho-Z·GT · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: spinCharged+perfect: +27→capped/1.50×/150ms; not charged+perfect: +18/1.38×/100ms; miss: −5/1.15×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 20 · Stamina 100 · Speed 45
**Mechanism**: K×3 (600ms absorb) + J (200ms tornado). Phase 1: BeySpirit-extended blade absorb (3 contacts → ΔKE=1.050 J [M], Δω=241.5 rad/s [M]). Phase 2: retraction tornado (v_θ_BS=4.84 m/s [M], F_BS=1.40 N [M]). spinCharged+perfect: +27/capped/1.50×/150ms. powerCost 75. **Anime physics override**: rubber blade extension+retraction vortex: BeySpirit sustains blade extension and amplifies tornado force.
**2.5D Rendering**: Three-absorb charge; vortex burst on J
**Gimmick**: geistSpin(spinCharged, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Geist Spin · powerCost 75 · animeOverride true
**Compatible beys**: Burst bey with rubber blades BeySpirit-extendable + smooth circular retracted profile
**Engine Note**: spinCharged+perfect: +27/capped/1.50×/150ms; powerCost 75

---

### [Case 1482 — [COMBO] Vortex Drain (K J ←)](./13%20case%20study.md#case-1482)

**System**: Gen3-Burst / Cho-Z·GT · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: absorbContact: +12/1.35×/70ms; not: −5/1.15×/25ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 20 · Stamina 100 · Speed 45
**Mechanism**: K (absorb) → J (drain burst) → ← (vortex flank). absorbContact: self +12, dmg 1.35×, 70ms. Not: −5, 1.15×, 25ms. Cost 25, stamina type.
**2.5D Rendering**: Absorb-to-drain burst; vortex direction flash
**Gimmick**: comboDetect(seq=[defense,attack,moveLeft], window=600ms)
**Engine Note**: absorbContact: +12/1.35×/70ms; not: −5/1.15×/25ms; cost 25; stamina combo

---

### [Case 1483 — [GIMMICK] Guilty Blade Dragon-Wing Uppercut Contact Geometry (Lui Shirosagi · Guilty Luinor Karma Metal Destroy-2)](./13%20case%20study.md#case-1483)

**System**: Gen3-Burst / Cho-Z · Attack
**Geometry**: θ_up = 30° · r_blade = ~3.8 cm · m_eff = 3.062×10⁻² kg · ω = 420 rad/s [M]
**Material**: Karma Disc + Guilty Blade metal dragon wing; sub-layer upward-curvature approach
**Spin Coupling**: v_blade = 18.48 m/s [M]; F_contact = 282.5 N [M]; F_lift = 141.3 N [M]; v_launch = 5.65 m/s [M]
**Contact Points**: BeySpirit ω×2: F_contact_BS = 565 N [M]; F_lift_BS = 282.5 N [M]; v_launch_BS = 11.3 m/s [M]. Extends Cases 587–590.
**Movement Freedom**: Low approach angle triggers sub-layer contact; lowApproach flag required for full force
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: θ_up=30°, ω=420 rad/s [M]: v_blade=18.48 m/s, m_eff=3.062e-2 kg, F_contact=282.5 N [M], F_lift=141.3 N [M], F_spin=244.6 N [M], v_launch=5.65 m/s [M]. BeySpirit ω×2: F_contact_BS=565 N [M]. Extends Cases 587–590.
**2.5D Rendering**: Dragon-wing blade arc; uppercut launch trajectory
**Gimmick**: guiltyBlade(θ_up, ω, lowApproach) → F_contact, F_lift, v_launch
**Engine Note**: θ_up 30°; F_contact 282.5 N [M]; F_lift 141.3 N [M]; v_launch 5.65 m/s [M]

---

### [Case 1484 — [SPECIAL] Guilty Upper (Lui Shirosagi)](./13%20case%20study.md#case-1484)

**System**: Gen3-Burst / Cho-Z · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: lowApproach+perfect: −50/1.50×/200ms; lowApproach+miss: −28/1.38×/80ms; no lowApproach: −20/1.30×/80ms
**Movement Freedom**: —
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: ↓ (low approach 300ms) + J (150ms window). lowApproach+perfect: −50/1.50×/200ms; lowApproach+miss: −28/1.38×/80ms; no lowApproach: −20/1.30×/80ms. powerCost 90. **Anime physics override**: Guilty Blade sub-layer uppercut: F_lift=141.3 N [M]; v_launch_BS=11.3 m/s [M].
**2.5D Rendering**: Low-approach arrow; uppercut launch flash
**Gimmick**: guiltyUpper(lowApproach, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Guilty Upper · powerCost 90 · animeOverride true
**Compatible beys**: Guilty Blade r≥3.8 cm [M] with sub-layer upward-curvature approach
**Engine Note**: lowApproach+perfect: −50/1.50×/200ms; powerCost 90

---

### [Case 1485 — [COMBO] Upper Slash (↓ → J)](./13%20case%20study.md#case-1485)

**System**: Gen3-Burst / Cho-Z · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: lowAngle: −22/1.42×/95ms; not: −10/1.20×/35ms
**Movement Freedom**: —
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: ↓ (low dip) → → (angle approach) → J (uppercut strike). lowAngle: −22, 1.42×, 95ms. Not: −10, 1.20×, 35ms. Cost 25, attack type.
**2.5D Rendering**: Low-dip arc; diagonal approach; uppercut burst on J
**Gimmick**: comboDetect(seq=[moveDown,moveRight,attack], window=600ms)
**Engine Note**: lowAngle: −22/1.42×/95ms; not: −10/1.20×/35ms; cost 25; attack combo

---

### [Case 1486 — [GIMMICK] Karma Disc Gyroscopic Launch Impulse and Aerial Dive KE (Lui Shirosagi)](./13%20case%20study.md#case-1486)

**System**: Gen3-Burst / Cho-Z · Attack
**Geometry**: I_Karma = 2.545×10⁻⁵ (51.9% of total) · L = 2.058×10⁻² N·m·s at ω=420 rad/s [M]
**Material**: Karma Disc + Guilty Blade metal dragon
**Spin Coupling**: BeySpirit Ω_tilt = 80 rad/s [M]: F_gyro_BS = 1.646 N [M] (2.12×mg); h_jump = 10 m [M]
**Contact Points**: v_dive_BS = 14.01 m/s [M]. At ω_land=350 rad/s: F_total_BS = 1025.1 N [M]; τ_burst = 45.1 N·m [M] (90× standard → guaranteed burst)
**Movement Freedom**: —
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: I_Karma=2.545e-5 (51.9% total). L=2.058e-2 at ω=420 [M]. F_gyro_BS=1.646 N [M] (2.12×mg). h_jump=10m [M] (physical 0.5m). v_dive_BS=14.01 m/s [M]. F_total_BS=1025.1 N [M], τ_burst=45.1 N·m [M] (90× standard).
**2.5D Rendering**: Launch charge → aerial jump → dive arc; burst-ring on impact
**Gimmick**: karmaLaunch(ω, Ω_tilt, h) → F_gyro, v_dive, τ_burst
**Engine Note**: I_Karma 2.545e-5 (51.9%); F_gyro_BS 1.646 N [M]; τ_burst 45.1 N·m [M]

---

### [Case 1487 — [SPECIAL] Guilty Smash (Lui Shirosagi)](./13%20case%20study.md#case-1487)

**System**: Gen3-Burst / Cho-Z · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: launchCharged+perfect: −50/1.50×/220ms; launchCharged+miss: −30/1.38×/90ms; not charged: −18/1.28×/70ms
**Movement Freedom**: —
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: ↑ (charge 300ms) + J (dive 200ms). launchCharged+perfect: −50/1.50×/220ms; launchCharged+miss: −30/1.38×/90ms; not charged: −18/1.28×/70ms. powerCost 95. **Anime physics override**: Karma Disc gyro-launch: h_jump=10m [M]; τ_burst=45.1 N·m [M] (90× standard threshold).
**2.5D Rendering**: Charge arc → aerial peak → dive impact
**Gimmick**: guiltySmash(launchCharged, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Guilty Smash · powerCost 95 · animeOverride true
**Compatible beys**: Karma Disc I_disc≥2.0×10⁻⁵ [M] + Guilty Blade metal dragon
**Engine Note**: launchCharged+perfect: −50/1.50×/220ms; powerCost 95

---

### [Case 1488 — [COMBO] Smash Dive (↑ ↓ J)](./13%20case%20study.md#case-1488)

**System**: Gen3-Burst / Cho-Z · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: highArc: −22/1.42×/100ms; not: −10/1.20×/35ms
**Movement Freedom**: —
**Base Stats**: Attack 100 · Defense 15 · Stamina 20 · Speed 90
**Mechanism**: ↑ (charge rise) → ↓ (dive approach) → J (smash). highArc: −22, 1.42×, 100ms. Not: −10, 1.20×, 35ms. Cost 25, attack type.
**2.5D Rendering**: Rise-then-dive arc; smash burst on J
**Gimmick**: comboDetect(seq=[moveUp,moveDown,attack], window=600ms)
**Engine Note**: highArc: −22/1.42×/100ms; not: −10/1.20×/35ms; cost 25; attack combo

---

### [Case 1489 — [GIMMICK] Stationary Gyroscopic Anchor Defense (Joseph · Vanishing Moot)](./13%20case%20study.md#case-1489)

**System**: Gen1-Plastic · Defense/Stamina
**Geometry**: m = 35 g · I = 2.10×10⁻⁵ kg·m² · ω₀ = 650 rad/s [M] · L₀ = 1.365×10⁻² kg·m²/s
**Material**: Controlled-traction tip μ≥0.35 [M]; plastic-gen I≥1.5×10⁻⁵ [M]
**Spin Coupling**: BeySpirit L_BS = 6.825×10⁻² [M]; Ω_manageable = 22 rad/s [M] ("immovable")
**Contact Points**: Mass-wall rebound: attacker slows 82.4%; ~36% lower spin drain vs mobile [M]
**Movement Freedom**: Planted/stationary: gyroscopic stiffness prevents displacement [M]
**Base Stats**: Attack 5 · Defense 100 · Stamina 60 · Speed 10
**Mechanism**: I=2.10e-5, ω₀=650 [M], L₀=1.365e-2. BeySpirit L_BS=6.825e-2 [M]. Ω=22 rad/s [M] manageable precession → "immovable" anchor. Mass-wall rebound: attacker slows 82.4% [M]; 36% lower spin drain vs mobile [M].
**2.5D Rendering**: Planted-state indicator; rebound arc on attacker contact
**Gimmick**: gyroAnchor(ω, L_BS) → Ω_prec, reboundFactor
**Engine Note**: ω₀ 650 [M]; L_BS 6.825e-2 [M]; Ω_mng 22 rad/s [M]; rebound 82.4% [M]

---

### [Case 1490 — [SPECIAL] Great Rock (Joseph)](./13%20case%20study.md#case-1490)

**System**: Gen1-Plastic · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: planted+perfect: +8/0.60× incoming/0ms; planted+miss: +3/0.75×; not planted: −5/0.90×
**Movement Freedom**: —
**Base Stats**: Attack 5 · Defense 100 · Stamina 60 · Speed 10
**Mechanism**: K hold (500ms). planted+perfect: self +8, incoming ×0.60 (40% mitigation). planted+miss: self +3, ×0.75. not planted: −5, ×0.90. powerCost 60. **Anime physics override**: BeySpirit gyroscopic anchor renders Moot immovable; all incoming impulse reflected [M].
**2.5D Rendering**: Planted anchor stance; incoming-reduction aura
**Gimmick**: greatRock(planted, qteHit) → spinDelta, incomingMult
**Special Move**: Great Rock · powerCost 60 · animeOverride true
**Compatible beys**: Plastic-gen I≥1.5×10⁻⁵ [M]; controlled-traction tip μ≥0.35 [M]
**Engine Note**: planted+perfect: +8/0.60× incoming; powerCost 60

---

### [Case 1491 — [COMBO] Stone Wall (K K K)](./13%20case%20study.md#case-1491)

**System**: Gen1-Plastic · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: threeHolds: +6/0.65× incoming/0ms; not: +2/0.80×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 5 · Defense 100 · Stamina 60 · Speed 10
**Mechanism**: K K K (triple defense hold). threeHolds: self +6, incoming ×0.65 (35% mitigation). Not: self +2, ×0.80. Cost 0, defense type. Cross-reference: Great Cutter covered by Cases 769–772.
**2.5D Rendering**: Triple-hold animation; damage-mitigation aura
**Gimmick**: comboDetect(seq=[defense,defense,defense], window=600ms)
**Engine Note**: threeHolds: +6/0.65× incoming; not: +2/0.80×; cost 0; defense combo

---

### [Case 1492 — [GIMMICK] Draciel G Assembly Orbital Vortex Circulation (Max Tate · Draciel G, G-Revolution)](./13%20case%20study.md#case-1492)

**System**: Gen1-Plastic / G-Revolution · Stamina/Defense
**Geometry**: r = ~4.0 cm · m = 43 g · I = 2.744×10⁻⁵ kg·m² · ω₀ = 500 rad/s · L₀ = 1.372×10⁻² kg·m²/s
**Material**: Draciel G assembly; controlled-traction tip
**Spin Coupling**: τ_tip = 8.43×10⁻⁶ N·m; τ_total ≈ 4.22×10⁻⁵ N·m; t_spin ≈ 325 s
**Contact Points**: Γ_self = 2.036 m²/s; Γ_orbital = 0.251 m²/s; v_θ_total = 9.1 m/s at r=40mm
**Movement Freedom**: Counter-orbit v_rel = 33.7 m/s vs same-orbit 2.3 m/s (14.7× ratio)
**Base Stats**: Attack 10 · Defense 90 · Stamina 75 · Speed 20
**Mechanism**: I=2.744e-5, L₀=1.372e-2, t_spin≈325s. Γ_self=2.036 m²/s (self-rotation), Γ_orbital=0.251 m²/s (orbital path). v_θ_total=9.1 m/s at r=40mm. Counter-orbit vs same-orbit v_rel ratio 14.7×: counter-orbiting opponent drains 14.7× faster than co-orbiting.
**2.5D Rendering**: Orbital vortex circulation trail; counter-orbit slow-zone indicator
**Gimmick**: dracielVortex(ω, Γ_self, r_orbit) → v_θ_total, drainRatio
**Engine Note**: Γ_self 2.036 m²/s; v_θ 9.1 m/s at 40mm; counter-orbit ratio 14.7×; t_spin 325 s

---

### [Case 1493 — [SPECIAL] Gravity Control (Max Tate · Draciel G)](./13%20case%20study.md#case-1493)

**System**: Gen1-Plastic / G-Revolution · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: counterOrbit+waterspout+perfect: opp −35/0.70× on Draciel/150ms; same-dir: −20/0.80×/80ms; miss: −10/0.90×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 90 · Stamina 75 · Speed 20
**Mechanism**: Orbital stamina-drain/counter-rotation waterspout. Counter-orbit v_rel=33.7 m/s vs same-orbit 2.3 m/s (14.7× ratio). counterOrbit+waterspout+perfect: opp −35/0.70× on Draciel/150ms; same-dir: −20/0.80×/80ms. powerCost 80. forceState: 'must_keep_distance'. **Anime physics override**: BeySpirit conjures full-stadium waterspout from orbital vortex [M].
**2.5D Rendering**: Counter-orbit waterspout field; drain multiplier on counter direction
**Gimmick**: gravityControl(counterOrbit, waterspout, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Gravity Control · powerCost 80 · animeOverride true
**Compatible beys**: Draciel G (Max Tate); orbital stamina-type bey with v_θ≥9 m/s at r≤40mm
**Engine Note**: counterOrbit+perfect: −35/0.70×/150ms; same-dir: −20/0.80×/80ms; powerCost 80

---

### [Case 1494 — [COMBO] Tidal Counter (↓ J ↑)](./13%20case%20study.md#case-1494)

**System**: Gen1-Plastic / G-Revolution · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: bowlPosition+perfect: +8/1.10×/80ms; hit (no bowl): +4/1.05×/40ms; miss: 0/1.00×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 90 · Stamina 75 · Speed 20
**Mechanism**: ↓ (bowl drop) → J (orbital surge hit) → ↑ (counter rising). bowlPosition+perfect: self +8, 1.10×, 80ms. Hit (no bowl): +4, 1.05×, 40ms. Miss: no effect. Cost 0, defense/stamina restriction.
**2.5D Rendering**: Bowl-drop arc; orbital surge; rising counter
**Gimmick**: comboDetect(seq=[moveDown,attack,moveUp], window=600ms)
**Engine Note**: bowlPosition+perfect: +8/1.10×/80ms; hit: +4/1.05×/40ms; miss: 0/1.00×; cost 0

---

### [Case 1495 — [GIMMICK] Gravity Wheel Left-Spin Blade-Edge Pressure-Pulse Cascade (Julian Konzern · Gravity Destroyer AD145WD)](./13%20case%20study.md#case-1495)

**System**: Gen2-MFB / HWS · Attack/Stamina
**Geometry**: r_FW ≈ 2.3 cm · right-spin 1 bolt / left-spin 3 scatter bolts
**Material**: Gravity FW with left-spin counter mode; AD145 wing interference; WD tip
**Spin Coupling**: ΔP = 408.6 Pa per pass; F_pulse = 0.123 N/pass; f_pulse = 801 Hz. Range: ~30 mm physical; BeySpirit → gravity bolt [M]
**Contact Points**: Right-spin: convex leading → 1 bolt. Left-spin/counter: concave → 3 scatter bolts (AD145 scatter). EXTENDS Cases 723 & 1261.
**Movement Freedom**: —
**Base Stats**: Attack 60 · Defense 45 · Stamina 60 · Speed 65
**Mechanism**: Right-spin: convex leading face → 1 pressure bolt. Left-spin (counter): concave face → 3 scatter bolts (AD145 wing interference). ΔP=408.6 Pa, F_pulse=0.123 N/pass, f_pulse=801 Hz. Physical range ~30mm; BeySpirit → gravity bolt [M]. Extends Cases 723 & 1261.
**2.5D Rendering**: Right-spin single bolt; left-spin triple scatter arc
**Gimmick**: gravityPulse(leftSpin, ω, f_pulse) → F_pulse, numBolts
**Engine Note**: ΔP 408.6 Pa; F_pulse 0.123 N; f_pulse 801 Hz; left-spin 3×scatter [M]

---

### [Case 1496 — [SPECIAL] Gravity Brave (Julian Konzern)](./13%20case%20study.md#case-1496)

**System**: Gen2-MFB / HWS · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: right-spin high+perfect: −40/1.50×/200ms; left-spin high+perfect: −45/1.35×/100ms; right hit (low ω): −25/1.30×/120ms; left hit (low ω): −28/1.20×/60ms; miss: −15/1.10×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 60 · Defense 45 · Stamina 60 · Speed 65
**Mechanism**: Gravity Wheel high-spin + QTE-aimed. right-spin high+perfect: −40/1.50×/200ms; left-spin high+perfect: −45/1.35×/100ms; low-ω hits reduced. powerCost 85. Left-spin counter mode fires 3-arrow scatter bonus. **Anime physics override**: Gravity Wheel concave face pressure cascade amplified by BeySpirit to gravity bolt [M].
**2.5D Rendering**: Right-spin single bolt; left-spin triple scatter arc; gravity-pull field
**Gimmick**: gravityBrave(leftSpin, highSpin, qteHit) → spinDelta, dmgMult, lockMs
**Special Move**: Gravity Brave · powerCost 85 · animeOverride true
**Compatible beys**: Gravity-wheel bey; left-spin counter mode for 3-arrow bonus
**Engine Note**: right-spin high: −40/1.50×/200ms; left-spin high: −45/1.35×/100ms; powerCost 85

---

### [Case 1497 — [COMBO] Gravity Volley (↑ ↑ J)](./13%20case%20study.md#case-1497)

**System**: Gen2-MFB / HWS · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: left-spin+hit: −18/1.20×/60ms; right-spin+hit: −15/1.25×/100ms; miss: −8/1.08×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 60 · Defense 45 · Stamina 60 · Speed 65
**Mechanism**: ↑ ↑ (double upper-bowl approach) + J (partial blade-edge burst). left-spin+hit: −18, ×1.20, 60ms; right-spin+hit: −15, ×1.25, 100ms; miss: −8, ×1.08. Cost 15, universal type. Ceiling: dmgMult 1.25× ≤ 1.5 ✓.
**2.5D Rendering**: Double approach arc; partial bolt discharge on J
**Gimmick**: comboDetect(seq=[moveUp,moveUp,attack], window=600ms)
**Engine Note**: left-spin: −18/1.20×/60ms; right-spin: −15/1.25×/100ms; miss: −8/1.08×; cost 15

*Cases 1498–1499 are CS13 buffer slots (unassigned). Cases 1500–1524 are CS9 overflow blocks (see INDEX.md). CS13 resumes at Case 1525.*

---

### [Case 1525 — [GIMMICK] Grand Cetus T125RS Rubber Sharp Pivot-Anchor & T125 Triple-Wing Air Pump (Sophie · Grand Cetus T125RS)](./13%20case%20study.md#case-1525)

**System**: Gen2-MFB / Metal Masters · Stamina
**Geometry**: r = 3.90 cm · m = 32.5 g · I = 2.904×10⁻⁵ kg·m² · ω₀ = 628 rad/s · L₀ = 1.824×10⁻² kg·m²/s
**Material**: Crystal Wheel Grand + Fusion Wheel Cetus (27 g at 3.9 cm) + T125 track + RS tip (rubber r=0.5mm, μ=0.38)
**Spin Coupling**: τ_RS_actual = 8.19×10⁻⁵ N·m; τ_T125 = 9.59×10⁻⁵ N·m; τ_total = 1.778×10⁻⁴ N·m; t_spin = 102.6 s
**Contact Points**: RS pivot-anchor: ω_anchor = 1.41 rad/s throughout battle; controlled drift only at near-stopped spin
**Movement Freedom**: RS tip: pivot-anchor at high ω; controlled drift at ω<300 rad/s
**Base Stats**: Attack 10 · Defense 40 · Stamina 95 · Speed 25
**Mechanism**: I_FW=2.875e-5, I_total=2.904e-5, t_spin=102.6s. RS rubber deformation: r_eff_rubber=0.675mm (×1.35 Hertz). τ_RS_actual=8.19e-5 N·m. T125 wings: τ=9.59e-5 N·m at v_tip=12.56 m/s. Pivot-anchor holds Grand Maelstrom Phase 1 centre; drift only at ω<300 rad/s.
**2.5D Rendering**: T125 triple-wing silhouette; RS rubber tip contact point
**Gimmick**: pivotAnchor(ω, τ_RS, I) → ω_anchor, driftMode
**Engine Note**: τ_RS_actual 8.19e-5 N·m; τ_T125 9.59e-5 N·m; t_spin 102.6 s; ω_anchor 1.41 rad/s

---

### [Case 1526 — [SPECIAL] Grand Maelstrom (Sophie · Grand Cetus T125RS)](./13%20case%20study.md#case-1526)

**System**: Gen2-MFB / Metal Masters · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: highSpin+QTE: drain −18/s/10000ms/speed ×0.55/self +8/s; lowSpin+QTE: −12/s/7000ms/×0.70/+5/s; miss: −6/s/4000ms/×0.85/+2/s
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 40 · Stamina 95 · Speed 25
**Mechanism**: AoE persistent stamina-drain / whirlpool trap field; multi-target (3 opponents confirmed canon); 10 s duration (canon-explicit). Rankine vortex: Γ=3.002 m²/s [M]; v_θ(100mm)=4.78 m/s; F_cp=10.28 N [M] on 45g opponent. Primes `grand_victoire` (×1.8 amplification) + `water_field_primed` for Grand Deucalion. forceState: 'must_attack'. powerCost 90. **Anime physics override**: BeySpirit amplifies T125 airflow to stadium-filling water whirlpool [M].
**2.5D Rendering**: Stadium-wide whirlpool field; opponent drain-per-second indicator; speed-mult overlay
**Gimmick**: grandMaelstrom(highSpin, qteHit, opponentCount) → spinDeltaPerSecond, durationMs, speedMult, selfRecovery, primes
**Special Move**: Grand Maelstrom · powerCost 90 · animeOverride true
**Compatible beys**: Grand Cetus T125RS (Sophie); RS pivot-anchor + T125 triple-wing air pump required
**Engine Note**: highSpin+QTE: −18/s/10000ms/×0.55; primes grand_victoire ×1.8; powerCost 90

---

### [Case 1527 — [COMBO] Tidal Surge (↓ J ←)](./13%20case%20study.md#case-1527)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: inWhirlpool+QTE: −14/1.38×/80ms; base+QTE: −12/1.20×/80ms; miss: −6/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 40 · Stamina 95 · Speed 25
**Mechanism**: ↓ (vortex eye approach) → J (orbital surge) → ← (lateral water-ram). inWhirlpool bonus ×1.15: −14, 1.38×, 80ms. Base: −12, 1.20×, 80ms. Miss: −6, 1.05×. Cost 15, stamina type. Ceiling: 1.38× ≤ 1.5 ✓.
**2.5D Rendering**: Bowl-descent arc; lateral ram flash
**Gimmick**: comboDetect(seq=[moveDown,attack,moveLeft], window=600ms); whirlpoolBonus ×1.15
**Engine Note**: inWhirlpool: −14/1.38×/80ms; base: −12/1.20×/80ms; cost 15; stamina combo

---

### [Case 1528 — [GIMMICK] Grand Cetus T125RS Aerial-Launch Whirlpool-Exit — Vortex Angular-Momentum-to-Vertical-Impulse Conversion (Sophie)](./13%20case%20study.md#case-1528)

**System**: Gen2-MFB / Metal Masters · Stamina
**Geometry**: I_vort_col = 1.5625 kg·m² [M]; L_vort_col = 981 kg·m²/s [M]; J_vert = 0.981 N·s [M]
**Material**: T125 wing aerodynamic pump (real); BeySpirit water column launch ramp [M]
**Spin Coupling**: v_launch_BS = 30.2 m/s [M] (physical 0.750 m/s at bowl lip); h_max_BS = 46 m [M]; physical h = 28.7 mm
**Contact Points**: Impact: KE_spin = 5.727 J (97.3% of total); KE_trans = 0.159 J (physical h=0.5m); J_impact = 0.102 N·s physical
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 40 · Stamina 95 · Speed 25
**Mechanism**: Physical: T125 wings generate downward air jet → reaction upward (F_uplift=1.24e-3 N, negligible). BeySpirit: L_vort_col=981 kg·m²/s [M] → J_vert=0.981 N·s [M] → v_launch=30.2 m/s [M]. Spin KE dominates impact (97.3%); aerial height entirely [M]. EXTENDS Case 1526.
**2.5D Rendering**: Vortex-column launch arc; aerial peak; spin-KE dominant impact
**Gimmick**: vortexLaunch(L_vort, m_Cetus, η) → v_launch, h_apex, J_impact
**Engine Note**: v_launch_BS 30.2 m/s [M]; h_max 46 m [M]; physical h_max 28.7 mm; J_impact physical 0.102 N·s

---

### [Case 1529 — [SPECIAL] Grand Victoire (Sophie · Grand Cetus T125RS)](./13%20case%20study.md#case-1529)

**System**: Gen2-MFB / Metal Masters · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: waterPrimed+highSpin+QTE: −35/2.34×[M]/120ms/ringOut 85%; waterPrimed+QTE: −35/2.34×/120ms/55%; QTE miss: −15/1.10×/0ms/20%
**Movement Freedom**: —
**Base Stats**: Attack 15 · Defense 35 · Stamina 90 · Speed 30
**Mechanism**: Aerial dive / water-crash ring-out. waterMult = 1.80× (Grand Maelstrom primed, Case 1526). highSpin+QTE: −35/×1.30×1.80=×2.34[M]/120ms/55%; waterPrimed+highSpin: ringOut 85% [M]. Miss: −15/×1.10/20%. powerCost 85. forceState: 'must_stay_still'. **Anime physics override**: aerial dive from vortex axis; combined spin+water impact rings out all but heaviest opponents.
**2.5D Rendering**: Aerial dive arc; water-primed multiply indicator; ring-out force bar
**Gimmick**: grandVictoire(waterFieldPrimed, highSpin, qteHit) → spinDelta, dmgMult, lockMs, ringOutForce
**Special Move**: Grand Victoire · powerCost 85 · animeOverride true
**Compatible beys**: Grand Cetus T125RS (Sophie); also combinable with Grand Fleet (Wales) → Grand Deucalion
**Engine Note**: waterPrimed+high+QTE: −35/×2.34[M]/120ms/ringOut 85%; powerCost 85

---

### [Case 1530 — [COMBO] Cetus Rise (↑ ↑ K)](./13%20case%20study.md#case-1530)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: waterActive+QTE: −11/1.265×/60ms; base+QTE: −10/1.15×/60ms; miss: −5/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 40 · Stamina 95 · Speed 25
**Mechanism**: ↑ ↑ (upper-bowl approach) → K (ascent-deflect). waterActive bonus ×1.10: −11, 1.265×, 60ms. Base: −10, 1.15×, 60ms. Miss: −5, 1.05×. Cost 15, stamina/defense. Ceiling: 1.265× ≤ 1.5 ✓.
**2.5D Rendering**: Double-up arc; defense-deflect glow on K
**Gimmick**: comboDetect(seq=[moveUp,moveUp,defense], window=600ms); waterBonus ×1.10
**Engine Note**: waterActive: −11/1.265×/60ms; base: −10/1.15×/60ms; cost 15

---

### [Case 1531 — [GIMMICK] Grand Cetus WD145RS Wing Defense 145 Track Platform & Protective Wing Barrier (Wales · Grand Cetus WD145RS)](./13%20case%20study.md#case-1531)

**System**: Gen2-MFB / Metal Masters · Defense
**Geometry**: r = 3.90 cm · m = 34.0 g · I = 2.909×10⁻⁵ kg·m² · ω₀ = 628 rad/s · L₀ = 1.827×10⁻² kg·m²/s
**Material**: Crystal Wheel Grand + Fusion Wheel Cetus + WD145 (3 large fins, A_wing=8.0×10⁻⁵ m² each) + RS tip
**Spin Coupling**: τ_WD145 = 1.253×10⁻³ N·m (13× more drag than T125); τ_total = 1.335×10⁻³ N·m; t_spin = 13.7 s
**Contact Points**: WD145 wing deflection: φ_wing=7.6°; effective impulse transmitted = 13.2% (86.8% of sub-14.5mm attacks deflected)
**Movement Freedom**: WD145 wing barrier h=14.5mm; attacks below this height deflected 86.8%
**Base Stats**: Attack 15 · Defense 90 · Stamina 35 · Speed 25
**Mechanism**: I_WD145=2.909e-5 (similar to Sophie's T125RS). t_spin=13.7s (7.5× shorter than T125RS 102.6s). WD145 wing area 5.3× larger than T125. Wing defense: 86.8% deflect for sub-14.5mm attacks. Wales must act fast at peak spin; sacrifices stamina for defensive crash platform.
**2.5D Rendering**: Wide WD145 fin silhouette; sub-14.5mm attack deflect indicator
**Gimmick**: wd145Defense(h_attack, φ_wing) → deflectFraction
**Engine Note**: τ_WD145 1.253e-3 N·m; t_spin 13.7 s; deflect 86.8% (h<14.5mm); WD145 wing barrier

---

### [Case 1532 — [SPECIAL] Grand Fleet (Wales · Grand Cetus WD145RS)](./13%20case%20study.md#case-1532)

**System**: Gen2-MFB / Metal Masters · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: waterPrimed+highSpin+QTE: −50/×2.61[M]/180ms/ringOut 80%; waterPrimed+QTE: −30/×2.25[M]/100ms/50%; miss: −12/×1.10/0ms/15%
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 85 · Stamina 30 · Speed 30
**Mechanism**: Aerial dive / crash ring-out; WD145 wing platform leading edge. waterMult=1.80×. highSpin+QTE: −50/×1.45×1.80=×2.61[M]/180ms/80% ring-out. Short spin (13.7s) means Wales fires at peak; wider wing platform gives larger collision radius than Grand Victoire. powerCost 85. Combines with Grand Victoire → Grand Deucalion. **Anime physics override**: aerial WD145 platform crash from vortex; stadium-width effective collision zone [M].
**2.5D Rendering**: WD145 wing-platform dive arc; water-primed multiply indicator
**Gimmick**: grandFleet(waterFieldPrimed, highSpin, qteHit) → spinDelta, dmgMult, lockMs, ringOutForce
**Special Move**: Grand Fleet · powerCost 85 · animeOverride true
**Compatible beys**: Grand Cetus WD145RS (Wales); combines with Grand Victoire (Sophie) for Grand Deucalion
**Engine Note**: waterPrimed+high+QTE: −50/×2.61[M]/180ms/ringOut 80%; powerCost 85

---

### [Case 1533 — [COMBO] Fleet Wave (↓ ↑ ↑)](./13%20case%20study.md#case-1533)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: inWater+QTE: −16/1.366×/70ms; base+QTE: −14/1.22×/70ms; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 15 · Defense 90 · Stamina 35 · Speed 25
**Mechanism**: ↓ (bowl base) → ↑ ↑ (double-surge). inWater bonus ×1.12: −16, 1.366×, 70ms. Base: −14, 1.22×, 70ms. Miss: −7, 1.05×. Cost 15, defense. WD145 wing platform broadside contact; 86.8% deflect during surge. Ceiling: 1.366× ≤ 1.5 ✓.
**2.5D Rendering**: Bowl-dip then double-surge arc; WD145 wing broadside flash
**Gimmick**: comboDetect(seq=[moveDown,moveUp,moveUp], window=600ms); waterBonus ×1.12
**Engine Note**: inWater: −16/1.366×/70ms; base: −14/1.22×/70ms; cost 15; defense combo

---

### [Case 1534 — [GIMMICK] Dual-Cetus Cooperative Angular Momentum Superposition — Grand Deucalion Physics (Sophie + Wales)](./13%20case%20study.md#case-1534)

**System**: Gen2-MFB / Metal Masters · Cooperative (Two Assemblies)
**Geometry**: L_Sophie = 1.824×10⁻² · L_Wales = 1.827×10⁻² · L_total = 3.651×10⁻² kg·m²/s
**Material**: Sophie Grand Cetus T125RS + Wales Grand Cetus WD145RS (Cases 1525–1533)
**Spin Coupling**: Γ_combined = 6.004 m²/s [M]; v_θ(150mm) = 6.37 m/s [M] (extends to stadium boundary)
**Contact Points**: Tsunami: J_Sophie = 0.102 N·s + J_Wales = 0.106 N·s = 0.208 N·s physical; BeySpirit amplifies [M]
**Movement Freedom**: Counter-counters: linear slash (Ray Striker) / matched tornado (Earth Eagle) / pre-emption (Ryuga) — canon confirmed weak points
**Base Stats**: Attack 15 · Defense 65 · Stamina 65 · Speed 30
**Mechanism**: L_total = 3.651e-2. Γ_combined = 6.004 m²/s [M]. v_θ(150mm) = 6.37 m/s [M] → stadium boundary reach. Tsunami: J_combined physical = 0.208 N·s; BeySpirit scales to wave front [M]. Weak points: linear slash, matched tornado, pre-emption.
**2.5D Rendering**: Dual vortex superposition; combined-L indicator; stadium-boundary wave reach
**Gimmick**: dualCetusL(L_S, L_W) → L_total, Γ_combined, v_θ_boundary
**Engine Note**: L_total 3.651e-2; Γ_combined 6.004 m²/s [M]; v_θ(150mm) 6.37 m/s [M]

---

### [Case 1535 — [SPECIAL] Grand Deucalion (Sophie · Grand Cetus T125RS + Wales · Grand Cetus WD145RS)](./13%20case%20study.md#case-1535)

**System**: Gen2-MFB / Metal Masters · Special Move (Joint)
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: bothHighSpin+QTE: −80/×2.80[M]/300ms/ringOut 95%/AoE stadium; QTE only: −60/×2.20[M]/200ms/80%; miss: −40/×1.80[M]/120ms/65%
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 60 · Stamina 60 · Speed 30
**Mechanism**: JOINT SPECIAL: Grand Maelstrom primed + Grand Fleet initiated + both Cetus aerial crash simultaneously. powerCost 0 (energy from angular momentum). bothHighSpin+QTE: −80/×2.80[M]/300ms/ringOut 95%/tsunamiRadius 250px. Partial (one Cetus missing): −35/×1.40/150ms/60%. Canon: 3-vs-1 defeat of Julian+Sophie+Wales [M]. Weak points: linear slash, matched tornado, pre-emption. **Anime physics override**: combined L=3.651e-2 → stadium-width tsunami wave [M].
**2.5D Rendering**: Dual aerial crash; tsunami wave across full stadium; multi-target ring-out zone
**Gimmick**: grandDeucalion(waterFieldPrimed, grandFleetActive, bothHighSpin, qteHit) → spinDelta, dmgMult, lockMs, ringOutForce, multiTarget, tsunamiRadius
**Special Move**: Grand Deucalion · powerCost 0 (joint) · animeOverride true
**Compatible beys**: Sophie Grand Cetus T125RS + Wales Grand Cetus WD145RS; Grand Maelstrom primed prerequisite
**Engine Note**: bothHigh+QTE: −80/×2.80[M]/300ms/tsunamiRadius 250px/ringOut 95%; powerCost 0

---

### [Case 1536 — [COMBO] Grand Wave (↓ ↓ ↑)](./13%20case%20study.md#case-1536)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: coop+waterActive+QTE: −26/1.459×[coop]/200ms; waterActive+QTE: −20/1.456×/100ms; base+QTE: −18/1.30×/100ms; miss: −9/1.10×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 15 · Defense 60 · Stamina 65 · Speed 30
**Mechanism**: ↓↓ (double bowl-descent) + ↑ (upswing wave). waterBonus ×1.12, coopBonus ×1.30 (tag-battle partner also executing). waterActive: −20, 1.456×, 100ms. coop+water: −26, 1.459×[M], 200ms. Coop mode exceeds 1.5× ceiling as joint-special territory. Cost 25, stamina. Solo ceiling: 1.456× ≤ 1.5 ✓.
**2.5D Rendering**: Double bowl-descent; upswing surge arc
**Gimmick**: comboDetect(seq=[moveDown,moveDown,moveUp], window=600ms); coop tag-battle flag
**Engine Note**: waterActive: −20/1.456×/100ms; coop+water: −26/1.459×/200ms; cost 25

---

### [Case 1537 — [GIMMICK] Glory Regnar Greatest Armor Low-Spin Clasp Mode & Halo Formation (Rashad Goodman · Glory Regnar Over High Xtend+')](./13%20case%20study.md#case-1537)

**System**: Gen4-Burst / DB · Defense/Stamina
**Geometry**: r_arm_ext = 4.0 cm · r_arm_clasped = 1.2 cm · m_assembly = 41 g · I_ext = 3.527×10⁻⁵ kg·m² · I_clasped = 2.799×10⁻⁵ kg·m²
**Material**: DB Energy Layer Glory Regnar (Greatest Armor plates ×2) + Forge Disc Over + High Xtend+' tip
**Spin Coupling**: ΔI = 7.28×10⁻⁶ kg·m²; ω_activation = 200 rad/s → ω_after = 252 rad/s (+52 rad/s, +26%)
**Contact Points**: Halo deflect: φ_halo=59°; effective impulse = 51.5% (48.5% deflected). τ_HXT = 2.89×10⁻⁵ N·m; t_spin = 152.8 s
**Movement Freedom**: BeySpirit drives upward clasp against gravity at low ω [M]; +52 rad/s spin boost is physically grounded
**Base Stats**: Attack 10 · Defense 85 · Stamina 80 · Speed 15
**Mechanism**: I_ext=3.527e-5 → I_clasped=2.799e-5; ΔI=7.28e-6. L conservation at ω=200: ω_after=252 rad/s (+52 rad/s, +26% [CALCULATED]). Halo at h=20mm, r=12mm: φ=59°; 48.5% deflect [CALCULATED]. BeySpirit provides upward clasp at low spin [M]; physical spin boost consequence is real.
**2.5D Rendering**: Armor-plate rise animation; halo crown formation; deflect-arc field
**Gimmick**: greatestArmorClasp(ω, I_ext, I_clasped) → ω_after, deflectFraction
**Engine Note**: ΔI 7.28e-6; +52 rad/s spin boost [CALCULATED]; halo deflect 48.5%; t_spin 152.8 s

---

### [Case 1538 — [SPECIAL] Glory Crown (Rashad Goodman · Glory Regnar Over High Xtend+')](./13%20case%20study.md#case-1538)

**System**: Gen4-Burst / DB · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: defenseMode+lowSpin+QTE: +52/incoming ×0.515/300ms; lowSpin+QTE: +35/×0.65/200ms; QTE: +15/×0.80/100ms; miss: +8/×0.90/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 85 · Stamina 80 · Speed 15
**Mechanism**: Greatest Armor low-spin clasp: +52 rad/s spin boost [CALCULATED] + incoming ×0.515 (48.5% deflect halo). defenseMode+lowSpin+QTE: +52/×0.515/300ms (max lockMs = combo ceiling). powerCost 70. forceState: 'cannot_attack_freely'. **Anime physics override**: upward clasp against gravity at low spin; BeySpirit drives arm rise [M]; physical spin boost consequence real.
**2.5D Rendering**: Crown formation animation; spin-boost pulse; deflect-barrier glow
**Gimmick**: gloryCrown(defenseMode, lowSpin, qteHit) → spinDelta, incomingMult, lockMs
**Special Move**: Glory Crown · powerCost 70 · animeOverride true
**Compatible beys**: Glory Regnar Over High Xtend+' (Rashad Goodman); any DB bey with hinged-plate I-reduction mechanism
**Engine Note**: defenseMode+lowSpin+QTE: +52/×0.515/300ms [CALCULATED spin boost]; powerCost 70

---

### [Case 1539 — [COMBO] Crown Guard (K K ↓)](./13%20case%20study.md#case-1539)

**System**: Gen4-Burst / DB · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: defenseMode+QTE: +10/incoming ×0.72/200ms; QTE: +6/×0.82/120ms; miss: +3/×0.92/0ms
**Movement Freedom**: —
**Base Stats**: Attack 10 · Defense 85 · Stamina 80 · Speed 15
**Mechanism**: K K (double defense posture tighten) + ↓ (deepest bowl drop). defenseMode+QTE: self +10, incoming ×0.72, 200ms. QTE: +6, ×0.82, 120ms. Cost 0, defense/balanced. Ceiling: ×0.72 = incoming reduction (defensive; not outgoing cap); lockMs 200 ≤ 300 ✓.
**2.5D Rendering**: Double armor-plate rise on K×2; bowl-drop repositioning
**Gimmick**: comboDetect(seq=[defense,defense,moveDown], window=600ms)
**Engine Note**: defenseMode+QTE: +10/×0.72 incoming/200ms; QTE: +6/×0.82/120ms; cost 0; defense combo

---

### [Case 1540 — [GIMMICK] Glory Regnar Greatest Armor High-Spin Extension Reach & Catch Mechanism (Rashad Goodman) [EXTENDS Case 1537]](./13%20case%20study.md#case-1540)

**System**: Gen4-Burst / DB · Attack/Defense
**Geometry**: r_arm_ext = 4.0 cm · v_tip = 25.1 m/s · KE_arms = 1.578 J (×2 arms) · F_cent = 39.4 N per arm
**Material**: Same Greatest Armor plates (Case 1537) in high-spin extended position
**Spin Coupling**: I_opponent ≈ 3.5×10⁻⁵; I_combined_closed = 6.299×10⁻⁵; ω_final = 351.6 rad/s [M]; J_vert = 1.567×10⁻² N·s [M]
**Contact Points**: BeySpirit holds closure against F_cent = 39.4 N [M]; seismic-toss redirect via precession at θ_tilt=45° [M]
**Movement Freedom**: At high spin: F_cent = 39.4 N dominates gravity 1642× → arms rigidly locked at r=40mm (no BeySpirit needed for extension)
**Base Stats**: Attack 70 · Defense 70 · Stamina 35 · Speed 65
**Mechanism**: v_tip=25.1 m/s, KE_arms=1.578 J. Catch: plates snap from r=40mm to r=10mm [M] within 5ms arm sweep. ω_final=351.6 rad/s after opponent absorption [M]. J_vert=1.567e-2 N·s via precession redirect at 45° [M]. EXTENDS Case 1537.
**2.5D Rendering**: Extended arm sweep arc; catch-snap animation; seismic-toss precession redirect
**Gimmick**: armCatch(ω, catchSuccess, I_opp) → ω_final, J_vert
**Engine Note**: v_tip 25.1 m/s; KE_arms 1.578 J; F_cent 39.4 N; J_vert_slam 1.567e-2 N·s [M]

---

### [Case 1541 — [SPECIAL] Glory Slam (Rashad Goodman · Glory Regnar Over High Xtend+')](./13%20case%20study.md#case-1541)

**System**: Gen4-Burst / DB · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: highSpin+catch+QTE: −60/×1.80/250ms/ringOut 90%; catch+QTE: −40/×1.50/180ms/70%; QTE glancing: −20/×1.25/80ms/25%; miss: −10/×1.05/0ms/5%
**Movement Freedom**: —
**Base Stats**: Attack 70 · Defense 70 · Stamina 35 · Speed 65
**Mechanism**: Greatest Armor high-spin catch + seismic-toss slam. highSpin+catch+QTE: −60/×1.80[M]/250ms/ringOut 90%. BeySpirit holds catch against F_cent=39.4 N [M]; seismic toss J_vert=1.567e-2 N·s [M]. powerCost 90. forceState: 'must_keep_distance'. **Anime physics override**: arm closure held against 39.4 N centrifugal force; gyroscopic precession slam [M].
**2.5D Rendering**: Arm-sweep catch; seismic-slam arc; ring-out bounce
**Gimmick**: glorySlam(highSpin, catchSuccess, qteHit) → spinDelta, dmgMult, lockMs, ringOutForce
**Special Move**: Glory Slam · powerCost 90 · animeOverride true
**Compatible beys**: Glory Regnar Over High Xtend+' (Rashad Goodman)
**Engine Note**: highSpin+catch+QTE: −60/×1.80/250ms/ringOut 90%; powerCost 90

---

### [Case 1542 — [COMBO] Slam Down (J ↓ J)](./13%20case%20study.md#case-1542)

**System**: Gen4-Burst / DB · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: bowlConfinement+QTE: −20/1.35×/150ms; QTE: −14/1.22×/100ms; miss: −7/1.08×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 70 · Defense 70 · Stamina 35 · Speed 65
**Mechanism**: J (approach dash) → ↓ (bowl-base confinement) → J (slam upswing). bowlConfinement+QTE: −20, 1.35×, 150ms. QTE: −14, 1.22×, 100ms. Cost 25, balanced/attack. Ceiling: 1.35× ≤ 1.5 ✓.
**2.5D Rendering**: Approach dash; bowl-base catch; slam upswing burst
**Gimmick**: comboDetect(seq=[attack,moveDown,attack], window=600ms)
**Engine Note**: bowlConfinement+QTE: −20/1.35×/150ms; QTE: −14/1.22×/100ms; cost 25

---

### [Case 1543 — [GIMMICK] Earth Virgo GB145BS Bowl-Wall Launch Ramp & Top-Contact Landing Physics (Teru Saotome) [EXTENDS Cases 641 & 642]](./13%20case%20study.md#case-1543)

**System**: Gen2-MFB / HWS · Stamina/Defense
**Geometry**: m = 37 g · v_horiz = 1.299 m/s · v_vert = 0.750 m/s · h_max = 28.7 mm · x_range = 198.6 mm
**Material**: Earth FW + GB145 (ball channel) + BS tip (ball-mode r_ball=3mm, μ=0.08)
**Spin Coupling**: p_horiz = 0.048 N·s; Δv_Aquario = 1.78 m/s; Δv_Pegasus = 1.50 m/s; Δv_Eagle = 1.04 m/s
**Contact Points**: Link: τ_friction = 8.70×10⁻⁵ N·m; spin drain = 2.49 rad/s/s; F_added = 0.363 N downward; F_expel = 14.6 N at r_offset=1mm [M]
**Movement Freedom**: Physical h_max=28.7mm barely crests opponent at ~20–25mm; BeySpirit amplifies for clean crest [M]; DISTINCT from Cases 641 (horizontal evasion) & 642 (Allegro Entrechat)
**Base Stats**: Attack 40 · Defense 55 · Stamina 70 · Speed 50
**Mechanism**: Bowl lip θ_bowl=30°: v_horiz=1.299 m/s, v_vert=0.750 m/s. h_max=28.7mm [CALCULATED]. p_horiz=0.048 N·s → Δv_Aquario=1.78 m/s (ring-out). Link: BS ball tip spin drain=2.49 rad/s/s [CALCULATED], F_added=0.363 N. Gyroscopic link stability Ω_prec=0.137–0.179 rad/s; mount holds for 5s canon duration.
**2.5D Rendering**: Bowl-lip launch arc; parabolic trajectory; top-mount link timer
**Gimmick**: bowlLaunch(θ_bowl, v_orbit, m_Virgo, m_opp) → p_horiz, Δv_opp, h_max
**Engine Note**: h_max 28.7mm; p_horiz 0.048 N·s; Δv_Aquario 1.78 m/s; drain 2.49 rad/s/s [CALCULATED]

---

### [Case 1544 — [SPECIAL] Grand Jeté (Teru Saotome · Earth Virgo GB145BS)](./13%20case%20study.md#case-1544)

**System**: Gen2-MFB / HWS · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: light+linkQTE+3presses: −(12+15)=−27/×1.40/200ms/ringOut up to 90%; light+QTE miss: −10/×1.30/80ms/85%; heavy+QTE miss: −10/×1.05/80ms/30%
**Movement Freedom**: —
**Base Stats**: Attack 45 · Defense 50 · Stamina 65 · Speed 50
**Mechanism**: Aerial leap + top-mount link (5s, 3 QTE presses). Link: drain=2.49 rad/s/s × linkMs/1000 [CALCULATED]; linkDurationMs = min(1500+1500×presses, 5000). lightOpponent (m<35g): ringOut bonus high (Aquario Δv=1.78 m/s). powerCost 80. forceState: 'must_stay_still'. **Anime physics override**: h_max physical 28.7mm [CALCULATED]; aerial height BeySpirit amplified [M]; full mount stable for canon 5s.
**2.5D Rendering**: Parabolic arc; top-mount link timer; periodic QTE prompt; dismount slam
**Gimmick**: grandJete(lightOpponent, linkQteHit, linkPressCount) → spinDelta, dmgMult, linkDurationMs, ringOutForce
**Special Move**: Grand Jeté · powerCost 80 · animeOverride true
**Compatible beys**: Earth Virgo GB145BS (Teru Saotome); low-profile design enables top-crest of opponent ARs
**Engine Note**: drain 2.49 rad/s/s [CALCULATED]; max link 5000ms (canon); light-opp ringOut bonus +0.05/1500ms; powerCost 80

---

### [Case 1545 — [COMBO] Graceful Leap (↑ J ↑)](./13%20case%20study.md#case-1545)

**System**: Gen2-MFB / HWS · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: light+QTE: −18/1.30×/100ms/ringOutBonus +0.25; heavy+QTE: −12/1.20×/100ms/+0.05; miss: −6/1.05×/0ms/0
**Movement Freedom**: —
**Base Stats**: Attack 40 · Defense 55 · Stamina 70 · Speed 50
**Mechanism**: ↑ (bowl-wall approach) → J (bowl-lip launch) → ↑ (post-landing forward drive). light (m<35g): −18, 1.30×, 100ms, ringOutBonus +0.25. heavy: −12, 1.20×, 100ms, +0.05. Cost 15, stamina/balanced. Ceiling: 1.30× ≤ 1.5 ✓.
**2.5D Rendering**: Bowl-lip arc; brief top-contact flash; forward continuation
**Gimmick**: comboDetect(seq=[moveUp,attack,moveUp], window=600ms); lightOpponentFlag
**Engine Note**: light: −18/1.30×/100ms/+0.25 ringOut; heavy: −12/1.20×/100ms; cost 15; stamina combo

---

### [Case 1574 — [GIMMICK] Hades Kerbecs BD145DS — BD145 Flywheel Ring & DS Tip Ground Coupling (Damian Hart · Hades Kerbecs BD145DS)](./13%20case%20study.md#case-1574)

**System**: Gen2-MFB / Metal Masters · Defense/Stamina
**Geometry**: r_BD = 3.0 cm · m_BD = 4 g · I_BD = 1.80×10⁻⁶ kg·m² (24.3% of total) · m_total = 38 g · I_total = 7.40×10⁻⁶ kg·m² · ω₀ = 628 rad/s
**Material**: Crystal Wheel Hades + Kerbecs Metal Wheel (3-segment Cerberus, m_MW=28 g, r=2.3 cm) + BD145 + DS tip
**Spin Coupling**: L₀ = 4.647×10⁻³ kg·m²/s; E_kinetic = 1.459 J; P_burst (0.1s) = 14.6 W
**Contact Points**: BD near-floor suction: v_rim=18.84 m/s; Δp=217.5 Pa; F_suction=0.615 N (1.65× effective weight). DS high-spin: τ=1.42×10⁻⁴ N·m; DS low-spin dome: τ=5.22×10⁻⁴ N·m. Cerberus f_contact=300 Hz
**Movement Freedom**: BD32% longer spin life vs without; DS hybrid sharp/dome mode switch at ω=200 rad/s
**Base Stats**: Attack 35 · Defense 80 · Stamina 60 · Speed 35
**Mechanism**: I_total=7.40e-6. BD disk: I_BD=1.80e-6 (24.3%); h_gap≈3mm; F_suction=0.615 N [CALCULATED]. DS: sharp at high ω, dome at low ω. Cerberus: 3 segments, f_contact=300Hz [CALCULATED]. P_burst=14.6W at 0.1s.
**2.5D Rendering**: BD145 disk near-floor; Cerberus three-head segments; DS dual-mode indicator
**Gimmick**: bd145Suction(ω, r_BD, h_gap) → F_suction, τ_DS, f_Cerberus
**Engine Note**: F_suction 0.615 N; BD t_spin +32%; f_Cerberus 300 Hz; E_kinetic 1.459 J; P_burst 14.6 W

---

### [Case 1575 — [SPECIAL] Hades Drive (Damian Hart · Hades Kerbecs BD145DS)](./13%20case%20study.md#case-1575)

**System**: Gen2-MFB / Metal Masters · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: fullSpin+ground+QTE: −50/×1.65[M]/200ms/AoE 200mm/spinDrain −20 all; fullSpin+ground: −30/×1.35/150ms/AoE 100mm/−10; miss: −15/×1.10/50ms/no AoE
**Movement Freedom**: —
**Base Stats**: Attack 40 · Defense 80 · Stamina 55 · Speed 35
**Mechanism**: BD145 flywheel discharge + DS near-floor venturi ground wave. Physical: v_rim=18.84 m/s, E_kinetic=1.459 J, P_burst=14.6W. BeySpirit: full-stadium ground vortex r=200mm [M]. QTE: Hell-Lock (350ms). fullSpin+ground+QTE: −50/×1.65[M]/200ms/AoE 200mm/drain −20 all [M]. forceState: 'must_hold_center'. Note: similar to Storm Bringer (Ryuga) but ground-coupled chthonic inversion. powerCost 90. **Anime physics override**: BD ground wave amplified to stadium-filling hellfire vortex [M].
**2.5D Rendering**: Ground-wave radial expansion; AoE spin-drain zone; center-hold indicator
**Gimmick**: hadesDrive(fullSpin, groundContact, qteHit) → spinDelta, dmgMult, lockMs, aoeRadius, spinDrainAoe
**Special Move**: Hades Drive · powerCost 90 · animeOverride true
**Compatible beys**: Hades Kerbecs BD145DS (Damian Hart); BD-class disk r_BD≥2.8cm, h_gap≤5mm + low-friction tip
**Engine Note**: fullSpin+ground+QTE: −50/×1.65[M]/AoE 200mm/drain −20; powerCost 90

---

### [Case 1576 — [COMBO] Hades Press (↓ J ↓)](./13%20case%20study.md#case-1576)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: heavy+QTE: −18/1.25×/150ms/ringOutBonus +0.05; base+QTE: −12/1.15×/150ms/+0.02; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 35 · Defense 80 · Stamina 60 · Speed 35
**Mechanism**: ↓ (center approach/DS ground contact) → J (floor-coupling impulse) → ↓ (press resume). heavy (m>35g): −18, 1.25×, 150ms, ringOut+0.05. Base: −12, 1.15×, 150ms. Cost 25, defense/stamina. Ceiling: 1.25× ≤ 1.5 ✓.
**2.5D Rendering**: Center drop; DS ground-stamp flash; press-resume arc
**Gimmick**: comboDetect(seq=[moveDown,attack,moveDown], window=600ms); heavyBeyFlag
**Engine Note**: heavy: −18/1.25×/150ms; base: −12/1.15×/150ms; cost 25; defense combo

---

### [Case 1577 — [GIMMICK] Hades Kerbecs BD145DS — BD145 Centripetal Vortex Inversion & Cerberus Devour Contact [EXTENDS Case 1574]](./13%20case%20study.md#case-1577)

**System**: Gen2-MFB / Metal Masters · Defense/Attack
**Geometry**: Physical inward pull at d=10cm: F_pull = 9.7×10⁻⁴ N (entirely negligible) → chain pull entirely BeySpirit [M]
**Material**: BD145 in centripetal-pull configuration; Kerbecs 3-segment Cerberus devour
**Spin Coupling**: Chain reach: base 80mm + 25mm per J press [M]; max 200mm (arena radius cap). Cerberus devour: Δp=2.535 N·s per arrival (3 segments, f=300Hz)
**Contact Points**: Cerberus devour: F_segment=253.6 N [M]; Δp per segment=0.845 N·s; net devour impulse=2.535 N·s [CALCULATED — sufficient ring-out on sub-50g opponent]
**Movement Freedom**: —
**Base Stats**: Attack 45 · Defense 75 · Stamina 55 · Speed 30
**Mechanism**: Physical pull 9.7e-4 N at 10cm — chain pull 100% BeySpirit [M]. Chain reach=80+25×presses [M] (max 200mm). Cerberus 3-segment devour: F=253.6N [M], Δp=0.845 N·s, total=2.535 N·s [CALCULATED]. L=4.647e-3 kg·m²/s gyroscopic anchor. EXTENDS Case 1574.
**2.5D Rendering**: Chain-pull beam extending; Cerberus devour sequence on arrival
**Gimmick**: hadesGateChain(J_presses, I_target) → chainReach, devourImpulse
**Engine Note**: chain +25mm/J press [M]; max 200mm; devour Δp 2.535 N·s [CALCULATED]; F_segment 253.6 N [M]

---

### [Case 1578 — [SPECIAL] Hades Gate (Damian Hart · Hades Kerbecs BD145DS)](./13%20case%20study.md#case-1578)

**System**: Gen2-MFB / Metal Masters · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: 10 presses: reach 200mm/×2.20[M]/−60/ringOut 0.95; 5 presses: 200mm/×1.85[M]/−45/0.73; 0 presses: 80mm/×1.50/−30/0.50
**Movement Freedom**: —
**Base Stats**: Attack 50 · Defense 70 · Stamina 50 · Speed 30
**Mechanism**: 3000ms J button-mash QTE; chain reach=80+25×presses (max 200mm) [M]; devour Δp=2.535 N·s on arrival. spinDelta=−(30+presses×3); dmgMult=1.50+(presses/10)×0.70; ringOutForce=0.50+(presses/10)×0.45. powerCost 95. forceState: 'must_hold_center'. Canon: 10 presses → defeats Julian+Sophie+Wales simultaneously [M]. **Anime physics override**: BeySpirit chain-pull draws 3 opponents; Cerberus devour 100% [M].
**2.5D Rendering**: Gate-open animation; chain beams extending; Cerberus devour on each arrival; multi-target counter
**Gimmick**: hadesGate(chainPresses, opponentsInRange) → spinDelta, dmgMult, chainReachMm, targetsHit, ringOutForce
**Special Move**: Hades Gate · powerCost 95 · animeOverride true
**Compatible beys**: Hades Kerbecs BD145DS (Damian Hart); L≥4.5×10⁻³ kg·m²/s gyroscopic anchor required
**Engine Note**: 10 presses: −60/×2.20[M]/ringOut 0.95; chain +25mm/press [M]; powerCost 95

---

### [Case 1579 — [COMBO] Cerberus Drag (← J ↓)](./13%20case%20study.md#case-1579)

**System**: Gen2-MFB / Metal Masters · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: nearWall+QTE: −16/1.30×/150ms/ringOutBonus +0.20; base+QTE: −16/1.20×/150ms/+0.05; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 45 · Defense 75 · Stamina 55 · Speed 30
**Mechanism**: ← (lateral flank, BD vortex alignment) → J (single grab contact) → ↓ (wall-press drive). nearWall: −16, 1.30×, 150ms, +0.20 ringOut. Base: −16, 1.20×, 150ms. Cost 25, defense/stamina. Ceiling: 1.30× ≤ 1.5 ✓.
**2.5D Rendering**: Lateral flank arc; grab-contact flash; wall-press drive
**Gimmick**: comboDetect(seq=[moveLeft,attack,moveDown], window=600ms); nearWallFlag
**Engine Note**: nearWall: −16/1.30×/150ms/+0.20; base: −16/1.20×/150ms; cost 25; defense combo

---

### [Case 1580 — [GIMMICK] Scythe Kronos T125EDS — Dual-Axis Vertical Impact Geometry [EXTENDS Cases 1267 & 1270]](./13%20case%20study.md#case-1580)

**System**: Gen2-MFB / Metal Fury · Attack
**Geometry**: θ_blade = 15° · r_arm_tip = 2.2 cm · m_arm = 12 g [M] · ω = 628 rad/s (Case 1267/1270 baseline)
**Material**: Scythe Fusion Wheel asymmetric arm; T125+EDS from Cases 1267/1270
**Spin Coupling**: F_normal = 103.5 N [M]; F_horiz = 99.9 N [CALCULATED]; F_vert_up = 26.8 N [CALCULATED]
**Contact Points**: τ_tilt = 0.616 N·m [CALCULATED]; Δω_tilt = 35.1 rad/s per 2ms contact [CALCULATED]; L_tilt impulse = 1.23×10⁻³ N·m·s
**Movement Freedom**: Height-advantage contact required; Kronos elevated via T125 track (Case 1267)
**Base Stats**: Attack 80 · Defense 30 · Stamina 35 · Speed 75
**Mechanism**: θ=15° blade angle. F_horiz=103.5×cos(15°)=99.9 N [CALCULATED]; F_up=103.5×sin(15°)=26.8 N [CALCULATED]. τ_tilt=26.8×0.023=0.616 N·m [CALCULATED]; Δω_tilt=35.1 rad/s [CALCULATED]. Dual-axis (horizontal smash + vertical lift) simultaneously — distinct from Case 1267 debris vortex and Case 1270 radial ring. Mythology: Uranus (sky/heaven) + Gaea (earth) reference.
**2.5D Rendering**: Dual-axis strike arc; vertical-lift indicator + horizontal-smash flash; height-advantage marker
**Gimmick**: dualAxisContact(θ_blade, ω, m_arm, heightAdv) → F_horiz, F_up, τ_tilt
**Engine Note**: F_horiz 99.9 N [CALC]; F_up 26.8 N [CALC]; τ_tilt 0.616 N·m; Δω_tilt 35.1 rad/s [CALC]

---

### [Case 1581 — [SPECIAL] Heaven and Earth Strike (Aguma · Scythe Kronos T125EDS)](./13%20case%20study.md#case-1581)

**System**: Gen2-MFB / Metal Fury · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: height+QTE: −65/×2.10[M]/250ms/tiltInduced 35.1 rad/s; height miss: −35/×1.50/150ms/10.0 rad/s; no height: −20/×1.15/80ms/0
**Movement Freedom**: —
**Base Stats**: Attack 80 · Defense 30 · Stamina 35 · Speed 75
**Mechanism**: Simultaneous J+↑ dual-input (200ms). height+QTE: −65/×2.10[M]/250ms/tiltInduced=35.1 rad/s [CALCULATED]. powerCost 100 (full drain — single canonical use vs Diablo Nemesis X:D). **Anime physics override**: dual-axis simultaneous Uranus+Gaea force; single-use desperation [M]. tiltInduced=35.1 rad/s physically grounded (Case 1580).
**2.5D Rendering**: Dual-axis flash; height-advantage elevation; tilt-induction gauge
**Gimmick**: heavenAndEarthStrike(heightAdvantage, qteHit) → spinDelta, dmgMult, lockMs, tiltInduced, dualAxisBonus
**Special Move**: Heaven and Earth Strike · powerCost 100 · animeOverride true
**Compatible beys**: Scythe Kronos T125EDS (Aguma); asymmetric FW with upward-angled blade φ>10° + height-giving track
**Engine Note**: height+QTE: −65/×2.10[M]/250ms/tiltInduced 35.1 rad/s [CALC]; powerCost 100

---

### [Case 1582 — [COMBO] Divine Cross (↑ J ↓)](./13%20case%20study.md#case-1582)

**System**: Gen2-MFB / Metal Fury · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: heightGained+QTE: −22/1.35×/150ms/ringOutBonus +0.10; base+QTE: −14/1.20×/150ms/+0.03; miss: −8/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 80 · Defense 30 · Stamina 35 · Speed 75
**Mechanism**: ↑ (bowl-lip height gain) → J (dual-axis contact) → ↓ (earth-exit follow-through). heightGained: −22, 1.35×, 150ms, +0.10 ringOut. Base: −14, 1.20×, 150ms. Cost 35, balanced/attack. Ceiling: 1.35× ≤ 1.5 ✓.
**2.5D Rendering**: Rise arc; dual-axis flash; downward follow-through
**Gimmick**: comboDetect(seq=[moveUp,attack,moveDown], window=600ms); heightGainedFlag
**Engine Note**: heightGained: −22/1.35×/150ms/+0.10 ringOut; base: −14/1.20×/150ms; cost 35; balanced combo

---

### [Case 1583 — [GIMMICK] Thermal Lacerta WA130HF — Wing Attack Forced-Convection Column & HF Orbital Positioning [EXTENDS Case 816]](./13%20case%20study.md#case-1583)

**System**: Gen2-MFB / Metal Masters·Fury · Stamina/Balanced
**Geometry**: r_wing = 2.8 cm · m_WA130 = 3 g · m_Thermal = 25 g · m_total = 37 g · I_total = 5.90×10⁻⁶ kg·m²
**Material**: Thermal Metal Wheel (smooth curved lacerta segments) + WA130 (radial wings deployed at h=130mm) + HF tip
**Spin Coupling**: F_deploy = 33.1 N (wings at ω₀) [CALCULATED]; v_wing_tip = 17.58 m/s; Q_retained ≈ 1.04 W per wing; h_conv = 120 W/(m²·K)
**Contact Points**: E_kinetic = 1.163 J; E_combined with Zurafa = 2.345 J [CALCULATED]. HF tip: 15% faster pivot-redirect (cooperative approach alignment)
**Movement Freedom**: WA130 wings concentrate R145 friction heat (Case 816) rather than dispersing; cooperative proximity required for fireball build
**Base Stats**: Attack 50 · Defense 30 · Stamina 65 · Speed 55
**Mechanism**: I_Thermal=4.23e-6, I_total=5.90e-6. WA130 wings: F_deploy=33.1N [CALCULATED]; v_tip=17.58 m/s; Q_retained≈1.04W per wing [CALCULATED]. HF tip 15% faster redirect → cooperative orbit alignment with Zurafa. E_combined=2.345J [CALCULATED]. EXTENDS Case 816.
**2.5D Rendering**: WA130 radial wings deployed; forced-convection column around bey pair; fireball build indicator
**Gimmick**: wa130Convection(ω, A_wing, r_wing) → F_deploy, v_tip, Q_retained
**Engine Note**: F_deploy 33.1 N; v_tip 17.58 m/s; Q_retained 1.04 W/wing; E_combined 2.345 J (with Zurafa)

---

### [Case 1584 — [SPECIAL] Heaven's Supreme Destruction Palm (Chi-yun Li + Dashan Wang · Thermal Lacerta WA130HF + Rock Zurafa R145WB)](./13%20case%20study.md#case-1584)

**System**: Gen2-MFB / Metal Masters·Fury · Special Move (Joint)
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: both+primed+QTE: −55 each/×2.40[M]/300ms/fireball 150mm[M]/AoE ringOut; both+primed: −35/×1.80[M]/200ms/80mm; partial: −15/×1.10/50ms/no AoE
**Movement Freedom**: —
**Base Stats**: Attack 55 · Defense 30 · Stamina 60 · Speed 55
**Mechanism**: JOINT SPECIAL: Thermal Lacerta WA130HF (Chi-yun) + Rock Zurafa R145WB (Dashan). thermalPrimed: beys within 60mm for ≥2s. E_combined=2.345J physical base. BeySpirit ignites combined thermal field → fireball [M]. powerCost 0 (drawn from angular momentum). both+primed+QTE: −55/×2.40[M]/300ms/fireball r=150mm[M]. Canon: Yuki nearly fell off cliff [M]. forceState: 'must_stay_near_partner'. **Anime physics override**: thermal field combustion; fireball projectile [M].
**2.5D Rendering**: Partner proximity indicator; fireball build; fireball launch arc; AoE blast
**Gimmick**: heavensSupremeDestructionPalm(bothActive, thermalPrimed, qteHit) → spinDelta, dmgMult, lockMs, fireballRadius, aoeRingOut
**Special Move**: Heaven's Supreme Destruction Palm · powerCost 0 (joint) · animeOverride true
**Compatible beys**: Thermal Lacerta WA130HF (Chi-yun Li) + Rock Zurafa R145WB (Dashan Wang)
**Engine Note**: both+primed+QTE: −55/×2.40[M]/fireball 150mm[M]; powerCost 0

---

### [Case 1585 — [COMBO] Thermal Cross (↑ ← J)](./13%20case%20study.md#case-1585)

**System**: Gen2-MFB / Metal Masters·Fury · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: clustered+QTE: −20/1.30×/100ms/ringOutBonus +0.05; base+QTE: −14/1.20×/100ms/+0.05; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 50 · Defense 30 · Stamina 65 · Speed 55
**Mechanism**: ↑ (upper-bowl approach + WA130 deploy) → ← (lateral sweep + convective burst) → J (thermal-augmented strike). clustered: −20, 1.30×, 100ms. Base: −14, 1.20×, 100ms. Cost 25, balanced/stamina. Ceiling: 1.30× ≤ 1.5 ✓.
**2.5D Rendering**: Wing-deploy arc; lateral convective sweep; thermal strike flash
**Gimmick**: comboDetect(seq=[moveUp,moveLeft,attack], window=600ms); clusterFlag
**Engine Note**: clustered: −20/1.30×/100ms; base: −14/1.20×/100ms; cost 25; balanced combo

---

### [Case 1586 — [GIMMICK] Draciel V / Draciel V2 — Turtle AR Hydrodynamic Impeller & V2 Blade Upgrade [EXTENDS Cases 1492–1494]](./13%20case%20study.md#case-1586)

**System**: Gen1-Plastic / V-Force · G-Revolution · Defense/Stamina
**Geometry**: r_AR = 2.0 cm · A_wing = 1.20×10⁻⁴ m² per wing · v_wing_tip = 12.56 m/s · 4 symmetric wings
**Material**: Draciel V AR (4-wing turtle shell, h=8mm) → V2 AR (h=10mm, +25% wave momentum)
**Spin Coupling**: V: F_hydro=37.9 N / p_wave=0.0176 kg·m/s (50ms). V2: F_hydro=47.3 N / p_wave=0.022 kg·m/s (+25% physically grounded). Both: Δv < 1.0 m/s ring-out threshold → BeySpirit amplifies [M]
**Contact Points**: τ_visc = 5.17×10⁻⁸ N·m (physical, BeySpirit amplifies water depth [M]). Q=2.51×10⁻³ m³/s [CALCULATED]
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 85 · Stamina 65 · Speed 30
**Mechanism**: v_tip=12.56 m/s. F_hydro per wing (V): 9.47 N [CALCULATED]; total: 37.9 N [CALCULATED]. V2 (+25%): 47.3 N [CALCULATED]. p_wave V=0.0176 kg·m/s; V2=0.022 kg·m/s [CALCULATED]. Both below physical ring-out Δv → BeySpirit amplifies [M]. Extends Cases 1492–1494 (Draciel G orbital drain — distinct mechanism).
**2.5D Rendering**: 4-wing turtle AR rotation; wave burst ring; V2 upgrade indicator (+25%)
**Gimmick**: dracielVWave(v2Version, A_wing, v_tip) → F_hydro, p_wave, Q
**Engine Note**: V F_hydro 37.9 N; V2 F_hydro 47.3 N (+25% [CALC]); p_wave V 0.0176 / V2 0.022 kg·m/s

---

### [Case 1587 — [SPECIAL] Heavy Viper Wall (Max Tate · Draciel V / Draciel V2)](./13%20case%20study.md#case-1587)

**System**: Gen1-Plastic / V-Force · G-Revolution · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: V2+drown+QTE: −20/×1.94[M]/150ms/drownDrain −25/ringOut 0.80; V+drown+QTE: −20/×1.55[M]/150ms/drain −18/0.65; QTE V: −15/×1.30/100ms/0.45; miss: −10/×1.05/0ms/0.20
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 90 · Stamina 60 · Speed 30
**Mechanism**: Hydrodynamic wave burst + drown phase (standing wave submerge) + wave-carrier ring-out. waveBonus=1.25× (V2 physically grounded, Case 1586). V2+drown+QTE: −20/×1.94[M]/150ms/drownDrain −25/ringOut 0.80. powerCost 85. forceState: 'must_hold_center'. Wave Launch QTE 300ms. **Anime physics override**: BeySpirit conjures water field [M]; ring-out from wave carrier [M].
**2.5D Rendering**: Wave burst ring; drown phase submerge; wave-carry ring-out arc
**Gimmick**: heavyViperWall(v2Version, drowningPhaseHit, qteHit) → spinDelta, dmgMult, lockMs, drownSpinDrain, ringOutForce
**Special Move**: Heavy Viper Wall · powerCost 85 · animeOverride true
**Compatible beys**: Draciel V / Draciel V2 (Max Tate); 4-wing balanced AR at r≥1.8cm + BeySpirit water
**Engine Note**: V2+drown+QTE: −20/×1.94[M]/drain −25/ringOut 0.80; V2 waveBonus 1.25× [CALC]; powerCost 85

---

### [Case 1588 — [COMBO] Viper Surge (↑ ↑ J)](./13%20case%20study.md#case-1588)

**System**: Gen1-Plastic / V-Force · G-Revolution · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: orbitalHigh+QTE: −16/1.25×/80ms/ringOutBonus +0.10; base+QTE: −10/1.15×/80ms/+0.03; miss: −6/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 20 · Defense 85 · Stamina 65 · Speed 30
**Mechanism**: ↑ ↑ (double upper-bowl orbital build) → J (AR tangential contact). orbitalHigh (>80% max orbital speed): −16, 1.25×, 80ms, +0.10 ringOut. Base: −10, 1.15×, 80ms. Cost 15, defense/stamina. Ceiling: 1.25× ≤ 1.5 ✓.
**2.5D Rendering**: Double-up orbital arc; AR tangential contact flash
**Gimmick**: comboDetect(seq=[moveUp,moveUp,attack], window=600ms); orbitalSpeedFlag
**Engine Note**: orbitalHigh: −16/1.25×/80ms/+0.10; base: −10/1.15×/80ms; cost 15; stamina combo

---

### [Case 1589 — [GIMMICK] Krusher Doomscizor 2Vortex Hunter — Hunter Rubber Tip Floor-Grinding Tribology & Doomscizor Unbalanced Layer Wobble [EXTENDS Cases 1155 & 1358]](./13%20case%20study.md#case-1589)

**System**: Gen3-Burst / Turbo · Attack
**Geometry**: r_Hunter_flat = 0.7 cm · μ_rubber = 0.80 · m_total = 43.5 g · ω₀ = 720 rad/s · Δr_eccentric = 1.5 mm
**Material**: Hunter rubber tip (semi-sharp, floor-grinding mode) + Doomscizor Ring (asymmetric, CM offset Δr=1.5mm)
**Spin Coupling**: F_drive = 0.342 N [CALCULATED]; a_linear = 7.86 m/s² [CALCULATED]; Δv over 0.5s = 3.93 m/s [CALCULATED]
**Contact Points**: p_impact = 0.152 N·s at v=3.5 m/s [CALCULATED]; Δv_Aquario(27g) = 5.63 m/s [CALCULATED]. f_eccentric = 114.6 Hz [CALCULATED]; F_eccentric = 7.0 N at ω₀ [CALCULATED]
**Movement Freedom**: DISTINCT from Case 1358 (wall-climb); this case = floor-grinding (flat contact, horizontal mode). Wobble at mid-spin (ω=360 rad/s): f=57.3 Hz, AMPLITUDE increases (higher visual unpredictability)
**Base Stats**: Attack 90 · Defense 20 · Stamina 35 · Speed 85
**Mechanism**: F_drive=μ×F_N=0.80×0.427=0.342 N [CALC]; a_linear=0.342/0.0435=7.86 m/s² [CALC]; Δv=3.93 m/s over 0.5s [CALC]. f_eccentric=720/(2π)=114.6 Hz [CALC]; F_eccentric=7.0 N [CALC]. p_impact=0.152 N·s → Δv_Aquario=5.63 m/s [CALC]. EXTENDS Cases 1155 & 1358.
**2.5D Rendering**: Rubber-flat floor-grind spark trail (dark purple [M]); eccentric wobble path overlay; speed boost indicator
**Gimmick**: hunterGrind(μ, F_N, t_grind) → F_drive, a_linear, Δv; doomscizorWobble(ω, Δr) → f_eccentric, F_eccentric
**Engine Note**: F_drive 0.342 N; a_linear 7.86 m/s²; f_eccentric 114.6 Hz; p_impact 0.152 N·s [all CALC]

---

### [Case 1590 — [SPECIAL] Hunt Launch (Daigo Kurogami · Krusher Doomscizor 2Vortex Hunter)](./13%20case%20study.md#case-1590)

**System**: Gen3-Burst / Turbo · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: highSpin+grindLock+wobble: −40/×1.70[M]/200ms/approachSpeed 3930mm/s/hitBonus +0.55; highSpin+lock: −40/×1.70[M]/200ms/3930mm/s/+0.10; high no lock: −25/×1.40/100ms/2000mm/s; lowSpin: −15/×1.15/50ms/500mm/s
**Movement Freedom**: —
**Base Stats**: Attack 90 · Defense 20 · Stamina 35 · Speed 85
**Mechanism**: K hold (250ms) = Edge Grind Lock (sustains Hunter flat-rubber a=7.86 m/s²). After 0.5s grind: v=3.93 m/s, p=0.152 N·s → Δv_Aquario=5.63 m/s [CALC]. 114.6 Hz wobble: +0.55 hit-chance bonus (physically grounded — 115 direction-changes/s beyond human reaction). powerCost 90. forceState: 'must_maintain_grind'. **Anime physics override**: dark-purple BeySpirit trail from friction heat [M]; dmgMult>1.5 [M].
**2.5D Rendering**: Floor-grind approach trail; dark-purple energy trail; wobble path overlay; hit-bonus indicator
**Gimmick**: huntLaunch(grindLockHeld, highSpin, wobbleActive) → spinDelta, dmgMult, lockMs, approachSpeedMms, hitChanceBonus
**Special Move**: Hunt Launch · powerCost 90 · animeOverride true
**Compatible beys**: Krusher Doomscizor 2Vortex Hunter (Daigo Kurogami); rubber flat-grinding tip r≥0.6cm, μ≥0.70 + unbalanced EL Δr≥1mm
**Engine Note**: highSpin+lock+wobble: −40/×1.70[M]/3930mm/s/+0.55; f_eccentric 114.6 Hz [CALC]; powerCost 90

---

### [Case 1591 — [COMBO] Hunt Sweep (↑ → J)](./13%20case%20study.md#case-1591)

**System**: Gen3-Burst / Turbo · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: diagonal+QTE: −19/1.28×/120ms/ringOutBonus +0.12; base+QTE: −12/1.18×/120ms/+0.04; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 90 · Defense 20 · Stamina 35 · Speed 85
**Mechanism**: ↑ (upper-arc approach, partial grind build) → → (rightward directional cut, angle shift) → J (peak-momentum strike). diagonal (both ↑ and → registered before J): −19, 1.28×, 120ms, +0.12 ringOut. Base: −12, 1.18×, 120ms. Cost 25, attack/balanced. Ceiling: 1.28× ≤ 1.5 ✓.
**2.5D Rendering**: Diagonal approach arc; rightward cut; strike flash
**Gimmick**: comboDetect(seq=[moveUp,moveRight,attack], window=600ms); diagonalApproachFlag
**Engine Note**: diagonal: −19/1.28×/120ms/+0.12; base: −12/1.18×/120ms; cost 25; attack combo

---

### [Case 1592 — [GIMMICK] Omega Dragonis 85XF — XF ABS-Plastic Flat-Face Triboelectric Accumulation (Ryuto) [EXTENDS Cases 1546–1554]](./13%20case%20study.md#case-1592)

**System**: Gen3-Burst / Beyblade 4D · Attack
**Geometry**: r_XF = 1.88 cm · w_strip = 1.5 mm · A_c = 1.77×10⁻⁴ m² · m_total = 38.0 g · v_contact = 6.30 m/s
**Material**: Omega Dragonis 85XF; ABS-on-PC tribopair (σ_t=1.0×10⁻⁹ C/m²)
**Spin Coupling**: Physical: V_acc≈0.014 V (sub-volt, leaks in damp air). BeySpirit amplification ≈1.1×10⁵ → arc-discharge threshold 1.5 kV [M]
**Contact Points**: p_strike = m×v = 0.038×2.0 = 0.076 N·s [CALCULATED]; Δv_Pegasus (33g) = 2.3 m/s [CALCULATED]; crosses 400mm stadium in ~0.17s
**Movement Freedom**: chargeRunMs accumulates on continuous XF floor contact; reset on aerial manoeuvre or collision
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: dQ/dt=1.12e-12 C/s [CALC]; V_physical≈0.014V [CALC]. BeySpirit amplification ×1.1e5 [M] → sustained arc discharge at 1.5kV arc threshold. p_strike=0.076 N·s [CALC]; Δv_Pegasus=2.3 m/s [CALC]. Stone-pillar fracture entirely [M] (0.076J vs ~5J/m²×area required). EXTENDS Cases 1546–1554.
**2.5D Rendering**: XF flat-face charge run; turquoise lightning trail (BeySpirit [M]); charge accumulation bar
**Gimmick**: xfTriboCharge(v_contact, A_c, σ_t, t_run) → V_acc, p_strike
**Engine Note**: p_strike 0.076 N·s [CALC]; Δv_Pegasus 2.3 m/s [CALC]; V_physical 0.014V [CALC]; BeySpirit arc [M]

---

### [Case 1593 — [SPECIAL] Hammer Bolt (Ryuto · Omega Dragonis 85XF)](./13%20case%20study.md#case-1593)

**System**: Gen3-Burst / Beyblade 4D · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: chargeRunMs 800+QTE+wall: −80/×1.80[M]/0ms/ringOut 0.80; full+QTE open: −80/×1.80[M]/0ms/0.25; min+QTE: −55/×1.45/0ms/0.10; miss: −18/×1.10/0ms/0
**Movement Freedom**: —
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: chargeRunMs accumulates (max effective 800ms); QTE: timed J on XF floor contact. spinDelta=−(55+round(chargeNorm×25)); dmgMult=1.45+chargeNorm×0.35 (1.45×→1.80×[M]). powerCost 105 (sustained BeySpirit during run). No lockMs (directional strike). **Anime physics override**: Dragonis constellation BeySpirit maintains charge rate ×1.1e5; stone-shattering output [M].
**2.5D Rendering**: Charge-run accumulation trail; turquoise lightning sheath; directional strike burst
**Gimmick**: hammerBolt(chargeRunMs, qteHit, oppAtWall) → spinDelta, dmgMult, lockMs, powerCost, ringOutBonus
**Special Move**: Hammer Bolt · powerCost 105 · animeOverride true
**Compatible beys**: Any XF-tip bey with sufficient approach time; full output requires Omega Dragonis constellation BeySpirit
**Engine Note**: full charge+QTE+wall: −80/×1.80[M]/ringOut 0.80; powerCost 105 (above standard cap)

---

### [Case 1594 — [COMBO] Thunder Lash (← → J)](./13%20case%20study.md#case-1594)

**System**: Gen3-Burst / Beyblade 4D · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: dirChange+QTE: −22/1.30×/90ms/ringOutBonus +0.08; base+QTE: −13/1.17×/90ms/+0.03; miss: −7/1.04×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 85 · Defense 20 · Stamina 30 · Speed 80
**Mechanism**: ← (leftward arc pre-load) → → (direction-reversal rightward cut) → J (apex strike). dirChange registered: −22, 1.30×, 90ms, +0.08 ringOut. Base: −13, 1.17×, 90ms. Cost 15, attack/balanced. Ceiling: 1.30× ≤ 1.5 ✓.
**2.5D Rendering**: Left-right direction-change flash; contact burst on J
**Gimmick**: comboDetect(seq=[moveLeft,moveRight,attack], window=600ms); directionChangeFlagAB
**Engine Note**: dirChange: −22/1.30×/90ms/+0.08; base: −13/1.17×/90ms; cost 15; attack combo

---

### [Case 1595 — [GIMMICK] Clay Aries ED145B — ED145 Free-Spin Ring Two-Phase Uppercut Throw (Hyoma) [EXTENDS Cases 1555–1559]](./13%20case%20study.md#case-1595)

**System**: Gen2-MFB / HWS · Attack/Defense
**Geometry**: m_Aries = 39.4 g · v_approach = 1.5 m/s · p_approach = 0.059 N·s · h_contact = 4 mm below opponent equator
**Material**: Clay Aries AR (ram-horn protrusions, downward-angled leading edge) + ED145 (r_ED=19mm, free-spin Energy Drain ring) + B tip (hemispherical, r=3mm, μ=0.05)
**Spin Coupling**: Phase 1: F_c=11.8 N [CALC]; τ_tilt=0.047 N·m [CALC]; δθ≈30° [M] (physical 2–3°). Phase 3: v_ring=5.97 m/s; I_ring=7.2×10⁻⁷ kg·m²; spin drain via Energy Drain bearing
**Contact Points**: Phase 2 uppercut: vertical impulse millinewton range physically; aerial throw entirely [M]. EXTENDS Cases 1555–1559.
**Movement Freedom**: B-tip μ=0.05: 1.5 m/s approach speed; below-equator contact height 4–8mm
**Base Stats**: Attack 65 · Defense 45 · Stamina 60 · Speed 60
**Mechanism**: Phase 1: p=0.059 N·s, F_c=11.8 N [CALC], τ_tilt=0.047 N·m [CALC], δθ_phys=2–3°, BS=30° [M]. Phase 2: BeySpirit gyroscopic recovery → upward throw [M]. Phase 3: ED145 ring Energy Drain (v_ring=5.97 m/s) → secondary lateral strike + spin drain. EXTENDS Cases 1555–1559.
**2.5D Rendering**: Low-approach arc (Phase 1); uppercut rise (Phase 2 [M]); ED145 ring follow-up contact (Phase 3)
**Gimmick**: hornThrowPhases(h_contact, v_approach, ω_Aries) → F_c, τ_tilt, v_ring
**Engine Note**: F_c 11.8 N [CALC]; τ_tilt 0.047 N·m [CALC]; Phase 2 aerial [M]; v_ring 5.97 m/s; ED drain [CALC]

---

### [Case 1596 — [SPECIAL] Horn Throw Destruction (Hyoma · Clay Aries ED145B)](./13%20case%20study.md#case-1596)

**System**: Gen2-MFB / HWS · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: phase3+airborne+QTE: −65/×1.85[M]/120ms/ringOut 0.30; phase3+QTE: −65/×1.70/120ms/0.30; phase2+QTE: −45/×1.45/120ms/0.08; phase1+QTE: −25/×1.20/0ms/0.08; miss: −14/×1.08/0ms/0
**Movement Freedom**: —
**Base Stats**: Attack 65 · Defense 45 · Stamina 60 · Speed 60
**Mechanism**: Three-phase flowing sequence: Phase 1 (low strike tilt induction) → Phase 2 (uppercut throw [M]) → Phase 3 (ED145 ring finish). phaseReached engine evaluates sequential hit. phase3+airborne+QTE: −65/×1.85[M]/120ms/ringOut 0.30. powerCost 100. ED145 Energy Drain Phase 3 drain (~8 spin) folded into spinDelta. **Anime physics override**: Phase 2 aerial throw via BeySpirit gyroscopic recovery [M].
**2.5D Rendering**: Three-phase flowing arc; uppercut launch; ED145 ring finish
**Gimmick**: hornThrowDestruction(phaseReached, qteHit, opponentAirborne) → spinDelta, dmgMult, lockMs, ringOutBonus
**Special Move**: Horn Throw Destruction · powerCost 100 · animeOverride true
**Compatible beys**: Downward-angled leading edge AR + low-friction hemispherical tip + ED145 or equivalent free-spin ring; full three-phase requires Hyoma's Clay Aries BeySpirit
**Engine Note**: phase3+airborne+QTE: −65/×1.85[M]/120ms; powerCost 100

---

### [Case 1597 — [COMBO] Rising Horn (↓ ↑ J)](./13%20case%20study.md#case-1597)

**System**: Gen2-MFB / HWS · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: lowApproach+QTE: −24/1.33×/100ms/ringOutBonus +0.07; base+QTE: −15/1.19×/60ms/+0.02; miss: −7/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 65 · Defense 45 · Stamina 60 · Speed 60
**Mechanism**: ↓ (low-approach dip, below-equator angle) → ↑ (rising cut reversal) → J (throw apex). lowApproachRegistered: −24, 1.33×, 100ms, +0.07 ringOut. Base: −15, 1.19×, 60ms. Cost 15, attack/balanced. Ceiling: 1.33× ≤ 1.5 ✓.
**2.5D Rendering**: Low-dip arc; rising cut; throw apex flash
**Gimmick**: comboDetect(seq=[moveDown,moveUp,attack], window=600ms); lowApproachFlag
**Engine Note**: lowApproach: −24/1.33×/100ms/+0.07; base: −15/1.19×/60ms; cost 15; attack combo

---

### [Case 1598 — [GIMMICK] Hyper Horusood Upper-Claw — Claw Driver Forced-Vortex Air Circulation (Hoji Konda) [EXTENDS Cases 1560–1563]](./13%20case%20study.md#case-1598)

**System**: Gen3-Burst / Beyblade Burst · Defense/Stamina
**Geometry**: r_prong = 0.8 cm · h_prong = 4 mm · ω_H = 293 rad/s (2800 RPM) · 3 rotary prongs
**Material**: Claw Performance Tip (three rotary prongs); Hyper Horusood assembly
**Spin Coupling**: v_core = 2.34 m/s [CALCULATED]; Γ = 0.1177 m²/s [CALCULATED]; ΔP_core = 3.28 Pa [CALCULATED]. BeySpirit: Γ_[M] = 1.47 m²/s (×12.5); v_θ≈8.3 m/s at r=25mm → ejection threshold
**Contact Points**: Physical ejection threshold: F_friction=0.103 N → requires v_air≥8.28 m/s; physical v_core=2.34 m/s 3.5× below threshold → BeySpirit amplification required [M]
**Movement Freedom**: Claw must maintain floor contact (not airborne); forceState: 'must_maintain_grind'
**Base Stats**: Attack 30 · Defense 70 · Stamina 70 · Speed 40
**Mechanism**: r_prong=8mm, ω_H=293 rad/s: v_core=2.34 m/s [CALC], Γ=0.1177 m²/s [CALC], ΔP_core=3.28 Pa [CALC]. Physical v 3.5× below ejection threshold. BeySpirit Γ_[M]=1.47 m²/s (×12.5) → v_θ=8.3 m/s at r=25mm [M] → ring-out ejection [M]. EXTENDS Cases 1560–1563.
**2.5D Rendering**: Claw prong rotation; vortex-column field expanding; ring-out zone indicator at r=25mm
**Gimmick**: clawVortex(ω_H, r_prong, h_prong) → v_core, Γ, ΔP; beySpirit(Γ) → v_θ_ejection
**Engine Note**: v_core 2.34 m/s [CALC]; Γ 0.1177 m²/s [CALC]; BeySpirit Γ×12.5 [M]; ejection v_θ 8.3 m/s [M]

---

### [Case 1599 — [SPECIAL] Horusood Field (Hoji Konda · Hyper Horusood Upper-Claw)](./13%20case%20study.md#case-1599)

**System**: Gen3-Burst / Beyblade Burst · Special Move
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: clawEngaged+build1000+close+QTE: −50/×1.60[M]/0ms/ringOut 0.80; build500+QTE: −35/×1.35[M]/0ms/0.47; build0+QTE: −20/×1.10/0ms/0; miss: −(8+5)/×1.05/0ms/0
**Movement Freedom**: —
**Base Stats**: Attack 30 · Defense 70 · Stamina 70 · Speed 40
**Mechanism**: clawEngaged gates move; vortexBuildMs accumulates (max 1000ms); oppDistancePx falls off at 200px. spinDelta=−(20+round(buildNorm×30)); dmgMult=1.10+buildNorm×0.50 (1.10→1.60×[M]). powerCost 100. No lockMs (field is radial push). **Anime physics override**: Rankine vortex (Γ=0.1177 m²/s) BeySpirit-amplified ×12.5 → v_θ=8.3 m/s ring-out [M].
**2.5D Rendering**: Claw-engaged indicator; vortex build timer; proximity-based ring-out zone; radial ejection
**Gimmick**: horusoodField(clawEngaged, vortexBuildMs, oppDistancePx, qteHit) → spinDelta, dmgMult, lockMs, ringOutBonus
**Special Move**: Horusood Field · powerCost 100 · animeOverride true
**Compatible beys**: Hyper Horusood Upper-Claw (Hoji Konda); Claw driver (elevated rotating prong tip); full ring-out requires raptor BeySpirit
**Engine Note**: full build+close+QTE: −50/×1.60[M]/ringOut 0.80; buildNorm ramps 1.10→1.60×; powerCost 100

---

### [Case 1600 — [COMBO] Claw Whirl (← ↓ K)](./13%20case%20study.md#case-1600)

**System**: Gen3-Burst / Beyblade Burst · Combo
**Geometry**: —
**Material**: —
**Spin Coupling**: —
**Contact Points**: orbital+QTE: −28/1.38×/140ms/ringOutBonus +0.18; base+QTE: −16/1.22×/80ms/+0.06; miss: −9/1.05×/0ms
**Movement Freedom**: —
**Base Stats**: Attack 30 · Defense 70 · Stamina 70 · Speed 40
**Mechanism**: ← (counterclockwise orbital arc, Claw prong engagement begins, ~80ms pre-load) → ↓ (inward funnel cut, concentrates circulation) → K (burst at funnel apex). orbital arc completed: −28, 1.38×, 140ms, +0.18 ringOut. Base: −16, 1.22×, 80ms. Cost 25, stamina/defense. Ceiling: 1.38× ≤ 1.5 ✓.
**2.5D Rendering**: Counterclockwise orbital arc; inward funnel cut; burst flash on K
**Gimmick**: comboDetect(seq=[moveLeft,moveDown,defense], window=600ms); orbitalArcFlag
**Engine Note**: orbital: −28/1.38×/140ms/+0.18; base: −16/1.22×/80ms; cost 25; stamina combo


---

## Gap Fill Batch — Cases 1289–1339


> Source: `./9%20case%20study.md` (all cases in this range are in CS9)
> Skip: Case 1316 (already indexed elsewhere)

---

### [Case 1289 — Energy Layer: Archer Hercules (19.73 g, Burst Cho-Z Layer System, Stamina Type)](./9%20case%20study.md#case-1289)

**System**: Gen3-Burst / Burst-CZ Cho-Z Layer System  
**Geometry**: 19.73 g · r_o ≈ 3.8 cm (bows retracted) / 4.1–4.2 cm (deployed) · r_i ≈ 0.8 cm · 2-fold symmetry (bows at 180°)  
**Material**: ABS + metal-lined bows (est. ~3 g metal total at r ≈ 3.8 cm)  
**Spin Coupling**: rigid (layer body); centrifugal-deployed bows  
**Contact Points**: bow tips at r ≈ 3.8–4.2 cm · z-layer level · curved/smooth arc · ABS+metal · low recoil  
**Movement Freedom**: deployable (centrifugal bow extension; ΔI +2.7% at assembly level)  
**Base Stats**: Attack — low recoil; Defense — high burst resistance (medium + medium-tall teeth); Stamina — primary; Speed — moderate  
**Mechanism**: Centrifugal bow extension gimmick — bows deploy at ω ≈ 300 rad/s, retract at ≈ 200 rad/s. I increases from 1.488 × 10⁻⁵ to 1.584 × 10⁻⁵ kg·m² (layer level). Retraction conserves angular momentum → +3.1% spin boost at transition. Unbalanced mass distribution (e ≈ 0.5–1.5 mm) adds wobble penalty; mitigated by Level Chip.  
**2.5D Rendering**: mid-height Cho-Z layer stack; two symmetrical bow protrusions at 180° sweep outward; metal shine on bow inner surface  
**Gimmick**: centrifugal-deploy → `MechanicRegistry: centrifugal_deploy_bow` (threshold ω parameter)  
**Engine Note**: I_deployed = 1.584 × 10⁻⁵ kg·m²; deploy threshold 300 rad/s; retract 200 rad/s; unbalance penalty +8% decay, +10% burst risk; Level Chip negates unbalance

---

### [Case 1290 — Performance Tip: Eternal (5.93 g, Burst Cho-Z, Stamina Type — POM Free-Spinning Dish)](./9%20case%20study.md#case-1290)

**System**: Gen3-Burst / Burst-CZ (cross-gen compatible: Cho-Z, GT, Sparking)  
**Geometry**: 5.93 g · r_sharp ≈ 0.08 cm · r_dish ≈ 1.0–1.1 cm · slightly shorter height than pre-Cho-Z standard  
**Material**: ABS housing + POM (PolyOxyMethylene/Delrin) free-spinning ring; μ_POM ≈ 0.03–0.05  
**Spin Coupling**: free (POM dish rotates independently); fixed (sharp center tip)  
**Contact Points**: sharp tip r ≈ 0.08 cm (high spin) · POM dish rim r ≈ 1.0 cm (LAD/tilt phase) · μ_sharp ≈ 0.05 · μ_dish ≈ 0.04  
**Movement Freedom**: free-spin (dish)  
**Base Stats**: Attack — n/a; Defense — +15% burst resistance from free-spin dish; Stamina — best-in-class LAD; Speed — center-stable (does not wander)  
**Mechanism**: Sharp tip for high-spin ground contact; free-spinning POM dish contacts floor during tilt/precession phase. POM's self-lubricating low friction + large dish radius = maximum precession time. Free-spin dish absorbs lateral impulse → reduces burst torque transfer. +10% opposite-spin resistance. −15% KO resistance vs. Revolve (POM slides easily laterally).  
**2.5D Rendering**: z-low driver; narrow spike visible below wide free-spinning ring; POM ring has distinct translucent material appearance  
**Gimmick**: free-spin LAD tip → `MechanicRegistry: free_spin_tip` with dual-contact model (sharp high-spin / dish low-spin)  
**Engine Note**: μ_sharp 0.05, r 0.8 mm; μ_dish 0.04, r 10 mm; precession modifier +25% vs. Revolve; KO resist −15%; burst resist +15%; I = 3.61 × 10⁻⁷ kg·m²

---

### [Case 1291 — Archer Hercules 13 Eternal: Full Assembly (Burst Cho-Z, Stamina Type)](./9%20case%20study.md#case-1291)

**System**: Gen3-Burst / Burst-CZ  
**Geometry**: ~44.7–45.7 g total · I_total (bows deployed) ≈ 3.29 × 10⁻⁵ kg·m²  
**Material**: ABS + metal bow layer + metal Forge Disc 13  
**Spin Coupling**: rigid assembly  
**Contact Points**: Archer Hercules bow tips (low recoil, smooth curved); Eternal sharp tip / POM dish  
**Movement Freedom**: centrifugal bow deploy on layer; free-spin dish on tip  
**Base Stats**: Attack — low; Defense — high burst resistance; Stamina — ★★★★★ (0.54 rad/s² decay high-spin); Speed — stable center  
**Mechanism**: L₀ = 2.303 × 10⁻² N·m·s; L_battle = 1.382 × 10⁻² N·m·s. High-spin decay 0.54 rad/s²; LAD decay 5.61 rad/s²; LAD survival ~35.7 s (exceptional). Precession rate 0.194 rad/s (very slow → very stable). Bow gimmick +3% L at battle ω; +3.1% spin boost at retraction. Opposite-spin resistance +10%. Best for pure Stamina vs. Stamina or Defense.  
**2.5D Rendering**: Cho-Z layer stack + thick Disc 13 annular ring + Eternal wide dish at base  
**Gimmick**: combined centrifugal bow + free-spin dish  
**Engine Note**: I_deployed 3.29 × 10⁻⁵; LAD 35.7 s; precession 0.194 rad/s; burst resist high (very high with Level Chip); opposite-spin +10%

---

### [Case 1292 — Energy Layer: Alter Chronos (10.6 g, Burst God Layer System, Balance Type)](./9%20case%20study.md#case-1292)

**System**: Gen3-Burst / Burst-God God Layer System; Hasbro: Cognite  
**Geometry**: 10.6 g · r_o ≈ 3.7 cm · r_i ≈ 0.8 cm · 5-blade near-continuous perimeter  
**Material**: ABS (no metal inserts); clear/colored God Layer ABS  
**Spin Coupling**: rigid; internal weight shifts position for mode change  
**Contact Points**: 5 large blades (compact, low-recoil) · one blade protrudes further (Attack Mode asymmetry)  
**Movement Freedom**: mode-switch (Stamina Mode = symmetric CoM; Attack Mode = CoM offset e ≈ 1.5 mm)  
**Base Stats**: Attack — limited burst attack (compact blades); Defense — ★★★★★ burst resistance (excellent teeth + low recoil); Stamina — good (Stamina mode); Speed — wandering path in Attack Mode  
**Mechanism**: Stamina Mode: symmetric mass → stable spin, low recoil → top-tier defense. Attack Mode: internal weight shifted → eccentric CoM → wandering orbital path, +15% tilt induction per contact, +12% decay rate. Best competitive use: Stamina Mode for Defense combos. Blue dot = Stamina; Red dot = Attack.  
**2.5D Rendering**: compact 5-blade near-circular silhouette; small gaps between blades; indicator dot visible on top face  
**Gimmick**: mode-switch weight → `MechanicRegistry: layer_mode_switch` (stamina | attack)  
**Engine Note**: I = 7.59 × 10⁻⁶ kg·m²; mode stamina: std decay; mode attack: +12% decay, ±15° drift/rev, +15% tilt/contact; burst resist: very high both modes

---

### [Case 1293 — Forge Disc: 6 (21.2 g, Burst God / Burst Standard)](./9%20case%20study.md#case-1293)

**System**: Gen3-Burst (universal cross-gen)  
**Geometry**: 21.2 g · r_o_long ≈ 4.2 cm · r_o_short ≈ 3.8 cm · r_i ≈ 1.0 cm · 3 loop-shaped protrusions per side · 4 large central holes  
**Material**: Metal (zinc alloy)  
**Spin Coupling**: rigid  
**Contact Points**: protrusions below layer level; not attack-relevant  
**Movement Freedom**: fixed  
**Base Stats**: balanced/limited (lightest major Core Disc at 21.2 g vs. peers ~22–23 g)  
**Mechanism**: Even-numbered Core Disc → elliptical shape, Frame-compatible. Central holes reduce center mass but minimal I penalty (center mass contributes little to I). I ≈ 1.782 × 10⁻⁵ kg·m² (similar to Disc 2 at 1.765 × 10⁻⁵). Mid-tier, not specialized.  
**2.5D Rendering**: elliptical annular disc; loop protrusions visible on both faces; large center hub holes  
**Gimmick**: Frame-compatible slot  
**Engine Note**: I = 1.782 × 10⁻⁵ kg·m²; frameCompatible: true; attack modifier 0.92× vs. Disc 7; mid-tier

---

### [Case 1294 — Disc Frame: Meteor (2.7 g, Burst God / Burst Standard)](./9%20case%20study.md#case-1294)

**System**: Gen3-Burst (universal Frame for even-numbered Core Discs)  
**Geometry**: 2.7 g · r_o ≈ 4.3 cm · r_i ≈ 3.6 cm · pentagonal base with numerous small protrusions · one of thickest Frames  
**Material**: ABS (translucent dark navy)  
**Spin Coupling**: rigid (seats on Core Disc perimeter)  
**Contact Points**: rough pentagonal perimeter (at disc-disc level, not disc-layer); protrusions too small to reach opponent Layer  
**Movement Freedom**: fixed  
**Base Stats**: Attack — +8% at disc-disc contact with heavy Core Discs (like 7); Stamina — ★★★ LAD (pentagonal edges create slight floor-contact variation); Defense — thick body adds collision volume  
**Mechanism**: Thick pentagonal body + small protrusions creates rough contact surface at disc level. Attack potential from flat-face-to-protrusion angle transitions (5 per revolution). Does not directly contact opponent's blades → no layer-level recoil. Beneficial for Defense builds — adds mass without layer recoil.  
**2.5D Rendering**: thick pentagonal outer ring below layer stack; small protrusions on all 5 faces  
**Gimmick**: none  
**Engine Note**: I = 4.25 × 10⁻⁶ kg·m²; attack modifier +8% (with heavy disc) / +4% (light disc); LAD ★★★; Frames even-numbered discs only

---

### [Case 1295 — Performance Tip: Trans (6.5 g, Burst God / Burst Standard, Balance Type — Dual Mode)](./9%20case%20study.md#case-1295)

**System**: Gen3-Burst / Burst-God (cross-gen compatible)  
**Geometry**: 6.5 g · standard height · Stamina: r_tip ≈ 0.15–0.20 cm cone · Attack: r_tip ≈ 0.55 cm flat ring with central hole + 4 tabs  
**Material**: ABS plastic  
**Spin Coupling**: fixed (no free-spin in either mode)  
**Contact Points**: Stamina — low-angle cone tip; Attack — flat ring with 4 floor tabs  
**Movement Freedom**: mode-switch (twist bottom; Stamina cone | Attack flat)  
**Base Stats**: Attack mode — aggressive but uncontrolled movement; Stamina mode — center-stable but 4.5× worse than Eternal; Speed — Attack: wandering; Stamina: fixed-point  
**Mechanism**: Stamina setting: μ ≈ 0.09, r ≈ 1.5 mm; no free-spin → 4.5× higher decay than Eternal. Susceptible to off-balance knock (small tip + bulky body). Scraping risk at tilt >20°. Attack setting: μ ≈ 0.25, r ≈ 5.5 mm, wandering ±15°/rev. 4 tabs grind Tornado Ridge (cannot Tornado Stall; −20% stamina near ridge). Mobile Stamina combo use case.  
**2.5D Rendering**: bulky driver body; "T" embossed on top; two visually distinct tip surfaces depending on mode  
**Gimmick**: twist mode-switch → `MechanicRegistry: driver_mode_switch` (stamina-cone | attack-flat)  
**Engine Note**: Stamina: μ 0.09, r 1.5 mm; Attack: μ 0.25, r 5.5 mm, ±15° drift; Tornado Ridge: grinding (−20%); I = 3.54 × 10⁻⁷ kg·m²

---

### [Case 1296 — Alter Chronos 6Meteor Trans: Full Assembly (Burst God, Balance / Defense Type)](./9%20case%20study.md#case-1296)

**System**: Gen3-Burst / Burst-God; Hasbro layer: Cognite  
**Geometry**: 41.0 g total · I_total ≈ 3.064 × 10⁻⁵ kg·m²  
**Material**: ABS Layer + Metal Disc 6 + ABS Frame + ABS Driver  
**Spin Coupling**: rigid; layer mode-switch internal weight  
**Contact Points**: Alter Chronos 5 compact blades (Stamina Mode: symmetric; Attack Mode: eccentric approach); Meteor frame rough pentagonal perimeter at disc level  
**Movement Freedom**: layer mode-switch (Stamina | Attack) + driver mode-switch (stamina-cone | attack-flat)  
**Base Stats**: primary Defense (Stamina/Trans-Stamina); secondary Mobile Stamina (Attack/Trans-Attack)  
**Mechanism**: L₀ = 2.145 × 10⁻² N·m·s; L_battle = 1.287 × 10⁻² N·m·s. Stamina+Stamina: decay 1.78 rad/s² → best Defense config; burst resist very high (top-tier teeth + compact blades). Attack+Attack: decay 18.1 rad/s² → Mobile Stamina destabilizer mode (+15% tilt/contact). 4-mode combination matrix.  
**2.5D Rendering**: compact 5-blade layer + elliptical Disc 6 + rough pentagonal Meteor frame rim  
**Gimmick**: dual mode-switch (2×2 matrix: layerMode × tipMode)  
**Engine Note**: I 3.064 × 10⁻⁵; decay Stamina/Stamina 1.78 rad/s²; decay Attack/Attack 18.1 rad/s²; burst resist very high; KO resist moderate; destabilize (Attack mode) +15%/contact

---

### [Case 1297 — Bit Chip: Unicolyon (1.0 g, Plastic Gen Spin Gear System)](./9%20case%20study.md#case-1297)

**System**: Gen1-Plastic / Spin Gear System  
**Geometry**: 1.0 g · diameter ~2.0 cm · r ≈ 0 (center piece) · thickness ~3 mm  
**Material**: ABS plastic  
**Spin Coupling**: rigid (structural)  
**Contact Points**: none (center locking cap)  
**Movement Freedom**: fixed  
**Base Stats**: none — purely structural  
**Mechanism**: Locking cap securing AR to WD stack; confers Unicolyon Bit Beast / special moves in anime (BeySpirit override). I = 6.40 × 10⁻⁸ kg·m² (0.43% of assembly — negligible). Excluded from official assembly mass nomenclature.  
**2.5D Rendering**: face sticker at top center; transparent ABS disc  
**Gimmick**: Bit Beast visual only; no physics contribution  
**Engine Note**: mass = 1 g excluded from assembly; I negligible; BeySpirit special move override eligible

---

### [Case 1298 — Attack Ring: Tail Defense (4.4 g, Plastic Gen Spin Gear System, Defense Type)](./9%20case%20study.md#case-1298)

**System**: Gen1-Plastic / Spin Gear System  
**Geometry**: 4.4 g · r_o ≈ 3.6 cm · r_i ≈ 1.8 cm · ~10 swept-back protrusions (near-circular profile)  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: ~10 swept-back protrusions · deflective geometry · tangential exit path  
**Movement Freedom**: fixed  
**Base Stats**: Defense — deflective protrusions redirect contact tangentially (J_eff × cos60° = 50% force reduction); Stamina — OWD contribution moderate  
**Mechanism**: Near-circular profile with swept-back tail protrusions. Similar to Burst Unicorn layer shape but lighter (53% of Unicorn's mass, 48.6% of I). At battle ω = 185 rad/s: v_tip = 6.66 m/s. Deflective protrusions halve effective burst force per contact. I = 3.564 × 10⁻⁶ kg·m² (23.7% of Unicolyon assembly).  
**2.5D Rendering**: near-circular AR ring with swept trailing protrusions; large OWD annular body  
**Gimmick**: deflective tail geometry → `MechanicRegistry: deflect_ar`  
**Engine Note**: I = 3.564 × 10⁻⁶ kg·m²; contact deflection 50% force reduction vs. catching AR; assembly fraction 23.7%

---

### [Case 1299 — Weight Disk: Eight Heavy (est. 14.5 g, Plastic Gen, Compact / Center-Weighted)](./9%20case%20study.md#case-1299)

**System**: Gen1-Plastic / Spin Gear System  
**Geometry**: ~14.5 g (est.) · octagonal (8-sided) · r_o ≈ 2.8 cm · r_i ≈ 0.8 cm · compact (IWD)  
**Material**: ABS plastic (thick-walled for mass without metal)  
**Spin Coupling**: rigid  
**Contact Points**: none (internal mass element)  
**Movement Freedom**: fixed  
**Base Stats**: RPM +31% at launch vs. Wide Heavy (same energy); L −23.7% vs. Wide Heavy; Stamina — lower than Wide series; Defense — mass benefits  
**Mechanism**: Compact IWD design: lower I → higher launch ω₀ for same launcher energy (ω₀ = √(2E/I)). RPM crossover vs. Wide Heavy at ~13 s — Eight Heavy faster for first 13 s then falls behind. Dominant I contributor in Unicolyon assembly (40.9% of I_total). I = 6.148 × 10⁻⁶ kg·m².  
**2.5D Rendering**: 8-sided compact disc; center-weighted mass profile visible  
**Gimmick**: none  
**Engine Note**: I = 6.148 × 10⁻⁶ kg·m²; RPM boost +31% vs. Wide Heavy for first ~13 s; L −23.7%; IWD (center-weighted)

---

### [Case 1300 — Spin Gear: Right SG (est. 4.5 g, Plastic Gen, Standard Right-Spin)](./9%20case%20study.md#case-1300)

**System**: Gen1-Plastic / Spin Gear System  
**Geometry**: ~4.5 g (est.) · r_o ≈ 1.5 cm · r_i ≈ 0.5 cm · ABS casing ~2.5 g + metal ring/gear ~2.0 g  
**Material**: ABS plastic housing + steel internal gear/ring  
**Spin Coupling**: direct torque transfer (no clutch)  
**Contact Points**: metal gear teeth mesh with launcher  
**Movement Freedom**: fixed (no clutch, no freewheel)  
**Base Stats**: none competitive; purely mechanical torque transmission  
**Mechanism**: Two right-side tabs engage Right-Spin Shooter, defining CW rotation. Metal gear provides reliable mesh under high-torque snap launch. Core not interchangeable (standard SG). I = 5.625 × 10⁻⁷ kg·m² (3.7% of assembly — minor).  
**2.5D Rendering**: internal cylindrical gear unit nested inside Blade Base  
**Gimmick**: none (standard SG; no bearing/weight/engine)  
**Engine Note**: spin direction right (+ω); gear efficiency 1.0; I = 5.625 × 10⁻⁷ kg·m²

---

### [Case 1301 — Blade Base: Unicolyon Base (est. 9.0 g, Plastic Gen, Defense Type)](./9%20case%20study.md#case-1301)

**System**: Gen1-Plastic / Spin Gear System  
**Geometry**: ~9.0 g (est.) · r_o ≈ 3.2 cm · r_i ≈ 1.0 cm · wide flat tip geometry  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: wide flat tip · r_eff ≈ 0.5 cm · μ ≈ 0.18  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — very poor (10× friction penalty vs. Sharp tip); Defense — low (wide flat causes rapid spin loss, ~1-2 hits to wobble at battle ω)  
**Mechanism**: Wide flat tip: τ_friction = 10× higher than Sharp tip. t_stall with stock base = 15.7 s (10% of Sharp-tip potential of 156 s). At battle ω = 185 rad/s: only ~1-2 direct contacts before wobble onset. "Useless" per community — destroys stamina potential of Eight Heavy. Upgrade: replace base with any Sharp or Grip-type. I = 5.058 × 10⁻⁶ kg·m² (33.7% of assembly).  
**2.5D Rendering**: wide flat base underside; Griffolyon-style architecture  
**Gimmick**: none  
**Engine Note**: I = 5.058 × 10⁻⁶ kg·m²; μ_tip 0.18, r_eff 5 mm; 10× friction vs. Sharp; t_stall 15.7 s; competitive rating: poor

---

### [Case 1302 — Unicolyon: Full Assembly (Plastic Gen Spin Gear System, Defense / Anime-Exclusive, Right-Spin)](./9%20case%20study.md#case-1302)

**System**: Gen1-Plastic / Spin Gear System; Owner: Oliver (Majestics); TCG card #162 Ver.3.0  
**Geometry**: 32.4 g (excl. Bit Chip official) / 33.4 g (incl.) · I_total = 1.540 × 10⁻⁵ kg·m²  
**Material**: ABS throughout  
**Spin Coupling**: rigid assembly  
**Contact Points**: Tail Defense AR swept-back protrusions (deflective); Unicolyon Base wide flat tip  
**Movement Freedom**: fixed  
**Base Stats**: Defense — Low-moderate (1–2 hits to wobble at battle ω); Stamina — very poor (t_stall 15.7 s with stock base); Attack — poor (L₀ = 4.620 × 10⁻³ N·m·s insufficient)  
**Mechanism**: ω₀ = 300 rad/s (snap launcher); L₀ = 4.620 × 10⁻³ N·m·s; dω/dt_stock = 19.14 rad/s²; t_stall = 15.7 s. Eight Heavy +31% RPM vs. Wide Heavy for first ~13 s. TCG stats: ATK 3000, DEF 4000. Unicolyon Base wide flat tip negates all performance: 90% of spin potential wasted. Single-part upgrade (replace base) → 6–7× stamina improvement.  
**2.5D Rendering**: Tail Defense circular AR + compact Eight Heavy WD + Unicolyon Base flat underside  
**Gimmick**: Bit Beast Unicolyon special move (BeySpirit anime override)  
**Engine Note**: I 1.540 × 10⁻⁵; ω₀ 300 rad/s; L₀ 4.620 × 10⁻³; dω/dt 19.14 rad/s²; t_stall 15.7 s; hits to wobble ~1–2; Eight Heavy RPM +31% for 13 s window

---

### [Case 1303 — Bit Chip: Amphilyon (1.0 g, Plastic Gen Spin Gear System)](./9%20case%20study.md#case-1303)

**System**: Gen1-Plastic / Spin Gear System; Owner: Enrique (Majestics)  
**Geometry**: 1.0 g · diameter ~2.0 cm · thickness ~3 mm · r ≈ 0 (center)  
**Material**: Transparent ABS plastic  
**Spin Coupling**: rigid (structural)  
**Contact Points**: none  
**Movement Freedom**: fixed  
**Base Stats**: none — structural only  
**Mechanism**: Locking cap; face sticker carrier. I ≈ 1.0 × 10⁻⁷ kg·m² (<0.1% of assembly). Excluded from assembly mass nomenclature. Amphilyon Bit Beast → BeySpirit override for special moves (anime physics domain).  
**2.5D Rendering**: transparent disc at top center with Amphilyon face sticker  
**Gimmick**: Bit Beast Amphilyon (BeySpirit special move override)  
**Engine Note**: mass 1 g excluded; I negligible; special move override: any bey with Amphilyon chip

---

### [Case 1304 — Attack Ring: Twin Head (est. 5.5 g, Plastic Gen Spin Gear System, Balance Type)](./9%20case%20study.md#case-1304)

**System**: Gen1-Plastic / Spin Gear System; Beyblade: Amphilyon (Enrique)  
**Geometry**: ~5.5 g (est.) · r_o ≈ 3.8 cm · r_i ≈ 1.4 cm · 2 primary horn protrusions at 180° + 2 secondary sub-AR protrusions  
**Material**: ABS plastic  
**Spin Coupling**: rigid  
**Contact Points**: 2 primary blade tips (~6 mm arc) + 2 secondary horn protrusions (~3 mm arc) · moderate smash angle ~20–25°  
**Movement Freedom**: fixed  
**Base Stats**: Attack — moderate smash (2 symmetric contact points); Defense — sub-AR horns reduce recoil; Stamina — moderate OWD  
**Mechanism**: Twin-blade symmetric design (0° and 180° contacts) = Balance type. Sub-AR horns (analogous to Warlion concept) reduce recoil from main blade impacts. Contact dwell ~5 ms per primary blade at peak spin. I = 4.51 × 10⁻⁶ kg·m².  
**2.5D Rendering**: twin horn protrusions at 180° on AR ring with two smaller secondary horns between them  
**Gimmick**: sub-AR recoil dampening → `MechanicRegistry: sub_ar_deflect`  
**Engine Note**: I = 4.51 × 10⁻⁶ kg·m²; 2 primary + 2 secondary contacts; recoil reduction −20% vs. aggressive ARs; balance type

---

### [Case 1305 — Weight Disk: Wide (13.0 g, Plastic Gen, OWD Stamina / Balance)](./9%20case%20study.md#case-1305)

**System**: Gen1-Plastic / Spin Gear System; Beyblade: Amphilyon  
**Geometry**: 13.0 g (confirmed exact) · hexagonal (6-sided) · r_o ≈ 4.0 cm · r_i ≈ 1.0 cm  
**Material**: ABS plastic (heavier-grade wide-body)  
**Spin Coupling**: rigid  
**Contact Points**: none (internal mass element); hexagonal edge contacts stadium floor during LAD  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — ★★★ best standard OWD WD; L +25% over Eight Heavy at same energy; RPM −26% vs. compact IWD  
**Mechanism**: OWD design — mass at maximum radius. I = 1.105 × 10⁻⁵ kg·m² (highest of plastic-gen standard WDs). Hexagonal perimeter creates slight "skip" rhythm during LAD. L advantage vs. Eight Heavy: +25% angular momentum. Launch RPM disadvantage: −26%. Crossover: Equal ω after ~13 s → Wide dominates from that point. Definitive stamina WD for SGS combos.  
**2.5D Rendering**: wide hexagonal disc; 6 flat faces visible; OWD mass concentration at outer hex edges  
**Gimmick**: none  
**Engine Note**: I = 1.105 × 10⁻⁵ kg·m²; OWD; L +25% vs. Eight Heavy; LAD ★★★; RPM −26%

---

### [Case 1306 — Spin Gear: Right SG (est. 4.5 g, Plastic Gen, Standard Right-Spin)](./9%20case%20study.md#case-1306)

**System**: Gen1-Plastic / Spin Gear System; Beyblade: Amphilyon  
**Geometry**: ~4.5 g (est.) · r_o ≈ 1.5 cm · r_i ≈ 0.5 cm · ABS casing + metal gear  
**Material**: ABS housing + steel internal gear  
**Spin Coupling**: direct torque transfer  
**Contact Points**: metal gear meshes with launcher  
**Movement Freedom**: fixed  
**Base Stats**: mechanical only (torque transmission, no competitive impact)  
**Mechanism**: Identical physics to Case 1300 Right SG (Unicolyon). No clutch mechanism. I ≈ 5.6 × 10⁻⁷ kg·m² (~5% of assembly I).  
**2.5D Rendering**: internal cylindrical gear unit  
**Gimmick**: none  
**Engine Note**: identical to Case 1300; I = 5.6 × 10⁻⁷ kg·m²; spin direction right; gear efficiency 1.0

---

### [Case 1307 — Blade Base: Amphilyon Base (est. 9.5 g, Plastic Gen, Balance Type with Free-Spin Tip)](./9%20case%20study.md#case-1307)

**System**: Gen1-Plastic / Spin Gear System; Beyblade: Amphilyon; Majestics series architecture  
**Geometry**: ~9.5 g (est.) · r_o ≈ 1.6 cm · r_i ≈ 0.5 cm · free-spinning tip r_tip ≈ 0.25 cm · 2-horn sub-AR protrusions on lower body  
**Material**: ABS plastic + bearing/pivot for free-spin tip  
**Spin Coupling**: free (tip) + rigid (base body)  
**Contact Points**: free-spinning tip · r_tip ≈ 0.25 cm · μ_eff ≈ 0.05 (bearing friction) · 2-horn protrusions on base reduce lateral recoil  
**Movement Freedom**: free-spin (tip barrel rotates independently)  
**Base Stats**: Stamina — +8% vs. flat base (lower friction); Defense — +15% KO resistance (free-spin decoupling); Balance — dual-capability design  
**Mechanism**: Free-spinning tip (like ES/Eternal Sharp MFB concept): bearing friction μ ≈ 0.05 vs. fixed flat μ ≈ 0.18. τ ≈ 4.11 × 10⁻⁵ N·m (similar to sharp tip but more stable). Free-spin decouples lateral push from spinning frame → reduced KO. 2-horn sub-AR (Orthros/Warlion concept): smaller horns reduce base-contact recoil. I = 1.33 × 10⁻⁶ kg·m².  
**2.5D Rendering**: compact base body with free-spinning tip barrel at bottom; two horn protrusions on lower base body  
**Gimmick**: free-spin tip + sub-AR horn recoil damping  
**Engine Note**: I = 1.33 × 10⁻⁶ kg·m²; μ_eff 0.05, r_tip 2.5 mm; KO resist +15%; sub-AR recoil −20%; stamina +8% vs. flat

---

### [Case 1308 — Amphilyon: Full Assembly (Plastic Gen, Balance Type, Anime-Exclusive, Right-Spin)](./9%20case%20study.md#case-1308)

**System**: Gen1-Plastic / Spin Gear System; Owner: Enrique (Majestics); TCG card #161  
**Geometry**: ~32.5 g (excl. Bit Chip) / ~33.5 g (incl.) · I_total ≈ 1.74 × 10⁻⁵ kg·m²  
**Material**: ABS throughout  
**Spin Coupling**: rigid body; free-spin tip  
**Contact Points**: Twin Head AR dual-blade symmetric; Amphilyon Base free-spin tip + 2-horn sub-AR  
**Movement Freedom**: free-spin tip  
**Base Stats**: Balance — Attack ★★★ / Defense ★★★ / Stamina ★★★ (TCG ATK 4000 / DEF 4000); Stamina t_stall ~127 s (theoretical, no contacts); KO resist +15%  
**Mechanism**: ω₀ = 300 rad/s; L₀ = 5.22 × 10⁻³ N·m·s; L_battle = 3.22 × 10⁻³ N·m·s. Spin decay 2.36 rad/s² (free-spin tip). Wide WD I = 1.105 × 10⁻⁵ kg·m² (63.5% of assembly I). Precession rate Ω_p ≈ 0.044 rad/s at 5° tilt (slow, stable = Balance). All-rounder: moderate attack from Twin Head + high momentum from Wide + KO resistance from free-spin base. Majestics all-rounder vs. Unicolyon (defense), Griffolyon (defense/stamina), Galeon (attack).  
**2.5D Rendering**: Twin Head AR + hexagonal Wide WD + Amphilyon Base free-spin tip  
**Gimmick**: Bit Beast Amphilyon special move + free-spin base; BeySpirit override for special moves  
**Engine Note**: I 1.74 × 10⁻⁵; ω₀ 300 rad/s; L₀ 5.22 × 10⁻³; decay 2.36 rad/s²; KO +15%; generation Gen1-Plastic

---

### [Case 1309 — Energy Layer: Bigbang Genesis (26.6 g / 30.8 g with Armor, Burst GT Gatinko)](./9%20case%20study.md#case-1309)

**System**: Gen3-Burst / Burst-GT Gatinko Layer System; Stylized: Bigbang γenesis  
**Geometry**: 26.6 g (no Armor) / 30.8 g (with Armor) · r_o ≈ 4.0 cm · r_i ≈ 1.0 cm  
**Material**: ABS + integrated metal (internal ring/inserts); monolithic non-separable cast  
**Spin Coupling**: rigid (monolithic — Chip/Base/Weight are one piece)  
**Contact Points**: Defense-type sloped/rounded contacts; Bigbang Armor adds perimeter mass at r ≈ 3.0–4.1 cm  
**Movement Freedom**: fixed; Bigbang Armor detachable toggle  
**Base Stats**: Defense — high burst resistance (Defense type + monolithic rigidity eliminates mechanical looseness); Stamina — moderate  
**Mechanism**: Third non-customizable Gatinko Layer (after Prime Apocalypse + Regalia Genesis). Bigbang Armor: 4.2 g add-on clips to outer rim; I(no armor) = 2.261 × 10⁻⁵ kg·m²; I(with armor) = 2.618 × 10⁻⁵ kg·m² (+3.57 × 10⁻⁶). Armor: −4.7% launch RPM, +10.4% angular momentum. Fan nickname "Eclipse Genesis" (Regalia = sun, Prime Apocalypse = moon).  
**2.5D Rendering**: monolithic single-piece layer; Bigbang Armor clips around outer perimeter rim as separate visual ring  
**Gimmick**: Bigbang Armor toggle (`bigbangArmorAttached: boolean`)  
**Engine Note**: I no-armor 2.261 × 10⁻⁵; I with-armor 2.618 × 10⁻⁵; armor mass +4.2 g; burst resist high; monolithic; compatible Armor: bigbang_genesis, regalia_genesis, prime_apocalypse

---

### [Case 1310 — Bigbang Armor (4.2 g, Burst GT Gatinko Add-On)](./9%20case%20study.md#case-1310)

**System**: Gen3-Burst / Burst-GT Gatinko; compatible: Bigbang Genesis, Regalia Genesis, Prime Apocalypse  
**Geometry**: 4.2 g · mounts at outer rim r ≈ 3.0–4.1 cm (effective r_eff ≈ 3.0 cm for I calculation)  
**Material**: ABS (+ possible metal accent)  
**Spin Coupling**: rigid (clips onto layer)  
**Contact Points**: outer perimeter addition  
**Movement Freedom**: detachable toggle  
**Base Stats**: +I_add ≈ 3.78 × 10⁻⁶ kg·m²; +4.2 g mass; −launch RPM; +angular momentum  
**Mechanism**: Mass add-on at layer perimeter. I_add ≈ 3.78 × 10⁻⁶ kg·m² (mass-difference verified). At fixed launch energy: −4.7% ω₀ but +10.4% L. Used in Defense/Stamina combos where sustained spin matters more than launch RPM.  
**2.5D Rendering**: outer ring clipping around compatible monolithic layer perimeter  
**Gimmick**: removable mass add-on  
**Engine Note**: I_add 3.78 × 10⁻⁶; mass +4.2 g; toggle: armor on/off

---

### [Case 1311 — Performance Tip: Hybrid (Disc-Integrated Driver, Burst GT Gatinko)](./9%20case%20study.md#case-1311)

**System**: Gen3-Burst / Burst-GT Gatinko; disc-integrated (combines Forge Disc + Performance Tip)  
**Geometry**: ~20–22 g est. · disc r_o ≈ 3.8 cm · r_i ≈ 0.8 cm · tip r_contact ≈ 0.5–0.8 cm (wide defense base)  
**Material**: ABS + metal disc insert (OWD design)  
**Spin Coupling**: rigid (disc) + partially free (tip behavior varies with spin rate)  
**Contact Points**: wide-base tip contact; variable μ by spin state  
**Movement Freedom**: spin-rate dependent behavior (defense center-hold → stamina LAD transition)  
**Base Stats**: Defense — center-stable at high spin; Stamina — gradual LAD mode at low spin; no separate disc slot  
**Mechanism**: Disc-integrated architecture: disc + driver are one unit (2-part combo total with monolithic layer). At high spin (ω > 60% ω₀): μ_eff ≈ 0.12, center-stable defense. At low spin (ω < 40% ω₀): μ_eff ≈ 0.06, transitions to narrow LAD tip contact. I_disc ≈ 1.131 × 10⁻⁵; I_tip ≈ 6.0 × 10⁻⁷; I_total ≈ 1.191 × 10⁻⁵ kg·m².  
**2.5D Rendering**: single combined disc+driver unit; disc plate visible mid-stack; tip extends below  
**Gimmick**: spin-rate dependent μ transition → `MechanicRegistry: hybrid_tip_mode`  
**Engine Note**: I 1.191 × 10⁻⁵; μ_high 0.12, μ_low 0.06; no disc slot; disc-integrated flag; movement: defense-center → stamina-LAD

---

### [Case 1312 — Bigbang Genesis Hybrid: Full Assembly (Burst GT Gatinko, Defense Type, Anime)](./9%20case%20study.md#case-1312)

**System**: Gen3-Burst / Burst-GT Gatinko; Stylized: Bigbang γenesis Hybrid; fan name: "Eclipse Genesis"  
**Geometry**: ~47.6 g (no Armor) / ~51.8 g (with Armor) · I_total (no armor) ≈ 3.452 × 10⁻⁵ kg·m²  
**Material**: ABS + metal Bigbang Genesis layer  
**Spin Coupling**: rigid; Bigbang Armor detachable  
**Contact Points**: Defense-type sloped layer contacts; Hybrid wide-base disc contact  
**Movement Freedom**: Armor toggle; spin-rate tip behavior  
**Base Stats**: Defense — high burst resistance; Stamina — dual-phase decay (9.76 rad/s² high-spin; 2.44 rad/s² LAD); 2-part simplicity  
**Mechanism**: L₀ (no armor) = 2.416 × 10⁻² N·m·s; L₀ (with armor) = 2.666 × 10⁻² N·m·s. Spin decay high-spin 9.76 rad/s²; LAD 2.44 rad/s². Simplest possible Gatinko combo (2 parts). Anime/manga signature combo. Reuses Hybrid driver from Regalia Genesis Hybrid.  
**2.5D Rendering**: monolithic Bigbang Genesis layer + disc-integrated Hybrid driver (no separate disc layer in stack)  
**Gimmick**: Armor toggle + hybrid tip mode; anime BeySpirit override  
**Engine Note**: I no-armor 3.452 × 10⁻⁵; I with-armor 3.809 × 10⁻⁵; L₀ (no armor) 2.416 × 10⁻²; decay high-spin 9.76, LAD 2.44 rad/s²; 2-part assembly

---

### [Case 1313 — Face Bolt: Kronos (MFB / 4D System)](./9%20case%20study.md#case-1313)

**System**: Gen2-MFB / 4D System; Beyblade: Scythe Kronos T125EDS  
**Geometry**: ~1–2 g (typical MFB range) · r ≈ 0 (geometric center)  
**Material**: ABS plastic  
**Spin Coupling**: rigid (structural spine)  
**Contact Points**: none  
**Movement Freedom**: fixed  
**Base Stats**: none competitive  
**Mechanism**: Depicts Cronus (Κρόνος) Titan of time as scythe-wielding skull motif. I ≈ negligible (<0.5% of assembly I). Excluded from official assembly mass nomenclature. Not modeled as separate physics object; purely cosmetic + AR anchor.  
**2.5D Rendering**: face sticker at top center of assembly  
**Gimmick**: none  
**Engine Note**: mass excluded from assembly; I negligible; cosmetic only

---

### [Case 1314 — Energy Ring: Kronos (MFB / 4D System)](./9%20case%20study.md#case-1314)

**System**: Gen2-MFB / 4D System; Beyblade: Scythe Kronos T125EDS  
**Geometry**: 2.6 g · r_o ≈ 4.1 cm · r_i ≈ 3.4 cm · width ~7 mm · 2 scythe-head protrusions at 0° and 180°  
**Material**: Clear polycarbonate (density ~1.2 g/cm³)  
**Spin Coupling**: rigid  
**Contact Points**: outer rim during LAD; Fusion Wheel overhang dominates contact geometry in 4D  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — LAD contributor at outer rim; protrusions add <2% asymmetric I (negligible)  
**Mechanism**: Annular ring with round smooth outer circumference + two scythe-head protrusions. I = ½ × 0.0026 × (0.034² + 0.041²) = 3.688 × 10⁻⁶ kg·m². Mid-weight Energy Ring (~Burst Unicorn equivalent). Protrusions balanced within negligible asymmetric I tolerance.  
**2.5D Rendering**: thin annular ring below Fusion Wheel; scythe protrusions at 180°  
**Gimmick**: none  
**Engine Note**: I = 3.688 × 10⁻⁶ kg·m²; LAD rim contributor; protrusion asymmetry negligible

---

### [Case 1315 — Fusion Wheel: Scythe (40.2 g total, MFB / 4D System)](./9%20case%20study.md#case-1315)

**System**: Gen2-MFB / 4D System; Beyblade: Scythe Kronos T125EDS  
**Geometry**: 40.2 g total · metal sub-wheel 37.8 g (r_i ≈ 1.3 cm, r_o_metal ≈ 3.8 cm) · PC frame 2.4 g (r_i ≈ 3.6 cm, r_o ≈ 4.15 cm)  
**Material**: Metal inner wheel (zinc alloy) + polycarbonate (PC) free-spinning outer frame  
**Spin Coupling**: rigid (metal core); free (PC frame — rotates independently)  
**Contact Points**: PC outer frame at r ≈ 3.8–4.15 cm; free-spinning on contact (recoil absorption ~10.6%)  
**Movement Freedom**: free-spin (PC frame only)  
**Base Stats**: Stamina — ★★★★★ (round flat profile, minimal recoil, PC free-spin absorbs 10.6% collision recoil); Defense — secondary (recoil absorption); Attack — poor (round profile, no aggressive angles)  
**Mechanism**: 4D construction: round flat metal wheel + thin PC ring that free-spins on contact. I_metal = 3.049 × 10⁻⁵; I_PC = 3.622 × 10⁻⁶; I_eff_coupled (spin decay) = I_metal = 3.049 × 10⁻⁵ kg·m². PC frame recoil reduction: η = I_metal/(I_metal + I_PC) ≈ 0.894 → 10.6% recoil absorbed. μ_PC ≈ 0.08 (PC on PC).  
**2.5D Rendering**: round flat metal disc with thin free-spinning PC ring around outer perimeter; PC ring visually distinct material  
**Gimmick**: free-spinning PC outer frame → `MechanicRegistry: free_spin_frame` (contactRecoilReduction: 0.106)  
**Engine Note**: I_eff_coupled 3.049 × 10⁻⁵; I_static 3.411 × 10⁻⁵; contactRecoilReduction 0.106; wheel type defense-stamina; μ_PC 0.08

<!-- Case 1316: skipped — already indexed -->

---

### [Case 1317 — Performance Tip: EDS / Eternal Defense Spike (MFB / 4D System)](./9%20case%20study.md#case-1317)

**System**: Gen2-MFB / 4D System; Beyblade: Scythe Kronos T125EDS  
**Geometry**: 0.6 g · r_spike ≈ 0.05 cm · r_dish ≈ 0.7 cm (outer) · dish inner bore ≈ 0.3 cm · tall height (taller than DS/S)  
**Material**: ABS housing + plastic pivot bearing (free-spinning outer dish)  
**Spin Coupling**: free (outer dish); fixed (inner spike shaft)  
**Contact Points**: spike tip r ≈ 0.05 cm (primary ground contact); free-spinning dish rim r ≈ 0.7 cm (tilt contact / recoil absorption)  
**Movement Freedom**: free-spin (dish)  
**Base Stats**: Stamina — ~10× less decay torque than flat tip (new spike); Defense — recoilReduction 0.08 from free-spin dish; wear degrades performance  
**Mechanism**: Sharp spike primary contact: μ_new ≈ 0.05; τ_EDS = 1.128 × 10⁻⁴ N·m. Free-spin dish absorbs lateral impulse (~8% recoil reduction). Taller height = delayed floor scrape. Wear progression: new r≈0.5 mm → moderate r≈1.5–2 mm → heavy r≈3–5 mm (worn EDS approaches DS performance). Tournament: replace when spike visually worn >2 mm flat contact diameter. I_dish ≈ 1.015 × 10⁻⁸ kg·m².  
**2.5D Rendering**: tall driver body; narrow spike tip visible at base; wide free-spinning dish ring around shaft  
**Gimmick**: free-spin dish + wear model  
**Engine Note**: μ_new 0.05, μ_worn 0.10; r_spike 0.5 mm; wearRate moderate; freeSpin true; recoilReduction 0.08; tipType eternal-spike; height: tall

---

### [Case 1318 — Assembled Beyblade Analysis: Scythe Kronos T125EDS (MFB / 4D System)](./9%20case%20study.md#case-1318)

**System**: Gen2-MFB / 4D System; Type: Stamina / Defense; 4D architecture  
**Geometry**: 45.1 g total (excl. Face Bolt) · I_coupled = 3.418 × 10⁻⁵ kg·m² · I_static = 3.785 × 10⁻⁵ kg·m²  
**Material**: Metal Fusion Wheel + PC free-spin frame + polycarbonate Energy Ring + ABS Spin Track + ABS EDS  
**Spin Coupling**: rigid (Energy Ring + metal wheel + T125 coupled to spin); free (PC frame + EDS dish decoupled)  
**Contact Points**: EDS spike tip (ground); PC frame outer rim (collision); EDS dish (lateral)  
**Movement Freedom**: PC frame free-spin; EDS dish free-spin  
**Base Stats**: Stamina — ★★★★★ (I_coupled high + EDS minimal friction); Defense — ★★★★ (combined recoil reduction ~18% from PC+EDS); Attack — poor (round profile)  
**Mechanism**: ω₀ = 600 rad/s (MFB 4D); L₀ = 2.051 × 10⁻² N·m·s; spin decay 3.24 rad/s² (new EDS); t_stall ≈ 185 s; t_wobble ≈ 111 s. Combined recoil reduction: PC frame 10.6% + EDS dish 8% = ~18%. Top-tier MFB 4D era stamina combo (2012–2014). Weakness: RF/rubber-tip attackers can ring out despite round profile. EDS wear critical: worn spike → 5.28 rad/s² decay.  
**2.5D Rendering**: round flat Scythe wheel + thin PC ring + narrow Energy Ring Kronos + T125 track + EDS spike/dish  
**Gimmick**: PC free-spin frame + EDS free-spin dish (dual recoil reduction layers)  
**Engine Note**: assemblyMass 45.1 g; I_coupled 3.418 × 10⁻⁵; ω₀ 600 rad/s; spinDecay 3.24 rad/s² (new); 5.28 (worn); recoilReduction 0.18; tipType eternal-spike; beyType stamina

---

### [Case 1319 — Energy Layer: Orb Egis (18.67 g, Burst Cho-Z Layer System, Defense Type)](./9%20case%20study.md#case-1319)

**System**: Gen3-Burst / Burst-CZ Cho-Z Layer System; Hasbro: Pro Series Orb Engaard  
**Geometry**: 18.67 g (TT confirmed) · r_o ≈ 4.0 cm · r_i ≈ 0.8 cm · trapezoid-shaped perimeter  
**Material**: ABS + inner circumference metal ring (r ≈ 3.0–3.4 cm) + 2 metal spheres (r ≈ 3.7–4.0 cm, 180° apart)  
**Spin Coupling**: rigid  
**Contact Points**: sloped contact points (Defense/destabilizer geometry); slope angle θ ≈ 25° → F_tang ≈ 0.42 × F_impact (tilt induction)  
**Movement Freedom**: fixed  
**Base Stats**: Defense — ★★★★★ (high mass + metal inner lining → high burst resistance; sloped contacts destabilize attacker); Stamina — secondary  
**Mechanism**: Dual metal placement: inner ring (r_avg ≈ 3.2 cm) + 2 spheres (r ≈ 3.9 cm). I_best_est ≈ 1.60 × 10⁻⁵ kg·m². Sloped contacts: each hit transfers F_tang upward onto attacker → tilt induction +20% vs. standard defense contacts. Synergy with Quest tip: sloped contacts + suction anchoring = attacker repeatedly tilted while defender held in place. Top-tier Defense release in Cho-Z era.  
**2.5D Rendering**: trapezoid perimeter outline; six serpentine Gorgon head motifs on face; metal sphere bulges at 180° visible  
**Gimmick**: slope-destabilize contacts → `MechanicRegistry: destabilize_slope`  
**Engine Note**: I ≈ 1.60 × 10⁻⁵ kg·m²; burst resist high (metal lining on teeth); destabilize +20%/contact; metal spheres at r=39 mm; generation Burst-CZ

---

### [Case 1320 — Forge Disc: Outer (22.05 g, Burst Cho-Z)](./9%20case%20study.md#case-1320)

**System**: Gen3-Burst (cross-gen: God/Cho-Z/GT/Sparking)  
**Geometry**: 22.05 g · r_o ≈ 4.2 cm · r_i ≈ 0.8 cm · nearly perfect circular perimeter · large central gaps (open spoke structure)  
**Material**: Metal (zinc alloy); mass concentrated at outer ring  
**Spin Coupling**: rigid  
**Contact Points**: circular outer rim traces smooth oval during LAD (best LAD in Burst disc roster)  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — ★★★★★ (highest I-per-gram of Burst discs; best LAD); Defense — high L; no burst risk from disc  
**Mechanism**: OWD maximized: near-empty center with all mass at rim → highest effective I per gram among Burst discs. I_best_est ≈ 2.5 × 10⁻⁵ kg·m² (rim-concentrated OWD model). Circular perimeter → best LAD floor trace. Single-piece (no Frame) → no burst risk from disc. Outperforms Ring disc for pure LAD.  
**2.5D Rendering**: circular annular ring with open spoke gaps visible; smooth outer perimeter edge  
**Gimmick**: none; maximum OWD by design  
**Engine Note**: I ≈ 2.5 × 10⁻⁵ kg·m²; LAD ★★★★★; burst risk none; OWD circular-rim type; frameCompatible: no (single piece)

---

### [Case 1321 — Performance Tip: Quest (7.3 g, Burst Cho-Z, Defense Type — Suction Cup)](./9%20case%20study.md#case-1321)

**System**: Gen3-Burst / Burst-CZ (cross-gen compatible)  
**Geometry**: 7.3 g · suction cup r_outer ≈ 0.8–1.0 cm · central spike r ≈ 0.05 cm · free-spinning conical suction cup  
**Material**: ABS outer + rubber suction cup  
**Spin Coupling**: free (suction cup rotates independently)  
**Contact Points**: central sharp spike (high spin, near-vertical); free-spinning suction cup rim r ≈ 0.8 cm (moderate-low spin, tilt)  
**Movement Freedom**: free-spin (suction cup)  
**Base Stats**: KO Resistance — ★★★★★ (highest in any Burst driver; +35% from suction adhesion ~15.5% of weight); Stamina — ★ (very high friction μ ≈ 0.30, τ ≈ 1.18 × 10⁻³ N·m); Stability — ★★ (oscillatory tilt from cup engage/release)  
**Mechanism**: Free-spinning conical suction cup faces downward. At moderate spin, cup forms low-pressure seal with stadium floor: ΔP ≈ 0.1–0.5 kPa → F_adhesion ≈ 0.076 N → +15.5% of weight as floor adhesion force. KO requires ~16% more impulse. Trade-off: suction cup μ ≈ 0.30, r ≈ 8 mm → t_stall ~25.6 s (poor stamina). Best in Destabilizer builds (Orb Egis synergy: slopes tilt attacker, Quest anchors position).  
**2.5D Rendering**: wide suction cup visible at base of driver; conical shape facing down; spike center  
**Gimmick**: suction cup adhesion → `MechanicRegistry: suction_tip`  
**Engine Note**: μ_eff 0.30, r_contact 8 mm; KO resist +35%; stamina −40% vs. Bearing class; tilt behavior oscillatory; I = 3.98 × 10⁻⁷ kg·m²

---

### [Case 1322 — Orb Egis Outer Quest: Full Assembly (Burst Cho-Z, Defense / Destabilizer)](./9%20case%20study.md#case-1322)

**System**: Gen3-Burst / Burst-CZ  
**Geometry**: 48.02 g total · I_total ≈ 4.14 × 10⁻⁵ kg·m²  
**Material**: ABS + metal Orb Egis layer + metal Outer disc  
**Spin Coupling**: rigid body; free-spin suction cup  
**Contact Points**: Orb Egis sloped contacts (destabilize +20%/hit); Quest suction cup (+35% KO resist)  
**Movement Freedom**: free-spin suction cup  
**Base Stats**: KO Resist — extreme (+16% from suction adhesion); Destabilize — +20%/contact tilt induction; Stamina — poor (dω/dt 27.3 rad/s²; t_stall ~25.6 s); burst resist high (Orb Egis metal lining)  
**Mechanism**: L₀ = 2.898 × 10⁻² N·m·s; L_battle = 1.739 × 10⁻² N·m·s. Outer disc provides 60% of total L (high I = spin-theft resistance). Quest anchors position → Orb Egis slopes contact attacker repeatedly → cumulative tilt after 3–5 contacts. Poor against Stamina opponents (KO-spec not endurance). Reaches wobble threshold at ω_battle level ≈ 5.1 s after battle phase (fast decay).  
**2.5D Rendering**: trapezoid Orb Egis layer + large circular Outer disc + wide suction cup at base  
**Gimmick**: slope-destabilize + suction cup anchoring  
**Engine Note**: I 4.14 × 10⁻⁵; L₀ 2.898 × 10⁻²; decay 27.3 rad/s²; KO +16%; destabilize +20%/contact; burst resist high

---

### [Case 1323 — Energy Layer: Kreis Satan (9.31 g, Burst God Layer System, Defense Type)](./9%20case%20study.md#case-1323)

**System**: Gen3-Burst / Burst-God God Layer System; "Kreis" = German for "circle"  
**Geometry**: 9.31 g · r_o ≈ 3.7 cm · r_i ≈ 0.8 cm · hexagonal inner layer + 3 large wings + 3 roller gap positions  
**Material**: Clear ABS (inner) + colored ABS (wings); 3 small free-rotating plastic rollers  
**Spin Coupling**: rigid (body); free-spin (3 rollers rotate independently)  
**Contact Points**: 3 wing blade contacts (~8 mm arc, low recoil) + 3 roller gap edge contacts (~12 mm, moderate recoil spike after brief roller deflection)  
**Movement Freedom**: 3 free-rotating rollers in gap positions  
**Base Stats**: KO Resist — high (compact round shape); Burst Resist — high (4 teeth: 1 medium + 3 medium-tall, avg 3.25 N·m); Stamina — crippled (−8% aero drag from non-circular profile + roller gap turbulence)  
**Mechanism**: 3 rollers: free-spin initial deflection then gap-edge recoil spike. Small rollers (d ≈ 6–8 mm) bottom out quickly — roller deflection partial only (μ_reducer 0.85× on gap contacts). Bulky non-circular design adds ~5–10% aero drag. Outperformed by Alter Chronos / Maximum Garuda for defense. I = 6.67 × 10⁻⁶ kg·m².  
**2.5D Rendering**: hexagonal inner ring + 3 wing blades alternating with 3 roller gap slots; rollers visually distinct as round elements  
**Gimmick**: roller-deflect contacts → `MechanicRegistry: roller_deflect` (partial; gap recoil partially negates)  
**Engine Note**: I = 6.67 × 10⁻⁶ kg·m²; burst resist high (4T, 3.25 N·m avg); roller: μ_reducer 0.85× on gap contacts; stamina −8% aero penalty; KO high

---

### [Case 1324 — Forge Disc: 2 (21.21 g, Burst God / Burst Standard)](./9%20case%20study.md#case-1324)

**System**: Gen3-Burst (universal cross-gen)  
**Geometry**: 21.21 g · r_o_long ≈ 4.2 cm · r_o_short ≈ 3.8 cm · r_i ≈ 0.8 cm · 1 protrusion per side ("2"-shaped molding) · elliptical symmetry  
**Material**: Metal (zinc alloy)  
**Spin Coupling**: rigid  
**Contact Points**: protrusions below layer level; Frame-covered in most combos  
**Movement Freedom**: fixed  
**Base Stats**: balanced (Jack-of-All-Trades); mid-tier on all metrics  
**Mechanism**: Even-numbered Core Disc → elliptical, Frame-compatible. Moderate ellipse ratio (near-circular). I = 1.765 × 10⁻⁵ kg·m². Average mass/I for Burst discs: 0.95× attack vs. Disc 4; 0.90× stamina vs. Outer. Best as general-purpose alternative when specialized discs unavailable.  
**2.5D Rendering**: elliptical annular disc; "2"-shaped protrusion on each face  
**Gimmick**: Frame-compatible slot  
**Engine Note**: I = 1.765 × 10⁻⁵ kg·m²; frameCompatible true; attack 0.95×; defense 0.95×; stamina 0.90×; Jack-of-All-Trades

---

### [Case 1325 — Disc Frame: Glaive (2.34 g, Burst God / Burst Standard)](./9%20case%20study.md#case-1325)

**System**: Gen3-Burst (universal Frame for even-numbered Core Discs)  
**Geometry**: 2.34 g · r_o ≈ 4.3 cm · r_i ≈ 3.6 cm · mostly round base + 2 sharp wave-like protrusions (180° apart) directed upward  
**Material**: Clear/translucent ABS  
**Spin Coupling**: rigid (seats on Core Disc perimeter)  
**Contact Points**: outer round rim (LAD floor trace); protrusions too small for layer-level contact; protrusions angled upward (no floor scrape)  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — ★★★★ LAD (near-Cross performance; protrusions upward = no floor scrape); Attack — 0 (protrusions too small); scrape risk: none  
**Mechanism**: Round base ensures smooth oval LAD trace. Two wave protrusions 180° apart: angled upward → no floor contact during wobble. Marginally less LAD than Cross (~5–10% difference) due to protrusion-induced non-circularity. I = 3.68 × 10⁻⁶ kg·m² at r_eff ≈ 3.9–4.3 cm; high I per gram (1.57 × 10⁻⁶ kg·m²/g).  
**2.5D Rendering**: thin near-circular outer ring below layer stack; two small upward-curving protrusions visible  
**Gimmick**: none  
**Engine Note**: I = 3.68 × 10⁻⁶ kg·m²; LAD ★★★★; attack 0; scrape risk none; seats on even-numbered Core Discs

---

### [Case 1326 — Performance Tip: Loop (6.2 g, Burst God / Burst Standard, Defense Type)](./9%20case%20study.md#case-1326)

**System**: Gen3-Burst / Burst-God (cross-gen compatible)  
**Geometry**: 6.2 g · ball tip r ≈ 0.5 cm · 4 tabs (same as Defense driver) · 2 free-rotating rollers (drape lower than Defense ring)  
**Material**: ABS  
**Spin Coupling**: free (2 rollers rotate independently); fixed (ball tip + 4 tabs)  
**Contact Points**: ball tip r ≈ 0.5 cm, μ ≈ 0.06 (primary); tabs contact floor at tilt >15° (braking); rollers contact at tilt in mid-spin (righting attempt)  
**Movement Freedom**: free-spin rollers  
**Base Stats**: KO Resist — ★★★★ (+20% from tab braking + center positioning); Stamina — ★★ (tab losses 60–120 rad/s + roller scrape at low ω; no LAD); Defense — high-spin ★★★★  
**Mechanism**: Identical to Defense driver (ball tip + 4 tabs) but Defense ring replaced by 2 free-rotating rollers. Rollers: μ_roll ≈ 0.02–0.05 vs. μ_slide ≈ 0.25–0.35 → 10× less energy per tilt event at high ω. At low ω: rollers hang lower than Defense ring → extended floor drag arc → scraping → spin killed rapidly → zero LAD. Tab braking: ~2–5 rad/s loss per event × 20–40 events = 60–120 rad/s total battle loss. I = 3.38 × 10⁻⁷ kg·m².  
**2.5D Rendering**: ball tip center; 4 tabs at outer diameter; 2 roller wheels hanging below driver body  
**Gimmick**: roller righting mechanism (functional at high ω; detrimental at low ω) → `MechanicRegistry: roller_righting`  
**Engine Note**: I = 3.38 × 10⁻⁷ kg·m²; μ_ball 0.06, r 5 mm; tab braking at tilt >15° (2–5 rad/s/event); roller righting: active ω > 60% ω₀; roller scrape: active ω < 35% ω₀; KO +20%; LAD: poor

---

### [Case 1327 — Kreis Satan 2Glaive Loop: Full Assembly (Burst God, Defense Type)](./9%20case%20study.md#case-1327)

**System**: Gen3-Burst / Burst-God; fan nickname: "Kinetic Satomb"  
**Geometry**: 39.06 g total · I_total ≈ 2.845 × 10⁻⁵ kg·m²  
**Material**: ABS Layer + Metal Disc 2 + ABS Frame + ABS Driver  
**Spin Coupling**: rigid; roller free-spin in layer; roller free-spin in driver  
**Contact Points**: Kreis Satan 3 wing blades (low recoil) + 3 roller gap edges (moderate recoil); Loop tabs braking + center ball  
**Movement Freedom**: Kreis Satan rollers (3); Loop rollers (2); Loop tabs  
**Base Stats**: KO Resist — ★★★★; Burst Resist — ★★★★ (4T, 3.25 N·m avg); Stamina — ★★ (tab+gap+scrape losses; effective ~35–45 s); Attack — ★  
**Mechanism**: L₀ = 1.992 × 10⁻² N·m·s; L_battle = 1.195 × 10⁻² N·m·s. Base decay 4.04 rad/s² (no tabs); tabs add 60–120 rad/s loss; roller gap recoil ~50 rad/s loss; effective survival ~35–45 s. Best use: short-medium matches vs. aggressive attack types that burst themselves. Outperformed by Alter Chronos / Maximum Garuda for stamina.  
**2.5D Rendering**: Kreis Satan hexagonal wing layer + Disc 2 elliptical + Glaive round Frame + Loop ball/roller driver  
**Gimmick**: roller-deflect (layer) + roller-righting (driver)  
**Engine Note**: I 2.845 × 10⁻⁵; L₀ 1.992 × 10⁻²; decay base 4.04 rad/s²; tab loss 60–120 rad/s; burst resist high (3.25 N·m avg); KO +20%; LAD minimal (roller scrape)

---

### [Case 1328 — Superking Chip: Lucifer 1 (5.7 g, Burst Superking / Sparking)](./9%20case%20study.md#case-1328)

**System**: Gen3-Burst / Burst-SK Superking Layer System; Hasbro: Lucius  
**Geometry**: 5.7 g · r_o ≈ 1.8 cm · r_i ≈ 0.5 cm · metal inserts embedded in chip body  
**Material**: ABS + metal inserts  
**Spin Coupling**: rigid  
**Contact Points**: top burst-tooth interface with Ring/Chassis stack  
**Movement Freedom**: fixed  
**Base Stats**: Defense — viable (metal provides hard burst engagement surface); 70% more chip-level I than non-metal chips  
**Mechanism**: One of 5 metal-containing Superking Chips. I = 9.95 × 10⁻⁷ kg·m². Solomon generally preferred (heavier, more symmetric metal distribution) but Lucifer 1 adequate for defense builds when Solomon unavailable. Chip-level τ_burst not specified explicitly (Solomon/Joker comparable: ~4.5–5.5 mN·m range).  
**2.5D Rendering**: chip-level component at top of Superking stack; Lucifer face motif with metal accent areas  
**Gimmick**: none  
**Engine Note**: I = 9.95 × 10⁻⁷ kg·m²; metal: true; spin: right; burst engagement: top chip interface; generation Burst-SK

---

### [Case 1329 — Ring: Variant (5.9 g, Burst Superking)](./9%20case%20study.md#case-1329)

**System**: Gen3-Burst / Burst-SK Superking Layer System  
**Geometry**: 5.9 g · r_o ≈ 3.5–3.8 cm (est.) · r_i ≈ 1.2 cm · jagged/ridged perimeter with multiple small angular protrusions  
**Material**: ABS (black/dark colored)  
**Spin Coupling**: rigid  
**Contact Points**: multiple small ridged protrusions distributed around circumference (upper layer contact zone); dense distribution = many low-energy contacts per revolution  
**Movement Freedom**: fixed  
**Base Stats**: Defense — low-recoil multi-protrusion contact (small protrusions catch but do not deeply engage); Stamina — moderate OWD  
**Mechanism**: Dense small protrusions = many low-energy contacts rather than high-energy spike contacts → reduced recoil profile. Defense orientation. Name "Variant" implies versatile non-committed geometry. In 2D chassis assembly: Ring handles upper contact geometry while Barrier Blades handle mid/lower zone. I = 4.46 × 10⁻⁶ kg·m².  
**2.5D Rendering**: dark textured outer ring atop 2D chassis; dense small ridges around perimeter  
**Gimmick**: none  
**Engine Note**: I = 4.46 × 10⁻⁶ kg·m²; contact: multi-protrusion low-recoil; ring type defense; generation Burst-SK

---

### [Case 1330 — Chassis: 2D (47.1 g, Burst Superking, Defense Type — Barrier Blades)](./9%20case%20study.md#case-1330)

**System**: Gen3-Burst / Burst-SK Superking Double Chassis; disc-integrated  
**Geometry**: 47.1 g · r_o_retracted ≈ 4.3 cm · r_o_deployed ≈ 5.5–6.0 cm · r_i ≈ 1.0 cm · 6 blade tabs (3 pairs at 120°) · translucent pink ABS blades + metal+ABS chassis body  
**Material**: Metal + ABS hybrid chassis; ABS blade tabs  
**Spin Coupling**: rigid (chassis body); centrifugal-deploy (6 blade tabs)  
**Contact Points**: deployed blades at r ≈ 5.5–6.0 cm (smooth leaf-shaped — deflect not catch); chassis body at r ≈ 4.3 cm (retracted state)  
**Movement Freedom**: centrifugal-deploy blades (always deployed in battle; retract below ~100 rad/s)  
**Base Stats**: Defense — ★★★★★ (extreme mass + Barrier Blades deflect at large r; +34% I from deployment); Stamina — ★★★★★ (massive I dominates assembly); Dual-spin: yes  
**Mechanism**: 47.1 g = ~70% of Variant Lucifer assembly mass. I_retracted = 4.590 × 10⁻⁵; I_deployed = 6.14 × 10⁻⁵ (+34%). Blade deploy threshold ω ≈ 150 rad/s (F_cf = 25.7 N per blade at launch ω — always deployed in battle). At blade retraction (ω ≈ 100 rad/s): angular momentum conserved → ω jumps from 150 to ~195 rad/s (+30% spin boost). Dual-spin: accommodates both right and left spin chips. No separate Forge Disc needed.  
**2.5D Rendering**: massive annular chassis with 6 deployable blade tabs extending outward; translucent pink blades visually distinct; base disc integration visible  
**Gimmick**: centrifugal Barrier Blades → `MechanicRegistry: centrifugal_barrier_blades` + blade retraction spin-boost  
**Engine Note**: I_retracted 4.590 × 10⁻⁵; I_deployed 6.14 × 10⁻⁵; deploy threshold 150 rad/s; retract 100 rad/s; ΔI +34%; disc-integrated; dual-spin; generation Burst-SK

---

### [Case 1331 — Performance Tip: Mobius (7.7 g, Burst Superking, Stamina / Defense Type)](./9%20case%20study.md#case-1331)

**System**: Gen3-Burst / Burst-SK (cross-gen compatible); successor: Bearing Mobius  
**Geometry**: 7.7 g · tall driver height · free-spinning conical sharp tip · tip r_contact ≈ 0.05–0.10 cm · wide cone section r ≈ 1.2–1.4 cm  
**Material**: ABS + low-friction bearing/pivot  
**Spin Coupling**: free (conical tip barrel rotates independently)  
**Contact Points**: conical sharp tip r ≈ 0.05–0.10 cm; μ_bearing ≈ 0.01–0.03  
**Movement Freedom**: free-spin (tip)  
**Base Stats**: Stamina — ~5× lower decay than fixed sharp; Defense — +20% burst resistance; Opposite-spin — +15% spin-theft resistance; same-spin — standard  
**Mechanism**: Free-spinning conical tip: μ_bearing ≈ 0.02 vs. μ_fixed ≈ 0.10 → 5× less friction torque. τ ≈ 1.18 × 10⁻⁵ N·m for 60 g assembly. Wide free-spinning cone provides gyroscopic stability against tilt (especially important for tall driver CoM). Burst defense: free-spin absorbs burst torque via bearing compliance (+20%). Opposite-spin: free-spin absorbs contra-rotational contact (+15% spin-theft resistance). B-194 blue colorway has best free-spin (tightest manufacturing tolerance). I = 5.89 × 10⁻⁷ kg·m².  
**2.5D Rendering**: tall slender driver body; wide free-spinning conical tip section at base; driver height noticeably taller than standard  
**Gimmick**: free-spin conical tip → `MechanicRegistry: free_spin_conical_tip`  
**Engine Note**: μ_eff 0.02, r_tip 1 mm; burst +20%; opposite-spin +15%; I = 5.89 × 10⁻⁷ kg·m²; height: tall; generation Burst-SK

---

### [Case 1332 — Variant Lucifer Mobius 2D: Full Assembly (Burst Superking, Defense Type, Dual-Spin)](./9%20case%20study.md#case-1332)

**System**: Gen3-Burst / Burst-SK Superking; Hasbro chip: Lucius  
**Geometry**: 66.4 g total · I_deployed ≈ 6.74 × 10⁻⁵ kg·m² · I_retracted ≈ 5.19 × 10⁻⁵ kg·m²  
**Material**: ABS + metal Lucifer chip + ABS Variant Ring + Metal+ABS 2D chassis + ABS Mobius tip  
**Spin Coupling**: rigid; 6 centrifugal blades; Mobius free-spin tip  
**Contact Points**: deployed Barrier Blades at r ≈ 5.7 cm (smooth deflect); Variant Ring small protrusions (low recoil); Mobius free-spin tip (center-stable)  
**Movement Freedom**: centrifugal blades (2D); free-spin tip (Mobius)  
**Base Stats**: Stamina — ★★★★★ (dω/dt 0.193 rad/s²; t_stall ~3627 s theoretical); KO Resist — ★★★★★ (extreme); Burst Resist — ★★★★; Opposite-spin — +15%  
**Mechanism**: L₀ = 4.718 × 10⁻² N·m·s; L_battle = 2.831 × 10⁻² N·m·s (40–63% higher than all prior Cho-Z/God defense combos). Friction decay 0.193 rad/s² — effectively infinite under friction alone. 50 impacts × 20 rad/s = 1000 rad/s loss in full match → still well above wobble. Blade retraction at 150 rad/s → ω jumps to ~195 rad/s (L conserved; +30% spin boost at transition). Dual-spin from 2D chassis. Apex of Superking Defense archetype.  
**2.5D Rendering**: full Superking stack: Lucifer chip + Variant Ring (textured dark outer) + massive 2D chassis (6 deployed blades at maximum radius) + Mobius tall driver  
**Gimmick**: centrifugal Barrier Blades + free-spin Mobius tip + blade-retraction spin-boost  
**Engine Note**: I_deployed 6.74 × 10⁻⁵; I_retracted 5.19 × 10⁻⁵; L₀ 4.718 × 10⁻²; L_battle 2.831 × 10⁻²; decay 0.193 rad/s²; blade deploy 150 rad/s; retract 100 rad/s; KO extreme; burst very high; opposite-spin +15%; generation Burst-SK

---

### [Case 1333 — Gatinko Chip: Joker (Burst GT Gatinko System)](./9%20case%20study.md#case-1333)

**System**: Gen3-Burst / Burst-GT Gatinko; Beyblade: Judgement Joker 00Turn Trick Zan; Blader: Cuza Ackermann  
**Geometry**: 3.0 g · r ≈ 1.1 cm (outer lip)  
**Material**: ABS plastic  
**Spin Coupling**: rigid; houses Hard Lock burst ratchet  
**Contact Points**: top burst-tooth ratchet interface  
**Movement Freedom**: fixed  
**Base Stats**: Burst Resist — Hard Lock τ_burst ≈ 5.5 mN·m (~57% above standard GT chip at 3.0–3.5 mN·m); Hasbro: ~4.0–4.5 mN·m  
**Mechanism**: GT Chips house burst lock mechanism. Joker = "Hard Lock" (above-average tooth engagement depth/angle). τ_burst = 5.5 mN·m. Strong GT attack layers (Dread, Judgement) generate 50–200 mN·m contact torque → lock can be overcome but casual hits cannot burst Joker combos. Synergy: Goku Layer Weight (+I + structural interface stiffening) preferred; Zan (7.9 g) used in stock combo. I_chip = 1.815 × 10⁻⁷ kg·m².  
**2.5D Rendering**: small chip at top center of GT stack; joker head motif on face sticker  
**Gimmick**: Hard Lock ratchet  
**Engine Note**: burstResistance 5.5 mN·m; chipSpin right; chipMass 3.0 g; I = 1.815 × 10⁻⁷ kg·m²; generation Burst-GT

---

### [Case 1334 — Layer Weight: Zan (7.9 g, Burst GT Gatinko System)](./9%20case%20study.md#case-1334)

**System**: Gen3-Burst / Burst-GT Gatinko; Beyblade: Judgement Joker 00Turn Trick Zan  
**Geometry**: 7.9 g · r_i ≈ 1.8 cm · r_o ≈ 3.2 cm · annular ring with sawtooth outer edge detailing  
**Material**: ABS  
**Spin Coupling**: rigid (clamped between Chip base and Layer Base top)  
**Contact Points**: none (internal mass element between chip and base)  
**Movement Freedom**: fixed  
**Base Stats**: Stamina — +I contribution; Burst Resist — mass clamped between chip+base adds interface friction  
**Mechanism**: Mid-tier Layer Weight (7.9 g vs. Goku ~9–10 g). I = 5.325 × 10⁻⁶ kg·m² (14.5% of assembly I — non-trivial, comparable to Judgement base contribution). Clamped position adds structural resistance to burst chip separation. Sawtooth outer edge: decorative + minor rotational texture.  
**2.5D Rendering**: annular weight ring with sawtooth outer edge between chip and base layers  
**Gimmick**: none  
**Engine Note**: I = 5.325 × 10⁻⁶ kg·m²; assembly fraction 14.5%; burst resist: clamping interface stiffening; mid-tier LW; generation Burst-GT

---

### [Case 1335 — Layer Base: Judgement (12.0 g, Burst GT Gatinko System)](./9%20case%20study.md#case-1335)

**System**: Gen3-Burst / Burst-GT Gatinko; Beyblade: Judgement Joker 00Turn Trick Zan  
**Geometry**: 12.0 g · elliptical 8-shaped top view · ABS frame ~8 g (r_i 0.8 cm, r_o 2.8 cm) + 2 rubber blades ~4 g total at r ≈ 3.3 cm · outer extent r ≈ 3.6 cm  
**Material**: ABS frame + rubber blades (μ_rubber ≈ 0.55)  
**Spin Coupling**: rigid  
**Contact Points**: 2 rubber blade tips at r ≈ 3.3 cm · φ ≈ 20–25° attack angle · KE_blade = 0.192 J per blade at battle ω; τ_attack ≈ 38.8 mN·m per blade → **77.6 mN·m total** (dual-blade contact)  
**Movement Freedom**: fixed  
**Base Stats**: Attack — ★★★★★ (strongest Attack Type Base in GT era); Burst Attack — τ_attack 77.6 mN·m >> opponent burst thresholds; Recoil — high (rubber blades generate significant self-recoil on failed burst)  
**Mechanism**: Rubber smash: μ_rubber ≈ 0.55 vs. ABS 0.15–0.20. At battle ω = 420 rad/s: v_tip = 13.86 m/s per blade; KE = 0.384 J total. τ_attack = 77.6 mN·m = 14× Joker Hard Lock (5.5 mN·m). Key limiting factor: achieving/sustaining contact (driver-controlled). Recoil concern: rubber blades that fail to burst generate high self-recoil → Xtreme'/Quick' mitigate. Hasbro: μ_rubber ≈ 0.45 → −18% attack torque. I = 7.748 × 10⁻⁶ kg·m².  
**2.5D Rendering**: elliptical 8-shaped layer body; 2 rubber blade protrusions at major axis opposing tips; rubber visually distinct  
**Gimmick**: rubber-smash → `MechanicRegistry: rubber_smash_ar`  
**Engine Note**: I = 7.748 × 10⁻⁶ kg·m²; τ_attack 77.6 mN·m; v_tip 13.86 m/s at battle ω; attack angle 20–25°; recommended drivers: Xtreme', Quick'; recoil: high on failed burst

---

### [Case 1336 — Forge Disc: 00 / Double Zero (25.2 g, Burst universal)](./9%20case%20study.md#case-1336)

**System**: Gen3-Burst (universal: God/Cho-Z/GT/Superking/DB); Beyblade: Judgement Joker 00Turn Trick Zan  
**Geometry**: 25.2 g · r_o ≈ 4.0 cm · r_i ≈ 0.6 cm · symmetrical elliptical with Frame-compatible outer groove  
**Material**: Metal (zinc alloy)  
**Spin Coupling**: rigid  
**Contact Points**: Frame-compatible groove accepts any standard Disc Frame  
**Movement Freedom**: fixed; Frame modular  
**Base Stats**: Stamina — ★★★★★ (heaviest Core Disc in Burst series, +1 g over Disc 0); Defense — high L; Attack — high recoil transfer  
**Mechanism**: Heaviest standard Burst Core Disc at 25.2 g (+1 g over Disc 0 at 24.2 g). I = 2.021 × 10⁻⁵ kg·m². Elliptical OWD: maximum I among Core Discs. ΔL vs. Disc 0: +5.6 × 10⁻⁴ kg·m²/s at ω₀ = 700 (+2.2%). Frame groove: 00+Turn = 28.8 g total (I_disc ≈ 2.273 × 10⁻⁵); 00+Wall ≈ heaviest possible disc combination. Contributes 55.1% of Judgement Joker assembly I.  
**2.5D Rendering**: heavy elliptical annular disc; outer Frame groove visible; dominant visual element of assembly  
**Gimmick**: Frame-compatible groove  
**Engine Note**: I = 2.021 × 10⁻⁵ kg·m²; frameCompatible true; heaviest-core-disc; generation universal Burst

---

### [Case 1337 — Disc Frame: Turn (3.6 g, Burst Cho-Z / GT / Superking)](./9%20case%20study.md#case-1337)

**System**: Gen3-Burst (universal Frame); Beyblade: Judgement Joker 00Turn Trick Zan  
**Geometry**: 3.6 g · 4-arm X-cross profile · r_inner ≈ 1.0 cm · r_outer ≈ 4.0 cm (arm tip) · hexagonal arm tips  
**Material**: ABS plastic  
**Spin Coupling**: rigid (seats on Core Disc outer groove)  
**Contact Points**: arm tips at r ≈ 4.0 cm; mode-switch feature contacts disc-to-layer level opponents (rarely activates in standard play)  
**Movement Freedom**: mode-switch (defense / attack geometry triggered by disc-to-layer contact force — vestigial in standard play)  
**Base Stats**: Stamina — +12.5% I over 00 alone (00+Turn = I_disc 2.273 × 10⁻⁵ kg·m²); moderate mass frame  
**Mechanism**: 4-arm X-cross design. I = 2.520 × 10⁻⁶ kg·m² (+12.5% vs. 00 alone). Defense Mode (retracted): arm edge parries disc-to-layer contact. Attack Mode (extended): arm edge presses onto opponent layer. Gimmick rarely activates (requires disc-to-layer height alignment uncommon in modern drivers). Practical value = mass contribution only. Heavier than Bump (2.6 g) but lighter than Wall (~4 g).  
**2.5D Rendering**: 4-arm cross frame around Core Disc; hexagonal tips visible at arm ends  
**Gimmick**: mode-switch defense/attack (vestigial); practical: mass contribution only  
**Engine Note**: I = 2.520 × 10⁻⁶ kg·m²; gimmick type mode-switch-defense-attack (inactive standard play); scrape risk low; +12.5% I over 00 base

---

### [Case 1338 — Performance Tip: Trick (9.9 g, Burst GT Gatinko System)](./9%20case%20study.md#case-1338)

**System**: Gen3-Burst / Burst-GT Gatinko; Beyblade: Judgement Joker 00Turn Trick Zan  
**Geometry**: 9.9 g (one of heaviest Burst drivers) · Hole-Flat: r_eff ≈ 0.45 cm ring/annulus with center hole · Sharp: r_eff ≈ 0.05 cm spike  
**Material**: ABS plastic  
**Spin Coupling**: fixed (no free-spin); mode-switch tab contact triggers floor-actuated change  
**Contact Points**: Hole-Flat mode: ring r ≈ 0.45 cm, μ ≈ 0.30; Sharp mode: spike r ≈ 0.05 cm, μ ≈ 0.05  
**Movement Freedom**: auto mode-switch (floor tab trigger — unreliable, random probability per tick)  
**Base Stats**: Hole-Flat — dω/dt 22.21 rad/s² (t_stall ~31.5 s); Sharp — dω/dt 0.411 rad/s² (destabilizes before theoretical stall); competitive rating: collection-only  
**Mechanism**: Hole-flat mode: central hole removes center support → skipping orbit, cannot flower pattern. 4 tabs grind (not catch) Tornado Ridge → cannot Tornado Stall. Sharp mode: rapid destabilization from mode-switch mechanical play. Mode switch (either direction): sudden μ change causes destabilizing lurch or abrupt slowdown. Gimmick is strictly detrimental — blader cannot control it. 9.9 g mass: I = 7.128 × 10⁻⁷ kg·m² (+1.9% assembly I = marginal). Replace with Xtreme' or Bearing/Orbit for any competitive use.  
**2.5D Rendering**: bulky driver body; two visually distinct tip sections depending on mode; floor-actuating tab on body side  
**Gimmick**: auto mode-switch (detrimental) → `MechanicRegistry: detrimental_mode_switch`  
**Engine Note**: modes: hole-flat (μ 0.30, r 4.5 mm) + sharp (μ 0.05, r 0.5 mm); switch trigger: floor-tab random probability; modeSwitchDetrimental true; competitiveRating: collection-only; I = 7.128 × 10⁻⁷ kg·m²

---

### [Case 1339 — Assembled Beyblade Analysis: Judgement Joker 00Turn Trick Zan (Burst GT Gatinko)](./9%20case%20study.md#case-1339)

**System**: Gen3-Burst / Burst-GT Gatinko  
**Geometry**: 61.6 g total · I_total = 3.670 × 10⁻⁵ kg·m²  
**Material**: ABS throughout (Joker Chip, Zan LW, Judgement Base ABS+rubber, 00 disc metal, Turn Frame ABS, Trick driver ABS)  
**Spin Coupling**: rigid (no free-spin in stock configuration)  
**Contact Points**: Judgement rubber blades (τ_attack 77.6 mN·m); Variant Ring protrusions N/A (Variant is in 1332 assembly — here it's 00+Turn at disc level); Trick tip (hole-flat or sharp per mode)  
**Movement Freedom**: Trick mode-switch (detrimental auto); Turn Frame mode-switch (vestigial)  
**Base Stats**: Attack — ★★★★★ (Judgement rubber blades); Burst Resist — 5.5 mN·m (Joker Hard Lock); Stamina — ★ (Trick t_stall 31.5 s; wobble at ~18.9 s); competitive viability — not viable as-built (replace Trick with Xtreme'/Quick')  
**Mechanism**: L₀ = 2.569 × 10⁻² N·m·s; ω₀ = 700 rad/s. I_total dominated by Disc 00 (55.1%) + Judgement base (21.1%). Disc 00 (25.2 g) provides maximum Core Disc OWD but Trick driver wastes it with 22.21 rad/s² decay (first wobble at 18.9 s). Optimal combo: replace Trick with Xtreme' → tournament-viable Attack. τ_attack = 77.6 mN·m (14× Joker's own lock threshold).  
**2.5D Rendering**: Joker chip + Zan sawtooth weight ring + Judgement elliptical 8-shaped rubber-blade base + 00 heavy disc + Turn 4-arm frame + Trick bulky dual-mode driver  
**Gimmick**: Judgement rubber smash + Joker Hard Lock + Turn vestigial mode-switch + Trick detrimental mode-switch  
**Engine Note**: assemblyMass 61.6 g; I_total 3.670 × 10⁻⁵; ω₀ 700 rad/s; L₀ 2.569 × 10⁻²; spinDecay 22.21 rad/s² (stock Trick); burstResistance 5.5 mN·m; attackTorque 77.6 mN·m; beyType attack; driverRating: collection-only (stock); replace Trick → Xtreme'/Quick' for competitive viability

---

## Gap Fill Batch — Cases 1376–1380, 1498–1573


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

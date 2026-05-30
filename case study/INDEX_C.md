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



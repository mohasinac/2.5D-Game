# INDEX_C Gap Fill — Cases 1289–1339

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

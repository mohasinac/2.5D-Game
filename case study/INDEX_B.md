# BEYBLADE CASE STUDY INDEX — Part B (Cases 524–1050)
> Phase 0 audit complete · All geometry in cm · PX_PER_CM = 24
> True case count: 2008 unique numbered cases · Highest: 2092 · Next Available: 2093

---

## CS9 Overflow — Cases 524–544 {#cs9-overflow}
Source: `9 case study.md`

---

### [Case 524 — SK Chip Longinus (Superking / Sparking)](./9%20case%20study.md#case-524)

**System**: Superking / Sparking layer system  
**Geometry**: annular · r_i = 0.5 cm · r_o = 1.5 cm  
**Material**: ABS · left-spin only  
**Spin Coupling**: rigid (3 left-spin lock tabs)  
**Base Stats**: Burst-lock initiator only  
**Mechanism**: Three hard lock tabs (k_tab = 3800 N/m) engage left-spin ratchet on Ring Rage and Chassis 3A; τ_chip = 3 × 3800 × 0.0004 × 0.009 = 41.0 mN·m. No metal inserts; cosmetically identical weight to Ragnaruk chip. I_chip = 3.75 × 10⁻⁷ kg·m² (< 1% of assembly). Left-spin only — no dual-spin capability.  
**Engine Note**: burst tab force at chip level; left-spin-only assembly constraint; I contribution negligible.

```
SK Chip Longinus -- top view
      r=15mm
   +--------+
   |  [L]   |  <- dragon head motif (ABS, no metal)
   | 3 tabs |  <- left-spin only, k_tab=3800 N/m
   +--------+
      r=5mm
```

---

### [Case 525 — Ring Rage (Superking / Sparking)](./9%20case%20study.md#case-525)

**System**: Superking / Sparking layer system  
**Geometry**: annular ring · r_i = 1.0 cm · r_o = 2.8 cm · 2-fold symmetry  
**Material**: ABS with zinc-alloy metal inserts (2 dragon heads at r = 2.7 cm) · μ_k = 0.35 ABS contact  
**Spin Coupling**: rigid  
**Contact Points**: r_metal = 2.7 cm · upper blades at θ_upper = 25° · F_up/F_N = 0.423 · F_lat/F_N = 0.906  
**Base Stats**: Attack 150 · Defense 20 · Stamina 0 · Speed 130  
**Mechanism**: Two metal dragon heads at r = 27 mm act as hammers (C_recoil = 0.45); two swept upper blades at θ = 25° simultaneously lift opponent (F_up = 8.46 N at 20 N normal) and drive lateral KO. τ_destab = 67.7 mN·m per contact. Stagger-impact with 3A Chassis at r_head = 27 mm and r_blade = 30 mm simultaneously.  
**Engine Note**: upper-attack dual-force split (sin/cos θ); destabilisation torque applied to opponent tilt; high recoil 55% energy transfer.

---

### [Case 526 — Chassis 3A (Superking / Sparking)](./9%20case%20study.md#case-526)

**System**: Superking / Sparking layer system — Double Chassis  
**Geometry**: disc-integrated · r_i = 1.4 cm · r_o = 3.3 cm  
**Material**: ABS · left-spin only  
**Spin Coupling**: rigid (2 lock rows, 4 tabs each)  
**Movement Freedom**: integrated disc — no separate Forge Disc slot  
**Base Stats**: Attack 140 · Defense 60 · Stamina 0  
**Mechanism**: Double Chassis with integrated disc at r_disc = 33 mm; two primary spear-blades at r = 30 mm (θ = 25°) and two secondary blades at r = 22 mm. τ_chassis = 2 × 66.9 = 133.8 mN·m; total assembly τ_burst = 201.6 mN·m (chip + 3A + Dash bonus). I_3A = 2.827 × 10⁻⁵ kg·m² (78.7% of assembly). Left-spin closing velocity 2 × 694 rad/s = 41.6 m/s at r = 30 mm contact.  
**Engine Note**: Double Chassis burst torque (2 lock rows); integrated disc removes disc-slot step; opposite-spin closing speed formula.

---

### [Case 527 — Performance Tip Destroy' (Superking / Sparking)](./9%20case%20study.md#case-527)

**System**: Superking / Sparking layer system — Dash driver  
**Geometry**: star tip r_star = 0.4 cm (8 points) · free-spin plate r_plate = 1.6 cm  
**Material**: polycarbonate · μ_star = 0.35 (intermittent); μ_bushing = 0.04 (LAD plate)  
**Spin Coupling**: partial — free-spin plate on POM bushing during LAD  
**Base Stats**: Attack 140 · Stamina 40 (LAD phase)  
**Mechanism**: Eight-pointed star tip creates 884 contacts/s at launch; μ_eff = 0.30, r_eff = 4 mm → dω/dt = −22.3 rad/s², t_battle = 18.7 s (attack phase). Free-spin plate at r_plate = 16 mm engages at tilt > 10.6°; LAD phase dω/dt = −1.49 rad/s², t_LAD = 279 s. Dash spring adds 26.8 mN·m burst resistance. Assembly (Rage Longinus 3A): m = 68.2 g, I = 3.594 × 10⁻⁵, L₀ = 2.494 × 10⁻² kg·m²/s.  
**Engine Note**: two-phase tip (attack star → LAD plate); tilt threshold for plate engagement (10.6°); Dash burst bonus.

---

### [Case 528 — DB Core Belial (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-528)

**System**: Dynamite Battle / Burst Ultimate DB Core  
**Geometry**: annular · r_i = 1.0 cm · r_o = 2.0 cm  
**Material**: ABS · right-spin  
**Spin Coupling**: rigid (4 tabs, k_tab = 1300 N/m)  
**Base Stats**: Burst resistance: τ_burst = 56.2 mN·m; step = 90° per slip  
**Mechanism**: Four tabs at 90° intervals; τ = 4 × 1300 × 0.0006 × 0.018 = 56.2 mN·m (+11.5% vs Dragon 7-tab). Binary burst character: 90° step means full burst rather than partial slip. Rebound spring k = 8200 N/m compresses 0.8 mm, stores U = 2.624 mJ, recovers Δω = 13.6 rad/s per hit. I = 1.750 × 10⁻⁶ kg·m².  
**Engine Note**: burst torque model with tab stiffness k and engagement radius; spring rebound Δω per impact; right-spin only.

---

### [Case 529 — Blade Dynamite + F Gear + L Gear (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-529)

**System**: Dynamite Battle / Burst Ultimate BU Blade + Evolution Gears  
**Geometry**: 3-wing trefoil · r_hub = 1.2 cm · r_tip = 2.7 cm · θ_sweep = 35°  
**Material**: ABS (base); rubber F Gear μ = 0.55; zinc-alloy L Gear at r = 3.0 cm  
**Spin Coupling**: rigid  
**Gimmick**: F Gear (5.7 g) fills inter-wing gaps with rubber pads → near-circular stamina profile; repel +57.2% vs bare ABS. L Gear (15.5 g) High-Mode-only armor at r = 30 mm: I_LGear = 9.486 × 10⁻⁶ kg·m² (3.95× blade), raises assembly I from 2.835 × 10⁻⁵ to 3.784 × 10⁻⁵; CoM shifts +1.16 mm in High Mode.  
**Engine Note**: gear-slot mode switching (F/L/none); rubber repel force at inter-wing gaps; High Mode CoM shift.

---

### [Case 530 — Armor 2 (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-530)

**System**: Dynamite Battle / Burst Ultimate DB Armor  
**Geometry**: annular · r_i = 1.2 cm · r_o = 2.5 cm · 2-fold symmetry · 2 pointed tips  
**Material**: ABS · θ_tip = 30°  
**Spin Coupling**: rigid  
**Contact Points**: r_tip = 2.5 cm · F_up/F_N = 0.500 · F_lat/F_N = 0.866  
**Mechanism**: Two diametrically-opposed pointed tips at r = 25 mm; θ = 30° upper attack gives τ_destab = 250 mN·m at 20 N normal (moderate tier: Armor 1 = 327, Ring Rage = 127). I_A2 = 5.268 × 10⁻⁶ kg·m² (17% of assembly). DB Low Mode: tips below blade; DB High Mode: tips above blade (+5 mm contact height).  
**Engine Note**: upper-attack force decomposition; DB High/Low mode height toggle for contact point.

---

### [Case 531 — Forge Disc Nexus + S Gear + D Gear (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-531)

**System**: Dynamite Battle / Burst Ultimate Forge Disc  
**Geometry**: annular · r_i = 0.8 cm · r_o = 3.4 cm · 8 equally-spaced blades  
**Material**: ABS  
**Spin Coupling**: rigid; S Gear free-spin mode decouples disc  
**Gimmick**: S Gear (4.3 g, Spriggan lineage): face-up = 8 tabs locked → τ +40.0 mN·m (total 96.2 mN·m); face-down = free-spin on POM bushing (negligible drag, disc decoupled). D Gear (4.0 g, Dragon lineage): 4 sliding blades at r = 22 mm, k_slide = 1200 N/m, J_repel = 0.015 N·s per lateral blow. I_Nexus = 1.867 × 10⁻⁵ kg·m² (60.4% of assembly).  
**Engine Note**: S Gear mode switch (fixed/free-spin); D Gear spring-repel impulse; disc-decoupling friction model.

---

### [Case 532 — Performance Tip Venture + V Gear + VS Gear (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-532)

**System**: Dynamite Battle / Burst Ultimate Performance Tip + Evolution Gears  
**Geometry**: central flat r_flat = 0.2 cm + outer rubber ring r_rubber = 0.8 cm · V Gear guard r_guard = 1.4 cm  
**Material**: ABS + rubber outer ring; V Gear metal wings; VS Gear free-spin guard ring μ_axle = 0.04  
**Spin Coupling**: partial — VS Gear outer guard free-spins on wall contact  
**Mechanism**: Base Venture (μ_eff = 0.30, r_eff = 4 mm): dω/dt = −26.8 rad/s², t = 15.5 s. V Gear adds Dash-level spring compression. VS Gear (7.6 g) raises spring above Dash level + adds free-spin guard ring at r = 14 mm decoupling wall friction; t_battle = 22.9 s (+47.7% vs base). I_VS = 1.483 × 10⁻⁶ kg·m².  
**Engine Note**: inconsistent flat/rubber tip mode switching; VS Gear wall-decoupling friction model; Dash spring force level.

---

### [Case 533 — Assembly: Dynamite Belial Nexus Venture-2 (DB / BU)](./9%20case%20study.md#case-533)

**System**: Dynamite Battle / Burst Ultimate — full assembly analysis  
**Mechanism**: S Gear (fixed) + VS Gear configuration. m = 76.5 g; I_total = 3.091 × 10⁻⁵ kg·m²; L₀ = 2.145 × 10⁻² kg·m²/s (84.5% of Glide Ragnaruk). dω/dt = −18.2 rad/s², t = 22.9 s. τ_burst = 96.2 mN·m (DB Core 56.2 + S Gear 40.0). Inertia: Nexus 60.4%, Armor 2 17.0%, VS Gear 4.8%, S Gear 3.5%, Blade 7.8%, DB Core 5.7%, Venture 0.9%. Four gear configs: (A) base 64.6 g t=15.5 s; (B) S+VS 76.5 g t=22.9 s; (C) F+S+VS 82.2 g t=17.5 s; (D) L+S+VS 92.0 g t=24.8 s L₀=2.804×10⁻².  
**Engine Note**: assembly inertia summation; gear configuration enumeration; L₀ comparison reference.

---

### [Case 534 — DB Core Belial 2 (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-534)

**System**: Dynamite Battle / Burst Ultimate DB Core — Overdrive System  
**Geometry**: annular · r_i = 1.0 cm · r_o = 2.2 cm  
**Material**: ABS · right-spin  
**Mechanism**: Overdrive System: centrifugal tab (m_tab = 0.5 g, r_tab = 5 mm, k_spring = 1000 N/m) locks at ω_crit = 447 rad/s → infinite burst resistance above 447 rad/s (first 59.4% of battle). Below 447: standard τ = 56.2 mN·m (4 tabs). BU Lock grooves present (compatible with Xanthus/Moon discs only). I = 2.365 × 10⁻⁶ kg·m².  
**Engine Note**: centrifugal lock threshold (ω_crit formula); two-phase burst model (infinite → standard); BU Lock disc compatibility flag.

---

### [Case 535 — Blade Dangerous (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-535)

**System**: Dynamite Battle / Burst Ultimate BU Blade  
**Geometry**: 3-wing trefoil · r_hub = 1.2 cm · r_tip = 2.8 cm · θ_sweep = 35°  
**Material**: ABS with hard rubber inserts at wing tips (μ_rubber = 0.50)  
**Contact Points**: r_tip = 2.8 cm · rubber contact · F_repel = 6.14 N per 15 N contact · coverage = 33%  
**Mechanism**: Three wings with rubber inserts at tips only; contact coverage ≈ 33% arc (gaps ≈ 80° each). F_repel = +42.8% vs bare ABS. I_Dan = 4.640 × 10⁻⁶ kg·m² (+93.2% vs Dynamite). F Gear ~50% effective due to gap curvature mismatch (vs 90% on Dynamite). L Gear same as Dynamite (High Mode only).  
**Engine Note**: rubber tip repel force; partial arc coverage; gap curvature compatibility flag.

---

### [Case 536 — Performance Tip Almight + S Gear + D Gear + V Gear (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-536)

**System**: Dynamite Battle / Burst Ultimate — Disc-Integrated Driver  
**Geometry**: outer disc r_o = 3.6 cm · r_i = 0.8 cm · hole-flat tip r = 0.15 cm (fixed mode)  
**Material**: polycarbonate + ABS; POM bushing μ = 0.04 (free-spin mode)  
**Spin Coupling**: partial — launch-power-triggered latch: strong = fixed hole-flat; light = free-spinning tip  
**Mechanism**: Strong launch: μ = 0.15, r = 1.5 mm → dω/dt = −4.15 rad/s², t = 100 s. Free-spin: body I = 7.005 × 10⁻⁶, dω_body/dt = −9.25 rad/s², t_body = 45 s (disc LAD continues). I_Almight = 2.591 × 10⁻⁵ kg·m² (highest single non-chassis component). S Gear (4 grooves): τ_fixed = 20.0 mN·m; V Gear: r_LAD 24 → 28 mm (+16.7%).  
**Engine Note**: launch-power latch (two modes); disc-integrated driver; free-spin body vs disc split; LAD radius from V Gear.

---

### [Case 537 — Assembly: Dangerous Belial Almight (Perfect Gear)](./9%20case%20study.md#case-537)

**System**: Dynamite Battle / Burst Ultimate — full assembly analysis  
**Mechanism**: S Gear (free-spin) + V Gear on Almight. m = 66.1 g; I_total = 3.518 × 10⁻⁵ kg·m²; L₀ = 2.441 × 10⁻² kg·m²/s (96.2% of Glide Ragnaruk). Strong launch: t = 100 s (series maximum for right-spin). Free-spin: t_body = 45 s + disc LAD. Almight 73.7% of I. Overdrive (Belial 2) covers 59.4% of battle with infinite burst resistance; below 447 rad/s τ = 56.2 mN·m. No separate Armor (H Gear replaces).  
**Engine Note**: dual-mode launch spin-decay fork; disc-LAD independent tracking after body stop; Overdrive burst phase boundary.

---

### [Case 538 — DB Core Belial 3 (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-538)

**System**: Dynamite Battle / Burst Ultimate DB Core — Enhanced Overdrive  
**Geometry**: annular · r_i = 1.0 cm · r_o = 2.0 cm  
**Material**: ABS · right-spin  
**Mechanism**: Overdrive System (m_tab = 0.6 g, heavier) → ω_crit = 408 rad/s (68.6% coverage, +9.4 pp vs Belial 2). Below 408 rad/s: 3 thick mechanical locks k = 2000 N/m → τ = 75.6 mN·m (+34.5% vs Belial 2). BU Lock present (inactive with Nexus disc). I = 1.975 × 10⁻⁶ kg·m².  
**Engine Note**: enhanced ω_crit from heavier Overdrive tab; three-lock low-spin fallback; BU Lock compatibility flag.

---

### [Case 539 — BU Blade Divine + A Gear + H Gear (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-539)

**System**: Dynamite Battle / Burst Ultimate BU Blade  
**Geometry**: 3 short metal-insert wings · r_tip = 2.5 cm · r_hub = 1.2 cm  
**Material**: ABS with metal inserts at wing tips  
**Gimmick**: A Gear (4.4 g, Achilles lineage): 3-Blade Mode (under wings, attack reinforcement) or 6-Blade Mode (in gaps, height mismatch, < 20% effective). H Gear (15.2 g = 3.7 g plastic + 11.5 g metal): Low Mode (plastic outer, I_plastic = 1.312 × 10⁻⁶) or High Mode (metal outer at r = 27 mm, I_metal = 6.055 × 10⁻⁶); I_HGear = 7.367 × 10⁻⁶ kg·m² (vs L Gear 9.486 × 10⁻⁶, −22.3%). H Gear replaces separate Armor and provides Low/High mode switching flexibility. I_Divine = 3.614 × 10⁻⁶ kg·m².  
**Engine Note**: A Gear 3-blade vs 6-blade mode selection; H Gear Low/High mode inertia switch; Armor slot replaced by H Gear.

---

### [Case 540 — Forge Disc Nexus in Divine Belial Context (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-540)

**System**: Dynamite Battle / Burst Ultimate — cross-reference Case 531  
**Mechanism**: Nexus used bare (no Evolution Gear) in Divine Belial combo. No S/D Gear → zero disc burst contribution. Not BU-Lock-compatible → Belial 3 BU Lock inactive. Stamina role: clean high-I disc. Assembly share: 1.867 × 10⁻⁵ / 3.599 × 10⁻⁵ = 51.9%. Full Nexus analysis in Case 531.  
**Engine Note**: cross-reference flag; BU Lock inactive when disc incompatible; clean disc = zero disc τ_burst.

---

### [Case 541 — Performance Tip Bearing Drift (Dynamite Battle / Burst Ultimate)](./9%20case%20study.md#case-541)

**System**: Dynamite Battle / Burst Ultimate Performance Tip  
**Geometry**: octagonal outer body r_o = 2.8 cm · conical tip (free-spin via ball bearings) r_shaft = 0.3 cm  
**Material**: polycarbonate; ball bearings μ_bearing = 0.015  
**Spin Coupling**: free — ball-bearing-supported inner tip  
**Mechanism**: τ_bearing = 0.015 × 0.0734 × 9.81 × 0.003 = 3.239 × 10⁻⁵ N·m → dω/dt = −0.900 rad/s², t = 462 s (series maximum, +77.7% vs Never at 260 s). Octagonal LAD: r oscillates 25.9 ↔ 28.0 mm per 45° cycle. KO weakness: F_lat = 0.011 N (7.5% of standard flat) — highly susceptible to knock-out. I = 4.367 × 10⁻⁶ kg·m².  
**Engine Note**: ball-bearing friction model (μ = 0.015); octagonal LAD r-oscillation; KO susceptibility flagged.

---

### [Case 542 — Assembly: Divine Belial Nexus Bearing Drift (1 Gear — H Gear)](./9%20case%20study.md#case-542)

**System**: Dynamite Battle / Burst Ultimate — full assembly analysis  
**Mechanism**: H Gear replaces Armor. m = 73.4 g; I_total = 3.599 × 10⁻⁵ kg·m²; L₀ = 2.498 × 10⁻² kg·m²/s (98.4% of Glide Ragnaruk). t = 462 s (series maximum). Inertia: Nexus 51.9%, H Gear 20.5%, Bearing Drift 12.1%, Divine 10.0%, Belial 3 5.5%. Burst: Overdrive 694 → 408 rad/s (68.6%, infinite); below 408 τ = 75.6 mN·m. No BU Lock. KO risk: F_lat = 0.011 N (very high).  
**Engine Note**: ball-bearing stamina profile; KO risk flag; Overdrive phase coverage.

---

### [Case 543 — Tornado Wyvern 4Glaive Atomic (God Layer System)](./9%20case%20study.md#case-543)

**System**: God Layer System — Defense assembly  
**Geometry**: Energy Layer r_o = 2.2 cm · Forge Disc 4 r_o = 3.0 cm · Disc Frame Glaive r = 2.8–3.4 cm · Atomic tip r_ball = 0.65 cm  
**Material**: ABS/PC · free-spinning ring on Layer; rolling ball on Atomic  
**Spin Coupling**: partial — outer ring free-spins vs right-spin attackers  
**Contact Points**: 4 PC cantilever tabs r_tab = 0.7 cm; blade arc coverage = 160° (44.4%); gap = 55.6%  
**Mechanism**: Free-spinning ring absorbs 85% of burst torque vs right-spin → τ_eff_rs = 129 mN·m equivalent. Gap contacts (P = 55.6%) bypass ring → τ_burst_base = 19.4 mN·m. Weighted τ = 68.0 mN·m. Atomic ball (μ = 0.03): t = 82.9 s mid-tier stamina. Glaive LAD at r_LAD = 31 mm. m = 40.05 g; I = 1.531 × 10⁻⁵ kg·m²; L₀ = 9.186 × 10⁻³ kg·m²/s.  
**Gimmick**: Free-spinning ring burst absorption — probability-weighted burst threshold model.  
**Engine Note**: free-spin ring gap probability; weighted burst threshold (P_gap × τ_base + P_ring × τ_eff); rolling ball friction; Glaive LAD geometry.

---

### [Case 544 — Jet Wyvern Around Just 1D (Superking / Sparking)](./9%20case%20study.md#case-544)

**System**: Superking / Sparking Layer System — Defense-Balance assembly  
**Geometry**: Ring Jet r_i = 1.5 cm · r_o = 2.3 cm · Chassis 1D r_o = 1.7 cm · Forge Disc Around r_o = 3.3 cm (4 balls) · Just tip r_flat = 0.8 cm / r_ring = 1.4 cm  
**Material**: ABS/rubber Ring Jet; free-spinning balls on Around (μ_roll = 0.02); ABS flat + free-spin ring on Just  
**Spin Coupling**: partial — Ring Jet free-spins vs right-spin; Around balls roll for LAD; Just ring free-spins in Phase 2  
**Mechanism**: τ_burst_raw = 14.4 mN·m (3 Wyvern tabs); Ring Jet absorbs 80% vs right-spin → τ_eff_rs = 72.0 mN·m; 60% vs left-spin → τ_eff_ls = 36.0 mN·m. Around disc (I = 1.557 × 10⁻⁵, 70.5% of I): ball LAD 7.74× less friction vs standard slide. Just Phase 1 (ω > 350): wide flat μ = 0.35 → t_P1 = 5.0 s aggressive orbit. Phase 2 (ω < 350): free-ring μ = 0.02 → t_P2 = 47.1 s. t_total = 52.1 s. m = 59.7 g; I = 2.209 × 10⁻⁵; L₀ = 1.325 × 10⁻² kg·m²/s.  
**Gimmick**: Rubber-blade burst absorption (Ring Jet) + rolling-ball LAD (Around) + two-phase tip (Just).  
**Engine Note**: probability-weighted ring burst model; ball-roll LAD friction (μ = 0.02); two-phase tip spin-decay transition at ω_threshold = 350 rad/s; Awakened Just variant flag.

---

## CS10 — Cases 545–685 {#cs10}
Source: `10 case study.md`

---

### [Case 545 — BeyStadium Attack Type (MFB)](./10%20case%20study.md#case-545)

**Arena Type**: Class A — standard bowl  
**Geometry**: R_outer = 17.0 cm · 5 zones (flat 0–4 cm, main slope 4–12.5 cm, secondary slope 12.5–15.5 cm, pocket rim 15.5–17.0 cm)  
**Surface**: ABS · μ_k = 0.17 · ε = 0.70  
**Tornado Ridge**: h_TR = 0.3 cm at r = 12.5 cm · β = 16.7°  
**Key Physics**: P(ejection) = 49.2% per contact · v_escape = 0.483 m/s · α_D = 8.5 rad/s² (flat zone) · t_orbit = 1.8 s at r = 10 cm. MFB I_ref = 7.308 × 10⁻⁶ kg·m².  
**Engine Note**: 5-zone bowl model; P(ejection) from pocket geometry; Tornado Ridge inward impulse; orbit period formula.

---

### [Case 546 — Tornado Ridge (Physics Comparison)](./10%20case%20study.md#case-546)

**Arena Type**: Feature analysis — cross-generation  
**Key Physics**: MFB h_TR = 0.3 cm (β = 16.7°) gives 35.4% more inward impulse than Plastic h_TR = 1.0 cm (β = 45°) — shallower ridge more efficient because impulse = F_N × sin(β) × contact_time, and contact time is longer on shallow ridge. Gen 1 ridge launches bey upward; MFB ridge deflects inward. Generation-specific trajectory models.  
**Engine Note**: ridge angle vs contact time trade-off; inward vs upward impulse decomposition.

---

### [Case 547 — Sliding Shoot Technique](./10%20case%20study.md#case-547)

**Arena Type**: Launch mechanics  
**Key Physics**: Entry angle 10–20° to arena wall. v_centre ≈ 2.6–2.8 m/s vs radial 1.3–1.5 m/s (+77–87%). Sliding shoot uses arena wall contact to convert lateral velocity into orbital kinetic energy; effective r_orbit = 11–13 cm for optimal sliding angle. beyTiltAngle set to ~10° at entry for wall ride.  
**Engine Note**: sliding angle → orbital velocity conversion; beyTiltAngle = entry angle; wall-contact velocity amplification.

---

### [Case 548 — BX-10 Xtreme Stadium](./10%20case%20study.md#case-548)

**Arena Type**: Class B — gear-rail (Beyblade X)  
**Geometry**: 43 × 44 cm square outer · Battle Zone ∅ 36.5 cm · front-only exit · Xtreme Zone chord = 19 cm · Over Zone chord = 12 cm each  
**Surface**: ABS · μ_k = 0.17 · ε_wall = 0.75  
**Key Physics**: Square outer eliminates orbital paths. Front exit only → P(exit) biased toward front 120° arc.  
**Engine Note**: square outer = no orbit; front-exit geometry; Xtreme/Over Zone chord dimensions.

---

### [Case 549 — BX Xtreme Line](./10%20case%20study.md#case-549)

**Arena Type**: Class B feature  
**Geometry**: gear rack at R_XL = 10.5 cm  
**Key Physics**: X-Dash driver F_drive = 0.919 N · v_post = 4.0 m/s · T = 0.165 s per orbit. Non-X-Dash beys skip the rack (no gear engagement) — no speed boost.  
**Engine Note**: gear-rack drive force model; post-rack velocity; orbit period with gear assist.

---

### [Case 550 — Over Zone vs Xtreme Zone](./10%20case%20study.md#case-550)

**Arena Type**: Class B — BX exit zone analysis  
**Key Physics**: P(OZ|front exit) = 55.1% · P(XZ|front exit) = 44.9%. X-Dash gear engagement guarantees Xtreme Zone pass per orbit. Over Zone exit = ring-out loss; Xtreme Zone = X-Dash speed boost + continue. Exit probability shifts with launch position and orbit speed.  
**Engine Note**: exit zone probability model; X-Dash guaranteed XZ pass; zone geometry from Case 548.

---

### [Case 551 — Gen 1–3 Tops in Xtreme Stadium](./10%20case%20study.md#case-551)

**Arena Type**: Class B — cross-generation  
**Key Physics**: No gear engagement for Gen 1–3 beys (no X-Dash). Combined spin decay α = 22.0 rad/s² (higher friction from ABS square floor). t_crit = 16.4 s before functional spin-out (vs 25.5 s in MFB Attack Type). P(self-ring-out|orbit) elevated due to higher speed + no gear brake.  
**Engine Note**: cross-gen tip compatibility; no-rack spin decay model; t_crit comparison.

---

### [Case 552 — Wide Xtreme / Infinity Stadium](./10%20case%20study.md#case-552)

**Arena Type**: Class B variant — oval  
**Geometry**: oval bowl r_min = 15 cm · r_max = 23 cm  
**Key Physics**: X-Dash drive force varies ±53.4% between short/long axis orbit. Asymmetric gear engagement: long-axis passes provide 1.53× more drive impulse than short-axis passes. Orbital period 0.18–0.27 s depending on axis.  
**Engine Note**: oval orbit asymmetry; gear rack engagement length vs axis; F_drive variation model.

---

### [Case 553 — Ultimate Beyta Stadium](./10%20case%20study.md#case-553)

**Arena Type**: Class C — motorised  
**Geometry**: 73.7 × 43.2 cm · Motor Spin Station r = 3.5 cm · F_trap = 0.80 N  
**Key Physics**: MSS at 500 RPM (Ω = 52.4 rad/s). Levitation equilibrium at v_bey = 1.01 m/s (centrifugal = inward trap force). Beys faster than 1.01 m/s escape MSS; slower are trapped and spun. Motor adds Δω = 52.4 rad/s to captured bey per second of trap.  
**Engine Note**: motor trap force model; levitation equilibrium speed; Δω from motor contact.

---

### [Case 554 — Gen 1 Magnacore System](./10%20case%20study.md#case-554)

**Arena Type**: Arena feature — magnetic  
**Geometry**: SG Core at h = 1.4 cm  
**Key Physics**: F_magnet = 68% floor normal. Attraction mode: +68% spin decay (magnets pull tip into floor). Repulsion mode: F_repel = 0.68 × N_floor → tip lifts → Magne Flat levitates at h_float ≈ 0.209 cm reducing contact friction by ~85%. Repulsion mode extends stamina 3.13× vs standard.  
**Engine Note**: magnetic force as fraction of normal; levitation height h_float; two-mode spin-decay toggle.

---

### [Case 555 — Steel Spring Coils in Magnetic Fields](./10%20case%20study.md#case-555)

**Arena Type**: Part physics — EG spring + Magnacore  
**Key Physics**: EG spring coils attract to Magna WD steel field; ω_trigger raised by 3.1% (spring engages later than spec). Gen 3 driver springs near MSS (Ultimate Beyta) get +11.3% additional normal force from magnetic attraction → increased spin decay near motor station.  
**Engine Note**: spring-steel magnetic attraction; ω_trigger shift; MSS proximity normal force augmentation.

---

### [Case 556 — Gen 1 EG Energy Budget](./10%20case%20study.md#case-556)

**Arena Type**: Part physics — Energy Gear  
**Key Physics**: EG stored energy E = 48 mJ → Δω = 53.4 rad/s on release. Ignition' motor L = 3.0 × 10⁻³ N·m·s → Δω = 392 rad/s (8× EG). Shot driver elastic restitution ε_eff = 1.106 (energy from internal spring exceeds collision input). EG is primarily a burst-resistance mechanism; spin-boost is secondary.  
**Engine Note**: EG spring energy → Δω formula; Ignition motor angular impulse; Shot driver super-elastic restitution.

---

### [Case 557 — F:D Final Drive Bottom](./10%20case%20study.md#case-557)

**Arena Type**: Part physics — tip  
**Key Physics**: Mode switch at ω_switch = 94.3 rad/s. High-spin: wide tip α = 34.7 rad/s², t_high = 5.93 s. Low-spin: sharp tip α = 4.0 rad/s², t_low = 23.6 s. t_total = 29.5 s (2.59× longer than standard D). Automatic centrifugal transition — no user input. First 5.93 s attack phase; remaining 23.6 s stamina phase.  
**Engine Note**: centrifugal mode switch (ω_switch formula); two-phase spin-decay; total stamina = sum of both phases.

---

### [Case 558 — BBA Stadium (White Stadium)](./10%20case%20study.md#case-558)

**Arena Type**: Class A — Gen 1 standard  
**Geometry**: 29.0 × 29.0 cm · R_bowl = 12.5 cm · R_flat = 5.5 cm · slope = 38.1° · 4 corner pockets  
**Surface**: ABS · μ_k = 0.17 · ε = 0.70  
**Key Physics**: P(ejection) = 33.1% per contact · 4 corner pockets vs MFB's continuous rim pocket · slope 38.1° vs MFB 16.7° (steeper → more inward return, lower P(ejection)).  
**Engine Note**: 4-pocket vs continuous rim geometry; steeper slope reduces ejection probability; Gen 1 ABS standard parameters.

---

### [Case 559 — Field of Doom (Baseball Stadium)](./10%20case%20study.md#case-559)

**Arena Type**: Anime — asymmetric outdoor  
**Geometry**: Asymmetric walls — high/left H = 9.0 cm · low/right H = 3.0–4.0 cm  
**Surface**: μ_grass = 0.35–0.40 · μ_mud = 0.55–0.70 · chain-link net ε = 0.40–0.55  
**Key Physics**: Left-side high wall returns beys; right-side low wall = easy ring-out. Mud zones (wet outfield) increase spin decay 2.0–2.6× vs grass. Net collision absorbs 45–60% of kinetic energy per contact.  
**Engine Note**: asymmetric wall height → ring-out bias; mud friction zone; net energy absorption model.

---

### [Case 560 — Blizzard Bowl (Ice)](./10%20case%20study.md#case-560)

**Arena Type**: Anime — large ice outdoor  
**Geometry**: ∅ 200 cm · 52 pine trees at irregular positions  
**Surface**: μ_ice = 0.03–0.05 · ε_ice = 0.85  
**Key Physics**: t_spin = 137 s (2.3× BBA White Stadium). P(pass-through gap between trees) ≈ 23.3% per pass. Very low friction → orbit speed maintained; trees deflect attackers unpredictably.  
**Engine Note**: ice friction model; tree obstacle P(gap) geometry; extended stamina vs ABS baseline.

---

### [Case 561 — R.P.M. Dish](./10%20case%20study.md#case-561)

**Arena Type**: Anime — exponential-profile dish  
**Geometry**: ∅ 60 cm · central disc r = 10 cm growing exponentially  
**Key Physics**: Ejection threshold Ω_eject = 8.85 rad/s (dish rotation at which centrifugal force exceeds friction). P(channel exit) = 8.5% per orbit in radial channels. Stamina advantage: slow orbits below Ω_eject threshold survive; attack types overspeed and exit channels.  
**Engine Note**: rotating-dish ejection model (ω_eject formula); radial channel exit probability; centrifugal vs friction balance.

---

### [Case 562 — Black Sea Bowl](./10%20case%20study.md#case-562)

**Arena Type**: Anime — 4-zone water/harbour  
**Geometry**: ∅ 200 cm · 4 concentric zones: water, bank, road, wall  
**Key Physics**: Whirlpool Ω(t) = 0.5 × e^(0.08t) rad/s (grows over match). F_wave = 9.81 N on road zone per wave event. Water viscous k = 0.35 s⁻¹ → t_spinout = 11.8 s in deep zone. Whirlpool-assisted orbit vs counter-orbit penalty ±60%.  
**Engine Note**: exponential whirlpool growth; wave impulse force; water viscous decay model from Case 566.

---

### [Case 563 — BBA V-Force Tower Arena](./10%20case%20study.md#case-563)

**Arena Type**: Anime — hemispherical bowl  
**Geometry**: hemispherical bowl R_sphere = 102.5 cm · platform at rim  
**Key Physics**: N(φ) = mg/cos(φ) — normal force increases to 4.56 × mg at rim angle φ = 77°. P(ring-out|rim contact) = 7.2%. 10-second platform hold = alternate win condition. Hemispherical profile: orbit speed must increase with latitude to maintain contact.  
**Engine Note**: hemispherical N(φ) formula; alternate win condition (platform hold); P(ring-out) at rim latitude.

---

### [Case 564 — Roman Colosseum Arena](./10%20case%20study.md#case-564)

**Arena Type**: Anime — tiered stone  
**Geometry**: 3 × 3 m · 8 concentric steps · H_step = 10 cm · w_ring = 19 cm  
**Surface**: μ_brick = 0.28 · ε = 0.62  
**Key Physics**: No ring-out exits (spin-out only). Step impact vertical Δv component launches bey upward; step α_decay = (0.28 × 9.81 × r_tip) / I. 8-ring arena = 8 different orbit radii with distinct spin-decay zones.  
**Engine Note**: closed arena (spin-out only); step-impact vertical launch; multi-ring orbit radius model.

---

### [Case 565 — Cityscape Bowl](./10%20case%20study.md#case-565)

**Arena Type**: Anime — urban obstacle  
**Geometry**: ∅ 240 cm · alley width w = 0.8–1.2 cm  
**Key Physics**: 11.2% speed loss per alley pass · 39.2% speed loss per 90° corner turn · Line-of-sight blocked → attack reach reduced to 31% of open-stadium. Stamina types orbit open plazas; attack types lose speed navigating alleys.  
**Engine Note**: alley friction penalty; corner speed loss; LoS attack reach reduction.

---

### [Case 566 — New Jersey Turnpike Dish](./10%20case%20study.md#case-566)

**Arena Type**: Anime — oval road  
**Geometry**: 240 × 180 cm oval · curb height threshold 1.40 m/s  
**Key Physics**: v_min_loop = 3.706 m/s for wall-ride loop completion. Curb fall at v < 1.40 m/s → water zone contact. Water viscous k = 0.35 s⁻¹ → t_spin = 11.8 s. Oval asymmetry: short-axis orbits faster, long-axis slower — speed oscillates ±24% per orbit.  
**Engine Note**: loop-completion minimum speed; curb threshold; water viscous decay; oval speed oscillation.

---

### [Case 567 — Great Wall of China Bowl](./10%20case%20study.md#case-567)

**Arena Type**: Anime — corridor/wall  
**Geometry**: 300 × 150 cm · corridor w = 22 cm · 3 slope gradients  
**Key Physics**: Crenellation exit P = 50% per wall-climb event. Arch clips at tilt > 53°. Three slope zones: flat (μ_stone = 0.30), medium (35°, μ = 0.30), steep (55°). Stamina types stay in wide lower corridor; attack types must navigate narrow arch passage.  
**Engine Note**: P(crenellation exit) per wall-climb; arch tilt-clip threshold; 3-gradient slope model.

---

### [Case 568 — Tsunami Stadium (BBA G-Revolution)](./10%20case%20study.md#case-568)

**Arena Type**: Anime — 4-zone water/island  
**Geometry**: 280 × 200 cm oval · 3 islands (Main 120 × 80 cm, Rocky Isle 50 × 35 cm, Sand Spit 35 × 18 cm)  
**Surface**: 4 water zones W1–W4; μ_sand = 0.45 (dry); μ_rock = 0.32; ε_tree = 0.00  
**Key Physics**: W1 μ_eff = 0.55 (wet sand, α_D = 54.1 rad/s²); W2 μ_eff = 0.36 (α_D = 35.4 rad/s²); W3 viscous k = 0.12 s⁻¹ (t_survive = 137 s); W4 k = 0.35 s⁻¹ (t_spinout = 11.8 s). Rock face v_min_climb = 1.83 m/s (α_rock = 40°, H_ledge = 12 cm). Tree canopy ε = 0.00 → speed normaliser: any entry speed returns bey at 0.516 m/s after 15 cm fall + ε_sand = 0.30 bounce. P(rescue via pagoda) = n/a (pagodas in Case 570). Stamina dominates (W3 orbit); attack weakest (W4 self-elimination risk).  
**Engine Note**: 4-zone water physics (friction → viscous transition); rock climb v_min formula; tree canopy speed normaliser; island circumnavigation strategy.

---

### [Case 569 — White House Bowl (BBA G-Revolution)](./10%20case%20study.md#case-569)

**Arena Type**: Anime — obstacle + roof platform  
**Geometry**: ∅ 240 cm · White House building 64 × 34 × 10 cm · 18 destructible trees (r = 3.5 cm, H = 12 cm)  
**Surface**: μ_grass = 0.28 · ε_AR = 0.55 · μ_roof = 0.12 · ε_building = 0.68  
**Key Physics**: α_D_grass = 27.4 rad/s²; roof 2.32× less decay (α_D_roof = 11.8 rad/s²). Roof-launch threshold v_corner = 1.668 m/s (blade angle 30°, h_roof = 10 cm). Tree destruction post-speed: v_post = √(v² − 1.515) — absorbs 0.025 J per tree; v_min = 1.23 m/s to survive destruction. Bowl ring-out threshold v_rim = 2.071 m/s (slope 40°, H_rim = 28 cm). Building face bounce: v_out = v_in × √(ε² cos²θ + sin²θ).  
**Engine Note**: destructible obstacle energy budget; roof-launch vertical impulse; bowl ring-out threshold (40° slope); grass vs roof friction ratio.

---

### [Case 570 — Sand Pagoda Bowl (BBA G-Revolution)](./10%20case%20study.md#case-570)

**Arena Type**: Anime — 3-level terraced  
**Geometry**: ∅ 200 cm total · R_arena = 100 cm · 3 levels at h = 0/20/40 cm · Ramps 55° · Outer metal wall h = 40–60 cm  
**Surface**: Sand floor μ = 0.45 + plough (α_D = 55.0 rad/s²); rock μ = 0.32; metal wall μ = 0.10 ε = 0.85  
**Key Physics**: v_min_ramp = 2.191 m/s to ascend each 55° ramp (H = 20 cm). Sand floor α_RF = 73.4 rad/s² (worst tip); α_S = 18.2 rad/s² (t_spin = 110 s). Pagoda towers × 3 (r_base = 4 cm, H = 25 cm) at r = 13 cm, 120° apart. P(pagoda intercept per fall) = 29%; P(recovery | pagoda hit) = 38% → P_rescue_net = 11%. Metal wall: no ring-out exits.  
**Engine Note**: 3-level climb model; sand floor plough drag; pagoda rescue probability; no-exit metal wall.

---

### [Case 571 — Forbidden City Dish (BBA Season 1)](./10%20case%20study.md#case-571)

**Arena Type**: Anime — polished stone oval  
**Geometry**: 200 × 150 cm oval · platform H = 8 cm · ramp α = 20° · gate arch 10 × 8 × 12 cm  
**Surface**: μ_floor = 0.12 · ε_floor = 0.75 · μ_ramp = 0.14 · ε_wall = 0.72  
**Key Physics**: g_lat = 0.855 m/s² (α_dish = 5°). α_D_floor = 3.61 rad/s² → t_spin = 554 s (functionally unlimited). Ramp climb threshold v_min = √(2 × g × H_platform × (1 + μ_ramp × cos20° / sin20°)) ≈ 1.82 m/s. Platform H = 8 cm → height advantage on descent. Arch tilt clip at large tilt angles.  
**Engine Note**: ultra-low friction floor; ramp climb threshold; platform height advantage; arch passage tilt limit.

---

### [Case 572 — Tree Stump Bowl (BBA Season 1)](./10%20case%20study.md#case-572)

**Arena Type**: Natural — hand-carved wood  
**Geometry**: ∅ 100 cm · bowl depth 4.0 cm · 12+ annual ring ridges h = 0.1–0.35 cm · Score rock protrusion 4 cm deep × 8 cm wide  
**Surface**: μ_wood = 0.28 (heartwood) · μ_ring = 0.38 (ring ridges) · ε_rim = 0.55  
**Key Physics**: g_lat = 0.782 m/s² (α_dish = 4.57°). Ring ridges cause radial impulse on crossings; gap arcs 10–20% of each ring circumference create unpredictable deflections. Score rock shifts ring-out P toward opposite side. High-frequency collision arena (R = 50 cm, no orbit room for attackers).  
**Engine Note**: ring ridge step impulse; gap arc probability; score rock asymmetry; small-arena close-combat model.

---

### [Case 573 — Brick Courtyard Rain Bowl (BBA Season 1)](./10%20case%20study.md#case-573)

**Arena Type**: Outdoor — dynamic water accumulation  
**Geometry**: 140 × 100 cm oval · D = 7.5 cm deep (paraboloid) · mortar joints 8 cm grid h = 0.15 cm  
**Surface**: μ_dry = 0.32 · μ_wet = 0.38 · ε_rim = 0.60  
**Key Physics**: g_lat_rim = 1.027 m/s² (α_dish = 6°). Rain fills from centre outward: dry zone a_dry(t) = 70 × √(1 − h_w/7.5) cm. Viscous k = 0.18 s⁻¹ at h_w = 3 cm → t_spinout = 21.5 s in submerged zone. Mortar bumps impose periodic 0.15 cm lateral impulses. Arena shrinks from centre — stamina types stranded last as dry zone contracts.  
**Engine Note**: dynamic water accumulation model; shrinking dry zone formula; mortar bump impulse; depth-dependent viscous drag.

---

### [Case 574 — Blizzard Bowl (Outdoor Blizzard)](./10%20case%20study.md#case-574)

**Arena Type**: Outdoor — dynamic snow accumulation  
**Geometry**: ∅ 120 cm · D = 8.0 cm · 4 radial snow zones  
**Surface**: μ_ice = 0.08 (bare centre) → μ_snow = 0.22/0.38/0.55 by depth (0–5/5–15/>15 mm)  
**Key Physics**: g_lat_rim = 1.295 m/s² (α_dish = 7.59°). Snow thickest at rim → arena shrinks inward (opposite to rain bowl). Wind gust F = 0.15–0.45 N lateral (speed 8–15 m/s). Avalanche: arc 60°, h_dump = 25 mm, triggers every ~30 s at random azimuth. End-of-match wobbling beys most vulnerable to wind KO (large tilt silhouette).  
**Engine Note**: reverse-shrink dynamic arena (rim builds up first); wind lateral force on wobbling beys; avalanche random patch; 4-zone snow friction model.

---

### [Case 575 — Wok Arena (Improvised)](./10%20case%20study.md#case-575)

**Arena Type**: Improvised — carbon steel spherical segment  
**Geometry**: ∅ 64 cm · R_sphere = 38 cm · bowl depth 17.5 cm · handle notch arcs 40 mm at 180°  
**Surface**: μ_steel = 0.10 (centre) → 0.15 (walls) · ε_steel = 0.85 · notch h = 3 mm  
**Key Physics**: Wall angle: 15.3° at r = 10 cm → 57.3° at rim r = 32 cm. g_lat varies from 2.60 m/s² (r = 10 cm) to 8.21 m/s² (rim) — strongest inward containment of any arena. Pedestal rocks at J > 0.08 N·s → 1–3° dynamic tilt for 0.3–0.8 s. Handle notch deflection: 3 mm step sends bey laterally at contact.  
**Engine Note**: spherical bowl g_lat(r) profile; pedestal tilt as collision response; handle notch step deflection; high ε_steel elastic rim.

---

### [Case 576 — Obstacle Dish / Seaside Dome](./10%20case%20study.md#case-576)

**Arena Type**: Anime — obstacle-filled concave bank  
**Geometry**: ∅ 200 cm · wall H = 100 cm · skate-bowl profile (15° → 75° near rim) · 8 obstacle categories (stone spikes, floor blocks, wall blocks, logs, divider plates, metal rods)  
**Surface**: μ_floor = 0.28 · μ_wall = 0.32 · ε_wall = 0.65 · obstacle coverage ≈ 18% floor + 12% wall  
**Key Physics**: Wall climb: a_slope = g × (sin α + μ_wall cos α). At α = 45°: v_min = √(2 × a_slope × H_block) where H_block = 8 cm → v_min ≈ 1.55 m/s to mount block. Wall-mounted blocks produce 3D rebound (radial + vertical). Log r = 7.5 cm: rideable surface at shallow approach angle. Metal rod: narrow (r < 1 cm) → tip-miss probability 85% per pass.  
**Engine Note**: 3D wall-block rebound geometry; block-mount speed threshold; rod-miss probability; continuous bank g_lat(z) profile.

---

### [Case 577 — Moon Base Trampoline Arena (BBA Season 1)](./10%20case%20study.md#case-577)

**Arena Type**: Anime — lunar gravity  
**Geometry**: ∅ 240 cm · bowl depth 5 cm · central tower r = 30 cm H = 35 cm (conical γ = 25°)  
**Surface**: μ_floor = 0.12 · ε_floor = 0.80 · g_moon = 1.625 m/s²  
**Key Physics**: α_moon = α_earth / 6.033 → D-tip α = 0.599 rad/s² (t_spin = 3339 s); S-tip α = 0.160 rad/s² (t_spin = 12 500 s — functionally immune). Bowl g_lat = 0.0677 m/s² → v_orbit_rim = 0.285 m/s; attack types travel at 5–10× orbital speed → self-ring-out dominant. Bounce height 6× Earth equivalent; airtime preserves spin. Tower cone γ = 25° → range = 340 mm per v = 1.0 m/s impact. Ring-out threshold v = 0.793 m/s (any attack-type orbital speed exceeds this).  
**Engine Note**: gravity scaling for all physics (α, h_bounce, t_air, v_orbit); tower cone deflection under lunar g; type ranking inversion (stamina > defense > attack).

---

### [Case 578 — String Launcher: Pull Velocity to ω₀, Energy Budget, and Tilt-Angle Contact Shift](./10%20case%20study.md#case-578)

**Arena Type**: Launch mechanics  
**Key Physics**: ω₀ = v_pull / r_shaft · r_shaft = 1.75 mm · v_pull = 3.0 m/s (competitive) → ω₀ = 1714 rad/s (16 366 RPM). η = 0.85 (efficiency). E_eff = 0.85 × 0.5 × I × ω₀². Tilt contact shift: δh = r_bey × sin(θ_launch); beyTiltAngle = θ_launch at release. Game engine: ω₀ = ω_max × (power_pct / 100).  
**Engine Note**: no-slip constraint; launcher efficiency; tilt contact shift formula; power_pct → ω₀ linear mapping.

---

### [Case 579 — Gear/Winder Launcher: Gear Ratio, Elastic Pre-Tension, and Spin Direction](./10%20case%20study.md#case-579)

**Arena Type**: Launch mechanics  
**Key Physics**: ω₀_gear = G × v_pull / r_shaft. BeyLauncher LR: G = 1.8–2.5 → ω₀ = 3086–4286 rad/s. Winder E_spring = 0.5 × 800 × 0.008² = 0.0256 J → Δω = 83.7 rad/s (~5% bonus). L-spin contact: ω_rel = |ω_att + ω_def| → 2× steal rate vs same-spin.  
**Engine Note**: gear ratio multiplication; elastic pre-tension spring Δω; opposite-spin closing speed formula.

---

### [Case 580 — BX Xtreme Launcher: Peak ω₀ and Cross-Generation L₀ Comparison](./10%20case%20study.md#case-580)

**Arena Type**: Launch mechanics — cross-generation  
**Key Physics**: BX Xtreme Launcher G_eff = 2.8 → ω₀ = 4800 rad/s (45 837 RPM). L₀_BX = 4.0 × 10⁻⁵ × 4800 = 0.192 N·m·s. L₀_MFB_string = 0.0125 N·m·s → ratio 15.4×. BX vs gear-launched Gen 3: ratio 1.92×. First-hit impulse scales linearly with L₀.  
**Engine Note**: highest G_eff (2.8); L₀ cross-generation comparison table; first-hit impulse scaling.

---

### [Case 581 — Tilt Angle Physics: Contact Height Shift, Track Interaction, and Precession Rate](./10%20case%20study.md#case-581)

**Arena Type**: Launch mechanics  
**Key Physics**: δh = r_bey × sin(θ). MFB 145-track: θ = 30° → contact zone 7–18 mm (from 17–28 mm). Ω_p = (m × g × h_CoM) / (I × ω₀). At string launch ω₀ = 1714: Ω_p = 0.568 rad/s (T_p = 11.06 s). At gear launch ω₀ = 4286: Ω_p = 0.227 rad/s (T_p = 27.7 s) → tilt frozen for first ~14 s.  
**Engine Note**: contact height shift formula; precession rate formula; track height interaction; tilt direction frozen at gear-launch speeds.

---

### [Case 582 — Power Percentage: Spin Life Scaling, First-Hit Impulse, and Self-KO Risk](./10%20case%20study.md#case-582)

**Arena Type**: Launch mechanics  
**Key Physics**: ω₀(pct) = ω_max × pct/100; t_spin ∝ pct; E_rot ∝ pct². At 150%: t_spin = 1.5×; E = 2.25×; J_first = 1.5×. ABS recoil at 150% power: v_recoil = 2.55 m/s >> v_escape = 0.483 m/s → P(self-KO) = P(pocket_aligned) at first hit regardless of power. Rubber at 150%: v_recoil = 1.875 m/s — still far exceeds v_escape; rubber advantage appears in multi-hit scenarios.  
**Engine Note**: linear ω₀ / quadratic E scaling; self-KO probability independence from power (at first hit); rubber multi-hit advantage.

---

### [Case 583 — Launch Position: Spawn Radius, Critical Orbit Speed, and Edge-Launch Trajectory](./10%20case%20study.md#case-583)

**Arena Type**: Launch mechanics  
**Key Physics**: spawn_radius = arena_radius × 0.8 × launch_position. MFB AT (R = 17 cm): position 1.0 → spawn_r = 13.6 cm (near Tornado Ridge). v_crit = √(μ_k × g × r): ABS tip at r = 13.6 cm → 0.476 m/s. Edge launch: 1.9 cm to Zone 4 base → wall contact at t = 0.0095 s at v = 2.0 m/s. BX (R = 20 cm): position 1.0 → spawn_r = 16 cm (near Xtreme Line).  
**Engine Note**: spawn_radius formula; critical orbit speed (centripetal balance); edge-launch immediate wall-contact timing.

---

### [Case 584 — Spin Steal × Launch × Bearing Interaction](./10%20case%20study.md#case-584)

**Arena Type**: Combat mechanics  
**Key Physics**: steal = rawSteal × spinStealFactor × (1/spinStealResist) × bearingFriction. bearingFriction = μ_tip / 0.17: B:D → 29.4%; EWD → 70.6%; Rubber → 294% (amplifies). At 150% launch: Δω = 0.5 × ω_max advantage; crossover time t_cross >> match duration → steal advantage persists entire match.  
**Engine Note**: 4-factor steal formula; bearing friction normalisation; high-power launch steal window persistence.

---

### [Case 585 — First-Hit Recoil Kinematics: COR, Material Bounce, and Self-KO Probability](./10%20case%20study.md#case-585)

**Arena Type**: Combat mechanics  
**Key Physics**: Δv_att = −(1+e) × m_def/(m_att + m_def) × v_rel. Equal mass, ABS (e=0.70), v_rel = 3.0 m/s: Δv = −2.55 m/s. Rubber (e=0.25): Δv = −1.875 m/s (26% less). Heavier defender (35 g vs 25 g): ABS Δv = −2.975 m/s. P(self-KO) = P(pocket) × P(v_recoil > v_escape). MFB AT: P(pocket) = 0.492; v_escape = 0.483 m/s → P(self-KO) = 49.2% (first hit always exceeds v_escape).  
**Engine Note**: 1D COR recoil formula; material comparison table; unequal-mass model; self-KO probability decomposition.

---

## CS11 — Cases 586–600 {#cs11}
Source: `11 case study.md`

---

### [Case 586 — Special Move Taxonomy: The Four Physics Archetypes](./11%20case%20study.md#case-586)

**Category**: Special Move meta-physics  
**Key Physics**: Four archetypes — (1) Impulse burst: flat-face AR smash + EG spring release → linear-burst / directional-burst kinds. (2) Gyroscopic anchor: high-I + near-zero μ tip → anchor kind; Ω_p = τ/(I×ω) minimized at high I. (3) Orbital/LAD recovery: bowl-funnel + low-friction tip → orbital kind; F_centripetal = m×v²/r. (4) Spring/upper-attack launch: vertical impulse → aerial-launch / knockup kinds. KE_rot / KE_trans = 102.8:1 at typical MFB speeds — spin energy dominates. J_max = √(2×I×ω₀²×m) = 0.324 N·s per phase.  
**Engine Note**: archetype → kind mapping; rotational vs translational KE ratio; theoretical impulse ceiling.

---

### [Case 587 — Stampede Rush (Linear-Burst): Flat-Face Smash Impulse and EG Spring Augmentation](./11%20case%20study.md#case-587)

**Category**: Special Move physics  
**Bey / Blader**: Attack type  
**Key Physics**: J_face = m_eff × v_approach × (1+e) = 0.020 × 1.8 × 1.67 = 0.0601 N·s. J_smash = J_face × cos(5°) = 0.0599 N·s. EG spring Δv_self = 1.549 m/s → J_EG = 0.0620 N·s. Total J_self = 0.1219 N·s. Game: linearImpulse = 5000 eng-units; knockbackImpulse = 3000; spinDelta = +60; invulnerabilityMs = 200; damageMultiplier = 1.3.  
**Engine Note**: active-window impulse integral; EG spring spinDelta micro-boost; Dash burst invulnerability window.

---

### [Case 588 — Gyro Anchor (Anchor): Gyroscopic Stability, Bearing Core LAD, and Spin-Steal Field](./11%20case%20study.md#case-588)

**Category**: Special Move physics  
**Bey / Blader**: Defense type  
**Key Physics**: μ_bearing = 0.05 → α = 14.6 rad/s² (vs 39.8 hard ABS). Anchor window Δω_saved = (39.8−14.6) × 1.5 = 37.8 rad/s. spinStealRadiusPx = 250 → Δω_drain = 301 rad/s over 1500ms window. Game: spinDelta = +250; invulnerabilityMs = 1500; spinStealRadiusPx = 250.  
**Engine Note**: bearing tip friction model; anchor spin-steal rate derivation; gyroscopic precession vs invulnerability window.

---

### [Case 589 — Spin Recovery (Orbital): LAD Bowl Orbit and Centripetal Force Recovery](./11%20case%20study.md#case-589)

**Category**: Special Move physics  
**Bey / Blader**: Stamina type  
**Key Physics**: g_lat = 9.81 × sin(30°) = 4.905 m/s². v_orbit = √(4.905 × 0.090) = 0.664 m/s. T_orbit = 0.851 s. Bearing tip orbit extension: 3.23 × longer LAD vs ABS. F_centripetal = 0.040 × 0.664² / 0.090 = 0.196 N. Game: spinDelta = +400; centripetal push applied per tick; rangeCheck = "none".  
**Engine Note**: LAD orbital speed/period formula; bearing vs ABS orbit extension; centripetal force applied per tick.

---

### [Case 590 — Tactical Burst (Directional-Burst): Balanced-Type Hybrid at 70% Smash Efficiency](./11%20case%20study.md#case-590)

**Category**: Special Move physics  
**Bey / Blader**: Balanced type  
**Key Physics**: J_balanced = 0.020 × 1.5 × 1.67 × cos(25°) = 0.0454 N·s (75.8% of Stampede Rush). E_recover = 82.2 mJ from AR recoil freewheel. Game: linearImpulse = 3500; knockbackImpulse = 2000; spinDelta = +150; damageMultiplier = 1.10; durationMs = 600; no invulnerabilityMs.  
**Engine Note**: mixed-face AR angle (25°); lower approach speed (1.5 m/s); partial spin recovery from recoil freewheel.

---

### [Case 591 — Shock Pulse (Shockwave): AoE Radial Impulse as Gyroscopic KE Release](./11%20case%20study.md#case-591)

**Category**: Special Move physics  
**Key Physics**: E_aoe = 10% × KE_rot = 0.1316 J. Impulse falloff: J(r) ∝ 1/r²; at r = 150 mm: J = 0.0171 N·s. Game: knockbackImpulse = 6000; aoeRadiusPx = 250; damageMultiplier = 1.2; invulnerabilityMs = 250.  
**Engine Note**: 10% KE radial release model; 1/r² falloff; AoE vs single-target impulse trade-off.

---

### [Case 592 — Ascending Dragon Bite (Knockup / Aerial Multi-Phase): Upper-Attack → Spring-Launch → Airborne Bite](./11%20case%20study.md#case-592)

**Category**: Special Move physics — two phases  
**Key Physics**: Phase 1 φ_upper = 45° → J_vert = 0.0425 N·s → Δv_up = 1.063 m/s → h_max = 57.5 mm, t_air = 217 ms. Phase 2 v_rel_closing = 1.93 m/s → KE advantage (2.11×) → damageMultiplier = 2.0. Fallback at ground level: 1.0×. waitForAirborne = 350ms gate.  
**Engine Note**: two-phase multi-step special; vertical impulse → height/airtime formula; aerial closing speed → damage multiplier.

---

### [Case 593 — Storm Bringer (Aerial-Launch): Self-Launch Parabola, Descent Strike, and Landing AoE](./11%20case%20study.md#case-593)

**Category**: Special Move physics  
**Key Physics**: Δv_up = 1.549 m/s (EG spring) → h_max = 122 mm, t_to_peak = 158 ms. Total arc range ≈ 210 mm. Landing KE = 0.0840 J → v_land = 1.549 m/s. Game: verticalImpulse = 350 (ascent); linearImpulse = 4500 + verticalImpulse = −500 (forced dive); landingAoePx = 200; damageMultiplier = 1.7; landingDmgMult = 1.4.  
**Engine Note**: parabolic arc model from EG spring; landing AoE radius from Spring Core HMS bounce; combined dive + AoE damage.

---

### [Case 594 — Special Move Power Cost and Cooldown Architecture](./11%20case%20study.md#case-594)

**Category**: Special Move design  
**Key Physics**: EG spring reset ~1.0 s → game minimum cooldown 3s (3× safety). Power 100 = full KE = 1.316 J. Cooldown ordering reflects mechanism reset time: single-burst (3s) < anchor (4s) < AoE/aerial (5s). All specials cost 100 (full bar — one-shot EG spring release model).  
**Engine Note**: mechanism reset time → cooldown mapping; power cost = full KE commitment; safety factor per move type.

---

### [Case 595 — Multi-Phase Wind-Up, Active, and Wind-Down Timing: Reaction Windows and Frame Data](./11%20case%20study.md#case-595)

**Category**: Special Move design  
**Key Physics**: windUpMs = preparation (EG charge / spring compress). durationMs = contact window. windDownMs = recovery. peakMs = time of maximum force within active window. Total durationMs range: 300–1500ms (real analog: 2ms hard contact to 1500ms bearing LAD). Game windows 5–750× scaled from real contact durations.  
**Engine Note**: 3-window structure; peakMs physical derivation; game time scaling from real contact durations.

---

### [Case 596 — Special Clash Outcome Matrix: Archetype-vs-Archetype Interaction Physics](./11%20case%20study.md#case-596)

**Category**: Special Move meta  
**Key Physics**: linear-burst vs anchor: smash delivers J = 0.0601 N·s, gyro absorbs as precession → partial block both sides. linear-burst vs linear-burst: equal opposing J → equal knockback. aerial-launch vs anchor: landing AoE fires into invulnerability field → anchor wins if invulnerabilityMs not expired. DEFAULT: both sides 80% damage, −5% spin, partial KB.  
**Engine Note**: clash resolution table keyed on (attacker.kind, defender.kind); DEFAULT_CLASH_OUTCOME fallback.

---

### [Case 597 — Game-Engine Unit Derivation: SI Physics to Engine Parameters](./11%20case%20study.md#case-597)

**Category**: Special Move calibration  
**Key Physics**: 1 eng-unit = 3.60 × 10⁻⁵ N·s (calibrated: J_burst = F_peak × t × η = 12.0 × 0.500 × 0.030 = 0.180 N·s → 0.180/5000). spinDelta: 1 eng-unit = 1 rad/s. knockbackImpulse 3000 → Δv_target = 2.70 m/s. aoeRadiusPx: 1 px ≈ 1 mm. verticalImpulse scale compressed (2.5D engine: z-axis artistic, not 1:1).  
**Engine Note**: impulse unit calibration table; spinDelta direct rad/s; vertical scale compression in 2.5D.

---

### [Case 598 — Beyblade Type to Move Archetype Assignment: Physics-Based Default Mapping](./11%20case%20study.md#case-598)

**Category**: Special Move design  
**Key Physics**: Attack → stampede_rush (highest AR smash impulse, attack stat 150 → damageMultiplier 2.67× combined). Defense → gyro_anchor (highest I → lowest Ω_p → most stable). Stamina → spin_recovery (lowest μ_tip → LAD predisposed). Balanced → tactical_burst (mixed AR, moderate all-stats).  
**Engine Note**: type stat → physical property → move archetype chain; amplification factor per type.

---

### [Case 599 — AI Special Move Activation Thresholds: Hell, Hard, and Medium Decision Physics](./11%20case%20study.md#case-599)

**Category**: Special Move AI  
**Key Physics**: Medium: fire at spin < 40% maxSpin (wobble onset threshold — gyroscope in rapid-precession mode). Hard: 5-tick prediction (83ms); engage at d ≤ 200mm. Hell: fire immediately at power ≥ 100%; combo every ~2s = 2 × T_orbit ≈ 1.70s (attack at each alternate orbit pass).  
**Engine Note**: wobble threshold = AI trigger threshold; prediction horizon 83ms; combo cadence = orbit period multiple.

---

### [Case 600 — Special Move Design Constraints and Balance Ceiling](./11%20case%20study.md#case-600)

**Category**: Special Move design constraints  
**Key Physics**: Impulse ceiling: linearImpulse ≤ 6000 (J_max_phys = 5000 + 20% headroom). spinDelta ceiling: ≤ 600 (ΔKE = 1.315 J ≈ full launch KE). invulnerabilityMs ≤ 1500ms (max anchor duration). damageMultiplier ≤ 2.5. Combos forbidden from: invuln, AoE, spinDelta > 50, damageMultiplier > 1.5 — all require full-bar mechanisms.  
**Engine Note**: parameter min/max table; exclusive-to-specials effects table; power cost gap (35 vs 100) enforces boundary.

---

## CS12 — Cases 601–618 {#cs12}
Source: `12 case study.md`

---

### [Case 601 — Combo System Taxonomy: Three Real Movement Categories for 3-Button Sequences](./12%20case%20study.md#case-601)

**Category**: Combo meta-physics  
**Key Physics**: Three archetypes — directional dash (rubber-tip grip burst → dashDirection, forceImpulse), contact modifier (AR face angle geometry → damageMultiplier), spin interaction (surface-friction angular momentum transfer → spinStealBonus, microSpinBoost). Free combos = naturally occurring; power-cost combos = deliberate spin energy commitment. Combo ceiling: damageMultiplier ≤ 1.5; lockMs ≤ 300ms; invulnMs = 0; spinDelta ≤ 50; max cost 35.  
**Engine Note**: archetype → field mapping; cost tier → physical meaning; combo vs special boundary summary.

---

### [Case 602 — Sequence Detection Window (windowMs): Real-World Input Timing Basis](./12%20case%20study.md#case-602)

**Category**: Combo mechanics  
**Key Physics**: Quarter-orbit at r = 90 mm: T_quarter = 213 ms. windowMs values: 400ms (dash) = 1.7–1.9 × T_quarter; 450ms (mixed) = ~2× T_quarter; 500ms (guard/parry) = ~2.3× T_quarter. maxWindowMs = 600ms = full approach-contact-rebound time at v_min = 0.40 m/s. Sliding-3 window checks last 3 entries within each combo's windowMs.  
**Engine Note**: quarter-orbit derivation; window values in orbit-arc multiples; sliding-3 detection algorithm.

---

### [Case 603 — Quick Dash Left / Right (Free): Rubber-Tip Grip-Burst Lateral Sprint](./12%20case%20study.md#case-603)

**Category**: Combo — directional dash  
**Sequence**: ←←J / →→J  
**Key Physics**: F_grip = μ_rubber × m × g = 0.196 N. t_burst = 150 ms → J_burst = 0.0294 N·s → Δv = 0.735 m/s. ABS tip: Δv = 0.250 m/s (34% of rubber). Game: dashDirection = left/right; durationMs = 300ms; lockMs = 0; cost = 0; cooldownMs = 800ms.  
**Engine Note**: rubber grip-burst velocity formula; ABS vs rubber sprint comparison; cost 0 (passive grip).

---

### [Case 604 — Guard Tap (Free): Gyroscopic Recenter and Anti-Wobble Stance](./12%20case%20study.md#case-604)

**Category**: Combo — defensive  
**Sequence**: KKK  
**Key Physics**: Gyroscopic recenter time T_p = 2π/Ω_p = 2.76 s at ω = 600 rad/s. Guard tap suppresses wobble GROWTH, not complete correction (250ms = 9.1% of one precession cycle). Game: durationMs = 250ms; lockMs = 0; damageMultiplier = 1.0; cost = 0; cooldownMs = 1000ms.  
**Engine Note**: precession period formula; guard tap = partial wobble suppression; cost 0 (gyro recenter needs no energy).

---

### [Case 605 — Feint (Free): Centrifugal Arc-Redirect from Side-Approach Change](./12%20case%20study.md#case-605)

**Category**: Combo — evasive  
**Sequence**: ←→K  
**Key Physics**: F_max = μ_rubber × m × g = 0.196 N. r_min = m × v² / F_max = 0.130 m = 130 mm (fits within 170mm AT bowl). t_reverse = 327ms at rubber-tip. ABS tip r_min = 384mm > arena radius → ABS cannot true-feint (game abstraction). Game: dashDirection = "back"; durationMs = 200ms; lockMs = 0; cost = 0; cooldownMs = 1200ms.  
**Engine Note**: minimum turning radius formula; rubber vs ABS feint physics; inward retreat after side-step.

---

### [Case 606 — Riposte (Cost 15, Defense): Impulse Absorption + Rebound Strike](./12%20case%20study.md#case-606)

**Category**: Combo — parry-counter  
**Sequence**: KKJ  
**Key Physics**: Phase 1 parry: J_parry = 0.0206 × 1.8 × 1.67 = 0.0620 N·s. Attacker rebounds at 1.206 m/s. Phase 3 counter closing speed: 1.606 m/s → J_counter = 0.0552 N·s (91.8% of fresh hit). damageMultiplier = 1.3 is above-physics game bonus. Game: durationMs = 600ms; lockMs = 200ms; cost = 15; cooldownMs = 2500ms.  
**Engine Note**: 3-phase chain (parry → wait → counter); heavier defense I → less Δω per hit; surprise-factor bonus above physics.

---

### [Case 607 — Pivot Strike (Cost 15, Balanced): Side-Angle Contact Boost](./12%20case%20study.md#case-607)

**Category**: Combo — off-axis attack  
**Sequence**: ←→J  
**Key Physics**: φ_oblique = 35° → J_smash = 0.0601 × cos(35°) = 0.0492 N·s (82.2% of flat-face). Off-axis ⊥ torque component: τ_perp = 7.05 × 10⁻⁴ N·m → direct spin-axis tilt bleed (beyond pure precession). Game: damageMultiplier = 1.25; durationMs = 500ms; lockMs = 200ms; cost = 15; cooldownMs = 2500ms.  
**Engine Note**: oblique approach angle geometry; on-axis vs off-axis spin-bleed distinction; riposte vs pivot-strike timing comparison.

---

### [Case 608 — Power Thrust (Cost 25, Universal): Sequential Three-Hit Flat-Face Maximum Smash](./12%20case%20study.md#case-608)

**Category**: Combo — triple attack  
**Sequence**: JJJ  
**Key Physics**: Hit 1: J = 0.0601 N·s, Δv_opp = 1.503 m/s. Hit 2 (t ≈ 30ms): closing speed 3.303 m/s → J₂ = 0.1103 N·s (stronger!). Total spin loss 3 × 205 = 615 rad/s. Game: damageMultiplier = 1.5 (combo ceiling); durationMs = 800ms; lockMs = 300ms (combo ceiling); cost = 25; cooldownMs = 3500ms.  
**Engine Note**: compound follow-up: second hit stronger due to opponent still retreating from first; both lockMs and damageMultiplier at combo ceiling.

---

### [Case 609 — Spin-Leech Jab (Cost 35, Stamina-Only): Surface-Friction Angular Momentum Transfer](./12%20case%20study.md#case-609)

**Category**: Combo — spin steal  
**Sequence**: ←J→  
**Key Physics**: Δv_surface = (500−300) × 0.025 = 5.0 m/s. F_friction = 0.196 N. Δω_stolen = 6.71 rad/s per 10ms contact. Over 800ms (100ms effective): ~67 rad/s stolen (22.4% of ω_target). Game spinStealBonus = 0.08 (conservative). Game: microSpinBoost = 30; durationMs = 800ms; lockMs = 200ms; cost = 35; type = "stamina"; cooldownMs = 4500ms.  
**Engine Note**: rubber-ER spin-steal rate derivation; ←J→ encodes orbital-pass approach; stamina-only restriction (physical basis in Case 613).

---

### [Case 610 — Sliding-Window Sequence Detection: 3-Key History Buffer and Pruning Algorithm](./12%20case%20study.md#case-610)

**Category**: Combo mechanics  
**Key Physics**: maxWindowMs = 600ms = approach-contact-rebound at v_min = 0.40 m/s (425ms) + 175ms overhead. Sliding-3: only last 3 keys checked; miskey invalidates (no partial suffix rescue). perComboCooldown map prevents retrigger. attachedComboIds gate = "only correct AR geometry can execute pattern".  
**Engine Note**: 600ms buffer calibration; sliding-3 miskey invalidation; per-combo cooldown map.

---

### [Case 611 — Cost Tier Physics: 0 / 15 / 25 / 35 Power Budget Rationale](./12%20case%20study.md#case-611)

**Category**: Combo design  
**Key Physics**: 1 power unit = 1.316/100 = 0.01316 J. Cost 0 = spontaneous. Cost 15 = 0.197 J (~1× rubber grip absorption). Cost 25 = 0.329 J (~6.85× EG spring energy in game scale). Cost 35 = 0.461 J (extended rubber-ER contact session). Gap 35→100 = 0.855 J (specials cost 2.85× most expensive combo).  
**Engine Note**: power unit → joule conversion; tier spacing rationale; cost gap enforces combo/special boundary.

---

### [Case 612 — Combo Cooldown Architecture: Orbital Period Multiples](./12%20case%20study.md#case-612)

**Category**: Combo design  
**Key Physics**: T_orbit_mid = 0.90 s. Free combos: 0.89–1.33 orbits (~1 orbit). Cost 15: 2.78 orbits (~3). Cost 25: 3.89 orbits (~4). Cost 35: 5.00 orbits (~5). Pattern: cooldown ∝ cost tier in orbit-count multiples. Game: 800/1000/1200ms (free) → 2500/3500/4500ms (power-cost).  
**Engine Note**: orbit-period-multiple cooldown pattern; tier → orbit count mapping.

---

### [Case 613 — Type Restriction Gate: Why Spin-Leech Jab Is Stamina-Only](./12%20case%20study.md#case-613)

**Category**: Combo design  
**Key Physics**: Three physical reasons for stamina-only: (1) ω_stealer > ω_target only sustainable with low-decay tip. (2) Flat-face attack ARs (φ = 5°) deflect rather than create parallel steal surface. (3) ←J→ orbital pass = left-spin / co-rotation stamina trajectory. isComboAllowedForType enforces: combo.type === beybladeType unless "universal".  
**Engine Note**: stamina physical prerequisites; attack AR geometric incompatibility; orbital-pass trajectory encoding.

---

### [Case 614 — Combo vs. Special Move Capability Boundary: The Four Hard Ceilings](./12%20case%20study.md#case-614)

**Category**: Combo design constraints  
**Key Physics**: (1) damageMultiplier ≤ 1.5: AR geometry max ~1.0; 1.5+ requires aerial/EG burst. (2) lockMs ≤ 300ms: 3-hit pursuit window ~60ms + 240ms margin; beyond = liability. (3) invulnMs = 0: true gyro invuln needs full I×ω maximization (100 power). (4) spinDelta ≤ 50: below EG spring contribution (60 rad/s); 400 requires full LAD session. Power gap: 35 vs 100 = 2.85× energy gap.  
**Engine Note**: 4-ceiling table with physical derivation; power cost gap enforces exclusive special-move mechanics.

---

### [Case 615 — Combo Effect Architecture: ComboTask → BehaviorRef Compilation and Engine Dispatch](./12%20case%20study.md#case-615)

**Category**: Combo engine  
**Key Physics**: ComboTask (admin intent) compiled to BehaviorRef[] (per-tick engine dispatch). ComboTiming types: instant (2ms hard hit), timed/48 ticks (800ms rubber-ER contact), pulsed (TR145/Jumping Base multi-bounce), charged (EG spring charge-and-release). ComboCondition: clashTypeRequired = "counter_spin" gates spin-leech (counter-spin Δv_surface = 4× co-spin).  
**Engine Note**: 2-layer compilation architecture; timing type → physical analog; counter-spin 4× steal advantage.

---

### [Case 616 — Combo HUD Strip: Attachment Gate, Sequence Display, and Fired-History Physics](./12%20case%20study.md#case-616)

**Category**: Combo client UI  
**Key Physics**: comboIds cap = 3 (AR perimeter 170mm / 45mm per pattern ≈ 3.8 → round down). Fired-history visual = real match observable (spin loss, direction reversal, height change). HUD only shows combos in bey.comboIds; sequences shown in key notation.  
**Engine Note**: 3-combo cap from AR geometry; fired-history feedback maps to real match observables.

---

### [Case 617 — Power Bar Mechanics: Charge Rate, Cost Deduction, and Free-Combos Round Modifier](./12%20case%20study.md#case-617)

**Category**: Combo power mechanics  
**Key Physics**: Passive charge rate ~10 power/s → 10s to refill from 0. Free combos modifier: comboCostMultiplier = 0.0 (all combos free — analogous to motorised disc constant re-energization). After special (cost 100): power = 0 → vulnerability window until recharge; cost 15 reachable in 1.5s; cost 35 in 3.5s.  
**Engine Note**: passive charge calibration; free_combos round modifier; post-special vulnerability window.

---

### [Case 618 — Combo Design Constraints: The Forbidden Effect Table and Ceiling Enforcement](./12%20case%20study.md#case-618)

**Category**: Combo design constraints  
**Key Physics**: Forbidden above limit — invulnMs > 0 requires full KE anchor; AoE requires full KE radial release; spinDelta > 50 chosen just below EG spring 60 rad/s (no combo = spring output); damageMultiplier > 1.5 requires aerial/EG burst. New combo checklist: all 4 ceilings + cost ≤ 35 + windowMs ≤ 600ms + cooldownMs ≥ 800ms + spinStealBonus ≤ 0.10.  
**Engine Note**: forbidden effect table with physical derivation; new combo design checklist; 4-ceiling simultaneous compliance required.

---

## CS13 — Cases 619–1785 {#cs13}
Source: `13 case study.md`

---

### [Case 619 — [GIMMICK] Free-Spin Ring Parry: ED145 Eternal Defense Ring and ES Eternal Sharp Sleeve](./13%20case%20study.md#case-619)

**Category**: Gimmick — impact decoupling  
**Parts**: ED145 track + ES tip (Poison Virgo, Metal Masters)  
**Key Physics**: ED145 ring (m = 1.2 g, r = 1.8 cm) rotates freely on bearing seat → 5.0% of incoming rotational impulse absorbed by ring (impulse partition: I_body / (I_body + m_ring × r_ring²) = 0.9496). ES free-spinning sleeve μ_sleeve = 0.05–0.08 (vs μ_ABS = 0.17) → tilt resistance 2.83× better. Combined: difficult to topple and destabilize. counterPool accumulates per hit.  
**Engine Note**: impulse partition formula; tilt resistance multiplier from sleeve decoupling; counter-charge pool model.

---

### [Case 620 — [SPECIAL MOVE] 100 Hit Fearsome Splendor: Chao Xin / Poison Virgo ED145ES (Metal Masters)](./13%20case%20study.md#case-620)

**Category**: Special Move — reactive counter  
**Bey / Blader**: Chao Xin / Poison Virgo ED145ES  
**Franchise Move**: Virgo's spirit spins swords in fast counter-sequence, deflecting and punishing the attacker.  
**Key Physics**: Reactive trigger (activated while being hit, not on approach). 100 hits × 5ms = 500ms window. Each hit = fraction of counter-charge pool energy → cumulative damage > single strike, per-hit impulse low (no ring-out per hit). Physical ceiling from gimmick: 5% absorption per hit; anime transcends this. Counter direction: all impulses fired toward attacker position at activation.  
**Engine Note**: reactive trigger condition; cumulative high-frequency counter model; QTE counter to cancel.

---

### [Case 621 — [GIMMICK] Spring-Mode-Change Tip: Nothing Driver and Absorb Driver Downforce-Triggered Profile Shift](./13%20case%20study.md#case-621)

**Category**: Gimmick — mode-change tip  
**Parts**: Nothing / Absorb drivers (Drain Fafnir, Geist Fafnir, Beyblade Burst)  
**Key Physics**: Nothing: k_tip ≈ 600 N/m, x_crit = 3 mm → F_crit = 1.80 N threshold. Below threshold: μ_sharp = 0.17 (α = 27.3 rad/s²). Above threshold: μ_flat = 0.40–0.45 (aggressive movement, rubber-flat behavior). Absorb: k = 1000 N/m, x_max = 5 mm → E_absorb = 12.5 mJ (spring energy release on mode change).  
**Engine Note**: downforce threshold model; two-phase friction switch; Absorb extra spring impulse on top of friction change.

---

### [Case 622 — [GIMMICK] Counter-Spin Passive Absorption: Fafnir Left-Spin Rubber Free-Spin Layers](./13%20case%20study.md#case-622)

**Category**: Gimmick — counter-spin  
**Parts**: Fafnir outer rubber frame (Drain/Geist/Mirage Fafnir, Burst series)  
**Key Physics**: Same-spin Δv_surface = |ω_A − ω_B| × r = 1.25 m/s. Counter-spin Δv_surface = (ω_A + ω_B) × r = 18.75 m/s (15× higher). τ_friction = μ_rubber × m × g × r = 4.91 × 10⁻³ N·m. Per 10ms contact: Δω_Fafnir = +6.71 rad/s; Δω_attacker = −6.71 rad/s. Every right-spin attack simultaneously drains attacker and restores Fafnir.  
**Engine Note**: additive vs subtractive Δv_surface formula; counter-spin 15× friction advantage; passive steal on every incoming hit.

---

### [Case 623 — [SPECIAL MOVE] Nothing Break: Free De La Hoya / Drain Fafnir 8 Nothing and Mirage Fafnir Nothing 2S (Burst)](./13%20case%20study.md#case-623)

**Category**: Special Move — absorb + burst counter  
**Bey / Blader**: Free De La Hoya / Drain/Mirage Fafnir  
**Franchise Move**: Nothing driver base pushes in from absorbed attack downforce, giving Fafnir massive burst speed.  
**Key Physics**: Phase 1 absorb stance (up to 2000ms); parryCharge builds per hit. Phase 2 release: all absorbed spin converted to directed forward burst. Physical ceiling: Δv ≈ 0.824 m/s, 12.5 mJ; anime scales to EG spring equivalent (Δv ≈ 1.5 m/s, 48 mJ). Damage scales with hits absorbed during stance.  
**Engine Note**: absorb-stance accumulation then burst; absorb-scaled damage multiplier; anime physics override flag.

---

### [Case 624 — [SPECIAL MOVE] Absorb Break: Free De La Hoya / Geist Fafnir 8'Proof Absorb (Burst Turbo)](./13%20case%20study.md#case-624)

**Category**: Special Move — absorb + burst counter  
**Bey / Blader**: Free De La Hoya / Geist Fafnir 8'Proof Absorb  
**Key Physics**: Absorb driver variant: k = 1000 N/m, E = 12.5 mJ. Physical spring release adds Δv = √(2 × 12.5×10⁻³ / 0.040) = 0.791 m/s on top of Nothing Break friction burst. Anime override: total burst treated as 1.5× Nothing Break equivalent. Counter-spin absorption same as Case 622.  
**Engine Note**: stiffer spring = higher burst impulse; Absorb vs Nothing driver comparison; anime physics override.

---

### [Case 625 — [COMBO] Parry Stance: Player-Skill Expression of the Free-Spin Ring Parry Gimmick (ED145ES)](./13%20case%20study.md#case-625)

**Category**: Combo — parry/counter  
**Key Physics**: Combo-level expression of Case 619 ED145ES gimmick. Activates counter-charge release for a brief strike after absorbing a hit. Limited to physics-realistic 5% absorption per hit (vs anime-transcended 100 Hit Fearsome Splendor). Sequence mirrors parry → wait → counter timing structure.  
**Engine Note**: gimmick expression at combo ceiling; counter-charge pool usage within cost 15 budget.

---

### [Case 626 — [COMBO] Spring Counter: Player-Skill Expression of the Spring-Mode-Change + Counter-Spin Gimmick](./13%20case%20study.md#case-626)

**Category**: Combo — spring-burst counter  
**Key Physics**: Combo-level expression of Cases 621+622 combined. Mode-change Δv ≈ 0.824 m/s provides lateral sprint; counter-spin passive +6.71 rad/s per hit provides spin advantage. Combo activates when downforce threshold exceeded (player deliberately enters close contact). Within cost 15–25 budget.  
**Engine Note**: dual-gimmick expression at combo level; spring Δv + counter-spin steal combined.

---

### [Case 627 — [GIMMICK] Aggressive-Tip Streak Dash: Rubber Flat at Peak Spin Cross-Stadium Sprint](./13%20case%20study.md#case-627)

**Category**: Gimmick — aggressive tip  
**Parts**: RF, R²F, soft rubber flat tip at high ω  
**Key Physics**: At peak spin ω_launch, rubber flat tip produces F_traction = 0.50 × m × g = 0.196 N. v_streak = F_traction × t_grip / m = 0.196 × 0.15 / 0.040 = 0.735 m/s lateral sprint. At high ω, tip-to-floor contact more stable → consistent streak direction. As ω decays, streak becomes random (wobble). Peak spin window for directed streak: first ~20% of match.  
**Engine Note**: peak-spin directed streak vs late-match random orbit; F_traction from rubber μ; streak direction locked to launch angle at high ω.

---

### [Case 628 — [SPECIAL MOVE] Abyss Fire: Mariam / Sharkrash (Original Series / Bakuten Shoot)](./13%20case%20study.md#case-628)

**Category**: Special Move — anime-original  
**Bey / Blader**: Mariam / Sharkrash (Bakuten Shoot original series)  
**Franchise Move**: Sharkrash summons a shark-themed aura and delivers a devastating underwater-pressure style impact.  
**Key Physics**: Original series anime physics override — BeySpirit power amplifies impact beyond all real part limits. Modeled as high-impulse directional burst with aquatic-pressure flavor (aura AoE). linearImpulse scaled to anime-tier (> physical ceiling). Compatible beys: any bey with required elements.  
**Engine Note**: anime physics override; BeySpirit amplification; original-series multi-tier aura model.

---

### [Case 629 — [COMBO] Streak Rush: Player-Skill Expression of the Aggressive-Tip Streak Dash Gimmick](./13%20case%20study.md#case-629)

**Category**: Combo — directional dash  
**Key Physics**: Combo expression of Case 627 gimmick. activates during peak-spin window (first ~20% of match). Directional streak at 0.735 m/s. Cost 0–15 (rubber-flat grip is passively available). Sequence: ←←J or →→J (same as Quick Dash but at higher speed during peak-spin window).  
**Engine Note**: peak-spin window bonus; streak speed from rubber grip-burst; time-gated effectiveness.

---

### [Case 630 — [DESIGN PRINCIPLE] Force Behavior System: Every Special Move Applies a Behavioral Compulsion State](./13%20case%20study.md#case-630)

**Category**: Design principle  
**Key Physics**: Every special move activates a forced behavior state on the opponent (compulsion: flee, freeze, orbit-lock, spin-up, etc.) as a secondary effect beyond raw impulse. Physical basis: high-energy contacts in real beyblade create predictable opponent responses — a strong upper-attack launches the opponent upward (forced airborne), a gyro anchor emits a spin-drain field (forced proximity penalty), a spring launch creates spatial control. BehaviorDef system in engine maps each special to a compulsion handler.  
**Engine Note**: BehaviorDef compulsion system; secondary forced-state effect mandatory on all specials; physics basis for each compulsion type.

---

### [Case 631 — [SPECIAL MOVE] Adamantine Hands: Chao Xin / Poison Virgo ED145ES (Metal Masters)](./13%20case%20study.md#case-631)

**Category**: Special Move — defensive anchor  
**Bey / Blader**: Chao Xin / Poison Virgo ED145ES  
**Franchise Move**: Virgo plants firmly and generates an unbreakable defensive stance, deflecting all attacks.  
**Key Physics**: Anchor archetype variant using ED145ES base. Maximizes I×ω gyroscopic stability + tilt resistance 2.83× (ES sleeve). invulnerabilityMs extended vs standard Gyro Anchor due to combined ring+sleeve decoupling. spinStealRadiusPx from ring absorb pool rebroadcast.  
**Engine Note**: ED145ES-based anchor; stacked tilt + impulse resistance; extended invulnerability window.

---

### [Case 632 — [GIMMICK] D125 Downforce Stabilization and CS Coat-Sharp Concentrated Contact Pressure](./13%20case%20study.md#case-632)

**Category**: Gimmick — aerodynamic + tip  
**Parts**: D125 track + CS Coat-Sharp tip (Ray Striker, Metal Masters)  
**Key Physics**: D125 = tall track (h = 12.5 mm) creating reduced air gap between AR and floor. Aerodynamic downforce F_aero = ½ × ρ × v² × A_disc × C_L at ω_launch ≈ 0.05–0.15 N (small but additive). CS tip: r_tip ≈ 0.5 mm → extreme normal pressure P = N/(π × r²) → P_contact up to 10 MPa at typical N. Very high contact pressure enables aggressive ground-lock.  
**Engine Note**: aerodynamic press from tall track disc profile; concentrated point pressure from CS tip; stabilization via increased normal force.

---

### [Case 633 — [SPECIAL MOVE] Lightning Sword Flash: Masamune Kadoya / Ray Striker D125CS (Metal Masters)](./13%20case%20study.md#case-633)

**Category**: Special Move — speed burst + pierce  
**Bey / Blader**: Masamune Kadoya / Ray Striker D125CS  
**Franchise Move**: Striker launches forward at lightning speed and delivers a piercing strike.  
**Key Physics**: D125 aero downforce provides launch stability. CS sharp tip at peak spin → concentrated contact pressure → precise directional control. linearImpulse burst directed forward at high speed. Anime override: pierce damage scales independently of normal damage multiplier. BeySpirit amplification makes lightning-speed entry possible.  
**Engine Note**: D125+CS synergy; pierce damage type (bypasses normal defense); anime physics override for entry speed.

---

### [Case 634 — [COMBO] Sword Point: Player-Skill Expression of the Concentrated Pierce Contact](./13%20case%20study.md#case-634)

**Category**: Combo — pierce strike  
**Key Physics**: Combo expression of Case 632 CS tip concentrated pressure. At high approach speed, CS tip ground-lock prevents recoil during contact window. Enables sustained point-contact impulse delivery. damageMultiplier boosted by pierce contact; lockMs moderate (ground-lock limits attacker escape).  
**Engine Note**: ground-lock from CS tip during combo; pierce damage type at combo ceiling; D125 stabilization prerequisite.

---

### [Case 635 — [GIMMICK] Expand Frame Aerodynamic Outflow: Wide-Profile Spinning Disc as a Radial Air-Displacement Engine](./13%20case%20study.md#case-635)

**Category**: Gimmick — aerodynamic  
**Parts**: Expand frame disc (Air Knight 12Expand, Burst Surge)  
**Key Physics**: Wide disc profile (r_expand ≈ 3.5 cm) spinning at ω creates radial outflow velocity v_r = ω × r = 600 × 0.035 = 21.0 m/s at rim. Dynamic pressure q = ½ × ρ × v_r² = 0.5 × 1.2 × 441 = 264.6 Pa. Force on approaching bey at 5 cm range: F_aero ≈ q × A_bey ≈ 0.01 N → gentle but persistent approach deflection.  
**Engine Note**: radial outflow aerodynamic model; dynamic pressure at radius; approach deflection force on nearby beys.

---

### [Case 636 — [SPECIAL MOVE] Air Launch / Air Shoot: Kit Lopez / Air Knight 12Expand Eternal (Burst Surge)](./13%20case%20study.md#case-636)

**Category**: Special Move — aerial launch  
**Bey / Blader**: Kit Lopez / Air Knight 12Expand Eternal  
**Franchise Move**: Air Knight spins up the Expand disc's wind field and launches a compressed air blast.  
**Key Physics**: Expand disc radial outflow (Case 635) amplified to anime tier. Compressed air blast = AoE radial impulse with aerobraking flavor. verticalImpulse launches self upward from air cushion. aoeRadiusPx scaled to disc outflow radius (35 mm → 250 px). BeySpirit amplification makes air blast capable of ring-out.  
**Engine Note**: aero-amplified AoE; self-launch from air cushion; approach-deflection field persists during windDown.

---

### [Case 637 — [COMBO] Air Wall: Player-Skill Expression of the Expand Frame Radial Outflow](./13%20case%20study.md#case-637)

**Category**: Combo — defensive aero  
**Key Physics**: Combo expression of Case 635 outflow gimmick. Activates when opponent is within radial outflow range. Defensive deflection: F_aero ≈ 0.01 N applied away from disc center. Cost 0 (passive aerodynamic, no spin investment). Reduces opponent approach speed by ~5% per orbit pass.  
**Engine Note**: passive aero deflection as combo; cost 0; approach-speed reduction per pass.

---

### [Case 638 — [GIMMICK] Needle Tip Impact Anchor: Extreme Contact Pressure as a Hard-Hit Ground-Lock Mechanism](./13%20case%20study.md#case-638)

**Category**: Gimmick — needle tip  
**Parts**: Needle / Down driver (Über Unicrest Down, Burst Surge)  
**Key Physics**: Needle tip r ≈ 0.3 mm → extreme contact pressure P = N/(π × r²). At ω_launch: P > 50 MPa → tip plastically deforms ABS floor microscopically → momentary ground-lock on hard impact. Ground-lock duration: t_lock ≈ 5–15 ms per impact event. Self-stabilization: each hard hit drives needle deeper momentarily, preventing tip skid.  
**Engine Note**: ultra-sharp tip pressure model; ground-lock on impact; self-stabilizing hard-hit behavior.

---

### [Case 639 — [SPECIAL MOVE] Alicorn Launch: Ukio Kibuki / Über Unicrest Down Needle (Burst Surge)](./13%20case%20study.md#case-639)

**Category**: Special Move — needle anchor + launch  
**Bey / Blader**: Ukio Kibuki / Über Unicrest Down Needle  
**Franchise Move**: Unicrest drives its needle into the floor and pole-vaults forward, delivering a devastating charge.  
**Key Physics**: Needle ground-lock (Case 638) used as launch fulcrum. Pole-vault analog: PE_floor = m × g × 0 → KE_launch via tip-reaction force. linearImpulse = high (fulcrum amplification). Anime override: tip-reaction force treated as rigid fulcrum (real needle deformation ignored). BeySpirit amplification.  
**Engine Note**: ground-lock fulcrum → launch amplification; linearImpulse from pole-vault geometry; anime physics override.

---

### [Case 640 — [COMBO] Horn Brace: Player-Skill Expression of the Needle Anchor and Horn Counter](./13%20case%20study.md#case-640)

**Category**: Combo — ground-lock  
**Key Physics**: Combo expression of Case 638 needle anchor. Braces on ground-lock to absorb incoming hit (reduced knockback). Counter-strike follows while tip is still locked. lockMs = short (ground-lock window only). Cost 15 (deliberate stance commitment).  
**Engine Note**: ground-lock as parry platform; needle anchor → reduced knockback during lock; counter-strike from planted stance.

---

### [Case 641 — [GIMMICK] GB145 Dynamic Ball Weight Channel and BS Tip Mode Transition: Inertia Modulation for Direction Change](./13%20case%20study.md#case-641)

**Category**: Gimmick — dynamic inertia  
**Parts**: GB145 track + BS tip (Earth Virgo GB145BS, Metal Fight Beyblade)  
**Key Physics**: GB145: 4 steel balls (each m_ball ≈ 0.5 g) in circular channel at r = 14.5 mm. At high ω, centrifugal force pushes balls outward: ΔI = 4 × m_ball × r² = 4 × 5×10⁻⁴ × (0.0145)² = 4.22×10⁻⁷ kg·m². At sudden direction change, balls lag → I drops transiently → faster turn rate. BS tip: ball tip (μ ≈ 0.03) provides minimal floor friction for stamina, but on mode-change (impact) switches to higher friction contact for brief attack phase.  
**Engine Note**: dynamic I from ball channel; transient I drop on direction change; BS two-phase friction model.

---

### [Case 642 — [SPECIAL MOVE] Allegro Entrechat: Teru Saotome / Earth Virgo GB145BS (Metal Fight Beyblade)](./13%20case%20study.md#case-642)

**Category**: Special Move — evasion + counter  
**Bey / Blader**: Teru Saotome / Earth Virgo GB145BS  
**Franchise Move**: Virgo performs a balletic spinning leap, dodging and striking simultaneously.  
**Key Physics**: GB145 transient I drop → rapid direction change at moment of activation. BS mode-change → brief attack friction boost during aerial phase. Evasion probability modeled as dodge during windUpMs. damageMultiplier from high-speed direction-change strike. BeySpirit amplification makes aerial reach possible.  
**Engine Note**: transient I drop → dodge window; BS mode-change during aerial; dance-like evasion + counter archetype.

---

### [Case 643 — [COMBO] Quick Step: Player-Skill Expression of the GB145+BS Evasion Window](./13%20case%20study.md#case-643)

**Category**: Combo — evasion  
**Key Physics**: Combo expression of Case 641 GB145 transient I drop. Rapid direction reversal costs 0 spin (I drop is passive). Very short durationMs (direction change only). lockMs = 0.  
**Engine Note**: passive I-drop evasion at combo level; no lock; instant escape maneuver.

---

### [Case 644 — [GIMMICK] Wide Domed AR Curved-Surface Impulse Partitioning and Ball Tip Stability Stance](./13%20case%20study.md#case-644)

**Category**: Gimmick — defense dome  
**Parts**: Wide dome AR + ball tip (Draciel F/S, Original Series)  
**Key Physics**: Curved dome surface deflects attacker tangentially: J_lateral = J_impact × sin(θ_dome). θ_dome = 40–60° typical → lateral deflection = 64–87% of impulse, radial (pushing away) only 36–13%. Ball tip (μ_ball ≈ 0.02–0.05) provides rolling-contact stability. Ground hold: F_lat_friction = μ_ball × N = 0.02 × 0.040 × 9.81 = 0.0078 N → very low recoil on hits.  
**Engine Note**: dome curved-surface impulse redirection; impulse partition at dome angle; ball-tip rolling-contact stability stance.

---

### [Case 645 — [SPECIAL MOVE] Aqua Shield: Max Mizuhara / Draciel (Beyblade Original Series)](./13%20case%20study.md#case-645)

**Category**: Special Move — defensive dome shield  
**Bey / Blader**: Max Mizuhara / Draciel  
**Franchise Move**: Draciel's tortoise spirit manifests a water shield that deflects attacks.  
**Key Physics**: Dome AR deflection (Case 644) amplified to anime tier. All incoming impulses redirected to zero (perfect shield). Physical basis: dome deflects ≥ 64% tangentially; anime version = 100% deflection. invulnerabilityMs window represents "shield active" phase. Water-element AoE repulsion during shield.  
**Engine Note**: dome deflection → anime-tier invulnerability; water-element AoE; BeySpirit-powered perfect shield.

---

### [Case 646 — [COMBO] Tidal Brace: Player-Skill Expression of the Defense AR Deflection and Ball Tip Pivot Stance](./13%20case%20study.md#case-646)

**Category**: Combo — defense  
**Key Physics**: Combo expression of Case 644 dome deflection + ball-tip stability. Activates defensive stance: incoming hit redirected tangentially. Very low recoil (F_lat_friction = 0.0078 N from ball tip). lockMs = 0 (brace is passive, no commitment needed). Cost 0.  
**Engine Note**: curved-surface deflection at combo level; ball-tip ground hold; zero-lock defensive brace.

---

### [Case 647 — [GIMMICK] Eternal Tip Wall-Adhesion and Bowl-Wall Potential Energy Storage](./13%20case%20study.md#case-647)

**Category**: Gimmick — wall climbing  
**Parts**: Eternal / ET tip (Archer Hercules 13 Eternal, Burst)  
**Key Physics**: Eternal tip outer sleeve free-spins (μ_sleeve ≈ 0.03). Wall contact at bowl slope α → normal force N = m × g / cos(α). Centrifugal tendency provides outward force to maintain wall contact. At bowl wall r = 17 cm, α = 30°: F_centripetal_needed = m × v² / r = 0.040 × v² / 0.170. Wall PE stored: PE = m × g × h_climb. Release: PE → KE on descent = m × g × h_climb (kinetic launch).  
**Engine Note**: wall-adhesion orbit model; PE storage during climb; KE release on descent as attack launch.

---

### [Case 648 — [SPECIAL MOVE] Archer Strike: Hae-jin Oh / Archer Hercules 13 Eternal (Burst)](./13%20case%20study.md#case-648)

**Category**: Special Move — wall-climb launch  
**Bey / Blader**: Hae-jin Oh / Archer Hercules 13 Eternal  
**Franchise Move**: Hercules climbs the bowl wall and launches from height as a diving strike.  
**Key Physics**: Wall-climb to h_climb = H_rim = 28 cm → PE = 0.040 × 9.81 × 0.280 = 0.110 J. Descent → v_launch = √(2 × 0.110 / 0.040) = 2.345 m/s (> Stampede Rush approach of 1.8 m/s). linearImpulse boosted by height advantage. BeySpirit amplification extends climb range. Anime: climb height effectively unlimited.  
**Engine Note**: wall-climb PE → KE descent attack; 2.345 m/s approach at max climb; anime height amplification.

---

### [Case 649 — [COMBO] Slope Launch: Player-Skill Expression of the Eternal Tip Bowl-Wall Energy Relay](./13%20case%20study.md#case-649)

**Category**: Combo — wall energy  
**Key Physics**: Combo expression of Case 647 wall-adhesion + PE storage. Brief wall-contact during orbit → accumulates small PE → micro-boost on descent. Δv_boost = √(2 × g × h_brief) where h_brief ≈ 5 cm → Δv = 0.99 m/s. Cost 15 (deliberate wall-ride commitment).  
**Engine Note**: brief wall-ride PE micro-boost; slope descent attack; cost 15 wall-adhesion maneuver.

---

### [Case 650 — [GIMMICK] VariAres 4D Metal Wheel Centrifugal PC Frame Retraction and Delta Drive Pre-Battle Tip Selection](./13%20case%20study.md#case-650)

**Category**: Gimmick — 4D mode-change  
**Parts**: VariAres D:D (Beyblade Metal Fury)  
**Key Physics**: PC Frame: 2 polycarbonate wings at r = 2.8 cm centrifugally locked at ω > ω_crit. Below ω_crit → wings retract inward (I decreases by ~20%, attack profile reduced). Δ Drive: 3 pre-selectable tip modes (Rubber Flat, Ball, Defense) — chosen before launch. ω_crit ≈ 300–400 rad/s depending on spring tension k_PC.  
**Engine Note**: centrifugal PC frame lock; ω_crit for frame retraction; pre-battle tip mode selection model.

---

### [Case 651 — [SPECIAL MOVE] Ares Shield: King / Variares D:D (Beyblade Metal Fury)](./13%20case%20study.md#case-651)

**Category**: Special Move — mode-change shield  
**Bey / Blader**: King / Variares D:D  
**Franchise Move**: VariAres shifts to defense mode and delivers a counter-burst.  
**Key Physics**: PC Frame locks at high ω → maximum I (attack mode). On shield activation: frame parameters shift to defense-equivalent I distribution. Delta Drive switches to Ball mode during shield → rolling stability. invulnerabilityMs window while frame transitions. Counter-burst from released PC frame kinetic energy.  
**Engine Note**: PC frame I shift as shield basis; Δ Drive mode switch during activation; frame KE release as counter.

---

### [Case 652 — [COMBO] Frame Brace: Player-Skill Forced PC Frame Defense-Mode with D:D Wide Ball Override](./13%20case%20study.md#case-652)

**Category**: Combo — mode-change  
**Key Physics**: Combo expression of Case 650 PC frame + Δ Drive. Forces defense-mode briefly via sequence input. Ball tip override for durationMs. Reduced recoil during frame-defense window. Cost 15.  
**Engine Note**: PC frame defense mode at combo level; Δ Drive ball override; reduced recoil window.

---

### [Case 653 — [GIMMICK] 4D Outer-Rim Metal Wheel and X:D Wide-Disc Tip — Maximum Rotational Inertia and Gyroscopic Gravity Field](./13%20case%20study.md#case-653)

**Category**: Gimmick — maximum I  
**Parts**: 4D Outer Metal Wheel + X:D tip (Diablo Nemesis, Metal Fury)  
**Key Physics**: 4D Outer rim: zinc alloy at r = 3.0–3.3 cm, m_rim ≈ 20 g → I_rim = m_rim × r² = 0.020 × (0.032)² = 2.048 × 10⁻⁵ kg·m² (dominant term). X:D tip: r = 2.8 cm wide disc → I_tip = 4.5 × 10⁻⁶ kg·m². Combined: I_total ≈ 3.5–4.0 × 10⁻⁵ kg·m² (series maximum). Gyroscopic "gravity field": Ω_p = τ/(I×ω) is minimum → precession negligible at high ω → effective gravitational pull on nearby beys (frame-drag analog).  
**Engine Note**: maximum-I assembly from outer rim + wide disc tip; gyroscopic frame-drag flavor mechanic; lowest Ω_p of any assembly.

---

### [Case 654 — [SPECIAL MOVE] Armageddon: Rago / Diablo Nemesis X:D (Beyblade Metal Fury)](./13%20case%20study.md#case-654)

**Category**: Special Move — maximum force  
**Bey / Blader**: Rago / Diablo Nemesis X:D  
**Franchise Move**: Nemesis releases the full power of the forbidden bey as a world-ending shockwave.  
**Key Physics**: Maximum I assembly (Case 653) → highest possible L = I × ω → highest first-hit impulse. All special move parameters at or near engine ceiling: linearImpulse ≈ 6000, knockbackImpulse ≈ 7000, aoeRadiusPx ≈ 300, invulnerabilityMs ≈ 1500. BeySpirit: forbidden bey breaks all physical limits. Compulsion state: full field freeze (all opponents forced stop).  
**Engine Note**: all parameters near engine ceiling; maximum L assembly; forbidden bey anime override; field freeze compulsion.

---

### [Case 655 — [COMBO] Dark Stance: Player-Skill Expression of the 4D Heavy-Inertia Mass Amplification](./13%20case%20study.md#case-655)

**Category**: Combo — inertia stance  
**Key Physics**: Combo expression of Case 653 maximum I. Inertia stance: incoming impulses produce minimal Δω (Δω = J × r / I ∝ 1/I). Highest I = lowest spin loss per hit. damageMultiplier from heavy rim momentum on counter. Cost 25 (maximum inertia commitment requires high spin reserve).  
**Engine Note**: high-I → low Δω per hit; heavy-rim counter momentum; cost 25 inertia stance.

---

### [Case 656 — [GIMMICK] WB Wide-Ball Floor Boundary-Layer Rankine Vortex: Ground-Level Spinning Air Funnel](./13%20case%20study.md#case-656)

**Category**: Gimmick — aerodynamic vortex  
**Parts**: WB Wide Ball tip (Archer Wyvern 145WB, Metal Masters)  
**Key Physics**: WB ball radius r_WB ≈ 7 mm rolling at floor. Boundary layer rotation generates Rankine vortex tangential velocity v_θ = Γ / (2π × r) at approach radius r. Γ ≈ ω × π × r_WB² = 600 × π × 0.007² = 0.0923 m²/s. At r = 50 mm from WB tip: v_θ = 0.0923 / (2π × 0.050) = 0.294 m/s → deflects approaching low-profile beys.  
**Engine Note**: Rankine vortex from floor-contact rolling; Γ calculation; approach deflection velocity at given radius.

---

### [Case 657 — [SPECIAL MOVE] Arrow Tornado: Captain Arrow / Archer Wyvern 145WB (Metal Masters)](./13%20case%20study.md#case-657)

**Category**: Special Move — vortex AoE  
**Bey / Blader**: Captain Arrow / Archer Wyvern 145WB  
**Franchise Move**: Wyvern creates a tornado from its spinning floor vortex and launches it at opponents.  
**Key Physics**: WB floor vortex (Case 656) amplified to anime tier. Vortex AoE: all beys within aoeRadiusPx experience centrifugal push outward from vortex center. v_θ_anime >> 0.294 m/s → ring-out capable. BeySpirit amplification scales Γ beyond physical limits. Compulsion: orbit-lock (forced circular path around vortex center).  
**Engine Note**: vortex AoE with orbit-lock compulsion; centrifugal push direction; BeySpirit-scaled Γ.

---

### [Case 658 — [COMBO] Vortex Feint: Player-Skill Expression of the WB Floor Vortex Approach Deflection](./13%20case%20study.md#case-658)

**Category**: Combo — evasive  
**Key Physics**: Combo expression of Case 656 vortex deflection. At close range, WB vortex deflects opponent approach by 0.294 m/s tangentially. Feint uses this deflection as an evasion basis. Cost 0 (passive vortex, no energy investment).  
**Engine Note**: passive vortex deflection at combo level; cost 0; approach deflection without spin investment.

---

### [Case 659 — [GIMMICK] RDF Rubber Defense Flat High-Friction Spiral Orbit: Inward-Coiling Attack](./13%20case%20study.md#case-659)

**Category**: Gimmick — spiral orbit  
**Parts**: RDF Rubber Defense Flat tip (Death Quetzalcoatl 125RDF, Metal Masters)  
**Key Physics**: RDF: μ_rubber = 0.50 combined with flat wide-contact provides both high friction AND stable floor contact. High friction drives inward-coiling orbit (F_friction > centrifugal tendency → spiral inward). v_spiral = v_orbit × e^(−α × θ) where α = friction coefficient / orbit radius. Attack delivered at end of spiral when approach angle is maximally oblique.  
**Engine Note**: inward-coiling spiral orbit model; high-friction approach-angle accumulation; oblique strike at spiral terminus.

---

### [Case 660 — [SPECIAL MOVE] Ascent Spark: Tithi / Death Quetzalcoatl 125RDF (Metal Masters)](./13%20case%20study.md#case-660)

**Category**: Special Move — spiral + ascent  
**Bey / Blader**: Tithi / Death Quetzalcoatl 125RDF  
**Franchise Move**: Quetzalcoatl spirals upward using its RDF orbit and delivers an aerial spark attack.  
**Key Physics**: RDF spiral orbit (Case 659) used to build approach angle. verticalImpulse launches from spiral terminus. Aerial descent strike: damageMultiplier from spiral-accumulated angle advantage. BeySpirit: quetzalcoatl flame aura amplifies to multi-hit.  
**Engine Note**: spiral orbit → aerial launch; angle-accumulated approach multiplier; quetzalcoatl multi-hit flame.

---

### [Case 661 — [COMBO] Coil Strike: Player-Skill Expression of the RDF Spiral Orbital Approach](./13%20case%20study.md#case-661)

**Category**: Combo — spiral approach  
**Key Physics**: Combo expression of Case 659 spiral orbit. Activates inward coil approach for one orbit. Delivers oblique strike at spiral end. damageMultiplier from approach angle. Cost 15 (spiral approach requires deliberate spin commitment over one orbit).  
**Engine Note**: one-orbit spiral approach; oblique strike angle bonus; cost 15 orbital commitment.

---

### [Case 662 — [GIMMICK] Over Forge Disc Mass-Dominant Flywheel and Quattro Driver Attack-Mode Rubber Flat](./13%20case%20study.md#case-662)

**Category**: Gimmick — mass flywheel + attack tip  
**Parts**: Over disc + Quattro driver (Astral Spriggan Over Quattro-0, Burst Surge)  
**Key Physics**: Over disc: large diameter (r ≈ 3.4 cm), heavy (m ≈ 25 g) → I_Over ≈ m × r² / 2 = 1.445 × 10⁻⁵ kg·m² (dominant). Quattro driver: rubber flat in attack mode (μ = 0.50) → F_traction = 0.196 N → directed orbital attack. Flywheel I stores L for sustained attack orbit even through multiple collisions.  
**Engine Note**: Over disc dominant I; Quattro rubber-flat attack mode; flywheel L reservoir sustains orbit post-collision.

---

### [Case 663 — [SPECIAL MOVE] Astral Spark: Shu Kurenai / Astral Spriggan Over Quattro-0 (Burst Surge)](./13%20case%20study.md#case-663)

**Category**: Special Move — orbital burst  
**Bey / Blader**: Shu Kurenai / Astral Spriggan Over Quattro-0  
**Franchise Move**: Spriggan channels astral energy into a spinning burst attack.  
**Key Physics**: Over disc flywheel (Case 662) releases stored L as forward burst. Quattro rubber-flat delivers traction-based directional sprint (Δv = 0.735 m/s base). Anime: full L release → linearImpulse near ceiling. Compulsion: spin-drain field from released angular momentum.  
**Engine Note**: flywheel L → linear burst; rubber-flat traction sprint; spin-drain compulsion on release.

---

### [Case 664 — [SPECIAL MOVE] Astral Whip: Shu Kurenai / Astral Spriggan Over Quattro-0 (Burst Surge)](./13%20case%20study.md#case-664)

**Category**: Special Move — whip strike  
**Bey / Blader**: Shu Kurenai / Astral Spriggan Over Quattro-0  
**Franchise Move**: Spriggan uses its dual-spin capability to deliver a whipping counter from unexpected angle.  
**Key Physics**: Dual-spin capability (Spriggan switches L-R spin): at mode change, angular momentum vector flips → angular impulse delivered to surrounding beys. ΔL = 2 × I × ω → J_whip = 2 × I × ω / r_contact = 2 × 3.518 × 10⁻⁵ × 600 / 0.025 = 1.688 N·s (theoretical max). Anime scales to this. Knockback radial from spin-flip center.  
**Engine Note**: dual-spin angular momentum flip → angular impulse; J_whip = 2Iω/r formula; radial knockback from spin-flip.

---

### [Case 665 — [COMBO] Spark Rush: Player-Skill Expression of the Over Disc Orbital Momentum and Quattro Rubber Grip](./13%20case%20study.md#case-665)

**Category**: Combo — orbital rush  
**Key Physics**: Combo expression of Cases 662+663. Over disc flywheel sustains orbit post-collision. Quattro rubber grip burst at contact. damageMultiplier from sustained high-speed orbit into target. Cost 25 (flywheel L investment requires high spin reserve).  
**Engine Note**: flywheel-sustained orbital attack; rubber grip sprint into contact; cost 25.

---

### [Case 666 — [GIMMICK] Hole Flat (HF) Annular Ring Contact: Reduced-Friction Drift Profile and 100H Elevated AR Contact Height](./13%20case%20study.md#case-666)

**Category**: Gimmick — HF tip  
**Parts**: HF Hole Flat tip + 100H track (Cyber Pegasus 100HF, Metal Fusion)  
**Key Physics**: HF tip: annular contact ring r_inner = 1.5 mm, r_outer = 3.5 mm. μ_HF ≈ 0.10 (annular region, reduced contact area vs full flat). α_HF = 0.10 × m × g × r_eff / I = 4.21 rad/s² (low decay, drift behavior). 100H track: h = 10 mm → AR contact height 10 mm lower than standard → attacks mid-body of most opponents.  
**Engine Note**: HF annular contact ring friction model; 100H reduced contact height; drift orbit from low-friction annular contact.

---

### [Case 667 — [SPECIAL MOVE] Avalanche Move: Sora Akatsuki / Cyber Pegasus 100HF (Metal Fusion)](./13%20case%20study.md#case-667)

**Category**: Special Move — drift + avalanche  
**Bey / Blader**: Sora Akatsuki / Cyber Pegasus 100HF  
**Franchise Move**: Pegasus drifts around the arena and builds speed for a crushing avalanche charge.  
**Key Physics**: HF drift orbit builds up orbit speed over time (low decay, fast orbit). linearImpulse burst from maximum drift speed. 100H contact height targets opponent mid-body for upper-attack component. Compulsion: stunned (drift approach unpredictable, opponent forced to react). BeySpirit: Pegasus wings amplify impact.  
**Engine Note**: drift orbit speed buildup; 100H mid-body upper-attack component; compulsion = stunned from unpredictable approach.

---

### [Case 668 — [COMBO] Upper Shunt: Player-Skill Orbital-Phase Strike using HF Pivot Maneuverability](./13%20case%20study.md#case-668)

**Category**: Combo — directional strike  
**Key Physics**: Combo expression of Case 666 HF + 100H. Low-friction HF enables rapid pivot at contact. 100H upper-attack component at combo level. damageMultiplier from pivot angle (similar to Pivot Strike but from HF drift basis). Cost 15.  
**Engine Note**: HF pivot at contact; 100H upper-attack; pivot-based angle bonus.

---

### [Case 669 — [GIMMICK] Merge Driver Left-Spin Asymmetric Floor Friction: Sustained Metal-Edge Grind and Directed Trajectory Rotation](./13%20case%20study.md#case-669)

**Category**: Gimmick — left-spin drift  
**Parts**: Merge driver (Legend Spriggan 7 Merge, Burst Evolution)  
**Key Physics**: Merge driver: wider-than-normal flat contact with angled metal edge on left side only. Left-spin rotation causes metal edge to grind into floor asymmetrically → net rightward force F_drift = μ_metal × N × sin(θ_edge) where θ_edge ≈ 15°. F_drift ≈ 0.12 × 0.040 × 9.81 × sin(15°) = 0.0122 N → steady rightward drift in left-spin mode.  
**Engine Note**: asymmetric metal-edge grinding; sinusoidal force from edge angle; sustained drift direction from spin handedness.

---

### [Case 670 — [SPECIAL MOVE] Axe Launch: Shu Kurenai / Legend Spriggan 7 Merge (Burst Evolution)](./13%20case%20study.md#case-670)

**Category**: Special Move — grind + axe  
**Bey / Blader**: Shu Kurenai / Legend Spriggan 7 Merge  
**Franchise Move**: Spriggan grinds the floor and launches a dual-spin axe strike.  
**Key Physics**: Merge left-spin drift (Case 669) provides approach trajectory. Metal edge grind builds up F_drift over ~0.5s approach → J_drift = 0.0122 × 0.500 = 6.1 × 10⁻³ N·s directional bonus. Dual-spin axe release: ΔL from spin direction change → knockback. BeySpirit amplifies metal grind to axe-scale force.  
**Engine Note**: grind approach bonus + dual-spin axe release; F_drift accumulated impulse; dual-spin ΔL knockback.

---

### [Case 671 — [COMBO] Axe Feint: Player-Skill Expression of the Merge Grind Trajectory Drift](./13%20case%20study.md#case-671)

**Category**: Combo — drift feint  
**Key Physics**: Combo expression of Case 669 Merge drift. Activates leftward drift approach; opponent expects straight charge. Feint direction change uses metal-edge asymmetry. dashDirection = "left" (drift axis). Cost 0 (grind drift is passive in left-spin mode).  
**Engine Note**: metal-edge drift as feint basis; passive left-spin asymmetry; cost 0 directional drift.

---

### [Case 672 — [GIMMICK] HF Annular Contact at Full Spin and 100H: Launch-Phase Spin Surplus Momentum Transfer](./13%20case%20study.md#case-672)

**Category**: Gimmick — launch surplus  
**Parts**: HF tip + 100H track (same as Case 666 but launch-phase focus)  
**Key Physics**: At launch ω₀ (peak spin), HF annular contact generates high tangential contact velocity v_contact = ω₀ × r_eff. If opponent is struck immediately after launch: v_transfer = m_eff × v_contact × (1+e) / m_opp = large. Launch-phase surplus: first 1–2 s after launch, excess spin × HF low decay creates momentum advantage window.  
**Engine Note**: launch-phase surplus window; HF low decay extends high-spin period; first-contact multiplier from launch ω₀.

---

### [Case 673 — [LAUNCH TECHNIQUE / SPECIAL MOVE] Backflip Boost: Cuza Ackermann / Alter Cognite 6 Meteor Trans (Burst Turbo)](./13%20case%20study.md#case-673)

**Category**: Special Move — launch technique  
**Bey / Blader**: Cuza Ackermann / Alter Cognite 6 Meteor Trans  
**Franchise Move**: Cuza performs a backflip and launches Cognite at an extreme angle for a speed boost.  
**Key Physics**: Launch at θ_launch = 45° → beyTiltAngle = 45° at release. Extreme tilt → high horizontal velocity component at release. v_horizontal = v_pull × cos(45°) = 3.0 × 0.707 = 2.121 m/s (+50% over normal 30° launch). Backflip provides additional upper-body leverage Δv ≈ 0.5 m/s. Game: treated as launch-power bonus (ω₀ × 1.2).  
**Engine Note**: extreme tilt launch angle; backflip upper-body impulse; launch-phase ω₀ bonus from technique.

---

### [Case 674 — [COMBO] Quick Surge: Player-Skill Combo Derived from the Launch-Surplus High-Spin Window](./13%20case%20study.md#case-674)

**Category**: Combo — launch-window dash  
**Key Physics**: Combo expression of Case 672 launch surplus. Activates immediately after launch during high-spin window. dashDirection = forward at maximum ω₀ traction. F_grip = μ_HF × m × g × (ω₀/ω_nominal)² bonus. Cost 0 (launch surplus is naturally available).  
**Engine Note**: launch-window ω₀ traction bonus; cost 0; time-gated (effective only in first 2s).

---

### [Case 675 — [GIMMICK] Baihu Claw: AR Claw-Geometry Contact-Point Architecture and Tiger-Fang Strike Sequencing](./13%20case%20study.md#case-675)

**Category**: Gimmick — claw AR  
**Parts**: Baihu / White Tiger claw AR (Original Series)  
**Key Physics**: Claw geometry: 3 curved fang blades at r = 2.5–2.8 cm, curved inward at θ_claw = 30°. Inward curve produces "grip" effect on contact: F_grip_lateral = F_N × sin(θ_claw) = F_N × 0.500. Sequential fang strikes: at ω_rel, each fang impacts at interval T_fang = 2π / (3 × ω_rel). For ω_rel = 600 rad/s: T_fang = 3.49 ms → 3 sequential impacts per orbit.  
**Engine Note**: claw geometry grip force; fang interval formula; sequential multi-impact model.

---

### [Case 676 — [SPECIAL MOVE] Baihu Claw: Full White Tiger Manifestation — Triple-Fang Simultaneous Orbital Rip](./13%20case%20study.md#case-676)

**Category**: Special Move — triple claw  
**Bey / Blader**: White Tiger / Galman (Original Series)  
**Franchise Move**: White tiger spirit manifests and delivers a triple simultaneous claw strike.  
**Key Physics**: Claw geometry (Case 675) anime-amplified. All 3 fangs deliver simultaneous strikes (vs sequential in real-part). J_total = 3 × J_single = 3 × 0.0601 = 0.1803 N·s — 3× normal hit. Compulsion: grip (opponent held at close range, cannot escape for 200ms). BeySpirit amplification.  
**Engine Note**: simultaneous triple-fang J = 3×; grip compulsion; anime-parallel vs physical sequential.

---

### [Case 677 — [COMBO] Tiger Fang: Rapid AR-Pass Claw Chain (3-key: →→J)](./13%20case%20study.md#case-677)

**Category**: Combo — rapid attack  
**Sequence**: →→J  
**Key Physics**: Combo expression of Case 675 claw sequencing. Two rapid approach inputs → J key delivers sequential claw contact. Physical: 2 fangs per pass at T_fang interval. damageMultiplier from sequential impact compounding. Cost 15.  
**Engine Note**: sequential claw hits (2 of 3 fangs in combo window); compounding impulse; cost 15.

---

### [Case 678 — [GIMMICK] Barnard's Loop: Phantom Orion B:D Mode-Change Orbit-to-Stamina Transition](./13%20case%20study.md#case-678)

**Category**: Gimmick — mode-change orbit  
**Parts**: Phantom Orion B:D (Metal Fury)  
**Key Physics**: Phantom Orion: large disc radius (r ≈ 3.3 cm) + B:D bearing tip (μ = 0.05). Orbit mode at high ω → LAD orbit at r ≈ 9–12 cm. Stamina mode at low ω → slow stable spiral. Mode change threshold ω_transition ≈ 150–200 rad/s (40% stability). Seven-nebula resonance: geometric symmetry creates 7-fold contact pattern at specific ω values.  
**Engine Note**: Phantom Orion orbit-to-stamina mode transition; B:D bearing LAD; 7-fold geometric resonance.

---

### [Case 679 — [SPECIAL MOVE] Barnard's Loop: Seven-Star QTE Constellation Blast — Area-Wide Nebula Shockwave](./13%20case%20study.md#case-679)

**Category**: Special Move — orbital AoE  
**Bey / Blader**: Chris / Phantom Orion B:D  
**Franchise Move**: Orion's constellation spirit manifests a nebula shockwave covering the entire arena.  
**Key Physics**: 7-fold resonance contact pattern (Case 678) amplified to area-wide AoE. QTE: 7 rapid inputs unlocks full constellation blast. aoeRadiusPx = maximum (entire arena). knockbackImpulse radial outward from center. spinDelta negative (drain all beys in range). BeySpirit: nebula energy unlimited.  
**Engine Note**: QTE-gated 7-input constellation; full-arena AoE; negative spinDelta drain field; radial knockback.

---

### [Case 680 — [COMBO] Nebula Surge: Seven-Star Resonance Orbital Strike (3-key: →→K)](./13%20case%20study.md#case-680)

**Category**: Combo — orbital strike  
**Sequence**: →→K  
**Key Physics**: Combo expression of Case 678 Barnard's Loop orbit. High-speed orbit pass exploiting 7-fold resonance contact. damageMultiplier from resonance contact geometry. Cost 15. cooldownMs = one full orbit period (~900ms).  
**Engine Note**: resonance orbit contact bonus; cost 15; cooldown = one orbit.

---

### [Case 681 — [GIMMICK] Bear Ax Attack: Galzzly AR Axe-Head Geometry and Aerial Rebound Strike Mechanics](./13%20case%20study.md#case-681)

**Category**: Gimmick — axe geometry  
**Parts**: Galzzly AR (Original Series / Bakuten Shoot)  
**Key Physics**: Galzzly AR: wide flat top face (axe-head profile) at r = 2.6 cm. Axe face width w_axe = 12 mm, φ_top = 0° (horizontal face). Upper-attack force decomposition: at θ_tilt = 20°, F_up = F_N × sin(20°) = 0.342 × F_N. Aerial rebound: bey hit upward with v_z → falls back and delivers second strike at v_z_fall = √(2 × g × h_rise) = v_z.  
**Engine Note**: axe-head horizontal face geometry; upper-attack force model; two-hit aerial rebound chain.

---

### [Case 682 — [SPECIAL MOVE] Bear Ax Attack: Grizzly Aerial Rampage — Progressive QTE Axe-Slam Chain with Vulnerability Penalty](./13%20case%20study.md#case-682)

**Category**: Special Move — axe chain QTE  
**Bey / Blader**: Galman / Galzzly (Bakuten Shoot)  
**Franchise Move**: Galzzly bear spirit hammers opponent with aerial axe-slam chain.  
**Key Physics**: Galzzly axe geometry (Case 681) anime-amplified. QTE: progressive button sequence unlocks additional axe slams (each slam = J_axe = F_N × 0.342 × (1+e)). Vulnerability penalty: if QTE failed, attacker exposed to counter. First hit: v_z launch. Second hit: falling axe-slam (same v_z_fall = v_z). N-th hit in chain: each slam amplified by BeySpirit.  
**Engine Note**: QTE-progressive chain; vulnerability penalty on miss; aerial rebound chain model; BeySpirit chain amplification.

---

### [Case 683 — [COMBO] Grizzly Slam: Single Overhead Axe Drop (3-key: ↑K↓)](./13%20case%20study.md#case-683)

**Category**: Combo — axe drop  
**Sequence**: ↑K↓  
**Key Physics**: Combo expression of Case 681 axe geometry. Single overhead axe-drop: upper-attack face delivers F_up on opponent. ↑K↓ encodes: launch upward → attack contact → follow-down. Single slam (no chain). damageMultiplier from horizontal axe face (φ = 0°, cosine = 1.0 → maximum vertical component). Cost 15.  
**Engine Note**: single-slam subset of full QTE chain; horizontal face maximum vertical component; ↑K↓ up-attack-down encoding.

---

### [Case 684 — [GIMMICK] Acid Needle: Rock Scorpio T125JB Seismic Tremor Architecture and JB Spike-Ball Tip Micro-Torque Pulse Coupling](./13%20case%20study.md#case-684)

**Category**: Gimmick — tremor/tip  
**Parts**: Rock Scorpio AR + T125 track + JB Spike-Ball tip (Metal Fusion)  
**Key Physics**: JB (Spike Ball) tip: alternates between spike (r = 0.5 mm, very high pressure) and ball (r = 5 mm, rolling) contact as it rotates. Frequency: f_pulse = ω / (2π × N_spikes) where N_spikes = 4 → f_pulse = 600/(2π×4) ≈ 23.9 Hz. Each spike contact: micro-torque pulse Δτ = 0.5 × peak_spike_force. Seismic tremor: pulse train resonates with opponent I if f_pulse ≈ f_resonance = ω_opp / (2π).  
**Engine Note**: spike-ball tip pulse frequency model; micro-torque pulse train; resonance condition with opponent ω.

---

### [Case 685 — [SPECIAL MOVE] Acid Needle: Scorpion Beast Stinger Shockwave — Seismic Primer + Venom Bolt Detonation](./13%20case%20study.md#case-685)

**Category**: Special Move — tremor + venom detonation  
**Bey / Blader**: Kenta Yumiya / Rock Scorpio T125JB  
**Franchise Move**: Scorpion beast plants its stinger, causing seismic tremors that prime a venom bolt detonation.  
**Key Physics**: Phase 1 (seismic primer): JB tremor pulse train applied to arena floor → opponent I resonates. Phase 2 (venom bolt): targeted spike impulse exploiting resonance. Physical ceiling: resonance amplification ~ √(Q_factor) ≈ 3–5×. Anime: full arena seismic + detonation. Compulsion: stunned (resonance disrupts opponent orbit). BeySpirit amplifies tremor frequency.  
**Engine Note**: two-phase tremor + detonation; resonance amplification model; arena-floor seismic effect; stunned compulsion.

---

### [Case 686 — [COMBO] Venom Jab: JB Spike Tremor Burst + Upward AR Strike (3-key: ↓KU)](./13%20case%20study.md#case-686)

**Category**: Combo — tremor + upward jab  
**Sequence**: moveDown → defense → moveUp  
**Key Physics**: Combo-scale expression of Case 684 seismic gimmick. Phase 1 (↓): orbit contraction r_prec 50 mm → 22 mm (JB centering spring k = 114 N/m). Phase 2 (K): single JB spike micro-torque burst at max amplitude (F_burst = 0.9 game-units, 80 ms) → spinDelta_tremor = −28 rad/s. Phase 3 (↑): upward AR jab at +4° → stress concentration κ = 1.4×; spinDelta_contact capped = −50 rad/s; combined = −78 rad/s (two independent sources). damageMultiplier = 1.35×; lockMs = 240. Cost 25, stamina-only (JB spring stiffness requires high-gyroscopic-stability assembly).  
**Engine Note**: two independent spin-drain sources; κ stress concentration from upward contact angle; JB part requirement.

> **Cases 687, 688, 689** — confirmed absent from source file (gap in numbering).

---

### [Case 690 — [GIMMICK] SW145 Defense-Mode Outward Wing Deflection and SD Stamina Cone: Sustained Orbital Momentum with Approach-Deflecting Wing Barrier](./13%20case%20study.md#case-690)

**Category**: Gimmick — wing deflection + stamina cone  
**Parts**: Ninja Salamander SW145SD (Metal Masters) — SW145 track + SD tip  
**Key Physics**: SW145 Defense mode: rounded wing backs present θ_face ≈ 80° to incoming attacks. Force decomposition: F_tangential = 0.985 × F_N (deflected tangentially); F_recoil = 0.174 × F_N (returns along orbit path). Rigid wing attachment transmits full reaction impulse — recoil feeds forward orbital momentum. I_SW145 = 1.214 × 10⁻⁶ kg·m² (16.7% of assembly I — highest I contribution of any 145-class track). SD tip: half-apex cone 30°; dω/dt = 0.102 rad/s² (best in D family); minimal floor drag during wide orbits.  
**Engine Note**: deflection geometry vs smash geometry; orbital momentum supplement from recoil; I_track contribution model.

---

### [Case 691 — [SPECIAL MOVE] Blazing Ring Shot: Shinobu Hiryuin / Ninja Salamander SW145SD](./13%20case%20study.md#case-691)

**Category**: Special Move — fire ring orbital  
**Bey / Blader**: Shinobu Hiryuin / Ninja Salamander SW145SD (Metal Masters)  
**Franchise Move**: Salamander orbits at full arena radius, leaving a fire-trail ring that contracts inward, knocking opponents upward. Survived only by Gladiator Bahamdia SP230GF.  
**Key Physics**: Phase 1 (circuit_build 1800 ms): full circuit at r = 0.88 × r_arena; fire ring persists as arena obstacle. Phase 2 (ring_contract): ring shrinks at 40 px/s; must_stay_still on all opponents (no gap in 360° ring). On contact: spinDelta = −480 rad/s; radial impulse 4200 eu; vertical impulse 1800 eu (upward knock from SD cone angle amplified). SP230 height exception: ring contacts at h = 14.5 mm; SP230-height wheel plane ≈ 24 mm → ring misses wheel, spinDelta = −120 only. BeySpirit amplifies ring contraction into full inescapable closure.  
**Compatible beys**: Any beyblade.  
**Engine Note**: fire ring as arena obstacle; SP230 height exception faithfully encoded; vertical impulse from cone-angle amplification.

---

### [Case 692 — [COMBO] Ring Orbit: Single-Lap SW145 Defense Wing Orbital Strike (3-key: →→J)](./13%20case%20study.md#case-692)

**Category**: Combo — orbital deflection strike  
**Sequence**: moveRight → moveRight → attack  
**Key Physics**: Combo expression of Case 690 orbital persistence. Two rightward arcs accumulate SW145 wall-deflection recoil forward impulse: supplement ≈ 2 × 0.174 × F_wall = 0.348 × F_wall above baseline. Attack fires Defense-wing mid-arc contact (θ = 80° rounded face); damageMultiplier = 1.20×; spinDelta = −26 rad/s; lockMs = 30 (glancing contact). Post-strike: orbit momentum carries Salamander past target (70% speed retention). Cost 10, stamina-only.  
**Engine Note**: wall-deflection recoil accumulation model; glancing contact force decomposition; orbital continuation post-strike.

---

### [Case 693 — [GIMMICK] Blazebringer Ring Limit Break Outer-Frame Rotation and Bound-Blade Impact Reflection](./13%20case%20study.md#case-693)

**Category**: Gimmick — ratchet unlock + elastic reflection  
**Parts**: Helios Blazebringer Ou Zone'+Z (Beyblade X / Superking era) — Volcano Ring + Ou disc + Zone'+Z driver  
**Key Physics**: Locked state (5 blades, 27.8% circumference): standard rigid contact. Limit Break trigger: (a) single strong hit δL ≥ 6.93 × 10⁻⁴ N·m·s, or (b) ~23 progressive contacts (ratchet advance). Unlocked state: 10 blades (20% more cross-section); e_bound = 0.35; J_reflected = 0.35 × J_incoming back to attacker. Ou disc (m = 30.0 g, I_Ou = 1.326 × 10⁻⁵ kg·m² = 47.4% of assembly) required: Ou ratchet teeth mesh with ring locking mechanism. Zone'+Z Z Chip free-spinning plate provides post-recoil stabilisation.  
**Engine Note**: ratchet unlock threshold; bound-blade elastic reflection coefficient; Ou disc requirement for mechanism.

---

### [Case 694 — [SPECIAL MOVE] Blazing Recoil: Hikaru Hizashi / Helios Blazebringer Ou Zone'+Z](./13%20case%20study.md#case-694)

**Category**: Special Move — counter-attack amplification  
**Bey / Blader**: Hikaru Hizashi / Helios Blazebringer Ou Zone'+Z (BX / Superking)  
**Franchise Move**: In Limit Break mode, movable blades push off the opponent's attack and gain tremendous speed to crash back harder.  
**Key Physics**: Phase 1 (limit_break_stance): opponent must_attack 3000 ms. QTE "Recoil Timing" (120 ms window): success → 2.8× amplification of stored J; fail → passive 0.35× only. Phase 2b (QTE success): counter_impulse = 2.8 × J_attack; spinDelta_target = −800 × (J_attack / J_MAX); damageMultiplier = 2.5×; burst_modifier +0.20; Helios spinGain +120 rad/s (elastic rebound). Ares Paradox: harder opponent attacks → bigger counter. BeySpirit amplifies blade compression to 100% energy storage.  
**Compatible beys**: Any beyblade.  
**Engine Note**: QTE-gated amplification; counter impulse scales with attacker force; 120 ms timing window.

---

### [Case 695 — [COMBO] Bound Strike: Player-Skill Limit Break Reflection Counter (3-key: KKJ)](./13%20case%20study.md#case-695)

**Category**: Combo — defensive counter  
**Sequence**: defense → defense → attack  
**Key Physics**: Combo expression of Case 693 Limit Break. KK inputs simulate ratchet advance (δL ≈ 6 × 10⁻⁴ N·m·s, near threshold); brief Limit Break unlock (600 ms window). J input fires Ou disc momentum counter-launch: damageMultiplier = 1.35×; spinDelta = −50 rad/s; lockMs = 80; spinGain for Helios +8 rad/s (elastic rebound). Cost 25, defense-only. Mode unlock on-demand (vs normally requiring battle-earned ratchet progression).  
**Engine Note**: on-demand Limit Break mode change via combo; elastic rebound spin gain; defense-type restriction.

---

### [Case 696 — [GIMMICK] Thermal Pisces T125ES Torroidal Air Vortex Architecture: Elevated-Tip Air-Column Induction and Acoustic Resonance Disruption](./13%20case%20study.md#case-696)

**Category**: Gimmick — air vortex + acoustic disruption  
**Parts**: Thermal Pisces T125ES (Metal Fight Beyblade) — T125 track + ES tip  
**Key Physics**: T125 (h = 12.5 mm) + ES (h = 10.63 mm) create h_cavity ≈ 23 mm below wheel. Centrifugal pumping: v_radial = ω × r_outer = 600 × 0.030 = 18 m/s draws axial updraft through ES column, completing toroidal vortex loop. Acoustic blade-passage pulse: f_pulse = N_blades × ω / (2π) ≈ 573 Hz [ESTIMATED N_blades = 6]; strident/disturbing 500–1000 Hz range. ES bushing (τ_bushing = 2.21 × 10⁻⁴ N·m) absorbs lateral impact transients, maintaining vortex coherence. Passive tremor zone r_vortex ≈ 100 mm: F_vortex = 0.08 × sin(2π × 573 × t) game-units [ESTIMATED].  
**Engine Note**: centrifugal pumping model; blade-passage acoustic frequency; ES bushing vortex coherence; [ESTIMATED] flags on geometry.

---

### [Case 697 — [SPECIAL MOVE] Distortion Drive: Ryutaro Fukami / Thermal Pisces T125ES](./13%20case%20study.md#case-697)

**Category**: Special Move — psychological field / vestibular disruption  
**Bey / Blader**: Ryutaro Fukami / Thermal Pisces T125ES (Metal Fight Beyblade)  
**Franchise Move**: Pisces emits strident sound + air distortion field; creates space-zone illusion where opponents either freeze (fear) or burn (aggression). Countered by vacuum or strong spirit.  
**Key Physics**: Phase 1 (distortion_field 1222 ms): wide orbit 0.70 × r_arena; 573 Hz + infrasonic harmonics (< 50 Hz vestibular disruption); cannot_attack_freely all opponents. Phase 2 (space_illusion 2000 ms): spin ≥ 50% max → FIRE illusion (spinDecayDebuff 1.4×, random impulse 800 eu, cannot_attack_freely); spin < 50% → FREEZE illusion (must_stay_still 2000 ms, decay debuff 0.8×). Vacuum counter or strong spirit (> 75% spin, 30% auto-chance) breaks effect.  
**Compatible beys**: Any beyblade.  
**Engine Note**: branching illusion based on spin ratio; infrasonic vestibular disruption model; vacuum/spirit counter mechanics.

---

### [Case 698 — [SPECIAL MOVE] Blazing Inferno: Ryutaro Fukami / Thermal Pisces T125ES](./13%20case%20study.md#case-698)

**Category**: Special Move — escalating psychological trap  
**Bey / Blader**: Ryutaro Fukami / Thermal Pisces T125ES (Metal Fight Beyblade)  
**Franchise Move**: Begins with Distortion Drive, then forces fire illusion; if opponent resists, escalates to full blizzard. Resisting accelerates the threat.  
**Key Physics**: Phase 1 (distortion_trap 1400 ms): shortened Distortion Drive (Case 697) setup. Phase 2 (small_fire 1800 ms): must_attack compulsion; spinDecayDebuff 1.5×; counter check → success ESCALATES to Phase 3 (not escapes). Phase 3 (full_blizzard 1222 ms): BeySpirit ice column; must_stay_still; spinDelta ALL opponents within 0.80 × r_arena = −600 rad/s; burst_modifier +0.10. Counter in Phase 3 requires > 80% spin. Self-cost −300 total spinDelta. Longest cooldown: 6000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: counter-escalation mechanic (resistance worsens effect); per-phase counter thresholds; AoE spinDelta in Phase 3.

---

### [Case 699 — [COMBO] Distortion Cage: Single-Lap Vortex Disruption Orbit (3-key: L→J→L)](./13%20case%20study.md#case-699)

**Category**: Combo — vortex harassment  
**Sequence**: moveLeft → attack → moveLeft  
**Key Physics**: Combo expression of Case 696 vortex gimmick. Left arc concentrates 573 Hz acoustic pulse into forward-facing cone (half-angle 30°); attack fires pressure discharge (spinDelta = −18 rad/s; cannot_attack_freely 200 ms debuff — no direct contact). Second left continues orbit, vortex coherence maintained (85% orbital speed retention). Cost 10, stamina-only. Harassment stacking: 3 activations → −54 rad/s total + 3 × 200 ms disruption windows ≈ 50% combo miss rate for opponent.  
**Engine Note**: non-contact acoustic spinDelta; cannot_attack_freely debuff only; ES bushing stability for tight arcs.

---

### [Case 700 — [GIMMICK] Blazing Gigs: Wing Survivor Dual Contact Geometry and Final Clutch Engine Gear Spring Burst](./13%20case%20study.md#case-700)

**Category**: Gimmick — dual contact geometry + EG spring burst  
**Parts**: Dranzer G (Gigus), Plastic Gen G-Revolution — Wing Survivor AR + Ten Balance WD + Right MSF EG + Final Clutch BB  
**Key Physics**: Wing Survivor AR (m = 4.7 g): RS main contact φ_main ≈ 57.5° (recoil-dominant: J_recoil = 0.843 × J); RS Force Smash slope φ_slope ≈ 25° (smash-dominant: J_smash = 0.906 × J); Upper Attack slope θ = +5° (J_up = 0.087 × J). Final Clutch EG fires at ω_trigger = 141 rad/s (t ≈ 4.3 s): τ_burst = 0.060 N·m → Δω = +38 rad/s → ω_post = 179 rad/s. At post-burst speed, slopes engage more frequently (gentler approach → smash-dominant mode shift). MSF tip: dω/dt = 25.6 rad/s²; spin life 9.8 s.  
**Engine Note**: dual contact mode shift at burst threshold; Final Clutch timing model; smash/recoil ratio per contact face angle.

---

### [Case 701 — [SPECIAL MOVE] Blazing Gigs: Kai Hiwatari / Dranzer G](./13%20case%20study.md#case-701)

**Category**: Special Move — fire phoenix projectile  
**Bey / Blader**: Kai Hiwatari / Dranzer G (G-Revolution)  
**Franchise Move**: Dranzer G erupts into flames coalescing into a blazing phoenix; BeySpirit shoots it as a flaming projectile. Orange flames (40–70% spin); blue flames (≥ 70% spin). Zan variant slices through defensive shells.  
**Key Physics**: BeySpirit re-engages Final Clutch spring regardless of prior state (anime physics override). Upper Attack angle amplified: 5° → 28° (phoenix dive). Orange: spinDelta = −440 rad/s; impulse 3800 eu; damageMultiplier 2.0×; fireDebuff γ × 1.3× / 2000 ms. Blue: spinDelta = −610 rad/s; impulse 5200 eu; damageMultiplier 2.6×; fireDebuff γ × 1.4× / 2500 ms. Zan variant: burst_threshold_modifier +0.20; damageMultiplier +0.3×. QTE "Phoenix Dodge" 200 ms window.  
**Compatible beys**: Any beyblade.  
**Engine Note**: two power tiers keyed to spin ratio; Zan conditional on target burst threshold; Final Clutch BeySpirit override.

---

### [Case 702 — [COMBO] Phoenix Upper: Wing Survivor Dual-Contact Two-Source Strike (3-key: J↑J)](./13%20case%20study.md#case-702)

**Category**: Combo — dual-source upper attack  
**Sequence**: attack → moveUp → attack  
**Key Physics**: Combo expression of Case 700. Phase 1 (J): main contact φ = 57.5°; spinDelta_1 = −28 rad/s; self recoil return +8 rad/s. Phase 2 (↑): Upper Attack arc entry at r = 35 mm; spinMicroGain +3 rad/s. Phase 3 (J): Upper slope θ = +5°; spinDelta_2 = −50 rad/s (ceiling); κ = 1.35×; damageMultiplier = 1.35×; lockMs = 160. Two independent sources (−28, −50) each satisfy ≤ 50 rad/s ceiling. Cost 25, attack-only.  
**Engine Note**: two-source spinDelta independent ceiling check; κ stress concentration; orbital continuation.

---

### [Case 703 — [GIMMICK] Gatling Claw: Triple Tiger 3-Fold Tangential Smash and First Clutch Engine Gear Launch Burst](./13%20case%20study.md#case-703)

**Category**: Gimmick — 3-fold smash AR + launch-burst EG  
**Parts**: Driger G (Gatling), Plastic Gen G-Revolution — Triple Tiger AR + Ten Balance WD + Right MSF EG + First Clutch BB  
**Key Physics**: Triple Tiger AR (m = 6.3 g): 3-fold symmetry at r_head = 22 mm; RS face φ ≈ 15° (smash-dominant: J_smash = 0.966 × J, J_recoil = 0.259 × J); LS face φ ≈ 62° (recoil-dominant). f_attack = 3 × ω / (2π) = 119 Hz at ω₀ = 250 rad/s. First Clutch EG fires at battle start: τ_burst = 0.060 N·m → Δω = +37 rad/s → ω_peak = 287 rad/s for ~200 ms. Overhang h_contact ≈ −3 mm below WD plane compensates for EG chassis height.  
**Engine Note**: 3-fold attack-window frequency model; First Clutch launch-phase vs Final Clutch mid-battle timing; RS/LS face asymmetry.

---

### [Case 704 — [SPECIAL MOVE] Gatling Claw: Ray Kon / Driger G](./13%20case%20study.md#case-704)

**Category**: Special Move — multi-clone barrage  
**Bey / Blader**: Ray Kon / Driger G (G-Revolution)  
**Franchise Move**: Green electricity eruption generates tiger-shaped electrical clones that attack from all angles simultaneously.  
**Key Physics**: BeySpirit re-engages First Clutch spring (anime physics override). N_clones = clamp(⌊3 × spin/maxSpin × 1.5⌋ + 2, 3, 5). Each clone attacks from 360/N_clones azimuth; must_stay_still on target 600 ms; per-clone spinDelta = −60 rad/s; impulse 900 eu; damageMultiplier 1.6×; dodge window 130 ms per clone. Total at 5 clones: −300 rad/s; at 3 clones: −180 rad/s. Self-cost −80 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: N_clones scales with spin ratio; carousel azimuth distribution; per-clone dodge windows.

---

### [Case 705 — [SPECIAL MOVE] Gatling Claw Maximum: Ray Kon / Driger G](./13%20case%20study.md#case-705)

**Category**: Special Move — single super-speed strike  
**Bey / Blader**: Ray Kon / Driger G (G-Revolution)  
**Franchise Move**: Lightning bolt strikes Driger G; imperceptible speed charge. Countered by Blazing Gigs Tempest feather storm (arena-wide cannot_move).  
**Key Physics**: BeySpirit First Clutch override: Δω_BeySpirit = +120 rad/s (vs normal +37); ω_peak = 370 rad/s; orbital speed 3.5× baseline. Single Triple Tiger RS contact (φ = 15°): spinDelta = −650 rad/s; impulse 6500 eu; damageMultiplier 2.6×. QTE "Imperceptible Dodge" 80 ms window (vs 130 ms in Gatling Claw). Self-cost −200 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: reduced QTE window from super-speed; BeySpirit spring amplification 3.2×; single-hit concentrated damage.

---

### [Case 706 — [SPECIAL MOVE] Gatling Fang: Ray Kon / Driger G](./13%20case%20study.md#case-706)

**Category**: Special Move — rapid-fire multi-hit rush  
**Bey / Blader**: Ray Kon / Driger G (G-Revolution)  
**Franchise Move**: 連射牙撃 (Rensha Kigeki) — high-speed multi-hit rush at close range.  
**Key Physics**: BeySpirit First Clutch override; orbit tightens to r_prec = 25 mm; ω_burst = 290 rad/s; N_hits = clamp(4 + ⌊spin/maxSpin × 3⌋, 4, 6); hit interval 100 ms; per-hit spinDelta = −65 rad/s; impulse 1100 eu; damageMultiplier 1.7×; per-hit QTE dodge 100 ms (move > 60 px breaks cadence). Total at 6 hits: −390 rad/s. Self-cost −160 spinDelta. Design: cumulative attrition; full-spin opponent below stability threshold in ~2 activations.  
**Compatible beys**: Any beyblade.  
**Engine Note**: N_hits scales with spin tier; cadence break on dodge; close-orbit cadence vs Maximum single-strike.

---

### [Case 707 — [COMBO] Tiger Rush: Triple Tiger RS Tangential Two-Strike Orbit Continuation (3-key: →JJ)](./13%20case%20study.md#case-707)

**Category**: Combo — two-source RS/LS strike  
**Sequence**: moveRight → attack → attack  
**Key Physics**: Combo expression of Case 703. Phase 1 (→): orbital arc sets up RS tangential alignment (φ = 15°). Phase 2 (J): RS contact spinDelta_1 = −50 rad/s (ceiling); damageMultiplier 1.25×; lockMs 60. Phase 3 (J): follow-up LS rearward contact (φ = 62°); spinDelta_2 = −28 rad/s; orbital speed retained 60%. Two independent sources (−50, −28) each satisfy ≤ 50 rad/s ceiling. Cost 25, attack-only.  
**Engine Note**: RS/LS follow-through model; orbital continuation post-strike; two-source independent ceiling.

---

### [Case 708 — [GIMMICK] Reverse Flame Gigs: Triangle Wing Symmetric Upper Attack and Right Engine Gear Reverse Counter-Rotation](./13%20case%20study.md#case-708)

**Category**: Gimmick — bilateral upper AR + CEW counter-rotation  
**Parts**: Dranzer GT (Gigus Turbo), Plastic Gen G-Revolution — Triangle Wing AR + Right EG Reverse + Final Clutch BB + CEW Metal Semi-Flat  
**Key Physics**: Triangle Wing AR (m = 6.1 g): 3-fold, both RS and LS faces identical at α = 30°; J_vertical = 0.500 × J from either side — no "wrong side" approach. Smash head φ = 35°: J_smash = 0.819 × J. Right EG Reverse: CEW tip rotates CCW (counter to CW shell); at ω ≈ 100–150 rad/s, F_tip ≈ F_shell → net lateral ≈ 0 (movement damping ~300–500 ms). Damped hesitation window couples with Triangle Wing Upper for surprise contact at 0 relative lateral velocity. Final Clutch fires at t ≈ 4.3 s.  
**Engine Note**: bilateral AR symmetry; movement-damping window from CEW force competition; hesitate-then-lunge timing mechanic.

---

### [Case 709 — [SPECIAL MOVE] Reverse Flame Gigs: Kai Hiwatari / Dranzer GT](./13%20case%20study.md#case-709)

**Category**: Special Move — orbital reversal counter  
**Bey / Blader**: Kai Hiwatari / Dranzer GT (G-Revolution)  
**Franchise Move**: "Turbo Reverse Attack" — gears reverse (physically impossible per Kenny). Dranzer GT orbital direction reverses; fire surrounds; Dranzer BeySpirit attacks. Frictional heat could melt a bey like cheese. Self-sacrifice move. Record: 1 win, 2 countered.  
**Key Physics**: Phase 1 (turbo_reverse_arm 400 ms): BeySpirit overrides Right EG Reverse spring direction (anime physics override — mechanically impossible); CW orbit → CCW orbit; fire aura r = 0.45 × r_arena; spinDrainAura 6 rad/s/s within aura; cannot_attack_freely all opponents. Phase 2 (reverse_flame_strike): θ_effective = +12° (reverse approach adds +7° to normal +5°); κ = 1.5×; spinDelta = −700 rad/s; impulse 9500 eu; damageMultiplier 3.0×; fireDebuff γ × 2.0× / 3000 ms. QTE "Reverse Anticipation" 250 ms. Self-cost −180 spinDelta → ω ≈ 70 rad/s (below stability threshold → nutation wobble).  
**Compatible beys**: Any beyblade.  
**Engine Note**: orbital direction reversal (anime override); near-KO self-cost; nutation wobble trigger post-activation.

---

### [Case 710 — [COMBO] Reverse Gear: Triangle Wing LS Upper Attack with Left-Orbit Entry (3-key: ←J↑)](./13%20case%20study.md#case-710)

**Category**: Combo — LS upper attack  
**Sequence**: moveLeft → attack → moveUp  
**Key Physics**: Combo expression of Case 708 bilateral symmetry. Left orbit entry exploits Triangle Wing LS face (α = 30°, identical to RS). Attack fires LS Upper contact: spinDelta = −40 rad/s; κ = 1.20×; damageMultiplier 1.30×; lockMs 140 (upper J disrupts precession). MoveUp: upward post-contact arc continues at θ ≈ +8° above orbit plane for elevated follow-up positioning. Cost 25, attack-only.  
**Engine Note**: LS orbit entry exploiting bilateral AR symmetry; no "wrong side" — identical damage from either direction.

---

### [Case 711 — [GIMMICK] Blazer Slash: Flat Tip Aggressive Flower-Pattern Orbit and Cyclone Wheel Attack Architecture](./13%20case%20study.md#case-711)

**Category**: Gimmick — F-tip flower orbit + smash wheel  
**Parts**: Cyclone Herculeo 105F (Metal Masters) — Cyclone wheel [M] + 105 track + F tip  
**Key Physics**: F tip (r_flat = 2.04 mm, μ = 0.35 ABS): τ_spin = 2.34 × 10⁻⁴ N·m; dω/dt = 23.4 rad/s²; spin life = 25.6 s. Lateral drive F_lat = 0.172 N; orbit radius R_curve = 73 mm (stadium-scale flower pattern at V_orb = 0.5 m/s). 105 track (h = 10.5 mm): standard height, no functional gimmick. Cyclone wheel [M]: wind-blade smash geometry, r_outer ≈ 23 mm, COR ≈ 0.80. Every orbit is both an acceleration and attack opportunity.  
**Engine Note**: lateral drive force orbit radius model; F-tip flower pattern self-propulsion; smash geometry at full orbital velocity.

---

### [Case 712 — [SPECIAL MOVE] Blazer Slash: Ian Garcia / Cyclone Herculeo 105F](./13%20case%20study.md#case-712)

**Category**: Special Move — inward spiral fire slam  
**Bey / Blader**: Ian Garcia / Cyclone Herculeo 105F (Metal Masters)  
**Franchise Move**: Cyclone Herculeo covered in red blaze, slams into opponent with great force.  
**Key Physics**: Phase 1 (blazing_spiral 600 ms): F_lat amplified 3.2× by Herculeo BeySpirit; V_orb → 3.2 m/s; spiral inward r = 73 mm → 20 mm; fire aura r = 50 mm; cannot_attack_freely within aura; spinDelta −40 per entry tick. Phase 2 (cyclone_slam): spinDelta = −520 rad/s; impulse 5000 eu; damageMultiplier 2.2×; fireDebuff γ × 1.3× / 2000 ms. QTE "Blazer Dodge" 180 ms window. Self-cost −280 spinDelta (front-loads remainder of spin life into one contact).  
**Compatible beys**: Any beyblade.  
**Engine Note**: BeySpirit lateral drive amplification 3.2×; inward spiral as wind-up; 600 ms visible approach window.

---

### [Case 713 — [COMBO] Herculeo Flame Rush: Flat Tip Double Orbital Strike (3-key: JJ→)](./13%20case%20study.md#case-713)

**Category**: Combo — double orbital strike  
**Sequence**: attack → attack → moveRight  
**Key Physics**: Combo expression of Case 711. Phase 1 (J): Cyclone wheel contact at peak orbit; spinDelta_1 = −50 rad/s (ceiling); orbital speed retention 65% (F-tip broad flat face vs sharp/ball tips). Phase 2 (J): follow-up contact at 65% speed; spinDelta_2 = −35 rad/s; lockMs 60. Phase 3 (→): F_lat = 0.172 N curves orbit back within 0.4 s for repeat approach. Cost 25, attack-only.  
**Engine Note**: F-tip orbital retention post-impact enables two-hit combo; 0.4 s orbit re-establishment window.

---

### [Case 714 — [GIMMICK] Blaze Wall: Evil Gemios DF145FS Twin-Face Contact Architecture and DF145 Downforce-Stabilised FS Hybrid Tip](./13%20case%20study.md#case-714)

**Category**: Gimmick — FS hybrid tip mode-transition + DF145 downforce  
**Parts**: Evil Gemios DF145FS (Metal Masters) — Evil wheel [M] + DF145 track + FS tip  
**Key Physics**: FS tip [M estimated]: upright (tilt < 15°) → sharp point r = 0.3 mm; dω/dt = 0.28 rad/s² (stamina). Tilted (tilt ≥ 15°) → flat ring r = 2.0 mm; dω/dt = 23.0 rad/s²; F_lat = 0.172 N (attack). Self-adapting: stable = stamina; disrupted = attack. DF145 (Case 254): h = 14.5 mm; F_lift = 2 × 10⁻³ N (marginal normal force increase; at BeySpirit scale → flame barrier). Gemios twin-face clear wheel: two contact points 180° apart — bilateral simultaneous contacts.  
**Engine Note**: tilt-angle tip mode transition; DF145 vortex as BeySpirit barrier seed; twin bilateral contacts.

---

### [Case 715 — [SPECIAL MOVE] Blaze Wall: Dan and Reiki Sodo / Evil Gemios DF145FS](./13%20case%20study.md#case-715)

**Category**: Special Move — twin-BeySpirit fire shield  
**Bey / Blader**: Dan and Reiki Sodo / Evil Gemios DF145FS (Metal Masters)  
**Franchise Move**: Fire Twin creates a circular fire shield that deflects incoming attacks.  
**Key Physics**: Phase 1 (twin_summon 300 ms): two BeySpirits generate left + right fire hemispheres; r_shield = 90 mm; incomingDamageReduction 40%. Phase 2 (blaze_wall_active 2000 ms): damageReduction 50%; fire thermal return: 30% of incoming spinDelta → fireDebuff on attacker (γ × 1.4× / 2500 ms); spinDrainAura 4 rad/s/s within shield; Gemios spinGain +2 rad/s/s. QTE "Twin Break": 3 hits within 400 ms with ≥ 1 on each hemisphere → shield breaks (Gemios takes 55% damage); same-side hits → full absorption persists.  
**Compatible beys**: Any beyblade.  
**Engine Note**: twin-spirit bilateral hemisphere structure; fire thermal return (not elastic reflection); Twin Break QTE mechanic.

---

### [Case 716 — [COMBO] Twin Flame Brace: DF145 Vortex Partial Shield with FS Stability Stance (3-key: K↑K)](./13%20case%20study.md#case-716)

**Category**: Combo — defensive shield + tilt transition  
**Sequence**: defense → moveUp → defense  
**Key Physics**: Combo expression of Case 714. Phase 1 (K): DF145 partial vortex brace; incomingDamageReduction 20%; spinGain +4 rad/s. Phase 2 (↑): FS tilt transition to flat ring mode → F_lat = 0.172 N → orbital reposition +25 px (defensive spacing). Phase 3 (K): DF145 full vortex re-establishment; incomingDamageReduction 25%; spinGain +3 rad/s; brief flame burst (100 ms) on any contact. Total spinGain +7 rad/s (below recovery ceiling). Cost 20, defense-only.  
**Engine Note**: FS mode-change as combo phase; combined +7 rad/s spin recovery within ceiling; no invulnerability (damage reduction only).

---

### [Case 717 — [GIMMICK] Blast Impress: Cyber Dranzer Aerial Dive Architecture — High-Elevation AR Contact and Spin-Dump Launch Mechanics](./13%20case%20study.md#case-717)

**Category**: Gimmick — aerial dive / self-sacrifice  
**Parts**: Cyber Dranzer, Plastic Gen V-Force era [all parts M]  
**Key Physics**: Bowl wall ramp-up converts spin to aerial trajectory (launch angle ≈ 40–50°). Dive contact: θ_dive ≈ 35–40° below horizontal; J_up = J × sin(38°) = 0.616 × J; κ ≈ 1.3× stress concentration. Fixed self-cost −185 spinDelta → ω_after ≈ 65 rad/s (26% of ω₀ = 250 rad/s → below 40% stability → immediate nutation wobble). Draw risk: if opponent was already near-KO, simultaneous topple. Activation requires ≥ 50% spin.  
**Engine Note**: aerial dive geometry from bowl wall; fixed self-cost regardless of hit; draw detection if both spin ≤ 0 simultaneously.

---

### [Case 718 — [SPECIAL MOVE] Blast Impress: Goki / Cyber Dranzer](./13%20case%20study.md#case-718)

**Category**: Special Move — self-sacrifice fire dive  
**Bey / Blader**: Goki / Cyber Dranzer (Original Series V-Force)  
**Franchise Move**: Cyber Dranzer launches as fire projectile in aerial dive. Near-guaranteed self-KO; possible draw if opponent is at low spin.  
**Key Physics**: Phase 1 (aerial_launch 300 ms): fire aura; vertical launch 45°; must_stay_still on target. Phase 2 (fire_dive_contact): spinDelta = −500 rad/s; impulse 4200 eu; damageMultiplier 2.4×; fireDebuff γ × 1.5× / 3000 ms; upward knockup 70 ms. Draw condition: if both spin ≤ 0 post-strike → draw. Miss dodge: self-cost −185 still applied. QTE "Dive Dodge" 200 ms. Cyber Dranzer nutationWobble activates post-cost.  
**Compatible beys**: Any beyblade.  
**Engine Note**: mandatory self-cost regardless of hit/miss; draw detection mechanic; fixed activation ≥ 50% spin requirement.

---

### [Case 719 — [COMBO] Dive Fang: Cyber Dranzer Angled Aerial Entry Strike (3-key: ↑J↓)](./13%20case%20study.md#case-719)

**Category**: Combo — aerial angled strike  
**Sequence**: moveUp → attack → moveDown  
**Key Physics**: Combo expression of Case 717 aerial architecture. Phase 1 (↑): bowl wall ramp-up to θ = +20° above orbit plane; self spin drain −15 rad/s (arc friction). Phase 2 (J): AR contact at +20°; J_smash = cos(20°) × J = 0.940 × J; J_up = 0.342 × J; spinDelta = −50 rad/s (ceiling); κ = 1.20×; damageMultiplier 1.35×; lockMs 200 (axis disruption from upward J). Phase 3 (↓): re-anchor to flat orbit; −5 rad/s drain. Cost 25, attack-only.  
**Engine Note**: elevated-angle contact via bowl wall; scaled-down aerial strike without near-KO self-cost; lockMs from upward impulse.

---

### [Case 720 — [GIMMICK] Blast Beat: Omni Odax Smash Blade Contact Architecture and Xtreme Bit XD-Accelerated Orbital Drive](./13%20case%20study.md#case-720)

**Category**: Gimmick — XD orbital drive + high-frequency smash  
**Parts**: Omni Odax Triple Xtreme (Beyblade X) — Odax blade [M] + Triple ratchet [M] + Xtreme bit [M]  
**Key Physics**: Xtreme bit [M estimated]: r_eff ≈ 1.5 mm; η_xd ≈ 1.10; dω/dt ≈ −8.0 rad/s²; spin life 87.5 s. XD orbit: v_orb ≈ 4.0 m/s; T_orbit = 0.165 s; 6.1 orbits/s. Omni Odax blade [M]: C₃ geometry (3-fold), r_outer ≈ 22 mm; f_attack = 3 × 6.1 = 18.3 Hz (strike attempt every ~55 ms). XD per-engagement spin cost Δω ≈ 20 rad/s [Case 405 analogy]. Every XD line pass = acceleration event + attack opportunity.  
**Engine Note**: XD orbital drive frequency model; attack-opportunity cadence per revolution; [M] flags on all parts.

---

### [Case 721 — [SPECIAL MOVE] Blast Beat: Orochi Ginba / Omni Odax Triple Xtreme](./13%20case%20study.md#case-721)

**Category**: Special Move — multi-direction XD barrage  
**Bey / Blader**: Orochi Ginba / Omni Odax Triple Xtreme (Beyblade X)  
**Franchise Move**: Similar to Valt Aoi's Rush Launch; Odax orbits at high speed attacking from all directions simultaneously.  
**Key Physics**: Phase 1 (xd_wind_up 800 ms): BeySpirit amplifies v_orb to 6.5 m/s (9.9 orbits/s); ORBIT_CHARGE += 1 per completed orbit (max 3 in ~300 ms); cannot_attack_freely on target. Phase 2 (beat_barrage 600 ms): N_BEAT = 4 + ORBIT_CHARGE (range 4–7); strike interval 80 ms; per-strike spinDelta = −50 rad/s; impulse 650 eu; damageMultiplier 1.5×; must_stay_still. QTE "Beat Break": 4 correct ←→←→ alternating inputs within 400 ms → escape at 50% damage. Total at 7 strikes: −350 rad/s. BeySpirit suspends spin decay during barrage; self-cost only −60 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: ORBIT_CHARGE wind-up mechanic; alternating-input Beat Break QTE; BeySpirit spin-decay suspension.

---

### [Case 722 — [COMBO] Odax Orbit: XD-Accelerated Tangential Strike with Orbit Continuation (3-key: →J→)](./13%20case%20study.md#case-722)

**Category**: Combo — XD orbital strike  
**Sequence**: moveRight → attack → moveRight  
**Key Physics**: Combo expression of Case 720. Phase 1 (→): XD orbital arc entry at v_orb = 4.0 m/s; XD self-cost −20 rad/s (fixed orbital mechanic). Phase 2 (J): Odax blade smash (φ ≈ 20° [M]); spinDelta = −50 rad/s (ceiling); damageMultiplier 1.25×; lockMs 40. Phase 3 (→): orbit continuation, ~60% speed retained. XD self-cost is orbital mechanics — not a combat ceiling source. Cost 15, attack-only.  
**Engine Note**: XD engagement cost outside combat ceiling check; orbit continuation for rapid re-entry; [M] blade geometry.

---

### [Case 723 — [GIMMICK] Gravity Perseus AD145WD: Reverse-Rotation Mode-Change, Armor Defense 145 Absorption, and Wide Defense Stamina Tip](./13%20case%20study.md#case-723)

**Category**: Gimmick — LS mode-change + opposite-spin amplification + AD145 absorption  
**Parts**: Gravity Perseus AD145WD (Metal Fight Beyblade) — Gravity wheel [M] + AD145 track + WD tip  
**Key Physics**: Gravity wheel [M]: RS mode φ ≈ 25° (J_smash = 0.906 × J); LS mode φ ≈ 35° (J_smash = 0.819 × J); pre-battle mode-flip. Opposite-spin amplification (LS vs RS): v_rel_tan = ω_A × r_A + ω_B × r_B = 26.4 m/s at equal 600 rad/s (vs ~0 same-spin); η_opp = 1.6× [conservative]. AD145 (Case 253): α_AD = 0.35 (35% lateral impulse absorbed into ring spin). WD (Case 63): dω/dt = −16.2 rad/s²; spin life 37.1 s.  
**Engine Note**: opposite-spin relative velocity model; η_opp amplifier; AD145 lateral absorption fraction.

---

### [Case 724 — [SPECIAL MOVE] Black Excalibur: Julian Konzern / Gravity Perseus AD145WD](./13%20case%20study.md#case-724)

**Category**: Special Move — LS mode smash with BeySpirit  
**Bey / Blader**: Julian Konzern / Gravity Perseus AD145WD (Metal Fight Beyblade)  
**Franchise Move**: Perseus unsheathes the "Jet Black Sword", releases powerful black energy, strikes with massive smash. Always used in LS reverse-rotation mode.  
**Key Physics**: Phase 1 (sword_conjuration 500 ms): BeySpirit enforces LS mode (anime override); cannot_attack_freely target. Phase 2 (black_blade_strike): vs RS opponent (η_opp = 2.0): spinDelta = −560 rad/s; impulse 5500 eu; damageMultiplier 2.4×. vs LS opponent: spinDelta = −380; impulse 3800 eu; damageMultiplier 1.8×. Both: mobility_reduction 30% / 2000 ms. QTE "Sword Guard" 220 ms. Self-cost −200 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: RS vs LS opponent branching damage; BeySpirit LS enforcement; black energy mobility debuff.

---

### [Case 725 — [COMBO] Black Slash: Orbital Feint + LS Mode-Flip Smash (3-key: →←J)](./13%20case%20study.md#case-725)

**Category**: Combo — mode-flip smash  
**Sequence**: moveRight → moveLeft → attack  
**Key Physics**: Combo expression of Case 723. Phase 1 (→): RS orbital approach. Phase 2 (←): orbital reversal temporarily engages LS contact face (combo mode-change rule). Self-cost −10 rad/s (direction-change friction). Phase 3 (J): LS smash at φ = 35°; spinDelta = −50 rad/s (ceiling); damageMultiplier = 1.40× (η_opp elevation within 1.5× ceiling); lockMs 80. Cost 25, attack-only.  
**Engine Note**: combo mode-change via orbital reversal; η_opp elevation within ceiling; direction-change friction as non-combat self-cost.

---

### [Case 726 — [GIMMICK] Aquario 105F: Curved Orbital Attack Geometry and Flat-Tip Aggressive Drive](./13%20case%20study.md#case-726)

**Category**: Gimmick — curved C₄ blade + F-tip orbital drive  
**Parts**: Aquario 105F (Metal Fight Beyblade) — Aquario wheel [M] + 105 track + F tip  
**Key Physics**: Aquario wheel [M]: C₄ geometry (4 fins, 90° spacing); φ_entry ≈ 15° (gradual entry); φ_apex ≈ 30° (peak smash: J_smash = 0.866 × J). F tip (Case 339): r_flat = 2.04 mm; μ = 0.35; F_lat = 0.172 N; dω/dt = −23.4 rad/s²; spin life 25.6 s; R_curve ≈ 73 mm. Curved blade "slides" into engagement for maximum transfer efficiency.  
**Engine Note**: tapered blade engagement gradient; F-tip lateral drive orbit model; Big Wave water-element foundation.

---

### [Case 727 — [SPECIAL MOVE] Big Wave: Mei-Mei / Aquario 105F](./13%20case%20study.md#case-727)

**Category**: Special Move — hydrodynamic destabilisation  
**Bey / Blader**: Mei-Mei / Aquario 105F (Metal Fight Beyblade)  
**Franchise Move**: Aquario creates a huge wave to destabilize the opponent's Beyblade.  
**Key Physics**: Phase 1 (wave_build 700 ms): v_orb → 4.0 m/s; E_orb = 0.400 J; cannot_attack_freely all within r_wave = 200 mm. Phase 2 (wave_crash AoE r = 200 mm): stabilityDebuff = −0.20 for 2500 ms (effective_stability = spin/maxSpin − 0.20 → pushes near-threshold opponents into nutation); linearImpulse_wall 2200 eu (toward wall); spinDelta = −100 rad/s; wet surface debuff +3 rad/s/s decay for 3000 ms. QTE "Wave Ride" (jump): success redirects wall push to 800 eu toward opponent. Self-cost −220 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: stabilityDebuff model for wobble-threshold pushing; AoE wall-push; wet surface decay debuff.

---

### [Case 728 — [COMBO] Aqua Slide: Curved Orbital Sliding Contact (3-key: →J←)](./13%20case%20study.md#case-728)

**Category**: Combo — curved sliding pass  
**Sequence**: moveRight → attack → moveLeft  
**Key Physics**: Combo expression of Case 726. Phase 1 (→): F-tip orbital arc R = 73 mm. Phase 2 (J): Aquario curved blade contact at φ_apex = 30°; spinDelta = −42 rad/s; damageMultiplier 1.20×; lockMs 30 (sliding pass-through). Phase 3 (←): orbit continues, ~70% speed retained (curved gradual blade vs flat deceleration). Cost 15, attack-only.  
**Engine Note**: curved blade orbital speed retention; low lockMs from sliding geometry; rapid chained activation via F-tip.

---

### [Case 729 — [GIMMICK] Evil Befall UW145EWD: Upper Wing Spin Track, Eternal Wide Defense Free-Spin Absorption, and Feather Blade Architecture](./13%20case%20study.md#case-729)

**Category**: Gimmick — UW145 wing upper attack + EWD stamina  
**Parts**: Evil Befall UW145EWD (Metal Masters) — Evil Befall wheel [M] + UW145 track + EWD tip  
**Key Physics**: UW145 (Case 303): 4 wings (C₄); θ_wing = +12°; J_upper = sin(12°) × J = 0.208 × J; r_wing ≈ 21 mm; f_wing = 382 Hz at ω = 600 rad/s. BeySpirit channels wing centrifugal energy into feather-blade projectiles (Case 730) or spiral conduit (Case 731). EWD (Case 302): r_eff_core ≈ 1.5 mm; dω/dt = −5.9 rad/s²; spin life ≈ 101.7 s; α_EWD = 0.45 (45% lateral absorption). Evil Befall wheel [M]: smooth stamina profile φ ≈ 42°, C₂.  
**Engine Note**: UW145 wing upper-angle + wing frequency model; EWD near-point stamina + free-spin absorption; two separate special moves from same assembly.

---

### [Case 730 — [SPECIAL MOVE] Befall The Ripper: Jack / Evil Befall UW145EWD](./13%20case%20study.md#case-730)

**Category**: Special Move — feather-blade zone scatter  
**Bey / Blader**: Jack / Evil Befall UW145EWD (Metal Masters)  
**Franchise Move**: UW145 whirlwind vacuum cutter flings feather-blade projectiles across the battlefield; traces Jack's artwork (rose, peacock) on arena floor. Pink Slash at low spin.  
**Key Physics**: Phase 1 (whirlwind_build 500 ms): BeySpirit wing amplification; must_keep_distance. Phase 2 (feather_scatter, spin ≥ 30%): SPIN_TIER = clamp(⌊spin/maxSpin × 4⌋, 0, 4); N_FEATHER = 8 + SPIN_TIER (8–12); pattern = "rose" (tier ≤ 2) or "peacock" (tier ≥ 3); per-feather slash zone r = 25 mm active 2500 ms; immediate hit spinDelta = −30; zone entry spinDelta = −25; must_keep_distance on primary 2500 ms. Low-spin fallback (spin < 30%): single direct strike spinDelta = −380; impulse 3500 eu; dmg 1.8×. Self-cost −100.  
**Compatible beys**: Any beyblade.  
**Engine Note**: SPIN_TIER pattern selection; persistent slash zones as arena hazards; low-spin fallback branch.

---

### [Case 731 — [SPECIAL MOVE] Beautiful Dead: Jack / Evil Befall UW145EWD](./13%20case%20study.md#case-731)

**Category**: Special Move — aerial corkscrew dive  
**Bey / Blader**: Jack / Evil Befall UW145EWD (Metal Masters)  
**Franchise Move**: Befall flies to sky in rainbow-fire aura, corkscrews down attacking with UW145. Sent Klaus into a coma via Steel Darkness clash.  
**Key Physics**: Phase 1 (aerial_ascent 600 ms): beyTiltAngle → 85° (BeySpirit z-lift via ClimbingPhysics); cannot_attack_freely within r = 180 mm. Phase 2 (spiral_dive): UW145 corkscrew multi-point contact; spinDelta = −640 rad/s; impulse 6200 eu; upwardKick 400 eu; damageMultiplier 2.6×; fire + disorientation debuffs. Clash mechanic: if inbound special spinDelta ≥ 500 in same window → both take 60% of each other's spinDelta; draw if both ≤ 0 (Klaus coma encoded). QTE "Dead Drop" 200 ms. Self-cost −220.  
**Compatible beys**: Any beyblade.  
**Engine Note**: z-lift via ClimbingPhysics; mutual-clash draw mechanic; two separate specials (730 vs 731) from same assembly — zone scatter vs dive.

---

### [Case 732 — [COMBO] Wing Slash: UW145 Upper-Approach Contact (3-key: ↑J↑)](./13%20case%20study.md#case-732)

**Category**: Combo — upper wing contact  
**Sequence**: moveUp → attack → moveUp  
**Key Physics**: Combo expression of Case 729. Phase 1 (↑): upper-angle approach positions UW145 wings above opponent plane (h = 14.5 mm advantage). Phase 2 (J): wing contact at θ = +12°; J_smash = cos(12°) × J = 0.978 × J; J_upper = 0.208 × J; spinDelta = −50 rad/s (ceiling); damageMultiplier 1.35×; lockMs 120. Phase 3 (↑): continuation at ~55% speed for next upper approach. Cost 20, attack-only.  
**Engine Note**: upper-angle approach for height advantage; lockMs from upward axis disruption; EWD stamina sustains multi-activation.

---

### [Case 733 — [GIMMICK] Beast Betromoth Heavy Hold: Hold Tip Dual-Regime Centripetal Stability and Heavy Disc Inertia Stack](./13%20case%20study.md#case-733)

**Category**: Gimmick — Hold tip dual-regime + Heavy disc  
**Parts**: Beast Betromoth Heavy Hold (Burst God Layer) — Betromoth layer [M] + Heavy disc + Hold tip [M]  
**Key Physics**: Hold tip [M]: centered regime (ω ≥ 200 rad/s) → r_eff = 0.8 mm; dω/dt = −3.5 rad/s²; spin life ≈ 171 s. Tilted regime (ω < 200 rad/s → outer rubber ring contacts): r_eff = 5.0 mm; μ = 0.42; dω/dt = −93.0 rad/s²; spin life ≈ 6.5 s (catastrophic). Hold threshold ω_hold = 200 rad/s = "point of no return". Heavy disc (Case 460): m ≈ 32 g; I_disc ≈ 3.0 × 10⁻⁶ kg·m² — reduces Δω per hit, keeps ω above ω_hold longer.  
**Engine Note**: dual-regime tip transition at ω_hold; Heavy disc I buffer against ω_hold breach; Beast Hold deliberately uses high-tilt above threshold.

---

### [Case 734 — [SPECIAL MOVE] Beast Hold: Ben Azuki / Beast Betromoth Heavy Hold](./13%20case%20study.md#case-734)

**Category**: Special Move — defensive center hold  
**Bey / Blader**: Ben Azuki / Beast Betromoth Heavy Hold (Beyblade Burst)  
**Franchise Move**: Betromoth spins in wobbly manner, takes arena center, acts as Defense Type. If it scrapes the ground, loses strength far more quickly.  
**Key Physics**: BeySpirit sets beyTiltAngle → 25° (anime override — controlled wobble above ω_hold). Position locked to arena center. Hold Mode 2500 ms: incomingDamageReduction 50%; must_attack on all opponents. Scrape risk: if spin drops below ω_hold = 200 rad/s → scrapeActive = true; additional spinDecay +89.5 rad/s²; hold_mode ends. Single big hit (spinDelta ≥ ~400) can breach ω_hold from full spin. Self-cost −80 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: controlled-wobble beyTiltAngle BeySpirit override; scrape penalty if ω_hold breached; must_attack compulsion forcing opponent engagement.

---

### [Case 735 — [COMBO] Center Guard: Hold-Mode Brace and Counter-Wobble Deflection (3-key: K↓K)](./13%20case%20study.md#case-735)

**Category**: Combo — defensive wobble brace  
**Sequence**: defense → moveDown → defense  
**Key Physics**: Combo expression of Case 733. Phase 1 (K): centered hold mode (inner point contact). Phase 2 (↓): center-pull exploiting Hold tip centripetal tendency. Phase 3 (K): hold-mode wobble contact; spinDelta = −25 rad/s; damageMultiplier 1.10×; lockMs 180 (sustained hold contact); incomingDamageReduction 25% for 180 ms. Cost 20, defense-only.  
**Engine Note**: centripetal pull as movement input; wobble deflection at moderate spinDelta; combined lockMs + damage reduction.

---

### [Case 736 — [GIMMICK] Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4: Jagged Tip Micro-Impact Evasion System in High Mode](./13%20case%20study.md#case-736)

**Category**: Gimmick — micro-impact evasion + Wave armor  
**Parts**: Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4 (Burst DB/QuadDrive) [all M or estimated]  
**Key Physics**: Jaggy-Q tip [M, Case 475 comparator]: N_teeth = 12; f_tooth = 12 × (ω / 2π) = 1146 Hz at ω = 600 rad/s; F_tooth ≈ 0.8 N; dω/dt_Low = −35.3 rad/s²; dω/dt_High = −43.3 rad/s². Ciquex-Q High Mode: CoM raised +3.5 mm → lateral micro-impact amplification κ_high = 1.4×. Wave-4 armor [M]: α_wave = 0.20 (20% lateral absorption). Combined: high-frequency micro-impulse stream enables rapid lateral evasion steps beyond normal tip friction.  
**Engine Note**: micro-impact frequency evasion model; High/Low mode CoM amplification; Wave armor partial absorption.

---

### [Case 737 — [SPECIAL MOVE] Beast Dodge: Ilya Mao / Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4](./13%20case%20study.md#case-737)

**Category**: Special Move — evasion field + counter window  
**Bey / Blader**: Ilya Mao / Magma Ifritor Ciquex-Q Jaggy-Q+Wave-4 (Burst Sparking/QuadDrive)  
**Franchise Move**: In High Mode, Jaggy-Q Tip and Wave Armor rotation avoid opposing Beyblade.  
**Key Physics**: Phase 1 (jagged_step 300 ms): BeySpirit enforces High Mode (anime override). Phase 2 (evasion_field 1500 ms): 70% base miss rate; Wave-4 deflects 20% of any hit back at attacker; cannot_be_targeted. Opponent QTE "Dodge Read" (4 ←→←→ inputs in 300 ms) breaks evasion. Phase 3 (counter_window 600 ms): counter_bonus 1.4× on Ifritor's next attack (opponent off-balance from miss). Self-cost −40 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: evasion-field miss rate; Wave-4 deflection on any landing hit; post-dodge counter bonus window.

---

### [Case 738 — [COMBO] Jagged Counter: Evasion Step and Counter-Strike (3-key: K←J)](./13%20case%20study.md#case-738)

**Category**: Combo — evasion counter  
**Sequence**: defense → moveLeft → attack  
**Key Physics**: Combo expression of Case 736. Phase 1 (K): defense brace with Wave-4 deflection α = 0.20 active. Phase 2 (←): Jaggy-Q micro-impulse lateral displacement (evasion step; opponent's committed trajectory passes through empty space). Phase 3 (J): flank counter-strike; spinDelta = −38 rad/s; damageMultiplier 1.30× (counter bonus); lockMs 70. Cost 20, attack-only.  
**Engine Note**: micro-impulse evasion as combo input; counter bonus from flanking position; player-skill expression of Beast Dodge.

---

### [Case 739 — [GIMMICK] Brave Valkyrie Evolution' 2A: Brave Ring Rubber CPs, 2A Chassis Dual-Layer Alignment, and Evolution' Rubber Dash Drive](./13%20case%20study.md#case-739)

**Category**: Gimmick — triple rubber layer alignment  
**Parts**: Brave Valkyrie Evolution' 2A (Burst Sparking/SuperKing) — Brave Ring + 2A Chassis + Evolution' tip  
**Key Physics**: Brave Ring (Case 435): C₃ rubber CPs; φ = 15°; μ = 0.55; J_smash = 0.966 × J. 2A Chassis (Case 436): rubber protrusions φ = 20°; J_2A = 0.940 × J; normal play: η_align = 1.0 (unsynced). Evolution' tip (Case 437): rubber dash; F_lat = 0.221 N; dω/dt = −55.2 rad/s²; spin life 10.9 s. At contact: Evolution' rubber floor-drag J_evo ≈ 0.30 × J_ring. BeySpirit triple-layer sync (Brave Sword): η_align_triple = 2.0×; J_total = 1.0 + 0.70 + 0.30 = 2.0 × J_ring.  
**Engine Note**: triple rubber layer sum model; Evolution' floor-drag as third impulse source; η_align_triple only under BeySpirit.

---

### [Case 740 — [SPECIAL MOVE] Brave Sword: Valt Aoi / Brave Valkyrie Evolution' 2A](./13%20case%20study.md#case-740)

**Category**: Special Move — triple rubber layer simultaneous contact  
**Bey / Blader**: Valt Aoi / Brave Valkyrie Evolution' 2A (Burst Sparking / SuperKing)  
**Franchise Move**: Valkyrie strikes with three yellow rubber blades on the Brave Ring; 2A chassis and Ring CPs align mid-battle for far heavier impact than normally possible.  
**Key Physics**: Phase 1 (alignment_charge 400 ms): Evolution' rubber F_lat = 0.221 N drives v_orb to 4.5 m/s; BeySpirit syncs all three rubber layers; cannot_attack_freely. Phase 2 (brave_sword_strike): η_align_triple = 2.0×; J_total = 2.0 × J_base; spinDelta = −600 rad/s; impulse 6400 eu; damageMultiplier 2.5×. QTE "Brave Guard" 220 ms → 50% if dodged. Self-cost −180 spinDelta.  
**Compatible beys**: Any beyblade.  
**Engine Note**: triple-layer BeySpirit sync vs normal unsynced (η = 1.0 each); rubber dash tip as both drive vehicle and impact contributor.

---

### [Case 741 — [COMBO] Valkyrie Rush: Speed-Burst Approach + Brave Ring Rubber CP Strike + Evolution' Tip Secondary Contact (3-key: ↑J→)](./13%20case%20study.md#case-741)

**Category**: Combo — dual-source rubber strike  
**Sequence**: moveUp → attack → moveRight  
**Key Physics**: Combo expression of Case 739. Phase 1 (↑): Evolution' rubber tip drive F_lat = 0.221 N, aggressive orbital approach. Phase 2 (J): dual-source contact — Source A: Brave Ring rubber CP (φ = 15°, μ = 0.55) spinDelta_ring = −50 rad/s (ceiling); Source B: Evolution' rubber floor-drag secondary (passive, separate) spinDelta_evo = −12 rad/s; combined = −62 rad/s (two independent sources, each ≤ 50). damageMultiplier 1.45×; lockMs 70. Phase 3 (→): orbit continuation. η_align = 1.0 (BeySpirit triple alignment is special-move-only). Cost 25, attack-only.  
**Engine Note**: two independent sources within individual ceiling; Evolution' floor-drag as passive secondary (not BeySpirit); Rush Launch heritage.

---

### [Case 742 — [GIMMICK] Mercury Anubius 85XF: Extreme Flat Wide-Contact Drive, Short-Track Low-CoM Impact Geometry, and Flower Pattern Orbital Mechanics](./13%20case%20study.md#case-742)

**Category**: Gimmick — XF flower orbit + 85 low-CoM tilt induction  
**Parts**: Mercury Anubius 85XF (Metal Fight Beyblade) — Mercury wheel [M] + 85 track + XF tip  
**Key Physics**: XF tip (Cases 341, 33): r_eff ≈ 3.5 mm; μ = 0.35; F_lat = 0.172 N; dω/dt = −60.0 rad/s²; spin life 10.0 s; R_curve ≈ 60 mm (tighter than F's 73 mm → higher orbital frequency). Flower pattern: tight petal-orbit at high ω; tornado stall at low ω. 85 track (Case 249): h = 8.5 mm; CoM ≈ 4.25 mm above floor (vs ~8 mm for 145-height) → every collision force acts below opponent CoM → upward-lever torque → tilt induction tendency. Mercury wheel [M]: C₄, φ ≈ 28°; J_smash = 0.883 × J.  
**Engine Note**: XF wider contact = tighter orbit radius; 85 track CoM lever-arm tilt model; short spin life requires fast combat.

---

### [Case 743 — [SPECIAL MOVE] Brave Impact: Yuki Mizusawa / Mercury Anubius 85XF](./13%20case%20study.md#case-743)

**Category**: Special Move — low-CoM orbital crash + tilt induction  
**Bey / Blader**: Yuki Mizusawa / Mercury Anubius 85XF (Metal Fight Beyblade)  
**Franchise Move**: Beyblade speeds up and crashes down on opponent with heavy impact.  
**Key Physics**: Phase 1 (speed_charge 500 ms): XF → v_orb = 4.5 m/s; E_orb = 0.506 J; Anubius spirit aura; cannot_attack_freely. Phase 2 (impact_crash): spinDelta = −480 rad/s; impulse 5000 eu; damageMultiplier 2.0×. Tilt induction: 85 track contact at h = 8.5 mm below opponent CoM → beyTiltAngle_opponent += 8° for 1500 ms; if effective stability < 0.40 → early wobble. QTE "Crash Guard" 200 ms. Self-cost −240 spinDelta (full orbital speed investment; must win with this hit).  
**Compatible beys**: Any beyblade.  
**Engine Note**: tilt induction from lever-arm geometry; heavy self-cost as match-deciding mechanic; beyTiltAngle modification special-move-only.

---

### [Case 744 — [COMBO] Flower Smash: XF Flower-Pattern Direction-Reversal Contact (3-key: ↑↓J)](./13%20case%20study.md#case-744)

**Category**: Combo — petal-reversal smash  
**Sequence**: moveUp → moveDown → attack  
**Key Physics**: Combo expression of Case 742 XF flower orbit. Phase 1 (↑): upper petal arc entry R = 60 mm. Phase 2 (↓): petal direction-reversal at R_inner ≈ 45 mm (tightest orbital moment; contact vector unpredictable). Phase 3 (J): Mercury smash at inner petal apex; φ = 28°; spinDelta = −48 rad/s (wide XF contact area spreads force, marginally below ceiling); damageMultiplier 1.35×; lockMs 55. No beyTiltAngle modification at combo scale (special-move-only). Cost 25, attack-only.  
**Engine Note**: petal direction-reversal for unpredictable contact vector; wide-contact area reduces spinDelta below ceiling; tilt induction passive only at combo scale.

---

### [Case 745 — [SPECIAL MOVE] Brave Flash: Valt Aoi / Brave Valkyrie Evolution' 2A](./13%20case%20study.md#case-745)

**Category**: Special Move — stadium-edge orbital slam  
**Bey / Blader**: Valt Aoi / Brave Valkyrie Evolution' 2A (Burst Sparking)  
**Franchise Move**: Brave Valkyrie circles stadium edge at high speed and rams into opponent with rubber blade.  
**Key Physics**: Phase 1 (edge_circuit 1000 ms): v_orb = 4.0 m/s at R_orbit ≈ 120 mm; E_orb = 0.400 J; F_centripetal = 6.67 N (wall reaction channelled as acceleration); cannot_predict_approach on target. Phase 2 (orbital_slam): single Brave Ring rubber blade (η = 1.0×, NOT triple BeySpirit); spinDelta = −380 rad/s; impulse 5200 eu; damageMultiplier 1.8×. QTE "Flash Dodge" 250 ms. Self-cost −200 spinDelta. Brave Sword (740): triple alignment η = 2.0×, −600 rad/s, 2.5×; Brave Flash: single blade, −380, 1.8× (speed vs power).  
**Compatible beys**: Any beyblade.  
**Engine Note**: edge-circuit orbital approach conceals exit angle; wall centripetal as acceleration; single-blade vs triple-blade power tier comparison.

---

### [Case 746 — [COMBO] Brave Edge-Circuit: Wall-Orbit Departure Slash (3-key: ↑→J)](./13%20case%20study.md#case-746)

**Category**: Combo — wall-orbit departure  
**Sequence**: moveUp → moveRight → attack  
**Key Physics**: Combo expression of Case 745 edge-circuit geometry. Phase 1 (↑): wall-orbit upper arc entry at R ≈ 120 mm (passive combo-level v_orb, not BeySpirit 4.0 m/s). Phase 2 (→): rightward tangent departure (arc → linear transition; unpredictable exit vector). Phase 3 (J): Brave Ring rubber blade at orbital exit apex; single layer η = 1.0×; spinDelta = −46 rad/s (orbital velocity addition; near ceiling); damageMultiplier 1.35×; lockMs 60. Cost 25, attack-only.  
**Engine Note**: orbital-to-linear exit transition as unpredictability mechanic; distinct from Valkyrie Rush (J second vs J third after full arc).

---

### [Case 747 — [GIMMICK] Quill Quetziko Jerk Press: Jerk Deflection Ratchet, Feathered Contact Blade, and Rubber Press Bit](./13%20case%20study.md#case-747)

**Category**: Gimmick — Jerk ratchet deflection + Press bit  
**Parts**: Quill Quetziko Jerk Press (Beyblade X) [all M or estimated] — Quetziko blade [M] + Jerk ratchet [M] + Press bit [M]  
**Key Physics**: Jerk ratchet [M]: C₂ asymmetric deflection tabs; φ_jerk ≈ 40°; J_deflect = sin(40°) × J = 0.643 × J (tangentially redirected); J_absorbed = cos(40°) × J = 0.766 × J (transmitted to Quetziko). Passive: attacker experiences 64% of own force returned sideways/back. Press bit [M]: r_eff ≈ 2.0 mm; μ = 0.45; F_lat = 0.177 N; dω/dt = −41.5 rad/s²; spin life 18.1 s. Quetziko blade [M]: C₄ feather-spine; φ_quill ≈ 15°; J_upper = 0.259 × J.  
**Engine Note**: passive deflection geometry (no triggered mechanism); attacker recoil exceeds received impulse; foundation for Bound Launch.

---

### [Case 748 — [SPECIAL MOVE] Bound Launch: Quon Limon / Quill Quetziko Jerk Press](./13%20case%20study.md#case-748)

**Category**: Special Move — reactive counter-deflection  
**Bey / Blader**: Quon Limon / Quill Quetziko Jerk Press (Beyblade X)  
**Franchise Move**: Quetziko deflects opponent's attack with Jerk disc and knocks them backwards.  
**Key Physics**: Phase 1 (deflect_stance 2000 ms window): BeySpirit maximises deflection efficiency; Quetzalcoatl spirit aura. Passive: any incoming attack triggers Phase 2. Phase 2 (bound_impact on attack): returned spinDelta = −360 rad/s (opponent's force + Quetziko addition, reversed); impulse 5500 eu (reversed direction); damageMultiplier 1.9× (2.2× with QTE "Counter Lance"). Quetziko self-cost: −60 spinDelta (absorbed fraction, BeySpirit-suppressed). Total self-cost −80 (preparation). Stance expires unused if no attack within 2000 ms.  
**Compatible beys**: Any beyblade.  
**Engine Note**: reactive trigger on incoming attack; reversed impulse direction; stance wasted if opponent doesn't attack; Counter Lance QTE amplifies to 2.2×.

---

### [Case 749 — [COMBO] Bound Deflect: Jerk Ratchet Direction-Reversal Counter (3-key: K→J)](./13%20case%20study.md#case-749)

**Category**: Combo — deflect-reorientation counter  
**Sequence**: defense → moveRight → attack  
**Key Physics**: Combo expression of Case 747. Phase 1 (K): guard stance; Press rubber bit grips; Jerk C₂ oriented to current approach angle. Phase 2 (→): rightward dash re-aligns steepest Jerk tab face (φ = 40°) toward opponent approach. Phase 3 (J): Jerk-face smash; spinDelta = −44 rad/s (angled face, moderate force); damageMultiplier 1.30×; lockMs 50. Passive deflection geometry only (no BeySpirit counter amplification at combo scale). Cost 25, balanced-type.  
**Engine Note**: C₂ reorientation via movement input; passive deflection physics; no BeySpirit amplification at combo level.

---

### [Case 750 — [GIMMICK] Wolborg 2: Defense Grip Base 2 Bearing Tip, Upper Wolf AR Three-Fold Recoil, and Eight Balance Mass Distribution](./13%20case%20study.md#case-750)

**Category**: Gimmick — bearing-tip dual regime + recoil AR  
**Parts**: Wolborg 2, Plastic Gen V-Force — Upper Wolf AR (Case 123a) + Eight Balance WD (Case 121a) + Right SG Bearing v2 [M] + Defense Grip Base 2 [M]  
**Key Physics**: Defense Grip Base 2 [M]: Regime 1 (tilt ≤ 15°): r_bearing ≈ 1.2 mm; μ ≈ 0.025; dω/dt = −1.41 rad/s²; spin life ≈ 355 s (theoretical). Regime 2 (tilt > 15°): outer rubber grip ring r = 19 mm; μ = 0.55 → braking torque 0.00472 N·m → resists ring-out but drains spin if persistent. Combined typical spin life ≈ 171 s. Upper Wolf AR (Case 123a): C₃ steep-slope recoil contacts (attacker recoil > received force). Eight Balance WD (Case 121a): octagonal corners +12% I.  
**Engine Note**: dual-regime tip transition at tilt threshold; bearing regime near-frictionless stamina; grip regime anti-ring-out braking.

---

### [Case 751 — [SPECIAL MOVE] Blizzalog: Tala / Wolborg 2](./13%20case%20study.md#case-751)

**Category**: Special Move — environmental field attack  
**Bey / Blader**: Tala / Wolborg 2 (Beyblade V-Force)  
**Franchise Move**: Creates gigantic blizzard; freezes stadium into icicle dome; constant cold reduces concentration and endurance of both beys and bladers. Wolborg 2 specifically immune.  
**Key Physics**: Phase 1 (vortex_spinup 1000 ms): bearing tip vortex; arctic wolf spirit. Phase 2 (dome_formation): icicle barrage AoE spinDelta = −150 rad/s; impulse 1500 eu. Field onset (20000 ms): opponent spinDecayMultiplier ×1.80 (cold stiffens tip friction); inputDelayMs +100 ms; arena surfaceFriction ×1.25. Wolborg 2 immunity: bearing operates cold-efficiently; Tala arctic-adapted → no penalties. Self-cost −80 spinDelta. AoE field-effect (special-move-only; combos cannot create arena-wide field conditions).  
**Compatible beys**: Any beyblade.  
**Engine Note**: persistent arena-field debuff model; Wolborg immunity encodes differential advantage; field duration 20000 ms is match-deciding.

---

### [Case 752 — [COMBO] Frost Whip: Defense Grip Base 2 Bearing Endurance Counter (3-key: K↑J)](./13%20case%20study.md#case-752)

**Category**: Combo — bearing hold + elevated counter-strike  
**Sequence**: defense → moveUp → attack  
**Key Physics**: Combo expression of Case 750 bearing endurance. Phase 1 (K): bearing regime locked (dω/dt = −1.41 rad/s² vs opponent non-bearing −8 to −40 rad/s²; spin gap widens during hold). Phase 2 (↑): upward drift at tilt < 15° (grip ring stays disengaged; elevated arc approach). Phase 3 (J): Upper Wolf AR C₃ recoil contact; spinDelta = −40 rad/s; damageMultiplier 1.25×; lockMs 90 (bearing-tip low friction extends physical lock duration). Cost 25, stamina-only. No spinDecayMultiplier reduction at combo scale.  
**Engine Note**: bearing hold accumulates spin gap passively; grip ring threshold guarded during drift; Upper Wolf recoil contact.

---

### [Case 753 — [GIMMICK] Brutal Lúinor 13 Jolt: Impact-Reactive Aerial Launch Tip, 13-Prong Inertia Disc, and Brutal Blade Smash Contacts](./13%20case%20study.md#case-753)

**Category**: Gimmick — Jolt impact-reactive trajectory + 13-prong disc  
**Parts**: Brutal Lúinor 13 Jolt (Burst God Layer) — Brutal Lúinor layer [M] + Forge Disc 13 [M] + Jolt tip (Case 585)  
**Key Physics**: Jolt tip (Case 585): r_eff = 4.5 mm; μ = 0.735 rubber; dω/dt = −143.3 rad/s²; spin life 4.2 s (pure rubber attack burst window). Impact-reactive launch: F_impact > 4.0 N threshold → v_z = k_jolt × (F_impact − F_threshold) / m; at F = 8.0 N → v_z = 3.0 m/s; beyTiltAngle → 60–80° (aerial trajectory for Brutal Squall dive-bomb). Forge Disc 13 [M]: 13-prong radial mass at r ≈ 18 mm; +12% inertia; high burst resistance. Brutal Lúinor layer [M]: C₄, φ ≈ 22°; J_smash = 0.927 × J.  
**Engine Note**: impact-force threshold for aerial launch; v_z launch velocity model; 4.2 s spin window for aggressive rubber attack.

---

